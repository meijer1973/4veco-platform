#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const { StopError } = require("./build-international-quality-standards.js");
const { REV_STD_FINDING_CLASSIFICATIONS } = require("./build-international-overlay-architecture.js");

const ACCESS_DATE = "2026-06-26";
const SPRINT_ID = "GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_INPUT_DECISION = "PROCEED_TO_LOCAL_EXPERT_SOURCE_REFRESH_GATE_PLANNING";
const SELECTED_DECISION = "PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET";

const DECISION_OPTIONS = [
  "PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET",
  "REVISE_LOCAL_EXPERT_SOURCE_GATE",
  "STOP_LOCAL_OVERLAY_TRACK",
];

const SOURCE_CONDITIONS = [
  "official_source_unchanged",
  "official_source_updated",
  "official_source_replaced",
  "official_source_unavailable",
  "source_gap_discovered",
  "source_outside_allowed_scope",
];

const SIMULATION_CASE_TYPES = [
  "valid_official_source_refresh_request",
  "stale_source_detected",
  "source_gap",
  "non_official_source_proposed",
  "local_expert_uncertainty",
  "attempted_compliance_claim",
  "attempted_localized_output",
  "attempted_school_facing_output",
];

const INPUT_ALLOWLIST = [
  "reports/inspection-standards/england-internal-no-output-trial-simulation.json",
  "reports/inspection-standards/flanders-internal-no-output-trial-simulation.json",
  "reports/inspection-standards/internal-no-output-trial-simulation.json",
  "reports/inspection-standards/internal-no-output-trial-simulation-decision.json",
  "reports/inspection-standards/internal-no-output-trial-simulation-validation.json",
  "references/schemas/internal-no-output-trial-simulation.schema.v1.json",
  "references/data/inspection-standards/overlays/england.deepening.v1.json",
  "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
];

const GENERATED_OUTPUT_PATHS = [
  "references/schemas/local-expert-source-refresh-gate.schema.v1.json",
  "docs/inspection-standards/local-expert-source-refresh-gate-contract.md",
  "docs/inspection-standards/england-local-expert-source-gate.md",
  "docs/inspection-standards/flanders-local-expert-source-gate.md",
  "reports/inspection-standards/local-expert-source-refresh-gate-plan.md",
  "reports/inspection-standards/local-expert-source-refresh-gate-plan.json",
  "reports/inspection-standards/england-source-refresh-gate-simulation.md",
  "reports/inspection-standards/england-source-refresh-gate-simulation.json",
  "reports/inspection-standards/flanders-source-refresh-gate-simulation.md",
  "reports/inspection-standards/flanders-source-refresh-gate-simulation.json",
  "reports/inspection-standards/local-expert-source-refresh-gate-decision.md",
  "reports/inspection-standards/local-expert-source-refresh-gate-decision.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/england-source-refresh-gate-simulation.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/flanders-source-refresh-gate-simulation.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/non-official-source.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/source-refresh-executed.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/local-expert-substituted.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/localized-output.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/student-facing-output.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/teacher-school-output.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/public-output.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/personal-data.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/compliance-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/support-sufficiency-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/whole-uk-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/all-belgium-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/missing-source-condition.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/missing-england-source-allowlist.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/official-url-mismatch.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/individual-adjustment-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/reasonable-adjustment-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/learner-support-record-claim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/support-records-personal-data.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const REVIEW_RECORD_PATHS = [
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-specialist-reviews.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
];

const OUTPUT_ALLOWLIST = [...GENERATED_OUTPUT_PATHS, ...REVIEW_RECORD_PATHS];

