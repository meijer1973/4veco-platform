# Sprint PV.8: Baseline

## Plan reference

Plan: `docs/sprints/PV.8-plan.md`

## Current state

`GATE-PV7-machine-promotion-review` is closed as `pass_with_conditions`. HCS did not authorize PV machine promotion. The PV overlay remains under `references/data/procedure-visual/`.

The current readiness state has 0 PV machine-edit CLIs, 0 machine-promotion mutation logs, and 0 lesson-regression proofs. No PV `references/machine/` registry exists.

## Data integrity notes

PV.8 must not change protected reference data. No hand edits to `references/machine/` or `references/external/` are allowed, and no PV machine registry may be created.

## Baseline risks

- A design sprint could accidentally become an implementation sprint by adding real promotion CLIs.
- A proposed mutation-log schema could be mistaken for an actual promotion log.
- Unit-template links could be treated as promoted because they are named as the future first candidate.
- Student-facing PV projection could be inferred from machine-promotion planning even though publication remains blocked.

## Acceptance baseline

PV.8 closes only when the design report, technical packet, and roadmap/versioning validate while proving no PV machine registry, real promotion CLI, mutation log, lesson output, or student-facing projection was created.
