# Sprint PV.2: Baseline

## Plan reference

Plan: `docs/sprints/PV.2-plan.md`

## Current state

PV.1 is complete. The repository has a Procedure-Visual inventory at `references/data/procedure-visual/inventory.json`, but it does not yet have PV schema files, a PV validator, PV schema-status reports, or technical PV-G1 proof artifacts.

The real PV registries are not yet allowed to contain pilot templates or visual states. PV.2 must establish the contract first.

## Data integrity notes

Protected reference data must not change in PV.2. No hand edits to `references/machine/` or `references/external/` are allowed, and no Procedure-Visual machine registry may be created.

## Baseline risks

- PV examples could accidentally become treated as real pilot data.
- Provisional `exercise_operations` could be promoted by implication if status checks are weak.
- Graph/chart visuals could pass without axes, units, labels, or non-color fallback.
- Student-facing projection could be accidentally implied by the presence of visual-state records.

## Acceptance baseline

PV.2 closes only if the validator passes on empty real registries plus schema examples, and if the roadmap records RX.3 as the next allowed sprint after PV.2.
