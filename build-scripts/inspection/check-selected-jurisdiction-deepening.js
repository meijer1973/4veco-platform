#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  CORE_REQUIREMENTS,
  DECISION_OPTIONS,
  DEEPENING_BLOCKED_AUTHORITY,
  OUTPUT_PATHS,
  SELECTED_DECISION,
  buildBundle,
  conceptRows,
  outputContents,
} = require("./build-selected-jurisdiction-deepening.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-selected-jurisdiction-deepening.js";
const SCHEMA_PATH = "references/schemas/international-jurisdiction-overlay.schema.v1.json";
const DESCRIPTOR_PATHS = [
  "references/data/inspection-standards/overlays/england.deepening.v1.json",
  "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
];
const POSITIVE_FIXTURES = [
  "references/data/inspection-standards/fixtures/selected-deepening/positive/england.deepening.v1.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/positive/flanders.deepening.v1.sample.json",
];
const NEGATIVE_FIXTURES = [
  "references/data/inspection-standards/fixtures/selected-deepening/negative/missing-boundary-warning.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/extra-authority-property.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/forbidden-output-true.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/duplicate-source-id.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/invalid-source-url.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/unsupported-finding-classification.sample.json",
];

const REFUSAL_CASES = [
  [["--country-edition"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--localized-chapter"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--teacher"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--school-facing"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--public"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT"],
  [["--product-route"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--scale"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--diagnostics"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--mastery"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--pv"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--student"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--personal"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--legal-sufficiency"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--accreditation"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-ready"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--op0"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--pta"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--summative"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--all-belgium"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--whole-uk"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--all-england-awarding-bodies"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--glob"], "STOP_IMPLICIT_DISCOVERY"],
  [["--implicit-source"], "STOP_IMPLICIT_DISCOVERY"],
  [["--scan-generated-lessons"], "STOP_IMPLICIT_DISCOVERY"],
  [["--package"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--ci"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--dashboard"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--quality-ref"], "STOP_FORBIDDEN_INTEGRATION"],
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
  console.error("Selected-jurisdiction deepening check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
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
    if (schemaNode.format === "uri" && !/^https:\/\//.test(value)) errors.push(`${pathLabel}: expected https URI`);
  }
  if (typeof value === "number") {
    if (schemaNode.minimum !== undefined && value < schemaNode.minimum) errors.push(`${pathLabel}: below minimum ${schemaNode.minimum}`);
    if (schemaNode.maximum !== undefined && value > schemaNode.maximum) errors.push(`${pathLabel}: above maximum ${schemaNode.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schemaNode.minItems && value.length < schemaNode.minItems) errors.push(`${pathLabel}: expected at least ${schemaNode.minItems} item(s)`);
    if (schemaNode.uniqueItems) {
      const seen = new Set(value.map((item) => JSON.stringify(item)));
      if (seen.size !== value.length) errors.push(`${pathLabel}: duplicate array item`);
    }
    if (schemaNode["x-uniqueBy"]) {
      const key = schemaNode["x-uniqueBy"];
      const seen = new Set();
      for (const [index, item] of value.entries()) {
        if (seen.has(item?.[key])) errors.push(`${pathLabel}[${index}]: duplicate ${key} ${item?.[key]}`);
        seen.add(item?.[key]);
      }
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

function schemaErrors(schema, descriptor) {
  const errors = [];
  validateAgainstSchema(schema, schema, descriptor, "$", errors);
  return errors;
}

function checkCurrentness(failures) {
  const expected = outputContents(buildBundle());
  if (!sameList([...expected.keys()], OUTPUT_PATHS)) failures.push("OUTPUT_PATHS order mismatch");
  if (process.env.SELECTED_DEEPENING_CHECK_COMMITTED_OUTPUTS === "1") {
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
    if (mismatches.length) failures.push(`committed selected-deepening output is stale: ${mismatches.join(", ")}`);
    return;
  }
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) failures.push(`generator --check failed: ${(result.stdout || "").trim()} ${(result.stderr || "").trim()}`);
}

function checkOutputsExist(failures) {
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

function hasFragment(value, fragment) {
  return JSON.stringify(value).toLowerCase().includes(fragment.toLowerCase());
}

function checkSchemaStructure(schema, failures) {
  const defs = schema.$defs || {};
  for (const name of [
    "jurisdiction_boundary",
    "authority_coverage",
    "official_source_record",
    "source_freshness",
    "curriculum_mapping",
    "assessment_mapping",
    "terminology_substitution",
    "institution_example_substitution",
    "accessibility_inclusion_record",
    "school_owned_evidence_boundary",
    "finding_classification",
    "output_boundary",
  ]) {
    if (!defs[name]) failures.push(`schema missing $defs.${name}`);
  }
  const nodesToCheck = [schema, ...Object.values(defs)];
  for (const node of nodesToCheck) {
    if (node?.type === "object" && node.additionalProperties !== false) failures.push("schema object missing additionalProperties:false");
  }
  if (!schema.properties?.official_source_allowlist?.["x-uniqueBy"]) failures.push("schema must carry source-id uniqueness control");
  if (!schema.$defs?.output_boundary?.properties?.country_edition_generation || schema.$defs.output_boundary.properties.country_edition_generation.const !== false) {
    failures.push("schema output boundary must const false forbidden authority flags");
  }
}

function checkDescriptorSemantics(descriptor, failures) {
  const id = descriptor.descriptor_id;
  for (const flag of DEEPENING_BLOCKED_AUTHORITY) {
    if (descriptor.output_boundary?.[flag] !== false) failures.push(`${id}: ${flag} must be false`);
  }
  const sourceIds = descriptor.official_source_allowlist.map((item) => item.source_id);
  if (sourceIds.length !== new Set(sourceIds).size) failures.push(`${id}: duplicate source_id`);
  if (id === "england.deepening.v1") {
    for (const fragment of ["AQA", "DfE", "Ofsted", "SEND", "not all England"]) {
      if (!hasFragment(descriptor, fragment)) failures.push(`${id}: missing England fragment ${fragment}`);
    }
    for (const fragment of ["assessment_objective", "command_word", "mark_scheme_expectation"]) {
      if (!hasFragment(descriptor, fragment)) failures.push(`${id}: missing England assessment mapping ${fragment}`);
    }
  }
  if (id === "flanders.deepening.v1") {
    for (const fragment of ["3de graad", "Doorstroomfinaliteit", "basisvorming", "SC11.05", "school/network"]) {
      if (!hasFragment(descriptor, fragment)) failures.push(`${id}: missing Flanders fragment ${fragment}`);
    }
    if (!descriptor.assessment_mappings.every((row) => row.assessment_status === "gap")) failures.push(`${id}: Flemish assessment boundary must remain gap`);
  }
}

function checkReports(failures) {
  const england = readJson("reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json");
  const flanders = readJson("reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json");
  const comparison = readJson("reports/inspection-standards/selected-jurisdiction-readiness-comparison.json");
  const decision = readJson("reports/inspection-standards/selected-jurisdiction-deepening-decision.json");
  for (const report of [england, flanders, comparison, decision]) {
    for (const key of ["product_end_state", "original_sprint_gate_spec", "accepted_architecture_decision"]) {
      if (!report[key]) failures.push(`${report.report_id}: missing ${key}`);
    }
    if (!Array.isArray(report.core_requirement_checklist) || report.core_requirement_checklist.length !== CORE_REQUIREMENTS.length) {
      failures.push(`${report.report_id}: core checklist mismatch`);
    }
    for (const flag of DEEPENING_BLOCKED_AUTHORITY) {
      if (report.output_boundary?.[flag] !== false) failures.push(`${report.report_id}: ${flag} must be false`);
    }
  }
  if (england.crosswalk_rows.length !== conceptRows.length) failures.push("England crosswalk row count mismatch");
  if (flanders.crosswalk_rows.length !== conceptRows.length) failures.push("Flanders crosswalk row count mismatch");
  if (!hasFragment(england, "AQA 7136")) failures.push("England crosswalk missing AQA 7136");
  if (!hasFragment(flanders, "SC11.05")) failures.push("Flanders crosswalk missing SC11.05");
  for (const [report, label] of [[england, "England"], [flanders, "Flanders"]]) {
    if (!hasFragment(report, "own price") && !hasFragment(report, "own-price")) failures.push(`${label} crosswalk missing own-price demand movement distinction`);
    if (!hasFragment(report, "non-price demand")) failures.push(`${label} crosswalk missing non-price demand-factor shift distinction`);
  }
  if (!hasFragment(comparison, "school-owned accommodations") || !hasFragment(comparison, "local legal duties")) {
    failures.push("Comparison missing accessibility/accommodation/legal-duty boundary");
  }
  if (!comparison.reuse_estimates.every((row) => row.not_a_compliance_measure === true)) failures.push("Reuse estimates must be non-compliance estimates");
  if (decision.final_selected_jurisdiction_deepening_decision.selected !== SELECTED_DECISION) failures.push("decision selected mismatch");
  if (decision.final_selected_jurisdiction_deepening_decision.decision_selection_count !== 1) failures.push("decision must select exactly one option");
  if (!sameList(decision.final_selected_jurisdiction_deepening_decision.allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (!sameList(decision.still_blocked, DEEPENING_BLOCKED_AUTHORITY)) failures.push("decision still_blocked mismatch");
}

function checkMarkdown(failures) {
  for (const file of OUTPUT_PATHS.filter((item) => item.endsWith(".md"))) {
    const markdown = readUtf8(file);
    for (const fragment of ["Status:", "Sprint:", "Product End-State And Original Spec", "Non-Negotiable Requirements", "Core-Requirement Checklist", "Finding Classification"]) {
      if (!markdown.includes(fragment)) failures.push(`${file}: missing ${fragment}`);
    }
  }
}

function checkFixtures(schema, failures) {
  for (const fixture of POSITIVE_FIXTURES) {
    const errors = schemaErrors(schema, readJson(fixture));
    if (errors.length) failures.push(`${fixture}: positive fixture failed schema validation: ${errors.slice(0, 3).join("; ")}`);
  }
  for (const fixture of NEGATIVE_FIXTURES) {
    const errors = schemaErrors(schema, readJson(fixture));
    if (!errors.length) failures.push(`${fixture}: negative fixture unexpectedly passed schema validation`);
  }
}

function checkRefusals(failures) {
  for (const [args, expectedCode] of REFUSAL_CASES) {
    const result = runNode([GENERATOR, ...args]);
    const combined = `${result.stdout || ""}\n${result.stderr || ""}`;
    if (result.status !== 1 || !combined.includes(expectedCode)) failures.push(`${args.join(" ")} did not return ${expectedCode}`);
  }
}

function main() {
  const failures = [];
  checkOutputsExist(failures);
  checkCurrentness(failures);
  checkNoLocalPaths(failures);
  const schema = readJson(SCHEMA_PATH);
  checkSchemaStructure(schema, failures);
  for (const descriptorPath of DESCRIPTOR_PATHS) {
    const descriptor = readJson(descriptorPath);
    const errors = schemaErrors(schema, descriptor);
    if (errors.length) failures.push(`${descriptorPath}: schema validation failed: ${errors.slice(0, 5).join("; ")}`);
    checkDescriptorSemantics(descriptor, failures);
  }
  checkFixtures(schema, failures);
  checkReports(failures);
  checkMarkdown(failures);
  checkRefusals(failures);
  if (failures.length) fail(failures);
  console.log(`OK selected jurisdiction deepening check descriptors=2 schema_fixtures=${POSITIVE_FIXTURES.length + NEGATIVE_FIXTURES.length} crosswalk_rows=${conceptRows.length * 2} refusal_cases=${REFUSAL_CASES.length} decision=${SELECTED_DECISION}`);
}

main();
