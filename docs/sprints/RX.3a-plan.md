# Sprint RX.3a: Producer Table/Data First-Lane Mutation Review

## Goal

Prepare the bounded producer table/data mutation-review packet for `A75`, `A76`, and `A79` without executing `unit-add.js`.

## Context

`GATE-RX3-producer-representation` closed as `pass_with_conditions`. HCS authorized first-lane mutation review for `A75`, `A76`, and `A79`, required `A76` to include `A14`, `A04`, and `A61` as needs, allowed `A77`/`A78` only later after `A75`, and held `A80`, `A81`, and graphical `MO=MK`.

RX.3a prepares candidate specs, a CLI mutation plan, and generator-block tracking for the first lane. It does not mutate the unit catalog.

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
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.24-rx3-gate-closed.md`
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

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.3a-plan.md
node build-scripts/references/check-rx3a-first-lane-mutation-review.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX3a-first-lane-mutation-review
node build-scripts/sprints/check-bundle-urls.js GATE-RX3a-first-lane-mutation-review
node build-scripts/sprints/check-sprint-bundle.js RX.3a
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the RX.3a review-preparation commit. That removes the first-lane review packet, candidate specs, CLI plan, generator-blocked records, checker, sprint plan/baseline, roadmap version update, and URL-index changes.

No protected reference data rollback is needed because RX.3a must not mutate `references/machine/` or `references/external/`.

## Human review required

Yes. RX.3a stops at `GATE-RX3a-first-lane-mutation-review` until HCS explicitly authorizes, narrows, or holds CLI mutation.
