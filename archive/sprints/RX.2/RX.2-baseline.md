# Sprint RX.2: Baseline

## Plan reference

`docs/sprints/RX.2-plan.md`

## Starting state

RX.2 starts after `GATE-RX1-representation-unit-scope` closed as `pass_with_conditions`.

The allowed scope is bounded mutation planning only for:

- `A61`
- `A66`
- `A67`
- `A70`
- `A72`
- `A74`

Direct unit mutation remains blocked until `GATE-RX2-first-lane-mutation-review` explicitly authorizes CLI execution.

## Source state

- `references/machine/micro-teaching-units.json` is the protected live unit catalog.
- The live A-domain catalog currently ends at `A60`.
- `references/data/sprints/RX.1-representation-operation-inventory.json` is the planning input.
- `engines/skilltree/generators.js` currently lacks implementations for the proposed first-lane generators; this must be tracked, not silently ignored.

## Data integrity notes

No protected reference data is allowed to change in RX.2 packet preparation.

RX.2 must not hand-edit:

- `references/machine/`
- `references/external/`

RX.2 packet preparation must not execute `unit-add.js`, mutate authored source files, patch RAG chunks, or create student-facing diagnostic/adaptive behavior.

## Baseline risks

- `A70` needs a dependency adjustment because RX.1 listed deferred `A64` as a prerequisite while the RX.1 gate placed `A70` in the first lane.
- Generator implementations are missing for all six proposed units.
- Candidate IDs are provisional and must be rechecked immediately before any later mutation execution.
