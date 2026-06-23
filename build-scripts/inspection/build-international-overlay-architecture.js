#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const {
  BLOCKED_AUTHORITY: FOUNDATION_BLOCKED_AUTHORITY,
  REV_STD_FINDING_CLASSIFICATIONS,
  StopError,
} = require("./build-international-quality-standards.js");

const ACCESS_DATE = "2026-06-22";
const SPRINT_ID = "GOAL-IQS-OVERLAY-ARCHITECTURE-1";
const FOUNDATION_SPRINT_ID = "GOAL-IQS-FOUNDATION-1";
const SELECTED_DECISION = "PROCEED_TO_SELECTED_JURISDICTION_DEEPENING";
const DECISION_OPTIONS = [
  "PROCEED_TO_SELECTED_JURISDICTION_DEEPENING",
  "REVISE_OVERLAY_SCHEMA",
  "RESEARCH_GAPS_BEFORE_PILOT_EXPANSION",
];

const ORIGINAL_SPRINT_GATE_SPEC =
  "archive/sprints/GOAL-IQS-OVERLAY-ARCHITECTURE-1/GOAL-IQS-OVERLAY-ARCHITECTURE-1-sprint-plan.md";
const PRODUCT_END_STATE = "../4veco-lessen/specifications/product-end-state.md";
const FOUNDATION_DECISION = "reports/inspection-standards/international-foundation-decision.md";

const OUTPUT_PATHS = [
  "references/schemas/international-jurisdiction-overlay.schema.json",
  "references/data/inspection-standards/overlays/england.v0.json",
  "references/data/inspection-standards/overlays/flanders.v0.json",
  "references/data/inspection-standards/overlays/bavaria.v0.json",
  "references/data/inspection-standards/overlays/california.v0.json",
  "docs/inspection-standards/international-overlay-descriptor-contract.md",
  "docs/inspection-standards/international-overlay-governance-rules.md",
  "reports/inspection-standards/international-overlay-archetype-pilot.md",
  "reports/inspection-standards/international-overlay-archetype-pilot.json",
  "reports/inspection-standards/book1-1.2-1.3-overlay-crosswalk.md",
  "reports/inspection-standards/book1-1.2-1.3-overlay-crosswalk.json",
  "reports/inspection-standards/international-overlay-architecture-decision.md",
  "reports/inspection-standards/international-overlay-architecture-decision.json",
];

const OVERLAY_BLOCKED_AUTHORITY = [
  ...FOUNDATION_BLOCKED_AUTHORITY,
  "country_edition_generation",
  "local_exam_code_implementation",
  "teacher_school_facing_overlay",
  "public_overlay_output",
  "school_owned_evidence_collection",
  "package_or_ci_product_integration",
  "country_specific_legal_claim",
];

const REVIEW_PACKET_REQUIREMENTS = [
  "Cite the product end-state and original sprint/gate specification.",
  "Cite the accepted GOAL-IQS-FOUNDATION-1 decision and preserve its authority boundaries.",
  "Name non-negotiable requirements before conclusions.",
  "Include a core-requirement checklist.",
  "Classify findings with blocks, does_not_block, and proof_required_to_close.",
  "Do not carry any missing core requirement as PASS WITH FLAGS.",
  "Generate exactly the allowlisted overlay schema, four descriptors, governance docs, crosswalk, pilot report, and decision report.",
  "Use explicit per-scope source and output allowlists; do not glob directories or discover sources implicitly.",
  "Keep all country-edition, compliance, approval, public, school-facing, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, and inspection-readiness authority blocked.",
];

const CORE_REQUIREMENTS = [
  ["overlay_schema", "The descriptor schema names every required overlay field and blocks implicit source/output discovery."],
  ["four_archetype_descriptors", "England, Flanders, Bavaria/Germany, and California/United States descriptors are generated as contrasting governance archetypes."],
  ["official_source_allowlists", "Each descriptor carries explicit official-source allowlists with authority type, allowed use, and forbidden inference."],
  ["curriculum_assessment_mapping", "Each descriptor separates curriculum mapping from assessment/exam mapping and names v0 gaps."],
  ["book1_crosswalk", "Book 1 Chapters 1.2 and 1.3 are crosswalked to the four descriptors without country-edition output."],
  ["school_owned_boundary", "Every descriptor preserves school-owned evidence, implementation, inspection, accreditation, and accountability boundaries."],
  ["accessibility_inclusion_terms", "Each descriptor records local accessibility/inclusion terminology without compliance claims."],
  ["refusal_and_stop_conditions", "Generator and checker refuse forbidden audiences, claims, integrations, and governance overgeneralisations."],
  ["single_decision", "The architecture chooses exactly one allowed decision."],
  ["human_review_stop", "The packet returns only after all descriptors, crosswalk, validators, specialist reviews, and final PR proof are complete."],
];

const GOVERNANCE_ARCHETYPES = [
  {
    id: "national_inspectorate_plus_qualification",
    label: "National inspectorate plus qualification-content model",
    descriptor: "england",
    risk: "Whole-UK overgeneralisation and exam-board substitution.",
    control: "England-only boundary and DfE subject-content source separate from exam-board specifications.",
  },
  {
    id: "subnational_quality_framework",
    label: "Subnational quality-framework and curriculum-goals model",
    descriptor: "flanders",
    risk: "All-Belgium claims from Flemish sources.",
    control: "Flanders-only boundary and separate curriculum/quality source roles.",
  },
  {
    id: "federal_land_curriculum",
    label: "Federal coordination plus Land curriculum model",
    descriptor: "bavaria",
    risk: "Single-Germany curriculum or inspection claim.",
    control: "KMK source family is federal context only; Bavaria is representative Land overlay only.",
  },
  {
    id: "state_standards_with_federal_accountability_context",
    label: "State standards with federal accountability context",
    descriptor: "california",
    risk: "National-US inspection, accreditation, or standards claim.",
    control: "California state standards are local; U.S. Department of Education material is federal accountability context only.",
  },
];

function boundaryFlags() {
  return Object.fromEntries(OVERLAY_BLOCKED_AUTHORITY.map((flag) => [flag, false]));
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
    foundation_sprint_id: FOUNDATION_SPRINT_ID,
    foundation_decision_source: FOUNDATION_DECISION,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    non_negotiable_requirements: REVIEW_PACKET_REQUIREMENTS,
    core_requirement_checklist: CORE_REQUIREMENTS.map(([id, requirement]) => ({
      id,
      requirement,
      status: "met_for_overlay_architecture",
      proof_required_to_close: "Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review.",
    })),
    output_boundary: boundaryFlags(),
    output_files_written: OUTPUT_PATHS,
  };
}

function source(id, authority, title, url, role, sourceType, scope, versionDate, allowedUse, forbiddenInference) {
  return {
    source_id: id,
    authority,
    title,
    url,
    source_type: sourceType,
    role,
    scope,
    publication_or_version_date: versionDate,
    access_date: ACCESS_DATE,
    authority_strength: "official source for the bounded jurisdiction role named here",
    allowed_use: allowedUse,
    forbidden_inference: forbiddenInference,
  };
}

