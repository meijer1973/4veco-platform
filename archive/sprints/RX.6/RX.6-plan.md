# Sprint RX.6: Skill-Tree And Generator Integration

## Goal

Make skill-tree generator readiness explicit and enforceable after the RX/PV representation work.

RX.6 does not implement the missing `GEN_A*` generators. It separates generator-backed interactive skill-tree nodes from catalog-valid but non-interactive A-domain units, proves the deployed browser bundle uses the same split, and records explicit generator-block status for every active A-domain unit without a generator.

## Context

RX.2, RX.2b, RX.3a, RX.3b, and RX.4 added representation-sensitive A-domain units through CLI. HCS repeatedly approved those catalog mutations only with generator-blocked/non-interactive conditions. PV.3 through PV.6 added procedure-visual templates, projection proof, and dashboard coverage, but still do not authorize student-facing PV projection.

The current risk is practical: tests and deployed skill-tree bundles must not treat catalog-valid units as runnable exercises when their generators do not exist. RX.6 closes that release-readiness gap.

## Allowed paths

- `docs/sprints/RX.6-plan.md`
- `references/data/sprints/RX.6.plan.json`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/sprints/RX.6-baseline.md`
- `scripts/deploy.js`
- `engines/tests/skilltree-data.test.js`
- `build-scripts/references/build-skilltree-generator-readiness.js`
- `build-scripts/references/check-skilltree-generator-readiness.js`
- `build-scripts/references/build-representation-operation-coverage.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `reports/json/skilltree-generator-readiness.json`
- `reports/markdown/skilltree-generator-readiness.md`
- `reports/json/representation-operation-coverage.json`
- `reports/markdown/representation-operation-coverage.md`
- `reports/json/graph-skill-tree.json`
- `reports/markdown/graph-skill-tree.md`
- `reports/json/reference-health.json`
- `reports/markdown/reference-health.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/review-packet.json`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/review-packet.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/technical-closure.json`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/technical-closure.md`
- `reports/review-gates/GATE-RX6-skilltree-generator-integration/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.35-pv6-coverage-dashboard.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/RX.6-result.md`
- `reports/sprints/RX.6-diff-summary.md`
- `references/data/sprints/RX.6.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- authored source mutation
- RAG chunk patching
- lesson repo commits or generated lesson target edits
- placeholder or fake generators that expose units as interactive without real exercise logic
- PV machine-registry promotion
- student-facing PV projection
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/machine/micro-teaching-units.json`
- `engines/skilltree/base-elements.js`
- `engines/skilltree/generators.js`
- `scripts/deploy.js`
- existing generator-block records from RX.2, RX.2b, RX.3a, RX.3b, and RX.4
- `reports/json/representation-operation-coverage.json`
- `reports/json/procedure-visual-coverage.json`
- `reports/json/reference-health.json`

## Outputs

- Deployed skill-tree bundle logic that exports only generator-backed A-domain units as interactive.
- `GENERATOR_BLOCKED_SKILLS` metadata in the deployed browser bundle.
- `RX.6-generator-blocked-units.json` recording explicit non-interactive status for all currently missing A-domain generators.
- Skill-tree generator readiness JSON/Markdown reports.
- Reference-health summary for skill-tree generator readiness.
- `GATE-RX6-skilltree-generator-integration` technical packet and closure.
- Roadmap/version-index update moving RX.6 to completed and PV.7 to the top open sprint.

## Operationalized sprint procedure

1. Record the RX.6 plan and baseline before changing runtime behavior.
2. Align `scripts/deploy.js` with `engines/skilltree/base-elements.js`: only generator-backed active A-domain units may become interactive `SKILLS`; missing-generator units must be exported as blocked metadata.
3. Add test coverage proving source base-elements and deployed browser bundle use the same interactive/block split.
4. Build a readiness report that compares the catalog, generators, source base-elements, deploy bundle data, and explicit generator-block records.
5. Generate an RX.6 block file for any active A-domain unit that lacks a generator, including older R4.5 units that predate the RX generator-block convention.
6. Regenerate representation-operation and graph-skill-tree reports so graph units such as A45-A60 no longer appear as missing-but-unblocked.
7. Integrate the readiness summary into reference health while preserving diagnostic-only and non-student-facing boundaries.
8. Emit the technical gate bundle and run sprint validators.
9. Stop if the work would require protected reference mutation, external-source mutation, lesson-side changes, fake generators, PV publication, or student-facing/adaptive use.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.6-plan.md
node build-scripts/references/build-skilltree-generator-readiness.js
node build-scripts/references/check-skilltree-generator-readiness.js
npx.cmd jest engines/tests/skilltree-data.test.js --runInBand
node build-scripts/references/build-representation-operation-coverage.js
node build-scripts/references/check-representation-operation-coverage.js
node build-scripts/references/build-procedure-visual-coverage.js
node build-scripts/references/check-procedure-visual-coverage.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-RX6-skilltree-generator-integration
node build-scripts/sprints/check-bundle-urls.js GATE-RX6-skilltree-generator-integration
node build-scripts/sprints/check-sprint-bundle.js RX.6
node build-scripts/sprints/check-sprint-result.js reports/sprints/RX.6-result.md
node build-scripts/sprints/check-sprint-bundle.js RX.6 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the RX.6 commit. That removes the deploy bundle split, the skilltree-data test addition, the readiness builder/checker, RX.6 generator-block record, generated reports, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.

No protected reference data rollback is needed because RX.6 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for RX.6 because it is release-readiness enforcement and report integration only. Human review remains required before generator-blocked units become student-facing, before PV projection is published, or before diagnostics/adaptive/mastery/summative product uses are authorized.
