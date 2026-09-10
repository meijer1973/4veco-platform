# Sprint PV.1: Result

## Plan reference

`docs/sprints/PV.1-plan.md`

## Summary

Completed PV.1 as a non-mutating Procedure-Visual inventory sprint.

What PV.1 accomplished:

- Added `build-scripts/references/build-procedure-visual-inventory.js`.
- Added `build-scripts/references/check-procedure-visual-inventory.js`.
- Generated `references/data/procedure-visual/inventory.json`.
- Generated JSON and Markdown reports for the Procedure-Visual inventory.
- Ranked 12 pilot templates across flowchart, formula trace, graph-stage, table-trace, and graph/formula trace cases.
- Recorded that current micro-unit procedures are prose-only, procedure-game data lacks formal step IDs, `exercise_operations` remain provisional, and newer representation units remain generator/projection blocked.
- Updated the roadmap to `v2.21-pv1-procedure-visual-inventory` and made PV.2 the immediate next sprint.

What PV.1 did not authorize:

- no `references/machine/` mutation
- no `references/external/` mutation
- no PV machine registry
- no pilot procedure-template or visual-state records
- no lesson repo commits
- no student-facing PV projection, diagnostics, adaptive routing, student-facing AI, sequencing, mastery, or summative use

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.1-plan.md`
- `node build-scripts/references/build-procedure-visual-inventory.js`
- `node build-scripts/references/check-procedure-visual-inventory.js`
- `node build-scripts/sprints/check-sprint-bundle.js PV.1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.1-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js PV.1 --complete`
- `node build-scripts/references/check-roadmap-version-index.js`

## Changed files

- `build-scripts/references/build-procedure-visual-inventory.js`
- `build-scripts/references/check-procedure-visual-inventory.js`
- `references/data/procedure-visual/inventory.json`
- `reports/json/procedure-visual-inventory.json`
- `reports/markdown/procedure-visual-inventory.md`
- `docs/sprints/PV.1-plan.md`
- `references/data/sprints/PV.1.plan.json`
- `reports/sprints/PV.1-baseline.md`
- `reports/sprints/PV.1-result.md`
- `reports/sprints/PV.1-diff-summary.md`
- `references/data/sprints/PV.1.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.20-cp4-skill-operation-gate-closed.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Data integrity notes

No protected reference data changed.

PV.1 did not hand-edit:

- `references/machine/`
- `references/external/`

The PV.1 inventory is governed data under `references/data/procedure-visual/`. It is planning and schema input only, not curriculum authority, not a machine registry, and not student-facing material.

## Open follow-ups

- PV.2 must define the Procedure-Visual schemas, vocabulary, validator, and schema-status reports.
- PV-G1 must validate schema discipline before pilot data scales.
- Formal procedure-game step IDs remain absent and should be handled in PV.4.
- Generator/projection blockers remain active for the newer A-domain representation units until RX.6 or a later approved implementation sprint.

## Rollback instructions

Revert the PV.1 commit to remove the inventory builder/checker, inventory/report outputs, sprint records, roadmap update, and roadmap archive/index changes.

No protected reference data rollback is needed.
