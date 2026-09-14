#!/usr/bin/env node
// HOW TO ADAPT: this is only BOOK2-CHAT-IMPORT-1's reviewed finite boundary.
// Do not broaden it into an edition lane. A different import needs its own decision.
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const { isDeepStrictEqual: equal } = require('util');

const BOOK = 'Boek 2 - Kosten, opbrengsten, elasticiteit en surplus';
const EDITION = `${BOOK}/edities/chat-2026`;
const ARCHIVE = 'archive/book-2-pre-chat-2026';
const SOURCE = '3e63e82cd335405f383cd76f13b51b774b8b0571';
const LESSON_BASE = '0acaaa97443e5c4fee34f7da8a12ccd5db62d762';
const PLATFORM_BASE = '85b0f347f3070e005eae3f35f0b11ce6eac71b4d';
const EDITION_TREE = '909aa0d98e808512da7c7355a328eadf99b8e65b';
const CHAPTERS = [
  ['2.1 Hoofdstuk Kosten en opbrengsten', '93ad9730baa7743513929040d91a07d93c5baafa'],
  ['2.2 Hoofdstuk Elasticiteit', 'd6a2aa9d87971469205c1ca302c8890d3e88ca6f'],
];
const LESSON_FILES = [
  '.gitattributes', 'RESEARCH_AGENT_MAP.md', 'lessen-team-roadmap.md',
  `${BOOK}/README.md`, `${BOOK}/IMPORT_REPORT.md`, `${ARCHIVE}/README.md`,
  'archive/relocations.json', 'archive/index.json', 'archive/index.md',
];
const PLATFORM_FILES = [
  'build-scripts/maintenance/check-book2-chat-import.js',
  'build-scripts/maintenance/check-book2-chat-import.test.js',
  'docs/roadmaps/roadmap-version-index.json',
  'docs/roadmaps/textbook/sprint-ledger.md',
  'docs/roadmaps/textbook/textbook-production-roadmap.md',
  'reports/github-agent-current-lessen.json', 'reports/github-agent-current-lessen.md',
  'reports/github-agent-index-lessen.json', 'reports/github-agent-index-lessen.md',
  'reports/github-agent-current-platform.json', 'reports/github-agent-current-platform.md',
  'reports/github-agent-index-platform.json', 'reports/github-agent-index-platform.md',
  'reports/internal-dashboard/dashboard-data.json', 'reports/internal-dashboard/index.html',
];
const inside = (file, dir) => file.startsWith(`${dir}/`);

function verifyEvidence(e) {
  const failures = [];
  const require = (condition, message) => { if (!condition) failures.push(message); };
  require(e.editionTree === EDITION_TREE, 'Delivered edition tree changed or missing');
  for (const [chapter, tree] of CHAPTERS) {
    require(e.sourceTrees[chapter] === tree, `Original chapter identity changed: ${chapter}`);
    require(e.archivedTrees[chapter] === tree, `Archive move is not preserving: ${chapter}`);
    require(!e.activeTrees[chapter], `Old active chapter recreated: ${chapter}`);
  }
  for (const file of e.lessonChanges) {
    require(LESSON_FILES.includes(file) || inside(file, EDITION) || CHAPTERS.some(([c]) =>
      inside(file, `${BOOK}/${c}`) || inside(file, `${ARCHIVE}/${c}`)), `Out-of-scope lesson change: ${file}`);
  }
  for (const file of e.platformChanges) require(PLATFORM_FILES.includes(file), `Out-of-scope platform change: ${file}`);
  require(e.attributeBlob === e.reviewedAttributeBlob, '.gitattributes differs from the narrowly reviewed preservation rule');
  require(equal(e.originalRelocations, { ...e.relocations, entries: e.originalRelocations.entries }), 'Unrelated relocation metadata changed');
  const expectedMoves = e.originalFiles.map(file => ({
    original_path: file.path,
    archived_path: `${ARCHIVE}/${file.path.slice(BOOK.length + 1)}`,
    original_blob: file.oid, final_blob: file.oid, source_commit: SOURCE,
    topic: 'Book 2 pre-chat repository production', batch: 'BOOK2-CHAT-IMPORT-1',
    current_consumers: ['Historical lookup via build-scripts/lib/historical-paths.js'],
    live_follow_up: null, navigation_edit: null,
  }));
  require(equal(e.relocations.entries, [...e.originalRelocations.entries, ...expectedMoves]),
    'Relocations must preserve every original entry and register exactly the named moves');
  for (const file of e.originalFiles) require(file.mode === '100644', `Unexpected source mode: ${file.path}`);
  for (const file of e.changedMetadata) require(file.mode === '100644', `Missing/non-ordinary metadata file: ${file.path}`);
  for (const link of e.brokenLinks) failures.push(`Broken active navigation: ${link}`);
  return { ok: failures.length === 0, failures };
}

