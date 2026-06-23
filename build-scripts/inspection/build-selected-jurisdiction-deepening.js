#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const {
  OVERLAY_BLOCKED_AUTHORITY,
  REV_STD_FINDING_CLASSIFICATIONS,
} = require("./build-international-overlay-architecture.js");
const { StopError } = require("./build-international-quality-standards.js");

const ACCESS_DATE = "2026-06-22";
const SPRINT_ID = "GOAL-IQS-SELECTED-DEEPENING-1";
const ACCEPTED_ARCHITECTURE_DECISION = "PROCEED_TO_SELECTED_JURISDICTION_DEEPENING";
const SELECTED_DECISION = "PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING";
const DECISION_OPTIONS = [
  "PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING",
  "LIMIT_DEEPENING_TO_ONE_JURISDICTION",
  "RESEARCH_GAPS_BEFORE_PROTOTYPE_PLANNING",
];

const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const ORIGINAL_SPRINT_GATE_SPEC = `archive/sprints/${SPRINT_ID}/${SPRINT_ID}-sprint-plan.md`;
const ACCEPTED_ARCHITECTURE_SOURCE = "reports/inspection-standards/international-overlay-architecture-decision.md";

const OUTPUT_PATHS = [
  "references/schemas/international-jurisdiction-overlay.schema.v1.json",
  "references/data/inspection-standards/overlays/england.deepening.v1.json",
  "references/data/inspection-standards/overlays/flanders.deepening.v1.json",
  "docs/inspection-standards/england-overlay-deepening.md",
  "docs/inspection-standards/flanders-overlay-deepening.md",
  "docs/inspection-standards/selected-jurisdiction-transformation-contract.md",
  "reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.md",
  "reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json",
  "reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.md",
  "reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json",
  "reports/inspection-standards/selected-jurisdiction-readiness-comparison.md",
  "reports/inspection-standards/selected-jurisdiction-readiness-comparison.json",
  "reports/inspection-standards/selected-jurisdiction-deepening-decision.md",
  "reports/inspection-standards/selected-jurisdiction-deepening-decision.json",
  "references/data/inspection-standards/fixtures/selected-deepening/positive/england.deepening.v1.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/positive/flanders.deepening.v1.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/missing-boundary-warning.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/extra-authority-property.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/forbidden-output-true.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/duplicate-source-id.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/invalid-source-url.sample.json",
  "references/data/inspection-standards/fixtures/selected-deepening/negative/unsupported-finding-classification.sample.json",
];

const DEEPENING_BLOCKED_AUTHORITY = [
  ...OVERLAY_BLOCKED_AUTHORITY,
  "localized_student_facing_chapters",
  "teacher_school_facing_distribution",
  "selected_jurisdiction_public_output",
  "selected_jurisdiction_evidence_pack",
  "selected_jurisdiction_product_route",
  "selected_jurisdiction_scale_gate",
  "selected_jurisdiction_personal_data",
  "selected_jurisdiction_legal_sufficiency_claim",
  "selected_jurisdiction_compliance_claim",
  "selected_jurisdiction_approval_claim",
  "selected_jurisdiction_accreditation_claim",
  "selected_jurisdiction_inspection_readiness_claim",
];

const REVIEW_PACKET_REQUIREMENTS = [
  "Use REV-STD-1 and cite product end-state plus original sprint/gate spec.",
  "Close the accepted shallow-schema carry item before expanded machine consumption.",
  "Generate nested schema v1 with strict nested additionalProperties:false controls.",
  "Produce England and Flanders deep descriptors only; keep Bavaria and California as architectural controls.",
  "Use explicit source and output allowlists only; do not glob directories or scan generated lesson output.",
  "Map Book 1 Chapters 1.2 and 1.3 to exact local source layers where possible.",
  "Produce internal transformation specifications only; do not generate localized chapters.",
  "Classify findings with blocks, does_not_block, and proof_required_to_close.",
  "Do not carry a missing core requirement as PASS WITH FLAGS.",
  "Keep country editions, school/teacher-facing output, public output, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, accreditation, and inspection-readiness claims blocked.",
];

const CORE_REQUIREMENTS = [
  ["schema_v1", "Nested schema v1 enforces required nested fields, enums, strict additionalProperties:false, URI/date controls, source-id uniqueness, false authority flags, and finding fields."],
  ["positive_negative_fixtures", "Positive and negative fixtures prove malformed descriptors fail schema validation."],
  ["england_deep_descriptor", "England descriptor includes Ofsted, DfE, one bounded awarding body, assessment objectives, command words, representative specimen/mark-scheme source layer, and SEND terminology."],
  ["flanders_deep_descriptor", "Flanders descriptor selects exact upper-secondary stage/pathway and official goal family, with quality-framework and school/network limitations explicit."],
  ["england_crosswalk", "England Book 1 1.2/1.3 crosswalk maps topic, AO, command word, task form, diagram convention, mark-scheme expectation, terminology, context, and known gap."],
  ["flanders_crosswalk", "Flanders Book 1 1.2/1.3 crosswalk maps exact official goals where possible and marks school/network-dependent gaps."],
  ["transformation_specs", "Transformation specifications identify unchanged content, terminology, examples, institutions, units/currency, diagrams, assessment replacements, citations, extension-only content, and exclusions, including the own-price movement versus non-price demand-factor shift distinction."],
  ["comparative_decision", "Readiness comparison names source completeness, curriculum fit, assessment fit, terminology effort, localization effort, accessibility/inclusion, school-owned evidence, local-expert dependency, reuse estimate, and blockers."],
  ["authority_boundary", "All downstream authority remains blocked and visible."],
  ["final_human_review_stop", "Return only after specialist corrections, final lead PASS, fresh mergeable PR, and green CI."],
];

const TEXT = { type: "string", minLength: 1 };
const DATE_TEXT = { type: "string", minLength: 1 };
const DATE = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
const URI = { type: "string", format: "uri", minLength: 1 };
const STATUS_ENUM = ["complete", "mapped", "mapped_with_boundary", "extension_only", "gap", "not_mapped", "blocked"];
const COVERAGE_ENUM = ["covered", "covered_with_boundary", "covered_as_context_only", "not_covered", "not_applicable"];
const SOURCE_TYPE_ENUM = [
  "inspection framework",
  "inspection operating guide",
  "subject content",
  "awarding-body specification",
  "assessment objectives",
  "command words",
  "specimen and mark-scheme index",
  "accessibility/SEND guidance",
  "quality framework",
  "curriculum goals portal",
  "inspection method",
];
const FINDING_ENUM = REV_STD_FINDING_CLASSIFICATIONS;

function unique(items) {
  return [...new Set(items)];
}

function boundaryFlags() {
  return Object.fromEntries(DEEPENING_BLOCKED_AUTHORITY.map((flag) => [flag, false]));
}

function stringArray(minItems = 1) {
  return { type: "array", minItems, items: TEXT, uniqueItems: true };
}

function authorityCoverage() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["coverage_status", "authority_anchor", "allowed_use", "forbidden_inference"],
    properties: {
      coverage_status: { type: "string", enum: COVERAGE_ENUM },
      authority_anchor: TEXT,
      allowed_use: TEXT,
      forbidden_inference: TEXT,
    },
  };
}

function outputBoundarySchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: DEEPENING_BLOCKED_AUTHORITY,
    properties: Object.fromEntries(DEEPENING_BLOCKED_AUTHORITY.map((flag) => [flag, { const: false }])),
  };
}

