# Sprint S9a: Baseline

## Plan reference

`docs/sprints/S9a-plan.md`

## Current state

S9 is complete and `GATE-CP5-D04-resolution` is closed as `pass_with_conditions`. The human-confirmed decision says D04 content should be redistributed to successor elasticity units and the standalone D04 unit should be retired later through CLI. S9 intentionally kept `protected_reference_data_changed: false`.

At baseline, `D04 Elasticiteit en goederenclassificatie` is still live in `references/machine/micro-teaching-units.json`. It has empty `needs`, term `inkomenselasticiteit`, exam codes `D1.7` and `D1.8`, and no `deprecated` flag.

The successor mapping approved by CP-5 is:

- `A15` and `D06` for price-elasticity interpretation.
- `A17` and `D11` for income-elasticity normal, inferior, and luxury classification.
- `A16`, `D12`, and `D27` for cross-elasticity substitutes and complements.

The active authored target exercise `2.1.3` still cites `D04` in `required_skills` and `new_skills_introduced`, while already citing the relevant successor units. The external exam-question citation to D04 remains read-only because `references/external/` is protected machine-refreshed input.

## Data integrity notes

Protected reference data may change in S9a only through the governed unit lifecycle CLI. No hand edits to `references/machine/` or `references/external/` are allowed. The expected protected mutation is `node build-scripts/references/unit-deprecate.js --id D04 --replaced-by A15,D06,A17,D11,A16,D12,D27`.

S9a must not create a D04 prerequisite edge, must not mutate external exam-question data, and must not authorize diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.

## Baseline risks

- A naive deprecation could leave D04 visible as an unresolved active dependency in target-exercise evidence.
- Generated reports and historical gate artifacts will still mention D04; the stale-reference audit must distinguish historical/provenance mentions from active stale source requirements.
- Unit-design-status tooling is currently S9-oriented and may need a post-mutation state so reports do not keep describing D04 as unresolved.
- `R8-QC-007` may remain active unless its proof-to-close state is updated after the CP-5 closure and S9a mutation log exist.

## Acceptance baseline

S9a closes only when the mutation plan, CLI mutation log, stale-reference audit, unit-design-status update, regenerated reports/RAG/inventories, roadmap bookkeeping, and sprint bundle all validate.
