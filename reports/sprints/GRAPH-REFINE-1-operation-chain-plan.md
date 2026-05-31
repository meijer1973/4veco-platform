# Sprint GRAPH-REFINE-1: Operation-Chain Plan

Generated: 2026-05-31

## Purpose

Define the `1.1.3 Grafieken en tabellen` target-operation chain that future
graph-route hardening must prepare.

This is not implementation and not target-equivalent proof. It is the
operation-chain plan for a later graph repair/hardening sprint.

## Source Target Exercise

Read-only source:
`references/authored/course-target-exercises.json`.

Target context:

```text
The table below shows the number of ice creams sold at different prices:
P=EUR 1.00 -> Q=500,
EUR 1.50 -> 400,
EUR 2.00 -> 300,
EUR 2.50 -> 200,
EUR 3.00 -> 100.
```

Target subquestions:

| Subquestion | Prompt | Operation chain |
|---|---|---|
| `a` | Draw this as a graph with price on the vertical axis and quantity on the horizontal axis. | table source reading -> identify P/Q variables -> apply economist axis convention -> construct or substitute graph with quantity horizontal and price vertical -> label axes/units -> plot points from table |
| `b` | Read from your graph: how many ice creams are sold at EUR 1.75? | locate price EUR 1.75 on vertical axis -> interpolate between EUR 1.50 and EUR 2.00 -> read corresponding quantity between 400 and 300 -> answer about 350 ice creams |
| `c` | Newspaper writes: "Ice cream sales dropped by 50%." Looking at the table, between which two prices could this have happened? Explain. | compare table quantities -> identify 50 percent drop pair -> cite source values -> calculate or reason 200 to 100 is 50 percent drop -> name prices EUR 2.50 to EUR 3.00 -> explain with table evidence |

## Non-Negotiable Axis Convention

For this target exercise:

```text
price = vertical axis
quantity = horizontal axis
```

Equivalent Dutch student-facing repair language should say:

```text
Prijs staat op de verticale as.
Hoeveelheid / aantal staat op de horizontale as.
Een punt wordt gelezen als hoeveelheid horizontaal en prijs verticaal.
```

The current route contains contradictory wording:

```text
Prijs staat op de horizontale as.
Hoeveelheid of aantal staat op de verticale as.
Prijs is de x-waarde; aantal kaartjes is de y-waarde.
```

This wording may be acceptable for a generic non-economic graph in a different
context, but it is not acceptable as target-equivalent preparation for `1.1.3`.
The later implementation sprint must correct or isolate it before graph output
is used for target-equivalent exit-ticket evidence.

## Required Operation Tags

Future graph hardening should attach reviewed operation-chain metadata to
route/task records, using student-facing labels in rendered output and
machine-readable tags in source data.

Proposed tags for planning:

| Operation tag | Student action | Current task-shell family |
|---|---|---|
| `source_table_read_prices_quantities` | Read prices and quantities from the table | `table_value_selection` |
| `economist_axis_convention_p_vertical_q_horizontal` | Apply price vertical / quantity horizontal | `graph_construction_substitute` |
| `graph_point_from_table_pq` | Plot or specify table points using P/Q convention | `point_placement` or reviewed graph-construction substitute |
| `interpolate_quantity_at_price` | Estimate quantity at EUR 1.75 | `graph_reading` with interpolation evidence |
| `identify_percent_drop_interval` | Find values showing a 50 percent drop | `table_value_selection` plus `calculation_work_capture` |
| `explain_with_table_evidence` | Explain the claim using source values | `short_constructed_response` or `structured_reasoning` |

## Future Route Sequence

Recommended target-aligned graph practice sequence:

1. Source table orientation: identify P and Q values from the ice-cream table.
2. Axis convention: choose or state price vertical and quantity horizontal.
3. Point construction: place or specify at least two points as `(Q, P)` for
   the target table.
4. Graph interpolation: estimate quantity at EUR 1.75 from the line between
   EUR 1.50 / 400 and EUR 2.00 / 300.
5. Table evidence: identify the 200 -> 100 sales pair.
6. Calculation/explanation: show that 100 fewer from 200 is a 50 percent drop
   and name EUR 2.50 -> EUR 3.00.
7. Short response: write a concise explanation using the table values.

## Proof Boundary

This sequence is required before target-equivalent graph use, but a practice
route alone still cannot claim target-equivalent proof. Target-equivalent use
requires a reviewed exit-ticket composition in `L1.7B-Q2` and approval by
`GATE-L1.7B-Q2`.