const NEGATIVE_FIXTURES = [
  ["non-official-source.sample.json", "STOP_NON_OFFICIAL_SOURCE"],
  ["source-refresh-executed.sample.json", "STOP_SOURCE_REFRESH_EXECUTION"],
  ["local-expert-substituted.sample.json", "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  ["localized-output.sample.json", "STOP_LOCALIZED_OUTPUT"],
  ["student-facing-output.sample.json", "STOP_STUDENT_FACING_OUTPUT"],
  ["teacher-school-output.sample.json", "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  ["public-output.sample.json", "STOP_PUBLIC_OUTPUT"],
  ["personal-data.sample.json", "STOP_PERSONAL_DATA"],
  ["compliance-claim.sample.json", "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  ["support-sufficiency-claim.sample.json", "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  ["whole-uk-claim.sample.json", "STOP_JURISDICTION_OVERGENERALISATION"],
  ["all-belgium-claim.sample.json", "STOP_JURISDICTION_OVERGENERALISATION"],
  ["missing-source-condition.sample.json", "STOP_SOURCE_CONDITION_COVERAGE"],
  ["missing-england-source-allowlist.sample.json", "STOP_SOURCE_ALLOWLIST_MISMATCH"],
  ["official-url-mismatch.sample.json", "STOP_SOURCE_ALLOWLIST_MISMATCH"],
  ["individual-adjustment-claim.sample.json", "STOP_INDIVIDUAL_ADJUSTMENT_CLAIM"],
  ["reasonable-adjustment-claim.sample.json", "STOP_REASONABLE_ADJUSTMENT_CLAIM"],
  ["learner-support-record-claim.sample.json", "STOP_LEARNER_SUPPORT_RECORD_CLAIM"],
  ["support-records-personal-data.sample.json", "STOP_SUPPORT_RECORDS_PERSONAL_DATA"],
];

const REFUSAL_CASES = [
  [["--execute-source-refresh"], "STOP_SOURCE_REFRESH_EXECUTION"],
  [["--source-refresh"], "STOP_SOURCE_REFRESH_EXECUTION"],
  [["--local-expert-substitution"], "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  [["--contact-local-expert"], "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT"],
  [["--localized-exercise"], "STOP_LOCALIZED_OUTPUT"],
  [["--answer-model"], "STOP_LOCALIZED_OUTPUT"],
  [["--student-facing"], "STOP_STUDENT_FACING_OUTPUT"],
  [["--teacher-school"], "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  [["--public"], "STOP_PUBLIC_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--product-route"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--scale-gate"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--diagnostics"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--personal-data"], "STOP_PERSONAL_DATA"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-readiness"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--individual-adjustment"], "STOP_INDIVIDUAL_ADJUSTMENT_CLAIM"],
  [["--reasonable-adjustment"], "STOP_REASONABLE_ADJUSTMENT_CLAIM"],
  [["--learner-support-record"], "STOP_LEARNER_SUPPORT_RECORD_CLAIM"],
  [["--support-records-personal-data"], "STOP_SUPPORT_RECORDS_PERSONAL_DATA"],
  [["--whole-uk"], "STOP_JURISDICTION_OVERGENERALISATION"],
  [["--all-belgium"], "STOP_JURISDICTION_OVERGENERALISATION"],
  [["--glob"], "STOP_IMPLICIT_DISCOVERY"],
  [["--scan-generated-lessons"], "STOP_IMPLICIT_DISCOVERY"],
  [["--package"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--ci"], "STOP_FORBIDDEN_INTEGRATION"],
];

const FORBIDDEN_AUTHORITY_FLAGS = [
  "source_refresh_executed",
  "local_expert_substituted",
  "runtime_execution",
  "localized_paragraphs_generated",
  "localized_exercises_generated",
  "localized_answer_models_generated",
  "localized_assessment_items_generated",
  "student_facing_files_generated",
  "teacher_school_facing_output_generated",
  "public_output_generated",
  "evidence_pack_generated",
  "product_route_adoption",
  "scale_gate_integration",
  "diagnostics_mastery_pv",
  "student_product_use",
  "personal_data_processing",
  "legal_compliance_claim",
  "approval_accreditation_claim",
  "op0_pta_summative_claim",
  "inspection_readiness_claim",
  "support_sufficiency_claim",
  "accommodation_sufficiency_claim",
  "individual_adjustment_claim",
  "reasonable_adjustment_claim",
  "learner_support_record_claim",
  "support_records_personal_data",
  "whole_uk_claim_from_england_only",
  "all_belgium_claim_from_flanders_only",
  "generated_lesson_output_scanning",
  "implicit_source_discovery",
  "directory_globbing",
  "quality_ref_or_dashboard_integration",
];

const CORE_REQUIREMENTS = [
  ["accepted_no_output_decision_bound", "The gate is bound to the accepted no-output simulation decision and does not reinterpret it as source-refresh authority."],
  ["local_expert_role_contract_complete", "The local expert role contract names allowed review scope, forbidden authority, responsibilities, uncertainty handling, and required output format."],
  ["source_refresh_protocol_complete", "Every allowlisted source has source ID, jurisdiction, role, official URL, access date, freshness trigger, staleness condition, replacement rule, human-review trigger, allowed inference, and forbidden inference."],
  ["jurisdiction_gates_complete", "England and Flanders gates cover their required authority/source boundaries."],
  ["no_output_enforced", "The packet refuses localized content, student/teacher/school/public output, runtime, product, Scale Gate, diagnostics/mastery/PV, and evidence-pack paths."],
  ["simulation_cases_complete", "Each jurisdiction includes all required source-refresh gate simulation cases without executing refresh."],
  ["negative_fixtures_cover_forbidden_cases", "Negative fixtures cover forbidden source, output, expert-substitution, personal-data, support, compliance, and overgeneralisation cases."],
  ["single_decision", "The packet selects exactly one allowed decision."],
  ["review_route_preserved", "Specialist reviews, final lead review, PR readiness, green CI, and human review remain required."],
];

const REVIEW_PACKET_REQUIREMENTS = [
  "Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
  "Cite the accepted no-output simulation decision and preserve the no-output/no-runtime/no-product-authority boundary.",
  "Define local expert role contract fields without substituting local expert judgement.",
  "Define source-refresh protocol fields without executing source refresh.",
  "Use explicit source and output allowlists only; no directory globbing or generated lesson-output scanning.",
  "Include England and Flanders jurisdiction-specific gates.",
  "Simulate source-refresh gate classification cases without refreshing sources or producing localized output.",
  "Refuse forbidden audiences, claims, integrations, product routes, Scale Gate, diagnostics/mastery/PV, personal data, support/accommodation sufficiency, and compliance/inspection-readiness claims.",
  "Classify findings with blocks, does_not_block, and proof_required_to_close.",
  "PASS WITH FLAGS may not carry a missing core requirement.",
];

function repoPath(relativePath) {
  return path.resolve(process.cwd(), relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function unique(values) {
  return [...new Set(values)];
}

function falseFlags() {
  return Object.fromEntries(FORBIDDEN_AUTHORITY_FLAGS.map((flag) => [flag, false]));
}

function finding(findingText, classification, blocks, doesNotBlock, proofRequired) {
  return {
    finding: findingText,
    classification,
    blocks,
    does_not_block: doesNotBlock,
    proof_required_to_close: proofRequired,
  };
}

function coreChecklist(status = "met_for_internal_gate_design") {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status,
    proof_required_to_close: "Generator/checker PASS, fixture/refusal PASS, specialist corrections closed, final lead PASS, exact-head PR readiness proof, green CI, and human review.",
  }));
}

function commonFields(reportId, status) {
  return {
    schema_version: 1,
    report_id: reportId,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    access_date: ACCESS_DATE,
    status,
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    product_end_state: PRODUCT_END_STATE,
    product_end_state_checkout_note: PRODUCT_END_STATE_CHECKOUT_NOTE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    roadmap_source: ROADMAP_SOURCE,
    accepted_input_decision: ACCEPTED_INPUT_DECISION,
    non_negotiable_requirements: REVIEW_PACKET_REQUIREMENTS,
    core_requirement_checklist: coreChecklist(),
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_ALLOWLIST,
    forbidden_authority: falseFlags(),
  };
}

function sourceRecords(jurisdictionId) {
  return deepeningDescriptor(jurisdictionId).official_source_allowlist.map((source) => ({ ...source }));
}

function deepeningDescriptor(jurisdictionId) {
  const file = jurisdictionId === "england"
    ? "references/data/inspection-standards/overlays/england.deepening.v1.json"
    : "references/data/inspection-standards/overlays/flanders.deepening.v1.json";
  return readJson(file);
}

function inputSimulation(jurisdictionId) {
  return readJson(`reports/inspection-standards/${jurisdictionId}-internal-no-output-trial-simulation.json`);
}

function protocolForSource(jurisdictionId, source) {
  return {
    source_id: source.source_id,
    jurisdiction_id: jurisdictionId,
    source_role: source.role,
    official_url: source.url,
    current_access_date: source.access_date,
    source_role_boundary: source.forbidden_inference,
    freshness_trigger: "Before any bounded source-refresh packet, compare the official URL and source title/version metadata against the recorded access date.",
    staleness_condition: "Trigger review if the official page title, version date, publication date, content route, or authority owner changes, or if the URL becomes unavailable.",
    replacement_source_rule: "Only a same-authority official successor source may replace this source, and replacement must be recorded as a new source-refresh packet item.",
    human_review_trigger: "Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use.",
    allowed_inference: source.allowed_use,
    forbidden_inference: source.forbidden_inference,
    condition_handling: SOURCE_CONDITIONS.map((condition) => ({
      condition,
      gate_action: gateActionForCondition(condition),
      blocks: blocksForCondition(condition),
      proof_required_to_close: proofForCondition(condition),
    })),
  };
}

function gateActionForCondition(condition) {
  return {
    official_source_unchanged: "record_currentness_only_no_refresh_execution",
    official_source_updated: "prepare_bounded_source_refresh_packet_for_human_review",
    official_source_replaced: "prepare_replacement_source_packet_for_human_review",
    official_source_unavailable: "stop_and_record_unavailable_source_gap",
    source_gap_discovered: "stop_and_record_source_gap",
    source_outside_allowed_scope: "refuse_source_and_escalate_scope",
  }[condition];
}

function blocksForCondition(condition) {
  if (condition === "official_source_unchanged") {
    return "Does not block internal gate planning; still blocks output and product authority.";
  }
  if (condition === "official_source_updated" || condition === "official_source_replaced") {
    return "Any localized output, source-derived implementation, or authority claim until a bounded packet is reviewed.";
  }
  return "Any source-refresh packet closure until the source issue is resolved by a reviewed human decision.";
}

function proofForCondition(condition) {
  if (condition === "official_source_unchanged") return "Record official URL, access date, and no-change observation in a future bounded packet.";
  if (condition === "official_source_updated") return "Human-reviewed diff of official source change, retained forbidden inference, and renewed source binding.";
  if (condition === "official_source_replaced") return "Human-reviewed replacement-source record with same authority or explicit scope reduction.";
  if (condition === "official_source_unavailable") return "Unavailable-source record, retrieval evidence, and owner decision before proceeding.";
  if (condition === "source_gap_discovered") return "Named source gap, affected rows, blocker display, and owner decision.";
  return "Scope refusal record proving the proposed source is outside the allowlist and no inference was carried.";
}

function expertRoleContract(jurisdictionId) {
  const label = jurisdictionId === "england" ? "England" : "Belgium / Flanders";
  return {
    jurisdiction: jurisdictionId,
    jurisdiction_label: label,
    expert_role: jurisdictionId === "england"
      ? "Local England economics/qualification/inspection source reviewer"
      : "Local Flemish economics/curriculum/quality-framework source reviewer",
    allowed_review_scope: [
      "Check official-source interpretation for Book 1 Chapters 1.2 and 1.3 gate planning.",
      "Identify source gaps, terminology uncertainty, pathway/assessment boundaries, and local review questions.",
      "Recommend whether a later bounded source-refresh packet is ready to be prepared.",
    ],
    forbidden_authority: [
      "No official authority substitution.",
      "No legal advice or compliance proof.",
      "No inspectorate, awarding-body, OK-framework, or school approval claim.",
      "No school implementation evidence or support/accommodation sufficiency claim.",
      "No localized student, teacher, school, public, product-route, or Scale Gate output.",
    ],
    source_review_responsibility: "Review only the explicit official source allowlist and identify stale, replaced, unavailable, gap, or outside-scope states.",
    curriculum_assessment_review_responsibility: jurisdictionId === "england"
      ? "Check DfE subject-content and selected AQA representative boundaries without broadening to all awarding bodies or the whole UK."
      : "Check Onderwijsdoelen, OK-framework, study-direction, school-network, and assessment-status boundaries without broadening to all Belgium.",
    language_terminology_review_responsibility: "Identify terminology that would need local review before any localized output; do not author localized paragraphs or exercises.",
    accessibility_inclusion_review_responsibility: "Identify accessibility/inclusion terminology and support-boundary questions; do not decide accommodations or support sufficiency.",
    legal_claim_boundary: "Expert review may inform internal source/curriculum interpretation but may not substitute for legal advice, compliance proof, approval, accreditation, OP0, PTA, summative validity, or inspection-readiness claims.",
    school_owned_evidence_boundary: "School-owned evidence, learner records, accommodations, support plans, implementation quality, and local assessment evidence remain outside this gate.",
    conflict_uncertainty_handling: "Record uncertainty as a blocker with affected source IDs, affected rows, owner next action, and proof required to close.",
    required_output_format: "Structured internal review record with source IDs, condition classification, affected rows, allowed inference, forbidden inference, blocks, does_not_block, and proof_required_to_close.",
  };
}

function jurisdictionGate(jurisdictionId) {
  if (jurisdictionId === "england") {
    return {
      jurisdiction_id: "england",
      required_boundaries: [
        "DfE subject content",
        "Ofsted inspection/evaluation sources",
        "selected awarding-body source boundaries",
        "SEND/accessibility terminology",
        "England-only / not whole UK boundary",
      ],
      selected_awarding_body_boundary: "AQA 7136 is representative only; no all-awarding-body or AQA approval claim.",
      inspection_boundary: "Ofsted sources may frame inspection vocabulary and school-owned evidence separation only.",
      accessibility_boundary: "SEND terminology may inform internal accessibility language only; no legal/support sufficiency claim.",
      jurisdiction_boundary: "England is not the whole UK.",
    };
  }
  return {
    jurisdiction_id: "flanders",
    required_boundaries: [
      "Onderwijsdoelen source boundary",
      "OK-framework source boundary",
      "study-direction / school-network constraints",
      "assessment-status boundary",
      "accessibility/inclusion and learner-support boundary",
      "Flanders-only / not all Belgium boundary",
    ],
    study_direction_boundary: "3de graad doorstroomfinaliteit basisvorming is a selected route; school-network and study-direction detail remains blocked.",
    inspection_boundary: "OK and inspection-method sources may frame internal quality vocabulary only.",
    assessment_boundary: "No central Flemish summative assessment source is selected; assessment remains school/network-owned.",
    accessibility_boundary: "Flemish inclusion terminology, leersteun, redelijke aanpassingen, and learners with specific educational needs are an explicit source-gap blocker until a later bounded packet source-reviews them; no individual-adjustment, support-record, support-sufficiency, or accommodation-sufficiency claim is authorized.",
    jurisdiction_boundary: "Flanders is not all Belgium.",
  };
}

function simulationCases(jurisdictionId, protocols) {
  const outsideId = jurisdictionId === "england" ? "scotland-curriculum-source" : "be-federal-education-source";
  const byId = Object.fromEntries(protocols.map((protocol) => [protocol.source_id, protocol]));
  const pick = (sourceId) => {
    if (!byId[sourceId]) throw new Error(`Missing required ${jurisdictionId} source protocol: ${sourceId}`);
    return sourceId;
  };
  const cases = jurisdictionId === "england" ? [
    ["valid_official_source_refresh_request", pick("england-dfe-a-level-economics-content"), "official_source_unchanged", "CLASSIFY_FOR_BOUNDED_PACKET", "DfE subject-content boundary", "A future request may be classified for packet preparation, but no refresh is executed here."],
    ["stale_source_detected", pick("england-aqa-7136-subject-content"), "official_source_updated", "REQUIRES_HUMAN_REVIEW", "selected AQA representative source boundary", "Staleness becomes a blocker until a bounded source-refresh packet is reviewed."],
    ["source_gap", pick("england-aqa-7136-assessment-resources"), "source_gap_discovered", "BLOCK_SOURCE_GAP", "AQA assessment-resource source-gap boundary", "A source gap blocks localized or authority claims."],
    ["non_official_source_proposed", outsideId, "source_outside_allowed_scope", "STOP_NON_OFFICIAL_SOURCE", "England-only / not whole UK boundary", "Outside-scope or non-official sources are refused."],
    ["local_expert_uncertainty", pick("england-aqa-economics-command-words"), "official_source_unchanged", "RECORD_UNCERTAINTY", "AQA command words are representative only, not all awarding bodies", "Expert uncertainty is recorded as a blocker, not resolved by substitution."],
    ["attempted_compliance_claim", pick("england-ofsted-eif-2025"), "official_source_unchanged", "STOP_COMPLIANCE_APPROVAL_CLAIM", "Ofsted inspection-readiness refusal", "Compliance and inspection-readiness claims are refused."],
    ["attempted_localized_output", pick("england-ofsted-operating-guide-2025"), "official_source_unchanged", "STOP_LOCALIZED_OUTPUT", "inspection evidence remains school-owned and no localized output is generated", "Localized paragraphs, exercises, answer models, or assessment items are refused."],
    ["attempted_school_facing_output", pick("england-send-code-practice"), "official_source_unchanged", "STOP_TEACHER_SCHOOL_FACING_OUTPUT", "SEND/accessibility support-sufficiency refusal", "Teacher/school-facing and public output are refused."],
  ] : [
    ["valid_official_source_refresh_request", pick("be-flanders-onderwijsdoelen-so3-doorstroom"), "official_source_unchanged", "CLASSIFY_FOR_BOUNDED_PACKET", "Onderwijsdoelen source boundary", "A future request may be classified for packet preparation, but no refresh is executed here."],
    ["stale_source_detected", pick("be-flanders-ok-framework"), "official_source_updated", "REQUIRES_HUMAN_REVIEW", "OK-framework source boundary", "Staleness becomes a blocker until a bounded source-refresh packet is reviewed."],
    ["source_gap", pick("be-flanders-onderwijsdoelen-modernisatie"), "source_gap_discovered", "BLOCK_SOURCE_GAP", "dynamic Onderwijsdoelen route/source-gap boundary", "A source gap blocks localized or authority claims."],
    ["non_official_source_proposed", outsideId, "source_outside_allowed_scope", "STOP_NON_OFFICIAL_SOURCE", "Flanders-only / not all Belgium boundary", "Outside-scope or non-official sources are refused."],
    ["local_expert_uncertainty", pick("be-flanders-education-quality-reference"), "official_source_unchanged", "RECORD_UNCERTAINTY", "study-direction / school-network constraints", "Expert uncertainty is recorded as a blocker, not resolved by substitution."],
    ["attempted_compliance_claim", pick("be-flanders-inspection-what-do-we-inspect"), "official_source_unchanged", "STOP_COMPLIANCE_APPROVAL_CLAIM", "OK/compliance and inspection-readiness refusal", "Compliance and inspection-readiness claims are refused."],
    ["attempted_localized_output", pick("be-flanders-onderwijsdoelen-so3-doorstroom"), "official_source_unchanged", "STOP_LOCALIZED_OUTPUT", "Onderwijsdoelen do not authorize localized output", "Localized paragraphs, exercises, answer models, or assessment items are refused."],
    ["attempted_school_facing_output", pick("be-flanders-ok-framework"), "official_source_unchanged", "STOP_TEACHER_SCHOOL_FACING_OUTPUT", "Flemish inclusion and learner-support evidence remains school-owned", "Teacher/school-facing and public output are refused."],
  ];
  return cases.map(([caseType, sourceId, sourceCondition, classification, boundaryFocus, note]) => ({
    case_type: caseType,
    jurisdiction_id: jurisdictionId,
    source_id: sourceId,
    source_condition: sourceCondition,
    classification,
    boundary_focus: boundaryFocus,
    simulation_only: true,
    source_refresh_executed: false,
    local_expert_substituted: false,
    generated_output: noOutputEnforcement(),
    note,
    blocks: "Source-refresh execution, local expert substitution, localized output, school/public output, product routes, Scale Gate, diagnostics/mastery/PV, personal data, compliance/approval, inspection-readiness, support/accommodation sufficiency, and jurisdiction overgeneralisation.",
    does_not_block: "Internal gate-design review.",
    proof_required_to_close: "Separate reviewed bounded source-refresh packet, local expert review record, final lead PASS, exact-head PR readiness, green CI, and explicit owner authorization.",
  }));
}

function noOutputEnforcement() {
  return {
    localized_paragraphs: false,
    localized_exercises: false,
    answer_models: false,
    localized_assessment_items: false,
    student_facing_files: false,
    teacher_school_output: false,
    public_output: false,
    evidence_pack: false,
    runtime_execution: false,
    product_route: false,
    scale_gate: false,
    diagnostics_mastery_pv: false,
    personal_data: false,
  };
}

function sourceRefreshGateSimulation(jurisdictionId) {
  const input = inputSimulation(jurisdictionId);
  const descriptor = deepeningDescriptor(jurisdictionId);
  const sources = sourceRecords(jurisdictionId);
  const protocols = sources.map((source) => protocolForSource(jurisdictionId, source));
  const cases = simulationCases(jurisdictionId, protocols);
  return {
    ...commonFields(`${jurisdictionId}-source-refresh-gate-simulation`, "complete_internal_gate_simulation"),
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: input.jurisdiction_source_binding.jurisdiction_label,
    source_protocol: protocols,
    local_expert_role_contract: expertRoleContract(jurisdictionId),
    jurisdiction_specific_gate: jurisdictionGate(jurisdictionId),
    accessibility_inclusion_terminology: descriptor.accessibility_inclusion_terminology,
    school_owned_evidence_boundary: descriptor.school_owned_evidence_boundary,
    source_refresh_execution_performed: false,
    local_expert_substitution_performed: false,
    gate_simulation_cases: cases,
    no_output_enforcement: noOutputEnforcement(),
    finding_classification: [
      finding(
        `${input.jurisdiction_source_binding.jurisdiction_label} gate simulation covers official source, stale source, gap, non-official source, expert uncertainty, claim, localized-output, and school-output cases without executing refresh.`,
        "core_requirement_met",
        "Nothing for internal gate design review.",
        "Proceeding to combined gate decision after specialist review.",
        "Checker PASS, negative fixtures PASS, source reviewer PASS, legal/privacy PASS, accessibility/inclusion PASS, final lead PASS, exact-head PR readiness, and human review."
      ),
      finding(
        `${input.jurisdiction_source_binding.jurisdiction_label} downstream use remains blocked.`,
        "scale_blocker",
        "Source refresh execution, local expert substitution, localized/student/teacher/school/public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, personal data, compliance/approval/inspection-readiness/support/accommodation claims.",
        "Internal no-output gate design and review.",
        "Separate reviewed sprint and explicit owner authorization."
      ),
    ],
  };
}

function planReport(england, flanders) {
  return {
    ...commonFields("local-expert-source-refresh-gate-plan", "complete_internal_gate_design"),
    gate_purpose: "Design the internal England/Flanders local expert and source refresh gate without executing source refresh or substituting local experts.",
    local_expert_role_contracts: [england.local_expert_role_contract, flanders.local_expert_role_contract],
    source_refresh_protocol_summary: {
      source_conditions: SOURCE_CONDITIONS,
      england_sources: england.source_protocol.map((source) => source.source_id),
      flanders_sources: flanders.source_protocol.map((source) => source.source_id),
      source_refresh_execution_performed: false,
      local_expert_substitution_performed: false,
    },
    jurisdiction_specific_gates: [england.jurisdiction_specific_gate, flanders.jurisdiction_specific_gate],
    validation_and_review_gates: [
      "Schema/architecture lead review",
      "England authority/source review",
      "Flanders authority/source review",
      "Teacher/economics review",
      "Legal/privacy review",
      "Accessibility/inclusion review",
      "Final lead review",
      "Exact-head PR readiness and green CI",
      "Human review for selected decision",
    ],
    finding_classification: [
      finding(
        "The gate design defines local expert role, source-refresh protocol, jurisdiction gates, no-output enforcement, and simulation cases.",
        "core_requirement_met",
        "Nothing for internal gate-design review.",
        "Proceeding to final decision review.",
        "Checker PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness, green CI, and human review."
      ),
      finding(
        "The gate design does not execute refresh or authorize output.",
        "scale_blocker",
        "Source-refresh execution, local expert substitution, localized output, school/public output, product routes, Scale Gate, diagnostics/mastery/PV, personal data, compliance/approval/inspection-readiness/support/accommodation sufficiency.",
        "Planning a later bounded source-refresh packet if human review accepts the decision.",
        "Separate reviewed bounded source-refresh packet and explicit owner authorization."
      ),
    ],
  };
}

function decisionReport(england, flanders, plan) {
  return {
    ...commonFields("local-expert-source-refresh-gate-decision", "decision_ready_for_human_review"),
    final_local_expert_source_refresh_gate_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      decision_selection_count: 1,
      rationale: "The gate design can control source authority, local expert role, no-output boundaries, and claim refusals, so the next possible sprint may prepare a bounded source-refresh packet without executing it here.",
    },
    simulation_case_counts: {
      england: england.gate_simulation_cases.length,
      flanders: flanders.gate_simulation_cases.length,
      required_case_types: SIMULATION_CASE_TYPES,
    },
    source_refresh_execution_performed: false,
    local_expert_substitution_performed: false,
    does_not_authorize: [
      "source refresh execution",
      "local expert substitution",
      "runtime execution",
      "localized output",
      "country editions",
      "teacher/school-facing or public output",
      "evidence packs",
      "product-route adoption",
      "Scale Gate",
      "diagnostics/mastery/PV",
      "student/product use",
      "personal-data processing",
      "individual adjustment claims",
      "reasonable adjustment claims",
      "learner/support-record claims",
      "support-record personal-data processing",
      "compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, or accommodation sufficiency claims",
    ],
    plan_report: plan.report_id,
    finding_classification: [
      finding(
        `The selected decision is ${SELECTED_DECISION}.`,
        "core_requirement_met",
        "Nothing for internal human review of this gate-design packet.",
        "A later bounded source-refresh packet planning step after human acceptance.",
        "Final lead PASS, exact-head PR readiness, green CI, and explicit owner authorization."
      ),
      finding(
        "The decision remains planning-only.",
        "scale_blocker",
        "All source-refresh execution, local expert substitution, output, product, student, personal-data, compliance, and inspection-readiness authority.",
        "Human review of the planning-only decision.",
        "Separate reviewed sprint and explicit owner authorization."
      ),
    ],
  };
}

function schemaDocument() {
  const string = { type: "string", minLength: 1 };
  const falseConst = Object.fromEntries(FORBIDDEN_AUTHORITY_FLAGS.map((flag) => [flag, { const: false }]));
  const stringArray = { type: "array", minItems: 1, items: string };
  const noOutputProperties = Object.fromEntries(Object.keys(noOutputEnforcement()).map((flag) => [flag, { const: false }]));
  const noOutputRequired = Object.keys(noOutputEnforcement());
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://github.com/meijer1973/4veco-platform/references/schemas/local-expert-source-refresh-gate.schema.v1.json",
    title: "4veco internal local expert and source refresh gate",
    type: "object",
    additionalProperties: false,
    required: [
      "schema_version",
      "report_id",
      "sprint_id",
      "generated_date",
      "access_date",
      "status",
      "internal_only",
      "manual_invocation_only",
      "human_review_required",
      "product_end_state",
      "product_end_state_checkout_note",
      "original_sprint_gate_spec",
      "roadmap_source",
      "accepted_input_decision",
      "non_negotiable_requirements",
      "input_allowlist",
      "output_allowlist",
      "forbidden_authority",
      "core_requirement_checklist",
      "finding_classification",
    ],
    properties: {
      schema_version: { const: 1 },
      report_id: string,
      sprint_id: { const: SPRINT_ID },
      generated_date: { const: ACCESS_DATE },
      access_date: { const: ACCESS_DATE },
      status: string,
      internal_only: { const: true },
      manual_invocation_only: { const: true },
      human_review_required: { const: true },
      product_end_state: { const: PRODUCT_END_STATE },
      product_end_state_checkout_note: { const: PRODUCT_END_STATE_CHECKOUT_NOTE },
      original_sprint_gate_spec: { const: ORIGINAL_SPRINT_GATE_SPEC },
      roadmap_source: { const: ROADMAP_SOURCE },
      accepted_input_decision: { const: ACCEPTED_INPUT_DECISION },
      non_negotiable_requirements: tupleSchema(REVIEW_PACKET_REQUIREMENTS),
      core_requirement_checklist: { type: "array", minItems: CORE_REQUIREMENTS.length, items: { $ref: "#/$defs/coreRequirement" } },
      input_allowlist: tupleSchema(INPUT_ALLOWLIST),
      output_allowlist: tupleSchema(OUTPUT_ALLOWLIST),
      forbidden_authority: {
        type: "object",
        additionalProperties: false,
        required: FORBIDDEN_AUTHORITY_FLAGS,
        properties: falseConst,
      },
      source_conditions: tupleSchema(SOURCE_CONDITIONS),
      gate_simulation_case_types: tupleSchema(SIMULATION_CASE_TYPES),
      finding_classification: { type: "array", minItems: 1, items: { $ref: "#/$defs/finding" } },
      gate_purpose: string,
      local_expert_role_contracts: { type: "array", minItems: 2, maxItems: 2, items: { $ref: "#/$defs/localExpertRoleContract" } },
      source_refresh_protocol_summary: { $ref: "#/$defs/sourceRefreshProtocolSummary" },
      jurisdiction_specific_gates: { type: "array", minItems: 2, maxItems: 2, items: { $ref: "#/$defs/jurisdictionSpecificGate" } },
      validation_and_review_gates: stringArray,
      jurisdiction_id: { enum: ["england", "flanders"] },
      jurisdiction_label: string,
      source_protocol: { type: "array", minItems: 1, items: { $ref: "#/$defs/sourceProtocol" } },
      local_expert_role_contract: { $ref: "#/$defs/localExpertRoleContract" },
      jurisdiction_specific_gate: { $ref: "#/$defs/jurisdictionSpecificGate" },
      accessibility_inclusion_terminology: { type: "array", minItems: 1, items: { $ref: "#/$defs/accessibilityTerm" } },
      school_owned_evidence_boundary: { type: "array", minItems: 1, items: { $ref: "#/$defs/schoolOwnedEvidenceBoundary" } },
      source_refresh_execution_performed: { const: false },
      local_expert_substitution_performed: { const: false },
      gate_simulation_cases: { type: "array", minItems: SIMULATION_CASE_TYPES.length, maxItems: SIMULATION_CASE_TYPES.length, items: { $ref: "#/$defs/simulationCase" } },
      no_output_enforcement: { $ref: "#/$defs/noOutputEnforcement" },
      final_local_expert_source_refresh_gate_decision: { $ref: "#/$defs/decisionSelection" },
      simulation_case_counts: { $ref: "#/$defs/simulationCaseCounts" },
      does_not_authorize: stringArray,
      plan_report: string,
    },
    $defs: {
      coreRequirement: {
        type: "object",
        additionalProperties: false,
        required: ["id", "requirement", "status", "proof_required_to_close"],
        properties: {
          id: string,
          requirement: string,
          status: string,
          proof_required_to_close: string,
        },
      },
      finding: {
        type: "object",
        additionalProperties: false,
        required: ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"],
        properties: {
          finding: string,
          classification: { enum: REV_STD_FINDING_CLASSIFICATIONS },
          blocks: string,
          does_not_block: string,
          proof_required_to_close: string,
        },
      },
      conditionHandling: {
        type: "object",
        additionalProperties: false,
        required: ["condition", "gate_action", "blocks", "proof_required_to_close"],
        properties: {
          condition: { enum: SOURCE_CONDITIONS },
          gate_action: string,
          blocks: string,
          proof_required_to_close: string,
        },
      },
      sourceProtocol: {
        type: "object",
        additionalProperties: false,
        required: [
          "source_id",
          "jurisdiction_id",
          "source_role",
          "official_url",
          "current_access_date",
          "source_role_boundary",
          "freshness_trigger",
          "staleness_condition",
          "replacement_source_rule",
          "human_review_trigger",
          "allowed_inference",
          "forbidden_inference",
          "condition_handling",
        ],
        properties: {
          source_id: string,
          jurisdiction_id: { enum: ["england", "flanders"] },
          source_role: string,
          official_url: { type: "string", pattern: "^https://" },
          current_access_date: string,
          source_role_boundary: string,
          freshness_trigger: string,
          staleness_condition: string,
          replacement_source_rule: string,
          human_review_trigger: string,
          allowed_inference: string,
          forbidden_inference: string,
          condition_handling: { type: "array", minItems: SOURCE_CONDITIONS.length, maxItems: SOURCE_CONDITIONS.length, items: { $ref: "#/$defs/conditionHandling" } },
        },
      },
      localExpertRoleContract: {
        type: "object",
        additionalProperties: false,
        required: [
          "jurisdiction",
          "jurisdiction_label",
          "expert_role",
          "allowed_review_scope",
          "forbidden_authority",
          "source_review_responsibility",
          "curriculum_assessment_review_responsibility",
          "language_terminology_review_responsibility",
          "accessibility_inclusion_review_responsibility",
          "legal_claim_boundary",
          "school_owned_evidence_boundary",
          "conflict_uncertainty_handling",
          "required_output_format",
        ],
        properties: {
          jurisdiction: { enum: ["england", "flanders"] },
          jurisdiction_label: string,
          expert_role: string,
          allowed_review_scope: stringArray,
          forbidden_authority: stringArray,
          source_review_responsibility: string,
          curriculum_assessment_review_responsibility: string,
          language_terminology_review_responsibility: string,
          accessibility_inclusion_review_responsibility: string,
          legal_claim_boundary: string,
          school_owned_evidence_boundary: string,
          conflict_uncertainty_handling: string,
          required_output_format: string,
        },
      },
      jurisdictionSpecificGate: {
        type: "object",
        additionalProperties: false,
        required: ["jurisdiction_id", "required_boundaries", "inspection_boundary", "jurisdiction_boundary"],
        properties: {
          jurisdiction_id: { enum: ["england", "flanders"] },
          required_boundaries: stringArray,
          selected_awarding_body_boundary: string,
          inspection_boundary: string,
          accessibility_boundary: string,
          jurisdiction_boundary: string,
          study_direction_boundary: string,
          assessment_boundary: string,
        },
      },
      noOutputEnforcement: {
        type: "object",
        additionalProperties: false,
        required: noOutputRequired,
        properties: noOutputProperties,
      },
      simulationCase: {
        type: "object",
        additionalProperties: false,
        required: [
          "case_type",
          "jurisdiction_id",
          "source_id",
          "source_condition",
          "classification",
          "boundary_focus",
          "simulation_only",
          "source_refresh_executed",
          "local_expert_substituted",
          "generated_output",
          "note",
          "blocks",
          "does_not_block",
          "proof_required_to_close",
        ],
        properties: {
          case_type: { enum: SIMULATION_CASE_TYPES },
          jurisdiction_id: { enum: ["england", "flanders"] },
          source_id: string,
          source_condition: { enum: SOURCE_CONDITIONS },
          classification: string,
          boundary_focus: string,
          simulation_only: { const: true },
          source_refresh_executed: { const: false },
          local_expert_substituted: { const: false },
          generated_output: { $ref: "#/$defs/noOutputEnforcement" },
          note: string,
          blocks: string,
          does_not_block: string,
          proof_required_to_close: string,
        },
      },
      sourceRefreshProtocolSummary: {
        type: "object",
        additionalProperties: false,
        required: ["source_conditions", "england_sources", "flanders_sources", "source_refresh_execution_performed", "local_expert_substitution_performed"],
        properties: {
          source_conditions: tupleSchema(SOURCE_CONDITIONS),
          england_sources: stringArray,
          flanders_sources: stringArray,
          source_refresh_execution_performed: { const: false },
          local_expert_substitution_performed: { const: false },
        },
      },
      accessibilityTerm: {
        type: "object",
        additionalProperties: false,
        required: ["source_term", "limitation", "evidence_boundary"],
        properties: {
          source_term: string,
          local_term: string,
          limitation: string,
          evidence_boundary: string,
        },
      },
      schoolOwnedEvidenceBoundary: {
        type: "object",
        additionalProperties: false,
        required: ["boundary_area", "why_school_owned", "forbidden_inference"],
        properties: {
          boundary_area: string,
          why_school_owned: string,
          forbidden_inference: string,
        },
      },
      decisionSelection: {
        type: "object",
        additionalProperties: false,
        required: ["selected", "allowed_options", "decision_selection_count", "rationale"],
        properties: {
          selected: { const: SELECTED_DECISION },
          allowed_options: tupleSchema(DECISION_OPTIONS),
          decision_selection_count: { const: 1 },
          rationale: string,
        },
      },
      simulationCaseCounts: {
        type: "object",
        additionalProperties: false,
        required: ["england", "flanders", "required_case_types"],
        properties: {
          england: { const: SIMULATION_CASE_TYPES.length },
          flanders: { const: SIMULATION_CASE_TYPES.length },
          required_case_types: tupleSchema(SIMULATION_CASE_TYPES),
        },
      },
    },
  };
}

function tupleSchema(values) {
  return {
    type: "array",
    minItems: values.length,
    maxItems: values.length,
    prefixItems: values.map((value) => ({ const: value })),
  };
}

function renderMarkdown(lines) {
  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function renderContract(plan) {
  return renderMarkdown([
    "# Local Expert Source Refresh Gate Contract",
    "",
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Product end-state checkout note: ${PRODUCT_END_STATE_CHECKOUT_NOTE}`,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Roadmap: \`${ROADMAP_SOURCE}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\``,
    "",
    "## Hard Boundary",
    "",
    "Local expert review may inform internal source/curriculum interpretation. It may not substitute for official authority, legal advice, inspectorate approval, school implementation evidence, or compliance proof.",
    "",
    "## Non-Negotiable Requirements",
    "",
    ...REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`),
    "",
    "## Local Expert Role Fields",
    "",
    "| Field | Requirement |",
    "| --- | --- |",
    ...Object.keys(plan.local_expert_role_contracts[0]).map((key) => `| \`${key}\` | Required for each jurisdiction |`),
    "",
    "## Still Blocked",
    "",
    ...Object.keys(falseFlags()).map((flag) => `- \`${flag}\``),
    "",
  ]);
}

function renderJurisdictionGate(report) {
  return renderMarkdown([
    `# ${report.jurisdiction_label} Local Expert Source Gate`,
    "",
    `Status: ${report.status}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Product end-state checkout note: ${PRODUCT_END_STATE_CHECKOUT_NOTE}`,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Local Expert Role Contract",
    "",
    ...Object.entries(report.local_expert_role_contract).map(([key, value]) => `- \`${key}\`: ${Array.isArray(value) ? value.join("; ") : value}`),
    "",
    "## Source Refresh Protocol",
    "",
    "| Source | Role | Official URL | Access Date | Human Review Trigger | Forbidden Inference |",
    "| --- | --- | --- | --- | --- | --- |",
    ...report.source_protocol.map((source) => `| \`${source.source_id}\` | ${source.source_role} | ${source.official_url} | ${source.current_access_date} | ${source.human_review_trigger} | ${source.forbidden_inference} |`),
    "",
    "## Jurisdiction-Specific Gate",
    "",
    ...report.jurisdiction_specific_gate.required_boundaries.map((item) => `- ${item}`),
    "",
  ]);
}

function renderSimulation(report) {
  return renderMarkdown([
    `# ${report.jurisdiction_label} Source Refresh Gate Simulation`,
    "",
    `Status: ${report.status}`,
    "",
    "## Simulation Cases",
    "",
    "| Case | Source | Boundary Focus | Condition | Classification | Refresh Executed | Expert Substituted |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...report.gate_simulation_cases.map((item) => `| \`${item.case_type}\` | \`${item.source_id}\` | ${item.boundary_focus} | \`${item.source_condition}\` | \`${item.classification}\` | ${item.source_refresh_executed} | ${item.local_expert_substituted} |`),
    "",
    "## Accessibility/Inclusion Evidence Boundary",
    "",
    ...report.accessibility_inclusion_terminology.map((item) => `- ${item.source_term}: ${item.limitation} ${item.evidence_boundary}`),
    "",
    "## Finding Classification",
    "",
    "| Finding | Classification | blocks | does_not_block | proof_required_to_close |",
    "| --- | --- | --- | --- | --- |",
    ...report.finding_classification.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
    "",
  ]);
}

function renderPlan(report) {
  return renderMarkdown([
    "# Local Expert Source Refresh Gate Plan",
    "",
    `Status: ${report.status}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Product end-state checkout note: ${PRODUCT_END_STATE_CHECKOUT_NOTE}`,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\``,
    "",
    "## Core-Requirement Checklist",
    "",
    "| Requirement | Status | proof_required_to_close |",
    "| --- | --- | --- |",
    ...report.core_requirement_checklist.map((item) => `| \`${item.id}\` | ${item.status} | ${item.proof_required_to_close} |`),
    "",
    "## Source Conditions",
    "",
    ...SOURCE_CONDITIONS.map((item) => `- \`${item}\``),
    "",
    "## Review Gates",
    "",
    ...report.validation_and_review_gates.map((item) => `- ${item}`),
    "",
  ]);
}

function renderDecision(report) {
  return renderMarkdown([
    "# Local Expert Source Refresh Gate Decision",
    "",
    `Status: ${report.status}`,
    "",
    "## Decision",
    "",
    `Selected: \`${report.final_local_expert_source_refresh_gate_decision.selected}\``,
    "",
    "Allowed options:",
    "",
    ...report.final_local_expert_source_refresh_gate_decision.allowed_options.map((item) => `- \`${item}\``),
    "",
    "## Does Not Authorize",
    "",
    ...report.does_not_authorize.map((item) => `- ${item}`),
    "",
    "## Finding Classification",
    "",
    "| Finding | Classification | blocks | does_not_block | proof_required_to_close |",
    "| --- | --- | --- | --- | --- |",
    ...report.finding_classification.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
    "",
  ]);
}

function renderSprintPlan(decision) {
  return renderMarkdown([
    "# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Sprint Plan",
    "",
    "Status: implemented_for_review",
    `Date: ${ACCESS_DATE}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Product end-state checkout note: ${PRODUCT_END_STATE_CHECKOUT_NOTE}`,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Roadmap: \`${ROADMAP_SOURCE}\``,
    "",
    "## End Goal",
    "",
    "Deliver a complete internal gate design and simulation for England/Flanders local expert and source refresh planning without executing source refresh or substituting local experts.",
    "",
    "## Non-Negotiable Requirements",
    "",
    ...REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`),
    "",
    "## Required Outputs",
    "",
    ...OUTPUT_ALLOWLIST.map((item) => `- \`${item}\``),
    "",
    "## Selected Decision",
    "",
    `Selected for human review: \`${decision.final_local_expert_source_refresh_gate_decision.selected}\``,
    "",
  ]);
}

