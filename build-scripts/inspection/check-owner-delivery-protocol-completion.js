#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  ACCEPTED_INPUT_DECISION,
  DECISION_OPTIONS,
  DELIVERY_STATUS_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  QUARANTINE_RULES,
  SELECTED_DECISION,
  SPRINT_ID,
  noOutputFlagsForDeliveryCompletion,
  outputContents,
  ownerDeliveryChannelProof: expectedDeliveryChannelProof,
} = require("./build-owner-delivery-protocol-completion.js");
const { validateReviewFile } = require("./check-local-expert-contact-stage.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-owner-delivery-protocol-completion.js";
const PRIOR_DECISION = "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.json";
const PRIOR_OWNER_DISPATCH = "reports/inspection-standards/owner-manual-dispatch-record.json";
const PRIOR_ENGLAND_INTAKE = "reports/inspection-standards/england-local-expert-response-intake.json";
const PRIOR_FLANDERS_INTAKE = "reports/inspection-standards/flanders-local-expert-response-intake.json";
const PRIOR_QUARANTINE = "reports/inspection-standards/local-expert-response-quarantine-report.json";
const PROOF = "reports/inspection-standards/owner-delivery-channel-proof.json";
const ENGLAND = "reports/inspection-standards/england-owner-delivery-and-response-intake.json";
const FLANDERS = "reports/inspection-standards/flanders-owner-delivery-and-response-intake.json";
const QUARANTINE = "reports/inspection-standards/owner-delivery-response-quarantine-report.json";
const DECISION = "reports/inspection-standards/owner-delivery-protocol-completion-decision.json";

const REQUIRED_REPORTS = [PROOF, ENGLAND, FLANDERS, QUARANTINE, DECISION];
const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const REQUIRED_AUTHORITY_FRAGMENTS = [
  "localized output",
  "country editions",
  "student-facing output",
  "teacher/school-facing output",
  "public output",
  "evidence packs",
  "product-route adoption",
  "Scale Gate",
  "diagnostics/mastery/PV",
  "personal/student/school data",
  "named expert selection",
  "private contact-detail storage",
  "legal advice",
  "compliance proof",
  "inspection-readiness",
  "support sufficiency",
  "accommodation sufficiency",
  "accessibility/legal sufficiency",
  "school-owned evidence",
  "official authority",
  "expert response analysis",
  "invented owner delivery proof",
];

const RESPONSE_INTAKE_REQUIRED = [
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

const RESPONSE_INTAKE_ALLOWED = new Set(RESPONSE_INTAKE_REQUIRED);
const RESPONSE_INTAKE_STATUS = new Set([
  "no_response_yet",
  "accepted_simulation",
  "accepted_for_internal_review",
  "rejected",
]);
const RESPONSE_REQUIRED = [
  "reviewer_role",
  "jurisdiction",
  "source_id",
  "source_state_seen",
  "question_id",
  "answer_type",
  "interpretation",
  "confidence",
  "uncertainty",
  "cited_source",
  "forbidden_claims_disclaimed",
  "does_not_authorize",
  "proof_required_to_use",
];
const RESPONSE_ALLOWED = new Set(RESPONSE_REQUIRED);
const RESPONSE_ANSWER_TYPES = new Set([
  "bounded_interpretation",
  "uncertainty_flag",
  "citation_correction",
  "out_of_scope",
]);
const RESPONSE_CONFIDENCE = new Set(["high", "medium", "low", "cannot_answer"]);

const ALLOWED_FINDING_CLASSIFICATIONS = new Set([
  "core_requirement_met",
  "quality_improvement_available",
  "minor_carry_flag",
  "scale_blocker",
  "core_spec_failure",
]);

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function runNode(args) {
  return childProcess.spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
}

function fail(failures) {
  console.error("Owner delivery protocol-completion check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function acceptedDecision() {
  return (readJson(PRIOR_DECISION).final_decision || {}).selected;
}

function validateFindingClassifications(items, context) {
  const failures = [];
  if (!Array.isArray(items) || items.length === 0) return [`${context}: finding_classification must contain at least one row`];
  for (const [index, item] of items.entries()) {
    if (!ALLOWED_FINDING_CLASSIFICATIONS.has(item.classification)) {
      failures.push(`${context}: finding_classification[${index}] invalid classification ${item.classification}`);
    }
    for (const field of ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(item[field])) failures.push(`${context}: finding_classification[${index}] missing ${field}`);
    }
  }
  return failures;
}

function validateFlags(report) {
  const failures = [];
  const expected = noOutputFlagsForDeliveryCompletion();
  if (!report.no_output_flags) return ["no_output_flags missing"];
  for (const [flag, value] of Object.entries(expected)) {
    if (report.no_output_flags[flag] !== value) failures.push(`${flag} must be ${value}`);
  }
  for (const flag of [
    "external_contact_dispatch_performed",
    "owner_delivery_channel_configured",
    "owner_delivery_proof_recorded",
    "owner_material_sent",
    "owner_response_received",
    "accepted_response_available",
    "response_analysis_authorized",
    "expert_response_analysis_authorized",
    "approved_delivery_channel_exists",
  ]) {
    if (report.no_output_flags[flag] !== false) failures.push(`${flag} must be false`);
  }
  if (report.no_output_flags.delivery_protocol_revision_required !== true) failures.push("delivery_protocol_revision_required must be true");
  return failures;
}

function validateCommon(report, expectedType) {
  const failures = [];
  if (report.schema_version !== 1) failures.push("schema_version must be 1");
  if (report.report_type !== expectedType) failures.push(`report_type must be ${expectedType}`);
  if (report.sprint_id !== SPRINT_ID) failures.push("sprint_id mismatch");
  if (report.internal_only !== true) failures.push("internal_only must be true");
  if (report.manual_invocation_only !== true) failures.push("manual_invocation_only must be true");
  if (report.human_review_required !== true) failures.push("human_review_required must be true");
  if (!String(report.product_end_state || "").includes("product-end-state.md")) failures.push("product end-state citation missing");
  if (!String(report.original_sprint_gate_spec || "").includes(SPRINT_ID)) failures.push("original sprint/gate spec citation missing");
  if (acceptedDecision() !== ACCEPTED_INPUT_DECISION) failures.push(`${PRIOR_DECISION}: selected decision mismatch`);
  if (report.accepted_input_decision !== ACCEPTED_INPUT_DECISION) failures.push("accepted input decision mismatch");
  if (report.accepted_input_decision_source !== PRIOR_DECISION) failures.push("accepted input decision source mismatch");
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push("input_allowlist mismatch");
  if (!sameList(report.output_allowlist, OUTPUT_ALLOWLIST)) failures.push("output_allowlist mismatch");
  if (!report.owner_authorization || report.owner_authorization.accepted_decision !== ACCEPTED_INPUT_DECISION) failures.push("owner authorization missing or decision mismatch");
  for (const id of [
    "owner_delivery_channel_proof_recorded",
    "england_delivery_status_recorded",
    "flanders_delivery_status_recorded",
    "strict_response_schema_boundary",
    "quarantine_rules_cover_real_and_absent_responses",
    "automatic_decision_logic",
    "no_invented_delivery_or_response",
    "downstream_authority_blocked",
    "review_route_preserved",
  ]) {
    if (!(report.core_requirement_checklist || []).some((item) => item.id === id && item.status === "met")) {
      failures.push(`core requirement missing or unmet: ${id}`);
    }
  }
  const authorityText = JSON.stringify(report.does_not_authorize || report.owner_authorization || {});
  for (const fragment of REQUIRED_AUTHORITY_FRAGMENTS) {
    if (!authorityText.includes(fragment)) failures.push(`authority boundary missing ${fragment}`);
  }
  failures.push(...validateFindingClassifications(report.finding_classification, report.report_id || expectedType));
  failures.push(...validateFlags(report));
  return failures;
}

function sourcePriorDispatchJurisdiction(jurisdictionId) {
  const source = readJson(PRIOR_OWNER_DISPATCH).jurisdictions || [];
  return source.find((item) => item.jurisdiction_id === jurisdictionId);
}

function validateDeliveryChannelJurisdiction(item) {
  const failures = [];
  if (!["england", "flanders"].includes(item.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  const source = sourcePriorDispatchJurisdiction(item.jurisdiction_id);
  if (!source) failures.push(`${PRIOR_OWNER_DISPATCH}: missing ${item.jurisdiction_id}`);
  if (source) {
    if (item.approved_contact_text_version.source !== source.approved_contact_text_version.source) failures.push("approved contact text source mismatch");
    if (item.accepted_request_packet_version.source !== source.accepted_request_packet_version.source) failures.push("request packet source mismatch");
  }
  if (item.delivery_channel_class !== "none_recorded") failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (item.approved_delivery_channel_exists !== false) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (item.delivery_timestamp !== null) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (item.delivery_proof !== null) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (!String(item.not_sent_reason || "").includes("must not invent dispatch")) failures.push("not_sent_reason must refuse invented dispatch");
  if (!Array.isArray(item.material_sent) || item.material_sent.length !== 0) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  const boundaryText = JSON.stringify(item).toLowerCase();
  for (const fragment of ["no_personal_data", "no_student_data", "no_school_evidence", "no_localized_output", "no_named_expert"]) {
    if (!boundaryText.includes(fragment)) failures.push(`delivery boundary missing ${fragment}`);
  }
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(boundaryText)) failures.push("STOP_PERSONAL_CONTACT_DETAILS");
  return failures;
}

function validateDeliveryChannelProof(report) {
  const failures = validateCommon(report, "owner_delivery_channel_proof");
  if (report.status !== "no_owner_delivery_channel_proof_recorded") failures.push("owner delivery-channel proof status mismatch");
  if (report.source_prior_owner_dispatch_record !== PRIOR_OWNER_DISPATCH) failures.push("prior owner dispatch source mismatch");
  if (report.source_prior_decision !== PRIOR_DECISION) failures.push("prior decision source mismatch");
  if (report.prior_decision_selected !== ACCEPTED_INPUT_DECISION) failures.push("prior selected decision mismatch");
  if (report.approved_delivery_channel_exists !== false) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.owner_delivery_proof_recorded !== false) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.repository_claims_external_dispatch !== false) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.material_sent_count !== 0) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  const jurisdictions = report.jurisdictions || [];
  if (jurisdictions.length !== 2) failures.push("must include England and Flanders delivery proof states");
  for (const item of jurisdictions) failures.push(...validateDeliveryChannelJurisdiction(item));
  return failures;
}

