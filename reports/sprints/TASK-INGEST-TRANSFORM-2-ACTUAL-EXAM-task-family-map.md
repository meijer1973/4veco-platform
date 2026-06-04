# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Task-Family Map

## Task Family Coverage

| Task ID | Family | Operation coverage | Cognitive-preservation rationale |
|---|---|---|---|
| `q3-source-values` | `source_value_selection` | Source value selection and role assignment | Preserves table reading, variant, unit, and role selection before calculation. |
| `q3-annual-premium-formula` | `formula_builder` | Monthly-to-year premium conversion | Prevents using monthly premiums as yearly costs. |
| `q3-operation-order` | `step_ordering` | Procedure sequence | Preserves answer-model step order before execution. |
| `q3-calculation` | `calculation_work_capture` | Yearly premium, deductible exposure, threshold derivation | Requires visible work; final number alone is rejected. |
| `q3-source-chain` | `source_chain_builder` | Source-to-value-to-operation-to-answer route | Connects table values to operations and conclusion. |
| `q3-threshold-direction` | `structured_short_response` | Threshold direction | Requires the answer to be a directed statement, not an orphan amount. |

## Anti-Reduction Notes

The transformed bundle intentionally combines source, formula, procedure,
calculation, chain, and short-response families. A source-selection-only card,
a choice-only card, or a final-answer field alone would reduce the official
exam operation level and must be rejected by the checker and lead review.

## Context Binding

Every task carries context references to:

- `ctx-zoohee-prompt`
- `ctx-zoohee-source`
- `ctx-zoohee-table`
- `ctx-zoohee-formula`

The checker must validate the full task set with `TaskShellEngine.validateTaskSet`.
