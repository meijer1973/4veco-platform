'use strict';
// HOW TO ADAPT: a new delivery/base needs a separate bounded transition.
const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const m = require('../references/migrate-books34-v3');
const {validateStructuralRecords} = require('../references/books34-selected-structure');
const {consumeTarget} = require('../references/target-source-consumer');
const {verifyDelivery} = require('../references/books34-v3-delivery');
const {BOOKS, verifyLessonPackage, verifyLegacyDeliveries, verifyLegacyLessonState} = require('../references/books34-v3-transition');

function verifyHistoricalImport({root = m.ROOT, lessons = path.resolve(root, '../4veco-lessen'), requireTracked = false} = {}) {
  const failures = [], check = (value, message) => { if (!value) failures.push(message); };
  const read = file => fs.readFileSync(path.join(root, file));
  let state = null;
  try {
    const registry = JSON.parse(read(m.REGISTRY));
    failures.push(...validateStructuralRecords(registry, root));
    // Always validate the complete transport, including after lesson activation.
    const transport = verifyDelivery(root, m.TRANSPORT, {requireTracked});
    failures.push(...transport.failures);
    const planned = m.plan(path.join(root, m.TRANSPORT), root, lessons);
    for (const [file, bytes] of planned.outputs) {
      const exact = file.startsWith(m.SNAPSHOT + '/') || [3, 4].some(n => file === `${m.OUTLINES}/book-${n}-outline.md`);
      check(exact ? read(file).equals(bytes) : m.text(read(file)) === m.text(bytes), 'Migration output mismatch ' + file);
    }
    const lessonPackage = verifyLessonPackage(lessons, {requireTracked});
    state = lessonPackage.state;
    failures.push(...lessonPackage.failures);
    // Original v2 manifests, all delivered bytes and their closed file inventories
    // remain required in BOTH states; the old verifier itself is unchanged.
    failures.push(...verifyLegacyDeliveries(lessons, {requireTracked}));
    if (state === 'legacy-v2-projection') {
      failures.push(...verifyLegacyLessonState(lessons));
    } else {
      for (const [file, bytes] of planned.lessonOutputs) {
        const actual = fs.readFileSync(path.join(lessons, file));
        check(file.startsWith(m.SNAPSHOT + '/') ? actual.equals(bytes) : m.text(actual) === m.text(bytes), 'Lesson projection mismatch ' + file);
      }
    }
    const blueprint = m.text(read(m.V5));
    for (const record of registry.exercises.filter(r => r.module >= 3)) {
      check(blueprint.includes(`### §${record.id} - ${record.paragraph_title}`), 'Missing v5 anchor ' + record.id);
      try { consumeTarget(record, {platformRoot: root}); } catch (error) { failures.push(record.id + ': ' + error.message); }
    }
    const git = (repo, args) => execFileSync('git', args, {cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});
    const protectedBooks = git(lessons, ['ls-tree', '--name-only', m.LESSON_BASE]).trim().split('\n').filter(p => /^Boek [12] -/.test(p));
    for (const [repo, base, files] of [
      [root, m.PLATFORM_BASE, ['references/authored/book-outlines/book-2-outline.md', 'references/authored/book-outlines/book-2-outline.meta.json', 'build-scripts/maintenance/check-book2-chat-import.js', 'build-scripts/references/migrate-books34-selected-outlines.js']],
      [lessons, m.LESSON_BASE, [...protectedBooks, ...Object.values(BOOKS).flatMap(b => [b + '/edities/chat-2026', b + '/IMPORT_MANIFEST.json'])]],
    ]) check(!git(repo, ['diff', base, '--', ...files]).trim(), 'Protected Book 1/2 or v2 history changed');
    if (state === 'v3-projection') {
      const operational = new Set(['.gitattributes', 'AGENT_GITHUB_ENTRY.md', 'RESEARCH_AGENT_MAP.md', 'lessen-team-roadmap.md', 'course_blueprint_v5.md', 'archive/relocations.json', 'archive/index.json', 'archive/index.md', `${m.SNAPSHOT}/course_blueprint_v5.md`, ...Object.values(BOOKS).map(b => b + '/README.md')]);
      const changed = git(lessons, ['diff', '--name-only', '-z', m.LESSON_BASE]);
      const extra = git(lessons, ['ls-files', '--others', '--exclude-standard', '-z']);
      for (const file of (changed + extra).split('\0').filter(Boolean)) {
        check(operational.has(file) || (file.startsWith(m.PACKAGE + '/') && transport.allowed.has(file.slice(m.PACKAGE.length + 1))), 'Outside finite lesson import scope ' + file);
      }
    }
  } catch (error) { failures.push(error.message); }
  return {task: m.TASK, revision: m.REVISION, active_curriculum: m.REVISION,
    primary_source: {repository: 'meijer1973/4veco-platform', package_root: m.TRANSPORT, role: 'immutable_received_transport'},
    lesson_state: state, lesson_projection_current: state === 'v3-projection',
    passed: !failures.length, tracked_verified: requireTracked, failures};
}
function verify(options = {}) {
  const root = options.root || m.ROOT;
  const meta = JSON.parse(fs.readFileSync(path.join(root, m.OUTLINES, 'book-3-outline.meta.json')));
  if (!meta.pedagogical_amendment) return verifyHistoricalImport(options);
  const lessons = options.lessons || path.resolve(root, '../4veco-lessen');
  const failures = [];
  let revision = null;
  try {
    const registry = JSON.parse(fs.readFileSync(path.join(root, m.REGISTRY)));
    failures.push(...validateStructuralRecords(registry, root));
    failures.push(...verifyDelivery(root, m.TRANSPORT, options).failures);
    failures.push(...verifyLegacyDeliveries(lessons, options));
    const planned = m.plan(path.join(root, m.TRANSPORT), root, lessons);
    const {amendOutline, currentOutline, REVISION, CONTRACT} = require('../references/books34-route-amendment');
    for (const [file, bytes] of planned.outputs) {
      const book = file.startsWith(m.OUTLINES + '/') && file.match(/book-([34])-outline\.(md|meta\.json)$/);
      let expected = bytes;
      if (book && book[2] === 'md') {
        currentOutline(fs.readFileSync(path.join(root, file)), Number(book[1]), root);
        expected = amendOutline(bytes);
      } else if (book) {
        const value = JSON.parse(bytes);
        const outline = fs.readFileSync(path.join(root, m.OUTLINES, `book-${book[1]}-outline.md`));
        value.current_sha256 = m.sha(m.text(outline));
        value.pedagogical_amendment = {revision: REVISION, contract: CONTRACT, owner_request: '2026-09-21: guided practice normal; bonus challenging; preserve exercises and report timing conflicts'};
        value.technical_projection = 'Original v3 receipt and structural rows preserved. Target links resolve to the immutable transport; the separately validated route amendment governs current pedagogical guidance.';
        expected = m.json(value);
      }
      const actual = fs.readFileSync(path.join(root, file));
      const signed = [m.REGISTRY, m.V5].includes(file) && require('../workflows/book2-signed-authority').matchesFile(file, actual);
      if (!signed && (file.startsWith(m.SNAPSHOT + '/') ? !actual.equals(expected) : m.text(actual) !== m.text(expected))) failures.push('Unexpected migration/amendment output ' + file);
    }
    for (const record of registry.exercises.filter(r => r.module >= 3)) consumeTarget(record, {platformRoot: root});
    revision = fs.existsSync(path.join(lessons, 'books34-signed-revision.json'))
      ? require('../books/books34-signed-revision').verify({...options, root, lessons})
      : fs.existsSync(path.join(lessons, 'book2-signed-revision.json'))
      ? require('../books/book2-signed-revision').verify({...options, root, lessons})
      : require('../books/exercise-route-revision').verify({...options, root, lessons});
    failures.push(...revision.failures);
  } catch (error) { failures.push(error.message); }
  return {task: 'exercise-routes-20260921', active_curriculum: m.REVISION,
    lesson_state: revision?.state, files: revision?.files, passed: !failures.length, failures};
}
if (require.main === module) {
  const result = (process.argv.includes('--historical-import') ? verifyHistoricalImport : verify)({requireTracked: process.argv.includes('--require-tracked')});
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
module.exports = {verify, verifyHistoricalImport};
