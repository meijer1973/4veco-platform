# Sprint TASK-FAMILY-LABEL-1: Diff Summary

Generated: 2026-06-01

## Runtime

- Added `label_placement` to the shared task-shell engine family catalog.
- Added schema validation for label banks, target regions, visual descriptions,
  answer/distractor semantics, `distractorFor`, target-role enum values,
  target coordinates, and exact expected placements.
- Added deterministic matching with strict response-shape rejection for raw
  arrays, array-with-key objects, non-string ids, unknown labels/targets,
  duplicate labels/targets, selected distractors, omitted answers, swapped
  placements, and extra keys.
- Added practice-only feedback for missing labels, missing targets, misplaced
  labels, selected distractor labels, selected distractor targets, and correct
  placements.

## UI

- Added label-bank rendering, visual target-region rendering, target buttons,
  placement summary, clear/remove controls, collection helper, click handler,
  focus selectors, and feedback rendering in `engines/task-shell-ui.js`.
- Added `.ts-label-*` styles in `engines/task-shell.css`, including target
  region layout, narrow viewport handling, and dark-mode-safe surfaces.

## Wrappers

- Updated exit-ticket, skilltree, and graph wrappers to collect
  `label_placement` through shared `TaskShellUI` helpers and delegate click
  handling.
- Added the missing skilltree focus-preservation guard for
  `.ts-label-placement`.

## Tests And Proof

- Extended focused engine/UI/wrapper tests.
- Added sprint checker:
  `build-scripts/sprints/check-task-family-label1.js`.
- Added proof JSON:
  `reports/json/task-family-label1-proof.json`.
- Added rendered fixture and screenshot manifest:
  `reports/sprints/TASK-FAMILY-LABEL-1-rendered-fixture.html`
  and `reports/sprints/TASK-FAMILY-LABEL-1-screenshot-manifest.md`.

## Boundary

No generated lesson output, source-data adoption, protected references,
target-exercise registry fields, candidate storage, PV projection, Scale Gate
1, diagnostics, adaptive routing, mastery, sequencing, summative use, or
product authority changed.

Protected surfaces: no edits were made under `references/machine` or
`references/external`.
