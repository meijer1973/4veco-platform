#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const {
  validate,
  loadTerminology,
  loadEindtermen,
} = require('./build-unit-index');
const { validateSpec } = require('./unit-add');

const ROOT = process.cwd();
const PACKET_JSON_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-cli-execution-gate-packet.json');
const PACKET_MD_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-cli-execution-gate-packet.md');
const H2A_PLAN_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-cli-mutation-plan.json');
const REVIEW_PACKET_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2B-cli-execution', 'review-packet.md');
const REVIEW_PACKET_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2B-cli-execution', 'review-packet.json');
const UNITS_JSON_PATH = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const ROADMAP_PATH = path.join(ROOT, 'references', 'reference-team-roadmap.md');

function fail(message) {
  console.error(`MTU-H2B CLI execution gate packet check failed: ${message}`);
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

const packet = readJson(PACKET_JSON_PATH);
const packetMarkdown = readText(PACKET_MD_PATH);
const h2aPlan = readJson(H2A_PLAN_PATH);
const reviewPacket = readText(REVIEW_PACKET_PATH);
const reviewPacketJson = readJson(REVIEW_PACKET_JSON_PATH);
const units = readJson(UNITS_JSON_PATH);
const roadmap = readText(ROADMAP_PATH);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H2B') fail('packet sprint_id must be MTU-H2B');
if (packet.gate_id !== 'GATE-MTU-H2B') fail('packet gate_id must be GATE-MTU-H2B');
if (packet.status !== 'execution_gate_packet_ready_no_mutation') {
  fail('packet status must be execution_gate_packet_ready_no_mutation');
}

for (const key of [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'unit_split_execution_authorized',
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
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
}

const byId = new Map(units.map((unit) => [unit.id, unit]));
const expectedNewIds = ['F19', 'F20', 'A85', 'A86', 'A87', 'A88', 'A89', 'A90', 'A91', 'A92', 'A93'];
const expectedUpdateTargets = ['A12', 'A20'];
requireIncludes(packet.registry_state_proof.proposed_new_ids_checked_absent || [], expectedNewIds, 'registry_state_proof.proposed_new_ids_checked_absent');
requireIncludes(packet.registry_state_proof.live_update_targets_checked_present || [], expectedUpdateTargets, 'registry_state_proof.live_update_targets_checked_present');

for (const id of expectedNewIds) {
  if (byId.has(id)) fail(`proposed new ID ${id} already exists in live MTU registry`);
}
for (const id of expectedUpdateTargets) {
  if (!byId.has(id)) fail(`expected live update target ${id} is missing`);
}
for (const file of packet.registry_state_proof.candidate_storage_checked_not_created || []) {
  if (fs.existsSync(path.join(ROOT, file))) fail(`candidate storage must not exist yet: ${file}`);
}

if (packet.generator_field_proof.status !== 'passed') fail('generator_field_proof.status must be passed');
for (const id of ['A85', 'A86', 'A87', 'A88', 'A89', 'A90', 'A91', 'A92', 'A93']) {
  if (packet.generator_field_proof.a_domain_lanes_with_generators[id] !== `GEN_${id}`) {
    fail(`generator proof for ${id} must be GEN_${id}`);
  }
}
if (packet.generator_field_proof.live_update_generators.A12 !== 'GEN_A12') fail('A12 live generator proof must be GEN_A12');
if (packet.generator_field_proof.live_update_generators.A20 !== 'GEN_A20') fail('A20 live generator proof must be GEN_A20');

if (packet.term_link_validation.status !== 'passed') fail('term_link_validation.status must be passed');
if ((packet.term_link_validation.missing_terms || []).length) fail('term_link_validation.missing_terms must be empty');
const terminology = loadTerminology();
for (const slug of ['variabele-kosten', 'winst', 'marginale-kosten']) {
  if (!terminology.has(slug)) fail(`term slug missing from live terminology: ${slug}`);
}

if (packet.or_prerequisite_guardrail.status !== 'passed') fail('or_prerequisite_guardrail.status must be passed');
if (packet.or_prerequisite_guardrail.unit !== 'A91') fail('or_prerequisite_guardrail.unit must be A91');
const plannedA91Needs = packet.or_prerequisite_guardrail.planned_needs || [];
if (plannedA91Needs.includes('A90') || plannedA91Needs.includes('A12')) {
  fail('A91 planned needs must not include A90 or A12');
}

if (packet.a20_usage_impact_audit.status !== 'blocking_direct_a20_update') {
  fail('A20 audit must block direct update');
}
if (packet.a20_usage_impact_audit.direct_a20_update_execution_ready !== false) {
  fail('A20 direct update execution readiness must be false');
}
const a20Classifications = packet.a20_usage_impact_audit.active_usage_classifications || [];
if (!a20Classifications.some((item) => item.record_id === '4.1.2' && item.classification === 'given_mk_required')) {
  fail('A20 audit must include target exercise 4.1.2 as given_mk_required');
}
if (!a20Classifications.some((item) => item.record_id === 'GEN_A20' && item.classification === 'generator_impact_review_required')) {
  fail('A20 audit must include GEN_A20 generator impact review');
}

const executionReady = requireArray(packet, 'execution_ready_lanes', 'packet', 12);
const heldLanes = requireArray(packet, 'held_lanes', 'packet', 1);
if (executionReady.some((lane) => lane.unit_id === 'A20')) fail('A20 must not be execution-ready');
if (!heldLanes.some((lane) => lane.unit_id === 'A20' && lane.execution_ready === false)) {
  fail('held_lanes must include A20 as execution_ready false');
}
requireIncludes(executionReady.map((lane) => lane.unit_id), [
  'F19',
  'F20',
  'A85',
  'A86',
  'A87',
  'A88',
  'A89',
  'A90',
  'A12',
  'A91',
  'A92',
  'A93',
], 'execution_ready_lanes.unit_id');

const h2aLanes = new Map((h2aPlan.mutation_lanes || []).map((lane) => [lane.lane_id, lane]));
const simulatedUnits = units.map((unit) => ({ ...unit }));
const simulatedById = new Map(simulatedUnits.map((unit) => [unit.id, unit]));
const knownIds = new Set(byId.keys());

for (const lane of executionReady) {
  if (lane.execution_ready !== true) fail(`${lane.lane_id} execution_ready must be true`);
  if (!lane.cli_command_exact || lane.cli_command_exact.includes('<')) {
    fail(`${lane.lane_id} must include a concrete cli_command_exact`);
  }
  const sourceLane = h2aLanes.get(lane.source_lane_id);
  if (!sourceLane) fail(`${lane.lane_id} source lane missing from H2A plan: ${lane.source_lane_id}`);
  if (lane.action_type === 'unit_add') {
    if (!lane.cli_command_exact.includes('unit-add.js')) fail(`${lane.lane_id} command must use unit-add.js`);
    const spec = sourceLane.proposed_spec;
    if (!spec || spec.id !== lane.unit_id) fail(`${lane.lane_id} source proposed_spec must match unit_id`);
    const specErrors = validateSpec(spec, knownIds);
    if (specErrors.length) fail(`${lane.lane_id} proposed_spec invalid: ${specErrors.join('; ')}`);
    knownIds.add(spec.id);
    simulatedById.set(spec.id, { ...spec });
  } else if (lane.action_type === 'unit_update') {
    if (!lane.dry_run_command_exact || !lane.dry_run_command_exact.includes('--dry-run')) {
      fail(`${lane.lane_id} unit_update must include dry_run_command_exact`);
    }
    if (!lane.cli_command_exact.includes('unit-update.js')) fail(`${lane.lane_id} command must use unit-update.js`);
    if (!sourceLane.update_spec || lane.unit_id !== sourceLane.target_live_unit_id) {
      fail(`${lane.lane_id} source update_spec must match target_live_unit_id`);
    }
    Object.assign(simulatedById.get(lane.unit_id), sourceLane.update_spec);
  } else {
    fail(`${lane.lane_id} unsupported action_type ${lane.action_type}`);
  }
}

const simulatedValidation = validate(Array.from(simulatedById.values()), {
  terms: terminology,
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
});
if (simulatedValidation.errors.length) {
  fail(`simulated unblocked post-execution catalog would not validate: ${simulatedValidation.errors.join('; ')}`);
}

const a91 = simulatedById.get('A91');
if (!a91 || (a91.needs || []).includes('A90') || (a91.needs || []).includes('A12')) {
  fail('simulated A91 must not depend on A90 or A12');
}
const a93 = simulatedById.get('A93');
if (!a93 || !(a93.pitfalls || []).some((pitfall) => pitfall.includes('niet hetzelfde als het percentage van de kostenstijging'))) {
  fail('simulated A93 must include the price-change versus cost-shock pitfall');
}

const directFiles = packet.expected_diff_scope_if_later_authorized.direct_cli_write_files || [];
requireIncludes(directFiles, [
  'references/machine/micro-teaching-units.md',
  'references/machine/micro-teaching-units.json',
], 'expected_diff_scope.direct_cli_write_files');
const mustNotChange = packet.expected_diff_scope_if_later_authorized.must_not_change || [];
requireIncludes(mustNotChange, [
  'references/external/',
  'references/data/exam-ingestion/*-candidates.json',
  'lesson output',
  'candidate storage',
  'student/product-use flags',
], 'expected_diff_scope.must_not_change');

for (const requiredText of [
  'execution-gate packet ready, no mutation authorized',
  'Registry State Proof',
  'A20 Usage Impact Audit',
  'Execution-Ready Command Set For Review',
  'Held lane',
  'Required Post-Execution Validation',
  'GATE-MTU-H2B',
]) {
  if (!packetMarkdown.includes(requiredText)) fail(`packet Markdown must include "${requiredText}"`);
}

if (reviewPacketJson.gate_id !== 'GATE-MTU-H2B') fail('review packet JSON gate_id must be GATE-MTU-H2B');
requireArray(reviewPacketJson, 'calibration_questions', 'review packet JSON', 2);
requireArray(reviewPacketJson, 'planned_questions', 'review packet JSON', 9);
requireArray(reviewPacketJson, 'stop_conditions', 'review packet JSON', 8);
for (const key of [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'unit_split_execution_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'student_product_use_authorized',
]) {
  requireFalse(reviewPacketJson.authority_boundary, key, 'review_packet.authority_boundary');
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
  requireFalse(reviewPacketJson.product_boundaries, key, 'review_packet.product_boundaries');
}
for (const requiredText of [
  'Calibration Questions',
  'Full Planned Review Questions',
  'MTUH2B-Q1',
  'MTUH2B-Q9',
  'Current Stop Conditions',
  'Run the formal GATE-MTU-H2B human review',
  'A20',
  'unit-add dry-run',
]) {
  if (!reviewPacket.includes(requiredText)) fail(`review packet must include "${requiredText}"`);
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (GATE-MTU-H2B|MTU-H2B) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be GATE-MTU-H2B while review is active, or MTU-H2B while packet preparation is active');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) {
  fail('first Sprint Ledger row must state ACTIVE OPERATIONAL NEXT ACTION');
}
if (!roadmap.includes('| MTU-H2B | Solo q1-q3 CLI Execution Gate Packet | yes |')) {
  fail('roadmap Closed Sprints must include MTU-H2B closure row after packet preparation');
}

console.log('OK MTU-H2B CLI execution gate packet: reports/mtu-hardening/solo-q1-q3-cli-execution-gate-packet.json');
