#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  OUTPUT_PATHS,
  SOURCE_PATHS,
  sha256,
} = require("./build-dqs-closure-candidate.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-dqs-closure-candidate.js";

const FALSE_FLAGS = [
  "evidence_pack_generated",
  "teacher_school_facing_output_generated",
  "public_external_output_generated",
  "public_external_sharing_authorized",
  "package_script_or_ci_integration_created",
  "dashboard_gate_created",
  "quality_ref_or_scale_gate_integration_created",
  "generated_lesson_output_mutated",
  "protected_reference_or_source_registry_mutated",
  "personal_data_present",
  "product_route_adoption_authorized",
  "diagnostics_mastery_pv_authorized",
  "student_or_product_use_authorized",
  "non_dutch_standards_work_authorized",
  "compliance_or_approval_claim",
  "inspection_readiness_claim",
];

const REQUIRED_MARKDOWN_FRAGMENTS = [
  "## Product End-State And Original Spec",
  "## Non-Negotiable Requirements",
  "## Core Requirement Checklist",
  "## Closure Recommendation",
  "## Maturity Assessment",
  "## Authorised Surfaces",
  "## Source Profile Status",
  "## Finding Classification",
  "## Forbidden Inference",
  "## School-Owned Evidence Still Needed",
  "## Proof Required To Close",
  "## Output Boundary",
  "PASS WITH FLAGS may not carry a missing core requirement",
  "draft_bounded_dutch_only",
  "blocked_future_authority_required",
  "not_claimed",
  "teacher/school-facing",
  "public/external",
  "Scale Gate",
  "student/product-use",
];

const REFUSAL_CASES = [
  [["--public"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--external"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--teacher"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--school-facing"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--evidence-pack"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--personal"], "STOP_PERSONAL_DATA"],
  [["--student-data"], "STOP_PERSONAL_DATA"],
  [["--scale"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--dashboard"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--quality-ref"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--product-route"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--diagnostics"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--non-dutch"], "STOP_NON_DUTCH_SCOPE_REQUEST"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-ready"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--op0"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--pta"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--summative"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--lesson-output"], "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE"],
  [["--references/machine"], "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE"],
];

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readUtf8(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readUtf8(relativePath));
}

function runNode(args) {
  return childProcess.spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
}

function fail(failures) {
  console.error("DQS closure candidate check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

function sameList(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function checkCurrentness(failures) {
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) {
    failures.push(`generator --check failed: ${(result.stdout || "").trim()} ${(result.stderr || "").trim()}`);
  }
}

function checkSourceAndOutputAllowlists(report, failures) {
  const used = (report.source_files_used || []).map((entry) => entry.path);
  if (!sameList(used, SOURCE_PATHS)) {
    failures.push("source_files_used does not match the exact source allowlist order");
  }
  for (const entry of report.source_files_used || []) {
    const fullPath = repoPath(entry.path);
    if (!fs.existsSync(fullPath)) {
      failures.push(`missing source file: ${entry.path}`);
      continue;
    }
    const bytes = fs.readFileSync(fullPath);
    if (entry.sha256 !== sha256(bytes)) failures.push(`source hash mismatch: ${entry.path}`);
    if (entry.bytes !== bytes.length) failures.push(`source byte count mismatch: ${entry.path}`);
  }
  if (!sameList(report.output_files_written || [], OUTPUT_PATHS)) {
    failures.push("output_files_written does not match the exact output allowlist");
  }
}

function checkBoundaries(report, markdown, failures) {
  for (const flag of FALSE_FLAGS) {
    if (report[flag] !== false) failures.push(`${flag} must remain false at top level`);
    if (report.output_boundary?.[flag] !== false) failures.push(`${flag} must remain false in output_boundary`);
  }

  for (const fragment of REQUIRED_MARKDOWN_FRAGMENTS) {
    if (!markdown.includes(fragment)) failures.push(`Markdown missing required fragment: ${fragment}`);
  }

  if (report.status !== "current_authority_closure_candidate") {
    failures.push(`unexpected status: ${report.status}`);
  }
  if (report.source_profile_status?.source_register_status !== "draft") {
    failures.push("source register draft status must remain visible");
  }
  if (report.source_profile_status?.evidence_profile_status !== "draft") {
    failures.push("evidence profile draft status must remain visible");
  }
  if (!/Non-Dutch standards sources.*not active DQS closure scope/i.test(report.source_profile_status?.non_dutch_inventory_policy || "")) {
    failures.push("non-Dutch inventory policy must remain visible");
  }

  const checklist = report.core_requirement_checklist || [];
  if (checklist.some((item) => !item.requirement || !item.status || !item.evidence)) {
    failures.push("core requirement checklist has an incomplete row");
  }

  const findings = report.finding_classification || [];
  for (const [index, finding] of findings.entries()) {
    for (const field of ["classification", "blocks", "does_not_block", "proof_required_to_close", "source"]) {
      if (!finding[field]) failures.push(`finding_classification[${index}] missing ${field}`);
    }
  }

  if (!findings.some((finding) => finding.classification === "future_authority_required")) {
    failures.push("future_authority_required finding is required");
  }
  if (!findings.some((finding) => finding.classification === "draft_source_profile_boundary")) {
    failures.push("draft_source_profile_boundary finding is required");
  }
  if (!findings.some((finding) => finding.classification === "downstream_gate_blocker")) {
    failures.push("downstream_gate_blocker finding is required");
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

function main() {
  const failures = [];
  checkCurrentness(failures);

  const jsonPath = OUTPUT_PATHS.find((item) => item.endsWith(".json"));
  const markdownPath = OUTPUT_PATHS.find((item) => item.endsWith(".md"));
  const report = readJson(jsonPath);
  const markdown = readUtf8(markdownPath);

  checkSourceAndOutputAllowlists(report, failures);
  checkBoundaries(report, markdown, failures);
  checkRefusals(failures);

  if (failures.length) fail(failures);
  console.log(
    `OK DQS closure candidate check sources=${SOURCE_PATHS.length} outputs=${OUTPUT_PATHS.length} refusal_cases=${REFUSAL_CASES.length}`
  );
}

main();
