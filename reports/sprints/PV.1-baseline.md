# Sprint PV.1: Baseline

## Plan reference

`docs/sprints/PV.1-plan.md`

## Current state

PV.1 starts after CP-4 closed as `pass_with_conditions`.

Current repository state before PV.1:

- `references/data/procedure-visual/README.md` exists as the planned overlay home.
- No Procedure-Visual inventory exists yet.
- `references/machine/micro-teaching-units.json` contains prose `procedure` arrays for many apply-level units.
- `references/data/skill-operation-registry.json` exists as a governed overlay, but `exercise_operations` remain provisional.
- `engines/procedure-engine.js` runs procedure games from step objects, but current runtime data has no formal PV step IDs.
- `build-scripts/platform/build-procedure-shells.js` reads target-side `shared/procedure/*.js` files; PV.1 must not commit lesson-target output.
- RX.2/RX.2b units remain generator-blocked and non-interactive until later generator/projection support.

## Data integrity notes

Protected reference data must not change in PV.1.

PV.1 may edit:

- `references/data/procedure-visual/inventory.json`
- report outputs under `reports/json/` and `reports/markdown/`
- PV.1 builder/checker scripts
- sprint records and roadmap/version-index files

PV.1 must not hand-edit:

- `references/machine/`
- `references/external/`

PV.1 must not create PV machine registries or lesson-repo commits.

## Baseline risks

- Procedure steps currently exist mostly as Dutch prose strings, not formal action/input/output records.
- The procedure-game runtime can execute steps but does not yet map them to formal PV step IDs.
- The skill-operation registry is useful for planning but still provisional after CP-4.
- Newer A-domain representation units are catalog-valid but generator-blocked.
- If PV.1 overreaches into schemas, machine registries, or lesson output, it would violate the CP-4 closure conditions.

## Stop conditions

Stop if:

- the inventory requires mutation of `references/machine/` or `references/external/`;
- a PV machine registry would need to be created;
- the ranked pilot list exceeds the inventory scope and starts creating pilot templates;
- provisional `exercise_operations` are treated as governed operation records;
- student-facing projection, diagnostics, adaptive routing, mastery, sequencing, AI, or summative use is implied;
- any PV.1 validator or sprint-bundle check fails and cannot be fixed within inventory scope.
