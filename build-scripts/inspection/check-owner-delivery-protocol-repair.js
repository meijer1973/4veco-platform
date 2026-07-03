#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  ACCEPTED_INPUT_DECISION,
  DECISION_OPTIONS,
  DOES_NOT_AUTHORIZE,
  FORBIDDEN_MATERIALS,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  PROOF_FORMAT_FIELDS,
  QUARANTINE_CLASSIFICATIONS,
  RESPONSE_INTAKE_RULES,
  SELECTED_DECISION,
  SPRINT_ID,
  allowedMaterials,
  noOutputFlags,
  outputContents,
  ownerDeliveryProtocolSchema,
  permittedInternalUseScope,
} = require("./build-owner-delivery-protocol-repair.js");
const { validateReviewFile } = require("./check-local-expert-contact-stage.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-owner-delivery-protocol-repair.js";
const PRIOR_COMPLETION_DECISION = "reports/inspection-standards/owner-delivery-protocol-completion-decision.json";

const REQUIRED_REPORTS = [
  "reports/inspection-standards/owner-delivery-protocol-plan.json",
  "reports/inspection-standards/england-owner-delivery-protocol-instance.json",
  "reports/inspection-standards/flanders-owner-delivery-protocol-instance.json",
  "reports/inspection-standards/owner-delivery-protocol-decision.json",
];

const REQUIRED_DOCS = [
  "docs/inspection-standards/owner-delivery-protocol-contract.md",
  "docs/inspection-standards/england-owner-delivery-protocol.md",
  "docs/inspection-standards/flanders-owner-delivery-protocol.md",
];

const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-lead-architecture-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-delivery-protocol-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-delivery-protocol-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-subagent-quality-gate-record.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const FINDING_CLASSES = new Set([
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
  console.error("Owner delivery protocol-repair check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function stopCodes(failures) {
  return [...new Set(failures.filter((failure) => /^STOP_[A-Z0-9_]+$/.test(failure)))].sort();
}

function validateAgainstProtocolSchema(instance) {
  const failures = [];
  const schema = ownerDeliveryProtocolSchema();
  const required = new Set(schema.required || []);
  const properties = schema.properties || {};
  for (const field of required) {
    if (!(field in instance)) failures.push(`schema required field missing ${field}`);
  }
  for (const field of Object.keys(instance)) {
    if (!(field in properties)) failures.push(`schema additional property ${field}`);
  }
  for (const [field, definition] of Object.entries(properties)) {
    if (!(field in instance)) continue;
    if ("const" in definition && instance[field] !== definition.const) failures.push(`schema const mismatch ${field}`);
  }
  return failures;
}

function acceptedDecision() {
  return (readJson(PRIOR_COMPLETION_DECISION).final_decision || {}).selected;
}

function validateFindingClassifications(items, context) {
  const failures = [];
  if (!Array.isArray(items) || items.length === 0) return [`${context}: finding_classification must contain rows`];
  for (const [index, item] of items.entries()) {
    if (!FINDING_CLASSES.has(item.classification)) failures.push(`${context}: finding_classification[${index}] invalid classification ${item.classification}`);
    for (const field of ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(item[field])) failures.push(`${context}: finding_classification[${index}] missing ${field}`);
    }
  }
  return failures;
}

function validateNoOutputFlags(flags) {
  const failures = [];
  const expected = noOutputFlags();
  for (const [key, value] of Object.entries(expected)) {
    if (flags[key] !== value) failures.push(`${key} must be ${value}`);
  }
  return failures;
}

function validateCommon(report, expectedType) {
  const failures = [];
  if (report.schema_version !== 1) failures.push(`${expectedType}: schema_version must be 1`);
  if (report.report_type !== expectedType) failures.push(`${expectedType}: report_type mismatch`);
  if (report.sprint_id !== SPRINT_ID) failures.push(`${expectedType}: sprint_id mismatch`);
  if (report.accepted_input_decision !== ACCEPTED_INPUT_DECISION) failures.push(`${expectedType}: accepted input decision mismatch`);
  if (report.selected_decision !== SELECTED_DECISION) failures.push(`${expectedType}: selected_decision mismatch`);
  if (report.internal_only !== true || report.manual_invocation_only !== true || report.human_review_required !== true) failures.push(`${expectedType}: review flags missing`);
  if (!String(report.product_end_state || "").includes("product-end-state.md")) failures.push(`${expectedType}: product end-state citation missing`);
  if (!String(report.original_sprint_gate_spec || "").includes(SPRINT_ID)) failures.push(`${expectedType}: original sprint/gate spec citation missing`);
  if (!Array.isArray(report.does_not_authorize) || report.does_not_authorize.length !== DOES_NOT_AUTHORIZE.length) failures.push(`${expectedType}: does_not_authorize mismatch`);
  const authorityText = JSON.stringify(report.does_not_authorize || []).toLowerCase();
  for (const fragment of [
    "external dispatch",
    "named expert selection",
    "private contact-detail storage",
    "expert response analysis",
    "localized output",
    "country editions",
    "answer models",
    "student-facing output",
    "teacher/school-facing output",
    "public output",
    "evidence packs",
    "product-route adoption",
    "scale gate",
    "diagnostics/mastery/pv",
    "personal/student/school data",
    "legal advice",
    "compliance proof",
    "inspection readiness",
    "support sufficiency",
    "accommodation sufficiency",
    "accessibility/legal sufficiency",
    "individual-adjustment sufficiency",
    "school-owned evidence",
    "official authority",
    "missing responses as approval",
  ]) {
    if (!authorityText.includes(fragment)) failures.push(`${expectedType}: authority boundary missing ${fragment}`);
  }
  const checklist = report.core_requirement_checklist || [];
  for (const id of [
    "owner_delivery_protocol_schema_complete",
    "delivery_channel_design_complete",
    "dispatch_proof_format_complete",
    "response_intake_completion_rules_complete",
    "england_protocol_instance_complete",
    "flanders_protocol_instance_complete",
    "negative_fixtures_cover_forbidden_cases",
    "downstream_authority_blocked",
    "review_route_preserved",
  ]) {
    if (!checklist.some((item) => item.id === id && item.status === "met")) failures.push(`${expectedType}: core requirement missing ${id}`);
  }
  failures.push(...validateFindingClassifications(report.finding_classification || [], report.report_id || expectedType));
  failures.push(...validateNoOutputFlags(report.no_output_flags || {}));
  return failures;
}

function validateSchema(schema) {
  const failures = [];
  if (JSON.stringify(schema) !== JSON.stringify(ownerDeliveryProtocolSchema())) failures.push("owner delivery protocol schema drifted from generator");
  if (schema.additionalProperties !== false) failures.push("schema must reject additional properties");
  for (const field of [
    "schema_version",
    "report_type",
    "jurisdiction_id",
    "jurisdiction_label",
    "permitted_internal_use_scope",
    "delivery_channel_class",
    "owner_controls_delivery",
    "repository_stores_private_contact_details",
    "allowed_materials",
    "forbidden_materials",
    "proof_format",
    "no_personal_data_policy",
    "no_student_data_policy",
    "no_school_evidence_policy",
    "no_localized_output_policy",
    "response_intake_completion_rules",
    "quarantine_classifications",
    "no_output_flags",
  ]) {
    if (!schema.required.includes(field)) failures.push(`schema missing required field ${field}`);
  }
  for (const [field, values] of [
    ["proof_format", PROOF_FORMAT_FIELDS],
    ["response_intake_completion_rules", RESPONSE_INTAKE_RULES],
    ["quarantine_classifications", QUARANTINE_CLASSIFICATIONS],
    ["forbidden_materials", FORBIDDEN_MATERIALS],
  ]) {
    const definition = (schema.properties || {})[field] || {};
    const constValues = (definition.prefixItems || []).map((item) => item.const);
    if (!sameList(constValues, values) || definition.items !== false || definition.maxItems !== values.length) failures.push(`schema ${field} must encode exact values`);
  }
  return failures;
}

function validatePlan(plan) {
  const failures = validateCommon(plan, "owner_delivery_protocol_plan");
  if (!sameList(plan.dispatch_proof_format, PROOF_FORMAT_FIELDS)) failures.push("plan dispatch proof format mismatch");
  if (!sameList(plan.response_intake_completion_rules, RESPONSE_INTAKE_RULES)) failures.push("plan response rules mismatch");
  if (plan.permitted_internal_use_scope !== permittedInternalUseScope()) failures.push("permitted internal use scope mismatch");
  if (plan.delivery_channel_design.owner_controls_delivery !== true) failures.push("plan owner_controls_delivery must be true");
  if (plan.delivery_channel_design.repository_stores_private_contact_details !== false) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  if (!sameList((plan.delivery_channel_design.allowed_materials_by_jurisdiction || {}).england, allowedMaterials("england"))) failures.push("plan England allowed materials mismatch");
  if (!sameList((plan.delivery_channel_design.allowed_materials_by_jurisdiction || {}).flanders, allowedMaterials("flanders"))) failures.push("plan Flanders allowed materials mismatch");
  if (!Array.isArray(plan.protocol_instances) || plan.protocol_instances.length !== 2) failures.push("plan must list two protocol instances");
  return failures;
}

function validateBoundary(instance) {
  const failures = [];
  const text = JSON.stringify(instance.jurisdiction_boundary || {}).toLowerCase();
  const boundaryText = String((instance.jurisdiction_boundary || {}).boundary || "").toLowerCase();
  if (instance.jurisdiction_id === "england") {
    if (!text.includes("not the whole uk")) failures.push("STOP_WHOLE_UK_OVERCLAIM");
    if (!text.includes("all awarding bodies")) failures.push("England boundary missing all-awarding-bodies refusal");
  }
  if (instance.jurisdiction_id === "flanders") {
    if (!boundaryText.includes("not all belgium")) failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
    if (!boundaryText.includes("not all school networks")) failures.push("STOP_ALL_SCHOOL_NETWORK_OVERCLAIM");
    if (!text.includes("school-owned")) failures.push("Flanders boundary missing school-owned evidence refusal");
    if (!text.includes("not product approval")) failures.push("Flanders boundary missing product-approval refusal");
  }
  if (/official authority|expert feedback is official/.test(text)) failures.push("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");
  return failures;
}

function validateProtocolInstance(instance) {
  const failures = [...validateCommon(instance, "owner_delivery_protocol_instance"), ...validateAgainstProtocolSchema(instance)];
  if (!["england", "flanders"].includes(instance.jurisdiction_id)) failures.push("jurisdiction_id invalid");
  if (instance.permitted_internal_use_scope !== permittedInternalUseScope()) failures.push("permitted internal use scope mismatch");
  if (instance.owner_controls_delivery !== true) failures.push("owner_controls_delivery must be true");
  if (instance.repository_stores_private_contact_details !== false) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  if (instance.dispatch_performed !== false) failures.push("STOP_DELIVERY_CLAIM_WITHOUT_PROOF");
  if (instance.response_analysis_authorized !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_SCHEMA_PASS");
  if (!nonEmptyString(instance.timestamp_recording_policy)) failures.push("STOP_MISSING_DELIVERY_TIMESTAMP");
  if (!sameList(instance.proof_format, PROOF_FORMAT_FIELDS)) failures.push("STOP_PROOF_FORMAT_MISMATCH");
  if (!sameList(instance.response_intake_completion_rules, RESPONSE_INTAKE_RULES)) failures.push("response-intake rules mismatch");
  if (instance.no_personal_data_policy !== true) failures.push("STOP_PERSONAL_DATA");
  if (instance.no_student_data_policy !== true) failures.push("STOP_STUDENT_DATA");
  if (instance.no_school_evidence_policy !== true) failures.push("STOP_SCHOOL_EVIDENCE");
  if (instance.no_localized_output_policy !== true) failures.push("STOP_LOCALIZED_OUTPUT");
  const allowedText = JSON.stringify(instance.allowed_materials || []).toLowerCase();
  const hasFlandersSharedMaterial = instance.jurisdiction_id === "flanders" && /england|whole uk|shared|england\/flanders/.test(allowedText);
  const hasUnapprovedMaterial = /localized|student worksheet|country edition/.test(allowedText);
  const hasAnswerModelMaterial = /answer model|answer key|worked-answer/.test(allowedText);
  const hasSufficiencyMaterial = /support.*sufficien|accommodation.*sufficien|accessibility.*sufficien|individual-adjustment.*sufficien/.test(allowedText);
  if (!sameList(instance.allowed_materials, allowedMaterials(instance.jurisdiction_id))) {
    if (hasFlandersSharedMaterial) failures.push("STOP_FLANDERS_SHARED_MATERIAL_OVERCLAIM");
    else if (hasAnswerModelMaterial) failures.push("STOP_ANSWER_MODEL_OUTPUT");
    else if (hasSufficiencyMaterial) failures.push("STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY");
    else if (hasUnapprovedMaterial) failures.push("STOP_UNAPPROVED_MATERIAL");
    else failures.push("STOP_UNAPPROVED_MATERIAL");
  }
  if (!sameList(instance.forbidden_materials, FORBIDDEN_MATERIALS)) failures.push("forbidden materials mismatch");
  const forbiddenText = JSON.stringify(instance.forbidden_materials || []).toLowerCase();
  for (const [needle, stop] of [
    ["localized output", "STOP_LOCALIZED_OUTPUT"],
    ["answer models", "STOP_ANSWER_MODEL_OUTPUT"],
    ["student data", "STOP_STUDENT_DATA"],
    ["personal data", "STOP_PRIVATE_CONTACT_STORAGE"],
    ["school-owned evidence", "STOP_SCHOOL_EVIDENCE"],
    ["legal or compliance", "STOP_LEGAL_COMPLIANCE_CLAIM"],
    ["support, accommodation, accessibility", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
    ["expert-as-official-authority", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
  ]) {
    if (!forbiddenText.includes(needle)) failures.push(stop);
  }
  if (!sameList(instance.quarantine_classifications, QUARANTINE_CLASSIFICATIONS)) {
    if (!Array.isArray(instance.quarantine_classifications) || !instance.quarantine_classifications.includes("contains_personal_data")) failures.push("STOP_MISSING_QUARANTINE_CLASSIFICATION");
    if (!Array.isArray(instance.quarantine_classifications) || !instance.quarantine_classifications.includes("claims_support_accommodation_accessibility_sufficiency")) failures.push("STOP_MISSING_SUFFICIENCY_QUARANTINE");
    if (Array.isArray(instance.quarantine_classifications) && instance.quarantine_classifications.includes("contains_personal_data") && instance.quarantine_classifications.includes("claims_support_accommodation_accessibility_sufficiency")) failures.push("quarantine classifications mismatch");
  }
  if (/named expert|named\.person|@/i.test(JSON.stringify([
    instance.storage_boundary,
    instance.owner_delivery_reference,
    instance.contact_details,
    instance.private_contact_details,
  ]))) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  failures.push(...validateBoundary(instance));
  return [...new Set(failures)];
}

function validateDecision(decision) {
  const failures = validateCommon(decision, "owner_delivery_protocol_decision");
  if ((decision.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if (!sameList((decision.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (decision.owner_controlled_dispatch_ready !== true) failures.push("owner_controlled_dispatch_ready must be true");
  if (decision.external_dispatch_performed !== false) failures.push("STOP_DELIVERY_CLAIM_WITHOUT_PROOF");
  if (decision.private_contact_details_stored !== false) failures.push("STOP_PRIVATE_CONTACT_STORAGE");
  if (decision.response_analysis_authorized !== false) failures.push("STOP_RESPONSE_ANALYSIS_WITHOUT_SCHEMA_PASS");
  const observedReady = (decision.decision_logic || []).find((row) => row.selected_when_true === SELECTED_DECISION);
  if (!observedReady || observedReady.observed !== true) failures.push("decision logic must select READY_FOR_OWNER_CONTROLLED_DISPATCH from protocol readiness");
  const observedRows = (decision.decision_logic || []).filter((row) => row.observed === true);
  if (observedRows.length !== 1) failures.push("decision logic must have exactly one observed row");
  if (observedRows.length === 1 && observedRows[0].selected_when_true !== (decision.final_decision || {}).selected) failures.push("observed decision row must match final decision");
  return [...new Set(failures)];
}

function validateDocs() {
  const failures = [];
  for (const doc of REQUIRED_DOCS) {
    if (!fs.existsSync(repoPath(doc))) {
      failures.push(`${doc}: missing`);
      continue;
    }
    const text = readText(doc).toLowerCase();
    for (const fragment of ["owner-controlled delivery protocol", "does not dispatch", "required proof format", "forbidden", "answer models", "book 1 chapter 1.2/1.3"]) {
      if (!text.includes(fragment)) failures.push(`${doc}: missing ${fragment}`);
    }
  }
  return failures;
}

function validateNegativeFixture(fixture, expectedStopCode) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: expected stop code mismatch`);
  let validationFailures = [];
  if (fixture.fixture_target === "owner_delivery_protocol_instance") validationFailures = validateProtocolInstance(fixture.record);
  else if (fixture.fixture_target === "owner_delivery_protocol_decision") validationFailures = validateDecision(fixture.record);
  else failures.push(`${fixture.fixture_name}: unknown target ${fixture.fixture_target}`);
  const actualStopCodes = stopCodes(validationFailures);
  if (!sameList(actualStopCodes, [expectedStopCode])) failures.push(`${fixture.fixture_name}: expected only ${expectedStopCode}; got ${actualStopCodes.join(", ") || "no stop codes"}`);
  return failures;
}

function checkGeneratorCurrentness(failures) {
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) failures.push(`generator --check failed: ${result.stderr || result.stdout}`);
}

function checkPriorInput(failures) {
  if (acceptedDecision() !== ACCEPTED_INPUT_DECISION) failures.push(`${PRIOR_COMPLETION_DECISION}: selected decision must be ${ACCEPTED_INPUT_DECISION}`);
}

function checkOutputs(failures) {
  const actual = Object.keys(outputContents());
  if (!sameList(actual, OUTPUT_ALLOWLIST)) failures.push("outputContents must exactly match OUTPUT_ALLOWLIST");
  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }
  failures.push(...validateSchema(readJson("references/schemas/owner-delivery-protocol.schema.v1.json")));
  failures.push(...validateDocs());
  failures.push(...validatePlan(readJson("reports/inspection-standards/owner-delivery-protocol-plan.json")));
  failures.push(...validateProtocolInstance(readJson("reports/inspection-standards/england-owner-delivery-protocol-instance.json")));
  failures.push(...validateProtocolInstance(readJson("reports/inspection-standards/flanders-owner-delivery-protocol-instance.json")));
  failures.push(...validateDecision(readJson("reports/inspection-standards/owner-delivery-protocol-decision.json")));
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const fixture = readJson(`references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/${file}`);
    failures.push(...validateNegativeFixture(fixture, stopCode));
  }
  for (const relativePath of REQUIRED_REVIEW_FILES) failures.push(...validateReviewFile(relativePath));
}

function main() {
  const failures = [];
  checkGeneratorCurrentness(failures);
  checkPriorInput(failures);
  checkOutputs(failures);
  if (failures.length) fail(failures);
  console.log(`OK owner delivery protocol-repair (${REQUIRED_REPORTS.length} reports, ${NEGATIVE_FIXTURES.length} negative fixtures)`);
}

if (require.main === module) main();

module.exports = {
  validateDecision,
  validateNegativeFixture,
  validatePlan,
  validateProtocolInstance,
  validateSchema,
};
