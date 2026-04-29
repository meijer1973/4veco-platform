# CP-3 Schema Extension Dry Run

Status: `prepared_for_human_review`

Sprint: `S4 Exercise Metadata Overlay MVP`

## Scope

This dry run represents one Tier A external exam question and one Tier C owned target exercise in the proposed exercise metadata overlay shape.

No protected source data was edited:

- `references/external/exam-questions.json`: unchanged.
- `references/machine/`: unchanged.
- `references/authored/course-target-exercises.json`: no bulk mutation; dry-run metadata is stored as an overlay.

## Dry-Run Records

| Record | Tier | Source | Required units | Role handling | Evidence status |
|---|---|---|---|---|---|
| `overlay:exam:ha-1022-a-23-1-o:opgave-1:question-2` | Tier A external exam | `references/external/exam-questions.json` | `A04` | `instructional_role=independent_practice`, `assessment_role=exam_mirror` | `source_values_not_extracted` |
| `overlay:target-exercise:1.1.3` | Tier C owned target exercise | `references/authored/course-target-exercises.json` | `A38`, `A45`, `A46` | `instructional_role=target`, `assessment_role` omitted | `owned_exercise_evidence` |

## Validator Result

Passed:

```bash
node build-scripts/references/check-exercise-overlays.js
```

The validator checks source-record existence, required unit IDs, role vocabulary, omitted `assessment_role`, scaffolding ranges, provenance fields, product-boundary flags, and authority labels.

## Known Limitations

- The Tier A exam-question dry run exposes a current extraction limit: the question says `Gebruik bron 1`, but the mirrored exam-question record does not include the source table values. The overlay therefore records `source_values_not_extracted`.
- The Tier C target exercise uses `A45` and `A46` in the overlay without mutating the authored source record. A later migration sprint must decide whether to write those `required_units` into the source.
- `exercise_operations` values are provisional dry-run strings. The governed operation registry is still future Sprint 7 / RX.5 work.

## CP-3 Decision Need

CP-3 must decide whether this overlay shape is lossless enough to proceed to broader metadata extension, or whether the schema/overlay shape needs repair first.
