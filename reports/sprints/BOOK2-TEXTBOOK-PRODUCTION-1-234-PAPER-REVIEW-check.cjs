'use strict';
// HOW TO ADAPT: bounded independent evidence, not a production or semantic-authority gate.
// Change subject only under a new reviewed assignment; immutable Git blobs are authority.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),A=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const pre='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PAPER-REVIEW-';
const BP='30e42c450774d3600d9fe1f14002eefae670a8b0',BL='56bb0f1e4f45b844304895cbbc3aee8770ec0829';
const OLD='e90d5c122a44fb0fd547339cf48558680cbc6ace',branch='agent/book2-234-paper-review-20260906';
const PLAN='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4-textbook-plan.md';
const PLANHASH='12d81b83f9be50ebdcf3460ce7ad60d2de5a788cb3da8d3a046c1449112922ea',OLDHASH='4b792ab6e6038165e7e1f9509699b23199f4592767de3e511ceb89e13331412a';
const TARGETHASH='2ac151882b64b0d990ce5627ae35388d72eefde74c4e24562ef9a49a9355672c';
const indexes=['platform','lessen'].flatMap(n=>['json','md'].map(e=>`reports/github-agent-index-${n}.${e}`));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const read=(r,f)=>fs.readFileSync(path.toNamespacedPath(path.join(r,f)));
const git=(r,...args)=>cp.execFileSync('git',args,{cwd:r,maxBuffer:128*1024*1024});
const txt=(r,...a)=>git(r,...a).toString('utf8').trim();
const save=(name,value)=>fs.writeFileSync(path.join(P,pre+name+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const norm=s=>s.replace(/\r\n/g,'\n');
const segment=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i+a.length);A(i>=0&&j>i,`segment ${a}`);return s.slice(i,j);};
function tree(r,ref){const raw=git(r,'ls-tree','-r','-z',ref);return{raw,rows:raw.toString('utf8').split('\0').filter(Boolean).map(x=>{const [meta,f]=x.split('\t');const [mode,type,oid]=meta.split(' ');A.equal(type,'blob');return{path:f,mode,oid};})};}
function compact(r,ref,skipIndexes=true){
 const t=tree(r,ref),rows=t.rows.filter(x=>!(r===P&&skipIndexes&&indexes.includes(x.path)));
 const process=cp.spawnSync('git',['-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths'],{cwd:r,input:rows.map(x=>JSON.stringify(x.path)).join('\n')+'\n',encoding:'utf8',maxBuffer:128*1024*1024});
 A.equal(process.status,0,process.stderr);const ids=process.stdout.trim().split(/\r?\n/);A.equal(ids.length,rows.length);
 const records=crypto.createHash('sha256'),bytes=crypto.createHash('sha256');let total=0;
 for(let i=0;i<rows.length;i++){const f=rows[i];A.equal(ids[i],f.oid,'raw Git identity '+f.path);const b=read(r,f.path);total+=b.length;records.update(JSON.stringify([f.path,f.mode,f.oid,b.length,hash(b)])+'\n');bytes.update(Buffer.from(f.path+'\0'+b.length+'\0'));bytes.update(b);}
 return{ref,tree:txt(r,'rev-parse',ref+'^{tree}'),tracked_files:t.rows.length,verified_files:rows.length,bytes:total,nul_tree_sha256:hash(t.raw),nul_names_sha256:hash(Buffer.from(t.rows.map(x=>x.path).join('\0')+'\0')),raw_record_digest_sha256:records.digest('hex'),framed_raw_bytes_sha256:bytes.digest('hex'),exceptions:r===P&&skipIndexes?indexes:[],raw_git_all_match:true};
}
function selected(){
 const old=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-REVIEW-baseline.json'));
 const inputs=old.instructions.map(x=>({repository:x.repository==='4veco-lessen'?'L':'P',path:x.path,prior_personal_read_raw:x.raw_sha256}));
 const pt=tree(P,BP).rows.map(x=>x.path),lt=tree(L,BL).rows.map(x=>x.path);
 for(const f of pt.filter(f=>f.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PAPER-ROOT-')||/BOOK2-TEXTBOOK-PRODUCTION-1-(root-plan-review|chapter-23-plan-review|234-PLAN-RELEASE-work-order|234-PLAN.*(?:report|result|publication|plan)\.md|213-QC-ROOT-(?:acceptance|result)\.md)/.test(f)))inputs.push({repository:'P',path:f});
 for(const f of ['references/authored/course-target-exercises.json','references/authored/book-outlines/book-2-outline.meta.json','references/owned/course-blueprint-v6-three-year.md','references/owned/course-blueprint-v5.md'])inputs.push({repository:'P',path:f});
 for(const f of lt.filter(f=>f.startsWith('Boek 2 - ')&&(/(?:_book-plan|_chapter-plan)\.md$/.test(f)||/2\.(?:1\.3|3\.[1234]).*(?:\.md|quality-ref.yaml)$/.test(f))||f.startsWith('Boek 1 - ')&&/1\.(?:1\.3|2\.1|2\.3|3\.2).*paragraaf.md$/.test(f)))inputs.push({repository:'L',path:f});
 const unique=new Map();for(const f of inputs)unique.set(f.repository+':'+f.path,f);
 return[...unique.values()].map(f=>{const r=f.repository==='P'?P:L,ref=f.repository==='P'?BP:BL,b=read(r,f.path),committed=git(r,'show',ref+':'+f.path);A.equal(hash(b),hash(committed),f.path);if(f.prior_personal_read_raw)A.equal(hash(b),f.prior_personal_read_raw,'same personally read instruction');return{...f,ref,bytes:b.length,git_blob:txt(r,'rev-parse',ref+':'+f.path),raw_sha256:hash(b),lf_sha256:hash(norm(b.toString('utf8')))};});
}
function custody(){const b=JSON.parse(read(P,pre+'baseline.json'));const now=[compact(P,BP),compact(L,BL)];for(let i=0;i<2;i++)A.deepEqual(now[i],b.repositories[i]);for(const f of b.selected_sources)A.equal(hash(read(f.repository==='P'?P:L,f.path)),f.raw_sha256);return now;}
function review(){
 const raw=read(L,PLAN),s=raw.toString('utf8'),old=git(L,'show',OLD+':'+PLAN).toString('utf8');A.equal(hash(raw),PLANHASH);A.equal(hash(old),OLDHASH);A.equal(s.split('\n').length-1,861);
 const oldLines=old.split('\n'),lines=s.split('\n');A.equal(oldLines.length-1,851);
 // Independently reconstruct the only allowed operations; no root exported verifier or checks used.
 const block=segment(s,'Productie-instructie voor beide papieren uitgaven:','Model: a de eerste twee');A.equal(block.split('\n').length-1,10);
 let back=s.replace(block,'').replace(lines[2],oldLines[2]).replace(lines[3],oldLines[3]).replace('Extra herinnering gewenst? Lees de gedrukte Start1-terugblik bij Opgave1.','Extra herinnering gewenst? Lees de volledig gedrukte §231-uitleg hierboven.');
 A.equal(back,old,'whole independent four-operation reversal');A.equal(hash(back),OLDHASH);
 const model=segment(old,'Model: a de eerste twee','Extra herinnering gewenst?');A.equal(segment(s,'Model: a de eerste twee','Extra herinnering gewenst?'),model);
 const assertNames=[],negatives=[];const yes=(ok,name)=>{A(ok,name);assertNames.push(name);};
 const deny=(name,fn)=>{let caught=false,reason;try{fn()}catch(e){caught=true;reason=e.message}A(caught,'counterexample escaped '+name);negatives.push({name,rejected:true,reason});};
 const start=x=>segment(x,'### Opgave 1','### Opgave 2');
 const conditions=[
  ['pupil edition',x=>/model en alle vier criteria ongewijzigd als kader \*\*Start1-terugblik\*\* in het\s+leerlingboekje/.test(x)],
  ['location after own questions before next task',x=>/direct na vragen1a–d en vóór Opgave2/.test(x)],
  ['same or facing page',x=>/op dezelfde pagina of de\s+direct ertegenover liggende pagina/.test(x)],
  ['answers repeat complete model and criteria',x=>/antwoordenboekje herhaalt het volledige\s+model en de criteria/.test(x)],
  ['attempt before optional checking',x=>/Probeer eerst1a–d zelf\. Wil je daarna\s+je antwoorden controleren\? Lees dan de Start1-terugblik hieronder\./.test(x)],
  ['actual named destination',x=>x.includes('Kaderkop in de leerlinguitgave: **Start1-terugblik — optionele feedback na een eigen poging**.')&&x.includes('Extra herinnering gewenst? Lees de gedrukte Start1-terugblik bij Opgave1.')],
  ['one existing low stakes check within original time',x=>/geen extra uitleg of tweede\s+leestaak/.test(x)&&x.includes('optionele zelfcontrole valt binnen de bestaande4 minuten van Start1')],
  ['entire unchanged model and all four criteria',x=>x.includes(model)],
  ['no former nonexistent referent',x=>!x.includes('§231-uitleg hierboven')],
  ['not forced routed or mastery feedback',x=>!/(?:bij fout verplicht|beheersing vastgesteld|diagnosticeert|gebruik je telefoon|vraag de docent om uitleg)/i.test(x)]
 ];
 const paper=x=>{const p=start(x);for(const[n,pred]of conditions)A(pred(p),n);return true;};
 yes(paper(s),'all independent paper predicates valid');yes(paper(s.replace(/\r\n/g,'\n')),'LF form valid');
 const corrupt=[['leerlingboekje','antwoordenboekje'],['vragen1a–d','vragen2a–d'],['vóór Opgave2','na Opgave2'],['direct ertegenover liggende pagina','achterin het boek'],['antwoordenboekje herhaalt','antwoordenboekje mist'],['Probeer eerst1a–d zelf','Lees eerst de oplossing'],['Wil je daarna','Je moet daarna'],['Start1-terugblik hieronder','§231-uitleg elders'],['Kaderkop in de leerlinguitgave','Kaderkop alleen voor de docent'],['bij Opgave1.','bij Opgave9.'],['bestaande4 minuten','ongetelde tijd'],['geen extra uitleg of tweede','ook extra uitleg en een tweede'],['CS=(18−12)+(12−12)=€6','CS=€7'],['elk één formatieve check','diagnosticeert beheersing']];
 const replaceInStart=(x,a,b)=>x.replace(start(x),start(x).replace(a,b));
 for(const[a,b]of corrupt){A(start(s).includes(a),a);deny('paper removed '+a,()=>paper(replaceInStart(s,a,'')));deny('paper forged '+a,()=>paper(replaceInStart(s,a,b)));}
 deny('original actual unresolved F1 plan',()=>paper(old));deny('name/reference only without edition instruction',()=>paper(old.replace('Extra herinnering gewenst? Lees de volledig gedrukte §231-uitleg hierboven.','Extra herinnering gewenst? Lees de gedrukte Start1-terugblik bij Opgave1.')));deny('placement only retaining wrong referent',()=>paper(old.replace('Model: a de eerste twee',block+'Model: a de eerste twee')));
 deny('forced remedial feedback',()=>paper(replaceInStart(s,'Model: a','bij fout verplicht\nModel: a')));
 const target=JSON.parse(s.match(/```json\n([^]*?)\n```/)[1]);const actual=JSON.parse(read(P,'references/authored/course-target-exercises.json')).exercises.find(x=>x.id==='2.3.4');A.equal(JSON.stringify(target),JSON.stringify(actual));A.equal(hash(JSON.stringify(target)),TARGETHASH);A.deepEqual(target.target_exercise.subquestions.map(x=>x.points),[2,2,4,2,2,2]);yes(target.lesson_goals.length===4&&target.target_exercise.subquestions.length===6,'whole fixed 4 goals 6 questions 14 points');
 const meta=JSON.parse(read(P,'references/authored/book-outlines/book-2-outline.meta.json'));
 const holdRows=segment(s,'| Hold ID |','Release-evidencewoordenboek').split('\n').filter(x=>/^\| H-/.test(x)).map(x=>x.split('|').slice(1,-1).map(x=>x.trim()));
 const holds=meta.holds;A(Array.isArray(holds),'metadata holds schema');A.equal(holds.length,22);A.equal(holdRows.length,22);
 for(const h of holds){const row=holdRows.find(x=>x[0]===h.id);A(row,h.id);A.equal(row[1],h.status);A.equal(row[3],'goal_design');A.equal(row[4],h.blocks.includes('goal_design')?'ja':'nee');A.equal(row[5],h.permits.includes('goal_design')?'ja':'nee');A.equal(row[6],h.resolution_actions.includes('goal_design')?'ja':'nee');A.equal(row[7],h.status==='released'?'RELEASED':'NOT_APPLICABLE');if(h.status==='released')A(h.release_evidence);yes(true,'exact hold '+h.id);}
 const prereqs=segment(s,'| ID / exacte operatie |','Voor werkelijk eerder').split('\n').filter(x=>/^\| P\d\d /.test(x));A.equal(prereqs.length,15);
 for(let i=1;i<=15;i++){const id='P'+String(i).padStart(2,'0'),r=prereqs.find(x=>x.startsWith('| '+id+' '));const cls=i===15?'preview_or_familiarity_only':i>=6&&i<=13?'new_formal_learning':'previously_taught_retrieval_required';A(r.includes('`'+cls+'`'));A.equal((r.match(/`(?:previously_taught_[a-z_]+|preview_or_familiarity_only|new_formal_learning)`/g)||[]).length,1);yes(true,'exact prerequisite '+id);deny('missing foundation '+id,()=>{A(s.replace(r,'').includes(r))});}
 const markets=[['WE',36,1,6,.5,36,36,18,16,[20,16,200,100,300,18,24,160,128,288,12,4,6,1,3.5]],['G3',30,.5,6,.5,60,40,20,16,[24,18,144,144,288,20,28,96,160,256,32,8,8,1.5,5.5]],['G4',42,1,6,.5,42,42,20,20,[24,18,288,144,432,22,28,240,180,420,12,4,6,1,3.5]],['I6',60,1,12,.5,60,60,30,24,[32,28,512,256,768,30,36,432,288,720,48,8,12,5,5.5]],['TARGET',80,1,20,.5,80,80,45,30,[40,40,800,400,1200,35,50,600,525,1125,75,10,15,4,9.5]]];
 const ledger=[];for(const[name,a,b,c,d,limit,pmax,p,q,expected]of markets){const qe=(a-c)/(b+d),pe=a-b*qe,cs=(a-pe)*qe/2,ps=(pe-c)*qe/2,ts=cs+ps,qd=(a-p)/b,qs=(p-c)/d,rcs=((a-p)+(a-b*q-p))*q/2,rps=((p-c)+(p-c-d*q))*q/2,rts=rcs+rps,dwl=ts-rts,base=qe-q,height=(a-b*q)-(c+d*q),buyer=a-b*(q+1)-p,seller=p-c-d*(q+1);const values=[qe,pe,cs,ps,ts,qd,qs,rcs,rps,rts,dwl,base,height,buyer,seller];A.deepEqual(values,expected,name);A.equal(dwl,base*height/2);A(q<Math.min(qd,qs,qe));A(buyer>0&&seller>0);A(qd<qe);for(let k=0;k<=100;k++){const x=k*limit/100,t=(a-c)*x-(b+d)*x*x/2;A(Math.abs(ts-t-(b+d)*(x-qe)**2/2)<1e-8);}
  for(let i=0;i<values.length;i++)deny(name+' wrong computed cell '+i,()=>A.equal(values[i]+1,expected[i]));
  ledger.push({name,functions:{demand:[a,-b],unitMC:[c,d]},domain:[0,limit],values,point_next:buyer+seller,continuous_next:(a-c)*(q+1)-(b+d)*(q+1)**2/2-((a-c)*q-(b+d)*q*q/2)});yes(true,'complete market '+name);
 }
 const buyers=[18,12,8,6].filter(w=>w>=12);A.deepEqual(buyers,[18,12]);A.equal(buyers.reduce((a,w)=>a+w-12,0),6);A.equal(2*12,24);A.equal(18+12,30);A.equal((49-45)+(45-35.5),13.5);A.equal(60*31-.75*31*31-(60*30-.75*30*30),14.25);
 const total=(ws,p)=>ws.reduce((a,w)=>a+w-p,0);A.deepEqual([total([18,12,8],8),total([12,8,6],6),3*(8-2),3*(6-2)],[14,8,18,12]);A.equal(18-8,10);A.equal((8-2)-(6-2),2);A.equal((24-6)/.5,36);A.equal(8+.25*40,18);
 const feasible=z=>z.book>=z.n&&z.cap>=z.n&&z.wtp>=z.p&&z.p>=z.mc&&z.cost===0&&z.oldUnchanged===true&&z.otherHarm===false;
 const valid={book:31,cap:40,n:31,wtp:49,p:45,mc:35.5,cost:0,oldUnchanged:true,otherHarm:false};A(feasible(valid));for(const[k,v]of Object.entries({book:30,cap:30,wtp:44,mc:46,cost:1,oldUnchanged:false,otherHarm:true}))deny('Pareto omitted/false premise '+k,()=>A(feasible({...valid,[k]:v})));
 A(feasible({...valid,book:9,cap:12,n:9,p:10,wtp:12,mc:8}));for(const [book,cap,ok]of [[5,6,false],[6,5,false],[6,6,true]])A.equal(feasible({...valid,book,cap,n:6,p:22,wtp:26,mc:17}),ok);
 const timings=[1+3+8+6+2+16+18,54+10+10+4,78+9,87+3+2];A.deepEqual(timings,[54,78,87,92]);A.equal(2+2+2+3+2+3+2,16);A.equal(2+2+2+4+3+3+2,18);
 const alts=segment(s,'| Stam | Werkelijke alt |','Alle tabellen, formules').split('\n').filter(x=>/^\| (?:we|ex)_\d+ \|/.test(x)).map(x=>x.split('|').slice(1,-1).map(x=>x.trim()));A.equal(alts.length,13);for(const [id,alt,caption]of alts){A(alt.length<=120);A(!/^(?:lees|bereken|teken|bekijk|gebruik)\b/i.test(alt));A(caption.length>alt.length);yes(true,'functional alt '+id);}
 const native=13*2+2*4;A.equal(native,34);A.equal(3+7*2,17);A.equal(3+10*2,23);A.equal(7+10-4,13);const placed=40/1200*166/25.4*72;A(Math.abs(placed-15.6850393701)<1e-9);
 const baseline=JSON.parse(read(P,pre+'baseline.json'));
 // Full immutable source custody probes use actual complete files; expected values cannot adapt.
 const checkFile=(f,b,offeredHash)=>{A(Buffer.isBuffer(b));const root=f.repository==='P'?P:L,immutable=git(root,'show',f.ref+':'+f.path);A.equal(hash(immutable),f.raw_sha256);A.equal(hash(b),hash(immutable));if(offeredHash)A.equal(offeredHash,f.raw_sha256);};
 for(const f of baseline.selected_sources){const b=read(f.repository==='P'?P:L,f.path);checkFile(f,b);deny('actual missing '+f.repository+':'+f.path,()=>checkFile(f,null));deny('actual forged '+f.repository+':'+f.path,()=>checkFile(f,Buffer.from('FORGED')));const drift=Buffer.concat([b,Buffer.from('\nUNAUTHORIZED\n')]);deny('synchronized whole source and local hash '+f.repository+':'+f.path,()=>checkFile(f,drift,hash(drift)));}
 return{verdict:'INDEPENDENT_PLAN_CHECKS_PASS',actor:'paragraph_224_builder',reviewed:{P:BP,L:BL,path:PLAN,raw_sha256:PLANHASH,lines:861},four_edit_reversal:true,unchanged_model_sha256:hash(model),paper_predicates:conditions.map(x=>x[0]),assertions:assertNames,negative_cases:negatives,negative_count:negatives.length,selected_source_count:baseline.selected_sources.length,hold_rows:holdRows,prerequisite_rows:prereqs,market_ledger:ledger,target_sha256:TARGETHASH,timing:{minutes:timings,status:'UNOBSERVED',optional_Start1_feedback_in_existing_minutes:4},native_contract:{native_files:34,additional_wrapper:1,zip_members:[17,23],figure_pairs:13,placed_font_pt:placed,alts},future_gates:['actual accepted 232/233 teaching','distinct accepted-input manifest review','root production release','actual native full/thin/direct checker parity','all real pages and 13 figures color/gray personal inspection including actual Start1 box pagination','distinct paragraph review','distinct specialist QC','root acceptance/handoff'],native_builds:0,personal_views:0,production_release:false};
}
function run(name,exe,args,allow=[0]){const begun=new Date().toISOString(),r=cp.spawnSync(exe,args,{cwd:P,env:process.env,maxBuffer:128*1024*1024});const v={exe,args,cwd:P,begun,ended:new Date().toISOString(),exit_code:r.status,error:r.error?.message,stdout:r.stdout?.toString('utf8'),stderr:r.stderr?.toString('utf8'),stdout_base64:r.stdout?.toString('base64'),stderr_base64:r.stderr?.toString('base64'),source_modules:args.filter(a=>/\.[cm]?js$/.test(a)&&fs.existsSync(path.resolve(P,a))).map(a=>({path:a,raw_sha256:hash(read(P,a)),source_utf8:read(P,a).toString('utf8')}))};save(name+'-process',v);A(allow.includes(r.status),name+' failure retained');return v;}
const mode=process.argv[2];
if(mode==='baseline'){A.equal(txt(P,'branch','--show-current'),branch);A.equal(txt(L,'branch','--show-current'),branch);save('baseline',{actor:'paragraph_224_builder',operational_commit:txt(P,'rev-parse','HEAD'),repositories:[compact(P,BP),compact(L,BL)],selected_sources:selected()});console.log('Complete compact baseline and actual source bindings saved');}
else if(mode==='check'){const name=process.argv[3]||'independent-r1';let result;try{result=review();save(name,result);console.log(JSON.stringify({name,verdict:result.verdict,negatives:result.negative_count,selected_sources:result.selected_source_count}));}catch(e){save(name+'-failure',{message:e.message,stack:e.stack,source_sha256:hash(read(P,pre+'check.cjs')),source_utf8:read(P,pre+'check.cjs').toString('utf8')});throw e;}}
else if(mode==='gates'){for(const[n,args]of [['structural',['build-scripts/workflows/check-book-outline-currentness.js']],['goal-design',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','goal_design','--paragraph','2.3.4']],['specialist',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','specialist_review','--paragraph','2.3.4']],['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']],['governance',['build-scripts/review-gates/check-governance-freshness.js']]]){run(n,'node',args);console.log(n+' PASS');}}
else if(mode==='scope'){const current={P:txt(P,'rev-parse','HEAD'),L:txt(L,'rev-parse','HEAD')},ownP=git(P,'diff','--name-only','-z',BP,current.P).toString('utf8').split('\0').filter(Boolean),ownL=git(L,'diff','--name-only','-z',BL,current.L).toString('utf8').split('\0').filter(Boolean);A(ownP.every(f=>f.startsWith(pre)||indexes.includes(f)));A.deepEqual(ownL,[]);const rows=[];for(const[n,r,lane,base,code]of [['own-P',P,'shared',BP,1],['own-L',L,'textbook',BL,1],['whole-P',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['whole-L',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]]){const v=run('scope-'+n,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',r,'--lane',lane,'--base',base,'--head',r===P?current.P:current.L,'--json'],[code]),j=JSON.parse(v.stdout);A.equal(j.categories.unknown.length,0);rows.push({name:n,base,head:r===P?current.P:current.L,exit_code:v.exit_code,categories:Object.fromEntries(Object.entries(j.categories).map(([k,v])=>[k,v.length])),failures:j.failures});}save('scope',{payload:current,strict:{P:ownP,L:ownL,unknown:0},rows,custody:custody()});}
else if(mode==='custody'){const c=custody();console.log(JSON.stringify({status:'ALL_BASELINE_RAW_BYTES_PRESERVED',repositories:c}));}
else throw Error('mode baseline/check/gates/scope/custody');
