"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

const {
  CONSENT_FIELDS,
  DECISION_OPTIONS,
  NEGATIVE_FIXTURES,
  RESPONSE_FIELDS,
  RESPONSE_INTAKE_FIELDS,
  SELECTED_DECISION,
  noOutputFlagsForPilot,
} = require("./build-local-expert-contact-pilot.js");
const {
  validateContactPacket,
  validateConsentSchema,
  validateDecisionReport,
  validateIntakeRecord,
  validateIntakeReport,
  validateNegativeFixture,
  validateResponseIntakeSchema,
  validateSimulationReport,
} = require("./check-local-expert-contact-pilot.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("local expert contact pilot checker", () => {
  test("accepts committed contact pilot outputs", () => {
    const result = runNode(["build-scripts/inspection/check-local-expert-contact-pilot.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK local expert contact pilot");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--unauthorized-contact", "STOP_UNAUTHORIZED_CONTACT_DISPATCH"],
      ["--missing-consent", "STOP_MISSING_CONSENT_BOUNDARY"],
      ["--personal-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--student-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--legal-advice", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--compliance-proof", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--inspection-readiness", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--localized-output", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
      ["--out-of-scope-source", "STOP_SOURCE_OUT_OF_SCOPE"],
      ["--out-of-scope-question", "STOP_QUESTION_OUT_OF_SCOPE"],
      ["--missing-disclaimer", "STOP_MISSING_FORBIDDEN_DISCLAIMER"],
      ["--hide-uncertainty", "STOP_HIDDEN_UNCERTAINTY"],
      ["--jurisdiction-mismatch", "STOP_JURISDICTION_MISMATCH"],
      ["--personal-data-in-text", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--school-specific-evidence", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
      ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
      ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
      ["--support-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accommodation-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accessibility-legal-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--individual-adjustment-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
    ]) {
      const result = runNode(["build-scripts/inspection/build-local-expert-contact-pilot.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("emits strict contact, consent, intake, simulation, and decision records", () => {
    const flags = noOutputFlagsForPilot();
    expect(flags.expert_contacted).toBe(false);
    expect(flags.personal_data_processing).toBe(false);
    expect(flags.contact_text_generated).toBe(true);
    expect(flags.consent_boundary_defined).toBe(true);
    expect(flags.response_intake_schema_generated).toBe(true);
    expect(flags.real_expert_response_stored).toBe(false);
    expect(CONSENT_FIELDS).toContain("no_personal_data_instruction");
    expect(RESPONSE_INTAKE_FIELDS).toEqual([
      "intake_id",
      "jurisdiction_id",
      "request_packet_id",
      "consent_confirmed",
      "response_received",
      "responses",
      "validation_status",
      "rejected_items",
      "does_not_authorize",
      "proof_required_to_use",
    ]);
    expect(RESPONSE_FIELDS).toContain("forbidden_claims_disclaimed");

    const consent = require(path.join(repoRoot, "references/schemas/local-expert-contact-consent.schema.v1.json"));
    const intakeSchema = require(path.join(repoRoot, "references/schemas/local-expert-response-intake.schema.v1.json"));
    const england = require(path.join(repoRoot, "reports/inspection-standards/england-local-expert-contact-pilot-packet.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-local-expert-contact-pilot-packet.json"));
    const intake = require(path.join(repoRoot, "reports/inspection-standards/local-expert-response-intake-report.json"));
    const simulation = require(path.join(repoRoot, "reports/inspection-standards/local-expert-contact-pilot-simulation.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/local-expert-contact-pilot-decision.json"));

    expect(validateConsentSchema(consent)).toEqual([]);
    expect(validateResponseIntakeSchema(intakeSchema)).toEqual([]);
    expect(intakeSchema.properties.responses.items.additionalProperties).toBe(false);
    expect(intakeSchema.properties.responses.items.required).toEqual(RESPONSE_FIELDS);
    expect(validateContactPacket(england)).toEqual([]);
    expect(validateContactPacket(flanders)).toEqual([]);
    expect(validateIntakeReport(intake)).toEqual([]);
    expect(validateSimulationReport(simulation)).toEqual([]);
    expect(validateDecisionReport(decision, england, flanders, intake, simulation)).toEqual([]);

    expect(england.contact_dispatch_performed).toBe(false);
    expect(flanders.contact_dispatch_performed).toBe(false);
    expect(intake.no_real_responses_stored).toBe(true);
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);
    expect(decision.owner_next_action).toContain("owner");

    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode)).toEqual([]);
      expect(validateIntakeRecord(fixture)).toContain(stopCode);
    }

    const sample = JSON.parse(JSON.stringify(intake.intake_records[0]));
    sample.response_received = true;
    sample.consent_confirmed = false;
    expect(validateIntakeRecord(sample)).toContain("STOP_MISSING_CONSENT_BOUNDARY");

    const mismatch = JSON.parse(JSON.stringify(intake.intake_records[0]));
    mismatch.responses[0].jurisdiction = "flanders";
    expect(validateIntakeRecord(mismatch)).toContain("STOP_JURISDICTION_MISMATCH");

    const personalText = JSON.parse(JSON.stringify(intake.intake_records[0]));
    personalText.responses[0].interpretation = "Student Alice Example was discussed in this case.";
    expect(validateIntakeRecord(personalText)).toContain("STOP_PERSONAL_DATA_RESPONSE");

    const learnerText = JSON.parse(JSON.stringify(intake.intake_records[0]));
    learnerText.responses[0].interpretation = "Learner Alice Example was discussed in this case.";
    expect(validateIntakeRecord(learnerText)).toContain("STOP_PERSONAL_DATA_RESPONSE");

    const schoolText = JSON.parse(JSON.stringify(intake.intake_records[0]));
    schoolText.responses[0].interpretation = "At St Mary School, implementation logs show this evidence.";
    expect(validateIntakeRecord(schoolText)).toContain("STOP_SCHOOL_EVIDENCE_RESPONSE");

    const schoolRecordsText = JSON.parse(JSON.stringify(intake.intake_records[0]));
    schoolRecordsText.responses[0].interpretation = "At Northfield Academy, implementation records show this evidence.";
    expect(validateIntakeRecord(schoolRecordsText)).toContain("STOP_SCHOOL_EVIDENCE_RESPONSE");

    const legalVariant = JSON.parse(JSON.stringify(intake.intake_records[0]));
    legalVariant.responses[0].interpretation = "This is compliant, ready for inspection, approved, and legally sufficient.";
    expect(validateIntakeRecord(legalVariant)).toContain("STOP_LEGAL_COMPLIANCE_CLAIM");

    const legalHyphenVariant = JSON.parse(JSON.stringify(intake.intake_records[0]));
    legalHyphenVariant.responses[0].interpretation = "This is ready-for-inspection.";
    expect(validateIntakeRecord(legalHyphenVariant)).toContain("STOP_LEGAL_COMPLIANCE_CLAIM");

    const individualAdjustment = JSON.parse(JSON.stringify(intake.intake_records[0]));
    individualAdjustment.responses[0].interpretation = "This confirms individual adjustment sufficiency for learners.";
    individualAdjustment.responses[0].individual_adjustment_sufficiency_conclusion = true;
    expect(validateIntakeRecord(individualAdjustment)).toContain("STOP_SUPPORT_ACCOMMODATION_OVERCLAIM");

    const bad = JSON.parse(JSON.stringify(intakeSchema));
    bad.response_record_required_fields = bad.response_record_required_fields.filter((field) => field !== "proof_required_to_use");
    expect(validateResponseIntakeSchema(bad).join("\n")).toContain("response record fields mismatch");

    const loose = JSON.parse(JSON.stringify(intakeSchema));
    loose.properties.responses.items = { type: "object" };
    expect(validateResponseIntakeSchema(loose).join("\n")).toContain("response item schema must forbid additional properties");
  });
});
