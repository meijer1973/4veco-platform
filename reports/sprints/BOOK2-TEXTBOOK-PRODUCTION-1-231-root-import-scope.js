// HOW TO ADAPT: exact committed import scope, no exception or classifier mutation.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),a=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const subject='2a3dc4075a31d39da3f5ef0cf794846c3b842595',lesson='cf8a5fa5c3dcdb672d4231e0d97df535f1000abe';
const checks=[
 ['root_import_platform',['--lane','shared','--base','1b4ebdd1fc6d835c5b7baea5edd73741836b18f6','--head',subject]],
 ['root_import_lessons',['--cwd',lessons,'--lane','textbook','--base','d4e1910d60964ee4b9ac97eefbf0e0ed202fc28f','--head',lesson]],
 ['complete_platform',['--lane','shared','--base','96416b6b5bd57094576e9aba0a42d682584ec479','--head',subject]],
 ['complete_lessons',['--cwd',lessons,'--lane','textbook','--base','f09fd6e88edc5049b026b16b0158e7e188091d2d','--head',lesson]]
].map(([name,args])=>{
 const command=['build-scripts/workflows/check-paragraph-lane-scope.js',...args,'--json'];
 const r=cp.spawnSync(process.execPath,command,{cwd:root,encoding:'utf8',maxBuffer:128*1024*1024});
 const data=JSON.parse(r.stdout);a.equal(r.status,0,r.stderr+r.stdout);a.equal(data.categories.unknown.length,0);a.equal(data.exception.present,false);
 return {name,command,exit_code:r.status,stdout:r.stdout,stderr:r.stderr,result:data};
});
const out=path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-231-root-import-scope.json');
fs.writeFileSync(out,JSON.stringify({status:'PASS',platform:subject,lessons:lesson,checks,limits:'Only exact committed import scope; original builder FAIL remains in immutable evidence; no source quality acceptance or CI claim'},null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({status:'PASS',checks:checks.map(x=>({name:x.name,exit_code:x.exit_code,categories:Object.fromEntries(Object.entries(x.result.categories).map(([k,v])=>[k,v.length]))})),output:out},null,2));
