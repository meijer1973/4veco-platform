# Sprint PV.1: Procedure-Visual Inventory

## Goal

Build the first non-mutating Procedure-Visual inventory under `references/data/procedure-visual/` so PV.2 can define schema and validator contracts from real unit, operation, runtime, and visual-surface needs.

## Context

CP-4 closed as `pass_with_conditions` and authorized PV templates to reference provisional `exercise_operations` only with explicit provisional status. It did not authorize machine registry promotion, bulk backfill, student-facing PV projection, diagnostics, adaptive routing, mastery decisions, sequencing, AI, or summative use.

PV.1 sits before large RX.3/RX.4 mutation work. Its purpose is to inventory the gap between prose procedures, provisional operation records, visual needs, and the existing procedure/skill-tree runtime surfaces.

## Allowed paths

- `docs/sprints/PV.1-plan.md`
- `references/data/sprints/PV.1.plan.json`
- `reports/sprints/PV.1-baseline.md`
- `references/data/procedure-visual/inventory.json`
- `build-scripts/references/build-procedure-visual-inventory.js`
- `build-scripts/references/check-procedure-visual-inventory.js`
- `reports/json/procedure-visual-inventory.json`
- `reports/markdown/procedure-visual-inventory.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.20-cp4-skill-operation-gate-closed.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/PV.1-result.md`
- `reports/sprints/PV.1-diff-summary.md`
- `references/data/sprints/PV.1.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/procedure-visual-vocab.json`
- mutation of `references/authored/course-target-exercises.json`
- mutation of `references/external/exam-questions.json`
- lesson repo commits or generated lesson target edits
- RAG chunk hand-patching
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/machine/micro-teaching-units.json`
- `references/data/skill-operation-registry.json`
- `source-data/book-1/`
- `engines/procedure-engine.js`
- `engines/procedure-ui.js`
- `build-scripts/platform/build-procedure-shells.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `engines/skilltree/generators.js`
- `references/authored/didactiek-principes.md`
- `references/authored/economic_mathematical_precision_reference.md`
- `reports/review-gates/GATE-CP4-skill-registry-coexistence/` CP-4 closure files

## Outputs

- Procedure-Visual inventory JSON under `references/data/procedure-visual/`.
- JSON and Markdown Procedure-Visual inventory reports.
- Ranked list of 8-12 pilot templates with unit IDs, representation type, visual type, inventory categories, provisional operation status, and blocker status.
- PV.2 schema requirements derived from current repository state.

## Operationalized sprint procedure

1. Record the PV.1 plan and baseline before generating inventory outputs.
2. Inspect micro-unit procedures, the S7 skill-operation registry, Book 1 source data, procedure-game runtime files, skill-tree shell generation, generator coverage, and authored didactic/precision references.
3. Build a deterministic Procedure-Visual inventory under `references/data/procedure-visual/`; stop if the work would require hand-editing `references/machine/` or `references/external/`.
4. Rank 8-12 pilot templates and require each to carry unit IDs, representation type, visual type, inventory categories, provisional operation status, blocker status, and student-facing projection status.
5. Mark operation references as provisional and allowed only under the CP-4 decision; do not promote any operation to a machine registry.
6. Record runtime blockers, especially missing formal step IDs in procedure-game data and generator/projection blockers for newer A-domain units.
7. Generate JSON and Markdown reports for PV.1 and validate them with a read-only checker.
8. Update the roadmap only after validation passes, moving PV.1 to completed and making PV.2 the next sprint.
9. Stop for human review if the inventory suggests machine promotion, bulk backfill, product-surface exposure, or lesson-side commits.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.1-plan.md
node build-scripts/references/build-procedure-visual-inventory.js
node build-scripts/references/check-procedure-visual-inventory.js
node build-scripts/sprints/check-sprint-bundle.js PV.1
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.1-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.1 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the PV.1 commit. That removes the inventory builder/checker, inventory/report outputs, sprint plan/baseline/result/diff files, sprint JSON files, and roadmap/version-index update.

No protected reference data rollback is needed because PV.1 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review gate is required for PV.1 because it is an inventory sprint only. PV.2/PV-G1 must define and validate the schema before pilot data scales.
