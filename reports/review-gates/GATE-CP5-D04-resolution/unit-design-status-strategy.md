# CP-5 Unit-Design Status Strategy

Sprint: S9
Gate: GATE-CP5-D04-resolution

## Strategy

- Strategy: derived_overlay_first
- Machine-field migration ready: false
- Protected reference data changed: false

The roadmap prefers a derived overlay first unless CLI/schema migration is ready. Current CLI coverage can express deprecate, split, or merge after a decision, but there is no governed machine-unit unit_design_status field workflow yet.

## Accepted Now

- Create references/data/unit-design-status/unit-design-status-overlay.json.
- Report D04 as unstable and promotion-blocked.
- Prepare CP-5 decision record, dependent-unit audit, and human review packet.

## Blocked Now

- Do not edit references/machine/micro-teaching-units.json.
- Do not run unit-deprecate.js, unit-merge.js, or unit-split.js in S9.
- Do not add D04 -> A15.
- Do not treat D04 as promotion-safe before CP-5 closure.

## Later If CP-5 Passes

- Plan a separate CLI-only mutation sprint with concrete target specs.
- Use unit-deprecate.js, unit-merge.js, or unit-split.js only after explicit human authorization.
- Regenerate machine projections, reports, RAG chunks, source manifest, and document inventory in that later sprint.
