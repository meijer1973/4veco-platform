# Sprint TASK-FAMILY-ASSERTION-1: Diff Summary

Generated: 2026-06-02

Status: closure diff summary.

## Runtime And UI

- `engines/task-shell-engine.js`
  - Added `assertion_reason` family declaration.
  - Added assertion/reason interaction validation.
  - Added minimum four described relation options.
  - Added exact `{ value }` matching and strict rejection cases.
  - Added neutral practice-only selected/expected relation feedback.
  - Added assertion-specific focus selectors.
- `engines/task-shell-ui.js`
  - Added assertion/reason cards, relation option rendering, selected-state
    summary, response collection, click handling, and feedback rendering.
- `engines/task-shell.css`
  - Added `.ts-assertion-*` layout, selected state, feedback, focus, narrow,
    and dark-mode-compatible styles.

## Wrapper Support

- `engines/exit-ticket-ui.js`
  - Delegates `assertion_reason` click handling and response collection through
    shared `TaskShellUI`.
- `engines/skilltree-ui.js`
  - Delegates `assertion_reason` click handling and response collection through
    shared `TaskShellUI`.
  - Keeps Enter-key task submission from firing inside assertion controls.
- `engines/graphical-ui.js`
  - Delegates `assertion_reason` click handling and response collection through
    shared `TaskShellUI`.

## Tests And Checker

- `engines/tests/task-shell-engine.test.js`
  - Added assertion fixture, positive match, strict response-shape negatives,
    focus plan, and schema rejection tests.
- `engines/tests/task-shell-ui.test.js`
  - Added rendered markers, Dutch label, feedback rendering, and helper export
    checks.
- `engines/tests/exit-ticket-ui.test.js`
  - Added assertion fixture and wrapper/source assertions.
- `engines/tests/skilltree-ui.test.js`
  - Added wrapper/source assertions.
- `engines/tests/graphical-ui.test.js`
  - Added wrapper/source assertions.
- `build-scripts/sprints/check-task-family-assertion1.js`
  - Added deterministic sprint checker for runtime, UI, wrapper, proof,
    boundary, and old-archive no-change evidence.

## Sprint Evidence

- Added plan/baseline/planning-review records.
- Added proof JSON.
- Added rendered report fixture.
- Added screenshot manifest.
- Added lead-review assignment, round 1, correction log, and round 2.
- Added result markdown, result JSON, and this diff summary.

## Roadmaps

- `references/reference-team-roadmap.md`
  - Marked `TASK-FAMILY-ASSERTION-1` closed PASS WITH FLAGS.
  - Set `GATE-TASK-FAMILY-1` as the next task-family review dependency.
- `../4veco-lessen/lessen-team-roadmap.md`
  - Mirrored the closed status and product-boundary flags.

## No-Change Surfaces

No edits were made to:

- `references/machine/`
- `references/external/`
- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- generated Book 1 lesson output
- target-exercise registry records
- candidate storage
- `knowledge/exit-ticket-game-1.1.1.zip`

## Product Authority

This sprint does not authorize generated lesson output, product-route adoption,
target-equivalent proof, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or product-wide use.
