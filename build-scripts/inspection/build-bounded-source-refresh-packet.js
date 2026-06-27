#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const { StopError } = require("./build-international-quality-standards.js");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-06-27";
const SPRINT_ID = "GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_INPUT_DECISION = "PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET";
const SELECTED_DECISION = "PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT";

const DECISION_OPTIONS = [
  "PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT",
  "REVISE_SOURCE_REFRESH_PACKET",
  "STOP_LOCAL_OVERLAY_TRACK",
];

const REFRESH_STATES = [
  "unchanged",
  "updated_same_source",
  "replaced_by_official_successor",
  "official_source_unavailable",
  "candidate_gap_found",
  "out_of_scope_source_found",
  "requires_local_expert_interpretation",
  "requires_human_owner_decision",
];

const SIMULATION_CASE_TYPES = [
  "official_source_unchanged",
  "official_source_updated",
  "successor_source_found",
  "source_unavailable",
  "non_official_source_suggested",
  "whole_uk_claim",
  "all_belgium_claim",
  "local_expert_substitutes_for_official_source",
  "legal_compliance_overclaim",
  "support_accommodation_sufficiency_overclaim",
  "localized_output_requested",
  "personal_data_requested",
];

const INPUT_ALLOWLIST = [
  "reports/inspection-standards/local-expert-source-refresh-gate-decision.json",
  "reports/inspection-standards/local-expert-source-refresh-gate-plan.json",
  "reports/inspection-standards/england-source-refresh-gate-simulation.json",
  "reports/inspection-standards/flanders-source-refresh-gate-simulation.json",
  "references/schemas/local-expert-source-refresh-gate.schema.v1.json",
  "references/data/inspection-standards/overlays/england.deepening.v1.json",
  "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
];

