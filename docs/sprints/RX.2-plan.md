# Sprint RX.2: First-Lane Mutation Review Packet

## Goal

Prepare the bounded RX.2 first-lane mutation-review packet for `A61`, `A66`, `A67`, `A70`, `A72`, and `A74` without executing any unit mutation.

## Context

`GATE-RX1-representation-unit-scope` closed as `pass_with_conditions`. It authorized RX.2 planning for the bounded first lane only and did not authorize direct unit mutation. RX.2 must therefore prepare candidate specs, re-check live numbering, and produce an explicit mutation-review gate before any `unit-add.js` execution.

The first lane is deliberately narrower than the full RX.1 inventory:

- chart-only candidates remain medium/high risk;
- line-graph candidates are second-wave;
- elasticity candidates move earlier than producer graphs but are not in this first lane;
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
- `references/data/sprints/RX.2-first-lane-candidate-specs.json`
- `reports/review-gates/GATE-RX2-first-lane-mutation-review/`
- `references/reference-team-roadmap.md` for RX.2 bookkeeping and roadmap versioning
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.10-rx1-gate-closed.md`
- `reports/url-index.md`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- mutation of `references/authored/course-target-exercises.json`
- execution of `build-scripts/references/unit-add.js`
- execution of `build-scripts/references/unit-add-dep.js`
- creation of a governed `references/machine/` operation registry
- generated RAG chunk hand-patching
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `references/machine/micro-teaching-units.json`
- `engines/skilltree/generators.js`
- `references/reference-team-roadmap.md`

## Outputs

- RX.2 sprint plan, baseline, result, diff summary, and sprint metadata
- RX.2 first-lane candidate spec bundle
- draft CLI mutation plan with execution disabled
- `GATE-RX2-first-lane-mutation-review` review packet
- gate bundle URLs and updated global URL index
- refreshed source manifest and document inventory

## Operationalized sprint procedure

1. Record the RX.2 plan and baseline before building candidate specs. The baseline must confirm that RX.1 closed as `pass_with_conditions` and that mutation remains blocked.
2. Build the first-lane candidate spec bundle from the RX.1 inventory and RX.1 closure. Stop if the generated first lane differs from `A61`, `A66`, `A67`, `A70`, `A72`, and `A74`.
3. Re-check live A-domain numbering against `references/machine/micro-teaching-units.json`. Stop if any first-lane ID already exists.
4. Validate each candidate draft spec for required unit-add fields, concrete procedure, pitfalls, evidence references, generator follow-up status, and dependency sequence. Stop if any need cannot be resolved from live units or earlier first-lane candidates.
5. Prepare a draft CLI mutation plan using `unit-add.js` command templates, but keep `execution_authorized: false` and `mutation_authorized: false`.
6. Prepare `GATE-RX2-first-lane-mutation-review/review-packet.md` and `.json` with all review questions listed at once. The packet asks whether the first lane, provisional IDs, A70 dependency adjustment, procedures, generator status, and CLI plan are acceptable.
7. Human review procedure for later RX.2 gate closure: ask calibration questions, record every answer in `human-interview.md` and `.json`, analyze answer patterns, ask targeted follow-ups only if answer patterns conflict, produce a closure proposal, require explicit human confirmation, and only then create `gate-closure.md` and `gate-closure.json`.
8. Regenerate gate bundle URLs, the global URL index, source manifest, and document inventory. Stop before mutation until `GATE-RX2-first-lane-mutation-review` explicitly authorizes CLI execution.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.2-plan.md
node build-scripts/sprints/check-sprint-bundle.js RX.2
node build-scripts/references/build-rx2-first-lane-review.js
node build-scripts/references/check-rx2-first-lane-review.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
```

## Rollback plan

Revert the RX.2 packet commit to remove the candidate specs, review packet, sprint records, and roadmap/version-index bookkeeping. No protected reference data rollback is needed because RX.2 packet preparation must not edit `references/machine/` or `references/external/`.

## Human review required

Yes. RX.2 prepares `GATE-RX2-first-lane-mutation-review` for human review. No unit mutation, source mutation, or generator implementation is authorized until that gate closes with explicit CLI execution approval.
