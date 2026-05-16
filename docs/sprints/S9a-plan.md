# Sprint S9a: D04 CLI-Only Mutation Sprint

## Goal

Apply the CP-5 decision for `D04 Elasticiteit en goederenclassificatie` through governed CLI-only mutation, so the standalone D04 unit is retired with explicit successor pointers and no longer acts as an unstable promotion dependency.

S9a is the compact ID used by the sprint bundle tooling. It follows S9, where `GATE-CP5-D04-resolution` closed as `pass_with_conditions`: the decision direction is settled, but the protected machine mutation was intentionally deferred to this sprint.

## Context

S9 closed CP-5 as `pass_with_conditions`. The human-confirmed decision is to keep `unit_design_status` as a derived `references/data` overlay, redistribute D04 content into successor elasticity units, retire the standalone D04 unit later through CLI, and preserve all blocked downstream uses until mutation and validation finish.

D04 must still be treated as a unit-design issue, not a prerequisite-edge issue. The mutation must not add `D04 -> A15`, must not hand-edit protected references, and must not promote any exercise or product surface. The current lifecycle CLI surface supports deprecation with replacement pointers, merge, and split. The S9 audit shows that the relevant classification content already exists in the successor units:

- `A15` and `D06` for price-elasticity interpretation.
- `A17` and `D11` for income-elasticity normal, inferior, and luxury classification.
- `A16`, `D12`, and `D27` for cross-elasticity substitutes and complements.

Therefore S9a starts with `unit-deprecate.js --id D04 --replaced-by A15,D06,A17,D11,A16,D12,D27` as the expected protected mutation path. Stop if the pre-mutation audit finds that content must be split or merged instead.

## Allowed paths

