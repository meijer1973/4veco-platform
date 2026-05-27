# Sprint MTU-H1: Diff Summary

Date: 2026-05-27

## Summary

MTU-H1 adds a non-mutating benchmark layer for the Solo q1-q3 MTU-hardening
findings. The new benchmark makes later review work concrete without editing
the live MTU registry.

## Primary additions

- Added `reports/mtu-hardening/benchmark-sample-v1.json` with three Solo seed
  records, stratified future sample slots, future sprint routing, authority
  boundaries, and quality-log entries.
- Added `reports/mtu-hardening/solo-q1-q3-operation-map.md` with a readable
  mapping of q1, q2, and q3 operations to current MTU fit, missing candidates,
  answer-form needs, misconception targets, and over-trigger flags.
- Added `reports/mtu-hardening/failure-taxonomy-v1.md` with recurring defect
  classes, answer-form targets, incidence-family targets, regression-validator
  targets, and the quality log.
- Added `build-scripts/references/check-mtu-hardening-benchmark.js` as a
  read-only validator for the benchmark.

## Roadmap updates

- Archived roadmap version
  `v2.84-game-ux2-exit-ticket-checkpoint`.
- Updated the active roadmap to
  `v2.85-mtu-h1-operation-benchmark`.
- Closed MTU-H1 and added future MTU-H2 through MTU-H6 routing rows.
- Updated the roadmap version index JSON and Markdown.

## Generated refreshes

Refreshed report JSON/Markdown, report manifest, reference health, internal
dashboard, GitHub-agent indexes, source-document registry, source manifest,
document inventory, and URL index.

## Protected surfaces

No protected surfaces were changed:

- no edits to `references/machine/`;
- no edits to `references/external/`;
- no unit minting;
- no operation-registry mutation;
- no answer-skill mutation;
- no candidate-storage creation;
- no candidate writes;
- no q19 extraction execution;
- no lesson-output mutation;
- no target-exercise promotion;
- no CP-6 or Year-1 closure;
- no diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student-facing output.

## Follow-up direction

The next operational step is MTU-H2: a governed Solo q1-q3 canonical
micro-case review and CLI-mutation planning lane. MTU-H1 itself does not
authorize those mutations.
