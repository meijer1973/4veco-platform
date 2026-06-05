# TASK-INGEST-TRANSFORM-3-TEXTBOOK Task-Family Map

Generated: 2026-06-05

Status: target-first map after repair-4 interaction-clarity revision and
reviewer correction pass.

## Original Target To Transformed Task

Original:

```text
Teken een P-Q-grafiek bij de tabel.
```

Transformation:

```text
graph_construction_substitute -> graph_reading -> calculation_work_capture
```

| Task | Family | Target role |
|---|---|---|
| `tb113-graph-construction` | `graph_construction_substitute` | primary click-to-place graph construction with graph-attached axes, visible grid, table-derived tick labels, delayed labels/scale, and same-workspace line |
| `tb113-graph-reading` | `graph_reading` | immediate graph-reading follow-up |
| `tb113-quantity-drop-check` | `calculation_work_capture` | shared `interval_halving_check` variant with interval choice, auto-filled quantities, relation selection, and conclusion choice |

## Target-Task Economy

The revised task set has max 3 cards. It removes support-family coverage as a
goal. A card is included only if it is part of the original target sequence or
an explicit follow-up.

Rejected overbuild:

- table-reading card before graph construction;
- axis-only card outside graph construction;
- step-ordering card;
- one-point placement card outside the graph workspace;
- typed coordinate rows as the primary graph-construction path;
- separate completed-graph output below the workspace;
- hidden initial grid;
- free-form interval plus unit fields for the 50 percent follow-up;
- generic quarter-scale ticks instead of table-derived axis numbers;
- interval-only acceptance for the 50 percent follow-up;
- source-chain card;
- separate answer-form card;
- final interval answer alone.

## Shared Task Note

The 50 percent follow-up remains in the shared `calculation_work_capture`
family through `selectionMode: interval_halving_check`. The shared task shell
validates this interaction shape and exposes interval, relation, and
conclusion controls in its focus plan.
