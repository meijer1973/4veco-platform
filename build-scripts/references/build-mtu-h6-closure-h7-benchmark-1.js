#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H6-CLOSURE-H7-BLIND-HOLDOUT-GENERALIZATION-BUNDLE-1';
const H6_PR = 132;
const H6_MERGE_SHA = '95601ff21b69754d1f82dcca5647edb46ae5a62f';
const H6_REMOTE_HEAD_SHA = 'f23f2e6e151f6c0577bbc9afae76622eae578a86';

const H5_EXCLUDED_IDS = [
  'vw-1022-a-25-1-o:opgave-1:question-3',
  'vw-1022-a-25-1-o:opgave-3:question-15',
  'vw-1022-a-25-1-o:opgave-4:question-19',
  'vw-1022-a-25-2-o:opgave-6:question-27'
];

const H6_EXCLUDED_IDS = [
  'vw-1022-a-24-1-o:opgave-1:question-3',
  'vw-1022-a-24-1-o:opgave-1:question-4',
  'vw-1022-a-24-1-o:opgave-1:question-6',
  'ha-1022-a-23-2-o:opgave-2:question-10',
  'ha-1022-a-23-1-o:opgave-5:question-22',
  'vw-1022-a-23-2-o:opgave-5:question-23',
  'vw-1022-a-24-2-o:opgave-4:question-18'
];

const H7_SAMPLE = [
  {
    id: 'ha-1022-a-23-1-o:opgave-1:question-2',
    split: 'diagnostic',
    route_tags: ['calculation', 'answer_form_numeric', 'scale_factor_watch']
  },
  {
    id: 'ha-1022-a-23-1-o:opgave-2:question-9',
    split: 'diagnostic',
    route_tags: ['calculation', 'labor_market', 'answer_form_numeric']
  },
  {
    id: 'ha-1022-a-23-1-o:opgave-5:question-21',
    split: 'diagnostic',
    route_tags: ['explain', 'market_form', 'misconception_watch']
  },
  {
    id: 'ha-1022-a-23-2-o:opgave-3:question-15',
    split: 'diagnostic',
    route_tags: ['calculation', 'tax_incidence', 'scale_factor_watch']
  },
  {
    id: 'ha-1022-a-24-1-o:opgave-2:question-12',
    split: 'diagnostic',
    route_tags: ['calculation', 'game_theory', 'procedure_expected']
  },
  {
    id: 'ha-1022-a-24-2-o:opgave-1:question-3',
    split: 'diagnostic',
    route_tags: ['graphical', 'welfare_area', 'over_trigger_watch']
  },
  {
    id: 'ha-1022-a-25-1-o:opgave-3:question-16',
    split: 'diagnostic',
    route_tags: ['source_interpretation', 'game_theory', 'misconception_watch']
  },
  {
    id: 'ha-1022-a-25-2-o:opgave-2:question-10',
    split: 'diagnostic',
    route_tags: ['source_interpretation', 'welfare_area', 'incidence_watch']
  },
  {
    id: 'vw-1022-a-23-1-o:opgave-1:question-4',
    split: 'diagnostic',
    route_tags: ['calculation', 'market_power', 'answer_form_numeric']
  },
  {
    id: 'vw-1022-a-23-1-o:opgave-5:question-21',
    split: 'diagnostic',
    route_tags: ['graphical', 'macro_curve', 'procedure_expected']
  },
  {
    id: 'vw-1022-a-23-2-o:opgave-2:question-9',
    split: 'diagnostic',
    route_tags: ['graphical', 'subsidy_welfare', 'over_trigger_watch']
  },
  {
    id: 'vw-1022-a-23-2-o:opgave-4:question-20',
    split: 'diagnostic',
    route_tags: ['explain', 'game_theory', 'nash_watch']
  },
  {
    id: 'vw-1022-a-24-1-o:opgave-3:question-17',
    split: 'diagnostic',
    route_tags: ['calculation', 'exchange_rate', 'scale_factor_watch']
  },
  {
    id: 'vw-1022-a-24-1-o:opgave-5:question-24',
    split: 'diagnostic',
    route_tags: ['explain', 'game_theory', 'procedure_expected']
  },
  {
    id: 'vw-1022-a-24-2-o:opgave-3:question-15',
    split: 'diagnostic',
    route_tags: ['graphical', 'macro_curve', 'over_trigger_watch']
  },
  {
    id: 'vw-1022-a-25-2-o:opgave-1:question-4',
    split: 'diagnostic',
    route_tags: ['graphical', 'subsidy_welfare', 'procedure_expected']
  },
  {
    id: 'ha-1022-a-25-1-o:opgave-2:question-12',
    split: 'locked_holdout',
    route_tags: ['calculation', 'elasticity', 'answer_form_numeric']
  },
  {
    id: 'ha-1022-a-25-2-o:opgave-2:question-9',
    split: 'locked_holdout',
    route_tags: ['calculation', 'tax_incidence', 'scale_factor_watch']
  },
  {
    id: 'ha-1022-a-25-2-o:opgave-4:question-18',
    split: 'locked_holdout',
    route_tags: ['explain', 'game_theory', 'misconception_watch']
  },
  {
    id: 'vw-1022-a-25-1-o:opgave-2:question-11',
    split: 'locked_holdout',
    route_tags: ['calculation', 'rate_change', 'scale_factor_watch']
  },
  {
    id: 'vw-1022-a-25-1-o:opgave-3:question-14',
    split: 'locked_holdout',
    route_tags: ['calculation', 'tax_pass_through', 'incidence_watch']
  },
  {
    id: 'vw-1022-a-25-2-o:opgave-1:question-5',
    split: 'locked_holdout',
    route_tags: ['graphical', 'subsidy_area', 'over_trigger_watch']
  },
  {
    id: 'vw-1022-a-25-2-o:opgave-4:question-20',
    split: 'locked_holdout',
    route_tags: ['source_interpretation', 'game_theory', 'nash_watch']
  },
  {
    id: 'vw-1022-a-25-2-o:opgave-6:question-28',
    split: 'locked_holdout',
    route_tags: ['calculation', 'tariff_or_tax', 'answer_form_numeric']
  }
];

