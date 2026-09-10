# Sprint RX.2b: Graphical Foundation Coverage And Mutation

## Goal

Prepare the graphical-foundation coverage report and mutation-review packet for the basic graphical representation-reading lane before producer/profit graph work proceeds.

RX.2b starts as a non-mutating review sprint. It may only mutate units after `GATE-RX2b-graphical-foundation` records explicit human authorization, and even then mutation must be CLI-only through `build-scripts/references/unit-add.js`.

## Context

RX.1 created the representation-operation inventory and closed as `pass_with_conditions`. RX.2 then added only the safe table/index first lane: `A61`, `A66`, `A67`, `A70`, `A72`, and `A74`. That was correct governance, but it left the basic graphical foundation incomplete.

HCS approved inserting RX.2b before RX.3 so bar-chart, line-graph, pie-chart, visual percentage-change, and visual index foundations are reviewed before producer/profit graph units.

The review queue is:

- `A62` Waarden aflezen uit staafdiagram
- `A63` Waarden aflezen uit lijngrafiek
- `A64` Aandelen aflezen uit cirkeldiagram
- `A65` Absolute hoeveelheid berekenen uit aandeel en totaal
- `A68` Procentuele verandering berekenen vanuit staafdiagram
- `A69` Procentuele verandering berekenen vanuit lijngrafiek
- `A73` Indexverandering aflezen uit lijngrafiek

Conditional target:

- `A71` Procentuele verandering berekenen vanuit cirkeldiagram

## Allowed paths

- `docs/sprints/RX.2b-plan.md`
- `references/data/sprints/RX.2b.plan.json`
- `reports/sprints/RX.2b-baseline.md`
- `build-scripts/references/build-rx2b-graphical-foundation-review.js`
- `build-scripts/references/check-rx2b-graphical-foundation-review.js`
- `reports/json/graphical-foundation-coverage.json`
- `reports/markdown/graphical-foundation-coverage.md`
- `references/data/sprints/RX.2b-candidate-specs.json`
- `reports/review-gates/GATE-RX2b-graphical-foundation/`
- `references/data/sprints/RX.2b-generator-blocked-units.json` only if the gate later authorizes mutation
- `references/data/sprints/RX.2b.result.json` only after sprint closure
- `reports/sprints/RX.2b-result.md` only after sprint closure
- `reports/sprints/RX.2b-diff-summary.md` only after sprint closure
- `references/machine/micro-teaching-units.md` through `unit-add.js` only after gate closure
- `references/machine/micro-teaching-units.json` through `unit-add.js` only after gate closure
- generated reference/RAG/report outputs only after authorized mutation, if regeneration is needed

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- mutation of `references/authored/course-target-exercises.json`
- execution of `unit-add.js` before `GATE-RX2b-graphical-foundation` closure
- execution of `unit-add.js` for anything outside the human-approved RX.2b subset
- creation of a governed `references/machine/` operation registry
- generated RAG chunk hand-patching
- generator implementation or student-facing skill-tree exposure inside this sprint unless separately authorized
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/reference-team-roadmap.md`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `reports/review-gates/GATE-RX1-representation-unit-scope/gate-closure.json`
- `reports/review-gates/GATE-RX2-first-lane-mutation-review/gate-closure.json`
- `references/data/sprints/RX.2-generator-blocked-units.json`
- `references/machine/micro-teaching-units.json`
- `engines/skilltree/generators.js`

## Outputs

- RX.2b sprint plan and baseline
- graphical foundation coverage report in JSON and Markdown
- RX.2b candidate spec bundle
- draft CLI mutation plan with execution disabled
- `GATE-RX2b-graphical-foundation` review packet with all review questions listed

If the gate later authorizes mutation, RX.2b also produces human interview files, gate closure files, a mutation log, generator-blocked tracking, sprint result, and diff summary.

## Operationalized sprint procedure

1. Record the RX.2b plan and baseline before building the review packet. The baseline must state that no mutation is authorized yet.
2. Build the graphical-foundation coverage report from the RX.1 inventory, live unit catalog, RX.2 generator-blocked file, and generator layer.
3. Ensure the coverage report distinguishes live units, candidate units, held/high-risk units, missing but not-yet-scoped items, and generator-blocked live units.
4. Prepare candidate specs for `A62`, `A63`, `A64`, `A65`, `A68`, `A69`, `A73`, and conditional `A71`.
5. Validate that `A62`, `A63`, and `A64` explicitly encode title/context, labels, units, scale, reading, and exact/estimate/interpolation decisions.
6. Prepare a draft CLI mutation plan using `unit-add.js` command templates, but keep execution disabled until human gate closure.
7. Prepare `GATE-RX2b-graphical-foundation/review-packet.md` and `.json` with all calibration questions listed at once.
8. Human review procedure: record every answer in `human-interview.md` and `.json`, perform pattern analysis across the answers, ask targeted follow-ups if any answer pattern conflicts, produce a closure proposal, require explicit human confirmation, and only then create `gate-closure.md` and `gate-closure.json`.
9. If the gate closes as `pass_with_conditions` and authorizes CLI mutation, run the live numbering check again immediately before mutation.
10. Execute only the human-approved subset through `unit-add.js`, in the approved order. `A71` may be held while the lower-risk queue proceeds.
11. Track every newly added A-unit as generator-blocked and non-interactive until RX.6 implements and validates generators.
12. Run validators. Stop and report if any protected-source boundary, unresolved need, cycle, gate closure, sprint-bundle, or report validation fails.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.2b-plan.md
node build-scripts/references/build-rx2b-graphical-foundation-review.js
node build-scripts/references/check-rx2b-graphical-foundation-review.js
node build-scripts/sprints/check-sprint-bundle.js RX.2b
```

If the gate later authorizes mutation, also run:

```bash
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-RX2b-graphical-foundation/gate-closure.json
node build-scripts/references/check-rx2b-graphical-foundation-mutations.js
node build-scripts/references/build-unit-index.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/rag/build-chunks.js
node build-scripts/rag/validate-chunks.js
node build-scripts/rag/validate-query-output.js
node build-scripts/rag/run-retrieval-evals.js
node build-scripts/rag/validate-retrieval-eval-results.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-bundle-urls.js GATE-RX2b-graphical-foundation
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/sprints/check-sprint-result.js reports/sprints/RX.2b-result.md
node build-scripts/sprints/check-sprint-bundle.js RX.2b --complete
```

## Rollback plan

For the pre-gate packet, delete or revert the RX.2b plan, baseline, helper scripts, coverage report, candidate specs, draft CLI plan, and review packet.

If a later gate-authorized mutation is applied, do not attempt manual partial rollback inside `references/machine/`. Use git revert for the committed sprint, or create a later CLI-backed corrective sprint.

## Human review required

Yes. `GATE-RX2b-graphical-foundation` must close before any unit mutation. The review packet must ask all RX.2b questions, including whether `A71` is safe to mutate or should remain held.
