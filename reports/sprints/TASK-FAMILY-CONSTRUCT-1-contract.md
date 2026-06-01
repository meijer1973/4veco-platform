# TASK-FAMILY-CONSTRUCT-1 Constrained Construction Task-Family Contract

Generated: 2026-06-01

Status: contract ready for later implementation sprints; no implementation,
generated output, product authority, or target-equivalent reliance authorized.

## Purpose

Constrained construction families ask students to build an answer from parts.
They are valuable only when the construction matches the target operation:
reasoning sentence, causal chain, formula, source-value route, source to
operation to answer chain, graph/table representation, or label placement.

They are not decorative game formats. A construction task may not count as
target-equivalent proof unless the constructed action matches the reviewed
target operation and the full operation chain is covered.

## Shared Rules

Every implementation sprint for a family in this contract must provide:

- token/tile/label bank validation;
- distractor policy and answer-revealing control;
- allowed reuse rules;
- ordering, grouping, or placement semantics;
- deterministic evaluation where configured;
- neutral feedback for missing, extra, or misplaced parts;
- keyboard and screen-reader operation for selecting, moving, placing, and
  removing parts;
- visible focus movement to one labelled feedback region;
- mobile and dark-mode rendered proof;
- no internal MTU, generator, or operation-code exposure;
- no diagnostic, mastery, sequencing, summative, PV, Scale Gate 1, or product
  authority language.

Practice and advisory short checks may use partial self-check feedback when a
family explicitly allows it. Exit tickets must not expose content hints or
answer-revealing scaffolds before attempt.

## Family Contracts

| Family | Student action | Response shape | Expected shape | Bank / placement rules | Validation/evaluation owner | Feedback owner | Use cases | Target-proof limit |
|---|---|---|---|---|---|---|---|---|
| `cloze_tile_select` | Fill inline blanks by choosing tiles from a bank. | `{ "blanks": { "<blankId>": "tileId" } }` | `{ "kind": "cloze_tile_select", "blanks": { "<blankId>": "tileId" } }` | tile bank includes required tiles and misconception distractors; reuse default false | shared task shell validates tile ids and blank mapping | shared task shell plus domain module | index-points-versus-percent, source labels, graph-reading conclusions, reasoning completions | eligible for bounded completion only; not a full explanation substitute |
| `sentence_builder` | Build a reasoning sentence or causal chain from word/fragments. | `{ "tokens": ["tokenId"] }` | `{ "kind": "sentence_builder", "tokens": ["tokenId"], "acceptedSequences": [["tokenId"]] }` | token bank must force causal/answer-form structure; distractors must reveal economic misconceptions | shared task shell validates sequence; domain module may allow equivalent sequences | shared task shell plus domain module | `leg uit`, index-point explanation, curve-shift reasoning, surplus/welfare reasoning, exam-answer phrasing | eligible only when fragment sequence matches the reviewed answer-form structure; not a broad semantic evaluator |
| `formula_builder` | Build a formula from symbols, variables, operators, or terms. | `{ "tokens": ["tokenId"] }` | `{ "kind": "formula_builder", "tokens": ["tokenId"], "acceptedSequences": [["tokenId"]] }` | formula bank distinguishes numerator, denominator, operator, parentheses, multiplier, and notation tokens | shared task shell validates sequence; domain module owns formula equivalence if needed | shared task shell plus domain module | percentage change, index number, elasticity, revenue, profit, marginal/average procedures | proves formula selection/construction only; calculation execution still needs calculation-work task |
| `source_value_selection` | Select multiple relevant source/table/graph values and assign roles. | `{ "selections": [{ "valueId": "id", "role": "old" }] }` | `{ "kind": "source_value_selection", "selections": [{ "valueId": "id", "role": "old" }] }` | value bank must include labels, units, periods, and plausible distractors | shared task shell validates values and roles; graph/source module owns payload | shared task shell plus graph/source module | old/new values, x/y values, price/quantity, cause/effect values, source evidence | eligible only for source-selection sub-proof; must be paired with operation/answer for full proof |
| `source_chain_builder` | Build a source -> value -> operation -> answer chain. | `{ "chain": ["nodeId"] }` | `{ "kind": "source_chain_builder", "chain": ["nodeId"] }` | node bank includes source observation, role label, operation, answer, and conclusion nodes | shared task shell validates required node order; domain module owns operation semantics | shared task shell plus domain module | graph/table target chains, source-to-calculation routes, source-based explanation planning | eligible when the reviewed target operation is chain construction or when paired with execution tasks |
| `label_placement` | Place labels on graph, table, formula, or structure targets. | `{ "placements": [{ "labelId": "id", "targetId": "id" }] }` | `{ "kind": "label_placement", "placements": [{ "labelId": "id", "targetId": "id" }] }` | label and target banks require visible names, accessible descriptions, and keyboard placement controls | shared task shell validates labels/targets; graph/formula module owns visual payload | shared task shell plus graph/formula module | axes, lines, intersections, units, index labels, curve-shift components, formula parts | eligible for representation proof only when placement is the reviewed target action |

## Product-Boundary Flags

All construction families carry these default boundary flags:

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

1. `TASK-FAMILY-CLOZE-TILE-1`
2. `TASK-FAMILY-SENTENCE-1`
3. `TASK-FAMILY-FORMULA-1`
4. `TASK-FAMILY-SOURCE-1`
5. `TASK-FAMILY-LABEL-1`

`GATE-TASK-FAMILY-1` must review rendered output, feedback, keyboard/focus
behavior, mobile/dark proof, visual affordance where relevant, and target-proof
boundaries before these families are relied on by `REASON-STD-1`,
`CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, or Scale Gate 1.

## Non-Authority Statement

This contract authorizes no engine implementation, source-data writes,
generated lesson output, protected reference mutation, target-exercise field
writes, candidate storage, target-equivalent completion claims, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV,
Scale Gate 1, or product-wide use.
