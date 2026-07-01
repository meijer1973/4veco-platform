#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  ACCEPTED_INPUT_DECISION,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  SELECTED_DECISION,
  SPRINT_ID,
  dispatchRecord: expectedDispatchRecord,
  doesNotAuthorize,
  noOutputFlagsForStage,
  outputContents,
} = require("./build-local-expert-contact-stage.js");
const { contactPacket } = require("./build-local-expert-contact-pilot.js");
const {
  validateIntakeRecord: validatePilotIntakeRecord,
} = require("./check-local-expert-contact-pilot.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-local-expert-contact-stage.js";
const ACCEPTED_DECISION = "reports/inspection-standards/local-expert-contact-pilot-decision.json";
const PLAN = "reports/inspection-standards/local-expert-contact-stage-plan.json";
const ENGLAND = "reports/inspection-standards/england-local-expert-contact-dispatch-record.json";
const FLANDERS = "reports/inspection-standards/flanders-local-expert-contact-dispatch-record.json";
const INTAKE = "reports/inspection-standards/local-expert-contact-stage-response-intake-report.json";
const QUARANTINE = "reports/inspection-standards/local-expert-contact-stage-quarantine-report.json";
const DECISION = "reports/inspection-standards/local-expert-contact-stage-decision.json";

const REQUIRED_REPORTS = [PLAN, ENGLAND, FLANDERS, INTAKE, QUARANTINE, DECISION];
const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-jurisdiction-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const STAGE_TRUE_FLAGS = new Set([
  "contact_text_generated",
  "consent_boundary_defined",
  "response_intake_schema_generated",
  "owner_authorized_contact_ready",
  "owner_authorization_recorded",
  "dispatch_records_created",
  "role_only_candidates_selected",
  "pre_dispatch_legal_privacy_review_passed",
  "pre_dispatch_jurisdiction_source_review_passed",
  "approved_contact_text_reused",
  "request_packet_attached",
  "response_intake_schema_enforced",
  "quarantine_rules_enforced",
]);

const ALLOWED_FINDING_CLASSIFICATIONS = new Set([
  "core_requirement_met",
  "quality_improvement_available",
  "minor_carry_flag",
  "scale_blocker",
  "core_spec_failure",
]);

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
  "named expert selection",
  "legal advice",
  "compliance proof",
  "inspection-readiness",
  "support sufficiency",
  "accommodation sufficiency",
  "accessibility/legal sufficiency",
  "individual adjustment sufficiency",
  "school-owned evidence",
  "official authority",
];

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readUtf8(relativePath) {
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
  console.error("Local expert contact stage check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
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

function validateStageFlags(report) {
  const failures = [];
  if (!report.no_output_flags) return ["no_output_flags missing"];
  const expected = noOutputFlagsForStage();
  for (const [flag, value] of Object.entries(expected)) {
    if (report.no_output_flags[flag] !== value) failures.push(`${flag} must be ${value}`);
  }
  for (const flag of ["expert_contacted", "named_expert_selected", "personal_data_processing", "real_expert_response_stored", "external_contact_dispatch_performed", "response_received"]) {
    if (report.no_output_flags[flag] !== false) failures.push(`${flag} must be false`);
  }
  for (const flag of STAGE_TRUE_FLAGS) {
    if (report.no_output_flags[flag] !== true) failures.push(`${flag} must be true`);
  }
  if (report.no_output_flags.repository_delivery_channel_available !== false) failures.push("repository_delivery_channel_available must be false");
  return failures;
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
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push("input_allowlist mismatch");
  if (!sameList(report.output_allowlist, OUTPUT_ALLOWLIST)) failures.push("output_allowlist mismatch");
  if (!report.owner_authorization || report.owner_authorization.accepted_decision !== ACCEPTED_INPUT_DECISION) failures.push("owner authorization missing or decision mismatch");
  const checklist = report.core_requirement_checklist || [];
  for (const id of [
    "accepted_contact_stage_decision_bound",
    "owner_authorization_recorded",
    "role_only_contact_candidates",
    "approved_contact_text_and_request_packet_only",
    "pre_dispatch_legal_privacy_review",
    "pre_dispatch_jurisdiction_source_review",
    "strict_response_intake_schema",
    "quarantine_required_for_forbidden_content",
    "repository_does_not_claim_external_dispatch",
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
  failures.push(...validateStageFlags(report));
  return failures;
}

function contactTextFor(jurisdictionId) {
  return contactPacket(jurisdictionId).contact_text;
}

function validateDispatchPayload(record) {
  const failures = [];
  const payload = record.dispatch_payload || [];
  if (payload.length !== 2) failures.push("dispatch_payload must contain only contact text and request packet");
  const types = payload.map((item) => item.payload_type);
  if (!sameList(types, ["approved_contact_text", "accepted_request_packet"])) failures.push("dispatch payload types mismatch");
  if (payload.some((item) => !["approved_contact_text", "accepted_request_packet"].includes(item.payload_type))) failures.push("STOP_FORBIDDEN_ATTACHMENT");
  const payloadText = JSON.stringify(payload).toLowerCase();
  if (/localized|student-facing|student facing|evidence pack|personal data|student data|school evidence/.test(payloadText)) failures.push("STOP_FORBIDDEN_ATTACHMENT");
  return failures;
}

function validateCandidate(candidate) {
  const failures = [];
  if (!candidate || candidate.candidate_type !== "role_only_profile") failures.push("candidate must be role_only_profile");
  if (candidate.selected !== true) failures.push("role-only candidate must be selected");
  if (candidate.named_expert_selected !== false) failures.push("STOP_NAMED_EXPERT_SELECTION");
  if (candidate.personal_contact_details_recorded !== false) failures.push("STOP_PERSONAL_CONTACT_DETAILS");
  if (candidate.dispatch_endpoint_recorded !== false) failures.push("dispatch endpoint must not be recorded");
  if (!nonEmptyString(candidate.role_profile)) failures.push("candidate role_profile required");
  const candidateText = JSON.stringify(candidate);
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(candidateText) || /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,}\d{2,4}/.test(candidateText)) failures.push("STOP_PERSONAL_CONTACT_DETAILS");
  if (/Dr\.?\s+[A-Z][a-z]+|Professor\s+[A-Z][a-z]+|named expert selected/i.test(candidateText)) failures.push("STOP_NAMED_EXPERT_SELECTION");
  return failures;
}

function validatePreDispatchReviews(record) {
  const failures = [];
  const reviews = record.pre_dispatch_reviews || [];
  const legal = reviews.find((review) => review.reviewer_role === "legal_privacy");
  const source = reviews.find((review) => review.reviewer_role === `${record.jurisdiction_id}_jurisdiction_source`);
  if (!legal || legal.verdict !== "PASS") failures.push("STOP_MISSING_LEGAL_PRIVACY_REVIEW");
  if (!source || source.verdict !== "PASS") failures.push("STOP_MISSING_JURISDICTION_SOURCE_REVIEW");
  for (const review of reviews) {
    for (const field of ["blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(review[field])) failures.push(`${review.review_id || "review"} missing ${field}`);
    }
  }
  return failures;
}

function validateDispatchRecord(record) {
  const failures = validateCommon(record, "local_expert_contact_stage_dispatch_record");
  if (!["england", "flanders"].includes(record.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  const expectedPilot = contactPacket(record.jurisdiction_id);
  if (record.contact_text !== contactTextFor(record.jurisdiction_id)) failures.push("STOP_CONTACT_TEXT_DRIFT");
  if (!sameList(record.source_ids_in_scope, expectedPilot.source_ids_in_scope)) failures.push("source_ids_in_scope mismatch");
  if (!sameList(record.question_ids_in_scope, expectedPilot.question_ids_in_scope)) failures.push("question_ids_in_scope mismatch");
  if (record.request_packet_id !== expectedPilot.request_packet_id) failures.push("request_packet_id mismatch");
  if (record.dispatch_authorized_by_owner !== true) failures.push("dispatch_authorized_by_owner must be true");
  if (record.dispatch_performed_by_repository !== false) failures.push("STOP_UNAUTHORIZED_EXTERNAL_DISPATCH");
  if (record.external_dispatch_performed !== false) failures.push("STOP_UNAUTHORIZED_EXTERNAL_DISPATCH");
  if (record.repository_delivery_channel_available !== false) failures.push("repository_delivery_channel_available must be false");
  if (record.response_received !== false) failures.push("response_received must be false");
  if (!String(record.status || "").includes("no_repository_delivery_channel")) failures.push("status must record no repository delivery channel");
  failures.push(...validateCandidate(record.candidate));
  failures.push(...validateDispatchPayload(record));
  failures.push(...validatePreDispatchReviews(record));
  const forbiddenText = JSON.stringify(record.forbidden_payload || record.quarantine_policy || {}).toLowerCase();
  for (const fragment of ["localized", "personal data", "student data", "school-specific evidence", "legal/compliance", "support/accommodation/accessibility", "named expert"]) {
    if (!forbiddenText.includes(fragment)) failures.push(`dispatch forbidden/quarantine boundary missing ${fragment}`);
  }
  return failures;
}

function validateStageResponseText(record, jurisdictionId) {
  const failures = [];
  const responseText = (record.responses || []).map((response) => [
    response.reviewer_role,
    response.interpretation,
    response.uncertainty,
    response.cited_source,
    response.proof_required_to_use,
  ].join(" ")).join(" ").toLowerCase();
  if (/official authority|substitutes? for official|authority substitute|expert feedback as official/.test(responseText)) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  if (jurisdictionId === "england" && /whole uk|scotland|wales|northern ireland|all awarding bodies/.test(responseText)) failures.push("STOP_WHOLE_UK_OVERCLAIM");
  if (jurisdictionId === "flanders" && /all belgium|french community|german-speaking community|all school networks/.test(responseText)) failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
  return failures;
}

function validateStageIntakeRecord(record) {
  const failures = validatePilotIntakeRecord(record);
  if (record.response_received === false && (record.responses || []).length !== 0) failures.push("empty intake records must not carry placeholder responses");
  failures.push(...validateStageResponseText(record, record.jurisdiction_id));
  return failures;
}

function validateIntakeReport(report) {
  const failures = validateCommon(report, "local_expert_contact_stage_response_intake_report");
  if (report.no_real_responses_stored !== true) failures.push("no_real_responses_stored must be true");
  if (report.quarantine_required !== true) failures.push("quarantine_required must be true");
  if (report.response_intake_schema_source !== "references/schemas/local-expert-response-intake.schema.v1.json") failures.push("response intake schema source mismatch");
  const records = report.intake_records || [];
  if (records.length !== 2) failures.push("must include two intake records");
  for (const record of records) {
    failures.push(...validateStageIntakeRecord(record));
    if (record.response_received !== false) failures.push("real response must not be stored");
  }
  return failures;
}

function validateQuarantineReport(report) {
  const failures = validateCommon(report, "local_expert_contact_stage_quarantine_report");
  if (report.no_real_responses_stored !== true) failures.push("no_real_responses_stored must be true");
  if (!Array.isArray(report.quarantined_items) || report.quarantined_items.length !== 0) failures.push("quarantined_items must be empty for no real responses");
  const expectedStops = NEGATIVE_FIXTURES.map(([, stopCode]) => stopCode);
  const actualStops = (report.quarantine_rules || []).map((item) => item.expected_stop_code);
  if (!sameList(actualStops, expectedStops)) failures.push("quarantine stop-code order mismatch");
  return failures;
}

function validateDecisionReport(report, england, flanders, intake, quarantine) {
  const failures = validateCommon(report, "local_expert_contact_stage_decision");
  if ((report.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if (!sameList((report.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (!sameList(report.dispatch_record_ids, [england.dispatch_id, flanders.dispatch_id])) failures.push("dispatch record ids mismatch");
  if (report.response_intake_report !== intake.report_id) failures.push("response intake report mismatch");
  if (report.quarantine_report !== quarantine.report_id) failures.push("quarantine report mismatch");
  if (report.external_dispatch_performed !== false) failures.push("decision must not claim external dispatch");
  if (report.real_responses_received !== false) failures.push("decision must not claim real responses");
  const text = JSON.stringify(report).toLowerCase();
  for (const fragment of ["owner manual dispatch", "no approved external delivery channel", "does_not_authorize", "response analysis is not yet authorized"]) {
    if (!text.includes(fragment)) failures.push(`decision boundary missing ${fragment}`);
  }
  return failures;
}

function validateNegativeFixture(fixture, expectedStopCode) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: stop code mismatch`);
  let validationFailures = [];
  if (fixture.fixture_target === "dispatch_record") validationFailures = validateDispatchRecord(fixture.record);
  else if (fixture.fixture_target === "intake_record") validationFailures = validateStageIntakeRecord(fixture.record);
  else failures.push(`${fixture.fixture_name}: unknown fixture_target ${fixture.fixture_target}`);
  if (!validationFailures.includes(expectedStopCode)) {
    failures.push(`${fixture.fixture_name}: expected ${expectedStopCode}; got ${validationFailures.join(", ") || "no failures"}`);
  }
  return failures;
}

function validateReviewFile(relativePath) {
  const text = readUtf8(relativePath);
  const failures = [];
  for (const fragment of [
    "Product End-State And Original Spec",
    "Non-Negotiable Requirements",
    "Core-Requirement Checklist",
    "blocks",
    "does_not_block",
    "proof_required_to_close",
    "PASS",
  ]) {
    if (!text.includes(fragment)) failures.push(`${relativePath}: missing ${fragment}`);
  }
  if (/Verdict:\s*PASS WITH FLAGS[\s\S]*missing core requirement/i.test(text)) {
    failures.push(`${relativePath}: PASS WITH FLAGS carries missing core requirement`);
  }
  const classifications = [];
  const rowPattern = /^\|[^|\n]+\|\s*`([^`]+)`\s*\|/gm;
  let match = rowPattern.exec(text);
  while (match) {
    classifications.push(match[1]);
    if (!ALLOWED_FINDING_CLASSIFICATIONS.has(match[1])) {
      failures.push(`${relativePath}: invalid REV-STD-1 finding classification ${match[1]}`);
    }
    match = rowPattern.exec(text);
  }
  if (classifications.length === 0) failures.push(`${relativePath}: no finding classifications found`);
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
  for (const jurisdictionId of ["england", "flanders"]) {
    const expected = expectedDispatchRecord(jurisdictionId);
    const actual = readJson(jurisdictionId === "england" ? ENGLAND : FLANDERS);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push(`${jurisdictionId} dispatch record drifted from generator`);
  }
}

function checkOutputs(failures) {
  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }

  const plan = readJson(PLAN);
  const england = readJson(ENGLAND);
  const flanders = readJson(FLANDERS);
  const intake = readJson(INTAKE);
  const quarantine = readJson(QUARANTINE);
  const decision = readJson(DECISION);

  failures.push(...validateCommon(plan, "local_expert_contact_stage_plan"));
  failures.push(...validateDispatchRecord(england));
  failures.push(...validateDispatchRecord(flanders));
  failures.push(...validateIntakeReport(intake));
  failures.push(...validateQuarantineReport(quarantine));
  failures.push(...validateDecisionReport(decision, england, flanders, intake, quarantine));

  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const fixture = readJson(`references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/${file}`);
    failures.push(...validateNegativeFixture(fixture, stopCode));
  }
  for (const relativePath of REQUIRED_REVIEW_FILES) failures.push(...validateReviewFile(relativePath));
  checkExpectedDispatchParity(failures);
}

function main() {
  const failures = [];
  checkGeneratorCurrentness(failures);
  checkOutputAllowlist(failures);
  checkOutputs(failures);
  if (failures.length) fail(failures);
  console.log(`OK local expert contact stage (${REQUIRED_REPORTS.length} reports, ${NEGATIVE_FIXTURES.length} negative fixtures)`);
}

if (require.main === module) main();

module.exports = {
  validateDecisionReport,
  validateDispatchRecord,
  validateIntakeReport,
  validateNegativeFixture,
  validateQuarantineReport,
  validateReviewFile,
  validateStageIntakeRecord,
};
