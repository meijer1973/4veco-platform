'use strict';
// Exact owned process capture; no foreign outputs or swallowed exit codes.
const fs=require('fs'),path=require('path'),cp=require('child_process'),c=require('crypto'),A=require('assert/strict');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),pre='reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-22-INPUT-CANDIDATE-',f=pre+'check.cjs';
const [mode,label]=process.argv.slice(2);A(['create','check','verify'].includes(mode));A.match(label,/^r[1-9][0-9]*$/);
const dest=path.join(P,pre+mode+'-'+label+'-process.json');A(!fs.existsSync(dest));
const git=(r,...a)=>cp.execFileSync('git',a,{cwd:r,encoding:'utf8'}).trim(),sha=b=>c.createHash('sha256').update(b).digest('hex'),args=[f,mode,...(mode==='check'?[label]:[])];
const env={...process.env,PYTHONIOENCODING:'utf-8',PYTHONDONTWRITEBYTECODE:'1'};
for(const [repo,r]of[['PLATFORM',P],['LESSEN',L]]){env['FOURVECO_'+repo+'_ROOT']=r;env['FOURVECO_'+repo+'_SOURCE_REF']=git(r,'rev-parse','HEAD');env['FOURVECO_'+repo+'_SOURCE_BRANCH']=git(r,'branch','--show-current');}
const start=new Date().toISOString(),v=cp.spawnSync('node',args,{cwd:P,env,maxBuffer:128*1024*1024}),o=v.stdout||Buffer.alloc(0),e=v.stderr||Buffer.alloc(0);
fs.writeFileSync(dest,JSON.stringify({command:'node',args,cwd:P,start,end:new Date().toISOString(),controller_commit:git(P,'rev-parse','HEAD'),source:{path:f,sha256:sha(fs.readFileSync(path.join(P,f))),source_utf8:fs.readFileSync(path.join(P,f),'utf8')},paired:Object.fromEntries(Object.entries(env).filter(([k])=>k.startsWith('FOURVECO_'))),exit_code:v.status,stdout:o.toString('utf8'),stderr:e.toString('utf8'),stdout_base64:o.toString('base64'),stderr_base64:e.toString('base64'),error:v.error?.message},null,2)+'\n',{flag:'wx'});
process.stdout.write(o);process.stderr.write(e);process.exitCode=v.status===null?1:v.status;
