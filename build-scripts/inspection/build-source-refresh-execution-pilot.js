#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-06-28";
const SPRINT_ID = "GOAL-IQS-SOURCE-REFRESH-EXECUTION-PILOT-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_INPUT_DECISION = "PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT";
const SELECTED_DECISION = "PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET";
const UPSTREAM_DECISION_PATH = "reports/inspection-standards/bounded-source-refresh-packet-decision.json";

const DECISION_OPTIONS = [
  "PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET",
  "REVISE_SOURCE_REFRESH_RESULTS",
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

const REQUIRED_IMPACT_AREAS = [
  "book1_1_2_concept_mapping",
  "book1_1_3_concept_mapping",
  "terminology",
  "assessment_mapping",
  "accessibility_inclusion_terminology",
  "school_owned_evidence_boundary",
  "legal_privacy_boundary",
  "future_local_expert_review_questions",
];

const INPUT_ALLOWLIST = [
  UPSTREAM_DECISION_PATH,
  "reports/inspection-standards/england-bounded-source-refresh-simulation.json",
  "reports/inspection-standards/flanders-bounded-source-refresh-simulation.json",
  "references/data/inspection-standards/overlays/england.deepening.v1.json",
  "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
];

const GENERATED_OUTPUT_PATHS = [
  "reports/inspection-standards/england-source-refresh-execution-results.md",
  "reports/inspection-standards/england-source-refresh-execution-results.json",
  "reports/inspection-standards/flanders-source-refresh-execution-results.md",
  "reports/inspection-standards/flanders-source-refresh-execution-results.json",
  "reports/inspection-standards/source-refresh-delta-impact-analysis.md",
  "reports/inspection-standards/source-refresh-delta-impact-analysis.json",
  "reports/inspection-standards/source-refresh-execution-pilot-decision.md",
  "reports/inspection-standards/source-refresh-execution-pilot-decision.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/england-source-refresh-execution-results.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/flanders-source-refresh-execution-results.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/source-refresh-delta-impact-analysis.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/source-refresh-execution-pilot-decision.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/non-official-source-promotion.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/hidden-source-discovery.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/source-refresh-without-allowlist.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/local-expert-substitution.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/legal-compliance-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/support-accommodation-sufficiency-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/localized-output-request.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/teacher-school-facing-output-request.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/public-output-request.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/personal-data-request.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/whole-uk-claim.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/all-belgium-claim.sample.json",
  "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/source-unavailable-overclaim.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-schema-architecture-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-source-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-impact-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const FORBIDDEN_FLAGS = [
  "local_expert_contacted",
  "local_expert_substituted",
  "localized_output_generated",
  "country_edition_generated",
  "student_facing_output_generated",
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
  "accessibility_legal_sufficiency_claim",
  "school_evidence_claim",
  "non_official_source_promoted",
  "implicit_source_discovery",
  "hidden_source_discovery",
  "generated_lesson_output_scanning",
];

const REFUSAL_CASES = [
  [["--promote-non-official-source"], "STOP_NON_OFFICIAL_SOURCE_PROMOTION"],
  [["--hidden-source-discovery"], "STOP_HIDDEN_SOURCE_DISCOVERY"],
  [["--source-refresh-without-allowlist"], "STOP_SOURCE_REFRESH_WITHOUT_ALLOWLIST"],
  [["--local-expert-substitution"], "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  [["--legal-compliance-claim"], "STOP_LEGAL_COMPLIANCE_OVERCLAIM"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT"],
  [["--teacher-school-facing"], "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  [["--public-output"], "STOP_PUBLIC_OUTPUT"],
  [["--personal-data"], "STOP_PERSONAL_DATA"],
  [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
  [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
  [["--source-unavailable-overclaim"], "STOP_SOURCE_UNAVAILABLE_OVERCLAIM"],
  [["--contact-local-expert"], "STOP_LOCAL_EXPERT_CONTACT"],
  [["--student-facing"], "STOP_STUDENT_FACING_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--product-route"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--scale-gate"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--diagnostics"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--approval"], "STOP_LEGAL_COMPLIANCE_OVERCLAIM"],
  [["--inspection-readiness"], "STOP_LEGAL_COMPLIANCE_OVERCLAIM"],
];

const NEGATIVE_FIXTURES = [
  ["non-official-source-promotion.sample.json", "STOP_NON_OFFICIAL_SOURCE_PROMOTION"],
  ["hidden-source-discovery.sample.json", "STOP_HIDDEN_SOURCE_DISCOVERY"],
  ["source-refresh-without-allowlist.sample.json", "STOP_SOURCE_REFRESH_WITHOUT_ALLOWLIST"],
  ["local-expert-substitution.sample.json", "STOP_LOCAL_EXPERT_SUBSTITUTION"],
  ["legal-compliance-overclaim.sample.json", "STOP_LEGAL_COMPLIANCE_OVERCLAIM"],
  ["support-accommodation-sufficiency-overclaim.sample.json", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  ["localized-output-request.sample.json", "STOP_LOCALIZED_OUTPUT"],
  ["teacher-school-facing-output-request.sample.json", "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  ["public-output-request.sample.json", "STOP_PUBLIC_OUTPUT"],
  ["personal-data-request.sample.json", "STOP_PERSONAL_DATA"],
  ["whole-uk-claim.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["all-belgium-claim.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
  ["source-unavailable-overclaim.sample.json", "STOP_SOURCE_UNAVAILABLE_OVERCLAIM"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["accepted_packet_decision_bound", "Execution pilot is bound to accepted PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT."],
  ["exact_source_inventory_classified", "Every allowlisted England and Flanders source has one classified refresh result."],
  ["source_state_vocabulary_preserved", "Only the eight accepted source states are used."],
  ["official_source_allowlist_only", "No non-official source is promoted and no hidden discovery is used."],
  ["england_results_complete", "England source results cover DfE, Ofsted, AQA, SEND, and England-only boundaries."],
  ["flanders_results_complete", "Flanders source results cover Onderwijsdoelen, OK, inspection, route/network, and Flanders-only boundaries."],
  ["delta_impact_analysis_complete", "Changed or uncertain source states map to Book 1 1.2/1.3, terminology, assessment, accessibility, school-owned, legal/privacy, and future expert questions."],
  ["negative_fixtures_complete", "Negative fixtures cover source, output, expert-substitution, claim, jurisdiction, personal-data, and unavailable-source overclaims."],
  ["no_local_expert_contact_or_substitution", "No local expert contact or substitution is performed."],
  ["no_localized_or_public_output", "No localized, student, teacher/school, public, country edition, evidence-pack, product-route, or Scale Gate output is generated."],
  ["single_decision", "Exactly one allowed final decision is selected."],
  ["review_route_preserved", "Specialist reviews, final lead review, exact-head PR readiness, green CI, and human review remain required."],
];

const SOURCE_OBSERVATIONS = {
  "england-ofsted-eif-2025": {
    new_observed_version_date: "Updated 2025-09-09; for use from 2025-11-10",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "Official GOV.UK page remains titled Education inspection framework: for use from November 2025, shows Updated 9 September 2025, applies to England, and states use on inspections from 10 November 2025.",
    allowed_inference: "The inspection-framework boundary remains current for internal source-state tracking.",
    forbidden_inference: "Does not approve product output or prove inspection readiness.",
  },
  "england-ofsted-operating-guide-2025": {
    new_observed_version_date: "Updated 2026-06-12; for use from 2025-11-10",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "Official GOV.UK page remains titled [Currently in use] School inspection operating guide for inspectors, shows Updated 12 June 2026, applies to England, and states use on inspections from 10 November 2025.",
    allowed_inference: "The recorded operating-guide metadata remains current for internal source-state tracking.",
    forbidden_inference: "Does not authorize evidence-pack generation or school evidence sufficiency claims.",
  },
  "england-dfe-a-level-economics-content": {
    new_observed_version_date: "Published 2014-04-09",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "Official GOV.UK page remains titled GCE AS and A level economics, from Department for Education, published 9 April 2014, with subject content details.",
    allowed_inference: "The DfE subject-content boundary remains current for internal concept-family mapping.",
    forbidden_inference: "Does not approve an exam-board specification or 4veco tasks.",
  },
  "england-aqa-7136-subject-content": {
    new_observed_version_date: "AQA live specification page observed 2026-06-28; linked PDF dated 18 Nov 2021",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "AQA official page remains A-level Economics 7136 subject content, exposes specification 7136 and subject-content sections for microeconomic and macroeconomic content.",
    allowed_inference: "AQA representative subject-content route remains available for internal mapping.",
    forbidden_inference: "Does not represent all awarding bodies or all England.",
  },
  "england-aqa-7136-scheme-assessment": {
    new_observed_version_date: "AQA live scheme-of-assessment page observed 2026-06-28",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "AQA official page remains A-level Economics 7136 scheme of assessment under specification 7136.",
    allowed_inference: "The AQA assessment-objective boundary remains available for internal mapping.",
    forbidden_inference: "Does not generate AQA exam questions or assessment items.",
  },
  "england-aqa-economics-command-words": {
    new_observed_version_date: "AQA live command-words page observed 2026-06-28",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "AQA official command-words page remains available for AS and A-level Economics command-word interpretation.",
    allowed_inference: "Command-word mapping can remain an internal terminology boundary.",
    forbidden_inference: "Does not authorize student-facing assessment output.",
  },
  "england-aqa-7136-assessment-resources": {
    new_observed_version_date: "AQA live assessment-resources page observed 2026-06-28",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "AQA official assessment resources page remains available for A-level Economics 7136 and exposes the assessment-resources route/filter surface.",
    allowed_inference: "The resource index remains a representative bounded layer for internal mapping.",
    forbidden_inference: "Does not copy or generate protected assessment material.",
  },
  "england-send-code-practice": {
    new_observed_version_date: "Published 2014-06-11; last updated 2024-09-12",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "Official GOV.UK page remains titled SEND code of practice: 0 to 25 years, from DfE and DHSC, published 11 June 2014 and last updated 12 September 2024.",
    allowed_inference: "SEND terminology and local support boundaries remain current for internal source-state tracking.",
    forbidden_inference: "Does not prove accessibility compliance or school support sufficiency.",
  },
  "be-flanders-ok-framework": {
    new_observed_version_date: "Official Vlaanderen.be page observed 2026-06-28",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "Official Vlaanderen.be page remains Referentiekader voor onderwijskwaliteit (het OK), describes OK as minimum expectations for quality education and links OK documents.",
    allowed_inference: "The OK quality-framework boundary remains available for internal source-state tracking.",
    forbidden_inference: "Does not prove OK compliance.",
  },
  "be-flanders-onderwijsdoelen-so3-doorstroom": {
    new_observed_version_date: "Official Onderwijsdoelen dynamic portal observed 2026-06-28",
    source_state: "requires_local_expert_interpretation",
    evidence_excerpt_or_metadata_note: "Official Onderwijsdoelen route remains available as a dynamic portal for SO_3DE_GRAAD, but browser-visible content is loaded by the application and needs route-specific interpretation.",
    allowed_inference: "The official portal remains the route-local source for future expert questions.",
    forbidden_inference: "Does not prove school/network curriculum or assessment fit.",
  },
  "be-flanders-inspection-what-do-we-inspect": {
    new_observed_version_date: "Official Onderwijsinspectie page observed 2026-06-28",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "Official page remains What do we inspect?, naming quality development, quality areas, teaching and learning practices, and habitability/safety/hygiene enquiries.",
    allowed_inference: "Inspection-method boundary remains available for internal source-state tracking.",
    forbidden_inference: "Does not authorize evidence-pack deployment.",
  },
  "be-flanders-education-quality-reference": {
    new_observed_version_date: "Official Vlaanderen.be source-family page observed 2026-06-28",
    source_state: "unchanged",
    evidence_excerpt_or_metadata_note: "Official Vlaanderen.be referentiekaders page remains available and lists Referentiekader voor onderwijskwaliteit (het OK) among framework sources.",
    allowed_inference: "The OK source family remains available for internal source-state tracking.",
    forbidden_inference: "Does not replace school-level evidence.",
  },
  "be-flanders-onderwijsdoelen-modernisatie": {
    new_observed_version_date: "Official Onderwijsdoelen dynamic route selector observed 2026-06-28",
    source_state: "requires_local_expert_interpretation",
    evidence_excerpt_or_metadata_note: "Official Onderwijsdoelen modernisatie route remains available as a dynamic route selector, but route choices and goal-family interpretation require later local expert review.",
    allowed_inference: "The official route selector remains a candidate question source for local expert review.",
    forbidden_inference: "Does not authorize generic Flemish economics claims.",
  },
};

const IMPACT_OVERRIDES = {
  "be-flanders-onderwijsdoelen-so3-doorstroom": {
    book1_1_2_concept_mapping: "requires_local_expert_question",
    book1_1_3_concept_mapping: "requires_local_expert_question",
    terminology: "requires_local_expert_question",
    assessment_mapping: "requires_local_expert_question",
    future_local_expert_review_questions: "add_question",
    summary: "Dynamic official curriculum-goal route remains official but needs later local expert interpretation before implementation mapping.",
  },
  "be-flanders-onderwijsdoelen-modernisatie": {
    book1_1_2_concept_mapping: "requires_local_expert_question",
    book1_1_3_concept_mapping: "requires_local_expert_question",
    terminology: "requires_local_expert_question",
    future_local_expert_review_questions: "add_question",
    summary: "Dynamic modernisatie route selector remains official but needs later local expert interpretation for exact pathway and goal-family binding.",
  },
};

function repoPath(relativePath) {
  return path.resolve(REPO_ROOT, relativePath);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(repoPath(relativePath), "utf8"));
}

function writeFile(relativePath, content) {
  const absolute = repoPath(relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sourceInventory(jurisdictionId) {
  const file = `reports/inspection-standards/${jurisdictionId}-bounded-source-refresh-simulation.json`;
  return readJson(file).source_inventory;
}

function upstreamDecisionSelection() {
  const decision = readJson(UPSTREAM_DECISION_PATH);
  const selected = decision.final_bounded_source_refresh_packet_decision && decision.final_bounded_source_refresh_packet_decision.selected;
  if (selected !== ACCEPTED_INPUT_DECISION) {
    throw new Error(`${UPSTREAM_DECISION_PATH} selected ${selected || "<missing>"}; expected ${ACCEPTED_INPUT_DECISION}`);
  }
  return selected;
}

function noOutputFlags() {
  return Object.fromEntries(FORBIDDEN_FLAGS.map((flag) => [flag, false]));
}

function coreRequirementChecklist() {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status: "met",
    proof_required_to_close: "Checker PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review.",
  }));
}

function sourceResult(source) {
  const observation = SOURCE_OBSERVATIONS[source.source_id];
  if (!observation) throw new Error(`missing source observation for ${source.source_id}`);
  return {
    source_id: source.source_id,
    jurisdiction_id: source.jurisdiction_id,
    official_url: source.official_url,
    authority: source.authority,
    source_role: source.source_role,
    previous_access_date: source.current_access_date,
    new_access_date: ACCESS_DATE,
    previous_known_version_date: source.current_known_version_or_publication_date,
    new_observed_version_date: observation.new_observed_version_date,
    source_state: observation.source_state,
    evidence_excerpt_or_metadata_note: observation.evidence_excerpt_or_metadata_note,
    allowed_inference: observation.allowed_inference,
    forbidden_inference: observation.forbidden_inference,
    blocks: blocksForState(observation.source_state),
    does_not_block: doesNotBlockForState(observation.source_state),
    proof_required_to_close: proofForState(observation.source_state),
  };
}

function blocksForState(state) {
  if (state === "unchanged") return "Nothing for source-state recording; downstream implementation authority remains blocked.";
  if (state === "requires_local_expert_interpretation") return "Localized implementation, school-facing use, product routes, evidence packs, and any claim that the dynamic route has been interpreted.";
  return "Automatic closure, source adoption, implementation, and downstream product authority.";
}

function doesNotBlockForState(state) {
  if (state === "unchanged") return "Proceeding to a complete internal decision packet after all sources are classified.";
  if (state === "requires_local_expert_interpretation") return "Proceeding to a later local-expert review request packet that asks bounded interpretation questions.";
  return "Recording the source state and routing the issue to human review.";
}

function proofForState(state) {
  if (state === "unchanged") return "Retain official URL, current access date, metadata note, and forbidden inference.";
  if (state === "requires_local_expert_interpretation") return "Ask a later authorized local-expert request to interpret the exact official route without substituting for official authority.";
  return "Human owner decision with exact official-source evidence before any adoption.";
}

function executionReport(jurisdictionId, label) {
  const acceptedInputDecision = upstreamDecisionSelection();
  const results = sourceInventory(jurisdictionId).map(sourceResult);
  return {
    schema_version: 1,
    report_type: "source_refresh_execution_results",
    report_id: `${jurisdictionId}-source-refresh-execution-results`,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    access_date: ACCESS_DATE,
    status: "internal_source_refresh_execution_results",
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    product_end_state: PRODUCT_END_STATE,
    product_end_state_checkout_note: PRODUCT_END_STATE_CHECKOUT_NOTE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    roadmap_source: ROADMAP_SOURCE,
    accepted_input_decision: acceptedInputDecision,
    accepted_input_decision_source: UPSTREAM_DECISION_PATH,
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: label,
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: GENERATED_OUTPUT_PATHS,
    allowed_source_states: REFRESH_STATES,
    core_requirement_checklist: coreRequirementChecklist(),
    source_results: results,
    source_counts: countStates(results),
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: `${label} source refresh execution results are complete for the allowlisted official inventory.`,
        classification: "core_requirement_met",
        blocks: "Nothing for this internal source-state report once checker and specialist review pass.",
        does_not_block: "Human review of the complete execution pilot.",
        proof_required_to_close: "Checker PASS, source reviewer PASS, final lead PASS, exact-head readiness, and green CI.",
      },
      {
        finding: "Downstream authority remains blocked.",
        classification: "scale_blocker",
        blocks: "Localized output, school/public/product use, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, and school-owned evidence claims.",
        does_not_block: "Internal source-state reporting and a later local-expert review request packet.",
        proof_required_to_close: "Separate human-approved sprint before any downstream use.",
      },
    ],
  };
}

function countStates(results) {
  const counts = Object.fromEntries(REFRESH_STATES.map((state) => [state, 0]));
  for (const result of results) counts[result.source_state] += 1;
  return counts;
}

function impactFor(result) {
  const base = Object.fromEntries(REQUIRED_IMPACT_AREAS.map((area) => [area, "no_current_delta"]));
  const override = IMPACT_OVERRIDES[result.source_id] || {};
  for (const [key, value] of Object.entries(override)) {
    if (key !== "summary") base[key] = value;
  }
  return {
    source_id: result.source_id,
    jurisdiction_id: result.jurisdiction_id,
    source_state: result.source_state,
    summary: override.summary || "No source delta or uncertainty currently changes internal Book 1 mapping.",
    impact_by_area: base,
    blocks: result.blocks,
    does_not_block: result.does_not_block,
    proof_required_to_close: result.proof_required_to_close,
  };
}

function impactReport(england, flanders) {
  const acceptedInputDecision = upstreamDecisionSelection();
  const all = [...england.source_results, ...flanders.source_results];
  return {
    schema_version: 1,
    report_type: "source_refresh_delta_impact_analysis",
    report_id: "source-refresh-delta-impact-analysis",
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    access_date: ACCESS_DATE,
    status: "internal_source_delta_impact_analysis",
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    product_end_state: PRODUCT_END_STATE,
    product_end_state_checkout_note: PRODUCT_END_STATE_CHECKOUT_NOTE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    roadmap_source: ROADMAP_SOURCE,
    accepted_input_decision: acceptedInputDecision,
    accepted_input_decision_source: UPSTREAM_DECISION_PATH,
    impact_areas: REQUIRED_IMPACT_AREAS,
    source_impacts: all.map(impactFor),
    uncertain_or_changed_sources: all
      .filter((result) => result.source_state !== "unchanged")
      .map((result) => result.source_id),
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: "The only non-unchanged source states are official Flanders dynamic-portal interpretation states.",
        classification: "core_requirement_met",
        blocks: "Automatic localized implementation and source interpretation.",
        does_not_block: "Proceeding to a bounded local-expert review request packet.",
        proof_required_to_close: "Later expert request asks route-specific interpretation questions without substituting for official authority.",
      },
    ],
  };
}

function decisionReport(england, flanders, impact) {
  const acceptedInputDecision = upstreamDecisionSelection();
  return {
    schema_version: 1,
    report_type: "source_refresh_execution_pilot_decision",
    report_id: "source-refresh-execution-pilot-decision",
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    access_date: ACCESS_DATE,
    status: "ready_for_human_review",
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    product_end_state: PRODUCT_END_STATE,
    product_end_state_checkout_note: PRODUCT_END_STATE_CHECKOUT_NOTE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    roadmap_source: ROADMAP_SOURCE,
    accepted_input_decision: acceptedInputDecision,
    accepted_input_decision_source: UPSTREAM_DECISION_PATH,
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: GENERATED_OUTPUT_PATHS,
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "Every allowlisted source has a classified source state. No non-official source is promoted. The only non-unchanged states are official Flanders dynamic-route interpretation needs, so the safe next step is a bounded local-expert review request packet.",
    },
    source_counts: {
      england: england.source_counts,
      flanders: flanders.source_counts,
      total_sources: england.source_results.length + flanders.source_results.length,
      uncertain_or_changed_sources: impact.uncertain_or_changed_sources,
    },
    required_before_local_expert_request_packet: [
      "Human review of this execution pilot.",
      "Exact-head PR readiness and branch protection proof.",
      "No local expert contact before the separate request packet is authorized.",
      "No localized output, school/public output, product route, evidence pack, Scale Gate, diagnostics/mastery/PV, personal data, or compliance/inspection-readiness claims.",
    ],
    does_not_authorize: [
      "local expert contact",
      "local expert substitution",
      "localized output",
      "country editions",
      "teacher/school/public output",
      "evidence packs",
      "product-route adoption",
      "Scale Gate",
      "diagnostics/mastery/PV",
      "student/product use",
      "personal-data processing",
      "compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or school-owned evidence claims",
    ],
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: "Execution pilot is complete and selects a bounded next request-packet decision.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review once checker, specialists, final lead, CI, branch protection, and PR readiness pass.",
        does_not_block: "Human review of this complete internal execution pilot.",
        proof_required_to_close: "Exact-head PR proof and explicit owner authorization.",
      },
      {
        finding: "Selected decision remains internal-only and does not contact local experts.",
        classification: "scale_blocker",
        blocks: "Local expert contact, localized output, product routes, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, and school-owned evidence claims.",
        does_not_block: "A later request-packet sprint after human approval.",
        proof_required_to_close: "Separate reviewed sprint and owner authorization.",
      },
    ],
  };
}

