# Sprint EX-0: Exam Ingestion Contract Design

## Goal

Define the overlay-first contract for official CvTE economics exam-question ingestion.

EX-0 is a design and governance sprint. It creates the schema, procedure, validator, and future human-review packet needed before any EX-1 pilot records can ingest official exam questions, source annexes, official correction models, point rules, MTU decomposition, graph/source operations, or answer-writing operations.

EX-0 must not mutate `references/external/`, create real exam-ingestion overlay records, mint units, promote target exercises, close CP-6, close Year 1, or authorize student-facing/product use.

## Context

The current `references/external/exam-questions.json` shape mirrors prompt-level exam-question records, but it does not yet model official correction-model steps, point rules, source annexes, accepted alternatives, precision/unit requirements, graph requirements, or answer-writing operations as separately traceable objects.

The roadmap now names official exam-question ingestion as the reference-platform north star. EX-0 operationalizes that direction by defining a protected-source-safe data contract and review protocol before EX-1 creates pilot overlays.

## Allowed paths

- `reports/sprints/EX-0-plan.md`
- `references/data/sprints/EX-0.plan.json`
- `reports/sprints/EX-0-baseline.md`
- `reports/sprints/EX-0-planning-review.md`
- `references/schemas/exam-ingestion.schema.json`
- `references/data/exam-ingestion/README.md`
- `references/data/exam-ingestion/review-procedure.md`
- `build-scripts/references/check-exam-ingestion-contract.js`
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.md`
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.json`
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/bundle-urls.md`
- `references/data/sprints/EX-0.result.json`
- `reports/sprints/EX-0-result.md`
- `reports/sprints/EX-0-diff-summary.md`
- `reports/sprints/EX-0-lead-review-assignment.md`
- `reports/sprints/EX-0-lead-review-round1.md`
- `reports/sprints/EX-0-lead-review-corrections.md`
- `reports/sprints/EX-0-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, source-document registry, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.60-cp6f-113-part-a-cleared.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `build-scripts/sprints/check-sprint-bundle.js` for narrow support of `EX-0` style sprint IDs

## Forbidden paths

- hand edits to `../4veco-lessen/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/external/`
- hand edits to `references/machine/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- real `exam-item-overlays.json`, `exam-answer-model-overlays.json`, or `exam-source-annex-overlays.json` pilot data
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

- `references/reference-team-roadmap.md`
- `references/data/exercises/README.md`
- `references/schemas/exercise-metadata-overlay.schema.json`
- `references/schemas/exam-question.schema.json`
- `references/external/exam-questions.json`
- `references/SOURCE_OF_TRUTH.md`
- `AGENTS.md`
- `reports/exam-question-extraction-gaps.md`
- `references/data/exercises/source-annex-gap-log.json`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/schema-dry-run.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- `references/schemas/exam-ingestion.schema.json`, defining the EX-0 overlay package and per-item contract.
- `references/data/exam-ingestion/README.md`, defining overlay-first storage, file-family expectations, authority boundaries, and field semantics.
- `references/data/exam-ingestion/review-procedure.md`, defining the human-review procedure for EX-1 pilot overlays.
- `reports/review-gates/GATE-EX0-exam-ingestion-contract/review-packet.*`, preparing the future human gate to approve or revise the EX-0 contract before EX-1 scale.
- `build-scripts/references/check-exam-ingestion-contract.js`, a read-only validator for schema/procedure/review-packet completeness and blocked-use boundaries.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if `EX-0` is not the active roadmap row or if the current repo state is dirty before EX-0 edits.
2. Read current exercise-overlay and exam-question schema surfaces. Confirm EX-0 extends those contracts rather than mutating protected external exam records.
3. Define `exam-ingestion.schema.json` with separate traceability for prompt metadata, source annexes, graph/table/figure objects, official answer model, point rules, accepted alternatives, precision/unit requirements, skill decomposition, MTU gap classification, and product-boundary constraints.
4. Write the data README and review procedure. These must state that pilot overlay data waits for EX-1 and that EX-0 authorizes no protected mutation, unit minting, target-exercise promotion, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, summative use, PV projection, or student-facing AI.
5. Prepare `GATE-EX0-exam-ingestion-contract` review packet with full question list and future one-question-at-a-time interview protocol. The packet must ask humans to approve the schema, authority split, answer-model decomposition, source-annex gap semantics, MTU gap taxonomy, and blocked-use boundaries before EX-1.
6. Add and run the read-only contract validator. Stop if the schema/procedure/review packet collapse prompt, source annex, and answer-model evidence into a single untraceable blob or authorize mutation/product use.
7. Run acceptance tests, refresh normal reports and indexes, and record result/diff artifacts.
8. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/EX-0-lead-review-round1.md`.
9. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/EX-0-lead-review-corrections.md`.
10. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/EX-0-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
11. If EX-0 passes, close EX-0 in the roadmap and make EX-1 the active next pilot sprint. If EX-0 fails, keep EX-0 active and report the contract blockers.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-0-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-0
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX0-exam-ingestion-contract
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-0-result.md
node build-scripts/sprints/check-sprint-bundle.js EX-0 --complete
npm.cmd test
```

## Rollback plan

Revert the EX-0 implementation commit. Because EX-0 is design-only, rollback removes only sprint artifacts, schema/procedure design files, review-packet artifacts, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No live human interview is required inside EX-0. EX-0 prepares the future `GATE-EX0-exam-ingestion-contract` packet and interview protocol.

Human review is required before EX-1 treats any pilot overlay as accepted contract evidence, and remains required before protected reference mutation, unit minting, target-exercise promotion, placeholder finalization, CP-6 closure, Year-1 closure, or any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.
