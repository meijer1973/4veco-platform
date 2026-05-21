#!/usr/bin/env node
/**
 * Validate EX-1 exam-ingestion pilot overlay records.
 *
 * HOW TO ADAPT:
 * - Keep this checker read-only.
 * - Add future pilot records by extending EXPECTED_ITEMS and the role-specific
 *   checks below.
 * - Do not turn this into a protected-reference mutation script.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const ITEM_OVERLAYS = 'references/data/exam-ingestion/exam-item-overlays.json';
const ANSWER_OVERLAYS = 'references/data/exam-ingestion/exam-answer-model-overlays.json';
const SOURCE_OVERLAYS = 'references/data/exam-ingestion/exam-source-annex-overlays.json';
const GATE_CLOSURE = 'reports/review-gates/GATE-EX0-exam-ingestion-contract/gate-closure.json';

const EXPECTED_ITEMS = new Map([
  ['vw-1022-a-25-1-o:opgave-1:question-3', 'calculation_heavy'],
  ['vw-1022-a-25-1-o:opgave-4:question-19', 'graph_source_heavy'],
  ['vw-1022-a-25-1-o:opgave-3:question-15', 'reasoning_answer_model_heavy'],
]);

const FALSE_AUTHORITY_FIELDS = [
  'external_source_mutated',
  'machine_reference_mutated',
  'unit_minting_authorized',
  'student_product_use_authorized',
];

const FALSE_PRODUCT_FIELDS = [
  'student_diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_decisions_authorized',
  'automatic_sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'student_facing_output_authorized',
];

const REQUIRED_RECORD_FIELDS = [
  'exam_item_id',
  'source_authority',
  'source_path',
  'source_record_locator',
  'source_version',
  'curriculum_version',
  'ingestion_status',
  'prompt_metadata',
  'prompt',
  'source_material',
  'question_classification',
  'official_answer_model',
  'skill_decomposition',
  'mtu_gap_classification',
  'lesson_build_handoff',
  'review_state',
  'product_boundary',
  'unresolved_questions',
];

function fail(message) {
  console.error(`Exam-ingestion pilot check failed: ${message}`);
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

function hasRequired(object, fields, label) {
  for (const field of fields) {
    assert(Object.prototype.hasOwnProperty.call(object || {}, field), `${label} missing ${field}`);
  }
}

function assertArray(value, label) {
  assert(Array.isArray(value), `${label} must be an array`);
}

function assertFalseFields(object, fields, label) {
  for (const field of fields) {
    assert(object?.[field] === false, `${label}.${field} must be false`);
  }
}

function assertSameSet(actual, expected, label) {
  const actualSorted = [...actual].sort();
  const expectedSorted = [...expected].sort();
  assert(
    JSON.stringify(actualSorted) === JSON.stringify(expectedSorted),
    `${label} mismatch: expected ${expectedSorted.join(', ')}, got ${actualSorted.join(', ')}`
  );
}

function checkGateClosure() {
  const closure = readJson(GATE_CLOSURE);
  assert(closure.status === 'pass_with_conditions', 'GATE-EX0 must be pass_with_conditions');
  assert(closure.allowed_next_sprint === 'EX-1', 'GATE-EX0 must authorize EX-1');
  assert(Array.isArray(closure.allowed_next_sprint_scope), 'GATE-EX0 allowed scope must be present');
  for (const requiredScope of [
    'three bounded exam-ingestion pilot overlays under references/data',
    'one calculation-heavy official VWO question',
    'one graph/source-heavy official VWO question',
    'one reasoning/answer-model-heavy official VWO question',
    'pilot-overlay validator for real EX-1 records',
  ]) {
    assert(
      closure.allowed_next_sprint_scope.includes(requiredScope),
      `GATE-EX0 allowed_next_sprint_scope missing ${requiredScope}`
    );
  }
}

function checkPackageBasics(pkg, expectedOverlayId, label) {
  assert(pkg.schema_version === 1, `${label}.schema_version`);
  assert(pkg.overlay_id === expectedOverlayId, `${label}.overlay_id`);
  assert(pkg.overlay_status === 'pilot', `${label}.overlay_status`);
  assert(typeof pkg.generated_by === 'string' && pkg.generated_by.includes('EX-1'), `${label}.generated_by`);
  assert(typeof pkg.generated_on === 'string' && pkg.generated_on.length > 0, `${label}.generated_on`);
  assertArray(pkg.source_files, `${label}.source_files`);
  assert(pkg.source_files.length > 0, `${label}.source_files must not be empty`);
  hasRequired(pkg, ['authority_boundary', 'records'], label);
  assertFalseFields(pkg.authority_boundary, FALSE_AUTHORITY_FIELDS, `${label}.authority_boundary`);
  assertArray(pkg.records, `${label}.records`);
  assert(pkg.records.length === EXPECTED_ITEMS.size, `${label}.records must contain exactly ${EXPECTED_ITEMS.size} records`);
}

function collectById(records, label) {
  const map = new Map();
  for (const record of records) {
    assert(typeof record.exam_item_id === 'string' && record.exam_item_id.length > 0, `${label} record missing exam_item_id`);
    assert(!map.has(record.exam_item_id), `${label} duplicate exam_item_id ${record.exam_item_id}`);
    map.set(record.exam_item_id, record);
  }
  assertSameSet(map.keys(), EXPECTED_ITEMS.keys(), `${label} exam_item_id set`);
  return map;
}

function allGapIds(record) {
  return [
    ...(record.source_material.gaps || []).map((gap) => gap.gap_id),
    ...(record.official_answer_model.answer_model_gaps || []).map((gap) => gap.gap_id),
  ];
}

function checkRecordCommon(record, expectedRole) {
  hasRequired(record, REQUIRED_RECORD_FIELDS, record.exam_item_id);
  assert(record.source_authority === 'external_primary', `${record.exam_item_id} source_authority`);
  assert(record.source_path === 'references/external/exam-questions.json', `${record.exam_item_id} source_path`);
  assert(record.ingestion_status !== 'reviewed_ready_for_mapping', `${record.exam_item_id} must not be ready for mapping in EX-1`);
  assert(record.prompt.prompt_status === 'extracted', `${record.exam_item_id} prompt must be extracted`);
  assert(record.prompt_metadata.points === record.official_answer_model.total_points, `${record.exam_item_id} point total mismatch`);
  assertArray(record.official_answer_model.answer_steps, `${record.exam_item_id} answer_steps`);
  assertArray(record.official_answer_model.point_rules, `${record.exam_item_id} point_rules`);
  assert(record.official_answer_model.answer_steps.length > 0, `${record.exam_item_id} missing answer steps`);
  assert(record.official_answer_model.point_rules.length > 0, `${record.exam_item_id} missing point rules`);
  assertArray(record.source_material.source_material_refs, `${record.exam_item_id} source refs`);
  assertArray(record.mtu_gap_classification, `${record.exam_item_id} mtu_gap_classification`);
  assert(record.review_state.contract_decision === 'ready_for_ex1_pilot_with_gaps', `${record.exam_item_id} contract decision`);
  assert(record.question_classification.content_domains.includes(`pilot:${expectedRole}`), `${record.exam_item_id} missing pilot role tag`);
  assertFalseFields(record.product_boundary, FALSE_PRODUCT_FIELDS, `${record.exam_item_id}.product_boundary`);
  assert(typeof record.product_boundary.warning_label === 'string' && record.product_boundary.warning_label.length > 0, `${record.exam_item_id} warning label`);

  for (const classification of record.mtu_gap_classification) {
    assert(classification.mutation_authorized === false, `${record.exam_item_id} mutation authorized on ${classification.requirement_id}`);
  }

  for (const [sectionName, items] of Object.entries(record.skill_decomposition)) {
    assertArray(items, `${record.exam_item_id} skill_decomposition.${sectionName}`);
    for (const item of items) {
      assertArray(item.candidate_unit_ids, `${record.exam_item_id} ${item.item_id} candidate_unit_ids`);
      for (const unitId of item.candidate_unit_ids) {
        assert(/^[A-Z][0-9]{2}$/.test(unitId), `${record.exam_item_id} invalid candidate unit ${unitId}`);
      }
    }
  }
}

function checkBlockingGap(record, gapId, gapType) {
  const gap = (record.source_material.gaps || []).find((candidate) => candidate.gap_id === gapId);
  assert(gap, `${record.exam_item_id} missing ${gapId}`);
  assert(gap.gap_type === gapType, `${record.exam_item_id} ${gapId} gap_type`);
  assert(gap.severity === 'blocking', `${record.exam_item_id} ${gapId} severity`);
  for (const block of ['full_exam_reconstruction', 'mtu_mapping', 'lesson_build_handoff', 'human_review']) {
    assert(gap.blocks.includes(block), `${record.exam_item_id} ${gapId} must block ${block}`);
  }
}

function checkRoleSpecificRecords(itemById) {
  const calc = itemById.get('vw-1022-a-25-1-o:opgave-1:question-3');
  assert(calc.source_material.tables.length === 1, 'calculation-heavy pilot must include one source table');
  assert(calc.official_answer_model.calculation_precision.status === 'extracted', 'calculation-heavy precision must be extracted');
  assert(calc.lesson_build_handoff.handoff_status === 'ready_with_gaps', 'calculation-heavy handoff status');
  assert(calc.mtu_gap_classification.some((row) => row.classification === 'operation_registry_need'), 'calculation-heavy operation gap');

  const graph = itemById.get('vw-1022-a-25-1-o:opgave-4:question-19');
  assert(graph.ingestion_status === 'reviewed_with_gaps', 'graph/source-heavy pilot must be reviewed_with_gaps');
  assert(graph.review_state.human_review_status === 'pass_with_gaps', 'graph/source-heavy review status');
  assert(graph.lesson_build_handoff.handoff_status === 'not_ready', 'graph/source-heavy handoff must be not_ready');
  assert(graph.source_material.figures.some((item) => item.extraction_status === 'gap'), 'graph/source-heavy must expose figure gap');
  assert(graph.source_material.graphs.length >= 3, 'graph/source-heavy must list the three graph surfaces');
  assert(graph.source_material.graphs.every((item) => item.extraction_status === 'gap'), 'graph/source-heavy graphs must remain gaps');
  assert(graph.source_material.uitwerkbijlagen.some((item) => item.extraction_status === 'gap'), 'graph/source-heavy must expose worksheet gap');
  checkBlockingGap(graph, 'q19-source-annex-gap', 'source_annex_gap');
  checkBlockingGap(graph, 'q19-graph-object-gap', 'graph_object_gap');
  assert(graph.mtu_gap_classification.some((row) => row.classification === 'source_annex_gap'), 'graph/source-heavy source_annex_gap classification');
  assert(graph.mtu_gap_classification.some((row) => row.classification === 'pv_graph_need'), 'graph/source-heavy pv_graph_need classification');

  const reasoning = itemById.get('vw-1022-a-25-1-o:opgave-3:question-15');
  assert(reasoning.prompt_metadata.question_type === 'uitleg_dat', 'reasoning pilot question_type');
  assert(reasoning.question_classification.reasoning_required === true, 'reasoning pilot reasoning_required');
  assert(reasoning.mtu_gap_classification.some((row) => row.candidate_unit_ids.includes('F03')), 'reasoning pilot F03 classification');
  assert(reasoning.mtu_gap_classification.some((row) => row.candidate_unit_ids.includes('F09')), 'reasoning pilot F09 classification');
  assert(reasoning.mtu_gap_classification.some((row) => row.classification === 'answer_skill_need'), 'reasoning pilot answer-skill classification');
}

function checkAnswerOverlay(answerById, itemById) {
  for (const [examItemId, answerRecord] of answerById.entries()) {
    const item = itemById.get(examItemId);
    const expectedRole = EXPECTED_ITEMS.get(examItemId);
    assert(answerRecord.pilot_role === expectedRole, `${examItemId} answer overlay role`);
    assert(answerRecord.source_ref === item.official_answer_model.source_ref, `${examItemId} answer overlay source_ref`);
    assert(answerRecord.official_answer_model.total_points === item.official_answer_model.total_points, `${examItemId} answer overlay total_points`);
    assertSameSet(
      answerRecord.official_answer_model.answer_step_ids,
      item.official_answer_model.answer_steps.map((step) => step.step_id),
      `${examItemId} answer step ids`
    );
    assertSameSet(
      answerRecord.official_answer_model.point_rule_ids,
      item.official_answer_model.point_rules.map((rule) => rule.rule_id),
      `${examItemId} point rule ids`
    );
  }
}

function checkSourceOverlay(sourceById, itemById) {
  for (const [examItemId, sourceRecord] of sourceById.entries()) {
    const item = itemById.get(examItemId);
    const expectedRole = EXPECTED_ITEMS.get(examItemId);
    assert(sourceRecord.pilot_role === expectedRole, `${examItemId} source overlay role`);
    assert(sourceRecord.source_material_status === item.source_material.source_material_status, `${examItemId} source overlay status`);
    assertSameSet(
      sourceRecord.source_material_refs,
      item.source_material.source_material_refs,
      `${examItemId} source refs`
    );
    const blockingGapIds = allGapIds(item).filter((gapId) => {
      const sourceGap = (item.source_material.gaps || []).find((gap) => gap.gap_id === gapId);
      const answerGap = (item.official_answer_model.answer_model_gaps || []).find((gap) => gap.gap_id === gapId);
      return [sourceGap, answerGap].filter(Boolean).some((gap) => gap.severity === 'blocking');
    });
    assertSameSet(sourceRecord.blocking_gaps, blockingGapIds, `${examItemId} blocking gaps`);
  }
}

function checkNoHiddenGaps(itemById, sourceById) {
  for (const [examItemId, item] of itemById.entries()) {
    const sourceOverlay = sourceById.get(examItemId);
    const blockingGaps = (item.source_material.gaps || []).filter((gap) => gap.severity === 'blocking');
    if (blockingGaps.length === 0) continue;
    assert(sourceOverlay.blocking_gaps.length === blockingGaps.length, `${examItemId} source overlay must carry all blocking gaps`);
    assert(item.lesson_build_handoff.blocked_until.length > 0, `${examItemId} must keep blocked_until visible`);
    assert(item.review_state.human_review_status === 'pass_with_gaps', `${examItemId} blocking gaps require pass_with_gaps review state`);
  }
}

function main() {
  checkGateClosure();

  const itemPackage = readJson(ITEM_OVERLAYS);
  const answerPackage = readJson(ANSWER_OVERLAYS);
  const sourcePackage = readJson(SOURCE_OVERLAYS);

  checkPackageBasics(itemPackage, 'EX-1-exam-item-overlays', 'item overlays');
  checkPackageBasics(answerPackage, 'EX-1-exam-answer-model-overlays', 'answer overlays');
  checkPackageBasics(sourcePackage, 'EX-1-exam-source-annex-overlays', 'source overlays');

  const itemById = collectById(itemPackage.records, 'item overlays');
  const answerById = collectById(answerPackage.records, 'answer overlays');
  const sourceById = collectById(sourcePackage.records, 'source overlays');

  for (const [examItemId, record] of itemById.entries()) {
    checkRecordCommon(record, EXPECTED_ITEMS.get(examItemId));
  }

  checkRoleSpecificRecords(itemById);
  checkAnswerOverlay(answerById, itemById);
  checkSourceOverlay(sourceById, itemById);
  checkNoHiddenGaps(itemById, sourceById);

  console.log('OK exam-ingestion pilots: three EX-1 pilot overlay families validated.');
}

if (require.main === module) main();
