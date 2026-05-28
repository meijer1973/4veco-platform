# Sprint MTU-H2G: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H2G-plan.md`

## Starting state

MTU-H2F completed the conditional Solo q1-q3 CLI execution. `A91` now exists
for the given-MK route, and `A20` remains live and held.

## Data integrity notes

Protected reference data must not change during MTU-H2G. The sprint may read
`references/machine/` and authored target-exercise records, but any later
machine-reference mutation must be authorized by a separate human gate and
executed through reference CLI commands.

## Known blockers

- Target exercise `4.1.2` uses current `A20` in a given-MK context.
- `GEN_A20` exists, so any semantic split or replacement requires generator
  impact review.
- No lesson output, target-exercise promotion, or student/product use is in
  scope.
