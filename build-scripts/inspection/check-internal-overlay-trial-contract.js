#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  ALLOWED_TRANSFORMATION_ACTIONS,
  CORE_REQUIREMENTS,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_PATHS,
  POSITIVE_FIXTURES,
  REFUSAL_CASES,
  SELECTED_TRIAL_CONTRACT_DECISION,
  TRIAL_BLOCKED_AUTHORITY,
  buildBundle,
  outputContents,
} = require("./build-internal-overlay-trial-contract.js");
const {
  REV_STD_FINDING_CLASSIFICATIONS,
} = require("./build-international-overlay-architecture.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-internal-overlay-trial-contract.js";
const SCHEMA_FILE = "references/schemas/internal-overlay-trial-contract.schema.v1.json";
const ENGLAND_CONTRACT = "reports/inspection-standards/england-internal-overlay-trial-contract.json";
const FLANDERS_CONTRACT = "reports/inspection-standards/flanders-internal-overlay-trial-contract.json";
const VALIDATION_REPORT = "reports/inspection-standards/internal-overlay-trial-contract-validation.json";
const TRACE_REPORT = "reports/inspection-standards/internal-overlay-no-output-trial-trace.json";
const DECISION_REPORT = "reports/inspection-standards/internal-overlay-trial-contract-decision.json";
const ENGLAND_CROSSWALK = "reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json";
const FLANDERS_CROSSWALK = "reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json";
const ENGLAND_DESCRIPTOR = "references/data/inspection-standards/overlays/england.deepening.v1.json";
const FLANDERS_DESCRIPTOR = "references/data/inspection-standards/overlays/flanders.deepening.v1.json";

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
  console.error("Internal overlay trial-contract check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function unique(values) {
  return [...new Set(values)];
}

function hasFragment(value, fragment) {
  return JSON.stringify(value).toLowerCase().includes(fragment.toLowerCase());
}

function sourceIds(descriptor) {
  return new Set((descriptor.official_source_allowlist || []).map((source) => source.source_id));
}

function expectedConceptIds(crosswalk) {
  return (crosswalk.crosswalk_rows || []).map((row) => row.concept_id);
}

function checkCurrentness(failures) {
  const expected = outputContents(buildBundle());
  if (!sameList([...expected.keys()], OUTPUT_PATHS)) failures.push("OUTPUT_PATHS order mismatch");
  if (process.env.INTERNAL_OVERLAY_TRIAL_CONTRACT_CHECK_COMMITTED_OUTPUTS === "1") {
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
    if (mismatches.length) failures.push(`committed internal overlay trial-contract output is stale: ${mismatches.join(", ")}`);
    return;
  }
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) failures.push(`generator --check failed: ${(result.stdout || "").trim()} ${(result.stderr || "").trim()}`);
}

function checkInputsAndOutputs(failures) {
  for (const input of INPUT_ALLOWLIST) {
    if (!fs.existsSync(repoPath(input))) failures.push(`missing input allowlist source: ${input}`);
  }
  for (const outputPath of OUTPUT_PATHS) {
    if (!fs.existsSync(repoPath(outputPath))) failures.push(`missing output: ${outputPath}`);
  }
}

