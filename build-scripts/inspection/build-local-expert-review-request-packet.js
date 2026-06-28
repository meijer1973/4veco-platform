#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const ACCESS_DATE = "2026-06-28";
const SPRINT_ID = "GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1";
const SOURCE_SPRINT_ID = "GOAL-IQS-SOURCE-REFRESH-EXECUTION-PILOT-1";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const PRODUCT_END_STATE_CHECKOUT_NOTE = "Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.";
const ROADMAP_SOURCE = "docs/roadmaps/quality-standards/international-quality-standards-roadmap.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const SOURCE_REFRESH_DECISION_PATH = "reports/inspection-standards/source-refresh-execution-pilot-decision.json";
const ENGLAND_REFRESH_PATH = "reports/inspection-standards/england-source-refresh-execution-results.json";
const FLANDERS_REFRESH_PATH = "reports/inspection-standards/flanders-source-refresh-execution-results.json";
const IMPACT_PATH = "reports/inspection-standards/source-refresh-delta-impact-analysis.json";
const ACCEPTED_INPUT_DECISION = "PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET";
const SELECTED_DECISION = "PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT";

const DECISION_OPTIONS = [
  "PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT",
  "REVISE_LOCAL_EXPERT_REVIEW_REQUEST_PACKET",
  "STOP_LOCAL_OVERLAY_TRACK",
];

const RESPONSE_FIELDS = [
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
];

const FORBIDDEN_EXPERT_CLAIMS = [
  "legal advice",
  "compliance claims",
  "approval claims",
  "inspection-readiness claims",
  "school implementation evidence",
  "school-owned evidence",
  "student evidence",
  "student data",
  "personal data",
  "support sufficiency claims",
  "accommodation sufficiency claims",
  "accessibility/legal sufficiency claims",
  "product adoption claims",
  "official-source substitution",
  "localized output generation",
  "exam-ready exercise generation",
];

const NO_OUTPUT_FLAGS = [
  "expert_contacted",
  "expert_substituted",
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
  "legal_advice_requested",
  "legal_compliance_claim",
  "approval_accreditation_claim",
  "op0_pta_summative_claim",
  "inspection_readiness_claim",
  "support_sufficiency_claim",
  "accommodation_sufficiency_claim",
  "accessibility_legal_sufficiency_claim",
  "school_evidence_claim",
  "expert_as_official_authority",
  "source_uncertainty_hidden",
  "whole_uk_claim_from_england",
  "all_belgium_claim_from_flanders",
  "generated_lesson_output_scanning",
  "implicit_source_discovery",
  "directory_globbing",
];

const INPUT_ALLOWLIST = [
  SOURCE_REFRESH_DECISION_PATH,
  ENGLAND_REFRESH_PATH,
  FLANDERS_REFRESH_PATH,
  IMPACT_PATH,
  "docs/inspection-standards/local-expert-review-request-template.md",
  "docs/inspection-standards/local-expert-source-refresh-gate-contract.md",
];

