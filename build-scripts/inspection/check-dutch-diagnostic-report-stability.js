#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR_PATH = "build-scripts/inspection/build-dutch-diagnostic-report.js";
const REPORT_JSON_PATH = "reports/inspection-standards/chapter-1-2-diagnostic-report.json";
const REPORT_MD_PATH = "reports/inspection-standards/chapter-1-2-diagnostic-report.md";

const EXPECTED_FALSE_FLAGS = [
  "evidence_pack_generated",
  "teacher_school_pack_generated",
  "public_external_facing_output_generated",
  "public_external_sharing_authorized",
  "package_script_or_ci_integration_created",
  "dashboard_gate_created",
  "quality_ref_or_scale_gate_integration_created",
  "generated_lesson_output_mutated",
  "source_registry_mutated",
  "personal_data_present",
  "product_route_adoption_authorized",
  "diagnostics_mastery_pv_authorized",
  "student_or_product_use_authorized",
];

const REQUIRED_BLOCKER_IDS = [
  "INSPECT10-122-SUBSTITUTE",
  "INSPECT10-124-FROZEN-YOGHURT",
  "INSPECT10-124-ASSET",
  "INSPECT10-ACCESSIBILITY",
  "INSPECT10-SUPPORT",
  "INSPECT10-CHECK-SURFACE-AUTHORITY",
  "INSPECT9C-CARRY-3",
  "INSPECT9C-CARRY-4",
  "INSPECT9C-CARRY-5",
  "INSPECT9C-CARRY-6",
  "INSPECT9C-CARRY-7",
];

