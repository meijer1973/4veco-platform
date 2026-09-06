/* Exact author publication, not review or integration. No PR or merge. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),Q=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT');
const branch='agent/book2-223-alt-correction-20260906',baseP='e4fc984c9cb28c6f03d0f3040136af73315ca916',baseL='6663532621e1347c12f691862ee85200665ad14f';
const task='BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT',actor='paragraph_231_specialist_qc';
const stem='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit';
const title='2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit';
const sourcePaths=['theory.md','exercises.md','test_successor.py','test_alt_metadata.py'].map(n=>'build-scripts/content/book-2/223/'+n);
const lessonPaths=['paragraaf','opgaven'].flatMap(k=>['md','html','zip'].map(ext=>stem+'/'+title+' – '+k+'.'+ext));
const indexes=['reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md'];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const lines=s=>s.split(/\r?\n/).filter(Boolean);
const save=(label,value)=>fs.writeFileSync(Q+'-'+label+'.json',JSON.stringify(value,null,2)+'\n',{flag:'wx'});
function run(label,cwd,command,args,allowed=[0],record=true,env=process.env){
 const started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,env});
 const o={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',o);
 console.log(label+': '+r.status);assert(allowed.includes(r.status),label+' unexpected exit; full diagnostics preserved');return o;
}
function ownP(s,tail=false){return sourcePaths.includes(s)||/^reports\/sprints\/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT[-/.]/.test(s)||(tail&&indexes.includes(s));}
function changed(cwd,base,head='HEAD'){return lines(git(cwd,'-c','core.quotepath=false','diff','--name-only',base+'..'+head));}
function claim(clean=false,record=true){
 for(const [label,cwd]of [['platform',P],['lessons',L]])run(label+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);
}
const mode=process.argv[2];
if(mode==='prepare'){
 claim();run('governance-final',P,'node',['build-scripts/review-gates/check-governance-freshness.js']);
 const p=lines(git(P,'-c','core.quotepath=false','status','--porcelain','-z')).join('\n');
 const pfiles=[...new Set([...lines(git(P,'-c','core.quotepath=false','diff','--name-only')), ...lines(git(P,'ls-files','--others','--exclude-standard'))])];
 const lfiles=lines(git(L,'-c','core.quotepath=false','diff','--name-only'));
 assert(pfiles.every(s=>ownP(s)));assert.deepEqual(lfiles.sort(),[...lessonPaths].sort());
 assert.equal(git(L,'ls-files','--others','--exclude-standard'),'');
 for(let i=0;i<pfiles.length;i+=30)git(P,'add','--',...pfiles.slice(i,i+30));
 git(L,'add','--',...lessonPaths);
 const patch=git(P,'diff','--cached','--no-ext-diff','--binary',baseP,'--',...sourcePaths);
 const rows=sourcePaths.map(s=>({path:s,raw_sha256:hash(path.join(P,s)),bytes:fs.statSync(path.join(P,s)).size}));
 save('complete-source-delta',{platform_input:baseP,immutable_original:'3510fc4dd30c9c01f44111ecc022ae239e855758',
  exact_source_paths:sourcePaths,whole_candidate_bytes:rows,complete_git_patch:patch,
  derivation:'Two fixed complete-image-line attribute insertions; controller fixed insertion plus two exact call replacements; separate added regression file. Original seven source tests and whole four-pin generator remain exact.',
  independent_delta_review:'PENDING',root_acceptance:'PENDING'});
 run('platform-whitespace',P,'git',['diff','--cached','--check',baseP]);
 run('lessons-whitespace',L,'git',['diff','--cached','--check',baseL]);
 console.log(JSON.stringify({platform_staged:pfiles.length,lessons_staged:lfiles.length,source_hashes:rows},null,2));
}else if(mode==='scope'){
 const ph=git(P,'rev-parse','HEAD'),lh=git(L,'rev-parse','HEAD'),p=changed(P,baseP),l=changed(L,baseL);
 assert(p.every(s=>ownP(s)));assert.deepEqual(l.sort(),[...lessonPaths].sort());
 save('strict-own-scope',{status:'PASS',platform_base:baseP,platform_head:ph,lessons_base:baseL,lessons_head:lh,
  platform_paths:p,lessons_paths:l,unknown_paths:0,authored_image_lines_changed:2,printed_pdf_files_changed:0,
  generator_shared_pipeline_original_test_changes:0,old_review_QC_changes:0});
 for(const [label,cwd,lane,base,head]of [
  ['own-platform',P,'shared',baseP,ph],['own-lessons',L,'textbook',baseL,lh],
  ['candidate-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',ph],
  ['candidate-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh]]){
  const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json'],[0,1]);
  const result=JSON.parse(r.stdout);assert.equal(result.categories.unknown.length,0);
  console.log(JSON.stringify({label,status:result.ok?'PASS':'FAIL',exit_code:r.exit_code,failures:result.failures,unknown:result.categories.unknown.length}));
 }
}else if(mode==='indexes'){
 const env={...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),
  FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};
 run('generate-paired-indexes',P,'node',['build-scripts/reports/github-agent-index.js'],[0],false,env);
 run('sprint-url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false,env);
 console.log(JSON.stringify({paired_environment:env.FOURVECO_LESSEN_ROOT,platform_ref:env.FOURVECO_PLATFORM_SOURCE_REF,lesson_ref:env.FOURVECO_LESSEN_SOURCE_REF,branch}));
}else if(mode==='final'){
 const env={...process.env,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};
 run('terminal-index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false,env);
 run('terminal-url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false,env);
 claim(true,false);
 const result=[];
 for(const [label,cwd,base]of [['platform',P,baseP],['lessons',L,baseL]]){
  assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);
  const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];
  assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));
  const paths=changed(cwd,base);assert(label==='platform'?paths.every(s=>ownP(s,true)):JSON.stringify(paths.sort())===JSON.stringify([...lessonPaths].sort()));
  result.push({repository:label,head,remote,branch,clean:true,strict_scope:'PASS',paths:paths.length});
 }
 for(const [label,cwd,lane,base]of [
  ['own-platform',P,'shared',baseP],['own-lessons',L,'textbook',baseL],
  ['candidate-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479'],
  ['candidate-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d']]){
  const response=run('terminal-scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[0],false);
  const scope=JSON.parse(response.stdout);assert(scope.ok);assert.equal(scope.categories.unknown.length,0);
  console.log(JSON.stringify({scope:label,status:'PASS',unknown:0}));
 }
 const tail=changed(P,'HEAD^');assert.deepEqual(tail.sort(),[...indexes].sort());
 console.log(JSON.stringify({terminal_pair:result,terminal_index_tail:tail,role:'223metadataauthor',independent_delta_review:'PENDING',specialist_renewal:'PENDING',root_validation:'PENDING',root_acceptance:'PENDING',handoff_renewal:'PENDING'},null,2));
}else throw Error('Use prepare/scope/indexes/final');
