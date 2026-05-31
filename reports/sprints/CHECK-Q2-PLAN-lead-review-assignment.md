# CHECK-Q2-PLAN Lead Review Assignment

Generated: 2026-05-31

Sprint: `CHECK-Q2-PLAN`

## Scope

Review the CHECK-Q2-PLAN planning artifacts before sprint closure.

Evidence to inspect:

- `reports/sprints/CHECK-Q2-PLAN-plan.md`
- `reports/sprints/CHECK-Q2-PLAN-baseline.md`
- `reports/sprints/CHECK-Q2-PLAN-planning-review.md`
- `reports/sprints/CHECK-Q2-PLAN-short-check-boundary.md`
- `reports/sprints/CHECK-Q2-PLAN-operation-chain-coverage.md`
- `reports/sprints/CHECK-Q2-PLAN-target-equivalent-design-plan.md`
- `reports/sprints/CHECK-Q2-PLAN-implementation-prep.md`
- `reports/sprints/CHECK-Q2-PLAN-gate-handoff.md`
- `references/data/sprints/CHECK-Q2-PLAN.plan.json`
- `build-scripts/sprints/check-check-q2-plan-evidence.js`

Read-only context:

- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md`
- `reports/sprints/GRAPH-REFINE-1-gate-handoff.md`
- `reports/sprints/MATH-REFINE-1-gate-handoff.md`
- `reports/sprints/REASON-REFINE-1-gate-handoff.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Planning contract review | lead reviewer | Plan and metadata preserve scope and authority | assigned |
| Learning quality review | lead reviewer | Target-equivalent design is stronger than advisory short check | assigned |
| Student experience review | lead reviewer | Short-check and proof surfaces cannot be confused | assigned |
| Test evidence review | lead reviewer plus checker | Deterministic checker catches omitted blockers and scope leaks | assigned |
| Ownership and handoff review | lead reviewer | `L1.7B-Q2` and `GATE-L1.7B-Q2` receive concrete next work | assigned |

## Review Questions

1. Does the sprint preserve the advisory short check while keeping it separate
   from target-equivalent proof?
2. Does the coverage artifact correctly state that no current `1.1.1`,
   `1.1.2`, or `1.1.3` output is ready for proof use?
3. Are the A43, D31, graph-axis, A81, A98/held-evaluation, generator-blocked,
   and held-lane flags visible enough?
4. Does the implementation-prep record give a future implementer concrete
   data, UI, state, feedback, validation, live-output, and review
   requirements?
5. Does the checker fail on protected/source/generated-output diffs and on
   omitted semantic blockers?
6. Is any core-specification failure being carried as an ordinary flag?

## Required Output

Lead review round 1 must return one verdict:

- PASS;
- PASS WITH FLAGS;
- REVISE;
- FAIL;
- PAUSE.

If the verdict is not PASS, the main agent must write a correction log and run
round 2 recheck before closure.

## Authority Boundary

The lead review may not authorize implementation, generated lesson output,
source exit-ticket data writes, protected reference mutation, target-exercise
field writes, candidate storage, target-equivalent completion language,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.
