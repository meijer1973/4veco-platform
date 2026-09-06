// HOW TO ADAPT: new exact bases/owned prefix; never manufacture a source anchor.
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),assert=require('assert/strict');
const root=path.resolve(__dirname,'../..'),lessons=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-223-QC';
const pbase='21c9600f55a19d4f65f3832f4b98098351331f4d',lbase='219a977e495abe43c17949e7d8996aab4176faa0';
const head=process.argv[2],lesson=process.argv[3];
assert.match(head,/^[a-f0-9]{40}$/);assert.match(lesson,/^[a-f0-9]{40}$/);
const commands=[];
function run(args,cwd=root,expected=0){const r=cp.spawnSync(args[0],args.slice(1),{cwd,encoding:'utf8',maxBuffer:64*1024*1024});
 commands.push({args,cwd,exit_code:r.status,stdout:r.stdout,stderr:r.stderr});
 if(expected!==null)assert.equal(r.status,expected,JSON.stringify(commands.at(-1)));return r;}
assert.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);
assert.equal(run(['git','rev-parse','HEAD'],lessons).stdout.trim(),lesson);
assert.equal(run(['git','status','--porcelain'],lessons).stdout.trim(),'');
const changed=run(['git','diff','--no-renames','--name-only','-z',pbase,head]).stdout.split('\0').filter(Boolean);
assert(changed.length>0);for(const p of changed)assert(p.startsWith('reports/sprints/'+prefix+'-'),p);
const lc=run(['git','diff','--no-renames','--name-only','-z',lbase,lesson],lessons).stdout.split('\0').filter(Boolean);
const q='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.3 Inkomenselasticiteit en kruiselingse elasticiteit/2.2.3-quality-ref.yaml';
assert.deepEqual(lc,[q]);
const native=[];
for(const [label,cwd,lane,b,h] of [
 ['incremental-platform',root,'shared',pbase,head],['incremental-lessons',lessons,'textbook',lbase,lesson],
 ['complete-platform',root,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head],
 ['complete-lessons',lessons,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lesson]]){
 const r=run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'],root,null);
 const result=JSON.parse(r.stdout);assert.equal(result.categories.unknown.length,0,label);
 if(label!=='incremental-platform')assert.equal(result.ok,true,label);
 else {assert.equal(result.categories.shared_platform.length,0);assert.equal(result.categories.partA_textbook.length,0);assert.equal(result.categories.partB_companion.length,0);}
 native.push({label,exit_code:r.status,result});
}
const whitespace=[];
for(const [label,cwd,b,h] of [['platform',root,pbase,head],['lessons',lessons,lbase,lesson]]){
 for(const scoped of [false,true]){const args=['git',...(scoped?['-c','core.whitespace=cr-at-eol']:[]),'diff','--check',b,h];
 const r=run(args,cwd,null);whitespace.push({label,scoped_cr_at_eol:scoped,exit_code:r.status});}}
const record={strict_owned_pass:true,actual_payload:head,lesson_payload:lesson,pbase,lbase,platform_paths:changed,lesson_paths:lc,
 native_scopes:native,unknown_paths:0,scope_limit:'Native incremental evidence-only shared-lane result is retained literally, not disguised as PASS; complete scopes use genuine base commits with actual shared source changes.',whitespace,commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(record,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({strict_owned_pass:true,platform_paths:changed.length,lesson_paths:lc.length,native:native.map(r=>({label:r.label,exit:r.exit_code,ok:r.result.ok,failures:r.result.failures,unknown:r.result.categories.unknown.length})),whitespace}));
