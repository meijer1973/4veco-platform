#!/usr/bin/env node
/**
 * Validate CP.6c MTU backfill classification artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected classifications only after a recorded human/roadmap
 *   decision changes CP.6c authority or the source candidate list.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const REF_CT1 = 'references/data/sprints/REF-CT1-year1-coverage.json';
const UNITS = 'references/machine/micro-teaching-units.json';
const REVIEW_JSON = 'references/data/sprints/CP.6c-mtu-backfill-classification.json';
const REVIEW_MD = 'reports/reference-planning/CP.6c-mtu-backfill-classification.md';

const expectedClassifications = {
  'missing_flag:1.1.3:1': 'existing_unit_mapping',
  'missing_flag:1.1.3:2': 'existing_unit_mapping',
  'missing_flag:1.2.2:1': 'merge_candidate',
  'missing_flag:1.2.3:1': 'existing_unit_mapping',
  'missing_flag:1.2.3:2': 'existing_unit_mapping',
  'missing_flag:1.2.3:3': 'defer_candidate',
  'missing_flag:1.3.1:1': 'existing_unit_mapping',
  'missing_flag:1.3.2:1': 'existing_unit_mapping',
  'missing_flag:1.3.3:1': 'true_missing_unit',
};

const allowedClassifications = new Set([
  'existing_unit_mapping',
  'true_missing_unit',
  'merge_candidate',
  'defer_candidate',
]);

function fail(message) {
  console.error(`CP.6c MTU backfill classification check failed: ${message}`);
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

const source = readJson(REF_CT1);
const units = readJson(UNITS);
const unitList = units.units || units.micro_teaching_units || units;
const unitsById = new Map(unitList.map((unit) => [unit.id, unit]));
const reviewText = read(REVIEW_JSON);
const review = JSON.parse(reviewText);
const markdown = read(REVIEW_MD);

const sourceFlags = source.missing_flags || [];
const expectedIds = Object.keys(expectedClassifications).sort();
const actualSourceIds = sourceFlags.map((flag) => flag.record_id).sort();

assertEqual(sourceFlags.length, 9, 'REF-CT1 missing flag count');
assertEqual(JSON.stringify(actualSourceIds), JSON.stringify(expectedIds), 'REF-CT1 missing flag IDs');

assertEqual(review.schema_version, 1, 'schema_version');
assertEqual(review.sprint_id, 'CP.6c', 'sprint_id');
assertEqual(review.status, 'mtu_backfill_classification_recorded_not_mutating', 'status');
assertEqual(review.authority_level, 'non_mutating_year1_mtu_backfill_classification', 'authority_level');
assertFalse(review.cp6_closed, 'cp6_closed');
assertFalse(review.year1_closed, 'year1_closed');
assertFalse(review.protected_reference_data_changed, 'protected_reference_data_changed');
assertFalse(review.lesson_output_changed, 'lesson_output_changed');
assertFalse(review.target_exercise_promotions, 'target_exercise_promotions');
assertFalse(review.placeholder_finalization, 'placeholder_finalization');
assertFalse(review.unit_minting, 'unit_minting');
assertFalse(review.machine_registry_mutation, 'machine_registry_mutation');
assertTrue(review.no_protected_mutation_authorized, 'no_protected_mutation_authorized');
assertTrue(review.no_lesson_output_mutation_authorized, 'no_lesson_output_mutation_authorized');
assertTrue(review.no_target_exercise_promotion_authorized, 'no_target_exercise_promotion_authorized');
assertTrue(review.no_placeholder_finalization_authorized, 'no_placeholder_finalization_authorized');
assertTrue(review.no_unit_minting_authorized, 'no_unit_minting_authorized');
assertTrue(review.no_cli_mutation_authorized, 'no_cli_mutation_authorized');

if (!Array.isArray(review.classifications) || review.classifications.length !== 9) {
  fail('classifications must contain exactly nine records');
}

const reviewIds = review.classifications.map((record) => record.record_id).sort();
assertEqual(JSON.stringify(reviewIds), JSON.stringify(expectedIds), 'classification IDs');
assertEqual(review.summary.candidate_count, 9, 'candidate_count');
assertEqual(review.summary.by_classification.existing_unit_mapping, 6, 'existing_unit_mapping count');
assertEqual(review.summary.by_classification.true_missing_unit, 1, 'true_missing_unit count');
assertEqual(review.summary.by_classification.merge_candidate, 1, 'merge_candidate count');
assertEqual(review.summary.by_classification.defer_candidate, 1, 'defer_candidate count');
assertEqual(review.summary.mutations_authorized_now_count, 0, 'mutations_authorized_now_count');
assertEqual(review.summary.later_cli_mutation_candidate_count, 1, 'later_cli_mutation_candidate_count');
assertEqual(review.source_evidence.d04_status_records_seen, 1, 'd04_status_records_seen');

for (const record of review.classifications) {
  if (!allowedClassifications.has(record.cp6c_classification)) {
    fail(`${record.record_id} has invalid classification ${record.cp6c_classification}`);
  }
  assertEqual(
    record.cp6c_classification,
    expectedClassifications[record.record_id],
    `${record.record_id} classification`,
  );
  assertFalse(record.mutation_authorized_now, `${record.record_id} mutation_authorized_now`);
  assertFalse(
    record.protected_reference_mutation_authorized_now,
    `${record.record_id} protected_reference_mutation_authorized_now`,
  );
  assertFalse(
    record.may_count_as_cp6_closure_evidence_now,
    `${record.record_id} may_count_as_cp6_closure_evidence_now`,
  );
  if (typeof record.rationale !== 'string' || record.rationale.length < 40) {
    fail(`${record.record_id} must include a substantive rationale`);
  }
  if (typeof record.next_action !== 'string' || record.next_action.length < 20) {
    fail(`${record.record_id} must include a next action`);
  }

  if (record.cp6c_classification === 'existing_unit_mapping') {
    if (!Array.isArray(record.mapped_unit_ids) || record.mapped_unit_ids.length < 1) {
      fail(`${record.record_id} existing mapping must include mapped_unit_ids`);
    }
    for (const unitId of record.mapped_unit_ids) {
      const unit = unitsById.get(unitId);
      if (!unit) fail(`${record.record_id} maps to unknown unit ${unitId}`);
      if (unit.deprecated) fail(`${record.record_id} maps to deprecated unit ${unitId}`);
    }
  }

  if (record.record_id === 'missing_flag:1.2.2:1') {
    assertEqual(record.cp6c_classification, 'merge_candidate', 'normal/inferior classification');
    if (!record.deprecated_context_unit_ids.includes('D04')) {
      fail('normal/inferior candidate must record D04 as deprecated context');
    }
    if (record.mapped_unit_ids.includes('D04')) {
      fail('normal/inferior candidate must not actively map to deprecated D04');
    }
  }

  if (record.record_id === 'missing_flag:1.3.3:1') {
    assertEqual(record.cp6c_classification, 'true_missing_unit', 'simultaneous-shift classification');
    assertTrue(record.later_cli_mutation_candidate, 'simultaneous-shift later_cli_mutation_candidate');
    if (!record.candidate_future_unit_concept) fail('simultaneous-shift candidate must name future unit concept');
  } else {
    assertFalse(record.later_cli_mutation_candidate, `${record.record_id} later_cli_mutation_candidate`);
  }
}

const requiredBlocked = [
  'protected reference mutation',
  'lesson output mutation',
  'target-exercise promotion',
  'placeholder replacement',
  'placeholder finalization',
  'unit minting',
  'machine registry mutation',
  'CLI mutation authorization',
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

assertEqual(review.next_operational_sprint, 'CP.6d', 'next_operational_sprint');

const forbiddenAffirmativeClaims = [
  /CP-6\s+closed/i,
  /Year\s+1\s+closed/i,
  /Year-1\s+closed/i,
  /protected\s+reference\s+mutation\s+authorized/i,
  /lesson-output\s+mutation\s+authorized/i,
  /lesson\s+output\s+mutation\s+authorized/i,
  /unit\s+minting\s+authorized/i,
  /machine\s+registry\s+mutation\s+authorized/i,
  /CLI\s+mutation\s+authorized/i,
  /target-exercise\s+promotion\s+authorized/i,
  /placeholder\s+finalization\s+authorized/i,
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
  'existing_unit_mapping',
  'true_missing_unit',
  'merge_candidate',
  'defer_candidate',
  'A45',
  'A46',
  'A47',
  'A48',
  'A49',
  'A51',
  'D04',
  'CP.6d',
]) {
  assertIncludes(markdown, needle, 'review markdown');
}

console.log('OK CP.6c MTU backfill classification');
