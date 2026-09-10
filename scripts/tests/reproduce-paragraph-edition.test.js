'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { reproduce } = require('../reproduce-paragraph-edition');
const { committedFiles, materialize } = require('../lib/committed-paragraph-files');
const { checkReview } = require('../lib/part-a-review-evidence');
let workspace, root, folder, sha;
const paragraph = 'Book 1/1.1.1 Legacy';
const kinds = ['paragraaf', 'opgaven', 'antwoorden'];
const name = kind => `1.1.1 Legacy – ${kind}.pdf`;
const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim();
const exportEdition = (extra = {}) => reproduce({ lessons: root, sha, paragraph, output: path.join(workspace, 'edition'), ...extra });
beforeEach(() => {
  workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'legacy-edition-'));
  root = path.join(workspace, 'lessons');
  folder = path.join(root, paragraph);
  fs.mkdirSync(folder, { recursive: true });
  git('init', '-q'); git('config', 'user.name', 'Test'); git('config', 'user.email', 'test@example.invalid');
  git('config', 'core.autocrlf', 'false');
  fs.writeFileSync(path.join(folder, '1.1.1-review.md'), '## 2. Verdict\nPASS\n');
  fs.writeFileSync(path.join(folder, '1.1.1 Legacy – paragraaf.md'), '# Historical edition\n');
  for (const kind of kinds) fs.writeFileSync(path.join(folder, name(kind)), Buffer.from(`%PDF-1.4\r\n${kind}\x00\xff\r\n`,'latin1'));
  git('add', '.'); git('commit', '-qm', 'legacy edition without manifest');
  sha = git('rev-parse', 'HEAD');
});
afterEach(() => fs.rmSync(workspace, { recursive: true, force: true }));

test('legacy PDFs reproduce byte-for-byte without renewing review, including after current content changes', () => {
  const review = fs.readFileSync(path.join(folder, '1.1.1-review.md'));
  const bytes = kinds.map(kind => fs.readFileSync(path.join(folder, name(kind))));
  const report = exportEdition();
  expect(report.current_review).toBe('NOT_PERFORMED');
  expect(report.result).toBe('EXPORTED_COMMITTED_PDFS');
  expect(report.artifacts).toHaveLength(3);
  expect(checkReview(folder).ok).toBe(false);
  for (let i = 0; i < kinds.length; i++) expect(fs.readFileSync(path.join(workspace, 'edition', name(kinds[i])))).toEqual(bytes[i]);
  expect(fs.readdirSync(path.join(workspace, 'edition')).sort()).toEqual(kinds.map(name).sort());
  fs.appendFileSync(path.join(folder, '1.1.1 Legacy – paragraaf.md'), 'New unreviewed economics\n');
  fs.writeFileSync(path.join(folder, name('paragraaf')), '%PDF-new unreviewed bytes');
  git('add', '.'); git('commit', '-qm', 'changed content retaining historical PASS');
  expect(checkReview(folder).ok).toBe(false);
  exportEdition({ output: path.join(workspace, 'historic-after-change') });
  expect(fs.readFileSync(path.join(workspace, 'historic-after-change', name('paragraaf')))).toEqual(bytes[0]);
  expect(fs.readFileSync(path.join(folder, '1.1.1-review.md'))).toEqual(review);
  expect(fs.existsSync(path.join(folder, '1.1.1-textbook-review-manifest.json'))).toBe(false);
  expect(git('status', '--porcelain')).toBe('');
});

test('ignored local-only PDF cannot fill a missing committed artifact', () => {
  const pdf = path.join(folder, name('antwoorden'));
  const bytes = fs.readFileSync(pdf);
  git('rm', `${paragraph}/${name('antwoorden')}`); git('commit', '-qm', 'missing historical PDF');
  fs.appendFileSync(path.join(root, '.git/info/exclude'), '\n*.pdf\n');
  fs.writeFileSync(pdf, bytes);
  expect(git('status', '--porcelain')).toBe('');
  expect(() => exportEdition({ sha: git('rev-parse', 'HEAD') })).toThrow(/exactly one committed antwoorden.pdf/);
  expect(fs.existsSync(path.join(workspace, 'edition'))).toBe(false);
});

test('output cannot overwrite existing files or modify source repositories', () => {
  expect(() => exportEdition({ output: path.join(root, 'export') })).toThrow(/outside/);
  expect(() => exportEdition({ output: path.resolve(__dirname, '../../legacy-test-output') })).toThrow(/outside/);
  exportEdition();
  expect(() => exportEdition()).toThrow(/EEXIST/);
});

test('committed non-PDF placeholders fail before creating output', () => {
  fs.writeFileSync(path.join(folder, name('opgaven')), 'version https://git-lfs.github.com/spec/v1\n');
  git('add', '.'); git('commit', '-qm', 'unresolved pointer');
  expect(() => exportEdition({ sha: git('rev-parse', 'HEAD') })).toThrow(/not a PDF/);
  expect(fs.existsSync(path.join(workspace, 'edition'))).toBe(false);
});

test('snapshot ignores live bytes and excludes ignored cache files', () => {
  const expected = fs.readFileSync(path.join(folder, name('paragraaf')));
  fs.writeFileSync(path.join(folder, name('paragraaf')), 'local override');
  fs.appendFileSync(path.join(root, '.git/info/exclude'), '\ncache/\n');
  fs.mkdirSync(path.join(folder, 'cache')); fs.writeFileSync(path.join(folder, 'cache/tmp'), 'irrelevant');
  const destination = path.join(workspace, 'snapshot');
  materialize(root, committedFiles(root, sha, paragraph), destination);
  expect(fs.readFileSync(path.join(destination, name('paragraaf')))).toEqual(expected);
  expect(fs.existsSync(path.join(destination, 'cache'))).toBe(false);
});

test('symlinks and submodules cannot escape a committed paragraph snapshot', () => {
  const oid = git('rev-parse', `${sha}:${paragraph}/1.1.1-review.md`);
  git('update-index', '--add', '--cacheinfo', `120000,${oid},${paragraph}/escape`);
  git('commit', '-qm', 'symlink');
  expect(() => committedFiles(root, git('rev-parse', 'HEAD'), paragraph)).toThrow(/symlink\/submodule/);
  git('update-index', '--force-remove', `${paragraph}/escape`);
  git('update-index', '--add', '--cacheinfo', `160000,${sha},${paragraph}/external`);
  git('commit', '-qm', 'gitlink');
  expect(() => committedFiles(root, git('rev-parse', 'HEAD'), paragraph)).toThrow(/symlink\/submodule/);
});
