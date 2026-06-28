#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_PATHS,
  POSITIVE_FIXTURES,
  REFUSAL_CASES,
  SELECTED_SIMULATION_DECISION,
  SIMULATION_BLOCKED_AUTHORITY,
  SIMULATION_STATUS_OPTIONS,
  buildBundle,
  closureDisposition,
  noOutputFlags,
  outputContents,
} = require("./build-internal-no-output-trial-simulation.js");
const {
  SELECTED_TRIAL_CONTRACT_DECISION: ACCEPTED_TRIAL_CONTRACT_DECISION,
} = require("./build-internal-overlay-trial-contract.js");
const {
  REV_STD_FINDING_CLASSIFICATIONS,
} = require("./build-international-overlay-architecture.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-internal-no-output-trial-simulation.js";
const SCHEMA_FILE = "references/schemas/internal-no-output-trial-simulation.schema.v1.json";
const ENGLAND_SIMULATION = "reports/inspection-standards/england-internal-no-output-trial-simulation.json";
const FLANDERS_SIMULATION = "reports/inspection-standards/flanders-internal-no-output-trial-simulation.json";
const COMBINED_SIMULATION = "reports/inspection-standards/internal-no-output-trial-simulation.json";
const VALIDATION_REPORT = "reports/inspection-standards/internal-no-output-trial-simulation-validation.json";
const DECISION_REPORT = "reports/inspection-standards/internal-no-output-trial-simulation-decision.json";

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
  console.error("Internal no-output trial simulation check failed:");
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

function checkCurrentness(failures) {
  const expected = outputContents(buildBundle());
  if (!sameList([...expected.keys()], OUTPUT_PATHS)) failures.push("OUTPUT_PATHS order mismatch");
  if (process.env.INTERNAL_NO_OUTPUT_TRIAL_SIMULATION_CHECK_COMMITTED_OUTPUTS === "1") {
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
    if (mismatches.length) failures.push(`committed internal no-output trial simulation output is stale: ${mismatches.join(", ")}`);
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
    "accepted_trial_contract_decision",
    "input_allowlist",
    "output_allowlist",
    "output_boundary",
    "simulation_id",
    "simulation_mode",
    "source_contract",
    "jurisdiction_source_binding",
    "simulation_no_output_enforcement",
    "simulation_rows",
    "closure_disposition",
    "finding_classification",
  ], failures);
  const defs = schema.$defs || {};
  for (const defName of [
    "sourceContract",
    "sourcePolicy",
    "jurisdictionSourceBinding",
    "noOutputEnforcement",
    "sourceBinding",
    "retainedBlockerDisplay",
    "simulationDisposition",
    "simulationRow",
    "closureDisposition",
    "findingClassification",
  ]) {
    checkClosedObject(`schema.$defs.${defName}`, defs[defName], failures);
  }
  if (!sameList(tupleConsts(schema.properties?.input_allowlist), INPUT_ALLOWLIST)) failures.push("schema input allowlist mismatch");
  if (!sameList(tupleConsts(schema.properties?.output_allowlist), OUTPUT_PATHS)) failures.push("schema output allowlist mismatch");
  const rows = schema.properties?.simulation_rows || {};
  if (rows.minItems !== 10 || rows.maxItems !== 10) failures.push("schema.simulation_rows: must require exactly 10 rows");
  if (rows.items?.$ref !== "#/$defs/simulationRow") failures.push("schema.simulation_rows: items must reference simulationRow");
  if (!sameList(tupleConsts(schema.properties?.simulation_status_vocabulary), SIMULATION_STATUS_OPTIONS)) failures.push("schema status vocabulary mismatch");
  const noOutput = defs.noOutputEnforcement?.properties || {};
  for (const [key, value] of Object.entries(noOutputFlags())) {
    if (noOutput[key]?.const !== value) failures.push(`schema.noOutputEnforcement.${key}: const mismatch`);
  }
  const outputBoundary = schema.properties?.output_boundary || {};
  if (!sameList(outputBoundary.required || [], SIMULATION_BLOCKED_AUTHORITY)) failures.push("schema output boundary required list mismatch");
  for (const flag of SIMULATION_BLOCKED_AUTHORITY) {
    if (outputBoundary.properties?.[flag]?.const !== false) failures.push(`schema output boundary ${flag}: must be const false`);
  }
  const disposition = defs.simulationDisposition || {};
  if (!sameList(disposition.properties?.status?.enum || [], SIMULATION_STATUS_OPTIONS)) failures.push("schema simulation disposition status enum mismatch");
  if (!sameList(disposition.properties?.finding_classification?.enum || [], REV_STD_FINDING_CLASSIFICATIONS)) failures.push("schema finding classification enum mismatch");
  const closure = defs.closureDisposition || {};
  checkRequired("schema.$defs.closureDisposition", closure, Object.keys(closureDisposition(["school_owned_evidence_still_needed"])), failures);
  for (const key of [
    "localized_output_generation_ready",
    "product_route_ready",
    "scale_gate_ready",
    "diagnostics_mastery_pv_ready",
    "source_refresh_executed",
    "local_expert_substituted",
    "aqa_approval_claim",
    "ok_compliance_claim",
    "legal_sufficiency_ready",
    "support_sufficiency_ready",
    "public_output_ready",
    "whole_uk_claim_from_england_only",
    "all_belgium_claim_from_flanders_only",
  ]) {
    if (closure.properties?.[key]?.const !== false) failures.push(`schema closure disposition ${key}: must be const false`);
  }
}

