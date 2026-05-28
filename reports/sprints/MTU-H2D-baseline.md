# Sprint MTU-H2D: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H2D-plan.md`

## Current state

MTU-H2C has completed the reduced clean-lane execution and minted `F19`,
`F20`, `A85`, `A86`, `A87`, and `A91`. The remaining Solo q1-q3 lanes are not
execution-ready.

## Baseline lane state

| Lane | Baseline state |
|---|---|
| `A12` | live unit exists as `MO bepalen` with `exam_codes: [A2.11]`; held because prior update spec removed `A2.11` |
| `A20` | live unit exists as `MO = MK oplossen`; held because target exercise `4.1.2` uses it in a given-MK context |
| `A88` | absent; conditional/revise-first |
| `A89` | absent; conditional/revise-first |
| `A90` | absent; conditional/revise-first |
| `A92` | absent; depends on unresolved `A89` route |
| `A93` | absent; conditional/revise-first |

## Data integrity notes

No protected reference data changes are allowed by MTU-H2D. Any later mutation
requires a separate reviewed execution gate and CLI path. No hand edits to
`references/machine/` or `references/external/` are allowed.

Candidate storage remains absent and lesson output remains out of scope.
