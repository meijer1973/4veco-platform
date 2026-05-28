# Sprint MTU-H2H: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H2H-plan.md`

## Starting state

GATE-MTU-H2G closed as PASS WITH CONDITIONS for planning only. `A20` remains
live, `A91` remains live, and proposed `A94`/`A95` are not live units.

## Data integrity notes

Protected reference data must not change during MTU-H2H. The sprint may read
`references/machine/`, `references/external/`, authored target-exercise
records, and generator code, but no machine-reference, external-source,
authored target-exercise, generator, lesson-output, or student-facing mutation
is authorized.

## Known blockers

- `A20` cannot be narrowed until `3.2.2`, `3.3.3`, `4.1.2`, and `GEN.A20`
  are handled in a reviewed route.
- `A94` and `A95` would require generator implementation or explicit
  generator-blocked/not-yet-interactive status before student-facing exposure.
- Authored target-exercise mapping changes require exact before/after diffs
  and rollback.