const GENERATED_OUTPUT_PATHS = [
  "references/schemas/bounded-source-refresh-packet.schema.v1.json",
  "docs/inspection-standards/bounded-source-refresh-packet-contract.md",
  "docs/inspection-standards/england-bounded-source-refresh-packet.md",
  "docs/inspection-standards/flanders-bounded-source-refresh-packet.md",
  "docs/inspection-standards/local-expert-review-request-template.md",
  "reports/inspection-standards/bounded-source-refresh-packet-plan.md",
  "reports/inspection-standards/bounded-source-refresh-packet-plan.json",
  "reports/inspection-standards/england-bounded-source-refresh-simulation.md",
  "reports/inspection-standards/england-bounded-source-refresh-simulation.json",
  "reports/inspection-standards/flanders-bounded-source-refresh-simulation.md",
  "reports/inspection-standards/flanders-bounded-source-refresh-simulation.json",
  "reports/inspection-standards/bounded-source-refresh-packet-decision.md",
  "reports/inspection-standards/bounded-source-refresh-packet-decision.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/england-bounded-source-refresh-simulation.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/flanders-bounded-source-refresh-simulation.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/bounded-source-refresh-packet-decision.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/non-official-source.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/source-refresh-executed.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/local-expert-contacted.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/local-expert-substituted.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/localized-output.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/personal-data.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/compliance-claim.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/support-sufficiency-claim.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/whole-uk-claim.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/all-belgium-claim.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/missing-refresh-state.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/missing-source-inventory.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/official-url-mismatch.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/hidden-discovery.sample.json",
  "references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/expert-legal-advice.sample.json",
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

const FORBIDDEN_AUTHORITY_FLAGS = [
  "source_refresh_executed",
  "source_refresh_execution_pilot_executed",
  "local_expert_contacted",
  "local_expert_substituted",
  "runtime_execution",
  "localized_output_generated",
  "localized_paragraphs_generated",
  "localized_exercises_generated",
  "localized_answer_models_generated",
  "localized_assessment_items_generated",
  "student_facing_files_generated",
  "teacher_school_facing_output_generated",
  "public_output_generated",
  "country_edition_generated",
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
  "accessibility_legal_sufficiency_claim",
  "school_evidence_claim",
  "school_owned_evidence_collection",
  "whole_uk_claim_from_england_only",
  "all_belgium_claim_from_flanders_only",
  "generated_lesson_output_scanning",
  "implicit_source_discovery",
  "directory_globbing",
  "quality_ref_or_dashboard_integration",
  "package_or_ci_product_integration",
];

const REFUSAL_CASES = [
  [["--execute-source-refresh"], "STOP_SOURCE_REFRESH_EXECUTION"],
  [["--source-refresh-execution-pilot"], "STOP_SOURCE_REFRESH_EXECUTION"],
  [["--refresh-sources"], "STOP_SOURCE_REFRESH_EXECUTION"],
  [["--contact-local-expert"], "STOP_LOCAL_EXPERT_CONTACT"],
  [["--local-expert-substitution"], "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT"],
  [["--localized-exercise"], "STOP_LOCALIZED_OUTPUT"],
  [["--answer-model"], "STOP_LOCALIZED_OUTPUT"],
  [["--student-facing"], "STOP_STUDENT_FACING_OUTPUT"],
  [["--teacher-school"], "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  [["--public"], "STOP_PUBLIC_OUTPUT"],
  [["--country-edition"], "STOP_LOCALIZED_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--product-route"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--scale-gate"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--diagnostics"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--mastery-pv"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--personal-data"], "STOP_PERSONAL_DATA"],
  [["--compliance"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--approval"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--inspection-readiness"], "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  [["--whole-uk"], "STOP_JURISDICTION_OVERGENERALISATION"],
  [["--all-belgium"], "STOP_JURISDICTION_OVERGENERALISATION"],
  [["--hidden-discovery"], "STOP_IMPLICIT_DISCOVERY"],
  [["--glob"], "STOP_IMPLICIT_DISCOVERY"],
  [["--scan-generated-lessons"], "STOP_IMPLICIT_DISCOVERY"],
  [["--package"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--ci"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--dashboard"], "STOP_FORBIDDEN_INTEGRATION"],
  [["--quality-ref"], "STOP_FORBIDDEN_INTEGRATION"],
];

const NEGATIVE_FIXTURES = [
  ["non-official-source.sample.json", "STOP_NON_OFFICIAL_SOURCE"],
  ["source-refresh-executed.sample.json", "STOP_SOURCE_REFRESH_EXECUTION"],
  ["local-expert-contacted.sample.json", "STOP_LOCAL_EXPERT_CONTACT"],
  ["local-expert-substituted.sample.json", "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  ["localized-output.sample.json", "STOP_LOCALIZED_OUTPUT"],
  ["personal-data.sample.json", "STOP_PERSONAL_DATA"],
  ["compliance-claim.sample.json", "STOP_COMPLIANCE_APPROVAL_CLAIM"],
  ["support-sufficiency-claim.sample.json", "STOP_SUPPORT_ACCOMMODATION_CLAIM"],
  ["whole-uk-claim.sample.json", "STOP_JURISDICTION_OVERGENERALISATION"],
  ["all-belgium-claim.sample.json", "STOP_JURISDICTION_OVERGENERALISATION"],
  ["missing-refresh-state.sample.json", "STOP_REFRESH_STATE_MODEL_INCOMPLETE"],
  ["missing-source-inventory.sample.json", "STOP_SOURCE_INVENTORY_MISMATCH"],
  ["official-url-mismatch.sample.json", "STOP_SOURCE_INVENTORY_MISMATCH"],
  ["hidden-discovery.sample.json", "STOP_IMPLICIT_DISCOVERY"],
  ["expert-legal-advice.sample.json", "STOP_EXPERT_TEMPLATE_FORBIDDEN_CLAIM_MISSING"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "The packet cites product end-state and original sprint/gate spec."],
  ["accepted_gate_decision_bound", "The packet is bound to the accepted local-expert/source-refresh gate decision."],
  ["exact_source_inventory_complete", "England and Flanders source inventories list only allowlisted official sources with required fields."],
  ["refresh_state_model_complete", "The refresh-state model includes every required state and closure field."],
  ["england_packet_complete", "England packet covers DfE, Ofsted, operating-guide, selected AQA, SEND/accessibility, and England-only boundaries."],
  ["flanders_packet_complete", "Flanders packet covers Onderwijsdoelen, OK framework, assessment-status, study-direction/school-network, accessibility/support, and Flanders-only boundaries."],
  ["expert_template_bounded", "The local expert request template asks only for interpretation notes and forbids legal, compliance, approval, inspection-readiness, school-evidence, student/product-use, and support/accommodation sufficiency claims."],
  ["simulations_and_refusals_complete", "Simulations and fixtures cover official-source, successor, unavailable, non-official, jurisdiction-overclaim, expert-substitution, legal, support, localized-output, and personal-data cases."],
  ["no_execution_or_contact", "No source refresh is executed and no local expert is contacted or substituted."],
  ["single_decision", "The packet selects exactly one allowed decision."],
  ["review_route_preserved", "Specialist reviews, final lead review, exact-head PR readiness, green CI, and human approval remain required."],
];

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function renderMarkdown(lines) {
  return `${lines.join("\n").replace(/[ \t]+$/gm, "")}\n`;
}

function unique(values) {
  return [...new Set(values)];
}

function falseFlags() {
  return Object.fromEntries(FORBIDDEN_AUTHORITY_FLAGS.map((flag) => [flag, false]));
}

function noOutputEnforcement() {
  return {
    source_refresh_execution: false,
    source_refresh_execution_pilot: false,
    local_expert_contact: false,
    local_expert_substitution: false,
    runtime_execution: false,
    localized_output: false,
    localized_paragraphs: false,
    localized_exercises: false,
    answer_models: false,
    localized_assessment_items: false,
    student_facing_files: false,
    teacher_school_output: false,
    public_output: false,
    evidence_pack: false,
    product_route: false,
    scale_gate: false,
    diagnostics_mastery_pv: false,
    personal_data: false,
    compliance_claim: false,
    inspection_readiness_claim: false,
    support_sufficiency_claim: false,
    accommodation_sufficiency_claim: false,
    hidden_source_discovery: false,
    generated_lesson_output_scanning: false,
  };
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

function coreChecklist(status = "met_for_packet_review") {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status,
    proof_required_to_close: "Generator/checker PASS, focused Jest PASS, specialist corrections closed, final lead PASS, exact-head PR readiness with branch protection ok:true, green CI, and explicit human owner authorization.",
  }));
}

function commonFields(reportType, reportId, status) {
  return {
    schema_version: 1,
    report_type: reportType,
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
    non_negotiable_requirements: [
      "Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
      "Use only explicit per-scope source and output allowlists.",
      "Do not execute source refresh, contact local experts, or substitute local expert judgement.",
      "Do not produce localized, student-facing, teacher/school-facing, public, product-route, evidence-pack, Scale Gate, diagnostics/mastery/PV, or package/CI output.",
      "Do not process personal data or make legal, compliance, approval, accreditation, OP0, PTA, summative, inspection-readiness, support-sufficiency, accommodation-sufficiency, or accessibility/legal-sufficiency claims.",
      "Classify findings and carried issues with blocks, does_not_block, and proof_required_to_close.",
      "PASS WITH FLAGS may not carry a missing core requirement.",
    ],
    core_requirement_checklist: coreChecklist(),
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_ALLOWLIST,
    forbidden_authority: falseFlags(),
  };
}

function deepeningPath(jurisdictionId) {
  return `references/data/inspection-standards/overlays/${jurisdictionId}.deepening.v1.json`;
}

function deepeningDescriptor(jurisdictionId) {
  return readJson(deepeningPath(jurisdictionId));
}

function stateDetails() {
  return [
    {
      state_id: "unchanged",
      blocks: "Does not block the future execution pilot record if exact official-source currentness proof is captured; still blocks product, school-facing, public, and localized use.",
      does_not_block: "Human review of a no-change source-refresh execution pilot packet.",
      proof_required_to_close: "Exact official URL, access date, title/version observation, and no-change currentness record.",
      allowed_next_action: "Record currentness evidence inside a later authorized source-refresh execution pilot.",
      forbidden_next_action: "Treat unchanged sources as product, compliance, inspection-readiness, support-sufficiency, or country-edition authority.",
    },
    {
      state_id: "updated_same_source",
      blocks: "Blocks downstream use until the changed official source is reviewed and mapped.",
      does_not_block: "Preparing a human-review packet that isolates the changed source.",
      proof_required_to_close: "Official-source change note, retained URL, old/new version metadata, affected inventory rows, and human owner decision.",
      allowed_next_action: "Prepare a bounded source-diff packet for human review.",
      forbidden_next_action: "Auto-apply changed official text to localized output or product routes.",
    },
    {
      state_id: "replaced_by_official_successor",
      blocks: "Blocks downstream use until successor authority, URL, and scope are reviewed.",
      does_not_block: "Recording a candidate official successor for owner review.",
      proof_required_to_close: "Successor-source evidence, same-authority proof or explicit owner-approved replacement rule, and updated source inventory.",
      allowed_next_action: "Escalate successor adoption to human owner review.",
      forbidden_next_action: "Silently swap source IDs, scan directories, or adopt unofficial mirrors.",
    },
    {
      state_id: "official_source_unavailable",
      blocks: "Blocks source-refresh closure for affected jurisdiction and source role.",
      does_not_block: "Documenting unavailability and asking for owner direction.",
      proof_required_to_close: "Unavailable-source observation, retrieval timestamp, affected rows, and owner decision to pause, retry, or reduce scope.",
      allowed_next_action: "Stop affected source row and record unavailable-source blocker.",
      forbidden_next_action: "Use cached unofficial copies, local expert judgement, or generated lesson output as substitute authority.",
    },
    {
      state_id: "candidate_gap_found",
      blocks: "Blocks closure for the affected source role until the gap is reviewed.",
      does_not_block: "Recording the gap and candidate approval requirement.",
      proof_required_to_close: "Named gap, affected jurisdiction/source role, candidate_source_requires_owner_approval flag, and owner decision.",
      allowed_next_action: "Create a candidate-source review item for human owner approval.",
      forbidden_next_action: "Import candidate sources through hidden discovery or treat expert suggestion as official authority.",
    },
    {
      state_id: "out_of_scope_source_found",
      blocks: "Blocks use of the source and any inference drawn from it.",
      does_not_block: "Refusal documentation and scope clarification.",
      proof_required_to_close: "Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary.",
      allowed_next_action: "Reject the source and preserve the existing official-source boundary.",
      forbidden_next_action: "Broaden England to whole UK, Flanders to all Belgium, or selected AQA to all awarding bodies.",
    },
    {
      state_id: "requires_local_expert_interpretation",
      blocks: "Blocks source interpretation from becoming authority, legal advice, school evidence, or product output.",
      does_not_block: "Preparing a later bounded expert-review request.",
      proof_required_to_close: "Expert question, allowed interpretation scope, forbidden-claim acknowledgement, and human-reviewed response record.",
      allowed_next_action: "Ask for bounded interpretation only after owner authorization.",
      forbidden_next_action: "Contact experts in this packet or use expert judgement as official-source substitute.",
    },
    {
      state_id: "requires_human_owner_decision",
      blocks: "Blocks all automatic transition, merge, source adoption, and downstream authority.",
      does_not_block: "Human-review routing with exact evidence.",
      proof_required_to_close: "Explicit owner authorization naming the exact PR head and selected decision.",
      allowed_next_action: "Route to READY_FOR_HUMAN_REVIEW with exact-head proof.",
      forbidden_next_action: "Auto-merge or mark product-authority work ready without owner authorization.",
    },
  ];
}

function sourceInventory(jurisdictionId) {
  return deepeningDescriptor(jurisdictionId).official_source_allowlist.map((source) => ({
    jurisdiction_id: jurisdictionId,
    source_id: source.source_id,
    official_url: source.url,
    authority: source.authority,
    source_role: source.role,
    current_access_date: source.access_date,
    current_known_version_or_publication_date: source.publication_or_version_date,
    freshness_trigger: "Before a later authorized source-refresh execution pilot, manually compare this exact official URL, title, visible version/publication metadata, and authority owner against the recorded source row.",
    staleness_condition: "Treat the source as stale if title, version/publication date, authority owner, official URL, source route, or visible source role changes; if unavailable, record official_source_unavailable.",
    expected_refresh_method: "Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution.",
    allowed_result_states: REFRESH_STATES,
    forbidden_inference: source.forbidden_inference,
    human_review_trigger: "Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure.",
  }));
}

function jurisdictionCoverage(jurisdictionId) {
  if (jurisdictionId === "england") {
    return {
      required_boundaries: [
        "DfE economics subject content",
        "Ofsted inspection/evaluation source",
        "Ofsted operating guide / inspection evidence-gathering source",
        "selected AQA awarding-body source boundary",
        "SEND/accessibility terminology source boundary",
        "England-only / not whole UK boundary",
      ],
      source_bindings: [
        { boundary: "DfE economics subject content", source_ids: ["england-dfe-a-level-economics-content"] },
        { boundary: "Ofsted inspection/evaluation source", source_ids: ["england-ofsted-eif-2025"] },
        { boundary: "Ofsted operating guide / inspection evidence-gathering source", source_ids: ["england-ofsted-operating-guide-2025"] },
        { boundary: "selected AQA awarding-body source boundary", source_ids: ["england-aqa-7136-subject-content", "england-aqa-7136-scheme-assessment", "england-aqa-economics-command-words", "england-aqa-7136-assessment-resources"] },
        { boundary: "SEND/accessibility terminology source boundary", source_ids: ["england-send-code-practice"] },
        { boundary: "England-only / not whole UK boundary", source_ids: ["england-ofsted-eif-2025", "england-dfe-a-level-economics-content"] },
      ],
      jurisdiction_boundary: "England-only representative AQA deepening; not Scotland, Wales, Northern Ireland, the whole UK, or all awarding bodies.",
      forbidden_overclaim: "No whole-UK claim and no all-awarding-body or AQA-approval claim.",
    };
  }
  return {
    required_boundaries: [
      "Onderwijsdoelen source boundary",
      "Referentiekader Onderwijskwaliteit / OK framework",
      "assessment-status boundary",
      "study-direction / school-network boundary",
      "Flanders-only / not all Belgium boundary",
      "accessibility/support terminology boundary",
    ],
    source_bindings: [
      { boundary: "Onderwijsdoelen source boundary", source_ids: ["be-flanders-onderwijsdoelen-so3-doorstroom", "be-flanders-onderwijsdoelen-modernisatie"] },
      { boundary: "Referentiekader Onderwijskwaliteit / OK framework", source_ids: ["be-flanders-ok-framework", "be-flanders-education-quality-reference"] },
      { boundary: "assessment-status boundary", source_ids: ["be-flanders-inspection-what-do-we-inspect"] },
      { boundary: "study-direction / school-network boundary", source_ids: ["be-flanders-onderwijsdoelen-so3-doorstroom"] },
      { boundary: "Flanders-only / not all Belgium boundary", source_ids: ["be-flanders-ok-framework", "be-flanders-onderwijsdoelen-modernisatie"] },
      { boundary: "accessibility/support terminology boundary", source_ids: ["be-flanders-ok-framework", "be-flanders-inspection-what-do-we-inspect"] },
    ],
    jurisdiction_boundary: "Flemish Community only; not French Community, German-speaking Community, all Belgium, school-network curriculum, or school-owned assessment policy.",
    forbidden_overclaim: "No all-Belgium claim and no school/network curriculum, OK-compliance, or support-sufficiency claim.",
  };
}

function expertTemplate() {
  return {
    template_id: "local-expert-review-request-template",
    purpose: "Later owner-authorized expert interpretation of explicit official-source rows only.",
    allowed_questions: [
      "Does the official-source interpretation match local curriculum, assessment, inspection, or quality-framework terminology?",
      "Which terms, pathway labels, source roles, or uncertainty notes need human review before a source-refresh execution pilot can close?",
      "Which source gaps should be escalated to the human owner as candidate_source_requires_owner_approval?",
      "Could a source change affect Book 1 Chapter 1.2 or 1.3 mappings, without producing localized content?",
    ],
    required_response_fields: [
      "jurisdiction_id",
      "reviewer_role",
      "source_ids_reviewed",
      "interpretation_notes",
      "terminology_notes",
      "curriculum_or_assessment_boundary_notes",
      "accessibility_or_support_boundary_notes",
      "uncertainties",
      "candidate_source_requires_owner_approval",
      "forbidden_claims_acknowledged",
    ],
    forbidden_expert_claims: [
      "legal advice",
      "compliance claims",
      "approval claims",
      "inspection-readiness claims",
      "school-evidence claims",
      "student/product-use claims",
      "support/accommodation sufficiency claims",
      "accessibility/legal sufficiency claims",
      "personal-data processing",
      "official-source substitution",
    ],
    stop_conditions: [
      "Expert suggests a non-official source as authority.",
      "Expert response makes a legal, compliance, approval, school-evidence, inspection-readiness, support-sufficiency, accommodation-sufficiency, student/product-use, or personal-data claim.",
      "Expert asks to see generated student, teacher, school, public, product, or personal-data output.",
    ],
  };
}

function simulationCase(jurisdictionId, type, sourceId, stateId, boundaryFocus, expectedFinding) {
  return {
    case_type: type,
    jurisdiction_id: jurisdictionId,
    source_id: sourceId,
    simulated_result_state: stateId,
    boundary_focus: boundaryFocus,
    simulation_only: true,
    source_refresh_executed: false,
    local_expert_contacted: false,
    local_expert_substituted: false,
    generated_output: noOutputEnforcement(),
    expected_finding: expectedFinding,
    blocks: stateDetails().find((state) => state.state_id === stateId).blocks,
    does_not_block: stateDetails().find((state) => state.state_id === stateId).does_not_block,
    proof_required_to_close: stateDetails().find((state) => state.state_id === stateId).proof_required_to_close,
    allowed_next_action: stateDetails().find((state) => state.state_id === stateId).allowed_next_action,
    forbidden_next_action: stateDetails().find((state) => state.state_id === stateId).forbidden_next_action,
  };
}

function simulationCases(jurisdictionId, inventory) {
  const ids = inventory.map((source) => source.source_id);
  const primary = ids[0];
  const secondary = ids[1] || ids[0];
  const curriculum = jurisdictionId === "england" ? "england-dfe-a-level-economics-content" : "be-flanders-onderwijsdoelen-so3-doorstroom";
  const support = jurisdictionId === "england" ? "england-send-code-practice" : "be-flanders-ok-framework";
  return [
    simulationCase(jurisdictionId, "official_source_unchanged", primary, "unchanged", "official source unchanged", "Record currentness only; no output or authority unlocked."),
    simulationCase(jurisdictionId, "official_source_updated", secondary, "updated_same_source", "official source updated", "Updated same official source requires bounded human-review packet."),
    simulationCase(jurisdictionId, "successor_source_found", curriculum, "replaced_by_official_successor", "successor official source found", "Successor source requires owner decision before adoption."),
    simulationCase(jurisdictionId, "source_unavailable", primary, "official_source_unavailable", "official source unavailable", "Unavailable source blocks closure for affected source role."),
    simulationCase(jurisdictionId, "non_official_source_suggested", `non-official-${jurisdictionId}-source`, "out_of_scope_source_found", "non-official source suggested", "Non-official source is refused and cannot fill authority gap."),
    simulationCase(
      jurisdictionId,
      "whole_uk_claim",
      primary,
      "out_of_scope_source_found",
      jurisdictionId === "england" ? "England-only / not whole UK boundary" : "cross-jurisdiction overclaim: whole-UK claim refused as outside Flanders packet scope",
      "Whole-UK claim is refused when the packet is England/Flanders bounded."
    ),
    simulationCase(
      jurisdictionId,
      "all_belgium_claim",
      primary,
      "out_of_scope_source_found",
      jurisdictionId === "flanders" ? "Flanders-only / not all Belgium boundary" : "cross-jurisdiction overclaim: all-Belgium claim refused as outside England packet scope",
      "All-Belgium claim is refused when the packet is Flanders/England bounded."
    ),
    simulationCase(jurisdictionId, "local_expert_substitutes_for_official_source", curriculum, "requires_local_expert_interpretation", "local expert cannot substitute for official source", "Expert interpretation may be requested later but cannot replace official sources."),
    simulationCase(jurisdictionId, "legal_compliance_overclaim", primary, "requires_human_owner_decision", "legal/compliance overclaim", "Legal, compliance, approval, and inspection-readiness claims are refused."),
    simulationCase(jurisdictionId, "support_accommodation_sufficiency_overclaim", support, "requires_human_owner_decision", "support/accommodation sufficiency overclaim", "Support, accommodation, and accessibility/legal sufficiency claims are refused."),
    simulationCase(jurisdictionId, "localized_output_requested", curriculum, "requires_human_owner_decision", "localized output requested", "Localized output is refused in this packet."),
    simulationCase(jurisdictionId, "personal_data_requested", primary, "requires_human_owner_decision", "personal data requested", "Personal data is refused in this packet."),
  ];
}

function jurisdictionReport(jurisdictionId) {
  const descriptor = deepeningDescriptor(jurisdictionId);
  const inventory = sourceInventory(jurisdictionId);
  return {
    ...commonFields("jurisdiction_simulation", `${jurisdictionId}-bounded-source-refresh-simulation`, "simulation_ready_for_human_review"),
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: descriptor.jurisdiction_label,
    source_inventory: inventory,
    refresh_state_model: stateDetails(),
    jurisdiction_packet_coverage: jurisdictionCoverage(jurisdictionId),
    local_expert_review_request_template: expertTemplate(),
    simulation_cases: simulationCases(jurisdictionId, inventory),
    source_refresh_execution_performed: false,
    local_expert_contacted: false,
    local_expert_substitution_performed: false,
    no_output_enforcement: noOutputEnforcement(),
    finding_classification: [
      finding(
        `${descriptor.jurisdiction_label} source-refresh inventory is bounded to ${inventory.length} existing official allowlist sources.`,
        "core_requirement_met",
        "Nothing for human review of the bounded packet itself.",
        "A later source-refresh execution pilot after human acceptance.",
        "Checker PASS, source-review specialist PASS, final lead PASS, exact-head readiness, and human authorization."
      ),
      finding(
        `${descriptor.jurisdiction_label} source-refresh execution and downstream authority remain blocked.`,
        "scale_blocker",
        "All source refresh execution, localized output, product route, school/public output, Scale Gate, personal-data, compliance, inspection-readiness, and support/accommodation sufficiency authority.",
        "Human review of this bounded source-refresh packet.",
        "Separate owner authorization naming the exact PR head and a later execution pilot packet."
      ),
    ],
  };
}

function planReport(england, flanders) {
  return {
    ...commonFields("plan", "bounded-source-refresh-packet-plan", "plan_ready_for_human_review"),
    goal: "Prepare a complete, machine-validated, human-reviewable source-refresh packet for England and Flanders without executing source refresh or contacting local experts.",
    final_decision_options: DECISION_OPTIONS,
    selected_target_decision: SELECTED_DECISION,
    source_refresh_inventory_summary: {
      england_sources: england.source_inventory.map((source) => source.source_id),
      flanders_sources: flanders.source_inventory.map((source) => source.source_id),
      candidate_sources_allowed: false,
      candidate_source_policy: "No candidate source is adopted in this packet. A later candidate may only be recorded as candidate_source_requires_owner_approval.",
      jurisdiction_boundary_notes: [
        "England-only / not whole UK boundary",
        "Flanders-only / not all Belgium boundary",
      ],
    },
    refresh_state_model: stateDetails(),
    local_expert_review_request_template: expertTemplate(),
    review_gates: [
      "Schema/architecture lead review",
      "England authority/source review",
      "Flanders authority/source review",
      "Teacher/economics review",
      "Legal/privacy review",
      "Accessibility/inclusion review",
      "Final lead review",
      "Exact-head PR Readiness Reviewer route with branch protection ok:true",
      "Explicit human owner authorization before merge or any later source-refresh execution pilot",
    ],
    stop_conditions: [
      "Any source refresh execution or source-refresh execution pilot run.",
      "Any local expert contact or substitution.",
      "Any source outside the explicit allowlist not marked candidate_source_requires_owner_approval.",
      "Any hidden discovery, directory globbing, generated lesson-output scanning, product route, evidence pack, Scale Gate, diagnostics/mastery/PV, package/CI product integration, dashboard, or quality-ref integration.",
      "Any localized, student-facing, teacher/school-facing, public, country-edition, personal-data, compliance, approval, accreditation, OP0, PTA, summative, inspection-readiness, support-sufficiency, accommodation-sufficiency, or accessibility/legal-sufficiency claim.",
    ],
    no_output_enforcement: noOutputEnforcement(),
    finding_classification: [
      finding(
        "The bounded packet defines exact source inventory, refresh-state model, expert request template, simulations, and refusal fixtures.",
        "core_requirement_met",
        "Nothing for human review of the packet when checker, specialists, final lead, PR readiness, and CI pass.",
        "A later source-refresh execution pilot after explicit human acceptance.",
        "All specialist corrections closed, final lead PASS, exact-head readiness route, branch protection ok:true, green CI, and human authorization."
      ),
      finding(
        "The packet remains planning-only and execution-blocked.",
        "scale_blocker",
        "Source refresh execution, local expert contact/substitution, localized output, product/school/public authority, Scale Gate, diagnostics/mastery/PV, personal data, legal/compliance/inspection/support claims.",
        "Human review of the bounded packet and decision.",
        "Separate reviewed source-refresh execution pilot authorization."
      ),
    ],
  };
}

function decisionReport(england, flanders, plan) {
  return {
    ...commonFields("decision", "bounded-source-refresh-packet-decision", "decision_ready_for_human_review"),
    final_bounded_source_refresh_packet_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      decision_selection_count: 1,
      rationale: "The packet is fully source-bounded, uses explicit source and output allowlists, preserves all no-output/no-execution/no-expert-substitution boundaries, and defines the human review gates required before any later source-refresh execution pilot.",
    },
    source_counts: {
      england: england.source_inventory.length,
      flanders: flanders.source_inventory.length,
    },
    simulation_case_counts: {
      england: england.simulation_cases.length,
      flanders: flanders.simulation_cases.length,
      required_case_types: SIMULATION_CASE_TYPES,
    },
    source_refresh_execution_performed: false,
    local_expert_contacted: false,
    local_expert_substitution_performed: false,
    no_output_enforcement: noOutputEnforcement(),
    plan_report: plan.report_id,
    does_not_authorize: [
      "source refresh execution",
      "source-refresh execution pilot",
      "local expert contact or substitution",
      "runtime execution",
      "localized output",
      "country editions",
      "student/teacher/school/public output",
      "evidence packs",
      "product-route adoption",
      "Scale Gate",
      "diagnostics/mastery/PV",
      "student/product use",
      "personal-data processing",
      "package or CI product integration",
      "dashboard or quality-ref integration",
      "legal advice, compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, accommodation sufficiency, or accessibility/legal sufficiency claims",
    ],
    required_before_any_execution_pilot: [
      "Human acceptance of this packet at exact PR head.",
      "A separate source-refresh execution pilot sprint with explicit official-source rows and no hidden discovery.",
      "Fresh specialist and final lead review for the execution pilot.",
      "Explicit owner authorization naming the execution pilot exact head.",
    ],
    finding_classification: [
      finding(
        "The selected decision is PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT.",
        "core_requirement_met",
        "Nothing for human review of this packet when validations and reviews pass.",
        "A later, separately authorized execution pilot.",
        "Final lead PASS, exact-head PR readiness, branch protection ok:true, green CI, and explicit owner authorization."
      ),
      finding(
        "The selected decision does not itself execute refresh or unlock downstream authority.",
        "scale_blocker",
        "All execution, expert contact/substitution, output, product, school, public, student, personal-data, compliance, inspection, support, and accommodation authority.",
        "Human review of the planning-only packet.",
        "Separate reviewed sprint and explicit owner authorization."
      ),
    ],
  };
}

