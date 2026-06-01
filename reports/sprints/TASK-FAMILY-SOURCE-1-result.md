# Sprint TASK-FAMILY-SOURCE-1: Result

Generated: 2026-06-01

Status: completed after structural lead review PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-SOURCE-1-plan.md`

Baseline: `reports/sprints/TASK-FAMILY-SOURCE-1-baseline.md`

Planning review: `reports/sprints/TASK-FAMILY-SOURCE-1-planning-review.md`

## Summary

`TASK-FAMILY-SOURCE-1` implemented two runtime-only shared task-shell families:

- `source_value_selection`
- `source_chain_builder`

The sprint did not add source exercise data, generated lesson output, product
route adoption, target-equivalent reliance, diagnostics, adaptive routing,
mastery, sequencing, summative use, PV, Scale Gate 1, or product-wide use.

`engines/task-shell-engine.js` now declares both families and validates source
values, roles, source-chain nodes, answer/distractor kinds, required
source-chain node roles, required distractors, exact expected source-value
selections, exact expected ordered source chains, and strict response shapes.

`engines/task-shell-ui.js` and `engines/task-shell.css` now render and style a
source-value bank with role selectors and a source-chain builder with node
bank, ordered sequence, remove/reorder controls, clear action, and
practice-only feedback.

Exit-ticket, skilltree, and graph wrappers now delegate collection and click
handling to shared `TaskShellUI` helpers for both source families.

## Acceptance test results

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-SOURCE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SOURCE-1
npm.cmd exec -- jest --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-source1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
git diff --check
git -C ../4veco-lessen diff --check
```

`npm.cmd run check:platform` exited 0, while printing known fixture warnings
from bad-name and 9.x test data. Those warnings are pre-existing test-data
noise and not caused by this sprint.

Final closure validation ran after lead review corrections, roadmap state
updates, repository-map/index refresh, and final bundle completion.

## Changed files

Runtime:

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`

Tests and checks:

- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-ui.test.js`
- `engines/tests/skilltree-ui.test.js`
- `engines/tests/graphical-ui.test.js`
- `build-scripts/sprints/check-task-family-source1.js`

Evidence:

- `reports/json/task-family-source1-proof.json`
- `reports/sprints/TASK-FAMILY-SOURCE-1-*`
- `references/data/sprints/TASK-FAMILY-SOURCE-1.plan.json`
- `references/data/sprints/TASK-FAMILY-SOURCE-1.result.json`

## Data integrity notes

No protected reference data changed. The sprint did not edit
`references/machine`, `references/external`, target-exercise registry fields,
candidate storage, source exit-ticket data, or generated Book 1 lesson output.

## Open follow-ups

- Product-route adoption for these families remains deferred to later reviewed
  adoption/check/graph/reasoning sprints.
- Generated-route desktop/mobile/dark screenshots remain deferred until a
  future sprint uses these families in real generated output.
- `source_chain_builder` must not be treated as target-equivalent proof unless
  paired with required operation tasks and reviewed by a later gate.

## Rollback instructions

Before commit, remove only the `TASK-FAMILY-SOURCE-1` runtime/test changes,
checker, proof artifacts, sprint records, result metadata, and any roadmap or
index refresh generated for this sprint. After commit, revert the sprint
commit. Do not revert previous task-family sprint records, source data,
generated Book 1 output, protected references, unrelated user work, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Lead Review State

Structural lead review completed:

- assignment: `reports/sprints/TASK-FAMILY-SOURCE-1-lead-review-assignment.md`
- round 1: REVISE, recorded in `reports/sprints/TASK-FAMILY-SOURCE-1-lead-review-round1.md`
- correction log: `reports/sprints/TASK-FAMILY-SOURCE-1-lead-review-corrections.md`
- round 2: PASS WITH FLAGS, recorded in `reports/sprints/TASK-FAMILY-SOURCE-1-lead-review-round2.md`

## Carried Flags

- The families are runtime-capable but not adopted into generated product
  routes in this sprint.
- The rendered proof is a report fixture with standard, narrow, dark, and
  after-click states; generated-route screenshots are deferred to a later
  adoption/product sprint.
- The source-chain family proves ordered source/control construction only. It
  does not prove target-equivalent calculation, graph/table, or reasoning
  completion unless paired with the required operation tasks and reviewed in a
  later gate.

## Next Action

Proceed to the next roadmap sprint only after committing and pushing this
completed runtime sprint. Do not start product-route adoption or Scale Gate work
from this sprint alone.
