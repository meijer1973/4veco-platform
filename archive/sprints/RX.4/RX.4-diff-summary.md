# Sprint RX.4: Diff Summary

## Scope

RX.4 closed the elasticity representation review gate and applied the approved CLI-only mutation.

## Protected surfaces

`references/machine/micro-teaching-units.md` and `references/machine/micro-teaching-units.json` changed through `build-scripts/references/unit-add.js` only.

No `references/external/` files changed.

## Unit changes

- Added `A82` with needs `A15`, `A61`, and `A66`.
- Added `A84` with needs `A15` and `A67`.
- Added `A83` with needs `A15`, `A46`, and `A66`.

`A83` uses the HCS-approved name `Prijselasticiteit van de vraag berekenen uit P-Q-grafiek`.

## Governance changes

- Recorded `human-interview.*` and `gate-closure.*` for `GATE-RX4-elasticity-market-diagram-review`.
- Recorded `RX.4-mutation-log.*`.
- Updated generator-block records for `A82`, `A83`, and `A84`.
- Updated the roadmap to `v2.30-rx4-elasticity-market-applied` and archived `v2.29`.

## Generated outputs

- Regenerated reference report JSON and Markdown outputs.
- Regenerated RAG chunks and retrieval-eval outputs.
- Regenerated source manifest, document inventory, gate bundle URLs, and URL index.

## Product-boundary status

All three new units remain generator-blocked and non-interactive. No student-facing skill-tree use, PV projection, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use is authorized.