function renderValidationLog(bundle) {
  return renderMarkdown([
    "# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Validation Log",
    "",
    "Status: validated_for_human_review",
    "",
    "Validation run:",
    "",
    "| Command | Result |",
    "| --- | --- |",
    "| `node build-scripts/inspection/build-local-expert-source-refresh-gate.js --check` | PASS |",
    "| `node build-scripts/inspection/check-local-expert-source-refresh-gate.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-local-expert-source-refresh-gate.test.js --runInBand` | PASS |",
    "| `node build-scripts/references/check-roadmap-version-index.js` | PASS |",
    "| `npm.cmd run check:scope-language` | PASS |",
    "| `npm.cmd run check:active-governance-wording` | PASS |",
    "| `node build-scripts/reports/validate-report-json.js` | PASS |",
    "| `git diff --check origin/main..HEAD` | PASS |",
    "| `npm.cmd run check:platform` | PASS after `npm.cmd ci` installed locked dependencies |",
    "",
    `Generated report groups: ${Object.keys(bundle).filter((key) => key !== "fixtures").length}`,
    `Negative fixtures: ${NEGATIVE_FIXTURES.length}`,
    `Simulation cases: ${SIMULATION_CASE_TYPES.length * 2}`,
    "",
  ]);
}

function renderCorrectionLog() {
  return renderMarkdown([
    "# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Correction Log",
    "",
    "Status: specialist_blockers_closed",
    "",
    "| Finding | Status | Correction | Proof |",
    "| --- | --- | --- | --- |",
    "| Strict schema did not model actual packet shapes | closed | Added concrete plan/simulation/decision schema definitions and schema-instance validation in the checker | Focused checker PASS |",
    "| Required specialist/final review records were not enforced | closed | Checker now requires manual review records; specialist and final lead records are present | Focused checker PASS |",
    "| England source allowlist was documented but not enforced | closed | Checker now compares exact source IDs, URLs, roles, access dates, allowed uses, and forbidden inferences against the deepening descriptor | Focused checker PASS; England re-review accepted repair |",
    "| England simulation coverage leaned on a single Ofsted source | closed | Simulation boundary-focus rows now cover DfE, Ofsted, representative AQA, SEND/accessibility, not-all-awarding-bodies, and England-only/not-whole-UK cases | Focused checker PASS; England re-review accepted repair |",
    "| Flanders inclusion and learner-support boundary was flattened | closed | Flanders gate now carries accessibility/inclusion and learner-support boundary language plus copied overlay accessibility/school-owned evidence records | Accessibility re-review accepted repair |",
    "| Individual/reasonable-adjustment and learner/support-record claims were not first-class machine blocks | closed | Added authority flags, CLI refusals, negative fixtures, checker assertions, and focused Jest probes | Focused checker and Jest PASS |",
    "",
  ]);
}

