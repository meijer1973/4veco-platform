# REASON-STD-1 Lead Review Corrections

Generated: 2026-06-02

Sprint: `REASON-STD-1`

## Round-1 Verdict

Round 1 returned REVISE.

Blocking findings:

1. The rendered fixture was static illustrative HTML and did not prove it was
   generated from actual reasoning-engine `taskShellTask` objects.
2. Checker and Jest proof accepted correct shared task-shell responses but did
   not assert representative wrong-order responses were rejected for modes 0,
   1, and 3.

## Corrections Applied

| Finding | Correction | Evidence |
|---|---|---|
| Fixture provenance too weak | Added `build-scripts/sprints/generate-reason-std1-proof.js` to generate the fixture and proof JSON from actual `ReasoningEngine` `round.taskShellTask` objects. | `reports/sprints/REASON-STD-1-rendered-fixture.html`, `reports/json/reason-std1-proof.json`, `reports/json/reason-std1-standard-family-map.json` |
| Checker did not compare generated proof | Updated `build-scripts/sprints/check-reason-std1.js` to recompute generated artifacts and compare the fixture and JSON proof byte-for-byte against committed files. | `node build-scripts/sprints/check-reason-std1.js` passed |
| Wrong shared-shell responses not checked | Updated checker and focused Jest to assert reversed/wrong order responses return `retry` and `matched: false` for modes 0, 1, and 3. | `npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js` passed |
| Screenshot-manifest over-reading risk | Tightened wording to state there are no actual product-route screenshots in this sprint and the fixture is not generated-route adoption proof. | `reports/sprints/REASON-STD-1-screenshot-manifest.md` |

## Validation After Corrections

Passed:

- `node build-scripts/sprints/generate-reason-std1-proof.js`
- `node build-scripts/sprints/check-reason-std1.js`
- `npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js`
- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-STD-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js REASON-STD-1`

## Round-2 Readiness

Ready for round 2 recheck. The recheck should verify that the generated
fixture/proof artifacts now match current engine output and that wrong
standard-task responses are rejected without changing generated lesson output,
source data, protected references, target-equivalent claims, diagnostics,
mastery/sequencing, Scale Gate 1, or product authority.

