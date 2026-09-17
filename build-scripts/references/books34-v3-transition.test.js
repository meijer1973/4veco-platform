'use strict';
const fs = require('fs'), os = require('os'), path = require('path'), {execFileSync} = require('child_process');
const m = require('./migrate-books34-v3');
const {lessonState, verifyLessonPackage} = require('./books34-v3-transition');
const {verifyDelivery, manifestAt, safeFile} = require('./books34-v3-delivery');
const {consumeTarget} = require('./target-source-consumer');
let temp, platform, lessons, finalLessons, payload, record, manifest, restore;
const git = (...args) => execFileSync('git', args, {cwd: platform, encoding: 'utf8'});
function change(file, bytes) {
  const before = fs.existsSync(file) ? fs.readFileSync(file) : null;
  restore.push(() => before === null ? fs.unlinkSync(file) : fs.writeFileSync(file, before));
  fs.writeFileSync(file, bytes);
}
beforeAll(() => {
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'books34-transition-'));
  platform = path.join(temp, 'platform'); lessons = path.join(temp, 'lessons');
  payload = path.join(platform, m.TRANSPORT);
  fs.mkdirSync(lessons, {recursive: true});
  fs.cpSync(path.join(m.ROOT, m.TRANSPORT), payload, {recursive: true});
  finalLessons = path.join(temp, 'final-lessons');
  fs.cpSync(payload, path.join(finalLessons, m.PACKAGE), {recursive: true});
  fs.writeFileSync(path.join(finalLessons, 'course_blueprint_v5.md'), fs.readFileSync(path.join(m.ROOT, m.V5)));
  manifest = manifestAt(payload).manifest;
  record = JSON.parse(fs.readFileSync(path.join(m.ROOT, m.REGISTRY))).exercises.find(r => r.id === '4.3.2');
  git('init', '-q');
  fs.writeFileSync(path.join(platform, '.gitattributes'), m.TRANSPORT + '/** -text\n');
  git('add', '--', '.gitattributes', m.TRANSPORT);
}, 30000);
beforeEach(() => { restore = []; });
afterEach(() => { for (const undo of restore.reverse()) undo(); });
afterAll(() => {
  if (temp && path.dirname(path.resolve(temp)) === path.resolve(os.tmpdir()) && path.basename(temp).startsWith('books34-transition-')) fs.rmSync(temp, {recursive: true});
});

test('exact v2 lesson projection is explicit; v3 retrieval still has its complete declared transport', () => {
  change(path.join(lessons, 'course_blueprint_v5.md'), m.before('course_blueprint_v5.md', path.resolve(m.ROOT, '../4veco-lessen'), m.LESSON_BASE));
  expect(lessonState(lessons)).toBe('legacy-v2-projection');
  expect(verifyDelivery(platform, m.TRANSPORT, {requireTracked: true}).failures).toEqual([]);
  const consumed = consumeTarget(record, {platformRoot: platform});
  expect(consumed.source_locator.repository).toBe('meijer1973/4veco-platform');
  expect(consumed.source_locator.package_root).toBe(m.TRANSPORT);
  expect(consumed.canonical_source_locator.repository).toBe('meijer1973/4veco-lessen');
  expect(consumed.context_html).toContain('data:image/svg+xml;base64,');
});

test('v3 lesson identity alone cannot excuse an absent package', () => {
  change(path.join(lessons, 'course_blueprint_v5.md'), fs.readFileSync(path.join(m.ROOT, m.V5)));
  expect(() => lessonState(lessons)).toThrow(/requires the complete v3 package/);
});

test('partial v3 data cannot be treated as legacy state', () => {
  change(path.join(lessons, 'course_blueprint_v5.md'), m.before('course_blueprint_v5.md', path.resolve(m.ROOT, '../4veco-lessen'), m.LESSON_BASE));
  const partial = path.join(lessons, m.PACKAGE); fs.mkdirSync(partial, {recursive: true});
  restore.push(() => fs.rmdirSync(partial));
  expect(() => lessonState(lessons)).toThrow(/Partial v3/);
});