function checkNoLocalPaths(failures) {
  for (const outputPath of OUTPUT_PATHS.filter((item) => item.endsWith(".md") || item.endsWith(".json"))) {
    const content = readUtf8(outputPath);
    if (/[A-Za-z]:\\/.test(content)) failures.push(`${outputPath}: contains local Windows absolute path`);
    if (/file:\/\//i.test(content)) failures.push(`${outputPath}: contains file URI`);
  }
}

function tupleConsts(schema) {
  return (schema && Array.isArray(schema.prefixItems)) ? schema.prefixItems.map((item) => item.const) : [];
}

function checkClosedObject(label, schema, failures) {
  if (!schema || schema.type !== "object") failures.push(`${label}: must be an object schema`);
  if (!schema || schema.additionalProperties !== false) failures.push(`${label}: additionalProperties must be false`);
}

function checkRequired(label, schema, required, failures) {
  const actual = schema && Array.isArray(schema.required) ? schema.required : [];
  for (const key of required) {
    if (!actual.includes(key)) failures.push(`${label}: missing required ${key}`);
  }
}

function checkSchemaStrictness(schema, failures) {
  checkClosedObject("schema", schema, failures);
  checkRequired("schema", schema, [
    "contract_identity_authority",
    "jurisdiction_source_binding",
    "book_scope_binding",
    "source_freshness_invalidation",
    "no_output_enforcement",
    "refusal_conditions",
    "contract_rows",
    "closure_decision",
    "finding_classification",
  ], failures);

  const defs = schema.$defs || {};
  for (const defName of [
    "contractIdentityAuthority",
    "sourcePolicy",
    "sourceFreshness",
    "jurisdictionSourceBinding",
    "bookScopeBinding",
    "sourceFreshnessInvalidation",
    "noOutputEnforcement",
    "refusalCondition",
    "sourceBinding",
    "transformationRationale",
    "schoolOwnedEvidenceNeeded",
    "localExpertNeeded",
    "blockerDisplay",
    "reviewDisposition",
    "contractRow",
    "closureDecision",
    "findingClassification",
  ]) {
    checkClosedObject(`schema.$defs.${defName}`, defs[defName], failures);
  }

  const rows = schema.properties?.contract_rows || {};
  if (rows.minItems !== 10 || rows.maxItems !== 10) failures.push("schema.contract_rows: must require exactly 10 rows");
  if (rows.items?.$ref !== "#/$defs/contractRow") failures.push("schema.contract_rows: items must reference contractRow");

  const row = defs.contractRow || {};
  checkRequired("schema.$defs.contractRow", row, [
    "source_ids",
    "source_bindings",
    "freshness_triggers",
    "chapter_paragraph",
    "concept_id",
    "crosswalk_row_id",
    "transformation_actions",
    "transformation_rationale",
    "forbidden_inference",
    "school_owned_evidence_needed",
    "local_expert_needed",
    "blocker_display",
    "proof_required_to_close",
    "review_disposition",
  ], failures);
  const actionEnum = row.properties?.transformation_actions?.items?.enum || [];
  if (!sameList(actionEnum, ALLOWED_TRANSFORMATION_ACTIONS)) failures.push("schema.$defs.contractRow: transformation action enum mismatch");

  const sourcePolicy = defs.sourcePolicy || {};
  const sourcePolicyFlags = {
    explicit_source_allowlist_only: true,
    implicit_source_discovery: false,
    directory_globbing_allowed: false,
    generated_lesson_output_scanning: false,
    automated_source_refresh: false,
  };
  for (const [key, expected] of Object.entries(sourcePolicyFlags)) {
    if (sourcePolicy.properties?.[key]?.const !== expected) failures.push(`schema.$defs.sourcePolicy: ${key} must be const ${expected}`);
  }

  const noOutput = defs.noOutputEnforcement || {};
  for (const key of [
    "localized_output_requested",
    "localized_output_generated",
    "localized_textbook_paragraphs_generated",
    "localized_exercises_generated",
    "localized_answer_models_generated",
    "student_facing_files_generated",
    "teacher_school_facing_output_generated",
    "public_output_generated",
    "evidence_pack_generated",
    "product_route_integration_requested",
    "scale_gate_integration_requested",
    "personal_data_fields_present",
  ]) {
    if (noOutput.properties?.[key]?.const !== false) failures.push(`schema.$defs.noOutputEnforcement: ${key} must be const false`);
  }
  if (noOutput.properties?.internal_trace_only?.const !== true) failures.push("schema.$defs.noOutputEnforcement: internal_trace_only must be const true");

  const boundary = schema.properties?.output_boundary || {};
  checkClosedObject("schema.output_boundary", boundary, failures);
  if (!sameList(boundary.required || [], TRIAL_BLOCKED_AUTHORITY)) failures.push("schema.output_boundary: required flag list mismatch");
  for (const flag of TRIAL_BLOCKED_AUTHORITY) {
    if (boundary.properties?.[flag]?.const !== false) failures.push(`schema.output_boundary: ${flag} must be const false`);
  }

  const decision = defs.closureDecision || {};
  if (decision.properties?.selected?.const !== SELECTED_TRIAL_CONTRACT_DECISION) failures.push("schema.$defs.closureDecision: selected const mismatch");
  if (!sameList(tupleConsts(decision.properties?.allowed_options), DECISION_OPTIONS)) failures.push("schema.$defs.closureDecision: allowed option tuple mismatch");
  if (decision.properties?.decision_selection_count?.const !== 1) failures.push("schema.$defs.closureDecision: decision_selection_count must be const 1");

  const refusals = defs.refusalCondition?.properties?.refusal_code?.enum || [];
  const expectedRefusals = unique(REFUSAL_CASES.map(([, code]) => code));
  if (!sameList(refusals, expectedRefusals)) failures.push("schema.$defs.refusalCondition: refusal code enum mismatch");
}

function checkCommon(reportId, report, failures) {
  if (report.schema_version !== 1) failures.push(`${reportId}: schema_version must be 1`);
  if (report.internal_only !== true) failures.push(`${reportId}: internal_only must be true`);
  if (report.manual_invocation_only !== true) failures.push(`${reportId}: manual_invocation_only must be true`);
  if (report.human_review_required !== true) failures.push(`${reportId}: human_review_required must be true`);
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push(`${reportId}: input allowlist mismatch`);
  if (!sameList(report.output_allowlist, OUTPUT_PATHS)) failures.push(`${reportId}: output allowlist mismatch`);
  const checklistIds = (report.core_requirement_checklist || []).map((item) => item.id);
  if (!sameList(checklistIds, CORE_REQUIREMENTS.map(([id]) => id))) failures.push(`${reportId}: core requirement checklist mismatch`);
  for (const [flag, value] of Object.entries(report.output_boundary || {})) {
    if (value !== false) failures.push(`${reportId}: output boundary ${flag} must remain false`);
  }
}

function checkFindings(reportId, findings, failures) {
  if (!Array.isArray(findings) || findings.length === 0) {
    failures.push(`${reportId}: missing finding classifications`);
    return;
  }
  for (const [index, finding] of findings.entries()) {
    for (const key of ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(finding && finding[key])) failures.push(`${reportId} finding ${index}: missing ${key}`);
    }
    if (!REV_STD_FINDING_CLASSIFICATIONS.includes(finding && finding.classification)) {
      failures.push(`${reportId} finding ${index}: unsupported classification ${finding && finding.classification}`);
    }
    if (/pass with flags/i.test(JSON.stringify(finding))) failures.push(`${reportId} finding ${index}: PASS WITH FLAGS wording is not allowed`);
  }
}

