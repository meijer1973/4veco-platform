# Sprint SOURCE-RECONSTRUCT-2-ACTUAL-EXAM: Result

## Plan reference

- Plan: `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md`
- Baseline: `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-baseline.md`
- Plan data: `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.plan.json`
- Result data: `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.result.json`

## Summary

Closed the actual-exam source reconstruction sprint for the authorized
external-primary item `vw-1022-a-25-1-o:opgave-1:question-3`. The bundle now
contains normalized source markdown, a source map, visual-fidelity notes,
reviewer comparison evidence, reconstruction JSON, a review-only rendered lab,
desktop/mobile/dark screenshots, proof JSON, a capture harness, and a
deterministic checker tied to the official prompt and correction PDFs.

The reconstruction proves source fidelity only. It reconstructs the Zoohee
zorgverzekering source table as a semantic table, preserves values, labels,
units, row order, source labels, captions, and correction-model comparison
evidence, and confirms the rendered lab has no visible or hidden answer amount.
It does not transform the source into task-family exercises, produce generated
lesson output, mutate protected references or source-data, adopt a product
route, claim target-equivalent proof, or authorize diagnostics, mastery,
sequencing, PV, Scale Gate, or student/product use.

## Acceptance test results

Passed commands are recorded in
`reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-command-log.jsonl` and
summarized in `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.result.json`.

Key proof commands:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`
- `node build-scripts/sprints/capture-source-reconstruct2-screenshots.js`
- `node build-scripts/sprints/check-source-reconstruct2-actual-exam.js`
- `npm.cmd run check:platform`
- `npm.cmd run check:scope-language`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/references/check-roadmap-version-index.js`

Final closure commands are run after this result file exists:

- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/check-lead-review-substance.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js SOURCE-RECONSTRUCT-2-ACTUAL-EXAM --complete`
- `node build-scripts/sprints/emit-url-index.js --check`
- `git diff --check`
- `git -c safe.directory=C:/Projects/4veco/4veco-lessen -C ../4veco-lessen diff --check`

## Changed files

Sprint artifacts, proof, and checker:

- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-plan.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-baseline.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-planning-review.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-normalized-source.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-source-map.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-visual-fidelity-notes.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-reviewer-comparison.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-screenshots/`
- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/source-reconstruct2-actual-exam-proof.json`
- `build-scripts/sprints/capture-source-reconstruct2-screenshots.js`
- `build-scripts/sprints/check-source-reconstruct2-actual-exam.js`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-lead-review-assignment.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-lead-review-round1.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-lead-review-corrections.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-lead-review-round2.md`
- `reports/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM-command-log.*`
- `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.plan.json`
- `references/data/sprints/SOURCE-RECONSTRUCT-2-ACTUAL-EXAM.result.json`

Roadmaps, maps, and dashboard:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- GitHub-facing maps, URL index, and internal dashboard files refreshed during closure.

## Data integrity notes

No protected reference data under `references/machine/` or
`references/external/` changed. No `source-data/` files changed. No generated
Book 1 lesson output changed. The reconstruction JSON and checker explicitly
keep task transformation, generated lesson output, protected reference
mutation, source-data mutation, product-route adoption, target-equivalent
proof, diagnostics, adaptive routing, mastery/sequencing, PV, Scale Gate, and
student/product use unauthorized.

`npm.cmd run check:platform` passed with exit code `0`; its stderr still lists
pre-existing unrelated fixture/quality warnings from other test surfaces, so
this sprint does not claim clean stderr.

## Open follow-ups

- `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`: transform this reconstructed actual
  exam source into shared task-family compositions with operation-chain traces,
  answer-form traces, task-family maps, sourceAuthority references, and
  reviewer notes.
- `TASK-INGEST-TRANSFORM-3-TEXTBOOK`: prepare textbook source-context
  transformation after the actual-exam path is proven.
- `GATE-SHARED-TASK-INGEST-REPAIR-1`: run the human-review gate only after
  actual-exam task transformation evidence exists.

## Rollback instructions

Revert the `SOURCE-RECONSTRUCT-2-ACTUAL-EXAM` sprint artifacts, checker, capture
script, result JSON, and roadmap closure row; restore the roadmap row to open;
and rerun sprint validators. Do not mutate protected references, source-data,
generated lesson output, or external PDFs as a rollback shortcut.
