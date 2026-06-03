# Sprint REASON-REPLACE-AUDIT-1: Baseline

Generated: 2026-06-03

## Plan reference

Plan: `reports/sprints/REASON-REPLACE-AUDIT-1-plan.md`

## Baseline

The current reasoning evidence proves local shared-shell playability for selected
modes. It does not prove that those tasks can replace the reasoning game.

## Known Flags

- Mode 2 remains local error repair.
- Mode 3 remains ordered-chain bridge.
- Mode 4 remains held.
- Mode 5 remains self-check only.
- A81 source-use route is not live-proven.
- A99 lacks live example-answer evidence.
- Compact controls and feedback hierarchy need UX hardening.

## Stop Conditions

Stop if the audit marks any mode fully replacement-ready without separate
rendered product-route proof and human review.

## Data integrity notes

No protected reference data may change. `references/machine/` and
`references/external/` are out of scope. The audit does not mutate source
reasoning CSVs, generated Book 1 lesson output, target-exercise records,
candidate storage, or product authority artifacts.