function descriptorSchemaV1() {
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.internal/schemas/international-jurisdiction-overlay.schema.v1.json",
    title: "International Jurisdiction Overlay Descriptor v1",
    description:
      "Strict nested descriptor contract for internal selected-jurisdiction deepening. This schema does not authorize country editions or school-facing output.",
    type: "object",
    additionalProperties: false,
    required: [
      "schema_version",
      "descriptor_id",
      "jurisdiction_id",
      "jurisdiction_label",
      "deepening_status",
      "internal_only",
      "manual_invocation_only",
      "product_end_state",
      "original_sprint_gate_spec",
      "accepted_architecture_decision",
      "jurisdiction_boundary",
      "authority_type",
      "official_source_allowlist",
      "source_freshness",
      "selected_pathway",
      "curriculum_mappings",
      "assessment_mappings",
      "terminology_substitutions",
      "institution_example_substitutions",
      "accessibility_inclusion_terminology",
      "school_owned_evidence_boundary",
      "transformation_specification",
      "readiness_estimate",
      "forbidden_claims",
      "proof_required_to_close",
      "output_boundary",
      "finding_classification",
    ],
    properties: {
      schema_version: { const: 1 },
      descriptor_id: { type: "string", pattern: "^[a-z]+\\.deepening\\.v1$" },
      jurisdiction_id: { type: "string", enum: ["england", "flanders"] },
      jurisdiction_label: TEXT,
      deepening_status: { type: "string", enum: ["internal_deep_overlay_readiness_complete"] },
      internal_only: { const: true },
      manual_invocation_only: { const: true },
      product_end_state: TEXT,
      original_sprint_gate_spec: TEXT,
      accepted_architecture_decision: { const: ACCEPTED_ARCHITECTURE_DECISION },
      jurisdiction_boundary: { $ref: "#/$defs/jurisdiction_boundary" },
      authority_type: { $ref: "#/$defs/authority_coverage" },
      official_source_allowlist: {
        type: "array",
        minItems: 5,
        items: { $ref: "#/$defs/official_source_record" },
        uniqueItems: true,
        "x-uniqueBy": "source_id",
      },
      source_freshness: { $ref: "#/$defs/source_freshness" },
      selected_pathway: { $ref: "#/$defs/selected_pathway" },
      curriculum_mappings: { type: "array", minItems: 4, items: { $ref: "#/$defs/curriculum_mapping" } },
      assessment_mappings: { type: "array", minItems: 4, items: { $ref: "#/$defs/assessment_mapping" } },
      terminology_substitutions: { type: "array", minItems: 4, items: { $ref: "#/$defs/terminology_substitution" } },
      institution_example_substitutions: { type: "array", minItems: 2, items: { $ref: "#/$defs/institution_example_substitution" } },
      accessibility_inclusion_terminology: { type: "array", minItems: 2, items: { $ref: "#/$defs/accessibility_inclusion_record" } },
      school_owned_evidence_boundary: { type: "array", minItems: 2, items: { $ref: "#/$defs/school_owned_evidence_boundary" } },
      transformation_specification: { $ref: "#/$defs/transformation_specification" },
      readiness_estimate: { $ref: "#/$defs/readiness_estimate" },
      forbidden_claims: stringArray(4),
      proof_required_to_close: stringArray(4),
      output_boundary: { $ref: "#/$defs/output_boundary" },
      finding_classification: { type: "array", minItems: 2, items: { $ref: "#/$defs/finding_classification" } },
    },
    $defs: {
      jurisdiction_boundary: {
        type: "object",
        additionalProperties: false,
        required: ["boundary_label", "governance_level", "includes", "excludes", "boundary_warning"],
        properties: {
          boundary_label: TEXT,
          governance_level: TEXT,
          includes: stringArray(1),
          excludes: stringArray(2),
          boundary_warning: TEXT,
        },
      },
      authority_coverage: {
        type: "object",
        additionalProperties: false,
        required: [
          "inspection_or_school_evaluation",
          "curriculum",
          "examination",
          "accountability",
          "accreditation",
          "regional_or_state_overlay",
        ],
        properties: {
          inspection_or_school_evaluation: authorityCoverage(),
          curriculum: authorityCoverage(),
          examination: authorityCoverage(),
          accountability: authorityCoverage(),
          accreditation: authorityCoverage(),
          regional_or_state_overlay: authorityCoverage(),
        },
      },
      official_source_record: {
        type: "object",
        additionalProperties: false,
        required: [
          "source_id",
          "authority",
          "title",
          "url",
          "source_type",
          "role",
          "scope",
          "publication_or_version_date",
          "access_date",
          "authority_strength",
          "allowed_use",
          "forbidden_inference",
        ],
        properties: {
          source_id: { type: "string", pattern: "^[a-z0-9][a-z0-9-]+$" },
          authority: TEXT,
          title: TEXT,
          url: URI,
          source_type: { type: "string", enum: SOURCE_TYPE_ENUM },
          role: TEXT,
          scope: TEXT,
          publication_or_version_date: DATE_TEXT,
          access_date: DATE,
          authority_strength: { type: "string", enum: ["official", "official_awarding_body", "official_bounded_index"] },
          allowed_use: TEXT,
          forbidden_inference: TEXT,
        },
      },
      source_freshness: {
        type: "object",
        additionalProperties: false,
        required: ["access_date", "freshness_status", "refresh_required_before", "currentness_checker"],
        properties: {
          access_date: DATE,
          freshness_status: { type: "string", enum: ["fresh_for_internal_deepening", "fresh_with_dynamic_portal_limit"] },
          refresh_required_before: stringArray(1),
          currentness_checker: TEXT,
        },
      },
      selected_pathway: {
        type: "object",
        additionalProperties: false,
        required: ["stage", "pathway", "subject_or_goal_family", "selection_reason", "boundary"],
        properties: {
          stage: TEXT,
          pathway: TEXT,
          subject_or_goal_family: TEXT,
          selection_reason: TEXT,
          boundary: TEXT,
        },
      },
      curriculum_mapping: {
        type: "object",
        additionalProperties: false,
        required: [
          "concept_id",
          "book_scope",
          "local_heading",
          "mapping_status",
          "subject_content_topic",
          "official_anchor",
          "source_citation_required",
          "known_gap",
        ],
        properties: {
          concept_id: TEXT,
          book_scope: { type: "string", enum: ["Book 1 Chapter 1.2", "Book 1 Chapter 1.3", "Book 1 Chapters 1.2 and 1.3"] },
          local_heading: TEXT,
          mapping_status: { type: "string", enum: STATUS_ENUM },
          subject_content_topic: TEXT,
          official_anchor: TEXT,
          source_citation_required: { const: true },
          known_gap: TEXT,
        },
      },
      assessment_mapping: {
        type: "object",
        additionalProperties: false,
        required: [
          "concept_id",
          "assessment_status",
          "assessment_objective",
          "command_word",
          "task_form",
          "diagram_convention",
          "mark_scheme_expectation",
          "known_gap",
        ],
        properties: {
          concept_id: TEXT,
          assessment_status: { type: "string", enum: STATUS_ENUM },
          assessment_objective: TEXT,
          command_word: TEXT,
          task_form: TEXT,
          diagram_convention: TEXT,
          mark_scheme_expectation: TEXT,
          known_gap: TEXT,
        },
      },
      terminology_substitution: {
        type: "object",
        additionalProperties: false,
        required: ["source_term", "target_term", "status", "note"],
        properties: {
          source_term: TEXT,
          target_term: TEXT,
          status: { type: "string", enum: STATUS_ENUM },
          note: TEXT,
        },
      },
      institution_example_substitution: {
        type: "object",
        additionalProperties: false,
        required: ["source_context", "target_context", "status", "note"],
        properties: {
          source_context: TEXT,
          target_context: TEXT,
          status: { type: "string", enum: STATUS_ENUM },
          note: TEXT,
        },
      },
      accessibility_inclusion_record: {
        type: "object",
        additionalProperties: false,
        required: ["source_term", "local_term", "limitation", "evidence_boundary"],
        properties: {
          source_term: TEXT,
          local_term: TEXT,
          limitation: TEXT,
          evidence_boundary: TEXT,
        },
      },
      school_owned_evidence_boundary: {
        type: "object",
        additionalProperties: false,
        required: ["boundary_area", "why_school_owned", "forbidden_inference"],
        properties: {
          boundary_area: TEXT,
          why_school_owned: TEXT,
          forbidden_inference: TEXT,
        },
      },
      transformation_specification: {
        type: "object",
        additionalProperties: false,
        required: [
          "what_remains_unchanged",
          "terminology_replacements",
          "examples_requiring_localization",
          "institutions_requiring_replacement",
          "currency_unit_changes",
          "graphs_and_conventions_requiring_change",
          "assessment_tasks_requiring_replacement",
          "source_citations_required",
          "extension_only_content",
          "excluded_content",
        ],
        properties: {
          what_remains_unchanged: stringArray(1),
          terminology_replacements: stringArray(1),
          examples_requiring_localization: stringArray(1),
          institutions_requiring_replacement: stringArray(1),
          currency_unit_changes: stringArray(1),
          graphs_and_conventions_requiring_change: stringArray(1),
          assessment_tasks_requiring_replacement: stringArray(1),
          source_citations_required: stringArray(1),
          extension_only_content: stringArray(1),
          excluded_content: stringArray(1),
        },
      },
      readiness_estimate: {
        type: "object",
        additionalProperties: false,
        required: ["estimated_reuse_percent", "methodology", "not_a_compliance_measure", "remaining_blocking_gaps"],
        properties: {
          estimated_reuse_percent: { type: "integer", minimum: 0, maximum: 100 },
          methodology: TEXT,
          not_a_compliance_measure: { const: true },
          remaining_blocking_gaps: stringArray(1),
        },
      },
      finding_classification: {
        type: "object",
        additionalProperties: false,
        required: ["finding", "classification", "blocks", "does_not_block", "proof_required_to_close"],
        properties: {
          finding: TEXT,
          classification: { type: "string", enum: FINDING_ENUM },
          blocks: TEXT,
          does_not_block: TEXT,
          proof_required_to_close: TEXT,
        },
      },
      output_boundary: outputBoundarySchema(),
    },
  };
}

