# Sprint TASK-CONTEXT-SPEC-1: Diff Summary

Generated: 2026-06-03

## Summary

Added a context-contract-only sprint for shared task-shell contexts. The sprint
defines the schema, fixture, checker, planning/review records, result metadata,
and roadmap closure for `TASK-CONTEXT-SPEC-1`.

## Platform changes

- Added `build-scripts/sprints/check-task-context-spec1.js`.
- Added `reports/json/task-context-spec1-contract.json`.
- Added sprint plan, baseline, planning review, context-contract report,
  lead-review assignment, lead-review round 1, correction log, lead-review
  round 2, result, diff summary, and command logs under `reports/sprints/`.
- Added plan/result metadata under `references/data/sprints/`.
- Updated `references/reference-team-roadmap.md` to mark the sprint complete.
- Refreshed GitHub-facing maps, URL index, and internal dashboard after
  closure.

## Lesson changes

- Updated `../4veco-lessen/lessen-team-roadmap.md` to mirror the sprint
  closure.

## Protected surfaces

No protected reference data changed. No files under `references/machine/` or
`references/external/` were edited.

No source data, generated Book 1 lesson output, target-exercise registry,
candidate store, PV projection, PV machine-promotion output, runtime task shell,
or generated lesson surface changed.

## Validation

The sprint is validated by:

- `check-task-context-spec1.js`
- sprint plan and bundle validators
- platform Jest suite
- scope-language checker
- report JSON validator
- roadmap version index checker
- lead-review substance checker
- result and complete-bundle validators
- URL index check
- platform and lesson diff checks
