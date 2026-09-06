/* Design-only arithmetic and immutable input binding. No pupil generation. */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const {execFileSync} = require('child_process');
const platform = path.resolve(__dirname, '../..');
const lessons = path.resolve(platform, '../4veco-lessen');
const chapter = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten';
const folders = ['2.1.1 Kostenstructuren','2.1.2 Opbrengsten, winst en break-even','2.1.3 Marginale kosten en marginale opbrengsten'];
const planPath = chapter + '/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md';
const sha = x => crypto.createHash('sha256').update(x).digest('hex');
const lf = x => x.replace(/\r\n/g, '\n');
const git = (cwd,...args) => execFileSync('git', args, {cwd, encoding:'utf8'}).trim();
let checks = 0;
const equal = (a,b) => {assert.deepEqual(a,b); checks++;};
const ok = a => {assert.ok(a); checks++;};
const bindings = [];
function bind(root, file, expected) {
  const bytes = fs.readFileSync(path.join(root,file));
  const digest = sha(lf(bytes.toString('utf8')));
  if (expected) equal(digest, expected);
  bindings.push({repository:root===platform?'platform':'lessons',path:file,raw_sha256:sha(bytes),lf_sha256:digest});
  return digest;
}
bind(platform,'references/owned/course-blueprint-v6-three-year.md','72fb1bc8c7b4843ac5cf4c29acfb9d117b6118eeaa1cd5fe5229604dfe412e6e');
bind(platform,'references/owned/course-blueprint-v5.md','61130f10e7b8b6417641436f0995be090db04b11075d02878ae0a51c12b497c7');
bind(platform,'references/authored/course-target-exercises.json','d3d7163ad82e0ddcf2f9ae1cbfa653335c96cb46762e8125bd594583f5d5885e');
bind(lessons,'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/_book-plan.md','b6ae8e07e05337838dc38b2838a6e5db43b2e153569fa5bc490cf4bfeb8d7a76');
bind(lessons,chapter+'/_chapter-plan.md','ef3f872f5caa2de1359639983d8e4907a34cfcbc80a0309826cff07201e49116');
const expected = [
 ['f46c7aa444ba6fef1f6f885b34bd52963fccac3cdc7b13b898eb6665219c4cd0','de7abc910f6ec940eb329abd003085921f32409956ec1e0450bcc4a5454eb6b5','f7572e3d4f2fc5bc092562eb06e76ebb0480fbbc8aa1ea01d3752a7251cbbdc9','a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023','c85c44a53d46af87ad61500b83b0fd721fac43c97ffd1be3d512308158a4b9f5','0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f'],
 ['5e1d318dd1b841467ca297d67956304d1861e3eb68d1df56cc4d32f6434d34a4','9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8','4ffcb70c96f2c0c178a06a6092ec6701c4323cc1ac697de4156bc7cf0d43b8b3','79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7','e168e3c2b8698d12b699fbf60e7691fbbc8a15d61bd46a7988704d3c896c805c','de2b8ed7dcc7a3c5c6eaac400892d2d37ac5212ccb3b9972fb004115a88c1fe2'],
 ['4cf29ff1e70953f6d1f8399a65d63ad37031e6a129804ad555442bfb98624234','358090428ee7b69a4a3eea61a672b390d7d185522541783f32981f435b85d94d','2059f580ad2fd3fe723b60b8ec0175940fbafa5f93afd94ed0bc29952f55940f','5064642034fac9763202d2424b87cef2f7cc909aaf3a6031b90d247ee44409c3','c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f']
];
folders.forEach((folder,i)=>{
 const id=folder.slice(0,5), prefix=chapter+'/'+folder+'/';
 const files=[id+'-textbook-plan.md',folder+' – paragraaf.md',folder+' – antwoorden.md',id+'-review.md',id+'-quality-ref.yaml',id+'-textbook-handoff.md'];
 expected[i].forEach((pin,j)=>bind(lessons,prefix+files[j],pin));
 if(i===2)equal(fs.existsSync(path.join(lessons,prefix+files[5])),false);
});
const plan=lf(fs.readFileSync(path.join(lessons,planPath),'utf8'));
const planHash=bind(lessons,planPath);
const registry=JSON.parse(fs.readFileSync(path.join(platform,'references/authored/course-target-exercises.json'),'utf8'));
const record=registry.exercises.find(r=>r.id==='2.1.4');
equal(sha(JSON.stringify(record)),'fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691');
equal(record.record_status,'candidate_review_ready');
equal(record.paragraph_kind,'gemengde_opgaven');
equal(record.introduces_new_theory,false);
equal(record.new_skills_introduced,[]);equal(record.missing_units_flagged,[]);
equal(record.target_exercise.subquestions.map(q=>q.label),['1','2','3','4','5','6']);
equal(record.target_exercise.subquestions.map(q=>q.points),[2,2,2,4,2,2]);
equal(record.target_exercise.subquestions.reduce((a,q)=>a+q.points,0),14);
for(const s of [record.target_exercise.context,...record.lesson_goals,...record.target_exercise.sources.map(s=>s.content),...record.target_exercise.subquestions.map(q=>q.prompt)])ok(plan.includes(s));
for(const row of record.target_exercise.sources[1].rows)ok(plan.includes('|'+row.join('|')+'|'));
// Independently derive the rehearsal from its four components, not root notes.
const fixed=80+20, variable=2+0.5, price=6;
const normal=q=>({Q:q,TCK:fixed,TVK:variable*q,TK:fixed+variable*q,TO:price*q,W:price*q-(fixed+variable*q)});
const rehearsal=[normal(0),normal(20),normal(40),{Q:45,TK:220,TO:270,W:270-220},{Q:55,TK:275,TO:330,W:330-275}];
equal(rehearsal.map(r=>[r.Q,r.TK,r.TO,r.W]),[[0,100,0,-100],[20,150,120,-30],[40,200,240,40],[45,220,270,50],[55,275,330,55]]);
const average=[20,40].map(q=>{const n=normal(q);return {Q:q,GCK:n.TCK/q,GVK:n.TVK/q,GTK:n.TK/q,GO:n.TO/q};});
equal(average,[{Q:20,GCK:5,GVK:2.5,GTK:7.5,GO:6},{Q:40,GCK:2.5,GVK:2.5,GTK:5,GO:6}]);
const be=fixed/(price-variable), first=Math.ceil(be);
equal(be,200/7);equal(first,29);equal(normal(first-1).W,-2);equal(normal(first).W,1.5);
function intervals(rows){return rows.slice(1).map((end,i)=>{const start=rows[i],dQ=end.Q-start.Q,dTK=end.TK-start.TK,dTO=end.TO-start.TO,dW=end.W-start.W;ok(dQ>0);equal(dW,dTO-dTK);return {from:start.Q,to:end.Q,dQ,dTK,dTO,dW,MK:dTK/dQ,MO:dTO/dQ,growth:dW/dQ,right_endpoint:end.Q};});}
const ri=intervals(rehearsal);
equal(ri.map(r=>[r.dQ,r.MK,r.MO,r.growth]),[[20,2.5,6,3.5],[20,2.5,6,3.5],[5,4,6,2],[10,5.5,6,0.5]]);
// Read the actual frozen source table, parsing its written euro/grouping form.
const euro=s=>Number(s.replace(/[€.]/g,'').replace(',','.'));
const sr=record.target_exercise.sources[1].rows.map(row=>{const [Q,TK,TO]=row.map(euro);return {Q,TK,TO,W:TO-TK};});
const si=intervals(sr);
equal(sr.map(r=>r.W),[900,1100,1250,1350]);
equal(si.map(r=>[r.dQ,r.MK,r.MO,r.growth,r.dW]),[[100,3,5,2,200],[100,3.5,5,1.5,150],[100,4,5,1,100]]);
const targetNormal=q=>({Q:q,TK:1200+2*q,TO:5*q,W:5*q-(1200+2*q)});
equal(targetNormal(700),{Q:700,TK:2600,TO:3500,W:900});
const targetBE=1200/(5-2);
equal(targetBE,400);equal(targetNormal(targetBE).W,0);
equal(targetNormal(700).TK/700,26/7);
equal((targetNormal(700).W-targetNormal(targetBE).W)/(700-targetBE),3);
ok(si.every(i=>i.growth<3));
// No per-unit inference from the extra rehearsal interval: compatible totals.
const singleUnitCounterexamples=[{TK54:269,TK55:275,lastUnitCost:6},{TK54:273,TK55:275,lastUnitCost:2}];
singleUnitCounterexamples.forEach(x=>{equal(x.TK55-x.TK54,x.lastUnitCost);ok(x.TK54>=220&&x.TK54<=275);});
const bonus=[{name:'base',fee:0,p:6},{name:'fee',fee:20,p:6},{name:'price',fee:0,p:6.5},{name:'both',fee:20,p:6.5}].map(x=>({...x,TK:normal(40).TK+x.fee,TO:x.p*40,W:x.p*40-(normal(40).TK+x.fee),MK:((normal(40).TK+x.fee)-(normal(20).TK+x.fee))/20,MO:(x.p*40-x.p*20)/20}));
equal(bonus.map(r=>[r.TK,r.TO,r.W,r.MK,r.MO]),[[200,240,40,2.5,6],[220,240,20,2.5,6],[200,260,60,2.5,6.5],[220,260,40,2.5,6.5]]);
const closing={GTK:220/45,MK:(220-200)/(45-40),GTK_exact:'44/9',MK_interval:[40,45]};equal(closing.GTK,44/9);equal(closing.MK,4);
const timing={orientation:1,rehearsal:[5,6,6,3,5,3],transition:2,target_sources:2,target:[2,3,2,5,6,3],support:6,bonus:8,closing:4,status:'UNOBSERVED'};
timing.core=timing.orientation+timing.rehearsal.reduce((a,b)=>a+b,0)+timing.transition+timing.target_sources+timing.target.reduce((a,b)=>a+b,0);
timing.supported=timing.core+timing.support;timing.all_printed=timing.supported+timing.bonus+timing.closing;
equal([timing.core,timing.supported,timing.all_printed],[54,60,72]);ok(timing.core<=55);
const assetBases=[1,2,3,4].map(n=>'2.1.4_ex_'+n);
assetBases.forEach(s=>{ok(/^2\.1\.4_(fig|ex|we)_\d+$/.test(s));ok(plan.includes(s));});
const widthPt=166*72/25.4,placedFont=34*widthPt/1200;
ok(placedFont>=12);equal(6+assetBases.length*2+1,15);
const transform=(q,m,qMax,mMax)=>({x:160+880*q/qMax,y:820-670*m/mMax});
const targetPoints=[targetNormal(0),...sr].map(r=>({Q:r.Q,TK:transform(r.Q,r.TK,1000,5000),TO:transform(r.Q,r.TO,1000,5000)}));
for(const row of targetPoints)for(const key of ['TK','TO']){ok(row[key].x>=160&&row[key].x<=1040);ok(row[key].y>=150&&row[key].y<=820);}
const evidence={schema_version:1,kind:'builder_design_evidence_only',status:'PASS',checks,
 task:'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN',actor:'paragraph_214_builder',
 start_pair:{platform:'572d1ea2ededaffd28afc44eeeca223252a58ec5',lessons:'d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f'},
 observed_heads:{platform:git(platform,'rev-parse','HEAD'),lessons:git(lessons,'rev-parse','HEAD')},
 plan:{path:planPath,lf_sha256:planHash},bindings,frozen_record:record,
 rehearsal:{components:{fixed,variable,price},rows:rehearsal,averages:average,break_even:{Q:be,Q_exact:'200/7',money_exact:'1200/7',first_whole:first,neighbors:[normal(28),normal(29)]},intervals:ri,single_unit_counterexamples:singleUnitCounterexamples},
 target:{rows:sr,normal:[targetNormal(0),targetNormal(targetBE),targetNormal(700)],intervals:si,GTK700_exact:'26/7',normal_growth:3,positive_fastest_range:'400<Q<=700; 400 boundary has zero distance'},bonus,closing,timing,
 planned_geometry:{viewBox:[0,0,1200,1050],width_mm:166,width_pt:widthPt,min_font_px:34,min_placed_pt:placedFont,plot:[160,150,1040,820],targetPoints,assets:assetBases,native_count:15,actual_ink_measurement:'NOT_RUN_PLAN_ONLY; required after native font/layout exists',rendered_visual_verdict:'NOT_RUN'},
 prerequisites:{'211':'ACCEPTED_R5_WITH_FLAGS','212':'R7_PARAGRAPH_REVIEWED; S1/current QC/root successor handoff pending','213':'R7_PARAGRAPH_REVIEWED; accepted212 succession/current QC/root handoff pending'},
 production_release:'PENDING_INDEPENDENT_PLAN_AND_CURRENT_ACCEPTED_PREREQUISITES_AND_ROOT_RELEASE',claims_excluded:['pupil_generation','independent_review','QC','rendered_visual_acceptance','classroom_observation','full_CI','PR_merge']};
const out=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-evidence.json');
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',checks,plan_sha256:planHash,record_sha256:sha(JSON.stringify(record)),core_minutes:timing.core,planned_placed_font_pt:placedFont,evidence:out},null,2));
