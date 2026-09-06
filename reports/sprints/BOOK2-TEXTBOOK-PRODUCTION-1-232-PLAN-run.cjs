'use strict';
// Actual immutable command capture for this plan-only phase; never produces pupil output.
const fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
const label=process.argv[2],command=process.argv[3],args=process.argv.slice(4);
if(!/^[a-z0-9-]+$/.test(label)||!command)throw Error('label command args required');
const cwd=path.resolve(__dirname,'../..'),started_at=new Date().toISOString();
const r=cp.spawnSync(command,args,{cwd,encoding:'utf8',env:{...process.env,PYTHONIOENCODING:'utf-8'},maxBuffer:64*1024*1024});
const output={command,args,cwd,started_at,ended_at:new Date().toISOString(),exit_code:r.status,stdout:r.stdout,stderr:r.stderr};
fs.writeFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-232-PLAN-'+label+'-process.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(output,null,2));process.exit(r.status??1);
