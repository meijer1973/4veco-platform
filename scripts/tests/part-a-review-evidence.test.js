'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { snapshot, writeSnapshot, checkReview, verdict } = require('../lib/part-a-review-evidence');
const bind = require('./helpers/part-a-review-fixture');
let temp, folder;
const content = '9.9.1 Test – paragraaf.md';
beforeEach(() => {
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'review-evidence-'));
  folder = path.join(temp, '9.9.1 Test'); fs.mkdirSync(folder);
  fs.writeFileSync(path.join(folder, content), '# Kosten\n\n€ 12 × 2\n');
  fs.writeFileSync(path.join(folder, '9.9.1-review.md'), '## 2. Verdict\n\n**PASS**\n');
  bind(folder);
});
afterEach(() => fs.rmSync(temp, { recursive: true, force: true }));
test('explicit current review passes', () => expect(checkReview(folder).ok).toBe(true));
test.each(['change', 'addition', 'deletion'])('%s invalidates reviewed inventory', action => {
  if (action === 'change') fs.appendFileSync(path.join(folder, content), 'changed');
  if (action === 'addition') fs.writeFileSync(path.join(folder, '9.9.1 Test – opgaven.md'), 'new');
  if (action === 'deletion') fs.unlinkSync(path.join(folder, content));
  expect(checkReview(folder).ok).toBe(false);
});
test('regenerating a manifest cannot renew an old review', () => {
  fs.appendFileSync(path.join(folder, content), 'changed'); writeSnapshot(folder);
  expect(checkReview(folder).errors.join(' ')).toMatch(/does not bind/);
});
test('manifest generator never edits a reviewer verdict', () => {
  const file = path.join(folder, '9.9.1-review.md'), before = fs.readFileSync(file);
  writeSnapshot(folder); expect(fs.readFileSync(file)).toEqual(before);
});
test.each(['All checks PASS.', '## 2. Verdict\nPASS pending', '## 2. Verdict\nPASS\n## Verdict\nFAIL'])('missing or ambiguous final verdict fails: %s', text => {
  fs.writeFileSync(path.join(folder, '9.9.1-review.md'), text); bind(folder);
  expect(checkReview(folder).ok).toBe(false);
});
test('resolved FAIL history does not invalidate explicit PASS WITH FLAGS', () => {
  expect(verdict('## 2. Verdict\n**PASS WITH FLAGS**\n\n## History\nFAIL: repaired')).toBe('PASS WITH FLAGS');
});
test('text line endings are portable, binary changes remain strict', () => {
  const text = fs.readFileSync(path.join(folder, content), 'utf8');
  fs.writeFileSync(path.join(folder, content), text.replace(/\n/g, '\r\n'));
  expect(checkReview(folder).ok).toBe(true);
  fs.writeFileSync(path.join(folder, '9.9.1 Test – paragraaf.pdf'), Buffer.from([0, 13, 10])); bind(folder);
  fs.writeFileSync(path.join(folder, '9.9.1 Test – paragraaf.pdf'), Buffer.from([0, 10]));
  expect(checkReview(folder).ok).toBe(false);
});
test('companion edits do not invalidate Part A; local render dependencies do', () => {
  fs.writeFileSync(path.join(folder, '9.9.1 Test – instapquiz.html'), 'companion');
  expect(checkReview(folder).ok).toBe(true);
  fs.mkdirSync(path.join(folder, '_assets'));
  fs.writeFileSync(path.join(folder, '_assets', '9.9.1_fig_1_web_light.svg'), '<svg/>');
  expect(checkReview(folder).ok).toBe(true);
  fs.writeFileSync(path.join(folder, '_assets', 'extra.svg'), '<svg/>');
  fs.appendFileSync(path.join(folder, content), '\n![Example](_assets/extra.svg)'); bind(folder);
  fs.appendFileSync(path.join(folder, '_assets', 'extra.svg'), 'changed');
  expect(checkReview(folder).ok).toBe(false);
});
test('traversal in a render dependency is rejected', () => {
  fs.appendFileSync(path.join(folder, content), '\n![bad](../outside.svg)');
  expect(() => snapshot(folder)).toThrow(/Unsafe/);
});
test.each(['import', 'srcset', 'reference-image'])('changes to %s dependencies invalidate review', form => {
  fs.writeFileSync(path.join(folder, 'diagram.svg'), '<svg/>');
  if (form === 'import') {
    fs.writeFileSync(path.join(folder, '9.9.1 Test – paragraaf.html'), '<link rel="stylesheet" href="base.css">');
    fs.writeFileSync(path.join(folder, 'base.css'), '@import/*comment*/"theme.css";');
    fs.writeFileSync(path.join(folder, 'theme.css'), 'body {background:url(diagram.svg)}');
  } else if (form === 'srcset') {
    fs.writeFileSync(path.join(folder, '9.9.1 Test – paragraaf.html'), '<img srcset="diagram.svg 1x, diagram.svg 2x">');
  } else {
    fs.appendFileSync(path.join(folder, content), '\n![Diagram][figure]\n\n[figure]: diagram.svg');
  }
  bind(folder); fs.appendFileSync(path.join(folder, 'diagram.svg'), 'changed');
  expect(checkReview(folder).errors.join(' ')).toMatch(/stale/);
});
test.each(['<script src="diagram.js"></script>', '<img onload="loadDiagram()">', '<iframe src="diagram.html"></iframe>'])('unsupported dynamic rendering is rejected: %s', markup => {
  fs.writeFileSync(path.join(folder, '9.9.1 Test – paragraaf.html'), markup);
  expect(() => snapshot(folder)).toThrow(/static HTML/);
});
test('external rendering resources are not silently omitted', () => {
  fs.appendFileSync(path.join(folder, content), '\n![Diagram](https://example.invalid/diagram.svg)');
  expect(() => snapshot(folder)).toThrow(/must be local/);
});
test.each(['<base href="alternate/">', '<base href="https://example.invalid/">', '<svg xml:base="alternate/"></svg>'])('render URL base overrides are rejected: %s', markup => {
  fs.writeFileSync(path.join(folder, '9.9.1 Test – paragraaf.html'), `${markup}<img src="diagram.svg">`);
  expect(() => snapshot(folder)).toThrow(/base URL overrides/);
});
