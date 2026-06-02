# TASK-FAMILY-TWO-TIER-1 Lead Review Assignment

Generated: 2026-06-02

Status: assigned for structural lead review before sprint closure.

## Reviewer Role

Use the lead-reviewer-agent posture for a runtime-only shared task-shell sprint.
Review whether `two_tier_choice` is implemented as a constrained
answer-plus-reason task family without weakening the product-boundary rules.

## Scope

Review only `TASK-FAMILY-TWO-TIER-1` implementation and evidence.

Included:

- `reports/sprints/TASK-FAMILY-TWO-TIER-1-plan.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-baseline.md`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-TWO-TIER-1.plan.json`
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
- `build-scripts/sprints/check-task-family-two-tier1.js`
- `reports/json/task-family-two-tier1-proof.json`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-TWO-TIER-1-screenshot-manifest.md`
- `knowledge/exit-ticket-game-1.1.1.zip` as no-change tracked archive proof

Out of scope:

- generated Book 1 lesson output;
- source exit-ticket data;
- target-exercise registry changes;
- product-route adoption;
- target-equivalent proof;
- diagnostics, adaptive routing, mastery, sequencing, summative use, PV,
  Scale Gate 1, or product-wide use.

## Required Review Questions

1. Does `two_tier_choice` require exactly one answer-tier option and one
   reason-tier option, and does it reject answer-only or reason-only responses?
2. Does matching require the exact answer-plus-reason combination rather than
   accepting a correct answer with a wrong reason, or a wrong answer with a
   correct reason?
3. Are raw strings, raw arrays, nested object values, non-string ids, unknown
   ids, cross-tier response ids, and extra top-level response keys rejected?
4. Are duplicate ids rejected within answer options, within reason options,
   and across tiers?
5. Are descriptions required for both answer and reason options?
6. Is feedback neutral and `practice_only`, without misconception profiles,
   diagnostics, mastery, sequencing, or target-equivalent claims?
7. Do exit-ticket, skilltree, and graph wrappers delegate click handling and
   response collection to the shared task shell?
8. Does the rendered report fixture prove standard, after-click, feedback,
   narrow, and dark states?
9. Does the custom checker cover the adversarial cases named in the planning
   review?
10. Is `knowledge/exit-ticket-game-1.1.1.zip` still tracked and unchanged?

## Expected Output

Write:

- `reports/sprints/TASK-FAMILY-TWO-TIER-1-lead-review-round1.md`

Verdict options:

- PASS
- PASS WITH FLAGS
- REVISE
- PAUSE
- FAIL

If REVISE or PAUSE, name exact blocking corrections.
