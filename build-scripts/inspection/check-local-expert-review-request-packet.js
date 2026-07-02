#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  ACCEPTED_INPUT_DECISION,
  DECISION_OPTIONS,
  FORBIDDEN_EXPERT_CLAIMS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  NO_OUTPUT_FLAGS,
  OUTPUT_ALLOWLIST,
  RESPONSE_FIELDS,
  SELECTED_DECISION,
  SPRINT_ID,
  outputContents,
} = require("./build-local-expert-review-request-packet.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-local-expert-review-request-packet.js";
const SOURCE_DECISION = "reports/inspection-standards/source-refresh-execution-pilot-decision.json";
const ENGLAND_REFRESH = "reports/inspection-standards/england-source-refresh-execution-results.json";
const FLANDERS_REFRESH = "reports/inspection-standards/flanders-source-refresh-execution-results.json";
const PLAN = "reports/inspection-standards/local-expert-review-request-plan.json";
const ENGLAND = "reports/inspection-standards/england-local-expert-review-request-packet.json";
const FLANDERS = "reports/inspection-standards/flanders-local-expert-review-request-packet.json";
const SIMULATION = "reports/inspection-standards/local-expert-review-request-simulation.json";
const DECISION = "reports/inspection-standards/local-expert-review-request-decision.json";

const REQUIRED_REPORTS = [PLAN, ENGLAND, FLANDERS, SIMULATION, DECISION];
const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-schema-architecture-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-source-expert-scope-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-source-expert-scope-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
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
  console.error("Local expert review request packet check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function sourceStateMap(jurisdictionId) {
  const report = readJson(jurisdictionId === "england" ? ENGLAND_REFRESH : FLANDERS_REFRESH);
  return new Map(report.source_results.map((source) => [source.source_id, source.source_state]));
}

function sourceIds(jurisdictionId) {
  return [...sourceStateMap(jurisdictionId).keys()];
}

function acceptedSourceRefreshDecision() {
  const report = readJson(SOURCE_DECISION);
  return report.final_decision && report.final_decision.selected;
}

function validateNoOutputFlags(report) {
  const failures = [];
  if (!report.no_output_flags) return ["no_output_flags missing"];
  for (const flag of NO_OUTPUT_FLAGS) {
    if (report.no_output_flags[flag] !== false) failures.push(`forbidden flag ${flag} must be false`);
  }
  const extra = Object.keys(report.no_output_flags).filter((flag) => !NO_OUTPUT_FLAGS.includes(flag));
  if (extra.length) failures.push(`extra forbidden flags: ${extra.join(", ")}`);
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
  if (acceptedSourceRefreshDecision() !== ACCEPTED_INPUT_DECISION) failures.push(`${SOURCE_DECISION}: selected decision mismatch`);
  if (report.accepted_input_decision !== ACCEPTED_INPUT_DECISION) failures.push("accepted input decision mismatch");
  if (report.accepted_input_decision_source !== SOURCE_DECISION) failures.push("accepted input decision source mismatch");
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push("input_allowlist mismatch");
  if (!sameList(report.output_allowlist, OUTPUT_ALLOWLIST)) failures.push("output_allowlist mismatch");
  const checklist = report.core_requirement_checklist || [];
  for (const id of [
    "accepted_source_refresh_decision_bound",
    "no_expert_contact_or_substitution",
    "request_and_response_schemas_complete",
    "source_states_trace_to_execution_pilot",
    "forbidden_claims_explicit",
    "simulation_and_refusals_complete",
    "single_decision",
  ]) {
    if (!checklist.some((item) => item.id === id && item.status === "met")) failures.push(`core requirement missing or unmet: ${id}`);
  }
  return failures;
}

function validateRequestSchema(schema) {
  const failures = [];
  for (const field of [
    "jurisdiction_id",
    "expert_profile_needed",
    "source_ids_in_scope",
    "source_states_from_refresh_pilot",
    "questions_allowed",
    "questions_forbidden",
    "expected_response_format",
    "uncertainty_handling",
    "citation_requirements",
    "authority_boundary",
    "no_expert_contact_performed",
    "does_not_authorize",
  ]) {
    if (!asArray(schema.required).includes(field)) failures.push(`request schema missing required ${field}`);
  }
  if (schema.additionalProperties !== false) failures.push("request schema must forbid additional properties");
  return failures;
}

function validateResponseSchema(schema) {
  const failures = [];
  if (!sameList(schema.required, RESPONSE_FIELDS)) failures.push("response schema required fields mismatch");
  if (schema.additionalProperties !== false) failures.push("response schema must forbid additional properties");
  for (const field of [
    "student_data",
    "personal_data",
    "school_specific_evidence",
    "legal_conclusion",
    "compliance_conclusion",
    "approval_conclusion",
    "inspection_readiness_conclusion",
    "direct_localized_output",
  ]) {
    if (!asArray(schema.forbidden_fields).includes(field)) failures.push(`response schema missing forbidden field ${field}`);
  }
  return failures;
}

function validateRequestPacket(packet) {
  const failures = validateCommon(packet, "local_expert_review_request_packet");
  if (!["england", "flanders"].includes(packet.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  if (packet.no_expert_contact_performed !== true) failures.push("no_expert_contact_performed must be true");
  if (packet.request_not_sent !== true) failures.push("request_not_sent must be true");
  if (!nonEmptyString(packet.expert_profile_needed)) failures.push("expert_profile_needed required");
  const expectedIds = sourceIds(packet.jurisdiction_id);
  if (!sameList(packet.source_ids_in_scope, expectedIds)) failures.push(`${packet.jurisdiction_id}: source_ids_in_scope mismatch`);
  const stateMap = sourceStateMap(packet.jurisdiction_id);
  for (const sourceId of expectedIds) {
    if (!packet.source_states_from_refresh_pilot || packet.source_states_from_refresh_pilot[sourceId] !== stateMap.get(sourceId)) {
      failures.push(`${packet.jurisdiction_id}: source state mismatch for ${sourceId}`);
    }
  }
  if (!Array.isArray(packet.source_scope) || packet.source_scope.length !== expectedIds.length) failures.push("source_scope length mismatch");
  for (const question of packet.questions_allowed || []) {
    for (const field of [
      "question_id",
      "jurisdiction_id",
      "source_ids",
      "source_states_seen",
      "allowed_question",
      "forbidden_question",
      "answer_type_allowed",
      "expected_response_format",
      "uncertainty_handling",
      "citation_requirement",
      "authority_boundary",
      "proof_required_to_use",
    ]) {
      if (!(field in question)) failures.push(`${question.question_id || "question"} missing ${field}`);
    }
    if (question.jurisdiction_id !== packet.jurisdiction_id) failures.push(`${question.question_id}: jurisdiction mismatch`);
    if (!sameList(question.expected_response_format, RESPONSE_FIELDS)) failures.push(`${question.question_id}: expected response fields mismatch`);
    for (const sourceId of question.source_ids || []) {
      if (!stateMap.has(sourceId)) failures.push(`${question.question_id}: source ${sourceId} not in refresh pilot`);
      if (question.source_states_seen && question.source_states_seen[sourceId] !== stateMap.get(sourceId)) {
        failures.push(`${question.question_id}: source state not traced for ${sourceId}`);
      }
    }
  }
  if ((packet.questions_allowed || []).length < 8) failures.push("expected at least 8 allowed questions");
  for (const claim of FORBIDDEN_EXPERT_CLAIMS) {
    if (!JSON.stringify(packet.questions_forbidden || []).toLowerCase().includes(claim.toLowerCase())) failures.push(`forbidden claim missing ${claim}`);
  }
  const text = JSON.stringify(packet).toLowerCase();
  for (const forbidden of ["legal advice", "compliance", "inspection-readiness", "student data", "personal data", "localized output", "exam-ready", "school-owned"]) {
    if (!text.includes(forbidden)) failures.push(`packet boundary missing ${forbidden}`);
  }
  if (/expert response is official authority|replace source interpretation/i.test(packet.authority_boundary || "")) {
    failures.push("STOP_EXPERT_AUTHORITY_SUBSTITUTION");
  }
  if (/do not mention uncertainty|hide uncertainty|choose the most likely/i.test(packet.uncertainty_handling || "")) {
    failures.push("STOP_HIDDEN_SOURCE_UNCERTAINTY");
  }
  for (const question of packet.questions_allowed || []) {
    const q = String(question.allowed_question || "").toLowerCase();
    if (q.includes("legal advice")) failures.push("STOP_LEGAL_ADVICE_REQUEST");
    if (q.includes("proves compliance") || q.includes("inspection readiness")) failures.push("STOP_COMPLIANCE_PROOF_REQUEST");
    if (q.includes("localized student-facing paragraphs")) failures.push("STOP_LOCALIZED_OUTPUT_REQUEST");
    if (q.includes("exam-ready exercises") || q.includes("mark schemes")) failures.push("STOP_EXAM_READY_EXERCISE_REQUEST");
    if (q.includes("school-owned implementation evidence")) failures.push("STOP_SCHOOL_EVIDENCE_REQUEST");
    if (q.includes("student data") || q.includes("personal support records")) failures.push("STOP_STUDENT_DATA_REQUEST");
    if (q.includes("support sufficiency") || q.includes("accommodation sufficiency") || q.includes("accessibility/legal sufficiency") || q.includes("accessibility legal sufficiency")) {
      failures.push("STOP_SUPPORT_ACCOMMODATION_OVERCLAIM");
    }
    if ((q.includes("generalize") && q.includes("whole uk")) || q.includes("whole uk from england")) {
      failures.push("STOP_WHOLE_UK_OVERCLAIM");
    }
    if ((q.includes("generalize") && q.includes("all belgium")) || q.includes("all belgium from flanders")) {
      failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
    }
  }
  failures.push(...validateNoOutputFlags(packet));
  return failures;
}

function validateSimulationReport(report) {
  const failures = validateCommon(report, "local_expert_review_request_simulation");
  if (report.no_requests_sent !== true) failures.push("no_requests_sent must be true");
  if (report.expert_contacted !== false) failures.push("expert_contacted must be false");
  const expectedStops = NEGATIVE_FIXTURES.map(([, stop]) => stop);
  const actualStops = (report.simulation_cases || []).map((item) => item.expected_stop_code);
  if (!sameList(actualStops, expectedStops)) failures.push("simulation stop-code order mismatch");
  failures.push(...validateNoOutputFlags(report));
  return failures;
}

function validateDecisionReport(report, england, flanders, simulation) {
  const failures = validateCommon(report, "local_expert_review_request_decision");
  if ((report.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if (!sameList((report.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (!sameList(report.request_packet_ids, [england.packet_id, flanders.packet_id])) failures.push("request packet ids mismatch");
  if ((report.simulation_summary || {}).negative_cases !== simulation.simulation_cases.length) failures.push("simulation summary mismatch");
  if ((report.simulation_summary || {}).requests_sent !== false) failures.push("decision must record no requests sent");
  const text = JSON.stringify(report).toLowerCase();
  for (const fragment of ["separate local expert contact pilot", "does_not_authorize", "personal-data", "inspection readiness", "scale gate"]) {
    if (!text.includes(fragment)) failures.push(`decision boundary missing ${fragment}`);
  }
  failures.push(...validateNoOutputFlags(report));
  return failures;
}

function validateNegativeFixture(fixture, expectedStopCode) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: stop code mismatch`);
  const validationFailures = validateRequestPacket(fixture);
  if (!validationFailures.includes(expectedStopCode)) {
    failures.push(`${fixture.fixture_name}: expected validateRequestPacket to reject with ${expectedStopCode}; got ${validationFailures.join(", ") || "no failures"}`);
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
  const expected = outputContents();
  for (const [file, content] of Object.entries(expected)) {
    const absolute = repoPath(file);
    if (!fs.existsSync(absolute)) failures.push(`${file}: missing generated output`);
    else if (fs.readFileSync(absolute, "utf8") !== content) failures.push(`${file}: generated output not current`);
  }
}

function checkRefusals(failures) {
  const cases = [
    ["--legal-advice", "STOP_LEGAL_ADVICE_REQUEST"],
    ["--compliance-proof", "STOP_COMPLIANCE_PROOF_REQUEST"],
    ["--localized-paragraph", "STOP_LOCALIZED_OUTPUT_REQUEST"],
    ["--exam-ready-exercises", "STOP_EXAM_READY_EXERCISE_REQUEST"],
    ["--school-evidence", "STOP_SCHOOL_EVIDENCE_REQUEST"],
    ["--student-data", "STOP_STUDENT_DATA_REQUEST"],
    ["--support-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
    ["--accommodation-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
    ["--accessibility-legal-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
    ["--expert-as-official-authority", "STOP_EXPERT_AUTHORITY_SUBSTITUTION"],
    ["--hide-source-uncertainty", "STOP_HIDDEN_SOURCE_UNCERTAINTY"],
    ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
    ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ];
  for (const [flag, stopCode] of cases) {
    const result = runNode([GENERATOR, flag]);
    if (result.status === 0) failures.push(`${flag} should fail`);
    if (!`${result.stdout}\n${result.stderr}`.includes(stopCode)) failures.push(`${flag} missing ${stopCode}`);
  }
}

function runCheck() {
  const failures = [];
  checkGeneratorCurrentness(failures);
  checkOutputs(failures);

  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }
  if (failures.length) fail(failures);

  const requestSchema = readJson("references/schemas/local-expert-review-request.schema.v1.json");
  const responseSchema = readJson("references/schemas/local-expert-review-response.schema.v1.json");
  const plan = readJson(PLAN);
  const england = readJson(ENGLAND);
  const flanders = readJson(FLANDERS);
  const simulation = readJson(SIMULATION);
  const decision = readJson(DECISION);

  failures.push(...validateRequestSchema(requestSchema));
  failures.push(...validateResponseSchema(responseSchema));
  failures.push(...validateCommon(plan, "local_expert_review_request_plan"));
  failures.push(...validateRequestPacket(england));
  failures.push(...validateRequestPacket(flanders));
  failures.push(...validateSimulationReport(simulation));
  failures.push(...validateDecisionReport(decision, england, flanders, simulation));

  if (england.source_ids_in_scope.length !== 8) failures.push("England source count must be 8");
  if (flanders.source_ids_in_scope.length !== 5) failures.push("Flanders source count must be 5");
  const flandersInterpretation = Object.entries(flanders.source_states_from_refresh_pilot).filter(([, state]) => state === "requires_local_expert_interpretation").map(([sourceId]) => sourceId);
  if (!sameList(flandersInterpretation, ["be-flanders-onderwijsdoelen-so3-doorstroom", "be-flanders-onderwijsdoelen-modernisatie"])) {
    failures.push("Flanders interpretation-needed source set mismatch");
  }

  const fixtureRoot = "references/data/inspection-standards/fixtures/local-expert-review-request-packet";
  for (const file of [
    "positive/england-local-expert-review-request-packet.sample.json",
    "positive/flanders-local-expert-review-request-packet.sample.json",
    "positive/local-expert-review-request-simulation.sample.json",
    "positive/local-expert-review-request-decision.sample.json",
  ]) {
    if (!fs.existsSync(repoPath(`${fixtureRoot}/${file}`))) failures.push(`${fixtureRoot}/${file}: missing positive fixture`);
  }
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const relativePath = `${fixtureRoot}/negative/${file}`;
    if (!fs.existsSync(repoPath(relativePath))) failures.push(`${relativePath}: missing negative fixture`);
    else failures.push(...validateNegativeFixture(readJson(relativePath), stopCode));
  }

  for (const reviewFile of REQUIRED_REVIEW_FILES) failures.push(...validateReviewFile(reviewFile));
  checkRefusals(failures);

  if (failures.length) fail(failures);
  console.log(`OK local expert review request packet england_sources=${england.source_ids_in_scope.length} flanders_sources=${flanders.source_ids_in_scope.length} negative_fixtures=${NEGATIVE_FIXTURES.length} decision=${SELECTED_DECISION}`);
}

if (require.main === module) runCheck();

module.exports = {
  validateDecisionReport,
  validateNegativeFixture,
  validateRequestPacket,
  validateRequestSchema,
  validateResponseSchema,
  validateSimulationReport,
};
