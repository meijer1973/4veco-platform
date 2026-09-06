// Independent plan arithmetic/contract/custody only; HOW TO ADAPT: new phase, new bound evidence.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-PLAN-REVIEW-ROOT';
const lb='30f57bfad2096c7afa507da48db9d82ee35a3c23',lh='d0d84a5f411c23141954090f3bc1d234e7e45cd3',author='db006571b6e784f2eb192ffcee6f8e44f0f1ad09';
const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus',chapter=book+'/2.2 Hoofdstuk Elasticiteit';
const planPath=chapter+'/2.2.4 Gemengde opgaven elasticiteit/2.2.4-textbook-plan.md';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
const plan=fs.readFileSync(path.join(L,planPath),'utf8'),checks=[];
function eq(name,actual,expected){a.deepEqual(actual,expected,name);checks.push(name);}
eq('exact reviewed plan raw SHA',hash(plan),'fcc55870ba93b18324c1f04fe61c0cd3642e0ad3dbbffe87d42de35382072257');
eq('plan has canonical LF',plan.includes('\r'),false);
eq('exact author plan bytes',plan,git(L,'show','ca3d967b68c0e6da5d6589a1b56ef082c4f672f5:'+planPath).toString());
eq('current lesson head',git(L,'rev-parse','HEAD').toString().trim(),lh);
eq('lesson clean',git(L,'status','--porcelain').toString().trim(),'');
function tree(cwd,ref){return new Map(git(cwd,'ls-tree','-r','-z',ref).toString().split('\0').filter(Boolean).map(s=>{const i=s.indexOf('\t');return[s.slice(i+1),s.slice(0,i).split(' ')[2]];}));}
const oldTree=tree(L,lb),newTree=tree(L,lh);
for(const [n,b]of oldTree)a.equal(newTree.get(n),b,n);
eq('only new lesson path',[...newTree.keys()].filter(n=>!oldTree.has(n)),[planPath]);
const imports=[];
for(const [n,b]of tree(P,author))if(n.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-PLAN-')&&!n.includes('-REVIEW-')){
 const original=git(P,'show',author+':'+n);a(fs.readFileSync(path.join(P,n)).equals(original),n);imports.push({path:n,commit:author,blob:b,raw_sha256:hash(original)});
}
eq('all nine author evidence files imported without byte changes',imports.length,9);
const record=JSON.parse(fs.readFileSync(path.join(P,'references/authored/course-target-exercises.json'),'utf8')).exercises.find(r=>r.id==='2.2.4');
eq('entire frozen target record',hash(JSON.stringify(record)),'4e0840ddf202ce4906ee05cd4dde97c0f3577885c34f0b9613ea18760aad7519');
eq('target role',[record.paragraph_kind,record.introduces_new_theory,record.record_status],['gemengde_opgaven',false,'candidate_review_ready']);
eq('point vector',record.target_exercise.subquestions.map(r=>r.points),[2,2,2,4,2,2]);
function segment(text,start,end){const i=text.indexOf(start);a(i>=0,start);const j=text.indexOf(end,i+start.length);a(j>i,end);return text.slice(i+start.length,j);}
function tableRows(text){return text.split('\n').filter(l=>l.startsWith('|')).filter(l=>!/^\|[-: |]+\|$/.test(l)).map(l=>l.slice(1,-1).split('|').map(s=>s.trim()));}
function validateCandidate(text){
 const target=segment(text,'### Exact StreamPlus target payload','### B1:');
 a(target.includes(record.target_exercise.context),'target context');
 for(const g of record.lesson_goals)a(text.includes(g),'goal '+g);
 for(let i=0;i<record.target_exercise.sources.length;i++){
  const source=record.target_exercise.sources[i],end=i<3?'**'+record.target_exercise.sources[i+1].id+'**':'| Trace |';
  const section=segment(target,'**'+source.id+'**',end);a(section.includes(source.content),source.id+' content');
  if(source.columns)a.deepEqual(tableRows(section),[source.columns,...source.rows],source.id+' exact table');
 }
 const qs=tableRows(segment(target,'| Trace | Points | Exact question |','Exactly6 questions'));
 a.deepEqual(qs,record.target_exercise.subquestions.map((q,i)=>['T'+(i+1)+' /'+q.label,String(q.points),q.prompt]),'exact six question rows');
 const bonus=segment(text,'### B1:','### Closing retrieval');
 for(const s of ['Identifies both changed inputs','controlled200→220','Pc-only204','Bounds the claim','No scaffold.'])a(bonus.includes(s),'bonus '+s);
 const support=segment(text,'### Optional source-reading support','### Exact StreamPlus target payload');
 for(const s of ['clearly skippable','−20% is worked only','R2: lighter hint','R3/R4: only','R5: minimal reset cue','R6 and all target questions: no task-specific'])a(support.includes(s),'fading '+s);
 const headings=segment(text,'Planned pupil H2 sequence:','The opening says').trim().split('\n').filter(Boolean);
 a.deepEqual(headings,['1. Aanpak en korte herinnering','2. Opgave 1 — Sterrenplek','3. Hulp bij het lezen van bronnen (optioneel)','4. Doeloefening — StreamPlus','5. Denkertje / Bonusopgave','6. Herhaling / Herhaling en interleaving']);
 const prose=text.toLowerCase().replace(/\s+/g,' ');
 for(const s of ['No paragraaf edition','No ZIP','before any output mkdir','accepted current §223 dependencies','separate immutable production-input','not divided12','not coefficient0.005','No target graph is added.'])a(prose.includes(s.toLowerCase()),'boundary '+s);
 return true;
}
eq('independent parsed candidate contract',validateCandidate(plan),true);
const mutations=[
 ['target source cell',s=>s.replace('| abonnees | 50.000 | 43.000 |','| abonnees | 50.000 | 42.000 |')],
 ['target source heading',s=>s.replace('**bron-c**','**bron-z**')],
 ['target source annual units',s=>s.replace(record.target_exercise.sources[3].content,record.target_exercise.sources[3].content.replace('jaarinkomen','maandinkomen'))],
 ['target selection changed to mandatory calculation',s=>s.replace(record.target_exercise.subquestions[0].prompt,'Bereken Ev en selecteer daarna de gegevens.')],
 ['target extra question',s=>s.replace('Exactly6 questions','| T7 /7 |2|Bereken Ei met bron D.|\nExactly6 questions')],
 ['target subtotal drift',s=>s.replace('| T4 /4 |4|','| T4 /4 |3|')],
 ['target advice weakened',s=>s.replace(record.target_exercise.subquestions[5].prompt,record.target_exercise.subquestions[5].prompt.replace('precies twee','een of meer'))],
 ['goal omitted',s=>s.replace(record.lesson_goals[3],'Doel ontbreekt.')],
 ['bonus controlled-comparison criterion omitted',s=>s.replace('controlled200→220','uncontrolled200→224')],
 ['bonus supplied-outcome comparison omitted',s=>s.replace('Pc-only204 comparison','omitted comparison')],
 ['support mandatory',s=>s.replace('clearly skippable','mandatory')],
 ['fading terminal independent route removed',s=>s.replace('R6 and all target questions: no task-specific','R6 and all target questions: mandatory task-specific')],
 ['theory edition introduced',s=>s.replace('No paragraaf edition','A third paragraaf edition')],
 ['speculative prerequisite release',s=>s.replace('accepted current §223 dependencies','future unverified §223 dependencies')],
 ['bonus lacks model limit',s=>s.replace('Bounds the claim','Generalizes the claim')]
];
const rejected=[];
for(const[name,change]of mutations){const changed=change(plan);a.notEqual(changed,plan,name+' mutation applied');a.throws(()=>validateCandidate(changed),undefined,name);rejected.push(name);}
eq('actual plan-text negative cases rejected',rejected.length,15);

