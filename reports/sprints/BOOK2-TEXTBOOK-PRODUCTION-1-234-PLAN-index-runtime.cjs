'use strict';
// Own publication transport diagnostic/preload. No index/source policy edits.
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(root,...args)=>cp.execFileSync('git',args,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024}).trim();
const original=cp.execFileSync;
if(require.main===module&&process.argv[2]==='verify'){
 const rows=[];assert.equal(sha(fs.readFileSync(path.join(P,'build-scripts/reports/github-agent-index.js'))),'44b235b2a65b36f28c316a7d9cee947e3ce049713ddcd53ced2321a7a9ec9b53');
 const skip=new Set(['.git','node_modules','.cache','.tmp','tmp','temp','dist','coverage','out','output','outputs','__pycache__']);
 for(const [label,root]of [['platform',P],['lessen',L]]){
  const j=fs.readFileSync(path.join(P,'reports/github-agent-index-'+label+'.json')),v=JSON.parse(j),md=fs.readFileSync(path.join(P,'reports/github-agent-index-'+label+'.md'),'utf8');
  assert.match(v.source_commit,/^[a-f0-9]{40}$/);assert.equal(v.source_branch,'agent/book2-234-plan-20260906');
  const raw=original('git',['ls-tree','-r','--name-only',v.source_commit,'--'],{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024});
  const expected=raw.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).filter(x=>!x.split('/').some(p=>skip.has(p))).sort((a,b)=>a.localeCompare(b));
  const union=[...new Set(Object.values(v.groups).flat())].sort((a,b)=>a.localeCompare(b));assert.deepEqual(union,expected);assert.equal(v.file_count,expected.length);assert(!union.includes('.git'));assert(md.includes(v.source_commit));
  for(const [group,files]of Object.entries(v.groups)){assert(md.includes('## '+group));for(const f of files)assert(md.includes('- '+f));}
  rows.push({label,source_commit:v.source_commit,inventory_count:expected.length,complete_git_inventory_sha256:sha(raw),index_json_sha256:sha(j),index_markdown_sha256:sha(md),exact_inventory:true,no_filesystem_fallback:true});
 }
 console.log(JSON.stringify({status:'EXACT_EXPLICIT_COMMITTED_INVENTORY_PASS',rows},null,2));
}else if(require.main===module){
 const rows=[];
 for(const [repository,root]of [['platform',P],['lessons',L]]){
  const ref=git(root,'rev-parse','HEAD'),args=['ls-tree','-r','--name-only',ref,'--'];let initial;
  try{const b=original('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']});initial={exit:0,bytes:Buffer.byteLength(b),raw_sha256:sha(b)};}
  catch(e){initial={exit:e.status,code:e.code,message:e.message,signal:e.signal,stdout_bytes:e.stdout?Buffer.byteLength(e.stdout):null,stderr:e.stderr?String(e.stderr):null};}
  const complete=original('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore'],maxBuffer:128*1024*1024});
  const nul=original('git',['ls-tree','-r','--name-only','-z',ref,'--'],{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024});
  const quoted=complete.trim().split(/\r?\n/);const raw=nul.split('\0').filter(Boolean);
  // Count compared only; Git's default quotePath representation is retained.
  assert.equal(quoted.length,raw.length);if(repository==='platform'){assert.equal(initial.code,'ENOBUFS');assert(Buffer.byteLength(complete)>1024*1024);}else assert.equal(initial.exit,0);
  rows.push({repository,root,ref,args,default_1MiB:initial,complete_128MiB:{bytes:Buffer.byteLength(complete),raw_sha256:sha(complete),line_count:quoted.length,nul_inventory_count:raw.length,nul_inventory_sha256:sha(nul)}});
 }
 const v={status:'CONFIRMED_GIT_INVENTORY_BUFFER_LIMIT_NOT_MISSING_REF',rows,index_source_raw_sha256:sha(fs.readFileSync(path.join(P,'build-scripts/reports/github-agent-index.js'))),first_unrecorded_attempt_limitation:'Initial tools indexes mode discarded child output because record=false; only parent failure text was returned. A subsequent exact unchanged command is durably retained as index-diagnostic-r1. No false claim that first child stderr was preserved.',index_or_lesson_writes:false};
 fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-234-PLAN-index-runtime-diagnostic.json'),JSON.stringify(v,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(v,null,2));
}else{
 // Apply only to the existing standard index script's precise readonly inventory
 // calls, in its child process, with explicit paired refs and roots. No fallback.
 for(const [key,root]of [['PLATFORM',P],['LESSEN',L]]){assert.equal(path.resolve(process.env['FOURVECO_'+key+'_ROOT']),root);assert.match(process.env['FOURVECO_'+key+'_SOURCE_REF'],/^[a-f0-9]{40}$/);}
 cp.execFileSync=function(file,args,options){
  const cwd=options?.cwd&&path.resolve(options.cwd),key=cwd===P?'PLATFORM':cwd===L?'LESSEN':null;
  if(file==='git'&&key&&Array.isArray(args)&&JSON.stringify(args)===JSON.stringify(['ls-tree','-r','--name-only',process.env['FOURVECO_'+key+'_SOURCE_REF'],'--'])&&options.maxBuffer===undefined){
   return original(file,args,{...options,maxBuffer:128*1024*1024});
  }
  return original(file,args,options);
 };
}
