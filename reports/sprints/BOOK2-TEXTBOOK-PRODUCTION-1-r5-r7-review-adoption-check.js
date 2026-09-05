// HOW TO ADAPT: make a new immutable checkpoint with explicit source commits.
// Read-only: binds imported reviews to actual root materials, not fresh inspection.
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cp = require('child_process');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const lessons = path.resolve(root, '../4veco-lessen');
assert.equal(root.replaceAll('\\', '/'), 'C:/wt/book2-part-a-production-20260905/4veco-platform');
const sha = raw => crypto.createHash('sha256').update(raw).digest('hex');
const git = (repo, ...args) => cp.execFileSync('git', args, {cwd: repo, maxBuffer: 32 * 1024 * 1024});
const blob = (repo, ref, file) => git(repo, 'show', `${ref}:${file}`);
const files = (repo, base, head) => git(repo, 'diff', '--name-only', '-z', base, head).toString('utf8').split('\0').filter(Boolean);
const read = (repo, file) => fs.readFileSync(path.join(repo, file));
const json = file => JSON.parse(read(root, file));
const preP = '6294118b9bfecc334800293a2883177fccb91e2a';
const preL = 'd1bd891c052f8a2eed5cf08cc62b921218ebff6c';
const importedP = '0db3e8e4';
const importedL = '25fbd9b';
const prefix = 'reports/sprints/BOOK2-TEXTBOOK-PRODUCTION-1-';
const chapter = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/';
const rel211 = chapter + '2.1.1 Kostenstructuren';
const rel213 = chapter + '2.1.3 Marginale kosten en marginale opbrengsten';
const review211 = rel211 + '/2.1.1-review.md';
const review213 = rel213 + '/2.1.3-review.md';
const e211 = prefix + '211-R5-REVIEW-evidence/';
const e213 = prefix + '213-r7-review-evidence/';
const bindings = [];
function check(repo, file, pin, role) {
  const actual = sha(read(repo, file));
  assert.equal(actual, pin, `${role}: ${file}`);
  bindings.push({repository: path.basename(repo), path: file, sha256: actual, role});
}
function imported(base, head, allow) {
  const changed = files(root, base, head);
  assert.ok(changed.length);
  for (const file of changed) {
    assert.ok(allow(file), `unexpected imported path: ${file}`);
    check(root, file, sha(blob(root, head, file)), 'exact published review evidence');
  }
  return changed;
}
const first = imported('bac19f0f29d5493588a161f3182f33b731eee7d9',
  '7f1cd9d347ae2217483c6303395d4ae793b7c68e', f => f.startsWith(prefix + '211-R5-REVIEW'));
