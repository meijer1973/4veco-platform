# RX.1 Gate Closure

Gate: `GATE-RX1-representation-unit-scope`

Sprint: `RX.1`

Status: `pass_with_conditions`

Closed on: 2026-04-29

Human confirmation: yes

## Summary

RX.1 is closed as `pass_with_conditions`.

The representation-operation inventory is accepted as a planning basis and RX.2 mutation planning is authorized for a bounded first lane. This closure does not authorize direct unit mutation, source mutation, RAG chunk patching, diagnostics, adaptive routing, student-facing AI, sequencing, mastery decisions, or summative use.

## Accepted Outcomes

- The RX.1 inventory is complete enough for planning.
- A61-A84 are acceptable as provisional candidate IDs only.
- RX.2 mutation planning may proceed for a bounded first lane.
- The first RX.2 lane is limited to A61, A66, A67, A70, A72, and A74.
- Chart-only candidates may remain in the inventory as medium/high-risk candidates.
- Producer candidates should be split into table/data and graph implementation lanes.
- A82 and A84 may move earlier than the full producer-graph lane.
- The five held duplicate/overlap records are correctly blocked.

## Blocked Outcomes

- No direct unit mutation is authorized by RX.1.
- Do not mutate candidate IDs before re-checking live A-domain numbering.
- Do not mutate chart-only didactic-prior candidates without stronger evidence or explicit approval.
- Do not mutate A83 until graph/source-value readiness is confirmed.
- Do not mutate the five held duplicate/overlap records in RX.2.
- Do not hand-edit `references/machine/`.
- Do not hand-edit `references/external/`.
- Do not mutate authored source files.
- Do not patch RAG chunks by hand.
- Do not authorize student diagnostics.
- Do not authorize adaptive routing.
- Do not authorize student-facing AI.
- Do not authorize automatic lesson sequencing.
- Do not authorize automatic mastery decisions.
- Do not authorize summative assessment use.

## Conditions

- Re-check live A-domain numbering before mutation.
- Keep all candidate IDs provisional until CLI mutation execution.
- Do not mutate held duplicate/overlap records in RX.2.
- Keep chart-only didactic-prior candidates medium/high risk until stronger evidence or explicit approval.
- Split producer table/data and producer graph candidates into separate implementation lanes.
- Move elasticity A82/A84 earlier than producer-graph candidates; keep A83 conditional on graph/source-value readiness.
- Use CLI-only mutation; no hand edits to `references/machine/`, `references/external/`, authored source, or RAG chunks.
- No student diagnostics, adaptive routing, student-facing AI, mastery, sequencing, or summative use is authorized.

## Allowed Next Scope

Allowed next sprint: `RX.2`

Allowed scope:

- bounded RX.2 mutation planning
- live A-domain numbering check
- first-lane review for A61, A66, A67, A70, A72, and A74
- CLI-backed mutation plan preparation
- no mutation until RX.2 mutation review is explicit and CLI-backed

## Blocked Next Scope

- direct unit mutation without RX.2 mutation review
- chart-only first-wave mutation
- held duplicate/overlap record mutation
- hand edits to protected reference data
- student diagnostics
- adaptive routing
- student-facing AI
- automatic mastery decisions
- summative assessment use
- automatic lesson sequencing
