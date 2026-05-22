#!/usr/bin/env node
/**
 * Validate the EX-2 exam-to-MTU mapping review-gate packet.
 *
 * HOW TO ADAPT:
 * - Keep this checker read-only.
 * - It validates review-packet readiness and no-mutation boundaries.
 * - If gate closure artifacts exist, it also validates that EX-2 closed only
 *   as a routing/classification gate.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const GATE_DIR = 'reports/review-gates/GATE-EX2-exam-to-mtu-mapping';
const REVIEW_PACKET_MD = `${GATE_DIR}/review-packet.md`;
const REVIEW_PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const MAPPING_MD = `${GATE_DIR}/mapping-candidates.md`;
const MAPPING_JSON = `${GATE_DIR}/mapping-candidates.json`;
const HUMAN_MD = `${GATE_DIR}/human-interview.md`;
const HUMAN_JSON = `${GATE_DIR}/human-interview.json`;
const CLOSURE_MD = `${GATE_DIR}/gate-closure.md`;
const CLOSURE_JSON = `${GATE_DIR}/gate-closure.json`;
const EX1_ITEMS = 'references/data/exam-ingestion/exam-item-overlays.json';
const EX1_RESULT = 'references/data/sprints/EX-1.result.json';

const EXPECTED_IDS = [
  'vw-1022-a-25-1-o:opgave-1:question-3',
  'vw-1022-a-25-1-o:opgave-4:question-19',
  'vw-1022-a-25-1-o:opgave-3:question-15',
];

const BLOCKED_OUTCOMES = [
  'protected reference mutation',
  'external-source mutation',
  'unit minting',
  'operation-registry mutation',
  'answer-skill mutation',
  'target-exercise promotion',
  'lesson-output mutation',
  'CP-6 closure',
  'Year-1 closure',
  'student diagnostics',
  'adaptive routing',
  'student-facing AI',
  'summative use',
  'PV projection',
  'PV machine promotion',
  'student-facing output',
];

function fail(message) {
  console.error(`Exam-to-MTU mapping gate check failed: ${message}`);
  process.exit(1);
}

function file(relPath) {
  return path.join(ROOT, relPath);
}

function read(relPath) {
  const full = file(relPath);
  if (!fs.existsSync(full)) fail(`missing ${relPath}`);
  return fs.readFileSync(full, 'utf8');
}

function readJson(relPath) {
  try {
    return JSON.parse(read(relPath));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertIncludes(text, needle, label) {
  assert(text.includes(needle), `${label} missing "${needle}"`);
}

function assertArray(value, label) {
  assert(Array.isArray(value), `${label} must be an array`);
}

function assertSameSet(actual, expected, label) {
  const a = [...actual].sort();
  const e = [...expected].sort();
  assert(JSON.stringify(a) === JSON.stringify(e), `${label} mismatch`);
}

function collectIds(records, label) {
  assertArray(records, `${label}.records`);
  const ids = records.map((record) => record.exam_item_id);
  assertSameSet(ids, EXPECTED_IDS, `${label} exam_item_id set`);
  return new Map(records.map((record) => [record.exam_item_id, record]));
}

function checkEx1Inputs() {
  const ex1 = readJson(EX1_RESULT);
  assert(ex1.status === 'completed', 'EX-1 must be completed before EX-2 packet readiness');
  assert(ex1.protected_reference_data_changed === false, 'EX-1 protected_reference_data_changed');
  assert(ex1.unit_minting === false, 'EX-1 unit_minting');
  const items = readJson(EX1_ITEMS);
  const itemById = collectIds(items.records, 'EX-1 item overlays');
  const q19 = itemById.get('vw-1022-a-25-1-o:opgave-4:question-19');
  assert(q19.ingestion_status === 'reviewed_with_gaps', 'q19 must remain reviewed_with_gaps');
  assert(q19.ingestion_status !== 'reviewed_ready_for_mapping', 'q19 must not be ready for mapping');
  const gapIds = (q19.source_material.gaps || []).map((gap) => gap.gap_id);
  assert(gapIds.includes('q19-source-annex-gap'), 'q19 source gap must be present');
  assert(gapIds.includes('q19-graph-object-gap'), 'q19 graph gap must be present');
}

function checkMappingCandidates() {
  const mapping = readJson(MAPPING_JSON);
  const markdown = read(MAPPING_MD);
  assert(mapping.schema_version === 1, 'mapping schema_version');
  assert(mapping.gate_id === 'GATE-EX2-exam-to-mtu-mapping', 'mapping gate_id');
  assert(mapping.sprint_id === 'EX-2', 'mapping sprint_id');
  assert(mapping.status === 'candidate_mapping_for_human_review', 'mapping status');
  assert(mapping.protected_reference_data_changed === false, 'mapping protected_reference_data_changed');
  assert(mapping.mutation_authorized === false, 'mapping mutation_authorized');
  const records = collectIds(mapping.records, 'mapping candidates');
  const q19 = records.get('vw-1022-a-25-1-o:opgave-4:question-19');
  assert(q19.blocking_gaps.includes('q19-source-annex-gap'), 'mapping q19 source gap');
  assert(q19.blocking_gaps.includes('q19-graph-object-gap'), 'mapping q19 graph gap');
  for (const record of mapping.records) {
    for (const requirement of record.candidate_requirements || []) {
      assert(requirement.mutation_authorized === false, `${record.exam_item_id} ${requirement.requirement_id} mutation_authorized`);
      assertArray(requirement.review_options, `${record.exam_item_id} ${requirement.requirement_id} review_options`);
      assert(requirement.review_options.length > 0, `${record.exam_item_id} ${requirement.requirement_id} review_options empty`);
    }
  }
  for (const needle of ['q3 Calculation Threshold', 'q19 Graph/Source Task', 'q15 Reasoning/Answer Model']) {
    assertIncludes(markdown, needle, 'mapping markdown');
  }
}

function checkReviewPacket() {
  const packet = readJson(REVIEW_PACKET_JSON);
  const markdown = read(REVIEW_PACKET_MD);
  assert(packet.schema_version === 1, 'review packet schema_version');
  assert(packet.gate_id === 'GATE-EX2-exam-to-mtu-mapping', 'review packet gate_id');
  assert(packet.sprint_id === 'EX-2', 'review packet sprint_id');
  assert(packet.status === 'review_packet_ready_not_closed', 'review packet status');
  assert(packet.protected_reference_data_changed === false, 'review packet protected_reference_data_changed');
  assert(packet.external_source_mutation_authorized === false, 'review packet external_source_mutation_authorized');
  assert(packet.unit_minting_authorized === false, 'review packet unit_minting_authorized');
  assert(packet.operation_registry_mutation_authorized === false, 'review packet operation_registry_mutation_authorized');
  assert(packet.answer_skill_mutation_authorized === false, 'review packet answer_skill_mutation_authorized');
  assert(packet.lesson_output_mutation_authorized === false, 'review packet lesson_output_mutation_authorized');
  assert(packet.cp6_closed === false, 'review packet cp6_closed');
  assert(packet.year1_closed === false, 'review packet year1_closed');
  assert(packet.human_interview_completed === false, 'review packet human_interview_completed');
  assert(packet.gate_closure_completed === false, 'review packet gate_closure_completed');
  assertArray(packet.review_questions, 'review packet questions');
  assert(packet.review_questions.length === 8, 'review packet must have 8 questions');
  for (const question of packet.review_questions) {
    assert(question.open_answer_allowed === true, `${question.id} must allow open answer`);
    assertArray(question.options, `${question.id} options`);
    assert(question.options.length >= 3, `${question.id} option count`);
  }
  for (const outcome of BLOCKED_OUTCOMES) {
    assert(packet.blocked_outcomes.includes(outcome), `blocked_outcomes missing ${outcome}`);
  }
  for (const needle of [
    'Full Planned Review Questions',
    'Future Interview Protocol',
    'Current Stop Conditions',
    'Run the formal GATE-EX2 human review',
    'No protected reference mutation authorized',
  ]) {
    assertIncludes(markdown, needle, 'review packet markdown');
  }
}

function checkGateClosureIfPresent() {
  const closurePath = file(CLOSURE_JSON);
  const humanPath = file(HUMAN_JSON);
  if (!fs.existsSync(closurePath) && !fs.existsSync(humanPath)) return;
  assert(fs.existsSync(closurePath), `missing ${CLOSURE_JSON}`);
  assert(fs.existsSync(file(CLOSURE_MD)), `missing ${CLOSURE_MD}`);
  assert(fs.existsSync(humanPath), `missing ${HUMAN_JSON}`);
  assert(fs.existsSync(file(HUMAN_MD)), `missing ${HUMAN_MD}`);

  const closure = readJson(CLOSURE_JSON);
  const human = readJson(HUMAN_JSON);
  const closureMarkdown = read(CLOSURE_MD);
  const humanMarkdown = read(HUMAN_MD);

  assert(closure.gate_id === 'GATE-EX2-exam-to-mtu-mapping', 'closure gate_id');
  assert(closure.sprint_id === 'EX-2', 'closure sprint_id');
  assert(closure.status === 'pass_with_conditions', 'closure status');
  assert(closure.closure_confirmed_by_human === true, 'closure confirmation');
  assert(closure.protected_reference_data_changed === false, 'closure protected_reference_data_changed');
  assert(closure.decision_scope === 'classification_and_routing_only', 'closure decision_scope');
  assert(closure.allowed_next_sprint === 'EX-3', 'closure allowed_next_sprint');
  assertArray(closure.reviewed_classifications, 'closure reviewed_classifications');
  assert(closure.reviewed_classifications.length >= 8, 'closure reviewed_classifications length');

  const byRequirement = new Map(closure.reviewed_classifications.map((record) => [record.requirement_id, record]));
  const q3Calc = byRequirement.get('q3-calc-1');
  assert(q3Calc, 'closure q3-calc-1 classification missing');
  assert(q3Calc.classification === 'operation_registry_need', 'q3-calc-1 classification');
  assert((q3Calc.supporting_unit_ids || []).includes('A61'), 'q3-calc-1 must include A61 support');
  assert((q3Calc.stale_or_weak_unit_ids || []).includes('A15'), 'q3-calc-1 must mark A15 stale/weak');

  const q19Graph = byRequirement.get('q19-graph-op-1');
  assert(q19Graph, 'closure q19-graph-op-1 classification missing');
  assert((q19Graph.candidate_unit_ids || []).includes('A42'), 'q19-graph-op-1 must include A42');
  assert((q19Graph.candidate_unit_ids || []).includes('D10'), 'q19-graph-op-1 must include D10');
  assert((q19Graph.weak_or_prerequisite_unit_ids || []).includes('A45'), 'q19-graph-op-1 must downgrade A45');
  assert((q19Graph.blocking_gaps || []).includes('q19-source-annex-gap'), 'q19 graph source gap must remain blocking');
  assert((q19Graph.blocking_gaps || []).includes('q19-graph-object-gap'), 'q19 graph object gap must remain blocking');

  for (const requirementId of ['q3-answer-1', 'q15-answer-1']) {
    const record = byRequirement.get(requirementId);
    assert(record, `closure ${requirementId} missing`);
    assert(record.classification === 'answer_skill_need', `${requirementId} must remain answer_skill_need`);
  }

  const q15 = byRequirement.get('q15-content');
  assert(q15, 'closure q15-content missing');
  assert(q15.classification === 'existing_mtu', 'q15 content classification');
  assertSameSet(q15.accepted_unit_ids || [], ['D27', 'F03', 'F09'], 'q15 accepted units');
  assert(q15.coverage_scope === 'content_only', 'q15 coverage_scope');

  for (const outcome of BLOCKED_OUTCOMES) {
    assert(closure.blocked_outcomes.join('\n').includes(outcome), `closure blocked_outcomes missing ${outcome}`);
  }
  assert(closure.blocked_outcomes.join('\n').includes('operation-registry mutation'), 'closure must block operation-registry mutation');
  assert(closure.blocked_outcomes.join('\n').includes('answer-skill mutation'), 'closure must block answer-skill mutation');
  assert(closure.blocked_outcomes.join('\n').includes('student-facing output'), 'closure must block student-facing output');

  assert(human.gate_id === closure.gate_id, 'human gate_id');
  assert(human.status === 'pass_with_conditions_routing_only', 'human status');
  assert(human.closure_confirmed_by_human === true, 'human closure confirmation');
  assertArray(human.answers, 'human answers');
  assert(human.answers.length === 8, 'human must record 8 answers');

  for (const needle of [
    'PASS WITH CONDITIONS - routing only',
    'A61',
    'A42',
    'q19-source-annex-gap',
    'answer_skill_need',
    'No protected mutation',
  ]) {
    assertIncludes(humanMarkdown, needle, 'human interview markdown');
  }
  for (const needle of [
    'Final Classification Table',
    'A61',
    'A42',
    'q19-source-annex-gap',
    'EX-3 Exam Coverage Dashboard',
    'No mutation',
  ]) {
    assertIncludes(closureMarkdown, needle, 'gate closure markdown');
  }
}

function main() {
  checkEx1Inputs();
  checkMappingCandidates();
  checkReviewPacket();
  checkGateClosureIfPresent();
  console.log('OK exam-to-MTU mapping gate: EX-2 review packet and candidates validated.');
}

if (require.main === module) main();
