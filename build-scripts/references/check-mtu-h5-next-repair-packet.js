#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const PACKET_JSON = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-next-repair-packet.json');
const PACKET_MD = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-next-repair-packet.md');
const FIXTURE = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-fixture.json');
const REPORT = path.join(ROOT, 'reports', 'mtu-hardening', 'mtu-h5-regression-report.json');
const GATE_CLOSURE = path.join(ROOT, 'reports', 'review-gates', 'GATE-MTU-H5-mapping-regression', 'gate-closure.json');
const VALIDATOR = path.join(ROOT, 'build-scripts', 'references', 'check-mtu-h5-mapping-regression.js');

const AUTHORITY_FALSE_KEYS = [
  'protected_reference_mutation_authorized',
  'external_source_mutation_authorized',
  'machine_reference_mutation_authorized',
  'authored_target_exercise_mutation_authorized',
  'unit_minting_authorized',
  'unit_update_authorized',
  'unit_split_authorized',
  'unit_merge_authorized',
  'unit_deprecation_authorized',
  'operation_registry_mutation_authorized',
  'answer_skill_mutation_authorized',
  'candidate_storage_creation_authorized',
  'candidate_writes_authorized',
  'lesson_output_mutation_authorized',
  'diagnostics_authorized',
  'adaptive_routing_authorized',
  'mastery_authorized',
  'sequencing_authorized',
  'student_facing_ai_authorized',
  'summative_use_authorized',
  'pv_projection_authorized',
  'pv_machine_promotion_authorized',
  'student_product_use_authorized',
  'product_route_readiness_claimed',
];

const REQUIRED_REPAIR_IDS = [
  'MTU-H5-RP-001',
  'MTU-H5-RP-002',
  'MTU-H5-RP-003',
  'MTU-H5-RP-004',
  'MTU-H5-RP-005',
  'MTU-H5-RP-006',
];

const REQUIRED_FAILED_DEFECTS = [
  'missing_mtu_for_correction_model_operation',
  'over_triggered_prerequisite_not_required_by_answer_model',
  'question_word_without_answer_form_mtu',
  'incidence_pass_through_task_without_incidence_mtu',
  'scale_factor_usage_without_scaling_unit_mtu',
];

function fail(message) {
  console.error(`MTU-H5 next repair packet check failed: ${message}`);
  process.exit(1);
}

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, '/');
}

