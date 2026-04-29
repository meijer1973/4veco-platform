# Exercise Metadata Overlays

This folder stores protected-source-safe exercise metadata overlays.

The source files remain unchanged:

- `references/external/exam-questions.json`
- `references/authored/course-target-exercises.json`

CP-1 approved the overlay-first strategy because `required_skills` is still a legacy/source field while `required_units`, `exercise_operations`, `skill_tags`, split roles, scaffolding metadata, and source-version provenance are being tested.

Rules:

- Do not hand-edit `references/external/`.
- Do not bulk-mutate authored target exercises during Sprint S4.
- Carry `source_stable_id` and `curriculum_version` in every overlay record.
- Omit `assessment_role` when absent; do not use `null` or `not_applicable`.
- `instructional_role: diagnostic` is an exercise role only and does not authorize student diagnostics or adaptive routing.
- Generated artifacts and projections are not primary evidence.
- `exercise_operations` values are provisional until a governed operation registry exists.
- Source annex gaps must be tracked in `source-annex-gap-log.json` before any broad Tier A overlay backfill.
- Use `scaffolding-calibration.md` when assigning `verbal_level`, `visual_stage`, `fading_position`, and `dual_coding_present`.
- Product-boundary warnings are mandatory in every overlay record.