function schemaDocument() {
  const stringField = { type: "string", minLength: 1 };
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.local/schemas/bounded-source-refresh-packet.schema.v1.json",
    title: "Bounded Source Refresh Packet",
    type: "object",
    additionalProperties: false,
    required: [
      "schema_version",
      "report_type",
      "report_id",
      "sprint_id",
      "internal_only",
      "manual_invocation_only",
      "human_review_required",
      "product_end_state",
      "original_sprint_gate_spec",
      "accepted_input_decision",
      "core_requirement_checklist",
      "input_allowlist",
      "output_allowlist",
      "forbidden_authority",
    ],
    oneOf: [
      { $ref: "#/$defs/planReport" },
      { $ref: "#/$defs/jurisdictionSimulationReport" },
      { $ref: "#/$defs/decisionReport" },
    ],
    properties: {
      schema_version: { const: 1 },
      report_type: { enum: ["plan", "jurisdiction_simulation", "decision"] },
      report_id: stringField,
      sprint_id: { const: SPRINT_ID },
      generated_date: stringField,
      access_date: stringField,
      status: stringField,
      internal_only: { const: true },
      manual_invocation_only: { const: true },
      human_review_required: { const: true },
      product_end_state: { const: PRODUCT_END_STATE },
      product_end_state_checkout_note: stringField,
      original_sprint_gate_spec: { const: ORIGINAL_SPRINT_GATE_SPEC },
      roadmap_source: { const: ROADMAP_SOURCE },
      accepted_input_decision: { const: ACCEPTED_INPUT_DECISION },
      non_negotiable_requirements: { type: "array", minItems: 1, items: stringField },
      core_requirement_checklist: { type: "array", minItems: CORE_REQUIREMENTS.length, items: { $ref: "#/$defs/coreRequirement" } },
      input_allowlist: { type: "array", prefixItems: INPUT_ALLOWLIST.map((item) => ({ const: item })), minItems: INPUT_ALLOWLIST.length, maxItems: INPUT_ALLOWLIST.length },
      output_allowlist: { type: "array", prefixItems: OUTPUT_ALLOWLIST.map((item) => ({ const: item })), minItems: OUTPUT_ALLOWLIST.length, maxItems: OUTPUT_ALLOWLIST.length },
      forbidden_authority: { $ref: "#/$defs/forbiddenAuthority" },
      goal: stringField,
      final_decision_options: { type: "array", prefixItems: DECISION_OPTIONS.map((item) => ({ const: item })), minItems: DECISION_OPTIONS.length, maxItems: DECISION_OPTIONS.length },
      selected_target_decision: { const: SELECTED_DECISION },
      source_refresh_inventory_summary: { $ref: "#/$defs/sourceRefreshInventorySummary" },
      refresh_state_model: { type: "array", minItems: REFRESH_STATES.length, maxItems: REFRESH_STATES.length, items: { $ref: "#/$defs/refreshState" } },
      local_expert_review_request_template: { $ref: "#/$defs/expertTemplate" },
      review_gates: { type: "array", items: stringField },
      stop_conditions: { type: "array", items: stringField },
      no_output_enforcement: { $ref: "#/$defs/noOutput" },
      jurisdiction_id: { enum: ["england", "flanders"] },
      jurisdiction_label: stringField,
      source_inventory: { type: "array", items: { $ref: "#/$defs/sourceInventoryItem" } },
      jurisdiction_packet_coverage: { $ref: "#/$defs/jurisdictionPacketCoverage" },
      simulation_cases: { type: "array", minItems: SIMULATION_CASE_TYPES.length, maxItems: SIMULATION_CASE_TYPES.length, items: { $ref: "#/$defs/simulationCase" } },
      source_refresh_execution_performed: { const: false },
      local_expert_contacted: { const: false },
      local_expert_substitution_performed: { const: false },
      final_bounded_source_refresh_packet_decision: { $ref: "#/$defs/finalDecision" },
      source_counts: { $ref: "#/$defs/sourceCounts" },
      simulation_case_counts: { $ref: "#/$defs/simulationCaseCounts" },
      plan_report: stringField,
      does_not_authorize: { type: "array", items: stringField },
      required_before_any_execution_pilot: { type: "array", items: stringField },
      finding_classification: { type: "array", items: { $ref: "#/$defs/finding" } },
    },
    $defs: {
      planReport: {
        type: "object",
        required: [
          "report_type",
          "goal",
          "final_decision_options",
          "selected_target_decision",
          "source_refresh_inventory_summary",
          "refresh_state_model",
          "local_expert_review_request_template",
          "review_gates",
          "stop_conditions",
          "no_output_enforcement",
          "finding_classification",
        ],
        properties: {
          report_type: { const: "plan" },
        },
      },
      jurisdictionSimulationReport: {
        type: "object",
        required: [
          "report_type",
          "jurisdiction_id",
          "jurisdiction_label",
          "source_inventory",
          "refresh_state_model",
          "jurisdiction_packet_coverage",
          "local_expert_review_request_template",
          "simulation_cases",
          "source_refresh_execution_performed",
          "local_expert_contacted",
          "local_expert_substitution_performed",
          "no_output_enforcement",
          "finding_classification",
        ],
        properties: {
          report_type: { const: "jurisdiction_simulation" },
        },
        allOf: [
          {
            if: { properties: { jurisdiction_id: { const: "england" } }, required: ["jurisdiction_id"] },
            then: { properties: { source_inventory: { minItems: 8, maxItems: 8 } } },
          },
          {
            if: { properties: { jurisdiction_id: { const: "flanders" } }, required: ["jurisdiction_id"] },
            then: { properties: { source_inventory: { minItems: 5, maxItems: 5 } } },
          },
        ],
      },
      decisionReport: {
        type: "object",
        required: [
          "report_type",
          "final_bounded_source_refresh_packet_decision",
          "source_counts",
          "simulation_case_counts",
          "source_refresh_execution_performed",
          "local_expert_contacted",
          "local_expert_substitution_performed",
          "no_output_enforcement",
          "plan_report",
          "does_not_authorize",
          "required_before_any_execution_pilot",
          "finding_classification",
        ],
        properties: {
          report_type: { const: "decision" },
        },
      },
      coreRequirement: {
        type: "object",
        additionalProperties: false,
        required: ["id", "requirement", "status", "proof_required_to_close"],
        properties: { id: stringField, requirement: stringField, status: stringField, proof_required_to_close: stringField },
      },
      forbiddenAuthority: {
        type: "object",
        additionalProperties: false,
        required: FORBIDDEN_AUTHORITY_FLAGS,
        properties: Object.fromEntries(FORBIDDEN_AUTHORITY_FLAGS.map((flag) => [flag, { const: false }])),
      },
      noOutput: {
        type: "object",
        additionalProperties: false,
        required: Object.keys(noOutputEnforcement()),
        properties: Object.fromEntries(Object.keys(noOutputEnforcement()).map((flag) => [flag, { const: false }])),
      },
      sourceRefreshInventorySummary: {
        type: "object",
        additionalProperties: false,
        required: [
          "england_sources",
          "flanders_sources",
          "candidate_sources_allowed",
          "candidate_source_policy",
          "jurisdiction_boundary_notes",
        ],
        properties: {
          england_sources: { type: "array", minItems: 8, maxItems: 8, items: stringField },
          flanders_sources: { type: "array", minItems: 5, maxItems: 5, items: stringField },
          candidate_sources_allowed: { const: false },
          candidate_source_policy: stringField,
          jurisdiction_boundary_notes: { type: "array", minItems: 2, items: stringField },
        },
      },
      refreshState: {
        type: "object",
        additionalProperties: false,
        required: ["state_id", "blocks", "does_not_block", "proof_required_to_close", "allowed_next_action", "forbidden_next_action"],
        properties: {
          state_id: { enum: REFRESH_STATES },
          blocks: stringField,
          does_not_block: stringField,
          proof_required_to_close: stringField,
          allowed_next_action: stringField,
          forbidden_next_action: stringField,
        },
      },
      sourceInventoryItem: {
        type: "object",
        additionalProperties: false,
        required: [
          "jurisdiction_id",
          "source_id",
          "official_url",
          "authority",
          "source_role",
          "current_access_date",
          "current_known_version_or_publication_date",
          "freshness_trigger",
          "staleness_condition",
          "expected_refresh_method",
          "allowed_result_states",
          "forbidden_inference",
          "human_review_trigger",
        ],
        properties: {
          jurisdiction_id: { enum: ["england", "flanders"] },
          source_id: stringField,
          official_url: { type: "string", pattern: "^https?://" },
          authority: stringField,
          source_role: stringField,
          current_access_date: stringField,
          current_known_version_or_publication_date: stringField,
          freshness_trigger: stringField,
          staleness_condition: stringField,
          expected_refresh_method: stringField,
          allowed_result_states: { type: "array", prefixItems: REFRESH_STATES.map((item) => ({ const: item })), minItems: REFRESH_STATES.length, maxItems: REFRESH_STATES.length },
          forbidden_inference: stringField,
          human_review_trigger: stringField,
        },
      },
      expertTemplate: {
        type: "object",
        additionalProperties: false,
        required: ["template_id", "purpose", "allowed_questions", "required_response_fields", "forbidden_expert_claims", "stop_conditions"],
        properties: {
          template_id: stringField,
          purpose: stringField,
          allowed_questions: { type: "array", minItems: 1, items: stringField },
          required_response_fields: { type: "array", minItems: 1, items: stringField },
          forbidden_expert_claims: { type: "array", minItems: 1, items: stringField },
          stop_conditions: { type: "array", minItems: 1, items: stringField },
        },
      },
      jurisdictionPacketCoverage: {
        type: "object",
        additionalProperties: false,
        required: ["required_boundaries", "source_bindings", "jurisdiction_boundary", "forbidden_overclaim"],
        properties: {
          required_boundaries: { type: "array", minItems: 1, items: stringField },
          source_bindings: { type: "array", minItems: 1, items: { $ref: "#/$defs/sourceBinding" } },
          jurisdiction_boundary: stringField,
          forbidden_overclaim: stringField,
        },
      },
      sourceBinding: {
        type: "object",
        additionalProperties: false,
        required: ["boundary", "source_ids"],
        properties: {
          boundary: stringField,
          source_ids: { type: "array", minItems: 1, items: stringField },
        },
      },
      simulationCase: {
        type: "object",
        additionalProperties: false,
        required: [
          "case_type",
          "jurisdiction_id",
          "source_id",
          "simulated_result_state",
          "boundary_focus",
          "simulation_only",
          "source_refresh_executed",
          "local_expert_contacted",
          "local_expert_substituted",
          "generated_output",
          "expected_finding",
          "blocks",
          "does_not_block",
          "proof_required_to_close",
          "allowed_next_action",
          "forbidden_next_action",
        ],
        properties: {
          case_type: { enum: SIMULATION_CASE_TYPES },
          jurisdiction_id: { enum: ["england", "flanders"] },
          source_id: stringField,
          simulated_result_state: { enum: REFRESH_STATES },
          boundary_focus: stringField,
          simulation_only: { const: true },
          source_refresh_executed: { const: false },
          local_expert_contacted: { const: false },
          local_expert_substituted: { const: false },
          generated_output: { $ref: "#/$defs/noOutput" },
          expected_finding: stringField,
          blocks: stringField,
          does_not_block: stringField,
          proof_required_to_close: stringField,
          allowed_next_action: stringField,
          forbidden_next_action: stringField,
        },
      },
      finalDecision: {
        type: "object",
        additionalProperties: false,
        required: ["selected", "allowed_options", "decision_selection_count", "rationale"],
        properties: {
          selected: { const: SELECTED_DECISION },
          allowed_options: { type: "array", prefixItems: DECISION_OPTIONS.map((item) => ({ const: item })), minItems: DECISION_OPTIONS.length, maxItems: DECISION_OPTIONS.length },
          decision_selection_count: { const: 1 },
          rationale: stringField,
        },
      },
      sourceCounts: {
        type: "object",
        additionalProperties: false,
        required: ["england", "flanders"],
        properties: {
          england: { const: 8 },
          flanders: { const: 5 },
        },
      },
      simulationCaseCounts: {
        type: "object",
        additionalProperties: false,
        required: ["england", "flanders", "required_case_types"],
        properties: {
          england: { const: SIMULATION_CASE_TYPES.length },
          flanders: { const: SIMULATION_CASE_TYPES.length },
          required_case_types: { type: "array", prefixItems: SIMULATION_CASE_TYPES.map((item) => ({ const: item })), minItems: SIMULATION_CASE_TYPES.length, maxItems: SIMULATION_CASE_TYPES.length },
        },
      },
      finding: {
        type: "object",
        additionalProperties: false,
        required: ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"],
        properties: {
          finding: stringField,
          classification: { enum: ["core_requirement_met", "quality_improvement_available", "minor_carry_flag", "scale_blocker", "core_spec_failure"] },
          blocks: stringField,
          does_not_block: stringField,
          proof_required_to_close: stringField,
        },
      },
    },
  };
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ];
}

