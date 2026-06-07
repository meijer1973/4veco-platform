# Sprint MTU-GENBLOCK-HARDEN-1: Baseline

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/MTU-GENBLOCK-HARDEN-1-plan.md`

## Current state

The current readiness report already reflects later MTU hardening after the
historical RX.6 closure:

- `reports/json/skilltree-generator-readiness.json` status: `passed`.
- Active A-domain units: 98.
- Interactive generator-backed A-domain units: 47.
- Generator-blocked A-domain units: 51.
- Explicit generator-block records: 51.
- Blocked interactive leak count: 0.
- Source/deploy `GENERATOR_BLOCKED_SKILLS` rows: 51.

The historical RX.6 result file still describes the original closure baseline
with 37 blocked units. The current generated readiness report and current
roadmap row are stronger evidence for the live state.

## Baseline risk

`engines/skilltree/base-elements.js` and `scripts/deploy.js` keep
missing-generator A-domain units out of interactive `SKILLS`, but
`ROUTE_SKILLS` is broader than the interactive catalog. The route renderer
uses `ROUTE_SKILLS` by default for student-visible route panels. That creates
an exposure risk: a generator-blocked A-domain unit can be absent from
interactive exercises while still being visible as an ordinary route item.

Non-A concept units such as `B01` and `B02` need to remain available for
display-only concept routes. The hardening target is therefore specific:
exclude generator-blocked A-domain rows from route catalogs while preserving
non-A concept route rows.

## Data integrity notes

No protected reference data has been edited for this baseline. This sprint may
read `references/machine/micro-teaching-units.json` but must not hand-edit
`references/machine/` or `references/external/`. It must not write source-data
or generated lesson output.

## Required baseline proof

- The plan names the route leak vector and generated-output boundary.
- The current report/block files prove 51 current generator-blocked units.
- Implementation must make the checker fail on a negative fixture where a
  blocked unit is marked interactive.
- Result evidence must explain blocked-unit product-route relevance, not only
  green validator output.
