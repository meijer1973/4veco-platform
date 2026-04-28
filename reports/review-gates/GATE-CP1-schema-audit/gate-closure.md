# CP-1 Gate Closure

Gate: `GATE-CP1-schema-audit`
Sprint: `S1`
Status: `pass_with_conditions`
Closed: 2026-04-28

## Summary

CP-1 is closed as `pass_with_conditions`.

The schema audit surfaced real schema/data mismatch, but the human reviewer accepted the naming contract and overlay strategy needed to proceed. R9.1 is now unblocked for owned-source registry and blueprint source-reference repair only.

## Accepted Outcomes

- `required_units` is the canonical field for micro-teaching-unit IDs.
- `exercise_operations` is the canonical field for fine-grained exercise actions.
- `skill_tags` is the canonical broader taxonomy field.
- `instructional_role` and `assessment_role` are separate fields.
- The HCS v1 `instructional_role` vocabulary is approved.
- `assessment_role` is optional and omitted when absent.
- The four-field `scaffolding` object is approved.
- External exam-question metadata must use overlays under `references/data/exercises/`.
- Authored target exercises use overlays first; source mutation waits for a later approved migration sprint.
- `build-scripts/lib/verify_svg_geometry.py` is the canonical current precision verifier path.
- R9.1 may proceed with owned-source registry and blueprint reference repair only.

## Blocked Outcomes

- Bulk exercise metadata backfill remains blocked until Sprint 4 and CP-3.
- Hand edits to `references/external/` remain blocked.
- Machine registry creation without schema, CLI, validator, and mutation log remains blocked.
- Student diagnostics remain blocked.
- Adaptive routing remains blocked.
- Student-facing AI remains blocked.
- Automatic lesson sequencing remains blocked.
- Automatic mastery decisions remain blocked.
- Summative assessment decisions remain blocked.

## Conditions

- The eleven HCS schema additions remain canonical Sprint 4 input. CP-1 decided names and storage strategy; it did not reduce the list.
- Role split and scaffolding object are non-negotiable for Sprint 4 unless a later review gate explicitly changes them.
- CP-1 through CP-8 remain the operating checkpoint structure.
- R9.1 scope is limited to owned-source registry, blueprint source-reference repair, source-surface classification, authority weights, and projection/evidence separation.
- Sprint 4 must include CP-3 dry-run on one Tier A item and one Tier C target exercise before bulk extension.
- `exercise_operations` may be empty without validation failure until Sprint 12 bootstraps the operations registry.
- External exam-question overlays must carry the source record stable ID and curriculum version.

## Next Sprint

R9.1 may start when the team is ready, limited to the approved owned-source registry and blueprint repair scope.