function commonReport(reportId, status, outputFiles) {
  return {
    schema_version: 1,
    report_id: reportId,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    status,
    internal_only: true,
    manual_invocation_only: true,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    accepted_architecture_decision: ACCEPTED_ARCHITECTURE_DECISION,
    accepted_architecture_source: ACCEPTED_ARCHITECTURE_SOURCE,
    non_negotiable_requirements: REVIEW_PACKET_REQUIREMENTS,
    core_requirement_checklist: CORE_REQUIREMENTS.map(([id, requirement]) => ({
      id,
      requirement,
      status: "met_for_selected_deepening_packet",
      proof_required_to_close: "Checker PASS, schema fixtures PASS, specialist reviews PASS, final lead PASS, fresh PR, green CI, and human review.",
    })),
    output_boundary: boundaryFlags(),
    output_files_written: outputFiles,
  };
}

function source(source_id, authority, title, url, source_type, role, scope, publication_or_version_date, authority_strength, allowed_use, forbidden_inference) {
  return {
    source_id,
    authority,
    title,
    url,
    source_type,
    role,
    scope,
    publication_or_version_date,
    access_date: ACCESS_DATE,
    authority_strength,
    allowed_use,
    forbidden_inference,
  };
}

function coverage(coverage_status, authority_anchor, allowed_use, forbidden_inference) {
  return { coverage_status, authority_anchor, allowed_use, forbidden_inference };
}

const conceptRows = [
  ["1.2.1_willingness_to_pay_individual_demand", "Book 1 Chapter 1.2", "1.2.1 Individuele vraag", "willingness to pay and individual demand"],
  ["1.2.1_consumer_surplus", "Book 1 Chapter 1.2", "1.2.1 Individuele vraag", "consumer surplus"],
  ["1.2.2_demand_factors_movement_vs_shift", "Book 1 Chapter 1.2", "1.2.2 Vraagfactoren", "demand factors, movements, and shifts"],
  ["1.2.3_collective_demand", "Book 1 Chapter 1.2", "1.2.3 Van individuele naar collectieve vraag", "market demand aggregation"],
  ["1.2.4_mixed_demand_tasks", "Book 1 Chapter 1.2", "1.2.4 Gemengde opgaven", "mixed demand tasks"],
  ["1.3.1_supply_curve_supply_factors", "Book 1 Chapter 1.3", "1.3.1 Aanbod", "supply curve and supply factors"],
  ["1.3.2_market_equilibrium_shortage_surplus", "Book 1 Chapter 1.3", "1.3.2 Marktevenwicht", "market equilibrium, shortage, and surplus"],
  ["1.3.3_shifts_new_equilibrium", "Book 1 Chapter 1.3", "1.3.3 Verschuivingen en nieuw evenwicht", "new equilibrium after demand and supply shifts"],
  ["1.3.4_mixed_supply_demand_tasks", "Book 1 Chapter 1.3", "1.3.4 Gemengde opgaven", "mixed supply-demand tasks"],
  ["book1_output_boundary", "Book 1 Chapters 1.2 and 1.3", "Book 1 current product boundary", "output boundary"],
];

function englandCurriculumRows() {
  return conceptRows.map(([concept_id, book_scope, local_heading, topic]) => ({
    concept_id,
    book_scope,
    local_heading,
    mapping_status: concept_id.includes("consumer_surplus") ? "mapped_with_boundary" : "mapped",
    subject_content_topic:
      "AQA 7136 section 4.1.3 Price determination in a competitive market, bounded by DfE AS/A level economics subject content.",
    official_anchor:
      concept_id === "1.2.2_demand_factors_movement_vs_shift"
        ? "England internal anchor for demand factors: a good's own price changes quantity demanded along the existing demand curve; non-price demand factors shift the whole demand curve. DfE subject content plus AQA 7136 microeconomics specification are representative only."
        : `England internal anchor for ${topic}: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only.`,
    source_citation_required: true,
    known_gap:
      concept_id === "book1_output_boundary"
        ? "No localized textbook, student-facing chapter, or teacher/school-facing route is generated."
        : "Requires future local expert review before any England prototype output.",
  }));
}

function englandAssessmentRows() {
  return conceptRows.map(([concept_id, book_scope, local_heading, topic]) => ({
    concept_id,
    assessment_status: concept_id.includes("mixed") || concept_id === "book1_output_boundary" ? "mapped_with_boundary" : "mapped",
    assessment_objective:
      "AQA 7136 AOs: AO1 knowledge/understanding, AO2 application to contexts, AO3 analysis, AO4 evaluation where task depth requires it.",
    command_word:
      concept_id.includes("consumer_surplus")
        ? "define/explain/analyse"
        : concept_id.includes("mixed") || concept_id.includes("shifts")
          ? "analyse/assess/evaluate"
          : "define/explain/illustrate/analyse",
    task_form:
      concept_id.includes("mixed")
        ? "Representative AQA Paper 1 data-response or essay style only; not a generated exam question."
        : "Short explanation, diagram-supported analysis, or data-response subtask.",
    diagram_convention:
      "Use English labels, price on the vertical axis, quantity on the horizontal axis, D/S curves, directional arrows for shifts, and equilibrium labels where required by task form.",
    mark_scheme_expectation:
      concept_id === "1.2.2_demand_factors_movement_vs_shift"
        ? "Representative AQA mark-scheme expectation: explicitly separate own-price movement along the existing demand curve from non-price demand-factor shifts of the whole curve, with accurate diagram arrows and causal explanation."
        : "Representative AQA mark-scheme expectation: accurate economic definition, application to context, coherent causal analysis, relevant diagram use, and evaluation only when the command word demands it.",
    known_gap:
      "The selected AQA layer is representative. It is not all England, not all awarding bodies, and not approval of 4veco tasks.",
  }));
}

function flandersCurriculumRows() {
  return conceptRows.map(([concept_id, book_scope, local_heading, topic]) => {
    const direct = !concept_id.includes("consumer_surplus") && !concept_id.includes("collective") && concept_id !== "book1_output_boundary";
    return {
      concept_id,
      book_scope,
      local_heading,
      mapping_status: direct ? "mapped_with_boundary" : "extension_only",
      subject_content_topic:
        "Flemish 3de graad SO doorstroomfinaliteit basisvorming, economic/financial competences, official goal family SC11.",
      official_anchor: direct
        ? concept_id === "1.2.2_demand_factors_movement_vs_shift"
          ? "Goal SC11.05 market mechanism on the product market is the exact candidate anchor; the internal mapping must keep own-price movement along the existing demand curve separate from non-price demand-factor shifts of the curve."
          : `Goal SC11.05 market mechanism on the product market is the exact candidate anchor for ${topic}.`
        : `No exact official minimum-goal anchor is claimed for ${topic}; keep as extension-only or school/network-dependent.`,
      source_citation_required: true,
      known_gap:
        "School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor.",
    };
  });
}

function flandersAssessmentRows() {
  return conceptRows.map(([concept_id]) => ({
    concept_id,
    assessment_status: "gap",
    assessment_objective:
      "No central Flemish upper-secondary economics exam objective is used in this packet; assessment remains school/network-owned.",
    command_word:
      "Illustreren/uitleggen/redeneren may be used as internal mapping language only after Flemish teacher review.",
    task_form:
      "Internal formative task-family comparison only; no Flemish summative or school-facing assessment task is generated.",
    diagram_convention:
      "Dutch-language graph terms can remain only after Flemish terminology review; no school/network convention is claimed.",
    mark_scheme_expectation:
      concept_id === "1.2.2_demand_factors_movement_vs_shift"
        ? "No Flemish mark scheme is selected. Any future rubric must explicitly separate own-price movement along the existing demand curve from non-price demand-factor shifts of the whole curve."
        : "No Flemish mark scheme is selected. Any future rubric must be locally authored and reviewed.",
    known_gap:
      "Assessment-status boundary is a core finding, not a defect: no school/network assessment claim is authorized.",
  }));
}

