"use strict";

const { spawnSync } = require("child_process");
const path = require("path");
const {
  DECISION_OPTIONS,
  FORBIDDEN_AUTHORITY_FLAGS,
  SELECTED_DECISION,
  SIMULATION_CASE_TYPES,
  SOURCE_CONDITIONS,
  noOutputEnforcement,
} = require("./build-local-expert-source-refresh-gate.js");
const { validateSimulation } = require("./check-local-expert-source-refresh-gate.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args, env = {}) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...env },
    windowsHide: true,
  });
}

describe("local expert source refresh gate checker", () => {
  test("accepts committed local expert source refresh gate packet", () => {
    const result = runNode(["build-scripts/inspection/check-local-expert-source-refresh-gate.js"], {
      LOCAL_EXPERT_SOURCE_REFRESH_GATE_CHECK_COMMITTED_OUTPUTS: "1",
    });
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK local expert source refresh gate");
  });

  test("refuses forbidden gate modes", () => {
    const sourceRefresh = runNode(["build-scripts/inspection/build-local-expert-source-refresh-gate.js", "--execute-source-refresh"]);
    expect(sourceRefresh.status).toBe(1);
    expect(`${sourceRefresh.stdout}\n${sourceRefresh.stderr}`).toContain("STOP_SOURCE_REFRESH_EXECUTION");

    const expert = runNode(["build-scripts/inspection/build-local-expert-source-refresh-gate.js", "--local-expert-substitution"]);
    expect(expert.status).toBe(1);
    expect(`${expert.stdout}\n${expert.stderr}`).toContain("STOP_LOCAL_EXPERT_SUBSTITUTION");

    const localized = runNode(["build-scripts/inspection/build-local-expert-source-refresh-gate.js", "--localized-output"]);
    expect(localized.status).toBe(1);
    expect(`${localized.stdout}\n${localized.stderr}`).toContain("STOP_LOCALIZED_OUTPUT");

    const school = runNode(["build-scripts/inspection/build-local-expert-source-refresh-gate.js", "--teacher-school"]);
    expect(school.status).toBe(1);
    expect(`${school.stdout}\n${school.stderr}`).toContain("STOP_TEACHER_SCHOOL_FACING_OUTPUT");

    const compliance = runNode(["build-scripts/inspection/build-local-expert-source-refresh-gate.js", "--inspection-readiness"]);
    expect(compliance.status).toBe(1);
    expect(`${compliance.stdout}\n${compliance.stderr}`).toContain("STOP_COMPLIANCE_APPROVAL_CLAIM");
  });

  test("emits strict schema, cases, and selected decision", () => {
    const schema = require(path.join(repoRoot, "references/schemas/local-expert-source-refresh-gate.schema.v1.json"));
    expect(schema.additionalProperties).toBe(false);
    expect(schema.properties.source_conditions.prefixItems.map((item) => item.const)).toEqual(SOURCE_CONDITIONS);
    expect(schema.properties.gate_simulation_case_types.prefixItems.map((item) => item.const)).toEqual(SIMULATION_CASE_TYPES);
    expect(schema.properties.forbidden_authority.required).toEqual(FORBIDDEN_AUTHORITY_FLAGS);

    const england = require(path.join(repoRoot, "reports/inspection-standards/england-source-refresh-gate-simulation.json"));
    expect(england.gate_simulation_cases.map((item) => item.case_type)).toEqual(SIMULATION_CASE_TYPES);
    expect(england.source_refresh_execution_performed).toBe(false);
    expect(england.local_expert_substitution_performed).toBe(false);
    expect(england.no_output_enforcement).toEqual(noOutputEnforcement());
    expect(validateSimulation(england)).toEqual([]);

    const missingEnglandSource = JSON.parse(JSON.stringify(england));
    missingEnglandSource.source_protocol = missingEnglandSource.source_protocol.slice(0, -1);
    expect(validateSimulation(missingEnglandSource)).toContain("STOP_SOURCE_ALLOWLIST_MISMATCH");

    const fakeUrl = JSON.parse(JSON.stringify(england));
    fakeUrl.source_protocol[0].official_url = "https://example.com/not-official";
    expect(validateSimulation(fakeUrl)).toContain("STOP_SOURCE_ALLOWLIST_MISMATCH");

    const missingBoundaryFocus = JSON.parse(JSON.stringify(england));
    missingBoundaryFocus.gate_simulation_cases.forEach((item) => {
      item.boundary_focus = "generic source refresh case";
    });
    expect(validateSimulation(missingBoundaryFocus).join("\n")).toContain("STOP_SIMULATION_BOUNDARY_COVERAGE");

    const individualAdjustment = JSON.parse(JSON.stringify(england));
    individualAdjustment.forbidden_authority.individual_adjustment_claim = true;
    expect(validateSimulation(individualAdjustment)).toContain("STOP_INDIVIDUAL_ADJUSTMENT_CLAIM");

    const supportRecordData = JSON.parse(JSON.stringify(england));
    supportRecordData.forbidden_authority.support_records_personal_data = true;
    expect(validateSimulation(supportRecordData)).toContain("STOP_SUPPORT_RECORDS_PERSONAL_DATA");

    const decision = require(path.join(repoRoot, "reports/inspection-standards/local-expert-source-refresh-gate-decision.json"));
    expect(decision.final_local_expert_source_refresh_gate_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_local_expert_source_refresh_gate_decision.allowed_options).toEqual(DECISION_OPTIONS);
  });
});