function checkCommon(label, report, failures) {
  if (report.schema_version !== 1) failures.push(`${label}: schema_version must be 1`);
  if (report.internal_only !== true) failures.push(`${label}: internal_only must be true`);
  if (report.manual_invocation_only !== true) failures.push(`${label}: manual_invocation_only must be true`);
  if (report.human_review_required !== true) failures.push(`${label}: human_review_required must be true`);
  if (report.accepted_trial_contract_decision !== ACCEPTED_TRIAL_CONTRACT_DECISION) failures.push(`${label}: accepted trial-contract decision mismatch`);
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push(`${label}: input allowlist mismatch`);
  if (!sameList(report.output_allowlist, OUTPUT_PATHS)) failures.push(`${label}: output allowlist mismatch`);
  const boundary = report.output_boundary || {};
  for (const flag of SIMULATION_BLOCKED_AUTHORITY) {
    if (boundary[flag] !== false) failures.push(`${label}: output boundary ${flag} must be false`);
  }
  checkFindings(label, report.finding_classification, failures);
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

function acceptedSourceIds(report) {
  return new Set(report.jurisdiction_source_binding?.official_source_ids || []);
}

function acceptedContract(report) {
  const sourceFile = report.source_contract?.source_file;
  if (!nonEmptyString(sourceFile)) return null;
  if (!INPUT_ALLOWLIST.includes(sourceFile)) return null;
  try {
    return readJson(sourceFile);
  } catch (_error) {
    return null;
  }
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function checkExactRowLineage(report, rows, failures) {
  const contract = acceptedContract(report);
  if (!contract || !Array.isArray(contract.contract_rows)) {
    failures.push("STOP_ACCEPTED_CONTRACT_SOURCE_MISSING");
    return;
  }
  if (contract.jurisdiction_source_binding?.jurisdiction_id !== report.jurisdiction_source_binding?.jurisdiction_id) {
    failures.push("STOP_CONTRACT_JURISDICTION_MISMATCH");
  }
  const expectedById = new Map(contract.contract_rows.map((row) => [row.row_id, row]));
  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.source_contract_row_id)) failures.push("STOP_DUPLICATE_CONTRACT_ROW");
    seen.add(row.source_contract_row_id);
    const expected = expectedById.get(row.source_contract_row_id);
    if (!expected) {
      failures.push("STOP_ROW_LINEAGE_MISMATCH");
      continue;
    }
    const exactFields = [
      "jurisdiction_id",
      "chapter_id",
      "paragraph_id",
      "chapter_paragraph",
      "concept_id",
      "crosswalk_row_id",
      "local_heading",
      "mapping_status",
      "assessment_status",
      "proof_required_to_close",
    ];
    if (row.simulation_row_id !== `${expected.row_id}:no-output-simulation`) failures.push("STOP_ROW_LINEAGE_MISMATCH");
    for (const field of exactFields) {
      if (row[field] !== expected[field]) failures.push("STOP_ROW_LINEAGE_MISMATCH");
    }
    if (!sameList(row.source_ids || [], expected.source_ids || [])) failures.push("STOP_ROW_LINEAGE_MISMATCH");
    if (!sameJson(row.source_bindings || [], expected.source_bindings || [])) failures.push("STOP_ROW_LINEAGE_MISMATCH");
    if (!Array.isArray(row.transformation_actions) || row.transformation_actions.length === 0) {
      failures.push("STOP_TRANSFORMATION_ACTIONS_MISMATCH");
    } else if (!sameList(row.transformation_actions, expected.transformation_actions || [])) {
      failures.push("STOP_TRANSFORMATION_ACTIONS_MISMATCH");
    }
    const display = row.retained_blocker_display || {};
    const expectedDisplay = expected.blocker_display || {};
    for (const field of [
      "route_local_only_evidence_status",
      "school_owned_evidence_still_needed",
      "forbidden_inferences",
      "accessibility_support_limitations",
      "legal_sufficiency_blocked",
      "support_sufficiency_blocked",
      "school_owned_accommodation_evidence_needed",
      "individual_adjustment_claim_blocked",
      "support_records_personal_data_blocked",
      "check_surface_authority_separation",
      "proof_required_to_close",
    ]) {
      if (!sameJson(display[field], expectedDisplay[field])) failures.push("STOP_BLOCKER_DISPLAY_LINEAGE_MISMATCH");
    }
  }
  for (const expected of contract.contract_rows) {
    if (!seen.has(expected.row_id)) failures.push("STOP_MISSING_CONTRACT_ROW");
  }
}