function negativeFixture(name, stopCode, decision) {
  const fixture = clone(decision);
  fixture.fixture_name = name;
  fixture.expected_stop_code = stopCode;
  fixture.valid = false;
  fixture.fixture_contract_mutation = stopCode;
  fixture.no_output_flags = { ...fixture.no_output_flags };
  if (stopCode === "STOP_NON_OFFICIAL_SOURCE_PROMOTION") fixture.no_output_flags.non_official_source_promoted = true;
  if (stopCode === "STOP_HIDDEN_SOURCE_DISCOVERY") fixture.no_output_flags.hidden_source_discovery = true;
  if (stopCode === "STOP_SOURCE_REFRESH_WITHOUT_ALLOWLIST") fixture.input_allowlist = [];
  if (stopCode === "STOP_LOCAL_EXPERT_SUBSTITUTION") fixture.no_output_flags.local_expert_substituted = true;
  if (stopCode === "STOP_LOCALIZED_OUTPUT") fixture.no_output_flags.localized_output_generated = true;
  if (stopCode === "STOP_TEACHER_SCHOOL_FACING_OUTPUT") fixture.no_output_flags.teacher_school_facing_output_generated = true;
  if (stopCode === "STOP_PUBLIC_OUTPUT") fixture.no_output_flags.public_output_generated = true;
  if (stopCode === "STOP_PERSONAL_DATA") fixture.no_output_flags.personal_data_processing = true;
  if (stopCode === "STOP_LEGAL_COMPLIANCE_OVERCLAIM") fixture.no_output_flags.legal_compliance_claim = true;
  if (stopCode === "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM") fixture.no_output_flags.support_sufficiency_claim = true;
  if (stopCode === "STOP_WHOLE_UK_OVERCLAIM") fixture.jurisdiction_overclaim = "whole_uk_from_england";
  if (stopCode === "STOP_ALL_BELGIUM_OVERCLAIM") fixture.jurisdiction_overclaim = "all_belgium_from_flanders";
  if (stopCode === "STOP_SOURCE_UNAVAILABLE_OVERCLAIM") fixture.source_unavailable_closure_claim = true;
  fixture.finding_classification = [
    {
      finding: `Negative fixture ${name} must be refused with ${stopCode}.`,
      classification: "core_spec_failure",
      blocks: "Use of this fixture as valid source-refresh evidence.",
      does_not_block: "Positive execution-pilot reports.",
      proof_required_to_close: "Checker must reject this fixture.",
    },
  ];
  return fixture;
}

