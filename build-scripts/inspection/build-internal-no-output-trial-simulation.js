#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const {
  SELECTED_TRIAL_CONTRACT_DECISION: ACCEPTED_TRIAL_CONTRACT_DECISION,
  TRIAL_BLOCKED_AUTHORITY,
} = require("./build-internal-overlay-trial-contract.js");
const {
  REV_STD_FINDING_CLASSIFICATIONS,
} = require("./build-international-overlay-architecture.js");
const { StopError } = require("./build-international-quality-standards.js");

const ACCESS_DATE = "2026-06-26";
const SPRINT_ID = "GOAL-IQS-INTERNAL-NO-OUTPUT-TRIAL-SIMULATION-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_TRIAL_CONTRACT_DECISION_SOURCE = "reports/inspection-standards/internal-overlay-trial-contract-decision.md";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";

const SELECTED_SIMULATION_DECISION = "PROCEED_TO_LOCAL_EXPERT_SOURCE_REFRESH_GATE_PLANNING";
const DECISION_OPTIONS = [
  "PROCEED_TO_LOCAL_EXPERT_SOURCE_REFRESH_GATE_PLANNING",
  "REVISE_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION",
  "STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK",
];

const SIMULATION_STATUS_OPTIONS = [
  "blocked_before_any_output",
  "internal_summary_only_no_output_complete",
];

const INPUT_ALLOWLIST = [
  "reports/inspection-standards/england-internal-overlay-trial-contract.json",
  "reports/inspection-standards/flanders-internal-overlay-trial-contract.json",
  "reports/inspection-standards/internal-overlay-trial-contract-decision.json",
  "reports/inspection-standards/internal-overlay-trial-contract-validation.json",
  "reports/inspection-standards/internal-overlay-no-output-trial-trace.json",
  "references/schemas/internal-overlay-trial-contract.schema.v1.json",
];

const POSITIVE_FIXTURES = [
  "references/data/inspection-standards/fixtures/internal-no-output-trial-simulation/positive/england-internal-no-output-trial-simulation.sample.json",
  "references/data/inspection-standards/fixtures/internal-no-output-trial-simulation/positive/flanders-internal-no-output-trial-simulation.sample.json",
];

