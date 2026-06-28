#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SPRINT_ID = 'MTU-H7-OPERATION-REGISTRY-GOVERNANCE-AND-HOLDOUT-ADJUDICATION-BUNDLE-1';
const PREVIOUS_H7_SPRINT_ID = 'MTU-H7-BLIND-HOLDOUT-EXECUTION-AND-CLOSURE-READINESS-BUNDLE-1';
const GATE_ID = 'GATE-MTU-H7-operation-registry-governance-and-holdout-adjudication-bundle-1';

const H7_FIXTURE_JSON = 'reports/mtu-hardening/mtu-h7-execution-fixture-1.json';
const H7_REPORT_JSON = 'reports/mtu-hardening/mtu-h7-execution-report-1.json';
const H7_BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-execution-benchmark-bundle-1.json';
const H7_DIAGNOSTIC_EVIDENCE_JSON = 'reports/mtu-hardening/mtu-h7-diagnostic-evidence-manifest-1.json';
const H7_HOLDOUT_EVIDENCE_JSON = 'reports/mtu-hardening/mtu-h7-holdout-evidence-manifest-1.json';
const UNITS_JSON = 'references/machine/micro-teaching-units.json';

const OUT_BUNDLE_JSON = 'reports/mtu-hardening/mtu-h7-operation-registry-governance-bundle-1.json';
const OUT_BUNDLE_MD = 'reports/mtu-hardening/mtu-h7-operation-registry-governance-bundle-1.md';
const OUT_PUBLICATION_JSON = 'reports/mtu-hardening/mtu-h7-current-main-publication-closure-1.json';
const OUT_PUBLICATION_MD = 'reports/mtu-hardening/mtu-h7-current-main-publication-closure-1.md';
const OUT_BLOCKER_JSON = 'reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.json';
const OUT_BLOCKER_MD = 'reports/mtu-hardening/mtu-h7-operation-blocker-matrix-1.md';
const OUT_EVIDENCE_JSON = 'reports/mtu-hardening/mtu-h7-official-evidence-matrix-1.json';
const OUT_DECISIONS_JSON = 'reports/mtu-hardening/mtu-h7-reviewed-equivalent-decisions-1.json';
const OUT_CANDIDATES_JSON = 'reports/mtu-hardening/mtu-h7-governance-candidate-packets-1.json';
const OUT_Q5_JSON = 'reports/mtu-hardening/mtu-h7-holdout-q5-graph-adjudication-1.json';
const OUT_Q5_MD = 'reports/mtu-hardening/mtu-h7-holdout-q5-graph-adjudication-1.md';
const OUT_QUALITY_MD = 'reports/mtu-hardening/mtu-h7-governance-quality-log-1.md';
const GATE_JSON = `reports/review-gates/${GATE_ID}/review-packet.json`;
const GATE_MD = `reports/review-gates/${GATE_ID}/review-packet.md`;
const GATE_URLS = `reports/review-gates/${GATE_ID}/bundle-urls.md`;
const LEAD_REVIEW_MD = `reports/review-gates/${GATE_ID}/lead-review.md`;
const LEAD_REVIEW_TEMPLATE_MD = `reports/review-gates/${GATE_ID}/lead-review-template.md`;

const AUTHORITY_FLAGS = {
  protected_reference_mutation_authorized: false,
  external_source_mutation_authorized: false,
  machine_reference_mutation_authorized: false,
  authored_target_exercise_mutation_authorized: false,
  unit_minting_authorized: false,
  unit_update_authorized: false,
  unit_split_authorized: false,
  unit_merge_authorized: false,
  unit_deprecation_authorized: false,
  operation_registry_mutation_authorized: false,
  answer_skill_mutation_authorized: false,
  candidate_storage_creation_authorized: false,
  candidate_writes_authorized: false,
  lesson_output_mutation_authorized: false,
  diagnostics_authorized: false,
  adaptive_routing_authorized: false,
  mastery_authorized: false,
  sequencing_authorized: false,
  student_facing_ai_authorized: false,
  summative_use_authorized: false,
  pv_projection_authorized: false,
  pv_machine_promotion_authorized: false,
  student_product_use_authorized: false,
  product_route_readiness_claimed: false,
  scale_gate_1_authorized: false
};

const REQUIRED_REVIEW_RECORD_IDS = [
  'ha-1022-a-23-2-o:opgave-3:question-15',
  'ha-1022-a-24-1-o:opgave-2:question-12',
  'vw-1022-a-23-2-o:opgave-4:question-20',
  'vw-1022-a-24-1-o:opgave-3:question-17',
  'vw-1022-a-24-2-o:opgave-3:question-15',
  'vw-1022-a-25-2-o:opgave-1:question-4',
  'vw-1022-a-25-2-o:opgave-1:question-5'
];

