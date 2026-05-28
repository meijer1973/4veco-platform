#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker non-mutating. It validates the H3A planning packet,
 *   review packet, and current baseline evidence only.
 * - If reviewed lane IDs change, update the D41-D46 lane set and the exact
 *   mapping proposal checks here and in the packet together.
 * - Do not use this checker to write references/machine or references/external.
 */

const fs = require('fs');
const path = require('path');
const { validateSpec } = require('./unit-add');
const {
  validate,
  loadTerminology,
  loadEindtermen,
} = require('./build-unit-index');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3a-incidence-cli-mutation-plan.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3a-incidence-cli-mutation-plan.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3A-incidence-cli-mutation-plan', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3A-incidence-cli-mutation-plan', 'review-packet.md');
const BUNDLE_URLS = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3A-incidence-cli-mutation-plan', 'bundle-urls.md');
const HUMAN_INTERVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3A-incidence-cli-mutation-plan', 'human-interview.json');
const GATE_CLOSURE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3A-incidence-cli-mutation-plan', 'gate-closure.json');
const H3_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3-incidence-pass-through', 'gate-closure.json');
const H3_REVIEW = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3-incidence-pass-through-family-review.json');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

const FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'd07_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'unit_split_execution_authorized',
  'unit_deprecation_authorized',
  'target_exercise_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'target_exercise_promotion_authorized',
  'generated_projection_refresh_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'student_product_use_authorized',
];

const PLANNED_IDS = ['D41', 'D42', 'D43', 'D44', 'D45', 'D46'];

function fail(message) {
  console.error(`MTU-H3A incidence CLI-mutation plan check failed: ${message}`);
  process.exit(1);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function arrayEqual(actual, expected, context) {
  if (!Array.isArray(actual)) fail(`${context} must be an array`);
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) fail(`${context} mismatch\nactual:   ${a}\nexpected: ${e}`);
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function byId(records, id, context) {
  const record = records.find((item) => item.id === id || item.unit_id === id || item.record_id === id);
  if (!record) fail(`missing ${context} ${id}`);
  return record;
}

function exercisesList(data) {
  return Array.isArray(data) ? data : data.exercises;
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const h3Closure = readJson(H3_CLOSURE);
const h3Review = readJson(H3_REVIEW);
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H3A') fail('packet sprint_id must be MTU-H3A');
if (packet.gate_id !== 'GATE-MTU-H3A-incidence-cli-mutation-plan') fail('packet gate_id mismatch');
if (packet.status !== 'cli_mutation_plan_ready_no_mutation') fail('packet status mismatch');
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('commit')) fail('packet remote status must mention commit');
if (review.gate_id !== packet.gate_id) fail('review gate_id mismatch');
if (review.source_packet !== 'reports/mtu-hardening/mtu-h3a-incidence-cli-mutation-plan.json') {
  fail('review source_packet mismatch');
}
if (review.remote_publication_required_before_review !== true) fail('review must require remote publication');

for (const key of FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}

if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) {
  fail('review must have exactly 3 calibration questions');
}
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) {
  fail('review must have exactly 10 planned questions');
}
for (let i = 1; i <= 10; i += 1) {
  requireIncludes(reviewMd, `MTUH3A-Q${i}`, 'review packet markdown');
}

if (h3Closure.status !== 'pass_with_conditions') fail('source H3 gate must be closed pass_with_conditions');
if (h3Closure.authorized_next.sprint_id !== 'MTU-H3A') fail('H3 closure must authorize MTU-H3A');
if (h3Closure.authorized_next.execution_authorized !== false) fail('H3 closure must not authorize execution');
if (h3Review.gate_id !== 'GATE-MTU-H3-incidence-pass-through') fail('source H3 review gate mismatch');

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of ['D07', 'D05', 'A38', 'A41', 'A93']) {
  if (!unitMap.has(id)) fail(`${id} must be live in the baseline`);
}
const d07 = unitMap.get('D07');
arrayEqual(d07.needs, ['D05', 'A15'], 'live D07 baseline needs');
if (!String(d07.kern || '').toLowerCase().includes('percentage')) {
  fail('live D07 kern must still provide baseline percentage evidence');
}
for (const id of PLANNED_IDS) {
  if (unitMap.has(id)) fail(`${id} must be absent before H3A execution`);
}
const a93 = unitMap.get('A93');
if (!String(a93.kern || '').includes('onderscheid dit van pass-through')) {
  fail('A93 must still preserve the price-change/pass-through boundary');
}

