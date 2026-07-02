# Y2 Target Registry And Task Foundation Implementation 1 - Plan

Status: implementation plan

## Product End-State And Original Specs

Product end-state:

- `../4veco-lessen/specifications/product-end-state.md`

Original sprint/gate/source specs:

- `references/owned/course-blueprint-v6-three-year.md`
- `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-governed-mutation-plan.md`
- `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book5-pension-target-package.md`
- `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book6-housing-target-package.md`
- `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book7-risk-information-target-package.md`
- `reports/reference-planning/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1-book8-strategic-target-package.md`
- `reports/review-gates/Y2-EVIDENCE-BACKED-TARGET-FOUNDATION-WAVE-1/review-packet.json`

## Quality Floor

The PR must create the approved Year 2/v6 candidate surface exactly, preserve
the active v5 Books 1-4 registry, and make the downstream task-family, source,
answer-form, and product-use blockers inspectable. It must not generate
lessons, mutate MTUs, close OP rows, reinterpret product authority, or carry a
missing core requirement under a passing verdict.

## Required Work

1. Create `references/authored/year2-v6-target-foundation-candidates.json`.
2. Reproduce the four approved package JSON records without substantive change.
3. Add a strict schema and checker for the candidate surface.
4. Add source reconstruction foundation data for the four official families.
5. Add machine-readable answer contracts with subquestions, answer forms,
   correction-model point logic, source/table/graph requirements, and short
   answer models.
6. Add a full MTU/task-family compatibility review covering every OP row used
   by each record and record any protected MTU changes as later companion plans.
7. Add REV-STD-1 review evidence and single-account governance pilot data.
8. Publish as a draft PR, run exact-head CI/checker/branch-protection/readiness
   proof, then route to `READY_FOR_HUMAN_REVIEW`.

## Acceptance Tests

- `node --check build-scripts/references/check-y2-target-registry-and-task-foundation-implementation-1.js`
- `node build-scripts/references/check-y2-target-registry-and-task-foundation-implementation-1.js`
- `npm.cmd run check:review-throughput -- reports/review-gates/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1/review-packet.json`
- `npm.cmd run check:platform`
- After draft PR publish: `npm.cmd run check:branch-protection -- --repo meijer1973/4veco-platform --branch main`
- After draft PR publish and CI: `npm.cmd run review:pr-readiness -- --repo meijer1973/4veco-platform --pr <PR> --evidence reports/review-gates/Y2-TARGET-REGISTRY-AND-TASK-FOUNDATION-IMPLEMENTATION-1/readiness-evidence.json --format both`

## Stop Conditions

- Any installed record differs from the approved package JSON block.
- Active v5 target registry changes or contains the Year 2 candidate record IDs.
- The task-family review claims OP or production closure.
- Source reconstruction or answer contracts are missing for any record.
- Branch protection checker does not return full live output with `ok: true`.
- PR readiness route is not `READY_FOR_HUMAN_REVIEW` or exact-head evidence is
  stale.
