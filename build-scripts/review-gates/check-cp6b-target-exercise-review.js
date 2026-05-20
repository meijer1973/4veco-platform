#!/usr/bin/env node
/**
 * Validate CP.6b target-exercise review artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected statuses only after a recorded human/roadmap decision
 *   changes CP.6b authority.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const TARGET_EXERCISES = 'references/authored/course-target-exercises.json';
const REVIEW_JSON = 'references/data/sprints/CP.6b-target-exercise-review.json';
const REVIEW_MD = 'reports/reference-planning/CP.6b-target-exercise-review.md';

function fail(message) {
  console.error(`CP.6b target-exercise review check failed: ${message}`);
  process.exit(1);
}

function read(relPath) {
  const file = path.join(ROOT, relPath);
  if (!fs.existsSync(file)) fail(`missing file: ${relPath}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(read(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) fail(`${label}: expected ${expected}, got ${actual}`);
}

function assertTrue(value, label) {
  if (value !== true) fail(`${label}: expected true, got ${value}`);
}

function assertFalse(value, label) {
  if (value !== false) fail(`${label}: expected false, got ${value}`);
}

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) fail(`${label}: missing "${needle}"`);
}

const source = readJson(TARGET_EXERCISES);
const reviewText = read(REVIEW_JSON);
const review = JSON.parse(reviewText);
const markdown = read(REVIEW_MD);

const book1 = source.exercises.filter((record) => record.module === 1);
const migrated = book1.filter((record) => record.record_status === 'migrated_from_v4_needs_v5_review');
const placeholders = book1.filter((record) => record.record_status === 'placeholder_needs_review');
const reviewedFinal = book1.filter((record) => record.record_status === 'reviewed_final');

assertEqual(review.schema_version, 1, 'schema_version');
assertEqual(review.sprint_id, 'CP.6b', 'sprint_id');
assertEqual(review.status, 'target_exercise_review_recorded_not_final', 'status');
assertEqual(review.authority_level, 'non_mutating_year1_target_exercise_review', 'authority_level');
assertFalse(review.cp6_closed, 'cp6_closed');
assertFalse(review.year1_closed, 'year1_closed');
assertFalse(review.protected_reference_data_changed, 'protected_reference_data_changed');
assertFalse(review.lesson_output_changed, 'lesson_output_changed');
assertFalse(review.target_exercise_promotions, 'target_exercise_promotions');
assertFalse(review.placeholder_finalization, 'placeholder_finalization');
assertFalse(review.unit_minting, 'unit_minting');
assertTrue(review.no_protected_mutation_authorized, 'no_protected_mutation_authorized');
assertTrue(review.no_lesson_output_mutation_authorized, 'no_lesson_output_mutation_authorized');
assertTrue(review.no_target_exercise_promotion_authorized, 'no_target_exercise_promotion_authorized');
assertTrue(review.no_placeholder_finalization_authorized, 'no_placeholder_finalization_authorized');
assertTrue(review.no_unit_minting_authorized, 'no_unit_minting_authorized');

assertEqual(review.summary.book1_record_count, book1.length, 'book1_record_count');
assertEqual(review.summary.migrated_needs_review_count, migrated.length, 'migrated_needs_review_count');
assertEqual(review.summary.placeholder_needs_review_count, placeholders.length, 'placeholder_needs_review_count');
assertEqual(review.summary.reviewed_final_count, reviewedFinal.length, 'reviewed_final_count');
assertEqual(review.summary.integration_design_count, placeholders.length, 'integration_design_count');
assertEqual(review.summary.records_promoted_count, 0, 'records_promoted_count');
assertEqual(review.summary.placeholders_finalized_count, 0, 'placeholders_finalized_count');
assertTrue(review.summary.cp6a_lesson_mismatch_resolved, 'cp6a_lesson_mismatch_resolved');

if (!review.decision || typeof review.decision !== 'object') {
  fail('decision object must be present');
}
assertEqual(review.decision.status, 'non_final_review_packet_ready', 'decision.status');
assertFalse(review.decision.final_year1_coverage_allowed_now, 'decision.final_year1_coverage_allowed_now');
assertFalse(review.decision.cp6_closure_allowed_now, 'decision.cp6_closure_allowed_now');
assertFalse(review.decision.registry_mutation_allowed_now, 'decision.registry_mutation_allowed_now');

if (!Array.isArray(review.migrated_records) || review.migrated_records.length !== 9) {
  fail('migrated_records must contain exactly nine records');
}
if (!Array.isArray(review.integration_target_exercise_designs) || review.integration_target_exercise_designs.length !== 3) {
  fail('integration_target_exercise_designs must contain exactly three records');
}

const migratedIds = new Set(migrated.map((record) => record.id));
for (const record of review.migrated_records) {
  if (!migratedIds.has(record.paragraph_id)) fail(`unexpected migrated record ${record.paragraph_id}`);
  assertEqual(record.current_record_status, 'migrated_from_v4_needs_v5_review', `${record.paragraph_id} status`);
  assertEqual(record.review_outcome, 'valid_migration_evidence_not_reviewed_final', `${record.paragraph_id} review_outcome`);
  assertFalse(record.may_promote_to_reviewed_final_now, `${record.paragraph_id} may_promote_to_reviewed_final_now`);
  assertFalse(record.may_count_as_final_coverage_claim_now, `${record.paragraph_id} may_count_as_final_coverage_claim_now`);
  assertFalse(record.registry_mutation_authorized, `${record.paragraph_id} registry_mutation_authorized`);
  if (!Array.isArray(record.required_future_artifacts) || record.required_future_artifacts.length < 4) {
    fail(`${record.paragraph_id} must record required future artifacts`);
  }
}

const placeholderIds = new Set(placeholders.map((record) => record.id));
for (const design of review.integration_target_exercise_designs) {
  if (!placeholderIds.has(design.paragraph_id)) fail(`unexpected integration design ${design.paragraph_id}`);
  assertEqual(design.status, 'draft_integration_design_ready_for_later_teacher_review_not_final', `${design.paragraph_id} design status`);
  assertEqual(design.review_outcome, 'draft_design_not_reviewed_final', `${design.paragraph_id} review outcome`);
  assertFalse(design.introduces_new_theory, `${design.paragraph_id} introduces_new_theory`);
  assertFalse(design.placeholder_finalized, `${design.paragraph_id} placeholder_finalized`);
  assertFalse(design.registry_mutation_authorized, `${design.paragraph_id} registry_mutation_authorized`);
  assertFalse(design.may_promote_to_reviewed_final_now, `${design.paragraph_id} may_promote_to_reviewed_final_now`);
  assertFalse(design.may_count_as_final_coverage_claim_now, `${design.paragraph_id} may_count_as_final_coverage_claim_now`);
  if (!design.target_exercise || !Array.isArray(design.target_exercise.subquestions) || design.target_exercise.subquestions.length < 4) {
    fail(`${design.paragraph_id} must include a concrete target exercise with at least four subquestions`);
  }
  if (!Array.isArray(design.integrated_prior_paragraphs) || design.integrated_prior_paragraphs.length < 3) {
    fail(`${design.paragraph_id} must integrate prior chapter paragraphs`);
  }
}

const design134 = review.integration_target_exercise_designs.find((design) => design.paragraph_id === '1.3.4');
if (!design134) fail('missing 1.3.4 design');
const design134Text = JSON.stringify(design134).toLowerCase();
for (const banned of ['kostenstructuren', 'opbrengsten', 'marginale']) {
  if (design134Text.includes(banned)) fail(`1.3.4 design must not include ${banned}`);
}

const requiredBlocked = [
  'protected reference mutation',
  'lesson output mutation',
  'target-exercise promotion',
  'placeholder replacement',
  'placeholder finalization',
  'unit minting',
  'CP-6 closure',
  'Year-1 closure',
  'student diagnostics',
  'adaptive routing',
  'mastery decisions',
  'automatic sequencing',
  'student-facing AI',
  'summative use',
  'PV projection',
  'PV machine promotion',
  'student-facing generated output',
];

for (const blocked of requiredBlocked) {
  if (!review.blocked_outcomes.includes(blocked)) fail(`blocked_outcomes missing ${blocked}`);
}

assertEqual(review.next_operational_sprint, 'CP.6c', 'next_operational_sprint');

const forbiddenAffirmativeClaims = [
  /CP-6\s+closed/i,
  /Year\s+1\s+closed/i,
  /Year-1\s+closed/i,
  /final\s+coverage\s+allowed/i,
  /reviewed_final\s+promotion\s+authorized/i,
  /target-exercise\s+promotion\s+authorized/i,
  /placeholder\s+finalization\s+authorized/i,
  /protected\s+reference\s+mutation\s+authorized/i,
  /lesson-output\s+mutation\s+authorized/i,
  /lesson\s+output\s+mutation\s+authorized/i,
  /unit\s+minting\s+authorized/i,
  /student-facing\s+generated\s+output\s+authorized/i,
  /student\s+diagnostics\s+authorized/i,
  /adaptive\s+routing\s+authorized/i,
  /mastery\s+decisions\s+authorized/i,
  /automatic\s+sequencing\s+authorized/i,
  /student-facing\s+AI\s+authorized/i,
  /summative\s+use\s+authorized/i,
  /PV\s+projection\s+authorized/i,
  /PV\s+machine\s+promotion\s+authorized/i,
];

for (const [label, text] of [
  ['review JSON', reviewText],
  ['review markdown', markdown],
]) {
  for (const pattern of forbiddenAffirmativeClaims) {
    if (pattern.test(text)) {
      fail(`${label} contains forbidden affirmative claim matching ${pattern}`);
    }
  }
}

for (const needle of [
  'CP-6 not closed',
  'Year 1 not closed',
  'No protected reference mutation',
  'No protected reference mutation, lesson-output mutation, target-exercise promotion',
  'Migrated Records',
  'Gemengde-Opgaven Draft Designs',
  'valid_migration_evidence_not_reviewed_final',
  'draft_design_not_reviewed_final',
  'CP.6c',
]) {
  assertIncludes(markdown, needle, 'review markdown');
}

console.log('OK CP.6b target-exercise review');