// Independently recompute with exact rational arithmetic, not author constants/helpers.
const gcd=(a,b)=>b?gcd(b,a%b):a<0n?-a:a;
function fraction(n,d=1n){n=BigInt(n);d=BigInt(d);a.notEqual(d,0n);if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return[n/g,d/g];}
const ratio=(x,y)=>fraction(x[0]*y[1],x[1]*y[0]);
const pct=(old,now)=>fraction(100*(now-old),old);
const label=r=>r[1]===1n?String(r[0]):r[0]+'/'+r[1];
const results={};
function rational(name,value,expected){const s=label(value);eq(name,s,expected);results[name]=s;}
rational('R1 quantity percent',pct(100,80),'-20');rational('R1 price percent',pct(20,22),'10');
rational('R1 Ev',ratio(pct(100,80),pct(20,22)),'-2');
eq('R1 matched weekly TO',[20*100,22*80],[2000,1760]);rational('R1 TO percent',pct(20*100,22*80),'-12');
rational('R2 interval Ev',ratio(pct(100,60),pct(10,15)),'-4/5');
eq('R2 matched weekly TO',[10*100,15*60],[1000,900]);rational('R2 TO percent',pct(1000,900),'-10');rational('R2 finite product',fraction(15*60,10*100),'9/10');
rational('R3 Ei',fraction(5,10),'1/2');rational('R4 complementary Ek',ratio(pct(200,180),pct(20,24)),'-1/2');
function q(px,pc,annual){return fraction(20000-400*px+200*pc+annual,200);}
for(const[name,args,value]of[['R5 baseline',[10,20,20000],'200'],['R5 Y only',[10,20,24000],'220'],['R5 reset Pc only',[10,24,20000],'204'],['B1 both',[10,24,24000],'224']])rational(name,q(...args),value);
rational('R5 derived Ei',ratio(pct(200,220),pct(20000,24000)),'1/2');
eq('B1 controlled income and other-price contributions',[220-200,204-200,224-200],[20,4,24]);
rational('T1 answer-only control',ratio(pct(50000,43000),pct(10,12)),'-7/10');
eq('T3 exact observed totals',[10*50000,12*43000],[500000,516000]);
rational('T4 luxury Ei',fraction(15,8),'15/8');rational('T4 inferior Ei',fraction(-4,8),'-1/2');rational('T4 competing price percent',pct(8,9),'25/2');rational('T4 named-good Ek',ratio(fraction(5),pct(8,9)),'2/5');
eq('T5 annual Q, no new elasticity question',[12000-400*12+40000/10+300*10,12000-400*12+42000/10+300*10],[14200,14400]);
rational('C1 reverse percentage',pct(25,20),'-20');rational('C2 Ev',fraction(-5,10),'-1/2');a.throws(()=>fraction(-5,0));
const classifyEi=x=>x<0?'inferieur':x===0||x===1?'grens':x<1?'normaal':'luxe';
eq('all disjoint Ei classes/boundaries',[-.5,0,.5,1,1.875].map(classifyEi),['inferieur','grens','normaal','grens','luxe']);
// Independent local sign witness, not a new student point-elasticity formula.
const localWitness=[];for(const magnitude of [.5,2])for(const dp of [.0001,-.0001]){const factor=(1+dp)*(1-magnitude*dp);localWitness.push(Math.sign(factor-1));}
eq('R6 all four local direction signs',localWitness,[1,-1,-1,1]);
const counterexamples=[
 ['wrong new-base denominator',label(pct(100,80)),label(fraction(-2000,80))],
 ['finite additive shortcut',label(fraction(900,1000)),label(fraction(100+50-40,100))],
 ['wrong telescope price source',label(ratio(pct(200,180),pct(20,24))),label(ratio(pct(200,180),pct(20,22)))],
 ['Ei coefficient',label(fraction(1,2)),label(fraction(5,1000))],
 ['unreset Pc comparison',204,224],['Y divided by twelve',14200,12000-4800+(40000/12)/10+3000],
 ['regional Q as observed total',14200,43000],['absolute Ei sign lost',classifyEi(-.5),classifyEi(.5)],
 ['ratio reversed',label(fraction(2,5)),label(fraction(5,2))],['reverse 25percent instead of20',label(pct(25,20)),'-25'],
 ['uncontrolled attribution',224-200,220-200],['coefficient income unit lost',label(q(10,20,20000)),label(q(10,20,24000))]
];for(const[name,x,y]of counterexamples)a.notEqual(x,y,name);
eq('twelve independent mathematical wrong-result witnesses',counterexamples.length,12);