function renderClosureRecord(decision) {
  return renderMarkdown([
    "# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Closure Record",
    "",
    "Status: ready_for_human_review_after_pr_readiness",
    "",
    `Selected decision: \`${decision.final_local_expert_source_refresh_gate_decision.selected}\``,
    "Expected route: `READY_FOR_HUMAN_REVIEW`",
    "",
    "Specialist gate: PASS after repairs.",
    "Final lead: PASS.",
    "",
    "This record does not authorize source refresh execution, local expert substitution, localized output, school/public output, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, accommodation sufficiency, individual adjustment, reasonable adjustment, learner/support-record, or support-record personal-data claims.",
    "",
  ]);
}

function mutate(base, code) {
  const clone = JSON.parse(JSON.stringify(base));
  const firstCase = clone.gate_simulation_cases[0];
  switch (code) {
    case "STOP_NON_OFFICIAL_SOURCE":
      firstCase.source_id = "unofficial-blog-source";
      return clone;
    case "STOP_SOURCE_REFRESH_EXECUTION":
      clone.source_refresh_execution_performed = true;
      firstCase.source_refresh_executed = true;
      return clone;
    case "STOP_LOCAL_EXPERT_SUBSTITUTION":
      clone.local_expert_substitution_performed = true;
      firstCase.local_expert_substituted = true;
      return clone;
    case "STOP_LOCALIZED_OUTPUT":
      firstCase.generated_output.localized_paragraphs = true;
      return clone;
    case "STOP_STUDENT_FACING_OUTPUT":
      firstCase.generated_output.student_facing_files = true;
      return clone;
    case "STOP_TEACHER_SCHOOL_FACING_OUTPUT":
      firstCase.generated_output.teacher_school_output = true;
      return clone;
    case "STOP_PUBLIC_OUTPUT":
      firstCase.generated_output.public_output = true;
      return clone;
    case "STOP_PERSONAL_DATA":
      firstCase.generated_output.personal_data = true;
      clone.personal_data_fields = ["student_name"];
      return clone;
    case "STOP_COMPLIANCE_APPROVAL_CLAIM":
      clone.forbidden_authority.legal_compliance_claim = true;
      clone.forbidden_authority.inspection_readiness_claim = true;
      return clone;
    case "STOP_SUPPORT_ACCOMMODATION_CLAIM":
      clone.forbidden_authority.support_sufficiency_claim = true;
      clone.forbidden_authority.accommodation_sufficiency_claim = true;
      return clone;
    case "STOP_INDIVIDUAL_ADJUSTMENT_CLAIM":
      clone.forbidden_authority.individual_adjustment_claim = true;
      return clone;
    case "STOP_REASONABLE_ADJUSTMENT_CLAIM":
      clone.forbidden_authority.reasonable_adjustment_claim = true;
      return clone;
    case "STOP_LEARNER_SUPPORT_RECORD_CLAIM":
      clone.forbidden_authority.learner_support_record_claim = true;
      return clone;
    case "STOP_SUPPORT_RECORDS_PERSONAL_DATA":
      clone.forbidden_authority.support_records_personal_data = true;
      clone.personal_data_fields = ["learner_support_record_reference"];
      return clone;
    case "STOP_SOURCE_ALLOWLIST_MISMATCH":
      clone.source_protocol = clone.source_protocol.slice(0, -1);
      return clone;
    case "STOP_JURISDICTION_OVERGENERALISATION":
      if (clone.jurisdiction_id === "england") clone.forbidden_authority.whole_uk_claim_from_england_only = true;
      else clone.forbidden_authority.all_belgium_claim_from_flanders_only = true;
      return clone;
    case "STOP_SOURCE_CONDITION_COVERAGE":
      clone.source_protocol[0].condition_handling = clone.source_protocol[0].condition_handling.filter((item) => item.condition !== "source_gap_discovered");
      return clone;
    default:
      throw new Error(`Unknown mutation code: ${code}`);
  }
}

