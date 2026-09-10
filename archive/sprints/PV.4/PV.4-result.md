# Sprint PV.4: Result

## Plan reference

Plan: `docs/sprints/PV.4-plan.md`

## Summary

PV.4 completed the Procedure/Game Projection Contract. The procedure engine now exposes optional `formal_step_id` alignment status without changing existing gameplay behavior.

The reference-side alignment report proves one B02 procedure-game pilot maps every game step to the PV.3 template `choose_by_opportunity_cost_flow`, while a legacy unmapped procedure remains valid and runnable. No forced migration, PV machine registry, or student-facing PV projection is authorized.

## Acceptance test results

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.4-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-game-template-alignment.js
npx.cmd jest engines/tests/procedure-engine.test.js engines/tests/procedure-data-formal-step.test.js --runInBand
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV4-procedure-game-contract
node build-scripts/sprints/check-bundle-urls.js GATE-PV4-procedure-game-contract
node build-scripts/sprints/check-sprint-bundle.js PV.4
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.4-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.4 --complete
node build-scripts/references/check-roadmap-version-index.js
```

All listed acceptance tests pass. The formal-step data test skipped target-data scanning because no local `shared/procedure/` target data exists in this platform checkout; the engine tests and reference-side alignment report cover the PV.4 contract.

## Changed files

- Updated `engines/procedure-engine.js` with optional formal-step alignment helpers.
- Updated `engines/tests/procedure-engine.test.js`.
- Added `engines/tests/procedure-data-formal-step.test.js`.
- Added `references/data/procedure-visual/procedure-game-alignment-pilots.json`.
- Added `build-scripts/references/build-procedure-game-template-alignment.js`.
- Added procedure-game alignment JSON/Markdown reports.
- Added `GATE-PV4-procedure-game-contract` technical review and closure artifacts.
- Added PV.4 sprint plan, baseline, result, diff summary, and result JSON.
- Updated the roadmap to `v2.32-pv4-procedure-game-contract`, archived v2.31, and set RX.5 as the next sprint.

## Data integrity notes

No protected reference data changed. PV.4 did not hand-edit `references/machine/` or `references/external/`, did not create PV machine registries, did not mutate authored source files, did not patch RAG chunks, and did not touch lesson repositories.

Student-facing PV projection remains blocked, as do forced migration, visual renderer publication, diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, and summative use.

## Open follow-ups

- RX.5 can now use PV pilot data and operation references when planning representation operation registry/report work.
- PV.5 should build non-dynamic render/validation libraries only after the roadmap permits it.
- Lesson-side adoption remains a later consumer/regression task, not part of PV.4.

## Rollback instructions

Revert the PV.4 commit. This removes optional formal-step engine/report support, the alignment fixture, tests, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index updates.
