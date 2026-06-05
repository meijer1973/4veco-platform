# TASK-INGEST-TRANSFORM-3-TEXTBOOK Operation Chain Trace

Generated: 2026-06-05

Status: revised for `SHARED-TASK-INGEST-PLAYABLE-REPAIR-3`.

## Original Target

```text
Teken een P-Q-grafiek bij de tabel.
```

The renewed review required this target to become the primary active task, not
a source/context prompt or a long support checklist.

## Revised Operation Chain

| Operation | Required task | Evidence |
|---|---|---|
| construct P-Q graph from table | `tb113-graph-construction` | correct axis convention, two clicked table points in the graph workspace, decreasing line confirmation |
| read quantity from constructed graph | `tb113-graph-reading` | Q at `P = EUR 1.75` |
| check one quantity-drop interval | `tb113-quantity-drop-check` | optional follow-up using table values and percent calculation |

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
