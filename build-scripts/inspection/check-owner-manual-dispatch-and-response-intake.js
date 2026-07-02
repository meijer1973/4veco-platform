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
  doesNotAuthorize,
  noOutputFlagsForOwnerDispatch,
  outputContents,
  ownerDispatchRecord: expectedOwnerDispatchRecord,
} = require("./build-owner-manual-dispatch-and-response-intake.js");
const {
  validateReviewFile,
  validateStageIntakeRecord,
} = require("./check-local-expert-contact-stage.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-owner-manual-dispatch-and-response-intake.js";
const ACCEPTED_DECISION = "reports/inspection-standards/local-expert-contact-stage-decision.json";
const STAGE_RESPONSE_INTAKE = "reports/inspection-standards/local-expert-contact-stage-response-intake-report.json";
const STAGE_QUARANTINE = "reports/inspection-standards/local-expert-contact-stage-quarantine-report.json";
const OWNER_DISPATCH = "reports/inspection-standards/owner-manual-dispatch-record.json";
const ENGLAND_INTAKE = "reports/inspection-standards/england-local-expert-response-intake.json";
const FLANDERS_INTAKE = "reports/inspection-standards/flanders-local-expert-response-intake.json";
const QUARANTINE = "reports/inspection-standards/local-expert-response-quarantine-report.json";
const DECISION = "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.json";

const REQUIRED_REPORTS = [OWNER_DISPATCH, ENGLAND_INTAKE, FLANDERS_INTAKE, QUARANTINE, DECISION];
const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-dispatch-intake-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const REQUIRED_AUTHORITY_FRAGMENTS = [
  "localized output",
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
  "individual adjustment sufficiency",
  "school-owned evidence",
  "official authority",
  "expert response analysis",
  "invented owner delivery proof",
];

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

function stageDispatchPath(jurisdictionId) {
  return `reports/inspection-standards/${jurisdictionId}-local-expert-contact-dispatch-record.json`;
}

function stageDispatchRecord(jurisdictionId) {
  return readJson(stageDispatchPath(jurisdictionId));
}

function stageResponseIntakeReport() {
  return readJson(STAGE_RESPONSE_INTAKE);
}

function stageQuarantineReport() {
  return readJson(STAGE_QUARANTINE);
}

function stageIntakeRecord(jurisdictionId) {
  const report = stageResponseIntakeReport();
  return (report.intake_records || []).find((item) => item.jurisdiction_id === jurisdictionId);
}

function runNode(args) {
  return childProcess.spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
}

function fail(failures) {
  console.error("Owner manual dispatch/intake check failed:");
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
  const expected = noOutputFlagsForOwnerDispatch();
  if (!report.no_output_flags) return ["no_output_flags missing"];
  for (const [flag, value] of Object.entries(expected)) {
    if (report.no_output_flags[flag] !== value) failures.push(`${flag} must be ${value}`);
  }
  for (const flag of [
    "expert_contacted",
    "personal_data_processing",
    "external_contact_dispatch_performed",
    "owner_delivery_channel_configured",
    "owner_delivery_proof_recorded",
    "owner_material_sent",
    "owner_response_received",
    "accepted_response_available",
    "response_analysis_authorized",
  ]) {
    if (report.no_output_flags[flag] !== false) failures.push(`${flag} must be false`);
  }
  if (report.no_output_flags.protocol_revision_required !== true) failures.push("protocol_revision_required must be true");
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
    "dispatch_status_recorded_for_both_jurisdictions",
    "approved_payload_only",
    "no_repository_dispatch_claim",
    "no_named_contact_or_private_details",
    "strict_response_intake_records",
    "responses_captured_pending_or_quarantined",
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

function validateJurisdictionDispatch(item) {
  const failures = [];
  if (!["england", "flanders"].includes(item.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  const stage = stageDispatchRecord(item.jurisdiction_id);
  if (item.source_dispatch_record !== `reports/inspection-standards/${item.jurisdiction_id}-local-expert-contact-dispatch-record.json`) failures.push("source dispatch record mismatch");
  if (item.approved_contact_text_version.source !== stage.approved_contact_text_source) failures.push("approved contact text source mismatch");
  if (item.approved_contact_text_version.exact_text_reused !== true) failures.push("approved contact text must be exact reused");
  if (item.accepted_request_packet_version.source !== stage.request_packet_source) failures.push("request packet source mismatch");
  if (item.accepted_request_packet_version.packet_id !== stage.request_packet_id) failures.push("request packet id mismatch");
  if (!sameList(item.accepted_request_packet_version.source_ids_in_scope, stage.source_ids_in_scope)) failures.push("source IDs mismatch");
  if (!sameList(item.accepted_request_packet_version.question_ids_in_scope, stage.question_ids_in_scope)) failures.push("question IDs mismatch");
  if (item.role_only_contact_basis.named_expert_selected !== false) failures.push("STOP_PERSONAL_CONTACT_DETAILS");
  if (item.role_only_contact_basis.personal_contact_details_recorded !== false) failures.push("STOP_PERSONAL_CONTACT_DETAILS");
  if (item.role_only_contact_basis.private_dispatch_endpoint_recorded !== false) failures.push("STOP_PERSONAL_CONTACT_DETAILS");
  if (item.role_only_contact_basis.expert_not_official_authority !== true) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  const roleText = JSON.stringify(item.role_only_contact_basis);
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(roleText)) failures.push("STOP_PERSONAL_CONTACT_DETAILS");
  if (item.delivery_channel !== "not_recorded_in_repository") failures.push("delivery channel must stay out of repository");
  if (item.delivery_status !== "not_sent_no_owner_delivery_channel_proof") failures.push("STOP_UNSUPPORTED_DISPATCH_PROOF");
  if (item.delivery_timestamp !== null) failures.push("STOP_UNSUPPORTED_DISPATCH_PROOF");
  if (!String(item.not_sent_reason || "").includes("must not invent external dispatch")) failures.push("not_sent_reason must refuse invented dispatch");
  if (!Array.isArray(item.material_sent) || item.material_sent.length !== 0) failures.push("STOP_UNSUPPORTED_DISPATCH_PROOF");
  if (!Array.isArray(item.material_prepared) || item.material_prepared.length !== 2) failures.push("material_prepared must contain approved text and request packet");
  if ((item.material_prepared || []).some((material) => !["approved_contact_text", "accepted_request_packet"].includes(material.material_type))) failures.push("material_prepared contains forbidden material");
  const boundary = JSON.stringify(item.material_explicitly_not_sent || item.confirmations || {}).toLowerCase();
  for (const fragment of ["localized", "student-facing", "teacher/school", "public", "evidence packs", "scale gate", "personal/student/school data", "named expert"]) {
    if (!boundary.includes(fragment)) failures.push(`dispatch boundary missing ${fragment}`);
  }
  return failures;
}

function validateStageResponseIntakeSource(report) {
  const failures = [];
  if (report.report_type !== "local_expert_contact_stage_response_intake_report") failures.push(`${STAGE_RESPONSE_INTAKE}: report_type mismatch`);
  if (report.status !== "no_real_responses_received") failures.push(`${STAGE_RESPONSE_INTAKE}: status must remain no_real_responses_received`);
  if (report.no_real_responses_stored !== true) failures.push(`${STAGE_RESPONSE_INTAKE}: no_real_responses_stored must be true`);
  const records = report.intake_records || [];
  if (records.length !== 2) failures.push(`${STAGE_RESPONSE_INTAKE}: must retain two jurisdiction intake records`);
  for (const jurisdictionId of ["england", "flanders"]) {
    const record = records.find((item) => item.jurisdiction_id === jurisdictionId);
    if (!record) {
      failures.push(`${STAGE_RESPONSE_INTAKE}: missing ${jurisdictionId} intake record`);
      continue;
    }
    failures.push(...validateStageIntakeRecord(record).map((failure) => `${STAGE_RESPONSE_INTAKE}/${jurisdictionId}: ${failure}`));
    if (record.consent_confirmed !== false) failures.push(`${STAGE_RESPONSE_INTAKE}/${jurisdictionId}: consent_confirmed must be false`);
    if (record.response_received !== false) failures.push(`${STAGE_RESPONSE_INTAKE}/${jurisdictionId}: response_received must be false`);
    if ((record.responses || []).length !== 0) failures.push(`${STAGE_RESPONSE_INTAKE}/${jurisdictionId}: responses must stay empty`);
    if ((record.rejected_items || []).length !== 0) failures.push(`${STAGE_RESPONSE_INTAKE}/${jurisdictionId}: rejected_items must stay empty`);
    if (record.validation_status !== "no_response_yet") failures.push(`${STAGE_RESPONSE_INTAKE}/${jurisdictionId}: validation_status must be no_response_yet`);
  }
  return failures;
}

function validateStageQuarantineSource(report) {
  const failures = [];
  if (report.report_type !== "local_expert_contact_stage_quarantine_report") failures.push(`${STAGE_QUARANTINE}: report_type mismatch`);
  if (report.status !== "quarantine_rules_ready_no_real_items") failures.push(`${STAGE_QUARANTINE}: status must remain quarantine_rules_ready_no_real_items`);
  if (report.no_real_responses_stored !== true) failures.push(`${STAGE_QUARANTINE}: no_real_responses_stored must be true`);
  if ((report.quarantined_items || []).length !== 0) failures.push(`${STAGE_QUARANTINE}: quarantined_items must stay empty`);
  if (!Array.isArray(report.quarantine_rules) || report.quarantine_rules.length === 0) failures.push(`${STAGE_QUARANTINE}: quarantine_rules missing`);
  for (const [index, rule] of (report.quarantine_rules || []).entries()) {
    if (!nonEmptyString(rule.rule_id)) failures.push(`${STAGE_QUARANTINE}: quarantine_rules[${index}] missing rule_id`);
    if (!nonEmptyString(rule.expected_stop_code)) failures.push(`${STAGE_QUARANTINE}: quarantine_rules[${index}] missing expected_stop_code`);
  }
  return failures;
}

function validateOwnerDispatchRecord(report) {
  const failures = validateCommon(report, "owner_manual_dispatch_record");
  if (report.status !== "dispatch_not_performed_no_owner_delivery_proof") failures.push("owner dispatch status mismatch");
  if (report.owner_delivery_proof_recorded !== false) failures.push("STOP_UNSUPPORTED_DISPATCH_PROOF");
  if (report.repository_claims_external_dispatch !== false) failures.push("STOP_UNSUPPORTED_DISPATCH_PROOF");
  if (report.material_sent_count !== 0) failures.push("STOP_UNSUPPORTED_DISPATCH_PROOF");
  const jurisdictions = report.jurisdictions || [];
  if (jurisdictions.length !== 2) failures.push("must include England and Flanders dispatch statuses");
  for (const item of jurisdictions) failures.push(...validateJurisdictionDispatch(item));
  return failures;
}

function validateResponseIntakeReport(report) {
  const failures = validateCommon(report, "local_expert_response_intake");
  if (!["england", "flanders"].includes(report.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  const source = stageIntakeRecord(report.jurisdiction_id);
  if (!source) failures.push(`${STAGE_RESPONSE_INTAKE}: missing ${report.jurisdiction_id} source intake`);
  if (report.source_stage_response_intake_report !== STAGE_RESPONSE_INTAKE) failures.push("source stage response-intake report mismatch");
  if (source) {
    if (report.source_stage_intake_record !== source.intake_id) failures.push("source stage intake id mismatch");
    const baseline = report.source_stage_no_response_baseline || {};
    if (baseline.consent_confirmed !== source.consent_confirmed) failures.push("source stage consent baseline mismatch");
    if (baseline.response_received !== source.response_received) failures.push("source stage response baseline mismatch");
    if (baseline.response_count !== (source.responses || []).length) failures.push("source stage response count mismatch");
    if (baseline.rejected_item_count !== (source.rejected_items || []).length) failures.push("source stage rejected item count mismatch");
    if (baseline.validation_status !== source.validation_status) failures.push("source stage validation status mismatch");
  }
  if (report.owner_delivery_proof_recorded !== false) failures.push("owner delivery proof must be absent");
  if (report.response_received !== false) failures.push("response_received must be false");
  if (report.response_status !== "pending_owner_delivery_no_response_received") failures.push("response status mismatch");
  if (!Array.isArray(report.pending_items) || report.pending_items.length < 5) failures.push("pending_items incomplete");
  if (!Array.isArray(report.quarantined_items) || report.quarantined_items.length !== 0) failures.push("quarantined_items must be empty without real responses");
  failures.push(...validateStageIntakeRecord(report.schema_intake_record || {}));
  if (source) {
    if ((report.schema_intake_record || {}).source_stage_response_intake_report !== STAGE_RESPONSE_INTAKE) failures.push("schema source stage response-intake report mismatch");
    if ((report.schema_intake_record || {}).source_stage_intake_id !== source.intake_id) failures.push("schema source stage intake id mismatch");
    if ((report.schema_intake_record || {}).request_packet_id !== source.request_packet_id) failures.push("schema source request packet mismatch");
    if ((report.schema_intake_record || {}).consent_confirmed !== source.consent_confirmed) failures.push("schema source consent baseline mismatch");
    if ((report.schema_intake_record || {}).response_received !== source.response_received) failures.push("schema source response baseline mismatch");
    if (((report.schema_intake_record || {}).responses || []).length !== (source.responses || []).length) failures.push("schema source response count mismatch");
    if (((report.schema_intake_record || {}).rejected_items || []).length !== (source.rejected_items || []).length) failures.push("schema source rejected item count mismatch");
    if ((report.schema_intake_record || {}).validation_status !== source.validation_status) failures.push("schema source validation status mismatch");
  }
  if ((report.schema_intake_record || {}).response_received !== false) failures.push("schema response_received must be false");
  if (((report.schema_intake_record || {}).responses || []).length !== 0) failures.push("empty intake must not include placeholder responses");
  return failures;
}

function validateQuarantineReport(report) {
  const failures = validateCommon(report, "local_expert_response_quarantine_report");
  const source = stageQuarantineReport();
  const sourceStops = (source.quarantine_rules || []).map((item) => item.expected_stop_code);
  if (report.source_stage_quarantine_report !== STAGE_QUARANTINE) failures.push("source stage quarantine report mismatch");
  if (report.source_stage_quarantine_status !== source.status) failures.push("source stage quarantine status mismatch");
  if (report.source_stage_no_real_responses_stored !== source.no_real_responses_stored) failures.push("source stage no-real-responses baseline mismatch");
  if (report.source_stage_quarantined_item_count !== (source.quarantined_items || []).length) failures.push("source stage quarantined item count mismatch");
  if (report.source_stage_quarantine_rule_count !== (source.quarantine_rules || []).length) failures.push("source stage quarantine rule count mismatch");
  if (!sameList(report.source_stage_quarantine_stop_codes, sourceStops)) failures.push("source stage quarantine stop-code baseline mismatch");
  if (report.no_real_responses_stored !== true) failures.push("no_real_responses_stored must be true");
  if (!Array.isArray(report.quarantined_items) || report.quarantined_items.length !== 0) failures.push("quarantined_items must be empty");
  const expectedStops = NEGATIVE_FIXTURES.map(([, stopCode]) => stopCode);
  const actualStops = (report.quarantine_rules || []).map((item) => item.expected_stop_code);
  if (!sameList(actualStops, expectedStops)) failures.push("quarantine stop-code order mismatch");
  return failures;
}

function validateDecisionReport(report, dispatch, england, flanders, quarantine) {
  const failures = validateCommon(report, "owner_manual_dispatch_and_response_intake_decision");
  if ((report.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if (!sameList((report.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (report.owner_dispatch_record !== dispatch.report_id) failures.push("owner dispatch record mismatch");
  if (!sameList(report.response_intake_reports, [england.report_id, flanders.report_id])) failures.push("response intake report mismatch");
  if (report.quarantine_report !== quarantine.report_id) failures.push("quarantine report mismatch");
  if (report.proceed_to_expert_response_analysis !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  if (report.protocol_revision_required !== true) failures.push("protocol_revision_required must be true");
  if (report.external_dispatch_performed !== false) failures.push("STOP_UNSUPPORTED_DISPATCH_PROOF");
  if (report.real_responses_received !== false || report.accepted_responses_available !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  const text = JSON.stringify(report).toLowerCase();
  for (const fragment of ["no owner delivery channel", "no approved external delivery channel", "response analysis", "remains blocked"]) {
    if (!text.includes(fragment)) failures.push(`decision boundary missing ${fragment}`);
  }
  return failures;
}

function validateNegativeFixture(fixture, expectedStopCode) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: stop code mismatch`);
  let validationFailures = [];
  if (fixture.fixture_target === "owner_dispatch_record") validationFailures = validateOwnerDispatchRecord(fixture.record);
  else if (fixture.fixture_target === "response_intake_report") validationFailures = validateResponseIntakeReport(fixture.record);
  else if (fixture.fixture_target === "decision_report") {
    validationFailures = validateDecisionReport(
      fixture.record,
      readJson(OWNER_DISPATCH),
      readJson(ENGLAND_INTAKE),
      readJson(FLANDERS_INTAKE),
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
  const expected = expectedOwnerDispatchRecord();
  const actual = readJson(OWNER_DISPATCH);
  if (JSON.stringify(actual) !== JSON.stringify(expected)) failures.push("owner dispatch record drifted from generator");
}

function checkSourceInputs(failures) {
  failures.push(...validateStageResponseIntakeSource(stageResponseIntakeReport()));
  failures.push(...validateStageQuarantineSource(stageQuarantineReport()));
}

function checkOutputs(failures) {
  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }
  const dispatch = readJson(OWNER_DISPATCH);
  const england = readJson(ENGLAND_INTAKE);
  const flanders = readJson(FLANDERS_INTAKE);
  const quarantine = readJson(QUARANTINE);
  const decision = readJson(DECISION);

  failures.push(...validateOwnerDispatchRecord(dispatch));
  failures.push(...validateResponseIntakeReport(england));
  failures.push(...validateResponseIntakeReport(flanders));
  failures.push(...validateQuarantineReport(quarantine));
  failures.push(...validateDecisionReport(decision, dispatch, england, flanders, quarantine));

  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const fixture = readJson(`references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/${file}`);
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
  console.log(`OK owner manual dispatch/intake (${REQUIRED_REPORTS.length} reports, ${NEGATIVE_FIXTURES.length} negative fixtures)`);
}

if (require.main === module) main();

module.exports = {
  validateDecisionReport,
  validateNegativeFixture,
  validateOwnerDispatchRecord,
  validateQuarantineReport,
  validateResponseIntakeReport,
  validateStageQuarantineSource,
  validateStageResponseIntakeSource,
};
