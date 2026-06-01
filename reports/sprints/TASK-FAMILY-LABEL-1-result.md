# Sprint TASK-FAMILY-LABEL-1: Result

Generated: 2026-06-01

Status: completed after structural lead review PASS WITH FLAGS.

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-LABEL-1-plan.md`

Baseline: `reports/sprints/TASK-FAMILY-LABEL-1-baseline.md`

Planning review: `reports/sprints/TASK-FAMILY-LABEL-1-planning-review.md`

## Summary

`TASK-FAMILY-LABEL-1` implemented the runtime-only shared task-shell family:

- `label_placement`

The sprint did not add source exercise data, generated lesson output, product
route adoption, target-equivalent reliance, diagnostics, adaptive routing,
mastery, sequencing, summative use, PV, Scale Gate 1, or product-wide use.

`engines/task-shell-engine.js` now declares `label_placement` and validates
label banks, visual target regions, label/target descriptions, answer and
distractor semantics, `distractorFor`, target roles, target coordinates, exact
expected placements, all-answer-label coverage, all-answer-target coverage,
and strict response shapes.

`engines/task-shell-ui.js` and `engines/task-shell.css` now render and style a
label bank, visual target region, target buttons, placement summary, clear and
remove controls, and practice-only feedback for label-placement retries.

Exit-ticket, skilltree, and graph wrappers now delegate collection and click
handling to shared `TaskShellUI` helpers for `label_placement`.

## Acceptance test results

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-LABEL-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-LABEL-1
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-label1.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
```

`npm.cmd run check:platform` exited 0, while printing known fixture warnings
from bad-name and 9.x test data. Those warnings are pre-existing test-data
noise and not caused by this sprint.

Final closure validation must still run after this result file, result JSON,
roadmap state updates, repository-map/index refresh, and final bundle
completion.

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
- `build-scripts/sprints/check-task-family-label1.js`

Evidence:

- `reports/json/task-family-label1-proof.json`
- `reports/sprints/TASK-FAMILY-LABEL-1-*`
- `references/data/sprints/TASK-FAMILY-LABEL-1.plan.json`
- `references/data/sprints/TASK-FAMILY-LABEL-1.result.json`

## Data integrity notes

No protected reference data changed. The sprint did not edit
`references/machine`, `references/external`, target-exercise registry fields,
candidate storage, source exit-ticket data, or generated Book 1 lesson output.

## Open follow-ups

- Product-route adoption remains deferred to later reviewed adoption/check,
  graph, route, or reasoning sprints.
- Generated-route desktop/mobile/dark screenshots remain deferred until a
  future sprint uses `label_placement` in real generated output.
- `label_placement` proves representation placement only. It does not prove
  target-equivalent graph/table completion unless paired with required
  graph/table operation tasks and reviewed by a later gate.
- The old exit-ticket prototype remains separately tracked as
  `knowledge/exit-ticket-game-1.1.1.zip` and was not changed by this sprint.

## Rollback instructions

Before commit, remove only the `TASK-FAMILY-LABEL-1` runtime/test changes,
checker, proof artifacts, sprint records, result metadata, and any roadmap or
index refresh generated for this sprint. After commit, revert the sprint
commit. Do not revert previous task-family sprint records, source data,
generated Book 1 output, protected references, unrelated user work, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Lead Review State

Structural lead review completed:

- assignment: `reports/sprints/TASK-FAMILY-LABEL-1-lead-review-assignment.md`
- round 1: REVISE, recorded in `reports/sprints/TASK-FAMILY-LABEL-1-lead-review-round1.md`
- correction log: `reports/sprints/TASK-FAMILY-LABEL-1-lead-review-corrections.md`
- round 2: PASS WITH FLAGS, recorded in `reports/sprints/TASK-FAMILY-LABEL-1-lead-review-round2.md`

## Carried Flags

- `label_placement` is runtime-capable but not adopted into generated product
  routes in this sprint.
- The rendered proof is a report fixture with standard, narrow, dark, and
  after-click states; generated-route screenshots are deferred to a later
  adoption/product sprint.
- `label_placement` is representation-placement support only. It is not a
  complete graph/table target-equivalent proof by itself.

## Next Action

Proceed to `TASK-FAMILY-MATCH-1` or route-affordance work only after committing
and pushing this completed runtime sprint. Do not start product-route adoption
or Scale Gate work from this sprint alone.
