#!/usr/bin/env node
/**
 * Validate the EX-2 exam-to-MTU mapping review-gate packet.
 *
 * HOW TO ADAPT:
 * - Keep this checker read-only.
 * - It validates review-packet readiness and no-mutation boundaries, not a
 *   future gate closure decision.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const GATE_DIR = 'reports/review-gates/GATE-EX2-exam-to-mtu-mapping';
const REVIEW_PACKET_MD = `${GATE_DIR}/review-packet.md`;
const REVIEW_PACKET_JSON = `${GATE_DIR}/review-packet.json`;
const MAPPING_MD = `${GATE_DIR}/mapping-candidates.md`;
const MAPPING_JSON = `${GATE_DIR}/mapping-candidates.json`;
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

function main() {
  checkEx1Inputs();
  checkMappingCandidates();
  checkReviewPacket();
  console.log('OK exam-to-MTU mapping gate: EX-2 review packet and candidates validated.');
}

if (require.main === module) main();
