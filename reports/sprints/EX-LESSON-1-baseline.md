# Sprint EX-LESSON-1: Baseline

Generated: 2026-05-30

Status: baseline recorded before EX-LESSON-1 edits.

## Plan reference

Plan: `reports/sprints/EX-LESSON-1-plan.md`

## Current state

- `references/reference-team-roadmap.md` marks `EX-LESSON-1` as the active next
  sprint after MTU-H4C.
- `../4veco-lessen/lessen-team-roadmap.md` contains an `EX-LESSON-1` row, but
  the top engine sequence still contains stale H4A/H4C ordering text that needs
  reconciliation after MTU-H4C.
- `../4veco-lessen/specifications/product-end-state.md` already defines the
  exam-ingestion end state and target-equivalent exit ticket standard.
- `BUILD-PARAGRAPH.md` already has a basic exam-target decomposition table, but
  it does not yet make the skill-map route, shared task shell,
  target-equivalent exit ticket, and review-gate trace explicit enough.
- `build-scripts/templates/template-paragraph-plan.md` has no dedicated
  exam-target route trace section.
- Companion and review guidance does not yet require a correction-model to
  shared-task-shell/skill-map/exit-ticket trace before exam-target reliance.

## Data integrity notes

Protected reference data is out of scope. EX-LESSON-1 must not hand-edit
`references/machine/` or `references/external/`, and must not create or write
`references/data/exam-ingestion/answer-skill-candidates.json`.

Generated lesson output under `../4veco-lessen/Boek *` is out of scope.
Target-exercise `question_type` or `answer_form` field writes are out of scope.

## Baseline git state

Before edits, platform `main` matched `origin/main` except for the pre-existing
untracked `knowledge/exit-ticket-game-1.1.1.zip`. Lesson `main` matched
`origin/main` with no tracked diffs.

## Stop conditions

- Stop if an edit requires protected reference mutation.
- Stop if an edit would generate or hand-edit lesson output.
- Stop if a target-exercise field write is needed.
- Stop if candidate storage creation or candidate writes are needed.
- Stop if roadmap wording authorizes diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, Scale Gate 1, or student/product use.
