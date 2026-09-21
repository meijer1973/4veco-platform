'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const r = require('./exercise-route-revision');
let root, doc, bytes;
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'route-revision-'));
  const files = r.ROOTS.map(prefix => {
    fs.mkdirSync(path.join(root, prefix), {recursive: true});
    const file = prefix + '/source.md'; fs.writeFileSync(path.join(root, file), 'reviewed');
    return {path: file, bytes: 8, sha256: r.sha('reviewed')};
  });
  doc = {revision: r.REVISION, baseline_lesson_commit: r.BASE, roots: r.ROOTS, files};
  bytes = () => Buffer.from(JSON.stringify(doc));
});
afterEach(() => fs.rmSync(root, {recursive: true, force: true}));
test('accepts the exact finite reviewed package', () => expect(r.verifyManifest(root, bytes(), r.sha(bytes())).files).toHaveLength(2));
test('rejects an unreviewed manifest even if all files fit it', () => expect(() => r.verifyManifest(root, bytes(), '0'.repeat(64))).toThrow(/Unreviewed/));
test.each(['same-size edit', 'missing file', 'unlisted file'])('rejects %s', scenario => {
  const file = path.join(root, doc.files[0].path);
  if (scenario === 'same-size edit') fs.writeFileSync(file, 'Reviewed');
  if (scenario === 'missing file') fs.unlinkSync(file);
  if (scenario === 'unlisted file') fs.writeFileSync(file + '.new', 'extra');
  expect(() => r.verifyManifest(root, bytes(), r.sha(bytes()))).toThrow();
});
test.each(['duplicate', 'outside', 'parent', 'unknown revision', 'wrong base'])('rejects %s in a manifest', scenario => {
  if (scenario === 'duplicate') doc.files.push(doc.files[0]);
  if (scenario === 'outside') doc.files[0].path = 'PartB/source.md';
  if (scenario === 'parent') doc.files[0].path = r.ROOTS[0] + '/../escape.md';
  if (scenario === 'unknown revision') doc.revision += '-unknown';
  if (scenario === 'wrong base') doc.baseline_lesson_commit = '0'.repeat(40);
  expect(() => r.verifyManifest(root, bytes(), r.sha(bytes()))).toThrow();
});
