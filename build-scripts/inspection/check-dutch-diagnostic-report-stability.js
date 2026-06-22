#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const {
  SCOPE_DESCRIPTORS,
  normalizePath,
  semanticHash,
  sha256,
} = require("./build-dutch-diagnostic-report.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR_PATH = "build-scripts/inspection/build-dutch-diagnostic-report.js";
const CHAPTER_12_SEMANTIC_SHA256 = "76b683b6370c1e13cf46cb8094fd52c71d8d24b723b90d14fd257d5287ea7132";

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

const REQUIRED_BLOCKER_IDS_BY_SCOPE = {
  "chapter-1-2": [
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
  ],
  "chapter-1-3": [
    "INSPECT11D-TARGET-132",
    "INSPECT11D-TARGET-133",
    "INSPECT11D-FULL-BOOK",
    "INSPECT11D-CHECK-SURFACE-AUTHORITY",
    "INSPECT11D-ACCESSIBILITY-DEPTH",
    "INSPECT11EF-SCHOOL-EVIDENCE",
  ],
};

const REFUSAL_CASES = [
  [["--public"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--external"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--evidence-pack"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--teacher"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--student-data"], "STOP_PERSONAL_DATA"],
  [["--personal"], "STOP_PERSONAL_DATA"],
  [["--product-route"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--diagnostics"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--scale"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--dashboard"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--quality-ref"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--ci"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--package"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--build"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--lesson-output"], "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE"],
  [["--references/machine"], "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE"],
  [["--scope", "chapter-1-3", "--teacher"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--scope", "chapter-1-3", "--product-route"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--scope", "chapter-1-3", "--lesson-output-scan"], "STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE"],
  [["--scope", "unknown"], "STOP_UNKNOWN_SCOPE"],
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

function outputPathFor(descriptor, extension) {
  return descriptor.outputPaths.find((item) => item.endsWith(extension));
}

function checkSourceHashes(scope, descriptor, report, failures) {
  const used = report.source_files_used || [];
  const usedPaths = used.map((entry) => normalizePath(entry.path));
  if (!sameList(usedPaths, descriptor.sourcePaths)) {
    pushFailure(failures, `${scope}: source_files_used no longer matches descriptor sourcePaths order`);
  }

  const exactLessonProofPaths = new Set(descriptor.exactLessonProofPaths || []);
  for (const entry of used) {
    const relPath = normalizePath(entry.path);
    if (relPath.includes("references/machine/") || relPath.includes("references/external/")) {
      pushFailure(failures, `${scope}: protected reference path appears in source_files_used: ${relPath}`);
      continue;
    }

    if (relPath.startsWith("../4veco-lessen/")) {
      const isSpec = relPath.startsWith("../4veco-lessen/specifications/");
      const isExactProof = exactLessonProofPaths.has(relPath);
      if (!isSpec && !isExactProof) {
        pushFailure(failures, `${scope}: generated lesson path is not an exact proof allowlist entry: ${relPath}`);
      }
    }

    const fullPath = repoPath(relPath);
    if (!fs.existsSync(fullPath)) {
      pushFailure(failures, `${scope}: source file missing: ${relPath}`);
      continue;
    }

    const bytes = fs.readFileSync(fullPath);
    const actualHash = sha256(bytes);
    if (entry.sha256 !== actualHash) {
      pushFailure(failures, `${scope}: source hash mismatch for ${relPath}`);
    }
    if (entry.bytes !== bytes.length) {
      pushFailure(failures, `${scope}: source byte count mismatch for ${relPath}`);
    }
  }

  if (scope === "chapter-1-3") {
    if (exactLessonProofPaths.size !== 8) {
      pushFailure(failures, "chapter-1-3: exact lesson proof allowlist must contain 8 paths");
    }
    for (const lessonPath of exactLessonProofPaths) {
      if (!usedPaths.includes(lessonPath)) {
        pushFailure(failures, `chapter-1-3: source_files_used missing exact lesson proof path ${lessonPath}`);
      }
    }
  }
}

function checkMarkdownAlignment(scope, descriptor, report, markdown, failures) {
  for (const required of descriptor.requiredMarkdownFragments) {
    if (!markdown.includes(required)) {
      pushFailure(failures, `${scope}: Markdown is missing ${required}`);
    }
  }

  if (!markdown.includes(`Status: ${report.status}`)) {
    pushFailure(failures, `${scope}: Markdown status no longer matches JSON status`);
  }
  if (!markdown.includes(`Sprint: \`${report.sprint_id}\``)) {
    pushFailure(failures, `${scope}: Markdown sprint no longer matches JSON sprint_id`);
  }
  if (!markdown.includes(`Report surface: ${report.scope.report_surface}`)) {
    pushFailure(failures, `${scope}: Markdown report surface no longer matches JSON scope`);
  }
  if (!markdown.includes(`Evidence status: \`${report.evidence_status}\``)) {
    pushFailure(failures, `${scope}: Markdown evidence status no longer matches JSON evidence_status`);
  }

  for (const item of report["4veco_product_evidence"] || []) {
    if (!markdown.includes(`| \`${item.target}\` | \`${item.status}\``)) {
      pushFailure(failures, `${scope}: Markdown target/status row missing for ${item.target}`);
    }
  }

  for (const id of REQUIRED_BLOCKER_IDS_BY_SCOPE[scope] || []) {
    if (!markdown.includes(`\`${id}\``)) {
      pushFailure(failures, `${scope}: Markdown missing required blocker ${id}`);
    }
  }

  for (const code of descriptor.stopCodes) {
    if (!markdown.includes(`\`${code}\``)) {
      pushFailure(failures, `${scope}: Markdown refusal policy missing ${code}`);
    }
  }

  for (const outputPath of report.output_files_written || []) {
    if (!markdown.includes(`\`${outputPath}\``)) {
      pushFailure(failures, `${scope}: Markdown output boundary missing ${outputPath}`);
    }
  }

  for (const forbidden of report.forbidden_inference || []) {
    if (!markdown.includes(forbidden.inference)) {
      pushFailure(failures, `${scope}: Markdown missing forbidden inference: ${forbidden.inference}`);
    }
  }

  if (scope === "chapter-1-3") {
    for (const phrase of [
      "route-local-only",
      "school-owned evidence still needed",
      "check-surface authority separation",
      "Owner next action",
      "proof_required_to_close",
    ]) {
      if (!markdown.includes(phrase)) {
        pushFailure(failures, `chapter-1-3: Markdown missing visible phrase ${phrase}`);
      }
    }
  }
}

function checkReportBoundaries(scope, descriptor, report, failures) {
  for (const field of ["diagnostic_only", "internal_only", "manual_invocation_only"]) {
    if (report[field] !== true) pushFailure(failures, `${scope}: ${field} must be true`);
  }

  for (const flag of EXPECTED_FALSE_FLAGS) {
    if (report[flag] !== false) pushFailure(failures, `${scope}: ${flag} must remain false`);
  }

  if (!report.source_checkout_notes || Object.prototype.hasOwnProperty.call(report.source_checkout_notes, "platform_head")) {
    pushFailure(failures, `${scope}: source_checkout_notes must not embed platform_head`);
  }
  if (!report.source_checkout_notes || Object.prototype.hasOwnProperty.call(report.source_checkout_notes, "lesson_specs_head")) {
    pushFailure(failures, `${scope}: source_checkout_notes must not embed lesson_specs_head`);
  }
  if (!report.source_checkout_notes || !report.source_checkout_notes.platform_head_policy) {
    pushFailure(failures, `${scope}: source_checkout_notes.platform_head_policy is required`);
  }

  const reportOutputs = report.output_files_written || [];
  if (!sameList(reportOutputs, descriptor.outputPaths)) {
    pushFailure(failures, `${scope}: output_files_written no longer matches descriptor outputPaths`);
  }

  const policyCodes = (report.refusal_policy || []).map((entry) => entry.code);
  if (!sameList(policyCodes, descriptor.stopCodes)) {
    pushFailure(failures, `${scope}: refusal_policy codes no longer match descriptor stopCodes`);
  }

  if (report.public_external_sharing_status?.status !== "not_authorized") {
    pushFailure(failures, `${scope}: public_external_sharing_status must remain not_authorized`);
  }
  if (report.refusal_status?.status !== "none") {
    pushFailure(failures, `${scope}: default refusal_status must remain none`);
  }

  const blockerIds = new Set((report.blockers || []).map((item) => item.id));
  for (const id of REQUIRED_BLOCKER_IDS_BY_SCOPE[scope] || []) {
    if (!blockerIds.has(id)) pushFailure(failures, `${scope}: JSON blockers missing ${id}`);
  }

  if (scope === "chapter-1-2") {
    const actualHash = semanticHash(report);
    if (actualHash !== CHAPTER_12_SEMANTIC_SHA256) {
      pushFailure(failures, `chapter-1-2: semantic hash changed ${actualHash}`);
    }
  }

  if (scope === "chapter-1-3") {
    if (report.evidence_status !== "route_local_only_with_downstream_blockers") {
      pushFailure(failures, "chapter-1-3: evidence_status must be route_local_only_with_downstream_blockers");
    }
    if (report.source_traceability?.source_registry_mutated !== false) {
      pushFailure(failures, "chapter-1-3: source_traceability must preserve source_registry_mutated false");
    }
    for (const forbidden of [
      "evidence-pack generation",
      "teacher/school-facing output",
      "public/external output",
      "product-route adoption",
      "diagnostics/mastery/PV",
      "student-use",
      "product-use",
    ]) {
      const text = JSON.stringify(report).toLowerCase();
      if (!text.includes(forbidden.toLowerCase())) {
        pushFailure(failures, `chapter-1-3: JSON missing forbidden boundary ${forbidden}`);
      }
    }
  }
}

function checkRefusals(failures) {
  for (const [args, expectedCode] of REFUSAL_CASES) {
    const result = runNode([GENERATOR_PATH, ...args]);
    const combined = `${result.stdout || ""}\n${result.stderr || ""}`;
    if (result.status !== 1 || !combined.includes(expectedCode)) {
      pushFailure(failures, `${args.join(" ")} did not return ${expectedCode}`);
    }
  }
}

function main() {
  const failures = [];
  const generatorSource = readUtf8(GENERATOR_PATH);

  const generatorCheck = runNode([GENERATOR_PATH, "--check", "--scope", "all"]);
  if (generatorCheck.status !== 0) {
    pushFailure(
      failures,
      `generator --check --scope all failed: ${(generatorCheck.stdout || "").trim()} ${(generatorCheck.stderr || "").trim()}`
    );
  }

  for (const [scope, descriptor] of Object.entries(SCOPE_DESCRIPTORS)) {
    const reportPath = outputPathFor(descriptor, ".json");
    const markdownPath = outputPathFor(descriptor, ".md");
    const report = readJson(reportPath);
    const markdown = readUtf8(markdownPath);

    checkSourceHashes(scope, descriptor, report, failures);
    checkReportBoundaries(scope, descriptor, report, failures);
    checkMarkdownAlignment(scope, descriptor, report, markdown, failures);
  }

  checkRefusals(failures);

  if (failures.length > 0) {
    console.error("INSPECT-11E/F diagnostic stability check failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(
    [
      "OK INSPECT-11E/F diagnostic stability check",
      `scopes=${Object.keys(SCOPE_DESCRIPTORS).join(",")}`,
      `refusal_cases=${REFUSAL_CASES.length}`,
      `chapter_1_2_semantic_sha256=${CHAPTER_12_SEMANTIC_SHA256}`,
      `generator_sha256=${crypto.createHash("sha256").update(generatorSource).digest("hex")}`,
    ].join(" ")
  );
}

main();