function validateContract(contract, options = {}) {
  const failures = [];
  const jurisdictionId = options.jurisdictionId || contract.jurisdiction_source_binding?.jurisdiction_id || contract.contract_rows?.[0]?.jurisdiction_id;
  const descriptor = jurisdictionId === "flanders" ? readJson(FLANDERS_DESCRIPTOR) : readJson(ENGLAND_DESCRIPTOR);
  const crosswalk = jurisdictionId === "flanders" ? readJson(FLANDERS_CROSSWALK) : readJson(ENGLAND_CROSSWALK);
  const allowedSources = sourceIds(descriptor);
  const expectedRows = expectedConceptIds(crosswalk);

  if (contract.internal_only !== true) failures.push("STOP_NOT_INTERNAL_ONLY");
  if (contract.manual_invocation_only !== true) failures.push("STOP_NOT_MANUAL_ONLY");
  if (contract.contract_identity_authority?.accepted_planning_decision !== "PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT") {
    failures.push("STOP_ACCEPTED_DECISION_MISMATCH");
  }
  if (contract.jurisdiction_source_binding?.source_policy?.implicit_source_discovery !== false) failures.push("STOP_IMPLICIT_SOURCE_DISCOVERY");
  if (contract.jurisdiction_source_binding?.source_policy?.directory_globbing_allowed !== false) failures.push("STOP_DIRECTORY_GLOBBING");
  if (contract.jurisdiction_source_binding?.source_policy?.generated_lesson_output_scanning !== false) failures.push("STOP_GENERATED_LESSON_SCAN");
  if (/stale/i.test(String(contract.source_freshness_invalidation?.freshness_status || ""))) failures.push("STOP_STALE_SOURCE");

  const rows = asArray(contract.contract_rows);
  const rowConcepts = rows.map((row) => row.concept_id);
  const missing = expectedRows.filter((conceptId) => !rowConcepts.includes(conceptId));
  const extra = rowConcepts.filter((conceptId) => !expectedRows.includes(conceptId));
  if (rows.length !== expectedRows.length || missing.length > 0 || extra.length > 0) failures.push("STOP_MISSING_CROSSWALK_ROW");

  const noOutput = contract.no_output_enforcement || {};
  if (noOutput.localized_output_requested === true || noOutput.localized_output_generated === true || noOutput.localized_textbook_paragraphs_generated === true || noOutput.localized_exercises_generated === true || noOutput.localized_answer_models_generated === true) failures.push("STOP_LOCALIZED_OUTPUT");
  if (noOutput.student_facing_files_generated === true) failures.push("STOP_STUDENT_FACING_OUTPUT");
  if (noOutput.teacher_school_facing_output_generated === true) failures.push("STOP_TEACHER_SCHOOL_FACING_OUTPUT");
  if (noOutput.public_output_generated === true) failures.push("STOP_PUBLIC_OUTPUT");
  if (noOutput.personal_data_fields_present === true || Object.prototype.hasOwnProperty.call(contract, "personal_data_fields")) failures.push("STOP_PERSONAL_DATA");
  if (noOutput.product_route_integration_requested === true || noOutput.scale_gate_integration_requested === true) failures.push("STOP_PRODUCT_OR_SCALE_GATE");

  const boundary = contract.output_boundary || {};
  if (boundary.legal_sufficiency_claim === true || boundary.legal_compliance_claim === true || boundary.selected_jurisdiction_legal_sufficiency_claim === true || boundary.selected_jurisdiction_compliance_claim === true) failures.push("STOP_LEGAL_COMPLIANCE_CLAIM");
  if (boundary.inspection_readiness_claim === true || boundary.selected_jurisdiction_inspection_readiness_claim === true) failures.push("STOP_INSPECTION_READINESS_CLAIM");
  if (boundary.support_sufficiency_claim === true || boundary.accommodation_sufficiency_claim === true || boundary.support_or_accommodation_sufficiency_claim === true || boundary.individual_adjustment_claim === true || boundary.support_records_personal_data === true) failures.push("STOP_SUPPORT_ACCOMMODATION_CLAIM");
  if (boundary.product_route_adoption === true || boundary.scale_gate_integration === true || boundary.selected_jurisdiction_product_route === true || boundary.selected_jurisdiction_scale_gate === true) failures.push("STOP_PRODUCT_OR_SCALE_GATE");

  for (const row of rows) {
    if (row.jurisdiction_id !== jurisdictionId) failures.push("STOP_JURISDICTION_MISMATCH");
    if (!nonEmptyString(row.chapter_paragraph)) failures.push("STOP_ROW_MISSING_CHAPTER_PARAGRAPH");
    if (!nonEmptyString(row.crosswalk_row_id)) failures.push("STOP_ROW_MISSING_CROSSWALK_ROW_ID");
    if (!Array.isArray(row.source_ids) || row.source_ids.length === 0) failures.push("STOP_ROW_MISSING_SOURCE_IDS");
    for (const sourceId of row.source_ids || []) {
      if (!allowedSources.has(sourceId)) failures.push("STOP_UNKNOWN_SOURCE_ID");
    }
    for (const binding of asArray(row.source_bindings)) {
      if (!allowedSources.has(binding.source_id)) failures.push("STOP_UNKNOWN_SOURCE_ID");
      if (!nonEmptyString(binding.source_role)) failures.push("STOP_ROW_MISSING_SOURCE_ROLE");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(binding.access_date || ""))) failures.push("STOP_ROW_MISSING_ACCESS_DATE");
      if (!nonEmptyString(binding.forbidden_inference)) failures.push("STOP_ROW_MISSING_FORBIDDEN_INFERENCE");
    }
    if (!Array.isArray(row.freshness_triggers) || row.freshness_triggers.length === 0) failures.push("STOP_ROW_MISSING_FRESHNESS_TRIGGERS");
    if (!Array.isArray(row.transformation_actions) || row.transformation_actions.length === 0) failures.push("STOP_ROW_MISSING_TRANSFORMATION_ACTION");
    for (const action of row.transformation_actions || []) {
      if (!ALLOWED_TRANSFORMATION_ACTIONS.includes(action)) failures.push("STOP_UNSUPPORTED_TRANSFORMATION_ACTION");
    }
    if (!Array.isArray(row.forbidden_inference) || row.forbidden_inference.length === 0) failures.push("STOP_ROW_MISSING_FORBIDDEN_INFERENCE");
    if (row.school_owned_evidence_needed?.still_needed !== true) failures.push("STOP_ROW_MISSING_SCHOOL_EVIDENCE_BLOCKER");
    if (row.local_expert_needed?.required_before_any_output !== true) failures.push("STOP_ROW_MISSING_LOCAL_EXPERT_BLOCKER");
    if (!nonEmptyString(row.proof_required_to_close)) failures.push("STOP_ROW_MISSING_PROOF_REQUIRED");
    const disposition = row.review_disposition || {};
    for (const key of ["reviewer_role", "finding_classification", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(disposition[key])) failures.push(`STOP_ROW_REVIEW_DISPOSITION_MISSING_${key.toUpperCase()}`);
    }
  }

  const decision = contract.closure_decision || {};
  if (decision.selected !== SELECTED_TRIAL_CONTRACT_DECISION) failures.push("STOP_DECISION_MISMATCH");
  if (!sameList(decision.allowed_options, DECISION_OPTIONS)) failures.push("STOP_DECISION_OPTIONS_MISMATCH");
  if (decision.decision_selection_count !== 1) failures.push("STOP_DECISION_SELECTION_COUNT");

  return unique(failures);
}

