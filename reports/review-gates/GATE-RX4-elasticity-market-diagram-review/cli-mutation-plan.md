# RX.4 CLI Mutation Plan

Status: `draft_pending_human_review`

Execution authorized: `false`

Mutation authorized: `false`

No `unit-add.js` command may run until `GATE-RX4-elasticity-market-diagram-review` closes with explicit CLI authorization.

## Lower-Risk First Lane

1. `A82` Elasticiteit berekenen uit tabelwaarden
2. `A84` Omzetverandering beoordelen met elasticiteit uit bron

## Conditional Graph Lane

3. `A83` Elasticiteit berekenen uit vraaggrafiek

`A83` may only execute if HCS resolves whether the unit keeps the demand-graph name, generalizes to P-Q graph elasticity, or remains held.

## Pre-Execution Checks

- Re-run live A-domain numbering check.
- Confirm gate closure authorizes CLI execution.
- Confirm dependencies and any naming decisions in gate closure.
- Confirm all candidate needs are live units.
- Confirm generator-blocked status is recorded.

## Forbidden Actions

- Do not execute `unit-add.js` before gate closure.
- Do not hand-edit `references/machine/`.
- Do not hand-edit `references/external/`.
- Do not mutate authored source files.
- Do not patch RAG chunks by hand.
- Do not expose these units in student-facing skill-tree or PV projection before generator/projection implementation.
