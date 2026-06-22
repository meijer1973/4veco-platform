# International Common Core Model

Status: internal analytical model
Date: 2026-06-21
Sprint: `GOAL-IQS-FOUNDATION-1`

This model is an internal product-pedagogy foundation. It is not a country-compliance, inspectorate-approval, public, teacher/school-facing, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, or inspection-readiness claim.

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-authorisation-note.md`
- Dutch closure basis: PR #124 accepted and merged under `CLOSE_INTERNAL_SYSTEM`.

## Non-Negotiable Requirements

- Return one of the three authorised decisions.
- No country-compliance, inspectorate-approval, public, school-facing, student-use, or product-route claim is authorised.
- All jurisdictions must preserve source authority and governance boundaries.
- Book portability is a bounded Chapters 1.2/1.3 internal check only.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| `official_source_profiles`: Nine jurisdiction profiles use official-source anchors and record allowed use plus forbidden inference. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `quality_governance_coverage`: Each jurisdiction records inspection/evaluation, curriculum, examination, accountability, accreditation, and regional/state-overlay coverage status, with v0 gaps explicit. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `governance_boundaries`: Flanders, England, Germany, Spain, and the United States retain explicit subnational or federal/state boundaries. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `common_core_matrix`: The shared common-core matrix distinguishes portable product-pedagogy from local overlay needs. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `differences_matrix`: The differences matrix names material divergences and the architecture response. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `overlay_architecture`: The overlay architecture separates shared core, local curriculum/exam overlays, source-evidence overlay, and school-owned evidence. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `book_portability_check`: Book 1 Chapters 1.2 and 1.3 are tested only as a bounded internal portability check. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `blocked_authority`: All forbidden authority flags remain false and visible. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `single_decision`: The foundation chooses exactly one allowed decision. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |
| `human_review_stop`: The packet returns for human review before any country edition, public/school-facing, product, or compliance step. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and PR #131 bounded-correction criteria satisfied. |

## Core Categories

| Category | Classification | Common core | Overlay need | School-owned boundary |
|---|---|---|---|---|
| Curriculum coherence | `near_universal_common_core` | A shared textbook can expose coherent sequencing, chapter goals, prerequisite progression, and links from concepts to exercises. | Jurisdiction overlays must map local subject names, programme goals, standards codes, and mandatory sequence expectations. | Schools still own enacted curriculum, timetable choices, local schemes of work, and inspection conversations. |
| Subject knowledge and progression | `near_universal_common_core` | At the global source-set level, scarcity, choice, opportunity cost, markets, demand/supply reasoning, data interpretation, and economic argumentation recur across the reviewed sources. | Local overlays must add jurisdiction-specific vocabulary, examination taxonomies, and prescribed examples. | Textbook evidence does not prove student mastery or teacher diagnosis. |
| Didactic quality | `widely_shared_but_locally_interpreted` | Worked examples, guided practice, independent practice, retrieval, feedback prompts, and misconception handling are portable product-design patterns. | Inspectorate language and classroom evidence expectations vary strongly by jurisdiction. | Observed teaching quality, lesson adaptation, and classroom climate are school-owned. |
| Assessment alignment | `widely_shared_but_locally_interpreted` | A shared bank can support formative checks, calculation/graph/source tasks, and argument construction. | Exam-code mapping, mark schemes, assessment objectives, task forms, grading language, and national/state exam structures are local. | Summative validity, PTA/school assessment policy, and exam-board approval cannot be supplied by the textbook alone. |
| Student support and differentiation | `widely_shared_but_locally_interpreted` | Scaffolding, hints, alternative representations, and difficulty layering can be designed into the shared product. | Local SEN/SEND/inclusion/accommodation language and required documentation differ. | Individual support plans, intervention records, accommodations, and learner monitoring remain school-owned. |
| Accessibility and inclusion | `widely_shared_but_locally_interpreted` | Semantic structure, readable layouts, text alternatives, keyboard support, contrast, and inclusive examples can be common product requirements. | Legal standards, terminology, and proof expectations differ by country/state. | Accessibility certification, legal compliance, and individual accommodation evidence remain outside this foundation. |
| Quality assurance | `near_universal_common_core` | Source traceability, review records, validator checks, correction logs, and versioned evidence are portable product-quality controls. | Each jurisdiction needs source freshness and authority-strength metadata. | School self-evaluation, governance, and official external review remain local/school-owned. |
| Improvement cycle | `near_universal_common_core` | Finding classification, owner next action, proof required to close, and review-after-correction are portable. | Local accountability cycles and inspection timelines vary. | School improvement planning and accountable implementation are not textbook outputs. |
| Safeguarding/product-school boundaries | `school_owned_or_not_textbook_owned` | The shared product can keep forbidden claims visible and avoid converting product evidence into school evidence. | Safeguarding, privacy, and accountability vocabulary must be jurisdiction-specific. | Safeguarding practice, student data, school policy, and competent-authority judgement remain outside the textbook. |

## Quality-Governance Coverage Matrix

| Jurisdiction | Inspection/school evaluation | Curriculum | Examination | Accountability | Accreditation | Regional/state overlay | Coverage status | Coverage gap |
|---|---|---|---|---|---|---|---|---|
| Netherlands | covered_for_foundation: Inspectie van het Onderwijs Onderzoekskader 2021 VO, version 2025. | covered_for_foundation: CvTE vwo economics syllabus used as the Dutch economics baseline. | covered_for_foundation: CvTE vwo 2026 economics syllabus. | covered_for_school_owned_boundary: Dutch inspection framework records accountability context without product authority. | not_covered_in_v0: no accreditation source was researched or used. | not_applicable_in_v0: national Dutch VO/vwo baseline only. | quality_governance_coverage_recorded_with_v0_gaps | Accreditation and school-level implementation evidence remain outside this source set. |
| Belgium / Flanders | covered_for_foundation: Flemish OK quality framework is the v0 quality/inspection anchor. | covered_for_foundation: Onderwijsdoelen.be curriculum goals portal. | not_covered_in_v0: no Flemish assessment or examination source was researched. | covered_for_school_owned_boundary: OK quality framework informs school-owned quality categories only. | not_covered_in_v0: no accreditation source was researched or used. | covered_for_foundation: Flanders-only boundary recorded; other Belgian communities are out of scope. | quality_governance_coverage_recorded_with_v0_gaps | Assessment/examination sources and non-Flemish Belgian communities remain outside v0. |
| England | covered_for_foundation: Ofsted education inspection framework and operating guide. | covered_for_foundation: DfE A level economics subject content. | covered_as_qualification_content_only: no exam-board specification or mark-scheme source was researched. | covered_for_school_owned_boundary: Ofsted sources record inspection/accountability context without product authority. | not_covered_in_v0: no accreditation source was researched or used. | covered_for_foundation: England-only boundary recorded; Scotland, Wales, and Northern Ireland are out of scope. | quality_governance_coverage_recorded_with_v0_gaps | Exam-board-specific materials and non-England UK systems remain outside v0. |
| Germany | not_covered_in_v0: no German inspection or school-evaluation source was researched. | covered_for_foundation: Bavaria LehrplanPLUS is a representative Land curriculum source. | covered_for_foundation: KMK EPA Wirtschaft source family provides examination-framework context. | not_covered_in_v0: no accountability source was researched. | not_covered_in_v0: no accreditation source was researched or used. | covered_for_foundation: Bavaria appears only as a representative Land example. | quality_governance_coverage_recorded_with_v0_gaps | Land-specific inspection/evaluation/accountability sources and other Laender remain future overlay work. |
| France | not_covered_in_v0: no French inspection or school-evaluation source was researched. | covered_for_foundation: Eduscol SES programme and resources. | covered_for_foundation: BO 2024 SES terminale examination-scope note. | not_covered_in_v0: no accountability source was researched. | not_covered_in_v0: no accreditation source was researched or used. | not_applicable_in_v0: national lycee/baccalaureat SES source set only. | quality_governance_coverage_recorded_with_v0_gaps | School evaluation, accountability, and local implementation sources remain outside v0. |
| Italy | covered_for_foundation: Sistema nazionale di valutazione is the v0 evaluation/quality anchor. | covered_for_foundation: MIM national indications and 2026 curriculum-update notice. | not_covered_in_v0: no upper-secondary economics examination source was researched. | covered_for_school_owned_boundary: SNV source records school self-evaluation/accountability context only. | not_covered_in_v0: no accreditation source was researched or used. | not_applicable_in_v0: national ministry source set only. | quality_governance_coverage_recorded_with_v0_gaps | Track-specific examination and school implementation sources remain outside v0. |
| Spain | not_covered_in_v0: no Spanish inspection or school-evaluation source was researched. | covered_for_foundation: BOE national minimums, Educagob Economia curriculum, and autonomous-community routing. | not_covered_in_v0: no Bachillerato assessment or examination source was researched. | not_covered_in_v0: no accountability source was researched. | not_covered_in_v0: no accreditation source was researched or used. | covered_for_foundation: autonomous-community curriculum routing records the overlay requirement only. | quality_governance_coverage_recorded_with_v0_gaps | Autonomous-community curriculum details, inspection/supervision, accountability, and assessment sources remain future overlay work. |
| Poland | covered_for_foundation: MEN Nadzor pedagogiczny source. | covered_for_foundation: MEN business-and-management policy source. | covered_for_foundation: CKE matura information source. | covered_for_school_owned_boundary: MEN pedagogical supervision source records accountability context only. | not_covered_in_v0: no accreditation source was researched or used. | covered_for_foundation: national source with regional kurator implementation noted. | quality_governance_coverage_recorded_with_v0_gaps | Regional implementation details and accreditation remain outside v0. |
| United States | not_covered_in_v0: no national inspection regime is claimed and no state school-evaluation source was researched. | covered_for_foundation: California and New York state standards/framework examples. | not_covered_in_v0: no state exam or assessment source was researched. | covered_for_federal_context_only: U.S. Department of Education standards/accountability policy gives ESEA/ESSA context. | not_covered_in_v0: no accreditation source was researched or used. | covered_for_foundation: California and New York are representative state examples only. | quality_governance_coverage_recorded_with_v0_gaps | Accreditation, state accountability details, district implementation, and any national inspection claim remain outside v0. |


## Decision Posture

Selected foundation decision: `PROCEED_WITH_COMMON_CORE_AND_OVERLAYS`

- A shared upper-secondary economics product core is plausible across the reviewed sources for foundational reasoning, market diagrams, data/source use, scaffolding, and product-quality evidence.
- Jurisdiction overlays are required for curriculum labels, official source mapping, exam forms, regional/state/Land/community governance, local institutions, accessibility/legal terminology, and school-owned evidence.
- The foundation is analytic only and does not authorize a country-compliant edition, public claim, school pack, product route, student use, or personal-data processing.
