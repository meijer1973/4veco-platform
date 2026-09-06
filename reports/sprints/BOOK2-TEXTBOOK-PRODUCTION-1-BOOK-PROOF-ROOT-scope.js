// HOW TO ADAPT: actual committed technical-review phase, not an invented source anchor.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict'),crypto=require('crypto');
const P=path.resolve(__dirname,'../..'),L=path.resolve(P,'../4veco-lessen'),prefix='BOOK2-TEXTBOOK-PRODUCTION-1-BOOK-PROOF-ROOT';
const base='50db4c5da142812f47bf02219e393447caedecfb',head='51c9469db1c6a8d780ba2524ea1017ef69293e02',lh='42996c60b4a93843dfe8488b8e5a3ea704871667';
const commands=[],hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const git=(cwd,...args)=>cp.execFileSync('git',args,{cwd,maxBuffer:64*1024*1024});
function run(args,cwd=P,expected=0){const r=cp.spawnSync(args[0],args.slice(1),{cwd,maxBuffer:64*1024*1024}),row={args,cwd,exit_code:r.status,stdout:r.stdout.toString('utf8'),stderr:r.stderr.toString('utf8'),stdout_base64:r.stdout.toString('base64'),stderr_base64:r.stderr.toString('base64')};commands.push(row);if(expected!==null)a.equal(r.status,expected,JSON.stringify(row));return row;}
a.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);a.equal(run(['git','rev-parse','HEAD'],L).stdout.trim(),lh);a.equal(run(['git','status','--porcelain'],L).stdout.trim(),'');a.equal(run(['git','diff','--name-only',lh],L).stdout,'');
const custody=JSON.parse(fs.readFileSync(path.join(__dirname,prefix+'-custody.json'),'utf8')),imports=new Map(custody.imports.map(r=>[r.path,r]));a.equal(imports.size,32);
const logs=new Set(['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl']);
const names=run(['git','diff','--name-only','--no-renames','-z',base,head]).stdout.split('\0').filter(Boolean),owned=[];
for(const n of names){a(imports.has(n)||logs.has(n)||n.startsWith('reports/sprints/'+prefix+'-'),n);const b=git(P,'show',head+':'+n);a(fs.readFileSync(path.join(P,n)).equals(b));if(imports.has(n))a.equal(hash(b),imports.get(n).sha256);owned.push({path:n,sha256:hash(b)});}
for(const r of custody.source_bindings)a.equal(hash(fs.readFileSync(path.join(P,r.path))),r.raw_sha256,r.path);
for(const[n,h]of Object.entries(custody.lesson_files))a.equal(hash(fs.readFileSync(path.join(L,n))),h,n);
const scopes=[];
for(const[label,cwd,lane,b,h,exit]of[['incremental-platform',P,'shared',base,head,1],['complete-platform',P,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head,0],['complete-lessons',L,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lh,0]]){
 const r=JSON.parse(run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],P,exit).stdout);a.equal(r.categories.unknown.length,0);a.equal(r.ok,exit===0);if(exit===1)a.deepEqual(r.failures,['shared lane needs at least one shared platform change','generated index/report or review-evidence changes are allowed only with lane-owned changes']);scopes.push({label,result:r});
}
run(['git','diff','--check',base,head]);const whole=run(['git','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null),wholeCr=run(['git','-c','core.whitespace=cr-at-eol','diff','--check','96416b6b5bd57094576e9aba0a42d682584ec479',head],P,null);
const result={status:'PASS',platform:{base,head},lessons:{head:lh,unchanged:true,incremental_native_scope:'UNCHANGED; no empty-diff PASS claimed'},strict_owned_paths:owned,import_count:32,source_files_unchanged:4,lesson_files_unchanged:Object.keys(custody.lesson_files).length,scopes,whitespace:{incremental_default_exit:0,complete_default_exit:whole.exit_code,complete_cr_at_eol_exit:wholeCr.exit_code,actual_diagnostics_preserved:true},commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:result.status,owned_paths:owned.length,scopes:scopes.map(s=>({label:s.label,ok:s.result.ok,counts:Object.fromEntries(Object.entries(s.result.categories).map(([k,v])=>[k,v.length]))})),whitespace:result.whitespace,lesson_files_unchanged:result.lesson_files_unchanged},null,2));
