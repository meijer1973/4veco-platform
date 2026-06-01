# Lead Review Corrections: TASK-FAMILY-FORMULA-1

Generated: 2026-06-01

Sprint: `TASK-FAMILY-FORMULA-1`

## Round 1 verdict

Round 1 returned REVISE.

Blocking finding:

- `formulaBuilderMatches` accepted response objects with extra keys, for
  example `{ tokens: [...], extra: "ignored" }`, even though the sprint
  contract requires the exact response shape `{ tokens: ["tokenId"] }`.

## Corrections applied

- Updated `engines/task-shell-engine.js` so `formulaBuilderMatches` rejects
  response objects whose only key is not exactly `tokens`.
- Added focused Jest regression coverage in
  `engines/tests/task-shell-engine.test.js`.
- Added the same regression to
  `build-scripts/sprints/check-task-family-formula1.js`.
- Updated `reports/json/task-family-formula1-proof.json` to record that extra
  response keys do not match.

## Commands rerun after correction

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-FORMULA-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-formula1.js
```

Status: passed.

## Round 2 readiness

The round-1 blocker has a named correction and passing regression evidence.
This sprint is ready for lead-review round 2 recheck.
