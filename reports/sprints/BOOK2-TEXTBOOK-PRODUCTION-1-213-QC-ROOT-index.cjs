'use strict';
// HOW TO ADAPT: preserve shared source and change only read-only Git transport.
const fs=require('fs'),path=require('path'),cp=require('child_process'),crypto=require('crypto'),a=require('assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-213-QC-ROOT';
const real=cp.execFileSync,hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>real('git',args,{cwd,maxBuffer:128*1024*1024}),gs=(cwd,...args)=>git(cwd,...args).toString('utf8').trim();
const rel='build-scripts/reports/github-agent-index.js',entry=path.join(P,rel),trusted=git(P,'show','96416b6b5bd57094576e9aba0a42d682584ec479:'+rel);
a(fs.readFileSync(entry).equals(trusted),'Shared generator drift');
function inventory(){return ['platform','lessen'].map(r=>{const root=r==='platform'?P:L,j=JSON.parse(fs.readFileSync(path.join(P,'reports/github-agent-index-'+r+'.json'))),skip=new Set(j.skipped_directories);
 const names=git(root,'ls-tree','-r','--name-only','-z',j.source_commit).toString('utf8').split('\0').filter(Boolean).filter(n=>!n.split('/').some(x=>skip.has(x)));
 const actual=[...new Set(Object.values(j.groups).flat())],s=new Set(names),t=new Set(actual);
 return {repository:r,source_commit:j.source_commit,source_branch:j.source_branch,tracked:names.length,indexed:j.file_count,group_union:actual.length,extra:actual.filter(n=>!s.has(n)),missing:names.filter(n=>!t.has(n)),NUL_inventory_sha256:hash(Buffer.from(names.join('\0')+'\0'))};});}
function requireExact(){for(const[k,root]of[['PLATFORM',P],['LESSEN',L]]){a.equal(path.resolve(process.env['FOURVECO_'+k+'_ROOT']||''),root);a.match(process.env['FOURVECO_'+k+'_SOURCE_REF']||'',/^[a-f0-9]{40}$/);a.equal(process.env['FOURVECO_'+k+'_SOURCE_REF'],gs(root,'rev-parse','HEAD'));a.equal(process.env['FOURVECO_'+k+'_SOURCE_BRANCH'],'codex/book2-part-a-production-20260905');}}
function verify(){const rows=inventory();for(const r of rows){a.equal(r.tracked,r.indexed);a.equal(r.group_union,r.tracked);a.deepEqual(r.extra,[]);a.deepEqual(r.missing,[]);a.equal(r.source_branch,'codex/book2-part-a-production-20260905');}return rows;}
const mode=process.argv[2];
if(mode==='diagnose'){
 const ref=gs(P,'rev-parse','HEAD'),args=['ls-tree','-r','--name-only',ref,'--'];let failure=null;
 try{real('git',args,{cwd:P});}catch(e){failure={code:e.code,errno:e.errno,status:e.status,message:e.message,stdout_sha256:e.stdout?hash(e.stdout):null,stderr:e.stderr?e.stderr.toString('utf8'):null};}
 const bytes=git(P,...args),rows=inventory();const result={actor:'codex-root',ref,args,default_buffer_failure:failure,read_only_large_buffer:{bytes:bytes.length,sha256:hash(bytes)},unchanged_shared_generator_sha256:hash(trusted),old_literal_inventory:rows,decision:'Correct root publication only using exact-ref large-buffer unquoted transport and independently verified NUL filenames; keep prior evidence immutable'};
 fs.writeFileSync(path.join(__dirname,prefix+'-index-diagnostic.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({default_buffer_failure:failure&&failure.code,large_buffer_bytes:bytes.length,old_inventories:rows.map(r=>({repository:r.repository,tracked:r.tracked,indexed:r.indexed,extra:r.extra.length,missing:r.missing.length}))}));
}else if(mode==='generate'){
 requireExact();cp.execFileSync=function(exe,args,options={}){a.equal(exe,'git');a(['ls-tree','ls-files','rev-parse','remote'].includes(args[0]),args.join(' '));return real(exe,['ls-tree','ls-files'].includes(args[0])?['-c','core.quotepath=false',...args]:args,{...options,maxBuffer:128*1024*1024});};
 try{process.argv=[process.execPath,entry];require('module').runMain(entry);}finally{cp.execFileSync=real;}
 const rows=verify();for(const r of rows)a.equal(r.source_commit,process.env['FOURVECO_'+(r.repository==='platform'?'PLATFORM':'LESSEN')+'_SOURCE_REF']);console.log(JSON.stringify({status:'PASS',transport_only:true,unchanged_shared_generator_sha256:hash(trusted),literal_inventories:rows}));
}else if(mode==='verify')console.log(JSON.stringify({status:'PASS',literal_inventories:verify(),unchanged_shared_generator_sha256:hash(trusted)}));
else throw Error('diagnose/generate/verify');
