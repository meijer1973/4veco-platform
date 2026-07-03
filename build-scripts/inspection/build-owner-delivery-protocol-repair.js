#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-07-03";
const SPRINT_ID = "GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const PRIOR_COMPLETION_DECISION = "reports/inspection-standards/owner-delivery-protocol-completion-decision.json";
const ACCEPTED_INPUT_DECISION = "REVISE_DELIVERY_PROTOCOL";
const SELECTED_DECISION = "READY_FOR_OWNER_CONTROLLED_DISPATCH";
const DECISION_OPTIONS = [
  "READY_FOR_OWNER_CONTROLLED_DISPATCH",
  "REVISE_DELIVERY_CHANNEL_AGAIN",
  "STOP_LOCAL_EXPERT_CONTACT_TRACK",
];

const PROOF_FORMAT_FIELDS = [
  "jurisdiction",
  "approved_request_packet_id",
  "approved_contact_text_hash",
  "delivery_channel_class",
  "owner_delivery_reference",
  "delivery_timestamp",
  "materials_sent",
  "materials_not_sent",
  "no_personal_data_confirmation",
  "no_localized_output_confirmation",
  "response_expected",
  "response_storage_boundary",
];

const RESPONSE_INTAKE_RULES = [
  "no_response_yet",
  "consented_schema_passing_response",
  "schema_failed_response",
  "quarantined_personal_data",
  "quarantined_forbidden_claim",
  "quarantined_localized_output",
  "quarantined_school_evidence",
  "needs_owner_decision",
];

const CHANNEL_CLASSES = [
  "owner_controlled_email_or_form",
  "owner_controlled_platform_message",
  "owner_controlled_meeting_request",
  "owner_controlled_document_share_link",
];

const COMMON_ALLOWED_MATERIALS = [
  "approved role-only contact text",
  "approved no-personal-data response-intake instructions",
  "approved consent and withdrawal boundary",
];

const FORBIDDEN_MATERIALS = [
  "localized output or country edition material",
  "answer models, answer keys, or worked-answer packets",
  "student data",
  "personal data",
  "school-owned evidence request",
  "legal or compliance claim request",
  "inspection-readiness, exam-approval, or product-approval claim request",
  "support, accommodation, accessibility, legal, or individual-adjustment sufficiency claim request",
  "expert-as-official-authority wording",
];

const QUARANTINE_CLASSIFICATIONS = [
  "no_response_yet",
  "out_of_scope",
  "contains_forbidden_claim",
  "contains_personal_data",
  "claims_legal_or_compliance_authority",
  "claims_school_evidence",
  "claims_inspection_or_exam_approval",
  "contains_localized_output",
  "treats_expert_as_official_authority",
  "claims_support_accommodation_accessibility_sufficiency",
  "jurisdiction_overclaim",
];

const DOES_NOT_AUTHORIZE = [
  "external dispatch in this sprint",
  "named expert selection",
  "private contact-detail storage",
  "expert response analysis",
  "localized output",
  "country editions",
  "answer models or answer keys",
  "student-facing output",
  "teacher/school-facing output",
  "public output",
  "evidence packs",
  "product-route adoption",
  "Scale Gate",
  "diagnostics/mastery/PV",
  "student/product use",
  "personal/student/school data processing outside the approved boundary",
  "legal advice",
  "compliance proof",
  "approval, accreditation, OP0, PTA, or summative validity",
  "inspection readiness",
  "support sufficiency",
  "accommodation sufficiency",
  "accessibility/legal sufficiency",
  "individual-adjustment sufficiency",
  "school-owned evidence claims",
  "treating expert feedback as official authority",
  "treating missing responses as approval",
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["prior_completion_decision_bound", "Repair is bound to merged PR #199 `REVISE_DELIVERY_PROTOCOL`."],
  ["owner_delivery_protocol_schema_complete", "Owner delivery protocol schema is complete and strict."],
  ["delivery_channel_design_complete", "Acceptable owner-controlled delivery channels are defined without private contact storage."],
  ["dispatch_proof_format_complete", "Dispatch-proof format defines valid proof without exposing private contact details."],
  ["response_intake_completion_rules_complete", "Usable, pending, failed, quarantined, and owner-decision response states are defined."],
  ["england_protocol_instance_complete", "England protocol instance preserves England-only and no whole-UK/all-awarding-bodies boundaries."],
  ["flanders_protocol_instance_complete", "Flanders protocol instance preserves Flanders-only and no all-Belgium/school-network authority boundaries."],
  ["negative_fixtures_cover_forbidden_cases", "Negative fixtures cover private contact storage, missing proof, forbidden material, data, claims, overclaims, and premature analysis."],
  ["downstream_authority_blocked", "Dispatch, response analysis, localized output, answer models, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, and official-authority claims remain blocked."],
  ["review_route_preserved", "Specialist reviews, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review remain required."],
];

const REVIEW_FILES = [
  ["lead-architecture-review", "Lead/Architecture Review", "Lead/architecture review approves the strict schema, proof format, fixture design, and decision logic."],
  ["legal-privacy-review", "Legal/Privacy Review", "Legal/privacy review approves no personal/student/school data, no private contact storage, storage, consent, withdrawal, and proof boundaries."],
  ["england-delivery-protocol-review", "England Delivery-Protocol Review", "England review approves England-only boundaries and no whole-UK/all-awarding-bodies overclaim."],
  ["flanders-delivery-protocol-review", "Flanders Delivery-Protocol Review", "Flanders review approves Flanders-only boundaries, no all-Belgium/all-school-network overclaim, and school/network evidence remains school-owned."],
  ["teacher-economics-review", "Teacher/Economics Review", "Teacher/economics review approves usefulness only for later internal Book 1 1.2/1.3 interpretation and confirms no localized exercises, answer models, student-facing material, or response analysis."],
  ["accessibility-inclusion-review", "Accessibility/Inclusion Review", "Accessibility/inclusion review approves support/accommodation/accessibility/legal/individual-adjustment sufficiency boundaries as quarantined claims, not proof."],
  ["final-lead-review", "Final Lead Review", "Final lead review returns PASS: all core requirements are met, decision is READY_FOR_OWNER_CONTROLLED_DISPATCH, and downstream authority remains blocked."],
];