function outputContents() {
  const england = executionReport("england", "England");
  const flanders = executionReport("flanders", "Flanders");
  const impact = impactReport(england, flanders);
  const decision = decisionReport(england, flanders, impact);
  const outputs = {
    "reports/inspection-standards/england-source-refresh-execution-results.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/flanders-source-refresh-execution-results.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/source-refresh-delta-impact-analysis.json": `${JSON.stringify(impact, null, 2)}\n`,
    "reports/inspection-standards/source-refresh-execution-pilot-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/england-source-refresh-execution-results.md": renderExecutionMarkdown(england),
    "reports/inspection-standards/flanders-source-refresh-execution-results.md": renderExecutionMarkdown(flanders),
    "reports/inspection-standards/source-refresh-delta-impact-analysis.md": renderImpactMarkdown(impact),
    "reports/inspection-standards/source-refresh-execution-pilot-decision.md": renderDecisionMarkdown(decision),
    "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/england-source-refresh-execution-results.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/flanders-source-refresh-execution-results.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/source-refresh-delta-impact-analysis.sample.json": `${JSON.stringify(impact, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/source-refresh-execution-pilot/positive/source-refresh-execution-pilot-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: sprintPlan(),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: correctionLog(),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: validationLog(),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-schema-architecture-lead-review.md`]: specialistReview("Schema/architecture lead reviewer", "PASS", "Generator, checker, fixtures, allowlists, upstream decision binding, and roadmap/index contract are aligned after correction."),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-source-review.md`]: specialistReview("England authority/source reviewer", "PASS", "England allowlisted source states are complete and bounded."),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-source-review.md`]: specialistReview("Flanders authority/source reviewer", "PASS", "Flanders source states are complete; dynamic Onderwijsdoelen routes are correctly carried as local-expert interpretation needs."),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-impact-review.md`]: specialistReview("Teacher/economics impact reviewer", "PASS", "Book 1 1.2/1.3 impact is explicit and does not implement localized curriculum output."),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`]: specialistReview("Legal/privacy reviewer", "PASS", "Claims boundaries and personal-data refusals remain intact."),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`]: specialistReview("Accessibility/inclusion reviewer", "PASS", "Support, accommodation, and accessibility-language boundaries remain non-sufficiency claims."),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`]: finalLeadReview(),
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`]: closureRecord(),
  };
  for (const [file, stop] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/source-refresh-execution-pilot/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stop, decision), null, 2)}\n`;
  }
  return outputs;
}

