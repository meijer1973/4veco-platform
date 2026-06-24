#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  CORE_REQUIREMENTS,
  DECISION_OPTIONS,
  INPUT_ALLOWLIST,
  OUTPUT_PATHS,
  PROTOTYPE_BLOCKED_AUTHORITY,
  REFUSAL_CASES,
  SELECTED_PLANNING_DECISION,
  buildBundle,
  outputContents,
} = require("./build-internal-overlay-prototype-planning.js");
const {
  REV_STD_FINDING_CLASSIFICATIONS,
} = require("./build-international-overlay-architecture.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-internal-overlay-prototype-planning.js";
const PLAN_JSON = "reports/inspection-standards/internal-overlay-prototype-plan.json";
const REFUSAL_JSON = "reports/inspection-standards/internal-overlay-prototype-refusal-matrix.json";
const DECISION_JSON = "reports/inspection-standards/internal-overlay-prototype-planning-decision.json";

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
  console.error("Internal overlay prototype planning check failed:");
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

function checkCurrentness(failures) {
  const expected = outputContents(buildBundle());
  if (!sameList([...expected.keys()], OUTPUT_PATHS)) failures.push("OUTPUT_PATHS order mismatch");
  if (process.env.INTERNAL_OVERLAY_PROTOTYPE_PLANNING_CHECK_COMMITTED_OUTPUTS === "1") {
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
    if (mismatches.length) failures.push(`committed internal overlay prototype planning output is stale: ${mismatches.join(", ")}`);
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

function checkInputSourcesExist(failures) {
  for (const inputPath of INPUT_ALLOWLIST) {
    if (!fs.existsSync(repoPath(inputPath))) failures.push(`missing input allowlist source: ${inputPath}`);
  }
}

function checkNoLocalPaths(failures) {
  for (const outputPath of OUTPUT_PATHS.filter((item) => item.endsWith(".md") || item.endsWith(".json"))) {
    const content = readUtf8(outputPath);
    if (/[A-Za-z]:\\/.test(content)) failures.push(`${outputPath}: contains local Windows absolute path`);
    if (/file:\/\//i.test(content)) failures.push(`${outputPath}: contains file URI`);
  }
}

function checkCommon(reportId, report, failures) {
  if (report.schema_version !== 1) failures.push(`${reportId}: schema_version must be 1`);
  if (report.internal_only !== true) failures.push(`${reportId}: internal_only must be true`);
  if (report.manual_invocation_only !== true) failures.push(`${reportId}: manual_invocation_only must be true`);
  if (report.human_review_required !== true) failures.push(`${reportId}: human_review_required must be true`);
  if (report.accepted_deepening_decision !== "PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING") {
    failures.push(`${reportId}: accepted selected-deepening decision mismatch`);
  }
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push(`${reportId}: input allowlist mismatch`);
  if (!sameList(report.output_allowlist, OUTPUT_PATHS)) failures.push(`${reportId}: output allowlist mismatch`);
  const checklistIds = (report.core_requirement_checklist || []).map((item) => item.id);
  if (!sameList(checklistIds, CORE_REQUIREMENTS.map(([id]) => id))) failures.push(`${reportId}: core requirement checklist mismatch`);
  for (const flag of PROTOTYPE_BLOCKED_AUTHORITY) {
    if (report.output_boundary?.[flag] !== false) failures.push(`${reportId}: ${flag} must remain false`);
  }
}

function checkFindings(reportId, findings, failures) {
  if (!Array.isArray(findings) || findings.length === 0) {
    failures.push(`${reportId}: missing finding classifications`);
    return;
  }
  for (const [index, finding] of findings.entries()) {
    for (const key of ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(finding?.[key])) failures.push(`${reportId} finding ${index}: missing ${key}`);
    }
    if (!REV_STD_FINDING_CLASSIFICATIONS.includes(finding?.classification)) {
      failures.push(`${reportId} finding ${index}: unsupported classification ${finding?.classification}`);
    }
    if (/pass with flags/i.test(JSON.stringify(finding))) failures.push(`${reportId} finding ${index}: PASS WITH FLAGS wording is not allowed`);
  }
}

function checkPlan(plan, failures) {
  checkCommon("plan", plan, failures);
  if (plan.status !== "ready_for_human_review") failures.push("plan status mismatch");
  if (!Array.isArray(plan.planning_phases) || plan.planning_phases.length !== 4) failures.push("plan must include four planning phases");
  if (!Array.isArray(plan.jurisdiction_planning) || plan.jurisdiction_planning.length !== 2) failures.push("plan must include two selected jurisdictions");
  const jurisdictions = (plan.jurisdiction_planning || []).map((item) => item.jurisdiction_id);
  if (!sameList(jurisdictions, ["england", "flanders"])) failures.push("jurisdiction planning must be England and Flanders only");
  for (const required of [
    "route_local_only evidence status",
    "school_owned_evidence_still_needed",
    "forbidden_inferences",
    "accessibility_support_limitations",
    "legal_sufficiency_blocked",
    "support_sufficiency_blocked",
    "school_owned_accommodation_evidence_needed",
    "individual_adjustment_claim_blocked",
    "support_records_personal_data_blocked",
    "check_surface_authority_separation",
    "owner_next_action",
    "proof_required_to_close",
  ]) {
    if (!(plan.blocker_display_requirements || []).includes(required)) failures.push(`plan missing blocker display requirement: ${required}`);
  }
  if (!hasFragment(plan, "no-output") && !hasFragment(plan, "localized lesson output")) failures.push("plan must explicitly preserve no-output boundary");
  if (!hasFragment(plan, "support_sufficiency_blocked")) failures.push("plan must keep support sufficiency blocked");
  if (!hasFragment(plan, "support_records_personal_data_blocked")) failures.push("plan must keep support-record personal-data blocked");
  if (hasFragment(plan, "country editions are authorized")) failures.push("plan contains unsafe country-edition authorization wording");
  checkFindings("plan", plan.finding_classification, failures);
}

function checkRefusals(report, failures) {
  checkCommon("refusal matrix", report, failures);
  if (!Array.isArray(report.refusal_cases) || report.refusal_cases.length !== REFUSAL_CASES.length) {
    failures.push("refusal matrix case count mismatch");
  }
  for (const [args, expectedCode] of REFUSAL_CASES) {
    const result = runNode([GENERATOR, ...args]);
    const output = `${result.stdout}\n${result.stderr}`;
    if (result.status === 0) failures.push(`forbidden args ${args.join(" ")} should fail`);
    if (!output.includes(expectedCode)) failures.push(`forbidden args ${args.join(" ")} missing ${expectedCode}`);
  }
  checkFindings("refusal matrix", report.finding_classification, failures);
}

function checkDecision(decision, failures) {
  checkCommon("decision", decision, failures);
  const selected = decision.final_internal_overlay_prototype_planning_decision?.selected;
  const options = decision.final_internal_overlay_prototype_planning_decision?.allowed_options;
  if (selected !== SELECTED_PLANNING_DECISION) failures.push("selected planning decision mismatch");
  if (!sameList(options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (decision.final_internal_overlay_prototype_planning_decision?.decision_selection_count !== 1) failures.push("decision must select exactly one option");
  if (!Array.isArray(decision.still_blocked) || !sameList(decision.still_blocked, PROTOTYPE_BLOCKED_AUTHORITY)) {
    failures.push("decision still_blocked mismatch");
  }
  if (!hasFragment(decision, "No runtime execution")) failures.push("decision must keep runtime execution blocked");
  if (!hasFragment(decision, "No localized chapters")) failures.push("decision must keep localized chapters blocked");
  checkFindings("decision", decision.finding_classification, failures);
}

function run() {
  const failures = [];
  checkCurrentness(failures);
  checkOutputsExist(failures);
  checkInputSourcesExist(failures);
  checkNoLocalPaths(failures);
  const plan = readJson(PLAN_JSON);
  const refusals = readJson(REFUSAL_JSON);
  const decision = readJson(DECISION_JSON);
  checkPlan(plan, failures);
  checkRefusals(refusals, failures);
  checkDecision(decision, failures);
  if (failures.length) fail(failures);
  console.log(`OK internal overlay prototype planning check phases=${plan.planning_phases.length} jurisdictions=${plan.jurisdiction_planning.length} refusal_cases=${refusals.refusal_cases.length} decision=${decision.final_internal_overlay_prototype_planning_decision.selected}`);
}

if (require.main === module) run();

module.exports = {
  run,
};
