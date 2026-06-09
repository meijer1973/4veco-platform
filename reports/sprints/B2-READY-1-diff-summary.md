# Sprint B2-READY-1: Diff Summary

## Summary

Added the active textbook-production roadmap and created the B2-READY-1 readiness sprint packet. Updated sprint tooling so a sprint ledger row in any active roadmap listed by the roadmap-version index can satisfy planned-bundle validation.

## Roadmap changes

- Added `docs/roadmaps/textbook/textbook-production-roadmap.md`.
- Added `docs/roadmaps/textbook/sprint-ledger.md`.
- Added `docs/roadmaps/textbook/textbook-end-state.md`.
- Added the textbook-production roadmap to the active roadmap index.
- Added the Book 2 print series: `B2-READY-1`, `B2-2.1-A`, and `B2-2.1-RETRO`.

## Sprint evidence changes

- Added the B2-READY-1 plan, baseline, readiness brief, result stub, diff summary, command log, and sprint metadata.
- Recorded the primary readiness finding: `2.1.4` is placeholder-backed, while 2.1.1 through 2.1.3 are migrated targets needing v5 review.
- Added lead-review assignment, round-1, corrections, and round-2 artifacts after Hypatia returned PASS WITH FLAGS.
- Marked `B2-READY-1` complete and moved `B2-2.1-A` to the active row in the textbook sprint ledger.

## Tooling changes

- `build-scripts/sprints/check-sprint-bundle.js` now reads active roadmap paths from `docs/roadmaps/roadmap-version-index.json`.
- `build-scripts/sprints/check-scope-language.js` now includes active operational roadmaps from the roadmap-version index during active-scope scans.

## Protected surfaces

No protected reference data changed. No edits were made under `references/machine/`, `references/external/`, target-exercise source records, generated lesson output, or `../4veco-lessen/`.