function git(root, args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
}
function entries(root, ref) {
  return new Map(git(root, ['ls-tree', '-r', '-t', '-z', '--full-tree', ref]).split('\0').filter(Boolean).map(row => {
    const [header, file] = row.split('\t');
    const [mode, type, oid] = header.split(' ');
    return [file, { path: file, mode, type, oid }];
  }));
}
function changes(root, base, head) {
  return git(root, ['diff', '--no-renames', '--name-only', '-z', base, head]).split('\0').filter(Boolean);
}
function text(root, ref, file) { return git(root, ['show', `${ref}:${file}`]); }
function assertCheckout(root, head) {
  if (!/^[a-f0-9]{40}$/.test(head || '')) throw Error('Use an explicit full commit SHA for each head');
  if (git(root, ['rev-parse', 'HEAD']).trim() !== head) throw Error(`Checkout does not match declared head: ${root}`);
  if (git(root, ['status', '--porcelain', '--untracked-files=normal']).trim()) throw Error(`Checkout must be clean: ${root}`);
}
function collectEvidence({ platformRoot, lessonRoot, platformHead, lessonHead }) {
  assertCheckout(platformRoot, platformHead);
  assertCheckout(lessonRoot, lessonHead);
  git(platformRoot, ['merge-base', '--is-ancestor', PLATFORM_BASE, platformHead]);
  git(lessonRoot, ['merge-base', '--is-ancestor', SOURCE, lessonHead]);
  const before = entries(lessonRoot, SOURCE), after = entries(lessonRoot, lessonHead);
  const platform = entries(platformRoot, platformHead);
  const lessonChanges = changes(lessonRoot, LESSON_BASE, lessonHead);
  const platformChanges = changes(platformRoot, PLATFORM_BASE, platformHead);
  const tree = (map, file) => map.get(file)?.type === 'tree' ? map.get(file).oid : null;
  const brokenLinks = [];
  for (const file of [`${BOOK}/README.md`, `${BOOK}/IMPORT_REPORT.md`, `${ARCHIVE}/README.md`, `${EDITION}/README.md`, `${EDITION}/IMPORT_NOTES.md`, 'RESEARCH_AGENT_MAP.md']) {
    if (!after.has(file)) { brokenLinks.push(file); continue; }
    const source = text(lessonRoot, lessonHead, file);
    for (const match of source.matchAll(/(?<!!)\[[^\]]*\]\(([^)]+)\)/g)) {
      const href = match[1];
      if (/^(https?:|#)/.test(href)) continue;
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(href.split('#')[0]))).replace(/\/$/, '');
      if (!after.has(target)) brokenLinks.push(`${file} -> ${href}`);
    }
  }
  return {
    editionTree: tree(after, EDITION),
    sourceTrees: Object.fromEntries(CHAPTERS.map(([c]) => [c, tree(before, `${BOOK}/${c}`)])),
    archivedTrees: Object.fromEntries(CHAPTERS.map(([c]) => [c, tree(after, `${ARCHIVE}/${c}`)])),
    activeTrees: Object.fromEntries(CHAPTERS.map(([c]) => [c, after.has(`${BOOK}/${c}`)])),
    lessonChanges, platformChanges, brokenLinks,
    attributeBlob: after.get('.gitattributes')?.oid,
    reviewedAttributeBlob: before.get('.gitattributes')?.oid,
    originalRelocations: JSON.parse(text(lessonRoot, SOURCE, 'archive/relocations.json')),
    relocations: JSON.parse(text(lessonRoot, lessonHead, 'archive/relocations.json')),
    originalFiles: [...before.values()].filter(e => e.type === 'blob' && CHAPTERS.some(([c]) => inside(e.path, `${BOOK}/${c}`))),
    changedMetadata: [
      ...lessonChanges.filter(p => LESSON_FILES.includes(p)).map(p => after.get(p) || { path: p }),
      ...platformChanges.filter(p => PLATFORM_FILES.includes(p)).map(p => platform.get(p) || { path: p }),
    ],
  };
}

function main(argv) {
  const options = { platformRoot: path.resolve(__dirname, '../..') };
  for (let i = 0; i < argv.length; i++) {
    const key = { '--lesson-root': 'lessonRoot', '--lesson-head': 'lessonHead', '--platform-head': 'platformHead' }[argv[i]];
    if (!key || !argv[i + 1]) throw Error('Usage: check-book2-chat-import.js --lesson-head <SHA> --platform-head <SHA> [--lesson-root <path>]');
    options[key] = argv[++i];
  }
  options.lessonRoot = path.resolve(options.lessonRoot || path.join(options.platformRoot, '../4veco-lessen'));
  const evidence = collectEvidence(options);
  const result = { task: 'BOOK2-CHAT-IMPORT-1', ...options, ...verifyEvidence(evidence),
    scope: 'Technical import/archive boundary, committed tree identities and local navigation only; no formal paragraph/content approval or merge authority.',
    edition_tree: evidence.editionTree, archive_trees: evidence.archivedTrees,
    moved_files: evidence.originalFiles.length,
    lesson_changed_paths: evidence.lessonChanges.length, platform_changed_paths: evidence.platformChanges.length };
  console.log(JSON.stringify(result, null, 2));
  return result.ok ? 0 : 1;
}
if (require.main === module) {
  try { process.exitCode = main(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { verifyEvidence, collectEvidence, BOOK, EDITION, ARCHIVE, SOURCE, EDITION_TREE, CHAPTERS, LESSON_FILES, PLATFORM_FILES };
