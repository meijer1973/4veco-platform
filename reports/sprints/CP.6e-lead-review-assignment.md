# CP.6e Lead Review Assignment

Generated: 2026-05-21

Reviewer role: lead reviewer agent

## Scope

Review the completed CP.6e failed-clearance bundle before sprint closure.

Primary artifacts:

- `reports/sprints/CP.6e-plan.md`
- `references/data/sprints/CP.6e.plan.json`
- `reports/sprints/CP.6e-baseline.md`
- `reports/sprints/CP.6e-planning-review.md`
- `build-scripts/references/build-cp6e-113-part-a-rereview.js`
- `build-scripts/review-gates/check-cp6e-113-part-a-rereview.js`
- `references/data/sprints/CP.6e-113-part-a-rereview.json`
- `reports/reference-planning/CP.6e-113-part-a-rereview.md`
- `reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md`
- `reports/sprints/CP.6e-result.md`
- `reports/sprints/CP.6e-diff-summary.md`

## Review Questions

1. Does CP.6e use the live `1.1.3` Part A files?
2. Does CP.6e correctly classify the current figure first-use sequence as `1 -> 3 -> 2` and therefore failed clearance?
3. Does CP.6e avoid mutating lesson output, lesson review files, quality refs, protected references, target exercises, placeholders, and machine units?
4. Does CP.6e keep CP-6 and Year 1 open?
5. Does CP.6e route the next action to lesson-side remediation/recheck rather than EX-0 or closure?

## Expected Review Output

Return `PASS`, `PASS WITH FLAGS`, or `FAIL`.

If flags or failures are found, include required corrections with exact files and reasons.