function priorIntake(jurisdictionId) {
  return readJson(jurisdictionId === "england" ? PRIOR_ENGLAND_INTAKE : PRIOR_FLANDERS_INTAKE);
}

function responseText(report) {
  return JSON.stringify([
    report.schema_intake_record && report.schema_intake_record.responses,
    report.schema_intake_record && report.schema_intake_record.rejected_items,
  ]).toLowerCase();
}

function validateResponseText(report) {
  const failures = [];
  const text = responseText(report);
  if (/personal data|student named|student data|named pupil/.test(text)) failures.push("STOP_PERSONAL_DATA_RESPONSE");
  if (/school evidence|school-owned|named school|school inspection evidence|network-owned evidence|school network evidence|evidence from a school network/.test(text)) failures.push("STOP_SCHOOL_EVIDENCE_RESPONSE");
  if (/legal advice|compliance proof|legally sufficient|compliant/.test(text)) failures.push("STOP_LEGAL_COMPLIANCE_CLAIM");
  if (/inspection readiness|inspection-ready|exam approval|approved by|product approval|ok inspection quality evidence.*approval|quality evidence.*product approval/.test(text)) failures.push("STOP_INSPECTION_EXAM_APPROVAL_CLAIM");
  if (/localized student-facing output|localized output|country edition/.test(text)) failures.push("STOP_LOCALIZED_OUTPUT_RESPONSE");
  if (/support sufficiency|accommodation sufficiency|accessibility sufficiency|accessibility\/legal sufficiency|legal sufficiency|individual[- ]adjustment sufficiency/.test(text)) failures.push("STOP_SUPPORT_ACCOMMODATION_OVERCLAIM");
  if (/official authority|substitutes? for official|expert feedback is official/.test(text)) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  if (report.jurisdiction_id === "england" && /whole uk|scotland|wales|northern ireland|all awarding bodies/.test(text)) failures.push("STOP_WHOLE_UK_OVERCLAIM");
  if (report.jurisdiction_id === "flanders" && /all belgium|french community|german-speaking community|all school networks/.test(text)) failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
  return failures;
}

