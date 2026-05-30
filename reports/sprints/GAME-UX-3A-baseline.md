# Sprint GAME-UX-3A: Baseline

Generated: 2026-05-30

Status: baseline recorded before GAME-UX-3A edits.

## Plan reference

Plan: `reports/sprints/GAME-UX-3A-plan.md`

## Current state

- `references/reference-team-roadmap.md` marks `GAME-UX-3A` as the active next
  sprint after EX-LESSON-1.
- `../4veco-lessen/lessen-team-roadmap.md` records the same order and keeps
  Scale Gate 1 blocked.
- `../4veco-lessen/specifications/product-end-state.md` and
  `../4veco-lessen/specifications/companion-core-specifications.md` require a
  shared task-type shell for target-equivalent exit tickets, checkpoint-only
  local checks, graph/table practice, math/calculation practice, and
  overlapping reasoning tasks.
- `engines/exit-ticket-engine.js` currently validates `type: "choice"` only.
- `engines/exit-ticket-ui.js` currently renders choice buttons only.
- `engines/graphical-engine.js` and `engines/skilltree-engine.js` contain
  separate local validation/input logic for graph and math-style interactions.
- MTU-H4C answer-form units remain generator-blocked/non-interactive and must
  not be exposed as student-facing skill-tree rows by this sprint.

## Data integrity notes

Protected reference data is out of scope. GAME-UX-3A must not hand-edit
`references/machine/` or `references/external/`, must not write
`references/authored/course-target-exercises.json`, and must not create or
write `references/data/exam-ingestion/answer-skill-candidates.json`.

Generated lesson output under `../4veco-lessen/Boek *` is out of scope.
Source data under `source-data/book-*/exit-ticket/` is also out of scope.

## Baseline git state

Before edits, platform `main` matched `origin/main` except for the pre-existing
untracked `knowledge/exit-ticket-game-1.1.1.zip`. Lesson `main` matched
`origin/main` with no tracked diffs.

## Stop conditions

- Stop if an edit requires protected reference mutation.
- Stop if an edit requires generated lesson output or source-data mutation.
- Stop if target-exercise field writes are needed.
- Stop if candidate storage creation or candidate writes are needed.
- Stop if roadmap or UI wording authorizes diagnostics, adaptive routing,
  mastery, sequencing, student-facing AI, summative use, PV projection, PV
  machine promotion, Scale Gate 1, or student/product use.
