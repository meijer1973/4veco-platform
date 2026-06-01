# TASK-FAMILY-CHOICE-1 Structured Choice Task-Family Contract

Generated: 2026-06-01

Status: contract ready for later implementation sprints; no implementation,
generated output, product authority, or target-equivalent reliance authorized.

## Purpose

Structured choice families are added to the shared task shell as reviewed
student actions, not quiz variety. They may support practice, short checks,
reasoning migration, and carefully reviewed checkpoint composition, but they
may not replace calculation, graph/table, source, or constructed-response
target operations unless the target action itself is genuinely choice-like.

## Shared Rules

Every implementation sprint for a family in this contract must provide:

- schema validation for the task payload and response payload;
- deterministic evaluation where configured;
- neutral feedback with retry/self-check behavior;
- visible focus movement to one labelled feedback region;
- keyboard and screen-reader operation;
- mobile and dark-mode rendered proof;
- no internal MTU, generator, or operation-code exposure;
- no diagnostic, mastery, sequencing, summative, PV, Scale Gate 1, or product
  authority language.

Practice and advisory short checks may use partial self-check feedback when a
family explicitly allows it. Target-equivalent exit tickets must use exact or
reviewed deterministic evaluation and may not expose answer-revealing hints or
criteria before attempt.

## Family Contracts

| Family | Student action | Response shape | Expected shape | Validation/evaluation owner | Feedback owner | Use cases | Target-proof limit |
|---|---|---|---|---|---|---|---|
| `cloze_text` | Fill inline blanks in a sentence, formula statement, source statement, or reasoning chain. | `{ "blanks": { "<blankId>": "text" } }` | `{ "kind": "cloze_text", "blanks": { "<blankId>": { "accepted": ["..."], "requiredTextGroups": [] } } }` | shared task shell validates blank ids; domain module may provide accepted values and text groups | shared task shell renders field-level feedback; domain module supplies misconception copy | index-points-versus-percent, formula substitution, source-value labels, cause-step-effect statements | eligible only when the target action is bounded completion; not enough for full open explanation unless paired with constructed response |
| `multi_select` | Select all options that satisfy a prompt. | `{ "values": ["optionId"] }` | `{ "kind": "multi_select", "values": ["optionId"], "mode": "exact_set" }` | shared task shell validates option ids and exact set; practice may allow partial analysis | shared task shell reports missing required options and selected distractors without diagnostic labels | source constraints, valid assumptions, must-mention elements, multiple causes/effects | eligible only when selecting a complete set is the reviewed target action; not a substitute for calculation or prose reasoning |
| `matching_pairs` | Match items to meanings, labels, formula components, graph parts, or events. | `{ "pairs": [["leftId", "rightId"]] }` | `{ "kind": "matching_pairs", "pairs": [["leftId", "rightId"]] }` | shared task shell validates one-to-one or configured many-to-one pairs | shared task shell reports unmatched, misplaced, or extra pairs | concept-definition, graph-element-meaning, source-value-label, formula-component-interpretation, event-to-shift | mostly practice/advisory; target proof requires application context or composition with richer tasks |
| `step_ordering` | Order steps in a procedure, calculation, reasoning chain, or answer form. | `{ "order": ["stepId"] }` | `{ "kind": "step_ordering", "order": ["stepId"] }` | shared task shell validates required step ids and order | shared task shell identifies first misplaced step or missing prerequisite step | percentage-change procedure, graph-construction sequence, causal chain order, answer-form planning | eligible for procedure-control proof only; not enough for final answer proof unless paired with execution task |
| `two_tier_choice` | Select an answer and the reason that supports it. | `{ "answer": "optionId", "reason": "reasonId" }` | `{ "kind": "two_tier_choice", "answer": "optionId", "reason": "reasonId" }` | shared task shell validates both tiers and allowed combinations | shared task shell distinguishes answer recognition from reasoning support without diagnostics | index-points misconception, elasticity interpretation, curve movement versus shift, surplus region reasoning | eligible only for reviewed misconception/reasoning checkpoints; not a complete constructed-response substitute |
| `assertion_reason` | Judge a statement and reason pair, including whether the reason explains the statement. | `{ "value": "optionId" }` | `{ "kind": "assertion_reason", "value": "optionId" }` | shared task shell validates option id and selected relation | shared task shell gives relation-specific feedback | compact exam-style reasoning, subtle economic language, cause/explanation distinction | lower priority; must remain reviewed and sparse because artificial assertion-reason tasks can weaken learning quality |

## Product-Boundary Flags

All structured choice families carry these default boundary flags:

```json
{
  "diagnostics": false,
  "adaptive_routing": false,
  "mastery": false,
  "sequencing": false,
  "summative_use": false,
  "pv_projection": false,
  "pv_machine_promotion": false,
  "scale_gate_1": false,
  "product_wide_use": false
}
```

## Implementation Handoff

Implementation priority after this contract:

1. `TASK-FAMILY-CLOZE-1`
2. `TASK-FAMILY-MULTI-1`
3. `TASK-FAMILY-ORDER-1`
4. `TASK-FAMILY-MATCH-1`
5. `TASK-FAMILY-TWO-TIER-1`
6. `TASK-FAMILY-ASSERTION-1`

`GATE-TASK-FAMILY-1` must review rendered output, feedback, keyboard/focus
behavior, and target-proof boundaries before these families are relied on by
`REASON-STD-1`, `CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, or Scale Gate 1.

## Non-Authority Statement

This contract authorizes no engine implementation, source-data writes,
generated lesson output, protected reference mutation, target-exercise field
writes, candidate storage, target-equivalent completion claims, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or product-wide use.
