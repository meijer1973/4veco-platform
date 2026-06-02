# Sprint TASK-FAMILY-MATCH-1: Baseline

Generated: 2026-06-02

## Repository state

Baseline before implementation:

- Platform repo branch: `main`
- Lesson repo branch: `main`
- Platform worktree: clean before sprint planning files
- Lesson worktree: clean before sprint planning files

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-MATCH-1-plan.md`

## Current support

The shared task shell currently declares and renders deterministic families
including `choice`, `cloze_text`, `multi_select`, `step_ordering`,
`cloze_tile_select`, `sentence_builder`, `formula_builder`,
`source_value_selection`, `source_chain_builder`, and `label_placement`.

`matching_pairs` is not yet declared in `engines/task-shell-engine.js` and has
no first-class validation, matching path, shared UI renderer, CSS, wrapper
collection support, proof JSON, focused tests, or custom sprint checker.

Existing pair-like work can be approximated only through generic `choice`,
`multi_select`, or local engine patterns. Those are not adequate for a
student action where the learner must build exact relationships between two
item banks.

## Evidence read

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/TASK-FAMILY-CHOICE-1-contract.md`
- `reports/json/task-family-choice-contract.json`
- `reports/sprints/TASK-FAMILY-LABEL-1-plan.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-result.md`
- `reports/sprints/TASK-FAMILY-LABEL-1-lead-review-round2.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-ui.js`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- focused shared task-shell and wrapper tests.

## Data integrity notes

Protected reference data status: no sprint-start changes are planned or
allowed in `references/machine` or `references/external`.

No source exit-ticket data, reasoning CSV, skilltree data, graph data,
procedure data, guided-practice data, generated Book 1 lesson output,
target-exercise registry, candidate storage, PV projection, product-facing
route, or old exit-ticket game archive is allowed to change in this sprint.

## Quality Baseline

The accepted contract requires `matching_pairs` to support keyboard-operable
pair selection and feedback for unmatched, misplaced, or extra pairs. The
family may not become generic quiz variety and may not substitute for richer
target operations unless a later gate reviews that application context.

## Existing Follow-Up Flags To Preserve

- Product-route screenshots are required before any new task family is adopted
  in generated routes.
- `GATE-TASK-FAMILY-1` must review rendered output, feedback,
  keyboard/focus behavior, mobile/dark proof, task affordance, and
  target-proof boundaries before these families are relied on by
  `REASON-STD-1`, `CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, or Scale Gate 1.
- Scale Gate 1 remains blocked by the wider Product Proof Track.
- The old exit-ticket game archive remains separately tracked at
  `knowledge/exit-ticket-game-1.1.1.zip` and is not part of this sprint.

## Baseline Validation To Run

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-FAMILY-MATCH-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-FAMILY-MATCH-1
```

## Stop Conditions At Baseline

Stop before implementation if the plan does not include:

- exact response-shape rules;
- one-to-one pair-bank validation;
- accessible item descriptions and distractor intent;
- narrow/dark fixture proof;
- keyboard/focus proof;
- wrapper collection requirements;
- explicit product-authority boundaries;
- planning review and lead-review lifecycle.