const REFUSAL_CASES = [
  ["--public", "STOP_PUBLIC_EXTERNAL_REQUEST"],
  ["--external", "STOP_PUBLIC_EXTERNAL_REQUEST"],
  ["--evidence-pack", "STOP_PACK_STRENGTH_REQUEST"],
  ["--teacher", "STOP_PACK_STRENGTH_REQUEST"],
  ["--student-data", "STOP_PERSONAL_DATA"],
  ["--personal", "STOP_PERSONAL_DATA"],
  ["--product-route", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--diagnostics", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--scale", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--dashboard", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--quality-ref", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--ci", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--package", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--build", "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  ["--lesson-output", "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE"],
  ["--references/machine", "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE"],
];

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readUtf8(relativePath) {
  return fs.readFileSync(repoPath(relativePath), "utf8");
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function normalizePath(value) {
  return value.replace(/\\/g, "/");
}

function extractConstArray(source, name) {
  const pattern = new RegExp(`const\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\];`);
  const match = source.match(pattern);
  if (!match) throw new Error(`Could not find ${name} in generator`);
  return Array.from(match[1].matchAll(/"([^"]+)"/g)).map((item) => item[1]);
}

function sameList(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function runNode(args) {
  return childProcess.spawnSync(process.execPath, args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    windowsHide: true,
  });
}

function pushFailure(failures, message) {
  failures.push(message);
}

function checkSourceHashes(report, sourcePaths, failures) {
  const used = report.source_files_used || [];
  const usedPaths = used.map((entry) => normalizePath(entry.path));
  if (!sameList(usedPaths, sourcePaths)) {
    pushFailure(failures, "source_files_used no longer matches generator SOURCE_PATHS order");
  }

  for (const entry of used) {
    const relPath = normalizePath(entry.path);
    if (relPath.includes("references/machine/") || relPath.includes("references/external/")) {
      pushFailure(failures, `protected reference path appears in source_files_used: ${relPath}`);
      continue;
    }
    if (relPath.includes("lesson-output")) {
      pushFailure(failures, `generated lesson-output path appears in source_files_used: ${relPath}`);
      continue;
    }

    const fullPath = repoPath(relPath);
    if (!fs.existsSync(fullPath)) {
      pushFailure(failures, `source file missing: ${relPath}`);
      continue;
    }

    const bytes = fs.readFileSync(fullPath);
    const actualHash = sha256(bytes);
    if (entry.sha256 !== actualHash) {
      pushFailure(failures, `source hash mismatch for ${relPath}`);
    }
    if (entry.bytes !== bytes.length) {
      pushFailure(failures, `source byte count mismatch for ${relPath}`);
    }
  }
}

function checkMarkdownAlignment(report, markdown, stopCodes, failures) {
  for (const required of [
    "# INSPECT-10B Chapter 1.2 Internal Diagnostic Report",
    "## Safe-Use Note",
    "## Scope",
    "## 4veco_product_evidence",
    "## blockers",
    "## Refusal Policy",
    "## Output Boundary",
  ]) {
    if (!markdown.includes(required)) {
      pushFailure(failures, `Markdown is missing ${required}`);
    }
  }

  if (!markdown.includes(`Status: ${report.status}`)) {
    pushFailure(failures, "Markdown status no longer matches JSON status");
  }
  if (!markdown.includes(`Sprint: \`${report.sprint_id}\``)) {
    pushFailure(failures, "Markdown sprint no longer matches JSON sprint_id");
  }
  if (!markdown.includes(`Report surface: ${report.scope.report_surface}`)) {
    pushFailure(failures, "Markdown report surface no longer matches JSON scope");
  }
  if (!markdown.includes(`Evidence status: \`${report.evidence_status}\``)) {
    pushFailure(failures, "Markdown evidence status no longer matches JSON evidence_status");
  }

  for (const item of report["4veco_product_evidence"] || []) {
    if (!markdown.includes(`| \`${item.target}\` | \`${item.status}\``)) {
      pushFailure(failures, `Markdown target/status row missing for ${item.target}`);
    }
  }

  for (const id of REQUIRED_BLOCKER_IDS) {
    if (!markdown.includes(`\`${id}\``)) {
      pushFailure(failures, `Markdown missing required blocker ${id}`);
    }
  }

  for (const code of stopCodes) {
    if (!markdown.includes(`\`${code}\``)) {
      pushFailure(failures, `Markdown refusal policy missing ${code}`);
    }
  }

  for (const outputPath of report.output_files_written || []) {
    if (!markdown.includes(`\`${outputPath}\``)) {
      pushFailure(failures, `Markdown output boundary missing ${outputPath}`);
    }
  }

  for (const forbidden of report.forbidden_inference || []) {
    if (!markdown.includes(forbidden.inference)) {
      pushFailure(failures, `Markdown missing forbidden inference: ${forbidden.inference}`);
    }
  }
}

function checkReportBoundaries(report, outputPaths, stopCodes, failures) {
  for (const field of ["diagnostic_only", "internal_only", "manual_invocation_only"]) {
    if (report[field] !== true) pushFailure(failures, `${field} must be true`);
  }

  for (const flag of EXPECTED_FALSE_FLAGS) {
    if (report[flag] !== false) pushFailure(failures, `${flag} must remain false`);
  }

  if (!report.source_checkout_notes || Object.prototype.hasOwnProperty.call(report.source_checkout_notes, "platform_head")) {
    pushFailure(failures, "source_checkout_notes must not embed platform_head");
  }
  if (!report.source_checkout_notes || !report.source_checkout_notes.platform_head_policy) {
    pushFailure(failures, "source_checkout_notes.platform_head_policy is required");
  }

  const reportOutputs = report.output_files_written || [];
  if (!sameList(reportOutputs, outputPaths)) {
    pushFailure(failures, "output_files_written no longer matches generator OUTPUT_PATHS");
  }

  const policyCodes = (report.refusal_policy || []).map((entry) => entry.code);
  if (!sameList(policyCodes, stopCodes)) {
    pushFailure(failures, "refusal_policy codes no longer match generator STOP_CODES");
  }

  if (report.public_external_sharing_status?.status !== "not_authorized") {
    pushFailure(failures, "public_external_sharing_status must remain not_authorized");
  }
  if (report.refusal_status?.status !== "none") {
    pushFailure(failures, "default refusal_status must remain none");
  }
  if ((report.owner_next_action?.action || "").includes("Send INSPECT-10B for lead review")) {
    pushFailure(failures, "owner_next_action still contains stale pre-merge INSPECT-10B review language");
  }

  const blockerIds = new Set((report.blockers || []).map((item) => item.id));
  for (const id of REQUIRED_BLOCKER_IDS) {
    if (!blockerIds.has(id)) pushFailure(failures, `JSON blockers missing ${id}`);
  }
}

function checkRefusals(failures) {
  for (const [arg, expectedCode] of REFUSAL_CASES) {
    const result = runNode([GENERATOR_PATH, arg]);
    const combined = `${result.stdout || ""}\n${result.stderr || ""}`;
    if (result.status !== 1 || !combined.includes(expectedCode)) {
      pushFailure(failures, `${arg} did not return ${expectedCode}`);
    }
  }
}

function main() {
  const failures = [];
  const generatorSource = readUtf8(GENERATOR_PATH);
  const sourcePaths = extractConstArray(generatorSource, "SOURCE_PATHS");
  const outputPaths = extractConstArray(generatorSource, "OUTPUT_PATHS");
  const stopCodes = extractConstArray(generatorSource, "STOP_CODES");

  const generatorCheck = runNode([GENERATOR_PATH, "--check"]);
  if (generatorCheck.status !== 0) {
    pushFailure(
      failures,
      `generator --check failed: ${(generatorCheck.stdout || "").trim()} ${(generatorCheck.stderr || "").trim()}`
    );
  }

  const report = JSON.parse(readUtf8(REPORT_JSON_PATH));
  const markdown = readUtf8(REPORT_MD_PATH);

  checkSourceHashes(report, sourcePaths, failures);
  checkReportBoundaries(report, outputPaths, stopCodes, failures);
  checkMarkdownAlignment(report, markdown, stopCodes, failures);
  checkRefusals(failures);

  if (failures.length > 0) {
    console.error("INSPECT-10C diagnostic stability check failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(
    [
      "OK INSPECT-10C diagnostic stability check",
      `source_files=${sourcePaths.length}`,
      `output_files=${outputPaths.length}`,
      `refusal_cases=${REFUSAL_CASES.length}`,
      `generator_sha256=${sha256(Buffer.from(generatorSource, "utf8"))}`,
    ].join(" ")
  );
}

main();