const second = imported('0dafc7969eb9ca2c8b79e2de5332ad1ee2f1ef38',
  'b6bc59106c3e537c2a5248b7b86ea6411d6c3f47', f => f.startsWith(e213) ||
    [prefix + '213-independent-review-plan-r7.md', prefix + '213-paragraph-review-r7.md'].includes(f) ||
    /^reports\/rendered-proof\/BOOK2-TEXTBOOK-PRODUCTION-1\/213-(paragraaf-534177c8280e|opgaven-d12487671bd2|antwoorden-d96f21c3abed)-r8\//.test(f));
assert.deepEqual(files(root, preP, importedP).sort(),
  [...first, ...second, prefix + 'r5-r7-review-adoption-plan.md'].sort());
assert.deepEqual(files(lessons, preL, importedL).sort(), [review211, review213].sort());
for (const [file, commit, pin] of [
  [review211, '3ccd6f68c848d1ab33e5c33fcac754ffbd7c0d99', 'a75755c7c2e6cdffb2defcbb5403814cf854d87bfae9a8172dd768aadb5b8023'],
  [review213, '3b9d1d0b5147f7e3c230f3c0104377d4a7c5331b', '5064642034fac9763202d2424b87cef2f7cc909aaf3a6031b90d247ee44409c3']]) {
  assert.equal(sha(blob(lessons, commit, file)), pin);
  check(lessons, file, pin, 'current independent paragraph review, not QC');
}
assert.deepEqual(read(lessons, review211), read(root, prefix + '211-R5-REVIEW-report.md'));
check(root, prefix + '213-paragraph-review-r7.md', '96a2750b906da3e23b57423730313061b8a46826dcad0cf9069ed03ca504b13f', 'full independent report');
function mapped(original, owner) {
  const normalized = original.replaceAll('\\', '/');
  const start = `C:/wt/${owner}/`;
  assert.ok(normalized.startsWith(start), `unexpected evidence root: ${original}`);
  const tail = normalized.slice(start.length);
  const slash = tail.indexOf('/');
  const repository = tail.slice(0, slash);
  assert.ok(['4veco-platform', '4veco-lessen'].includes(repository));
  const file = tail.slice(slash + 1);
  assert.ok(file && !file.split('/').includes('..'));
  return [repository === '4veco-platform' ? root : lessons, file];
}
const pass211 = json(e211 + 'pass0.json');
assert.equal(pass211.status, 'PASS');
assert.equal(pass211.pages.length, 31);
assert.equal(pass211.native_files.length, 21);
for (const [original, pin] of Object.entries(pass211.bindings)) {
  const [repo, file] = mapped(original, 'book2-211-r5-review-20260905');
  if (repo === lessons && file === review211) {
    check(root, e211 + 'historical-R3-review-snapshot.md', pin, 'preserved old review, explicitly superseded');
    assert.equal(sha(blob(lessons, preL, file)), pin);
  } else check(repo, file, pin, 'reviewed 211 source/output/proof preserved at root');
}
const probes211 = json(e211 + 'independent-probes-recheck.json');
assert.equal(probes211.status, 'PASS');
assert.equal(probes211.automated_visual_acceptance, false);
assert.equal(probes211.changed_pages.length, 1);
assert.equal(probes211.bonus_criteria.length, 3);
const rebuilt211 = json(e211 + 'rebuild.json');
assert.equal(rebuilt211.full_native_identical, true);
assert.equal(rebuilt211.print_only_native_identical, true);
assert.equal(rebuilt211.native_file_count, 21);
const pass213 = json(e213 + 'pass0.json');
assert.equal(pass213.expected_artifacts, 24);
for (const [file, pin] of Object.entries(pass213.hashes)) check(lessons, file, pin, 'reviewed 213 native output preserved at root');
const personal = json(e213 + 'personal-bindings.json');
assert.equal(personal.documents.length, 3);
assert.equal(personal.documents.reduce((n, d) => n + d.personally_viewed_pages.length, 0), 30);
check(root, e213 + 'personal-inspection.md', personal.observations_sha256, 'attributed reviewer observations, not new root views');
check(root, e213 + 'relocated-build.json', personal.relocated_manifest_sha256, 'immutable isolated full-build manifest');
for (const document of personal.documents) {
  check(root, document.manifest_path, document.manifest_sha256, 'immutable PENDING native manifest');
  const manifest = json(document.manifest_path);
  assert.equal(manifest.inspection_status, 'PENDING');
  assert.deepEqual(manifest.pages_inspected, []);
  for (const page of document.personally_viewed_pages) check(root, page.path, page.sha256, 'actual reviewer full page');
}
for (const item of [...personal.grayscale_personally_viewed, ...personal.standalone_figures_personally_viewed, ...personal.native_source_bindings]) {
  const [repo, file] = mapped(item.path, 'book2-213-r7-review-20260905');
  check(repo, file, item.sha256, '213 source or observed graphic');
}
for (const [folder, id] of [[rel211, '2.1.1'], [rel213, '2.1.3']]) {
  const qc = folder + '/' + id + '-quality-ref.yaml';
  check(lessons, qc, sha(blob(lessons, preL, qc)), 'historical QC unchanged, not current acceptance');
}
check(lessons, rel211 + '/2.1.1-textbook-handoff.md', '724a080619f2f072151edf20980071b3bef18cd60d1904c78f4aa906be8917c8', 'historical handoff unchanged');
assert.equal(fs.existsSync(path.join(lessons, rel213, '2.1.3-textbook-handoff.md')), false);
const generator212 = read(root, 'build-scripts/content/book-2/b2_212.py').toString('utf8');
assert.ok(generator212.includes('PRIOR_REVIEW_HASH = "92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96"'));
assert.notEqual(sha(read(lessons, review211)), '92b4a9462caf8316274fb58f8beef5c850147c44e6bf80b9a28fad442d9dbe96');
const previous212 = chapter + '2.1.2 Opbrengsten, winst en break-even/2.1.2 Opbrengsten, winst en break-even – paragraaf.md';
check(lessons, previous212, '9350d60fadee3494124f7b0593bc1efcf00db5ea292d0a19fc3f10518e11d1f8', 'current root predecessor, not old isolated213 pin');
assert.equal(json(e213 + 'relocated-build.json').prior_paragraph_md_raw_sha256,
  'f53521ed8812a4c8b8c33c1d66b34e0afe8425c1dffb1723f37771372b2baa09');
const result = {result: 'PASS', role: 'root exact review adoption, not QC or fresh visual review',
  base: {platform: preP, lessons: preL}, imports: {platform: git(root, 'rev-parse', importedP).toString().trim(),
  lessons: git(lessons, 'rev-parse', importedL).toString().trim()}, imported_file_counts: [first.length, second.length],
  binding_count: bindings.length, bindings, inventory: {accepted: 6, candidate: 12, legacy: 8, planned: 15, total: 41, physical_PDFs: 26},
  new_QC_or_handoff: false, full_root_builds_212_213: 'NOT_RUN: known stale predecessor bindings await separately reviewed S1 succession'};
const serialized = JSON.stringify(result, null, 2) + '\n';
if (process.argv[2]) {
  const destination = path.resolve(root, process.argv[2]);
  assert.equal(destination, path.join(root, prefix + 'r5-r7-review-adoption-bindings.json'));
  fs.writeFileSync(destination, serialized, {encoding: 'utf8', flag: 'wx'});
}
process.stdout.write(serialized);
