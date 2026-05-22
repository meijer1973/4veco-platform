#!/usr/bin/env node
/**
 * check-exam-ingestion-coverage.js
 *
 * Validates the EX-3 exam-ingestion coverage report. This checker is
 * intentionally stricter than the generic JSON report validator because the
 * report carries reviewed GATE-EX2 routing decisions that must not be hidden.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const JSON_FILE = path.join(REPO_ROOT, 'reports/json/exam-ingestion-coverage.json');
const MD_FILE = path.join(REPO_ROOT, 'reports/markdown/exam-ingestion-coverage.md');
const EX2_FILE = path.join(REPO_ROOT, 'reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json');

function fail(errors) {
  for (const error of errors) console.error(`ERROR  ${error}`);
  console.error(`${errors.length} exam-ingestion coverage validation error(s).`);
  process.exit(1);
}

function byId(items, id, field = 'requirement_id') {
  return (items || []).find((item) => item[field] === id);
}

function includesAll(actual, expected) {
  return expected.every((item) => (actual || []).includes(item));
}

function main() {
  const errors = [];
  if (!fs.existsSync(JSON_FILE)) errors.push('missing reports/json/exam-ingestion-coverage.json');
  if (!fs.existsSync(MD_FILE)) errors.push('missing reports/markdown/exam-ingestion-coverage.md');
  if (!fs.existsSync(EX2_FILE)) errors.push('missing GATE-EX2 closure JSON');
  if (errors.length) fail(errors);

  const report = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
  const markdown = fs.readFileSync(MD_FILE, 'utf8');
  const ex2 = JSON.parse(fs.readFileSync(EX2_FILE, 'utf8'));

  if (report.report_id !== 'exam-ingestion-coverage') errors.push('invalid report_id');
  if (report.status !== 'warn') errors.push('exam-ingestion-coverage should remain warn while q19 is blocked');
  for (const source of [
    'references/data/exam-ingestion/exam-item-overlays.json',
    'references/data/exam-ingestion/exam-answer-model-overlays.json',
    'references/data/exam-ingestion/exam-source-annex-overlays.json',
    'reports/review-gates/GATE-EX2-exam-to-mtu-mapping/gate-closure.json',
  ]) {
    if (!(report.source_files || []).includes(source)) errors.push(`missing source file ${source}`);
  }

  const summary = report.summary || {};
  if (summary.gate_status !== 'pass_with_conditions') errors.push('gate_status must be pass_with_conditions');
  if (summary.allowed_next_sprint !== 'EX-3') errors.push('allowed_next_sprint must remain EX-3');
  if (summary.pilot_item_count !== 3) errors.push('pilot_item_count must be 3');
  if (summary.reviewed_classification_count !== 8) errors.push('reviewed_classification_count must be 8');
  if (summary.blocking_gap_count !== 2) errors.push('blocking_gap_count must be 2');
  if (summary.blocked_item_count !== 1) errors.push('blocked_item_count must be 1');
  if (summary.lesson_handoff_ready_with_gaps !== 2) errors.push('lesson_handoff_ready_with_gaps must be 2');
  if (summary.lesson_handoff_blocked !== 1) errors.push('lesson_handoff_blocked must be 1');
  if (!summary.classification_counts || summary.classification_counts.answer_skill_need !== 2) errors.push('answer_skill_need count must be 2');
  if (!summary.classification_counts || summary.classification_counts.operation_registry_need !== 2) errors.push('operation_registry_need count must be 2');
  if (summary.all_product_boundaries_false !== true) errors.push('all product boundaries must be false');

  for (const flag of [
    'protected_reference_mutation_authorized',
    'external_source_mutation_authorized',
    'unit_minting_authorized',
    'operation_registry_mutation_authorized',
    'answer_skill_mutation_authorized',
    'target_exercise_promotion_authorized',
    'lesson_output_mutation_authorized',
    'cp6_closure_authorized',
    'year1_closure_authorized',
    'student_facing_output_authorized',
  ]) {
    if (summary[flag] !== false) errors.push(`${flag} must be false`);
    if (!report.authority_boundary || report.authority_boundary[flag] !== false) errors.push(`authority_boundary.${flag} must be false`);
  }

  const records = report.coverage_records || [];
  if (records.length !== 3) errors.push('coverage_records must contain exactly 3 pilot items');
  const q3 = byId(records, 'vw-1022-a-25-1-o:opgave-1:question-3', 'exam_item_id');
  const q19 = byId(records, 'vw-1022-a-25-1-o:opgave-4:question-19', 'exam_item_id');
  const q15 = byId(records, 'vw-1022-a-25-1-o:opgave-3:question-15', 'exam_item_id');
  if (!q3 || !q19 || !q15) errors.push('coverage_records missing q3, q19, or q15');
  if (q3 && q3.lesson_handoff_status !== 'ready_with_gaps') errors.push('q3 must remain ready_with_gaps only');
  if (q15 && q15.lesson_handoff_status !== 'ready_with_gaps') errors.push('q15 must remain ready_with_gaps only');
  if (q19 && q19.lesson_handoff_status !== 'blocked') errors.push('q19 must remain blocked');
  if (q19 && !includesAll(q19.blocking_gap_ids, ['q19-source-annex-gap', 'q19-graph-object-gap'])) errors.push('q19 must carry both blocking gaps');

  const classifications = report.reviewed_classifications || [];
  const q3Calc = byId(classifications, 'q3-calc-1');
  const q3Answer = byId(classifications, 'q3-answer-1');
  const q19Source = byId(classifications, 'q19-source-annex-gap');
  const q19GraphGap = byId(classifications, 'q19-graph-object-gap');
  const q19Graph = byId(classifications, 'q19-graph-op-1');
  const q19Reason = byId(classifications, 'q19-reason-1');
  const q15Content = byId(classifications, 'q15-content');
  const q15Answer = byId(classifications, 'q15-answer-1');
  if (!q3Calc || q3Calc.classification !== 'operation_registry_need') errors.push('q3-calc-1 must be operation_registry_need');
  if (q3Calc && !includesAll(q3Calc.supporting_unit_ids, ['A61'])) errors.push('q3-calc-1 must carry A61 support');
  if (q3Calc && !includesAll(q3Calc.stale_or_weak_unit_ids, ['A15'])) errors.push('q3-calc-1 must keep A15 stale/weak');
  if (!q3Answer || q3Answer.classification !== 'answer_skill_need') errors.push('q3-answer-1 must be answer_skill_need');
  if (!q19Source || q19Source.classification !== 'source_annex_gap' || q19Source.blocking !== true) errors.push('q19-source-annex-gap must be blocking source_annex_gap');
  if (!q19GraphGap || q19GraphGap.classification !== 'graph_object_gap' || q19GraphGap.blocking !== true) errors.push('q19-graph-object-gap must be blocking graph_object_gap');
  if (!q19Graph || q19Graph.classification !== 'existing_mtu_but_procedure_too_weak_plus_pv_graph_need') errors.push('q19-graph-op-1 must keep mixed weak/PV classification');
  if (q19Graph && !includesAll(q19Graph.candidate_unit_ids, ['A42', 'D10'])) errors.push('q19-graph-op-1 must include A42 and D10');
  if (q19Graph && !includesAll(q19Graph.weak_or_prerequisite_unit_ids, ['A45'])) errors.push('q19-graph-op-1 must downgrade A45 to weak/prerequisite support');
  if (!q19Reason || q19Reason.classification !== 'operation_registry_need') errors.push('q19-reason-1 must be operation_registry_need');
  if (q19Reason && !includesAll(q19Reason.partial_support_unit_ids, ['D10', 'D13'])) errors.push('q19-reason-1 must carry D10/D13 partial support');
  if (!q15Content || q15Content.classification !== 'existing_mtu') errors.push('q15-content must be existing_mtu');
  if (q15Content && !includesAll(q15Content.accepted_unit_ids, ['D27', 'F03', 'F09'])) errors.push('q15-content must carry D27/F03/F09');
  if (q15Content && q15Content.coverage_scope !== 'content_only') errors.push('q15-content must be content_only');
  if (!q15Answer || q15Answer.classification !== 'answer_skill_need') errors.push('q15-answer-1 must be answer_skill_need');

  if (!Array.isArray(report.conditions_carried_forward) || report.conditions_carried_forward.length < 5) {
    errors.push('conditions_carried_forward must carry GATE-EX2 conditions');
  }
  if (!Array.isArray(report.proof_required_before_next_use) || report.proof_required_before_next_use.length < 4) {
    errors.push('proof_required_before_next_use must list downstream proof requirements');
  }
  if (!Array.isArray(report.issues) || report.issues.length < 7) errors.push('report must expose at least 7 visible issues');

  for (const text of [
    'A61',
    'A42',
    'q19-source-annex-gap',
    'answer_skill_need',
    'No protected reference mutation',
  ]) {
    if (!markdown.includes(text)) errors.push(`markdown missing ${text}`);
  }

  if ((ex2.reviewed_classifications || []).length !== 8) errors.push('GATE-EX2 closure should still carry 8 reviewed classifications');

  if (errors.length) fail(errors);
  console.log('OK exam-ingestion coverage report');
}

if (require.main === module) main();
