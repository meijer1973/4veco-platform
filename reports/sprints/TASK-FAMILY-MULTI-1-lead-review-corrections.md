# TASK-FAMILY-MULTI-1 Lead Review Corrections

Generated: 2026-06-01

Round 1 verdict: REVISE.

## Correction log

| Round-1 issue | Correction | Status |
|---|---|---|
| Numeric or object response ids could be coerced into matching string option ids. | `normalizeIdSet` now rejects non-string selected values before matching. | resolved |
| Option lookup could rely on JavaScript key coercion. | `multiSelectMatches` now checks raw selected ids with `Object.prototype.hasOwnProperty.call(optionIds, selected[i])`. | resolved |
| Tests did not prove numeric/object response ids fail against numeric-string option ids. | Added focused engine tests and custom checker assertions for `{ values: [1, "2"] }` and `{ values: [{ id: "1" }, "2"] }`. | resolved |

## Follow-up validation required

Before round 2, rerun:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-MULTI-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MULTI-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-multi1.js
```

The screenshot/product-route flag remains carried and does not block
runtime-only closure.