test('unknown blueprint fails instead of selecting transport as a fallback', () => {
  change(path.join(lessons, 'course_blueprint_v5.md'), fs.readFileSync(path.join(m.ROOT, m.V5), 'utf8') + '\nAltered active identity\n');
  expect(() => lessonState(lessons)).toThrow(/Unknown or mixed/);
});

test('final state requires a complete independent lesson receipt', () => {
  expect(verifyLessonPackage(finalLessons)).toEqual({state: 'v3-projection', failures: []});
});

test.each(['missing manifest', 'altered file', 'extra file'])('v3 lesson %s fails despite valid platform transport', fault => {
  const root = path.join(finalLessons, m.PACKAGE);
  if (fault === 'missing manifest') {
    const file = path.join(root, 'MANIFEST.sha256.json'), bytes = fs.readFileSync(file);
    fs.unlinkSync(file); restore.push(() => fs.writeFileSync(file, bytes));
  } else change(path.join(root, fault === 'extra file' ? 'unknown-edition.md' : record.source_pin.student_file), Buffer.from('altered'));
  let failures;
  try { failures = verifyLessonPackage(finalLessons).failures; } catch (error) { failures = [error.message]; }
  expect(failures.length).toBeGreaterThan(0);
  // Explicit transport remains usable, but does not turn the invalid paired state green.
  expect(consumeTarget(record, {platformRoot: platform}).source_locator.package_root).toBe(m.TRANSPORT);
});

test.each(['missing manifest', 'changed manifest', 'missing source', 'changed source', 'changed figure', 'extra file'])('transport rejects %s', fault => {
  let file;
  if (fault.includes('manifest')) file = path.join(payload, 'MANIFEST.sha256.json');
  else if (fault === 'changed figure') file = safeFile(payload, record.target_exercise.figures[0].path);
  else if (fault === 'extra file') file = path.join(payload, 'unreviewed-edition.txt');
  else file = safeFile(payload, record.source_pin.student_file);
  if (fault.startsWith('missing')) {
    const bytes = fs.readFileSync(file); fs.unlinkSync(file); restore.push(() => fs.writeFileSync(file, bytes));
  } else change(file, Buffer.from('unreviewed data'));
  let failures;
  try { failures = verifyDelivery(platform, m.TRANSPORT).failures; } catch (error) { failures = [error.message]; }
  expect(failures.length).toBeGreaterThan(0);
  if (fault !== 'extra file') expect(() => consumeTarget(record, {platformRoot: platform})).toThrow();
});

test('tracked file mode remains part of receipt identity', () => {
  const file = m.TRANSPORT + '/' + manifest.files[0].path;
  git('update-index', '--chmod=+x', '--', file);
  restore.push(() => git('update-index', '--chmod=-x', '--', file));
  expect(verifyDelivery(platform, m.TRANSPORT, {requireTracked: true}).failures.some(f => f.includes('mode'))).toBe(true);
});

test('an unresolved Git index stage is not a tracked receipt', () => {
  const file = m.TRANSPORT + '/' + manifest.files[0].path;
  const blob = git('rev-parse', ':' + file).trim();
  execFileSync('git', ['update-index', '--index-info'], {cwd: platform,
    input: `0 ${'0'.repeat(40)}\t${file}\n100644 ${blob} 1\t${file}\n100644 ${blob} 2\t${file}\n`});
  restore.push(() => git('add', '--', file));
  expect(verifyDelivery(platform, m.TRANSPORT, {requireTracked: true}).failures.length).toBeGreaterThan(0);
});

test('a directory junction cannot inject a second received source', () => {
  const junction = path.join(payload, 'injected-sources');
  fs.symlinkSync(lessons, junction, process.platform === 'win32' ? 'junction' : 'dir');
  restore.push(() => fs.unlinkSync(junction));
  expect(verifyDelivery(platform, m.TRANSPORT).failures.some(f => f.includes('Symlink'))).toBe(true);
});

test('source paths cannot escape the declared transport', () => {
  expect(() => safeFile(payload, '../course_blueprint_v5.md')).toThrow(/Unsafe/);
  expect(() => safeFile(payload, 'C:/outside.svg')).toThrow(/Unsafe/);
});
