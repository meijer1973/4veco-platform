# Sprint ENGINE-OP-1: Result

Generated: 2026-05-31

Status: completed.

## Plan reference

Plan: `reports/sprints/ENGINE-OP-1-plan.md`

## Summary

ENGINE-OP-1 completed the four-engine operational proof audit for the live
generated routes in `1.1.1`, `1.1.2`, and `1.1.3`. The sprint produced a
student-path trace, screenshot manifest, 17 screenshots, and an operational
audit without mutating generated lesson output or protected references.

Audit conclusion: current output has useful practice progress, but not yet a
coherent four-engine product route. `1.1.3` graph practice is the strongest
current route and gives neutral source/value/calculation feedback. `1.1.2`
math practice is restored and scoped. The shared route layer still needs work:
some route panels are empty or mis-scoped, generated output does not yet use
the GAME-UX-3A task shell, and `1.1.2`/`1.1.3` still have no target-equivalent
checkpoint route.

Next action is `SKILLMAP-OP-1`.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/ENGINE-OP-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js ENGINE-OP-1` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js ENGINE-OP-1 --complete` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `rg -n "ENGINE-OP-1|student-path trace|screenshot manifest|shared task shell|target-equivalent proof|SKILLMAP-OP-1" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md` | passed |
| `Get-ChildItem reports/sprints/ENGINE-OP-1-screenshots -File \| Measure-Object` | passed |
| `git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json` | passed |
| `git -C ../4veco-lessen diff --name-only -- "Boek*"` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Sprint records and evidence:

- `reports/sprints/ENGINE-OP-1-plan.md`
- `reports/sprints/ENGINE-OP-1-baseline.md`
- `reports/sprints/ENGINE-OP-1-planning-review.md`
- `reports/sprints/ENGINE-OP-1-student-path-trace.md`
- `reports/sprints/ENGINE-OP-1-screenshot-manifest.md`
- `reports/sprints/ENGINE-OP-1-operational-audit.md`
- `reports/sprints/ENGINE-OP-1-result.md`
- `reports/sprints/ENGINE-OP-1-diff-summary.md`
- `reports/sprints/ENGINE-OP-1-screenshots/*.png`
- `references/data/sprints/ENGINE-OP-1.plan.json`
- `references/data/sprints/ENGINE-OP-1.result.json`

Roadmaps and indexes:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.20-game-ux3a-task-shell-foundation.md`
- generated repository maps, URL indexes, source registries, document
  inventories, and internal dashboard outputs refreshed for remote navigation.

Lesson-side archive:

- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/ENGINE-OP-1/ENGINE-OP-1-sprint-plan.md`
- `../4veco-lessen/archive/sprints/ENGINE-OP-1/ENGINE-OP-1-closure-log.md`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` were not edited. `references/authored/course-target-exercises.json`
did not receive `question_type`, `answer_form`, or mapping fields.

No `references/data/exam-ingestion/answer-skill-candidates.json` file was
created, and no candidate writes occurred. No `source-data/book-*/exit-ticket/`
files changed. No generated lesson output under `../4veco-lessen/Boek *`
changed. No target-equivalent proof, diagnostics, adaptive routing,
mastery/sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, Scale Gate 1, or student/product use was authorized.

The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` file remained
untouched and uncommitted.

## Open follow-ups

- Proceed to `SKILLMAP-OP-1` to fix empty and mis-scoped route panels and make
  the shared skill-map route student-visible in a coherent way.
- Keep GRAPH-UX-2, MATH-UX-2, and REASON-UX-2 blocked behind route clarity and
  task-shell integration work.
- Keep L1.7B-Q2 blocked until a reviewed target-exercise operation and
  answer-form chain can be represented through the shared route and task shell.
- Keep Scale Gate 1 blocked until GATE-ENGINE-1 and GATE-L1.7B-Q2 resolve the
  live-output quality and target-equivalent completion-language questions.

## Rollback instructions

If ENGINE-OP-1 must be reverted, roll back only the audit reports,
screenshots, sprint metadata, roadmap/archive records, and generated
maps/indexes. Do not hand-edit `references/machine/`, `references/external/`,
source data, generated lesson output, target-exercise mappings, or answer-skill
candidate storage as part of rollback.
