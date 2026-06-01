# Sprint TASK-FAMILY-CHOICE-1: Baseline

Generated: 2026-06-01

## Plan reference

Plan: `reports/sprints/TASK-FAMILY-CHOICE-1-plan.md`

## Baseline evidence

- `references/reference-team-roadmap.md` lists `TASK-FAMILY-CHOICE-1` as the
  next structured choice task-family contract sprint.
- `../4veco-lessen/lessen-team-roadmap.md` mirrors the sprint and keeps it
  planning-only.
- `../4veco-lessen/specifications/product-end-state.md` requires structured
  choice families to be reviewed student actions, not quiz variety or weak
  substitutes for richer target operations.
- `../4veco-lessen/specifications/companion-core-specifications.md` requires
  response shape, validation/evaluation owner, feedback owner, focus/keyboard
  requirements, boundary flags, and route/checkpoint use cases for new task
  families.
- `reports/sprints/GAME-ARCH-2-task-shell-api.md` documents current support
  for `choice` and warns against choice-only target proof when the target
  operation is not choice-like.
- `reports/sprints/STANDARD-EXERCISES-1-exercise-family-audit.md` records
  `choice` as covered for low-stakes/advisory actions and records
  `step_ordering` as a reasoning standard-expansion family.
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md` documents
  `structured_short_response`, including an optional judgement choice, as the
  repaired alternative to brittle broad regex for the reviewed D31 task.

## Current runtime state

Read-only evidence shows:

- `engines/task-shell-engine.js` supports `choice`, `table_value_selection`,
  and `structured_short_response`.
- `engines/task-shell-ui.js` renders simple option buttons for current choice
  patterns.
- `engines/exit-ticket-engine.js` still supports legacy `choice` tasks for
  advisory/local checkpoint use.

The families covered by this sprint are not first-class runtime task-shell
families yet: `cloze_text`, `multi_select`, `matching_pairs`,
`step_ordering`, `two_tier_choice`, and `assertion_reason`.

## Data integrity notes

No protected reference data may change. `references/machine/` and
`references/external/` are out of scope. No generated lesson output, engines,
source exit-ticket data, reasoning CSVs, graph/math data builders,
target-exercise registry records, candidate storage, or product-facing routes
may change in this sprint.
