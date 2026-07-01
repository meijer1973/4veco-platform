#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  ACCEPTED_INPUT_DECISION,
  CONSENT_FIELDS,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  RESPONSE_FIELDS,
  RESPONSE_INTAKE_FIELDS,
  SELECTED_DECISION,
  SPRINT_ID,
  outputContents,
} = require("./build-local-expert-contact-pilot.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-local-expert-contact-pilot.js";
const ACCEPTED_DECISION = "reports/inspection-standards/local-expert-review-request-decision.json";
const ENGLAND_REQUEST = "reports/inspection-standards/england-local-expert-review-request-packet.json";
const FLANDERS_REQUEST = "reports/inspection-standards/flanders-local-expert-review-request-packet.json";
const PLAN = "reports/inspection-standards/local-expert-contact-pilot-plan.json";
const ENGLAND = "reports/inspection-standards/england-local-expert-contact-pilot-packet.json";
const FLANDERS = "reports/inspection-standards/flanders-local-expert-contact-pilot-packet.json";
const INTAKE = "reports/inspection-standards/local-expert-response-intake-report.json";
const SIMULATION = "reports/inspection-standards/local-expert-contact-pilot-simulation.json";
const DECISION = "reports/inspection-standards/local-expert-contact-pilot-decision.json";

const REQUIRED_REPORTS = [PLAN, ENGLAND, FLANDERS, INTAKE, SIMULATION, DECISION];
const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-plan-architecture-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-dutch-quality-inspection-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const FORBIDDEN_RESPONSE_FIELDS = [
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
  console.error("Local expert contact pilot check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function acceptedDecision() {
  return (readJson(ACCEPTED_DECISION).final_decision || {}).selected;
}

function requestPacket(jurisdictionId) {
  return readJson(jurisdictionId === "england" ? ENGLAND_REQUEST : FLANDERS_REQUEST);
}

function requestSourceIds(jurisdictionId) {
  return requestPacket(jurisdictionId).source_ids_in_scope;
}

function requestQuestionIds(jurisdictionId) {
  return requestPacket(jurisdictionId).questions_allowed.map((question) => question.question_id);
}

function validatePilotFlags(report) {
  const failures = [];
  if (!report.no_output_flags) return ["no_output_flags missing"];
  for (const [flag, value] of Object.entries(report.no_output_flags)) {
    if (["contact_text_generated", "consent_boundary_defined", "response_intake_schema_generated", "owner_authorized_contact_ready"].includes(flag)) {
      if (value !== true) failures.push(`${flag} must be true`);
    } else if (value !== false) {
      failures.push(`${flag} must be false`);
    }
  }
  for (const required of ["expert_contacted", "personal_data_processing", "localized_output_generated", "school_evidence_claim", "real_expert_response_stored"]) {
    if (report.no_output_flags[required] !== false) failures.push(`${required} must be false`);
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
  const checklist = report.core_requirement_checklist || [];
  for (const id of [
    "accepted_request_packet_decision_bound",
    "role_only_expert_profiles",
    "contact_text_from_request_packets_only",
    "consent_and_recording_boundary",
    "strict_response_intake_schema",
    "no_personal_or_student_data",
    "forbidden_authority_claims_refused",
    "no_real_contact_before_owner_authorization",
    "review_route_preserved",
  ]) {
    if (!checklist.some((item) => item.id === id && item.status === "met")) failures.push(`core requirement missing or unmet: ${id}`);
  }
  return failures;
}

function validateConsentSchema(schema) {
  const failures = [];
  if (schema.additionalProperties !== false) failures.push("consent schema must forbid additional properties");
  if (!sameList(schema.required, CONSENT_FIELDS)) failures.push("consent schema required fields mismatch");
  return failures;
}

function validateResponseIntakeSchema(schema) {
  const failures = [];
  if (schema.additionalProperties !== false) failures.push("response intake schema must forbid additional properties");
  if (!sameList(schema.required, RESPONSE_INTAKE_FIELDS)) failures.push("response intake schema required fields mismatch");
  if (!sameList(schema.response_record_required_fields, RESPONSE_FIELDS)) failures.push("response record fields mismatch");
  const responseItemSchema = (((schema.properties || {}).responses || {}).items || {});
  if (responseItemSchema.additionalProperties !== false) failures.push("response item schema must forbid additional properties");
  if (!sameList(responseItemSchema.required, RESPONSE_FIELDS)) failures.push("response item required fields mismatch");
  for (const field of RESPONSE_FIELDS) {
    if (!((responseItemSchema.properties || {})[field])) failures.push(`response item schema missing property ${field}`);
  }
  const consentRule = JSON.stringify(schema.allOf || []);
  if (!consentRule.includes('"response_received"') || !consentRule.includes('"consent_confirmed"') || !consentRule.includes('"const":true')) {
    failures.push("response intake schema missing consent-before-response rule");
  }
  for (const field of FORBIDDEN_RESPONSE_FIELDS) {
    if (!asArray(schema.forbidden_fields).includes(field)) failures.push(`response intake schema missing forbidden field ${field}`);
  }
  return failures;
}

function validateContactPacket(packet) {
  const failures = validateCommon(packet, "local_expert_contact_pilot_packet");
  if (!["england", "flanders"].includes(packet.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  if (packet.named_expert_selected !== false) failures.push("named_expert_selected must be false");
  if (packet.owner_authorization_required !== true) failures.push("owner_authorization_required must be true");
  if (packet.contact_dispatch_performed !== false) failures.push("STOP_UNAUTHORIZED_CONTACT_DISPATCH");
  if (packet.response_received !== false) failures.push("response_received must be false");
  if (!nonEmptyString(packet.expert_profile_allowed)) failures.push("expert_profile_allowed required");
  if (/@|\+\d|phone|email|mailto:/i.test(packet.expert_profile_allowed)) failures.push("expert profile appears to contain contact details");
  if (!sameList(packet.source_ids_in_scope, requestSourceIds(packet.jurisdiction_id))) failures.push(`${packet.jurisdiction_id}: source_ids_in_scope mismatch`);
  if (!sameList(packet.question_ids_in_scope, requestQuestionIds(packet.jurisdiction_id))) failures.push(`${packet.jurisdiction_id}: question_ids_in_scope mismatch`);
  if (!packet.consent_boundary || CONSENT_FIELDS.some((field) => !nonEmptyString(packet.consent_boundary[field]))) failures.push("STOP_MISSING_CONSENT_BOUNDARY");
  const text = JSON.stringify(packet).toLowerCase();
  for (const fragment of [
    "voluntary",
    "no personal data",
    "student data",
    "strict response",
    "legal advice",
    "compliance proof",
    "inspection-readiness",
    "localized output",
    "support",
    "accommodation",
    "accessibility",
  ]) {
    if (!text.includes(fragment)) failures.push(`contact packet boundary missing ${fragment}`);
  }
  failures.push(...validatePilotFlags(packet));
  return failures;
}

function validateResponseRecord(record, jurisdictionId) {
  const failures = [];
  for (const field of RESPONSE_FIELDS) {
    if (!(field in record)) failures.push(`response missing ${field}`);
  }
  for (const forbidden of FORBIDDEN_RESPONSE_FIELDS) {
    if (forbidden in record) {
      if (["personal_data", "student_data", "named_person", "contact_details"].includes(forbidden)) failures.push("STOP_PERSONAL_DATA_RESPONSE");
      else if (forbidden === "school_specific_evidence") failures.push("STOP_SCHOOL_EVIDENCE_RESPONSE");
      else if (forbidden === "direct_localized_output") failures.push("STOP_LOCALIZED_OUTPUT_RESPONSE");
      else if (forbidden.includes("sufficiency")) failures.push("STOP_SUPPORT_ACCOMMODATION_OVERCLAIM");
      else failures.push("STOP_LEGAL_COMPLIANCE_CLAIM");
    }
  }
  if (record.jurisdiction !== jurisdictionId) failures.push("STOP_JURISDICTION_MISMATCH");
  if (record.forbidden_claims_disclaimed !== true) failures.push("STOP_MISSING_FORBIDDEN_DISCLAIMER");
  if (!requestSourceIds(jurisdictionId).includes(record.source_id)) failures.push("STOP_SOURCE_OUT_OF_SCOPE");
  if (!requestQuestionIds(jurisdictionId).includes(record.question_id)) failures.push("STOP_QUESTION_OUT_OF_SCOPE");
  if ((record.confidence === "low" || record.confidence === "cannot_answer") && !nonEmptyString(record.uncertainty)) failures.push("STOP_HIDDEN_UNCERTAINTY");
  const responseText = [
    record.reviewer_role,
    record.interpretation,
    record.uncertainty,
    record.cited_source,
    record.proof_required_to_use,
  ].map((value) => String(value || "")).join(" ");
  const responseTextLower = responseText.toLowerCase();
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(responseText) || /(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,}\d{2,4}/.test(responseText)) {
    failures.push("STOP_PERSONAL_DATA_RESPONSE");
  }
  if (/personal data|student data|student record|learner record|support record|personal support record|named student|named person|email address|phone number|contact detail/.test(responseTextLower)) {
    failures.push("STOP_PERSONAL_DATA_RESPONSE");
  }
  if (/\b(student|learner|pupil)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\b/i.test(responseText)) {
    failures.push("STOP_PERSONAL_DATA_RESPONSE");
  }
  if (/school-specific evidence|school specific evidence|school-owned evidence|school owned evidence|school evidence|implementation evidence|implementation logs?|implementation records?|school logs?|school records?|school policy/.test(responseTextLower)) {
    failures.push("STOP_SCHOOL_EVIDENCE_RESPONSE");
  }
  if (/\bat\s+[A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){0,5}\s+(School|College|Academy)\b/i.test(responseText)) {
    failures.push("STOP_SCHOOL_EVIDENCE_RESPONSE");
  }
  if (/legal advice|legal compliance|legal sufficiency|legally sufficient|proves compliance|\bcompliant\b|\bcompliance\b|inspection readiness|inspection-readiness|inspection ready|inspection-ready|ready for inspection|ready-for-inspection|\bapproval\b|\bapproved\b|accreditation|accredited|op0|pta|summative validity/.test(responseTextLower)) {
    failures.push("STOP_LEGAL_COMPLIANCE_CLAIM");
  }
  if (/localized|student-facing paragraph|student facing paragraph|country edition/.test(responseTextLower)) failures.push("STOP_LOCALIZED_OUTPUT_RESPONSE");
  if (/support sufficiency|support (is|are|looks|seems)?\s*sufficient|accommodation sufficiency|accommodations? (is|are|look|seem)?\s*sufficient|accessibility\/legal sufficiency|accessibility legal sufficiency|accessibility (is|looks|seems)?\s*sufficient|individual[- ]adjustment sufficiency|individual adjustments? (is|are|look|seem)?\s*sufficient|reasonable adjustments? (is|are|look|seem)?\s*sufficient/.test(responseTextLower)) {
    failures.push("STOP_SUPPORT_ACCOMMODATION_OVERCLAIM");
  }
  if (jurisdictionId === "england" && /whole uk|scotland|wales|northern ireland|all awarding bodies/.test(responseTextLower)) failures.push("STOP_WHOLE_UK_OVERCLAIM");
  if (jurisdictionId === "flanders" && /all belgium|french community|german-speaking community|all school networks/.test(responseTextLower)) failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
  return failures;
}

function validateIntakeRecord(record) {
  const failures = [];
  for (const field of RESPONSE_INTAKE_FIELDS) {
    if (!(field in record)) failures.push(`intake missing ${field}`);
  }
  if (!["england", "flanders"].includes(record.jurisdiction_id)) failures.push("intake jurisdiction invalid");
  if (record.contact_dispatch_performed === true) failures.push("STOP_UNAUTHORIZED_CONTACT_DISPATCH");
  if (record.response_received === true && record.consent_confirmed !== true) failures.push("STOP_MISSING_CONSENT_BOUNDARY");
  for (const response of record.responses || []) failures.push(...validateResponseRecord(response, record.jurisdiction_id));
  return failures;
}

function validateIntakeReport(report) {
  const failures = validateCommon(report, "local_expert_response_intake_report");
  if (report.no_real_responses_stored !== true) failures.push("no_real_responses_stored must be true");
  for (const record of report.intake_records || []) failures.push(...validateIntakeRecord(record));
  if ((report.intake_records || []).some((record) => record.response_received !== false)) failures.push("real response must not be stored");
  failures.push(...validatePilotFlags(report));
  return failures;
}

function validateSimulationReport(report) {
  const failures = validateCommon(report, "local_expert_contact_pilot_simulation");
  if (report.contact_dispatch_performed !== false) failures.push("contact_dispatch_performed must be false");
  if (report.no_real_responses_stored !== true) failures.push("no_real_responses_stored must be true");
  const expectedStops = NEGATIVE_FIXTURES.map(([, stop]) => stop);
  const actualStops = (report.simulation_cases || []).map((item) => item.expected_stop_code);
  if (!sameList(actualStops, expectedStops)) failures.push("simulation stop-code order mismatch");
  failures.push(...validatePilotFlags(report));
  return failures;
}

function validateDecisionReport(report, england, flanders, intake, simulation) {
  const failures = validateCommon(report, "local_expert_contact_pilot_decision");
  if ((report.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if (!sameList((report.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (!sameList(report.contact_packet_ids, [england.contact_id, flanders.contact_id])) failures.push("contact packet ids mismatch");
  if (report.response_intake_report !== intake.report_id) failures.push("response intake report mismatch");
  if ((report.simulation_summary || {}).negative_cases !== simulation.simulation_cases.length) failures.push("simulation summary mismatch");
  if ((report.simulation_summary || {}).contact_dispatched !== false) failures.push("decision must record no contact dispatch");
  if ((report.simulation_summary || {}).real_responses_stored !== false) failures.push("decision must record no real response storage");
  const text = JSON.stringify(report).toLowerCase();
  for (const fragment of ["owner authorization", "does_not_authorize", "personal-data", "inspection-readiness", "scale gate"]) {
    if (!text.includes(fragment)) failures.push(`decision boundary missing ${fragment}`);
  }
  failures.push(...validatePilotFlags(report));
  return failures;
}

function validateNegativeFixture(fixture, expectedStopCode) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: stop code mismatch`);
  const validationFailures = validateIntakeRecord(fixture);
  if (!validationFailures.includes(expectedStopCode)) {
    failures.push(`${fixture.fixture_name}: expected validateIntakeRecord to reject with ${expectedStopCode}; got ${validationFailures.join(", ") || "no failures"}`);
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
  return failures;
}

function checkGeneratorCurrentness(failures) {
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) failures.push(`generator --check failed: ${result.stderr || result.stdout}`);
}

function checkOutputs(failures) {
  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }

  const consent = readJson("references/schemas/local-expert-contact-consent.schema.v1.json");
  const intakeSchema = readJson("references/schemas/local-expert-response-intake.schema.v1.json");
  const plan = readJson(PLAN);
  const england = readJson(ENGLAND);
  const flanders = readJson(FLANDERS);
  const intake = readJson(INTAKE);
  const simulation = readJson(SIMULATION);
  const decision = readJson(DECISION);

  failures.push(...validateConsentSchema(consent));
  failures.push(...validateResponseIntakeSchema(intakeSchema));
  failures.push(...validateCommon(plan, "local_expert_contact_pilot_plan"));
  failures.push(...validateContactPacket(england));
  failures.push(...validateContactPacket(flanders));
  failures.push(...validateIntakeReport(intake));
  failures.push(...validateSimulationReport(simulation));
  failures.push(...validateDecisionReport(decision, england, flanders, intake, simulation));

  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const fixture = readJson(`references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/${file}`);
    failures.push(...validateNegativeFixture(fixture, stopCode));
  }
  for (const relativePath of REQUIRED_REVIEW_FILES) failures.push(...validateReviewFile(relativePath));
}

function checkOutputAllowlist(failures) {
  const actual = Object.keys(outputContents());
  if (!sameList(actual, OUTPUT_ALLOWLIST)) failures.push("outputContents keys do not match OUTPUT_ALLOWLIST exactly");
}

function main() {
  const failures = [];
  checkGeneratorCurrentness(failures);
  checkOutputAllowlist(failures);
  checkOutputs(failures);
  if (failures.length) fail(failures);
  console.log(`OK local expert contact pilot (${REQUIRED_REPORTS.length} reports, ${NEGATIVE_FIXTURES.length} negative fixtures)`);
}

if (require.main === module) main();

module.exports = {
  validateContactPacket,
  validateConsentSchema,
  validateDecisionReport,
  validateIntakeRecord,
  validateIntakeReport,
  validateNegativeFixture,
  validateResponseIntakeSchema,
  validateResponseRecord,
  validateSimulationReport,
};
