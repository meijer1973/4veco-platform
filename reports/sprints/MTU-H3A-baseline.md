# Sprint MTU-H3A: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H3A-plan.md`

## Starting state

GATE-MTU-H3 closed as PASS WITH CONDITIONS for routing only. Live `D07`
still calculates tax afwentelingspercentage and still needs `D05` and `A15`.
Proposed `D41`, `D42`, `D43`, `D44`, `D45`, and `D46` are absent from the live
registry. Live `A93` remains a percentage price-change unit and explicitly
distinguishes that calculation from incidence or pass-through share.

Target exercise `3.1.1` still lists `D07`. Target exercise `3.1.2` still lists
`D07` without a separate euro-burden unit. Target exercise `3.1.3` still has
subsidy equilibrium and welfare work without dedicated subsidy incidence
units.

## Data integrity notes

Protected reference data must not change during MTU-H3A. The sprint may read
`references/machine/`, `references/external/`, authored target-exercise
records, and prior gate records, but no machine-reference, external-source,
authored target-exercise, generated projection, lesson-output, or
student-facing mutation is authorized.

## Known blockers

- No separate supply-elasticity MTU exists; the proposed `D45` route must make
  the qualitative supply-elasticity responsibility explicit or be held by the
  review.
- `D44` subsidy benefit-sharing is conceptually accepted, but current
  `3.1.3` asks effective prices, subsidy cost, surplus, and DWL rather than a
  direct benefit-sharing question.
- `unit-add` has no dry-run support; any later execution packet must disclose
  that limitation and compensate with exact spec logging and validation.
