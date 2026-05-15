# Sprint S9: Baseline

## Plan reference

- Plan: `docs/sprints/S9-plan.md`
- Plan metadata: `references/data/sprints/S9.plan.json`
- Roadmap label: Sprint 9 / `S9`
- Gate: `GATE-CP5-D04-resolution`

## Current roadmap state

S8 is closed as an internal diagnostic overlay. The immediate next reference sprint is Sprint 9 Unit Design Status And D04 Resolution. S9 must preserve S8's blocked-use boundaries: no misconception records as curriculum authority, exam authority, scoring rules, student diagnostics, adaptive routing, mastery, sequencing, AI, summative decisions, PV projection, or PV machine promotion.

The roadmap requires S9 to decide whether `unit_design_status` is a derived overlay or a CLI-backed machine-unit field, resolve D04 as retire/merge/redistribute/split, audit dependent units, and produce the CP-5 review packet.

## D04 baseline

`D04 Elasticiteit en goederenclassificatie` currently exists in `references/machine/micro-teaching-units.json` and is treated as read-only input for S9. The current record has empty `needs`, the term `inkomenselasticiteit`, and exam codes `D1.7` and `D1.8`.

Prior evidence says D04 is not a simple `D04 -> A15` prerequisite problem:

- R2.3 human review recorded that there is no need for a separate D04 unit if goods classification is embedded in the relevant elasticity units.
- R2.4 marked D04 as `unit_design_required` and recommended a later CLI-supported retire/merge/redistribute plan.
- R5 alignment-graph closure allows D04 as a unit-design issue only, not as prerequisite authority.
- R8.1 reference-quality issue `R8-QC-007` requires a D04 decision record, dependent-unit audit, and VWO economics review outcome before C-to-B promotion depends on it.

Likely affected units for the initial audit are `A15`, `A16`, `A17`, `D06`, `D11`, `D12`, and `D27`.

## Tooling baseline

`reports/json/reference-cli-coverage.json` says unit deprecation, split, and merge commands exist, but D04 still needs an explicit human design decision and concrete target specs before any CLI mutation.

No existing `references/data/unit-design-status/` overlay exists yet. No `unit-design-status` schema, builder, validator, JSON report, or Markdown report exists yet.

## Data integrity notes

Protected reference data status: S9 must not hand-edit or mutate `references/machine/` or `references/external/`. The planned `unit-design-status` record is a derived `references/data/` overlay, not a machine-unit field and not curriculum authority.

Generated lesson output is out of scope. S9 must not write to `4veco-lessen/`, must not promote exercises that rely on D04, and must not create student-facing diagnostics or routing.

## Baseline acceptance expectation

The planning bundle should pass before implementation:

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S9-plan.md
node build-scripts/sprints/check-sprint-bundle.js S9
```
