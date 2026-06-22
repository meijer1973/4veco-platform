# International Book Portability Check

Status: bounded_portability_pilot_complete
Date: 2026-06-21
Sprint: `GOAL-IQS-FOUNDATION-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-authorisation-note.md`
- Dutch closure basis: PR #124 accepted and merged under `CLOSE_INTERNAL_SYSTEM`.

## Non-Negotiable Requirements

- Cite the product end-state and original sprint/gate specification.
- Name non-negotiable requirements before conclusions.
- Include a core-requirement checklist.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry any missing core requirement as PASS WITH FLAGS.
- Keep all country-compliance, approval, public, school-facing, package/CI/dashboard/quality-ref, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, and inspection-readiness authority blocked.

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

Scope: Book 1 Chapters 1.2 and 1.3

Internal analytical portability check only; no country-compliant edition, public output, teacher/school-facing output, product-route adoption, diagnostics/mastery/PV, student/product-use, or personal-data processing.

## Book 1 Chapter 1.2

### direct_transfer

- Willingness to pay, individual demand, buy/no-buy decisions, the law of demand, consumer surplus, demand factors, movement along versus shift of the demand curve, collective demand, and demand-graph reasoning can transfer as core demand concepts.
- Demand tables, demand curves, consumer-surplus diagrams, and stepwise price-quantity reasoning are portable learning designs.

### terminology_changes

- Local subject names and examination vocabulary must be overlaid.
- Currency, institutions, and policy examples need localization.

### exam_code_remapping

- Dutch CvTE domain codes cannot be reused outside the Netherlands.
- England A level, France SES, Spain Bachillerato, Poland BiZ/matura, Germany Land/KMK, and US state standards need separate mapping.

### different_examples_or_institutions

- Tax, welfare, central-bank, labour-market, EU/national/federal, and business-law examples often require local substitution.

### local_assessment_forms

- Question formats, mark schemes, essays/data-response expectations, rubrics, and permitted materials need local overlays.

### cannot_be_supplied_by_textbook

- School implementation evidence
- Student results or accommodations
- Inspection/accreditation judgement
- Summative validity

## Book 1 Chapter 1.3

### direct_transfer

- Demand, supply, equilibrium, shifts versus movement along a curve, and diagram reasoning are broadly portable.
- Route-local proof records and answer/model separation are useful product-quality patterns.

### terminology_changes

- Demand/supply labels, graph conventions, and local example language need overlay review.
- Country-specific market institutions and policy contexts need local substitution.

### exam_code_remapping

- Do not reuse Dutch target or diagnostic status as international exam readiness.
- Each jurisdiction needs a separate mapping from tasks to official curriculum/exam source.

### different_examples_or_institutions

- Agricultural, housing, labour, energy, and public-policy examples may need national or regional replacement.

### local_assessment_forms

- Essay, short-answer, data-response, multiple-choice, and graph-task conventions vary.

### cannot_be_supplied_by_textbook

- School-owned differentiation/support evidence
- Accessibility compliance proof
- Inspection/accreditation proof
- Student/product-use authority


## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Chapters 1.2 and 1.3 contain a strong transferable economics core. | `core_requirement_met` | Nothing for foundation decision. | Proceeding with shared common core plus overlays. | Local curriculum/exam remapping before any country edition. |
| Exam-code and institution examples require local overlays. | `minor_carry_flag` | Direct publication as an international edition. | Internal architecture foundation. | Jurisdiction-specific overlay mapping and teacher/economics review. |
| School-owned implementation evidence cannot be supplied by the textbook. | `scale_blocker` | Inspection/accreditation/compliance claims. | Internal product portability analysis. | Separate school-owned evidence route if ever authorised. |
