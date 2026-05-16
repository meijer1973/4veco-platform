# Sprint S9: Diff Summary

## Scope

S9 added a decision-only unit-design status layer and closed CP-5 for D04 as `pass_with_conditions`.

## Added

- `references/data/unit-design-status/unit-design-status-overlay.json`
- `references/schemas/unit-design-status.schema.json`
- `build-scripts/references/build-unit-design-status-overlay.js`
- `build-scripts/references/check-unit-design-status.js`
- `reports/json/unit-design-status.json`
- `reports/markdown/unit-design-status.md`
- `reports/review-gates/GATE-CP5-D04-resolution/` with decision record, dependent-unit audit, strategy, review packet, human interview, gate closure, and bundle URLs.
- `docs/sprints/S9-plan.md`
- `reports/sprints/S9-baseline.md`
- `reports/sprints/S9-result.md`
- `reports/sprints/S9-diff-summary.md`
- `references/data/sprints/S9.plan.json`
- `references/data/sprints/S9.result.json`

## Updated

- Report generation now emits `unit-design-status`.
- Reference-health reports unit-design status counts and authority boundaries.
- RAG chunk validation requires the generated unit-design-status report chunk to preserve non-authority and promotion-blocked labels.
- Roadmap/version-index files now record S9 completion and archive v2.42.
- Generated reports, RAG chunks, source manifest, document inventory, and URL index were refreshed.

## Protected surfaces

No `references/machine/` or `references/external/` files were changed.

No D04 lifecycle mutation occurred in S9. S9 did not run `unit-deprecate.js`, `unit-merge.js`, or `unit-split.js`, and did not add a `D04 -> A15` edge.

## Gate outcome

`GATE-CP5-D04-resolution` closed as `pass_with_conditions`.

The decision direction is settled: redistribute D04 content to successor elasticity units and retire the standalone D04 unit later through CLI. The mutation remains blocked until a separate CLI-only sprint.

## Residual risk

The dependent-unit audit is complete enough for CP-5 closure, not for direct mutation. S9a must still name every exact operational change and verify stale D04 references after mutation.
