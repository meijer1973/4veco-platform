# TASK-FAMILY-CLOZE-TILE-1 Lead Review Corrections

Generated: 2026-06-01

Round-1 verdict: REVISE.

## Corrections applied

| Round-1 finding | Correction | Evidence |
|---|---|---|
| `clozeTileMatches` accepted a raw blank map even though the contract requires `{ blanks: { blankId: tileId } }`. | Changed `clozeTileMatches` to require `response.blanks` as an object. | `engines/task-shell-engine.js` |
| Missing regression coverage for raw-map response acceptance. | Added focused Jest coverage and custom checker coverage proving a raw `{ indexpunten, basis }` map does not match. | `engines/tests/task-shell-engine.test.js`; `build-scripts/sprints/check-task-family-cloze-tile1.js` |
| Untracked forbidden zip present in the worktree. | The file is unrelated pre-existing user/local work and remains untouched. It is not part of the sprint artifact list and must not be staged or included in closure. | `git status --short -- knowledge/exit-ticket-game-1.1.1.zip` reports it as untracked; sprint result and final staging must exclude it. |

## Validation after corrections

To run before round-2 recheck:

```bash
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-cloze-tile1.js
git status --short -- knowledge/exit-ticket-game-1.1.1.zip
```

## Round-2 readiness

The correction scope is narrow. Round 2 should verify exact response-shape
strictness, updated tests/checker, and that the zip remains excluded from
sprint staging/closure.
