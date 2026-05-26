const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

const FUTURE_STORAGE = [
  'references/data/exam-ingestion/operation-candidates.json',
  'references/data/exam-ingestion/answer-skill-candidates.json',
  'references/data/exam-ingestion/source-annex-extraction-overlays.json',
];

const FALSE_BOUNDARY_FIELDS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'unit_minting_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'source_annex_extraction_execution_authorized',
  'pv_graph_mutation_authorized',
  'target_exercise_promotion_authorized',
  'lesson_output_mutation_authorized',
  'cp6_closure_authorized',
  'year1_closure_authorized',
  'student_product_use_authorized',
];

function relPath(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function file(rel) {
  return path.join(ROOT, rel);
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function ensure(condition, message) {
  if (!condition) throw new ValidationError(message);
}

function readJson(inputPath) {
  const text = fs.readFileSync(inputPath, 'utf8');
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new ValidationError(`invalid JSON in ${inputPath}: ${error.message}`);
  }
}

function parseJsonInput(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new ValidationError(`invalid JSON for ${label}: ${error.message}`);
  }
}

function assertArray(value, label) {
  ensure(Array.isArray(value), `${label} must be an array`);
}

function assertNonEmptyString(value, label) {
  ensure(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string`);
}

function assertNonEmptyArray(value, label) {
  assertArray(value, label);
  ensure(value.length > 0, `${label} must not be empty`);
}

function assertAuthorityBoundaryFalse(boundary, label) {
  ensure(boundary && typeof boundary === 'object' && !Array.isArray(boundary), `${label} must be an object`);
  for (const field of FALSE_BOUNDARY_FIELDS) {
    ensure(boundary[field] === false, `${label}.${field} must be false`);
  }
}

function assertMutationProductFlags(record, label) {
  if ('mutation_authorized' in record) {
    ensure(record.mutation_authorized === false, `${label}.mutation_authorized must be false`);
  }
  if ('student_product_use_authorized' in record) {
    ensure(record.student_product_use_authorized === false, `${label}.student_product_use_authorized must be false`);
  }
  if (record.authority_boundary) assertAuthorityBoundaryFalse(record.authority_boundary, `${label}.authority_boundary`);
}

function assertFutureStorageAbsent() {
  const existing = FUTURE_STORAGE.filter((rel) => fs.existsSync(file(rel)));
  ensure(existing.length === 0, `future candidate storage must not exist: ${existing.join(', ')}`);
}

function allUnitIds(candidate) {
  const ids = new Set();
  for (const key of ['supporting_unit_ids', 'weak_or_rejected_unit_ids', 'content_support_unit_ids']) {
    for (const id of candidate[key] || []) ids.add(id);
  }
  for (const assessment of candidate.unit_support_assessments || []) ids.add(assessment.unit_id);
  return ids;
}

function hasRequirement(candidate, requirementId) {
  return (candidate.source_requirement_ids || []).includes(requirementId);
}

function hasExamItem(candidate, marker) {
  return (candidate.source_exam_item_ids || []).some((id) => id.includes(marker));
}

function assessmentByUnit(candidate, unitId) {
  return (candidate.unit_support_assessments || []).filter((item) => item.unit_id === unitId);
}

function validateUnitSupportAssessments(candidate, label) {
  assertNonEmptyArray(candidate.unit_support_assessments, `${label}.unit_support_assessments`);
  const valid = new Set(['supporting', 'weak_prerequisite', 'rejected']);
  for (const [index, assessment] of candidate.unit_support_assessments.entries()) {
    assertNonEmptyString(assessment.unit_id, `${label}.unit_support_assessments[${index}].unit_id`);
    ensure(valid.has(assessment.assessment), `${label}.unit_support_assessments[${index}].assessment is invalid`);
    assertNonEmptyString(assessment.rationale, `${label}.unit_support_assessments[${index}].rationale`);
  }
  for (const unitId of candidate.supporting_unit_ids || []) {
    const assessments = assessmentByUnit(candidate, unitId);
    ensure(assessments.some((item) => item.assessment === 'supporting'), `${label} supporting unit ${unitId} needs a supporting assessment`);
  }
  for (const unitId of candidate.weak_or_rejected_unit_ids || []) {
    const assessments = assessmentByUnit(candidate, unitId);
    ensure(
      assessments.some((item) => item.assessment === 'weak_prerequisite' || item.assessment === 'rejected'),
      `${label} weak_or_rejected unit ${unitId} must be explicitly weak_prerequisite or rejected`
    );
  }
}

function validateOperationCandidate(candidate, label = 'operation candidate') {
  const required = [
    'operation_id',
    'operation_status',
    'label_nl',
    'operation_family',
    'source_exam_item_ids',
    'source_requirement_ids',
    'evidence_refs',
    'answer_model_refs',
    'input_objects',
    'output_expectation',
    'required_steps',
    'supporting_unit_ids',
    'unit_support_assessments',
    'blocking_gap_ids',
    'review_state',
    'authority_boundary',
    'mutation_authorized',
    'student_product_use_authorized',
  ];
  for (const field of required) ensure(field in candidate, `${label} missing ${field}`);
  ensure(!('status' in candidate), `${label} must use operation_status, not generic status`);
  assertNonEmptyString(candidate.operation_id, `${label}.operation_id`);
  ensure(/^EX_OP_[A-Z0-9_]+$/.test(candidate.operation_id), `${label}.operation_id must start with EX_OP_`);
  ensure(
    ['design_candidate', 'blocked_by_source_gap', 'reviewed_candidate', 'deferred'].includes(candidate.operation_status),
    `${label}.operation_status is invalid`
  );
  ensure(
    ['calculation', 'graphical', 'source_reading', 'reasoning', 'mixed'].includes(candidate.operation_family),
    `${label}.operation_family is invalid`
  );
  for (const field of ['source_exam_item_ids', 'source_requirement_ids', 'evidence_refs', 'required_steps']) {
    assertNonEmptyArray(candidate[field], `${label}.${field}`);
  }
  assertArray(candidate.answer_model_refs, `${label}.answer_model_refs`);
  assertArray(candidate.input_objects, `${label}.input_objects`);
  assertArray(candidate.supporting_unit_ids, `${label}.supporting_unit_ids`);
  assertArray(candidate.blocking_gap_ids, `${label}.blocking_gap_ids`);
  assertNonEmptyString(candidate.output_expectation, `${label}.output_expectation`);
  validateUnitSupportAssessments(candidate, label);
  assertMutationProductFlags(candidate, label);

  const unitIds = allUnitIds(candidate);
  const isQ3Threshold =
    hasRequirement(candidate, 'q3-calc-1') ||
    candidate.operation_id === 'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON' ||
    hasExamItem(candidate, 'question-3');
  if (isQ3Threshold) {
    ensure(unitIds.has('A61'), `${label} q3 threshold route must include A61 support`);
    const a15 = assessmentByUnit(candidate, 'A15');
    ensure(a15.length === 0 || a15.every((item) => item.assessment === 'rejected'), `${label} A15 must be rejected for q3 annual threshold`);
    ensure(!(candidate.supporting_unit_ids || []).includes('A15'), `${label} A15 cannot be supporting_unit_ids for q3 annual threshold`);
  }

  const isQ19Graph = hasRequirement(candidate, 'q19-graph-op-1') || hasExamItem(candidate, 'question-19');
  if (isQ19Graph) {
    ensure(
      candidate.blocking_gap_ids.includes('q19-source-annex-gap') &&
        candidate.blocking_gap_ids.includes('q19-graph-object-gap'),
      `${label} q19 graph/reasoning records must carry q19 blocking gaps`
    );
    const a45 = assessmentByUnit(candidate, 'A45');
    ensure(a45.length === 0 || a45.every((item) => item.assessment === 'weak_prerequisite'), `${label} A45 must be weak_prerequisite for q19`);
    ensure(!(candidate.supporting_unit_ids || []).includes('A45'), `${label} A45 cannot be primary q19 graph support`);
  }
}

function validateAnswerSkillCandidate(candidate, label = 'answer-skill candidate') {
  const required = [
    'answer_skill_id',
    'answer_skill_status',
    'label_nl',
    'answer_format',
    'source_exam_item_ids',
    'source_requirement_ids',
    'correction_model_step_refs',
    'point_rule_refs',
    'rewarded_wording',
    'required_terms',
    'accepted_alternatives',
    'content_support_unit_ids',
    'operation_support_ids',
    'blocking_gap_ids',
    'review_state',
    'authority_boundary',
    'mutation_authorized',
    'student_product_use_authorized',
  ];
  for (const field of required) ensure(field in candidate, `${label} missing ${field}`);
  ensure(!('status' in candidate), `${label} must use answer_skill_status, not generic status`);
  assertNonEmptyString(candidate.answer_skill_id, `${label}.answer_skill_id`);
  ensure(/^EX_ANS_[A-Z0-9_]+$/.test(candidate.answer_skill_id), `${label}.answer_skill_id must start with EX_ANS_`);
  ensure(
    ['design_candidate', 'reviewed_candidate', 'blocked_by_source_gap', 'deferred'].includes(candidate.answer_skill_status),
    `${label}.answer_skill_status is invalid`
  );
  for (const field of ['source_exam_item_ids', 'source_requirement_ids', 'correction_model_step_refs', 'rewarded_wording']) {
    assertNonEmptyArray(candidate[field], `${label}.${field}`);
  }
  for (const field of ['point_rule_refs', 'required_terms', 'accepted_alternatives', 'content_support_unit_ids', 'operation_support_ids', 'blocking_gap_ids']) {
    assertArray(candidate[field], `${label}.${field}`);
  }
  assertMutationProductFlags(candidate, label);

  if (hasRequirement(candidate, 'q3-answer-1') || candidate.answer_skill_id === 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION') {
    ensure(candidate.answer_format === 'threshold_conclusion', `${label} q3 answer skill must use threshold_conclusion format`);
    const wording = candidate.rewarded_wording.join(' ').toLowerCase();
    ensure(/threshold|drempel|grens/.test(wording), `${label} q3 wording must mention threshold/drempel/grens`);
    ensure(/unit|euro|jaar|per year|per jaar/.test(wording), `${label} q3 wording must preserve unit/direction wording`);
  }

  if (hasRequirement(candidate, 'q15-answer-1') || candidate.answer_skill_id === 'EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION') {
    ensure(candidate.answer_format === 'two_step_explanation', `${label} q15 answer skill must use two_step_explanation format`);
    ensure(candidate.rewarded_wording.length >= 2, `${label} q15 answer skill must preserve two-step wording`);
    for (const unitId of ['D27', 'F03', 'F09']) {
      ensure(candidate.content_support_unit_ids.includes(unitId), `${label} q15 answer skill must keep ${unitId} as content support`);
    }
  }
}

function validateOperationDocument(doc, label = 'operation candidates document') {
  ensure(doc && typeof doc === 'object' && !Array.isArray(doc), `${label} must be an object`);
  ensure(doc.schema_version === 1, `${label}.schema_version must be 1`);
  ensure(doc.storage_id === 'operation-candidates', `${label}.storage_id must be operation-candidates`);
  assertAuthorityBoundaryFalse(doc.authority_boundary, `${label}.authority_boundary`);
  assertArray(doc.candidates, `${label}.candidates`);
  for (const [index, candidate] of doc.candidates.entries()) {
    validateOperationCandidate(candidate, `${label}.candidates[${index}]`);
  }
}

function validateAnswerSkillDocument(doc, label = 'answer-skill candidates document') {
  ensure(doc && typeof doc === 'object' && !Array.isArray(doc), `${label} must be an object`);
  ensure(doc.schema_version === 1, `${label}.schema_version must be 1`);
  ensure(doc.storage_id === 'answer-skill-candidates', `${label}.storage_id must be answer-skill-candidates`);
  assertAuthorityBoundaryFalse(doc.authority_boundary, `${label}.authority_boundary`);
  assertArray(doc.candidates, `${label}.candidates`);
  for (const [index, candidate] of doc.candidates.entries()) {
    validateAnswerSkillCandidate(candidate, `${label}.candidates[${index}]`);
  }
}

function validateOperationAnswerPair(operationDoc, answerDoc) {
  if (!operationDoc || !answerDoc) return;
  const operationRequirements = new Set();
  for (const candidate of operationDoc.candidates || []) {
    for (const id of candidate.source_requirement_ids || []) operationRequirements.add(id);
  }
  const answerRequirements = new Set();
  for (const candidate of answerDoc.candidates || []) {
    for (const id of candidate.source_requirement_ids || []) answerRequirements.add(id);
  }
  if (operationRequirements.has('q3-calc-1')) {
    ensure(answerRequirements.has('q3-answer-1'), 'q3-calc-1 cannot hide q3-answer-1 answer-skill need');
  }
  if (answerRequirements.has('q15-answer-1')) {
    const q15 = (answerDoc.candidates || []).find((candidate) => hasRequirement(candidate, 'q15-answer-1'));
    ensure(q15 && q15.content_support_unit_ids.includes('D27'), 'q15 answer skill must keep content support visible');
  }
}

function isSubstantive(value) {
  if (Array.isArray(value)) return value.some((item) => isSubstantive(item));
  if (typeof value !== 'string') return Boolean(value);
  const text = value.trim().toLowerCase();
  return text.length > 0 && !['tbd', 'todo', 'unknown', 'n/a', 'na', 'vague', 'not extracted'].includes(text);
}

function isReconstructableStatus(status) {
  return status === 'reconstructable_pending_review' || status === 'reviewed_reconstructable';
}

function validateGraphOverlay(record, label = 'graph overlay') {
  const required = [
    'extraction_id',
    'source_exam_item_id',
    'source_material_id',
    'source_page_or_locator',
    'graph_type',
    'axis_labels',
    'axis_units',
    'scale_or_tick_marks',
    'curve_or_series_labels',
    'coordinates_or_reconstructable_geometry',
    'legend_mapping',
    'student_action_regions',
    'extraction_status',
    'review_state',
    'blocking_gap_ids',
    'authority_boundary',
  ];
  for (const field of required) ensure(field in record, `${label} missing ${field}`);
  assertAuthorityBoundaryFalse(record.authority_boundary, `${label}.authority_boundary`);
  for (const field of ['axis_labels', 'axis_units', 'scale_or_tick_marks', 'curve_or_series_labels', 'student_action_regions', 'blocking_gap_ids']) {
    assertArray(record[field], `${label}.${field}`);
  }
  if (isReconstructableStatus(record.extraction_status)) {
    for (const field of [
      'source_page_or_locator',
      'axis_labels',
      'axis_units',
      'scale_or_tick_marks',
      'curve_or_series_labels',
      'coordinates_or_reconstructable_geometry',
      'legend_mapping',
      'student_action_regions',
    ]) {
      ensure(isSubstantive(record[field]), `${label}.${field} must be substantive for reconstructable status`);
    }
    ensure(record.blocking_gap_ids.length === 0, `${label}.blocking_gap_ids must be empty for reconstructable status`);
  }
  if (record.source_exam_item_id.includes('question-19') && record.blocking_gap_ids.length > 0) {
    ensure(!isReconstructableStatus(record.extraction_status), `${label} q19 cannot be reconstructable while blocking gaps remain`);
  }
}

function validateSourceAnnexOverlay(record, label = 'source-annex overlay') {
  const required = [
    'extraction_id',
    'source_exam_item_id',
    'source_material_id',
    'annex_type',
    'source_page_or_locator',
    'prompt_reference',
    'worksheet_regions',
    'required_student_marks',
    'extraction_status',
    'review_state',
    'blocking_gap_ids',
    'authority_boundary',
  ];
  for (const field of required) ensure(field in record, `${label} missing ${field}`);
  assertAuthorityBoundaryFalse(record.authority_boundary, `${label}.authority_boundary`);
  for (const field of ['worksheet_regions', 'required_student_marks', 'blocking_gap_ids']) {
    assertArray(record[field], `${label}.${field}`);
  }
  if (isReconstructableStatus(record.extraction_status)) {
    for (const field of [
      'source_page_or_locator',
      'prompt_reference',
      'worksheet_regions',
      'required_student_marks',
    ]) {
      ensure(isSubstantive(record[field]), `${label}.${field} must be substantive for reconstructable status`);
    }
    ensure(record.blocking_gap_ids.length === 0, `${label}.blocking_gap_ids must be empty for reconstructable status`);
  }
  if (record.source_exam_item_id.includes('question-19') && record.blocking_gap_ids.length > 0) {
    ensure(!isReconstructableStatus(record.extraction_status), `${label} q19 cannot be reconstructable while blocking gaps remain`);
  }
}

function validateSourceExtractionDocument(doc, label = 'source-annex extraction document') {
  ensure(doc && typeof doc === 'object' && !Array.isArray(doc), `${label} must be an object`);
  ensure(doc.schema_version === 1, `${label}.schema_version must be 1`);
  ensure(doc.storage_id === 'source-annex-extraction-overlays', `${label}.storage_id must be source-annex-extraction-overlays`);
  assertAuthorityBoundaryFalse(doc.authority_boundary, `${label}.authority_boundary`);
  assertArray(doc.graph_overlays, `${label}.graph_overlays`);
  assertArray(doc.source_annex_overlays, `${label}.source_annex_overlays`);
  for (const [index, record] of doc.graph_overlays.entries()) {
    validateGraphOverlay(record, `${label}.graph_overlays[${index}]`);
  }
  for (const [index, record] of doc.source_annex_overlays.entries()) {
    validateSourceAnnexOverlay(record, `${label}.source_annex_overlays[${index}]`);
  }
}

function parseArgs(argv) {
  const args = {};
  const positional = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const key = arg.slice(2);
    if (key.includes('=')) {
      const [name, ...rest] = key.split('=');
      args[name] = rest.join('=');
    } else if (index + 1 < argv.length && !argv[index + 1].startsWith('--')) {
      args[key] = argv[index + 1];
      index += 1;
    } else {
      args[key] = true;
    }
  }
  args._ = positional;
  return args;
}

function loadSpecFromArgs(args, label = 'spec') {
  if (args.spec && args['spec-file']) {
    throw new ValidationError(`use either --spec or --spec-file for ${label}, not both`);
  }
  if (args.spec) return parseJsonInput(args.spec, label);
  if (args['spec-file']) return readJson(args['spec-file']);
  throw new ValidationError(`missing --spec or --spec-file for ${label}`);
}

function ensureDryRunOnly(args, label) {
  ensure(args['dry-run'] === true, `${label} requires --dry-run`);
  for (const forbidden of ['write', 'commit', 'execute', 'execute-extraction', 'storage-path', 'output']) {
    ensure(!(forbidden in args), `${label} does not support --${forbidden} under EX-7`);
  }
}

module.exports = {
  ROOT,
  FUTURE_STORAGE,
  ValidationError,
  assertFutureStorageAbsent,
  assertAuthorityBoundaryFalse,
  ensure,
  ensureDryRunOnly,
  file,
  loadSpecFromArgs,
  parseArgs,
  readJson,
  relPath,
  validateAnswerSkillCandidate,
  validateAnswerSkillDocument,
  validateGraphOverlay,
  validateOperationAnswerPair,
  validateOperationCandidate,
  validateOperationDocument,
  validateSourceAnnexOverlay,
  validateSourceExtractionDocument,
};
