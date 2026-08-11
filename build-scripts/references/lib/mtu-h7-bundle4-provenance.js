'use strict';

const SHA_PATTERN = /^[a-f0-9]{40}$/i;

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function sameSet(actual, expected) {
  return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
}

function validateHistoricalBaseMain({ documents, currentMainSha, isAncestor }) {
  const failures = [];
  const entries = asArray(documents).map(({ name, doc }) => ({
    name,
    baseMainSha: doc?.base_main_sha
  }));

  for (const entry of entries) {
    if (!SHA_PATTERN.test(String(entry.baseMainSha || ''))) {
      failures.push(`${entry.name} base_main_sha must be a full commit SHA`);
    }
  }

  const validBaseShas = [...new Set(entries
    .map((entry) => entry.baseMainSha)
    .filter((sha) => SHA_PATTERN.test(String(sha || ''))))];
  if (validBaseShas.length !== 1 || validBaseShas.length !== new Set(entries.map((entry) => entry.baseMainSha)).size) {
    failures.push('Bundle 4 artifacts must agree on one historical base_main_sha');
  }

  if (!SHA_PATTERN.test(String(currentMainSha || ''))) {
    failures.push('current main must resolve to a full commit SHA');
  } else if (validBaseShas.length === 1) {
    try {
      if (!isAncestor(validBaseShas[0], currentMainSha)) {
        failures.push('historical base_main_sha must be an ancestor of current main');
      }
    } catch (error) {
      failures.push(`historical base_main_sha ancestry check failed: ${error.message}`);
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    historicalBaseMainSha: validBaseShas.length === 1 ? validBaseShas[0] : null,
    currentMainSha
  };
}

function validateCanonicalSourceHashes({ entries, expectedPaths, canonicalHashForPath }) {
  const failures = [];
  const sourceHashes = asArray(entries);
  const paths = sourceHashes.map((entry) => entry.path);

  if (!sameSet(paths, asArray(expectedPaths))) {
    failures.push('bundle source_hashes must match exact expected source set');
  }
  if (sourceHashes.length !== asArray(expectedPaths).length) {
    failures.push('bundle source_hash count mismatch');
  }

  for (const entry of sourceHashes) {
    let currentHash = null;
    try {
      currentHash = entry.path ? canonicalHashForPath(entry.path) : null;
    } catch (error) {
      failures.push(`source hash input unavailable: ${entry.path}`);
      continue;
    }
    if (!entry.path || entry.hash_kind !== 'canonical_parsed_json_sha256' || entry.sha256 !== currentHash) {
      failures.push(`source hash mismatch: ${entry.path}`);
    }
  }

  return { ok: failures.length === 0, failures };
}

module.exports = {
  validateCanonicalSourceHashes,
  validateHistoricalBaseMain
};
