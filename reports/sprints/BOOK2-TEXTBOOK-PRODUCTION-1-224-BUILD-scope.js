// HOW TO ADAPT: bind actual committed §224 payloads; never change the lane tool.
'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {spawnSync}=require('child_process');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-224-BUILD';
const ph='d3e9551e4025f007e24a15982da7cdd7cd58ddd7',lh='994657c8901729fcb138493be4e8c2e9590081bd';
const pb='e42c2b276354aeb1eb903bfb480a5dad27d898b2',lb='8a3d4018ad6a5082449a17c59f991cbdc93fbb62';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function run(exe,args,cwd=P){const r=spawnSync(exe,args,{cwd,encoding:null,maxBuffer:160*1024*1024,windowsHide:true});if(r.error)throw r.error;return {exe,args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_raw_sha256:sha(r.stdout),stderr_raw_sha256:sha(r.stderr)};}
function git(cwd,...args){const r=run('git',args,cwd);if(r.exit_code!==0)throw Error(r.stderr);return r.stdout.trim();}
const result={actor:'paragraph_224_builder',independent_review:false,payload:{platform:ph,lessons:lh},scope_commands:[],whitespace_commands:[],owned:[]};
for(const [label,cwd,lane,base,head] of [
 ['platform_increment',P,'shared',pb,ph],['lessons_increment',L,'textbook',lb,lh],
 ['platform_complete',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',ph],
 ['lessons_complete',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh],
 ['platform_evidence_only',P,'shared','0e2349ecf50e817482bf2f5c1d6d5aedc32c9323',ph]]){
 const r=run('node',['build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',base,'--head',head,'--json']);
 r.label=label;r.result=JSON.parse(r.stdout);result.scope_commands.push(r);
 const w=run('git',['-c','core.quotePath=false','diff','--check',base,head],cwd);w.label=label;result.whitespace_commands.push(w);
}
const source=new Set(['build-scripts/content/book-2/b2_224.py',...['answers.md','check_render.py','exercises.md','target-answers.md','test_source.py'].map(p=>'build-scripts/content/book-2/224/'+p)]);
const folder='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.4 Gemengde opgaven elasticiteit/';
const native=new Set(['build_pdf.py',...['opgaven','antwoorden'].flatMap(e=>['md','html','pdf'].map(x=>'2.2.4 Gemengde opgaven elasticiteit – '+e+'.'+x)),...[1,2,3,4].flatMap(i=>['svg','png'].map(x=>'_assets/2.2.4_ex_'+i+'.'+x))].map(p=>folder+p));
for(const [repo,cwd,base,head] of [['platform',P,pb,ph],['lessons',L,lb,lh]]){
 const paths=run('git',['diff','--name-only','-z',base,head],cwd).stdout.split('\0').filter(Boolean);
 for(const rel of paths){
  const allowed=repo==='platform'?(source.has(rel)||rel.startsWith('reports/sprints/'+prefix+'-')):native.has(rel);
  const raw=fs.readFileSync(path.join(cwd,rel));
  const committed=spawnSync('git',['show',head+':'+rel],{cwd,encoding:null,maxBuffer:80*1024*1024,windowsHide:true});
  if(committed.status!==0)throw Error('Missing committed payload '+rel);
  result.owned.push({repo,path:rel,allowed,raw_sha256:sha(raw),committed_raw_sha256:sha(committed.stdout),current_exact:raw.equals(committed.stdout)});
 }
 if(repo==='lessons'&&paths.length!==15)throw Error('Expected exact fifteen native paths');
}
const custodyPath=path.join(__dirname,prefix+'-evidence/224-final-custody.json');
result.complete_raw_custody={path:path.relative(P,custodyPath).replace(/\\/g,'/'),sha256:sha(fs.readFileSync(custodyPath)),result:JSON.parse(fs.readFileSync(custodyPath,'utf8'))};
result.owned_status=result.owned.every(x=>x.allowed&&x.current_exact)?'PASS':'FAIL';
result.note='Native evidence-only shared-lane failure and raw stdout CRLF/historical whitespace failures are retained, not waived or formatted. No artificial anchor or foreign edit.';
const out=path.join(__dirname,prefix+'-scope.json');if(fs.existsSync(out))throw Error('Immutable scope already exists');
fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({owned_status:result.owned_status,owned_count:result.owned.length,scope:result.scope_commands.map(x=>({label:x.label,exit_code:x.exit_code,result:x.result.ok,counts:x.result.counts})),whitespace:result.whitespace_commands.map(x=>({label:x.label,exit_code:x.exit_code,bytes:x.stdout.length})),path:out,sha256:sha(fs.readFileSync(out))},null,2));
if(result.owned_status!=='PASS')process.exitCode=1;
