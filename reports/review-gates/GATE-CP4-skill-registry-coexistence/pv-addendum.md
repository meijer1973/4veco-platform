# CP-4 Addendum: Procedure-Visual Dependency Decision

Status: `prepared_for_human_review`

Leadership approved the Procedure-Visual Backbone as a formal PV track. This addendum keeps that track inside the existing CP-4 skill/operation coexistence boundary instead of treating PV as authority to promote operations or machine registries.

## Decision Needed

Should Procedure-Visual templates be allowed to reference provisional `exercise_operations` from the S7 registry overlay?

Recommended answer: Yes, with conditions.

## Required Conditions

- PV templates may reference `exercise_operations` only when the operation is explicitly marked or reported as provisional.
- PV templates may not promote provisional `exercise_operations` to governed operation records before CP-4 closes.
- PV work starts under `references/data/procedure-visual/`.
- PV.0 through PV.6 may not create `references/machine/procedure-templates.json` or `references/machine/visual-states.json`.
- Machine promotion requires a later PV.7 review gate with schema stability, CLI support, validators, mutation logs, reports, lesson-side regression proof, and explicit human approval.

## Roadmap Consequence

If CP-4 accepts the dependency decision, PV.1 Procedure-Visual Inventory and PV.2 Procedure-Visual Schema And Validator MVP run before large RX.3/RX.4 mutation work expands. RX.3 and RX.4 then use PV constraints for producer graphs, elasticity diagrams, market diagrams, procedure games, and surface-specific visual variants.

## Blocked Until This Decision

- Treating PV operation references as more than provisional.
- Scaling PV pilot templates beyond inventory/schema MVP.
- Using PV records for student-facing generation without explicit generator support or non-interactive status.
- Any `references/machine/` PV registry creation.