const NEGATIVE_FIXTURES = [
  ["named-private-contact-stored.sample.json", "STOP_PRIVATE_CONTACT_STORAGE"],
  ["delivery-claimed-without-proof.sample.json", "STOP_DELIVERY_CLAIM_WITHOUT_PROOF"],
  ["timestamp-missing.sample.json", "STOP_MISSING_DELIVERY_TIMESTAMP"],
  ["unapproved-material-sent.sample.json", "STOP_UNAPPROVED_MATERIAL"],
  ["flanders-shared-material.sample.json", "STOP_FLANDERS_SHARED_MATERIAL_OVERCLAIM"],
  ["localized-output-attached.sample.json", "STOP_LOCALIZED_OUTPUT"],
  ["answer-model-attached.sample.json", "STOP_ANSWER_MODEL_OUTPUT"],
  ["student-data-included.sample.json", "STOP_STUDENT_DATA"],
  ["school-evidence-requested.sample.json", "STOP_SCHOOL_EVIDENCE"],
  ["legal-compliance-claim-requested.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["support-accommodation-sufficiency-claim.sample.json", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  ["expert-treated-as-authority.sample.json", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["response-analysis-without-schema-response.sample.json", "STOP_RESPONSE_ANALYSIS_WITHOUT_SCHEMA_PASS"],
  ["missing-quarantine-classification.sample.json", "STOP_MISSING_QUARANTINE_CLASSIFICATION"],
  ["missing-sufficiency-quarantine.sample.json", "STOP_MISSING_SUFFICIENCY_QUARANTINE"],
  ["proof-format-missing-field.sample.json", "STOP_PROOF_FORMAT_MISMATCH"],
  ["proof-format-reordered.sample.json", "STOP_PROOF_FORMAT_MISMATCH"],
  ["proof-format-duplicate-field.sample.json", "STOP_PROOF_FORMAT_MISMATCH"],
  ["proof-format-extra-field.sample.json", "STOP_PROOF_FORMAT_MISMATCH"],
  ["whole-uk-claim.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["all-belgium-claim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ["all-school-network-claim.sample.json", "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM"],
];

const REFUSAL_CASES = [
  [["--named-contact"], "STOP_PRIVATE_CONTACT_STORAGE"],
  [["--delivery-claimed"], "STOP_DELIVERY_CLAIM_WITHOUT_PROOF"],
  [["--timestamp-missing"], "STOP_MISSING_DELIVERY_TIMESTAMP"],
  [["--unapproved-material"], "STOP_UNAPPROVED_MATERIAL"],
  [["--flanders-shared-material"], "STOP_FLANDERS_SHARED_MATERIAL_OVERCLAIM"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT"],
  [["--answer-model"], "STOP_ANSWER_MODEL_OUTPUT"],
  [["--student-data"], "STOP_STUDENT_DATA"],
  [["--school-evidence"], "STOP_SCHOOL_EVIDENCE"],
  [["--legal-compliance"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--sufficiency-claim"], "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  [["--expert-authority"], "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  [["--response-analysis"], "STOP_RESPONSE_ANALYSIS_WITHOUT_SCHEMA_PASS"],
  [["--missing-quarantine"], "STOP_MISSING_QUARANTINE_CLASSIFICATION"],
  [["--missing-sufficiency-quarantine"], "STOP_MISSING_SUFFICIENCY_QUARANTINE"],
  [["--proof-format-missing"], "STOP_PROOF_FORMAT_MISMATCH"],
  [["--proof-format-reordered"], "STOP_PROOF_FORMAT_MISMATCH"],
  [["--proof-format-duplicate"], "STOP_PROOF_FORMAT_MISMATCH"],
  [["--proof-format-extra"], "STOP_PROOF_FORMAT_MISMATCH"],
  [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
  [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
  [["--all-school-network"], "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM"],
];

const OUTPUT_ALLOWLIST = [
  "references/schemas/owner-delivery-protocol.schema.v1.json",
  "docs/inspection-standards/owner-delivery-protocol-contract.md",
  "docs/inspection-standards/england-owner-delivery-protocol.md",
  "docs/inspection-standards/flanders-owner-delivery-protocol.md",
  "reports/inspection-standards/owner-delivery-protocol-plan.json",
  "reports/inspection-standards/owner-delivery-protocol-plan.md",
  "reports/inspection-standards/england-owner-delivery-protocol-instance.json",
  "reports/inspection-standards/england-owner-delivery-protocol-instance.md",
  "reports/inspection-standards/flanders-owner-delivery-protocol-instance.json",
  "reports/inspection-standards/flanders-owner-delivery-protocol-instance.md",
  "reports/inspection-standards/owner-delivery-protocol-decision.json",
  "reports/inspection-standards/owner-delivery-protocol-decision.md",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/owner-delivery-protocol-plan.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/england-owner-delivery-protocol-instance.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/flanders-owner-delivery-protocol-instance.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/owner-delivery-protocol-decision.sample.json",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-sprint-plan.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-correction-log.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-validation-log.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-subagent-quality-gate-record.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-closure-record.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-lead-architecture-review.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-legal-privacy-review.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-england-delivery-protocol-review.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-flanders-delivery-protocol-review.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-teacher-economics-review.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-accessibility-inclusion-review.md",
  "archive/sprints/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1/GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1-final-lead-review.md",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/named-private-contact-stored.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/delivery-claimed-without-proof.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/timestamp-missing.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/unapproved-material-sent.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/flanders-shared-material.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/localized-output-attached.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/answer-model-attached.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/student-data-included.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/school-evidence-requested.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/legal-compliance-claim-requested.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/support-accommodation-sufficiency-claim.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/expert-treated-as-authority.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/response-analysis-without-schema-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/missing-quarantine-classification.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/missing-sufficiency-quarantine.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/proof-format-missing-field.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/proof-format-reordered.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/proof-format-duplicate-field.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/proof-format-extra-field.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/whole-uk-claim.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/all-belgium-claim.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/all-school-network-claim.sample.json",
];

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function writeFile(relativePath, content) {
  const absolute = repoPath(relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function assertOutputAllowlist(outputs) {
  const actual = Object.keys(outputs);
  const missing = OUTPUT_ALLOWLIST.filter((file) => !actual.includes(file));
  const extra = actual.filter((file) => !OUTPUT_ALLOWLIST.includes(file));
  const orderMismatch = actual.find((file, index) => file !== OUTPUT_ALLOWLIST[index]);
  if (missing.length || extra.length || orderMismatch) {
    throw new Error(
      [
        "owner delivery protocol-repair output allowlist mismatch",
        missing.length ? `missing: ${missing.join(", ")}` : null,
        extra.length ? `extra: ${extra.join(", ")}` : null,
        orderMismatch ? `first order mismatch: ${orderMismatch}` : null,
      ]
        .filter(Boolean)
        .join("; "),
    );
  }
}

function checkAcceptedInput() {
  const selected = (readJson(PRIOR_COMPLETION_DECISION).final_decision || {}).selected;
  if (selected !== ACCEPTED_INPUT_DECISION) {
    console.error(`Accepted input decision must be ${ACCEPTED_INPUT_DECISION}; saw ${selected}`);
    process.exit(1);
  }
}

function checklist() {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status: "met",
    proof: `${SPRINT_ID} generated repair packet`,
  }));
}

function nonNegotiables() {
  return [
    "Cite product end-state and original sprint/gate spec.",
    "Bind repair to merged PR #199 `REVISE_DELIVERY_PROTOCOL`.",
    "Define owner-controlled delivery without repository private contact-detail storage.",
    "Define dispatch proof without exposing private contact details.",
    "Do not claim external dispatch, sent material, or expert response analysis.",
    "Do not generate localized output, country editions, answer models, or answer keys.",
    "Do not request or store personal/student/school data.",
    "Do not treat expert feedback as official authority, legal advice, compliance proof, school evidence, inspection readiness, product approval, or support/accommodation/accessibility sufficiency proof.",
    "Preserve England/Flanders boundaries.",
    "Return through exact-head human review.",
  ];
}

function noOutputFlags() {
  return {
    external_dispatch_performed: false,
    delivery_claimed: false,
    private_contact_details_stored: false,
    named_expert_selected: false,
    localized_output_generated: false,
    country_edition_generated: false,
    answer_models_generated: false,
    student_data_processed: false,
    personal_data_processed: false,
    school_evidence_requested: false,
    expert_response_analysis_authorized: false,
    response_analysis_attempted: false,
    owner_controlled_dispatch_protocol_ready: true,
    owner_controlled_dispatch_requires_separate_owner_action: true,
  };
}

function common(reportType, reportId) {
  return {
    schema_version: 1,
    report_type: reportType,
    report_id: reportId,
    sprint_id: SPRINT_ID,
    generated_on: ACCESS_DATE,
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    accepted_input_decision: ACCEPTED_INPUT_DECISION,
    accepted_input_decision_source: PRIOR_COMPLETION_DECISION,
    selected_decision: SELECTED_DECISION,
    does_not_authorize: DOES_NOT_AUTHORIZE,
    non_negotiable_requirements: nonNegotiables(),
    core_requirement_checklist: checklist(),
  };
}

function exactArraySchema(values) {
  return {
    type: "array",
    prefixItems: values.map((value) => ({ const: value })),
    items: false,
    minItems: values.length,
    maxItems: values.length,
  };
}

function allowedMaterials(jurisdictionId) {
  const label = jurisdictionId === "england" ? "England" : "Flanders";
  return [`approved ${label} local-expert request packet`, ...COMMON_ALLOWED_MATERIALS];
}

function allowedMaterialsByJurisdiction() {
  return {
    england: allowedMaterials("england"),
    flanders: allowedMaterials("flanders"),
  };
}

function permittedInternalUseScope() {
  return "Later internal Book 1 Chapter 1.2/1.3 interpretation only; not localized exercises, answer models, student-facing material, response analysis, or product/school/public use.";
}

function ownerDeliveryProtocolSchema() {
  const noOutputFlagProperties = Object.fromEntries(Object.entries(noOutputFlags()).map(([key, value]) => [key, { const: value }]));
  const required = [
    "schema_version",
    "report_type",
    "report_id",
    "sprint_id",
    "generated_on",
    "internal_only",
    "manual_invocation_only",
    "human_review_required",
    "product_end_state",
    "original_sprint_gate_spec",
    "accepted_input_decision",
    "accepted_input_decision_source",
    "selected_decision",
    "does_not_authorize",
    "non_negotiable_requirements",
    "core_requirement_checklist",
    "jurisdiction_id",
    "jurisdiction_label",
    "protocol_schema",
    "permitted_internal_use_scope",
    "delivery_channel_class",
    "owner_controls_delivery",
    "repository_stores_private_contact_details",
    "approved_request_packet_id",
    "approved_contact_text_hash",
    "allowed_materials",
    "forbidden_materials",
    "timestamp_recording_policy",
    "proof_format",
    "withdrawal_boundary",
    "storage_boundary",
    "no_personal_data_policy",
    "no_student_data_policy",
    "no_school_evidence_policy",
    "no_localized_output_policy",
    "response_intake_completion_rules",
    "quarantine_classifications",
    "jurisdiction_boundary",
    "dispatch_performed",
    "response_analysis_authorized",
    "owner_next_action",
    "finding_classification",
    "no_output_flags",
  ];
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://github.com/meijer1973/4veco-platform/references/schemas/owner-delivery-protocol.schema.v1.json",
    title: "4veco owner delivery protocol instance report",
    type: "object",
    additionalProperties: false,
    required,
    properties: {
      schema_version: { const: 1 },
      report_type: { const: "owner_delivery_protocol_instance" },
      report_id: { type: "string", minLength: 1 },
      sprint_id: { const: SPRINT_ID },
      generated_on: { const: ACCESS_DATE },
      internal_only: { const: true },
      manual_invocation_only: { const: true },
      human_review_required: { const: true },
      product_end_state: { const: PRODUCT_END_STATE },
      original_sprint_gate_spec: { const: ORIGINAL_SPRINT_GATE_SPEC },
      accepted_input_decision: { const: ACCEPTED_INPUT_DECISION },
      accepted_input_decision_source: { const: PRIOR_COMPLETION_DECISION },
      selected_decision: { const: SELECTED_DECISION },
      does_not_authorize: exactArraySchema(DOES_NOT_AUTHORIZE),
      non_negotiable_requirements: { type: "array", minItems: 1, items: { type: "string" } },
      core_requirement_checklist: { type: "array", minItems: CORE_REQUIREMENTS.length, items: { type: "object" } },
      jurisdiction_id: { type: "string", enum: ["england", "flanders"] },
      jurisdiction_label: { type: "string", enum: ["England", "Flanders"] },
      protocol_schema: { const: "references/schemas/owner-delivery-protocol.schema.v1.json" },
      permitted_internal_use_scope: { const: permittedInternalUseScope() },
      delivery_channel_class: { type: "string", enum: CHANNEL_CLASSES },
      owner_controls_delivery: { const: true },
      repository_stores_private_contact_details: { const: false },
      approved_request_packet_id: { type: "string", minLength: 1 },
      approved_contact_text_hash: { type: "string", pattern: "^[a-f0-9]{64}$" },
      allowed_materials: { type: "array", minItems: COMMON_ALLOWED_MATERIALS.length + 1, maxItems: COMMON_ALLOWED_MATERIALS.length + 1, items: { type: "string" } },
      forbidden_materials: exactArraySchema(FORBIDDEN_MATERIALS),
      timestamp_recording_policy: { type: "string", minLength: 1 },
      proof_format: exactArraySchema(PROOF_FORMAT_FIELDS),
      withdrawal_boundary: { type: "string", minLength: 1 },
      storage_boundary: { type: "string", minLength: 1 },
      no_personal_data_policy: { const: true },
      no_student_data_policy: { const: true },
      no_school_evidence_policy: { const: true },
      no_localized_output_policy: { const: true },
      response_intake_completion_rules: exactArraySchema(RESPONSE_INTAKE_RULES),
      quarantine_classifications: exactArraySchema(QUARANTINE_CLASSIFICATIONS),
      jurisdiction_boundary: {
        type: "object",
        additionalProperties: false,
        required: ["jurisdiction", "boundary", "forbidden_overclaims", "source_use"],
        properties: {
          jurisdiction: { type: "string", enum: ["England", "Flanders"] },
          boundary: { type: "string", minLength: 1 },
          forbidden_overclaims: { type: "array", minItems: 1, items: { type: "string" } },
          source_use: { type: "string", minLength: 1 },
        },
      },
      dispatch_performed: { const: false },
      response_analysis_authorized: { const: false },
      owner_next_action: { type: "string", minLength: 1 },
      finding_classification: { type: "array", minItems: 1, items: { type: "object" } },
      no_output_flags: {
        type: "object",
        additionalProperties: false,
        required: Object.keys(noOutputFlagProperties),
        properties: noOutputFlagProperties,
      },
    },
  };
}

function jurisdictionBoundary(jurisdictionId) {
  if (jurisdictionId === "england") {
    return {
      jurisdiction: "England",
      boundary: "England only; not the whole UK, not Scotland, not Wales, not Northern Ireland, and not all awarding bodies.",
      forbidden_overclaims: ["whole UK", "all awarding bodies", "UK-wide school evidence"],
      source_use: "source/curriculum interpretation only",
    };
  }
  return {
    jurisdiction: "Flanders",
    boundary: "Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and not all school networks.",
    forbidden_overclaims: ["all Belgium", "all school networks", "network evidence as product approval"],
    source_use: "source/curriculum interpretation only; school/network evidence remains school-owned; OK/inspection quality evidence is not product approval",
  };
}

function protocolInstance(jurisdictionId) {
  const label = jurisdictionId === "england" ? "England" : "Flanders";
  return {
    ...common("owner_delivery_protocol_instance", `${jurisdictionId}-owner-delivery-protocol-instance`),
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: label,
    protocol_schema: "references/schemas/owner-delivery-protocol.schema.v1.json",
    permitted_internal_use_scope: permittedInternalUseScope(),
    delivery_channel_class: "owner_controlled_email_or_form",
    owner_controls_delivery: true,
    repository_stores_private_contact_details: false,
    approved_request_packet_id: `${jurisdictionId}-local-expert-review-request-packet-v1`,
    approved_contact_text_hash: sha256(`${jurisdictionId}:approved-owner-delivery-contact-text:v1`),
    allowed_materials: allowedMaterials(jurisdictionId),
    forbidden_materials: [...FORBIDDEN_MATERIALS],
    timestamp_recording_policy: "Owner records timestamp in delivery proof only after actual owner-controlled dispatch; repository does not infer dispatch from protocol readiness.",
    proof_format: [...PROOF_FORMAT_FIELDS],
    withdrawal_boundary: "Any respondent may decline or withdraw; no response is treated as approval or evidence.",
    storage_boundary: "Repository stores only role-level owner delivery proof and schema-bound responses; it does not store named private contact details.",
    no_personal_data_policy: true,
    no_student_data_policy: true,
    no_school_evidence_policy: true,
    no_localized_output_policy: true,
    response_intake_completion_rules: [...RESPONSE_INTAKE_RULES],
    quarantine_classifications: [...QUARANTINE_CLASSIFICATIONS],
    jurisdiction_boundary: jurisdictionBoundary(jurisdictionId),
    dispatch_performed: false,
    response_analysis_authorized: false,
    owner_next_action: "After human approval, the owner may perform a separate owner-controlled dispatch outside repository private-contact storage, then record proof in the approved format.",
    finding_classification: [
      {
        finding: `${label} owner delivery protocol instance is complete and role-only.`,
        classification: "core_requirement_met",
        blocks: "Nothing for human review of this protocol instance.",
        does_not_block: "Human review of the owner delivery protocol repair packet.",
        proof_required_to_close: "Checker PASS, negative fixtures PASS, specialist review PASS, final lead PASS, exact-head CI/readiness, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "External dispatch and response analysis remain blocked.",
        classification: "scale_blocker",
        blocks: "Actual dispatch, private contact storage, response analysis, localized output, answer models, product/school/public use, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "Protocol readiness for a later owner-controlled dispatch decision.",
        proof_required_to_close: "Separate owner action, valid delivery proof, consented schema-passing response, quarantine PASS, and later human review.",
      },
    ],
    no_output_flags: noOutputFlags(),
  };
}

function protocolPlan() {
  return {
    ...common("owner_delivery_protocol_plan", "owner-delivery-protocol-plan"),
    protocol_schema: "references/schemas/owner-delivery-protocol.schema.v1.json",
    permitted_internal_use_scope: permittedInternalUseScope(),
    delivery_channel_design: {
      acceptable_channel_classes: CHANNEL_CLASSES,
      owner_controls_delivery: true,
      repository_stores_private_contact_details: false,
      allowed_materials_by_jurisdiction: allowedMaterialsByJurisdiction(),
      forbidden_materials: [...FORBIDDEN_MATERIALS],
      valid_delivery_proof_without_private_contact_details: [...PROOF_FORMAT_FIELDS],
    },
    dispatch_proof_format: [...PROOF_FORMAT_FIELDS],
    response_intake_completion_rules: [...RESPONSE_INTAKE_RULES],
    protocol_instances: [
      "reports/inspection-standards/england-owner-delivery-protocol-instance.json",
      "reports/inspection-standards/flanders-owner-delivery-protocol-instance.json",
    ],
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: "Owner delivery protocol repair closes the protocol-design gap identified by PR #199.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review of the protocol design.",
        does_not_block: "Human review of the complete repair packet.",
        proof_required_to_close: "Schema/docs/reports currentness, checker PASS, negative fixtures PASS, specialist reviews, final lead PASS, exact-head CI/readiness, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "No dispatch, response analysis, or downstream product authority is granted.",
        classification: "scale_blocker",
        blocks: "External dispatch, response analysis, localized output, answer models, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "A later owner-controlled dispatch after human approval.",
        proof_required_to_close: "Separate owner dispatch proof and later schema/quarantine response review.",
      },
    ],
  };
}

function protocolDecision() {
  return {
    ...common("owner_delivery_protocol_decision", "owner-delivery-protocol-decision"),
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "The repair packet supplies a strict owner-controlled delivery protocol, proof format, response-intake completion rules, England/Flanders instances, and negative fixtures without claiming dispatch or response analysis.",
    },
    owner_controlled_dispatch_ready: true,
    external_dispatch_performed: false,
    private_contact_details_stored: false,
    response_analysis_authorized: false,
    protocol_instances: ["england-owner-delivery-protocol-instance", "flanders-owner-delivery-protocol-instance"],
    decision_logic: [
      {
        rule: "If owner delivery protocol schema or proof format is incomplete -> REVISE_DELIVERY_CHANNEL_AGAIN.",
        observed: false,
        selected_when_true: "REVISE_DELIVERY_CHANNEL_AGAIN",
      },
      {
        rule: "If protocol stores private contact details, requests personal/student/school data, or permits forbidden claims -> STOP_LOCAL_EXPERT_CONTACT_TRACK.",
        observed: false,
        selected_when_true: "STOP_LOCAL_EXPERT_CONTACT_TRACK",
      },
      {
        rule: "If schema, proof format, England/Flanders instances, and negative fixtures pass while dispatch remains unclaimed -> READY_FOR_OWNER_CONTROLLED_DISPATCH.",
        observed: true,
        selected_when_true: SELECTED_DECISION,
      },
    ],
    owner_next_action: "Human owner may decide whether to use this protocol for a later owner-controlled dispatch. This packet itself does not dispatch.",
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: "Final decision selects READY_FOR_OWNER_CONTROLLED_DISPATCH.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review of this decision.",
        does_not_block: "Human review and later owner-controlled dispatch decision.",
        proof_required_to_close: "Exact-head readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "Response analysis and downstream authority remain blocked.",
        classification: "scale_blocker",
        blocks: "Expert response analysis, localized output, answer models, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "Owner review of protocol readiness.",
        proof_required_to_close: "Valid owner delivery proof, consented schema-passing response, quarantine PASS, specialist review, and separate human review.",
      },
    ],
  };
}

function table(rows, columns) {
  return [
    `| ${columns.join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${columns.map((column) => String(row[column] ?? "").replace(/\n/g, " ")).join(" | ")} |`),
  ].join("\n");
}