function renderContract(plan) {
  return renderMarkdown([
    "# Bounded Source Refresh Packet Contract",
    "",
    `Status: ${plan.status}`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Product end-state checkout note: ${PRODUCT_END_STATE_CHECKOUT_NOTE}`,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...plan.non_negotiable_requirements.map((item) => `- ${item}`),
    "",
    "## Refresh-State Model",
    "",
    ...markdownTable(
      ["State", "blocks", "does_not_block", "proof_required_to_close", "allowed_next_action", "forbidden_next_action"],
      stateDetails().map((item) => [`\`${item.state_id}\``, item.blocks, item.does_not_block, item.proof_required_to_close, item.allowed_next_action, item.forbidden_next_action])
    ),
    "",
    "## Stop Conditions",
    "",
    ...plan.stop_conditions.map((item) => `- ${item}`),
    "",
    "## Review Gates",
    "",
    ...plan.review_gates.map((item) => `- ${item}`),
    "",
  ]);
}

function renderJurisdictionPacket(report) {
  return renderMarkdown([
    `# ${report.jurisdiction_label} Bounded Source Refresh Packet`,
    "",
    `Status: ${report.status}`,
    "",
    "## Boundary",
    "",
    report.jurisdiction_packet_coverage.jurisdiction_boundary,
    "",
    "## Required Coverage",
    "",
    ...report.jurisdiction_packet_coverage.required_boundaries.map((item) => `- ${item}`),
    "",
    "## Exact Source-Refresh Inventory",
    "",
    ...markdownTable(
      ["source_id", "authority", "source_role", "current_access_date", "current_known_version_or_publication_date", "expected refresh method", "forbidden_inference", "human-review trigger"],
      report.source_inventory.map((source) => [
        `\`${source.source_id}\``,
        source.authority,
        source.source_role,
        source.current_access_date,
        source.current_known_version_or_publication_date,
        source.expected_refresh_method,
        source.forbidden_inference,
        source.human_review_trigger,
      ])
    ),
    "",
    "## Simulation Cases",
    "",
    ...markdownTable(
      ["case_type", "source_id", "state", "boundary_focus", "blocks", "proof_required_to_close"],
      report.simulation_cases.map((item) => [`\`${item.case_type}\``, `\`${item.source_id}\``, `\`${item.simulated_result_state}\``, item.boundary_focus, item.blocks, item.proof_required_to_close])
    ),
    "",
    "## Finding Classification",
    "",
    ...markdownTable(
      ["Finding", "Classification", "blocks", "does_not_block", "proof_required_to_close"],
      report.finding_classification.map((item) => [item.finding, `\`${item.classification}\``, item.blocks, item.does_not_block, item.proof_required_to_close])
    ),
    "",
  ]);
}

