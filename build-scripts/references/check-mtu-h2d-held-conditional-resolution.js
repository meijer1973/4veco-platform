#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { validateSpec } = require('./unit-add');

const ROOT = process.cwd();
const RESOLUTION_JSON_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-held-conditional-resolution.json');
const RESOLUTION_MD_PATH = path.join(ROOT, 'reports', 'mtu-hardening', 'solo-q1-q3-held-conditional-resolution.md');
const REVIEW_PACKET_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2D-held-conditional-lanes', 'review-packet.json');
const REVIEW_PACKET_MD_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2D-held-conditional-lanes', 'review-packet.md');
const HUMAN_INTERVIEW_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2D-held-conditional-lanes', 'human-interview.json');
const HUMAN_INTERVIEW_MD_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2D-held-conditional-lanes', 'human-interview.md');
const GATE_CLOSURE_JSON_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2D-held-conditional-lanes', 'gate-closure.json');
const GATE_CLOSURE_MD_PATH = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H2D-held-conditional-lanes', 'gate-closure.md');
const H2C_RESULT_PATH = path.join(ROOT, 'reports', 'sprints', 'MTU-H2C-result.md');
const UNITS_JSON_PATH = path.join(ROOT, 'references', 'machine', 'micro-teaching-units.json');
const TARGET_EXERCISES_PATH = path.join(ROOT, 'references', 'authored', 'course-target-exercises.json');
const GENERATORS_PATH = path.join(ROOT, 'engines', 'skilltree', 'generators.js');
const ROADMAP_PATH = path.join(ROOT, 'references', 'reference-team-roadmap.md');

function fail(message) {
  console.error(`MTU-H2D held/conditional resolution check failed: ${message}`);
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

function requireIncludes(values, expected, context) {
  for (const value of expected) {
    if (!values.includes(value)) fail(`${context} must include ${value}`);
  }
}

function requireArray(object, key, context, minItems = 1) {
  if (!Array.isArray(object[key]) || object[key].length < minItems) {
    fail(`${context}.${key} must be an array with at least ${minItems} item(s)`);
  }
  return object[key];
}

function sameArray(actual, expected) {
  return Array.isArray(actual) &&
    Array.isArray(expected) &&
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index]);
}

function laneById(lanes, unitId) {
  const lane = lanes.find((item) => item.unit_id === unitId);
  if (!lane) fail(`missing lane disposition for ${unitId}`);
  return lane;
}

function validateNewSpec(spec, knownIds, context) {
  const errors = validateSpec(spec, knownIds);
  if (errors.length) fail(`${context} revised_spec invalid: ${errors.join('; ')}`);
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
      fail(`${context} live ${key} must match revised spec after H2F execution`);
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
    if (
      Object.prototype.hasOwnProperty.call(spec, key) &&
      !sameArray(live[key] || [], spec[key] || [])
    ) {
      fail(`${context} live ${key} must match revised spec after H2F execution`);
    }
  }
  if (spec.zero_needs_review) {
    const liveReview = JSON.stringify(live.zero_needs_review || {});
    const specReview = JSON.stringify(spec.zero_needs_review);
    if (liveReview !== specReview) {
      fail(`${context} live zero_needs_review must match revised spec after H2F execution`);
    }
  }
}

const resolution = readJson(RESOLUTION_JSON_PATH);
const resolutionMd = readText(RESOLUTION_MD_PATH);
const reviewPacket = readJson(REVIEW_PACKET_JSON_PATH);
const reviewPacketMd = readText(REVIEW_PACKET_MD_PATH);
const humanInterview = fs.existsSync(HUMAN_INTERVIEW_MD_PATH) ? readText(HUMAN_INTERVIEW_MD_PATH) : null;
const humanInterviewJson = fs.existsSync(HUMAN_INTERVIEW_JSON_PATH) ? readJson(HUMAN_INTERVIEW_JSON_PATH) : null;
const gateClosure = fs.existsSync(GATE_CLOSURE_MD_PATH) ? readText(GATE_CLOSURE_MD_PATH) : null;
const gateClosureJson = fs.existsSync(GATE_CLOSURE_JSON_PATH) ? readJson(GATE_CLOSURE_JSON_PATH) : null;
const h2cResult = readText(H2C_RESULT_PATH);
const units = readJson(UNITS_JSON_PATH);
const targetExercises = readJson(TARGET_EXERCISES_PATH);
const generators = readText(GENERATORS_PATH);
const roadmap = readText(ROADMAP_PATH);

