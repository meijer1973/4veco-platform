# RX.3a CLI Mutation Plan

Status: `draft_pending_human_review`

No CLI mutation is authorized by this plan.

## Required Execution Order

1. `A75`
2. `A76`
3. `A79`

`A79` depends on `A75`, so `A75` must be minted before `A79`.

## Required Pre-Execution Checks

- Re-run live A-domain numbering check.
- Confirm `GATE-RX3a-first-lane-mutation-review` closure authorizes CLI execution.
- Confirm `A76` needs include `A14`, `A04`, and `A61`.
- Confirm all candidate needs are live units or earlier approved first-lane candidates.
- Confirm generator status is tracked as blocked/non-interactive.

## Command Templates

The command templates are recorded in `cli-mutation-plan.json`. They use `node build-scripts/references/unit-add.js --spec ...` and have `execution_authorized: false`.

## Forbidden Actions

- Do not execute `unit-add.js` before gate closure explicitly authorizes CLI execution.
- Do not hand-edit `references/machine/`.
- Do not hand-edit `references/external/`.
- Do not mutate authored source files.
- Do not patch RAG chunks by hand.
- Do not expose these units in student-facing skill-tree use before generator implementation.
