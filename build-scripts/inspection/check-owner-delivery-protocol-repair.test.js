"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const {
  DECISION_OPTIONS,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  PROOF_FORMAT_FIELDS,
  QUARANTINE_CLASSIFICATIONS,
  RESPONSE_INTAKE_RULES,
  SELECTED_DECISION,
  noOutputFlags,
  outputContents,
  protocolDecision,
  protocolInstance,
  protocolPlan,
} = require("./build-owner-delivery-protocol-repair.js");
const {
  validateDecision,
  validateNegativeFixture,
  validatePlan,
  validateProtocolInstance,
} = require("./check-owner-delivery-protocol-repair.js");

const repoRoot = path.resolve(__dirname, "..", "..");

function runNode(args) {
  return spawnSync(process.execPath, args, {
    cwd: repoRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

describe("owner delivery protocol-repair checker", () => {
  test("accepts committed protocol repair outputs", () => {
    const result = runNode(["build-scripts/inspection/check-owner-delivery-protocol-repair.js"]);
    if (result.status !== 0) {
      throw new Error(`checker exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
    }
    expect(result.stdout).toContain("OK owner delivery protocol-repair");
  });

  test("refuses forbidden generator modes", () => {
    for (const [flag, stopCode] of [
      ["--named-contact", "STOP_PRIVATE_CONTACT_STORAGE"],
      ["--delivery-claimed", "STOP_DELIVERY_CLAIM_WITHOUT_PROOF"],
      ["--timestamp-missing", "STOP_MISSING_DELIVERY_TIMESTAMP"],
      ["--unapproved-material", "STOP_UNAPPROVED_MATERIAL"],
      ["--flanders-shared-material", "STOP_FLANDERS_SHARED_MATERIAL_OVERCLAIM"],
      ["--localized-output", "STOP_LOCALIZED_OUTPUT"],
      ["--answer-model", "STOP_ANSWER_MODEL_OUTPUT"],
      ["--student-data", "STOP_STUDENT_DATA"],
      ["--school-evidence", "STOP_SCHOOL_EVIDENCE"],
      ["--legal-compliance", "STOP_LEGAL_COMPLIANCE_CLAIM"],
      ["--sufficiency-claim", "STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY"],
      ["--expert-authority", "STOP_EXPERT_AS_OFFICIAL_AUTHORITY"],
      ["--response-analysis", "STOP_RESPONSE_ANALYSIS_WITHOUT_SCHEMA_PASS"],
      ["--missing-quarantine", "STOP_MISSING_QUARANTINE_CLASSIFICATION"],
      ["--missing-sufficiency-quarantine", "STOP_MISSING_SUFFICIENCY_QUARANTINE"],
      ["--proof-format-missing", "STOP_PROOF_FORMAT_MISMATCH"],
      ["--proof-format-reordered", "STOP_PROOF_FORMAT_MISMATCH"],
      ["--proof-format-duplicate", "STOP_PROOF_FORMAT_MISMATCH"],
      ["--proof-format-extra", "STOP_PROOF_FORMAT_MISMATCH"],
      ["--whole-uk", "STOP_WHOLE_UK_OVERCLAIM"],
      ["--all-belgium", "STOP_ALL_BELGIUM_OVERCLAIM"],
      ["--all-school-network", "STOP_ALL_SCHOOL_NETWORK_OVERCLAIM"],
    ]) {
      const result = runNode(["build-scripts/inspection/build-owner-delivery-protocol-repair.js", flag]);
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(stopCode);
    }
  });

  test("records protocol readiness without dispatch or response analysis", () => {
    const flags = noOutputFlags();
    expect(flags.owner_controlled_dispatch_protocol_ready).toBe(true);
    expect(flags.external_dispatch_performed).toBe(false);
    expect(flags.private_contact_details_stored).toBe(false);
    expect(flags.response_analysis_attempted).toBe(false);

    const plan = require(path.join(repoRoot, "reports/inspection-standards/owner-delivery-protocol-plan.json"));
    const england = require(path.join(repoRoot, "reports/inspection-standards/england-owner-delivery-protocol-instance.json"));
    const flanders = require(path.join(repoRoot, "reports/inspection-standards/flanders-owner-delivery-protocol-instance.json"));
    const decision = require(path.join(repoRoot, "reports/inspection-standards/owner-delivery-protocol-decision.json"));

    expect(Object.keys(outputContents())).toEqual(OUTPUT_ALLOWLIST);
    expect(plan.dispatch_proof_format).toEqual(PROOF_FORMAT_FIELDS);
    expect(plan.response_intake_completion_rules).toEqual(RESPONSE_INTAKE_RULES);
    expect(england.repository_stores_private_contact_details).toBe(false);
    expect(england.quarantine_classifications).toEqual(QUARANTINE_CLASSIFICATIONS);
    expect(flanders.jurisdiction_boundary.boundary).toContain("not all Belgium");
    expect(flanders.allowed_materials[0]).toBe("approved Flanders local-expert request packet");
    expect(decision.final_decision.selected).toBe(SELECTED_DECISION);
    expect(decision.final_decision.allowed_options).toEqual(DECISION_OPTIONS);
    expect(decision.response_analysis_authorized).toBe(false);
    expect(validatePlan(plan)).toEqual([]);
    expect(validateProtocolInstance(england)).toEqual([]);
    expect(validateProtocolInstance(flanders)).toEqual([]);
    expect(validateDecision(decision)).toEqual([]);
  });

  test("negative fixtures are rejected by the same checker paths", () => {
    for (const [file, stopCode] of NEGATIVE_FIXTURES) {
      const fixture = require(path.join(repoRoot, `references/data/inspection-standards/fixtures/owner-delivery-protocol-repair/negative/${file}`));
      expect(validateNegativeFixture(fixture, stopCode)).toEqual([]);
    }
  });

  test("direct mutations catch private contacts, unsafe materials, and overclaims", () => {
    const contact = protocolInstance("england");
    contact.storage_boundary = "Store named expert at named.person@example.test.";
    expect(validateProtocolInstance(contact)).toContain("STOP_PRIVATE_CONTACT_STORAGE");

    const unapproved = protocolInstance("england");
    unapproved.allowed_materials.push("localized student worksheet");
    expect(validateProtocolInstance(unapproved)).toContain("STOP_UNAPPROVED_MATERIAL");

    const answerModel = protocolInstance("england");
    answerModel.allowed_materials.push("answer model packet");
    expect(validateProtocolInstance(answerModel)).toContain("STOP_ANSWER_MODEL_OUTPUT");

    const sufficiency = protocolInstance("england");
    sufficiency.allowed_materials.push("support/accommodation/accessibility sufficiency request");
    expect(validateProtocolInstance(sufficiency)).toContain("STOP_SUPPORT_ACCOMMODATION_ACCESSIBILITY_SUFFICIENCY");

    const missingSufficiencyQuarantine = protocolInstance("england");
    missingSufficiencyQuarantine.quarantine_classifications = missingSufficiencyQuarantine.quarantine_classifications.filter((item) => item !== "claims_support_accommodation_accessibility_sufficiency");
    expect(validateProtocolInstance(missingSufficiencyQuarantine)).toContain("STOP_MISSING_SUFFICIENCY_QUARANTINE");

    const analysis = protocolDecision();
    analysis.response_analysis_authorized = true;
    expect(validateDecision(analysis)).toContain("STOP_RESPONSE_ANALYSIS_WITHOUT_SCHEMA_PASS");

    const wholeUk = protocolInstance("england");
    wholeUk.jurisdiction_boundary.boundary = "England means the whole UK.";
    expect(validateProtocolInstance(wholeUk)).toContain("STOP_WHOLE_UK_OVERCLAIM");

    const allBelgium = protocolInstance("flanders");
    allBelgium.jurisdiction_boundary.boundary = "Flanders means all Belgium.";
    expect(validateProtocolInstance(allBelgium)).toContain("STOP_ALL_BELGIUM_OVERCLAIM");

    const allSchoolNetworks = protocolInstance("flanders");
    allSchoolNetworks.jurisdiction_boundary.boundary = "Flanders only; not all Belgium, and all school networks.";
    expect(validateProtocolInstance(allSchoolNetworks)).toContain("STOP_ALL_SCHOOL_NETWORK_OVERCLAIM");

    const sharedMaterial = protocolInstance("flanders");
    sharedMaterial.allowed_materials[0] = "approved England/Flanders local-expert request packet";
    expect(validateProtocolInstance(sharedMaterial)).toContain("STOP_FLANDERS_SHARED_MATERIAL_OVERCLAIM");
  });

  test("schema and decision logic remain strict", () => {
    const missingProof = protocolPlan();
    missingProof.dispatch_proof_format = missingProof.dispatch_proof_format.filter((field) => field !== "owner_delivery_reference");
    expect(validatePlan(missingProof)).toContain("plan dispatch proof format mismatch");

    const missingInstanceProof = protocolInstance("england");
    missingInstanceProof.proof_format = missingInstanceProof.proof_format.filter((field) => field !== "owner_delivery_reference");
    expect(validateProtocolInstance(missingInstanceProof)).toContain("STOP_PROOF_FORMAT_MISMATCH");

    const badDecision = protocolDecision();
    badDecision.final_decision.selected = "REVISE_DELIVERY_CHANNEL_AGAIN";
    expect(validateDecision(badDecision)).toContain("selected decision mismatch");

    const contradictoryDecision = protocolDecision();
    contradictoryDecision.decision_logic[0].observed = true;
    expect(validateDecision(contradictoryDecision)).toContain("decision logic must have exactly one observed row");
  });
});
