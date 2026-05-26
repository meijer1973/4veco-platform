# Sprint GAME-UX-2: Diff Summary

Date: 2026-05-26

## Platform changes

- Added a source-controlled checkpoint engine, UI, and CSS under `engines/`.
- Added source-controlled paragraph-limited checkpoint data for
  `1.1.1 Schaarste en economisch denken`.
- Added `build-scripts/platform/build-exit-ticket-shells.js` to generate
  `shared/exit-ticket/*.js` data and paragraph-root checkpoint shells.
- Updated `scripts/deploy.js` to copy checkpoint runtime files and run the
  checkpoint shell generator before landing pages.
- Updated the landing-page generator so generated `Check` surfaces use neutral
  route language.
- Extended student-web screenshot QA to recognize checkpoint pages.
- Added focused tests for data shape, compact skill-map request, boundary
  language, internal-code leakage, generator shell dependencies, deploy
  ordering, and landing `Check` activation.
- Updated sprint logs, roadmap/version-index bookkeeping, report indexes,
  dashboards, source registry, source manifest, document inventory, and URL
  index.

## Lesson generated output

Generated through `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`:

- copied checkpoint runtime files into `shared/`;
- generated `shared/exit-ticket/1.1.1.js`;
- generated `1.1.1 Schaarste en economisch denken – exit-ticket.html`;
- regenerated the `1.1.1` paragraph landing page with `Check` visible;
- regenerated the `1.1` chapter landing page with updated route availability.

Lesson output commit: `5c47961`.

## Protected surfaces

No protected reference data changed. No hand edits were made to
`references/machine/`, `references/external/`, or generated lesson output.

The pre-existing untracked draft zip
`knowledge/exit-ticket-game-1.1.1.zip` remains untracked and was not imported,
staged, edited, moved, or deleted.

## Product-boundary summary

The checkpoint is a bounded practice/self-check surface only. It does not
authorize diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, target-exercise promotion,
CP-6 closure, Year-1 closure, `GATE-L1.7B` closure, Scale Gate 1 closure, or
broad companion scaling.
