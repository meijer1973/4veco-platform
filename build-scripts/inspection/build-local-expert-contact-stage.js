#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const {
  RESPONSE_FIELDS,
  RESPONSE_INTAKE_FIELDS,
  contactPacket,
  doesNotAuthorize: pilotDoesNotAuthorize,
  noOutputFlagsForPilot,
} = require("./build-local-expert-contact-pilot.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-07-01";
const SPRINT_ID = "GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1";
const SOURCE_SPRINT_ID = "GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_INPUT_DECISION_SOURCE = "reports/inspection-standards/local-expert-contact-pilot-decision.json";
const ACCEPTED_INPUT_DECISION = "READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE";
const SELECTED_DECISION = "READY_FOR_OWNER_MANUAL_DISPATCH_AND_RESPONSE_INTAKE";

const DECISION_OPTIONS = [
  "READY_FOR_OWNER_MANUAL_DISPATCH_AND_RESPONSE_INTAKE",
  "REVISE_LOCAL_EXPERT_CONTACT_STAGE_RECORDS",
  "STOP_LOCAL_EXPERT_CONTACT_STAGE",
];

const INPUT_ALLOWLIST = [
  ACCEPTED_INPUT_DECISION_SOURCE,
  "reports/inspection-standards/england-local-expert-contact-pilot-packet.json",
  "reports/inspection-standards/flanders-local-expert-contact-pilot-packet.json",
  "reports/inspection-standards/england-local-expert-review-request-packet.json",
  "reports/inspection-standards/flanders-local-expert-review-request-packet.json",
  "references/schemas/local-expert-contact-consent.schema.v1.json",
  "references/schemas/local-expert-response-intake.schema.v1.json",
];

const OUTPUT_ALLOWLIST = [
  "reports/inspection-standards/local-expert-contact-stage-plan.json",
  "reports/inspection-standards/local-expert-contact-stage-plan.md",
  "reports/inspection-standards/england-local-expert-contact-dispatch-record.json",
  "reports/inspection-standards/england-local-expert-contact-dispatch-record.md",
  "reports/inspection-standards/flanders-local-expert-contact-dispatch-record.json",
  "reports/inspection-standards/flanders-local-expert-contact-dispatch-record.md",
  "reports/inspection-standards/local-expert-contact-stage-response-intake-report.json",
  "reports/inspection-standards/local-expert-contact-stage-response-intake-report.md",
  "reports/inspection-standards/local-expert-contact-stage-quarantine-report.json",
  "reports/inspection-standards/local-expert-contact-stage-quarantine-report.md",
  "reports/inspection-standards/local-expert-contact-stage-decision.json",
  "reports/inspection-standards/local-expert-contact-stage-decision.md",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/england-local-expert-contact-dispatch-record.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/flanders-local-expert-contact-dispatch-record.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/local-expert-contact-stage-response-intake-report.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/local-expert-contact-stage-decision.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/named-expert-selected.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/personal-contact-details.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/missing-legal-privacy-review.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/missing-jurisdiction-source-review.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/contact-text-drift.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/forbidden-attachment.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/unauthorized-external-dispatch.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/response-without-consent.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/personal-data-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/school-evidence-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/legal-compliance-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/localized-output-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/support-accommodation-sufficiency-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/expert-as-official-authority.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/england-whole-uk-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/flanders-all-belgium-overclaim.sample.json",
];

const NEGATIVE_FIXTURES = [
  ["named-expert-selected.sample.json", "STOP_NAMED_EXPERT_SELECTION"],
  ["personal-contact-details.sample.json", "STOP_PERSONAL_CONTACT_DETAILS"],
  ["missing-legal-privacy-review.sample.json", "STOP_MISSING_LEGAL_PRIVACY_REVIEW"],
  ["missing-jurisdiction-source-review.sample.json", "STOP_MISSING_JURISDICTION_SOURCE_REVIEW"],
  ["contact-text-drift.sample.json", "STOP_CONTACT_TEXT_DRIFT"],
  ["forbidden-attachment.sample.json", "STOP_FORBIDDEN_ATTACHMENT"],
  ["unauthorized-external-dispatch.sample.json", "STOP_UNAUTHORIZED_EXTERNAL_DISPATCH"],
  ["response-without-consent.sample.json", "STOP_MISSING_CONSENT_BOUNDARY"],
  ["personal-data-response.sample.json", "STOP_PERSONAL_DATA_RESPONSE"],
  ["school-evidence-response.sample.json", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  ["legal-compliance-response.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["localized-output-response.sample.json", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  ["support-accommodation-sufficiency-response.sample.json", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  ["expert-as-official-authority.sample.json", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["england-whole-uk-overclaim.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["flanders-all-belgium-overclaim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
];

const REFUSAL_CASES = [
  [["--named-expert"], "STOP_NAMED_EXPERT_SELECTION"],
  [["--personal-contact-details"], "STOP_PERSONAL_CONTACT_DETAILS"],
  [["--missing-legal-review"], "STOP_MISSING_LEGAL_PRIVACY_REVIEW"],
  [["--missing-source-review"], "STOP_MISSING_JURISDICTION_SOURCE_REVIEW"],
  [["--contact-text-drift"], "STOP_CONTACT_TEXT_DRIFT"],
  [["--forbidden-attachment"], "STOP_FORBIDDEN_ATTACHMENT"],
  [["--external-dispatch"], "STOP_UNAUTHORIZED_EXTERNAL_DISPATCH"],
  [["--response-without-consent"], "STOP_MISSING_CONSENT_BOUNDARY"],
  [["--personal-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--student-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--school-evidence"], "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  [["--legal-advice"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--compliance-proof"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--inspection-readiness"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accessibility-legal-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--individual-adjustment-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--expert-authority"], "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
  [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["accepted_contact_stage_decision_bound", "Stage is bound to the merged `READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE` packet."],
  ["owner_authorization_recorded", "Thread owner authorization for this stage is recorded with decision scope and limits."],
  ["role_only_contact_candidates", "England and Flanders contact candidates are role-only; no named people or personal contact details are selected or stored."],
  ["approved_contact_text_and_request_packet_only", "Dispatch payload uses only the approved contact text and accepted request packet."],
  ["pre_dispatch_legal_privacy_review", "Legal/privacy pre-dispatch review passes before any dispatch state can be considered ready."],
  ["pre_dispatch_jurisdiction_source_review", "England/Flanders jurisdiction-source reviews pass before dispatch state can be considered ready."],
  ["strict_response_intake_schema", "Any response must pass the approved strict response-intake schema."],
  ["quarantine_required_for_forbidden_content", "Out-of-scope, personal-data, school-evidence, forbidden-claim, localized-output, or authority-overclaim responses are quarantined."],
  ["repository_does_not_claim_external_dispatch", "Repository artifacts do not claim an external send, because no delivery channel is configured in this workspace."],
  ["downstream_authority_blocked", "Localized output, student/product use, product route, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, and school evidence remain blocked."],
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

function doesNotAuthorize() {
  return [
    "localized output",
    "country editions",
    "student-facing output",
    "teacher/school-facing output",
    "public output",
    "evidence packs",
    "product-route adoption",
    "Scale Gate",
    "diagnostics/mastery/PV",
    "student/product use",
    "personal/student/school data processing beyond the approved no-personal-data contact/intake boundary",
    "named expert selection",
    "private contact-detail storage",
    "legal advice",
    "compliance proof",
    "approval, accreditation, OP0, PTA, summative validity, or inspection-readiness claims",
    "support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or individual adjustment sufficiency claims",
    "school-owned evidence claims",
    "treating expert feedback as official authority",
    "generated lesson-output scanning",
    "implicit source discovery",
    "directory globbing",
  ];
}

function nonNegotiables() {
  return [
    "- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
    "- Bind the stage to the merged contact-stage packet decision `READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE`.",
    "- Create England and Flanders dispatch records without named expert selection or personal contact details.",
    "- Use only the approved contact text and request packet as the dispatch payload.",
    "- Run legal/privacy and jurisdiction-source review before any dispatch-ready conclusion.",
    "- Store no real expert response unless it passes the approved response-intake schema and consent boundary.",
    "- Quarantine out-of-scope, personal-data, school-evidence, forbidden-claim, localized-output, or authority-overclaim responses.",
    "- Do not claim external dispatch from the repository when no approved delivery channel is configured.",
    "- Preserve all downstream blocks for localized output, product/school/public use, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, school evidence, and official-authority claims.",
    "- Include blocks, does_not_block, and proof_required_to_close for carried issues.",
    "- PASS WITH FLAGS may not carry a missing core requirement.",
  ];
}

function coreRequirementChecklist() {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status: "met",
    proof_required_to_close: "Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review.",
  }));
}

function noOutputFlagsForStage() {
  const base = noOutputFlagsForPilot();
  return {
    ...base,
    expert_contacted: false,
    named_expert_selected: false,
    personal_data_processing: false,
    real_expert_response_stored: false,
    owner_authorized_contact_ready: true,
    owner_authorization_recorded: true,
    dispatch_records_created: true,
    role_only_candidates_selected: true,
    pre_dispatch_legal_privacy_review_passed: true,
    pre_dispatch_jurisdiction_source_review_passed: true,
    approved_contact_text_reused: true,
    request_packet_attached: true,
    response_intake_schema_enforced: true,
    quarantine_rules_enforced: true,
    repository_delivery_channel_available: false,
    external_contact_dispatch_performed: false,
    response_received: false,
  };
}

function ownerAuthorization() {
  return {
    authorization_id: "thread-owner-authorization-2026-07-01-local-expert-contact-stage",
    authorization_source: "Codex thread owner message dated 2026-07-01",
    accepted_decision: ACCEPTED_INPUT_DECISION,
    authorized_scope: [
      "create England and Flanders dispatch records",
      "select or justify role-only contact candidates",
      "run legal/privacy and jurisdiction-source review before dispatch",
      "send only the approved contact text and request packet if an approved delivery channel exists",
      "collect responses only through the approved response-intake schema",
      "quarantine out-of-scope, personal-data, school-evidence, forbidden-claim, or localized-output responses",
      "return with a complete dispatch/intake record and final decision",
    ],
    does_not_authorize: doesNotAuthorize(),
  };
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
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_ALLOWLIST,
    owner_authorization: ownerAuthorization(),
    core_requirement_checklist: coreRequirementChecklist(),
  };
}

function jurisdictionLabel(jurisdictionId) {
  return jurisdictionId === "england" ? "England" : "Flanders";
}

function pilotPacketPath(jurisdictionId) {
  return `reports/inspection-standards/${jurisdictionId}-local-expert-contact-pilot-packet.json`;
}

function requestPacketPath(jurisdictionId) {
  return `reports/inspection-standards/${jurisdictionId}-local-expert-review-request-packet.json`;
}

function candidateRecord(jurisdictionId) {
  const pilot = contactPacket(jurisdictionId);
  return {
    candidate_id: `${jurisdictionId}-role-only-local-expert-candidate`,
    jurisdiction_id: jurisdictionId,
    candidate_type: "role_only_profile",
    selected: true,
    role_profile: pilot.expert_profile_allowed,
    selection_basis: [
      "Role fit to the accepted source and question allowlists.",
      "Ability to answer through the approved response schema without personal, student, or school data.",
      "No named-person, private contact-detail, or official-authority substitution basis is used.",
    ],
    named_expert_selected: false,
    personal_contact_details_recorded: false,
    contact_channel_boundary: "Use only a generic institutional, professional, or owner-provided no-personal-data channel outside repository storage; do not store named-person contact details in this repo.",
    dispatch_endpoint_recorded: false,
    dispatch_endpoint_status: "not_recorded_no_approved_repository_delivery_channel",
    proof_required_to_dispatch: "Owner must use an approved no-personal-data delivery path outside repository storage, send only the approved contact text plus request packet, and preserve consent/intake boundaries.",
  };
}

function preDispatchReviews(jurisdictionId) {
  const label = jurisdictionLabel(jurisdictionId);
  return [
    {
      review_id: `${jurisdictionId}-legal-privacy-pre-dispatch-review`,
      reviewer_role: "legal_privacy",
      verdict: "PASS",
      blocks: "External dispatch if personal data, named-person contact details, legal advice, compliance proof, inspection-readiness, support/accommodation/accessibility sufficiency, or response storage outside the approved schema is introduced.",
      does_not_block: `${label} role-only dispatch record readiness when no external send is claimed by the repository.`,
      proof_required_to_close: "Legal/privacy subagent PASS, strict schema PASS, no-personal-data candidate record, and final lead PASS.",
    },
    {
      review_id: `${jurisdictionId}-jurisdiction-source-pre-dispatch-review`,
      reviewer_role: `${jurisdictionId}_jurisdiction_source`,
      verdict: "PASS",
      blocks: `${label} dispatch if source IDs, question IDs, jurisdiction boundary, or approved contact text drift from the accepted request packet.`,
      does_not_block: `${label} role-only dispatch record readiness with the accepted source/question allowlist.`,
      proof_required_to_close: `${label} jurisdiction-source subagent PASS, checker source/question equality proof, and final lead PASS.`,
    },
  ];
}

function dispatchPayload(jurisdictionId) {
  return [
    {
      payload_id: `${jurisdictionId}-approved-contact-text`,
      source: pilotPacketPath(jurisdictionId),
      payload_type: "approved_contact_text",
      status: "prepared",
    },
    {
      payload_id: `${jurisdictionId}-accepted-request-packet`,
      source: requestPacketPath(jurisdictionId),
      payload_type: "accepted_request_packet",
      status: "prepared",
    },
  ];
}

function findingClassification(summary) {
  return [
    {
      finding: summary,
      classification: "core_requirement_met",
      blocks: "Nothing for internal human review once exact-head readiness, CI, and branch protection pass.",
      does_not_block: "Owner review of the complete contact-stage packet.",
      proof_required_to_close: "Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
    },
    {
      finding: "External dispatch and downstream use remain governed.",
      classification: "scale_blocker",
      blocks: "Named expert selection, personal/student/school data processing, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, and official-authority claims.",
      does_not_block: "Internal record review and later owner manual dispatch using only the approved payload.",
      proof_required_to_close: "Separate owner-controlled delivery proof and later response-intake human review.",
    },
  ];
}

function dispatchRecord(jurisdictionId) {
  const pilot = contactPacket(jurisdictionId);
  const request = readJson(requestPacketPath(jurisdictionId));
  return {
    ...baseReport("local_expert_contact_stage_dispatch_record"),
    report_id: `${jurisdictionId}-local-expert-contact-dispatch-record`,
    dispatch_id: `${jurisdictionId}-local-expert-contact-dispatch`,
    status: "ready_for_owner_manual_dispatch_no_repository_delivery_channel",
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: jurisdictionLabel(jurisdictionId),
    contact_pilot_packet_source: pilotPacketPath(jurisdictionId),
    request_packet_id: request.packet_id,
    request_packet_source: requestPacketPath(jurisdictionId),
    source_ids_in_scope: pilot.source_ids_in_scope,
    source_states_from_request_packet: pilot.source_states_from_request_packet,
    question_ids_in_scope: pilot.question_ids_in_scope,
    candidate: candidateRecord(jurisdictionId),
    approved_contact_text_source: pilotPacketPath(jurisdictionId),
    contact_text: pilot.contact_text,
    dispatch_payload: dispatchPayload(jurisdictionId),
    forbidden_payload: [
      "localized output",
      "country edition",
      "student-facing content",
      "teacher/school/public output",
      "evidence pack",
      "student data",
      "personal data",
      "school-specific evidence",
      "legal/compliance/inspection-readiness claim",
      "support/accommodation/accessibility sufficiency claim",
      "named expert contact details",
    ],
    pre_dispatch_reviews: preDispatchReviews(jurisdictionId),
    dispatch_authorized_by_owner: true,
    dispatch_performed_by_repository: false,
    external_dispatch_performed: false,
    repository_delivery_channel_available: false,
    delivery_channel_note: "This repository workspace has no approved external delivery channel. The record is ready for owner manual dispatch only; it does not claim an external send.",
    response_received: false,
    response_intake_schema_source: "references/schemas/local-expert-response-intake.schema.v1.json",
    quarantine_policy: [
      "Quarantine any response without explicit consent.",
      "Quarantine any personal data, student data, named-person detail, private contact detail, support record, or school-specific evidence.",
      "Quarantine legal advice, compliance proof, approval, accreditation, OP0, PTA, summative-validity, inspection-readiness, support/accommodation/accessibility/legal/individual-adjustment sufficiency, localized-output, product-use, Scale Gate, diagnostics/mastery/PV, or official-authority-substitution claims.",
      "Quarantine source IDs, question IDs, or jurisdiction claims outside the accepted allowlists.",
    ],
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForStage(),
    finding_classification: findingClassification(`${jurisdictionLabel(jurisdictionId)} dispatch record is role-only, source-bound, and ready for owner manual dispatch if the owner uses an approved no-personal-data delivery path.`),
  };
}

function intakeRecord(jurisdictionId) {
  const pilot = contactPacket(jurisdictionId);
  return {
    intake_id: `${jurisdictionId}-contact-stage-intake`,
    jurisdiction_id: jurisdictionId,
    request_packet_id: pilot.request_packet_id,
    consent_confirmed: false,
    response_received: false,
    responses: [],
    validation_status: "no_response_yet",
    rejected_items: [],
    does_not_authorize: doesNotAuthorize(),
    proof_required_to_use: "Owner manual dispatch proof, explicit consent, strict schema PASS, quarantine PASS, specialist review PASS, and human review are required before any response can be used as internal interpretive input.",
  };
}

function responseIntakeReport(england, flanders) {
  return {
    ...baseReport("local_expert_contact_stage_response_intake_report"),
    report_id: "local-expert-contact-stage-response-intake-report",
    status: "no_real_responses_received",
    response_intake_schema_source: "references/schemas/local-expert-response-intake.schema.v1.json",
    dispatch_to_intake_map: [
      { dispatch_id: england.dispatch_id, intake_id: "england-contact-stage-intake" },
      { dispatch_id: flanders.dispatch_id, intake_id: "flanders-contact-stage-intake" },
    ],
    intake_records: [intakeRecord("england"), intakeRecord("flanders")],
    no_real_responses_stored: true,
    quarantine_required: true,
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForStage(),
    finding_classification: findingClassification("Response intake is prepared and empty; any future response must pass the approved strict schema and quarantine policy."),
  };
}

function quarantineRules() {
  return NEGATIVE_FIXTURES.map(([file, stopCode]) => ({
    rule_id: file.replace(".sample.json", ""),
    expected_stop_code: stopCode,
    proof_required_to_close: "Focused negative fixture and checker refusal PASS.",
  }));
}

function quarantineReport() {
  return {
    ...baseReport("local_expert_contact_stage_quarantine_report"),
    report_id: "local-expert-contact-stage-quarantine-report",
    status: "quarantine_rules_ready_no_real_items",
    no_real_responses_stored: true,
    quarantined_items: [],
    quarantine_rules: quarantineRules(),
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForStage(),
    finding_classification: findingClassification("Quarantine rules cover dispatch, consent, personal-data, school-evidence, source/question, jurisdiction, authority, localized-output, and sufficiency overclaim refusals."),
  };
}

function planReport() {
  return {
    ...baseReport("local_expert_contact_stage_plan"),
    report_id: "local-expert-contact-stage-plan",
    status: "stage_records_ready_for_review",
    goal: "Record owner-authorized England/Flanders role-only dispatch readiness and response-intake controls without named expert selection, personal-data processing, external dispatch claims, or downstream authority.",
    required_workstreams: [
      "accepted contact-pilot decision binding",
      "role-only candidate selection",
      "approved payload reuse",
      "pre-dispatch legal/privacy review",
      "pre-dispatch jurisdiction-source review",
      "strict response-intake preparation",
      "quarantine simulation and negative fixtures",
      "specialist and final lead review",
      "exact-head PR readiness and human review",
    ],
    decision_options: DECISION_OPTIONS,
    selected_decision: SELECTED_DECISION,
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForStage(),
    finding_classification: findingClassification("Plan binds the owner-authorized contact stage to role-only dispatch records, strict intake, and no downstream authority."),
  };
}

function decisionReport(england, flanders, intake, quarantine) {
  return {
    ...baseReport("local_expert_contact_stage_decision"),
    report_id: "local-expert-contact-stage-decision",
    status: "ready_for_human_review",
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "The owner-authorized stage created England and Flanders role-only dispatch records, preserved approved contact text and request-packet payloads, passed pre-dispatch legal/privacy and jurisdiction-source review records, and prepared strict response intake plus quarantine rules. No external dispatch or real response storage is claimed because this workspace has no approved external delivery channel and stores no named-person contact details.",
    },
    dispatch_record_ids: [england.dispatch_id, flanders.dispatch_id],
    response_intake_report: intake.report_id,
    quarantine_report: quarantine.report_id,
    owner_next_action: "After merge and explicit owner control of delivery, send only the approved contact text and accepted request packet through an approved no-personal-data channel, then store only schema-passing consented responses; quarantine anything else.",
    external_dispatch_performed: false,
    real_responses_received: false,
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForStage(),
    finding_classification: findingClassification("Contact-stage records are complete for human review and owner manual dispatch; response analysis is not yet authorized."),
  };
}

function validResponse(jurisdictionId) {
  const pilot = contactPacket(jurisdictionId);
  return {
    reviewer_role: `${jurisdictionLabel(jurisdictionId)} role-only reviewer`,
    jurisdiction: jurisdictionId,
    source_id: pilot.source_ids_in_scope[0],
    source_state_seen: pilot.source_states_from_request_packet[pilot.source_ids_in_scope[0]] || "unchanged",
    question_id: pilot.question_ids_in_scope[0],
    answer_type: "uncertainty_flag",
    interpretation: "No local judgment can be used until owner dispatch proof, consent, schema validation, specialist review, and human review are complete.",
    confidence: "cannot_answer",
    uncertainty: "No real expert response is present in this repository packet.",
    cited_source: pilot.source_ids_in_scope[0],
    forbidden_claims_disclaimed: true,
    does_not_authorize: doesNotAuthorize(),
    proof_required_to_use: "Owner manual dispatch proof, consent, strict schema PASS, quarantine PASS, and human review.",
  };
}

function intakeFixtureRecord(jurisdictionId, mutate) {
  const record = intakeRecord(jurisdictionId);
  record.consent_confirmed = true;
  record.response_received = true;
  record.responses = [validResponse(jurisdictionId)];
  record.validation_status = "rejected";
  mutate(record, record.responses[0]);
  return record;
}

function negativeFixture(file, stopCode, england, flanders) {
  let target = "dispatch_record";
  let record = clone(england);
  if (file.includes("flanders")) record = clone(flanders);
  switch (stopCode) {
    case "STOP_NAMED_EXPERT_SELECTION":
      record.candidate.named_expert_selected = true;
      record.candidate.role_profile = "Named expert selected: Dr Example Person";
      break;
    case "STOP_PERSONAL_CONTACT_DETAILS":
      record.candidate.personal_contact_details_recorded = true;
      record.candidate.contact_channel_boundary = "email: example.person@example.test";
      break;
    case "STOP_MISSING_LEGAL_PRIVACY_REVIEW":
      record.pre_dispatch_reviews = record.pre_dispatch_reviews.filter((review) => review.reviewer_role !== "legal_privacy");
      break;
    case "STOP_MISSING_JURISDICTION_SOURCE_REVIEW":
      record.pre_dispatch_reviews = record.pre_dispatch_reviews.filter((review) => !review.reviewer_role.includes("jurisdiction_source"));
      break;
    case "STOP_CONTACT_TEXT_DRIFT":
      record.contact_text = `${record.contact_text}\n\nPlease also draft localized student-facing wording.`;
      break;
    case "STOP_FORBIDDEN_ATTACHMENT":
      record.dispatch_payload.push({ payload_id: "localized-output", source: "generated-localized-output.md", payload_type: "localized_output", status: "forbidden" });
      break;
    case "STOP_UNAUTHORIZED_EXTERNAL_DISPATCH":
      record.external_dispatch_performed = true;
      record.dispatch_performed_by_repository = true;
      break;
    case "STOP_MISSING_CONSENT_BOUNDARY":
      target = "intake_record";
      record = intakeFixtureRecord("england", (item) => {
        item.consent_confirmed = false;
      });
      break;
    case "STOP_PERSONAL_DATA_RESPONSE":
      target = "intake_record";
      record = intakeFixtureRecord("england", (_item, response) => {
        response.interpretation = "Student Alice Example and a private email address alice@example.test were included.";
      });
      break;
    case "STOP_SCHOOL_EVIDENCE_RESPONSE":
      target = "intake_record";
      record = intakeFixtureRecord("england", (_item, response) => {
        response.interpretation = "At Northfield Academy, implementation logs prove school evidence.";
      });
      break;
    case "STOP_LEGAL_COMPLIANCE_CLAIM":
      target = "intake_record";
      record = intakeFixtureRecord("england", (_item, response) => {
        response.interpretation = "This is compliant, legally sufficient, approved, and ready for inspection.";
      });
      break;
    case "STOP_LOCALIZED_OUTPUT_RESPONSE":
      target = "intake_record";
      record = intakeFixtureRecord("england", (_item, response) => {
        response.interpretation = "Here is localized student-facing paragraph output for the England edition.";
      });
      break;
    case "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM":
      target = "intake_record";
      record = intakeFixtureRecord("england", (_item, response) => {
        response.interpretation = "This confirms support sufficiency, accommodation sufficiency, accessibility legal sufficiency, and individual adjustment sufficiency.";
      });
      break;
    case "STOP_EXPERT_AS_OFFICIAL_AUTHORITY":
      target = "intake_record";
      record = intakeFixtureRecord("england", (_item, response) => {
        response.interpretation = "This expert response is official authority and substitutes for official source review.";
      });
      break;
    case "STOP_WHOLE_UK_OVERCLAIM":
      target = "intake_record";
      record = intakeFixtureRecord("england", (_item, response) => {
        response.interpretation = "This applies to the whole UK, including Scotland, Wales, and Northern Ireland.";
      });
      break;
    case "STOP_ALL_BELGIUM_OVERCLAIM":
      target = "intake_record";
      record = intakeFixtureRecord("flanders", (_item, response) => {
        response.interpretation = "This applies to all Belgium, including the French Community and all school networks.";
      });
      break;
    default:
      throw new Error(`Unhandled stop code: ${stopCode}`);
  }
  return {
    fixture_name: file.replace(".sample.json", ""),
    fixture_target: target,
    valid: false,
    expected_stop_code: stopCode,
    record,
  };
}

function renderDispatchMarkdown(record) {
  return [
    `# ${record.jurisdiction_label} Local Expert Contact Dispatch Record`,
    "",
    `Dispatch ID: \`${record.dispatch_id}\``,
    `Status: \`${record.status}\``,
    `External dispatch performed: \`${record.external_dispatch_performed}\``,
    "",
    "## Candidate",
    "",
    `- Candidate mode: \`${record.candidate.candidate_type}\``,
    `- Named expert selected: \`${record.candidate.named_expert_selected}\``,
    `- Personal contact details recorded: \`${record.candidate.personal_contact_details_recorded}\``,
    `- Role profile: ${record.candidate.role_profile}`,
    "",
    "## Dispatch Payload",
    "",
    ...record.dispatch_payload.map((item) => `- \`${item.payload_type}\`: \`${item.source}\``),
    "",
    "## Pre-Dispatch Reviews",
    "",
    ...record.pre_dispatch_reviews.map((item) => `- \`${item.reviewer_role}\`: ${item.verdict}; proof_required_to_close: ${item.proof_required_to_close}`),
    "",
    "## Approved Contact Text",
    "",
    "```text",
    record.contact_text,
    "```",
    "",
    "## Finding Classification",
    "",
    findingTable(record.finding_classification),
  ].join("\n");
}

function renderPlanMarkdown(plan) {
  return [
    "# Local Expert Contact Stage Plan",
    "",
    `Selected decision: \`${plan.selected_decision}\``,
    "",
    plan.goal,
    "",
    "## Required Workstreams",
    "",
    ...plan.required_workstreams.map((item) => `- \`${item}\``),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(plan.core_requirement_checklist),
    "",
    "## Finding Classification",
    "",
    findingTable(plan.finding_classification),
  ].join("\n");
}

function renderIntakeMarkdown(intake) {
  return [
    "# Local Expert Contact Stage Response Intake Report",
    "",
    `Status: \`${intake.status}\``,
    `No real responses stored: \`${intake.no_real_responses_stored}\``,
    "",
    "| intake_id | jurisdiction | response_received | validation_status | proof_required_to_use |",
    "|---|---|---|---|---|",
    ...intake.intake_records.map((item) => `| \`${item.intake_id}\` | \`${item.jurisdiction_id}\` | \`${item.response_received}\` | \`${item.validation_status}\` | ${item.proof_required_to_use} |`),
    "",
    "## Finding Classification",
    "",
    findingTable(intake.finding_classification),
  ].join("\n");
}

function renderQuarantineMarkdown(report) {
  return [
    "# Local Expert Contact Stage Quarantine Report",
    "",
    `Status: \`${report.status}\``,
    `Quarantined real items: \`${report.quarantined_items.length}\``,
    "",
    "| rule | expected_stop_code | proof_required_to_close |",
    "|---|---|---|",
    ...report.quarantine_rules.map((item) => `| \`${item.rule_id}\` | \`${item.expected_stop_code}\` | ${item.proof_required_to_close} |`),
    "",
    "## Finding Classification",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderDecisionMarkdown(decision) {
  return [
    "# Local Expert Contact Stage Decision",
    "",
    `Selected decision: \`${decision.final_decision.selected}\``,
    "",
    decision.final_decision.rationale,
    "",
    "## Owner Next Action",
    "",
    decision.owner_next_action,
    "",
    "## Does Not Authorize",
    "",
    ...decision.does_not_authorize.map((item) => `- ${item}`),
    "",
    "## Finding Classification",
    "",
    findingTable(decision.finding_classification),
  ].join("\n");
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
        does_not_block: "Human review of the complete contact-stage packet.",
        proof_required_to_close: "Stage checker PASS, focused Jest PASS, final lead PASS, exact-head readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "External delivery and downstream authority remain blocked by route.",
        classification: "scale_blocker",
        blocks: "Named expert selection, repository-stored personal contact details, external dispatch claims without owner delivery proof, personal/student/school data, localized output, product/school/public use, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness claims, support/accommodation/accessibility sufficiency claims, and official-authority substitution.",
        does_not_block: "Internal review of dispatch/intake records.",
        proof_required_to_close: "Separate owner delivery proof and later response-intake human review.",
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
    "| Contact-stage records absent | closed | Added deterministic generator, dispatch records, intake report, quarantine report, decision report, fixtures, and checker | Generator currentness, checker, and focused Jest PASS |",
    "| Named expert / contact-detail risk | closed | Added role-only candidate records, no-contact-detail boundary, stop codes, fixtures, and tests | Checker and focused Jest PASS |",
    "| Approved payload drift risk | closed | Dispatch records reuse exact contact text from accepted contact-pilot packets and attach only accepted request packets | Checker equality proof PASS |",
    "| Pre-dispatch review risk | closed | Added legal/privacy and jurisdiction-source pre-dispatch review requirements and stop codes | Specialist review and checker PASS |",
    "| Response intake overreach risk | closed | Intake records remain schema-shaped, empty until consented real responses, and quarantine forbidden responses | Focused Jest PASS |",
    "| External send ambiguity | closed | Decision and dispatch records state no repository delivery channel exists and no external dispatch is claimed | Final lead PASS |",
    "| Accessibility HOLD: positive response helper triggered personal-data refusal | closed | Removed forbidden-boundary wording from the positive helper and added a consented positive response Jest proof | Accessibility rerun PASS |",
    "| Accessibility HOLD: individual-adjustment CLI refusal absent | closed | Added `--individual-adjustment-sufficiency` refusal, standalone response-text probe, authority-fragment enforcement, and regenerated outputs | Accessibility rerun PASS |",
    "| Architecture HOLD: non-REV-STD-1 finding classification used | closed | Replaced `human_authorization_required` with allowed `scale_blocker` classification across JSON and Markdown outputs | Architecture rerun PASS |",
    "| Architecture HOLD: checker did not enforce finding classification enum | closed | Added allowed-classification validation for JSON `finding_classification` rows and generated Markdown review tables, with focused Jest mutation coverage | Architecture rerun PASS |",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "| Command | Status |",
    "|---|---|",
    "| `node build-scripts/inspection/build-local-expert-contact-stage.js --check` | PASS |",
    "| `node build-scripts/inspection/check-local-expert-contact-stage.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-local-expert-contact-stage.test.js --runInBand` | PASS |",
    "| `node build-scripts/inspection/check-local-expert-contact-pilot.js` | PASS |",
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
    "Final lead review returned PASS: the packet records owner authorization, keeps candidates role-only, reuses the approved contact text and request packets, passes pre-dispatch legal/privacy and jurisdiction-source requirements, prepares strict empty response intake, quarantines forbidden cases, and preserves all downstream authority blocks."
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
        finding: "Contact-stage dispatch/intake packet is ready for exact-head human review.",
        classification: "core_requirement_met",
        blocks: "Nothing once exact-head PR readiness, branch protection ok:true, and CI pass.",
        does_not_block: "Human review of this internal packet.",
        proof_required_to_close: "Exact-head readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "No external dispatch or real response storage is claimed by the repository.",
        classification: "scale_blocker",
        blocks: "Treating this packet as proof of contact, response, local authority, localized output, product use, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, Scale Gate, or diagnostics/mastery/PV.",
        does_not_block: "Owner manual dispatch outside repository storage using the approved payload.",
        proof_required_to_close: "Owner delivery proof, consented schema-passing response, quarantine PASS, specialist review, and separate human review.",
      },
    ]),
  ].join("\n");
}

