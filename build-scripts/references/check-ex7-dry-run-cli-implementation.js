#!/usr/bin/env node
/**
 * check-ex7-dry-run-cli-implementation.js
 *
 * End-to-end EX-7 checker. It creates temporary non-persistent fixtures under
 * the OS temp directory, exercises the validators and dry-run CLIs, proves the
 * required rejection rules, and removes the fixtures again.
 *
 * HOW TO ADAPT:
 * - Keep fixtures temporary. Do not move them into references/data/exam-ingestion.
 * - Add new gate-specific rejection cases here only after they are implemented
 *   in the shared validation library.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  FUTURE_STORAGE,
  ROOT,
  assertFutureStorageAbsent,
  file,
} = require('./lib/exam-ingestion-candidate-validation');

const AUTHORITY_FALSE = Object.freeze({
  protected_reference_mutation_authorized: false,
  external_source_mutation_authorized: false,
  machine_reference_mutation_authorized: false,
  unit_minting_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_mutation_authorized: false,
  source_annex_extraction_execution_authorized: false,
  pv_graph_mutation_authorized: false,
  target_exercise_promotion_authorized: false,
  lesson_output_mutation_authorized: false,
  cp6_closure_authorized: false,
  year1_closure_authorized: false,
  student_product_use_authorized: false,
});

function fail(message) {
  console.error(`EX-7 dry-run CLI implementation check failed: ${message}`);
  process.exit(1);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function writeJson(dir, name, value) {
  const fullPath = path.join(dir, name);
  fs.writeFileSync(fullPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return fullPath;
}

function run(args, expected, label) {
  const result = spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
  });
  const passed = result.status === 0;
  if (expected === 'pass' && !passed) {
    fail(`${label} expected pass but failed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
  if (expected === 'fail' && passed) {
    fail(`${label} expected failure but passed\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
}

function q3OperationCandidate() {
  return {
    operation_id: 'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON',
    operation_status: 'design_candidate',
    label_nl: 'Jaarlijkse kosten-drempel vergelijken',
    operation_family: 'calculation',
    source_exam_item_ids: ['vw-1022-a-25-1-o:opgave-1:question-3'],
    source_requirement_ids: ['q3-calc-1'],
    evidence_refs: ['reports/review-gates/GATE-EX6-validator-cli-planning/gate-closure.json'],
    answer_model_refs: ['q3-correction-threshold-step'],
    input_objects: [
      {
        object_type: 'table_value',
        description: 'Premie- en eigenrisicobedragen uit de bron selecteren.',
        source_ref: 'EX-1 pilot q3 source table',
      },
    ],
    output_expectation: 'Een jaarlijkse zorgkostendrempel in euro per jaar.',
    required_steps: [
      {
        step_id: 'select-values',
        description: 'Selecteer premieverschil en eigenrisico uit de tabel.',
        required_unit_ids: ['A61'],
      },
      {
        step_id: 'annualize-premium',
        description: 'Zet het maandelijkse premieverschil om naar een jaarbedrag.',
        depends_on_step_ids: ['select-values'],
      },
      {
        step_id: 'compare-threshold',
        description: 'Vergelijk het premievoordeel met het extra eigen risico.',
        depends_on_step_ids: ['annualize-premium'],
      },
    ],
    supporting_unit_ids: ['A61'],
    unit_support_assessments: [
      {
        unit_id: 'A61',
        assessment: 'supporting',
        rationale: 'A61 ondersteunt het selecteren van tabelwaarden voor de berekening.',
      },
      {
        unit_id: 'A15',
        assessment: 'rejected',
        rationale: 'A15 is prijselasticiteit en is stale/incorrect voor deze drempeloperatie.',
      },
    ],
    weak_or_rejected_unit_ids: ['A15'],
    blocking_gap_ids: [],
    review_state: 'needs_human_review',
    authority_boundary: clone(AUTHORITY_FALSE),
    mutation_authorized: false,
    student_product_use_authorized: false,
  };
}

function q19GraphOperationCandidate() {
  return {
    operation_id: 'EX_OP_Q19_MARKET_SHIFT_GRAPH_ROUTE',
    operation_status: 'blocked_by_source_gap',
    label_nl: 'Vraagverschuivingen in gekoppelde marktdiagrammen tekenen',
    operation_family: 'graphical',
    source_exam_item_ids: ['vw-1022-a-25-1-o:opgave-4:question-19'],
    source_requirement_ids: ['q19-graph-op-1'],
    evidence_refs: ['reports/review-gates/GATE-EX6-validator-cli-planning/gate-closure.json'],
    answer_model_refs: ['q19-correction-graph-step'],
    input_objects: [
      {
        object_type: 'graph_object',
        description: 'Drie marktdiagrammen uit de uitwerkbijlage.',
        source_ref: 'q19 source figure and worksheet',
      },
    ],
    output_expectation: 'Rechts verschoven vraagcurves met richtingconclusies.',
    required_steps: [
      {
        step_id: 'shift-demand',
        description: 'Teken vraagcurves naar rechts in de drie markten.',
        required_unit_ids: ['A42', 'D10'],
      },
    ],
    supporting_unit_ids: ['A42', 'D10'],
    unit_support_assessments: [
      {
        unit_id: 'A42',
        assessment: 'supporting',
        rationale: 'A42 ondersteunt grafisch verschuiven met voor/na-curves.',
      },
      {
        unit_id: 'D10',
        assessment: 'supporting',
        rationale: 'D10 ondersteunt vraag/aanbodverschuivingen na een conjunctuurschok.',
      },
      {
        unit_id: 'A45',
        assessment: 'weak_prerequisite',
        rationale: 'A45 is alleen zwakke steun voor P-Q-grafieken, niet primaire q19-verschuiving.',
      },
    ],
    weak_or_rejected_unit_ids: ['A45'],
    blocking_gap_ids: ['q19-source-annex-gap', 'q19-graph-object-gap'],
    review_state: 'blocked',
    authority_boundary: clone(AUTHORITY_FALSE),
    mutation_authorized: false,
    student_product_use_authorized: false,
  };
}

function q3AnswerSkillCandidate() {
  return {
    answer_skill_id: 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION',
    answer_skill_status: 'design_candidate',
    label_nl: 'Drempelconclusie met eenheid en richting formuleren',
    answer_format: 'threshold_conclusion',
    source_exam_item_ids: ['vw-1022-a-25-1-o:opgave-1:question-3'],
    source_requirement_ids: ['q3-answer-1'],
    correction_model_step_refs: ['q3-correction-threshold-conclusion'],
    point_rule_refs: ['q3-point-rule-threshold-conclusion'],
    rewarded_wording: [
      'Noem de drempel/grens in euro per jaar.',
      'Formuleer de richting: goedkoper tot en met die jaarlijkse zorgkosten.',
    ],
    required_terms: ['euro per jaar', 'tot en met'],
    accepted_alternatives: ['per jaar', 'jaarlijkse kosten'],
    content_support_unit_ids: [],
    operation_support_ids: ['EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON'],
    blocking_gap_ids: [],
    review_state: 'needs_human_review',
    authority_boundary: clone(AUTHORITY_FALSE),
    mutation_authorized: false,
    student_product_use_authorized: false,
  };
}

function q15AnswerSkillCandidate() {
  return {
    answer_skill_id: 'EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION',
    answer_skill_status: 'design_candidate',
    label_nl: 'Dominante strategie en gevangenendilemma in twee stappen uitleggen',
    answer_format: 'two_step_explanation',
    source_exam_item_ids: ['vw-1022-a-25-1-o:opgave-3:question-15'],
    source_requirement_ids: ['q15-answer-1'],
    correction_model_step_refs: ['q15-correction-dominant-strategy', 'q15-correction-prisoners-dilemma'],
    point_rule_refs: ['q15-point-rule-1', 'q15-point-rule-2'],
    rewarded_wording: [
      'Leg eerst uit dat onderbieden voor beide aanbieders dominant is.',
      'Leg daarna uit dat lagere omzet/winst samen het gevangenendilemma vormt.',
    ],
    required_terms: ['dominante strategie', 'gevangenendilemma'],
    accepted_alternatives: ['prisoner’s dilemma', 'gevangenendilemma-uitkomst'],
    content_support_unit_ids: ['D27', 'F03', 'F09'],
    operation_support_ids: [],
    blocking_gap_ids: [],
    review_state: 'needs_human_review',
    authority_boundary: clone(AUTHORITY_FALSE),
    mutation_authorized: false,
    student_product_use_authorized: false,
  };
}

function validOperationDoc() {
  return {
    schema_version: 1,
    storage_id: 'operation-candidates',
    storage_status: 'future_candidate_storage',
    generated_on: '2026-05-26T00:00:00.000Z',
    source_files: ['reports/review-gates/GATE-EX6-validator-cli-planning/gate-closure.json'],
    authority_boundary: clone(AUTHORITY_FALSE),
    candidates: [q3OperationCandidate(), q19GraphOperationCandidate()],
  };
}

function validAnswerDoc() {
  return {
    schema_version: 1,
    storage_id: 'answer-skill-candidates',
    storage_status: 'future_candidate_storage',
    generated_on: '2026-05-26T00:00:00.000Z',
    source_files: ['reports/review-gates/GATE-EX6-validator-cli-planning/gate-closure.json'],
    authority_boundary: clone(AUTHORITY_FALSE),
    candidates: [q3AnswerSkillCandidate(), q15AnswerSkillCandidate()],
  };
}

function validSourceDoc() {
  return {
    schema_version: 1,
    storage_id: 'source-annex-extraction-overlays',
    storage_status: 'future_candidate_storage',
    generated_on: '2026-05-26T00:00:00.000Z',
    source_files: ['reports/review-gates/GATE-EX6-validator-cli-planning/gate-closure.json'],
    authority_boundary: clone(AUTHORITY_FALSE),
    graph_overlays: [
      {
        extraction_id: 'EX_SRC_Q19_MARKET_DIAGRAMS',
        source_exam_item_id: 'vw-1022-a-25-1-o:opgave-4:question-19',
        source_material_id: 'q19-source-figure',
        source_page_or_locator: 'source figure not yet extracted',
        graph_type: 'market_diagram',
        axis_labels: ['prijs', 'hoeveelheid'],
        axis_units: [],
        scale_or_tick_marks: [],
        curve_or_series_labels: [],
        coordinates_or_reconstructable_geometry: 'not extracted',
        legend_mapping: 'not extracted',
        student_action_regions: [],
        extraction_status: 'partial_with_blocking_gap',
        review_state: 'blocked',
        blocking_gap_ids: ['q19-source-annex-gap', 'q19-graph-object-gap'],
        authority_boundary: clone(AUTHORITY_FALSE),
      },
    ],
    source_annex_overlays: [
      {
        extraction_id: 'EX_SRC_Q19_UITWERKBIJLAGE',
        source_exam_item_id: 'vw-1022-a-25-1-o:opgave-4:question-19',
        source_material_id: 'q19-uitwerkbijlage',
        annex_type: 'uitwerkbijlage',
        source_page_or_locator: 'worksheet not yet extracted',
        prompt_reference: 'q19 prompt',
        worksheet_regions: [],
        required_student_marks: [],
        extraction_status: 'partial_with_blocking_gap',
        review_state: 'blocked',
        blocking_gap_ids: ['q19-source-annex-gap', 'q19-graph-object-gap'],
        authority_boundary: clone(AUTHORITY_FALSE),
      },
    ],
  };
}

function main() {
  assertFutureStorageAbsent();
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), '4veco-ex7-'));

  try {
    const operationDoc = validOperationDoc();
    const answerDoc = validAnswerDoc();
    const sourceDoc = validSourceDoc();

    const opPath = writeJson(tempDir, 'operation-valid.json', operationDoc);
    const answerPath = writeJson(tempDir, 'answer-valid.json', answerDoc);
    const sourcePath = writeJson(tempDir, 'source-valid.json', sourceDoc);

    run(['build-scripts/references/check-operation-answer-skill-candidates.js'], 'pass', 'default operation/answer check');
    run(['build-scripts/references/check-source-annex-extraction-overlays.js'], 'pass', 'default source check');
    run([
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      '--operation-input',
      opPath,
      '--answer-input',
      answerPath,
    ], 'pass', 'valid operation/answer pair');
    run([
      'build-scripts/references/check-source-annex-extraction-overlays.js',
      '--input',
      sourcePath,
    ], 'pass', 'valid blocked q19 source extraction fixture');

    run([
      'build-scripts/references/operation-candidate-add.js',
      '--dry-run',
      '--spec',
      JSON.stringify(operationDoc.candidates[0]),
    ], 'pass', 'operation dry-run CLI');
    run([
      'build-scripts/references/answer-skill-candidate-add.js',
      '--dry-run',
      '--spec-file',
      writeJson(tempDir, 'answer-single.json', answerDoc.candidates[0]),
    ], 'pass', 'answer-skill dry-run CLI');
    run([
      'build-scripts/references/source-annex-extraction-add.js',
      '--dry-run',
      '--kind',
      'graph',
      '--spec-file',
      writeJson(tempDir, 'graph-single.json', sourceDoc.graph_overlays[0]),
    ], 'pass', 'source extraction graph dry-run CLI');

    run([
      'build-scripts/references/operation-candidate-add.js',
      '--spec-file',
      writeJson(tempDir, 'operation-single.json', operationDoc.candidates[0]),
    ], 'fail', 'operation CLI requires dry-run');
    run([
      'build-scripts/references/operation-candidate-add.js',
      '--dry-run',
      '--write',
      '--spec-file',
      writeJson(tempDir, 'operation-single-write.json', operationDoc.candidates[0]),
    ], 'fail', 'operation CLI rejects write flag');

    const invalidA15Doc = clone(operationDoc);
    invalidA15Doc.candidates[0].supporting_unit_ids.push('A15');
    invalidA15Doc.candidates[0].unit_support_assessments = [
      {
        unit_id: 'A15',
        assessment: 'supporting',
        rationale: 'invalid: A15 cannot support q3 threshold comparison',
      },
    ];
    run([
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      '--operation-input',
      writeJson(tempDir, 'operation-invalid-a15.json', invalidA15Doc),
    ], 'fail', 'reject q3 A15 support');

    const invalidA45Doc = clone(operationDoc);
    invalidA45Doc.candidates[1].supporting_unit_ids.push('A45');
    invalidA45Doc.candidates[1].unit_support_assessments.push({
      unit_id: 'A45',
      assessment: 'supporting',
      rationale: 'invalid: A45 cannot be primary q19 graph support',
    });
    run([
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      '--operation-input',
      writeJson(tempDir, 'operation-invalid-a45.json', invalidA45Doc),
    ], 'fail', 'reject q19 A45 primary support');

    const invalidAmbiguousDoc = clone(operationDoc);
    invalidAmbiguousDoc.candidates[1].unit_support_assessments =
      invalidAmbiguousDoc.candidates[1].unit_support_assessments.filter((item) => item.unit_id !== 'A45');
    run([
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      '--operation-input',
      writeJson(tempDir, 'operation-invalid-ambiguous.json', invalidAmbiguousDoc),
    ], 'fail', 'reject weak/rejected ambiguity');

    const invalidMutationDoc = clone(operationDoc);
    invalidMutationDoc.candidates[0].mutation_authorized = true;
    run([
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      '--operation-input',
      writeJson(tempDir, 'operation-invalid-mutation.json', invalidMutationDoc),
    ], 'fail', 'reject mutation flag');

    const hiddenAnswerDoc = clone(answerDoc);
    hiddenAnswerDoc.candidates = hiddenAnswerDoc.candidates.filter(
      (candidate) => !candidate.source_requirement_ids.includes('q3-answer-1')
    );
    run([
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      '--operation-input',
      opPath,
      '--answer-input',
      writeJson(tempDir, 'answer-invalid-hidden-q3.json', hiddenAnswerDoc),
    ], 'fail', 'reject hidden q3 answer-skill need');

    const invalidQ15AnswerDoc = clone(answerDoc);
    invalidQ15AnswerDoc.candidates[1].content_support_unit_ids = ['F03', 'F09'];
    run([
      'build-scripts/references/check-operation-answer-skill-candidates.js',
      '--answer-input',
      writeJson(tempDir, 'answer-invalid-q15-content.json', invalidQ15AnswerDoc),
    ], 'fail', 'reject hidden q15 content support');

    const invalidSourceDoc = clone(sourceDoc);
    invalidSourceDoc.graph_overlays[0].extraction_status = 'reconstructable_pending_review';
    invalidSourceDoc.graph_overlays[0].blocking_gap_ids = [];
    invalidSourceDoc.graph_overlays[0].axis_units = [];
    invalidSourceDoc.source_annex_overlays[0].extraction_status = 'reconstructable_pending_review';
    invalidSourceDoc.source_annex_overlays[0].blocking_gap_ids = [];
    invalidSourceDoc.source_annex_overlays[0].worksheet_regions = [];
    run([
      'build-scripts/references/check-source-annex-extraction-overlays.js',
      '--input',
      writeJson(tempDir, 'source-invalid-reconstructable-empty.json', invalidSourceDoc),
    ], 'fail', 'reject empty q19 reconstructability fields');

    assertFutureStorageAbsent();
    for (const rel of FUTURE_STORAGE) {
      if (fs.existsSync(file(rel))) fail(`forbidden storage file exists after EX-7 check: ${rel}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  console.log('OK EX-7 dry-run CLI implementation');
}

if (require.main === module) main();
