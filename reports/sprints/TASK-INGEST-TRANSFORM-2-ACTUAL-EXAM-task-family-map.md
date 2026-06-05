# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Task-Family Map

Generated: 2026-06-05

Status: target-task economy plus repair-4 interaction-clarity map and
reviewer calculation-shortcut correction.

## Original Target To Transformed Tasks

Original:

`Bereken tot welk bedrag aan zorgkosten per jaar het voordeliger is om verhoogd eigen risico te nemen.`

Transformation:

```text
choice -> calculation_work_capture -> structured_short_response
```

| Task | Family | Target role |
|---|---|---|
| `q3-source-values` | `choice` | choose the meaningful comparison basis before calculating |
| `q3-calculation` | `calculation_work_capture` | calculate the threshold with visible work, including the full annual-cost route or premium-difference shortcut, exact unit validation, targeted feedback, and progressive support |
| `q3-threshold-direction` | `structured_short_response` | carry task-2 threshold and choose direction |

## Support Families Removed As Required Cards

`source_value_selection`, `formula_builder`, `step_ordering`, and
`source_chain_builder` are no longer required cards for this item. Compact
source marking can exist only as support inside the calculation card. The
required first card now checks whether the student knows that the relevant
comparison is annual premium plus deductible exposure.

## Anti-Reduction

The revised flow still rejects final-answer field alone because the calculation
card requires visible work and the conclusion card requires direction.
It also rejects a conclusion card that asks for a fresh free-text threshold
instead of consuming the calculated value.

Repair 4 also rejects the earlier "select all numbers" task, accepts `649`
with reasonable yearly unit variants such as `euros`, gives targeted feedback
for number/unit/work failures, and offers a review-lab support path after
repeated failed calculation attempts.

The reviewer correction pass adds an explicit accepted work path for
`22x12 = 264, 264 + 385 = 649` while still rejecting final-answer-only work.