function checkContract(reportId, contract, failures) {
  checkCommon(reportId, contract, failures);
  const validationFailures = validateContract(contract, {
    jurisdictionId: contract.jurisdiction_source_binding?.jurisdiction_id,
  });
  for (const failure of validationFailures) failures.push(`${reportId}: ${failure}`);
  checkFindings(reportId, contract.finding_classification, failures);
}

function checkTrace(trace, failures) {
  checkCommon("trace", trace, failures);
  const noOutput = trace.no_output_enforcement || {};
  for (const key of [
    "localized_textbook_paragraphs_generated",
    "localized_exercises_generated",
    "localized_answer_models_generated",
    "student_facing_files_generated",
    "teacher_school_facing_output_generated",
    "public_output_generated",
    "generated_lesson_output_scanned",
  ]) {
    if (noOutput[key] !== false) failures.push(`trace: ${key} must be false`);
  }
  for (const section of [
    "what_would_remain_unchanged",
    "terminology_replacements_needed",
    "examples_requiring_localization",
    "institution_replacements_needed",
    "assessment_forms_requiring_replacement",
    "extension_only_rows",
    "excluded_rows",
  ]) {
    if (!Array.isArray(trace[section])) failures.push(`trace: missing ${section}`);
  }
  const raw = JSON.stringify(trace).toLowerCase();
  for (const forbidden of ["rewritten_localized_paragraph", "answer_model_text", "student_file_path"]) {
    if (raw.includes(forbidden)) failures.push(`trace: contains forbidden generated-output marker ${forbidden}`);
  }
}

