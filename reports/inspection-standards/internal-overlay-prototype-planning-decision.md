# Internal Overlay Trial Planning Decision

Status: decision_ready_for_human_review
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

## Decision

Selected: `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`

Allowed options:

- `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`
- `SOURCE_REFRESH_BEFORE_TRIAL_CONTRACT`
- `STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK`

Decision selection count: `1`

Rationale: England and Flanders now have enough selected-deepening source and crosswalk structure to draft a later internal trial contract, but only as non-executing planning/contract work with all product and school-facing authority blocked.

## Authorizes After Human Approval

- A later internal-only trial-contract draft sprint.
- No runtime execution, localized chapter generation, school-facing output, public output, product route, Scale Gate, diagnostics/mastery/PV, student/product use, or personal-data processing.

## Still Blocked

- `country_compliance_claim`
- `inspectorate_approval_claim`
- `legal_compliance_claim`
- `inspection_readiness_claim`
- `school_pack_trial`
- `teacher_school_distribution`
- `public_external_distribution`
- `evidence_pack_deployment`
- `package_script_invocation`
- `ci_invocation`
- `dashboard_gate`
- `quality_ref_integration`
- `product_route_adoption`
- `scale_gate_integration`
- `diagnostics_mastery_pv`
- `student_or_product_use`
- `personal_data_processing`
- `complete_op0_pta_summative_claim`
- `op0_claim`
- `pta_validity_claim`
- `summative_validity_claim`
- `single_national_us_inspection_claim`
- `whole_uk_claim_from_england_only`
- `all_belgium_claim_from_flanders_only`
- `germany_single_land_claim`
- `country_edition_generation`
- `local_exam_code_implementation`
- `teacher_school_facing_overlay`
- `public_overlay_output`
- `school_owned_evidence_collection`
- `package_or_ci_product_integration`
- `country_specific_legal_claim`
- `localized_student_facing_chapters`
- `teacher_school_facing_distribution`
- `selected_jurisdiction_public_output`
- `selected_jurisdiction_evidence_pack`
- `selected_jurisdiction_product_route`
- `selected_jurisdiction_scale_gate`
- `selected_jurisdiction_personal_data`
- `selected_jurisdiction_legal_sufficiency_claim`
- `selected_jurisdiction_compliance_claim`
- `selected_jurisdiction_approval_claim`
- `selected_jurisdiction_accreditation_claim`
- `selected_jurisdiction_inspection_readiness_claim`
- `internal_prototype_runtime_execution`
- `localized_overlay_output_generation`
- `fixture_to_product_promotion`
- `teacher_school_pilot`
- `support_sufficiency_claim`
- `accommodation_sufficiency_claim`
- `individual_adjustment_claim`
- `support_records_personal_data`
- `automated_source_refresh`
- `non_allowlisted_source_use`
- `local_expert_substitution`

## Owner Next Action

Decide whether to authorize a later internal-only trial-contract draft sprint. Approval must not be read as local implementation, school-facing, public, product-route, Scale Gate, or student-use authority.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| The planning packet selects one allowed next decision. | `core_requirement_met` | Nothing for human review. | A later internal trial-contract draft sprint if human accepted. | Owner payload authorization for reviewed_payload_head_sha and decision scope. |
| All implementation and downstream authority remains blocked. | `scale_blocker` | Country editions, localized chapters, teacher/school-facing distribution, public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, OP0, PTA, summative validity, and inspection-readiness claims. | Internal planning decision only. | Separate future human authorization with local expert/source/legal/accessibility review. |
