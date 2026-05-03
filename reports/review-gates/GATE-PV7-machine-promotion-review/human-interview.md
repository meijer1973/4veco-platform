# PV.7 Human Interview

Gate: `GATE-PV7-machine-promotion-review`
Sprint: `PV.7`
Reviewer role: Head of Content Strategy
Decision: `pass_with_conditions`

## Closure Decision

HCS authorizes closing PV.7 as `pass_with_conditions`.

Machine promotion is not authorized. No Procedure-Visual records should move from `references/data/procedure-visual/` to `references/machine/` in PV.7.

## Answers

| Question | Answer |
|---|---|
| PV7-Q1 | B. No. Schema, validator, overlay records, and reports exist, but PV machine-edit CLI, promotion mutation logs, and two lesson-side regressions are not yet present. |
| PV7-Q2 | A. No. Do not create `references/machine/procedure-templates.json`, `visual-states.json`, `unit-template-links.json`, or `procedure-visual-vocab.json` in PV.7. |
| PV7-Q3 | B. Unit-template links are the safest future first candidate, but only after CLI, mutation logs, and lesson-regression proof exist. |
| PV7-Q4 | A. Yes. Keep procedure templates and visual states in `references/data/procedure-visual/` until renderer, surface-variant, accessibility, and lesson-regression maturity is stronger. |
| PV7-Q5 | A. Yes, but only with explicit provisional status and no operation promotion. |
| PV7-Q6 | A. No. PV.7 authorizes no student-facing PV projection, generator exposure, diagnostics, adaptive routing, mastery, sequencing, AI, or summative use. |
| PV7-Q7 | B. Add a bounded PV promotion-pipeline design sprint and PV-G4 lesson-regression proof before reopening machine promotion. |
| PV7-Q8 | `pass_with_conditions`. |

## Pattern Analysis

The answers are internally consistent:

- PV data has reached governed overlay maturity, not machine-registry maturity.
- The promotion gap is missing infrastructure and proof, not a content-strategic ambiguity.
- `references/machine/` creation remains blocked.
- `unit-template-links` may be the first future candidate, but not in PV.7.
- Procedure templates and visual states remain in `references/data/procedure-visual/`.
- Provisional `exercise_operations` may remain referenced only with provisional status.
- No student-facing or adaptive product use is authorized.

## Required Conditions

- Do not create or edit any `references/machine` Procedure-Visual registry in PV.7.
- Keep procedure templates, visual states, vocabulary, and unit-template links under `references/data/procedure-visual/`.
- PV templates may reference provisional `exercise_operations` only with explicit provisional status.
- Do not promote provisional `exercise_operations` to governed operation records through PV.7.
- Design any future promotion path as CLI-backed with validators and mutation logs before machine registry creation.
- Require at least two lesson-side PV regression proofs before reopening promotion for student-facing or machine-authoritative PV records.
- Consider `unit-template-links` first in any future promotion attempt; keep procedure templates and visual states as data overlays until renderer and lesson-regression maturity is stronger.
- Do not authorize student-facing PV projection, generator exposure for blocked units, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.

## Explicit Human Confirmation

HCS authorizes closing `GATE-PV7-machine-promotion-review` as `pass_with_conditions`.

No Procedure-Visual records should move from `references/data/procedure-visual/` to `references/machine/` in PV.7.
