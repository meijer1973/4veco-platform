#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const {
  DEEPENING_BLOCKED_AUTHORITY,
  SELECTED_DECISION: ACCEPTED_DEEPENING_DECISION,
} = require("./build-selected-jurisdiction-deepening.js");
const {
  REV_STD_FINDING_CLASSIFICATIONS,
} = require("./build-international-overlay-architecture.js");
const { StopError } = require("./build-international-quality-standards.js");

const ACCESS_DATE = "2026-06-24";
const SPRINT_ID = "GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_DEEPENING_DECISION_SOURCE = "reports/inspection-standards/selected-jurisdiction-deepening-decision.md";

const SELECTED_PLANNING_DECISION = "PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT";
const DECISION_OPTIONS = [
  "PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT",
  "SOURCE_REFRESH_BEFORE_TRIAL_CONTRACT",
  "STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK",
];

const INPUT_ALLOWLIST = [
  "reports/inspection-standards/selected-jurisdiction-deepening-decision.json",
  "reports/inspection-standards/selected-jurisdiction-readiness-comparison.json",
  "reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json",
  "reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json",
  "references/data/inspection-standards/overlays/england.deepening.v1.json",
  "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
  "docs/inspection-standards/selected-jurisdiction-transformation-contract.md",
];

const OUTPUT_PATHS = [
  "docs/inspection-standards/internal-overlay-prototype-planning-contract.md",
  "reports/inspection-standards/internal-overlay-prototype-plan.md",
  "reports/inspection-standards/internal-overlay-prototype-plan.json",
  "reports/inspection-standards/internal-overlay-prototype-refusal-matrix.md",
  "reports/inspection-standards/internal-overlay-prototype-refusal-matrix.json",
  "reports/inspection-standards/internal-overlay-prototype-planning-decision.md",
  "reports/inspection-standards/internal-overlay-prototype-planning-decision.json",
  "archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md",
];

const PROTOTYPE_BLOCKED_AUTHORITY = [...new Set([
  ...DEEPENING_BLOCKED_AUTHORITY,
  "internal_prototype_runtime_execution",
  "localized_overlay_output_generation",
  "fixture_to_product_promotion",
  "teacher_school_pilot",
  "school_owned_evidence_collection",
  "support_sufficiency_claim",
  "accommodation_sufficiency_claim",
  "individual_adjustment_claim",
  "support_records_personal_data",
  "automated_source_refresh",
  "non_allowlisted_source_use",
  "local_expert_substitution",
])];

const REVIEW_PACKET_REQUIREMENTS = [
  "Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
  "Cite the accepted GOAL-IQS-SELECTED-DEEPENING-1 decision and preserve its authority boundaries.",
  "Plan internal overlay trial architecture only; do not create localized chapters, country editions, or executable product routes.",
  "Use explicit input and output allowlists; do not glob directories or scan generated lesson output.",
  "Define source traceability, blocker display, refusal rules, validation gates, and review gates before any later trial-contract draft.",
  "Keep England and Flanders as the selected contrasting jurisdictions; do not generalize to whole UK or all Belgium.",
  "Keep all teacher/school-facing, public, evidence-pack, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, and inspection-readiness authority blocked.",
  "Classify findings with blocks, does_not_block, and proof_required_to_close.",
  "Do not carry a missing core requirement as PASS WITH FLAGS.",
];

const CORE_REQUIREMENTS = [
  ["accepted_decision_bound", "The plan is bound to the accepted selected-deepening decision and does not reinterpret it as implementation authority."],
  ["input_allowlist", "The plan names an exact input allowlist from selected-deepening reports, crosswalks, descriptors, and transformation contract."],
  ["output_allowlist", "The plan names an exact output allowlist for planning records only."],
  ["no_output_boundary", "No localized chapters, generated lesson output, country edition, teacher/school-facing output, public output, or evidence pack is created or authorized."],
  ["prototype_scope", "The trial architecture is planning-only and manually invoked; it describes a later contract draft without runtime execution."],
  ["source_traceability", "Every later trial-contract question must point to selected-jurisdiction sources, crosswalk rows, and known gaps."],
  ["blocker_display", "Future trial-contract surfaces must visibly retain route-local-only status, school-owned evidence needs, forbidden inferences, and owner next action."],
  ["support_accommodation_boundary", "Future trial-contract rows must keep support sufficiency, accommodation sufficiency, individual adjustment, and support-record personal-data claims blocked."],
  ["refusal_stop_conditions", "Forbidden audiences, authority jumps, implicit discovery, integration requests, and compliance claims fail closed."],
  ["review_gates", "The plan requires specialist and final lead review before any later trial-contract draft can be returned."],
  ["human_review_stop", "The current sprint returns for human review and does not unlock implementation without a separate exact-head decision."],
];

