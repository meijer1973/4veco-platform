# CP-3 Gate Closure

Gate: `GATE-CP3-schema-extension-dry-run`

Sprint: `S4`

Status: `pass_with_conditions`

Closed on: 2026-04-29

Human confirmation: yes

## Summary

CP-3 is closed as `pass_with_conditions`.

S4 proved the overlay-first dry-run shape for one Tier A exam question and one Tier C target exercise. This closure does not authorize source mutation, uncontrolled bulk metadata backfill, or any student-facing/adaptive/summative product use.

## Accepted Outcomes

- The S4 dry-run overlay shape is good enough to proceed with overlay-first, protected-source-safe expansion planning.
- The Tier C target exercise is reconstructable from source plus overlay.
- The Tier A exam question is reconstructable as a task when the overlay honestly marks missing bron/source values.
- `required_units` is correctly used in overlays while source `required_skills` remains untouched.
- `instructional_role` and `assessment_role` remain separate orthogonal fields.
- `assessment_role` omission is accepted when absent.
- The four-field scaffolding object is accepted as structurally adequate.
- `graph_spec` and `precision_lint_status` are accepted for this dry run.
- Authority boundaries between `external_primary` and `owned_exercise_evidence` are preserved.

## Blocked Outcomes

- No source mutation is authorized.
- Do not hand-edit `references/external/`.
- Do not bulk-mutate `references/authored/course-target-exercises.json`.
- Do not patch RAG chunks by hand.
- Do not treat `source_values_not_extracted` as acceptable silent bulk behavior for Tier A overlays.
- Do not treat `exercise_operations` as a governed operation registry yet.
- Do not authorize student diagnostics.
- Do not authorize adaptive routing.
- Do not authorize student-facing AI.
- Do not authorize automatic mastery decisions.
- Do not authorize summative assessment use.
- Do not authorize automatic lesson sequencing.

## Conditions

- Keep external exam-question metadata in overlays; do not hand-edit `references/external/`.
- Keep target-exercise metadata overlay-first until a later approved source migration sprint.
- Track source annex extraction gaps before broad Tier A overlay backfill.
- Mark `exercise_operations` as provisional until a governed operation registry exists.
- Add reviewer calibration notes for scaffolding scale values.
- Refine `graph_spec` representation values during broader coverage work.
- Preserve product-boundary flags: no student diagnostics, adaptive routing, student-facing AI, mastery decisions, summative use, or automatic sequencing.

## Allowed Next Scope

Allowed next sprint: `S4.1`

Allowed scope:

- overlay-first protected-source-safe expansion planning
- bounded implementation of CP-3 conditions
- source annex extraction gap tracking
- scaffolding calibration notes
- stronger provisional `exercise_operations` wording
- `graph_spec` representation value refinement planning
- stronger product-boundary warnings

## Blocked Next Scope

- bulk metadata backfill without CP-3 conditions reflected in the plan
- source mutation
- student diagnostics
- adaptive routing
- student-facing AI
- automatic mastery decisions
- summative assessment use
- automatic lesson sequencing
