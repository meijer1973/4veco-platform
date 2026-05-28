# Sprint MTU-H2J: Baseline

Generated: 2026-05-28

## Plan reference

Plan: `reports/sprints/MTU-H2J-plan.md`

## Starting point

GATE-MTU-H2I closed as PASS WITH CONDITIONS and authorized a later bounded
execution sprint for `A20`, `A94`, `A95`, target mappings, generator route, and
post-source-mutation projection refresh.

Reviewed H2I remote commit:
`1fb0b95fc6b031f37ff780fb3db063dd9deb7d25`

Current baseline before execution:

- `A20`, `A91`, `A12`, `A13`, and `A02` are expected to exist.
- `A94` and `A95` are expected to be absent.
- `GEN.A20` is expected to exist.
- `GEN.A94` and `GEN.A95` are expected to be absent.
- `3.2.2` still uses `A20` and must later move to `A94`.
- `3.3.3` still uses `A20` and must remain unchanged.
- `4.1.2` still uses `A20` and must later move to `A91`.

## Data integrity notes

This sprint is allowed to change protected reference data only through the
reference CLI. It may change authored target-exercise mappings and generator
source as reviewed source mutations. `references/external/` remains forbidden.

No candidate storage, candidate writes, lesson output, target-exercise
promotion, diagnostics, adaptive routing, mastery/sequencing, student-facing
AI, summative use, PV projection, PV machine promotion, or student/product use
is allowed.

The pre-existing untracked `knowledge/exit-ticket-game-1.1.1.zip` file is not
part of this sprint and must remain untouched.
