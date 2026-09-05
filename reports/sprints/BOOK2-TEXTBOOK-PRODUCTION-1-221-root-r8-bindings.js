// Exact bounded adoption check. Only --bind-proof-links mechanically updates
// the new root build record after matching immutable published proof contents.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const {execFileSync} = require('child_process');
const root = path.resolve(__dirname, '../..');
const lesson = path.resolve(root, '../4veco-lessen');
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-221-';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => fs.readFileSync(p);
const json = name => JSON.parse(read(path.join(__dirname, prefix + name)));
const relocated = p => path.join(p.includes('4veco-lessen') ? lesson : root, p.replaceAll('\\','/').split(/\/4veco-(?:lessen|platform)\//)[1]);
const original = (repo, relative, sha) => execFileSync('git', ['show', sha + ':' + relative], {cwd:repo});
const published = json('ALT-build-r8.json');
const current = json('root-build-r8.json');
const inventory = json('ALT-mechanical-r8.json');
let bindings = 0, pages = 0;
for (const file of inventory.inventory) {
  assert.equal(hash(read(path.join(file.repo === 'lessons' ? lesson : root, file.path))), file.after_sha256, file.path);
  bindings++;
}
for (let index=0; index<3; index++) {
  const pub = published.documents[index], doc = current.documents[index];
  for (const [file, sha] of [['source_md','source_sha256'],['source_html','html_sha256'],['source_pdf','pdf_sha256']]) {
    assert.equal(doc[sha], pub[sha]);
    assert.equal(hash(read(doc[file])), pub[sha]);
    assert.equal(path.resolve(doc[file]), relocated(pub[file]));
  }
  const directory = relocated(pub.proof_directory);
  const oldDirectory = directory.replace(/-r8$/, '-r7');
  const proof = JSON.parse(read(path.join(directory, 'manifest.json')));
  const previous = JSON.parse(read(path.join(oldDirectory, 'manifest.json')));
  assert.equal(proof.pdf_sha256, doc.pdf_sha256);
  assert.equal(proof.inspection_status, 'PENDING');
  assert.deepEqual(proof.pages_inspected, []);
  assert.deepEqual(proof.page_sha256, previous.page_sha256);
  for (const file of proof.rendered_pages) {
    const fresh = read(path.join(directory, file));
    assert.equal(hash(fresh), proof.page_sha256[path.basename(file)]);
    assert.deepEqual(fresh, read(path.join(oldDirectory, file)));
    pages++;
  }
  doc.proof_directory = directory;
  for (const asset of pub.assets) assert.equal(hash(read(relocated(asset.path))), asset.sha256);
  const relativePdf = path.relative(lesson, doc.source_pdf).replaceAll('\\','/');
  assert.deepEqual(read(doc.source_pdf), original(lesson, relativePdf, '6362d2596b20c3e28184d8b6a1a74cb6c901d7f0'));
}
assert.equal(pages, 20);
const htmlPath = current.documents[0].source_html;
const relativeHtml = path.relative(lesson, htmlPath).replaceAll('\\','/');
let expected = original(lesson, relativeHtml, '6362d2596b20c3e28184d8b6a1a74cb6c901d7f0').toString('utf8');
for (const [before, after] of [
  ['alt="Vergelijk de procentuele reacties op dezelfde schaal."', 'alt="Procentuele prijs- en hoeveelheidsreacties op dezelfde schaal."'],
  ['<figcaption aria-hidden="true">Vergelijk de procentuele reacties op\ndezelfde schaal.</figcaption>', '<figcaption>Vergelijk de procentuele reacties op dezelfde\nschaal.</figcaption>']
]) {
  assert.equal(expected.split(before).length - 1, 1);
  expected = expected.replace(before, after);
}
assert.equal(read(htmlPath).toString('utf8'), expected);
const alts = [];
for (const doc of current.documents) {
  for (const found of read(doc.source_html).toString('utf8').matchAll(/<img\b[^>]*\balt="([^"]*)"[^>]*>/g)) {
    const alternative = found[1].replace(/\s+/g, ' ').trim();
    assert(alternative.length > 0 && alternative.length <= 120);
    assert(!/^(Vergelijk|Bekijk|Zie|Afbeelding van)\b/.test(alternative));
    alts.push({alternative, characters:alternative.length});
  }
}
assert.equal(alts.length, 4);
if (process.argv.includes('--bind-proof-links')) {
  fs.writeFileSync(path.join(__dirname, prefix+'root-build-r8.json'), JSON.stringify(current,null,2)+'\n');
}
console.log(JSON.stringify({result:'PASS_FOR_CANDIDATE_BINDINGS', inventory_bindings:bindings, exact_edition_triples:3, own_prior_page_pairs:pages, all_pdfs_identical:true, exact_enumerated_native_html_delta:true, alts, independent_gates:'PENDING', proof_links_written:process.argv.includes('--bind-proof-links')},null,2));
