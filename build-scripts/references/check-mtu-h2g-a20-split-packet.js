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
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-split-replacement-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-a20-split-replacement-packet.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2G-a20-split-replacement', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2G-a20-split-replacement', 'review-packet.md');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const GENERATORS_JS = path.join(ROOT, 'engines', 'skilltree', 'generators.js');
const H2F_RESULT = path.join(ROOT, 'references', 'data', 'sprints', 'MTU-H2F.result.json');
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
  console.error(`MTU-H2G A20 split packet check failed: ${message}`);
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

function findLane(packet, laneId) {
  const lanes = packet.proposed_route && packet.proposed_route.candidate_lanes_for_later_planning;
  if (!Array.isArray(lanes)) fail('packet proposed_route.candidate_lanes_for_later_planning must be an array');
  const lane = lanes.find((item) => item.lane_id === laneId);
  if (!lane) fail(`missing proposed lane ${laneId}`);
  return lane;
}

function findTarget(exercises, id) {
  const target = exercises.find((item) => item.id === id);
  if (!target) fail(`missing target exercise ${id}`);
  return target;
}

function containsSkill(record, skillId) {
  const direct = [
    ...(record.required_skills || []),
    ...(record.prior_knowledge_assumed || []),
  ];
  return direct.includes(skillId) || JSON.stringify(record).includes(`"${skillId}"`);
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const units = readJson(UNITS_JSON);
const targetData = readJson(TARGET_EXERCISES);
const generators = readText(GENERATORS_JS);
const h2fResult = readJson(H2F_RESULT);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H2G') fail('packet sprint_id must be MTU-H2G');
if (packet.gate_id !== 'GATE-MTU-H2G-a20-split-replacement') fail('packet gate_id mismatch');
if (packet.status !== 'a20_split_replacement_packet_ready_no_mutation') fail('packet status mismatch');
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication before review');
if (!String(packet.remote_publication_status || '').includes('push')) fail('packet remote publication status must mention push');
if (packet.source_sprint !== 'references/data/sprints/MTU-H2F.result.json') fail('packet must reference MTU-H2F result JSON');

for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
}

if (h2fResult.status !== 'completed') fail('MTU-H2F result must be completed');
requireIncludes(h2fResult.executed_lanes || [], ['A12', 'A88', 'A89', 'A90', 'A92', 'A93'], 'H2F executed_lanes');
requireIncludes(h2fResult.held_lanes || [], ['A20'], 'H2F held_lanes');

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of ['A20', 'A91', 'A12', 'A13', 'A02']) {
  if (!unitMap.has(id)) fail(`live unit ${id} must exist`);
}
for (const id of ['A94', 'A95']) {
  if (unitMap.has(id)) fail(`${id} must remain absent before H2G review`);
}

const a20Live = unitMap.get('A20');
if (a20Live.name !== packet.baseline.a20_current_summary.name) fail('packet A20 baseline name must match live A20');
sameArray(a20Live.needs, ['A12', 'A13', 'A02'], 'live A20 needs');
sameArray(packet.baseline.a20_current_summary.needs, ['A12', 'A13', 'A02'], 'packet A20 baseline needs');
if (a20Live.generator !== 'GEN_A20') fail('live A20 generator must be GEN_A20');
if (packet.baseline.a20_current_summary.generator !== 'GEN_A20') fail('packet A20 baseline generator must be GEN_A20');
if (!String(packet.baseline.a20_current_summary.risk || '').includes('derived MO and derived MK')) {
  fail('packet A20 baseline risk must name derived MO and derived MK');
}

const a91Live = unitMap.get('A91');
if (!a91Live.name.includes('gegeven MK')) fail('live A91 must be the given-MK unit');
sameArray(a91Live.needs, ['A02'], 'live A91 needs');
if (packet.baseline.a91_current_summary.generator !== 'GEN_A91') fail('packet A91 baseline generator must be GEN_A91');

const exercises = targetData.exercises || targetData;
const activeA20Uses = exercises.filter((record) => containsSkill(record, 'A20')).map((record) => record.id).sort();
sameArray(activeA20Uses, ['3.2.2', '3.3.3', '4.1.2'], 'active authored target-exercise A20 uses');

const target322 = findTarget(exercises, '3.2.2');
const target333 = findTarget(exercises, '3.3.3');
const target412 = findTarget(exercises, '4.1.2');
if (!JSON.stringify(target322).includes('price taker') || !JSON.stringify(target322).includes('differentiate TK')) {
  fail('3.2.2 evidence must show price-taker MO and derived MK');
}
if (!JSON.stringify(target333).includes('Differentiate TO') || !JSON.stringify(target333).includes('Differentiate TK')) {
  fail('3.3.3 evidence must show derived MO and derived MK');
}
if (!JSON.stringify(target412).includes('MK =') || !JSON.stringify(target412).includes('constant')) {
  fail('4.1.2 evidence must show given constant MK');
}

