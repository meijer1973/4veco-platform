# International Overlay Architecture

Status: internal analytical architecture
Date: 2026-06-21
Sprint: `GOAL-IQS-FOUNDATION-1`

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

## Four Layers

### Layer 1: International pedagogical/product common core

Can reside in one shared textbook:
- Economic reasoning sequence
- Concept explanations
- Graphs/tables/source reasoning
- Worked examples
- Practice tasks
- Misconception checks
- Semantic structure, readable layouts, text alternatives, keyboard/focus support, contrast, inclusive examples, and common support features
- Internal product-quality evidence

Requires local overlay:
- Local terminology notes
- Jurisdiction-specific examples where institutions differ

Blocked claims:
- country compliance
- official approval
- inspection readiness

### Layer 2: National or regional curriculum overlay

Can reside in one shared textbook:
- Optional crosswalk tables and local vocabulary sidebars

Requires local overlay:
- Official source mapping
- Subject names
- Programme goal codes
- State/Land/community/regional curriculum differences

Blocked claims:
- one-size-fits-all country fit
- all Belgium from Flanders
- whole UK from England
- single German or US curriculum

### Layer 3: Examination and assessment overlay

Can reside in one shared textbook:
- Generic formative checks and reusable task families

Requires local overlay:
- Exam-board or central-exam task forms
- Assessment objectives
- Marking conventions
- Allowed calculators/materials
- Local grading vocabulary

Blocked claims:
- summative validity
- PTA validity
- exam-board approval

### Layer 4: School-owned implementation/evidence layer

Can reside in one shared textbook:
- Evidence prompts and safe-use notes only

Requires local overlay:
- Classroom implementation evidence
- Learner support/accommodation records
- School quality assurance
- Safeguarding/privacy procedures
- Inspection/accreditation conversations

Blocked claims:
- school implementation proof
- inspection proof
- legal compliance

## Governance Boundaries

- Belgium: Flanders-only unless another community is separately sourced.
- United Kingdom: England-only unless Scotland, Wales, or Northern Ireland are separately sourced.
- Germany: KMK/federal context plus Land overlays.
- Spain: national minimum curriculum plus autonomous-community overlays.
- United States: federal context plus state standards/accountability examples; accreditation and national inspection remain `not_covered_in_v0`.
