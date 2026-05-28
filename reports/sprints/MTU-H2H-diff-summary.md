# Sprint MTU-H2H: Diff Summary

Generated: 2026-05-28

## Summary

MTU-H2H adds a non-mutating A20/A94/A95 CLI-mutation planning packet and
review gate bundle. It does not mutate protected reference data, authored
target-exercise mappings, generator code, generated lesson output, candidate
storage, or product surfaces.

## Protected surfaces

- `references/machine/`: no hand edits and no CLI mutation in this sprint.
- `references/external/`: unchanged.
- `references/authored/course-target-exercises.json`: unchanged; mapping
  changes are planned only.
- `engines/skilltree/generators.js`: unchanged; generator route is planned
  only.
- Candidate storage: not created.
- Lesson output: unchanged.
- Target-exercise promotion: not authorized.
- PV projection or machine promotion: not authorized.

## Main additions

- H2H A20/A94/A95 CLI-mutation planning packet under
  `reports/mtu-hardening/`.
- GATE-MTU-H2H review packet and bundle URLs under `reports/review-gates/`.
- H2H packet checker under `build-scripts/references/`.
- Sprint plan, baseline, result/diff/result JSON, and roadmap/index updates.

## Operational next action

Commit and push the H2H packet and cited evidence, then run
`GATE-MTU-H2H-a20-cli-mutation-plan` as the formal human review before any
`A20` CLI mutation, `A94`/`A95` unit minting, target-exercise mapping update,
generator change, generated projection refresh, or student-facing exposure.
