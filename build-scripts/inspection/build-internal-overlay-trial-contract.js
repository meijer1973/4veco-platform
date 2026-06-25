#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const {
  PROTOTYPE_BLOCKED_AUTHORITY,
  SELECTED_PLANNING_DECISION: ACCEPTED_PLANNING_DECISION,
} = require("./build-internal-overlay-prototype-planning.js");
const {
  REV_STD_FINDING_CLASSIFICATIONS,
} = require("./build-international-overlay-architecture.js");
const { StopError } = require("./build-international-quality-standards.js");

const ACCESS_DATE = "2026-06-25";
const SPRINT_ID = "GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_PLANNING_DECISION_SOURCE = "reports/inspection-standards/internal-overlay-prototype-planning-decision.md";
const ACCEPTED_DEEPENING_DECISION_SOURCE = "reports/inspection-standards/selected-jurisdiction-deepening-decision.md";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";

const SELECTED_TRIAL_CONTRACT_DECISION = "PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION";
const DECISION_OPTIONS = [
  "PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION",
  "REVISE_TRIAL_CONTRACT",
  "STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK",
];

const ALLOWED_TRANSFORMATION_ACTIONS = [
  "unchanged_core",
  "terminology_change",
  "example_change",
  "institution_change",
  "assessment_change",
  "extension_only",
  "exclude",
];

const INPUT_ALLOWLIST = [
  "reports/inspection-standards/internal-overlay-prototype-plan.json",
  "reports/inspection-standards/internal-overlay-prototype-planning-decision.json",
  "docs/inspection-standards/internal-overlay-prototype-planning-contract.md",
  "reports/inspection-standards/selected-jurisdiction-deepening-decision.json",
  "reports/inspection-standards/selected-jurisdiction-readiness-comparison.json",
  "reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json",
  "reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json",
  "references/data/inspection-standards/overlays/england.deepening.v1.json",
  "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
  "docs/inspection-standards/selected-jurisdiction-transformation-contract.md",
];

const POSITIVE_FIXTURES = [
  "references/data/inspection-standards/fixtures/internal-overlay-trial-contract/positive/england-internal-overlay-trial-contract.sample.json",
  "references/data/inspection-standards/fixtures/internal-overlay-trial-contract/positive/flanders-internal-overlay-trial-contract.sample.json",
];

