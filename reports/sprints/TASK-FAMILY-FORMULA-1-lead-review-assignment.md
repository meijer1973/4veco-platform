# Lead Review Assignment: TASK-FAMILY-FORMULA-1

Generated: 2026-06-01

Sprint: `TASK-FAMILY-FORMULA-1`

## Scope

Review the `formula_builder` shared task-shell implementation before sprint
closure. This is a runtime-only implementation sprint with report-fixture
proof and no generated lesson output.

## Evidence to inspect

- `reports/sprints/TASK-FAMILY-FORMULA-1-plan.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-baseline.md`
- `reports/sprints/TASK-FAMILY-FORMULA-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-FORMULA-1.plan.json`
- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/sprints/TASK-FAMILY-CLOZE-TILE-1-result.md`
- `reports/sprints/TASK-FAMILY-SENTENCE-1-result.md`
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
- `build-scripts/sprints/check-task-family-formula1.js`
- `reports/json/task-family-formula1-proof.json`
- `reports/sprints/TASK-FAMILY-FORMULA-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-FORMULA-1-screenshot-manifest.md`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Plan and scope review | lead reviewer | Plan is operational and blocks generated output, source-data adoption, target-equivalent claims, and product authority. | required |
| Engine contract review | lead reviewer | `formula_builder` validates token banks, token kinds, formula categories, accepted sequences, distractors, no-reuse default, and exact response shape. | required |
| UI/UX review | lead reviewer | Rendered markup exposes formula-block bank, ordered formula zone, add/remove/reorder controls, and one feedback region. | required |
| Wrapper review | lead reviewer | Exit-ticket, skilltree, and graph wrappers collect `{ tokens: [...] }` and delegate interaction to shared helpers. | required |
| Test review | lead reviewer/tool | Focused Jest and `check-task-family-formula1.js` pass and include strict-shape, wrong-order, missing/extra token, category, duplicate-use, and wrapper checks. | required |
| Boundary review | lead reviewer | No generated Book 1 output, source data, protected references, target registry, candidate storage, or product-authority surfaces changed. | required |

## Commands to rerun

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-FORMULA-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-FORMULA-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-formula1.js
```

## Lead-review output required

Write or return a report in the strict lead-review shape:

- `# Lead Review Summary`
- `Sprint: \`TASK-FAMILY-FORMULA-1\``
- `Round: lead review round 1`
- `## Scope`
- `## Review Plan`
- `## Consolidated Verdict`
- `## Blocking Findings`
- `## Specialist Findings`
- `## Test Evidence`
- `## Learning Quality Evidence`
- `## Student Experience Evidence`
- `## Ownership and Handoff`
- `## Required Next Action`

Valid round-1 verdicts: PASS, PASS WITH FLAGS, REVISE, FAIL, PAUSE.

If round 1 is not PASS or PASS WITH FLAGS, name the exact corrections required
before round 2.