function checkValidationReport(report, failures) {
  checkCommon("validation", report, failures);
  if (report.row_counts?.england !== 10) failures.push("validation: England row count must be 10");
  if (report.row_counts?.flanders !== 10) failures.push("validation: Flanders row count must be 10");
  if (report.row_counts?.total !== 20) failures.push("validation: total row count must be 20");
  if (report.schema_strictness?.schema_file !== SCHEMA_FILE) failures.push("validation: schema strictness file mismatch");
  if (report.schema_strictness?.strict_nested_schema !== true) failures.push("validation: strict nested schema proof missing");
  if (report.schema_strictness?.contract_row_count_per_jurisdiction !== 10) failures.push("validation: schema strictness row count mismatch");
  if (report.schema_strictness?.exact_no_output_false_flags !== true) failures.push("validation: no-output false flag schema proof missing");
  if (!sameList(report.schema_strictness?.exact_decision_tuple || [], DECISION_OPTIONS)) failures.push("validation: schema decision tuple mismatch");
  if (!hasFragment(report.schema_strictness, "checker-enforced against the selected descriptor allowlists")) failures.push("validation: schema checker-enforcement policy missing");
  if (!sameList(report.allowed_transformation_actions, ALLOWED_TRANSFORMATION_ACTIONS)) failures.push("validation: transformation action enum mismatch");
  if (!sameList((report.positive_fixtures || []).map((item) => item.file), POSITIVE_FIXTURES)) failures.push("validation: positive fixture list mismatch");
  if (!sameList((report.negative_fixtures || []).map((item) => item.expected_refusal_code), NEGATIVE_FIXTURES.map(([, code]) => code))) failures.push("validation: negative fixture list mismatch");
  checkFindings("validation", report.finding_classification, failures);
}

