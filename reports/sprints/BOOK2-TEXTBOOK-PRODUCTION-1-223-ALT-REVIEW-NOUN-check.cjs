'use strict';
// Author-of-review noun correction only. Never generates native output or QC.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const BP='b3773c9b2a085ff83e82d7e71384ef10337d7c9c',BL='a52206c0cc9e2578b57e285909c77134bb47657e';
const prefix='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW-NOUN';
const previous='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW';
const task='BOOK2-TEXTBOOK-PRODUCTION-1-223-ALT-REVIEW',actor='paragraph_224_builder',branch='agent/book2-223-alt-review-20260906';
const rel='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3-review.md';
const indexes=['platform','lessen'].flatMap(r=>['json','md'].map(e=>`reports/github-agent-index-${r}.${e}`));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const bytes=(root,file)=>fs.readFileSync(path.join(root,file));
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const names=(cwd,...args)=>git(cwd,...args).split('\0').filter(Boolean);
const json=file=>JSON.parse(bytes(P,file));
const save=(label,value)=>fs.writeFileSync(path.join(P,prefix+'-'+label+'.json'),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
function run(label,cwd,command,args,expected=[0],record=true,env=process.env){
 const started_at=new Date().toISOString(),r=cp.spawnSync(command,args,{cwd,encoding:'utf8',env,maxBuffer:128*1024*1024});
 const value={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
 if(record)save(label+'-process',value);console.log(label+': '+r.status);assert(expected.includes(r.status),label+' diagnostic retained');return value;
}
function exactReview(){
 const old=cp.execFileSync('git',['show',BL+':'+rel],{cwd:L,maxBuffer:2*1024*1024});
 assert.equal(sha(old),'e603b62ba2d77e1c33db6aeeaeb24d9b41ec7a136f26020bc3b5081e0a2e56a4');
 const from='+30 meals/month',to='+30 subscriptions/month',original=old.toString('utf8');
 assert.equal(original.split(from).length,2);const expected=Buffer.from(original.replace(from,to));
 const current=bytes(L,rel);assert.deepEqual(current,expected);assert.equal(current.length-old.length,8);
 assert.equal(current.toString('utf8').replace(to,from),original);
 assert.equal(current.toString('utf8').split(to).length,2);
 return {path:rel,old_commit:BL,old_bytes:old.length,new_bytes:current.length,old_raw_sha256:sha(old),new_raw_sha256:sha(current),new_lf_sha256:sha(Buffer.from(current.toString('utf8').replace(/\r\n?/g,'\n'))),line:135,from,to,exact_full_byte_derivation:true,reverse_exact:true};
}
function strict(){
 const p=[...new Set([...names(P,'diff','--name-only','-z',BP),...names(P,'ls-files','--others','--exclude-standard','-z')])];
 const l=names(L,'diff','--name-only','-z',BL);assert.deepEqual(l,[rel]);assert.equal(git(L,'ls-files','--others','--exclude-standard'),'');
 assert(p.every(s=>s.startsWith(prefix+'-')||indexes.includes(s)));
 return {status:'PASS',platform_base:BP,platform_head:git(P,'rev-parse','HEAD'),lessons_base:BL,lessons_head:git(L,'rev-parse','HEAD'),platform_paths:p,lessons_paths:l,unknown:0,source_output_PDF_QC_handoff_old_evidence_changes:0};
}
function scopes(record){
 const result=[];
 for(const [name,cwd,lane,base,exit]of [['own-platform',P,'shared',BP,1],['own-lessons',L,'textbook',BL,0],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',0]]){
  const r=run('scope-'+name,P,'node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',git(cwd,'rev-parse','HEAD'),'--json'],[exit],record),s=JSON.parse(r.stdout);assert.equal(s.categories.unknown.length,0);
  result.push({name,base,head:git(cwd,'rev-parse','HEAD'),status:s.ok?'PASS':'FAIL',exit:r.exit_code,unknown:0,failures:s.failures});
 }return result;
}
function paired(){return {...process.env,FOURVECO_PLATFORM_ROOT:P,FOURVECO_PLATFORM_SOURCE_REF:git(P,'rev-parse','HEAD'),FOURVECO_PLATFORM_SOURCE_BRANCH:branch,FOURVECO_LESSEN_ROOT:L,FOURVECO_LESSEN_SOURCE_REF:git(L,'rev-parse','HEAD'),FOURVECO_LESSEN_SOURCE_BRANCH:branch};}
function claim(clean,record){for(const [name,cwd]of [['platform',P],['lessons',L]])run('claim-'+name,cwd,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',task,'--agent',actor,'--require-prefix','codex/,agent/',...(clean?['--require-clean']:[])],[0],record);}
function verifyAll(){
 const evidence=json(prefix+'-evidence.json');exactReview();
 for(const repo of evidence.preservation){const root=repo.repository==='platform'?P:L;for(const v of repo.files){if(root===P&&indexes.includes(v.path))continue;assert.equal(sha(bytes(root,v.path)),v.raw_sha256,v.path);}}
 return {all_prior_raw_files_unchanged:true,review_only_exact_noun:true};
}
const mode=process.argv[2];
if(mode==='evidence'){
 const review=exactReview();strict();const source='build-scripts/content/book-2/223/target-answers.md',text=bytes(P,source).toString('utf8');
 assert(text.includes('390 abonnementen per maand')&&text.includes('420 abonnementen per maand')&&text.includes('30 abonnementen per maand'));
 assert.equal(100-2*10+0.5*20+0.01*30000,390);assert.equal(100-2*10+0.5*20+0.01*33000,420);assert.equal(100-2*10+0.5*24+0.01*30000,392);
 assert.equal(420-390,30);assert(Math.abs(((420-390)/390)/0.1-10/13)<1e-14);
 assert(!bytes(P,previous+'-report.md').toString('utf8').includes('+30 meals/month'));
 const instructions=json(previous+'-baseline.json').instructions.map(v=>{const root=v.repository==='4veco-platform'?P:L;assert.equal(sha(bytes(root,v.path)),v.raw_sha256);return {...v,rebound_for_noun_phase:true};});
 const preservation=[];
 for(const [repository,root,base]of [['platform',P,BP],['lessons',L,BL]]){
  const files=names(root,'ls-tree','-r','--name-only','-z',base).map(file=>{const b=bytes(root,file);return {path:file,bytes:b.length,raw_sha256:sha(b),sole_review_successor:root===L&&file===rel};});
  preservation.push({repository,base,count:files.length,files});
 }
 const quality=rel.replace('-review.md','-quality-ref.yaml');assert.equal(sha(bytes(L,quality)),'6d93128f5cdcd363fc4a7e5a6e5d462162f130a18f4f01fd4656be22ef9e2586');
 assert(!fs.existsSync(path.join(L,rel.replace('-review.md','-textbook-handoff.md'))));
 const inspection=json(previous+'-personal-inspection.json');
 const paths=[];function walk(v){if(v&&typeof v==='object'){if(v.path&&v.raw_sha256&&v.path.startsWith('reports/'))paths.push({path:v.path,raw_sha256:v.raw_sha256});Object.values(v).forEach(walk);}}
 walk(inspection);for(const v of paths)assert.equal(sha(bytes(P,v.path)),v.raw_sha256);
 const diff=git(L,'diff','--no-ext-diff','--unified=3',BL,'--',rel);
 const negatives=[];for(const [name,mutated]of [['old wrong noun',Buffer.from(bytes(L,rel).toString('utf8').replace(review.to,review.from))],['wrong quantity',Buffer.from(bytes(L,rel).toString('utf8').replace(review.to,'+31 subscriptions/month'))],['different judgment',Buffer.from(bytes(L,rel).toString('utf8').replace('**PASS WITH FLAGS**','**FAIL**'))]]){assert.notDeepEqual(mutated,bytes(L,rel));negatives.push(name);}
 save('evidence',{status:'PASS_REVIEW_WORDING_ONLY',platform_input:BP,lessons_input:BL,operational_commit:'3b895475e54f72239d85daaf4967567001038644',review,git_diff:diff,
  source:{path:source,raw_sha256:sha(bytes(P,source)),line:47,correct:'30 abonnementen per maand'},mathematics:{baseline:390,income_only:420,reset_other_price:392,delta:30,Ei:'10/13'},
  instructions,preservation,original_personal_inspection:{path:previous+'-personal-inspection.json',raw_sha256:sha(bytes(P,previous+'-personal-inspection.json')),bound_view_records:paths.length,reopened_views:0,original_personal_observations_retained:true},
  negative_wrong_successor_variants:negatives,quality_ref:{path:quality,raw_sha256:sha(bytes(L,quality)),status:'REVISE unchanged; distinct specialist renews against new current review hash'},handoff:'ABSENT',native_generation:false,
  attribution:'Reviewer-only noun corrected after distinct paragraph_214_builder finding; no new content/visual review claim',
  diagnostics:['Read-only claim checker rejected unsupported --cwd; actual lessons cwd clean claim succeeded before edits.']});
 console.log(JSON.stringify({review,prior_files:preservation.map(x=>({repository:x.repository,count:x.count})),inspection_records:paths.length}));
}else if(mode==='gates'){
 for(const label of ['post-review-student-web','post-review-publisher-print','post-review-currentness','post-review-durable','post-review-bundle']){
  const old=json(previous+'-'+label+'.json');run(label,P,old.command[0],old.command.slice(1));
 }
 run('governance',P,'node',['build-scripts/review-gates/check-governance-freshness.js']);claim(false,true);
}else if(mode==='prepare'){
 for(const [name,cwd]of [['platform',P],['lessons',L]])run('fetch-'+name,cwd,'git',['fetch','origin','--prune']);
 const actual=strict();verifyAll();save('stage-inventory',actual);
 const files=[...actual.platform_paths,prefix+'-stage-inventory.json'];assert(files.every(f=>f.startsWith(prefix+'-')));
 for(let i=0;i<files.length;i+=30)git(P,'add','--',...files.slice(i,i+30));git(L,'add','--',rel);
 run('whitespace-platform',P,'git',['diff','--cached','--check',BP]);run('whitespace-lessons',L,'git',['diff','--cached','--check',BL]);
 git(P,'add','--',prefix+'-whitespace-platform-process.json',prefix+'-whitespace-lessons-process.json');
}else if(mode==='scope'){
 save('actual-scope',{strict:strict(),scopes:scopes(true),review:exactReview(),raw_custody:verifyAll()});
}else if(mode==='indexes'){
 run('indexes',P,'node',['build-scripts/reports/github-agent-index.js'],[0],false,paired());
 run('url-index',P,'node',['build-scripts/sprints/emit-url-index.js'],[0],false,paired());
 assert.deepEqual(names(P,'diff','--name-only','-z').sort(),[...indexes].sort());
}else if(mode==='final'){
 run('index-freshness',P,'node',['build-scripts/reports/check-agent-index-freshness.js'],[0],false,paired());
 run('url-freshness',P,'node',['build-scripts/sprints/emit-url-index.js','--check'],[0],false,paired());
 claim(true,false);const pair=[];
 for(const [name,root]of [['platform',P],['lessons',L]]){assert.equal(git(root,'status','--porcelain'),'');assert.equal(git(root,'branch','--show-current'),branch);const head=git(root,'rev-parse','HEAD'),remote=git(root,'ls-remote','origin','refs/heads/'+branch).split(/\s+/)[0];assert.equal(head,remote);assert.equal(head,git(root,'rev-parse','origin/'+branch));pair.push({repository:name,head,remote,clean:true});}
 assert.deepEqual(names(P,'diff','--name-only','-z','HEAD^..HEAD').sort(),[...indexes].sort());
 console.log(JSON.stringify({pair,review:exactReview(),strict:strict(),scopes:scopes(false),preservation:verifyAll(),verdict:'Unchanged paragraph PASS WITH FLAGS; review noun corrected',specialist_QC:'REVISE unchanged; renewal pending',no_native_generation_PR_merge_fullCI_claim:true},null,2));
}else throw Error('evidence/gates/prepare/scope/indexes/final');
