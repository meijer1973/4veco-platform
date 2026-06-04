# SHARED-TASK-INGEST-PLAYABLE-REPAIR-2 Command Log

Generated: 2026-06-04

## Successful Commands

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-plan.md` -> exit_code 0.
- `node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js` -> exit_code 0.
- `node build-scripts/sprints/capture-task-ingest-transform3-textbook-screenshots.js` -> exit_code 0.
- `node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js` -> exit_code 0.
- `node build-scripts/sprints/check-task-ingest-transform3-textbook.js` -> exit_code 0.
- `node build-scripts/sprints/check-sprint-bundle.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-2 --active` -> exit_code 0.
- `node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-2` -> exit_code 0.
- `node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review` -> exit_code 0.
- `node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js` -> exit_code 0.
- `npm.cmd run check:scope-language` -> exit_code 0.
- `node build-scripts/reports/validate-report-json.js` -> exit_code 0.
- `git diff --check` -> exit_code 1; caught one extra blank line at EOF in the actual-exam screenshot manifest.
- `git diff --check` -> exit_code 0 after manifest EOF fix.
- `npm.cmd run check:platform` -> exit_code 1; caught stale graph-construction test fixtures.
- `npm.cmd run check:platform` -> exit_code 0 after fixture and Dutch label expectation updates.
- `npm.cmd run agent:index` -> exit_code 0.
- `node build-scripts/sprints/emit-url-index.js` -> exit_code 0.
- `npm.cmd run dashboard:internal` -> exit_code 0.
- `node build-scripts/sprints/emit-url-index.js --check` -> exit_code 0.
- `git push origin main` -> exit_code 1; main push rejected by branch protection because required status check `validate-platform` is expected.
- `git switch -c codex/shared-task-ingest-repair2` -> exit_code 0.
- `git push -u origin codex/shared-task-ingest-repair2` -> exit_code 0.
- `node build-scripts/sprints/emit-gate-bundle-urls.js GATE-SHARED-TASK-INGEST-REPAIR-1-shared-task-context-ingestion-repair-review --branch codex/shared-task-ingest-repair2` -> exit_code 0.
- `node build-scripts/sprints/emit-url-index.js` -> exit_code 0 after branch metadata update.
- `npm.cmd run dashboard:internal` -> exit_code 0 after branch metadata update.
- `node build-scripts/sprints/check-lead-review-substance.js SHARED-TASK-INGEST-PLAYABLE-REPAIR-2` -> exit_code 0 after branch metadata update.
- `node build-scripts/review-gates/check-gate-shared-task-ingest-repair1-review-packet.js` -> exit_code 0 after branch metadata update.
- `node build-scripts/sprints/emit-url-index.js --check` -> exit_code 0 after branch metadata update.
- `node build-scripts/reports/validate-report-json.js` -> exit_code 0 after branch metadata update.
- `git diff --check` -> exit_code 0 after branch metadata update.

## Notes

The command-log JSONL is
`reports/sprints/SHARED-TASK-INGEST-PLAYABLE-REPAIR-2-command-log.jsonl`.
The failed entries are retained intentionally: they record issues found and
fixed during verification, plus the protected-main push rejection that caused
publication to move to the `codex/shared-task-ingest-repair2` review branch.
