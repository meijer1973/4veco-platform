'use strict';
// Independent input-package probes. No root CLI writer and no native entrypoint.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),A=require('node:assert/strict'),yaml=require('js-yaml');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const N='BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-REVIEW',R='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-',C=R+'214-232-PRODUCTION-RELEASE-';
const BP='67c544392d215e40970798b30d63ddd44ee404ee',BL='1cf1c1f972f196791fb37f6bbee523b7a2e3b676';
const roots={'4veco-platform':P,'4veco-lessen':L},refs={'4veco-platform':BP,'4veco-lessen':BL};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),lf=b=>sha(b.toString('utf8').replace(/\r\n?/g,'\n'));
const rd=(root,f)=>fs.readFileSync(path.join(root,f));
const git=(root,...args)=>cp.execFileSync('git',args,{cwd:root,maxBuffer:128*1024*1024});
const names=(root,ref)=>git(root,'ls-tree','-r','--name-only','-z',ref).toString('utf8').split('\0').filter(Boolean);
const tree={P:names(P,BP),L:names(L,BL)},out={actor:'paragraph_224_builder',role:'independent214232InputReviewer',input_commits:refs,checks:[],probes:[],observations:[]};
const check=(name,fn)=>{fn();out.checks.push(name);};
const uniq=(repo,test)=>{const xs=tree[repo].filter(test);A.equal(xs.length,1,JSON.stringify(xs));return xs[0];};
const B='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const folder=id=>path.posix.dirname(uniq('L',f=>f.endsWith('/'+id+'-textbook-plan.md')));
const ctl=(id,s)=>folder(id)+'/'+id+'-'+s;
const ed=(id,s)=>uniq('L',f=>f.startsWith(folder(id)+'/')&&f.endsWith(' – '+s+'.md'));
const rowkey=r=>r.repository+'/'+r.path;
const keys=['214','232'],pins={214:'8adf329ff71e912335baa11d1e78a28afb8eb807de52306ffd867e35c7f0f376',232:'113d3321a3b859d582a4febf6ff71cd259111d6c5d233047113b1455f6bcc5dc'};
const whole=rd(P,C+'check.cjs');A.equal(sha(whole),'927a4d012404b4e00cabfe793e9db45e22fae0660b968a3e97b6c007851c4f4b');
// Independently assembled groups follow the approved plans' source needs, not inputPaths/configs.
function required(k){
 const need=new Map(),add=(repo,f,why)=>{const id=repo+'/'+f;if(!need.has(id))need.set(id,{repository:repo,path:f,reasons:[]});need.get(id).reasons.push(why);};
 const lp=(f,w)=>add('4veco-lessen',f,w),pp=(f,w)=>add('4veco-platform',f,w);
 const id=k==='214'?'2.1.4':'2.3.2',chapter=k==='214'?'2.1 Hoofdstuk Kosten en opbrengsten':'2.3 Hoofdstuk Surplus en welvaart';
 lp(B+'/_book-plan.md','existing approved book architecture');lp(B+'/'+chapter+'/_chapter-plan.md','approved chapter architecture');lp(ctl(id,'textbook-plan.md'),'complete independently passed exact operational teaching plan');
 for(const prior of k==='214'?['2.1.1','2.1.2','2.1.3']:['2.1.3','2.3.1']){
  for(const s of ['textbook-plan.md','review.md','quality-ref.yaml','textbook-handoff.md'])lp(ctl(prior,s),'actual accepted direct predecessor control '+prior);
  for(const e of ['paragraaf','opgaven','antwoorden'])lp(ed(prior,e),'actual accepted printed teaching and full practice/models '+prior);
 }
 for(const [id,s]of [['2.1.1','textbook-handoff.md'],['2.1.2','textbook-handoff.md'],['2.1.2','review.md'],['2.1.2','quality-ref.yaml']])lp(ctl(id,s),'closed213 upstream literal input, not a speculative accepted record');
 lp(ed('2.1.2','paragraaf'),'fifth actual213 literal input');lp(ctl('2.1.3','textbook-plan.md'),'unchanged213 native own plan');lp(B+'/2.1 Hoofdstuk Kosten en opbrengsten/_chapter-plan.md','unchanged213 native chapter plan');
 if(k==='232')for(const id of ['1.1.3','1.2.1','1.3.1','1.3.2'])lp(uniq('L',f=>f.startsWith('Boek 1 - ')&&f.includes('/'+id+' ')&&f.endsWith(' – paragraaf.md')),'bounded Book1 axes/willingness/supply/equilibrium retrieval; not supply=MC');
 for(const f of ['references/owned/course-blueprint-v6-three-year.md','references/owned/course-blueprint-v5.md','references/authored/course-target-exercises.json','references/authored/book-outlines/book-2-outline.md','references/authored/book-outlines/book-2-outline.meta.json','reports/sprints/BOOK2-TARGET-INTEGRATION-1-owner-authorization.md',R+'plan-r2-root-continuation.md',R+'root-plan-review.md'])pp(f,'active foundation/frozen authority and actual existing task grant');
 const reviews=k==='214'?['214-PLAN-REVIEW-R2-result.md','214-PLAN-REVIEW-R2-evidence.json','214-plan-root-result.md','214-plan-root-check.json','chapter-21-plan-review.md']:['232-F1-REVIEW-report.md','232-PLAN-ROOT-verification.json','232-PLAN-ROOT-result.md','chapter-23-plan-review.md'];
 for(const f of reviews)pp(R+f,'distinct current plan judgment and root adoption');
 for(const f of ['213-S1-REVIEW-result.md','213-QC-CURRENT-report.md','213-QC-ROOT-result.md','213-QC-ROOT-preaccept-integrity.json','213-QC-ROOT-acceptance.md','213-QC-ROOT-postaccept-check.json','213-QC-ROOT-postaccept-data-transport.json'])pp(R+f,'actual distinct213 delta/QC and root native/postdecision accepted succession');
 pp('build-scripts/content/book-2/b2_213.py','whole five-literal source lineage, not permission to run it');
 for(const f of k==='214'?['211-root-acceptance-r5.md','212-root-acceptance.md','212-root-acceptance-check.json']:['231-root-acceptance.md','231-root-acceptance-check.json'])pp(R+f,'actual accepted direct predecessor root decision');
 return [...need.values()];
}
const manifests=Object.fromEntries(keys.map(k=>[k,JSON.parse(rd(P,C+k+'-inputs.json'))]));
out.required_inputs={};out.custody=[];
for(const k of keys){const bytes=rd(P,C+k+'-inputs.json'),m=manifests[k],req=required(k);out.required_inputs[k]=req;
 check(k+' entire immutable manifest identity',()=>A.equal(sha(bytes),pins[k]));
 check(k+' independent complete required path set',()=>A.deepEqual(m.inputs.map(rowkey).sort(),req.map(rowkey).sort()));
 check(k+' exact source pair / candidate boundary',()=>{A.deepEqual(m.immutable_input_pair,{platform:BP,lessons:BL});A.equal(m.decision,'CANDIDATE_FOR_INDEPENDENT_INPUT_REVIEW');A.equal(m.accountable_actor,'codex-root');A.equal(m.operational_plan_commit,'10e7dafc39abda4e40e27e5abd6efd535a2f4b3c');A(m.remaining_gates[0].includes('independent'));});
 check(k+' actual published candidate payload bytes',()=>A(git(P,'show','9c6d8a7c1ee98b91a67f6d560beb8534f5dbde56:'+C+k+'-inputs.json').equals(bytes)));
 for(const r of m.inputs){const blob=git(roots[r.repository],'show',r.commit+':'+r.path),actual=rd(roots[r.repository],r.path);check(k+' committed/raw/LF '+r.path,()=>{A.equal(r.commit,refs[r.repository]);A(blob.equals(actual));A.equal(sha(blob),r.raw_sha256);A.equal(lf(blob),r.canonical_lf_sha256);A.equal(git(roots[r.repository],'rev-parse',r.commit+':'+r.path).toString().trim(),r.git_blob);});out.custody.push({key:k,...r,actual_blob_equal:true});}
}
// The preceding payload-commit lookup is platform-owned even for lesson inputs.
const beforeImportWrites=[];const originals={};
for(const fn of ['writeFileSync','appendFileSync','mkdirSync','mkdtempSync','rmSync','unlinkSync','renameSync','copyFileSync']){originals[fn]=fs[fn];fs[fn]=(...args)=>{beforeImportWrites.push(fn);throw Error('Read-only module import attempted '+fn);};}
let mod;try{mod=require('./BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE-check.cjs');}finally{for(const [fn,impl]of Object.entries(originals))fs[fn]=impl;}
A.deepEqual(beforeImportWrites,[]);out.checks.push('whole bound read-only API import: no file mutations');
const tmp=fs.mkdtempSync('C:/wt/book2-214-232-independent-input-fixture-');out.fixture=tmp;
const all=new Map(Object.values(manifests).flatMap(m=>m.inputs).map(r=>[rowkey(r),r]));
const originalsByPath=new Map([...all].map(([id,r])=>[id,rd(roots[r.repository],r.path)]));
const fixture=r=>path.join(tmp,r.repository,r.path),reader=r=>fs.readFileSync(fixture(r));
for(const [id,r]of all){fs.mkdirSync(path.dirname(fixture(r)),{recursive:true});fs.writeFileSync(fixture(r),originalsByPath.get(id));}
let positives=0;
function guarded(fn){const calls=[];const old={};for(const name of ['writeFileSync','appendFileSync','mkdirSync','mkdtempSync','rmSync','unlinkSync','renameSync','copyFileSync']){old[name]=fs[name];fs[name]=()=>{calls.push(name);throw Error('Unexpected gate mutation '+name);};}const oldSpawn=cp.spawnSync;cp.spawnSync=()=>{calls.push('spawnSync');throw Error('Unexpected subprocess');};try{return fn();}finally{for(const [n,v]of Object.entries(old))fs[n]=v;cp.spawnSync=oldSpawn;A.deepEqual(calls,[]);}}
function positive(k,label,read=reader){let success=0;guarded(()=>mod.verifyManifest(rd(P,C+k+'-inputs.json'),k,read,()=>success++));A.equal(success,1);positives++;out.probes.push({key:k,label,kind:'positive',success_callbacks:success,file_mutations:0,native_calls:0});}
function negative(k,label,bytes=rd(P,C+k+'-inputs.json'),beforeRead=false){let calls=0,reads=0,error;try{guarded(()=>mod.verifyManifest(bytes,k,r=>{reads++;return reader(r);},()=>calls++));}catch(e){error=e.message;}A(error,label);A.equal(calls,0);if(beforeRead)A.equal(reads,0);out.probes.push({key:k,label,kind:'negative',rejected:true,reads,success_callbacks:0,file_mutations:0,error});}
function semNegative(k,label,r,b){const old=reader(r);fs.writeFileSync(fixture(r),b);let error;try{guarded(()=>mod.semantic(manifests[k],reader));}catch(e){error=e.message;}A(error,label);out.probes.push({key:k,label,kind:'inner_semantic_negative',rejected:true,error,file_mutations:0});fs.writeFileSync(fixture(r),old);}
for(const k of keys){const m=manifests[k],bytes=rd(P,C+k+'-inputs.json');positive(k,'actual current committed source',r=>rd(roots[r.repository],r.path));positive(k,'independent physical fixture before mutations');
 for(const r of m.inputs){const original=reader(r);fs.unlinkSync(fixture(r));negative(k,'MISSING '+rowkey(r));fs.writeFileSync(fixture(r),Buffer.concat([original,Buffer.from('\nindependent forged suffix\n')]));negative(k,'FORGED '+rowkey(r));const sync=structuredClone(m),x=sync.inputs.find(x=>rowkey(x)===rowkey(r));x.raw_sha256=sha(reader(r));x.canonical_lf_sha256=lf(reader(r));negative(k,'SYNCHRONIZED '+rowkey(r),Buffer.from(JSON.stringify(sync,null,2)+'\n'),true);fs.writeFileSync(fixture(r),original);}
 const changes=[['partial list',x=>x.inputs.pop()],['empty list',x=>x.inputs=[]],['duplicate row',x=>x.inputs.push(x.inputs[0])],['swap identity',x=>x.paragraph=k==='214'?'2.3.2':'2.1.4'],['false root release',x=>x.decision='RELEASED_FOR_GATED_PART_A_AUTHORING'],['forged actor',x=>x.accountable_actor='paragraph_224_builder'],['wrong commit',x=>x.inputs[0].commit='0'.repeat(40)],['wrong blob',x=>x.inputs[0].git_blob='0'.repeat(40)],['wrong repo',x=>x.inputs[0].repository='4veco-platform'],['path traversal',x=>x.inputs[0].path='../forged'],['blank plan hash',x=>x.plan.raw_sha256=''],['invented future input pair',x=>x.immutable_input_pair.lessons='f'.repeat(40)],['release gate removed',x=>x.remaining_gates=[]],['changed target points',x=>x.target.points[0]++],['false measured timing',x=>x.timing.observed=true],['reordered list',x=>x.inputs.reverse()]];
 for(const [label,change]of changes){const x=structuredClone(m);change(x);negative(k,label,Buffer.from(JSON.stringify(x,null,2)+'\n'),true);}negative(k,'truncated JSON',bytes.subarray(0,bytes.length-10),true);negative(k,'empty manifest',Buffer.alloc(0),true);negative(k,'other genuine manifest wrong requested key',rd(P,C+(k==='214'?'232':'214')+'-inputs.json'),true);
 for(const id of k==='214'?['2.1.1','2.1.2','2.1.3']:['2.1.3','2.3.1']){const r=m.inputs.find(r=>r.path===ctl(id,'quality-ref.yaml')),q=yaml.load(reader(r).toString());
  const cases=[['PENDING root',x=>{if(id==='2.1.1')x.root_acceptance='PENDING';else x.root_acceptance.status='PENDING';}],['wrong root actor',x=>{if(id==='2.1.1')x.root_decision.actor='forged';else x.root_acceptance.actor='forged';}],['failed validation',x=>{if(id==='2.1.1')x.root_validation='FAIL';else x.root_validation.status='FAIL';}],['partial readiness',x=>{x.production_ready_with_flags=false;}],['review REVISE',x=>{x.review_verdict='REVISE';}],['stale review hash',x=>{x.review_sha256='0'.repeat(64);}],['missing acceptance',x=>{delete x.root_acceptance;}],['pending handoff',x=>{if(typeof x.handoff_renewal==='string')x.handoff_renewal='PENDING';else x.handoff_renewal.status='PENDING';}]];
  if(id!=='2.1.1')cases.push(['required correction open',x=>x.root_acceptance.required_corrections.push('BLOCK')],['overclaimed production ready',x=>x.production_ready=true]);
  if(id==='2.1.3')cases.push(['S1 still pending',x=>x.root_acceptance.accepted_prerequisite_succession='PENDING'],['self-review claimed',x=>x.specialist_review.distinct_from_source_author_and_paragraph_reviewer=false],['specialist REVISE',x=>x.specialist_review.verdict='REVISE']);
  for(const [label,change]of cases){const x=structuredClone(q);change(x.partA);semNegative(k,id+' '+label,r,Buffer.from(yaml.dump(x)));}
  const hand=m.inputs.find(r=>r.path===ctl(id,'textbook-handoff.md'));semNegative(k,id+' no companion source handoff',hand,Buffer.from(reader(hand).toString().replaceAll('READY_FOR_COMPANION','PENDING')));
  // Demonstrate semantic() alone is not the immutable gate. Wrong identity must use verifyManifest.
  const identity=structuredClone(q);identity.partA.paragraph='9.9.9';identity.partA.id='9.9.9';const old=reader(r);fs.writeFileSync(fixture(r),yaml.dump(identity));negative(k,id+' wrong QC identity rejected by full gate');let semanticOnly=true;try{mod.semantic(m,reader);}catch{semanticOnly=false;}out.observations.push({key:k,id,semantic_only_accepts_changed_identity:semanticOnly,interpretation:'semantic is a supplemental projection, never safe as a standalone input gate; whole immutable verifier rejects'});fs.writeFileSync(fixture(r),old);
 }
 positive(k,'fixture restored exact after every negative');
}
out.fixture_final=Object.fromEntries([...all].map(([id,r])=>{A(reader(r).equals(originalsByPath.get(id)));return[id,sha(reader(r))];}));
// Keep this unique task-owned scratch directory for reproducible diagnostics; no foreign deletion.
out.fixture_retained=true;out.positive_cases=positives;out.native_builds=0;out.fresh_personal_views=0;out.root_cli_writer_invocations=0;
check('module and manifest whole bytes remain exact',()=>{A(rd(P,C+'check.cjs').equals(whole));for(const k of keys)A.equal(sha(rd(P,C+k+'-inputs.json')),pins[k]);});
out.status='PASS';out.whole_module_raw_sha256=sha(whole);out.negative_cases=out.probes.filter(x=>x.kind==='negative').length;out.inner_semantic_negative_cases=out.probes.filter(x=>x.kind==='inner_semantic_negative').length;
fs.writeFileSync(path.join(__dirname,N+'-independent.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:out.status,checks:out.checks.length,positives,negatives:out.negative_cases,inner_semantic_negatives:out.inner_semantic_negative_cases,required_counts:Object.fromEntries(keys.map(k=>[k,out.required_inputs[k].length])),unique_inputs:all.size,native_builds:0,root_cli_writer_invocations:0,semantic_only_observations:out.observations},null,2));
