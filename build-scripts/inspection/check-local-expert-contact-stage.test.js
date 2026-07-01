"use strict";

const { spawnSync } = require("child_process");
const path = require("path");

const {
  DECISION_OPTIONS,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  SELECTED_DECISION,
  dispatchRecord,
  noOutputFlagsForStage,
  outputContents,
  validResponse,
} = require("./build-local-expert-contact-stage.js");
const { contactPacket } = require("./build-local-expert-contact-pilot.js");
const {
  validateDecisionReport,
  validateDispatchRecord,
  validateIntakeReport,
  validateNegativeFixture,
  validateQuarantineReport,
  validateReviewFile,
  validateStageIntakeRecord,
} = require("./check-local-expert-contact-stage.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("local expert contact stage checker", () => {
  test("accepts committed contact-stage outputs", () => {
    const result = runNode(["build-scripts/inspection/check-local-expert-contact-stage.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK local expert contact stage");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--named-expert", "STOP_NAMED_EXPERT_SELECTION"],
      ["--personal-contact-details", "STOP_PERSONAL_CONTACT_DETAILS"],
      ["--missing-legal-review", "STOP_MISSING_LEGAL_PRIVACY_REVIEW"],
      ["--missing-source-review", "STOP_MISSING_JURISDICTION_SOURCE_REVIEW"],
      ["--contact-text-drift", "STOP_CONTACT_TEXT_DRIFT"],
      ["--forbidden-attachment", "STOP_FORBIDDEN_ATTACHMENT"],
      ["--external-dispatch", "STOP_UNAUTHORIZED_EXTERNAL_DISPATCH"],
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
    ]) {
      const result = runNode(["build-scripts/inspection/build-local-expert-contact-stage.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("keeps dispatch role-only and reuses approved contact text exactly", () => {
    const flags = noOutputFlagsForStage();
    expect(flags.owner_authorization_recorded).toBe(true);
    expect(flags.dispatch_records_created).toBe(true);
    expect(flags.external_contact_dispatch_performed).toBe(false);
    expect(flags.real_expert_response_stored).toBe(false);

    const england = require(path.join(repoRoot, "reports/inspection-standards/england-local-expert-contact-dispatch-record.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-local-expert-contact-dispatch-record.json"));
    const intake = require(path.join(repoRoot, "reports/inspection-standards/local-expert-contact-stage-response-intake-report.json"));
    const quarantine = require(path.join(repoRoot, "reports/inspection-standards/local-expert-contact-stage-quarantine-report.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/local-expert-contact-stage-decision.json"));

    expect(Object.keys(outputContents())).toEqual(OUTPUT_ALLOWLIST);
    expect(england.contact_text).toBe(contactPacket("england").contact_text);
    expect(flanders.contact_text).toBe(contactPacket("flanders").contact_text);
    expect(england.candidate.named_expert_selected).toBe(false);
    expect(flanders.candidate.personal_contact_details_recorded).toBe(false);
    expect(england.external_dispatch_performed).toBe(false);
    expect(flanders.repository_delivery_channel_available).toBe(false);
    expect(validateDispatchRecord(england)).toEqual([]);
    expect(validateDispatchRecord(flanders)).toEqual([]);
    expect(validateIntakeReport(intake)).toEqual([]);
    expect(validateQuarantineReport(quarantine)).toEqual([]);
    expect(validateDecisionReport(decision, england, flanders, intake, quarantine)).toEqual([]);
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);
    expect(validateReviewFile(`archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-lead-architecture-review.md`)).toEqual([]);
  });

  test("negative fixtures are rejected by the same checker paths", () => {
    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode)).toEqual([]);
    }
  });

  test("accepts a consented schema-shaped positive response record", () => {
    const positive = {
      intake_id: "england-contact-stage-intake",
      jurisdiction_id: "england",
      request_packet_id: "england-local-expert-review-request-packet",
      consent_confirmed: true,
      response_received: true,
      responses: [validResponse("england")],
      validation_status: "accepted_for_internal_review",
      rejected_items: [],
      does_not_authorize: dispatchRecord("england").does_not_authorize,
      proof_required_to_use: "Owner dispatch proof, consent, schema PASS, quarantine PASS, specialist review, and human review.",
    };
    expect(validateStageIntakeRecord(positive)).toEqual([]);
  });

  test("direct mutations catch high-risk dispatch and intake failures", () => {
    const contactDrift = JSON.parse(JSON.stringify(dispatchRecord("england")));
    contactDrift.contact_text += "\nMake a country edition.";
    expect(validateDispatchRecord(contactDrift)).toContain("STOP_CONTACT_TEXT_DRIFT");

    const named = JSON.parse(JSON.stringify(dispatchRecord("england")));
    named.candidate.named_expert_selected = true;
    named.candidate.role_profile = "Professor Example";
    expect(validateDispatchRecord(named)).toContain("STOP_NAMED_EXPERT_SELECTION");

    const sent = JSON.parse(JSON.stringify(dispatchRecord("flanders")));
    sent.external_dispatch_performed = true;
    expect(validateDispatchRecord(sent)).toContain("STOP_UNAUTHORIZED_EXTERNAL_DISPATCH");

    const badClassification = JSON.parse(JSON.stringify(dispatchRecord("england")));
    badClassification.finding_classification[1].classification = "human_authorization_required";
    expect(validateDispatchRecord(badClassification).join("\n")).toContain("invalid classification human_authorization_required");

    const responseNoConsent = {
      intake_id: "england-contact-stage-intake",
      jurisdiction_id: "england",
      request_packet_id: "england-local-expert-review-request-packet",
      consent_confirmed: false,
      response_received: true,
      responses: [validResponse("england")],
      validation_status: "rejected",
      rejected_items: [],
      does_not_authorize: dispatchRecord("england").does_not_authorize,
      proof_required_to_use: "Owner dispatch, consent, schema PASS, quarantine PASS, and human review.",
    };
    expect(validateStageIntakeRecord(responseNoConsent)).toContain("STOP_MISSING_CONSENT_BOUNDARY");

    const officialAuthority = JSON.parse(JSON.stringify(responseNoConsent));
    officialAuthority.consent_confirmed = true;
    officialAuthority.responses[0].interpretation = "This expert feedback is official authority and substitutes for official source review.";
    expect(validateStageIntakeRecord(officialAuthority)).toContain("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");

    const individualAdjustment = JSON.parse(JSON.stringify(responseNoConsent));
    individualAdjustment.consent_confirmed = true;
    individualAdjustment.responses[0].interpretation = "This confirms individual adjustment sufficiency.";
    expect(validateStageIntakeRecord(individualAdjustment)).toContain("STOP_SUPPORT_ACCOMMODATION_OVERCLAIM");
  });
});
