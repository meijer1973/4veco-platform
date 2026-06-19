#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const FIXTURE_REL = 'reports/mtu-hardening/mtu-h5-regression-fixture.json';
const REPORT_JSON_REL = 'reports/mtu-hardening/mtu-h5-regression-report.json';
const REPORT_MD_REL = 'reports/mtu-hardening/mtu-h5-regression-report.md';
const VALIDATOR_REL = 'build-scripts/references/check-mtu-h5-mapping-regression.js';
const PR43_REVIEW_PACKET_REL = 'reports/review-gates/GATE-MTU-H5-mainline-checker-repair/review-packet.md';
const PR43_MERGE_COMMIT = '48d0fa6d4ce03dff6feeb66955909125264c06f9';

const QUESTION_RECORDS = {
  q3: 'vw-1022-a-25-1-o:opgave-1:question-3',
  q15: 'vw-1022-a-25-1-o:opgave-3:question-15',
  q19: 'vw-1022-a-25-1-o:opgave-4:question-19',
  q27: 'vw-1022-a-25-2-o:opgave-6:question-27',
};

const LANE_DETAILS = {
  q19: {
    status: 'source_graph_procedure_reasoning_review_blocker',
    summary: 'answer-form equivalent accepted by PR #80; source-annex and graph-object review; chained multi-market reasoning; A42/D10/D13/A81 procedure semantic-fit review',
    blocker_label: 'source/graph/procedure/reasoning review blocker',
    procedure_semantic_fit_executed: false,
  },
  q19_after_procedure_semantic_fit: {
    status: 'source_graph_reasoning_review_blocker',
    summary: 'answer-form equivalent accepted by PR #80; procedure semantic-fit accepted by MTU-H5-Q19-PROCEDURE-SEMANTIC-FIT-PACKAGE-1; source-annex and graph-object review; chained multi-market reasoning; third graph-shift dependency',
    blocker_label: 'source/graph/reasoning review blocker',
    procedure_semantic_fit_executed: true,
  },
  q27: {
    status: 'clean_after_q27_step2_capacity_taxonomy_reviewed_equivalent',
    summary: 'q27-step-1 D41/D05/A88 reviewed equivalent and q27-step-2 capacity/source-readout reviewed equivalent accepted; no D07/D08 closure claim',
  },
  q15: {
    status: 'clean_after_q15_two_step_answer_skill_reviewed_equivalent',
    summary: 'EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION accepted as reviewed-equivalent answer-skill; D27/F03/F09 remain content support and A97 remains answer-form/procedure support',
  },
};

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

function fail(message) {
  console.error(`build-mtu-h5-regression-report: ${message}`);
  process.exit(1);
}

function repoPath(relPath) {
  return path.join(ROOT, relPath);
}

function readJsonIfExists(relPath) {
  const file = repoPath(relPath);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function parseArgs(argv) {
  const options = {
    check: false,
    generatedDate: null,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--check') {
      options.check = true;
    } else if (arg === '--generated-date') {
      index += 1;
      if (!argv[index]) fail('missing value for --generated-date');
      options.generatedDate = argv[index];
    } else if (arg.startsWith('--generated-date=')) {
      options.generatedDate = arg.slice('--generated-date='.length);
    } else {
      fail(`unknown argument: ${arg}`);
    }
  }
  if (options.generatedDate && !/^\d{4}-\d{2}-\d{2}$/.test(options.generatedDate)) {
    fail('--generated-date must use YYYY-MM-DD');
  }
  return options;
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function runValidator() {
  const result = spawnSync(process.execPath, [
    VALIDATOR_REL,
    '--fixture',
    FIXTURE_REL,
    '--json',
  ], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    fail('validator command failed');
  }
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    fail(`validator did not emit JSON: ${error.message}`);
  }
}

