# Sprint S9a: Result

## Plan reference

- Plan: `docs/sprints/S9a-plan.md`
- Baseline: `reports/sprints/S9a-baseline.md`
- Plan metadata: `references/data/sprints/S9a.plan.json`
- Result metadata: `references/data/sprints/S9a.result.json`
- Gate context: `GATE-CP5-D04-resolution`

## Summary

S9a completed the CP-5 D04 mutation lane. `D04 Elasticiteit en goederenclassificatie` was deprecated through `unit-deprecate.js` with replacement pointers to `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27`.

The sprint also recorded the S9a mutation plan, CLI mutation log, and stale-reference audit; removed the single active D04 citation from target exercise `2.1.3`; updated the unit-design-status overlay/report to `retired_after_cli_mutation`; resolved `R8-QC-007`; regenerated reports, reference health, RAG chunks/evals, source manifest, document inventory, URL index, and roadmap versioning.

## Acceptance test results

All S9a acceptance tests passed:

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S9a-plan.md
node build-scripts/sprints/check-sprint-bundle.js S9a
node build-scripts/references/check-s9a-d04-cli-mutation.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/build-begrippen-index.js
node build-scripts/references/build-unit-design-status-overlay.js
node build-scripts/references/check-unit-design-status.js
node build-scripts/references/check-quality-issues.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/rag/build-chunks.js
node build-scripts/rag/validate-chunks.js
node build-scripts/rag/run-retrieval-evals.js
node build-scripts/rag/validate-retrieval-eval-results.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-CP5-D04-resolution
node build-scripts/sprints/check-bundle-urls.js GATE-CP5-D04-resolution
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/check-sprint-result.js reports/sprints/S9a-result.md
node build-scripts/sprints/check-sprint-bundle.js S9a --complete
```

## Changed files

Primary S9a artifacts:

- `docs/sprints/S9a-plan.md`
- `references/data/sprints/S9a.plan.json`
- `references/data/sprints/S9a.result.json`
- `reports/sprints/S9a-baseline.md`
- `reports/sprints/S9a-result.md`
- `reports/sprints/S9a-diff-summary.md`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-plan.*`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.*`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-stale-reference-audit.*`
- `build-scripts/references/check-s9a-d04-cli-mutation.js`

Mutation and reporting surfaces:

- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `references/data/unit-design-status/unit-design-status-overlay.json`
- `references/schemas/unit-design-status.schema.json`
- `build-scripts/references/build-unit-design-status-overlay.js`
- `build-scripts/references/check-unit-design-status.js`
- `build-scripts/reports/generate-all.js`
- `references/data/qc/reference-quality-issues.json`

Generated/reporting surfaces were regenerated, including reference-health reports, JSON/Markdown report projections, RAG chunks and retrieval eval results, source manifest, document inventory, URL index, and roadmap version index.

## Data integrity notes

Protected reference data changed only through the governed CLI command:

```bash
node build-scripts/references/unit-deprecate.js --id D04 --replaced-by A15,D06,A17,D11,A16,D12,D27
```

No hand edits were made to `references/machine/` or `references/external/`. No `D04 -> A15` prerequisite edge was added. `references/external/exam-questions.json` remains read-only; its D04 citation is preserved as external extracted evidence, not hand-cleaned source.

S9a does not authorize exercise promotion, student diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.

## Open follow-ups

- Prepare `Content Track 1 Year-1 Target Exercise Coverage` and CP-6 review packet.
- Keep deprecated D04 out of active promotion dependencies and use successor units for any future authoring or review work.
- Treat remaining D04 mentions in historical/gate/generated/provenance artifacts as non-authoritative context unless a later sprint explicitly classifies them otherwise.

## Rollback instructions

Run the protected rollback command:

```bash
node build-scripts/references/unit-deprecate.js --id D04 --undo
```

Then revert the S9a implementation commit to restore target-exercise cleanup, S9a logs/audit, unit-design-status changes, reports/RAG/inventories, and roadmap/version-index updates.
