'use strict';
// Plan-author publication only. No native production, review, PR or merge.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN';
const branch='agent/book2-232-production-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN',actor='paragraph_231_specialist_qc';
const baseP='0b15d6bfa75fa62e00e5945e16a7cd8f9a7f6bf6',baseL='3199ff2ae89b39a472b48ee0818de5b1c191063a';
const lesson='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md';
const indexes=['reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md'];
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024}).trim();
const list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const changed=(cwd,base,head='HEAD')=>list(cwd,'diff','--name-only','-z',base+'..'+head);
const save=(label,value)=>fs.writeFileSync(path.join(P,prefix+'-'+label+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const ownP=s=>s.startsWith(prefix+'-')||indexes.includes(s);
function run(label,cwd,command,args,allowed=[0],record=true,env=process.env){
 const started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,env});
 const result={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',result);
 console.log(label+': '+r.status);assert(allowed.includes(r.status),label+' unexpected exit; diagnostics preserved');return result;
}
function claim(clean=false,record=true){
 for(const [name,cwd]of [['platform',P],['lessons',L]])run(name+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);
}
function pairedEnv(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,
 FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function strict(){
 const p=changed(P,baseP),l=changed(L,baseL);
 assert(p.every(ownP),'Only owned plan evidence or exact four publication indexes');assert.deepEqual(l,[lesson]);
 return {status:'PASS',platform_base:baseP,platform_head:git(P,'rev-parse','HEAD'),lessons_base:baseL,lessons_head:git(L,'rev-parse','HEAD'),platform_paths:p,lessons_paths:l,unknown_paths:0,
   source_native_asset_review_QC_handoff_target_edits:0,role:'232plan-author',independent_plan_review:'PENDING',production_release:'PENDING'};
}
function scopes(record){
 const outcomes=[];
 for(const [label,cwd,lane,base,expect]of [
  ['own-platform',P,'shared',baseP,1],['own-lessons',L,'textbook',baseL,0],
  ['candidate-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],
  ['candidate-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]]){
  const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[0,1],record);
  const s=JSON.parse(r.stdout);assert.equal(s.categories.unknown.length,0,label+' UNKNOWN');
  const o={label,status:s.ok?'PASS':'FAIL',exit_code:r.exit_code,failures:s.failures,unknown:0};console.log(JSON.stringify(o));outcomes.push(o);
  assert.equal(r.exit_code,expect,label+' scope must reflect actual evidence-only increment');
 }
 return outcomes;
}
const mode=process.argv[2];
if(mode==='prepare'){
 claim();run('governance-final',P,'node',['build-scripts/review-gates/check-governance-freshness.js']);
 const pending=(cwd,base)=>[...new Set([...list(cwd,'diff','--name-only','-z',base),...list(cwd,'ls-files','--others','--exclude-standard','-z')])];
 const p=pending(P,baseP),l=pending(L,baseL);assert(p.every(ownP));assert.deepEqual(l,[lesson]);
 save('author-stage-inventory',{platform_input:baseP,lesson_input:baseL,platform_paths:p,lesson_paths:l,strict_owned_scope:'PASS',source_native_review_changes:0});
 for(const cwd of [P,L]){
  const rows=pending(cwd,cwd===P?baseP:baseL);for(let i=0;i<rows.length;i+=30)git(cwd,'add','--',...rows.slice(i,i+30));
 }
 run('platform-whitespace',P,'git',['diff','--cached','--check',baseP]);
 run('lessons-whitespace',L,'git',['diff','--cached','--check',baseL]);
}else if(mode==='finish-prepare'){
 // The first default whitespace check truthfully failed on native Windows
 // CRLF-only immutable result JSON. Do not rewrite or normalize that evidence.
 const first=JSON.parse(fs.readFileSync(path.join(P,prefix+'-platform-whitespace-process.json'),'utf8'));
 assert.equal(first.exit_code,2);
 const permitted=['checks-result.json','checks-result-r3.json','checks-result-r4.json'].map(s=>prefix+'-'+s);
 const diagnosed=[...new Set([...first.stdout.matchAll(/^(reports\/[^\r\n]+):\d+: trailing whitespace\.$/gm)].map(m=>m[1]))];
 assert.deepEqual(diagnosed.sort(),permitted.sort());
 for(const file of permitted){const bytes=fs.readFileSync(path.join(P,file),'utf8');assert(bytes.includes('\r\n'));assert(!/[ \t]+\r?\n/.test(bytes),'Real trailing spaces are not permitted');}
 const pending=cwd=>[...new Set([...list(cwd,'diff','--name-only','-z'),...list(cwd,'diff','--cached','--name-only','-z'),...list(cwd,'ls-files','--others','--exclude-standard','-z')])];
 const p=pending(P),l=pending(L);assert(p.every(ownP));assert.deepEqual(l,[lesson]);
 for(const [cwd,rows]of [[P,p],[L,l]])for(let i=0;i<rows.length;i+=30)git(cwd,'add','--',...rows.slice(i,i+30));
 run('platform-whitespace-cr-eol',P,'git',['-c','core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol','diff','--cached','--check',baseP]);
 run('lessons-whitespace',L,'git',['diff','--cached','--check',baseL]);
 console.log(JSON.stringify({default_platform_whitespace:'FAIL exit2 preserved',exact_CRLF_only_JSON:diagnosed,CRLF_aware_whole_increment:'PASS',evidence_rewritten:false}));
}else if(mode==='scope'){
 save('strict-own-scope',strict());scopes(true);
}else if(mode==='indexes'){
 // Each child invocation receives both roots, exact refs and branches explicitly.
 run('generate-paired-indexes',P,'node',['build-scripts/reports/github-agent-index.js'],[0],false,pairedEnv());
 run('sprint-url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false,pairedEnv());
}else if(mode==='final'){
 run('terminal-index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false,pairedEnv());
 run('terminal-url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false,pairedEnv());
 claim(true,false);const pair=[];
 for(const [name,cwd]of [['platform',P],['lessons',L]]){
  assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);
  const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];
  assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));pair.push({repository:name,head,remote,branch,clean:true});
 }
 const owned=strict(),actualScopes=scopes(false),tail=changed(P,'HEAD^');assert.deepEqual(tail.sort(),[...indexes].sort());
 console.log(JSON.stringify({terminal_pair:pair,strict_scope:owned,actual_scopes:actualScopes,terminal_four_index_tail:tail,independent_plan_review:'PENDING',root_validation:'PENDING',root_acceptance:'PENDING',production_release:'PENDING',native_rendered_proof:'NOT_APPLICABLE_PLAN_ONLY',timing:'UNOBSERVED',PR_merge_fullCI_classroom_claim:false},null,2));
}else throw Error('Use prepare/finish-prepare/scope/indexes/final');
