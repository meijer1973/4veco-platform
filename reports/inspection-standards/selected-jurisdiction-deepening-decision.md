# Selected Jurisdiction Deepening Decision

Status: decision ready for human review
Sprint: `GOAL-IQS-SELECTED-DEEPENING-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-SELECTED-DEEPENING-1/GOAL-IQS-SELECTED-DEEPENING-1-sprint-plan.md`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus original sprint/gate spec.
- Close the accepted shallow-schema carry item before expanded machine consumption.
- Generate nested schema v1 with strict nested additionalProperties:false controls.
- Produce England and Flanders deep descriptors only; keep Bavaria and California as architectural controls.
- Use explicit source and output allowlists only; do not glob directories or scan generated lesson output.
- Map Book 1 Chapters 1.2 and 1.3 to exact local source layers where possible.
- Produce internal transformation specifications only; do not generate localized chapters.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry a missing core requirement as PASS WITH FLAGS.
- Keep country editions, school/teacher-facing output, public output, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, accreditation, and inspection-readiness claims blocked.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
| --- | --- | --- |
| `schema_v1` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `positive_negative_fixtures` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `england_deep_descriptor` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `flanders_deep_descriptor` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `england_crosswalk` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `flanders_crosswalk` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `transformation_specs` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `comparative_decision` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `authority_boundary` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |
| `final_human_review_stop` | met_for_decision | Checker, specialist, final lead, PR, CI, and human review |

## Decision

Selected: `PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING`

Allowed options:

- `PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING`
- `LIMIT_DEEPENING_TO_ONE_JURISDICTION`
- `RESEARCH_GAPS_BEFORE_PROTOTYPE_PLANNING`

Rationale: England and Flanders expose different enough source, assessment, language, and quality-governance risks to justify a later internal overlay prototype-planning sprint without producing country editions.

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

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| The selected-deepening packet can proceed to human review with one decision selected. | `core_requirement_met` | Nothing for human review. | A later internal prototype-planning sprint if human accepted. | Human owner decision. |
| All implementation and downstream authority remains blocked. | `scale_blocker` | Country editions, localized student-facing chapters, teacher/school-facing distribution, public output, evidence-pack deployment, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, accreditation, and inspection-readiness claims. | Internal selected-jurisdiction readiness decision. | Separate future human authorization with local expert/source/legal/accessibility review. |
