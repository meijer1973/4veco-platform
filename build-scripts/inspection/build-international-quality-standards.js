#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ACCESS_DATE = "2026-06-21";
const SPRINT_ID = "GOAL-IQS-FOUNDATION-1";
const SELECTED_DECISION = "PROCEED_WITH_COMMON_CORE_AND_OVERLAYS";
const DECISION_OPTIONS = [
  "PROCEED_WITH_COMMON_CORE_AND_OVERLAYS",
  "LIMIT_TO_SELECTED_JURISDICTIONS",
  "RESEARCH_GAPS_BEFORE_ARCHITECTURE",
];

const OUTPUT_PATHS = [
  "references/data/inspection-standards/international-authority-profiles.v0.json",
  "references/data/inspection-standards/international-common-core.v0.json",
  "docs/inspection-standards/international-common-core-model.md",
  "docs/inspection-standards/international-overlay-architecture.md",
  "reports/inspection-standards/international-commonalities-and-differences.md",
  "reports/inspection-standards/international-commonalities-and-differences.json",
  "reports/inspection-standards/international-book-portability-pilot.md",
  "reports/inspection-standards/international-book-portability-pilot.json",
  "reports/inspection-standards/international-foundation-decision.md",
  "reports/inspection-standards/international-foundation-decision.json",
];

const BLOCKED_AUTHORITY = [
  "country_compliance_claim",
  "inspectorate_approval_claim",
  "legal_compliance_claim",
  "inspection_readiness_claim",
  "school_pack_trial",
  "teacher_school_distribution",
  "public_external_distribution",
  "evidence_pack_deployment",
  "package_script_invocation",
  "ci_invocation",
  "dashboard_gate",
  "quality_ref_integration",
  "product_route_adoption",
  "scale_gate_integration",
  "diagnostics_mastery_pv",
  "student_or_product_use",
  "personal_data_processing",
  "complete_op0_pta_summative_claim",
  "op0_claim",
  "pta_validity_claim",
  "summative_validity_claim",
  "single_national_us_inspection_claim",
  "whole_uk_claim_from_england_only",
  "all_belgium_claim_from_flanders_only",
  "germany_single_land_claim",
];

const REV_STD_FINDING_CLASSIFICATIONS = [
  "core_requirement_met",
  "quality_improvement_available",
  "minor_carry_flag",
  "scale_blocker",
  "core_spec_failure",
];

const ORIGINAL_SPRINT_GATE_SPEC =
  "archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-authorisation-note.md";

const REVIEW_PACKET_REQUIREMENTS = [
  "Cite the product end-state and original sprint/gate specification.",
  "Name non-negotiable requirements before conclusions.",
  "Include a core-requirement checklist.",
  "Classify findings with blocks, does_not_block, and proof_required_to_close.",
  "Do not carry any missing core requirement as PASS WITH FLAGS.",
  "Keep all country-compliance, approval, public, school-facing, package/CI/dashboard/quality-ref, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, and inspection-readiness authority blocked.",
];

const CORE_REQUIREMENTS = [
  ["official_source_profiles", "Nine jurisdiction profiles use official-source anchors and record allowed use plus forbidden inference."],
  ["governance_boundaries", "Flanders, England, Germany, Spain, and the United States retain explicit subnational or federal/state boundaries."],
  ["common_core_matrix", "The shared common-core matrix distinguishes portable product-pedagogy from local overlay needs."],
  ["differences_matrix", "The differences matrix names material divergences and the architecture response."],
  ["overlay_architecture", "The overlay architecture separates shared core, local curriculum/exam overlays, source-evidence overlay, and school-owned evidence."],
  ["book_portability_check", "Book 1 Chapters 1.2 and 1.3 are tested only as a bounded internal portability check."],
  ["blocked_authority", "All forbidden authority flags remain false and visible."],
  ["single_decision", "The foundation chooses exactly one allowed decision."],
  ["human_review_stop", "The packet returns for human review before any country edition, public/school-facing, product, or compliance step."],
];

class StopError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "StopError";
    this.code = code;
    this.details = details;
  }
}

function boundaryFlags() {
  return Object.fromEntries(BLOCKED_AUTHORITY.map((flag) => [flag, false]));
}

