# MTU-H6 Cross-Exam Generalization Report

Status: `passed`

This report tests whether the MTU-H5 mapping-regression rules generalize to a fresh non-H5 sample drawn from official local CvTE exam PDFs. It remains evidence/checker work only. It is not MTU-H6 closure by itself, product-route readiness, diagnostics, PV, lesson output, mastery, sequencing, summative use, or student/product authority.

## Summary

- Records reviewed: 7
- Atomic operations reviewed: 25
- Passed records: 7
- Review-required records: 0
- Failed records: 0
- Rendered official evidence records: 13
- Negative fixtures: 7, all failed as expected with targeted defect classes

## Record Outcomes

| Record | Outcome | Classification | Atomic ops | Notes |
|---|---:|---|---:|---|
| `vw-1022-a-24-1-o:opgave-1:question-3` | passed | generalized_pass_atomic | 4 | Atomic decomposition preserves market-A reduction, market-B equilibrium, extra-emissions, and net-reduction checks; A88 and A96 remain required and A15 remains forbidden. |
| `vw-1022-a-24-1-o:opgave-1:question-4` | passed | generalized_pass_after_bounded_answer_form_decision | 2 | Human review approved A40 as bounded arceer answer-form/procedure evidence for welfare-region shading; q4 is split into tax-revenue and efficiency-loss shading operations. |
| `vw-1022-a-24-1-o:opgave-1:question-6` | passed | generalized_pass_atomic | 3 | Cross-elasticity classification and the demand/production/emission direction are separately asserted; A15 own-price elasticity remains forbidden. |
| `ha-1022-a-23-2-o:opgave-2:question-10` | passed | generalized_pass_atomic | 3 | Old/new tax equilibrium and airline burden are independently checked; D05/D07 remain explicit incidence/pass-through support. |
| `ha-1022-a-23-1-o:opgave-5:question-22` | passed | generalized_pass_atomic | 4 | Dominant-strategy reasoning and prisoner-dilemma/suboptimal-outcome conclusion are separate operations. |
| `vw-1022-a-23-2-o:opgave-5:question-23` | passed | generalized_pass_after_reviewed_equivalent | 4 | Human review approved a q23-specific macro multi-curve drawing reviewed equivalent combining I07/I08/A42/A81, graph-drawing precedent, and official q23 evidence. |
| `vw-1022-a-24-2-o:opgave-4:question-18` | passed | generalized_pass_atomic | 5 | The Armington/profit-max route is decomposed into levy-adjusted MK, revenue/MO, MO=MK quantity, and final domestic price; stale A15/H03/A20 remain forbidden. |

## Answer-Form Decisions Executed

- q4 bounded A40: `A40` is used as bounded canonical arceer answer-form/procedure evidence for welfare-region shading only.
- q23-specific macro: a q23-specific reviewed equivalent combines `I07`, `I08`, `A42`, `A81`, the existing graph-drawing answer-form precedent, and official q23 evidence.

## Negative Regression Fixtures

- `h6-negative-q3-scale-factor-unmapped`: targets `missing_mtu_for_correction_model_operation` on `h6-vw24-1-q3-net-co2-reduction-answer`.
- `h6-negative-q4-full-graph-construction-overtrigger`: targets `over_triggered_prerequisite_not_required_by_answer_model` on `h6-vw24-1-q4-tax-revenue-area-market-a`.
- `h6-negative-q6-point-elasticity-overtrigger`: targets `over_triggered_prerequisite_not_required_by_answer_model` on `h6-vw24-1-q6-cross-elasticity-sign`.
- `h6-negative-q10-incidence-unmapped`: targets `missing_mtu_for_correction_model_operation` on `h6-ha23-2-q10-airline-tax-share-answer`.
- `h6-negative-q22-dominant-without-pd-outcome`: targets `missing_mtu_for_correction_model_operation` on `h6-ha23-1-q22-nash-suboptimal-outcome`.
- `h6-negative-q23-macro-function-construction-overtrigger`: targets `over_triggered_prerequisite_not_required_by_answer_model` on `h6-vw23-2-q23-ga-shift`.
- `h6-negative-q18-armington-elasticity-derived-mk-overtrigger`: targets `over_triggered_prerequisite_not_required_by_answer_model` on `h6-vw24-2-q18-levy-adjusted-given-mk`.

## Validation

Run:

```bash
node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js
```

The expected live evaluation status is `passed`. Human review is still required before any MTU-H6 closure or downstream authority claim.
