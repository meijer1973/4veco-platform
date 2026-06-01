# TASK-FAMILY-MULTI-1 Lead Review Assignment

Generated: 2026-06-01

## Assignment

Lead reviewer must inspect the runtime-only `multi_select` implementation
before sprint closure.

This review is required by repository sprint protocol. It is not replaced by
passing tests or by the planning-review PASS WITH FLAGS.

## Evidence to inspect

- `reports/sprints/TASK-FAMILY-MULTI-1-plan.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-baseline.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-MULTI-1.plan.json`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- focused task-shell and wrapper tests
- `build-scripts/sprints/check-task-family-multi1.js`
- `reports/json/task-family-multi1-proof.json`
- `reports/sprints/TASK-FAMILY-MULTI-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-MULTI-1-screenshot-manifest.md`

## Review questions

1. Does `multi_select` remain a distinct checkbox-like complete-set family,
   not a wrapper around single-choice `.ts-choice.selected`?
2. Does the engine enforce exact `{ values: [...] }` response shape, exact-set
   matching, option-id validity, duplicate rejection, and distractor presence?
3. Is optional partial feedback limited to `practice_only` and neutral local
   guidance about missing required options, selected distractors, and already
   correct selections?
4. Do exit-ticket, skilltree, and graph wrappers delegate response collection
   through shared `TaskShellUI` helpers?
5. Do the rendered fixture, UI tests, and checker prove student-visible
   affordance, stable selectors, focus plan, and one feedback region?
6. Are product-authority and generated-output boundaries preserved?

## Required verdict

Return one of:

- PASS
- PASS WITH FLAGS
- REVISE
- PAUSE

If the verdict is PASS WITH FLAGS, name every carried flag and state whether it
blocks closure. If the verdict is REVISE or PAUSE, name exact corrections
required before round 2.
