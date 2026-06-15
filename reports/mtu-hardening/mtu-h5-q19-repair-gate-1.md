# MTU-H5 Q19 Repair Gate 1

Created: 2026-06-12

Status: `q19_repair_gate_ready_for_human_review_no_execution_authorized`

## Scope

This packet prepares the post-q3 q19 repair gate requested after PR #51 merged
the refreshed MTU-H5 diagnostic report. It does not execute mutation.

Index artifact decision: `reports/github-agent-index-platform.*` was
regenerated so future agents can discover this q19 gate. The generated platform
index also includes pre-existing current-main inventory catch-up entries from
other merged work, including `GATE-CHECK-SURFACE-EXCELLENT-1` gate-closure
files. Those entries are not substantive scope in this q19 repair-gate PR.
`reports/github-agent-index-lessen.*` generated churn was inspected and
excluded.

The current q19 diagnostic state is:

- q19 failed: 3
- q19 review_required: 20
- q3: clean after q3 fixture execution
- q27 and q15: carried blockers

## Decision

q19 is not ready for fixture-only repair. The next gate must be a
source/graph extraction gate:

`MTU-H5-Q19-SOURCE-GRAPH-EXTRACTION-GATE-1`

The exact next gate surface should prepare:

- `reports/mtu-hardening/mtu-h5-q19-source-graph-extraction-gate-1.json`
- `reports/mtu-hardening/mtu-h5-q19-source-graph-extraction-gate-1.md`
- `build-scripts/references/check-mtu-h5-q19-source-graph-extraction-gate-1.js`
- `reports/review-gates/GATE-MTU-H5-Q19-source-graph-extraction-gate-1/review-packet.json`
- `reports/review-gates/GATE-MTU-H5-Q19-source-graph-extraction-gate-1/review-packet.md`
- `reports/review-gates/GATE-MTU-H5-Q19-source-graph-extraction-gate-1/bundle-urls.md`

This packet does not authorize that later gate to execute extraction. It only
chooses the next review surface.

## Remaining q19 Failures

The live q19 failed assertions are the three graph/draw/teken answer-form
failures:

- `q19-step-1:ASSERT-ANSWER-FORM-MISSING`
- `q19-step-2:ASSERT-ANSWER-FORM-MISSING`
- `q19-step-3:ASSERT-ANSWER-FORM-MISSING`

The review_required surface still includes:

- `q19-source-annex-gap remains blocking`
- `q19-graph-object-gap remains blocking`
- `graph/draw/teken answer-form MTU or reviewed equivalent still needed`
- `q19 chained multi-market reasoning remains operation_registry_need with D10/D13 partial support`
- `q19 third graph-shift element is now modeled but still depends on blocked graph/source reconstruction`
- A42, D10, D13, and A81 procedure semantic-fit review

## Gate Answers

1. The current failed assertions are the three q19 `ASSERT-ANSWER-FORM-MISSING`
   assertions.
2. The current review hooks are source-annex, graph-object, graph/draw/teken
   answer-form, chained reasoning, third graph-shift, and procedure review.
3. q19 cannot be repaired as fixture-only reviewed-equivalent evidence now.
4. q19 needs source-annex extraction review before fixture repair.
5. q19 needs graph-object extraction review before fixture repair.
6. q19 needs graph/draw/teken answer-form coverage or reviewed equivalent.
7. A45 must remain forbidden as primary q19 support.
8. The negative guard is a temp A45 reintroduction fixture plus the current
   answer-form and review_required surface.
9. The proposed next write surface is a source/graph extraction gate packet,
   not the H5 fixture, mapper, candidate store, protected reference, or product
   route.
10. q19 remains blocked for MTU-H5 closure and product use. q27 and q15 remain
    carried blockers.

## Negative Guard

The checker creates a temporary fixture that adds `A45` to q19 mapped MTUs and
expects q19 `ASSERT-OVER-TRIGGER` failures for q19-step-1, q19-step-2, and
q19-step-3. The real fixture is not mutated.

The fixture must also keep `full_graph_construction`, `calculus_route`, and
`function_construction` forbidden for every q19 operation.

## Proof Required Later

q19 can move toward repair only after:

- source figure and worksheet reconstruction evidence exists or limitations are
  explicitly accepted;
- graph objects expose axes, labels, curve roles, geometry or reviewed
  limitations, legend mapping, and student-action regions;
- graph/draw/teken answer-form coverage exists;
- A42, D10, D13, and A81 procedure semantic fit is accepted or routed to a
  later MTU proposal;
- A45 remains weak support only;
- q19 failed and review_required validator buckets clear only after the above
  evidence is visible.

## Boundary

No q19 fixture mutation, mapper repair, checker repair except this packet checker,
candidate storage creation, candidate writes, protected-reference mutation,
machine-reference mutation, external-source mutation, authored target-exercise
mutation, MTU minting/update/split/merge/deprecation, operation-registry
mutation, answer-skill mutation, source-annex extraction execution,
graph-object extraction execution, lesson output, PV, diagnostics, adaptive
routing, mastery, sequencing, student-facing AI, summative use, product-route
readiness claim, or student/product use is authorized.

Next state: `ready_for_human_repair_gate_review`
