# Sprint MTU-H2G: Result

Generated: 2026-05-28

Status: completed as non-mutating packet sprint.

## Plan reference

Plan: `reports/sprints/MTU-H2G-plan.md`

## Summary

MTU-H2G prepared the held `A20` split/replacement and affected-mapping
planning packet after MTU-H2F. The sprint audited active `A20` target-exercise
uses and `GEN.A20`, then produced a remote-review-ready gate packet for
`GATE-MTU-H2G-a20-split-replacement`.

The packet classifies:

- `3.2.2` as given-MO/price-taker plus derived-MK, currently over-triggering
  `A12` through `A20`;
- `3.3.3` as the full derived-MO and derived-MK route, the best fit for a
  narrowed `A20`;
- `4.1.2` as given constant MK, now better routed through live `A91`;
- `GEN.A20` as given MO-function plus given MK-function, mismatching a narrowed
  derived-route `A20` unless updated, moved, or exposure-blocked.

No `A20` mutation, `A94`/`A95` minting, target-exercise mapping write,
generator implementation change, PV projection, lesson output, candidate
write, or student/product use was executed or authorized.

## Acceptance test results

The following acceptance tests are required for closure and were run during
the final validation pass:

```bash
node build-scripts/references/check-mtu-h2g-a20-split-packet.js
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2G-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-H2G --complete
node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js
node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
npm.cmd test -- --runInBand
git diff --check
```

## Changed files

- Added `reports/mtu-hardening/solo-q1-q3-a20-split-replacement-packet.json`
  and `.md`.
- Added `reports/review-gates/GATE-MTU-H2G-a20-split-replacement/review-packet.json`
  and `.md`.
- Added `reports/review-gates/GATE-MTU-H2G-a20-split-replacement/bundle-urls.md`.
- Added `build-scripts/references/check-mtu-h2g-a20-split-packet.js`.
- Updated `reports/sprints/MTU-H2G-plan.md` and
  `references/data/sprints/MTU-H2G.plan.json` with the H2G checker and gate
  metadata.
- Added this result log, the H2G diff summary, and the H2G result JSON.
- Updated roadmap/index and generated reference indexes for discoverability.

## Data integrity notes

Protected reference data was not changed. `references/machine/` and
`references/external/` were read only for this sprint. The packet explicitly
blocks hand edits, direct `A20` mutation, unit minting, unit update/split or
deprecation execution, target-exercise promotion, PV projection, and
student/product use until a later human gate names exact authority.

## Open follow-ups

- Run `GATE-MTU-H2G-a20-split-replacement` as the next human review after this
  packet and cited evidence are pushed to remote.
- If the gate passes, prepare only the next bounded CLI-mutation planning or
  execution packet it authorizes for `A20`/`A94`/`A95`, affected mappings, and
  `GEN.A20` behavior.
- Keep MTU-H3 incidence/pass-through separate unless the H2G gate explicitly
  says it may proceed with A20 held.

## Rollback instructions

Because MTU-H2G did not mutate protected reference data, rollback is limited to
removing or revising the H2G packet, checker, gate bundle, sprint logs, and
roadmap/index updates. Do not revert unrelated user or generated work.
