// Root R6 adoption provenance and explicit path-only R5 comparison derivative.
// Never rewrites original before/capture evidence or supplies review acceptance.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '../..');
const lesson = path.resolve(root, '../4veco-lessen');
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1-213-';
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const read = p => fs.readFileSync(p);
const json = name => JSON.parse(read(path.join(__dirname,prefix+name)));
const relocate = p => path.join(p.includes('4veco-lessen')?lesson:root, p.replaceAll('\\','/').split(/\/4veco-(?:lessen|platform)\//)[1]);
const build = json('alt-build-r6.json');
const final = json('alt-final-delta-r6.json');
const folder = path.dirname(relocate(build.documents[0].source_pdf));
for (const [file, sha] of Object.entries(final.artifacts)) assert.equal(hash(read(path.join(folder,file))),sha,file);
for (const [file, sha] of Object.entries(final.protected)) assert.equal(hash(read(relocate(file))),sha,file);
for (const file of final.owned_source_scope) assert.equal(hash(read(path.join(root,file.path))),file.new_raw_sha256);
let pages=0;
for (const [index,doc] of build.documents.entries()) {
  const directory=relocate(doc.proof_directory), old=directory.replace(/-r6$/,'-r5');
  const proof=JSON.parse(read(path.join(directory,'manifest.json')));
  const previous=JSON.parse(read(path.join(old,'manifest.json')));
  assert.equal(proof.pdf_sha256,doc.pdf_sha256);
  assert.deepEqual(proof.page_sha256,previous.page_sha256);
  assert.equal(proof.inspection_status,'PENDING');
  assert.deepEqual(proof.pages_inspected,[]);
  assert.equal(hash(read(relocate(doc.source_pdf))),previous.pdf_sha256);
  for(const file of proof.rendered_pages){
    assert.equal(hash(read(path.join(directory,file))),proof.page_sha256[path.basename(file)]);
    assert.deepEqual(read(path.join(directory,file)),read(path.join(old,file)));
    pages++;
  }
  const generated=json('root-build-r6.json').documents[index];
  for(const key of ['source_sha256','html_sha256','pdf_sha256']) assert.equal(generated[key],doc[key]);
  assert.equal(generated.zip.sha256,doc.zip.sha256);
}
assert.equal(pages,29);
let grays=0;
if(fs.existsSync(path.join(__dirname,prefix+'root-rebuild-r6.json'))){
  const fresh=json('root-rebuild-r6.json'),old=json('root-rebuild-r5.json');
  for(const item of fresh.grayscale_pages){
    const prior=old.grayscale_pages.find(g=>g.page===item.page);
    assert(prior);
    assert.equal(hash(read(item.path)),item.sha256);
    assert.equal(hash(read(prior.path)),item.sha256);
    grays++;
  }
  assert.equal(grays,5);
}
if(process.argv.includes('--derive-paths')){
  const originalName=prefix+'alt-before-native-r5.json';
  const original=JSON.parse(read(path.join(__dirname,originalName)));
  const derivative={...original,protected:Object.fromEntries(Object.entries(original.protected).map(([p,sha])=>[relocate(p),sha])),path_derivative:{source:originalName,source_sha256:hash(read(path.join(__dirname,originalName))),change:'Protected dictionary absolute keys only; every value and all other baseline fields unchanged'}};
  const destination=path.join(__dirname,prefix+'root-before-native-r5.json');
  assert(!fs.existsSync(destination),'Immutable root baseline derivative already exists');
  fs.writeFileSync(destination,JSON.stringify(derivative,null,2)+'\n');
}
console.log(JSON.stringify({result:'PASS_FOR_CANDIDATE_BINDINGS',actual_artifacts:Object.keys(final.artifacts).length,protected_input_bindings:Object.keys(final.protected).length,owned_source_bindings:final.owned_source_scope.length,own_prior_page_pairs:pages,own_prior_grayscale_pairs:grays,pdfs_unchanged:3,all_four_edition_hashes_match:3,independent_gates:'PENDING',path_only_baseline_derivative_written:process.argv.includes('--derive-paths')},null,2));