const descriptors = [
  {
    descriptor_id: "england.v0",
    jurisdiction_id: "england",
    jurisdiction_label: "England",
    governance_archetype: "national_inspectorate_plus_qualification",
    status: "internal_overlay_descriptor_complete",
    jurisdiction_boundary: {
      boundary_label: "England-only",
      governance_level: "country within the United Kingdom for the cited education sources",
      includes: ["England maintained schools, academies, non-association independent schools, and relevant post-16 settings where the cited Ofsted/DfE sources apply."],
      excludes: ["Scotland", "Wales", "Northern Ireland", "UK-wide claims", "exam-board-specific specifications and mark schemes"],
      boundary_warning: "England is not the whole United Kingdom; DfE subject content is not an exam-board approval route.",
    },
    authority_type: {
      inspection_or_school_evaluation: "covered_for_descriptor: Ofsted education inspection framework and school operating guidance.",
      curriculum: "covered_for_descriptor: DfE GCE AS and A level economics subject content.",
      examination: "covered_as_qualification_content_only: no exam-board specification, paper, mark scheme, or awarding-body approval is included.",
      accountability: "covered_for_school_owned_boundary: Ofsted material informs inspection/accountability vocabulary but not product authority.",
      accreditation: "not_covered_in_descriptor: no accreditation source is used.",
      regional_or_state_overlay: "not_applicable_to_descriptor: England-only boundary; other UK systems require separate descriptors.",
    },
    official_source_allowlist: [
      source(
        "england-ofsted-eif-2025",
        "Ofsted",
        "Education inspection framework: for use from November 2025",
        "https://www.gov.uk/government/publications/education-inspection-framework-eif/education-inspection-framework-for-use-from-november-2025",
        "inspection/accountability vocabulary",
        "inspection framework",
        "England",
        "Updated 2025-09-09; for use from 2025-11-10",
        "Name England inspection evaluation areas, inclusion/safeguarding vocabulary, and school-owned evidence boundaries.",
        "Does not approve 4veco, represent the whole UK, or make a textbook inspection-ready."
      ),
      source(
        "england-dfe-a-level-economics-content",
        "Department for Education",
        "GCE AS and A level subject content for economics",
        "https://www.gov.uk/government/publications/gce-as-and-a-level-for-economics",
        "curriculum/qualification subject content",
        "subject content",
        "England",
        "Published 2014-04-09",
        "Map upper-secondary economics concepts and assessment-objective language at subject-content level.",
        "Does not make a 4veco book an approved A level specification, exam-board resource, or summative assessment."
      ),
      source(
        "england-ofsted-school-operating-guide-2025",
        "Ofsted",
        "[Currently in use] School inspection operating guide for inspectors",
        "https://www.gov.uk/government/publications/school-inspection-toolkit-operating-guide-and-information/school-inspection-operating-guide-for-inspectors-for-use-from-november-2025",
        "inspection evidence-gathering method",
        "inspection operating guide",
        "England",
        "Updated 2026-06-12; for use from 2025-11-10",
        "Keep school-owned inspection evidence separate from product evidence.",
        "Does not authorize automated evidence-pack generation or school-facing inspection claims."
      ),
    ],
    source_freshness: {
      access_date: ACCESS_DATE,
      freshness_status: "fresh_for_internal_overlay_architecture",
      refresh_required_before: "Any England-specific country edition, teacher/school-facing output, exam-board mapping, inspection claim, or public claim.",
      currentness_checker: "build-scripts/inspection/check-international-overlay-architecture.js",
    },
    curriculum_mappings: [
      {
        book_scope: "Book 1 Chapter 1.2 Vraag",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "DfE economics subject content; exam-board specifications remain out of scope.",
        portable_core: ["individual demand", "law of demand", "consumer surplus", "demand factors", "demand-curve movement versus shift"],
        overlay_action: "Translate Dutch terms to English economics vocabulary and later map to exact DfE/A level topic and assessment-objective language.",
      },
      {
        book_scope: "Book 1 Chapter 1.3 Aanbod en marktevenwicht",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "DfE economics subject content; Ofsted is inspection vocabulary only.",
        portable_core: ["supply", "supply factors", "equilibrium", "shortage/surplus", "demand/supply shifts", "diagram reasoning"],
        overlay_action: "Separate reusable market-mechanism pedagogy from local exam-board question forms.",
      },
    ],
    assessment_mappings: [
      {
        assessment_source_status: "not_covered_in_descriptor",
        allowed_internal_use: "Record that DfE subject content can guide concept-level mapping only.",
        forbidden_inference: "No A level exam-board specification, mark scheme, grade boundary, or awarding-body approval is included.",
      },
    ],
    terminology_substitutions: [
      ["vraaglijn", "demand curve"],
      ["aanbodlijn", "supply curve"],
      ["betalingsbereidheid", "willingness to pay"],
      ["consumentensurplus", "consumer surplus"],
      ["marktevenwicht", "market equilibrium"],
      ["overschot/tekort", "surplus/shortage"],
    ],
    institution_example_substitutions: [
      "Use England-specific institutions only after review; do not convert them into UK-wide examples.",
      "Currency and policy examples require pound sterling and English policy context where used.",
      "Exam examples require a separately sourced awarding-body overlay before any student-facing use.",
    ],
    accessibility_inclusion_terminology: [
      "inclusion",
      "safeguarding",
      "learners who face barriers to learning and/or wellbeing",
      "school-owned support and accessibility evidence",
    ],
    school_owned_evidence_boundary: [
      "Ofsted evidence gathering, leadership, safeguarding, attendance, support, and implementation evidence belongs to the school and inspectorate process.",
      "Product evidence can support curriculum reasoning only; it cannot supply inspection evidence by itself.",
    ],
    forbidden_claims: [
      "4veco is inspection-ready in England.",
      "The descriptor proves UK compliance.",
      "The descriptor authorizes a teacher/school-facing England edition.",
      "DfE subject content equals exam-board approval.",
    ],
    proof_required_to_close: [
      "England source refresh by a country/source reviewer.",
      "Exam-board-specific source allowlist if assessment mapping is ever authorised.",
      "Teacher/economics review of all terminology substitutions.",
      "Human approval before any local edition or public/school-facing output.",
    ],
  },
  {
    descriptor_id: "flanders.v0",
    jurisdiction_id: "flanders",
    jurisdiction_label: "Belgium / Flanders",
    governance_archetype: "subnational_quality_framework",
    status: "internal_overlay_descriptor_complete",
    jurisdiction_boundary: {
      boundary_label: "Flanders-only",
      governance_level: "Flemish Community subnational education system",
      includes: ["Flemish quality framework and Flemish curriculum-goals routing."],
      excludes: ["French Community of Belgium", "German-speaking Community of Belgium", "Belgium-wide compliance claims", "Flemish assessment sources not researched in v0"],
      boundary_warning: "Flanders is not all Belgium; Dutch-language vocabulary similarity does not prove curriculum or quality equivalence.",
    },
    authority_type: {
      inspection_or_school_evaluation: "covered_for_descriptor: Flemish OK quality framework and inspection-method inventory.",
      curriculum: "covered_for_descriptor: Onderwijsdoelen.be curriculum-goals portal as source route.",
      examination: "not_covered_in_descriptor: no Flemish assessment or examination source is included.",
      accountability: "covered_for_school_owned_boundary: OK and inspection-method sources inform school quality vocabulary only.",
      accreditation: "not_covered_in_descriptor: no accreditation source is used.",
      regional_or_state_overlay: "covered_for_descriptor: Flanders-only boundary; other Belgian communities require separate descriptors.",
    },
    official_source_allowlist: [
      source(
        "be-flanders-ok-framework",
        "Vlaamse overheid / Onderwijsinspectie Vlaanderen",
        "Referentiekader voor onderwijskwaliteit (het OK)",
        "https://www.vlaanderen.be/onderwijsprofessionals/organisatie-en-administratie/onderwijskwaliteit-en-toezicht/kwaliteitsvol-onderwijs-aanbieden/referentiekaders-voor-onderwijskwaliteit/referentiekader-voor-onderwijskwaliteit-het-ok",
        "quality framework and inspection-development vocabulary",
        "quality framework",
        "Flemish Community",
        "Live official page verified 2026-06-22",
        "Name Flemish quality expectations and development-scale boundary for internal overlay architecture.",
        "Does not represent all Belgian communities or prove school-quality compliance."
      ),
      source(
        "be-flanders-onderwijsdoelen-3de-graad",
        "Vlaamse overheid / Onderwijsdoelen.be",
        "Secundair onderwijs - 3de graad - Onderwijsdoelen",
        "https://onderwijsdoelen.be/modernisatie-so?onderwijsstructuur=SO_3DE_GRAAD",
        "curriculum-goals routing",
        "curriculum goals portal",
        "Flemish Community",
        "Live official portal verified 2026-06-22",
        "Route future economics/financial-economic curriculum goal mapping.",
        "Does not prove that a 4veco chapter satisfies Flemish curriculum goals or school quality evidence."
      ),
      source(
        "be-flanders-what-do-we-inspect",
        "Onderwijsinspectie Vlaanderen",
        "What do we inspect?",
        "https://www.onderwijsinspectie.be/en/what-do-we-inspect",
        "inspection-method comparator",
        "inspection method",
        "Flemish Community",
        "Live official page verified in source register 2026-06-08",
        "Keep quality development, teaching practice, feedback, evaluation, and learning-effects language school-owned.",
        "Does not authorize generated evidence packs or Belgium-wide claims."
      ),
    ],
    source_freshness: {
      access_date: ACCESS_DATE,
      freshness_status: "fresh_for_internal_overlay_architecture_with_curriculum_portal_refresh_required",
      refresh_required_before: "Any Flanders-specific local edition, assessment mapping, school-facing output, or Belgian-community comparison.",
      currentness_checker: "build-scripts/inspection/check-international-overlay-architecture.js",
    },
    curriculum_mappings: [
      {
        book_scope: "Book 1 Chapter 1.2 Vraag",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "Onderwijsdoelen.be source route; exact goal IDs must be selected later.",
        portable_core: ["vraag", "betalingsbereidheid", "consumentensurplus", "vraagfactoren", "collectieve vraag"],
        overlay_action: "Keep Dutch terms under Flemish terminology review; map exact Flemish goal codes before any lesson adaptation.",
      },
      {
        book_scope: "Book 1 Chapter 1.3 Aanbod en marktevenwicht",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "Onderwijsdoelen.be source route plus OK school-quality boundary.",
        portable_core: ["aanbod", "aanbodfactoren", "marktevenwicht", "tekort/overschot", "verschuivingen"],
        overlay_action: "Review whether examples, context, and assessment language match Flemish secondary pathways.",
      },
    ],
    assessment_mappings: [
      {
        assessment_source_status: "not_covered_in_descriptor",
        allowed_internal_use: "Record that no Flemish exam/assessment mapping is available in this descriptor.",
        forbidden_inference: "No assessment-readiness, summative, or school-quality claim is allowed.",
      },
    ],
    terminology_substitutions: [
      ["vraaglijn", "vraagcurve/vraaglijn after Flemish terminology review"],
      ["aanbodlijn", "aanbodcurve/aanbodlijn after Flemish terminology review"],
      ["betalingsbereidheid", "betalingsbereidheid"],
      ["consumentensurplus", "consumentensurplus"],
      ["marktevenwicht", "marktevenwicht"],
      ["doeloefening", "local exercise-type label to be reviewed"],
    ],
    institution_example_substitutions: [
      "Dutch institutional examples require Flemish Community review before use.",
      "School-quality examples must stay framed as school-owned implementation evidence.",
      "Do not infer Belgium-wide institutions from Flemish sources.",
    ],
    accessibility_inclusion_terminology: [
      "kwaliteitsontwikkeling",
      "kwaliteitsverwachtingen",
      "ontwikkeling van lerenden",
      "school-owned support and inclusion evidence",
    ],
    school_owned_evidence_boundary: [
      "OK quality-development evidence is owned by the school and inspection process.",
      "Product crosswalks can support curriculum reasoning but cannot supply school-quality proof.",
    ],
    forbidden_claims: [
      "4veco meets Flemish OK expectations.",
      "The descriptor proves Belgian compliance.",
      "Dutch-language equivalence proves Flemish curriculum fit.",
      "Generated product evidence can replace school development-scale evidence.",
    ],
    proof_required_to_close: [
      "Flemish source refresh with exact curriculum goal IDs.",
      "Flemish assessment/source decision if assessment mapping is ever authorised.",
      "Teacher/economics and Dutch-language quality-inspection review.",
      "Human approval before any local edition or school-facing output.",
    ],
  },
  {
    descriptor_id: "bavaria.v0",
    jurisdiction_id: "bavaria_germany",
    jurisdiction_label: "Bavaria / Germany",
    governance_archetype: "federal_land_curriculum",
    status: "internal_overlay_descriptor_complete",
    jurisdiction_boundary: {
      boundary_label: "KMK context plus Bavaria Land overlay",
      governance_level: "German federal coordination with Land curriculum implementation",
      includes: ["KMK EPA Wirtschaft federal-context source family", "Bavaria Gymnasium Wirtschaft und Recht 12 representative Land curriculum"],
      excludes: ["single national German curriculum claim", "other German Laender", "German school-inspection coverage", "German accreditation coverage"],
      boundary_warning: "Bavaria is a representative Land descriptor, not a Germany-wide edition.",
    },
    authority_type: {
      inspection_or_school_evaluation: "not_covered_in_descriptor: no Land inspection or school-evaluation source is included.",
      curriculum: "covered_for_descriptor: Bavaria LehrplanPLUS for Gymnasium Wirtschaft und Recht 12.",
      examination: "covered_for_federal_context_only: KMK EPA Wirtschaft source family.",
      accountability: "not_covered_in_descriptor: no accountability source is included.",
      accreditation: "not_covered_in_descriptor: no accreditation source is used.",
      regional_or_state_overlay: "covered_for_descriptor: Bavaria as Land overlay; other Laender require separate descriptors.",
    },
    official_source_allowlist: [
      source(
        "de-kmk-epa-wirtschaft",
        "Kultusministerkonferenz",
        "Einheitliche Pruefungsanforderungen in der Abiturpruefung Wirtschaft",
        "https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/1989/1989_12_01-EPA-Wirtschaft.pdf",
        "federal-context examination requirements",
        "Abitur examination requirements",
        "federal coordination",
        "Beschluss 1989-12-01, version 2006-11-16",
        "Use as federal-context examination family and competence vocabulary only.",
        "Does not replace Land curricula, local examination rules, or school implementation evidence."
      ),
      source(
        "de-kmk-quality-assurance-schools",
        "Kultusministerkonferenz",
        "Qualitaetssicherung in Schulen",
        "https://www.kmk.org/themen/qualitaetssicherung-in-schulen.html",
        "common quality-assurance context",
        "quality assurance context",
        "federal coordination",
        "Live official page verified in source register 2026-06-08",
        "Record common German quality-assurance context without asserting a single inspection regime.",
        "Does not prove product compliance or a national German inspection framework."
      ),
      source(
        "de-bavaria-lehrplanplus-wr12",
        "Bayerisches Staatsministerium fuer Unterricht und Kultus / LehrplanPLUS",
        "Gymnasium Wirtschaft und Recht 12, erhoehtes Anforderungsniveau",
        "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/12/wirtschaft-und-recht/erhoeht",
        "Land curriculum",
        "curriculum",
        "Bavaria",
        "Live official page verified 2026-06-22",
        "Map representative Bavarian WR12 market, production, business, and legal-economics content.",
        "Does not represent all German Laender or prove Abitur readiness."
      ),
    ],
    source_freshness: {
      access_date: ACCESS_DATE,
      freshness_status: "fresh_for_internal_overlay_architecture",
      refresh_required_before: "Any Bavaria-specific local edition, other-Land comparison, exam mapping, school-facing output, or Germany-wide claim.",
      currentness_checker: "build-scripts/inspection/check-international-overlay-architecture.js",
    },
    curriculum_mappings: [
      {
        book_scope: "Book 1 Chapter 1.2 Vraag",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "Bavaria LehrplanPLUS WR12 and KMK economic competence context.",
        portable_core: ["Nachfrage", "Zahlungsbereitschaft", "Nachfragekurve", "Nachfragefaktoren", "Konsumentenrente where locally appropriate"],
        overlay_action: "Review whether demand-side consumer concepts belong in Bavaria WR12, lower grades, or another Land route before any lesson adaptation.",
      },
      {
        book_scope: "Book 1 Chapter 1.3 Aanbod en marktevenwicht",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "Bavaria LehrplanPLUS WR12 market/production source plus KMK EPA competence framing.",
        portable_core: ["Angebot", "Angebotskurve", "Marktgleichgewicht", "Angebots- und Nachfrageverschiebungen", "Diagrammauswertung"],
        overlay_action: "Separate Bavarian WR12 business/economics/legal emphasis from generic Dutch market examples.",
      },
    ],
    assessment_mappings: [
      {
        assessment_source_status: "covered_for_federal_context_only",
        allowed_internal_use: "Use KMK EPA Wirtschaft as general competence/exam-context language only.",
        forbidden_inference: "No Land-specific Abitur readiness, grading validity, or school assessment claim is allowed.",
      },
    ],
    terminology_substitutions: [
      ["vraaglijn", "Nachfragekurve"],
      ["aanbodlijn", "Angebotskurve"],
      ["betalingsbereidheid", "Zahlungsbereitschaft"],
      ["consumentensurplus", "Konsumentenrente after local review"],
      ["marktevenwicht", "Marktgleichgewicht"],
      ["ceteris paribus", "ceteris paribus"],
    ],
    institution_example_substitutions: [
      "Replace Dutch institutions with German/Bavarian contexts only after Land-specific review.",
      "Business and legal examples may require stronger Bavaria WR12 Wirtschaft und Recht framing.",
      "Do not use Bavaria examples for Germany-wide claims.",
    ],
    accessibility_inclusion_terminology: [
      "individuelle Foerderung after Land-specific source review",
      "barrierefreie Materialien as product-accessibility practice only",
      "school-owned support documentation",
    ],
    school_owned_evidence_boundary: [
      "Land school-quality, support, and assessment records are not supplied by this descriptor.",
      "The descriptor is an internal source map; it is not a German or Bavarian compliance artefact.",
    ],
    forbidden_claims: [
      "4veco is suitable for Germany as a whole.",
      "Bavaria proves all German Laender.",
      "KMK EPA equals a product approval route.",
      "The descriptor proves Abitur or school-inspection readiness.",
    ],
    proof_required_to_close: [
      "German country/source review for KMK and Bavaria boundaries.",
      "Bavaria teacher/economics review of terminology and concept placement.",
      "Land-specific inspection/evaluation source refresh if school-quality claims are ever considered.",
      "Human approval before any local edition or Germany-facing output.",
    ],
  },
  {
    descriptor_id: "california.v0",
    jurisdiction_id: "california_united_states",
    jurisdiction_label: "California / United States",
    governance_archetype: "state_standards_with_federal_accountability_context",
    status: "internal_overlay_descriptor_complete",
    jurisdiction_boundary: {
      boundary_label: "California state standards plus U.S. federal accountability context",
      governance_level: "state curriculum standards with federal accountability law context",
      includes: ["California History-Social Science economics standards", "California History-Social Science Framework chapter 18", "U.S. Department of Education ESSA accountability context"],
      excludes: ["national U.S. curriculum", "national U.S. inspection regime", "state accreditation", "district adoption", "other states"],
      boundary_warning: "The United States has state and local education authority; California does not prove U.S.-wide fit.",
    },
    authority_type: {
      inspection_or_school_evaluation: "not_covered_in_descriptor: no national U.S. inspection regime is claimed and no California school-evaluation source is included.",
      curriculum: "covered_for_descriptor: California History-Social Science Principles of Economics standards and framework.",
      examination: "not_covered_in_descriptor: no California statewide economics exam source is included.",
      accountability: "covered_for_federal_context_only: U.S. Department of Education ESSA source describes federal accountability context and state plans.",
      accreditation: "not_covered_in_descriptor: no accreditation source is used.",
      regional_or_state_overlay: "covered_for_descriptor: California is one state overlay; other states require separate descriptors.",
    },
    official_source_allowlist: [
      source(
        "us-ca-hss-principles-economics-standards",
        "California Department of Education",
        "History-Social Science Standards - Principles of Economics, Grade 12",
        "https://www2.cde.ca.gov/cacs/history?c0=13",
        "state curriculum standards",
        "standards portal",
        "California",
        "Live official standards portal verified 2026-06-22",
        "Map Grade 12 Principles of Economics standards, including market economy, incentives, supply, and demand.",
        "Does not prove U.S.-wide standards fit, district adoption, accreditation, or school accountability compliance."
      ),
      source(
        "us-ca-hss-framework-chapter18",
        "California Department of Education",
        "History-Social Science Framework, Chapter 18: Grade Twelve - Principles of Economics",
        "https://www.cde.ca.gov/ci/hs/cf/documents/hssfwchapter18.pdf",
        "state curriculum framework",
        "framework chapter",
        "California",
        "Adopted framework source; official page verified 2026-06-22",
        "Provide California implementation context for Grade 12 economics instruction.",
        "Does not authorize a product claim or substitute for local district curriculum decisions."
      ),
      source(
        "us-ed-essa-overview",
        "U.S. Department of Education",
        "What is the Every Student Succeeds Act?",
        "https://www.ed.gov/laws-and-policy/laws-preschool-grade-12-education/esea/what-is-the-every-student-succeeds-act",
        "federal accountability context",
        "accountability framework",
        "United States federal context",
        "Live official page verified 2026-06-22",
        "Explain why U.S. accountability is state-plan and transparency oriented, not a national inspection route.",
        "Does not create a national U.S. inspection, curriculum, or accreditation claim."
      ),
    ],
    source_freshness: {
      access_date: ACCESS_DATE,
      freshness_status: "fresh_for_internal_overlay_architecture",
      refresh_required_before: "Any California-specific local edition, district-facing output, accountability claim, accreditation claim, or other-state overlay.",
      currentness_checker: "build-scripts/inspection/check-international-overlay-architecture.js",
    },
    curriculum_mappings: [
      {
        book_scope: "Book 1 Chapter 1.2 Vraag",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "California Grade 12 Principles of Economics standards and framework.",
        portable_core: ["economic reasoning", "incentives", "law of demand", "substitutes", "market behavior", "graphs and data use"],
        overlay_action: "Map exact HSS-PoE standards before any California lesson adaptation; do not use national comparators as authority.",
      },
      {
        book_scope: "Book 1 Chapter 1.3 Aanbod en marktevenwicht",
        mapping_status: "candidate_internal_crosswalk",
        local_authority_anchor: "California HSS-PoE standards, especially market economy/supply-demand standards.",
        portable_core: ["law of supply", "law of demand", "incentives", "market equilibrium", "shortage/surplus", "curve shifts"],
        overlay_action: "Translate Dutch market examples into California/US contexts only after teacher/economics and local source review.",
      },
    ],
    assessment_mappings: [
      {
        assessment_source_status: "not_covered_in_descriptor",
        allowed_internal_use: "Record that no California statewide economics assessment mapping is included.",
        forbidden_inference: "No summative validity, state-test readiness, accreditation, or district-adoption claim is allowed.",
      },
    ],
    terminology_substitutions: [
      ["vraaglijn", "demand curve"],
      ["aanbodlijn", "supply curve"],
      ["betalingsbereidheid", "willingness to pay"],
      ["consumentensurplus", "consumer surplus"],
      ["marktevenwicht", "market equilibrium"],
      ["tekort/overschot", "shortage/surplus"],
    ],
    institution_example_substitutions: [
      "Use California or U.S. examples only where state standards/framework context supports them.",
      "District adoption, school accountability, and accreditation examples are out of scope.",
      "Do not treat AP, CEE, or NCSS comparators as official state authority unless separately authorised.",
    ],
    accessibility_inclusion_terminology: [
      "access and equity",
      "students with disabilities",
      "English learners where locally sourced",
      "district/school-owned accommodation evidence",
    ],
    school_owned_evidence_boundary: [
      "District curriculum decisions, student supports, accountability reports, and any accreditation evidence are outside this descriptor.",
      "Federal ESSA context does not turn product evidence into school accountability evidence.",
    ],
    forbidden_claims: [
      "4veco meets U.S. standards.",
      "California proves national U.S. fit.",
      "The descriptor creates inspection or accreditation readiness.",
      "The descriptor authorizes district or student-facing adoption.",
    ],
    proof_required_to_close: [
      "California source refresh with exact HSS-PoE standards selected.",
      "Teacher/economics review of U.S. terminology and examples.",
      "Legal/claims review before any accountability, district, accreditation, or public wording.",
      "Human approval before any local edition or U.S.-facing output.",
    ],
  },
];

