#!/usr/bin/env node
/**
 * Validate CP.6d graph-heavy evidence artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected graph-heavy IDs only after a recorded CP-6/roadmap
 *   decision changes the active-v5 Book 1 evidence scope.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const REVIEW_JSON = 'references/data/sprints/CP.6d-graph-heavy-evidence.json';
const REVIEW_MD = 'reports/reference-planning/CP.6d-graph-heavy-evidence.md';

const EXPECTED_IDS = [
  '1.1.1',
  '1.1.2',
  '1.1.3',
  '1.2.1',
  '1.2.2',
  '1.2.3',
  '1.3.1',
  '1.3.2',
  '1.3.3',
];

function fail(message) {
  console.error(`CP.6d graph-heavy evidence check failed: ${message}`);
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

function assertNotIncludes(text, needle, label) {
  if (text.includes(needle)) fail(`${label}: must not include "${needle}"`);
}

const review = readJson(REVIEW_JSON);
const markdown = read(REVIEW_MD);

assertEqual(review.schema_version, 1, 'schema_version');
assertEqual(review.sprint_id, 'CP.6d', 'sprint_id');
assertEqual(review.status, 'graph_heavy_evidence_ledger_upgraded_not_closing', 'status');
assertEqual(review.authority_level, 'non_mutating_graph_heavy_evidence_upgrade', 'authority_level');
assertFalse(review.cp6_closed, 'cp6_closed');
assertFalse(review.year1_closed, 'year1_closed');
assertFalse(review.protected_reference_data_changed, 'protected_reference_data_changed');
assertFalse(review.lesson_output_changed, 'lesson_output_changed');
assertFalse(review.lesson_quality_ref_hand_patch, 'lesson_quality_ref_hand_patch');
assertFalse(review.companion_review_fabrication, 'companion_review_fabrication');
assertFalse(review.target_exercise_promotions, 'target_exercise_promotions');
assertFalse(review.placeholder_finalization, 'placeholder_finalization');
assertFalse(review.unit_minting, 'unit_minting');
assertFalse(review.student_diagnostics_authorized, 'student_diagnostics_authorized');
assertFalse(review.adaptive_routing_authorized, 'adaptive_routing_authorized');
assertFalse(review.mastery_decisions_authorized, 'mastery_decisions_authorized');
assertFalse(review.automatic_sequencing_authorized, 'automatic_sequencing_authorized');
assertFalse(review.student_facing_ai_authorized, 'student_facing_ai_authorized');
assertFalse(review.summative_use_authorized, 'summative_use_authorized');
assertFalse(review.pv_projection_authorized, 'pv_projection_authorized');
assertFalse(review.pv_machine_promotion_authorized, 'pv_machine_promotion_authorized');
assertFalse(review.student_facing_output_authorized, 'student_facing_output_authorized');
assertTrue(review.no_protected_mutation_authorized, 'no_protected_mutation_authorized');
assertTrue(review.no_lesson_output_mutation_authorized, 'no_lesson_output_mutation_authorized');
assertTrue(review.no_lesson_quality_ref_hand_patch_authorized, 'no_lesson_quality_ref_hand_patch_authorized');
assertTrue(review.no_companion_review_fabrication_authorized, 'no_companion_review_fabrication_authorized');
assertTrue(review.no_target_exercise_promotion_authorized, 'no_target_exercise_promotion_authorized');
assertTrue(review.no_placeholder_finalization_authorized, 'no_placeholder_finalization_authorized');
assertTrue(review.no_unit_minting_authorized, 'no_unit_minting_authorized');
assertTrue(review.no_cp6_closure_authorized, 'no_cp6_closure_authorized');
assertTrue(review.no_year1_closure_authorized, 'no_year1_closure_authorized');

if (!Array.isArray(review.records)) fail('records must be an array');
assertEqual(review.records.length, 9, 'record count');
assertEqual(JSON.stringify(review.graph_heavy_paragraph_ids), JSON.stringify(EXPECTED_IDS), 'graph-heavy id list');
assertEqual(
  JSON.stringify(review.records.map((record) => record.paragraph_id).sort()),
  JSON.stringify(EXPECTED_IDS),
  'record ids',
);

assertEqual(review.summary.graph_heavy_record_count, 9, 'graph_heavy_record_count');
assertEqual(review.summary.current_part_a_review_present_count, 9, 'current_part_a_review_present_count');
assertEqual(review.summary.companion_review_required_now_count, 3, 'companion_review_required_now_count');
assertEqual(review.summary.companion_review_required_and_present_count, 3, 'companion_review_required_and_present_count');
assertEqual(review.summary.current_companion_review_present_count, 3, 'current_companion_review_present_count');
assertEqual(review.summary.quality_ref_schema2_count, 3, 'quality_ref_schema2_count');
assertEqual(review.summary.legacy_quality_ref_count, 6, 'legacy_quality_ref_count');
assertEqual(review.summary.part_a_flag_open_count, 1, 'part_a_flag_open_count');
assertEqual(review.summary.source_lesson_mismatch_count, 0, 'source_lesson_mismatch_count');
assertEqual(review.summary.cp6_closure_ready_count, 0, 'cp6_closure_ready_count');
assertFalse(review.decision.cp6_closure_allowed_now, 'decision.cp6_closure_allowed_now');
assertFalse(review.decision.final_year1_coverage_allowed_now, 'decision.final_year1_coverage_allowed_now');
assertFalse(review.decision.registry_mutation_allowed_now, 'decision.registry_mutation_allowed_now');
assertFalse(review.decision.lesson_mutation_allowed_now, 'decision.lesson_mutation_allowed_now');

for (const record of review.records) {
  assertTrue(record.graph_heavy, `${record.paragraph_id} graph_heavy`);
  assertFalse(record.may_count_as_cp6_closure_evidence_now, `${record.paragraph_id} may_count_as_cp6_closure_evidence_now`);
  assertFalse(record.protected_reference_mutation_authorized_now, `${record.paragraph_id} protected_reference_mutation_authorized_now`);
  assertFalse(record.lesson_output_mutation_authorized_now, `${record.paragraph_id} lesson_output_mutation_authorized_now`);
  assertFalse(record.target_exercise_promotion_authorized_now, `${record.paragraph_id} target_exercise_promotion_authorized_now`);
  assertFalse(record.placeholder_finalization_authorized_now, `${record.paragraph_id} placeholder_finalization_authorized_now`);
  assertFalse(record.unit_minting_authorized_now, `${record.paragraph_id} unit_minting_authorized_now`);
  assertTrue(record.part_a_review.present, `${record.paragraph_id} part_a_review.present`);
  if (record.lesson_path.includes('/archive/')) fail(`${record.paragraph_id} uses archived lesson path`);
  if (record.paragraph_id === '1.3.2') {
    assertIncludes(record.lesson_path, '1.3.2 Marktevenwicht', '1.3.2 live path');
    assertEqual(
      record.source_lesson_alignment_status,
      'aligned_after_l_cp6a_with_carried_conditions',
      '1.3.2 source_lesson_alignment_status',
    );
  }
  if (record.paragraph_id === '1.3.3') {
    assertIncludes(record.lesson_path, '1.3.3 Verschuivingen en nieuw evenwicht', '1.3.3 live path');
    assertEqual(
      record.source_lesson_alignment_status,
      'aligned_after_l_cp6a_with_carried_conditions',
      '1.3.3 source_lesson_alignment_status',
    );
  }
  if (record.companion_review.required_now && !record.companion_review.present) {
    fail(`${record.paragraph_id} requires companion review but none is present`);
  }
  if (record.target_exercise_status === 'reviewed_final') {
    fail(`${record.paragraph_id} incorrectly has reviewed_final status in CP.6d`);
  }
}

assertIncludes(markdown, 'CP.6d Book 1 Graph-Heavy Evidence Upgrade', 'markdown title');
assertIncludes(markdown, 'Records allowed as CP-6 closure evidence now: 0', 'markdown closure count');
assertIncludes(markdown, 'Run CP.6e focused `1.1.3` Part A re-review next', 'markdown next action');
assertIncludes(markdown, '1.3.2` is `Marktevenwicht', 'markdown 1.3.2 live state');
assertIncludes(markdown, '1.3.3` is `Verschuivingen en nieuw evenwicht', 'markdown 1.3.3 live state');
assertNotIncludes(markdown, '1.3.2 Kostenstructuren', 'markdown stale 1.3.2 title');
assertNotIncludes(markdown, '1.3.3 Opbrengsten', 'markdown stale 1.3.3 title');

console.log('CP.6d graph-heavy evidence artifacts validated.');
