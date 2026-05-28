# Sprint MTU-H2G: Diff Summary

Generated: 2026-05-28

## Summary

MTU-H2G adds a non-mutating A20 split/replacement packet and review gate
bundle. It does not mutate protected reference data, generated lesson output,
candidate storage, target exercises, or product surfaces.

## Protected surfaces

- `references/machine/`: no hand edits and no CLI mutation in this sprint.
- `references/external/`: unchanged.
- Candidate storage: not created.
- Lesson output: unchanged.
- Target-exercise promotion: not authorized.
- PV projection or machine promotion: not authorized.

## Main additions

- H2G A20 split/replacement packet under `reports/mtu-hardening/`.
- GATE-MTU-H2G review packet and bundle URLs under `reports/review-gates/`.
- H2G packet checker under `build-scripts/references/`.
- Sprint result/diff/result JSON and roadmap/index updates.

## Operational next action

Commit and push the H2G packet and cited evidence, then run
`GATE-MTU-H2G-a20-split-replacement` as the formal human review before any
`A20` CLI mutation, `A94`/`A95` unit minting, target-exercise mapping update,
generator change, or student-facing exposure.
