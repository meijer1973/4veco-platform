# Sprint RX.3: Baseline

## Plan reference

Plan: `docs/sprints/RX.3-plan.md`

## Current state

RX.1 identified A75-A81 as producer/profit representation candidates and required producer table/data units to be split from producer graph units. RX.2 and RX.2b kept producer candidates blocked. PV.2 is now complete, so RX.3 can evaluate the candidates under Procedure-Visual constraints.

A75-A81 are not live units at baseline. Their prerequisite spine is partly live: A04, A14, A29, A45, A61, and A63 exist.

## Data integrity notes

Protected reference data must not change in RX.3 review preparation. No hand edits to `references/machine/` or `references/external/` are allowed, and no `unit-add.js` command may run before the human gate decision.

## Baseline risks

- Producer table/data candidates could be bundled together with graph candidates despite the RX.1 split requirement.
- A76 may need an extra source-value/table-selection prerequisite beyond A14/A04.
- Producer graph candidates may need stronger PV visual-state requirements before mutation.
- The held graphical MO=MK operation could accidentally be folded into A77/A80/A81.
- New A-domain units would remain generator-blocked and non-interactive after mutation.

## Acceptance baseline

RX.3 review preparation closes only when the review packet and queue validate, bundle URLs are emitted, and the roadmap records that human review is required before mutation.
