// HOW TO ADAPT: retain actual command outputs for this review; no acceptance.
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW',branch='agent/book2-224-review-20260906';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
function run(exe,args,cwd=P){const r=cp.spawnSync(exe,args,{cwd,encoding:null,maxBuffer:128*1024*1024,windowsHide:true});if(r.error)throw r.error;return {exe,args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};}
const mode=process.argv[2],logs=[];
if(mode.startsWith('current')){
 const folder=path.join(L,'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.4 Gemengde opgaven elasticiteit');
 for(const profile of ['student-web','publisher-print'])logs.push(run('node',['scripts/validate-paragraph.js','--mode','part-a','--profile',profile,folder]));
 logs.push(run('node',['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action','paragraph_production','--paragraph','2.2.4']));
 logs.push(run('node',['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']));
 logs.push(run('node',['build-scripts/sprints/check-sprint-bundle.js','BOOK2-TEXTBOOK-PRODUCTION-1']));
 for(const cwd of [P,L])logs.push(run('git',['fetch','--prune','origin'],cwd));
 logs.push(run('node',['build-scripts/review-gates/check-governance-freshness.js']));
 for(const cwd of [P,L])logs.push(run('node',['build-scripts/ci/check-agent-worktree-safety.js','--check','--worktree',cwd,'--task','BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW','--agent','paragraph_231_specialist_qc','--require-prefix','codex/,agent/']));
}else if(mode==='remote'){
 for(const cwd of [P,L]){
  for(const args of [['status','--porcelain'],['branch','--show-current'],['rev-parse','HEAD'],['rev-parse','@{upstream}'],['ls-remote','--exit-code','origin','refs/heads/'+branch]])logs.push(run('git',args,cwd));
 }
}else throw Error('Use current or remote');
const result={actor:'paragraph_231_specialist_qc',mode,logs,status:logs.every(x=>x.exit_code===0)?'PASS':'FAIL'};
const file=path.join(__dirname,prefix+'-'+mode+'-commands.json');fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,commands:logs.map(x=>({exe:x.exe,args:x.args,exit_code:x.exit_code})),path:file,sha256:sha(fs.readFileSync(file))},null,2));
if(result.status!=='PASS')process.exitCode=1;