const bookCrosswalkRows = [
  {
    concept_id: "1.2.1_willingness_to_pay_individual_demand",
    book_scope: "Book 1 Chapter 1.2",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1 Individuele vraag – paragraaf.md",
    local_heading: "1.2.1 Individuele vraag",
    portable_core: "Willingness to pay, individual demand, buy/no-buy decisions, and demand curve reasoning are portable product-pedagogy concepts.",
    overlay_requirements: {
      england: "Translate to A level economics vocabulary and later map to DfE topic/assessment-objective language.",
      flanders: "Retain Dutch-language concepts only after Flemish curriculum-goal mapping and terminology review.",
      bavaria: "Map to Nachfrage/Zahlungsbereitschaft only where Bavaria WR12 or another Land route supports placement.",
      california: "Map to California HSS-PoE economic reasoning and market-economy standards before adaptation.",
    },
  },
  {
    concept_id: "1.2.1_consumer_surplus",
    book_scope: "Book 1 Chapter 1.2",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.1 Individuele vraag/1.2.1 Individuele vraag – paragraaf.md",
    local_heading: "1.2.1 Individuele vraag",
    portable_core: "Consumer surplus diagrams and stepwise price-quantity reasoning can be reused internally as a concept family.",
    overlay_requirements: {
      england: "Check subject-content depth and exam-board treatment before claiming fit.",
      flanders: "Keep as a candidate economics concept pending exact goal mapping.",
      bavaria: "Treat Konsumentenrente as placement-sensitive and review before local use.",
      california: "Use only if California standards/framework mapping supports depth; otherwise mark as extension.",
    },
  },
  {
    concept_id: "1.2.2_demand_factors_movement_vs_shift",
    book_scope: "Book 1 Chapter 1.2",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.2 Vraagfactoren/1.2.2 Vraagfactoren – paragraaf.md",
    local_heading: "1.2.2 Vraagfactoren",
    portable_core: "Own-price movement along a demand curve is distinct from a demand-curve shift caused by income, preferences, substitutes, complements, population, or expectations.",
    overlay_requirements: {
      england: "Use English demand-factor terminology and guard against exam-board-specific command words.",
      flanders: "Review local examples and Flemish wording for substitutes/complements and income effects.",
      bavaria: "Translate into Nachfragefaktoren and local example contexts; confirm Land placement.",
      california: "Map to incentives, substitutes, and law-of-demand standards where exact standards support it.",
    },
  },
  {
    concept_id: "1.2.3_collective_demand",
    book_scope: "Book 1 Chapter 1.2",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.3 Van individuele naar collectieve vraag/1.2.3 Van individuele naar collectieve vraag – paragraaf.md",
    local_heading: "1.2.3 Van individuele naar collectieve vraag",
    portable_core: "Aggregating individual demand into market demand is portable if local curriculum depth supports it.",
    overlay_requirements: {
      england: "Check whether market demand aggregation is required or assumed under A level content.",
      flanders: "Map to exact Flemish economic/financial-economic goals before output use.",
      bavaria: "Confirm whether aggregation sits in WR12, a lower grade, or a different Land content path.",
      california: "Use as market-economy reasoning where standards/framework support aggregation.",
    },
  },
  {
    concept_id: "1.2.4_mixed_demand_tasks",
    book_scope: "Book 1 Chapter 1.2",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.2 Hoofdstuk Vraag/1.2.4 Gemengde opgaven/1.2.4 Gemengde opgaven – opgaven.md",
    local_heading: "1.2.4 Gemengde opgaven",
    portable_core: "Mixed demand tasks are useful internal task-family evidence but not local assessment proof.",
    overlay_requirements: {
      england: "Replace task forms only after exam-board source review.",
      flanders: "Do not infer Flemish assessment fit from Dutch mixed exercises.",
      bavaria: "Review task verbs, contexts, and difficulty against Land expectations.",
      california: "Keep as formative practice only; no California assessment mapping is included.",
    },
  },
  {
    concept_id: "1.3.1_supply_curve_supply_factors",
    book_scope: "Book 1 Chapter 1.3",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.1 Aanbod/1.3.1 Aanbod – paragraaf.md",
    local_heading: "1.3.1 Aanbod",
    portable_core: "Supply curve, movement along supply, supply shifts, input costs, technology, expectations, and policy factors are portable concept families.",
    overlay_requirements: {
      england: "Use A level economics terminology and assessment-objective review later.",
      flanders: "Confirm Flemish goal mapping and example contexts.",
      bavaria: "Map to Angebot/Angebotskurve and Bavaria WR12 market/production context.",
      california: "Map to law of supply and incentive standards before local use.",
    },
  },
  {
    concept_id: "1.3.2_market_equilibrium_shortage_surplus",
    book_scope: "Book 1 Chapter 1.3",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.2 Marktevenwicht/1.3.2 Marktevenwicht – paragraaf.md",
    local_heading: "1.3.2 Marktevenwicht",
    portable_core: "Demand/supply intersection, equilibrium price/quantity, shortage, surplus, and price adjustment are core market-model reasoning.",
    overlay_requirements: {
      england: "Separate concept transfer from exam-board graph conventions.",
      flanders: "Retain as internal concept family pending Flemish curriculum-goal mapping.",
      bavaria: "Review with Bavaria market/production context and German terminology.",
      california: "Map to market economy and supply/demand standards.",
    },
  },
  {
    concept_id: "1.3.3_shifts_new_equilibrium",
    book_scope: "Book 1 Chapter 1.3",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.3 Verschuivingen en nieuw evenwicht/1.3.3 Verschuivingen en nieuw evenwicht – paragraaf.md",
    local_heading: "1.3.3 Verschuivingen en nieuw evenwicht",
    portable_core: "Demand/supply shifts, new equilibrium reasoning, and two-shift ambiguity are portable if local examples are substituted.",
    overlay_requirements: {
      england: "Check command-word and graph-label conventions later.",
      flanders: "Review Flemish examples and preserve separation from school-quality evidence.",
      bavaria: "Use German graph labels and confirm local scenario fit.",
      california: "Use state/local examples only after source review; no district adoption claim.",
    },
  },
  {
    concept_id: "1.3.4_mixed_supply_demand_tasks",
    book_scope: "Book 1 Chapter 1.3",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.3 Hoofdstuk Aanbod en marktevenwicht/1.3.4 Gemengde opgaven/1.3.4 Gemengde opgaven – opgaven.md",
    local_heading: "1.3.4 Gemengde opgaven",
    portable_core: "Mixed supply-demand exercises are internal product-quality evidence and candidate formative practice only.",
    overlay_requirements: {
      england: "No exam-board mapping without awarding-body sources.",
      flanders: "No Flemish assessment claim without assessment source refresh.",
      bavaria: "No Abitur-readiness claim from generic tasks.",
      california: "No California assessment or district-use claim.",
    },
  },
  {
    concept_id: "book1_output_boundary",
    book_scope: "Book 1 Chapters 1.2 and 1.3",
    source_pointer: "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/Boek 1 Grondslagen, vraag en aanbod – boek.md",
    local_heading: "Book 1 current generated chapter assembly",
    portable_core: "The crosswalk can discuss current product concepts, generated chapter structure, and route-local proof status only.",
    overlay_requirements: {
      england: "No England country edition, school-facing output, or public route.",
      flanders: "No Flemish edition or all-Belgium claim.",
      bavaria: "No Bavaria/Germany edition or whole-Germany claim.",
      california: "No California/U.S. edition, district adoption, or national-US claim.",
    },
  },
];

