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
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-cli-execution-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-cli-execution-packet.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2I-a20-cli-execution', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2I-a20-cli-execution', 'review-packet.md');
const H2H_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2H-a20-cli-mutation-plan', 'gate-closure.json');
const H2H_PLAN = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-cli-mutation-plan.json');
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
  'generator_change_authorized',
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
  console.error(`MTU-H2I A20 CLI execution packet check failed: ${message}`);
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

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function unitLane(packet, id) {
  const item = (packet.unit_lanes || []).find((entry) => entry.unit_id === id);
  if (!item) fail(`missing unit lane for ${id}`);
  return item;
}

function command(packet, id) {
  const item = (packet.exact_command_set || []).find((entry) => entry.unit_id === id);
  if (!item) fail(`missing command for ${id}`);
  return item;
}

function mappingPatch(packet, id) {
  const item = (packet.target_exercise_mapping_patch_plan || []).find((entry) => entry.record_id === id);
  if (!item) fail(`missing mapping patch for ${id}`);
  return item;
}

function targetById(exercises, id) {
  const target = exercises.find((record) => record.id === id);
  if (!target) fail(`missing target exercise ${id}`);
  return target;
}

function jsonCommandSpec(commandText) {
  const match = commandText.match(/--spec '(.+?)'(?: --dry-run)?$/);
  if (!match) fail(`command does not include single-quoted JSON spec: ${commandText}`);
  return JSON.parse(match[1]);
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const h2hClosure = readJson(H2H_CLOSURE);
const h2hPlan = readJson(H2H_PLAN);
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const generators = readText(GENERATORS_JS);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H2I') fail('packet sprint_id must be MTU-H2I');
if (packet.gate_id !== 'GATE-MTU-H2I-a20-cli-execution') fail('packet gate_id mismatch');
if (packet.status !== 'execution_packet_ready_no_mutation') fail('packet status mismatch');
if (packet.source_gate !== 'reports/review-gates/GATE-MTU-H2H-a20-cli-mutation-plan/gate-closure.json') {
  fail('packet must reference H2H closure as source gate');
}
if (packet.source_plan !== 'reports/mtu-hardening/solo-q1-q3-a20-cli-mutation-plan.json') {
  fail('packet must reference H2H mutation plan as source plan');
}
if (packet.reviewed_h2h_remote_commit !== 'd806903cb0072c38c265974642c1bc38fd1c0c69') {
  fail('packet must record reviewed H2H remote commit');
}
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('push')) fail('packet remote status must mention push');
if (h2hClosure.status !== 'pass_with_conditions') fail('H2H closure must be pass_with_conditions');
if (h2hClosure.authorized_next.sprint_id !== 'MTU-H2I') fail('H2H closure must authorize MTU-H2I next');
if (h2hPlan.gate_id !== 'GATE-MTU-H2H-a20-cli-mutation-plan') fail('H2H source plan mismatch');

for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of ['A20', 'A91', 'A12', 'A13', 'A02']) {
  if (!unitMap.has(id)) fail(`live unit ${id} must exist`);
}
const postH2J = unitMap.has('A94') || unitMap.has('A95') || generators.includes('GEN.A95');
if (!postH2J) {
  for (const id of ['A94', 'A95']) {
    if (unitMap.has(id)) fail(`${id} must be absent before H2I execution`);
  }
  if (!generators.includes('GEN.A20')) fail('generators.js must contain current GEN.A20 before execution');
  if (generators.includes('GEN.A95')) fail('GEN.A95 must not already exist before H2I execution packet review');
} else {
  for (const id of ['A94', 'A95']) {
    if (!unitMap.has(id)) fail(`${id} must exist after MTU-H2J execution`);
  }
  if (generators.includes('GEN.A20 = function ()')) fail('GEN.A20 implementation must be blocked after MTU-H2J execution');
  if (!generators.includes('GEN.A95 = function ()')) fail('GEN.A95 must exist after MTU-H2J execution');
}

const a20 = unitLane(packet, 'A20');
if (a20.action !== 'unit-update') fail('A20 action must be unit-update');
if (a20.execution_authorized_by_packet !== false) fail('A20 execution must not be authorized by packet');
if (a20.reviewed_spec.name !== 'Winstmaximum oplossen met afgeleide MO en MK') fail('A20 name mismatch');
sameArray(a20.reviewed_spec.needs, ['A12', 'A13', 'A02'], 'A20 needs');
sameArray(a20.reviewed_spec.exam_codes, ['A2.10', 'A2.11', 'A2.12'], 'A20 exam_codes');
if (a20.reviewed_spec.generator !== 'GEN_A20') fail('A20 generator must be GEN_A20 in the reviewed spec');
if (!a20.execution_condition.includes('generator')) fail('A20 execution condition must mention generator route');

