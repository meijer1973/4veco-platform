#!/usr/bin/env node
/**
 * HOW TO ADAPT
 * - Add new CP condition files here only when a gate closure requires them.
 * - Keep this read-only. It validates condition artifacts and never mutates
 *   protected reference sources or generated RAG chunks.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const CP3_CLOSURE = 'reports/review-gates/GATE-CP3-schema-extension-dry-run/gate-closure.json';
const OVERLAY_FILES = [
  'references/data/exercises/exam-question-overlays.json',
  'references/data/exercises/target-exercise-overlays.json',
];
const SOURCE_ANNEX_GAPS = 'references/data/exercises/source-annex-gap-log.json';
const SCAFFOLDING_CALIBRATION = 'references/data/exercises/scaffolding-calibration.json';
const GRAPH_SPEC_PLAN = 'references/data/exercises/graph-spec-representation-plan.json';
const PRODUCT_WARNINGS = 'references/data/exercises/product-boundary-warnings.json';

function fail(message) {
  console.error(`Exercise overlay condition check failed: ${message}`);
  process.exit(1);
}

function readJson(relPath) {
  const full = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(full)) fail(`missing ${relPath}`);
  try {
    return JSON.parse(fs.readFileSync(full, 'utf8'));
  } catch (error) {
    fail(`invalid JSON in ${relPath}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function recordsFromOverlays() {
  return OVERLAY_FILES.flatMap((file) => {
    const overlay = readJson(file);
    return (overlay.records || []).map((record) => ({ ...record, overlay_file: file }));
  });
}

function checkScaffoldingCalibration(calibration) {
  assert(calibration.calibration_id === 'SCAFFOLDING-CALIBRATION-V1', 'unexpected scaffolding calibration id');
  assert(Array.isArray(calibration.verbal_level) && calibration.verbal_level.length === 6, 'verbal_level must define values 0-5');
  assert(Array.isArray(calibration.visual_stage) && calibration.visual_stage.length === 4, 'visual_stage must define values 1-4');
  assert(Array.isArray(calibration.fading_position) && calibration.fading_position.length >= 4, 'fading_position must define review ranges');
  for (let value = 0; value <= 5; value += 1) {
    assert(calibration.verbal_level.some((entry) => entry.value === value), `verbal_level missing ${value}`);
  }
  for (let value = 1; value <= 4; value += 1) {
    assert(calibration.visual_stage.some((entry) => entry.value === value), `visual_stage missing ${value}`);
  }
  assert(/diagnostics|adaptive/i.test(calibration.reviewer_warning || ''), 'scaffolding reviewer_warning must mention product-boundary risk');
}

function checkGraphPlan(plan) {
  assert(plan.plan_id === 'GRAPH-SPEC-REPRESENTATION-PLAN-V1', 'unexpected graph-spec plan id');
  const current = new Set(plan.current_values || []);
  for (const value of ['none', 'table', 'bar_chart', 'line_chart', 'pie_chart', 'p_q_graph', 'producer_graph', 'source_text']) {
    assert(current.has(value), `graph plan current_values missing ${value}`);
  }
  assert(plan.future_refinement_needed === true, 'graph plan must record future_refinement_needed true');
  assert(Array.isArray(plan.candidate_future_values) && plan.candidate_future_values.length >= 3, 'graph plan needs candidate future values');
  assert(/operation registry/i.test(plan.blocked_use || ''), 'graph plan blocked_use must warn it is not an operation registry');
}

function main() {
  const cp3 = readJson(CP3_CLOSURE);
  assert(cp3.status === 'pass_with_conditions', 'CP-3 must be pass_with_conditions');
  assert(cp3.protected_reference_data_changed === false, 'CP-3 protected_reference_data_changed must be false');
  assert(cp3.blocked_outcomes.includes('No source mutation is authorized.'), 'CP-3 closure must block source mutation');

  const sourceAnnex = readJson(SOURCE_ANNEX_GAPS);
  const scaffolding = readJson(SCAFFOLDING_CALIBRATION);
  const graphPlan = readJson(GRAPH_SPEC_PLAN);
  const warnings = readJson(PRODUCT_WARNINGS);
  const overlays = recordsFromOverlays();

  assert(sourceAnnex.bulk_tier_a_backfill_allowed === false, 'source-annex gap log must block bulk Tier A backfill');
  assert(Array.isArray(sourceAnnex.records), 'source-annex gap log records must be an array');
  const gaps = new Map(sourceAnnex.records.map((record) => [record.gap_id, record]));
  assert(gaps.size > 0, 'source-annex gap log must contain at least one record');

  checkScaffoldingCalibration(scaffolding);
  checkGraphPlan(graphPlan);

  assert(warnings.warning_id === 'PRODUCT-BOUNDARY-WARNING-V1', 'unexpected product-boundary warning id');
  assert(Array.isArray(warnings.blocked_product_uses) && warnings.blocked_product_uses.includes('student_diagnostics'), 'product warnings must block student_diagnostics');
  assert(warnings.required_flag_value === false, 'product warnings must require false authorization flags');

  for (const record of overlays) {
    const label = `${record.overlay_file} ${record.overlay_record_id}`;
    assert(record.exercise_operations_status === 'provisional_until_operation_registry', `${label} must mark exercise_operations provisional`);
    assert(record.condition_refs.scaffolding_calibration_id === scaffolding.calibration_id, `${label} must reference scaffolding calibration`);
    assert(record.condition_refs.graph_spec_plan_id === graphPlan.plan_id, `${label} must reference graph plan`);
    assert(record.condition_refs.product_boundary_warning_id === warnings.warning_id, `${label} must reference product warning`);
    assert(record.product_boundary.warning_label === warnings.mandatory_warning_label, `${label} product warning label mismatch`);

    for (const field of warnings.required_product_boundary_flags) {
      assert(record.product_boundary[field] === false, `${label} product_boundary.${field} must remain false`);
    }

    if (record.source_annex_status === 'source_values_not_extracted') {
      const gap = gaps.get(record.condition_refs.source_annex_gap_id);
      assert(gap, `${label} source_values_not_extracted must reference a source-annex gap`);
      assert(gap.overlay_record_id === record.overlay_record_id, `${label} gap overlay_record_id mismatch`);
      assert(gap.status === 'open', `${label} gap should remain open until proof-to-close exists`);
      assert(gap.proof_required_to_close, `${label} gap must include proof_required_to_close`);
    }
  }

  console.log(`OK exercise overlay conditions: ${overlays.length} overlays, ${gaps.size} source-annex gap(s)`);
}

if (require.main === module) main();
