# Internal Overlay Trial Planning Contract

Status: ready_for_human_review
Sprint: `GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1`
Date: 2026-06-24

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`
- Accepted selected-deepening decision: `PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING`
- Accepted decision source: `reports/inspection-standards/selected-jurisdiction-deepening-decision.md`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Cite the accepted GOAL-IQS-SELECTED-DEEPENING-1 decision and preserve its authority boundaries.
- Plan internal overlay trial architecture only; do not create localized chapters, country editions, or executable product routes.
- Use explicit input and output allowlists; do not glob directories or scan generated lesson output.
- Define source traceability, blocker display, refusal rules, validation gates, and review gates before any later trial-contract draft.
- Keep England and Flanders as the selected contrasting jurisdictions; do not generalize to whole UK or all Belgium.
- Keep all teacher/school-facing, public, evidence-pack, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, and inspection-readiness authority blocked.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry a missing core requirement as PASS WITH FLAGS.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
| --- | --- | --- |
| `accepted_decision_bound` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `input_allowlist` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `output_allowlist` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `no_output_boundary` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `prototype_scope` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `source_traceability` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `blocker_display` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `support_accommodation_boundary` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `refusal_stop_conditions` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `review_gates` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `human_review_stop` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |

## Contract Boundary

This contract describes internal planning for a later non-executing trial
contract. It does not create runtime execution, localized lesson output,
teacher or school-facing output, public output, product route, Scale Gate,
diagnostics/mastery/PV route, student/product use, personal-data processing,
legal sufficiency, compliance, approval, OP0, PTA, summative, or
inspection-readiness authority.

## Exact Input Allowlist

- `reports/inspection-standards/selected-jurisdiction-deepening-decision.json`
- `reports/inspection-standards/selected-jurisdiction-readiness-comparison.json`
- `reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json`
- `reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json`
- `references/data/inspection-standards/overlays/england.deepening.v1.json`
- `references/data/inspection-standards/overlays/flanders.deepening.v1.json`
- `docs/inspection-standards/selected-jurisdiction-transformation-contract.md`

## Exact Output Allowlist

- `docs/inspection-standards/internal-overlay-prototype-planning-contract.md`
- `reports/inspection-standards/internal-overlay-prototype-plan.md`
- `reports/inspection-standards/internal-overlay-prototype-plan.json`
- `reports/inspection-standards/internal-overlay-prototype-refusal-matrix.md`
- `reports/inspection-standards/internal-overlay-prototype-refusal-matrix.json`
- `reports/inspection-standards/internal-overlay-prototype-planning-decision.md`
- `reports/inspection-standards/internal-overlay-prototype-planning-decision.json`
- `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`

## Future Contract Field Families

| Field family | Required fields | Reason |
| --- | --- | --- |
| `source_binding` | `jurisdiction_id`, `source_ids`, `source_role`, `access_date`, `forbidden_inference` | Future trial rows must trace to selected-deepening sources instead of discovering sources implicitly. |
| `book_scope_binding` | `book_scope`, `chapter_paragraph`, `concept_id`, `crosswalk_row_id`, `route_local_only` | Trial planning is limited to Book 1 Chapters 1.2 and 1.3 selected-deepening crosswalk evidence. |
| `transformation_intent` | `unchanged_core`, `terminology_change`, `example_change`, `assessment_change`, `exclusion` | Future work must separate portable economics from local terminology, examples, assessment forms, and exclusions. |
| `blocker_display` | `school_owned_evidence_needed`, `school_owned_accommodation_evidence_needed`, `local_expert_needed`, `legal_sufficiency_blocked`, `support_sufficiency_blocked`, `accommodation_sufficiency_blocked`, `individual_adjustment_claim_blocked`, `support_records_personal_data_blocked`, `owner_next_action` | The future contract must keep blockers visible instead of burying them in prose. |
| `review_disposition` | `reviewer_role`, `finding_classification`, `blocks`, `does_not_block`, `proof_required_to_close` | REV-STD-1 applies to future planning, specialist review, and human-review packets. |

## Blocker Display Requirements

- `route_local_only evidence status`
- `school_owned_evidence_still_needed`
- `forbidden_inferences`
- `accessibility_support_limitations`
- `legal_sufficiency_blocked`
- `support_sufficiency_blocked`
- `school_owned_accommodation_evidence_needed`
- `individual_adjustment_claim_blocked`
- `support_records_personal_data_blocked`
- `check_surface_authority_separation`
- `owner_next_action`
- `proof_required_to_close`

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| The selected-deepening decision is sufficient to plan a later internal overlay trial contract. | `core_requirement_met` | Nothing for human review of this planning packet. | A later internal trial-contract draft only if human accepted. | Owner payload authorization for reviewed_payload_head_sha and decision scope. |
| Planning remains non-executing and creates no localized, school-facing, public, product-route, Scale Gate, diagnostic, mastery, PV, student, or personal-data output. | `core_requirement_met` | Any implementation, runtime, product-route, student-use, public, or school-facing use. | Internal planning packet review. | Separate future human authorization after specialist review. |