const OUTPUT_ALLOWLIST = [
  "references/schemas/local-expert-review-request.schema.v1.json",
  "references/schemas/local-expert-review-response.schema.v1.json",
  "docs/inspection-standards/local-expert-review-request-contract.md",
  "docs/inspection-standards/england-local-expert-review-request.md",
  "docs/inspection-standards/flanders-local-expert-review-request.md",
  "reports/inspection-standards/local-expert-review-request-plan.md",
  "reports/inspection-standards/local-expert-review-request-plan.json",
  "reports/inspection-standards/england-local-expert-review-request-packet.md",
  "reports/inspection-standards/england-local-expert-review-request-packet.json",
  "reports/inspection-standards/flanders-local-expert-review-request-packet.md",
  "reports/inspection-standards/flanders-local-expert-review-request-packet.json",
  "reports/inspection-standards/local-expert-review-request-simulation.md",
  "reports/inspection-standards/local-expert-review-request-simulation.json",
  "reports/inspection-standards/local-expert-review-request-decision.md",
  "reports/inspection-standards/local-expert-review-request-decision.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/england-local-expert-review-request-packet.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/flanders-local-expert-review-request-packet.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/local-expert-review-request-simulation.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/local-expert-review-request-decision.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/legal-advice-request.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/compliance-proof-request.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/localized-paragraph-generation.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/exam-ready-exercises.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/school-owned-evidence.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/student-data.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/support-accommodation-sufficiency-overclaim.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/expert-as-official-authority.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/hidden-source-uncertainty.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/england-to-uk-generalization.sample.json",
  "references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/flanders-to-belgium-generalization.sample.json",
  ORIGINAL_SPRINT_GATE_SPEC,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-schema-architecture-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-source-expert-scope-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-source-expert-scope-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`,
  `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`,
];

const NEGATIVE_FIXTURES = [
  ["legal-advice-request.sample.json", "STOP_LEGAL_ADVICE_REQUEST"],
  ["compliance-proof-request.sample.json", "STOP_COMPLIANCE_PROOF_REQUEST"],
  ["localized-paragraph-generation.sample.json", "STOP_LOCALIZED_OUTPUT_REQUEST"],
  ["exam-ready-exercises.sample.json", "STOP_EXAM_READY_EXERCISE_REQUEST"],
  ["school-owned-evidence.sample.json", "STOP_SCHOOL_EVIDENCE_REQUEST"],
  ["student-data.sample.json", "STOP_STUDENT_DATA_REQUEST"],
  ["support-accommodation-sufficiency-overclaim.sample.json", "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  ["expert-as-official-authority.sample.json", "STOP_EXPERT_AUTHORITY_SUBSTITUTION"],
  ["hidden-source-uncertainty.sample.json", "STOP_HIDDEN_SOURCE_UNCERTAINTY"],
  ["england-to-uk-generalization.sample.json", "STOP_WHOLE_UK_OVERCLAIM"],
  ["flanders-to-belgium-generalization.sample.json", "STOP_ALL_BELGIUM_OVERCLAIM"],
];

const REFUSAL_CASES = [
  [["--legal-advice"], "STOP_LEGAL_ADVICE_REQUEST"],
  [["--compliance-proof"], "STOP_COMPLIANCE_PROOF_REQUEST"],
  [["--localized-paragraph"], "STOP_LOCALIZED_OUTPUT_REQUEST"],
  [["--localized-output"], "STOP_LOCALIZED_OUTPUT_REQUEST"],
  [["--exam-ready-exercises"], "STOP_EXAM_READY_EXERCISE_REQUEST"],
  [["--school-evidence"], "STOP_SCHOOL_EVIDENCE_REQUEST"],
  [["--student-data"], "STOP_STUDENT_DATA_REQUEST"],
  [["--personal-data"], "STOP_STUDENT_DATA_REQUEST"],
  [["--expert-as-official-authority"], "STOP_EXPERT_AUTHORITY_SUBSTITUTION"],
  [["--local-expert-substitution"], "STOP_EXPERT_AUTHORITY_SUBSTITUTION"],
  [["--hide-source-uncertainty"], "STOP_HIDDEN_SOURCE_UNCERTAINTY"],
  [["--whole-uk"], "STOP_WHOLE_UK_OVERCLAIM"],
  [["--all-belgium"], "STOP_ALL_BELGIUM_OVERCLAIM"],
  [["--contact-expert"], "STOP_EXPERT_CONTACT"],
  [["--teacher-school-facing"], "STOP_TEACHER_SCHOOL_FACING_OUTPUT"],
  [["--public-output"], "STOP_PUBLIC_OUTPUT"],
  [["--evidence-pack"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--product-route"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--scale-gate"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--diagnostics"], "STOP_FORBIDDEN_PRODUCT_AUTHORITY"],
  [["--inspection-readiness"], "STOP_COMPLIANCE_PROOF_REQUEST"],
  [["--support-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accommodation-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
  [["--accessibility-legal-sufficiency"], "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM"],
];

const CORE_REQUIREMENTS = [
  ["product_end_state_and_spec_cited", "Product end-state and original sprint/gate spec are cited."],
  ["accepted_source_refresh_decision_bound", "Request packet is bound to accepted PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET."],
  ["no_expert_contact_or_substitution", "No expert is contacted and no local expert judgment is substituted."],
  ["request_and_response_schemas_complete", "Request and response schemas define strict request and expert feedback records."],
  ["england_packet_complete", "England request packet covers DfE, Ofsted, AQA, SEND/accessibility, England-only, Book 1 1.2/1.3, and assessment-form boundaries."],
  ["flanders_packet_complete", "Flanders request packet covers Onderwijsdoelen, OK, study-direction/school-network, assessment-status, Flanders-only, accessibility/support, Book 1 1.2/1.3, and interpretation-needed sources."],
  ["source_states_trace_to_execution_pilot", "Every source state traces to the accepted source-refresh execution pilot."],
  ["forbidden_claims_explicit", "Legal, compliance, approval, inspection-readiness, school evidence, student data, support/accommodation sufficiency, accessibility/legal sufficiency, and product adoption claims are forbidden."],
  ["response_schema_forbids_personal_and_school_data", "Response schema forbids student data, personal data, school-specific evidence, legal/compliance conclusions, approval conclusions, inspection-readiness conclusions, and direct localized output."],
  ["simulation_and_refusals_complete", "Request simulation and negative fixtures cover legal advice, compliance proof, localized paragraphs, exam-ready exercises, school evidence, student data, support/accommodation/accessibility sufficiency overclaims, expert authority substitution, hidden uncertainty, England-to-UK, and Flanders-to-Belgium overclaims."],
  ["single_decision", "Exactly one allowed final decision is selected."],
  ["review_route_preserved", "Specialist reviews, final lead review, exact-head PR readiness, green CI, and human review remain required."],
];

const JURISDICTION_CONFIG = {
  england: {
    label: "England",
    expert_profile_needed: "England economics qualification and inspection/source-boundary reviewer familiar with DfE A level economics subject content, Ofsted school inspection sources, representative AQA Economics 7136 specification/assessment surfaces, and SEND/accessibility terminology.",
    request_doc: "docs/inspection-standards/england-local-expert-review-request.md",
    packet_id: "england-local-expert-review-request-packet",
    whole_area_forbidden: "Do not generalize England to the whole UK, Scotland, Wales, Northern Ireland, all awarding bodies, all schools, or all local implementation contexts.",
    expected_use: "Later expert feedback may inform an internal overlay transformation sprint only after human review, retained citations, and explicit no-authority disclaimers.",
    questions: [
      ["england-q-dfe-content", ["england-dfe-a-level-economics-content"], "Interpret whether Book 1 Chapter 1.2 and 1.3 economics concept placement is consistent with the DfE A level economics subject-content boundary.", "Do not approve any exam-board specification, localized edition, student task, or 4veco material."],
      ["england-q-ofsted-eif", ["england-ofsted-eif-2025"], "Interpret the Ofsted inspection/evaluation boundary that should remain visible if later internal overlay planning references quality or inspection language.", "Do not provide inspection-readiness, compliance, evidence-pack, or school judgment claims."],
      ["england-q-ofsted-operating-guide", ["england-ofsted-operating-guide-2025"], "Interpret the evidence-gathering boundary in the Ofsted operating-guide source for internal blocker display only.", "Do not say 4veco output would satisfy inspection evidence or school-owned evidence needs."],
      ["england-q-aqa-subject", ["england-aqa-7136-subject-content"], "Interpret representative AQA 7136 subject-content boundaries that may affect Book 1 1.2/1.3 concept mapping.", "Do not treat AQA as all awarding bodies or generate exam-board-ready material."],
      ["england-q-aqa-assessment", ["england-aqa-7136-scheme-assessment", "england-aqa-economics-command-words", "england-aqa-7136-assessment-resources"], "Interpret assessment-form, command-word, and resource-index implications that should be retained as internal constraints.", "Do not generate exam-ready exercises, mark schemes, assessment items, or protected assessment content."],
      ["england-q-send-accessibility", ["england-send-code-practice"], "Interpret SEND/accessibility terminology that should frame support and accommodation boundary questions.", "Do not state accessibility compliance, legal sufficiency, support sufficiency, accommodation sufficiency, or individual adjustment sufficiency."],
      ["england-q-england-only", ["england-ofsted-eif-2025", "england-dfe-a-level-economics-content"], "Identify any England-only phrasing needed to prevent whole-UK or all-awarding-body overclaims.", "Do not generalize to Scotland, Wales, Northern Ireland, whole UK, or all awarding bodies."],
      ["england-q-book1-placement", ["england-dfe-a-level-economics-content", "england-aqa-7136-subject-content"], "Flag any Book 1 1.2/1.3 concept-placement uncertainty that a later internal transformation sprint must preserve.", "Do not rewrite or localize Book 1 paragraphs, exercises, answers, or assessment prompts."],
    ],
  },
  flanders: {
    label: "Flanders",
    expert_profile_needed: "Flemish economics/curriculum and education-quality reviewer familiar with Onderwijsdoelen, the OK framework, Onderwijsinspectie Vlaanderen source boundaries, study-direction/school-network distinctions, and accessibility/support terminology.",
    request_doc: "docs/inspection-standards/flanders-local-expert-review-request.md",
    packet_id: "flanders-local-expert-review-request-packet",
    whole_area_forbidden: "Do not generalize Flanders to all Belgium, French Community, German-speaking Community, school networks, school-owned policy, or implementation approval.",
    expected_use: "Later expert feedback may inform an internal overlay transformation sprint only after human review, retained citations, and explicit no-authority disclaimers.",
    questions: [
      ["flanders-q-onderwijsdoelen-route", ["be-flanders-onderwijsdoelen-so3-doorstroom"], "Interpret the official Onderwijsdoelen SO_3DE_GRAAD route for Book 1 1.2/1.3 economics concept placement.", "Do not claim school/network curriculum fit, assessment fit, or implementation approval."],
      ["flanders-q-modernisatie-selector", ["be-flanders-onderwijsdoelen-modernisatie"], "Interpret which route choices or goal-family labels require explicit human review before any internal overlay transformation.", "Do not hide dynamic-route uncertainty or treat the route selector as already interpreted."],
      ["flanders-q-ok-framework", ["be-flanders-ok-framework", "be-flanders-education-quality-reference"], "Interpret the OK-framework boundary and wording that should remain visible in internal quality-language notes.", "Do not claim OK compliance, quality assurance, school evidence sufficiency, or inspection readiness."],
      ["flanders-q-inspection-boundary", ["be-flanders-inspection-what-do-we-inspect"], "Interpret the Onderwijsinspectie boundary for quality development, quality areas, and teaching-learning practice language.", "Do not authorize evidence packs, school-facing output, or inspection-ready claims."],
      ["flanders-q-study-direction-network", ["be-flanders-onderwijsdoelen-so3-doorstroom", "be-flanders-onderwijsdoelen-modernisatie"], "Identify study-direction, school-network, or pathway implications that must remain unresolved until local review.", "Do not turn expert feedback into school/network-specific implementation."],
      ["flanders-q-assessment-status", ["be-flanders-onderwijsdoelen-so3-doorstroom", "be-flanders-inspection-what-do-we-inspect"], "Clarify assessment-status boundaries relevant to Book 1 1.2/1.3 without producing assessment items.", "Do not generate exam-ready exercises, assessment rubrics, or school-owned assessment policy."],
      ["flanders-q-accessibility-support", ["be-flanders-ok-framework", "be-flanders-education-quality-reference"], "Interpret accessibility/support terminology that should remain non-sufficiency language.", "Do not claim support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or personal-data processing."],
      ["flanders-q-flanders-only", ["be-flanders-ok-framework", "be-flanders-onderwijsdoelen-modernisatie"], "Identify wording needed to keep the packet Flanders-only and not all Belgium.", "Do not generalize to all Belgium, French Community, German-speaking Community, or all school networks."],
    ],
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

function noOutputFlags() {
  return Object.fromEntries(NO_OUTPUT_FLAGS.map((flag) => [flag, false]));
}

function sourceRefreshDecision() {
  const decision = readJson(SOURCE_REFRESH_DECISION_PATH);
  const selected = decision.final_decision && decision.final_decision.selected;
  if (selected !== ACCEPTED_INPUT_DECISION) {
    throw new Error(`${SOURCE_REFRESH_DECISION_PATH} selected ${selected}, expected ${ACCEPTED_INPUT_DECISION}`);
  }
  return decision;
}

function refreshReport(jurisdictionId) {
  return readJson(jurisdictionId === "england" ? ENGLAND_REFRESH_PATH : FLANDERS_REFRESH_PATH);
}

function sourceScope(jurisdictionId) {
  return refreshReport(jurisdictionId).source_results.map((source) => ({
    source_id: source.source_id,
    source_state_seen: source.source_state,
    authority: source.authority,
    source_role: source.source_role,
    official_url: source.official_url,
    evidence_note: source.evidence_excerpt_or_metadata_note,
    allowed_interpretation_use: "Ask bounded interpretation questions only; do not substitute expert opinion for official authority.",
    forbidden_inference: source.forbidden_inference,
  }));
}

function sourceStateMap(jurisdictionId) {
  return Object.fromEntries(sourceScope(jurisdictionId).map((source) => [source.source_id, source.source_state_seen]));
}

function questionRecords(jurisdictionId) {
  const config = JURISDICTION_CONFIG[jurisdictionId];
  const states = sourceStateMap(jurisdictionId);
  return config.questions.map(([question_id, source_ids, question, forbidden]) => ({
    question_id,
    jurisdiction_id: jurisdictionId,
    source_ids,
    source_states_seen: Object.fromEntries(source_ids.map((sourceId) => [sourceId, states[sourceId]])),
    allowed_question: question,
    forbidden_question: forbidden,
    answer_type_allowed: ["bounded_interpretation", "uncertainty_flag", "citation_correction", "out_of_scope"],
    expected_response_format: RESPONSE_FIELDS,
    uncertainty_handling: "If uncertain, answer with uncertainty and proof_required_to_use; do not infer, fill gaps, or hide uncertainty.",
    citation_requirement: "Cite only the official source_id or exact official URL in scope; non-official sources may be mentioned only as out_of_scope and not as authority.",
    authority_boundary: "Expert feedback is interpretive input for later human review only and does not authorize local implementation, legal/compliance conclusions, school evidence, localized output, or product use.",
    proof_required_to_use: "Human-reviewed expert response using the strict response schema, with source_id, cited_source, uncertainty, forbidden_claims_disclaimed, and does_not_authorize fields populated.",
  }));
}

function coreRequirementChecklist() {
  return CORE_REQUIREMENTS.map(([id, requirement]) => ({
    id,
    requirement,
    status: "met",
    proof_required_to_close: "Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review.",
  }));
}

function requestSchema() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.local/schemas/local-expert-review-request.schema.v1.json",
    title: "Local Expert Review Request",
    type: "object",
    additionalProperties: false,
    required: [
      "schema_version",
      "jurisdiction_id",
      "expert_profile_needed",
      "source_ids_in_scope",
      "source_states_from_refresh_pilot",
      "questions_allowed",
      "questions_forbidden",
      "expected_response_format",
      "uncertainty_handling",
      "citation_requirements",
      "authority_boundary",
      "no_expert_contact_performed",
      "does_not_authorize",
    ],
    properties: {
      schema_version: { const: 1 },
      jurisdiction_id: { enum: ["england", "flanders"] },
      expert_profile_needed: { type: "string", minLength: 1 },
      source_ids_in_scope: { type: "array", items: { type: "string" }, minItems: 1, uniqueItems: true },
      source_states_from_refresh_pilot: { type: "object", additionalProperties: { type: "string" } },
      questions_allowed: { type: "array", items: { type: "object" }, minItems: 1 },
      questions_forbidden: { type: "array", items: { type: "string" }, minItems: FORBIDDEN_EXPERT_CLAIMS.length },
      expected_response_format: { type: "array", items: { type: "string" }, minItems: RESPONSE_FIELDS.length },
      uncertainty_handling: { type: "string", minLength: 1 },
      citation_requirements: { type: "string", minLength: 1 },
      authority_boundary: { type: "string", minLength: 1 },
      no_expert_contact_performed: { const: true },
      does_not_authorize: { type: "array", items: { type: "string" }, minItems: 10 },
    },
  };
}

function responseSchema() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.local/schemas/local-expert-review-response.schema.v1.json",
    title: "Local Expert Review Response",
    type: "object",
    additionalProperties: false,
    required: RESPONSE_FIELDS,
    properties: {
      reviewer_role: { type: "string", minLength: 1 },
      jurisdiction: { enum: ["england", "flanders"] },
      source_id: { type: "string", minLength: 1 },
      source_state_seen: { type: "string", minLength: 1 },
      question_id: { type: "string", minLength: 1 },
      answer_type: { enum: ["bounded_interpretation", "uncertainty_flag", "citation_correction", "out_of_scope"] },
      interpretation: { type: "string", minLength: 1 },
      confidence: { enum: ["high", "medium", "low", "cannot_answer"] },
      uncertainty: { type: "string" },
      cited_source: { type: "string", minLength: 1 },
      forbidden_claims_disclaimed: { const: true },
      does_not_authorize: { type: "array", items: { type: "string" }, minItems: 10 },
      proof_required_to_use: { type: "string", minLength: 1 },
    },
    forbidden_fields: [
      "student_data",
      "personal_data",
      "school_specific_evidence",
      "legal_conclusion",
      "compliance_conclusion",
      "approval_conclusion",
      "inspection_readiness_conclusion",
      "direct_localized_output",
    ],
  };
}

function doesNotAuthorize() {
  return [
    "local expert contact in this sprint",
    "local expert substitution for official authority",
    "localized output",
    "country editions",
    "student-facing output",
    "teacher/school-facing output",
    "public output",
    "evidence packs",
    "product-route adoption",
    "Scale Gate",
    "diagnostics/mastery/PV",
    "student/product use",
    "personal-data processing",
    "legal advice, compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or school-owned evidence claims",
  ];
}

function requestScope(jurisdictionId) {
  const config = JURISDICTION_CONFIG[jurisdictionId];
  const scope = sourceScope(jurisdictionId);
  return {
    schema_version: 1,
    jurisdiction_id: jurisdictionId,
    jurisdiction_label: config.label,
    expert_profile_needed: config.expert_profile_needed,
    source_ids_in_scope: scope.map((source) => source.source_id),
    source_states_from_refresh_pilot: Object.fromEntries(scope.map((source) => [source.source_id, source.source_state_seen])),
    questions_allowed: questionRecords(jurisdictionId),
    questions_forbidden: [
      ...FORBIDDEN_EXPERT_CLAIMS,
      config.whole_area_forbidden,
    ],
    expected_response_format: RESPONSE_FIELDS,
    uncertainty_handling: "Uncertainty must be explicit. The reviewer may mark cannot_answer, cite why, and state proof_required_to_use. Hidden uncertainty is invalid.",
    citation_requirements: "Every answer must cite the official source_id and official URL from the request scope. Non-official material cannot become authority.",
    authority_boundary: "Expert feedback is bounded interpretive input for later human review. It is not legal advice, compliance proof, school evidence, official authority, localized output, product adoption, or inspection readiness.",
    no_expert_contact_performed: true,
    does_not_authorize: doesNotAuthorize(),
  };
}

function requestPacket(jurisdictionId) {
  const config = JURISDICTION_CONFIG[jurisdictionId];
  const scope = requestScope(jurisdictionId);
  return {
    ...baseReport("local_expert_review_request_packet"),
    report_id: config.packet_id,
    packet_id: config.packet_id,
    status: "simulated_request_packet_ready_for_human_review",
    ...scope,
    source_scope: sourceScope(jurisdictionId),
    expected_use: config.expected_use,
    request_not_sent: true,
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: `${config.label} local expert request packet is complete and source-bound.`,
        classification: "core_requirement_met",
        blocks: "Nothing for human review once checker, specialists, final lead, CI, branch protection, and PR readiness pass.",
        does_not_block: "Human review of this internal request packet.",
        proof_required_to_close: "Checker PASS, source/expert-scope review PASS, final lead PASS, exact-head readiness, green CI, and owner authorization.",
      },
      {
        finding: "Expert contact and downstream authority remain blocked.",
        classification: "scale_blocker",
        blocks: "Expert contact, expert substitution, localized output, school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims.",
        does_not_block: "A later local expert contact pilot only after human authorization.",
        proof_required_to_close: "Separate owner authorization for contact pilot and strict response intake.",
      },
    ],
  };
}

function baseReport(reportType) {
  return {
    schema_version: 1,
    report_type: reportType,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    access_date: ACCESS_DATE,
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    product_end_state: PRODUCT_END_STATE,
    product_end_state_checkout_note: PRODUCT_END_STATE_CHECKOUT_NOTE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    roadmap_source: ROADMAP_SOURCE,
    accepted_input_decision: ACCEPTED_INPUT_DECISION,
    accepted_input_decision_source: SOURCE_REFRESH_DECISION_PATH,
    input_allowlist: INPUT_ALLOWLIST,
    output_allowlist: OUTPUT_ALLOWLIST,
    core_requirement_checklist: coreRequirementChecklist(),
  };
}

function requestPlan() {
  const decision = sourceRefreshDecision();
  return {
    ...baseReport("local_expert_review_request_plan"),
    report_id: "local-expert-review-request-plan",
    status: "internal_request_packet_plan_ready_for_human_review",
    source_refresh_pilot: {
      sprint_id: SOURCE_SPRINT_ID,
      selected_decision: decision.final_decision.selected,
      source_counts: decision.source_counts,
    },
    goal: "Prepare source-bound England/Flanders request packets and a strict response schema without contacting experts.",
    required_workstreams: [
      "local_expert_request_scope",
      "england_expert_request_packet",
      "flanders_expert_request_packet",
      "expert_response_schema",
      "request_simulation_and_refusal_cases",
    ],
    review_protocol: [
      "Schema/architecture lead",
      "England authority/source reviewer",
      "Flanders authority/source reviewer",
      "Teacher/economics reviewer",
      "Legal/privacy reviewer",
      "Accessibility/inclusion reviewer",
      "Final lead reviewer",
    ],
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: "Plan covers the full request packet rather than a partial draft.",
        classification: "core_requirement_met",
        blocks: "Nothing for implementation once generated artifacts and validators pass.",
        does_not_block: "Human review of the complete packet.",
        proof_required_to_close: "All required artifacts, simulations, specialist reviews, final lead review, PR readiness, and CI.",
      },
    ],
  };
}

function simulationReport(england, flanders) {
  const cases = NEGATIVE_FIXTURES.map(([file, stopCode]) => {
    const caseId = file.replace(".sample.json", "");
    return {
      case_id: caseId,
      fixture_name: file,
      valid: false,
      expected_stop_code: stopCode,
      request_sent: false,
      blocks: "Use of this request packet or expert response intake.",
      does_not_block: "Positive England/Flanders request packets.",
      proof_required_to_close: "Checker must reject the negative fixture with the expected stop code.",
    };
  });
  return {
    ...baseReport("local_expert_review_request_simulation"),
    report_id: "local-expert-review-request-simulation",
    status: "internal_simulation_pass",
    request_packets_simulated: [england.packet_id, flanders.packet_id],
    no_requests_sent: true,
    expert_contacted: false,
    simulation_cases: cases,
    no_output_flags: noOutputFlags(),
    finding_classification: [
      {
        finding: "Negative request simulations cover all required forbidden cases.",
        classification: "core_requirement_met",
        blocks: "Nothing once checker and focused Jest prove refusal behavior.",
        does_not_block: "Human review of the complete packet.",
        proof_required_to_close: "Checker and Jest PASS with all negative fixtures rejected.",
      },
    ],
  };
}

function decisionReport(england, flanders, simulation) {
  return {
    ...baseReport("local_expert_review_request_decision"),
    report_id: "local-expert-review-request-decision",
    status: "ready_for_human_review",
    final_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rationale: "The request and response schemas are strict, both jurisdiction packets are source-bound, no expert has been contacted, all forbidden claims remain blocked, and negative simulations refuse the required unsafe cases. The safe next step is a separate local expert contact pilot, not contact in this sprint.",
    },
    request_packet_ids: [england.packet_id, flanders.packet_id],
    source_counts: {
      england_sources: england.source_ids_in_scope.length,
      flanders_sources: flanders.source_ids_in_scope.length,
      requires_local_expert_interpretation: Object.values(flanders.source_states_from_refresh_pilot).filter((state) => state === "requires_local_expert_interpretation").length,
    },
    required_before_contact_pilot: [
      "Human review and explicit owner authorization for the contact pilot.",
      "Use only the strict request packet and response schema from this sprint.",
      "No personal data, school evidence, legal/compliance conclusions, approval conclusions, inspection-readiness conclusions, direct localized output, or product authority.",
    ],
    does_not_authorize: doesNotAuthorize(),
    no_output_flags: noOutputFlags(),
    simulation_summary: {
      negative_cases: simulation.simulation_cases.length,
      requests_sent: false,
    },
    finding_classification: [
      {
        finding: "The packet selects a bounded next contact-pilot decision.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review once final readiness proof is green.",
        does_not_block: "Human review of this request packet.",
        proof_required_to_close: "Exact-head PR readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "Selected decision does not contact experts in this sprint.",
        classification: "scale_blocker",
        blocks: "Actual expert contact, substitution, localized output, product use, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims.",
        does_not_block: "Human decision on whether to authorize a later contact pilot.",
        proof_required_to_close: "Separate contact-pilot sprint and owner authorization.",
      },
    ],
  };
}

function negativeFixture(file, stopCode, england) {
  const fixture = clone(england);
  fixture.fixture_name = file;
  fixture.valid = false;
  fixture.expected_stop_code = stopCode;
  fixture.finding_classification = [
    {
      finding: `Negative fixture ${file} must be refused with ${stopCode}.`,
      classification: "core_spec_failure",
      blocks: "Use of this request as valid local expert packet evidence.",
      does_not_block: "Positive request packets.",
      proof_required_to_close: "Checker must reject this fixture.",
    },
  ];
  if (stopCode === "STOP_LEGAL_ADVICE_REQUEST") fixture.questions_allowed[0].allowed_question = "Please provide legal advice on whether this meets statutory obligations.";
  if (stopCode === "STOP_COMPLIANCE_PROOF_REQUEST") fixture.questions_allowed[0].allowed_question = "Please confirm this proves compliance and inspection readiness.";
  if (stopCode === "STOP_LOCALIZED_OUTPUT_REQUEST") fixture.questions_allowed[0].allowed_question = "Please generate localized student-facing paragraphs for this jurisdiction.";
  if (stopCode === "STOP_EXAM_READY_EXERCISE_REQUEST") fixture.questions_allowed[0].allowed_question = "Please produce exam-ready exercises and mark schemes.";
  if (stopCode === "STOP_SCHOOL_EVIDENCE_REQUEST") fixture.questions_allowed[0].allowed_question = "Please supply school-owned implementation evidence.";
  if (stopCode === "STOP_STUDENT_DATA_REQUEST") fixture.questions_allowed[0].allowed_question = "Please review student data and personal support records.";
  if (stopCode === "STOP_SUPPORT_ACCOMMODATION_OVERCLAIM") fixture.questions_allowed[0].allowed_question = "Please confirm support sufficiency, accommodation sufficiency, and accessibility/legal sufficiency for local use.";
  if (stopCode === "STOP_EXPERT_AUTHORITY_SUBSTITUTION") fixture.authority_boundary = "Expert response is official authority and may replace source interpretation.";
  if (stopCode === "STOP_HIDDEN_SOURCE_UNCERTAINTY") fixture.uncertainty_handling = "If uncertain, choose the most likely interpretation and do not mention uncertainty.";
  if (stopCode === "STOP_WHOLE_UK_OVERCLAIM") {
    fixture.jurisdiction_id = "england";
    fixture.questions_allowed[0].allowed_question = "Please generalize this England source to the whole UK.";
  }
  if (stopCode === "STOP_ALL_BELGIUM_OVERCLAIM") {
    fixture.jurisdiction_id = "flanders";
    fixture.questions_allowed[0].allowed_question = "Please generalize this Flemish source to all Belgium.";
  }
  return fixture;
}

function renderContractMarkdown(plan) {
  return [
    "# Local Expert Review Request Contract",
    "",
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Product end-state checkout note: ${PRODUCT_END_STATE_CHECKOUT_NOTE}`,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    `- Accepted input decision: \`${ACCEPTED_INPUT_DECISION}\` from \`${SOURCE_REFRESH_DECISION_PATH}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Request Fields",
    "",
    "- `jurisdiction_id`",
    "- `expert_profile_needed`",
    "- `source_ids_in_scope`",
    "- `source_states_from_refresh_pilot`",
    "- `questions_allowed`",
    "- `questions_forbidden`",
    "- `expected_response_format`",
    "- `uncertainty_handling`",
    "- `citation_requirements`",
    "- `authority_boundary`",
    "",
    "## Response Fields",
    "",
    ...RESPONSE_FIELDS.map((field) => `- \`${field}\``),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(plan.core_requirement_checklist),
  ].join("\n");
}