const jurisdictionProfiles = [
  {
    jurisdiction: "Netherlands",
    jurisdiction_id: "netherlands",
    governance_boundary:
      "Dutch VO/vwo sources remain the baseline. Dutch closure is internal/report-only under CLOSE_INTERNAL_SYSTEM and does not authorize school-pack or compliance use.",
    sources: [
      {
        authority: "Inspectie van het Onderwijs",
        title: "Onderzoekskader 2021 voor het toezicht op het voortgezet onderwijs, versie 2025",
        url: "https://www.onderwijsinspectie.nl/documenten/2021/07/01/onderzoekskader-2021-voortgezet-onderwijs",
        source_type: "inspection framework",
        role: "inspection/accountability",
        scope: "national",
        publication_or_version_date: "2025-07-14, version applicable from 2025-08-01",
        access_date: ACCESS_DATE,
        authority_strength: "official inspectorate framework",
        allowed_use: "Baseline Dutch inspection-relevant evidence categories and school-owned evidence boundary.",
        forbidden_inference: "Does not prove 4veco is inspection-ready, approved, compliant, or sufficient for a school inspection.",
      },
      {
        authority: "College voor Toetsen en Examens",
        title: "Syllabus economie vwo 2026",
        url: "https://www.examenblad.nl/2026/vwo/documenten/syllabus-economie-vwo-2026",
        source_type: "central examination syllabus",
        role: "curriculum/examination",
        scope: "national",
        publication_or_version_date: "2024, version 2 for examination year 2026",
        access_date: ACCESS_DATE,
        authority_strength: "official national examination authority",
        allowed_use: "Dutch baseline for upper-secondary economics concepts and examination alignment.",
        forbidden_inference: "Does not define non-Dutch economics curricula or any country overlay outside the Netherlands.",
      },
    ],
  },
  {
    jurisdiction: "Belgium / Flanders",
    jurisdiction_id: "belgium_flanders",
    governance_boundary:
      "Use Flanders only. Do not generalize Flemish inspection or curriculum structures to the French or German-speaking Communities of Belgium.",
    sources: [
      {
        authority: "Onderwijsinspectie / Onderwijs Vlaanderen",
        title: "Referentiekader voor onderwijskwaliteit (het OK)",
        url: "https://www.vlaanderen.be/onderwijsprofessionals/organisatie-en-administratie/onderwijskwaliteit-en-toezicht/kwaliteitsvol-onderwijs-aanbieden/referentiekaders-voor-onderwijskwaliteit/referentiekader-voor-onderwijskwaliteit-het-ok",
        source_type: "education quality reference framework",
        role: "inspection/quality development",
        scope: "subnational: Flemish Community",
        publication_or_version_date: "live official page; no distinct version date exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official Flemish education quality framework",
        allowed_use: "Flemish quality categories for results, learner development, quality development, and policy.",
        forbidden_inference: "Does not represent all Belgian communities and does not authorize school/public distribution.",
      },
      {
        authority: "Onderwijsdoelen.be / Vlaamse overheid",
        title: "Secundair onderwijs - 3de graad - Onderwijsdoelen",
        url: "https://onderwijsdoelen.be/modernisatie-so?onderwijsstructuur=SO_3DE_GRAAD",
        source_type: "curriculum goals portal",
        role: "curriculum",
        scope: "subnational: Flemish Community",
        publication_or_version_date: "live official curriculum portal; version date not exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official Flemish curriculum-goals portal",
        allowed_use: "Identify whether economics/financial-economic goals require Flemish local overlay mapping.",
        forbidden_inference: "Does not prove a textbook satisfies school-level Flemish quality evidence or all Belgian requirements.",
      },
    ],
  },
  {
    jurisdiction: "England",
    jurisdiction_id: "england",
    governance_boundary:
      "England is not the whole United Kingdom. Ofsted and DfE sources must be labelled England-only unless the source explicitly says otherwise.",
    sources: [
      {
        authority: "Ofsted",
        title: "Education inspection framework: for use from November 2025",
        url: "https://www.gov.uk/government/publications/education-inspection-framework-eif/education-inspection-framework-for-use-from-november-2025",
        source_type: "inspection framework",
        role: "inspection/accountability",
        scope: "England",
        publication_or_version_date: "2025-09-09 update; use from 2025-11",
        access_date: ACCESS_DATE,
        authority_strength: "official inspectorate framework for England",
        allowed_use: "Compare curriculum, teaching, support, inclusion, leadership, and safeguarding/accountability boundaries.",
        forbidden_inference: "Does not represent Scotland, Wales, or Northern Ireland and does not approve 4veco materials.",
      },
      {
        authority: "Department for Education",
        title: "GCE AS and A level subject content for economics",
        url: "https://www.gov.uk/government/publications/gce-as-and-a-level-for-economics",
        source_type: "qualification subject content",
        role: "curriculum/qualification",
        scope: "England",
        publication_or_version_date: "2014-04-09",
        access_date: ACCESS_DATE,
        authority_strength: "official national department subject-content requirement",
        allowed_use: "Compare A level economics content and assessment-objective expectations against the common core.",
        forbidden_inference: "Does not make a 4veco book an approved A level specification or exam resource.",
      },
      {
        authority: "Ofsted",
        title: "School inspection operating guide for inspectors: for use from November 2025",
        url: "https://www.gov.uk/government/publications/school-inspection-toolkit-operating-guide-and-information/school-inspection-operating-guide-for-inspectors-for-use-from-november-2025",
        source_type: "inspection operating guide",
        role: "inspection evidence gathering",
        scope: "England",
        publication_or_version_date: "2025, for use from 2025-11-10",
        access_date: ACCESS_DATE,
        authority_strength: "official inspectorate operating guide",
        allowed_use: "Identify school-owned inspection evidence and case-sampling boundaries.",
        forbidden_inference: "Does not authorize a textbook to supply school inspection evidence by itself.",
      },
    ],
  },
  {
    jurisdiction: "Germany",
    jurisdiction_id: "germany",
    governance_boundary:
      "Use a KMK/federal-context layer plus representative Land examples. Do not claim a single national economics curriculum or inspection regime.",
    sources: [
      {
        authority: "Kultusministerkonferenz",
        title: "Einheitliche Pruefungsanforderungen in der Abiturpruefung Wirtschaft",
        url: "https://www.kmk.org/fileadmin/Dateien/veroeffentlichungen_beschluesse/1989/1989_12_01-EPA-Wirtschaft.pdf",
        source_type: "Abitur examination requirements",
        role: "examination framework",
        scope: "federal coordination",
        publication_or_version_date: "1989-12-01, amended 2006-11-16",
        access_date: ACCESS_DATE,
        authority_strength: "official KMK coordination document",
        allowed_use: "Federal-context examination expectations for economics/business economics.",
        forbidden_inference: "Does not replace Land curricula or local school implementation evidence.",
      },
      {
        authority: "Kultusministerkonferenz",
        title: "Allgemeine Bildung - KMK document list",
        url: "https://www.kmk.org/downloads-dokumente/beschluesse-und-veroeffentlichungen/bildung-/-schule/allgemeine-bildung.html",
        source_type: "official source index",
        role: "federal context/source provenance",
        scope: "federal coordination",
        publication_or_version_date: "live official KMK index; includes 2021 EPA Wirtschaft examples",
        access_date: ACCESS_DATE,
        authority_strength: "official KMK source index",
        allowed_use: "Trace current official EPA Wirtschaft source family and later updates/examples.",
        forbidden_inference: "Does not create a single national German textbook compliance claim.",
      },
      {
        authority: "Bayerisches Staatsministerium fuer Unterricht und Kultus / LehrplanPLUS",
        title: "Gymnasium Wirtschaft und Recht 12, erhoehtes Anforderungsniveau",
        url: "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/12/wirtschaft-und-recht/erhoeht",
        source_type: "Land curriculum",
        role: "curriculum",
        scope: "subnational: Bavaria",
        publication_or_version_date: "live LehrplanPLUS page; version date not exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official Land curriculum portal",
        allowed_use: "Representative Land overlay example for upper-secondary economics/business/legal content.",
        forbidden_inference: "Does not represent all German Laender.",
      },
    ],
  },
  {
    jurisdiction: "France",
    jurisdiction_id: "france",
    governance_boundary:
      "Use national lycee/baccalaureat SES sources. Distinguish programme content from baccalaureat examination restrictions.",
    sources: [
      {
        authority: "Ministere de l'Education nationale / Eduscol",
        title: "Programmes et ressources en sciences economiques et sociales - voie GT",
        url: "https://eduscol.education.fr/5838/programmes-et-ressources-en-sciences-economiques-et-sociales-voie-gt",
        source_type: "curriculum resource portal",
        role: "curriculum/support",
        scope: "national",
        publication_or_version_date: "live official page, updated 2026-02 in retrieved result",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry curriculum portal",
        allowed_use: "Identify national SES programme and resource structure.",
        forbidden_inference: "Does not prove 4veco alignment to French assessment or school implementation.",
      },
      {
        authority: "Ministere de l'Education nationale / Eduscol",
        title: "Programme de sciences economiques et sociales de terminale generale",
        url: "https://eduscol.education.fr/sites/default/files/document/spe253annexe1158821pdf-82755.pdf",
        source_type: "programme PDF",
        role: "curriculum",
        scope: "national",
        publication_or_version_date: "2019 programme source as retrieved from official Eduscol",
        access_date: ACCESS_DATE,
        authority_strength: "official national programme",
        allowed_use: "Map terminale SES economics content and reasoning requirements.",
        forbidden_inference: "Does not authorize exam-readiness or French-compliant edition claims.",
      },
      {
        authority: "Ministere de l'Education nationale",
        title: "BO 2024 note defining SES terminale questions evaluable from session 2025",
        url: "https://www.education.gouv.fr/bo/2024/Hebdo35/MENE2416667N",
        source_type: "official bulletin/exam note",
        role: "examination",
        scope: "national",
        publication_or_version_date: "2024-09-17 note, BO 2024-09-19",
        access_date: ACCESS_DATE,
        authority_strength: "official examination rule note",
        allowed_use: "Record that examination scope can be narrower than the full programme.",
        forbidden_inference: "Does not prove local baccalaureat preparation or compliance.",
      },
    ],
  },
  {
    jurisdiction: "Italy",
    jurisdiction_id: "italy",
    governance_boundary:
      "Treat Italy as a national ministry curriculum/SNV context with track-specific economics availability, not as a single generic economics course for every upper-secondary route.",
    sources: [
      {
        authority: "Ministero dell'Istruzione e del Merito",
        title: "Nuove Indicazioni nazionali per i Licei",
        url: "https://www.mim.gov.it/-/pubblicato-il-testo-delle-nuove-indicazioni-nazionali-per-i-licei-",
        source_type: "curriculum update notice",
        role: "curriculum",
        scope: "national",
        publication_or_version_date: "2026-04 live official notice in retrieved result",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry notice",
        allowed_use: "Flag current curriculum-review context for lyceum overlays.",
        forbidden_inference: "Does not prove current final textbook compliance or route-specific readiness.",
      },
      {
        authority: "Ministero dell'Istruzione e del Merito",
        title: "Indicazioni nazionali per i licei",
        url: "https://www.istruzione.it/alternanza/allegati/NORMATIVA%20ASL/INDICAZIONI%20NAZIONALI%20PER%20I%20LICEI.pdf",
        source_type: "national curriculum indications",
        role: "curriculum",
        scope: "national",
        publication_or_version_date: "2010 national indications source",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry curriculum source",
        allowed_use: "Baseline for economics/legal-social lyceum overlay analysis where applicable.",
        forbidden_inference: "Does not cover every upper-secondary technical/professional route or school-level implementation.",
      },
      {
        authority: "Ministero dell'Istruzione e del Merito",
        title: "Sistema nazionale di valutazione",
        url: "https://www.mim.gov.it/sistema-nazionale-di-valutazione",
        source_type: "national evaluation system",
        role: "accountability/quality assurance",
        scope: "national",
        publication_or_version_date: "live official page; version date not exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry SNV page",
        allowed_use: "Quality-assurance and school self-evaluation/accountability context.",
        forbidden_inference: "Does not convert product evidence into school evaluation evidence.",
      },
    ],
  },
  {
    jurisdiction: "Spain",
    jurisdiction_id: "spain",
    governance_boundary:
      "Use national minimum-teaching rules plus autonomous-community overlays. Do not treat national minimum curriculum as a full regional implementation.",
    sources: [
      {
        authority: "Boletin Oficial del Estado",
        title: "Real Decreto 243/2022, ordenacion y ensenanzas minimas del Bachillerato",
        url: "https://www.boe.es/buscar/act.php?id=BOE-A-2022-5521",
        source_type: "royal decree",
        role: "curriculum/minimum teaching",
        scope: "national minimums",
        publication_or_version_date: "2022-04-05, consolidated official text as accessed",
        access_date: ACCESS_DATE,
        authority_strength: "official national legal source",
        allowed_use: "National bachillerato minimum-curriculum and competence framework.",
        forbidden_inference: "Does not replace autonomous-community curriculum or school implementation evidence.",
      },
      {
        authority: "Educagob / Ministerio de Educacion",
        title: "Bachillerato Economia curriculum",
        url: "https://educagob.educacionfpydeportes.gob.es/curriculo/curriculo-lomloe/menu-curriculos-basicos/bachillerato/materias/economia/desarrollo.html",
        source_type: "official curriculum portal",
        role: "curriculum",
        scope: "national minimums",
        publication_or_version_date: "live official LOMLOE curriculum portal; version date not exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry curriculum portal",
        allowed_use: "Economia bachillerato concepts, competences, evaluation criteria, and basic knowledge.",
        forbidden_inference: "Does not prove compatibility with a specific autonomous-community overlay.",
      },
      {
        authority: "Educagob / Ministerio de Educacion",
        title: "Curriculo de Bachillerato en las Comunidades Autonomas",
        url: "https://educagob.educacionfpydeportes.gob.es/curriculo/curriculo-lomloe/menu-curriculos-basicos/bachillerato/curriculo-comunidades-autonomas.html",
        source_type: "regional curriculum index",
        role: "regional overlay routing",
        scope: "subnational routing",
        publication_or_version_date: "live official index; version date not exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry routing source",
        allowed_use: "Record that autonomous-community overlays are required.",
        forbidden_inference: "Does not itself satisfy any regional curriculum.",
      },
    ],
  },
  {
    jurisdiction: "Poland",
    jurisdiction_id: "poland",
    governance_boundary:
      "Use MEN curriculum/supervision context plus CKE examination source. Business and management is the nearest upper-secondary economics-facing subject.",
    sources: [
      {
        authority: "Ministerstwo Edukacji Narodowej",
        title: "Biznes i zarzadzanie - nowy przedmiot w szkolach ponadpodstawowych",
        url: "https://www.gov.pl/web/edukacja/biznes-i-zarzadzanie--nowy-przedmiot-w-szkolach-ponadpodstawowych-od-1-wrzesnia-2023-r",
        source_type: "curriculum-policy notice",
        role: "curriculum",
        scope: "national",
        publication_or_version_date: "2022-09-14, implemented from 2023-09-01",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry policy source",
        allowed_use: "Identify BiZ as the Polish upper-secondary economics/business-adjacent overlay route.",
        forbidden_inference: "Does not prove matura alignment or school implementation evidence.",
      },
      {
        authority: "Centralna Komisja Egzaminacyjna",
        title: "Informator o egzaminie maturalnym z biznesu i zarzadzania od roku szkolnego 2026/2027",
        url: "https://bip.cke.gov.pl/artykul/211/1659/egzamin-maturalny-w-formule-2023",
        source_type: "matura examination information",
        role: "examination",
        scope: "national",
        publication_or_version_date: "2025-08-29 attachment metadata in retrieved result",
        access_date: ACCESS_DATE,
        authority_strength: "official national examination commission source",
        allowed_use: "Map examination form, sample task style, and matura-specific requirements.",
        forbidden_inference: "Does not make 4veco a matura-preparation product or Polish-compliant edition.",
      },
      {
        authority: "Ministerstwo Edukacji Narodowej",
        title: "Nadzor pedagogiczny",
        url: "https://www.gov.pl/web/edukacja/nadzor-pedagogiczny3",
        source_type: "pedagogical supervision portal",
        role: "accountability/inspection",
        scope: "national with regional kurator implementation",
        publication_or_version_date: "live page; includes 2025 supervision documents in retrieved result",
        access_date: ACCESS_DATE,
        authority_strength: "official ministry supervision source",
        allowed_use: "Represent school-owned supervision/accountability context.",
        forbidden_inference: "Does not convert textbook evidence into school supervision proof.",
      },
    ],
  },
  {
    jurisdiction: "United States",
    jurisdiction_id: "united_states",
    governance_boundary:
      "Use federal context plus representative state/accreditation examples. Do not invent a national inspection regime or national economics curriculum.",
    sources: [
      {
        authority: "U.S. Department of Education",
        title: "Federal Role in Education",
        url: "https://www.ed.gov/about/ed-overview/federal-role-in-education",
        source_type: "federal role explainer",
        role: "federal context",
        scope: "federal",
        publication_or_version_date: "live official page; version date not exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official federal department source",
        allowed_use: "Set boundary that education governance is distributed and state/local authority matters.",
        forbidden_inference: "Does not create federal textbook approval or national inspection authority.",
      },
      {
        authority: "U.S. Department of Education",
        title: "Standards and Assessments",
        url: "https://www.ed.gov/laws-and-policy/laws-preschool-grade-12-education/esea/standards-and-assessments",
        source_type: "federal standards/accountability policy",
        role: "accountability/support for state standards",
        scope: "federal",
        publication_or_version_date: "live official page; version date not exposed in retrieved text",
        access_date: ACCESS_DATE,
        authority_strength: "official federal department source",
        allowed_use: "Federal ESEA/ESSA context for state standards and assessments.",
        forbidden_inference: "Does not supply a single national curriculum or state-compliance claim.",
      },
      {
        authority: "California Department of Education",
        title: "History-Social Science Standards: Principles of Economics, Grade 12",
        url: "https://www2.cde.ca.gov/cacs/history?c0=13",
        source_type: "state academic standards",
        role: "curriculum",
        scope: "subnational: California",
        publication_or_version_date: "standards page live as accessed; framework adopted 2016-07-14",
        access_date: ACCESS_DATE,
        authority_strength: "official state education department source",
        allowed_use: "Representative state economics standards overlay.",
        forbidden_inference: "Does not represent all states or any accreditation/inspection approval.",
      },
      {
        authority: "New York State Education Department",
        title: "New York State Grades 9-12 Social Studies Framework",
        url: "https://www.nysed.gov/sites/default/files/programs/standards-instruction/framework-9-12-with-2017-updates.pdf",
        source_type: "state social-studies framework",
        role: "curriculum",
        scope: "subnational: New York",
        publication_or_version_date: "2017 updates; official current PDF as accessed",
        access_date: ACCESS_DATE,
        authority_strength: "official state education department source",
        allowed_use: "Representative state Grade 12 economics/finance overlay.",
        forbidden_inference: "Does not represent all states or a national inspection regime.",
      },
    ],
  },
];

