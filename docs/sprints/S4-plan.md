# Sprint S4: Exercise Metadata Overlay MVP

## Goal

Create the first protected-source-safe exercise metadata overlay for one Tier A external exam question and one Tier C owned target exercise, then prepare `GATE-CP3-schema-extension-dry-run` for human review before any bulk metadata extension.

## Context

CP-1 closed as `pass_with_conditions` and approved the schema naming and storage strategy:

- `required_units` is the canonical field for micro-teaching-unit IDs.
- `required_skills` remains a legacy/source field until an explicit migration sprint.
- `exercise_operations` is the canonical field for fine-grained exercise actions and may be empty until later backfill.
- `skill_tags` is the broader skill taxonomy field.
- `instructional_role` and `assessment_role` are separate fields.
- Missing `assessment_role` is represented by omitting the field.
- The four-field `scaffolding` object is required when scaffolding metadata is recorded.
- External exam-question metadata must use overlays under `references/data/exercises/`, not hand edits to `references/external/`.

CP-2 closed as `pass_with_conditions` and preserved the evidence boundary: owned exercise evidence is not external authority, and generated projections are not primary evidence.

## Allowed paths

- `docs/sprints/S4-plan.md`
- `references/data/sprints/S4.plan.json`
- `reports/sprints/S4-baseline.md`
- `references/data/exercises/`
- `references/schemas/exercise-metadata-overlay.schema.json`
- `build-scripts/references/check-exercise-overlays.js`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/`
- `references/reference-team-roadmap.md` for S4 status bookkeeping and roadmap versioning
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.5-representation-sensitive-phase.md`
- `reports/url-index.md` after bundle URL regeneration
- `references/data/source_manifest.json` and `references/data/document_inventory.json` after inventory regeneration

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- bulk mutation of `references/authored/course-target-exercises.json`
- generated RAG chunk hand-patching
- collapsing `instructional_role` and `assessment_role` into a single flat enum
- using `instructional_role: diagnostic` to authorize student diagnostics, adaptive routing, mastery logic, or any student-facing diagnostic product
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `reports/review-gates/GATE-CP1-schema-audit/gate-closure.json`
- `reports/review-gates/GATE-CP2-owned-source-scope/gate-closure.json`
- `references/external/exam-questions.json`
- `references/authored/course-target-exercises.json`
- `references/schemas/exam-question.schema.json`
- `references/schemas/target-exercise.schema.json`
- `references/machine/micro-teaching-units.json`
- `build-scripts/lib/verify_svg_geometry.py`
- `references/reference-team-roadmap.md`

## Outputs

- S4 sprint plan and plan JSON
- S4 baseline report
- provisional exercise metadata overlay schema
- one Tier A exam-question overlay dry-run record
- one Tier C target-exercise overlay dry-run record
- overlay validator
- CP-3 dry-run report JSON and Markdown
- CP-3 review packet JSON and Markdown
- CP-3 bundle URL file and updated global URL index
- refreshed source manifest and document inventory after new reference-governed files are added

## Operationalized sprint procedure

1. Record the S4 plan and baseline before creating overlays. The baseline must state current source counts and confirm that protected reference data starts unchanged.
2. Create a provisional overlay schema under `references/schemas/` and dry-run overlay files under `references/data/exercises/`. Stop immediately if the implementation would require writing to `references/external/`, `references/machine/`, or bulk editing `references/authored/course-target-exercises.json`.
3. Represent one Tier A external exam question and one Tier C owned target exercise with `required_units`, `exercise_operations`, `skill_tags`, split roles, scaffolding metadata, authority/evidence metadata, source stable IDs, source version, and curriculum version. Omit `assessment_role` where it is absent; do not write `null` or `not_applicable`.
4. Implement and run the overlay validator. The validator must confirm source-record existence, required unit IDs, allowed role vocabularies, scaffolding ranges, provenance fields, protected-source-safe storage, and product-boundary flags.
5. Prepare `GATE-CP3-schema-extension-dry-run/review-packet.md` and `.json` with all human review questions listed at once. The human review asks whether the dry-run is lossless enough for a reviewer to reconstruct the exercises without ambiguity.
6. Human review procedure for CP-3 closure: ask calibration questions, record every answer in `human-interview.md` and `.json`, analyze answer patterns, ask targeted follow-ups only if the answer pattern is inconsistent, produce a closure proposal, require explicit human confirmation, and only then create `gate-closure.md` and `gate-closure.json`.
7. Regenerate gate bundle URLs, the global URL index, the source manifest, and the document inventory. Validate the active sprint bundle and stop before bulk extension until CP-3 is closed.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S4-plan.md
node build-scripts/sprints/check-sprint-bundle.js S4
node build-scripts/references/check-exercise-overlays.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
```

## Rollback plan

If the overlay shape is rejected, revert the S4 commit or remove the S4 overlay schema, dry-run records, validator, CP-3 packet, and roadmap/versioning bookkeeping. No rollback is needed for `references/machine/` or `references/external/` because S4 must not edit them.

## Human review required

Yes. S4 prepares `GATE-CP3-schema-extension-dry-run` for human review. Bulk exercise metadata extension, source-field migration, and any broader metadata backfill remain blocked until CP-3 closes.
