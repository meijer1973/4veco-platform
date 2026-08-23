'use strict';

const {
  validateCanonicalSourceHashes,
  validateHistoricalBaseMain
} = require('./lib/mtu-h7-bundle4-provenance');

const BASE_SHA = '1'.repeat(40);
const MERGE_SHA = '2'.repeat(40);
const LATER_MAIN_SHA = '3'.repeat(40);
const SOURCE_HASH = 'a'.repeat(64);

function artifactDocuments() {
  return ['bundle', 'matrix', 'negatives', 'gate', 'prReadiness']
    .map((name) => ({ name, doc: { base_main_sha: BASE_SHA } }));
}

describe('MTU-H7 Bundle 4 historical provenance', () => {
  test('accepts feature-head validation against the recorded main base', () => {
    const isAncestor = jest.fn(() => true);
    const result = validateHistoricalBaseMain({
      documents: artifactDocuments(),
      currentMainSha: BASE_SHA,
      isAncestor
    });

    expect(result.ok).toBe(true);
    expect(isAncestor).toHaveBeenCalledWith(BASE_SHA, BASE_SHA);
  });

  test('accepts immediate post-merge main while retaining historical provenance', () => {
    const isAncestor = jest.fn(() => true);
    const result = validateHistoricalBaseMain({
      documents: artifactDocuments(),
      currentMainSha: MERGE_SHA,
      isAncestor
    });

    expect(result.ok).toBe(true);
    expect(result.historicalBaseMainSha).toBe(BASE_SHA);
    expect(isAncestor).toHaveBeenCalledWith(BASE_SHA, MERGE_SHA);
  });

  test('accepts a later unrelated main descendant', () => {
    const isAncestor = jest.fn((ancestor, descendant) => ancestor === BASE_SHA && descendant === LATER_MAIN_SHA);
    const result = validateHistoricalBaseMain({
      documents: artifactDocuments(),
      currentMainSha: LATER_MAIN_SHA,
      isAncestor
    });

    expect(result.ok).toBe(true);
  });

  test('rejects artifacts that disagree on historical provenance', () => {
    const documents = artifactDocuments();
    documents[4].doc.base_main_sha = MERGE_SHA;
    const result = validateHistoricalBaseMain({
      documents,
      currentMainSha: LATER_MAIN_SHA,
      isAncestor: () => true
    });

    expect(result.ok).toBe(false);
    expect(result.failures).toContain('Bundle 4 artifacts must agree on one historical base_main_sha');
  });

  test('rejects a historical base that is not on current main lineage', () => {
    const result = validateHistoricalBaseMain({
      documents: artifactDocuments(),
      currentMainSha: LATER_MAIN_SHA,
      isAncestor: () => false
    });

    expect(result.ok).toBe(false);
    expect(result.failures).toContain('historical base_main_sha must be an ancestor of current main');
  });

  test('still rejects genuine canonical source-input drift', () => {
    const result = validateCanonicalSourceHashes({
      entries: [{
        path: 'reports/source.json',
        hash_kind: 'canonical_parsed_json_sha256',
        sha256: SOURCE_HASH
      }],
      expectedPaths: ['reports/source.json'],
      canonicalHashForPath: () => 'b'.repeat(64)
    });

    expect(result.ok).toBe(false);
    expect(result.failures).toContain('source hash mismatch: reports/source.json');
  });
});
