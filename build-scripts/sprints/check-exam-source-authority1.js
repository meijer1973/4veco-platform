#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CONTRACT_PATH = path.join('reports', 'json', 'exam-source-authority1-contract.json');
const OVERLAY_PATH = path.join('references', 'data', 'exam-ingestion', 'exam-item-overlays.json');
const EXAM_QUESTIONS_PATH = path.join('references', 'external', 'exam-questions.json');

const EXPECTED = {
  examItemId: 'vw-1022-a-25-1-o:opgave-1:question-3',
  overlayPath: 'references/data/exam-ingestion/exam-item-overlays.json',
  promptPdf: 'references/external/exams/vw-1022-a-25-1-o.pdf#question-3',
  correctionPdf: 'references/external/exams/vw-1022-a-25-1-c.pdf#question-3',
  sourceMaterialId: 'table-1-zoohee-zorgverzekering',
  answerModelSourceRef: 'references/external/exams/vw-1022-a-25-1-c.pdf#question-3',
  tableRows: [
    ['wettelijk eigen risico', 385, 108.25],
    ['verhoogd eigen risico', 885, 86.25],
  ],
};

const FORBIDDEN_PROOF_TERMS = [
  'official-style',
  'exam-style',
  'local review data',
  'local official-style source',
  'reconstructed local source',
];

function fail(message) {
  console.error(`Exam source authority check failed: ${message}`);
  process.exit(1);
}

function readJson(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${file}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${file}: ${error.message}`);
  }
}

function stripFragment(value) {
  return String(value || '').split('#')[0];
}

function existsPathWithFragment(value, label) {
  const file = stripFragment(value);
  if (!file.endsWith('.pdf')) fail(`${label} must point to a PDF with question fragment`);
  if (!String(value).includes('#question-3')) fail(`${label} must include #question-3`);
  if (!fs.existsSync(file)) fail(`${label} file does not exist: ${file}`);
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function collectStrings(value, out = []) {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, out));
  else if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStrings(item, out));
  }
  return out;
}

function hasForbiddenProofTerm(value) {
  const strings = collectStrings(value).map((item) => item.toLowerCase());
  return [...FORBIDDEN_PROOF_TERMS]
    .sort((a, b) => b.length - a.length)
    .find((term) => strings.some((item) => item.includes(term)));
}

function validateSourceAuthority(candidate) {
  const errors = [];
  const sourceAuthority = candidate && candidate.sourceAuthority;
  if (!sourceAuthority || typeof sourceAuthority !== 'object') {
    return ['missing sourceAuthority object'];
  }
  const forbidden = hasForbiddenProofTerm(sourceAuthority);
  if (forbidden) errors.push(`sourceAuthority contains forbidden proof term: ${forbidden}`);
  if (candidate.examProofClaim) {
    const claimForbidden = hasForbiddenProofTerm(candidate.examProofClaim);
    if (claimForbidden) errors.push(`examProofClaim contains forbidden proof term: ${claimForbidden}`);
  }
  if (sourceAuthority.kind !== 'external_primary') {
    errors.push('sourceAuthority.kind must be external_primary');
  }
  if (sourceAuthority.exam_item_id !== EXPECTED.examItemId) {
    errors.push(`sourceAuthority.exam_item_id must be ${EXPECTED.examItemId}`);
  }
  if (sourceAuthority.overlay_path !== EXPECTED.overlayPath) {
    errors.push(`sourceAuthority.overlay_path must be ${EXPECTED.overlayPath}`);
  }
  if (sourceAuthority.prompt_pdf !== EXPECTED.promptPdf) {
    errors.push(`sourceAuthority.prompt_pdf must be ${EXPECTED.promptPdf}`);
  }
  if (sourceAuthority.correction_pdf !== EXPECTED.correctionPdf) {
    errors.push(`sourceAuthority.correction_pdf must be ${EXPECTED.correctionPdf}`);
  }
  if (sourceAuthority.source_material_id !== EXPECTED.sourceMaterialId) {
    errors.push(`sourceAuthority.source_material_id must be ${EXPECTED.sourceMaterialId}`);
  }
  return errors;
}