const NEGATIVE_FIXTURES = [
  ["missing-contract-row.sample.json", "STOP_MISSING_CONTRACT_ROW"],
  ["duplicate-contract-row.sample.json", "STOP_DUPLICATE_CONTRACT_ROW"],
  ["wrong-contract-row.sample.json", "STOP_ROW_LINEAGE_MISMATCH"],
  ["wrong-concept-lineage.sample.json", "STOP_ROW_LINEAGE_MISMATCH"],
  ["missing-transformation-actions.sample.json", "STOP_TRANSFORMATION_ACTIONS_MISMATCH"],
  ["unknown-contract-source.sample.json", "STOP_UNKNOWN_SOURCE_ID"],
  ["localized-output.sample.json", "STOP_LOCALIZED_OUTPUT"],
  ["student-facing-output.sample.json", "STOP_STUDENT_FACING_OUTPUT"],
  ["runtime-execution.sample.json", "STOP_FORBIDDEN_RUNTIME"],
  ["teacher-school-facing-output.sample.json", "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  ["public-output.sample.json", "STOP_PUBLIC_OUTPUT"],
  ["personal-data.sample.json", "STOP_PERSONAL_DATA"],
  ["compliance-claim.sample.json", "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  ["support-accommodation-claim.sample.json", "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  ["product-route-scale-gate.sample.json", "STOP_PRODUCT_OR_SCALE_GATE"],
  ["implicit-discovery.sample.json", "STOP_IMPLICIT_DISCOVERY"],
  ["source-refresh-execution.sample.json", "STOP_SOURCE_REFRESH_EXECUTION"],
  ["closure-source-refresh-executed.sample.json", "STOP_SOURCE_REFRESH_EXECUTION", "CLOSURE_SOURCE_REFRESH_EXECUTED"],
  ["closure-local-expert-substituted.sample.json", "STOP_LOCAL_EXPERT_SUBSTITUTION", "CLOSURE_LOCAL_EXPERT_SUBSTITUTED"],
  ["closure-aqa-approval-claim.sample.json", "STOP_GOVERNANCE_OVERGENERALISATION", "CLOSURE_AQA_APPROVAL_CLAIM"],
  ["closure-ok-compliance-claim.sample.json", "STOP_COMPLIANCE_APPROVAL_CLAIM", "CLOSURE_OK_COMPLIANCE_CLAIM"],
  ["closure-whole-uk-claim.sample.json", "STOP_GOVERNANCE_OVERGENERALISATION", "CLOSURE_WHOLE_UK_CLAIM"],
  ["closure-all-belgium-claim.sample.json", "STOP_GOVERNANCE_OVERGENERALISATION", "CLOSURE_ALL_BELGIUM_CLAIM"],
  ["closure-legal-sufficiency-ready.sample.json", "STOP_COMPLIANCE_APPROVAL_CLAIM", "CLOSURE_LEGAL_SUFFICIENCY_READY"],
  ["closure-support-sufficiency-ready.sample.json", "STOP_SUPPORT_ACCOMMODATION_CLAIM", "CLOSURE_SUPPORT_SUFFICIENCY_READY"],
  ["closure-public-output-ready.sample.json", "STOP_PUBLIC_OUTPUT", "CLOSURE_PUBLIC_OUTPUT_READY"],
  ["decision-overclaim.sample.json", "STOP_DECISION_OVERCLAIM"],
];

const OUTPUT_PATHS = [
  "references/schemas/internal-no-output-trial-simulation.schema.v1.json",
  "reports/inspection-standards/england-internal-no-output-trial-simulation.md",
  "reports/inspection-standards/england-internal-no-output-trial-simulation.json",
  "reports/inspection-standards/flanders-internal-no-output-trial-simulation.md",
  "reports/inspection-standards/flanders-internal-no-output-trial-simulation.json",
  "reports/inspection-standards/internal-no-output-trial-simulation.md",
  "reports/inspection-standards/internal-no-output-trial-simulation.json",
  "reports/inspection-standards/internal-no-output-trial-simulation-validation.md",
  "reports/inspection-standards/internal-no-output-trial-simulation-validation.json",
  "reports/inspection-standards/internal-no-output-trial-simulation-decision.md",
  "reports/inspection-standards/internal-no-output-trial-simulation-decision.json",
  ...POSITIVE_FIXTURES,
  ...NEGATIVE_FIXTURES.map(([file]) => `references/data/inspection-standards/fixtures/internal-no-output-trial-simulation/negative/${file}`),
  ORIGINAL_SPRINT_GATE_SPEC,
];

const SIMULATION_BLOCKED_AUTHORITY = [...new Set([
  ...TRIAL_BLOCKED_AUTHORITY,
  "trial_runtime_execution",
  "localized_simulation_output",
  "simulation_teacher_school_output",
  "simulation_public_output",
  "simulation_evidence_pack_generation",
  "simulation_product_route",
  "simulation_scale_gate",
  "simulation_diagnostics_mastery_pv",
  "simulation_student_product_use",
  "simulation_personal_data_processing",
  "source_refresh_execution",
  "local_expert_substitution",
  "country_edition_from_simulation",
  "localized_assessment_item_generation",
  "school_owned_evidence_satisfaction_claim",
])];

const REVIEW_PACKET_REQUIREMENTS = [
  "Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
  "Cite the accepted internal overlay trial-contract decision and preserve its authority boundaries.",
  "Run only a deterministic internal no-output simulation against the accepted England and Flanders contracts.",
  "Use explicit input and output allowlists only; do not glob directories or scan generated lesson output.",
  "Retain every row's route-local-only status, school-owned evidence need, forbidden inferences, accessibility/support limits, check-surface authority separation, owner next action, and proof required to close.",
  "Do not execute a runtime, refresh sources, substitute local experts, generate localized paragraphs, exercises, answer models, student-facing files, teacher/school-facing output, public output, or evidence packs.",
  "Keep product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, inspection-readiness, support-sufficiency, and accommodation-sufficiency authority blocked.",
  "Add positive and negative validation fixtures for contract-row completeness, source IDs, no-output flags, runtime, forbidden audiences, personal data, claims, integration, source refresh, and decision overclaims.",
  "Classify findings with blocks, does_not_block, and proof_required_to_close.",
  "Do not carry a missing core requirement as PASS WITH FLAGS.",
];

const CORE_REQUIREMENTS = [
  ["accepted_contract_decision_bound", "The simulation is bound to the accepted trial-contract decision and does not reinterpret it as output or runtime authority."],
  ["exact_input_allowlist", "Only accepted trial-contract reports, validation, trace, decision, and schema are read."],
  ["exact_output_allowlist", "Only internal simulation, validation, decision, schema, fixture, and sprint-plan outputs are written."],
  ["deterministic_no_output_simulation", "Simulation rows are deterministic summaries over accepted contract rows and generate no localized educational content."],
  ["row_lineage_complete", "England and Flanders each retain all ten accepted contract rows with row IDs, source IDs, source bindings, transformation actions, and proof required to close."],
  ["blocker_display_retained", "Every row visibly retains route-local-only status, school-owned evidence need, forbidden inferences, accessibility/support limitations, check-surface authority separation, owner next action, and proof required to close."],
  ["no_runtime_or_source_refresh", "The simulation does not execute runtime behavior, source refresh, local expert substitution, or generated lesson-output scanning."],
  ["forbidden_authority_refusals", "Forbidden audiences, output generation, personal-data fields, compliance claims, support/accommodation claims, product routes, Scale Gate, diagnostics/mastery/PV, and decision overclaims fail closed."],
  ["single_decision", "The packet chooses exactly one allowed no-output simulation decision."],
  ["review_gates", "Specialist and final lead review remain required before human review."],
];

const REFUSAL_CASES = [
  [["--localized-output"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--localized-chapter"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--localized-exercise"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--answer-model"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--student-facing"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--teacher"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--school-facing"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--public"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--external"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--country-edition"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--trial-runtime"], "STOP_FORBIDDEN_RUNTIME"],
  [["--execute-trial"], "STOP_FORBIDDEN_RUNTIME"],
  [["--runtime-execution"], "STOP_FORBIDDEN_RUNTIME"],
  [["--source-refresh"], "STOP_SOURCE_REFRESH_EXECUTION"],
  [["--refresh-sources"], "STOP_SOURCE_REFRESH_EXECUTION"],
  [["--local-expert"], "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  [["--product-route"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--scale"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--scale-gate"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--diagnostics"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--mastery"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--pv"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--student"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--personal"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--data-processing"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--legal-sufficiency"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--accreditation"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-ready"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-readiness"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--op0"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--pta"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--summative"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--individual-adjustment"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--reasonable-adjustments"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--support-records"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--all-belgium"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--whole-uk"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--aqa-approval"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--glob"], "STOP_IMPLICIT_DISCOVERY"],
  [["--implicit-source"], "STOP_IMPLICIT_DISCOVERY"],
  [["--scan-generated-lessons"], "STOP_IMPLICIT_DISCOVERY"],
  [["--package"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--ci"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--dashboard"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--quality-ref"], "STOP_FORBIDDEN_INTEGRATION"],
];

function repoPath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function unique(items) {
  return [...new Set(items)];
}

function boundaryFlags() {
  return Object.fromEntries(SIMULATION_BLOCKED_AUTHORITY.map((flag) => [flag, false]));
}

function noOutputFlags() {
  return {
    internal_summary_only: true,
    runtime_execution_performed: false,
    localized_textbook_paragraphs_generated: false,
    localized_exercises_generated: false,
    localized_answer_models_generated: false,
    localized_assessment_items_generated: false,
    student_facing_files_generated: false,
    teacher_school_facing_output_generated: false,
    public_output_generated: false,
    evidence_pack_generated: false,
    generated_lesson_output_scanned: false,
    personal_data_fields_present: false,
    product_route_integration_requested: false,
    scale_gate_integration_requested: false,
    diagnostics_mastery_pv_requested: false,
    automated_source_refresh_executed: false,
    local_expert_substituted: false,
  };
}

function closureDisposition(blockers) {
  return {
    internal_no_output_simulation_complete: true,
    localized_output_generation_ready: false,
    product_route_ready: false,
    scale_gate_ready: false,
    diagnostics_mastery_pv_ready: false,
    school_owned_evidence_still_needed: blockers.includes("school_owned_evidence_still_needed"),
    source_refresh_needed_before_any_output: true,
    local_expert_review_needed_before_any_output: true,
    source_refresh_executed: false,
    local_expert_substituted: false,
    aqa_approval_claim: false,
    ok_compliance_claim: false,
    legal_sufficiency_ready: false,
    support_sufficiency_ready: false,
    public_output_ready: false,
    whole_uk_claim_from_england_only: false,
    all_belgium_claim_from_flanders_only: false,
    next_allowed_step_if_human_approved: SELECTED_SIMULATION_DECISION,
  };
}

function sourcePolicy() {
  return {
    explicit_contract_inputs_only: true,
    input_allowlist: INPUT_ALLOWLIST,
    directory_globbing_allowed: false,
    implicit_source_discovery: false,
    generated_lesson_output_scanning: false,
    source_refresh_executed: false,
    local_expert_substitution: false,
  };
}

function coreChecklist(status = "met_for_internal_no_output_trial_simulation") {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status,
    proof_required_to_close: "Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review.",
  }));
}

function commonFields(reportId, status) {
  return {
    schema_version: 1,
    report_id: reportId,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    access_date: ACCESS_DATE,
    status,
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    accepted_trial_contract_decision: ACCEPTED_TRIAL_CONTRACT_DECISION,
    accepted_trial_contract_decision_source: ACCEPTED_TRIAL_CONTRACT_DECISION_SOURCE,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    roadmap_source: ROADMAP_SOURCE,
    non_negotiable_requirements: REVIEW_PACKET_REQUIREMENTS,
    core_requirement_checklist: coreChecklist(),
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_PATHS,
    output_boundary: boundaryFlags(),
  };
}

function finding(findingText, classification, blocks, doesNotBlock, proofRequired) {
  return {
    finding: findingText,
    classification,
    blocks,
    does_not_block: doesNotBlock,
    proof_required_to_close: proofRequired,
  };
}

function blockerCodes(row) {
  const display = row.blocker_display || {};
  const blockers = [];
  if (row.school_owned_evidence_needed?.still_needed) blockers.push("school_owned_evidence_still_needed");
  if (row.local_expert_needed?.required_before_any_output) blockers.push("local_expert_review_required");
  for (const key of [
    "legal_sufficiency_blocked",
    "support_sufficiency_blocked",
    "school_owned_accommodation_evidence_needed",
    "individual_adjustment_claim_blocked",
    "support_records_personal_data_blocked",
  ]) {
    if (display[key] === true) blockers.push(key);
  }
  return unique(blockers);
}

function simulateRow(row) {
  const blockers = blockerCodes(row);
  const status = blockers.length > 0 ? "blocked_before_any_output" : "internal_summary_only_no_output_complete";
  return {
    simulation_row_id: `${row.row_id}:no-output-simulation`,
    source_contract_row_id: row.row_id,
    jurisdiction_id: row.jurisdiction_id,
    chapter_id: row.chapter_id,
    paragraph_id: row.paragraph_id,
    chapter_paragraph: row.chapter_paragraph,
    concept_id: row.concept_id,
    crosswalk_row_id: row.crosswalk_row_id,
    local_heading: row.local_heading,
    mapping_status: row.mapping_status,
    assessment_status: row.assessment_status,
    source_ids: row.source_ids,
    source_bindings: row.source_bindings,
    transformation_actions: row.transformation_actions,
    simulated_internal_observation: `Summary-only simulation retained ${row.transformation_actions.join(", ")} for ${row.concept_id}; no localized student-facing content was generated.`,
    no_output_result: noOutputFlags(),
    retained_blocker_display: {
      route_local_only_evidence_status: row.blocker_display.route_local_only_evidence_status,
      school_owned_evidence_still_needed: row.blocker_display.school_owned_evidence_still_needed,
      forbidden_inferences: row.blocker_display.forbidden_inferences,
      accessibility_support_limitations: row.blocker_display.accessibility_support_limitations,
      legal_sufficiency_blocked: row.blocker_display.legal_sufficiency_blocked,
      support_sufficiency_blocked: row.blocker_display.support_sufficiency_blocked,
      school_owned_accommodation_evidence_needed: row.blocker_display.school_owned_accommodation_evidence_needed,
      individual_adjustment_claim_blocked: row.blocker_display.individual_adjustment_claim_blocked,
      support_records_personal_data_blocked: row.blocker_display.support_records_personal_data_blocked,
      check_surface_authority_separation: row.blocker_display.check_surface_authority_separation,
      owner_next_action: "Review the internal no-output simulation packet and decide whether to authorize local-expert/source-refresh gate planning only.",
      proof_required_to_close: row.blocker_display.proof_required_to_close,
    },
    blocker_codes: blockers,
    proof_required_to_close: row.proof_required_to_close,
    simulation_disposition: {
      status,
      finding_classification: blockers.length > 0 ? "scale_blocker" : "core_requirement_met",
      blocks: "Any localized output, local compliance claim, source approval claim, assessment-generation claim, support/accommodation sufficiency claim, product-route use, Scale Gate use, diagnostics/mastery/PV, student/product use, or personal-data processing.",
      does_not_block: "Internal no-output simulation review.",
      proof_required_to_close: "Fresh source review, local expert review, school-owned evidence, specialist reviews, final lead PASS, exact-head PR readiness proof, and human authorization before any output or authority step.",
    },
  };
}

function simulationReport(jurisdictionId, contract) {
  const label = contract.jurisdiction_source_binding.jurisdiction_label;
  const rows = contract.contract_rows.map(simulateRow);
  const blockers = unique(rows.flatMap((row) => row.blocker_codes));
  return {
    ...commonFields(`${jurisdictionId}-internal-no-output-trial-simulation`, "complete_internal_no_output_simulation"),
    simulation_id: `${jurisdictionId}-internal-no-output-trial-simulation.v1`,
    simulation_mode: "manual_internal_summary_only",
    source_contract: {
      report_id: contract.report_id,
      contract_id: contract.contract_id,
      source_file: `reports/inspection-standards/${jurisdictionId}-internal-overlay-trial-contract.json`,
      contract_decision: ACCEPTED_TRIAL_CONTRACT_DECISION,
      contract_row_count: contract.contract_rows.length,
    },
    jurisdiction_source_binding: {
      jurisdiction_id: contract.jurisdiction_source_binding.jurisdiction_id,
      jurisdiction_label: label,
      descriptor_id: contract.jurisdiction_source_binding.descriptor_id,
      official_source_ids: contract.jurisdiction_source_binding.official_source_ids,
      source_policy: sourcePolicy(),
    },
    simulation_status_vocabulary: SIMULATION_STATUS_OPTIONS,
    simulation_no_output_enforcement: noOutputFlags(),
    simulation_rows: rows,
    aggregate_blockers: blockers,
    closure_disposition: closureDisposition(blockers),
    finding_classification: [
      finding(
        `${label} simulation completed as an internal summary-only dry run over accepted contract rows.`,
        "core_requirement_met",
        "Nothing for the internal simulation artifact.",
        "Human review of the simulation packet and a later planning-only gate.",
        "Checker PASS, specialist reviews, final lead PASS, exact-head readiness proof, green CI, and human review."
      ),
      finding(
        `${label} rows retain school-owned evidence, local expert, source-refresh, legal/privacy, support/accommodation, and product authority blockers.`,
        "scale_blocker",
        "Any localized output, source-refresh execution, local-expert substitution, school/public output, product route, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, compliance, approval, inspection-readiness, support-sufficiency, or accommodation-sufficiency claim.",
        "Internal no-output simulation review.",
        "Separate reviewed sprint and explicit owner authorization before any downstream step."
      ),
    ],
  };
}

function combinedSimulation(england, flanders) {
  const rows = [...england.simulation_rows, ...flanders.simulation_rows];
  return {
    ...commonFields("internal-no-output-trial-simulation", "complete_internal_no_output_simulation"),
    simulation_id: "internal-no-output-trial-simulation.v1",
    simulation_mode: "manual_internal_summary_only",
    source_simulation_files: [
      "reports/inspection-standards/england-internal-no-output-trial-simulation.json",
      "reports/inspection-standards/flanders-internal-no-output-trial-simulation.json",
    ],
    row_counts: {
      england: england.simulation_rows.length,
      flanders: flanders.simulation_rows.length,
      total: rows.length,
    },
    no_output_enforcement: noOutputFlags(),
    aggregate_blockers: unique(rows.flatMap((row) => row.blocker_codes)),
    jurisdiction_summaries: [
      {
        jurisdiction_id: "england",
        rows: england.simulation_rows.length,
        blocked_before_any_output: england.simulation_rows.filter((row) => row.simulation_disposition.status === "blocked_before_any_output").length,
        official_source_ids: england.jurisdiction_source_binding.official_source_ids,
      },
      {
        jurisdiction_id: "flanders",
        rows: flanders.simulation_rows.length,
        blocked_before_any_output: flanders.simulation_rows.filter((row) => row.simulation_disposition.status === "blocked_before_any_output").length,
        official_source_ids: flanders.jurisdiction_source_binding.official_source_ids,
      },
    ],
    forbidden_content_assertion: "This simulation intentionally contains no rewritten localized textbook paragraphs, localized exercises, answer models, assessment items, student-facing files, teacher/school-facing output, public output, or evidence packs.",
    finding_classification: [
      finding(
        "The no-output trial simulation is complete for England and Flanders and retains the accepted contract lineage.",
        "core_requirement_met",
        "Nothing for the internal simulation packet.",
        "Human review of the simulation decision.",
        "Generator/checker PASS, focused Jest PASS, specialist reviews, final lead PASS, exact-head PR readiness proof, green CI, and human review."
      ),
      finding(
        "The simulation leaves all downstream output, product, Scale Gate, diagnostics, personal-data, compliance, inspection-readiness, support, accommodation, source-refresh, and local-expert authority blocked.",
        "scale_blocker",
        "All downstream output or authority jumps.",
        "A later planning-only local-expert/source-refresh gate if explicitly approved.",
        "Separate reviewed sprint and explicit owner authorization."
      ),
    ],
  };
}

function validationReport(england, flanders, simulation) {
  return {
    ...commonFields("internal-no-output-trial-simulation-validation", "complete_internal_validation"),
    validation_id: "internal-no-output-trial-simulation-validation.v1",
    schema_file: "references/schemas/internal-no-output-trial-simulation.schema.v1.json",
    simulation_files: simulation.source_simulation_files,
    row_counts: simulation.row_counts,
    schema_strictness: {
      strict_nested_schema: true,
      simulation_row_count_per_jurisdiction: 10,
      closed_nested_definitions: [
        "sourcePolicy",
        "noOutputEnforcement",
        "sourceBinding",
        "retainedBlockerDisplay",
        "simulationDisposition",
        "simulationRow",
        "closureDisposition",
        "findingClassification",
      ],
      exact_no_output_false_flags: true,
      exact_status_vocabulary: SIMULATION_STATUS_OPTIONS,
      exact_decision_tuple: DECISION_OPTIONS,
      checker_enforcement: "The checker enforces contract-row lineage, accepted source IDs, no-output flags, refusal fixtures, currentness, and blocked authority false flags.",
    },
    positive_fixtures: POSITIVE_FIXTURES.map((file) => ({ file, expected: "PASS" })),
    negative_fixtures: NEGATIVE_FIXTURES.map(([file, code]) => ({
      file: `references/data/inspection-standards/fixtures/internal-no-output-trial-simulation/negative/${file}`,
      expected_refusal_code: code,
    })),
    finding_classification: [
      finding(
        "Validation covers currentness, row counts, source IDs, source policy, no-output flags, blocker retention, refusal fixtures, and decision boundaries.",
        "core_requirement_met",
        "Nothing for internal simulation validation.",
        "Human review of this simulation packet.",
        "Checker PASS, focused Jest PASS, specialist reviews, final lead PASS, exact-head readiness proof, green CI, and human review."
      ),
      finding(
        "Negative fixtures prove forbidden runtime, source refresh, output, audience, personal-data, claim, integration, and decision-overclaim paths fail closed.",
        "core_requirement_met",
        "Any attempt to bypass the no-output simulation boundary.",
        "Internal no-output simulation review.",
        "Checker fixture output remains PASS."
      ),
    ],
  };
}

function decisionReport(simulation, validation) {
  return {
    ...commonFields("internal-no-output-trial-simulation-decision", "ready_for_specialist_and_final_lead_review"),
    final_internal_no_output_trial_simulation_decision: {
      selected: SELECTED_SIMULATION_DECISION,
      allowed_options: DECISION_OPTIONS,
      decision_selection_count: 1,
      decision_basis: [
        "The accepted England and Flanders contracts can be traversed deterministically without generating localized content.",
        "Every simulated row remains blocked before any output by school-owned evidence, source refresh, local expert, legal/privacy, support/accommodation, and product-authority boundaries.",
        "Validation proves forbidden runtime, output, personal-data, claim, integration, source-refresh, and decision-overclaim paths fail closed.",
      ],
    },
    still_blocked: SIMULATION_BLOCKED_AUTHORITY,
    does_not_authorize: [
      "runtime execution",
      "source refresh execution",
      "local expert substitution",
      "localized chapters",
      "localized exercises",
      "localized answer models",
      "localized assessment items",
      "student-facing files",
      "teacher/school-facing output",
      "public output",
      "evidence packs",
      "country editions",
      "product routes",
      "Scale Gate",
      "diagnostics/mastery/PV",
      "student/product use",
      "personal-data processing",
      "legal/compliance/approval claims",
      "inspection-readiness claims",
      "support/accommodation sufficiency claims",
    ],
    required_next_reviews: [
      "England source/local-expert gate reviewer",
      "Flanders source/local-expert gate reviewer",
      "Teacher/economics reviewer",
      "Legal/privacy reviewer",
      "Accessibility/inclusion reviewer",
      "Dutch quality-inspection/product-boundary reviewer",
      "Final lead reviewer",
    ],
    simulation_summary: {
      validation_status: validation.status,
      row_counts: simulation.row_counts,
      aggregate_blockers: simulation.aggregate_blockers,
    },
    finding_classification: [
      finding(
        "The no-output simulation is ready for specialist and final lead review before human review of a planning-only next step.",
        "core_requirement_met",
        "Nothing in the internal no-output simulation packet.",
        "Only local-expert/source-refresh gate planning if the human owner accepts the decision.",
        "Human owner decision after specialist PASS, final lead PASS, exact-head readiness proof, and green CI."
      ),
      finding(
        "The selected decision does not authorize runtime execution, source refresh execution, local expert substitution, localized output, school/public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, compliance, inspection-readiness, support sufficiency, or accommodation sufficiency.",
        "scale_blocker",
        "All downstream output and authority jumps.",
        "Internal planning-only local-expert/source-refresh gate preparation if separately approved.",
        "Separate future reviewed sprint and human authorization."
      ),
    ],
  };
}

function string() {
  return { type: "string", minLength: 1 };
}

function booleanConst(value) {
  return { const: value };
}

function stringArray() {
  return { type: "array", minItems: 1, items: string() };
}

function exactArray(items) {
  return {
    type: "array",
    minItems: items.length,
    maxItems: items.length,
    prefixItems: items.map((item) => ({ const: item })),
  };
}

function outputBoundarySchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: SIMULATION_BLOCKED_AUTHORITY,
    properties: Object.fromEntries(SIMULATION_BLOCKED_AUTHORITY.map((flag) => [flag, booleanConst(false)])),
  };
}

