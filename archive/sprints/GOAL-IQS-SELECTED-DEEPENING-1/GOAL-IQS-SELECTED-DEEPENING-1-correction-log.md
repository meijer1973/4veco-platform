# GOAL-IQS-SELECTED-DEEPENING-1 Correction Log

Status: in progress
Date: 2026-06-22

## Product End-State And Original Sprint/Gate Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-SELECTED-DEEPENING-1/GOAL-IQS-SELECTED-DEEPENING-1-sprint-plan.md`

## Corrections Applied Before Specialist Review

| Finding | Classification | blocks | does_not_block | proof_required_to_close | Resolution |
|---|---|---|---|---|---|
| Custom schema checker initially treated `integer` as an unsupported type | blocker | true | false | Focused checker and Jest refusal tests pass | Added explicit integer handling through `Number.isInteger` |
| Flanders assessment-boundary assertion contained a malformed quote in the checker | blocker | true | false | Checker parses and passes | Corrected the assertion string |
| Refusal expectation for the all-England-awarding-bodies case used the AQA approval stop code | blocker | true | false | Refusal matrix passes all expected stop codes | Corrected expected stop code to governance overgeneralisation |
| Roadmap prose used restricted scope language outside an authorised section | blocker | true | false | `npm.cmd run check:scope-language` passes | Reworded the candidate future-step prose to `trial architecture` / `trial-planning` while keeping formal decision and sprint identifiers in code tokens |
| Accessibility/inclusion reviewer found that product accessibility support was not consistently separated from school-owned accommodations and local legal duties | missing_core_requirement | true | false | Accessibility/inclusion re-review PASS after regeneration | Added explicit England and Flanders descriptor language, transformation-contract wording, and readiness-comparison wording separating product accessibility affordances from accommodations, learner records, local legal duties, and support-sufficiency evidence |
| Legal/privacy/claims reviewer found legal sufficiency was not an explicit claim-specific refusal | blocker | true | false | Legal/privacy/claims re-review PASS after refusal matrix reports 31 cases | Added `selected_jurisdiction_legal_sufficiency_claim`, documented legal-sufficiency blocks, and added `--legal-sufficiency` refusal expecting `STOP_COMPLIANCE_APPROVAL_CLAIM` |
| Teacher/economics reviewer found the 1.2.2 crosswalk rows did not explicitly distinguish own-price movement from non-price demand-factor shifts | missing_core_requirement | true | false | Teacher/economics re-review PASS after generated crosswalks include the distinction | Added the causal distinction to England/Flanders curriculum anchors, mark-scheme/rubric expectations, transformation unchanged content, and checker assertions |

## Specialist Review Corrections

Pending specialist reviews.