function validateSchemaIntakeRecord(record, context) {
  const failures = [];
  if (!record || typeof record !== "object" || Array.isArray(record)) return [`${context}: schema_intake_record must be an object`];
  for (const key of Object.keys(record)) {
    if (!RESPONSE_INTAKE_ALLOWED.has(key)) failures.push(`${context}: unexpected schema_intake_record field ${key}`);
  }
  for (const key of RESPONSE_INTAKE_REQUIRED) {
    if (!(key in record)) failures.push(`${context}: schema_intake_record missing ${key}`);
  }
  for (const key of ["intake_id", "request_packet_id", "proof_required_to_use"]) {
    if (!nonEmptyString(record[key])) failures.push(`${context}: schema_intake_record.${key} must be a non-empty string`);
  }
  if (!["england", "flanders"].includes(record.jurisdiction_id)) failures.push(`${context}: schema_intake_record.jurisdiction_id invalid`);
  if (typeof record.consent_confirmed !== "boolean") failures.push(`${context}: schema_intake_record.consent_confirmed must be boolean`);
  if (typeof record.response_received !== "boolean") failures.push(`${context}: schema_intake_record.response_received must be boolean`);
  if (!Array.isArray(record.responses)) failures.push(`${context}: schema_intake_record.responses must be an array`);
  if (!RESPONSE_INTAKE_STATUS.has(record.validation_status)) failures.push(`${context}: schema_intake_record.validation_status invalid`);
  if (!Array.isArray(record.rejected_items)) failures.push(`${context}: schema_intake_record.rejected_items must be an array`);
  if (!Array.isArray(record.does_not_authorize) || record.does_not_authorize.length < 10) failures.push(`${context}: schema_intake_record.does_not_authorize must contain at least 10 items`);
  if (record.response_received === true && record.consent_confirmed !== true) failures.push("STOP_MISSING_CONSENT_BOUNDARY");
  for (const [index, response] of (record.responses || []).entries()) {
    if (!response || typeof response !== "object" || Array.isArray(response)) {
      failures.push(`${context}: responses[${index}] must be an object`);
      continue;
    }
    for (const key of Object.keys(response)) {
      if (!RESPONSE_ALLOWED.has(key)) failures.push(`${context}: responses[${index}] unexpected field ${key}`);
    }
    for (const key of RESPONSE_REQUIRED) {
      if (!(key in response)) failures.push(`${context}: responses[${index}] missing ${key}`);
    }
    for (const key of ["reviewer_role", "source_id", "source_state_seen", "question_id", "interpretation", "cited_source", "proof_required_to_use"]) {
      if (!nonEmptyString(response[key])) failures.push(`${context}: responses[${index}].${key} must be a non-empty string`);
    }
    if (!["england", "flanders"].includes(response.jurisdiction)) failures.push(`${context}: responses[${index}].jurisdiction invalid`);
    if (!RESPONSE_ANSWER_TYPES.has(response.answer_type)) failures.push(`${context}: responses[${index}].answer_type invalid`);
    if (!RESPONSE_CONFIDENCE.has(response.confidence)) failures.push(`${context}: responses[${index}].confidence invalid`);
    if (typeof response.uncertainty !== "string") failures.push(`${context}: responses[${index}].uncertainty must be string`);
    if (response.forbidden_claims_disclaimed !== true) failures.push(`${context}: responses[${index}].forbidden_claims_disclaimed must be true`);
    if (!Array.isArray(response.does_not_authorize) || response.does_not_authorize.length < 10) failures.push(`${context}: responses[${index}].does_not_authorize must contain at least 10 items`);
  }
  return failures;
}

