'use strict';
// Run only after the final build and checks; review the new finite inventory.
const fs = require('fs'), path = require('path');
const {execFileSync} = require('child_process');
const r = require('./exercise-route-revision');
const root = r.ROOT, lessons = path.resolve(process.argv[2] || path.join(root, '../4veco-lessen'));
const inputs = [
  'skills/econ-exercise-builder.md',
  ...['build_book2_chat.py', 'rebuild_exercise_routes.py', 'books34_assemble.py', 'books34_records.py', 'books34_outlines.py',
    'verify_book2_chat.py', 'verify_exercise_routes.py', 'books34_verify.py', 'exercise-route-revision.js',
    'exercise-route-review.js', 'requirements-exercise-routes.txt'].map(f => 'build-scripts/books/' + f),
];
const doc = {
  revision: r.REVISION, baseline_lesson_commit: r.BASE, roots: r.ROOTS,
  scope: 'Route guidance, honest teacher timing and rebuilt Part A outputs; exercise content and goals preserved. Historical receipts and reviews are not renewed.',
  platform_inputs: inputs.map(file => ({path: file, sha256_lf: r.sha(r.text(fs.readFileSync(path.join(root, file))))})),
  files: r.inventory(lessons).map(file => {const bytes = fs.readFileSync(path.join(lessons, file)); return {path: file, bytes: bytes.length, sha256: r.sha(bytes)};}),
};
const bytes = JSON.stringify(doc, null, 2) + '\n';
fs.writeFileSync(path.join(lessons, r.MANIFEST), bytes);
const changed = execFileSync('git', ['diff', '--name-only', '-z', r.BASE], {cwd: lessons, encoding: 'utf8'});
const extra = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '-z'], {cwd: lessons, encoding: 'utf8'});
const revision_paths = [...new Set((changed + extra).split('\0').filter(f => f === r.MANIFEST || r.ROOTS.some(prefix => f.startsWith(prefix + '/'))))].sort();
fs.writeFileSync(path.join(root, r.PIN_FILE), JSON.stringify({revision: r.REVISION, manifest_sha256: r.sha(bytes), revision_paths}, null, 2) + '\n');
console.log(JSON.stringify({files: doc.files.length, manifest_sha256: r.sha(bytes)}));