function noOutputSchema() {
  const flags = noOutputFlags();
  return {
    type: "object",
    additionalProperties: false,
    required: Object.keys(flags),
    properties: Object.fromEntries(Object.entries(flags).map(([key, value]) => [key, booleanConst(value)])),
  };
}

function schemaDocument() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.example/internal-no-output-trial-simulation.schema.v1.json",
    title: "Internal No-Output Trial Simulation",
    description: "Strict internal-only no-output simulation schema. It is not runtime, product-route, school-facing, public, source-refresh, local-expert, or compliance authority.",
    type: "object",
    additionalProperties: false,
    required: [
      "schema_version",
      "report_id",
      "sprint_id",
      "status",
      "internal_only",
      "manual_invocation_only",
      "human_review_required",
      "accepted_trial_contract_decision",
      "product_end_state",
      "original_sprint_gate_spec",
      "core_requirement_checklist",
      "input_allowlist",
      "output_allowlist",
      "output_boundary",
      "simulation_id",
      "simulation_mode",
      "source_contract",
      "jurisdiction_source_binding",
      "simulation_no_output_enforcement",
      "simulation_rows",
      "closure_disposition",
      "finding_classification",
    ],
    properties: {
      schema_version: { const: 1 },
      report_id: string(),
      sprint_id: { const: SPRINT_ID },
      generated_date: string(),
      access_date: string(),
      status: string(),
      internal_only: booleanConst(true),
      manual_invocation_only: booleanConst(true),
      human_review_required: booleanConst(true),
      accepted_trial_contract_decision: { const: ACCEPTED_TRIAL_CONTRACT_DECISION },
      accepted_trial_contract_decision_source: { const: ACCEPTED_TRIAL_CONTRACT_DECISION_SOURCE },
      product_end_state: { const: PRODUCT_END_STATE },
      original_sprint_gate_spec: { const: ORIGINAL_SPRINT_GATE_SPEC },
      roadmap_source: { const: ROADMAP_SOURCE },
      non_negotiable_requirements: stringArray(),
      core_requirement_checklist: { type: "array", minItems: CORE_REQUIREMENTS.length },
      input_allowlist: exactArray(INPUT_ALLOWLIST),
      output_allowlist: exactArray(OUTPUT_PATHS),
      output_boundary: outputBoundarySchema(),
      simulation_id: string(),
      simulation_mode: { const: "manual_internal_summary_only" },
      source_contract: { $ref: "#/$defs/sourceContract" },
      jurisdiction_source_binding: { $ref: "#/$defs/jurisdictionSourceBinding" },
      simulation_status_vocabulary: exactArray(SIMULATION_STATUS_OPTIONS),
      simulation_no_output_enforcement: { $ref: "#/$defs/noOutputEnforcement" },
      simulation_rows: {
        type: "array",
        minItems: 10,
        maxItems: 10,
        items: { $ref: "#/$defs/simulationRow" },
      },
      aggregate_blockers: stringArray(),
      closure_disposition: { $ref: "#/$defs/closureDisposition" },
      finding_classification: { type: "array", minItems: 1, items: { $ref: "#/$defs/findingClassification" } },
    },
    $defs: {
      sourceContract: {
        type: "object",
        additionalProperties: false,
        required: ["report_id", "contract_id", "source_file", "contract_decision", "contract_row_count"],
        properties: {
          report_id: string(),
          contract_id: string(),
          source_file: string(),
          contract_decision: { const: ACCEPTED_TRIAL_CONTRACT_DECISION },
          contract_row_count: { const: 10 },
        },
      },
      sourcePolicy: {
        type: "object",
        additionalProperties: false,
        required: Object.keys(sourcePolicy()),
        properties: {
          explicit_contract_inputs_only: booleanConst(true),
          input_allowlist: exactArray(INPUT_ALLOWLIST),
          directory_globbing_allowed: booleanConst(false),
          implicit_source_discovery: booleanConst(false),
          generated_lesson_output_scanning: booleanConst(false),
          source_refresh_executed: booleanConst(false),
          local_expert_substitution: booleanConst(false),
        },
      },
      jurisdictionSourceBinding: {
        type: "object",
        additionalProperties: false,
        required: ["jurisdiction_id", "jurisdiction_label", "descriptor_id", "official_source_ids", "source_policy"],
        properties: {
          jurisdiction_id: { enum: ["england", "flanders"] },
          jurisdiction_label: string(),
          descriptor_id: string(),
          official_source_ids: stringArray(),
          source_policy: { $ref: "#/$defs/sourcePolicy" },
        },
      },
      noOutputEnforcement: noOutputSchema(),
      sourceBinding: {
        type: "object",
        additionalProperties: false,
        required: ["source_id", "source_role", "access_date", "source_scope", "forbidden_inference"],
        properties: {
          source_id: string(),
          source_role: string(),
          access_date: string(),
          source_scope: string(),
          forbidden_inference: string(),
        },
      },
      retainedBlockerDisplay: {
        type: "object",
        additionalProperties: false,
        required: [
          "route_local_only_evidence_status",
          "school_owned_evidence_still_needed",
          "forbidden_inferences",
          "accessibility_support_limitations",
          "legal_sufficiency_blocked",
          "support_sufficiency_blocked",
          "school_owned_accommodation_evidence_needed",
          "individual_adjustment_claim_blocked",
          "support_records_personal_data_blocked",
          "check_surface_authority_separation",
          "owner_next_action",
          "proof_required_to_close",
        ],
        properties: {
          route_local_only_evidence_status: string(),
          school_owned_evidence_still_needed: booleanConst(true),
          forbidden_inferences: stringArray(),
          accessibility_support_limitations: stringArray(),
          legal_sufficiency_blocked: booleanConst(true),
          support_sufficiency_blocked: booleanConst(true),
          school_owned_accommodation_evidence_needed: booleanConst(true),
          individual_adjustment_claim_blocked: booleanConst(true),
          support_records_personal_data_blocked: booleanConst(true),
          check_surface_authority_separation: string(),
          owner_next_action: string(),
          proof_required_to_close: string(),
        },
      },
      simulationDisposition: {
        type: "object",
        additionalProperties: false,
        required: ["status", "finding_classification", "blocks", "does_not_block", "proof_required_to_close"],
        properties: {
          status: { enum: SIMULATION_STATUS_OPTIONS },
          finding_classification: { enum: REV_STD_FINDING_CLASSIFICATIONS },
          blocks: string(),
          does_not_block: string(),
          proof_required_to_close: string(),
        },
      },
      simulationRow: {
        type: "object",
        additionalProperties: false,
        required: [
          "simulation_row_id",
          "source_contract_row_id",
          "jurisdiction_id",
          "chapter_id",
          "paragraph_id",
          "chapter_paragraph",
          "concept_id",
          "crosswalk_row_id",
          "source_ids",
          "source_bindings",
          "transformation_actions",
          "simulated_internal_observation",
          "no_output_result",
          "retained_blocker_display",
          "blocker_codes",
          "proof_required_to_close",
          "simulation_disposition",
        ],
        properties: {
          simulation_row_id: string(),
          source_contract_row_id: string(),
          jurisdiction_id: { enum: ["england", "flanders"] },
          chapter_id: { enum: ["1.2", "1.3"] },
          paragraph_id: string(),
          chapter_paragraph: string(),
          concept_id: string(),
          crosswalk_row_id: string(),
          local_heading: string(),
          mapping_status: string(),
          assessment_status: string(),
          source_ids: stringArray(),
          source_bindings: { type: "array", minItems: 1, items: { $ref: "#/$defs/sourceBinding" } },
          transformation_actions: stringArray(),
          simulated_internal_observation: string(),
          no_output_result: { $ref: "#/$defs/noOutputEnforcement" },
          retained_blocker_display: { $ref: "#/$defs/retainedBlockerDisplay" },
          blocker_codes: stringArray(),
          proof_required_to_close: string(),
          simulation_disposition: { $ref: "#/$defs/simulationDisposition" },
        },
      },
      closureDisposition: {
        type: "object",
        additionalProperties: false,
        required: Object.keys(closureDisposition(["school_owned_evidence_still_needed"])),
        properties: {
          internal_no_output_simulation_complete: booleanConst(true),
          localized_output_generation_ready: booleanConst(false),
          product_route_ready: booleanConst(false),
          scale_gate_ready: booleanConst(false),
          diagnostics_mastery_pv_ready: booleanConst(false),
          school_owned_evidence_still_needed: { type: "boolean" },
          source_refresh_needed_before_any_output: booleanConst(true),
          local_expert_review_needed_before_any_output: booleanConst(true),
          source_refresh_executed: booleanConst(false),
          local_expert_substituted: booleanConst(false),
          aqa_approval_claim: booleanConst(false),
          ok_compliance_claim: booleanConst(false),
          legal_sufficiency_ready: booleanConst(false),
          support_sufficiency_ready: booleanConst(false),
          public_output_ready: booleanConst(false),
          whole_uk_claim_from_england_only: booleanConst(false),
          all_belgium_claim_from_flanders_only: booleanConst(false),
          next_allowed_step_if_human_approved: { const: SELECTED_SIMULATION_DECISION },
        },
      },
      findingClassification: {
        type: "object",
        additionalProperties: false,
        required: ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"],
        properties: {
          finding: string(),
          classification: { enum: REV_STD_FINDING_CLASSIFICATIONS },
          blocks: string(),
          does_not_block: string(),
          proof_required_to_close: string(),
        },
      },
    },
  };
}

