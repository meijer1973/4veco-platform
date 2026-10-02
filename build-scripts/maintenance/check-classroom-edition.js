#!/usr/bin/env node
'use strict';
// Current classroom additions are separate from the unchanged signed receipt.
// Do not repin a book manifest to include slides or relax its source hashes.
const fs = require('fs'), path = require('path');
const {execFileSync} = require('child_process');
const historical = require('./check-books34-v3-import');
const signed = require('../books/books34-signed-revision');
const followups = require('../books/books34-followups-revision');
const book2 = require('../books/book2-signed-revision');
const prior = require('../books/exercise-route-revision');
const {safeFile} = require('../references/books34-v3-delivery');
const {gitBlob} = require('../lib/historical-paths');
const ROOT = path.resolve(__dirname, '../..');
const assert = (value, message) => { if (!value) throw Error(message); };
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const git = (repo, args) => execFileSync('git', args, {cwd: repo, maxBuffer: 256 * 1024 * 1024});

function isClassroomAddition(file, sealedPaths) {
  if (sealedPaths.has(file)) return false;
  // Books 3/4 v3 keep the existing paragraph exports together in paragraph-pdfs/.
  // Admit only companion slides/evidence for a paragraph present in the receipt.
  const currentBook = file.match(/^(edities\/books34-v3\/books\/book-([34])\/chapters\/([34]\.[1-3])\/paragraph-pdfs\/)(?:([34]\.[1-3]\.[1-9]\d*) [^/]+ – presentatie\.(?:pptx|pdf)|evidence\/([34]\.[1-3]\.[1-9]\d*)-presentation\.md)$/);
  if (currentBook) {
    const [, folder, book, chapter, slideId, evidenceId] = currentBook;
    const id = slideId || evidenceId;
    return chapter.startsWith(book + '.') && id.startsWith(chapter + '.')
      && sealedPaths.has(folder + id + '-leerling-v3.pdf');
  }
  const prefix = prior.ROOTS[0] + '/bronnen/';
  if (!file.startsWith(prefix)) return false;
  const match = file.slice(prefix.length).match(/^H([1-3])\/paragrafen\/(2\.([1-3])\.[1-9]\d* [^/]+)\/(.+)$/);
  if (!match || match[1] !== match[3]) return false;
  const [, , title, , leaf] = match, id = title.split(' ')[0];
  const folder = prefix + `H${match[1]}/paragrafen/${title}/`;
  // The destination must already be an actual paragraph in the signed book.
  if (!['paragraaf', 'opgaven'].some(kind => sealedPaths.has(folder + title + ` – ${kind}.pdf`))) return false;
  return leaf === title + ' – presentatie.pptx' || leaf === title + ' – presentatie.pdf'
    || leaf === `evidence/${id}-presentation.md`;
}

function partitionInventory(actual, sealed) {
  const expected = new Set(sealed);
  assert(expected.size === sealed.length, 'Duplicate signed inventory');
  const additions = actual.filter(file => !expected.has(file));
  assert(additions.every(file => isClassroomAddition(file, expected)),
    'Unknown classroom addition: ' + additions.filter(file => !isClassroomAddition(file, expected)).join(', '));
  assert(equal(actual.filter(file => expected.has(file)), sealed), 'Signed edition file missing');
  return additions;
}

function verifyCurrentInventory(lessons, files, actual, baseline) {
  const sealed = files.map(row => row.path);
  const additions = partitionInventory(actual, sealed);
  signed.verifyFiles(lessons, files, sealed, baseline);
  return additions;
}

function verifyTracked(lessons, files, roots) {
  const entries = new Map(String(git(lessons, ['ls-files', '--stage', '-z', '--', ...roots])).split('\0').filter(Boolean).map(row => {
    const [info, file] = row.split('\t'); return [file, info.split(' ')];
  }));
  assert(entries.size === files.length, 'Successor and classroom additions are not fully tracked');
  for (const file of files) {
    const entry = entries.get(file);
    assert(entry && entry[0] === '100644' && entry[2] === '0'
      && entry[1] === gitBlob(fs.readFileSync(safeFile(lessons, file))), 'Staged successor/classroom bytes differ ' + file);
  }
}

