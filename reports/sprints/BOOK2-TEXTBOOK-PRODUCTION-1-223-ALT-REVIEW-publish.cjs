/* Independent review publication only. No source repair, QC acceptance or merge. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW',Q=path.join(__dirname,prefix);
const branch='agent/book2-223-alt-review-20260906',actor='paragraph_224_builder';
const baseP='5c914aecb17cd47ee1aa1cf1cd8db13131f34827',baseL='f52b039c00d16cf9ee59573b31cae39de96ce779';
const completeP='96416b6b5bd57094576e9aba0a42d682584ec479',completeL='f09fd6e88edc5049b026b16b0158e7e188091d2d';
const review='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3-review.md';
const reviewHash='e603b62ba2d77e1c33db6aeeaeb24d9b41ec7a136f26020bc3b5081e0a2e56a4';
const indexes=['reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const lines=s=>s.split(/\r?\n/).filter(Boolean);
const changed=(cwd,base,head='HEAD')=>lines(git(cwd,'-c','core.quotepath=false','diff','--name-only',base+'..'+head));
const ownP=(s,tail=false)=>s.startsWith('reports/sprints/'+prefix+'-')||(tail&&indexes.includes(s));
const save=(label,data)=>fs.writeFileSync(Q+'-'+label+'.json',JSON.stringify(data,null,2)+'\n',{flag:'wx'});
function run(label,cwd,command,args,allowed=[0],record=true,env=process.env){
 const started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,env});
 const result={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',result);
 console.log(label+': '+r.status);assert(allowed.includes(r.status),label+' unexpected exit; diagnostics retained');return result;
}
function claims(clean=false,record=true){
 for(const [label,cwd]of [['platform',P],['lessons',L]])run(label+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',prefix,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);
}
function pairedEnv(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function scopes(record){
 const result=[];
 for(const [label,cwd,lane,base,expected]of [
  ['own-platform',P,'shared',baseP,1],['own-lessons',L,'textbook',baseL,0],
  ['complete-platform',P,'shared',completeP,0],['complete-lessons',L,'textbook',completeL,0]]){
  const head=git(cwd,'rev-parse','HEAD');
  const response=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json'],[expected],record);
  const scope=JSON.parse(response.stdout);assert.equal(scope.categories.unknown.length,0);
  assert.equal(scope.ok,expected===0);
  result.push({label,base,head,lane,exit:response.exit_code,status:scope.ok?'PASS':'FAIL',unknown:0,
   categories:Object.fromEntries(Object.entries(scope.categories).map(([k,v])=>[k,v.length])),failures:scope.failures});
 }
 return result;
}
const mode=process.argv[2];
if(mode==='prepare'){
 for(const [label,cwd]of [['platform',P],['lessons',L]]){
  assert.equal(git(cwd,'branch','--show-current'),branch);
  run(label+'-fetch',cwd,'git',['fetch','--prune','origin']);
 }
 claims();run('governance-final',P,'node',['build-scripts/review-gates/check-governance-freshness.js']);
 const pfiles=[...new Set([...lines(git(P,'-c','core.quotepath=false','diff','--name-only')),...lines(git(P,'ls-files','--others','--exclude-standard'))])];
 assert(pfiles.length>0&&pfiles.every(s=>ownP(s)));
 assert.deepEqual(lines(git(L,'-c','core.quotepath=false','diff','--name-only')),[review]);
 assert.equal(git(L,'ls-files','--others','--exclude-standard'),'');
 assert.equal(sha(fs.readFileSync(path.join(L,review))),reviewHash);
 const old=cp.execFileSync('git',['show',baseL+':'+review],{cwd:L,maxBuffer:2*1024*1024});
 assert.equal(sha(old),'793c8460e7d20e8a2e40d7e8912c969c94a091e67fa25566c812264c8769539e');
 save('historical-review',{lessons_commit:baseL,path:review,raw_sha256:sha(old),utf8:old.toString('utf8'),attribution:'paragraph_223_independent_review; immutable historical record, not current reviewer observations'});
 for(let i=0;i<pfiles.length;i+=30)git(P,'add','--',...pfiles.slice(i,i+30));
 git(L,'add','--',review);
 run('platform-whitespace',P,'git',['diff','--cached','--check',baseP]);
 run('lessons-whitespace',L,'git',['diff','--cached','--check',baseL]);
 console.log(JSON.stringify({owned_platform_files:pfiles.length,lesson_change:review,review_raw_sha256:reviewHash}));
}else if(mode==='scope'){
 const ph=git(P,'rev-parse','HEAD'),lh=git(L,'rev-parse','HEAD'),p=changed(P,baseP),l=changed(L,baseL);
 assert(p.length>0&&p.every(s=>ownP(s)));assert.deepEqual(l,[review]);
 assert.equal(sha(fs.readFileSync(path.join(L,review))),reviewHash);
 const comparisons=scopes(true);
 const fileRows=p.map(name=>{const bytes=cp.execFileSync('git',['show',ph+':'+name],{cwd:P,maxBuffer:32*1024*1024});assert.equal(sha(fs.readFileSync(path.join(P,name))),sha(bytes));return {path:name,raw_sha256:sha(bytes),bytes:bytes.length};});
 save('strict-own-scope',{status:'PASS',actual_actor:actor,role:'223independentDeltaParagraphReviewer',platform_base:baseP,platform_payload:ph,lessons_base:baseL,lessons_payload:lh,
  own_platform_files:fileRows,own_lesson_paths:l,review_raw_sha256:reviewHash,comparisons,unknown_paths:0,
  native_evidence_only_FAIL_retained:true,genuine_complete_baselines:true,artificial_anchor:false,
  source_target_plan_QC_handoff_changes:0,scope_tail:'new owned scope/publication evidence only; then separate four-index tail'});
 console.log(JSON.stringify(comparisons,null,2));
}else if(mode==='indexes'){
 const env=pairedEnv();
 run('generate-paired-indexes',P,'node',['build-scripts/reports/github-agent-index.js'],[0],false,env);
 run('sprint-url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false,env);
 const dirty=lines(git(P,'-c','core.quotepath=false','diff','--name-only'));
 assert.deepEqual([...dirty].sort(),[...indexes].sort());assert.equal(git(P,'ls-files','--others','--exclude-standard'),'');
 console.log(JSON.stringify({platform_ref:env.FOURVECO_PLATFORM_SOURCE_REF,lessons_ref:env.FOURVECO_LESSEN_SOURCE_REF,branch,exact_tail:dirty}));
}else if(mode==='final'){
 const env=pairedEnv();
 run('terminal-index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false,env);
 run('terminal-url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false,env);
 claims(true,false);const result=[];
 for(const [label,cwd,base]of [['platform',P,baseP],['lessons',L,baseL]]){
  assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);
  const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];
  assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));
  const paths=changed(cwd,base);assert(label==='platform'?paths.every(s=>ownP(s,true)):JSON.stringify(paths)===JSON.stringify([review]));
  result.push({repository:label,head,remote,branch,clean:true,strict_scope:'PASS',paths:paths.length});
 }
 assert.equal(sha(fs.readFileSync(path.join(L,review))),reviewHash);
 const comparison=scopes(false),tail=changed(P,'HEAD^');assert.deepEqual([...tail].sort(),[...indexes].sort());
 console.log(JSON.stringify({terminal_pair:result,comparisons:comparison,terminal_index_tail:tail,review_raw_sha256:reviewHash,
  source_delta:'PASS',paragraph_review:'PASS WITH FLAGS',specialist_QC:'historical REVISE; renewal PENDING',root_acceptance:'PENDING',handoff:'ABSENT',PR_merge:false,full_current_CI:'NOT RUN'},null,2));
}else throw Error('Use prepare/scope/indexes/final');
