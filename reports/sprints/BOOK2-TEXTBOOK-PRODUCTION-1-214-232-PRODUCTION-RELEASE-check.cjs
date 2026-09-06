// Task-owned actual input gate, not the future native builder's pre-effect test.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto'),yaml=require('js-yaml');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const N='BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE',R='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-';
const BP='67c544392d215e40970798b30d63ddd44ee404ee',BL='1cf1c1f972f196791fb37f6bbee523b7a2e3b676',OP='10e7dafc39abda4e40e27e5abd6efd535a2f4b3c';
const B='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const folders={
 '2.1.1':B+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.1 Kostenstructuren',
 '2.1.2':B+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.2 Opbrengsten, winst en break-even',
 '2.1.3':B+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten',
 '2.1.4':B+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.4 Gemengde opgaven',
 '2.3.1':B+'/2.3 Hoofdstuk Surplus en welvaart/2.3.1 Consumentensurplus',
 '2.3.2':B+'/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus'};
const configs={
 '214':{id:'2.1.4',chapter:'2.1 Hoofdstuk Kosten en opbrengsten',priors:['2.1.1','2.1.2','2.1.3'],
  plan:'a6f71553e887acdf7b94be5d411303660b9fad2ef8745cb25986636aa49b4cc4',
  record:'fda623dc9a3620724bf9df22a3ef937fd26779fa49d4d2b0b7c6baa862753691',points:[2,2,2,4,2,2],
  plan_author:'paragraph_214_builder',plan_reviewer:'paragraph_224_builder',
  reviews:['214-PLAN-REVIEW-R2-result.md','214-PLAN-REVIEW-R2-evidence.json','214-plan-root-result.md','214-plan-root-check.json','chapter-21-plan-review.md'],
  outputs:{editions:['opgaven','antwoorden'],extensions:['md','html','pdf'],svg_png_pairs:4,native_files_including_wrapper:15,zip:false},
  timing:{core:54,support:60,all:72,observed:false}},
 '232':{id:'2.3.2',chapter:'2.3 Hoofdstuk Surplus en welvaart',priors:['2.1.3','2.3.1'],
  plan:'d0781ffb6d2966209c3a160309316ce92ebc0455fa51d4235ccc6840afa58935',
  record:'54ce45a0cb044532717fe0cbbb6cfeae75e76b2656861bfea0d3821afc1843ce',points:[2,2,3,2,2],
  plan_author:'paragraph_231_specialist_qc',plan_reviewer:'paragraph_214_builder',
  reviews:['232-F1-REVIEW-report.md','232-PLAN-ROOT-verification.json','232-PLAN-ROOT-result.md','chapter-23-plan-review.md'],
  outputs:{editions:['paragraaf','opgaven','antwoorden'],extensions:['md','html','pdf','zip'],svg_png_pairs:14,native_files_excluding_wrapper:40,native_files_including_wrapper:41,zip_members:[25,13,13]},
  timing:{core:54,support:74,with_bonus:83,all:88,observed:false}}
};
const pinned={214:'8adf329ff71e912335baa11d1e78a28afb8eb807de52306ffd867e35c7f0f376',232:'113d3321a3b859d582a4febf6ff71cd259111d6c5d233047113b1455f6bcc5dc'};
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const lf=b=>hash(b.toString('utf8').replace(/\r\n?/g,'\n'));
function git(cwd,...args){return cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});}
function tree(cwd,ref){return new Map(git(cwd,'ls-tree','-r','-z',ref).toString('utf8').split('\0').filter(Boolean).map(s=>{const t=s.indexOf('\t');return[s.slice(t+1),s.slice(0,t).split(' ')[2]];}));}
const roots={'4veco-platform':P,'4veco-lessen':L},refs={'4veco-platform':BP,'4veco-lessen':BL};
const trees={'4veco-platform':tree(P,BP),'4veco-lessen':tree(L,BL)};
function unique(repo,test){const xs=[...trees[repo].keys()].filter(test);a.equal(xs.length,1,JSON.stringify(xs));return xs[0];}
function suffix(id,s){return unique('4veco-lessen',p=>p.startsWith(folders[id]+'/')&&p.endsWith('/'+id+'-'+s));}
function edition(id,s){return unique('4veco-lessen',p=>p.startsWith(folders[id]+'/')&&p.endsWith(' – '+s+'.md'));}
function inputPaths(key){const c=configs[key],out=[];const add=(repo,p,role)=>{a(trees[repo].has(p),p);if(!out.some(r=>r.repository===repo&&r.path===p))out.push({repository:repo,path:p,role});};
 const lesson=(p,role)=>add('4veco-lessen',p,role),platform=(p,role)=>add('4veco-platform',p,role);
 lesson(B+'/_book-plan.md','approved root plan');lesson(B+'/'+c.chapter+'/_chapter-plan.md','approved chapter plan');lesson(suffix(c.id,'textbook-plan.md'),'independently accepted complete paragraph plan');
 for(const id of c.priors){for(const s of ['textbook-plan.md','review.md','quality-ref.yaml','textbook-handoff.md'])lesson(suffix(id,s),id+' accepted prerequisite '+s);for(const ed of ['paragraaf','opgaven','antwoorden'])lesson(edition(id,ed),id+' unchanged accepted teaching '+ed);}
 // The actual five inputs to accepted213 are also checked for232, not just cited.
 for(const[id,s]of [['2.1.1','textbook-handoff.md'],['2.1.2','textbook-handoff.md'],['2.1.2','review.md'],['2.1.2','quality-ref.yaml']])lesson(suffix(id,s),'accepted213 five-pin succession input');
 lesson(edition('2.1.2','paragraaf'),'accepted213 fifth succession input');
 lesson(suffix('2.1.3','textbook-plan.md'),'actual213 native incoming plan');
 lesson(B+'/2.1 Hoofdstuk Kosten en opbrengsten/_chapter-plan.md','actual213 native incoming chapter plan');
 if(key==='232')for(const id of ['1.1.3','1.2.1','1.3.1','1.3.2'])lesson(unique('4veco-lessen',p=>p.startsWith('Boek 1 - ')&&p.includes('/'+id+' ')&&p.endsWith(' – paragraaf.md')),'Book1 actual bounded retrieval '+id);
 for(const p of ['references/owned/course-blueprint-v6-three-year.md','references/owned/course-blueprint-v5.md','references/authored/course-target-exercises.json','references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json','reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md',R+'plan-r2-root-continuation.md',R+'root-plan-review.md'])platform(p,'existing unchanged foundation and task authority');
 for(const s of c.reviews)platform(R+s,'complete plan review and root adoption');
 for(const s of ['213-S1-REVIEW-result.md','213-QC-CURRENT-report.md','213-QC-ROOT-result.md','213-QC-ROOT-preaccept-integrity.json','213-QC-ROOT-acceptance.md','213-QC-ROOT-postaccept-check.json','213-QC-ROOT-postaccept-data-transport.json'])platform(R+s,'actual independently reviewed213 succession and root acceptance');
 platform('build-scripts/content/book-2/b2_213.py','whole accepted213 five-pin generator');
 for(const s of (key==='214'?['211-root-acceptance-r5.md','212-root-acceptance.md','212-root-acceptance-check.json']:['231-root-acceptance.md','231-root-acceptance-check.json']))platform(R+s,'actual accepted predecessor root decision and checks');
 return out;
}
function committedRows(key){return inputPaths(key).map(r=>{const b=git(roots[r.repository],'show',refs[r.repository]+':'+r.path);a(fs.readFileSync(path.join(roots[r.repository],r.path)).equals(b),r.path);return{...r,commit:refs[r.repository],git_blob:trees[r.repository].get(r.path),raw_sha256:hash(b),canonical_lf_sha256:lf(b)};});}
function semantic(m,read){const c=configs[m.paragraph.replaceAll('.','')];a(c);a.deepEqual(m.target.points,c.points);a.equal(m.plan.raw_sha256,c.plan);
 const get=(repo,p)=>read({repository:repo,path:p}),reg=JSON.parse(get('4veco-platform','references/authored/course-target-exercises.json')),r=reg.exercises.find(x=>x.id===c.id);
 a.equal(hash(JSON.stringify(r)),c.record);a.deepEqual(r.target_exercise.subquestions.map(x=>x.points),c.points);a.equal(r.record_status,'candidate_review_ready');
 a.equal(hash(get('4veco-lessen',suffix(c.id,'textbook-plan.md'))),c.plan);
 for(const id of c.priors){const q=yaml.load(get('4veco-lessen',suffix(id,'quality-ref.yaml')).toString()).partA;
  a.equal(q.production_ready_with_flags,true);a.equal(q.review_verdict,'PASS WITH FLAGS');
  const rr=get('4veco-lessen',suffix(id,'review.md'));a.equal(hash(rr),q.review_sha256||q.review_sha256_lf||q.review_raw_sha256);
  if(id==='2.1.1'){a.equal(q.root_acceptance,'ACCEPTED WITH FLAGS');a.equal(q.root_validation,'PASS');a.equal(q.root_decision.actor,'codex-root');a.equal(q.hard_fails_open,0);a.equal(q.specialist_verdict,'PASS');a.equal(q.handoff_renewal,'COMPLETE');}
  else{a.equal(q.production_ready,false);a.equal(q.root_validation.status,'PASS');a.equal(q.root_acceptance.status,'ACCEPTED WITH FLAGS');a.equal(q.root_acceptance.actor,'codex-root');a.deepEqual(q.root_acceptance.required_corrections,[]);
   if(id==='2.1.2'){a.equal(q.hard_fails_open,0);a.equal(q.specialist_verdict,'PASS WITH FLAGS');a.equal(q.handoff_renewal.status,'RENEWED');a.equal(q.handoff_renewal.companion,'NOT_COMMISSIONED');}
   if(id==='2.1.3'){a.equal(q.specialist_review.verdict,'PASS WITH FLAGS');a.equal(q.specialist_review.distinct_from_source_author_and_paragraph_reviewer,true);a.equal(q.handoff_renewal.status,'RENEWED');a.equal(q.handoff_renewal.companion,'NOT_COMMISSIONED');a.match(q.root_acceptance.accepted_prerequisite_succession,/^CLOSED:/);}
   if(id==='2.3.1'){a.equal(q.specialist_qc.verdict,'PASS WITH FLAGS');a.equal(q.specialist_qc.hard_fails_open,0);a.match(q.handoff_renewal,/CREATED: 2.3.1-textbook-handoff.md/);}
  }
  const h=get('4veco-lessen',suffix(id,'textbook-handoff.md')).toString();a.match(h,/READY_FOR_COMPANION/);
  if(id==='2.1.1')a(h.replace(/\s+/g,' ').includes('does not itself commission a companion or authorize a merge.'));
  else a.match(h,/not commissioned|NOT_COMMISSIONED|does not commission|No Part B|not commission/i);
 }
 const gen=get('4veco-platform','build-scripts/content/book-2/b2_213.py');a.equal(hash(gen),'87ce47b88520abbde45c18114816dae7630e31453c48e0c505c87b7e9b031ce4');
 for(const s of ['0d14506e314a11fef0637cc66cf29036f174b94cafbf7fa5ede2eff88937500f','4da6e5b4f0a70273d78c067f34484c8a5f6faf164b0f09c1559b9a73ff6611fe','79429b9f1750710baae46751a5792e4a02e7c177888a01f5ca3a15c4039a78f7','73bd2a2447b38c9d95cbc3bd69b8037e0f46b7564655b4513009fd6707b7b07d','9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8']){a(gen.toString().includes(s));a(m.inputs.some(x=>x.raw_sha256===s||x.canonical_lf_sha256===s));}
}
function write(s,obj){fs.writeFileSync(path.join(__dirname,N+'-'+s+'.json'),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});}
function manifest(key){const c=configs[key];return{schema_version:1,id:N+'-'+key,paragraph:c.id,date:'2026-09-06',decision:'CANDIDATE_FOR_INDEPENDENT_INPUT_REVIEW',accountable_actor:'codex-root',operational_plan_commit:OP,immutable_input_pair:{platform:BP,lessons:BL},
  authority:'Existing owner-granted gated Part A production under #229; this candidate is not a production release or future PR merge grant.',
  plan:{raw_sha256:c.plan,author:c.plan_author,independent_reviewer:c.plan_reviewer,status:'Independently accepted complete plan; historical pending prose retained'},
  target:{record_sha256:c.record,record_status:'candidate_review_ready',points:c.points,frozen_package_sha256:'914d1a39f18f8f9b7cf7fad938d2c42f9c2bc19671d94c24be151b1da0371310'},
  accepted_predecessors:c.priors,inputs:committedRows(key),output_contract:{lesson_directory:folders[c.id],...c.outputs,minimum_printed_text_pt:12},timing:c.timing,
  fail_closed_contract:['A separate published root release must bind this exact manifest Git commit and raw hash plus its distinct independent review. Candidate existence alone grants no production permission.','Before native effects, verify whole immutable manifest identity and every exact repository/path/commit/raw-file binding; missing, forged, partial, wrong-identity, stale and synchronized file/hash drift must reject. Do not replace fixed expected hashes with current self-reported hashes.','Verify actual predecessor acceptance and complete target, then approved action-specific currentness/durable authority before any native mkdir, removal, subprocess or generation. Test these real builder entrypoints separately.','No unchanged historical pending prose is retroactively rewritten; accepted teaching is identical. A semantic change requires plan correction/re-review; a pin change needs separately reviewed bounded root release.'],
  remaining_gates:['Distinct independent input-manifest review','Root release after review and fresh checks','Native authoring with actual pre-effect probes and full/thin/direct proof','Complete independent paragraph review','Distinct specialist QC with actual full color/grayscale page/figure inspection','Root native verification/acceptance/handoff','Chapter/book aggregate review; current paired CI; lead rounds; readiness'],
  prohibited:['Target, approved plan or historical verdict mutation','Part B commission','Formal213 output-choice extension','Claiming unobserved classroom attainment','Future PR merges or admin bypass']};}
