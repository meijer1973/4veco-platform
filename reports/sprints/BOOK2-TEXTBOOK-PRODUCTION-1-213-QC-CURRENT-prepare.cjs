'use strict';
// HOW TO ADAPT: preparatory read-only baseline only; never unlocks native QC.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),c=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const PREFIX='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT-';
const BP='c96f126738b5e45d0d1c74e68efc35b7bd33c5dc',BL='42996c60b4a93843dfe8488b8e5a3ea704871667';
const BRANCH='agent/book2-213-qc-current-20260906',TASK='BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-CURRENT',ACTOR='paragraph_231_specialist_qc';
const REL='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten';
const sha=b=>c.createHash('sha256').update(b).digest('hex');
const git=(root,...args)=>cp.execFileSync('git',args,{cwd:root,maxBuffer:256*1024*1024});
const read=(root,name)=>fs.readFileSync(path.join(root,name));
const save=(name,value)=>fs.writeFileSync(path.join(P,PREFIX+name),JSON.stringify(value,null,2)+'\n',{flag:'wx'});
function command(label,root,exe,args){
 const started_at=new Date().toISOString();
 const r=cp.spawnSync(exe,args,{cwd:root,encoding:null,maxBuffer:256*1024*1024,env:{...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'}});
 save(label+'-process.json',{command:exe,args,cwd:root,started_at,ended_at:new Date().toISOString(),exit:r.status,stdout:r.stdout?.toString('utf8'),stderr:r.stderr?.toString('utf8'),stdout_sha256:sha(r.stdout||Buffer.alloc(0)),stderr_sha256:sha(r.stderr||Buffer.alloc(0)),inherited_path_sha256:sha(Buffer.from(process.env.PATH||''))});
 assert.equal(r.status,0,label+' failed; original log preserved');return r.stdout;
}
const claim=(repo,root)=>command(repo+'-claim',root,'node',[path.join(P,'build-scripts/ci/check-agent-worktree-safety.js'),'--check','--task',TASK,'--agent',ACTOR,'--require-prefix','codex/,agent/']);
function inventory(root,base){
 const rows=[];
 for(const row of git(root,'ls-tree','-rz','--full-tree',base).toString('utf8').split('\0').filter(Boolean)){
  const [meta,name]=row.split('\t'),[mode,type,object]=meta.split(' ');assert.equal(type,'blob');
  const raw=read(root,name),blob=b=>c.createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
  const lf=Buffer.from(raw.toString('utf8').replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'));
  const semantics=blob(raw)===object?'raw':blob(lf)===object?'canonical_utf8_lf':null;assert(semantics,'unexpected inherited Git/raw drift '+name);
  rows.push({path:name,bytes:raw.length,raw_sha256:sha(raw),git_blob_sha1:object,git_semantics:semantics});
 }
 return rows;
}
function snapshot(){
 claim('platform',P);claim('lessons',L);
 for(const root of [P,L])assert.equal(git(root,'branch','--show-current').toString().trim(),BRANCH);
 assert.equal(git(L,'rev-parse','HEAD').toString().trim(),BL);assert.equal(git(L,'status','--porcelain').length,0);
 const prior=JSON.parse(fs.readFileSync('C:/wt/book2-233-plan-20260906/4veco-platform/reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-233-PLAN-baseline.json'));
 const instructions=prior.instructions.map(row=>{const root=row.repository==='4veco-platform'?P:L;assert.equal(sha(read(root,row.path)),row.raw_sha256);return {...row,personally_read_continuing_workflow_unchanged:true};});
 for(const name of ['docs/workflows/paragraph-quality-ref-schema-v2.md','agents/visual-qa-agent.md','agents/accessibility-agent.md'])instructions.push({repository:'4veco-platform',path:name,raw_sha256:sha(read(P,name)),personally_read_for_current_task:true});
 const generator=read(P,'build-scripts/content/book-2/b2_213.py');assert.equal(sha(generator),'87ce47b88520abbde45c18114816dae7630e31453c48e0c505c87b7e9b031ce4');
 assert.equal(sha(read(L,REL+'/2.1.3-review.md')),'5064642034fac9763202d2424b87cef2f7cc909aaf3a6031b90d247ee44409c3');
 assert.equal(sha(read(L,REL+'/2.1.3-quality-ref.yaml')),'c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f');
 assert(!fs.existsSync(path.join(L,REL,'2.1.3-textbook-handoff.md')));
 const target=JSON.parse(read(P,'references/authored/course-target-exercises.json')).exercises.find(x=>x.id==='2.1.3');
 assert.equal(sha(Buffer.from(JSON.stringify(target))),'df4b7d7b0326445b386ae570b43eb50fc9fc431707e3992e44394323f959c3ef');
 const stem='2.1.3 Marginale kosten en marginale opbrengsten',assets=['2.1.3_fig_1','2.1.3_fig_2','2.1.3_fig_3','2.1.3_fig_4','2.1.3_we_1','2.1.3_ex_1'];
 const native=[...['paragraaf','opgaven','antwoorden'].flatMap(k=>['md','html','pdf','zip'].map(e=>stem+' – '+k+'.'+e)),...assets.flatMap(n=>['svg','png'].map(e=>'_assets/'+n+'.'+e))].map(n=>({path:REL+'/'+n,raw_sha256:sha(read(L,REL+'/'+n))}));assert.equal(native.length,24);
 const repositories=[{repository:'platform',base:BP,rows:inventory(P,BP)},{repository:'lessons',base:BL,rows:inventory(L,BL)}];
 const result={status:'PREPARATORY_CUSTODY_ONLY',platform_base:BP,lessons_base:BL,operational_commit:git(P,'rev-parse',BP+'..HEAD').toString().trim(),instructions,repositories,native,target,legacy_qc_raw_utf8:read(L,REL+'/2.1.3-quality-ref.yaml').toString('utf8'),inherited_path:process.env.PATH,python:'C:/Python314/python.exe',review_import_gate:'WAITING_FOR_DISTINCT_S1_PASS_AND_ROOT_EXACT_BINDINGS',native_QC_executed:false,canonical_QC_changed:false};
 save('baseline.json',result);console.log(JSON.stringify({status:result.status,instructions:instructions.length,repository_counts:repositories.map(x=>({repository:x.repository,count:x.rows.length})),native_inventory_only:native.length,native_QC_executed:false}));
}
if(process.argv[2]==='snapshot')snapshot();
else if(process.argv[2]==='math') {const b=command('math-preparation',P,'C:/Python314/python.exe',[PREFIX+'math-preparation.py']);console.log(b.toString('utf8'));}
else throw Error('Only snapshot or math preparation; no native QC command allowed');
