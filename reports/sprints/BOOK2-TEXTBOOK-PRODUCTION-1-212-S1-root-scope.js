// HOW TO ADAPT: new exact payload and exclusive evidence; no historical rewrite.
'use strict';
const fs=require('fs'), path=require('path'), cp=require('child_process'), assert=require('assert/strict'), crypto=require('crypto');
const root=path.resolve(__dirname,'../..'), lessons=path.resolve(root,'../4veco-lessen');
const prefix='BOOK2-TEXTBOOK-PRODUCTION-1-212-S1-root';
const base='21c9600f55a19d4f65f3832f4b98098351331f4d', lesson='219a977e495abe43c17949e7d8996aab4176faa0', head=process.argv[2];
assert.match(head,/^[a-f0-9]{40}$/);
const commands=[];
function run(args,cwd=root,expected=0) {
  const r=cp.spawnSync(args[0],args.slice(1),{cwd,encoding:'utf8',maxBuffer:32*1024*1024});
  commands.push({args,cwd,exit_code:r.status,stdout:r.stdout,stderr:r.stderr});
  if(expected!==null)assert.equal(r.status,expected,JSON.stringify(commands.at(-1)));
  return r;
}
assert.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);
const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,prefix+'-evidence/baseline.json'),'utf8'));
const imported=new Set(baseline.imports.map(r=>r.path));
const extras=new Set(['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl','reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md']);
const changed=run(['git','diff','--name-only','--no-renames','-z',base,head]).stdout.split('\0').filter(Boolean);
for(const name of changed)assert(imported.has(name)||extras.has(name)||name.startsWith('reports/sprints/'+prefix+'-'),name);
const native=[];
for(const[label,cwd,lane,b,h]of[
  ['incremental-platform',root,'shared',base,head],
  ['complete-platform',root,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head],
  ['complete-lessons',lessons,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lesson]]) {
  const result=JSON.parse(run(['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json']).stdout);
  assert.equal(result.ok,true,label); assert.equal(result.categories.unknown.length,0);
  native.push({label,result});
}
assert.equal(run(['git','rev-parse','HEAD'],lessons).stdout.trim(),lesson);
assert.equal(run(['git','status','--porcelain'],lessons).stdout.trim(),'');
assert.equal(run(['git','diff','--name-only',lesson,'HEAD'],lessons).stdout.trim(),'');
const white=run(['git','diff','--check',base,head],root,null);
const crlf=run(['git','-c','core.whitespace=cr-at-eol','diff','--check',base,head],root,null);
run(['git','diff','--check',base,head,'--','build-scripts']);
if(white.status!==0) {
  const paths=[...white.stdout.matchAll(/^(.+?):\d+: (?:trailing whitespace|new blank line at EOF)\.?$/gm)].map(m=>m[1]);
  assert(paths.length>0);
  for(const name of paths)assert(imported.has(name)&&name.endsWith('-command-log.md'),name);
}
assert.equal(crlf.status,0,'Any non-CR whitespace must be separately investigated');
const manifest=fs.readFileSync(path.join(__dirname,'BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md'),'utf8');
const book=path.join(lessons,'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus');
const rows=[...manifest.matchAll(/^\| (\d+) \| ([^|]+) \| ([^|]+) \| ([ACLP]) \| `([^`]+)` \|$/gm)];
assert.equal(rows.length,41); assert.equal(new Set(rows.map(m=>m[5])).size,41);
const counts={A:0,C:0,L:0,P:0}, inventory=[];
for(const row of rows) {
  counts[row[4]]++;
  const file=path.join(book,row[5]), present=fs.existsSync(file);
  assert.equal(present,row[4]!=='P');
  const digest=present?crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'):null;
  if(['A','C'].includes(row[4]))assert(manifest.includes('`'+digest+'`'),'Missing exact current PDF hash '+row[5]);
  if(row[4]==='L') {
    const rel=path.relative(lessons,file).split(path.sep).join('/');
    const bytes=cp.execFileSync('git',['show','f09fd6e88edc5049b026b16b0158e7e188091d2d:'+rel],{cwd:lessons,maxBuffer:32*1024*1024});
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),digest);
  }
  inventory.push({id:row[2].trim(),edition:row[3].trim(),status:row[4],path:row[5],present,sha256:digest});
}
assert.deepEqual(counts,{A:9,C:12,L:8,P:12});
const output={pass:true,actual_payload:head,base,lessons:lesson,strict_owned_paths:changed,native_scopes:native,
  lessons_incremental:'UNCHANGED',whitespace:{default_exit:white.status,scoped_cr_at_eol_exit:crlf.status,default_diagnostics_preserved:true},
  inventory_counts:counts,inventory,commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({pass:true,head,owned_paths:changed.length,scopes:native.map(n=>({label:n.label,counts:Object.fromEntries(Object.entries(n.result.categories).map(([k,v])=>[k,v.length]))})),whitespace:output.whitespace,inventory:counts}));