const REFUSAL_CASES = [
  [["--country-edition"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--localized-chapter"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--teacher"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--school-facing"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--public"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--external"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--student-facing"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--prototype-runtime"], "STOP_FORBIDDEN_RUNTIME"],
  [["--execute-prototype"], "STOP_FORBIDDEN_RUNTIME"],
  [["--product-route"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--scale"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--diagnostics"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--mastery"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--pv"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--student"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--personal"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--data-processing"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--legal-sufficiency"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approved"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
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

function boundaryFlags() {
  return Object.fromEntries(PROTOTYPE_BLOCKED_AUTHORITY.map((flag) => [flag, false]));
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
    accepted_deepening_decision: ACCEPTED_DEEPENING_DECISION,
    accepted_deepening_decision_source: ACCEPTED_DEEPENING_DECISION_SOURCE,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    non_negotiable_requirements: REVIEW_PACKET_REQUIREMENTS,
    core_requirement_checklist: CORE_REQUIREMENTS.map(([id, requirement]) => ({
      id,
      requirement,
      status: "met_for_internal_planning",
      proof_required_to_close: "Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review.",
    })),
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

function planningPhases() {
  return [
    {
      phase_id: "phase_0_authority_lock",
      purpose: "Import accepted selected-deepening proof as planning context only.",
      allowed_actions: [
        "Read the allowlisted selected-deepening decision, comparison, crosswalks, descriptors, and transformation contract.",
        "Record authority boundaries and known source gaps.",
      ],
      forbidden_actions: [
        "Treat selected-deepening acceptance as product or local implementation authority.",
        "Resolve source gaps by implicit web/source discovery.",
      ],
      exit_evidence: "Planning packet names accepted decision, still-blocked authority, and exact input allowlist.",
    },
    {
      phase_id: "phase_1_trial_contract_shape",
      purpose: "Define the later internal trial contract shape without executing it.",
      allowed_actions: [
        "Draft field families for source binding, concept mapping, transformation intent, blocker display, and reviewer disposition.",
        "Name future fixture categories and refusal cases.",
      ],
      forbidden_actions: [
        "Generate localized exercises, answer models, lesson pages, teacher packs, or student-facing materials.",
        "Create package, CI, dashboard, quality-ref, product-route, or Scale Gate integration.",
      ],
      exit_evidence: "Future contract fields are bounded to internal, manual, no-output analysis.",
    },
    {
      phase_id: "phase_2_validation_design",
      purpose: "Define deterministic validation before any later trial-contract draft.",
      allowed_actions: [
        "Require exact input/output allowlists.",
        "Require explicit source IDs for each future row.",
        "Require refusal tests for forbidden audiences, authority jumps, implicit discovery, and integration requests.",
      ],
      forbidden_actions: [
        "Use directory globbing or generated lesson-output scanning.",
        "Waive source traceability for convenience.",
      ],
      exit_evidence: "Checker requirements and refusal matrix are reviewable before implementation.",
    },
    {
      phase_id: "phase_3_review_gate_design",
      purpose: "Define review gates needed before any later internal trial-contract draft can proceed.",
      allowed_actions: [
        "Require teacher/economics, legal/privacy, accessibility/inclusion, jurisdiction-source, and final lead review.",
        "Preserve REV-STD-1 findings and carried-issue fields.",
      ],
      forbidden_actions: [
        "Return a later contract draft without specialist corrections resolved.",
        "Use PASS WITH FLAGS to carry a missing core requirement.",
      ],
      exit_evidence: "Human-review packet can decide whether to authorize a later contract-draft sprint.",
    },
  ];
}

function jurisdictionPlanning() {
  return [
    {
      jurisdiction_id: "england",
      descriptor_source: "references/data/inspection-standards/overlays/england.deepening.v1.json",
      crosswalk_source: "reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json",
      planning_use: "Internal planning for how an England overlay trial contract would preserve DfE/Ofsted/AQA-source boundaries.",
      must_display_blockers: [
        "England is not whole UK.",
        "AQA specimen/mark-scheme evidence is representative only, not awarding-body approval.",
        "SEND/accessibility terminology is not legal sufficiency or support sufficiency.",
      ],
      required_later_review: [
        "England subject/source reviewer",
        "teacher/economics reviewer",
        "legal/privacy reviewer",
        "accessibility/inclusion reviewer",
      ],
    },
    {
      jurisdiction_id: "flanders",
      descriptor_source: "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
      crosswalk_source: "reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json",
      planning_use: "Internal planning for how a Flanders overlay trial contract would preserve Flemish-source and school/network boundaries.",
      must_display_blockers: [
        "Flanders is not all Belgium.",
        "Onderwijsdoelen and Referentiekader Onderwijskwaliteit do not supply school-owned evidence.",
        "Assessment and OK fulfillment remain local/school/network dependent.",
      ],
      required_later_review: [
        "Flanders source/pathway reviewer",
        "teacher/economics reviewer",
        "legal/privacy reviewer",
        "accessibility/inclusion reviewer",
      ],
    },
  ];
}

function futureContractFields() {
  return [
    {
      field_family: "source_binding",
      required_fields: ["jurisdiction_id", "source_ids", "source_role", "access_date", "forbidden_inference"],
      reason: "Future trial rows must trace to selected-deepening sources instead of discovering sources implicitly.",
    },
    {
      field_family: "book_scope_binding",
      required_fields: ["book_scope", "chapter_paragraph", "concept_id", "crosswalk_row_id", "route_local_only"],
      reason: "Trial planning is limited to Book 1 Chapters 1.2 and 1.3 selected-deepening crosswalk evidence.",
    },
    {
      field_family: "transformation_intent",
      required_fields: ["unchanged_core", "terminology_change", "example_change", "assessment_change", "exclusion"],
      reason: "Future work must separate portable economics from local terminology, examples, assessment forms, and exclusions.",
    },
    {
      field_family: "blocker_display",
      required_fields: [
        "school_owned_evidence_needed",
        "school_owned_accommodation_evidence_needed",
        "local_expert_needed",
        "legal_sufficiency_blocked",
        "support_sufficiency_blocked",
        "accommodation_sufficiency_blocked",
        "individual_adjustment_claim_blocked",
        "support_records_personal_data_blocked",
        "owner_next_action",
      ],
      reason: "The future contract must keep blockers visible instead of burying them in prose.",
    },
    {
      field_family: "review_disposition",
      required_fields: ["reviewer_role", "finding_classification", "blocks", "does_not_block", "proof_required_to_close"],
      reason: "REV-STD-1 applies to future planning, specialist review, and human-review packets.",
    },
  ];
}

function refusalMatrix() {
  return REFUSAL_CASES.map(([args, code]) => ({
    args,
    expected_refusal_code: code,
    blocks: "The requested mode would exceed internal overlay trial-planning authority.",
    does_not_block: "Manual internal planning report generation with exact allowlists.",
    proof_required_to_close: "Generator and checker refusal tests continue to pass.",
  }));
}

function planReport() {
  return {
    ...commonFields("internal-overlay-prototype-plan", "ready_for_human_review"),
    planning_scope: {
      objective: "Plan a later internal-only overlay trial contract for England and Flanders without runtime execution or localized output.",
      in_scope: [
        "Internal architecture planning.",
        "Future contract field families.",
        "Exact allowlist policy.",
        "Refusal and stop-condition design.",
        "Validation and specialist-review gate design.",
      ],
      out_of_scope: PROTOTYPE_BLOCKED_AUTHORITY,
    },
    planning_phases: planningPhases(),
    jurisdiction_planning: jurisdictionPlanning(),
    future_contract_field_families: futureContractFields(),
    blocker_display_requirements: [
      "route_local_only evidence status",
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
    validation_gates: [
      "Generator --check proves output currentness.",
      "Checker proves exact input/output allowlists and false blocked-authority flags.",
      "Focused Jest proves committed packet acceptance and forbidden-mode refusal.",
      "Final PR readiness reviewer runs against exact remote head before human review.",
    ],
    review_gates: [
      "Lead reviewer: planning architecture and authority boundary.",
      "Teacher/economics reviewer: usefulness of future trial field families.",
      "Legal/privacy reviewer: audience, sharing, claims, and personal-data boundaries.",
      "Accessibility/inclusion reviewer: support/accommodation boundary.",
      "Final lead reviewer: complete packet, tests, generated reports, and PR proof.",
    ],
    finding_classification: [
      finding(
        "The selected-deepening decision is sufficient to plan a later internal overlay trial contract.",
        "core_requirement_met",
        "Nothing for human review of this planning packet.",
        "A later internal trial-contract draft only if human accepted.",
        "Human owner decision tied to exact PR head."
      ),
      finding(
        "Planning remains non-executing and creates no localized, school-facing, public, product-route, Scale Gate, diagnostic, mastery, PV, student, or personal-data output.",
        "core_requirement_met",
        "Any implementation, runtime, product-route, student-use, public, or school-facing use.",
        "Internal planning packet review.",
        "Separate future human authorization after specialist review."
      ),
    ],
  };
}

function refusalReport() {
  return {
    ...commonFields("internal-overlay-prototype-refusal-matrix", "refusal_matrix_ready"),
    refusal_cases: refusalMatrix(),
    finding_classification: [
      finding(
        "Forbidden modes fail closed before any output beyond the allowlisted planning records.",
        "core_requirement_met",
        "Forbidden audience, authority, integration, implicit-discovery, or compliance modes.",
        "Manual internal planning generation.",
        "Focused refusal tests and checker PASS."
      ),
    ],
  };
}

function decisionReport(plan) {
  return {
    ...commonFields("internal-overlay-prototype-planning-decision", "decision_ready_for_human_review"),
    final_internal_overlay_prototype_planning_decision: {
      selected: SELECTED_PLANNING_DECISION,
      allowed_options: DECISION_OPTIONS,
      decision_selection_count: 1,
      rationale:
        "England and Flanders now have enough selected-deepening source and crosswalk structure to draft a later internal trial contract, but only as non-executing planning/contract work with all product and school-facing authority blocked.",
    },
    authorizes_after_human_approval: [
      "A later internal-only trial-contract draft sprint.",
      "No runtime execution, localized chapter generation, school-facing output, public output, product route, Scale Gate, diagnostics/mastery/PV, student/product use, or personal-data processing.",
    ],
    still_blocked: PROTOTYPE_BLOCKED_AUTHORITY,
    owner_next_action:
      "Decide whether to authorize a later internal-only trial-contract draft sprint. Approval must not be read as local implementation, school-facing, public, product-route, Scale Gate, or student-use authority.",
    planning_report: plan.report_id,
    finding_classification: [
      finding(
        "The planning packet selects one allowed next decision.",
        "core_requirement_met",
        "Nothing for human review.",
        "A later internal trial-contract draft sprint if human accepted.",
        "Human owner decision tied to exact PR head."
      ),
      finding(
        "All implementation and downstream authority remains blocked.",
        "scale_blocker",
        "Country editions, localized chapters, teacher/school-facing distribution, public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, OP0, PTA, summative validity, and inspection-readiness claims.",
        "Internal planning decision only.",
        "Separate future human authorization with local expert/source/legal/accessibility review."
      ),
    ],
  };
}

function escapeCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}

function table(rows) {
  return rows.map((row) => `| ${row.map(escapeCell).join(" | ")} |`).join("\n");
}

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function findingTable(findings) {
  return table([
    ["Finding", "Classification", "blocks", "does_not_block", "proof_required_to_close"],
    ["---", "---", "---", "---", "---"],
    ...findings.map((item) => [
      item.finding,
      `\`${item.classification}\``,
      item.blocks,
      item.does_not_block,
      item.proof_required_to_close,
    ]),
  ]);
}

function renderHeader(title, report) {
  return `# ${title}

Status: ${report.status}
Sprint: \`${SPRINT_ID}\`
Date: ${ACCESS_DATE}

## Product End-State And Original Spec

- Product end-state: \`${PRODUCT_END_STATE}\`
- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\`
- Accepted selected-deepening decision: \`${ACCEPTED_DEEPENING_DECISION}\`
- Accepted decision source: \`${ACCEPTED_DEEPENING_DECISION_SOURCE}\`
`;
}

function renderNonNegotiables(report) {
  return `## Non-Negotiable Requirements

${list(report.non_negotiable_requirements)}
`;
}

function renderCoreChecklist(report) {
  return `## Core-Requirement Checklist

${table([
    ["Requirement", "Status", "proof_required_to_close"],
    ["---", "---", "---"],
    ...report.core_requirement_checklist.map((item) => [
      `\`${item.id}\``,
      item.status,
      item.proof_required_to_close,
    ]),
  ])}
`;
}

function renderPlanningContract(report) {
  return `${renderHeader("Internal Overlay Trial Planning Contract", report)}
${renderNonNegotiables(report)}
${renderCoreChecklist(report)}
## Contract Boundary

This contract describes internal planning for a later non-executing trial
contract. It does not create runtime execution, localized lesson output,
teacher or school-facing output, public output, product route, Scale Gate,
diagnostics/mastery/PV route, student/product use, personal-data processing,
legal sufficiency, compliance, approval, OP0, PTA, summative, or
inspection-readiness authority.

## Exact Input Allowlist

${list(report.input_allowlist.map((item) => `\`${item}\``))}

## Exact Output Allowlist

${list(report.output_allowlist.map((item) => `\`${item}\``))}

## Future Contract Field Families

${table([
    ["Field family", "Required fields", "Reason"],
    ["---", "---", "---"],
    ...report.future_contract_field_families.map((item) => [
      `\`${item.field_family}\``,
      item.required_fields.map((field) => `\`${field}\``).join(", "),
      item.reason,
    ]),
  ])}

## Blocker Display Requirements

${list(report.blocker_display_requirements.map((item) => `\`${item}\``))}

## Finding Classification

${findingTable(report.finding_classification)}
`;
}

function renderPlan(report) {
  return `${renderHeader("Internal Overlay Trial Plan", report)}
${renderNonNegotiables(report)}
${renderCoreChecklist(report)}
## Scope

- Objective: ${report.planning_scope.objective}

In scope:

${list(report.planning_scope.in_scope)}

Out of scope remains blocked:

${list(report.planning_scope.out_of_scope.map((item) => `\`${item}\``))}

## Planning Phases

${table([
    ["Phase", "Purpose", "Allowed actions", "Forbidden actions", "Exit evidence"],
    ["---", "---", "---", "---", "---"],
    ...report.planning_phases.map((phase) => [
      `\`${phase.phase_id}\``,
      phase.purpose,
      phase.allowed_actions.join("<br>"),
      phase.forbidden_actions.join("<br>"),
      phase.exit_evidence,
    ]),
  ])}

## Jurisdiction Planning

${table([
    ["Jurisdiction", "Descriptor", "Crosswalk", "Planning use", "Must display blockers"],
    ["---", "---", "---", "---", "---"],
    ...report.jurisdiction_planning.map((item) => [
      `\`${item.jurisdiction_id}\``,
      `\`${item.descriptor_source}\``,
      `\`${item.crosswalk_source}\``,
      item.planning_use,
      item.must_display_blockers.join("<br>"),
    ]),
  ])}

## Validation Gates

${list(report.validation_gates)}

## Review Gates

${list(report.review_gates)}

## Finding Classification

${findingTable(report.finding_classification)}
`;
}

function renderRefusalMatrix(report) {
  return `${renderHeader("Internal Overlay Trial Refusal Matrix", report)}
${renderNonNegotiables(report)}
${renderCoreChecklist(report)}
## Refusal Cases

${table([
    ["Args", "Expected refusal code", "blocks", "does_not_block", "proof_required_to_close"],
    ["---", "---", "---", "---", "---"],
    ...report.refusal_cases.map((item) => [
      item.args.map((arg) => `\`${arg}\``).join(" "),
      `\`${item.expected_refusal_code}\``,
      item.blocks,
      item.does_not_block,
      item.proof_required_to_close,
    ]),
  ])}

## Finding Classification

${findingTable(report.finding_classification)}
`;
}

function renderDecision(report) {
  const decision = report.final_internal_overlay_prototype_planning_decision;
  return `${renderHeader("Internal Overlay Trial Planning Decision", report)}
${renderNonNegotiables(report)}
${renderCoreChecklist(report)}
## Decision

Selected: \`${decision.selected}\`

Allowed options:

${list(decision.allowed_options.map((item) => `\`${item}\``))}

