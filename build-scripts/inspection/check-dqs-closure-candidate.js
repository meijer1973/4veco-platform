#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  DECISION_OPTIONS,
  FALSE_FLAGS,
  OUTPUT_PATHS,
  PACK_FIRST_SCREEN,
  PACK_SECTION_ORDER,
  SELECTED_DECISION,
  SOURCE_PATHS,
  sha256,
} = require("./build-dqs-closure-candidate.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-dqs-closure-candidate.js";

const EXPECTED_REPORTS = {
  rollup: {
    json: "reports/inspection-standards/dutch-quality-standards-rollup.json",
    markdown: "reports/inspection-standards/dutch-quality-standards-rollup.md",
    report_id: "dutch-quality-standards-rollup",
  },
  pack: {
    json: "reports/inspection-standards/dutch-school-evidence-pack-candidate.json",
    markdown: "reports/inspection-standards/dutch-school-evidence-pack-candidate.md",
    report_id: "dutch-school-evidence-pack-candidate",
  },
  closure: {
    json: "reports/inspection-standards/dutch-quality-standards-closure-candidate.json",
    markdown: "reports/inspection-standards/dutch-quality-standards-closure-candidate.md",
    report_id: "dutch-quality-standards-closure-candidate",
  },
};

const REQUIRED_COMMON_MARKDOWN_FRAGMENTS = [
  "## Product End-State And Original Spec",
  "## Non-Negotiable Requirements",
  "## Core Requirement Checklist",
  "## Source Profile Status",
  "## Finding Classification",
  "## Output Boundary",
  "PASS WITH FLAGS may not carry a missing core requirement",
  "teacher/school-facing",
  "public/external",
  "school-owned",
  "international",
];

const REQUIRED_ROLLUP_CATEGORY_IDS = [
  "chapter_1_1_historical_bounded_control",
  "chapter_1_2_internal_diagnostic_scope",
  "chapter_1_3_internal_diagnostic_scope",
  "system_layer",
];

const REQUIRED_ROLLUP_FIELDS = [
  "strong_product_evidence",
  "route_local_diagnostic_evidence",
  "weak_or_missing_evidence",
  "school_owned_evidence_still_needed",
  "forbidden_inference",
  "blocks",
  "does_not_block",
  "proof_required_to_close",
];

const REFUSAL_CASES = [
  [["--public"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--external"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--publish"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--external-share"], "STOP_PUBLIC_EXTERNAL_REQUEST"],
  [["--teacher"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--school-facing"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--evidence-pack"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--school-pack"], "STOP_PACK_STRENGTH_REQUEST"],
  [["--personal"], "STOP_PERSONAL_DATA"],
  [["--student-data"], "STOP_PERSONAL_DATA"],
  [["--scale"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--dashboard"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--quality-ref"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--product-route"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--diagnostics"], "STOP_DOWNSTREAM_GATE_AUTHORITY"],
  [["--non-dutch"], "STOP_NON_DUTCH_SCOPE_REQUEST"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--compliant"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-ready"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--op0"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--op0-complete"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
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
  console.error("DQS closure bundle check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function hasNonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

function checkCurrentness(failures) {
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) {
    failures.push(`generator --check failed: ${(result.stdout || "").trim()} ${(result.stderr || "").trim()}`);
  }
}

function checkExpectedOutputsExist(failures) {
  if (!sameList(OUTPUT_PATHS, [
    EXPECTED_REPORTS.rollup.markdown,
    EXPECTED_REPORTS.rollup.json,
    EXPECTED_REPORTS.pack.markdown,
    EXPECTED_REPORTS.pack.json,
    EXPECTED_REPORTS.closure.markdown,
    EXPECTED_REPORTS.closure.json,
  ])) {
    failures.push("OUTPUT_PATHS does not match the required six-output allowlist");
  }
  for (const outputPath of OUTPUT_PATHS) {
    if (!fs.existsSync(repoPath(outputPath))) failures.push(`missing generated output: ${outputPath}`);
  }
}

function checkSourceAndOutputAllowlists(report, label, failures) {
  const used = (report.source_files_used || []).map((entry) => entry.path);
  if (!sameList(used, SOURCE_PATHS)) {
    failures.push(`${label}: source_files_used does not match the exact source allowlist order`);
  }
  for (const entry of report.source_files_used || []) {
    const fullPath = repoPath(entry.path);
    if (!fs.existsSync(fullPath)) {
      failures.push(`${label}: missing source file ${entry.path}`);
      continue;
    }
    const bytes = fs.readFileSync(fullPath);
    if (entry.sha256 !== sha256(bytes)) failures.push(`${label}: source hash mismatch ${entry.path}`);
    if (entry.bytes !== bytes.length) failures.push(`${label}: source byte count mismatch ${entry.path}`);
  }
  if (!sameList(report.output_files_written || [], OUTPUT_PATHS)) {
    failures.push(`${label}: output_files_written does not match the exact output allowlist`);
  }
}

function checkFalseFlags(report, label, failures) {
  for (const flag of FALSE_FLAGS) {
    if (report[flag] !== false) failures.push(`${label}: ${flag} must remain false at top level`);
    if (report.output_boundary?.[flag] !== false) failures.push(`${label}: ${flag} must remain false in output_boundary`);
  }
}

function checkCommonMarkdown(report, markdown, label, failures) {
  for (const fragment of REQUIRED_COMMON_MARKDOWN_FRAGMENTS) {
    if (!markdown.includes(fragment)) failures.push(`${label}: Markdown missing required fragment: ${fragment}`);
  }
  if (report.source_profile_status?.source_register_status !== "draft") {
    failures.push(`${label}: source register draft status must remain visible`);
  }
  if (report.source_profile_status?.evidence_profile_status !== "draft") {
    failures.push(`${label}: evidence profile draft status must remain visible`);
  }
  if (!/Non-Dutch standards sources.*not active DQS closure scope/i.test(report.source_profile_status?.non_dutch_inventory_policy || "")) {
    failures.push(`${label}: non-Dutch inventory policy must remain visible`);
  }
  const findings = report.finding_classification || [];
  if (!hasNonEmptyArray(findings)) failures.push(`${label}: finding_classification must be non-empty`);
  for (const [index, finding] of findings.entries()) {
    for (const field of ["classification", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!finding[field]) failures.push(`${label}: finding_classification[${index}] missing ${field}`);
    }
  }
  const checklist = report.core_requirement_checklist || [];
  if (!hasNonEmptyArray(checklist)) failures.push(`${label}: core_requirement_checklist must be non-empty`);
  if (checklist.some((item) => !item.requirement || !item.status || !item.evidence)) {
    failures.push(`${label}: core requirement checklist has an incomplete row`);
  }
}

function checkRollup(report, markdown, failures) {
  if (report.report_id !== EXPECTED_REPORTS.rollup.report_id) failures.push("rollup: unexpected report_id");
  if (report.status !== "internal_multiscope_rollup_generated") failures.push(`rollup: unexpected status ${report.status}`);
  if (report.rollup_summary?.recommended_closure_decision !== SELECTED_DECISION) {
    failures.push("rollup: recommended decision must be CLOSE_INTERNAL_SYSTEM");
  }
  const categories = report.multi_scope_categories || [];
  const ids = categories.map((category) => category.id);
  if (!sameList(ids, REQUIRED_ROLLUP_CATEGORY_IDS)) {
    failures.push("rollup: category ids/order do not match required scopes");
  }
  for (const category of categories) {
    for (const field of REQUIRED_ROLLUP_FIELDS) {
      if (!hasNonEmptyArray(category[field])) failures.push(`rollup: ${category.id} missing non-empty ${field}`);
      if (!markdown.includes(`#### ${field}`)) failures.push(`rollup markdown: missing ${field}`);
    }
  }
  for (const required of ["Chapter 1.1", "Chapter 1.2", "Chapter 1.3", "System layer"]) {
    if (!markdown.includes(required)) failures.push(`rollup markdown: missing scope ${required}`);
  }
}

function checkPack(report, markdown, failures) {
  if (report.report_id !== EXPECTED_REPORTS.pack.report_id) failures.push("pack: unexpected report_id");
  if (report.status !== "internal_candidate_only_not_for_distribution") failures.push(`pack: unexpected status ${report.status}`);
  if (!sameList(report.safe_use_first_screen || [], PACK_FIRST_SCREEN)) {
    failures.push("pack: safe_use_first_screen does not exactly match required warning text");
  }
  const expectedOpening = `# GOAL-DQS-CLOSURE-1A Internal School Evidence Pack Candidate\n\n${PACK_FIRST_SCREEN.join("\n")}\n\n`;
  if (!markdown.startsWith(expectedOpening)) {
    failures.push("pack markdown: first screen warning block is not the first content after the title");
  }
  if (!sameList(report.section_order || [], PACK_SECTION_ORDER)) {
    failures.push("pack: section_order does not match required sections");
  }
  for (const sectionName of PACK_SECTION_ORDER) {
    if (!report.sections?.[sectionName]) failures.push(`pack: missing section ${sectionName}`);
    if (!markdown.includes(`## ${sectionName}`)) failures.push(`pack markdown: missing section heading ${sectionName}`);
  }
  if (report.supports_closure_decision !== SELECTED_DECISION) {
    failures.push("pack: supports_closure_decision must be CLOSE_INTERNAL_SYSTEM");
  }
  if (report.bounded_trial_recommendation !== "do_not_authorise_trial_from_this_packet") {
    failures.push("pack: bounded_trial_recommendation must not authorise a school-pack trial");
  }
  for (const fragment of [
    "NOT FOR SCHOOL OR PUBLIC DISTRIBUTION",
    "NOT INSPECTION APPROVAL",
    "NOT LEGAL COMPLIANCE",
    "NOT COMPLETE OP0 EVIDENCE",
    "NOT SCHOOL IMPLEMENTATION EVIDENCE",
    "NOT PTA OR SUMMATIVE VALIDITY",
    "not authorised for school or public distribution",
  ]) {
    if (!markdown.includes(fragment)) failures.push(`pack markdown: missing safe-use fragment ${fragment}`);
  }
}

function checkClosure(report, markdown, failures) {
  if (report.report_id !== EXPECTED_REPORTS.closure.report_id) failures.push("closure: unexpected report_id");
  if (report.status !== "original_contract_completion_human_review_pending") {
    failures.push(`closure: unexpected status ${report.status}`);
  }
  const decision = report.final_closure_policy_decision || {};
  if (decision.selected !== SELECTED_DECISION) failures.push("closure: selected decision must be CLOSE_INTERNAL_SYSTEM");
  if (decision.decision_selection_count !== 1) failures.push("closure: decision_selection_count must be 1");
  if (!sameList(decision.allowed_options || [], DECISION_OPTIONS)) failures.push("closure: allowed decision options mismatch");
  if (!sameList(decision.rejected_options || [], DECISION_OPTIONS.filter((option) => option !== SELECTED_DECISION))) {
    failures.push("closure: rejected decision options mismatch");
  }
  if (decision.basis_from_rollup_report !== EXPECTED_REPORTS.rollup.report_id) {
    failures.push("closure: decision basis must name the roll-up report");
  }
  if (decision.basis_from_pack_candidate_report !== EXPECTED_REPORTS.pack.report_id) {
    failures.push("closure: decision basis must name the internal pack candidate report");
  }
  if (report.closure_recommendation?.decision !== SELECTED_DECISION) {
    failures.push("closure: closure_recommendation decision mismatch");
  }
  if (!markdown.includes("Selected decision: `CLOSE_INTERNAL_SYSTEM`")) {
    failures.push("closure markdown: explicit selected decision missing");
  }
  if (!markdown.includes("No school-pack trial is authorised")) {
    failures.push("closure markdown: no school-pack trial boundary missing");
  }
  const classifications = (report.finding_classification || []).map((finding) => finding.classification);
  for (const required of [
    "core_requirement_closed",
    "closure_policy_decision",
    "school_evidence_boundary",
    "draft_source_profile_boundary",
    "downstream_gate_blocker",
    "school_evidence_gap",
  ]) {
    if (!classifications.includes(required)) failures.push(`closure: missing finding classification ${required}`);
  }
}

function checkConsistency(reports, failures) {
  const { rollup, pack, closure } = reports;
  if (pack.rollup_report_id !== rollup.report_id) failures.push("consistency: pack does not reference roll-up report");
  if (closure.rollup_report_id !== rollup.report_id) failures.push("consistency: closure does not reference roll-up report");
  if (closure.internal_pack_candidate_report_id !== pack.report_id) {
    failures.push("consistency: closure does not reference internal pack candidate report");
  }
  if (rollup.rollup_summary?.recommended_closure_decision !== pack.supports_closure_decision) {
    failures.push("consistency: roll-up and pack candidate decisions diverge");
  }
  if (closure.final_closure_policy_decision?.selected !== rollup.rollup_summary?.recommended_closure_decision) {
    failures.push("consistency: closure and roll-up decisions diverge");
  }
  for (const report of Object.values(reports)) {
    if (report.dutch_only !== true) failures.push(`${report.report_id}: dutch_only must be true`);
    if (report.international_work_authorized !== false) failures.push(`${report.report_id}: international work must remain unauthorised`);
    if (report.teacher_school_facing_output_generated !== false || report.teacher_school_distribution_authorized !== false) {
      failures.push(`${report.report_id}: teacher/school-facing output/distribution must remain false`);
    }
    if (report.public_external_output_generated !== false || report.public_distribution_authorized !== false) {
      failures.push(`${report.report_id}: public/external output/distribution must remain false`);
    }
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
  checkExpectedOutputsExist(failures);
  checkCurrentness(failures);

  const reports = {
    rollup: readJson(EXPECTED_REPORTS.rollup.json),
    pack: readJson(EXPECTED_REPORTS.pack.json),
    closure: readJson(EXPECTED_REPORTS.closure.json),
  };
  const markdown = {
    rollup: readUtf8(EXPECTED_REPORTS.rollup.markdown),
    pack: readUtf8(EXPECTED_REPORTS.pack.markdown),
    closure: readUtf8(EXPECTED_REPORTS.closure.markdown),
  };

  for (const [label, report] of Object.entries(reports)) {
    checkSourceAndOutputAllowlists(report, label, failures);
    checkFalseFlags(report, label, failures);
    checkCommonMarkdown(report, markdown[label], label, failures);
  }

  checkRollup(reports.rollup, markdown.rollup, failures);
  checkPack(reports.pack, markdown.pack, failures);
  checkClosure(reports.closure, markdown.closure, failures);
  checkConsistency(reports, failures);
  checkRefusals(failures);

  if (failures.length) fail(failures);
  console.log(
    `OK DQS closure bundle check sources=${SOURCE_PATHS.length} outputs=${OUTPUT_PATHS.length} refusal_cases=${REFUSAL_CASES.length} decision=${SELECTED_DECISION}`
  );
}

main();
