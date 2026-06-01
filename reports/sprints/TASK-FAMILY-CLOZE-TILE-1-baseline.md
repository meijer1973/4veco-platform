# Sprint TASK-FAMILY-CLOZE-TILE-1: Baseline

Generated: 2026-06-01

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-plan.md`

## Current state

`TASK-FAMILY-CONSTRUCT-1` closed the construction-family contract and selected
`TASK-FAMILY-CLOZE-TILE-1` as the first implementation lane. The contract
defines `cloze_tile_select` as an inline blank plus selectable tile-bank task
family with response shape `{ blanks: { blankId: tileId } }` and expected shape
`{ kind: "cloze_tile_select", blanks: { blankId: tileId } }`.

Current runtime support:

- `engines/task-shell-engine.js` does not declare `cloze_tile_select`.
- `engines/task-shell-ui.js` does not render inline blanks or selectable tile
  banks.
- `engines/task-shell.css` has no cloze/tile styles.
- `engines/exit-ticket-ui.js`, `engines/skilltree-ui.js`, and
  `engines/graphical-ui.js` collect choice, point, calculation, structured
  short-response, and text responses, but not cloze-tile responses.
- Focused task-shell tests cover existing families only.

## Data integrity notes

Protected reference data is unchanged at sprint start. This sprint may not edit
`references/machine/` or `references/external/`.

Generated Book 1 lesson output is out of scope. The sprint may produce report
fixture evidence under `reports/sprints/`, but it may not hand-edit or deploy
generated lesson output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`.

`source-data/book-1/exit-ticket/`, reasoning CSVs, target-exercise registry
fields, candidate storage, and `knowledge/exit-ticket-game-1.1.1.zip` are out
of scope.

## Baseline checks to preserve

- No internal MTU/domain codes should become visible in task-shell student
  text.
- Boundary flags from `TaskShellEngine.evaluateTask` must remain false.
- `cloze_tile_select` must not be treated as target-equivalent proof by
  default.
- Exit-ticket, skilltree, and graph wrappers must continue to use their single
  task-shell feedback paths.
- Existing `calculation_work_capture`, `structured_short_response`,
  `table_value_selection`, `point_placement`, and `structured_reasoning`
  behavior must not regress.