const uses = packet.usage_audit.active_target_exercise_uses || [];
const useById = new Map(uses.map((item) => [item.record_id, item]));
for (const id of ['3.2.2', '3.3.3', '4.1.2']) {
  if (!useById.has(id)) fail(`packet usage audit must include ${id}`);
  if (useById.get(id).mutation_ready_now !== false) fail(`${id} mutation_ready_now must be false`);
}
if (useById.get('3.2.2').classification !== 'given_mo_price_taker_plus_derived_mk') fail('3.2.2 classification mismatch');
if (useById.get('3.2.2').current_a20_fit !== 'partial_over_trigger') fail('3.2.2 current fit mismatch');
sameArray(useById.get('3.2.2').recommended_mapping_route, ['A13', 'A94'], '3.2.2 recommended route');
if (useById.get('3.3.3').classification !== 'derived_mo_and_derived_mk') fail('3.3.3 classification mismatch');
sameArray(useById.get('3.3.3').recommended_mapping_route, ['A12', 'A13', 'A20'], '3.3.3 recommended route');
if (useById.get('4.1.2').classification !== 'given_constant_mk') fail('4.1.2 classification mismatch');
sameArray(useById.get('4.1.2').recommended_mapping_route, ['A91'], '4.1.2 recommended route');

if (!generators.includes('GEN.A20')) fail('generators.js must contain GEN.A20');
if (!generators.includes('MO = ') || !generators.includes('MK = ')) fail('generators.js must include MO/MK generator evidence');
const generatorAudit = packet.usage_audit.generator_use || {};
if (generatorAudit.record_id !== 'GEN_A20') fail('generator audit record_id must be GEN_A20');
if (generatorAudit.classification !== 'given_mo_function_plus_given_mk_function') fail('GEN_A20 classification mismatch');
if (!String(generatorAudit.recommended_route || '').includes('A95')) fail('GEN_A20 route must mention A95 or equivalent');

if (packet.usage_audit.procedure_visual_use.classification !== 'report_projection_only') {
  fail('PV/procedure use must be classified as report_projection_only');
}
if (packet.usage_audit.generated_projection_uses.classification !== 'generated_projection_or_historical_context') {
  fail('generated projections must not be authority');
}

if (packet.proposed_route.recommended_disposition !== 'split_or_replacement_packet_before_execution') {
  fail('recommended disposition must require split/replacement packet before execution');
}
requireIncludes(packet.proposed_route.not_recommended || [], [
  'directly narrow A20 without affected target-exercise mapping updates',
  'directly narrow A20 while GEN.A20 still practices given MO/MK functions',
  'leave A20 generic while A91 exists for given constant MK',
], 'packet.proposed_route.not_recommended');

const a20Lane = findLane(packet, 'MTUH2G-A20-UPDATE-DERIVED-BOTH');
if (a20Lane.action_type !== 'unit_update') fail('A20 lane must be a unit_update');
if (a20Lane.target_live_unit_id !== 'A20') fail('A20 lane target must be A20');
sameArray(a20Lane.update_spec.needs, ['A12', 'A13', 'A02'], 'A20 update spec needs');
sameArray(a20Lane.update_spec.terms, ['marginale-kosten'], 'A20 update spec terms');
if (a20Lane.update_spec.generator !== 'GEN_A20') fail('A20 update spec must keep GEN_A20');
if (!String(a20Lane.execution_condition || '').includes('GEN.A20')) fail('A20 execution condition must mention GEN.A20');

const a94Lane = findLane(packet, 'MTUH2G-A94-GIVEN-MO-DERIVED-MK');
if (a94Lane.action_type !== 'unit_add') fail('A94 lane must be unit_add');
if (a94Lane.proposed_unit_id !== 'A94') fail('A94 lane must propose A94');
const a95Lane = findLane(packet, 'MTUH2G-A95-GIVEN-MK-FUNCTION');
if (a95Lane.action_type !== 'unit_add') fail('A95 lane must be unit_add');
if (a95Lane.proposed_unit_id !== 'A95') fail('A95 lane must propose A95');

const knownIds = new Set(units.map((unit) => unit.id));
for (const [id, spec] of [
  ['A94', a94Lane.proposed_spec],
  ['A95', a95Lane.proposed_spec],
]) {
  const errors = validateSpec(spec, knownIds);
  if (errors.length) fail(`${id} proposed spec invalid: ${errors.join('; ')}`);
  if (spec.generator !== `GEN_${id}`) fail(`${id} proposed spec generator must be GEN_${id}`);
  if (!spec.terms.includes('marginale-kosten')) fail(`${id} proposed spec must include marginale-kosten term`);
  knownIds.add(id);
}
sameArray(a94Lane.proposed_spec.needs, ['A13', 'A02'], 'A94 needs');
sameArray(a95Lane.proposed_spec.needs, ['A02'], 'A95 needs');

