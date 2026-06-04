# Lead Review Assignment: TASK-CONTEXT-RUNTIME-1

Generated: 2026-06-04

## Scope

Lead reviewer must inspect the shared task-shell context runtime before sprint
closure. The review scope covers runtime validation/rendering, context proof
fixtures, review-only playable lab output, screenshot/proof evidence, command
logs, and the no-generated-output/no-protected-reference boundary.

This is not an exam-ingestion, source-reconstruction, generated lesson-output,
target-equivalent proof, PV, diagnostics, mastery, or Scale Gate sprint.

## Evidence to Inspect

- `reports/sprints/TASK-CONTEXT-RUNTIME-1-plan.md`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-baseline.md`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-planning-review.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `build-scripts/sprints/task-context-runtime1-fixture.js`
- `build-scripts/sprints/capture-task-context-runtime1-screenshots.js`
- `build-scripts/sprints/check-task-context-runtime1.js`
- `reports/json/task-context-runtime1-proof.json`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-rendered-lab.html`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-screenshot-manifest.md`
- `reports/sprints/TASK-CONTEXT-RUNTIME-1-command-log.jsonl`

## Review Questions

- Does the runtime validate stable `contextBlocks` IDs and task `contextRefs`?
- Does the UI render context before `.ts-task-list` and show student-facing
  reference labels without exposing raw `ctx-*` IDs?
- Are captions, source labels, alt text, and accessibility summaries rendered
  and checked for all supported context block types?
- Does mobile/dark proof show a usable rendered surface without horizontal page
  overflow?
- Does the review-only lab load shared runtime scripts and provide a
  deterministic completion path?
- Does the checker reject missing refs, unknown refs, unreferenced blocks,
  missing accessibility metadata, raw copied images, unsafe SVG, answer
  leakage, internal codes, and exit-ticket hints?
- Are protected references, source-data, and generated Book 1 output unchanged?
- Are any corrections required before closure?

## Reviewer

Lead reviewer: verification subagent plus main-agent structural round-2
recheck.

## Required Output

Round 1 must return PASS, PASS WITH FLAGS, REVISE, FAIL, or PAUSE with concrete
findings. Round 2 must recheck the corrected artifacts before closure.

Use the strict lead-review summary shape:

- Scope
- Review Plan
- Consolidated Verdict
- Blocking Findings
- Specialist Findings
- Test Evidence
- Learning Quality Evidence
- Student Experience Evidence
- Ownership and Handoff
- Required Next Action
