#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H6-CLOSURE-H7-BLIND-HOLDOUT-GENERALIZATION-BUNDLE-1';
const H6_MERGE_SHA = '95601ff21b69754d1f82dcca5647edb46ae5a62f';
const H6_REMOTE_HEAD_SHA = 'f23f2e6e151f6c0577bbc9afae76622eae578a86';
const H5_EXCLUDED_IDS = new Set([
  'vw-1022-a-25-1-o:opgave-1:question-3',
  'vw-1022-a-25-1-o:opgave-3:question-15',
  'vw-1022-a-25-1-o:opgave-4:question-19',
  'vw-1022-a-25-2-o:opgave-6:question-27'
]);
const H6_EXCLUDED_IDS = new Set([
  'vw-1022-a-24-1-o:opgave-1:question-3',
  'vw-1022-a-24-1-o:opgave-1:question-4',
  'vw-1022-a-24-1-o:opgave-1:question-6',
  'ha-1022-a-23-2-o:opgave-2:question-10',
  'ha-1022-a-23-1-o:opgave-5:question-22',
  'vw-1022-a-23-2-o:opgave-5:question-23',
  'vw-1022-a-24-2-o:opgave-4:question-18'
]);

const FILES = {
  closure: 'reports/mtu-hardening/mtu-h6-current-main-closure-readiness-record-1.json',
  h7: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json',
  gate: 'reports/review-gates/GATE-MTU-H6-closure-H7-blind-holdout-benchmark-1/review-packet.json',
  examRegistry: 'references/external/exam-questions.json',
  h6Package:
    'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.json',
  h6Report: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-report.json',
  h6Gate:
    'reports/review-gates/GATE-MTU-H6-cross-exam-generalization-and-evidence-integrity-bundle-1/review-packet.json',
  h5Audit: 'reports/mtu-hardening/mtu-h5-anchor-integrity-audit.json'
};

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJson(relativePath, options = {}) {
  if (
    options.overrides &&
    Object.prototype.hasOwnProperty.call(options.overrides, relativePath)
  ) {
    return cloneJson(options.overrides[relativePath]);
  }
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function questionId(record) {
  return `${record.exam}:opgave-${record.opgave_num}:question-${record.question_num}`;
}

function addFailure(failures, message) {
  failures.push(message);
}

function run(command, args, options = {}) {
  if (typeof options.runCommand === 'function') {
    return options.runCommand(command, args);
  }
  return spawnSync(command, args, { cwd: ROOT, encoding: 'utf8', shell: false });
}

function allAuthorityFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function validate(options = {}) {
  const failures = [];
  const warnings = [];

  const closure = readJson(FILES.closure, options);
  const h7 = readJson(FILES.h7, options);
  const gate = readJson(FILES.gate, options);
  const examRegistry = readJson(FILES.examRegistry, options);
  const h6Package = readJson(FILES.h6Package, options);
  const h6Report = readJson(FILES.h6Report, options);
  const h6Gate = readJson(FILES.h6Gate, options);
  const h5Audit = readJson(FILES.h5Audit, options);
  const byId = new Map(examRegistry.map((record) => [questionId(record), record]));

  if (closure.sprint_id !== SPRINT_ID || h7.sprint_id !== SPRINT_ID || gate.sprint_id !== SPRINT_ID) {
    addFailure(failures, 'sprint_id mismatch across H6 closure/H7 benchmark/gate artifacts');
  }
  if (closure.h6_merge_sha !== H6_MERGE_SHA) {
    addFailure(failures, `H6 merge SHA mismatch: ${closure.h6_merge_sha}`);
  }
  if (closure.h6_reviewed_remote_head_sha !== H6_REMOTE_HEAD_SHA) {
    addFailure(failures, `H6 reviewed remote head mismatch: ${closure.h6_reviewed_remote_head_sha}`);
  }
  if (closure.status !== 'h6_closure_readiness_verified_on_current_main') {
    addFailure(failures, `H6 closure-readiness status mismatch: ${closure.status}`);
  }

  if (options.skipGitAncestorCheck !== true) {
    const ancestor = run('git', ['merge-base', '--is-ancestor', H6_MERGE_SHA, 'HEAD'], options);
    if (ancestor.status !== 0) {
      addFailure(failures, `H6 merge ${H6_MERGE_SHA} is not an ancestor of current HEAD`);
    }
  }

  if (h6Report.status !== 'passed') {
    addFailure(failures, `H6 report status is not passed: ${h6Report.status}`);
  }
  if (!String(h6Package.status || '').includes('ready_for_human_review')) {
    addFailure(failures, `H6 package status does not retain review-ready state: ${h6Package.status}`);
  }
  if (h6Gate.status !== 'pending_human_review') {
    addFailure(failures, `H6 original gate status changed unexpectedly: ${h6Gate.status}`);
  }
  if (h5Audit.status !== 'passed') {
    addFailure(failures, `H5 anchor audit status is not passed: ${h5Audit.status}`);
  }
  const h5Counts = h5Audit.summary_counts || {};
  if (h5Counts.unresolved_references !== 0 || h5Counts.ambiguous_references !== 0) {
    addFailure(failures, 'H5 anchor audit has unresolved or ambiguous references');
  }

  const h6Counts = h6Report.summary_counts || {};
  if (
    h6Counts.total_records < 7 ||
    h6Counts.atomic_operations < 25 ||
    h6Counts.rendered_official_evidence_records < 13 ||
    h6Counts.negative_regression_fixtures < 7
  ) {
    addFailure(
      failures,
      `H6 evidence summary regressed: records=${h6Counts.total_records} ops=${h6Counts.atomic_operations} rendered=${h6Counts.rendered_official_evidence_records} negatives=${h6Counts.negative_regression_fixtures}`
    );
  }

  const selected = h7.selected_records || [];
  const diagnostic = selected.filter((record) => record.split === 'diagnostic');
  const holdout = selected.filter((record) => record.split === 'locked_holdout');
  if (selected.length !== 24 || diagnostic.length !== 16 || holdout.length !== 8) {
    addFailure(
      failures,
      `H7 sample counts mismatch: total=${selected.length} diagnostic=${diagnostic.length} holdout=${holdout.length}`
    );
  }

  const selectedIds = new Set();
  for (const record of selected) {
    if (selectedIds.has(record.sample_id)) {
      addFailure(failures, `duplicate H7 sample id: ${record.sample_id}`);
    }
    selectedIds.add(record.sample_id);
    if (!byId.has(record.sample_id)) {
      addFailure(failures, `H7 sample id missing from official registry: ${record.sample_id}`);
    }
    if (H5_EXCLUDED_IDS.has(record.sample_id) || H6_EXCLUDED_IDS.has(record.sample_id)) {
      addFailure(failures, `H7 sample reuses prior H5/H6 record: ${record.sample_id}`);
    }
    if (record.evidence_state !== 'metadata_selected_only_no_mapping_or_outcome_recorded') {
      addFailure(failures, `H7 sample records must not include mapping/outcome state: ${record.sample_id}`);
    }
  }

  const levels = new Set(selected.map((record) => record.source_locator && record.source_locator.level));
  const years = new Set(selected.map((record) => record.source_locator && record.source_locator.year));
  const tijdvakken = new Set(selected.map((record) => record.source_locator && record.source_locator.tijdvak));
  const types = new Set(selected.map((record) => record.metadata && record.metadata.question_type));
  const routeTags = new Set(selected.flatMap((record) => record.route_tags || []));
  if (!levels.has('havo') || !levels.has('vwo')) {
    addFailure(failures, 'H7 sample must include both havo and vwo records');
  }
  for (const year of [2023, 2024, 2025]) {
    if (!years.has(year)) addFailure(failures, `H7 sample lacks year ${year}`);
  }
  if (!tijdvakken.has(1) || !tijdvakken.has(2)) {
    addFailure(failures, 'H7 sample must include both tijdvak 1 and tijdvak 2');
  }
  for (const type of ['berekenen', 'uitleg_dat', 'uitleg_of', 'grafisch', 'bron']) {
    if (!types.has(type)) addFailure(failures, `H7 sample lacks question_type ${type}`);
  }
  for (const tag of [
    'scale_factor_watch',
    'incidence_watch',
    'misconception_watch',
    'procedure_expected',
    'over_trigger_watch',
    'answer_form_numeric'
  ]) {
    if (!routeTags.has(tag)) addFailure(failures, `H7 sample lacks route tag ${tag}`);
  }

  if (h7.status !== 'method_frozen_sample_selected_not_evaluated') {
    addFailure(failures, `H7 plan status must remain pre-evaluation: ${h7.status}`);
  }
  if (!h7.frozen_method_anchor || h7.frozen_method_anchor.frozen_before_h7_outcome_recording !== true) {
    addFailure(failures, 'H7 frozen method anchor missing or not frozen before outcome recording');
  }
  if (!allAuthorityFalse(closure.authority_flags)) {
    addFailure(failures, 'H6 closure-readiness authority flags must all be false');
  }
  if (!allAuthorityFalse(h7.authority_flags)) {
    addFailure(failures, 'H7 plan authority flags must all be false');
  }
  if (!allAuthorityFalse(gate.authority_flags)) {
    addFailure(failures, 'Gate authority flags must all be false');
  }
  if (closure.closure_claims && closure.closure_claims.h6_product_route_ready !== false) {
    addFailure(failures, 'H6 closure-readiness record must not claim product-route readiness');
  }
  if (closure.closure_claims && closure.closure_claims.h6_full_closure_claimed !== false) {
    addFailure(failures, 'H6 closure-readiness record must not claim full H6 closure');
  }
  if (!Array.isArray(gate.proof_required_to_close) || gate.proof_required_to_close.length === 0) {
    addFailure(failures, 'Gate packet must name proof_required_to_close');
  }
  if (!Array.isArray(gate.blocks) || !gate.blocks.includes('student or summative use')) {
    addFailure(failures, 'Gate packet must continue blocking student or summative use');
  }

  if (options.skipSubordinateCheckers !== true) {
    const h6Checker = run(
      'node',
      ['build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js'],
      options
    );
    if (h6Checker.status !== 0) {
      addFailure(failures, `H6 evidence checker failed:\n${h6Checker.stdout}${h6Checker.stderr}`);
    }

    const h5Checker = run('node', ['build-scripts/references/check-mtu-h5-anchor-integrity.js'], options);
    if (h5Checker.status !== 0) {
      addFailure(failures, `H5 anchor checker failed:\n${h5Checker.stdout}${h5Checker.stderr}`);
    }
  }

  return {
    ok: failures.length === 0,
    failures,
    warnings,
    summary: {
      sprint_id: SPRINT_ID,
      h6_merge_sha: H6_MERGE_SHA,
      h7_records: selected.length,
      diagnostic_records: diagnostic.length,
      locked_holdout_records: holdout.length,
      levels: [...levels].sort(),
      years: [...years].sort(),
      question_types: [...types].sort()
    }
  };
}

function runCli(argv) {
  const result = validate();
  if (argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    console.log(
      `OK ${SPRINT_ID}: H6 closure-readiness record and H7 blind-holdout benchmark plan are internally consistent`
    );
    console.log(
      `H7 sample: ${result.summary.h7_records} total, ${result.summary.diagnostic_records} diagnostic, ${result.summary.locked_holdout_records} locked holdout`
    );
  } else {
    console.error(`FAIL ${SPRINT_ID}: ${result.failures.length} issue(s)`);
    for (const failure of result.failures) console.error(`- ${failure}`);
  }
  return result.ok ? 0 : 1;
}

if (require.main === module) {
  process.exit(runCli(process.argv.slice(2)));
}

module.exports = {
  FILES,
  SPRINT_ID,
  validate
};
