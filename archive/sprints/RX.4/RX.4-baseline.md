# Sprint RX.4: Baseline

## Plan reference

`docs/sprints/RX.4-plan.md`

## Current state

`RX.1` closed as `pass_with_conditions`. It accepted `A82` and `A84` as earlier elasticity candidates after the core table/index lane, while keeping `A83` conditional on P-Q graph/source-value readiness.

`RX.2b` completed the graphical foundation lane. `A63` and other graph-reading prerequisites are live but generator-blocked/non-interactive.

`RX.3a` and `RX.3b` completed producer table/data and TO-TK graph lanes. `A75`, `A76`, `A77`, `A78`, and `A79` are live but generator-blocked/non-interactive.

At baseline, `A82`, `A83`, and `A84` are not live units. Required prerequisites `A15`, `A46`, `A61`, `A66`, and `A67` are live. Market/welfare units `A19`, `A32`, `A40`, `D39`, and `D40` already cover surplus and welfare surfaces, while `A51`, `A56`, and `A59` cover key market-intervention graph operations.

## Data integrity notes

Protected reference data must not change in RX.4 review preparation. No hand edits to `references/machine/` or `references/external/` are allowed, and no `unit-add.js` command may run before a later human mutation-review gate explicitly authorizes CLI execution.

## Baseline risks

- `A82` could pair the wrong driver and response variables when table rows contain multiple price/quantity changes.
- `A83` could be too narrow or mismatched because the RX.1 evidence is graph-extraction relevant but not perfectly demand-graph-specific.
- `A84` could become a generic elasticity interpretation duplicate instead of a source-based revenue-direction unit.
- New market/welfare units could duplicate `A19`, `A32`, `A40`, `D39`, `D40`, `A51`, `A56`, or `A59`.
- Missing generators could leak into student-facing skill-tree or PV projection use if generator-blocked status is not recorded.

## Acceptance baseline

RX.4 preparation closes only when the candidate specs, conditional CLI plan, generator-blocked records, market/welfare hold notes, review packet, and bundle URLs validate, and the roadmap records that human review is required before mutation.