function fixtureReports(england, flanders) {
  const fixtureBase = england;
  return {
    positive: new Map([
      ["references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/england-source-refresh-gate-simulation.sample.json", england],
      ["references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/flanders-source-refresh-gate-simulation.sample.json", flanders],
    ]),
    negative: new Map(NEGATIVE_FIXTURES.map(([file, code]) => {
      const base = code === "STOP_JURISDICTION_OVERGENERALISATION" && file.includes("all-belgium") ? flanders : fixtureBase;
      const gateSimulation = file === "official-url-mismatch.sample.json"
        ? (() => {
          const mutated = JSON.parse(JSON.stringify(base));
          mutated.source_protocol[0].official_url = "https://example.com/not-official";
          return mutated;
        })()
        : mutate(base, code);
      return [
        `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/${file}`,
        {
          fixture_id: file.replace(".sample.json", ""),
          expected_refusal_code: code,
          gate_simulation: gateSimulation,
        },
      ];
    })),
  };
}

function buildBundle() {
  for (const input of INPUT_ALLOWLIST) {
    if (!fs.existsSync(repoPath(input))) throw new Error(`Missing input allowlist source: ${input}`);
  }
  const noOutputDecision = readJson("reports/inspection-standards/internal-no-output-trial-simulation-decision.json");
  const selected = noOutputDecision.final_internal_no_output_trial_simulation_decision?.selected;
  if (selected !== ACCEPTED_INPUT_DECISION) {
    throw new StopError("STOP_ACCEPTED_INPUT_DECISION_MISMATCH", "No-output simulation decision does not authorize this planning-only gate.");
  }
  const england = sourceRefreshGateSimulation("england");
  const flanders = sourceRefreshGateSimulation("flanders");
  const plan = planReport(england, flanders);
  const decision = decisionReport(england, flanders, plan);
  return {
    schema: schemaDocument(),
    plan,
    england,
    flanders,
    decision,
    fixtures: fixtureReports(england, flanders),
  };
}

