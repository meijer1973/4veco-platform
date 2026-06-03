# TASK-CONTEXT-SPEC-1 Planning Review

Date: 2026-06-03
Reviewer: planning/review subagent
Verdict: PASS WITH IMPLEMENTATION GUARDS

## Scope Checked

- Sprint plan: `reports/sprints/TASK-CONTEXT-SPEC-1-plan.md`
- Baseline: `reports/sprints/TASK-CONTEXT-SPEC-1-baseline.md`
- Plan data: `references/data/sprints/TASK-CONTEXT-SPEC-1.plan.json`
- Roadmap row: `TASK-CONTEXT-SPEC-1`
- Prior authority contract: `reports/json/exam-source-authority1-contract.json`
- Existing task-shell family contracts and runtime boundary

## Decision

The plan is ready for implementation inside the contract/checker/report scope.
It covers `contextBlocks`, task `contextRefs`, required block types, negative
fixture categories, and the explicit no-runtime/no-output boundary.

## Required Corrections Before Implementation

None.

## Implementation Guards

The implementation checker must verify the contract shape, not only string
presence:

- `contextBundle` exists with stable `contextBlocks` and task `contextRefs`.
- The positive fixture includes markdown, source excerpt, table, reconstructed
  SVG/figure, graph, flowchart, formula, and info/context blocks.
- Source-derived blocks cite the `EXAM-SOURCE-AUTH-1` authority shape,
  including source-material linkage where relevant.
- Every task `contextRefs` entry points to an existing block.
- Missing and unknown refs fail.
- Every non-review-only source/context block is referenced by at least one task.
- Visual and structured blocks require caption, source label, and `altText` or
  `accessibilitySummary`.
- Raw copied image/path dependency is rejected where reconstruction is required.
- Answer leakage is checked across context blocks, task prompts, hints,
  feedback, captions, and accessibility text.
- Internal codes such as MTU/PV/A15 are rejected in student-facing context/task
  text.
- Boundary flags remain false for runtime rendering, source reconstruction,
  task transformation, generated output, product adoption, target-equivalent
  proof, diagnostics, mastery/sequencing, PV, and Scale Gate authority.

## Evidence

- `check-sprint-plan` passed during planning.
- `check-sprint-bundle` passed during planning.
- No files were edited by the planning reviewer.

## Blockers

No planning blockers found.
