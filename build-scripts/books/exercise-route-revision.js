'use strict';
// Current edition acceptance is separate from the immutable import receipts.
// Updating the pin below requires review of the complete new manifest/diff.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const {execFileSync} = require('child_process');
const {safeFile, fileInventory} = require('../references/books34-v3-delivery');
const {gitBlob} = require('../lib/historical-paths');
const ROOT = path.resolve(__dirname, '../..');
const REVISION = 'exercise-routes-20260921';
const BASE = 'e2843b47c828784ab594d004cef461cea929717f';
const ROOTS = ['Boek 2 - Kosten, opbrengsten, elasticiteit en surplus/edities/chat-2026', 'edities/books34-v3'];
const MANIFEST = 'exercise-route-revision.json';
const PIN_FILE = 'build-scripts/books/exercise-route-revision-pin.json';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const text = bytes => String(bytes).replace(/\r\n?/g, '\n');
const git = (repo, args) => execFileSync('git', args, {cwd: repo, maxBuffer: 64 * 1024 * 1024});
const inScope = file => ROOTS.some(prefix => file.startsWith(prefix + '/'));

function inventory(lessons) {
  return ROOTS.flatMap(prefix => fileInventory(path.join(lessons, prefix)).map(file => prefix + '/' + file)).sort();
}

function baseline(lessons) {
  return new Map(String(git(lessons, ['ls-tree', '-r', '-z', BASE, '--', ...ROOTS])).split('\0').filter(Boolean).map(row => {
    const [info, file] = row.split('\t');
    const [mode, type, blob] = info.split(' ');
    if (mode !== '100644' || type !== 'blob') throw new Error('Unexpected baseline mode ' + file);
    return [file, blob];
  }));
}

function historical(file) {
  const relative = file.slice(file.startsWith(ROOTS[0] + '/') ? ROOTS[0].length+1 : ROOTS[1].length+1);
  if (file.startsWith(ROOTS[0] + '/')) return (/^bronnen\/H[123]\/[^/]+\.py$/.test(relative))
    || ['delivery-manifest.json', 'repair-manifest.json', 'CORRECTIES-2026-09-20.md', 'CORRECTIES-REVIEW-2026-09-20.md'].includes(relative);
  return relative === 'MANIFEST.sha256.json' || /^(provenance|historical-inputs)\//.test(relative)
    || (relative.startsWith('build/') && relative !== 'build/build_all.py')
    || (relative.startsWith('checks/') && !relative.startsWith('checks/route-revision-'));
}

function verifyManifest(lessons, bytes, expectedHash, {requireTracked = false} = {}) {
  if (sha(bytes) !== expectedHash) throw new Error('Unreviewed route manifest');
  const doc = JSON.parse(bytes);
  if (doc.revision !== REVISION || doc.baseline_lesson_commit !== BASE || JSON.stringify(doc.roots) !== JSON.stringify(ROOTS)) throw new Error('Unknown route revision or scope');
  const rows = doc.files;
  if (!Array.isArray(rows) || !rows.length || new Set(rows.map(r => r.path)).size !== rows.length || rows.some(r => !inScope(r.path))) throw new Error('Invalid revision file inventory');
  const actual = inventory(lessons), expected = rows.map(r => r.path).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('Unexpected revision file inventory');
  for (const row of rows) {
    const content = fs.readFileSync(safeFile(lessons, row.path));
    if (content.length !== row.bytes || sha(content) !== row.sha256) throw new Error('Stale revision file ' + row.path);
  }
  if (requireTracked) {
    const entries = new Map(String(git(lessons, ['ls-files', '--stage', '-z', '--', ...ROOTS, MANIFEST])).split('\0').filter(Boolean).map(row => {
      const [info, file] = row.split('\t'); return [file, info.split(' ')];
    }));
    if (entries.size !== rows.length + 1) throw new Error('Revision inventory not fully tracked');
    for (const file of [...expected, MANIFEST]) {
      const entry = entries.get(file);
      if (!entry || entry[0] !== '100644' || entry[2] !== '0' || entry[1] !== gitBlob(fs.readFileSync(safeFile(lessons, file)))) throw new Error('Staged revision differs ' + file);
    }
  }
  return doc;
}

function verify({root = ROOT, lessons = path.resolve(root, '../4veco-lessen'), requireTracked = false} = {}) {
  const failures = []; let state = null, files = 0;
  try {
    const pin = JSON.parse(fs.readFileSync(path.join(root, PIN_FILE)));
    if (pin.revision !== REVISION) throw new Error('Unknown platform route revision');
    const manifestPath = path.join(lessons, MANIFEST);
    if (fs.existsSync(manifestPath)) {
      const manifest = verifyManifest(lessons, fs.readFileSync(safeFile(lessons, MANIFEST)), pin.manifest_sha256, {requireTracked});
      for (const row of manifest.platform_inputs) {
        if (sha(text(fs.readFileSync(safeFile(root, row.path)))) !== row.sha256_lf) throw new Error('Stale platform revision input ' + row.path);
      }
      state = 'exercise-route-revision'; files = manifest.files.length;
      for (const [file, blob] of baseline(lessons)) {
        if (historical(file) && gitBlob(fs.readFileSync(safeFile(lessons, file))) !== blob) throw new Error('Historical evidence or received tool changed ' + file);
      }
    } else {
      // Required platform CI may still be paired with lesson main before its PR.
      // Accept exactly the post-PR55 baseline, never arbitrary unmanifested edits.
      const original = baseline(lessons), current = inventory(lessons);
      if (original.size !== current.length || current.some(f => !original.has(f))) throw new Error('Unmanifested edition inventory');
      for (const [file, blob] of original) {
        if (gitBlob(fs.readFileSync(safeFile(lessons, file))) !== blob) throw new Error('Unmanifested edition change ' + file);
      }
      state = 'post-book2-repair-baseline'; files = current.length;
    }
    // Book 1, Part B, legacy editions and all unrelated files remain protected.
    const changes = String(git(lessons, ['diff', '--name-only', '-z', BASE])) + String(git(lessons, ['ls-files', '--others', '--exclude-standard', '-z']));
    for (const file of changes.split('\0').filter(Boolean)) {
      if (!inScope(file) && file !== MANIFEST && !['archive/index.json', 'archive/index.md'].includes(file)) throw new Error('Outside route revision scope ' + file);
    }
  } catch (error) { failures.push(error.message); }
  return {revision: REVISION, state, files, passed: !failures.length, failures};
}

if (require.main === module) {
  const result = verify({requireTracked: process.argv.includes('--require-tracked')});
  console.log(JSON.stringify(result, null, 2));
  if (!result.passed) process.exitCode = 1;
}
module.exports = {ROOT, REVISION, BASE, ROOTS, MANIFEST, PIN_FILE, sha, text, inventory, verifyManifest, verify};
