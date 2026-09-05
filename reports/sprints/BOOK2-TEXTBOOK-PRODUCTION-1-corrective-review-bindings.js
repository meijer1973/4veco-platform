// Read-only verification of adopted REVISE/FAIL evidence; never a quality PASS.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '../..');
const pair = path.resolve(root, '..');
const read = (f) => fs.readFileSync(f);
const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
const json = (f) => JSON.parse(read(path.join(root, 'reports/sprints', 'BOOK2-TEXTBOOK-PRODUCTION-1-' + f)));
const resolve = (p) => path.join(p.startsWith('4veco-') ? pair : root, p);
const verify = (p, sha) => assert.equal(hash(read(resolve(p))), sha, p);
const qc = json('221-QC-r7-inspection.json');
assert.equal(qc.verdict, 'REVISE');
assert.equal(qc.unresolved_blockers, 1);
let pages = 0;
for (const doc of qc.documents) {
  const dir = path.dirname(path.dirname(resolve(doc.pages[0].path)));
  const m = JSON.parse(read(path.join(dir, 'manifest.json')));
  assert.equal(hash(read(path.join(dir, 'manifest.json'))), doc.manifest_raw_sha256);
  assert.equal(m.pdf_sha256, doc.pdf_raw_sha256);
  const relativePdf = m.source_pdf.replaceAll('\\', '/').split('/4veco-lessen/')[1];
  verify('4veco-lessen/' + relativePdf, doc.pdf_raw_sha256);
  for (const page of doc.pages) { verify(page.path, page.raw_sha256); pages++; }
}
assert.equal(pages, 20);
for (const g of qc.grayscale) verify(g.path, g.raw_sha256);
for (const key of ['paragraph_review', 'paragraph_plan', 'chapter_plan', 'historical_handoff_unchanged']) verify(qc[key].path, qc[key].raw_sha256);
const review = json('222-independent-inspection-r12.json');
assert.equal(review.review_verdict, 'FAIL');
assert.deepEqual(review.blockers, ['222-R12-PROC-ORDER', '222-R12-ALT-LENGTH']);
let morePages = 0;
for (const doc of review.documents) {
  verify(doc.pdf.path, doc.pdf.sha256);
  verify(doc.generation_manifest.path, doc.generation_manifest.sha256);
  for (const page of doc.pages) { verify(page.path, page.sha256); morePages++; }
}
assert.equal(morePages, 21);
for (const g of review.grayscale) verify(g.path, g.sha256);
const rel = path.dirname(review.documents[0].pdf.path).slice('4veco-lessen/'.length) + '/2.2.2-review.md';
const current = read(path.join(pair, '4veco-lessen', rel));
const original = execFileSync('git', ['show', 'be754856f6b6c2cb1cbe1d6abedbe93c2637b8b1:' + rel], { cwd: path.join(pair, '4veco-lessen') });
assert.equal(hash(current), hash(original));
assert(current.toString('utf8').includes('**FAIL**'));
console.log(JSON.stringify({ result: 'PASS_FOR_ADOPTION_PROVENANCE_ONLY', quality_acceptance: 'WITHHELD', current_221_qc: qc.verdict, current_222_paragraph: review.review_verdict, required_findings: 3, fresh_page_hashes: pages + morePages, exact_pdf_and_generation_manifest_bindings: 6, grayscale_bindings: qc.grayscale.length + review.grayscale.length, canonical_222_raw_sha256: hash(current), canonical_222_exact_original_commit: 'be754856f6b6c2cb1cbe1d6abedbe93c2637b8b1', no_source_output_qc_handoff_mutation: true }, null, 2));
