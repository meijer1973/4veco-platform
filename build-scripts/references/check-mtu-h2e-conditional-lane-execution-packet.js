#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const { validateSpec } = require('./unit-add');
const {
  validate,
  loadTerminology,
  loadEindtermen,
} = require('./build-unit-index');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-conditional-lane-execution-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-conditional-lane-execution-packet.md');
const REVIEW_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2E-conditional-lane-execution', 'review-packet.json');
const REVIEW_MD = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2E-conditional-lane-execution', 'review-packet.md');
const H2D_CLOSURE_JSON = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2D-held-conditional-lanes', 'gate-closure.json');
const H2D_RESOLUTION_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-held-conditional-resolution.json');
const UNITS_JSON = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const GENERATORS_JS = path.join(ROOT, 'engines', 'skilltree', 'generators.js');
const ROADMAP = path.join(ROOT, 'references', 'reference-team-roadmap.md');

const REVIEWABLE = ['A12', 'A88', 'A89', 'A90', 'A92', 'A93'];
const NEW_IDS = ['A88', 'A89', 'A90', 'A92', 'A93'];
const MISSING_GENERATORS = ['GEN_A88', 'GEN_A89', 'GEN_A90', 'GEN_A92', 'GEN_A93'];

function fail(message) {
  console.error(`MTU-H2E conditional-lane execution packet check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file)}`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(ROOT, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function requireFalse(object, key, context) {
  if (!object || object[key] !== false) fail(`${context}.${key} must be false`);
}

function requireIncludes(values, expected, context) {
  if (!Array.isArray(values)) fail(`${context} must be an array`);
  for (const value of expected) {
    if (!values.includes(value)) fail(`${context} must include ${value}`);
  }
}

function sameArray(actual, expected, context) {
  if (!Array.isArray(actual) || actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${context} must be [${expected.join(', ')}]`);
  }
}

function byId(items, key = 'unit_id') {
  return new Map(items.map((item) => [item[key], item]));
}

function dryRunA12(spec) {
  const result = spawnSync(process.execPath, [
    path.join('build-scripts', 'references', 'unit-update.js'),
    '--id',
    'A12',
    '--spec',
    JSON.stringify(spec),
    '--dry-run',
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    fail(`A12 unit-update dry-run failed: ${(result.stdout || '')}${(result.stderr || '')}`);
  }
}

function commandSpec(command) {
  const match = command.execution_command.match(/--spec '(.+)'$/);
  if (!match) fail(`${command.unit_id} execution command must end with --spec '<JSON>'`);
  return JSON.parse(match[1]);
}

function requireLiveMatchesSpec(live, spec, context) {
  for (const key of [
    'id',
    'name',
    'kern',
    'mastery_target',
    'prior_learning',
    'zero_needs_status',
    'generator',
  ]) {
    if (Object.prototype.hasOwnProperty.call(spec, key) && live[key] !== spec[key]) {
      fail(`${context} live ${key} must match reviewed spec`);
    }
  }
  for (const key of [
    'needs',
    'exam_codes',
    'aspects',
    'terms',
    'procedure',
    'pitfalls',
  ]) {
    if (Object.prototype.hasOwnProperty.call(spec, key)) {
      sameArray(live[key] || [], spec[key] || [], `${context} live ${key}`);
    }
  }
  if (spec.zero_needs_review) {
    const liveReview = JSON.stringify(live.zero_needs_review || {});
    const specReview = JSON.stringify(spec.zero_needs_review);
    if (liveReview !== specReview) fail(`${context} live zero_needs_review must match reviewed spec`);
  }
}

const packet = readJson(PACKET_JSON);
const packetMd = readText(PACKET_MD);
const review = readJson(REVIEW_JSON);
const reviewMd = readText(REVIEW_MD);
const h2dClosure = readJson(H2D_CLOSURE_JSON);
const h2dResolution = readJson(H2D_RESOLUTION_JSON);
const units = readJson(UNITS_JSON);
const generators = readText(GENERATORS_JS);
const roadmap = readText(ROADMAP);

if (packet.schema_version !== 1) fail('packet schema_version must be 1');
if (packet.sprint_id !== 'MTU-H2E') fail('packet sprint_id must be MTU-H2E');
if (packet.gate_id !== 'GATE-MTU-H2E-conditional-lane-execution') fail('packet gate_id mismatch');
if (packet.status !== 'execution_packet_ready_no_mutation') fail('packet status must be execution_packet_ready_no_mutation');
if (packet.remote_publication_required_before_review !== true) fail('packet must require remote publication before review');
if (!String(packet.remote_publication_status || '').includes('push')) fail('packet remote status must mention push');
if (packet.h2d_remote_evidence_commit !== '63c2e53731af3941d49183628f4ba5927f8ac551') {
  fail('packet must record H2D remote evidence commit');
}
if (h2dClosure.status !== 'pass_with_conditions') fail('source H2D gate must be closed pass_with_conditions');
if (h2dResolution.status !== 'resolution_packet_ready_no_mutation') fail('source H2D resolution status mismatch');

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
]) {
  requireFalse(packet.authority_boundary, key, 'packet.authority_boundary');
}

sameArray(packet.execution_scope.reviewable_lanes, REVIEWABLE, 'packet.execution_scope.reviewable_lanes');
sameArray(packet.execution_scope.held_out_of_scope, ['A20'], 'packet.execution_scope.held_out_of_scope');
if (packet.execution_scope.no_direct_execution_from_h2e_packet !== true) fail('packet must block direct execution');

const unitMap = new Map(units.map((unit) => [unit.id, unit]));
for (const id of ['A12', 'A20', 'A38', 'A04']) {
  if (!unitMap.has(id)) fail(`live unit ${id} must exist`);
}
const h2fPresentIds = NEW_IDS.filter((id) => unitMap.has(id));
const h2fExecuted = h2fPresentIds.length === NEW_IDS.length;
if (h2fPresentIds.length && !h2fExecuted) {
  fail(`H2F execution state is partial; expected all or none of ${NEW_IDS.join(', ')} live`);
}
if (!h2fExecuted) {
  for (const id of NEW_IDS) {
    if (unitMap.has(id)) fail(`${id} must remain absent before H2F execution`);
  }
}
if (!(unitMap.get('A12').exam_codes || []).includes('A2.11')) fail('live A12 must retain A2.11');
if (!generators.includes('GEN.A12')) fail('generators.js must contain GEN.A12');
if (!generators.includes('GEN.A20')) fail('generators.js must contain GEN.A20');
for (const generator of ['GEN.A88', 'GEN.A89', 'GEN.A90', 'GEN.A92', 'GEN.A93']) {
  if (generators.includes(generator)) fail(`${generator} must be absent in current baseline`);
}

const laneSummaries = byId(packet.lane_summaries);
const commands = byId(packet.exact_command_set);
sameArray(packet.lane_summaries.map((lane) => lane.unit_id), REVIEWABLE, 'packet.lane_summaries order');
sameArray(packet.exact_command_set.map((command) => command.unit_id), REVIEWABLE, 'packet.exact_command_set order');
for (const id of REVIEWABLE) {
  if (!commands.get(id).execution_command.includes('build-scripts/references/')) {
    fail(`${id} command must use reference CLI`);
  }
  if (commands.get(id).execution_authorized_by_packet !== false) {
    fail(`${id} command must not be authorized by packet`);
  }
  if (commands.get(id).extracted_spec_must_be_logged !== true) {
    fail(`${id} command must require extracted spec logging`);
  }
}

const a12Spec = commandSpec(commands.get('A12'));
if (commands.get('A12').action !== 'unit-update') fail('A12 action must be unit-update');
if (!commands.get('A12').dry_run_command || !commands.get('A12').dry_run_command.includes('--dry-run')) {
  fail('A12 command must include dry-run command');
}
requireIncludes(a12Spec.exam_codes || [], ['A2.11'], 'A12 spec exam_codes');
sameArray(a12Spec.needs, ['A11', 'A07'], 'A12 spec needs');
if (a12Spec.generator !== 'GEN_A12') fail('A12 spec must keep GEN_A12');
dryRunA12(a12Spec);

const specs = new Map();
const specKnownIds = new Set(units
  .map((unit) => unit.id)
  .filter((id) => !NEW_IDS.includes(id)));
for (const id of NEW_IDS) {
  const command = commands.get(id);
  if (command.action !== 'unit-add') fail(`${id} action must be unit-add`);
  if (command.dry_run_command !== null) fail(`${id} unit-add dry_run_command must be null`);
  if (!String(command.dry_run_limitation || '').includes('no dry-run')) fail(`${id} must expose unit-add dry-run limitation`);
  const spec = commandSpec(command);
  specs.set(id, spec);
  const errors = validateSpec(spec, specKnownIds);
  if (errors.length) fail(`${id} validateSpec errors: ${errors.join('; ')}`);
  specKnownIds.add(id);
}

sameArray(specs.get('A88').needs, [], 'A88 needs');
if (specs.get('A88').zero_needs_status !== 'true_zero') fail('A88 must be true_zero');
if (!specs.get('A88').zero_needs_review || !specs.get('A88').zero_needs_review.rationale) fail('A88 must include zero_needs_review rationale');
sameArray(specs.get('A89').needs, [], 'A89 needs');
if (specs.get('A89').zero_needs_status !== 'true_zero') fail('A89 must be true_zero');
if (!specs.get('A89').zero_needs_review || !specs.get('A89').zero_needs_review.rationale) fail('A89 must include zero_needs_review rationale');
sameArray(specs.get('A90').needs, ['A89'], 'A90 needs');
if ((specs.get('A90').procedure || []).join(' ').toLowerCase().includes('tabel')) fail('A90 procedure must not include table route');
if ((specs.get('A90').procedure || []).join(' ').toLowerCase().includes('grafiek')) fail('A90 procedure must not include graph route');
sameArray(specs.get('A92').needs, ['A04', 'A89'], 'A92 needs');
sameArray(specs.get('A93').needs, ['A38', 'A92'], 'A93 needs');
if (specs.get('A93').needs.includes('A66')) fail('A93 must not depend on A66');
if (!(specs.get('A93').pitfalls || []).some((pitfall) => pitfall.includes('niet hetzelfde als het percentage van de kostenstijging'))) {
  fail('A93 must keep price-change versus pass-through pitfall');
}

if (h2fExecuted) {
  for (const id of NEW_IDS) requireLiveMatchesSpec(unitMap.get(id), specs.get(id), id);
  requireIncludes(unitMap.get('A12').exam_codes || [], ['A2.11'], 'live A12 exam_codes');
}

const simulated = units.map((unit) => ({ ...unit }));
Object.assign(simulated.find((unit) => unit.id === 'A12'), a12Spec);
if (!h2fExecuted) {
  for (const id of NEW_IDS) simulated.push(specs.get(id));
}
const catalogErrors = validate(simulated, {
  terms: loadTerminology(),
  eindtermen: loadEindtermen(),
  skipStoredLayerValidation: true,
}).errors;
if (catalogErrors.length) fail(`simulated catalog validation errors: ${catalogErrors.join('; ')}`);

const implemented = packet.generator_handling_decision.existing_implemented_generators || [];
for (const expected of [
  ['GEN_A12', 'GEN.A12'],
  ['GEN_A20', 'GEN.A20'],
]) {
  if (!implemented.some((item) => item.registry_generator === expected[0] && item.skilltree_key === expected[1])) {
    fail(`generator handling must include ${expected[0]} as ${expected[1]}`);
  }
}
requireIncludes(
  (packet.generator_handling_decision.proposed_missing_generators || []).map((item) => item.registry_generator),
  MISSING_GENERATORS,
  'generator_handling_decision.proposed_missing_generators'
);
for (const item of packet.generator_handling_decision.proposed_missing_generators || []) {
  if (item.h2e_decision !== 'generator_blocked_not_yet_interactive_if_minted_later') {
    fail(`${item.unit_id} generator handling must be generator_blocked_not_yet_interactive_if_minted_later`);
  }
  if (item.student_facing_skilltree_use_allowed !== false || item.pv_projection_allowed !== false) {
    fail(`${item.unit_id} generator handling must block student-facing and PV use`);
  }
}
if (!packet.post_execution_commands_required_if_later_gate_authorizes_execution.includes('node build-scripts/references/build-skilltree-generator-readiness.js')) {
  fail('packet must require generator-readiness rebuild after later execution');
}
requireIncludes(packet.not_authorized || [], [
  'A20 execution',
  'hand edits to references/machine or references/external',
  'unit minting from this packet alone',
  'unit update execution from this packet alone',
  'student/product use',
], 'packet.not_authorized');

for (const required of [
  'Remote publication requirement',
  'Exact Command Set',
  'Generator Handling',
  'GEN_A88',
  'A20',
  'Not Authorized',
]) {
  if (!packetMd.includes(required)) fail(`packet Markdown must include "${required}"`);
}

if (review.gate_id !== 'GATE-MTU-H2E-conditional-lane-execution') fail('review gate_id mismatch');
if (review.status !== 'review_packet_ready_no_mutation_authorized') fail('review status mismatch');
if (!String(review.remote_evidence_prerequisite || '').includes('pushed')) fail('review must require pushed evidence');
if (!Array.isArray(review.calibration_questions) || review.calibration_questions.length !== 3) fail('review must have three calibration questions');
if (!Array.isArray(review.planned_questions) || review.planned_questions.length !== 10) fail('review must have ten planned questions');
requireIncludes(review.planned_questions.map((question) => question.id), [
  'MTUH2E-Q1',
  'MTUH2E-Q2',
  'MTUH2E-Q3',
  'MTUH2E-Q4',
  'MTUH2E-Q5',
  'MTUH2E-Q6',
  'MTUH2E-Q7',
  'MTUH2E-Q8',
  'MTUH2E-Q9',
  'MTUH2E-Q10',
], 'review.planned_questions');
if (!Array.isArray(review.stop_conditions) || review.stop_conditions.length < 10) fail('review stop_conditions too short');
for (const key of [
  'protected_reference_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_execution_authorized',
  'student_product_use_authorized',
]) {
  requireFalse(review.authority_boundary, key, 'review.authority_boundary');
}
for (const required of [
  'Calibration Questions',
  'Full Planned Review Questions',
  'Remote evidence prerequisite',
  'MTUH2E-Q1',
  'MTUH2E-Q10',
  'Current Stop Conditions',
  'pushed',
]) {
  if (!reviewMd.includes(required)) fail(`review Markdown must include "${required}"`);
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (GATE-MTU-H2H|MTU-H2H|GATE-MTU-H2G|MTU-H2G|MTU-H2F|GATE-MTU-H2E|MTU-H2E) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be GATE-MTU-H2H, MTU-H2H, GATE-MTU-H2G, MTU-H2G, MTU-H2F, GATE-MTU-H2E, or MTU-H2E for H2E lifecycle');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) fail('first row must state ACTIVE OPERATIONAL NEXT ACTION');

console.log('OK MTU-H2E conditional-lane execution packet');