if (resolution.schema_version !== 1) fail('resolution schema_version must be 1');
if (resolution.sprint_id !== 'MTU-H2D') fail('resolution sprint_id must be MTU-H2D');
if (resolution.gate_id !== 'GATE-MTU-H2D') fail('resolution gate_id must be GATE-MTU-H2D');
if (resolution.status !== 'resolution_packet_ready_no_mutation') {
  fail('resolution status must be resolution_packet_ready_no_mutation');
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
  'target_exercise_promotion_authorized',
  'cp6_closure_authorized',
  'year1_closure_authorized',
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
  requireFalse(resolution.authority_boundary, key, 'resolution.authority_boundary');
}

const byId = new Map(units.map((unit) => [unit.id, unit]));
const knownIds = new Set(byId.keys());
const h2cIds = ['F19', 'F20', 'A85', 'A86', 'A87', 'A91'];
const absentIds = ['A88', 'A89', 'A90', 'A92', 'A93'];
function validateRevisedSpec(spec, context) {
  if (byId.has(spec.id)) {
    requireLiveMatchesSpec(byId.get(spec.id), spec, context);
  } else {
    validateNewSpec(spec, knownIds, context);
  }
}
requireIncludes(resolution.post_h2c_registry_expectations.must_exist_from_h2c || [], h2cIds, 'post_h2c_registry_expectations.must_exist_from_h2c');
requireIncludes(resolution.post_h2c_registry_expectations.must_remain_absent || [], absentIds, 'post_h2c_registry_expectations.must_remain_absent');
requireIncludes(resolution.post_h2c_registry_expectations.must_remain_live_update_targets || [], ['A12', 'A20'], 'post_h2c_registry_expectations.must_remain_live_update_targets');
for (const id of h2cIds) {
  if (!byId.has(id)) fail(`expected MTU-H2C unit ${id} to exist`);
}
const h2fPresentIds = absentIds.filter((id) => byId.has(id));
const h2fExecuted = h2fPresentIds.length === absentIds.length;
if (h2fPresentIds.length && !h2fExecuted) {
  fail(`H2F execution state is partial; expected all or none of ${absentIds.join(', ')} live`);
}
if (!h2fExecuted) {
  for (const id of absentIds) {
    if (byId.has(id)) fail(`${id} must remain absent after MTU-H2D and before H2F execution`);
  }
}
for (const id of ['A12', 'A20']) {
  if (!byId.has(id)) fail(`${id} must remain live`);
}
if (!(byId.get('A12').exam_codes || []).includes('A2.11')) fail('live A12 must still include A2.11');
if (byId.get('A20').generator !== 'GEN_A20') fail('live A20 generator must remain GEN_A20');
for (const file of resolution.post_h2c_registry_expectations.candidate_storage_must_not_exist || []) {
  if (fs.existsSync(path.join(ROOT, file))) fail(`candidate storage must not exist: ${file}`);
}