function checkNoOutputObject(label, noOutput, failures) {
  const expected = noOutputFlags();
  for (const [key, value] of Object.entries(expected)) {
    if (noOutput?.[key] !== value) failures.push(`${label}: ${key} must be ${value}`);
  }
}

function validateSimulation(report) {
  const failures = [];
  checkCommon("simulation", report, failures);
  const boundary = report.output_boundary || {};
  if (boundary.legal_sufficiency_claim === true || boundary.legal_compliance_claim === true || boundary.country_specific_legal_claim === true) {
    failures.push("STOP_COMPLIANCE_APPROVAL_CLAIM");
  }
  if (boundary.support_sufficiency_claim === true || boundary.support_or_accommodation_sufficiency_claim === true || boundary.accommodation_sufficiency_claim === true) {
    failures.push("STOP_SUPPORT_ACCOMMODATION_CLAIM");
  }
  if (boundary.simulation_product_route === true || boundary.simulation_scale_gate === true || boundary.product_route_adoption === true || boundary.scale_gate_integration === true) {
    failures.push("STOP_PRODUCT_OR_SCALE_GATE");
  }
  if (report.simulation_mode !== "manual_internal_summary_only") failures.push("STOP_SIMULATION_MODE_MISMATCH");
  const policy = report.jurisdiction_source_binding?.source_policy || {};
  if (policy.explicit_contract_inputs_only !== true) failures.push("STOP_SOURCE_POLICY_NOT_EXPLICIT");
  if (!sameList(policy.input_allowlist, INPUT_ALLOWLIST)) failures.push("STOP_SOURCE_POLICY_INPUT_ALLOWLIST");
  if (policy.directory_globbing_allowed !== false) failures.push("STOP_IMPLICIT_DISCOVERY");
  if (policy.implicit_source_discovery !== false) failures.push("STOP_IMPLICIT_DISCOVERY");
  if (policy.generated_lesson_output_scanning !== false) failures.push("STOP_IMPLICIT_DISCOVERY");
  if (policy.source_refresh_executed !== false) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
  if (policy.local_expert_substitution !== false) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
  checkNoOutputObject("simulation no-output", report.simulation_no_output_enforcement, failures);
  const rows = report.simulation_rows || [];
  if (rows.length !== 10) failures.push("STOP_MISSING_CONTRACT_ROW");
  checkExactRowLineage(report, rows, failures);
  const allowedSources = acceptedSourceIds(report);
  for (const [index, row] of rows.entries()) {
    if (row.jurisdiction_id !== report.jurisdiction_source_binding?.jurisdiction_id) failures.push(`STOP_ROW_JURISDICTION_MISMATCH_${index}`);
    if (!nonEmptyString(row.source_contract_row_id)) failures.push(`STOP_ROW_CONTRACT_ID_MISSING_${index}`);
    if (!Array.isArray(row.source_ids) || row.source_ids.length === 0) failures.push(`STOP_ROW_SOURCE_IDS_MISSING_${index}`);
    for (const sourceId of row.source_ids || []) {
      if (!allowedSources.has(sourceId)) failures.push("STOP_UNKNOWN_SOURCE_ID");
    }
    for (const binding of row.source_bindings || []) {
      if (!allowedSources.has(binding.source_id)) failures.push("STOP_UNKNOWN_SOURCE_ID");
      for (const key of ["source_id", "source_role", "access_date", "source_scope", "forbidden_inference"]) {
        if (!nonEmptyString(binding[key])) failures.push(`STOP_SOURCE_BINDING_MISSING_${key.toUpperCase()}`);
      }
    }
    checkNoOutputObject(`row ${index} no-output`, row.no_output_result, failures);
    if (row.no_output_result?.runtime_execution_performed !== false) failures.push("STOP_FORBIDDEN_RUNTIME");
    if (row.no_output_result?.localized_textbook_paragraphs_generated !== false) failures.push("STOP_LOCALIZED_OUTPUT");
    if (row.no_output_result?.localized_exercises_generated !== false) failures.push("STOP_LOCALIZED_OUTPUT");
    if (row.no_output_result?.localized_answer_models_generated !== false) failures.push("STOP_LOCALIZED_OUTPUT");
    if (row.no_output_result?.localized_assessment_items_generated !== false) failures.push("STOP_LOCALIZED_OUTPUT");
    if (row.no_output_result?.student_facing_files_generated !== false) failures.push("STOP_STUDENT_FACING_OUTPUT");
    if (row.no_output_result?.teacher_school_facing_output_generated !== false) failures.push("STOP_TEACHER_SCHOOL_FACING_OUTPUT");
    if (row.no_output_result?.public_output_generated !== false) failures.push("STOP_PUBLIC_OUTPUT");
    if (row.no_output_result?.personal_data_fields_present !== false) failures.push("STOP_PERSONAL_DATA");
    if (row.no_output_result?.product_route_integration_requested !== false) failures.push("STOP_PRODUCT_OR_SCALE_GATE");
    if (row.no_output_result?.scale_gate_integration_requested !== false) failures.push("STOP_PRODUCT_OR_SCALE_GATE");
    if (row.no_output_result?.automated_source_refresh_executed !== false) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
    const display = row.retained_blocker_display || {};
    for (const key of [
      "route_local_only_evidence_status",
      "forbidden_inferences",
      "accessibility_support_limitations",
      "check_surface_authority_separation",
      "owner_next_action",
      "proof_required_to_close",
    ]) {
      if (display[key] === undefined) failures.push(`STOP_BLOCKER_DISPLAY_MISSING_${key.toUpperCase()}`);
    }
    for (const key of [
      "school_owned_evidence_still_needed",
      "legal_sufficiency_blocked",
      "support_sufficiency_blocked",
      "school_owned_accommodation_evidence_needed",
      "individual_adjustment_claim_blocked",
      "support_records_personal_data_blocked",
    ]) {
      if (display[key] !== true) failures.push(`STOP_BLOCKER_DISPLAY_BOOLEAN_${key.toUpperCase()}`);
    }
    const disposition = row.simulation_disposition || {};
    if (!SIMULATION_STATUS_OPTIONS.includes(disposition.status)) failures.push("STOP_ROW_SIMULATION_STATUS");
    if (!REV_STD_FINDING_CLASSIFICATIONS.includes(disposition.finding_classification)) failures.push("STOP_ROW_FINDING_CLASSIFICATION");
    for (const key of ["blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(disposition[key])) failures.push(`STOP_ROW_DISPOSITION_MISSING_${key.toUpperCase()}`);
    }
  }
  const closure = report.closure_disposition || {};
  const allowedClosureKeys = Object.keys(closureDisposition(["school_owned_evidence_still_needed"]));
  for (const key of Object.keys(closure)) {
    if (!allowedClosureKeys.includes(key)) failures.push("STOP_CLOSURE_DISPOSITION_UNSUPPORTED_FIELD");
  }
  for (const key of [
    "localized_output_generation_ready",
    "product_route_ready",
    "scale_gate_ready",
    "diagnostics_mastery_pv_ready",
  ]) {
    if (closure[key] !== false) failures.push("STOP_DECISION_OVERCLAIM");
  }
  if (closure.source_refresh_executed !== false) failures.push("STOP_SOURCE_REFRESH_EXECUTION");
  if (closure.local_expert_substituted !== false) failures.push("STOP_LOCAL_EXPERT_SUBSTITUTION");
  if (closure.aqa_approval_claim !== false || closure.whole_uk_claim_from_england_only !== false || closure.all_belgium_claim_from_flanders_only !== false) {
    failures.push("STOP_GOVERNANCE_OVERGENERALISATION");
  }
  if (closure.ok_compliance_claim !== false || closure.legal_sufficiency_ready !== false) failures.push("STOP_COMPLIANCE_APPROVAL_CLAIM");
  if (closure.support_sufficiency_ready !== false) failures.push("STOP_SUPPORT_ACCOMMODATION_CLAIM");
  if (closure.public_output_ready !== false) failures.push("STOP_PUBLIC_OUTPUT");
  if (closure.source_refresh_needed_before_any_output !== true) failures.push("STOP_SOURCE_REFRESH_GATE_MISSING");
  if (closure.local_expert_review_needed_before_any_output !== true) failures.push("STOP_LOCAL_EXPERT_GATE_MISSING");
  return unique(failures);
}

function checkSimulation(label, report, failures) {
  const validationFailures = validateSimulation(report);
  for (const failure of validationFailures) failures.push(`${label}: ${failure}`);
  const raw = JSON.stringify(report).toLowerCase();
  for (const forbidden of ["rewritten_localized_paragraph", "answer_model_text", "student_file_path", "localized_assessment_item_text"]) {
    if (raw.includes(forbidden)) failures.push(`${label}: contains forbidden generated-output marker ${forbidden}`);
  }
}

function checkCombined(report, failures) {
  checkCommon("combined", report, failures);
  if (report.row_counts?.england !== 10) failures.push("combined: England row count must be 10");
  if (report.row_counts?.flanders !== 10) failures.push("combined: Flanders row count must be 10");
  if (report.row_counts?.total !== 20) failures.push("combined: total row count must be 20");
  checkNoOutputObject("combined no-output", report.no_output_enforcement, failures);
  for (const fragment of ["no rewritten localized textbook paragraphs", "student-facing files", "evidence packs"]) {
    if (!hasFragment(report, fragment)) failures.push(`combined: missing no-output fragment ${fragment}`);
  }
}

function checkValidationReport(report, failures) {
  checkCommon("validation", report, failures);
  if (report.schema_file !== SCHEMA_FILE) failures.push("validation: schema file mismatch");
  if (report.row_counts?.england !== 10) failures.push("validation: England row count must be 10");
  if (report.row_counts?.flanders !== 10) failures.push("validation: Flanders row count must be 10");
  if (report.row_counts?.total !== 20) failures.push("validation: total row count must be 20");
  if (report.schema_strictness?.strict_nested_schema !== true) failures.push("validation: strict nested schema proof missing");
  if (report.schema_strictness?.simulation_row_count_per_jurisdiction !== 10) failures.push("validation: simulation row count mismatch");
  if (report.schema_strictness?.exact_no_output_false_flags !== true) failures.push("validation: no-output false flag proof missing");
  if (!sameList(report.schema_strictness?.exact_status_vocabulary || [], SIMULATION_STATUS_OPTIONS)) failures.push("validation: status vocabulary mismatch");
  if (!sameList(report.schema_strictness?.exact_decision_tuple || [], DECISION_OPTIONS)) failures.push("validation: decision tuple mismatch");
  if (!sameList((report.positive_fixtures || []).map((item) => item.file), POSITIVE_FIXTURES)) failures.push("validation: positive fixture list mismatch");
  if (!sameList((report.negative_fixtures || []).map((item) => item.expected_refusal_code), NEGATIVE_FIXTURES.map(([, code]) => code))) failures.push("validation: negative fixture list mismatch");
}

function checkDecisionReport(report, failures) {
  checkCommon("decision", report, failures);
  const decision = report.final_internal_no_output_trial_simulation_decision || {};
  if (decision.selected !== SELECTED_SIMULATION_DECISION) failures.push("decision: selected decision mismatch");
  if (!sameList(decision.allowed_options, DECISION_OPTIONS)) failures.push("decision: allowed options mismatch");
  if (decision.decision_selection_count !== 1) failures.push("decision: must select exactly one option");
  for (const fragment of [
    "runtime execution",
    "source refresh execution",
    "local expert substitution",
    "localized chapters",
    "student-facing files",
    "Scale Gate",
    "personal-data processing",
    "inspection-readiness claims",
    "support/accommodation sufficiency claims",
  ]) {
    if (!hasFragment(report, fragment)) failures.push(`decision: missing blocked fragment ${fragment}`);
  }
}

function checkFixtures(failures) {
  for (const fixture of POSITIVE_FIXTURES) {
    const simulation = readJson(fixture);
    const validationFailures = validateSimulation(simulation);
    if (validationFailures.length > 0) failures.push(`${fixture}: expected PASS, got ${validationFailures.join(", ")}`);
  }
  for (const [file, expectedCode] of NEGATIVE_FIXTURES) {
    const fixturePath = `references/data/inspection-standards/fixtures/internal-no-output-trial-simulation/negative/${file}`;
    const fixture = readJson(fixturePath);
    const validationFailures = validateSimulation(fixture.simulation || fixture);
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
  checkSimulation("england simulation", readJson(ENGLAND_SIMULATION), failures);
  checkSimulation("flanders simulation", readJson(FLANDERS_SIMULATION), failures);
  checkCombined(readJson(COMBINED_SIMULATION), failures);
  checkValidationReport(readJson(VALIDATION_REPORT), failures);
  checkDecisionReport(readJson(DECISION_REPORT), failures);
  checkFixtures(failures);
  checkCliRefusals(failures);
  if (failures.length) fail(unique(failures));
  console.log(`OK internal no-output trial simulation check simulations=2 rows=20 negative_fixtures=${NEGATIVE_FIXTURES.length} decision=PROCEED_TO_LOCAL_EXPERT_SOURCE_REFRESH_GATE_PLANNING`);
}

if (require.main === module) run();

module.exports = {
  run,
  validateSimulation,
};
