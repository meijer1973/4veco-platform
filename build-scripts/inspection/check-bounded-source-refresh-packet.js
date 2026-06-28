#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  DECISION_OPTIONS,
  FORBIDDEN_AUTHORITY_FLAGS,
  GENERATED_OUTPUT_PATHS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  REFRESH_STATES,
  REFUSAL_CASES,
  REVIEW_RECORD_PATHS,
  SELECTED_DECISION,
  SIMULATION_CASE_TYPES,
  buildBundle,
  noOutputEnforcement,
  outputContents,
} = require("./build-bounded-source-refresh-packet.js");
const { REV_STD_FINDING_CLASSIFICATIONS } = require("./build-international-overlay-architecture.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-bounded-source-refresh-packet.js";
const SCHEMA_FILE = "references/schemas/bounded-source-refresh-packet.schema.v1.json";
const PLAN_REPORT = "reports/inspection-standards/bounded-source-refresh-packet-plan.json";
const ENGLAND_SIMULATION = "reports/inspection-standards/england-bounded-source-refresh-simulation.json";
const FLANDERS_SIMULATION = "reports/inspection-standards/flanders-bounded-source-refresh-simulation.json";
const DECISION_REPORT = "reports/inspection-standards/bounded-source-refresh-packet-decision.json";

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function readUtf8(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function runNode(args, env = {}) {
  return childProcess.spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    env: { ...process.env, ...env },
    windowsHide: true,
  });
}