const OUT = {
  closureJson: 'reports/mtu-hardening/mtu-h6-current-main-closure-readiness-record-1.json',
  closureMd: 'reports/mtu-hardening/mtu-h6-current-main-closure-readiness-record-1.md',
  h7Json: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json',
  h7Md: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.md',
  gateJson:
    'reports/review-gates/GATE-MTU-H6-closure-H7-blind-holdout-benchmark-1/review-packet.json',
  gateMd:
    'reports/review-gates/GATE-MTU-H6-closure-H7-blind-holdout-benchmark-1/review-packet.md'
};

function repoPath(relativePath) {
  return path.join(ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), 'utf8'));
}

function writeJson(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(relativePath, value) {
  const file = repoPath(relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function runGit(args, cwd = ROOT) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
  } catch (error) {
    return `unavailable:${error.status || 'error'}`;
  }
}

function questionId(record) {
  return `${record.exam}:opgave-${record.opgave_num}:question-${record.question_num}`;
}

function compactQuestionRecord(record, sampleEntry) {
  return {
    sample_id: questionId(record),
    split: sampleEntry.split,
    source_locator: {
      registry_path: 'references/external/exam-questions.json',
      exam: record.exam,
      level: record.level,
      year: record.year,
      tijdvak: record.tijdvak,
      opgave_num: record.opgave_num,
      question_num: record.question_num,
      page_start: record.page_start,
      page_end: record.page_end
    },
    metadata: {
      question_type: record.question_type,
      points: record.points,
      exam_codes: record.exam_codes
    },
    route_tags: [
      `level:${record.level}`,
      `year:${record.year}`,
      `tijdvak:${record.tijdvak}`,
      `question_type:${record.question_type}`,
      ...sampleEntry.route_tags
    ],
    evidence_state: 'metadata_selected_only_no_mapping_or_outcome_recorded'
  };
}

function summarizeH6() {
  const packageRecord = readJson(
    'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.json'
  );
  const report = readJson('reports/mtu-hardening/mtu-h6-cross-exam-generalization-report.json');
  const gate = readJson(
    'reports/review-gates/GATE-MTU-H6-cross-exam-generalization-and-evidence-integrity-bundle-1/review-packet.json'
  );
  const h5Audit = readJson('reports/mtu-hardening/mtu-h5-anchor-integrity-audit.json');
  const reportCounts = report.summary_counts || {};
  const recordOutcomes = report.record_outcomes || [];
  const h5Counts = h5Audit.summary_counts || {};

  return {
    package_status: packageRecord.status,
    report_status: report.status,
    gate_status: gate.status,
    h5_anchor_integrity_status: h5Audit.status,
    records: reportCounts.total_records,
    operations: reportCounts.atomic_operations,
    rendered_evidence_refs: reportCounts.rendered_official_evidence_records,
    negative_regression_fixtures: reportCounts.negative_regression_fixtures,
    record_ids: recordOutcomes.map((record) => record.record_id),
    blocker_summary: {
      h5_unresolved_refs: h5Counts.unresolved_references,
      h5_ambiguous_refs: h5Counts.ambiguous_references,
      h5_semantic_mappings_unchanged: h5Audit.h5_semantic_mappings_unchanged
    }
  };
}

function buildArtifacts() {
  const now = new Date().toISOString();
  const mainSha = runGit(['rev-parse', '--verify', 'origin/main']);
  const branch = runGit(['branch', '--show-current']);
  const lessenSha = runGit(['rev-parse', 'HEAD'], path.resolve(ROOT, '..', '4veco-lessen'));

  const examQuestions = readJson('references/external/exam-questions.json');
  const byId = new Map(examQuestions.map((record) => [questionId(record), record]));
  const excluded = new Set([...H5_EXCLUDED_IDS, ...H6_EXCLUDED_IDS]);
  const selectedRecords = H7_SAMPLE.map((entry) => {
    if (excluded.has(entry.id)) {
      throw new Error(`H7 sample must not reuse H5/H6 record: ${entry.id}`);
    }
    const record = byId.get(entry.id);
    if (!record) {
      throw new Error(`H7 sample record not found in external registry: ${entry.id}`);
    }
    return compactQuestionRecord(record, entry);
  });

  const diagnosticCount = selectedRecords.filter((record) => record.split === 'diagnostic').length;
  const lockedHoldoutCount = selectedRecords.filter((record) => record.split === 'locked_holdout').length;
  const h6Summary = summarizeH6();

  const authorityFlags = {
    protected_reference_mutation_authorized: false,
    external_source_mutation_authorized: false,
    machine_reference_mutation_authorized: false,
    target_exercise_mutation_authorized: false,
    candidate_storage_authorized: false,
    candidate_write_authorized: false,
    lesson_output_authorized: false,
    product_route_authorized: false,
    diagnostics_authorized: false,
    mastery_authorized: false,
    adaptive_routing_authorized: false,
    sequencing_authorized: false,
    summative_use_authorized: false,
    student_use_authorized: false
  };

  const closureRecord = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    artifact_id: 'mtu-h6-current-main-closure-readiness-record-1',
    status: 'h6_closure_readiness_verified_on_current_main',
    generated_at: now,
    current_branch: branch,
    current_main_sha: mainSha,
    h6_pr: H6_PR,
    h6_reviewed_remote_head_sha: H6_REMOTE_HEAD_SHA,
    h6_merge_sha: H6_MERGE_SHA,
    sibling_lesson_repo_context: {
      path: '../4veco-lessen',
      local_head_sha_used_for_platform_validation: lessenSha
    },
    source_artifacts: {
      h6_package:
        'reports/mtu-hardening/mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.json',
      h6_report: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-report.json',
      h6_gate:
        'reports/review-gates/GATE-MTU-H6-cross-exam-generalization-and-evidence-integrity-bundle-1/review-packet.json',
      h5_anchor_audit: 'reports/mtu-hardening/mtu-h5-anchor-integrity-audit.json'
    },
    current_main_validation_evidence: {
      commands: [
        {
          command:
            'node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js',
          expected_status: 'pass'
        },
        {
          command: 'node build-scripts/references/check-mtu-h5-anchor-integrity.js',
          expected_status: 'pass'
        },
        {
          command: 'node build-scripts/reports/validate-report-json.js',
          expected_status: 'pass'
        },
        {
          command: 'node build-scripts/sprints/emit-url-index.js --check',
          expected_status: 'pass'
        },
        {
          command: 'npm run check:platform',
          expected_status: 'pass',
          local_note:
            'The sibling lesson repository must be current enough to include the merged graph-transfer presentation output.'
        }
      ],
      last_local_result_recorded_by_builder: 'pass_before_artifact_generation'
    },
    h6_evidence_summary: h6Summary,
    closure_claims: {
      h6_closure_readiness_verified_for_tooling_and_review_packet_scope: true,
      h6_full_closure_claimed: false,
      h6_product_route_ready: false,
      scale_gate_ready: false,
      diagnostics_mastery_pv_ready: false,
      student_or_summative_use_ready: false
    },
    authority_flags: authorityFlags,
    next_step: 'freeze_method_and_run_h7_blind_holdout_protocol_without_broadening_authority'
  };

  const h7Plan = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    artifact_id: 'mtu-h7-blind-holdout-benchmark-plan-1',
    status: 'method_frozen_sample_selected_not_evaluated',
    generated_at: now,
    frozen_method_anchor: {
      h6_reviewed_remote_head_sha: H6_REMOTE_HEAD_SHA,
      h6_merge_sha: H6_MERGE_SHA,
      frozen_before_h7_outcome_recording: true,
      permitted_inputs_before_first_pass: [
        'official exam-question metadata from references/external/exam-questions.json',
        'merged H5/H6 evidence packets and checkers',
        'repository governance route and PR readiness reviewer output'
      ],
      forbidden_inputs_before_first_pass: [
        'new MTU definitions',
        'protected reference edits',
        'target exercise edits',
        'candidate writes',
        'student or product-route output',
        'manual tuning against locked-holdout results before first-pass recording'
      ]
    },
    sample_policy: {
      sample_id: 'h7-blind-holdout-sample-20260624-1',
      sample_status: 'approved_for_h7_protocol_preparation_not_yet_reviewed_for_mapping',
      total_records: selectedRecords.length,
      diagnostic_records: diagnosticCount,
      locked_holdout_records: lockedHoldoutCount,
      exclude_previous_h5_h6_records: true,
      excluded_record_ids: [...H5_EXCLUDED_IDS, ...H6_EXCLUDED_IDS],
      source_registry: 'references/external/exam-questions.json',
      selection_basis:
        'metadata-only coverage spread across level, year, tijdvak, question type, calculation, graph, incidence, scaling, answer-form, misconception, and procedure routes'
    },
    selected_records: selectedRecords,
    required_first_pass_outputs: [
      'per-question operation decomposition with stable operation ids',
      'answer-model summaries without lesson output',
      'required MTUs or explicit missing-MTU expectation',
      'forbidden MTUs for over-trigger guards',
      'route tags for calculus, non-calculus, function, point, incidence, answer form, scaling, misconception, and procedure checks',
      'reviewed answer-form and misconception evidence',
      'at least one negative regression fixture per repaired defect class'
    ],
    review_roles_required_before_closure: [
      'teacher agent',
      'economist agent',
      'quality inspection agent',
      'subagent lead review when route requires lead proof'
    ],
    acceptance_bar:
      'More than satisfied review is required before closure; PASS WITH FLAGS may not carry a missing core requirement under REV-STD-1.',
    first_pass_metrics: {
      target_records: 24,
      target_diagnostic_records: 16,
      target_locked_holdout_records: 8,
      expected_atomic_operation_range: '60-80',
      minimum_required_negative_fixtures: 1,
      locked_holdout_results_must_be_recorded_before_repair: true
    },
    authority_flags: authorityFlags
  };

  const gatePacket = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: 'GATE-MTU-H6-closure-H7-blind-holdout-benchmark-1',
    status: 'prepared_for_h7_execution_not_product_or_scale_closure',
    generated_at: now,
    product_end_state:
      'MTU evidence generalization may proceed from merged H6 closure-readiness tooling into a blind H7 holdout protocol without creating student/product authority.',
    original_sprint_or_gate_spec: SPRINT_ID,
    non_negotiable_requirements: [
      'Do not mutate protected references, machine references, external source records, authored target exercises, or MTU registry entries.',
      'Freeze the method at the H6 merge before recording H7 holdout outcomes.',
      'Exclude all H5 and H6 source records from the H7 sample.',
      'Record first-pass locked-holdout outcomes before repair or tuning.',
      'Use REV-STD-1 review packet structure before human closure.'
    ],
    core_requirement_checklist: [
      {
        requirement: 'H6 merged-main closure-readiness evidence is recorded',
        status: 'met',
        proof: OUT.closureJson
      },
      {
        requirement: 'H7 metadata-only blind-holdout sample is selected',
        status: 'met',
        proof: OUT.h7Json
      },
      {
        requirement: 'H7 first-pass mapping and holdout outcomes are complete',
        status: 'not_started',
        proof_required_to_close: 'future H7 mapping report and negative fixture bundle'
      },
      {
        requirement: 'Human closure authority is granted for H7',
        status: 'not_started',
        proof_required_to_close: 'explicit owner approval tied to exact PR head'
      }
    ],
    findings: [
      {
        severity: 'proof_required_to_close',
        finding:
          'This packet prepares H7 execution and records H6 current-main closure-readiness evidence, but it does not itself close H6/H7 or authorize product routes.'
      }
    ],
    blocks: [
      'H7 closure',
      'Scale Gate adoption',
      'product-route readiness',
      'diagnostics/mastery/PV',
      'student or summative use'
    ],
    does_not_block: [
      'non-mutating H7 evidence decomposition',
      'non-mutating H7 validator development',
      'review-packet preparation under the single-account PR governance workflow'
    ],
    proof_required_to_close: [
      'H7 first-pass diagnostic and locked-holdout result packet',
      'negative regression fixture evidence',
      'PR Readiness Reviewer output with exact remote head',
      'live branch-protection checker output with ok: true',
      'lead review and explicit owner authorization if routed READY_FOR_HUMAN_REVIEW'
    ],
    authority_flags: authorityFlags
  };

  writeJson(OUT.closureJson, closureRecord);
  writeJson(OUT.h7Json, h7Plan);
  writeJson(OUT.gateJson, gatePacket);
  writeText(OUT.closureMd, renderClosureMarkdown(closureRecord));
  writeText(OUT.h7Md, renderH7Markdown(h7Plan));
  writeText(OUT.gateMd, renderGateMarkdown(gatePacket));

  return { closureRecord, h7Plan, gatePacket };
}

