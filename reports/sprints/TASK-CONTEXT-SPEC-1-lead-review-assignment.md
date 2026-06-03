# Lead Review Assignment: TASK-CONTEXT-SPEC-1

Generated: 2026-06-03

## Scope

Lead reviewer must inspect the task-context specification sprint before
closure. The review scope is limited to the context schema contract,
authoring/interchange fixture, deterministic checker, sprint artifacts,
command-log evidence, and boundary claims.

This is not a runtime-rendering or generated-output sprint.

## Evidence to Inspect

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

## Review Questions

- Does the contract define a stable `contextBundle` shape with
  `contextBlocks` and task `contextRefs`?
- Does the positive fixture include markdown, source excerpt, table,
  reconstructed SVG/figure, graph, flowchart, formula, and info/context blocks?
- Do source-backed blocks cite the `EXAM-SOURCE-AUTH-1` source authority and
  carry machine-checkable source provenance through `sourceRefs` or
  `sourceMaterialId` where relevant?
- Does the checker reject missing `contextRefs`, unknown refs, and
  unreferenced source/context blocks?
- Does the checker require captions, source labels, and `altText` or
  `accessibilitySummary` on the appropriate block types?
- Does it reject raw copied images where reconstruction is required?
- Does it reject answer-hint leakage across context blocks, task prompts,
  hints, feedback, captions, and accessibility text?
- Does it reject internal codes such as MTU/PV/A15 in student-facing text?
- Are runtime rendering, source reconstruction, task transformation, generated
  output, product-route adoption, target-equivalent proof, diagnostics,
  adaptive routing, mastery/sequencing, PV, Scale Gate authority, and student
  product use all explicitly excluded?
- Are any corrections required before closure?

## Reviewer

Lead reviewer: subagent structural lead review for context-spec contract.

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