function validateTransformedTaskShape(task) {
  const errors = [];
  errors.push(...validateSourceAuthority(task));
  if (!Array.isArray(task.sourceMaterialRefs) || !task.sourceMaterialRefs.includes(EXPECTED.sourceMaterialId)) {
    errors.push(`transformed task must cite source material ${EXPECTED.sourceMaterialId}`);
  }
  if (!Array.isArray(task.answerModelRefs) || task.answerModelRefs.length < 2) {
    errors.push('transformed task must include answerModelRefs');
  } else {
    for (const stepId of ['q3-step-1', 'q3-step-2']) {
      const required = `${EXPECTED.answerModelSourceRef}:${stepId}`;
      if (!task.answerModelRefs.includes(required)) {
        errors.push(`transformed task missing answer-model ref ${required}`);
      }
    }
  }
  if (!Array.isArray(task.operationTrace) || task.operationTrace.length < 3) {
    errors.push('transformed task must include operationTrace');
  }
  return errors;
}

function requireNoErrors(errors, label) {
  if (errors.length) fail(`${label}: ${errors.join('; ')}`);
}

function requireErrors(errors, label) {
  if (!errors.length) fail(`${label}: expected rejection but validation passed`);
}

function requireErrorContaining(errors, label, expectedText) {
  requireErrors(errors, label);
  if (!errors.some((error) => error.includes(expectedText))) {
    fail(`${label}: expected rejection containing "${expectedText}", got: ${errors.join('; ')}`);
  }
}

const contract = readJson(CONTRACT_PATH);
const overlay = readJson(OVERLAY_PATH);
const examQuestions = readJson(EXAM_QUESTIONS_PATH);

if (contract.schema_version !== 1) fail(`${CONTRACT_PATH} must have schema_version 1`);
if (contract.sprint_id !== 'EXAM-SOURCE-AUTH-1') fail(`${CONTRACT_PATH} has wrong sprint_id`);
requireNoErrors(validateSourceAuthority(contract), 'canonical sourceAuthority');
existsPathWithFragment(contract.sourceAuthority.prompt_pdf, 'prompt_pdf');
existsPathWithFragment(contract.sourceAuthority.correction_pdf, 'correction_pdf');

if (!Array.isArray(contract.forbiddenProofTerms) || !deepEqual(contract.forbiddenProofTerms, FORBIDDEN_PROOF_TERMS)) {
  fail(`${CONTRACT_PATH} must list the exact forbidden proof terms`);
}

const boundary = contract.productBoundary || {};
for (const [key, value] of Object.entries(boundary)) {
  if (value !== false) fail(`productBoundary.${key} must be false`);
}
for (const key of [
  'source_reconstruction_authorized',
  'task_shell_context_runtime_authorized',
  'task_transformation_authorized',
  'generated_lesson_output_authorized',
  'protected_reference_mutation_authorized',
  'source_data_mutation_authorized',
  'product_route_adoption_authorized',
  'target_equivalent_proof_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_or_sequencing_authorized',
  'pv_authorized',
  'scale_gate_1_authorized',
  'student_product_use_authorized',
]) {
  if (!(key in boundary)) fail(`productBoundary missing ${key}`);
}

const overlayRecord = (overlay.records || []).find((record) => record.exam_item_id === EXPECTED.examItemId);
if (!overlayRecord) fail(`overlay missing ${EXPECTED.examItemId}`);
if (overlayRecord.source_authority !== 'external_primary') {
  fail(`overlay source_authority must be external_primary for ${EXPECTED.examItemId}`);
}
if (overlayRecord.source_path !== 'references/external/exam-questions.json') {
  fail('overlay source_path must point to references/external/exam-questions.json');
}

const locator = overlayRecord.source_record_locator || {};
const question = examQuestions.find(
  (item) =>
    item.exam === locator.exam &&
    item.opgave_num === locator.opgave_num &&
    item.question_num === locator.question_num &&
    item.level === locator.level
);
if (!question) fail('external exam-questions mirror missing selected question');
if (question.exam !== contract.sourceRecord.exam) fail('contract sourceRecord.exam mismatch');
if (question.question_num !== contract.sourceRecord.question_num) fail('contract sourceRecord.question_num mismatch');
if (question.points !== contract.sourceRecord.points) fail('contract sourceRecord.points mismatch');
if (!String(question.text || '').includes('verhoogd eigen risico')) {
  fail('external exam-question text does not match selected source question');
}