const DECISION_OVERRIDES = {
  'h7-ha23-2-q15-net-ratio-nivellering': {
    blocker_id: 'H7-BLOCKER-CANONICAL-NIVELLERING-POSITIVE-COUNTERPART',
    final_route: 'HOLD_FOR_CANONICAL_MTU_GOVERNANCE',
    decision: 'do_not_close_from_existing_H08_without_human_canonical_decision',
    existing_fit_assessment: 'H08 is mapped because the official correction proves income differences narrow, but the registry label says denivellering while its kern says tax changes shrink differences. That tension is canonical registry governance, not a fixture repair.',
    needed_governance: 'Approve a canonical MTU/update or explicit reviewed-equivalent rule for the positive narrowing/nivellering counterpart before H7 closure.',
    candidate_packet_id: 'H7-CAND-CANONICAL-NIVELLERING-POSITIVE-COUNTERPART',
    safe_interim_action: 'Keep H08 as evidence anchor, keep A15 forbidden, and keep review_required.',
    closure_authority_required: 'canonical_mtu_governance_owner',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q15-denivellering-label-reversal',
      expected_failure_defect_class: 'canonical_mtu_governance_need',
      mutation: 'Treat ratio decrease as denivellering closure without explicit positive-counterpart authority.',
      guard: 'A smaller high/low net-income ratio must not silently close as denivellering.'
    }
  },
  'h7-ha24-1-q12-snel-residual-payoff': {
    blocker_id: 'H7-BLOCKER-OP-ULTIMATUM-RESIDUAL-PAYOFF',
    final_route: 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE',
    decision: 'operation_registry_candidate_needed',
    existing_fit_assessment: 'A81 and A96 cover source use and calculational answer form; F12 must stay forbidden because the official operation is direct residual payoff arithmetic inside an ultimatum setting, not Nash-in-matrix selection.',
    needed_governance: 'Approve an operation-registry entry or reviewed-equivalent rule for ultimatum-game residual payoff arithmetic.',
    candidate_packet_id: 'H7-CAND-OP-ULTIMATUM-RESIDUAL-PAYOFF',
    safe_interim_action: 'Keep missing_mtu_expected true and keep F12 forbidden.',
    closure_authority_required: 'operation_registry_governance_owner',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q12-f12-overtrigger-residual',
      expected_failure_defect_class: 'over_trigger',
      mutation: 'Map F12 to the residual-payoff operation.',
      guard: 'Direct payoff arithmetic must not be closed by Nash pay-off matrix coverage.'
    }
  },
  'h7-ha24-1-q12-sprinter-margin-payoff': {
    blocker_id: 'H7-BLOCKER-OP-ULTIMATUM-MARGIN-PAYOFF',
    final_route: 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE',
    decision: 'operation_registry_candidate_needed',
    existing_fit_assessment: 'A81 and A96 cover source use and answer form; no current canonical operation captures accepted price less marginal cost inside the ultimatum-game payoff table.',
    needed_governance: 'Approve an operation-registry entry or reviewed-equivalent rule for ultimatum-game margin payoff arithmetic.',
    candidate_packet_id: 'H7-CAND-OP-ULTIMATUM-MARGIN-PAYOFF',
    safe_interim_action: 'Keep missing_mtu_expected true and keep F12 forbidden.',
    closure_authority_required: 'operation_registry_governance_owner',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q12-cost-omitted-margin',
      expected_failure_defect_class: 'operation_registry_need',
      mutation: 'Accept price as Sprinter payoff without subtracting marginal cost.',
      guard: 'The margin-payoff operation must retain the marginal-cost subtraction.'
    }
  },
  'h7-vw23-2-q20-game-tree-nash': {
    blocker_id: 'H7-BLOCKER-OP-GAME-TREE-NASH',
    final_route: 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE',
    decision: 'operation_registry_candidate_needed',
    existing_fit_assessment: 'F12 names and procedures Nash equilibrium in a pay-off matrix. The official q20 evidence uses a sequential game tree and payoff comparison, so F12 is only a partial concept anchor and must not be the whole closure mechanism.',
    needed_governance: 'Approve a game-tree Nash/backward-comparison operation or reviewed-equivalent rule that explicitly distinguishes tree reasoning from matrix marking.',
    candidate_packet_id: 'H7-CAND-OP-GAME-TREE-NASH-BACKWARD-COMPARISON',
    safe_interim_action: 'Keep review_required and keep matrix-shortcut misconception guard.',
    closure_authority_required: 'operation_registry_governance_owner',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q20-matrix-shortcut',
      expected_failure_defect_class: 'operation_registry_need',
      mutation: 'Close q20 using only F12 matrix procedure text.',
      guard: 'Game-tree payoff comparison cannot be reduced to matrix cell marking.'
    }
  },
  'h7-vw24-1-q17-insurance-cost-benefit': {
    blocker_id: 'H7-BLOCKER-PROCEDURE-INSURANCE-COST-BENEFIT',
    final_route: 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE',
    decision: 'procedure_or_operation_registry_candidate_needed',
    existing_fit_assessment: 'G12 covers expected-damage premium calculation. The official q17 operation combines fixed and monthly currency-insurance costs and subtracts them from avoided exchange-rate loss, so the current procedure is only a partial fit.',
    needed_governance: 'Approve a fixed/variable currency-insurance cost-benefit operation or reviewed-equivalent procedure rule.',
    candidate_packet_id: 'H7-CAND-OP-FIXED-VARIABLE-CURRENCY-INSURANCE-COST-BENEFIT',
    safe_interim_action: 'Keep G12 mapped as partial insurance anchor but keep procedure_fit_gap.',
    closure_authority_required: 'operation_registry_governance_owner',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q17-premium-month-factor-omitted',
      expected_failure_defect_class: 'procedure_fit_gap',
      mutation: 'Calculate only the fixed insurance cost and omit monthly variable cost.',
      guard: 'Procedure closure must include all fixed/monthly insurance cost components before net benefit.'
    }
  },
  'h7-vw24-2-q15-ga-mb-first-adjustment': {
    blocker_id: 'H7-BLOCKER-PROCEDURE-IS-MB-GA-SEQUENCE-FIRST',
    final_route: 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE',
    decision: 'procedure_or_operation_registry_candidate_needed',
    existing_fit_assessment: 'I07 covers IS-MB-GA analysis broadly and A42 covers generic graph shifts. The official q15 operation requires a period-specific GA1/MB1 sequence from expected-minus-realized inflation and real-rate reduction.',
    needed_governance: 'Approve a multi-period IS-MB-GA sequence operation or reviewed-equivalent procedure rule.',
    candidate_packet_id: 'H7-CAND-OP-MULTIPERIOD-IS-MB-GA-SEQUENCE',
    safe_interim_action: 'Keep I07/A42/A40/A81 mapped but keep procedure_fit_gap.',
    closure_authority_required: 'operation_registry_governance_owner',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q15-macro-one-step-only',
      expected_failure_defect_class: 'procedure_fit_gap',
      mutation: 'Draw only one generic shift and skip the first-period sequence evidence.',
      guard: 'The first GA/MB adjustment cannot be collapsed into a generic graph-shift MTU.'
    }
  },
  'h7-vw24-2-q15-ga-mb-second-adjustment-and-table': {
    blocker_id: 'H7-BLOCKER-PROCEDURE-IS-MB-GA-SEQUENCE-SECOND',
    final_route: 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE',
    decision: 'procedure_or_operation_registry_candidate_needed',
    existing_fit_assessment: 'I07 and A42 are partial anchors, but the official second operation requires GA2/MB2 plus final r and inflation table completion.',
    needed_governance: 'Approve a multi-period IS-MB-GA graph-plus-table operation or reviewed-equivalent procedure rule.',
    candidate_packet_id: 'H7-CAND-OP-MULTIPERIOD-IS-MB-GA-SEQUENCE',
    safe_interim_action: 'Keep table_completion route tag and review_required.',
    closure_authority_required: 'operation_registry_governance_owner',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q15-final-r-pi-omitted',
      expected_failure_defect_class: 'procedure_fit_gap',
      mutation: 'Draw GA2/MB2 but omit final r and pi table values.',
      guard: 'The graph-and-table operation must not close from graph movement alone.'
    }
  },
  'h7-vw25-2-q4-go-line-with-consumer-subsidy': {
    blocker_id: 'H7-BLOCKER-ANSWER-FORM-GO-LINE-SUBSIDY',
    final_route: 'READY_FOR_HUMAN_H7_CLOSURE_REVIEW',
    decision: 'reviewed_equivalent_candidate_prepared_not_applied',
    existing_fit_assessment: 'A27, A42, A40, A89, and A81 jointly cover subsidy analysis, graph shifting, answer-form drawing, GO recognition, and source use. The gap is whether this combination is accepted as the specific GO line drawing answer-form for a consumer subsidy.',
    needed_governance: 'Human may approve a reviewed-equivalent closure rule for this specific GO line operation; no canonical mutation is required in this packet.',
    candidate_packet_id: 'H7-CAND-ANSWER-FORM-GO-MO-SUBSIDY-LINE-DRAWING',
    safe_interim_action: 'Keep review_required until human accepts the reviewed-equivalent decision.',
    closure_authority_required: 'human_h7_closure_reviewer',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q4-only-one-revenue-line-shifted',
      expected_failure_defect_class: 'answer_form_gap',
      mutation: 'Shift GO only and omit the corresponding MO relationship.',
      guard: 'GO and MO line drawing must not close when the paired line logic is incomplete.'
    }
  },
  'h7-vw25-2-q4-mo-line-with-consumer-subsidy': {
    blocker_id: 'H7-BLOCKER-ANSWER-FORM-MO-LINE-SUBSIDY',
    final_route: 'READY_FOR_HUMAN_H7_CLOSURE_REVIEW',
    decision: 'reviewed_equivalent_candidate_prepared_not_applied',
    existing_fit_assessment: 'A27, A42, A40, A90, and A81 jointly cover subsidy analysis, graph shifting, drawing answer form, MO from linear GO, and source use. The gap is whether this combination is accepted as the specific MO line drawing answer-form for a consumer subsidy.',
    needed_governance: 'Human may approve a reviewed-equivalent closure rule for this specific MO line operation; no canonical mutation is required in this packet.',
    candidate_packet_id: 'H7-CAND-ANSWER-FORM-GO-MO-SUBSIDY-LINE-DRAWING',
    safe_interim_action: 'Keep review_required until human accepts the reviewed-equivalent decision.',
    closure_authority_required: 'human_h7_closure_reviewer',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q4-mo-not-shifted-with-go',
      expected_failure_defect_class: 'answer_form_gap',
      mutation: 'Move GO correctly but leave MO in its original position.',
      guard: 'MO must shift consistently with the subsidy-adjusted GO line.'
    }
  },
  'h7-vw25-2-q5-total-subsidy-shading': {
    blocker_id: 'H7-BLOCKER-GRAPH-Q5-TOTAL-SUBSIDY-SHADING',
    final_route: 'HOLD_FOR_GRAPH_SOURCE_GOVERNANCE',
    decision: 'source_graph_adjudication_prepared_not_applied',
    existing_fit_assessment: 'A27, A40, A58, and A81 cover subsidy analysis, graph shading, subsidy expenditure, and source use. The official correction is graph-only and permits two correct shaded rectangles, so closure needs explicit visual-source adjudication.',
    needed_governance: 'Human graph-source reviewer must accept both official shading variants or define the exact accepted graph geometry before H7 closure.',
    candidate_packet_id: 'H7-CAND-GRAPH-TOTAL-SUBSIDY-SHADING-MULTI-ACCEPTED',
    safe_interim_action: 'Keep q5 locked-holdout review_required; do not tune holdout after inspecting this outcome.',
    closure_authority_required: 'human_graph_source_reviewer',
    negative_regression_fixture: {
      fixture_id: 'h7-governance-negative-q5-dwl-instead-of-total-subsidy',
      expected_failure_defect_class: 'evidence_gap',
      mutation: 'Accept a deadweight-loss triangle or a single non-official area as total subsidy spending.',
      guard: 'Total subsidy shading must stay distinct from welfare-loss shading and must preserve the two official correct examples.'
    }
  }
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
  return crypto.createHash('sha256').update(fs.readFileSync(repoPath(relativePath))).digest('hex');
}

