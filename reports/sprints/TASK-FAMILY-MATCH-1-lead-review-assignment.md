# TASK-FAMILY-MATCH-1 Lead Review Assignment

Generated: 2026-06-02

Lead reviewer agent: Turing (`019e8507-c39b-72b2-9bb4-229be894ad72`)

## Sprint Scope

Review the completed runtime-only `matching_pairs` implementation before
sprint closure.

This sprint adds `matching_pairs` to the shared task shell only. It does not
allow generated lesson output, source-data adoption, product-route adoption,
target-equivalent reliance, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV, Scale Gate 1, or
product-wide use.

## Evidence To Inspect

- `reports/sprints/TASK-FAMILY-MATCH-1-plan.md`
- `reports/sprints/TASK-FAMILY-MATCH-1-baseline.md`
- `reports/sprints/TASK-FAMILY-MATCH-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-MATCH-1.plan.json`
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
- `build-scripts/sprints/check-task-family-match1.js`
- `reports/json/task-family-match1-proof.json`
- `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-MATCH-1-screenshot-manifest.md`

## Required Review Checks

| Review/Test | Required evidence |
|---|---|
| Engine schema | `matching_pairs` is first-class, deterministic, one-to-one only, and validates left/right banks, descriptions, same-bank distractors, and expected pair coverage. |
| Strict response shape | Checker/tests reject raw arrays, array-with-`pairs`, object pair entries, wrong-length arrays, non-string ids, unknown ids, duplicate selected/expected left or right ids, selected distractors, and extra keys. |
| Feedback | Practice-only feedback reports missing left/right items, misplaced pairs, distractors, and correct pairs without diagnostics, mastery, sequencing, or target-equivalent language. |
| UI/accessibility | Rendered fixture shows two item banks, selected pair summary, remove/clear controls, keyboard/focus selectors, narrow/mobile state, dark-mode state, and screen-reader labels. |
| Wrappers | Exit-ticket, skilltree, and graph wrappers delegate collection and click handling to `TaskShellUI`. |
| Boundaries | No generated output, source data, protected references, product routes, target-equivalent claims, or old exit-ticket game archive changes. |

## Pre-Review Validation

Passed before assignment:

```bash
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js
node build-scripts/sprints/check-task-family-match1.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-MATCH-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MATCH-1
git status --short -- knowledge/exit-ticket-game-1.1.1.zip
```

The archive status command returned no output, indicating
`knowledge/exit-ticket-game-1.1.1.zip` is unchanged.

## Required Output

Return a structured lead-review report with:

- verdict: PASS, PASS WITH FLAGS, REVISE, PAUSE, or FAIL;
- blocking findings, if any;
- specialist findings;
- test evidence checked;
- learning-quality and student-experience notes;
- carried flags for any accepted residual risks;
- concrete required next action.

Use the strict lead-review summary structure required by the sprint-bundle
checker.