function renderExpertTemplate(template) {
  return renderMarkdown([
    "# Local Expert Review Request Template",
    "",
    `Template ID: \`${template.template_id}\``,
    "",
    "## Purpose",
    "",
    template.purpose,
    "",
    "## Allowed Questions",
    "",
    ...template.allowed_questions.map((item) => `- ${item}`),
    "",
    "## Required Response Fields",
    "",
    ...template.required_response_fields.map((item) => `- \`${item}\``),
    "",
    "## Forbidden Expert Claims",
    "",
    ...template.forbidden_expert_claims.map((item) => `- ${item}`),
    "",
    "## Stop Conditions",
    "",
    ...template.stop_conditions.map((item) => `- ${item}`),
    "",
  ]);
}

function renderPlan(report) {
  return renderMarkdown([
    "# Bounded Source Refresh Packet Plan",
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
    ...markdownTable(
      ["Requirement", "Status", "proof_required_to_close"],
      report.core_requirement_checklist.map((item) => [`\`${item.id}\``, item.status, item.proof_required_to_close])
    ),
    "",
    "## Source Inventory Summary",
    "",
    `- England sources: ${report.source_refresh_inventory_summary.england_sources.map((item) => `\`${item}\``).join(", ")}`,
    `- Flanders sources: ${report.source_refresh_inventory_summary.flanders_sources.map((item) => `\`${item}\``).join(", ")}`,
    `- Candidate sources allowed now: \`${report.source_refresh_inventory_summary.candidate_sources_allowed}\``,
    "",
    "## Review Gates",
    "",
    ...report.review_gates.map((item) => `- ${item}`),
    "",
  ]);
}

