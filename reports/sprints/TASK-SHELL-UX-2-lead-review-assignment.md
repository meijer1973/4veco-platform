# TASK-SHELL-UX-2 Lead Review Assignment

Generated: 2026-06-01

Sprint: `TASK-SHELL-UX-2`

Reviewer role: lead reviewer for product-quality, implementation, generated
output, tests, learning quality, student experience, and governance boundary.

## Scope

Review the completed `TASK-SHELL-UX-2` implementation before sprint closure.
Do not authorize product use, Scale Gate 1, diagnostics, adaptive routing,
mastery, sequencing, summative use, student-facing AI, PV, or broad
target-equivalent scaling.

## Evidence To Inspect

- `reports/sprints/TASK-SHELL-UX-2-plan.md`
- `reports/sprints/TASK-SHELL-UX-2-baseline.md`
- `reports/sprints/TASK-SHELL-UX-2-planning-review.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/TASK-SHELL-UX-2-screenshot-manifest.md`
- `reports/sprints/TASK-SHELL-UX-2-screenshots/manifest.json`
- `reports/json/task-shell-ux2-proof.json`
- `build-scripts/sprints/check-task-shell-ux2.js`
- `build-scripts/sprints/capture-task-shell-ux2-screenshots.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- focused tests under `engines/tests/`
- `source-data/book-1/exit-ticket/1.1.2.json`
- generated Book 1 output under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/`

## Review Questions

1. Does `calculation_work_capture` now support separate unit/notation fields
   without breaking compact `108` acceptance for the reviewed `1.1.2` task 2?
2. Are hints hidden/collapsible where supported, and are exit-ticket content
   hints absent?
3. Are pre-attempt criteria suppressed in exit-ticket rendering while source
   criteria remain available for validation/review?
4. Do feedback regions use one controlled labelled/focusable region without
   duplicate stacking?
5. Does rendered proof cover math, graph, reasoning, exit ticket, mobile, and
   dark-mode states?
6. Did generated lesson output come from deploy/generator only?
7. Are protected references, target-exercise registry fields, candidate
   storage, `1.1.1` target-equivalence, and `1.1.3` exit-ticket creation still
   untouched?

## Required Output

Produce a strict schema-version-2 lead-review report with:

- `# Lead Review Summary`
- `Sprint: \`TASK-SHELL-UX-2\``
- `Round: 1`
- all required sections:
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

Use verdicts `PASS`, `PASS WITH FLAGS`, `REVISE`, `PAUSE`, or `FAIL`.
If returning `PASS WITH FLAGS`, list each flag with owner and next action.
