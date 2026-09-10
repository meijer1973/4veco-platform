# Sprint S6: Bronnen Registry MVP

## Goal

Create a controlled source-document registry MVP that records source type, authority level, source version, status, owner, citation policy, and public-citation policy without weakening protected reference-surface discipline.

## Context

The roadmap requires a bronnen/source-document registry before later source-version, retrieval, and exercise-metadata work can safely reason across external, machine, authored, owned, governance, and generated-report surfaces.

This sprint intentionally stores the first implementation under `references/data/` as a governed overlay. It does not create a `references/machine/` registry, because a machine registry would require a CLI-backed mutation path first.

## Allowed paths

- `docs/sprints/S6-plan.md`
- `references/data/sprints/S6.plan.json`
- `reports/sprints/S6-baseline.md`
- `references/schemas/source-document.schema.json`
- `build-scripts/references/build-source-document-registry.js`
- `build-scripts/references/check-source-document-registry.js`
- `references/data/source-document-registry.json`
- `reports/json/source-document-registry.json`
- `reports/markdown/source-document-registry.md`
- `references/data/sprints/S6.result.json`
- `reports/sprints/S6-result.md`
- `reports/sprints/S6-diff-summary.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.16-rx2b-graphical-foundation-applied.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- regenerated inventories under `references/data/source_manifest.json` and `references/data/document_inventory.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/source-document-registry.json`
- mutation of `references/authored/course-target-exercises.json`
- RAG chunk hand-patching
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/reference-team-roadmap.md`
- `references/SOURCE_OF_TRUTH.md`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `references/data/evidence-anchors.json`
- `references/data/owned-source-registry.json`
- `references/schemas/source-document.schema.json`

## Outputs

- A strengthened `source-document` JSON schema.
- A generated source-document registry under `references/data/`.
- A JSON and Markdown source-document registry report.
- A validator that checks source/evidence boundaries, evidence-anchor coverage, and the storage decision.
- Sprint result, diff summary, and roadmap/version-index update.

## Operationalized sprint procedure

1. Record this plan and baseline, noting that no protected reference-source mutation is authorized.
2. Strengthen the source-document schema with explicit authority, status, source-version, citation, and public-citation fields.
3. Build the registry from `source_manifest`, `document_inventory`, and evidence-anchor source paths.
4. Store the MVP registry under `references/data/source-document-registry.json`, not under `references/machine/`.
5. Generate the JSON and Markdown reports.
6. Validate that all evidence-anchor document IDs and source paths are covered.
7. Validate that generated reports are diagnostic only and not primary evidence.
8. Validate that external and machine-reference boundaries remain intact.
9. Regenerate inventories after adding the new registry/report/tooling files.
10. Update the live roadmap and archive the previous roadmap version.
11. Run acceptance tests. Stop and report if the validator finds missing evidence-anchor coverage, accidental machine-registry creation, or weakened generated-report authority labels.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S6-plan.md
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/S6-result.md
node build-scripts/sprints/check-sprint-bundle.js S6 --complete
```

## Rollback plan

Revert the S6 sprint commit. That removes the source-document registry overlay, reports, schema strengthening, builder/checker scripts, sprint artifacts, and roadmap/version-index update together.

Do not manually patch `references/machine/` or `references/external/` for rollback.

## Human review required

No. Sprint 6 is an internal governance MVP, not a new authority gate. Any later proposal to promote this overlay into `references/machine/` requires its own CLI-backed migration sprint and review.