function readCommittedUtf8(relativePath) {
  const result = childProcess.spawnSync("git", ["show", `HEAD:${relativePath}`], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
  return result.status === 0 ? result.stdout : null;
}

function fail(failures) {
  console.error("Bounded source refresh packet check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function unique(values) {
  return [...new Set(values)];
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasFragment(value, fragment) {
  return JSON.stringify(value).toLowerCase().includes(fragment.toLowerCase());
}

function pointer(schema, ref) {
  const parts = ref.replace(/^#\//, "").split("/").map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
  let current = schema;
  for (const part of parts) current = current?.[part];
  return current;
}

function typeOf(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}

function validateAgainstSchema(schemaRoot, schemaNode, value, pathLabel, errors) {
  if (!schemaNode) {
    errors.push(`${pathLabel}: missing schema node`);
    return;
  }
  if (schemaNode.$ref) {
    const resolved = pointer(schemaRoot, schemaNode.$ref);
    if (!resolved) {
      errors.push(`${pathLabel}: unresolved schema ref ${schemaNode.$ref}`);
      return;
    }
    validateAgainstSchema(schemaRoot, resolved, value, pathLabel, errors);
    return;
  }
  if (schemaNode.oneOf) {
    const matches = [];
    for (const childSchema of schemaNode.oneOf) {
      const childErrors = [];
      validateAgainstSchema(schemaRoot, childSchema, value, pathLabel, childErrors);
      if (childErrors.length === 0) matches.push(childSchema);
    }
    if (matches.length !== 1) errors.push(`${pathLabel}: expected exactly one oneOf match, got ${matches.length}`);
  }
  if (schemaNode.allOf) {
    for (const childSchema of schemaNode.allOf) validateAgainstSchema(schemaRoot, childSchema, value, pathLabel, errors);
  }
  if (schemaNode.if) {
    const ifErrors = [];
    validateAgainstSchema(schemaRoot, schemaNode.if, value, pathLabel, ifErrors);
    if (ifErrors.length === 0 && schemaNode.then) {
      validateAgainstSchema(schemaRoot, schemaNode.then, value, pathLabel, errors);
    }
  }
  if (Object.prototype.hasOwnProperty.call(schemaNode, "const") && value !== schemaNode.const) {
    errors.push(`${pathLabel}: expected const ${JSON.stringify(schemaNode.const)}, got ${JSON.stringify(value)}`);
  }
  if (schemaNode.enum && !schemaNode.enum.includes(value)) {
    errors.push(`${pathLabel}: value ${JSON.stringify(value)} not in enum`);
  }
  if (schemaNode.type) {
    const actual = typeOf(value);
    const integerOk = schemaNode.type === "integer" && Number.isInteger(value);
    if (actual !== schemaNode.type && !integerOk) {
      errors.push(`${pathLabel}: expected ${schemaNode.type}, got ${actual}`);
      return;
    }
  }
  if (typeof value === "string") {
    if (schemaNode.minLength && value.length < schemaNode.minLength) errors.push(`${pathLabel}: string shorter than ${schemaNode.minLength}`);
    if (schemaNode.pattern && !(new RegExp(schemaNode.pattern).test(value))) errors.push(`${pathLabel}: does not match pattern ${schemaNode.pattern}`);
  }
  if (Array.isArray(value)) {
    if (schemaNode.minItems !== undefined && value.length < schemaNode.minItems) errors.push(`${pathLabel}: expected at least ${schemaNode.minItems} item(s)`);
    if (schemaNode.maxItems !== undefined && value.length > schemaNode.maxItems) errors.push(`${pathLabel}: expected at most ${schemaNode.maxItems} item(s)`);
    if (Array.isArray(schemaNode.prefixItems)) {
      schemaNode.prefixItems.forEach((childSchema, index) => validateAgainstSchema(schemaRoot, childSchema, value[index], `${pathLabel}[${index}]`, errors));
    }
    if (schemaNode.items) {
      value.forEach((item, index) => validateAgainstSchema(schemaRoot, schemaNode.items, item, `${pathLabel}[${index}]`, errors));
    }
  }
  if (typeOf(value) === "object") {
    const required = schemaNode.required || [];
    for (const field of required) {
      if (!Object.prototype.hasOwnProperty.call(value, field)) errors.push(`${pathLabel}: missing required ${field}`);
    }
    const properties = schemaNode.properties || {};
    if (schemaNode.additionalProperties === false) {
      for (const field of Object.keys(value)) {
        if (!Object.prototype.hasOwnProperty.call(properties, field)) errors.push(`${pathLabel}: extra property ${field}`);
      }
    }
    for (const [field, childSchema] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, field)) {
        validateAgainstSchema(schemaRoot, childSchema, value[field], `${pathLabel}.${field}`, errors);
      }
    }
  }
}

function schemaErrors(schema, report) {
  const errors = [];
  validateAgainstSchema(schema, schema, report, "$", errors);
  return errors;
}

function tupleConsts(schema) {
  return schema && Array.isArray(schema.prefixItems) ? schema.prefixItems.map((item) => item.const) : [];
}

function checkCurrentness(failures) {
  const expected = outputContents(buildBundle());
  if (!sameList([...expected.keys()], GENERATED_OUTPUT_PATHS)) failures.push("generated output path order mismatch");
  if (process.env.BOUNDED_SOURCE_REFRESH_PACKET_CHECK_COMMITTED_OUTPUTS === "1") {
    const mismatches = [];
    let committedMissing = 0;
    for (const [relativePath, content] of expected.entries()) {
      const committed = readCommittedUtf8(relativePath);
      if (committed === null) committedMissing += 1;
      if (committed !== content) mismatches.push(relativePath);
    }
    if (committedMissing === expected.size) {
      const result = runNode([GENERATOR, "--check"]);
      if (result.status !== 0) failures.push(`generator --check failed: ${(result.stdout || "").trim()} ${(result.stderr || "").trim()}`);
      return;
    }
    if (mismatches.length) failures.push(`committed bounded source refresh packet output is stale: ${mismatches.join(", ")}`);
    return;
  }
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) failures.push(`generator --check failed: ${(result.stdout || "").trim()} ${(result.stderr || "").trim()}`);
}

function checkInputsAndOutputs(failures) {
  for (const input of INPUT_ALLOWLIST) {
    if (!fs.existsSync(repoPath(input))) failures.push(`missing input allowlist source: ${input}`);
  }
  for (const output of GENERATED_OUTPUT_PATHS) {
    if (!fs.existsSync(repoPath(output))) failures.push(`missing generated output: ${output}`);
  }
  for (const output of REVIEW_RECORD_PATHS) {
    if (!fs.existsSync(repoPath(output))) failures.push(`missing required review record: ${output}`);
  }
}

function checkNoLocalPaths(failures) {
  for (const outputPath of [...GENERATED_OUTPUT_PATHS, ...REVIEW_RECORD_PATHS].filter((item) => item.endsWith(".md") || item.endsWith(".json"))) {
    if (!fs.existsSync(repoPath(outputPath))) continue;
    const content = readUtf8(outputPath);
    if (/[A-Za-z]:\\/.test(content)) failures.push(`${outputPath}: contains local Windows absolute path`);
    if (/file:\/\//i.test(content)) failures.push(`${outputPath}: contains file URI`);
  }
}

function checkSchema(schema, failures) {
  if (schema.type !== "object") failures.push("schema must be object");
  if (schema.additionalProperties !== false) failures.push("schema additionalProperties must be false");
  if (!sameList(tupleConsts(schema.properties?.input_allowlist), INPUT_ALLOWLIST)) failures.push("schema input allowlist mismatch");
  if (!sameList(tupleConsts(schema.properties?.output_allowlist), OUTPUT_ALLOWLIST)) failures.push("schema output allowlist mismatch");
  if (!sameList(tupleConsts(schema.properties?.final_decision_options), DECISION_OPTIONS)) failures.push("schema decision options mismatch");
  const inventoryStates = tupleConsts(schema.$defs?.sourceInventoryItem?.properties?.allowed_result_states);
  if (!sameList(inventoryStates, REFRESH_STATES)) failures.push("schema refresh-state tuple mismatch");
  if (!sameList(schema.$defs?.forbiddenAuthority?.required || [], FORBIDDEN_AUTHORITY_FLAGS)) failures.push("schema forbidden authority required list mismatch");
  for (const flag of FORBIDDEN_AUTHORITY_FLAGS) {
    if (schema.$defs?.forbiddenAuthority?.properties?.[flag]?.const !== false) failures.push(`schema forbidden authority ${flag}: must be const false`);
  }
  const noOutputFlags = Object.keys(noOutputEnforcement());
  if (!sameList(schema.$defs?.noOutput?.required || [], noOutputFlags)) failures.push("schema no-output required list mismatch");
  for (const flag of noOutputFlags) {
    if (schema.$defs?.noOutput?.properties?.[flag]?.const !== false) failures.push(`schema no-output ${flag}: must be const false`);
  }
  const caseEnum = schema.$defs?.simulationCase?.properties?.case_type?.enum || [];
  if (!sameList(caseEnum, SIMULATION_CASE_TYPES)) failures.push("schema simulation case enum mismatch");
  for (const defName of ["planReport", "jurisdictionSimulationReport", "decisionReport", "sourceRefreshInventorySummary", "jurisdictionPacketCoverage", "finalDecision", "sourceCounts", "simulationCaseCounts"]) {
    if (!schema.$defs?.[defName]?.type && !schema.$defs?.[defName]?.required) failures.push(`schema.$defs.${defName}: missing report-type contract`);
  }
}

function checkSchemaInstance(label, schema, report, failures) {
  const errors = schemaErrors(schema, report);
  for (const error of errors) failures.push(`${label}: schema validation failed: ${error}`);
}

function checkFindings(label, findings, failures) {
  if (!Array.isArray(findings) || findings.length === 0) failures.push(`${label}: finding_classification must be non-empty`);
  for (const [index, finding] of (findings || []).entries()) {
    if (!REV_STD_FINDING_CLASSIFICATIONS.includes(finding.classification)) failures.push(`${label}: finding ${index} classification invalid`);
    for (const key of ["finding", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(finding[key])) failures.push(`${label}: finding ${index} missing ${key}`);
    }
  }
}

function checkCommon(label, report, failures) {
  if (report.schema_version !== 1) failures.push(`${label}: schema_version must be 1`);
  if (report.sprint_id !== "GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1") failures.push(`${label}: sprint_id mismatch`);
  if (report.internal_only !== true) failures.push(`${label}: internal_only must be true`);
  if (report.manual_invocation_only !== true) failures.push(`${label}: manual_invocation_only must be true`);
  if (report.human_review_required !== true) failures.push(`${label}: human_review_required must be true`);
  if (report.product_end_state !== "../4veco-lessen/specifications/product-end-state.md") failures.push(`${label}: product_end_state mismatch`);
  if (report.original_sprint_gate_spec !== "archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-sprint-plan.md") failures.push(`${label}: original sprint/gate spec mismatch`);
  if (report.accepted_input_decision !== "PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET") failures.push(`${label}: accepted input decision mismatch`);
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push(`${label}: input allowlist mismatch`);
  if (!sameList(report.output_allowlist, OUTPUT_ALLOWLIST)) failures.push(`${label}: output allowlist mismatch`);
  for (const flag of FORBIDDEN_AUTHORITY_FLAGS) {
    if (report.forbidden_authority?.[flag] !== false) failures.push(`${label}: forbidden authority ${flag} must be false`);
  }
  const coreIds = (report.core_requirement_checklist || []).map((item) => item.id);
  for (const required of [
    "product_end_state_and_spec_cited",
    "accepted_gate_decision_bound",
    "exact_source_inventory_complete",
    "refresh_state_model_complete",
    "england_packet_complete",
    "flanders_packet_complete",
    "expert_template_bounded",
    "simulations_and_refusals_complete",
    "no_execution_or_contact",
    "single_decision",
    "review_route_preserved",
  ]) {
    if (!coreIds.includes(required)) failures.push(`${label}: missing core requirement ${required}`);
  }
  checkFindings(label, report.finding_classification, failures);
}

function expectedSourceRecords(jurisdictionId) {
  const file = `references/data/inspection-standards/overlays/${jurisdictionId}.deepening.v1.json`;
  return readJson(file).official_source_allowlist;
}

function checkSourceInventory(report, failures) {
  const expected = expectedSourceRecords(report.jurisdiction_id);
  const expectedIds = expected.map((source) => source.source_id);
  const actualIds = (report.source_inventory || []).map((source) => source.source_id);
  if (!sameList(actualIds, expectedIds)) failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
  const actualById = new Map((report.source_inventory || []).map((source) => [source.source_id, source]));
  for (const expectedSource of expected) {
    const actual = actualById.get(expectedSource.source_id);
    if (!actual) {
      failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
      continue;
    }
    if (actual.jurisdiction_id !== report.jurisdiction_id) failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
    if (actual.official_url !== expectedSource.url) failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
    if (actual.authority !== expectedSource.authority) failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
    if (actual.source_role !== expectedSource.role) failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
    if (actual.current_access_date !== expectedSource.access_date) failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
    if (actual.current_known_version_or_publication_date !== expectedSource.publication_or_version_date) failures.push("STOP_SOURCE_INVENTORY_MISMATCH");
    if (!sameList(actual.allowed_result_states, REFRESH_STATES)) failures.push("STOP_REFRESH_STATE_MODEL_INCOMPLETE");
    for (const key of [
      "freshness_trigger",
      "staleness_condition",
      "expected_refresh_method",
      "forbidden_inference",
      "human_review_trigger",
    ]) {
      if (!nonEmptyString(actual[key])) failures.push(`STOP_SOURCE_INVENTORY_MISSING_${key.toUpperCase()}`);
    }
    if (!hasFragment(actual.expected_refresh_method, "no directory globbing")) failures.push("STOP_IMPLICIT_DISCOVERY");
    if (!hasFragment(actual.expected_refresh_method, "no") || !hasFragment(actual.expected_refresh_method, "local expert substitution")) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
  }
}

function checkRefreshStateModel(label, report, failures) {
  const actualStates = (report.refresh_state_model || []).map((state) => state.state_id);
  if (!sameList(actualStates, REFRESH_STATES)) failures.push(`${label}: STOP_REFRESH_STATE_MODEL_INCOMPLETE`);
  for (const state of report.refresh_state_model || []) {
    for (const key of ["blocks", "does_not_block", "proof_required_to_close", "allowed_next_action", "forbidden_next_action"]) {
      if (!nonEmptyString(state[key])) failures.push(`${label}: STOP_REFRESH_STATE_MODEL_MISSING_${key.toUpperCase()}`);
    }
  }
}

function checkExpertTemplate(label, template, failures) {
  const requiredClaims = [
    "legal advice",
    "compliance claims",
    "approval claims",
    "inspection-readiness claims",
    "school-evidence claims",
    "student/product-use claims",
    "support/accommodation sufficiency claims",
    "accessibility/legal sufficiency claims",
  ];
  const claims = template?.forbidden_expert_claims || [];
  for (const required of requiredClaims) {
    if (!claims.includes(required)) failures.push(`${label}: STOP_EXPERT_TEMPLATE_FORBIDDEN_CLAIM_MISSING`);
  }
  for (const key of ["allowed_questions", "required_response_fields", "stop_conditions"]) {
    if (!Array.isArray(template?.[key]) || template[key].length === 0) failures.push(`${label}: expert template missing ${key}`);
  }
  if (hasFragment(template, "official-source substitution") && !claims.includes("official-source substitution")) {
    failures.push(`${label}: STOP_EXPERT_TEMPLATE_FORBIDDEN_CLAIM_MISSING`);
  }
}

function checkNoOutput(label, value, failures) {
  const expected = noOutputEnforcement();
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (value?.[key] !== expectedValue) failures.push(`${label}: ${key} must be ${expectedValue}`);
  }
}

function checkSimulationCases(report, failures) {
  const sourceIds = new Set((report.source_inventory || []).map((source) => source.source_id));
  const actualCases = (report.simulation_cases || []).map((item) => item.case_type);
  if (!sameList(actualCases, SIMULATION_CASE_TYPES)) failures.push("STOP_SIMULATION_CASE_COVERAGE");
  for (const item of report.simulation_cases || []) {
    if (item.jurisdiction_id !== report.jurisdiction_id) failures.push("STOP_SIMULATION_JURISDICTION_MISMATCH");
    if (!REFRESH_STATES.includes(item.simulated_result_state)) failures.push("STOP_REFRESH_STATE_MODEL_INCOMPLETE");
    if (item.simulation_only !== true) failures.push("STOP_SIMULATION_ONLY_FLAG");
    if (item.source_refresh_executed !== false) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
    if (item.local_expert_contacted !== false) failures.push("STOP_LOCAL_EXPERT_CONTACT");
    if (item.local_expert_substituted !== false) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
    if (item.case_type === "non_official_source_suggested") {
      if (sourceIds.has(item.source_id)) failures.push("STOP_NON_OFFICIAL_SOURCE");
    } else if (!sourceIds.has(item.source_id)) {
      failures.push("STOP_NON_OFFICIAL_SOURCE");
    }
    checkNoOutput(`case ${item.case_type} generated_output`, item.generated_output, failures);
    for (const key of ["boundary_focus", "expected_finding", "blocks", "does_not_block", "proof_required_to_close", "allowed_next_action", "forbidden_next_action"]) {
      if (!nonEmptyString(item[key])) failures.push(`STOP_SIMULATION_CASE_MISSING_${key.toUpperCase()}`);
    }
  }
  for (const fragment of [
    "official source unchanged",
    "official source updated",
    "successor official source found",
    "official source unavailable",
    "non-official source suggested",
    "local expert cannot substitute",
    "legal/compliance overclaim",
    "support/accommodation sufficiency overclaim",
    "localized output requested",
    "personal data requested",
  ]) {
    if (!hasFragment(report.simulation_cases, fragment)) failures.push(`STOP_SIMULATION_CASE_COVERAGE:${fragment}`);
  }
  if (report.jurisdiction_id === "england" && !hasFragment(report, "England-only / not whole UK boundary")) failures.push("STOP_JURISDICTION_BOUNDARY_MISSING");
  if (report.jurisdiction_id === "flanders" && !hasFragment(report, "Flanders-only / not all Belgium boundary")) failures.push("STOP_JURISDICTION_BOUNDARY_MISSING");
}

const REQUIRED_JURISDICTION_COVERAGE = {
  england: [
    "DfE economics subject content",
    "Ofsted inspection/evaluation source",
    "Ofsted operating guide / inspection evidence-gathering source",
    "selected AQA awarding-body source boundary",
    "SEND/accessibility terminology source boundary",
    "England-only / not whole UK boundary",
  ],
  flanders: [
    "Onderwijsdoelen source boundary",
    "Referentiekader Onderwijskwaliteit / OK framework",
    "assessment-status boundary",
    "study-direction / school-network boundary",
    "Flanders-only / not all Belgium boundary",
    "accessibility/support terminology boundary",
  ],
};

function checkJurisdictionCoverage(report, failures) {
  const coverage = report.jurisdiction_packet_coverage || {};
  const required = REQUIRED_JURISDICTION_COVERAGE[report.jurisdiction_id] || [];
  const present = coverage.required_boundaries || [];
  for (const fragment of required) {
    if (!present.includes(fragment)) {
      failures.push(`STOP_JURISDICTION_COVERAGE_MISSING:${fragment}`);
    }
  }
  for (const binding of coverage.source_bindings || []) {
    if (!nonEmptyString(binding.boundary)) failures.push("STOP_JURISDICTION_COVERAGE_BINDING_MISSING");
    if (!Array.isArray(binding.source_ids) || binding.source_ids.length === 0) failures.push("STOP_JURISDICTION_COVERAGE_BINDING_MISSING");
  }
  if (report.jurisdiction_id === "england" && !hasFragment(coverage.forbidden_overclaim, "whole-UK")) failures.push("STOP_JURISDICTION_COVERAGE_MISSING:whole-UK");
  if (report.jurisdiction_id === "flanders" && !hasFragment(coverage.forbidden_overclaim, "all-Belgium")) failures.push("STOP_JURISDICTION_COVERAGE_MISSING:all-Belgium");
}

function validateSimulation(report) {
  const failures = [];
  checkCommon("simulation", report, failures);
  if (!["england", "flanders"].includes(report.jurisdiction_id)) failures.push("STOP_JURISDICTION_UNSUPPORTED");
  if (report.source_refresh_execution_performed !== false) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
  if (report.local_expert_contacted !== false) failures.push("STOP_LOCAL_EXPERT_CONTACT");
  if (report.local_expert_substitution_performed !== false) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
  checkNoOutput("simulation no-output", report.no_output_enforcement, failures);
  checkSourceInventory(report, failures);
  checkRefreshStateModel("simulation", report, failures);
  checkJurisdictionCoverage(report, failures);
  checkExpertTemplate("simulation", report.local_expert_review_request_template, failures);
  checkSimulationCases(report, failures);
  if (report.forbidden_authority?.source_refresh_executed || report.forbidden_authority?.source_refresh_execution_pilot_executed) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
  if (report.forbidden_authority?.local_expert_contacted) failures.push("STOP_LOCAL_EXPERT_CONTACT");
  if (report.forbidden_authority?.local_expert_substituted) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
  if (report.forbidden_authority?.localized_output_generated || report.forbidden_authority?.localized_paragraphs_generated || report.forbidden_authority?.localized_exercises_generated || report.forbidden_authority?.localized_answer_models_generated || report.forbidden_authority?.localized_assessment_items_generated) failures.push("STOP_LOCALIZED_OUTPUT");
  if (report.forbidden_authority?.student_facing_files_generated) failures.push("STOP_STUDENT_FACING_OUTPUT");
  if (report.forbidden_authority?.teacher_school_facing_output_generated) failures.push("STOP_TEACHER_SCHOOL_FACING_OUTPUT");
  if (report.forbidden_authority?.public_output_generated) failures.push("STOP_PUBLIC_OUTPUT");
  if (report.forbidden_authority?.personal_data_processing) failures.push("STOP_PERSONAL_DATA");
  if (report.forbidden_authority?.legal_compliance_claim || report.forbidden_authority?.approval_accreditation_claim || report.forbidden_authority?.inspection_readiness_claim || report.forbidden_authority?.op0_pta_summative_claim) failures.push("STOP_COMPLIANCE_APPROVAL_CLAIM");
  if (report.forbidden_authority?.support_sufficiency_claim || report.forbidden_authority?.accommodation_sufficiency_claim || report.forbidden_authority?.accessibility_legal_sufficiency_claim) failures.push("STOP_SUPPORT_ACCOMMODATION_CLAIM");
  if (report.forbidden_authority?.whole_uk_claim_from_england_only || report.forbidden_authority?.all_belgium_claim_from_flanders_only) failures.push("STOP_JURISDICTION_OVERGENERALISATION");
  if (report.forbidden_authority?.implicit_source_discovery || report.forbidden_authority?.directory_globbing || report.forbidden_authority?.generated_lesson_output_scanning) failures.push("STOP_IMPLICIT_DISCOVERY");
  return unique(failures);
}

function checkSimulation(label, report, failures) {
  for (const failure of validateSimulation(report)) failures.push(`${label}: ${failure}`);
  for (const fragment of ["localized student-facing chapter", "answer model text", "teacher handout", "inspection ready"]) {
    if (hasFragment(report, fragment)) failures.push(`${label}: contains forbidden fragment ${fragment}`);
  }
}

function checkPlan(report, failures) {
  checkCommon("plan", report, failures);
  checkRefreshStateModel("plan", report, failures);
  checkExpertTemplate("plan", report.local_expert_review_request_template, failures);
  checkNoOutput("plan no-output", report.no_output_enforcement, failures);
  if (!sameList(report.final_decision_options, DECISION_OPTIONS)) failures.push("plan: decision options mismatch");
  if (report.selected_target_decision !== SELECTED_DECISION) failures.push("plan: target decision mismatch");
  for (const fragment of [
    "England-only / not whole UK boundary",
    "Flanders-only / not all Belgium boundary",
    "Schema/architecture lead review",
    "England authority/source review",
    "Flanders authority/source review",
    "Teacher/economics review",
    "Legal/privacy review",
    "Accessibility/inclusion review",
    "Final lead review",
  ]) {
    if (!hasFragment(report, fragment)) failures.push(`plan: missing required fragment ${fragment}`);
  }
  if (report.source_refresh_inventory_summary?.candidate_sources_allowed !== false) failures.push("plan: candidate sources must not be allowed now");
}

function checkDecision(report, failures) {
  checkCommon("decision", report, failures);
  const decision = report.final_bounded_source_refresh_packet_decision || {};
  if (decision.selected !== SELECTED_DECISION) failures.push("decision: selected decision mismatch");
  if (!sameList(decision.allowed_options, DECISION_OPTIONS)) failures.push("decision: allowed options mismatch");
  if (decision.decision_selection_count !== 1) failures.push("decision: must select exactly one option");
  if (report.source_refresh_execution_performed !== false) failures.push("decision: source refresh execution must be false");
  if (report.local_expert_contacted !== false) failures.push("decision: local expert contact must be false");
  if (report.local_expert_substitution_performed !== false) failures.push("decision: local expert substitution must be false");
  checkNoOutput("decision no-output", report.no_output_enforcement, failures);
  for (const fragment of [
    "source refresh execution",
    "source-refresh execution pilot",
    "local expert contact",
    "localized output",
    "Scale Gate",
    "personal-data processing",
    "package or CI",
    "inspection readiness",
    "support sufficiency",
    "accommodation sufficiency",
    "accessibility/legal sufficiency",
  ]) {
    if (!hasFragment(report, fragment)) failures.push(`decision: missing blocked fragment ${fragment}`);
  }
}

function checkFixtures(failures) {
  const positives = [
    "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/england-bounded-source-refresh-simulation.sample.json",
    "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/flanders-bounded-source-refresh-simulation.sample.json",
  ];
  for (const fixture of positives) {
    const validationFailures = validateSimulation(readJson(fixture));
    if (validationFailures.length > 0) failures.push(`${fixture}: expected PASS, got ${validationFailures.join(", ")}`);
  }
  for (const [file, expectedCode] of NEGATIVE_FIXTURES) {
    const fixturePath = `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/${file}`;
    const fixture = readJson(fixturePath);
    const validationFailures = validateSimulation(fixture.packet || fixture);
    if (!validationFailures.some((failure) => failure.includes(expectedCode))) {
      failures.push(`${fixturePath}: expected ${expectedCode}, got ${validationFailures.join(", ") || "PASS"}`);
    }
  }
}

function checkCliRefusals(failures) {
  for (const [args, expectedCode] of REFUSAL_CASES) {
    const result = runNode([GENERATOR, ...args]);
    const output = `${result.stdout}\n${result.stderr}`;
    if (result.status === 0) failures.push(`forbidden args ${args.join(" ")} should fail`);
    if (!output.includes(expectedCode)) failures.push(`forbidden args ${args.join(" ")} missing ${expectedCode}`);
  }
}

function checkReviewRecords(failures) {
  const [specialistPath, finalLeadPath] = REVIEW_RECORD_PATHS;
  if (fs.existsSync(repoPath(specialistPath))) {
    const specialist = readUtf8(specialistPath);
    for (const fragment of [
      "Schema/architecture lead",
      "England authority/source reviewer",
      "Flanders authority/source reviewer",
      "Teacher/economics reviewer",
      "Legal/privacy reviewer",
      "Accessibility/inclusion reviewer",
      "All specialist blockers closed",
    ]) {
      if (!specialist.includes(fragment)) failures.push(`${specialistPath}: missing ${fragment}`);
    }
    if (/\bunresolved\b/i.test(specialist)) failures.push(`${specialistPath}: contains unresolved marker`);
  }
  if (fs.existsSync(repoPath(finalLeadPath))) {
    const finalLead = readUtf8(finalLeadPath);
    for (const fragment of ["Verdict: PASS", SELECTED_DECISION, "READY_FOR_HUMAN_REVIEW"]) {
      if (!finalLead.includes(fragment)) failures.push(`${finalLeadPath}: missing ${fragment}`);
    }
  }
}

function run() {
  const failures = [];
  checkCurrentness(failures);
  checkInputsAndOutputs(failures);
  checkNoLocalPaths(failures);
  const schema = readJson(SCHEMA_FILE);
  const plan = readJson(PLAN_REPORT);
  const england = readJson(ENGLAND_SIMULATION);
  const flanders = readJson(FLANDERS_SIMULATION);
  const decision = readJson(DECISION_REPORT);
  checkSchema(schema, failures);
  checkSchemaInstance("plan", schema, plan, failures);
  checkSchemaInstance("england simulation", schema, england, failures);
  checkSchemaInstance("flanders simulation", schema, flanders, failures);
  checkSchemaInstance("decision", schema, decision, failures);
  checkSchemaInstance("positive england fixture", schema, readJson("references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/england-bounded-source-refresh-simulation.sample.json"), failures);
  checkSchemaInstance("positive flanders fixture", schema, readJson("references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/flanders-bounded-source-refresh-simulation.sample.json"), failures);
  checkSchemaInstance("positive decision fixture", schema, readJson("references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/bounded-source-refresh-packet-decision.sample.json"), failures);
  checkPlan(plan, failures);
  checkSimulation("england simulation", england, failures);
  checkSimulation("flanders simulation", flanders, failures);
  checkDecision(decision, failures);
  checkFixtures(failures);
  checkCliRefusals(failures);
  checkReviewRecords(failures);
  if (failures.length) fail(unique(failures));
  console.log(`OK bounded source refresh packet sources=${england.source_inventory.length + flanders.source_inventory.length} states=${REFRESH_STATES.length} cases=${SIMULATION_CASE_TYPES.length * 2} negative_fixtures=${NEGATIVE_FIXTURES.length} decision=${SELECTED_DECISION}`);
}

if (require.main === module) run();

module.exports = {
  run,
  validateSimulation,
};
