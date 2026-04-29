# Graph-Spec Representation Plan

Plan ID: `GRAPH-SPEC-REPRESENTATION-PLAN-V1`

CP-3 condition: refine `graph_spec` representation values during broader coverage work.

## Current Values

The current enum is adequate for the S4/S4.1 dry run:

- `none`
- `table`
- `bar_chart`
- `line_chart`
- `pie_chart`
- `p_q_graph`
- `producer_graph`
- `source_text`

## Candidate Future Values

| Value | Reason |
|---|---|
| `to_tk_graph` | Producer exercises can require reading vertical distance between total revenue and total cost. |
| `market_surplus_diagram` | Welfare and intervention exercises may require identifying consumer surplus, producer surplus, deadweight loss, and government budget areas. |
| `labor_market_graph` | Minimum wage and labor-market equilibrium tasks use P-Q logic with wage/employment semantics. |
| `index_series` | Index-number exercises often appear as time-series or index tables and need distinction from raw value series. |
| `source_annex_table` | External exam annex tables must be distinguished from values embedded directly in the prompt. |

Decision rule: do not expand the enum one exercise at a time during bulk backfill. Add representation values when a repeated class of exercises needs different validation, retrieval, or precision-lint behavior.

Blocked use: do not use `graph_spec` as a complete operation registry. Detailed operations remain provisional until Sprint 7, Sprint 12, or RX.5 work creates a governed registry.
