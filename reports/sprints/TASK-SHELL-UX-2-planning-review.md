# TASK-SHELL-UX-2 Planning Review

Verdict: PASS

Reviewer: planning/review subagent `019e8329-04d1-7f81-aac5-c65db4036b6f`

## Findings

The plan is operational and safe to implement. It defines the right quality
floor, cites the product and companion specifications, names required proof
surfaces, permits the necessary task-shell engine/UI/test/generated-output
files, and blocks dangerous paths: protected references, target-exercise
registry writes, new target-equivalent paragraphs, candidate storage,
diagnostics, mastery/sequencing, Scale Gate 1, and product-wide authority.

The reviewer verified:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-SHELL-UX-2-plan.md`
  passes.
- `node build-scripts/sprints/check-sprint-bundle.js TASK-SHELL-UX-2`
  passes.
- Roadmap rows match the sprint scope.
- Specifications support the exact requirements: hidden hints, separate
  unit/notation fields, one controlled feedback region, clear next action, and
  strict exit-ticket hint boundaries.
- Current task-shell files make the planned work feasible:
  `calculation_work_capture` lacks unit/notation collection, task-shell hints
  are not yet standardized, and `exit-ticket-ui.js` needs feedback-region
  focus hardening.
- Existing test files named in the plan are present.

## Required Corrections

None before implementation.

## Implementation Watchpoints

1. The unit/notation contract must not break the reviewed `1.1.2` index answer
   `108`.
2. Exit-ticket tasks must expose no content hints.
3. The UI contract must define the exact `structured_short_response` and
   unit/notation schema before closure.
4. Generated lesson proof must come only from `node scripts/deploy.js`, not
   hand edits.
