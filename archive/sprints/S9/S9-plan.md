# Sprint S9: Unit Design Status And D04 Resolution

## Goal

Create a bounded unit-design status overlay and CP-5 review packet so unstable units, starting with `D04 Elasticiteit en goederenclassificatie`, cannot silently support exercise promotion workflows.

S9 is the compact ID for the human-facing "Sprint 9" roadmap item. The compact ID is required so the existing sprint bundle tooling can validate the plan and later closure artifacts.

## Context

S8 is closed and committed as an internal-only misconception registry. S9 must not use S8 misconception records as curriculum authority, exam authority, scoring rules, student diagnostics, adaptive routing, mastery, sequencing, AI, summative decisions, PV projection, or PV machine promotion.

Prior gates and reports consistently hold `D04` as a unit-design issue, not a prerequisite-edge issue. R2.3/R2.4 recorded that goods classification belongs inside the relevant elasticity units unless evidence proves a separate unit is needed. R5 kept D04 as an internal design issue, not graph authority. R8.1 keeps an active QC issue requiring a D04 decision record, dependent-unit audit, and VWO economics review outcome.

The current CLI layer can deprecate, split, or merge units, but `unit_design_status` is not yet a governed machine-unit field. Therefore S9 starts with a derived `references/data/` overlay and a CP-5 human review gate. Any protected machine mutation must be planned later as a separate CLI-only mutation lane after explicit CP-5 closure.

## Allowed paths

