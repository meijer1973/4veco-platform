# Sprint RX.2b: Baseline

## Plan reference

`docs/sprints/RX.2b-plan.md`

## Starting state

RX.2b starts after `GATE-RX1-representation-unit-scope` and `GATE-RX2-first-lane-mutation-review` both closed as `pass_with_conditions`.

RX.2 correctly added only the table/index first lane:

- `A61`
- `A66`
- `A67`
- `A70`
- `A72`
- `A74`

Those units remain generator-blocked and non-interactive until generator implementation and validation.

## Source state

- `references/machine/micro-teaching-units.json` is the protected live unit catalog.
- The live A-domain catalog currently includes `A61`, `A66`, `A67`, `A70`, `A72`, and `A74`, but does not include `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, `A71`, or `A73`.
- `references/data/sprints/RX.1-representation-operation-inventory.json` is the planning input for the graphical foundation queue.
- `references/data/sprints/RX.2-generator-blocked-units.json` records the active generator block from RX.2.
- `engines/skilltree/generators.js` does not implement the proposed RX.2b generators.

## Data integrity notes

No protected reference data is allowed to change in RX.2b packet preparation.

RX.2b must not hand-edit:

- `references/machine/`
- `references/external/`

RX.2b packet preparation must not execute `unit-add.js`, mutate authored source files, patch RAG chunks, implement generators, or create student-facing diagnostic/adaptive behavior.

## Baseline risks

- `A71` is high risk because pie-chart percentage change can require share reading, share-times-total reconstruction, percentage-point distinction, and total comparison.
- The current aspects coverage checks are structural; they do not prove graphical foundation coverage.
- Any newly approved A-unit must remain generator-blocked and non-interactive until RX.6 or another explicitly authorized generator sprint.
- Candidate IDs must be rechecked immediately before any later CLI mutation execution.
