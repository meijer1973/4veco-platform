'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');
const { foundation, quality } = require('./paragraph-records');
const { classifyPath, checkLaneScope } = require('./check-paragraph-lane-scope');
const bind = require('../../scripts/tests/helpers/part-a-review-fixture');
let temp, folder;
beforeEach(() => {
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'paragraph-records-'));
  folder = path.join(temp, '2.1.1 Test'); fs.mkdirSync(folder);
  fs.writeFileSync(path.join(folder, '2.1.1 Test – paragraaf.md'), '# Test\n');
  fs.writeFileSync(path.join(folder, '2.1.1-review.md'), '## 2. Verdict\nPASS WITH FLAGS\n');
  bind(folder);
});
afterEach(() => fs.rmSync(temp, { recursive: true, force: true }));
test.each(['textbook-plan.md', 'textbook-foundation.json', 'textbook-review-manifest.json'])('required %s is textbook-owned', suffix => {
  const file = `Boek 2/2.1.1 Test/2.1.1-${suffix}`;
  expect(classifyPath(file).category).toBe('partA_textbook');
  expect(checkLaneScope({ lane: 'textbook', changedPaths: [file] }).ok).toBe(true);
  expect(checkLaneScope({ lane: 'companion', changedPaths: [file] }).ok).toBe(false);
});
test('similar unknown names are not exempted', () => {
  expect(classifyPath('Boek 2/2.1.1-textbook-plan-private.json').category).toBe('unknown');
});
test('quality derives current evidence and preserves companion bytes and authored fields', () => {
  const file = path.join(folder, '2.1.1-quality-ref.yaml');
  const companion = 'companion:\n  # keep comment\n  review_verdict: "FAIL"\n  hard_fails_open: 2\n';
  fs.writeFileSync(file, `schema_version: 2\npartA:\n  teaching_note: Authored judgement\n${companion}`);
  quality(folder);
  const text = fs.readFileSync(file, 'utf8'), record = yaml.safeLoad(text);
  expect(text).toContain(companion);
  expect(record.partA.review_verdict).toBe('PASS WITH FLAGS');
  expect(record.partA.teaching_note).toBe('Authored judgement');
  expect(record.partA.review_manifest_sha256).toMatch(/^[a-f0-9]{64}$/);
  const before = text; quality(folder); expect(fs.readFileSync(file, 'utf8')).toBe(before);
});
test('quality cannot invent PASS from stale evidence or silently migrate legacy ownership', () => {
  fs.appendFileSync(path.join(folder, '2.1.1 Test – paragraaf.md'), 'changed');
  expect(() => quality(folder)).toThrow(/stale/);
  bind(folder);
  fs.writeFileSync(path.join(folder, '2.1.1-quality-ref.yaml'), 'assets: {}\n');
  expect(() => quality(folder)).toThrow(/Migrate/);
});
test.each([
  'schema_version: 2\n"partA": {review_verdict: PASS}\ncompanion: {review_verdict: FAIL}\n',
  'schema_version: 2\npartA: &shared\n  review_verdict: PASS\ncompanion: *shared\n',
])('unsupported YAML ownership forms are rejected without changing a byte', previous => {
  const file = path.join(folder, '2.1.1-quality-ref.yaml');
  fs.writeFileSync(file, previous);
  expect(() => quality(folder)).toThrow();
  expect(fs.readFileSync(file, 'utf8')).toBe(previous);
});
test('foundation reports existing checker failures and missing local chapter evidence', () => {
  const record = foundation(folder, 'paragraph_production');
  expect(record.require_approved).toBe(true);
  expect(record.decision).toBe('BLOCKED');
  expect(record.failures).toContain('Local _chapter-plan.md is missing');
  expect(record.target.id).toBe('2.1.1');
  expect(record.sources.every(source => source.actual_sha256 === source.sha256)).toBe(true);
  expect(record.holds.every(hold => typeof hold.blocks_requested_action === 'boolean')).toBe(true);
  expect(record.lifecycle.interpretation).toMatch(/Historical/);
});
test('unknown foundation scopes and actions are rejected', () => {
  expect(() => foundation(folder, 'approve_everything')).toThrow(/registered/);
  expect(() => foundation(path.join(temp, '8.1.1 Test'), 'paragraph_production')).toThrow(/Book 2/);
});
