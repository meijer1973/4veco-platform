# Sprint BLUEPRINT-BOOK1-EDITION-BOUNDARY-1: Diff Summary

Compared with: `origin/main` at `636991ce7aa400494bccf78f22bba92fa5110ae7`
Substantive source head: `bb21d53e5abb96693e3106924d408c4596c8b15c`

## Owned policy and metadata

- Added the pedagogical-boundary source and made its compatibility with the
  Book 2+ Part A contract explicit.
- Kept both exact normative metadata pointers and added fail-closed policy
  flags without changing target authority.
- Preserved v5 counts/total, v6 11-book 4+4+3 route and count model, Book 11
  9+4 role, Book 1 freeze, and Book 2 production priority.

## Operational surfaces

- Added concise inheritance pointers to the Part A build guide, exercise
  builder, textbook workflow, and teacher-learning-quality review mode.
- Kept `skills/econ-exercise-builder.md` as the operational sequence and target-
  coverage authority; no duplicate full policy was introduced.

## Enforcement

- Added one platform-only source-contract checker and 32 focused mutation
  tests.
- Wired the checker into `package.json`, platform CI, and GitHub discovery.
- The checker does not scan Book 1 or lesson output.

## Evidence

- Added schema-valid plan/baseline/result metadata, command evidence,
  independent planning/teacher/lead reports, and roadmap state.
- Refreshed generated agent indexes, dashboard reports, and URL index where the
  repository generators required it.

## Protected surfaces

- No files in `references/machine/` or `references/external/` changed.
- `references/authored/course-target-exercises.json` and all other target,
  candidate, MTU, and PV registries are unchanged.
- The sibling lesson repository and all Book 1/Book 2 student-facing files are
  unchanged.
- No companion/web output, book count, book role, assessment, v6 route, merge
  authority, or Issue #223 implementation is included.
