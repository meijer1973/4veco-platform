# MTU-H5 Regression Report

Generated: 2026-06-20

Status: `passed`

Fixture: `MTU-H5-vwo-2025-ex1-ex2-approved`

Source validator:

```text
node build-scripts/references/check-mtu-h5-mapping-regression.js --fixture reports/mtu-hardening/mtu-h5-regression-fixture.json --json
```

Post-q3 evidence anchor: PR #43 merge commit `48d0fa6d4ce03dff6feeb66955909125264c06f9`
and `reports/review-gates/GATE-MTU-H5-mainline-checker-repair/review-packet.md`.

This is a non-mutating diagnostic report from the approved MTU-H5 regression
fixture. It does not authorize protected reference mutation, authored
target-exercise mutation, lesson output, PV, diagnostics, mastery, sequencing,
AI, summative use, product-route readiness, or student/product use.

## Bucket Counts

| Bucket | Count |
| --- | --- |
| passed | 1 |
| failed | 0 |
| review_required | 0 |
| blocked | 0 |

## Question And Lane Counts

| Surface | Failed | Review required | Status |
| --- | --- | --- | --- |
| q3 | 0 | 0 | clean after q3 fixture execution |
| q19 | 0 | 0 | clean_after_q19_final_resolution_reviewed_equivalent |
| q27 | 0 | 0 | clean_after_q27_step2_capacity_taxonomy_reviewed_equivalent |
| q15 | 0 | 0 | clean_after_q15_two_step_answer_skill_reviewed_equivalent |
| global negative guard | 0 | 0 | 1 passed |

## Remaining Blockers

- q3 is clean in the current post-q3 diagnostic surface: 0 failed / 0 review_required.
- q19 is clean after the final reviewed-equivalent resolution bundle: 0 failed / 0 review_required.
- q27 is clean after the q27-step-2 capacity/source-readout reviewed-equivalent repair: 0 failed / 0 review_required.
- q15 is clean after the two-step dominant-strategy/prisoner-dilemma reviewed-equivalent answer-skill repair: 0 failed / 0 review_required.
- MTU-H5 mapping-regression closure evidence is prepared for human review; Scale Gate 1, product-route readiness, diagnostics, PV, lesson output, and student/product use remain unauthorized until separately approved.

## Lane-Specific Diagnostic Meaning

| Lane | Diagnostic meaning |
| --- | --- |
| q19 | q19 direct rendered official source/correction evidence accepted by MTU-H5-Q19-FINAL-RESOLUTION-AND-CLOSURE-BUNDLE-1; A42/D10/D13/A81 preserved; A45 and forbidden route guards preserved |
| q27 | q27-step-1 D41/D05/A88 reviewed equivalent and q27-step-2 capacity/source-readout reviewed equivalent accepted; no D07/D08 closure claim |
| q15 | EX_ANS_TWO_STEP_DOMINANT_STRATEGY_PD_EXPLANATION accepted as reviewed-equivalent answer-skill; D27/F03/F09 remain content support and A97 remains answer-form/procedure support |

## Failed Defect Classes

| Defect class | Count |
| --- | --- |

## Review-Required Classes

| Class or hook group | Count |
| --- | --- |
| `fixture_review_hooks` | 0 |

## Procedure Statuses

| Procedure status | Count |
| --- | --- |
| `procedure_present` | 21 |

The procedure output distinguishes `procedure_present`, `procedure_missing`,
and `procedure_review_required`. This run produced no blocked assertions.

## Negative Fixture

The negative fixture passed by failing as expected for the
`function_construction_route_triggered_when_point_calculation_enough` defect
class.

## Boundary

No protected reference mutation authorized. No external-source mutation
authorized. No machine-reference mutation authorized. No authored
target-exercise mutation authorized. No MTU minting, update, split, merge, or
deprecation authorized. No candidate storage or candidate writes authorized.
No lesson output, PV, diagnostics, product-route readiness, or student/product
use authorized.
