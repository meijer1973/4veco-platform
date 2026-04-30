# Sprint S6: Baseline

## Plan reference

`docs/sprints/S6-plan.md`

## Current state

Sprint S6 starts after RX.2b closed and the live roadmap identified `Sprint 6 Bronnen Registry MVP` as the next sprint.

Current source-governance inputs already exist:

- `references/data/source_manifest.json`
- `references/data/document_inventory.json`
- `references/data/evidence-anchors.json`
- `references/SOURCE_OF_TRUTH.md`

The existing `references/schemas/source-document.schema.json` is present, but it is minimal. It does not yet require source version, status, owner, citation policy, or public-citation policy.

## Data integrity notes

No protected reference data is changed at baseline.

Sprint S6 must not hand-edit:

- `references/machine/`
- `references/external/`

The first source-document registry implementation will live under `references/data/` as a governed overlay. A future `references/machine/` registry remains blocked until a CLI-backed mutation path exists.

## Baseline decision

Proceed with a non-mutating governance/data sprint. The output should be schema, builder, validator, registry overlay, report, and roadmap/result artifacts only.
