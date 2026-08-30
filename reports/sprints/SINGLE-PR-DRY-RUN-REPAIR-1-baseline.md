# Sprint SINGLE-PR-DRY-RUN-REPAIR-1: Baseline

Date: 2026-08-30
Sprint: `SINGLE-PR-DRY-RUN-REPAIR-1`

## Plan reference

`reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md`

## Exact repository state

- Platform `main`: `e6103d3127780d59b36410c2dbccf86314b10dd1`
- Lesson `main`: `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- Observed integration: Platform PR #217, merged and fully green

## Observed defect

Plain single-PR `--dry-run` fabricates a merged PR whose merge commit is the
unmerged PR head. It then performs live-only containment verification against
unchanged `main`, so an ordinary ahead PR returns
`merge_not_contained_in_main`. The dry run has no real merge commit to observe.

The combined `--dry-run --no-merge` invocation exits after final pre-merge
checks. Its default status and readiness helpers are non-mutating in dry-run
mode, so it safely validated PR #217, but the behavior is not the documented
canonical contract and lacks end-to-end equivalence coverage.

## Preserved state

- PR #217 is complete, safe, closed, and outside this repair payload.
- The live single-PR merge path and the coordinated-bundle runner must remain
  unchanged.
- No workflow, Lesson, product, engine, source-data, rendered, Y1,
  protected-reference, branch-protection, authorization, or downstream
  authority change is needed.

## Data integrity notes

No protected reference data changes are authorized or required. In particular,
`references/machine/`, `references/external/`, Lesson source, generated lesson
output, product data, engine data, rendered evidence and Y1 evidence remain
unchanged.

## Required outcome

One separately reviewed governance PR must make plain `--dry-run` stop before
merge simulation, report non-executed post-merge phases, prove zero mutation,
handle behind/movement states explicitly, retain combined-flag equivalence,
and preserve live integration behavior. It must remain unmerged pending owner
review.
