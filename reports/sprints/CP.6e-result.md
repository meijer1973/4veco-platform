# Sprint CP.6e: Result

## Plan reference

- Plan: `reports/sprints/CP.6e-plan.md`
- Baseline: `reports/sprints/CP.6e-baseline.md`
- Plan metadata: `references/data/sprints/CP.6e.plan.json`
- Result metadata: `references/data/sprints/CP.6e.result.json`

## Summary

CP.6e completed the focused non-mutating Part A re-review for `1.1.3 Grafieken en tabellen`.

Primary outputs:

- `references/data/sprints/CP.6e-113-part-a-rereview.json`
- `reports/reference-planning/CP.6e-113-part-a-rereview.md`
- `reports/reference-planning/CP.6e-113-part-a-remediation-handoff.md`
- `build-scripts/references/build-cp6e-113-part-a-rereview.js`
- `build-scripts/review-gates/check-cp6e-113-part-a-rereview.js`

Decision:

- `failed_clearance`
- Part A flag cleared: false
- Current live figure first-use sequence: `1 -> 3 -> 2`
- Expected first-use sequence: `1 -> 2 -> 3`
- The repeated worked example in `opgaven.md` is accepted as standalone-exercise scaffolding and is not treated as the remaining hard blocker.
- CP-6 and Year 1 remain open.

## Acceptance test results

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6e-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6e
node build-scripts/references/build-cp6e-113-part-a-rereview.js
node build-scripts/review-gates/check-cp6e-113-part-a-rereview.js
node scripts/check-book.js --paragraph-mode part-a --paragraph-profile publisher-print "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
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
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6e-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6e --complete
npm.cmd test
```

All listed commands pass after the closure-artifact, report, map, and inventory refresh.

Note: CP.6e's focused validator passes by confirming the failed-clearance state. This is the intended sprint outcome because the live lesson files still show the blocking figure-order issue.

## Changed files

Primary CP.6e artifacts:

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
- `references/data/sprints/CP.6e.result.json`
- `reports/sprints/CP.6e-diff-summary.md`
- `reports/sprints/CP.6e-lead-review-assignment.md`
- `reports/sprints/CP.6e-lead-review-round1.md`
- `reports/sprints/CP.6e-lead-review-corrections.md`
- `reports/sprints/CP.6e-lead-review-round2.md`

Roadmap and map surfaces:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.58-cp6d-graph-heavy-evidence-upgrade.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated report, source-manifest, document-inventory, source-document-registry, GitHub-agent-index, dashboard, and URL-index surfaces refreshed by normal tooling

## Data integrity notes

No protected reference data changed. CP.6e did not mutate `references/machine/` or `references/external/`, did not edit `references/authored/course-target-exercises.json`, did not edit `references/owned/course-blueprint-v5.md`, did not edit lesson output in `../4veco-lessen`, did not patch lesson review files or quality refs, did not mint units, did not promote target exercises, did not finalize placeholders, and did not write a CP-6 closure record.

CP.6e does not authorize CP-6 closure, Year-1 closure, student diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing generated output.

## Open follow-ups

- Route lesson-side remediation/regeneration for the `1.1.3` Part A figure-numbering issue.
- After the lesson team returns evidence, rerun a focused references-side recheck before any unconditioned CP-6 closure proposal.
- Do not draft a CP-6 closure proposal while the `1.1.3` Part A flag remains failed-clearance.

## Rollback instructions

Revert the CP.6e implementation commit. Because CP.6e is non-mutating, rollback removes only sprint artifacts, re-review reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.