const commonCoreCategories = [
  {
    id: "curriculum_coherence",
    label: "Curriculum coherence",
    classification: "near_universal_common_core",
    common_core_claim:
      "A shared textbook can expose coherent sequencing, chapter goals, prerequisite progression, and links from concepts to exercises.",
    overlay_need:
      "Jurisdiction overlays must map local subject names, programme goals, standards codes, and mandatory sequence expectations.",
    school_owned_boundary:
      "Schools still own enacted curriculum, timetable choices, local schemes of work, and inspection conversations.",
  },
  {
    id: "subject_knowledge_and_progression",
    label: "Subject knowledge and progression",
    classification: "near_universal_common_core",
    common_core_claim:
      "Scarcity, choice, opportunity cost, markets, demand/supply reasoning, data interpretation, and economic argumentation recur across the reviewed sources.",
    overlay_need:
      "Local overlays must add jurisdiction-specific vocabulary, examination taxonomies, and prescribed examples.",
    school_owned_boundary:
      "Textbook evidence does not prove student mastery or teacher diagnosis.",
  },
  {
    id: "didactic_quality",
    label: "Didactic quality",
    classification: "widely_shared_but_locally_interpreted",
    common_core_claim:
      "Worked examples, guided practice, independent practice, retrieval, feedback prompts, and misconception handling are portable product-design patterns.",
    overlay_need:
      "Inspectorate language and classroom evidence expectations vary strongly by jurisdiction.",
    school_owned_boundary:
      "Observed teaching quality, lesson adaptation, and classroom climate are school-owned.",
  },
  {
    id: "assessment_alignment",
    label: "Assessment alignment",
    classification: "widely_shared_but_locally_interpreted",
    common_core_claim:
      "A shared bank can support formative checks, calculation/graph/source tasks, and argument construction.",
    overlay_need:
      "Exam-code mapping, mark schemes, assessment objectives, task forms, grading language, and national/state exam structures are local.",
    school_owned_boundary:
      "Summative validity, PTA/school assessment policy, and exam-board approval cannot be supplied by the textbook alone.",
  },
  {
    id: "student_support_and_differentiation",
    label: "Student support and differentiation",
    classification: "widely_shared_but_locally_interpreted",
    common_core_claim:
      "Scaffolding, hints, alternative representations, and difficulty layering can be designed into the shared product.",
    overlay_need:
      "Local SEN/SEND/inclusion/accommodation language and required documentation differ.",
    school_owned_boundary:
      "Individual support plans, intervention records, accommodations, and learner monitoring remain school-owned.",
  },
  {
    id: "accessibility_and_inclusion",
    label: "Accessibility and inclusion",
    classification: "widely_shared_but_locally_interpreted",
    common_core_claim:
      "Semantic structure, readable layouts, text alternatives, keyboard support, contrast, and inclusive examples can be common product requirements.",
    overlay_need:
      "Legal standards, terminology, and proof expectations differ by country/state.",
    school_owned_boundary:
      "Accessibility certification, legal compliance, and individual accommodation evidence remain outside this foundation.",
  },
  {
    id: "quality_assurance",
    label: "Quality assurance",
    classification: "near_universal_common_core",
    common_core_claim:
      "Source traceability, review records, validator checks, correction logs, and versioned evidence are portable product-quality controls.",
    overlay_need:
      "Each jurisdiction needs source freshness and authority-strength metadata.",
    school_owned_boundary:
      "School self-evaluation, governance, and official external review remain local/school-owned.",
  },
  {
    id: "improvement_cycle",
    label: "Improvement cycle",
    classification: "near_universal_common_core",
    common_core_claim:
      "Finding classification, owner next action, proof required to close, and review-after-correction are portable.",
    overlay_need:
      "Local accountability cycles and inspection timelines vary.",
    school_owned_boundary:
      "School improvement planning and accountable implementation are not textbook outputs.",
  },
  {
    id: "safeguarding_product_school_boundaries",
    label: "Safeguarding/product-school boundaries",
    classification: "school_owned_or_not_textbook_owned",
    common_core_claim:
      "The shared product can keep forbidden claims visible and avoid converting product evidence into school evidence.",
    overlay_need:
      "Safeguarding, privacy, and accountability vocabulary must be jurisdiction-specific.",
    school_owned_boundary:
      "Safeguarding practice, student data, school policy, and competent-authority judgement remain outside the textbook.",
  },
];