function checkDecisionReport(report, failures) {
  checkCommon("decision", report, failures);
  const decision = report.final_internal_overlay_trial_contract_decision || {};
  if (decision.selected !== SELECTED_TRIAL_CONTRACT_DECISION) failures.push("decision: selected decision mismatch");
  if (!sameList(decision.allowed_options, DECISION_OPTIONS)) failures.push("decision: allowed options mismatch");
  if (decision.decision_selection_count !== 1) failures.push("decision: must select exactly one option");
  if (!Array.isArray(report.still_blocked) || report.still_blocked.length === 0) failures.push("decision: still_blocked must be non-empty");
  for (const fragment of [
    "runtime execution",
    "localized chapters",
    "student-facing files",
    "Scale Gate",
    "personal-data processing",
    "inspection-readiness claims",
    "support/accommodation sufficiency claims",
  ]) {
    if (!hasFragment(report, fragment)) failures.push(`decision: missing blocked fragment ${fragment}`);
  }
  checkFindings("decision", report.finding_classification, failures);
}

function checkFixtures(failures) {
  for (const fixture of POSITIVE_FIXTURES) {
    const contract = readJson(fixture);
    const validationFailures = validateContract(contract);
    if (validationFailures.length > 0) failures.push(`${fixture}: expected PASS, got ${validationFailures.join(", ")}`);
  }
  for (const [file, expectedCode] of NEGATIVE_FIXTURES) {
    const fixturePath = `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/${file}`;
    const fixture = readJson(fixturePath);
    const validationFailures = validateContract(fixture.contract || fixture);
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

function run() {
  const failures = [];
  checkCurrentness(failures);
  checkInputsAndOutputs(failures);
  checkNoLocalPaths(failures);
  checkSchemaStrictness(readJson(SCHEMA_FILE), failures);
  checkContract("england contract", readJson(ENGLAND_CONTRACT), failures);
  checkContract("flanders contract", readJson(FLANDERS_CONTRACT), failures);
  checkTrace(readJson(TRACE_REPORT), failures);
  checkValidationReport(readJson(VALIDATION_REPORT), failures);
  checkDecisionReport(readJson(DECISION_REPORT), failures);
  checkFixtures(failures);
  checkCliRefusals(failures);
  if (failures.length) fail(unique(failures));
  console.log("OK internal overlay trial-contract check contracts=2 rows=20 negative_fixtures=14 decision=PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION");
}

if (require.main === module) run();

module.exports = {
  run,
  validateContract,
};
