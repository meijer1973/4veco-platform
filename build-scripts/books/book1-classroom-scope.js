'use strict';
// Presentation scope is separate from the sealed Part A edition and its review.
// This adapter never refreshes a predecessor receipt or grants content approval.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const {execFileSync} = require('child_process');
const edition = require('./book1-second-edition-revision');
const ROOT = path.resolve(__dirname, '../..');
const PLATFORM_BASE = '926ada14850d30a87b1b1812ecbf78f486c3c15a';
const LESSON_BASE = '173aa9a803897965c572df2c4e7f83cdb135eb1c';
const REVISION = 'book1-second-edition-classroom-20261003';
const BOOK = edition.BOOK, EDITION = edition.EDITION;
const OLD_CHAPTER = BOOK + '/1.1 Hoofdstuk Economisch denken en rekenen';
const OLD_TITLES = ['1.1.1 Schaarste en economisch denken', '1.1.2 Percentages en indexcijfers', '1.1.3 Grafieken en tabellen'];
const OLD_FOLDERS = OLD_TITLES.map(title => OLD_CHAPTER + '/' + title);
const RETIRED = new Set([
  ...OLD_TITLES.flatMap((title, i) => ['html', 'pptx'].map(ext => OLD_FOLDERS[i] + '/' + title + ' – presentatie.' + ext)),
  ...['slide3-img-14fd6f67e28c', 'slide4-img-69532d597fca', 'slide5-img-db6ea92cebd7', 'slide6-img-a0d089c4fdbb']
    .map(name => OLD_FOLDERS[0] + '/_assets/presentatie-' + name + '.png'),
  BOOK + '/shared/presentation-v2.css', BOOK + '/shared/presentation-v2.js',
]);
const LEGACY_ENTRIES = new Set([...OLD_FOLDERS.map(folder => folder + '/index.html'),
  OLD_FOLDERS[0] + '/' + OLD_TITLES[0] + ' – uitleg voorkennis.html']);
const P_EXACT = new Set([
  'docs/workflows/classroom-presentation.md', 'skills/econ-pptx-templates.md',
  'build-scripts/books/book1-classroom-scope.js', 'build-scripts/books/book1-classroom-scope.test.js',
  'build-scripts/maintenance/check-classroom-edition.js', 'build-scripts/maintenance/check-books34-v3-import.js',
  'build-scripts/ci/check-y1-product-evidence.js', 'build-scripts/ci/check-y1-product-evidence.test.js',
  'build-scripts/content/book-1/presentation-v2-registry.js', 'build-scripts/content/book-1/presentation-v2-registry.test.js',
  'build-scripts/sprints/capture-presentation-v2-pptx-derivative-proof.js',
  'build-scripts/platform/check-paragraph-landing-v2.js',
  '.github/workflows/paired-book1-second-edition-ci.yml', '.github/workflows/paired-books34-signed-ci.yml', '.github/workflows/paired-exercise-route-ci.yml',
  'engines/tests/presentation-v2-111-production.test.js', 'engines/tests/presentation-v2-113-graph-transfer.test.js',
  'engines/tests/presentatie-html-shape.test.js', 'engines/tests/l1-5d-v2-mobile-fixes.test.js', 'engines/tests/l1-6r-dual-coding.test.js',
  'build-scripts/content/book-1/historical-presentation-test-fixtures.js',
  'build-scripts/presentations/render-powerpoint.ps1',
]);
const ADVISORY = new Set(['platform', 'lessen'].flatMap(repo => ['md', 'json'].map(ext => `reports/github-agent-index-${repo}.${ext}`)));
const git = (root, args) => execFileSync('git', args, {cwd: root, maxBuffer: 256 * 1024 * 1024});
const names = bytes => bytes.toString('utf8').split('\0').filter(Boolean);
const lf = bytes => bytes.toString('utf8').replace(/\r\n/g, '\n');

