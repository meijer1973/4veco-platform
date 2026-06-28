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
  REFUSAL_CASES,
  REVIEW_RECORD_PATHS,
  SELECTED_DECISION,
  SIMULATION_CASE_TYPES,
  SOURCE_CONDITIONS,
  buildBundle,
  noOutputEnforcement,
  outputContents,
} = require("./build-local-expert-source-refresh-gate.js");
const { REV_STD_FINDING_CLASSIFICATIONS } = require("./build-international-overlay-architecture.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-local-expert-source-refresh-gate.js";
const SCHEMA_FILE = "references/schemas/local-expert-source-refresh-gate.schema.v1.json";
const PLAN_REPORT = "reports/inspection-standards/local-expert-source-refresh-gate-plan.json";
const ENGLAND_SIMULATION = "reports/inspection-standards/england-source-refresh-gate-simulation.json";
const FLANDERS_SIMULATION = "reports/inspection-standards/flanders-source-refresh-gate-simulation.json";
const DECISION_REPORT = "reports/inspection-standards/local-expert-source-refresh-gate-decision.json";

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
  console.error("Local expert source refresh gate check failed:");
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

function checkCurrentness(failures) {
  const expected = outputContents(buildBundle());
  if (!sameList([...expected.keys()], GENERATED_OUTPUT_PATHS)) failures.push("generated output path order mismatch");
  if (process.env.LOCAL_EXPERT_SOURCE_REFRESH_GATE_CHECK_COMMITTED_OUTPUTS === "1") {
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
    if (mismatches.length) failures.push(`committed local expert source refresh gate output is stale: ${mismatches.join(", ")}`);
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

function tupleConsts(schema) {
  return schema && Array.isArray(schema.prefixItems) ? schema.prefixItems.map((item) => item.const) : [];
}

function checkClosedObject(label, schema, failures) {
  if (!schema || schema.type !== "object") failures.push(`${label}: must be an object schema`);
  if (!schema || schema.additionalProperties !== false) failures.push(`${label}: additionalProperties must be false`);
}

function checkSchema(schema, failures) {
  checkClosedObject("schema", schema, failures);
  if (!sameList(tupleConsts(schema.properties?.input_allowlist), INPUT_ALLOWLIST)) failures.push("schema input allowlist mismatch");
  if (!sameList(tupleConsts(schema.properties?.output_allowlist), OUTPUT_ALLOWLIST)) failures.push("schema output allowlist mismatch");
  if (!sameList(tupleConsts(schema.properties?.source_conditions), SOURCE_CONDITIONS)) failures.push("schema source condition tuple mismatch");
  if (!sameList(tupleConsts(schema.properties?.gate_simulation_case_types), SIMULATION_CASE_TYPES)) failures.push("schema case type tuple mismatch");
  const boundary = schema.properties?.forbidden_authority || {};
  if (!sameList(boundary.required || [], FORBIDDEN_AUTHORITY_FLAGS)) failures.push("schema forbidden authority required list mismatch");
  for (const flag of FORBIDDEN_AUTHORITY_FLAGS) {
    if (boundary.properties?.[flag]?.const !== false) failures.push(`schema forbidden authority ${flag}: must be const false`);
  }
  for (const defName of ["finding", "sourceProtocol", "localExpertRoleContract", "simulationCase"]) {
    checkClosedObject(`schema.$defs.${defName}`, schema.$defs?.[defName], failures);
    if (!schema.$defs?.[defName]?.properties) failures.push(`schema.$defs.${defName}: must define properties`);
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
  if (report.internal_only !== true) failures.push(`${label}: internal_only must be true`);
  if (report.manual_invocation_only !== true) failures.push(`${label}: manual_invocation_only must be true`);
  if (report.human_review_required !== true) failures.push(`${label}: human_review_required must be true`);
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push(`${label}: input allowlist mismatch`);
  if (!sameList(report.output_allowlist, OUTPUT_ALLOWLIST)) failures.push(`${label}: output allowlist mismatch`);
  for (const flag of FORBIDDEN_AUTHORITY_FLAGS) {
    if (report.forbidden_authority?.[flag] !== false) failures.push(`${label}: forbidden authority ${flag} must be false`);
  }
  checkFindings(label, report.finding_classification, failures);
}

function officialSourceIds(report) {
  return new Set((report.source_protocol || []).map((source) => source.source_id));
}

function expectedSourceRecords(jurisdictionId) {
  const file = jurisdictionId === "england"
    ? "references/data/inspection-standards/overlays/england.deepening.v1.json"
    : "references/data/inspection-standards/overlays/flanders.deepening.v1.json";
  return readJson(file).official_source_allowlist;
}

function urlHost(value) {
  try {
    return new URL(value).hostname;
  } catch (_error) {
    return "";
  }
}

function checkSourceAllowlist(report, failures) {
  const expected = expectedSourceRecords(report.jurisdiction_id);
  const expectedIds = expected.map((source) => source.source_id);
  const actualIds = (report.source_protocol || []).map((source) => source.source_id);
  if (!sameList(actualIds, expectedIds)) failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
  const actualById = new Map((report.source_protocol || []).map((source) => [source.source_id, source]));
  for (const expectedSource of expected) {
    const actual = actualById.get(expectedSource.source_id);
    if (!actual) {
      failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
      continue;
    }
    if (actual.official_url !== expectedSource.url) failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
    if (urlHost(actual.official_url) !== urlHost(expectedSource.url)) failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
    if (actual.source_role !== expectedSource.role) failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
    if (actual.current_access_date !== expectedSource.access_date) failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
    if (actual.allowed_inference !== expectedSource.allowed_use) failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
    if (actual.forbidden_inference !== expectedSource.forbidden_inference) failures.push("STOP_SOURCE_ALLOWLIST_MISMATCH");
  }
}

const REQUIRED_BOUNDARY_FOCUS = {
  england: [
    "DfE subject-content boundary",
    "selected AQA representative source boundary",
    "AQA assessment-resource source-gap boundary",
    "England-only / not whole UK boundary",
    "not all awarding bodies",
    "SEND/accessibility support-sufficiency refusal",
  ],
  flanders: [
    "Onderwijsdoelen source boundary",
    "OK-framework source boundary",
    "study-direction / school-network constraints",
    "Flanders-only / not all Belgium boundary",
    "Flemish inclusion and learner-support evidence remains school-owned",
  ],
};

function checkBoundaryFocus(report, failures) {
  const joined = (report.gate_simulation_cases || []).map((item) => item.boundary_focus).join("\n");
  for (const fragment of REQUIRED_BOUNDARY_FOCUS[report.jurisdiction_id] || []) {
    if (!joined.includes(fragment)) failures.push(`STOP_SIMULATION_BOUNDARY_COVERAGE:${fragment}`);
  }
  if (report.jurisdiction_id === "flanders" && !hasFragment(report.jurisdiction_specific_gate, "leersteun")) {
    failures.push("STOP_FLANDERS_ACCESSIBILITY_BOUNDARY");
  }
  if (report.jurisdiction_id === "flanders" && !hasFragment(report, "learner-support")) {
    failures.push("STOP_FLANDERS_ACCESSIBILITY_BOUNDARY");
  }
}

function checkNoOutput(label, value, failures) {
  const expected = noOutputEnforcement();
  for (const [key, expectedValue] of Object.entries(expected)) {
    if (value?.[key] !== expectedValue) failures.push(`${label}: ${key} must be ${expectedValue}`);
  }
}

function validateSimulation(report) {
  const failures = [];
  checkCommon("simulation", report, failures);
  if (!["england", "flanders"].includes(report.jurisdiction_id)) failures.push("STOP_JURISDICTION_UNSUPPORTED");
  if (report.source_refresh_execution_performed !== false) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
  if (report.local_expert_substitution_performed !== false) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
  checkNoOutput("simulation no-output", report.no_output_enforcement, failures);

  const sourceIds = officialSourceIds(report);
  checkSourceAllowlist(report, failures);
  for (const protocol of report.source_protocol || []) {
    for (const key of [
      "source_id",
      "jurisdiction_id",
      "source_role",
      "official_url",
      "current_access_date",
      "freshness_trigger",
      "staleness_condition",
      "replacement_source_rule",
      "human_review_trigger",
      "allowed_inference",
      "forbidden_inference",
    ]) {
      if (!nonEmptyString(protocol[key])) failures.push(`STOP_SOURCE_PROTOCOL_MISSING_${key.toUpperCase()}`);
    }
    if (!/^https?:\/\//.test(protocol.official_url || "")) failures.push("STOP_SOURCE_PROTOCOL_OFFICIAL_URL");
    if (protocol.jurisdiction_id !== report.jurisdiction_id) failures.push("STOP_SOURCE_PROTOCOL_JURISDICTION");
    const conditions = (protocol.condition_handling || []).map((item) => item.condition);
    if (!sameList(conditions, SOURCE_CONDITIONS)) failures.push("STOP_SOURCE_CONDITION_COVERAGE");
    for (const item of protocol.condition_handling || []) {
      for (const key of ["gate_action", "blocks", "proof_required_to_close"]) {
        if (!nonEmptyString(item[key])) failures.push(`STOP_SOURCE_CONDITION_MISSING_${key.toUpperCase()}`);
      }
    }
  }

  const role = report.local_expert_role_contract || {};
  for (const key of [
    "jurisdiction",
    "jurisdiction_label",
    "expert_role",
    "allowed_review_scope",
    "forbidden_authority",
    "source_review_responsibility",
    "curriculum_assessment_review_responsibility",
    "language_terminology_review_responsibility",
    "accessibility_inclusion_review_responsibility",
    "legal_claim_boundary",
    "school_owned_evidence_boundary",
    "conflict_uncertainty_handling",
    "required_output_format",
  ]) {
    if (role[key] === undefined || (Array.isArray(role[key]) && role[key].length === 0) || (!Array.isArray(role[key]) && !nonEmptyString(role[key]))) {
      failures.push(`STOP_LOCAL_EXPERT_ROLE_MISSING_${key.toUpperCase()}`);
    }
  }
  if (role.jurisdiction !== report.jurisdiction_id) failures.push("STOP_LOCAL_EXPERT_ROLE_JURISDICTION");

  const caseTypes = (report.gate_simulation_cases || []).map((item) => item.case_type);
  if (!sameList(caseTypes, SIMULATION_CASE_TYPES)) failures.push("STOP_SIMULATION_CASE_COVERAGE");
  checkBoundaryFocus(report, failures);
  for (const item of report.gate_simulation_cases || []) {
    if (!sourceIds.has(item.source_id) && item.case_type !== "non_official_source_proposed") failures.push("STOP_NON_OFFICIAL_SOURCE");
    if (item.case_type === "non_official_source_proposed" && sourceIds.has(item.source_id)) failures.push("STOP_NON_OFFICIAL_SOURCE");
    if (!SOURCE_CONDITIONS.includes(item.source_condition)) failures.push("STOP_SOURCE_CONDITION_COVERAGE");
    if (item.simulation_only !== true) failures.push("STOP_SIMULATION_ONLY_FLAG");
    if (item.source_refresh_executed !== false) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
    if (item.local_expert_substituted !== false) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
    if (!nonEmptyString(item.boundary_focus)) failures.push("STOP_SIMULATION_BOUNDARY_COVERAGE");
    checkNoOutput(`case ${item.case_type} no-output`, item.generated_output, failures);
    if (item.generated_output?.localized_paragraphs || item.generated_output?.localized_exercises || item.generated_output?.answer_models || item.generated_output?.localized_assessment_items) {
      failures.push("STOP_LOCALIZED_OUTPUT");
    }
    if (item.generated_output?.student_facing_files) failures.push("STOP_STUDENT_FACING_OUTPUT");
    if (item.generated_output?.teacher_school_output) failures.push("STOP_TEACHER_SCHOOL_FACING_OUTPUT");
    if (item.generated_output?.public_output) failures.push("STOP_PUBLIC_OUTPUT");
    if (item.generated_output?.personal_data) failures.push("STOP_PERSONAL_DATA");
    for (const key of ["blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(item[key])) failures.push(`STOP_SIMULATION_CASE_MISSING_${key.toUpperCase()}`);
    }
  }

  if (report.personal_data_fields) failures.push("STOP_PERSONAL_DATA");
  if (report.forbidden_authority?.legal_compliance_claim || report.forbidden_authority?.inspection_readiness_claim || report.forbidden_authority?.approval_accreditation_claim) {
    failures.push("STOP_COMPLIANCE_APPROVAL_CLAIM");
  }
  if (report.forbidden_authority?.support_sufficiency_claim || report.forbidden_authority?.accommodation_sufficiency_claim) {
    failures.push("STOP_SUPPORT_ACCOMMODATION_CLAIM");
  }
  if (report.forbidden_authority?.individual_adjustment_claim) failures.push("STOP_INDIVIDUAL_ADJUSTMENT_CLAIM");
  if (report.forbidden_authority?.reasonable_adjustment_claim) failures.push("STOP_REASONABLE_ADJUSTMENT_CLAIM");
  if (report.forbidden_authority?.learner_support_record_claim) failures.push("STOP_LEARNER_SUPPORT_RECORD_CLAIM");
  if (report.forbidden_authority?.support_records_personal_data) failures.push("STOP_SUPPORT_RECORDS_PERSONAL_DATA");
  if (report.forbidden_authority?.whole_uk_claim_from_england_only || report.forbidden_authority?.all_belgium_claim_from_flanders_only) {
    failures.push("STOP_JURISDICTION_OVERGENERALISATION");
  }
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
  if (!Array.isArray(report.local_expert_role_contracts) || report.local_expert_role_contracts.length !== 2) failures.push("plan: must include two local expert contracts");
  if (!sameList(report.source_refresh_protocol_summary?.source_conditions || [], SOURCE_CONDITIONS)) failures.push("plan: source condition summary mismatch");
  if (report.source_refresh_protocol_summary?.source_refresh_execution_performed !== false) failures.push("plan: source refresh execution must be false");
  if (report.source_refresh_protocol_summary?.local_expert_substitution_performed !== false) failures.push("plan: local expert substitution must be false");
  for (const fragment of ["England-only / not whole UK boundary", "Flanders-only / not all Belgium boundary", "Accessibility/inclusion review"]) {
    if (!hasFragment(report, fragment)) failures.push(`plan: missing required fragment ${fragment}`);
  }
}

function checkDecision(report, failures) {
  checkCommon("decision", report, failures);
  const decision = report.final_local_expert_source_refresh_gate_decision || {};
  if (decision.selected !== SELECTED_DECISION) failures.push("decision: selected decision mismatch");
  if (!sameList(decision.allowed_options, DECISION_OPTIONS)) failures.push("decision: allowed options mismatch");
  if (decision.decision_selection_count !== 1) failures.push("decision: must select exactly one option");
  if (report.source_refresh_execution_performed !== false) failures.push("decision: source refresh execution must be false");
  if (report.local_expert_substitution_performed !== false) failures.push("decision: local expert substitution must be false");
  for (const fragment of [
    "source refresh execution",
    "local expert substitution",
    "localized output",
    "Scale Gate",
    "personal-data processing",
    "individual adjustment",
    "reasonable adjustment",
    "learner/support-record",
    "support-record personal-data",
    "inspection readiness",
    "support sufficiency",
    "accommodation sufficiency",
  ]) {
    if (!hasFragment(report, fragment)) failures.push(`decision: missing blocked fragment ${fragment}`);
  }
}

function checkFixtures(failures) {
  const positives = [
    "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/england-source-refresh-gate-simulation.sample.json",
    "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/flanders-source-refresh-gate-simulation.sample.json",
  ];
  for (const fixture of positives) {
    const validationFailures = validateSimulation(readJson(fixture));
    if (validationFailures.length > 0) failures.push(`${fixture}: expected PASS, got ${validationFailures.join(", ")}`);
  }
  for (const [file, expectedCode] of NEGATIVE_FIXTURES) {
    const fixturePath = `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/${file}`;
    const fixture = readJson(fixturePath);
    const validationFailures = validateSimulation(fixture.gate_simulation || fixture);
    if (!validationFailures.includes(expectedCode)) {
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
  checkSchemaInstance("positive england fixture", schema, readJson("references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/england-source-refresh-gate-simulation.sample.json"), failures);
  checkSchemaInstance("positive flanders fixture", schema, readJson("references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/flanders-source-refresh-gate-simulation.sample.json"), failures);
  checkPlan(plan, failures);
  checkSimulation("england simulation", england, failures);
  checkSimulation("flanders simulation", flanders, failures);
  checkDecision(decision, failures);
  checkFixtures(failures);
  checkCliRefusals(failures);
  checkReviewRecords(failures);
  if (failures.length) fail(unique(failures));
  console.log(`OK local expert source refresh gate simulations=2 cases=${SIMULATION_CASE_TYPES.length * 2} negative_fixtures=${NEGATIVE_FIXTURES.length} decision=${SELECTED_DECISION}`);
}

if (require.main === module) run();

module.exports = {
  run,
  validateSimulation,
};