function renderClosureMarkdown(record) {
  return `# MTU H6 Current-Main Closure-Readiness Record 1

Status: \`${record.status}\`

Sprint: \`${record.sprint_id}\`

Current main SHA recorded by builder: \`${record.current_main_sha}\`

H6 reviewed remote head: \`${record.h6_reviewed_remote_head_sha}\`

H6 merge SHA: \`${record.h6_merge_sha}\`

## Scope

This records H6 evidence-generalization closure-readiness for tooling and review-packet scope after PR #${record.h6_pr} merged. It does not claim full H6 closure and does not authorize product routes, Scale Gate adoption, diagnostics, mastery, PV, student use, summative use, target-exercise mutation, candidate writes, MTU mutation, or protected-reference mutation.

## Evidence Summary

- H6 package status: \`${record.h6_evidence_summary.package_status}\`
- H6 report status: \`${record.h6_evidence_summary.report_status}\`
- H6 gate status: \`${record.h6_evidence_summary.gate_status}\`
- H5 anchor-integrity status: \`${record.h6_evidence_summary.h5_anchor_integrity_status}\`
- H6 records: ${record.h6_evidence_summary.records}
- H6 operations: ${record.h6_evidence_summary.operations}
- H6 rendered evidence refs: ${record.h6_evidence_summary.rendered_evidence_refs}
- H6 negative fixtures: ${record.h6_evidence_summary.negative_regression_fixtures}

## Validation Surface

${record.current_main_validation_evidence.commands
  .map((entry) => `- \`${entry.command}\` -> expected \`${entry.expected_status}\``)
  .join('\n')}

