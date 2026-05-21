# Sprint EX-1: Result

## Plan reference

Plan: `reports/sprints/EX-1-plan.md`

## Summary

EX-1 created the first bounded official-exam ingestion pilot overlays under the closed `GATE-EX0` conditions.

The sprint added exactly three pilot item records:

- calculation-heavy: `vw-1022-a-25-1-o:opgave-1:question-3`;
- graph/source-heavy: `vw-1022-a-25-1-o:opgave-4:question-19`;
- reasoning/answer-model-heavy: `vw-1022-a-25-1-o:opgave-3:question-15`.

The overlays keep prompt metadata, source material, official answer-model steps, point rules, skill decomposition, MTU gap classification, lesson-build handoff, review state, and product boundaries separately traceable.

The graph/source-heavy item is deliberately not marked `reviewed_ready_for_mapping`. It carries blocking `source_annex_gap` and `graph_object_gap` records because the source figure and uitwerkbijlage are not fully reconstructable from the mirrored prompt text.

EX-1 also added a dedicated pilot validator and adjusted the EX-0 contract checker so authorized EX-1 pilot files are accepted only when the closed GATE-EX0 authorization and pilot validator exist.

## Acceptance test results

Passed:

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

Observed key results:

- EX-1 pilot validator passed for all three overlay families.
- EX-0 contract checker passed with authorized EX-1 pilot files present.
- Core schemas passed: `17 files`.
- Report JSON contract passed: `13 reports`.
- Source manifest passed: `281 files`.
- Document inventory passed: `1142 files`.
- Source-document registry passed: `277 records`.
- Roadmap version index passed: `66 entries`.
- Jest passed: `30` suites passed, `6` skipped; `515` tests passed, `8` skipped.

Lead-review state:

- Round 1 returned `PASS WITH FLAGS`.
- Corrections were no-op/procedural; no content corrections were required.
- Round 2 returned `PASS WITH FLAGS`.
- Complete-bundle closure passed after final metadata and roadmap updates.

## Changed files

Added:

- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `build-scripts/references/check-exam-ingestion-pilots.js`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `reports/sprints/EX-1-plan.md`
- `references/data/sprints/EX-1.plan.json`
- `reports/sprints/EX-1-baseline.md`
- `reports/sprints/EX-1-planning-review.md`
- `reports/sprints/EX-1-result.md`
- `reports/sprints/EX-1-diff-summary.md`
- `reports/sprints/EX-1-lead-review-assignment.md`
- `reports/sprints/EX-1-lead-review-round1.md`
- `reports/sprints/EX-1-lead-review-corrections.md`
- `reports/sprints/EX-1-lead-review-round2.md`
- `references/data/sprints/EX-1.result.json`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.62-gate-ex0-pass-with-conditions.md`

Updated:

- `build-scripts/references/check-exam-ingestion-contract.js`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- generated reports, dashboards, inventories, URL index, and GitHub-agent indexes refreshed through normal scripts

## Data integrity notes

No protected reference data was changed. EX-1 did not edit `references/external/`, `references/machine/`, `references/authored/course-target-exercises.json`, or `references/owned/course-blueprint-v5.md`.

No lesson output, lesson review file, or lesson quality-ref was edited.

No target exercises were promoted, no placeholders were finalized, no units were minted, and no machine registry mutation occurred.

No pilot record authorizes diagnostics, adaptive routing, mastery decisions, automatic sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

## Open follow-ups

- Start EX-2 as the human-reviewed exam-to-MTU mapping review gate.
- EX-2 must human-review the three pilot records before any MTU mapping is treated as accepted evidence.
- CP-6 and Year 1 remain open.

## Rollback instructions

Revert the EX-1 implementation commit. Rollback removes only the non-mutating pilot overlays, pilot validator, reports, sprint logs, generated report/index churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.
