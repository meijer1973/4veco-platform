# Sprint MATH-REFINE-1: Operation-Chain Plan

Generated: 2026-05-31

## Purpose

Define the `1.1.2 Percentages en indexcijfers` target-operation chain that
future math-route hardening must prepare.

This is not implementation and not target-equivalent proof. It is the
operation-chain plan for a later math repair/hardening sprint.

## Source Target Exercise

Read-only source:
`references/authored/course-target-exercises.json`.

Target context:

```text
Practice with percentage changes and index numbers across price data.
```

Target subquestions:

| Subquestion | Prompt | Operation chain |
|---|---|---|
| `a` | The price of a bicycle rises from EUR 800 to EUR 920. Calculate the percentage change. | identify old value EUR 800 and new value EUR 920 -> calculate absolute difference 120 -> divide by old value 800 -> multiply by 100 -> answer 15% price increase with percentage notation |
| `b` | In 2023 a standard shopping basket costs EUR 150. In 2025 the same basket costs EUR 162. The base year is 2023, index = 100. Calculate the price index for 2025. | identify base-year basket price EUR 150 and target-year price EUR 162 -> use index formula `target / base * 100` -> calculate `162 / 150 * 100 = 108` -> answer index 108 and interpret relative to base year 100 |
| `c` | In 2026 the index rises to 112. Calculate the price increase from 2025 to 2026 in percent. | carry forward 2025 index 108 from subquestion `b` -> identify new index 112 -> calculate absolute index-point difference 4 -> apply A38 to index values, `4 / 108 * 100` -> answer about 3.7% |
| `d` | A student claims: "The index went from 108 to 112, so inflation is 4%." Explain why this is wrong and calculate the correct figure. | identify claim as confusing 4 index points with 4 percent -> state the difference between index-point change and percentage change -> show calculation `(112 - 108) / 108 * 100` -> conclude the correct inflation is about 3.7%, not 4% |

## Non-Negotiable D31 Requirement

For this target exercise, D31 is not optional:

```text
108 -> 112 is 4 index points, not 4 percent.
The percentage change is (112 - 108) / 108 * 100, about 3.7%.
```

Current A39 pitfall text and generic index practice are not enough to prove
this operation. The route must include an explicit short explanation or
constructed-response check for target subquestion `d`.

Equivalent Dutch student-facing repair language should say:

```text
Het indexcijfer stijgt met 4 indexpunten.
Dat is niet hetzelfde als 4%.
Je berekent de procentuele stijging met 4 / 108 * 100 = ongeveer 3,7%.
```

## Required Operation Tags

Future math hardening should attach reviewed operation-chain metadata to
route/task records, using student-facing labels in rendered output and
machine-readable tags in source data.

Proposed tags for planning:

| Operation tag | Student action | Current or future task-shell family |
|---|---|---|
| `percent_change_old_new_values` | Identify old/new value and calculate percentage change | `numeric_input`, `calculation_work_capture`, `final_answer_entry`, `unit_notation_field` |
| `price_index_from_basket_prices` | Calculate index from target-year price and base-year price | `numeric_input`, `calculation_work_capture`, `final_answer_entry`, `unit_notation_field` |
| `index_to_index_percent_change` | Apply A38 to index values across years | `calculation_work_capture`, `final_answer_entry`, `unit_notation_field` |
| `index_point_vs_percent_explanation` | Explain why index points are not percentages | `short_constructed_response` or `structured_reasoning` |
| `calculation_answer_form_check` | Show formula, substitution, intermediate step, final answer, notation, and conclusion | `calculation_work_capture` plus future `ANS_BEREKEN` mapping when allowed |
| `local_advice_only_feedback` | Give neutral practice feedback without target-equivalent or mastery claims | shared task-shell feedback model |

## Future Route Sequence

Recommended target-aligned math practice sequence:

1. Percentage-change setup: identify old value EUR 800 and new value EUR 920.
2. Percentage-change calculation: show `(920 - 800) / 800 * 100 = 15%`.
3. Index setup: identify base-year price EUR 150 and target-year price EUR 162.
4. Price-index calculation: show `162 / 150 * 100 = 108`.
5. Index-to-index setup: carry 108 as the old index and 112 as the new index.
6. Index-to-index calculation: show `(112 - 108) / 108 * 100 = 3.7%`.
7. D31 explanation: write why the 4-point increase is not a 4 percent
   increase, using the calculation as evidence.
8. Local feedback: suggest practice or next local action without
   target-equivalent proof, diagnostics, mastery, or sequencing language.

## Route Ownership Decision For Future Work

Recommended future implementation direction:

```text
Surface D31 in the math route as a shared calculation-plus-short-explanation
task. Coordinate with the reasoning route for explanation scaffolding, but do
not leave D31 only in a separate reasoning game if the math target chain needs
the calculation and explanation together.
```

This is a planning recommendation, not implementation authority.

## Proof Boundary

This sequence is required before target-equivalent math use, but a practice
route alone still cannot claim target-equivalent proof. Target-equivalent use
requires a reviewed exit-ticket composition in `L1.7B-Q2` and approval by
`GATE-L1.7B-Q2`.
