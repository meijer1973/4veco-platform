# Sprint PV.7: Baseline

## Plan reference

Plan: `docs/sprints/PV.7-plan.md`

## Current state

PV is currently a governed `references/data/procedure-visual/` overlay. The overlay contains pilot procedure templates, visual states, unit-template links, vocabulary, schemas, validator support, procedure-game alignment proof, projection proof, and coverage dashboards.

At baseline, no Procedure-Visual registry exists under `references/machine/`. No PV machine-edit CLI exists, no PV machine-promotion mutation log exists, and no two lesson-side PV regression proofs are recorded in the platform review-gate reports.

## Data integrity notes

Protected reference data must not change in PV.7 review preparation. No hand edits to `references/machine/` or `references/external/` are allowed, and no Procedure-Visual machine registry may be created before explicit human promotion approval and a CLI-backed mutation path exist.

## Baseline risks

- A useful PV overlay could be mistaken for machine-registry readiness.
- Unit-template links could be promoted before CLI and mutation-log discipline exists.
- Procedure templates or visual states could become machine-authoritative before renderers and lesson regressions are mature.
- Student-facing PV projection could be inferred from report-side SVG proof artifacts even though publication remains blocked.

## Acceptance baseline

PV.7 preparation closes only when the readiness report, review packet, bundle URLs, and roadmap/version-index updates validate, and the Sprint Ledger still shows PV.7 as awaiting human review rather than completed.
