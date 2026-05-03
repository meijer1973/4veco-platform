# Sprint RX.6: Diff Summary

## Summary

RX.6 makes the skill-tree generator boundary explicit across source, deploy, reports, and roadmap state.

## Runtime and deploy

- `scripts/deploy.js` now exports helper data for tests and bundles only generator-backed A-domain units as interactive `SKILLS`.
- Deployed browser bundles now include `GENERATOR_BLOCKED_SKILLS` for missing-generator catalog units.
- `engines/tests/skilltree-data.test.js` now verifies the deploy bundle data matches source `base-elements.js`.

## Reports and gates

- Added `skilltree-generator-readiness` JSON/Markdown reports.
- Added `RX.6-generator-blocked-units.json` with explicit non-interactive status for all 37 active A-domain units without generators.
- Updated representation-operation and graph-skill-tree reports so missing-generator graph units are generator-blocked instead of untracked.
- Updated `reference-health` with skill-tree generator readiness.
- Added `GATE-RX6-skilltree-generator-integration` technical packet and closure.

## Roadmap

- Roadmap version moved from `v2.35-pv6-coverage-dashboard` to `v2.36-rx6-skilltree-generator-integration`.
- Archived `docs/roadmaps/outdated/reference-team-roadmap-v2.35-pv6-coverage-dashboard.md`.
- Moved RX.6 to completed and PV.7 to the top open sprint.

## Protected surfaces

No hand edits were made to `references/machine/` or `references/external/`. No authored source, RAG chunk, or lesson target mutation occurred.

## Remaining blockers

Generator-blocked units are still non-interactive. RX.6 does not authorize student-facing skill-tree exposure, PV projection, diagnostics, adaptive routing, AI, sequencing, mastery, or summative use.