const update = byId(packet.proposed_unit_updates, 'D07', 'proposed update');
const d07Patch = update.reviewed_patch;
arrayEqual(d07Patch.needs, ['D42', 'A38'], 'proposed D07 needs');
if (d07Patch.needs.includes('A15')) fail('proposed D07 must not depend on A15');
if (!Array.isArray(d07Patch.procedure) || d07Patch.procedure.some((step) => /elastic/i.test(step))) {
  fail('proposed D07 procedure must not contain hidden elasticity explanation');
}
if (!String(update.planning_rationale || '').includes('D45')) fail('D07 rationale must route elasticity to D45');

const additionSpecs = [];
for (const id of PLANNED_IDS) {
  const lane = byId(packet.proposed_unit_additions, id, 'proposed addition');
  const spec = lane.reviewed_spec;
  if (spec.id !== id) fail(`${id} reviewed_spec.id mismatch`);
  additionSpecs.push(spec);
  const errors = validateSpec(spec, new Set(units.map((unit) => unit.id)));
  if (errors.length) fail(`${id} validateSpec errors: ${errors.join('; ')}`);
}

const d41 = byId(packet.proposed_unit_additions, 'D41', 'proposed addition').reviewed_spec;
arrayEqual(d41.needs, ['D05'], 'D41 needs');
if (JSON.stringify(d41).includes('A40') || JSON.stringify(d41).includes('D29')) {
  fail('D41 must not import welfare-area units');
}
const d42 = byId(packet.proposed_unit_additions, 'D42', 'proposed addition').reviewed_spec;
arrayEqual(d42.needs, ['D41'], 'D42 needs');
const d43 = byId(packet.proposed_unit_additions, 'D43', 'proposed addition').reviewed_spec;
arrayEqual(d43.needs, ['A41'], 'D43 needs');
const d44 = byId(packet.proposed_unit_additions, 'D44', 'proposed addition').reviewed_spec;
arrayEqual(d44.needs, ['D43'], 'D44 needs');
const d45 = byId(packet.proposed_unit_additions, 'D45', 'proposed addition').reviewed_spec;
arrayEqual(d45.needs, ['A15'], 'D45 needs');
if (!JSON.stringify(d45).toLowerCase().includes('aanbodelasticiteit')) {
  fail('D45 must make supply-elasticity scope visible');
}
const d46 = byId(packet.proposed_unit_additions, 'D46', 'proposed addition').reviewed_spec;
arrayEqual(d46.needs, ['A93'], 'D46 needs');
if (!JSON.stringify(d46).includes('kostenstijging')) fail('D46 must use cost shock as denominator');
if (packet.a93_boundary_proof.must_not_change_a93_in_h3a !== true) fail('A93 must not be changed by H3A');
if (!String(packet.a93_boundary_proof.boundary_test || '').includes('old price')) {
  fail('A93 boundary proof must name denominator difference');
}

const simulated = units.map((unit) => (unit.id === 'D07' ? { ...unit, ...d07Patch } : unit));
for (const spec of additionSpecs) simulated.push(spec);
const validation = validate(simulated, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
});
if (validation.errors.length) fail(`simulated catalog validation errors: ${validation.errors.join('; ')}`);

