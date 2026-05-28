#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CASES_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-canonical-cases.json');
const CASES_MD_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-canonical-cases.md');
const PACKET_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2-solo-q1-q3-micro-cases', 'review-packet.md');
const PACKET_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2-solo-q1-q3-micro-cases', 'review-packet.json');
const HUMAN_INTERVIEW_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2-solo-q1-q3-micro-cases', 'human-interview.md');
const HUMAN_INTERVIEW_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2-solo-q1-q3-micro-cases', 'human-interview.json');
const GATE_CLOSURE_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2-solo-q1-q3-micro-cases', 'gate-closure.md');
const GATE_CLOSURE_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2-solo-q1-q3-micro-cases', 'gate-closure.json');
const ROADMAP_PATH = path.join(ROOT, 'references', 'reference-team-roadmap.md');

function fail(message) {
  console.error(`MTU-H2 solo cases check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${path.relative(ROOT, file)}: ${error.message}`);
  }
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function requireArray(object, key, context, minItems = 1) {
  if (!Array.isArray(object[key]) || object[key].length < minItems) {
    fail(`${context}.${key} must be an array with at least ${minItems} item(s)`);
  }
  return object[key];
}

function requireIncludes(values, expected, context) {
  for (const value of expected) {
    if (!values.includes(value)) fail(`${context} must include ${value}`);
  }
}

const cases = readJson(CASES_PATH);
const casesMarkdown = readText(CASES_MD_PATH);
const packet = readText(PACKET_PATH);
const packetJson = readJson(PACKET_JSON_PATH);
const humanInterview = readText(HUMAN_INTERVIEW_PATH);
const humanInterviewJson = readJson(HUMAN_INTERVIEW_JSON_PATH);
const gateClosure = readText(GATE_CLOSURE_PATH);
const gateClosureJson = readJson(GATE_CLOSURE_JSON_PATH);
const roadmap = readText(ROADMAP_PATH);

if (cases.schema_version !== 1) fail('cases schema_version must be 1');
if (cases.sprint_id !== 'MTU-H2') fail('cases sprint_id must be MTU-H2');
if (cases.gate_id !== 'GATE-MTU-H2') fail('cases gate_id must be GATE-MTU-H2');
if (cases.status !== 'review_packet_ready_no_mutation') {
  fail('cases status must be review_packet_ready_no_mutation');
}

requireFalse(cases.source_basis, 'official_source_refresh_performed', 'source_basis');
requireFalse(cases.source_basis, 'external_source_mutated', 'source_basis');

const authority = cases.authority_boundary || {};
for (const key of [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_authorized',
  'unit_split_authorized',
  'unit_merge_authorized',
  'unit_deprecation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'student_product_use_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
]) {
  requireFalse(authority, key, 'authority_boundary');
}

const canonicalCases = requireArray(cases, 'canonical_cases', 'cases', 3);
requireIncludes(
  canonicalCases.map((item) => item.question_id),
  ['vwo-economie-2026-solo:q1', 'vwo-economie-2026-solo:q2', 'vwo-economie-2026-solo:q3'],
  'canonical_cases.question_id'
);

for (const canonicalCase of canonicalCases) {
  const context = `case ${canonicalCase.question_id}`;
  requireArray(canonicalCase, 'correction_model_operations', context);
  requireArray(canonicalCase, 'existing_unit_findings', context);
  requireArray(canonicalCase, 'candidate_lanes', context);
  requireArray(canonicalCase, 'over_trigger_guardrails', context);
  for (const lane of canonicalCase.candidate_lanes) {
    if (!lane.lane_id) fail(`${context} candidate lane missing lane_id`);
    if (!lane.proposed_label_nl) fail(`${lane.lane_id} missing proposed_label_nl`);
    if (!lane.layer) fail(`${lane.lane_id} missing layer`);
    if (!lane.core) fail(`${lane.lane_id} missing core`);
    if (!lane.suggested_later_cli_path) fail(`${lane.lane_id} missing suggested_later_cli_path`);
    requireFalse(lane, 'mutation_authorized', lane.lane_id);
  }
}

