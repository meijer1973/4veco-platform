# Local Expert Source Refresh Gate Contract

Sprint: `GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-sprint-plan.md`
- Roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- Accepted input decision: `PROCEED_TO_LOCAL_EXPERT_SOURCE_REFRESH_GATE_PLANNING`

## Hard Boundary

Local expert review may inform internal source/curriculum interpretation. It may not substitute for official authority, legal advice, inspectorate approval, school implementation evidence, or compliance proof.

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Cite the accepted no-output simulation decision and preserve the no-output/no-runtime/no-product-authority boundary.
- Define local expert role contract fields without substituting local expert judgement.
- Define source-refresh protocol fields without executing source refresh.
- Use explicit source and output allowlists only; no directory globbing or generated lesson-output scanning.
- Include England and Flanders jurisdiction-specific gates.
- Simulate source-refresh gate classification cases without refreshing sources or producing localized output.
- Refuse forbidden audiences, claims, integrations, product routes, Scale Gate, diagnostics/mastery/PV, personal data, support/accommodation sufficiency, and compliance/inspection-readiness claims.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- PASS WITH FLAGS may not carry a missing core requirement.

## Local Expert Role Fields

| Field | Requirement |
| --- | --- |
| `jurisdiction` | Required for each jurisdiction |
| `jurisdiction_label` | Required for each jurisdiction |
| `expert_role` | Required for each jurisdiction |
| `allowed_review_scope` | Required for each jurisdiction |
| `forbidden_authority` | Required for each jurisdiction |
| `source_review_responsibility` | Required for each jurisdiction |
| `curriculum_assessment_review_responsibility` | Required for each jurisdiction |
| `language_terminology_review_responsibility` | Required for each jurisdiction |
| `accessibility_inclusion_review_responsibility` | Required for each jurisdiction |
| `legal_claim_boundary` | Required for each jurisdiction |
| `school_owned_evidence_boundary` | Required for each jurisdiction |
| `conflict_uncertainty_handling` | Required for each jurisdiction |
| `required_output_format` | Required for each jurisdiction |

## Still Blocked

- `source_refresh_executed`
- `local_expert_substituted`
- `runtime_execution`
- `localized_paragraphs_generated`
- `localized_exercises_generated`
- `localized_answer_models_generated`
- `localized_assessment_items_generated`
- `student_facing_files_generated`
- `teacher_school_facing_output_generated`
- `public_output_generated`
- `evidence_pack_generated`
- `product_route_adoption`
- `scale_gate_integration`
- `diagnostics_mastery_pv`
- `student_product_use`
- `personal_data_processing`
- `legal_compliance_claim`
- `approval_accreditation_claim`
- `op0_pta_summative_claim`
- `inspection_readiness_claim`
- `support_sufficiency_claim`
- `accommodation_sufficiency_claim`
- `individual_adjustment_claim`
- `reasonable_adjustment_claim`
- `learner_support_record_claim`
- `support_records_personal_data`
- `whole_uk_claim_from_england_only`
- `all_belgium_claim_from_flanders_only`
- `generated_lesson_output_scanning`
- `implicit_source_discovery`
- `directory_globbing`
- `quality_ref_or_dashboard_integration`
