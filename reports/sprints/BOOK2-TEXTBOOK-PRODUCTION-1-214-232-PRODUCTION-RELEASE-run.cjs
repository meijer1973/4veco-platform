'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const N='BOOK2-TEXTBOOK-PRODUCTION-1-214-232-PRODUCTION-RELEASE',P=path.resolve(__dirname,'../..');
const label=process.argv[2],mode=process.argv[3];a.match(label,/^[a-z0-9-]+$/);a(['create','check','verify'].includes(mode));
const helper=path.join(__dirname,N+'-check.cjs'),before=fs.readFileSync(helper),args=[helper,mode],start=new Date().toISOString();
const r=cp.spawnSync(process.execPath,args,{cwd:P,maxBuffer:128*1024*1024});
const out={label,start,finish:new Date().toISOString(),executable:process.execPath,args,cwd:P,exit_code:r.status,helper_raw_sha256:crypto.createHash('sha256').update(before).digest('hex'),helper_source_base64:before.toString('base64'),stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};
fs.writeFileSync(path.join(__dirname,N+'-'+label+'-process.json'),JSON.stringify(out,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({label,exit_code:r.status,helper_raw_sha256:out.helper_raw_sha256,stdout:out.stdout,stderr_tail:out.stderr.slice(-650)},null,2));process.exitCode=r.status===0?0:1;