const allLaneIds = canonicalCases.flatMap((item) => item.candidate_lanes.map((lane) => lane.lane_id));
requireIncludes(
  allLaneIds,
  [
    'MTUH2-Q1-F-VERBAL-EXTERNAL-COST',
    'MTUH2-Q1-F-EXTERNAL-COST-EXAMPLE',
    'MTUH2-Q1-A-LEG-UIT-WITH-EXAMPLE',
    'MTUH2-Q2-A-TO-POINT-CALCULATION',
    'MTUH2-Q2-A-TVK-CONSTANT-VARIABLE-COST',
    'MTUH2-Q2-A-UNKNOWN-FIXED-COST-FROM-PROFIT',
    'MTUH2-Q2-A-SCALE-FACTOR-UNIT-HANDLING',
    'MTUH2-Q2-A-BEREKEN-ANSWER-FORM',
    'MTUH2-Q3-A-GO-AS-MONOPOLY-PRICE-RELATION',
    'MTUH2-Q3-A-MO-WITHOUT-DERIVATIVES',
    'MTUH2-Q3-A-MO-WITH-DERIVATIVE',
    'MTUH2-Q3-A-MO-EQUALS-GIVEN-MK',
    'MTUH2-Q3-A-MO-EQUALS-DERIVED-MK',
    'MTUH2-Q3-A-NEW-MONOPOLY-PRICE-AFTER-Q',
    'MTUH2-Q3-A-PERCENTAGE-PRICE-CHANGE-AFTER-COST-CHANGE',
    'MTUH2-Q3-D07-PASS-THROUGH-DEPENDENCY',
  ],
  'candidate_lanes.lane_id'
);

for (const requiredText of [
  'No protected reference mutation authorized',
  'No machine-reference mutation authorized',
  'No student/product use authorized',
  'Candidate lane IDs in this report are not live MTU IDs',
]) {
  if (!casesMarkdown.includes(requiredText)) fail(`canonical cases Markdown must include "${requiredText}"`);
}

for (const requiredText of [
  'Candidate Lane Table',
  'Calibration Questions',
  'Full Planned Review Questions',
  'MTUH2-Q1',
  'MTUH2-Q9',
  'Current Stop Conditions',
  'Run the formal GATE-MTU-H2 human review',
]) {
  if (!packet.includes(requiredText)) fail(`review packet must include "${requiredText}"`);
}

if (packetJson.gate_id !== 'GATE-MTU-H2') fail('review packet JSON gate_id must be GATE-MTU-H2');
const candidateLaneTable = requireArray(packetJson, 'candidate_lane_table', 'review packet JSON', 16);
requireIncludes(
  candidateLaneTable.map((item) => item.candidate_lane_id),
  [
    'MTUH2-Q1-F-VERBAL-EXTERNAL-COST',
    'MTUH2-Q1-F-EXTERNAL-COST-EXAMPLE',
    'MTUH2-Q1-A-LEG-UIT-WITH-EXAMPLE',
    'MTUH2-Q2-A-TO-POINT-CALCULATION',
    'MTUH2-Q2-A-TVK-CONSTANT-VARIABLE-COST',
    'MTUH2-Q2-A-UNKNOWN-FIXED-COST-FROM-PROFIT',
    'MTUH2-Q2-A-SCALE-FACTOR-UNIT-HANDLING',
    'MTUH2-Q2-A-BEREKEN-ANSWER-FORM',
    'MTUH2-Q3-A-GO-AS-MONOPOLY-PRICE-RELATION',
    'MTUH2-Q3-A-MO-WITHOUT-DERIVATIVES',
    'MTUH2-Q3-A-MO-WITH-DERIVATIVE',
    'MTUH2-Q3-A-MO-EQUALS-GIVEN-MK',
    'MTUH2-Q3-A-MO-EQUALS-DERIVED-MK',
    'MTUH2-Q3-A-NEW-MONOPOLY-PRICE-AFTER-Q',
    'MTUH2-Q3-A-PERCENTAGE-PRICE-CHANGE-AFTER-COST-CHANGE',
    'MTUH2-Q3-D07-PASS-THROUGH-DEPENDENCY',
  ],
  'review packet candidate_lane_table.candidate_lane_id'
);
requireArray(packetJson, 'calibration_questions', 'review packet JSON', 2);
requireArray(packetJson, 'planned_questions', 'review packet JSON', 9);
requireArray(packetJson, 'stop_conditions', 'review packet JSON', 6);
for (const key of [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'student_product_use_authorized',
]) {
  requireFalse(packetJson.authority_boundary, key, 'review_packet.authority_boundary');
}
for (const key of [
  'diagnostics',
  'adaptive_routing',
  'mastery',
  'sequencing',
  'student_facing_ai',
  'summative_use',
  'pv_projection',
  'pv_machine_promotion',
  'student_facing_output',
]) {
  requireFalse(packetJson.product_boundaries, key, 'review_packet.product_boundaries');
}