const simulated = units.map((unit) => ({ ...unit }));
Object.assign(simulated.find((unit) => unit.id === 'A20'), a20Lane.update_spec);
simulated.push(a94Lane.proposed_spec, a95Lane.proposed_spec);
const catalogErrors = validate(simulated, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
}).errors;
if (catalogErrors.length) fail(`simulated catalog validation errors: ${catalogErrors.join('; ')}`);

const mappingLane = findLane(packet, 'MTUH2G-MAPPING-UPDATES');
if (mappingLane.action_type !== 'affected_mapping_update') fail('mapping lane action type mismatch');
const mappings = mappingLane.proposed_mapping_changes || [];
function requireMapping(recordId, key, value) {
  const mapping = mappings.find((item) => item.record_id === recordId);
  if (!mapping) fail(`missing mapping proposal for ${recordId}`);
  if (mapping[key] !== value) fail(`${recordId} mapping ${key} must be ${value}`);
}
requireMapping('3.2.2', 'with', 'A94');
requireMapping('3.3.3', 'keep', 'A20');
requireMapping('4.1.2', 'with', 'A91');
if (!String(mappingLane.execution_condition || '').includes('No target-exercise promotion')) {
  fail('mapping lane must block target-exercise promotion');
}

if (packet.recommended_next_gate.gate_id !== 'GATE-MTU-H2G-a20-split-replacement') {
  fail('recommended next gate mismatch');
}
requireIncludes(packet.recommended_next_gate.not_authorized || [], [
  'A20 mutation',
  'A94 or A95 unit minting',
  'target-exercise mapping writes',
  'generator implementation changes',
  'PV projection',
  'student/product use',
], 'recommended_next_gate.not_authorized');

for (const issue of [
  'A20 used for given constant MK in 4.1.2',
  'A20 over-triggers derivative MO for price-taker 3.2.2',
  'GEN.A20 does not match narrowed derived-both A20 semantics',
]) {
  if (!(packet.quality_log || []).some((entry) => entry.issue === issue)) {
    fail(`quality_log must include ${issue}`);
  }
}

for (const required of [
  'A20 Split',
  'Usage Audit',
  'Proposed A20',
  'GEN.A20',
  'Not Authorized',
  'Recommended Next Action',
]) {
  if (!packetMd.toLowerCase().includes(required.toLowerCase())) fail(`packet Markdown must include "${required}"`);
}

if (review.schema_version !== 1) fail('review schema_version must be 1');
if (review.gate_id !== 'GATE-MTU-H2G-a20-split-replacement') fail('review gate_id mismatch');
if (review.sprint_id !== 'MTU-H2G') fail('review sprint_id must be MTU-H2G');
if (review.status !== 'review_packet_ready_no_mutation_authorized') fail('review status mismatch');
if (!String(review.remote_evidence_prerequisite || '').includes('pushed')) fail('review must require pushed evidence');
if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) {
  fail('review must include three calibration questions');
}
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) {
  fail('review must include ten planned questions');
}
requireIncludes(review.planned_questions.map((question) => question.id), [
  'MTUH2G-Q1',
  'MTUH2G-Q2',
  'MTUH2G-Q3',
  'MTUH2G-Q4',
  'MTUH2G-Q5',
  'MTUH2G-Q6',
  'MTUH2G-Q7',
  'MTUH2G-Q8',
  'MTUH2G-Q9',
  'MTUH2G-Q10',
], 'review.planned_questions');
if (!Array.isArray(review.stop_conditions) || review.stop_conditions.length < 10) fail('review stop_conditions too short');
for (const key of AUTHORITY_FALSE_KEYS) {
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}
for (const required of [
  'Calibration Questions',
  'Full Planned Review Questions',
  'Remote evidence prerequisite',
  'MTUH2G-Q1',
  'MTUH2G-Q10',
  'Current Stop Conditions',
  'pushed',
]) {
  if (!reviewMd.includes(required)) fail(`review Markdown must include "${required}"`);
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (GATE-MTU-H2H|MTU-H2H|GATE-MTU-H2G|MTU-H2G) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be GATE-MTU-H2H, MTU-H2H, GATE-MTU-H2G, or MTU-H2G');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) {
  fail('first Sprint Ledger row must state ACTIVE OPERATIONAL NEXT ACTION');
}

console.log('OK MTU-H2G A20 split/replacement packet');
