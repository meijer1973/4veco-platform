# TASK-FAMILY-ASSERTION-1 Lead Review Assignment

Generated: 2026-06-02

Status: assigned for structural lead review before sprint closure.

## Reviewer Role

Use the lead-reviewer-agent posture for a runtime-only shared task-shell
sprint. Review whether `assertion_reason` is implemented as a sparse reviewed
assertion/reason relation-judgement task family without weakening the
product-boundary rules.

## Scope

Review only `TASK-FAMILY-ASSERTION-1` implementation and evidence.

Included:

- `reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-baseline.md`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-planning-review.md`
- `references/data/sprints/TASK-FAMILY-ASSERTION-1.plan.json`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
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
- `build-scripts/sprints/check-task-family-assertion1.js`
- `reports/json/task-family-assertion1-proof.json`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-rendered-fixture.html`
- `reports/sprints/TASK-FAMILY-ASSERTION-1-screenshot-manifest.md`
- `knowledge/exit-ticket-game-1.1.1.zip` as tracked old-archive no-change proof

Out of scope:

- generated Book 1 lesson output;
- source exit-ticket data;
- source reasoning data;
- target-exercise registry changes;
- product-route adoption;
- target-equivalent proof;
- diagnostics, adaptive routing, mastery, sequencing, summative use, PV,
  Scale Gate 1, or product-wide use.

## Required Review Questions

1. Does `assertion_reason` implement the accepted contract as relation
   judgement rather than generic quiz variety?
2. Are schema validation, expected-shape validation, strict response matching,
   and negative cases sufficient?
3. Does the rendered UI expose assertion, reason, relation options, selected
   summary, focus selectors, and feedback clearly?
4. Do exit-ticket, skilltree, and graph wrappers delegate collection and click
   handling through shared `TaskShellUI` helpers?
5. Are generated lesson output, source data, protected references,
   target-equivalent reliance, diagnostics, mastery, sequencing, PV, Scale
   Gate 1, and product authority still blocked?
6. Is the old exit-ticket archive still tracked and unchanged?

## Required Validation Commands

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-ASSERTION-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-ASSERTION-1
npx.cmd jest engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-ui.test.js engines/tests/graphical-ui.test.js --runInBand
node build-scripts/sprints/check-task-family-assertion1.js
```

## Stop Conditions

Return REVISE or PAUSE if the sprint:

- treats `assertion_reason` as default reasoning-game format;
- weakens constructed-response or target-equivalent standards;
- emits diagnostic, misconception-profile, mastery, sequencing, or product
  authority language;
- requires generated lesson output or source exercise adoption;
- mutates protected reference data, source-data exit tickets, source-data
  reasoning, target registry, candidate storage, or the old exit-ticket
  archive;
- lacks real wrapper support or rendered fixture proof.

## Expected Output

Write:

- `reports/sprints/TASK-FAMILY-ASSERTION-1-lead-review-round1.md`

Verdict options:

- PASS
- PASS WITH FLAGS
- REVISE
- PAUSE
- FAIL

If REVISE or PAUSE, name exact blocking corrections.