function narrativeSafetyText(report) {
  const rows = (report.finding_classification || []).map((item) => [
    item.finding,
    item.does_not_block,
    item.proof_required_to_close,
  ].join(" "));
  return [
    report.owner_next_action,
    report.final_decision && report.final_decision.rationale,
    report.proof_required_to_close,
    ...rows,
  ].filter(Boolean).join(" ").toLowerCase();
}

function validateNarrativeSafety(report) {
  const failures = [];
  const text = narrativeSafetyText(report);
  if (/expert (feedback|response) is official authority|expert feedback as official authority/.test(text)) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  if (/absent responses? (are|as) approval|missing responses? (are|as) approval|treats? (pending or )?absent responses? as approval/.test(text)) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  if (/product approval|ok inspection quality evidence.*approval|quality evidence.*product approval/.test(text)) failures.push("STOP_INSPECTION_EXAM_APPROVAL_CLAIM");
  return failures;
}

function validateDeliveryAndResponseIntake(report) {
  const failures = validateCommon(report, "owner_delivery_and_response_intake");
  if (!["england", "flanders"].includes(report.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  const source = priorIntake(report.jurisdiction_id);
  if (report.source_owner_delivery_channel_proof !== PROOF) failures.push("source owner delivery-channel proof mismatch");
  if (report.source_prior_response_intake_report !== (report.jurisdiction_id === "england" ? PRIOR_ENGLAND_INTAKE : PRIOR_FLANDERS_INTAKE)) failures.push("prior intake source mismatch");
  if (report.source_prior_schema_intake_record !== source.schema_intake_record.intake_id) failures.push("prior schema intake id mismatch");
  if (!sameList(report.allowed_delivery_statuses, DELIVERY_STATUS_OPTIONS)) failures.push("delivery status options mismatch");
  if (!DELIVERY_STATUS_OPTIONS.includes(report.delivery_status)) failures.push("delivery status is outside allowed vocabulary");
  if (report.delivery_status !== "not_sent_no_safe_channel") failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.owner_delivery_proof_recorded !== false) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.delivery_channel_class !== "none_recorded") failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.delivery_timestamp !== null) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (!Array.isArray(report.material_sent) || report.material_sent.length !== 0) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.response_received !== false) {
    if (!report.schema_intake_record || report.schema_intake_record.consent_confirmed !== true) failures.push("STOP_MISSING_CONSENT_BOUNDARY");
  }
  if (report.response_received !== false) failures.push("real response must not be present in this packet");
  if (report.response_status !== "no_response_yet") failures.push("response status must be no_response_yet");
  if (report.accepted_response_available !== false) failures.push("accepted response must be absent");
  if (report.response_schema_status !== "no_response_yet") failures.push("response schema status must be no_response_yet");
  if (!Array.isArray(report.pending_items) || report.pending_items.length < 6) failures.push("pending_items incomplete");
  if (!Array.isArray(report.quarantined_items) || report.quarantined_items.length !== 0) failures.push("quarantined_items must be empty without real responses");
  const intake = report.schema_intake_record || {};
  failures.push(...validateSchemaIntakeRecord(intake, report.report_id || report.jurisdiction_id));
  if (intake.consent_confirmed !== source.schema_intake_record.consent_confirmed) failures.push("schema consent baseline mismatch");
  if (intake.response_received !== source.schema_intake_record.response_received) failures.push("schema response baseline mismatch");
  if (!sameList((intake.responses || []), (source.schema_intake_record.responses || []))) failures.push("schema responses baseline mismatch");
  if (intake.validation_status !== source.schema_intake_record.validation_status) failures.push("schema validation baseline mismatch");
  const boundary = JSON.stringify(report.jurisdiction_boundary || {}).toLowerCase();
  if (report.jurisdiction_id === "england" && !boundary.includes("not the whole uk")) failures.push("England boundary missing whole-UK refusal");
  if (report.jurisdiction_id === "england" && !boundary.includes("all awarding bodies")) failures.push("England boundary missing all-awarding-bodies refusal");
  if (report.jurisdiction_id === "flanders" && !boundary.includes("not all belgium")) failures.push("Flanders boundary missing all-Belgium refusal");
  failures.push(...validateResponseText(report));
  failures.push(...validateNarrativeSafety(report));
  return failures;
}

