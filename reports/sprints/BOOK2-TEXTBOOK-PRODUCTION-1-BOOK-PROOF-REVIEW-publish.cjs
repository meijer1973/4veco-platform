'use strict';
// HOW TO ADAPT: new review namespace/commit bindings, never rewrite published proof.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW';
const task='BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW',actor='paragraph_231_specialist_qc',branch='agent/book2-book-proof-review-20260906';
const baseP='efbac988f46b9daccacb47cdf90cd88d01430733',baseL='30f57bfad2096c7afa507da48db9d82ee35a3c23';
const payload='e5edeb270120bc9ae041673267adddcd5575766f';
const indexes=['reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md'];
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const changed=(cwd,base,head='HEAD')=>list(cwd,'diff','--name-only','-z',base+'..'+head);
const owned=s=>s.startsWith(prefix+'-')||indexes.includes(s);
const save=(label,value)=>fs.writeFileSync(path.join(P,prefix+'-'+label+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
function run(label,cwd,command,args,expected=0,record=true,env=process.env){
 const started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,env,encoding:'utf8',maxBuffer:64*1024*1024});
 const result={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',result);console.log(label+': '+r.status);assert.equal(r.status,expected,label+' unexpected exit');return result;
}
function env(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,
 FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function claims(clean=false,record=true){for(const [label,cwd]of [['platform',P],['lessons',L]])run(label+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],0,record);}
function strict(){
 const p=changed(P,baseP),l=changed(L,baseL);assert(p.every(owned));assert.deepEqual(l,[]);assert.equal(git(L,'rev-parse','HEAD'),baseL);
 const priorP=list(P,'diff','--name-only','-z',baseP),priorL=list(L,'diff','--name-only','-z',baseL);assert(priorP.every(owned));assert.deepEqual(priorL,[]);
 const source=['build-scripts/books/build-book.py','build-scripts/books/lib_book.py','build-scripts/content/book-2/book_pipeline.py','build-scripts/content/book-2/test_book_proof_namespace.py'];
 assert.equal(git(P,'diff','--name-only',payload,'--',...source),'');
 return {status:'PASS',reviewed_source_payload:payload,platform_base:baseP,platform_head:git(P,'rev-parse','HEAD'),lesson_base:baseL,lesson_head:baseL,platform_paths:p,lesson_paths:l,unknown:0,
 lesson_increment:'UNCHANGED; no native empty-diff PASS claimed',prior_sources_proofs_lessons:'UNCHANGED; Git clean-filter comparison, exact four publication indexes excepted',source_edits:0};
}
function scopes(record=true){
 const out=[];for(const [label,cwd,lane,base,expected]of [['own-platform',P,'shared',baseP,1],['candidate-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['candidate-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]]){
  const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],expected,record);
  const s=JSON.parse(r.stdout);assert.equal(s.categories.unknown.length,0);const row={label,status:s.ok?'PASS':'FAIL',exit_code:r.exit_code,failures:s.failures,unknown:0};out.push(row);console.log(JSON.stringify(row));
 }return out;
}
const mode=process.argv[2];
if(mode==='prepare'){
 claims();run('governance-final',P,'node',['build-scripts/review-gates/check-governance-freshness.js']);
 const rows=[...new Set([...list(P,'diff','--name-only','-z'),...list(P,'ls-files','--others','--exclude-standard','-z')])];assert(rows.every(owned));assert.equal(git(L,'status','--porcelain'),'');
 for(let i=0;i<rows.length;i+=30)git(P,'add','--',...rows.slice(i,i+30));run('review-whitespace',P,'git',['diff','--cached','--check',baseP]);
}else if(mode==='scope'){
 save('strict-scope',strict());scopes();
}else if(mode==='indexes'){
 run('generate-paired-indexes',P,'node',['build-scripts/reports/github-agent-index.js'],0,false,env());
 run('url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],0,false,env());
}else if(mode==='final'){
 run('index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],0,false,env());
 run('url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],0,false,env());
 claims(true,false);const pair=[];
 for(const [label,cwd]of [['platform',P],['lessons',L]]){
  assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);
  const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));pair.push({repository:label,head,remote,branch,clean:true});
 }
 const tail=changed(P,'HEAD^');assert.deepEqual(tail.sort(),[...indexes].sort());
 console.log(JSON.stringify({terminal_pair:pair,strict_scope:strict(),actual_scopes:scopes(false),terminal_index_tail:tail,review_verdict:'PASS_TECHNICAL',reviewed_payload:payload,root_integration:'PENDING',fullCI:'PENDING',student_visual_acceptance:'NOT_ASSESSED',merge:false},null,2));
}else throw Error('prepare/scope/indexes/final');