const exercises = exercisesList(targetData);
if (!Array.isArray(exercises)) fail('target exercise data must contain exercises array');
const e311 = byId(exercises, '3.1.1', 'target exercise');
const e312 = byId(exercises, '3.1.2', 'target exercise');
const e313 = byId(exercises, '3.1.3', 'target exercise');
arrayEqual(e311.required_skills, ['A06', 'A23', 'A41', 'D05', 'D07'], 'live 3.1.1 required_skills');
arrayEqual(e312.required_skills, ['A10', 'A19', 'A23', 'A32', 'A40', 'D03', 'D07'], 'live 3.1.2 required_skills');
arrayEqual(e313.required_skills, ['A06', 'A10', 'A19', 'A27', 'A41', 'D19', 'D29'], 'live 3.1.3 required_skills');

const m311 = byId(packet.target_mapping_plan, '3.1.1', 'mapping plan');
arrayEqual(m311.before.required_skills, e311.required_skills, '3.1.1 mapping before required_skills');
arrayEqual(m311.before.prior_knowledge_assumed, e311.prior_knowledge_assumed, '3.1.1 mapping before prior');
arrayEqual(m311.before.new_skills_introduced, e311.new_skills_introduced, '3.1.1 mapping before new');
arrayEqual(m311.before.missing_units_flagged, e311.missing_units_flagged, '3.1.1 mapping before missing flags');
arrayEqual(m311.after.required_skills, ['A06', 'A23', 'A41', 'D05', 'D41'], '3.1.1 mapping after required_skills');
arrayEqual(m311.after.missing_units_flagged, [], '3.1.1 mapping after missing flags');

const m312 = byId(packet.target_mapping_plan, '3.1.2', 'mapping plan');
arrayEqual(m312.before.required_skills, e312.required_skills, '3.1.2 mapping before required_skills');
arrayEqual(m312.before.prior_knowledge_assumed, e312.prior_knowledge_assumed, '3.1.2 mapping before prior');
arrayEqual(m312.before.new_skills_introduced, e312.new_skills_introduced, '3.1.2 mapping before new');
arrayEqual(m312.before.missing_units_flagged, e312.missing_units_flagged, '3.1.2 mapping before missing flags');
arrayEqual(m312.after.required_skills, ['A10', 'A19', 'A23', 'A32', 'A40', 'D03', 'D41', 'D42', 'D07'], '3.1.2 mapping after required_skills');
arrayEqual(m312.after.prior_knowledge_assumed, ['A10', 'A19', 'A23', 'A40', 'D41'], '3.1.2 mapping after prior');
arrayEqual(m312.after.new_skills_introduced, ['A32', 'D03', 'D42', 'D07'], '3.1.2 mapping after new');
if (m312.after.missing_units_flagged.length !== 1) fail('3.1.2 mapping after must keep only surplus missing flag');

const m313 = byId(packet.target_mapping_plan, '3.1.3', 'mapping plan');
arrayEqual(m313.before.required_skills, e313.required_skills, '3.1.3 mapping before required_skills');
arrayEqual(m313.before.prior_knowledge_assumed, e313.prior_knowledge_assumed, '3.1.3 mapping before prior');
arrayEqual(m313.before.new_skills_introduced, e313.new_skills_introduced, '3.1.3 mapping before new');
arrayEqual(m313.before.missing_units_flagged, e313.missing_units_flagged, '3.1.3 mapping before missing flags');
arrayEqual(m313.after.required_skills, ['A06', 'A10', 'A19', 'A27', 'A41', 'D19', 'D29', 'D43'], '3.1.3 mapping after required_skills');
if (!m313.held_mapping || m313.held_mapping.unit_id !== 'D44') fail('3.1.3 must hold D44 mapping');