function readText(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${rel(file)}`);
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  try {
    return JSON.parse(readText(file));
  } catch (error) {
    fail(`invalid JSON in ${rel(file)}: ${error.message}`);
  }
}

function requireArray(object, key, context, minItems = 1) {
  if (!Array.isArray(object[key]) || object[key].length < minItems) {
    fail(`${context}.${key} must be an array with at least ${minItems} item(s)`);
  }
  return object[key];
}

function requireIncludes(text, needle, context) {
  if (!text.includes(needle)) fail(`${context} must include ${needle}`);
}

function bucketCounts(result) {
  return {
    passed: result.buckets.passed.length,
    failed: result.buckets.failed.length,
    review_required: result.buckets.review_required.length,
    blocked: result.buckets.blocked.length,
  };
}

function countBy(items, key, fallback = 'none') {
  return items.reduce((counts, item) => {
    const value = item[key] || fallback;
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function main() {
  const packet = readJson(PACKET_JSON);
  const packetMd = readText(PACKET_MD);
  const fixture = readJson(FIXTURE);
  const report = readJson(REPORT);
  const gateClosure = readJson(GATE_CLOSURE);

  if (packet.schema_version !== 1) fail('packet schema_version must be 1');
  if (packet.sprint_id !== 'MTU-H5') fail('packet sprint_id must be MTU-H5');
  if (packet.status !== 'triage_ready_no_mutation_authorized') {
    fail('packet status must be triage_ready_no_mutation_authorized');
  }
  if (fixture.status !== 'approved_for_mtu_h5_regression') fail('approved fixture status mismatch');
  if (gateClosure.verdict !== 'APPROVED_WITH_ADMINISTRATIVE_REMOTE_CLOSURE_REPAIR') {
    fail('gate closure verdict mismatch');
  }
  if (packet.reviewed_remote_commit_hash !== gateClosure.remote_evidence_closure.reviewed_remote_commit_hash) {
    fail('packet reviewed_remote_commit_hash must match gate closure');
  }

  for (const key of AUTHORITY_FALSE_KEYS) {
    if (!packet.authority_boundary || packet.authority_boundary[key] !== false) {
      fail(`authority_boundary.${key} must be false`);
    }
  }

  const run = spawnSync(process.execPath, [
    rel(VALIDATOR),
    '--fixture',
    rel(FIXTURE),
    '--expect-fail',
    '--json',
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (run.status !== 0) {
    process.stderr.write(run.stdout || '');
    process.stderr.write(run.stderr || '');
    fail('validator command failed');
  }
  let result;
  try {
    result = JSON.parse(run.stdout);
  } catch (error) {
    fail(`validator did not emit JSON: ${error.message}`);
  }

  if (result.status !== packet.validator_summary.status) fail('validator status mismatch');
  if (report.status !== result.status) fail('source report status mismatch');

  const counts = bucketCounts(result);
  for (const [bucket, count] of Object.entries(counts)) {
    if (packet.validator_summary.counts[bucket] !== count) {
      fail(`validator_summary count mismatch for ${bucket}`);
    }
  }

  const failedByDefect = countBy(result.buckets.failed, 'defect_class');
  for (const defectClass of REQUIRED_FAILED_DEFECTS) {
    if (packet.validator_summary.failed_by_defect_class[defectClass] !== failedByDefect[defectClass]) {
      fail(`failed_by_defect_class mismatch for ${defectClass}`);
    }
  }
  const reviewRequiredByDefect = countBy(result.buckets.review_required, 'defect_class');
  const fixtureReviewHookCount = result.buckets.review_required.filter((item) => item.hook).length;
  if (
    packet.validator_summary.review_required_by_defect_class
      .apply_analyze_unit_without_usable_canonical_procedure !==
    reviewRequiredByDefect.apply_analyze_unit_without_usable_canonical_procedure
  ) {
    fail('review_required_by_defect_class mismatch for apply/analyze procedure review');
  }
  if (packet.validator_summary.review_required_by_defect_class.fixture_review_hooks !== fixtureReviewHookCount) {
    fail('review_required_by_defect_class mismatch for fixture review hooks');
  }

  const procedureStatuses = countBy(result.procedure_checks, 'status');
  for (const status of ['procedure_present', 'procedure_review_required']) {
    if (packet.validator_summary.procedure_statuses[status] !== procedureStatuses[status]) {
      fail(`procedure status mismatch for ${status}`);
    }
  }

  const repairLanes = requireArray(packet, 'repair_lanes', 'packet', REQUIRED_REPAIR_IDS.length);
  const repairIds = repairLanes.map((lane) => lane.repair_id);
  const coveredAssertionIds = new Set();
  for (const repairId of REQUIRED_REPAIR_IDS) {
    if (!repairIds.includes(repairId)) fail(`missing repair lane ${repairId}`);
    requireIncludes(packetMd, repairId, 'packet markdown');
  }
  for (const lane of repairLanes) {
    requireArray(lane, 'source_buckets', lane.repair_id);
    requireArray(lane, 'record_ids', lane.repair_id);
    requireArray(lane, 'operation_ids', lane.repair_id);
    requireArray(lane, 'defect_classes', lane.repair_id);
    for (const assertionId of requireArray(lane, 'validator_assertion_ids', lane.repair_id)) {
      coveredAssertionIds.add(assertionId);
    }
    requireArray(lane, 'proof_required_to_close', lane.repair_id, 2);
    if (lane.authorization?.mutation_authorized !== false) fail(`${lane.repair_id} must not authorize mutation`);
    if (lane.authorization?.product_use_authorized !== false) fail(`${lane.repair_id} must not authorize product use`);
  }
  for (const bucket of ['failed', 'review_required']) {
    for (const item of result.buckets[bucket]) {
      if (!coveredAssertionIds.has(item.assertion_id)) {
        fail(`${bucket} assertion is not routed to any repair lane: ${item.assertion_id}`);
      }
    }
  }

  if (packet.negative_regression_status?.keep_as_guard !== true) {
    fail('negative regression guard must be kept');
  }
  if (packet.packet_result?.completion_claimed !== false) {
    fail('packet must not claim repair-lane completion');
  }

  for (const required of [
    'No protected reference mutation',
    'Validator Summary',
    'Repair Lanes',
    'Negative Fixture',
    'ready_for_human_repair-lane_review',
  ]) {
    requireIncludes(packetMd, required, 'packet markdown');
  }

  console.log('OK MTU-H5 next repair packet: triage_ready_no_mutation_authorized');
}

main();
