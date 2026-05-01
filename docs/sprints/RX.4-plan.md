# Sprint RX.4: Elasticity And Market Diagram Representation Review

## Goal

Prepare the bounded elasticity and market-diagram representation review gate for `A82`, `A83`, and `A84`, without mutating the unit catalog.

## Context

RX.1 identified the elasticity candidates `A82`, `A83`, and `A84`. It also decided that `A82` and `A84` may move earlier than the full producer-graph lane, while `A83` remains conditional on P-Q graph/source-value readiness. RX.2, RX.2b, RX.3a, and RX.3b have now added the table, graph-foundation, and producer prerequisite units through CLI-only mutation. PV.2 provides schema and validator constraints for graph-stage reasoning, but real PV templates and student-facing projection remain blocked.

RX.4 prepares the next human gate. It must distinguish elasticity from table/source values from elasticity from graphs, and it must keep market/welfare duplicate areas held unless HCS explicitly approves a later lane.

## Allowed paths

- `docs/sprints/RX.4-plan.md`
- `references/data/sprints/RX.4.plan.json`
- `reports/sprints/RX.4-baseline.md`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/review-packet.json`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/review-packet.md`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/candidate-specs.json`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/candidate-specs.md`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/cli-mutation-plan.json`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/cli-mutation-plan.md`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/RX.4-generator-blocked-units.json`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/RX.4-generator-blocked-units.md`
- `reports/review-gates/GATE-RX4-elasticity-market-diagram-review/bundle-urls.md`
- `build-scripts/references/check-rx4-elasticity-market-diagram-review.js`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.28-rx3b-graph-lane-applied.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- execution of `unit-add.js` before `GATE-RX4-elasticity-market-diagram-review` explicitly authorizes CLI mutation
- execution of `unit-add-dep.js`
- mutation of `references/authored/course-target-exercises.json`
- mutation of `references/external/exam-questions.json`
- lesson repo commits or generated lesson target edits
- RAG chunk hand-patching
- mutation review for held market/welfare duplicate areas unless a later human gate moves them into scope
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing skill-tree or PV projection use of `A82`, `A83`, or `A84` before generators/projection support exist

## Inputs

- `reports/review-gates/GATE-RX1-representation-unit-scope/` closure artifacts
- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `references/data/sprints/RX.2b.result.json`
- `references/data/sprints/RX.3b.result.json`
- `reports/review-gates/GATE-PV-G1-schema/technical-closure.json`
- `references/machine/micro-teaching-units.json`

## Outputs

- Candidate specs for `A82`, `A83`, and `A84`.
- Draft CLI mutation plan with `execution_authorized: false`.
- Generator-blocked/non-interactive tracking for the three candidates.
- Market/welfare duplicate audit notes that keep overlapping units held.
- Human-review packet for `GATE-RX4-elasticity-market-diagram-review`.

## Operationalized sprint procedure

1. Record this plan and baseline before preparing RX.4 review artifacts.
2. Verify RX.1 closed as `pass_with_conditions` and moved `A82`/`A84` earlier while keeping `A83` conditional on graph/source readiness.
3. Verify RX.2b, RX.3a, and RX.3b completed so the table, graph-foundation, and producer representation prerequisites are live.
4. Verify `A82`, `A83`, and `A84` are absent; verify required dependencies `A15`, `A46`, `A61`, `A66`, and `A67` are live.
5. Prepare draft specs for `A82`, `A83`, and `A84`; keep elasticity sign, absolute-value interpretation, source-value pairing, and graph-reading-before-calculation explicit.
6. Preserve the human-review decision point for `A83`: either approve as demand-graph/P-Q graph elasticity, rename/generalize, or keep held until graph-source evidence is stronger.
7. Prepare a CLI mutation plan with `A82` and `A84` as the lower-risk first lane and `A83` as conditional. Execution remains blocked until human gate closure.
8. Record generator-blocked status for `GEN_A82`, `GEN_A83`, and `GEN_A84`.
9. Record market/welfare duplicate audit holds for `A19`, `A32`, `A40`, `D39`, `D40`, and market-intervention operations already covered by `A51`, `A56`, and `A59`.
10. During human review, use calibration questions `RX4-Q1` through `RX4-Q9`, record each answer, analyze the answer pattern for contradictions, list targeted follow-ups, prepare a closure proposal, and require explicit human confirmation before any mutation gate can close.
11. Validate the packet with a read-only checker and emit gate bundle URLs.
12. Stop for human review before any CLI mutation, dependency edit, machine-reference mutation, or student-facing exposure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.4-plan.md
node build-scripts/references/check-rx4-elasticity-market-diagram-review.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX4-elasticity-market-diagram-review
node build-scripts/sprints/check-bundle-urls.js GATE-RX4-elasticity-market-diagram-review
node build-scripts/sprints/check-sprint-bundle.js RX.4
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the RX.4 review-preparation commit. That removes the review packet, candidate specs, blocked CLI plan, generator-block tracking, checker, bundle URL update, roadmap version update, and version-index snapshot.

Do not manually patch `references/machine/` for rollback.

## Human review required

Yes. RX.4 stops at `GATE-RX4-elasticity-market-diagram-review` until HCS explicitly authorizes, narrows, renames, or holds later CLI mutation.
