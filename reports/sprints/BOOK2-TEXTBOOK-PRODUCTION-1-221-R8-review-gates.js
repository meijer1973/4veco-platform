'use strict';
// Argument-preserving wrapper over the actual gates; no fixture or waiver.
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const assert = require('assert');
const root = path.resolve(__dirname, '../..');
const lessons = path.resolve(root, '../4veco-lessen');
const rel = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit';
const paragraph = path.join(lessons, rel);
const prefix = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-221-R8-';
const records = [];
function run(command, args, cwd=root) {
  const result = cp.spawnSync(command, args, {cwd, encoding:'utf8', maxBuffer:50*1024*1024});
  records.push({command, args, cwd, exit_code:result.status, stdout:result.stdout, stderr:result.stderr});
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  assert.strictEqual(result.status, 0, `${command} ${args.join(' ')}`);
  return result.stdout;
}
function changed(repo, base) {
  return [...new Set([
    ...cp.execFileSync('git', ['diff', '--name-only', '-z', base], {cwd:repo, encoding:'utf8'}).split('\0'),
    ...cp.execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], {cwd:repo, encoding:'utf8'}).split('\0')
  ].filter(Boolean))].sort();
}
try {
  for (const profile of ['student-web', 'publisher-print'])
    run('node', ['scripts/validate-paragraph.js','--mode','part-a','--profile',profile,paragraph]);
  for (const action of ['paragraph_production','specialist_review'])
    run('node', ['build-scripts/workflows/check-book-outline-currentness.js','--require-approved','--action',action,'--paragraph','2.2.1']);
  run('node', ['build-scripts/workflows/check-book2-target-authority-remediation.js','--durable']);
  const platformPaths = changed(root, 'b64e45a87011fff113c97dbb74e5f170b0bd7a65');
  const lessonPaths = changed(lessons, '8a71fa62e0894b06afde946292f9d71123699504');
  const indexes = new Set(['reports/url-index.md','reports/github-agent-index-platform.json','reports/github-agent-index-platform.md',
                           'reports/github-agent-index-lessen.json','reports/github-agent-index-lessen.md']);
  assert(platformPaths.every(p => p.startsWith(prefix) || indexes.has(p)), JSON.stringify(platformPaths));
  assert(lessonPaths.every(p => p === `${rel}/2.2.1-review.md`), JSON.stringify(lessonPaths));
  records.push({review_only_scope:'PASS', platformPaths, lessonPaths});
  run('node', ['build-scripts/workflows/check-paragraph-lane-scope.js','--lane','shared','--base','199772e2aa586fce0f71b647ed5188e568dba2e5','--head','HEAD']);
  run('node', ['build-scripts/workflows/check-paragraph-lane-scope.js','--lane','textbook','--cwd',lessons,
               '--base','4c4cd7d0c1d2e5242c818399a96dce3e26013e9c','--head','HEAD']);
  fs.writeFileSync(path.join(root, prefix+'review-gates.json'), JSON.stringify({status:'PASS',records},null,2)+'\n');
  console.log('PASS: both actual profiles, scoped currentness, durable authority, exact own-review paths and real complete candidate lane bounds.');
} catch (error) {
  fs.writeFileSync(path.join(root, prefix+'review-gates-failed.json'), JSON.stringify({status:'FAIL',records,error:String(error)},null,2)+'\n');
  throw error;
}
