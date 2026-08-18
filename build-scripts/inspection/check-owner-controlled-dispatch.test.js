"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const {
  DECISION_OPTIONS,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  SELECTED_DECISION,
  noOutputFlagsForOwnerControlledDispatch,
  outputContents,
  ownerControlledDispatchDecision,
  ownerControlledDispatchRecord,
  ownerControlledResponseQuarantineReport,
  responseIntakeReport,
  validResponse,
} = require("./build-owner-controlled-dispatch.js");
const {
  validateDecisionReport,
  validateNegativeFixture,
  validateOwnerControlledDispatchRecord,
  validateQuarantineReport,
  validateResponseIntakeReport,
  validateSchemaIntakeRecord,
} = require("./check-owner-controlled-dispatch.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("owner-controlled dispatch checker", () => {
  test("accepts committed owner-controlled dispatch outputs", () => {
    const result = runNode(["build-scripts/inspection/check-owner-controlled-dispatch.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK owner-controlled dispatch");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--dispatch-proof", "STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF"],
      ["--claim-dispatch", "STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF"],
      ["--private-contact", "STOP_PRIVATE_CONTACT_STORAGE"],
      ["--named-expert", "STOP_NAMED_EXPERT_SELECTION"],
      ["--missing-not-sent-reason", "STOP_MISSING_NOT_SENT_REASON"],
      ["--unapproved-material", "STOP_UNAPPROVED_MATERIAL_SENT"],
      ["--forbidden-attachment", "STOP_FORBIDDEN_ATTACHMENT"],
      ["--response-analysis", "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
      ["--proceed-to-analysis", "STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE"],
      ["--personal-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--student-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--school-evidence", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
      ["--legal-compliance", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--legal-advice", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--compliance-proof", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--inspection-readiness", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--localized-output", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
      ["--sufficiency-claim", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
      ["--support-sufficiency", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
      ["--accommodation-sufficiency", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
      ["--accessibility-sufficiency", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
      ["--expert-authority", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
      ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
      ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
      ["--all-school-network", "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM"],
      ["--response-not-quarantined", "STOP_RESPONSE_NOT_QUARANTINED"],
    ]) {
      const result = runNode(["build-scripts/inspection/build-owner-controlled-dispatch.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("records honest no-proof dispatch state and blocks response analysis", () => {
    const flags = noOutputFlagsForOwnerControlledDispatch();
    expect(flags.owner_controlled_dispatch_goal_authorized).toBe(true);
    expect(flags.owner_controlled_dispatch_protocol_ready).toBe(true);
    expect(flags.owner_delivery_proof_recorded).toBe(false);
    expect(flags.owner_material_sent).toBe(false);
    expect(flags.response_analysis_authorized).toBe(false);
    expect(flags.owner_dispatch_process_revision_required).toBe(true);

    const dispatch = require(path.join(repoRoot, "reports/inspection-standards/owner-controlled-dispatch-record.json"));
    const england = require(path.join(repoRoot, "reports/inspection-standards/england-owner-controlled-dispatch-and-response-intake.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-owner-controlled-dispatch-and-response-intake.json"));
    const quarantine = require(path.join(repoRoot, "reports/inspection-standards/owner-controlled-response-quarantine-report.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/owner-controlled-dispatch-decision.json"));

    expect(Object.keys(outputContents())).toEqual(OUTPUT_ALLOWLIST);
    expect(dispatch.repository_claims_external_dispatch).toBe(false);
    expect(dispatch.material_sent_count).toBe(0);
    expect(dispatch.jurisdictions.every((item) => item.delivery_status === "not_sent_owner_blocked")).toBe(true);
    expect(england.response_received).toBe(false);
    expect(flanders.schema_intake_record.responses).toEqual([]);
    expect(quarantine.response_analysis_allowed).toBe(false);
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);
    expect(decision.proceed_to_expert_response_analysis).toBe(false);
    expect(validateOwnerControlledDispatchRecord(dispatch)).toEqual([]);
    expect(validateResponseIntakeReport(england)).toEqual([]);
    expect(validateResponseIntakeReport(flanders)).toEqual([]);
    expect(validateQuarantineReport(quarantine)).toEqual([]);
    expect(validateDecisionReport(decision, dispatch, england, flanders, quarantine)).toEqual([]);
  });

  test("negative fixtures are rejected by the same checker paths", () => {
    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/owner-controlled-dispatch/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode)).toEqual([]);
    }
  });

  test("direct mutations catch proof invention, contact storage, and analysis overreach", () => {
    const dispatch = ownerControlledDispatchRecord();
    dispatch.owner_delivery_proof_recorded = true;
    dispatch.repository_claims_external_dispatch = true;
    expect(validateOwnerControlledDispatchRecord(dispatch)).toContain("STOP_UNSUPPORTED_OWNER_DISPATCH_PROOF");

    const contact = ownerControlledDispatchRecord();
    contact.jurisdictions[0].role_only_contact_candidate.selection_basis = "Use private endpoint named.person@example.test.";
    expect(validateOwnerControlledDispatchRecord(contact)).toContain("STOP_PRIVATE_CONTACT_STORAGE");

    const named = ownerControlledDispatchRecord();
    named.jurisdictions[0].role_only_contact_candidate.named_expert_selected = true;
    expect(validateOwnerControlledDispatchRecord(named)).toContain("STOP_NAMED_EXPERT_SELECTION");

    const decision = ownerControlledDispatchDecision();
    decision.final_decision.selected = "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS";
    decision.proceed_to_expert_response_analysis = true;
    expect(validateDecisionReport(decision, ownerControlledDispatchRecord(), responseIntakeReport("england"), responseIntakeReport("flanders"), ownerControlledResponseQuarantineReport())).toContain("STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE");
  });

  test("strictly validates response-intake schema and unsafe response text", () => {
    const missingRequired = responseIntakeReport("england");
    delete missingRequired.schema_intake_record.intake_id;
    delete missingRequired.schema_intake_record.request_packet_id;
    expect(validateResponseIntakeReport(missingRequired)).toEqual(expect.arrayContaining([
      "england-owner-controlled-dispatch-and-response-intake: schema_intake_record missing intake_id",
      "england-owner-controlled-dispatch-and-response-intake: schema_intake_record missing request_packet_id",
    ]));

    const extraField = responseIntakeReport("england");
    extraField.schema_intake_record.contact_details = "named.person@example.test";
    expect(validateSchemaIntakeRecord(extraField.schema_intake_record, "england", extraField.report_id)).toContain("england-owner-controlled-dispatch-and-response-intake: unexpected schema_intake_record field contact_details");

    const unsafe = responseIntakeReport("flanders");
    unsafe.response_received = true;
    unsafe.schema_intake_record.consent_confirmed = true;
    unsafe.schema_intake_record.response_received = true;
    unsafe.schema_intake_record.responses = [validResponse("flanders")];
    unsafe.schema_intake_record.responses[0].interpretation = "This applies to all Belgium and all school networks, with compliance proof.";
    unsafe.schema_intake_record.validation_status = "accepted_for_internal_review";
    expect(validateResponseIntakeReport(unsafe)).toEqual(expect.arrayContaining([
      "STOP_ALL_BELGIUM_OVERCLAIM",
      "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM",
      "STOP_LEGAL_COMPLIANCE_CLAIM",
    ]));
  });

  test("catches contradictory decision logic", () => {
    const decision = ownerControlledDispatchDecision();
    decision.decision_logic[0].observed = false;
    expect(validateDecisionReport(decision, ownerControlledDispatchRecord(), responseIntakeReport("england"), responseIntakeReport("flanders"), ownerControlledResponseQuarantineReport())).toContain("decision logic rows must be recomputed from current state");
  });

  test("catches static Flanders boundary and role/source authority mutations", () => {
    const allBelgium = ownerControlledDispatchRecord();
    allBelgium.jurisdictions[1].jurisdiction_boundary.boundary = "Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and not all school networks; applies throughout Belgium, Belgian-wide coverage applies, and the entire Belgium scope includes the French Community.";
    expect(validateOwnerControlledDispatchRecord(allBelgium)).toContain("STOP_ALL_BELGIUM_OVERCLAIM");

    const allNetworks = ownerControlledDispatchRecord();
    allNetworks.jurisdictions[1].jurisdiction_boundary.boundary = "Flanders only; not all Belgium, not the French Community, not the German-speaking Community, and not all school networks; covers all Flemish school networks.";
    allNetworks.jurisdictions[1].jurisdiction_boundary.forbidden_overclaims = ["all Belgium"];
    expect(validateOwnerControlledDispatchRecord(allNetworks)).toContain("STOP_ALL_SCHOOL_NETWORK_OVERCLAIM");

    const roleAuthority = ownerControlledDispatchRecord();
    roleAuthority.jurisdictions[1].role_only_contact_candidate.role_profile = "Flanders reviewer without supplying official authority or school evidence, but this reviewer provides evidence for every school network and has legal authority.";
    expect(validateOwnerControlledDispatchRecord(roleAuthority)).toContain("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");

    const sourceUse = responseIntakeReport("flanders");
    sourceUse.jurisdiction_boundary.source_use = "source/curriculum interpretation only; school/network evidence remains school-owned; OK inspection quality evidence is product approval and inspection authority.";
    expect(validateResponseIntakeReport(sourceUse)).toContain("STOP_LEGAL_COMPLIANCE_CLAIM");
  });
});
