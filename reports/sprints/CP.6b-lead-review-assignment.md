# Sprint CP.6b: Lead-Review Assignment

Date: 2026-05-20

Assigned reviewer: lead reviewer agent

## Scope

Review the completed CP.6b target-exercise review/design bundle before sprint closure.

## Files to review

- `reports/sprints/CP.6b-plan.md`
- `references/data/sprints/CP.6b.plan.json`
- `reports/sprints/CP.6b-baseline.md`
- `reports/sprints/CP.6b-planning-review.md`
- `build-scripts/references/build-cp6b-target-exercise-review.js`
- `build-scripts/review-gates/check-cp6b-target-exercise-review.js`
- `references/data/sprints/CP.6b-target-exercise-review.json`
- `reports/reference-planning/CP.6b-target-exercise-review.md`

## Review questions

1. Does the bundle stay inside CP.6b authority: review/design only, no protected mutation, no lesson-output mutation, no target-exercise promotion, no placeholder finalization, no CP-6 or Year-1 closure?
2. Does the generated review reflect the actual current registry state: nine migrated Book 1 records, three placeholder Book 1 records, and zero reviewed-final Book 1 records?
3. Are the three gemengde-opgaven draft designs integration/transfer tasks that introduce no new theory?
4. Does the report preserve the follow-up boundaries for CP.6c, CP.6d, and CP.6e?
5. Are the validator checks sufficient to catch accidental final-coverage, mutation, promotion, or product-use claims?

## Required output

Return one of:

- `PASS`
- `PASS WITH FLAGS`
- `FAIL`

If the verdict is not `PASS`, list required corrections in checkable terms.
