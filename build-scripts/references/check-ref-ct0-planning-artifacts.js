#!/usr/bin/env node
/**
 * Read-only validator for REF-CT0 planning artifacts.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const REQUIRED_CATEGORIES = [
  'year_1_confirmed',
  'year_1_backfill_candidate',
  'year_2_skeleton_candidate',
  'year_3_skeleton_candidate',
  'duplicate_merge_split_candidate',
  'parked',
  'needs_evidence',
];

const FILES = [
  'reports/reference-planning/REF-CT0-source-authority-boundary.md',
  'reports/reference-planning/REF-CT0-three-year-prototype.md',
  'reports/reference-planning/REF-CT0-mtu-classification.md',
  'reports/reference-planning/REF-CT0-candidate-review-packet.md',
  'references/data/sprints/REF-CT0-mtu-classification.json',
];

function fail(message) {
  console.error(`REF-CT0 planning artifact check failed: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(REPO_ROOT, relPath);
}

function read(relPath) {
  const file = repoPath(relPath);
  if (!fs.existsSync(file)) fail(`missing file: ${relPath}`);
  return fs.readFileSync(file, 'utf8');
}

function requireText(relPath, patterns) {
  const text = read(relPath);
  for (const [label, pattern] of patterns) {
    if (!pattern.test(text)) fail(`${relPath} missing ${label}`);
  }
  return text;
}

function requireProtectedSurfacesClean() {
  const protectedPaths = [
    'references/machine',
    'references/external',
    'references/authored/course-target-exercises.json',
    'references/owned/course-blueprint-v5.md',
    'references/owned/course-blueprint-v5.meta.json',
    'knowledge/three Year blue print.md',
  ];
  const result = spawnSync('git', ['status', '--short', '--', ...protectedPaths], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    fail(`could not inspect protected surfaces: ${result.stderr || result.stdout}`);
  }
  if ((result.stdout || '').trim()) {
    fail(`protected or active source surfaces are dirty:\n${result.stdout.trim()}`);
  }
}

function main() {
  for (const file of FILES) read(file);

  const data = JSON.parse(read('references/data/sprints/REF-CT0-mtu-classification.json'));
  if (data.sprint_id !== 'REF-CT0') fail('JSON sprint_id must be REF-CT0');
  if (data.authority_level !== 'non_authoritative_planning_prototype') {
    fail('JSON must declare non_authoritative_planning_prototype authority level');
  }
  if (data.protected_reference_data_changed !== false) {
    fail('REF-CT0 must not change protected reference data');
  }
  if (!Array.isArray(data.records) || data.records.length < 200) {
    fail('classification JSON must include the full record set');
  }
  for (const category of REQUIRED_CATEGORIES) {
    if (!data.classification_categories.includes(category)) fail(`missing category ${category}`);
    if (!data.summary || !data.summary.by_classification || !(category in data.summary.by_classification)) {
      fail(`missing summary count for ${category}`);
    }
  }
  const requiredSources = [
    'blueprint',
    'targetExercises',
    'units',
    'roughBlueprint',
    'blueprintFlagTriage',
    'needsCoverage',
    'termsCoverage',
    'examGaps',
  ];
  for (const key of requiredSources) {
    if (!data.source_paths || !data.source_paths[key]) fail(`missing source path ${key}`);
  }
  if (data.active_v5_baseline.count_bearing_paragraphs !== 54) fail('active v5 count must be 54');
  if (data.active_v5_baseline.placeholder_count !== 11) fail('active v5 placeholder count must be 11');
  if (!data.rough_source_drift.old_target_exercise_count_claim_seen) fail('rough 49-record drift must be recorded');
  if (!data.rough_source_drift.rough_d04_unresolved_language_seen) fail('rough D04 drift must be recorded');

  const classifications = new Set(data.records.map((record) => record.classification));
  for (const category of REQUIRED_CATEGORIES) {
    if (!classifications.has(category)) fail(`no record classified as ${category}`);
  }

  requireText('reports/reference-planning/REF-CT0-source-authority-boundary.md', [
    ['non-authoritative status', /non-authoritative planning prototype/i],
    ['protected machine boundary', /must not mutate `references\/machine\/`/i],
    ['external boundary', /hand-edit `references\/external\/`/i],
    ['rough source boundary', /rough concept scaffolding/i],
  ]);

  requireText('reports/reference-planning/REF-CT0-three-year-prototype.md', [
    ['non-authoritative status', /non-authoritative planning prototype/i],
    ['v5 four-book baseline', /four-book, four-test-week v5/i],
    ['Year 2 skeleton', /Year 2 Skeleton Candidate/i],
    ['Year 3 skeleton', /Year 3 Skeleton Candidate/i],
  ]);

  requireText('reports/reference-planning/REF-CT0-mtu-classification.md', [
    ['JSON mirror', /REF-CT0-mtu-classification\.json/i],
    ['protected data false', /Protected reference data changed: `false`/i],
    ['placeholder boundary', /does not mark placeholder target exercises as reviewed final/i],
  ]);

  requireText('reports/reference-planning/REF-CT0-candidate-review-packet.md', [
    ['REF-CT1 purpose', /REF-CT1/i],
    ['placeholder question', /placeholder target-exercise records/i],
    ['stop condition protected machine', /Stop if a proposal edits `references\/machine\/`/i],
  ]);

  requireProtectedSurfacesClean();

  console.log(`OK REF-CT0 planning artifacts: ${data.records.length} records`);
}

if (require.main === module) main();
