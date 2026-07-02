"use strict";

const { spawnSync } = require("child_process");
const path = require("path");
const {
  DECISION_OPTIONS,
  FORBIDDEN_FLAGS,
  NEGATIVE_FIXTURES,
  REFRESH_STATES,
  REQUIRED_IMPACT_AREAS,
  SELECTED_DECISION,
  noOutputFlags,
} = require("./build-source-refresh-execution-pilot.js");
const {
  validateDecisionReport,
  validateExecutionReport,
  validateImpactReport,
  validateNegativeFixture,
} = require("./check-source-refresh-execution-pilot.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("source refresh execution pilot checker", () => {
  test("accepts committed execution pilot outputs", () => {
    const result = runNode(["build-scripts/inspection/check-source-refresh-execution-pilot.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK source refresh execution pilot");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--promote-non-official-source", "STOP_NON_OFFICIAL_SOURCE_PROMOTION"],
      ["--hidden-source-discovery", "STOP_HIDDEN_SOURCE_DISCOVERY"],
      ["--source-refresh-without-allowlist", "STOP_SOURCE_REFRESH_WITHOUT_ALLOWLIST"],
      ["--local-expert-substitution", "STOP_LOCAL_EXPERT_SUBSTITUTION"],
      ["--localized-output", "STOP_LOCALIZED_OUTPUT"],
      ["--personal-data", "STOP_PERSONAL_DATA"],
      ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
      ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
    ]) {
      const result = runNode(["build-scripts/inspection/build-source-refresh-execution-pilot.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("emits strict state, impact, boundary, and decision records", () => {
    expect(REFRESH_STATES).toEqual([
      "unchanged",
      "updated_same_source",
      "replaced_by_official_successor",
      "official_source_unavailable",
      "candidate_gap_found",
      "out_of_scope_source_found",
      "requires_local_expert_interpretation",
      "requires_human_owner_decision",
    ]);
    expect(Object.keys(noOutputFlags())).toEqual(FORBIDDEN_FLAGS);
    expect(Object.values(noOutputFlags()).every((value) => value === false)).toBe(true);

    const england = require(path.join(repoRoot, "reports/inspection-standards/england-source-refresh-execution-results.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-source-refresh-execution-results.json"));
    const impact = require(path.join(repoRoot, "reports/inspection-standards/source-refresh-delta-impact-analysis.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/source-refresh-execution-pilot-decision.json"));

    expect(validateExecutionReport(england)).toEqual([]);
    expect(validateExecutionReport(flanders)).toEqual([]);
    expect(validateImpactReport(impact, [england, flanders])).toEqual([]);
    expect(validateDecisionReport(decision, england, flanders, impact)).toEqual([]);
    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode, england, flanders, impact)).toEqual([]);
      expect(validateDecisionReport(fixture, england, flanders, impact)).toContain(stopCode);
    }

    expect(england.source_results).toHaveLength(8);
    expect(flanders.source_results).toHaveLength(5);
    expect(flanders.source_results.filter((item) => item.source_state === "requires_local_expert_interpretation").map((item) => item.source_id)).toEqual([
      "be-flanders-onderwijsdoelen-so3-doorstroom",
      "be-flanders-onderwijsdoelen-modernisatie",
    ]);
    expect(impact.impact_areas).toEqual(REQUIRED_IMPACT_AREAS);
    expect(impact.uncertain_or_changed_sources).toEqual([
      "be-flanders-onderwijsdoelen-so3-doorstroom",
      "be-flanders-onderwijsdoelen-modernisatie",
    ]);
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);

    const missingImpact = JSON.parse(JSON.stringify(impact));
    delete missingImpact.source_impacts[0].impact_by_area.legal_privacy_boundary;
    expect(validateImpactReport(missingImpact, [england, flanders]).join("\n")).toContain("missing impact area legal_privacy_boundary");

    const overclaim = JSON.parse(JSON.stringify(england));
    overclaim.source_results[0].allowed_inference = "Approves inspection readiness.";
    expect(validateExecutionReport(overclaim).join("\n")).toContain("allowed_inference overclaims");
  });
});