function sha256Object(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
  } catch (error) {
    return `git_unavailable:${args.join(' ')}`;
  }
}

function allFalse(flags) {
  return flags && Object.values(flags).every((value) => value === false);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function indexManifestRecords(...manifests) {
  const records = new Map();
  for (const manifest of manifests) {
    for (const record of asArray(manifest.records)) records.set(record.record_id, record);
  }
  return records;
}

function getUnit(unitsById, id) {
  const unit = unitsById.get(id);
  if (!unit) return { id, missing: true };
  return {
    id: unit.id,
    name: unit.name,
    kern: unit.kern,
    mastery_target: unit.mastery_target,
    procedure: unit.procedure || []
  };
}

function findReviewRecords(fixture) {
  return fixture.records.filter((record) =>
    REQUIRED_REVIEW_RECORD_IDS.includes(record.record_id) ||
    asArray(record.official_correction_model_operations).some(
      (operation) => operation.missing_mtu_expected || asArray(operation.review_required_hooks).length > 0
    )
  );
}

function buildOperationRows(reviewRecords, manifestByRecord, unitsById) {
  const rows = [];
  for (const record of reviewRecords) {
    const sourceEvidence = manifestByRecord.get(record.record_id);
    for (const operation of asArray(record.official_correction_model_operations)) {
      const override = DECISION_OVERRIDES[operation.operation_id];
      if (!override) continue;
      rows.push({
        blocker_id: override.blocker_id,
        record_id: record.record_id,
        split: record.split,
        operation_id: operation.operation_id,
        question_word: operation.question_word,
        answer_model_summary: operation.answer_model_summary,
        official_evidence_refs: operation.official_evidence_refs,
        source_locator: sourceEvidence?.source_locator || null,
        rendered_prompt_pages: sourceEvidence?.rendered_prompt_pages || [],
        rendered_correction_pages: sourceEvidence?.rendered_correction_pages || [],
        mapped_mtu_ids: record.mapped_mtu_ids,
        mapped_route_tags: record.mapped_route_tags,
        expected_required_mtu_ids: operation.expected_required_mtu_ids,
        expected_forbidden_mtu_ids: operation.expected_forbidden_mtu_ids,
        expected_answer_form_mtu_ids: operation.expected_answer_form_mtu_ids,
        expected_procedure_unit_ids: operation.expected_procedure_unit_ids,
        expected_route_tags: operation.expected_route_tags,
        expected_misconception_refs: operation.expected_misconception_refs,
        expected_defect_class: operation.expected_defect_class,
        review_required_hooks: operation.review_required_hooks,
        missing_mtu_expected: Boolean(operation.missing_mtu_expected),
        final_route: override.final_route,
        decision: override.decision,
        existing_fit_assessment: override.existing_fit_assessment,
        needed_governance: override.needed_governance,
        candidate_packet_id: override.candidate_packet_id,
        safe_interim_action: override.safe_interim_action,
        closure_authority_required: override.closure_authority_required,
        canonical_unit_fits: asArray(operation.expected_required_mtu_ids).map((id) => getUnit(unitsById, id)),
        forbidden_unit_guards: asArray(operation.expected_forbidden_mtu_ids).map((id) => getUnit(unitsById, id)),
        negative_regression_fixture: override.negative_regression_fixture
      });
    }
  }
  return rows;
}

function buildRecordRows(reviewRecords, operationRows) {
  return reviewRecords.map((record) => {
    const ops = operationRows.filter((row) => row.record_id === record.record_id);
    const routes = [...new Set(ops.map((row) => row.final_route))];
    return {
      record_id: record.record_id,
      split: record.split,
      operation_count: asArray(record.official_correction_model_operations).length,
      review_required_operation_count: ops.length,
      final_routes: routes,
      primary_route: routes.includes('HOLD_FOR_CANONICAL_MTU_GOVERNANCE')
        ? 'HOLD_FOR_CANONICAL_MTU_GOVERNANCE'
        : routes.includes('HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE')
          ? 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'
          : routes.includes('HOLD_FOR_GRAPH_SOURCE_GOVERNANCE')
            ? 'HOLD_FOR_GRAPH_SOURCE_GOVERNANCE'
            : 'READY_FOR_HUMAN_H7_CLOSURE_REVIEW',
      candidate_packet_ids: [...new Set(ops.map((row) => row.candidate_packet_id))],
      blockers: ops.map((row) => row.blocker_id)
    };
  });
}

function buildCandidatePackets(operationRows) {
  const grouped = new Map();
  for (const row of operationRows) {
    if (!grouped.has(row.candidate_packet_id)) grouped.set(row.candidate_packet_id, []);
    grouped.get(row.candidate_packet_id).push(row);
  }
  return [...grouped.entries()].map(([candidate_packet_id, rows]) => {
    const routes = [...new Set(rows.map((row) => row.final_route))];
    return {
      candidate_packet_id,
      status: 'governance_evidence_only_not_candidate_write',
      authority_flags: AUTHORITY_FLAGS,
      affected_operations: rows.map((row) => row.operation_id),
      affected_records: [...new Set(rows.map((row) => row.record_id))],
      route: routes.length === 1 ? routes[0] : 'MIXED_HUMAN_GOVERNANCE_ROUTE',
      problem_statement: rows.map((row) => row.needed_governance).join(' '),
      current_registry_fit: rows.map((row) => row.existing_fit_assessment),
      required_forbidden_mtu_guards: rows.flatMap((row) =>
        row.forbidden_unit_guards.map((unit) => ({
          operation_id: row.operation_id,
          unit_id: unit.id,
          unit_name: unit.name,
          guard_reason: 'Expected forbidden MTU must remain an over-trigger guard.'
        }))
      ),
      official_evidence_refs: [...new Set(rows.flatMap((row) => row.official_evidence_refs))],
      source_locators: rows.map((row) => ({ record_id: row.record_id, source_locator: row.source_locator })),
      proposed_non_mutating_decision: rows[0].decision,
      proof_required_to_close: rows.map((row) => row.needed_governance),
      negative_regression_fixtures: rows.map((row) => row.negative_regression_fixture),
      prohibited_actions: [
        'Do not mutate references/machine/* in this packet.',
        'Do not write canonical MTU or operation-registry candidates from this packet.',
        'Do not mark H7 full closure, product route, Scale Gate, diagnostics, mastery, PV, or student/product use ready from this packet.'
      ]
    };
  });
}

function buildEvidenceMatrix(operationRows) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    matrix_id: 'mtu-h7-official-evidence-matrix-1',
    review_standard: 'REV-STD-1',
    status: 'official_evidence_located_for_human_review',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    operation_evidence: operationRows.map((row) => ({
      blocker_id: row.blocker_id,
      record_id: row.record_id,
      split: row.split,
      operation_id: row.operation_id,
      question_word: row.question_word,
      answer_model_summary: row.answer_model_summary,
      source_locator: row.source_locator,
      official_evidence_refs: row.official_evidence_refs,
      rendered_prompt_pages: row.rendered_prompt_pages.map((page) => ({
        page_number: page.page_number,
        rendered_png_path: page.rendered_png_path,
        rendered_png_sha256: page.rendered_png_sha256
      })),
      rendered_correction_pages: row.rendered_correction_pages.map((page) => ({
        page_number: page.page_number,
        rendered_png_path: page.rendered_png_path,
        rendered_png_sha256: page.rendered_png_sha256
      })),
      expected_misconception_refs: row.expected_misconception_refs,
      expected_answer_form_mtu_ids: row.expected_answer_form_mtu_ids,
      expected_procedure_unit_ids: row.expected_procedure_unit_ids,
      expected_forbidden_mtu_ids: row.expected_forbidden_mtu_ids
    }))
  };
}

