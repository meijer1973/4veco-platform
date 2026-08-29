# Sprint BUNDLE-LANE-CI-RELIABILITY-1: Result

Generated: 2026-08-29

## Plan reference

`reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-plan.md`

## Summary

The coordinated-bundle lane now treats exact automatic Platform `main` push CI
as the normal intermediate and final proof. A manual fallback is allowed only
after absence is observed twice, including an exact `push` recheck immediately
before dispatch. Every fallback carries validated full `y1_base_sha` and
`y1_head_sha` inputs and is bound to exact Platform/Lesson evidence.

Intermediate and final states use the same acquisition helper. Any returned
failure after a completed member merge is classified as
`merged_but_postmerge_verification_failed` while preserving the original
verification subphase, diagnostics, and completed merge records. The existing
delta-required dry-run stop remains fail-closed and is now explicit in policy.

Reviewed substantive payload:
`835e0164ad615b30b63318546fd4e8fecdb0016c`.

## Acceptance test results

| Check | Result |
| --- | --- |
| Canonical sprint plan and active bundle | PASS |
| Focused bundle integrator | PASS: 1 suite, 106 tests |
| Integration lane | PASS: 10 suites, 227 tests |
| Shared paragraph scope | PASS |
| Full Platform suite against Lesson `f09fd6e8...` | PASS: 105 suites, 1,566 tests; 6 suites and 8 tests skipped |
| Independent lead review round 2 | PASS WITH FLAGS; no substantive blocker |
| JavaScript syntax and diff hygiene | PASS |
| Complete sprint, report, URL, and index freshness | PASS before terminal publication |

Command evidence is recorded in
`reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-command-log.jsonl`.

## Changed files

The exact implementation and evidence inventory is recorded in
`reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-diff-summary.md` and the human
packet at
`reports/review-gates/GATE-BUNDLE-LANE-CI-RELIABILITY-1/review-packet.json`.

No Lesson repository file changed.

## Data integrity notes

No protected reference data changed. In particular, no `references/machine/`,
`references/external/`, product, engine, source-data, rendered-output, Y1
evidence, or workflow-definition path changed. The single roadmap mutation is a
validator-required authority-negative sprint ledger row.

## Open follow-ups

- Exact-head hosted Platform CI and the PR Readiness Reviewer record are remote
  lifecycle proof and must bind the immutable terminal PR head before owner
  review.
- Explicit owner authorization is still required before integration.
- No future coordinated bundle may use the trusted bundle lane until this
  repair is merged through the separately authorized single-PR lane.

## Rollback instructions

Before merge, close PR #217 and delete only its isolated branch. After a later
authorized merge, revert the repair merge commit through a separate reviewed PR.
Do not rewrite shared history, modify PR #208, or use an administrative bypass.