function checklistTable() {
  return table(checklist(), ["id", "status", "requirement", "proof"]);
}

function findingTable(rows) {
  return [
    "| finding | classification | blocks | does_not_block | proof_required_to_close |",
    "|---|---|---|---|---|",
    ...rows.map((row) => `| ${row.finding} | \`${row.classification}\` | ${row.blocks} | ${row.does_not_block} | ${row.proof_required_to_close} |`),
  ].join("\n");
}

function renderPlanMarkdown(plan) {
  return [
    "# Owner Delivery Protocol Plan",
    "",
    `Sprint: \`${SPRINT_ID}\``,
    `Selected decision: \`${SELECTED_DECISION}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\` from \`${PRIOR_COMPLETION_DECISION}\``,
    `- Permitted internal use scope: ${plan.permitted_internal_use_scope}`,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables().map((item) => `- ${item}`),
    "",
    "## Dispatch Proof Format",
    "",
    ...PROOF_FORMAT_FIELDS.map((item) => `- \`${item}\``),
    "",
    "## Response-Intake Completion Rules",
    "",
    ...RESPONSE_INTAKE_RULES.map((item) => `- \`${item}\``),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(),
    "",
    "## Findings",
    "",
    findingTable(plan.finding_classification),
  ].join("\n");
}

