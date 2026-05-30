#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Keep this checker non-mutating. It validates the H4B execution packet,
 *   review packet, and the current pre-execution baseline.
 * - If a later execution sprint changes the lifecycle, update the allowed
 *   live-state checks deliberately.
 * - Do not write references/machine or references/external from this checker.
 */

const fs = require('fs');
const path = require('path');

const { validateSpec } = require('./unit-add');
const { validate, loadTerminology, loadEindtermen } = require('./build-unit-index');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4b-answer-form-cli-execution-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4b-answer-form-cli-execution-packet.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4B-answer-form-cli-execution', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4B-answer-form-cli-execution', 'review-packet.md');
const BUNDLE_URLS = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4B-answer-form-cli-execution', 'bundle-urls.md');
const H4A_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H4A-answer-form-cli-mutation-plan', 'gate-closure.json');
const H4A_PACKET = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h4a-answer-form-cli-mutation-plan.json');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const CANDIDATE_STORAGE = path.join(ROOT, 'references', 'data', 'exam-ingestion', 'answer-skill-candidates.json');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

const ACCEPTED_IDS = ['A96', 'A97', 'A98', 'A99', 'A80', 'A81'];
const HELD_LANES = [
  'ANS_GRAFISCH_ARCEER_TEKEN',
  'ANS_MOTIVEER_CLASSIFICATIE',
  'ANS_ANALYSEER_BEOORDEEL',
];
const FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'answer_form_execution_authorized',
  'target_exercise_mutation_authorized',
  'question_type_field_writes_authorized',
  'answer_form_field_writes_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'generated_projection_refresh_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'scale_gate_1_authorized',
  'student_product_use_authorized',
];

