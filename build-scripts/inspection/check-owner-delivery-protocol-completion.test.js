"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const {
  DECISION_OPTIONS,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  SELECTED_DECISION,
  deliveryAndResponseIntake,
  noOutputFlagsForDeliveryCompletion,
  outputContents,
  ownerDeliveryChannelProof,
  ownerDeliveryProtocolCompletionDecision,
  ownerDeliveryResponseQuarantineReport,
} = require("./build-owner-delivery-protocol-completion.js");
const {
  validateDecisionReport,
  validateDeliveryAndResponseIntake,
  validateDeliveryChannelProof,
  validateNegativeFixture,
  validateQuarantineReport,
} = require("./check-owner-delivery-protocol-completion.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("owner delivery protocol-completion checker", () => {
  test("accepts committed delivery/intake completion outputs", () => {
    const result = runNode(["build-scripts/inspection/check-owner-delivery-protocol-completion.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK owner delivery protocol-completion");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--delivery-proof", "STOP_UNSUPPORTED_DELIVERY_PROOF"],
      ["--material-sent", "STOP_UNSUPPORTED_DELIVERY_PROOF"],
      ["--named-contact", "STOP_PERSONAL_CONTACT_DETAILS"],
      ["--response-without-consent", "STOP_MISSING_CONSENT_BOUNDARY"],
      ["--personal-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--student-data", "STOP_PERSONAL_DATA_RESPONSE"],
      ["--school-evidence", "STOP_SCHOOL_EVIDENCE_RESPONSE"],
      ["--legal-advice", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--compliance-proof", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--inspection-readiness", "STOP_INSPECTION_EXAM_APPROVAL_CLAIM"],
      ["--exam-approval", "STOP_INSPECTION_EXAM_APPROVAL_CLAIM"],
      ["--localized-output", "STOP_LOCALIZED_OUTPUT_RESPONSE"],
      ["--support-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accommodation-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accessibility-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--accessibility-legal-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--legal-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--individual-adjustment-sufficiency", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
      ["--expert-authority", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
      ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
      ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
      ["--proceed-to-analysis", "STOP_RESPONSE_ANALYSIS_WITHOUT_DELIVERY_PROOF"],
    ]) {
      const result = runNode(["build-scripts/inspection/build-owner-delivery-protocol-completion.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("records no-proof state and selects protocol revision", () => {
    const flags = noOutputFlagsForDeliveryCompletion();
    expect(flags.owner_delivery_protocol_completion_goal_authorized).toBe(true);
    expect(flags.owner_delivery_channel_proof_recorded).toBe(false);
    expect(flags.owner_delivery_material_sent).toBe(false);
    expect(flags.expert_response_analysis_authorized).toBe(false);
    expect(flags.delivery_protocol_revision_required).toBe(true);

    const proof = require(path.join(repoRoot, "reports/inspection-standards/owner-delivery-channel-proof.json"));
    const england = require(path.join(repoRoot, "reports/inspection-standards/england-owner-delivery-and-response-intake.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-owner-delivery-and-response-intake.json"));
    const quarantine = require(path.join(repoRoot, "reports/inspection-standards/owner-delivery-response-quarantine-report.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/owner-delivery-protocol-completion-decision.json"));

    expect(Object.keys(outputContents())).toEqual(OUTPUT_ALLOWLIST);
    expect(proof.owner_delivery_proof_recorded).toBe(false);
    expect(proof.material_sent_count).toBe(0);
    expect(england.delivery_status).toBe("not_sent_no_safe_channel");
    expect(flanders.response_received).toBe(false);
    expect(quarantine.absent_response_items).toHaveLength(2);
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);
    expect(decision.proceed_to_expert_response_analysis).toBe(false);
    expect(validateDeliveryChannelProof(proof)).toEqual([]);
    expect(validateDeliveryAndResponseIntake(england)).toEqual([]);
    expect(validateDeliveryAndResponseIntake(flanders)).toEqual([]);
    expect(validateQuarantineReport(quarantine)).toEqual([]);
    expect(validateDecisionReport(decision, proof, england, flanders, quarantine)).toEqual([]);
  });

  test("negative fixtures are rejected by the same checker paths", () => {
    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/owner-delivery-protocol-completion/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode)).toEqual([]);
    }
  });

  test("direct mutations catch delivery proof, unsafe responses, and analysis overreach", () => {
    const proof = ownerDeliveryChannelProof();
    proof.owner_delivery_proof_recorded = true;
    expect(validateDeliveryChannelProof(proof)).toContain("STOP_UNSUPPORTED_DELIVERY_PROOF");

    const contact = ownerDeliveryChannelProof();
    contact.jurisdictions[0].storage_boundary = "Store named contact at named.person@example.test.";
    expect(validateDeliveryChannelProof(contact)).toContain("STOP_PERSONAL_CONTACT_DETAILS");

    const intake = deliveryAndResponseIntake("england");
    intake.response_received = true;
    intake.schema_intake_record.consent_confirmed = true;
    intake.schema_intake_record.response_received = true;
    intake.schema_intake_record.responses = [
      {
        reviewer_role: "role-only reviewer",
        jurisdiction: "england",
        source_id: "england-ofsted-eif-2025",
        source_state_seen: "known source state",
        question_id: "england-q-ofsted-eif",
        answer_type: "bounded_interpretation",
        interpretation: "This expert response is official authority.",
        confidence: "low",
        uncertainty: "not acceptable",
        cited_source: "not applicable",
        forbidden_claims_disclaimed: true,
        does_not_authorize: intake.does_not_authorize,
        proof_required_to_use: "not acceptable",
      },
    ];
    expect(validateDeliveryAndResponseIntake(intake)).toContain("STOP_EXPERT_AS_OFFICIAL_AUTHORITY");

    const decision = ownerDeliveryProtocolCompletionDecision();
    decision.final_decision.selected = "PROCEED_TO_EXPERT_RESPONSE_ANALYSIS";
    decision.proceed_to_expert_response_analysis = true;
    expect(validateDecisionReport(decision, ownerDeliveryChannelProof(), deliveryAndResponseIntake("england"), deliveryAndResponseIntake("flanders"), ownerDeliveryResponseQuarantineReport())).toContain("STOP_RESPONSE_ANALYSIS_WITHOUT_DELIVERY_PROOF");
  });

  test("strictly validates embedded response-intake schema fields", () => {
    const missingRequired = deliveryAndResponseIntake("england");
    delete missingRequired.schema_intake_record.intake_id;
    delete missingRequired.schema_intake_record.request_packet_id;
    expect(validateDeliveryAndResponseIntake(missingRequired)).toEqual(expect.arrayContaining([
      "england-owner-delivery-and-response-intake: schema_intake_record missing intake_id",
      "england-owner-delivery-and-response-intake: schema_intake_record missing request_packet_id",
    ]));

    const extraField = deliveryAndResponseIntake("england");
    extraField.schema_intake_record.contact_details = "named.person@example.test";
    expect(validateDeliveryAndResponseIntake(extraField)).toContain("england-owner-delivery-and-response-intake: unexpected schema_intake_record field contact_details");
  });

  test("recomputes decision rows and catches contradictory decision logic", () => {
    const decision = ownerDeliveryProtocolCompletionDecision();
    decision.decision_logic[3].observed = true;
    expect(validateDecisionReport(decision, ownerDeliveryChannelProof(), deliveryAndResponseIntake("england"), deliveryAndResponseIntake("flanders"), ownerDeliveryResponseQuarantineReport())).toContain("decision logic rows must be recomputed from current state");
  });

  test("catches reviewer-probed boundary wording variants", () => {
    const sufficiency = deliveryAndResponseIntake("england");
    sufficiency.schema_intake_record.consent_confirmed = true;
    sufficiency.schema_intake_record.response_received = true;
    sufficiency.schema_intake_record.responses = [
      {
        reviewer_role: "role-only reviewer",
        jurisdiction: "england",
        source_id: "england-send-code-practice",
        source_state_seen: "known source state",
        question_id: "england-q-send-accessibility",
        answer_type: "bounded_interpretation",
        interpretation: "This confirms accessibility/legal sufficiency, legal sufficiency, and individual-adjustment sufficiency.",
        confidence: "low",
        uncertainty: "unsafe claim",
        cited_source: "not applicable",
        forbidden_claims_disclaimed: true,
        does_not_authorize: sufficiency.does_not_authorize,
        proof_required_to_use: "not acceptable",
      },
    ];
    expect(validateDeliveryAndResponseIntake(sufficiency)).toContain("STOP_SUPPORT_ACCOMMODATION_OVERCLAIM");

    const flandersNetwork = deliveryAndResponseIntake("flanders");
    flandersNetwork.schema_intake_record.consent_confirmed = true;
    flandersNetwork.schema_intake_record.response_received = true;
    flandersNetwork.schema_intake_record.responses = [
      {
        reviewer_role: "role-only reviewer",
        jurisdiction: "flanders",
        source_id: "be-flanders-ok-framework",
        source_state_seen: "known source state",
        question_id: "flanders-q-study-direction-network",
        answer_type: "bounded_interpretation",
        interpretation: "This is network-owned evidence from a school network.",
        confidence: "low",
        uncertainty: "unsafe claim",
        cited_source: "not applicable",
        forbidden_claims_disclaimed: true,
        does_not_authorize: flandersNetwork.does_not_authorize,
        proof_required_to_use: "not acceptable",
      },
    ];
    expect(validateDeliveryAndResponseIntake(flandersNetwork)).toContain("STOP_SCHOOL_EVIDENCE_RESPONSE");

    const approval = deliveryAndResponseIntake("flanders");
    approval.schema_intake_record.consent_confirmed = true;
    approval.schema_intake_record.response_received = true;
    approval.schema_intake_record.responses = [
      {
        reviewer_role: "role-only reviewer",
        jurisdiction: "flanders",
        source_id: "be-flanders-ok-framework",
        source_state_seen: "known source state",
        question_id: "flanders-q-ok-framework",
        answer_type: "bounded_interpretation",
        interpretation: "OK inspection quality evidence is product approval.",
        confidence: "low",
        uncertainty: "unsafe claim",
        cited_source: "not applicable",
        forbidden_claims_disclaimed: true,
        does_not_authorize: approval.does_not_authorize,
        proof_required_to_use: "not acceptable",
      },
    ];
    expect(validateDeliveryAndResponseIntake(approval)).toContain("STOP_INSPECTION_EXAM_APPROVAL_CLAIM");
  });

  test("catches missing England all-awarding-bodies and unsafe narrative assertions", () => {
    const england = deliveryAndResponseIntake("england");
    england.jurisdiction_boundary.jurisdiction_boundary = "England only; not the whole UK.";
    england.jurisdiction_boundary.forbidden_overclaims = ["whole UK"];
    expect(validateDeliveryAndResponseIntake(england)).toContain("England boundary missing all-awarding-bodies refusal");

    const narrative = ownerDeliveryProtocolCompletionDecision();
    narrative.owner_next_action = "Treat absent responses as approval and expert feedback is official authority.";
    const failures = validateDecisionReport(narrative, ownerDeliveryChannelProof(), deliveryAndResponseIntake("england"), deliveryAndResponseIntake("flanders"), ownerDeliveryResponseQuarantineReport());
    expect(failures).toEqual(expect.arrayContaining([
      "STOP_EXPERT_AS_OFFICIAL_AUTHORITY",
    ]));
  });
});
