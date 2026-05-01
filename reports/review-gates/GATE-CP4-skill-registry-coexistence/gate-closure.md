# CP-4 Gate Closure

Gate: `GATE-CP4-skill-registry-coexistence`

Sprint: `S7`

Status: `pass_with_conditions`

Closed on: 2026-05-01

Human confirmation: yes

## Summary

CP-4 is closed as `pass_with_conditions`.

S7 may close. The skill/operation registry remains a governed `references/data/` overlay. CP-4 accepts the field separation and coexistence structure, but it does not authorize machine registry promotion, bulk exercise metadata backfill, or product-surface use.

PV.0 is accepted as a dependency decision: Procedure-Visual templates may reference provisional `exercise_operations` only with explicit provisional status and no operation promotion.

## Accepted Outcomes

- `references/data/` is the correct S7 MVP storage location.
- `required_units`, `exercise_operations`, and `skill_tags` remain separate fields.
- `required_skills` remains legacy/source-only.
- Dutch broad `skill_tags` are accepted as the v1 broad taxonomy with alias/naming follow-up.
- English dry-run `skill_tags` are treated as provisional aliases/sub-tags until normalization review.
- `exercise_operations` remain provisional.
- Operation-to-unit mappings may support planning and review while remaining provisional.
- PV templates may reference provisional `exercise_operations` with explicit provisional status.

## Blocked Outcomes

- No `references/machine/exercise-operations.json` registry is authorized.
- No `references/machine/skill-tags.json` registry is authorized.
- No PV machine registry is authorized.
- No bulk exercise metadata backfill is authorized.
- Do not reuse `required_skills` for new semantics.
- Do not treat mapped operations as proof for uncontrolled backfill.
- Do not authorize student diagnostics.
- Do not authorize adaptive routing.
- Do not authorize student-facing AI.
- Do not authorize automatic sequencing.
- Do not authorize mastery decisions.
- Do not authorize summative decisions.
- Do not authorize unreviewed student-facing PV projection.

## Conditions

- Keep S7 skill/operation data in `references/data/` until schema, CLI, validators, mutation logs, and human promotion approval exist.
- Do not reuse `required_skills` for new semantics; it remains legacy/source-only.
- Keep `exercise_operations` provisional until a later governed registry path is approved.
- Treat English dry-run `skill_tags` as provisional aliases/sub-tags until normalization is reviewed.
- Do not create `references/machine/exercise-operations.json` or `references/machine/skill-tags.json` in S7.
- PV templates may reference provisional `exercise_operations` only with explicit provisional status.
- PV may not create `references/machine/procedure-templates.json` or `references/machine/visual-states.json` before the later PV machine-promotion gate.
- No student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative decisions, or unreviewed student-facing PV projection is authorized.

## Allowed Next Scope

Allowed next sprint: `PV.1`

Allowed scope:

- Procedure-Visual inventory under `references/data/procedure-visual/`.
- inventory of procedure prose, game/runtime data, operation blockers, visual needs, and candidate pilot templates.
- provisional references to `exercise_operations` only when status is explicit.
- PV.2 schema/validator planning after inventory preparation.

## Blocked Next Scope

- machine registry promotion.
- bulk exercise metadata backfill.
- source mutation in `references/external/` or `references/machine/`.
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.
- student-facing PV projection without later PV gates, generator support, and publication controls.
