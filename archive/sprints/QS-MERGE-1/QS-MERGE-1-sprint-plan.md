# QS-MERGE-1 Sprint Plan

Status: planning
Date: 2026-06-09
Roadmap: `docs/roadmaps/quality-standards/inspection-standards-roadmap.md`
Ledger: `docs/roadmaps/quality-standards/sprint-ledger.md`
Branch: `codex/quality-standards-20260608`
Authorising record: `archive/sprints/QS-MERGE-1/QS-MERGE-1-human-review.md`

## Purpose

QS-MERGE-1 prepares the accepted INSPECT-7 quality-standards work for review
and possible merge by updating the branch against current `origin/main`,
revalidating, and routing through a draft pull request.

This sprint is merge preparation only. It must not start INSPECT-8, INSPECT-9,
international overlays, scope scaling, dashboard integration, Scale Gate
integration, quality-ref integration, teacher inspection pack generation,
generated lesson-output mutation, personal-data processing, public-facing
claims, or compliance/approval claims.

## Starting State

After `git fetch --prune origin` on 2026-06-09:

```text
origin/main...HEAD: 12 behind / 36 ahead
origin/main: f878c78d7f1487d7ae17f1eea0a887c835a3b790
HEAD: 454dbdaa95a99127c518bb879de9ae4c6a46d435
```

## Allowed Outputs

```text
archive/sprints/QS-MERGE-1/QS-MERGE-1-human-review.md
archive/sprints/QS-MERGE-1/QS-MERGE-1-sprint-plan.md
archive/sprints/QS-MERGE-1/QS-MERGE-1-planning-review.md
archive/sprints/QS-MERGE-1/QS-MERGE-1-validation-log.md
archive/sprints/QS-MERGE-1/QS-MERGE-1-closure-log.md
docs/roadmaps/quality-standards/inspection-standards-roadmap.md
docs/roadmaps/quality-standards/sprint-ledger.md
generated reports/indexes required by roadmap or PR surfaces
conflict resolutions caused only by updating against `origin/main`
```

## Procedure

1. Confirm the worktree is clean and on `codex/quality-standards-20260608`.
2. Record the human strategic review and this sprint plan.
3. Have a planning/review agent check that the sprint is limited to merge prep.
4. Commit and push the planning packet if appropriate.
5. Merge current `origin/main` into the branch.
   - Prefer a merge commit over rebasing because the branch is already pushed
     and reviewed; avoid force-pushing this long review history.
6. Resolve conflicts without dropping accepted INSPECT-0 through INSPECT-7
   artifacts.
7. Rerun validation:
   - `npm.cmd run check:platform`;
   - `npm.cmd run agent:index`;
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
8. Open or refresh a draft PR against `main`.
9. Try to get GitHub Actions to run on the PR.
10. If Actions still do not run, record a fresh post-merge-prep CI waiver.
11. Close QS-MERGE-1 with validation evidence, PR status, known flags, and the
    next recommended action.

## Acceptance Criteria

- Branch is updated against current `origin/main`.
- Conflicts, if any, are resolved without scope drift.
- INSPECT-7 accepted artifacts and final packet still exist.
- No generated lesson-output mutation or `../4veco-lessen` edits occur.
- Local validation passes or any residual risk is recorded.
- A draft PR exists or a precise blocker is recorded.
- CI pass or fresh explicit CI waiver is recorded after merge prep.
- INSPECT-8/9 and all integration work remain unauthorised.

## Stop Conditions

Stop and record the blocker if:

- updating against `origin/main` would require dropping accepted
  quality-standards artifacts;
- conflicts require product-policy decisions beyond merge prep;
- validation fails in a way unrelated to known existing fixture warnings;
- GitHub authentication or remote access prevents PR creation;
- the worktree becomes mixed with unrelated user changes.

## Required Next Action

Have a planning/review agent check this plan. If it passes, update the branch
against `origin/main`, validate, push, and open or refresh a draft PR.