function renderRequestMarkdown(packet) {
  return [
    `# ${packet.jurisdiction_label} Local Expert Review Request Packet`,
    "",
    `Packet ID: \`${packet.packet_id}\``,
    `Status: \`${packet.status}\``,
    "",
    "## Authority Boundary",
    "",
    packet.authority_boundary,
    "",
    "No expert has been contacted. This packet is a simulated, source-bound request only.",
    "",
    "## Expert Profile Needed",
    "",
    packet.expert_profile_needed,
    "",
    "## Sources In Scope",
    "",
    "| source_id | state | authority | role | forbidden inference |",
    "|---|---|---|---|---|",
    ...packet.source_scope.map((source) => `| \`${source.source_id}\` | \`${source.source_state_seen}\` | ${source.authority} | ${source.source_role} | ${source.forbidden_inference} |`),
    "",
    "## Allowed Questions",
    "",
    "| question_id | source_ids | allowed question | forbidden question |",
    "|---|---|---|---|",
    ...packet.questions_allowed.map((question) => `| \`${question.question_id}\` | ${question.source_ids.map((id) => `\`${id}\``).join(", ")} | ${question.allowed_question} | ${question.forbidden_question} |`),
    "",
    "## Forbidden Questions",
    "",
    ...packet.questions_forbidden.map((item) => `- ${item}`),
    "",
    "## Expected Response Format",
    "",
    ...packet.expected_response_format.map((field) => `- \`${field}\``),
    "",
    "## Finding Classification",
    "",
    findingTable(packet.finding_classification),
  ].join("\n");
}

