# MTU-H6 Cross-Exam Generalization And Evidence Integrity Bundle 1

Status: `ready_for_human_review_after_more_than_satisfied_subagent_review`

Review standard: `REV-STD-1`

This is a review-candidate evidence and checker bundle, not MTU-H6 closure. It does not authorize protected-reference mutation, external-source mutation, machine-reference mutation, MTU mint/update/split/merge/deprecation, target-exercise mutation, candidate writes, lesson output, diagnostics, adaptive routing, mastery, sequencing, PV, summative use, product-route readiness, Scale Gate 1, or student/product use.

## Purpose

The bundle tests whether the MTU-H5 mapping-regression method generalizes to a fresh cross-exam sample after MTU-H5 closure. It adds a stricter evidence-reference surface around that test:

- JSON references with `#fragment` anchors must resolve.
- Rendered official prompt/correction pages are content-addressed.
- Required MTUs must be actually mapped, not merely expected.
- Forbidden MTUs and forbidden route tags are checked by negative fixtures.
- Expected review-required gaps are explicit and bounded.

## Fresh Sample

The fixture is `MTU-H6-fresh-cross-exam-vwo-havo-2023-2024-sample-001`.

It excludes the MTU-H5 sample records and uses seven non-H5 official local CvTE records:

| Record | Main route | Outcome |
|---|---|---:|
| `vw-1022-a-24-1-o:opgave-1:question-3` | CO2 market-equilibrium calculation | passed |
| `vw-1022-a-24-1-o:opgave-1:question-4` | q4 graph shading, surplus and efficiency loss | review_required |
| `vw-1022-a-24-1-o:opgave-1:question-6` | cross-elasticity reasoning | passed |
| `ha-1022-a-23-2-o:opgave-2:question-10` | tax incidence/pass-through | passed |
| `ha-1022-a-23-1-o:opgave-5:question-22` | prisoner-dilemma reasoning | passed |
| `vw-1022-a-23-2-o:opgave-5:question-23` | q23 macro graph drawing | review_required |
| `vw-1022-a-24-2-o:opgave-4:question-18` | Armington/profit-maximization calculation | passed |

## Evidence Manifest

Rendered official evidence is anchored at:

`H6_FRESH_CROSS_EXAM_RENDERED_OFFICIAL_EVIDENCE_MANIFEST`

The manifest records 13 rendered official pages. Each record includes the source PDF path, source PDF SHA-256, page number, rendered PNG path, PNG SHA-256, dimensions, and Poppler render method.

## Review-Required Items

The live report status is expected to be `review_required`, not `passed`.

1. q4 graph shading: approve a graph-shading/arceer answer-form MTU or reviewed equivalent, or keep q4 as a blocker to H6 full closure.
2. q23 macro graph drawing: approve whether `A42` is sufficient answer-form evidence for macro multi-curve drawing, or require a separate teken answer-form MTU/equivalent.

## Negative Fixtures

- `h6-negative-q18-stale-a15-elasticity-overtrigger`: reintroduces the old stale-elasticity over-trigger class and must fail.
- `h6-negative-q10-incidence-unmapped`: removes incidence/pass-through MTUs and must fail.

## Human Review Need

Human reviewers should decide whether this H6 review candidate is acceptable as an evidence-integrity/generalization packet, and separately whether the two review-required answer-form gaps should be closed, deferred, or routed into a later MTU/answer-form governance lane.

Do not treat this as a product gate. It is checker/report/evidence work only.
