// Read-only exact R5 specialist provenance checkpoint; never quality acceptance.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-213-';
const digest = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const json = f => JSON.parse(fs.readFileSync(path.join(__dirname, prefix + f), 'utf8'));
const media = json('evidence/specialist-media-manifest-r5.json');
const proofs = json('evidence/specialist-proof-bindings-r5.json');
const lesson = path.resolve(root, '../4veco-lessen/Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten');
const rendered = path.join(root, 'reports/rendered-proof/BOOK2-TEXTBOOK-PRODUCTION-1');
assert.equal(media.reviewer, 'paragraph_213_r5_specialist_qc');
assert.equal(media.inspection_status, 'PENDING_PERSONAL_VIEW');
let pages = 0;
for (const doc of media.documents) {
  assert.equal(digest(path.join(lesson, '2.1.3 Marginale kosten en marginale opbrengsten – ' + doc.kind + '.pdf')), doc.pdf_sha256);
  assert.equal(digest(path.join(rendered, '213-specialist-r5', doc.kind + '.pdf')), doc.pdf_sha256);
  const original = proofs.proofs.find(p => p.pdf_sha256 === doc.pdf_sha256);
  assert(original);
  const directory = path.join(rendered, '213-' + doc.kind + '-' + doc.pdf_sha256.slice(0, 12) + '-r5');
  const generation = JSON.parse(fs.readFileSync(path.join(directory, 'manifest.json'), 'utf8'));
  assert.equal(generation.pdf_sha256, doc.pdf_sha256);
  assert.equal(generation.inspection_status, 'PENDING');
  assert.deepEqual(generation.page_sha256, original.page_sha256);
  for (const [page, sha] of Object.entries(doc.pages)) {
    assert.equal(digest(path.join(root, page)), sha);
    const number = Number(path.basename(page).match(/page-(\d+)\.png$/)[1]);
    const native = 'page-' + String(number).padStart(3, '0') + '.png';
    assert.equal(generation.page_sha256[native], sha);
    assert.equal(digest(path.join(directory, 'pages', native)), sha);
    pages++;
  }
}
assert.equal(pages, 29);
assert.equal(Object.keys(media.grayscale).length, 5);
for (const [file, sha] of Object.entries(media.grayscale)) assert.equal(digest(path.join(root, file)), sha);
assert.equal(digest(path.join(lesson, '2.1.3-quality-ref.yaml')), 'c96a4af45cfbf6c43ceda27ecf6dd231c75667ece58b378b9080975fe4be717f');
assert.equal(digest(path.join(lesson, '2.1.3-review.md')), '94424ae55b1d141d4b76f990cf806143e4b1bd2105df5ea001618ef910a04248');
console.log(JSON.stringify({result:'PASS_FOR_ADOPTION_PROVENANCE_ONLY', quality_acceptance:'WITHHELD', specialist_verdict:'REVISE', fresh_page_pairs:pages, grayscale_bindings:5, exact_pdf_copy_and_generation_bindings:3, canonical_review_and_quality_unchanged:true, personal_inspection_record:prefix+'evidence/specialist-personal-inspection-r5.md', no_capture_status_rewrite:true}, null, 2));