function mutateSimulation(simulation, fixtureId) {
  const clone = JSON.parse(JSON.stringify(simulation));
  clone.fixture_id = fixtureId;
  switch (fixtureId) {
    case "STOP_MISSING_CONTRACT_ROW":
      clone.simulation_rows.pop();
      return clone;
    case "STOP_DUPLICATE_CONTRACT_ROW":
      clone.simulation_rows[1] = JSON.parse(JSON.stringify(clone.simulation_rows[0]));
      return clone;
    case "STOP_ROW_LINEAGE_MISMATCH":
      clone.simulation_rows[0].source_contract_row_id = `${clone.jurisdiction_source_binding.jurisdiction_id}:99:unknown_contract_row`;
      clone.simulation_rows[0].concept_id = "unknown_concept";
      return clone;
    case "STOP_TRANSFORMATION_ACTIONS_MISMATCH":
      clone.simulation_rows[0].transformation_actions = [];
      return clone;
    case "STOP_UNKNOWN_SOURCE_ID":
      clone.simulation_rows[0].source_ids[0] = "unknown-source";
      clone.simulation_rows[0].source_bindings[0].source_id = "unknown-source";
      return clone;
    case "STOP_LOCALIZED_OUTPUT":
      clone.simulation_no_output_enforcement.localized_textbook_paragraphs_generated = true;
      clone.simulation_rows[0].no_output_result.localized_textbook_paragraphs_generated = true;
      return clone;
    case "STOP_STUDENT_FACING_OUTPUT":
      clone.simulation_rows[0].no_output_result.student_facing_files_generated = true;
      return clone;
    case "STOP_FORBIDDEN_RUNTIME":
      clone.simulation_rows[0].no_output_result.runtime_execution_performed = true;
      return clone;
    case "STOP_TEACHER_SCHOOL_FACING_OUTPUT":
      clone.simulation_rows[0].no_output_result.teacher_school_facing_output_generated = true;
      return clone;
    case "STOP_PUBLIC_OUTPUT":
      clone.simulation_rows[0].no_output_result.public_output_generated = true;
      return clone;
    case "STOP_PERSONAL_DATA":
      clone.simulation_rows[0].no_output_result.personal_data_fields_present = true;
      clone.personal_data_fields = ["student_name"];
      return clone;
    case "STOP_COMPLIANCE_APPROVAL_CLAIM":
      clone.output_boundary.legal_sufficiency_claim = true;
      clone.output_boundary.legal_compliance_claim = true;
      return clone;
    case "STOP_SUPPORT_ACCOMMODATION_CLAIM":
      clone.output_boundary.support_sufficiency_claim = true;
      clone.output_boundary.support_or_accommodation_sufficiency_claim = true;
      return clone;
    case "STOP_PRODUCT_OR_SCALE_GATE":
      clone.simulation_rows[0].no_output_result.product_route_integration_requested = true;
      clone.simulation_rows[0].no_output_result.scale_gate_integration_requested = true;
      clone.output_boundary.simulation_product_route = true;
      clone.output_boundary.simulation_scale_gate = true;
      return clone;
    case "STOP_IMPLICIT_DISCOVERY":
      clone.jurisdiction_source_binding.source_policy.implicit_source_discovery = true;
      clone.jurisdiction_source_binding.source_policy.directory_globbing_allowed = true;
      return clone;
    case "STOP_SOURCE_REFRESH_EXECUTION":
      clone.jurisdiction_source_binding.source_policy.source_refresh_executed = true;
      clone.simulation_rows[0].no_output_result.automated_source_refresh_executed = true;
      return clone;
    case "CLOSURE_SOURCE_REFRESH_EXECUTED":
      clone.closure_disposition.source_refresh_executed = true;
      return clone;
    case "CLOSURE_LOCAL_EXPERT_SUBSTITUTED":
      clone.jurisdiction_source_binding.source_policy.local_expert_substitution = true;
      clone.closure_disposition.local_expert_substituted = true;
      return clone;
    case "CLOSURE_AQA_APPROVAL_CLAIM":
      clone.closure_disposition.aqa_approval_claim = true;
      return clone;
    case "CLOSURE_OK_COMPLIANCE_CLAIM":
      clone.closure_disposition.ok_compliance_claim = true;
      return clone;
    case "CLOSURE_WHOLE_UK_CLAIM":
      clone.closure_disposition.whole_uk_claim_from_england_only = true;
      return clone;
    case "CLOSURE_ALL_BELGIUM_CLAIM":
      clone.closure_disposition.all_belgium_claim_from_flanders_only = true;
      return clone;
    case "CLOSURE_LEGAL_SUFFICIENCY_READY":
      clone.closure_disposition.legal_sufficiency_ready = true;
      return clone;
    case "CLOSURE_SUPPORT_SUFFICIENCY_READY":
      clone.closure_disposition.support_sufficiency_ready = true;
      return clone;
    case "CLOSURE_PUBLIC_OUTPUT_READY":
      clone.closure_disposition.public_output_ready = true;
      return clone;
    case "STOP_DECISION_OVERCLAIM":
      clone.closure_disposition.localized_output_generation_ready = true;
      clone.closure_disposition.product_route_ready = true;
      return clone;
    default:
      throw new Error(`Unknown fixture mutation: ${fixtureId}`);
  }
}

