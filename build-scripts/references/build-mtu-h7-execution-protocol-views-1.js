#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-BLIND-HOLDOUT-EXECUTION-AND-CLOSURE-READINESS-BUNDLE-1';
const SOURCE_PLAN = 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json';
const PR144_MERGE_SHA = 'f05f8e67e3b5528fd8f30401ba1b0fa084042fff';
const H6_METHOD_ANCHOR_SHA = '95601ff21b69754d1f82dcca5647edb46ae5a62f';

const OUT = {
  protocolJson: 'reports/mtu-hardening/mtu-h7-execution-protocol-views-1.json',
  protocolMd: 'reports/mtu-hardening/mtu-h7-execution-protocol-views-1.md',
  curatorView: 'reports/mtu-hardening/mtu-h7-execution-curator-view-1.json',
  mapperView: 'reports/mtu-hardening/mtu-h7-execution-mapper-view-1.json',
  adjudicatorView: 'reports/mtu-hardening/mtu-h7-execution-adjudicator-view-1.json'
};

const METHOD_INPUTS = [
  {
    role: 'evidence_resolver',
    path: 'build-scripts/references/lib/evidence-reference-resolver.js'
  },
  {
    role: 'h5_anchor_checker',
    path: 'build-scripts/references/check-mtu-h5-anchor-integrity.js'
  },
  {
    role: 'h6_generalization_checker',
    path: 'build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js'
  },
  {
    role: 'h6_h7_preparation_checker',
    path: 'build-scripts/references/check-mtu-h6-closure-h7-benchmark-1.js'
  },
  {
    role: 'h6_fixture_method_precedent',
    path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-fixture.json'
  },
  {
    role: 'h6_report_method_precedent',
    path: 'reports/mtu-hardening/mtu-h6-cross-exam-generalization-report.json'
  },
  {
    role: 'h7_frozen_sample_plan',
    path: SOURCE_PLAN
  },
  {
    role: 'operation_answer_skill_contract',
    path: 'references/data/exam-ingestion/operation-answer-skill-contract.json'
  },
  {
    role: 'operation_answer_skill_schema',
    path: 'references/schemas/operation-answer-skill-contract.schema.json'
  },
  {
    role: 'skill_operation_registry',
    path: 'references/data/skill-operation-registry.json'
  },
  {
    role: 'misconception_registry',
    path: 'reports/json/misconception-registry.json'
  },
  {
    role: 'procedure_coverage_report',
    path: 'reports/json/procedure-coverage.json'
  },
  {
    role: 'answer_form_gate',
    path: 'reports/mtu-hardening/mtu-h4-answer-form-question-type-routing.json'
  },
  {
    role: 'failure_taxonomy',
    path: 'reports/mtu-hardening/failure-taxonomy-v1.md'
  }
];

const AUTHORITY_FLAGS = {
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
  pv_authorized: false,
  summative_use_authorized: false,
  student_use_authorized: false
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

function sha256File(relativePath) {
  const file = repoPath(relativePath);
  if (!fs.existsSync(file)) {
    return {
      path: relativePath,
      exists: false,
      sha256: null
    };
  }
  return {
    path: relativePath,
    exists: true,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
  };
}

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
  }
}

function promptPdfPath(record) {
  return `references/external/exams/${record.source_locator.exam}.pdf`;
}

function correctionPdfPath(record) {
  return `references/external/exams/${record.source_locator.exam.replace(/-o$/, '-c')}.pdf`;
}

function sourceHashesFor(records) {
  const paths = new Set();
  for (const record of records) {
    paths.add(promptPdfPath(record));
    paths.add(correctionPdfPath(record));
  }
  return [...paths].sort().map((relativePath) => sha256File(relativePath));
}

function mapperRecord(record, index) {
  return {
    mapper_record_id: `h7-map-${String(index + 1).padStart(3, '0')}`,
    sample_id: record.sample_id,
    evidence_state: 'mapper_input_no_split_tags_outcomes_or_gold_operations',
    source_locator: {
      registry_path: record.source_locator.registry_path,
      exam: record.source_locator.exam,
      opgave_num: record.source_locator.opgave_num,
      question_num: record.source_locator.question_num,
      prompt_pdf_path: promptPdfPath(record),
      prompt_page_start: record.source_locator.page_start,
      prompt_page_end: record.source_locator.page_end,
      correction_pdf_path: correctionPdfPath(record),
      correction_pages_status: 'pending_phase_b_extraction'
    },
    allowed_mapper_inputs: [
      'official prompt/source pages',
      'official correction-model pages after evidence-team extraction',
      'canonical MTU registry for lookup only',
      'sealed generic method rules'
    ],
    forbidden_mapper_inputs: [
      'diagnostic_or_holdout_split',
      'route_tags',
      'semantic_selection_tags',
      'expected_outcomes',
      'gold_operations',
      'adjudication_results',
      'post_outcome_repairs'
    ]
  };
}

function adjudicatorRecord(record, index) {
  return {
    adjudicator_record_id: `h7-adj-${String(index + 1).padStart(3, '0')}`,
    sample_id: record.sample_id,
    evidence_state: 'official_evidence_ready_for_future_mapper_prediction_seal',
    official_evidence_locator: {
      registry_path: record.source_locator.registry_path,
      prompt_pdf_path: promptPdfPath(record),
      prompt_page_start: record.source_locator.page_start,
      prompt_page_end: record.source_locator.page_end,
      correction_pdf_path: correctionPdfPath(record),
      correction_pages_status: 'pending_phase_b_extraction'
    },
    sealed_mapper_prediction_path: null,
    adjudication_result_path: null,
    split_visible_before_scoring: false
  };
}

