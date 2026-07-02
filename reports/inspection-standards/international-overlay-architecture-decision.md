# International Overlay Architecture Decision

Status: human_review_pending
Date: 2026-06-22
Sprint: `GOAL-IQS-OVERLAY-ARCHITECTURE-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-OVERLAY-ARCHITECTURE-1/GOAL-IQS-OVERLAY-ARCHITECTURE-1-sprint-plan.md`
- Foundation decision source: `reports/inspection-standards/international-foundation-decision.md`

## Non-Negotiable Requirements

- Cite the product end-state and original sprint/gate specification.
- Cite the accepted GOAL-IQS-FOUNDATION-1 decision and preserve its authority boundaries.
- Name non-negotiable requirements before conclusions.
- Include a core-requirement checklist.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry any missing core requirement as PASS WITH FLAGS.
- Generate exactly the allowlisted overlay schema, four descriptors, governance docs, crosswalk, pilot report, and decision report.
- Use explicit per-scope source and output allowlists; do not glob directories or discover sources implicitly.
- Keep all country-edition, compliance, approval, public, school-facing, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, and inspection-readiness authority blocked.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| `overlay_schema`: The descriptor schema names every required overlay field and blocks implicit source/output discovery. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `four_archetype_descriptors`: England, Flanders, Bavaria/Germany, and California/United States descriptors are generated as contrasting governance archetypes. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `official_source_allowlists`: Each descriptor carries explicit official-source allowlists with authority type, allowed use, and forbidden inference. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `curriculum_assessment_mapping`: Each descriptor separates curriculum mapping from assessment/exam mapping and names v0 gaps. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `book1_crosswalk`: Book 1 Chapters 1.2 and 1.3 are crosswalked to the four descriptors without country-edition output. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `school_owned_boundary`: Every descriptor preserves school-owned evidence, implementation, inspection, accreditation, and accountability boundaries. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `accessibility_inclusion_terms`: Each descriptor records local accessibility/inclusion terminology without compliance claims. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `refusal_and_stop_conditions`: Generator and checker refuse forbidden audiences, claims, integrations, and governance overgeneralisations. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `single_decision`: The architecture chooses exactly one allowed decision. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `human_review_stop`: The packet returns only after all descriptors, crosswalk, validators, specialist reviews, and final PR proof are complete. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |

## Final Overlay Architecture Decision

Selected decision: `PROCEED_TO_SELECTED_JURISDICTION_DEEPENING`

Proceed only to a later internal selected-jurisdiction deepening step if the human owner approves this packet. This does not authorise country editions, local implementation, public/school-facing output, product routes, or Scale Gate use.

Allowed options:
- `PROCEED_TO_SELECTED_JURISDICTION_DEEPENING`
- `REVISE_OVERLAY_SCHEMA`
- `RESEARCH_GAPS_BEFORE_PILOT_EXPANSION`

Decision selection count: `1`

## Authorizes After Human Approval

- Internal selected-jurisdiction deepening planning.
- Further source-refresh work for a selected jurisdiction if separately scoped.
- Manual repository validation of descriptor and crosswalk currentness.

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

## Owner Next Action

Human owner may accept, revise, or reject GOAL-IQS-OVERLAY-ARCHITECTURE-1. Acceptance authorizes only a future internal selected-jurisdiction deepening step, not country-edition or downstream product authority.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| The overlay descriptor schema, four descriptors, crosswalk, and validators are complete enough for human review. | `core_requirement_met` | Nothing if all specialist and CI proof remain green. | Human decision on the next internal selected-jurisdiction deepening step. | Final lead PASS, fresh mergeable PR, green CI, and human acceptance. |
| Local implementation authority remains blocked. | `scale_blocker` | Country editions, public/school-facing output, teacher output, evidence packs, dashboard/package/CI product integration, quality-ref, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, OP0, PTA, summative, inspection-readiness, compliance, and approval claims. | Internal architecture review. | Separate human-authorised local implementation gate with local source, teacher, legal/privacy, and quality-inspection reviews. |
