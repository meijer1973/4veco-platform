# Sprint TASK-FAMILY-LABEL-1: Baseline

Generated: 2026-06-01

## Plan reference

Plan reference: `reports/sprints/TASK-FAMILY-LABEL-1-plan.md`

## Source Context

Inspected baseline artifacts:

- `reports/sprints/TASK-FAMILY-CONSTRUCT-1-contract.md`
- `reports/json/task-family-construction-contract.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`

## Current Runtime State

The shared task shell already supports the preceding structured choice and
construction families:

- `cloze_tile_select`
- `sentence_builder`
- `formula_builder`
- `cloze_text`
- `multi_select`
- `step_ordering`
- `source_value_selection`
- `source_chain_builder`

`label_placement` is not yet declared in `TaskShellEngine.FAMILIES`, has no
engine validation/matching path, has no shared UI renderer, has no wrapper
collection support, and has no focused tests or checker.

## Data integrity notes

Protected reference data status: no sprint-start changes are planned or
allowed in `references/machine` or `references/external`.

No source exit-ticket data, reasoning CSV, skilltree data, graph data,
procedure data, guided-practice data, generated Book 1 lesson output,
target-exercise registry, candidate storage, PV projection, or product-facing
route is authorized by this sprint baseline.

## Quality Baseline

The accepted contract requires `label_placement` to support visual placement
of labels on graph, table, formula, or structure targets with stable target ids,
accessible descriptions, keyboard placement controls, and visual proof. The
family may not become a generic choice substitute for graph/table,
calculation, or reasoning proof.

## Existing Follow-Up Flags To Preserve

- Product-route screenshots are required before any new task family is adopted
  in generated routes.
- `GATE-TASK-FAMILY-1` must review rendered output, feedback,
  keyboard/focus behavior, mobile/dark proof, visual affordance, and
  target-proof boundaries before these families are relied on by
  `REASON-STD-1`, `CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, or Scale Gate 1.
- Scale Gate 1 remains blocked by the wider Product Proof Track.

## Baseline Validation To Run

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-LABEL-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-LABEL-1
```

## Stop Conditions At Baseline

Stop before implementation if the plan does not include:

- exact response-shape rules;
- target-role and coordinate validation;
- visual/narrow/dark fixture proof;
- keyboard/focus proof;
- wrapper collection requirements;
- explicit product-authority boundaries;
- planning review and lead-review lifecycle.