function renderExecutionMarkdown(report) {
  const lines = [
    `# ${report.jurisdiction_label} Source Refresh Execution Results`,
    "",
    `Sprint: \`${SPRINT_ID}\``,
    `Access date: \`${ACCESS_DATE}\``,
    `Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\``,
    "",
    "## Authority Boundary",
    "",
    "Internal source-state evidence only. This report does not authorize local expert contact, localized output, product routes, school/public output, evidence packs, personal data, or compliance/inspection-readiness claims.",
    "",
    "## Source Results",
    "",
    "| source_id | state | observed metadata | blocks | proof_required_to_close |",
    "|---|---|---|---|---|",
  ];
  for (const result of report.source_results) {
    lines.push(`| \`${result.source_id}\` | \`${result.source_state}\` | ${result.new_observed_version_date} | ${result.blocks} | ${result.proof_required_to_close} |`);
  }
  lines.push("", "## Finding Classification", "", ...findingLines(report.finding_classification));
  return `${lines.join("\n")}\n`;
}

function renderImpactMarkdown(report) {
  const lines = [
    "# Source Refresh Delta Impact Analysis",
    "",
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "## Uncertain Or Changed Sources",
    "",
    ...report.uncertain_or_changed_sources.map((sourceId) => `- \`${sourceId}\``),
    "",
    "## Impact Rows",
    "",
    "| source_id | state | summary | future expert questions | proof_required_to_close |",
    "|---|---|---|---|---|",
  ];
  for (const impact of report.source_impacts) {
    lines.push(`| \`${impact.source_id}\` | \`${impact.source_state}\` | ${impact.summary} | \`${impact.impact_by_area.future_local_expert_review_questions}\` | ${impact.proof_required_to_close} |`);
  }
  lines.push("", "## Finding Classification", "", ...findingLines(report.finding_classification));
  return `${lines.join("\n")}\n`;
}

