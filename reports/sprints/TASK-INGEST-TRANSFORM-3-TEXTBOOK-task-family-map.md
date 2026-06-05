# TASK-INGEST-TRANSFORM-3-TEXTBOOK Task-Family Map

Generated: 2026-06-05

Status: target-first map after repair-3 interaction-quality revision.

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
| `tb113-graph-construction` | `graph_construction_substitute` | primary click-to-place graph construction |
| `tb113-graph-reading` | `graph_reading` | immediate graph-reading follow-up |
| `tb113-quantity-drop-check` | `calculation_work_capture` | optional 50 percent ambiguity follow-up |

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
- source-chain card;
- separate answer-form card;
- final interval answer alone.
