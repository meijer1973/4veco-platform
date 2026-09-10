# Sprint PV.8: Diff Summary

## Summary

PV.8 added a non-mutating Procedure-Visual promotion-pipeline design.

The sprint does not implement promotion. It records the future path needed before a later gate can promote any PV records.

## Changed artifacts

- Added a design-only PV promotion-pipeline record under `references/data/procedure-visual/`.
- Added JSON/Markdown design reports.
- Added builder/checker scripts for the design report.
- Added a technical packet and technical closure under `GATE-PV8-promotion-pipeline-design`.
- Added PV.8 sprint plan, baseline, result, diff summary, and result JSON.
- Updated the active roadmap from `v2.38-pv7-gate-closed` to `v2.39-pv8-promotion-pipeline-design`.
- Archived the prior roadmap snapshot under `docs/roadmaps/outdated/`.
- Updated the roadmap version index and URL index.

## Protected surfaces

No `references/machine/` or `references/external/` files changed.

No PV machine registry was created:

- no `references/machine/procedure-templates.json`
- no `references/machine/visual-states.json`
- no `references/machine/unit-template-links.json`
- no `references/machine/procedure-visual-vocab.json`

## Follow-up direction

Proceed to PV-G4 lesson-regression proof coordination. Do not implement a PV promotion CLI or attempt machine promotion until at least two lesson-side PV regression proofs exist and a later sprint explicitly scopes CLI implementation.