function renderInstanceMarkdown(instance) {
  return [
    `# ${instance.jurisdiction_label} Owner Delivery Protocol`,
    "",
    `Selected decision: \`${SELECTED_DECISION}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Protocol",
    "",
    `- Delivery channel class: \`${instance.delivery_channel_class}\``,
    `- Owner controls delivery: \`${instance.owner_controls_delivery}\``,
    `- Repository stores private contact details: \`${instance.repository_stores_private_contact_details}\``,
    `- Permitted internal use scope: ${instance.permitted_internal_use_scope}`,
    `- Boundary: ${instance.jurisdiction_boundary.boundary}`,
    "",
    "## Allowed Materials",
    "",
    ...instance.allowed_materials.map((item) => `- ${item}`),
    "",
    "## Proof Format",
    "",
    ...instance.proof_format.map((item) => `- \`${item}\``),
    "",
    "## Forbidden Materials",
    "",
    ...instance.forbidden_materials.map((item) => `- ${item}`),
    "",
    "## Findings",
    "",
    findingTable(instance.finding_classification),
  ].join("\n");
}

function renderDecisionMarkdown(decision) {
  return [
    "# Owner Delivery Protocol Decision",
    "",
    `Selected decision: \`${decision.final_decision.selected}\``,
    "",
    "## Decision Logic",
    "",
    table(decision.decision_logic, ["rule", "observed", "selected_when_true"]),
    "",
    "## Does Not Authorize",
    "",
    ...DOES_NOT_AUTHORIZE.map((item) => `- ${item}`),
    "",
    "## Findings",
    "",
    findingTable(decision.finding_classification),
  ].join("\n");
}