function fixtureReports(england, flanders) {
  return {
    positive: new Map([
      [POSITIVE_FIXTURES[0], england],
      [POSITIVE_FIXTURES[1], flanders],
    ]),
    negative: new Map(NEGATIVE_FIXTURES.map(([file, code, mutationId]) => [
      `references/data/inspection-standards/fixtures/internal-no-output-trial-simulation/negative/${file}`,
      {
        fixture_id: code,
        expected_refusal_code: code,
        simulation: mutateSimulation(england, mutationId || code),
      },
    ])),
  };
}

function renderMarkdown(lines) {
  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function renderSimulation(report) {
  return renderMarkdown([
    `# ${report.jurisdiction_source_binding.jurisdiction_label} Internal No-Output Trial Simulation`,
    "",
    `Status: ${report.status}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Roadmap: \`${ROADMAP_SOURCE}\``,
    `- Accepted trial-contract decision: \`${ACCEPTED_TRIAL_CONTRACT_DECISION}\``,
    `- Accepted trial-contract source: \`${ACCEPTED_TRIAL_CONTRACT_DECISION_SOURCE}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    "| Requirement | Status | proof_required_to_close |",
    "| --- | --- | --- |",
    ...report.core_requirement_checklist.map((item) => `| \`${item.id}\` | ${item.status} | ${item.proof_required_to_close} |`),
    "",
    "## Authority Boundary",
    "",
    "This simulation is internal-only, manual, deterministic, and no-output. It does not execute runtime behavior, refresh sources, substitute local experts, generate localized textbook paragraphs, exercises, answer models, assessment items, student-facing files, teacher/school-facing output, public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, legal sufficiency, compliance, approval, OP0, PTA, summative, inspection-readiness, support-sufficiency, or accommodation-sufficiency claims.",
    "",
    "## Simulation Rows",
    "",
    "| Row | Chapter/Paragraph | Concept | Status | Retained blockers | Proof Required To Close |",
    "| --- | --- | --- | --- | --- | --- |",
    ...report.simulation_rows.map((row) => `| \`${row.source_contract_row_id}\` | ${row.chapter_paragraph} | \`${row.concept_id}\` | \`${row.simulation_disposition.status}\` | ${row.blocker_codes.map((item) => `\`${item}\``).join(", ")} | ${row.proof_required_to_close} |`),
    "",
    "## Finding Classification",
    "",
    "| Finding | Classification | blocks | does_not_block | proof_required_to_close |",
    "| --- | --- | --- | --- | --- |",
    ...report.finding_classification.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
    "",
  ]);
}

function renderCombined(report) {
  return renderMarkdown([
    "# Internal No-Output Trial Simulation",
    "",
    `Status: ${report.status}`,
    "",
    "This combined report is an internal summary-only simulation over accepted England and Flanders trial contracts. It contains no localized textbook paragraphs, exercises, answer models, assessment items, student-facing files, teacher/school-facing output, public output, or evidence packs.",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted trial-contract decision: \`${ACCEPTED_TRIAL_CONTRACT_DECISION}\``,
    "",
    "## Summary",
    "",
    `- England rows: ${report.row_counts.england}`,
    `- Flanders rows: ${report.row_counts.flanders}`,
    `- Total rows: ${report.row_counts.total}`,
    "",
    "## Aggregate Blockers",
    "",
    ...report.aggregate_blockers.map((item) => `- \`${item}\``),
    "",
    "## Finding Classification",
    "",
    "| Finding | Classification | blocks | does_not_block | proof_required_to_close |",
    "| --- | --- | --- | --- | --- |",
    ...report.finding_classification.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
    "",
  ]);
}

