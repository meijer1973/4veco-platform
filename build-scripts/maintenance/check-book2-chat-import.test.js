'use strict';
const { verifyEvidence, BOOK, EDITION, ARCHIVE, SOURCE, EDITION_TREE, CHAPTERS } = require('./check-book2-chat-import');

function supported() {
  const originalFiles = CHAPTERS.map(([c]) => ({ path: `${BOOK}/${c}/original.md`, mode: '100644', oid: 'a'.repeat(40) }));
  const originalRelocations = { schema_version: 1, entries: [{ original_path: 'previous.md', archived_path: 'archive/previous.md' }] };
  return {
    editionTree: EDITION_TREE,
    sourceTrees: Object.fromEntries(CHAPTERS), archivedTrees: Object.fromEntries(CHAPTERS), activeTrees: {},
    lessonChanges: [`.gitattributes`, `${EDITION}/README.md`, `${BOOK}/README.md`, ...originalFiles.flatMap(f => [f.path, `${ARCHIVE}/${f.path.slice(BOOK.length + 1)}`])],
    platformChanges: ['build-scripts/maintenance/check-book2-chat-import.js'],
    attributeBlob: 'b'.repeat(40), reviewedAttributeBlob: 'b'.repeat(40), originalFiles, originalRelocations,
    relocations: { ...originalRelocations, entries: [...originalRelocations.entries, ...originalFiles.map(f => ({
      original_path: f.path, archived_path: `${ARCHIVE}/${f.path.slice(BOOK.length + 1)}`,
      original_blob: f.oid, final_blob: f.oid, source_commit: SOURCE,
      topic: 'Book 2 pre-chat repository production', batch: 'BOOK2-CHAT-IMPORT-1',
      current_consumers: ['Historical lookup via build-scripts/lib/historical-paths.js'], live_follow_up: null, navigation_edit: null,
    }))] },
    changedMetadata: [{ path: `${BOOK}/README.md`, mode: '100644' }], brokenLinks: [],
  };
}
test('accepts only the supported import and preserved archive evidence', () => {
  expect(verifyEvidence(supported())).toEqual({ ok: true, failures: [] });
});
test.each([['modified', 'c'.repeat(40)], ['missing', null]])('rejects %s delivered files via whole-tree identity', (_, tree) => {
  const e = supported(); e.editionTree = tree;
  expect(verifyEvidence(e).failures).toContain('Delivered edition tree changed or missing');
});
test.each(CHAPTERS.map(([c]) => c))('rejects a non-preserving archive move: %s', chapter => {
  const e = supported(); e.archivedTrees[chapter] = 'c'.repeat(40);
  expect(verifyEvidence(e).failures).toContain(`Archive move is not preserving: ${chapter}`);
});
test.each(['Boek 1 - Other/student.pdf', `${BOOK}/edities/other/new.md`, 'archive/unrelated/deleted.md', `${ARCHIVE}/unexpected.md`])('rejects out-of-scope lesson change %s', file => {
  const e = supported(); e.lessonChanges.push(file);
  expect(verifyEvidence(e).failures).toContain(`Out-of-scope lesson change: ${file}`);
});
test('rejects unrelated platform changes and global attribute weakening', () => {
  const e = supported(); e.platformChanges.push('.github/workflows/platform-ci.yml'); e.attributeBlob = 'c'.repeat(40);
  expect(verifyEvidence(e).failures).toEqual(expect.arrayContaining([
    'Out-of-scope platform change: .github/workflows/platform-ci.yml',
    '.gitattributes differs from the narrowly reviewed preservation rule',
  ]));
});
test.each(['missing', 'altered', 'extra', 'old-edited'])('rejects %s relocation metadata', kind => {
  const e = supported();
  if (kind === 'missing') e.relocations.entries.pop();
  if (kind === 'altered') e.relocations.entries[1].final_blob = 'c'.repeat(40);
  if (kind === 'extra') e.relocations.entries.push({ original_path: 'unrelated' });
  if (kind === 'old-edited') e.relocations.entries[0] = { ...e.relocations.entries[0], note: 'changed' };
  expect(verifyEvidence(e).ok).toBe(false);
});
test('rejects recreated active trees, missing metadata, and broken navigation', () => {
  const e = supported(); e.activeTrees[CHAPTERS[0][0]] = true;
  e.changedMetadata[0].mode = undefined; e.brokenLinks.push('README -> old chapter');
  expect(verifyEvidence(e).failures).toHaveLength(3);
});
