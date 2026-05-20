# Sprint CP.6b: Baseline

## Plan reference

- Plan: `reports/sprints/CP.6b-plan.md`
- Plan metadata: `references/data/sprints/CP.6b.plan.json`

## Baseline date

2026-05-20

## Current roadmap state

`CP.6b Year-1 Target-Exercise Review` is the active remediation lane after CP.6a. CP.6a plus lesson-team L-CP6A fixed the Book 1 Chapter 1.3 source/lesson mismatch with carried conditions, but target-exercise evidence remains open.

## Source baseline

Active source files read before implementation:

- `references/reference-team-roadmap.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/human-interview.md`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/gate-routing-decision.json`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- `references/data/sprints/CP.6a-lesson-side-recheck.json`
- `reports/reference-planning/CP.6a-lesson-side-recheck.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- `../4veco-lessen/archive/sprints/L-CP6A/L-CP6A-handoff-to-references.md`

## Actual current target-exercise state

The active target-exercise registry currently has 54 count-bearing records with Book counts guarded as 12/12/14/16.

Book 1 has:

- 12 active-v5 count-bearing records;
- 9 records with `record_status: migrated_from_v4_needs_v5_review`;
- 3 records with `record_status: placeholder_needs_review`;
- 0 records with `record_status: reviewed_final`.

The three placeholder records are:

- `1.1.4 Gemengde opgaven: economisch denken en rekenen`;
- `1.2.4 Gemengde opgaven: vraag`;
- `1.3.4 Gemengde opgaven: aanbod en marktevenwicht`.

## Data integrity notes

No protected reference data has been changed at baseline. `references/machine/` and `references/external/` remain untouched. CP.6b must also leave `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, and `../4veco-lessen` unchanged.

CP.6b starts from a non-final target-exercise state. The sprint may produce review/design artifacts only; it may not promote migrated records, finalize placeholders, close CP-6, close Year 1, or authorize student-facing/product use.

## Stop conditions visible at baseline

- Stop if any migrated target-exercise record is treated as `reviewed_final` from migration evidence alone.
- Stop if a placeholder design is written back into the registry or counted as final coverage.
- Stop if CP.6b tries to resolve CP.6c MTU backfill classification, CP.6d graph-heavy evidence, or CP.6e `1.1.3` Part A re-review.
- Stop if any artifact claims protected mutation, unit minting, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.
