# Sprint SINGLE-PR-DRY-RUN-REPAIR-1: Canonical Single-PR Dry Run

## Goal

Make plain `integrate:authorized-pr -- --dry-run` the canonical read-only
single-PR pre-merge validation mode. It must stop before every merge and
post-merge operation, report what was and was not evaluated, and leave the
live integration lane unchanged. Return one open, unmerged governance PR for
human review.

## Context

During the authorized integration of PR #217, plain `--dry-run` completed its
pre-merge checks and then fabricated a merged PR whose merge commit was the
unmerged PR head. It compared that synthetic commit with unchanged `main` and
failed with `merge_not_contained_in_main`. The implementation-supported
`--dry-run --no-merge` combination correctly stopped before that impossible
simulation and made no external mutation.

This repair belongs only to the single-PR integration runner. It does not
change the coordinated-bundle runner or reopen any completed PR.

Exact-head hosted run `33307624508` later exposed a Windows checkout-byte
portability defect in five text artifacts whose raw bytes the existing Y1
guard hashes. The bounded closure pins and scans those five exact paths as LF;
it does not alter any Y1 checker, test, evidence, authority, or product blob.

## Quality Standard

The specification quality floor is a fail-closed, auditable dry run that executes every check
possible against the observed current head, performs zero status, comment,
branch-update, dispatch, merge, merge-observation, containment, or post-merge
CI operation, and clearly distinguishes a merge-ready current head from a
behind head that would require trusted synchronization. Passing unit tests
alone is insufficient: focused full-lane regressions, the complete integration
suite, the full platform suite, exact-head CI, independent structural lead
review, and exact-head readiness are required proof. Rendered output and every
student-facing surface must remain byte-unchanged. Any improvement outside this
contract is a named follow-up rather than hidden scope expansion.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
| --- | --- | --- | --- |
| Plain dry run is canonical | A dedicated `validated_dry_run` return occurs after final pre-merge checks and before live/no-merge branching | Clean-ahead full-lane regression and lead review | planned |
| No invented post-merge state | Result explicitly marks merge invocation, observation, containment, and post-merge CI `not_executed` | Negative assertions against every fallible/mutating dependency | planned |
| No dry-run mutation | Dry-run status writes are suppressed; readiness remains in-memory; branch update and merge helpers are not invoked | Zero-status/comment/update/dispatch/merge test assertions | planned |
| Behind PRs are explicit | A behind head returns a successful dry-run report with `would_update_branch`, without update or retry | Behind/would-update regression | planned |
| Movement fails safely | Main/head movement retains the existing retry classifications without mutation | Main/head movement regressions | planned |
| Temporary flags are equivalent | `--dry-run` and `--dry-run --no-merge` return the same canonical phase and operation report | Equivalence regression | planned |
| Live lane is unchanged | Live current and live behind/update flows still merge and verify post-merge CI exactly as before | Existing and strengthened live regressions | planned |
| Raw-byte evidence is checkout-stable | Five exact Y1 renewal text paths are pinned and scanned as LF by the general CI evidence-line-ending gate | Windows hash reproduction, focused CI/Y1 regression, and hosted CI | planned |

The successful result contract is machine-checkable. It has top-level
`phase: validated_dry_run`, `retry_required: false`, and a `dry_run` object
with `checks_evaluated`, `would_update_branch`, and the following exact
operation states: `status_publication`, `comment_publication`,
`readiness_publication`, `branch_update`, `retry_polling`, `ci_dispatch`,
`merge_invocation`, `merge_observation`, `containment`, and `post_merge_ci`.
Every operation state is `not_executed`. A behind result additionally records
`refreshed_head_checks: not_executed_requires_branch_update` and reasons that
exact refreshed-head CI, readiness, and final pre-merge validation cannot be
evaluated until the trusted live lane creates and observes that head. A current
head records `refreshed_head_checks: not_applicable`.

## Quality Improvement Candidates

- `include_now`: one explicit dry-run result contract, no synthetic merge
  objects, behind-head would-update reporting, and direct mutation-absence
  assertions.
- `defer_named_follow_up`: broader integration telemetry unrelated to dry-run
  correctness.
- `reject_scope_creep`: bundle-runner changes, workflow definitions, Lesson,
  product, Y1, protected-reference, branch-protection, authorization-model, or
  merge changes.

## Allowed paths

- `build-scripts/review-gates/integrate-authorized-pr.js`
- `build-scripts/review-gates/integrate-authorized-pr.test.js`
- `.gitattributes`, limited to five exact raw-byte-hashed Y1 renewal text paths
- `build-scripts/ci/check-evidence-line-endings.js`
- `build-scripts/ci/check-evidence-line-endings.test.js`
- `build-scripts/workflows/check-paragraph-lane-scope.js`
- `build-scripts/workflows/check-paragraph-lane-scope.test.js`
- `docs/review/pr-integration-lane-policy.md`
- `reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-*`
- `references/data/sprints/SINGLE-PR-DRY-RUN-REPAIR-1*`
- `references/reference-team-roadmap.md` for sprint registration only
- `reports/review-gates/GATE-SINGLE-PR-DRY-RUN-REPAIR-1/*`
- canonical URL and four GitHub-agent indexes only when required by their
  deterministic generators
- `reports/internal-dashboard/index.html` and
  `reports/internal-dashboard/dashboard-data.json` only as the deterministic
  roadmap-state refresh required by `AGENTS.md`

