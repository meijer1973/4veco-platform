# Lead Review Assignment
Sprint: `TASK-FAMILY-CLOZE-TILE-1`

Generated: 2026-06-01

## Scope

Review the `cloze_tile_select` shared task-shell implementation before sprint
closure. Decide whether the implementation can proceed to result/closure or
must return REVISE.

This lead review must inspect the actual code, tests, proof artifacts, and
forbidden-surface boundaries. It must not treat the main agent's test results
as a substitute for review.

## Evidence to inspect

- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-plan.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-CLOZE-TILE-1.plan.json`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `engines/tests/skilltree-ui.test.js`
- `engines/tests/graphical-ui.test.js`
- `build-scripts/sprints/check-task-family-cloze-tile1.js`
- `reports/json/task-family-cloze-tile1-proof.json`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-screenshot-manifest.md`

## Review questions

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Contract implementation | Lead reviewer | `cloze_tile_select` matches `TASK-FAMILY-CONSTRUCT-1` response/expected shape and bounded-use limits | pending |
| Engine validation and matching | Lead reviewer | Duplicate ids, unknown refs, distractor policy, no-reuse default, missing response, and exact matching are covered | pending |
| UI and accessibility | Lead reviewer | Inline blanks, tile bank, selected/filled states, clear/remove affordance, keyboard/button semantics, labelled controls, and feedback region are present | pending |
| Wrapper integration | Lead reviewer | Exit-ticket, skilltree, and graph wrappers collect `{ blanks: { blankId: tileId } }` through the shared helper | pending |
| Tests and checker | Lead reviewer | Focused Jest and `check-task-family-cloze-tile1.js` cover the implementation and proof artifacts | pending |
| Product boundaries | Lead reviewer | No generated lesson output, source-data, protected references, target-exercise registry, candidate storage, product authority, or Scale Gate 1 authority changed | pending |

## Test evidence from main agent

Passed before assignment:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-CLOZE-TILE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CLOZE-TILE-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-cloze-tile1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
```

`npm.cmd run check:platform` exited 0 with known fixture warnings from existing
test data; do not treat those warnings as sprint-specific failures unless the
diff introduces new issues.

## Required reviewer output

Write `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-lead-review-round1.md` in the
strict lead-review format:

- `# Lead Review Summary`
- `Sprint: \`TASK-FAMILY-CLOZE-TILE-1\``
- `Round: lead review round 1`
- all required lead-review sections from `check-sprint-bundle.js`
- verdict `PASS`, `PASS WITH FLAGS`, `REVISE`, `FAIL`, or `PAUSE`

If verdict is REVISE, name exact blocking findings and required corrections.
