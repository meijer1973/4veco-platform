'use strict';
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const BP='8e2c8aff7d71875ce38740be410d2d771c1516b3',BL='9daf4b8a9696fcdce1d485d85dbc0c59b7b6dbe6';
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-REVIEW';
const branch='agent/book2-232-plan-review-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-REVIEW',actor='paragraph_224_builder';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const names=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const save=(label,data)=>fs.writeFileSync(path.join(P,prefix+'-'+label+'.json'),JSON.stringify(data,null,2)+'\n',{flag:'wx'});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function run(label,cwd,command,args,allowed=[0],record=true,env=process.env){
 const started_at=new Date().toISOString();const r=cp.spawnSync(command,args,{cwd,encoding:'utf8',env,maxBuffer:128*1024*1024});
 const value={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',value);console.log(label+': '+r.status);assert(allowed.includes(r.status),label+' failure preserved');return value;
}
function claim(clean,record){for(const [name,root]of [['platform',P],['lessons',L]])run(name+'-claim',root,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
function pending(cwd,base){return [...new Set([...names(cwd,'diff','--name-only','-z',base),...names(cwd,'ls-files','--others','--exclude-standard','-z')])];}
function strict(){
 const p=pending(P,BP),l=pending(L,BL);assert(p.every(f=>f.startsWith(prefix+'-')||indexes.includes(f)));assert.deepEqual(l,[]);
 return {status:'PASS',platform_base:BP,platform_head:git(P,'rev-parse','HEAD'),lessons_base:BL,lessons_head:git(L,'rev-parse','HEAD'),platform_paths:p,lessons_paths:l,unknown_paths:0,canonical_plan_source_pupil_registry_prior_evidence_edits:0};
}
function scopes(record){
 const result=[];
 for(const [name,cwd,lane,base]of [['own-platform',P,'shared',BP],['own-lessons',L,'textbook',BL],
 ['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479'],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d']]){
  const r=run('scope-'+name,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[0,1],record);
  const s=JSON.parse(r.stdout);assert.equal(s.categories.unknown.length,0,name+' UNKNOWN');
  if(name.startsWith('complete'))assert.equal(r.exit_code,0,'Genuine complete baseline must pass');
  if(name==='own-platform')assert.equal(r.exit_code,1,'Truthful evidence-only native failure');
  const item={name,base,head:git(cwd,'rev-parse','HEAD'),status:s.ok?'PASS':'FAIL',exit:r.exit_code,unknown:0,failures:s.failures,counts:Object.fromEntries(Object.entries(s.categories).map(([k,v])=>[k,v.length]))};result.push(item);console.log(JSON.stringify(item));
 }return result;
}
function paired(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
const mode=process.argv[2];
if(mode==='prepare'){
 for(const [name,cwd]of [['platform',P],['lessons',L]])run('fetch-'+name,cwd,'git',['fetch','origin','--prune']);
 claim(false,true);save('stage-inventory',strict());
 const paths=pending(P,BP);assert(paths.every(f=>f.startsWith(prefix+'-')));
 for(let i=0;i<paths.length;i+=30)git(P,'add','--',...paths.slice(i,i+30));
 run('owned-whitespace',P,'git',['diff','--cached','--check',BP]);
 git(P,'add','--',prefix+'-owned-whitespace-process.json');
 console.log(JSON.stringify({stage:'READY FOR SUBSTANTIVE COMMIT',lessons_unchanged:true}));
}else if(mode==='scope'){
 const subject=strict(),actual=scopes(true);
 const own=names(P,'ls-tree','-r','--name-only','-z','HEAD').filter(f=>f.startsWith(prefix+'-')).map(f=>{const b=fs.readFileSync(path.join(P,f));return {path:f,bytes:b.length,raw_sha256:sha(b)};});
 save('actual-scope',{subject,actual_scopes:actual,payload_evidence:own,verdict:'PLAN REVISE F1',production_release:'PENDING',lessons_changes:0});
}else if(mode==='indexes'){
 run('generate-indexes',P,'node',['build-scripts/reports/github-agent-index.js'],[0],false,paired());
 run('url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false,paired());
 const changed=names(P,'diff','--name-only','-z');assert.deepEqual(changed.sort(),[...indexes].sort());
}else if(mode==='final'){
 run('index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false,paired());
 run('url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false,paired());
 claim(true,false);const pair=[];
 for(const [name,root]of [['platform',P],['lessons',L]]){assert.equal(git(root,'status','--porcelain'),'');assert.equal(git(root,'branch','--show-current'),branch);const head=git(root,'rev-parse','HEAD'),remote=git(root,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(root,'rev-parse','origin/'+branch));pair.push({name,head,remote,branch,clean:true});}
 assert.deepEqual(names(P,'diff','--name-only','-z','HEAD^..HEAD').sort(),[...indexes].sort());
 console.log(JSON.stringify({pair,strict_scope:strict(),native_scopes:scopes(false),report_sha256:sha(fs.readFileSync(path.join(P,prefix+'-report.md'))),custody_sha256:sha(fs.readFileSync(path.join(P,prefix+'-custody.json'))),verdict:'PLAN REVISE F1',production_release:'PENDING',PR_merge_fullCI_claim:false},null,2));
}else throw Error('prepare/scope/indexes/final');
