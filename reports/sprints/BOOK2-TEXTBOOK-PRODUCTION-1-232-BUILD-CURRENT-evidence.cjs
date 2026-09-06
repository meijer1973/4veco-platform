'use strict';
// Task-local evidence transport. No authority or shared writer changes.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),assert=require('assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),N='BOOK2-TEXTBOOK-PRODUCTION-1-232-BUILD-CURRENT-';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:128*1024*1024});
const save=(suffix,obj)=>fs.writeFileSync(path.join(__dirname,N+suffix+'.json'),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
function inventory(cwd){
 const raw=git(cwd,'ls-tree','-rz','HEAD'),records=raw.toString('utf8').split('\0').filter(Boolean).map(line=>{const cut=line.indexOf('\t'),[mode,type,blob]=line.slice(0,cut).split(' '),name=line.slice(cut+1);assert.equal(type,'blob');const bytes=fs.readFileSync(path.join(cwd,name));const actual=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');return {path:name,mode,blob,working_git_blob:actual,raw_sha256:sha(bytes),size:bytes.length};});
 return {cwd,head:git(cwd,'rev-parse','HEAD').toString().trim(),branch:git(cwd,'branch','--show-current').toString().trim(),literal_nul_tree_sha256:sha(raw),status:git(cwd,'status','--porcelain=v1','-z').toString('utf8'),records};
}
function baseline(){
 const prior=JSON.parse(fs.readFileSync('C:/wt/book2-234-plan-f1-review-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-F1-REVIEW-baseline.json'));
 const instructions=prior.instructions.map(row=>{const root=row.repository==='4veco-lessen'?L:P;const name=row.path;return {...row,current_path:path.join(root,name),current_raw_sha256:sha(fs.readFileSync(path.join(root,name))),reading:'Complete personal read by this same actor in prior 234 review; task-specific fresh rereads recorded in work order. Byte identity is checked, not another reviewer credit.'};});
 save('baseline',{date:new Date().toISOString(),actor:'paragraph_231_specialist_qc',operation_commit:git(P,'rev-parse','HEAD').toString().trim(),platform:inventory(P),lessons:inventory(L),instructions,prior_instruction_record:'C:/wt/book2-234-plan-f1-review-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-F1-REVIEW-baseline.json'});
 console.log('Saved complete paired raw/Git custody baseline.');
}
function run(label,argv,cwd=P){const start=new Date().toISOString(),r=cp.spawnSync(argv[0],argv.slice(1),{cwd,maxBuffer:128*1024*1024,env:{...process.env,PLATFORM_ROOT:P,LESSON_ROOT:L,LESSONS_ROOT:L,PYTHONIOENCODING:'utf-8'}});const data={argv,cwd,start,finish:new Date().toISOString(),exit_code:r.status,error:r.error?.message,stdout:r.stdout?.toString('utf8'),stderr:r.stderr?.toString('utf8'),stdout_base64:r.stdout?.toString('base64'),stderr_base64:r.stderr?.toString('base64')};save(label+'-process',data);console.log(JSON.stringify({label,status:r.status,stdout:data.stdout?.slice(-2000),stderr:data.stderr?.slice(-1000)}));return r.status;}
function gates(tag){for(const [label,args] of [['release',['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-214-232-INPUT-ROOT-gate.cjs','232']],['structural',['build-scripts/workflows/check-book-outline-currentness.js']],['production',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.3.2']],['durable',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']],['bundle',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']]])assert.equal(run(tag+'-'+label,[process.execPath,...args]),0,label);}
if(require.main===module){const [mode,...args]=process.argv.slice(2);if(mode==='baseline')baseline();else if(mode==='gates')gates(args[0]);else if(mode==='run')process.exitCode=run(args[0],args.slice(1));else throw Error('baseline | gates tag | run label executable ...args');}
module.exports={P,L,N,sha,git,save,inventory,run,gates};