function descriptorSchema() {
  const required = [
    "schema_version",
    "descriptor_id",
    "jurisdiction_id",
    "jurisdiction_label",
    "governance_archetype",
    "status",
    "jurisdiction_boundary",
    "authority_type",
    "official_source_allowlist",
    "source_freshness",
    "curriculum_mappings",
    "assessment_mappings",
    "terminology_substitutions",
    "institution_example_substitutions",
    "accessibility_inclusion_terminology",
    "school_owned_evidence_boundary",
    "forbidden_claims",
    "proof_required_to_close",
    "output_boundary",
    "finding_classification",
  ];
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "https://4veco.internal/schemas/international-jurisdiction-overlay.schema.json",
    title: "International Jurisdiction Overlay Descriptor",
    description: "Internal-only descriptor contract for bounded jurisdiction overlays. It is not a country edition, compliance claim, inspection-readiness claim, public output, or school-facing artifact.",
    type: "object",
    additionalProperties: false,
    required,
    properties: {
      schema_version: { type: "integer", const: 1 },
      descriptor_id: { type: "string", pattern: "^[a-z0-9_-]+\\.v0$" },
      jurisdiction_id: { type: "string" },
      jurisdiction_label: { type: "string" },
      governance_archetype: { type: "string" },
      status: { type: "string" },
      jurisdiction_boundary: { type: "object" },
      authority_type: { type: "object" },
      official_source_allowlist: { type: "array", minItems: 2 },
      source_freshness: { type: "object" },
      curriculum_mappings: { type: "array", minItems: 2 },
      assessment_mappings: { type: "array", minItems: 1 },
      terminology_substitutions: { type: "array", minItems: 4 },
      institution_example_substitutions: { type: "array", minItems: 2 },
      accessibility_inclusion_terminology: { type: "array", minItems: 2 },
      school_owned_evidence_boundary: { type: "array", minItems: 2 },
      forbidden_claims: { type: "array", minItems: 4 },
      proof_required_to_close: { type: "array", minItems: 3 },
      output_boundary: { type: "object" },
      finding_classification: { type: "array", minItems: 3 },
    },
  };
}

