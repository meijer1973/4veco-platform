# Sprint PV.4: Diff Summary

## Summary

PV.4 adds the optional procedure-game mapping contract. Procedure-game records can now report whether they are fully mapped to PV template steps or remain legacy unmapped, while existing gameplay remains backward-compatible.

## Added

- `engines/tests/procedure-data-formal-step.test.js`
- `references/data/procedure-visual/procedure-game-alignment-pilots.json`
- `build-scripts/references/build-procedure-game-template-alignment.js`
- `reports/json/procedure-game-template-alignment.json`
- `reports/markdown/procedure-game-template-alignment.md`
- `reports/review-gates/GATE-PV4-procedure-game-contract/`
- `docs/sprints/PV.4-plan.md`
- `reports/sprints/PV.4-baseline.md`
- `reports/sprints/PV.4-result.md`
- `reports/sprints/PV.4-diff-summary.md`
- `references/data/sprints/PV.4.plan.json`
- `references/data/sprints/PV.4.result.json`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.31-pv3-pilot-procedure-visual-templates.md`

## Updated

- `engines/procedure-engine.js`
- `engines/tests/procedure-engine.test.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/url-index.md`

## Protected surfaces

No protected surfaces were edited. `references/machine/` and `references/external/` remain unchanged, and no PV machine registry was created.

## Deferred

- Forced migration of existing procedure-game data.
- PV.5 renderers and visual projection MVP.
- PV.6 dashboard/health coverage.
- PV.7 machine-promotion review.
- Any student-facing PV projection, visual renderer publication, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.
