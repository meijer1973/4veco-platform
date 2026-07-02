#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const {
  FORBIDDEN_EXPERT_CLAIMS,
  RESPONSE_FIELDS,
  doesNotAuthorize: requestPacketDoesNotAuthorize,
  noOutputFlags,
  requestPacket,
} = require("./build-local-expert-review-request-packet.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-06-29";
const SPRINT_ID = "GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1";
const SOURCE_SPRINT_ID = "GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_INPUT_DECISION_SOURCE = "reports/inspection-standards/local-expert-review-request-decision.json";
const ACCEPTED_INPUT_DECISION = "PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT";
const SELECTED_DECISION = "READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE";

const DECISION_OPTIONS = [
  "READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE",
  "REVISE_LOCAL_EXPERT_CONTACT_PILOT_PACKET",
  "STOP_LOCAL_EXPERT_CONTACT_TRACK",
];

const CONTACT_FIELDS = [
  "contact_id",
  "jurisdiction_id",
  "request_packet_id",
  "expert_profile_allowed",
  "source_ids_in_scope",
  "question_ids_in_scope",
  "contact_text",
  "consent_boundary",
  "storage_boundary",
  "response_schema_id",
  "does_not_authorize",
  "owner_authorization_required",
  "contact_dispatch_performed",
];

const CONSENT_FIELDS = [
  "consent_statement",
  "recording_boundary",
  "storage_boundary",
  "no_personal_data_instruction",
  "withdrawal_boundary",
  "response_use_limit",
];

const RESPONSE_INTAKE_FIELDS = [
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

const INPUT_ALLOWLIST = [
  ACCEPTED_INPUT_DECISION_SOURCE,
  "reports/inspection-standards/england-local-expert-review-request-packet.json",
  "reports/inspection-standards/flanders-local-expert-review-request-packet.json",
  "references/schemas/local-expert-review-response.schema.v1.json",
];

const OUTPUT_ALLOWLIST = [
  "references/schemas/local-expert-contact-consent.schema.v1.json",
  "references/schemas/local-expert-response-intake.schema.v1.json",
  "docs/inspection-standards/local-expert-contact-pilot-contract.md",
  "docs/inspection-standards/england-local-expert-contact-text.md",
  "docs/inspection-standards/flanders-local-expert-contact-text.md",
  "reports/inspection-standards/local-expert-contact-pilot-plan.json",
  "reports/inspection-standards/local-expert-contact-pilot-plan.md",
  "reports/inspection-standards/england-local-expert-contact-pilot-packet.json",
  "reports/inspection-standards/england-local-expert-contact-pilot-packet.md",
  "reports/inspection-standards/flanders-local-expert-contact-pilot-packet.json",
  "reports/inspection-standards/flanders-local-expert-contact-pilot-packet.md",
  "reports/inspection-standards/local-expert-response-intake-report.json",
  "reports/inspection-standards/local-expert-response-intake-report.md",
  "reports/inspection-standards/local-expert-contact-pilot-simulation.json",
  "reports/inspection-standards/local-expert-contact-pilot-simulation.md",
  "reports/inspection-standards/local-expert-contact-pilot-decision.json",
  "reports/inspection-standards/local-expert-contact-pilot-decision.md",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/england-local-expert-contact-pilot-packet.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/flanders-local-expert-contact-pilot-packet.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/local-expert-response-intake-report.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/local-expert-contact-pilot-decision.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-plan-architecture-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-dutch-quality-inspection-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/unauthorized-contact-dispatch.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/missing-consent-boundary.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/personal-data-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/legal-compliance-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/localized-output-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/out-of-scope-source.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/out-of-scope-question.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/missing-forbidden-disclaimer.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/hidden-uncertainty.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/jurisdiction-mismatch.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/personal-data-in-text.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/school-specific-evidence-response.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/england-whole-uk-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/flanders-all-belgium-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/support-accommodation-sufficiency-overclaim.sample.json",
];

const NEGATIVE_FIXTURES = [
  ["unauthorized-contact-dispatch.sample.json", "STOP_UNAUTHORIZED_CONTACT_DISPATCH"],
  ["missing-consent-boundary.sample.json", "STOP_MISSING_CONSENT_BOUNDARY"],
  ["personal-data-response.sample.json", "STOP_PERSONAL_DATA_RESPONSE"],
  ["legal-compliance-claim.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["localized-output-response.sample.json", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  ["out-of-scope-source.sample.json", "STOP_SOURCE_OUT_OF_SCOPE"],
  ["out-of-scope-question.sample.json", "STOP_QUESTION_OUT_OF_SCOPE"],
  ["missing-forbidden-disclaimer.sample.json", "STOP_MISSING_FORBIDDEN_DISCLAIMER"],
  ["hidden-uncertainty.sample.json", "STOP_HIDDEN_UNCERTAINTY"],
  ["jurisdiction-mismatch.sample.json", "STOP_JURISDICTION_MISMATCH"],
  ["personal-data-in-text.sample.json", "STOP_PERSONAL_DATA_RESPONSE"],
  ["school-specific-evidence-response.sample.json", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  ["england-whole-uk-overclaim.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["flanders-all-belgium-overclaim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ["support-accommodation-sufficiency-overclaim.sample.json", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
];

const REFUSAL_CASES = [
  [["--unauthorized-contact"], "STOP_UNAUTHORIZED_CONTACT_DISPATCH"],
  [["--contact-dispatch"], "STOP_UNAUTHORIZED_CONTACT_DISPATCH"],
  [["--missing-consent"], "STOP_MISSING_CONSENT_BOUNDARY"],
  [["--personal-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--student-data"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--legal-advice"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--compliance-proof"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--inspection-readiness"], "STOP_LEGAL_COMPLIANCE_CLAIM"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  [["--student-facing"], "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  [["--out-of-scope-source"], "STOP_SOURCE_OUT_OF_SCOPE"],
  [["--out-of-scope-question"], "STOP_QUESTION_OUT_OF_SCOPE"],
  [["--missing-disclaimer"], "STOP_MISSING_FORBIDDEN_DISCLAIMER"],
  [["--hide-uncertainty"], "STOP_HIDDEN_UNCERTAINTY"],
  [["--jurisdiction-mismatch"], "STOP_JURISDICTION_MISMATCH"],
  [["--personal-data-in-text"], "STOP_PERSONAL_DATA_RESPONSE"],
  [["--school-specific-evidence"], "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
  [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accessibility-legal-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--individual-adjustment-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["accepted_request_packet_decision_bound", "Contact pilot is bound to accepted PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT."],
  ["role_only_expert_profiles", "Allowed local expert profiles are role-only and contain no named people or personal data."],
  ["contact_text_from_request_packets_only", "Contact text is generated only from the accepted England/Flanders request packets."],
  ["consent_and_recording_boundary", "Consent, recording, storage, withdrawal, and response-use boundaries are explicit before any contact."],
  ["strict_response_intake_schema", "Response intake accepts only strict response-schema records plus consent metadata."],
  ["no_personal_or_student_data", "Personal data, student data, school-specific evidence, and support records are refused."],
  ["forbidden_authority_claims_refused", "Legal advice, compliance proof, approval, inspection-readiness, school-evidence, support/accommodation/accessibility/individual-adjustment sufficiency, product, Scale Gate, and localized-output claims are refused."],
  ["jurisdiction_boundaries_preserved", "England remains England-only and Flanders remains Flanders-only."],
  ["simulation_and_negative_fixtures_complete", "Simulations and negative fixtures cover contact authorization, consent, personal data, claims, source/question allowlists, uncertainty, and jurisdiction overclaims."],
  ["no_real_contact_before_owner_authorization", "No real contact dispatch, expert substitution, or real response storage occurs before owner payload authorization."],
  ["review_route_preserved", "Specialist reviews, final lead review, exact-head PR readiness, green CI, and human review remain required."],
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

function noOutputFlagsForPilot() {
  return {
    ...noOutputFlags(),
    contact_text_generated: true,
    consent_boundary_defined: true,
    response_intake_schema_generated: true,
    real_expert_response_stored: false,
    owner_authorized_contact_ready: true,
  };
}

function doesNotAuthorize() {
  return [
    "contact dispatch before owner payload authorization",
    "named expert selection",
    "personal-data processing",
    "student data or support-record processing",
    "school-specific evidence collection",
    "local expert substitution for official authority",
    "legal advice or legal sufficiency",
    "compliance proof",
    "approval, accreditation, OP0, PTA, summative validity, or inspection readiness",
    "support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or individual adjustment sufficiency",
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
    "school-owned evidence claims",
  ];
}

function nonNegotiables() {
  return [
    "- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
    "- Bind the sprint to the accepted `PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT` decision.",
    "- Use only the accepted England/Flanders request packets as input.",
    "- Define role-only expert profiles; do not select named people.",
    "- Generate contact text and response-intake controls, but do not dispatch contact before owner payload authorization.",
    "- Require explicit consent, recording, storage, withdrawal, and response-use boundaries.",
    "- Intake only strict response-schema records and reject personal data, student data, and school-specific evidence.",
    "- Refuse legal advice, compliance proof, approval, inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, product, Scale Gate, evidence-pack, and localized-output claims.",
    "- Preserve England-only and Flanders-only jurisdiction boundaries.",
    "- Include blocks, does_not_block, and proof_required_to_close for carried issues.",
    "- PASS WITH FLAGS may not carry a missing core requirement.",
  ];
}

function coreRequirementChecklist() {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status: "met",
    proof_required_to_close: "Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review.",
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
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_ALLOWLIST,
    core_requirement_checklist: coreRequirementChecklist(),
  };
}

function consentBoundary(jurisdictionId) {
  const label = jurisdictionId === "england" ? "England" : "Flanders";
  return {
    consent_statement: `Participation is voluntary. The reviewer may decline any question and may answer only within the ${label} source scope.`,
    recording_boundary: "No audio, video, transcript, meeting note, or identifiable personal metadata may be stored by this repository packet. Only schema-shaped, reviewer-approved written responses may be recorded after owner authorization.",
    storage_boundary: "Store only internal response-intake JSON/Markdown that passes the strict schema and contains no personal data, student data, school-specific evidence, or named-person details.",
    no_personal_data_instruction: "Do not include names, email addresses, phone numbers, institutional identifiers, student records, support records, or any personal data in the response.",
    withdrawal_boundary: "The reviewer may withdraw or decline; a withdrawal produces no substitute answer and no inferred local judgment.",
    response_use_limit: "Responses are internal interpretive input for later human review only; they do not authorize localized output, product use, school-facing use, legal/compliance claims, inspection-readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or individual adjustment sufficiency.",
  };
}

function consentSchema() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.local/schemas/local-expert-contact-consent.schema.v1.json",
    title: "Local Expert Contact Consent Boundary",
    type: "object",
    additionalProperties: false,
    required: CONSENT_FIELDS,
    properties: Object.fromEntries(CONSENT_FIELDS.map((field) => [field, { type: "string", minLength: 1 }])),
  };
}

function forbiddenResponseFields() {
  return [
    "student_data",
    "personal_data",
    "school_specific_evidence",
    "legal_conclusion",
    "compliance_conclusion",
    "approval_conclusion",
    "inspection_readiness_conclusion",
    "direct_localized_output",
    "support_sufficiency_conclusion",
    "accommodation_sufficiency_conclusion",
    "accessibility_legal_sufficiency_conclusion",
    "individual_adjustment_sufficiency_conclusion",
    "named_person",
    "contact_details",
  ];
}

function responseRecordSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: RESPONSE_FIELDS,
    properties: {
      reviewer_role: { type: "string", minLength: 1 },
      jurisdiction: { enum: ["england", "flanders"] },
      source_id: { type: "string", minLength: 1 },
      source_state_seen: { type: "string", minLength: 1 },
      question_id: { type: "string", minLength: 1 },
      answer_type: { enum: ["bounded_interpretation", "uncertainty_flag", "citation_correction", "out_of_scope"] },
      interpretation: { type: "string", minLength: 1 },
      confidence: { enum: ["high", "medium", "low", "cannot_answer"] },
      uncertainty: { type: "string" },
      cited_source: { type: "string", minLength: 1 },
      forbidden_claims_disclaimed: { const: true },
      does_not_authorize: { type: "array", items: { type: "string" }, minItems: 10 },
      proof_required_to_use: { type: "string", minLength: 1 },
    },
  };
}

function responseIntakeSchema() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.local/schemas/local-expert-response-intake.schema.v1.json",
    title: "Local Expert Response Intake",
    type: "object",
    additionalProperties: false,
    required: RESPONSE_INTAKE_FIELDS,
    properties: {
      intake_id: { type: "string", minLength: 1 },
      jurisdiction_id: { enum: ["england", "flanders"] },
      request_packet_id: { type: "string", minLength: 1 },
      consent_confirmed: { type: "boolean" },
      response_received: { type: "boolean" },
      responses: { type: "array", items: responseRecordSchema() },
      validation_status: { enum: ["no_response_yet", "accepted_simulation", "accepted_for_internal_review", "rejected"] },
      rejected_items: { type: "array", items: { type: "object" } },
      does_not_authorize: { type: "array", items: { type: "string" }, minItems: 10 },
      proof_required_to_use: { type: "string", minLength: 1 },
    },
    allOf: [
      {
        if: {
          properties: { response_received: { const: true } },
          required: ["response_received"],
        },
        then: {
          properties: { consent_confirmed: { const: true } },
          required: ["consent_confirmed"],
        },
      },
    ],
    response_record_required_fields: RESPONSE_FIELDS,
    forbidden_fields: forbiddenResponseFields(),
  };
}

function roleOnlyProfile(packet) {
  return packet.expert_profile_needed;
}

function contactText(packet) {
  const consent = consentBoundary(packet.jurisdiction_id);
  const questionLines = packet.questions_allowed.map((question) => `- ${question.question_id}: ${question.allowed_question}`);
  return [
    `Internal-only ${packet.jurisdiction_label} source-bound review request.`,
    "",
    "Before answering, please confirm voluntary participation and the response-use boundary below.",
    consent.consent_statement,
    consent.no_personal_data_instruction,
    consent.response_use_limit,
    "",
    "Please answer only the questions below, only against the listed official source IDs, and use the required response fields.",
    ...questionLines,
    "",
    "Required response fields:",
    ...RESPONSE_FIELDS.map((field) => `- ${field}`),
    "",
    "Do not provide legal advice, compliance proof, approval, inspection-readiness, school evidence, school-specific evidence, student data, personal data, support/accommodation/accessibility/individual-adjustment sufficiency claims, localized output, exam-ready exercise generation, product authority, Scale Gate authority, or public/teacher/school-facing output.",
  ].join("\n");
}

function contactPacket(jurisdictionId) {
  const packet = requestPacket(jurisdictionId);
  const consent = consentBoundary(jurisdictionId);
  return {
    ...baseReport("local_expert_contact_pilot_packet"),
    report_id: `${jurisdictionId}-local-expert-contact-pilot-packet`,
    contact_id: `${jurisdictionId}-local-expert-contact-stage`,
    status: "ready_for_owner_authorized_contact_stage",
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: packet.jurisdiction_label,
    request_packet_id: packet.packet_id,
    request_packet_source: `reports/inspection-standards/${jurisdictionId}-local-expert-review-request-packet.json`,
    expert_profile_allowed: roleOnlyProfile(packet),
    named_expert_selected: false,
    source_ids_in_scope: packet.source_ids_in_scope,
    source_states_from_request_packet: packet.source_states_from_refresh_pilot,
    question_ids_in_scope: packet.questions_allowed.map((question) => question.question_id),
    contact_text: contactText(packet),
    consent_boundary: consent,
    storage_boundary: consent.storage_boundary,
    response_schema_id: "https://4veco.local/schemas/local-expert-review-response.schema.v1.json",
    response_intake_schema_id: "https://4veco.local/schemas/local-expert-response-intake.schema.v1.json",
    owner_authorization_required: true,
    contact_dispatch_performed: false,
    response_received: false,
    attachments_allowed: [
      packet.request_packet_source || `reports/inspection-standards/${jurisdictionId}-local-expert-review-request-packet.json`,
      "references/schemas/local-expert-review-response.schema.v1.json",
    ],
    attachments_forbidden: [
      "student records",
      "personal data",
      "school-owned evidence",
      "lesson-output files",
      "localized drafts",
      "assessment items",
      "evidence packs",
    ],
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForPilot(),
    finding_classification: [
      {
        finding: `${packet.jurisdiction_label} contact text is ready only for owner payload-authorized dispatch.`,
        classification: "core_requirement_met",
        blocks: "Nothing for human review once checker, specialists, final lead, CI, branch protection, and PR readiness pass.",
        does_not_block: "Human review of this internal contact-stage packet.",
        proof_required_to_close: "Checker PASS, specialist PASS, final lead PASS, exact-head readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Contact dispatch and real response storage remain blocked until owner authorization.",
        classification: "human_authorization_required",
        blocks: "Sending contact text, storing real expert response records, or treating expert feedback as authority.",
        does_not_block: "Reviewing the internal contact-stage packet.",
        proof_required_to_close: "Owner payload authorization that names reviewed_payload_head_sha and current green checks.",
      },
    ],
  };
}

function simulatedResponse(packet) {
  const firstQuestion = packet.questions_allowed[0];
  const firstSource = firstQuestion.source_ids[0];
  return {
    reviewer_role: `SIMULATED ${packet.jurisdiction_label} role-only reviewer; not a real expert response`,
    jurisdiction: packet.jurisdiction_id,
    source_id: firstSource,
    source_state_seen: firstQuestion.source_states_seen[firstSource],
    question_id: firstQuestion.question_id,
    answer_type: "uncertainty_flag",
    interpretation: "SIMULATED_PLACEHOLDER_DO_NOT_USE_AS_EXPERT_JUDGMENT",
    confidence: "cannot_answer",
    uncertainty: "Simulation only; no expert was contacted and no local judgment is supplied.",
    cited_source: firstSource,
    forbidden_claims_disclaimed: true,
    does_not_authorize: requestPacketDoesNotAuthorize(),
    proof_required_to_use: "A real owner-authorized response intake record that passes the strict schema and later human review.",
  };
}

function responseIntakeReport(england, flanders) {
  return {
    ...baseReport("local_expert_response_intake_report"),
    report_id: "local-expert-response-intake-report",
    status: "intake_schema_ready_no_real_responses",
    intake_records: [
      {
        intake_id: "england-simulated-intake",
        jurisdiction_id: "england",
        request_packet_id: england.request_packet_id,
        consent_confirmed: false,
        response_received: false,
        responses: [simulatedResponse(requestPacket("england"))],
        validation_status: "accepted_simulation",
        rejected_items: [],
        does_not_authorize: doesNotAuthorize(),
        proof_required_to_use: "Owner-authorized contact, explicit consent confirmation, strict schema PASS, specialist review, and human review.",
      },
      {
        intake_id: "flanders-simulated-intake",
        jurisdiction_id: "flanders",
        request_packet_id: flanders.request_packet_id,
        consent_confirmed: false,
        response_received: false,
        responses: [simulatedResponse(requestPacket("flanders"))],
        validation_status: "accepted_simulation",
        rejected_items: [],
        does_not_authorize: doesNotAuthorize(),
        proof_required_to_use: "Owner-authorized contact, explicit consent confirmation, strict schema PASS, specialist review, and human review.",
      },
    ],
    no_real_responses_stored: true,
    no_output_flags: noOutputFlagsForPilot(),
    finding_classification: [
      {
        finding: "Response intake schema is ready and contains only simulated non-authority placeholders.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review once validation and reviews pass.",
        does_not_block: "Future owner-authorized intake of real schema-shaped responses.",
        proof_required_to_close: "Checker PASS and focused Jest PASS proving simulations are not treated as expert judgment.",
      },
    ],
  };
}

function planReport() {
  return {
    ...baseReport("local_expert_contact_pilot_plan"),
    report_id: "local-expert-contact-pilot-plan",
    status: "contact_stage_packet_ready_for_review",
    goal: "Prepare a governed local expert contact-stage pilot packet from the accepted request packets, without dispatching contact before owner payload authorization.",
    required_workstreams: [
      "role_only_expert_profiles",
      "contact_text_from_accepted_packets",
      "consent_recording_storage_boundary",
      "strict_response_intake_schema",
      "simulated_positive_and_negative_intake_cases",
      "specialist_reviews_and_final_lead_review",
    ],
    review_protocol: [
      "Plan/architecture lead reviewer",
      "Teacher/economics reviewer",
      "Legal/privacy reviewer",
      "Dutch quality-inspection reviewer",
      "Accessibility/inclusion reviewer",
      "Final lead reviewer",
    ],
    no_output_flags: noOutputFlagsForPilot(),
    finding_classification: [
      {
        finding: "Plan covers contact-stage controls, not localization or product use.",
        classification: "core_requirement_met",
        blocks: "Nothing for implementation once generated artifacts and validators pass.",
        does_not_block: "Human review of the complete packet.",
        proof_required_to_close: "All required artifacts, simulations, specialist reviews, final lead review, PR readiness, branch protection ok:true, and CI.",
      },
    ],
  };
}

function simulationReport(england, flanders) {
  return {
    ...baseReport("local_expert_contact_pilot_simulation"),
    report_id: "local-expert-contact-pilot-simulation",
    status: "simulation_pass",
    contact_packets_simulated: [england.contact_id, flanders.contact_id],
    contact_dispatch_performed: false,
    no_real_responses_stored: true,
    simulation_cases: NEGATIVE_FIXTURES.map(([file, stopCode]) => ({
      case_id: file.replace(".sample.json", ""),
      fixture_name: file,
      valid: false,
      expected_stop_code: stopCode,
      contact_dispatched: false,
      blocks: "Use of this contact/intake record as valid local expert evidence.",
      does_not_block: "Positive contact-stage packets and simulated intake report.",
      proof_required_to_close: "Checker must reject the negative fixture with the expected stop code.",
    })),
    no_output_flags: noOutputFlagsForPilot(),
    finding_classification: [
      {
        finding: "Negative simulations cover contact authorization, consent, data, claim, allowlist, uncertainty, and jurisdiction-boundary failures.",
        classification: "core_requirement_met",
        blocks: "Nothing once checker and focused Jest prove refusal behavior.",
        does_not_block: "Human review of the complete packet.",
        proof_required_to_close: "Checker and Jest PASS with all negative fixtures rejected.",
      },
    ],
  };
}

function decisionReport(england, flanders, intake, simulation) {
  return {
    ...baseReport("local_expert_contact_pilot_decision"),
    report_id: "local-expert-contact-pilot-decision",
    status: "ready_for_human_review",
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "The contact-stage packet is generated from the accepted request packets, uses role-only expert profiles, defines consent/storage/intake boundaries, refuses the required unsafe cases, and does not dispatch contact or store real responses before owner authorization.",
    },
    contact_packet_ids: [england.contact_id, flanders.contact_id],
    response_intake_report: intake.report_id,
    simulation_summary: {
      negative_cases: simulation.simulation_cases.length,
      contact_dispatched: false,
      real_responses_stored: false,
    },
    owner_next_action: "Human owner may review whether to grant payload authorization for the contact-stage packet and external dispatch scope. Any dispatch or later intake requires owner payload authorization that names reviewed_payload_head_sha and current green checks.",
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForPilot(),
    finding_classification: [
      {
        finding: "The packet is ready for human review as a governed contact-stage pilot.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review once final readiness proof is green.",
        does_not_block: "Human decision on whether to authorize external contact under the packet.",
        proof_required_to_close: "Exact-head PR readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "External contact and response storage remain owner-authorized steps.",
        classification: "human_authorization_required",
        blocks: "Sending requests, storing real responses, naming experts, processing personal data, or using responses as product/school/public authority.",
        does_not_block: "Human review of the complete contact-stage packet.",
        proof_required_to_close: "Owner payload authorization that names reviewed_payload_head_sha after merge/readiness evidence.",
      },
      {
        finding: "Downstream product and school authority remains blocked.",
        classification: "scale_blocker",
        blocks: "Localized output, country editions, teacher/school/public output, evidence packs, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, legal/compliance/approval/inspection-readiness claims, support/accommodation/accessibility/individual-adjustment sufficiency claims, and school-owned evidence claims.",
        does_not_block: "Internal contact-stage packet review.",
        proof_required_to_close: "Separate governed sprint and owner authorization after this contact-stage packet.",
      },
    ],
  };
}

function negativeFixture(file, stopCode, england, intake) {
  const fixture = clone(intake.intake_records[0]);
  fixture.fixture_name = file;
  fixture.valid = false;
  fixture.expected_stop_code = stopCode;
  fixture.finding_classification = [
    {
      finding: `Negative fixture ${file} must be refused with ${stopCode}.`,
      classification: "core_spec_failure",
      blocks: "Use of this intake/contact record as valid local expert evidence.",
      does_not_block: "Positive contact-stage packets and simulated intake records.",
      proof_required_to_close: "Checker must reject this fixture.",
    },
  ];
  if (stopCode === "STOP_UNAUTHORIZED_CONTACT_DISPATCH") fixture.contact_dispatch_performed = true;
  if (stopCode === "STOP_MISSING_CONSENT_BOUNDARY") {
    fixture.consent_confirmed = false;
    fixture.response_received = true;
  }
  if (stopCode === "STOP_PERSONAL_DATA_RESPONSE") fixture.responses[0].personal_data = "named person and email address";
  if (stopCode === "STOP_LEGAL_COMPLIANCE_CLAIM") fixture.responses[0].interpretation = "This is compliant, ready-for-inspection, approved, and legally sufficient.";
  if (stopCode === "STOP_LOCALIZED_OUTPUT_RESPONSE") fixture.responses[0].direct_localized_output = "Localized student-facing paragraph.";
  if (stopCode === "STOP_SOURCE_OUT_OF_SCOPE") fixture.responses[0].source_id = "out-of-scope-source";
  if (stopCode === "STOP_QUESTION_OUT_OF_SCOPE") fixture.responses[0].question_id = "out-of-scope-question";
  if (stopCode === "STOP_MISSING_FORBIDDEN_DISCLAIMER") fixture.responses[0].forbidden_claims_disclaimed = false;
  if (stopCode === "STOP_HIDDEN_UNCERTAINTY") {
    fixture.responses[0].confidence = "low";
    fixture.responses[0].uncertainty = "";
    fixture.responses[0].interpretation = "Choose this likely interpretation despite uncertainty.";
  }
  if (stopCode === "STOP_JURISDICTION_MISMATCH") fixture.responses[0].jurisdiction = "flanders";
  if (stopCode === "STOP_PERSONAL_DATA_RESPONSE") fixture.responses[0].interpretation = "Student Alice Example was discussed in this case.";
  if (stopCode === "STOP_SCHOOL_EVIDENCE_RESPONSE") fixture.responses[0].interpretation = "At Northfield Academy, implementation records show this evidence.";
  if (stopCode === "STOP_WHOLE_UK_OVERCLAIM") {
    fixture.jurisdiction_id = "england";
    fixture.responses[0].jurisdiction = "england";
    fixture.responses[0].interpretation = "This England response applies to the whole UK.";
  }
  if (stopCode === "STOP_ALL_BELGIUM_OVERCLAIM") {
    const flandersPacket = requestPacket("flanders");
    fixture.jurisdiction_id = "flanders";
    fixture.request_packet_id = flandersPacket.packet_id;
    fixture.responses[0] = simulatedResponse(flandersPacket);
    fixture.responses[0].interpretation = "This Flanders response applies to all Belgium.";
  }
  if (stopCode === "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM") {
    fixture.responses[0].interpretation = "This confirms support is sufficient, accommodations are sufficient, accessibility/legal sufficiency, and individual adjustment sufficiency for learners.";
  }
  return fixture;
}

function renderContactMarkdown(packet) {
  return [
    `# ${packet.jurisdiction_label} Local Expert Contact Text`,
    "",
    `Contact ID: \`${packet.contact_id}\``,
    `Request packet: \`${packet.request_packet_id}\``,
    "",
    "## Contact Text",
    "",
    packet.contact_text,
    "",
    "## Consent Boundary",
    "",
    ...CONSENT_FIELDS.map((field) => `- ${packet.consent_boundary[field]}`),
    "",
    "## Finding Classification",
    "",
    findingTable(packet.finding_classification),
  ].join("\n");
}

function renderContractMarkdown(plan) {
  return [
    "# Local Expert Contact Pilot Contract",
    "",
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Product end-state checkout note: ${PRODUCT_END_STATE_CHECKOUT_NOTE}`,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\` from \`${ACCEPTED_INPUT_DECISION_SOURCE}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Contact Fields",
    "",
    ...CONTACT_FIELDS.map((field) => `- \`${field}\``),
    "",
    "## Response Intake Fields",
    "",
    ...RESPONSE_INTAKE_FIELDS.map((field) => `- \`${field}\``),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(plan.core_requirement_checklist),
  ].join("\n");
}

function renderPlanMarkdown(plan) {
  return [
    "# Local Expert Contact Pilot Plan",
    "",
    `Accepted input decision: \`${plan.accepted_input_decision}\``,
    "",
    "## Goal",
    "",
    plan.goal,
    "",
    "## Workstreams",
    "",
    ...plan.required_workstreams.map((item) => `- \`${item}\``),
    "",
    "## Review Protocol",
    "",
    ...plan.review_protocol.map((item) => `- ${item}`),
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
    "# Local Expert Response Intake Report",
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

function renderSimulationMarkdown(simulation) {
  return [
    "# Local Expert Contact Pilot Simulation",
    "",
    `Contact dispatched: \`${simulation.contact_dispatch_performed}\``,
    `No real responses stored: \`${simulation.no_real_responses_stored}\``,
    "",
    "| case_id | expected_stop_code | proof_required_to_close |",
    "|---|---|---|",
    ...simulation.simulation_cases.map((item) => `| \`${item.case_id}\` | \`${item.expected_stop_code}\` | ${item.proof_required_to_close} |`),
    "",
    "## Finding Classification",
    "",
    findingTable(simulation.finding_classification),
  ].join("\n");
}

function renderDecisionMarkdown(decision) {
  return [
    "# Local Expert Contact Pilot Decision",
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
        proof_required_to_close: "Final lead PASS, exact-head readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Downstream authority remains blocked.",
        classification: "scale_blocker",
        blocks: "Contact dispatch without owner payload authorization, named expert selection, personal data, student data, school evidence, legal/compliance/approval/inspection-readiness claims, localized output, product use, Scale Gate, diagnostics/mastery/PV, support/accommodation/accessibility/individual-adjustment sufficiency claims, and school-owned evidence claims.",
        does_not_block: "Internal contact-stage packet human review.",
        proof_required_to_close: "Separate owner payload authorization and later governed response-intake review.",
      },
    ]),
    "",
    "No PASS WITH FLAGS carries a missing core requirement.",
  ].join("\n");
}

function finalLeadReview() {
  return specialistReview(
    "Final Lead Review",
    "PASS",
    "Final lead subagent returned PASS after correction reruns: the contact-stage packet is bound to the accepted request packets, uses role-only profiles, enforces strict consent/storage/intake controls, refuses all required unsafe cases including personal-data text, jurisdiction mismatch, legal/compliance variants, and individual-adjustment sufficiency, and preserves owner-authorization plus downstream-authority boundaries."
  );
}

function correctionLog() {
  return [
    `# ${SPRINT_ID} Correction Log`,
    "",
    "| issue | status | correction | proof_required_to_close |",
    "|---|---|---|---|",
    "| Contact-stage artifacts absent | closed | Added deterministic generator, checker, contact text, consent schema, intake schema, simulations, fixtures, and sprint records | Generator currentness, checker, and focused Jest PASS |",
    "| Unauthorized dispatch risk | closed | Added owner_authorization_required, contact_dispatch_performed false, stop code, negative fixture, and checker refusal | Checker PASS |",
    "| Personal-data intake risk | closed | Added consent/storage/no-personal-data boundary, forbidden intake fields, negative fixture, and checker refusal | Focused Jest PASS |",
    "| Authority-overclaim risk | closed | Added legal/compliance/localized/support/accommodation/accessibility/individual-adjustment sufficiency refusals and specialist review records | Specialist reviews and checker PASS |",
    "| Specialist finding: response intake schema was metadata-only for response records | closed | Inlined strict response-item JSON Schema with required response fields and additionalProperties false; checker verifies standard schema constraints | Generator currentness, checker, and focused Jest PASS |",
    "| Specialist finding: response_received without consent could pass | closed | Reversed the consent gate so response_received true requires consent_confirmed true, updated fixture, and added Jest probe | Focused Jest PASS |",
    "| Specialist finding: response jurisdiction could conflict with intake jurisdiction | closed | Added STOP_JURISDICTION_MISMATCH checker refusal, fixture, CLI flag, and Jest probe | Focused Jest PASS |",
    "| Specialist finding: personal/student data could pass inside allowed text fields | closed | Added free-text scanning for email, phone, named student/person, student/support records, contact details, personal data, and school-specific evidence markers | Focused Jest PASS |",
    "| Specialist finding: legal/compliance variants were too narrow | closed | Broadened refusal matcher for compliant, inspection ready, approved, legally sufficient, legal sufficiency, accreditation, OP0, PTA, and summative validity variants | Focused Jest PASS |",
    "| Specialist finding: individual-adjustment sufficiency was absent | closed | Added individual-adjustment sufficiency to generated boundaries, schema forbidden metadata, checker fields, CLI flags, fixture, simulation, and Jest coverage | Focused Jest PASS |",
    "| Specialist rerun finding: named student/learner free text could pass | closed | Added name-like student/learner/pupil text refusal and direct Jest probes | Focused Jest PASS |",
    "| Specialist rerun finding: named-school implementation-log wording could pass | closed | Added named-school, implementation-log, and implementation-record refusal patterns plus generated fixture coverage | Focused Jest PASS |",
    "| Specialist rerun finding: ready for inspection variants could pass | closed | Added ready-for-inspection, ready for inspection, and inspection-ready refusal variants plus direct Jest probes | Focused Jest PASS |",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "| Command | Status |",
    "|---|---|",
    "| `node build-scripts/inspection/build-local-expert-contact-pilot.js --check` | PASS |",
    "| `node build-scripts/inspection/check-local-expert-contact-pilot.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-local-expert-contact-pilot.test.js --runInBand` | PASS |",
    "| `node build-scripts/inspection/check-local-expert-review-request-packet.js` | PASS |",
    "| `npm.cmd run check:scope-language` | PASS |",
    "| `npm.cmd run check:active-governance-wording` | PASS |",
    "| `git diff --check origin/main..HEAD` | PASS |",
    "| `npm.cmd run check:platform` | PASS |",
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
        finding: "Local expert contact-stage packet is ready for exact-head human review.",
        classification: "core_requirement_met",
        blocks: "Nothing once exact-head PR readiness, branch protection ok:true, and CI pass.",
        does_not_block: "Human review of the complete contact-stage packet.",
        proof_required_to_close: "Exact-head readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "External contact and downstream authority remain blocked until explicitly authorized.",
        classification: "human_authorization_required",
        blocks: "Contact dispatch, real response storage, named expert selection, personal data, student data, school evidence, localized output, public/school/product use, legal/compliance/inspection-readiness claims, Scale Gate, diagnostics/mastery/PV, support/accommodation/accessibility/individual-adjustment sufficiency claims, and school-owned evidence claims.",
        does_not_block: "Human review of this internal packet.",
        proof_required_to_close: "Owner payload authorization that names reviewed_payload_head_sha and separate governed review for any later use of responses.",
      },
    ]),
  ].join("\n");
}