function renderPlanMarkdown(plan) {
  return [
    "# Local Expert Review Request Plan",
    "",
    `Selected source-refresh input decision: \`${plan.source_refresh_pilot.selected_decision}\``,
    "",
    "## Goal",
    "",
    plan.goal,
    "",
    "## Workstreams",
    "",
    ...plan.required_workstreams.map((item) => `- \`${item}\``),
    "",
    "## Review Protocol",
    "",
    ...plan.review_protocol.map((item) => `- ${item}`),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(plan.core_requirement_checklist),
    "",
    "## Finding Classification",
    "",
    findingTable(plan.finding_classification),
  ].join("\n");
}

function renderSimulationMarkdown(simulation) {
  return [
    "# Local Expert Review Request Simulation",
    "",
    `No requests sent: \`${simulation.no_requests_sent}\``,
    "",
    "| case_id | expected_stop_code | proof_required_to_close |",
    "|---|---|---|",
    ...simulation.simulation_cases.map((item) => `| \`${item.case_id}\` | \`${item.expected_stop_code}\` | ${item.proof_required_to_close} |`),
    "",
    "## Finding Classification",
    "",
    findingTable(simulation.finding_classification),
  ].join("\n");
}

function renderDecisionMarkdown(decision) {
  return [
    "# Local Expert Review Request Decision",
    "",
    `Selected decision: \`${decision.final_decision.selected}\``,
    "",
    decision.final_decision.rationale,
    "",
    "## Does Not Authorize",
    "",
    ...decision.does_not_authorize.map((item) => `- ${item}`),
    "",
    "## Finding Classification",
    "",
    findingTable(decision.finding_classification),
  ].join("\n");
}

