"use strict";

const { spawnSync } = require("child_process");
const path = require("path");
const {
  ALLOWED_TRANSFORMATION_ACTIONS,
  DECISION_OPTIONS,
  SELECTED_TRIAL_CONTRACT_DECISION,
  TRIAL_BLOCKED_AUTHORITY,
} = require("./build-internal-overlay-trial-contract.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args, env = {}) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...env },
    windowsHide: true,
  });
}

describe("internal overlay trial-contract checker", () => {
  test("accepts committed internal overlay trial-contract packet", () => {
    const result = runNode(["build-scripts/inspection/check-internal-overlay-trial-contract.js"], {
      INTERNAL_OVERLAY_TRIAL_CONTRACT_CHECK_COMMITTED_OUTPUTS: "1",
    });
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK internal overlay trial-contract check");
  });

  test("refuses forbidden internal overlay trial-contract modes", () => {
    const localizedResult = runNode(["build-scripts/inspection/build-internal-overlay-trial-contract.js", "--localized-output"]);
    expect(localizedResult.status).toBe(1);
    expect(`${localizedResult.stdout}\n${localizedResult.stderr}`).toContain("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT");

    const runtimeResult = runNode(["build-scripts/inspection/build-internal-overlay-trial-contract.js", "--execute-trial"]);
    expect(runtimeResult.status).toBe(1);
    expect(`${runtimeResult.stdout}\n${runtimeResult.stderr}`).toContain("STOP_FORBIDDEN_RUNTIME");

    const productResult = runNode(["build-scripts/inspection/build-internal-overlay-trial-contract.js", "--product-route"]);
    expect(productResult.status).toBe(1);
    expect(`${productResult.stdout}\n${productResult.stderr}`).toContain("STOP_DOWNSTREAM_AUTHORITY");

    const legalResult = runNode(["build-scripts/inspection/build-internal-overlay-trial-contract.js", "--legal-sufficiency"]);
    expect(legalResult.status).toBe(1);
    expect(`${legalResult.stdout}\n${legalResult.stderr}`).toContain("STOP_COMPLIANCE_APPROVAL_CLAIM");

    const supportResult = runNode(["build-scripts/inspection/build-internal-overlay-trial-contract.js", "--support-sufficiency"]);
    expect(supportResult.status).toBe(1);
    expect(`${supportResult.stdout}\n${supportResult.stderr}`).toContain("STOP_SUPPORT_ACCOMMODATION_CLAIM");

    const discoveryResult = runNode(["build-scripts/inspection/build-internal-overlay-trial-contract.js", "--implicit-source"]);
    expect(discoveryResult.status).toBe(1);
    expect(`${discoveryResult.stdout}\n${discoveryResult.stderr}`).toContain("STOP_IMPLICIT_DISCOVERY");
  });

  test("emits a strict nested contract schema", () => {
    const schema = require(path.join(repoRoot, "references/schemas/internal-overlay-trial-contract.schema.v1.json"));
    expect(schema.additionalProperties).toBe(false);
    expect(schema.properties.contract_rows.minItems).toBe(10);
    expect(schema.properties.contract_rows.maxItems).toBe(10);
    expect(schema.properties.contract_rows.items.$ref).toBe("#/$defs/contractRow");

    const row = schema.$defs.contractRow;
    expect(row.additionalProperties).toBe(false);
    expect(row.required).toEqual(expect.arrayContaining([
      "source_bindings",
      "transformation_rationale",
      "blocker_display",
      "review_disposition",
    ]));
    expect(row.properties.transformation_actions.items.enum).toEqual(ALLOWED_TRANSFORMATION_ACTIONS);

    const noOutput = schema.$defs.noOutputEnforcement.properties;
    expect(noOutput.internal_trace_only.const).toBe(true);
    for (const key of [
      "localized_textbook_paragraphs_generated",
      "localized_exercises_generated",
      "localized_answer_models_generated",
      "student_facing_files_generated",
      "teacher_school_facing_output_generated",
      "public_output_generated",
      "personal_data_fields_present",
    ]) {
      expect(noOutput[key].const).toBe(false);
    }

    const decision = schema.$defs.closureDecision.properties;
    expect(decision.selected.const).toBe(SELECTED_TRIAL_CONTRACT_DECISION);
    expect(decision.allowed_options.prefixItems.map((item) => item.const)).toEqual(DECISION_OPTIONS);
    expect(decision.decision_selection_count.const).toBe(1);

    expect(schema.properties.output_boundary.additionalProperties).toBe(false);
    expect(schema.properties.output_boundary.required).toEqual(TRIAL_BLOCKED_AUTHORITY);
  });
});