function decorateDescriptor(descriptor) {
  return {
    schema_version: 1,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    internal_only: true,
    manual_invocation_only: true,
    product_end_state: PRODUCT_END_STATE,
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    foundation_decision_source: FOUNDATION_DECISION,
    ...descriptor,
    output_boundary: boundaryFlags(),
    finding_classification: [
      {
        finding: `${descriptor.jurisdiction_label} descriptor has an explicit jurisdiction boundary and official source allowlist.`,
        classification: "core_requirement_met",
        blocks: "Nothing for internal overlay architecture.",
        does_not_block: "Proceeding to human review for the architecture packet.",
        proof_required_to_close: "Country/source reviewer PASS and checker PASS.",
      },
      {
        finding: `${descriptor.jurisdiction_label} retains local assessment and school-owned evidence gaps.`,
        classification: "minor_carry_flag",
        blocks: "Country edition, public/school-facing output, assessment-readiness, inspection/accreditation, and compliance claims.",
        does_not_block: "Internal descriptor and crosswalk architecture.",
        proof_required_to_close: "Separate authorised source refresh and human gate before any local implementation.",
      },
      {
        finding: `${descriptor.jurisdiction_label} forbids downstream product and authority jumps.`,
        classification: "scale_blocker",
        blocks: "Product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, OP0, PTA, summative, and inspection-readiness claims.",
        does_not_block: "Manual internal analytical review of the descriptor.",
        proof_required_to_close: "Future explicit human authorisation with local expert/legal review.",
      },
    ],
  };
}

