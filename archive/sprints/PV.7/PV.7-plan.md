# Sprint PV.7: Machine-Promotion Review Gate

## Goal

Prepare the human review gate that decides whether any Procedure-Visual records should move from `references/data/procedure-visual/` into `references/machine/`.

PV.7 is a decision sprint, not a promotion sprint. It must make the readiness state explicit and stop before creating or editing any PV machine registry.

## Context

PV.1 through PV.6 created the governed Procedure-Visual overlay, schemas, validator, pilot templates, visual states, unit-template links, procedure-game alignment proof, projection proof, coverage reports, and reference-health summary. RX.6 made generator-blocked skill-tree units explicit.

The roadmap boundary still applies: no PV machine promotion is allowed until schema, CLI, validators, mutation logs, reports, at least two lesson-side regressions, and a human review gate exist. Current evidence suggests the overlay is useful but not ready for machine promotion because there is no PV machine-edit CLI, no promotion mutation-log workflow, and no two lesson-side PV regression proofs.

## Allowed paths

- `docs/sprints/PV.7-plan.md`
- `references/data/sprints/PV.7.plan.json`
- `reports/sprints/PV.7-baseline.md`
- `build-scripts/references/build-procedure-visual-machine-promotion-review.js`
- `build-scripts/references/check-procedure-visual-machine-promotion-review.js`
- `reports/json/procedure-visual-machine-promotion-readiness.json`
- `reports/markdown/procedure-visual-machine-promotion-readiness.md`
- `reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.json`
- `reports/review-gates/GATE-PV7-machine-promotion-review/review-packet.md`
- `reports/review-gates/GATE-PV7-machine-promotion-review/promotion-readiness.json`
- `reports/review-gates/GATE-PV7-machine-promotion-review/promotion-readiness.md`
- `reports/review-gates/GATE-PV7-machine-promotion-review/bundle-urls.md`
- `reports/review-gates/GATE-PV7-machine-promotion-review/human-interview.json`
- `reports/review-gates/GATE-PV7-machine-promotion-review/human-interview.md`
- `reports/review-gates/GATE-PV7-machine-promotion-review/gate-closure.json`
- `reports/review-gates/GATE-PV7-machine-promotion-review/gate-closure.md`
- `reports/sprints/PV.7-result.md`
- `reports/sprints/PV.7-diff-summary.md`
- `references/data/sprints/PV.7.result.json`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.36-rx6-skilltree-generator-integration.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/unit-template-links.json`
- creation of `references/machine/procedure-visual-vocab.json`
- creation of `references/machine/procedure-visual.json`
- creation of machine-promotion mutation logs that imply promotion has already happened
- mutation of authored source files or RAG chunks
- lesson repo commits or generated lesson target edits
- student-facing PV projection
- generator exposure for blocked units
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- `references/data/procedure-visual/procedure-visual-vocab.json`
- `build-scripts/references/validate-procedure-visual-registry.js`
- `reports/json/procedure-visual-inventory.json`
- `reports/json/procedure-visual-schema-status.json`
- `reports/json/procedure-visual-pilot-status.json`
- `reports/json/procedure-game-template-alignment.json`
- `reports/json/procedure-visual-projection-mvp.json`
- `reports/json/procedure-visual-coverage.json`
- `reports/json/skilltree-generator-readiness.json`
- `reports/json/reference-health.json`

## Outputs

- PV machine-promotion readiness JSON and Markdown report.
- Human review packet for `GATE-PV7-machine-promotion-review`.
- Gate bundle URLs for external review.
- Roadmap/version-index update recording that PV.7 is prepared for human review.

## Operationalized sprint procedure

1. Record this plan and baseline before preparing the gate packet.
2. Build a read-only PV machine-promotion readiness report from the existing PV overlay, reports, validators, machine-registry absence, CLI availability, mutation-log availability, and lesson-regression proof availability.
3. Validate that the readiness report blocks machine promotion when CLI, mutation logs, or two lesson-side regressions are absent.
4. Prepare the review packet with calibration questions `PV7-Q1` through `PV7-Q8`, including recommended answers, current blockers, and a conservative no-promotion recommendation.
5. Emit bundle URLs so HCS can review the packet from remote.
6. Update roadmap versioning to say PV.7 is prepared for human review while leaving PV.7 incomplete in the Sprint Ledger.
7. Stop for human review before any PV machine-registry creation, external-source mutation, lesson-side change, student-facing projection, or product-surface authorization.
8. During human review, record each answer, analyze the answer pattern for contradictions, list targeted follow-ups, prepare a closure proposal, and require explicit human confirmation before closing the gate.
9. If HCS later closes the gate, record `human-interview.*` and `gate-closure.*`; do not promote any PV record unless the closure explicitly authorizes a CLI-backed promotion path.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.7-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-machine-promotion-review.js
node build-scripts/references/check-procedure-visual-machine-promotion-review.js
node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-PV7-machine-promotion-review/gate-closure.json
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV7-machine-promotion-review
node build-scripts/sprints/check-bundle-urls.js GATE-PV7-machine-promotion-review
node build-scripts/sprints/check-sprint-bundle.js PV.7
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.7-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.7 --complete
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the PV.7 review-preparation commit. That removes the readiness builder/checker, generated readiness report, gate packet, bundle URLs, and roadmap/version-index update.

No protected reference rollback is needed because PV.7 review preparation must not mutate `references/machine/` or `references/external/`.

## Human review required

Yes. PV.7 is a machine-promotion human review gate. It must stop at `GATE-PV7-machine-promotion-review` until HCS explicitly decides whether to keep the PV overlay, authorize a future promotion path, or hold the gate.
