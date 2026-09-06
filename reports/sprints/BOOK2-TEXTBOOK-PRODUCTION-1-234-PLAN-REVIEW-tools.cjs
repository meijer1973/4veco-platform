'use strict';
// Task-owned evidence only. No native generator, lesson writer or foreign worktree writer.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-REVIEW';
const BP='d1fec4cb50b7d538b85291e2b773bb2663376cbe',BL='a9662869395f449a4d5dce907bfe58976f94ed01',branch='agent/book2-234-plan-review-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-REVIEW',actor='paragraph_224_builder';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=(root,f)=>fs.readFileSync(path.join(root,f));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024});
const rev=cwd=>git(cwd,'rev-parse','HEAD').trim();
const list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const save=(name,obj)=>fs.writeFileSync(path.join(P,prefix+'-'+name+'.json'),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
const owned=f=>f.startsWith(prefix+'-')||indexes.includes(f);
const env=()=>({...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:rev(P),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:rev(L),FOURVECO_LESSEN_SOURCE_BRANCH:branch});
function run(label,cwd,command,args,allowed=[0],record=true){
 const childEnv=env(),started_at=new Date().toISOString();
 const sources=args.filter(a=>a.endsWith('.cjs')||a.endsWith('.js')).map(a=>path.resolve(cwd,a)).filter(a=>fs.existsSync(a)).map(a=>({path:path.relative(P,a).replaceAll('\\','/'),raw_sha256:sha(fs.readFileSync(a)),source_utf8:fs.readFileSync(a,'utf8')}));
 const r=cp.spawnSync(command,args,{cwd,env:childEnv,maxBuffer:128*1024*1024});
 const result={command,args,cwd,started_at,ended_at:new Date().toISOString(),sources,environment:Object.fromEntries(Object.entries(childEnv).filter(([k])=>k.startsWith('FOURVECO_')||k.startsWith('PYTHON'))),exit_code:r.status,stdout:(r.stdout||Buffer.alloc(0)).toString('utf8'),stderr:(r.stderr||Buffer.alloc(0)).toString('utf8'),stdout_base64:(r.stdout||Buffer.alloc(0)).toString('base64'),stderr_base64:(r.stderr||Buffer.alloc(0)).toString('base64'),error:r.error?.message};
 if(record)save(label+'-process',result);console.log(label+': '+r.status);assert(allowed.includes(r.status),label+' actual failure retained');return result;
}
function custody(){const b=JSON.parse(read(P,prefix+'-baseline.json'));let n=0;for(const repo of b.repositories)for(const f of repo.files){if(repo.name==='platform'&&indexes.includes(f.path))continue;assert.equal(sha(read(repo.name==='platform'?P:L,f.path)),f.raw_sha256,f.path);n++;}return {status:'PASS',raw_prior_files_unchanged:n,lesson_exceptions:[],platform_exceptions:indexes};}
function strict(){const changed=(r,b)=>list(r,'diff','--name-only','-z',b+'..HEAD');const p=changed(P,BP),l=changed(L,BL);assert(p.every(owned));assert.deepEqual(l,[]);return {status:'PASS',unknown:0,platform_base:BP,platform_head:rev(P),lessons_base:BL,lessons_head:rev(L),platform_paths:p,lesson_paths:l};}
function scopes(record=true){return [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,1],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]].map(([label,cwd,lane,base,expected])=>{const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',rev(cwd),'--json'],[0,1],record);const v=JSON.parse(r.stdout);assert.equal(v.categories.unknown.length,0);assert.equal(r.exit_code,expected);return {label,base,head:rev(cwd),exit:r.exit_code,ok:v.ok,failures:v.failures,categories:Object.fromEntries(Object.entries(v.categories).map(([k,a])=>[k,a.length]))};});}
function claims(clean,record=false){for(const [n,cwd]of [['platform',P],['lessons',L]])run(n+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
const mode=process.argv[2];
if(mode==='baseline'){
 claims(false,true);
 const repositories=[['platform',P,BP],['lessons',L,BL]].map(([name,root,ref])=>({name,ref,files:list(root,'ls-tree','-r','-z',ref).map(r=>{const [meta,f]=r.split('\t'),oid=meta.split(' ')[2],b=read(root,f),actual=crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');assert.equal(actual,oid,f);return {path:f,bytes:b.length,git_blob:oid,raw_sha256:sha(b)};})}));
 const history=list(P,'ls-tree','-r','--name-only','-z',BP).filter(f=>f.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-')&&!f.startsWith(prefix+'-')).map(f=>({path:f,raw_sha256:sha(read(P,f)),bytes:read(P,f).length}));
 const author=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-baseline.json'));
 const instructions=author.instructions.map(v=>{const root=v.repository==='4veco-lessen'?L:P;assert.equal(sha(read(root,v.path)),v.raw_sha256,v.path);return {...v,reading_attribution:'This distinct reviewer personally read the complete required instructions; not relying on author interpretation.'};});
 for(const f of ['build-scripts/templates/template-textbook-paragraph-plan.md'])instructions.push({repository:'4veco-platform',path:f,raw_sha256:sha(read(P,f)),reading_attribution:'Personally read complete for this review.'});
 save('baseline',{actor,task,branch,repositories,instructions,author_and_release_history:history,exclusions:indexes});console.log(repositories.map(r=>[r.name,r.files.length]));
}else if(mode==='command'){run(process.argv[3],P,process.argv[4],process.argv.slice(5));}
else if(mode==='custody')console.log(JSON.stringify(custody()));
else if(mode==='scopes')save('actual-scope',{strict:strict(),native:scopes(),custody:custody()});
else if(mode==='stage'){
 claims(false);assert.equal(git(L,'status','--porcelain').trim(),'');const pending=[...new Set([...list(P,'diff','--name-only','-z'),...list(P,'diff','--cached','--name-only','-z'),...list(P,'ls-files','--others','--exclude-standard','-z')])];assert(pending.every(owned));const selected=pending.filter(f=>!indexes.includes(f));for(let i=0;i<selected.length;i+=30)git(P,'add','--',...selected.slice(i,i+30));run('owned-whitespace',P,'git',['diff','--cached','--check'],[0],false);console.log(JSON.stringify(custody()));
}else if(mode==='indexes'){
 run('paired-index-generation',P,'node',['--require','./'+prefix+'-index-runtime.cjs','build-scripts/reports/github-agent-index.js'],[0],false);
 run('url-index-check',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false);
 run('actual-NUL-inventory',P,'node',[prefix+'-index-runtime.cjs','verify'],[0],false);
}else if(mode==='final'){
 run('freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false);run('actual-NUL-inventory',P,'node',[prefix+'-index-runtime.cjs','verify'],[0],false);claims(true);
 const pair=[['platform',P],['lessons',L]].map(([repository,cwd])=>{assert.equal(git(cwd,'status','--porcelain').trim(),'');assert.equal(git(cwd,'branch','--show-current').trim(),branch);const head=rev(cwd),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).trim().split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch).trim());return {repository,head,remote,clean:true};});
 assert.deepEqual(list(P,'diff','--name-only','-z','HEAD^..HEAD').sort(),[...indexes].sort());console.log(JSON.stringify({pair,strict:strict(),custody:custody(),native_scopes:scopes(false),terminal_four_index_only:true,verdict:'PLAN_REVISE_F1',production_release:false,rendered_review:false},null,2));
}else throw Error('unknown evidence mode');