const a94 = unitLane(packet, 'A94');
if (a94.action !== 'unit-add') fail('A94 action must be unit-add');
sameArray(a94.reviewed_spec.needs, ['A13', 'A02'], 'A94 needs');
sameArray(a94.reviewed_spec.exam_codes, ['A2.10', 'A2.11', 'A2.12'], 'A94 exam_codes');
if (a94.reviewed_spec.needs.includes('A12')) fail('A94 must not require A12');
if (!a94.reviewed_spec.procedure.some((step) => step.includes('MO = marktprijs P'))) {
  fail('A94 procedure must explicitly state MO = marktprijs P');
}
if (!a94.reviewed_spec.procedure.some((step) => /volkomen concurrentie|prijsnemer/i.test(step))) {
  fail('A94 procedure must preserve price-taking / volkomen concurrentie wording');
}
if (!String(a94.generator_status_after_execution_if_no_generator_added || '').includes('generator_blocked')) {
  fail('A94 must expose generator-blocked status if no generator is added');
}

const a95 = unitLane(packet, 'A95');
if (a95.action !== 'unit-add') fail('A95 action must be unit-add');
sameArray(a95.reviewed_spec.needs, ['A02'], 'A95 needs');
sameArray(a95.reviewed_spec.exam_codes, ['A2.10', 'A2.12'], 'A95 exam_codes');
if (!a95.reviewed_spec.kern.includes('MK-functie')) fail('A95 must be a given MK-function route');
if (!String(a95.generator_status_after_execution_if_current_GEN_A20_moves || '').includes('GEN.A95')) {
  fail('A95 must be linked to moved current GEN.A20 behavior');
}

const knownIds = new Set(units.map((unit) => unit.id));
if (postH2J) {
  knownIds.delete('A94');
  knownIds.delete('A95');
}
for (const [id, spec] of [
  ['A94', a94.reviewed_spec],
  ['A95', a95.reviewed_spec],
]) {
  const errors = validateSpec(spec, knownIds);
  if (errors.length) fail(`${id} reviewed spec invalid: ${errors.join('; ')}`);
  knownIds.add(id);
}

const simulated = units
  .filter((unit) => !postH2J || !['A94', 'A95'].includes(unit.id))
  .map((unit) => ({ ...unit }));
Object.assign(simulated.find((unit) => unit.id === 'A20'), a20.reviewed_spec);
simulated.push(a94.reviewed_spec, a95.reviewed_spec);
const catalogErrors = validate(simulated, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
}).errors;
if (catalogErrors.length) fail(`simulated catalog validation errors: ${catalogErrors.join('; ')}`);

const a20Dry = command(packet, 'A20');
if (!a20Dry.dry_run_required_before_execution) fail('A20 dry-run must be required');
if (!a20Dry.dry_run_command.includes('--dry-run')) fail('A20 dry-run command must use --dry-run');
if (!a20Dry.execution_command.includes('unit-update.js --id A20')) fail('A20 execution command mismatch');
sameArray(jsonCommandSpec(a20Dry.dry_run_command).exam_codes, ['A2.10', 'A2.11', 'A2.12'], 'A20 dry-run command exam_codes');

for (const id of ['A94', 'A95']) {
  const cmd = command(packet, id);
  if (cmd.dry_run_command !== null) fail(`${id} must not pretend unit-add dry-run exists`);
  if (!String(cmd.dry_run_limitation || '').includes('unit-add has no dry-run')) fail(`${id} dry-run limitation must be visible`);
  if (!cmd.execution_command.includes('unit-add.js --spec')) fail(`${id} execution command must use unit-add`);
  if (cmd.execution_authorized_by_packet !== false) fail(`${id} execution must not be authorized by packet`);
}

