# Sprint TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM: Result

## Plan reference

- Plan: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-plan.md`
- Baseline: `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-baseline.md`
- Plan data: `references/data/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM.plan.json`
- Result data: `references/data/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM.result.json`

## Summary

Closed the actual-exam task transformation sprint for the authorized
external-primary item `vw-1022-a-25-1-o:opgave-1:question-3`. The bundle now
contains an exact reconstructed-context task set, six shared task-family cards,
operation-chain and answer-form traces, a task-family map, reviewer notes, a
review-only rendered lab, desktop/mobile/dark screenshots, proof JSON, a
capture harness, and a deterministic checker.

The transformation proves review-ready task-family decomposition only. It
preserves the official item's cognitive level: source-value selection, monthly
to yearly premium conversion, operation ordering, visible calculation work,
source-chain construction, and threshold-direction formulation. It rejects
source-selection-only, choice-only, and final-answer-only reductions. It does
not generate Book 1 lesson output, mutate protected references or source-data,
adopt a product route, claim target-equivalent proof, or authorize diagnostics,
adaptive routing, mastery/sequencing, PV, Scale Gate, or student/product use.

## Acceptance test results

Passed commands are recorded in
`reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-command-log.jsonl` and
summarized in `references/data/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM.result.json`.

Key proof commands:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`
- `node build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `node build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/sprints/check-lead-review-substance.js TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`

Final closure commands are run after this result file exists:

- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM --complete`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`

## Changed files

Sprint artifacts, proof, and checker:

- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-plan.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-baseline.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-planning-review.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-reviewer-notes.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-lead-review-assignment.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-lead-review-round1.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-lead-review-corrections.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-lead-review-round2.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-command-log.*`
- `references/data/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM.plan.json`
- `references/data/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM.result.json`

Roadmaps, maps, and dashboard:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- GitHub-facing maps, URL index, and internal dashboard files refreshed during closure.

## Data integrity notes

No protected reference data under `references/machine/` or
`references/external/` changed. No `source-data/` files changed. No generated
Book 1 lesson output changed. The transform JSON and checker explicitly keep
generated lesson output, protected reference mutation, source-data mutation,
product-route adoption, target-equivalent proof, diagnostics, adaptive routing,
mastery/sequencing, PV, Scale Gate, and student/product use unauthorized.

`npm.cmd run check:platform` is required as final closure evidence. If it emits
pre-existing unrelated fixture/quality warnings on stderr, this sprint does not
claim clean stderr unless the command exits `0`.

## Open follow-ups

- `TASK-INGEST-TRANSFORM-3-TEXTBOOK`: prepare the textbook source-context
  transformation after the actual-exam path has proved the source-authority,
  context, operation-chain, and answer-form contracts.
- `GATE-SHARED-TASK-INGEST-REPAIR-1`: run the human-review gate with actual
  exam and textbook labs, direct comments, resolution log, remote evidence, and
  closure proposal. No human gate is closed by this sprint.

## Rollback instructions

Revert the `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM` sprint artifacts, checker,
capture script, result JSON, and roadmap closure row; restore the roadmap row
to open; and rerun sprint validators. Do not mutate protected references,
source-data, generated lesson output, or external PDFs as a rollback shortcut.