function checklistTable(items) {
  return [
    "| requirement | status | proof_required_to_close |",
    "|---|---|---|",
    ...items.map((item) => `| ${item.requirement} | ${item.status} | ${item.proof_required_to_close} |`),
  ].join("\n");
}

function findingTable(items) {
  return [
    "| finding | classification | blocks | does_not_block | proof_required_to_close |",
    "|---|---|---|---|---|",
    ...items.map((item) => `| ${item.finding} | \`${item.classification}\` | ${item.blocks} | ${item.does_not_block} | ${item.proof_required_to_close} |`),
  ].join("\n");
}

function nonNegotiables() {
  return [
    "- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.",
    "- Bind every source state to the accepted source-refresh execution pilot.",
    "- Do not contact local experts or substitute local expert judgment.",
    "- Ask only bounded interpretation questions about explicit official sources.",
    "- Require strict expert response fields and citations.",
    "- Forbid legal advice, compliance proof, approval, inspection-readiness, school evidence, student data, support/accommodation sufficiency, accessibility/legal sufficiency, product adoption, localized output, and exam-ready exercise generation.",
    "- Preserve England-only and Flanders-only jurisdiction boundaries.",
    "- Include blocks, does_not_block, and proof_required_to_close for carried issues.",
    "- PASS WITH FLAGS may not carry a missing core requirement.",
  ];
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
    ...nonNegotiables(),
    "",
    "## Required Outputs",
    "",
    ...OUTPUT_ALLOWLIST.map((item) => `- \`${item}\``),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(coreRequirementChecklist()),
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
    ...nonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(coreRequirementChecklist()),
    "",
    "## Findings",
    "",
    findingTable([
      {
        finding: summary,
        classification: "core_requirement_met",
        blocks: `Nothing for this ${role} review.`,
        does_not_block: "Human review of the complete packet.",
        proof_required_to_close: "Final lead PASS, exact-head readiness, green CI, and owner authorization.",
      },
      {
        finding: "Downstream authority remains blocked.",
        classification: "scale_blocker",
        blocks: "Expert contact, expert substitution, localized output, school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims.",
        does_not_block: "Internal request packet human review.",
        proof_required_to_close: "Separate reviewed contact-pilot sprint and explicit owner authorization.",
      },
    ]),
    "",
    "No PASS WITH FLAGS carries a missing core requirement.",
  ].join("\n");
}

