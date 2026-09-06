'use strict';
// Bounded current specialist publication. Native evidence-only FAIL is preserved.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL';
const imported='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-NOUN-';
const PB='b3773c9b2a085ff83e82d7e71384ef10337d7c9c',LB='a52206c0cc9e2578b57e285909c77134bb47657e';
const OWN_P='ccf988b3414179bf9e8ba2d2d97034ef045a13e1',OWN_L='51264f0f2285a978802f8153c9cf4267e53559ce';
const branch='agent/book2-223-qc-renewal-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-223-QC-RENEWAL';
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const names=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const save=(label,obj)=>fs.writeFileSync(path.join(P,prefix+'-'+label+'.json'),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
function run(label,cwd,argv,expected=0,record=true,env=process.env){
 const started=new Date().toISOString(),r=cp.spawnSync(argv[0],argv.slice(1),{cwd,env,encoding:'utf8',maxBuffer:128*1024*1024});
 const result={argv,cwd,started_utc:started,finished_utc:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label,result);console.log(label+': '+r.status);
 if(expected!==null)assert.equal(r.status,expected,JSON.stringify(result));return result;
}
function strict(tail=false){
 const p=[...new Set([...names(P,'diff','--name-only','-z',PB),...names(P,'ls-files','--others','--exclude-standard','-z')])];
 assert(p.length);assert(p.every(v=>v.startsWith(prefix+'-')||v.startsWith(imported)||(tail&&indexes.includes(v))));
 const lp=names(L,'diff','--name-only','-z',LB);assert.deepEqual(lp.sort(),[rel+'2.2.3-review.md',rel+'2.2.3-quality-ref.yaml'].sort());
 assert.equal(git(L,'ls-files','--others','--exclude-standard'),'');
 const ownedLesson=names(L,'diff','--name-only','-z',OWN_L);assert.deepEqual(ownedLesson,[rel+'2.2.3-quality-ref.yaml']);
 const importedP=p.filter(v=>v.startsWith(imported));assert.equal(importedP.length,23);
 return {pass:true,unknown:0,platform_input:PB,lesson_input:LB,platform_paths:p,lesson_paths:lp,
   owned_lesson_paths:ownedLesson,reviewer_owned_imports:importedP,imported_lesson_review_separate:true};
}
function claim(clean=false,record=true){for(const [name,cwd]of [['platform',P],['lessons',L]]){
 run('claim-'+name,cwd,['node',path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent','paragraph_214_builder','--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],0,record);
}}
function paired(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,
 FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function scopes(record){
 const ph=git(P,'rev-parse','HEAD'),lh=git(L,'rev-parse','HEAD'),result=[];
 for(const [name,cwd,lane,base,head,expected]of [
  ['strict-incremental-platform',P,'shared',OWN_P,ph,1],['strict-incremental-lessons',L,'textbook',git(L,'rev-parse',OWN_L),lh,0],
  ['candidate-platform',P,'shared',PB,ph,1],['candidate-lessons',L,'textbook',LB,lh,0],
  ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',ph,0],
  ['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]){
  const r=run('scope-'+name,P,['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json'],expected,record);
  const out=JSON.parse(r.stdout);assert.equal(out.categories.unknown.length,0);
  result.push({name,base,head,status:out.ok?'PASS':'FAIL',unknown:0,failures:out.failures});
 }return result;
}
const mode=process.argv[2];
if(mode==='prepare'){
 for(const [name,cwd]of [['platform',P],['lessons',L]])run('fetch-'+name,cwd,['git','fetch','origin','--prune']);
 run('governance',P,['node','build-scripts/review-gates/check-governance-freshness.js']);claim();
 const inventory=strict();save('stage-inventory',inventory);
 const files=[...inventory.platform_paths.filter(v=>v.startsWith(prefix+'-')),prefix+'-stage-inventory.json'];
 for(let i=0;i<files.length;i+=30)git(P,'add','--',...files.slice(i,i+30));git(L,'add','--',rel+'2.2.3-quality-ref.yaml');
 for(const [name,cwd]of [['platform',P],['lessons',L]]){
  run('whitespace-'+name,cwd,['git','diff','--cached','--check'],null);
  run('whitespace-cr-at-eol-'+name,cwd,['git','-c','core.whitespace=cr-at-eol','diff','--cached','--check'],0);
 }
 git(P,'add','--',...['platform','lessons'].flatMap(v=>[prefix+'-whitespace-'+v+'.json',prefix+'-whitespace-cr-at-eol-'+v+'.json']));
}else if(mode==='scope'){
 assert.equal(git(P,'status','--porcelain'),'');assert.equal(git(L,'status','--porcelain'),'');
 const inventory=strict();save('actual-scope',{strict:inventory,platform_payload:git(P,'rev-parse','HEAD'),lesson_payload:git(L,'rev-parse','HEAD'),scopes:scopes(true),
   meaning:'Own and candidate platform evidence-only FAIL retained; complete actual Git baselines PASS. Imported reviewer path is not self-authored QC.'});
}else if(mode==='indexes'){
 assert.equal(git(P,'status','--porcelain'),'');assert.equal(git(L,'status','--porcelain'),'');
 run('paired-index-generation',P,['node','build-scripts/reports/github-agent-index.js'],0,false,paired());
 run('paired-url-generation',P,['node','build-scripts/sprints/emit-url-index.js'],0,false,paired());
 assert.deepEqual(names(P,'diff','--name-only','-z').sort(),[...indexes].sort());
}else if(mode==='final'){
 run('paired-index-freshness',P,['node','build-scripts/reports/check-agent-index-freshness.js'],0,false,paired());
 run('paired-url-freshness',P,['node','build-scripts/sprints/emit-url-index.js','--check'],0,false,paired());
 claim(true,false);assert.deepEqual(names(P,'diff','--name-only','-z','HEAD^..HEAD').sort(),[...indexes].sort());
 const pair=[];for(const [name,cwd]of [['platform',P],['lessons',L]]){
  assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);
  const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];
  assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));pair.push({repository:name,head,remote,clean:true});
 }
 console.log(JSON.stringify({pair,strict:strict(true),scopes:scopes(false),root_acceptance:'PENDING',production_ready:false},null,2));
}else throw Error('prepare/scope/indexes/final');