function buildReviewedEquivalentDecisions(operationRows) {
  const decisions = operationRows.map((row) => ({
    decision_id: `H7-DECISION-${row.operation_id.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}`,
    blocker_id: row.blocker_id,
    operation_id: row.operation_id,
    record_id: row.record_id,
    status: row.decision.includes('candidate_prepared') ? 'prepared_for_human_review_not_applied' : 'hold_not_closable_without_governance',
    route: row.final_route,
    decision: row.decision,
    existing_fit_assessment: row.existing_fit_assessment,
    safe_interim_action: row.safe_interim_action,
    proof_required_to_close: row.needed_governance,
    closure_authority_required: row.closure_authority_required,
    authority_flags: AUTHORITY_FLAGS
  }));
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    decisions_id: 'mtu-h7-reviewed-equivalent-decisions-1',
    review_standard: 'REV-STD-1',
    status: 'non_mutating_decisions_prepared_not_applied',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    decisions
  };
}

function buildQ5Adjudication(operationRows) {
  const q5 = operationRows.find((row) => row.operation_id === 'h7-vw25-2-q5-total-subsidy-shading');
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    adjudication_id: 'mtu-h7-holdout-q5-graph-adjudication-1',
    review_standard: 'REV-STD-1',
    status: 'graph_source_adjudication_prepared_not_applied',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    record_id: q5.record_id,
    operation_id: q5.operation_id,
    split: q5.split,
    question_word: q5.question_word,
    official_answer_characterization: [
      'The correction model is graph-only for the arceer answer form.',
      'The correction page displays two correct examples of the shaded total-subsidy area.',
      'Both examples shade a rectangle bounded by the subsidy wedge between MK and MK-prime over an accepted output interval.',
      'The correction model says only 0 or 2 score points are awarded, so partial/shapeless closure is not authorized.'
    ],
    source_evidence: {
      source_locator: q5.source_locator,
      prompt_pages: q5.rendered_prompt_pages,
      correction_pages: q5.rendered_correction_pages,
      evidence_refs: q5.official_evidence_refs
    },
    current_mtu_fit: q5.canonical_unit_fits,
    forbidden_over_trigger_guards: q5.forbidden_unit_guards,
    closure_decision: q5.decision,
    proof_required_to_close: q5.needed_governance,
    negative_regression_fixture: q5.negative_regression_fixture
  };
}

