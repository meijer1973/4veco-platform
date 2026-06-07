# Sprint MTU-EVIDENCE-HARDEN-1: Diff Summary

Generated: 2026-06-07

## Summary

This sprint adds a read-only MTU evidence-layer freshness checker, wires it
into platform CI, and refreshes stale generated evidence outputs through their
intended builders.

## Protected Surfaces

No protected source surfaces changed:

- `references/machine/`
- `references/external/`
- `source-data/`

`node build-scripts/references/build-unit-index.js` was run as the intended
projection command and validated 256 units. It did not leave a diff in
`references/machine/micro-teaching-units.json`.

No lesson-target output, generated Book 1 route, engine runtime, target
exercise registry, candidate storage, diagnostics, adaptive routing, mastery,
sequencing, summative use, student-facing AI, PV projection, Scale Gate 1,
product-wide use, or student/product authority changed.

## Implementation Diff

- Added `build-scripts/references/check-mtu-evidence-layer.js`.
- Added a `platform-ci / validate-platform` step in
  `.github/workflows/platform-ci.yml` that runs the new checker.

## Generated Report Refresh

Regenerated through intended scripts:

- `node build-scripts/references/audit-empty-needs.js`
- `node build-scripts/reports/generate-all.js`
- `node build-scripts/references/build-skilltree-generator-readiness.js`
- `node build-scripts/references/build-procedure-visual-coverage.js`
- `node build-scripts/reports/generate-reference-health.js`

Fresh report state:

| Surface | Before audit | After regeneration |
|---|---:|---:|
| MTU projection | 256 total / 253 live / 3 deprecated | unchanged |
| JSON-first coverage/reference-health family | 238 total / 235 live / 3 deprecated where surfaced | 256 total / 253 live / 3 deprecated where surfaced |
| Procedure-visual coverage | 247 live | 253 live |
| Empty-needs audit summary | 190 live / 61 empty needs | 253 live / 52 empty needs |
| Skilltree blocked-units record | 37 blocked units | 51 blocked units |

No remaining stale or missing generated MTU count report is known. The
freshness checker now fails if the checked report family drifts from the
canonical projection.

## Generated Side Effects

The following nested review-gate packet files changed as generated side
effects of the readiness/coverage builders and are intentionally included in
this sprint's reviewed surface:

- `reports/review-gates/GATE-PV6-coverage-dashboard/review-packet.json`
- `reports/review-gates/GATE-PV6-coverage-dashboard/technical-closure.json`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/review-packet.json`

The changes are generated count/timestamp packet refreshes; they do not reopen
or close a human-review gate.

## Roadmap And Index Diff

- Updated `references/reference-team-roadmap.md` with the sprint record and
  completion state.
- Refreshed `reports/github-agent-index-platform.*`,
  `reports/github-agent-index-lessen.*`, `reports/url-index.md`, and
  `reports/internal-dashboard/*`.

## Sprint Record Diff

Added the MTU evidence hardening plan, baseline, command log, planning review,
verification review, lead-review cycle, result, diff summary, and plan/result
metadata under `reports/sprints/` and `references/data/sprints/`.

## Rollback Notes

Rollback should revert this sprint's single platform commit only. Reverting
that commit removes the new checker, CI step, refreshed generated reports,
roadmap/index/dashboard updates, and sprint records while restoring the prior
generated-report state.
