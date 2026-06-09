# QS-MERGE-2 Sprint Plan

Status: planning
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
PR: `https://github.com/meijer1973/4veco-platform/pull/23`
Authorising record: `archive/sprints/QS-MERGE-2/QS-MERGE-2-human-review.md`

## Purpose

QS-MERGE-2 performs the final PR freshness update requested by human review.
It exists because `main` moved after QS-MERGE-1, making PR #23 stale and
conflicting even though content review passed.

This sprint is final PR refresh only. It must not start any new
quality-standards implementation, scale work, overlays, integration work,
lesson-output mutation, personal-data processing, public claims, or
compliance/approval claims.

## Starting State

After `git fetch --prune origin` on 2026-06-09:

```text
origin/main...HEAD: 2 behind / 39 ahead
origin/main: 2a66802329e48257ba0af190d207d52607394a1d
HEAD: 0dbbc61c55227e598d03be83ab1249877c2a9327
PR #23: draft, open, conflicting
latest previous PR CI: success for 0dbbc61c55227e598d03be83ab1249877c2a9327
```

## Allowed Outputs

```text
archive/sprints/QS-MERGE-2/QS-MERGE-2-human-review.md
archive/sprints/QS-MERGE-2/QS-MERGE-2-sprint-plan.md
archive/sprints/QS-MERGE-2/QS-MERGE-2-planning-review.md
archive/sprints/QS-MERGE-2/QS-MERGE-2-validation-log.md
archive/sprints/QS-MERGE-2/QS-MERGE-2-closure-log.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
generated reports/indexes required by merge conflict resolution or sprint docs
conflict resolutions caused only by updating against current `origin/main`
PR #23 metadata/comment/readiness/merge updates after fresh green CI
```

## Procedure

1. Confirm the worktree is clean and on `codex/quality-standards-20260608`.
2. Record the human PR review and this sprint plan.
3. Have a planning/review agent check that the sprint is limited to final PR
   refresh.
4. Merge current `origin/main` into the branch with a merge commit.
5. Resolve only actual conflicts.
   - If conflicts are limited to generated indexes/dashboard reports,
     regenerate them from the merged tree.
   - If conflicts require product-policy decisions, stop and report.
6. Rerun validation:
   - `npm.cmd run check:platform`;
   - `npm.cmd run agent:index`;
   - `npm.cmd run dashboard:internal`;
   - `node build-scripts/sprints/emit-url-index.js --check`;
   - `node build-scripts/references/check-roadmap-version-index.js`;
   - `git diff --check`;
   - `node --check build-scripts/inspection/validate-inspection-evidence.js`;
   - `node build-scripts/inspection/validate-inspection-evidence.js --input references/data/inspection-standards/fixtures/pilot-1.1-inspection-evidence.sample.json --report-only`;
   - `node --check archive/sprints/INSPECT-7/build-inspect-7-prototype.js`;
   - `node archive/sprints/INSPECT-7/build-inspect-7-prototype.js`;
   - INSPECT-7 source/output structural validation;
   - `git -C ../4veco-lessen status --short --branch`;
   - `git -C ../4veco-lessen diff --name-only`;
   - `npm.cmd run check:agent-worktree-safety -- --check --task QS-20260608 --agent codex --require-prefix codex/ --require-clean`.
7. Push the refreshed branch.
8. Verify PR #23 compare is `0 behind` and mergeable.
9. Wait for latest `platform-ci / validate-platform` on the new PR head and
   require success.
10. If fresh PR CI is green, update the PR body/comment, mark PR #23 ready for
    review, and merge through the PR path.
11. Record validation, closure, final PR state, and final merge status.

## Acceptance Criteria

- Branch is updated against current `origin/main`.
- PR #23 is no longer behind `main`.
- Conflicts, if any, are resolved without scope drift.
- Local validation passes.
- `../4veco-lessen` remains clean/read-only.
- Latest PR CI passes for the new head.
- PR #23 is marked ready, receives the final-refresh comment, and is merged
  through the normal PR path only after fresh green CI.
- INSPECT-8/9 and all integration work remain unauthorised.

## Stop Conditions

Stop and record the blocker if:

- updating against `origin/main` creates conflicts outside final-refresh scope;
- validation fails in a way unrelated to known existing fixture warnings;
- PR CI fails for the refreshed head;
- PR merge would require direct push to `main`;
- the worktree becomes mixed with unrelated user changes.

## Required Next Action

Have a planning/review agent check this plan. If it passes, refresh against
current `origin/main`, validate, push, wait for fresh CI, then mark ready,
comment, and merge PR #23 through the normal PR path.
