'use strict';
// Exclusive 234 PLAN author evidence; no native writer or foreign pair mutation.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN';
const branch='agent/book2-234-plan-20260906',task='BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN',actor='paragraph_214_builder';
const BP='0c7c7e2f4375352b73871c58214b7f99ffc3b0b3',BL='9f9729a9b4a55805d9e24bf53f712f1b02f6e00a';
const REL='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.3 Hoofdstuk Surplus en welvaart/2.3.4 Gemengde opgaven surplus en welvaart/2.3.4-textbook-plan.md';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const blob=(cwd,ref,f)=>cp.execFileSync('git',['show',ref+':'+f],{cwd,maxBuffer:128*1024*1024});
const list=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const read=(root,rel)=>fs.readFileSync(path.join(root,rel));
const json=s=>JSON.parse(read(P,prefix+'-'+s+'.json'));
const save=(s,v)=>fs.writeFileSync(path.join(P,prefix+'-'+s+'.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const own=f=>f.startsWith(prefix+'-')&&!f.startsWith(prefix+'-RELEASE-')||indexes.includes(f);
function env(){return {...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function run(label,cwd,command,args,allowed=[0],record=true){
 const childEnv=env(),started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024,env:childEnv});
 const invocationSources=args.filter(v=>v.startsWith(prefix+'-')&&fs.existsSync(path.join(P,v))).map(v=>({path:v,raw_sha256:sha(read(P,v)),utf8_source:read(P,v).toString('utf8')}));
 const result={command,args,cwd,invocationSources,environment:{PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',...Object.fromEntries(Object.entries(childEnv).filter(([k])=>k.startsWith('FOURVECO_')))},started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr,error:r.error?.message};
 if(record)save(label+'-process',result);console.log(label+': '+r.status);if(!record&&!allowed.includes(r.status))console.error(r.stderr||r.error?.message||'no stderr');assert(allowed.includes(r.status),label+(record?' failed; original record retained':' failed; child output returned but no durable process file requested'));return result;
}
const changed=(cwd,base,head='HEAD')=>list(cwd,'diff','--name-only','-z',base+'..'+head);
function claims(clean,record){for(const [n,cwd]of [['platform',P],['lessons',L]])run(n+'-claim',cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
function custody(){let n=0;for(const r of json('baseline').preservation){const root=r.repository==='platform'?P:L;for(const v of r.rows){if(root===P&&indexes.includes(v.path))continue;assert.equal(sha(read(root,v.path)),v.raw_sha256,v.path);n++;}}return {status:'PASS',raw_prior_files_unchanged:n,lesson_baseline_exceptions:[],platform_exceptions:indexes};}
function strict(){const p=changed(P,BP),l=changed(L,BL);assert(p.every(own));assert.deepEqual(l,[REL]);return {status:'PASS',unknown:0,platform_base:BP,platform_head:git(P,'rev-parse','HEAD'),lessons_base:BL,lessons_head:git(L,'rev-parse','HEAD'),platform_paths:p,lessons_paths:l};}
function scopes(record){return [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,0],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]].map(([label,cwd,lane,base,exit])=>{const r=run('scope-'+label,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[0,1],record),v=JSON.parse(r.stdout);assert.equal(v.categories.unknown.length,0);assert.equal(r.exit_code,exit);return {label,exit:r.exit_code,ok:v.ok,failures:v.failures,categories:Object.fromEntries(Object.entries(v.categories).map(([k,v])=>[k,v.length]))};});}
const mode=process.argv[2];
if(mode==='baseline'){
 claims(false,true);assert(!fs.existsSync(path.join(L,REL)));
 const preservation=[['platform',P,BP],['lessons',L,BL]].map(([repository,root,base])=>({repository,base,rows:list(root,'ls-tree','-r','-z',base).map(row=>{const [meta,f]=row.split('\t'),oid=meta.split(' ')[2],b=read(root,f);const actualGit=crypto.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');assert.equal(actualGit,oid,f);return {path:f,bytes:b.length,raw_sha256:sha(b),git_blob:oid};})}));
 const prev='C:/wt/book2-233-plan-review-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-REVIEW-baseline.json';
 const prior=JSON.parse(fs.readFileSync(prev));
 const instructions=prior.instructions.map(v=>{const root=v.repository==='4veco-platform'?P:L;assert.equal(sha(read(root,v.path)),v.raw_sha256);return {...v,reading_attribution:'Same continuing actor own complete prior reads, exact unchanged bytes; consolidation/didactic/exercise/graph/PDF skills, mixed standard, full target/C23/current source/root release newly read for234. No author/reviewer role conflation.'};});
 for(const file of ['skills/econ-consolidation-builder.md','references/authored/gemengde-opgaven-target-standard.md'])instructions.push({repository:'4veco-platform',path:file,raw_sha256:sha(read(P,file)),reading_attribution:'Personally read complete for234 before authorship.'});
 const rel233=REL.replace('2.3.4 Gemengde opgaven surplus en welvaart/2.3.4','2.3.3 Pareto-efficientie en welvaartsverlies/2.3.3');
 const foreign=[{repository:'lessons',ref:'192d6624524e7605ab9d8d26067927b95041386e',file:rel233,expected:'0870d848b21017fedde86fb8d738bbe6afa21f68f8c1190905a8c0f2e3b8be19'},
 {repository:'platform',ref:'fc56be072b7e195cb73a4eecc46674a51406c305',file:'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-REVIEW-result.md',expected:'318655373cb06851934bb5191fe3af0b28df547ef7948870939abb106503e08d'},
 {repository:'platform',ref:'fc56be072b7e195cb73a4eecc46674a51406c305',file:'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-REVIEW-publication.md',expected:'099602ff6653c51914d595d7d452ba3201dfc056715c1b67a567325dbc35b430'}].map(v=>{const b=blob(v.repository==='platform'?P:L,v.ref,v.file);assert.equal(sha(b),v.expected);return {...v,raw_sha256:sha(b),read_only_not_imported:true};});
 const record=JSON.parse(read(P,'references/authored/course-target-exercises.json')).exercises.find(v=>v.id==='2.3.4');assert.equal(sha(Buffer.from(JSON.stringify(record))),'2ac151882b64b0d990ce5627ae35388d72eefde74c4e24562ef9a49a9355672c');
 const rootRelease=preservation[0].rows.filter(v=>v.path.startsWith('reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-RELEASE-'));
 save('baseline',{status:'PASS_AUTHOR_BASELINE',actor,role:'234plan-author',platform_input:BP,lessons_input:BL,operational_commit:'3d8ff2ed471fe609dd7c20e75c9bc613458fb34e',preservation,instructions,foreign,rootRelease,target_record:record,target_record_sha256:sha(Buffer.from(JSON.stringify(record))),canonical_plan_absent:true,production_release:false});
 console.log(JSON.stringify({prior:preservation.map(v=>[v.repository,v.rows.length]),instructions:instructions.length,foreign}));
}else if(mode==='supplemental233'){
 const ref='8a9f693c4ff13edc0af8e642861ac05442214266';
 const rows=['result.md','verification.json','publication.md'].map(s=>{const file='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-ROOT-'+s,b=blob(P,ref,file);return {file,raw_sha256:sha(b),bytes:b.length,personally_read_complete:true};});
 save('supplemental233',{status:'READ_ONLY_PLAN_ADOPTION',platform_ref:ref,lessons_ref:'167b833c88c5651327906ffdc322e44a9fcfc4a7',root_payload:'f26a3dcb52271ba0691cd35d647bb74ed6302000',rows,imported:false,source_production_released:false,actual_accepted_232_233_claim:false});
}else if(mode==='command'){run(process.argv[3],P,process.argv[4],process.argv.slice(5));}
else if(mode==='custody'){console.log(JSON.stringify(custody()));}
else if(mode==='integrity'){
 const processRecord=json('author-r4-process'),result=JSON.parse(processRecord.stdout);assert.equal(processRecord.exit_code,0);assert.equal(result.plan_raw_sha256,sha(read(L,REL)));
 const source=processRecord.invocationSources.find(x=>x.path.endsWith('-check.cjs'));assert.equal(source.raw_sha256,sha(read(P,source.path)));
 const plan=read(L,REL).toString('utf8'),contexts=[['WE','Een bezoekerscentrum','Broncijfers:'],['G3','Een openluchttheater','Hulptabel:'],['G4','Een festival verkoopt','Tabel: P20'],['I6','Een buurtcentrum','Broncijfers: bijP30']].map(([id,start,end])=>{const a=plan.indexOf(start),b=plan.indexOf(end,a),words=plan.slice(a,b).trim().split(/\s+/).length;assert(words>=100&&words<=250);return {id,words};});
 const lum=h=>{const v=h.match(/\w\w/g).map(n=>parseInt(n,16)/255).map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));return .2126*v[0]+.7152*v[1]+.0722*v[2];};
 const contrast=(lum('F7FAFC')+.05)/(lum('1E8449')+.05);assert(contrast>=4.5);
 const gates=['structural','goal-design','durable','bundle','governance'].map(label=>{const file=prefix+'-'+label+'-process.json',r=JSON.parse(read(P,file));assert.equal(r.exit_code,0);return {label,file,raw_sha256:sha(read(P,file)),exit:r.exit_code};});
 const failed=[1,2,3].map(n=>{const file=prefix+'-author-r'+n+'-process.json',r=JSON.parse(read(P,file));assert.equal(r.exit_code,1);assert(r.invocationSources.length>0);return {file,raw_sha256:sha(read(P,file)),exit:r.exit_code,reason:'Exact clause-locator helper failures; helper source and original stderr preserved. No plan or native repair caused by failure.'};});
 save('final-integrity',{status:'AUTHOR_CANDIDATE_CHECKED',actor,role:'234plan-author',plan_file:REL,plan_raw_sha256:result.plan_raw_sha256,plan_lines:result.plan_lines,author_process_raw_sha256:sha(read(P,prefix+'-author-r4-process.json')),author_checker_sha256:source.raw_sha256,assertions:result.assertions,noncustody_assertions:result.assertions-result.raw_prior_files_unchanged,math_cells:result.math_ledger_cells,semantic_clause_count:result.semantic_clause_probes.length,negative_count:result.negative_probes.length,nominal_region_budget_count:result.nominal_ink_budgets.length,contexts,contrast_arithmetic_only:contrast,gates,preserved_failed_helpers:failed,custody:custody(),supplemental233:json('supplemental233'),timing:result.timing,rendered_visual_PASS:false,independent_review:'PENDING',root_acceptance:'PENDING',production_ready:false});
}
else if(mode==='scopes'){save('actual-scope',{strict:strict(),native:scopes(true),custody:custody()});}
else if(mode==='stage'){
 claims(false,false);for(const [root,allowed]of [[P,own],[L,f=>f===REL]]){const pending=[...new Set([...list(root,'diff','--name-only','-z'),...list(root,'diff','--cached','--name-only','-z'),...list(root,'ls-files','--others','--exclude-standard','-z')])];assert(pending.every(allowed));const selected=pending.filter(f=>!(root===P&&process.argv.includes('--evidence-only')&&indexes.includes(f)));for(let i=0;i<selected.length;i+=30)git(root,'add','--',...selected.slice(i,i+30));run((root===P?'platform':'lessons')+'-whitespace',root,'git',['diff','--cached','--check'],[0],false);}console.log(JSON.stringify(custody()));
}else if(mode==='indexes'){run('paired-indexes',P,'node',['--require','./'+prefix+'-index-runtime.cjs','build-scripts/reports/github-agent-index.js'],[0],false);run('url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false);run('complete-index-inventory',P,'node',[prefix+'-index-runtime.cjs','verify'],[0],false);}
else if(mode==='final'){
 run('index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false);run('url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false);run('complete-index-inventory',P,'node',[prefix+'-index-runtime.cjs','verify'],[0],false);claims(true,false);
 const pair=[['platform',P],['lessons',L]].map(([repository,cwd])=>{assert.equal(git(cwd,'status','--porcelain'),'');assert.equal(git(cwd,'branch','--show-current'),branch);const head=git(cwd,'rev-parse','HEAD'),remote=git(cwd,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(cwd,'rev-parse','origin/'+branch));return {repository,head,remote,clean:true};});assert.deepEqual(changed(P,'HEAD^').sort(),[...indexes].sort());console.log(JSON.stringify({pair,strict:strict(),native_scopes:scopes(false),custody:custody(),plan_raw_sha256:sha(read(L,REL)),terminal_four_index_only:true,independent_review:'PENDING',root_validation:'PENDING',root_acceptance:'PENDING',production_release:'PENDING',rendered_inspection:false,timing:'UNOBSERVED',PR_merge:false},null,2));
}else throw Error('baseline/command/custody/scopes/stage/indexes/final');
