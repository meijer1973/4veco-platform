# Sprint CP.6b: Lead-Review Round 1

Date: 2026-05-20

Reviewer: lead reviewer agent

Verdict: FAIL

## Finding

The CP.6b target-exercise packet itself stays within the intended non-mutating review/design lane, but the validator is not strict enough for sprint closure.

The validator checks top-level non-mutation and non-closure booleans, counts, and record-level draft/non-final states. It does not yet assert the decision-level booleans in `references/data/sprints/CP.6b-target-exercise-review.json`, and it does not yet scan JSON/Markdown artifacts for affirmative closure or product-authorization claims.

## Required corrections

- In `build-scripts/review-gates/check-cp6b-target-exercise-review.js`, assert:
  - `review.decision.status === "non_final_review_packet_ready"`;
  - `review.decision.final_year1_coverage_allowed_now === false`;
  - `review.decision.cp6_closure_allowed_now === false`;
  - `review.decision.registry_mutation_allowed_now === false`.
- Expand the required blocked-outcome assertions to include every global blocked outcome carried by the review packet, including `placeholder replacement`, `mastery decisions`, `automatic sequencing`, and `student-facing generated output`.
- Add negative claim checks over both JSON and Markdown text so the validator fails if an artifact contains an affirmative closure/product claim such as `CP-6 closed`, `Year 1 closed`, `final coverage allowed`, `reviewed_final promotion authorized`, or `student-facing generated output authorized`.

## Passing checks

- Current registry counts are correct: 54 total target-exercise records, Book counts 12/12/14/16, and Book 1 has 9 migrated, 3 placeholders, 0 `reviewed_final`.
- The review report keeps the nine migrated records non-final and the three placeholder designs draft/not-final.
- CP.6c, CP.6d, and CP.6e boundaries are preserved in the remaining blockers and next-step routing.
- Protected/reference/lesson-output paths remain clean except for CP.6b artifacts.

## Validation observed by reviewer

```bash
node build-scripts/review-gates/check-cp6b-target-exercise-review.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6b-plan.md
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
```

All commands passed before correction, which confirms the validator weakness rather than a data-record failure.