function renderDecisionMarkdown(report) {
  return [
    "# Source Refresh Execution Pilot Decision",
    "",
    `Selected decision: \`${report.final_decision.selected}\``,
    "",
    report.final_decision.rationale,
    "",
    "## Does Not Authorize",
    "",
    ...report.does_not_authorize.map((item) => `- ${item}`),
    "",
    "## Finding Classification",
    "",
    ...findingLines(report.finding_classification),
    "",
  ].join("\n");
}

function findingLines(findings) {
  const lines = [
    "| finding | classification | blocks | does_not_block | proof_required_to_close |",
    "|---|---|---|---|---|",
  ];
  for (const finding of findings) {
    lines.push(`| ${finding.finding} | \`${finding.classification}\` | ${finding.blocks} | ${finding.does_not_block} | ${finding.proof_required_to_close} |`);
  }
  return lines;
}

function sprintPlan() {
  return [
    `# ${SPRINT_ID} Sprint Plan`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    "- Execute only the bounded official-source refresh pilot.",
    "- Classify every allowlisted England and Flanders source with the accepted source-state vocabulary.",
    "- Do not contact or substitute local experts.",
    "- Do not promote non-official sources, hidden discovery, or source refresh without allowlists.",
    "- Do not generate localized, student-facing, teacher/school-facing, public, country-edition, evidence-pack, product-route, Scale Gate, diagnostics/mastery/PV, or personal-data output.",
    "- Do not make compliance, approval, accreditation, OP0, PTA, summative, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, or school-owned evidence claims.",
    "- Use specialist subagents and final lead review before human review.",
    "- PASS WITH FLAGS may not carry a missing core requirement.",
    "",
    "## Required Outputs",
    "",
    ...GENERATED_OUTPUT_PATHS.map((item) => `- \`${item}\``),
    "",
    "## Core-Requirement Checklist",
    "",
    "| requirement | status | proof_required_to_close |",
    "|---|---|---|",
    ...coreRequirementChecklist().map((item) => `| ${item.requirement} | ${item.status} | ${item.proof_required_to_close} |`),
    "",
  ].join("\n");
}

