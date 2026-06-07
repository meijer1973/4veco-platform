# Sprint MTU-GENBLOCK-HARDEN-1: Result

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/MTU-GENBLOCK-HARDEN-1-plan.md`

Plan JSON: `references/data/sprints/MTU-GENBLOCK-HARDEN-1.plan.json`

## Summary

Implemented generator-blocked MTU exposure hardening.

Implemented:

- source `ROUTE_SKILLS` now excludes generator-blocked A-domain units while
  preserving non-A concept route rows;
- deploy bundle route data applies the same blocked A-domain filter;
- readiness builder/report now records source/deploy route exports, route leak
  counts, false downstream authority flags, and blocked downstream uses;
- readiness checker validates explicit block records, source/deploy
  interactive splits, source/deploy route splits, policy flags, and
  deterministic negative-fixture rejection;
- focused Jest coverage proves blocked A-domain units are absent from route
  catalogs and that non-A route concepts remain available.

Current readiness summary:

- active A-domain units: 98
- interactive generator-backed A-domain units: 47
- generator-blocked A-domain units: 51
- explicit generator-block records: 51
- source route rows: 202
- deploy route rows: 202
- blocked interactive leaks: 0
- blocked route leaks: 0
- negative-fixture rejection required: true

First-three product-route relevance remains blocked rather than silently
wired. `1.1.1`, `1.1.2`, and `1.1.3` still need later reviewed work for
A80/A81/A96-A99 answer-form coverage, plus paragraph-specific blockers such as
D31 proof and graph-axis/source-use repair.

## Acceptance test results

Passed through `run-sprint-command.js`:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-GENBLOCK-HARDEN-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js MTU-GENBLOCK-HARDEN-1`
- `node build-scripts/references/build-skilltree-generator-readiness.js`
- `node build-scripts/references/check-skilltree-generator-readiness.js`
- `npx.cmd jest engines/tests/skilltree-data.test.js engines/tests/skill-map-engine.test.js --runInBand`
- `npm.cmd run check:platform`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-url-index.js`
- `npm.cmd run dashboard:internal`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/sprints/check-lead-review-substance.js MTU-GENBLOCK-HARDEN-1`
- `node build-scripts/sprints/check-sprint-command-log.js MTU-GENBLOCK-HARDEN-1`
- `node build-scripts/sprints/check-sprint-result.js reports/sprints/MTU-GENBLOCK-HARDEN-1-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js MTU-GENBLOCK-HARDEN-1 --complete`
- `git diff --check`

Closure validators are included in result metadata and command-log evidence.

## Changed files

Implementation:

- `engines/skilltree/base-elements.js`
- `scripts/deploy.js`
- `build-scripts/references/build-skilltree-generator-readiness.js`
- `build-scripts/references/check-skilltree-generator-readiness.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skill-map-engine.test.js`

Evidence, roadmap, and indexes:

- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/*`
- `reports/sprints/MTU-GENBLOCK-HARDEN-1-*`
- `references/data/sprints/MTU-GENBLOCK-HARDEN-1.*.json`
- `references/reference-team-roadmap.md`
- `reports/github-agent-index-*.md`
- `reports/github-agent-index-*.json`
- `reports/internal-dashboard/*`
- `reports/url-index.md`

## Data integrity notes

No protected reference data changed. `references/machine/` and
`references/external/` remain unchanged. The sprint did not mutate
`source-data/`, generated Book 1 lesson output, target-exercise registries,
candidate storage, PV outputs, diagnostics, adaptive routing,
mastery/sequencing, Scale Gate 1, or product-use surfaces.

No missing generator was implemented and no placeholder generator was added.

## Open follow-ups

- A separate generator or reviewed proof-design sprint is required before
  A80/A81/A96-A99 can appear in first-three product routes.
- Generated Book 1 route screenshots and live route checks remain follow-up
  proof for any later product-route adoption sprint.
- PV projection, diagnostics, adaptive routing, mastery/sequencing, Scale
  Gate 1, summative use, and student/product authority remain blocked.

## Rollback instructions

Rollback by reverting the sprint commit. That removes the route export
hardening, readiness builder/checker extensions, focused tests, regenerated
readiness outputs, map/index refreshes, roadmap completion rows, and sprint
evidence. Do not hand-edit `references/machine/`, `references/external/`,
source-data, or lesson output during rollback.
