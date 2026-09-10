# Sprint RX.6: Result

## Plan reference

Plan: `docs/sprints/RX.6-plan.md`

## Summary

RX.6 completed the skill-tree generator readiness integration without implementing placeholder generators.

The source and deployed skill-tree paths now share the same boundary:

- 44 active A-domain units are generator-backed and interactive.
- 37 active A-domain units lack generators and are explicitly generator-blocked/non-interactive.
- 0 missing-generator units are untracked.
- 0 generator-blocked units leak into interactive source or deploy exports.

`scripts/deploy.js` now builds the browser `base-elements.js` bundle from the same generator-backed split as `engines/skilltree/base-elements.js`, and exports `GENERATOR_BLOCKED_SKILLS` metadata for blocked rows.

## Acceptance test results

All RX.6 acceptance tests passed:

```text
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.6-plan.md
node build-scripts/references/build-skilltree-generator-readiness.js
node build-scripts/references/check-skilltree-generator-readiness.js
npx.cmd jest engines/tests/skilltree-data.test.js --runInBand
node build-scripts/references/build-representation-operation-coverage.js
node build-scripts/references/check-representation-operation-coverage.js
node build-scripts/references/build-procedure-visual-coverage.js
node build-scripts/references/check-procedure-visual-coverage.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX6-skilltree-generator-integration
node build-scripts/sprints/check-bundle-urls.js GATE-RX6-skilltree-generator-integration
node build-scripts/sprints/check-sprint-bundle.js RX.6
node build-scripts/sprints/check-sprint-result.js reports/sprints/RX.6-result.md
node build-scripts/sprints/check-sprint-bundle.js RX.6 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Changed files

Main changes:

- `scripts/deploy.js`
- `engines/tests/skilltree-data.test.js`
- `build-scripts/references/build-skilltree-generator-readiness.js`
- `build-scripts/references/check-skilltree-generator-readiness.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`
- `reports/json/reference-health.json`
- `reports/markdown/reference-health.md`
- `reports/json/representation-operation-coverage.json`
- `reports/markdown/representation-operation-coverage.md`
- `reports/json/graph-skill-tree.json`
- `reports/markdown/graph-skill-tree.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/*`
- roadmap/versioning and sprint artifacts

## Data integrity notes

No protected reference data changed. RX.6 did not hand-edit `references/machine/` or `references/external/`, did not mutate authored sources, did not patch RAG chunks, and did not write to lesson targets.

The new block file lives under `references/data/sprints/` and records readiness status only. It does not remove catalog units and does not authorize student-facing exposure.

## Open follow-ups

- Implement real generators for blocked A-domain units in a later generator sprint.
- Keep blocked units out of student-facing skill-tree and PV projection until generator implementation validates and exposure is explicitly approved.
- PV.7 remains the next roadmap item, but machine promotion still requires schema, CLI, validators, mutation logs, reports, lesson regressions, and human approval.

## Rollback instructions

Revert the RX.6 commit. That removes the deploy bundle split, readiness builder/checker, RX.6 generator-block record, generated readiness/health/coverage reports, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.

Do not manually patch `references/machine/` during rollback; no protected reference data was edited by this sprint.
