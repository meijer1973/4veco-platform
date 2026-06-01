# Sprint TASK-FAMILY-SENTENCE-1: Baseline

Generated: 2026-06-01

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md`

## Current state

`TASK-FAMILY-CONSTRUCT-1` defined `sentence_builder` as a constrained
construction family for reasoning sentences and causal chains. The family is
not yet implemented in the shared task shell.

`TASK-FAMILY-CLOZE-TILE-1` is closed as PASS WITH FLAGS and provides the
closest implementation pattern: first-class family declaration, strict
response-shape matching, shared UI helpers, wrapper response collection,
focused tests, a custom checker, report-fixture proof, and lead review.

Current shared task-shell runtime support includes:

- `choice`
- `numeric_input`
- `calculation_work_capture`
- `final_answer_entry`
- `unit_notation_field`
- `short_constructed_response`
- `structured_short_response`
- `cloze_tile_select`
- `table_value_selection`
- `graph_reading`
- `point_placement`
- `graph_construction_substitute`
- `structured_reasoning`

It does not include `sentence_builder`.

## Data integrity notes

Protected reference data is not in scope. No edits are allowed under
`references/machine/` or `references/external/`.

No source exit-ticket data, reasoning CSV, skilltree data, graph data,
procedure data, guided-practice data, generated Book 1 lesson output,
target-exercise registry, candidate storage, PV projection, PV machine
promotion, Scale Gate 1, or product-authority artifact may change in this
sprint.

The unrelated local file `knowledge/exit-ticket-game-1.1.1.zip` is present in
the working tree before this sprint and remains out of scope.

## Baseline risks

| Risk | Impact | Planned control |
|---|---|---|
| Treating a word bank as quiz variety rather than operation-chain proof. | Weakens the product standard. | Plan and checker require reasoning/causal-chain use case and explicit target-proof boundary. |
| Accepting raw token arrays instead of the strict response shape. | Repeats the cloze-tile round-1 defect. | Deterministic matcher must require `response.tokens`. |
| Allowing duplicate token use by default. | Makes accidental sequence matches possible. | `allowReuse` defaults to false and duplicate expected token use is rejected. |
| UI becomes another local widget. | Engine drift and inconsistent feedback. | Shared UI helper owns add/remove/reorder and wrapper collection. |
| Product adoption sneaks into runtime work. | Premature generated-output or target-equivalent reliance. | Forbidden paths and diff review block source-data/generated-output changes. |

## Required first checks

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-SENTENCE-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-SENTENCE-1
```