function verifySuccessor(lessons, {root = ROOT, requireTracked = false} = {}) {
  const read = (repo, file) => fs.readFileSync(safeFile(repo, file));
  const pin = JSON.parse(read(root, signed.PIN_FILE));
  const bytes = read(lessons, signed.MANIFEST), doc = JSON.parse(bytes);
  assert(pin.revision === signed.REVISION && prior.sha(bytes) === pin.manifest_sha256, 'Unreviewed Books 3/4 successor manifest');
  assert(doc.revision === signed.REVISION && doc.baseline_lesson_commit === signed.BASE, 'Unknown successor/base');
  assert(equal(doc.approved_source_replacements, signed.contract.source_edits), 'Unapproved source-replacement contract');
  assert(equal(doc.predecessors, signed.predecessor(lessons, root)), 'False predecessor evidence');
  const actual = book2.inventory(lessons), sealed = doc.files.map(row => row.path);
  // Run the original byte, baseline-blob and deletion checks on EVERY sealed file.
  const additions = verifyCurrentInventory(lessons, doc.files, actual,
    signed.tree(lessons, signed.BASE, [...prior.ROOTS, book2.PROJECTION]));
  const extra = new Set(additions), changes = signed.changedPaths(lessons);
  const navigation = changes.includes('RESEARCH_AGENT_MAP.md') ? ['RESEARCH_AGENT_MAP.md'] : [];
  for (const file of navigation) safeFile(lessons, file);
  const receiptChanges = changes.filter(file => !extra.has(file) && file !== 'RESEARCH_AGENT_MAP.md');
  assert(receiptChanges.every(file => signed.ALLOWED.has(file)), 'Out-of-scope successor change: ' + receiptChanges.filter(file => !signed.ALLOWED.has(file)).join(', '));
  assert(equal(receiptChanges, pin.revision_paths), 'Unreviewed changed-path inventory');
  assert(equal(doc.platform_inputs.map(row => row.path), signed.INPUTS), 'Unexpected platform inputs');
  for (const row of doc.platform_inputs) {
    assert(prior.sha(prior.text(read(root, row.path))) === row.sha256_lf, 'Stale successor platform input ' + row.path);
  }
  signed.sourceAndPins(lessons);
  if (requireTracked) {
    const files = [...actual, signed.MANIFEST, prior.MANIFEST, book2.MANIFEST, ...navigation];
    verifyTracked(lessons, files, [...prior.ROOTS, book2.PROJECTION, signed.MANIFEST, prior.MANIFEST, book2.MANIFEST, ...navigation]);
  }
  return {files: sealed.length, classroom_additions: additions};
}

function verifyFollowupInput(file, bytes, expectedHash) {
  const text = prior.text(bytes);
  if (prior.sha(text) === expectedHash) return;
  // The accepted scope checker predates the additive classroom slide-PDF rule.
  // Reverse exactly that insertion, then authenticate ALL remaining bytes.
  const before = "  'presentatie.pptx',\n  'presentatie.html',";
  const after = "  'presentatie.pptx',\n  'presentatie.pdf',\n  'presentatie.html',";
  assert(file === 'build-scripts/workflows/check-paragraph-lane-scope.js'
    && text.split(after).length === 2
    && prior.sha(text.replace(after, before)) === expectedHash,
  'Stale follow-up tool ' + file);
}

function verifyFollowups(lessons, {root = ROOT, requireTracked = false} = {}) {
  const read = (repo, file) => fs.readFileSync(safeFile(repo, file));
  const pin = JSON.parse(read(root, followups.PIN_FILE));
  const bytes = read(lessons, followups.MANIFEST), doc = JSON.parse(bytes);
  assert(pin.revision === followups.REVISION && prior.sha(bytes) === pin.manifest_sha256, 'Unreviewed follow-up manifest');
  assert(doc.revision === followups.REVISION && doc.baseline_lesson_commit === followups.BASE, 'Wrong follow-up/base');
  assert(equal(doc.predecessors, followups.history(lessons, root)), 'False historical evidence');
  const actual = book2.inventory(lessons), sealed = doc.files.map(row => row.path);
  const additions = partitionInventory(actual, sealed);
  followups.verifyFiles(lessons, doc.files, sealed,
    signed.tree(lessons, followups.BASE, [...prior.ROOTS, book2.PROJECTION]));
  const extra = new Set(additions), changes = followups.changedPaths(lessons);
  const navigation = changes.includes('RESEARCH_AGENT_MAP.md') ? ['RESEARCH_AGENT_MAP.md'] : [];
  for (const file of navigation) safeFile(lessons, file);
  const receiptChanges = changes.filter(file => !extra.has(file) && file !== 'RESEARCH_AGENT_MAP.md');
  assert(receiptChanges.every(file => followups.ALLOWED.has(file)), 'Outside follow-up scope: ' + receiptChanges.filter(file => !followups.ALLOWED.has(file)).join(', '));
  assert(equal(receiptChanges, pin.revision_paths), 'Unreviewed changed-path list');
  assert(equal(doc.platform_inputs.map(row => row.path), followups.INPUTS), 'Wrong platform inventory');
  for (const row of doc.platform_inputs) verifyFollowupInput(row.path, read(root, row.path), row.sha256_lf);
  followups.sourcesAndTargets(lessons);
  if (requireTracked) {
    const manifests = [followups.MANIFEST, signed.MANIFEST, prior.MANIFEST, book2.MANIFEST];
    verifyTracked(lessons, [...actual, ...manifests, ...navigation], [...prior.ROOTS, book2.PROJECTION, ...manifests, ...navigation]);
  }
  return {files: sealed.length, classroom_additions: additions};
}

