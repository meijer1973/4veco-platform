# Sprint RX.3b: Baseline

## Plan reference

`docs/sprints/RX.3b-plan.md`

## Current state

`GATE-RX3-producer-representation` is closed as `pass_with_conditions`. It authorizes graph-lane review for `A77` and `A78` after `A75` exists, but it does not authorize unit mutation.

`RX.3a` completed the producer table/data first lane. `A75`, `A76`, and `A79` are live catalog units and remain generator-blocked/non-interactive.

At baseline, `A77` and `A78` are not live units. `A80`, `A81`, and graphical `MO=MK` remain held/out of scope. The required existing dependencies `A29`, `A63`, and `A75` are live.

## Data integrity notes

Protected reference data must not change in RX.3b review preparation. No hand edits to `references/machine/` or `references/external/` are allowed, and no `unit-add.js` command may run before a later human mutation-review gate explicitly authorizes CLI execution.

## Baseline risks

- `A77` could accidentally become a duplicate of the broader algebraic `A29` break-even analysis instead of staying graph-reading focused.
- `A78` could conflate vertical distance in a TO-TK graph with horizontal distance or generic profit arithmetic.
- `A78` dependency on `A77` is a human-review decision, not something to silently add.
- `A80`, `A81`, or graphical `MO=MK` could be pulled into the lane too early.
- Missing generators could leak into student-facing skill-tree use if generator-blocked status is not recorded.

## Acceptance baseline

RX.3b preparation closes only when the candidate specs, CLI plan, generator-blocked records, review packet, and bundle URLs validate, and the roadmap records that human review is required before mutation.
