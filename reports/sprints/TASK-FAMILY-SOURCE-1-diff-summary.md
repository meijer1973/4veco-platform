# Sprint TASK-FAMILY-SOURCE-1: Diff Summary

Generated: 2026-06-01

## Runtime

- Added `source_value_selection` and `source_chain_builder` to the shared
  task-shell engine family catalog.
- Added schema validation for source values, roles, source-chain nodes,
  answer/distractor semantics, required chain roles, expected selections, and
  expected chains.
- Added deterministic matching with strict response-shape rejection for raw
  arrays, array-with-key objects, non-string ids, unknown ids, duplicates,
  wrong roles, wrong order, selected distractors, omitted answer values/nodes,
  and extra keys.
- Added practice-only feedback objects for source-value and source-chain
  retries.

## UI

- Added source-value rendering, source-chain rendering, collection helpers,
  click handlers, focus selectors, and feedback rendering in
  `engines/task-shell-ui.js`.
- Added `.ts-source-*` styles in `engines/task-shell.css`, including narrow
  source-value stacking.

## Wrappers

- Updated exit-ticket, skilltree, and graph wrappers to collect both source
  families through `TaskShellUI` helpers and delegate click handling.

## Tests And Proof

- Extended focused engine/UI/wrapper tests.
- Added sprint checker:
  `build-scripts/sprints/check-task-family-source1.js`.
- Added proof JSON:
  `reports/json/task-family-source1-proof.json`.
- Added rendered fixture and screenshot manifest:
  `reports/sprints/TASK-FAMILY-SOURCE-1-rendered-fixture.html`
  and `reports/sprints/TASK-FAMILY-SOURCE-1-screenshot-manifest.md`.

## Boundary

No generated lesson output, source-data adoption, protected references,
target-exercise registry fields, candidate storage, PV projection, Scale Gate
1, diagnostics, adaptive routing, mastery, sequencing, summative use, or
product authority changed.

Protected surfaces: no edits were made under `references/machine` or
`references/external`.
