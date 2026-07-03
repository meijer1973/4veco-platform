# Sprint EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1: Result

Generated: 2026-07-01

## Plan reference

Plan: `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md`

Baseline: `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-baseline.md`

## Summary

Completed a bounded exercise authority-hygiene bundle. The new manifest and
checker make the current `1.1.3-exit-ticket` exemplar authority, Golden fixture
disposition, and `knowledge/exit-ticket-game-1.1.1.zip` disposition
machine-readable and CI-enforced.

The sprint preserves all authority boundaries: no exercise source data,
generated lesson output, engine behavior, protected reference data,
target-exercise registry data, ZIP binary content, product route,
completion-language authority, diagnostics, mastery/sequencing, PV, Scale Gate
1, broad product use, or student/product use changed or became authorized.

## Acceptance test results

The sprint command log records successful acceptance commands in
`reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-command-log.jsonl`.

Passed implementation and platform checks:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md`
- `npm.cmd run check:exercise-authority-hygiene`
- `npm.cmd run check:exercise-workflow-currentness`
- `node build-scripts/sprints/check-sprint-bundle.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-result.md`
- `node build-scripts/sprints/check-lead-review-substance.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1`
- `node build-scripts/sprints/check-sprint-command-log.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1`
- `node build-scripts/sprints/check-sprint-bundle.js EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1 --complete`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

The full platform Jest suite passed with the repository's existing chapter QA
stderr warnings for fixture content; the process exit code was `0`.

## Changed files

Authority-hygiene policy and checker:

- `references/data/exercise-authority-hygiene-manifest.json`
- `build-scripts/sprints/check-exercise-authority-hygiene.js`
- `package.json`
- `.github/workflows/platform-ci.yml`

Historical alias note and roadmap:

- `references/exemplars/product-excellence/check-surfaces/1.1.3-exit-ticket/README.md`
- `references/reference-team-roadmap.md`

Sprint governance artifacts:

- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan.md`
- `references/data/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1.plan.json`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-baseline.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan-review-round1.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-plan-review-round2.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-quality-log.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-evidence-map.md`
- `reports/json/exercise-authority-hygiene-bundle-1-proof.json`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-command-log.jsonl`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-command-log.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-lead-review-assignment.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-lead-review-round1.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-lead-review-corrections.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-lead-review-round2.md`
- `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-diff-summary.md`
- `references/data/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1.result.json`

## Data integrity notes

No protected reference data changed. The authority-hygiene checker and diff
hygiene cover `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and the tracked ZIP
archive.

No `source-data/book-1/exit-ticket/*.json` files changed. No engine runtime
files changed. No generated Book 1 lesson output changed; lesson diff hygiene
passed in `../4veco-lessen`.

## Open follow-ups

- The PR requires PR Readiness Reviewer routing and explicit human review
  before merge because it changes governance/CI behavior.
- This sprint classifies Golden fixture duplicates but does not move or delete
  frozen report snapshots.
- This sprint records current ZIP disposition but does not rewrite old
  historical report prose that described earlier archive state.

## Rollback instructions

Before merge, abandon this branch or revert the branch commit. After merge,
revert the PR. No source-data restoration, lesson-output regeneration, engine
rollback, ZIP restoration, or product-route rollback should be required because
the sprint only changes validation/governance artifacts and metadata
annotations.
