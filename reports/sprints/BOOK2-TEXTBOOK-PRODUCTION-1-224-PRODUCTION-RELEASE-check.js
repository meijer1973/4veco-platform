// Root release custody/probe gate; NOT the future native builder's security test.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-PRODUCTION-RELEASE';
const file=path.join(__dirname,prefix+'-inputs.json'),input=fs.readFileSync(file);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const pinned='33c1473db0cbeec66e93557a72ab0586ccfcef29ba52b2a36148946c65598c7e';
a.equal(hash(input),pinned);const m=JSON.parse(input);a.equal(m.inputs.length,34);
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
a.equal(git(P,'rev-parse','HEAD').toString().trim(),'6956fc3d20ae99bcf1eb2e537c62d8a37c93cf1d');
a.equal(git(L,'rev-parse','HEAD').toString().trim(),m.immutable_input_pair.lessons);
a.equal(git(L,'status','--porcelain').toString().trim(),'');
const originals=new Map(),rows=[];
for(const r of m.inputs){const repo=r.repository==='4veco-platform'?P:L,key=r.repository+'/'+r.path;
 a(!originals.has(key));a(!path.isAbsolute(r.path)&&!r.path.split('/').includes('..'));
 const committed=git(repo,'show',r.commit+':'+r.path),current=fs.readFileSync(path.join(repo,r.path));
 a(current.equals(committed),key);a.equal(hash(current),r.raw_sha256,key);originals.set(key,committed);
 rows.push({...r,git_blob:git(repo,'rev-parse',r.commit+':'+r.path).toString().trim(),actual_raw_and_git_exact:true});}
