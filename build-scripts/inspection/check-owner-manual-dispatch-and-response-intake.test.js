"use strict";

const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

const {
  DECISION_OPTIONS,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  SELECTED_DECISION,
  noOutputFlagsForOwnerDispatch,
  outputContents,
  ownerDispatchRecord,
  responseIntakeReport,
  validResponse,
} = require("./build-owner-manual-dispatch-and-response-intake.js");
const {
  validateDecisionReport,
  validateNegativeFixture,
  validateOwnerDispatchRecord,
  validateQuarantineReport,
  validateResponseIntakeReport,
} = require("./check-owner-manual-dispatch-and-response-intake.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("owner manual dispatch and response intake checker", () => {
  test("accepts committed owner dispatch/intake outputs", () => {
    const result = runNode(["build-scripts/inspection/check-owner-manual-dispatch-and-response-intake.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK owner manual dispatch/intake");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--claim-dispatch", "STOP_UNSUPPORTED_DISPATCH_PROOF"],
      ["--material-sent", "STOP_UNSUPPORTED_DISPATCH_PROOF"],
      ["--named-contact", "STOP_PERSONAL_CONTACT_DETAILS"],
      ["--response-without-consent", "STOP_MISSING_CONSENT_BOUNDARY"],
      ["--personal-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--student-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--school-evidence", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
      ["--legal-advice", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--compliance-proof", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--inspection-readiness", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--localized-output", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
      ["--support-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accommodation-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accessibility-legal-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--individual-adjustment-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--expert-authority", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
      ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
      ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
      ["--proceed-to-analysis", "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
    ]) {
      const result = runNode(["build-scripts/inspection/build-owner-manual-dispatch-and-response-intake.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("records honest not-sent dispatch state and blocks response analysis", () => {
    const flags = noOutputFlagsForOwnerDispatch();
    expect(flags.owner_manual_dispatch_goal_authorized).toBe(true);
    expect(flags.owner_delivery_channel_configured).toBe(false);
    expect(flags.owner_material_sent).toBe(false);
    expect(flags.response_analysis_authorized).toBe(false);
    expect(flags.protocol_revision_required).toBe(true);

    const dispatch = require(path.join(repoRoot, "reports/inspection-standards/owner-manual-dispatch-record.json"));
    const england = require(path.join(repoRoot, "reports/inspection-standards/england-local-expert-response-intake.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-local-expert-response-intake.json"));
    const quarantine = require(path.join(repoRoot, "reports/inspection-standards/local-expert-response-quarantine-report.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.json"));

    expect(Object.keys(outputContents())).toEqual(OUTPUT_ALLOWLIST);
    expect(dispatch.repository_claims_external_dispatch).toBe(false);
    expect(dispatch.material_sent_count).toBe(0);
    expect(dispatch.jurisdictions.every((item) => item.delivery_status === "not_sent_no_owner_delivery_channel_proof")).toBe(true);
    expect(england.schema_intake_record.responses).toEqual([]);
    expect(flanders.response_received).toBe(false);
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);
    expect(decision.proceed_to_expert_response_analysis).toBe(false);
    expect(validateOwnerDispatchRecord(dispatch)).toEqual([]);
    expect(validateResponseIntakeReport(england)).toEqual([]);
    expect(validateResponseIntakeReport(flanders)).toEqual([]);
    expect(validateQuarantineReport(quarantine)).toEqual([]);
    expect(validateDecisionReport(decision, dispatch, england, flanders, quarantine)).toEqual([]);
  });

  test("negative fixtures are rejected by the same checker paths", () => {
    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/owner-manual-dispatch-and-response-intake/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode)).toEqual([]);
    }
  });

  test("checker compares owner records to committed contact-stage input JSON", () => {
    const stagePath = path.join(repoRoot, "reports/inspection-standards/england-local-expert-contact-dispatch-record.json");
    const originalStageText = fs.readFileSync(stagePath, "utf8");
    const committedOwner = JSON.parse(fs.readFileSync(path.join(repoRoot, "reports/inspection-standards/owner-manual-dispatch-record.json"), "utf8"));
    try {
      const tamperedStage = JSON.parse(originalStageText);
      tamperedStage.source_ids_in_scope = ["tampered-stage-input"];
      fs.writeFileSync(stagePath, `${JSON.stringify(tamperedStage, null, 2)}\n`);
      expect(validateOwnerDispatchRecord(committedOwner)).toContain("source IDs mismatch");
    } finally {
      fs.writeFileSync(stagePath, originalStageText);
    }
  });

  test("checker compares owner intake to committed contact-stage intake JSON", () => {
    const stagePath = path.join(repoRoot, "reports/inspection-standards/local-expert-contact-stage-response-intake-report.json");
    const originalStageText = fs.readFileSync(stagePath, "utf8");
    const committedOwner = JSON.parse(fs.readFileSync(path.join(repoRoot, "reports/inspection-standards/england-local-expert-response-intake.json"), "utf8"));
    try {
      const tamperedStage = JSON.parse(originalStageText);
      tamperedStage.intake_records[0].response_received = true;
      fs.writeFileSync(stagePath, `${JSON.stringify(tamperedStage, null, 2)}\n`);
      expect(validateResponseIntakeReport(committedOwner)).toContain("source stage response baseline mismatch");
    } finally {
      fs.writeFileSync(stagePath, originalStageText);
    }
  });

  test("checker compares owner quarantine to committed contact-stage quarantine JSON", () => {
    const stagePath = path.join(repoRoot, "reports/inspection-standards/local-expert-contact-stage-quarantine-report.json");
    const originalStageText = fs.readFileSync(stagePath, "utf8");
    const committedOwner = JSON.parse(fs.readFileSync(path.join(repoRoot, "reports/inspection-standards/local-expert-response-quarantine-report.json"), "utf8"));
    try {
      const tamperedStage = JSON.parse(originalStageText);
      tamperedStage.quarantine_rules.push({
        rule_id: "tampered-stage-quarantine",
        expected_stop_code: "STOP_TAMPERED_STAGE_QUARANTINE",
        proof_required_to_close: "Tamper probe only.",
      });
      fs.writeFileSync(stagePath, `${JSON.stringify(tamperedStage, null, 2)}\n`);
      expect(validateQuarantineReport(committedOwner)).toContain("source stage quarantine rule count mismatch");
    } finally {
      fs.writeFileSync(stagePath, originalStageText);
    }
  });

  test("direct mutations catch dispatch proof, contact detail, and response-analysis failures", () => {
    const dispatch = ownerDispatchRecord();
    dispatch.repository_claims_external_dispatch = true;
    expect(validateOwnerDispatchRecord(dispatch)).toContain("STOP_UNSUPPORTED_DISPATCH_PROOF");

    const contact = ownerDispatchRecord();
    contact.jurisdictions[0].role_only_contact_basis.storage_boundary = "email: named.person@example.test";
    expect(validateOwnerDispatchRecord(contact)).toContain("STOP_PERSONAL_CONTACT_DETAILS");

    const intake = responseIntakeReport("england", ownerDispatchRecord());
    intake.response_received = true;
    intake.owner_delivery_proof_recorded = true;
    intake.schema_intake_record.consent_confirmed = true;
    intake.schema_intake_record.response_received = true;
    intake.schema_intake_record.responses = [validResponse("england")];
    intake.schema_intake_record.validation_status = "accepted_for_internal_review";
    intake.schema_intake_record.responses[0].interpretation = "This expert feedback is official authority.";
    expect(validateResponseIntakeReport(intake)).toContain("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");

    const quarantine = require(path.join(repoRoot, "reports/inspection-standards/local-expert-response-quarantine-report.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/owner-manual-dispatch-and-response-intake-decision.json"));
    const badDecision = JSON.parse(JSON.stringify(decision));
    badDecision.proceed_to_expert_response_analysis = true;
    badDecision.final_decision.selected = "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS";
    expect(validateDecisionReport(badDecision, ownerDispatchRecord(), responseIntakeReport("england", ownerDispatchRecord()), responseIntakeReport("flanders", ownerDispatchRecord()), quarantine)).toContain("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  });
});
