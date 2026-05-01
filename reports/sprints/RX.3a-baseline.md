# Sprint RX.3a: Baseline

## Plan reference

Plan: `docs/sprints/RX.3a-plan.md`

## Current state

`GATE-RX3-producer-representation` is closed as `pass_with_conditions`. It authorizes first-lane mutation review for `A75`, `A76`, and `A79`, but it does not authorize unit mutation.

At baseline, `A75`, `A76`, and `A79` are not live units. The required existing dependencies `A04`, `A14`, and `A61` are live.

## Data integrity notes

Protected reference data must not change in RX.3a review preparation. No hand edits to `references/machine/` or `references/external/` are allowed, and no `unit-add.js` command may run before the human mutation-review gate explicitly authorizes CLI execution.

## Baseline risks

- `A76` could accidentally omit the HCS-required `A61` dependency.
- `A79` depends on `A75`, so CLI order must add `A75` before `A79`.
- Missing generators could leak into student-facing skill-tree use if generator-blocked status is not recorded.
- Graph-lane candidates could accidentally be pulled into the table/data lane.

## Acceptance baseline

RX.3a preparation closes only when the candidate specs, CLI plan, generator-blocked records, review packet, and bundle URLs validate, and the roadmap records that human review is required before mutation.