function buildDescriptors() {
  return descriptors.map(decorateDescriptor);
}

function buildArchetypePilot(descriptorBundle) {
  return {
    ...commonFields("international-overlay-archetype-pilot", "four_archetype_pilot_complete"),
    descriptor_schema: OUTPUT_PATHS[0],
    descriptor_files: OUTPUT_PATHS.slice(1, 5),
    governance_archetypes: GOVERNANCE_ARCHETYPES,
    descriptors: descriptorBundle.map((descriptor) => ({
      descriptor_id: descriptor.descriptor_id,
      jurisdiction_label: descriptor.jurisdiction_label,
      governance_archetype: descriptor.governance_archetype,
      boundary_label: descriptor.jurisdiction_boundary.boundary_label,
      source_count: descriptor.official_source_allowlist.length,
      curriculum_mapping_count: descriptor.curriculum_mappings.length,
      assessment_status: descriptor.assessment_mappings.map((item) => item.assessment_source_status),
      school_owned_boundary: descriptor.school_owned_evidence_boundary,
      proof_required_to_close: descriptor.proof_required_to_close,
    })),
    output_allowlist_policy:
      "Only OUTPUT_PATHS from build-scripts/inspection/build-international-overlay-architecture.js may be written; descriptors are explicit and no directory globbing or implicit source discovery is permitted.",
    finding_classification: [
      {
        finding: "The four selected descriptors cover the required governance archetypes without creating country editions.",
        classification: "core_requirement_met",
        blocks: "Nothing for human review of this architecture packet.",
        does_not_block: "Selected-jurisdiction deepening if the human owner approves the bounded decision.",
        proof_required_to_close: "Country/source reviews, governance/legal/accessibility reviews, final lead PASS, currentness checker PASS, and green CI.",
      },
      {
        finding: "Every descriptor carries local assessment, school-owned evidence, and authority gaps.",
        classification: "minor_carry_flag",
        blocks: "Any local edition, teacher/school-facing output, compliance, approval, inspection-readiness, assessment-readiness, or public claim.",
        does_not_block: "Internal architecture decision.",
        proof_required_to_close: "Separate authorised local source-refresh gate per jurisdiction.",
      },
      {
        finding: "The architecture remains internal-only and manually invoked.",
        classification: "scale_blocker",
        blocks: "Evidence-pack generation, dashboard/package/CI product integration, quality-ref, Scale Gate, product-route adoption, diagnostics/mastery/PV, student/product-use, personal data, OP0, PTA, and summative claims.",
        does_not_block: "Repository PR validation and human review.",
        proof_required_to_close: "Explicit future human approval for any downstream authority.",
      },
    ],
  };
}

function buildCrosswalk(descriptorBundle) {
  return {
    ...commonFields("book1-1.2-1.3-overlay-crosswalk", "book1_crosswalk_complete"),
    book_scope: "Book 1 Chapters 1.2 and 1.3",
    source_policy:
      "Repo-relative lesson pointers identify the current product surfaces. They are not generated lesson-output scans and do not authorise country-edition output.",
    descriptor_files: descriptorBundle.map((descriptor) => `references/data/inspection-standards/overlays/${descriptor.descriptor_id.replace(".v0", "")}.v0.json`),
    evidence_status: "route-local-only evidence status",
    school_owned_evidence_needed: true,
    forbidden_inferences: [
      "The crosswalk proves local curriculum compliance.",
      "The crosswalk proves school inspection, accountability, accreditation, or exam readiness.",
      "The crosswalk authorizes public, teacher/school-facing, student/product-use, or country-edition output.",
      "The crosswalk can substitute local expert or competent-authority review.",
    ],
    crosswalk_rows: bookCrosswalkRows.map((row) => ({
      ...row,
      evidence_status: "route-local-only",
      school_owned_boundary: "School implementation, teacher judgement, support records, local assessment, inspection/accreditation evidence, and accountability proof remain school-owned or competent-authority-owned.",
      proof_required_to_close:
        "Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation.",
    })),
    finding_classification: [
      {
        finding: "Book 1 Chapters 1.2 and 1.3 have a portable economics concept core suitable for internal overlay mapping.",
        classification: "core_requirement_met",
        blocks: "Nothing for internal architecture review.",
        does_not_block: "Human review of the architecture packet.",
        proof_required_to_close: "Teacher/economics reviewer PASS and checker PASS.",
      },
      {
        finding: "The crosswalk is not a local curriculum, assessment, or inspection proof.",
        classification: "scale_blocker",
        blocks: "Country editions, exam-readiness, inspection-readiness, public/school-facing output, product routes, and Scale Gate use.",
        does_not_block: "Internal common-core and overlay architecture.",
        proof_required_to_close: "Separate local source-refresh and implementation gate.",
      },
      {
        finding: "Some concept placement and terminology depth remains jurisdiction-specific.",
        classification: "minor_carry_flag",
        blocks: "Direct adaptation without local expert review.",
        does_not_block: "Internal selected-jurisdiction deepening if approved.",
        proof_required_to_close: "Local teacher/economics review before any selected-jurisdiction implementation.",
      },
    ],
  };
}