function safeFile(root, file) {
  assert(!path.isAbsolute(file) && !file.includes('\\') && !file.split('/').some(p => !p || p === '.' || p === '..'), 'Unsafe classroom path');
  let target = root;
  for (const part of file.split('/')) {
    target = path.join(target, part);
    assert(!fs.lstatSync(target).isSymbolicLink(), 'Symlink in classroom path: ' + file);
  }
  assert(fs.statSync(target).isFile(), 'Classroom path is not a regular file: ' + file);
  return target;
}

function changedPaths(root, base) {
  // Include HEAD and index independently: a working edit cannot conceal an
  // unreviewed committed/staged source or mode change.
  return [...new Set([
    ...names(git(root, ['diff', '--name-only', '-z', base])),
    ...names(git(root, ['diff', '--name-only', '-z', base, 'HEAD'])),
    ...names(git(root, ['diff', '--cached', '--name-only', '-z', base])),
    ...names(git(root, ['ls-files', '--others', '--exclude-standard', '-z'])),
  ])].sort();
}

function platformPath(file) {
  return P_EXACT.has(file)
    || /^build-scripts\/content\/book-1\/(?:presentation-1[123][1234](?:\.(?:mjs|(?:tweede-editie-2026\.)?manifest\.json|source\.json)|-package\.py)|(?:check|test-check)-presentation-1[123][1234]\.py)$/.test(file)
    || /^reports\/review-gates\/classroom-presentations-book1(?:-second-edition)?-20261003\/(?!.*(?:^|\/)\.\.?\/)[^\\]+\.(?:md|json|txt|png)$/.test(file);
}

function isAddition(file, sealed) {
  if (sealed.has(file)) return false;
  const prefix = EDITION + '/paragrafen/';
  if (!file.startsWith(prefix)) return false;
  const match = file.slice(prefix.length).match(/^H([123])\/(?:((1\.[123]\.[1234]) [^/]+) – presentatie\.(pptx|pdf)|evidence\/(1\.[123]\.[1234])-presentation\.md)$/);
  if (!match) return false;
  const [, chapter, title, slideId, , evidenceId] = match, id = slideId || evidenceId;
  if (id.split('.')[1] !== chapter) return false;
  const folder = prefix + 'H' + chapter + '/';
  if (title) return ['paragraaf', 'opgaven'].some(kind => sealed.has(folder + title + ' – ' + kind + '.pdf'));
  return [...sealed].some(p => p.startsWith(folder + id + ' ') && / – (paragraaf|opgaven)\.pdf$/.test(p));
}

function retireLinks(file, bytes) {
  assert(LEGACY_ENTRIES.has(file), 'Not a bounded retirement entry');
  let text = lf(bytes);
  if (file.endsWith('/index.html')) {
    const pattern = /^ +<article\b[^>]*\bdata-tile-id="presentatie"[^>]*>[\s\S]*?<\/article>\n/gm;
    assert.equal([...text.matchAll(pattern)].length, 1, 'Expected one presentation tile');
    assert.equal(text.split('uitleg + presentatie + leerpad').length, 2, 'Expected one presentation route label');
    return text.replace(pattern, '').replace('uitleg + presentatie + leerpad', 'uitleg + leerpad');
  }
  const pattern = / of bekijk de <a href="[^"]*presentatie\.pptx">Presentatie<\/a>/g;
  assert.equal([...text.matchAll(pattern)].length, 1, 'Expected one presentation prerequisite link');
  return text.replace(pattern, '');
}

function disposableNavigation(root, base, file) {
  if (!ADVISORY.has(file) || process.env.FOURVECO_INDEX_VIEW_MODE !== 'complete-only'
    || !/^compatibility\/(platform-first|lesson-first|bundle-final)\/platform$/.test(process.env.FOURVECO_PLATFORM_SOURCE_BRANCH || '')) return false;
  try {
    safeFile(root, file);
    git(root, ['rev-parse', base + ':' + file]);
    return !git(root, ['diff', '--name-only', base, 'HEAD', '--', file]).length
      && !git(root, ['diff', '--cached', '--name-only', base, '--', file]).length;
  } catch { return false; }
}