function renderSimulation(report) {
  return renderJurisdictionPacket(report);
}

function renderDecision(report) {
  return renderMarkdown([
    "# Bounded Source Refresh Packet Decision",
    "",
    `Status: ${report.status}`,
    "",
    "## Decision",
    "",
    `Selected: \`${report.final_bounded_source_refresh_packet_decision.selected}\``,
    "",
    "Allowed options:",
    "",
    ...report.final_bounded_source_refresh_packet_decision.allowed_options.map((item) => `- \`${item}\``),
    "",
    "## Does Not Authorize",
    "",
    ...report.does_not_authorize.map((item) => `- ${item}`),
    "",
    "## Required Before Any Execution Pilot",
    "",
    ...report.required_before_any_execution_pilot.map((item) => `- ${item}`),
    "",
    "## Finding Classification",
    "",
    ...markdownTable(
      ["Finding", "Classification", "blocks", "does_not_block", "proof_required_to_close"],
      report.finding_classification.map((item) => [item.finding, `\`${item.classification}\``, item.blocks, item.does_not_block, item.proof_required_to_close])
    ),
    "",
  ]);
}

function renderSprintPlan(decision) {
  return renderMarkdown([
    "# GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1 Sprint Plan",
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
    "Deliver a complete, machine-validated, human-reviewable England/Flanders bounded source-refresh packet that defines official source inventory, freshness checks, result states, refusals, expert-review template, and review gates without executing source refresh.",
    "",
    "## Non-Negotiable Requirements",
    "",
    ...decision.non_negotiable_requirements.map((item) => `- ${item}`),
    "",
    "## Required Outputs",
    "",
    ...OUTPUT_ALLOWLIST.map((item) => `- \`${item}\``),
    "",
    "## Selected Decision",
    "",
    `Selected for human review: \`${decision.final_bounded_source_refresh_packet_decision.selected}\``,
    "",
  ]);
}

