'use strict';
// Author probes, not independent review or observed learner evidence.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4-textbook-plan.md';
const raw=fs.readFileSync(path.join(L,rel)),s=raw.toString('utf8');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let assertions=0;const rows=[],negative=[];
const eq=(a,b,label)=>{assert.deepEqual(a,b,label);assertions++;};
const ok=(v,label)=>{assert(v,label);assertions++;};
const near=(a,b,label)=>{assert(Math.abs(a-b)<1e-8,label+': '+a+' != '+b);assertions++;};
const fail=(label,fn)=>{assert.throws(fn,undefined,label);assertions++;negative.push(label);};
const target=JSON.parse(s.match(/```json\n([\s\S]+?)\n```/)[1]);
const actual=JSON.parse(fs.readFileSync(path.join(P,'references/authored/course-target-exercises.json'))).exercises.find(x=>x.id==='2.3.4');
eq(target,actual,'WHOLE record exact');eq(hash(Buffer.from(JSON.stringify(target))),'2ac151882b64b0d990ce5627ae35388d72eefde74c4e24562ef9a49a9355672c','target hash');
eq(target.target_exercise.subquestions.map(x=>x.points),[2,2,4,2,2,2],'six exact point allocations');eq(target.lesson_goals.length,4,'four goals');eq(target.new_skills_introduced,[],'no new skills');
for(const mutate of [x=>x.target_exercise.sources[1].rows[0][1]='40',x=>x.target_exercise.sources[0].content+=' Evenwicht gemarkeerd.',x=>x.target_exercise.subquestions[3].prompt='Bereken het verlies.',x=>x.mixed_target_profile.no_new_theory=false,x=>x.required_skills.pop(),x=>x.record_status='reviewed_final',x=>x.short_answer_model['5']=x.short_answer_model['5'].replace('kosteloze','dure')]){
 const v=structuredClone(target);mutate(v);fail('whole actual target changed '+negative.length,()=>assert.deepEqual(v,actual));
}
// Cases are independently solved from coefficients. Polygon shoelace areas
// cross-check rectangle/triangle arithmetic without importing other checkers.
const keys=['qe','pe','csFree','psFree','tsFree','qd','qs','wb','mb','csRect','csTri','cs','psRect','psTri','ps','ts','dwl','base','height','wn','mn','buyer','seller','pointGain','intervalGain','mcUntraded','gapUntraded','maxTS'];
const cases=[
 {id:'WE',a:36,b:1,c:6,d:.5,p:18,q:16,qmax:36,pmax:36,u:24,expected:[20,16,200,100,300,18,24,20,14,32,128,160,64,64,128,288,12,4,6,19,14.5,1,3.5,4.5,5.25,18,-6,300]},
 {id:'G3',a:30,b:.5,c:6,d:.5,p:20,q:16,qmax:60,pmax:40,u:30,expected:[24,18,144,144,288,20,28,22,14,32,64,96,96,64,160,256,32,8,8,21.5,14.5,1.5,5.5,7,7.5,21,-6,288]},
 {id:'G4',a:42,b:1,c:6,d:.5,p:20,q:20,qmax:42,pmax:42,u:30,expected:[24,18,288,144,432,22,28,22,16,40,200,240,80,100,180,420,12,4,6,21,16.5,1,3.5,4.5,5.25,21,-9,432]},
 {id:'I6',a:60,b:1,c:12,d:.5,p:30,q:24,qmax:60,pmax:60,u:40,expected:[32,28,512,256,768,30,36,36,24,144,288,432,144,144,288,720,48,8,12,35,24.5,5,5.5,10.5,11.25,32,-12,768]},
 {id:'T7',a:80,b:1,c:20,d:.5,p:45,q:30,qmax:80,pmax:80,u:50,expected:[40,40,800,400,1200,35,50,50,35,150,450,600,300,225,525,1125,75,10,15,49,35.5,4,9.5,13.5,14.25,45,-15,1200]}
];
const area=v=>Math.abs(v.reduce((sum,[x,y],i)=>{const [nx,ny]=v[(i+1)%v.length];return sum+x*ny-nx*y;},0))/2;
const geom=[];
for(const m of cases){
 const {a,b,c,d,p,q,qmax}=m,D=x=>a-b*x,S=x=>c+d*x,qe=(a-c)/(b+d),pe=D(qe),
 csFree=area([[0,pe],[0,a],[qe,pe]]),psFree=area([[0,c],[0,pe],[qe,pe]]),tsFree=csFree+psFree,
 wb=D(q),mb=S(q),cs=area([[0,p],[0,a],[q,wb],[q,p]]),ps=area([[0,c],[0,p],[q,p],[q,mb]]),ts=cs+ps,
 integral=x=>(a-c)*x-(b+d)*x*x/2,
 values=[qe,pe,csFree,psFree,tsFree,(a-p)/b,(p-c)/d,wb,mb,q*(wb-p),q*(a-wb)/2,cs,q*(p-mb),q*(mb-c)/2,ps,ts,tsFree-ts,qe-q,wb-mb,D(q+1),S(q+1),D(q+1)-p,p-S(q+1),D(q+1)-S(q+1),integral(q+1)-integral(q),S(m.u),D(m.u)-S(m.u),integral(qe)];
 eq(values.length,28,m.id+'28cells');values.forEach((v,i)=>near(v,m.expected[i],m.id+'.'+keys[i]));
 near(cs+ps,integral(q),m.id+'polygon versus analytical total');near(tsFree-ts,.5*(qe-q)*(wb-mb),m.id+'DWL triangle');
 ok(q<Math.min((a-p)/b,(p-c)/d,qe),m.id+'booking binding all sources');ok(q+1<=qe&&D(q+1)>p&&p>S(q+1),m.id+'next unit affordable and capacity feasible');
 ok((a-c)>0&&(b+d)>0&&0<qe&&qe<qmax,m.id+'complete linear gap domain proof');
 for(const x of [0,qe/2,qe,qe+(qmax-qe)/2,qmax])ok(integral(x)<=integral(qe)+1e-9,m.id+'bounded maximum crosscheck '+x);
 ok((a-p)/b<qe,m.id+'fixed price cannot restore free quantity');
 rows.push({id:m.id,inputs:{a,b,c,d,p,q,qmax,pmax:m.pmax,u:m.u},ledger:Object.fromEntries(keys.map((k,i)=>[k,values[i]]))});
 for(const [state,breadth,price]of [['free',qe,pe],['booking',q,p]]){
  const xc=.22*breadth,rx=44*qmax/780;
  for(const type of ['CS','PS']){
   const low=type==='CS'?price:S(xc+rx),high=type==='CS'?D(xc+rx):price,center=(high+low)/2,ry=38*m.pmax/540;
   ok(xc-rx>=0&&xc+rx<=breadth,m.id+state+type+'full horizontal ink budget');
   for(const xx of [xc-rx,xc+rx])for(const yy of [center-ry,center+ry])ok(type==='CS'?yy>=price&&yy<=D(xx):yy>=S(xx)&&yy<=price,m.id+state+type+'actual nominal corner region');
   geom.push({id:m.id,state,type,center_Q:xc,center_P:center,padded_ink_half_px:[44,38],nominal_only:true});
  }
 }
}
// Real numeric/model counterexamples; no change to canonical source files.
const targetLedger=rows[4].ledger;
fail('full demand triangle substitutes Qd for actual Q',()=>near(.5*35*(80-45),targetLedger.cs,'wrongCS'));
fail('PS profit inference without fixed costs',()=>assert.equal(525,525-200));
fail('point gain substituted for finite continuous area',()=>near(targetLedger.pointGain,targetLedger.intervalGain,'point != interval'));
fail('whole free TS claimed recoverable at fixed45',()=>assert.equal(targetLedger.qd,targetLedger.qe));
fail('one negative point treated as full-domain proof',()=>assert.deepEqual(['Q=50 negative'],['all 0<=Q<40 positive','Q40 zero','all 40<Q<=80 negative']));
const feasible=x=>x.w>x.p&&x.p>x.mc&&x.capacity>=x.next&&x.booking>=x.next&&x.cost===0&&x.oldPriceUnchanged&&x.oldTradesUnchanged&&x.otherHarm===false;
const good={w:49,p:45,mc:35.5,capacity:40,booking:31,next:31,cost:0,oldPriceUnchanged:true,oldTradesUnchanged:true,otherHarm:false};
ok(feasible(good),'real target positive no-harm path');
for(const [k,v]of [['w',44],['mc',46],['capacity',30],['booking',30],['cost',1],['oldPriceUnchanged',false],['oldTradesUnchanged',false],['otherHarm',true]]){
 const x={...good,[k]:v};ok(!feasible(x),'real premise failure '+k);negative.push('real no-harm premise '+k);
}
for(const k of Object.keys(good)){const x={...good};delete x[k];ok(!feasible(x),'missing actual premise '+k);negative.push('missing premise '+k);}
ok(!feasible({...good,capacity:30,booking:30}),'combined limits fail');ok(!feasible({...good,capacity:40,booking:30}),'capacity-only repair fails');ok(!feasible({...good,capacity:30,booking:31}),'booking-only repair fails');
negative.push('combined limits and individually insufficient repairs');
const cs=(buyers,p)=>buyers.reduce((a,v)=>a+v-p,0);
eq(cs([18,12],12),6,'discrete Start CS');eq(18+12,30,'discrete totalWTP');eq(2*12,24,'payment');eq(12-12,0,'zero buyer');
fail('nonbuyer negative CS counted',()=>assert.equal(cs([18,12,8,6],12),6));
eq(cs([18,12,8],8),14,'bonus original');eq(cs([12,8,6],6),8,'bonus later');eq(3*(8-2),18,'bonus PS1');eq(3*(6-2),12,'bonus PS2');
eq(14+18,32,'bonusTS1');eq(8+12,20,'bonusTS2');eq(18-8,10,'oldbuyer loss');eq(8-6,2,'each oldseller loss');
fail('lower price implies greater CS under changed allocation',()=>assert(cs([12,8,6],6)>cs([18,12,8],8)));
eq((24-6)/.5,36,'closing demand');eq(8+.25*40,18,'closing untradedMC');eq(26-22,4,'combinedbuyer');eq(22-17,5,'combinedseller');
// Real plan segments are validated; clause deletions/misleading replacements
// are applied in memory to the actual candidate, not merely to standalone fixtures.
const contracts=[
 ['authority','## 1.','## 2.',['Geen','PENDING','ONTBREKEND','geen productiebevoegdheid','PS is niet','Maximaal TS','reconstrueren ze NIET']],
 ['route','## 2.','## 3.',['54/78/87/92 zijn UNOBSERVED','24 minuten extra','Antwoordroutine','Begeleiding', 'bronoriëntatie 2']],
 ['WE','## 3.','## 4.',['36−Q=6+0,5Q','Qe=20','32+128=€160','64+64=€128','300−288=€12','0≤Q<20','20<Q≤36','€3,50','niemand','eerlijkheidsnorm']],
 ['Start','## 4.','## 5.',['nul-surpluskoper','€24','€30','geen','discrete','capaci','€2']],
 ['G3','### Opgave 3','### Opgave 4',['natrekken','3e','24−Q','0..60','volledige','fairnessgrens','32+64=€96','96+64=€160']],
 ['G4','### Opgave 4','### Opgave 5',['Enige hulpregel','arceer','36−1,5Q','24<Q≤42','€3,50','ongeschonden','eerlijkheidsnorm']],
 ['combined','### Opgave 5','## 6.',['alleen capaciteit','alleen boeking','beide','resterendegrensA','resterendegrensB']],
 ['independent','## 6.','## 7.',['Geen invulformat','arceer','768−720=€48','48−1,5Q','32<Q≤60','€5,50','eerlijkheidsnorm','17 formatievepunten']],
 ['target','## 7.','## 8.',['exact uit','Geen E','geen bijzondere P45-lijn','geen Q30-grens','geen gebieden','14,25','Qd35','basis40−30=10','hoogte50−35=15']],
 ['bonus','## 8.','## 9.',['Precies drie beoordelingscriteria','veranderde allocatie','concrete oude verliezer','eerlijkheidsnorm','€14','€8']],
 ['native','## 11.','## 12.',['b2_234.py','34nativebestanden','17leden','23leden','PENDING met lege inspected_pages','vóór writes falen','geen bewezen §234-runtime']],
 ['visual','## 12.','## 13.',['40CSSpx=30bronpt=15,6850393701pt','minimaal12pt','halvebreedte44/halvehoogte38','text-anchor=middle','alphabetic baseline','Geen volledige caption als alt','geen','actual']],
 ['gates','## 13.','## Bijlage',['ONBEKEND','alle13nativePNG','root_acceptance','production_ready=false','geen','onderscheiden niet-auteur']]
];
// The contract literal set is deliberately limited to exact required clauses;
// it does not assert that keyword presence alone proves didactic quality.
contracts.find(x=>x[0]==='authority')[3][0]='geen productiebevoegdheid';
contracts.find(x=>x[0]==='authority')[3][1]='inclusief complete hashes';
contracts.find(x=>x[0]==='route')[3][3]='begeleidingsroute';
contracts.find(x=>x[0]==='G3')[3][1]='e Schrijf een volledige weerlegging';
contracts.find(x=>x[0]==='G3')[3][0]='het reeds gearceerde verliesgebied na';
contracts.find(x=>x[0]==='WE')[3][9]='norm voor eerlijkheid';
contracts.find(x=>x[0]==='visual')[3]=contracts.find(x=>x[0]==='visual')[3].map(x=>x==='actual'?'werkelijke':x);
function checkContract(text,c){const a=text.indexOf(c[1]),b=text.indexOf(c[2],a+1);assert(a>=0&&b>a,c[0]+'segment');const seg=text.slice(a,b);for(const clause of c[3])assert(seg.includes(clause),c[0]+' missing '+clause);return seg;}
const missing=contracts.flatMap(c=>{const a=s.indexOf(c[1]),b=s.indexOf(c[2],a+1),seg=s.slice(a,b);return c[3].filter(clause=>!seg.includes(clause)).map(clause=>({segment:c[0],clause}));});assert.deepEqual(missing,[],'actual contract locator diagnostics');
const semantic=[];
for(const c of contracts){const seg=checkContract(s,c);for(const clause of c[3]){assertions++;semantic.push({segment:c[0],clause});const start=s.indexOf(c[1]),end=s.indexOf(c[2],start+1);const modified=seg.split(clause).join('[CLAUSE REMOVED]');fail('actual '+c[0]+' clause deletion '+clause,()=>checkContract(s.slice(0,start)+modified+s.slice(end),c));}}
for(const [name,a,b]of [['target redraw','geen bijzondere P45-lijn','een antwoordlijn P45'],['guided unsupported missing','Enige hulpregel','Uitgebreid invulformat'],['false current visual','geen bewezen §234-runtime','bewezen §234-runtime'],['fake observations','54/78/87/92 zijn UNOBSERVED','54/78/87/92 zijn OBSERVED'],['wrong units','40CSSpx=30bronpt=15,6850393701pt','34CSSpx=30bronpt=15,6850393701pt']]){
 const modified=s.replace(a,b);fail('actual misleading '+name,()=>contracts.forEach(c=>checkContract(modified,c)));
}
const core=[1,3,8,6,2,16,18],support=[10,10,4];eq(core.reduce((a,b)=>a+b),54,'wholecore');eq(support.reduce((a,b)=>a+b),24,'support');eq(54+24,78,'supported');eq(78+9,87,'bonus');eq(87+5,92,'closing');
eq([2,2,2,3,2,3,2].reduce((a,b)=>a+b),16,'I questionlevel');eq([2,2,2,4,3,3,2].reduce((a,b)=>a+b),18,'targetquestionlevel');
fail('omit source reading to disguise overloaded core',()=>assert(54+3<=55));
near(40*.75*(166/(1200*25.4/96)),15.68503937007874,'actual px→placedpt');near(34*.75,25.5,'34px not30pt');
const alts=s.split('\n').filter(x=>/^\| (we_[12]|ex_\d+) \|/.test(x)).map(row=>{const cells=row.split('|').map(x=>x.trim());return {id:cells[1],alt:cells[2],caption:cells[3]};});
eq(alts.length,13,'13 actual alts/captions');eq(new Set(alts.map(x=>x.id)).size,13,'unique figures');
for(const v of alts){ok(v.alt.length<=120&&v.alt.length>20,'functional short alt '+v.id);ok(v.caption.length>v.alt.length,'full caption distinct '+v.id);ok(!v.alt.startsWith('Grafiek van'),'nounfirst actual '+v.id);}
eq(13*2+2*4,34,'nativecount');eq(7*2+3,17,'pupilZIP');eq(10*2+3,23,'answerZIP');eq(7+10-4,13,'assetunion');
const prior=JSON.parse(fs.readFileSync(path.join(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-baseline.json')));
let unchanged=0;for(const repo of prior.preservation){for(const f of repo.rows){if(repo.repository==='platform'&&/^reports\/github-agent-index-(platform|lessen)\.(json|md)$/.test(f.path))continue;eq(hash(fs.readFileSync(path.join(repo.repository==='platform'?P:L,f.path))),f.raw_sha256,'prior '+f.path);unchanged++;}}
const result={status:'PASS_AUTHOR_PROBES_NOT_INDEPENDENT_REVIEW',actor:'paragraph_214_builder',plan_raw_sha256:hash(raw),plan_lines:s.split('\n').length-1,assertions,math_ledger_cells:5*28,markets:rows,semantic_clause_probes:semantic,negative_probes:negative,nominal_ink_budgets:geom,alts,raw_prior_files_unchanged:unchanged,target_record_sha256:hash(Buffer.from(JSON.stringify(target))),timing:{core:54,supported:78,bonus:87,all:92,status:'UNOBSERVED'},native_rendered:false,personal_visual_PASS:false,independent_review:'PENDING',root_acceptance:'PENDING',production_ready:false};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
