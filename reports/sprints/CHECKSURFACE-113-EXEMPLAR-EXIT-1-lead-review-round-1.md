# CHECKSURFACE-113-EXEMPLAR-EXIT-1 Lead Review Round 1

Generated: 2026-06-07

## Findings

| Finding | Severity | Resolution |
|---|---|---|
| The old durable policy checker still required `1.1.3` source/table/formula context, which conflicts with the v3 handoff. | high | Updated checker to require source/table only plus formula-builder interaction. |
| Shared `graph_reading` previously behaved as a plain numeric input, so interval-first reasoning was not enforceable. | high | Added interval options, order validation, matching, focus plan, UI rendering, and response collection. |
| Graph construction previously checked an exact point set rather than any two distinct source-table points. | medium | Added `acceptedTablePoints`, `minimumPointCount`, and `straight_line_two_distinct_table_points` support. |
| Percentage parsing rejected ordinary student notation with `%` and decrease phrasing. | medium | Extended numeric parsing and final-answer notation handling. |
| Exemplar approval could be overclaimed if placeholders looked like reviews. | medium | Added explicit `PENDING_REVIEW` placeholders and lead synthesis state `hold_for_exemplar_review`. |

## Round 1 Verdict

Proceed after corrections and rerun validation.