function validateQuarantineReport(report) {
  const failures = validateCommon(report, "owner_delivery_response_quarantine_report");
  const source = readJson(PRIOR_QUARANTINE);
  if (report.source_prior_quarantine_report !== PRIOR_QUARANTINE) failures.push("prior quarantine source mismatch");
  if (report.source_prior_quarantine_status !== source.status) failures.push("prior quarantine status mismatch");
  if (report.no_real_responses_stored !== true) failures.push("no_real_responses_stored must be true");
  if (!Array.isArray(report.quarantined_items) || report.quarantined_items.length !== 0) failures.push("quarantined_items must stay empty");
  const expectedRules = QUARANTINE_RULES.map(([ruleId, stopCode]) => `${ruleId}:${stopCode}`);
  const actualRules = (report.quarantine_rules || []).map((item) => `${item.rule_id}:${item.expected_stop_code}`);
  if (!sameList(actualRules, expectedRules)) failures.push("quarantine rules mismatch");
  const absent = report.absent_response_items || [];
  if (absent.length !== 2 || absent.some((item) => item.quarantine_category !== "no_response_yet")) failures.push("absent no-response carry missing");
  return failures;
}

function validateDecisionReport(report, proof, england, flanders, quarantine) {
  const failures = validateCommon(report, "owner_delivery_protocol_completion_decision");
  const derived = deriveDecision(proof, england, flanders, quarantine);
  if ((report.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if ((report.final_decision || {}).selected !== derived.selected) failures.push(`selected decision must be derived from state: ${derived.selected}`);
  if (!sameList((report.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (report.owner_delivery_channel_proof !== proof.report_id) failures.push("owner delivery-channel proof id mismatch");
  if (!sameList(report.response_intake_reports, [england.report_id, flanders.report_id])) failures.push("response intake report ids mismatch");
  if (report.quarantine_report !== quarantine.report_id) failures.push("quarantine report id mismatch");
  if (report.proceed_to_expert_response_analysis !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_DELIVERY_PROOF");
  if (report.protocol_revision_required !== true) failures.push("protocol_revision_required must be true");
  if (report.external_dispatch_performed !== false) failures.push("STOP_UNSUPPORTED_DELIVERY_PROOF");
  if (report.real_responses_received !== false || report.accepted_responses_available !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_DELIVERY_PROOF");
  if (JSON.stringify(report.decision_logic || []) !== JSON.stringify(derived.decision_logic)) failures.push("decision logic rows must be recomputed from current state");
  const text = JSON.stringify(report).toLowerCase();
  for (const fragment of ["no owner delivery proof", "schema-passing response", "revise_delivery_protocol", "rather than proceed to expert response analysis"]) {
    if (!text.includes(fragment)) failures.push(`decision boundary missing ${fragment}`);
  }
  failures.push(...validateNarrativeSafety(report));
  return failures;
}

function deriveDecision(proof, england, flanders, quarantine) {
  const intakes = [england, flanders];
  const noProof = proof.owner_delivery_proof_recorded === false || proof.approved_delivery_channel_exists === false;
  const responsePending = intakes.some((item) => item.delivery_status === "sent_response_pending" || (item.response_received === false && item.owner_delivery_proof_recorded === true));
  const quarantined = (quarantine.quarantined_items || []).length > 0 || intakes.some((item) => item.delivery_status === "sent_response_quarantined");
  const schemaPassing = intakes.some((item) => item.delivery_status === "sent_response_received_schema_pass" && item.accepted_response_available === true && item.response_schema_status === "accepted_for_internal_review");
  const decision_logic = [
    {
      rule: "If no delivery proof exists -> REVISE_DELIVERY_PROTOCOL.",
      observed: noProof,
      selected_when_true: "REVISE_DELIVERY_PROTOCOL",
    },
    {
      rule: "If delivery happened but no response exists -> REVISE_DELIVERY_PROTOCOL or response-pending carry, not analysis.",
      observed: responsePending,
      selected_when_true: "REVISE_DELIVERY_PROTOCOL",
    },
    {
      rule: "If response exists but fails schema/quarantine -> REVISE_DELIVERY_PROTOCOL.",
      observed: quarantined,
      selected_when_true: "REVISE_DELIVERY_PROTOCOL",
    },
    {
      rule: "If at least one useful, consented, schema-passing response exists and all unsafe material is quarantined -> PROCEED_TO_EXPERT_RESPONSE_ANALYSIS.",
      observed: schemaPassing && !noProof && !quarantined,
      selected_when_true: "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS",
    },
  ];
  let selected = "STOP_LOCAL_EXPERT_CONTACT_TRACK";
  if (noProof || responsePending || quarantined) selected = "REVISE_DELIVERY_PROTOCOL";
  else if (schemaPassing) selected = "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS";
  return { selected, decision_logic };
}

function validateNegativeFixture(fixture, expectedStopCode) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: stop code mismatch`);
  let validationFailures = [];
  if (fixture.fixture_target === "owner_delivery_channel_proof") validationFailures = validateDeliveryChannelProof(fixture.record);
  else if (fixture.fixture_target === "owner_delivery_and_response_intake") validationFailures = validateDeliveryAndResponseIntake(fixture.record);
  else if (fixture.fixture_target === "owner_delivery_protocol_completion_decision") {
    validationFailures = validateDecisionReport(
      fixture.record,
      readJson(PROOF),
      readJson(ENGLAND),
      readJson(FLANDERS),
      readJson(QUARANTINE)
    );
  } else failures.push(`${fixture.fixture_name}: unknown fixture_target ${fixture.fixture_target}`);
  if (!validationFailures.includes(expectedStopCode)) {
    failures.push(`${fixture.fixture_name}: expected ${expectedStopCode}; got ${validationFailures.join(", ") || "no failures"}`);
  }
  return failures;
}

function checkGeneratorCurrentness(failures) {
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) failures.push(`generator --check failed: ${result.stderr || result.stdout}`);
}

function checkOutputAllowlist(failures) {
  const actual = Object.keys(outputContents());
  if (!sameList(actual, OUTPUT_ALLOWLIST)) failures.push("outputContents keys do not match OUTPUT_ALLOWLIST exactly");
}

function checkExpectedProofParity(failures) {
  const expected = expectedDeliveryChannelProof();
  const actual = readJson(PROOF);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push("owner delivery-channel proof drifted from generator");
}

function checkPriorInputs(failures) {
  if (acceptedDecision() !== ACCEPTED_INPUT_DECISION) failures.push(`${PRIOR_DECISION}: final decision must be ${ACCEPTED_INPUT_DECISION}`);
  const prior = readJson(PRIOR_OWNER_DISPATCH);
  if (prior.owner_delivery_proof_recorded !== false) failures.push(`${PRIOR_OWNER_DISPATCH}: prior owner delivery proof must be absent`);
  if (prior.repository_claims_external_dispatch !== false) failures.push(`${PRIOR_OWNER_DISPATCH}: prior repository dispatch claim must be false`);
  for (const file of [PRIOR_ENGLAND_INTAKE, PRIOR_FLANDERS_INTAKE]) {
    const item = readJson(file);
    if (item.response_received !== false) failures.push(`${file}: response_received must be false`);
    if (((item.schema_intake_record || {}).responses || []).length !== 0) failures.push(`${file}: responses must be empty`);
  }
}

function checkOutputs(failures) {
  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }
  const proof = readJson(PROOF);
  const england = readJson(ENGLAND);
  const flanders = readJson(FLANDERS);
  const quarantine = readJson(QUARANTINE);
  const decision = readJson(DECISION);

  failures.push(...validateDeliveryChannelProof(proof));
  failures.push(...validateDeliveryAndResponseIntake(england));
  failures.push(...validateDeliveryAndResponseIntake(flanders));
  failures.push(...validateQuarantineReport(quarantine));
  failures.push(...validateDecisionReport(decision, proof, england, flanders, quarantine));

  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const fixture = readJson(`references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/${file}`);
    failures.push(...validateNegativeFixture(fixture, stopCode));
  }
  for (const relativePath of REQUIRED_REVIEW_FILES) failures.push(...validateReviewFile(relativePath));
  checkExpectedProofParity(failures);
}

function main() {
  const failures = [];
  checkGeneratorCurrentness(failures);
  checkOutputAllowlist(failures);
  checkPriorInputs(failures);
  checkOutputs(failures);
  if (failures.length) fail(failures);
  console.log(`OK owner delivery protocol-completion (${REQUIRED_REPORTS.length} reports, ${NEGATIVE_FIXTURES.length} negative fixtures)`);
}

if (require.main === module) main();

module.exports = {
  validateDecisionReport,
  validateDeliveryAndResponseIntake,
  validateDeliveryChannelProof,
  validateNegativeFixture,
  deriveDecision,
  validateQuarantineReport,
};