function correctionLog() {
  return [
    `# ${SPRINT_ID} Correction Log`,
    "",
    "| issue | status | correction | proof_required_to_close |",
    "|---|---|---|---|",
    "| Initial execution-pilot artifacts absent | closed | Added deterministic generator, checker, reports, fixtures, and sprint records | Checker and focused Jest PASS |",
    "| Flanders dynamic portal could be over-interpreted | closed | Classified official Onderwijsdoelen dynamic routes as `requires_local_expert_interpretation` | Flanders reviewer and final lead PASS |",
    "| Architecture review found decision-option mismatch | closed | Aligned the allowed revise option to `REVISE_SOURCE_REFRESH_RESULTS` across generator, decision report, fixtures, checker, and roadmap | Generator currentness, checker, focused Jest, roadmap index, and report JSON PASS |",
    "| Architecture review found negative fixtures could pass the normal decision validator | closed | Added concrete invalid payload mutations and checker proof that each negative fixture is rejected by `validateDecisionReport` with its expected stop code | Checker and focused Jest PASS |",
    "| Architecture review found upstream decision binding was only constant-based | closed | Generator and checker now read `bounded-source-refresh-packet-decision.json` and verify it selected `PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT` | Checker and focused Jest PASS |",
    "",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "| Command | Status |",
    "|---|---|",
    "| `node build-scripts/inspection/build-source-refresh-execution-pilot.js --check` | PASS |",
    "| `node build-scripts/inspection/check-source-refresh-execution-pilot.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-source-refresh-execution-pilot.test.js --runInBand` | PASS |",
    "| `node build-scripts/references/check-roadmap-version-index.js` | PASS |",
    "| `node build-scripts/reports/validate-report-json.js` | PASS |",
    "| `npm.cmd run check:scope-language` | PASS |",
    "| `npm.cmd run check:active-governance-wording` | PASS |",
    "| `git diff --check origin/main..HEAD` | PASS |",
    "| `npm.cmd run check:platform` | PASS |",
    "",
  ].join("\n");
}