Decision selection count: \`${decision.decision_selection_count}\`

Rationale: ${decision.rationale}

## Authorizes After Human Approval

${list(report.authorizes_after_human_approval)}

## Still Blocked

${list(report.still_blocked.map((item) => `\`${item}\``))}

## Owner Next Action

${report.owner_next_action}

## Finding Classification

${findingTable(report.finding_classification)}
`;
}

function renderSprintPlan(report) {
  return `# Sprint \`${SPRINT_ID}\`: Internal Overlay Trial Planning

Status: ready_for_human_review_after_required_gates
Date: ${ACCESS_DATE}

## Goal

Create an internal-only planning packet for a later non-executing overlay
trial-contract draft for England and Flanders. The packet must bind to the
accepted selected-deepening decision, define exact input and output allowlists,
preserve source traceability, keep blocker display visible, and return for
human review before any later contract-draft authority.

## Context

- Product end-state: \`${PRODUCT_END_STATE}\`
- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\`
- Accepted selected-deepening decision: \`${ACCEPTED_DEEPENING_DECISION}\`
- Accepted decision source: \`${ACCEPTED_DEEPENING_DECISION_SOURCE}\`
- Roadmap: \`docs/roadmaps/quality-standards/international-quality-standards-roadmap.md\`

The selected-deepening decision authorizes planning only. It does not authorize
runtime execution, localized lesson output, teacher/school-facing output,
public output, product-route adoption, Scale Gate, diagnostics/mastery/PV,
student/product use, personal-data processing, legal sufficiency, compliance,
approval, OP0, PTA, summative, or inspection-readiness claims.

## Quality Standard

The quality floor is a specification-bound, internal-only planning packet with
deterministic proof. It must cite the product end-state and original sprint
specification, keep all rendered output and student-facing use blocked, and
name any follow-up as a separate human-authorized sprint rather than implied
implementation authority.

## Specification Fulfilment Matrix

${table([
    ["Specification requirement", "Implementation evidence required", "Review/proof required", "Status"],
    ["---", "---", "---", "---"],
    ...report.core_requirement_checklist.map((item) => [
      `\`${item.id}\``,
      item.requirement,
      item.proof_required_to_close,
      item.status,
    ]),
  ])}

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
| --- | --- | --- |
| Add explicit support/accommodation blocker fields and refusal cases. | \`include_now\` | Included in this sprint after accessibility review. |
| Carry exact source-freshness fields into the later trial-contract draft. | \`defer_named_follow_up\` | Defer to \`GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-DRAFT-1\` if human authorized. |
| Generate localized chapters, teacher packs, evidence packs, or product routes. | \`reject_scope_creep\` | Rejected as outside current authority. |

## Allowed paths

${list(OUTPUT_PATHS.map((item) => `\`${item}\``))}

