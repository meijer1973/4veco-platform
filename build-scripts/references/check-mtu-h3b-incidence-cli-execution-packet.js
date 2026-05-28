#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker non-mutating. It validates the H3B execution packet,
 *   review packet, and current baseline evidence only.
 * - If reviewed lane IDs change, update the D41/D42/D43/D45/D46 lane set and
 *   mapping checks here and in the packet together.
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
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3b-incidence-cli-execution-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3b-incidence-cli-execution-packet.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3B-incidence-cli-execution', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3B-incidence-cli-execution', 'review-packet.md');
const BUNDLE_URLS = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3B-incidence-cli-execution', 'bundle-urls.md');
const H3A_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H3A-incidence-cli-mutation-plan', 'gate-closure.json');
const H3A_PLAN = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h3a-incidence-cli-mutation-plan.json');
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

const EXECUTION_IDS = ['D41', 'D42', 'D43', 'D45', 'D46'];

function fail(message) {
  console.error(`MTU-H3B incidence CLI execution packet check failed: ${message}`);
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

function commandSpec(commandText) {
  const match = commandText.match(/--spec '(.+?)'(?: --dry-run)?$/);
  if (!match) fail(`command does not include single-quoted JSON spec: ${commandText}`);
  return JSON.parse(match[1]);
}

function exercisesList(data) {
  return Array.isArray(data) ? data : data.exercises;
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const h3aClosure = readJson(H3A_CLOSURE);
const h3aPlan = readJson(H3A_PLAN);
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H3B') fail('packet sprint_id must be MTU-H3B');
if (packet.gate_id !== 'GATE-MTU-H3B-incidence-cli-execution') fail('packet gate_id mismatch');
if (packet.status !== 'execution_packet_ready_no_mutation') fail('packet status mismatch');
if (packet.source_gate !== 'reports/review-gates/GATE-MTU-H3A-incidence-cli-mutation-plan/gate-closure.json') {
  fail('packet must reference H3A closure as source gate');
}
if (packet.source_plan !== 'reports/mtu-hardening/mtu-h3a-incidence-cli-mutation-plan.json') {
  fail('packet must reference H3A plan as source plan');
}
if (packet.reviewed_h3a_remote_commit !== 'a5f481a8c4a0b5817d5583ddc5303ccba5240458') {
  fail('packet must record reviewed H3A remote commit');
}
if (packet.source_h3a_closure_remote_commit !== 'bd40e1a707f2365226ce6719e85de9f964db0283') {
  fail('packet must record pushed H3A closure commit');
}
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('push')) fail('packet remote status must mention push');

if (h3aClosure.status !== 'pass_with_conditions') fail('H3A closure must be pass_with_conditions');
if (h3aClosure.authorized_next.sprint_id !== 'MTU-H3B') fail('H3A closure must authorize MTU-H3B');
if (h3aClosure.authorized_next.execution_authorized !== false) fail('H3A closure must not authorize execution');
if (h3aPlan.gate_id !== 'GATE-MTU-H3A-incidence-cli-mutation-plan') fail('H3A plan mismatch');

if (packet.execution_scope.no_direct_execution_from_h3b_packet !== true) fail('packet must not authorize direct execution');
if (packet.execution_scope.coupled_execution_required !== true) fail('packet must require coupled execution');
if (!packet.execution_scope.held_lanes.includes('D44')) fail('D44 must be held in execution scope');

for (const key of FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of ['D07', 'D05', 'A38', 'A41', 'A93', 'A15']) {
  if (!unitMap.has(id)) fail(`${id} must be live in the baseline`);
}
const d07Live = unitMap.get('D07');
arrayEqual(d07Live.needs, ['D05', 'A15'], 'live D07 baseline needs');
if (!String(d07Live.kern || '').includes('percentage')) fail('live D07 must still provide percentage evidence');
if (!String(unitMap.get('A93').kern || '').includes('onderscheid dit van pass-through')) {
  fail('A93 must preserve price-change/pass-through boundary');
}
for (const id of ['D41', 'D42', 'D43', 'D44', 'D45', 'D46']) {
  if (unitMap.has(id)) fail(`${id} must be absent before H3B execution`);
}

if (packet.h3a_condition_resolution.d42_dependency_review.decision !== 'revise_D42_to_zero_needs_with_context_mapping') {
  fail('D42 dependency resolution mismatch');
}
arrayEqual(packet.h3a_condition_resolution.d42_dependency_review.reviewed_spec_needs, [], 'D42 resolution needs');
if (packet.h3a_condition_resolution.d45_supply_elasticity_resolution.decision !== 'qualitative_internal_supply_elasticity_reasoning') {
  fail('D45 supply-elasticity resolution mismatch');
}
if (packet.h3a_condition_resolution.d44_resolution.decision !== 'held_out_of_execution_command_set') {
  fail('D44 resolution mismatch');
}

const additionSpecs = [];
for (const id of EXECUTION_IDS) {
  const lane = byId(packet.unit_lanes, id, 'unit lane');
  if (lane.action !== 'unit-add') fail(`${id} action must be unit-add`);
  if (lane.execution_authorized_by_packet !== false) fail(`${id} execution must not be authorized`);
  const spec = lane.reviewed_spec;
  if (spec.id !== id) fail(`${id} reviewed_spec.id mismatch`);
  const errors = validateSpec(spec, new Set(units.map((unit) => unit.id)));
  if (errors.length) fail(`${id} validateSpec errors: ${errors.join('; ')}`);
  additionSpecs.push(spec);
}
const d41 = byId(packet.unit_lanes, 'D41', 'unit lane').reviewed_spec;
arrayEqual(d41.needs, ['D05'], 'D41 needs');
if (JSON.stringify(d41).includes('A40') || JSON.stringify(d41).includes('D29')) {
  fail('D41 must not import welfare-area units');
}
const d42 = byId(packet.unit_lanes, 'D42', 'unit lane').reviewed_spec;
arrayEqual(d42.needs, [], 'D42 needs');
if (d42.zero_needs_status !== 'underbouw_assumed') fail('D42 must record underbouw-assumed zero-needs status');
if (!d42.zero_needs_review || !String(d42.zero_needs_review.rationale || '').includes('must not force graphical D41')) {
  fail('D42 zero_needs_review must explain avoiding D41 over-trigger');
}
const d43 = byId(packet.unit_lanes, 'D43', 'unit lane').reviewed_spec;
arrayEqual(d43.needs, ['A41'], 'D43 needs');
const d45 = byId(packet.unit_lanes, 'D45', 'unit lane').reviewed_spec;
arrayEqual(d45.needs, ['A15'], 'D45 needs');
if (!JSON.stringify(d45).toLowerCase().includes('aanbodelasticiteit')) {
  fail('D45 must make supply-elasticity scope visible');
}
if (!JSON.stringify(d45).toLowerCase().includes('kwalitatief')) {
  fail('D45 must state qualitative supply-elasticity treatment');
}
const d46 = byId(packet.unit_lanes, 'D46', 'unit lane').reviewed_spec;
arrayEqual(d46.needs, ['A93'], 'D46 needs');
if (!JSON.stringify(d46).includes('kostenstijging')) fail('D46 must use cost shock as denominator');

const d07Lane = byId(packet.unit_lanes, 'D07', 'unit lane');
if (d07Lane.action !== 'unit-update') fail('D07 action must be unit-update');
if (d07Lane.execution_authorized_by_packet !== false) fail('D07 execution must not be authorized');
const d07Patch = d07Lane.reviewed_patch;
arrayEqual(d07Patch.needs, ['D42', 'A38'], 'D07 patch needs');
if (d07Patch.needs.includes('A15')) fail('D07 patch must not depend on A15');
if (!Array.isArray(d07Patch.procedure) || d07Patch.procedure.some((step) => /elastic/i.test(step))) {
  fail('D07 patch procedure must not contain elasticity explanation');
}

const heldD44 = byId(packet.held_lanes, 'D44', 'held lane');
if (heldD44.execution_command_present !== false) fail('D44 must have no execution command');
if (packet.exact_command_set.some((cmd) => cmd.unit_id === 'D44')) fail('D44 must not appear in command set');

for (const id of EXECUTION_IDS) {
  const cmd = byId(packet.exact_command_set, id, 'command');
  if (cmd.dry_run_command !== null) fail(`${id} must not pretend unit-add dry-run exists`);
  if (!String(cmd.dry_run_limitation || '').includes('unit-add has no dry-run')) fail(`${id} dry-run limitation must be visible`);
  if (!cmd.execution_command.includes('unit-add.js --spec')) fail(`${id} command must use unit-add`);
  if (cmd.execution_authorized_by_packet !== false) fail(`${id} command must not authorize execution`);
  const spec = commandSpec(cmd.execution_command);
  if (spec.id !== id) fail(`${id} command spec id mismatch`);
}
const d07Cmd = byId(packet.exact_command_set, 'D07', 'command');
if (!d07Cmd.dry_run_command.includes('--dry-run')) fail('D07 dry-run command must use --dry-run');
if (!d07Cmd.execution_command.includes('unit-update.js --id D07')) fail('D07 execution command mismatch');
arrayEqual(commandSpec(d07Cmd.dry_run_command).needs, ['D42', 'A38'], 'D07 dry-run command needs');

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

const m311 = byId(packet.target_exercise_mapping_patch_plan, '3.1.1', 'mapping plan');
arrayEqual(m311.before.required_skills, e311.required_skills, '3.1.1 before required');
arrayEqual(m311.before.prior_knowledge_assumed, e311.prior_knowledge_assumed, '3.1.1 before prior');
arrayEqual(m311.before.new_skills_introduced, e311.new_skills_introduced, '3.1.1 before new');
arrayEqual(m311.before.missing_units_flagged, e311.missing_units_flagged, '3.1.1 before missing');
arrayEqual(m311.after.required_skills, ['A06', 'A23', 'A41', 'D05', 'D41'], '3.1.1 after required');
arrayEqual(m311.after.new_skills_introduced, ['A23', 'A41', 'D05', 'D41'], '3.1.1 after new');
arrayEqual(m311.after.missing_units_flagged, [], '3.1.1 after missing');

const m312 = byId(packet.target_exercise_mapping_patch_plan, '3.1.2', 'mapping plan');
arrayEqual(m312.before.required_skills, e312.required_skills, '3.1.2 before required');
arrayEqual(m312.before.prior_knowledge_assumed, e312.prior_knowledge_assumed, '3.1.2 before prior');
arrayEqual(m312.before.new_skills_introduced, e312.new_skills_introduced, '3.1.2 before new');
arrayEqual(m312.before.missing_units_flagged, e312.missing_units_flagged, '3.1.2 before missing');
arrayEqual(m312.after.required_skills, ['A10', 'A19', 'A23', 'A32', 'A40', 'D03', 'D41', 'D42', 'D07'], '3.1.2 after required');
arrayEqual(m312.after.prior_knowledge_assumed, ['A10', 'A19', 'A23', 'A40', 'D41'], '3.1.2 after prior');
arrayEqual(m312.after.new_skills_introduced, ['A32', 'D03', 'D42', 'D07'], '3.1.2 after new');
if (m312.after.missing_units_flagged.length !== 1) fail('3.1.2 after must keep only surplus identity missing flag');
if (!String(m312.execution_note || '').includes('D42 itself does not depend on D41')) {
  fail('3.1.2 mapping note must preserve D42/D41 boundary');
}

const m313 = byId(packet.target_exercise_mapping_patch_plan, '3.1.3', 'mapping plan');
arrayEqual(m313.before.required_skills, e313.required_skills, '3.1.3 before required');
arrayEqual(m313.before.prior_knowledge_assumed, e313.prior_knowledge_assumed, '3.1.3 before prior');
arrayEqual(m313.before.new_skills_introduced, e313.new_skills_introduced, '3.1.3 before new');
arrayEqual(m313.before.missing_units_flagged, e313.missing_units_flagged, '3.1.3 before missing');
arrayEqual(m313.after.required_skills, ['A06', 'A10', 'A19', 'A27', 'A41', 'D19', 'D29', 'D43'], '3.1.3 after required');
arrayEqual(m313.after.new_skills_introduced, ['A27', 'D19', 'D29', 'D43'], '3.1.3 after new');
if (!m313.held_mapping || m313.held_mapping.unit_id !== 'D44') fail('3.1.3 must hold D44 mapping');

if (packet.a93_boundary_proof.must_not_change_a93_in_h3b !== true) fail('A93 must not be changed in H3B');
if (!String(packet.a93_boundary_proof.boundary_test || '').includes('old price')) {
  fail('A93 boundary proof must name denominator difference');
}
if (packet.projection_refresh_plan.generated_projection_refresh_authorized_now !== false) {
  fail('projection refresh must not be authorized now');
}
if (packet.projection_refresh_plan.refresh_only_after_authorized_unit_and_mapping_mutations !== true) {
  fail('projection refresh must be downstream of authorized source mutation');
}

if (review.schema_version !== 1) fail('review schema_version must be 1');
if (review.gate_id !== packet.gate_id) fail('review gate_id mismatch');
if (review.sprint_id !== 'MTU-H3B') fail('review sprint_id must be MTU-H3B');
if (review.source_packet !== 'reports/mtu-hardening/mtu-h3b-incidence-cli-execution-packet.json') {
  fail('review source_packet mismatch');
}
if (review.remote_publication_required_before_review !== true) fail('review must require remote publication');
if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) {
  fail('review must have exactly 3 calibration questions');
}
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) {
  fail('review must have exactly 10 planned questions');
}
for (let i = 1; i <= 10; i += 1) {
  requireIncludes(reviewMd, `MTUH3B-Q${i}`, 'review packet markdown');
}
if (!review.planned_questions.some((question) => question.id === 'MTUH3B-Q2' && /D42/.test(question.question))) {
  fail('review question Q2 must cover D42 dependency resolution');
}
if (!review.planned_questions.some((question) => question.id === 'MTUH3B-Q7' && /D44/.test(question.question))) {
  fail('review question Q7 must cover D44 held lane');
}

for (const required of [
  'Exact Unit Specs',
  'Exact Command Set',
  'Target-Exercise Mapping Patch',
  'Rollback Route',
  'Validation Required',
  'Projection Guardrails',
]) {
  requireIncludes(packetMd, required, 'packet markdown');
}
requireIncludes(reviewMd, 'Stop if the packet/evidence has not been pushed before review.', 'review markdown');
requireIncludes(reviewMd, 'D42', 'review markdown');
requireIncludes(reviewMd, 'D44', 'review markdown');
requireIncludes(reviewMd, 'A93', 'review markdown');

if (fs.existsSync(BUNDLE_URLS)) {
  const bundle = readText(BUNDLE_URLS);
  requireIncludes(bundle, 'review-packet.md', 'bundle urls');
  requireIncludes(bundle, 'review-packet.json', 'bundle urls');
}

requireIncludes(roadmap, 'MTU-H3B | Incidence Pass-Through CLI Execution Packet');
if (!/v3\.0[67]-(?:gate-mtu-h3a-pass-with-conditions|mtu-h3b-incidence-execution-packet)/.test(roadmap)) {
  fail('roadmap must be in post-H3A or H3B execution-packet lifecycle state');
}

console.log('OK MTU-H3B incidence CLI execution packet');
