"use strict";

const { spawnSync } = require("child_process");
const path = require("path");
const {
  DECISION_OPTIONS,
  FORBIDDEN_AUTHORITY_FLAGS,
  REFRESH_STATES,
  SELECTED_DECISION,
  SIMULATION_CASE_TYPES,
  noOutputEnforcement,
} = require("./build-bounded-source-refresh-packet.js");
const { validateSimulation } = require("./check-bounded-source-refresh-packet.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args, env = {}) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    env: { ...process.env, ...env },
    windowsHide: true,
  });
}

describe("bounded source refresh packet checker", () => {
  test("accepts committed bounded source refresh packet", () => {
    const result = runNode(["build-scripts/inspection/check-bounded-source-refresh-packet.js"], {
      BOUNDED_SOURCE_REFRESH_PACKET_CHECK_COMMITTED_OUTPUTS: "1",
    });
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK bounded source refresh packet");
  });

  test("refuses forbidden generator modes", () => {
    const sourceRefresh = runNode(["build-scripts/inspection/build-bounded-source-refresh-packet.js", "--execute-source-refresh"]);
    expect(sourceRefresh.status).toBe(1);
    expect(`${sourceRefresh.stdout}\n${sourceRefresh.stderr}`).toContain("STOP_SOURCE_REFRESH_EXECUTION");

    const expertContact = runNode(["build-scripts/inspection/build-bounded-source-refresh-packet.js", "--contact-local-expert"]);
    expect(expertContact.status).toBe(1);
    expect(`${expertContact.stdout}\n${expertContact.stderr}`).toContain("STOP_LOCAL_EXPERT_CONTACT");

    const expertSubstitution = runNode(["build-scripts/inspection/build-bounded-source-refresh-packet.js", "--local-expert-substitution"]);
    expect(expertSubstitution.status).toBe(1);
    expect(`${expertSubstitution.stdout}\n${expertSubstitution.stderr}`).toContain("STOP_LOCAL_EXPERT_SUBSTITUTION");

    const localized = runNode(["build-scripts/inspection/build-bounded-source-refresh-packet.js", "--localized-output"]);
    expect(localized.status).toBe(1);
    expect(`${localized.stdout}\n${localized.stderr}`).toContain("STOP_LOCALIZED_OUTPUT");

    const compliance = runNode(["build-scripts/inspection/build-bounded-source-refresh-packet.js", "--inspection-readiness"]);
    expect(compliance.status).toBe(1);
    expect(`${compliance.stdout}\n${compliance.stderr}`).toContain("STOP_COMPLIANCE_APPROVAL_CLAIM");
  });

  test("emits strict schema, inventory, cases, and selected decision", () => {
    const schema = require(path.join(repoRoot, "references/schemas/bounded-source-refresh-packet.schema.v1.json"));
    expect(schema.additionalProperties).toBe(false);
    expect(schema.properties.input_allowlist.prefixItems.map((item) => item.const)).toContain("reports/inspection-standards/local-expert-source-refresh-gate-decision.json");
    expect(schema.properties.output_allowlist.prefixItems.map((item) => item.const)).toContain("reports/inspection-standards/bounded-source-refresh-packet-decision.json");
    expect(schema.$defs.sourceInventoryItem.properties.allowed_result_states.prefixItems.map((item) => item.const)).toEqual(REFRESH_STATES);
    expect(schema.$defs.simulationCase.properties.case_type.enum).toEqual(SIMULATION_CASE_TYPES);
    expect(schema.$defs.forbiddenAuthority.required).toEqual(FORBIDDEN_AUTHORITY_FLAGS);
    expect(schema.oneOf).toHaveLength(3);
    expect(schema.$defs.planReport.required).toContain("source_refresh_inventory_summary");
    expect(schema.$defs.jurisdictionSimulationReport.required).toContain("simulation_cases");
    expect(schema.$defs.decisionReport.required).toContain("final_bounded_source_refresh_packet_decision");
    expect(schema.$defs.noOutput.additionalProperties).toBe(false);

    const england = require(path.join(repoRoot, "reports/inspection-standards/england-bounded-source-refresh-simulation.json"));
    expect(england.source_inventory.map((item) => item.source_id)).toEqual([
      "england-ofsted-eif-2025",
      "england-ofsted-operating-guide-2025",
      "england-dfe-a-level-economics-content",
      "england-aqa-7136-subject-content",
      "england-aqa-7136-scheme-assessment",
      "england-aqa-economics-command-words",
      "england-aqa-7136-assessment-resources",
      "england-send-code-practice",
    ]);
    expect(england.refresh_state_model.map((item) => item.state_id)).toEqual(REFRESH_STATES);
    expect(england.simulation_cases.map((item) => item.case_type)).toEqual(SIMULATION_CASE_TYPES);
    expect(england.source_refresh_execution_performed).toBe(false);
    expect(england.local_expert_contacted).toBe(false);
    expect(england.local_expert_substitution_performed).toBe(false);
    expect(england.no_output_enforcement).toEqual(noOutputEnforcement());
    expect(validateSimulation(england)).toEqual([]);
    expect(england.core_requirement_checklist.map((item) => item.id)).toContain("england_packet_complete");
    expect(england.core_requirement_checklist.map((item) => item.id)).toContain("flanders_packet_complete");

    const missingSource = JSON.parse(JSON.stringify(england));
    missingSource.source_inventory = missingSource.source_inventory.slice(0, -1);
    expect(validateSimulation(missingSource)).toContain("STOP_SOURCE_INVENTORY_MISMATCH");

    const fakeUrl = JSON.parse(JSON.stringify(england));
    fakeUrl.source_inventory[0].official_url = "https://example.com/not-official";
    expect(validateSimulation(fakeUrl)).toContain("STOP_SOURCE_INVENTORY_MISMATCH");

    const missingState = JSON.parse(JSON.stringify(england));
    missingState.refresh_state_model = missingState.refresh_state_model.filter((item) => item.state_id !== "candidate_gap_found");
    expect(validateSimulation(missingState).join("\n")).toContain("STOP_REFRESH_STATE_MODEL_INCOMPLETE");

    const expert = JSON.parse(JSON.stringify(england));
    expert.local_expert_review_request_template.forbidden_expert_claims = expert.local_expert_review_request_template.forbidden_expert_claims.filter((item) => item !== "legal advice");
    expect(validateSimulation(expert).join("\n")).toContain("STOP_EXPERT_TEMPLATE_FORBIDDEN_CLAIM_MISSING");

    const missingCoverage = JSON.parse(JSON.stringify(england));
    missingCoverage.jurisdiction_packet_coverage.required_boundaries = missingCoverage.jurisdiction_packet_coverage.required_boundaries.filter((item) => item !== "SEND/accessibility terminology source boundary");
    expect(validateSimulation(missingCoverage).join("\n")).toContain("STOP_JURISDICTION_COVERAGE_MISSING");

    const decision = require(path.join(repoRoot, "reports/inspection-standards/bounded-source-refresh-packet-decision.json"));
    expect(decision.final_bounded_source_refresh_packet_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_bounded_source_refresh_packet_decision.allowed_options).toEqual(DECISION_OPTIONS);
  });
});
