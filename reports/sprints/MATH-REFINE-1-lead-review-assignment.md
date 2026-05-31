# Sprint MATH-REFINE-1: Lead Review Assignment

Generated: 2026-05-31

## Scope

Assign a structural lead-review cycle for `MATH-REFINE-1` before sprint
closure.

The lead reviewer must inspect the sprint artifacts as planning/preparation
evidence only. The review must not authorize implementation, generated
lesson output, source exit-ticket creation, protected reference mutation,
target-exercise field writes, target-equivalent completion language,
diagnostics, adaptive routing, mastery, sequencing, summative use, PV, Scale
Gate 1, or student/product use.

## Reviewer

Lead reviewer: lead-reviewer agent.

The lead reviewer should behave as an independent quality reviewer, not as a
bookkeeping step. The reviewer must verify the sprint against product
specifications, GATE-ENGINE-1 authority, GAME-ARCH-2 architecture, MATH-UX-2
evidence, target-operation coverage, and closure validators.

## Evidence To Inspect

- `reports/sprints/MATH-REFINE-1-plan.md`
- `reports/sprints/MATH-REFINE-1-baseline.md`
- `reports/sprints/MATH-REFINE-1-planning-review.md`
- `reports/sprints/MATH-REFINE-1-operation-chain-plan.md`
- `reports/sprints/MATH-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/MATH-REFINE-1-implementation-prep.md`
- `reports/sprints/MATH-REFINE-1-gate-handoff.md`
- `references/data/sprints/MATH-REFINE-1.plan.json`
- `build-scripts/sprints/check-math-refine1-evidence.js`
- `reports/review-gates/GATE-ENGINE-1-four-engine-operational-integration/gate-closure.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-checkpoint-calculation-task-fixture.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`

## Review Questions

1. Does the sprint correctly map the `1.1.2` target exercise to A38/A39/D31
   operations without treating A39 pitfall text as D31 proof?
2. Does the coverage matrix honestly distinguish current local practice from
   target-equivalent proof?
3. Is the implementation-prep route concrete enough for a future authorized
   sprint while staying inside planning-only authority?
4. Does the gate handoff preserve the advisory short-check and
   target-equivalent exit-ticket boundary?
5. Do the deterministic validators catch the D31/subquestion `d` gap and
   prohibited authority language?
6. Are there any blockers, flags, or missing proof requirements before sprint
   closure?

## Required Output

Round 1 must produce a lead-review report with PASS, PASS WITH FLAGS, REVISE,
FAIL, or PAUSE. If it returns REVISE/FAIL/PAUSE, the main agent must repair or
pause before round 2.

Round 2 must recheck any corrections and provide the final lead-review verdict
used by sprint result metadata.
