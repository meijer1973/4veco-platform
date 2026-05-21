#!/usr/bin/env node
/**
 * Validate CP.6e focused 1.1.3 Part A re-review artifacts.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const REVIEW_JSON = 'references/data/sprints/CP.6e-113-part-a-rereview.json';
const REVIEW_MD = 'reports/reference-planning/CP.6e-113-part-a-rereview.md';
const HANDOFF_MD = 'reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md';

function fail(message) {
  console.error(`CP.6e 1.1.3 Part A re-review check failed: ${message}`);
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

const review = readJson(REVIEW_JSON);
const markdown = read(REVIEW_MD);
const handoff = read(HANDOFF_MD);

assertEqual(review.schema_version, 1, 'schema_version');
assertEqual(review.sprint_id, 'CP.6e', 'sprint_id');
assertEqual(review.status, 'focused_part_a_rereview_recorded_not_closing', 'status');
assertEqual(review.authority_level, 'non_mutating_focused_part_a_rereview', 'authority_level');
assertFalse(review.cp6_closed, 'cp6_closed');
assertFalse(review.year1_closed, 'year1_closed');
assertFalse(review.cp6_closure_allowed_now, 'cp6_closure_allowed_now');
assertFalse(review.year1_closure_allowed_now, 'year1_closure_allowed_now');
assertFalse(review.protected_reference_data_changed, 'protected_reference_data_changed');
assertFalse(review.lesson_output_changed, 'lesson_output_changed');
assertFalse(review.lesson_quality_ref_hand_patch, 'lesson_quality_ref_hand_patch');
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
assertTrue(review.no_target_exercise_promotion_authorized, 'no_target_exercise_promotion_authorized');
assertTrue(review.no_placeholder_finalization_authorized, 'no_placeholder_finalization_authorized');
assertTrue(review.no_unit_minting_authorized, 'no_unit_minting_authorized');
assertTrue(review.no_cp6_closure_authorized, 'no_cp6_closure_authorized');
assertTrue(review.no_year1_closure_authorized, 'no_year1_closure_authorized');

assertEqual(review.focused_paragraph.paragraph_id, '1.1.3', 'focused paragraph id');
assertEqual(review.quality_ref.part_a_verdict, 'FLAG', 'quality ref Part A verdict baseline');
assertEqual(review.decision.status, 'failed_clearance', 'decision.status');
assertFalse(review.decision.part_a_flag_cleared, 'decision.part_a_flag_cleared');
assertTrue(
  review.decision.cp6_unconditioned_closure_blocked_by_113_part_a,
  'decision.cp6_unconditioned_closure_blocked_by_113_part_a',
);
assertEqual(
  JSON.stringify(review.checks.figure_sequence.first_seen_sequence),
  JSON.stringify([1, 3, 2]),
  'figure first-use sequence',
);
assertFalse(review.checks.figure_sequence.sequential_first_use, 'figure sequence sequential_first_use');
assertTrue(review.checks.repeated_worked_example.present, 'repeated worked example present');
assertTrue(
  review.checks.repeated_worked_example.accepted_as_non_blocking,
  'repeated worked example accepted_as_non_blocking',
);
assertFalse(review.checks.repeated_worked_example.is_blocking, 'repeated worked example is_blocking');

assertIncludes(markdown, 'Status: failed_clearance', 'markdown status');
assertIncludes(markdown, 'Part A flag cleared: false', 'markdown flag state');
assertIncludes(markdown, '1 -> 3 -> 2', 'markdown figure order');
assertIncludes(markdown, 'CP-6 closure allowed now: false', 'markdown closure');
assertIncludes(handoff, 'Lesson-side remediation is required', 'handoff remediation need');
assertIncludes(handoff, 'Figuur 3` before `Figuur 2', 'handoff exact issue');
assertIncludes(handoff, 'authorized lesson-side remediation/regeneration workflow', 'handoff route');

console.log('CP.6e 1.1.3 Part A re-review artifacts validated.');
