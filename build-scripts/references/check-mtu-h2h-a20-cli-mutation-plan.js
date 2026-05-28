#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { validateSpec } = require('./unit-add');
const {
  validate,
  loadTerminology,
  loadEindtermen,
} = require('./build-unit-index');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-cli-mutation-plan.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-cli-mutation-plan.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2H-a20-cli-mutation-plan', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2H-a20-cli-mutation-plan', 'review-packet.md');
const H2G_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2G-a20-split-replacement', 'gate-closure.json');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const GENERATORS_JS = path.join(ROOT, 'engines', 'skilltree', 'generators.js');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

const AUTHORITY_FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'unit_split_execution_authorized',
  'unit_deprecation_authorized',
  'target_exercise_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'target_exercise_promotion_authorized',
  'cp6_closure_authorized',
  'year1_closure_authorized',
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

function fail(message) {
  console.error(`MTU-H2H A20 CLI mutation plan check failed: ${message}`);
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

function sameArray(actual, expected, context) {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${context} must be [${expected.join(', ')}]`);
  }
}

function requireIncludes(values, expected, context) {
  if (!Array.isArray(values)) fail(`${context} must be an array`);
  for (const value of expected) {
    if (!values.includes(value)) fail(`${context} must include ${value}`);
  }
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function unitPlan(packet, id) {
  const item = (packet.unit_mutation_plan || []).find((entry) => entry.unit_id === id);
  if (!item) fail(`missing unit mutation plan for ${id}`);
  return item;
}

function mappingPlan(packet, id) {
  const item = (packet.target_exercise_mapping_plan || []).find((entry) => entry.record_id === id);
  if (!item) fail(`missing target-exercise mapping plan for ${id}`);
  return item;
}

function targetById(exercises, id) {
  const target = exercises.find((record) => record.id === id);
  if (!target) fail(`missing target exercise ${id}`);
  return target;
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const h2gClosure = readJson(H2G_CLOSURE);
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const generators = readText(GENERATORS_JS);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H2H') fail('packet sprint_id must be MTU-H2H');
if (packet.gate_id !== 'GATE-MTU-H2H-a20-cli-mutation-plan') fail('packet gate_id mismatch');
if (packet.status !== 'cli_mutation_plan_ready_no_mutation') fail('packet status mismatch');
if (packet.source_gate !== 'reports/review-gates/GATE-MTU-H2G-a20-split-replacement/gate-closure.json') {
  fail('packet must reference H2G closure as source gate');
}
if (packet.reviewed_h2g_remote_commit !== 'f925da5ed7521c3052c60668599c5a97d99aaf7a') {
  fail('packet must record reviewed H2G remote commit');
}
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('push')) fail('packet remote status must mention push');
if (h2gClosure.status !== 'pass_with_conditions') fail('H2G closure must be pass_with_conditions');
if (h2gClosure.authorized_next.sprint_id !== 'MTU-H2H') fail('H2G closure must authorize MTU-H2H next');

for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
}
requireFalse(packet.authority_boundary, 'generator_change_authorized', 'packet.authority_boundary');

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of packet.baseline.live_units_must_exist) {
  if (!unitMap.has(id)) fail(`live unit ${id} must exist`);
}
const postH2J = unitMap.has('A94') || unitMap.has('A95') || generators.includes('GEN.A95');
if (!postH2J) {
  for (const id of packet.baseline.proposed_new_ids_must_be_absent) {
    if (unitMap.has(id)) fail(`${id} must be absent before H2H execution`);
  }
  if (!generators.includes('GEN.A20')) fail('generators.js must contain current GEN.A20');
} else {
  for (const id of ['A94', 'A95']) {
    if (!unitMap.has(id)) fail(`${id} must exist after MTU-H2J execution`);
  }
  if (generators.includes('GEN.A20 = function ()')) fail('GEN.A20 implementation must be blocked after MTU-H2J execution');
  if (!generators.includes('GEN.A95 = function ()')) fail('GEN.A95 must exist after MTU-H2J execution');
}
if (!generators.includes('MO = ') || !generators.includes('MK = ')) {
  fail('generators.js must include MO/MK evidence for current GEN.A20 classification');
}

const a20 = unitPlan(packet, 'A20');
if (a20.action !== 'unit-update') fail('A20 action must be unit-update');
if (a20.execution_authorized_now !== false) fail('A20 execution_authorized_now must be false');
if (a20.reviewed_spec.name !== 'Winstmaximum oplossen met afgeleide MO en MK') fail('A20 name mismatch');
sameArray(a20.reviewed_spec.needs, ['A12', 'A13', 'A02'], 'A20 needs');
sameArray(a20.reviewed_spec.exam_codes, ['A2.10', 'A2.11', 'A2.12'], 'A20 exam_codes');
sameArray(a20.reviewed_spec.terms, ['marginale-kosten'], 'A20 terms');
if (a20.reviewed_spec.generator !== 'GEN_A20') fail('A20 generator must remain GEN_A20');
if (a20.reviewed_spec.name.includes('afgeleide MO en afgeleide MK')) {
  fail('A20 name must avoid the ambiguous phrase afgeleide MO en afgeleide MK');
}
if (!a20.execution_condition.includes('GEN.A20')) fail('A20 execution condition must mention GEN.A20');

const a94 = unitPlan(packet, 'A94');
if (a94.action !== 'unit-add') fail('A94 action must be unit-add');
if (a94.execution_authorized_now !== false) fail('A94 execution_authorized_now must be false');
sameArray(a94.reviewed_spec.needs, ['A13', 'A02'], 'A94 needs');
sameArray(a94.reviewed_spec.exam_codes, ['A2.10', 'A2.11', 'A2.12'], 'A94 exam_codes');
if (!a94.reviewed_spec.procedure.some((step) => step.includes('MO = marktprijs P'))) {
  fail('A94 procedure must explicitly state price-taker MO = marktprijs P');
}
if (a94.reviewed_spec.needs.includes('A12')) fail('A94 must not require A12');

const a95 = unitPlan(packet, 'A95');
if (a95.action !== 'unit-add') fail('A95 action must be unit-add');
if (a95.execution_authorized_now !== false) fail('A95 execution_authorized_now must be false');
sameArray(a95.reviewed_spec.needs, ['A02'], 'A95 needs');
sameArray(a95.reviewed_spec.exam_codes, ['A2.10', 'A2.12'], 'A95 exam_codes');
if (!a95.generator_status.includes('GEN_A20')) fail('A95 generator status must mention current GEN_A20 behavior');

const knownIds = new Set(units.map((unit) => unit.id).filter((id) => !['A94', 'A95'].includes(id)));
for (const [id, spec] of [
  ['A94', a94.reviewed_spec],
  ['A95', a95.reviewed_spec],
]) {
  const errors = validateSpec(spec, knownIds);
  if (errors.length) fail(`${id} reviewed spec invalid: ${errors.join('; ')}`);
  knownIds.add(id);
}

const simulated = units.filter((unit) => !['A94', 'A95'].includes(unit.id)).map((unit) => ({ ...unit }));
Object.assign(simulated.find((unit) => unit.id === 'A20'), a20.reviewed_spec);
simulated.push(a94.reviewed_spec, a95.reviewed_spec);
const catalogErrors = validate(simulated, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
}).errors;
if (catalogErrors.length) fail(`simulated catalog validation errors: ${catalogErrors.join('; ')}`);

const exercises = targetData.exercises || targetData;
const t322 = targetById(exercises, '3.2.2');
const t333 = targetById(exercises, '3.3.3');
const t412 = targetById(exercises, '4.1.2');
sameArray(
  t322.required_skills,
  postH2J ? mappingPlan(packet, '3.2.2').required_skills_after : mappingPlan(packet, '3.2.2').required_skills_before,
  postH2J ? '3.2.2 required_skills after' : '3.2.2 required_skills before'
);
sameArray(
  t322.prior_knowledge_assumed,
  postH2J ? mappingPlan(packet, '3.2.2').prior_knowledge_assumed_after : mappingPlan(packet, '3.2.2').prior_knowledge_assumed_before,
  postH2J ? '3.2.2 prior after' : '3.2.2 prior before'
);
sameArray(
  t322.new_skills_introduced,
  postH2J ? mappingPlan(packet, '3.2.2').new_skills_introduced_after : mappingPlan(packet, '3.2.2').new_skills_introduced_before,
  postH2J ? '3.2.2 new after' : '3.2.2 new before'
);
sameArray(mappingPlan(packet, '3.2.2').required_skills_after, ['A11', 'A13', 'A94', 'A21', 'A33', 'D30'], '3.2.2 required after');
sameArray(mappingPlan(packet, '3.2.2').prior_knowledge_assumed_after, ['A21', 'D30'], '3.2.2 prior after');
sameArray(mappingPlan(packet, '3.2.2').new_skills_introduced_after, ['A11', 'A13', 'A94', 'A33'], '3.2.2 new after');

sameArray(t333.required_skills, mappingPlan(packet, '3.3.3').required_skills_before, '3.3.3 required before');
sameArray(mappingPlan(packet, '3.3.3').required_skills_after, mappingPlan(packet, '3.3.3').required_skills_before, '3.3.3 required after');
sameArray(
  t412.required_skills,
  postH2J ? mappingPlan(packet, '4.1.2').required_skills_after : mappingPlan(packet, '4.1.2').required_skills_before,
  postH2J ? '4.1.2 required after' : '4.1.2 required before'
);
sameArray(
  t412.prior_knowledge_assumed,
  postH2J ? mappingPlan(packet, '4.1.2').prior_knowledge_assumed_after : mappingPlan(packet, '4.1.2').prior_knowledge_assumed_before,
  postH2J ? '4.1.2 prior after' : '4.1.2 prior before'
);
sameArray(mappingPlan(packet, '4.1.2').required_skills_after, ['A11', 'A91', 'A35', 'A36', 'D18', 'D21', 'D22', 'D24'], '4.1.2 required after');
sameArray(mappingPlan(packet, '4.1.2').prior_knowledge_assumed_after, ['A11', 'A91', 'A35'], '4.1.2 prior after');
for (const id of ['3.2.2', '3.3.3', '4.1.2']) {
  if (mappingPlan(packet, id).mutation_authorized_now !== false) fail(`${id} mapping mutation_authorized_now must be false`);
}

if (packet.generator_plan.preferred_route !== 'move_current_GEN_A20_behavior_to_GEN_A95_or_equivalent_and_create_or_block_new_GEN_A20_for_narrowed_A20') {
  fail('generator preferred route mismatch');
}
if (packet.generator_plan.generator_change_authorized_now !== false) fail('generator change must not be authorized');
if (!packet.projection_refresh_plan.refresh_only_after_authorized_unit_and_mapping_mutations) {
  fail('projection refresh must wait for authorized mutations');
}
if (packet.projection_refresh_plan.pv_projection_authorized_now !== false) fail('PV projection must not be authorized');

for (const command of packet.exact_cli_command_plan || []) {
  if (command.execution_authorized_now !== false) fail(`${command.unit_id} command must not be executable now`);
}
if (!packet.exact_cli_command_plan.find((command) => command.unit_id === 'A20').dry_run_required_before_execution) {
  fail('A20 dry-run must be required');
}
if (packet.exact_cli_command_plan.find((command) => command.unit_id === 'A94').dry_run_available !== false) {
  fail('A94 unit-add dry-run limitation must be visible');
}

for (const required of [
  'Corrected Unit Route',
  'A20 Reviewed Spec',
  'A94 Reviewed Spec',
  'A95 Reviewed Spec',
  'Target-Exercise Mapping Plan',
  'Generator Plan',
  'Projection Guardrails',
]) {
  if (!packetMd.includes(required)) fail(`packet Markdown must include "${required}"`);
}

if (review.schema_version !== 1) fail('review schema_version must be 1');
if (review.gate_id !== 'GATE-MTU-H2H-a20-cli-mutation-plan') fail('review gate_id mismatch');
if (review.sprint_id !== 'MTU-H2H') fail('review sprint_id must be MTU-H2H');
if (review.status !== 'review_packet_ready_no_mutation_authorized') fail('review status mismatch');
if (!String(review.remote_evidence_prerequisite || '').includes('pushed')) fail('review must require pushed evidence');
if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) fail('review must include three calibration questions');
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) fail('review must include ten planned questions');
requireIncludes(review.planned_questions.map((question) => question.id), [
  'MTUH2H-Q1',
  'MTUH2H-Q2',
  'MTUH2H-Q3',
  'MTUH2H-Q4',
  'MTUH2H-Q5',
  'MTUH2H-Q6',
  'MTUH2H-Q7',
  'MTUH2H-Q8',
  'MTUH2H-Q9',
  'MTUH2H-Q10',
], 'review.planned_questions');
for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}
requireFalse(review.authority_boundary, 'generator_change_authorized', 'review.authority_boundary');
for (const required of [
  'Calibration Questions',
  'Full Planned Review Questions',
  'Remote evidence prerequisite',
  'MTUH2H-Q1',
  'MTUH2H-Q10',
  'Current Stop Conditions',
]) {
  if (!reviewMd.includes(required)) fail(`review Markdown must include "${required}"`);
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (MTU-H3|MTU-H2J|GATE-MTU-H2I|MTU-H2I|MTU-H2H|GATE-MTU-H2H) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be MTU-H3, MTU-H2J, GATE-MTU-H2I, MTU-H2I, MTU-H2H, or GATE-MTU-H2H');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) fail('first row must state ACTIVE OPERATIONAL NEXT ACTION');

console.log('OK MTU-H2H A20 CLI mutation planning packet');