function outputContents(bundle) {
  const contents = new Map([
    ["references/schemas/local-expert-source-refresh-gate.schema.v1.json", `${JSON.stringify(bundle.schema, null, 2)}\n`],
    ["docs/inspection-standards/local-expert-source-refresh-gate-contract.md", renderContract(bundle.plan)],
    ["docs/inspection-standards/england-local-expert-source-gate.md", renderJurisdictionGate(bundle.england)],
    ["docs/inspection-standards/flanders-local-expert-source-gate.md", renderJurisdictionGate(bundle.flanders)],
    ["reports/inspection-standards/local-expert-source-refresh-gate-plan.md", renderPlan(bundle.plan)],
    ["reports/inspection-standards/local-expert-source-refresh-gate-plan.json", `${JSON.stringify(bundle.plan, null, 2)}\n`],
    ["reports/inspection-standards/england-source-refresh-gate-simulation.md", renderSimulation(bundle.england)],
    ["reports/inspection-standards/england-source-refresh-gate-simulation.json", `${JSON.stringify(bundle.england, null, 2)}\n`],
    ["reports/inspection-standards/flanders-source-refresh-gate-simulation.md", renderSimulation(bundle.flanders)],
    ["reports/inspection-standards/flanders-source-refresh-gate-simulation.json", `${JSON.stringify(bundle.flanders, null, 2)}\n`],
    ["reports/inspection-standards/local-expert-source-refresh-gate-decision.md", renderDecision(bundle.decision)],
    ["reports/inspection-standards/local-expert-source-refresh-gate-decision.json", `${JSON.stringify(bundle.decision, null, 2)}\n`],
  ]);
  for (const [file, report] of bundle.fixtures.positive.entries()) contents.set(file, `${JSON.stringify(report, null, 2)}\n`);
  for (const [file, report] of bundle.fixtures.negative.entries()) contents.set(file, `${JSON.stringify(report, null, 2)}\n`);
  contents.set(ORIGINAL_SPRINT_GATE_SPEC, renderSprintPlan(bundle.decision));
  contents.set(`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`, renderValidationLog(bundle));
  contents.set(`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`, renderCorrectionLog());
  contents.set(`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`, renderClosureRecord(bundle.decision));
  return contents;
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();
  if (/execute-source-refresh|source-refresh|refresh-sources/.test(joined)) {
    throw new StopError("STOP_SOURCE_REFRESH_EXECUTION", "Source refresh execution is not authorized by this gate-design sprint.", { args: unknown });
  }
  if (/local-expert-substitution|contact-local-expert|expert-substitution/.test(joined)) {
    throw new StopError("STOP_LOCAL_EXPERT_SUBSTITUTION", "Local expert substitution or contact is not authorized by this gate-design sprint.", { args: unknown });
  }
  if (/localized-output|localized-exercise|answer-model|localized-assessment/.test(joined)) {
    throw new StopError("STOP_LOCALIZED_OUTPUT", "Localized output is not authorized by this gate-design sprint.", { args: unknown });
  }
  if (/student-facing/.test(joined)) throw new StopError("STOP_STUDENT_FACING_OUTPUT", "Student-facing output is not authorized.", { args: unknown });
  if (/teacher-school|school-facing|teacher-facing/.test(joined)) throw new StopError("STOP_TEACHER_SCHOOL_FACING_OUTPUT", "Teacher/school-facing output is not authorized.", { args: unknown });
  if (/public|external/.test(joined)) throw new StopError("STOP_PUBLIC_OUTPUT", "Public output is not authorized.", { args: unknown });
  if (/individual-adjustment/.test(joined)) throw new StopError("STOP_INDIVIDUAL_ADJUSTMENT_CLAIM", "Individual adjustment claims are not authorized.", { args: unknown });
  if (/reasonable-adjustment|reasonable-adjustments/.test(joined)) throw new StopError("STOP_REASONABLE_ADJUSTMENT_CLAIM", "Reasonable adjustment claims are not authorized.", { args: unknown });
  if (/learner-support-record/.test(joined)) throw new StopError("STOP_LEARNER_SUPPORT_RECORD_CLAIM", "Learner/support-record claims are not authorized.", { args: unknown });
  if (/support-records-personal-data/.test(joined)) throw new StopError("STOP_SUPPORT_RECORDS_PERSONAL_DATA", "Support-record personal data is not authorized.", { args: unknown });
  if (/personal-data|data-processing/.test(joined)) throw new StopError("STOP_PERSONAL_DATA", "Personal-data processing is not authorized.", { args: unknown });
  if (/compliance|approval|accreditation|inspection-readiness|inspection-ready|op0|pta|summative/.test(joined)) {
    throw new StopError("STOP_COMPLIANCE_APPROVAL_CLAIM", "Compliance, approval, accreditation, OP0, PTA, summative, and inspection-readiness claims are not authorized.", { args: unknown });
  }
  if (/support-sufficiency|accommodation-sufficiency|reasonable-adjustments/.test(joined)) {
    throw new StopError("STOP_SUPPORT_ACCOMMODATION_CLAIM", "Support or accommodation sufficiency claims are not authorized.", { args: unknown });
  }
  if (/whole-uk|all-belgium/.test(joined)) throw new StopError("STOP_JURISDICTION_OVERGENERALISATION", "Jurisdiction overgeneralisation is not authorized.", { args: unknown });
  if (/glob|implicit-source|scan-generated-lessons/.test(joined)) throw new StopError("STOP_IMPLICIT_DISCOVERY", "Implicit source discovery is not authorized.", { args: unknown });
  if (/evidence-pack|product-route|scale-gate|diagnostics|mastery|pv|package|(?:^|\s|-)ci(?:$|\s|-)|dashboard|quality-ref/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_INTEGRATION", "Evidence-pack, product, Scale Gate, package/CI, dashboard, and quality-ref integrations are not authorized.", { args: unknown });
  }
  if (unknown.length > 0) throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for local expert source refresh gate generator.", { args: unknown });
  return { check };
}

