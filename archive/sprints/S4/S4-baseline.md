# Sprint S4: Baseline

## Plan reference

`docs/sprints/S4-plan.md`

## Current repository state

Sprint S4 starts after:

- CP-1 schema audit gate closed as `pass_with_conditions`.
- CP-2 owned-source scope gate closed as `pass_with_conditions`.
- R9.2 owned-content projection completed.
- The live roadmap identifies Sprint 4 / S4 as the next exercise metadata overlay sprint.

Current source counts:

- `references/external/exam-questions.json`: 349 exam-question records.
- `references/authored/course-target-exercises.json`: 49 target-exercise records.
- `references/data/exercises/`: new overlay surface for S4.

## Data integrity notes

No protected reference data is changed at baseline.

S4 must not hand-edit:

- `references/machine/`
- `references/external/`

S4 must also avoid bulk mutation of `references/authored/course-target-exercises.json`. The target-exercise dry run is represented as an overlay, not a source edit.

## Baseline risk

The known risk is semantic drift between the current source field `required_skills` and the approved overlay field `required_units`. S4 mitigates this by keeping source data untouched and proving the overlay shape on one Tier A item and one Tier C target exercise before CP-3 review.