function buildDecision(archetypePilot, crosswalk) {
  return {
    ...commonFields("international-overlay-architecture-decision", "human_review_pending"),
    final_overlay_architecture_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rejected_options: DECISION_OPTIONS.filter((option) => option !== SELECTED_DECISION),
      decision_selection_count: 1,
      meaning:
        "Proceed only to a later internal selected-jurisdiction deepening step if the human owner approves this packet. This does not authorise country editions, local implementation, public/school-facing output, product routes, or Scale Gate use.",
      basis: [archetypePilot.report_id, crosswalk.report_id, "four explicit v0 jurisdiction descriptors", "international-jurisdiction-overlay.schema.json"],
    },
    authorizes_after_human_approval: [
      "Internal selected-jurisdiction deepening planning.",
      "Further source-refresh work for a selected jurisdiction if separately scoped.",
      "Manual repository validation of descriptor and crosswalk currentness.",
    ],
    still_blocked: OVERLAY_BLOCKED_AUTHORITY,
    owner_next_action:
      "Human owner may accept, revise, or reject GOAL-IQS-OVERLAY-ARCHITECTURE-1. Acceptance authorizes only a future internal selected-jurisdiction deepening step, not country-edition or downstream product authority.",
    finding_classification: [
      {
        finding: "The overlay descriptor schema, four descriptors, crosswalk, and validators are complete enough for human review.",
        classification: "core_requirement_met",
        blocks: "Nothing if all specialist and CI proof remain green.",
        does_not_block: "Human decision on the next internal selected-jurisdiction deepening step.",
        proof_required_to_close: "Final lead PASS, fresh mergeable PR, green CI, and human acceptance.",
      },
      {
        finding: "Local implementation authority remains blocked.",
        classification: "scale_blocker",
        blocks: "Country editions, public/school-facing output, teacher output, evidence packs, dashboard/package/CI product integration, quality-ref, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, OP0, PTA, summative, inspection-readiness, compliance, and approval claims.",
        does_not_block: "Internal architecture review.",
        proof_required_to_close: "Separate human-authorised local implementation gate with local source, teacher, legal/privacy, and quality-inspection reviews.",
      },
    ],
  };
}

function buildBundle() {
  const schema = descriptorSchema();
  const descriptorBundle = buildDescriptors();
  const archetypePilot = buildArchetypePilot(descriptorBundle);
  const crosswalk = buildCrosswalk(descriptorBundle);
  const decision = buildDecision(archetypePilot, crosswalk);
  return { schema, descriptorBundle, archetypePilot, crosswalk, decision };
}

function escapeCell(value) {
  return String(value).replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim();
}

