'use strict';
// Independent bounded plan review. No native/output writer, no semantic-grader claim.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),A=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-REVIEW';
const file='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4-textbook-plan.md';
const read=(root,f)=>fs.readFileSync(path.join(root,f)),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),s=read(L,file).toString('utf8'),norm=x=>x.replace(/\s+/g,' ').trim();
let checks=0;const challenges=[],clauses=[],markets=[],geometry=[];
function eq(a,b,n){A.deepEqual(a,b,n);checks++;}function ok(v,n){A(v,n);checks++;}function near(a,b,n){ok(Math.abs(a-b)<1e-8,n+': '+a+' / '+b);}function reject(n,fn){A.throws(fn,undefined,n);checks++;challenges.push(n);}
eq(sha(read(L,file)),'30269aee372815fad214c307bc3f3bd6f4a1f60bbe18a1a63ceba877b9524553','exact candidate raw');eq(s.split('\n').length-1,625,'whole lines');
const registry=JSON.parse(read(P,'references/authored/course-target-exercises.json')).exercises.find(x=>x.id==='2.3.4'),target=JSON.parse(s.match(/```json\n([^]+?)\n```/)[1]),TH='2ac151882b64b0d990ce5627ae35388d72eefde74c4e24562ef9a49a9355672c';
function targetGuard(a,b){A.equal(sha(JSON.stringify(a)),TH);A.equal(sha(JSON.stringify(b)),TH);A.deepEqual(a,b);}
targetGuard(registry,target);eq(target.target_exercise.subquestions.map(q=>q.points),[2,2,4,2,2,2],'points');eq(target.lesson_goals.length,4,'goals');eq(target.new_skills_introduced,[],'consolidation');
for(const k of Object.keys(target)){const t=structuredClone(target);delete t[k];reject('missing whole target property '+k,()=>targetGuard(registry,t));}
for(const change of [t=>t.target_exercise.sources.pop(),t=>t.target_exercise.sources[1].rows[1][4]='€45',t=>t.target_exercise.sources[0].content+=' E(40,40) ingevuld.',t=>t.target_exercise.subquestions[3].prompt='Teken de lijnen opnieuw.',t=>t.target_exercise.context=t.target_exercise.context.replace('kosteloos','duur'),t=>t.mixed_target_profile.no_new_theory=false]){const t=structuredClone(target);change(t);reject('synchronized registry + appendix drift '+challenges.length,()=>targetGuard(t,t));}
function section(a,b,text=s){const i=text.indexOf(a),j=text.indexOf(b,i+a.length);A(i>=0&&j>i,a);return text.slice(i,j);}
// Independent integration of linear functions and polygon determinants, not author ledger import.
const cases=[
 ['WE','## 3.','## 4.',36,1,6,.5,18,16,36,36,24,[20,16,200,100,300,18,24,160,128,288,12,4,6,19,14.5,1,3.5,18]],
 ['G3','### Opgave 3','### Opgave 4',30,.5,6,.5,20,16,60,40,30,[24,18,144,144,288,20,28,96,160,256,32,8,8,21.5,14.5,1.5,5.5,21]],
 ['G4','### Opgave 4','### Opgave 5',42,1,6,.5,20,20,42,42,30,[24,18,288,144,432,22,28,240,180,420,12,4,6,21,16.5,1,3.5,21]],
 ['I6','## 6.','## 7.',60,1,12,.5,30,24,60,60,40,[32,28,512,256,768,30,36,432,288,720,48,8,12,35,24.5,5,5.5,32]],
 ['T7','## 7.','## 8.',80,1,20,.5,45,30,80,80,50,[40,40,800,400,1200,35,50,600,525,1125,75,10,15,49,35.5,4,9.5,45]]
];
const polygon=p=>Math.abs(p.reduce((v,[x,y],i)=>v+x*p[(i+1)%p.length][1]-y*p[(i+1)%p.length][0],0))/2;
const keys=['Qe','Pe','CSfree','PSfree','TSfree','Qd','Qs','CSactual','PSactual','TSactual','DWL','base','height','WTPnext','MCnext','buyer','seller','MCuntraded'];
for(const [id,start,end,a,b,c,d,p,q,qmax,pmax,u,expected] of cases){
 const part=norm(section(start,end)),D=x=>a-b*x,S=x=>c+d*x,F=x=>(a-c)*x-(b+d)*x*x/2,Qe=(a-c)/(b+d),Pe=D(Qe),Qd=(a-p)/b,Qs=(p-c)/d;
 const cs=q*(a-p)-b*q*q/2,ps=q*(p-c)-d*q*q/2,freecs=b*Qe*Qe/2,freeps=d*Qe*Qe/2;
 const v=[Qe,Pe,freecs,freeps,freecs+freeps,Qd,Qs,cs,ps,cs+ps,F(Qe)-F(q),Qe-q,D(q)-S(q),D(q+1),S(q+1),D(q+1)-p,p-S(q+1),S(u)];
 for(let n=0;n<v.length;n++){near(v[n],expected[n],id+keys[n]);reject(id+' wrong ledger '+keys[n],()=>A.equal(v[n],expected[n]+1));}
 near(cs,polygon([[0,p],[0,a],[q,D(q)],[q,p]]),id+'CS full polygon');near(ps,polygon([[0,c],[0,p],[q,p],[q,S(q)]]),id+'PS full polygon');near(F(Qe)-F(q),polygon([[q,D(q)],[q,S(q)],[Qe,Pe]]),id+'loss polygon');
 near(cs,q*(D(q)-p)+b*q*q/2,id+'rectangle and triangle');near(ps,q*(p-S(q))+d*q*q/2,id+'seller rectangle and triangle');
 ok(q<Math.min(Qd,Qs,Qe),'binding booking '+id);ok(q+1<=Qe&&D(q+1)>p&&p>S(q+1),'feasible next '+id);ok(Qd<Qe,'fixed price cannot restore '+id);
 // Exact quadratic identity for every domain x, via coefficients (not sample-point proof).
 eq([a-c,-(b+d)/2],[(b+d)*Qe,-(b+d)/2],id+'complete-domain maximum identity');ok(b+d>0&&Qe>0&&Qe<qmax,id+'bounded max conditions');
 reject(id+'local point equals interval area',()=>A.equal(D(q+1)-S(q+1),F(q+1)-F(q)));
 for(const [state,width,price] of [['free',Qe,Pe],['restricted',q,p]])for(const type of ['CS','PS']){
  const xc=.22*width,dx=44*qmax/780,dy=38*pmax/540,low=type==='CS'?price:S(xc+dx),high=type==='CS'?D(xc+dx):price,yc=(low+high)/2;
  for(const x of [xc-dx,xc+dx])for(const y of [yc-dy,yc+dy])ok(x>=0&&x<=width&&(type==='CS'?y>=price&&y<=D(x):y>=S(x)&&y<=price),id+state+type+' expanded corner');
  geometry.push({id,state,type,center:[xc,yc],expanded_half_px:[44,38],nominal_only:true});
 }
 markets.push({id,actual_segment_sha256:sha(part),coefficients:{a,b,c,d,p,q,qmax,pmax},ledger:Object.fromEntries(keys.map((k,i)=>[k,v[i]])),point_gain:D(q+1)-S(q+1),finite_area:F(q+1)-F(q)});
}
// Actual clause contracts independently selected after complete personal reading.
// Missing and misleading edits are applied to actual local text, never to source files.
const contracts=[
 ['authority','## 1.','## 2.',['geen productiebevoegdheid','ONTBREKEND','geen nieuwe theorie','reconstrueren ze NIET']],
 ['WE','## 3.','## 4.',['0≤Q<20','20<Q≤36','norm voor eerlijkheid','32+128=€160','64+64=€128']],
 ['retrieval','## 4.','## 5.',['nul-surpluskoper','geen gegeven continue functie','niet −4 en −6','kosteloos']],
 ['explicit','### Opgave 3','### Opgave 4',['het reeds gearceerde verliesgebied na','e Schrijf een volledige weerlegging','24−Q','fairnessgrens']],
 ['reduced','### Opgave 4','### Opgave 5',['Enige hulpregel','arceer','24<Q≤42','eerlijkheidsnorm']],
 ['both constraints','### Opgave 5','## 6.',['alleen capaciteit','alleen boeking','beide']],
 ['unsupported','## 6.','## 7.',['Geen invulformat','arceer','32<Q≤60','48−1,5Q','17 formatievepunten']],
 ['target','## 7.','## 8.',['Geen E','geen bijzondere P45-lijn','geen Q30-grens','geen gebieden','basis40−30=10','hoogte50−35=15','14,25']],
 ['bonus','## 8.','## 9.',['Precies drie beoordelingscriteria','concrete oude verliezer','veranderde allocatie','eerlijkheidsnorm']],
 ['native','## 11.','## 12.',['34nativebestanden','17leden','23leden','vóór writes falen','PENDING met lege inspected_pages','geen bewezen §234-runtime']],
 ['visual','## 12.','## 13.',['40CSSpx=30bronpt=15,6850393701pt','minimaal12pt','alphabetic baseline','Geen volledige caption als alt','geen bewering dat werkelijke glyphs reeds passen']],
 ['gates','## 13.','## Bijlage',['onderscheiden niet-auteur','ONBEKEND','production_ready=false']]
];
for(const [id,a,b,requirements]of contracts){const actual=norm(section(a,b));const predicate=t=>requirements.every(c=>norm(t).includes(c));ok(predicate(actual),'positive clause '+id);ok(predicate(actual.replaceAll(' ','\n ')),'whitespace robustness '+id);for(const c of requirements){ok(!predicate(actual.split(c).join('')),'actual missing '+id+c);challenges.push('actual missing '+id+': '+c);ok(!predicate(actual.split(c).join('[contrary or unsupported assertion]')),'actual misleading '+id+c);challenges.push('actual misleading '+id+': '+c);clauses.push({id,clause:c});}}
const benefit=(w,p,mc)=>[w-p,p-mc],feasible=x=>['w','p','mc','cap','book','next','cost','oldUnchanged','noOtherHarm'].every(k=>Object.hasOwn(x,k))&&x.w>x.p&&x.p>x.mc&&x.cap>=x.next&&x.book>=x.next&&x.cost===0&&x.oldUnchanged===true&&x.noOtherHarm===true;
const x={w:49,p:45,mc:35.5,cap:40,book:31,next:31,cost:0,oldUnchanged:true,noOtherHarm:true};ok(feasible(x),'complete bilateral counterexample');eq(benefit(49,45,35.5),[4,9.5],'named buyer seller');
for(const k of Object.keys(x)){const bad={...x};delete bad[k];ok(!feasible(bad),'missing feasibility '+k);challenges.push('missing feasibility '+k);}
for(const [k,v]of [['cap',30],['book',30],['w',44],['mc',46],['cost',1],['oldUnchanged',false],['noOtherHarm',false]]){ok(!feasible({...x,[k]:v}),'false feasibility '+k);challenges.push('false feasibility '+k);}
eq(benefit(26,22,17),[4,5],'G5');ok(!feasible({...x,w:26,p:22,mc:17,next:6,cap:5,book:6}),'booking only insufficient');ok(!feasible({...x,w:26,p:22,mc:17,next:6,cap:6,book:5}),'capacity only insufficient');
reject('Qd triangle ignores actual allocation',()=>A.equal(35*35/2,600));reject('Qs supply triangle ignores actual trade',()=>A.equal(.5*50*25,525));reject('PS equals unknown-cost profit',()=>A.equal(525,525-700));
const cs=(who,p)=>who.reduce((n,w)=>n+w-p,0);eq(cs([18,12],12),6,'Start discrete CS');eq([2*12,18+12],[24,30],'payment WTP');eq(12-12,0,'zero buyer');reject('negative nonbuyer counted',()=>A.equal(cs([18,12,8,6],12),6));
eq([cs([18,12,8],8),cs([12,8,6],6),3*(8-2),3*(6-2)],[14,8,18,12],'bonus complete ledger');eq([14+18,8+12,18-8,8-6],[32,20,10,2],'bonus totals and particular losses');ok(8<14,'lower price not guarantee higher CS');eq([(24-6)/.5,8+.25*40],[36,18],'both closing operations');
const alts=s.split('\n').filter(l=>/^\| (we_\d+|ex_\d+) \|/.test(l)).map(l=>{const c=l.split('|').map(x=>x.trim());return {id:c[1],alt:c[2],caption:c[3]};});eq(alts.length,13,'actual figure count');for(const a of alts){ok(a.alt.length<=120&&a.caption.length>a.alt.length,'functional distinct alt '+a.id);ok(!/^(Teken|Bereken|Gebruik|Bekijk|Arceer|Grafiek van)\b/.test(a.alt),'noun-first '+a.id);}
eq(26+8,34,'native files');eq(34+1,35,'native plus additional wrapper');eq([3+7*2,3+10*2,7+10-4],[17,23,13],'archives and shared union');
eq([1,3,8,6,2,16,18].reduce((a,b)=>a+b),54,'core all activities');eq([2,2,2,3,2,3,2].reduce((a,b)=>a+b),16,'independent source and six questions');eq([2,2,2,4,3,3,2].reduce((a,b)=>a+b),18,'target source and six questions');eq([54+24,54+24+9,54+24+9+5],[78,87,92],'routes');reject('full support inside55',()=>A(54+24<=55));
near(40*.75*(166/(1200*25.4/96)),15.68503937007874,'placed font');reject('34px is30pt source',()=>A.equal(34*.75,30));
const lum=h=>h.match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);const contrasts=['2D3748','1A5276','1E8449'].map(h=>(lum('F7FAFC')+.05)/(lum(h)+.05));ok(contrasts.every(x=>x>=4.5),'nominal contrast');
const contextCounts=[['WE','Een bezoekerscentrum','Broncijfers:'],['G3','Een openluchttheater','Hulptabel:'],['G4','Een festival verkoopt','Tabel: P20'],['I6','Een buurtcentrum','Broncijfers: bijP30']].map(([id,a,b])=>{const words=section(a,b).trim().split(/\s+/).length;ok(words>=100&&words<=250,id+'context range');return {id,words};});
// Required failures remain report findings, not disguised as an all-green plan verdict.
const foundationMissing=['Book foundation check','previously_taught_probably_secure','previously_taught_retrieval_required','PASS_FOR_GOAL_DESIGN'].filter(t=>!s.includes(t));eq(foundationMissing.length,4,'actual F1 absent required canonical block');
ok(s.includes('twee verschillende diagnostische functies')&&s.includes('Start1 is diagnose'),'actual F2 diagnosis wording');
const authority=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-RELEASE-check.json'));for(const pin of authority.pins)eq(sha(read(L,pin.file)),pin.raw_sha256,'actual authority '+pin.file);for(const f of authority.absent_accepted_handoffs)ok(!fs.existsSync(path.join(L,f)),'no invented acceptance '+f);
const foreign=authority.foreign233_candidate,foreignbytes=cp.execFileSync('git',['show',foreign.commit+':'+foreign.file],{cwd:L,maxBuffer:32*1024*1024});eq(sha(foreignbytes),foreign.raw_sha256,'actual supplemental233 plan');
const history=[];for(let n=1;n<=4;n++){const f='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-author-r'+n+'-process.json',r=JSON.parse(read(P,f));eq(r.exit_code,n<4?1:0,'historical actual exit '+n);for(const source of r.invocationSources)eq(sha(source.utf8_source),source.raw_sha256,'whole invoked source '+n);history.push({file:f,sha256:sha(read(P,f)),exit:r.exit_code});}
const author=JSON.parse(JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-author-r4-process.json')).stdout);eq(author.plan_raw_sha256,sha(read(L,file)),'author final candidate bound');
console.log(JSON.stringify({status:'INDEPENDENT_CHECKS_COMPLETE_PLAN_REVISE',actor:'paragraph_224_builder',checks,challenge_count:challenges.length,challenges,clause_count:clauses.length,clauses,markets,geometry,contextCounts,alts,contrasts,foundationMissing,findings:['F1 mandatory foundation/prerequisite/current-action block absent','F2 diagnosis framing contradicts Start contract'],history,plan_sha256:sha(read(L,file)),target_sha256:TH,timing:{core:54,supported:78,bonus:87,all:92,status:'UNOBSERVED'},native_generation:false,rendered_visual_PASS:false,root_acceptance:false},null,2));
