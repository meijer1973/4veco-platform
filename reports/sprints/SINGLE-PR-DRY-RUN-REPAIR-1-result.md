# Sprint SINGLE-PR-DRY-RUN-REPAIR-1: Result

Generated: 2026-08-30

## Plan reference

`reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md`

## Summary

Plain single-PR `--dry-run` is now the canonical read-only pre-merge
validation mode. A current, ready head returns `validated_dry_run` after all
available live-state, branch-protection, review-thread, lineage, exact-head CI,
readiness and immediate movement checks. It reports every mutation, merge and
post-merge operation as `not_executed` instead of fabricating a merge.

A stable behind head returns the exact trusted update it would require without
updating, polling or claiming refreshed-head validation. Main/head movement and
missing exact-head CI fail closed in one attempt with retry advice only. The
temporary `--dry-run --no-merge` form remains result-equivalent. All existing
live-lane tests remain green.

The shared-lane classifier also recognizes exactly the two canonical internal
dashboard closure outputs required by `AGENTS.md`; close-path HTML and JSON
files remain companion or unknown and fail closed.

Corrected substantive payload:
`7cf18780dcbeaa66c3b63febe1ee7265cfbc7cb2`.

## Acceptance test results

| Check | Result |
| --- | --- |
| Canonical sprint plan | PASS |
| Focused single-PR integrator | PASS: 1 suite, 44 tests |
| Complete integration lane | PASS: 10 suites, 239 tests |
| Focused shared-lane classifier | PASS: 1 suite, 23 tests |
| Live branch-protection contract | PASS |
| Shared paragraph-lane scope | PASS |
| Full Platform suite against Lesson `f09fd6e8...` | PASS: 105 suites and 1,579 tests; 6 suites and 8 tests skipped |
| Deterministic roadmap dashboard refresh | PASS |
| Independent structural lead review | PASS in both rounds; renewed PASS after exact-path correction |
| JavaScript syntax and diff hygiene | PASS |
| Complete sprint, packet, URL and index freshness | PASS before terminal publication |

Command evidence is recorded in
`reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-command-log.jsonl`.

## Changed files

The exact implementation and evidence inventory is recorded in
`reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-diff-summary.md` and
`reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/review-packet.json`.

No Lesson repository file changed.

## Data integrity notes

No protected reference data changed. No `references/machine/`,
`references/external/`, product, engine, source-data, rendered-output, Y1,
workflow-definition, authorization-schema or bundle-runner path changed. The
roadmap mutation is limited to the authority-negative sprint ledger row.

## Open follow-ups

- Exact-head hosted Platform CI and exact-head PR readiness must bind the
  immutable terminal PR head before owner review.
- Explicit owner payload authorization remains required before integration.
- Until this repair is merged, single-PR preflight should continue using the
  implementation-supported `--dry-run --no-merge` form.

## Rollback instructions

Before merge, close PR #220 and delete only its isolated branch. After a later
authorized merge, revert the repair merge commit through a separate reviewed
PR. Do not rewrite shared history or use administrative bypass.
