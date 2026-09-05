// Read-only root adoption/inventory probe. Hash identity is not visual acceptance.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const lessons = path.resolve(root, '../4veco-lessen');
const sprint = 'BOOK2-TEXTBOOK-PRODUCTION-1';
const book = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const report = (suffix) => path.join(root, 'reports/sprints', sprint + suffix);
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const digest = (file) => hash(fs.readFileSync(file));
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const md = fs.readFileSync(report('-output-manifest.md'), 'utf8');
const rows = md.split(/\r?\n/).filter((l) => /^\| \d+ \|/.test(l)).map((l) => {
  const c = l.split('|').map((x) => x.trim());
  return { id: c[2], edition: c[3], state: c[4], relative: c[5].replaceAll('`', '') };
});
assert.equal(rows.length, 41);
assert.equal(new Set(rows.map((r) => r.relative)).size, 41);
const counts = {};
let present = 0;
for (const row of rows) {
  counts[row.state] = (counts[row.state] || 0) + 1;
  const rel = book + '/' + row.relative;
  const exists = fs.existsSync(path.join(lessons, rel));
  assert.equal(exists, row.state !== 'P', row.relative);
  if (exists) present++;
  if (row.state === 'L') {
    const git = (ref) => execFileSync('git', ['rev-parse', ref + ':' + rel], { cwd: lessons, encoding: 'utf8' }).trim();
    assert.equal(git('HEAD'), git('f09fd6e88edc5049b026b16b0158e7e188091d2d'), rel);
  }
}
assert.deepEqual(counts, { C: 18, L: 8, P: 15 });
assert.equal(present, 26);
const pins = md.split(/\r?\n/).filter((l) => /^\| 2\.\d\.\d \/ /.test(l));
assert.equal(pins.length, 18);
for (const line of pins) {
  const c = line.split('|').map((x) => x.trim());
  const [id, edition] = c[1].split(' / ');
  const row = rows.find((r) => r.id === id && r.edition === edition);
  assert.equal(digest(path.join(lessons, book, row.relative)), c[2].replaceAll('`', ''), c[1]);
}
const trace = fs.readFileSync(report('-target-trace.md'), 'utf8');
const records = json(path.join(root, 'references/authored/course-target-exercises.json')).exercises.filter((r) => r.id.startsWith('2.'));
assert.equal(records.length, 12);
for (const record of records) {
  const line = trace.split(/\r?\n/).find((l) => l.startsWith('| ' + record.id + ' |'));
  assert.equal(line.split('|')[2].trim().replaceAll('`', ''), hash(JSON.stringify(record)), record.id);
  assert.equal(record.lesson_goals.length, 4);
}
const reviewSpecs = [
  ['213', '-213-evidence/independent-personal-inspection-r5.json', 29, '94424ae55b1d141d4b76f990cf806143e4b1bd2105df5ea001618ef910a04248'],
  ['221', '-221-paragraph-inspection-r7.json', 20, '36db8a721edf9bfbbc976a66411b611a723588e54ac211f67097a8a01221ee13'],
  ['223', '-223-REVIEW-inspection.json', 32, '793c8460e7d20e8a2e40d7e8912c969c94a091e67fa25566c812264c8769539e'],
];
let pageCount = 0;
let manifestCount = 0;
for (const [shortId, suffix, expectedPages, canonicalPin] of reviewSpecs) {
  const inspection = json(report(suffix));
  const id = shortId.split('').join('.');
  let n = 0;
  for (const doc of inspection.documents) {
    const row = rows.find((r) => r.id === id && r.edition === doc.kind);
    const pdf = path.join(lessons, book, row.relative);
    assert.equal(digest(pdf), doc.pdf_sha256);
    const pages = doc.pages || doc.pages_inspected;
    const dir = doc.proof_directory || path.dirname(path.dirname(pages[0].file)).replaceAll('\\', '/');
    const mfile = path.join(root, dir, 'manifest.json');
    const manifest = json(mfile);
    assert.equal(manifest.pdf_sha256, doc.pdf_sha256);
    const mPin = doc.manifest_raw_sha256 || doc.generation_manifest_sha256;
    if (mPin) assert.equal(digest(mfile), mPin);
    manifestCount++;
    for (const page of pages) {
      const f = page.file ? path.join(root, page.file) : path.join(root, dir, page.path);
      assert.equal(digest(f), page.raw_sha256 || page.sha256, f);
      n++;
    }
    const canonical = path.join(path.dirname(pdf), id + '-review.md');
    assert.equal(digest(canonical), canonicalPin);
  }
  assert.equal(n, expectedPages, shortId);
  if (shortId === '213') for (const gray of inspection.grayscale) assert.equal(digest(path.join(root, gray.file)), gray.sha256);
  pageCount += n;
}
console.log(JSON.stringify({ result: 'PASS', platform_head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), lessons_head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: lessons, encoding: 'utf8' }).trim(), planned_unique_pdfs: 41, present, status_counts: counts, baseline_identical_legacy_pdfs: 8, fresh_pdf_pins: pins.length, frozen_records: records.length, fresh_independent_page_bindings: pageCount, generation_manifests: manifestCount, independent_213_gray_bindings: 5, canonical_review_pins: 3, limitation: 'Read-only hash/provenance check; separate personally attributed reviews/QC/handoffs govern acceptance. No current full-suite/CI/merge claim.' }, null, 2));
