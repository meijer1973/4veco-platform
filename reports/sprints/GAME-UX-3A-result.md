# Sprint GAME-UX-3A: Result

Generated: 2026-05-30

Status: completed.

## Plan reference

Plan: `reports/sprints/GAME-UX-3A-plan.md`

## Summary

GAME-UX-3A implemented the shared task-type shell runtime foundation. The new
task shell provides reusable task-family validation, deterministic local checks
where appropriate, self-check states where automatic checking would be
inappropriate, neutral feedback payloads, static rendering helpers,
keyboard/focus-ready markup, light/dark CSS, deploy-copy hooks, and focused
Jest coverage.

Accepted task families:

- `numeric_input`
- `calculation_work_capture`
- `final_answer_entry`
- `unit_notation_field`
- `short_constructed_response`
- `table_value_selection`
- `graph_reading`
- `point_placement`
- `graph_construction_substitute`
- `structured_reasoning`

The sprint did not generate lesson output and did not convert any paragraph
checkpoint, graph game, or math game to the new shell. Those integrations
remain downstream work.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-3A-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-3A` | passed |
| `npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-3A --complete` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `rg -n "numeric input|calculation/work capture|final-answer entry|unit/notation|short constructed response|table-value selection|graph reading|point placement|graph-construction substitute|structured reasoning" engines reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md` | passed |
| `git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json` | passed |
| `git -C ../4veco-lessen diff --name-only -- "Boek*"` | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Runtime and tests:

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `scripts/deploy.js`
- `build-scripts/platform/build-exit-ticket-shells.js`

Sprint records:

- `reports/sprints/GAME-UX-3A-plan.md`
- `reports/sprints/GAME-UX-3A-baseline.md`
- `reports/sprints/GAME-UX-3A-planning-review.md`
- `reports/sprints/GAME-UX-3A-task-family-fixtures.md`
- `reports/sprints/GAME-UX-3A-result.md`
- `reports/sprints/GAME-UX-3A-diff-summary.md`
- `references/data/sprints/GAME-UX-3A.plan.json`
- `references/data/sprints/GAME-UX-3A.result.json`

Roadmaps and indexes:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.19-ex-lesson1-route-trace-handoff.md`
- generated repository maps, URL indexes, source registries, document
  inventories, and internal dashboard outputs refreshed for remote navigation.

Lesson-side planning archive:

- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/GAME-UX-3A/GAME-UX-3A-sprint-plan.md`
- `../4veco-lessen/archive/sprints/GAME-UX-3A/GAME-UX-3A-closure-log.md`

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

- Proceed to `ENGINE-OP-1` for live student-route operational proof audit.
- Use the shell in GRAPH-UX-2 and MATH-UX-2 before claiming graph/table or
  calculation target-equivalent checkpoint readiness.
- Keep L1.7B-Q2 blocked until task-shell use is connected to a reviewed
  paragraph target-exercise operation and answer-form chain.
- Keep answer-form units from MTU-H4C generator-blocked/non-interactive until
  a later implementation or no-exposure design authorizes use.

## Rollback instructions

If GAME-UX-3A must be reverted, roll back only the task-shell runtime files,
deploy/shell load hooks, focused tests, sprint records, roadmap/archive
records, and generated maps/indexes. Do not hand-edit `references/machine/`,
`references/external/`, source data, generated lesson output, target-exercise
mappings, or answer-skill candidate storage as part of rollback.
