# TASK-INGEST-TRANSFORM-3-TEXTBOOK Operation Chain Trace

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

| Operation | Source refs | Inputs | Output | Task cards |
|---|---|---|---|---|
| `read_table_value` | `ctx-icecream-table` | P = 1.50 | Q = 400 | `tb113-table-value` |
| `select_pq_axes` | `ctx-icecream-table`, `ctx-icecream-graph`, `ctx-icecream-procedure` | P-Q diagram, price, quantity | quantity on x-axis, price on y-axis | `tb113-axis-convention`, `tb113-graph-step-order`, `tb113-point-placement`, `tb113-source-chain` |
| `order_graph_procedure` | `ctx-icecream-procedure` | table rows, P-Q convention, scale, points | ordered graph procedure | `tb113-graph-step-order` |
| `plot_table_point` | `ctx-icecream-table`, `ctx-icecream-graph` | P = 2.00, Q = 300 | point x = 300, y = 2.00 | `tb113-point-placement`, `tb113-source-chain` |
| `select_interpolation_source_values` | `ctx-icecream-table`, `ctx-icecream-graph` | P = 1.50/Q = 400 and P = 2.00/Q = 300 | source values around P = 1.75 | `tb113-interpolation-source-values` |
| `interpolate_graph_value` | `ctx-icecream-table`, `ctx-icecream-graph` | P = 1.75, Q values 400 and 300 | Q approximately 350 | `tb113-graph-reading`, `tb113-source-chain` |
| `calculate_percent_drop` | `ctx-icecream-table`, `ctx-icecream-formula` | 400 to 200, and 200 to 100 | -50 percent for each recorded candidate | `tb113-claim-calculation`, `tb113-answer-form`, `tb113-source-chain` |
| `state_claim_with_source_limits` | `ctx-icecream-prompt`, `ctx-icecream-table` | interval, source quantities, -50 percent | interval statement with calculation support | `tb113-answer-form`, `tb113-source-chain` |

## Guardrails

- A table value alone is not enough to close the claim task.
- An interval alone is not enough to close the claim task.
- Axis swapping is a graph-construction blocker.
- The 50 percent claim requires both source quantities and percent-change work.

