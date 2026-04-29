# Sprint RX.2: First-Lane Mutation Review And CLI Execution

## Goal

Prepare and close the bounded RX.2 first-lane mutation-review gate for `A61`, `A66`, `A67`, `A70`, `A72`, and `A74`, then execute only the human-authorized CLI mutation lane.

## Context

`GATE-RX1-representation-unit-scope` closed as `pass_with_conditions`. It authorized RX.2 planning for the bounded first lane only and did not authorize direct unit mutation.

The RX.2 review packet was therefore prepared first. After human review, `GATE-RX2-first-lane-mutation-review` closed as `pass_with_conditions` and authorized CLI-only mutation for all six candidates after live numbering and dependency checks.

The first lane remains deliberately narrower than the full RX.1 inventory:

- chart-only candidates remain medium/high risk;
- line-graph candidates are second-wave;
- elasticity candidates move earlier than producer graphs but are not in this first lane;
- producer candidates remain split into later table/data and graph lanes;
- held duplicate/overlap records remain blocked.

## Allowed paths

- `docs/sprints/RX.2-plan.md`
- `references/data/sprints/RX.2.plan.json`
- `references/data/sprints/RX.2.result.json`
- `reports/sprints/RX.2-baseline.md`
- `reports/sprints/RX.2-result.md`
- `reports/sprints/RX.2-diff-summary.md`
- `build-scripts/references/build-rx2-first-lane-review.js`
- `build-scripts/references/check-rx2-first-lane-review.js`
- `build-scripts/references/close-and-apply-rx2-first-lane.js`
- `build-scripts/references/check-rx2-first-lane-mutations.js`
- `references/data/sprints/RX.2-first-lane-candidate-specs.json`
- `references/data/sprints/RX.2-generator-blocked-units.json`
- `reports/review-gates/GATE-RX2-first-lane-mutation-review/`
- `references/machine/micro-teaching-units.md` through `unit-add.js` only
- `references/machine/micro-teaching-units.json` through `unit-add.js` only
- generated reference/RAG/report outputs
- `references/reference-team-roadmap.md` for RX.2 bookkeeping and roadmap versioning
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.11-rx2-first-lane-review-prepared.md`
- `reports/url-index.md`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- mutation of `references/authored/course-target-exercises.json`
- execution of `unit-add.js` before `GATE-RX2-first-lane-mutation-review` closure
- execution of `unit-add.js` for anything outside `A61`, `A66`, `A67`, `A70`, `A72`, and `A74`
- execution of `unit-add-dep.js`
- creation of a governed `references/machine/` operation registry
- generated RAG chunk hand-patching
- student-facing skill-tree exposure for the six new units before generator implementation
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `reports/review-gates/GATE-RX2-first-lane-mutation-review/review-packet.json`
- `references/data/sprints/RX.2-first-lane-candidate-specs.json`
- `references/machine/micro-teaching-units.json`
- `engines/skilltree/generators.js`
- `references/reference-team-roadmap.md`

## Outputs

- RX.2 sprint plan, baseline, result, diff summary, and sprint metadata
- RX.2 first-lane candidate spec bundle
- CLI mutation plan
- `GATE-RX2-first-lane-mutation-review` review packet, human interview, and gate closure
- CLI-only mutation log
- six new A-domain units in `references/machine/micro-teaching-units.*`
- generator-blocked/non-interactive tracking for all six new units
- gate bundle URLs and updated global URL index
- refreshed source manifest and document inventory

## Operationalized sprint procedure

1. Record the RX.2 plan and baseline before building candidate specs. The baseline must confirm that RX.1 closed as `pass_with_conditions` and that mutation remains blocked until RX.2 gate closure.
2. Build the first-lane candidate spec bundle from the RX.1 inventory and RX.1 closure. Stop if the generated first lane differs from `A61`, `A66`, `A67`, `A70`, `A72`, and `A74`.
3. Re-check live A-domain numbering against `references/machine/micro-teaching-units.json`. Stop if any first-lane ID already exists.
4. Validate each candidate draft spec for required unit-add fields, concrete procedure, pitfalls, evidence references, generator follow-up status, and dependency sequence. Stop if any need cannot be resolved from live units or earlier first-lane candidates.
5. Prepare a draft CLI mutation plan using `unit-add.js` command templates, but keep execution disabled until human gate closure.
6. Prepare `GATE-RX2-first-lane-mutation-review/review-packet.md` and `.json` with all review questions listed at once. The packet asks whether the first lane, provisional IDs, A70 dependency adjustment, procedures, generator status, and CLI plan are acceptable.
7. Human review procedure: ask calibration questions from the packet, record every answer in `human-interview.md` and `.json`, perform pattern analysis across the answers, ask targeted follow-ups if any answer pattern conflicts, produce a closure proposal, require explicit human confirmation, and only then create `gate-closure.md` and `gate-closure.json`.
8. If the gate closes as `pass_with_conditions` and authorizes CLI mutation, run the live numbering check again immediately before mutation.
9. Execute only `unit-add.js`, in the required order: `A61` -> `A66` -> `A67` -> `A70` -> `A72` -> `A74`.
10. Strengthen A61's zero-needs rationale as economic source-value selection for a calculation, not generic table reading.
11. Record the A70 dependency decision in the gate closure and mutation log because arbitrary `review_flags` do not persist through unit-add formatting.
12. Track all six units as generator-blocked and non-interactive until `GEN_A61`, `GEN_A66`, `GEN_A67`, `GEN_A70`, `GEN_A72`, and `GEN_A74` are implemented and validated.
13. Regenerate reports, RAG chunks, gate bundle URLs, the global URL index, source manifest, and document inventory.
14. Run validation. Stop and report if any protected-source boundary, cycle, unresolved need, gate closure, chunk, retrieval eval, or sprint-bundle validation fails.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.2-plan.md
node build-scripts/sprints/check-sprint-bundle.js RX.2
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-RX2-first-lane-mutation-review/gate-closure.json
node build-scripts/references/check-rx2-first-lane-mutations.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/rag/build-chunks.js
node build-scripts/rag/validate-chunks.js
node build-scripts/rag/run-retrieval-evals.js
node build-scripts/rag/validate-retrieval-eval-results.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-bundle-urls.js GATE-RX2-first-lane-mutation-review
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the RX.2 applied-state commit to remove the gate closure, mutation log, generator-block tracking, helper scripts, roadmap/version-index update, generated reports, and the CLI-added `A61`, `A66`, `A67`, `A70`, `A72`, and `A74` machine-unit entries.

Do not attempt a manual partial rollback inside `references/machine/`. Use git revert for the committed sprint, or create a later CLI-backed corrective sprint if review finds a catalog issue.

## Human review required

Yes. RX.2 required `GATE-RX2-first-lane-mutation-review` to close before mutation. The gate closed as `pass_with_conditions`, authorized CLI-only execution for all six candidates, and preserved generator/product-use blocks.