const registry=JSON.parse(originals.get('4veco-platform/references/authored/course-target-exercises.json'));
const target=registry.exercises.find(r=>r.id==='2.2.4');
a.equal(hash(JSON.stringify(target)),m.target.record_sha256);
a.deepEqual(target.target_exercise.subquestions.map(q=>q.points),m.target.points);
const priorReview=JSON.parse(originals.get('4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-224-PLAN-REVIEW-ROOT-check.json'));
a.equal(priorReview.plan_sha256,m.plan.raw_sha256);a.equal(priorReview.reviewer,'codex-root');
const yaml=require('js-yaml');
for(const id of ['2.2.1','2.2.2','2.2.3']){
 const qr=m.inputs.find(r=>r.repository==='4veco-lessen'&&r.path.endsWith('/'+id+'-quality-ref.yaml'));
 const current=yaml.load(originals.get(qr.repository+'/'+qr.path).toString());
 const part=current.partA,accepted=part.root_acceptance;
 a.equal(part.production_ready_with_flags,true,id);
 a.equal(part.review_verdict,'PASS WITH FLAGS',id);a.equal(part.specialist_verdict,'PASS WITH FLAGS',id);
 if(id==='2.2.1'){
  a.equal(Object.hasOwn(part,'production_ready'),false);a.equal(part.unresolved_blockers,0);
  a.equal(accepted.integrator,'codex-root');
  a.equal(accepted.scope,'Internal current paragraph acceptance with flags, not Part B commissioning or final book/student-release/merge authorization');
  a.equal(accepted.evidence,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-root-acceptance-r8.md');
  a.equal(accepted.handoff_file,id+'-textbook-handoff.md');
 }else if(id==='2.2.2'){
  a.equal(Object.hasOwn(part,'production_ready'),false);a.equal(part.hard_fails_open,0);a.deepEqual(part.required_corrections,[]);
  a.equal(accepted.actor,'codex-root');a.equal(accepted.decision,'ACCEPTED WITH FLAGS for internal Part A R13 paragraph production');
  a.equal(accepted.report,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-222-root-acceptance-r13.md');
  a.equal(accepted.handoff,id+'-textbook-handoff.md');
 }else{
  a.equal(part.production_ready,false);a.equal(part.unresolved_blockers,0);
  a.equal(accepted.actor,'codex-root');a.equal(accepted.status,'ACCEPTED WITH FLAGS');
  a.equal(accepted.lineage_flag_closure.status,'CLOSED');a.equal(part.handoff_status.companion,'NOT_COMMISSIONED');
 }
 const hr=m.inputs.find(r=>r.path.endsWith('/'+id+'-textbook-handoff.md'));
 const boundary={'2.2.1':'This technical handoff does not commission Part B, authorize a future PR merge,',
  '2.2.2':'This does not commission companion production or authorize any future PR merge.',
  '2.2.3':'READY_FOR_COMPANION as accepted source only; NOT_COMMISSIONED.'}[id];
 a(originals.get(hr.repository+'/'+hr.path).toString().includes(boundary),id);}
// Temporary actual files only; no live source mutation, no builder invocation.
const temp=fs.mkdtempSync('C:/wt/book2-224-release-probes-'),probes=[];
function guard(manifestBytes,root,onSuccess){a.equal(hash(manifestBytes),pinned);
 const candidate=JSON.parse(manifestBytes);a.deepEqual(candidate,m);
 for(const row of candidate.inputs){const key=row.repository+'/'+row.path,b=fs.readFileSync(path.join(root,key));
  a.equal(hash(b),row.raw_sha256,key);a(b.equals(originals.get(key)),key);}
 onSuccess();}
for(const [key,bytes]of originals){const dest=path.join(temp,key);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);}
let success=0;guard(input,temp,()=>success++);a.equal(success,1);
for(const [key,bytes]of originals){const dest=path.join(temp,key);
 for(const mode of ['missing','forged']){if(mode==='missing')fs.unlinkSync(dest);else fs.writeFileSync(dest,Buffer.concat([bytes,Buffer.from('\nforged release prerequisite\n')]));
  let calls=0;a.throws(()=>guard(input,temp,()=>calls++));a.equal(calls,0);probes.push({key,mode,rejected:true,success_callback_calls:0});fs.writeFileSync(dest,bytes);}
 const bad=JSON.parse(input),row=bad.inputs.find(r=>r.repository+'/'+r.path===key),changed=Buffer.concat([bytes,Buffer.from('\nforged synchronized input\n')]);
 row.raw_sha256=hash(changed);fs.writeFileSync(dest,changed);let calls=0;
 a.throws(()=>guard(Buffer.from(JSON.stringify(bad,null,2)+'\n'),temp,()=>calls++));a.equal(calls,0);
 probes.push({key,mode:'synchronized-file-and-manifest-hash-drift',rejected:true,success_callback_calls:0});fs.writeFileSync(dest,bytes);}
for(const mode of ['empty-manifest','partial-input-list']){let calls=0;const bad=JSON.parse(input);bad.inputs.pop();
 a.throws(()=>guard(mode==='empty-manifest'?Buffer.alloc(0):Buffer.from(JSON.stringify(bad)),temp,()=>calls++));a.equal(calls,0);
 probes.push({mode,rejected:true,success_callback_calls:0});}
a.equal(probes.length,104);guard(input,temp,()=>success++);a.equal(success,2);
const resolved=path.resolve(temp),parent=path.resolve('C:/wt');a.equal(path.dirname(resolved),parent);a(path.basename(resolved).startsWith('book2-224-release-probes-'));
fs.rmSync(resolved,{recursive:true});
const commands=[];
for(const[name,args]of [
 ['structural',['build-scripts/workflows/check-book-outline-currentness.js']],
 ['production224',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.4']],
 ['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],
 ['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]]){
 const r=cp.spawnSync(process.execPath,args,{cwd:P,maxBuffer:64*1024*1024}),rec={name,args,exit_code:r.status,stdout:r.stdout.toString(),stderr:r.stderr.toString(),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};
 commands.push(rec);fs.writeFileSync(path.join(__dirname,prefix+'-'+name+'.json'),JSON.stringify(rec,null,2)+'\n',{flag:'wx'});a.equal(r.status,0,JSON.stringify(rec));}
const final={status:'PASS',manifest_raw_sha256:pinned,inputs:rows,actual_negative_file_and_manifest_probes:probes,
 positive_callbacks:success,live_files_changed:0,temporary_fixture_removed:resolved,
 inherited223_six_postacceptance_gates:'Bound exact current root acceptance-check.json; unchanged inputs',
 fresh_gates:commands.map(c=>({name:c.name,exit_code:c.exit_code})),native_generation:'NOT RUN; author must implement and test equivalent guards before all builder effects',
 exact_plan_review_and_current_predecessors:true,decision:'RELEASED_FOR_GATED_PART_A_AUTHORING',no_future_merge_authority:true};
fs.writeFileSync(path.join(__dirname,prefix+'-check.json'),JSON.stringify(final,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',inputs:rows.length,probes:probes.length,manifest_raw_sha256:pinned,temporary_fixture_removed:resolved,fresh_gates:final.fresh_gates},null,2));
