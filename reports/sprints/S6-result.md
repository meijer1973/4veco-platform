# Sprint S6: Result

## Plan reference

`docs/sprints/S6-plan.md`

## Summary

Completed Sprint S6 as a non-mutating source-governance sprint.

What S6 accomplished:

- Strengthened `references/schemas/source-document.schema.json`.
- Added `build-source-document-registry.js` to derive a governed source-document registry from source inventories and evidence-anchor source paths.
- Added `check-source-document-registry.js` to validate registry fields, source/evidence boundaries, evidence-anchor document coverage, and the storage decision.
- Generated `references/data/source-document-registry.json`.
- Generated `reports/json/source-document-registry.json` and `reports/markdown/source-document-registry.md`.
- Archived roadmap v2.16 and advanced the live roadmap to v2.17.

What S6 did not do:

- no `references/machine/` registry was created
- no hand edits were made to `references/machine/`
- no hand edits were made to `references/external/`
- no authored-source mutation
- no RAG chunk hand-patching
- no student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery, or summative use

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js docs/sprints/S6-plan.md`
- `node build-scripts/references/build-source-document-registry.js`
- `node build-scripts/references/check-source-document-registry.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/references/build-reference-inventory.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/references/check-roadmap-version-index.js`

Sprint-close checks after this result artifact is written:

- `node build-scripts/sprints/check-sprint-result.js reports/sprints/S6-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js S6 --complete`

## Changed files

- `build-scripts/references/build-source-document-registry.js`
- `build-scripts/references/check-source-document-registry.js`
- `docs/sprints/S6-plan.md`
- `references/data/source-document-registry.json`
- `references/data/sprints/S6.plan.json`
- `references/data/sprints/S6.result.json`
- `references/schemas/source-document.schema.json`
- `reports/json/source-document-registry.json`
- `reports/markdown/source-document-registry.md`
- `reports/sprints/S6-baseline.md`
- `reports/sprints/S6-result.md`
- `reports/sprints/S6-diff-summary.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.16-rx2b-graphical-foundation-applied.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- regenerated `references/data/source_manifest.json`
- regenerated `references/data/document_inventory.json`

## Data integrity notes

No protected reference data changed.

S6 did not hand-edit:

- `references/machine/`
- `references/external/`

The source-document registry is a governed `references/data/` overlay. A future `references/machine/` registry remains blocked until a CLI-backed mutation path exists.

Generated reports are explicitly diagnostic and are not primary evidence or curriculum authority.

## Open follow-ups

- Sprint 7 should use this source-document registry as input context when defining the skill and operation registry MVP.
- A later migration sprint may promote the registry to `references/machine/` only after schema, CLI, validators, mutation logs, and review approval exist.
- R14.1 should reuse `source_version` and citation fields when it builds the minimal curriculum/source-version registry.

## Rollback instructions

Revert the S6 sprint commit. That removes the registry overlay, reports, schema update, builder/checker scripts, sprint artifacts, and roadmap/version-index update together.

Do not manually patch `references/machine/` or `references/external/` for rollback.
