# Sprint S7: Baseline

## Plan reference

`docs/sprints/S7-plan.md`

## Current state

S7 starts after S6 completed the source-document registry MVP. The relevant current state is:

- CP-1 approved `required_units`, `exercise_operations`, and `skill_tags`.
- CP-3 proved dry-run overlays but kept `exercise_operations` provisional.
- RX.1 created a 29-record representation-operation inventory.
- RX.2 and RX.2b added selected representation-sensitive A-units, but operation records are not yet governed.
- `references/authored/skill-categories.md` is still an authored taxonomy reference, not a governed registry.
- S4 dry-run overlays currently use English-style `skill_tags` values while the authored skill-categories reference uses Dutch broad categories.

## Data integrity notes

No protected reference data is changed at baseline.

Sprint S7 must not hand-edit:

- `references/machine/`
- `references/external/`

S7 must stop at the CP-4 review packet. It must not create `references/machine/exercise-operations.json`, `references/machine/skill-tags.json`, or any other machine registry without CLI-backed mutation tooling and human review.

## Baseline decision

Proceed with a governed `references/data/` overlay and CP-4 review packet. Do not close S7 until CP-4 is reviewed.