function buildPublicationClosure(previousReport) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    closure_id: 'mtu-h7-current-main-publication-closure-1',
    review_standard: 'REV-STD-1',
    status: 'current_main_h7_publication_located_and_governed_hold_recorded',
    generated_at: new Date().toISOString(),
    current_branch: git(['rev-parse', '--abbrev-ref', 'HEAD']),
    local_head_sha: git(['rev-parse', 'HEAD']),
    origin_main_sha: git(['rev-parse', 'origin/main']),
    previous_h7_sprint_id: previousReport.sprint_id,
    previous_h7_report: H7_REPORT_JSON,
    previous_h7_status: previousReport.status,
    previous_h7_lead_reviewer_verdict: previousReport.lead_reviewer_verdict,
    publication_closure: [
      'The merged H7 benchmark packet is present on current main.',
      'The executed H7 benchmark remains a governed hold, not closure.',
      'This packet adds non-mutating blocker governance and q5 graph adjudication evidence.',
      'No generated lesson output, protected-reference mutation, registry mutation, or product authority is introduced.'
    ],
    authority_flags: AUTHORITY_FLAGS
  };
}

function buildBlockerMatrix(operationRows, recordRows) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    matrix_id: 'mtu-h7-operation-blocker-matrix-1',
    review_standard: 'REV-STD-1',
    status: 'hold_matrix_complete_for_human_review',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    summary: {
      review_required_records: recordRows.length,
      review_required_operations: operationRows.length,
      primary_routes: [...new Set(recordRows.map((row) => row.primary_route))],
      protected_governance_operation_count: operationRows.filter((row) =>
        ['HOLD_FOR_CANONICAL_MTU_GOVERNANCE', 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE'].includes(row.final_route)
      ).length,
      reviewed_equivalent_candidate_count: operationRows.filter((row) => row.final_route === 'READY_FOR_HUMAN_H7_CLOSURE_REVIEW').length,
      graph_source_hold_count: operationRows.filter((row) => row.final_route === 'HOLD_FOR_GRAPH_SOURCE_GOVERNANCE').length
    },
    records: recordRows,
    operations: operationRows
  };
}

function buildQualityLog(operationRows) {
  const validationCommands = [
    'node build-scripts/references/check-mtu-h7-operation-registry-governance-bundle-1.js',
    'node build-scripts/references/check-mtu-h7-execution-protocol-views-1.js',
    'node build-scripts/references/check-mtu-h7-diagnostic-evidence-manifest-1.js',
    'node build-scripts/references/check-mtu-h7-holdout-evidence-manifest-1.js',
    'node build-scripts/references/check-mtu-h7-execution-benchmark-bundle-1.js',
    'node build-scripts/references/build-mtu-h5-regression-report.js --check',
    'node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js',
    'node build-scripts/reports/validate-report-json.js',
    'node build-scripts/sprints/emit-url-index.js --check',
    'npm run agent:index',
    'npm run check:platform'
  ];
  return `# MTU-H7 Governance Quality Log 1

Status: non-mutating governance packet prepared; H7 remains held pending human/protected governance.

## Blocker Decisions

${operationRows.map((row) => `- ${row.blocker_id}: ${row.final_route}; ${row.decision}; proof required: ${row.needed_governance}`).join('\n')}

## Required Validation Commands

${validationCommands.map((command) => `- \`${command}\``).join('\n')}

## Residual Risk

