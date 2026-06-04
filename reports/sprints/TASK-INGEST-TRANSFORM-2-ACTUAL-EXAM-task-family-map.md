# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Task-Family Map

Generated: 2026-06-04

Status: target-task economy repair map.

## Original Target To Transformed Tasks

Original:

`Bereken tot welk bedrag aan zorgkosten per jaar het voordeliger is om verhoogd eigen risico te nemen.`

Transformation:

```text
source_value_selection -> calculation_work_capture -> structured_short_response
```

| Task | Family | Target role |
|---|---|---|
| `q3-source-values` | `source_value_selection` | select the needed table values |
| `q3-calculation` | `calculation_work_capture` | calculate the threshold with visible work |
| `q3-threshold-direction` | `structured_short_response` | state threshold and direction |

## Support Families Removed As Required Cards

`formula_builder`, `step_ordering`, and `source_chain_builder` are no longer
required cards for this item. They were over-scaffolding for a two-point
calculation target.

## Anti-Reduction

The revised flow still rejects final-answer field alone because the calculation
card requires visible work and the conclusion card requires direction.