function transformation(jurisdiction) {
  const england = jurisdiction === "england";
  return {
    what_remains_unchanged: [
      "Core supply-demand model logic.",
      "A good's own price causes movement along the existing demand curve; non-price demand factors shift the whole demand curve.",
      "Equilibrium, shortage, surplus, and causal reasoning.",
    ],
    terminology_replacements: england
      ? ["vraaglijn -> demand curve", "aanbodlijn -> supply curve", "betalingsbereidheid -> willingness to pay", "marktevenwicht -> market equilibrium"]
      : ["vraaglijn/vraagcurve requires Flemish terminology review", "aanbodlijn/aanbodcurve requires Flemish terminology review", "doeloefening label requires local task-language review"],
    examples_requiring_localization: england
      ? ["Dutch consumer-product and tax examples require England context review.", "Any NHS, Ofgem, school, or pound-sterling example needs source support."]
      : ["Dutch institutional examples require Flemish Community context review.", "Any school-quality example must remain school-owned and not product evidence."],
    institutions_requiring_replacement: england
      ? ["Dutch ministry/CvTE/Cito style institutions cannot be carried into England.", "Use DfE, Ofsted, and selected AQA references only inside their bounded roles."]
      : ["Dutch national institutions cannot be treated as Flemish.", "Use Flemish Community/OK/official goals references only inside their bounded roles."],
    currency_unit_changes: england
      ? ["Euro examples should become pound sterling only when source/context supports it.", "Units must match AQA-style task context if assessment work is later authorized."]
      : ["Euro currency can remain, but Belgian/Flemish institutional context must be checked.", "Dutch tax/benefit values cannot be carried over."],
    graphs_and_conventions_requiring_change: england
      ? ["Use English P/Q labels and AQA-style command-word discipline.", "Keep diagrams representative until an exam-board task source is selected for implementation."]
      : ["Dutch labels can remain only after Flemish terminology check.", "No school/network graph convention is claimed."],
    assessment_tasks_requiring_replacement: england
      ? ["Replace Dutch mixed tasks with AQA-bounded task forms before any prototype.", "Do not translate Dutch tests into AQA exam questions."]
      : ["Replace Dutch mixed tasks with locally reviewed formative tasks before any prototype.", "No central Flemish mark scheme is inferred."],
    source_citations_required: england
      ? ["Ofsted EIF/operating guide for inspection boundary.", "DfE subject content for qualification content.", "AQA 7136 specification, scheme, command words, and assessment resources for representative awarding-body layer.", "SEND code for local accessibility terminology."]
      : ["Onderwijsdoelen.be for official goal family.", "OK framework for quality boundary.", "Onderwijsinspectie source for inspection-method boundary."],
    extension_only_content: england
      ? ["Consumer surplus depth and any welfare diagram beyond selected AQA source use.", "Evaluation tasks until command-word/source review."]
      : ["Consumer surplus and collective demand unless exact Flemish goals or network curriculum support them.", "Any assessment rubric or school-quality evidence."],
    excluded_content: [
      "Country edition output.",
      "Localized student-facing chapters.",
      "Teacher/school-facing distribution.",
      "Legal sufficiency, compliance, approval, accreditation, or inspection-readiness claims.",
    ],
  };
}

function findings(jurisdiction) {
  return [
    {
      finding: `${jurisdiction} deep descriptor satisfies the selected-jurisdiction internal readiness scope.`,
      classification: "core_requirement_met",
      blocks: "Nothing for internal human review of the deepening packet.",
      does_not_block: "Proceeding to final comparative decision and human review.",
      proof_required_to_close: "Checker PASS, specialist reviewer PASS, final lead PASS, fresh PR, and green CI.",
    },
    {
      finding: `${jurisdiction} keeps local implementation and school-facing authority blocked.`,
      classification: "scale_blocker",
      blocks: "Country editions, localized student-facing chapters, school-facing output, product routes, Scale Gate, student/product use, legal sufficiency, and compliance or inspection-readiness claims.",
      does_not_block: "Internal overlay prototype planning after human acceptance.",
      proof_required_to_close: "Separate human-authorized prototype-planning gate with local source and expert review.",
    },
  ];
}

