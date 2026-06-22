# MTU-H6 Cross-Exam Generalization Report

Status: `review_required`

This report tests whether the MTU-H5 mapping-regression rules generalize to a fresh non-H5 sample drawn from official local CvTE exam PDFs. It is evidence/checker work only. It is not MTU-H6 closure, product-route readiness, diagnostics, PV, lesson output, mastery, sequencing, summative use, or student/product authority.

## Summary

- Records reviewed: 7
- Passed records: 5
- Review-required records: 2
- Failed records: 0
- Rendered official evidence records: 13
- Negative fixtures: 2, both failed as expected

## Record Outcomes

| Record | Outcome | Classification | Notes |
|---|---:|---|---|
| `vw-1022-a-24-1-o:opgave-1:question-3` | passed | generalized_pass | CO2 market-equilibrium reduction maps to `H06`, `A06`, `A27`, `A41`, `A88`, `A81`, `A96`; stale `A15` is forbidden. |
| `vw-1022-a-24-1-o:opgave-1:question-4` | review_required | fixture_evidence_gap | q4 graph shading maps `A19`, `A40`, `D29`, `A81`, but graph-shading/arceer answer-form authority is not approved in this bundle. |
| `vw-1022-a-24-1-o:opgave-1:question-6` | passed | generalized_pass | Cross-elasticity reasoning maps to `A16`, `D12`, `A81`, `A98`. |
| `ha-1022-a-23-2-o:opgave-2:question-10` | passed | generalized_pass | Air-tax incidence/pass-through maps to `A06`, `D05`, `D07`, `A81`, `A96`. |
| `ha-1022-a-23-1-o:opgave-5:question-22` | passed | generalized_pass | Prisoner-dilemma reasoning maps to `F03`, `F09`, `F12`, `A81`, `A97`. |
| `vw-1022-a-23-2-o:opgave-5:question-23` | review_required | operation_registry_governance_need | q23 macro graph drawing maps `I07`, `I08`, `A42`, `A81`, but the macro teken answer-form/equivalent remains unapproved. |
| `vw-1022-a-24-2-o:opgave-4:question-18` | passed | generalized_pass | Armington-context calculation maps to `A07`, `A12`, `A91`, `A81`, `A96`; stale `A15`, `H03`, and broad `A20` are forbidden. |

## Review-Required Items

1. q4 graph shading: approve a graph-shading/arceer answer-form MTU or reviewed equivalent, or keep the item review-required.
2. q23 macro graph drawing: approve whether `A42` is sufficient answer-form evidence for macro multi-curve drawing, or require a separate teken answer-form MTU/equivalent.

## Negative Regression Fixtures

- `h6-negative-q18-stale-a15-elasticity-overtrigger`: reintroduces the original Solo/H5 stale-elasticity over-trigger class and must fail with `over_triggered_prerequisite_not_required_by_answer_model`.
- `h6-negative-q10-incidence-unmapped`: removes incidence/pass-through MTUs and must fail with `missing_mtu_for_correction_model_operation`.

## Validation

Run:

```bash
node build-scripts/references/check-mtu-h6-cross-exam-generalization-and-evidence-integrity-bundle-1.js
```

The expected status is `review_required`, not `passed`, because q4 graph shading and q23 macro graph drawing still require human/evidence decisions.