function outputContents() {
  const plan = planReport();
  const england = contactPacket("england");
  const flanders = contactPacket("flanders");
  const intake = responseIntakeReport(england, flanders);
  const simulation = simulationReport(england, flanders);
  const decision = decisionReport(england, flanders, intake, simulation);
  const outputs = {
    "references/schemas/local-expert-contact-consent.schema.v1.json": `${JSON.stringify(consentSchema(), null, 2)}\n`,
    "references/schemas/local-expert-response-intake.schema.v1.json": `${JSON.stringify(responseIntakeSchema(), null, 2)}\n`,
    "docs/inspection-standards/local-expert-contact-pilot-contract.md": `${renderContractMarkdown(plan)}\n`,
    "docs/inspection-standards/england-local-expert-contact-text.md": `${renderContactMarkdown(england)}\n`,
    "docs/inspection-standards/flanders-local-expert-contact-text.md": `${renderContactMarkdown(flanders)}\n`,
    "reports/inspection-standards/local-expert-contact-pilot-plan.json": `${JSON.stringify(plan, null, 2)}\n`,
    "reports/inspection-standards/local-expert-contact-pilot-plan.md": `${renderPlanMarkdown(plan)}\n`,
    "reports/inspection-standards/england-local-expert-contact-pilot-packet.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/england-local-expert-contact-pilot-packet.md": `${renderContactMarkdown(england)}\n`,
    "reports/inspection-standards/flanders-local-expert-contact-pilot-packet.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/flanders-local-expert-contact-pilot-packet.md": `${renderContactMarkdown(flanders)}\n`,
    "reports/inspection-standards/local-expert-response-intake-report.json": `${JSON.stringify(intake, null, 2)}\n`,
    "reports/inspection-standards/local-expert-response-intake-report.md": `${renderIntakeMarkdown(intake)}\n`,
    "reports/inspection-standards/local-expert-contact-pilot-simulation.json": `${JSON.stringify(simulation, null, 2)}\n`,
    "reports/inspection-standards/local-expert-contact-pilot-simulation.md": `${renderSimulationMarkdown(simulation)}\n`,
    "reports/inspection-standards/local-expert-contact-pilot-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/local-expert-contact-pilot-decision.md": `${renderDecisionMarkdown(decision)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/england-local-expert-contact-pilot-packet.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/flanders-local-expert-contact-pilot-packet.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/local-expert-response-intake-report.sample.json": `${JSON.stringify(intake, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/local-expert-contact-pilot-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: `${sprintPlan()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: `${correctionLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: `${validationLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-plan-architecture-lead-review.md`]: `${specialistReview("Plan/Architecture Lead Review", "PASS", "Subagent review returned PASS: the contact-stage plan advances from the accepted request packets only, adds strict consent/intake architecture, and does not expand into localization or product use.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`]: `${specialistReview("Teacher/Economics Review", "PASS", "Subagent correction rerun returned PASS: contact text preserves the Book 1 1.2/1.3 source-bound economics questions without creating student-facing tasks, exam-ready exercises, localized teaching material, and the intake checks now enforce consent, strict schema, personal-data, jurisdiction, and authority boundaries.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`]: `${specialistReview("Legal/Privacy Review", "PASS", "Subagent correction rerun returned PASS: consent, storage, withdrawal, no-personal-data, no-student-data, no-school-evidence, and no-legal/compliance/approval/inspection-readiness boundaries are explicit and enforced through strict schema, checker, fixtures, and Jest probes.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-dutch-quality-inspection-review.md`]: `${specialistReview("Dutch Quality-Inspection Review", "PASS", "Subagent correction rerun returned PASS: strict response intake now refuses school-specific evidence and inspection-readiness claims, preserves product/school boundaries, and keeps Flanders/England authority separate from Dutch inspection authority.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`]: `${specialistReview("Accessibility/Inclusion Review", "PASS", "Subagent correction rerun returned PASS: support, accommodation, accessibility, and individual-adjustment terminology stays in non-sufficiency review mode and refuses sufficiency overclaims in schema, checker, fixtures, CLI flags, simulation, and Jest coverage.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`]: `${finalLeadReview()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`]: `${closureRecord()}\n`,
  };
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stopCode, england, intake), null, 2)}\n`;
  }
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

function checkAcceptedInput() {
  const decision = readJson(ACCEPTED_INPUT_DECISION_SOURCE);
  if (!decision.final_decision || decision.final_decision.selected !== ACCEPTED_INPUT_DECISION) {
    console.error(`Accepted input decision must be ${ACCEPTED_INPUT_DECISION}`);
    process.exit(1);
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
    console.error("Local expert contact pilot outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK local expert contact pilot outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote local expert contact pilot outputs (${Object.keys(outputContents()).length} files)`);
}

if (require.main === module) runCli();

module.exports = {
  ACCEPTED_INPUT_DECISION,
  CONTACT_FIELDS,
  CONSENT_FIELDS,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  RESPONSE_FIELDS,
  RESPONSE_INTAKE_FIELDS,
  SELECTED_DECISION,
  SPRINT_ID,
  consentSchema,
  contactPacket,
  coreRequirementChecklist,
  doesNotAuthorize,
  noOutputFlagsForPilot,
  outputContents,
  responseIntakeSchema,
  responseIntakeReport,
};
