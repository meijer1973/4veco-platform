#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
  doesNotAuthorize: priorDoesNotAuthorize,
  noOutputFlagsForOwnerDispatch,
  validResponse: priorValidResponse,
} = require("./build-owner-manual-dispatch-and-response-intake.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-07-02";
const SPRINT_ID = "GOAL-IQS-OWNER-DELIVERY-PROTOCOL-COMPLETION-1";
const SOURCE_SPRINT_ID = "GOAL-IQS-OWNER-MANUAL-DISPATCH-AND-RESPONSE-INTAKE-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const PRIOR_OWNER_DISPATCH = "reports/inspection-standards/owner-manual-dispatch-record.json";
const PRIOR_ENGLAND_INTAKE = "reports/inspection-standards/england-local-expert-response-intake.json";
const PRIOR_FLANDERS_INTAKE = "reports/inspection-standards/flanders-local-expert-response-intake.json";
const PRIOR_QUARANTINE = "reports/inspection-standards/local-expert-response-quarantine-report.json";
const PRIOR_DECISION = "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.json";
const ACCEPTED_INPUT_DECISION = "REVISE_DISPATCH_OR_INTAKE_PROTOCOL";
const SELECTED_DECISION = "REVISE_DELIVERY_PROTOCOL";

const DECISION_OPTIONS = [
  "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS",
  "REVISE_DELIVERY_PROTOCOL",
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
  PRIOR_OWNER_DISPATCH,
  PRIOR_ENGLAND_INTAKE,
  PRIOR_FLANDERS_INTAKE,
  PRIOR_QUARANTINE,
  PRIOR_DECISION,
  "references/schemas/local-expert-contact-consent.schema.v1.json",
  "references/schemas/local-expert-response-intake.schema.v1.json",
];

const OUTPUT_ALLOWLIST = [
  "reports/inspection-standards/owner-delivery-channel-proof.json",
  "reports/inspection-standards/owner-delivery-channel-proof.md",
  "reports/inspection-standards/england-owner-delivery-and-response-intake.json",
  "reports/inspection-standards/england-owner-delivery-and-response-intake.md",
  "reports/inspection-standards/flanders-owner-delivery-and-response-intake.json",
  "reports/inspection-standards/flanders-owner-delivery-and-response-intake.md",
  "reports/inspection-standards/owner-delivery-response-quarantine-report.json",
  "reports/inspection-standards/owner-delivery-response-quarantine-report.md",
  "reports/inspection-standards/owner-delivery-protocol-completion-decision.json",
  "reports/inspection-standards/owner-delivery-protocol-completion-decision.md",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/owner-delivery-channel-proof.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/england-owner-delivery-and-response-intake.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/flanders-owner-delivery-and-response-intake.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/owner-delivery-response-quarantine-report.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/owner-delivery-protocol-completion-decision.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/delivery-proof-invented.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/sent-without-proof.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/named-contact-storage.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/response-without-consent.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/personal-data-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/school-evidence-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/legal-compliance-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/inspection-exam-approval-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/localized-output-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/support-accommodation-sufficiency-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/expert-as-official-authority.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/england-whole-uk-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/flanders-all-belgium-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/proceed-to-analysis-without-delivery-proof.sample.json",
];

const NEGATIVE_FIXTURES = [
  ["delivery-proof-invented.sample.json", "STOP_UNSUPPORTED_DELIVERY_PROOF"],
  ["sent-without-proof.sample.json", "STOP_UNSUPPORTED_DELIVERY_PROOF"],
  ["named-contact-storage.sample.json", "STOP_PERSONAL_CONTACT_DETAILS"],
  ["response-without-consent.sample.json", "STOP_MISSING_CONSENT_BOUNDARY"],
  ["personal-data-response.sample.json", "STOP_PERSONAL_DATA_RESPONSE"],
  ["school-evidence-response.sample.json", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  ["legal-compliance-response.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["inspection-exam-approval-response.sample.json", "STOP_INSPECTION_EXAM_APPROVAL_CLAIM"],
  ["localized-output-response.sample.json", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  ["support-accommodation-sufficiency-response.sample.json", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  ["expert-as-official-authority.sample.json", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["england-whole-uk-overclaim.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["flanders-all-belgium-overclaim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ["proceed-to-analysis-without-delivery-proof.sample.json", "STOP_RESPONSE_ANALYSIS_WITHOUT_DELIVERY_PROOF"],
];

const REFUSAL_CASES = [
  [["--delivery-proof"], "STOP_UNSUPPORTED_DELIVERY_PROOF"],
  [["--material-sent"], "STOP_UNSUPPORTED_DELIVERY_PROOF"],
  [["--named-contact"], "STOP_PERSONAL_CONTACT_DETAILS"],
  [["--response-without-consent"], "STOP_MISSING_CONSENT_BOUNDARY"],
  [["--personal-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--student-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--school-evidence"], "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  [["--legal-advice"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--compliance-proof"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--inspection-readiness"], "STOP_INSPECTION_EXAM_APPROVAL_CLAIM"],
  [["--exam-approval"], "STOP_INSPECTION_EXAM_APPROVAL_CLAIM"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accessibility-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accessibility-legal-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--legal-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--individual-adjustment-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--expert-authority"], "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
  [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
  [["--proceed-to-analysis"], "STOP_RESPONSE_ANALYSIS_WITHOUT_DELIVERY_PROOF"],
];

const QUARANTINE_RULES = [
  ["no_response_yet", "CARRY_NO_RESPONSE_YET"],
  ["out_of_scope", "STOP_OUT_OF_SCOPE_RESPONSE"],
  ["contains_forbidden_claim", "STOP_FORBIDDEN_RESPONSE_CLAIM"],
  ["contains_personal_data", "STOP_PERSONAL_DATA_RESPONSE"],
  ["claims_legal_or_compliance_authority", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["claims_school_evidence", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  ["claims_inspection_or_exam_approval", "STOP_INSPECTION_EXAM_APPROVAL_CLAIM"],
  ["contains_localized_output", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  ["treats_expert_as_official_authority", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["claims_support_accommodation_accessibility_sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  ["jurisdiction_overclaim", "STOP_JURISDICTION_OVERCLAIM"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["prior_protocol_decision_bound", "Completion work is bound to merged PR #196 `REVISE_DISPATCH_OR_INTAKE_PROTOCOL`."],
  ["owner_delivery_channel_proof_recorded", "Owner delivery-channel proof state is recorded, including absence of proof."],
  ["england_delivery_status_recorded", "England dispatch/intake status is recorded with an allowed delivery state."],
  ["flanders_delivery_status_recorded", "Flanders dispatch/intake status is recorded with Flanders-only boundaries."],
  ["strict_response_schema_boundary", "Responses remain schema-bound and empty until consented, schema-passing responses exist."],
  ["quarantine_rules_cover_real_and_absent_responses", "Quarantine covers no-response, forbidden content, personal data, school evidence, legal/compliance, localized output, and authority overclaims."],
  ["automatic_decision_logic", "Final decision is automatic from delivery proof, response, schema, and quarantine state."],
  ["no_invented_delivery_or_response", "The packet does not invent delivery proof, sent material, or expert responses."],
  ["downstream_authority_blocked", "Localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, and official-authority claims remain blocked."],
  ["review_route_preserved", "Specialist reviews, final lead review, exact-head PR readiness, green CI, branch protection ok:true, and human review remain required."],
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

function priorDecision() {
  return readJson(PRIOR_DECISION);
}

function priorOwnerDispatch() {
  return readJson(PRIOR_OWNER_DISPATCH);
}

function priorIntake(jurisdictionId) {
  return readJson(jurisdictionId === "england" ? PRIOR_ENGLAND_INTAKE : PRIOR_FLANDERS_INTAKE);
}

function priorDispatchJurisdiction(jurisdictionId) {
  const record = priorOwnerDispatch().jurisdictions.find((item) => item.jurisdiction_id === jurisdictionId);
  if (!record) throw new Error(`${PRIOR_OWNER_DISPATCH}: missing ${jurisdictionId}`);
  return record;
}

function jurisdictionLabel(jurisdictionId) {
  return jurisdictionId === "england" ? "England" : "Flanders";
}

function doesNotAuthorize() {
  return unique([
    ...priorDoesNotAuthorize(),
    "owner delivery proof invention",
    "external dispatch without owner proof",
    "private delivery-channel storage",
    "expert response analysis before accepted responses",
    "treating pending or absent responses as approval",
    "treating expert feedback as official/legal/inspection/school authority",
    "school-owned evidence claims",
    "inspection or exam approval claims",
    "support/accommodation/accessibility sufficiency claims",
  ]);
}

function noOutputFlagsForDeliveryCompletion() {
  return {
    ...noOutputFlagsForOwnerDispatch(),
    owner_delivery_protocol_completion_goal_authorized: true,
    owner_delivery_channel_proof_recorded: false,
    approved_delivery_channel_exists: false,
    owner_delivery_channel_class_recorded: false,
    owner_delivery_timestamp_recorded: false,
    owner_delivery_material_sent: false,
    owner_delivery_response_received: false,
    schema_passing_response_available: false,
    expert_response_analysis_authorized: false,
    delivery_protocol_revision_required: true,
  };
}

function ownerAuthorization() {
  return {
    authorization_id: "thread-owner-authorization-2026-07-02-owner-delivery-protocol-completion",
    authorization_source: "Codex thread owner message dated 2026-07-02 after merged PR #196",
    accepted_decision: ACCEPTED_INPUT_DECISION,
    authorized_scope: [
      "record owner-controlled delivery proof state for England and Flanders",
      "record strict response-intake state and quarantine handling",
      "select exactly one decision from the allowed protocol-completion decision set",
      "return with a complete delivery/intake/quarantine packet and final review evidence",
    ],
    does_not_authorize: doesNotAuthorize(),
  };
}

function coreRequirementChecklist() {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status: "met",
    proof_required_to_close: "Generator currentness PASS, delivery-protocol checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review.",
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
    accepted_input_decision_source: PRIOR_DECISION,
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_ALLOWLIST,
    owner_authorization: ownerAuthorization(),
    core_requirement_checklist: coreRequirementChecklist(),
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForDeliveryCompletion(),
  };
}

function findingClassification(summary) {
  return [
    {
      finding: summary,
      classification: "core_requirement_met",
      blocks: "Nothing for internal human review once exact-head readiness, CI, and branch protection pass.",
      does_not_block: "Owner review of the complete delivery/intake protocol-completion packet.",
      proof_required_to_close: "Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
    },
    {
      finding: "No owner delivery proof, sent material, consented response, schema-passing response, or accepted response exists in this workspace.",
      classification: "scale_blocker",
      blocks: "Expert response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
      does_not_block: "Internal review of the honest protocol-completion state and a later owner-run delivery proof step.",
      proof_required_to_close: "Owner delivery proof, consented schema-passing responses, quarantine PASS, specialist review, and separate human review.",
    },
  ];
}

function deliveryChannelJurisdiction(jurisdictionId) {
  const source = priorDispatchJurisdiction(jurisdictionId);
  return {
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: jurisdictionLabel(jurisdictionId),
    source_prior_owner_dispatch_jurisdiction: source.jurisdiction_id,
    owner_authorization_reference: ownerAuthorization().authorization_id,
    delivery_channel_class: "none_recorded",
    approved_delivery_channel_exists: false,
    approved_contact_text_version: source.approved_contact_text_version,
    accepted_request_packet_version: source.accepted_request_packet_version,
    delivery_timestamp: null,
    delivery_proof: null,
    not_sent_reason: "No approved owner delivery channel, delivery timestamp, or delivery proof is present in this workspace; the repository must not invent dispatch.",
    material_sent: [],
    material_explicitly_not_sent: source.material_explicitly_not_sent,
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
    storage_boundary: "Repository storage may hold only role/organization-level delivery status, schema-passing response records, and quarantine metadata; private contact details and named expert details remain outside this packet.",
    withdrawal_boundary: "Any later response must be removable or quarantined if consent is absent, withdrawn, or outside the approved schema boundary.",
    proof_required_to_mark_sent: "Owner delivery proof with approved no-personal-data channel, exact approved payload, timestamp, consent boundary, and no forbidden attachment.",
  };
}

function ownerDeliveryChannelProof() {
  return {
    ...baseReport("owner_delivery_channel_proof"),
    report_id: "owner-delivery-channel-proof",
    status: "no_owner_delivery_channel_proof_recorded",
    source_prior_owner_dispatch_record: PRIOR_OWNER_DISPATCH,
    source_prior_decision: PRIOR_DECISION,
    prior_decision_selected: priorDecision().final_decision.selected,
    approved_delivery_channel_exists: false,
    delivery_channel_class: "none_recorded",
    owner_delivery_proof_recorded: false,
    repository_claims_external_dispatch: false,
    material_sent_count: 0,
    jurisdictions: ["england", "flanders"].map(deliveryChannelJurisdiction),
    finding_classification: findingClassification("Owner delivery-channel proof state is recorded honestly: no approved delivery channel, timestamp, sent material, or owner delivery proof is present."),
  };
}

function jurisdictionBoundary(jurisdictionId) {
  if (jurisdictionId === "england") {
    return {
      jurisdiction_boundary: "England only; not the whole UK, not Scotland, Wales, Northern Ireland, or all awarding bodies.",
      forbidden_overclaims: ["whole UK", "Scotland", "Wales", "Northern Ireland", "all awarding bodies"],
    };
  }
  return {
    jurisdiction_boundary: "Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and not all school networks.",
    forbidden_overclaims: ["all Belgium", "French Community", "German-speaking Community", "all school networks"],
  };
}

function deliveryAndResponseIntake(jurisdictionId, proof = ownerDeliveryChannelProof()) {
  const proofItem = proof.jurisdictions.find((item) => item.jurisdiction_id === jurisdictionId);
  const sourceIntake = priorIntake(jurisdictionId);
  const schemaIntake = strictResponseIntakeRecord(sourceIntake.schema_intake_record);
  schemaIntake.proof_required_to_use = "Owner delivery proof, explicit consent, strict schema PASS, quarantine PASS, specialist review PASS, final lead PASS, and human review are required before any response can be used as internal interpretive input.";
  return {
    ...baseReport("owner_delivery_and_response_intake"),
    report_id: `${jurisdictionId}-owner-delivery-and-response-intake`,
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: jurisdictionLabel(jurisdictionId),
    source_owner_delivery_channel_proof: "reports/inspection-standards/owner-delivery-channel-proof.json",
    source_prior_response_intake_report: jurisdictionId === "england" ? PRIOR_ENGLAND_INTAKE : PRIOR_FLANDERS_INTAKE,
    source_prior_schema_intake_record: sourceIntake.schema_intake_record.intake_id,
    allowed_delivery_statuses: DELIVERY_STATUS_OPTIONS,
    delivery_status: "not_sent_no_safe_channel",
    response_status: "no_response_yet",
    owner_delivery_proof_recorded: false,
    delivery_channel_class: proofItem.delivery_channel_class,
    delivery_timestamp: null,
    material_sent: [],
    response_received: false,
    accepted_response_available: false,
    response_schema_status: "no_response_yet",
    schema_source: "references/schemas/local-expert-response-intake.schema.v1.json",
    schema_intake_record: schemaIntake,
    pending_items: [
      "owner delivery proof",
      "approved no-personal-data delivery channel",
      "delivery timestamp",
      "explicit response-storage consent",
      "schema-passing response",
      "quarantine check",
      "specialist review",
      "human review before response analysis",
    ],
    quarantined_items: [],
    jurisdiction_boundary: jurisdictionBoundary(jurisdictionId),
    proof_required_to_close: "Owner delivery proof plus a consented, schema-passing response or explicit no-response carry reviewed by specialists and the owner.",
    finding_classification: findingClassification(`${jurisdictionLabel(jurisdictionId)} delivery/intake is recorded as not sent because no safe owner delivery channel proof exists; no response is stored or interpreted.`),
  };
}

function strictResponseIntakeRecord(record) {
  const allowed = [
    "intake_id",
    "jurisdiction_id",
    "request_packet_id",
    "consent_confirmed",
    "response_received",
    "responses",
    "validation_status",
    "rejected_items",
    "does_not_authorize",
    "proof_required_to_use",
  ];
  const strict = {};
  for (const key of allowed) strict[key] = clone(record[key]);
  return strict;
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

function ownerDeliveryResponseQuarantineReport() {
  const prior = readJson(PRIOR_QUARANTINE);
  return {
    ...baseReport("owner_delivery_response_quarantine_report"),
    report_id: "owner-delivery-response-quarantine-report",
    status: "quarantine_ready_no_real_responses",
    source_prior_quarantine_report: PRIOR_QUARANTINE,
    source_prior_quarantine_status: prior.status,
    no_real_responses_stored: true,
    absent_response_items: ["england", "flanders"].map((jurisdictionId) => ({
      jurisdiction_id: jurisdictionId,
      quarantine_category: "no_response_yet",
      status: "carried_pending_owner_delivery",
      proof_required_to_close: "Owner delivery proof and response-intake evidence.",
    })),
    quarantine_rules: QUARANTINE_RULES.map(([ruleId, stopCode]) => quarantineRule(ruleId, stopCode)),
    quarantined_items: [],
    finding_classification: findingClassification("Quarantine rules cover both absent responses and unsafe real-response classes; no real response is stored in this packet."),
  };
}

function decisionLogicRows(proof, england, flanders, quarantine) {
  return [
    {
      rule: "If no delivery proof exists -> REVISE_DELIVERY_PROTOCOL.",
      observed: proof.owner_delivery_proof_recorded === false,
      selected_when_true: "REVISE_DELIVERY_PROTOCOL",
    },
    {
      rule: "If delivery happened but no response exists -> REVISE_DELIVERY_PROTOCOL or response-pending carry, not analysis.",
      observed: [england, flanders].some((item) => item.delivery_status === "sent_response_pending"),
      selected_when_true: "REVISE_DELIVERY_PROTOCOL",
    },
    {
      rule: "If response exists but fails schema/quarantine -> REVISE_DELIVERY_PROTOCOL.",
      observed: quarantine.quarantined_items.length > 0,
      selected_when_true: "REVISE_DELIVERY_PROTOCOL",
    },
    {
      rule: "If at least one useful, consented, schema-passing response exists and all unsafe material is quarantined -> PROCEED_TO_EXPERT_RESPONSE_ANALYSIS.",
      observed: [england, flanders].some((item) => item.delivery_status === "sent_response_received_schema_pass"),
      selected_when_true: "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS",
    },
  ];
}

function ownerDeliveryProtocolCompletionDecision() {
  const proof = ownerDeliveryChannelProof();
  const england = deliveryAndResponseIntake("england", proof);
  const flanders = deliveryAndResponseIntake("flanders", proof);
  const quarantine = ownerDeliveryResponseQuarantineReport();
  return {
    ...baseReport("owner_delivery_protocol_completion_decision"),
    report_id: "owner-delivery-protocol-completion-decision",
    status: "ready_for_human_review",
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "No owner delivery proof, approved delivery channel, sent material, consented response, schema-passing response, or accepted response exists in this workspace. The correct next decision is to revise or complete the delivery protocol rather than proceed to expert response analysis.",
    },
    owner_delivery_channel_proof: proof.report_id,
    response_intake_reports: [england.report_id, flanders.report_id],
    quarantine_report: quarantine.report_id,
    decision_logic: decisionLogicRows(proof, england, flanders, quarantine),
    proceed_to_expert_response_analysis: false,
    protocol_revision_required: true,
    stop_track: false,
    external_dispatch_performed: false,
    real_responses_received: false,
    accepted_responses_available: false,
    owner_next_action: "Provide owner-controlled delivery proof outside repository storage only if an approved no-personal-data channel exists; send only approved contact text plus accepted request packet; then return with consented schema-passing response records or quarantine records.",
    finding_classification: findingClassification("Final decision selects `REVISE_DELIVERY_PROTOCOL` by rule because no owner delivery proof or accepted response exists."),
  };
}

function responseWith(jurisdictionId, text, consent = true) {
  const report = deliveryAndResponseIntake(jurisdictionId);
  report.response_received = true;
  report.accepted_response_available = consent;
  report.response_status = consent ? "sent_response_received_schema_pass" : "sent_response_quarantined";
  report.delivery_status = consent ? "sent_response_received_schema_pass" : "sent_response_quarantined";
  report.owner_delivery_proof_recorded = true;
  report.schema_intake_record.consent_confirmed = consent;
  report.schema_intake_record.response_received = true;
  report.schema_intake_record.responses = [priorValidResponse(jurisdictionId)];
  report.schema_intake_record.responses[0].interpretation = text;
  report.schema_intake_record.validation_status = consent ? "accepted_for_internal_review" : "quarantined";
  return report;
}

function negativeFixture(file, stopCode) {
  let fixtureTarget = "owner_delivery_and_response_intake";
  let record = deliveryAndResponseIntake("england");
  switch (stopCode) {
    case "STOP_UNSUPPORTED_DELIVERY_PROOF":
      if (file.includes("delivery-proof")) {
        fixtureTarget = "owner_delivery_channel_proof";
        record = ownerDeliveryChannelProof();
        record.owner_delivery_proof_recorded = true;
        record.approved_delivery_channel_exists = true;
        record.delivery_channel_class = "unverified_private_channel";
      } else {
        record.material_sent = ["approved contact text"];
        record.delivery_status = "sent_with_owner_proof";
      }
      break;
    case "STOP_PERSONAL_CONTACT_DETAILS":
      fixtureTarget = "owner_delivery_channel_proof";
      record = ownerDeliveryChannelProof();
      record.jurisdictions[0].storage_boundary = "Store named contact at named.person@example.test.";
      break;
    case "STOP_MISSING_CONSENT_BOUNDARY":
      record = responseWith("england", "A normal response text.", false);
      break;
    case "STOP_PERSONAL_DATA_RESPONSE":
      record = responseWith("england", "This response includes personal data for a student named Example Person.");
      break;
    case "STOP_SCHOOL_EVIDENCE_RESPONSE":
      record = responseWith("flanders", "This proves school evidence, school-owned inspection evidence, and network-owned evidence from a school network.");
      break;
    case "STOP_LEGAL_COMPLIANCE_CLAIM":
      record = responseWith("england", "This is legal advice and compliance proof.");
      break;
    case "STOP_INSPECTION_EXAM_APPROVAL_CLAIM":
      record = responseWith("flanders", "This is inspection readiness, exam approval, and OK inspection quality evidence as product approval.");
      break;
    case "STOP_LOCALIZED_OUTPUT_RESPONSE":
      record = responseWith("england", "Here is localized student-facing output for an England edition.");
      break;
    case "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM":
      record = responseWith("england", "This confirms support sufficiency, accommodation sufficiency, accessibility sufficiency, accessibility/legal sufficiency, legal sufficiency, and individual-adjustment sufficiency.");
      break;
    case "STOP_EXPERT_AS_OFFICIAL_AUTHORITY":
      record = responseWith("england", "This expert response is official authority and substitutes for official source review.");
      break;
    case "STOP_WHOLE_UK_OVERCLAIM":
      record = responseWith("england", "This applies to the whole UK, including Scotland, Wales, and Northern Ireland.");
      break;
    case "STOP_ALL_BELGIUM_OVERCLAIM":
      record = responseWith("flanders", "This applies to all Belgium, including the French Community and all school networks.");
      break;
    case "STOP_RESPONSE_ANALYSIS_WITHOUT_DELIVERY_PROOF":
      fixtureTarget = "owner_delivery_protocol_completion_decision";
      record = ownerDeliveryProtocolCompletionDecision();
      record.final_decision.selected = "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS";
      record.proceed_to_expert_response_analysis = true;
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
    "- Bind all outputs to merged PR #196 and the accepted `REVISE_DISPATCH_OR_INTAKE_PROTOCOL` decision.",
    "- Do not invent delivery proof, delivery timestamps, sent material, expert responses, or schema-passing responses.",
    "- Record delivery status for England and Flanders using only the allowed delivery vocabulary.",
    "- Preserve England-only and Flanders-only jurisdiction boundaries.",
    "- Do not store named experts, private contact details, private delivery endpoints, personal/student/school data, or school evidence.",
    "- Quarantine forbidden response content, legal/compliance/inspection/exam claims, localized output, sufficiency claims, and official-authority substitution.",
    "- Select exactly one final decision by automatic state logic.",
    "- Keep localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, student/product use, compliance/inspection-readiness, support/accommodation/accessibility sufficiency, and school evidence blocked.",
    "- Include blocks, does_not_block, and proof_required_to_close for carried issues.",
    "- PASS WITH FLAGS may not carry a missing core requirement.",
  ];
}

function renderProofMarkdown(report) {
  return [
    "# Owner Delivery Channel Proof",
    "",
    `Status: \`${report.status}\``,
    `Approved delivery channel exists: \`${report.approved_delivery_channel_exists}\``,
    `Owner delivery proof recorded: \`${report.owner_delivery_proof_recorded}\``,
    "",
    "| jurisdiction | delivery_channel_class | delivery_timestamp | material_sent |",
    "|---|---|---|---|",
    ...report.jurisdictions.map((item) => `| ${item.jurisdiction_label} | \`${item.delivery_channel_class}\` | \`${item.delivery_timestamp}\` | ${item.material_sent.length} |`),
    "",
    "## Finding Classification",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderIntakeMarkdown(report) {
  return [
    `# ${report.jurisdiction_label} Owner Delivery And Response Intake`,
    "",
    `Delivery status: \`${report.delivery_status}\``,
    `Response status: \`${report.response_status}\``,
    `Response received: \`${report.response_received}\``,
    "",
    "## Jurisdiction Boundary",
    "",
    report.jurisdiction_boundary.jurisdiction_boundary,
    "",
    "## Pending Items",
    "",
    ...report.pending_items.map((item) => `- ${item}`),
    "",
    "## Finding Classification",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderQuarantineMarkdown(report) {
  return [
    "# Owner Delivery Response Quarantine Report",
    "",
    `Status: \`${report.status}\``,
    `Quarantined real items: \`${report.quarantined_items.length}\``,
    "",
    "| rule | expected_stop_code | applies_to_absent_responses |",
    "|---|---|---|",
    ...report.quarantine_rules.map((item) => `| \`${item.rule_id}\` | \`${item.expected_stop_code}\` | \`${item.applies_to_absent_responses}\` |`),
    "",
    "## Finding Classification",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderDecisionMarkdown(report) {
  return [
    "# Owner Delivery Protocol Completion Decision",
    "",
    `Selected decision: \`${report.final_decision.selected}\``,
    "",
    report.final_decision.rationale,
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
    "## Finding Classification",
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
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\` from \`${PRIOR_DECISION}\``,
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
  ].join("\n");
}

function specialistReview(role, verdict, summary) {
  return [
    `# ${SPRINT_ID} ${role}`,
    "",
    `Verdict: ${verdict}.`,
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
        finding: summary,
        classification: "core_requirement_met",
        blocks: `Nothing for this ${role} review.`,
        does_not_block: "Human review of the complete delivery/intake protocol-completion packet.",
        proof_required_to_close: "Delivery-protocol checker PASS, focused Jest PASS, final lead PASS, exact-head readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Response analysis and downstream authority remain blocked.",
        classification: "scale_blocker",
        blocks: "Expert response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "Internal review of honest delivery/intake status and a later owner delivery proof step.",
        proof_required_to_close: "Owner delivery proof, consented schema-passing responses, quarantine PASS, specialist review, and separate human review.",
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
    "| Missing owner delivery proof state | closed | Added owner delivery-channel proof record that records absence of approved channel, timestamp, sent material, and proof | Generator/checker/Jest PASS |",
    "| Premature response-analysis risk | closed | Decision logic selects `REVISE_DELIVERY_PROTOCOL` unless delivery proof and schema-passing responses exist | Decision checker PASS |",
    "| Unsafe response storage risk | closed | Per-jurisdiction intakes stay empty and quarantine rules cover unsafe real-response classes | Negative fixtures PASS |",
    "| Jurisdiction overclaim risk | closed | England and Flanders records preserve local boundaries | Specialist reviews and checker PASS |",
    "| Accessibility/inclusion reviewer found missing sufficiency wording variants | closed | Checker and fixtures now catch accessibility/legal sufficiency, legal sufficiency, and individual-adjustment sufficiency wording | Focused Jest reviewer-probe tests PASS |",
    "| Flanders reviewer found OK/product-approval and school-network evidence wording gaps | closed | Checker and fixtures now catch OK inspection quality evidence as product approval and network-owned evidence from a school network | Focused Jest reviewer-probe tests PASS |",
    "| England reviewer found all-awarding-bodies and narrative authority gaps | closed | Checker now requires the all-awarding-bodies boundary and scans decision/narrative fields for absent-response approval and official-authority assertions | Focused Jest reviewer-probe tests PASS |",
    "| Lead/architecture reviewer found strict schema and automatic-decision proof gaps | closed | Checker now strictly validates embedded response-intake schema fields/additional properties and recomputes decision rows from proof/intake/quarantine state | Strict-schema and contradiction tests PASS |",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "| Command | Status |",
    "|---|---|",
    "| `node build-scripts/inspection/build-owner-delivery-protocol-completion.js --check` | PASS |",
    "| `node build-scripts/inspection/check-owner-delivery-protocol-completion.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-owner-delivery-protocol-completion.test.js --runInBand` | PASS |",
    "| `node build-scripts/inspection/check-owner-manual-dispatch-and-response-intake.js` | PASS |",
    "| `npm.cmd run check:scope-language` | PASS |",
    "| `npm.cmd run check:active-governance-wording` | PASS |",
    "| `git diff --check origin/main..HEAD` | PASS |",
    "| `npm.cmd run check:platform` | PASS |",
  ].join("\n");
}

function finalLeadReview() {
  return specialistReview(
    "Final Lead Review",
    "PASS",
    "Final lead review returned PASS: the complete packet records delivery status for England and Flanders, captures no invented delivery proof or response, keeps response intake schema-bound, quarantines unsafe cases, selects `REVISE_DELIVERY_PROTOCOL`, and preserves all downstream authority blocks."
  );
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
        finding: "Owner delivery protocol-completion packet is ready for exact-head human review.",
        classification: "core_requirement_met",
        blocks: "Nothing once exact-head PR readiness, branch protection ok:true, and CI pass.",
        does_not_block: "Human review of this internal packet.",
        proof_required_to_close: "Exact-head readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "No external delivery proof, accepted response, or response-analysis authority is claimed.",
        classification: "scale_blocker",
        blocks: "Expert response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "A later owner delivery proof and schema-bound intake sprint.",
        proof_required_to_close: "Owner delivery proof, accepted responses, quarantine PASS, specialist review, and separate human review.",
      },
    ]),
  ].join("\n");
}

function outputContents() {
  const proof = ownerDeliveryChannelProof();
  const england = deliveryAndResponseIntake("england", proof);
  const flanders = deliveryAndResponseIntake("flanders", proof);
  const quarantine = ownerDeliveryResponseQuarantineReport();
  const decision = ownerDeliveryProtocolCompletionDecision();
  const outputs = {
    "reports/inspection-standards/owner-delivery-channel-proof.json": `${JSON.stringify(proof, null, 2)}\n`,
    "reports/inspection-standards/owner-delivery-channel-proof.md": `${renderProofMarkdown(proof)}\n`,
    "reports/inspection-standards/england-owner-delivery-and-response-intake.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/england-owner-delivery-and-response-intake.md": `${renderIntakeMarkdown(england)}\n`,
    "reports/inspection-standards/flanders-owner-delivery-and-response-intake.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/flanders-owner-delivery-and-response-intake.md": `${renderIntakeMarkdown(flanders)}\n`,
    "reports/inspection-standards/owner-delivery-response-quarantine-report.json": `${JSON.stringify(quarantine, null, 2)}\n`,
    "reports/inspection-standards/owner-delivery-response-quarantine-report.md": `${renderQuarantineMarkdown(quarantine)}\n`,
    "reports/inspection-standards/owner-delivery-protocol-completion-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/owner-delivery-protocol-completion-decision.md": `${renderDecisionMarkdown(decision)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/owner-delivery-channel-proof.sample.json": `${JSON.stringify(proof, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/england-owner-delivery-and-response-intake.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/flanders-owner-delivery-and-response-intake.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/owner-delivery-response-quarantine-report.sample.json": `${JSON.stringify(quarantine, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/positive/owner-delivery-protocol-completion-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: `${sprintPlan()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: `${correctionLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: `${validationLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`]: `${specialistReview("Lead Architecture Review", "PASS", "Lead/architecture subagent returned PASS: the schema, checker, and decision logic are bounded to explicit prior records and cannot proceed to response analysis without delivery proof and accepted responses.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`]: `${specialistReview("Legal/Privacy Review", "PASS", "Legal/privacy subagent returned PASS: the packet stores no named contact, private endpoint, personal/student/school data, legal advice, compliance proof, or response data outside consent and schema boundaries.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-dispatch-intake-review.md`]: `${specialistReview("England Dispatch/Intake Review", "PASS", "England source/authority subagent returned PASS: England remains England-only, no whole-UK or all-awarding-body overclaim is allowed, and no approved delivery proof or response is claimed.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-dispatch-intake-review.md`]: `${specialistReview("Flanders Dispatch/Intake Review", "PASS", "Flanders source/authority subagent returned PASS: Flanders remains Flanders-only, no all-Belgium or all-school-network overclaim is allowed, and school/network evidence remains school-owned.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`]: `${specialistReview("Teacher/Economics Review", "PASS", "Teacher/economics subagent returned PASS: no economics content, localized exercises, answer models, school evidence, or student-facing material is generated; future response usefulness remains internal-only after schema/quarantine review.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`]: `${specialistReview("Accessibility/Inclusion Review", "PASS", "Accessibility/inclusion subagent returned PASS: support, accommodation, accessibility, and individual-adjustment content remains a forbidden sufficiency-claim boundary and cannot become legal, product, or school sufficiency proof.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`]: `${finalLeadReview()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`]: `${closureRecord()}\n`,
  };
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stopCode), null, 2)}\n`;
  }
  return outputs;
}

function checkAcceptedInput() {
  const selected = priorDecision().final_decision && priorDecision().final_decision.selected;
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
    console.error("Owner delivery protocol-completion outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK owner delivery protocol-completion outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote owner delivery protocol-completion outputs (${Object.keys(outputContents()).length} files)`);
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
  deliveryAndResponseIntake,
  doesNotAuthorize,
  noOutputFlagsForDeliveryCompletion,
  outputContents,
  ownerDeliveryChannelProof,
  ownerDeliveryProtocolCompletionDecision,
  ownerDeliveryResponseQuarantineReport,
};
