# Sprint EX-1: Exam Source Annex And Answer Model Pilot

## Goal

Create the first bounded official-exam ingestion pilot overlays after `GATE-EX0` closed as `pass_with_conditions`.

EX-1 may create exactly three non-mutating `references/data/` pilot records:

1. one calculation-heavy official VWO question;
2. one graph/source-heavy official VWO question;
3. one reasoning/answer-model-heavy official VWO question.

The sprint must prove that prompt metadata, source material, official correction-model requirements, point rules, skill decomposition, MTU gap classification, and lesson-build handoff can stay separately traceable without mutating protected external or machine references.

## Context

`GATE-EX0-exam-ingestion-contract` authorizes EX-1 as a bounded pilot only. The gate conditions are active:

- graph/source-heavy pilot items may not be marked `reviewed_ready_for_mapping` unless the required graph/table/source values are reconstructable, or a blocking `graph_object_gap` or `source_annex_gap` is carried;
- EX-1 must add a separate pilot-overlay validator for real pilot records;
- `pass_with_gaps` is acceptable only when named gaps remain visible downstream and block affected use;
- EX-1 planning must repeat that the gate authorizes no protected mutation and no student/product use.

The local `references/external/exam-questions.json` mirror already has prompt-level records, but it does not fully represent correction-model steps, point rules, source-annex objects, graph reconstruction data, or answer-construction requirements. EX-1 overlays those missing layers under `references/data/exam-ingestion/`.

## Allowed paths

- `reports/sprints/EX-1-plan.md`
- `references/data/sprints/EX-1.plan.json`
- `reports/sprints/EX-1-baseline.md`
- `reports/sprints/EX-1-planning-review.md`
- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- `build-scripts/references/check-exam-ingestion-pilots.js`
- `build-scripts/references/check-exam-ingestion-contract.js`
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`
- `references/data/sprints/EX-1.result.json`
- `reports/sprints/EX-1-result.md`
- `reports/sprints/EX-1-diff-summary.md`
- `reports/sprints/EX-1-lead-review-assignment.md`
- `reports/sprints/EX-1-lead-review-round1.md`
- `reports/sprints/EX-1-lead-review-corrections.md`
- `reports/sprints/EX-1-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, source-document registry, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.62-gate-ex0-pass-with-conditions.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `../4veco-lessen/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/external/`
- hand edits to `references/machine/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting or machine registry mutation
- target-exercise promotion
- placeholder replacement or finalization
- CP-6 closure or Year-1 closure
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing generated output

## Inputs

- `reports/review-gates/GATE-EX0-exam-ingestion-contract/` closure artifacts
- `references/schemas/exam-ingestion.schema.json`
- `references/data/exam-ingestion/README.md`
- `references/data/exam-ingestion/review-procedure.md`
- `references/external/exam-questions.json`
- `references/external/exams/vw-1022-a-25-1-o.pdf`
- `references/external/exams/vw-1022-a-25-1-c.pdf`
- `references/reference-team-roadmap.md`
- `references/machine/micro-teaching-units.md`
- `reports/reference-planning/CP.6c-mtu-backfill-classification.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- `references/data/exam-ingestion/exam-item-overlays.json`, containing the three full EX-1 pilot item records.
- `references/data/exam-ingestion/exam-answer-model-overlays.json`, containing correction-model overlays for the same three exam item IDs.
- `references/data/exam-ingestion/exam-source-annex-overlays.json`, containing source-material overlays for the same three exam item IDs.
- `build-scripts/references/check-exam-ingestion-pilots.js`, a real pilot-data validator.
- A gate-aware update to `build-scripts/references/check-exam-ingestion-contract.js` so EX-0 contract checks do not keep failing after authorized EX-1 pilot data exists.
- `reports/reference-planning/EX-1-exam-ingestion-pilot.md`, summarizing pilot coverage, gaps, and EX-2 routing.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if `EX-1` is not the active roadmap row, `GATE-EX0` is not closed as `pass_with_conditions`, or the current repo state is dirty before EX-1 edits.
2. Select three local official VWO 2025 tijdvak 1 records from `references/external/exam-questions.json`: question 3 as calculation-heavy, question 19 as graph/source-heavy, and question 15 as reasoning/answer-model-heavy. Confirm the matching opgaven and correction-model PDFs exist locally.
3. Create the three pilot overlay files under `references/data/exam-ingestion/`. Each record must keep prompt metadata, source material, official answer model, skill decomposition, MTU gap classification, lesson handoff, review state, and product boundary separate. The graph/source-heavy item must carry blocking source-annex and graph-object gaps unless its source values become reconstructable.
4. Add `check-exam-ingestion-pilots.js`. The validator must reject unauthorized mutation flags, hidden source/answer-model gaps, prompt-only full ingestion claims, missing answer-model steps or point rules, missing source-material records, item/source/answer-model ID mismatches, and any student/product-use flag.
5. Update `check-exam-ingestion-contract.js` narrowly: before pilot files exist, it still proves EX-0 created no pilot data; after pilot files exist, it must require the closed `GATE-EX0` authorization and the EX-1 pilot validator instead of weakening the EX-0 contract check.
6. If implementation discovers ambiguity in the `GATE-EX0` authorization, stop EX-1 and reopen a formal human gate instead of improvising. That reopened gate must show calibration questions, record each answer, run pattern analysis, ask targeted follow-ups, draft a closure proposal, and require explicit human confirmation before EX-1 continues.
7. Produce the EX-1 planning report and run acceptance tests. Stop if any pilot record is marked `reviewed_ready_for_mapping`, hides graph/source gaps, claims unit minting, promotes target exercises, mutates protected sources, or authorizes lesson output.
8. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/EX-1-lead-review-round1.md`.
9. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/EX-1-lead-review-corrections.md`.
10. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/EX-1-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
11. If EX-1 passes, close EX-1 as a non-mutating pilot and make EX-2 the active next review gate. If EX-1 fails, keep EX-1 active and report the pilot-data blockers.

## Acceptance tests

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
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-1-result.md
node build-scripts/sprints/check-sprint-bundle.js EX-1 --complete
npm.cmd test
```

## Rollback plan

Revert the EX-1 implementation commit. Rollback removes only the non-mutating pilot overlays, pilot validator, reports, sprint logs, generated report/index churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No live human interview is required inside EX-1 because `GATE-EX0` already authorized the bounded pilot data creation.

Human review remains required before EX-2 treats pilot MTU classifications as accepted mapping evidence, and before protected reference mutation, unit minting, target-exercise promotion, placeholder finalization, CP-6 closure, Year-1 closure, or any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.