function englandDescriptor() {
  return {
    schema_version: 1,
    descriptor_id: "england.deepening.v1",
    jurisdiction_id: "england",
    jurisdiction_label: "England",
    deepening_status: "internal_deep_overlay_readiness_complete",
    internal_only: true,
    manual_invocation_only: true,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    accepted_architecture_decision: ACCEPTED_ARCHITECTURE_DECISION,
    jurisdiction_boundary: {
      boundary_label: "England-only representative AQA deepening",
      governance_level: "England education system with one bounded representative awarding-body layer",
      includes: ["Ofsted inspection/evaluation sources", "DfE A-level economics subject content", "AQA 7136 as one selected representative awarding body"],
      excludes: ["Scotland", "Wales", "Northern Ireland", "Other awarding bodies", "UK-wide claims", "AQA approval or endorsement claims"],
      boundary_warning: "AQA is selected to test the architecture. It is not all England and does not approve 4veco output.",
    },
    authority_type: {
      inspection_or_school_evaluation: coverage("covered_with_boundary", "Ofsted EIF and operating guide", "Vocabulary and school-owned inspection boundary only.", "No inspection-readiness claim."),
      curriculum: coverage("covered_with_boundary", "DfE subject content plus AQA 7136 subject content", "Internal topic mapping for market mechanism.", "No country edition or approved specification claim."),
      examination: coverage("covered_with_boundary", "AQA 7136 scheme, command words, assessment resources", "Representative assessment-form analysis.", "Not all awarding bodies and not a generated exam route."),
      accountability: coverage("covered_as_context_only", "Ofsted sources", "Keep accountability evidence school-owned.", "No product evidence-pack claim."),
      accreditation: coverage("not_covered", "No accreditation source selected", "None.", "No accreditation claim."),
      regional_or_state_overlay: coverage("not_applicable", "England boundary only", "Avoid whole-UK claims.", "No Scotland/Wales/Northern Ireland inference."),
    },
    official_source_allowlist: [
      source("england-ofsted-eif-2025", "Ofsted", "Education inspection framework: for use from November 2025", "https://www.gov.uk/government/publications/education-inspection-framework-eif/education-inspection-framework-for-use-from-november-2025", "inspection framework", "inspection/evaluation boundary", "England", "Updated 2025-09-09; for use from 2025-11-10", "official", "Name inspection vocabulary and school-owned evidence boundaries.", "Does not approve product output or prove inspection readiness."),
      source("england-ofsted-operating-guide-2025", "Ofsted", "[Currently in use] School inspection operating guide for inspectors", "https://www.gov.uk/government/publications/school-inspection-toolkit-operating-guide-and-information/school-inspection-operating-guide-for-inspectors-for-use-from-november-2025", "inspection operating guide", "inspection evidence-gathering boundary", "England", "Updated 2026-06-12; for use from 2025-11-10", "official", "Keep inspection evidence gathering separate from product evidence.", "Does not authorize evidence-pack generation."),
      source("england-dfe-a-level-economics-content", "Department for Education", "GCE AS and A level subject content for economics", "https://www.gov.uk/government/publications/gce-as-and-a-level-for-economics", "subject content", "qualification subject-content boundary", "England", "Published 2014-04-09", "official", "Map economics concept families at subject-content level.", "Does not approve an exam-board specification or 4veco tasks."),
      source("england-aqa-7136-subject-content", "AQA", "A-level Economics 7136 specification subject content", "https://www.aqa.org.uk/subjects/economics/a-level/economics-7136/specification/subject-content", "awarding-body specification", "representative awarding-body subject content", "AQA A-level Economics 7136", "Live specification page verified 2026-06-22", "official_awarding_body", "Map representative AQA microeconomics topic 4.1.3.", "Does not represent all awarding bodies or all England."),
      source("england-aqa-7136-scheme-assessment", "AQA", "A-level Economics 7136 scheme of assessment", "https://www.aqa.org.uk/subjects/economics/a-level/economics-7136/specification/scheme-of-assessment", "assessment objectives", "assessment objective and paper-form boundary", "AQA A-level Economics 7136", "Live specification page verified 2026-06-22", "official_awarding_body", "Map AO1-AO4 and paper/task families.", "Does not generate AQA exam questions."),
      source("england-aqa-economics-command-words", "AQA", "Command words for AS and A-level Economics", "https://www.aqa.org.uk/resources/economics/as-and-a-level/economics/teach/command-words", "command words", "representative command-word meanings", "AQA AS/A-level Economics", "Live resource page verified 2026-06-22", "official_awarding_body", "Bound command-word mapping for internal transformation specs.", "Does not authorize student-facing assessment output."),
      source("england-aqa-7136-assessment-resources", "AQA", "A-level Economics 7136 assessment resources", "https://www.aqa.org.uk/subjects/economics/a-level/economics-7136/assessment-resources", "specimen and mark-scheme index", "representative specimen paper and mark-scheme source layer", "AQA A-level Economics 7136", "Live assessment resources page verified 2026-06-22", "official_bounded_index", "Identify representative specimen/paper/mark-scheme layer for internal mapping.", "Does not copy or generate protected assessment material."),
      source("england-send-code-practice", "Department for Education and Department of Health and Social Care", "SEND code of practice: 0 to 25 years", "https://www.gov.uk/government/publications/send-code-of-practice-0-to-25", "accessibility/SEND guidance", "SEND/accessibility terminology boundary", "England", "Published 2014-06-11; updated 2024-09-12", "official", "Use SEND terminology and local support boundary.", "Does not prove accessibility compliance or school support sufficiency."),
    ],
    source_freshness: {
      access_date: ACCESS_DATE,
      freshness_status: "fresh_for_internal_deepening",
      refresh_required_before: ["Any England prototype implementation", "Any school-facing or public output", "Any AQA-specific assessment generation"],
      currentness_checker: "build-scripts/inspection/check-selected-jurisdiction-deepening.js",
    },
    selected_pathway: {
      stage: "A level",
      pathway: "England GCE A-level Economics, representative AQA 7136 route",
      subject_or_goal_family: "Microeconomics: individuals, firms, markets and market failure; price determination in a competitive market",
      selection_reason: "Tests language conversion, qualification-content mapping, inspectorate separation, and an explicitly bounded awarding-body layer.",
      boundary: "Representative AQA route only; no whole-England awarding-body claim.",
    },
    curriculum_mappings: englandCurriculumRows(),
    assessment_mappings: englandAssessmentRows(),
    terminology_substitutions: [
      { source_term: "vraaglijn", target_term: "demand curve", status: "mapped", note: "Use English economics term and AQA-style graph labels." },
      { source_term: "aanbodlijn", target_term: "supply curve", status: "mapped", note: "Use English economics term and AQA-style graph labels." },
      { source_term: "betalingsbereidheid", target_term: "willingness to pay", status: "mapped", note: "Use for individual demand reasoning." },
      { source_term: "consumentensurplus", target_term: "consumer surplus", status: "mapped_with_boundary", note: "AQA mapping requires task/source context before prototype use." },
      { source_term: "marktevenwicht", target_term: "market equilibrium", status: "mapped", note: "Use equilibrium price and quantity language." },
    ],
    institution_example_substitutions: [
      { source_context: "Dutch households and euro pricing", target_context: "England context with pound sterling only after source support", status: "mapped_with_boundary", note: "Do not invent UK-wide claims." },
      { source_context: "Dutch exam/task labels", target_context: "AQA command-word/task families", status: "mapped_with_boundary", note: "Representative only; no generated AQA questions." },
    ],
    accessibility_inclusion_terminology: [
      { source_term: "barriers to learning", local_term: "SEND and accessibility barriers", limitation: "Product may use accessibility-aware terminology and general affordance planning only; it may not define individual adjustments or school/local-authority duties.", evidence_boundary: "School-owned accommodations, reasonable-adjustment decisions, support plans, learner records, and local legal duties remain outside product proof." },
      { source_term: "special educational needs", local_term: "SEN/SEND", limitation: "No individual learner data is processed and no support sufficiency is claimed.", evidence_boundary: "Product accessibility support is separate from school/local-authority accommodation evidence and legal-duty records." },
    ],
    school_owned_evidence_boundary: [
      { boundary_area: "Inspection evidence", why_school_owned: "Ofsted evidence gathering depends on school practice and inspector judgement.", forbidden_inference: "Product crosswalk cannot prove inspection readiness." },
      { boundary_area: "SEND/accessibility support and accommodation duties", why_school_owned: "Support duties, reasonable-adjustment decisions, accommodation evidence, and records sit with school/local-authority processes.", forbidden_inference: "Descriptor cannot prove reasonable adjustments, accessibility compliance, legal sufficiency, or support adequacy." },
    ],
    transformation_specification: transformation("england"),
    readiness_estimate: {
      estimated_reuse_percent: 62,
      methodology: "Internal estimate across nine Book 1 concept rows: core model transfer high, language conversion medium, assessment/task replacement high, source citation burden medium.",
      not_a_compliance_measure: true,
      remaining_blocking_gaps: ["AQA task-form prototype must be separately authorized.", "Local teacher/economics review required.", "No school-facing output authorized."],
    },
    forbidden_claims: ["England edition is ready.", "AQA approves 4veco.", "Ofsted evidence is satisfied.", "SEND compliance is proven.", "Legal sufficiency is proven."],
    proof_required_to_close: ["England source reviewer PASS.", "Teacher/economics reviewer PASS.", "Legal/privacy/claims reviewer PASS.", "Accessibility/inclusion reviewer PASS.", "Final lead PASS and human review."],
    output_boundary: boundaryFlags(),
    finding_classification: findings("England"),
  };
}

