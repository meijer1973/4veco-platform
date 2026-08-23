#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
  DOES_NOT_AUTHORIZE: protocolDoesNotAuthorize,
  FORBIDDEN_MATERIALS,
  PROOF_FORMAT_FIELDS,
  QUARANTINE_CLASSIFICATIONS,
  RESPONSE_INTAKE_RULES,
  protocolDecision,
  protocolInstance,
} = require("./build-owner-delivery-protocol-repair.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-07-03";
const SPRINT_ID = "GOAL-IQS-OWNER-CONTROLLED-DISPATCH-1";
const SOURCE_SPRINT_ID = "GOAL-IQS-OWNER-DELIVERY-PROTOCOL-REPAIR-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_INPUT_DECISION_SOURCE = "reports/inspection-standards/owner-delivery-protocol-decision.json";
const PROTOCOL_PLAN_SOURCE = "reports/inspection-standards/owner-delivery-protocol-plan.json";
const ENGLAND_PROTOCOL_SOURCE = "reports/inspection-standards/england-owner-delivery-protocol-instance.json";
const FLANDERS_PROTOCOL_SOURCE = "reports/inspection-standards/flanders-owner-delivery-protocol-instance.json";
const ACCEPTED_INPUT_DECISION = "READY_FOR_OWNER_CONTROLLED_DISPATCH";
const SELECTED_DECISION = "REVISE_OWNER_DISPATCH_PROCESS";

const DECISION_OPTIONS = [
  "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS",
  "REVISE_OWNER_DISPATCH_PROCESS",
  "STOP_LOCAL_EXPERT_CONTACT_TRACK",
];

const DELIVERY_STATUS_OPTIONS = [
  "sent_with_owner_proof",
  "not_sent_owner_blocked",
  "not_sent_no_safe_channel",
  "sent_response_pending",
  "sent_response_received_schema_pass",
  "sent_response_quarantined",
];

const INPUT_ALLOWLIST = [
  ACCEPTED_INPUT_DECISION_SOURCE,
  PROTOCOL_PLAN_SOURCE,
  ENGLAND_PROTOCOL_SOURCE,
  FLANDERS_PROTOCOL_SOURCE,
  "references/schemas/owner-delivery-protocol.schema.v1.json",
  "references/schemas/local-expert-response-intake.schema.v1.json",
];

const OUTPUT_ALLOWLIST = [
  "reports/inspection-standards/owner-controlled-dispatch-record.json",
  "reports/inspection-standards/owner-controlled-dispatch-record.md",
  "reports/inspection-standards/england-owner-controlled-dispatch-and-response-intake.json",
  "reports/inspection-standards/england-owner-controlled-dispatch-and-response-intake.md",
  "reports/inspection-standards/flanders-owner-controlled-dispatch-and-response-intake.json",
  "reports/inspection-standards/flanders-owner-controlled-dispatch-and-response-intake.md",
  "reports/inspection-standards/owner-controlled-response-quarantine-report.json",
  "reports/inspection-standards/owner-controlled-response-quarantine-report.md",
  "reports/inspection-standards/owner-controlled-dispatch-decision.json",
  "reports/inspection-standards/owner-controlled-dispatch-decision.md",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/owner-controlled-dispatch-record.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/england-owner-controlled-dispatch-and-response-intake.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/flanders-owner-controlled-dispatch-and-response-intake.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/owner-controlled-response-quarantine-report.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/owner-controlled-dispatch-decision.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-subagent-quality-gate-record.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/invented-dispatch-proof.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/dispatch-claimed-without-owner-proof.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/private-contact-endpoint-stored.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/named-expert-recorded.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/missing-not-sent-reason.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/unapproved-material-sent.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/proceed-without-clean-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/response-analysis-without-schema-pass.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/personal-data-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/student-data-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/school-evidence-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/legal-compliance-claim.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/support-accommodation-accessibility-sufficiency.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/localized-output-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/expert-as-official-authority.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/england-whole-uk-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/flanders-all-belgium-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/flanders-all-school-network-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/flanders-static-boundary-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/flanders-static-school-network-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/flanders-static-role-authority-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/flanders-static-source-use-product-approval.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/response-not-quarantined.sample.json",
  "references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/forbidden-attachment-sent.sample.json",
];

const NEGATIVE_FIXTURES = [
  ["invented-dispatch-proof.sample.json", "STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF"],
  ["dispatch-claimed-without-owner-proof.sample.json", "STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF"],
  ["private-contact-endpoint-stored.sample.json", "STOP_PRIVATE_CONTACT_STORAGE"],
  ["named-expert-recorded.sample.json", "STOP_NAMED_EXPERT_SELECTION"],
  ["missing-not-sent-reason.sample.json", "STOP_MISSING_NOT_SENT_REASON"],
  ["unapproved-material-sent.sample.json", "STOP_UNAPPROVED_MATERIAL_SENT"],
  ["proceed-without-clean-response.sample.json", "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
  ["response-analysis-without-schema-pass.sample.json", "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
  ["personal-data-response.sample.json", "STOP_PERSONAL_DATA_RESPONSE"],
  ["student-data-response.sample.json", "STOP_PERSONAL_DATA_RESPONSE"],
  ["school-evidence-response.sample.json", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  ["legal-compliance-claim.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["support-accommodation-accessibility-sufficiency.sample.json", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  ["localized-output-response.sample.json", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  ["expert-as-official-authority.sample.json", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["england-whole-uk-overclaim.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["flanders-all-belgium-overclaim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ["flanders-all-school-network-overclaim.sample.json", "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM"],
  ["flanders-static-boundary-overclaim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ["flanders-static-school-network-overclaim.sample.json", "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM"],
  ["flanders-static-role-authority-overclaim.sample.json", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["flanders-static-source-use-product-approval.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["response-not-quarantined.sample.json", "STOP_RESPONSE_NOT_QUARANTINED"],
  ["forbidden-attachment-sent.sample.json", "STOP_FORBIDDEN_ATTACHMENT"],
];

const REFUSAL_CASES = [
  [["--dispatch-proof"], "STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF"],
  [["--claim-dispatch"], "STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF"],
  [["--private-contact"], "STOP_PRIVATE_CONTACT_STORAGE"],
  [["--named-expert"], "STOP_NAMED_EXPERT_SELECTION"],
  [["--missing-not-sent-reason"], "STOP_MISSING_NOT_SENT_REASON"],
  [["--unapproved-material"], "STOP_UNAPPROVED_MATERIAL_SENT"],
  [["--forbidden-attachment"], "STOP_FORBIDDEN_ATTACHMENT"],
  [["--response-analysis"], "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
  [["--proceed-to-analysis"], "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
  [["--personal-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--student-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--school-evidence"], "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  [["--legal-compliance"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--legal-advice"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--compliance-proof"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--inspection-readiness"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  [["--sufficiency-claim"], "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  [["--accessibility-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  [["--expert-authority"], "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
  [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
  [["--all-school-network"], "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM"],
  [["--response-not-quarantined"], "STOP_RESPONSE_NOT_QUARANTINED"],
];

const QUARANTINE_RULES = [
  ["no_response_yet", "CARRY_NO_RESPONSE_YET"],
  ["out_of_scope", "STOP_OUT_OF_SCOPE_RESPONSE"],
  ["contains_forbidden_claim", "STOP_FORBIDDEN_RESPONSE_CLAIM"],
  ["contains_personal_data", "STOP_PERSONAL_DATA_RESPONSE"],
  ["claims_legal_or_compliance_authority", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["claims_school_evidence", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  ["claims_inspection_or_exam_approval", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["contains_localized_output", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  ["treats_expert_as_official_authority", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["claims_support_accommodation_accessibility_sufficiency", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
  ["jurisdiction_overclaim", "STOP_JURISDICTION_OVERCLAIM"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["accepted_protocol_decision_bound", "All records are bound to merged PR #203 `READY_FOR_OWNER_CONTROLLED_DISPATCH`."],
  ["owner_authorization_recorded", "Owner continuation is recorded only for repository-bound dispatch/intake evidence, not external sending."],
  ["dispatch_status_recorded_for_both_jurisdictions", "Owner-controlled dispatch status is recorded for England and Flanders."],
  ["protocol_proof_format_reused", "PR #203 proof fields, delivery-status vocabulary, and intake-state vocabulary are reused."],
  ["no_dispatch_proof_invented", "No owner delivery proof, timestamp, sent material, or response is invented."],
  ["approved_payload_only", "Only the approved request packet, role-only contact text, consent boundary, and response-intake instructions are sendable if proof later exists."],
  ["no_named_contact_or_private_details", "No named expert, private contact details, or private dispatch endpoint is stored."],
  ["strict_response_intake_records", "Each jurisdiction has a strict response-intake record using the approved response schema boundary."],
  ["quarantine_rules_enforced", "Out-of-scope, personal/student/school data, forbidden claims, localized output, sufficiency claims, and authority overclaims are quarantined."],
  ["no_response_analysis_without_accepted_response", "The packet cannot proceed to expert response analysis without owner proof and accepted, consented, schema-passing responses."],
  ["downstream_authority_blocked", "Localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, student/product use, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, and official-authority claims remain blocked."],
  ["review_route_preserved", "Specialist reviews, final lead review, exact-head PR readiness, green CI, branch protection ok:true, and human review remain required."],
];

const REVIEW_FILES = [
  ["lead-architecture-review", "Lead Architecture Review", "Lead/architecture review returned PASS after the Flanders static-boundary bypass correction: the bounded layer over PR #203, explicit allowlists, proof-state logic, refusal coverage, and no-proof/no-response decision are current and enforced."],
  ["legal-privacy-review", "Legal/Privacy Review", "Legal/privacy review approves no personal/student/school data, no private contact storage, no named expert selection, consent boundary, and quarantine handling."],
  ["england-jurisdiction-source-review", "England Jurisdiction-Source Review", "England source/authority review approves England-only bounds and no whole-UK or all-awarding-bodies overclaim."],
  ["flanders-jurisdiction-source-review", "Flanders Jurisdiction-Source Review", "Flanders source/authority review initially held on static boundary and role/source semantic enforcement. After adding invariant-level checks and isolated fixtures for Belgium/Belgian, plural network, authority, evidence, and product/inspection authority variants, re-review returned PASS."],
  ["teacher-economics-review", "Teacher/Economics Review", "Teacher/economics review approves that no localized economics output, exercise, answer model, school evidence, or response interpretation is generated."],
  ["accessibility-inclusion-review", "Accessibility/Inclusion Review", "Accessibility/inclusion review approves support, accommodation, accessibility, legal, and individual-adjustment sufficiency claims as quarantine triggers."],
  ["final-lead-review", "Final Lead Review", "Final lead review returns PASS: core requirements are met, the decision is REVISE_OWNER_DISPATCH_PROCESS, and downstream authority remains blocked."],
];

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function writeFile(relativePath, content) {
  const absolute = repoPath(relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function unique(items) {
  return [...new Set(items)];
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function jurisdictionLabel(jurisdictionId) {
  return jurisdictionId === "england" ? "England" : "Flanders";
}

function protocolPath(jurisdictionId) {
  return jurisdictionId === "england" ? ENGLAND_PROTOCOL_SOURCE : FLANDERS_PROTOCOL_SOURCE;
}

function sourceProtocolInstance(jurisdictionId) {
  return readJson(protocolPath(jurisdictionId));
}

function sourceProtocolDecision() {
  return readJson(ACCEPTED_INPUT_DECISION_SOURCE);
}

function doesNotAuthorize() {
  return unique([
    ...protocolDoesNotAuthorize.filter((item) => item !== "external dispatch in this sprint"),
    "repository-performed external dispatch",
    "unproved owner-controlled external dispatch",
    "owner delivery proof invention",
    "owner dispatch timestamp invention",
    "sent-material invention",
    "expert response invention",
    "response interpretation as product evidence",
    "treating pending or absent responses as approval",
    "private dispatch endpoint storage",
    "school-owned evidence treatment",
    "support/accommodation/accessibility sufficiency treatment",
  ]);
}

function noOutputFlagsForOwnerControlledDispatch() {
  return {
    external_dispatch_performed: false,
    repository_external_dispatch_performed: false,
    owner_controlled_dispatch_goal_authorized: true,
    owner_controlled_dispatch_protocol_ready: true,
    owner_dispatch_status_recorded: true,
    owner_delivery_proof_recorded: false,
    owner_delivery_timestamp_recorded: false,
    owner_material_sent: false,
    private_contact_details_stored: false,
    named_expert_selected: false,
    localized_output_generated: false,
    country_edition_generated: false,
    answer_models_generated: false,
    student_data_processed: false,
    personal_data_processed: false,
    school_evidence_requested: false,
    expert_response_received: false,
    accepted_response_available: false,
    response_analysis_authorized: false,
    response_analysis_attempted: false,
    owner_dispatch_process_revision_required: true,
  };
}

function ownerAuthorization() {
  return {
    authorization_id: "thread-owner-continuation-2026-07-03-owner-controlled-dispatch-recording",
    authorization_source: "Codex thread owner message `continue` after merged PR #203; scoped by the accepted PR #203 protocol to repository-bound dispatch/intake records only.",
    accepted_decision: ACCEPTED_INPUT_DECISION,
    authorized_scope: [
      "create England and Flanders owner-controlled dispatch records",
      "justify role-only contact candidates without named expert selection or private contact details",
      "run legal/privacy and jurisdiction-source review before any dispatch claim",
      "reuse only the approved request packet, role-only contact text, consent boundary, and response-intake instructions",
      "collect responses only through the approved response-intake schema if owner proof and response evidence later exist",
      "quarantine out-of-scope, personal-data, school-evidence, forbidden-claim, localized-output, sufficiency-claim, or authority-overclaim responses",
      "return with a complete dispatch/intake record and final decision",
    ],
    does_not_authorize: doesNotAuthorize(),
  };
}

function coreRequirementChecklist() {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status: "met",
    proof_required_to_close: "Generator currentness PASS, owner-controlled dispatch checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review.",
  }));
}

function baseReport(reportType) {
  return {
    schema_version: 1,
    report_type: reportType,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    access_date: ACCESS_DATE,
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    product_end_state: PRODUCT_END_STATE,
    product_end_state_checkout_note: PRODUCT_END_STATE_CHECKOUT_NOTE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    roadmap_source: ROADMAP_SOURCE,
    source_sprint_id: SOURCE_SPRINT_ID,
    accepted_input_decision: ACCEPTED_INPUT_DECISION,
    accepted_input_decision_source: ACCEPTED_INPUT_DECISION_SOURCE,
    selected_decision: SELECTED_DECISION,
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_ALLOWLIST,
    owner_authorization: ownerAuthorization(),
    core_requirement_checklist: coreRequirementChecklist(),
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForOwnerControlledDispatch(),
  };
}

function findingClassification(summary) {
  return [
    {
      finding: summary,
      classification: "core_requirement_met",
      blocks: "Nothing for internal human review once exact-head readiness, CI, and branch protection pass.",
      does_not_block: "Owner review of the complete owner-controlled dispatch/intake packet.",
      proof_required_to_close: "Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
    },
    {
      finding: "No owner delivery proof, sent material, consented response, schema-passing response, or accepted response exists in this workspace.",
      classification: "scale_blocker",
      blocks: "Expert response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
      does_not_block: "Internal review of the honest dispatch/intake status and a later owner-run dispatch proof step.",
      proof_required_to_close: "Owner delivery proof, consented schema-passing responses, quarantine PASS, specialist review, and separate human review.",
    },
  ];
}

function roleOnlyCandidate(jurisdictionId) {
  const label = jurisdictionLabel(jurisdictionId);
  return {
    selection_status: "role_only_not_named_owner_step_pending",
    role_profile: `${label} curriculum or inspection-standards reviewer able to comment on source interpretation without supplying official authority or school evidence.`,
    selection_basis: "Role and jurisdiction fit only; no named person, private contact endpoint, or scraped contact route is stored.",
    named_expert_selected: false,
    personal_contact_details_recorded: false,
    private_dispatch_endpoint_recorded: false,
    expert_not_official_authority: true,
    proof_required_to_select_named_contact: "Out of repository: owner must use an approved no-personal-data contact boundary and must not commit private contact details.",
  };
}

function materialPrepared(instance) {
  return [
    {
      material_id: `${instance.jurisdiction_id}-approved-request-packet`,
      material_type: "approved_request_packet",
      approved_request_packet_id: instance.approved_request_packet_id,
      status: "prepared_not_sent_by_repository",
    },
    {
      material_id: `${instance.jurisdiction_id}-approved-role-only-contact-text`,
      material_type: "approved_role_only_contact_text",
      approved_contact_text_hash: instance.approved_contact_text_hash,
      status: "prepared_not_sent_by_repository",
    },
    {
      material_id: `${instance.jurisdiction_id}-approved-consent-boundary`,
      material_type: "approved_consent_and_withdrawal_boundary",
      source: protocolPath(instance.jurisdiction_id),
      status: "prepared_not_sent_by_repository",
    },
    {
      material_id: `${instance.jurisdiction_id}-approved-response-intake-instructions`,
      material_type: "approved_response_intake_instructions",
      source: "references/schemas/local-expert-response-intake.schema.v1.json",
      status: "prepared_not_sent_by_repository",
    },
  ];
}

function materialExplicitlyNotSent() {
  return [
    "approved request packet and role-only contact text were not sent by this repository",
    ...FORBIDDEN_MATERIALS,
    "localized chapters",
    "localized paragraphs",
    "localized exercises",
    "answer models",
    "student-facing files",
    "teacher/school-facing output",
    "public output",
    "evidence packs",
    "product-route artifacts",
    "Scale Gate artifacts",
    "diagnostics/mastery/PV artifacts",
    "personal/student/school data",
    "named expert contact details",
  ];
}

function dispatchJurisdiction(jurisdictionId) {
  const instance = sourceProtocolInstance(jurisdictionId);
  return {
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: jurisdictionLabel(jurisdictionId),
    source_protocol_instance: protocolPath(jurisdictionId),
    source_protocol_decision: ACCEPTED_INPUT_DECISION_SOURCE,
    source_protocol_selected_decision: sourceProtocolDecision().final_decision.selected,
    owner_authorization_reference: ownerAuthorization().authorization_id,
    role_only_contact_candidate: roleOnlyCandidate(jurisdictionId),
    protocol_delivery_channel_class: instance.delivery_channel_class,
    allowed_delivery_statuses: DELIVERY_STATUS_OPTIONS,
    delivery_status: "not_sent_owner_blocked",
    owner_controls_delivery: instance.owner_controls_delivery,
    repository_stores_private_contact_details: false,
    owner_delivery_proof_recorded: false,
    owner_delivery_reference: null,
    delivery_timestamp: null,
    dispatch_proof: null,
    required_dispatch_proof_format: PROOF_FORMAT_FIELDS,
    approved_request_packet_id: instance.approved_request_packet_id,
    approved_contact_text_hash: instance.approved_contact_text_hash,
    allowed_materials: instance.allowed_materials,
    forbidden_materials: instance.forbidden_materials,
    material_prepared: materialPrepared(instance),
    material_sent: [],
    material_explicitly_not_sent: materialExplicitlyNotSent(),
    not_sent_reason: "No owner-controlled delivery proof, delivery timestamp, owner delivery reference, or consented response was provided after PR #203. The repository cannot infer or perform external dispatch.",
    confirmations: {
      no_personal_data: true,
      no_student_data: true,
      no_school_evidence: true,
      no_localized_output: true,
      no_named_expert_or_private_contact_detail: true,
      no_legal_compliance_or_inspection_readiness_claim: true,
      no_support_accommodation_accessibility_sufficiency_claim: true,
      expert_feedback_not_official_authority: true,
    },
    jurisdiction_boundary: instance.jurisdiction_boundary,
    storage_boundary: instance.storage_boundary,
    withdrawal_boundary: instance.withdrawal_boundary,
    proof_required_to_mark_sent: "Owner must provide all PR #203 proof fields with an approved no-personal-data delivery channel, exact approved payload, timestamp, consent boundary, response storage boundary, and no forbidden attachment.",
  };
}

function ownerControlledDispatchRecord() {
  return {
    ...baseReport("owner_controlled_dispatch_record"),
    report_id: "owner-controlled-dispatch-record",
    status: "owner_dispatch_not_performed_no_owner_proof",
    source_protocol_plan: PROTOCOL_PLAN_SOURCE,
    source_protocol_decision: ACCEPTED_INPUT_DECISION_SOURCE,
    source_protocol_decision_selected: sourceProtocolDecision().final_decision.selected,
    protocol_decision_ready: protocolDecision().owner_controlled_dispatch_ready,
    owner_delivery_proof_recorded: false,
    repository_claims_external_dispatch: false,
    material_sent_count: 0,
    delivery_status_options: DELIVERY_STATUS_OPTIONS,
    delivery_proof_format_required: PROOF_FORMAT_FIELDS,
    jurisdictions: ["england", "flanders"].map(dispatchJurisdiction),
    dispatch_summary: "England and Flanders owner-controlled dispatch records are created from the approved PR #203 protocol, but no external send is claimed because no owner proof, timestamp, delivery reference, or response evidence is available.",
    proof_required_to_close_dispatch_block: "Owner delivery proof in the PR #203 format, consent boundary, exact approved payload, response-intake schema PASS, quarantine PASS, specialist review, and separate human review.",
    finding_classification: findingClassification("Owner-controlled dispatch status is recorded honestly for England and Flanders; no repository dispatch or response is claimed."),
  };
}

function schemaIntakeRecord(jurisdictionId) {
  const instance = sourceProtocolInstance(jurisdictionId);
  return {
    intake_id: `${jurisdictionId}-owner-controlled-response-intake`,
    jurisdiction_id: jurisdictionId,
    request_packet_id: instance.approved_request_packet_id,
    consent_confirmed: false,
    response_received: false,
    responses: [],
    validation_status: "no_response_yet",
    rejected_items: [],
    does_not_authorize: doesNotAuthorize(),
    proof_required_to_use: "Owner delivery proof, explicit response-storage consent, strict schema PASS, quarantine PASS, specialist review PASS, final lead PASS, and human review are required before any response can be used as internal interpretive input.",
  };
}

function responseIntakeReport(jurisdictionId, dispatch = ownerControlledDispatchRecord()) {
  const dispatchItem = dispatch.jurisdictions.find((item) => item.jurisdiction_id === jurisdictionId);
  const instance = sourceProtocolInstance(jurisdictionId);
  return {
    ...baseReport("owner_controlled_dispatch_response_intake"),
    report_id: `${jurisdictionId}-owner-controlled-dispatch-and-response-intake`,
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: jurisdictionLabel(jurisdictionId),
    source_owner_controlled_dispatch_record: "reports/inspection-standards/owner-controlled-dispatch-record.json",
    source_dispatch_jurisdiction: dispatchItem.jurisdiction_id,
    source_protocol_instance: protocolPath(jurisdictionId),
    accepted_request_packet_id: instance.approved_request_packet_id,
    allowed_delivery_statuses: DELIVERY_STATUS_OPTIONS,
    delivery_status: dispatchItem.delivery_status,
    response_status: "no_response_yet",
    response_intake_completion_rules: RESPONSE_INTAKE_RULES,
    quarantine_classifications: QUARANTINE_CLASSIFICATIONS,
    owner_delivery_proof_recorded: false,
    delivery_timestamp: null,
    material_sent: [],
    response_received: false,
    accepted_response_available: false,
    response_schema_status: "no_response_yet",
    schema_source: "references/schemas/local-expert-response-intake.schema.v1.json",
    schema_intake_record: schemaIntakeRecord(jurisdictionId),
    pending_items: [
      "owner delivery proof",
      "approved no-personal-data delivery channel",
      "delivery timestamp",
      "owner delivery reference",
      "explicit response-storage consent",
      "schema-passing response",
      "quarantine check",
      "specialist review",
      "human review before response analysis",
    ],
    quarantined_items: [],
    jurisdiction_boundary: instance.jurisdiction_boundary,
    proof_required_to_close: "Owner delivery proof plus a consented, schema-passing response or explicit no-response carry reviewed by specialists and the owner.",
    finding_classification: findingClassification(`${jurisdictionLabel(jurisdictionId)} dispatch/intake is recorded as not sent because no owner delivery proof exists; no response is stored or interpreted.`),
  };
}

function quarantineRule(ruleId, expectedStopCode) {
  return {
    rule_id: ruleId,
    expected_stop_code: expectedStopCode,
    applies_to_real_responses: true,
    applies_to_absent_responses: ruleId === "no_response_yet",
    proof_required_to_close: "A later packet must show owner delivery proof, consent, schema PASS, quarantine PASS, specialist review, final lead PASS, and owner authorization before response analysis.",
  };
}

function ownerControlledResponseQuarantineReport() {
  return {
    ...baseReport("owner_controlled_response_quarantine_report"),
    report_id: "owner-controlled-response-quarantine-report",
    status: "quarantine_ready_no_dispatch_or_response",
    no_real_responses_stored: true,
    absent_response_items: ["england", "flanders"].map((jurisdictionId) => ({
      jurisdiction_id: jurisdictionId,
      quarantine_category: "no_response_yet",
      status: "carried_pending_owner_dispatch",
      proof_required_to_close: "Owner delivery proof and response-intake evidence.",
    })),
    quarantine_rules: QUARANTINE_RULES.map(([ruleId, stopCode]) => quarantineRule(ruleId, stopCode)),
    quarantined_items: [],
    response_analysis_allowed: false,
    finding_classification: findingClassification("Quarantine rules cover absent responses and unsafe real-response classes; no real response is stored in this packet."),
  };
}

function decisionLogicRows(dispatch, england, flanders, quarantine) {
  return [
    {
      rule: "If no owner delivery proof exists -> REVISE_OWNER_DISPATCH_PROCESS.",
      observed: dispatch.owner_delivery_proof_recorded === false,
      selected_when_true: "REVISE_OWNER_DISPATCH_PROCESS",
    },
    {
      rule: "If dispatch is pending, blocked, or lacks a safe channel -> REVISE_OWNER_DISPATCH_PROCESS.",
      observed: [england, flanders].some((item) => item.delivery_status === "not_sent_owner_blocked" || item.delivery_status === "not_sent_no_safe_channel"),
      selected_when_true: "REVISE_OWNER_DISPATCH_PROCESS",
    },
    {
      rule: "If response exists but fails consent, schema, jurisdiction, or quarantine checks -> REVISE_OWNER_DISPATCH_PROCESS or STOP_LOCAL_EXPERT_CONTACT_TRACK.",
      observed: quarantine.quarantined_items.length > 0 || [england, flanders].some((item) => item.response_schema_status === "rejected"),
      selected_when_true: "REVISE_OWNER_DISPATCH_PROCESS",
    },
    {
      rule: "If private contact storage, personal/student/school data, legal/compliance/inspection-readiness claims, localized output, sufficiency claims, or official-authority substitution occurs -> STOP_LOCAL_EXPERT_CONTACT_TRACK.",
      observed: false,
      selected_when_true: "STOP_LOCAL_EXPERT_CONTACT_TRACK",
    },
    {
      rule: "If at least one owner-proved, consented, schema-passing, quarantine-clean response exists -> PROCEED_TO_EXPERT_RESPONSE_ANALYSIS.",
      observed: [england, flanders].some((item) => item.delivery_status === "sent_response_received_schema_pass" && item.accepted_response_available === true),
      selected_when_true: "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS",
    },
  ];
}

function ownerControlledDispatchDecision() {
  const dispatch = ownerControlledDispatchRecord();
  const england = responseIntakeReport("england", dispatch);
  const flanders = responseIntakeReport("flanders", dispatch);
  const quarantine = ownerControlledResponseQuarantineReport();
  return {
    ...baseReport("owner_controlled_dispatch_decision"),
    report_id: "owner-controlled-dispatch-decision",
    status: "ready_for_human_review",
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "PR #203 made the owner-controlled dispatch protocol ready, but this workspace has no owner delivery proof, no owner proof, dispatch timestamp, delivery reference, sent material, consented response, schema-passing response, or accepted response. The correct decision is to revise or complete the owner dispatch process rather than proceed to expert response analysis; downstream authority remains blocked.",
    },
    owner_controlled_dispatch_record: dispatch.report_id,
    response_intake_reports: [england.report_id, flanders.report_id],
    quarantine_report: quarantine.report_id,
    decision_logic: decisionLogicRows(dispatch, england, flanders, quarantine),
    proceed_to_expert_response_analysis: false,
    owner_dispatch_process_revision_required: true,
    stop_track: false,
    external_dispatch_performed: false,
    real_responses_received: false,
    accepted_responses_available: false,
    owner_next_action: "If the owner performs or has performed dispatch outside repository private-contact storage, provide proof in the PR #203 format with exact approved payload, timestamp, owner delivery reference, consent boundary, response storage boundary, and no forbidden attachment; then rerun intake and quarantine before any response analysis.",
    finding_classification: findingClassification("Final decision selects `REVISE_OWNER_DISPATCH_PROCESS` by rule because no owner delivery proof or accepted response exists."),
  };
}

function validResponse(jurisdictionId) {
  return {
    reviewer_role: "role-only local curriculum/inspection standards reviewer",
    jurisdiction: jurisdictionId,
    source_id: `${jurisdictionId}-approved-source`,
    source_state_seen: "Source state is cited by identifier only; no official authority is inferred.",
    question_id: `${jurisdictionId}-bounded-question`,
    answer_type: "bounded_interpretation",
    interpretation: "Bounded internal interpretation only; no localization, legal advice, school evidence, support sufficiency, or official authority.",
    confidence: "low",
    uncertainty: "Internal interpretation requires later official-source review and human approval.",
    cited_source: "Approved source identifier only.",
    forbidden_claims_disclaimed: true,
    does_not_authorize: doesNotAuthorize(),
    proof_required_to_use: "Owner proof, consent, schema PASS, quarantine PASS, specialist review, final lead review, and human review.",
  };
}

function responseWith(jurisdictionId, text, validationStatus = "accepted_for_internal_review") {
  const report = responseIntakeReport(jurisdictionId);
  report.delivery_status = validationStatus === "rejected" ? "sent_response_quarantined" : "sent_response_received_schema_pass";
  report.response_status = validationStatus === "rejected" ? "sent_response_quarantined" : "sent_response_received_schema_pass";
  report.owner_delivery_proof_recorded = true;
  report.delivery_timestamp = "2026-07-03T00:00:00Z";
  report.response_received = true;
  report.accepted_response_available = validationStatus !== "rejected";
  report.response_schema_status = validationStatus;
  report.schema_intake_record.consent_confirmed = true;
  report.schema_intake_record.response_received = true;
  report.schema_intake_record.responses = [validResponse(jurisdictionId)];
  report.schema_intake_record.responses[0].interpretation = text;
  report.schema_intake_record.validation_status = validationStatus;
  return report;
}

function negativeFixture(file, stopCode) {
  let fixtureTarget = "owner_controlled_dispatch_response_intake";
  let record = responseIntakeReport("england");
  switch (stopCode) {
    case "STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF":
      fixtureTarget = "owner_controlled_dispatch_record";
      record = ownerControlledDispatchRecord();
      record.repository_claims_external_dispatch = true;
      record.owner_delivery_proof_recorded = true;
      record.jurisdictions[0].delivery_status = "sent_with_owner_proof";
      record.jurisdictions[0].owner_delivery_proof_recorded = true;
      record.jurisdictions[0].delivery_timestamp = "2026-07-03T00:00:00Z";
      record.jurisdictions[0].dispatch_proof = { invented: true };
      break;
    case "STOP_PRIVATE_CONTACT_STORAGE":
      fixtureTarget = "owner_controlled_dispatch_record";
      record = ownerControlledDispatchRecord();
      record.jurisdictions[0].role_only_contact_candidate.private_dispatch_endpoint_recorded = true;
      record.jurisdictions[0].role_only_contact_candidate.selection_basis = "Use named.person@example.test as the private endpoint.";
      break;
    case "STOP_NAMED_EXPERT_SELECTION":
      fixtureTarget = "owner_controlled_dispatch_record";
      record = ownerControlledDispatchRecord();
      record.jurisdictions[0].role_only_contact_candidate.named_expert_selected = true;
      record.jurisdictions[0].role_only_contact_candidate.role_profile = "Named Expert Example";
      break;
    case "STOP_MISSING_NOT_SENT_REASON":
      fixtureTarget = "owner_controlled_dispatch_record";
      record = ownerControlledDispatchRecord();
      record.jurisdictions[0].not_sent_reason = "";
      break;
    case "STOP_UNAPPROVED_MATERIAL_SENT":
      fixtureTarget = "owner_controlled_dispatch_record";
      record = ownerControlledDispatchRecord();
      record.jurisdictions[0].material_sent = ["unapproved localized worksheet"];
      break;
    case "STOP_FORBIDDEN_ATTACHMENT":
      fixtureTarget = "owner_controlled_dispatch_record";
      record = ownerControlledDispatchRecord();
      record.jurisdictions[0].material_sent = ["answer models, answer keys, or worked-answer packets"];
      break;
    case "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE":
      fixtureTarget = "owner_controlled_dispatch_decision";
      record = ownerControlledDispatchDecision();
      record.final_decision.selected = "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS";
      record.proceed_to_expert_response_analysis = true;
      break;
    case "STOP_PERSONAL_DATA_RESPONSE":
      record = responseWith("england", file.includes("student") ? "This response includes student data for a student named Example Person." : "This response includes personal data and contact details for a named person.");
      break;
    case "STOP_SCHOOL_EVIDENCE_RESPONSE":
      record = responseWith("flanders", "This proves school-owned evidence and network-owned evidence for a specific school.");
      break;
    case "STOP_LEGAL_COMPLIANCE_CLAIM":
      if (file.includes("static-source-use")) {
        fixtureTarget = "owner_controlled_dispatch_response_intake";
        record = responseIntakeReport("flanders");
        record.jurisdiction_boundary.source_use = "source/curriculum interpretation only; school/network evidence remains school-owned; OK inspection quality evidence is product approval and inspection authority.";
      } else {
        record = responseWith("england", "This is legal advice, compliance proof, approval, accreditation, OP0, PTA, summative validity, and inspection readiness.");
      }
      break;
    case "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY":
      record = responseWith("england", "This confirms support sufficiency, accommodation sufficiency, accessibility sufficiency, accessibility/legal sufficiency, legal sufficiency, and individual-adjustment sufficiency.");
      break;
    case "STOP_LOCALIZED_OUTPUT_RESPONSE":
      record = responseWith("england", "Here is localized output, an England country edition, student-facing exercise, answer model, and answer key.");
      break;
    case "STOP_EXPERT_AS_OFFICIAL_AUTHORITY":
      if (file.includes("static-role")) {
        fixtureTarget = "owner_controlled_dispatch_record";
        record = ownerControlledDispatchRecord();
        record.jurisdictions[1].role_only_contact_candidate.role_profile = "Flanders reviewer without supplying official authority or school evidence, but this reviewer provides evidence for every school network and has legal authority.";
      } else {
        record = responseWith("england", "This expert response is official authority and substitutes for official source review.");
      }
      break;
    case "STOP_WHOLE_UK_OVERCLAIM":
      record = responseWith("england", "This applies to the whole UK, including Scotland, Wales, Northern Ireland, and all awarding bodies.");
      break;
    case "STOP_ALL_BELGIUM_OVERCLAIM":
      if (file.includes("static-boundary")) {
        fixtureTarget = "owner_controlled_dispatch_record";
        record = ownerControlledDispatchRecord();
        record.jurisdictions[1].jurisdiction_boundary.boundary = "Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and not all school networks; applies throughout Belgium, Belgian-wide coverage applies, and the entire Belgium scope includes the French Community.";
      } else {
        record = responseWith("flanders", "This applies to all Belgium, including the French Community and German-speaking Community.");
      }
      break;
    case "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM":
      if (file.includes("static-school-network")) {
        fixtureTarget = "owner_controlled_dispatch_record";
        record = ownerControlledDispatchRecord();
        record.jurisdictions[1].jurisdiction_boundary.boundary = "Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and not all school networks; covers all Flemish school networks.";
        record.jurisdictions[1].jurisdiction_boundary.forbidden_overclaims = ["all Belgium"];
      } else {
        record = responseWith("flanders", "This applies to all school networks and uses network evidence as product approval.");
      }
      break;
    case "STOP_RESPONSE_NOT_QUARANTINED":
      record = responseWith("england", "This includes personal data but is not quarantined.", "rejected");
      record.quarantined_items = [];
      record.schema_intake_record.rejected_items = [];
      break;
    default:
      throw new Error(`Unhandled stop code: ${stopCode}`);
  }
  return {
    fixture_name: file.replace(".sample.json", ""),
    fixture_target: fixtureTarget,
    valid: false,
    expected_stop_code: stopCode,
    record,
  };
}

function checklistTable(items) {
  return [
    "| requirement | status | proof_required_to_close |",
    "|---|---|---|",
    ...items.map((item) => `| ${item.requirement} | ${item.status} | ${item.proof_required_to_close} |`),
  ].join("\n");
}

function findingTable(items) {
  return [
    "| finding | classification | blocks | does_not_block | proof_required_to_close |",
    "|---|---|---|---|---|",
    ...items.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
  ].join("\n");
}

function nonNegotiables() {
  return [
    "- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
    "- Bind all outputs to merged PR #203 and the accepted `READY_FOR_OWNER_CONTROLLED_DISPATCH` decision.",
    "- Do not invent owner delivery proof, timestamps, delivery references, sent material, expert responses, or schema-passing responses.",
    "- Record dispatch status for England and Flanders using only the PR #203 delivery vocabulary.",
    "- Preserve England-only and Flanders-only jurisdiction boundaries.",
    "- Keep contact candidates role-only; do not store named experts, private contact details, or private dispatch endpoints.",
    "- Send or mark sent only approved request packet/contact text/consent/intake material when owner proof exists.",
    "- Quarantine personal/student/school data, legal/compliance/inspection-readiness claims, localized output, sufficiency claims, jurisdiction overclaims, and official-authority substitution.",
    "- Do not proceed to expert response analysis without owner proof and accepted, consented, schema-passing, quarantine-clean responses.",
    "- Keep localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, student/product use, compliance/inspection-readiness, support/accommodation/accessibility sufficiency, and school evidence blocked.",
    "- Include blocks, does_not_block, and proof_required_to_close for carried issues.",
    "- PASS WITH FLAGS may not carry a missing core requirement.",
  ];
}

function renderDispatchMarkdown(report) {
  return [
    "# Owner-Controlled Dispatch Record",
    "",
    `Status: \`${report.status}\``,
    `Accepted input decision: \`${report.accepted_input_decision}\``,
    `Selected decision: \`${report.selected_decision}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${report.product_end_state}\``,
    `- Original sprint/gate spec: \`${report.original_sprint_gate_spec}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Dispatch Status",
    "",
    "| jurisdiction | delivery_status | owner_delivery_proof_recorded | material_sent |",
    "|---|---|---|---|",
    ...report.jurisdictions.map((item) => `| ${item.jurisdiction_label} | \`${item.delivery_status}\` | \`${item.owner_delivery_proof_recorded}\` | ${item.material_sent.length} |`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(report.core_requirement_checklist),
    "",
    "## Findings",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderIntakeMarkdown(report) {
  return [
    `# ${report.jurisdiction_label} Owner-Controlled Dispatch And Response Intake`,
    "",
    `Delivery status: \`${report.delivery_status}\``,
    `Response status: \`${report.response_status}\``,
    `Response received: \`${report.response_received}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${report.product_end_state}\``,
    `- Original sprint/gate spec: \`${report.original_sprint_gate_spec}\``,
    "",
    "## Jurisdiction Boundary",
    "",
    report.jurisdiction_boundary.boundary,
    "",
    "## Pending Items",
    "",
    ...report.pending_items.map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(report.core_requirement_checklist),
    "",
    "## Findings",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderQuarantineMarkdown(report) {
  return [
    "# Owner-Controlled Response Quarantine Report",
    "",
    `Status: \`${report.status}\``,
    `Response analysis allowed: \`${report.response_analysis_allowed}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${report.product_end_state}\``,
    `- Original sprint/gate spec: \`${report.original_sprint_gate_spec}\``,
    "",
    "## Quarantine Rules",
    "",
    "| rule | expected_stop_code | applies_to_absent_responses |",
    "|---|---|---|",
    ...report.quarantine_rules.map((item) => `| \`${item.rule_id}\` | \`${item.expected_stop_code}\` | \`${item.applies_to_absent_responses}\` |`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(report.core_requirement_checklist),
    "",
    "## Findings",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderDecisionMarkdown(report) {
  return [
    "# Owner-Controlled Dispatch Decision",
    "",
    `Selected decision: \`${report.final_decision.selected}\``,
    "",
    report.final_decision.rationale,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${report.product_end_state}\``,
    `- Original sprint/gate spec: \`${report.original_sprint_gate_spec}\``,
    "",
    "## Decision Logic",
    "",
    "| rule | observed | selected_when_true |",
    "|---|---|---|",
    ...report.decision_logic.map((item) => `| ${item.rule} | \`${item.observed}\` | \`${item.selected_when_true}\` |`),
    "",
    "## Owner Next Action",
    "",
    report.owner_next_action,
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(report.core_requirement_checklist),
    "",
    "## Findings",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function sprintPlan() {
  return [
    `# ${SPRINT_ID} Sprint Plan`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\` from \`${ACCEPTED_INPUT_DECISION_SOURCE}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Required Outputs",
    "",
    ...OUTPUT_ALLOWLIST.map((item) => `- \`${item}\``),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(coreRequirementChecklist()),
    "",
    "## Findings",
    "",
    findingTable(findingClassification("Sprint plan defines a repository-bound owner-controlled dispatch record/intake packet without inventing dispatch proof or responses.")),
  ].join("\n");
}

function specialistReview(role, verdict, summary) {
  return [
    `# ${SPRINT_ID} ${role}`,
    "",
    `Verdict: ${verdict}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(coreRequirementChecklist()),
    "",
    "## Review Summary",
    "",
    summary,
    "",
    "## Findings",
    "",
    findingTable([
      {
        finding: `${role} returned ${verdict}.`,
        classification: "core_requirement_met",
        blocks: "Nothing for human review once exact-head readiness and CI pass.",
        does_not_block: "Owner review of this internal packet.",
        proof_required_to_close: "Exact-head readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "Dispatch proof and accepted responses remain absent.",
        classification: "scale_blocker",
        blocks: "Expert response analysis and downstream authority.",
        does_not_block: "Human review of the honest packet.",
        proof_required_to_close: "Owner proof, schema-passing response, quarantine PASS, and separate human review.",
      },
    ]),
  ].join("\n");
}

function subagentQualityGateRecord() {
  return [
    `# ${SPRINT_ID} Subagent Quality Gate Record`,
    "",
    "Verdict: PASS",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(coreRequirementChecklist()),
    "",
    "## Findings",
    "",
    findingTable([
      {
        finding: "Lead, legal/privacy, England, Flanders, teacher/economics, accessibility, and final lead reviews are required before PR readiness.",
        classification: "core_requirement_met",
        blocks: "Nothing after review files, checker, and CI pass.",
        does_not_block: "Exact-head PR readiness.",
        proof_required_to_close: "All review records present, checker PASS, focused Jest PASS, green CI.",
      },
    ]),
  ].join("\n");
}

function correctionLog() {
  return [
    `# ${SPRINT_ID} Correction Log`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Corrections",
    "",
    "- Initial implementation records no external dispatch proof, no sent material, and no expert response; the decision therefore selects `REVISE_OWNER_DISPATCH_PROCESS`.",
    "- Negative fixtures cover invented proof, private contact storage, named expert selection, missing not-sent reason, forbidden material, unsafe response classes, jurisdiction overclaims, and premature response analysis.",
    "- Flanders specialist HOLD 1 found static Flanders boundary and role/source fields were not semantically asserted. Added static boundary/source/role checker assertions and four static Flanders negative fixtures.",
    "- Flanders specialist HOLD 2 found contradictory static text with retained disclaimers could bypass exact phrase checks. Added disclaimer-stripping and positive overclaim rejection for Belgium, school-network, authority, evidence, product/inspection, compliance, and legal variants.",
    "- Flanders specialist HOLD 3 found additional synonyms such as `throughout Belgium`, `Belgian-wide`, `education network`, `network evidence`, and `compliance authority`. Broadened invariant checks after stripping approved negations/disclaimers.",
    "- Flanders specialist HOLD 4 found plural `networks` was missed by the fallback. Updated static network detection to `networks?` and isolated the `covers all Flemish school networks` regression.",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Validation",
    "",
    "- `node build-scripts/inspection/build-owner-controlled-dispatch.js --check`",
    "- `node build-scripts/inspection/check-owner-controlled-dispatch.js`",
    "- `npx jest build-scripts/inspection/check-owner-controlled-dispatch.test.js --runInBand --no-cache`",
    "- `node build-scripts/inspection/check-owner-delivery-protocol-repair.js`",
    "- `npm run check:scope-language`",
    "- `npm run check:active-governance-wording`",
    "- `node build-scripts/reports/validate-report-json.js`",
    "- `git diff --check`",
    "- `npm run check:platform`",
  ].join("\n");
}

function finalLeadReview() {
  return specialistReview(
    "Final Lead Review",
    "PASS",
    "Final lead review returns PASS for content readiness: the packet is bound to PR #203, records no dispatch proof or response, blocks response analysis, preserves England/Flanders jurisdiction boundaries, and routes to human review. The selected decision is `REVISE_OWNER_DISPATCH_PROCESS`, not response analysis."
  );
}

function closureRecord() {
  return [
    `# ${SPRINT_ID} Closure Record`,
    "",
    "Verdict: PASS",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Decision",
    "",
    `- Selected decision: \`${SELECTED_DECISION}\``,
    "- Owner-controlled dispatch protocol is ready from PR #203, but no owner proof or response exists here.",
    "- Response analysis and downstream product authority remain blocked.",
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(coreRequirementChecklist()),
    "",
    "## Findings",
    "",
    findingTable(findingClassification("Closure records the honest owner-controlled dispatch state and preserves all downstream blocks.")),
  ].join("\n");
}

function outputContents() {
  const dispatch = ownerControlledDispatchRecord();
  const england = responseIntakeReport("england", dispatch);
  const flanders = responseIntakeReport("flanders", dispatch);
  const quarantine = ownerControlledResponseQuarantineReport();
  const decision = ownerControlledDispatchDecision();
  const outputs = {
    "reports/inspection-standards/owner-controlled-dispatch-record.json": `${JSON.stringify(dispatch, null, 2)}\n`,
    "reports/inspection-standards/owner-controlled-dispatch-record.md": `${renderDispatchMarkdown(dispatch)}\n`,
    "reports/inspection-standards/england-owner-controlled-dispatch-and-response-intake.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/england-owner-controlled-dispatch-and-response-intake.md": `${renderIntakeMarkdown(england)}\n`,
    "reports/inspection-standards/flanders-owner-controlled-dispatch-and-response-intake.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/flanders-owner-controlled-dispatch-and-response-intake.md": `${renderIntakeMarkdown(flanders)}\n`,
    "reports/inspection-standards/owner-controlled-response-quarantine-report.json": `${JSON.stringify(quarantine, null, 2)}\n`,
    "reports/inspection-standards/owner-controlled-response-quarantine-report.md": `${renderQuarantineMarkdown(quarantine)}\n`,
    "reports/inspection-standards/owner-controlled-dispatch-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/owner-controlled-dispatch-decision.md": `${renderDecisionMarkdown(decision)}\n`,
    "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/owner-controlled-dispatch-record.sample.json": `${JSON.stringify(dispatch, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/england-owner-controlled-dispatch-and-response-intake.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/flanders-owner-controlled-dispatch-and-response-intake.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/owner-controlled-response-quarantine-report.sample.json": `${JSON.stringify(quarantine, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-controlled-dispatch/positive/owner-controlled-dispatch-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: `${sprintPlan()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: `${correctionLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: `${validationLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-subagent-quality-gate-record.md`]: `${subagentQualityGateRecord()}\n`,
  };
  for (const [slug, role, summary] of REVIEW_FILES) {
    outputs[`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-${slug}.md`] = `${specialistReview(role, "PASS", summary)}\n`;
  }
  outputs[`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`] = `${closureRecord()}\n`;
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stopCode), null, 2)}\n`;
  }
  return outputs;
}

function checkAcceptedInput() {
  const selected = sourceProtocolDecision().final_decision && sourceProtocolDecision().final_decision.selected;
  if (selected !== ACCEPTED_INPUT_DECISION) {
    console.error(`Accepted input decision must be ${ACCEPTED_INPUT_DECISION}; saw ${selected}`);
    process.exit(1);
  }
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
  const outputs = outputContents();
  for (const [file, content] of Object.entries(outputs)) writeFile(file, content);
}

function checkOutputs() {
  checkAcceptedInput();
  const outputs = outputContents();
  const failures = [];
  for (const [file, expected] of Object.entries(outputs)) {
    const absolute = repoPath(file);
    if (!fs.existsSync(absolute)) failures.push(`${file}: missing`);
    else if (fs.readFileSync(absolute, "utf8") !== expected) failures.push(`${file}: not current`);
  }
  if (failures.length) {
    console.error("Owner-controlled dispatch outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK owner-controlled dispatch outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote owner-controlled dispatch outputs (${Object.keys(outputContents()).length} files)`);
}

if (require.main === module) runCli();

module.exports = {
  ACCEPTED_INPUT_DECISION,
  DECISION_OPTIONS,
  DELIVERY_STATUS_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  QUARANTINE_RULES,
  SELECTED_DECISION,
  SPRINT_ID,
  coreRequirementChecklist,
  decisionLogicRows,
  doesNotAuthorize,
  noOutputFlagsForOwnerControlledDispatch,
  outputContents,
  ownerControlledDispatchDecision,
  ownerControlledDispatchRecord,
  ownerControlledResponseQuarantineReport,
  responseIntakeReport,
  validResponse,
};
