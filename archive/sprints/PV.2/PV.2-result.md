# Sprint PV.2: Result

## Plan reference

Plan: `docs/sprints/PV.2-plan.md`

## Summary

PV.2 completed the Procedure-Visual schema and validator MVP. The overlay now has strict schema files, a PV vocabulary with schema examples, empty real registries for future templates/states/links, a read-only validator, schema-status reports, and `GATE-PV-G1-schema` technical proof artifacts.

The real PV registries remain empty until PV.3. No `references/machine/` PV registry was created, and no student-facing PV projection is authorized.

## Acceptance test results

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.2-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-schema-status.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV-G1-schema
node build-scripts/sprints/check-bundle-urls.js GATE-PV-G1-schema
node build-scripts/sprints/check-sprint-bundle.js PV.2
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.2-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.2 --complete
node build-scripts/references/check-roadmap-version-index.js
```

All listed acceptance tests pass.

## Changed files

- Added PV schema files under `references/data/procedure-visual/`.
- Added empty real PV overlay registries and `procedure-visual-vocab.json`.
- Added `build-scripts/references/validate-procedure-visual-registry.js`.
- Added `build-scripts/references/build-procedure-visual-schema-status.js`.
- Added schema-status JSON/Markdown reports.
- Added `GATE-PV-G1-schema` technical review and closure artifacts.
- Added PV.2 sprint plan, baseline, result, diff summary, and result JSON.
- Updated the roadmap to `v2.22-pv2-procedure-visual-schema-validator`, archived v2.21, and set RX.3 as the next sprint.

## Data integrity notes

No protected reference data changed. PV.2 did not hand-edit `references/machine/` or `references/external/`, did not create `references/machine/procedure-templates.json`, `references/machine/visual-states.json`, or `references/machine/procedure-visual-vocab.json`, and did not touch the lesson repo.

## Open follow-ups

- RX.3 may proceed using PV constraints for producer table and graph units.
- PV.3 must add real pilot templates and visual states only after this schema contract.
- PV machine promotion remains blocked until PV.7 or a later approved human promotion gate.
- Student-facing PV projection remains blocked until generator/projection support and publication controls exist.

## Rollback instructions

Revert the PV.2 commit. This removes the PV schema/validator/report artifacts, PV.2 sprint records, PV-G1 technical artifacts, roadmap archive/version update, and URL-index changes.