function list(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function pushProductSpec(lines, data) {
  lines.push("## Product End-State And Original Spec", "");
  lines.push(`- Product end-state: \`${data.product_end_state}\``);
  lines.push(`- Original sprint/gate spec: \`${data.original_sprint_gate_spec}\``);
  lines.push(`- Foundation decision source: \`${data.foundation_decision_source}\``);
  lines.push("");
}

function pushNonNegotiables(lines, data) {
  lines.push("## Non-Negotiable Requirements", "");
  lines.push(list(data.non_negotiable_requirements), "");
}

function pushCoreChecklist(lines, data) {
  lines.push("## Core-Requirement Checklist", "");
  lines.push("| Requirement | Status | proof_required_to_close |");
  lines.push("|---|---|---|");
  for (const item of data.core_requirement_checklist) {
    lines.push(`| \`${escapeCell(item.id)}\`: ${escapeCell(item.requirement)} | \`${escapeCell(item.status)}\` | ${escapeCell(item.proof_required_to_close)} |`);
  }
  lines.push("");
}

function pushFindings(lines, findings) {
  lines.push("## Finding Classification", "");
  lines.push("| Finding | Classification | blocks | does_not_block | proof_required_to_close |");
  lines.push("|---|---|---|---|---|");
  for (const finding of findings) {
    lines.push(`| ${escapeCell(finding.finding)} | \`${escapeCell(finding.classification)}\` | ${escapeCell(finding.blocks)} | ${escapeCell(finding.does_not_block)} | ${escapeCell(finding.proof_required_to_close)} |`);
  }
  lines.push("");
}

function renderDescriptorContract(bundle) {
  const lines = [
    "# International Overlay Descriptor Contract",
    "",
    "Status: internal descriptor contract",
    `Date: ${ACCESS_DATE}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "This contract defines internal-only jurisdiction overlay descriptors. It does not create a country edition, public output, teacher/school-facing output, evidence pack, product route, Scale Gate input, diagnostics/mastery/PV path, student/product-use authority, personal-data processing, compliance claim, approval claim, OP0 claim, PTA claim, summative-validity claim, or inspection-readiness claim.",
    "",
  ];
  pushProductSpec(lines, bundle.archetypePilot);
  pushNonNegotiables(lines, bundle.archetypePilot);
  pushCoreChecklist(lines, bundle.archetypePilot);
  lines.push("## Descriptor Fields", "");
  lines.push("| Field | Requirement |");
  lines.push("|---|---|");
  for (const field of bundle.schema.required) {
    lines.push(`| \`${field}\` | Required by \`references/schemas/international-jurisdiction-overlay.schema.json\`. |`);
  }
  lines.push("");
  lines.push("## Source And Output Allowlists", "");
  lines.push("- Each descriptor owns an explicit `official_source_allowlist`.");
  lines.push("- The builder writes only the `OUTPUT_PATHS` allowlist in `build-scripts/inspection/build-international-overlay-architecture.js`.");
  lines.push("- Directory globbing, implicit source discovery, generated lesson-output scanning, country-edition generation, and public/school-facing export are out of scope.");
  lines.push("");
  lines.push("## Descriptor Files", "");
  lines.push(list(bundle.archetypePilot.descriptor_files.map((file) => `\`${file}\``)), "");
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderGovernanceRules(bundle) {
  const lines = [
    "# International Overlay Governance Rules",
    "",
    "Status: internal governance rules",
    `Date: ${ACCESS_DATE}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, bundle.archetypePilot);
  pushNonNegotiables(lines, bundle.archetypePilot);
  pushCoreChecklist(lines, bundle.archetypePilot);
  lines.push("## Governance Archetypes", "");
  lines.push("| Archetype | Descriptor | Risk | Control |");
  lines.push("|---|---|---|---|");
  for (const archetype of GOVERNANCE_ARCHETYPES) {
    lines.push(`| ${escapeCell(archetype.label)} | \`${escapeCell(archetype.descriptor)}\` | ${escapeCell(archetype.risk)} | ${escapeCell(archetype.control)} |`);
  }
  lines.push("");
  lines.push("## Stop Conditions", "");
  lines.push(list([
    "Stop on country-edition generation.",
    "Stop on public, teacher/school-facing, student/product-use, product-route, dashboard, package/CI product-integration, quality-ref, or Scale Gate use.",
    "Stop on compliance, approval, inspection-readiness, OP0, PTA, summative, accreditation, or school-owned-evidence claims.",
    "Stop on all-Belgium, whole-UK, single-Germany, national-US, or California-as-US overgeneralisation.",
    "Stop on source/output discovery outside explicit allowlists.",
  ]), "");
  lines.push("## Proof Required Before Any Later Local Work", "");
  lines.push(list([
    "Fresh official source allowlist for the selected jurisdiction.",
    "Country/source reviewer PASS.",
    "Teacher/economics reviewer PASS.",
    "Legal/privacy and claims reviewer PASS.",
    "Accessibility/inclusion reviewer PASS.",
    "Final lead reviewer PASS.",
    "Human owner approval for the next bounded step.",
  ]), "");
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderArchetypePilot(report) {
  const lines = [
    "# International Overlay Archetype Pilot",
    "",
    `Status: ${report.status}`,
    `Date: ${report.generated_date}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, report);
  pushNonNegotiables(lines, report);
  pushCoreChecklist(lines, report);
  lines.push("## Descriptor Summary", "");
  lines.push("| Descriptor | Jurisdiction | Archetype | Boundary | Sources | Assessment status |");
  lines.push("|---|---|---|---|---|---|");
  for (const descriptor of report.descriptors) {
    lines.push(`| \`${escapeCell(descriptor.descriptor_id)}\` | ${escapeCell(descriptor.jurisdiction_label)} | \`${escapeCell(descriptor.governance_archetype)}\` | ${escapeCell(descriptor.boundary_label)} | ${descriptor.source_count} | ${escapeCell(descriptor.assessment_status.join(", "))} |`);
  }
  lines.push("");
  lines.push("## Archetype Controls", "");
  lines.push("| Archetype | Risk | Control |");
  lines.push("|---|---|---|");
  for (const archetype of report.governance_archetypes) {
    lines.push(`| ${escapeCell(archetype.label)} | ${escapeCell(archetype.risk)} | ${escapeCell(archetype.control)} |`);
  }
  lines.push("");
  lines.push("## Output Allowlist Policy", "", report.output_allowlist_policy, "");
  pushFindings(lines, report.finding_classification);
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderCrosswalk(report) {
  const lines = [
    "# Book 1 Chapters 1.2 And 1.3 Overlay Crosswalk",
    "",
    `Status: ${report.status}`,
    `Date: ${report.generated_date}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, report);
  pushNonNegotiables(lines, report);
  pushCoreChecklist(lines, report);
  lines.push("## Scope Boundary", "");
  lines.push(`- Book scope: ${report.book_scope}`);
  lines.push(`- Evidence status: \`${report.evidence_status}\``);
  lines.push("- School-owned evidence still needed: `true`");
  lines.push(report.source_policy, "");
  lines.push("## Crosswalk Rows", "");
  lines.push("| Concept | Book scope | Product core | England | Flanders | Bavaria/Germany | California/US | proof_required_to_close |");
  lines.push("|---|---|---|---|---|---|---|---|");
  for (const row of report.crosswalk_rows) {
    lines.push(`| \`${escapeCell(row.concept_id)}\` | ${escapeCell(row.book_scope)} | ${escapeCell(row.portable_core)} | ${escapeCell(row.overlay_requirements.england)} | ${escapeCell(row.overlay_requirements.flanders)} | ${escapeCell(row.overlay_requirements.bavaria)} | ${escapeCell(row.overlay_requirements.california)} | ${escapeCell(row.proof_required_to_close)} |`);
  }
  lines.push("");
  lines.push("## Forbidden Inferences", "");
  lines.push(list(report.forbidden_inferences), "");
  pushFindings(lines, report.finding_classification);
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderDecision(report) {
  const decision = report.final_overlay_architecture_decision;
  const lines = [
    "# International Overlay Architecture Decision",
    "",
    `Status: ${report.status}`,
    `Date: ${report.generated_date}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, report);
  pushNonNegotiables(lines, report);
  pushCoreChecklist(lines, report);
  lines.push("## Final Overlay Architecture Decision", "");
  lines.push(`Selected decision: \`${decision.selected}\``, "");
  lines.push(decision.meaning, "");
  lines.push("Allowed options:");
  lines.push(list(decision.allowed_options.map((item) => `\`${item}\``)), "");
  lines.push(`Decision selection count: \`${decision.decision_selection_count}\``, "");
  lines.push("## Authorizes After Human Approval", "");
  lines.push(list(report.authorizes_after_human_approval), "");
  lines.push("## Still Blocked", "");
  lines.push(list(report.still_blocked.map((item) => `\`${item}\``)), "");
  lines.push("## Owner Next Action", "", report.owner_next_action, "");
  pushFindings(lines, report.finding_classification);
  return `${lines.join("\n").trimEnd()}\n`;
}

function outputContents(bundle) {
  const [england, flanders, bavaria, california] = bundle.descriptorBundle;
  return new Map([
    [OUTPUT_PATHS[0], `${JSON.stringify(bundle.schema, null, 2)}\n`],
    [OUTPUT_PATHS[1], `${JSON.stringify(england, null, 2)}\n`],
    [OUTPUT_PATHS[2], `${JSON.stringify(flanders, null, 2)}\n`],
    [OUTPUT_PATHS[3], `${JSON.stringify(bavaria, null, 2)}\n`],
    [OUTPUT_PATHS[4], `${JSON.stringify(california, null, 2)}\n`],
    [OUTPUT_PATHS[5], renderDescriptorContract(bundle)],
    [OUTPUT_PATHS[6], renderGovernanceRules(bundle)],
    [OUTPUT_PATHS[7], renderArchetypePilot(bundle.archetypePilot)],
    [OUTPUT_PATHS[8], `${JSON.stringify(bundle.archetypePilot, null, 2)}\n`],
    [OUTPUT_PATHS[9], renderCrosswalk(bundle.crosswalk)],
    [OUTPUT_PATHS[10], `${JSON.stringify(bundle.crosswalk, null, 2)}\n`],
    [OUTPUT_PATHS[11], renderDecision(bundle.decision)],
    [OUTPUT_PATHS[12], `${JSON.stringify(bundle.decision, null, 2)}\n`],
  ]);
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();
  if (/country-edition|local-edition|country-compliant|country-compliance|compliance|compliant|approval|approved|inspection-ready|inspection-readiness|op0|pta|summative|accreditation/.test(joined)) {
    throw new StopError("STOP_COMPLIANCE_APPROVAL_CLAIM", "Country edition, compliance, approval, accreditation, and inspection-readiness claims are not authorised.", { args: unknown });
  }
  if (/public|external|publish|teacher|school-facing|school-pack|evidence-pack/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_AUDIENCE", "School-facing, public, external, or evidence-pack output is not authorised.", { args: unknown });
  }
  if (/student|personal|data-processing|product-route|scale|diagnostics|mastery|pv/.test(joined)) {
    throw new StopError("STOP_DOWNSTREAM_AUTHORITY", "Downstream product/student/data authority is not authorised.", { args: unknown });
  }
  if (/all-belgium|whole-uk|single-germany|national-us|us-inspection|california-as-us/.test(joined)) {
    throw new StopError("STOP_GOVERNANCE_OVERGENERALISATION", "Governance boundaries must remain jurisdiction-specific.", { args: unknown });
  }
  if (/glob|implicit-source|scan-generated-lessons|generated-lesson-output/.test(joined)) {
    throw new StopError("STOP_IMPLICIT_DISCOVERY", "Implicit source/output discovery and generated lesson-output scanning are not authorised.", { args: unknown });
  }
  if (/package|(?:^|\s|-)ci(?:$|\s|-)|dashboard|quality-ref|quality_ref/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_INTEGRATION", "Package, CI, dashboard, and quality-ref product integration are not authorised.", { args: unknown });
  }
  if (unknown.length > 0) {
    throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for international overlay architecture generator.", { args: unknown });
  }
  return { check };
}

function writeOrCheck(contents, check) {
  const mismatches = [];
  for (const [relativePath, content] of contents.entries()) {
    if (!OUTPUT_PATHS.includes(relativePath)) {
      throw new StopError("STOP_OUTPUT_ALLOWLIST_MISMATCH", `Output not allowlisted: ${relativePath}`);
    }
    const fullPath = path.resolve(process.cwd(), relativePath);
    if (check) {
      const current = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
      if (current !== content) mismatches.push(relativePath);
      continue;
    }
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf8");
  }
  if (mismatches.length > 0) {
    throw new Error(`International overlay architecture output is stale: ${mismatches.join(", ")}`);
  }
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
    console.log(mode.check ? "International overlay architecture output is current." : "International overlay architecture output generated.");
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
  GOVERNANCE_ARCHETYPES,
  OUTPUT_PATHS,
  OVERLAY_BLOCKED_AUTHORITY,
  REV_STD_FINDING_CLASSIFICATIONS,
  SELECTED_DECISION,
  buildBundle,
  bookCrosswalkRows,
  descriptors,
  outputContents,
  parseMode,
};
