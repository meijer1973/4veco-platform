# Sprint PV.6: Diff Summary

## Summary

PV.6 added Procedure-Visual coverage reporting and dashboard integration.

## Added

- `build-scripts/references/build-procedure-visual-coverage.js`
- `build-scripts/references/check-procedure-visual-coverage.js`
- `reports/json/procedure-visual-coverage.json`
- `reports/markdown/procedure-visual-coverage.md`
- `reports/review-gates/GATE-PV6-coverage-dashboard/*`
- `docs/sprints/PV.6-plan.md`
- `references/data/sprints/PV.6.plan.json`
- `references/data/sprints/PV.6.result.json`
- `reports/sprints/PV.6-baseline.md`
- `reports/sprints/PV.6-result.md`
- `reports/sprints/PV.6-diff-summary.md`

## Updated

- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `reports/json/reference-health.json`
- `reports/markdown/reference-health.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/url-index.md`

## Archived

- `docs/roadmaps/outdated/reference-team-roadmap-v2.34-pv5-visual-projection-mvp.md`

## Protected surfaces

No protected surface was changed. PV.6 did not edit `references/machine/` or `references/external/`, did not create PV machine registries, did not mutate authored source files, and did not patch RAG chunks.

## Behavioral impact

No runtime behavior changes. The PV coverage and reference-health additions are diagnostic/reporting surfaces only.
