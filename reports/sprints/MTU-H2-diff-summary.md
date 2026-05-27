# Sprint MTU-H2: Diff Summary

Date: 2026-05-27

## Summary

MTU-H2 fixes the roadmap visibility issue and prepares the Solo q1-q3
canonical micro-case review package. It does not mutate the live MTU registry.

## Primary additions

- Added `reports/mtu-hardening/solo-q1-q3-canonical-cases.json`.
- Added `reports/mtu-hardening/solo-q1-q3-canonical-cases.md`.
- Added `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.md`.
- Added `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/review-packet.json`.
- Added `build-scripts/references/check-mtu-h2-solo-cases.js`.

## Roadmap updates

- Archived roadmap version `v2.85-mtu-h1-operation-benchmark`.
- Updated the active roadmap to `v2.86-mtu-h2-solo-micro-case-review`.
- Closed MTU-H2 and made `GATE-MTU-H2` the first Sprint Ledger row.
- Updated the roadmap version index JSON and Markdown.

## Protected surfaces

No protected surfaces were changed:

- no edits to `references/machine/`;
- no edits to `references/external/`;
- no unit minting;
- no unit update, split, merge, or deprecation;
- no operation-registry mutation;
- no answer-skill mutation;
- no candidate-storage creation;
- no candidate writes;
- no lesson-output mutation;
- no target-exercise promotion;
- no CP-6 or Year-1 closure;
- no diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student-facing output.

## Follow-up direction

The next operational step is GATE-MTU-H2: run the formal human review using the
packet under `reports/review-gates/GATE-MTU-H2-solo-q1-q3-micro-cases/`.
