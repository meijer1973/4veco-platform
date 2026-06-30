# AGENT-DOC-GOVERNANCE-CLEANUP-20260630 Result

Status: ready for completed-work lead review.

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
- `npx.cmd jest build-scripts/sprints/check-pptx-skill-mirror.test.js build-scripts/review-gates/check-active-governance-wording.test.js --runInBand` passed: 2 suites, 12 tests.
- `git diff --check` passed in both repositories.
- `npm.cmd run finalization:freshness` passed for platform policy files.

Detailed command evidence is in `reports/sprints/AGENT-DOC-GOVERNANCE-CLEANUP-20260630-test-evidence.md`.

## PR Shape

Because platform evidence files and generated agent indexes are committed alongside the lesson AGENTS fix, publish a paired platform/lesson PR bundle with bundle id `AGENT-DOC-GOVERNANCE-CLEANUP-20260630`. The platform PR is the controller/evidence PR; the lesson PR carries the lesson AGENTS source fix.