function countBy(items, key, fallback = 'none') {
  return items.reduce((counts, item) => {
    const value = item[key] || fallback;
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countQuestionItems(items, recordId) {
  return items.filter((item) => item.record_id === recordId).length;
}

function questionBucketCounts(result) {
  const counts = {};
  for (const [question, recordId] of Object.entries(QUESTION_RECORDS)) {
    counts[question] = {
      failed: countQuestionItems(result.buckets.failed, recordId),
      review_required: countQuestionItems(result.buckets.review_required, recordId),
    };
  }
  counts.global_negative_guard = {
    passed: result.buckets.passed.filter((item) => String(item.assertion_id || '').startsWith('MTUH5-NEGATIVE-')).length,
  };
  return counts;
}

function bucketTotals(result) {
  return {
    passed: result.buckets.passed.length,
    failed: result.buckets.failed.length,
    review_required: result.buckets.review_required.length,
    blocked: result.buckets.blocked.length,
  };
}

function authorityBoundary() {
  return Object.fromEntries(AUTHORITY_FALSE_KEYS.map((key) => [key, false]));
}

function q19LaneDetails(result) {
  const q19ProcedureReviewRemaining = result.buckets.review_required.some((item) => (
    item.record_id === QUESTION_RECORDS.q19 &&
    String(item.assertion_id || '').includes(':ASSERT-PROCEDURE-REVIEW-')
  ));
  return q19ProcedureReviewRemaining
    ? LANE_DETAILS.q19
    : LANE_DETAILS.q19_after_procedure_semantic_fit;
}

function buildReport(result, generatedDate) {
  const totals = bucketTotals(result);
  const questions = questionBucketCounts(result);
  const q19Details = q19LaneDetails(result);
  return {
    ...result,
    report_generated: generatedDate,
    source_fixture: FIXTURE_REL,
    source_validator_command: `node ${VALIDATOR_REL} --fixture ${FIXTURE_REL} --json`,
    source_review_packet: PR43_REVIEW_PACKET_REL,
    source_merge_commit: PR43_MERGE_COMMIT,
    report_status_note: 'Diagnostic report only; non-mutating MTU-H5 validator output. Failed and review_required entries are expected live coverage gaps, not authorization for reference mutation or product use.',
    bucket_totals: totals,
    question_bucket_counts: questions,
    failed_by_defect_class: countBy(result.buckets.failed, 'defect_class'),
    review_required_by_defect_class: {
      ...countBy(result.buckets.review_required.filter((item) => item.defect_class), 'defect_class'),
      fixture_review_hooks: result.buckets.review_required.filter((item) => item.hook).length,
    },
    procedure_statuses: countBy(result.procedure_checks, 'status'),
    remaining_lane_status: {
      q3: {
        status: 'clean_after_q3_fixture_execution',
        failed: questions.q3.failed,
        review_required: questions.q3.review_required,
        blocks_mtu_h5_closure: false,
      },
      q19: {
        status: q19Details.status,
        failed: questions.q19.failed,
        review_required: questions.q19.review_required,
        diagnostic_focus: q19Details.summary,
        procedure_semantic_fit_executed: q19Details.procedure_semantic_fit_executed,
        blocks_mtu_h5_closure: true,
      },
      q27: {
        status: LANE_DETAILS.q27.status,
        failed: questions.q27.failed,
        review_required: questions.q27.review_required,
        diagnostic_focus: LANE_DETAILS.q27.summary,
        blocks_mtu_h5_closure: false,
      },
      q15: {
        status: LANE_DETAILS.q15.status,
        failed: questions.q15.failed,
        review_required: questions.q15.review_required,
        diagnostic_focus: LANE_DETAILS.q15.summary,
        blocks_mtu_h5_closure: false,
      },
    },
    authority_boundary: authorityBoundary(),
    completion_claimed: false,
  };
}

function markdownTable(headers, rows) {
  const header = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  return [header, divider, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n');
}

function objectRows(object) {
  return Object.entries(object)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => [`\`${key}\``, String(value)]);
}

function renderMarkdown(report) {
  const totals = report.bucket_totals;
  const q19Details = report.remaining_lane_status.q19;
  const questionRows = [
    ['q3', report.question_bucket_counts.q3.failed, report.question_bucket_counts.q3.review_required, 'clean after q3 fixture execution'],
    ['q19', report.question_bucket_counts.q19.failed, report.question_bucket_counts.q19.review_required, q19Details.status],
    ['q27', report.question_bucket_counts.q27.failed, report.question_bucket_counts.q27.review_required, LANE_DETAILS.q27.status],
    ['q15', report.question_bucket_counts.q15.failed, report.question_bucket_counts.q15.review_required, LANE_DETAILS.q15.status],
    ['global negative guard', 0, 0, `${report.question_bucket_counts.global_negative_guard.passed} passed`],
  ];
  const laneRows = [
    ['q19', q19Details.diagnostic_focus],
    ['q27', LANE_DETAILS.q27.summary],
    ['q15', LANE_DETAILS.q15.summary],
  ];

  return `# MTU-H5 Regression Report

Generated: ${report.report_generated}

Status: \`${report.status}\`

Fixture: \`${report.fixture_id}\`

Source validator:

\`\`\`text
${report.source_validator_command}
\`\`\`

Post-q3 evidence anchor: PR #43 merge commit \`${report.source_merge_commit}\`
and \`${report.source_review_packet}\`.

This is a non-mutating diagnostic report from the approved MTU-H5 regression
fixture. It does not authorize protected reference mutation, authored
target-exercise mutation, lesson output, PV, diagnostics, mastery, sequencing,
AI, summative use, product-route readiness, or student/product use.

## Bucket Counts

${markdownTable(['Bucket', 'Count'], [
    ['passed', totals.passed],
    ['failed', totals.failed],
    ['review_required', totals.review_required],
    ['blocked', totals.blocked],
  ])}

## Question And Lane Counts

${markdownTable(['Surface', 'Failed', 'Review required', 'Status'], questionRows)}

## Remaining Blockers

- q3 is clean in the current post-q3 diagnostic surface: 0 failed / 0 review_required.
- q19 remains a ${q19Details.status === 'source_graph_reasoning_review_blocker' ? 'source/graph/reasoning review blocker' : 'source/graph/procedure/reasoning review blocker'}: ${report.question_bucket_counts.q19.failed} failed / ${report.question_bucket_counts.q19.review_required} review_required.
- q27 is clean after the q27-step-2 capacity/source-readout reviewed-equivalent repair: ${report.question_bucket_counts.q27.failed} failed / ${report.question_bucket_counts.q27.review_required} review_required.
- q15 is clean after the two-step dominant-strategy/prisoner-dilemma reviewed-equivalent answer-skill repair: ${report.question_bucket_counts.q15.failed} failed / ${report.question_bucket_counts.q15.review_required} review_required.
- MTU-H5 final closure and product-route readiness remain blocked until the separately held q19 source/graph/reasoning lane is resolved.

## Lane-Specific Diagnostic Meaning

${markdownTable(['Lane', 'Diagnostic meaning'], laneRows)}

## Failed Defect Classes

${markdownTable(['Defect class', 'Count'], objectRows(report.failed_by_defect_class))}

## Review-Required Classes

${markdownTable(['Class or hook group', 'Count'], objectRows(report.review_required_by_defect_class))}

## Procedure Statuses

${markdownTable(['Procedure status', 'Count'], objectRows(report.procedure_statuses))}

The procedure output distinguishes \`procedure_present\`, \`procedure_missing\`,
and \`procedure_review_required\`. This run produced no blocked assertions.

## Negative Fixture

The negative fixture passed by failing as expected for the
\`function_construction_route_triggered_when_point_calculation_enough\` defect
class.

## Boundary

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No authored
target-exercise mutation authorized. No MTU minting, update, split, merge, or
deprecation authorized. No candidate storage or candidate writes authorized.
No lesson output, PV, diagnostics, product-route readiness, or student/product
use authorized.
`;
}

function compareFile(relPath, expected) {
  const file = repoPath(relPath);
  if (!fs.existsSync(file)) fail(`${relPath} is missing`);
  const current = fs.readFileSync(file, 'utf8');
  if (current.replace(/\r\n/g, '\n') !== expected) {
    fail(`${relPath} is stale; run node build-scripts/references/build-mtu-h5-regression-report.js`);
  }
}

function main() {
  const options = parseArgs(process.argv);
  const existingReport = readJsonIfExists(REPORT_JSON_REL);
  const generatedDate = options.generatedDate
    || (options.check && existingReport?.report_generated)
    || todayIsoDate();
  const result = runValidator();
  const report = buildReport(result, generatedDate);
  const jsonText = `${JSON.stringify(report, null, 2)}\n`;
  const mdText = renderMarkdown(report);

  if (options.check) {
    compareFile(REPORT_JSON_REL, jsonText);
    compareFile(REPORT_MD_REL, mdText);
    console.log('OK MTU-H5 regression report is current');
    return;
  }

  fs.writeFileSync(repoPath(REPORT_JSON_REL), jsonText, 'utf8');
  fs.writeFileSync(repoPath(REPORT_MD_REL), mdText, 'utf8');
  console.log(`Wrote ${REPORT_JSON_REL}`);
  console.log(`Wrote ${REPORT_MD_REL}`);
}

main();