const table = (overlayRecord.source_material && overlayRecord.source_material.tables || []).find(
  (item) => item.source_material_id === EXPECTED.sourceMaterialId
);
const sourceMaterial = overlayRecord.source_material || {};
if (!Array.isArray(sourceMaterial.tables) || sourceMaterial.tables.length !== 1) {
  fail('selected overlay source material must contain exactly one table');
}
for (const [field, label] of [
  ['figures', 'figures'],
  ['graphs', 'graphs'],
]) {
  if (!Array.isArray(sourceMaterial[field]) || sourceMaterial[field].length !== 0) {
    fail(`selected overlay source material must contain zero ${label}`);
  }
}
if (!table) fail(`overlay source material missing ${EXPECTED.sourceMaterialId}`);
if (!deepEqual(table.rows, EXPECTED.tableRows)) fail('overlay table rows do not match expected source values');
if (!deepEqual(contract.sourceMaterial.rows, table.rows)) fail('contract sourceMaterial rows must match overlay table rows');
if (!deepEqual(contract.sourceMaterial.columns, table.columns)) fail('contract sourceMaterial columns must match overlay table columns');

const answerModel = overlayRecord.official_answer_model || {};
if (answerModel.source_ref !== EXPECTED.answerModelSourceRef) fail('answer model source_ref mismatch');
for (const stepId of contract.answerModelAuthority.required_step_ids || []) {
  const step = (answerModel.answer_steps || []).find((item) => item.step_id === stepId);
  if (!step) fail(`answer model missing step ${stepId}`);
  if (!Array.isArray(step.source_refs) || !step.source_refs.includes(EXPECTED.answerModelSourceRef)) {
    fail(`answer model step ${stepId} missing correction PDF source ref`);
  }
}
for (const ruleId of contract.answerModelAuthority.required_point_rule_ids || []) {
  const rule = (answerModel.point_rules || []).find((item) => item.rule_id === ruleId);
  if (!rule) fail(`answer model missing point rule ${ruleId}`);
  if (rule.source_ref !== EXPECTED.answerModelSourceRef) {
    fail(`point rule ${ruleId} missing correction PDF source ref`);
  }
}
const modelStrings = collectStrings(answerModel).join(' ');
if (!modelStrings.includes('EUR 649')) fail('answer model must include EUR 649 threshold');

const positiveTaskShape = {
  sourceAuthority: contract.sourceAuthority,
  sourceMaterialRefs: contract.futureTransformedTaskAuthorityShape.sourceMaterialRefs,
  answerModelRefs: contract.futureTransformedTaskAuthorityShape.answerModelRefs,
  operationTrace: contract.futureTransformedTaskAuthorityShape.operationTrace,
};
requireNoErrors(validateTransformedTaskShape(positiveTaskShape), 'future transformed-task authority shape');

const negativeFixtures = [
  {
    label: 'official-style proof claim rejected',
    expectedTerm: 'official-style',
    fixture: { sourceAuthority: contract.sourceAuthority, examProofClaim: 'official-style' },
  },
  {
    label: 'exam-style proof claim rejected',
    expectedTerm: 'exam-style',
    fixture: { sourceAuthority: contract.sourceAuthority, examProofClaim: 'exam-style local item' },
  },
  {
    label: 'local review data rejected',
    expectedTerm: 'local review data',
    fixture: { sourceAuthority: contract.sourceAuthority, examProofClaim: 'local review data' },
  },
  {
    label: 'local official-style source rejected',
    expectedTerm: 'local official-style source',
    fixture: { sourceAuthority: contract.sourceAuthority, examProofClaim: 'local official-style source' },
  },
  {
    label: 'reconstructed local source rejected',
    expectedTerm: 'reconstructed local source',
    fixture: { sourceAuthority: contract.sourceAuthority, examProofClaim: 'reconstructed local source' },
  },
  {
    label: 'missing answer model refs rejected',
    transformedTask: {
      sourceAuthority: contract.sourceAuthority,
      sourceMaterialRefs: [EXPECTED.sourceMaterialId],
      answerModelRefs: [],
      operationTrace: ['annualize_monthly_premium', 'derive_equal_cost_threshold', 'state_threshold_with_direction'],
    },
  },
];

for (const negative of negativeFixtures) {
  const errors = negative.transformedTask
    ? validateTransformedTaskShape(negative.transformedTask)
    : validateSourceAuthority(negative.fixture);
  if (negative.expectedTerm) {
    requireErrorContaining(errors, negative.label, `forbidden proof term: ${negative.expectedTerm}`);
  } else {
    requireErrors(errors, negative.label);
  }
}

console.log('OK exam source authority: external-primary contract, overlay values, answer-model refs, and negative fixtures pass');
