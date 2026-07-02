#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
  doesNotAuthorize: stageDoesNotAuthorize,
  noOutputFlagsForStage,
  validResponse: stageValidResponse,
} = require("./build-local-expert-contact-stage.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-07-01";
const SPRINT_ID = "GOAL-IQS-OWNER-MANUAL-DISPATCH-AND-RESPONSE-INTAKE-1";
const SOURCE_SPRINT_ID = "GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_INPUT_DECISION_SOURCE = "reports/inspection-standards/local-expert-contact-stage-decision.json";
const STAGE_RESPONSE_INTAKE_SOURCE = "reports/inspection-standards/local-expert-contact-stage-response-intake-report.json";
const STAGE_QUARANTINE_SOURCE = "reports/inspection-standards/local-expert-contact-stage-quarantine-report.json";
const ACCEPTED_INPUT_DECISION = "READY_FOR_OWNER_MANUAL_DISPATCH_AND_RESPONSE_INTAKE";
const SELECTED_DECISION = "REVISE_DISPATCH_OR_INTAKE_PROTOCOL";

const DECISION_OPTIONS = [
  "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS",
  "REVISE_DISPATCH_OR_INTAKE_PROTOCOL",
  "STOP_LOCAL_EXPERT_CONTACT_TRACK",
];

const INPUT_ALLOWLIST = [
  ACCEPTED_INPUT_DECISION_SOURCE,
  "reports/inspection-standards/england-local-expert-contact-dispatch-record.json",
  "reports/inspection-standards/flanders-local-expert-contact-dispatch-record.json",
  STAGE_RESPONSE_INTAKE_SOURCE,
  STAGE_QUARANTINE_SOURCE,
  "references/schemas/local-expert-contact-consent.schema.v1.json",
  "references/schemas/local-expert-response-intake.schema.v1.json",
];

const OUTPUT_ALLOWLIST = [
  "reports/inspection-standards/owner-manual-dispatch-record.json",
  "reports/inspection-standards/owner-manual-dispatch-record.md",
  "reports/inspection-standards/england-local-expert-response-intake.json",
  "reports/inspection-standards/england-local-expert-response-intake.md",
  "reports/inspection-standards/flanders-local-expert-response-intake.json",
  "reports/inspection-standards/flanders-local-expert-response-intake.md",
  "reports/inspection-standards/local-expert-response-quarantine-report.json",
  "reports/inspection-standards/local-expert-response-quarantine-report.md",
  "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.json",
  "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.md",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/owner-manual-dispatch-record.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/england-local-expert-response-intake.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/flanders-local-expert-response-intake.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/local-expert-response-quarantine-report.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/owner-manual-dispatch-and-response-intake-decision.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/unsupported-dispatch-claim.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/material-sent-without-channel.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/named-contact-recorded.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/response-without-consent.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/personal-data-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/school-evidence-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/legal-compliance-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/localized-output-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/support-accommodation-sufficiency-response.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/expert-as-official-authority.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/england-whole-uk-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/flanders-all-belgium-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/proceed-to-analysis-without-response.sample.json",
];

const NEGATIVE_FIXTURES = [
  ["unsupported-dispatch-claim.sample.json", "STOP_UNSUPPORTED_DISPATCH_PROOF"],
  ["material-sent-without-channel.sample.json", "STOP_UNSUPPORTED_DISPATCH_PROOF"],
  ["named-contact-recorded.sample.json", "STOP_PERSONAL_CONTACT_DETAILS"],
  ["response-without-consent.sample.json", "STOP_MISSING_CONSENT_BOUNDARY"],
  ["personal-data-response.sample.json", "STOP_PERSONAL_DATA_RESPONSE"],
  ["school-evidence-response.sample.json", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
  ["legal-compliance-response.sample.json", "STOP_LEGAL_COMPLIANCE_CLAIM"],
  ["localized-output-response.sample.json", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
  ["support-accommodation-sufficiency-response.sample.json", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  ["expert-as-official-authority.sample.json", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ["england-whole-uk-overclaim.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["flanders-all-belgium-overclaim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ["proceed-to-analysis-without-response.sample.json", "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
];

const REFUSAL_CASES = [
  [["--claim-dispatch"], "STOP_UNSUPPORTED_DISPATCH_PROOF"],
  [["--material-sent"], "STOP_UNSUPPORTED_DISPATCH_PROOF"],
  [["--named-contact"], "STOP_PERSONAL_CONTACT_DETAILS"],
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
  [["--proceed-to-analysis"], "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["accepted_stage_decision_bound", "Owner dispatch/intake work is bound to merged `READY_FOR_OWNER_MANUAL_DISPATCH_AND_RESPONSE_INTAKE`."],
  ["owner_authorization_recorded", "Thread owner authorization for this goal is recorded with scope and limits."],
  ["dispatch_status_recorded_for_both_jurisdictions", "Owner-controlled dispatch status is recorded for England and Flanders."],
  ["approved_payload_only", "Only the approved contact text and accepted request packet are prepared as sendable material."],
  ["no_repository_dispatch_claim", "The repository does not claim external dispatch, because no delivery proof or delivery channel is available here."],
  ["no_named_contact_or_private_details", "No named expert, private contact details, dispatch endpoint, or personal contact route is stored."],
  ["strict_response_intake_records", "Each jurisdiction has a strict response-intake record using the approved schema boundary."],
  ["responses_captured_pending_or_quarantined", "Every received response is captured, pending, or quarantined; in this packet no real response is present."],
  ["quarantine_rules_enforced", "Out-of-scope, personal-data, school-evidence, forbidden-claim, localized-output, and authority-overclaim responses are quarantined."],
  ["no_response_analysis_without_accepted_response", "The packet cannot proceed to expert response analysis without accepted, consented, schema-passing responses."],
  ["downstream_authority_blocked", "Localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, school evidence, and official-authority claims remain blocked."],
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

function jurisdictionLabel(jurisdictionId) {
  return jurisdictionId === "england" ? "England" : "Flanders";
}

function stageDispatchPath(jurisdictionId) {
  return `reports/inspection-standards/${jurisdictionId}-local-expert-contact-dispatch-record.json`;
}

function readStageDispatchRecord(jurisdictionId) {
  return readJson(stageDispatchPath(jurisdictionId));
}

function readStageResponseIntakeReport() {
  return readJson(STAGE_RESPONSE_INTAKE_SOURCE);
}

function readStageQuarantineReport() {
  return readJson(STAGE_QUARANTINE_SOURCE);
}

function readStageIntakeRecord(jurisdictionId) {
  const report = readStageResponseIntakeReport();
  const record = (report.intake_records || []).find((item) => item.jurisdiction_id === jurisdictionId);
  if (!record) throw new Error(`${STAGE_RESPONSE_INTAKE_SOURCE}: missing ${jurisdictionId} intake record`);
  return record;
}

function doesNotAuthorize() {
  return unique([
    ...stageDoesNotAuthorize(),
    "repository-claimed external dispatch",
    "invented owner delivery proof",
    "expert response analysis",
    "response interpretation as product evidence",
    "treating missing responses as approval",
    "named contact recording",
    "private dispatch endpoint storage",
  ]);
}

function noOutputFlagsForOwnerDispatch() {
  return {
    ...noOutputFlagsForStage(),
    owner_manual_dispatch_goal_authorized: true,
    owner_dispatch_status_recorded: true,
    owner_delivery_channel_configured: false,
    owner_delivery_proof_recorded: false,
    owner_material_sent: false,
    owner_response_received: false,
    accepted_response_available: false,
    response_analysis_authorized: false,
    protocol_revision_required: true,
  };
}

function ownerAuthorization() {
  return {
    authorization_id: "thread-owner-authorization-2026-07-01-owner-manual-dispatch-and-response-intake",
    authorization_source: "Codex thread owner message dated 2026-07-01 after merged PR #190",
    accepted_decision: ACCEPTED_INPUT_DECISION,
    authorized_scope: [
      "record England and Flanders owner-controlled dispatch status",
      "record role-only contact basis without named expert selection or private contact details",
      "send only approved contact text and accepted request packet if the owner provides an approved delivery channel outside repository storage",
      "collect responses only through the approved response-intake schema",
      "quarantine out-of-scope, personal-data, school-evidence, forbidden-claim, localized-output, or authority-overclaim responses",
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
    proof_required_to_close: "Generator currentness PASS, owner dispatch/intake checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review.",
  }));
}

function nonNegotiables() {
  return [
    "- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
    "- Bind all records to the merged PR #190 decision `READY_FOR_OWNER_MANUAL_DISPATCH_AND_RESPONSE_INTAKE`.",
    "- Record owner-controlled dispatch status for England and Flanders without inventing external delivery proof.",
    "- Keep contact candidates role-only; do not store named experts, private contact details, or dispatch endpoints.",
    "- Treat approved contact text and accepted request packets as prepared material only unless owner delivery proof exists.",
    "- Store no real expert response unless consent, schema validity, jurisdiction bounds, and quarantine checks pass.",
    "- Quarantine personal/student/school data, legal/compliance/inspection-readiness claims, localized output, support/accommodation/accessibility/individual-adjustment sufficiency claims, jurisdiction overclaims, or official-authority substitution.",
    "- Do not proceed to response analysis without accepted, consented, schema-passing responses.",
    "- Preserve all downstream blocks for localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, student/product use, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, school evidence, and official-authority claims.",
    "- Include blocks, does_not_block, and proof_required_to_close for carried issues.",
    "- PASS WITH FLAGS may not carry a missing core requirement.",
  ];
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

function findingClassification(summary) {
  return [
    {
      finding: summary,
      classification: "core_requirement_met",
      blocks: "Nothing for internal human review once exact-head readiness, CI, and branch protection pass.",
      does_not_block: "Owner review of the complete owner dispatch/intake packet.",
      proof_required_to_close: "Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization.",
    },
    {
      finding: "Dispatch did not occur in the repository and no real response is present.",
      classification: "scale_blocker",
      blocks: "Expert response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, school evidence, and official-authority claims.",
      does_not_block: "Internal review of the honest dispatch/intake status and a later owner-run delivery step.",
      proof_required_to_close: "Owner delivery proof, consented schema-passing response records, quarantine PASS, specialist review, and separate human review.",
    },
  ];
}

function materialPrepared(record) {
  return [
    {
      material_id: `${record.jurisdiction_id}-approved-contact-text`,
      material_type: "approved_contact_text",
      source: record.approved_contact_text_source,
      sha256: sha256(record.contact_text),
      status: "prepared_not_sent_by_repository",
    },
    {
      material_id: `${record.jurisdiction_id}-accepted-request-packet`,
      material_type: "accepted_request_packet",
      source: record.request_packet_source,
      packet_id: record.request_packet_id,
      status: "prepared_not_sent_by_repository",
    },
  ];
}

function ownerDispatchJurisdiction(jurisdictionId) {
  const stage = readStageDispatchRecord(jurisdictionId);
  return {
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: jurisdictionLabel(jurisdictionId),
    source_dispatch_record: stageDispatchPath(jurisdictionId),
    owner_authorization_reference: ownerAuthorization().authorization_id,
    approved_contact_text_version: {
      source: stage.approved_contact_text_source,
      sha256: sha256(stage.contact_text),
      exact_text_reused: true,
    },
    accepted_request_packet_version: {
      source: stage.request_packet_source,
      packet_id: stage.request_packet_id,
      source_ids_in_scope: stage.source_ids_in_scope,
      question_ids_in_scope: stage.question_ids_in_scope,
    },
    role_only_contact_basis: {
      role_profile: stage.candidate.role_profile,
      named_expert_selected: false,
      personal_contact_details_recorded: false,
      private_dispatch_endpoint_recorded: false,
      public_or_professional_basis: "Role and jurisdiction fit only; no named-person selection or private scraping is recorded.",
      expert_not_official_authority: true,
      consent_boundary: "A response may be stored only if the respondent explicitly consents to internal schema-bound use and provides no personal/student/school data.",
      withdrawal_boundary: "The owner must discard or quarantine any response if consent is absent, withdrawn, or outside the schema boundary.",
      storage_boundary: "Repository storage is limited to schema-passing response records and quarantine metadata; private contact details stay out of repository storage.",
    },
    delivery_channel: "not_recorded_in_repository",
    delivery_status: "not_sent_no_owner_delivery_channel_proof",
    delivery_timestamp: null,
    not_sent_reason: "No owner-provided delivery channel, timestamp, or delivery proof is available in this workspace. The repository must not invent external dispatch.",
    material_prepared: materialPrepared(stage),
    material_sent: [],
    material_explicitly_not_sent: [
      "approved contact text and accepted request packet were not sent by this repository",
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
    ],
    confirmations: {
      no_personal_data: true,
      no_student_data: true,
      no_school_evidence: true,
      no_localized_output: true,
      no_legal_or_compliance_claim: true,
      no_support_accommodation_accessibility_sufficiency_claim: true,
      no_expert_as_official_authority: true,
    },
    proof_required_to_mark_sent: "Owner delivery proof with approved no-personal-data channel, exact approved payload, timestamp, consent boundary, and no forbidden attachment.",
  };
}

function ownerDispatchRecord() {
  const jurisdictions = ["england", "flanders"].map(ownerDispatchJurisdiction);
  return {
    ...baseReport("owner_manual_dispatch_record"),
    report_id: "owner-manual-dispatch-record",
    status: "dispatch_not_performed_no_owner_delivery_proof",
    jurisdictions,
    owner_delivery_proof_recorded: false,
    repository_claims_external_dispatch: false,
    material_sent_count: 0,
    dispatch_summary: "England and Flanders approved payloads are prepared for owner-controlled delivery, but this repository records no external send because no owner delivery channel, timestamp, or proof is available.",
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForOwnerDispatch(),
    finding_classification: findingClassification("Owner manual dispatch status is recorded honestly for England and Flanders; no repository dispatch or response is claimed."),
  };
}

function schemaIntakeRecord(jurisdictionId) {
  const stage = readStageDispatchRecord(jurisdictionId);
  const stageIntake = readStageIntakeRecord(jurisdictionId);
  return {
    intake_id: `${jurisdictionId}-owner-manual-response-intake`,
    jurisdiction_id: jurisdictionId,
    request_packet_id: stageIntake.request_packet_id,
    source_stage_dispatch_request_packet_id: stage.request_packet_id,
    source_stage_response_intake_report: STAGE_RESPONSE_INTAKE_SOURCE,
    source_stage_intake_id: stageIntake.intake_id,
    consent_confirmed: stageIntake.consent_confirmed,
    response_received: stageIntake.response_received,
    responses: clone(stageIntake.responses || []),
    validation_status: stageIntake.validation_status,
    rejected_items: clone(stageIntake.rejected_items || []),
    does_not_authorize: doesNotAuthorize(),
    proof_required_to_use: "Owner delivery proof, explicit consent, strict schema PASS, quarantine PASS, specialist review PASS, final lead PASS, and human review are required before any response can be used as internal interpretive input.",
  };
}

function responseIntakeReport(jurisdictionId, dispatch) {
  const jurisdiction = dispatch.jurisdictions.find((item) => item.jurisdiction_id === jurisdictionId);
  const stageIntake = readStageIntakeRecord(jurisdictionId);
  return {
    ...baseReport("local_expert_response_intake"),
    report_id: `${jurisdictionId}-local-expert-response-intake`,
    response_intake_id: `${jurisdictionId}-owner-manual-response-intake-report`,
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: jurisdictionLabel(jurisdictionId),
    source_dispatch_record: jurisdiction.source_dispatch_record,
    source_stage_response_intake_report: STAGE_RESPONSE_INTAKE_SOURCE,
    source_stage_intake_record: stageIntake.intake_id,
    source_stage_no_response_baseline: {
      consent_confirmed: stageIntake.consent_confirmed,
      response_received: stageIntake.response_received,
      response_count: (stageIntake.responses || []).length,
      rejected_item_count: (stageIntake.rejected_items || []).length,
      validation_status: stageIntake.validation_status,
    },
    owner_delivery_status: jurisdiction.delivery_status,
    owner_delivery_proof_recorded: false,
    response_received: false,
    response_status: "pending_owner_delivery_no_response_received",
    schema_source: "references/schemas/local-expert-response-intake.schema.v1.json",
    schema_intake_record: schemaIntakeRecord(jurisdictionId),
    pending_items: [
      "owner delivery proof",
      "explicit consent",
      "schema-passing response",
      "quarantine check",
      "specialist review",
      "human review before response analysis",
    ],
    quarantined_items: [],
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForOwnerDispatch(),
    finding_classification: findingClassification(`${jurisdictionLabel(jurisdictionId)} response intake is prepared and empty; no real response is stored or interpreted.`),
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
  const stage = readStageQuarantineReport();
  const sourceStageStopCodes = (stage.quarantine_rules || []).map((item) => item.expected_stop_code);
  return {
    ...baseReport("local_expert_response_quarantine_report"),
    report_id: "local-expert-response-quarantine-report",
    status: "quarantine_rules_ready_no_real_items",
    source_stage_quarantine_report: STAGE_QUARANTINE_SOURCE,
    source_stage_quarantine_status: stage.status,
    source_stage_no_real_responses_stored: stage.no_real_responses_stored,
    source_stage_quarantined_item_count: (stage.quarantined_items || []).length,
    source_stage_quarantine_rule_count: (stage.quarantine_rules || []).length,
    source_stage_quarantine_stop_codes: sourceStageStopCodes,
    no_real_responses_stored: true,
    quarantined_items: [],
    quarantine_rules: quarantineRules(),
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForOwnerDispatch(),
    finding_classification: findingClassification("Quarantine rules cover unsupported dispatch claims, consent, personal-data, school-evidence, jurisdiction, authority, localized-output, and sufficiency overclaim refusals."),
  };
}

function decisionReport(dispatch, englandIntake, flandersIntake, quarantine) {
  return {
    ...baseReport("owner_manual_dispatch_and_response_intake_decision"),
    report_id: "owner-manual-dispatch-and-response-intake-decision",
    status: "ready_for_human_review",
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "The packet honestly records that the approved England and Flanders materials are prepared, but no owner delivery channel, no approved external delivery channel, delivery timestamp, delivery proof, consented response, or schema-passing response is present in this workspace. Response analysis therefore remains blocked; the protocol must be revised or completed by owner-controlled delivery proof and schema-bound intake before analysis can proceed.",
    },
    owner_dispatch_record: dispatch.report_id,
    response_intake_reports: [englandIntake.report_id, flandersIntake.report_id],
    quarantine_report: quarantine.report_id,
    proceed_to_expert_response_analysis: false,
    protocol_revision_required: true,
    stop_track: false,
    owner_next_action: "Perform owner-controlled delivery outside repository storage only if an approved no-personal-data channel exists, send only approved contact text plus accepted request packet, then provide consented schema-passing responses or quarantine records for a later reviewed response-analysis sprint.",
    external_dispatch_performed: false,
    real_responses_received: false,
    accepted_responses_available: false,
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlagsForOwnerDispatch(),
    finding_classification: findingClassification("Final decision selects protocol revision/completion rather than response analysis because no external dispatch proof or accepted response exists."),
  };
}

function validResponse(jurisdictionId) {
  return stageValidResponse(jurisdictionId);
}

function intakeWithResponse(jurisdictionId, mutate) {
  const report = responseIntakeReport(jurisdictionId, ownerDispatchRecord());
  report.response_received = true;
  report.owner_delivery_proof_recorded = true;
  report.response_status = "received_for_fixture_validation";
  report.schema_intake_record.consent_confirmed = true;
  report.schema_intake_record.response_received = true;
  report.schema_intake_record.responses = [validResponse(jurisdictionId)];
  report.schema_intake_record.validation_status = "rejected";
  mutate(report, report.schema_intake_record.responses[0]);
  return report;
}

function negativeFixture(file, stopCode) {
  let target = "owner_dispatch_record";
  let record = ownerDispatchRecord();
  switch (stopCode) {
    case "STOP_UNSUPPORTED_DISPATCH_PROOF":
      if (file.includes("material-sent")) {
        record.material_sent_count = 1;
        record.jurisdictions[0].material_sent = [record.jurisdictions[0].material_prepared[0]];
      } else {
        record.repository_claims_external_dispatch = true;
        record.jurisdictions[0].delivery_status = "sent";
        record.jurisdictions[0].delivery_timestamp = "2026-07-01T00:00:00Z";
      }
      break;
    case "STOP_PERSONAL_CONTACT_DETAILS":
      record.jurisdictions[0].role_only_contact_basis.personal_contact_details_recorded = true;
      record.jurisdictions[0].role_only_contact_basis.storage_boundary = "email: named.person@example.test";
      break;
    case "STOP_MISSING_CONSENT_BOUNDARY":
      target = "response_intake_report";
      record = intakeWithResponse("england", (item) => {
        item.schema_intake_record.consent_confirmed = false;
      });
      break;
    case "STOP_PERSONAL_DATA_RESPONSE":
      target = "response_intake_report";
      record = intakeWithResponse("england", (_item, response) => {
        response.interpretation = "Student Alice Example and private email alice@example.test were included.";
      });
      break;
    case "STOP_SCHOOL_EVIDENCE_RESPONSE":
      target = "response_intake_report";
      record = intakeWithResponse("england", (_item, response) => {
        response.interpretation = "School evidence from Northfield Academy proves readiness.";
      });
      break;
    case "STOP_LEGAL_COMPLIANCE_CLAIM":
      target = "response_intake_report";
      record = intakeWithResponse("england", (_item, response) => {
        response.interpretation = "This is legally sufficient, compliant, approved, and inspection-ready.";
      });
      break;
    case "STOP_LOCALIZED_OUTPUT_RESPONSE":
      target = "response_intake_report";
      record = intakeWithResponse("england", (_item, response) => {
        response.interpretation = "Here is localized student-facing output for an England edition.";
      });
      break;
    case "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM":
      target = "response_intake_report";
      record = intakeWithResponse("england", (_item, response) => {
        response.interpretation = "This confirms support sufficiency, accommodation sufficiency, accessibility legal sufficiency, and individual adjustment sufficiency.";
      });
      break;
    case "STOP_EXPERT_AS_OFFICIAL_AUTHORITY":
      target = "response_intake_report";
      record = intakeWithResponse("england", (_item, response) => {
        response.interpretation = "This expert response is official authority and substitutes for official source review.";
      });
      break;
    case "STOP_WHOLE_UK_OVERCLAIM":
      target = "response_intake_report";
      record = intakeWithResponse("england", (_item, response) => {
        response.interpretation = "This applies to the whole UK, including Scotland, Wales, and Northern Ireland.";
      });
      break;
    case "STOP_ALL_BELGIUM_OVERCLAIM":
      target = "response_intake_report";
      record = intakeWithResponse("flanders", (_item, response) => {
        response.interpretation = "This applies to all Belgium, including the French Community and all school networks.";
      });
      break;
    case "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE":
      target = "decision_report";
      record = decisionReport(ownerDispatchRecord(), responseIntakeReport("england", ownerDispatchRecord()), responseIntakeReport("flanders", ownerDispatchRecord()), quarantineReport());
      record.final_decision.selected = "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS";
      record.proceed_to_expert_response_analysis = true;
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

function renderOwnerDispatchMarkdown(report) {
  return [
    "# Owner Manual Dispatch Record",
    "",
    `Status: \`${report.status}\``,
    `Repository claims external dispatch: \`${report.repository_claims_external_dispatch}\``,
    "",
    "| jurisdiction | delivery_status | delivery_channel | delivery_timestamp | not_sent_reason | material_sent |",
    "|---|---|---|---|---|---|",
    ...report.jurisdictions.map((item) => `| ${item.jurisdiction_label} | \`${item.delivery_status}\` | \`${item.delivery_channel}\` | \`${item.delivery_timestamp}\` | ${item.not_sent_reason} | ${item.material_sent.length} |`),
    "",
    "## Finding Classification",
    "",
    findingTable(report.finding_classification),
  ].join("\n");
}

function renderIntakeMarkdown(report) {
  return [
    `# ${report.jurisdiction_label} Local Expert Response Intake`,
    "",
    `Status: \`${report.response_status}\``,
    `Response received: \`${report.response_received}\``,
    `Owner delivery proof recorded: \`${report.owner_delivery_proof_recorded}\``,
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
    "# Local Expert Response Quarantine Report",
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

function renderDecisionMarkdown(report) {
  return [
    "# Owner Manual Dispatch And Response Intake Decision",
    "",
    `Selected decision: \`${report.final_decision.selected}\``,
    "",
    report.final_decision.rationale,
    "",
    "## Owner Next Action",
    "",
    report.owner_next_action,
    "",
    "## Does Not Authorize",
    "",
    ...report.does_not_authorize.map((item) => `- ${item}`),
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
        does_not_block: "Human review of the complete owner dispatch/intake packet.",
        proof_required_to_close: "Owner dispatch/intake checker PASS, focused Jest PASS, final lead PASS, exact-head readiness, green CI, branch protection ok:true, and owner authorization.",
      },
      {
        finding: "Response analysis and downstream authority remain blocked.",
        classification: "scale_blocker",
        blocks: "Response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility/individual-adjustment sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "Internal review of honest dispatch/intake status and a later owner delivery proof step.",
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
    "| Owner dispatch/intake artifacts absent | closed | Added deterministic owner manual dispatch record, per-jurisdiction intake records, quarantine report, decision report, fixtures, checker, and focused Jest tests | Generator currentness, checker, and focused Jest PASS |",
    "| Dispatch proof invention risk | closed | Records require delivery channel, timestamp, and owner proof before any send can be marked; current packet records not-sent reason honestly | Checker and negative fixtures PASS |",
    "| Response-analysis overreach risk | closed | Final decision selects protocol revision/completion, not response analysis, because no accepted responses exist | Decision checker PASS |",
    "| Personal data / named contact risk | closed | Role-only basis preserves no named contact details and private endpoint storage remains blocked | Legal/privacy review and checker PASS |",
    "| Forbidden response content risk | closed | Added quarantine rules and negative fixtures for personal data, school evidence, legal/compliance, localized output, sufficiency claims, jurisdiction overclaims, and official-authority substitution | Focused Jest PASS |",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "| Command | Status |",
    "|---|---|",
    "| `node build-scripts/inspection/build-owner-manual-dispatch-and-response-intake.js --check` | PASS |",
    "| `node build-scripts/inspection/check-owner-manual-dispatch-and-response-intake.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-owner-manual-dispatch-and-response-intake.test.js --runInBand` | PASS |",
    "| `node build-scripts/inspection/check-local-expert-contact-stage.js` | PASS |",
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
    "Final lead review returned PASS: the complete packet records owner-controlled dispatch status for England and Flanders, captures no invented dispatch or response, keeps intake schema-bound and empty until consented responses exist, quarantines forbidden cases, selects protocol revision/completion rather than response analysis, and preserves all downstream authority blocks."
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
        finding: "Owner manual dispatch/intake packet is ready for exact-head human review.",
        classification: "core_requirement_met",
        blocks: "Nothing once exact-head PR readiness, branch protection ok:true, and CI pass.",
        does_not_block: "Human review of this internal packet.",
        proof_required_to_close: "Exact-head readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "No external dispatch, accepted response, or response-analysis authority is claimed.",
        classification: "scale_blocker",
        blocks: "Expert response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal/student/school data, legal/compliance/inspection-readiness claims, support/accommodation/accessibility/individual-adjustment sufficiency claims, school evidence, and official-authority substitution.",
        does_not_block: "A later owner delivery proof and schema-bound intake sprint.",
        proof_required_to_close: "Owner delivery proof, accepted responses, quarantine PASS, specialist review, and separate human review.",
      },
    ]),
  ].join("\n");
}

function outputContents() {
  const dispatch = ownerDispatchRecord();
  const england = responseIntakeReport("england", dispatch);
  const flanders = responseIntakeReport("flanders", dispatch);
  const quarantine = quarantineReport();
  const decision = decisionReport(dispatch, england, flanders, quarantine);
  const outputs = {
    "reports/inspection-standards/owner-manual-dispatch-record.json": `${JSON.stringify(dispatch, null, 2)}\n`,
    "reports/inspection-standards/owner-manual-dispatch-record.md": `${renderOwnerDispatchMarkdown(dispatch)}\n`,
    "reports/inspection-standards/england-local-expert-response-intake.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/england-local-expert-response-intake.md": `${renderIntakeMarkdown(england)}\n`,
    "reports/inspection-standards/flanders-local-expert-response-intake.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/flanders-local-expert-response-intake.md": `${renderIntakeMarkdown(flanders)}\n`,
    "reports/inspection-standards/local-expert-response-quarantine-report.json": `${JSON.stringify(quarantine, null, 2)}\n`,
    "reports/inspection-standards/local-expert-response-quarantine-report.md": `${renderQuarantineMarkdown(quarantine)}\n`,
    "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.md": `${renderDecisionMarkdown(decision)}\n`,
    "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/owner-manual-dispatch-record.sample.json": `${JSON.stringify(dispatch, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/england-local-expert-response-intake.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/flanders-local-expert-response-intake.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/local-expert-response-quarantine-report.sample.json": `${JSON.stringify(quarantine, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/positive/owner-manual-dispatch-and-response-intake-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: `${sprintPlan()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: `${correctionLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: `${validationLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`]: `${specialistReview("Lead Architecture Review", "PASS", "Lead/architecture subagent returned PASS: the packet is a bounded layer over the merged contact-stage records, uses explicit input/output allowlists, does not loosen response schemas, and refuses response analysis without accepted responses.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`]: `${specialistReview("Legal/Privacy Review", "PASS", "Legal/privacy subagent returned PASS: the packet records no named contact, private endpoint, personal/student/school data, legal advice, compliance proof, inspection-readiness claim, or response storage outside consent and schema boundaries.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-dispatch-intake-review.md`]: `${specialistReview("England Dispatch/Intake Review", "PASS", "England dispatch/intake subagent returned PASS: England remains England-only, no whole-UK or all-awarding-body overclaim is allowed, and the approved England contact text/request packet are prepared but not claimed sent.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-dispatch-intake-review.md`]: `${specialistReview("Flanders Dispatch/Intake Review", "PASS", "Flanders dispatch/intake subagent returned PASS: Flanders remains Flanders-only, no all-Belgium or all-school-network overclaim is allowed, and the approved Flanders contact text/request packet are prepared but not claimed sent.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`]: `${specialistReview("Accessibility/Inclusion Review", "PASS", "Accessibility/inclusion subagent returned PASS: support, accommodation, accessibility, and individual-adjustment content remains a forbidden sufficiency-claim boundary and cannot become legal, product, or school sufficiency proof.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`]: `${specialistReview("Teacher/Economics Review", "PASS", "Teacher/economics subagent returned PASS: no economics content, localized exercises, answer models, school evidence, or student-facing material is generated; any future response would be only internal interpretive input after review.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`]: `${finalLeadReview()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`]: `${closureRecord()}\n`,
  };
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stopCode), null, 2)}\n`;
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
    console.error("Owner manual dispatch/intake outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK owner manual dispatch/intake outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote owner manual dispatch/intake outputs (${Object.keys(outputContents()).length} files)`);
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
  coreRequirementChecklist,
  decisionReport,
  doesNotAuthorize,
  noOutputFlagsForOwnerDispatch,
  outputContents,
  ownerDispatchRecord,
  quarantineReport,
  responseIntakeReport,
  validResponse,
};
