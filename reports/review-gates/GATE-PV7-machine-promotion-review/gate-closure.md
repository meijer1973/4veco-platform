# GATE-PV7 Machine Promotion Review: Gate Closure

Sprint: `PV.7`
Status: `pass_with_conditions`
Closed on: 2026-05-03

## Decision

PV.7 is closed as `pass_with_conditions`.

No Procedure-Visual records are authorized for promotion to `references/machine/` in PV.7. PV remains a governed `references/data/procedure-visual/` overlay.

## Accepted Outcomes

- PV schemas, validator, overlay records, and reports are sufficient for governed overlay use.
- PV.7 may close because the decision is clear: no machine promotion now.
- PV templates may continue referencing provisional `exercise_operations` only with explicit provisional status.
- `unit-template-links` are the safest future first candidate if promotion prerequisites are later met.

## Blocked Outcomes

- No `references/machine/procedure-templates.json` registry is authorized.
- No `references/machine/visual-states.json` registry is authorized.
- No `references/machine/unit-template-links.json` registry is authorized.
- No `references/machine/procedure-visual-vocab.json` registry is authorized.
- No provisional `exercise_operation` promotion is authorized through PV.7.
- No student-facing PV projection is authorized.
- No generator exposure for blocked units is authorized.
- No diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use is authorized.

## Explicit Decisions

| Topic | Decision |
|---|---|
| Gate status | Close PV.7 as `pass_with_conditions`. |
| Machine promotion | Do not promote any Procedure-Visual records to `references/machine` in PV.7. |
| Future first candidate | If prerequisites are later met, consider `unit-template-links` first. |
| Procedure templates and visual states | Keep procedure templates and visual states under `references/data/procedure-visual/` until renderer, surface-variant, accessibility, and lesson-regression maturity is stronger. |
| Operation references | PV may reference provisional `exercise_operations` only with explicit provisional status and no operation promotion. |
| Next required work | Add a bounded PV promotion-pipeline design sprint and PV-G4 lesson-regression proof before reopening machine promotion. |

## Required Conditions

- Do not create or edit any `references/machine` Procedure-Visual registry in PV.7.
- Keep procedure templates, visual states, vocabulary, and unit-template links under `references/data/procedure-visual/`.
- PV templates may reference provisional `exercise_operations` only with explicit provisional status.
- Do not promote provisional `exercise_operations` to governed operation records through PV.7.
- Design any future promotion path as CLI-backed with validators and mutation logs before machine registry creation.
- Require at least two lesson-side PV regression proofs before reopening promotion for student-facing or machine-authoritative PV records.
- Consider `unit-template-links` first in any future promotion attempt; keep procedure templates and visual states as data overlays until renderer and lesson-regression maturity is stronger.
- Do not authorize student-facing PV projection, generator exposure for blocked units, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.

## Next Allowed Sprint

`PV.8 Promotion Pipeline Design` may proceed as a non-mutating design sprint.

PV.8 must define CLI commands, validators, mutation-log schema, rollback model, and review gates for a future promotion attempt. It must not create PV `references/machine/` registries.