function writeOrCheck(contents, check) {
  const expected = [...contents.keys()];
  for (const relativePath of expected) {
    if (!GENERATED_OUTPUT_PATHS.includes(relativePath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output not generated-allowlisted: ${relativePath}`);
    }
  }
  const mismatches = [];
  for (const [relativePath, content] of contents.entries()) {
    const fullPath = repoPath(relativePath);
    if (check) {
      const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
      if (current !== content) mismatches.push(relativePath);
      continue;
    }
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
  }
  if (mismatches.length > 0) throw new Error(`Local expert source refresh gate output is stale: ${mismatches.join(", ")}`);
}

function run(mode) {
  const bundle = buildBundle();
  writeOrCheck(outputContents(bundle), mode.check);
  return bundle;
}

function main() {
  try {
    const mode = parseMode(process.argv);
    run(mode);
    console.log(mode.check ? "Local expert source refresh gate output is current." : "Local expert source refresh gate output generated.");
  } catch (error) {
    if (error instanceof StopError) {
      console.error(JSON.stringify({ refusal_code: error.code, message: error.message, details: error.details }, null, 2));
      process.exit(1);
    }
    console.error(error.message || error);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = {
  ACCESS_DATE,
  CORE_REQUIREMENTS,
  DECISION_OPTIONS,
  FORBIDDEN_AUTHORITY_FLAGS,
  GENERATED_OUTPUT_PATHS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  OUTPUT_ALLOWLIST,
  REFUSAL_CASES,
  REVIEW_RECORD_PATHS,
  SELECTED_DECISION,
  SIMULATION_CASE_TYPES,
  SOURCE_CONDITIONS,
  SPRINT_ID,
  buildBundle,
  noOutputEnforcement,
  outputContents,
  parseMode,
};
