#!/usr/bin/env node
/**
 * Validate REF-CP6 remediation/readiness artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected counts only when the governing sprint plan changes the
 *   REF-CT1/REF-CT2 baseline and records the reason.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-CP6-year-1-paragraph-coverage';
const READINESS_JSON = 'references/data/sprints/REF-CP6-remediation-readiness.json';
const READINESS_REPORT = 'reports/reference-planning/REF-CP6-remediation-readiness.md';
const ROUTING_REPORT = 'reports/reference-planning/REF-CP6-blocker-routing.md';
const REVIEW_PACKET = `reports/review-gates/${GATE_ID}/review-packet.md`;
const REVIEW_PACKET_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;

function fail(message) {
  console.error(`REF-CP6 readiness check failed: ${message}`);
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

function assertIncludes(text, needle, label) {
  if (!text.includes(needle)) fail(`${label}: missing "${needle}"`);
}

function ids(items) {
  return items.map((item) => item.paragraph_id || item.id || item.gate_id || item.label);
}

const readiness = readJson(READINESS_JSON);
const packetJson = readJson(REVIEW_PACKET_JSON);
const readinessReport = read(READINESS_REPORT);
const routingReport = read(ROUTING_REPORT);
const packetMd = read(REVIEW_PACKET);

assertEqual(readiness.schema_version, 1, 'schema_version');
assertEqual(readiness.sprint_id, 'REF-CP6', 'sprint_id');
assertEqual(readiness.authority_level, 'non_mutating_cp6_review_readiness', 'authority_level');
assertEqual(readiness.gate_id, GATE_ID, 'gate_id');
assertEqual(readiness.protected_reference_data_changed, false, 'protected_reference_data_changed');
assertEqual(readiness.lesson_output_changed, false, 'lesson_output_changed');
assertEqual(readiness.no_cli_mutation_authorized, true, 'no_cli_mutation_authorized');
assertEqual(readiness.no_cp6_closure_authorized, true, 'no_cp6_closure_authorized');
assertEqual(readiness.human_gate_completed, false, 'human_gate_completed');

assertEqual(readiness.summary.active_v5_paragraph_count, 12, 'active v5 paragraph count');
assertEqual(readiness.summary.cp6_quality_ready_count, 0, 'CP-6 quality-ready count');
assertEqual(readiness.summary.records_with_blockers_count, 12, 'records with blockers count');
assertEqual(readiness.summary.placeholder_count, 3, 'placeholder count');
assertEqual(readiness.summary.source_lesson_mismatch_count, 2, 'source/lesson mismatch count');
assertEqual(readiness.summary.backfill_candidate_count, 9, 'backfill candidate count');
assertEqual(readiness.summary.legacy_quality_ref_count, 9, 'legacy quality-ref count');
assertEqual(readiness.summary.part_a_flag_count, 1, 'Part A flag count');
assertEqual(readiness.summary.migrated_needs_final_review_count, 9, 'migrated records needing final review count');
assertEqual(readiness.summary.planned_review_question_count, 9, 'planned review question count');
assertEqual(readiness.summary.cp6_closure_status, 'blocked_not_ready_for_closure', 'CP-6 closure status');
assertEqual(readiness.summary.cp6_human_review_status, 'packet_ready_not_closed', 'CP-6 human-review status');

if (!Array.isArray(readiness.decision_lanes) || readiness.decision_lanes.length < 7) {
  fail('decision_lanes must include at least seven lanes');
}

const lanes = new Map(readiness.decision_lanes.map((lane) => [lane.lane_id, lane]));
for (const laneId of [
  'source_lesson_alignment',
  'placeholder_target_exercises',
  'backfill_candidates',
  'legacy_review_evidence',
  'part_a_l16r_flag',
  'target_exercise_final_review',
  'formal_cp6_human_gate',
]) {
  if (!lanes.has(laneId)) fail(`missing decision lane ${laneId}`);
}

for (const id of ['1.3.2', '1.3.3']) {
  if (!ids(lanes.get('source_lesson_alignment').items).includes(id)) {
    fail(`source_lesson_alignment lane must include ${id}`);
  }
}
for (const id of ['1.1.4', '1.2.4', '1.3.4']) {
  if (!ids(lanes.get('placeholder_target_exercises').items).includes(id)) {
    fail(`placeholder_target_exercises lane must include ${id}`);
  }
}
if (lanes.get('backfill_candidates').item_count !== 9) fail('backfill lane must contain nine candidates');
if (lanes.get('legacy_review_evidence').item_count !== 9) fail('legacy review lane must contain nine records');
if (!ids(lanes.get('part_a_l16r_flag').items).includes('1.1.3')) fail('Part A/L1.6R lane must include 1.1.3');
if (lanes.get('target_exercise_final_review').item_count !== 9) fail('target-exercise final review lane must contain nine migrated records');

if (!Array.isArray(readiness.paragraph_routes) || readiness.paragraph_routes.length !== 12) {
  fail('paragraph_routes must contain exactly 12 records');
}
for (const route of readiness.paragraph_routes) {
  if (route.closure_ready !== false) fail(`${route.paragraph_id} must not be closure_ready`);
  if (!Array.isArray(route.routed_lanes) || route.routed_lanes.length === 0) {
    fail(`${route.paragraph_id} must be routed to at least one lane`);
  }
}

assertEqual(packetJson.gate_id, GATE_ID, 'packet gate_id');
assertEqual(packetJson.status, 'review_packet_ready_not_closed', 'packet status');
assertEqual(packetJson.human_interview_completed, false, 'packet human_interview_completed');
assertEqual(packetJson.gate_closure_completed, false, 'packet gate_closure_completed');
if (!Array.isArray(packetJson.review_questions) || packetJson.review_questions.length < 8) {
  fail('review packet must include at least eight review questions');
}
for (const question of packetJson.review_questions) {
  if (!question.id || !question.question || !Array.isArray(question.options) || question.options.length < 3) {
    fail(`review question ${question.id || '?'} is incomplete`);
  }
  assertIncludes(packetMd, question.id, `review packet markdown question ${question.id}`);
}

for (const text of [readinessReport, routingReport, packetMd]) {
  assertIncludes(text, 'No CLI mutation authorized', 'mutation boundary');
  assertIncludes(text, 'CP-6 not closed', 'CP-6 closure boundary');
  assertIncludes(text, 'Year 1 not closed', 'Year-1 closure boundary');
}
assertIncludes(packetMd, 'full question list before starting', 'future interview protocol');
assertIncludes(packetMd, 'one question at a time', 'future interview protocol');
assertIncludes(packetMd, 'explicit human confirmation', 'future interview protocol');

for (const forbidden of ['student diagnostics', 'adaptive routing', 'student-facing AI', 'summative use', 'PV projection']) {
  if (!JSON.stringify(readiness.not_allowed_use).includes(forbidden)) {
    fail(`not_allowed_use must include ${forbidden}`);
  }
}

console.log('OK REF-CP6 remediation readiness');
