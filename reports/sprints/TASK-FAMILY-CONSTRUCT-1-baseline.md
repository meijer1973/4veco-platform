# Sprint TASK-FAMILY-CONSTRUCT-1: Baseline

Generated: 2026-06-01

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-CONSTRUCT-1-plan.md`

## Baseline evidence

- `references/reference-team-roadmap.md` lists `TASK-FAMILY-CONSTRUCT-1` as
  the constrained construction task-family contract sprint.
- `../4veco-lessen/lessen-team-roadmap.md` mirrors the sprint and keeps it
  planning-only.
- `../4veco-lessen/specifications/product-end-state.md` requires token, tile,
  word-bank, formula-bank, and label-bank interactions to force the same
  reasoning, formula, source, graph, or answer-construction structure required
  by the target exercise.
- `../4veco-lessen/specifications/companion-core-specifications.md` requires
  construction families to define token/tile banks, distractors, allowed reuse,
  expected order or placement, validation strictness, feedback for missing or
  misplaced elements, and practice-only partial self-check limits.
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md` identifies
  reasoning ordering, causal chains, claim/reason/evidence, flow diagrams,
  classification with explanation, and source-based explanation as missing
  standard families.
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md` records the current task
  shell UX and hint/feedback boundaries that construction families must inherit.

## Current runtime state

Read-only evidence shows:

- `engines/task-shell-engine.js` does not yet expose `cloze_tile_select`,
  `sentence_builder`, `formula_builder`, `source_value_selection`,
  `source_chain_builder`, or `label_placement` as first-class families.
- Reasoning and graph surfaces contain local patterns that are adjacent to
  ordering, chain building, source selection, and representation work, but the
  shared-shell standard has not yet defined construction families.

## Data integrity notes

No protected reference data may change. `references/machine/` and
`references/external/` are out of scope. No generated lesson output, engines,
source exit-ticket data, reasoning CSVs, graph/math data builders,
target-exercise registry records, candidate storage, or product-facing routes
may change in this sprint.
