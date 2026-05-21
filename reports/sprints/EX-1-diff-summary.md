# Sprint EX-1: Diff Summary

## Summary

EX-1 adds non-mutating pilot exam-ingestion overlays for three official VWO 2025 tijdvak 1 questions and a validator for those overlays.

## Added pilot evidence

- `exam-item-overlays.json` contains the full three-record pilot package.
- `exam-answer-model-overlays.json` mirrors the correction-model portions for review.
- `exam-source-annex-overlays.json` mirrors the source-material portions and carries blocking graph/source gaps.
- `EX-1-exam-ingestion-pilot.md` summarizes the pilot and EX-2 routing.

## Validator changes

- Added `check-exam-ingestion-pilots.js` to validate the real EX-1 pilot records.
- Updated `check-exam-ingestion-contract.js` so it still validates the EX-0 contract while allowing EX-1 pilot files only after the closed GATE-EX0 authorization and the EX-1 validator exist.

## Protected surfaces

No protected reference data changed. The sprint did not edit `references/external/`, `references/machine/`, authored target exercises, owned blueprints, or lesson output.

## Closure boundary

EX-1 does not close CP-6 or Year 1. It does not authorize unit minting, target-exercise promotion, placeholder finalization, lesson-output mutation, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing output.

## Next step

Run lead review and then route to EX-2 as the human-reviewed exam-to-MTU mapping gate.
