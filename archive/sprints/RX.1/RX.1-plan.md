# Sprint RX.1: Representation-Operation Inventory

## Goal

Prepare a non-mutating inventory of representation-sensitive calculation operations before any A61+ micro-teaching-unit mutation. The sprint must distinguish base operations, representation-reading tasks, and composed applications, then hold duplicate or overlap-prone areas for human review.

## Context

The live roadmap adopted Phase RX because a calculation skill is not complete until students can execute it across the representations used by exam questions and lesson materials. S4/CP-3 closed as `pass_with_conditions`; exercise metadata remains overlay-first, `exercise_operations` are provisional, and bulk metadata backfill remains blocked.

RX.1 is the safe first step: it creates an evidence-grounded candidate inventory and duplicate audit only. It does not add units, edit source references, or create a governed operation registry.

## Allowed paths

- `docs/sprints/RX.1-plan.md`
- `references/data/sprints/RX.1.plan.json`
- `references/data/sprints/RX.1.result.json`
- `reports/sprints/RX.1-baseline.md`
- `reports/sprints/RX.1-result.md`
- `reports/sprints/RX.1-diff-summary.md`
- `build-scripts/references/build-representation-operation-inventory.js`
- `build-scripts/references/check-representation-operation-inventory.js`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `reports/json/representation-operation-inventory.json`
- `reports/markdown/representation-operation-inventory.md`
- `reports/review-gates/GATE-RX1-representation-unit-scope/`
- `references/reference-team-roadmap.md` for RX.1 bookkeeping and roadmap versioning
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.8-s4.1-conditions-calibrated.md`
- `reports/url-index.md`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- source mutation of `references/authored/course-target-exercises.json`
- creation of `references/machine/exercise-operations.json` or other new machine registries
- CLI unit mutation through `unit-add.js` or `unit-add-dep.js`
- bulk exercise metadata extension
- generated RAG chunk hand-patching
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/machine/micro-teaching-units.json`
- `references/authored/course-target-exercises.json`
- `references/external/exam-questions.json`
- `references/data/owned-content-graph.json`
- `references/data/exercises/graph-spec-representation-plan.json`
- `reports/review-gates/GATE-CP3-schema-extension-dry-run/gate-closure.json`
- `references/reference-team-roadmap.md`

## Outputs

- RX.1 sprint plan, baseline, result, diff summary, and sprint metadata
- deterministic inventory at `references/data/sprints/RX.1-representation-operation-inventory.json`
- JSON and Markdown inventory projections
- duplicate/overlap report
- proposed mutation queue with `mutation_authorized: false`
- `GATE-RX1-representation-unit-scope` review packet
- gate bundle URLs and updated global URL index
- refreshed source manifest and document inventory

## Operationalized sprint procedure

1. Record the RX.1 plan and baseline before treating the inventory as sprint output. The baseline must confirm the current A-domain maximum ID and protected reference data status.
2. Build the representation-operation inventory from current target exercises, exam-question records, owned-source projection metadata, graph-spec plans, and live A-domain units. Stop if a proposed candidate relies on syllabus text alone.
3. Classify each operation as already covered, a new representation-reading candidate, a new composed-calculation candidate, a duplicate/merge candidate, or a human-review hold. Candidate IDs must remain provisional and unavailable for mutation until RX.2+ rechecks live numbering.
4. Produce a duplicate/overlap report and proposed mutation queue. Stop immediately if any hold record appears in the mutation queue, if any candidate ID already exists, or if any output sets `mutation_authorized: true`.
5. Prepare `GATE-RX1-representation-unit-scope/review-packet.md` and `.json` with all human review questions listed at once. The packet asks whether the inventory is complete, whether the A61-A84 candidates are acceptable as provisional, which candidates should proceed, and which holds should remain blocked.
6. Human review procedure for later RX1 gate closure: ask calibration questions, record every answer in `human-interview.md` and `.json`, analyze answer patterns, ask targeted follow-ups only if the answers are inconsistent or imply a scope change, produce a closure proposal, require explicit human confirmation, and only then create `gate-closure.md` and `gate-closure.json`.
7. Run the inventory checker, sprint bundle checks, gate bundle URL emission, URL index emission, and reference inventory refresh. Stop before RX.2 mutation planning until `GATE-RX1-representation-unit-scope` is closed by a human decision.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.1-plan.md
node build-scripts/sprints/check-sprint-bundle.js RX.1
node build-scripts/references/build-representation-operation-inventory.js
node build-scripts/references/check-representation-operation-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
```

## Rollback plan

Revert the RX.1 commit to remove the inventory builder/checker, generated inventory artifacts, review packet, sprint records, and roadmap/version-index bookkeeping. No protected reference data rollback is needed because RX.1 must not edit `references/machine/` or `references/external/`.

## Human review required

Yes. RX.1 prepares `GATE-RX1-representation-unit-scope` for human review. RX.2 and later unit mutations remain blocked until that gate closes and explicitly authorizes a bounded mutation lane.
