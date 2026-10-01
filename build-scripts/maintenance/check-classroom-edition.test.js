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

describe('selected Books 3/4 classroom additions', () => {
  const chapter = prior.ROOTS[1] + '/books/book-3/chapters/3.2/';
  const manuscript = chapter + '3.2.3 manuscript.md';
  const student = chapter + 'paragraph-pdfs/3.2.3-leerling-v3.pdf';
  const deck = chapter + 'paragraph-pdfs/3.2.3 Winstmaximalisatie bij volkomen concurrentie – presentatie.pptx';
  const slidePdf = deck.replace(/pptx$/, 'pdf');
  const review = chapter + 'paragraph-pdfs/evidence/3.2.3-presentation.md';
  const sealed = [manuscript, student].sort();
  test('admits only slides/PDF/evidence beside an existing signed paragraph', () => {
    expect(current.partitionInventory([...sealed, deck, slidePdf, review].sort(), sealed))
      .toEqual([deck, slidePdf, review].sort());
    expect(current.isClassroomAddition(deck, new Set([...sealed, deck]))).toBe(false);
    expect(current.isClassroomAddition(deck, new Set([student]))).toBe(false);
    expect(current.isClassroomAddition(deck, new Set([manuscript]))).toBe(false);
    const book4 = value => value.replaceAll('book-3', 'book-4').replaceAll('3.2', '4.2');
    expect(current.isClassroomAddition(book4(deck), new Set(sealed.map(book4)))).toBe(true);
  });
  test.each([
    deck.replace('3.2.3 Winst', '3.2.4 Winst'),
    deck.replace('/book-3/', '/book-4/'), deck.replace('/chapters/3.2/', '/chapters/3.1/'),
    deck.replace('3.2.3 Winst', '4.2.3 Winst'), deck.replace('books34-v3', 'books34-v2'),
    deck.replace('presentatie.pptx', 'leerling.pdf'), deck.replace('presentatie.pptx', 'presentatie.html'),
    deck.replace('/paragraph-pdfs/', '/paragraph-pdfs/extra/'),
    review.replace('3.2.3-presentation.md', 'approval.json'),
    review.replace('3.2.3-presentation.md', '3.2.4-presentation.md'),
  ])('rejects additions outside the exact paragraph artifact surface: %s', file => {
    expect(() => current.partitionInventory([...sealed, file].sort(), sealed)).toThrow(/Unknown classroom addition/);
  });
  test('v3 slides cannot hide changed or deleted signed files', () => {
    const rows = sealed.map(file => {
      const bytes = Buffer.from('signed v3 ' + file);
      fs.mkdirSync(path.dirname(path.join(temp, file)), {recursive: true});
      fs.writeFileSync(path.join(temp, file), bytes);
      return {path: file, bytes: bytes.length, sha256: prior.sha(bytes), baseline_git_blob: gitBlob(bytes)};
    });
    const base = new Map(rows.map(row => [row.path, row.baseline_git_blob]));
    const actual = [...sealed, deck].sort();
    const verify = () => current.verifyCurrentInventory(temp, rows, actual, base);
    expect(verify()).toEqual([deck]);
    const altered = Buffer.from('altered manuscript');
    fs.writeFileSync(path.join(temp, manuscript), altered);
    expect(verify).toThrow(/Stale successor file/);
    expect(() => current.partitionInventory([deck, student].sort(), sealed)).toThrow(/Signed edition file missing/);
  });
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
