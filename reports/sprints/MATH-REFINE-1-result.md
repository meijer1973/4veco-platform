# Sprint MATH-REFINE-1: Result

Generated: 2026-05-31

Status: completed PASS WITH FLAGS as planning/preparation only.

## Plan reference

- Plan: `reports/sprints/MATH-REFINE-1-plan.md`
- Baseline: `reports/sprints/MATH-REFINE-1-baseline.md`
- Plan metadata: `references/data/sprints/MATH-REFINE-1.plan.json`
- Result metadata: `references/data/sprints/MATH-REFINE-1.result.json`

## Summary

MATH-REFINE-1 completed the math target-operation-chain hardening plan for
Book 1 `1.1.2 Percentages en indexcijfers`.

The sprint confirms that MATH-UX-2 remains useful local A38/A39
math/calculation practice and should be refactored rather than rebuilt from
scratch. It cannot be used as target-equivalent math evidence yet. The target
exercise requires A38, A39, and D31: percentage-change calculation,
price-index calculation, index-to-index percentage change, and an explicit
short explanation that 108 to 112 is 4 index points, not 4 percent. Current
generated route evidence scopes A38/A39 but not explicit checked D31 coverage,
so target-equivalent math reliance is blocked until a later implementation
sprint repairs the route and proves rendered output.

Produced artifacts:

- operation-chain plan for the `1.1.2` target exercise;
- task-coverage matrix marking covered, partial, missing, and blocked
  operations;
- implementation-prep record for a possible `MATH-REFINE-2`;
- gate handoff for `CHECK-Q2-PLAN`, `L1.7B-Q2`, and `GATE-L1.7B-Q2`;
- deterministic evidence checker;
- planning review and lead-review cycle.

No implementation, generated lesson output, protected reference mutation,
source exit-ticket creation, target-exercise field writes, candidate storage,
candidate writes, projection refresh, target-equivalent completion language,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use was authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MATH-REFINE-1-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MATH-REFINE-1` | passed |
| `node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-math-refine1-evidence.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/MATH-REFINE-1-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MATH-REFINE-1 --complete` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `npm.cmd run check:platform` | passed |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket` | passed, no output |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

- Added MATH-REFINE-1 plan, baseline, planning review, operation-chain plan,
  coverage matrix, implementation-prep, gate handoff, lead-review artifacts,
  result, and diff summary.
- Added `build-scripts/sprints/check-math-refine1-evidence.js`.
- Added MATH-REFINE-1 sprint metadata.
- Updated platform and lesson roadmaps and generated indexes during closure.

## Data integrity notes

No protected reference data changed. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`,
and `references/data/exam-ingestion/answer-skill-candidates.json` remain
unchanged.

No `source-data/book-*/exit-ticket/*.json` file was created or written. No
generated lesson output was regenerated or hand-edited. No math engine,
skilltree generator, or source implementation file was changed.

## Open follow-ups

- `MATH-REFINE-2` is recommended only if the team wants to implement the math
  route target-chain repair before broader Q2 work. This sprint does not
  authorize starting it.
- `CHECK-Q2-PLAN` must use the MATH-REFINE-1 coverage findings when planning
  target-equivalent calculation/index checkpoint composition.
- `L1.7B-Q2` and `GATE-L1.7B-Q2` remain required before target-equivalent
  completion claims.
- `REASON-REFINE-1` remains an authorized planning/preparation lane.
- Scale Gate 1 remains blocked.

## Rollback instructions

Revert the MATH-REFINE-1 sprint artifacts, evidence checker, result metadata,
roadmap/status updates, and generated navigation/index updates produced by
this sprint.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, math implementation files,
or answer-skill candidate storage as part of rollback.