for (const requiredText of [
  'PASS WITH CONDITIONS',
  'routing only',
  'MTU-H2A',
  'No mutation execution',
]) {
  if (!humanInterview.includes(requiredText)) fail(`human interview Markdown must include "${requiredText}"`);
}

if (humanInterviewJson.gate_id !== 'GATE-MTU-H2') fail('human interview JSON gate_id must be GATE-MTU-H2');
if (humanInterviewJson.status !== 'pass_with_conditions_routing_only') {
  fail('human interview JSON status must be pass_with_conditions_routing_only');
}
if (humanInterviewJson.closure_confirmed_by_human !== true) {
  fail('human interview JSON must record closure_confirmed_by_human true');
}
if (humanInterviewJson.allowed_next_sprint !== 'MTU-H2A') {
  fail('human interview JSON allowed_next_sprint must be MTU-H2A');
}
requireFalse(humanInterviewJson, 'mutation_execution_authorized', 'human_interview');
requireFalse(humanInterviewJson, 'student_product_use_authorized', 'human_interview');

for (const requiredText of [
  'PASS WITH CONDITIONS',
  'routing only',
  'MTU-H2A',
  'No protected reference mutation',
]) {
  if (!gateClosure.includes(requiredText)) fail(`gate closure Markdown must include "${requiredText}"`);
}

if (gateClosureJson.gate_id !== 'GATE-MTU-H2') fail('gate closure JSON gate_id must be GATE-MTU-H2');
if (gateClosureJson.status !== 'pass_with_conditions') {
  fail('gate closure JSON status must be pass_with_conditions');
}
if (gateClosureJson.decision_scope !== 'routing_only') {
  fail('gate closure JSON decision_scope must be routing_only');
}
if (gateClosureJson.closure_confirmed_by_human !== true) {
  fail('gate closure JSON must record closure_confirmed_by_human true');
}
if (gateClosureJson.allowed_next_sprint !== 'MTU-H2A') {
  fail('gate closure JSON allowed_next_sprint must be MTU-H2A');
}
requireFalse(gateClosureJson, 'mutation_execution_authorized', 'gate_closure');
requireFalse(gateClosureJson, 'candidate_storage_authorized', 'gate_closure');
requireFalse(gateClosureJson, 'candidate_writes_authorized', 'gate_closure');
requireFalse(gateClosureJson, 'student_product_use_authorized', 'gate_closure');
requireArray(gateClosureJson, 'approved_for_later_planning', 'gate closure JSON', 10);
requireArray(gateClosureJson, 'deferred_but_visible', 'gate closure JSON', 3);
requireArray(gateClosureJson, 'blocked_outcomes', 'gate closure JSON', 10);

const sprintLedgerMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!sprintLedgerMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = sprintLedgerMatch[1];
if (!/\| (MTU-H2G|MTU-H2F|GATE-MTU-H2E|MTU-H2E|GATE-MTU-H2D|MTU-H2D|MTU-H2C|GATE-MTU-H2B|MTU-H2B|MTU-H2A|GATE-MTU-H2A) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be MTU-H2G/MTU-H2F/GATE-MTU-H2E/MTU-H2E/GATE-MTU-H2D/MTU-H2D/MTU-H2C/GATE-MTU-H2B/MTU-H2B after GATE-MTU-H2A closure, or MTU-H2A/GATE-MTU-H2A while active');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) {
  fail('post-GATE-MTU-H2 first row must state ACTIVE OPERATIONAL NEXT ACTION');
}
if (!firstRow.includes('planning') && !firstRow.includes('human review') && !firstRow.includes('gate packet') && !firstRow.includes('preflight') && !firstRow.includes('execution') && !firstRow.includes('resolution')) {
  fail('post-GATE-MTU-H2 first row must point to planning, human review, gate-packet, preflight, execution, or resolution authority');
}
if (!roadmap.includes('| GATE-MTU-H2 | Solo q1-q3 Micro-Case Human Review | yes | Closed as `pass_with_conditions` for routing only.')) {
  fail('roadmap Closed Sprints must include GATE-MTU-H2 closure row');
}

console.log('OK MTU-H2 solo cases: reports/mtu-hardening/solo-q1-q3-canonical-cases.json');