function checkRetirementVersions(root, file, before, after = null) {
  // Validate index and HEAD independently as well as the worktree. Otherwise
  // an arbitrary staged/committed edit could be concealed by restoring the
  // allowed retired text only in the working copy.
  for (const ref of ['HEAD', '']) {
    const entry = git(root, ref ? ['ls-tree', '-z', ref, '--', file] : ['ls-files', '--stage', '-z', '--', file]);
    if (!entry.length) { assert(after === null, 'Retirement entry missing from history/index: ' + file); continue; }
    assert(/^100644 /.test(entry.toString('utf8')), 'Retirement mode changed: ' + file);
    const bytes = git(root, ['show', ref + ':' + file]);
    assert(after === null ? bytes.equals(before) : (lf(bytes) === lf(before) || lf(bytes) === after), 'Unreviewed committed/staged retirement bytes: ' + file);
  }
}

function verifyChanges({root, base, repo, sealed = new Set(), requireTracked = false}) {
  const changes = changedPaths(root, base), result = {additions: [], removals: [], entry_changes: [], platform_changes: []};
  for (const file of changes) {
    if (repo === 'platform' && disposableNavigation(root, base, file)) continue;
    const exists = fs.existsSync(path.join(root, file));
    if (repo === 'lessons' && RETIRED.has(file)) {
      assert(!exists, 'Retired presentation may only be deleted: ' + file);
      const before = git(root, ['show', base + ':' + file]);
      checkRetirementVersions(root, file, before);
      result.removals.push(file);
      if (requireTracked) assert.equal(git(root, ['ls-files', '--', file]).length, 0, 'Retirement is not staged: ' + file);
      continue;
    }
    assert(exists, 'Protected classroom predecessor deleted: ' + file);
    const bytes = fs.readFileSync(safeFile(root, file));
    if (repo === 'platform') {
      assert(platformPath(file), 'Outside Book 1 classroom platform scope: ' + file);
      result.platform_changes.push(file);
    } else if (LEGACY_ENTRIES.has(file)) {
      const before = git(root, ['show', base + ':' + file]), after = retireLinks(file, before);
      assert.equal(lf(bytes), after, 'Unexpected legacy entry edit: ' + file);
      checkRetirementVersions(root, file, before, after);
      result.entry_changes.push(file);
    } else {
      assert(isAddition(file, sealed), 'Outside Book 1 classroom lesson scope: ' + file);
      result.additions.push(file);
    }
    if (requireTracked) {
      const stage = git(root, ['ls-files', '--stage', '--', file]).toString('utf8');
      assert(/^100644 [a-f0-9]{40} 0\t/.test(stage), 'Not a staged regular classroom file: ' + file);
      assert(git(root, ['show', ':' + file]).equals(bytes), 'Stale staged classroom bytes: ' + file);
    }
  }
  return result;
}

function historicalPredecessor(root, lessons, requireTracked) {
  // Older named paired workflows still validate their original lesson payload.
  // Execute the accepted adapter at its immutable platform commit; do not
  // transplant today's permissive paths into historical acceptance.
  const os = require('os'), parent = fs.mkdtempSync(path.join(os.tmpdir(), 'book1-classroom-history-'));
  const checkout = path.join(parent, 'platform');
  const dependencies = path.join(checkout, 'node_modules');
  try {
    git(root, ['worktree', 'add', '--detach', checkout, PLATFORM_BASE]);
    // Its historical nested verifier explicitly resolves this dependency path.
    // Supply dependencies without copying or modifying historical source bytes.
    const modules = [path.join(root, 'node_modules'), ...(process.env.NODE_PATH || '').split(path.delimiter)]
      .find(folder => folder && fs.existsSync(folder));
    if (modules) fs.symlinkSync(path.resolve(modules), dependencies, process.platform === 'win32' ? 'junction' : 'dir');
    const script = "const path=require('path');const root=process.argv[1];const result=require(path.join(root,'build-scripts/books/book1-second-edition-revision')).verify({root,lessons:process.argv[2],requireTracked:process.argv[3]==='true'});process.stdout.write(JSON.stringify(result));";
    const result = JSON.parse(execFileSync(process.execPath, ['-e', script, checkout, lessons, String(requireTracked)],
      {encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env: {...process.env, NODE_PATH: path.join(root, 'node_modules')}}));
    assert(result.passed, result.failures?.join('; ') || 'Historical predecessor rejected');
    return {...result, classroom_predecessor_verification: {platform: PLATFORM_BASE, mode: 'original verifier at immutable accepted commit'}};
  } finally {
    if (fs.existsSync(dependencies) && fs.lstatSync(dependencies).isSymbolicLink()) fs.unlinkSync(dependencies);
    if (fs.existsSync(checkout)) git(root, ['worktree', 'remove', checkout]);
    fs.rmdirSync(parent);
  }
}

