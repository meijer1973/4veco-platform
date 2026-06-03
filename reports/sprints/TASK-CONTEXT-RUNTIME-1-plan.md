# Sprint TASK-CONTEXT-RUNTIME-1: Shared Task Context Runtime

Generated: 2026-06-03

## Goal

Added shared task-shell validation/rendering for context blocks before tasks with source references, captions, semantic tables, SVG figures, and formula blocks.

## Context

This sprint is part of the shared task context and source ingestion track inserted before `CHECK-SHORT-EXIT-2` and `SCALE-PROOF-3P`. The product end state requires official and textbook source material to trace into the shared task-type UI, not to remain hidden behind isolated questions.

## Quality Standard

The quality floor is specification fulfilment within the bounded scope: rendered output must show the student-facing source/context before the task, proof must be testable by a human, and omitted full-product requirements must be named as follow-up work. Passing files or validators alone is not sufficient if the context remains unclear.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Context-first shared tasks | Source/context blocks before task controls | Runtime fixture, playable lab, screenshot proof | in scope |
| Source traceability | Source labels, captions, sourceRef, alt text | Checker and gate-material evidence | in scope |
| No shallow reduction | Task-family map and operation trace | Human review compares original action to task sequence | in scope |

## Quality Improvement Candidates

- include_now: context labels, captions, source refs, alt text, and visible task references.
- defer_named_follow_up: route-specific generated lesson adoption after the human gate.
- reject_scope_creep: Scale Gate 1, broad product use, diagnostics, mastery, or target-equivalent claims.

## Allowed paths

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `reports/sprints/`
- `reports/json/`
- `reports/review-gates/GATE-SHARED-TASK-INGEST-1-shared-task-context-and-ingestion-review/`
- `build-scripts/sprints/`
- `build-scripts/review-gates/`
- `../4veco-lessen/specifications/`
- `references/reference-team-roadmap.md`

## Forbidden paths

- No hand edits to generated lesson output.
- No protected reference mutation in `references/machine/` or `references/external/`.
- No source-data mutation, target-exercise promotion, diagnostics, mastery, sequencing, PV, Scale Gate 1, or broad product use.

## Inputs

- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`

## Outputs

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `build-scripts/sprints/check-task-context-runtime1.js`

## Operationalized sprint procedure

1. Inspect the current task-shell contract, renderer, roadmap row, and relevant product specs.
2. Produce or verify the sprint artifacts for this bounded step, then stop if context, source, visual, or task transformation evidence is missing.
3. Run the custom validator and sprint bundle checker; for the human gate, also prepare direct-comment review prompts, playable labs, proof JSON, and stop conditions.
4. Record lead-review round 1, corrections, and round 2 before closing this sprint or handing off to the next sprint.
5. If any output implies product-route adoption, target-equivalent proof, diagnostics, mastery, sequencing, or Scale Gate 1, stop and revise the sprint artifacts.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-RUNTIME-1
node build-scripts/sprints/check-task-context-runtime1.js
node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-RUNTIME-1 --complete
```

## Proof Required to Close

To close this sprint, proof requires validator/test evidence, sprint-bundle evidence, lead-review evidence, and reviewable rendered/playable proof where applicable. The next human gate may only be prepared after all cited sprint evidence exists.

## Rollback plan

Revert the platform runtime/context artifacts, generated reports, and roadmap status rows for this sprint. Do not touch protected reference data or generated lesson output.

## Human review required

No direct human review for this sprint; lead review is required before closure. The next human review is GATE-SHARED-TASK-INGEST-1.
