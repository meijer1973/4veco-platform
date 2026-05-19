# Sprint REF-CT2: Lead Review Assignment

Assigned on: 2026-05-19

## Scope

Review the `REF-CT2` Year-1 precision and dual-coding audit sprint bundle. The review must decide whether the non-mutating audit artifacts, CP-6 status update, roadmap insertion of `REF-CP6`, validators, and sprint logs are complete enough for off-site GitHub review, and whether corrections are required before REF-CT2 can be closed.

REF-CT2 must not be reviewed as a CP-6 closure gate. It only audits readiness and records blockers.

## Requested outcome

Produce a `Lead Review Summary` using the format in `agents/lead-reviewer-agent.md`, with one of these verdicts:

- `PASS`
- `PASS WITH FLAGS`
- `REVISE`
- `FAIL`
- `PAUSE`

Treat `REVISE`, `FAIL`, and `PAUSE` as non-closing outcomes.

## Evidence to inspect

- `reports/sprints/REF-CT2-plan.md`
- `reports/sprints/REF-CT2-baseline.md`
- `reports/sprints/REF-CT2-result.md`
- `reports/sprints/REF-CT2-diff-summary.md`
- `references/data/sprints/REF-CT2.plan.json`
- `references/data/sprints/REF-CT2.result.json`
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- `reports/reference-planning/REF-CT2-precision-dual-coding-audit.md`
- `reports/reference-planning/REF-CT2-graph-visual-surface-evidence.md`
- `reports/reference-planning/REF-CT2-cp6-status-update.md`
- `build-scripts/references/build-ref-ct2-precision-dual-coding-audit.js`
- `build-scripts/references/check-ref-ct2-precision-dual-coding-audit.js`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `reports/reference-planning/REF-CT1-cp6-review-packet.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.49-ref-ct1-year1-coverage-baseline.md`

## Required checks

- Confirm the REF-CT2 plan is co-located with the sprint logs under `reports/sprints/`.
- Confirm the audit contains exactly 12 active-v5 Book 1 records.
- Confirm the audit keeps CP-6 and Year 1 blocked with 0 CP-6 quality-ready records.
- Confirm `1.1.3` records current L1.6R `pass_with_flags` while preserving the remaining Part A `FLAG`.
- Confirm `1.3.2` and `1.3.3` source/lesson topic mismatches remain visible.
- Confirm the audit does not treat asset counts or quality-ref dual-coding prose as final semantic readiness.
- Confirm protected surfaces remain unchanged: no hand edit to `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen`.
- Confirm roadmap insertion of `REF-CP6` is justified by REF-CT2 blockers and does not close CP-6.
- Identify required corrections before the round-2 recheck.

## Commands expected before final close

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REF-CT2-plan.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT2
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/build-ref-ct2-precision-dual-coding-audit.js
node build-scripts/references/check-ref-ct2-precision-dual-coding-audit.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/REF-CT2-result.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT2 --complete
```

The round-1 review may request corrections before all final map/inventory checks pass, because the correction pass and recheck are part of the sprint closure procedure.
