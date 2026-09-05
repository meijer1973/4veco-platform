// Read-only checkpoint for the exact published 213 R6 / 221 R8 reviews.
// HOW TO ADAPT: create a new explicit checkpoint after a reviewed successor;
// do not update historical hashes or infer specialist/visual acceptance here.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const assert = require('assert/strict');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '../..');
const lessons = path.resolve(root, '../4veco-lessen');
const prefix = 'BOOK2-TEXTBOOK-PRODUCTION-1';
const report = (s) => path.join(root, 'reports/sprints', prefix + s);
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const digest = (p) => sha(fs.readFileSync(p));
const json = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const relocate = (p) => {
  const normalized = p.replaceAll('\\', '/').replace(/^\/\/\?\//, '');
  const m = normalized.match(/^C:\/wt\/book2-(?:213-r6-review|213-alt-correction|221-r8-review)-20260905\/(4veco-platform|4veco-lessen)\/(.+)$/);
  assert(m, 'Unexpected external evidence path: ' + p);
  const base = m[1] === '4veco-platform' ? root : lessons;
  const result = path.resolve(base, m[2]);
  assert(result.startsWith(base + path.sep));
  return result;
};
let fileChecks = 0;
const verify = (p, expected) => { assert.match(expected, /^[a-f0-9]{64}$/); assert.equal(digest(p), expected, p); fileChecks++; };
const verifyExternal = (p, expected) => verify(relocate(p), expected);
const document = (d) => {
  for (const [p,h] of [['source_md','source_sha256'],['source_html','html_sha256'],['source_pdf','pdf_sha256']]) verifyExternal(d[p],d[h]);
  for (const a of d.assets) verifyExternal(a.path,a.sha256);
  if(d.zip) verifyExternal(d.zip.path,d.zip.sha256);
};
const j221 = json(report('-221-R8-review-inspection.json'));
assert.equal(j221.reviewer, 'paragraph_221_r8_independent_review');
assert.equal(j221.status, 'PASS');
assert.equal(j221.pages.length, 20);
assert.equal(j221.figures.length, 3);
assert.equal(j221.grayscale.length, 3);
verify(report('-221-R8-review-inspection.json'),'cbc22a71eb124b869b0f11bec08332840518252a01be0122b364296adb8721cf');
verify(report('-221-R8-review-report.md'),'4c17bbcd56f963ab46ff9b83bc306c80226345283de9dd4fcda62332bd052dd3');
verify(report('-221-R8-review-probes.json'),'a80db5a296ae510314223c5ff5b1261f429abdfd585da8b6602ca70470e85ef8');
verify(report('-221-R8-render-check.json'),'37f9827477f8fc9489a7a9ed1ea052959286fcde7f4ff58d569e3a3991352598');
for(const d of j221.documents) {
  document(d);
  const mf = path.join(relocate(d.proof_directory),'manifest.json');
  verify(mf,d.proof_manifest_sha256);
  assert.equal(json(mf).pdf_sha256,d.pdf_sha256);
}
for(const p of j221.pages) {
  assert.equal(p.personally_viewed_full_page,true);
  verifyExternal(p.fresh_path,p.raw_sha256);
  verifyExternal(p.published_r8_path,p.raw_sha256);
}
for(const p of j221.grayscale) verifyExternal(p.path,p.raw_sha256);
for(const b of json(report('-221-R8-review-probes.json')).bindings) {
  if(b.path) verifyExternal(b.path,b.sha256);
  else { assert(b.source_md); document(b); }
}
const dir213 = '-213-r6-review-evidence/';
const b213 = json(report(dir213+'bindings.json'));
const m213 = json(report(dir213+'relocated-build.json'));
const rebuild213 = json(report(dir213+'rebuild.json'));
assert.equal(b213.result,'PASS');
verify(report(dir213+'relocated-build.json'),rebuild213.source_manifest_sha256);
let pages213 = 0;
for(const c of b213.checks) {
  if(c.path) verifyExternal(c.path,c.hash);
  else {
    const dir = relocate(c.proof);
    verify(path.join(dir,'manifest.json'),c.manifest_sha256);
    for(const [name,h] of Object.entries(c.pages)) {verify(path.join(dir,'pages',name),h);pages213++;}
  }
}
assert.equal(pages213,29);
for(const d of m213.documents) {
  document(d);
  const mf = json(path.join(relocate(d.proof_directory),'manifest.json'));
  assert.equal(mf.pdf_sha256,d.pdf_sha256);
  assert.equal(mf.inspection_status,'PENDING');
}
assert.equal(rebuild213.grayscale_pages.length,5);
for(const p of rebuild213.grayscale_pages) verifyExternal(p.path,p.sha256);
const protected213 = json(report(dir213+'protected-and-target.json'));
for(const p of protected213.pins) verifyExternal(p.path,p.raw_sha256);
const transitions = [
  ['2.1 Hoofdstuk Kosten en opbrengsten/2.1.3 Marginale kosten en marginale opbrengsten','2.1.3','94424ae55b1d141d4b76f990cf806143e4b1bd2105df5ea001618ef910a04248','a70fd9571cea3afc5861d1b91dc99c102757767e0fb9d66da211602a90c82d66'],
  ['2.2 Hoofdstuk Elasticiteit/2.2.1 Prijselasticiteit','2.2.1','36db8a721edf9bfbbc976a66411b611a723588e54ac211f67097a8a01221ee13','19bfa448b3c0f80732f2fa77617eb2772880747082fb683c8cd3852c74a96c63'],
];
const baseline='a2bb4bcf199b8871eef21426f329efb6795e7dd8';
for(const [dir,id,oldHash,newHash] of transitions) {
  const relative='Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/'+dir+'/'+id+'-review.md';
  assert.equal(sha(execFileSync('git',['show',baseline+':'+relative],{cwd:lessons})),oldHash);
  verify(path.join(lessons,relative),newHash);
  for(const suffix of ['-quality-ref.yaml','-textbook-handoff.md']) {
    const rel=relative.replace('-review.md',suffix);
    if(id==='2.1.3' && suffix==='-textbook-handoff.md') {
      assert.equal(execFileSync('git',['ls-tree','--name-only',baseline,'--',rel],{cwd:lessons,encoding:'utf8'}).trim(),'');
      assert.equal(fs.existsSync(path.join(lessons,rel)),false);
      continue;
    }
    const old=execFileSync('git',['show',baseline+':'+rel],{cwd:lessons});
    verify(path.join(lessons,rel),sha(old));
  }
}
const changed=execFileSync('git',['diff','--name-only',baseline,'HEAD'],{cwd:lessons,encoding:'utf8'}).trim().split(/\r?\n/);
assert.equal(changed.length,2);
assert(changed.every(p=> /2\.(?:1\.3|2\.1)-review\.md$/.test(p)));
const head=(cwd)=>execFileSync('git',['rev-parse','HEAD'],{cwd,encoding:'utf8'}).trim();
console.log(JSON.stringify({result:'PASS',platform_head:head(root),lessons_head:head(lessons),fileChecks,reviewed_pages:49,grayscale_bindings:8,pdfs:6,canonical_review_transitions:2,quality_and_handoffs:'UNCHANGED',visual_acceptance:'No new root page-view claim; observations remain attributed to the two distinct reviewers.',next_gate:'Distinct current specialist QC, root handoff and final combined acceptance remain pending.'},null,2));
