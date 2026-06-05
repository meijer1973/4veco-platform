# TASK-INGEST-TRANSFORM-3-TEXTBOOK Answer Form Trace

Generated: 2026-06-05

Status: revised for repair-4 click-to-place graph construction and reviewer
correction pass.

## Primary Answer Form

Original target:

```text
Teken een P-Q-grafiek bij de tabel.
```

Primary transformed answer:

- family: `graph_construction_substitute`;
- task: `tb113-graph-construction`;
- x-axis: quantity `Q`;
- y-axis: price `P`;
- primary path: click two table points in the graph workspace;
- required points: `(500, 1.00)` and `(100, 3.00)`;
- fallback: typed coordinate entry remains collapsed and secondary;
- line: decreasing, drawn in the same graph workspace after confirmation;
- grid: visible from the start;
- tick labels: table-derived values, with Q `0, 100, 200, 300, 400, 500`
  and P `0,00, 1,00, 1,50, 2,00, 2,50, 3,00`;
- axis names and numeric scale: hidden until the correct axes are selected.

## Follow-Up Answer Forms

| Task | Answer form |
|---|---|
| `tb113-graph-reading` | numeric `Q` value around `350` ijsjes |
| `tb113-quantity-drop-check` | choose one valid interval, auto-fill old/new quantities, select that the new quantity is half of the old quantity, then choose the conclusion `Q daalt met 50 procent` |

Accepted 50 percent intervals remain:

- `EUR 1.50` to `EUR 2.50`: `400` to `200`;
- `EUR 2.50` to `EUR 3.00`: `200` to `100`.

The ambiguity is preserved as a simplified follow-up, not as the primary task
and not as a free-form interval/unit/calculation puzzle. The accepted answer is
not interval-only: the shared task variant also accepts the conclusion
`Q daalt met 50 procent` when the interval and halving relation are shown.

## Shared Task Contract

`tb113-quantity-drop-check` is a shared `calculation_work_capture` task with
`selectionMode: interval_halving_check`. `TaskShellEngine` validates the
interval options, relation options, conclusion options, and focus plan.
