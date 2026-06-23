# Selected Jurisdiction Readiness Comparison

Status: internal-only readiness comparison
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
| `schema_v1` | met_for_comparison | Checker, specialist, final lead, and human review |
| `positive_negative_fixtures` | met_for_comparison | Checker, specialist, final lead, and human review |
| `england_deep_descriptor` | met_for_comparison | Checker, specialist, final lead, and human review |
| `flanders_deep_descriptor` | met_for_comparison | Checker, specialist, final lead, and human review |
| `england_crosswalk` | met_for_comparison | Checker, specialist, final lead, and human review |
| `flanders_crosswalk` | met_for_comparison | Checker, specialist, final lead, and human review |
| `transformation_specs` | met_for_comparison | Checker, specialist, final lead, and human review |
| `comparative_decision` | met_for_comparison | Checker, specialist, final lead, and human review |
| `authority_boundary` | met_for_comparison | Checker, specialist, final lead, and human review |
| `final_human_review_stop` | met_for_comparison | Checker, specialist, final lead, and human review |

## Comparison

| Dimension | Assessment |
| --- | --- |
| source_completeness | High for England source layers; medium-high for Flanders official goals/quality layer with school-network limitation. |
| curriculum_fit | England maps strongly to AQA 4.1.3; Flanders maps strongly to SC11.05 for market mechanism but not all extension content. |
| assessment_fit | England has representative AQA assessment forms; Flanders assessment remains a deliberate gap. |
| terminology_effort | England requires full language conversion; Flanders requires careful Dutch/Flemish terminology review. |
| institution_localization_effort | Both require local institution and context replacement before prototypes. |
| accessibility_inclusion_mapping | England has a SEND terminology source layer and Flanders has OK quality vocabulary, but both are product-accessibility/support context only: school-owned accommodations, local legal duties, learner support records, and support sufficiency evidence remain outside product proof. |
| school_owned_evidence_dependency | High for both; product output cannot replace school evidence. |
| local_expert_dependency | High for both before prototype planning exits internal mode. |
| estimated_reuse_percentage | England 62%, Flanders 71%, internal methodology only and not compliance evidence. |
| remaining_blocking_gaps | AQA prototype task authorization for England; school/network and assessment source gaps for Flanders. |

## Reuse Estimates

The reuse percentage is an internal estimate with methodology. It is not a compliance measure.

| Jurisdiction | Estimate | Methodology |
| --- | --- | --- |
| england | 62% | Internal estimate across nine Book 1 concept rows: core model transfer high, language conversion medium, assessment/task replacement high, source citation burden medium. |
| flanders | 71% | Internal estimate across nine Book 1 concept rows: language transfer high, core model transfer high, school/network assessment dependency high, consumer-surplus/collective-demand placement uncertain. |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| England and Flanders are sufficient contrasting jurisdictions for internal overlay prototype planning readiness. | `core_requirement_met` | Nothing for human review of this selected-deepening packet. | A later internal overlay prototype-planning sprint if human accepted. | Specialist reviews, final lead PASS, fresh PR, and green CI. |
| Reuse percentages are internal estimates only. | `scale_blocker` | Legal sufficiency, compliance, approval, inspection-readiness, or product/adoption claims. | Internal architecture planning. | Separate local expert review before any prototype implementation. |
