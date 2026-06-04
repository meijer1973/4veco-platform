# SHARED-TASK-INGEST-PLAYABLE-REPAIR-1 Command Log

Generated: 2026-06-04

## Successful Commands

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md` -> exit_code 0.
- `node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-1 --active` -> exit_code 0.
- `node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js` -> exit_code 0.
- `node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js` -> exit_code 0.
- `node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js` -> exit_code 0.
- `node build-scripts/sprints/check-task-ingest-transform3-textbook.js` -> exit_code 0.
- `node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js` -> exit_code 0 after source-chain label repair.
- `node build-scripts/sprints/check-task-ingest-transform3-textbook.js` -> exit_code 0 after EUR 1.50 prompt repair.
- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-plan.md` -> exit_code 0 after implementation.
- `node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-1 --active` -> exit_code 0 after implementation.
- `node build-scripts/reports/validate-report-json.js` -> exit_code 0.
- `npm.cmd run check:scope-language` -> exit_code 0.
- `npm.cmd run check:platform` -> exit_code 0; output includes pre-existing fixture/report warnings while active Jest suites passed.
- `node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js` -> exit_code 0.
- `node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-1` -> exit_code 0.
- `git diff --check` -> exit_code 0.
- `npm.cmd run agent:index` -> exit_code 0.
- `node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review` -> exit_code 0.
- `node build-scripts/sprints/emit-url-index.js` -> exit_code 0.
- `npm.cmd run dashboard:internal` -> exit_code 0.
- `node build-scripts/sprints/emit-url-index.js --check` -> exit_code 0.
- `node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js` -> exit_code 0 after map/index refresh.
- `node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-1` -> exit_code 0 after map/index refresh.

## Notes

The command-log JSONL is `reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-1-command-log.jsonl`.
