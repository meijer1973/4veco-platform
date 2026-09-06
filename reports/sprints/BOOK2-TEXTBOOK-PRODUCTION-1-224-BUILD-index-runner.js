// HOW TO ADAPT: task-only native index runtime buffer; shared code stays exact.
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const root=path.resolve(__dirname,'../..'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const real=cp.execFileSync;
if(process.argv[2]==='--record-fallback'){
 const j=JSON.parse(fs.readFileSync(path.join(root,'reports/github-agent-index-platform.json'),'utf8'));
 const tracked=real('git',['ls-files','-z'],{cwd:root,maxBuffer:64*1024*1024}).toString().split('\0').filter(Boolean);
 const skip=new Set(j.skipped_directories),selected=tracked.filter(p=>!p.split('/').some(x=>skip.has(x)));
 const actual=[...new Set(Object.values(j.groups).flat())];
 const result={actor:'paragraph_224_builder',attempt:'unchanged native HEAD fallback',source_commit:j.source_commit,tracked:selected.length,indexed:j.file_count,extra:actual.filter(x=>!selected.includes(x)),missing:selected.filter(x=>!actual.includes(x)),indexes:['platform','lessen'].flatMap(r=>['json','md'].map(e=>{const p='reports/github-agent-index-'+r+'.'+e;return {path:p,raw_sha256:sha(fs.readFileSync(path.join(root,p)))};})),decision:'Reject inaccurate fallback inventory. Generate exact explicit refs using unchanged shared native script, with only read-only Git child stdout maxBuffer increased in this task-owned process.'};
 fs.writeFileSync(path.join(__dirname,prefix+'-index-fallback.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result,null,2));
}else if(process.argv[2]==='--generate'){
 for(const k of ['FOURVECO_PLATFORM_ROOT','FOURVECO_PLATFORM_SOURCE_REF','FOURVECO_PLATFORM_SOURCE_BRANCH','FOURVECO_LESSEN_ROOT','FOURVECO_LESSEN_SOURCE_REF','FOURVECO_LESSEN_SOURCE_BRANCH'])if(!process.env[k])throw Error('Missing explicit '+k);
 if(process.env.FOURVECO_PLATFORM_SOURCE_REF==='HEAD'||process.env.FOURVECO_LESSEN_SOURCE_REF==='HEAD')throw Error('Exact committed refs required for buffered route');
 const relative='build-scripts/reports/github-agent-index.js',entry=path.join(root,relative);
 const expected=real('git',['show','e42c2b276354aeb1eb903bfb480a5dad27d898b2:'+relative],{cwd:root});
 if(!fs.readFileSync(entry).equals(expected))throw Error('Shared index script changed');
 cp.execFileSync=function(exe,args,options={}){
  if(exe!=='git'||!['ls-tree','ls-files','rev-parse','remote'].includes(args[0]))throw Error('Only native read-only Git queries are permitted by index buffer runner');
  return real(exe,args,{...options,maxBuffer:64*1024*1024});
 };
 console.log('Unchanged native index script '+sha(expected)+'; read-only Git maxBuffer=67108864');
 // Node's normal main-module loader executes the existing script unchanged.
 process.argv=[process.execPath,entry];require('module').runMain(entry);
}else throw Error('Use --record-fallback or --generate');