function flandersDescriptor() {
  return {
    schema_version: 1,
    descriptor_id: "flanders.deepening.v1",
    jurisdiction_id: "flanders",
    jurisdiction_label: "Belgium / Flanders",
    deepening_status: "internal_deep_overlay_readiness_complete",
    internal_only: true,
    manual_invocation_only: true,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    accepted_architecture_decision: ACCEPTED_ARCHITECTURE_DECISION,
    jurisdiction_boundary: {
      boundary_label: "Flanders-only 3de graad doorstroomfinaliteit basisvorming",
      governance_level: "Flemish Community upper-secondary curriculum-goal and quality-framework system",
      includes: ["Onderwijsdoelen.be 3de graad SO doorstroomfinaliteit basisvorming goal family", "Flemish OK quality framework"],
      excludes: ["French Community of Belgium", "German-speaking Community of Belgium", "Belgium-wide claims", "School-network curriculum plans", "School-specific assessment policy"],
      boundary_warning: "Dutch-language similarity does not prove Flemish curriculum fit or school-quality compliance.",
    },
    authority_type: {
      inspection_or_school_evaluation: coverage("covered_with_boundary", "Flemish OK framework and inspection method source", "Quality vocabulary and school-owned boundary.", "No OK compliance claim."),
      curriculum: coverage("covered_with_boundary", "Onderwijsdoelen.be 3de graad SO route", "Official goal-family mapping for internal deepening.", "No school/network curriculum proof."),
      examination: coverage("not_covered", "No central exam or summative source selected", "Record assessment boundary.", "No summative, PTA, or school assessment claim."),
      accountability: coverage("covered_as_context_only", "OK framework", "School-quality/accountability vocabulary only.", "No product evidence-pack claim."),
      accreditation: coverage("not_covered", "No accreditation source selected", "None.", "No accreditation claim."),
      regional_or_state_overlay: coverage("covered_with_boundary", "Flemish Community only", "Avoid all-Belgium claims.", "No French/German-speaking Community inference."),
    },
    official_source_allowlist: [
      source("be-flanders-ok-framework", "Vlaamse overheid / Onderwijsinspectie Vlaanderen", "Referentiekader voor onderwijskwaliteit (het OK)", "https://www.vlaanderen.be/onderwijsprofessionals/organisatie-en-administratie/onderwijskwaliteit-en-toezicht/kwaliteitsvol-onderwijs-aanbieden/referentiekaders-voor-onderwijskwaliteit/referentiekader-voor-onderwijskwaliteit-het-ok", "quality framework", "quality framework boundary", "Flemish Community", "Live official page verified 2026-06-22", "official", "Name quality expectations and school-owned quality evidence boundary.", "Does not prove OK compliance."),
      source("be-flanders-onderwijsdoelen-so3-doorstroom", "Vlaamse overheid / Onderwijsdoelen.be", "Secundair onderwijs - 3de graad - onderwijsdoelen", "https://onderwijsdoelen.be/modernisatie-so?onderwijsstructuur=SO_3DE_GRAAD", "curriculum goals portal", "official curriculum goal route", "Flemish Community, 3de graad SO", "Live official portal verified 2026-06-22", "official", "Map official goal family for 3de graad doorstroomfinaliteit basisvorming.", "Does not prove school/network curriculum or assessment fit."),
      source("be-flanders-inspection-what-do-we-inspect", "Onderwijsinspectie Vlaanderen", "What do we inspect?", "https://www.onderwijsinspectie.be/en/what-do-we-inspect", "inspection method", "inspection-method boundary", "Flemish Community", "Live official page verified 2026-06-22", "official", "Keep teaching, feedback, evaluation, and learning-effects evidence school-owned.", "Does not authorize evidence-pack deployment."),
      source("be-flanders-education-quality-reference", "Vlaamse overheid", "Kwaliteitsvol onderwijs aanbieden: referentiekaders", "https://www.vlaanderen.be/onderwijsprofessionals/organisatie-en-administratie/onderwijskwaliteit-en-toezicht/kwaliteitsvol-onderwijs-aanbieden/referentiekaders-voor-onderwijskwaliteit", "quality framework", "quality-framework source family", "Flemish Community", "Live official page verified 2026-06-22", "official", "Confirm OK framework source family.", "Does not replace school-level evidence."),
      source("be-flanders-onderwijsdoelen-modernisatie", "Vlaamse overheid / Onderwijsdoelen.be", "Modernisering secundair onderwijs - onderwijsdoelen route", "https://onderwijsdoelen.be/modernisatie-so", "curriculum goals portal", "curriculum-goal route selector", "Flemish Community", "Live official portal verified 2026-06-22", "official", "Document exact route selection and dynamic-portal limitation.", "Does not authorize generic Flemish economics claims."),
    ],
    source_freshness: {
      access_date: ACCESS_DATE,
      freshness_status: "fresh_with_dynamic_portal_limit",
      refresh_required_before: ["Any Flemish prototype implementation", "Any school/network curriculum mapping", "Any school-facing or public output"],
      currentness_checker: "build-scripts/inspection/check-selected-jurisdiction-deepening.js",
    },
    selected_pathway: {
      stage: "Secundair onderwijs, 3de graad",
      pathway: "Doorstroomfinaliteit, basisvorming",
      subject_or_goal_family: "Economic/financial competences, official goal family SC11; exact candidate anchor SC11.05 market mechanism on the product market",
      selection_reason: "Tests high reuse of Dutch-language economics while preserving a materially different curriculum and quality-governance system.",
      boundary: "No school-network, study-direction, or school-specific curriculum plan is used.",
    },
    curriculum_mappings: flandersCurriculumRows(),
    assessment_mappings: flandersAssessmentRows(),
    terminology_substitutions: [
      { source_term: "vraaglijn", target_term: "vraagcurve/vraaglijn", status: "mapped_with_boundary", note: "Requires Flemish teacher/economics terminology review." },
      { source_term: "aanbodlijn", target_term: "aanbodcurve/aanbodlijn", status: "mapped_with_boundary", note: "Requires Flemish teacher/economics terminology review." },
      { source_term: "betalingsbereidheid", target_term: "betalingsbereidheid", status: "mapped", note: "Likely reusable Dutch-language term." },
      { source_term: "consumentensurplus", target_term: "consumentensurplus", status: "extension_only", note: "Keep extension-only unless exact goal or network curriculum supports it." },
      { source_term: "doeloefening", target_term: "local task label to be determined", status: "gap", note: "No school/network task vocabulary selected." },
    ],
    institution_example_substitutions: [
      { source_context: "Dutch national institutions", target_context: "Flemish Community context", status: "mapped_with_boundary", note: "No all-Belgium inference." },
      { source_context: "Dutch school/exam examples", target_context: "Flemish school-owned context", status: "gap", note: "Requires school/network source before implementation." },
    ],
    accessibility_inclusion_terminology: [
      { source_term: "ontwikkeling van lerenden", local_term: "ontwikkeling van lerenden", limitation: "OK quality vocabulary can frame internal inclusion/accessibility context only; it does not define accommodations, care policy, or local legal duties.", evidence_boundary: "School/network-owned accommodations, support policy, learner-support records, and legal-duty evidence remain outside product proof." },
      { source_term: "kwaliteitsontwikkeling", local_term: "kwaliteitsontwikkeling", limitation: "Quality-development term, not a compliance, sufficiency, or accessibility-support result.", evidence_boundary: "Product accessibility affordances remain separate from school/network accommodations and local legal duties." },
    ],
    school_owned_evidence_boundary: [
      { boundary_area: "OK quality development", why_school_owned: "Quality development is enacted and evidenced by schools.", forbidden_inference: "Product crosswalk cannot prove OK fulfilment, legal sufficiency, or support adequacy." },
      { boundary_area: "Assessment practice", why_school_owned: "No central assessment source selected; school/network policy controls task evidence.", forbidden_inference: "No summative or PTA claim." },
      { boundary_area: "Inclusion/accessibility support and accommodation duties", why_school_owned: "School/network policy and local legal duties govern support decisions, accommodations, learner records, and sufficiency evidence.", forbidden_inference: "Descriptor cannot prove accessibility compliance, support sufficiency, legal sufficiency, or school readiness." },
    ],
    transformation_specification: transformation("flanders"),
    readiness_estimate: {
      estimated_reuse_percent: 71,
      methodology: "Internal estimate across nine Book 1 concept rows: language transfer high, core model transfer high, school/network assessment dependency high, consumer-surplus/collective-demand placement uncertain.",
      not_a_compliance_measure: true,
      remaining_blocking_gaps: ["Exact school/network curriculum depth not selected.", "Assessment source absent by design.", "Flemish teacher/economics review required."],
    },
    forbidden_claims: ["Flemish edition is ready.", "OK expectations are met.", "Belgian compliance is proven.", "Dutch-language similarity proves curriculum fit.", "Legal sufficiency is proven."],
    proof_required_to_close: ["Flanders source reviewer PASS.", "Teacher/economics reviewer PASS.", "Dutch quality-inspection reviewer PASS.", "Legal/privacy/claims reviewer PASS.", "Final lead PASS and human review."],
    output_boundary: boundaryFlags(),
    finding_classification: findings("Flanders"),
  };
}

function crosswalkRows(jurisdiction) {
  return jurisdiction === "england"
    ? englandCurriculumRows().map((row) => ({ ...row, ...englandAssessmentRows().find((item) => item.concept_id === row.concept_id) }))
    : flandersCurriculumRows().map((row) => ({ ...row, ...flandersAssessmentRows().find((item) => item.concept_id === row.concept_id) }));
}

function crosswalkReport(jurisdiction, descriptor) {
  const id = `${jurisdiction}-book1-1.2-1.3-deep-crosswalk`;
  return {
    ...commonReport(id, "complete_internal_deep_crosswalk", [
      `reports/inspection-standards/${id}.md`,
      `reports/inspection-standards/${id}.json`,
    ]),
    jurisdiction_id: jurisdiction,
    descriptor_id: descriptor.descriptor_id,
    crosswalk_rows: crosswalkRows(jurisdiction),
    transformation_specification: descriptor.transformation_specification,
    school_owned_evidence_needed: true,
    forbidden_inferences: descriptor.forbidden_claims,
    finding_classification: descriptor.finding_classification,
  };
}

function comparisonReport(england, flanders) {
  const dimensions = [
    ["source_completeness", "High for England source layers; medium-high for Flanders official goals/quality layer with school-network limitation."],
    ["curriculum_fit", "England maps strongly to AQA 4.1.3; Flanders maps strongly to SC11.05 for market mechanism but not all extension content."],
    ["assessment_fit", "England has representative AQA assessment forms; Flanders assessment remains a deliberate gap."],
    ["terminology_effort", "England requires full language conversion; Flanders requires careful Dutch/Flemish terminology review."],
    ["institution_localization_effort", "Both require local institution and context replacement before prototypes."],
    ["accessibility_inclusion_mapping", "England has a SEND terminology source layer and Flanders has OK quality vocabulary, but both are product-accessibility/support context only: school-owned accommodations, local legal duties, learner support records, and support sufficiency evidence remain outside product proof."],
    ["school_owned_evidence_dependency", "High for both; product output cannot replace school evidence."],
    ["local_expert_dependency", "High for both before prototype planning exits internal mode."],
    ["estimated_reuse_percentage", "England 62%, Flanders 71%, internal methodology only and not compliance evidence."],
    ["remaining_blocking_gaps", "AQA prototype task authorization for England; school/network and assessment source gaps for Flanders."],
  ];
  return {
    ...commonReport("selected-jurisdiction-readiness-comparison", "complete_internal_comparison", [
      "reports/inspection-standards/selected-jurisdiction-readiness-comparison.md",
      "reports/inspection-standards/selected-jurisdiction-readiness-comparison.json",
    ]),
    compared_jurisdictions: [england.descriptor_id, flanders.descriptor_id],
    dimensions: dimensions.map(([dimension, assessment]) => ({ dimension, assessment })),
    reuse_estimates: [
      { jurisdiction_id: "england", estimated_reuse_percent: england.readiness_estimate.estimated_reuse_percent, methodology: england.readiness_estimate.methodology, not_a_compliance_measure: true },
      { jurisdiction_id: "flanders", estimated_reuse_percent: flanders.readiness_estimate.estimated_reuse_percent, methodology: flanders.readiness_estimate.methodology, not_a_compliance_measure: true },
    ],
    finding_classification: [
      {
        finding: "England and Flanders are sufficient contrasting jurisdictions for internal overlay prototype planning readiness.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review of this selected-deepening packet.",
        does_not_block: "A later internal overlay prototype-planning sprint if human accepted.",
        proof_required_to_close: "Specialist reviews, final lead PASS, fresh PR, and green CI.",
      },
      {
        finding: "Reuse percentages are internal estimates only.",
        classification: "scale_blocker",
        blocks: "Legal sufficiency, compliance, approval, inspection-readiness, or product/adoption claims.",
        does_not_block: "Internal architecture planning.",
        proof_required_to_close: "Separate local expert review before any prototype implementation.",
      },
    ],
  };
}