- `docs/sprints/S9-plan.md`
- `references/data/sprints/S9.plan.json`
- `references/data/sprints/S9.result.json`
- `reports/sprints/S9-baseline.md`
- `reports/sprints/S9-result.md`
- `reports/sprints/S9-diff-summary.md`
- `references/schemas/unit-design-status.schema.json`
- `references/data/unit-design-status/unit-design-status-overlay.json`
- `build-scripts/references/build-unit-design-status-overlay.js`
- `build-scripts/references/check-unit-design-status.js`
- `build-scripts/reports/generate-all.js`
- `build-scripts/reports/validate-report-json.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `build-scripts/rag/build-chunks.js`
- `build-scripts/rag/validate-chunks.js`
- `reports/json/unit-design-status.json`
- `reports/markdown/unit-design-status.md`
- `reports/json/reference-health.json`
- `reports/markdown/reference-health.md`
- `reports/review-gates/GATE-CP5-D04-resolution/`
- generated RAG chunks and retrieval-eval artifacts when produced by the normal report/RAG workflow
- generated source manifest, document inventory, URL index, and roadmap/version-index files
- `references/reference-team-roadmap.md` for sprint bookkeeping and compact-ID normalization

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `D04` or any successor unit in `references/machine/`
- running `unit-deprecate.js`, `unit-merge.js`, or `unit-split.js` as part of S9
- adding a `D04 -> A15` prerequisite edge
- treating D04 as promotion-safe before CP-5 closes
- exercise promotion relying on D04 or another unstable unit
- mutation of external exam-question data
- mutation of authored target exercises
- lesson-repo generated output edits
- student-facing diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative decisions
- PV machine promotion or PV student-facing projection
- treating alignment-graph, blueprint-triage, QC, RAG, or misconception records as curriculum authority
- machine-unit `unit_design_status` field migration unless a later sprint provides schema, CLI, validator, and mutation-log workflow

## Inputs

- `references/reference-team-roadmap.md`
- `reports/sprints/S8-result.md`
- `reports/review-gates/GATE-R2-empty-needs/human-interview.md`
- `reports/review-gates/GATE-R2-empty-needs/gate-closure.json`
- `reports/review-gates/GATE-R2-empty-needs/R2.4-evidence-unit-design-packet.md`
- `reports/review-gates/GATE-R2-empty-needs/R2.4-evidence-unit-design-packet.json`
- `reports/review-gates/GATE-R2-empty-needs/R2.4-mutation-review.md`
- `reports/review-gates/GATE-R5-alignment-graph/gate-closure.json`
- `reports/review-gates/GATE-R5-alignment-graph/human-interview.md`
- `reports/json/reference-quality-issues.json`
- `reports/json/blueprint-flag-triage.json`
- `reports/json/reference-cli-coverage.json`
- `reports/json/alignment-graph-integrity.json`
- `reports/json/evidence-anchor-status.json`
- `references/machine/micro-teaching-units.json` as read-only input
- `references/authored/course-target-exercises.json`
- `references/external/exam-questions.json` as read-only input
- `references/data/source-document-registry.json`

## Outputs

- S9 sprint plan, baseline, result, diff summary, and sprint metadata.
- `unit-design-status` schema and derived overlay under `references/data/unit-design-status/`.
- Read-only unit-design status validator.
- JSON-first unit-design status report at `reports/json/unit-design-status.json` and Markdown projection at `reports/markdown/unit-design-status.md`.
- Reference-health and RAG hooks that preserve `internal_design_status`, `not_curriculum_authority`, and `promotion_blocked` labels.
- CP-5 D04 decision record in Markdown and JSON.
- CP-5 dependent-unit audit in Markdown and JSON, explicitly covering `D04`, `A15`, `A16`, `A17`, `D06`, `D11`, `D12`, `D27`, and current D04 citations.
- CP-5 unit-design status strategy in Markdown and JSON, deciding derived overlay now versus later machine-field migration.
- CP-5 review packet in Markdown and JSON.
- CP-5 human-interview record in Markdown and JSON.
- CP-5 gate closure in Markdown and JSON.
- CP-5 `bundle-urls.md`, regenerated global URL index, source manifest, document inventory, and roadmap bookkeeping.

## Operationalized sprint procedure

1. Record this plan and baseline before generating the unit-design overlay or CP-5 packet. Normalize the roadmap ledger row to compact ID `S9`; stop if `node build-scripts/sprints/check-sprint-bundle.js S9` cannot see the S9 row.
2. Inspect the R2.3/R2.4 D04 decisions, R5 graph closure, reference-quality issue, current D04 machine record, elasticity successor units, target-exercise evidence, exam-question evidence, and CLI coverage. Stop if D04 conditions are not visible or if the evidence only supports a prerequisite edge.
3. Choose the storage strategy. Prefer a derived `references/data/unit-design-status/` overlay unless the schema, CLI, validator, and mutation log for a machine-unit `unit_design_status` field are already ready. For S9, stop before any protected machine mutation.
4. Build the unit-design status schema and derived overlay. The overlay must mark D04 as unstable/promotion-blocked and must label the record as internal design status, not curriculum authority or exam authority.
5. Build the dependent-unit audit. It must include D04's current catalog state, D04 evidence/citations, and the likely redistribution/successor units `A15`, `A16`, `A17`, `D06`, `D11`, `D12`, and `D27`. Stop if any of those units are omitted without an explicit reason.
6. Add the JSON/Markdown report and safe reference-health/RAG hooks. Stop if any generated report implies D04 is promotion-safe or that the derived overlay authorizes student-facing use.
7. Prepare the CP-5 review packet. Before starting the human interview, show the reviewer the full planned calibration questions: storage strategy, D04 resolution choice, successor-unit mapping, dependent-unit audit completeness, promotion-blocking rule, and gate status. Then ask one question at a time with clear options and an open-answer option.
8. Record every human answer in `human-interview.md` and `.json`; after each answer, summarize the answer and decide the next question or interview mode. Analyze answer patterns for contradictions, ask targeted follow-ups when needed, produce a closure proposal, and require explicit human confirmation before writing `gate-closure.md` and `gate-closure.json`.
9. Close CP-5 only with a valid gate status: `pass`, `pass_with_conditions`, `hold`, or `fail`. The gate closure must keep `protected_reference_data_changed: false`; any later D04 retirement, merge, split, or redistribution must happen in a separate CLI-only sprint with a mutation log.
10. Run the acceptance tests. Stop if any output implies protected-reference hand editing, D04 prerequisite-edge approval, exercise promotion, student diagnostics, adaptive use, mastery, sequencing, student-facing AI, summative scoring, PV projection, PV machine promotion, or machine-field migration.
11. Record the result and diff summary. Mark S9 complete only after the CP-5 gate is closed, gate bundle URLs are current, and the sprint bundle checker passes with `--complete`.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S9-plan.md
node build-scripts/sprints/check-sprint-bundle.js S9
node build-scripts/references/build-unit-design-status-overlay.js
node build-scripts/references/check-unit-design-status.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/rag/build-chunks.js
node build-scripts/rag/validate-chunks.js
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-CP5-D04-resolution/gate-closure.json
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-CP5-D04-resolution
node build-scripts/sprints/check-bundle-urls.js GATE-CP5-D04-resolution
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/check-sprint-result.js reports/sprints/S9-result.md
node build-scripts/sprints/check-sprint-bundle.js S9 --complete
```

## Rollback plan

Revert the S9 implementation commit. That removes the derived unit-design status overlay, schema, validator, generated reports, reference-health/RAG hooks, CP-5 packet and closure artifacts, regenerated inventories, roadmap bookkeeping, and sprint result files.

No protected reference rollback should be needed because S9 must not edit `references/machine/` or `references/external/`.

## Human review required

Yes. CP-5 is a human-review gate. S9 may prepare the D04 decision record, dependent-unit audit, unit-design status strategy, and review packet, but the gate is not closed until an interactive human interview records answers, pattern analysis, targeted follow-ups when needed, a closure proposal, and explicit human confirmation.

Human review is required before any D04 lifecycle mutation. S9 itself does not run deprecate, merge, split, or redistribution commands.
