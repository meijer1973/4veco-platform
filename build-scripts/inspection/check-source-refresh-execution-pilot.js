#!/usr/bin/env node
"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

const {
  ACCESS_DATE,
  DECISION_OPTIONS,
  FORBIDDEN_FLAGS,
  GENERATED_OUTPUT_PATHS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  REFRESH_STATES,
  REQUIRED_IMPACT_AREAS,
  SELECTED_DECISION,
  UPSTREAM_DECISION_PATH,
  outputContents,
} = require("./build-source-refresh-execution-pilot.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const GENERATOR = "build-scripts/inspection/build-source-refresh-execution-pilot.js";
const SPRINT_ID = "GOAL-IQS-SOURCE-REFRESH-EXECUTION-PILOT-1";

const ENGLAND = "reports/inspection-standards/england-source-refresh-execution-results.json";
const FLANDERS = "reports/inspection-standards/flanders-source-refresh-execution-results.json";
const IMPACT = "reports/inspection-standards/source-refresh-delta-impact-analysis.json";
const DECISION = "reports/inspection-standards/source-refresh-execution-pilot-decision.json";

const REQUIRED_REPORTS = [ENGLAND, FLANDERS, IMPACT, DECISION];
const REQUIRED_REVIEW_FILES = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-schema-architecture-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-impact-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
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

function fail(failures) {
  console.error("Source refresh execution pilot check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function unique(values) {
  return [...new Set(values)];
}

function sameList(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((item, index) => item === right[index]);
}

function officialSourceIds(jurisdictionId) {
  const packet = readJson(`reports/inspection-standards/${jurisdictionId}-bounded-source-refresh-simulation.json`);
  return packet.source_inventory.map((source) => source.source_id);
}

function officialSourceById(jurisdictionId) {
  const packet = readJson(`reports/inspection-standards/${jurisdictionId}-bounded-source-refresh-simulation.json`);
  return new Map(packet.source_inventory.map((source) => [source.source_id, source]));
}

function acceptedUpstreamDecision() {
  const decision = readJson(UPSTREAM_DECISION_PATH);
  return decision.final_bounded_source_refresh_packet_decision && decision.final_bounded_source_refresh_packet_decision.selected;
}

function validateNoOutputFlags(report) {
  const failures = [];
  if (!report.no_output_flags) return failures;
  const stopCodeByFlag = {
    non_official_source_promoted: "STOP_NON_OFFICIAL_SOURCE_PROMOTION",
    hidden_source_discovery: "STOP_HIDDEN_SOURCE_DISCOVERY",
    local_expert_substituted: "STOP_LOCAL_EXPERT_SUBSTITUTION",
    localized_output_generated: "STOP_LOCALIZED_OUTPUT",
    teacher_school_facing_output_generated: "STOP_TEACHER_SCHOOL_FACING_OUTPUT",
    public_output_generated: "STOP_PUBLIC_OUTPUT",
    personal_data_processing: "STOP_PERSONAL_DATA",
    legal_compliance_claim: "STOP_LEGAL_COMPLIANCE_OVERCLAIM",
    approval_accreditation_claim: "STOP_LEGAL_COMPLIANCE_OVERCLAIM",
    op0_pta_summative_claim: "STOP_LEGAL_COMPLIANCE_OVERCLAIM",
    inspection_readiness_claim: "STOP_LEGAL_COMPLIANCE_OVERCLAIM",
    support_sufficiency_claim: "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM",
    accommodation_sufficiency_claim: "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM",
    accessibility_legal_sufficiency_claim: "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM",
  };
  for (const [flag, stopCode] of Object.entries(stopCodeByFlag)) {
    if (report.no_output_flags[flag] === true) failures.push(stopCode);
  }
  return unique(failures);
}

function validateCommon(report, expectedType) {
  const failures = [];
  if (report.schema_version !== 1) failures.push("schema_version must be 1");
  if (report.report_type !== expectedType) failures.push(`report_type must be ${expectedType}`);
  if (report.sprint_id !== SPRINT_ID) failures.push("sprint_id mismatch");
  if (report.access_date !== ACCESS_DATE) failures.push("access_date mismatch");
  if (report.internal_only !== true) failures.push("internal_only must be true");
  if (report.manual_invocation_only !== true) failures.push("manual_invocation_only must be true");
  if (report.human_review_required !== true) failures.push("human_review_required must be true");
  if (!String(report.product_end_state || "").includes("product-end-state.md")) failures.push("product end-state citation missing");
  if (!String(report.original_sprint_gate_spec || "").includes(SPRINT_ID)) failures.push("original sprint/gate spec citation missing");
  const upstream = acceptedUpstreamDecision();
  if (upstream !== "PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT") failures.push(`${UPSTREAM_DECISION_PATH}: selected decision mismatch`);
  if (report.accepted_input_decision !== upstream) failures.push("accepted input decision mismatch");
  if (report.accepted_input_decision_source !== UPSTREAM_DECISION_PATH) failures.push("accepted input decision source mismatch");
  if (report.no_output_flags) {
    for (const flag of FORBIDDEN_FLAGS) {
      if (report.no_output_flags[flag] !== false) failures.push(`forbidden flag ${flag} must be false`);
    }
    const extra = Object.keys(report.no_output_flags).filter((flag) => !FORBIDDEN_FLAGS.includes(flag));
    if (extra.length) failures.push(`extra forbidden flags: ${extra.join(", ")}`);
  }
  const checklistIds = new Set((report.core_requirement_checklist || []).map((item) => item.id));
  for (const id of [
    "exact_source_inventory_classified",
    "official_source_allowlist_only",
    "negative_fixtures_complete",
    "no_local_expert_contact_or_substitution",
    "no_localized_or_public_output",
    "single_decision",
  ]) {
    if (report.core_requirement_checklist && !checklistIds.has(id)) failures.push(`core requirement missing ${id}`);
  }
  return failures;
}

function validateExecutionReport(report) {
  const failures = validateCommon(report, "source_refresh_execution_results");
  if (!["england", "flanders"].includes(report.jurisdiction_id)) failures.push("jurisdiction_id must be england or flanders");
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push("input_allowlist mismatch");
  if (!sameList(report.output_allowlist, GENERATED_OUTPUT_PATHS)) failures.push("output_allowlist mismatch");
  if (!sameList(report.allowed_source_states, REFRESH_STATES)) failures.push("allowed_source_states mismatch");
  const expectedIds = officialSourceIds(report.jurisdiction_id);
  const expectedById = officialSourceById(report.jurisdiction_id);
  const results = report.source_results || [];
  const actualIds = results.map((item) => item.source_id);
  if (!sameList(actualIds, expectedIds)) failures.push(`source_results inventory mismatch for ${report.jurisdiction_id}`);
  if (unique(actualIds).length !== actualIds.length) failures.push("duplicate source_id in source_results");

  for (const result of results) {
    const expected = expectedById.get(result.source_id);
    if (!expected) failures.push(`${result.source_id}: not in official allowlist`);
    else {
      if (result.official_url !== expected.official_url) failures.push(`${result.source_id}: official_url mismatch`);
      if (result.authority !== expected.authority) failures.push(`${result.source_id}: authority mismatch`);
      if (result.source_role !== expected.source_role) failures.push(`${result.source_id}: source_role mismatch`);
      if (result.previous_access_date !== expected.current_access_date) failures.push(`${result.source_id}: previous_access_date mismatch`);
      if (result.previous_known_version_date !== expected.current_known_version_or_publication_date) failures.push(`${result.source_id}: previous version mismatch`);
    }
    for (const field of [
      "source_id",
      "jurisdiction_id",
      "official_url",
      "authority",
      "source_role",
      "previous_access_date",
      "new_access_date",
      "previous_known_version_date",
      "new_observed_version_date",
      "source_state",
      "evidence_excerpt_or_metadata_note",
      "allowed_inference",
      "forbidden_inference",
      "blocks",
      "does_not_block",
      "proof_required_to_close",
    ]) {
      if (!nonEmptyString(result[field])) failures.push(`${result.source_id || "source"}: ${field} required`);
    }
    if (!REFRESH_STATES.includes(result.source_state)) failures.push(`${result.source_id}: unsupported source_state`);
    if (result.new_access_date !== ACCESS_DATE) failures.push(`${result.source_id}: new_access_date mismatch`);
    if (/inspection readiness|compliance|approval/i.test(result.allowed_inference || "")) {
      failures.push(`${result.source_id}: allowed_inference overclaims`);
    }
  }

  const counted = Object.fromEntries(REFRESH_STATES.map((state) => [state, 0]));
  for (const result of results) counted[result.source_state] += 1;
  for (const state of REFRESH_STATES) {
    if ((report.source_counts || {})[state] !== counted[state]) failures.push(`${state}: source_counts mismatch`);
  }
  return failures;
}

function validateImpactReport(report, executionReports) {
  const failures = validateCommon(report, "source_refresh_delta_impact_analysis");
  if (!sameList(report.impact_areas, REQUIRED_IMPACT_AREAS)) failures.push("impact_areas mismatch");
  const expectedIds = executionReports.flatMap((item) => item.source_results.map((result) => result.source_id));
  const impacts = report.source_impacts || [];
  if (!sameList(impacts.map((item) => item.source_id), expectedIds)) failures.push("source_impacts source order mismatch");
  const expectedNonUnchanged = executionReports
    .flatMap((item) => item.source_results)
    .filter((result) => result.source_state !== "unchanged")
    .map((result) => result.source_id);
  if (!sameList(report.uncertain_or_changed_sources, expectedNonUnchanged)) failures.push("uncertain_or_changed_sources mismatch");
  for (const impact of impacts) {
    if (!REFRESH_STATES.includes(impact.source_state)) failures.push(`${impact.source_id}: unsupported impact source_state`);
    for (const area of REQUIRED_IMPACT_AREAS) {
      if (!nonEmptyString((impact.impact_by_area || {})[area])) failures.push(`${impact.source_id}: missing impact area ${area}`);
    }
    for (const field of ["summary", "blocks", "does_not_block", "proof_required_to_close"]) {
      if (!nonEmptyString(impact[field])) failures.push(`${impact.source_id}: ${field} required`);
    }
  }
  return failures;
}

function validateDecisionReport(report, england, flanders, impact) {
  const failures = validateCommon(report, "source_refresh_execution_pilot_decision");
  if ((report.final_decision || {}).selected !== SELECTED_DECISION) failures.push("selected decision mismatch");
  if (!sameList((report.final_decision || {}).allowed_options, DECISION_OPTIONS)) failures.push("decision options mismatch");
  if (!sameList(report.input_allowlist, INPUT_ALLOWLIST)) failures.push("STOP_SOURCE_REFRESH_WITHOUT_ALLOWLIST");
  if (!sameList(report.output_allowlist, GENERATED_OUTPUT_PATHS)) failures.push("output_allowlist mismatch");
  if ((report.source_counts || {}).total_sources !== england.source_results.length + flanders.source_results.length) failures.push("total source count mismatch");
  if (!sameList((report.source_counts || {}).uncertain_or_changed_sources, impact.uncertain_or_changed_sources)) failures.push("decision uncertain sources mismatch");
  if (!Array.isArray(report.does_not_authorize) || report.does_not_authorize.length < 8) failures.push("does_not_authorize too short");
  const text = JSON.stringify(report).toLowerCase();
  for (const fragment of ["local expert contact", "localized output", "personal-data", "inspection readiness", "scale gate"]) {
    if (!text.includes(fragment)) failures.push(`decision boundary missing ${fragment}`);
  }
  failures.push(...validateNoOutputFlags(report));
  if (report.jurisdiction_overclaim === "whole_uk_from_england") failures.push("STOP_WHOLE_UK_OVERCLAIM");
  if (report.jurisdiction_overclaim === "all_belgium_from_flanders") failures.push("STOP_ALL_BELGIUM_OVERCLAIM");
  if (report.source_unavailable_closure_claim === true) failures.push("STOP_SOURCE_UNAVAILABLE_OVERCLAIM");
  return failures;
}

function validateNegativeFixture(fixture, expectedStopCode, england, flanders, impact) {
  const failures = [];
  if (fixture.valid !== false) failures.push(`${fixture.fixture_name}: valid must be false`);
  if (fixture.expected_stop_code !== expectedStopCode) failures.push(`${fixture.fixture_name}: stop code mismatch`);
  const validationFailures = validateDecisionReport(fixture, england, flanders, impact);
  if (!validationFailures.includes(expectedStopCode)) {
    failures.push(`${fixture.fixture_name}: expected validateDecisionReport to reject with ${expectedStopCode}; got ${validationFailures.join(", ") || "no failures"}`);
  }
  return failures;
}

function validateReviewFile(relativePath) {
  const text = readUtf8(relativePath);
  const failures = [];
  for (const fragment of [
    "Product End-State And Original Spec",
    "Non-Negotiable Requirements",
    "Core-Requirement Checklist",
    "blocks",
    "does_not_block",
    "proof_required_to_close",
    "PASS",
  ]) {
    if (!text.includes(fragment)) failures.push(`${relativePath}: missing ${fragment}`);
  }
  if (/Verdict:\s*PASS WITH FLAGS[\s\S]*missing core requirement/i.test(text)) {
    failures.push(`${relativePath}: PASS WITH FLAGS carries missing core requirement`);
  }
  return failures;
}

function checkGeneratorCurrentness(failures) {
  const result = runNode([GENERATOR, "--check"]);
  if (result.status !== 0) failures.push(`generator --check failed: ${result.stderr || result.stdout}`);
}

function checkOutputs(failures) {
  const expected = outputContents();
  for (const [file, content] of Object.entries(expected)) {
    const absolute = repoPath(file);
    if (!fs.existsSync(absolute)) failures.push(`${file}: missing generated output`);
    else if (fs.readFileSync(absolute, "utf8") !== content) failures.push(`${file}: generated output not current`);
  }
}

function checkRefusals(failures) {
  const cases = [
    [["--promote-non-official-source"], "STOP_NON_OFFICIAL_SOURCE_PROMOTION"],
    [["--hidden-source-discovery"], "STOP_HIDDEN_SOURCE_DISCOVERY"],
    [["--source-refresh-without-allowlist"], "STOP_SOURCE_REFRESH_WITHOUT_ALLOWLIST"],
    [["--local-expert-substitution"], "STOP_LOCAL_EXPERT_SUBSTITUTION"],
    [["--localized-output"], "STOP_LOCALIZED_OUTPUT"],
    [["--teacher-school-facing"], "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
    [["--public-output"], "STOP_PUBLIC_OUTPUT"],
    [["--personal-data"], "STOP_PERSONAL_DATA"],
    [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
    [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
    [["--source-unavailable-overclaim"], "STOP_SOURCE_UNAVAILABLE_OVERCLAIM"],
  ];
  for (const [args, stopCode] of cases) {
    const result = runNode([GENERATOR, ...args]);
    if (result.status === 0) failures.push(`${args.join(" ")} should fail`);
    if (!`${result.stdout}\n${result.stderr}`.includes(stopCode)) failures.push(`${args.join(" ")} missing ${stopCode}`);
  }
}

function runCheck() {
  const failures = [];
  checkGeneratorCurrentness(failures);
  checkOutputs(failures);

  for (const report of REQUIRED_REPORTS) {
    if (!fs.existsSync(repoPath(report))) failures.push(`${report}: missing`);
  }
  if (failures.length) fail(failures);

  const england = readJson(ENGLAND);
  const flanders = readJson(FLANDERS);
  const impact = readJson(IMPACT);
  const decision = readJson(DECISION);

  failures.push(...validateExecutionReport(england));
  failures.push(...validateExecutionReport(flanders));
  failures.push(...validateImpactReport(impact, [england, flanders]));
  failures.push(...validateDecisionReport(decision, england, flanders, impact));

  const fixtureRoot = "references/data/inspection-standards/fixtures/source-refresh-execution-pilot";
  for (const file of [
    "positive/england-source-refresh-execution-results.sample.json",
    "positive/flanders-source-refresh-execution-results.sample.json",
    "positive/source-refresh-delta-impact-analysis.sample.json",
    "positive/source-refresh-execution-pilot-decision.sample.json",
  ]) {
    if (!fs.existsSync(repoPath(`${fixtureRoot}/${file}`))) failures.push(`${file}: missing positive fixture`);
  }
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    const relativePath = `${fixtureRoot}/negative/${file}`;
    if (!fs.existsSync(repoPath(relativePath))) failures.push(`${relativePath}: missing negative fixture`);
    else failures.push(...validateNegativeFixture(readJson(relativePath), stopCode, england, flanders, impact));
  }

  for (const reviewFile of REQUIRED_REVIEW_FILES) failures.push(...validateReviewFile(reviewFile));
  checkRefusals(failures);

  if (failures.length) fail(failures);
  console.log(`OK source refresh execution pilot sources=${england.source_results.length + flanders.source_results.length} uncertain=${impact.uncertain_or_changed_sources.length} negative_fixtures=${NEGATIVE_FIXTURES.length} decision=${SELECTED_DECISION}`);
}

if (require.main === module) runCheck();

module.exports = {
  validateDecisionReport,
  validateExecutionReport,
  validateImpactReport,
  validateNegativeFixture,
};
