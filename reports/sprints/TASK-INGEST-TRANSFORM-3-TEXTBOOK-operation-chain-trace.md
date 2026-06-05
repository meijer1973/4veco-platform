# TASK-INGEST-TRANSFORM-3-TEXTBOOK Operation Chain Trace

Generated: 2026-06-05

Status: revised for `SHARED-TASK-INGEST-PLAYABLE-REPAIR-4` and reviewer
correction pass.

## Original Target

```text
Teken een P-Q-grafiek bij de tabel.
```

The renewed review required this target to become the primary active task, not
a source/context prompt or a long support checklist.

## Revised Operation Chain

| Operation | Required task | Evidence |
|---|---|---|
| construct P-Q graph from table | `tb113-graph-construction` | graph-attached axis controls, visible grid, table-derived tick labels after axis selection, two clicked table points, and line drawn in the same graph workspace |
| read quantity from constructed graph | `tb113-graph-reading` | Q at `P = EUR 1.75` |
| check one quantity-drop interval | `tb113-quantity-drop-check` | shared interval-halving task with auto-filled old/new quantities, relation selection, and conclusion choice |

## Removed Required Support Tasks

The following previous cards are no longer required:

- table-value warm-up;
- axis-only short response;
- graph-step ordering;
- single-point placement;
- interpolation source-value selection;
- source-chain builder;
- answer-form checker.

These were supporting micro-skills around the target, not the target itself.
Typed coordinate rows remain collapsed fallback evidence only; they are not the
primary graph-construction path.

Repair 4 removes the separate `Gemaakte grafiek` completed-graph block. The
constructed line appears inside the same active SVG workspace after the student
confirms `Trek lijn door punten`.

The reviewer correction pass also replaces generic quarter-scale numbers with
table-derived ticks and ensures the 50 percent task does not depend on an
interval-only final answer.
