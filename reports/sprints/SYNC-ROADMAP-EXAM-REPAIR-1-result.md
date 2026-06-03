# Sprint SYNC-ROADMAP-EXAM-REPAIR-1: Result

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-plan.md`

## Summary

Closed PASS WITH FLAGS after planning review and lead-review round 1/round 2.

This sprint synchronized the platform and lesson roadmaps after the rollback
and `SPRINT-PROTOCOL-HARDEN-2`. It corrected the lesson roadmap's
false-complete context/ingestion statuses, made `EXAM-SOURCE-AUTH-1` the next
repair sprint, replaced old active source reconstruction, task transformation,
and human gate identifiers with the actual-exam/textbook repair sequence, and
added a deterministic checker for both roadmaps.

No implementation, generated lesson output, source-data mutation, protected
reference mutation, product-route adoption, target-equivalent proof,
diagnostics, mastery/sequencing, PV, Scale Gate 1, or student/product use was
authorized by this sprint.

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js SYNC-ROADMAP-EXAM-REPAIR-1`
- `node build-scripts/sprints/check-sync-roadmap-exam-repair1.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/check-lead-review-substance.js SYNC-ROADMAP-EXAM-REPAIR-1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-result.md`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

Expected during development:

- Early plan/checker failures were corrected and retained in the command log as
  audit evidence.

## Changed files

Platform repo:

- `references/reference-team-roadmap.md`
- `build-scripts/sprints/check-sync-roadmap-exam-repair1.js`
- `references/data/sprints/SYNC-ROADMAP-EXAM-REPAIR-1.plan.json`
- `references/data/sprints/SYNC-ROADMAP-EXAM-REPAIR-1.result.json`
- `reports/sprints/SYNC-ROADMAP-EXAM-REPAIR-1-*`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-lessen.md`
- `reports/github-agent-index-lessen.json`
- `reports/url-index.md`
- `reports/internal-dashboard/index.html`
- `reports/internal-dashboard/dashboard-data.json`

Lesson repo:

- `../4veco-lessen/lessen-team-roadmap.md`

## Data integrity notes

No protected reference data changed. No files under `references/machine/` or
`references/external/` were edited.

No source data, generated Book 1 lesson output, target-exercise registry,
candidate storage, PV projection, or PV machine-promotion output changed.

## Open follow-ups

- `EXAM-SOURCE-AUTH-1` is the next authorized sprint.
- `TASK-CONTEXT-SPEC-1`, `TASK-CONTEXT-RUNTIME-1`,
  `CONTEXT-VISUAL-STD-1`, `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`,
  `TASK-INGEST-TRANSFORM-3-TEXTBOOK`, and
  `GATE-SHARED-TASK-INGEST-REPAIR-1` remain open.
- Flag from round 2: the sync checker hardens duplicate handling for named
  blocker rows, not as a global duplicate-ID policy.

## Rollback instructions

Revert this sprint's roadmap rows, checker, sprint artifacts, result JSON, and
refreshed index/dashboard outputs. If the lesson roadmap commit has already
been pushed separately, revert it with a normal follow-up commit in
`../4veco-lessen`; do not rewrite history. Do not touch `references/machine/`,
`references/external/`, source data, or generated lesson output during
rollback.
