# STANDARD-EXERCISES-1 Lead Review Assignment

Generated: 2026-06-01

Reviewer agent: Ampere (`019e8243-1d59-7c23-b24c-ec21f9c6ae5e`)

## Scope

Review the completed `STANDARD-EXERCISES-1` audit artifacts before sprint
closure. This is a structural lead-review cycle, not a human gate.

Evidence to inspect:

- `reports/sprints/STANDARD-EXERCISES-1-plan.md`
- `reports/sprints/STANDARD-EXERCISES-1-baseline.md`
- `reports/sprints/STANDARD-EXERCISES-1-planning-review.md`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/json/standard-exercise-family-coverage.json`
- `build-scripts/sprints/check-standard-exercises1-coverage.js`
- `engines/task-shell-engine.js`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/skilltree/base-elements.js`
- `engines/graphical-engine.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- `source-data/book-1/exit-ticket/1.1.2.json`
- `build-scripts/content/book-1/b1-111-inoefening.js`
- `build-scripts/content/book-1/b1-111-procedure-data.js`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/CHECK-SHORT-EXIT-1-result.md`

## Review Questions

1. Does the audit cover reasoning, math, graph/table, exit-ticket/checkpoint,
   guided-practice, and procedure/stappenplan surfaces with no hidden
   implementation?
2. Does each family row contain a concrete student action, response shape,
   feedback owner/model, shared-shell coverage decision, disposition, and
   follow-up owner?
3. Does the reasoning section explicitly decide the required candidates:
   `structured_reasoning`, `step_ordering`, `cause_effect_chain`,
   `claim_reason_evidence`, `flow_diagram_build`,
   `classification_with_explanation`, `short_constructed_response`, and
   `source_based_explanation`?
4. Does the audit avoid collapsing the reasoning game into a vague generic
   `structured_reasoning` claim?
5. Are the carried flags appropriate for a PASS WITH FLAGS audit sprint, or do
   any represent blockers that require REVISE?
6. Does the checker validate the core audit contract and protect forbidden
   implementation/source/generated-output surfaces?
7. Are the next actions clear enough for `TASK-SHELL-UX-2`, `REASON-STD-1`,
   `DUAL-CODING-STD-1`, `ENGINE-UNIFY-1`, and `CHECK-SHORT-EXIT-2`?

## Required Output

Write the round-1 lead review to:

`reports/sprints/STANDARD-EXERCISES-1-lead-review-round1.md`

Use the strict lead-review schema:

- `# Lead Review Summary`
- `Sprint: \`STANDARD-EXERCISES-1\``
- `Round: lead review round 1`
- `## Scope`
- `## Review Plan`
- `## Consolidated Verdict`
- `## Blocking Findings`
- `## Specialist Findings`
- `## Test Evidence`
- `## Learning Quality Evidence`
- `## Student Experience Evidence`
- `## Ownership and Handoff`
- `## Required Next Action`

Return one of: PASS, PASS WITH FLAGS, REVISE, FAIL, or PAUSE.
