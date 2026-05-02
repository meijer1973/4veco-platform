# Sprint PV.3: Result

## Plan reference

Plan: `docs/sprints/PV.3-plan.md`

## Summary

PV.3 completed the first real Procedure-Visual pilot data layer. The overlay now has six pilot procedure templates, six pilot visual states, and six unit-template links under `references/data/procedure-visual/`.

The PV-G2 technical proof confirms the required pilot coverage: formula trace, graph-stage, table-trace, and flowchart-style templates/states are all present. All records remain publication-blocked, and no PV `references/machine/` registry was created.

## Acceptance test results

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.3-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-pilot-status.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV-G2-pilot-content
node build-scripts/sprints/check-bundle-urls.js GATE-PV-G2-pilot-content
node build-scripts/sprints/check-sprint-bundle.js PV.3
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.3-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.3 --complete
node build-scripts/references/check-roadmap-version-index.js
```

All listed acceptance tests pass.

## Changed files

- Updated `references/data/procedure-visual/procedure-templates.json` with six pilot templates.
- Updated `references/data/procedure-visual/visual-states.json` with six pilot visual states.
- Updated `references/data/procedure-visual/unit-template-links.json` with six pilot links.
- Updated the PV validator to validate real pilot registries in addition to schema examples.
- Added `build-scripts/references/build-procedure-visual-pilot-status.js`.
- Added JSON/Markdown pilot-status reports.
- Added `GATE-PV-G2-pilot-content` technical review and closure artifacts.
- Added PV.3 sprint plan, baseline, result, diff summary, and result JSON.
- Updated the roadmap to `v2.31-pv3-pilot-procedure-visual-templates`, archived v2.30, and set PV.4 as the next sprint.

## Data integrity notes

No protected reference data changed. PV.3 did not hand-edit `references/machine/` or `references/external/`, did not create PV machine registries, did not mutate authored source files, did not patch RAG chunks, and did not touch lesson repositories.

Student-facing PV projection remains blocked, as do diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, and summative use.

## Open follow-ups

- PV.4 should add backward-compatible `formal_step_id` support for procedure-game data without forcing existing games to migrate.
- PV.5 should build non-dynamic render/validation libraries after the projection contract.
- PV.7 or a later human gate is still required before any PV machine promotion.

## Rollback instructions

Revert the PV.3 commit. This restores the PV.2 empty real PV registries and removes the PV.3 validator/report/gate artifacts, sprint records, roadmap archive/version update, and URL-index updates.
