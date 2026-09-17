'use strict';
// Exactly two paired lesson states. V3 authority and its platform transport are
// the same in both; the old lesson projection is explicitly transitional.
const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');
const m = require('./migrate-books34-v3');
const {TRANSITIONS, V3_TRANSITIONS} = require('./books34-authority-transition');
const {safeFile, fileInventory, verifyDelivery} = require('./books34-v3-delivery');
const manifestPins = require('../maintenance/books34-manifest-identities.json');
const BOOKS = {
  3: 'Boek 3 - Overheidsingrijpen, concurrentie en internationale handel',
  4: 'Boek 4 - Monopolie, marktfalen en arbeidsmarkt',
};
const GENERATED_LESSON_PATHS = new Set(['archive/index.json', 'archive/index.md']);
const git = (repo, args) => execFileSync('git', args, {cwd: repo, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024});

function lessonState(lessons) {
  const hash = m.sha(m.text(fs.readFileSync(path.join(lessons, 'course_blueprint_v5.md'))));
  const packagePresent = fs.existsSync(path.join(lessons, m.PACKAGE));
  if (hash === TRANSITIONS[m.V5][1]) {
    if (packagePresent || fs.existsSync(path.join(lessons, m.SNAPSHOT))) throw new Error('Partial v3 import with legacy v2 lesson projection');
    return 'legacy-v2-projection';
  }
  if (hash === V3_TRANSITIONS[m.V5]) {
    if (!packagePresent) throw new Error('V3 lesson projection requires the complete v3 package; transport does not excuse missing lesson files');
    return 'v3-projection';
  }
  throw new Error('Unknown or mixed lesson blueprint identity');
}

function verifyLegacyDeliveries(lessons, {requireTracked = false} = {}) {
  const failures = [];
  for (const [book, folder] of Object.entries(BOOKS)) {
    const raw = fs.readFileSync(safeFile(lessons, folder + '/IMPORT_MANIFEST.json'));
    if (m.sha(m.text(raw)) !== manifestPins[book]) throw new Error('Changed v2 import manifest: Book ' + book);
    const manifest = JSON.parse(raw);
    const allowed = new Set([...manifest.files.map(f => f.repository_path), ...[
      'IMPORT_MANIFEST.json', 'README.md', 'edities/chat-2026/README.md', 'edities/chat-2026/BRONNEN.md',
    ].map(f => folder + '/' + f)]);
    for (const item of manifest.files) {
      try {
        const bytes = fs.readFileSync(safeFile(lessons, item.repository_path));
        if (bytes.length !== item.bytes || m.sha(bytes) !== item.sha256) failures.push('Changed v2 delivery ' + item.repository_path);
      } catch (error) { failures.push(error.message); }
    }
    const files = fileInventory(path.join(lessons, folder)).map(f => folder + '/' + f);
    if (files.length !== allowed.size || files.some(f => !allowed.has(f))) failures.push('Unexpected v2 file inventory: Book ' + book);
    if (requireTracked) {
      const entries = new Map(git(lessons, ['ls-files', '--stage', '-z', '--', folder]).split('\0').filter(Boolean).map(row => {
        const [info, file] = row.split('\t'); return [file, info.split(' ')];
      }));
      if (entries.size !== allowed.size || [...entries.keys()].some(f => !allowed.has(f))) failures.push('Unexpected tracked v2 inventory: Book ' + book);
      for (const item of manifest.files) {
        const entry = entries.get(item.repository_path);
        if (!entry || entry[0] !== item.mode || entry[1] !== item.git_blob || entry[2] !== '0') failures.push('Changed v2 tracked mode/blob ' + item.repository_path);
      }
    }
  }
  return failures;
}

function verifyLessonPackage(lessons, options = {}) {
  const state = lessonState(lessons);
  return {state, failures: state === 'v3-projection' ? verifyDelivery(lessons, m.PACKAGE, options).failures : []};
}

function verifyLegacyLessonState(lessons) {
  const changed = git(lessons, ['diff', '--name-only', '-z', m.LESSON_BASE]).split('\0').filter(Boolean);
  const extra = git(lessons, ['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
  // Trusted compatibility navigation is the sole generated working-tree delta.
  return [...changed, ...extra].filter(f => !GENERATED_LESSON_PATHS.has(f))
    .map(f => 'Legacy lesson state differs from pinned base: ' + f);
}

module.exports = {BOOKS, lessonState, verifyLessonPackage, verifyLegacyDeliveries, verifyLegacyLessonState};