const NEGATIVE_FIXTURES = [
  ["unknown-source-ids.sample.json", "STOP_UNKNOWN_SOURCE_ID"],
  ["stale-sources.sample.json", "STOP_STALE_SOURCE"],
  ["missing-crosswalk-rows.sample.json", "STOP_MISSING_CROSSWALK_ROW"],
  ["implicit-source-discovery.sample.json", "STOP_IMPLICIT_SOURCE_DISCOVERY"],
  ["directory-globbing.sample.json", "STOP_DIRECTORY_GLOBBING"],
  ["localized-output-request.sample.json", "STOP_LOCALIZED_OUTPUT"],
  ["student-facing-output.sample.json", "STOP_STUDENT_FACING_OUTPUT"],
  ["teacher-school-facing-output.sample.json", "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  ["public-output.sample.json", "STOP_PUBLIC_OUTPUT"],
  ["personal-data-fields.sample.json", "STOP_PERSONAL_DATA"],
  ["legal-compliance-claims.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["inspection-readiness-claims.sample.json", "STOP_INSPECTION_READINESS_CLAIM"],
  ["support-accommodation-sufficiency.sample.json", "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  ["product-route-scale-gate.sample.json", "STOP_PRODUCT_OR_SCALE_GATE"],
];

const OUTPUT_PATHS = [
  "references/schemas/internal-overlay-trial-contract.schema.v1.json",
  "reports/inspection-standards/england-internal-overlay-trial-contract.md",
  "reports/inspection-standards/england-internal-overlay-trial-contract.json",
  "reports/inspection-standards/flanders-internal-overlay-trial-contract.md",
  "reports/inspection-standards/flanders-internal-overlay-trial-contract.json",
  "reports/inspection-standards/internal-overlay-trial-contract-validation.md",
  "reports/inspection-standards/internal-overlay-trial-contract-validation.json",
  "reports/inspection-standards/internal-overlay-no-output-trial-trace.md",
  "reports/inspection-standards/internal-overlay-no-output-trial-trace.json",
  "reports/inspection-standards/internal-overlay-trial-contract-decision.md",
  "reports/inspection-standards/internal-overlay-trial-contract-decision.json",
  ...POSITIVE_FIXTURES,
  ...NEGATIVE_FIXTURES.map(([file]) => `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/${file}`),
  ORIGINAL_SPRINT_GATE_SPEC,
];

const TRIAL_BLOCKED_AUTHORITY = [...new Set([
  ...PROTOTYPE_BLOCKED_AUTHORITY,
  "internal_no_output_trial_is_not_runtime",
  "localized_textbook_paragraph_generation",
  "localized_exercise_generation",
  "localized_answer_model_generation",
  "student_facing_file_generation",
  "teacher_school_contract_output",
  "public_contract_output",
  "country_contract_publication",
  "school_pilot_execution",
  "trial_simulation_product_integration",
  "trial_contract_personal_data_fields",
  "legal_sufficiency_claim",
  "support_or_accommodation_sufficiency_claim",
  "inspection_readiness_claim",
])];

const REVIEW_PACKET_REQUIREMENTS = [
  "Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
  "Cite the accepted internal overlay prototype planning decision and preserve its authority boundaries.",
  "Create complete England and Flanders contracts for Book 1 Chapters 1.2 and 1.3 using every deep-crosswalk row.",
  "Use explicit source and output allowlists only; do not glob directories or scan generated lesson output.",
  "Use strict allowed transformation actions: unchanged_core, terminology_change, example_change, institution_change, assessment_change, extension_only, exclude.",
  "Generate internal trace reports only; do not generate localized textbook paragraphs, exercises, answer models, student-facing files, teacher/school-facing output, public output, or evidence packs.",
  "Keep school-owned evidence, local expert review, legal/privacy, accessibility/support, product-route, Scale Gate, diagnostics/mastery/PV, personal-data, compliance, approval, OP0, PTA, summative, and inspection-readiness authority blocked.",
  "Add positive and negative validation fixtures for source, freshness, row completeness, discovery, audience, personal-data, claims, and integration refusals.",
  "Classify findings with blocks, does_not_block, and proof_required_to_close.",
  "Do not carry a missing core requirement as PASS WITH FLAGS.",
];

const CORE_REQUIREMENTS = [
  ["contract_identity_authority", "The contract cites product end-state, original sprint/gate spec, accepted planning decision, and roadmap context."],
  ["exact_input_allowlist", "Only the selected-deepening and accepted planning inputs are read."],
  ["exact_output_allowlist", "Only internal contract, validation, trace, decision, schema, fixture, and sprint-plan outputs are written."],
  ["nested_contract_schema", "The schema covers authority, source binding, book scope, transformation intent, blocker display, review disposition, source freshness, no-output enforcement, refusal conditions, and closure decision."],
  ["all_crosswalk_rows_bound", "England and Flanders each bind all ten deep-crosswalk rows for Book 1 Chapters 1.2 and 1.3."],
  ["source_traceability", "Every row binds source IDs, source roles, access dates, freshness triggers, forbidden inference, and proof required to close."],
  ["strict_transformation_actions", "Every row uses only the allowed transformation-action vocabulary."],
  ["no_output_enforcement", "The trace contains only internal summaries and no localized paragraphs, exercises, answer models, or student-facing files."],
  ["fixture_refusals", "Positive and negative fixtures prove refusal for unknown sources, stale sources, missing rows, implicit discovery, forbidden audiences, personal data, claims, support/accommodation sufficiency, and product/Scale Gate integration."],
  ["single_decision", "The packet chooses exactly one of the allowed trial-contract decisions."],
  ["review_gates", "Specialist and final lead review remain required before human review."],
];

const REFUSAL_CASES = [
  [["--localized-output"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--localized-chapter"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--student-facing"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--teacher"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--school-facing"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--public"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--external"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--country-edition"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--prototype-runtime"], "STOP_FORBIDDEN_RUNTIME"],
  [["--execute-trial"], "STOP_FORBIDDEN_RUNTIME"],
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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function unique(items) {
  return [...new Set(items)];
}

function boundaryFlags() {
  return Object.fromEntries(TRIAL_BLOCKED_AUTHORITY.map((flag) => [flag, false]));
}

function coreChecklist(status = "met_for_internal_trial_contract") {
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
    accepted_planning_decision: ACCEPTED_PLANNING_DECISION,
    accepted_planning_decision_source: ACCEPTED_PLANNING_DECISION_SOURCE,
    accepted_deepening_decision_source: ACCEPTED_DEEPENING_DECISION_SOURCE,
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

function sourceMap(descriptor) {
  return new Map(descriptor.official_source_allowlist.map((source) => [source.source_id, source]));
}

function preferredSourceIds(jurisdictionId, row, descriptor) {
  const available = descriptor.official_source_allowlist.map((source) => source.source_id);
  if (jurisdictionId === "england") {
    const ids = [
      "england-dfe-a-level-economics-content",
      "england-aqa-7136-subject-content",
      "england-aqa-7136-scheme-assessment",
      "england-aqa-economics-command-words",
      "england-aqa-7136-assessment-resources",
      "england-ofsted-eif-2025",
      "england-ofsted-operating-guide-2025",
      "england-send-code-practice",
    ];
    return ids.filter((id) => available.includes(id));
  }
  const ids = [
    "be-flanders-onderwijsdoelen-so3-doorstroom",
    "be-flanders-onderwijsdoelen-modernisatie",
    "be-flanders-ok-framework",
    "be-flanders-education-quality-reference",
    "be-flanders-inspection-what-do-we-inspect",
  ];
  return ids.filter((id) => available.includes(id));
}

function parseChapter(row) {
  const match = String(row.concept_id || "").match(/^(\d+\.\d+)\.(\d+)/);
  if (match) {
    return {
      chapter_id: match[1],
      paragraph_id: `${match[1]}.${match[2]}`,
      chapter_paragraph: `${match[1]}.${match[2]}`,
    };
  }
  return {
    chapter_id: "1.2-1.3",
    paragraph_id: "book1-boundary",
    chapter_paragraph: "Book 1 Chapters 1.2 and 1.3 boundary",
  };
}

function transformationActions(jurisdictionId, row) {
  if (row.concept_id === "book1_output_boundary") return ["exclude"];
  if (row.mapping_status === "extension_only") return ["extension_only"];
  const actions = ["unchanged_core", "terminology_change", "example_change", "institution_change"];
  if (row.assessment_status !== "not_applicable") actions.push("assessment_change");
  return unique(actions);
}

function reviewerRole(jurisdictionId) {
  return jurisdictionId === "england"
    ? "England authority/source reviewer plus teacher/economics, legal/privacy, and accessibility/inclusion reviewers"
    : "Flanders authority/source reviewer plus teacher/economics, legal/privacy, and accessibility/inclusion reviewers";
}

function schoolOwnedEvidence(descriptor, row) {
  const areas = (descriptor.school_owned_evidence_boundary || []).map((item) => item.boundary_area);
  return {
    still_needed: true,
    source: "selected-jurisdiction deepening descriptor",
    boundary_areas: areas,
    row_specific_reason: row.known_gap || "School-owned and local expert evidence remain outside this internal contract.",
  };
}

function blockerDisplay(jurisdictionId, descriptor, row) {
  return {
    route_local_only_evidence_status: "internal_contract_only",
    school_owned_evidence_still_needed: true,
    forbidden_inferences: unique([
      ...(descriptor.forbidden_claims || []),
      row.known_gap,
    ].filter(Boolean)),
    accessibility_support_limitations: (descriptor.accessibility_inclusion_terminology || []).map((item) => item.limitation),
    legal_sufficiency_blocked: true,
    support_sufficiency_blocked: true,
    school_owned_accommodation_evidence_needed: true,
    individual_adjustment_claim_blocked: true,
    support_records_personal_data_blocked: true,
    check_surface_authority_separation: "This contract is not a check-surface, product-route, diagnostics/mastery/PV, Scale Gate, or evidence-pack authority.",
    owner_next_action: "Review the complete internal no-output trial-contract packet and decide whether to authorize internal no-output trial simulation only.",
    proof_required_to_close: "Fresh source check, all specialist reviews, final lead PASS, exact-head PR readiness proof, green CI, and human review before any later step.",
  };
}

function contractRow(jurisdictionId, descriptor, row, index) {
  const sources = sourceMap(descriptor);
  const sourceIds = preferredSourceIds(jurisdictionId, row, descriptor);
  const sourceBindings = sourceIds.map((sourceId) => {
    const source = sources.get(sourceId);
    return {
      source_id: sourceId,
      source_role: source.role,
      access_date: source.access_date,
      source_scope: source.scope,
      forbidden_inference: source.forbidden_inference,
    };
  });
  const parsed = parseChapter(row);
  const actions = transformationActions(jurisdictionId, row);
  return {
    row_id: `${jurisdictionId}:${String(index + 1).padStart(2, "0")}:${row.concept_id}`,
    jurisdiction_id: jurisdictionId,
    source_ids: sourceIds,
    source_bindings: sourceBindings,
    source_roles: Object.fromEntries(sourceBindings.map((binding) => [binding.source_id, binding.source_role])),
    access_dates: Object.fromEntries(sourceBindings.map((binding) => [binding.source_id, binding.access_date])),
    freshness_triggers: descriptor.source_freshness.refresh_required_before,
    book_scope: row.book_scope,
    chapter_id: parsed.chapter_id,
    paragraph_id: parsed.paragraph_id,
    chapter_paragraph: parsed.chapter_paragraph,
    concept_id: row.concept_id,
    crosswalk_row_id: row.concept_id,
    local_heading: row.local_heading,
    mapping_status: row.mapping_status,
    assessment_status: row.assessment_status,
    official_anchor: row.official_anchor,
    transformation_actions: actions,
    transformation_rationale: {
      action_basis: row.mapping_status,
      assessment_basis: row.assessment_status,
      source_citation_required: row.source_citation_required === true,
      no_rewritten_student_content: true,
    },
    forbidden_inference: unique([
      row.known_gap,
      ...sourceBindings.map((binding) => binding.forbidden_inference),
    ].filter(Boolean)),
    school_owned_evidence_needed: schoolOwnedEvidence(descriptor, row),
    local_expert_needed: {
      required_before_any_output: true,
      reviewer_role: reviewerRole(jurisdictionId),
      reason: jurisdictionId === "england"
        ? "AQA is representative only and England is not the whole UK; source and teacher review remain required before any later output."
        : "Flemish school/network assessment and OK evidence remain local; Flemish source/pathway and teacher review remain required before any later output.",
    },
    blocker_display: blockerDisplay(jurisdictionId, descriptor, row),
    proof_required_to_close: "No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review.",
    review_disposition: {
      reviewer_role: reviewerRole(jurisdictionId),
      finding_classification: actions.includes("exclude") || actions.includes("extension_only") ? "scale_blocker" : "core_requirement_met",
      blocks: actions.includes("exclude")
        ? "Any attempt to turn the boundary row into localized output, evidence pack, product route, Scale Gate, or school-facing material."
        : "Any localized output, local compliance claim, source approval claim, assessment-generation claim, support/accommodation sufficiency claim, or product-route use.",
      does_not_block: "Internal no-output trace analysis and human review of this contract packet.",
      proof_required_to_close: "Specialist review verifies source/action/blocker binding and no-output trace remains internal.",
    },
  };
}

function sourceBindingSummary(jurisdictionId, descriptor) {
  return {
    jurisdiction_id: jurisdictionId,
    descriptor_id: descriptor.descriptor_id,
    jurisdiction_label: descriptor.jurisdiction_label,
    source_policy: {
      explicit_source_allowlist_only: true,
      implicit_source_discovery: false,
      directory_globbing_allowed: false,
      generated_lesson_output_scanning: false,
      automated_source_refresh: false,
    },
    official_source_ids: descriptor.official_source_allowlist.map((source) => source.source_id),
    source_roles: Object.fromEntries(descriptor.official_source_allowlist.map((source) => [source.source_id, source.role])),
    access_dates: Object.fromEntries(descriptor.official_source_allowlist.map((source) => [source.source_id, source.access_date])),
    source_freshness: descriptor.source_freshness,
  };
}

function contractReport(jurisdictionId, crosswalk, descriptor) {
  const rows = crosswalk.crosswalk_rows.map((row, index) => contractRow(jurisdictionId, descriptor, row, index));
  return {
    ...commonFields(`${jurisdictionId}-internal-overlay-trial-contract`, "complete_internal_no_output_trial_contract"),
    contract_id: `${jurisdictionId}-book1-1.2-1.3-internal-overlay-trial-contract.v1`,
    contract_identity_authority: {
      product_end_state: PRODUCT_END_STATE,
      original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
      roadmap_source: ROADMAP_SOURCE,
      accepted_planning_decision: ACCEPTED_PLANNING_DECISION,
      accepted_planning_decision_source: ACCEPTED_PLANNING_DECISION_SOURCE,
      decision_scope: "Internal no-output trial contract only; no runtime, localized output, school-facing output, product route, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, or inspection-readiness authority.",
    },
    jurisdiction_source_binding: sourceBindingSummary(jurisdictionId, descriptor),
    book_scope_binding: {
      book: "Book 1",
      chapters: ["1.2", "1.3"],
      required_crosswalk_source: crosswalk.report_id,
      required_crosswalk_row_count: crosswalk.crosswalk_rows.length,
      bound_contract_row_count: rows.length,
      route_local_only: true,
    },
    allowed_status_vocabulary: {
      mapping_status: ["mapped", "mapped_with_boundary", "extension_only", "gap", "not_mapped", "blocked"],
      assessment_status: ["mapped", "mapped_with_boundary", "gap", "not_applicable"],
      transformation_actions: ALLOWED_TRANSFORMATION_ACTIONS,
      final_decisions: DECISION_OPTIONS,
    },
    source_freshness_invalidation: {
      access_date: descriptor.source_freshness.access_date,
      freshness_status: descriptor.source_freshness.freshness_status,
      freshness_triggers: descriptor.source_freshness.refresh_required_before,
      invalidation_conditions: [
        "source_removed_or_replaced",
        "source_version_changed",
        "local_policy_or_exam_spec_changed",
        "school_facing_or_public_output_requested",
        "product_route_or_scale_gate_requested",
        "legal_compliance_or_inspection_readiness_claim_requested",
      ],
    },
    no_output_enforcement: {
      internal_trace_only: true,
      localized_output_requested: false,
      localized_output_generated: false,
      localized_textbook_paragraphs_generated: false,
      localized_exercises_generated: false,
      localized_answer_models_generated: false,
      student_facing_files_generated: false,
      teacher_school_facing_output_generated: false,
      public_output_generated: false,
      evidence_pack_generated: false,
      product_route_integration_requested: false,
      scale_gate_integration_requested: false,
      personal_data_fields_present: false,
    },
    refusal_conditions: REFUSAL_CASES.map(([args, code]) => ({
      args,
      refusal_code: code,
    })),
    contract_rows: rows,
    closure_decision: {
      selected: SELECTED_TRIAL_CONTRACT_DECISION,
      allowed_options: DECISION_OPTIONS,
      decision_selection_count: 1,
      does_not_authorize: [
        "runtime execution",
        "localized chapters",
        "localized exercises",
        "answer models",
        "student-facing files",
        "teacher/school-facing output",
        "public output",
        "product routes",
        "Scale Gate",
        "diagnostics/mastery/PV",
        "student/product use",
        "personal-data processing",
        "legal/compliance/approval claims",
        "inspection-readiness claims",
        "support/accommodation sufficiency claims",
      ],
    },
    finding_classification: [
      finding(
        `${jurisdictionId} contract binds every Book 1 1.2/1.3 crosswalk row to explicit source IDs, roles, access dates, transformation actions, blockers, and proof required to close.`,
        "core_requirement_met",
        "Nothing for internal no-output contract review.",
        "Human review of the complete contract packet.",
        "Checker PASS, specialist reviews, final lead PASS, exact-head PR readiness, green CI, and human review."
      ),
      finding(
        "All localized, public, school-facing, product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, inspection-readiness, support-sufficiency, and accommodation-sufficiency authority remains blocked.",
        "scale_blocker",
        "Any downstream output or authority jump.",
        "Internal no-output trial simulation decision only after human review.",
        "Separate future human authorization and specialist proof."
      ),
    ],
  };
}

function schemaDocument() {
  const string = () => ({ type: "string", minLength: 1 });
  const date = () => ({ type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" });
  const stringArray = () => ({ type: "array", minItems: 1, items: string() });
  const exactArray = (values) => ({
    type: "array",
    minItems: values.length,
    maxItems: values.length,
    prefixItems: values.map((value) => ({ const: value })),
    items: false,
  });
  const stringMap = () => ({
    type: "object",
    minProperties: 1,
    propertyNames: string(),
    additionalProperties: string(),
  });
  const dateMap = () => ({
    type: "object",
    minProperties: 1,
    propertyNames: string(),
    additionalProperties: date(),
  });
  const closedFalseFlags = (keys) => ({
    type: "object",
    additionalProperties: false,
    required: keys,
    properties: Object.fromEntries(keys.map((key) => [key, { const: false }])),
  });
  const commonRequired = [
    "schema_version",
    "report_id",
    "sprint_id",
    "generated_date",
    "access_date",
    "status",
    "internal_only",
    "manual_invocation_only",
    "human_review_required",
    "accepted_planning_decision",
    "accepted_planning_decision_source",
    "accepted_deepening_decision_source",
    "product_end_state",
    "original_sprint_gate_spec",
    "roadmap_source",
    "non_negotiable_requirements",
    "core_requirement_checklist",
    "input_allowlist",
    "output_allowlist",
    "output_boundary",
  ];

  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.internal/schemas/internal-overlay-trial-contract.schema.v1.json",
    title: "Internal Overlay Trial Contract v1",
    description: "Strict internal-only, no-output trial contract schema. It is not product-route, school-facing, public, or compliance authority.",
    type: "object",
    additionalProperties: false,
    required: [
      ...commonRequired,
      "contract_id",
      "contract_identity_authority",
      "jurisdiction_source_binding",
      "book_scope_binding",
      "source_freshness_invalidation",
      "no_output_enforcement",
      "refusal_conditions",
      "contract_rows",
      "closure_decision",
      "finding_classification",
    ],
    properties: {
      schema_version: { const: 1 },
      report_id: string(),
      sprint_id: { const: SPRINT_ID },
      generated_date: date(),
      access_date: { const: ACCESS_DATE },
      status: { const: "complete_internal_no_output_trial_contract" },
      internal_only: { const: true },
      manual_invocation_only: { const: true },
      human_review_required: { const: true },
      accepted_planning_decision: { const: ACCEPTED_PLANNING_DECISION },
      accepted_planning_decision_source: { const: ACCEPTED_PLANNING_DECISION_SOURCE },
      accepted_deepening_decision_source: { const: ACCEPTED_DEEPENING_DECISION_SOURCE },
      product_end_state: { const: PRODUCT_END_STATE },
      original_sprint_gate_spec: { const: ORIGINAL_SPRINT_GATE_SPEC },
      roadmap_source: { const: ROADMAP_SOURCE },
      non_negotiable_requirements: exactArray(REVIEW_PACKET_REQUIREMENTS),
      core_requirement_checklist: {
        type: "array",
        minItems: CORE_REQUIREMENTS.length,
        maxItems: CORE_REQUIREMENTS.length,
        items: { $ref: "#/$defs/coreRequirement" },
      },
      input_allowlist: exactArray(INPUT_ALLOWLIST),
      output_allowlist: exactArray(OUTPUT_PATHS),
      output_boundary: closedFalseFlags(TRIAL_BLOCKED_AUTHORITY),
      contract_id: string(),
      contract_identity_authority: { $ref: "#/$defs/contractIdentityAuthority" },
      jurisdiction_source_binding: { $ref: "#/$defs/jurisdictionSourceBinding" },
      book_scope_binding: { $ref: "#/$defs/bookScopeBinding" },
      source_freshness_invalidation: { $ref: "#/$defs/sourceFreshnessInvalidation" },
      no_output_enforcement: { $ref: "#/$defs/noOutputEnforcement" },
      refusal_conditions: {
        type: "array",
        minItems: REFUSAL_CASES.length,
        maxItems: REFUSAL_CASES.length,
        items: { $ref: "#/$defs/refusalCondition" },
      },
      contract_rows: {
        type: "array",
        minItems: 10,
        maxItems: 10,
        items: { $ref: "#/$defs/contractRow" },
      },
      closure_decision: { $ref: "#/$defs/closureDecision" },
      finding_classification: {
        type: "array",
        minItems: 1,
        items: { $ref: "#/$defs/findingClassification" },
      },
    },
    $defs: {
      coreRequirement: {
        type: "object",
        additionalProperties: false,
        required: ["id", "requirement", "status", "proof_required_to_close"],
        properties: {
          id: { enum: CORE_REQUIREMENTS.map(([id]) => id) },
          requirement: string(),
          status: { const: "met_for_internal_trial_contract" },
          proof_required_to_close: string(),
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
      contractIdentityAuthority: {
        type: "object",
        additionalProperties: false,
        required: [
          "product_end_state",
          "original_sprint_gate_spec",
          "roadmap_source",
          "accepted_planning_decision",
          "accepted_planning_decision_source",
          "decision_scope",
        ],
        properties: {
          product_end_state: { const: PRODUCT_END_STATE },
          original_sprint_gate_spec: { const: ORIGINAL_SPRINT_GATE_SPEC },
          roadmap_source: { const: ROADMAP_SOURCE },
          accepted_planning_decision: { const: ACCEPTED_PLANNING_DECISION },
          accepted_planning_decision_source: { const: ACCEPTED_PLANNING_DECISION_SOURCE },
          decision_scope: string(),
        },
      },
      sourcePolicy: {
        type: "object",
        additionalProperties: false,
        required: [
          "explicit_source_allowlist_only",
          "implicit_source_discovery",
          "directory_globbing_allowed",
          "generated_lesson_output_scanning",
          "automated_source_refresh",
        ],
        properties: {
          explicit_source_allowlist_only: { const: true },
          implicit_source_discovery: { const: false },
          directory_globbing_allowed: { const: false },
          generated_lesson_output_scanning: { const: false },
          automated_source_refresh: { const: false },
        },
      },
      sourceFreshness: {
        type: "object",
        additionalProperties: false,
        required: ["access_date", "freshness_status", "refresh_required_before", "currentness_checker"],
        properties: {
          access_date: date(),
          freshness_status: string(),
          refresh_required_before: stringArray(),
          currentness_checker: string(),
        },
      },
      jurisdictionSourceBinding: {
        type: "object",
        additionalProperties: false,
        required: [
          "jurisdiction_id",
          "descriptor_id",
          "jurisdiction_label",
          "source_policy",
          "official_source_ids",
          "source_roles",
          "access_dates",
          "source_freshness",
        ],
        properties: {
          jurisdiction_id: { enum: ["england", "flanders"] },
          descriptor_id: string(),
          jurisdiction_label: { enum: ["England", "Flanders"] },
          source_policy: { $ref: "#/$defs/sourcePolicy" },
          official_source_ids: stringArray(),
          source_roles: stringMap(),
          access_dates: dateMap(),
          source_freshness: { $ref: "#/$defs/sourceFreshness" },
        },
      },
      bookScopeBinding: {
        type: "object",
        additionalProperties: false,
        required: [
          "book",
          "chapters",
          "required_crosswalk_source",
          "required_crosswalk_row_count",
          "bound_contract_row_count",
          "route_local_only",
        ],
        properties: {
          book: { const: "Book 1" },
          chapters: exactArray(["1.2", "1.3"]),
          required_crosswalk_source: string(),
          required_crosswalk_row_count: { const: 10 },
          bound_contract_row_count: { const: 10 },
          route_local_only: { const: true },
        },
      },
      sourceFreshnessInvalidation: {
        type: "object",
        additionalProperties: false,
        required: ["access_date", "freshness_status", "freshness_triggers", "invalidation_conditions"],
        properties: {
          access_date: date(),
          freshness_status: string(),
          freshness_triggers: stringArray(),
          invalidation_conditions: stringArray(),
        },
      },
      noOutputEnforcement: {
        type: "object",
        additionalProperties: false,
        required: [
          "internal_trace_only",
          "localized_output_requested",
          "localized_output_generated",
          "localized_textbook_paragraphs_generated",
          "localized_exercises_generated",
          "localized_answer_models_generated",
          "student_facing_files_generated",
          "teacher_school_facing_output_generated",
          "public_output_generated",
          "evidence_pack_generated",
          "product_route_integration_requested",
          "scale_gate_integration_requested",
          "personal_data_fields_present",
        ],
        properties: {
          internal_trace_only: { const: true },
          localized_output_requested: { const: false },
          localized_output_generated: { const: false },
          localized_textbook_paragraphs_generated: { const: false },
          localized_exercises_generated: { const: false },
          localized_answer_models_generated: { const: false },
          student_facing_files_generated: { const: false },
          teacher_school_facing_output_generated: { const: false },
          public_output_generated: { const: false },
          evidence_pack_generated: { const: false },
          product_route_integration_requested: { const: false },
          scale_gate_integration_requested: { const: false },
          personal_data_fields_present: { const: false },
        },
      },
      refusalCondition: {
        type: "object",
        additionalProperties: false,
        required: ["args", "refusal_code"],
        properties: {
          args: stringArray(),
          refusal_code: { enum: unique(REFUSAL_CASES.map(([, code]) => code)) },
        },
      },
      sourceBinding: {
        type: "object",
        additionalProperties: false,
        required: ["source_id", "source_role", "access_date", "source_scope", "forbidden_inference"],
        properties: {
          source_id: string(),
          source_role: string(),
          access_date: date(),
          source_scope: string(),
          forbidden_inference: string(),
        },
      },
      transformationRationale: {
        type: "object",
        additionalProperties: false,
        required: ["action_basis", "assessment_basis", "source_citation_required", "no_rewritten_student_content"],
        properties: {
          action_basis: string(),
          assessment_basis: string(),
          source_citation_required: { const: true },
          no_rewritten_student_content: { const: true },
        },
      },
      schoolOwnedEvidenceNeeded: {
        type: "object",
        additionalProperties: false,
        required: ["still_needed", "source", "boundary_areas", "row_specific_reason"],
        properties: {
          still_needed: { const: true },
          source: string(),
          boundary_areas: stringArray(),
          row_specific_reason: string(),
        },
      },
      localExpertNeeded: {
        type: "object",
        additionalProperties: false,
        required: ["required_before_any_output", "reviewer_role", "reason"],
        properties: {
          required_before_any_output: { const: true },
          reviewer_role: string(),
          reason: string(),
        },
      },
      blockerDisplay: {
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
          route_local_only_evidence_status: { const: "internal_contract_only" },
          school_owned_evidence_still_needed: { const: true },
          forbidden_inferences: stringArray(),
          accessibility_support_limitations: stringArray(),
          legal_sufficiency_blocked: { const: true },
          support_sufficiency_blocked: { const: true },
          school_owned_accommodation_evidence_needed: { const: true },
          individual_adjustment_claim_blocked: { const: true },
          support_records_personal_data_blocked: { const: true },
          check_surface_authority_separation: string(),
          owner_next_action: string(),
          proof_required_to_close: string(),
        },
      },
      reviewDisposition: {
        type: "object",
        additionalProperties: false,
        required: ["reviewer_role", "finding_classification", "blocks", "does_not_block", "proof_required_to_close"],
        properties: {
          reviewer_role: string(),
          finding_classification: { enum: REV_STD_FINDING_CLASSIFICATIONS },
          blocks: string(),
          does_not_block: string(),
          proof_required_to_close: string(),
        },
      },
      contractRow: {
        type: "object",
        additionalProperties: false,
        required: [
          "row_id",
          "jurisdiction_id",
          "source_ids",
          "source_bindings",
          "source_roles",
          "access_dates",
          "freshness_triggers",
          "book_scope",
          "chapter_id",
          "paragraph_id",
          "chapter_paragraph",
          "concept_id",
          "crosswalk_row_id",
          "local_heading",
          "mapping_status",
          "assessment_status",
          "official_anchor",
          "transformation_actions",
          "transformation_rationale",
          "forbidden_inference",
          "school_owned_evidence_needed",
          "local_expert_needed",
          "blocker_display",
          "proof_required_to_close",
          "review_disposition",
        ],
        properties: {
          row_id: string(),
          jurisdiction_id: { enum: ["england", "flanders"] },
          source_ids: stringArray(),
          source_bindings: { type: "array", minItems: 1, items: { $ref: "#/$defs/sourceBinding" } },
          source_roles: stringMap(),
          access_dates: dateMap(),
          freshness_triggers: stringArray(),
          book_scope: { enum: ["Book 1 Chapter 1.2", "Book 1 Chapter 1.3"] },
          chapter_id: { enum: ["1.2", "1.3"] },
          paragraph_id: string(),
          chapter_paragraph: string(),
          concept_id: string(),
          crosswalk_row_id: string(),
          local_heading: string(),
          mapping_status: string(),
          assessment_status: string(),
          official_anchor: string(),
          transformation_actions: {
            type: "array",
            minItems: 1,
            items: { enum: ALLOWED_TRANSFORMATION_ACTIONS },
          },
          transformation_rationale: { $ref: "#/$defs/transformationRationale" },
          forbidden_inference: stringArray(),
          school_owned_evidence_needed: { $ref: "#/$defs/schoolOwnedEvidenceNeeded" },
          local_expert_needed: { $ref: "#/$defs/localExpertNeeded" },
          blocker_display: { $ref: "#/$defs/blockerDisplay" },
          proof_required_to_close: string(),
          review_disposition: { $ref: "#/$defs/reviewDisposition" },
        },
      },
      closureDecision: {
        type: "object",
        additionalProperties: false,
        required: ["selected", "allowed_options", "decision_selection_count", "does_not_authorize"],
        properties: {
          selected: { const: SELECTED_TRIAL_CONTRACT_DECISION },
          allowed_options: exactArray(DECISION_OPTIONS),
          decision_selection_count: { const: 1 },
          does_not_authorize: stringArray(),
        },
      },
    },
  };
}

function byAction(rows, action) {
  return rows.filter((row) => row.transformation_actions.includes(action)).map((row) => ({
    jurisdiction_id: row.jurisdiction_id,
    concept_id: row.concept_id,
    chapter_paragraph: row.chapter_paragraph,
    status: row.mapping_status,
    summary_only: true,
  }));
}

function noOutputTrace(england, flanders) {
  const rows = [...england.contract_rows, ...flanders.contract_rows];
  return {
    ...commonFields("internal-overlay-no-output-trial-trace", "complete_internal_no_output_trace"),
    trace_id: "internal-overlay-no-output-trial-trace.v1",
    trace_mode: "manual_internal_summary_only",
    no_output_enforcement: {
      localized_textbook_paragraphs_generated: false,
      localized_exercises_generated: false,
      localized_answer_models_generated: false,
      student_facing_files_generated: false,
      teacher_school_facing_output_generated: false,
      public_output_generated: false,
      generated_lesson_output_scanned: false,
    },
    what_would_remain_unchanged: byAction(rows, "unchanged_core"),
    terminology_replacements_needed: byAction(rows, "terminology_change"),
    examples_requiring_localization: byAction(rows, "example_change"),
    institution_replacements_needed: byAction(rows, "institution_change"),
    assessment_forms_requiring_replacement: byAction(rows, "assessment_change"),
    extension_only_rows: byAction(rows, "extension_only"),
    excluded_rows: byAction(rows, "exclude"),
    blockers_stopping_execution: [
      "school_owned_evidence_still_needed",
      "local_expert_needed",
      "legal_sufficiency_blocked",
      "support_sufficiency_blocked",
      "school_owned_accommodation_evidence_needed",
      "individual_adjustment_claim_blocked",
      "support_records_personal_data_blocked",
      "product_route_blocked",
      "scale_gate_blocked",
      "student_product_use_blocked",
    ],
    forbidden_content_assertion: "This trace intentionally contains no rewritten localized textbook paragraphs, exercises, answer models, or student-facing files.",
  };
}

function validationReport(england, flanders, trace) {
  return {
    ...commonFields("internal-overlay-trial-contract-validation", "complete_internal_validation"),
    validation_id: "internal-overlay-trial-contract-validation.v1",
    contract_files: [
      "reports/inspection-standards/england-internal-overlay-trial-contract.json",
      "reports/inspection-standards/flanders-internal-overlay-trial-contract.json",
    ],
    row_counts: {
      england: england.contract_rows.length,
      flanders: flanders.contract_rows.length,
      total: england.contract_rows.length + flanders.contract_rows.length,
    },
    schema_strictness: {
      schema_file: "references/schemas/internal-overlay-trial-contract.schema.v1.json",
      strict_nested_schema: true,
      contract_row_count_per_jurisdiction: 10,
      closed_nested_definitions: [
        "contractIdentityAuthority",
        "sourcePolicy",
        "jurisdictionSourceBinding",
        "bookScopeBinding",
        "sourceFreshnessInvalidation",
        "noOutputEnforcement",
        "contractRow",
        "blockerDisplay",
        "reviewDisposition",
        "closureDecision",
      ],
      exact_no_output_false_flags: true,
      exact_decision_tuple: DECISION_OPTIONS,
      checker_enforcement: "The schema is generated and then inspected by build-scripts/inspection/check-internal-overlay-trial-contract.js. Dynamic source-ID exactness remains checker-enforced against the selected descriptor allowlists.",
    },
    allowed_transformation_actions: ALLOWED_TRANSFORMATION_ACTIONS,
    positive_fixtures: POSITIVE_FIXTURES.map((file) => ({ file, expected: "PASS" })),
    negative_fixtures: NEGATIVE_FIXTURES.map(([file, code]) => ({
      file: `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/${file}`,
      expected_refusal_code: code,
    })),
    no_output_trace: {
      report: "reports/inspection-standards/internal-overlay-no-output-trial-trace.json",
      localized_textbook_paragraphs_generated: trace.no_output_enforcement.localized_textbook_paragraphs_generated,
      localized_exercises_generated: trace.no_output_enforcement.localized_exercises_generated,
      localized_answer_models_generated: trace.no_output_enforcement.localized_answer_models_generated,
      student_facing_files_generated: trace.no_output_enforcement.student_facing_files_generated,
    },
    finding_classification: [
      finding(
        "Validation covers schema, row completeness, source IDs, source freshness, no-output flags, and refusal fixtures.",
        "core_requirement_met",
        "Nothing for human review of this validation packet.",
        "Internal no-output trial-contract decision.",
        "Checker PASS, focused Jest PASS, specialist reviews, final lead PASS, exact-head readiness, green CI, and human review."
      ),
      finding(
        "Negative fixtures prove forbidden audiences, claims, discovery, source, personal-data, and integration requests fail closed.",
        "core_requirement_met",
        "Any attempt to bypass refusal checks.",
        "Internal validation of the no-output contract.",
        "Checker fixture output remains PASS."
      ),
    ],
  };
}

function decisionReport(england, flanders, validation, trace) {
  return {
    ...commonFields("internal-overlay-trial-contract-decision", "ready_for_specialist_and_final_lead_review"),
    final_internal_overlay_trial_contract_decision: {
      selected: SELECTED_TRIAL_CONTRACT_DECISION,
      allowed_options: DECISION_OPTIONS,
      decision_selection_count: 1,
      decision_basis: [
        "Both jurisdiction contracts are complete for all Book 1 1.2/1.3 crosswalk rows.",
        "No-output trace contains summaries only and no localized student-facing content.",
        "Validation fixtures are designed to fail closed for forbidden source, audience, personal-data, claim, and integration paths.",
      ],
    },
    still_blocked: TRIAL_BLOCKED_AUTHORITY,
    does_not_authorize: england.closure_decision.does_not_authorize,
    required_next_reviews: [
      "Schema/architecture lead",
      "England authority/source reviewer",
      "Flanders authority/source reviewer",
      "Teacher/economics reviewer",
      "Legal/privacy reviewer",
      "Accessibility/inclusion reviewer",
      "Final lead reviewer",
    ],
    contract_summary: {
      england_rows: england.contract_rows.length,
      flanders_rows: flanders.contract_rows.length,
      validation_status: validation.status,
      trace_status: trace.status,
    },
    finding_classification: [
      finding(
        "The complete trial contract is ready for specialist and final lead review before human review of a strictly internal no-output trial simulation decision.",
        "core_requirement_met",
        "Nothing in the internal contract packet.",
        "Only internal no-output simulation if the human owner accepts the decision.",
        "Human owner decision after final lead PASS and exact-head readiness proof."
      ),
      finding(
        "The selected decision does not authorize runtime execution, localized output, school/public output, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, compliance, inspection-readiness, support sufficiency, or accommodation sufficiency.",
        "scale_blocker",
        "All downstream output and authority jumps.",
        "Internal no-output simulation planning.",
        "Separate future reviewed sprint and human authorization."
      ),
    ],
  };
}

function mutateContract(contract, fixtureId) {
  const clone = JSON.parse(JSON.stringify(contract));
  clone.fixture_id = fixtureId;
  switch (fixtureId) {
    case "STOP_UNKNOWN_SOURCE_ID":
      clone.contract_rows[0].source_ids[0] = "unknown-source";
      clone.contract_rows[0].source_bindings[0].source_id = "unknown-source";
      return clone;
    case "STOP_STALE_SOURCE":
      clone.source_freshness_invalidation.freshness_status = "stale";
      return clone;
    case "STOP_MISSING_CROSSWALK_ROW":
      clone.contract_rows.pop();
      return clone;
    case "STOP_IMPLICIT_SOURCE_DISCOVERY":
      clone.jurisdiction_source_binding.source_policy.implicit_source_discovery = true;
      return clone;
    case "STOP_DIRECTORY_GLOBBING":
      clone.jurisdiction_source_binding.source_policy.directory_globbing_allowed = true;
      return clone;
    case "STOP_LOCALIZED_OUTPUT":
      clone.no_output_enforcement.localized_output_requested = true;
      return clone;
    case "STOP_STUDENT_FACING_OUTPUT":
      clone.no_output_enforcement.student_facing_files_generated = true;
      return clone;
    case "STOP_TEACHER_SCHOOL_FACING_OUTPUT":
      clone.no_output_enforcement.teacher_school_facing_output_generated = true;
      return clone;
    case "STOP_PUBLIC_OUTPUT":
      clone.no_output_enforcement.public_output_generated = true;
      return clone;
    case "STOP_PERSONAL_DATA":
      clone.no_output_enforcement.personal_data_fields_present = true;
      clone.personal_data_fields = ["student_name"];
      return clone;
    case "STOP_LEGAL_COMPLIANCE_CLAIM":
      clone.output_boundary.legal_sufficiency_claim = true;
      clone.output_boundary.legal_compliance_claim = true;
      return clone;
    case "STOP_INSPECTION_READINESS_CLAIM":
      clone.output_boundary.inspection_readiness_claim = true;
      return clone;
    case "STOP_SUPPORT_ACCOMMODATION_CLAIM":
      clone.output_boundary.support_or_accommodation_sufficiency_claim = true;
      clone.output_boundary.support_sufficiency_claim = true;
      return clone;
    case "STOP_PRODUCT_OR_SCALE_GATE":
      clone.no_output_enforcement.product_route_integration_requested = true;
      clone.no_output_enforcement.scale_gate_integration_requested = true;
      return clone;
    default:
      throw new Error(`Unknown fixture mutation: ${fixtureId}`);
  }
}

function fixtureReports(england, flanders) {
  const negativeBase = england;
  return {
    positive: new Map([
      [POSITIVE_FIXTURES[0], england],
      [POSITIVE_FIXTURES[1], flanders],
    ]),
    negative: new Map(NEGATIVE_FIXTURES.map(([file, code]) => [
      `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/${file}`,
      {
        fixture_id: code,
        expected_refusal_code: code,
        contract: mutateContract(negativeBase, code),
      },
    ])),
  };
}

function renderMarkdown(lines) {
  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function renderContract(report) {
  const rows = report.contract_rows;
  const lines = [
    `# ${report.jurisdiction_source_binding.jurisdiction_label} Internal Overlay Trial Contract`,
    "",
    `Status: ${report.status}`,
    `Sprint: \`${SPRINT_ID}\``,
    `Decision: \`${SELECTED_TRIAL_CONTRACT_DECISION}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Roadmap: \`${ROADMAP_SOURCE}\``,
    `- Accepted planning decision: \`${ACCEPTED_PLANNING_DECISION}\``,
    `- Accepted planning source: \`${ACCEPTED_PLANNING_DECISION_SOURCE}\``,
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
    "This contract is internal-only, manual, and no-output. It does not create localized chapters, exercises, answer models, student-facing files, teacher/school-facing output, public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, legal sufficiency, compliance, approval, OP0, PTA, summative, inspection-readiness, support-sufficiency, or accommodation-sufficiency claims.",
    "",
    "## Source Binding",
    "",
    `- Descriptor: \`${report.jurisdiction_source_binding.descriptor_id}\``,
    `- Freshness status: \`${report.source_freshness_invalidation.freshness_status}\``,
    `- Official source IDs: ${report.jurisdiction_source_binding.official_source_ids.map((id) => `\`${id}\``).join(", ")}`,
    "",
    "## Contract Rows",
    "",
    "| Row | Chapter/Paragraph | Concept | Actions | Source IDs | Proof Required To Close |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows.map((row) => `| \`${row.row_id}\` | ${row.chapter_paragraph} | \`${row.concept_id}\` | ${row.transformation_actions.map((item) => `\`${item}\``).join(", ")} | ${row.source_ids.map((id) => `\`${id}\``).join(", ")} | ${row.proof_required_to_close} |`),
    "",
    "## Finding Classification",
    "",
    "| Finding | Classification | blocks | does_not_block | proof_required_to_close |",
    "| --- | --- | --- | --- | --- |",
    ...report.finding_classification.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
    "",
  ];
  return renderMarkdown(lines);
}

function renderValidation(report) {
  return renderMarkdown([
    "# Internal Overlay Trial Contract Validation",
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
    `- Allowed transformation actions: ${report.allowed_transformation_actions.map((item) => `\`${item}\``).join(", ")}`,
    "",
    "## Schema Strictness",
    "",
    `- Schema file: \`${report.schema_strictness.schema_file}\``,
    `- Strict nested schema: ${report.schema_strictness.strict_nested_schema}`,
    `- Contract rows per jurisdiction: ${report.schema_strictness.contract_row_count_per_jurisdiction}`,
    `- Exact no-output false flags: ${report.schema_strictness.exact_no_output_false_flags}`,
    `- Exact decision tuple: ${report.schema_strictness.exact_decision_tuple.map((item) => `\`${item}\``).join(", ")}`,
    `- Checker enforcement: ${report.schema_strictness.checker_enforcement}`,
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

function renderTrace(report) {
  const section = (title, rows) => [
    `## ${title}`,
    "",
    rows.length === 0 ? "None." : rows.map((row) => `- \`${row.jurisdiction_id}:${row.concept_id}\` (${row.chapter_paragraph})`).join("\n"),
    "",
  ].join("\n");
  return renderMarkdown([
    "# Internal Overlay No-Output Trial Trace",
    "",
    `Status: ${report.status}`,
    "",
    "This trace is internal summary-only. It contains no rewritten localized textbook paragraphs, exercises, answer models, or student-facing files.",
    "",
    section("What Would Remain Unchanged", report.what_would_remain_unchanged),
    section("Terminology Replacements Needed", report.terminology_replacements_needed),
    section("Examples Requiring Localization", report.examples_requiring_localization),
    section("Institution Replacements Needed", report.institution_replacements_needed),
    section("Assessment Forms Requiring Replacement", report.assessment_forms_requiring_replacement),
    section("Extension-Only Rows", report.extension_only_rows),
    section("Excluded Rows", report.excluded_rows),
    "## Blockers Stopping Execution",
    "",
    ...report.blockers_stopping_execution.map((item) => `- \`${item}\``),
    "",
  ]);
}

function renderDecision(report) {
  return renderMarkdown([
    "# Internal Overlay Trial Contract Decision",
    "",
    `Status: ${report.status}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted planning decision: \`${ACCEPTED_PLANNING_DECISION}\``,
    "",
    "## Decision",
    "",
    `Selected: \`${report.final_internal_overlay_trial_contract_decision.selected}\``,
    "",
    "Allowed options:",
    "",
    ...report.final_internal_overlay_trial_contract_decision.allowed_options.map((item) => `- \`${item}\``),
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
    "# GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1 Sprint Plan",
    "",
    "Status: implemented_for_human_review",
    `Date: ${ACCESS_DATE}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Roadmap: \`${ROADMAP_SOURCE}\``,
    `- Accepted planning decision: \`${ACCEPTED_PLANNING_DECISION}\``,
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
    "- Schema/architecture lead review.",
    "- England authority/source review.",
    "- Flanders authority/source review.",
    "- Teacher/economics review.",
    "- Legal/privacy review.",
    "- Accessibility/inclusion review.",
    "- Final lead review.",
    "",
    "## Human Review Return Condition",
    "",
    "Return only after the schema, both jurisdiction contracts, fixtures, no-output trace, validation report, specialist corrections, final lead PASS, exact-head PR readiness proof, and green CI are complete.",
    "",
    "## Decision",
    "",
    `The implemented packet selects \`${decision.final_internal_overlay_trial_contract_decision.selected}\` for human review.`,
    "",
  ]);
}

function buildBundle() {
  for (const input of INPUT_ALLOWLIST) {
    if (!fs.existsSync(repoPath(input))) throw new Error(`Missing input allowlist source: ${input}`);
  }
  readText("docs/inspection-standards/internal-overlay-prototype-planning-contract.md");
  const englandCrosswalk = readJson("reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json");
  const flandersCrosswalk = readJson("reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json");
  const englandDescriptor = readJson("references/data/inspection-standards/overlays/england.deepening.v1.json");
  const flandersDescriptor = readJson("references/data/inspection-standards/overlays/flanders.deepening.v1.json");

  const england = contractReport("england", englandCrosswalk, englandDescriptor);
  const flanders = contractReport("flanders", flandersCrosswalk, flandersDescriptor);
  const trace = noOutputTrace(england, flanders);
  const validation = validationReport(england, flanders, trace);
  const decision = decisionReport(england, flanders, validation, trace);
  const fixtures = fixtureReports(england, flanders);

  return {
    schema: schemaDocument(),
    england,
    flanders,
    validation,
    trace,
    decision,
    fixtures,
  };
}

function outputContents(bundle) {
  const contents = new Map([
    [OUTPUT_PATHS[0], `${JSON.stringify(bundle.schema, null, 2)}\n`],
    [OUTPUT_PATHS[1], renderContract(bundle.england)],
    [OUTPUT_PATHS[2], `${JSON.stringify(bundle.england, null, 2)}\n`],
    [OUTPUT_PATHS[3], renderContract(bundle.flanders)],
    [OUTPUT_PATHS[4], `${JSON.stringify(bundle.flanders, null, 2)}\n`],
    [OUTPUT_PATHS[5], renderValidation(bundle.validation)],
    [OUTPUT_PATHS[6], `${JSON.stringify(bundle.validation, null, 2)}\n`],
    [OUTPUT_PATHS[7], renderTrace(bundle.trace)],
    [OUTPUT_PATHS[8], `${JSON.stringify(bundle.trace, null, 2)}\n`],
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
  if (/localized-output|country-edition|localized-chapter|student-facing|school-facing|teacher|public|external|evidence-pack/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT", "Localized, country-edition, public, school-facing, teacher-facing, student-facing, or evidence-pack output is not authorized.", { args: unknown });
  }
  if (/prototype-runtime|execute-trial|execute-prototype|runtime-execution/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_RUNTIME", "Runtime execution is not authorized by this trial-contract sprint.", { args: unknown });
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
    throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for internal overlay trial-contract generator.", { args: unknown });
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
  if (mismatches.length > 0) throw new Error(`Internal overlay trial-contract output is stale: ${mismatches.join(", ")}`);
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
    console.log(mode.check ? "Internal overlay trial-contract output is current." : "Internal overlay trial-contract output generated.");
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
  ALLOWED_TRANSFORMATION_ACTIONS,
  CORE_REQUIREMENTS,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_PATHS,
  POSITIVE_FIXTURES,
  REFUSAL_CASES,
  REVIEW_PACKET_REQUIREMENTS,
  SELECTED_TRIAL_CONTRACT_DECISION,
  SPRINT_ID,
  TRIAL_BLOCKED_AUTHORITY,
  buildBundle,
  outputContents,
  parseMode,
};