function verifyNotation(lessons, {root = ROOT, requireTracked = false} = {}) {
  // The notation successor seals the accepted Book 2 edits as well as all older
  // books. Reuse its byte/history validators; do not fall back to an older receipt.
  const notation = require('../books/book2-notation-revision');
  const classroom = require('../books/book2-presentation-revision');
  const read = (repo, file) => fs.readFileSync(safeFile(repo, file));
  const pin = JSON.parse(read(root, notation.PIN_FILE));
  const bytes = read(lessons, notation.MANIFEST), doc = JSON.parse(bytes);
  const contract = notation.contract(root), allowed = new Set(contract.revision_paths);
  classroom.checkContract(root, lessons);
  assert(pin.revision === notation.REVISION && prior.sha(bytes) === pin.manifest_sha256, 'Unreviewed notation manifest');
  assert(doc.revision === notation.REVISION && doc.baseline_lesson_commit === notation.BASE, 'Wrong notation revision/base');
  assert(equal(doc.predecessors, notation.history(lessons, root)), 'False historical evidence');
  assert(contract.lessons_base === notation.BASE && contract.platform_base === notation.PLATFORM_BASE, 'Wrong contract bases');
  assert(contract.revision_paths.every(file => [notation.MANIFEST, notation.ENTRY].includes(file)
    || file.startsWith(notation.EDITION + '/')), 'Contract exceeds Book 2 scope');
  assert(contract.source_bindings.some(row => row.path === notation.ENTRY), 'Missing bounded entry-document binding');
  const actual = notation.inventory(lessons), sealed = doc.files.map(row => row.path);
  const additions = partitionInventory(actual, sealed);
  notation.verifyFiles(lessons, doc.files, sealed, signed.tree(lessons, notation.BASE, notation.ROOTS), allowed);
  const extra = new Set(additions), changes = notation.changedPaths(lessons);
  const navigation = changes.includes('RESEARCH_AGENT_MAP.md') ? ['RESEARCH_AGENT_MAP.md'] : [];
  for (const file of navigation) safeFile(lessons, file);
  const receiptChanges = changes.filter(file => !extra.has(file) && file !== 'RESEARCH_AGENT_MAP.md');
  assert(equal(receiptChanges, [...allowed].sort()), 'Outside finite notation revision');
  assert(equal(receiptChanges, pin.revision_paths), 'Unreviewed changed paths');
  for (const row of contract.source_bindings) {
    assert(prior.sha(git(lessons, ['show', notation.BASE + ':' + row.path])) === row.baseline_sha256, 'False source ancestry ' + row.path);
    assert(prior.sha(read(lessons, row.path)) === row.proposed_sha256, 'Unreviewed editable source ' + row.path);
  }
  assert(equal(doc.platform_inputs.map(row => row.path), notation.INPUTS), 'Wrong platform input inventory');
  for (const row of doc.platform_inputs) {
    assert(prior.sha(prior.text(read(root, row.path))) === row.sha256_lf, 'Stale notation tool ' + row.path);
  }
  if (requireTracked) {
    verifyTracked(lessons, [...actual, notation.MANIFEST, ...navigation], [...notation.ROOTS, notation.MANIFEST, ...navigation]);
  }
  return {files: sealed.length, classroom_additions: additions};
}

function verify(options = {}) {
  const original = historical.verify(options);
  // Never suppress transport, structure, source, pin or other historical failures.
  const notation = require('../books/book2-notation-revision');
  const notationInventory = original.lesson_state === notation.REVISION
    && ['Unexpected current file inventory', 'Outside finite notation revision'].includes(original.failures[0]);
  if (original.passed || original.failures.length !== 1 || (!notationInventory && !/^(Unexpected successor inventory|Out-of-scope successor change:|Unreviewed changed-path inventory|Successor is not fully tracked|Unexpected follow-up inventory|Outside follow-up scope:|Unreviewed changed-path list|Follow-up inventory not fully tracked|Stale follow-up tool build-scripts\/workflows\/check-paragraph-lane-scope\.js$)/.test(original.failures[0]))) return original;
  try {
    const root = options.root || ROOT, lessons = options.lessons || path.resolve(root, '../4veco-lessen');
    const current = fs.existsSync(path.join(lessons, notation.MANIFEST))
      ? verifyNotation(lessons, {...options, root}) : fs.existsSync(path.join(lessons, followups.MANIFEST))
      ? verifyFollowups(lessons, {...options, root}) : verifySuccessor(lessons, {...options, root});
    return {...original, ...current, passed: true, failures: [], classroom_scope: 'additive slides; all signed book bytes preserved'};
  } catch (error) { return {...original, passed: false, failures: [error.message]}; }
}

// The notation receipt calls partitionInventory while the CLI runs verify().
// Publish the API first so that this circular require sees the complete exports.
module.exports = {isClassroomAddition, partitionInventory, verifyCurrentInventory, verifyTracked, verifySuccessor, verifyFollowupInput, verifyFollowups, verifyNotation, verify};
if (require.main === module) {
  const result = verify({requireTracked: process.argv.includes('--require-tracked')});
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