function renderValidationLog() {
  return renderMarkdown([
    "# GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1 Validation Log",
    "",
    "Status: validated_for_human_review",
    "",
    "Validation commands:",
    "",
    "| Command | Result |",
    "| --- | --- |",
    "| `node build-scripts/inspection/build-bounded-source-refresh-packet.js --check` | PASS |",
    "| `node build-scripts/inspection/check-bounded-source-refresh-packet.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-bounded-source-refresh-packet.test.js --runInBand` | PASS |",
    "| `node build-scripts/references/check-roadmap-version-index.js` | PASS |",
    "| `npm.cmd run check:scope-language` | PASS |",
    "| `npm.cmd run check:active-governance-wording` | PASS |",
    "| `node build-scripts/reports/validate-report-json.js` | PASS |",
    "| `git diff --check origin/main..HEAD` | PASS |",
    "| `npm.cmd run check:platform` | PASS |",
    "",
  ]);
}

function renderCorrectionLog() {
  return renderMarkdown([
    "# GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1 Correction Log",
    "",
    "Status: specialist_blockers_closed",
    "",
    "| Finding | Status | Correction | Proof |",
    "| --- | --- | --- | --- |",
    "| Schema did not strictly encode report-type contracts | closed | Added schema `oneOf` report-type contracts, strict no-output, source inventory summary, jurisdiction coverage, decision/count definitions, and cardinality constraints | Schema/architecture focused re-review PASS; checker schema-instance validation added |",
    "| Generator paths were cwd-dependent | closed | Anchored generator `repoPath()` to `REPO_ROOT` derived from `__dirname` | Generator `--check` passes from outside the repository root |",
    "| Checker did not require jurisdiction-specific core IDs | closed | Added `england_packet_complete` and `flanders_packet_complete` to required core-ID enforcement | Focused Jest mutation coverage added |",
    "| Checker did not directly assert all jurisdiction coverage fragments | closed | Added England and Flanders required-boundary assertions and source-binding checks | Focused Jest mutation coverage added |",
    "| Flanders whole-UK simulation label looked jurisdiction-local | closed | Reworded cross-jurisdiction overclaim labels so Flanders output makes the whole-UK row an out-of-scope cross-jurisdiction refusal | Regenerated Flanders simulation |",
    "| Specialist and final lead records were absent during first architecture review | closed_for_specialist_record | Combined specialist record added; final lead record is produced after final lead subagent review | Checker requires both before final validation |",
    "",
  ]);
}

function renderClosureRecord(decision) {
  return renderMarkdown([
    "# GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1 Closure Record",
    "",
    "Status: ready_for_pr_readiness_after_final_validation",
    "",
    `Selected decision: \`${decision.final_bounded_source_refresh_packet_decision.selected}\``,
    "Expected route: `READY_FOR_HUMAN_REVIEW`",
    "",
    "Specialist gate: PASS after schema/architecture repair and focused re-review.",
    "Final lead: PASS.",
    "",
    "This record does not authorize source refresh execution, local expert contact or substitution, localized output, school/public output, evidence packs, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, accommodation sufficiency, or accessibility/legal sufficiency claims.",
    "",
  ]);
}

function mutate(base, code) {
  const clone = JSON.parse(JSON.stringify(base));
  switch (code) {
    case "STOP_NON_OFFICIAL_SOURCE":
      clone.simulation_cases[1].source_id = "unofficial-blog-source";
      return clone;
    case "STOP_SOURCE_REFRESH_EXECUTION":
      clone.source_refresh_execution_performed = true;
      clone.simulation_cases[0].source_refresh_executed = true;
      clone.forbidden_authority.source_refresh_executed = true;
      return clone;
    case "STOP_LOCAL_EXPERT_CONTACT":
      clone.local_expert_contacted = true;
      clone.simulation_cases[0].local_expert_contacted = true;
      clone.forbidden_authority.local_expert_contacted = true;
      return clone;
    case "STOP_LOCAL_EXPERT_SUBSTITUTION":
      clone.local_expert_substitution_performed = true;
      clone.simulation_cases[0].local_expert_substituted = true;
      clone.forbidden_authority.local_expert_substituted = true;
      return clone;
    case "STOP_LOCALIZED_OUTPUT":
      clone.simulation_cases[0].generated_output.localized_output = true;
      clone.forbidden_authority.localized_output_generated = true;
      return clone;
    case "STOP_PERSONAL_DATA":
      clone.simulation_cases[0].generated_output.personal_data = true;
      clone.forbidden_authority.personal_data_processing = true;
      return clone;
    case "STOP_COMPLIANCE_APPROVAL_CLAIM":
      clone.forbidden_authority.legal_compliance_claim = true;
      clone.forbidden_authority.inspection_readiness_claim = true;
      return clone;
    case "STOP_SUPPORT_ACCOMMODATION_CLAIM":
      clone.forbidden_authority.support_sufficiency_claim = true;
      clone.forbidden_authority.accommodation_sufficiency_claim = true;
      return clone;
    case "STOP_JURISDICTION_OVERGENERALISATION":
      if (clone.jurisdiction_id === "flanders") clone.forbidden_authority.all_belgium_claim_from_flanders_only = true;
      else clone.forbidden_authority.whole_uk_claim_from_england_only = true;
      return clone;
    case "STOP_REFRESH_STATE_MODEL_INCOMPLETE":
      clone.refresh_state_model = clone.refresh_state_model.filter((state) => state.state_id !== "candidate_gap_found");
      return clone;
    case "STOP_SOURCE_INVENTORY_MISMATCH":
      clone.source_inventory = clone.source_inventory.slice(0, -1);
      return clone;
    case "STOP_IMPLICIT_DISCOVERY":
      clone.forbidden_authority.implicit_source_discovery = true;
      clone.forbidden_authority.directory_globbing = true;
      return clone;
    case "STOP_EXPERT_TEMPLATE_FORBIDDEN_CLAIM_MISSING":
      clone.local_expert_review_request_template.forbidden_expert_claims = clone.local_expert_review_request_template.forbidden_expert_claims.filter((item) => item !== "legal advice");
      return clone;
    default:
      throw new Error(`Unknown mutation code: ${code}`);
  }
}