requireIncludes(resolution.generator_implementation_status.registry_generator_fields_present || [], ['GEN_A12', 'GEN_A20'], 'generator_implementation_status.registry_generator_fields_present');
const implementedGenerators = resolution.generator_implementation_status.implemented || [];
for (const expected of [
  { registry_generator: 'GEN_A12', skilltree_key: 'GEN.A12' },
  { registry_generator: 'GEN_A20', skilltree_key: 'GEN.A20' },
]) {
  if (!implementedGenerators.some((item) =>
    item.registry_generator === expected.registry_generator &&
    item.skilltree_key === expected.skilltree_key
  )) {
    fail(`generator_implementation_status.implemented must include ${expected.registry_generator} as ${expected.skilltree_key}`);
  }
  if (!generators.includes(expected.skilltree_key)) {
    fail(`${expected.skilltree_key} must exist in generators.js`);
  }
}
requireIncludes(resolution.generator_implementation_status.missing_for_revised_lanes || [], [
  'GEN_A88',
  'GEN_A89',
  'GEN_A90',
  'GEN_A92',
  'GEN_A93',
], 'generator_implementation_status.missing_for_revised_lanes');
for (const generatorId of ['GEN_A88', 'GEN_A89', 'GEN_A90', 'GEN_A92', 'GEN_A93']) {
  const skilltreeKey = generatorId.replace('GEN_', 'GEN.');
  if (generators.includes(skilltreeKey)) {
    fail(`${generatorId} is recorded as missing but ${skilltreeKey} appears in generators.js; update the resolution packet`);
  }
}

const lanes = requireArray(resolution, 'lane_dispositions', 'resolution', 7);
for (const expected of ['A12', 'A20', 'A88', 'A89', 'A90', 'A92', 'A93']) {
  laneById(lanes, expected);
}
if (lanes.some((lane) => lane.execution_authorized_now !== false)) {
  fail('all lane_dispositions.execution_authorized_now values must be false');
}

const a12 = laneById(lanes, 'A12');
if (a12.disposition !== 'revise_for_later_execution_gate') fail('A12 disposition must be revise_for_later_execution_gate');
requireIncludes(a12.revised_update_spec.exam_codes || [], ['A2.11'], 'A12 revised_update_spec.exam_codes');
if (a12.revised_update_spec.generator !== 'GEN_A12') fail('A12 revised update must keep GEN_A12');
if (!sameArray(a12.revised_update_spec.needs, ['A11', 'A07'])) fail('A12 revised needs must remain A11,A07');

const a20 = laneById(lanes, 'A20');
if (a20.disposition !== 'hold_for_split_deprecate_replacement_packet') fail('A20 disposition must hold for split/deprecate/replacement');
if (!a20.active_given_mk_usage || a20.active_given_mk_usage.record_id !== '4.1.2') {
  fail('A20 must record active given-MK usage in target exercise 4.1.2');
}
if (!a20.required_next_packet || a20.required_next_packet.must_not_execute_from_h2d !== true) {
  fail('A20 required_next_packet must explicitly block H2D execution');
}
const target412 = (targetExercises.exercises || targetExercises).find((record) => record.id === '4.1.2');
if (!target412) fail('target exercise 4.1.2 missing from authored target exercises');
const target412Text = JSON.stringify(target412);
if (!target412Text.includes('A20') || !target412Text.includes('MK')) {
  fail('target exercise 4.1.2 must still show A20 and MK evidence for the A20 hold');
}

const a88 = laneById(lanes, 'A88');
if (!sameArray(a88.revised_spec.needs, [])) fail('A88 revised needs must be empty');
if (a88.revised_spec.zero_needs_status !== 'true_zero') fail('A88 must carry true_zero review');
if (a88.revised_spec.generator !== 'GEN_A88') fail('A88 generator must be GEN_A88');
if ((a88.revised_spec.needs || []).includes('A61')) fail('A88 must not depend on A61');
validateRevisedSpec(a88.revised_spec, 'A88');

const a89 = laneById(lanes, 'A89');
if (!sameArray(a89.revised_spec.needs, [])) fail('A89 revised needs must be empty');
if (a89.revised_spec.zero_needs_status !== 'true_zero') fail('A89 must carry true_zero review');
if (a89.revised_spec.generator !== 'GEN_A89') fail('A89 generator must be GEN_A89');
if ((a89.revised_spec.needs || []).includes('A04')) fail('A89 must not depend on A04');
validateRevisedSpec(a89.revised_spec, 'A89');