if (packet.command_plan_for_later_execution_packet.execution_authorized_now !== false) {
  fail('H3A packet must not authorize execution');
}
if (packet.command_plan_for_later_execution_packet.unit_add_dry_run_limitation_disclosed !== true) {
  fail('unit-add dry-run limitation must be disclosed');
}
if (packet.projection_boundary.generated_projection_refresh_authorized_now !== false) {
  fail('projection refresh must not be authorized now');
}
if (packet.projection_boundary.later_refresh_allowed_only_after_authorized_source_mutation !== true) {
  fail('projection refresh must be downstream of source mutation');
}

requireIncludes(packetMd, 'No protected reference mutation authorized', 'packet markdown');
requireIncludes(packetMd, 'D41', 'packet markdown');
requireIncludes(packetMd, 'D46', 'packet markdown');
requireIncludes(reviewMd, 'Stop if the packet/evidence has not been pushed before review.', 'review markdown');
requireIncludes(reviewMd, 'D45', 'review markdown');
requireIncludes(reviewMd, 'A93', 'review markdown');
requireIncludes(roadmap, 'MTU-H3A | Incidence Pass-Through CLI-Mutation Planning Packet');
if (!/v3\.0[5678]-(?:mtu-h3a-cli-mutation-plan|gate-mtu-h3a-pass-with-conditions|mtu-h3b-incidence-execution-packet|gate-mtu-h3b-pass-with-conditions)/.test(roadmap)) {
  fail('roadmap must be in MTU-H3A planning or post-GATE-MTU-H3A closure lifecycle state');
}

if (fs.existsSync(BUNDLE_URLS)) {
  const bundle = readText(BUNDLE_URLS);
  requireIncludes(bundle, 'review-packet.md', 'bundle urls');
  requireIncludes(bundle, 'review-packet.json', 'bundle urls');
}

if (fs.existsSync(GATE_CLOSURE_JSON)) {
  const closure = readJson(GATE_CLOSURE_JSON);
  const interview = readJson(HUMAN_INTERVIEW_JSON);
  if (closure.status !== 'pass_with_conditions') fail('H3A closure status must be pass_with_conditions');
  if (closure.reviewed_remote_commit !== 'a5f481a8c4a0b5817d5583ddc5303ccba5240458') {
    fail('H3A closure must record reviewed remote commit');
  }
  if (closure.authorized_next.sprint_id !== 'MTU-H3B') fail('H3A closure must authorize MTU-H3B next');
  if (closure.authorized_next.execution_authorized !== false) fail('H3A closure must not authorize execution');
  if (interview.verdict !== 'pass_with_conditions_for_cli_mutation_planning_only_no_execution') {
    fail('H3A human interview verdict mismatch');
  }
  for (const lane of ['D07', 'D41', 'D42', 'D43', 'D44', 'D45', 'D46']) {
    if (!JSON.stringify(closure.accepted_for_later_execution_packet_preparation).includes(lane)) {
      fail(`H3A closure must mention ${lane}`);
    }
  }
  if (!JSON.stringify(closure.conditions).includes('d42_dependency')) fail('H3A closure must require D42 dependency review');
  if (!JSON.stringify(closure.conditions).includes('d45_supply_elasticity')) fail('H3A closure must require D45 supply-elasticity resolution');
  if (closure.authority_boundary.d07_mutation_authorized !== false) fail('H3A closure must not authorize D07 mutation');
  if (closure.authority_boundary.unit_minting_authorized !== false) fail('H3A closure must not authorize unit minting');
  if (closure.authority_boundary.target_exercise_mutation_authorized !== false) {
    fail('H3A closure must not authorize target-exercise mutation');
  }
  requireIncludes(roadmap, 'GATE-MTU-H3A | Incidence Pass-Through CLI-Mutation Plan Human Review | yes');
  if (
    !roadmap.includes('MTU-H3B | Incidence Pass-Through CLI Execution Packet | no') &&
    !roadmap.includes('MTU-H3B | Incidence Pass-Through CLI Execution Packet | yes')
  ) {
    fail('roadmap must include MTU-H3B execution packet row');
  }
}

console.log('OK MTU-H3A incidence CLI-mutation planning packet');