const differencesMatrix = [
  {
    id: "inspection_vs_accreditation",
    divergence: "Inspection versus accreditation",
    finding:
      "The Netherlands, Flanders, England, Italy, Poland, and parts of Spain use official inspection/supervision or national quality frameworks; the United States relies on federal/state accountability plus state/local standards and optional accreditation, not a national inspection regime.",
    architecture_response: "Keep school accountability evidence outside the shared textbook and route it to Layer 4.",
  },
  {
    id: "national_vs_regional",
    divergence: "National versus regional/state governance",
    finding:
      "Flanders is subnational, Germany and the United States require federal/context plus state/Land examples, and Spain requires autonomous-community overlays beyond national minimums.",
    architecture_response: "Require exact jurisdiction overlay descriptors and forbid generalized country claims where governance is subnational.",
  },
  {
    id: "prescribed_curriculum_vs_outcomes",
    divergence: "Prescribed curriculum versus outcome frameworks",
    finding:
      "Some systems specify detailed programmes or examination content; others combine broad standards, competences, local curriculum design, and school-owned implementation.",
    architecture_response: "Layer 1 stores portable pedagogy; Layer 2 stores local curriculum mapping.",
  },
  {
    id: "central_exams_vs_local_assessment",
    divergence: "Central examinations versus local assessment",
    finding:
      "The Netherlands, France, Poland, and England use nationally regulated qualification or central-exam structures; US state examples and local districts vary; school assessment remains local in all cases.",
    architecture_response: "Layer 3 stores exam/assessment overlays and never claims summative validity from textbook tasks alone.",
  },
  {
    id: "school_accountability",
    divergence: "School accountability requirements",
    finding:
      "Quality frameworks ask for enacted curriculum, teaching, support, safety, results, improvement, and leadership evidence that a textbook can support but not supply.",
    architecture_response: "Layer 4 is school-owned and remains blocked for product claims.",
  },
  {
    id: "basic_skills_citizenship",
    divergence: "Basic-skills/citizenship requirements",
    finding:
      "Economic literacy often connects to civic, financial, enterprise, and data-literacy aims, but labels and obligations differ.",
    architecture_response: "Common core may include financial/economic reasoning; local overlays map citizenship/basic-skills labels.",
  },
  {
    id: "accessibility_inclusion_expectations",
    divergence: "Accessibility and inclusion expectations",
    finding:
      "Accessibility and inclusion are widely shared goals, but legal language, proof, and accommodations are local.",
    architecture_response: "Common product accessibility standards are allowed; compliance claims remain blocked.",
  },
  {
    id: "evidence_documentation",
    divergence: "Evidence and documentation expectations",
    finding:
      "Every reviewed governance system values evidence, but the form ranges from inspection evidence to exam specifications, school self-evaluation, and state standards documentation.",
    architecture_response: "All reports must preserve authority strength, allowed use, forbidden inference, and proof required to close.",
  },
];

