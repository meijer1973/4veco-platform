# Sprint MTU-H3: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H3-plan.md`

## Starting state

MTU-H2J is complete and pushed. The active roadmap now names MTU-H3 as the
next operational reference-team lane. Live `D07` is a heffing pass-through
percentage unit with needs `D05` and `A15`. Live `A93` is a percentage
price-change unit and explicitly distinguishes price change from incidence or
pass-through share.

Target exercise `3.1.1` currently lists `D07` even though it asks for original
equilibrium, tax-shifted supply, new consumer and producer prices, and the tax
wedge drawing, not afwentelingspercentage. Target exercise `3.1.2` does ask
for tax burden and afwentelingspercentage. Target exercise `3.1.3` covers
subsidy equilibrium, surplus, government cost, and deadweight loss without a
dedicated subsidy incidence unit.

## Data integrity notes

Protected reference data must not change during MTU-H3. The sprint may read
`references/machine/`, `references/external/`, authored target-exercise
records, generator code, and prior sprint reports, but no machine-reference,
external-source, authored target-exercise, generator, lesson-output, generated
projection, or student-facing mutation is authorized.

## Known blockers

- `D07` appears too broad or over-used for `3.1.1`, but no update or mapping
  write is authorized by MTU-H3.
- Subsidy incidence and benefit-sharing are not separately represented in the
  current MTU family.
- Elasticity explanation is currently embedded in `D07` while D07 only depends
  on demand elasticity via `A15`; supply elasticity or relative elasticity
  reasoning may need a separate reviewed lane.
- `A93` must remain a price-change operation unless a later review explicitly
  authorizes a separate cost-shock pass-through lane.
