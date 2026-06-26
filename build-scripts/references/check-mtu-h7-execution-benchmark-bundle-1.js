#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-BLIND-HOLDOUT-EXECUTION-AND-CLOSURE-READINESS-BUNDLE-1';
const BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json';
const FIXTURE_JSON = 'reports/mtu-hardening/mtu-h7-execution-fixture-1.json';
const REPORT_JSON = 'reports/mtu-hardening/mtu-h7-execution-report-1.json';
const GATE_JSON = 'reports/review-gates/GATE-MTU-H7-blind-holdout-execution-and-closure-readiness-bundle-1/review-packet.json';
const GATE_LEAD_REVIEW_MD = 'reports/review-gates/GATE-MTU-H7-blind-holdout-execution-and-closure-readiness-bundle-1/lead-review.md';
const UNITS_JSON = 'references/machine/micro-teaching-units.json';

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), 'utf8');
}

function sha256File(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function evidenceExists(ref) {
  if (typeof ref !== 'string' || ref.length === 0) return false;
  if (/^https?:\/\//.test(ref)) return true;
  return fs.existsSync(repoPath(ref.split('#')[0]));
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function validateOperation(record, operation, unitsById) {
  const failures = [];
  const reviewRequired = [];
  const mappedIds = new Set([...asArray(record.mapped_mtu_ids), ...asArray(operation.mapped_mtu_ids)]);
  const mappedRoutes = new Set([...asArray(record.mapped_route_tags), ...asArray(operation.mapped_route_tags)]);

  for (const id of asArray(operation.expected_required_mtu_ids)) {
    if (!unitsById.has(id)) failures.push({ defect_class: 'missing_required_mtu', unit_id: id });
    if (!mappedIds.has(id)) failures.push({ defect_class: 'missing_required_mtu', unit_id: id });
  }
  for (const id of asArray(operation.expected_forbidden_mtu_ids)) {
    if (mappedIds.has(id)) failures.push({ defect_class: 'over_trigger', unit_id: id });
  }
  for (const tag of asArray(operation.expected_route_tags)) {
    if (!mappedRoutes.has(tag)) failures.push({ defect_class: 'evidence_gap', route_tag: tag });
  }
  for (const tag of asArray(operation.expected_forbidden_route_tags)) {
    if (mappedRoutes.has(tag)) failures.push({ defect_class: 'over_trigger', route_tag: tag });
  }
  for (const id of asArray(operation.expected_answer_form_mtu_ids)) {
    if (!unitsById.has(id)) failures.push({ defect_class: 'answer_form_gap', unit_id: id });
    if (!mappedIds.has(id)) failures.push({ defect_class: 'answer_form_gap', unit_id: id });
  }
  for (const id of asArray(operation.expected_scaling_mtu_ids)) {
    if (!mappedIds.has(id)) failures.push({ defect_class: 'scale_factor_handling_missing', unit_id: id });
  }
  for (const id of asArray(operation.expected_incidence_mtu_ids)) {
    if (!mappedIds.has(id)) failures.push({ defect_class: 'incidence_family_too_narrow', unit_id: id });
  }
  for (const id of asArray(operation.expected_procedure_unit_ids)) {
    const unit = unitsById.get(id);
    const mastery = String(unit?.mastery_target || '').toLowerCase();
    if (['apply', 'analyze', 'analyse', 'evaluate'].includes(mastery) && (!Array.isArray(unit.procedure) || unit.procedure.length === 0)) {
      failures.push({ defect_class: 'procedure_fit_gap', unit_id: id });
    }
  }
  if (operation.missing_mtu_expected) reviewRequired.push(operation.expected_defect_class || 'operation_registry_need');
  for (const hook of asArray(operation.review_required_hooks)) {
    reviewRequired.push(operation.expected_defect_class || hook.split(':')[0]);
  }
  return {
    status: failures.length > 0 ? 'failed' : reviewRequired.length > 0 ? 'review_required' : 'passed',
    failures,
    reviewRequired
  };
}

function applyMutation(records, fixture) {
  const copy = JSON.parse(JSON.stringify(records));
  const record = copy.find((item) => item.record_id === fixture.based_on_record_id);
  if (!record) throw new Error(`negative fixture target missing: ${fixture.fixture_id}`);
  const operation = record.official_correction_model_operations.find((item) => item.operation_id === fixture.operation_id);
  if (!operation) throw new Error(`negative fixture operation missing: ${fixture.fixture_id}`);
  const mutation = fixture.mutation || {};
  if (mutation.remove_mapped_mtu_ids) {
    record.mapped_mtu_ids = asArray(record.mapped_mtu_ids).filter((id) => !mutation.remove_mapped_mtu_ids.includes(id));
    operation.mapped_mtu_ids = asArray(operation.mapped_mtu_ids).filter((id) => !mutation.remove_mapped_mtu_ids.includes(id));
  }
  if (mutation.add_mapped_mtu_ids) {
    record.mapped_mtu_ids = uniq([...asArray(record.mapped_mtu_ids), ...mutation.add_mapped_mtu_ids]);
    operation.mapped_mtu_ids = uniq([...asArray(operation.mapped_mtu_ids), ...mutation.add_mapped_mtu_ids]);
  }
  if (mutation.add_mapped_route_tags) {
    record.mapped_route_tags = uniq([...asArray(record.mapped_route_tags), ...mutation.add_mapped_route_tags]);
    operation.mapped_route_tags = uniq([...asArray(operation.mapped_route_tags), ...mutation.add_mapped_route_tags]);
  }
  return copy;
}

function validate() {
  const failures = [];
  const bundle = readJson(BUNDLE_JSON);
  const fixture = readJson(FIXTURE_JSON);
  const report = readJson(REPORT_JSON);
  const gate = readJson(GATE_JSON);
  const units = readJson(UNITS_JSON);
  const unitsById = new Map(units.map((unit) => [unit.id, unit]));

  if (bundle.sprint_id !== SPRINT_ID) failures.push('bundle sprint_id mismatch');
  if (fixture.sprint_id !== SPRINT_ID) failures.push('fixture sprint_id mismatch');
  if (report.sprint_id !== SPRINT_ID) failures.push('report sprint_id mismatch');
  if (gate.sprint_id !== SPRINT_ID) failures.push('gate sprint_id mismatch');
  if (!allFalse(bundle.authority_flags)) failures.push('bundle authority flags must all be false');
  if (!allFalse(fixture.authority_boundary)) failures.push('fixture authority flags must all be false');
  if (!allFalse(report.authority_flags)) failures.push('report authority flags must all be false');
  if (!allFalse(gate.authority_flags)) failures.push('gate authority flags must all be false');
  if (gate.lead_review_proof !== GATE_LEAD_REVIEW_MD) failures.push('gate lead_review_proof mismatch');
  if (!fs.existsSync(repoPath(GATE_LEAD_REVIEW_MD))) failures.push('lead review proof file missing');
  if (fs.existsSync(repoPath(GATE_LEAD_REVIEW_MD))) {
    const leadReviewText = readText(GATE_LEAD_REVIEW_MD);
    for (const requiredText of [
      'Result: `PASS WITH FLAGS`',
      'not H7 closure and not product authority',
      'Teacher reviewer: more than satisfied',
      'Economist reviewer: more than satisfied',
      'Quality inspection reviewer: more than satisfied',
      'No protected reference mutation'
    ]) {
      if (!leadReviewText.includes(requiredText)) failures.push(`lead review proof missing text: ${requiredText}`);
    }
  }
  if (report.lead_reviewer_verdict !== 'HOLD_FOR_OPERATION_REGISTRY_GOVERNANCE') {
    failures.push('lead reviewer verdict must hold for operation-registry governance');
  }
  if (report.method_freeze?.holdout_run_count !== 1) failures.push('holdout run count must be exactly 1');
  if (report.method_freeze?.holdout_tuning_after_outcome !== false) failures.push('holdout tuning must be false');
  if (asArray(report.method_freeze?.generic_repairs_applied_before_holdout).length !== 0) {
    failures.push('this packet must not claim generic repairs before holdout');
  }

  const records = asArray(fixture.records);
  const diagnostic = records.filter((record) => record.split === 'diagnostic');
  const holdout = records.filter((record) => record.split === 'locked_holdout');
  if (records.length !== 24) failures.push('fixture must contain 24 records');
  if (diagnostic.length !== 16) failures.push('fixture must contain 16 diagnostic records');
  if (holdout.length !== 8) failures.push('fixture must contain 8 locked-holdout records');

  const seen = new Set();
  let operationCount = 0;
  let failedOperations = 0;
  let reviewRequiredOperations = 0;
  for (const record of records) {
    if (seen.has(record.record_id)) failures.push(`duplicate record: ${record.record_id}`);
    seen.add(record.record_id);
    if (!asArray(record.source_evidence_paths).every(evidenceExists)) failures.push(`unresolved evidence path for ${record.record_id}`);
    if (asArray(record.official_correction_model_operations).length < 1) failures.push(`missing operations for ${record.record_id}`);
    for (const operation of asArray(record.official_correction_model_operations)) {
      operationCount += 1;
      if (!asArray(operation.official_evidence_refs).every(evidenceExists)) failures.push(`unresolved operation evidence for ${operation.operation_id}`);
      if (asArray(operation.expected_misconception_refs).length < 1) failures.push(`missing misconception hook for ${operation.operation_id}`);
      for (const ref of asArray(operation.expected_misconception_refs)) {
        const anchorId = ref.split('#')[1];
        if (!anchorId || !bundle[anchorId]) {
          failures.push(`missing misconception appendix body for ${operation.operation_id}: ${ref}`);
        }
      }
      const result = validateOperation(record, operation, unitsById);
      if (result.status === 'failed') failedOperations += 1;
      if (result.status === 'review_required') reviewRequiredOperations += 1;
    }
  }
  if (operationCount < 40) failures.push('benchmark should contain at least 40 atomic operations');
  if (asArray(bundle.misconception_hook_appendix).length < 40) failures.push('bundle must include misconception-hook appendix bodies');
  if (asArray(report.misconception_hook_appendix).length !== asArray(bundle.misconception_hook_appendix).length) {
    failures.push('report/bundle misconception appendix count mismatch');
  }
  if (asArray(report.answer_summary_appendix).length !== operationCount) {
    failures.push('answer summary appendix must contain one row per operation');
  }
  if (failedOperations !== 0) failures.push(`expected zero failed operations in sealed mapper output, got ${failedOperations}`);
  if (reviewRequiredOperations < 1) failures.push('benchmark should preserve review_required operations');

  const negatives = asArray(fixture.negative_fixtures);
  if (negatives.length < records.length) failures.push('negative fixture count must be at least one per record');
  if (negatives.length < 30) failures.push('negative fixture count must include high-risk extras beyond one per record');
  for (const record of records) {
    if (!negatives.some((negative) => negative.based_on_record_id === record.record_id)) {
      failures.push(`missing negative fixture for ${record.record_id}`);
    }
  }
  for (const negative of negatives) {
    const mutated = applyMutation(records, negative);
    const negativeFailures = [];
    for (const record of mutated) {
      for (const operation of asArray(record.official_correction_model_operations)) {
        const result = validateOperation(record, operation, unitsById);
        negativeFailures.push(...result.failures.map((failure) => failure.defect_class));
      }
    }
    if (!negativeFailures.includes(negative.expected_failure_defect_class)) {
      failures.push(`negative fixture did not fail with intended class: ${negative.fixture_id}`);
    }
  }

  const reportedNegatives = report.negative_fixture_detection || {};
  if (reportedNegatives.total !== negatives.length) failures.push('negative fixture total mismatch');
  if (reportedNegatives.detected_with_intended_defect_class !== negatives.length) {
    failures.push('not all negative fixtures were detected with intended defect class');
  }
  if (reportedNegatives.rate !== 1) failures.push('negative detection rate must be 1');

  const inputHashes = asArray(report.method_freeze?.method_inputs);
  for (const entry of inputHashes) {
    if (!entry.path || !entry.sha256 || sha256File(entry.path) !== entry.sha256) {
      failures.push(`method input hash mismatch: ${entry.path}`);
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    summary: {
      records: records.length,
      diagnostic_records: diagnostic.length,
      holdout_records: holdout.length,
      operations: operationCount,
      review_required_operations: reviewRequiredOperations,
      negative_fixtures: negatives.length
    }
  };
}

const result = validate();
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (result.ok) {
  console.log(
    `OK ${SPRINT_ID}: benchmark bundle checked (${result.summary.records} records, ${result.summary.operations} operations, ${result.summary.negative_fixtures} negatives)`
  );
} else {
  console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
  for (const failure of result.failures) console.error(`- ${failure}`);
}
process.exit(result.ok ? 0 : 1);