- `docs/sprints/S9a-plan.md`
- `references/data/sprints/S9a.plan.json`
- `references/data/sprints/S9a.result.json`
- `reports/sprints/S9a-baseline.md`
- `reports/sprints/S9a-result.md`
- `reports/sprints/S9a-diff-summary.md`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-plan.json`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-plan.md`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.json`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.md`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-stale-reference-audit.json`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-stale-reference-audit.md`
- `references/machine/micro-teaching-units.json` via `build-scripts/references/unit-deprecate.js` only
- `references/machine/micro-teaching-units.md` via `build-scripts/references/unit-deprecate.js` only
- `references/authored/course-target-exercises.json` only for the single reviewed D04 citation in target exercise `2.1.3`
- `references/schemas/unit-design-status.schema.json`
- `references/data/unit-design-status/unit-design-status-overlay.json`
- `build-scripts/references/build-unit-design-status-overlay.js`
- `build-scripts/references/check-unit-design-status.js`
- `build-scripts/references/check-s9a-d04-cli-mutation.js`
- `references/data/qc/reference-quality-issues.json` only to resolve or update `R8-QC-007`
- `build-scripts/reports/generate-all.js`
- `build-scripts/reports/validate-report-json.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `build-scripts/rag/build-chunks.js`
- `build-scripts/rag/validate-chunks.js`
- generated reports under `reports/json/` and `reports/markdown/`
- generated RAG chunks and retrieval-eval artifacts when produced by the normal report/RAG workflow
- generated source manifest, document inventory, URL index, and roadmap/version-index files
- `references/reference-team-roadmap.md` for sprint bookkeeping and roadmap versioning

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- mutation of `references/external/exam-questions.json`
- running `unit-merge.js` or `unit-split.js` unless the S9a pre-mutation plan records why `unit-deprecate.js` is insufficient and stops for human review
- adding a `D04 -> A15` prerequisite edge
- using `unit-add-dep.js` or `unit-remove-dep.js`
- broad mutation of `references/authored/course-target-exercises.json`
- mutation of lesson-repo generated output
- changing or generating student exercises
- treating deprecated D04 references in historical gate artifacts as curriculum authority
- exercise promotion relying on D04
- student-facing diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative decisions
- PV machine promotion or PV student-facing projection
- machine-unit `unit_design_status` field migration
- RAG chunk hand-patching

## Inputs

- `references/reference-team-roadmap.md`
- `docs/sprints/S9-plan.md`
- `reports/sprints/S9-result.md`
- `reports/sprints/S9-diff-summary.md`
- `reports/review-gates/GATE-CP5-D04-resolution/` existing CP-5 closure and interview artifacts
- `reports/review-gates/GATE-CP5-D04-resolution/d04-decision-record.json`
- `reports/review-gates/GATE-CP5-D04-resolution/dependent-unit-audit.json`
- `reports/json/unit-design-status.json`
- `references/data/unit-design-status/unit-design-status-overlay.json`
- `reports/json/reference-cli-coverage.json`
- `references/machine/micro-teaching-units.json`
- `references/machine/micro-teaching-units.md`
- `references/machine/begrippen.json`
- `references/authored/course-target-exercises.json`
- `references/external/exam-questions.json` as read-only input
- `reports/json/owned-content-graph.json`
- `reports/json/blueprint-flag-triage.json`
- `references/data/qc/reference-quality-issues.json`

## Outputs

- S9a sprint plan, baseline, result, diff summary, and sprint metadata.
- Concrete D04 mutation plan in Markdown and JSON.
- CLI-only D04 mutation log in Markdown and JSON, including command, replacement IDs, stdout/stderr, exit code, pre-checks, and rollback command.
- D04 stale-reference audit in Markdown and JSON that distinguishes active source citations, protected external citations, generated-report citations, historical gate citations, and allowed provenance citations.
- `D04` marked deprecated in `references/machine/micro-teaching-units.md` and `.json` through `unit-deprecate.js`, with `deprecated_in_favor_of` set to `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27`.
- Target exercise `2.1.3` updated only if the stale-reference audit verifies that its existing successor-unit list already preserves the D04 content without adding a new concept.
- Unit-design-status overlay/schema/generator/checker updated so post-S9a reports show D04 as retired by CLI mutation, not unresolved.
- Optional `R8-QC-007` status update if the mutation log and CP-5 closure satisfy its proof-to-close requirement.
- JSON/Markdown reports, reference-health, RAG chunks, source manifest, document inventory, URL index, and roadmap/version-index regenerated through the normal workflow.

## Operationalized sprint procedure

1. Record this plan and baseline before running any lifecycle CLI. Stop if `node build-scripts/sprints/check-sprint-bundle.js S9a` cannot see the S9a roadmap row.
2. Verify the existing `GATE-CP5-D04-resolution` closure is `pass_with_conditions`, human-confirmed, and records `protected_reference_data_changed: false`. Stop if the gate is missing, not human-confirmed, or authorizes a different D04 direction.
3. Inspect D04 and the successor units `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27`. Stop if the successor units do not preserve the goods-classification content needed to retire D04.
4. Write the S9a mutation plan. The expected protected command is `node build-scripts/references/unit-deprecate.js --id D04 --replaced-by A15,D06,A17,D11,A16,D12,D27`. The plan must explicitly reject merge, split, and prerequisite-edge mutation unless the evidence changes.
5. Pre-audit D04 citations. Classify each D04 occurrence as active source, protected external source, generated report, historical review/gate artifact, sprint artifact, roadmap bookkeeping, RAG artifact, or stale mutation target. Stop if an active source citation cannot be safely replaced or intentionally preserved.
6. Execute the protected mutation only through `unit-deprecate.js`. Do not hand-edit `references/machine/micro-teaching-units.md` or `.json`.
7. Record the CLI mutation log immediately after execution, including the exact command, replacement IDs, exit code, stdout/stderr, files written by the CLI, and rollback command `node build-scripts/references/unit-deprecate.js --id D04 --undo`.
8. Remove D04 from target exercise `2.1.3` only if the audit proves that `A16`, `A17`, `D11`, `D12`, and `D27` already cover the active requirement. Do not mutate external exam-question data.
9. Update unit-design-status overlay/report tooling so D04 becomes a resolved retired unit-design case after the S9a mutation log exists. Keep the overlay internal-only and non-authoritative; do not create a machine `unit_design_status` field.
10. Add a read-only S9a validator that checks the CP-5 closure, D04 deprecation/replacement pointers, target-exercise cleanup, successor-unit existence, no D04 prerequisite edge, mutation log presence, stale-reference audit shape, and blocked downstream uses.
11. Regenerate reports, reference-health, RAG chunks, source manifest, document inventory, URL index, and roadmap/version-index through normal build scripts. Do not hand-patch generated reports or chunks.
12. Run the acceptance tests. Stop if any output implies hand-edited protected references, D04 prerequisite-edge approval, student diagnostics, adaptive use, mastery routing, sequencing, student-facing AI, summative scoring, PV projection, PV machine promotion, or student-facing exposure.
13. Record the result and diff summary. Mark S9a complete only after the sprint bundle checker passes with `--complete`.

## Acceptance tests

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

## Rollback plan

Use the CLI rollback first:

```bash
node build-scripts/references/unit-deprecate.js --id D04 --undo
```

Then revert the S9a implementation commit. That removes the mutation plan/log/audit, unit-design-status tooling changes, target-exercise cleanup, generated reports/RAG/inventories, roadmap bookkeeping, sprint result files, and any S9a-only validator.

Do not manually patch `references/machine/` for rollback.

## Human review required

No new human gate is required if S9a follows the CP-5 closure exactly: deprecate D04 with the approved successor mapping, clean the single active authored target-exercise citation if redundant, and preserve all blocked downstream uses.

Human review becomes required if implementation proposes a merge, split, new unit, prerequisite edge, successor mapping change, external-source mutation, machine `unit_design_status` field migration, student-facing use, or any product-use authorization beyond the CP-5 closure.