function decisionReport(comparison) {
  return {
    ...commonReport("selected-jurisdiction-deepening-decision", "decision_ready_for_human_review", [
      "reports/inspection-standards/selected-jurisdiction-deepening-decision.md",
      "reports/inspection-standards/selected-jurisdiction-deepening-decision.json",
    ]),
    final_selected_jurisdiction_deepening_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      decision_selection_count: 1,
      rationale:
        "England and Flanders expose different enough source, assessment, language, and quality-governance risks to justify a later internal overlay prototype-planning sprint without producing country editions.",
    },
    still_blocked: DEEPENING_BLOCKED_AUTHORITY,
    comparison_report: comparison.report_id,
    next_authorized_work_if_human_accepts:
      "Internal overlay prototype-planning only; no localized chapters, school-facing output, public output, product route, Scale Gate, personal data, legal sufficiency, compliance, approval, accreditation, or inspection-readiness claim.",
    finding_classification: [
      {
        finding: "The selected-deepening packet can proceed to human review with one decision selected.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review.",
        does_not_block: "A later internal prototype-planning sprint if human accepted.",
        proof_required_to_close: "Human owner decision.",
      },
      {
        finding: "All implementation and downstream authority remains blocked.",
        classification: "scale_blocker",
        blocks: "Country editions, localized student-facing chapters, teacher/school-facing distribution, public output, evidence-pack deployment, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, accreditation, and inspection-readiness claims.",
        does_not_block: "Internal selected-jurisdiction readiness decision.",
        proof_required_to_close: "Separate future human authorization with local expert/source/legal/accessibility review.",
      },
    ],
  };
}

function fixtures(england, flanders) {
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const missingBoundary = clone(england);
  delete missingBoundary.jurisdiction_boundary.boundary_warning;
  const extraAuthority = clone(england);
  extraAuthority.authority_type.curriculum.extra = "forbidden";
  const outputTrue = clone(england);
  outputTrue.output_boundary.country_edition_generation = true;
  const duplicateSource = clone(england);
  duplicateSource.official_source_allowlist[1].source_id = duplicateSource.official_source_allowlist[0].source_id;
  const invalidUrl = clone(england);
  invalidUrl.official_source_allowlist[0].url = "http://example.test/not-https";
  const unsupportedFinding = clone(flanders);
  unsupportedFinding.finding_classification[0].classification = "authority_boundary";
  return new Map([
    [OUTPUT_PATHS[14], `${JSON.stringify(england, null, 2)}\n`],
    [OUTPUT_PATHS[15], `${JSON.stringify(flanders, null, 2)}\n`],
    [OUTPUT_PATHS[16], `${JSON.stringify(missingBoundary, null, 2)}\n`],
    [OUTPUT_PATHS[17], `${JSON.stringify(extraAuthority, null, 2)}\n`],
    [OUTPUT_PATHS[18], `${JSON.stringify(outputTrue, null, 2)}\n`],
    [OUTPUT_PATHS[19], `${JSON.stringify(duplicateSource, null, 2)}\n`],
    [OUTPUT_PATHS[20], `${JSON.stringify(invalidUrl, null, 2)}\n`],
    [OUTPUT_PATHS[21], `${JSON.stringify(unsupportedFinding, null, 2)}\n`],
  ]);
}

function table(rows) {
  return rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
}

function findingTable(findings) {
  return table([
    ["Finding", "Classification", "blocks", "does_not_block", "proof_required_to_close"],
    ["---", "---", "---", "---", "---"],
    ...findings.map((f) => [f.finding, `\`${f.classification}\``, f.blocks, f.does_not_block, f.proof_required_to_close]),
  ]);
}

function renderDescriptorDoc(descriptor) {
  const rows = descriptor.curriculum_mappings.map((row) => [
    `\`${row.concept_id}\``,
    row.book_scope,
    `\`${row.mapping_status}\``,
    row.official_anchor,
    row.known_gap,
  ]);
  return `# ${descriptor.jurisdiction_label} Overlay Deepening

Status: internal-only deep overlay readiness
Sprint: \`${SPRINT_ID}\`

## Product End-State And Original Spec

- Product end-state: \`${PRODUCT_END_STATE}\`
- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\`
- Accepted architecture decision: \`${ACCEPTED_ARCHITECTURE_DECISION}\`

## Non-Negotiable Requirements

${REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`).join("\n")}

## Selected Pathway

- Stage: ${descriptor.selected_pathway.stage}
- Pathway: ${descriptor.selected_pathway.pathway}
- Subject/goal family: ${descriptor.selected_pathway.subject_or_goal_family}
- Boundary: ${descriptor.selected_pathway.boundary}

## Core-Requirement Checklist

${table([["Requirement", "Status", "proof_required_to_close"], ["---", "---", "---"], ...CORE_REQUIREMENTS.map(([id, requirement]) => [`\`${id}\``, "met_for_selected_deepening_packet", "Checker, specialist, final lead, PR, CI, and human review"])])}

## Curriculum Mapping

${table([["Concept", "Book Scope", "Status", "Official Anchor", "Known Gap"], ["---", "---", "---", "---", "---"], ...rows])}

## Transformation Specification

${Object.entries(descriptor.transformation_specification)
  .map(([key, values]) => `### ${key}\n\n${values.map((value) => `- ${value}`).join("\n")}`)
  .join("\n\n")}

## Finding Classification

${findingTable(descriptor.finding_classification)}
`;
}

function renderTransformationContract(england, flanders) {
  return `# Selected Jurisdiction Transformation Contract

Status: internal-only architectural instructions
Sprint: \`${SPRINT_ID}\`

## Product End-State And Original Spec

- Product end-state: \`${PRODUCT_END_STATE}\`
- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\`

## Non-Negotiable Requirements

${REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`).join("\n")}

## Core-Requirement Checklist

${table([["Requirement", "Status", "proof_required_to_close"], ["---", "---", "---"], ...CORE_REQUIREMENTS.map(([id]) => [`\`${id}\``, "met_for_contract", "Checker and final lead review"])])}

## Contract

These specifications are architectural instructions only. They must not generate localized chapters, teacher/school-facing output, public output, evidence packs, product routes, Scale Gate evidence, diagnostics/mastery/PV, student/product use, personal-data processing, legal sufficiency, compliance, approval, accreditation, or inspection-readiness claims.

Product accessibility affordances are limited to internal terminology and design-support planning. School-owned accommodations, individual learner support records, local legal duties, and support-sufficiency evidence remain outside product proof for both England and Flanders.

## England Summary

${england.transformation_specification.what_remains_unchanged.map((item) => `- ${item}`).join("\n")}

## Flanders Summary

${flanders.transformation_specification.what_remains_unchanged.map((item) => `- ${item}`).join("\n")}

## Finding Classification

${findingTable([
  {
    finding: "Transformation contract remains internal and non-student-facing.",
    classification: "core_requirement_met",
    blocks: "Nothing for human review.",
    does_not_block: "Internal prototype-planning decision after human acceptance.",
    proof_required_to_close: "Checker PASS and final lead PASS.",
  },
  {
    finding: "All implementation outputs remain blocked.",
    classification: "scale_blocker",
    blocks: "Localized chapters, school-facing output, public output, product routes, legal sufficiency, and compliance/inspection claims.",
    does_not_block: "Internal transformation specification review.",
    proof_required_to_close: "Separate future human authorization.",
  },
])}
`;
}

function renderCrosswalk(report) {
  return `# ${report.jurisdiction_id} Book 1 1.2/1.3 Deep Crosswalk

