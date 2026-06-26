"use strict";

const { spawnSync } = require("child_process");
const path = require("path");
const {
  DECISION_OPTIONS,
  SELECTED_SIMULATION_DECISION,
  SIMULATION_BLOCKED_AUTHORITY,
  SIMULATION_STATUS_OPTIONS,
  noOutputFlags,
} = require("./build-internal-no-output-trial-simulation.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args, env = {}) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...env },
    windowsHide: true,
  });
}

describe("internal no-output trial simulation checker", () => {
  test("accepts committed internal no-output trial simulation packet", () => {
    const result = runNode(["build-scripts/inspection/check-internal-no-output-trial-simulation.js"], {
      INTERNAL_NO_OUTPUT_TRIAL_SIMULATION_CHECK_COMMITTED_OUTPUTS: "1",
    });
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK internal no-output trial simulation check");
  });

  test("refuses forbidden internal no-output simulation modes", () => {
    const localizedResult = runNode(["build-scripts/inspection/build-internal-no-output-trial-simulation.js", "--localized-output"]);
    expect(localizedResult.status).toBe(1);
    expect(`${localizedResult.stdout}\n${localizedResult.stderr}`).toContain("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT");

    const runtimeResult = runNode(["build-scripts/inspection/build-internal-no-output-trial-simulation.js", "--execute-trial"]);
    expect(runtimeResult.status).toBe(1);
    expect(`${runtimeResult.stdout}\n${runtimeResult.stderr}`).toContain("STOP_FORBIDDEN_RUNTIME");

    const sourceRefreshResult = runNode(["build-scripts/inspection/build-internal-no-output-trial-simulation.js", "--source-refresh"]);
    expect(sourceRefreshResult.status).toBe(1);
    expect(`${sourceRefreshResult.stdout}\n${sourceRefreshResult.stderr}`).toContain("STOP_SOURCE_REFRESH_EXECUTION");

    const productResult = runNode(["build-scripts/inspection/build-internal-no-output-trial-simulation.js", "--product-route"]);
    expect(productResult.status).toBe(1);
    expect(`${productResult.stdout}\n${productResult.stderr}`).toContain("STOP_DOWNSTREAM_AUTHORITY");

    const legalResult = runNode(["build-scripts/inspection/build-internal-no-output-trial-simulation.js", "--legal-sufficiency"]);
    expect(legalResult.status).toBe(1);
    expect(`${legalResult.stdout}\n${legalResult.stderr}`).toContain("STOP_COMPLIANCE_APPROVAL_CLAIM");

    const supportResult = runNode(["build-scripts/inspection/build-internal-no-output-trial-simulation.js", "--support-sufficiency"]);
    expect(supportResult.status).toBe(1);
    expect(`${supportResult.stdout}\n${supportResult.stderr}`).toContain("STOP_SUPPORT_ACCOMMODATION_CLAIM");
  });

  test("emits a strict no-output simulation schema", () => {
    const schema = require(path.join(repoRoot, "references/schemas/internal-no-output-trial-simulation.schema.v1.json"));
    expect(schema.additionalProperties).toBe(false);
    expect(schema.properties.simulation_rows.minItems).toBe(10);
    expect(schema.properties.simulation_rows.maxItems).toBe(10);
    expect(schema.properties.simulation_rows.items.$ref).toBe("#/$defs/simulationRow");

    const row = schema.$defs.simulationRow;
    expect(row.additionalProperties).toBe(false);
    expect(row.required).toEqual(expect.arrayContaining([
      "source_contract_row_id",
      "source_ids",
      "source_bindings",
      "no_output_result",
      "retained_blocker_display",
      "simulation_disposition",
    ]));

    const noOutput = schema.$defs.noOutputEnforcement.properties;
    for (const [key, value] of Object.entries(noOutputFlags())) {
      expect(noOutput[key].const).toBe(value);
    }

    expect(schema.properties.simulation_status_vocabulary.prefixItems.map((item) => item.const)).toEqual(SIMULATION_STATUS_OPTIONS);
    expect(schema.properties.output_boundary.additionalProperties).toBe(false);
    expect(schema.properties.output_boundary.required).toEqual(SIMULATION_BLOCKED_AUTHORITY);

    const decision = require(path.join(repoRoot, "reports/inspection-standards/internal-no-output-trial-simulation-decision.json"));
    expect(decision.final_internal_no_output_trial_simulation_decision.selected).toBe(SELECTED_SIMULATION_DECISION);
    expect(decision.final_internal_no_output_trial_simulation_decision.allowed_options).toEqual(DECISION_OPTIONS);
  });
});