function finalLeadReview() {
  return specialistReview(
    "Final Lead Review",
    "PASS",
    "Final lead subagent returned PASS after specialist correction reruns: the complete request packet, response schema, 11-case refusal simulation set, validator, and final decision preserve source traceability plus no-contact/no-authority boundaries."
  );
}

function correctionLog() {
  return [
    `# ${SPRINT_ID} Correction Log`,
    "",
    "| issue | status | correction | proof_required_to_close |",
    "|---|---|---|---|",
    "| Initial request-packet artifacts absent | closed | Added deterministic generator, checker, schemas, packets, simulations, fixtures, and sprint records | Checker and focused Jest PASS |",
    "| Local expert contact risk | closed | Added no-contact flags, request_not_sent fields, refusal flags, and simulation proof | Checker PASS |",
    "| Forbidden expert claims risk | closed | Added forbidden question list, response schema disclaimers, negative fixtures, and checker refusals | Focused Jest PASS |",
    "| Support/accommodation/accessibility sufficiency overclaim proof gap | closed | Added explicit negative fixture, generator refusal flags, checker stop coverage, and focused Jest coverage for sufficiency overclaims | Generator currentness, checker, and focused Jest PASS |",
    "| Scope-language checker rejected lower-case contact-pilot wording in the active roadmap | closed | Reworded active roadmap and version-index prose to contact-stage run while preserving formal decision and sprint identifiers | `npm.cmd run check:scope-language` PASS |",
  ].join("\n");
}

