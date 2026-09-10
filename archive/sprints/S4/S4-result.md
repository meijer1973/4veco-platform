# Sprint S4: Result

## Plan reference

`docs/sprints/S4-plan.md`

## Summary

Completed S4 through the protected-source-safe exercise metadata dry run, CP-3 human review, and CP-3 gate closure.

`GATE-CP3-schema-extension-dry-run` closed as `pass_with_conditions`.

What S4 accomplished:

- Created a provisional exercise metadata overlay schema.
- Created one Tier A exam-question overlay dry-run record.
- Created one Tier C target-exercise overlay dry-run record.
- Added a read-only overlay validator.
- Preserved the CP-1 role split, omitted `assessment_role` when absent, and kept `required_units` as overlay-only successor to source `required_skills`.
- Preserved product-boundary flags: no diagnostics, adaptive routing, student-facing AI, mastery, summative use, or automatic sequencing.

What S4 did not authorize:

- no source mutation
- no bulk metadata backfill
- no hand edits to `references/external/`
- no bulk mutation of `references/authored/course-target-exercises.json`
- no hand-patched RAG chunks
- no governed operation registry yet

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js docs/sprints/S4-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js S4`
- `node build-scripts/references/check-exercise-overlays.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/sprints/check-bundle-urls.js GATE-CP3-schema-extension-dry-run`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-CP3-schema-extension-dry-run/gate-closure.json`

Sprint-close checks after this result artifact is written:

- `node build-scripts/sprints/check-sprint-result.js reports/sprints/S4-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js S4 --complete`

## Changed files

- `build-scripts/references/check-exercise-overlays.js`
- `build-scripts/references/build-reference-inventory.js`
- `docs/sprints/S4-plan.md`
- `references/data/sprints/S4.plan.json`
- `references/data/sprints/S4.result.json`
- `reports/sprints/S4-baseline.md`
- `reports/sprints/S4-result.md`
- `reports/sprints/S4-diff-summary.md`
- `references/schemas/exercise-metadata-overlay.schema.json`
- `references/data/exercises/README.md`
- `references/data/exercises/exam-question-overlays.json`
- `references/data/exercises/target-exercise-overlays.json`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.6-s4-cp3-dry-run.md`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `reports/url-index.md`

## Data integrity notes

No protected reference data changed.

S4 did not hand-edit:

- `references/machine/`
- `references/external/`

S4 did not bulk-mutate `references/authored/course-target-exercises.json` and did not hand-patch generated RAG chunks. All exercise metadata changes are represented in `references/data/exercises/` overlays.

## Open follow-ups

- Track Tier A source annex extraction gaps before broad Tier A overlay backfill.
- Mark `exercise_operations` as provisional until a governed operation registry exists.
- Add reviewer calibration notes for scaffolding scale values.
- Refine `graph_spec` representation values during broader coverage work.
- Strengthen warnings around `instructional_role: diagnostic` so it cannot be confused with product diagnostics.
- Reflect CP-3 conditions in the next sprint plan before any bulk metadata extension.

## Rollback instructions

Revert the S4 commits to remove the overlay schema, dry-run overlay records, validator, CP-3 artifacts, and roadmap/versioning bookkeeping. No protected reference data rollback is needed because S4 did not mutate `references/machine/` or `references/external/`.
