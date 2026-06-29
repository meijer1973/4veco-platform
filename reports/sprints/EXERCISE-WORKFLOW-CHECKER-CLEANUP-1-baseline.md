# Sprint EXERCISE-WORKFLOW-CHECKER-CLEANUP-1: Baseline

Generated: 2026-06-29

## Plan reference

Plan: `reports/sprints/EXERCISE-WORKFLOW-CHECKER-CLEANUP-1-plan.md`

## Baseline Inputs

- Platform branch:
  `codex/exercise-workflow-checker-cleanup-1-20260629` from
  `origin/main` `8498bd83b3e447ca0fbdb663057b28659c2c5a2f`.
- Lesson repository `../4veco-lessen` is clean at `origin/main`
  `6ecc935ef93de285b78850ab2f24b7e37867ad6c`.
- Current platform source files under `source-data/book-1/exit-ticket/` are:
  `1.1.1-exit-ticket.json`, `1.1.1-korte-check.json`,
  `1.1.2-exit-ticket.json`, `1.1.2-korte-check.json`,
  `1.1.3-exit-ticket.json`, and `1.1.3-korte-check.json`.
- Current generated lesson shared files under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket/`
  are the matching suffixed JavaScript files.
- The unsuffixed legacy source files `1.1.1.json`, `1.1.2.json`, and
  `1.1.3.json` are absent from the current platform source directory.

## Baseline Failures

- `node build-scripts/sprints/check-standard-exercises1-coverage.js` fails
  because it requires missing `source-data/book-1/exit-ticket/1.1.2.json`.
- `node build-scripts/sprints/check-task-shell-ux2.js` fails because it
  requires missing `source-data/book-1/exit-ticket/1.1.2.json`.
- `node build-scripts/sprints/check-l1-7b-q2-implementation.js` fails because
  it requires missing `source-data/book-1/exit-ticket/1.1.1.json`.
- `node build-scripts/sprints/check-l1-7b-q2-copy.js` fails because it
  requires missing `source-data/book-1/exit-ticket/1.1.1.json`.
- `node build-scripts/sprints/check-l1-7b-q2-d31-struct.js` fails because it
  requires missing `source-data/book-1/exit-ticket/1.1.1.json`.
- `node build-scripts/sprints/check-check-short-exit1-inventory.js` fails
  because it requires missing `source-data/book-1/exit-ticket/1.1.1.json`.
- `node build-scripts/sprints/check-math-ux2-route-output.js
  "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` fails because it
  forbids the now-valid `1.1.2` exit-ticket page.
- `node build-scripts/sprints/check-reason-ux2-route-output.js` passes but
  still guards old unsuffixed source filenames, so it no longer proves the
  current split-source boundary.

## Current Evidence Gap

Generated lesson output and current platform source data agree on the split
source model. The gap is the active evidence and validation layer: live
checkers, active report JSON, and at least one review-packet checker still cite
old unsuffixed source files as current evidence.

## Data integrity notes

No protected reference data changed during baseline capture.
`references/machine/` and `references/external/` remain unchanged. The baseline
does not mutate `source-data/`, generated Book 1 lesson output,
target-exercise registries, candidate storage, PV outputs, product routes,
diagnostics, adaptive routing, mastery/sequencing, Scale Gate 1, or
student/product-use surfaces.

## Stop Condition Review

Implementation may proceed only after plan review passes. Any repair that
requires source-data mutation, generated lesson output edits, engine behavior
changes, protected reference mutation, or product-authority changes must stop
and return for a new plan.
