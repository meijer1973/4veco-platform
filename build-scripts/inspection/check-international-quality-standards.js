#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  BLOCKED_AUTHORITY,
  DECISION_OPTIONS,
  OUTPUT_PATHS,
  REV_STD_FINDING_CLASSIFICATIONS,
  SELECTED_DECISION,
  buildBundle,
  outputContents,
} = require("./build-international-quality-standards.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-international-quality-standards.js";

const REQUIRED_JURISDICTIONS = [
  "Netherlands",
  "Belgium / Flanders",
  "England",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Poland",
  "United States",
];

const REQUIRED_COMMON_CORE_IDS = [
  "curriculum_coherence",
  "subject_knowledge_and_progression",
  "didactic_quality",
  "assessment_alignment",
  "student_support_and_differentiation",
  "accessibility_and_inclusion",
  "quality_assurance",
  "improvement_cycle",
  "safeguarding_product_school_boundaries",
];

const REFUSAL_CASES = [
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--country-compliant"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-ready"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-readiness"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
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
  [["--all-belgium"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--whole-uk"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--single-germany"], "STOP_GOVERNANCE_OVERGENERALISATION"],
  [["--national-us"], "STOP_GOVERNANCE_OVERGENERALISATION"],
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
  console.error("International quality standards check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
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

function checkAuthorityProfiles(data, failures) {
  const names = data.jurisdictions.map((profile) => profile.jurisdiction);
  if (!sameList(names, REQUIRED_JURISDICTIONS)) failures.push("jurisdiction list/order mismatch");
  for (const profile of data.jurisdictions) {
    if (!nonEmptyString(profile.governance_boundary)) failures.push(`${profile.jurisdiction}: missing governance boundary`);
    if (!Array.isArray(profile.sources) || profile.sources.length < 2) failures.push(`${profile.jurisdiction}: expected at least two sources`);
    for (const [index, source] of profile.sources.entries()) {
      for (const key of [
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
        if (!nonEmptyString(source[key])) failures.push(`${profile.jurisdiction} source ${index}: missing ${key}`);
      }
      if (!/^https:\/\//.test(source.url || "")) failures.push(`${profile.jurisdiction} source ${index}: URL must be https`);
    }
  }
  const serialized = JSON.stringify(data).toLowerCase();
  for (const fragment of ["flanders", "england is not", "kmk", "federal context", "forbidden_inference"]) {
    if (!serialized.includes(fragment)) failures.push(`authority profiles missing boundary fragment: ${fragment}`);
  }
  checkFindingClassification(data.report_id, data.finding_classification, failures);
}

function checkCommonCore(data, failures) {
  const ids = data.common_core_categories.map((category) => category.id);
  if (!sameList(ids, REQUIRED_COMMON_CORE_IDS)) failures.push("common core category order mismatch");
  for (const category of data.common_core_categories) {
    for (const key of ["classification", "common_core_claim", "overlay_need", "school_owned_boundary"]) {
      if (!nonEmptyString(category[key])) failures.push(`${category.id}: missing ${key}`);
    }
  }
  if (!Array.isArray(data.differences_matrix) || data.differences_matrix.length < 8) failures.push("differences matrix incomplete");
  if (!Array.isArray(data.overlay_architecture) || data.overlay_architecture.length !== 4) failures.push("overlay architecture must have four layers");
  if (!Array.isArray(data.portability_pilot) || data.portability_pilot.length !== 2) failures.push("portability pilot must cover two scopes");
  if (data.selected_decision !== SELECTED_DECISION) failures.push("selected decision mismatch");
}

function checkReports(commonalities, portability, decision, failures) {
  for (const report of [commonalities, portability, decision]) {
    if (report.final_decision !== SELECTED_DECISION) failures.push(`${report.report_id}: final decision mismatch`);
    for (const key of ["product_end_state", "original_sprint_gate_spec"]) {
      if (!nonEmptyString(report[key])) failures.push(`${report.report_id}: missing ${key}`);
    }
    if (!Array.isArray(report.non_negotiable_requirements) || report.non_negotiable_requirements.length < 6) {
      failures.push(`${report.report_id}: missing non-negotiable requirements`);
    }
    if (!Array.isArray(report.core_requirement_checklist) || report.core_requirement_checklist.length < 9) {
      failures.push(`${report.report_id}: missing core-requirement checklist`);
    }
    for (const item of report.core_requirement_checklist || []) {
      for (const key of ["id", "requirement", "status", "proof_required_to_close"]) {
        if (!nonEmptyString(item[key])) failures.push(`${report.report_id}: checklist item missing ${key}`);
      }
    }
    for (const flag of BLOCKED_AUTHORITY) {
      if (report.output_boundary?.[flag] !== false) failures.push(`${report.report_id}: ${flag} must remain false`);
    }
    if (!sameList(report.output_files_written, OUTPUT_PATHS)) failures.push(`${report.report_id}: output allowlist mismatch`);
    checkFindingClassification(report.report_id, report.finding_classification, failures);
  }
  const finalDecision = decision.final_foundation_decision;
  if (finalDecision.selected !== SELECTED_DECISION) failures.push("decision report selected decision mismatch");
  if (finalDecision.decision_selection_count !== 1) failures.push("decision report must choose exactly one decision");
  if (!sameList(finalDecision.allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (!sameList(decision.still_blocked, BLOCKED_AUTHORITY)) failures.push("still_blocked list mismatch");
}

function checkMarkdown(failures) {
  const files = OUTPUT_PATHS.filter((item) => item.endsWith(".md"));
  for (const file of files) {
    const markdown = readUtf8(file);
    for (const fragment of [
      "Status:",
      "Sprint:",
      "Product End-State And Original Spec",
      "Non-Negotiable Requirements",
      "Core-Requirement Checklist",
      "Finding Classification",
    ]) {
      if (file.startsWith("docs/inspection-standards/") && fragment === "Finding Classification") continue;
      if (!markdown.includes(fragment)) failures.push(`${file}: missing ${fragment}`);
    }
  }
  const decision = readUtf8("reports/inspection-standards/international-foundation-decision.md");
  for (const fragment of [
    "PROCEED_WITH_COMMON_CORE_AND_OVERLAYS",
    "Still Blocked",
    "country_compliance_claim",
    "inspection_readiness_claim",
    "op0_claim",
    "pta_validity_claim",
    "summative_validity_claim",
    "school_pack_trial",
    "package_script_invocation",
    "ci_invocation",
    "dashboard_gate",
    "quality_ref_integration",
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
    "negative-rev-std-classification",
    [
      {
        finding: "Non-standard labels must not pass.",
        classification: "authority_boundary",
        blocks: "Checker credibility.",
        does_not_block: "Nothing.",
        proof_required_to_close: "The checker records this as a local failure.",
      },
    ],
    localFailures
  );
  if (!localFailures.some((failure) => failure.includes("unsupported REV-STD-1 classification"))) {
    failures.push("classification negative test did not reject authority_boundary");
  }
}

function main() {
  const failures = [];
  checkOutputsExist(failures);
  checkCurrentness(failures);
  const authorityProfiles = readJson("references/data/inspection-standards/international-authority-profiles.v0.json");
  const commonCore = readJson("references/data/inspection-standards/international-common-core.v0.json");
  const commonalities = readJson("reports/inspection-standards/international-commonalities-and-differences.json");
  const portability = readJson("reports/inspection-standards/international-book-portability-pilot.json");
  const decision = readJson("reports/inspection-standards/international-foundation-decision.json");
  checkAuthorityProfiles(authorityProfiles, failures);
  checkCommonCore(commonCore, failures);
  checkReports(commonalities, portability, decision, failures);
  checkMarkdown(failures);
  checkRefusals(failures);
  checkClassificationNegative(failures);
  if (failures.length) fail(failures);
  console.log(
    `OK international quality standards check jurisdictions=${REQUIRED_JURISDICTIONS.length} sources=${authorityProfiles.jurisdictions.reduce((sum, profile) => sum + profile.sources.length, 0)} common_core=${REQUIRED_COMMON_CORE_IDS.length} refusal_cases=${REFUSAL_CASES.length} decision=${SELECTED_DECISION}`
  );
}

main();