function renderValidation(report) {
  return renderMarkdown([
    "# Internal No-Output Trial Simulation Validation",
    "",
    `Status: ${report.status}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Validation Summary",
    "",
    `- England rows: ${report.row_counts.england}`,
    `- Flanders rows: ${report.row_counts.flanders}`,
    `- Total rows: ${report.row_counts.total}`,
    `- Schema file: \`${report.schema_file}\``,
    `- Exact no-output false flags: ${report.schema_strictness.exact_no_output_false_flags}`,
    `- Exact decision tuple: ${report.schema_strictness.exact_decision_tuple.map((item) => `\`${item}\``).join(", ")}`,
    "",
    "## Fixture Coverage",
    "",
    "| Fixture | Expected |",
    "| --- | --- |",
    ...report.positive_fixtures.map((item) => `| \`${item.file}\` | ${item.expected} |`),
    ...report.negative_fixtures.map((item) => `| \`${item.file}\` | \`${item.expected_refusal_code}\` |`),
    "",
    "## Finding Classification",
    "",
    "| Finding | Classification | blocks | does_not_block | proof_required_to_close |",
    "| --- | --- | --- | --- | --- |",
    ...report.finding_classification.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
    "",
  ]);
}

function renderDecision(report) {
  return renderMarkdown([
    "# Internal No-Output Trial Simulation Decision",
    "",
    `Status: ${report.status}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted trial-contract decision: \`${ACCEPTED_TRIAL_CONTRACT_DECISION}\``,
    "",
    "## Decision",
    "",
    `Selected: \`${report.final_internal_no_output_trial_simulation_decision.selected}\``,
    "",
    "Allowed options:",
    "",
    ...report.final_internal_no_output_trial_simulation_decision.allowed_options.map((item) => `- \`${item}\``),
    "",
    "## Still Blocked",
    "",
    ...report.does_not_authorize.map((item) => `- ${item}`),
    "",
    "## Finding Classification",
    "",
    "| Finding | Classification | blocks | does_not_block | proof_required_to_close |",
    "| --- | --- | --- | --- | --- |",
    ...report.finding_classification.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
    "",
  ]);
}

