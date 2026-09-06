'use strict';
// Task-owned correction evidence. Adapted from the exact prior reviewer transport/controller;
// no historical writer is executed and no native/foreign/authority file is written.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),A=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-F1';
const BP='37b3bb0053939fa1b89fc7bbcee4476b16f7c916',BL='a9662869395f449a4d5dce907bfe58976f94ed01',branch='agent/book2-234-plan-f1-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-F1',actor='paragraph_214_builder';
const book='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus',chapter=book+'/2.3 Hoofdstuk Surplus en welvaart',plan=chapter+'/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4-textbook-plan.md';
const RP='C:/wt/book2-part-a-production-20260905/4veco-platform',RL=path.resolve(RP,'../4veco-lessen'),SP='67c544392d215e40970798b30d63ddd44ee404ee',SL='1cf1c1f972f196791fb37f6bbee523b7a2e3b676';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),read=(root,f)=>fs.readFileSync(path.join(root,f));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}),blob=(cwd,ref,f)=>cp.execFileSync('git',['show',ref+':'+f],{cwd,maxBuffer:128*1024*1024});
const rev=cwd=>git(cwd,'rev-parse','HEAD').trim(),list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const save=(name,obj)=>fs.writeFileSync(path.join(P,prefix+'-'+name+'.json'),JSON.stringify(obj,null,2)+'\n',{flag:'wx'});
const owned=f=>f.startsWith(prefix+'-')||indexes.includes(f);
const env=()=>({...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:rev(P),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:rev(L),FOURVECO_LESSEN_SOURCE_BRANCH:branch});
function run(label,cwd,command,args,allowed=[0],record=true){
 const childEnv=env(),started_at=new Date().toISOString();
 const sources=args.filter(a=>a.endsWith('.cjs')||a.endsWith('.js')).map(a=>path.resolve(cwd,a)).filter(a=>fs.existsSync(a)).map(a=>({path:path.relative(P,a).replaceAll('\\','/'),raw_sha256:sha(fs.readFileSync(a)),source_utf8:fs.readFileSync(a,'utf8')}));
 const r=cp.spawnSync(command,args,{cwd,env:childEnv,maxBuffer:128*1024*1024});
 const result={command,args,cwd,started_at,ended_at:new Date().toISOString(),sources,environment:Object.fromEntries(Object.entries(childEnv).filter(([k])=>k.startsWith('FOURVECO_')||k.startsWith('PYTHON'))),exit_code:r.status,stdout:(r.stdout||Buffer.alloc(0)).toString('utf8'),stderr:(r.stderr||Buffer.alloc(0)).toString('utf8'),stdout_base64:(r.stdout||Buffer.alloc(0)).toString('base64'),stderr_base64:(r.stderr||Buffer.alloc(0)).toString('base64'),error:r.error?.message};
 if(record)save(label+'-process',result);console.log(label+': '+r.status);A(allowed.includes(r.status),label+' actual failure retained');return result;
}
function claims(clean,record=false){for(const [n,cwd]of [['platform',P],['lessons',L]])run(n+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
function custody(){const b=JSON.parse(read(P,prefix+'-baseline.json'));let n=0;for(const repo of b.repositories)for(const f of repo.files){if(repo.name==='platform'&&indexes.includes(f.path)||repo.name==='lessons'&&f.path===plan)continue;A.equal(sha(read(repo.name==='platform'?P:L,f.path)),f.raw_sha256,f.path);n++;}return {status:'PASS',raw_prior_files_unchanged:n,lesson_exceptions:[plan],platform_exceptions:indexes};}
function strict(){const p=list(P,'diff','--name-only','-z',BP+'..HEAD'),l=list(L,'diff','--name-only','-z',BL+'..HEAD');A(p.every(owned));A.deepEqual(l,[plan]);return {status:'PASS',unknown:0,platform_base:BP,platform_head:rev(P),lessons_base:BL,lessons_head:rev(L),platform_paths:p,lesson_paths:l};}
function scopes(record=true){return [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,0],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]].map(([label,cwd,lane,base,expected])=>{const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',rev(cwd),'--json'],[0,1],record),v=JSON.parse(r.stdout);A.equal(v.categories.unknown.length,0);A.equal(r.exit_code,expected);return {label,base,head:rev(cwd),exit:r.exit_code,ok:v.ok,failures:v.failures,categories:Object.fromEntries(Object.entries(v.categories).map(([k,a])=>[k,a.length]))};});}
const mode=process.argv[2];
if(mode==='baseline'){
 claims(false,true);
 const repositories=[['platform',P,BP],['lessons',L,BL]].map(([name,root,ref])=>({name,ref,files:list(root,'ls-tree','-r','-z',ref).map(r=>{const [meta,f]=r.split('\t'),oid=meta.split(' ')[2],b=read(root,f);A.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),oid,f);return {path:f,bytes:b.length,git_blob:oid,raw_sha256:sha(b)};})}));
 const instructions=JSON.parse(read(P,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-baseline.json')).instructions.map(v=>{A.equal(sha(read(v.repository==='4veco-lessen'?L:P,v.path)),v.raw_sha256,v.path);return {...v,reading_attribution:'Same continuing actor personal full prior-phase reading, exact current bytes verified; affected current instructions reread as detailed in operational order.'};});
 save('baseline',{actor,task,branch,operational_commit:'4bda62ca',repositories,instructions,exceptions:{platform:indexes,lessons:[plan]}});
 const supplementalFiles=[['platform',RP,SP,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT-acceptance.md'],['platform',RP,SP,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT-result.md'],['platform',RP,SP,'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT-postaccept-check.json']];
 const p213=book+'/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten/';
 for(const f of ['2.1.3-quality-ref.yaml','2.1.3-textbook-handoff.md','2.1.3-review.md','2.1.3 Marginale kosten en marginale opbrengsten – paragraaf.md','2.1.3 Marginale kosten en marginale opbrengsten – opgaven.md','2.1.3 Marginale kosten en marginale opbrengsten – antwoorden.md'])supplementalFiles.push(['lessons',RL,SL,p213+f]);
 supplementalFiles.push(['lessons',RL,SL,chapter+'/2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3-textbook-plan.md']);
 const supplemental=supplementalFiles.map(([repository,root,ref,f])=>{const b=blob(root,ref,f);return {repository,ref,path:f,bytes:b.length,raw_sha256:sha(b),lf_sha256:sha(b.toString('utf8').replace(/\r\n/g,'\n')),read_only_not_imported:true};});
 A.equal(supplemental.find(x=>x.path.endsWith('2.1.3-quality-ref.yaml')).raw_sha256,'c63e0f885c2f09ad8b48b88bf0c9d8da7c5820b56874a942046b5c2aa1012cad');
 A.equal(supplemental.find(x=>x.path.endsWith('2.1.3-textbook-handoff.md')).raw_sha256,'0a056eced568ddab730b389842aa5b47ccf554d54b019d052d9e7a30ce51564d');
 const meta=JSON.parse(read(P,'references/authored/book-outlines/book-2-outline.meta.json'));
 const foundationPaths=[book+'/_book-plan.md',chapter+'/_chapter-plan.md',chapter+'/2.3.2 Producentensurplus en totaal surplus/2.3.2-textbook-plan.md',...list(L,'ls-tree','-r','--name-only','-z',BL,'--',chapter+'/2.3.1 Consumentensurplus').filter(f=>f.endsWith('.md')||f.endsWith('.yaml'))];
 const foundation=foundationPaths.map(f=>({repository:'lessons',ref:BL,path:f,raw_sha256:sha(read(L,f)),lf_sha256:sha(read(L,f).toString('utf8').replace(/\r\n/g,'\n'))}));
 save('foundation-inputs',{baseline:{P:BP,L:BL},supplemental:{P:SP,L:SL,files:supplemental},foundation,metadata_raw_sha256:sha(read(P,'references/authored/book-outlines/book-2-outline.meta.json')),semantic_authority:meta.semantic_authority,target:meta.target_registry_pins.find(x=>x.id==='2.3.4'||x.paragraph_id==='2.3.4'),holds:meta.holds});
 console.log(JSON.stringify({repositories:repositories.map(r=>[r.name,r.files.length]),supplemental,foundation},null,2));
}else if(mode==='command'){run(process.argv[3],P,process.argv[4],process.argv.slice(5));}
else if(mode==='command-any'){run(process.argv[3],P,process.argv[4],process.argv.slice(5),[0,1,2]);}
else if(mode==='custody')console.log(JSON.stringify(custody()));
else if(mode==='scopes')save('actual-scope',{strict:strict(),native:scopes(),custody:custody()});
else if(mode==='stage'){
 claims(false);for(const [root,allowed]of [[P,f=>f.startsWith(prefix+'-')],[L,f=>f===plan]]){const pending=[...new Set([...list(root,'diff','--name-only','-z'),...list(root,'diff','--cached','--name-only','-z'),...list(root,'ls-files','--others','--exclude-standard','-z')])].filter(f=>root!==P||!indexes.includes(f));A(pending.every(allowed));for(let i=0;i<pending.length;i+=30)git(root,'add','--',...pending.slice(i,i+30));A.equal(cp.spawnSync('git',['diff','--cached','--check'],{cwd:root}).status,0);}console.log(JSON.stringify(custody()));
}else if(mode==='indexes'){
 run('paired-index-generation',P,'node',['--require','./'+prefix+'-index-runtime.cjs','build-scripts/reports/github-agent-index.js'],[0],false);
 run('url-index-check',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false);
 run('actual-NUL-inventory',P,'node',[prefix+'-index-runtime.cjs','verify'],[0],false);
}else if(mode==='final'){
 run('freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false);run('actual-NUL-inventory',P,'node',[prefix+'-index-runtime.cjs','verify'],[0],false);claims(true);
 const pair=[['platform',P],['lessons',L]].map(([repository,cwd])=>{A.equal(git(cwd,'status','--porcelain').trim(),'');A.equal(git(cwd,'branch','--show-current').trim(),branch);const head=rev(cwd),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).trim().split(/\s+/)[0];A.equal(head,remote);A.equal(head,git(cwd,'rev-parse','origin/'+branch).trim());return {repository,head,remote,clean:true};});
 A.deepEqual(list(P,'diff','--name-only','-z','HEAD^..HEAD').sort(),[...indexes].sort());console.log(JSON.stringify({pair,strict:strict(),custody:custody(),native_scopes:scopes(false),terminal_four_index_only:true,verdict:'AUTHOR_CORRECTION_READY_FOR_DISTINCT_RE_REVIEW',production_release:false,rendered_review:false},null,2));
}else throw Error('unknown evidence mode');
