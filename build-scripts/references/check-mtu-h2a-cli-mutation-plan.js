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
const PLAN_JSON_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-cli-mutation-plan.json');
const PLAN_MD_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-cli-mutation-plan.md');
const REVIEW_PACKET_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2A-cli-mutation-plan', 'review-packet.md');
const REVIEW_PACKET_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2A-cli-mutation-plan', 'review-packet.json');
const UNITS_JSON_PATH = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const ROADMAP_PATH = path.join(ROOT, 'references', 'reference-team-roadmap.md');

function fail(message) {
  console.error(`MTU-H2A CLI mutation plan check failed: ${message}`);
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

const plan = readJson(PLAN_JSON_PATH);
const planMarkdown = readText(PLAN_MD_PATH);
const reviewPacket = readText(REVIEW_PACKET_PATH);
const reviewPacketJson = readJson(REVIEW_PACKET_JSON_PATH);
const units = readJson(UNITS_JSON_PATH);
const roadmap = readText(ROADMAP_PATH);

if (plan.schema_version !== 1) fail('plan schema_version must be 1');
if (plan.sprint_id !== 'MTU-H2A') fail('plan sprint_id must be MTU-H2A');
if (plan.gate_id !== 'GATE-MTU-H2A') fail('plan gate_id must be GATE-MTU-H2A');
if (plan.status !== 'planning_packet_ready_no_mutation') {
  fail('plan status must be planning_packet_ready_no_mutation');
}

const authority = plan.authority_boundary || {};
for (const key of [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'unit_split_execution_authorized',
  'unit_dependency_mutation_authorized',
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

if (plan.cli_surface_findings.unit_add_has_dry_run !== false) {
  fail('plan must record unit_add_has_dry_run false');
}
if (plan.cli_surface_findings.unit_update_has_dry_run !== true) {
  fail('plan must record unit_update_has_dry_run true');
}

const expectedNewIds = ['F19', 'F20', 'A85', 'A86', 'A87', 'A88', 'A89', 'A90', 'A91', 'A92', 'A93'];
const expectedUpdateTargets = ['A12', 'A20'];
requireIncludes(plan.proposed_new_unit_ids || [], expectedNewIds, 'proposed_new_unit_ids');
requireIncludes(plan.proposed_live_update_targets || [], expectedUpdateTargets, 'proposed_live_update_targets');

const byId = new Map(units.map((unit) => [unit.id, unit]));
for (const id of expectedNewIds) {
  if (byId.has(id)) fail(`proposed new ID ${id} already exists in live MTU registry`);
}
for (const id of expectedUpdateTargets) {
  if (!byId.has(id)) fail(`proposed update target ${id} does not exist in live MTU registry`);
}

const lanes = requireArray(plan, 'mutation_lanes', 'plan', 13);
const laneIds = lanes.map((lane) => lane.lane_id);
requireIncludes(laneIds, [
  'MTUH2A-Q1-F19-VERBAL-EXTERNAL-COST',
  'MTUH2A-Q1-F20-EXTERNAL-COST-EXAMPLE',
  'MTUH2A-Q2-A85-TO-POINT-CALCULATION',
  'MTUH2A-Q2-A86-TVK-CONSTANT-VARIABLE-COST',
  'MTUH2A-Q2-A87-UNKNOWN-FIXED-COST-FROM-PROFIT',
  'MTUH2A-Q2-A88-SCALE-FACTOR-HANDLING',
  'MTUH2A-Q3-A89-GO-AS-PRICE-RELATION',
  'MTUH2A-Q3-A90-MO-WITHOUT-DERIVATIVES',
  'MTUH2A-Q3-A12-DERIVATIVE-MO-UPDATE',
  'MTUH2A-Q3-A91-MO-EQUALS-GIVEN-MK',
  'MTUH2A-Q3-A20-DERIVED-MK-UPDATE',
  'MTUH2A-Q3-A92-NEW-PRICE-AFTER-Q',
  'MTUH2A-Q3-A93-PERCENTAGE-PRICE-CHANGE-AFTER-COST-CHANGE',
], 'mutation_lanes.lane_id');

const knownIds = new Set(byId.keys());
const simulatedUnits = units.map((unit) => ({ ...unit }));
const simulatedById = new Map(simulatedUnits.map((unit) => [unit.id, unit]));

for (const lane of lanes) {
  if (lane.status !== 'planned_for_gate_review_not_authorized') {
    fail(`${lane.lane_id} status must be planned_for_gate_review_not_authorized`);
  }
  requireFalse(lane, 'mutation_execution_authorized', lane.lane_id);
  if (lane.action_type === 'unit_add') {
    const spec = lane.proposed_spec;
    if (!spec || spec.id !== lane.proposed_unit_id) {
      fail(`${lane.lane_id} must include proposed_spec matching proposed_unit_id`);
    }
    const specErrors = validateSpec(spec, knownIds);
    if (specErrors.length) fail(`${lane.lane_id} proposed_spec invalid: ${specErrors.join('; ')}`);
    knownIds.add(spec.id);
    simulatedUnits.push({ ...spec });
    simulatedById.set(spec.id, spec);
  } else if (lane.action_type === 'unit_update') {
    if (!lane.target_live_unit_id || !byId.has(lane.target_live_unit_id)) {
      fail(`${lane.lane_id} unit_update must target an existing live unit`);
    }
    if (!lane.update_spec || typeof lane.update_spec !== 'object' || Array.isArray(lane.update_spec)) {
      fail(`${lane.lane_id} must include update_spec object`);
    }
    if (Object.prototype.hasOwnProperty.call(lane.update_spec, 'id')) {
      fail(`${lane.lane_id} update_spec must not include id`);
    }
    Object.assign(simulatedById.get(lane.target_live_unit_id), lane.update_spec);
  } else {
    fail(`${lane.lane_id} unsupported action_type ${lane.action_type}`);
  }
}

const simulatedValidation = validate(Array.from(simulatedById.values()), {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
});
if (simulatedValidation.errors.length) {
  fail(`simulated post-plan catalog would not validate: ${simulatedValidation.errors.join('; ')}`);
}

requireIncludes(plan.command_sequence || [], [
  'unit-add F19',
  'unit-add F20',
  'unit-add A85',
  'unit-add A86',
  'unit-add A87',
  'unit-add A88',
  'unit-add A89',
  'unit-add A90',
  'unit-update A12',
  'unit-add A91',
  'unit-update A20',
  'unit-add A92',
  'unit-add A93',
], 'command_sequence');

const deferred = requireArray(plan, 'deferred_visible_dependencies', 'plan', 3);
requireIncludes(
  deferred.map((item) => item.route),
  ['MTU-H3', 'MTU-H4'],
  'deferred_visible_dependencies.route'
);

for (const requiredText of [
  'No protected reference mutation',
  'Proposed New Unit IDs',
  'Command Sequence For Later Review',
  'Deferred But Visible',
  'Required Later Execution Proof',
]) {
  if (!planMarkdown.includes(requiredText)) fail(`planning Markdown must include "${requiredText}"`);
}

if (reviewPacketJson.gate_id !== 'GATE-MTU-H2A') fail('review packet JSON gate_id must be GATE-MTU-H2A');
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
  'MTUH2A-Q1',
  'MTUH2A-Q9',
  'Current Stop Conditions',
  'Run the formal GATE-MTU-H2A human review',
]) {
  if (!reviewPacket.includes(requiredText)) fail(`review packet must include "${requiredText}"`);
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (MTU-H2A|GATE-MTU-H2A) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be MTU-H2A while active or GATE-MTU-H2A after planning completion');
}

console.log('OK MTU-H2A CLI mutation plan: reports/mtu-hardening/solo-q1-q3-cli-mutation-plan.json');
