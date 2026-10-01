'use strict';
const fs = require('fs'), os = require('os'), path = require('path');
const {execFileSync} = require('child_process');
const current = require('./check-classroom-edition');
const historical = require('./check-books34-v3-import');
const prior = require('../books/exercise-route-revision');
const {gitBlob} = require('../lib/historical-paths');
const title = '2.1.2 Opbrengsten, winst en break-even';
const folder = prior.ROOTS[0] + `/bronnen/H1/paragrafen/${title}/`;
const textbook = folder + title + ' – paragraaf.pdf';
const slides = folder + title + ' – presentatie.pptx';
const pdf = folder + title + ' – presentatie.pdf';
const evidence = folder + 'evidence/2.1.2-presentation.md';
let temp, files, baseline;
beforeEach(() => {
  temp = fs.mkdtempSync(path.join(os.tmpdir(), 'classroom-edition-'));
  fs.mkdirSync(path.dirname(path.join(temp, textbook)), {recursive: true});
  const bytes = Buffer.from('signed textbook');
  fs.writeFileSync(path.join(temp, textbook), bytes);
  const blob = gitBlob(bytes);
  files = [{path: textbook, bytes: bytes.length, sha256: prior.sha(bytes), baseline_git_blob: blob}];
  baseline = new Map([[textbook, blob]]);
});
afterEach(() => { jest.restoreAllMocks(); fs.rmSync(temp, {recursive: true, force: true}); });
const check = actual => current.verifyCurrentInventory(temp, files, actual.sort(), baseline);

test('unchanged signed edition and additive slides preserve every sealed file', () => {
  expect(check([textbook])).toEqual([]);
  expect(check([textbook, slides, pdf, evidence])).toEqual([slides, pdf, evidence].sort());
});
test('adding slides cannot hide a changed textbook file', () => {
  fs.writeFileSync(path.join(temp, textbook), 'forged textbook');
  expect(() => check([textbook, slides])).toThrow(/Stale successor file/);
});
test('repinning a changed protected file cannot bless it', () => {
  const bytes = Buffer.from('forged textbook');
  fs.writeFileSync(path.join(temp, textbook), bytes);
  files[0].bytes = bytes.length; files[0].sha256 = prior.sha(bytes);
  expect(() => check([textbook, slides])).toThrow(/Protected predecessor changed/);
});
test('slide additions cannot hide a removed signed file', () => {
  expect(() => check([slides])).toThrow(/Signed edition file missing/);
  fs.unlinkSync(path.join(temp, textbook));
  expect(() => check([textbook, slides])).toThrow();
});
test.each([
  folder + 'unexpected.pdf', folder + 'evidence/approval.json',
  folder + 'evidence/2.1.3-presentation.md', folder + '2.1.3 Other – presentatie.pptx',
  slides.replace('/H1/', '/H2/'), slides.replaceAll(title, '2.1.3 New paragraph'),
  prior.ROOTS[1] + '/2.1.2 – presentatie.pptx',
])('unknown additions are rejected: %s', file => {
  expect(() => check([textbook, file])).toThrow(/Unknown classroom addition/);
});
test('an already sealed presentation never becomes an exempt addition', () => {
  expect(current.isClassroomAddition(slides, new Set([textbook, slides]))).toBe(false);
});
test.each(['3.2.1', '4.1.2'])('v3 slides require both the existing manuscript and paragraph PDF: %s', id => {
  const chapter = id.split('.').slice(0, 2).join('.');
  const root = `edities/books34-v3/books/book-${id[0]}/chapters/${chapter}/`;
  const manuscript = root + `${id} manuscript.md`;
  const paragraph = root + `paragraph-pdfs/${id}-leerling-v3.pdf`;
  const sealed = new Set([manuscript, paragraph]);
  const additions = [root + `paragraph-pdfs/${id} Title – presentatie.pptx`,
    root + `paragraph-pdfs/${id} Title – presentatie.pdf`,
    root + `paragraph-pdfs/evidence/${id}-presentation.md`];
  for (const file of additions) {
    expect(current.isClassroomAddition(file, sealed)).toBe(true);
    expect(current.isClassroomAddition(file, new Set([manuscript]))).toBe(false);
    expect(current.isClassroomAddition(file, new Set([paragraph]))).toBe(false);
    expect(current.isClassroomAddition(file, new Set([...sealed, file]))).toBe(false);
  }
  for (const leaf of [`${id}-leerling-v3.pdf`, `${id} Title – paragraaf.pdf`,
    `evidence/${id}-approval.json`, `${chapter}.99 Title – presentatie.pptx`,
    `nested/${id} Title – presentatie.pptx`, `../${id} Title – presentatie.pptx`]) {
    expect(current.isClassroomAddition(root + 'paragraph-pdfs/' + leaf, sealed)).toBe(false);
  }
  expect(() => current.partitionInventory([...sealed, ...additions].sort(), [...sealed].sort())).not.toThrow();
  expect(() => current.partitionInventory([manuscript, ...additions].sort(), [...sealed].sort())).toThrow(/Signed edition file missing/);
});
test('presentation additions must be staged with their exact saved bytes', () => {
  const git = (...args) => execFileSync('git', args, {cwd: temp, stdio: 'pipe'});
  git('init', '-q'); git('config', 'core.autocrlf', 'false');
  fs.writeFileSync(path.join(temp, slides), 'saved slides');
  git('add', '.');
  const verify = () => current.verifyTracked(temp, [textbook, slides], [prior.ROOTS[0]]);
  expect(verify).not.toThrow();
  fs.writeFileSync(path.join(temp, slides), 'unstaged altered slides');
  expect(verify).toThrow(/Staged successor\/classroom bytes differ/);
  git('add', '.');
  fs.writeFileSync(path.join(temp, pdf), 'untracked PDF');
  expect(() => current.verifyTracked(temp, [textbook, slides, pdf], [prior.ROOTS[0]])).toThrow(/not fully tracked/);
});
test('Windows checkout preserves the exact historical pin and PV bytes', () => {
  const platform = path.resolve(__dirname, '../..');
  const git = (...args) => execFileSync('git', args, {cwd: temp, stdio: 'pipe'});
  git('init', '-q'); git('config', 'core.autocrlf', 'true');
  fs.copyFileSync(path.join(platform, '.gitattributes'), path.join(temp, '.gitattributes'));
  const paths = ['build-scripts/books/exercise-route-revision-pin.json',
    'build-scripts/books/book2-signed-revision-pin.json', 'references/data/procedure-visual/procedure-templates.json'];
  const bytes = new Map(paths.map(file => [file, execFileSync('git', ['show', 'HEAD:' + file], {cwd: platform})]));
  for (const [file, data] of bytes) {
    fs.mkdirSync(path.dirname(path.join(temp, file)), {recursive: true});
    fs.writeFileSync(path.join(temp, file), data);
  }
  git('add', '.');
  for (const file of paths) fs.unlinkSync(path.join(temp, file));
  git('checkout-index', '--all');
  for (const [file, data] of bytes) expect(fs.readFileSync(path.join(temp, file)).equals(data)).toBe(true);
});
test.each(['Historical platform pin changed x', 'Stale successor file x', 'Unreviewed Books 3/4 successor manifest'])('unrelated historical failure is never suppressed: %s', message => {
  const result = {passed: false, failures: [message]};
  jest.spyOn(historical, 'verify').mockReturnValue(result);
  expect(current.verify()).toBe(result);
});
test('an inventory error accompanied by another error is never suppressed', () => {
  const result = {passed: false, failures: ['Unexpected successor inventory', 'Missing source']};
  jest.spyOn(historical, 'verify').mockReturnValue(result);
  expect(current.verify()).toBe(result);
});