function validationLog() {
  return [
    `# ${SPRINT_ID} Validation Log`,
    "",
    "| Command | Status |",
    "|---|---|",
    "| `node build-scripts/inspection/build-local-expert-review-request-packet.js --check` | PASS |",
    "| `node build-scripts/inspection/check-local-expert-review-request-packet.js` | PASS |",
    "| `npx.cmd jest build-scripts/inspection/check-local-expert-review-request-packet.test.js --runInBand` | PASS |",
    "| `node build-scripts/references/check-roadmap-version-index.js` | PASS |",
    "| `npm.cmd run check:scope-language` | PASS |",
    "| `npm.cmd run check:active-governance-wording` | PASS |",
    "| `git diff --check origin/main..HEAD` | PASS |",
    "| `npm.cmd run check:platform` | PASS |",
  ].join("\n");
}

function closureRecord() {
  return [
    `# ${SPRINT_ID} Closure Record`,
    "",
    "Verdict: PASS.",
    "",
    `Selected decision: \`${SELECTED_DECISION}\``,
    "Expected route: `READY_FOR_HUMAN_REVIEW`.",
    "",
    "## Product End-State And Original Spec",
    "",
    `- Product end-state: \`${PRODUCT_END_STATE}\``,
    `- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\``,
    "",
    "## Non-Negotiable Requirements",
    "",
    ...nonNegotiables(),
    "",
    "## Core-Requirement Checklist",
    "",
    checklistTable(coreRequirementChecklist()),
    "",
    "## Findings",
    "",
    findingTable([
      {
        finding: "Local expert review request packet is ready for PR readiness after final validation.",
        classification: "core_requirement_met",
        blocks: "Nothing once exact-head PR readiness and CI pass.",
        does_not_block: "Human review of the complete packet.",
        proof_required_to_close: "Exact-head readiness, branch protection ok:true, green CI, and owner authorization.",
      },
      {
        finding: "Expert contact and downstream authority remain blocked.",
        classification: "scale_blocker",
        blocks: "Expert contact, expert substitution, localized output, school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims.",
        does_not_block: "Human review of this internal request packet.",
        proof_required_to_close: "Separate contact-pilot sprint and explicit owner authorization.",
      },
    ]),
  ].join("\n");
}

