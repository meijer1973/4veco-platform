// HOW TO ADAPT: exact committed paragraph-review payload; unmodified lane tool.
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-REVIEW';
const ph='456969885a83b2627868e8d66a9f09396c815016',lh='8fdf0e74885b19993998e69ac789e8bb91e860f8';
const pb='b777877deb69a2094b9eff575e16e791744e85f1',lb='994657c8901729fcb138493be4e8c2e9590081bd';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function run(exe,args,cwd=P){const r=cp.spawnSync(exe,args,{cwd,encoding:null,maxBuffer:160*1024*1024,windowsHide:true});if(r.error)throw r.error;return {exe,args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};}
const result={actor:'paragraph_231_specialist_qc',role:'distinct paragraph reviewer',payload:{platform:ph,lessons:lh},scope_commands:[],whitespace_commands:[],owned:[]};
for(const [label,cwd,lane,base,head] of [
 ['platform_increment_evidence_only',P,'shared',pb,ph],['lessons_increment',L,'textbook',lb,lh],
 ['platform_complete',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',ph],
 ['lessons_complete',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh]]){
 const r=run('node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json']);
 r.label=label;r.result=JSON.parse(r.stdout);result.scope_commands.push(r);
 const w=run('git',['-c','core.quotePath=false','diff','--check',base,head],cwd);w.label=label;result.whitespace_commands.push(w);
}
const review='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.4 Gemengde opgaven elasticiteit/2.2.4-review.md';
for(const [repo,cwd,base,head] of [['platform',P,pb,ph],['lessons',L,lb,lh]]){
 const paths=run('git',['diff','--name-only','-z',base,head],cwd).stdout.split('\0').filter(Boolean);
 for(const rel of paths){
  const allowed=repo==='platform'?rel.startsWith('reports/sprints/'+prefix+'-'):rel===review;
  const raw=fs.readFileSync(path.join(cwd,rel)),committed=cp.spawnSync('git',['show',head+':'+rel],{cwd,encoding:null,maxBuffer:80*1024*1024,windowsHide:true});
  if(committed.status!==0)throw Error('Missing committed payload '+rel);
  result.owned.push({repo,path:rel,allowed,raw_sha256:sha(raw),committed_raw_sha256:sha(committed.stdout),current_exact:raw.equals(committed.stdout)});
 }
 if(repo==='lessons'&&(paths.length!==1||paths[0]!==review))throw Error('Expected sole canonical review');
}
const custody=path.join(__dirname,prefix+'-evidence/224-final-custody.json');
result.custody={path:path.relative(P,custody).replace(/\\/g,'/'),raw_sha256:sha(fs.readFileSync(custody)),result:JSON.parse(fs.readFileSync(custody,'utf8'))};
result.owned_status=result.owned.every(x=>x.allowed&&x.current_exact)?'PASS':'FAIL';
result.note='Evidence-only platform native scope FAIL is expected without shared source anchor; it is retained, not converted to PASS. Whole candidate scope and ownership are distinct. Raw stdout CRLF whitespace diagnostics remain exact.';
const file=path.join(__dirname,prefix+'-scope.json');fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({owned:result.owned_status,count:result.owned.length,scope:result.scope_commands.map(x=>({label:x.label,exit_code:x.exit_code,result:x.result.ok,counts:x.result.counts})),whitespace:result.whitespace_commands.map(x=>({label:x.label,exit_code:x.exit_code,stdout_bytes:Buffer.from(x.stdout_base64,'base64').length})),sha256:sha(fs.readFileSync(file))},null,2));
if(result.owned_status!=='PASS')process.exitCode=1;
