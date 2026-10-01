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
test('v3 classroom artifacts require a signed paragraph PDF and manuscript in the matching book/chapter', () => {
  const chapter = 'edities/books34-v3/books/book-3/chapters/3.3/';
  const dir = chapter + 'paragraph-pdfs/';
  const sealed = [chapter + '3.3.2 manuscript.md', dir + '3.3.2-leerling-v3.pdf'].sort();
  const extras = [dir + '3.3.2 Wereldmarktprijs, import, export en welvaart – presentatie.pptx',
    dir + '3.3.2 Wereldmarktprijs, import, export en welvaart – presentatie.pdf',
    dir + 'evidence/3.3.2-presentation.md'];
  expect(current.partitionInventory([...sealed, ...extras].sort(), sealed)).toEqual([...extras].sort());
  for (const file of extras) {
    expect(current.isClassroomAddition(file, new Set(sealed.slice(0, 1)))).toBe(false);
    expect(current.isClassroomAddition(file, new Set(sealed.slice(1)))).toBe(false);
    expect(current.isClassroomAddition(file, new Set([...sealed, file]))).toBe(false);
  }
  for (const file of [extras[0].replace('book-3', 'book-4'), extras[0].replace('/3.3/', '/3.2/'),
    extras[0].replace('3.3.2 Wereld', '3.3.9 Wereld'), extras[0].replace('.pptx', '.js'),
    dir + 'arbitrary.pdf', dir + 'evidence/3.3.2-approval.json', dir + 'evidence/3.3.3-presentation.md']) {
    expect(() => current.partitionInventory([...sealed, file].sort(), sealed)).toThrow(/Unknown classroom addition/);
  }
});
test('v3 additions preserve byte verification and cannot conceal a textbook mutation', () => {
  const dir = 'edities/books34-v3/books/book-3/chapters/3.3/';
  const originals = [dir + '3.3.2 manuscript.md', dir + 'paragraph-pdfs/3.3.2-leerling-v3.pdf'].sort();
  const rows = originals.map(file => {
    const bytes = Buffer.from('signed v3 content ' + file);
    fs.mkdirSync(path.dirname(path.join(temp, file)), {recursive:true});
    fs.writeFileSync(path.join(temp, file), bytes);
    return {path:file, bytes:bytes.length, sha256:prior.sha(bytes), baseline_git_blob:gitBlob(bytes)};
  });
  const base = new Map(rows.map(row => [row.path,row.baseline_git_blob]));
  const addition = dir + 'paragraph-pdfs/3.3.2 Wereldmarktprijs – presentatie.pdf';
  const actual = [...originals,addition].sort();
  expect(current.verifyCurrentInventory(temp,rows,actual,base)).toEqual([addition]);
  fs.writeFileSync(path.join(temp,originals[0]),'changed source');
  expect(() => current.verifyCurrentInventory(temp,rows,actual,base)).toThrow(/Stale successor file/);
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