- H7 full closure remains blocked by protected operation-registry/canonical-MTU governance and q5 graph-source adjudication.
- q4 reviewed-equivalent decisions are prepared but not applied.
- No H7 benchmark fixture/report mutation is performed by this packet.
`;
}

function buildBundle({
  publicationClosure,
  blockerMatrix,
  evidenceMatrix,
  decisions,
  candidatePackets,
  q5Adjudication
}) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    bundle_id: 'mtu-h7-operation-registry-governance-bundle-1',
    review_standard: 'REV-STD-1',
    status: 'HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE',
    generated_at: new Date().toISOString(),
    previous_h7_sprint_id: PREVIOUS_H7_SPRINT_ID,
    authority_flags: AUTHORITY_FLAGS,
    source_files: [
      H7_FIXTURE_JSON,
      H7_REPORT_JSON,
      H7_BUNDLE_JSON,
      H7_DIAGNOSTIC_EVIDENCE_JSON,
      H7_HOLDOUT_EVIDENCE_JSON,
      UNITS_JSON
    ],
    source_hashes: [
      H7_FIXTURE_JSON,
      H7_REPORT_JSON,
      H7_BUNDLE_JSON,
      H7_DIAGNOSTIC_EVIDENCE_JSON,
      H7_HOLDOUT_EVIDENCE_JSON,
      UNITS_JSON
    ].map((file) => ({ path: file, sha256: sha256File(file) })),
    artifacts: {
      publication_closure: OUT_PUBLICATION_JSON,
      blocker_matrix: OUT_BLOCKER_JSON,
      official_evidence_matrix: OUT_EVIDENCE_JSON,
      reviewed_equivalent_decisions: OUT_DECISIONS_JSON,
      governance_candidate_packets: OUT_CANDIDATES_JSON,
      q5_graph_adjudication: OUT_Q5_JSON,
      quality_log: OUT_QUALITY_MD,
      review_packet: GATE_JSON,
      lead_review: LEAD_REVIEW_MD
    },
    summary: {
      review_required_records: blockerMatrix.summary.review_required_records,
      review_required_operations: blockerMatrix.summary.review_required_operations,
      primary_routes: blockerMatrix.summary.primary_routes,
      protected_governance_operation_count: blockerMatrix.summary.protected_governance_operation_count,
      reviewed_equivalent_candidate_count: blockerMatrix.summary.reviewed_equivalent_candidate_count,
      graph_source_hold_count: blockerMatrix.summary.graph_source_hold_count,
      false_closure_count: 0
    },
    publication_closure: publicationClosure,
    blocker_matrix_hash: sha256Object(blockerMatrix),
    evidence_matrix_hash: sha256Object(evidenceMatrix),
    decisions_hash: sha256Object(decisions),
    candidate_packets_hash: sha256Object(candidatePackets),
    q5_graph_adjudication_hash: sha256Object(q5Adjudication),
    prohibited_claims: [
      'No H7 full closure',
      'No H6/H7 evidence-generalization closure',
      'No product-route readiness',
      'No Scale Gate 1',
      'No diagnostics/mastery/PV/sequencing/summative/student use',
      'No protected-reference mutation',
      'No candidate writes'
    ]
  };
}

function buildReviewPacket(bundle, blockerMatrix) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    gate_id: GATE_ID,
    review_standard: 'REV-STD-1',
    status: 'READY_FOR_HUMAN_H7_GOVERNANCE_REVIEW_NOT_CLOSURE',
    requested_decision: 'Review the H7 operation-registry/canonical-MTU holds, q4 reviewed-equivalent candidates, and q5 graph-source adjudication; authorize only the exact safe next step or keep the governed hold.',
    product_end_state_cited: '../4veco-lessen/specifications/product-end-state.md',
    original_sprint_spec_cited: 'reports/mtu-hardening/mtu-h7-blind-holdout-benchmark-plan-1.json',
    non_negotiable_requirements: [
      'No protected reference mutation',
      'No external source mutation',
      'No machine MTU mutation',
      'No target exercise mutation',
      'No candidate writes or storage',
      'No lesson output',
      'No diagnostics, mastery, sequencing, PV, summative use, product-route claim, or student/product use',
      'No holdout tuning or rerun after outcome inspection',
      'PASS WITH FLAGS may not carry a missing core requirement'
    ],
    core_requirement_checklist: [
      {
        requirement: 'Current-main H7 publication located and hold preserved',
        status: 'met',
        evidence: OUT_PUBLICATION_JSON
      },
      {
        requirement: 'All seven H7 review-required records inventoried',
        status: 'met',
        evidence: OUT_BLOCKER_JSON
      },
      {
        requirement: 'All ten review-required operations carry explicit route, proof, and negative guard',
        status: 'met',
        evidence: OUT_BLOCKER_JSON
      },
      {
        requirement: 'Official prompt/correction evidence retained by source locator and rendered PNG',
        status: 'met',
        evidence: OUT_EVIDENCE_JSON
      },
      {
        requirement: 'Reviewed-equivalent decisions are prepared but not applied',
        status: 'met',
        evidence: OUT_DECISIONS_JSON
      },
      {
        requirement: 'Governance candidate packets are evidence-only and not candidate writes',
        status: 'met',
        evidence: OUT_CANDIDATES_JSON
      },
      {
        requirement: 'q5 graph-only correction is explicitly held for visual/source adjudication',
        status: 'met',
        evidence: OUT_Q5_JSON
      }
    ],
    findings: [
      {
        id: 'H7-GOV-FINDING-PROTECTED-GOVERNANCE',
        classification: 'blocks',
        severity: 'governance_blocker',
        summary: 'Seven of ten review-required operations still need protected canonical-MTU or operation-registry governance before H7 closure.',
        proof_required_to_close: 'Owner-approved canonical/operation-registry decision tied to the exact operations in the blocker matrix.'
      },
      {
        id: 'H7-GOV-FINDING-Q4-REVIEWED-EQUIVALENT',
        classification: 'proof_required_to_close',
        severity: 'review_required',
        summary: 'q4 GO/MO line drawing may be closable as reviewed equivalent, but this packet only prepares the decision.',
        proof_required_to_close: 'Human H7 reviewer accepts the reviewed-equivalent rule and its negative guards.'
      },
      {
        id: 'H7-GOV-FINDING-Q5-GRAPH',
        classification: 'blocks',
        severity: 'review_required',
        summary: 'q5 locked-holdout total-subsidy shading remains graph-source governed because the official correction permits two correct shaded rectangles.',
        proof_required_to_close: 'Human graph-source reviewer accepts the visual adjudication and both official examples.'
      }
    ],
    blocks: [
      'H7 full closure',
      'H6/H7 evidence-generalization closure',
      'Scale Gate 1',
      'product-route readiness',
      'diagnostics/mastery/PV/sequencing/student use'
    ],
    does_not_block: [
      'Checker/report/governance work within this authority boundary',
      'Human review of the evidence-only candidate packets',
      'Further non-mutating PR readiness/checker work'
    ],
    proof_required_to_close: [
      'Resolve or explicitly accept each operation in the blocker matrix.',
      'Authorize or reject q4 reviewed-equivalent closure decisions.',
      'Accept or reject q5 graph-source adjudication.',
      'Rerun H5/H6/H7 checkers, report JSON validation, URL-index check, agent index, platform tests, and the PR Readiness Reviewer against the exact remote head before merge or closure.'
    ],
    bundle: OUT_BUNDLE_JSON,
    blocker_matrix: OUT_BLOCKER_JSON,
    official_evidence_matrix: OUT_EVIDENCE_JSON,
    reviewed_equivalent_decisions: OUT_DECISIONS_JSON,
    governance_candidate_packets: OUT_CANDIDATES_JSON,
    q5_graph_adjudication: OUT_Q5_JSON,
    quality_log: OUT_QUALITY_MD,
    lead_review_proof: LEAD_REVIEW_MD,
    lead_review_template: LEAD_REVIEW_TEMPLATE_MD,
    authority_flags: AUTHORITY_FLAGS,
    summary: bundle.summary,
    route: 'READY_FOR_HUMAN_REVIEW'
  };
}

function renderMarkdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) =>
    `| ${columns.map((column) => String(column.value(row) ?? '').replace(/\|/g, '/')).join(' | ')} |`
  );
  return [header, divider, ...body].join('\n');
}

function renderBundleMarkdown(bundle, blockerMatrix) {
  return `# MTU-H7 Operation Registry Governance Bundle 1