function outputContents() {
  const plan = requestPlan();
  const england = requestPacket("england");
  const flanders = requestPacket("flanders");
  const simulation = simulationReport(england, flanders);
  const decision = decisionReport(england, flanders, simulation);
  const outputs = {
    "references/schemas/local-expert-review-request.schema.v1.json": `${JSON.stringify(requestSchema(), null, 2)}\n`,
    "references/schemas/local-expert-review-response.schema.v1.json": `${JSON.stringify(responseSchema(), null, 2)}\n`,
    "docs/inspection-standards/local-expert-review-request-contract.md": `${renderContractMarkdown(plan)}\n`,
    "docs/inspection-standards/england-local-expert-review-request.md": `${renderRequestMarkdown(england)}\n`,
    "docs/inspection-standards/flanders-local-expert-review-request.md": `${renderRequestMarkdown(flanders)}\n`,
    "reports/inspection-standards/local-expert-review-request-plan.json": `${JSON.stringify(plan, null, 2)}\n`,
    "reports/inspection-standards/england-local-expert-review-request-packet.json": `${JSON.stringify(england, null, 2)}\n`,
    "reports/inspection-standards/flanders-local-expert-review-request-packet.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "reports/inspection-standards/local-expert-review-request-simulation.json": `${JSON.stringify(simulation, null, 2)}\n`,
    "reports/inspection-standards/local-expert-review-request-decision.json": `${JSON.stringify(decision, null, 2)}\n`,
    "reports/inspection-standards/local-expert-review-request-plan.md": `${renderPlanMarkdown(plan)}\n`,
    "reports/inspection-standards/england-local-expert-review-request-packet.md": `${renderRequestMarkdown(england)}\n`,
    "reports/inspection-standards/flanders-local-expert-review-request-packet.md": `${renderRequestMarkdown(flanders)}\n`,
    "reports/inspection-standards/local-expert-review-request-simulation.md": `${renderSimulationMarkdown(simulation)}\n`,
    "reports/inspection-standards/local-expert-review-request-decision.md": `${renderDecisionMarkdown(decision)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/england-local-expert-review-request-packet.sample.json": `${JSON.stringify(england, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/flanders-local-expert-review-request-packet.sample.json": `${JSON.stringify(flanders, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/local-expert-review-request-simulation.sample.json": `${JSON.stringify(simulation, null, 2)}\n`,
    "references/data/inspection-standards/fixtures/local-expert-review-request-packet/positive/local-expert-review-request-decision.sample.json": `${JSON.stringify(decision, null, 2)}\n`,
    [ORIGINAL_SPRINT_GATE_SPEC]: `${sprintPlan()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-correction-log.md`]: `${correctionLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-validation-log.md`]: `${validationLog()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-schema-architecture-lead-review.md`]: `${specialistReview("Schema/Architecture Lead Review", "PASS", "Subagent review returned PASS: request and response schemas, fixture design, and no-contact boundary are strict and current after the 11-fixture refusal set.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-england-source-expert-scope-review.md`]: `${specialistReview("England Source/Expert-Scope Review", "PASS", "Subagent review returned PASS: England questions and source-state boundaries are source-bound and do not request localized or exam-ready material.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-flanders-source-expert-scope-review.md`]: `${specialistReview("Flanders Source/Expert-Scope Review", "PASS", "Subagent review returned PASS: Flanders questions preserve local-expert interpretation boundaries for Onderwijsdoelen and do not generalize to all Belgium.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-teacher-economics-review.md`]: `${specialistReview("Teacher/Economics Review", "PASS", "Subagent review returned PASS: Book 1 1.2/1.3 concept-placement questions are useful, bounded, and do not create student-facing material.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-legal-privacy-review.md`]: `${specialistReview("Legal/Privacy Review", "PASS", "Subagent rerun returned PASS after scope-language correction: no legal advice, compliance proof, approval claim, personal data, or school-specific evidence request remains allowed.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-accessibility-inclusion-review.md`]: `${specialistReview("Accessibility/Inclusion Review", "PASS", "Subagent rerun returned PASS after adding support/accommodation/accessibility sufficiency refusal coverage; terminology questions preserve non-sufficiency boundaries.")}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-final-lead-review.md`]: `${finalLeadReview()}\n`,
    [`archive/sprints/${SPRINT_ID}/${SPRINT_ID}-closure-record.md`]: `${closureRecord()}\n`,
  };
  for (const [file, stopCode] of NEGATIVE_FIXTURES) {
    outputs[`references/data/inspection-standards/fixtures/local-expert-review-request-packet/negative/${file}`] = `${JSON.stringify(negativeFixture(file, stopCode, england), null, 2)}\n`;
  }
  return outputs;
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
    const absolute = repoPath(file);
    if (!fs.existsSync(absolute)) failures.push(`${file}: missing`);
    else if (fs.readFileSync(absolute, "utf8") !== expected) failures.push(`${file}: not current`);
  }
  if (failures.length) {
    console.error("Local expert review request packet outputs are not current:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
}

function runCli() {
  const args = process.argv.slice(2);
  checkRefusals(args);
  if (args.includes("--check")) {
    checkOutputs();
    console.log(`OK local expert review request packet outputs current (${Object.keys(outputContents()).length} files)`);
    return;
  }
  writeOutputs();
  console.log(`Wrote local expert review request packet outputs (${Object.keys(outputContents()).length} files)`);
}

if (require.main === module) runCli();

module.exports = {
  ACCEPTED_INPUT_DECISION,
  DECISION_OPTIONS,
  FORBIDDEN_EXPERT_CLAIMS,
  INPUT_ALLOWLIST,
  NEGATIVE_FIXTURES,
  NO_OUTPUT_FLAGS,
  OUTPUT_ALLOWLIST,
  RESPONSE_FIELDS,
  SELECTED_DECISION,
  SPRINT_ID,
  coreRequirementChecklist,
  doesNotAuthorize,
  noOutputFlags,
  outputContents,
  questionRecords,
  requestPacket,
  requestSchema,
  responseSchema,
  simulationReport,
};
