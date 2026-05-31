# Sprint REASON-UX-2: Lead Review Corrections

Generated: 2026-05-31

Round-1 verdict: PASS WITH FLAGS.

## Corrections Applied

| Round-1 finding | Correction | Status |
|---|---|---|
| `REASON-UX-2-LR1-F1`: structured-reasoning self-check could still appear as scored "goed" progress in old result/breakdown paths | Updated `engines/reasoning-engine.js` so mode 5 returns `selfCheckOnly` and `completed`, never increments score for self-check completion, and records practiced count separately from correctness | applied |
| Same flag: UI result language could still aggregate mode 5 into category `goed` breakdown | Updated `engines/reasoning-ui.js` so self-check sessions show `Redeneerantwoorden geoefend` and `zelfcheck`, skip persistent category progress writes, and do not render per-category `goed` totals for mode 5 | applied |
| Regression guard needed for the repaired boundary | Updated `engines/tests/reasoning-engine.test.js` and `engines/tests/reasoning-ui.test.js` to assert self-check completion, zero score, `selfCheckOnly`, and source-level separation from persistent progress | applied |
| Dalton recheck found the first UI patch was misplaced inside `saveAnswerProgress()` and could throw in existing scored modes | Removed self-check result logic from `saveAnswerProgress()`, placed it inside `showResults()`, and added a guard asserting the persistence block contains no `result.selfCheckOnlyMode` or `breakdownEl` references | applied |
| Round-2 readiness needed validation evidence after correction | Ran focused reasoning/task-shell tests after the correction; full deploy/regression validation remains scheduled before final closure | applied |

## Validation During Correction

```text
npx.cmd jest --runInBand --runTestsByPath engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
PASS: 4 suites, 73 tests
```

```text
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
PASS
```

```text
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
PASS
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
PASS
node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
PASS
```

## Round-2 Readiness

The sprint is ready for lead-review round 2 to verify:

- mode 5 self-check remains practice-only and not scored as "goed";
- generated route output still exposes shared task-shell structured reasoning;
- GRAPH-UX-2 and MATH-UX-2 route checks remain in the final validation stack;
- protected references, target-exercise fields, candidate storage, and
  source exit-ticket data remain untouched;
- roadmap/result/archive closure work does not introduce stale or premature
  final claims.

## Required Next Action

Run lead-review round 2. If round 2 passes, finalize the result and diff
summary, update roadmap/archive records, redeploy generated output, and run
complete sprint closure validation before commit/push.
