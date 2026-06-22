#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  CORE_REQUIREMENTS,
  DECISION_OPTIONS,
  GOVERNANCE_ARCHETYPES,
  OUTPUT_PATHS,
  OVERLAY_BLOCKED_AUTHORITY,
  REV_STD_FINDING_CLASSIFICATIONS,
  SELECTED_DECISION,
  buildBundle,
  bookCrosswalkRows,
  outputContents,
} = require("./build-international-overlay-architecture.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-international-overlay-architecture.js";

const REQUIRED_DESCRIPTOR_IDS = ["england.v0", "flanders.v0", "bavaria.v0", "california.v0"];
const REQUIRED_DESCRIPTOR_PATHS = [
  "references/data/inspection-standards/overlays/england.v0.json",
  "references/data/inspection-standards/overlays/flanders.v0.json",
  "references/data/inspection-standards/overlays/bavaria.v0.json",
  "references/data/inspection-standards/overlays/california.v0.json",
];
const REQUIRED_SCHEMA_FIELDS = [
  "schema_version",
  "descriptor_id",
  "jurisdiction_id",
  "jurisdiction_label",
  "governance_archetype",
  "status",
  "jurisdiction_boundary",
  "authority_type",
  "official_source_allowlist",
  "source_freshness",
  "curriculum_mappings",
  "assessment_mappings",
  "terminology_substitutions",
  "institution_example_substitutions",
  "accessibility_inclusion_terminology",
  "school_owned_evidence_boundary",
  "forbidden_claims",
  "proof_required_to_close",
  "output_boundary",
  "finding_classification",
];

const REFUSAL_CASES = [
  [["--country-edition"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-ready"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--accreditation"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--op0"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--pta"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--summative"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--public"], "STOP_FORBIDDEN_AUDIENCE"],
  [["--teacher"], "STOP_FORBIDDEN_AUDIENCE"],
  [["--school-facing"], "STOP_FORBIDDEN_AUDIENCE"],
  [["--evidence-pack"], "STOP_FORBIDDEN_AUDIENCE"],
  [["--package"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--ci"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--dashboard"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--quality-ref"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--student"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--personal"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--product-route"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--scale"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--diagnostics"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--mastery"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--pv"], "STOP_DOWNSTREAM_AUTHORITY"],
  [["--all-belgium"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--whole-uk"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--single-germany"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--national-us"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--california-as-us"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--glob"], "STOP_IMPLICIT_DISCOVERY"],
  [["--implicit-source"], "STOP_IMPLICIT_DISCOVERY"],
  [["--scan-generated-lessons"], "STOP_IMPLICIT_DISCOVERY"],
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
  console.error("International overlay architecture check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasFragment(value, fragment) {
  return JSON.stringify(value).toLowerCase().includes(fragment.toLowerCase());
}

function checkFindingClassification(reportId, findings, failures) {
  if (!Array.isArray(findings) || findings.length === 0) {
    failures.push(`${reportId}: missing finding_classification entries`);
    return;
  }
  for (const [index, finding] of findings.entries()) {
    for (const key of ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(finding?.[key])) failures.push(`${reportId} finding ${index}: missing ${key}`);
    }
    if (!REV_STD_FINDING_CLASSIFICATIONS.includes(finding?.classification)) {
      failures.push(`${reportId} finding ${index}: unsupported REV-STD-1 classification ${finding?.classification}`);
    }
    if (/pass with flags/i.test(JSON.stringify(finding))) {
      failures.push(`${reportId} finding ${index}: PASS WITH FLAGS wording is not permitted for missing core requirements`);
    }
  }
}

function checkCurrentness(failures) {
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) {
    failures.push(`generator --check failed: ${(result.stdout || "").trim()} ${(result.stderr || "").trim()}`);
  }
  const expected = outputContents(buildBundle());
  if (!sameList([...expected.keys()], OUTPUT_PATHS)) failures.push("OUTPUT_PATHS order mismatch");
}

function checkOutputsExist(failures) {
  for (const outputPath of OUTPUT_PATHS) {
    if (!fs.existsSync(repoPath(outputPath))) failures.push(`missing output: ${outputPath}`);
  }
}

function checkNoLocalPaths(relativePath, failures) {
  const content = readUtf8(relativePath);
  if (/[A-Za-z]:\\/.test(content)) failures.push(`${relativePath}: contains local Windows absolute path`);
  if (/file:\/\//i.test(content)) failures.push(`${relativePath}: contains file URI`);
}

function checkSchema(schema, failures) {
  if (schema.title !== "International Jurisdiction Overlay Descriptor") failures.push("schema title mismatch");
  if (!sameList(schema.required, REQUIRED_SCHEMA_FIELDS)) failures.push("schema required field order mismatch");
  for (const field of REQUIRED_SCHEMA_FIELDS) {
    if (!schema.properties?.[field]) failures.push(`schema missing property ${field}`);
  }
  if (schema.additionalProperties !== false) failures.push("schema must disallow additional properties");
}

function checkOutputBoundary(reportId, boundary, failures) {
  for (const flag of OVERLAY_BLOCKED_AUTHORITY) {
    if (boundary?.[flag] !== false) failures.push(`${reportId}: ${flag} must remain false`);
  }
}

function checkDescriptor(descriptor, failures) {
  const id = descriptor.descriptor_id || "unknown";
  if (descriptor.schema_version !== 1) failures.push(`${id}: schema_version must be 1`);
  for (const field of REQUIRED_SCHEMA_FIELDS) {
    if (descriptor[field] === undefined || descriptor[field] === null) failures.push(`${id}: missing ${field}`);
  }
  if (descriptor.internal_only !== true) failures.push(`${id}: internal_only must be true`);
  if (descriptor.manual_invocation_only !== true) failures.push(`${id}: manual_invocation_only must be true`);
  if (!nonEmptyString(descriptor.product_end_state)) failures.push(`${id}: missing product_end_state`);
  if (!nonEmptyString(descriptor.original_sprint_gate_spec)) failures.push(`${id}: missing original_sprint_gate_spec`);
  if (!nonEmptyString(descriptor.foundation_decision_source)) failures.push(`${id}: missing foundation_decision_source`);
  if (!Array.isArray(descriptor.official_source_allowlist) || descriptor.official_source_allowlist.length < 2) {
    failures.push(`${id}: expected at least two official sources`);
  }
  for (const [index, source] of (descriptor.official_source_allowlist || []).entries()) {
    for (const key of [
      "source_id",
      "authority",
      "title",
      "url",
      "source_type",
      "role",
      "scope",
      "publication_or_version_date",
      "access_date",
      "authority_strength",
      "allowed_use",
      "forbidden_inference",
    ]) {
      if (!nonEmptyString(source[key])) failures.push(`${id} source ${index}: missing ${key}`);
    }
    if (!/^https:\/\//.test(source.url || "")) failures.push(`${id} source ${index}: URL must be https`);
  }
  for (const key of [
    "inspection_or_school_evaluation",
    "curriculum",
    "examination",
    "accountability",
    "accreditation",
    "regional_or_state_overlay",
  ]) {
    if (!nonEmptyString(descriptor.authority_type?.[key])) failures.push(`${id}: authority_type missing ${key}`);
  }
  if (!nonEmptyString(descriptor.source_freshness?.access_date)) failures.push(`${id}: source_freshness missing access_date`);
  if (!nonEmptyString(descriptor.source_freshness?.refresh_required_before)) failures.push(`${id}: source_freshness missing refresh_required_before`);
  if (!Array.isArray(descriptor.curriculum_mappings) || descriptor.curriculum_mappings.length < 2) failures.push(`${id}: expected Chapter 1.2 and 1.3 curriculum mappings`);
  if (!Array.isArray(descriptor.assessment_mappings) || descriptor.assessment_mappings.length < 1) failures.push(`${id}: expected assessment mapping boundary`);
  if (!Array.isArray(descriptor.terminology_substitutions) || descriptor.terminology_substitutions.length < 4) failures.push(`${id}: expected terminology substitutions`);
  if (!Array.isArray(descriptor.institution_example_substitutions) || descriptor.institution_example_substitutions.length < 2) failures.push(`${id}: expected institution/example substitutions`);
  if (!Array.isArray(descriptor.accessibility_inclusion_terminology) || descriptor.accessibility_inclusion_terminology.length < 2) failures.push(`${id}: expected accessibility/inclusion terminology`);
  if (!Array.isArray(descriptor.school_owned_evidence_boundary) || descriptor.school_owned_evidence_boundary.length < 2) failures.push(`${id}: expected school-owned evidence boundaries`);
  if (!Array.isArray(descriptor.forbidden_claims) || descriptor.forbidden_claims.length < 4) failures.push(`${id}: expected forbidden claims`);
  if (!Array.isArray(descriptor.proof_required_to_close) || descriptor.proof_required_to_close.length < 3) failures.push(`${id}: expected proof_required_to_close entries`);
  checkOutputBoundary(id, descriptor.output_boundary, failures);
  checkFindingClassification(id, descriptor.finding_classification, failures);
}

function checkSpecificDescriptors(descriptors, failures) {
  const byId = Object.fromEntries(descriptors.map((descriptor) => [descriptor.descriptor_id, descriptor]));
  const england = byId["england.v0"];
  const flanders = byId["flanders.v0"];
  const bavaria = byId["bavaria.v0"];
  const california = byId["california.v0"];

  if (!hasFragment(england, "England-only")) failures.push("england.v0 missing England-only boundary");
  if (!hasFragment(england, "whole United Kingdom")) failures.push("england.v0 missing whole-UK boundary warning");
  if (!hasFragment(england, "DfE") || !hasFragment(england, "Ofsted")) failures.push("england.v0 missing DfE/Ofsted source anchors");
  if (!hasFragment(england, "exam-board")) failures.push("england.v0 missing exam-board boundary");

  if (!hasFragment(flanders, "Flanders-only")) failures.push("flanders.v0 missing Flanders-only boundary");
  if (!hasFragment(flanders, "all Belgium")) failures.push("flanders.v0 missing all-Belgium warning");
  if (!hasFragment(flanders, "Onderwijsdoelen") || !hasFragment(flanders, "OK")) failures.push("flanders.v0 missing Flemish source anchors");
  if (!hasFragment(flanders, "not_covered_in_descriptor")) failures.push("flanders.v0 must carry assessment gap");

  if (!hasFragment(bavaria, "Bavaria") || !hasFragment(bavaria, "Land")) failures.push("bavaria.v0 missing Bavaria/Land boundary");
  if (!hasFragment(bavaria, "KMK")) failures.push("bavaria.v0 missing KMK source anchor");
  if (!hasFragment(bavaria, "single national German")) failures.push("bavaria.v0 missing single-Germany warning");
  if (!hasFragment(bavaria, "not_covered_in_descriptor")) failures.push("bavaria.v0 must carry inspection/accountability gaps");

  if (!hasFragment(california, "California") || !hasFragment(california, "state")) failures.push("california.v0 missing California/state boundary");
  if (!hasFragment(california, "national U.S. inspection")) failures.push("california.v0 missing national-US inspection boundary");
  if (!hasFragment(california, "U.S. Department of Education") || !hasFragment(california, "California Department of Education")) {
    failures.push("california.v0 missing CDE/US ED source anchors");
  }
  if (!hasFragment(california, "accreditation")) failures.push("california.v0 missing accreditation boundary");
}

function checkReports(archetypePilot, crosswalk, decision, failures) {
  for (const report of [archetypePilot, crosswalk, decision]) {
    for (const key of ["product_end_state", "original_sprint_gate_spec", "foundation_decision_source"]) {
      if (!nonEmptyString(report[key])) failures.push(`${report.report_id}: missing ${key}`);
    }
    if (!Array.isArray(report.non_negotiable_requirements) || report.non_negotiable_requirements.length < 8) {
      failures.push(`${report.report_id}: missing non-negotiable requirements`);
    }
    if (!Array.isArray(report.core_requirement_checklist) || report.core_requirement_checklist.length !== CORE_REQUIREMENTS.length) {
      failures.push(`${report.report_id}: core-requirement checklist mismatch`);
    }
    if (!sameList(report.output_files_written, OUTPUT_PATHS)) failures.push(`${report.report_id}: output allowlist mismatch`);
    checkOutputBoundary(report.report_id, report.output_boundary, failures);
    checkFindingClassification(report.report_id, report.finding_classification, failures);
  }

  if (!Array.isArray(archetypePilot.descriptor_files) || !sameList(archetypePilot.descriptor_files, REQUIRED_DESCRIPTOR_PATHS)) {
    failures.push("archetype pilot descriptor file allowlist mismatch");
  }
  if (!Array.isArray(archetypePilot.governance_archetypes) || archetypePilot.governance_archetypes.length !== GOVERNANCE_ARCHETYPES.length) {
    failures.push("archetype pilot must include four governance archetypes");
  }
  for (const archetype of GOVERNANCE_ARCHETYPES) {
    if (!hasFragment(archetypePilot, archetype.id)) failures.push(`archetype pilot missing ${archetype.id}`);
  }

  const rowIds = crosswalk.crosswalk_rows.map((row) => row.concept_id);
  const expectedRowIds = bookCrosswalkRows.map((row) => row.concept_id);
  if (!sameList(rowIds, expectedRowIds)) failures.push("crosswalk concept rows/order mismatch");
  if (!hasFragment(crosswalk, "route-local-only")) failures.push("crosswalk missing route-local-only evidence status");
  if (crosswalk.school_owned_evidence_needed !== true) failures.push("crosswalk must retain school-owned evidence needed flag");
  for (const chapter of ["Book 1 Chapter 1.2", "Book 1 Chapter 1.3"]) {
    if (!hasFragment(crosswalk, chapter)) failures.push(`crosswalk missing ${chapter}`);
  }
  for (const descriptor of ["england", "flanders", "bavaria", "california"]) {
    if (!hasFragment(crosswalk, descriptor)) failures.push(`crosswalk missing ${descriptor} overlay requirements`);
  }
  for (const fragment of ["country edition", "inspection", "accreditation", "student/product-use", "Scale Gate"]) {
    if (!hasFragment(crosswalk, fragment)) failures.push(`crosswalk missing forbidden/boundary fragment: ${fragment}`);
  }

  const finalDecision = decision.final_overlay_architecture_decision;
  if (finalDecision.selected !== SELECTED_DECISION) failures.push("decision selected value mismatch");
  if (finalDecision.decision_selection_count !== 1) failures.push("decision must choose exactly one option");
  if (!sameList(finalDecision.allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (!sameList(decision.still_blocked, OVERLAY_BLOCKED_AUTHORITY)) failures.push("decision still_blocked list mismatch");
  if (!hasFragment(decision, "future internal selected-jurisdiction deepening")) {
    failures.push("decision must define only future internal selected-jurisdiction deepening");
  }
}

function checkMarkdown(failures) {
  const markdownFiles = OUTPUT_PATHS.filter((item) => item.endsWith(".md"));
  for (const file of markdownFiles) {
    const markdown = readUtf8(file);
    for (const fragment of ["Status:", "Sprint:", "Product End-State And Original Spec", "Non-Negotiable Requirements", "Core-Requirement Checklist"]) {
      if (!markdown.includes(fragment)) failures.push(`${file}: missing ${fragment}`);
    }
    if (!file.startsWith("docs/inspection-standards/") && !markdown.includes("Finding Classification")) {
      failures.push(`${file}: missing Finding Classification`);
    }
  }
  const governance = readUtf8("docs/inspection-standards/international-overlay-governance-rules.md");
  for (const fragment of ["Stop Conditions", "all-Belgium", "whole-UK", "single-Germany", "national-US"]) {
    if (!governance.includes(fragment)) failures.push(`governance rules missing ${fragment}`);
  }
  const decision = readUtf8("reports/inspection-standards/international-overlay-architecture-decision.md");
  for (const fragment of [
    "PROCEED_TO_SELECTED_JURISDICTION_DEEPENING",
    "Still Blocked",
    "country_edition_generation",
    "package_or_ci_product_integration",
    "product_route_adoption",
    "scale_gate_integration",
    "diagnostics_mastery_pv",
    "student_or_product_use",
  ]) {
    if (!decision.includes(fragment)) failures.push(`decision markdown missing ${fragment}`);
  }
}

function checkRefusals(failures) {
  for (const [args, expectedCode] of REFUSAL_CASES) {
    const result = runNode([GENERATOR, ...args]);
    const combined = `${result.stdout || ""}\n${result.stderr || ""}`;
    if (result.status !== 1 || !combined.includes(expectedCode)) {
      failures.push(`${args.join(" ")} did not return ${expectedCode}`);
    }
  }
}

function checkClassificationNegative(failures) {
  const localFailures = [];
  checkFindingClassification(
    "negative-overlay-classification",
    [
      {
        finding: "Unsupported labels must not pass.",
        classification: "authority_boundary",
        blocks: "Checker credibility.",
        does_not_block: "Nothing.",
        proof_required_to_close: "The checker records this as a failure.",
      },
    ],
    localFailures
  );
  if (!localFailures.some((failure) => failure.includes("unsupported REV-STD-1 classification"))) {
    failures.push("classification negative test did not reject unsupported label");
  }
}

function main() {
  const failures = [];
  checkOutputsExist(failures);
  checkCurrentness(failures);
  for (const outputPath of OUTPUT_PATHS) checkNoLocalPaths(outputPath, failures);

  const schema = readJson("references/schemas/international-jurisdiction-overlay.schema.json");
  const descriptors = REQUIRED_DESCRIPTOR_PATHS.map(readJson);
  const archetypePilot = readJson("reports/inspection-standards/international-overlay-archetype-pilot.json");
  const crosswalk = readJson("reports/inspection-standards/book1-1.2-1.3-overlay-crosswalk.json");
  const decision = readJson("reports/inspection-standards/international-overlay-architecture-decision.json");

  checkSchema(schema, failures);
  if (!sameList(descriptors.map((descriptor) => descriptor.descriptor_id), REQUIRED_DESCRIPTOR_IDS)) {
    failures.push("descriptor list/order mismatch");
  }
  for (const descriptor of descriptors) checkDescriptor(descriptor, failures);
  checkSpecificDescriptors(descriptors, failures);
  checkReports(archetypePilot, crosswalk, decision, failures);
  checkMarkdown(failures);
  checkRefusals(failures);
  checkClassificationNegative(failures);

  if (failures.length) fail(failures);
  console.log(
    `OK international overlay architecture check descriptors=${REQUIRED_DESCRIPTOR_IDS.length} archetypes=${GOVERNANCE_ARCHETYPES.length} crosswalk_rows=${bookCrosswalkRows.length} refusal_cases=${REFUSAL_CASES.length} decision=${SELECTED_DECISION}`
  );
}

main();
