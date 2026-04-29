# Exercise Overlay Conditions

Status: `warn`

CP-3 status: `pass_with_conditions`

S4.1 implemented the CP-3 conditions in the overlay layer without source mutation or bulk metadata extension.

## Implemented Conditions

- Source annex gap tracking added.
- `exercise_operations` marked provisional.
- Scaffolding calibration notes added.
- `graph_spec` representation refinement plan added.
- Product-boundary warnings made mandatory.

## Current Warnings

### EXANNEX-001

Severity: high

Affected entity: `overlay:exam:ha-1022-a-23-1-o:opgave-1:question-2`

Category: `source_annex_values_not_extracted`

Evidence path: `references/data/exercises/source-annex-gap-log.json`

Next action: add source annex extraction workflow or preserve explicit `source_values_not_extracted` warning before broad Tier A overlay backfill.

Proof required to close: the referenced `bron 1` values are extractable through a reviewed source-annex record, or downstream tools visibly surface the reviewed extraction gap.

### OPS-PROVISIONAL-001

Severity: medium

Affected entity: `references/data/exercises/*-overlays.json`

Category: `provisional_operation_metadata`

Evidence path: `references/data/exercises/graph-spec-representation-plan.json`

Next action: keep `exercise_operations` provisional until Sprint 7, Sprint 12, or RX.5 creates a governed operation registry.

Proof required to close: a governed operation registry exists with schema, validator, and migration path.

## Boundaries

Still blocked:

- source mutation
- bulk metadata extension
- student diagnostics
- adaptive routing
- student-facing AI
- automatic mastery decisions
- summative assessment use
- automatic lesson sequencing