function build() {
  const plan = readJson(SOURCE_PLAN);
  const selected = plan.selected_records || [];
  const diagnostic = selected.filter((record) => record.split === 'diagnostic');
  const holdout = selected.filter((record) => record.split === 'locked_holdout');
  const methodInputHashes = METHOD_INPUTS.map((input) => ({
    ...input,
    ...sha256File(input.path)
  }));
  const sourcePdfHashes = sourceHashesFor(selected);
  const generatedAt = new Date().toISOString();
  const currentMainSha = git(['rev-parse', '--verify', 'origin/main']) || git(['rev-parse', 'HEAD']);
  const currentHeadSha = git(['rev-parse', 'HEAD']);

  const curatorView = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    view_id: 'mtu-h7-execution-curator-view-1',
    status: 'curator_only_contains_split_and_selection_tags',
    generated_at: generatedAt,
    source_plan: SOURCE_PLAN,
    selected_records: selected,
    access_policy: {
      may_be_used_by: ['curator', 'metrics_after_scoring', 'subagent_lead'],
      must_not_be_used_by: ['mapper_before_prediction_seal'],
      reason:
        'Contains split labels and semantic selection tags that are valid for balancing but must not condition independent mapper predictions.'
    },
    authority_flags: AUTHORITY_FLAGS
  };

  const mapperView = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    view_id: 'mtu-h7-execution-mapper-view-1',
    status: 'sealed_mapper_input_no_split_tags_or_outcomes',
    generated_at: generatedAt,
    source_plan: SOURCE_PLAN,
    records: selected.map(mapperRecord),
    omitted_fields: [
      'split',
      'metadata.question_type',
      'metadata.exam_codes',
      'route_tags',
      'expected_outcomes',
      'gold_operations',
      'adjudication_results',
      'benchmark_classification'
    ],
    authority_flags: AUTHORITY_FLAGS
  };

  const adjudicatorView = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    view_id: 'mtu-h7-execution-adjudicator-view-1',
    status: 'adjudicator_shell_waiting_for_sealed_mapper_predictions',
    generated_at: generatedAt,
    source_plan: SOURCE_PLAN,
    records: selected.map(adjudicatorRecord),
    adjudication_policy: {
      compare_against_official_correction_evidence: true,
      record_first_pass_before_repair: true,
      do_not_tune_locked_holdout_and_rerun: true
    },
    authority_flags: AUTHORITY_FLAGS
  };

  const protocol = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    artifact_id: 'mtu-h7-execution-protocol-views-1',
    status: 'phase_a_protocol_sealed_no_mapping_or_outcomes',
    generated_at: generatedAt,
    current_head_sha: currentHeadSha,
    current_main_sha: currentMainSha,
    governed_baseline: {
      pr144_merge_sha: PR144_MERGE_SHA,
      h6_frozen_method_anchor_sha: H6_METHOD_ANCHOR_SHA,
      h7_sample_id: plan.sample_policy && plan.sample_policy.sample_id,
      h7_plan_path: SOURCE_PLAN,
      h7_plan_status: plan.status
    },
    method_input_hashes: methodInputHashes,
    official_source_pdf_hashes: sourcePdfHashes,
    sample_counts: {
      total_records: selected.length,
      diagnostic_records: diagnostic.length,
      locked_holdout_records: holdout.length
    },
    view_paths: OUT,
    benchmark_view_policy: {
      sample_is_procedurally_locked: true,
      cryptographic_blinding_claimed: false,
      mapper_view_strips_curator_metadata: true,
      holdout_outcomes_recorded: false,
      h7_mappings_recorded: false
    },
    negative_fixture_policy: {
      minimum_meaningful_negative_fixtures_per_record: 1,
      minimum_total_negative_fixtures: selected.length,
      additional_negatives_required_for_high_risk_multi_operation_records: true,
      materialization_status: 'pending_after_operation_decomposition'
    },
    authority_flags: AUTHORITY_FLAGS
  };

  writeJson(OUT.curatorView, curatorView);
  writeJson(OUT.mapperView, mapperView);
  writeJson(OUT.adjudicatorView, adjudicatorView);
  writeJson(OUT.protocolJson, protocol);
  writeText(OUT.protocolMd, renderProtocol(protocol));

  return protocol;
}

function renderProtocol(protocol) {
  return `# MTU H7 Execution Protocol Views 1

Status: \`${protocol.status}\`

Current main: \`${protocol.current_main_sha}\`

PR #144 merge: \`${protocol.governed_baseline.pr144_merge_sha}\`

H6 frozen method anchor: \`${protocol.governed_baseline.h6_frozen_method_anchor_sha}\`

## Counts

- Total records: ${protocol.sample_counts.total_records}
- Diagnostic records: ${protocol.sample_counts.diagnostic_records}
- Locked-holdout records: ${protocol.sample_counts.locked_holdout_records}

## Views

- Curator view: \`${protocol.view_paths.curatorView}\`
- Mapper view: \`${protocol.view_paths.mapperView}\`
- Adjudicator view: \`${protocol.view_paths.adjudicatorView}\`

The mapper view omits split labels, route tags, semantic selection tags, expected outcomes, gold operations, and adjudication results. The sample is procedurally locked; this does not claim cryptographic hiding.

## Negative Fixture Bar

Minimum meaningful negative fixtures: ${protocol.negative_fixture_policy.minimum_total_negative_fixtures}, at least one per record, with extra negatives for high-risk multi-operation questions.

## Authority Boundary

All authority flags remain false. This protocol creates no H7 mappings, outcomes, lesson output, candidate writes, protected-reference mutation, Scale Gate authority, or student/product use.
`;
}

try {
  const protocol = build();
  console.log(
    `OK ${SPRINT_ID}: sealed ${protocol.sample_counts.total_records} records into curator/mapper/adjudicator views`
  );
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
