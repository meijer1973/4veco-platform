# AGENT-DOC-GOVERNANCE-CLEANUP-20260630 Result

Status: refreshed on 2026-07-01 after the live PRs became stale against current
`main`; ready for renewed bundle compatibility, PR readiness, and human review
only after GitHub reports the controller PR as mergeable/CLEAN.

## 2026-07-01 Refresh Result

- Platform branch refreshed from current platform `main`
  `2eaf4d5f1460abbc6dd81bb7adf915174cb23d40`.
- Lesson branch refreshed from current lesson `main`
  `43a6d921bda67a5593d2f0dcc0a89a44a99d42b5`.
- Lesson `AGENTS.md` remains the only lesson source change, limited to the four
  sibling-repo path corrections.
- Platform generated GitHub agent indexes were regenerated after the refreshed
  platform and lesson heads.
- Local validation passed after the refresh:
  `finalization:freshness`, `check:pptx-skill-mirror`,
  `check:active-governance-wording`, focused Jest coverage with 14 passing
  tests, `git diff --check` in both repos, and `check:branch-protection`.

## 2026-07-01 Partial Integration Recovery

- Human authorization was granted for platform head
  `d43f00d630ec388b2cfd2e3cfd8ff930a3d5095c` and lesson head
  `639448b1601d981fcfc41b29d0c88db3f53cd7ac`.
- The authorized bundle lane merged lesson PR #42 first as instructed; lesson
  `main` now contains merge commit `ba08b9c2e033a877c0d1b57952055ce697912a22`.
- The lane stopped before merging platform PR #187 because platform `main`
  advanced concurrently and cancelled the intermediate platform CI run.
- Platform PR #187 was refreshed from platform `main`
  `aa824cb50bea6735f9c86a344389ae6528f9b1de`; the platform head changed after
  the exact-head authorization, so renewed readiness and human authorization are
  required before platform merge.

## Findings Addressed

- Finding 1: verified fixed on platform `origin/main`; platform `AGENTS.md` uses canonical AGENTS wording and no active `../CLAUDE.md` read-first dependency.
- Finding 2: verified fixed on platform `origin/main`; active platform `AGENTS.md` and `build-scripts/README.md` use relative build-doc links rather than absolute `C:\Projects\4veco\4veco-platform\BUILD-*` links.
- Finding 3: fixed in `4veco-lessen/AGENTS.md`; the initial platform reference block now uses `../4veco-platform/...`, matching the sibling-repo layout.
- Finding 8: verified fixed on platform `origin/main`; `.claude/commands` is absent from tracked and present files, and the retired mirror guard/checker tests pass.

## Changed Files

Platform:

- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan.md`
- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-lead-review-round1.md`
- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-corrections.md`
- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-plan-lead-review-round2.md`
- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-test-evidence.md`
- `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-result.md`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`

Lesson:

- `AGENTS.md`

## Verification Summary

- Platform stale-link and retired-surface checks passed.
- Lesson platform-link existence checks passed.
- `npm.cmd run check:pptx-skill-mirror` passed.
- `npm.cmd run check:active-governance-wording` passed.
- `npx.cmd jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand` passed: 2 suites, 13 tests.
- `git diff --check` passed in both repositories.
- `npm.cmd run finalization:freshness` passed for platform policy files after syncing to `origin/main` `4df6dde58d18ffbc05412cc6a3ef8c7e559b44c3`.
- `npm.cmd run check:branch-protection` passed for platform `main`.

Detailed command evidence is in `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-test-evidence.md`.

## PR Shape

Because platform evidence files and generated agent indexes are committed alongside the lesson AGENTS fix, publish a paired platform/lesson PR bundle with bundle id `AGENT-DOC-GOVERNANCE-CLEANUP-20260630`. The platform PR is the controller/evidence PR; the lesson PR carries the lesson AGENTS source fix.