function renderSprintPlan(decision) {
  return renderMarkdown([
    "# GOAL-IQS-INTERNAL-NO-OUTPUT-TRIAL-SIMULATION-1 Sprint Plan",
    "",
    "Status: implemented_for_human_review",
    `Date: ${ACCESS_DATE}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Roadmap: \`${ROADMAP_SOURCE}\``,
    `- Accepted trial-contract decision: \`${ACCEPTED_TRIAL_CONTRACT_DECISION}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    "| Requirement | Status | proof_required_to_close |",
    "| --- | --- | --- |",
    ...coreChecklist().map((item) => `| \`${item.id}\` | ${item.status} | ${item.proof_required_to_close} |`),
    "",
    "## Required Outputs",
    "",
    ...OUTPUT_PATHS.map((item) => `- \`${item}\``),
    "",
    "## Review Workflow",
    "",
    "- England source/local-expert gate review.",
    "- Flanders source/local-expert gate review.",
    "- Teacher/economics review.",
    "- Legal/privacy review.",
    "- Accessibility/inclusion review.",
    "- Dutch quality-inspection/product-boundary review.",
    "- Final lead review.",
    "",
    "## Human Review Return Condition",
    "",
    "Return only after the simulation artifacts, fixtures, validation report, specialist corrections, final lead PASS, exact-head PR readiness proof, and green CI are complete.",
    "",
    "## Selected Decision For Human Review",
    "",
    `The implemented packet selects \`${decision.final_internal_no_output_trial_simulation_decision.selected}\` for human review.`,
    "",
  ]);
}

