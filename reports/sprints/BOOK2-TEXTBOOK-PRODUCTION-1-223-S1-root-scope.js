// HOW TO ADAPT: create a fresh exact-payload scope report; never reuse output.
'use strict';
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const lessons = path.resolve(root, '../4veco-lessen');
const base = '35e0bebb75cc3987c43dd8f480e1b444bd877f4a';
const lesson = '219a977e495abe43c17949e7d8996aab4176faa0';
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-223-S1-root';
const head = process.argv[2];
assert.match(head, /^[a-f0-9]{40}$/);
const commands = [];
function run(args, cwd = root, expected = 0) {
  const r = cp.spawnSync(args[0], args.slice(1), {cwd, encoding:'utf8', maxBuffer:32*1024*1024});
  commands.push({args,cwd,exit_code:r.status,stdout:r.stdout,stderr:r.stderr});
  if (expected !== null) assert.equal(r.status, expected, JSON.stringify(commands.at(-1)));
  return r;
}
assert.equal(run(['git','rev-parse','HEAD']).stdout.trim(),head);
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, prefix+'-baseline.json'),'utf8'));
const imported = new Set(baseline.imports.map(r=>r.path));
const allowedExtra = new Set(['reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.md',
  'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-command-log.jsonl',
  'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-output-manifest.md']);
const changed = run(['git','diff','--name-only','--no-renames','-z',base,head]).stdout.split('\0').filter(Boolean);
for(const name of changed) assert(imported.has(name) || allowedExtra.has(name) || name.startsWith('reports/sprints/'+prefix+'-'),name);
const native = [];
for(const [label,cwd,lane,b,h] of [
  ['incremental-platform',root,'shared',base,head],
  ['complete-platform',root,'shared','96416b6b5bd57094576e9aba0a42d682584ec479',head],
  ['complete-lessons',lessons,'textbook','f09fd6e88edc5049b026b16b0158e7e188091d2d',lesson]]) {
  const args=['node','build-scripts/workflows/check-paragraph-lane-scope.js','--cwd',cwd,'--lane',lane,'--base',b,'--head',h,'--json'];
  const result=JSON.parse(run(args).stdout);
  assert.equal(result.ok,true,label);
  native.push({label,result});
}
assert.equal(run(['git','rev-parse','HEAD'],lessons).stdout.trim(),lesson);
assert.equal(run(['git','status','--porcelain'],lessons).stdout.trim(),'');
assert.equal(run(['git','diff','--name-only',lesson,'HEAD'],lessons).stdout.trim(),'');
const whitespace=run(['git','diff','--check',base,head],root,null);
const crlf=run(['git','-c','core.whitespace=cr-at-eol','diff','--check',base,head],root,null);
run(['git','diff','--check',base,head,'--','build-scripts']);
const output={pass:true,actual_payload:head,baseline:base,lessons:lesson,strict_owned_paths:changed,
  native_scopes:native,lessons_incremental:'UNCHANGED; no empty-diff native PASS claim',
  whitespace:{default_exit:whitespace.status,scoped_cr_at_eol_exit:crlf.status},commands};
fs.writeFileSync(path.join(__dirname,prefix+'-scope.json'),JSON.stringify(output,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({pass:true,head,owned_paths:changed.length,native_scopes:native.map(n=>({label:n.label,ok:n.result.ok,counts:n.result.counts})),whitespace:output.whitespace}));
