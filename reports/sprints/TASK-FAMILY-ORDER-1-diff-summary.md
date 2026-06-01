# Sprint TASK-FAMILY-ORDER-1: Diff Summary

Generated: 2026-06-01

## Runtime

- Added `step_ordering` to `engines/task-shell-engine.js`.
- Added validation for answer/distractor step banks, full expected answer-step
  coverage, required distractor presence, exact response shape, and
  practice-only order feedback.
- Added `step_ordering` rendering, response collection, click handling, and
  feedback rendering to `engines/task-shell-ui.js`.
- Added `.ts-step-*` and `.ts-order-feedback` styles to
  `engines/task-shell.css`.
- Added wrapper support in exit-ticket, skilltree, and graph UIs.

## Tests and proof

- Expanded focused task-shell and wrapper tests.
- Added `build-scripts/sprints/check-task-family-order1.js`.
- Added `reports/json/task-family-order1-proof.json`.
- Added rendered fixture and screenshot manifest with standard, narrow, dark,
  and after-click proof states.

## Governance

- Added plan, baseline, planning review, lead-review assignment, round-1
  review, correction log, round-2 recheck, result, and sprint metadata.
- No generated lesson output, source exercise data, protected reference data,
  target-exercise registry, candidate storage, or product-authority surfaces
  changed.

## Protected surfaces

- `references/machine/` unchanged.
- `references/external/` unchanged.
- No generated lesson output, target-exercise registry, candidate storage,
  source exit-ticket data, reasoning CSV, skilltree source data, graph source
  data, or product-facing route was changed.