test('follow-up receipt authenticates the exact classroom scope insertion only', () => {
  const file = 'build-scripts/workflows/check-paragraph-lane-scope.js';
  const before = "header\n  'presentatie.pptx',\n  'presentatie.html',\nfooter\n";
  const after = before.replace("  'presentatie.html',", "  'presentatie.pdf',\n  'presentatie.html',");
  const hash = prior.sha(before);
  expect(() => current.verifyFollowupInput(file, Buffer.from(before), hash)).not.toThrow();
  expect(() => current.verifyFollowupInput(file, Buffer.from(after), hash)).not.toThrow();
  expect(() => current.verifyFollowupInput(file, Buffer.from(after.replaceAll('\n', '\r\n')), hash)).not.toThrow();
  for (const altered of [after + 'other edit', after.replace('header', 'changed'),
    after.replace("  'presentatie.pdf',", "  'presentatie.pdf',\n  'presentatie.pdf',"),
    before + "  'presentatie.pdf',\n", after.replace('presentatie.pdf', 'anything.pdf')]) {
    expect(() => current.verifyFollowupInput(file, Buffer.from(altered), hash)).toThrow(/Stale follow-up tool/);
  }
  expect(() => current.verifyFollowupInput('another-tool.js', Buffer.from(after), hash)).toThrow(/Stale follow-up tool/);
});

test.each(['Stale follow-up bytes x', 'Protected predecessor changed x', 'Stale follow-up tool another-tool.js',
  'Unreviewed follow-up manifest', 'False historical evidence'])('unrelated follow-up failure is never suppressed: %s', message => {
  const result = {passed: false, failures: [message]};
  jest.spyOn(historical, 'verify').mockReturnValue(result);
  expect(current.verify()).toBe(result);
});