The generator may read only the exact input allowlist and may write only these
planning records. It must not write to \`references/machine/\`,
\`references/external/\`, generated lesson output, package integration,
dashboard gates, quality-ref routes, or product surfaces.

## Forbidden paths

- \`references/machine/\`
- \`references/external/\`
- \`../4veco-lessen/generated/\`
- \`../4veco-lessen/books/\`
- product-route, dashboard, quality-ref, Scale Gate, CI/package integration,
  teacher/school-facing, public, evidence-pack, student-use, personal-data, or
  compliance/approval surfaces

## Inputs

${list(INPUT_ALLOWLIST.map((item) => `\`${item}\``))}

## Outputs

${list(OUTPUT_PATHS.map((item) => `\`${item}\``))}

## Operationalized sprint procedure

1. Generate the allowlisted internal planning packet and stop on any request
   for forbidden output, implicit discovery, runtime execution, support or
   compliance claims, product routes, or downstream authority.
2. Run deterministic validators and acceptance tests, including the generator
   currentness check, packet checker, focused Jest refusal tests, sprint-plan
   checker, roadmap/index checks, scope-language check, report JSON validation,
   line-ending check, diff hygiene, and platform tests.
3. Run specialist reviews for lead architecture, teacher/economics,
   legal/privacy, Dutch inspection/product boundary, accessibility/inclusion,
   and jurisdiction-source safety. Correct every blocker before final lead.
