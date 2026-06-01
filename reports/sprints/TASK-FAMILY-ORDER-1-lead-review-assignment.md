# TASK-FAMILY-ORDER-1 Lead Review Assignment

Generated: 2026-06-01

## Assignment

Lead reviewer must inspect the runtime-only `step_ordering` implementation
before sprint closure.

This review is required by repository sprint protocol. It is not replaced by
passing tests or by the planning-review PASS WITH FLAGS.

## Evidence to inspect

- `reports/sprints/TASK-FAMILY-ORDER-1-plan.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-baseline.md`
- `reports/sprints/TASK-FAMILY-ORDER-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-ORDER-1.plan.json`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- focused task-shell and wrapper tests
- `build-scripts/sprints/check-task-family-order1.js`
- `reports/json/task-family-order1-proof.json`
- `reports/sprints/TASK-FAMILY-ORDER-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-ORDER-1-screenshot-manifest.md`

## Review questions

1. Does `step_ordering` remain a distinct procedure-control family, not a
   sentence/formula builder alias or a private reasoning-engine widget?
2. Does the engine enforce exact `{ order: [...] }` response shape,
   order-sensitive matching, string-only ids, duplicate rejection, unknown-id
   rejection, full answer-step coverage, no neutral steps, and required
   distractor presence?
3. Is optional order feedback limited to `practice_only` and neutral local
   guidance about first misplaced step, missing required steps, selected
   distractors, and correct prefix?
4. Do exit-ticket, skilltree, and graph wrappers delegate response collection
   and click handling through shared `TaskShellUI` helpers?
5. Do rendered fixture, UI tests, and checker prove student-visible affordance,
   after-click selected-step behavior, stable selectors, accessible labels,
   focus plan, and one feedback region?
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
