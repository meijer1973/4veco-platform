# Sprint REASON-UX-2: Planning Review

Generated: 2026-05-31

Reviewer agent: Dalton (`019e7dea-e1b1-75b3-ae4c-f6f8623a877a`)

## Scope

Read-only planning review of:

- `reports/sprints/REASON-UX-2-plan.md`
- `reports/sprints/REASON-UX-2-baseline.md`
- `references/data/sprints/REASON-UX-2.plan.json`
- platform and lesson roadmaps
- product and companion specifications
- relevant reasoning and task-shell runtime files

## Initial Verdict

REVISE.

The plan was substantively aligned with the roadmap, but two blockers had to
be repaired before implementation:

1. Shared task-shell regression proof was missing. Because GRAPH-UX-2 and
   MATH-UX-2 already rely on the shared task-shell runtime, REASON-UX-2 either
   had to forbid shared task-shell edits or add route-output regression checks
   for both closed integrations.
2. Generated-output policy was not file-explicit enough. The plan named shared
   runtime files but did not list the exact Book 1 reasoning shell pages,
   reasoning data-file policy, or acceptable full-deploy byproducts.

## Corrections Applied

- The plan now constrains any shared `engines/task-shell-*` edit with
  GRAPH-UX-2 and MATH-UX-2 route-output regression checks.
- The acceptance tests now include:
  - `node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
  - `node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`
- The generated-output section now names the exact generated Book 1
  `redeneer-spel.html` shell paths for `1.1.1`, `1.1.2`, and `1.1.3`.
- The plan now states that `shared/reasoning/*.js` data files are expected to
  remain unchanged unless a named source-data builder command is run and
  recorded.
- The plan now requires acceptable full-deploy byproducts to be recorded as
  generated side effects and forbids those byproducts from introducing Check
  routes, target-equivalent copy, or protected reference mutation.
- `references/data/sprints/REASON-UX-2.plan.json` mirrors the corrected
  generated-output statement and acceptance tests.

## Final Verdict

PASS.

Blocking findings: none.

Nonblocking flags: none from this planning gate.

## Validation Evidence

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-UX-2-plan.md`: PASS
- `node build-scripts/sprints/check-sprint-bundle.js REASON-UX-2`: PASS
- protected-surface diff check: clean

## Required Next Action

Proceed to implementation under the repaired plan. Do not publish a
target-equivalent checkpoint, do not write protected references or exit-ticket
source data, and keep generated lesson output reproducible through platform
deploy/build commands only.