function verify({root = ROOT, lessons = path.resolve(root, '../4veco-lessen'), requireTracked = false} = {}) {
  try {
    git(root, ['merge-base', '--is-ancestor', PLATFORM_BASE, 'HEAD']);
    const platform = verifyChanges({root, base: PLATFORM_BASE, repo: 'platform', requireTracked});
    // The historical paired workflow checks the reviewed payload immediately
    // preceding the merge commit. Permit that exact tree, never a different
    // predecessor or an unreviewed branch that merely has familiar receipts.
    if (!git(lessons, ['rev-parse', 'HEAD^{tree}']).equals(git(lessons, ['rev-parse', LESSON_BASE + '^{tree}']))) {
      try { git(lessons, ['merge-base', '--is-ancestor', LESSON_BASE, 'HEAD']); }
      catch { return historicalPredecessor(root, lessons, requireTracked); }
    }
    // Authenticate the exact merged receipts, pins and reviews. The classroom
    // acceptance does not replace or relabel their Part A acceptance.
    const manifest = git(root, ['show', PLATFORM_BASE + ':' + edition.MANIFEST]);
    for (const file of [edition.MANIFEST, edition.PIN, edition.REVIEW, edition.HEAD])
      assert(fs.readFileSync(safeFile(root, file)).equals(git(root, ['show', PLATFORM_BASE + ':' + file])), 'Sealed edition evidence changed: ' + file);
    assert(fs.readFileSync(safeFile(lessons, edition.LESSON_MANIFEST)).equals(manifest), 'Sealed lesson edition receipt changed');
    const doc = JSON.parse(manifest), pin = JSON.parse(fs.readFileSync(safeFile(root, edition.PIN)));
    assert.equal(edition.sha(manifest), pin.manifest_sha256, 'Accepted edition receipt is not pinned');
    const sealed = new Set(names(git(lessons, ['ls-tree', '-r', '--name-only', '-z', LESSON_BASE])));
    const lesson = verifyChanges({root: lessons, base: LESSON_BASE, repo: 'lessons', sealed, requireTracked});
    // Preserve every sealed lesson binding even if an attempted re-pin or Git
    // clean filter would otherwise hide a manuscript/PDF mutation.
    for (const row of doc.lessons) {
      const bytes = fs.readFileSync(safeFile(lessons, row.path));
      assert(bytes.length === row.bytes && edition.sha(bytes) === row.sha256, 'Sealed edition bytes changed: ' + row.path);
    }
    return {passed: true, failures: [], revision: REVISION, lesson_state: REVISION,
      platform_base: PLATFORM_BASE, lesson_base: LESSON_BASE, files: doc.lessons.length,
      ...lesson, platform_changes: platform.platform_changes, classroom_additions: lesson.additions,
      classroom_scope: 'Book 1 second-edition presentations and finite first-edition retirement; textbook and historical evidence unchanged',
      content_review_attested: false};
  } catch (error) { return {passed: false, failures: [error.message], revision: REVISION, lesson_state: REVISION}; }
}

module.exports = {ROOT, PLATFORM_BASE, LESSON_BASE, REVISION, BOOK, EDITION, RETIRED, LEGACY_ENTRIES, P_EXACT,
  safeFile, changedPaths, platformPath, isAddition, retireLinks, verifyChanges, verify};
if (require.main === module) {
  const result = verify({requireTracked: process.argv.includes('--require-tracked')});
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
