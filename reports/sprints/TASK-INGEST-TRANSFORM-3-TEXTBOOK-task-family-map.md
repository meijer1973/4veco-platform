# TASK-INGEST-TRANSFORM-3-TEXTBOOK Task Family Map

Sprint: `TASK-INGEST-TRANSFORM-3-TEXTBOOK`

| Task | Family | Operations | Preservation rationale |
|---|---|---|---|
| `tb113-table-value` | `table_value_selection` | `read_table_value` | Checks direct table reading before graph or claim work. |
| `tb113-axis-convention` | `structured_short_response` | `select_pq_axes` | Prevents swapping P and Q axes. |
| `tb113-graph-step-order` | `step_ordering` | `order_graph_procedure`, `select_pq_axes` | Preserves the textbook procedure from table to graph. |
| `tb113-point-placement` | `point_placement` | `plot_table_point`, `select_pq_axes` | Checks the axis convention through a concrete graph point. |
| `tb113-interpolation-source-values` | `source_value_selection` | `select_interpolation_source_values` | Requires two surrounding table rows before interpolation. |
| `tb113-graph-reading` | `graph_reading` | `interpolate_graph_value` | Checks graph reading at P = EUR 1.75. |
| `tb113-claim-calculation` | `calculation_work_capture` | `calculate_percent_drop` | Requires visible calculation work, not only a final interval. |
| `tb113-source-chain` | `source_chain_builder` | `select_pq_axes`, `plot_table_point`, `interpolate_graph_value`, `calculate_percent_drop`, `state_claim_with_source_limits` | Binds source, graph work, calculation, and conclusion in order. |
| `tb113-answer-form` | `structured_short_response` | `calculate_percent_drop`, `state_claim_with_source_limits` | Checks interval, values, calculation, and conclusion as separate answer parts. |

## Supported Families

All families are supported by `engines/task-shell-engine.js`; no new runtime family is introduced in this sprint.