const a90 = laneById(lanes, 'A90');
if (!sameArray(a90.revised_spec.needs, ['A89'])) fail('A90 revised needs must be A89 only');
if (a90.revised_spec.name !== 'MO bepalen uit lineaire GO-regel zonder afgeleiden') fail('A90 revised name must narrow to linear GO rule');
if ((a90.revised_spec.procedure || []).join(' ').toLowerCase().includes('tabel')) fail('A90 revised procedure must not include table route');
if ((a90.revised_spec.procedure || []).join(' ').toLowerCase().includes('grafiek')) fail('A90 revised procedure must not include graph route');
requireIncludes(a90.deferred_variants || [], [
  'MO bepalen uit opbrengsttabel zonder afgeleiden',
  'MO bepalen uit grafische bron zonder afgeleiden',
], 'A90 deferred_variants');
validateRevisedSpec(a90.revised_spec, 'A90');

const a92 = laneById(lanes, 'A92');
if (!sameArray(a92.revised_spec.needs, ['A04', 'A89'])) fail('A92 revised needs must be A04,A89');
if (a92.disposition !== 'revise_for_later_execution_gate_after_a89') fail('A92 disposition must depend on A89 acceptance');
validateRevisedSpec(a92.revised_spec, 'A92');

const a93 = laneById(lanes, 'A93');
if (!sameArray(a93.revised_spec.needs, ['A38', 'A92'])) fail('A93 revised needs must be A38,A92');
if ((a93.revised_spec.needs || []).includes('A66')) fail('A93 must not depend on A66');
if (!(a93.revised_spec.pitfalls || []).some((pitfall) => pitfall.includes('niet hetzelfde als het percentage van de kostenstijging'))) {
  fail('A93 must keep price-change versus pass-through pitfall');
}
if (!a93.deferred_route || a93.deferred_route.route !== 'MTU-H3') fail('A93 must defer broader incidence to MTU-H3');
validateRevisedSpec(a93.revised_spec, 'A93');

requireArray(resolution, 'quality_log', 'resolution', 6);
requireArray(resolution, 'deferred_visible_dependencies', 'resolution', 3);
if (resolution.review_recommendation.recommended_next_gate !== 'GATE-MTU-H2D') {
  fail('review recommendation must route to GATE-MTU-H2D');
}

for (const requiredText of [
  'resolution packet ready, no mutation authorized',
  'Lane Disposition Summary',
  'A12',
  'A20',
  'A88',
  'A89',
  'A90',
  'A92',
  'A93',
  'Run GATE-MTU-H2D as a human review',
]) {
  if (!resolutionMd.includes(requiredText)) fail(`resolution Markdown must include "${requiredText}"`);
}

if (reviewPacket.gate_id !== 'GATE-MTU-H2D') fail('review packet gate_id must be GATE-MTU-H2D');
if (reviewPacket.status !== 'review_packet_ready_no_mutation_authorized') {
  fail('review packet status must be review_packet_ready_no_mutation_authorized');
}
requireArray(reviewPacket, 'calibration_questions', 'review packet', 2);
requireArray(reviewPacket, 'planned_questions', 'review packet', 9);
if (!reviewPacket.remote_evidence_prerequisite || !reviewPacket.remote_evidence_prerequisite.includes('committed and pushed')) {
  fail('review packet JSON must include remote_evidence_prerequisite');
}
requireArray(reviewPacket, 'stop_conditions', 'review packet', 9);
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
  'student_product_use_authorized',
]) {
  requireFalse(reviewPacket.authority_boundary, key, 'review_packet.authority_boundary');
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
  requireFalse(reviewPacket.product_boundaries, key, 'review_packet.product_boundaries');
}
for (const id of ['MTUH2D-Q1', 'MTUH2D-Q2', 'MTUH2D-Q3', 'MTUH2D-Q4', 'MTUH2D-Q5', 'MTUH2D-Q6', 'MTUH2D-Q7', 'MTUH2D-Q8', 'MTUH2D-Q9']) {
  if (!reviewPacket.planned_questions.some((question) => question.id === id)) {
    fail(`review packet JSON missing planned question ${id}`);
  }
}
for (const requiredText of [
  'Calibration Questions',
  'Full Planned Review Questions',
  'Remote evidence prerequisite',
  'MTUH2D-Q1',
  'MTUH2D-Q9',
  'Current Stop Conditions',
  'Run the formal GATE-MTU-H2D human review',
  'GEN_A88',
  'A20',
]) {
  if (!reviewPacketMd.includes(requiredText)) fail(`review packet Markdown must include "${requiredText}"`);
}