const overlayArchitecture = [
  {
    layer: 1,
    name: "International pedagogical/product common core",
    can_reside_in_shared_textbook: [
      "Economic reasoning sequence",
      "Concept explanations",
      "Graphs/tables/source reasoning",
      "Worked examples",
      "Practice tasks",
      "Misconception checks",
      "Semantic structure, readable layouts, text alternatives, keyboard/focus support, contrast, inclusive examples, and common support features",
      "Internal product-quality evidence",
    ],
    requires_local_overlay: [
      "Local terminology notes",
      "Jurisdiction-specific examples where institutions differ",
    ],
    blocked_claims: ["country compliance", "official approval", "inspection readiness"],
  },
  {
    layer: 2,
    name: "National or regional curriculum overlay",
    can_reside_in_shared_textbook: ["Optional crosswalk tables and local vocabulary sidebars"],
    requires_local_overlay: [
      "Official source mapping",
      "Subject names",
      "Programme goal codes",
      "State/Land/community/regional curriculum differences",
    ],
    blocked_claims: ["one-size-fits-all country fit", "all Belgium from Flanders", "whole UK from England", "single German or US curriculum"],
  },
  {
    layer: 3,
    name: "Examination and assessment overlay",
    can_reside_in_shared_textbook: ["Generic formative checks and reusable task families"],
    requires_local_overlay: [
      "Exam-board or central-exam task forms",
      "Assessment objectives",
      "Marking conventions",
      "Allowed calculators/materials",
      "Local grading vocabulary",
    ],
    blocked_claims: ["summative validity", "PTA validity", "exam-board approval"],
  },
  {
    layer: 4,
    name: "School-owned implementation/evidence layer",
    can_reside_in_shared_textbook: ["Evidence prompts and safe-use notes only"],
    requires_local_overlay: [
      "Classroom implementation evidence",
      "Learner support/accommodation records",
      "School quality assurance",
      "Safeguarding/privacy procedures",
      "Inspection/accreditation conversations",
    ],
    blocked_claims: ["school implementation proof", "inspection proof", "legal compliance"],
  },
];

const portabilityPilot = [
  {
    scope: "Book 1 Chapter 1.2",
    direct_transfer: [
      "Scarcity, choice, opportunity cost, incentives, and basic market reasoning can transfer as core economic concepts.",
      "Graph/table/source interpretation and stepwise reasoning are portable learning designs.",
    ],
    terminology_changes: [
      "Local subject names and examination vocabulary must be overlaid.",
      "Currency, institutions, and policy examples need localization.",
    ],
    exam_code_remapping: [
      "Dutch CvTE domain codes cannot be reused outside the Netherlands.",
      "England A level, France SES, Spain Bachillerato, Poland BiZ/matura, Germany Land/KMK, and US state standards need separate mapping.",
    ],
    different_examples_or_institutions: [
      "Tax, welfare, central-bank, labour-market, EU/national/federal, and business-law examples often require local substitution.",
    ],
    local_assessment_forms: [
      "Question formats, mark schemes, essays/data-response expectations, rubrics, and permitted materials need local overlays.",
    ],
    cannot_be_supplied_by_textbook: [
      "School implementation evidence",
      "Student results or accommodations",
      "Inspection/accreditation judgement",
      "Summative validity",
    ],
  },
  {
    scope: "Book 1 Chapter 1.3",
    direct_transfer: [
      "Demand, supply, equilibrium, shifts versus movement along a curve, and diagram reasoning are broadly portable.",
      "Route-local proof records and answer/model separation are useful product-quality patterns.",
    ],
    terminology_changes: [
      "Demand/supply labels, graph conventions, and local example language need overlay review.",
      "Country-specific market institutions and policy contexts need local substitution.",
    ],
    exam_code_remapping: [
      "Do not reuse Dutch target or diagnostic status as international exam readiness.",
      "Each jurisdiction needs a separate mapping from tasks to official curriculum/exam source.",
    ],
    different_examples_or_institutions: [
      "Agricultural, housing, labour, energy, and public-policy examples may need national or regional replacement.",
    ],
    local_assessment_forms: [
      "Essay, short-answer, data-response, multiple-choice, and graph-task conventions vary.",
    ],
    cannot_be_supplied_by_textbook: [
      "School-owned differentiation/support evidence",
      "Accessibility compliance proof",
      "Inspection/accreditation proof",
      "Student/product-use authority",
    ],
  },
];

