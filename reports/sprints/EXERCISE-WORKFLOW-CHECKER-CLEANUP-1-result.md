# Sprint EXERCISE-WORKFLOW-CHECKER-CLEANUP-1: Result

Generated: 2026-06-29

## Plan reference

Plan: `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan.md`

Baseline: `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-baseline.md`

## Summary

Completed a bounded checker/evidence cleanup for the current split
exit-ticket source model. Live validators now read the suffixed
`*-korte-check` and `*-exit-ticket` files, active report JSON no longer cites
missing unsuffixed files as current evidence, and the L1.7B-Q2 review-packet
checker verifies that required evidence paths exist.

The sprint did not edit exercise source data, generated lesson output,
engines, protected references, target-exercise registry data, candidate
storage, product authority, or student-facing behavior.

## Acceptance test results

The sprint command log records successful acceptance and closure commands in
`reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-command-log.jsonl`.

Passed focused checks:

- `node build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `node build-scripts/sprints/check-standard-exercises1-coverage.js`
- `node build-scripts/sprints/check-task-shell-ux2.js`
- `node build-scripts/sprints/check-l1-7b-q2-implementation.js`
- `node build-scripts/sprints/check-l1-7b-q2-copy.js`
- `node build-scripts/sprints/check-l1-7b-q2-d31-struct.js`
- `node build-scripts/sprints/check-check-short-exit1-inventory.js`
- `node build-scripts/sprints/check-math-ux2-route-output.js`
- `node build-scripts/sprints/check-reason-ux2-route-output.js`
- `node build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js`

Passed platform/report hygiene:

- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `npm.cmd run check:scope-language`
- `npm.cmd run check:platform`
- `git diff --check`
- `git -C ../4veco-lessen diff --check`

`npm.cmd run check:platform` required refreshing local `node_modules` with
`npm.cmd ci` because declared dependencies `jsdom` and `jszip` were absent
from the working copy. No package or lockfile changes were produced.

## Changed files

Checker and validation scripts:

- `build-scripts/sprints/check-standard-exercises1-coverage.js`
- `build-scripts/sprints/check-task-shell-ux2.js`
- `build-scripts/sprints/check-l1-7b-q2-implementation.js`
- `build-scripts/sprints/check-l1-7b-q2-copy.js`
- `build-scripts/sprints/check-l1-7b-q2-d31-struct.js`
- `build-scripts/sprints/check-check-short-exit1-inventory.js`
- `build-scripts/sprints/check-math-ux2-route-output.js`
- `build-scripts/sprints/check-reason-ux2-route-output.js`
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js`
- `build-scripts/review-gates/check-gate-l1-7b-q2-review-packet.js`

Active evidence and records:

- `reports/json/standard-exercise-family-coverage.json`
- `reports/json/check-short-exit-inventory.json`
- `reports/json/procedure-visual-inventory.json`
- `references/data/procedure-visual/inventory.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/review-packet.md`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/live-output-evidence.json`
- `reports/review-gates/GATE-L1.7B-Q2-exit-ticket-target-equivalent-proof/live-output-evidence.md`

Sprint governance artifacts:

- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-baseline.md`
- `references/data/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1.plan.json`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-command-log.jsonl`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-command-log.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-quality-log.md`
- `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-diff-summary.md`
- `references/reference-team-roadmap.md`

## Data integrity notes

No protected reference data was changed. The cleanup sweep also checks
`references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` for local
changes and fails if they are touched.

No `source-data/book-1/exit-ticket/*.json` files changed. No generated Book 1
lesson output changed; `git -C ../4veco-lessen diff --check` passed.

## Open follow-ups

- Reusable DOCX template dependency cleanup remains a named follow-up outside
  this sprint. This sprint only records the issue; it does not migrate template
  builders.
- Historical sprint markdown that refers to old unsuffixed files remains
  archival unless active tooling consumes it as current evidence.
- The PR still requires the PR Readiness Reviewer and human review before
  merge because it changes validation and review-evidence behavior.

## Rollback instructions

Before merge, abandon this branch or revert the branch commit. After merge,
revert the PR. No lesson-regeneration, source-data restoration, or engine
rollback should be required because the sprint only changes validators, active
evidence records, and sprint documentation.
