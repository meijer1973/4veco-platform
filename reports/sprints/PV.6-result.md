# Sprint PV.6: Result

## Plan reference

Plan: `docs/sprints/PV.6-plan.md`

## Summary

PV.6 completed Procedure-Visual coverage and dashboard integration.

The new coverage report tracks six PV-linked pilot units across procedure templates, visual-state sequences, rendered surface variants, procedure-game mapping, answer-model step order, generator support, generator-block status, and blocker reasons. `reference-health` now includes a `procedure_visual_backbone` summary with diagnostic-only and non-authority flags.

No PV machine registry, lesson target write, generator exposure, or student-facing PV projection is authorized.

## Acceptance test results

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.6-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-coverage.js
node build-scripts/references/check-procedure-visual-coverage.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV6-coverage-dashboard
node build-scripts/sprints/check-bundle-urls.js GATE-PV6-coverage-dashboard
node build-scripts/sprints/check-sprint-bundle.js PV.6
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.6-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.6 --complete
node build-scripts/references/check-roadmap-version-index.js
```

All listed acceptance tests pass.

## Changed files

- Added `build-scripts/references/build-procedure-visual-coverage.js`.
- Added `build-scripts/references/check-procedure-visual-coverage.js`.
- Added Procedure-Visual coverage JSON/Markdown reports.
- Updated `generate-reference-health.js` and `check-reference-health.js` with PV coverage summary checks.
- Regenerated `reports/json/reference-health.json` and `reports/markdown/reference-health.md`.
- Added `GATE-PV6-coverage-dashboard` technical packet and closure artifacts.
- Added PV.6 sprint plan, baseline, result, diff summary, and result JSON.
- Updated the roadmap to `v2.35-pv6-coverage-dashboard`, archived v2.34, and set RX.6 as the next sprint.

## Data integrity notes

No protected reference data changed. PV.6 did not hand-edit `references/machine/` or `references/external/`, did not create PV machine registries, did not mutate authored source files, did not patch RAG chunks, and did not touch lesson repositories.

PV coverage is diagnostic dashboard context only. It is not curriculum authority and does not authorize student-facing PV projection, generator exposure, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.

## Open follow-ups

- RX.6 should address skill-tree/generator integration while respecting generator-blocked status.
- PV.7 remains the machine-promotion review gate.
- A later publication gate is still required before any PV projection reaches students.

## Rollback instructions

Revert the PV.6 commit. This removes the PV coverage builder/checker, generated coverage report, reference-health PV summary changes, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.
