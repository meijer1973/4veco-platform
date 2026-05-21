#!/usr/bin/env node
/**
 * Validate CP.6f focused 1.1.3 Part A remediation recheck artifacts.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const LESSON_REPO = path.resolve(ROOT, '..', '4veco-lessen');
const REVIEW_JSON = 'references/data/sprints/CP.6f-113-part-a-recheck.json';
const REVIEW_MD = 'reports/reference-planning/CP.6f-113-part-a-recheck.md';

function fail(message) {
  console.error(`CP.6f 1.1.3 Part A recheck failed: ${message}`);
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

function git(command, cwd = ROOT) {
  try {
    return execSync(command, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch (_error) {
    return 'unavailable';
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

function assertSequence(value, expected, label) {
  if (JSON.stringify(value) !== JSON.stringify(expected)) {
    fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(value)}`);
  }
}

const review = readJson(REVIEW_JSON);
const markdown = read(REVIEW_MD);

assertEqual(review.schema_version, 1, 'schema_version');
assertEqual(review.sprint_id, 'CP.6f', 'sprint_id');
assertEqual(review.status, 'focused_lesson_remediation_recheck_recorded_not_closing', 'status');
assertEqual(review.authority_level, 'non_mutating_lesson_remediation_recheck', 'authority_level');
assertEqual(review.lesson_handoff_sprint, 'L-CP6E', 'lesson_handoff_sprint');
assertEqual(review.lesson_repo.commit, git('git rev-parse HEAD', LESSON_REPO), 'lesson repo commit');
assertFalse(review.lesson_repo.dirty, 'lesson repo dirty');
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
assertFalse(review.machine_registry_mutation, 'machine_registry_mutation');
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
assertEqual(review.quality_ref.part_a_verdict, 'PASS WITH FLAGS', 'quality ref Part A verdict');
assertFalse(review.quality_ref.open_figure_flag, 'quality ref open figure flag');
assertTrue(review.quality_ref.fixed_figure_flag, 'quality ref fixed figure flag');
assertEqual(review.decision.status, 'cleared', 'decision.status');
assertTrue(review.decision.part_a_blocker_cleared, 'decision.part_a_blocker_cleared');
assertFalse(
  review.decision.cp6_unconditioned_closure_blocked_by_113_part_a,
  'decision.cp6_unconditioned_closure_blocked_by_113_part_a',
);
assertSequence(review.checks.markdown_figure_sequence.first_seen_sequence, [1, 2, 3], 'markdown sequence');
assertSequence(review.checks.html_figure_sequence.first_seen_sequence, [1, 2, 3], 'html sequence');
assertSequence(review.checks.pdf_figure_sequence.first_seen_sequence, [1, 2, 3], 'pdf sequence');
assertTrue(review.checks.markdown_figure_sequence.sequential_first_use, 'markdown sequential');
assertTrue(review.checks.html_figure_sequence.sequential_first_use, 'html sequential');
assertTrue(review.checks.pdf_figure_sequence.sequential_first_use, 'pdf sequential');
assertTrue(review.checks.repeated_worked_example_accepted_non_blocking, 'repeated worked example non-blocking');
assertTrue(review.checks.l_cp6e_handoff_ready, 'L-CP6E handoff ready');
assertTrue(review.checks.l_cp6e_closed_pass_with_flags, 'L-CP6E closed pass with flags');

assertIncludes(markdown, 'Status: cleared', 'markdown status');
assertIncludes(markdown, 'Part A figure-numbering blocker cleared: true', 'markdown flag state');
assertIncludes(markdown, '1 -> 2 -> 3', 'markdown figure order');
assertIncludes(markdown, 'CP-6 closure allowed now: false', 'markdown closure boundary');
assertIncludes(markdown, 'It does not close CP-6 or Year 1', 'markdown non-closure');

console.log('CP.6f 1.1.3 Part A recheck artifacts validated.');
