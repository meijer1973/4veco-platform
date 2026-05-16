# S9a D04 CLI Mutation Plan

Sprint: S9a  
Gate: GATE-CP5-D04-resolution  
Status: ready for CLI execution

## Decision Source

CP-5 closed as `pass_with_conditions`. The decision direction is to redistribute D04 content to successor elasticity units and retire the standalone D04 unit later through CLI.

## Selected CLI Path

Use `unit-deprecate.js`, not merge or split.

```bash
node build-scripts/references/unit-deprecate.js --id D04 --replaced-by A15,D06,A17,D11,A16,D12,D27
```

Rollback command:

```bash
node build-scripts/references/unit-deprecate.js --id D04 --undo
```

## Replacement Units

- `A15` and `D06`: price-elasticity interpretation.
- `A17` and `D11`: income-elasticity normal, inferior, and luxury classification.
- `A16`, `D12`, and `D27`: cross-elasticity substitutes and complements.

## Pre-Execution Checks

- CP-5 closure exists and is human-confirmed.
- D04 is a unit-design issue, not a prerequisite-edge issue.
- Successor units `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27` are live catalog units.
- Split is not needed because no new unit IDs are required.
- Merge is not needed because CP-5 chose redistribution to multiple successor units, not absorption into one survivor.

## Forbidden Actions

- No hand edits to `references/machine/`.
- No hand edits to `references/external/`.
- No `D04 -> A15` edge.
- No merge or split without new human review.
- No external exam-question mutation.
- No exercise promotion, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.
