'use strict';
// HOW TO ADAPT: this explicit paired input and zero-lesson-delta review only.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW';
const BP='c725c37d2081f6ac7846b8e172dcd7590f6611e9',BL='266881cb2d9e7f078192a2a3bab230f9bfc4176e';
const branch='agent/book2-232-f1-review-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW',actor='paragraph_214_builder';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const changed=(cwd,base,head='HEAD')=>list(cwd,'diff','--name-only','-z',base+'..'+head);
const save=(label,v)=>fs.writeFileSync(path.join(P,prefix+'-'+label+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const own=f=>f.startsWith(prefix+'-')||indexes.includes(f);
function pairEnv(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function run(label,cwd,argv,allowed=[0],record=false,env=process.env){
 const started=new Date().toISOString(),r=cp.spawnSync(argv[0],argv.slice(1),{cwd,env,encoding:'utf8',maxBuffer:128*1024*1024});
 const v={argv,cwd,started_utc:started,finished_utc:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',v); console.log(label+': '+r.status); assert(allowed.includes(r.status),JSON.stringify(v));return v;
}
function custody(){
 const b=JSON.parse(fs.readFileSync(path.join(P,prefix+'-baseline.json')));let n=0;
 for(const repo of b.preservation){const root=repo.repository==='platform'?P:L;for(const f of repo.files){if(root===P&&indexes.includes(f.path))continue;assert.equal(sha(fs.readFileSync(path.join(root,f.path))),f.sha256,f.path);n++;}}
 assert.equal(git(L,'status','--porcelain'),'');assert.equal(git(L,'rev-parse','HEAD'),BL);return n;
}
function strict(){const p=changed(P,BP),l=changed(L,BL);assert(p.every(own));assert.deepEqual(l,[]);return {status:'PASS',platform_base:BP,platform_head:git(P,'rev-parse','HEAD'),lessons_base:BL,lessons_head:git(L,'rev-parse','HEAD'),platform_paths:p,lesson_paths:l,unknown:0,lesson_changes:0};}
function claims(clean){for(const [name,cwd]of [['platform',P],['lessons',L]])run('claim-'+name,cwd,['node',path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])]);}
function scopes(record){return [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,0],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]].map(([label,cwd,lane,base,exit])=>{
 const r=run('scope-'+label,P,['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[0,1],record);const v=JSON.parse(r.stdout);assert.equal(v.categories.unknown.length,0);assert.equal(r.exit_code,exit);
 return {label,base,head:git(cwd,'rev-parse','HEAD'),exit:r.exit_code,ok:v.ok,failures:v.failures,categories:Object.fromEntries(Object.entries(v.categories).map(([k,v])=>[k,v.length]))};
 });}
const mode=process.argv[2];
if(mode==='stage'){
 claims(false);assert.equal(git(P,'branch','--show-current'),branch);
 const pending=[...new Set([...list(P,'diff','--name-only','-z'),...list(P,'diff','--cached','--name-only','-z'),...list(P,'ls-files','--others','--exclude-standard','-z')])];assert(pending.every(own));
 for(let i=0;i<pending.length;i+=20)git(P,'add','--',...pending.slice(i,i+20));
 run('own-staged-whitespace',P,['git','diff','--cached','--check']);console.log(JSON.stringify({prior_files_preserved:custody(),pending}));
}else if(mode==='scopes')save('actual-scope',{strict:strict(),native:scopes(true),raw_prior_files_preserved:custody(),production_profiles:'NOT PASS: current232 output not yet produced; plan-only report records exact13/10 errors'});
else if(mode==='indexes'){
 run('paired-index-generation',P,['node','build-scripts/reports/github-agent-index.js'],[0],false,pairEnv());
 run('url-index-generation',P,['node','build-scripts/sprints/emit-url-index.js'],[0],false,pairEnv());
}else if(mode==='final'){
 run('paired-index-currentness',P,['node','build-scripts/reports/check-agent-index-freshness.js'],[0],false,pairEnv());
 run('url-index-currentness',P,['node','build-scripts/sprints/emit-url-index.js','--check'],[0],false,pairEnv());claims(true);
 const pair=[['platform',P],['lessons',L]].map(([repository,cwd])=>{assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));return {repository,head,remote,clean:true};});
 assert.deepEqual(changed(P,'HEAD^').sort(),[...indexes].sort());
 console.log(JSON.stringify({pair,strict:strict(),native_scopes:scopes(false),raw_prior_files_preserved:custody(),terminal_four_indexes_only:true,plan_verdict:'PASS',F1:'CLOSED AT INDEPENDENT PLAN GATE',root_acceptance:'PENDING',production_release:'PENDING',native232_production:'NOT PERFORMED',PR_merge:false},null,2));
}else throw Error('stage/scopes/indexes/final');
