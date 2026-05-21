# Sprint EX-1: Lead Review Assignment

Generated: 2026-05-21

## Review Request

Review the completed EX-1 sprint bundle as a bounded non-mutating official-exam ingestion pilot.

## Scope

Confirm that EX-1:

- creates exactly three pilot overlays under `references/data/exam-ingestion/`;
- keeps prompt, source material, official answer model, point rules, skill decomposition, MTU gaps, lesson handoff, review state, and product boundaries separately traceable;
- keeps the graph/source-heavy pilot blocked with visible `source_annex_gap` and `graph_object_gap` records;
- adds a dedicated pilot-overlay validator;
- updates the EX-0 contract checker without weakening the EX-0 contract;
- does not mutate `references/external/`, `references/machine/`, authored target exercises, owned blueprints, or lesson output;
- does not authorize unit minting, target-exercise promotion, placeholder finalization, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

## Primary Files

- `reports/sprints/EX-1-plan.md`
- `reports/sprints/EX-1-baseline.md`
- `reports/sprints/EX-1-planning-review.md`
- `references/data/sprints/EX-1.plan.json`
- `references/data/sprints/EX-1.result.json`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `build-scripts/references/check-exam-ingestion-pilots.js`
- `build-scripts/references/check-exam-ingestion-contract.js`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `reports/sprints/EX-1-result.md`
- `reports/sprints/EX-1-diff-summary.md`

## Validation Evidence

Passed before lead review:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-1
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test
```

## Expected Verdict

Return `PASS`, `PASS WITH FLAGS`, or `REVISE`.

If `REVISE`, name exact required corrections. If `PASS WITH FLAGS`, name residual risks that should remain visible.