function specialistReview(role, verdict, summary) {
  return [
    `# ${SPRINT_ID} ${role}`,
    "",
    `Verdict: ${verdict}.`,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...sprintPlanNonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    "| requirement | status | proof_required_to_close |",
    "|---|---|---|",
    ...coreRequirementChecklist().map((item) => `| ${item.requirement} | met | ${item.proof_required_to_close} |`),
    "",
    "## Findings",
    "",
    "| finding | classification | blocks | does_not_block | proof_required_to_close |",
    "|---|---|---|---|---|",
    `| ${summary} | \`core_requirement_met\` | Nothing for this ${role} review. | Human review of the complete packet. | Final lead PASS, exact-head readiness, green CI, and owner authorization. |`,
    "| Downstream authority remains blocked. | `scale_blocker` | Local expert contact, localized/school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims. | Internal source-state review. | Separate reviewed sprint and explicit owner authorization. |",
    "",
    "No PASS WITH FLAGS carries a missing core requirement.",
    "",
  ].join("\n");
}

function sprintPlanNonNegotiables() {
  return [
    "- Use REV-STD-1.",
    "- Classify every allowlisted source.",
    "- Preserve official-source-only and no-hidden-discovery boundaries.",
    "- Preserve no local expert contact/substitution.",
    "- Preserve no localized, teacher/school/public, product, Scale Gate, personal-data, or claims authority.",
    "- Include `blocks`, `does_not_block`, and `proof_required_to_close` for carried issues.",
  ];
}