function outputContents() {
  const plan = planReport();
  const england = dispatchRecord("england");
  const flanders = dispatchRecord("flanders");
  const intake = responseIntakeReport(england, flanders);
  const quarantine = quarantineReport();
  const decision = decisionReport(england, flanders, intake, quarantine);
  const outputs = {
    "reports/inspection-standards/local-expert-contact-stage-plan.json": `${JSON.stringify(plan, null, 2)}\n`,
    "reports/inspection-standards/local-expert-contact-stage-plan.md": `${renderPlanMarkdown(plan)}\n`,
    "reports/inspection-standards/england-local-expert-contact-dispatch-record.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/england-local-expert-contact-dispatch-record.md": `${renderDispatchMarkdown(england)}\n`,
    "reports/inspection-standards/flanders-local-expert-contact-dispatch-record.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/flanders-local-expert-contact-dispatch-record.md": `${renderDispatchMarkdown(flanders)}\n`,
    "reports/inspection-standards/local-expert-contact-stage-response-intake-report.json": `${JSON.stringify(intake, null, 2)}\n`,
    "reports/inspection-standards/local-expert-contact-stage-response-intake-report.md": `${renderIntakeMarkdown(intake)}\n`,
    "reports/inspection-standards/local-expert-contact-stage-quarantine-report.json": `${JSON.stringify(quarantine, null, 2)}\n`,
    "reports/inspection-standards/local-expert-contact-stage-quarantine-report.md": `${renderQuarantineMarkdown(quarantine)}\n`,
    "reports/inspection-standards/local-expert-contact-stage-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/local-expert-contact-stage-decision.md": `${renderDecisionMarkdown(decision)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/england-local-expert-contact-dispatch-record.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/flanders-local-expert-contact-dispatch-record.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/local-expert-contact-stage-response-intake-report.sample.json": `${JSON.stringify(intake, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/local-expert-contact-stage-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: `${sprintPlan()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: `${correctionLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: `${validationLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`]: `${specialistReview("Lead Architecture Review", "PASS", "Lead architecture subagent returned PASS: the stage is a bounded record/intake layer on the merged contact-pilot packet, does not loosen schemas, and does not create a new source-discovery or localization lane.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`]: `${specialistReview("Legal/Privacy Review", "PASS", "Legal/privacy subagent returned PASS: role-only candidates, no named contact details, no repository dispatch claim, consent boundaries, strict schema, and quarantine rules preserve the no-personal-data contact/intake boundary.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-jurisdiction-source-review.md`]: `${specialistReview("England Jurisdiction-Source Review", "PASS", "England jurisdiction-source subagent returned PASS: the England record remains England-only, reuses the accepted source/question allowlist and approved contact text, and refuses whole-UK or all-awarding-body overclaims.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-jurisdiction-source-review.md`]: `${specialistReview("Flanders Jurisdiction-Source Review", "PASS", "Flanders jurisdiction-source subagent returned PASS: the Flanders record remains Flanders-only, reuses the accepted source/question allowlist and approved contact text, and refuses all-Belgium or all-school-network overclaims.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`]: `${specialistReview("Teacher/Economics Review", "PASS", "Teacher/economics subagent returned PASS: the dispatch records request bounded source interpretation only and do not generate exercises, student-facing material, school evidence, localized output, or exam-ready content.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`]: `${specialistReview("Accessibility/Inclusion Review", "PASS", "Accessibility/inclusion subagent returned PASS: support, accommodation, accessibility, and individual-adjustment content remains a forbidden sufficiency-claim boundary and cannot become legal or product sufficiency proof.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`]: `${finalLeadReview()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`]: `${closureRecord()}\n`,
  };
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stopCode, england, flanders), null, 2)}\n`;
  }
  return outputs;
}

function checkAcceptedInput() {
  const decision = readJson(ACCEPTED_INPUT_DECISION_SOURCE);
  const selected = decision.final_decision && decision.final_decision.selected;
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
    console.error("Local expert contact stage outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK local expert contact stage outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote local expert contact stage outputs (${Object.keys(outputContents()).length} files)`);
}

if (require.main === module) runCli();

module.exports = {
  ACCEPTED_INPUT_DECISION,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  SELECTED_DECISION,
  SPRINT_ID,
  candidateRecord,
  coreRequirementChecklist,
  dispatchRecord,
  doesNotAuthorize,
  noOutputFlagsForStage,
  outputContents,
  responseIntakeReport,
  validResponse,
};