if (humanInterviewJson || gateClosureJson) {
  if (!humanInterviewJson || !humanInterview) {
    fail('human interview Markdown/JSON must both exist once GATE-MTU-H2D closure starts');
  }
  if (!gateClosureJson || !gateClosure) {
    fail('gate closure Markdown/JSON must both exist once GATE-MTU-H2D closure starts');
  }
  if (humanInterviewJson.gate_id !== 'GATE-MTU-H2D') fail('human interview JSON gate_id must be GATE-MTU-H2D');
  if (humanInterviewJson.decision !== 'pass_with_conditions') {
    fail('human interview JSON decision must be pass_with_conditions');
  }
  if (humanInterviewJson.decision_detail !== 'held_conditional_lane_routing_only') {
    fail('human interview JSON decision_detail must be held_conditional_lane_routing_only');
  }
  if (humanInterviewJson.remote_evidence_commit !== '63c2e53731af3941d49183628f4ba5927f8ac551') {
    fail('human interview JSON must record the remote evidence commit pushed before review');
  }
  if (humanInterviewJson.remote_evidence_pushed !== true) {
    fail('human interview JSON must record remote_evidence_pushed true');
  }
  requireArray(humanInterviewJson, 'calibration_answers', 'human interview JSON', 2);
  requireArray(humanInterviewJson, 'binding_answers', 'human interview JSON', 9);
  requireIncludes(humanInterviewJson.binding_answers.map((answer) => answer.id), [
    'MTUH2D-Q1',
    'MTUH2D-Q2',
    'MTUH2D-Q3',
    'MTUH2D-Q4',
    'MTUH2D-Q5',
    'MTUH2D-Q6',
    'MTUH2D-Q7',
    'MTUH2D-Q8',
    'MTUH2D-Q9',
  ], 'human_interview.binding_answers');
  requireIncludes(humanInterviewJson.conditions || [], [
    'remote_evidence_pushed_before_closure',
    'generator_inventory_corrected',
    'a12_retain_a2_11',
    'a20_held_for_separate_split_replacement_packet',
    'a88_a89_zero_needs_review_rationale_required',
    'new_conditional_generators_must_be_implemented_or_blocked',
    'no_mutation_from_this_gate',
  ], 'human_interview.conditions');
  if (!humanInterviewJson.authorized_next || humanInterviewJson.authorized_next.sprint_id !== 'MTU-H2E') {
    fail('human interview JSON must authorize MTU-H2E as the next planning sprint');
  }
  for (const requiredText of [
    'PASS WITH CONDITIONS',
    'Remote Evidence',
    'MTUH2D-Q1',
    'MTUH2D-Q9',
    'MTU-H2E',
    'No mutation',
  ]) {
    if (!humanInterview.includes(requiredText)) fail(`human interview Markdown must include "${requiredText}"`);
  }

  if (gateClosureJson.gate_id !== 'GATE-MTU-H2D') fail('gate closure JSON gate_id must be GATE-MTU-H2D');
  if (gateClosureJson.status !== 'pass_with_conditions') fail('gate closure status must be pass_with_conditions');
  if (gateClosureJson.status_detail !== 'held_conditional_lane_routing_only') {
    fail('gate closure status_detail must be held_conditional_lane_routing_only');
  }
  if (gateClosureJson.remote_evidence_commit !== '63c2e53731af3941d49183628f4ba5927f8ac551') {
    fail('gate closure JSON must record the remote evidence commit pushed before review');
  }
  if (gateClosureJson.remote_evidence_pushed_before_closure !== true) {
    fail('gate closure JSON must record remote_evidence_pushed_before_closure true');
  }
  if (gateClosureJson.closure_confirmed_by_human !== true) {
    fail('gate closure JSON must record closure_confirmed_by_human true');
  }
  requireIncludes(gateClosureJson.conditions || [], [
    'remote_evidence_pushed_before_closure',
    'correct_generator_inventory_statement',
    'a12_retain_a2_11',
    'a20_held_for_separate_packet',
    'a88_a89_zero_needs_review_rationale_required',
    'a88_a89_a90_a92_a93_generator_implementation_or_blocked_status_required',
    'no_mutation_from_gate',
  ], 'gate_closure.conditions');
  for (const expected of [
    { registry_generator: 'GEN_A12', skilltree_key: 'GEN.A12' },
    { registry_generator: 'GEN_A20', skilltree_key: 'GEN.A20' },
  ]) {
    if (!(gateClosureJson.corrected_generator_inventory.implemented || []).some((item) =>
      item.registry_generator === expected.registry_generator &&
      item.skilltree_key === expected.skilltree_key
    )) {
      fail(`gate closure corrected_generator_inventory must include ${expected.registry_generator}`);
    }
  }
  requireIncludes(gateClosureJson.corrected_generator_inventory.not_implemented_current_baseline || [], [
    'GEN_A88',
    'GEN_A89',
    'GEN_A90',
    'GEN_A92',
    'GEN_A93',
  ], 'gate_closure.corrected_generator_inventory.not_implemented_current_baseline');
  if (!gateClosureJson.authorized_next || gateClosureJson.authorized_next.sprint_id !== 'MTU-H2E') {
    fail('gate closure must authorize MTU-H2E as next sprint');
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
    requireFalse(gateClosureJson.authority_boundary, key, 'gate_closure.authority_boundary');
  }
  for (const requiredText of [
    'PASS WITH CONDITIONS',
    'Remote Evidence',
    'Accepted Dispositions',
    'Required Conditions',
    'MTU-H2E',
    'Not Authorized',
  ]) {
    if (!gateClosure.includes(requiredText)) fail(`gate closure Markdown must include "${requiredText}"`);
  }
}

