# Procedure-Visual Promotion Pipeline Design

Sprint: `PV.8`
Gate: `GATE-PV8-promotion-pipeline-design`
Status: `design_only`

## Decision Boundary

PV.8 does not authorize machine promotion. It defines the future path required before a later gate may promote any PV record.

## First Candidate

Record class: `unit_template_links`

Current location: `references/data/procedure-visual/unit-template-links.json`

Future machine location: `references/machine/procedure-visual-unit-template-links.json`

Links are the thinnest PV record class. They connect existing unit IDs to existing PV template IDs without promoting renderer-facing procedure templates or visual states.

## Future Sequence

| Order | Phase | Status |
|---:|---|---|
| 1 | Promotion pipeline design | this_sprint |
| 2 | Lesson regression proof | required_before_promotion |
| 3 | Promotion CLI implementation | future_only |
| 4 | Unit-template link promotion gate | future_only |

## Proposed CLI Contract

| Command | Status | Purpose |
|---|---|---|
| `build-scripts/references/pv-promotion-plan.js` | proposed_not_implemented | Build a reviewed promotion candidate set without writing references/machine. |
| `build-scripts/references/pv-machine-promote.js` | proposed_not_implemented | Apply an explicitly authorized machine promotion set. |
| `build-scripts/references/pv-machine-rollback.js` | proposed_not_implemented | Rollback a prior PV machine promotion using the recorded mutation log. |

## Proposed Validators

| Validator | Status |
|---|---|
| `build-scripts/references/validate-procedure-visual-machine-links.js` | proposed_not_implemented |
| `build-scripts/references/check-procedure-visual-promotion-log.js` | proposed_not_implemented |
| `build-scripts/references/check-procedure-visual-publication-boundary.js` | proposed_not_implemented |

## Records Kept As Overlays

- `procedure_templates`: Templates contain procedure semantics and operation references; they should remain governed data until more renderer and lesson-regression proof exists.
- `visual_states`: Visual states are renderer and surface-variant facing; they need stronger accessibility, surface, and lesson-regression proof before machine authority.
- `procedure_visual_vocab_and_schemas`: Vocabulary and schema governance needs its own promotion design and should not be bundled into first link promotion.

## Boundary

- No `references/machine/` PV registry is created in PV.8.
- No provisional `exercise_operations` are promoted.
- No student-facing PV projection is authorized.
- PV-G4 lesson-regression proof remains required before reopening promotion.
