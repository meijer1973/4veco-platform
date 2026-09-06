'use strict';
// HOW TO ADAPT: choose a fresh review task/label; never overwrite prior evidence.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const label=process.argv[2],command=process.argv[3],args=process.argv.slice(4);
if(!/^[a-z0-9-]+$/.test(label)||!command)throw Error('label command args required');
const cwd=path.resolve(__dirname,'../..'),started_at=new Date().toISOString();
const env={...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1',PATH:'C:/msys64/mingw64/bin;C:/Python314;'+process.env.PATH};
const r=cp.spawnSync(command,args,{cwd,env,encoding:'utf8',maxBuffer:64*1024*1024});
const output={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,child_runtime:'Explicit Python314; MSYS-first child PATH only',stdout:r.stdout,stderr:r.stderr};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-REVIEW-'+label+'-process.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(output,null,2));process.exit(r.status??1);