function fail(message) {
  console.error(`MTU-H4B answer-form CLI execution packet check failed: ${message}`);
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

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function byId(records, id, context) {
  const record = records.find((item) => item.id === id || item.unit_id === id || item.lane === id);
  if (!record) fail(`missing ${context}: ${id}`);
  return record;
}

function arrayEqual(actual, expected, context) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${context} mismatch\nactual:   ${JSON.stringify(actual)}\nexpected: ${JSON.stringify(expected)}`);
  }
}

function commandSpec(commandText) {
  const match = commandText.match(/--spec '(.+)'$/);
  if (!match) fail(`command does not include single-quoted JSON spec: ${commandText}`);
  return JSON.parse(match[1]);
}

function targetRecords(data) {
  return Array.isArray(data) ? data : data.exercises || data.target_exercises || [];
}

function selectedSpecShape(spec) {
  return {
    id: spec.id,
    name: spec.name,
    kern: spec.kern,
    needs: spec.needs,
    exam_codes: spec.exam_codes,
    mastery_target: spec.mastery_target,
    prior_learning: spec.prior_learning,
    aspects: spec.aspects,
    terms: spec.terms,
    procedure: spec.procedure,
    pitfalls: spec.pitfalls,
    generator: spec.generator,
    zero_needs_status: spec.zero_needs_status,
    zero_needs_review: spec.zero_needs_review,
  };
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const h4aClosure = readJson(H4A_CLOSURE);
const h4aPacket = readJson(H4A_PACKET);
const units = readJson(UNITS_JSON);
const targets = readJson(TARGET_EXERCISES);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H4B') fail('packet sprint_id must be MTU-H4B');
if (packet.gate_id !== 'GATE-MTU-H4B-answer-form-cli-execution') fail('packet gate_id mismatch');
if (packet.status !== 'execution_packet_ready_no_mutation') fail('packet status mismatch');
if (packet.source_gate !== 'reports/review-gates/GATE-MTU-H4A-answer-form-cli-mutation-plan/gate-closure.json') {
  fail('packet source gate mismatch');
}
if (packet.source_planning_packet !== 'reports/mtu-hardening/mtu-h4a-answer-form-cli-mutation-plan.json') {
  fail('packet source planning packet mismatch');
}
if (packet.reviewed_h4a_remote_commit !== h4aClosure.reviewed_remote_commit) {
  fail('packet must record the H4A reviewed remote commit');
}
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication');
if (!String(packet.remote_publication_status || '').includes('pushed')) {
  fail('packet remote status must mention pushed evidence');
}

if (h4aClosure.status !== 'pass_with_conditions') fail('H4A closure must be pass_with_conditions');
if (h4aClosure.authorized_next.sprint_id !== 'MTU-H4B') fail('H4A closure must authorize MTU-H4B');
if (h4aClosure.authorized_next.execution_authorized !== false) fail('H4A closure must not authorize execution');
if (h4aPacket.gate_id !== 'GATE-MTU-H4A-answer-form-cli-mutation-plan') fail('H4A packet mismatch');

for (const key of FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
if (unitMap.has('A100')) fail('A100 must not be live');
if (unitMap.has('A71')) fail('A71 must remain absent/held');
const acceptedPresence = ACCEPTED_IDS.map((id) => unitMap.has(id));
const preExecution = acceptedPresence.every((present) => present === false);
const postExecution = acceptedPresence.every((present) => present === true);
if (!preExecution && !postExecution) {
  fail('accepted answer-form IDs must be either all absent before execution or all live after a later execution sprint');
}
if (preExecution && packet.baseline_checks.live_unit_count !== units.length) {
  fail('baseline live unit count must match current pre-execution catalog');
}

const records = targetRecords(targets);
if (records.filter((item) => Object.prototype.hasOwnProperty.call(item, 'question_type')).length !== 0) {
  fail('target exercise question_type fields must remain absent in H4B');
}
if (records.filter((item) => Object.prototype.hasOwnProperty.call(item, 'answer_form')).length !== 0) {
  fail('target exercise answer_form fields must remain absent in H4B');
}
if (fs.existsSync(CANDIDATE_STORAGE)) fail('answer-skill candidate storage must remain absent');

arrayEqual(packet.id_allocation.accepted_for_this_bounded_execution_packet, ACCEPTED_IDS, 'accepted ID allocation');
if (packet.id_allocation.held_id_not_consumed !== 'A71') fail('A71 hold must be explicit');
arrayEqual(packet.id_allocation.invalid_ids_rejected, ['A100'], 'invalid IDs rejected');
if (!String(packet.id_allocation.future_a_domain_growth_requires || '').includes('ID-policy')) {
  fail('future A-domain growth must require ID-policy or namespace decision');
}

if (!Array.isArray(packet.exact_unit_lanes) || packet.exact_unit_lanes.length !== ACCEPTED_IDS.length) {
  fail('packet must include exactly six answer-form unit lanes');
}
arrayEqual(packet.exact_unit_lanes.map((lane) => lane.unit_id), ACCEPTED_IDS, 'unit lane order');
if (!Array.isArray(packet.exact_command_set) || packet.exact_command_set.length !== ACCEPTED_IDS.length) {
  fail('packet must include exactly six exact commands');
}
arrayEqual(packet.exact_command_set.map((command) => command.unit_id), ACCEPTED_IDS, 'command order');

const baseUnits = units.filter((unit) => !ACCEPTED_IDS.includes(unit.id));
const existingIds = new Set(baseUnits.map((unit) => unit.id));
const simulatedSpecs = [];
for (const id of ACCEPTED_IDS) {
  const lane = byId(packet.exact_unit_lanes, id, 'exact unit lane');
  const h4aLane = h4aPacket.proposed_unit_additions.find((item) => item.unit_id === id);
  if (!h4aLane) fail(`missing H4A lane ${id}`);
  if (lane.action !== 'unit-add') fail(`${id} must be a unit-add lane`);
  if (lane.execution_authorized_by_packet !== false) fail(`${id} execution must not be authorized by packet`);
  if (JSON.stringify(lane.reviewed_spec) !== JSON.stringify(h4aLane.reviewed_spec)) {
    fail(`${id} reviewed spec must match H4A planning packet`);
  }
  const specErrors = validateSpec(lane.reviewed_spec, existingIds);
  if (specErrors.length) fail(`${id} validateSpec errors: ${specErrors.join('; ')}`);
  simulatedSpecs.push(lane.reviewed_spec);

  const command = byId(packet.exact_command_set, id, 'exact command');
  if (command.execution_authorized_by_packet !== false) fail(`${id} command must not authorize execution`);
  if (command.dry_run_command !== null) fail(`${id} must not pretend unit-add dry-run exists`);
  if (!String(command.dry_run_limitation || '').includes('unit-add has no dry-run')) {
    fail(`${id} dry-run limitation must be visible`);
  }
  if (!command.execution_command.includes('unit-add.js --spec')) fail(`${id} command must call unit-add --spec`);
  const specFromCommand = commandSpec(command.execution_command);
  if (JSON.stringify(specFromCommand) !== JSON.stringify(lane.reviewed_spec)) {
    fail(`${id} command spec must equal reviewed spec`);
  }
  if (postExecution) {
    const liveUnit = unitMap.get(id);
    if (JSON.stringify(selectedSpecShape(liveUnit)) !== JSON.stringify(selectedSpecShape(lane.reviewed_spec))) {
      fail(`${id} live unit does not match reviewed spec shape`);
    }
  }
}

const simulated = [...baseUnits, ...simulatedSpecs];
const validation = validate(simulated, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
});
if (validation.errors.length) fail(`simulated catalog validation errors: ${validation.errors.join('; ')}`);
if (packet.simulated_catalog_validation.status !== 'passed') fail('packet simulated validation must pass');
if (packet.simulated_catalog_validation.catalog_validation_errors.length !== 0) {
  fail('packet must record zero simulated catalog validation errors');
}
for (const [code, present] of Object.entries(packet.simulated_catalog_validation.exam_code_validation)) {
  if (present !== true) fail(`exam code ${code} must validate`);
}

const a80 = byId(packet.exact_unit_lanes, 'A80', 'A80 lane');
if (!String(a80.split_if_needed_condition || '').includes('Split noem and geef-aan')) {
  fail('A80 must carry split-if-needed condition');
}
const a81 = byId(packet.exact_unit_lanes, 'A81', 'A81 lane');
if (a81.source_use_modifier_only !== true) fail('A81 must be source-use modifier only');
if (a81.standalone_complete_answer_form !== false) fail('A81 must not be standalone complete answer form');
if (!Array.isArray(a81.compatible_underlying_answer_forms) || !a81.compatible_underlying_answer_forms.includes('ANS_BEREKEN')) {
  fail('A81 must list compatible underlying answer forms');
}
if (packet.bron_modifier_boundary.standalone_complete_answer_form !== false) {
  fail('bron modifier boundary must reject standalone complete answer form');
}

arrayEqual(packet.held_lanes.map((lane) => lane.lane), HELD_LANES, 'held lanes');
for (const lane of packet.held_lanes) {
  if (lane.execution_command_present !== false) fail(`${lane.lane} must have no execution command`);
}
if (JSON.stringify(packet.exact_command_set).includes('ANS_GRAFISCH_ARCEER_TEKEN')) {
  fail('graph lane must not appear in command set');
}
if (packet.ex_answer_skill_overlay_boundary.candidate_storage_exists !== false) {
  fail('EX candidate storage must remain absent in packet');
}
if (packet.ex_answer_skill_overlay_boundary.candidate_storage_creation_authorized !== false) {
  fail('candidate storage creation must not be authorized');
}
if (packet.ex_answer_skill_overlay_boundary.candidate_writes_authorized !== false) {
  fail('candidate writes must not be authorized');
}
if (packet.ex_answer_skill_overlay_boundary.q3_q15_hidden_inside_answer_form_mtu !== false) {
  fail('q3/q15 overlays must not be hidden inside broad answer-form MTUs');
}

if (packet.target_mapping_boundary.target_exercise_question_type_writes_authorized !== false) {
  fail('target question_type writes must not be authorized');
}
if (packet.target_mapping_boundary.target_exercise_answer_form_writes_authorized !== false) {
  fail('target answer_form writes must not be authorized');
}

if (packet.generator_exposure_handling.student_facing_exposure_authorized_now !== false) {
  fail('student-facing exposure must not be authorized now');
}
if (packet.generator_exposure_handling.current_skilltree_generator_readiness.student_facing_skilltree_use_authorized !== false) {
  fail('current generator readiness must keep student-facing skilltree use unauthorized');
}
if (packet.generator_exposure_handling.current_skilltree_generator_readiness.generator_exposure_for_blocked_units_authorized !== false) {
  fail('generator-blocked exposure must remain unauthorized');
}
for (const row of packet.generator_exposure_handling.planned_units) {
  if (!ACCEPTED_IDS.includes(row.unit_id)) fail(`unexpected generator row ${row.unit_id}`);
  if (preExecution && row.unit_live_now !== false) fail(`${row.unit_id} must be recorded not live before execution`);
  if (!String(row.condition_before_student_facing_exposure || '').includes('generator-blocked/non-interactive')) {
    fail(`${row.unit_id} must require generator-blocked/non-interactive proof before exposure`);
  }
}

if (review.schema_version !== 1) fail('review schema_version must be 1');
if (review.gate_id !== packet.gate_id) fail('review gate_id mismatch');
if (review.sprint_id !== 'MTU-H4B') fail('review sprint_id must be MTU-H4B');
if (review.source_packet !== 'reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.json') {
  fail('review source packet mismatch');
}
if (review.remote_publication_required_before_review !== true) fail('review must require remote publication');
if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) {
  fail('review must have exactly three calibration questions');
}
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) {
  fail('review must have exactly ten planned questions');
}
for (let i = 1; i <= 10; i += 1) {
  requireIncludes(reviewMd, `MTUH4B-Q${i}`, 'review packet markdown');
}
for (const required of [
  'Exact Unit Specs',
  'Exact Command Set',
  'ID Allocation Proof',
  'Simulated Catalog Validation',
  'Generator And Exposure Guardrails',
  'Rollback Route',
  'Validation Required',
]) {
  requireIncludes(packetMd, required, 'packet markdown');
}
requireIncludes(reviewMd, 'Stop if the packet/evidence has not been pushed before review.', 'review markdown');
requireIncludes(reviewMd, 'A100', 'review markdown');
requireIncludes(reviewMd, 'A71', 'review markdown');
requireIncludes(reviewMd, 'bron', 'review markdown');

if (fs.existsSync(BUNDLE_URLS)) {
  const bundle = readText(BUNDLE_URLS);
  requireIncludes(bundle, 'review-packet.md', 'bundle urls');
  requireIncludes(bundle, 'review-packet.json', 'bundle urls');
}

if (!roadmap.includes('MTU-H4B | Answer-Form Bounded CLI Execution Packet')) {
  fail('roadmap must include MTU-H4B row');
}
if (!roadmap.includes('GATE-MTU-H4B | Answer-Form CLI Execution Human Review')) {
  fail('roadmap must include GATE-MTU-H4B row');
}

console.log('OK MTU-H4B answer-form CLI execution packet');
