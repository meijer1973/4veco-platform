# CP.6d Lead Review Assignment

Generated: 2026-05-20

Reviewer role: lead reviewer agent

## Scope

Review the completed CP.6d evidence-upgrade bundle before sprint closure.

Primary artifacts:

- `reports/sprints/CP.6d-plan.md`
- `references/data/sprints/CP.6d.plan.json`
- `reports/sprints/CP.6d-baseline.md`
- `reports/sprints/CP.6d-planning-review.md`
- `build-scripts/references/build-cp6d-graph-heavy-evidence.js`
- `build-scripts/review-gates/check-cp6d-graph-heavy-evidence.js`
- `references/data/sprints/CP.6d-graph-heavy-evidence.json`
- `reports/reference-planning/CP.6d-graph-heavy-evidence.md`

## Review Questions

1. Does CP.6d use current live lesson paths after L-CP6A, especially active `1.3.2 Marktevenwicht` and `1.3.3 Verschuivingen en nieuw evenwicht`?
2. Does the evidence ledger correctly distinguish current Part A review evidence, companion-review evidence, schema-versioned quality refs, and legacy/pre-schema quality refs?
3. Does CP.6d avoid hand-editing or authorizing mutation of lesson output, protected references, target exercises, placeholders, or machine units?
4. Does CP.6d keep CP-6 and Year 1 open and route the next action to CP.6e?
5. Are the validator rules strong enough to catch stale Chapter 1.3 mappings, missing companion reviews where required, closure claims, mutation claims, and product authorization?

## Expected Review Output

Return `PASS`, `PASS WITH FLAGS`, or `FAIL`.

If flags or failures are found, include required corrections with exact files and reasons.