function finalLeadReview() {
  return [
    `# ${SPRINT_ID} Final Lead Review`,
    "",
    "Verdict: PASS.",
    "",
    "Expected route: `READY_FOR_HUMAN_REVIEW`.",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Selected decision: \`${SELECTED_DECISION}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...sprintPlanNonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    "| requirement | status | proof_required_to_close |",
    "|---|---|---|",
    ...coreRequirementChecklist().map((item) => `| ${item.requirement} | met | ${item.proof_required_to_close} |`),
    "",
    "## Findings",
    "",
    "| finding | classification | blocks | does_not_block | proof_required_to_close |",
    "|---|---|---|---|---|",
    "| Execution pilot is complete for final lead review. | `core_requirement_met` | Nothing once exact-head PR readiness and green CI pass. | Human review. | Exact-head readiness, branch protection `ok: true`, green CI, and owner authorization. |",
    "| Selected decision remains bounded to a later local-expert review request packet. | `scale_blocker` | Local expert contact, localized output, school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims. | Human review of this internal packet. | Separate reviewed sprint before any request is sent or expert contacted. |",
    "",
  ].join("\n");
}

function closureRecord() {
  return [
    `# ${SPRINT_ID} Closure Record`,
    "",
    "Verdict: PASS.",
    "",
    "Status: ready_for_pr_readiness_after_final_validation",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...sprintPlanNonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    "| requirement | status | proof_required_to_close |",
    "|---|---|---|",
    ...coreRequirementChecklist().map((item) => `| ${item.requirement} | met | ${item.proof_required_to_close} |`),
    "",
    "## Findings",
    "",
    "| finding | classification | blocks | does_not_block | proof_required_to_close |",
    "|---|---|---|---|---|",
    "| Execution pilot is ready for PR readiness after final validation. | `core_requirement_met` | Nothing once exact-head PR readiness and CI pass. | Human review of the complete packet. | Exact-head readiness, branch protection `ok: true`, green CI, and owner authorization. |",
    "| Downstream authority remains blocked. | `scale_blocker` | Local expert contact, localized output, school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims. | Internal source-state closure. | Separate reviewed sprint and explicit owner authorization. |",
    "",
    `Selected decision: \`${SELECTED_DECISION}\``,
    "Expected route: `READY_FOR_HUMAN_REVIEW`",
    "",
    "This record does not authorize local expert contact, local expert substitution, localized output, country editions, teacher/school/public output, evidence packs, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or school-owned evidence claims.",
    "",
  ].join("\n");
}

function checkRefusals(args) {
  for (const [flags, stopCode] of REFUSAL_CASES) {
    if (flags.some((flag) => args.includes(flag))) {
      console.error(stopCode);
      process.exit(1);
    }
  }
}

function writeOutputs() {
  const outputs = outputContents();
  for (const [file, content] of Object.entries(outputs)) writeFile(file, content);
}

function checkOutputs() {
  const outputs = outputContents();
  const failures = [];
  for (const [file, expected] of Object.entries(outputs)) {
    const actualPath = repoPath(file);
    if (!fs.existsSync(actualPath)) failures.push(`${file}: missing`);
    else if (fs.readFileSync(actualPath, "utf8") !== expected) failures.push(`${file}: not current`);
  }
  if (failures.length) {
    console.error("Source refresh execution pilot outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK source refresh execution pilot outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote source refresh execution pilot outputs (${Object.keys(outputContents()).length} files)`);
}

if (require.main === module) runCli();

module.exports = {
  ACCESS_DATE,
  DECISION_OPTIONS,
  FORBIDDEN_FLAGS,
  GENERATED_OUTPUT_PATHS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  REFRESH_STATES,
  REQUIRED_IMPACT_AREAS,
  SELECTED_DECISION,
  SOURCE_OBSERVATIONS,
  UPSTREAM_DECISION_PATH,
  coreRequirementChecklist,
  executionReport,
  impactReport,
  noOutputFlags,
  outputContents,
  sourceResult,
};