## Forbidden paths

- `.github/workflows/*`
- `build-scripts/review-gates/integrate-authorized-bundle.js` and its tests
- all Lesson repository paths
- product, engine, source-data, rendered-output, or Y1 evidence paths
- protected `references/machine/` and `references/external/` paths
- branch-protection, authorization-schema, rollout, diagnostics, mastery,
  sequencing, PV, or student-use authority surfaces

## Inputs

- Platform base/main: `e6103d3127780d59b36410c2dbccf86314b10dd1`
- Lesson main: `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- The observed PR #217 false-negative and successful combined-flag workaround
- Existing authorization, lineage, readiness, branch-protection, movement,
  branch-update, merge, and post-merge CI contracts

## Outputs

- Canonical plain dry-run behavior with phase `validated_dry_run`
- Explicit non-execution report for merge and post-merge phases
- Behind-head `would_update_branch` report without mutation or retry
- Full-lane positive, negative, equivalence, movement, and live regressions
- Narrow policy and CLI guidance
- Exact shared-lane classification for only the two canonical internal-dashboard
  outputs required by roadmap-state closure
- Exact LF checkout and scan coverage for the five byte-hashed Y1 renewal text
  artifacts, with the sealed Y1 checker/test/evidence payload unchanged
- Sprint evidence, structural lead review, exact-head CI, readiness, and one
  open, unmerged PR for owner review

## Operationalized sprint procedure

1. Lock the exact Platform and Lesson bases, run governance freshness with the
   intentional policy-edit allowance, and stop on unexpected movement or scope
   collision.
2. Validate this plan and obtain an independent planning review before code
   mutation.
3. Add one dry-run reporting contract. For a current head, return only after
   final live-state, CI, review-thread, lineage, branch-protection, readiness,
   and immediate pre-merge movement checks pass. Mark merge invocation,
   observation, containment, and post-merge CI as not executed.
4. For a behind head, re-fetch both `main` and the PR head immediately before
   returning. Stale coordinates keep the existing main/head movement phase but
   fail the dry run without retry polling or mutation. Stable coordinates do
   not call the update helper and do not enter retry polling. Return
   `validated_dry_run` with `retry_required: false`,
   `would_update_branch: true`, the exact observed head/main/compare
   coordinates, and `refreshed_head_checks:
   not_executed_requires_branch_update` with explicit reasons naming exact
   refreshed-head CI, readiness, and final pre-merge validation.
5. Suppress status mutations in dry run while preserving identical failure
   classifications for authorization, branch protection, review state,
   lineage, CI, readiness, and observed head/main movement. Keep readiness
   generation in-memory.
6. For current heads, retain both immediate pre-merge main/head movement
   checks. A moved coordinate keeps its existing movement phase, fails without
   dry-run retry polling, and performs zero mutation.
7. Ensure combined `--dry-run --no-merge` takes the same canonical path and
   compare the complete result contract, not only the phase. Keep live
   `--no-merge` and live merge behavior unchanged.
8. Add full-lane regressions for clean ahead, behind, head/main movement in
   both current-head and would-update paths, mutation absence, complete flag
   equivalence, and live current/update paths. Directly assert zero status and
   readiness-comment publication, branch update, retry polling, CI dispatch,
   merge invocation, merge observation, containment, and post-merge CI calls.
9. Run focused dry-run, CI line-ending/Y1 and scope tests, the complete
   integration lane, the full platform suite, shared-lane scope, diff hygiene,
   sprint validators, and freshness checks.
10. Complete independent structural lead-review round 1, correction logging,
   and round-2 exact-substantive-head recheck. Freeze the substantive head
   before generated evidence/index closure.
11. Push the terminal head, obtain exact-head hosted CI and readiness, and
    return the PR open and unmerged for explicit human authorization.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/SINGLE-PR-DRY-RUN-REPAIR-1-plan.md
npm.cmd test -- --runInBand build-scripts/review-gates/integrate-authorized-pr.test.js
npm.cmd test -- --runInBand build-scripts/ci/check-evidence-line-endings.test.js build-scripts/sprints/check-y1-golden-rollout-wave-1.test.js
npm.cmd run check:integration-lane
npm.cmd test -- --runInBand build-scripts/workflows/check-paragraph-lane-scope.test.js
npm.cmd run check:branch-protection
npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
npm.cmd run check:platform
npm.cmd run dashboard:internal
node build-scripts/sprints/check-lead-review-substance.js SINGLE-PR-DRY-RUN-REPAIR-1
node build-scripts/sprints/check-sprint-bundle.js SINGLE-PR-DRY-RUN-REPAIR-1 --complete
npm.cmd run finalization:freshness
git diff --check
```

## Proof Required to Close

The proof required to close this sprint is: the focused dry-run matrix and all
existing live tests green;
the complete integration and platform suites green; no forbidden path change;
an independent structural review concluding PASS or PASS WITH FLAGS at the
frozen substantive head; exact-head hosted `platform-ci / validate-platform`
against Lesson `f09fd6e8...`; exact-head readiness; clean worktree; and an open,
unmerged PR.

## Rollback plan

Before merge, abandon or revert only this isolated branch. After a later
authorized merge, revert the repair merge commit through a separate reviewed
PR. Do not rewrite shared history or bypass protected integration.

## Human review required

Yes. This changes trusted single-PR merge governance. Planning and structural
review do not authorize merge. The terminal PR must return for explicit owner
payload authorization.
