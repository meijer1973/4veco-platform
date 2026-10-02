'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const {execFileSync, spawnSync} = require('child_process');
const current = require('./check-classroom-edition');
const historical = require('./check-books34-v3-import');
const notation = require('../books/book2-notation-revision');
const classroom = require('../books/book2-presentation-revision');
const prior = require('../books/exercise-route-revision');
const {gitBlob} = require('../lib/historical-paths');
const folder = 'edities/books34-v3/books/book-3/chapters/3.1/paragraph-pdfs/';
const student = folder + '3.1.1-leerling-v3.pdf';
const slide = folder + '3.1.1 Belastingen – presentatie.pptx';
const companion = [slide, slide.replace('.pptx', '.pdf'), folder + 'evidence/3.1.1-presentation.md'];
let temp, root, lessons, doc, pin, contract, actual, changes;
const write = (repo, file, bytes) => {
  fs.mkdirSync(path.dirname(path.join(repo, file)), {recursive: true});
  fs.writeFileSync(path.join(repo, file), bytes);
};
const git = (...args) => execFileSync('git', args, {cwd: lessons, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe']}).trim();
const saveReceipt = () => {
  const bytes = JSON.stringify(doc);
  pin.manifest_sha256 = prior.sha(bytes);
  write(lessons, notation.MANIFEST, bytes);
  write(root, notation.PIN_FILE, JSON.stringify(pin));
};
const check = options => current.verifyNotation(lessons, {root, ...options});

beforeEach(() => {
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'classroom-notation-'));
  root = path.join(temp, '4veco-platform'); lessons = path.join(temp, '4veco-lessen');
  fs.mkdirSync(root); fs.mkdirSync(lessons);
  git('init', '-q'); git('config', 'core.autocrlf', 'false');
  git('config', 'core.longpaths', 'true');
  git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
  actual = [notation.ENTRY, student, classroom.paths[0]].sort();
  for (const file of actual) write(lessons, file, 'accepted predecessor');
  git('add', '.'); git('commit', '-qm', 'accepted fixture');
  const base = git('rev-parse', 'HEAD');
  jest.replaceProperty(notation, 'BASE', base);
  jest.spyOn(notation, 'history').mockReturnValue([{fixture: 'authenticated history is tested by the original verifier'}]);
  jest.spyOn(classroom, 'checkContract').mockImplementation(() => {});
  jest.spyOn(notation, 'inventory').mockImplementation(() => [...actual].sort());
  jest.spyOn(notation, 'changedPaths').mockImplementation(() => [...changes].sort());
  const allowed = [notation.ENTRY, notation.MANIFEST].sort();
  contract = {lessons_base: base, platform_base: notation.PLATFORM_BASE, revision_paths: allowed,
    source_bindings: [{path: notation.ENTRY, baseline_sha256: prior.sha('accepted predecessor'), proposed_sha256: prior.sha('approved notation entry')}]};
  write(lessons, notation.ENTRY, 'approved notation entry');
  for (const file of notation.INPUTS) write(root, file, file === notation.CONTRACT_FILE ? JSON.stringify(contract) : 'sealed tool');
  doc = {revision: notation.REVISION, baseline_lesson_commit: base, predecessors: notation.history(),
    files: actual.map(file => {
      const bytes = fs.readFileSync(path.join(lessons, file));
      return {path: file, bytes: bytes.length, sha256: prior.sha(bytes), baseline_git_blob: git('rev-parse', base + ':' + file)};
    }), platform_inputs: notation.INPUTS.map(file => ({path: file, sha256_lf: prior.sha(prior.text(fs.readFileSync(path.join(root, file))))}))};
  pin = {revision: notation.REVISION, revision_paths: allowed}; saveReceipt();
  for (const file of companion) write(lessons, file, 'new companion');
  actual.push(...companion); changes = [...allowed, ...companion];
  git('add', '.');
});
afterEach(() => { jest.restoreAllMocks(); fs.rmSync(temp, {recursive: true, force: true}); });

