# Selected Jurisdiction Transformation Contract

Status: internal-only architectural instructions
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
| `schema_v1` | met_for_contract | Checker and final lead review |
| `positive_negative_fixtures` | met_for_contract | Checker and final lead review |
| `england_deep_descriptor` | met_for_contract | Checker and final lead review |
| `flanders_deep_descriptor` | met_for_contract | Checker and final lead review |
| `england_crosswalk` | met_for_contract | Checker and final lead review |
| `flanders_crosswalk` | met_for_contract | Checker and final lead review |
| `transformation_specs` | met_for_contract | Checker and final lead review |
| `comparative_decision` | met_for_contract | Checker and final lead review |
| `authority_boundary` | met_for_contract | Checker and final lead review |
| `final_human_review_stop` | met_for_contract | Checker and final lead review |

## Contract

These specifications are architectural instructions only. They must not generate localized chapters, teacher/school-facing output, public output, evidence packs, product routes, Scale Gate evidence, diagnostics/mastery/PV, student/product use, personal-data processing, legal sufficiency, compliance, approval, accreditation, or inspection-readiness claims.

Product accessibility affordances are limited to internal terminology and design-support planning. School-owned accommodations, individual learner support records, local legal duties, and support-sufficiency evidence remain outside product proof for both England and Flanders.

## England Summary

- Core supply-demand model logic.
- A good's own price causes movement along the existing demand curve; non-price demand factors shift the whole demand curve.
- Equilibrium, shortage, surplus, and causal reasoning.

## Flanders Summary

- Core supply-demand model logic.
- A good's own price causes movement along the existing demand curve; non-price demand factors shift the whole demand curve.
- Equilibrium, shortage, surplus, and causal reasoning.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Transformation contract remains internal and non-student-facing. | `core_requirement_met` | Nothing for human review. | Internal prototype-planning decision after human acceptance. | Checker PASS and final lead PASS. |
| All implementation outputs remain blocked. | `scale_blocker` | Localized chapters, school-facing output, public output, product routes, legal sufficiency, and compliance/inspection claims. | Internal transformation specification review. | Separate future human authorization. |
