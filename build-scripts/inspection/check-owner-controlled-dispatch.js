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
  decisionLogicRows,
  noOutputFlagsForOwnerControlledDispatch,
  outputContents,
  ownerControlledDispatchRecord: expectedOwnerControlledDispatchRecord,
} = require("./build-owner-controlled-dispatch.js");
const { PROOF_FORMAT_FIELDS } = require("./build-owner-delivery-protocol-repair.js");
const { validateReviewFile } = require("./check-local-expert-contact-stage.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-owner-controlled-dispatch.js";
const ACCEPTED_DECISION = "reports/inspection-standards/owner-delivery-protocol-decision.json";
const PROTOCOL_PLAN = "reports/inspection-standards/owner-delivery-protocol-plan.json";
const ENGLAND_PROTOCOL = "reports/inspection-standards/england-owner-delivery-protocol-instance.json";
const FLANDERS_PROTOCOL = "reports/inspection-standards/flanders-owner-delivery-protocol-instance.json";
const DISPATCH = "reports/inspection-standards/owner-controlled-dispatch-record.json";
const ENGLAND = "reports/inspection-standards/england-owner-controlled-dispatch-and-response-intake.json";
const FLANDERS = "reports/inspection-standards/flanders-owner-controlled-dispatch-and-response-intake.json";
const QUARANTINE = "reports/inspection-standards/owner-controlled-response-quarantine-report.json";
const DECISION = "reports/inspection-standards/owner-controlled-dispatch-decision.json";

const REQUIRED_REPORTS = [DISPATCH, ENGLAND, FLANDERS, QUARANTINE, DECISION];
const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-subagent-quality-gate-record.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const REQUIRED_AUTHORITY_FRAGMENTS = [
  "localized output",
  "country editions",
  "answer models",
  "student-facing output",
  "teacher/school-facing output",
  "public output",
  "evidence packs",
  "product-route adoption",
  "Scale Gate",
  "diagnostics/mastery/PV",
  "personal/student/school data",
  "named expert",
  "private dispatch endpoint",
  "legal advice",
  "compliance proof",
  "inspection readiness",
  "support sufficiency",
  "accommodation sufficiency",
  "accessibility/legal sufficiency",
  "school-owned evidence",
  "official authority",
  "treating pending or absent responses as approval",
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
const RESPONSE_ANSWER_TYPES = new Set(["bounded_interpretation", "uncertainty_flag", "citation_correction", "out_of_scope"]);
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

function readText(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function runNode(args) {
  return childProcess.spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
}

function fail(failures) {
  console.error("Owner-controlled dispatch check failed:");
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
  return (readJson(ACCEPTED_DECISION).final_decision || {}).selected;
}

function protocolPath(jurisdictionId) {
  return jurisdictionId === "england" ? ENGLAND_PROTOCOL : FLANDERS_PROTOCOL;
}

function protocolInstance(jurisdictionId) {
  return readJson(protocolPath(jurisdictionId));
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
  const expected = noOutputFlagsForOwnerControlledDispatch();
  if (!report.no_output_flags) return ["no_output_flags missing"];
  for (const [flag, value] of Object.entries(expected)) {
    if (report.no_output_flags[flag] !== value) failures.push(`${flag} must be ${value}`);
  }
  for (const flag of [
    "external_dispatch_performed",
    "repository_external_dispatch_performed",
    "owner_delivery_proof_recorded",
    "owner_delivery_timestamp_recorded",
    "owner_material_sent",
    "private_contact_details_stored",
    "named_expert_selected",
    "expert_response_received",
    "accepted_response_available",
    "response_analysis_authorized",
    "response_analysis_attempted",
  ]) {
    if (report.no_output_flags[flag] !== false) failures.push(`${flag} must be false`);
  }
  if (report.no_output_flags.owner_dispatch_process_revision_required !== true) failures.push("owner_dispatch_process_revision_required must be true");
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
  if (acceptedDecision() !== ACCEPTED_INPUT_DECISION) failures.push(`${ACCEPTED_DECISION}: selected decision mismatch`);
  if (report.accepted_input_decision !== ACCEPTED_INPUT_DECISION) failures.push("accepted input decision mismatch");
  if (report.accepted_input_decision_source !== ACCEPTED_DECISION) failures.push("accepted input decision source mismatch");
  if (report.selected_decision !== SELECTED_DECISION) failures.push("selected_decision mismatch");
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push("input_allowlist mismatch");
  if (!sameList(report.output_allowlist, OUTPUT_ALLOWLIST)) failures.push("output_allowlist mismatch");
  if (!report.owner_authorization || report.owner_authorization.accepted_decision !== ACCEPTED_INPUT_DECISION) failures.push("owner authorization missing or decision mismatch");
  const checklist = report.core_requirement_checklist || [];
  for (const id of [
    "accepted_protocol_decision_bound",
    "dispatch_status_recorded_for_both_jurisdictions",
    "protocol_proof_format_reused",
    "no_dispatch_proof_invented",
    "approved_payload_only",
    "no_named_contact_or_private_details",
    "strict_response_intake_records",
    "quarantine_rules_enforced",
    "no_response_analysis_without_accepted_response",
    "downstream_authority_blocked",
    "review_route_preserved",
  ]) {
    if (!checklist.some((item) => item.id === id && item.status === "met")) failures.push(`core requirement missing or unmet: ${id}`);
  }
  const authorityText = JSON.stringify(report.does_not_authorize || report.owner_authorization || {});
  for (const fragment of REQUIRED_AUTHORITY_FRAGMENTS) {
    if (!authorityText.includes(fragment)) failures.push(`authority boundary missing ${fragment}`);
  }
  failures.push(...validateFindingClassifications(report.finding_classification, report.report_id || expectedType));
  failures.push(...validateFlags(report));
  return failures;
}

function unsafeTextStopCodes(text, jurisdictionId) {
  const lower = String(text || "").toLowerCase();
  const failures = [];
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(String(text || ""))) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  if (lower.includes("personal data") || lower.includes("named person") || lower.includes("student named")) failures.push("STOP_PERSONAL_DATA_RESPONSE");
  if (lower.includes("student data")) failures.push("STOP_PERSONAL_DATA_RESPONSE");
  if (lower.includes("school-owned evidence") || lower.includes("school evidence") || lower.includes("specific school") || lower.includes("network-owned evidence")) failures.push("STOP_SCHOOL_EVIDENCE_RESPONSE");
  if (lower.includes("legal advice") || lower.includes("compliance proof") || lower.includes("approval") || lower.includes("accreditation") || lower.includes("op0") || lower.includes("pta") || lower.includes("summative validity") || lower.includes("inspection readiness")) failures.push("STOP_LEGAL_COMPLIANCE_CLAIM");
  if (lower.includes("localized output") || lower.includes("country edition") || lower.includes("student-facing exercise") || lower.includes("answer model") || lower.includes("answer key")) failures.push("STOP_LOCALIZED_OUTPUT_RESPONSE");
  if (lower.includes("support sufficiency") || lower.includes("accommodation sufficiency") || lower.includes("accessibility sufficiency") || lower.includes("accessibility/legal sufficiency") || lower.includes("legal sufficiency") || lower.includes("individual-adjustment sufficiency")) failures.push("STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY");
  if (lower.includes("official authority") || lower.includes("substitutes for official source review")) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  if (jurisdictionId === "england" && (lower.includes("whole uk") || lower.includes("scotland") || lower.includes("wales") || lower.includes("northern ireland") || lower.includes("all awarding bodies"))) failures.push("STOP_WHOLE_UK_OVERCLAIM");
  if (jurisdictionId === "flanders" && (lower.includes("all belgium") || lower.includes("french community") || lower.includes("german-speaking community"))) failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
  if (jurisdictionId === "flanders" && lower.includes("all school networks")) failures.push("STOP_ALL_SCHOOL_NETWORK_OVERCLAIM");
  return [...new Set(failures)];
}

function validateRoleOnlyCandidate(candidate, jurisdictionId) {
  const failures = [];
  if (candidate.named_expert_selected !== false) failures.push("STOP_NAMED_EXPERT_SELECTION");
  if (candidate.personal_contact_details_recorded !== false) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  if (candidate.private_dispatch_endpoint_recorded !== false) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  if (candidate.expert_not_official_authority !== true) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  const candidateText = JSON.stringify(candidate).toLowerCase();
  failures.push(...unsafeTextStopCodes(JSON.stringify(candidate), jurisdictionId).filter((code) => code === "STOP_PRIVATE_CONTACT_STORAGE"));
  if (!candidateText.includes("role and jurisdiction fit only")) failures.push("role-only contact basis must remain role/jurisdiction only");
  if (!candidateText.includes("without supplying official authority or school evidence")) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  const assertedText = [
    candidate.role_profile,
    candidate.selection_basis,
    candidate.public_or_professional_basis,
    candidate.proof_required_to_select_named_contact,
  ].join(" ").toLowerCase()
    .replace(/without supplying official authority or school evidence/g, "")
    .replace(/expert_not_official_authority/g, "")
    .replace(/expert not official authority/g, "")
    .replace(/no named person/g, "")
    .replace(/no named expert/g, "")
    .replace(/no personal data/g, "");
  for (const stopCode of unsafeTextStopCodes(assertedText, jurisdictionId)) {
    if (stopCode !== "STOP_PRIVATE_CONTACT_STORAGE") failures.push(stopCode);
  }
  if (
    /\b(supplies|serves as|is|acts as|gives|provides|offers)\s+(official authority|school evidence|inspection readiness proof|inspection approval|product approval|compliance proof|legal advice)\b/.test(assertedText) ||
    /\b(gives|provides|offers|supplies)\s+(network evidence|inspection evidence|compliance evidence)\b/.test(assertedText) ||
    /\b(has|holds|serves as|acts as)\s+compliance authority\b/.test(assertedText) ||
    assertedText.includes("official authority for") ||
    assertedText.includes("authority") ||
    assertedText.includes("evidence") ||
    assertedText.includes("network evidence") ||
    assertedText.includes("compliance authority") ||
    assertedText.includes("legal authority") ||
    assertedText.includes("inspection approval") ||
    assertedText.includes("product approval") ||
    assertedText.includes("inspection readiness proof")
  ) {
    failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  }
  return failures;
}

function validateJurisdictionBoundary(boundary, jurisdictionId, context) {
  const failures = [];
  const boundaryText = String((boundary || {}).boundary || "").toLowerCase();
  const sourceUse = String((boundary || {}).source_use || "").toLowerCase();
  const overclaims = (boundary || {}).forbidden_overclaims || [];
  const hasOverclaim = (needle) => overclaims.some((item) => String(item).toLowerCase() === needle);

  if (jurisdictionId === "england") {
    if (!boundaryText.includes("england only")) failures.push(`${context}: England boundary must say England only`);
    if (!boundaryText.includes("not the whole uk")) failures.push("STOP_WHOLE_UK_OVERCLAIM");
    if (!boundaryText.includes("not scotland") || !boundaryText.includes("wales") || !boundaryText.includes("northern ireland")) failures.push("STOP_WHOLE_UK_OVERCLAIM");
    if (!boundaryText.includes("not all awarding bodies")) failures.push("STOP_WHOLE_UK_OVERCLAIM");
    for (const expected of ["whole UK", "all awarding bodies", "UK-wide school evidence"]) {
      if (!overclaims.includes(expected)) failures.push("STOP_WHOLE_UK_OVERCLAIM");
    }
    if (!sourceUse.includes("source/curriculum interpretation only")) failures.push(`${context}: England source_use must stay source/curriculum only`);
  }

  if (jurisdictionId === "flanders") {
    const assertedBoundaryText = boundaryText
      .replace(/not all belgium/g, "")
      .replace(/not the french community/g, "")
      .replace(/not the german-speaking community/g, "")
      .replace(/not all school networks/g, "");
    if (!boundaryText.includes("flanders only")) failures.push(`${context}: Flanders boundary must say Flanders only`);
    if (
      !boundaryText.includes("not all belgium") ||
      /\b(covers|applies to|includes|including)\s+(all\s+(of\s+)?)?belgium\b/.test(assertedBoundaryText) ||
      /\b(all\s+of\s+belgium|entire belgium|belgium-wide|belgian-wide|throughout belgium)\b/.test(assertedBoundaryText) ||
      /\bbelgium\b|\bbelgian\b/.test(assertedBoundaryText) ||
      /\b(and|including|includes|covers|applies to)\s+(the\s+)?french community\b/.test(assertedBoundaryText) ||
      /\b(and|including|includes|covers|applies to)\s+(the\s+)?german-speaking community\b/.test(assertedBoundaryText)
    ) failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
    if (!boundaryText.includes("not the french community") || !boundaryText.includes("not the german-speaking community")) failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
    if (
      !boundaryText.includes("not all school networks") ||
      /\b(covers|applies to|includes|including)\s+(every|all)\s+school networks?\b/.test(assertedBoundaryText) ||
      /\b(every|all)\s+school networks?\b/.test(assertedBoundaryText) ||
      /\b(every|all)\s+education networks?\b/.test(assertedBoundaryText) ||
      /\bcovers\s+every\s+education network\b/.test(assertedBoundaryText) ||
      /\b(school|education)-network-wide\b/.test(assertedBoundaryText) ||
      /\bnetwork-wide coverage\b/.test(assertedBoundaryText) ||
      /\bnetworks?\b/.test(assertedBoundaryText)
    ) failures.push("STOP_ALL_SCHOOL_NETWORK_OVERCLAIM");
    for (const expected of ["all belgium", "all school networks", "network evidence as product approval"]) {
      if (!hasOverclaim(expected)) failures.push(expected === "all school networks" ? "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM" : "STOP_ALL_BELGIUM_OVERCLAIM");
    }
    if (!sourceUse.includes("source/curriculum interpretation only")) failures.push(`${context}: Flanders source_use must stay source/curriculum only`);
    if (!sourceUse.includes("school/network evidence remains school-owned")) failures.push("STOP_SCHOOL_EVIDENCE_RESPONSE");
    if (!sourceUse.includes("not product approval") || sourceUse.includes("is product approval") || sourceUse.includes("inspection authority")) {
      failures.push("STOP_LEGAL_COMPLIANCE_CLAIM");
    }
  }

  return [...new Set(failures)];
}

function validateDispatchJurisdiction(item) {
  const failures = [];
  if (!["england", "flanders"].includes(item.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  const protocol = protocolInstance(item.jurisdiction_id);
  if (item.source_protocol_instance !== protocolPath(item.jurisdiction_id)) failures.push("source protocol instance mismatch");
  if (item.source_protocol_decision !== ACCEPTED_DECISION) failures.push("source protocol decision mismatch");
  if (item.source_protocol_selected_decision !== ACCEPTED_INPUT_DECISION) failures.push("source protocol selected decision mismatch");
  if (!DELIVERY_STATUS_OPTIONS.includes(item.delivery_status)) failures.push("delivery status not in allowed vocabulary");
  if (item.delivery_status !== "not_sent_owner_blocked") failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (item.owner_controls_delivery !== true) failures.push("owner_controls_delivery must be true");
  if (item.repository_stores_private_contact_details !== false) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  if (item.owner_delivery_proof_recorded !== false) failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (item.owner_delivery_reference !== null) failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (item.delivery_timestamp !== null) failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (item.dispatch_proof !== null) failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (!sameList(item.required_dispatch_proof_format, PROOF_FORMAT_FIELDS)) failures.push("dispatch proof format mismatch");
  if (item.approved_request_packet_id !== protocol.approved_request_packet_id) failures.push("approved request packet mismatch");
  if (item.approved_contact_text_hash !== protocol.approved_contact_text_hash) failures.push("approved contact text hash mismatch");
  if (!sameList(item.allowed_materials, protocol.allowed_materials)) failures.push("allowed materials mismatch");
  if (!sameList(item.forbidden_materials, protocol.forbidden_materials)) failures.push("forbidden materials mismatch");
  if (!Array.isArray(item.material_prepared) || item.material_prepared.length !== 4) failures.push("material_prepared must contain four approved items");
  if (!Array.isArray(item.material_sent) || item.material_sent.length !== 0) {
    failures.push("STOP_UNAPPROVED_MATERIAL_SENT");
    if ((item.material_sent || []).some((material) => /answer model|answer key|localized|student|school|evidence|scale gate|diagnostics|personal/i.test(String(material)))) failures.push("STOP_FORBIDDEN_ATTACHMENT");
  }
  if (!nonEmptyString(item.not_sent_reason)) failures.push("STOP_MISSING_NOT_SENT_REASON");
  if (!String(item.not_sent_reason || "").includes("cannot infer or perform external dispatch")) failures.push("not_sent_reason must refuse invented dispatch");
  failures.push(...validateRoleOnlyCandidate(item.role_only_contact_candidate || {}, item.jurisdiction_id));
  failures.push(...validateJurisdictionBoundary(item.jurisdiction_boundary || {}, item.jurisdiction_id, `${item.jurisdiction_id} dispatch jurisdiction_boundary`));
  const boundary = JSON.stringify(item.material_explicitly_not_sent || item.confirmations || {}).toLowerCase();
  for (const fragment of ["localized", "student-facing", "teacher/school", "public", "evidence packs", "scale gate", "personal/student/school data", "named expert"]) {
    if (!boundary.includes(fragment)) failures.push(`dispatch boundary missing ${fragment}`);
  }
  return [...new Set(failures)];
}

function validateOwnerControlledDispatchRecord(report) {
  const failures = validateCommon(report, "owner_controlled_dispatch_record");
  if (report.status !== "owner_dispatch_not_performed_no_owner_proof") failures.push("owner dispatch status mismatch");
  if (report.source_protocol_plan !== PROTOCOL_PLAN) failures.push("source protocol plan mismatch");
  if (report.source_protocol_decision !== ACCEPTED_DECISION) failures.push("source protocol decision mismatch");
  if (report.source_protocol_decision_selected !== ACCEPTED_INPUT_DECISION) failures.push("source protocol decision selection mismatch");
  if (report.protocol_decision_ready !== true) failures.push("protocol decision must be ready");
  if (report.owner_delivery_proof_recorded !== false) failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (report.repository_claims_external_dispatch !== false) failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (report.material_sent_count !== 0) failures.push("STOP_UNAPPROVED_MATERIAL_SENT");
  if (!sameList(report.delivery_status_options, DELIVERY_STATUS_OPTIONS)) failures.push("delivery status options mismatch");
  if (!sameList(report.delivery_proof_format_required, PROOF_FORMAT_FIELDS)) failures.push("delivery proof format mismatch");
  const jurisdictions = report.jurisdictions || [];
  if (jurisdictions.length !== 2) failures.push("must include England and Flanders dispatch statuses");
  for (const item of jurisdictions) failures.push(...validateDispatchJurisdiction(item));
  return [...new Set(failures)];
}

function validateResponseObject(response, jurisdictionId, context) {
  const failures = [];
  for (const field of RESPONSE_REQUIRED) {
    if (!(field in response)) failures.push(`${context}: response missing ${field}`);
  }
  for (const field of Object.keys(response)) {
    if (!RESPONSE_ALLOWED.has(field)) failures.push(`${context}: unexpected response field ${field}`);
  }
  if (response.jurisdiction !== jurisdictionId) failures.push(`${context}: response jurisdiction mismatch`);
  if (!RESPONSE_ANSWER_TYPES.has(response.answer_type)) failures.push(`${context}: invalid answer_type`);
  if (!RESPONSE_CONFIDENCE.has(response.confidence)) failures.push(`${context}: invalid confidence`);
  if (response.forbidden_claims_disclaimed !== true) failures.push(`${context}: forbidden_claims_disclaimed must be true`);
  failures.push(...unsafeTextStopCodes(JSON.stringify(response), jurisdictionId));
  return failures;
}

function validateSchemaIntakeRecord(record, jurisdictionId, context) {
  const failures = [];
  for (const field of RESPONSE_INTAKE_REQUIRED) {
    if (!(field in record)) failures.push(`${context}: schema_intake_record missing ${field}`);
  }
  for (const field of Object.keys(record || {})) {
    if (!RESPONSE_INTAKE_ALLOWED.has(field)) failures.push(`${context}: unexpected schema_intake_record field ${field}`);
  }
  if (record.jurisdiction_id !== jurisdictionId) failures.push(`${context}: schema jurisdiction mismatch`);
  if (record.response_received === true && record.consent_confirmed !== true) failures.push("STOP_MISSING_CONSENT_BOUNDARY");
  if (record.validation_status === "rejected" && (!Array.isArray(record.rejected_items) || record.rejected_items.length === 0)) failures.push("STOP_RESPONSE_NOT_QUARANTINED");
  const responses = record.responses || [];
  for (const [index, response] of responses.entries()) {
    failures.push(...validateResponseObject(response, jurisdictionId, `${context}: responses[${index}]`));
  }
  return [...new Set(failures)];
}

function validateResponseIntakeReport(report) {
  const failures = validateCommon(report, "owner_controlled_dispatch_response_intake");
  if (!["england", "flanders"].includes(report.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  if (report.source_owner_controlled_dispatch_record !== DISPATCH) failures.push("source dispatch record mismatch");
  if (report.source_dispatch_jurisdiction !== report.jurisdiction_id) failures.push("source dispatch jurisdiction mismatch");
  if (report.source_protocol_instance !== protocolPath(report.jurisdiction_id)) failures.push("source protocol instance mismatch");
  if (!sameList(report.allowed_delivery_statuses, DELIVERY_STATUS_OPTIONS)) failures.push("allowed delivery statuses mismatch");
  if (report.delivery_status !== "not_sent_owner_blocked") failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (report.response_status !== "no_response_yet" && report.response_status !== "sent_response_received_schema_pass" && report.response_status !== "sent_response_quarantined") failures.push("response status mismatch");
  if (report.owner_delivery_proof_recorded !== false && report.delivery_status === "not_sent_owner_blocked") failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (report.delivery_timestamp !== null && report.delivery_status === "not_sent_owner_blocked") failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (!Array.isArray(report.material_sent) || report.material_sent.length !== 0) failures.push("STOP_UNAPPROVED_MATERIAL_SENT");
  if (report.response_received !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  if (report.accepted_response_available !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  if (report.response_schema_status !== "no_response_yet") failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  if (!Array.isArray(report.pending_items) || report.pending_items.length < 8) failures.push("pending_items incomplete");
  if (!Array.isArray(report.quarantined_items) || report.quarantined_items.length !== 0) failures.push("quarantined_items must be empty without real responses");
  failures.push(...validateJurisdictionBoundary(report.jurisdiction_boundary || {}, report.jurisdiction_id, `${report.report_id} jurisdiction_boundary`));
  failures.push(...validateSchemaIntakeRecord(report.schema_intake_record || {}, report.jurisdiction_id, report.report_id));
  return [...new Set(failures)];
}

function validateQuarantineReport(report) {
  const failures = validateCommon(report, "owner_controlled_response_quarantine_report");
  if (report.status !== "quarantine_ready_no_dispatch_or_response") failures.push("quarantine status mismatch");
  if (report.no_real_responses_stored !== true) failures.push("no_real_responses_stored must be true");
  if (!Array.isArray(report.absent_response_items) || report.absent_response_items.length !== 2) failures.push("absent response items must cover two jurisdictions");
  if (report.response_analysis_allowed !== false) failures.push("response_analysis_allowed must be false");
  if (!Array.isArray(report.quarantined_items) || report.quarantined_items.length !== 0) failures.push("quarantined_items must be empty");
  const expectedRules = QUARANTINE_RULES.map(([ruleId, stopCode]) => [ruleId, stopCode]);
  const actualRules = (report.quarantine_rules || []).map((item) => [item.rule_id, item.expected_stop_code]);
  if (JSON.stringify(actualRules) !== JSON.stringify(expectedRules)) failures.push("quarantine rules mismatch");
  return failures;
}

function validateDecisionReport(report, dispatch, england, flanders, quarantine) {
  const failures = validateCommon(report, "owner_controlled_dispatch_decision");
  if ((report.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if (!sameList((report.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (report.owner_controlled_dispatch_record !== dispatch.report_id) failures.push("dispatch record mismatch");
  if (!sameList(report.response_intake_reports, [england.report_id, flanders.report_id])) failures.push("response intake report mismatch");
  if (report.quarantine_report !== quarantine.report_id) failures.push("quarantine report mismatch");
  if (JSON.stringify(report.decision_logic) !== JSON.stringify(decisionLogicRows(dispatch, england, flanders, quarantine))) failures.push("decision logic rows must be recomputed from current state");
  if (report.proceed_to_expert_response_analysis !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  if (report.owner_dispatch_process_revision_required !== true) failures.push("owner_dispatch_process_revision_required must be true");
  if (report.stop_track !== false) failures.push("stop_track must be false");
  if (report.external_dispatch_performed !== false) failures.push("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");
  if (report.real_responses_received !== false || report.accepted_responses_available !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  const text = JSON.stringify(report).toLowerCase();
  for (const fragment of ["no owner delivery proof", "no owner proof", "response analysis", "remains blocked"]) {
    if (!text.includes(fragment)) failures.push(`decision boundary missing ${fragment}`);
  }
  return [...new Set(failures)];
}

function validateNegativeFixture(fixture, expectedStopCode) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: stop code mismatch`);
  let validationFailures = [];
  if (fixture.fixture_target === "owner_controlled_dispatch_record") validationFailures = validateOwnerControlledDispatchRecord(fixture.record);
  else if (fixture.fixture_target === "owner_controlled_dispatch_response_intake") validationFailures = validateResponseIntakeReport(fixture.record);
  else if (fixture.fixture_target === "owner_controlled_dispatch_decision") {
    validationFailures = validateDecisionReport(
      fixture.record,
      readJson(DISPATCH),
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

function checkExpectedDispatchParity(failures) {
  const expected = expectedOwnerControlledDispatchRecord();
  const actual = readJson(DISPATCH);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push("owner-controlled dispatch record drifted from generator");
}

function checkSourceInputs(failures) {
  const decision = readJson(ACCEPTED_DECISION);
  if ((decision.final_decision || {}).selected !== ACCEPTED_INPUT_DECISION) failures.push("accepted protocol decision must be READY_FOR_OWNER_CONTROLLED_DISPATCH");
  if (decision.owner_controlled_dispatch_ready !== true) failures.push("accepted protocol must mark owner_controlled_dispatch_ready true");
  if (decision.external_dispatch_performed !== false) failures.push("accepted protocol must not claim external dispatch");
  if (!readText(PROTOCOL_PLAN).includes("valid_delivery_proof_without_private_contact_details")) failures.push("protocol plan must retain proof-format boundary");
  for (const jurisdictionId of ["england", "flanders"]) {
    const instance = protocolInstance(jurisdictionId);
    if (instance.selected_decision !== ACCEPTED_INPUT_DECISION) failures.push(`${jurisdictionId} protocol selected decision mismatch`);
    if (instance.dispatch_performed !== false) failures.push(`${jurisdictionId} protocol must not claim dispatch`);
    if (instance.repository_stores_private_contact_details !== false) failures.push(`${jurisdictionId} protocol must not store private contact details`);
    if (!sameList(instance.proof_format, PROOF_FORMAT_FIELDS)) failures.push(`${jurisdictionId} protocol proof format mismatch`);
  }
}

function checkOutputs(failures) {
  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }
  const dispatch = readJson(DISPATCH);
  const england = readJson(ENGLAND);
  const flanders = readJson(FLANDERS);
  const quarantine = readJson(QUARANTINE);
  const decision = readJson(DECISION);

  failures.push(...validateOwnerControlledDispatchRecord(dispatch));
  failures.push(...validateResponseIntakeReport(england));
  failures.push(...validateResponseIntakeReport(flanders));
  failures.push(...validateQuarantineReport(quarantine));
  failures.push(...validateDecisionReport(decision, dispatch, england, flanders, quarantine));

  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const fixture = readJson(`references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/${file}`);
    failures.push(...validateNegativeFixture(fixture, stopCode));
  }
  for (const relativePath of REQUIRED_REVIEW_FILES) failures.push(...validateReviewFile(relativePath));
  checkExpectedDispatchParity(failures);
}

function main() {
  const failures = [];
  checkGeneratorCurrentness(failures);
  checkOutputAllowlist(failures);
  checkSourceInputs(failures);
  checkOutputs(failures);
  if (failures.length) fail(failures);
  console.log(`OK owner-controlled dispatch (${REQUIRED_REPORTS.length} reports, ${NEGATIVE_FIXTURES.length} negative fixtures)`);
}

if (require.main === module) main();

module.exports = {
  validateDecisionReport,
  validateNegativeFixture,
  validateOwnerControlledDispatchRecord,
  validateQuarantineReport,
  validateResponseIntakeReport,
  validateJurisdictionBoundary,
  validateSchemaIntakeRecord,
  validateSourceInputs: checkSourceInputs,
};