4. Open a PR only after validation is green, then run exact-head CI,
   branch-protection validation, and the PR Readiness Reviewer. The decision
   must route to human review before any later trial-contract draft authority.

## Acceptance tests

\`\`\`bash
node build-scripts/inspection/build-internal-overlay-prototype-planning.js --check
node build-scripts/inspection/check-internal-overlay-prototype-planning.js
npx jest build-scripts/inspection/check-internal-overlay-prototype-planning.test.js --runInBand
node build-scripts/sprints/check-sprint-plan.js archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md
node build-scripts/sprints/check-sprint-bundle.js reports/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-result.json
node build-scripts/references/check-roadmap-version-index.js
npm run check:scope-language
npm run check:platform
\`\`\`

## Proof Required to Close

Proof required to close must include review, validator, and test evidence,
specialist review results, correction records, final lead review, exact remote-head CI,
branch-protection checker output with \`ok: true\`, PR Readiness Reviewer route
output, and human approval tied to the exact PR head SHA. Any new commit after
readiness review requires a fresh exact-head decision.

## Rollback plan

Revert only this sprint's generated planning packet, generator, checker,
focused tests, sprint records, and roadmap/index updates. Do not alter the
accepted selected-deepening artifacts or unrelated roadmap state.

## Human review required

Human review is required before accepting
\`${SELECTED_PLANNING_DECISION}\`. Approval may authorize only a later
internal-only trial-contract draft sprint. It must not unlock runtime
execution, localized output, country editions, school/public output,
evidence packs, product-route adoption, Scale Gate, diagnostics/mastery/PV,
student/product use, personal-data processing, compliance, approval,
accreditation, OP0, PTA, summative, inspection-readiness, support sufficiency,
or accommodation sufficiency claims.
`;
}