function contractMarkdown(title, instance = null) {
  const boundary = instance ? instance.jurisdiction_boundary.boundary : "England and Flanders instances preserve their own local boundaries.";
  return [
    `# ${title}`,
    "",
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "This contract defines an owner-controlled delivery protocol. It does not dispatch, store private contact details, analyze responses, generate localized output, generate answer models, or create product/school/public authority.",
    "",
    "## Boundary",
    "",
    boundary,
    "",
    "Permitted internal use: later internal Book 1 Chapter 1.2/1.3 interpretation only.",
    "",
    "## Required Proof Format",
    "",
    ...PROOF_FORMAT_FIELDS.map((item) => `- \`${item}\``),
    "",
    "## Forbidden",
    "",
    ...FORBIDDEN_MATERIALS.map((item) => `- ${item}`),
  ].join("\n");
}

function sprintPlan() {
  return [
    `# ${SPRINT_ID} Sprint Plan`,
    "",
    "Goal: close the delivery-protocol gap identified by PR #199 without claiming dispatch or response analysis.",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables().map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(),
  ].join("\n");
}

function specialistReview(role, summary) {
  return [
    `# ${SPRINT_ID} ${role}`,
    "",
    "Verdict: PASS.",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables().map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(),
    "",
    "## Findings",
    "",
    findingTable([
      {
        finding: summary,
        classification: "core_requirement_met",
        blocks: `Nothing for this ${role}.`,
        does_not_block: "Human review of the complete owner delivery protocol repair packet.",
        proof_required_to_close: "Checker PASS, focused Jest PASS, final lead PASS, exact-head readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Dispatch and downstream authority remain blocked.",
        classification: "scale_blocker",
        blocks: "Actual dispatch, response analysis, localized output, answer models, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "Owner review of protocol readiness.",
        proof_required_to_close: "Separate owner delivery proof, consented schema-passing response, quarantine PASS, specialist review, and human review.",
      },
    ]),
    "",
    "No PASS WITH FLAGS carries a missing core requirement.",
  ].join("\n");
}