function commonFields(reportId, status) {
  return {
    schema_version: 1,
    report_id: reportId,
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    status,
    internal_only: true,
    manual_invocation_only: true,
    human_review_required: true,
    final_decision: SELECTED_DECISION,
    decision_options: DECISION_OPTIONS,
    product_end_state: "../4veco-lessen/specifications/product-end-state.md",
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    dutch_closure_basis: "PR #124 accepted and merged; GOAL-DQS-CLOSURE-1A final decision CLOSE_INTERNAL_SYSTEM",
    non_negotiable_requirements: REVIEW_PACKET_REQUIREMENTS,
    core_requirement_checklist: CORE_REQUIREMENTS.map(([id, requirement]) => ({
      id,
      requirement,
      status: "met_for_foundation",
      proof_required_to_close: "Validator PASS, specialist review, final lead PASS, and human acceptance.",
    })),
    output_boundary: boundaryFlags(),
    output_files_written: OUTPUT_PATHS,
  };
}

function buildAuthorityProfiles() {
  return {
    schema_version: 1,
    report_id: "international-authority-profiles",
    sprint_id: SPRINT_ID,
    generated_date: ACCESS_DATE,
    status: "official_source_refresh_complete",
    access_date: ACCESS_DATE,
    product_end_state: "../4veco-lessen/specifications/product-end-state.md",
    original_sprint_gate_spec: ORIGINAL_SPRINT_GATE_SPEC,
    non_negotiable_requirements: [
      ...REVIEW_PACKET_REQUIREMENTS,
      "Use official inspectorate, ministry, curriculum, examination, accountability, or state education sources wherever possible.",
      "Represent Belgium as Flanders-only, England as England-only, Germany as KMK plus Land examples, and the United States as federal context plus state examples.",
      "Record authority strength, allowed use, and forbidden inference for every source.",
      "Do not infer compliance, approval, country edition readiness, or school implementation evidence.",
    ],
    core_requirement_checklist: CORE_REQUIREMENTS.map(([id, requirement]) => ({
      id,
      requirement,
      status: "met_for_foundation",
      proof_required_to_close: "Country/source reviewer verification and currentness checker PASS.",
    })),
    jurisdictions: jurisdictionProfiles,
    finding_classification: [
      {
        finding: "All requested jurisdictions have official-source anchors.",
        classification: "core_requirement_met",
        blocks: "Nothing for foundation analysis.",
        does_not_block: "Later local overlay source refresh before implementation.",
        proof_required_to_close: "Country/source reviewer verification and currentness checker PASS.",
      },
      {
        finding: "Several governance systems are subnational or regionally implemented.",
        classification: "minor_carry_flag",
        blocks: "Generalized national compliance claims.",
        does_not_block: "Common-core and overlay foundation decision.",
        proof_required_to_close: "Explicit overlay descriptors for Flanders, England, Germany, Spain, and United States.",
      },
    ],
  };
}

function buildCommonCore() {
  return {
    ...commonFields("international-common-core", "common_core_matrix_complete"),
    jurisdictions: jurisdictionProfiles.map((profile) => profile.jurisdiction),
    common_core_categories: commonCoreCategories,
    differences_matrix: differencesMatrix,
    overlay_architecture: overlayArchitecture,
    portability_pilot: portabilityPilot,
    selected_decision: SELECTED_DECISION,
    rejected_decisions: DECISION_OPTIONS.filter((option) => option !== SELECTED_DECISION),
    decision_rationale: [
      "A shared upper-secondary economics product core is plausible across the reviewed sources for foundational reasoning, market diagrams, data/source use, scaffolding, and product-quality evidence.",
      "Jurisdiction overlays are required for curriculum labels, official source mapping, exam forms, regional/state/Land/community governance, local institutions, accessibility/legal terminology, and school-owned evidence.",
      "The foundation is analytic only and does not authorize a country-compliant edition, public claim, school pack, product route, student use, or personal-data processing.",
    ],
    non_negotiable_requirements: [
      "Return one of the three authorised decisions.",
      "No country-compliance, inspectorate-approval, public, school-facing, student-use, or product-route claim is authorised.",
      "All jurisdictions must preserve source authority and governance boundaries.",
      "Book portability is a bounded Chapters 1.2/1.3 internal check only.",
    ],
  };
}

function buildCommonalitiesReport(authorityProfiles, commonCore) {
  return {
    ...commonFields("international-commonalities-and-differences", "complete_internal_analysis"),
    authority_profile_source: "references/data/inspection-standards/international-authority-profiles.v0.json",
    common_core_source: "references/data/inspection-standards/international-common-core.v0.json",
    jurisdiction_count: authorityProfiles.jurisdictions.length,
    source_count: authorityProfiles.jurisdictions.reduce((sum, profile) => sum + profile.sources.length, 0),
    common_core_categories: commonCore.common_core_categories,
    differences_matrix: commonCore.differences_matrix,
    finding_classification: [
      {
        finding: "International common core is product-pedagogical, not jurisdiction-compliance.",
        classification: "core_requirement_met",
        blocks: "Country-compliance or approval claims.",
        does_not_block: "Proceeding with common core and overlays as an internal analytical architecture.",
        proof_required_to_close: "Keep overlays explicit and all blocked authority flags false.",
      },
      {
        finding: "Regional/state governance is material.",
        classification: "minor_carry_flag",
        blocks: "All-Belgium, whole-UK, single-Germany, or national-US claims.",
        does_not_block: "Representative overlay foundation.",
        proof_required_to_close: "Separate jurisdiction-specific source refresh before any local edition work.",
      },
    ],
  };
}

function buildPortabilityReport(commonCore) {
  return {
    ...commonFields("international-book-portability-pilot", "bounded_portability_pilot_complete"),
    pilot_scope: "Book 1 Chapters 1.2 and 1.3",
    scope_boundary:
      "Internal analytical portability check only; no country-compliant edition, public output, teacher/school-facing output, product-route adoption, diagnostics/mastery/PV, student/product-use, or personal-data processing.",
    portability_pilot: commonCore.portability_pilot,
    architecture_fit: overlayArchitecture,
    finding_classification: [
      {
        finding: "Chapters 1.2 and 1.3 contain a strong transferable economics core.",
        classification: "core_requirement_met",
        blocks: "Nothing for foundation decision.",
        does_not_block: "Proceeding with shared common core plus overlays.",
        proof_required_to_close: "Local curriculum/exam remapping before any country edition.",
      },
      {
        finding: "Exam-code and institution examples require local overlays.",
        classification: "minor_carry_flag",
        blocks: "Direct publication as an international edition.",
        does_not_block: "Internal architecture foundation.",
        proof_required_to_close: "Jurisdiction-specific overlay mapping and teacher/economics review.",
      },
      {
        finding: "School-owned implementation evidence cannot be supplied by the textbook.",
        classification: "scale_blocker",
        blocks: "Inspection/accreditation/compliance claims.",
        does_not_block: "Internal product portability analysis.",
        proof_required_to_close: "Separate school-owned evidence route if ever authorised.",
      },
    ],
  };
}