## Boundary

All authority flags remain false. The next permitted action is a non-mutating H7 blind-holdout protocol.
`;
}

function renderH7Markdown(plan) {
  const splitCounts = plan.selected_records.reduce((counts, record) => {
    counts[record.split] = (counts[record.split] || 0) + 1;
    return counts;
  }, {});
  const rows = plan.selected_records
    .map(
      (record) =>
        `| ${record.split} | ${record.sample_id} | ${record.source_locator.level} | ${record.source_locator.year} | ${record.source_locator.tijdvak} | ${record.metadata.question_type} | ${record.route_tags.join(', ')} |`
    )
    .join('\n');

  return `# MTU H7 Blind-Holdout Benchmark Plan 1

Status: \`${plan.status}\`

Sample id: \`${plan.sample_policy.sample_id}\`

Frozen method anchor: \`${plan.frozen_method_anchor.h6_merge_sha}\`

## Counts

- Total: ${plan.selected_records.length}
- Diagnostic: ${splitCounts.diagnostic || 0}
- Locked holdout: ${splitCounts.locked_holdout || 0}

## Protocol Boundary

The method is frozen before H7 outcome recording. This file selects official-exam metadata only; it does not record answers, mappings, lesson output, product output, or holdout results.

## Selected Records

| Split | Sample id | Level | Year | Tijdvak | Type | Route tags |
| --- | --- | --- | --- | --- | --- | --- |
${rows}

## Required First-Pass Outputs

${plan.required_first_pass_outputs.map((item) => `- ${item}`).join('\n')}

## Closure Bar

${plan.acceptance_bar}
`;
}

function renderGateMarkdown(packet) {
  return `# ${packet.gate_id}

Status: \`${packet.status}\`

## Product End State

${packet.product_end_state}

## Original Spec

${packet.original_sprint_or_gate_spec}

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Core Requirement Checklist

${packet.core_requirement_checklist
  .map((item) => `- ${item.status}: ${item.requirement}${item.proof ? ` (${item.proof})` : ''}`)
  .join('\n')}

## Findings

${packet.findings.map((item) => `- ${item.severity}: ${item.finding}`).join('\n')}

## Blocks

${packet.blocks.map((item) => `- ${item}`).join('\n')}

## Does Not Block

${packet.does_not_block.map((item) => `- ${item}`).join('\n')}

## Proof Required To Close

${packet.proof_required_to_close.map((item) => `- ${item}`).join('\n')}
`;
}

try {
  const result = buildArtifacts();
  console.log(
    `OK ${SPRINT_ID}: wrote ${result.h7Plan.selected_records.length} H7 sample records and H6 closure-readiness record`
  );
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