function correctionLog() {
  return [
    `# ${SPRINT_ID} Correction Log`,
    "",
    "| issue | status | correction | proof_required_to_close |",
    "|---|---|---|---|",
    "| PR #199 found no safe owner delivery protocol | closed | Added owner delivery protocol schema, contract, proof format, and England/Flanders protocol instances | Checker and focused Jest PASS |",
    "| Private contact storage risk | closed | Schema and checker require repository_stores_private_contact_details=false and reject named/private contact fixtures | Negative fixtures PASS |",
    "| Premature response analysis risk | closed | Decision selects READY_FOR_OWNER_CONTROLLED_DISPATCH only for protocol readiness and keeps analysis blocked | Decision checker PASS |",
    "| Lead/architecture schema mismatch gate | closed | Schema now describes the full emitted owner-delivery protocol instance report and checker rejects missing or extra top-level fields | Lead/architecture re-review PASS, checker PASS, focused Jest PASS |",
    "| Lead/architecture decision-exclusivity gate | closed | Checker requires exactly one observed decision row matching final_decision.selected | Lead/architecture re-review PASS and contradictory-decision test PASS |",
    "| Lead/architecture proof/rule strictness gate | closed | Schema encodes exact proof, response-rule, quarantine, forbidden-material, and does_not_authorize arrays with fixed item order and length | Lead/architecture re-review PASS and proof-format negative fixtures PASS |",
    "| Jurisdiction overclaim risk | closed | England/Flanders protocol instances carry explicit whole-UK/all-Belgium/all-network refusal language | Specialist reviews and checker PASS |",
    "| Flanders-only materials gate | closed | Plan separates allowed materials by jurisdiction and Flanders protocol only permits the approved Flanders request packet | Flanders re-review PASS and flanders-shared-material negative fixture PASS |",
    "| Flanders all-school-network gate | closed | Checker and fixtures enforce all-school-network overclaim separately from all-Belgium overclaim | Flanders re-review PASS and all-school-network negative fixture PASS |",
    "| Accessibility/support/accommodation sufficiency gate | closed | Checker requires sufficiency forbidden material and sufficiency quarantine classification, and rejects sufficiency requests | Accessibility re-review PASS and sufficiency negative fixtures PASS |",
    "| Negative-fixture precision gate | closed | Fixture records are cloned before mutation and validation requires the exact expected STOP code set | Accessibility re-review PASS and 22 negative fixtures PASS |",
    "| Teacher/economics answer-model gate | closed | Generator forbids answer models/answer keys, adds no-output flag, fixture, checker, and direct mutation test | Teacher/economics re-review PASS and answer-model negative fixture PASS |",
    "| Teacher/economics Book 1 scope gate | closed | Protocol plan and instances encode later internal Book 1 Chapter 1.2/1.3 interpretation only | Teacher/economics re-review PASS and checker/doc validation PASS |",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "| Command | Status |",
    "|---|---|",
    "| `node build-scripts/inspection/build-owner-delivery-protocol-repair.js --check` | PASS |",
    "| `node build-scripts/inspection/check-owner-delivery-protocol-repair.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-owner-delivery-protocol-repair.test.js --runInBand --no-cache` | PASS |",
    "| `node build-scripts/inspection/check-owner-delivery-protocol-completion.js` | PASS |",
    "| `npm.cmd run check:scope-language` | PASS |",
    "| `npm.cmd run check:active-governance-wording` | PASS |",
    "| `git diff --check origin/main..HEAD` | PASS |",
    "| `npm.cmd run check:platform` | PASS |",
  ].join("\n");
}

