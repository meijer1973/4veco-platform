# Sprint S7: Skill And Operation Registry MVP

## Goal

Prepare a governed skill-and-operation registry MVP that separates micro-teaching-unit IDs from fine-grained `exercise_operations` and broader `skill_tags`.

## Context

CP-1 approved:

- `required_units` for micro-teaching-unit IDs
- `exercise_operations` for fine-grained learner actions
- `skill_tags` for broader taxonomy labels
- `required_skills` as a legacy/source field until an explicit migration

CP-3 allowed provisional `exercise_operations` in overlays but did not create a governed operation registry. RX.1 then produced a representation-operation inventory, and RX.2/RX.2b promoted selected A-domain candidates to live units while leaving the operation records provisional.

S7 should make the coexistence rules visible and reviewable before broad exercise metadata backfill.

## Allowed paths

- `docs/sprints/S7-plan.md`
- `references/data/sprints/S7.plan.json`
- `reports/sprints/S7-baseline.md`
- `references/schemas/skill-operation-registry.schema.json`
- `build-scripts/references/build-skill-operation-registry.js`
- `build-scripts/references/check-skill-operation-registry.js`
- `references/data/skill-operation-registry.json`
- `reports/json/skill-operation-registry.json`
- `reports/markdown/skill-operation-registry.md`
- `reports/review-gates/GATE-CP4-skill-registry-coexistence/`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.17-source-document-registry-mvp.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- regenerated inventories under `references/data/source_manifest.json` and `references/data/document_inventory.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/exercise-operations.json`
- creation of `references/machine/skill-tags.json`
- mutation of `references/authored/course-target-exercises.json`
- mutation of `references/external/exam-questions.json`
- RAG chunk hand-patching
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/authored/skill-categories.md`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `references/data/exercises/exam-question-overlays.json`
- `references/data/exercises/target-exercise-overlays.json`
- `references/machine/micro-teaching-units.json`
- `reports/review-gates/GATE-CP1-schema-audit/gate-closure.json`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/gate-closure.json`

## Outputs

- Skill-and-operation registry MVP under `references/data/`.
- JSON schema and validator for the MVP registry.
- JSON and Markdown coexistence report.
- CP-4 review packet with all review questions listed.

## Operationalized sprint procedure

1. Record the S7 plan and baseline before generating registry outputs.
2. Build a registry overlay from the authored skill-categories reference, RX.1 operation inventory, S4 dry-run overlays, and current live micro-unit catalog.
3. Keep `required_units` as the only canonical field for micro-teaching-unit IDs.
4. Mark `required_skills` as legacy/source-only; do not reuse it for a new meaning.
5. Keep all `exercise_operations` provisional until CP-4 decides governance and promotion rules.
6. Surface the current coexistence issue between Dutch broad category tags from `skill-categories.md` and English-style dry-run overlay tags.
7. Map operations to unit IDs only where the current catalog or dry-run overlays make the relationship explicit.
8. Generate CP-4 review packet questions covering storage, naming, tag vocabulary, operation status, mapping rules, and migration boundaries.
9. CP-4 human review procedure: ask all calibration questions in one packet, record every answer in `human-interview.md` and `.json`, analyze answer patterns for conflicts, ask targeted follow-ups only if the answer pattern is inconsistent, produce a closure proposal, require explicit human confirmation, and only then create `gate-closure.md` and `gate-closure.json`.
10. Validate the registry and sprint bundle. Stop at the CP-4 review packet in this preparation pass; do not close S7 or promote a machine registry without human review.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S7-plan.md
node build-scripts/references/build-skill-operation-registry.js
node build-scripts/references/check-skill-operation-registry.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/sprints/check-sprint-bundle.js S7
```

## Rollback plan

Revert the S7 preparation commit. That removes the registry overlay, report, schema, builder/checker scripts, CP-4 review packet, sprint artifacts, and roadmap/version-index update.

Do not manually patch `references/machine/` or `references/external/` for rollback.

## Human review required

Yes. `GATE-CP4-skill-registry-coexistence` must close before S7 is considered complete or any skill/operation registry is promoted beyond a governed `references/data/` overlay.