function buildBundle() {
  for (const input of INPUT_ALLOWLIST) {
    if (!fs.existsSync(repoPath(input))) throw new Error(`Missing input allowlist source: ${input}`);
  }
  const englandContract = readJson("reports/inspection-standards/england-internal-overlay-trial-contract.json");
  const flandersContract = readJson("reports/inspection-standards/flanders-internal-overlay-trial-contract.json");
  const contractDecision = readJson("reports/inspection-standards/internal-overlay-trial-contract-decision.json");
  if (contractDecision.final_internal_overlay_trial_contract_decision?.selected !== ACCEPTED_TRIAL_CONTRACT_DECISION) {
    throw new StopError("STOP_ACCEPTED_TRIAL_CONTRACT_DECISION_MISMATCH", "Accepted trial-contract decision is not the required no-output simulation authorization.");
  }

  const england = simulationReport("england", englandContract);
  const flanders = simulationReport("flanders", flandersContract);
  const simulation = combinedSimulation(england, flanders);
  const validation = validationReport(england, flanders, simulation);
  const decision = decisionReport(simulation, validation);
  const fixtures = fixtureReports(england, flanders);

  return {
    schema: schemaDocument(),
    england,
    flanders,
    simulation,
    validation,
    decision,
    fixtures,
  };
}

function outputContents(bundle) {
  const contents = new Map([
    [OUTPUT_PATHS[0], `${JSON.stringify(bundle.schema, null, 2)}\n`],
    [OUTPUT_PATHS[1], renderSimulation(bundle.england)],
    [OUTPUT_PATHS[2], `${JSON.stringify(bundle.england, null, 2)}\n`],
    [OUTPUT_PATHS[3], renderSimulation(bundle.flanders)],
    [OUTPUT_PATHS[4], `${JSON.stringify(bundle.flanders, null, 2)}\n`],
    [OUTPUT_PATHS[5], renderCombined(bundle.simulation)],
    [OUTPUT_PATHS[6], `${JSON.stringify(bundle.simulation, null, 2)}\n`],
    [OUTPUT_PATHS[7], renderValidation(bundle.validation)],
    [OUTPUT_PATHS[8], `${JSON.stringify(bundle.validation, null, 2)}\n`],
    [OUTPUT_PATHS[9], renderDecision(bundle.decision)],
    [OUTPUT_PATHS[10], `${JSON.stringify(bundle.decision, null, 2)}\n`],
  ]);
  for (const [file, report] of bundle.fixtures.positive.entries()) {
    contents.set(file, `${JSON.stringify(report, null, 2)}\n`);
  }
  for (const [file, report] of bundle.fixtures.negative.entries()) {
    contents.set(file, `${JSON.stringify(report, null, 2)}\n`);
  }
  contents.set(ORIGINAL_SPRINT_GATE_SPEC, renderSprintPlan(bundle.decision));
  return contents;
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();
  if (/localized-output|country-edition|localized-chapter|localized-exercise|answer-model|assessment-item|student-facing|school-facing|teacher|public|external|evidence-pack/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT", "Localized, country-edition, public, school-facing, teacher-facing, student-facing, assessment-item, answer-model, or evidence-pack output is not authorized.", { args: unknown });
  }
  if (/trial-runtime|execute-trial|runtime-execution|prototype-runtime|execute-prototype/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_RUNTIME", "Runtime execution is not authorized by this no-output simulation sprint.", { args: unknown });
  }
  if (/source-refresh|refresh-sources|automated-source-refresh/.test(joined)) {
    throw new StopError("STOP_SOURCE_REFRESH_EXECUTION", "Source refresh execution is not authorized by this no-output simulation sprint.", { args: unknown });
  }
  if (/local-expert|expert-substitution/.test(joined)) {
    throw new StopError("STOP_LOCAL_EXPERT_SUBSTITUTION", "Local expert substitution is not authorized by this no-output simulation sprint.", { args: unknown });
  }
  if (/product-route|scale|scale-gate|diagnostics|mastery|pv|student|personal|data-processing/.test(joined)) {
    throw new StopError("STOP_DOWNSTREAM_AUTHORITY", "Downstream product, student, data, Scale Gate, diagnostics/mastery/PV authority is not authorized.", { args: unknown });
  }
  if (/all-belgium|whole-uk|all-england-awarding-bodies|aqa-approval/.test(joined)) {
    throw new StopError("STOP_GOVERNANCE_OVERGENERALISATION", "Selected-jurisdiction boundaries must remain explicit.", { args: unknown });
  }
  if (/legal-sufficiency|legal\s+sufficiency|compliance|approval|approved|accreditation|inspection-ready|inspection-readiness|op0|pta|summative/.test(joined)) {
    throw new StopError("STOP_COMPLIANCE_APPROVAL_CLAIM", "Legal sufficiency, compliance, approval, accreditation, OP0, PTA, summative, and inspection-readiness claims are not authorized.", { args: unknown });
  }
  if (/support-sufficiency|accommodation-sufficiency|individual-adjustment|reasonable-adjustments|support-records|accessibility-sufficiency/.test(joined)) {
    throw new StopError("STOP_SUPPORT_ACCOMMODATION_CLAIM", "Support sufficiency, accommodation sufficiency, individual adjustment, and support-record claims are not authorized.", { args: unknown });
  }
  if (/glob|implicit-source|scan-generated-lessons|generated-lesson-output/.test(joined)) {
    throw new StopError("STOP_IMPLICIT_DISCOVERY", "Implicit source/output discovery and generated lesson-output scanning are not authorized.", { args: unknown });
  }
  if (/package|(?:^|\s|-)ci(?:$|\s|-)|dashboard|quality-ref|quality_ref/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_INTEGRATION", "Package, CI, dashboard, and quality-ref product integration are not authorized.", { args: unknown });
  }
  if (unknown.length > 0) {
    throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for internal no-output trial simulation generator.", { args: unknown });
  }
  return { check };
}

function writeOrCheck(contents, check) {
  const mismatches = [];
  for (const [relativePath, content] of contents.entries()) {
    if (!OUTPUT_PATHS.includes(relativePath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output not allowlisted: ${relativePath}`);
    }
    const fullPath = repoPath(relativePath);
    if (check) {
      const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
      if (current !== content) mismatches.push(relativePath);
      continue;
    }
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
  }
  if (mismatches.length > 0) throw new Error(`Internal no-output trial simulation output is stale: ${mismatches.join(", ")}`);
}

function run(mode) {
  const bundle = buildBundle();
  writeOrCheck(outputContents(bundle), mode.check);
  return bundle;
}

function main() {
  try {
    const mode = parseMode(process.argv);
    run(mode);
    console.log(mode.check ? "Internal no-output trial simulation output is current." : "Internal no-output trial simulation output generated.");
  } catch (error) {
    if (error instanceof StopError) {
      console.error(JSON.stringify({ refusal_code: error.code, message: error.message, details: error.details }, null, 2));
      process.exit(1);
    }
    console.error(error.message || error);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  ACCESS_DATE,
  CORE_REQUIREMENTS,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_PATHS,
  POSITIVE_FIXTURES,
  REFUSAL_CASES,
  REVIEW_PACKET_REQUIREMENTS,
  SELECTED_SIMULATION_DECISION,
  SIMULATION_BLOCKED_AUTHORITY,
  SIMULATION_STATUS_OPTIONS,
  SPRINT_ID,
  buildBundle,
  closureDisposition,
  noOutputFlags,
  outputContents,
  parseMode,
};
