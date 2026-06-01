# TASK-FAMILY-ORDER-1 Lead Review Corrections

Generated: 2026-06-01

## Round 1 verdict

Lead review round 1 returned REVISE.

## Blocking issue corrected

| Finding | Correction | Evidence |
|---|---|---|
| Arrays with an `order` property could match exact `{ order: [...] }` response shape. | `stepOrderingMatches` now requires `isObject(response)`, which rejects arrays. | `engines/task-shell-engine.js` |
| Focused tests did not cover array-with-`order`. | Added a Jest regression where `const arrayWithOrder = []; arrayWithOrder.order = [...]` must fail. | `engines/tests/task-shell-engine.test.js` |
| Custom checker missed the same adversarial case. | Added an array-with-`order` assertion to the sprint checker. | `build-scripts/sprints/check-task-family-order1.js` |

## Validation after correction

To be rerun before round 2:

```bash
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-order1.js
```

## Boundary check

No generated lesson output, source-data route adoption, target-equivalent
reliance, diagnostics, adaptive routing, mastery, sequencing, summative use,
PV, Scale Gate 1, or product-wide use was introduced by this correction.