function buildDecisionReport(authorityProfiles, commonCore, commonalities, portability) {
  return {
    ...commonFields("international-foundation-decision", "human_review_pending"),
    final_foundation_decision: {
      selected: SELECTED_DECISION,
      allowed_options: DECISION_OPTIONS,
      rejected_options: DECISION_OPTIONS.filter((option) => option !== SELECTED_DECISION),
      decision_selection_count: 1,
      meaning:
        "Proceed with a shared international economics product common core only if every country implementation uses bounded jurisdiction overlays and preserves school-owned evidence boundaries.",
      basis: [
        commonalities.report_id,
        portability.report_id,
        authorityProfiles.report_id,
        commonCore.report_id,
      ],
    },
    authorizes: [
      "Manual internal international evidence-support analysis.",
      "Future planning for common-core and jurisdiction-overlay descriptors.",
      "Internal review of source profiles, differences matrix, architecture, and bounded portability check.",
    ],
    still_blocked: BLOCKED_AUTHORITY,
    owner_next_action:
      "Human review may accept, revise, or reject the GOAL-IQS-FOUNDATION-1 foundation. Acceptance authorizes only internal architecture follow-up, not country edition work or external claims.",
    finding_classification: [
      {
        finding: "The common-core and overlay architecture is feasible enough for a next internal architecture step.",
        classification: "core_requirement_met",
        blocks: "Nothing if human accepts the bounded decision.",
        does_not_block: "Internal architecture follow-up.",
        proof_required_to_close: "Specialist reviews MORE_THAN_SATISFIED where required, final lead PASS, fresh green PR, and human acceptance.",
      },
      {
        finding: "Country-compliance and approval claims remain blocked.",
        classification: "scale_blocker",
        blocks: "Public/external claims, school-facing distribution, compliance/approval language, country-compliant editions.",
        does_not_block: "Internal common-core and overlay architecture.",
        proof_required_to_close: "Separate source-reviewed local implementation gate for each jurisdiction.",
      },
    ],
  };
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
  lines.push("- Dutch closure basis: PR #124 accepted and merged under `CLOSE_INTERNAL_SYSTEM`.");
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
    lines.push(
      `| \`${escapeCell(item.id)}\`: ${escapeCell(item.requirement)} | \`${escapeCell(item.status)}\` | ${escapeCell(item.proof_required_to_close)} |`
    );
  }
  lines.push("");
}