Status: internal-only deep crosswalk
Sprint: \`${SPRINT_ID}\`

## Product End-State And Original Spec

- Product end-state: \`${PRODUCT_END_STATE}\`
- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\`

## Non-Negotiable Requirements

${REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`).join("\n")}

## Core-Requirement Checklist

${table([["Requirement", "Status", "proof_required_to_close"], ["---", "---", "---"], ...CORE_REQUIREMENTS.map(([id]) => [`\`${id}\``, "met_for_crosswalk", "Checker, specialist, final lead, and human review"])])}

## Rows

${table([
  ["Concept", "Book Scope", "Topic", "Assessment Objective", "Command Word", "Task Form", "Diagram", "Mark-Scheme Expectation", "Known Gap"],
  ["---", "---", "---", "---", "---", "---", "---", "---", "---"],
  ...report.crosswalk_rows.map((row) => [
    `\`${row.concept_id}\``,
    row.book_scope,
    row.subject_content_topic,
    row.assessment_objective,
    row.command_word,
    row.task_form,
    row.diagram_convention,
    row.mark_scheme_expectation,
    row.known_gap,
  ]),
])}

## Finding Classification

${findingTable(report.finding_classification)}
`;
}

function renderComparison(report) {
  return `# Selected Jurisdiction Readiness Comparison

Status: internal-only readiness comparison
Sprint: \`${SPRINT_ID}\`

## Product End-State And Original Spec

- Product end-state: \`${PRODUCT_END_STATE}\`
- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\`

## Non-Negotiable Requirements

${REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`).join("\n")}

## Core-Requirement Checklist

${table([["Requirement", "Status", "proof_required_to_close"], ["---", "---", "---"], ...CORE_REQUIREMENTS.map(([id]) => [`\`${id}\``, "met_for_comparison", "Checker, specialist, final lead, and human review"])])}

## Comparison

${table([["Dimension", "Assessment"], ["---", "---"], ...report.dimensions.map((row) => [row.dimension, row.assessment])])}

## Reuse Estimates

The reuse percentage is an internal estimate with methodology. It is not a compliance measure.

${table([["Jurisdiction", "Estimate", "Methodology"], ["---", "---", "---"], ...report.reuse_estimates.map((row) => [row.jurisdiction_id, `${row.estimated_reuse_percent}%`, row.methodology])])}

## Finding Classification

${findingTable(report.finding_classification)}
`;
}

function renderDecision(report) {
  return `# Selected Jurisdiction Deepening Decision

Status: decision ready for human review
Sprint: \`${SPRINT_ID}\`

## Product End-State And Original Spec

- Product end-state: \`${PRODUCT_END_STATE}\`
- Original sprint/gate spec: \`${ORIGINAL_SPRINT_GATE_SPEC}\`

## Non-Negotiable Requirements

${REVIEW_PACKET_REQUIREMENTS.map((item) => `- ${item}`).join("\n")}

## Core-Requirement Checklist

${table([["Requirement", "Status", "proof_required_to_close"], ["---", "---", "---"], ...CORE_REQUIREMENTS.map(([id]) => [`\`${id}\``, "met_for_decision", "Checker, specialist, final lead, PR, CI, and human review"])])}

## Decision

Selected: \`${report.final_selected_jurisdiction_deepening_decision.selected}\`

Allowed options:

${report.final_selected_jurisdiction_deepening_decision.allowed_options.map((option) => `- \`${option}\``).join("\n")}

Rationale: ${report.final_selected_jurisdiction_deepening_decision.rationale}

## Still Blocked

${report.still_blocked.map((flag) => `- \`${flag}\``).join("\n")}

## Finding Classification

${findingTable(report.finding_classification)}
`;
}

function buildBundle() {
  const schema = descriptorSchemaV1();
  const england = englandDescriptor();
  const flanders = flandersDescriptor();
  const englandCrosswalk = crosswalkReport("england", england);
  const flandersCrosswalk = crosswalkReport("flanders", flanders);
  const comparison = comparisonReport(england, flanders);
  const decision = decisionReport(comparison);
  return { schema, england, flanders, englandCrosswalk, flandersCrosswalk, comparison, decision };
}

function outputContents(bundle) {
  const contents = new Map([
    [OUTPUT_PATHS[0], `${JSON.stringify(bundle.schema, null, 2)}\n`],
    [OUTPUT_PATHS[1], `${JSON.stringify(bundle.england, null, 2)}\n`],
    [OUTPUT_PATHS[2], `${JSON.stringify(bundle.flanders, null, 2)}\n`],
    [OUTPUT_PATHS[3], renderDescriptorDoc(bundle.england)],
    [OUTPUT_PATHS[4], renderDescriptorDoc(bundle.flanders)],
    [OUTPUT_PATHS[5], renderTransformationContract(bundle.england, bundle.flanders)],
    [OUTPUT_PATHS[6], renderCrosswalk(bundle.englandCrosswalk)],
    [OUTPUT_PATHS[7], `${JSON.stringify(bundle.englandCrosswalk, null, 2)}\n`],
    [OUTPUT_PATHS[8], renderCrosswalk(bundle.flandersCrosswalk)],
    [OUTPUT_PATHS[9], `${JSON.stringify(bundle.flandersCrosswalk, null, 2)}\n`],
    [OUTPUT_PATHS[10], renderComparison(bundle.comparison)],
    [OUTPUT_PATHS[11], `${JSON.stringify(bundle.comparison, null, 2)}\n`],
    [OUTPUT_PATHS[12], renderDecision(bundle.decision)],
    [OUTPUT_PATHS[13], `${JSON.stringify(bundle.decision, null, 2)}\n`],
    ...fixtures(bundle.england, bundle.flanders),
  ]);
  return contents;
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();
  if (/country-edition|localized-chapter|student-facing|school-facing|teacher|public|external|evidence-pack/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT", "Localized, public, school-facing, teacher-facing, or evidence-pack output is not authorized.", { args: unknown });
  }
  if (/product-route|scale|diagnostics|mastery|pv|student|personal|data-processing/.test(joined)) {
    throw new StopError("STOP_DOWNSTREAM_AUTHORITY", "Downstream product, student, data, Scale Gate, diagnostics/mastery/PV authority is not authorized.", { args: unknown });
  }
  if (/legal-sufficiency|legal\s+sufficiency|compliance|approval|approved|accreditation|inspection-ready|inspection-readiness|op0|pta|summative/.test(joined)) {
    throw new StopError("STOP_COMPLIANCE_APPROVAL_CLAIM", "Legal sufficiency, compliance, approval, accreditation, OP0, PTA, summative, and inspection-readiness claims are not authorized.", { args: unknown });
  }
  if (/all-belgium|whole-uk|all-england-awarding-bodies|aqa-approval/.test(joined)) {
    throw new StopError("STOP_GOVERNANCE_OVERGENERALISATION", "Selected-jurisdiction boundaries must remain explicit.", { args: unknown });
  }
  if (/glob|implicit-source|scan-generated-lessons|generated-lesson-output/.test(joined)) {
    throw new StopError("STOP_IMPLICIT_DISCOVERY", "Implicit source/output discovery and generated lesson-output scanning are not authorized.", { args: unknown });
  }
  if (/package|(?:^|\s|-)ci(?:$|\s|-)|dashboard|quality-ref|quality_ref/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_INTEGRATION", "Package, CI, dashboard, and quality-ref product integration are not authorized.", { args: unknown });
  }
  if (unknown.length > 0) {
    throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for selected-jurisdiction deepening generator.", { args: unknown });
  }
  return { check };
}

function writeOrCheck(contents, check) {
  const mismatches = [];
  for (const [relativePath, content] of contents.entries()) {
    if (!OUTPUT_PATHS.includes(relativePath)) throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output not allowlisted: ${relativePath}`);
    const fullPath = path.resolve(process.cwd(), relativePath);
    if (check) {
      const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
      if (current !== content) mismatches.push(relativePath);
      continue;
    }
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
  }
  if (mismatches.length > 0) throw new Error(`Selected-jurisdiction deepening output is stale: ${mismatches.join(", ")}`);
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
    console.log(mode.check ? "Selected-jurisdiction deepening output is current." : "Selected-jurisdiction deepening output generated.");
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
  DEEPENING_BLOCKED_AUTHORITY,
  OUTPUT_PATHS,
  REVIEW_PACKET_REQUIREMENTS,
  SELECTED_DECISION,
  buildBundle,
  conceptRows,
  descriptorSchemaV1,
  outputContents,
  parseMode,
};
