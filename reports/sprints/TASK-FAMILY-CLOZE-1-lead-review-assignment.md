# TASK-FAMILY-CLOZE-1 Lead Review Assignment

Generated: 2026-06-01

Sprint: `TASK-FAMILY-CLOZE-1`

## Scope

Lead reviewer must inspect the runtime-only `cloze_text` implementation before
sprint closure. This review is not a human gate and authorizes no generated
lesson output, source-data writes, product-route adoption, target-equivalent
reliance, diagnostics, mastery/sequencing, PV, Scale Gate 1, or product-wide
use.

## Evidence to inspect

- `reports/sprints/TASK-FAMILY-CLOZE-1-plan.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-baseline.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-CLOZE-1.plan.json`
- `reports/json/task-family-cloze1-proof.json`
- `reports/sprints/TASK-FAMILY-CLOZE-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-CLOZE-1-screenshot-manifest.md`
- `build-scripts/sprints/check-task-family-cloze1.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- focused task-shell and wrapper tests

## Review questions

1. Does `cloze_text` remain a distinct typed inline-blank family, not tile
   cloze and not generic structured short response?
2. Does engine validation enforce exact interaction and expected blank ids,
   accepted values or explicit `requiredTextGroups`, and `rejectText` where
   configured?
3. Does deterministic matching reject raw maps, missing blanks, unknown blanks,
   non-string values, and extra response keys?
4. Do UI and CSS render labelled typed inline blanks with stable selectors,
   focusable fields, mobile-safe wrapping, and one feedback region?
5. Do exit-ticket, skilltree, and graph wrappers collect `{ blanks: ... }`
   through shared task-shell helpers?
6. Do tests and the custom checker prove the carried planning-review flags?
7. Are all product-authority boundaries preserved?

## Commands requested

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-CLOZE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-CLOZE-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-cloze1.js
git diff --check
git -C ../4veco-lessen diff --check
```

## Expected output

Return a lead-review summary with:

- scope and evidence inspected;
- review plan table;
- consolidated verdict `PASS`, `PASS WITH FLAGS`, `REVISE`, `PAUSE`, or
  `FAIL`;
- blocking findings, if any;
- specialist findings;
- test evidence;
- learning quality evidence;
- student experience evidence;
- ownership and handoff;
- required next action.
