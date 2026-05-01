# RX.3b CLI Mutation Plan

Status: `draft_pending_human_review`

No CLI execution is authorized by this file.

## Required Order

1. `A77`
2. `A78`

## Required Pre-Execution Checks

- Re-run live A-domain numbering.
- Confirm `GATE-RX3b-producer-graph-lane-review` closure authorizes CLI execution.
- Confirm `A77` needs are approved by HCS.
- Confirm the `A78` dependency decision is approved by HCS.
- Confirm all candidate needs are live units or earlier approved graph-lane candidates.
- Confirm generator status is tracked as blocked/non-interactive.

## Commands

The JSON plan contains command templates for:

- `node build-scripts/references/unit-add.js --spec ...A77...`
- `node build-scripts/references/unit-add.js --spec ...A78...`

## Forbidden Actions

- Do not execute `unit-add.js` before gate closure explicitly authorizes CLI execution.
- Do not hand-edit `references/machine/`.
- Do not hand-edit `references/external/`.
- Do not mutate authored source files.
- Do not patch RAG chunks by hand.
- Do not expose these units in student-facing skill-tree or PV projection before generator/projection implementation.
