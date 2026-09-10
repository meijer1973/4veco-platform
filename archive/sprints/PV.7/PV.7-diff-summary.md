# Sprint PV.7: Diff Summary

## Summary

PV.7 moved from prepared review to closed gate.

The HCS decision is recorded as `pass_with_conditions`: no Procedure-Visual machine promotion now, keep all PV records under `references/data/procedure-visual/`, and insert a bounded PV promotion-pipeline design sprint plus PV-G4 lesson-regression proof before reopening promotion.

## Changed artifacts

- Added `human-interview.json` and `human-interview.md` for `GATE-PV7-machine-promotion-review`.
- Added `gate-closure.json` and `gate-closure.md` for `GATE-PV7-machine-promotion-review`.
- Updated the PV.7 sprint plan/plan JSON to include closure/result validation.
- Added PV.7 result and diff-summary files.
- Updated the active roadmap from `v2.37-pv7-machine-promotion-review-prepared` to `v2.38-pv7-gate-closed`.
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

Proceed to `PV.8 Promotion Pipeline Design`, not to another promotion attempt. PV.8 must remain non-mutating and define the CLI-backed promotion path, mutation logs, validators, rollback model, and future gate criteria.
