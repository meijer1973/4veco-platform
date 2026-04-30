# Sprint S6: Diff Summary

## Summary

S6 creates the first source-document registry MVP as a governed `references/data/` overlay and keeps machine-reference discipline intact.

## Added

- `build-scripts/references/build-source-document-registry.js`
- `build-scripts/references/check-source-document-registry.js`
- `docs/sprints/S6-plan.md`
- `references/data/source-document-registry.json`
- `references/data/sprints/S6.plan.json`
- `references/data/sprints/S6.result.json`
- `reports/json/source-document-registry.json`
- `reports/markdown/source-document-registry.md`
- `reports/sprints/S6-baseline.md`
- `reports/sprints/S6-result.md`
- `reports/sprints/S6-diff-summary.md`
- archived roadmap snapshot `docs/roadmaps/outdated/reference-team-roadmap-v2.16-rx2b-graphical-foundation-applied.md`

## Updated

- `references/schemas/source-document.schema.json` now requires source version, status, owner, citation policy, and public-citation policy.
- `references/reference-team-roadmap.md` moves S6 to completed and sets Sprint 7 as the next sprint.
- `docs/roadmaps/roadmap-version-index.json` and `.md` point active roadmap state to v2.17 and archive v2.16.
- `references/data/source_manifest.json` and `references/data/document_inventory.json` were regenerated after adding S6 files.

## Protected surfaces

No protected reference data changed.

S6 did not modify:

- `references/machine/`
- `references/external/`

The registry explicitly confirms that no `references/machine/source-document-registry.json` exists.

## Boundary effects

Generated diagnostics are listed for traceability but remain non-primary evidence. External and machine registry records keep distinct citation and downstream-use policies.