const exercises = targetData.exercises || targetData;
for (const id of ['3.2.2', '3.3.3', '4.1.2']) {
  const target = targetById(exercises, id);
  const patch = mappingPatch(packet, id);
  if (!postH2J) {
    sameArray(patch.before.required_skills, target.required_skills, `${id} before.required_skills`);
    sameArray(patch.before.prior_knowledge_assumed, target.prior_knowledge_assumed, `${id} before.prior_knowledge_assumed`);
    sameArray(patch.before.new_skills_introduced, target.new_skills_introduced, `${id} before.new_skills_introduced`);
  } else {
    sameArray(patch.after.required_skills, target.required_skills, `${id} after.required_skills`);
    sameArray(patch.after.prior_knowledge_assumed, target.prior_knowledge_assumed, `${id} after.prior_knowledge_assumed`);
    sameArray(patch.after.new_skills_introduced, target.new_skills_introduced, `${id} after.new_skills_introduced`);
  }
  if (patch.mutation_authorized_now !== false) fail(`${id} mapping mutation_authorized_now must be false`);
}
sameArray(mappingPatch(packet, '3.2.2').after.required_skills, ['A11', 'A13', 'A94', 'A21', 'A33', 'D30'], '3.2.2 after.required_skills');
sameArray(mappingPatch(packet, '3.2.2').after.prior_knowledge_assumed, ['A21', 'D30'], '3.2.2 after.prior');
sameArray(mappingPatch(packet, '3.2.2').after.new_skills_introduced, ['A11', 'A13', 'A94', 'A33'], '3.2.2 after.new');
sameArray(mappingPatch(packet, '3.3.3').after.required_skills, mappingPatch(packet, '3.3.3').before.required_skills, '3.3.3 unchanged required');
sameArray(mappingPatch(packet, '4.1.2').after.required_skills, ['A11', 'A91', 'A35', 'A36', 'D18', 'D21', 'D22', 'D24'], '4.1.2 after.required_skills');
sameArray(mappingPatch(packet, '4.1.2').after.prior_knowledge_assumed, ['A11', 'A91', 'A35'], '4.1.2 after.prior');
if (!mappingPatch(packet, '4.1.2').execution_note.includes('record_status')) fail('mapping notes must block target-exercise promotion fields');

if (packet.generator_route.mutation_authorized_now !== false) fail('generator mutation must not be authorized now');
if (packet.generator_route.preferred_execution_route !== 'move_current_GEN_A20_behavior_to_GEN_A95_and_block_GEN_A20_until_narrowed_generator_exists') {
  fail('generator preferred route mismatch');
}
for (const required of ['GEN.A95', 'GEN.A20', 'A94']) {
  if (!JSON.stringify(packet.generator_route).includes(required)) fail(`generator route must mention ${required}`);
}
const expectedStatuses = new Map(packet.generator_route.expected_generator_status_after_execution.map((row) => [row.unit_id, row.expected_status]));
if (!String(expectedStatuses.get('A20') || '').includes('generator_blocked')) fail('A20 expected generator status must be blocked');
if (!String(expectedStatuses.get('A94') || '').includes('generator_blocked')) fail('A94 expected generator status must be blocked unless implemented');
if (!String(expectedStatuses.get('A95') || '').includes('interactive')) fail('A95 expected generator status must mention interactive if GEN.A20 moves');
if (packet.generator_route.student_facing_skilltree_use_authorized_now !== false) fail('student-facing skilltree use must not be authorized');
if (packet.generator_route.pv_projection_authorized_now !== false) fail('PV projection must not be authorized');

if (!packet.projection_refresh_plan.refresh_only_after_authorized_unit_mapping_and_generator_mutations) {
  fail('projection refresh must wait for authorized source mutations');
}
if (!String(packet.projection_refresh_plan.source_vs_projection_boundary || '').includes('authored source')) {
  fail('projection plan must distinguish authored source from generated projections');
}
if (packet.projection_refresh_plan.pv_projection_authorized_now !== false) fail('PV projection must be false');
if (packet.recommended_next_gate.gate_id !== 'GATE-MTU-H2I-a20-cli-execution') fail('recommended next gate mismatch');

for (const required of [
  'Exact Unit Specs',
  'Exact Command Set',
  'Target-Exercise Mapping Patch',
  'Generator Route',
  'Rollback Route',
  'Validation Required',
  'Projection Guardrails',
]) {
  if (!packetMd.includes(required)) fail(`packet Markdown must include "${required}"`);
}

if (review.schema_version !== 1) fail('review schema_version must be 1');
if (review.gate_id !== 'GATE-MTU-H2I-a20-cli-execution') fail('review gate_id mismatch');
if (review.sprint_id !== 'MTU-H2I') fail('review sprint_id must be MTU-H2I');
if (review.status !== 'review_packet_ready_no_mutation_authorized') fail('review status mismatch');
if (!String(review.remote_evidence_prerequisite || '').includes('pushed')) fail('review must require pushed evidence');
if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) fail('review must include three calibration questions');
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) fail('review must include ten planned questions');
if (!review.planned_questions.some((question) => question.id === 'MTUH2I-Q5' && /GEN\.A20/.test(question.question))) {
  fail('review question Q5 must cover GEN.A20 route');
}
for (const required of [
  'Calibration Questions',
  'Full Planned Review Questions',
  'Remote evidence prerequisite',
  'MTUH2I-Q1',
  'MTUH2I-Q10',
  'Current Stop Conditions',
]) {
  if (!reviewMd.includes(required)) fail(`review Markdown must include "${required}"`);
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (MTU-H3|MTU-H2J|GATE-MTU-H2I|MTU-H2I) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be MTU-H3, MTU-H2J, GATE-MTU-H2I, or MTU-H2I');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) fail('first row must state ACTIVE OPERATIONAL NEXT ACTION');

console.log('OK MTU-H2I A20 CLI execution packet');
