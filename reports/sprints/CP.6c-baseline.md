# Sprint CP.6c: Baseline

## Plan reference

- Plan: `reports/sprints/CP.6c-plan.md`
- Plan metadata: `references/data/sprints/CP.6c.plan.json`

## Baseline date

2026-05-20

## Current roadmap state

`CP.6c Year-1 MTU Backfill Classification` is the active remediation lane after CP.6b. CP.6b completed target-exercise review/design evidence, but it did not classify MTU backfill flags or authorize unit mutation.

## Source baseline

Active source files read before implementation:

- `references/reference-team-roadmap.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/data/sprints/CP.6b-target-exercise-review.json`
- `references/machine/micro-teaching-units.json`
- `references/data/unit-design-status/unit-design-status-overlay.json`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-d04-mutation-log.md`
- `reports/review-gates/GATE-CP5-D04-resolution/S9a-stale-reference-audit.md`

## Actual current MTU state

The live MTU registry currently contains explicit units that earlier reports could have treated as missing if they were read stale:

- `A45 P-Q grafiek tekenen uit tabel`;
- `A46 Waarden aflezen en interpoleren in P-Q grafiek`;
- `A47 Collectieve vraag uit tabellen optellen`;
- `A48 Collectieve vraagfunctie algebraisch optellen`;
- `A49 Aanbodcurve tekenen met economenassen`;
- `A51 Overschot en tekort bij niet-evenwichtsprijs berekenen`.

The D04 goods-classification record is deprecated and retained only as historical/stale-reference context. CP.6c must not revive D04 as an active standalone mapping.

## Data integrity notes

No protected reference data has been changed at baseline. `references/machine/` and `references/external/` remain untouched. CP.6c must also leave `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, and `../4veco-lessen` unchanged.

CP.6c starts from nine REF-CT1 backfill candidates. The sprint may classify them only; it may not mint units or run CLI mutation.

## Stop conditions visible at baseline

- Stop if any classification is copied from a stale report without checking the live registry.
- Stop if deprecated `D04` is treated as an active final mapping.
- Stop if any candidate is mutated into `references/machine/`.
- Stop if CP.6c tries to resolve CP.6d graph-heavy evidence or CP.6e `1.1.3` Part A re-review.
- Stop if any artifact claims protected mutation, unit minting, CP-6 closure, Year-1 closure, target-exercise promotion, placeholder finalization, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.