const timing=tableRows(segment(plan,'| Item | Read | Calculate | Mark/read graph | Write | Check | Transition | Total |','Core=48.5minutes'));
eq('complete authored timing rows',timing.length,16);
for(const row of timing)eq('time subtotal '+row[0],row.slice(1,7).map(Number).reduce((s,n)=>s+n,0),Number(row[7]));
const authorCore=timing.reduce((s,row)=>s+Number(row[7]),0);eq('authored full core',authorCore,48.5);
const reviewerTimes=[2.5,5,5,3,3.5,7,4,2.5,1.5,1.5,2,5,3,4,2.5,1.5];
const reviewerCore=reviewerTimes.reduce((s,n)=>s+n,0);eq('reviewer full desk budget',reviewerCore,53.5);a(reviewerCore<=55);
const rectangles=[[100,100,20],[700,80,22],[100,100,10],[700,60,15]].map(([x,Q,price])=>({x0:x,x1:x+3*Q,y0:630-16*price,y1:630,Q,price,TO:Q*price,pixel_area:3*Q*16*price}));
eq('all four rectangle bounds',rectangles.map(r=>[r.x0,r.x1,r.y0,r.y1]),[[100,400,310,630],[700,940,278,630],[100,400,470,630],[700,880,390,630]]);
for(const r of rectangles)eq('pixel area scale '+r.Q+'/'+r.price,r.pixel_area/48,r.TO);
eq('maintained figure aspect at166mm',900*166/1200,124.5);
const placedPt=40*166/1200*72/25.4;a(placedPt>=12);eq('source CSS font point conversion',40*72/96,30);
const titles=[...plan.matchAll(/ex[1-4] ‘([^’]+)’/g)].map(m=>m[1]);eq('four functional short figure alternatives',titles.length,4);for(const title of titles)a(title.length<=120);
const nativeFiles=['opgaven','antwoorden'].flatMap(k=>['md','html','pdf'].map(ext=>'2.2.4 Gemengde opgaven elasticiteit – '+k+'.'+ext));
nativeFiles.push('build_pdf.py');for(let i=1;i<=4;i++)for(const ext of ['svg','png'])nativeFiles.push('_assets/2.2.4_ex_'+i+'.'+ext);
eq('native two-edition inventory',nativeFiles.length,15);
const prerequisitePins=[];
for(const dir of ['2.2.1 Prijselasticiteit','2.2.2 Elasticiteit en omzet','2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit']){
 const id=dir.slice(0,5);for(const name of [id+'-textbook-plan.md',id+'-review.md',id+'-quality-ref.yaml',id+'-textbook-handoff.md',dir+' – paragraaf.md',dir+' – antwoorden.md']){const n=chapter+'/'+dir+'/'+name,full=path.join(L,n);prerequisitePins.push(fs.existsSync(full)?{path:n,raw_sha256:hash(fs.readFileSync(full))}:{path:n,status:'ABSENT; not accepted input'});}
}
const result={status:'PLAN TECHNICAL PASS',reviewer:'codex-root',author:'paragraph_224_builder',plan_sha256:hash(plan),lesson_base:lb,lesson_head:lh,preserved_lesson_blob_count:oldTree.size,imports,checks,target_record:record,actual_plan_text_mutations_rejected:rejected,exact_rational_results:results,mathematical_counterexamples:counterexamples,authored_timing:timing,reviewer_timing:timing.map((r,i)=>({item:r[0],minutes:reviewerTimes[i]})),timing:{author_core:authorCore,reviewer_core:reviewerCore,reviewer_supported:reviewerCore+10,reviewer_all:reviewerCore+18,observed:false},geometry:{rectangles,placed_pt:placedPt,actual_ink_and_render:'NOT RUN; future gate'},titles,native_files:nativeFiles,prerequisite_pins:prerequisitePins,production_release:'PENDING actual accepted223 + immutable release',student_visual_and_classroom_acceptance:'NOT CLAIMED'};
fs.writeFileSync(path.join(__dirname,prefix+'-check.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,checks:checks.length,negative_plan_cases:rejected.length,math_counterexamples:counterexamples.length,unchanged_lesson_blobs:oldTree.size,author_imports:imports.length,timing:result.timing,placed_pt:placedPt},null,2));
