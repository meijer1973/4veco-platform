# Sprint CP.6c: Lead Review Assignment

Date: 2026-05-20

Reviewer role: lead reviewer agent

## Assignment

Review the completed CP.6c classification artifacts for evidence completeness, boundary discipline, and closure safety.

CP.6c must be treated as a non-mutating classification sprint. It must not authorize protected reference mutation, unit minting, target-exercise promotion, placeholder finalization, lesson-output mutation, CP-6 closure, Year-1 closure, or any student-facing/product use.

## Artifacts to review

- `reports/sprints/CP.6c-plan.md`
- `references/data/sprints/CP.6c.plan.json`
- `reports/sprints/CP.6c-baseline.md`
- `reports/sprints/CP.6c-planning-review.md`
- `build-scripts/references/build-cp6c-mtu-backfill-classification.js`
- `build-scripts/review-gates/check-cp6c-mtu-backfill-classification.js`
- `references/data/sprints/CP.6c-mtu-backfill-classification.json`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`

## Review questions

1. Does the bundle classify exactly the nine REF-CT1 Year-1 backfill candidates?
2. Does each classification check the actual current MTU registry rather than stale rough-blueprint assumptions?
3. Are the existing-unit mappings to `A45`, `A46`, `A47`, `A48`, `A49`, and `A51` supported by live unit text?
4. Is deprecated `D04` handled only as historical design context, not as an active final mapping?
5. Is the kink-in-collective-demand candidate safely deferred without hiding future review needs?
6. Is the simultaneous-shift candidate properly classified as a true missing operation without authorizing mutation now?
7. Do the validator and reports block protected mutation, unit minting, closure, and product-use claims?
8. Are CP.6d, CP.6e, CP-6 closure, and Year-1 closure still open?

## Evidence already run before review

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6c-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6c
node build-scripts/references/build-cp6c-mtu-backfill-classification.js
node build-scripts/review-gates/check-cp6c-mtu-backfill-classification.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
npm.cmd test
```

All listed checks passed after refreshing the document inventory after the GitHub-agent indexes.

## Required output

Return a round-1 verdict of `PASS`, `PASS WITH FLAGS`, or `FAIL`.

If the verdict is not `PASS`, list required corrections precisely. The main agent will apply corrections once, log them, and send the bundle back for one recheck.
