# Sprint CP.6d: Result

## Plan reference

- Plan: `reports/sprints/CP.6d-plan.md`
- Baseline: `reports/sprints/CP.6d-baseline.md`
- Plan metadata: `references/data/sprints/CP.6d.plan.json`
- Result metadata: `references/data/sprints/CP.6d.result.json`

## Summary

CP.6d completed the non-mutating Book 1 graph-heavy evidence upgrade.

Primary outputs:

- `references/data/sprints/CP.6d-graph-heavy-evidence.json`
- `reports/reference-planning/CP.6d-graph-heavy-evidence.md`
- `build-scripts/references/build-cp6d-graph-heavy-evidence.js`
- `build-scripts/review-gates/check-cp6d-graph-heavy-evidence.js`

The evidence ledger records:

- 9 active-v5 Book 1 graph-heavy records checked against the live lesson repo;
- 9 current exact Part A review files found;
- 3 companion-review-required records, all with current companion visual review files;
- 3 `schema_version: 2` quality refs;
- 6 legacy/pre-schema quality refs still needing a later quality workflow;
- 1 open `1.1.3` Part A `FLAG` routed to CP.6e;
- 0 active source/lesson mismatches for `1.3.2` / `1.3.3` after L-CP6A;
- 0 records allowed as CP-6 closure evidence now.

## Acceptance test results

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6d-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6d
node build-scripts/references/build-cp6d-graph-heavy-evidence.js
node build-scripts/review-gates/check-cp6d-graph-heavy-evidence.js
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
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6d-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6d --complete
npm.cmd test
```

All listed commands pass after the closure-artifact, report, map, and inventory refresh.

Note: an early `check-sprint-bundle.js CP.6d` run failed before the plan JSON used the standard `plan` pointer and before the baseline used the required standard headings. Those metadata/heading corrections were applied and the planned/active bundle check now passes.

Note: `npm.cmd test` exits 0 with 515 passing and 8 skipped tests. It prints expected validator-fixture warnings/errors for synthetic `9.x` fixtures during the passing test suite.

## Changed files

Primary CP.6d artifacts:

- `reports/sprints/CP.6d-plan.md`
- `references/data/sprints/CP.6d.plan.json`
- `reports/sprints/CP.6d-baseline.md`
- `reports/sprints/CP.6d-planning-review.md`
- `build-scripts/references/build-cp6d-graph-heavy-evidence.js`
- `build-scripts/review-gates/check-cp6d-graph-heavy-evidence.js`
- `references/data/sprints/CP.6d-graph-heavy-evidence.json`
- `reports/reference-planning/CP.6d-graph-heavy-evidence.md`
- `reports/sprints/CP.6d-result.md`
- `references/data/sprints/CP.6d.result.json`
- `reports/sprints/CP.6d-diff-summary.md`
- `reports/sprints/CP.6d-lead-review-assignment.md`
- `reports/sprints/CP.6d-lead-review-round1.md`
- `reports/sprints/CP.6d-lead-review-corrections.md`
- `reports/sprints/CP.6d-lead-review-round2.md`

Roadmap and map surfaces:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.57-cp6c-mtu-backfill-classification.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated report, source-manifest, document-inventory, source-document-registry, GitHub-agent-index, dashboard, and URL-index surfaces refreshed by normal tooling

## Data integrity notes

No protected reference data changed. CP.6d did not mutate `references/machine/` or `references/external/`, did not edit `references/authored/course-target-exercises.json`, did not edit `references/owned/course-blueprint-v5.md`, did not edit lesson output in `../4veco-lessen`, did not patch lesson quality refs, did not fabricate companion reviews, did not mint units, did not promote target exercises, did not finalize placeholders, and did not write a CP-6 closure record.

CP.6d does not authorize CP-6 closure, Year-1 closure, student diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing generated output.

## Open follow-ups

- Run `CP.6e Focused 1.1.3 Part A Re-Review`.
- A later quality-workflow sprint should upgrade legacy/pre-schema quality refs for `1.2.1`, `1.2.2`, `1.2.3`, `1.3.1`, `1.3.2`, and `1.3.3` where those records are used in a closure proposal.
- Do not draft a CP-6 closure proposal until CP.6e evidence exists and all remaining CP-6 closure blockers have explicit resolution or a human-approved hold.

## Rollback instructions

Revert the CP.6d implementation commit. Because CP.6d is non-mutating, rollback removes only sprint artifacts, evidence reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.
