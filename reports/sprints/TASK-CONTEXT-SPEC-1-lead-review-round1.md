# Lead Review Summary

Sprint: `TASK-CONTEXT-SPEC-1`
Round: lead review round 1

## Scope

Artifact/task: `TASK-CONTEXT-SPEC-1` context contract and checker.

Requested outcome: decide whether the context schema contract, fixtures,
checker, command evidence, and no-runtime boundary were ready for closure.

Evidence inspected:

- `reports/sprints/TASK-CONTEXT-SPEC-1-lead-review-assignment.md`
- `reports/sprints/TASK-CONTEXT-SPEC-1-plan.md`
- `reports/sprints/TASK-CONTEXT-SPEC-1-baseline.md`
- `reports/sprints/TASK-CONTEXT-SPEC-1-planning-review.md`
- `references/data/sprints/TASK-CONTEXT-SPEC-1.plan.json`
- `reports/json/task-context-spec1-contract.json`
- `reports/sprints/TASK-CONTEXT-SPEC-1-context-contract.md`
- `build-scripts/sprints/check-task-context-spec1.js`
- `reports/json/exam-source-authority1-contract.json`
- `reports/sprints/EXAM-SOURCE-AUTH-1-source-authority.md`
- `reports/sprints/TASK-CONTEXT-SPEC-1-command-log.jsonl`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Context shape | Lead reviewer | `contextBlocks` and task `contextRefs` in JSON contract | PASS |
| Source provenance | Lead reviewer | source authority and source-material linkage | REVISE |
| Rejection coverage | Lead reviewer | negative fixtures and checker assertions | REVISE |
| Boundary claims | Lead reviewer | false product boundary flags | PASS |
| Command evidence | Lead reviewer | accepted tests in command log | REVISE |

## Consolidated Verdict

Verdict: REVISE

Reason: the core `contextBlocks` / `contextRefs` contract was mostly present
and the custom checker passed, but closure was blocked by incomplete
`svg_figure` provenance enforcement and a failing recorded `check:platform`
validation run.

## Blocking Findings

Blocking findings existed in round 1:

1. SVG/figure source provenance was not enforced at the same level as the
   written contract required. The written contract required source-derived
   structured blocks to carry `sourceMaterialId` for table, SVG/figure, graph,
   flowchart, and formula blocks, but the JSON rules did not require top-level
   `sourceMaterialId` for `svg_figure`. The checker only validated
   `sourceMaterialId` when present.
2. Recorded platform validation included a failing `npm.cmd run check:platform`
   run caused by the active Python interpreter missing `python-docx`.

## Specialist Findings

- The contract defined the required block types: `markdown`, `source_excerpt`,
  `table`, `svg_figure`, `graph`, `flowchart`, `formula`, and `info_box`.
- The checker validated `contextRefs`, unknown refs, and unreferenced blocks.
- The checker rejected raw copied images for `svg_figure`.
- Answer/internal-code scanning was implemented recursively over context/task
  text, but the reviewer recommended adding a hint/feedback leakage fixture.
- Boundary flags were explicitly false.

## Test Evidence

Passing checks available at review time:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-CONTEXT-SPEC-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js TASK-CONTEXT-SPEC-1`
- `node build-scripts/sprints/check-task-context-spec1.js`

Failing check visible in the command log at review time:

- `npm.cmd run check:platform` failed when Python could not import `docx`.

## Learning Quality Evidence

No student-facing learning surface was authorized. The plan limits proof to
fixtures, checker output, command logs, and lead review.

## Student Experience Evidence

No playable/runtime/student-facing proof is expected for this sprint. The plan
forbids runtime task-shell edits and generated lesson output.

## Ownership and Handoff

Lesson-side: no lesson output was authorized.

Platform: main agent owns the contract/checker corrections and validation.

Asset generation: none.

Registry/procedure: no protected reference mutation was authorized.

Quality log: round-1 findings must be resolved in
`reports/sprints/TASK-CONTEXT-SPEC-1-lead-review-corrections.md`.

Roadmap/human gate: no human gate; closure may proceed only after round-2 lead
review passes.

## Required Next Action

Correct SVG provenance enforcement, rerun `check-task-context-spec1`, rerun or
justify `check:platform`, record the correction log, and request lead review
round 2 before closing `TASK-CONTEXT-SPEC-1`.