for (const requiredText of ['A12', 'A20', 'A88', 'A89', 'A90', 'A92', 'A93']) {
  if (!h2cResult.includes(requiredText)) fail(`MTU-H2C result must reference held/conditional lane ${requiredText}`);
}

const firstRowMatch = roadmap.match(/\| Sprint \| Name \| Completed \| Current State \|\s*\n\|[-|]+\|\s*\n(\|[^\n]+\|)/);
if (!firstRowMatch) fail('could not find first Sprint Ledger row in roadmap');
const firstRow = firstRowMatch[1];
if (!/\| (GATE-MTU-H2I|MTU-H2I|GATE-MTU-H2H|MTU-H2H|GATE-MTU-H2G|MTU-H2G|MTU-H2F|GATE-MTU-H2E|MTU-H2E|GATE-MTU-H2D|MTU-H2D) \|/.test(firstRow)) {
  fail('first Sprint Ledger row must be GATE-MTU-H2I, MTU-H2I, GATE-MTU-H2H, MTU-H2H, GATE-MTU-H2G, MTU-H2G, MTU-H2F, GATE-MTU-H2E, MTU-H2E, GATE-MTU-H2D, or MTU-H2D for H2D lifecycle');
}
if (!firstRow.includes('ACTIVE OPERATIONAL NEXT ACTION')) {
  fail('first Sprint Ledger row must state ACTIVE OPERATIONAL NEXT ACTION');
}
if (gateClosureJson && !roadmap.includes('| GATE-MTU-H2D | Solo q1-q3 Held/Conditional Lane Human Review | yes |')) {
  fail('roadmap Closed Sprints must include GATE-MTU-H2D closure row after gate closure');
}

console.log('OK MTU-H2D held/conditional resolution: reports/mtu-hardening/solo-q1-q3-held-conditional-resolution.json');
