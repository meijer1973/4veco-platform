# Sprint MTU-H2F: Diff Summary

Generated: 2026-05-28

## Added

- `reports/sprints/MTU-H2F-execution-log.md`
- `reports/sprints/MTU-H2F-execution-log.json`
- `reports/sprints/MTU-H2F-result.md`
- `reports/sprints/MTU-H2F-diff-summary.md`
- `references/data/sprints/MTU-H2F.result.json`
- `reports/sprints/MTU-H2G-plan.md`
- `reports/sprints/MTU-H2G-baseline.md`
- `references/data/sprints/MTU-H2G.plan.json`

## Updated

- `references/data/sprints/MTU-H2F.plan.json`
- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- `build-scripts/references/check-mtu-h2a-cli-mutation-plan.js`
- `build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js`
- `build-scripts/references/check-mtu-h2d-held-conditional-resolution.js`
- `build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/review-packet.json`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/technical-closure.json`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/technical-closure.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `references/data/source-document-registry.json`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `reports/json/source-document-registry.json`
- `reports/markdown/source-document-registry.md`
- `reports/url-index.md`
- `reports/github-agent-index-platform.json`
- `reports/github-agent-index-platform.md`
- `reports/github-agent-index-lessen.json`
- `reports/github-agent-index-lessen.md`

## Archived

- `docs/roadmaps/outdated/reference-team-roadmap-v2.96-gate-mtu-h2e-pass-with-conditions.md`

## Protected surfaces

`references/machine/micro-teaching-units.*` changed through the reference CLI
and projection validator. `references/external/` did not change. Candidate
storage, lesson output, target exercises, PV machine projection, and
student/product-use surfaces did not change.

## Boundary

MTU-H2F executed only the H2E-authorized `A12`, `A88`, `A89`, `A90`, `A92`,
and `A93` lanes. `A20` remains held outside this sprint.
