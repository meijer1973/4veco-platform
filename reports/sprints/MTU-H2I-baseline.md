# Sprint MTU-H2I: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H2I-plan.md`

## Starting state

GATE-MTU-H2H closed as PASS WITH CONDITIONS for execution-packet preparation
only. `A20`, `A91`, `A12`, `A13`, and `A02` are live catalog units.
Proposed `A94` and `A95` are not live units. Target exercises `3.2.2`,
`3.3.3`, and `4.1.2` still carry their pre-mutation A20 mappings.

## Data integrity notes

Protected reference data must not change during MTU-H2I. The sprint may read
`references/machine/`, `references/external/`, authored target-exercise
records, and generator code, but no machine-reference, external-source,
authored target-exercise, generator, lesson-output, generated projection, or
student-facing mutation is authorized.

## Known blockers

- `A20` cannot be safely narrowed while the current interactive `GEN.A20`
  behavior still practises given MO and given MK-function solving.
- `A94` and `A95` require generator handling before student-facing exposure:
  implementation, move/rewrite, or explicit generator-blocked status.
- Authored target-exercise mapping changes require exact before/after diffs,
  rollback, and validation.