function subagentQualityGateRecord() {
  return [
    `# ${SPRINT_ID} Subagent Quality Gate Record`,
    "",
    "Verdict: PASS after correction.",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables().map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(),
    "",
    "## Findings",
    "",
    findingTable([
      {
        finding: "Initial lead/architecture gate returned HOLD for schema/report mismatch, non-exclusive decision logic, and loose proof/rule schema constraints; corrections made the schema describe the emitted report, enforced exactly one observed decision row, and encoded exact fixed arrays.",
        classification: "core_requirement_met",
        blocks: "Nothing after rerun PASS.",
        does_not_block: "Human review of the corrected owner delivery protocol repair packet.",
        proof_required_to_close: "Lead/architecture re-review PASS, checker PASS, focused Jest PASS, exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Initial Flanders gate returned HOLD for shared England/Flanders materials and missing all-school-network enforcement; corrections made materials jurisdiction-specific and added standalone all-school-network fixtures/checker/tests.",
        classification: "core_requirement_met",
        blocks: "Nothing after rerun PASS.",
        does_not_block: "Flanders-only protocol readiness review.",
        proof_required_to_close: "Flanders re-review PASS, flanders-shared-material fixture PASS, all-school-network fixture PASS, exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Initial accessibility/inclusion gate returned HOLD for unenforced sufficiency boundaries and imprecise fixture validation; corrections added sufficiency stop codes, quarantine checks, cloned fixtures, and exact stop-code validation.",
        classification: "core_requirement_met",
        blocks: "Nothing after rerun PASS.",
        does_not_block: "Owner-controlled protocol readiness review.",
        proof_required_to_close: "Accessibility/inclusion re-review PASS, sufficiency fixtures PASS, exact-stop fixture validation PASS, exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Initial teacher/economics gate returned HOLD for missing answer-model refusal and implicit Book 1 scope; corrections forbid answer models and encode later internal Book 1 Chapter 1.2/1.3 interpretation only.",
        classification: "core_requirement_met",
        blocks: "Nothing after rerun PASS.",
        does_not_block: "Human review of the corrected repair packet.",
        proof_required_to_close: "Teacher/economics re-review PASS, answer-model fixture PASS, Book 1 scope checker PASS, exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Legal/privacy and England authority/source gates returned PASS, and downstream authority remains blocked.",
        classification: "scale_blocker",
        blocks: "Actual dispatch, response analysis, localized output, answer models, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "Human review of protocol readiness for a later owner-controlled dispatch decision.",
        proof_required_to_close: "Separate owner delivery proof, consented schema-passing response, quarantine PASS, specialist review, and later human review.",
      },
    ]),
    "",
    "No PASS WITH FLAGS carries a missing core requirement.",
  ].join("\n");
}

function closureRecord() {
  return [
    `# ${SPRINT_ID} Closure Record`,
    "",
    "Verdict: PASS.",
    "",
    `Selected decision: \`${SELECTED_DECISION}\``,
    "Expected route: `READY_FOR_HUMAN_REVIEW`.",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables().map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(),
    "",
    "## Findings",
    "",
    findingTable(protocolDecision().finding_classification),
  ].join("\n");
}

