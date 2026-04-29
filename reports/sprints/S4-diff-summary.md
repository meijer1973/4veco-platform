# Sprint S4: Diff Summary

## Summary

S4 introduced a protected-source-safe exercise metadata overlay dry run and closed CP-3 as `pass_with_conditions`.

## Added

- `references/schemas/exercise-metadata-overlay.schema.json`
- `references/data/exercises/README.md`
- `references/data/exercises/exam-question-overlays.json`
- `references/data/exercises/target-exercise-overlays.json`
- `build-scripts/references/check-exercise-overlays.js`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/`
- `docs/sprints/S4-plan.md`
- `reports/sprints/S4-baseline.md`
- `reports/sprints/S4-result.md`
- `reports/sprints/S4-diff-summary.md`
- `references/data/sprints/S4.plan.json`
- `references/data/sprints/S4.result.json`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.6-s4-cp3-dry-run.md`

## Updated

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `build-scripts/references/build-reference-inventory.js`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `reports/url-index.md`

## Protected surfaces

No protected surfaces were edited.

Unchanged by hand:

- `references/machine/`
- `references/external/`

No bulk mutation was made to:

- `references/authored/course-target-exercises.json`

## Gate result

`GATE-CP3-schema-extension-dry-run` closed as `pass_with_conditions`.

The closure blocks source mutation, uncontrolled bulk metadata backfill, student diagnostics, adaptive routing, student-facing AI, automatic mastery, summative use, and automatic sequencing.