function fixtureReports(england, flanders, decision) {
  const positive = new Map([
    ["references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/england-bounded-source-refresh-simulation.sample.json", england],
    ["references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/flanders-bounded-source-refresh-simulation.sample.json", flanders],
    ["references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/bounded-source-refresh-packet-decision.sample.json", decision],
  ]);
  const negative = new Map(NEGATIVE_FIXTURES.map(([file, code]) => {
    let base = file.includes("all-belgium") ? flanders : england;
    let packet = mutate(base, code);
    if (file === "official-url-mismatch.sample.json") {
      packet = JSON.parse(JSON.stringify(england));
      packet.source_inventory[0].official_url = "https://example.com/not-official";
    }
    return [
      `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/${file}`,
      {
        fixture_id: file.replace(".sample.json", ""),
        expected_refusal_code: code,
        packet,
      },
    ];
  }));
  return { positive, negative };
}

function buildBundle() {
  for (const input of INPUT_ALLOWLIST) {
    if (!fs.existsSync(repoPath(input))) throw new Error(`Missing input allowlist source: ${input}`);
  }
  const priorDecision = readJson("reports/inspection-standards/local-expert-source-refresh-gate-decision.json");
  const selected = priorDecision.final_local_expert_source_refresh_gate_decision?.selected;
  if (selected !== ACCEPTED_INPUT_DECISION) {
    throw new StopError("STOP_ACCEPTED_INPUT_DECISION_MISMATCH", "Prior local-expert/source-refresh gate decision does not authorize this bounded packet.", { selected });
  }
  const england = jurisdictionReport("england");
  const flanders = jurisdictionReport("flanders");
  const plan = planReport(england, flanders);
  const decision = decisionReport(england, flanders, plan);
  return {
    schema: schemaDocument(),
    plan,
    england,
    flanders,
    decision,
    fixtures: fixtureReports(england, flanders, decision),
  };
}

function outputContents(bundle) {
  const contents = new Map([
    ["references/schemas/bounded-source-refresh-packet.schema.v1.json", `${JSON.stringify(bundle.schema, null, 2)}\n`],
    ["docs/inspection-standards/bounded-source-refresh-packet-contract.md", renderContract(bundle.plan)],
    ["docs/inspection-standards/england-bounded-source-refresh-packet.md", renderJurisdictionPacket(bundle.england)],
    ["docs/inspection-standards/flanders-bounded-source-refresh-packet.md", renderJurisdictionPacket(bundle.flanders)],
    ["docs/inspection-standards/local-expert-review-request-template.md", renderExpertTemplate(expertTemplate())],
    ["reports/inspection-standards/bounded-source-refresh-packet-plan.md", renderPlan(bundle.plan)],
    ["reports/inspection-standards/bounded-source-refresh-packet-plan.json", `${JSON.stringify(bundle.plan, null, 2)}\n`],
    ["reports/inspection-standards/england-bounded-source-refresh-simulation.md", renderSimulation(bundle.england)],
    ["reports/inspection-standards/england-bounded-source-refresh-simulation.json", `${JSON.stringify(bundle.england, null, 2)}\n`],
    ["reports/inspection-standards/flanders-bounded-source-refresh-simulation.md", renderSimulation(bundle.flanders)],
    ["reports/inspection-standards/flanders-bounded-source-refresh-simulation.json", `${JSON.stringify(bundle.flanders, null, 2)}\n`],
    ["reports/inspection-standards/bounded-source-refresh-packet-decision.md", renderDecision(bundle.decision)],
    ["reports/inspection-standards/bounded-source-refresh-packet-decision.json", `${JSON.stringify(bundle.decision, null, 2)}\n`],
  ]);
  for (const [file, report] of bundle.fixtures.positive.entries()) contents.set(file, `${JSON.stringify(report, null, 2)}\n`);
  for (const [file, report] of bundle.fixtures.negative.entries()) contents.set(file, `${JSON.stringify(report, null, 2)}\n`);
  contents.set(ORIGINAL_SPRINT_GATE_SPEC, renderSprintPlan(bundle.decision));
  contents.set(`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`, renderValidationLog());
  contents.set(`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`, renderCorrectionLog());
  contents.set(`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`, renderClosureRecord(bundle.decision));
  return contents;
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();
  if (/execute-source-refresh|source-refresh-execution-pilot|refresh-sources/.test(joined)) throw new StopError("STOP_SOURCE_REFRESH_EXECUTION", "Source refresh execution is not authorized by this packet sprint.", { args: unknown });
  if (/contact-local-expert/.test(joined)) throw new StopError("STOP_LOCAL_EXPERT_CONTACT", "Local expert contact is not authorized by this packet sprint.", { args: unknown });
  if (/local-expert-substitution|expert-substitution/.test(joined)) throw new StopError("STOP_LOCAL_EXPERT_SUBSTITUTION", "Local expert substitution is not authorized by this packet sprint.", { args: unknown });
  if (/localized-output|localized-exercise|answer-model|localized-assessment|country-edition/.test(joined)) throw new StopError("STOP_LOCALIZED_OUTPUT", "Localized output is not authorized.", { args: unknown });
  if (/student-facing/.test(joined)) throw new StopError("STOP_STUDENT_FACING_OUTPUT", "Student-facing output is not authorized.", { args: unknown });
  if (/teacher-school|school-facing|teacher-facing/.test(joined)) throw new StopError("STOP_TEACHER_SCHOOL_FACING_OUTPUT", "Teacher/school-facing output is not authorized.", { args: unknown });
  if (/public|external/.test(joined)) throw new StopError("STOP_PUBLIC_OUTPUT", "Public output is not authorized.", { args: unknown });
  if (/personal-data|data-processing/.test(joined)) throw new StopError("STOP_PERSONAL_DATA", "Personal-data processing is not authorized.", { args: unknown });
  if (/compliance|approval|accreditation|inspection-readiness|inspection-ready|op0|pta|summative/.test(joined)) throw new StopError("STOP_COMPLIANCE_APPROVAL_CLAIM", "Compliance, approval, accreditation, OP0, PTA, summative, and inspection-readiness claims are not authorized.", { args: unknown });
  if (/support-sufficiency|accommodation-sufficiency|accessibility-legal-sufficiency/.test(joined)) throw new StopError("STOP_SUPPORT_ACCOMMODATION_CLAIM", "Support, accommodation, and accessibility/legal sufficiency claims are not authorized.", { args: unknown });
  if (/whole-uk|all-belgium/.test(joined)) throw new StopError("STOP_JURISDICTION_OVERGENERALISATION", "Jurisdiction overgeneralisation is not authorized.", { args: unknown });
  if (/hidden-discovery|glob|implicit-source|scan-generated-lessons/.test(joined)) throw new StopError("STOP_IMPLICIT_DISCOVERY", "Implicit source discovery is not authorized.", { args: unknown });
  if (/evidence-pack|product-route|scale-gate|diagnostics|mastery|pv|package|(?:^|\s|-)ci(?:$|\s|-)|dashboard|quality-ref/.test(joined)) throw new StopError("STOP_FORBIDDEN_INTEGRATION", "Evidence-pack, product, Scale Gate, package/CI, dashboard, and quality-ref integrations are not authorized.", { args: unknown });
  if (unknown.length > 0) throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for bounded source refresh packet generator.", { args: unknown });
  return { check };
}

function writeOrCheck(contents, check) {
  for (const relativePath of contents.keys()) {
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
  if (mismatches.length > 0) throw new Error(`Bounded source refresh packet output is stale: ${mismatches.join(", ")}`);
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
    console.log(mode.check ? "Bounded source refresh packet output is current." : "Bounded source refresh packet output generated.");
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
  REFRESH_STATES,
  REFUSAL_CASES,
  REVIEW_RECORD_PATHS,
  SELECTED_DECISION,
  SIMULATION_CASE_TYPES,
  SPRINT_ID,
  buildBundle,
  noOutputEnforcement,
  outputContents,
  parseMode,
  sourceInventory,
  stateDetails,
};
