# Sprint CP.6b: Result

## Plan reference

- Plan: `reports/sprints/CP.6b-plan.md`
- Baseline: `reports/sprints/CP.6b-baseline.md`
- Plan metadata: `references/data/sprints/CP.6b.plan.json`
- Result metadata: `references/data/sprints/CP.6b.result.json`

## Summary

CP.6b completed the non-mutating Year-1 target-exercise review/design sprint.

Primary outputs:

- `references/data/sprints/CP.6b-target-exercise-review.json`
- `reports/reference-planning/CP.6b-target-exercise-review.md`
- `build-scripts/references/build-cp6b-target-exercise-review.js`
- `build-scripts/review-gates/check-cp6b-target-exercise-review.js`

The review records:

- 12 active-v5 Book 1 target-exercise records;
- 9 migrated records needing explicit v5 review artifacts;
- 3 placeholder records needing later teacher-learning-quality review and governed registry update;
- 0 `reviewed_final` records;
- 0 target-exercise promotions;
- 0 placeholder finalizations.

Draft integration designs were recorded for:

- `1.1.4 Gemengde opgaven: economisch denken en rekenen`;
- `1.2.4 Gemengde opgaven: vraag`;
- `1.3.4 Gemengde opgaven: aanbod en marktevenwicht`.

These drafts are not registry replacements and not final coverage evidence.

## Acceptance test results

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6b-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6b
node build-scripts/references/build-cp6b-target-exercise-review.js
node build-scripts/review-gates/check-cp6b-target-exercise-review.js
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
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6b-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6b --complete
npm.cmd test
```

All listed commands pass after the closure-artifact and inventory refresh.

Note: `npm test` through the PowerShell shim was blocked by local execution policy; `npm.cmd test` was used and passed with 515 tests passed and 8 skipped.

## Changed files

Primary CP.6b artifacts:

- `reports/sprints/CP.6b-plan.md`
- `references/data/sprints/CP.6b.plan.json`
- `reports/sprints/CP.6b-baseline.md`
- `reports/sprints/CP.6b-planning-review.md`
- `build-scripts/references/build-cp6b-target-exercise-review.js`
- `build-scripts/review-gates/check-cp6b-target-exercise-review.js`
- `references/data/sprints/CP.6b-target-exercise-review.json`
- `reports/reference-planning/CP.6b-target-exercise-review.md`
- `reports/sprints/CP.6b-result.md`
- `references/data/sprints/CP.6b.result.json`
- `reports/sprints/CP.6b-diff-summary.md`
- `reports/sprints/CP.6b-lead-review-assignment.md`
- `reports/sprints/CP.6b-lead-review-round1.md`
- `reports/sprints/CP.6b-lead-review-corrections.md`
- `reports/sprints/CP.6b-lead-review-round2.md`

Roadmap and map surfaces:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.55-exam-ingestion-north-star.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated report, source-manifest, document-inventory, GitHub-agent-index, dashboard, and URL-index surfaces refreshed by normal tooling

## Data integrity notes

No protected reference data changed. CP.6b did not mutate `references/machine/` or `references/external/`, did not edit `references/authored/course-target-exercises.json`, did not edit `references/owned/course-blueprint-v5.md`, did not edit lesson output in `../4veco-lessen`, did not mint units, did not mark migrated target exercises as reviewed final, did not replace or finalize placeholders, and did not write a CP-6 closure record.

CP.6b does not authorize CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing generated output.

## Open follow-ups

- Run `CP.6c Year-1 MTU Backfill Classification`.
- Then run `CP.6d Book 1 Graph-Heavy Evidence Upgrade`.
- Then run `CP.6e Focused 1.1.3 Part A Re-Review`.
- Do not draft a CP-6 closure proposal until CP.6c, CP.6d, and CP.6e evidence exists.

## Rollback instructions

Revert the CP.6b implementation commit. Because CP.6b is non-mutating, rollback removes only sprint artifacts, review/design reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.
