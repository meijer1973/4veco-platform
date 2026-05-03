# GATE-PV7 Machine Promotion Review: Review Packet

Sprint: `PV.7`
Status: `prepared_for_human_review`

This packet prepares the Procedure-Visual machine-promotion decision. It does not authorize machine registry creation or student-facing PV projection.

## Context

PV.1 through PV.6 created the governed `references/data/procedure-visual/` overlay, schemas, validator, six pilot templates, six visual states, unit-template links, procedure-game alignment proof, SVG projection proof, coverage reporting, and reference-health dashboard integration. RX.6 made generator-blocked skill-tree units explicit.

PV.7 asks whether any PV records should move into `references/machine/`. The readiness report shows that key promotion prerequisites are still absent: no PV machine-edit CLI, no PV machine-promotion mutation log, and no two lesson-side PV regression proofs.

## Readiness Report

- JSON: `reports/json/procedure-visual-machine-promotion-readiness.json`
- Markdown: `reports/markdown/procedure-visual-machine-promotion-readiness.md`
- Gate-local JSON: `reports/review-gates/GATE-PV7-machine-promotion-review/promotion-readiness.json`
- Gate-local Markdown: `reports/review-gates/GATE-PV7-machine-promotion-review/promotion-readiness.md`

## Recommended Decision

Do not promote PV records to `references/machine/` in PV.7. Keep all PV records under `references/data/procedure-visual/` and use PV.7 to record the future promotion path.

If HCS wants a future promotion path, the safest first candidate is `unit-template-links`, but only after a CLI-backed promotion workflow, mutation logs, and at least two lesson-side PV regressions exist. Procedure templates and visual states should remain governed data overlays until renderer and lesson-regression maturity is stronger.

## Review Questions

### PV7-Q1

Have the prerequisites for PV machine promotion been met?

Recommended answer: B. No. Schema, validator, data overlay, and reports exist, but PV machine-edit CLI, promotion mutation logs, and two lesson-side regressions are not yet present.

### PV7-Q2

Should PV.7 create references/machine Procedure-Visual registries now?

Recommended answer: A. No. Do not create references/machine/procedure-templates.json, visual-states.json, unit-template-links.json, or procedure-visual-vocab.json in PV.7.

### PV7-Q3

If a future promotion path is approved, which record class should be considered first?

Recommended answer: B. Unit-template links are the safest future first candidate, but only after CLI, mutation logs, and lesson-regression proof exist.

### PV7-Q4

Should procedure templates and visual states remain governed references/data overlays for now?

Recommended answer: A. Yes. Keep templates and visual states in references/data/procedure-visual until renderers, surface variants, accessibility proof, and lesson regressions are more mature.

### PV7-Q5

May PV continue referencing provisional exercise_operations?

Recommended answer: A. Yes, but only with explicit provisional status and no operation promotion.

### PV7-Q6

Does PV.7 authorize student-facing PV projection, generator exposure, diagnostics, adaptive routing, mastery, sequencing, AI, or summative use?

Recommended answer: A. No. All downstream product surfaces remain blocked.

### PV7-Q7

What follow-up should close the readiness gap before any later promotion attempt?

Recommended answer: B. Add a bounded PV promotion-pipeline design sprint and PV-G4 lesson-regression proof before reopening machine promotion.

### PV7-Q8

What gate status should GATE-PV7-machine-promotion-review receive?

Recommended answer: pass_with_conditions, with machine promotion explicitly not authorized.

## Required Conditions If Gate Passes

- Do not create or edit any references/machine Procedure-Visual registry in PV.7.
- Keep procedure templates, visual states, vocabulary, and unit-template links under references/data/procedure-visual.
- PV templates may reference provisional exercise_operations only with explicit provisional status.
- Record any future promotion design as CLI-backed with mutation logs before machine registry creation.
- Require at least two lesson-side PV regression proofs before reopening promotion for student-facing or machine-authoritative PV records.
- Do not authorize student-facing PV projection, generator exposure for blocked units, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.