const originalCache=new Map(),expectedCache=new Map();
function originals(m){const k=m.id;if(!originalCache.has(k))originalCache.set(k,new Map(m.inputs.map(r=>[r.repository+'/'+r.path,git(roots[r.repository],'show',r.commit+':'+r.path)])));return originalCache.get(k);}
function verifyManifest(bytes,key,read,onSuccess){a.equal(hash(bytes),pinned[key],'complete immutable manifest');const m=JSON.parse(bytes);if(!expectedCache.has(key))expectedCache.set(key,manifest(key));a.deepEqual(m,expectedCache.get(key));const original=originals(m);
 for(const r of m.inputs){const b=read(r);a.equal(hash(b),r.raw_sha256,r.path);a.equal(lf(b),r.canonical_lf_sha256,r.path);a(b.equals(original.get(r.repository+'/'+r.path)),r.path);}
 semantic(m,read);onSuccess();return m;}
function custody(){const result=[];for(const[repo,cwd]of Object.entries(roots)){const t=trees[repo],names=[...t.keys()],actual=cp.execFileSync('git',['-c','core.longpaths=true','hash-object','--no-filters','--stdin-paths'],{cwd,input:names.map(n=>JSON.stringify(n)).join('\n')+'\n',encoding:'utf8',maxBuffer:128*1024*1024}).trim().split(/\r?\n/);a.equal(actual.length,names.length);for(let i=0;i<names.length;i++)a.equal(actual[i],t.get(names[i]),names[i]);result.push({repository:repo,baseline:refs[repo],files:t.size,all_actual_raw_git_blobs_exact:true});}return result;}
function runGates(){const out=[];for(const[name,args]of [
 ['structural',['build-scripts/workflows/check-book-outline-currentness.js']],
 ...['214','232'].flatMap(key=>['paragraph_production','specialist_review'].map(action=>[key+'-'+action,['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph',configs[key].id]])),
 ['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],
 ['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]]){const r=cp.spawnSync(process.execPath,args,{cwd:P,maxBuffer:128*1024*1024});const x={name,cwd:P,args,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};write(name+'-process',x);a.equal(r.status,0,JSON.stringify(x));out.push({name,exit_code:r.status});}return out;}
function probes(key,bytes){const m=JSON.parse(bytes),original=originals(m),tmp=fs.mkdtempSync('C:/wt/book2-214-232-release-probes-'),rows=[];
 const file=r=>path.join(tmp,r.repository,r.path),read=r=>fs.readFileSync(file(r));
 for(const r of m.inputs){fs.mkdirSync(path.dirname(file(r)),{recursive:true});fs.writeFileSync(file(r),original.get(r.repository+'/'+r.path));}
 let valid=0;verifyManifest(bytes,key,read,()=>valid++);
 const negative=(label,b=bytes)=>{let calls=0;a.throws(()=>verifyManifest(b,key,read,()=>calls++),label);a.equal(calls,0);rows.push({label,rejected:true,success_callbacks:0});};
 for(const r of m.inputs){const f=file(r),old=original.get(r.repository+'/'+r.path);fs.unlinkSync(f);negative(r.path+' missing');fs.writeFileSync(f,Buffer.concat([old,Buffer.from('\nFORGED_INPUT\n')]));negative(r.path+' forged');const bad=JSON.parse(bytes);const changed=bad.inputs.find(x=>x.repository===r.repository&&x.path===r.path);changed.raw_sha256=hash(read(r));changed.canonical_lf_sha256=lf(read(r));negative(r.path+' synchronized input/hash drift',Buffer.from(JSON.stringify(bad,null,2)+'\n'));fs.writeFileSync(f,old);}
 for(const[label,mutate]of [['partial',x=>x.inputs.pop()],['wrong paragraph',x=>x.paragraph='2.3.4'],['false release',x=>x.decision='RELEASED_FOR_GATED_PART_A_AUTHORING'],['wrong source commit',x=>x.inputs[0].commit='0'.repeat(40)],['reordered list',x=>x.inputs.reverse()],['empty list',x=>x.inputs=[]]]){const bad=JSON.parse(bytes);mutate(bad);negative(label,Buffer.from(JSON.stringify(bad,null,2)+'\n'));}
 negative('empty manifest',Buffer.alloc(0));verifyManifest(bytes,key,read,()=>valid++);a.equal(valid,2);
 const resolved=path.resolve(tmp);a.equal(path.dirname(resolved),path.resolve('C:/wt'));a(path.basename(resolved).startsWith('book2-214-232-release-probes-'));fs.rmSync(resolved,{recursive:true});return{key,negative_actual_file_and_manifest_probes:rows,positive_callbacks:valid,fixture_removed:resolved,native_builder_calls:0};}
function main(){const mode=process.argv[2];if(mode==='create'){a.equal(git(P,'rev-parse','HEAD').toString().trim(),OP);a.equal(git(L,'rev-parse','HEAD').toString().trim(),BL);for(const key of Object.keys(configs)){const m=manifest(key);semantic(m,r=>fs.readFileSync(path.join(roots[r.repository],r.path)));write(key+'-inputs',m);console.log(JSON.stringify({key,inputs:m.inputs.length,raw_sha256:hash(fs.readFileSync(path.join(__dirname,N+'-'+key+'-inputs.json')))}));}write('baseline',{status:'PASS',custody:custody(),trees:Object.fromEntries(Object.entries(trees).map(([k,v])=>[k,Object.fromEntries(v)]))});}
 else if(mode==='check'){const checks=[];for(const key of Object.keys(configs)){const bytes=fs.readFileSync(path.join(__dirname,N+'-'+key+'-inputs.json'));verifyManifest(bytes,key,r=>fs.readFileSync(path.join(roots[r.repository],r.path)),()=>{});checks.push(probes(key,bytes));}const commands=runGates();const x={status:'PASS',decision:'CANDIDATE_FOR_INDEPENDENT_INPUT_REVIEW',manifests:pinned,checks,current_gates:commands,custody:custody(),lesson_changes:0,native_generation:'NOT_RUN; future native entrypoint tests remain mandatory',required_next:'Distinct published independent review before root release'};write('check',x);console.log(JSON.stringify({status:x.status,manifests:pinned,probes:checks.map(x=>({key:x.key,negatives:x.negative_actual_file_and_manifest_probes.length})),current_gates:commands,custody:x.custody},null,2));}
 else if(mode==='verify'){for(const key of Object.keys(configs))verifyManifest(fs.readFileSync(path.join(__dirname,N+'-'+key+'-inputs.json')),key,r=>fs.readFileSync(path.join(roots[r.repository],r.path)),()=>{});console.log(JSON.stringify({status:'PASS',manifests:pinned,custody:custody()}));}
 else throw new Error('Expected create, check or verify');}
module.exports={verifyManifest,semantic,configs,pinned,roots,refs,hash};
if(require.main===module)main();
