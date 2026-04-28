# Sprint S1: Baseline

## Plan reference

`docs/sprints/S1-plan.md`

## Baseline state

S1 starts after the live roadmap update that made `S1 Schema Audit And Exercise Naming Contract` the immediate next sprint.

Known current state:

- `references/schemas/exam-question.schema.json` exists.
- `references/schemas/target-exercise.schema.json` exists.
- `references/schemas/rag-chunk.schema.json` exists.
- `references/external/exam-questions.json` is protected mirrored authority.
- `references/authored/course-target-exercises.json` is an authored reference and currently schema-sensitive.
- `references/data/rag/chunk_index.jsonl` is generated projection data.
- `build-scripts/lib/verify_svg_geometry.py` exists.

## Data integrity notes

No protected reference data is changed at baseline.

S1 forbids hand edits to:

- `references/machine/`
- `references/external/`

S1 also forbids bulk mutation of source exercise data. The sprint may write reports, sprint metadata, a CP-1 review packet, and the audit script only.

## Baseline risk

The known risk is not curriculum content. The known risk is schema contract drift:

- current data uses `required_skills` for unit IDs
- proposed roadmap names use `required_units`, `exercise_operations`, and `skill_tags`
- HCS requires `instructional_role`, `assessment_role`, and a four-field `scaffolding` object
- external exam-question metadata must not be hand-edited into protected files
