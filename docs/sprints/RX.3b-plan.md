# Sprint RX.3b: Producer TO-TK Graph-Lane Mutation Review

## Goal

Prepare the bounded producer TO-TK graph-lane mutation-review packet for `A77` and `A78` without executing `unit-add.js`.

## Context

`GATE-RX3-producer-representation` closed as `pass_with_conditions` and allowed `A77`/`A78` to proceed after `A75` exists, with PV graph-stage constraints. `RX.3a` then added `A75`, `A76`, and `A79` through CLI-only mutation. `A80`, `A81`, and graphical `MO=MK` remain held until PV producer-graph pilot templates or a later explicit gate.

RX.3b prepares candidate specs, a CLI mutation plan, and generator-block tracking for the TO-TK graph lane. It does not mutate the unit catalog.

## Allowed paths

- `docs/sprints/RX.3b-plan.md`
- `references/data/sprints/RX.3b.plan.json`
- `reports/sprints/RX.3b-baseline.md`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/review-packet.json`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/review-packet.md`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/candidate-specs.json`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/candidate-specs.md`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/cli-mutation-plan.json`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/cli-mutation-plan.md`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/RX.3b-generator-blocked-units.json`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/RX.3b-generator-blocked-units.md`
- `reports/review-gates/GATE-RX3b-producer-graph-lane-review/bundle-urls.md`
- `build-scripts/references/check-rx3b-producer-graph-lane-review.js`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.26-rx3a-first-lane-applied.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- execution of `unit-add.js`
- execution of `unit-add-dep.js`
- mutation of `references/authored/course-target-exercises.json`
- mutation of `references/external/exam-questions.json`
- lesson repo commits or generated lesson target edits
- RAG chunk hand-patching
- mutation review for `A80`, `A81`, or `HOLD_GRAPHICAL_MO_MK_OPTIMUM`
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing skill-tree or PV projection use of `A77` or `A78` before generators/projection support exist

## Inputs

- `reports/review-gates/GATE-RX3-producer-representation/` RX.3 closure artifacts
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/` RX.3a closure and mutation artifacts
- `reports/review-gates/GATE-RX1-representation-unit-scope/proposed-mutation-queue.json`
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `reports/review-gates/GATE-PV-G1-schema/technical-closure.json`
- `references/machine/micro-teaching-units.json`

## Outputs

- Candidate specs for `A77` and `A78`.
- Draft CLI mutation plan with `execution_authorized: false`.
- Generator-blocked/non-interactive tracking for the two candidates.
- Human-review packet for `GATE-RX3b-producer-graph-lane-review`.

## Operationalized sprint procedure

1. Record this plan and baseline before preparing graph-lane mutation-review artifacts.
2. Verify `GATE-RX3-producer-representation` is closed as `pass_with_conditions`.
3. Verify `RX.3a` completed and `A75` is live.
4. Verify `A77` and `A78` are absent, `A80` and `A81` remain absent, and required dependencies `A29`, `A63`, and `A75` are live.
5. Prepare draft unit specs for `A77` and `A78`, keeping procedures explicit about title/context, axes, labels, units, scale, exact-versus-estimated reading, and TO/TK interpretation.
6. Preserve the dependency question for human review: `A78` currently uses `A63` and `A75`; HCS may choose whether to add `A77` as a prerequisite.
7. Prepare a CLI mutation plan in the order `A77`, `A78`, with execution blocked until human gate closure.
8. Record generator-blocked status for `GEN_A77` and `GEN_A78`.
9. During human review, use calibration questions `RX3B-Q1` through `RX3B-Q8`, record each answer, analyze the answer pattern for contradictions, list targeted follow-ups, prepare a closure proposal, and require explicit human confirmation before any later mutation gate can close.
10. Validate the packet with a read-only checker and emit gate bundle URLs.
11. Stop for human review before any CLI mutation, dependency edit, machine-reference mutation, or student-facing exposure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.3b-plan.md
node build-scripts/references/check-rx3b-producer-graph-lane-review.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX3b-producer-graph-lane-review
node build-scripts/sprints/check-bundle-urls.js GATE-RX3b-producer-graph-lane-review
node build-scripts/sprints/check-sprint-bundle.js RX.3b
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the RX.3b review-preparation commit. That removes the graph-lane review packet, candidate specs, CLI plan, generator-blocked records, checker, sprint plan/baseline, roadmap version update, and URL-index changes.

No protected reference data rollback is needed because RX.3b must not mutate `references/machine/` or `references/external/`.

## Human review required

Yes. RX.3b stops at `GATE-RX3b-producer-graph-lane-review` until HCS explicitly authorizes, narrows, or holds later CLI mutation.
