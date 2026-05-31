# Sprint GRAPH-REFINE-1: Task Coverage Matrix

Generated: 2026-05-31

## Purpose

Compare the current `1.1.3` graph/table practice route with the target
operation chain.

This matrix is planning evidence only. It does not authorize implementation,
generated output, target-equivalent claims, or product use.

## Coverage Summary

| Target operation | Current evidence | Coverage status | Gap before target-equivalent reliance |
|---|---|---|---|
| Read table values for prices and quantities | `table-ice-price-200` selects the sale value at EUR 2.00 | covered for simple table lookup | Needs broader target table orientation using all target P/Q rows |
| Draw or construct graph from table | `axis-price-quantity` and `point-demand-price-10` practise axis/point ideas | blocked | Current axis copy contradicts the target convention; no target-aligned P vertical / Q horizontal construction sequence |
| Apply economist axis convention | Current data explicitly says price horizontal and amount vertical | blocked | Must repair to price vertical / quantity horizontal for `1.1.3` target use |
| Plot or specify table points | `point-demand-price-10` asks for point `(10, 100)` using price as x | blocked | Future task must use target table and represent points as quantity horizontal / price vertical |
| Interpolate quantity at EUR 1.75 | `line-broodjes-interpolation` practises interpolation in a different context | partial | Need target-specific interpolation between EUR 1.50/400 and EUR 2.00/300, answer about 350 ice creams |
| Identify 50 percent sales drop | `bar-ice-percentage-change` calculates -40 percent from EUR 1.00 to EUR 2.00 | partial | Need identify interval EUR 2.50 -> EUR 3.00 from table values 200 -> 100 |
| Explain the newspaper claim with table evidence | Current calculation task is self-check work capture; no full short explanation task | partial | Need source observation plus calculation/reasoning plus concise explanation answer form |
| Use shared task shell | GRAPH-UX-2 route proof shows task-shell families and feedback | covered for practice route | Future repair must continue using shared task shell and avoid private graph task UI |
| Preserve product boundary | Current route and fixture keep target-equivalent evidence false | covered | Future implementation must preserve this until `L1.7B-Q2`/`GATE-L1.7B-Q2` |

## Current Task Inventory

| Current task id | Current purpose | Useful for target? | Required hardening |
|---|---|---:|---|
| `table-ice-price-200` | Choose table value at EUR 2.00 | yes | Extend to target-chain orientation across all ice-cream table values |
| `bar-ice-quantity-200` | Read quantity at EUR 2.00 from a bar chart | partly | Target requires reading/interpolating from a P-Q graph, not only a bar chart |
| `axis-price-quantity` | State axis convention | no, blocked | Reverse to target convention or isolate as non-target generic graph practice |
| `line-broodjes-interpolation` | Estimate a value between two line points | partly | Use ice-cream target table/graph and EUR 1.75 |
| `point-demand-price-10` | Place point with price as x and amount as y | no, blocked | Use target table and quantity as x / price as y |
| `bar-ice-percentage-change` | Show percent change from 500 to 300 | partly | Replace or add target 200 to 100 drop interval and explanation |
| `line-water-index` | Read index value | no for `1.1.3` target chain | Keep as broader graph/index practice, not target-chain proof |

## Blocking Coverage Issue

The current route cannot be treated as target-equivalent graph preparation
while it contains the wrong target convention:

```text
Prijs staat op de horizontale as.
Prijs is de x-waarde.
```

For `1.1.3`, the target-aligned convention is:

```text
Price / prijs: vertical axis.
Quantity / hoeveelheid / aantal: horizontal axis.
```

The next implementation sprint must make this visible in data, rendered copy,
validator checks, and screenshots.

## Target-Specific Replacement Requirements

The future graph hardening sprint should add or revise tasks so the route can
show:

| Required future task | Task-shell family | Acceptance evidence |
|---|---|---|
| Choose P/Q values from the target ice-cream table | `table_value_selection` | Rendered table task with no internal codes |
| State/select price vertical and quantity horizontal | `graph_construction_substitute` | Validator checks target-aligned axis words |
| Place/specify target points using `(Q, P)` | `point_placement` | Response shape and feedback match target convention |
| Interpolate quantity at EUR 1.75 | `graph_reading` | Expected value around 350 with tolerance and source explanation |
| Identify EUR 2.50 -> EUR 3.00 as 50 percent drop | `table_value_selection` plus `calculation_work_capture` | Shows values 200 and 100 and calculates/recognizes 50 percent drop |
| Explain using table evidence | `short_constructed_response` or `structured_reasoning` | Criteria require source values, interval, and explanation |

## Non-Target Practice Handling

Some current tasks may remain useful as broader graph practice. If retained,
they must be labelled as practice expansion, not target-chain proof. The route
must distinguish:

- target-chain tasks for `1.1.3`;
- broader graph fluency tasks;
- future target-equivalent exit-ticket tasks.

No rendered student copy should claim that completing the current graph route
proves the paragraph target exercise.