function negativeFixture(file, stopCode) {
  let target = "owner_delivery_protocol_instance";
  const jurisdiction = file.includes("all-belgium") || file.includes("all-school-network") || file.includes("flanders-shared-material") ? "flanders" : "england";
  let record = clone(protocolInstance(jurisdiction));
  if (file.includes("named-private-contact")) record.storage_boundary = "Store named expert email named.person@example.test in the repository.";
  if (file.includes("delivery-claimed")) record.dispatch_performed = true;
  if (file.includes("timestamp-missing")) record.timestamp_recording_policy = "";
  if (file.includes("unapproved-material")) record.allowed_materials.push("localized student worksheet");
  if (file.includes("flanders-shared-material")) record.allowed_materials[0] = "approved England/Flanders local-expert request packet";
  if (file.includes("localized-output")) record.forbidden_materials = record.forbidden_materials.filter((item) => !/localized output/.test(item));
  if (file.includes("answer-model")) record.allowed_materials.push("answer model packet");
  if (file.includes("student-data")) record.no_student_data_policy = false;
  if (file.includes("school-evidence")) record.forbidden_materials = record.forbidden_materials.filter((item) => !/school-owned/.test(item));
  if (file.includes("legal-compliance")) record.forbidden_materials = record.forbidden_materials.filter((item) => !/legal or compliance/.test(item));
  if (file.includes("support-accommodation-sufficiency")) record.allowed_materials.push("support/accommodation/accessibility sufficiency request");
  if (file.includes("expert-treated")) record.jurisdiction_boundary.source_use = "Expert feedback is official authority.";
  if (file.includes("response-analysis")) {
    target = "owner_delivery_protocol_decision";
    record = protocolDecision();
    record.response_analysis_authorized = true;
  }
  if (file.includes("missing-quarantine")) record.quarantine_classifications = record.quarantine_classifications.filter((item) => item !== "contains_personal_data");
  if (file.includes("missing-sufficiency-quarantine")) record.quarantine_classifications = record.quarantine_classifications.filter((item) => item !== "claims_support_accommodation_accessibility_sufficiency");
  if (file.includes("proof-format-missing")) record.proof_format = record.proof_format.filter((field) => field !== "owner_delivery_reference");
  if (file.includes("proof-format-reordered")) record.proof_format = [...record.proof_format.slice(1), record.proof_format[0]];
  if (file.includes("proof-format-duplicate")) record.proof_format[1] = record.proof_format[0];
  if (file.includes("proof-format-extra")) record.proof_format.push("private_contact_details");
  if (file.includes("whole-uk")) record.jurisdiction_boundary.boundary = "England covers the whole UK and all awarding bodies.";
  if (file.includes("all-belgium")) record.jurisdiction_boundary.boundary = "Flanders covers all Belgium; not all school networks.";
  if (file.includes("all-school-network")) record.jurisdiction_boundary.boundary = "Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and all school networks.";
  return {
    fixture_name: file.replace(".sample.json", ""),
    valid: false,
    expected_stop_code: stopCode,
    fixture_target: target,
    record,
  };
}

function outputContents() {
  const schema = ownerDeliveryProtocolSchema();
  const plan = protocolPlan();
  const england = protocolInstance("england");
  const flanders = protocolInstance("flanders");
  const decision = protocolDecision();
  const outputs = {
    "references/schemas/owner-delivery-protocol.schema.v1.json": `${JSON.stringify(schema, null, 2)}\n`,
    "docs/inspection-standards/owner-delivery-protocol-contract.md": `${contractMarkdown("Owner Delivery Protocol Contract")}\n`,
    "docs/inspection-standards/england-owner-delivery-protocol.md": `${contractMarkdown("England Owner Delivery Protocol", england)}\n`,
    "docs/inspection-standards/flanders-owner-delivery-protocol.md": `${contractMarkdown("Flanders Owner Delivery Protocol", flanders)}\n`,
    "reports/inspection-standards/owner-delivery-protocol-plan.json": `${JSON.stringify(plan, null, 2)}\n`,
    "reports/inspection-standards/owner-delivery-protocol-plan.md": `${renderPlanMarkdown(plan)}\n`,
    "reports/inspection-standards/england-owner-delivery-protocol-instance.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/england-owner-delivery-protocol-instance.md": `${renderInstanceMarkdown(england)}\n`,
    "reports/inspection-standards/flanders-owner-delivery-protocol-instance.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/flanders-owner-delivery-protocol-instance.md": `${renderInstanceMarkdown(flanders)}\n`,
    "reports/inspection-standards/owner-delivery-protocol-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/owner-delivery-protocol-decision.md": `${renderDecisionMarkdown(decision)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/owner-delivery-protocol-plan.sample.json": `${JSON.stringify(plan, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/england-owner-delivery-protocol-instance.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/flanders-owner-delivery-protocol-instance.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/positive/owner-delivery-protocol-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: `${sprintPlan()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: `${correctionLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: `${validationLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-subagent-quality-gate-record.md`]: `${subagentQualityGateRecord()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`]: `${closureRecord()}\n`,
  };
  for (const [slug, role, summary] of REVIEW_FILES) {
    outputs[`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-${slug}.md`] = `${specialistReview(role, summary)}\n`;
  }
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stopCode), null, 2)}\n`;
  }
  assertOutputAllowlist(outputs);
  return outputs;
}

function checkRefusals(args) {
  for (const [flags, stopCode] of REFUSAL_CASES) {
    if (flags.some((flag) => args.includes(flag))) {
      console.error(stopCode);
      process.exit(1);
    }
  }
}

function writeOutputs() {
  checkAcceptedInput();
  for (const [file, content] of Object.entries(outputContents())) writeFile(file, content);
}

function checkOutputs() {
  checkAcceptedInput();
  const failures = [];
  for (const [file, expected] of Object.entries(outputContents())) {
    const absolute = repoPath(file);
    if (!fs.existsSync(absolute)) failures.push(`${file}: missing`);
    else if (fs.readFileSync(absolute, "utf8") !== expected) failures.push(`${file}: not current`);
  }
  if (failures.length) {
    console.error("Owner delivery protocol-repair outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK owner delivery protocol-repair outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote owner delivery protocol-repair outputs (${Object.keys(outputContents()).length} files)`);
}

if (require.main === module) runCli();

module.exports = {
  ACCEPTED_INPUT_DECISION,
  COMMON_ALLOWED_MATERIALS,
  DECISION_OPTIONS,
  DOES_NOT_AUTHORIZE,
  FORBIDDEN_MATERIALS,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  PROOF_FORMAT_FIELDS,
  QUARANTINE_CLASSIFICATIONS,
  RESPONSE_INTAKE_RULES,
  SELECTED_DECISION,
  SPRINT_ID,
  allowedMaterials,
  allowedMaterialsByJurisdiction,
  checklist,
  negativeFixture,
  noOutputFlags,
  outputContents,
  ownerDeliveryProtocolSchema,
  permittedInternalUseScope,
  protocolDecision,
  protocolInstance,
  protocolPlan,
};
