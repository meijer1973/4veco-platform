'use strict';
// Exclusive independent plan-review custody/publication controller. No pupil build.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-REVIEW';
const branch='agent/book2-233-plan-review-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-REVIEW',actor='paragraph_214_builder';
const BP='8f702dd8d8f2428217d5220d8bae7336054dcaad',BL='192d6624524e7605ab9d8d26067927b95041386e';
const REL='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3-textbook-plan.md';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const blob=(cwd,ref,f)=>cp.execFileSync('git',['show',ref+':'+f],{cwd,maxBuffer:128*1024*1024});
const list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const read=(root,rel)=>fs.readFileSync(path.join(root,rel));
const json=s=>JSON.parse(read(P,prefix+'-'+s+'.json'));
const save=(s,v)=>fs.writeFileSync(path.join(P,prefix+'-'+s+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const own=f=>f.startsWith(prefix+'-')||indexes.includes(f);
function pairedEnv(){return {...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function run(label,cwd,command,args,allowed=[0],record=true){
 const env=pairedEnv(),started_at=new Date().toISOString();
 const r=cp.spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024,env});
 const result={command,args,cwd,environment:{PYTHONIOENCODING:env.PYTHONIOENCODING,PYTHONDONTWRITEBYTECODE:env.PYTHONDONTWRITEBYTECODE,...Object.fromEntries(Object.entries(env).filter(([k])=>k.startsWith('FOURVECO_')))},started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr,error:r.error?.message};
 if(record)save(label+'-process',result);console.log(label+': '+r.status);assert(allowed.includes(r.status),label+' failed: original record preserved');return result;
}
const changed=(cwd,base,head='HEAD')=>list(cwd,'diff','--name-only','-z',base+'..'+head);
function claims(clean,record){for(const [n,cwd]of [['platform',P],['lessons',L]])run(n+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
function strict(){const p=changed(P,BP),l=changed(L,BL);assert(p.every(own));assert.deepEqual(l,[]);return {status:'PASS',unknown:0,platform_base:BP,platform_head:git(P,'rev-parse','HEAD'),lessons_base:BL,lessons_head:git(L,'rev-parse','HEAD'),platform_paths:p,lessons_paths:l};}
function custody(){let n=0;for(const r of json('baseline').preservation){const root=r.repository==='platform'?P:L;for(const v of r.rows){if(root===P&&indexes.includes(v.path))continue;assert.equal(sha(read(root,v.path)),v.raw_sha256,v.path);n++;}}return {status:'PASS',raw_prior_files_unchanged:n,lesson_exceptions:[],platform_exceptions:indexes};}
function scopes(record){return [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,1],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]].map(([label,cwd,lane,base,exit])=>{const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[0,1],record),v=JSON.parse(r.stdout);assert.equal(v.categories.unknown.length,0);assert.equal(r.exit_code,exit);return {label,exit:r.exit_code,ok:v.ok,failures:v.failures,categories:Object.fromEntries(Object.entries(v.categories).map(([k,v])=>[k,v.length]))};});}
const mode=process.argv[2];
if(mode==='baseline'){
 claims(false,true);
 const preservation=[['platform',P,BP],['lessons',L,BL]].map(([repository,root,base])=>({repository,base,rows:list(root,'ls-tree','-r','--name-only','-z',base).map(f=>{const b=read(root,f);return {path:f,bytes:b.length,raw_sha256:sha(b)};})}));
 const oldRoot='C:/wt/book2-232-f1-review-20260906',old=JSON.parse(read(oldRoot+'/4veco-platform','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW-baseline.json'));
 const instructions=old.instructions.map(v=>{const root=v.repository==='4veco-platform'?P:L;assert.equal(sha(read(root,v.path)),v.raw_sha256);assert(read(root,v.path).equals(read(oldRoot+'/'+v.repository,v.path)));return {...v,reading_attribution:'This continuing actor personally read these complete unchanged instructions in its prior 214/212/223/232/213 phases, as bound in its OWN 232 review; selected AGENTS, review, strategy, Part A, figure/render/PDF and all current target/plan inputs reread for 233. No author-reading attribution.'};});
 const supplemental=[['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-ROOT-result.md',P,'b2dbe06bc8a0f440d6de8be2f3e6bd25f1eb8355'],['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-ROOT-current-prerequisite-boundary.json',P,'b2dbe06bc8a0f440d6de8be2f3e6bd25f1eb8355']].map(([file,cwd,ref])=>({file,ref,raw_sha256:sha(blob(cwd,ref,file)),read_only:true}));
 const rel232=REL.replace('2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3','2.3.2 Producentensurplus en totaal surplus/2.3.2');
 assert(blob(L,'9f9729a9b4a55805d9e24bf53f712f1b02f6e00a',rel232).equals(read(L,rel232)));
 supplemental.push({file:rel232,ref:'9f9729a9b4a55805d9e24bf53f712f1b02f6e00a',raw_sha256:sha(read(L,rel232)),read_only:true});
 const review='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-F1-REVIEW-report.md';
 supplemental.push({file:review,ref:'3b0efba4db7fda306e289715ffc237aa087b1319',raw_sha256:sha(blob(P,'3b0efba4db7fda306e289715ffc237aa087b1319',review)),read_only:true});
 assert.equal(sha(read(L,REL)),'0870d848b21017fedde86fb8d738bbe6afa21f68f8c1190905a8c0f2e3b8be19');
 const record=JSON.parse(read(P,'references/authored/course-target-exercises.json')).exercises.find(v=>v.id==='2.3.3');
 const history=list(P,'ls-tree','-r','--name-only','-z',BP).filter(f=>f.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-')).map(f=>({file:f,raw_sha256:sha(read(P,f))}));
 save('baseline',{status:'PASS',platform_input:BP,lessons_input:BL,operational_commit:'bc2c422ce6fcaf9550700a9df8bfc09f7e91d9a7',instructions,preservation,supplemental,history,target_record:record,target_record_sha256:sha(Buffer.from(JSON.stringify(record))),plan_raw_sha256:sha(read(L,REL)),lesson_changes_allowed:[],rendered_generation:false});
 console.log(JSON.stringify({instructions:instructions.length,prior_files:preservation.map(v=>[v.repository,v.rows.length]),history:history.length,supplemental}));
}else if(mode==='command'){run(process.argv[3],P,process.argv[4],process.argv.slice(5));}
else if(mode==='custody'){console.log(JSON.stringify(custody()));}
else if(mode==='integrity'){
 const gates=['independent-checks-r3','author-readonly-r2','structural-currentness','goal-design-currentness','durable-targets','active-bundle','governance-freshness','custody-r1'].map(n=>{const f=prefix+'-'+n+'-process.json',v=JSON.parse(read(P,f));assert.equal(v.exit_code,0);return {file:f,raw_sha256:sha(read(P,f)),exit_code:v.exit_code};});
 assert.equal(JSON.parse(json('independent-checks-r3-process').stdout).assertions,690);
 assert.equal(JSON.parse(json('author-readonly-r2-process').stdout).negative_plan_probe_count,148);
 assert.equal(json('author-readonly-r1-process').exit_code,1);
 const pending=[...new Set([...list(P,'diff','--name-only','-z'),...list(P,'diff','--cached','--name-only','-z'),...list(P,'ls-files','--others','--exclude-standard','-z')])];assert(pending.every(own));assert.equal(git(L,'status','--porcelain'),'');
 const bindings=['result.md','check.py','tools.cjs','author-readonly-paths.py','baseline.json'].map(n=>({file:prefix+'-'+n,raw_sha256:sha(read(P,prefix+'-'+n))}));
 save('final-integrity',{status:'PASS',actor,role:'independent233PlanReviewer',platform_input:BP,lessons_input:BL,working_platform_head:git(P,'rev-parse','HEAD'),pending_owned_paths:pending,gates,bindings,custody:custody(),plan_raw_sha256:sha(read(L,REL)),lesson_changes:[],old_author_readonly_failure_preserved:true,rendering_performed:false,root_validation:'PENDING',root_acceptance:'PENDING',production_release:'PENDING',classroom_timing:'UNOBSERVED'});
}
else if(mode==='scopes'){save('actual-scope',{strict:strict(),native:scopes(true),custody:custody()});}
else if(mode==='stage'){
 claims(false,false);assert.equal(git(L,'status','--porcelain'),'');
 const pending=[...new Set([...list(P,'diff','--name-only','-z'),...list(P,'diff','--cached','--name-only','-z'),...list(P,'ls-files','--others','--exclude-standard','-z')])];assert(pending.every(own));
 for(let i=0;i<pending.length;i+=30)git(P,'add','--',...pending.slice(i,i+30));
 run('platform-whitespace',P,'git',['diff','--cached','--check'],[0],false);console.log(JSON.stringify(custody()));
}else if(mode==='indexes'){
 run('paired-indexes',P,'node',['build-scripts/reports/github-agent-index.js'],[0],false);
 run('url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false);
}else if(mode==='final'){
 run('index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false);
 run('url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false);claims(true,false);
 const pair=[['platform',P],['lessons',L]].map(([repository,cwd])=>{assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));return {repository,head,remote,clean:true};});
 assert.deepEqual(changed(P,'HEAD^').sort(),[...indexes].sort());
 console.log(JSON.stringify({pair,strict:strict(),native_scopes:scopes(false),custody:custody(),terminal_four_index_only:true,root_validation:'PENDING',root_acceptance:'PENDING',production_release:'PENDING',rendered_inspection:false,timing:'UNOBSERVED',PR_merge:false},null,2));
}else throw Error('baseline/command/custody/scopes/stage/indexes/final');
