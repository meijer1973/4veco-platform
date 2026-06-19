#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  validateSourceExtractionDocument,
} = require('./lib/exam-ingestion-candidate-validation');

const ROOT = path.resolve(__dirname, '..', '..');
const REVIEW_PACKET = 'reports/review-gates/EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1/review-packet.json';
const SOURCE_STORAGE = 'references/data/exam-ingestion/source-annex-extraction-overlays.json';
const OPERATION_STORAGE = 'references/data/exam-ingestion/operation-candidates.json';
const ANSWER_STORAGE = 'references/data/exam-ingestion/answer-skill-candidates.json';
const CONTRACT = 'references/data/exam-ingestion/operation-answer-skill-contract.json';
const Q15_GAPS = 'reports/json/exam-question-extraction-gaps.json';
const Q19_HOLD = 'reports/mtu-hardening/mtu-h5-q19-source-graph-reasoning-package-1.json';

const FALSE_AUTHORITY_KEYS = [
  'official_exam_operation_closure_authorized',
  'broad_operation_row_closure_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'source_annex_extraction_execution_authorized',
  'target_registry_mutation_in_scope',
  'machine_sources_mutated',
  'external_sources_mutated',
  'authored_sources_mutated',
  'generated_lesson_output_authorized',
  'product_authority',
  'product_route_adoption_authorized',
  'cp6_closure_authorized',
  'scale_gate_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'pv_authorized',
  'summative_use_authorized',
  'student_use_authorized',
  'student_product_use_authorized',
];

function fail(message) {
  console.error(`EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1 check failed: ${message}`);
  process.exit(1);
}

function file(relPath) {
  return path.join(ROOT, relPath);
}

