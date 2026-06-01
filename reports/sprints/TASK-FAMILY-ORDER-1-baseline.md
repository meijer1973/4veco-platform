# Sprint TASK-FAMILY-ORDER-1: Baseline

Generated: 2026-06-01

## Repository state

Baseline before implementation:

- Platform repo branch: `main`
- Lesson repo branch: `main`
- Platform worktree: clean before sprint planning files
- Lesson worktree: clean before sprint planning files

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-ORDER-1-plan.md`

## Current support

The shared task shell currently declares and renders several deterministic
families, including `choice`, `multi_select`, `cloze_text`,
`cloze_tile_select`, `sentence_builder`, and `formula_builder`.

`step_ordering` is not yet declared in `engines/task-shell-engine.js` and has
no first-class rendering, collection helper, wrapper delegation, proof JSON, or
custom sprint checker.

## Evidence read

- `references/reference-team-roadmap.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md`
- `reports/sprints/TASK-FAMILY-MULTI-1-result.md`
- `reports/sprints/TASK-FAMILY-CLOZE-1-result.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- focused shared task-shell and wrapper tests

## Baseline decision

Proceed with a runtime-only `step_ordering` implementation sprint after
planning review. Do not generate lesson output, mutate source exercise data,
migrate reasoning CSVs, or authorize target-equivalent or product use.

## Data integrity notes

No protected reference data may change in this sprint. `references/machine/`
and `references/external/` are forbidden paths.

No source exit-ticket data, reasoning CSV, skilltree data, graph data,
procedure data, guided-practice data, generated Book 1 lesson output,
target-exercise registry, candidate storage, or product-facing route may be
changed by this sprint.
