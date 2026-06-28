"use strict";

const { spawnSync } = require("child_process");
const path = require("path");
const {
  DECISION_OPTIONS,
  FORBIDDEN_EXPERT_CLAIMS,
  NEGATIVE_FIXTURES,
  NO_OUTPUT_FLAGS,
  RESPONSE_FIELDS,
  SELECTED_DECISION,
  noOutputFlags,
} = require("./build-local-expert-review-request-packet.js");
const {
  validateDecisionReport,
  validateNegativeFixture,
  validateRequestPacket,
  validateRequestSchema,
  validateResponseSchema,
  validateSimulationReport,
} = require("./check-local-expert-review-request-packet.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("local expert review request packet checker", () => {
  test("accepts committed request packet outputs", () => {
    const result = runNode(["build-scripts/inspection/check-local-expert-review-request-packet.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK local expert review request packet");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--legal-advice", "STOP_LEGAL_ADVICE_REQUEST"],
      ["--compliance-proof", "STOP_COMPLIANCE_PROOF_REQUEST"],
      ["--localized-paragraph", "STOP_LOCALIZED_OUTPUT_REQUEST"],
      ["--exam-ready-exercises", "STOP_EXAM_READY_EXERCISE_REQUEST"],
      ["--school-evidence", "STOP_SCHOOL_EVIDENCE_REQUEST"],
      ["--student-data", "STOP_STUDENT_DATA_REQUEST"],
      ["--support-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accommodation-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accessibility-legal-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--expert-as-official-authority", "STOP_EXPERT_AUTHORITY_SUBSTITUTION"],
      ["--hide-source-uncertainty", "STOP_HIDDEN_SOURCE_UNCERTAINTY"],
      ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
      ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
    ]) {
      const result = runNode(["build-scripts/inspection/build-local-expert-review-request-packet.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("emits strict request, response, simulation, and decision records", () => {
    expect(Object.keys(noOutputFlags())).toEqual(NO_OUTPUT_FLAGS);
    expect(Object.values(noOutputFlags()).every((value) => value === false)).toBe(true);
    expect(FORBIDDEN_EXPERT_CLAIMS).toContain("legal advice");
    expect(RESPONSE_FIELDS).toEqual([
      "reviewer_role",
      "jurisdiction",
      "source_id",
      "source_state_seen",
      "question_id",
      "answer_type",
      "interpretation",
      "confidence",
      "uncertainty",
      "cited_source",
      "forbidden_claims_disclaimed",
      "does_not_authorize",
      "proof_required_to_use",
    ]);

    const requestSchema = require(path.join(repoRoot, "references/schemas/local-expert-review-request.schema.v1.json"));
    const responseSchema = require(path.join(repoRoot, "references/schemas/local-expert-review-response.schema.v1.json"));
    const england = require(path.join(repoRoot, "reports/inspection-standards/england-local-expert-review-request-packet.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-local-expert-review-request-packet.json"));
    const simulation = require(path.join(repoRoot, "reports/inspection-standards/local-expert-review-request-simulation.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/local-expert-review-request-decision.json"));

    expect(validateRequestSchema(requestSchema)).toEqual([]);
    expect(validateResponseSchema(responseSchema)).toEqual([]);
    expect(validateRequestPacket(england)).toEqual([]);
    expect(validateRequestPacket(flanders)).toEqual([]);
    expect(validateSimulationReport(simulation)).toEqual([]);
    expect(validateDecisionReport(decision, england, flanders, simulation)).toEqual([]);

    expect(england.source_ids_in_scope).toHaveLength(8);
    expect(flanders.source_ids_in_scope).toHaveLength(5);
    expect(Object.entries(flanders.source_states_from_refresh_pilot).filter(([, state]) => state === "requires_local_expert_interpretation").map(([sourceId]) => sourceId)).toEqual([
      "be-flanders-onderwijsdoelen-so3-doorstroom",
      "be-flanders-onderwijsdoelen-modernisatie",
    ]);
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);

    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode)).toEqual([]);
      expect(validateRequestPacket(fixture)).toContain(stopCode);
    }

    const bad = JSON.parse(JSON.stringify(responseSchema));
    bad.required = bad.required.filter((field) => field !== "proof_required_to_use");
    expect(validateResponseSchema(bad).join("\n")).toContain("response schema required fields mismatch");
  });
});
