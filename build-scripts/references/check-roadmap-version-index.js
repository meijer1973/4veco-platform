#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add accepted status values in STATUS_VALUES when the roadmap lifecycle expands.
 * - Keep active roadmaps out of docs/roadmaps/outdated/.
 * - Keep superseded roadmap snapshots under docs/roadmaps/outdated/ unless they are
 *   explicitly historical review inputs kept in knowledge/.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const INDEX_PATH = 'docs/roadmaps/roadmap-version-index.json';
const STATUS_VALUES = new Set(['active', 'outdated', 'historical_input', 'pointer']);

function fail(message) {
  console.error(`Roadmap version index check failed: ${message}`);
  process.exit(1);
}

function exists(relPath) {
  return fs.existsSync(path.join(REPO_ROOT, relPath));
}

function main() {
  if (!exists(INDEX_PATH)) fail(`missing ${INDEX_PATH}`);
  const index = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, INDEX_PATH), 'utf8'));
  if (index.schema_version !== 1) fail('schema_version must be 1');
  if (!index.canonical_archive_directory) fail('missing canonical_archive_directory');
  if (!Array.isArray(index.roadmaps) || index.roadmaps.length === 0) fail('roadmaps must be a non-empty array');

  const activeById = new Map();
  for (const entry of index.roadmaps) {
    for (const field of ['roadmap_id', 'version', 'title', 'status', 'path', 'owner', 'updated_on']) {
      if (!entry[field]) fail(`${entry.roadmap_id || '<unknown>'} missing ${field}`);
    }
    if (!STATUS_VALUES.has(entry.status)) fail(`${entry.roadmap_id} has invalid status ${entry.status}`);
    if (!exists(entry.path)) fail(`${entry.roadmap_id} path does not exist: ${entry.path}`);

    if (entry.status === 'active') {
      if (entry.path.startsWith(`${index.canonical_archive_directory}/`)) {
        fail(`${entry.roadmap_id} is active but lives in the outdated archive`);
      }
      if (activeById.has(entry.roadmap_id)) fail(`${entry.roadmap_id} has multiple active entries`);
      activeById.set(entry.roadmap_id, entry.path);
    }

    if (entry.status === 'outdated' && !entry.path.startsWith(`${index.canonical_archive_directory}/`)) {
      fail(`${entry.roadmap_id} is outdated but not stored under ${index.canonical_archive_directory}`);
    }

    for (const linkedField of ['superseded_by', 'points_to']) {
      if (entry[linkedField] && !exists(entry[linkedField])) {
        fail(`${entry.roadmap_id} ${linkedField} path does not exist: ${entry[linkedField]}`);
      }
    }

    for (const supersededPath of entry.supersedes || []) {
      if (!exists(supersededPath)) fail(`${entry.roadmap_id} supersedes missing path: ${supersededPath}`);
    }
  }

  for (const activePath of index.current_operational_roadmaps || []) {
    if (!exists(activePath)) fail(`current operational roadmap missing: ${activePath}`);
    const hasActiveEntry = index.roadmaps.some((entry) => entry.status === 'active' && entry.path === activePath);
    if (!hasActiveEntry) fail(`current operational roadmap lacks active entry: ${activePath}`);
  }

  console.log(`OK roadmap version index: ${index.roadmaps.length} entries`);
}

if (require.main === module) main();

