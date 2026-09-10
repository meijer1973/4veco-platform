# Sprint RX.3: Producer Table And Graph Representation Review

## Goal

Prepare the producer-representation mutation review for A75-A81 without mutating the unit catalog. RX.3 must split producer table/data units from producer graph units, apply the PV.2 schema constraints, and stop for human review before any CLI mutation.

## Context

RX.1 identified seven producer/profit representation candidates: A75-A81. The RX.1 human gate required producer table/data candidates and producer graph candidates to be split into separate implementation lanes. RX.2 and RX.2b deliberately kept all producer candidates blocked. PV.2 is now complete, so RX.3 can use Procedure-Visual constraints for graph axes, units, non-color fallback, visual-state fit, and generator-blocked publication status.

RX.3 is not a mutation sprint yet. It prepares the gate packet and proposed queue for HCS review.

## Allowed paths

- `docs/sprints/RX.3-plan.md`
- `references/data/sprints/RX.3.plan.json`
- `reports/sprints/RX.3-baseline.md`
- `reports/review-gates/GATE-RX3-producer-representation/review-packet.json`
- `reports/review-gates/GATE-RX3-producer-representation/review-packet.md`
- `reports/review-gates/GATE-RX3-producer-representation/proposed-mutation-queue.json`
- `reports/review-gates/GATE-RX3-producer-representation/proposed-mutation-queue.md`
- `reports/review-gates/GATE-RX3-producer-representation/bundle-urls.md`
- `build-scripts/references/check-rx3-producer-representation-review.js`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.22-pv2-procedure-visual-schema-validator.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- any `unit-add.js` or `unit-add-dep.js` mutation
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of governed operation or skill-tag machine registries
- mutation of `references/authored/course-target-exercises.json`
- mutation of `references/external/exam-questions.json`
- lesson repo commits or generated lesson target edits
- RAG chunk hand-patching
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing use of A75-A81 before generators/projection support exist

## Inputs

- `references/data/sprints/RX.1-representation-operation-inventory.json`
- `reports/review-gates/GATE-RX1-representation-unit-scope/proposed-mutation-queue.json`
- `reports/review-gates/GATE-RX1-representation-unit-scope/` RX.1 closure artifacts
- `reports/review-gates/GATE-PV-G1-schema/technical-closure.json`
- `references/machine/micro-teaching-units.json`
- `references/data/procedure-visual/procedure-visual-vocab.json`
- `reports/json/procedure-visual-schema-status.json`

## Outputs

- RX.3 review packet for `GATE-RX3-producer-representation`.
- Proposed producer-representation mutation queue with table/data lane, graph lane, and held records.
- Read-only checker proving the queue traces back to RX.1, A75-A81 are still absent, dependencies are live or explicitly pending, PV.2 is complete, and no mutation is authorized.

## Operationalized sprint procedure

1. Record this plan and baseline before preparing review artifacts.
2. Verify live A-domain numbering: A75-A81 must still be absent, while A04, A14, A29, A45, A61, and A63 must be live.
3. Build the proposed queue from the RX.1 producer candidates and preserve the HCS split: A75/A76/A79 as the first table/data mutation-review lane; A77/A78/A80/A81 as graph-lane review; graphical MO=MK stays held.
4. Add Procedure-Visual conditions to the review packet, especially graph axes, units, visual-state fit, non-color fallback, and generator-blocked publication status.
5. Validate the packet with a read-only checker and emit gate bundle URLs.
6. Update the roadmap to show RX.3 as prepared for human review, not completed and not mutation-authorized.
7. Stop for human review before any `unit-add.js` command, dependency edit, machine-reference mutation, or student-facing exposure.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.3-plan.md
node build-scripts/references/check-rx3-producer-representation-review.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX3-producer-representation
node build-scripts/sprints/check-bundle-urls.js GATE-RX3-producer-representation
node build-scripts/sprints/check-sprint-bundle.js RX.3
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the RX.3 review-preparation commit. That removes the review packet, proposed queue, checker, sprint plan/baseline, roadmap version update, and URL-index changes.

No protected reference data rollback is needed because RX.3 review preparation must not mutate `references/machine/` or `references/external/`.

## Human review required

Yes. RX.3 stops at `GATE-RX3-producer-representation` until HCS explicitly approves, narrows, or holds the proposed queue.
