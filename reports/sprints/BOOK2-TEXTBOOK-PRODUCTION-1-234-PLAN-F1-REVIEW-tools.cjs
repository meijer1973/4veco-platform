'use strict';
// Independent review controller. Read-only subject; writes only this task's new evidence.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),A=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const pre='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-F1-REVIEW-',BP='2fcbd586a1d51cb3b07df48536e29ce8e0e35026',BL='e90d5c122a44fb0fd547339cf48558680cbc6ace';
const branch='agent/book2-234-plan-f1-review-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-F1-REVIEW',actor='paragraph_231_specialist_qc';
const indexes=['platform','lessen'].flatMap(x=>['json','md'].map(e=>`reports/github-agent-index-${x}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=(r,f)=>fs.readFileSync(path.join(r,f));
const git=(r,...args)=>cp.execFileSync('git',args,{cwd:r,encoding:'utf8',maxBuffer:128*1024*1024});
const rev=r=>git(r,'rev-parse','HEAD').trim(),list=(r,...args)=>git(r,...args).split('\0').filter(Boolean);
const save=(n,o)=>fs.writeFileSync(path.join(P,pre+n+'.json'),JSON.stringify(o,null,2)+'\n',{flag:'wx'});
const env=()=>({...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:rev(P),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:rev(L),FOURVECO_LESSEN_SOURCE_BRANCH:branch});
function run(n,cwd,command,args,allowed=[0],record=true){
 const e=env(),start=new Date().toISOString(),sources=args.filter(x=>/\.[cm]?js$/.test(x)).map(x=>path.resolve(cwd,x)).filter(fs.existsSync).map(f=>({path:path.relative(P,f).replaceAll('\\','/'),raw_sha256:sha(fs.readFileSync(f)),source_utf8:fs.readFileSync(f,'utf8')}));
 const r=cp.spawnSync(command,args,{cwd,env:e,maxBuffer:128*1024*1024}),out=r.stdout||Buffer.alloc(0),err=r.stderr||Buffer.alloc(0);
 const v={command,args,cwd,started_at:start,ended_at:new Date().toISOString(),sources,environment:Object.fromEntries(Object.entries(e).filter(([k])=>k.startsWith('FOURVECO_'))),exit_code:r.status,stdout:out.toString('utf8'),stderr:err.toString('utf8'),stdout_base64:out.toString('base64'),stderr_base64:err.toString('base64'),error:r.error?.message};
 if(record)save(n+'-process',v);console.log(n+': '+r.status);A(allowed.includes(r.status),n+' actual failure retained');return v;
}
function claims(clean,record=false){for(const [n,cwd]of [['platform',P],['lessons',L]])run(n+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
function custody(){const b=JSON.parse(read(P,pre+'baseline.json'));let n=0;for(const r of b.repositories)for(const f of r.files){if(r.name==='platform'&&indexes.includes(f.path))continue;A.equal(sha(read(r.name==='platform'?P:L,f.path)),f.raw_sha256,f.path);n++;}return{status:'PASS',raw_prior_files_unchanged:n,platform_exceptions:indexes,lesson_exceptions:[]};}
function strict(){const p=list(P,'diff','--name-only','-z',BP+'..HEAD'),l=list(L,'diff','--name-only','-z',BL+'..HEAD');A(p.every(f=>f.startsWith(pre)||indexes.includes(f)));A.deepEqual(l,[]);return{status:'PASS',unknown:0,base:{P:BP,L:BL},head:{P:rev(P),L:rev(L)},platform_paths:p,lesson_paths:l};}
function scopes(record=true){return [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,1],['whole-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['whole-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]].map(([n,cwd,lane,base,expected])=>{const r=run('scope-'+n,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',rev(cwd),'--json'],[0,1],record),v=JSON.parse(r.stdout);A.equal(v.categories.unknown.length,0);A.equal(r.exit_code,expected,n);return{label:n,base,head:rev(cwd),exit:r.exit_code,ok:v.ok,failures:v.failures,categories:Object.fromEntries(Object.entries(v.categories).map(([k,a])=>[k,a.length]))};});}
const mode=process.argv[2];
if(mode==='baseline'){
 claims(false,true);
 const repositories=[['platform',P,BP],['lessons',L,BL]].map(([name,root,ref])=>({name,ref,files:list(root,'ls-tree','-r','-z',ref).map(row=>{const [m,f]=row.split('\t'),oid=m.split(' ')[2],b=read(root,f);A.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),oid,f);return{path:f,git_blob:oid,bytes:b.length,raw_sha256:sha(b)};})}));
 const prior=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-baseline.json'));
 const instructions=prior.instructions.map(v=>{A.equal(sha(read(v.repository==='4veco-lessen'?L:P,v.path)),v.raw_sha256,v.path);return{...v,reading_attribution:'Independent current actor personally read applicable complete instructions and required references in this review; no inherited author reading claim.'};});
 save('baseline',{actor,task,branch,operational_commit:'ff77b6f94579d94a746d9e44ae7da7f7e7e709d6',repositories,instructions,exceptions:{platform:indexes,lessons:[]}});console.log(repositories.map(r=>[r.name,r.files.length]));
}else if(mode==='command')run(process.argv[3],P,process.argv[4],process.argv.slice(5));
else if(mode==='command-any')run(process.argv[3],P,process.argv[4],process.argv.slice(5),[0,1,2]);
else if(mode==='custody')console.log(JSON.stringify(custody()));
else if(mode==='scopes')save('scope',{strict:strict(),native:scopes(),custody:custody()});
else if(mode==='stage'){
 claims(false);A.equal(git(L,'status','--porcelain').trim(),'');const pending=[...new Set([...list(P,'diff','--name-only','-z'),...list(P,'diff','--cached','--name-only','-z'),...list(P,'ls-files','--others','--exclude-standard','-z')])].filter(f=>!indexes.includes(f));A(pending.every(f=>f.startsWith(pre)));for(let i=0;i<pending.length;i+=30)git(P,'add','--',...pending.slice(i,i+30));A.equal(cp.spawnSync('git',['diff','--cached','--check'],{cwd:P}).status,0);console.log(JSON.stringify(custody()));
}else if(mode==='indexes'){
 run('paired-index-generation',P,'node',['--require','./'+pre+'index-runtime.cjs','build-scripts/reports/github-agent-index.js'],[0],false);run('url-index',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false);run('NUL-inventory',P,'node',[pre+'index-runtime.cjs','verify'],[0],false);
}else if(mode==='final'){
 run('freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false);run('NUL-inventory',P,'node',[pre+'index-runtime.cjs','verify'],[0],false);claims(true);
 const pair=[['platform',P],['lessons',L]].map(([repository,cwd])=>{A.equal(git(cwd,'status','--porcelain').trim(),'');A.equal(git(cwd,'branch','--show-current').trim(),branch);const head=rev(cwd),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).trim().split(/\s+/)[0];A.equal(head,remote);A.equal(head,git(cwd,'rev-parse','origin/'+branch).trim());return{repository,head,remote,clean:true};});
 A.deepEqual(list(P,'diff','--name-only','-z','HEAD^..HEAD').sort(),[...indexes].sort());console.log(JSON.stringify({pair,strict:strict(),custody:custody(),native_scopes:scopes(false),terminal_four_index_only:true,verdict:'INDEPENDENT_PLAN_REVIEW_ONLY',production_release:false,rendered_review:false},null,2));
}else throw Error('unknown mode');
