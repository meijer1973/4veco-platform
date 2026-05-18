#!/usr/bin/env node
/**
 * Validates the active v5 target-exercise registry created by L1.5Q.
 *
 * The checker protects the new source-of-truth seam: v5 must have exact book
 * counts, no count-bearing test prep, explicit gemengde-opgaven records, and
 * visible placeholder statuses where records are not reviewed final.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_PATH = 'references/authored/course-target-exercises.json';
const EXPECTED_COUNTS = { 1: 12, 2: 12, 3: 14, 4: 16 };
const EXPECTED_TOTAL = 54;
const EXPECTED_SOURCE = 'references/owned/course-blueprint-v5.md';
const ALLOWED_STATUSES = new Set([
  'reviewed_final',
  'migrated_from_v4_needs_v5_review',
  'placeholder_needs_review',
]);
const ALLOWED_KINDS = new Set(['theory', 'gemengde_opgaven']);

function repoPath(relPath) {
  return path.isAbsolute(relPath) ? relPath : path.join(REPO_ROOT, relPath);
}

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(repoPath(relPath), 'utf8'));
}

function readText(relPath) {
  return fs.readFileSync(repoPath(relPath), 'utf8');
}

function countByBook(exercises) {
  const counts = {};
  for (const exercise of exercises) {
    counts[exercise.module] = (counts[exercise.module] || 0) + 1;
  }
  return counts;
}

function validate(data) {
  const errors = [];
  const exercises = data.exercises || [];

  if (data.schema_version !== 1) errors.push('schema_version must be 1');
  if (data.blueprint_version !== 'v5') errors.push('blueprint_version must be v5');
  if (data.blueprint_source !== EXPECTED_SOURCE) {
    errors.push(`blueprint_source must be ${EXPECTED_SOURCE}`);
  }
  if (!data.test_preparation_policy || data.test_preparation_policy.count_bearing !== false) {
    errors.push('test_preparation_policy.count_bearing must be false');
  }
  if (data.test_preparation_policy && data.test_preparation_policy.status !== 'web_only') {
    errors.push('test_preparation_policy.status must be web_only');
  }
  const blueprintPath = data.blueprint_source || EXPECTED_SOURCE;
  if (!fs.existsSync(repoPath(blueprintPath))) {
    errors.push(`missing active blueprint source ${blueprintPath}`);
  }
  const blueprintText = fs.existsSync(repoPath(blueprintPath)) ? readText(blueprintPath) : '';
  if (blueprintText.includes('Phase A source-of-truth scaffold')) {
    errors.push('active v5 blueprint still says Phase A source-of-truth scaffold');
  }
  if (!Array.isArray(exercises)) errors.push('exercises must be an array');
  if (exercises.length !== EXPECTED_TOTAL) {
    errors.push(`expected ${EXPECTED_TOTAL} count-bearing records, got ${exercises.length}`);
  }

  const counts = countByBook(exercises);
  for (const [book, expected] of Object.entries(EXPECTED_COUNTS)) {
    if ((counts[book] || 0) !== expected) {
      errors.push(`Book ${book} expected ${expected} records, got ${counts[book] || 0}`);
    }
  }

  const seen = new Set();
  let mixedCount = 0;
  for (const exercise of exercises) {
    const label = exercise.id || '<missing id>';
    if (!exercise.id || seen.has(exercise.id)) errors.push(`duplicate or missing id: ${label}`);
    seen.add(exercise.id);
    if (!Number.isInteger(exercise.module) || !Number.isInteger(exercise.chapter) || !Number.isInteger(exercise.paragraph)) {
      errors.push(`${label}: module/chapter/paragraph must be integers`);
    }
    if (!ALLOWED_KINDS.has(exercise.paragraph_kind)) {
      errors.push(`${label}: invalid paragraph_kind ${exercise.paragraph_kind}`);
    }
    if (typeof exercise.introduces_new_theory !== 'boolean') {
      errors.push(`${label}: introduces_new_theory must be boolean`);
    }
    if (!ALLOWED_STATUSES.has(exercise.record_status)) {
      errors.push(`${label}: invalid record_status ${exercise.record_status}`);
    }
    if (!String(exercise.source_ref || '').startsWith(`${EXPECTED_SOURCE} §${exercise.id}`)) {
      errors.push(`${label}: source_ref must point to ${EXPECTED_SOURCE} §${exercise.id}`);
    }
    if (blueprintText && !blueprintText.includes(`§${exercise.id} -`)) {
      errors.push(`${label}: active blueprint missing paragraph anchor`);
    }
    if (String(exercise.source_ref || '').includes('course-blueprint-v4.md') || String(exercise.source_ref || '').includes('knowledge/course_blueprint_v4.md')) {
      errors.push(`${label}: stale v4 source_ref`);
    }
    if (exercise.paragraph_kind === 'gemengde_opgaven') {
      mixedCount++;
      if (exercise.introduces_new_theory !== false) {
        errors.push(`${label}: gemengde_opgaven must not introduce new theory`);
      }
      if (exercise.record_status === 'reviewed_final') {
        errors.push(`${label}: gemengde_opgaven cannot be reviewed_final during Phase A`);
      }
    }
    if (exercise.record_status === 'placeholder_needs_review') {
      if (!exercise.placeholder_reason) errors.push(`${label}: placeholder_needs_review requires placeholder_reason`);
      if (!exercise.target_exercise || exercise.target_exercise.placeholder !== true) {
        errors.push(`${label}: placeholder_needs_review requires target_exercise.placeholder=true`);
      }
    }
    if (exercise.record_status !== 'reviewed_final' && exercise.v5_migration && exercise.v5_migration.review_required_before_final !== true) {
      errors.push(`${label}: non-final record must require review before final`);
    }
    if (exercise.paragraph_kind === 'test_preparation') {
      errors.push(`${label}: test preparation must not be count-bearing`);
    }
  }
  if (mixedCount === 0) errors.push('expected count-bearing gemengde_opgaven records');
  return errors;
}

function main() {
  const relPath = process.argv[2] || DEFAULT_PATH;
  const data = readJson(relPath);
  const errors = validate(data);
  if (errors.length) {
    for (const error of errors) console.error(`ERROR ${error}`);
    console.error(`${errors.length} target-exercise v5 validation error(s).`);
    process.exit(1);
  }
  const counts = countByBook(data.exercises || []);
  console.log(`OK target exercises v5: total=${(data.exercises || []).length}, books=${Object.entries(counts).map(([book, count]) => `${book}:${count}`).join(', ')}`);
}

if (require.main === module) main();

module.exports = { validate, EXPECTED_COUNTS, EXPECTED_TOTAL, EXPECTED_SOURCE };