function buildBundle() {
  const plan = planReport();
  const refusals = refusalReport();
  const decision = decisionReport(plan);
  return { plan, refusals, decision };
}

function outputContents(bundle) {
  return new Map([
    [OUTPUT_PATHS[0], renderPlanningContract(bundle.plan)],
    [OUTPUT_PATHS[1], renderPlan(bundle.plan)],
    [OUTPUT_PATHS[2], `${JSON.stringify(bundle.plan, null, 2)}\n`],
    [OUTPUT_PATHS[3], renderRefusalMatrix(bundle.refusals)],
    [OUTPUT_PATHS[4], `${JSON.stringify(bundle.refusals, null, 2)}\n`],
    [OUTPUT_PATHS[5], renderDecision(bundle.decision)],
    [OUTPUT_PATHS[6], `${JSON.stringify(bundle.decision, null, 2)}\n`],
    [OUTPUT_PATHS[7], renderSprintPlan(bundle.plan)],
  ]);
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();
  if (/country-edition|localized-chapter|student-facing|school-facing|teacher|public|external|evidence-pack/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT", "Localized, public, school-facing, teacher-facing, student-facing, or evidence-pack output is not authorized.", { args: unknown });
  }
  if (/prototype-runtime|execute-prototype|runtime-execution/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_RUNTIME", "Runtime execution is not authorized by this planning sprint.", { args: unknown });
  }
  if (/product-route|scale|diagnostics|mastery|pv|student|personal|data-processing/.test(joined)) {
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
    throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for internal overlay trial-planning generator.", { args: unknown });
  }
  return { check };
}

function writeOrCheck(contents, check) {
  const mismatches = [];
  for (const [relativePath, content] of contents.entries()) {
    if (!OUTPUT_PATHS.includes(relativePath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output not allowlisted: ${relativePath}`);
    }
    const fullPath = path.resolve(process.cwd(), relativePath);
    if (check) {
      const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
      if (current !== content) mismatches.push(relativePath);
      continue;
    }
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
  }
  if (mismatches.length > 0) throw new Error(`Internal overlay trial-planning output is stale: ${mismatches.join(", ")}`);
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
    console.log(mode.check ? "Internal overlay trial-planning output is current." : "Internal overlay trial-planning output generated.");
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
  OUTPUT_PATHS,
  PROTOTYPE_BLOCKED_AUTHORITY,
  REFUSAL_CASES,
  REVIEW_PACKET_REQUIREMENTS,
  SELECTED_PLANNING_DECISION,
  buildBundle,
  outputContents,
  parseMode,
};