test('notation receipt and new companions pass without changing any sealed receipt bytes', () => {
  const before = fs.readFileSync(path.join(lessons, notation.MANIFEST));
  expect(check({requireTracked: true})).toEqual({files: 3, classroom_additions: [...companion].sort()});
  expect(fs.readFileSync(path.join(lessons, notation.MANIFEST)).equals(before)).toBe(true);
  expect(classroom.checkContract).toHaveBeenCalledWith(root, lessons);
});
test('navigation-only differences use the current receipt and still require exact staged bytes', () => {
  actual = actual.filter(file => !companion.includes(file)); changes = [...contract.revision_paths, 'RESEARCH_AGENT_MAP.md'];
  for (const file of companion) fs.unlinkSync(path.join(lessons, file));
  write(lessons, 'RESEARCH_AGENT_MAP.md', 'navigation'); git('add', '-A');
  expect(check({requireTracked: true}).classroom_additions).toEqual([]);
  write(lessons, 'RESEARCH_AGENT_MAP.md', 'unstaged navigation');
  expect(() => check({requireTracked: true})).toThrow(/Staged successor\/classroom bytes differ/);
});
test.each([student, classroom.paths[0], notation.ENTRY])('altered sealed bytes fail: %s', file => {
  write(lessons, file, 'unapproved'); expect(() => check()).toThrow(/Stale current bytes/);
});
test('repinning a protected Book 3 source still fails against its Git ancestry', () => {
  const bytes = Buffer.from('unapproved'); write(lessons, student, bytes);
  Object.assign(doc.files.find(row => row.path === student), {bytes: bytes.length, sha256: prior.sha(bytes)}); saveReceipt();
  expect(() => check()).toThrow(/Protected predecessor changed/);
});
test('repinning an allowed Book 2 entry still fails its independently bound proposed hash', () => {
  const bytes = Buffer.from('unapproved'); write(lessons, notation.ENTRY, bytes);
  Object.assign(doc.files.find(row => row.path === notation.ENTRY), {bytes: bytes.length, sha256: prior.sha(bytes)}); saveReceipt();
  expect(() => check()).toThrow(/Unreviewed editable source/);
});
test('a false baseline hash cannot conceal a protected edit', () => {
  doc.files.find(row => row.path === student).baseline_git_blob = gitBlob('forged'); saveReceipt();
  expect(() => check()).toThrow(/False baseline blob/);
});
test('removed sealed files fail even if removed from a repinned receipt', () => {
  const file = classroom.paths[0];
  fs.unlinkSync(path.join(lessons, file)); actual = actual.filter(item => item !== file);
  doc.files = doc.files.filter(row => row.path !== file); saveReceipt();
  expect(() => check()).toThrow(/Historical file removed/);
});
test.each([slide.replace('book-3', 'book-4'), folder + 'extra.md',
  slide.replace('3.1.1 Belastingen', '3.1.2 Belastingen'), slide.replace('/3.1/', '/3.2/')])('unknown additions fail: %s', file => {
  actual.push(file); write(lessons, file, 'unapproved'); changes.push(file);
  expect(() => check()).toThrow(/Unknown classroom addition/);
});
test('unrelated changes outside the book inventory still fail', () => {
  changes.push('specifications/unapproved.md'); expect(() => check()).toThrow(/Outside finite notation revision/);
});
test('all current platform input bytes remain authenticated', () => {
  write(root, notation.INPUTS.find(file => file !== notation.CONTRACT_FILE), 'changed tool');
  expect(() => check()).toThrow(/Stale notation tool/);
});
test('an altered receipt fails its existing pin', () => {
  write(lessons, notation.MANIFEST, JSON.stringify({...doc, revision: 'forged'}));
  expect(() => check()).toThrow(/Unreviewed notation manifest/);
});
test('historical evidence mismatch and invalid presentation contract propagate', () => {
  notation.history.mockReturnValue([]); expect(() => check()).toThrow(/False historical evidence/);
  classroom.checkContract.mockImplementation(() => { throw Error('Invalid presentation contract'); });
  expect(() => check()).toThrow(/Invalid presentation contract/);
});
test('pin paths and source ancestry bindings remain mandatory', () => {
  pin.revision_paths = []; write(root, notation.PIN_FILE, JSON.stringify(pin));
  expect(() => check()).toThrow(/Unreviewed changed paths/);
  pin.revision_paths = contract.revision_paths; saveReceipt();
  contract.source_bindings[0].baseline_sha256 = '0'.repeat(64);
  write(root, notation.CONTRACT_FILE, JSON.stringify(contract));
  expect(() => check()).toThrow(/False source ancestry/);
});
test('every new companion must be staged with its saved bytes', () => {
  write(lessons, slide, 'unstaged change');
  expect(() => check({requireTracked: true})).toThrow(/Staged successor\/classroom bytes differ/);
  git('add', '.'); git('rm', '--cached', '--', slide);
  expect(() => check({requireTracked: true})).toThrow(/not fully tracked/);
});
test.each(['Unexpected current file inventory', 'Outside finite notation revision'])('only the named notation inventory failure selects the current adapter: %s', failure => {
  jest.spyOn(historical, 'verify').mockReturnValue({passed: false, lesson_state: notation.REVISION, failures: [failure]});
  expect(current.verify({root, lessons, requireTracked: true}).passed).toBe(true);
});
test.each([
  {lesson_state: 'other', failures: ['Unexpected current file inventory']},
  {lesson_state: notation.REVISION, failures: ['Unexpected current file inventory', 'Transport changed']},
  {lesson_state: notation.REVISION, failures: ['Stale notation tool x']},
])('unrelated or multiple failures are never suppressed: %j', result => {
  result.passed = false; jest.spyOn(historical, 'verify').mockReturnValue(result);
  expect(current.verify({root, lessons})).toBe(result);
});
test('standalone CLI publishes partitionInventory before a receipt requires it recursively', () => {
  const adapter = require.resolve('./check-classroom-edition');
  const original = require.resolve('./check-books34-v3-import');
  const script = `const Module=require('module');const adapter=${JSON.stringify(adapter)};
    // Isolate the historical adapter under test from an installed successor.
    const fs=require('fs'),exists=fs.existsSync;fs.existsSync=file=>String(file).endsWith('book1-second-edition-pin.json')?false:exists(file);
    require.cache[${JSON.stringify(original)}]={exports:{verify(){
      const api=require(adapter); if(typeof api.partitionInventory!=='function') throw Error('Incomplete recursive export');
      return {passed:true,failures:[]};}}};
    const main=new Module(adapter);main.filename=adapter;main.paths=Module._nodeModulePaths(require('path').dirname(adapter));
    require.cache[adapter]=main;process.mainModule=main;main.load(adapter);`;
  const result = spawnSync(process.execPath, ['-e', script], {encoding: 'utf8'});
  expect(result.status).toBe(0); expect(JSON.parse(result.stdout).passed).toBe(true);
  expect(result.stderr).not.toMatch(/circular|Incomplete recursive export/);
});
