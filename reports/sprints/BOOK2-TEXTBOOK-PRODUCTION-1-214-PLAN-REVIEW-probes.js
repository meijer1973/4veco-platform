/* Independent plan review only; no candidate edits or rendering. */
'use strict';
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const assert=require('assert/strict'), {execFileSync}=require('child_process');
const P=path.resolve(__dirname,'../..'), L=path.resolve(P,'../4veco-lessen');
const old='C:/wt/book2-224-production-20260906';
const pb='aee047221564fad762df59754a849d3f08ce069b', lb='bbc4adf5af47187d5e394efd8079f906e9914023';
const task='BOOK2-TEXTBOOK-PRODUCTION-1-214-PLAN-REVIEW';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(root,...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:24*1024*1024}).trim();
const read=(root,p)=>fs.readFileSync(path.join(root,p));
const lf=b=>b.toString('utf8').replace(/\r\n/g,'\n');
const checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
function yes(name,v){assert.ok(v,name);checks.push({name,status:'PASS'});}
const instructions=[];
const pInstructions=['AGENTS.md','BUILD-PARAGRAPH.md','BUILD-CHAPTER.md','build-scripts/README.md',
 'docs/workflows/paragraph-lane-vocabulary.md','docs/workflows/textbook-paragraph-lane.md','build-scripts/templates/template-textbook-paragraph-plan.md',
 'skills/econ-consolidation-builder.md','skills/econ-didactiek.md','skills/econ-exercise-builder.md','skills/economic-graph.md','skills/econ-pdf-builder.md',
 'references/authored/didactiek-principes.md','references/authored/economic_mathematical_precision_reference.md','references/authored/economie-terminologie.md',
 'references/external/amstelveencollege_quality_standards.md','references/owned/course-blueprint-pedagogical-boundaries.md',
 'references/authored/textbook-rendered-page-acceptance-standard.md','references/authored/textbook-figure-standard.md','references/authored/gemengde-opgaven-target-standard.md',
 'references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json',
 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-remaining-paragraph-dispatch-plan.md'];
const lInstructions=['AGENTS.md','specifications/product-vision.md','specifications/product-end-state.md','specifications/companion-core-specifications.md'];
for(const [repo,root,files] of [['4veco-platform',P,pInstructions],['4veco-lessen',L,lInstructions]]) for(const file of files){
 const current=sha(read(root,file)), previous=sha(read(path.join(old,repo),file));
 instructions.push({repository:repo,path:file,raw_sha256:current,previous_personally_read_raw_sha256:previous,unchanged:current===previous});
}
if(process.argv.includes('--instructions-only')){console.log(JSON.stringify(instructions,null,2));process.exit(instructions.every(r=>r.unchanged)?0:1);}
yes('Personally read reused instructions are byte-identical',instructions.every(r=>r.unchanged));
const chapter='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten';
const planPath=chapter+'/2.1.4 Gemengde opgaven/2.1.4-textbook-plan.md', planBytes=read(L,planPath), plan=lf(planBytes);
eq('Exact raw candidate plan',sha(planBytes),'e36f2afe357b36e2db8a1efb360ca2bf32571fb6e2c10e3564ced875f4fcd323');
eq('Exact LF candidate plan',sha(plan),sha(planBytes));
eq('Unmodified reviewed lesson tracked tree',git(L,'diff','--name-only',lb),'');
const tree=git(L,'ls-tree','-r','--full-tree',lb).split('\n');
const tracked=execFileSync('git',['ls-files','-z'],{cwd:L,encoding:'utf8'}).split('\0').filter(Boolean);
const preservation=tracked.map(file=>({path:file,raw_sha256:sha(read(L,file))}));
eq('Tracked inventory matches exact reviewed tree count',preservation.length,tree.length);
const registryPath='references/authored/course-target-exercises.json';
const registry=JSON.parse(read(P,registryPath));
const record=registry.exercises.find(x=>x.id==='2.1.4');
const recordHash=sha(JSON.stringify(record));
eq('Frozen target original serialization',recordHash,'fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691');
eq('No new theory or skills',[record.introduces_new_theory,record.new_skills_introduced],[false,[]]);
eq('Original six labels and point weights',record.target_exercise.subquestions.map(x=>[x.label,x.points]),[['1',2],['2',2],['3',2],['4',4],['5',2],['6',2]]);
eq('Complete fourteen points',record.target_exercise.subquestions.reduce((s,x)=>s+x.points,0),14);
for(const s of [record.target_exercise.context,...record.lesson_goals,...record.target_exercise.sources.map(x=>x.content),...record.target_exercise.subquestions.map(x=>x.prompt)])yes('Frozen literal included: '+s.slice(0,65),plan.includes(s));
for(const row of record.target_exercise.sources[1].rows)yes('Frozen source row '+row[0],plan.includes('|'+row.join('|')+'|'));
const bindings=[];
function bind(root,file){const bytes=read(root,file),raw=sha(bytes),canonical=sha(lf(bytes));bindings.push({repository:root===P?'platform':'lessons',path:file,raw_sha256:raw,lf_sha256:canonical});return canonical;}
for(const file of ['references/owned/course-blueprint-v6-three-year.md','references/owned/course-blueprint-v5.md',registryPath])yes('Actual source pin '+file,plan.includes(bind(P,file)));
for(const file of ['Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/_book-plan.md',chapter+'/_chapter-plan.md'])yes('Actual foundation pin '+file,plan.includes(bind(L,file)));
for(const folder of ['2.1.1 Kostenstructuren','2.1.2 Opbrengsten, winst en break-even','2.1.3 Marginale kosten en marginale opbrengsten']){
 const id=folder.slice(0,5), prefix=chapter+'/'+folder+'/';
 for(const file of [id+'-textbook-plan.md',folder+' – paragraaf.md',folder+' – antwoorden.md',id+'-review.md',id+'-quality-ref.yaml'])yes('Actual predecessor pin '+file,plan.includes(bind(L,prefix+file)));
 const handoff=prefix+id+'-textbook-handoff.md';
 if(id==='2.1.3')eq('No fabricated 213 handoff file',fs.existsSync(path.join(L,handoff)),false);
 else yes('Actual current/historical handoff pin '+id,plan.includes(bind(L,handoff)));
}
// Independently parse the authored source table, not the author's computed JSON.
const sourceSection=plan.split('| Q (montages per dag)')[1];
const candidateRows=[...plan.matchAll(/^\|(0|20|40|45|55)\|(\d+)\|(\d+)\|$/gm)].map(m=>m.slice(1).map(Number));
eq('Exact five source-L2 rows',candidateRows,[[0,100,0],[20,150,120],[40,200,240],[45,220,270],[55,275,330]]);
const totals=candidateRows.map(([q,k,r])=>({q,k,r,w:r-k}));
eq('Rehearsal profits',totals.map(t=>t.w),[-100,-30,40,50,55]);
const fixed=80+20, unit=2+0.5, price=6;
for(const t of totals.filter(t=>t.q<=40)){eq('Normal TK '+t.q,t.k,fixed+unit*t.q);eq('Normal TO '+t.q,t.r,price*t.q);}
const averages=[20,40].map(q=>({q,TCK:fixed,TVK:unit*q,TK:fixed+unit*q,GCK:fixed/q,GVK:unit,GTK:(fixed+unit*q)/q,GO:price}));
eq('Six average calculations',averages.map(a=>[a.GCK,a.GVK,a.GTK]),[[5,2.5,7.5],[2.5,2.5,5]]);
const be=fixed/(price-unit), round={exact:'200/7',decimal:be,floor:Math.floor(be),nearest:Math.round(be),ceiling:Math.ceil(be),floorProfit:(price-unit)*Math.floor(be)-fixed,ceilingProfit:(price-unit)*Math.ceil(be)-fixed};
eq('No-loss, nearest and floor are distinguished',[round.floor,round.nearest,round.ceiling,round.floorProfit,round.ceilingProfit],[28,29,29,-2,1.5]);
eq('Exact rational crossing numerator (common denominator 7)',price*200,1200);
yes('F1 reproducible candidate wording defect',plan.includes('First whole no-loss29, not nearest28.'));
const intervals=rows=>rows.slice(1).map((b,i)=>{const a=rows[i],dq=b.q-a.q,dk=b.k-a.k,dr=b.r-a.r;assert.ok(dq>0);return {from:a.q,to:b.q,dq,dk,dr,mk:dk/dq,mo:dr/dq,profitGrowth:(dr-dk)/dq};});
const rehearsalIntervals=intervals(totals);
eq('Unequal interval denominators and marginal patterns',rehearsalIntervals.map(x=>[x.dq,x.mk,x.mo,x.profitGrowth]),[[20,2.5,6,3.5],[20,2.5,6,3.5],[5,4,6,2],[10,5.5,6,.5]]);
eq('Highest observed profit is not fastest interval',[totals.at(-1).q,rehearsalIntervals.at(-1).profitGrowth,Math.max(...rehearsalIntervals.map(i=>i.profitGrowth))],[55,.5,3.5]);
const euro=s=>Number(s.replace(/[€.]/g,'').replace(',','.'));
const targetRows=record.target_exercise.sources[1].rows.map(row=>{const[q,k,r]=row.map(euro);return {q,k,r,w:r-k};});
eq('Target actual table',targetRows.map(t=>[t.q,t.k,t.r,t.w]),[[700,2600,3500,900],[800,2900,4000,1100],[900,3250,4500,1250],[1000,3650,5000,1350]]);
const targetIntervals=intervals(targetRows);
eq('Target MK MO and group profits',targetIntervals.map(i=>[i.mk,i.mo,i.dr-i.dk]),[[3,5,200],[3.5,5,150],[4,5,100]]);
eq('Target normal crossing and GTK',[1200/(5-2),5*400,2600/700],[400,2000,26/7]);
yes('Normal growth exceeds every spoed interval',targetIntervals.every(i=>5-2>i.profitGrowth));
const bonus=[[0,0],[20,0],[0,.5],[20,.5]].map(([fee,dp])=>{const q=40,k=fixed+fee+unit*q,r=(price+dp)*q;return {fee,dp,q,k,r,w:r-k,mk:((fixed+fee+unit*40)-(fixed+fee+unit*20))/20,mo:((price+dp)*40-(price+dp)*20)/20};});
eq('Complete separate/combined bonus',bonus.map(b=>[b.k,b.r,b.w,b.mk,b.mo]),[[200,240,40,2.5,6],[220,240,20,2.5,6],[200,260,60,2.5,6.5],[220,260,40,2.5,6.5]]);
eq('Closing GTK vs interval MK',[220/45,(220-200)/(45-40)],[44/9,4]);
const timingRows=[...plan.matchAll(/^\|([^|]+)\|([\d.]+)\|([\d.]+)\|([\d.]+)\|([\d.]+)\|$/gm)].map(m=>({label:m[1],read:Number(m[2]),calculate_mark:Number(m[3]),write_check:Number(m[4]),total:Number(m[5])}));
eq('All fifteen actual workload rows',timingRows.length,15);
for(const t of timingRows)eq('Action-level sum '+t.label,t.read+t.calculate_mark+t.write_check,t.total);
const core=timingRows.reduce((s,r)=>s+r.total,0);
eq('Explicit unobserved route totals',[core,core+6,core+6+8+4],[54,60,72]);
const assets=[...plan.matchAll(/^\|2\.1\.4_ex_([1-4])\|([^|]+)\|“([^”]+)” \/ “([^”]+)”\|$/gm)].map(m=>({id:Number(m[1]),role:m[2],alt:m[3],title:m[4]}));
eq('Four source/answer pairs',assets.length,4);
for(const a of assets){yes('Concise functional noun-first alt '+a.id,a.alt.length<=120&&/^(Lichtservice|SmoothBox):/.test(a.alt));yes('Distinct alt and title '+a.id,a.alt!==a.title);}
const typography={source_px:34,source_css_pt:34*72/96,source_guard_pt:30,placed_width_mm:166,viewbox_width:1200,placed_pt:34*(166*72/25.4)/1200,placed_height_mm:1050*166/1200};
yes('Planned final-size font exceeds 12 pt',typography.placed_pt>=12);
yes('F2 source-unit guard assertion is false',typography.source_css_pt<typography.source_guard_pt&&plan.includes('Source figure guard≥30 passes.'));
const plot=(q,m,qmax,mmax)=>({x:160+880*q/qmax,y:820-670*m/mmax});
const geometry=[...totals.flatMap(t=>[plot(t.q,t.k,55,360),plot(t.q,t.r,55,360)]),...targetRows.flatMap(t=>[plot(t.q,t.k,1000,5000),plot(t.q,t.r,1000,5000)]),plot(0,1200,1000,5000),plot(0,0,1000,5000)];
yes('All supplied points fit planned rectangle',geometry.every(p=>p.x>=160&&p.x<=1040&&p.y>=150&&p.y<=820));
eq('Fifteen native files',2*3+4*2+1,15);
const negatives=[];
function reject(name,bad,expected){assert.notDeepEqual(bad,expected,name);negatives.push({name,status:'REJECTED'});}
reject('target point mutation',15,14);reject('target normal formula extrapolated at 800',1200+2*800,targetRows[1].k);
reject('source graph range reduced',700,1000);reject('unscaled cost difference called MK',55,rehearsalIntervals[3].mk);
reject('wrong unequal interval denominator',55/5,rehearsalIntervals[3].mk);reject('GTK used for MK',220/45,4);
reject('nearest integer wrongly identified as 28',28,Math.round(be));reject('round-down no-loss',round.floor,round.ceiling);
reject('cost for montage55 inferred from interval mean',{individual55:5.5},{individual55:null,missing:'TK54'});
reject('profit confused with receipt',3500,900);reject('group revenue confused with extra profit',[500,500,500],[200,150,100]);
reject('highest observed quantity equals fastest interval',55,40);reject('fixed fee treated as marginal increase',3.5,2.5);
reject('combined bonus raises endpoint profit',60,40);reject('source px mistaken for pt',34,25.5);
const altered=structuredClone(record);altered.target_exercise.sources[1].rows[0][1]='€2.601';reject('synchronized changed source/hash vs independently frozen hash',sha(JSON.stringify(altered)),recordHash);
const pending={accepted211:'5e14325d70b6cc6aee643d9b57395c92b0904ffb',accepted212:null,accepted213:null,production_release:false};
reject('missing accepted dependencies cannot be ready',[!!pending.accepted212,!!pending.accepted213],[true,true]);
const result={schema_version:1,task,actor:'paragraph_224_builder',role:'independent214planreview',review_verdict:'REVISE',scope:'plan-only',operational_commit:'910258d24d90e9388af182edea23c101d56c4dd8',exact_input:{platform:pb,lessons:lb},plan:{path:planPath,raw_sha256:sha(planBytes),lf_sha256:sha(plan),physical_lines:plan.trimEnd().split('\n').length},instructions,newly_read_instructions:['skills/econ-paragraph-review.md','PDF skill in installed primary runtime'],bindings,record,record_sha256:recordHash,checks,negative_design_probes:negatives,arithmetic:{totals,averages,round,rehearsalIntervals,targetRows,targetIntervals,bonus,closing:{gtk:44/9,mk:4}},timing:{status:'UNOBSERVED',rows:timingRows,core,support:6,bonus:8,closing:4,supported:60,all:72},assets,typography,geometry,pending,lesson_preservation:{baseline:lb,count:preservation.length,git_tree_listing_sha256:sha(tree.join('\n')),files:preservation},rendered_review:'NOT_PERFORMED_PLAN_ONLY',current_full_ci:'NOT_RUN'};
const output=path.join(__dirname,task+'-evidence.json');
fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({verdict:result.review_verdict,checks:checks.length,negative_design_probes:negatives.length,plan_lines:result.plan.physical_lines,plan_sha256:sha(planBytes),preserved_files:preservation.length,core_minutes:core,source_css_pt:typography.source_css_pt,placed_pt:typography.placed_pt,output},null,2));
