'use strict';
// HOW TO ADAPT: new task/prefix/base pair only; exclusive evidence, no pupil build. Native final subprocesses use explicit UTF-8 output.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN';
const branch='agent/book2-233-plan-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN',actor='paragraph_231_specialist_qc';
const BP='c725c37d2081f6ac7846b8e172dcd7590f6611e9',BL='266881cb2d9e7f078192a2a3bab230f9bfc4176e';
const REL='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3-textbook-plan.md';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const read=(root,rel)=>fs.readFileSync(path.join(root,rel));
const json=s=>JSON.parse(read(P,prefix+'-'+s+'.json'));
const save=(s,v)=>fs.writeFileSync(path.join(P,prefix+'-'+s+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const own=f=>f.startsWith(prefix+'-')||indexes.includes(f);
function run(label,cwd,command,args,allowed=[0],record=true,env=process.env){
 const started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024,env:{...env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'}});
 const result={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',result);console.log(label+': '+r.status);assert(allowed.includes(r.status),label+' failed; original diagnostics retained');return result;
}
const changed=(cwd,base,head='HEAD')=>list(cwd,'diff','--name-only','-z',base+'..'+head);
function env(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function claim(clean,record){for(const [name,cwd]of [['platform',P],['lessons',L]])run(name+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
function strict(){const p=changed(P,BP),l=changed(L,BL);assert(p.every(own));assert.deepEqual(l,[REL]);return {status:'PASS',platform_base:BP,platform_head:git(P,'rev-parse','HEAD'),lessons_base:BL,lessons_head:git(L,'rev-parse','HEAD'),platform_paths:p,lessons_paths:l,unknown:0,old_source_review_QC_handoff_authority_changes:0};}
function scopes(record){return [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,0],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]].map(([label,cwd,lane,base,exit])=>{const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[0,1],record),v=JSON.parse(r.stdout);assert.equal(v.categories.unknown.length,0);assert.equal(r.exit_code,exit);return {label,exit:r.exit_code,ok:v.ok,failures:v.failures,categories:Object.fromEntries(Object.entries(v.categories).map(([k,v])=>[k,v.length]))};});}
function custody(){const b=json('baseline');let count=0;for(const r of b.preservation){const root=r.repository==='platform'?P:L;for(const v of r.rows){if(r.repository==='platform'&&indexes.includes(v.path)||r.repository==='lessons'&&v.path===REL)continue;assert.equal(sha(read(root,v.path)),v.raw_sha256,v.path);count++;}}console.log(JSON.stringify({raw_prior_files_unchanged:count,canonical_plan_only_lesson_exception:true,exact_four_index_exception:true}));return count;}
const mode=process.argv[2];
if(mode==='baseline'){
 claim(false,true);
 assert(!fs.existsSync(path.join(L,REL)),'Canonical233 plan must not already exist');
 const preservation=[['platform',P,BP],['lessons',L,BL]].map(([repository,root,base])=>({repository,base,rows:list(root,'ls-tree','-r','--name-only','-z',base).map(f=>{const b=read(root,f);return {path:f,bytes:b.length,raw_sha256:sha(b)};})}));
 const prior=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1-baseline.json'));
 const instructions=prior.instructions.map(v=>{const root=v.repository==='4veco-platform'?P:L,b=read(root,v.path);assert.equal(sha(b),v.raw_sha256);assert(b.equals(read('C:/wt/book2-232-plan-f1-20260906/'+v.repository,v.path)));return {...v,unchanged_from_personally_read_input_pair:true};});
 const record=JSON.parse(read(P,'references/authored/course-target-exercises.json')).exercises.find(r=>r.id==='2.3.3');
 assert.equal(sha(Buffer.from(JSON.stringify(record))),'eae9bcd6af7483a7ac9ccb2c57d5332b8cb96cd058853ac7ed9e25a3bdb5b0b2');
 save('baseline',{status:'PASS',platform_input:BP,lessons_input:BL,operational_commit:'e0f0531597845d632d8ebe4c29be2ca5b551914d',instructions,preservation,target_record:record,target_record_sha256:sha(Buffer.from(JSON.stringify(record))),upstream232:'F1 independent review PENDING',upstream213:'accepted succession PENDING',new_plan_absent:true,product_generation:false});
 console.log(JSON.stringify({status:'PASS',instructions:instructions.length,prior_files:preservation.map(r=>({repository:r.repository,count:r.rows.length}))}));
}else if(mode==='custody'){custody();}
else if(mode==='command'){run(process.argv[3],P,process.argv[4],process.argv.slice(5));}
else if(mode==='scopes'){save('actual-scope',{strict:strict(),native:scopes(true),raw_prior_files_unchanged:custody()});}
else if(mode==='stage'){
 claim(false,false);
 for(const [root,allowed]of [[P,own],[L,f=>f===REL]]){
  const pending=[...new Set([...list(root,'diff','--name-only','-z'),...list(root,'diff','--cached','--name-only','-z'),...list(root,'ls-files','--others','--exclude-standard','-z')])];assert(pending.every(allowed));
  for(let i=0;i<pending.length;i+=30)git(root,'add','--',...pending.slice(i,i+30));
  run((root===P?'platform':'lessons')+'-whitespace',root,'git',['diff','--cached','--check'],[0],false);
 }
 custody();
}else if(mode==='indexes'){
 run('paired-indexes',P,'node',['build-scripts/reports/github-agent-index.js'],[0],false,env());
 run('url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false,env());
}else if(mode==='final'){
 run('index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false,env());
 run('url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false,env());claim(true,false);
 const pair=[['platform',P],['lessons',L]].map(([repository,cwd])=>{assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));return {repository,head,remote,clean:true};});
 assert.deepEqual(changed(P,'HEAD^').sort(),[...indexes].sort());
 console.log(JSON.stringify({pair,strict:strict(),scopes:scopes(false),raw_prior_files_unchanged:custody(),terminal_four_index_only:true,independent_re_review:'PENDING',root_validation:'PENDING',root_acceptance:'PENDING',production_release:'PENDING',timing:'UNOBSERVED',hosted_fullCI:'PENDING',PR_merge:false},null,2));
}else throw Error('baseline/custody/command/scopes/stage/indexes/final');