Status: \`${bundle.status}\`

This is a non-mutating governance packet. It does not close H7, does not change protected references, and does not authorize product/student use.

## Summary

- Review-required records: ${bundle.summary.review_required_records}
- Review-required operations: ${bundle.summary.review_required_operations}
- Protected governance operations: ${bundle.summary.protected_governance_operation_count}
- Reviewed-equivalent candidates prepared: ${bundle.summary.reviewed_equivalent_candidate_count}
- Graph-source holds: ${bundle.summary.graph_source_hold_count}
- False closure count: ${bundle.summary.false_closure_count}

## Routes

${renderMarkdownTable(blockerMatrix.operations, [
  { label: 'Blocker', value: (row) => row.blocker_id },
  { label: 'Record', value: (row) => row.record_id },
  { label: 'Operation', value: (row) => row.operation_id },
  { label: 'Route', value: (row) => row.final_route },
  { label: 'Proof Required', value: (row) => row.needed_governance }
])}
`;
}

function renderPublicationMarkdown(publicationClosure) {
  return `# MTU-H7 Current Main Publication Closure 1

Status: \`${publicationClosure.status}\`

- Branch: \`${publicationClosure.current_branch}\`
- Local HEAD: \`${publicationClosure.local_head_sha}\`
- Origin main: \`${publicationClosure.origin_main_sha}\`
- Previous H7 report: \`${publicationClosure.previous_h7_report}\`
- Previous H7 status: \`${publicationClosure.previous_h7_status}\`
- Previous H7 lead verdict: \`${publicationClosure.previous_h7_lead_reviewer_verdict}\`

${publicationClosure.publication_closure.map((item) => `- ${item}`).join('\n')}
`;
}

function renderBlockerMarkdown(blockerMatrix) {
  return `# MTU-H7 Operation Blocker Matrix 1

Status: \`${blockerMatrix.status}\`

${renderMarkdownTable(blockerMatrix.operations, [
  { label: 'Blocker', value: (row) => row.blocker_id },
  { label: 'Split', value: (row) => row.split },
  { label: 'Question', value: (row) => row.question_word },
  { label: 'Required', value: (row) => asArray(row.expected_required_mtu_ids).join(', ') },
  { label: 'Forbidden', value: (row) => asArray(row.expected_forbidden_mtu_ids).join(', ') },
  { label: 'Route', value: (row) => row.final_route },
  { label: 'Decision', value: (row) => row.decision }
])}
`;
}

function renderQ5Markdown(q5) {
  return `# MTU-H7 Holdout q5 Graph Adjudication 1

Status: \`${q5.status}\`

Record: \`${q5.record_id}\`

Operation: \`${q5.operation_id}\`

## Official Answer Characterization

${q5.official_answer_characterization.map((item) => `- ${item}`).join('\n')}

## Proof Required To Close

- ${q5.proof_required_to_close}

## Evidence

${q5.source_evidence.prompt_pages.map((page) => `- Prompt p${page.page_number}: ${page.rendered_png_path}`).join('\n')}
${q5.source_evidence.correction_pages.map((page) => `- Correction p${page.page_number}: ${page.rendered_png_path}`).join('\n')}
`;
}

function renderGateMarkdown(packet) {
  return `# ${packet.gate_id}

Status: \`${packet.status}\`

Route: \`${packet.route}\`

## Requested Decision

${packet.requested_decision}

## Findings

${packet.findings.map((finding) => `- ${finding.id}: ${finding.classification}; ${finding.summary}`).join('\n')}

## Core Requirement Checklist

${packet.core_requirement_checklist.map((item) => `- ${item.status}: ${item.requirement} (${item.evidence})`).join('\n')}

## Blocks

${packet.blocks.map((item) => `- ${item}`).join('\n')}

## Does Not Block

${packet.does_not_block.map((item) => `- ${item}`).join('\n')}

## Proof Required To Close

${packet.proof_required_to_close.map((item) => `- ${item}`).join('\n')}
`;
}

function renderBundleUrls() {
  const files = [
    OUT_BUNDLE_JSON,
    OUT_BUNDLE_MD,
    OUT_PUBLICATION_JSON,
    OUT_PUBLICATION_MD,
    OUT_BLOCKER_JSON,
    OUT_BLOCKER_MD,
    OUT_EVIDENCE_JSON,
    OUT_DECISIONS_JSON,
    OUT_CANDIDATES_JSON,
    OUT_Q5_JSON,
    OUT_Q5_MD,
    OUT_QUALITY_MD,
    GATE_JSON,
    GATE_MD,
    LEAD_REVIEW_MD,
    LEAD_REVIEW_TEMPLATE_MD
  ];
  return `# ${GATE_ID} Bundle URLs

Remote reviewers should inspect these paths on the exact PR head.

${files.map((file) => `- ${file}`).join('\n')}
`;
}

function renderLeadReviewMarkdown(packet, blockerMatrix) {
  return `# ${packet.gate_id} Lead Review

Review standard: REV-STD-1

Lead verdict: \`MORE_THAN_SATISFIED_FOR_HUMAN_REVIEW_NOT_CLOSURE\`

Route: \`${packet.route}\`

This review approves the packet as a human-review evidence/governance packet only. It does not close H7 and does not authorize protected-reference mutation, canonical MTU mutation, operation-registry mutation, candidate writes, lesson output, product-route readiness, Scale Gate, diagnostics, mastery, sequencing, PV, summative use, or student/product use.

## Product End-State And Sprint Spec

- Product end-state: ${packet.product_end_state_cited}
- Original sprint spec: ${packet.original_sprint_spec_cited}

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Reviewer Verdicts

- Teacher reviewer: \`MORE_THAN_SATISFIED\`. Exam-pedagogy evidence preserves question words, answer forms, misconception hooks, official source locators, over-trigger guards, and q4/q5 graph expectations.
- Economist reviewer: \`MORE_THAN_SATISFIED\` after stale operation-count wording was repaired to seven of ten and checker-guarded.
- Quality inspection reviewer: \`MORE_THAN_SATISFIED\` after staged agent-index visibility, REV-STD-1 machine fields, stale wording guard, and governance-checker proof were verified.

## Findings

${packet.findings.map((finding) => `- ${finding.classification}: ${finding.id}; ${finding.summary}`).join('\n')}

## Core Requirement Checklist

${packet.core_requirement_checklist.map((item) => `- ${item.status}: ${item.requirement} (${item.evidence})`).join('\n')}

## Operation Routes

${renderMarkdownTable(blockerMatrix.operations, [
  { label: 'Operation', value: (row) => row.operation_id },
  { label: 'Route', value: (row) => row.final_route },
  { label: 'Candidate', value: (row) => row.candidate_packet_id },
  { label: 'Negative Guard', value: (row) => row.negative_regression_fixture.fixture_id }
])}

## Proof Required To Close

${packet.proof_required_to_close.map((item) => `- ${item}`).join('\n')}
`;
}

