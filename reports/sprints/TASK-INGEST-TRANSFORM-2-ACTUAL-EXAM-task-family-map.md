# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Task-Family Map

Generated: 2026-06-05

Status: target-task economy plus repair-3 interaction map.

## Original Target To Transformed Tasks

Original:

`Bereken tot welk bedrag aan zorgkosten per jaar het voordeliger is om verhoogd eigen risico te nemen.`

Transformation:

```text
source_value_selection -> calculation_work_capture -> structured_short_response
```

| Task | Family | Target role |
|---|---|---|
| `q3-source-values` | `source_value_selection` | compactly select the needed table cells |
| `q3-calculation` | `calculation_work_capture` | calculate the threshold with visible work |
| `q3-threshold-direction` | `structured_short_response` | carry task-2 threshold and choose direction |

## Support Families Removed As Required Cards

`formula_builder`, `step_ordering`, and `source_chain_builder` are no longer
required cards for this item. They were over-scaffolding for a two-point
calculation target.

## Anti-Reduction

The revised flow still rejects final-answer field alone because the calculation
card requires visible work and the conclusion card requires direction.
It also rejects a conclusion card that asks for a fresh free-text threshold
instead of consuming the calculated value.
