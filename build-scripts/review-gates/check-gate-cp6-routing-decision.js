#!/usr/bin/env node
/**
 * Validate GATE-CP6 routing-decision artifacts.
 *
 * HOW TO ADAPT:
 * - Keep this validator read-only.
 * - Update expected lanes only when a later recorded human gate changes the
 *   CP-6 remediation routing.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const GATE_ID = 'GATE-CP6-year-1-paragraph-coverage';
const GATE_DIR = path.join('reports', 'review-gates', GATE_ID);
const INTERVIEW_JSON = path.join(GATE_DIR, 'human-interview.json');
const INTERVIEW_MD = path.join(GATE_DIR, 'human-interview.md');
const ROUTING_JSON = path.join(GATE_DIR, 'gate-routing-decision.json');
const ROUTING_MD = path.join(GATE_DIR, 'gate-routing-decision.md');
const LANES_JSON = path.join(GATE_DIR, 'remediation-lanes.json');
const LANES_MD = path.join(GATE_DIR, 'remediation-lanes.md');
const CLOSURE_JSON = path.join(GATE_DIR, 'gate-closure.json');

function fail(message) {
  console.error(`GATE-CP6 routing check failed: ${message}`);
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

function assertFalse(value, label) {
  if (value !== false) fail(`${label}: expected false, got ${value}`);
}

function assertTrue(value, label) {
  if (value !== true) fail(`${label}: expected true, got ${value}`);
}

if (fs.existsSync(path.join(ROOT, CLOSURE_JSON))) {
  fail(`${CLOSURE_JSON} must not exist before CP-6 closure is explicitly authorized`);
}

const interview = readJson(INTERVIEW_JSON);
const routing = readJson(ROUTING_JSON);
const lanes = readJson(LANES_JSON);
const interviewMd = read(INTERVIEW_MD);
const routingMd = read(ROUTING_MD);
const lanesMd = read(LANES_MD);

assertEqual(interview.gate_id, GATE_ID, 'interview gate_id');
assertEqual(interview.sprint_id, 'GATE-CP6', 'interview sprint_id');
assertEqual(interview.status, 'routing_decision_recorded_not_closed', 'interview status');
assertEqual(interview.mode, 'batch_human_review_response_after_full_question_list', 'interview mode');
assertTrue(interview.review_questions_shown_first, 'review questions shown first');
assertFalse(interview.cp6_closed, 'interview cp6_closed');
assertFalse(interview.year1_closed, 'interview year1_closed');
assertFalse(interview.protected_reference_data_changed, 'interview protected_reference_data_changed');
assertFalse(interview.lesson_output_changed, 'interview lesson_output_changed');
assertTrue(interview.no_cli_mutation_authorized, 'interview no_cli_mutation_authorized');
assertTrue(interview.no_protected_mutation_authorized, 'interview no_protected_mutation_authorized');
assertTrue(interview.no_lesson_output_mutation_authorized, 'interview no_lesson_output_mutation_authorized');

if (!Array.isArray(interview.answers) || interview.answers.length !== 9) {
  fail('human-interview.json must record exactly nine answers');
}
for (let index = 1; index <= 9; index += 1) {
  const questionId = `CP6-Q${index}`;
  if (!interview.answers.some((answer) => answer.question_id === questionId)) {
    fail(`missing answer ${questionId}`);
  }
  assertIncludes(interviewMd, questionId, `human-interview.md ${questionId}`);
}

assertEqual(routing.gate_id, GATE_ID, 'routing gate_id');
assertEqual(routing.status, 'routing_decision_recorded_not_closed', 'routing status');
assertFalse(routing.closure_proposal_drafted, 'routing closure_proposal_drafted');
assertFalse(routing.gate_closure_completed, 'routing gate_closure_completed');
assertFalse(routing.closure_confirmed_by_human, 'routing closure_confirmed_by_human');
assertFalse(routing.cp6_closed, 'routing cp6_closed');
assertFalse(routing.year1_closed, 'routing year1_closed');
assertFalse(routing.protected_reference_data_changed, 'routing protected_reference_data_changed');
assertFalse(routing.lesson_output_changed, 'routing lesson_output_changed');
assertTrue(routing.no_cli_mutation_authorized, 'routing no_cli_mutation_authorized');
assertTrue(routing.no_protected_mutation_authorized, 'routing no_protected_mutation_authorized');
assertTrue(routing.no_lesson_output_mutation_authorized, 'routing no_lesson_output_mutation_authorized');
assertTrue(routing.no_target_exercise_promotion_authorized, 'routing no_target_exercise_promotion_authorized');
assertTrue(routing.no_placeholder_finalization_authorized, 'routing no_placeholder_finalization_authorized');
assertTrue(routing.no_unit_minting_authorized, 'routing no_unit_minting_authorized');

if (!Array.isArray(routing.explicit_decisions) || routing.explicit_decisions.length !== 9) {
  fail('gate-routing-decision.json must record exactly nine explicit decisions');
}

const expectedLanes = new Map([
  ['CP.6a', 'lesson_side_alignment'],
  ['CP.6b', 'target_exercise_review'],
  ['CP.6c', 'mtu_backfill_classification'],
  ['CP.6d', 'graph_heavy_evidence'],
  ['CP.6e', 'part_a_113_review'],
]);

if (!Array.isArray(routing.authorized_next_lanes) || routing.authorized_next_lanes.length !== expectedLanes.size) {
  fail('routing decision must authorize exactly five next lanes');
}
if (!Array.isArray(lanes.lanes) || lanes.lanes.length !== expectedLanes.size) {
  fail('remediation-lanes.json must include exactly five lanes');
}

for (const [sprintId, laneId] of expectedLanes) {
  const routingLane = routing.authorized_next_lanes.find((lane) => lane.sprint_id === sprintId);
  if (!routingLane) fail(`routing decision missing ${sprintId}`);
  assertEqual(routingLane.lane_id, laneId, `${sprintId} routing lane_id`);
  const lane = lanes.lanes.find((item) => item.sprint_id === sprintId);
  if (!lane) fail(`remediation lanes missing ${sprintId}`);
  assertEqual(lane.lane_id, laneId, `${sprintId} remediation lane_id`);
  assertFalse(lane.mutate_now, `${sprintId} mutate_now`);
  assertFalse(lane.protected_reference_mutation_authorized, `${sprintId} protected mutation`);
  assertFalse(lane.lesson_output_mutation_authorized, `${sprintId} lesson mutation`);
  assertIncludes(lanesMd, sprintId, `remediation-lanes.md ${sprintId}`);
}

const requiredBlocked = [
  'protected reference mutation',
  'lesson output mutation',
  'target-exercise promotion',
  'placeholder finalization',
  'unit minting',
  'CP-6 closure',
  'Year-1 closure',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'summative use',
  'PV projection',
];

for (const blocked of requiredBlocked) {
  if (!routing.blocked_outcomes.includes(blocked)) fail(`routing blocked_outcomes missing ${blocked}`);
  if (!interview.blocked_outcomes.includes(blocked)) fail(`interview blocked_outcomes missing ${blocked}`);
  if (!lanes.blocked_outcomes.includes(blocked)) fail(`lanes blocked_outcomes missing ${blocked}`);
  assertIncludes(routingMd, blocked, `routing markdown blocked ${blocked}`);
}

assertEqual(routing.next_operational_sprint, 'CP.6a', 'next operational sprint');
assertIncludes(interviewMd, 'No CP-6 closure proposal is drafted in this sprint.', 'closure proposal boundary');
assertIncludes(routingMd, 'CP-6 not closed', 'routing closure boundary');
assertIncludes(lanesMd, 'No protected reference mutation authorized', 'lanes protected boundary');

console.log('OK GATE-CP6 routing decision');