function readJson(relPath) {
  try {
    return JSON.parse(fs.readFileSync(file(relPath), 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function readText(relPath) {
  try {
    return fs.readFileSync(file(relPath), 'utf8');
  } catch (error) {
    fail(`cannot read ${relPath}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function assertArray(value, label) {
  assert(Array.isArray(value), `${label} must be an array`);
}

function assertIncludes(list, value, label) {
  assertArray(list, label);
  assert(list.includes(value), `${label} missing ${value}`);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) {
    fail(`${[command, ...args].join(' ')} failed\n${result.stdout || ''}${result.stderr || ''}`);
  }
}

function factByRequirement(contract, requirementId) {
  const fact = (contract.candidate_routing_facts || []).find((item) => item.requirement_id === requirementId);
  assert(fact, `missing routing fact ${requirementId}`);
  return fact;
}

function assertAuthorityFalse(packet) {
  const claims = packet.authority_claims || {};
  for (const key of FALSE_AUTHORITY_KEYS) {
    assert(claims[key] === false, `authority_claims.${key} must be false`);
  }
}

function assertAtomic(packet) {
  const atoms = packet.atomic_operation_candidates || [];
  const byId = new Map(atoms.map((item) => [item.atomic_id, item]));
  for (const id of [
    'Q3-ATOM-ANNUAL-PREMIUM-DEDUCTIBLE-COST-COMPARISON',
    'Q3-ATOM-BREAK_EVEN-THRESHOLD-CALCULATION',
    'Q3-ANS-THRESHOLD-CONCLUSION-UNIT-DIRECTION',
    'Q15-ATOM-DOMINANT-STRATEGY-REASONING',
    'Q15-ATOM-MUTUALLY-WORSE-PRISONERS-DILEMMA-CONCLUSION',
    'Q15-ANS-TWO-LINK-CORRECTION-MODEL-EXPLANATION',
    'Q19-HOLD-SOURCE-GRAPH-RECONSTRUCTION',
  ]) {
    assert(byId.has(id), `missing atomic candidate ${id}`);
  }

  assert(byId.get('Q3-ATOM-BREAK_EVEN-THRESHOLD-CALCULATION').rejected_unit_ids.includes('A15'), 'Q3 threshold atom must reject A15');
  assert(byId.get('Q3-ATOM-BREAK_EVEN-THRESHOLD-CALCULATION').supporting_unit_ids.includes('A61'), 'Q3 threshold atom must keep A61 support');
  assert(byId.get('Q15-ANS-TWO-LINK-CORRECTION-MODEL-EXPLANATION').supporting_unit_ids.includes('D27'), 'Q15 answer atom must keep D27 support');
  assert(byId.get('Q15-ANS-TWO-LINK-CORRECTION-MODEL-EXPLANATION').supporting_unit_ids.includes('F03'), 'Q15 answer atom must keep F03 support');
  assert(byId.get('Q15-ANS-TWO-LINK-CORRECTION-MODEL-EXPLANATION').supporting_unit_ids.includes('F09'), 'Q15 answer atom must keep F09 support');
  assert(byId.get('Q19-HOLD-SOURCE-GRAPH-RECONSTRUCTION').disposition === 'hold', 'Q19 reconstruction must remain hold');
}

function assertQ15MetadataRecommendation(packet) {
  const q15 = (packet.metadata_dispositions || []).find((item) => item.exam_item_id === 'vw-1022-a-25-1-o:q15');
  assert(q15, 'missing q15 metadata disposition');
  for (const id of ['D27', 'F03', 'F09']) assertIncludes(q15.recommended_required_skills, id, 'q15.recommended_required_skills');

  const gaps = readJson(Q15_GAPS);
  const live = (gaps.patch_queue || []).find((item) => item.id === 'vw-1022-a-25-1-o:q15');
  assert(live, 'q15 must remain visible in extraction-gap queue');
  assertIncludes(live.gap_types, 'missing_required_skills', 'q15 live gap types');
}

function assertSourceStorage() {
  assert(!fs.existsSync(file(OPERATION_STORAGE)), 'operation-candidates storage must remain absent');
  assert(!fs.existsSync(file(ANSWER_STORAGE)), 'answer-skill-candidates storage must remain absent');
  assert(fs.existsSync(file(SOURCE_STORAGE)), 'q19 source-annex extraction storage must exist as blocked evidence');
  const sourceDoc = readJson(SOURCE_STORAGE);
  validateSourceExtractionDocument(sourceDoc, SOURCE_STORAGE);
  assert(sourceDoc.storage_status === 'future_candidate_storage', 'source storage must remain future_candidate_storage');
  for (const record of [...sourceDoc.graph_overlays, ...sourceDoc.source_annex_overlays]) {
    assert(record.review_state === 'blocked', `${record.extraction_id} must remain blocked`);
    assert(record.extraction_status === 'partial_with_blocking_gap', `${record.extraction_id} must remain partial_with_blocking_gap`);
    assertIncludes(record.blocking_gap_ids, 'q19-source-annex-gap', `${record.extraction_id}.blocking_gap_ids`);
    assertIncludes(record.blocking_gap_ids, 'q19-graph-object-gap', `${record.extraction_id}.blocking_gap_ids`);
  }
}

function assertContractFacts() {
  const contract = readJson(CONTRACT);
  const q3Calc = factByRequirement(contract, 'q3-calc-1');
  assert(q3Calc.candidate_record_id === 'EX_OP_ANNUAL_COST_THRESHOLD_COMPARISON', 'q3 operation candidate id mismatch');
  assertIncludes(q3Calc.supporting_unit_ids, 'A61', 'q3-calc supporting units');
  assertIncludes(q3Calc.rejected_or_weak_unit_ids, 'A15', 'q3-calc weak/rejected units');

  const q3Answer = factByRequirement(contract, 'q3-answer-1');
  assert(q3Answer.candidate_record_id === 'EX_ANS_THRESHOLD_CONCLUSION_UNIT_DIRECTION', 'q3 answer candidate id mismatch');

  const q15Answer = factByRequirement(contract, 'q15-answer-1');
  assert(q15Answer.candidate_record_id === 'EX_ANS_TWO_STEP_CORRECTION_MODEL_EXPLANATION', 'q15 answer candidate id mismatch');

  const q19Source = factByRequirement(contract, 'q19-source-annex-gap');
  assertIncludes(q19Source.blocking_gap_ids, 'q19-source-annex-gap', 'q19 source blocking gaps');
  const q19Graph = factByRequirement(contract, 'q19-graph-object-gap');
  assertIncludes(q19Graph.blocking_gap_ids, 'q19-graph-object-gap', 'q19 graph blocking gaps');
}

function assertQ19Hold() {
  const hold = readJson(Q19_HOLD);
  assert(hold.current_diagnostic_state?.q19?.failed === 0, 'q19 hold failed count must be 0');
  assert(hold.current_diagnostic_state?.q19?.review_required === 6, 'q19 hold review_required count must be 6');
  assert(hold.source_overlay_state?.storage_expected_to_exist === true, 'q19 hold must expect source overlay storage');
  assert(hold.source_overlay_state?.all_records_must_have?.authority_flags_false === true, 'q19 source overlay authority flags must remain false');
}

function assertNoForbiddenText() {
  for (const relPath of [
    'reports/reference-planning/EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1-review-packet.md',
    'reports/reference-planning/EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1-atomic-status.md',
  ]) {
    const text = readText(relPath);
    assert(!/product-route adoption authorized/i.test(text), `${relPath} must not authorize product-route adoption`);
    assert(!/student\/product use authorized/i.test(text), `${relPath} must not authorize student/product use`);
  }
}

function main() {
  const packet = readJson(REVIEW_PACKET);
  assert(packet.packet_id === 'EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1', 'packet id mismatch');
  assert(packet.review_autonomy?.level === 'L4', 'packet must remain L4');
  assert(packet.human_decision_required === true, 'human decision required must be true');
  assert(packet.auto_merge_allowed_after_ci === false, 'auto merge must remain false');

  assertAuthorityFalse(packet);
  assertAtomic(packet);
  assertQ15MetadataRecommendation(packet);
  assertSourceStorage();
  assertContractFacts();
  assertQ19Hold();
  assertNoForbiddenText();

  run(process.execPath, ['build-scripts/references/check-source-annex-extraction-overlays.js']);
  run(process.execPath, ['build-scripts/references/check-ex5-operation-answer-skill-contract.js']);
  run(process.execPath, ['build-scripts/references/check-mtu-h5-rp001-rp002-q3-repair-packet.js']);
  run(process.execPath, ['build-scripts/references/check-mtu-h5-rp006-q15-planning-packet.js']);

  console.log('OK EXAM-ANCHOR-ATOMIC-CLOSURE-BUNDLE-1: atomic statuses and blocked source/graph storage validated');
}

main();
