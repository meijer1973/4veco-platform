# Sprint MTU-H2F: Result

Generated: 2026-05-28

Status: completed.

## Plan reference

Plan: `reports/sprints/MTU-H2F-plan.md`

## Summary

MTU-H2F executed the GATE-MTU-H2E authorized conditional Solo q1-q3 command
set through the reference CLI only:

- updated `A12` while retaining `A2.11`;
- added `A88`, `A89`, `A90`, `A92`, and `A93`;
- kept `A20` held and out of the command set.

Each extracted JSON spec was written to the execution log before execution.
`unit-update --dry-run` passed for `A12` before the live update. The new
generator-backed A-domain units are recorded as generator-blocked /
not-yet-interactive until their generators are implemented and student-facing
exposure is separately reviewed.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js` | passed |
| `node build-scripts/references/check-mtu-h2d-held-conditional-resolution.js` | passed |
| `node build-scripts/references/check-mtu-h2a-cli-mutation-plan.js` | passed |
| `node build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js` | passed |
| `node build-scripts/references/check-mtu-h2-solo-cases.js` | passed |
| `node build-scripts/references/build-unit-index.js` | passed |
| `node build-scripts/references/validate-core-schemas.js` | passed |
| `node build-scripts/references/build-skilltree-generator-readiness.js` | passed |
| `node build-scripts/references/check-skilltree-generator-readiness.js` | passed |
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-H2F-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-H2F --complete` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MTU-H2G` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `node build-scripts/references/check-source-document-registry.js` | passed |
| `node build-scripts/references/check-source-manifest.js` | passed |
| `node build-scripts/references/check-document-inventory.js` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `npm.cmd test -- --runInBand` | passed |
| `git diff --check` | passed |

## Changed files

Protected reference registry changed through CLI-generated output:

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`

Execution and sprint records:

- `build-scripts/references/execute-mtu-h2f-conditional-lanes.js`
- `reports/sprints/MTU-H2F-execution-log.md`
- `reports/sprints/MTU-H2F-execution-log.json`
- `reports/sprints/MTU-H2F-result.md`
- `reports/sprints/MTU-H2F-diff-summary.md`
- `references/data/sprints/MTU-H2F.plan.json`
- `references/data/sprints/MTU-H2F.result.json`
- `reports/sprints/MTU-H2G-plan.md`
- `reports/sprints/MTU-H2G-baseline.md`
- `references/data/sprints/MTU-H2G.plan.json`

Lifecycle checkers were updated to accept both pre-H2F and post-H2F states:

- `build-scripts/references/check-mtu-h2a-cli-mutation-plan.js`
- `build-scripts/references/check-mtu-h2b-cli-execution-gate-packet.js`
- `build-scripts/references/check-mtu-h2d-held-conditional-resolution.js`
- `build-scripts/references/check-mtu-h2e-conditional-lane-execution-packet.js`

Generator-readiness reports were refreshed:

- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/review-packet.json`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/technical-closure.json`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/technical-closure.md`

Roadmap and index files were refreshed:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.96-gate-mtu-h2e-pass-with-conditions.md`
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

## Data integrity notes

Protected reference data changed only through reference CLI execution and
projection rebuilds. `references/external/` did not change. No candidate
storage was created, no candidate writes occurred, no lesson output was
mutated, and no target exercise was promoted.

`A20` remains live and unchanged; it is still held for a separate
split/deprecate/replacement and affected-mapping packet. The pre-existing
untracked `knowledge/exit-ticket-game-1.1.1.zip` file remained untouched and
uncommitted.

## Open follow-ups

- Prepare `MTU-H2G` for the held `A20` split/replacement and affected-mapping
  packet.
- Continue `MTU-H3` incidence/pass-through after the Solo q1-q3 A20 route is
  no longer ambiguous or explicitly scheduled separately.
- Implement or separately review generators for `GEN_A85` through `GEN_A93`
  before any student-facing skill-tree exposure.

## Rollback instructions

If this execution must be reverted before commit, revert the H2F commit or
restore only the H2F-generated files from the pre-execution commit. Do not
hand-edit `references/machine/`. If a specific newly minted unit must be
removed after commit, use a reviewed `unit-deprecate` or revert lane.
