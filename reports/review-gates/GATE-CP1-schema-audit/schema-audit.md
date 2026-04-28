# CP-1 Schema Audit

Generated: 2026-04-28T21:18:06.045Z

## Summary

The current repository is ready for a non-mutating schema decision gate, but not ready for bulk exercise metadata implementation.

Main findings:

- Current schemas and current data shapes are not equivalent contracts.
- `required_skills` currently means micro-teaching-unit IDs in source data.
- Exercise metadata for external exam questions must live in overlays or refresh outputs, not hand edits.
- All 49 target exercises still point to `knowledge/course_blueprint_v4.md`.
- The SVG verifier exists at `build-scripts/lib/verify_svg_geometry.py`.

## Baseline Counts

| Surface | Count |
|---|---:|
| Exam questions | 349 |
| Target exercises | 49 |
| RAG chunks | 863 |
| Target exercises pointing to old blueprint path | 49 |

## Schema/Data Findings

### Exam Questions

Required fields in schema:

```json
[
  "id",
  "source_document_id",
  "question_number"
]
```

Current data fields missing from schema include:

```json
[
  "exam",
  "level",
  "opgave_name",
  "opgave_num",
  "page_end",
  "page_start",
  "points",
  "question_num",
  "required_skills",
  "text",
  "tijdvak",
  "year"
]
```

### Target Exercises

Required fields in schema:

```json
[
  "id",
  "book",
  "required_units"
]
```

Current data fields missing from schema include:

```json
[
  "chapter",
  "difficulty",
  "difficulty_notes",
  "exam_codes",
  "lesson_goals",
  "module",
  "new_skills_introduced",
  "paragraph_title",
  "prior_knowledge_assumed",
  "required_skills",
  "source_ref",
  "target_exercise"
]
```

### RAG Chunks

The chunk schema covers the minimal retrieval contract, but current chunks already carry additional governance fields. Sprint 4 and R7.6 should regenerate chunks from approved source and overlay data rather than patch chunks by hand.

## Recommended CP-1 Outcome

Close CP-1 as `pass_with_conditions` if the human reviewer approves:

- `required_units`
- `exercise_operations`
- `skill_tags` or `skill_category_tags`
- `instructional_role` and `assessment_role`
- the four-field `scaffolding` object
- protected-source-safe overlays under `references/data/exercises/`
- `build-scripts/lib/verify_svg_geometry.py` as the current verifier path

Do not proceed to bulk metadata backfill until CP-3 passes.