function renderAuthorityProfilesMarkdown(data) {
  const lines = [
    "# International Authority Profiles",
    "",
    `Status: ${data.status}`,
    `Date: ${data.generated_date}`,
    `Sprint: \`${data.sprint_id}\``,
    "",
  ];
  pushProductSpec(lines, data);
  pushNonNegotiables(lines, data);
  pushCoreChecklist(lines, data);
  lines.push("## Jurisdiction Source Profiles", "");
  for (const profile of data.jurisdictions) {
    lines.push(`### ${profile.jurisdiction}`, "", profile.governance_boundary, "");
    lines.push("| Authority | Source type | Role | Scope | Version/date | Allowed use | Forbidden inference |");
    lines.push("|---|---|---|---|---|---|---|");
    for (const source of profile.sources) {
      lines.push(
        `| [${escapeCell(source.authority)}](${source.url}) | ${escapeCell(source.source_type)} | ${escapeCell(source.role)} | ${escapeCell(source.scope)} | ${escapeCell(source.publication_or_version_date)} | ${escapeCell(source.allowed_use)} | ${escapeCell(source.forbidden_inference)} |`
      );
    }
    lines.push("");
  }
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderCommonCoreModel(data) {
  const lines = [
    "# International Common Core Model",
    "",
    "Status: internal analytical model",
    `Date: ${ACCESS_DATE}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
    "This model is an internal product-pedagogy foundation. It is not a country-compliance, inspectorate-approval, public, teacher/school-facing, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, or inspection-readiness claim.",
    "",
  ];
  pushProductSpec(lines, data);
  pushNonNegotiables(lines, data);
  pushCoreChecklist(lines, data);
  lines.push("## Core Categories", "");
  lines.push("| Category | Classification | Common core | Overlay need | School-owned boundary |");
  lines.push("|---|---|---|---|---|");
  for (const category of data.common_core_categories) {
    lines.push(
      `| ${escapeCell(category.label)} | \`${category.classification}\` | ${escapeCell(category.common_core_claim)} | ${escapeCell(category.overlay_need)} | ${escapeCell(category.school_owned_boundary)} |`
    );
  }
  lines.push("", "## Decision Posture", "", `Selected foundation decision: \`${SELECTED_DECISION}\``);
  lines.push("", list(data.decision_rationale), "");
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderOverlayArchitecture(data) {
  const lines = [
    "# International Overlay Architecture",
    "",
    "Status: internal analytical architecture",
    `Date: ${ACCESS_DATE}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, data);
  pushNonNegotiables(lines, data);
  pushCoreChecklist(lines, data);
  lines.push("## Four Layers", "");
  for (const layer of data.overlay_architecture) {
    lines.push(`### Layer ${layer.layer}: ${layer.name}`, "");
    lines.push("Can reside in one shared textbook:");
    lines.push(list(layer.can_reside_in_shared_textbook), "");
    lines.push("Requires local overlay:");
    lines.push(list(layer.requires_local_overlay), "");
    lines.push("Blocked claims:");
    lines.push(list(layer.blocked_claims), "");
  }
  lines.push("## Governance Boundaries", "");
  lines.push("- Belgium: Flanders-only unless another community is separately sourced.");
  lines.push("- United Kingdom: England-only unless Scotland, Wales, or Northern Ireland are separately sourced.");
  lines.push("- Germany: KMK/federal context plus Land overlays.");
  lines.push("- Spain: national minimum curriculum plus autonomous-community overlays.");
  lines.push("- United States: federal context plus state/accreditation examples, not a national inspection regime.");
  lines.push("");
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderCommonalitiesMarkdown(report) {
  const lines = [
    "# International Commonalities And Differences",
    "",
    `Status: ${report.status}`,
    `Date: ${report.generated_date}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, report);
  pushNonNegotiables(lines, report);
  pushCoreChecklist(lines, report);
  lines.push("## Common-Core Matrix", "");
  lines.push("| Category | Classification | Common core | Overlay need | School-owned boundary |");
  lines.push("|---|---|---|---|---|");
  for (const category of report.common_core_categories) {
    lines.push(
      `| ${escapeCell(category.label)} | \`${category.classification}\` | ${escapeCell(category.common_core_claim)} | ${escapeCell(category.overlay_need)} | ${escapeCell(category.school_owned_boundary)} |`
    );
  }
  lines.push("", "## Differences Matrix", "");
  lines.push("| Divergence | Finding | Architecture response |");
  lines.push("|---|---|---|");
  for (const item of report.differences_matrix) {
    lines.push(`| ${escapeCell(item.divergence)} | ${escapeCell(item.finding)} | ${escapeCell(item.architecture_response)} |`);
  }
  pushFindings(lines, report.finding_classification);
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderPortabilityMarkdown(report) {
  const lines = [
    "# International Book Portability Check",
    "",
    `Status: ${report.status}`,
    `Date: ${report.generated_date}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, report);
  pushNonNegotiables(lines, report);
  pushCoreChecklist(lines, report);
  lines.push(
    `Scope: ${report.pilot_scope}`,
    "",
    report.scope_boundary,
    "",
  );
  for (const item of report.portability_pilot) {
    lines.push(`## ${item.scope}`, "");
    for (const field of [
      "direct_transfer",
      "terminology_changes",
      "exam_code_remapping",
      "different_examples_or_institutions",
      "local_assessment_forms",
      "cannot_be_supplied_by_textbook",
    ]) {
      lines.push(`### ${field}`, "");
      lines.push(list(item[field]), "");
    }
  }
  pushFindings(lines, report.finding_classification);
  return `${lines.join("\n").trimEnd()}\n`;
}

function renderDecisionMarkdown(report) {
  const lines = [
    "# International Foundation Decision",
    "",
    `Status: ${report.status}`,
    `Date: ${report.generated_date}`,
    `Sprint: \`${SPRINT_ID}\``,
    "",
  ];
  pushProductSpec(lines, report);
  pushNonNegotiables(lines, report);
  pushCoreChecklist(lines, report);
  lines.push("## Final Foundation Decision", "");
  lines.push(`Selected decision: \`${report.final_foundation_decision.selected}\``, "");
  lines.push(report.final_foundation_decision.meaning, "");
  lines.push("Allowed options:");
  lines.push(list(report.final_foundation_decision.allowed_options.map((item) => `\`${item}\``)), "");
  lines.push(`Decision selection count: \`${report.final_foundation_decision.decision_selection_count}\``, "");
  lines.push("## Authorised", "");
  lines.push(list(report.authorizes), "");
  lines.push("## Still Blocked", "");
  lines.push(list(report.still_blocked.map((item) => `\`${item}\``)), "");
  lines.push("## Owner Next Action", "");
  lines.push(report.owner_next_action, "");
  pushFindings(lines, report.finding_classification);
  return `${lines.join("\n").trimEnd()}\n`;
}

function pushFindings(lines, findings) {
  lines.push("", "## Finding Classification", "");
  lines.push("| Finding | Classification | blocks | does_not_block | proof_required_to_close |");
  lines.push("|---|---|---|---|---|");
  for (const finding of findings) {
    lines.push(
      `| ${escapeCell(finding.finding)} | \`${escapeCell(finding.classification)}\` | ${escapeCell(finding.blocks)} | ${escapeCell(finding.does_not_block)} | ${escapeCell(finding.proof_required_to_close)} |`
    );
  }
  lines.push("");
}

function buildBundle() {
  const authorityProfiles = buildAuthorityProfiles();
  const commonCore = buildCommonCore();
  const commonalities = buildCommonalitiesReport(authorityProfiles, commonCore);
  const portability = buildPortabilityReport(commonCore);
  const decision = buildDecisionReport(authorityProfiles, commonCore, commonalities, portability);
  return { authorityProfiles, commonCore, commonalities, portability, decision };
}

function outputContents(bundle) {
  return new Map([
    [OUTPUT_PATHS[0], `${JSON.stringify(bundle.authorityProfiles, null, 2)}\n`],
    [OUTPUT_PATHS[1], `${JSON.stringify(bundle.commonCore, null, 2)}\n`],
    [OUTPUT_PATHS[2], renderCommonCoreModel(bundle.commonCore)],
    [OUTPUT_PATHS[3], renderOverlayArchitecture(bundle.commonCore)],
    [OUTPUT_PATHS[4], renderCommonalitiesMarkdown(bundle.commonalities)],
    [OUTPUT_PATHS[5], `${JSON.stringify(bundle.commonalities, null, 2)}\n`],
    [OUTPUT_PATHS[6], renderPortabilityMarkdown(bundle.portability)],
    [OUTPUT_PATHS[7], `${JSON.stringify(bundle.portability, null, 2)}\n`],
    [OUTPUT_PATHS[8], renderDecisionMarkdown(bundle.decision)],
    [OUTPUT_PATHS[9], `${JSON.stringify(bundle.decision, null, 2)}\n`],
  ]);
}

function parseMode(argv) {
  const args = argv.slice(2);
  const check = args.includes("--check");
  const unknown = args.filter((arg) => arg !== "--check");
  const joined = unknown.join(" ").toLowerCase();
  if (/compliance|compliant|approval|approved|inspection-ready|inspection-readiness|country-compliant|country-compliance|op0|pta|summative/.test(joined)) {
    throw new StopError("STOP_COMPLIANCE_APPROVAL_CLAIM", "Country compliance, approval, and inspection-readiness claims are not authorised.", { args: unknown });
  }
  if (/public|external|publish|teacher|school-facing|school-pack|evidence-pack/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_AUDIENCE", "School-facing, public, external, or evidence-pack output is not authorised.", { args: unknown });
  }
  if (/package|ci|dashboard|quality-ref|quality_ref/.test(joined)) {
    throw new StopError("STOP_FORBIDDEN_INTEGRATION", "Package, CI, dashboard, and quality-ref integration are not authorised.", { args: unknown });
  }
  if (/student|personal|data-processing|product-route|scale|diagnostics|mastery|pv/.test(joined)) {
    throw new StopError("STOP_DOWNSTREAM_AUTHORITY", "Downstream product/student/data authority is not authorised.", { args: unknown });
  }
  if (/all-belgium|whole-uk|single-germany|national-us|us-inspection/.test(joined)) {
    throw new StopError("STOP_GOVERNANCE_OVERGENERALISATION", "Governance boundaries must remain jurisdiction-specific.", { args: unknown });
  }
  if (unknown.length > 0) {
    throw new StopError("STOP_UNSUPPORTED_ARGUMENT", "Unsupported argument for international foundation generator.", { args: unknown });
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
    throw new Error(`International quality standards output is stale: ${mismatches.join(", ")}`);
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
    console.log(mode.check ? "International quality standards output is current." : "International quality standards output generated.");
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
  BLOCKED_AUTHORITY,
  DECISION_OPTIONS,
  OUTPUT_PATHS,
  REV_STD_FINDING_CLASSIFICATIONS,
  SELECTED_DECISION,
  StopError,
  buildBundle,
  commonCoreCategories,
  differencesMatrix,
  jurisdictionProfiles,
  outputContents,
  overlayArchitecture,
  parseMode,
  portabilityPilot,
};