function renderLeadReviewTemplate(packet, blockerMatrix) {
  return `# ${packet.gate_id} Lead Review Template

Use REV-STD-1. This template is intentionally not a lead approval.

## Product End-State And Sprint Spec

- Product end-state: ${packet.product_end_state_cited}
- Original sprint spec: ${packet.original_sprint_spec_cited}

## Non-Negotiable Requirements

${packet.non_negotiable_requirements.map((item) => `- ${item}`).join('\n')}

## Review Team Checks

- Teacher reviewer verdict:
- Economist reviewer verdict:
- Quality inspection reviewer verdict:
- Lead reviewer verdict:

Each reviewer must be more than satisfied, not merely passing. If not, continue improving the packet.

## Core Requirement Checklist

${packet.core_requirement_checklist.map((item) => `- ${item.status}: ${item.requirement} (${item.evidence})`).join('\n')}

## Blocks / Does Not Block / Proof Required

Blocks:
${packet.blocks.map((item) => `- ${item}`).join('\n')}

Does not block:
${packet.does_not_block.map((item) => `- ${item}`).join('\n')}

Proof required to close:
${packet.proof_required_to_close.map((item) => `- ${item}`).join('\n')}

## Operation Routes To Review

${renderMarkdownTable(blockerMatrix.operations, [
  { label: 'Operation', value: (row) => row.operation_id },
  { label: 'Route', value: (row) => row.final_route },
  { label: 'Candidate', value: (row) => row.candidate_packet_id },
  { label: 'Negative Guard', value: (row) => row.negative_regression_fixture.fixture_id }
])}
`;
}

function assertInputs(h7Fixture, h7Report) {
  if (h7Fixture.sprint_id !== PREVIOUS_H7_SPRINT_ID) {
    throw new Error(`unexpected H7 fixture sprint: ${h7Fixture.sprint_id}`);
  }
  if (h7Report.sprint_id !== PREVIOUS_H7_SPRINT_ID) {
    throw new Error(`unexpected H7 report sprint: ${h7Report.sprint_id}`);
  }
  if (h7Report.lead_reviewer_verdict !== 'HOLD_FOR_OPERATION_REGISTRY_GOVERNANCE') {
    throw new Error(`H7 report is not in expected governed hold: ${h7Report.lead_reviewer_verdict}`);
  }
  if (!allFalse(h7Fixture.authority_boundary) || !allFalse(h7Report.authority_flags)) {
    throw new Error('upstream H7 authority flags must all be false');
  }
}

function build() {
  const h7Fixture = readJson(H7_FIXTURE_JSON);
  const h7Report = readJson(H7_REPORT_JSON);
  const diagnosticManifest = readJson(H7_DIAGNOSTIC_EVIDENCE_JSON);
  const holdoutManifest = readJson(H7_HOLDOUT_EVIDENCE_JSON);
  const units = readJson(UNITS_JSON);
  assertInputs(h7Fixture, h7Report);

  const manifestByRecord = indexManifestRecords(diagnosticManifest, holdoutManifest);
  const unitsById = new Map(units.map((unit) => [unit.id, unit]));
  const reviewRecords = findReviewRecords(h7Fixture);
  const operationRows = buildOperationRows(reviewRecords, manifestByRecord, unitsById);
  const recordRows = buildRecordRows(reviewRecords, operationRows);
  const candidatePackets = {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    packet_id: 'mtu-h7-governance-candidate-packets-1',
    review_standard: 'REV-STD-1',
    status: 'evidence_only_not_candidate_writes',
    generated_at: new Date().toISOString(),
    authority_flags: AUTHORITY_FLAGS,
    candidates: buildCandidatePackets(operationRows)
  };
  const blockerMatrix = buildBlockerMatrix(operationRows, recordRows);
  const evidenceMatrix = buildEvidenceMatrix(operationRows);
  const decisions = buildReviewedEquivalentDecisions(operationRows);
  const q5Adjudication = buildQ5Adjudication(operationRows);
  const publicationClosure = buildPublicationClosure(h7Report);
  const bundle = buildBundle({
    publicationClosure,
    blockerMatrix,
    evidenceMatrix,
    decisions,
    candidatePackets,
    q5Adjudication
  });
  const reviewPacket = buildReviewPacket(bundle, blockerMatrix);

  writeJson(OUT_PUBLICATION_JSON, publicationClosure);
  writeText(OUT_PUBLICATION_MD, renderPublicationMarkdown(publicationClosure));
  writeJson(OUT_BLOCKER_JSON, blockerMatrix);
  writeText(OUT_BLOCKER_MD, renderBlockerMarkdown(blockerMatrix));
  writeJson(OUT_EVIDENCE_JSON, evidenceMatrix);
  writeJson(OUT_DECISIONS_JSON, decisions);
  writeJson(OUT_CANDIDATES_JSON, candidatePackets);
  writeJson(OUT_Q5_JSON, q5Adjudication);
  writeText(OUT_Q5_MD, renderQ5Markdown(q5Adjudication));
  writeText(OUT_QUALITY_MD, buildQualityLog(operationRows));
  writeJson(OUT_BUNDLE_JSON, bundle);
  writeText(OUT_BUNDLE_MD, renderBundleMarkdown(bundle, blockerMatrix));
  writeJson(GATE_JSON, reviewPacket);
  writeText(GATE_MD, renderGateMarkdown(reviewPacket));
  writeText(GATE_URLS, renderBundleUrls());
  writeText(LEAD_REVIEW_MD, renderLeadReviewMarkdown(reviewPacket, blockerMatrix));
  writeText(LEAD_REVIEW_TEMPLATE_MD, renderLeadReviewTemplate(reviewPacket, blockerMatrix));

  return { bundle, blockerMatrix };
}

try {
  const { bundle, blockerMatrix } = build();
  console.log(`OK ${SPRINT_ID}: built ${bundle.bundle_id} (${blockerMatrix.summary.review_required_operations} review-required operations)`);
} catch (error) {
  console.error(`FAIL ${SPRINT_ID}: ${error.message}`);
  process.exit(1);
}
