# Sprint RX.3a: Producer Table/Data First-Lane Mutation Review

## Goal

Close the bounded producer table/data mutation-review gate for `A75`, `A76`, and `A79`, then execute the authorized CLI-only mutation if human gate closure explicitly permits it.

## Context

`GATE-RX3-producer-representation` closed as `pass_with_conditions`. HCS authorized first-lane mutation review for `A75`, `A76`, and `A79`, required `A76` to include `A14`, `A04`, and `A61` as needs, allowed `A77`/`A78` only later after `A75`, and held `A80`, `A81`, and graphical `MO=MK`.

RX.3a prepares candidate specs, a CLI mutation plan, and generator-block tracking for the first lane. Before human review it must not mutate the unit catalog. After `GATE-RX3a-first-lane-mutation-review` closes with explicit CLI authorization, RX.3a may apply only the approved `A75`, `A76`, and `A79` mutations through `unit-add.js`.

## Allowed paths

- `docs/sprints/RX.3a-plan.md`
- `references/data/sprints/RX.3a.plan.json`
- `reports/sprints/RX.3a-baseline.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/review-packet.json`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/review-packet.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/candidate-specs.json`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/candidate-specs.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/cli-mutation-plan.json`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/cli-mutation-plan.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/RX.3a-generator-blocked-units.json`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/RX.3a-generator-blocked-units.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/bundle-urls.md`
- `build-scripts/references/check-rx3a-first-lane-mutation-review.js`
- `build-scripts/references/close-and-apply-rx3a-first-lane.js`
- `build-scripts/references/check-rx3a-first-lane-mutations.js`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/human-interview.json`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/human-interview.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/gate-closure.json`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/gate-closure.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/RX.3a-mutation-log.json`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/RX.3a-mutation-log.md`
- `references/machine/micro-teaching-units.json` via `unit-add.js` only after gate authorization
- `references/machine/micro-teaching-units.md` via `unit-add.js` only after gate authorization
- `reports/sprints/RX.3a-result.md`
- `reports/sprints/RX.3a-diff-summary.md`
- `references/data/sprints/RX.3a.result.json`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.24-rx3-gate-closed.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- execution of `unit-add.js` before `GATE-RX3a-first-lane-mutation-review` explicitly authorizes CLI mutation
- execution of `unit-add-dep.js`
- mutation of `references/authored/course-target-exercises.json`
- mutation of `references/external/exam-questions.json`
- lesson repo commits or generated lesson target edits
- RAG chunk hand-patching
- mutation review for `A77`, `A78`, `A80`, `A81`, or `HOLD_GRAPHICAL_MO_MK_OPTIMUM`
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing use of `A75`, `A76`, or `A79` before generators/projection support exist

## Inputs

- `reports/review-gates/GATE-RX3-producer-representation/` RX.3 closure artifacts
- `reports/review-gates/GATE-RX3-producer-representation/proposed-mutation-queue.json`
- `references/machine/micro-teaching-units.json`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `reports/review-gates/GATE-PV-G1-schema/technical-closure.json`

## Outputs

- Candidate specs for `A75`, `A76`, and `A79`.
- Draft CLI mutation plan with `execution_authorized: false`.
- Generator-blocked/non-interactive tracking for the three candidates.
- Human-review packet for `GATE-RX3a-first-lane-mutation-review`.

## Operationalized sprint procedure

1. Record this plan and baseline before preparing first-lane mutation-review artifacts.
2. Verify `GATE-RX3-producer-representation` is closed as `pass_with_conditions`.
3. Verify `A75`, `A76`, and `A79` are still absent and required dependencies are live or earlier in the same lane.
4. Prepare draft unit specs with `A76` needs set to `A14`, `A04`, and `A61`.
5. Prepare a CLI mutation plan in the order `A75`, `A76`, `A79`, with execution blocked until human gate closure.
6. Record generator-blocked status for `GEN_A75`, `GEN_A76`, and `GEN_A79`.
7. Validate the packet with a read-only checker and emit gate bundle URLs.
8. Stop for human review before any CLI mutation, dependency edit, machine-reference mutation, or student-facing exposure.
9. During human review, use the review packet's calibration questions `RX3A-Q1` through `RX3A-Q8`, record each answer, analyze the answer pattern for contradictions, list targeted follow-ups, prepare a closure proposal, and require explicit human confirmation before closing the gate.
10. If the human gate closes with explicit CLI authorization, record `human-interview.*` and `gate-closure.*`.
11. Re-run the live numbering and dependency checks immediately before mutation.
12. Execute `unit-add.js` only for `A75`, `A76`, and `A79`, in that order.
13. Record the CLI mutation log and update generator-block tracking.
14. Regenerate and validate reference reports/RAG surfaces.
15. Mark RX.3a completed only after result, diff summary, roadmap, URL bundle, and sprint-bundle checks pass.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.3a-plan.md
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-RX3a-first-lane-mutation-review/gate-closure.json
node build-scripts/references/check-rx3a-first-lane-mutations.js
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
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX3a-first-lane-mutation-review
node build-scripts/sprints/check-bundle-urls.js GATE-RX3a-first-lane-mutation-review
node build-scripts/sprints/check-sprint-result.js reports/sprints/RX.3a-result.md
node build-scripts/sprints/check-sprint-bundle.js RX.3a --complete
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the RX.3a applied-state commit. That removes the gate closure, mutation log, generator-block tracking updates, helper scripts, roadmap/version-index update, generated reports/RAG surfaces, and the CLI-added `A75`, `A76`, and `A79` machine-unit entries.

Do not manually patch `references/machine/` for rollback.

## Human review required

Yes. RX.3a stops at `GATE-RX3a-first-lane-mutation-review` until HCS explicitly authorizes, narrows, or holds CLI mutation.
