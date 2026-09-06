'use strict';
// HOW TO ADAPT: new task/prefix/base pair only; exclusive evidence, no pupil build.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1';
const branch='agent/book2-232-plan-f1-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-F1',actor='paragraph_231_specialist_qc';
const BP='049c52976e749f233fe654618c9657f01aa988f4',BL='9daf4b8a9696fcdce1d485d85dbc0c59b7b6dbe6';
const REL='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md';
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
 const preservation=[['platform',P,BP],['lessons',L,BL]].map(([repository,root,base])=>({repository,base,rows:list(root,'ls-tree','-r','--name-only','-z',base).map(f=>{const b=read(root,f);return {path:f,bytes:b.length,raw_sha256:sha(b)};})}));
 assert.equal(sha(read(L,REL)),'df3d5c11364797f0d5b7190f2c0a2ce3c7cdd86d6d5e7fefde5c6e27d6d89967');
 const prior=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-REVIEW-custody.json'));
 const instructions=prior.instructions.filter(v=>!['skills/econ-consolidation-builder.md','references/authored/gemengde-opgaven-target-standard.md'].includes(v.path)).map(v=>{
  const root=v.repository==='4veco-platform'?P:L,b=read(root,v.path),oldRoot='C:/wt/book2-232-production-20260906/'+v.repository;
  assert.equal(sha(b),v.raw_sha256);assert(b.equals(read(oldRoot,v.path)));
  return {repository:v.repository,path:v.path,raw_sha256:sha(b),unchanged_from_personally_read_original232_pair:true};
 });
 const historical=list(P,'ls-tree','-r','--name-only','-z',BP).filter(f=>f.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-')&&f.endsWith('.json')).map(f=>{
  const b=read(P,f),v=JSON.parse(b);return {path:f,raw_sha256:sha(b),exit_code:v.exit_code??null,command:v.command??null,args:v.args??null};
 });
 const review='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-REVIEW-report.md';assert.equal(sha(read(P,review)),'9f9c69c0bce19dc42d5f958bd665a5fcde8fa5d65be638cf34b37e043803c875');
 save('baseline',{status:'PASS',platform_input:BP,lessons_input:BL,operational_commit:'8a9113d4801f9c2d71b28e9e3b144a5485893858',instructions,preservation,historical,review_preserved:'REVISE; one F1',review_raw_sha256:sha(read(P,review)),canonical_original_sha256:sha(read(L,REL)),product_generation:false});
 console.log(JSON.stringify({status:'PASS',instructions:instructions.length,prior_files:preservation.map(r=>({repository:r.repository,count:r.rows.length})),historical_records:historical.length}));
}else if(mode==='capture-delta'){
 const original=cp.execFileSync('git',['show',BL+':'+REL],{cwd:L,maxBuffer:128*1024*1024});
 const candidate=read(L,REL),diff=cp.execFileSync('git',['diff','--no-ext-diff','--unified=0',BL,'--',REL],{cwd:L,encoding:'utf8',maxBuffer:128*1024*1024});
 assert.equal(sha(original),'df3d5c11364797f0d5b7190f2c0a2ce3c7cdd86d6d5e7fefde5c6e27d6d89967');
 const hunks=[];let h;
 for(const line of diff.split('\n')){
  const m=line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
  if(m){h={old_start:Number(m[1]),old_count:Number(m[2]??1),new_start:Number(m[3]),new_count:Number(m[4]??1),old:[],replacement:[]};hunks.push(h);}
  else if(h&&line.startsWith('-'))h.old.push(line.slice(1));else if(h&&line.startsWith('+'))h.replacement.push(line.slice(1));
 }
 for(const h of hunks){assert.equal(h.old.length,h.old_count);assert.equal(h.replacement.length,h.new_count);}
 save('allowed-delta',{source_commit:BL,path:REL,original_raw_lf_sha256:sha(original),candidate_raw_lf_sha256:sha(candidate),allowed_changes:'F1 metadata, affected mapping,3c/4d full written tasks/models/criteria and optional-only20-minute workload; no other bytes',hunks});
 console.log(JSON.stringify({hunks:hunks.length,original_sha256:sha(original),candidate_sha256:sha(candidate),derivation_sha256:sha(read(P,prefix+'-allowed-delta.json'))}));
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
