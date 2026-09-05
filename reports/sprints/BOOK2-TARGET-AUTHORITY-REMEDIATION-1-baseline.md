# Sprint BOOK2-TARGET-AUTHORITY-REMEDIATION-1: Baseline

## Plan reference

Plan: `reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-plan.md`

## Repository state

- Platform worktree: `C:\wt\audit target excercise\4veco-platform`
- Platform branch: `codex/book2-target-exercise-audit-20260904`
- Task/owner claim: `BOOK2-TARGET-EXERCISE-AUDIT-20260904` / `codex-root`
- Platform HEAD and `origin/main`:
  `e5f89e730d65c4131d7dd09f805f0db94690e8e6`
- Lesson worktree: `C:\wt\audit target excercise\4veco-lessen`
- Lesson HEAD and `origin/main`:
  `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- Both worktrees were clean, non-detached, zero commits ahead/behind, and
  passed repository safety checks before source edits.

## Exact source identities

| Surface | Baseline identity |
|---|---|
| Audit PDF | SHA-256 `8dbf513e7acf8da0967d4906cc6f09875cb4de211113fb52fa6a86559f2d836c` |
| Target registry | Git blob `a28d1182bd69a7edd11c8c6ae1eb0a88a689a2fc`; SHA-256 `31391cb0fae8d7ec50a54171a678a9e59f0211e35d6f84c76cde517c8e6792b8` |
| Book 2 outline file | SHA-256 `bcb08786e45b376715c17f0f9976e9207afb9f0e333c4ac2588fffc55bbf7cf3` |
| Book 2 outline semantic authority | SHA-256 `69d803d2786e97bbd7519d2feed3ee29b79751b00a3c8a440432621927a13cde` |
| Book 2 metadata file | SHA-256 `51c41373d45930ab64fd37faae6d5bd84eaae4278f4a61b475fe45e04913fe8b` |

## Authority and scope observations

- Issue #229 authorizes all-twelve platform target implementation and a draft
  PR, but forbids merge and Phase A lesson/output writes.
- All twelve `target_authority_repair` currentness checks passed.
- `course-target-exercises-v5` passed: 54 total, Book 2 count 12.
- Part A contract check passed; its mutation suite passed 41/41.
- Book-outline currentness mutation suite passed 89/89 through `npx`.
- The package-script form initially could not find a local `jest` executable
  because dependencies were not installed in this new worktree; the identical
  test command through `npx` passed. Exact-head closure will use the normal
  dependency-installed/full-CI route.
- Blueprint pedagogical-boundary validation passed.

## Confirmed `Ei` conflict

- CvTE 2026 D1.8: `inferieure, normale en luxe goederen`.
- `references/authored/economie-terminologie.md`: the same three-way wording.
- `references/machine/begrippen.json#inkomenselasticiteit`: `Ei < 0 =
  inferieur`, `0 < Ei < 1 = normaal`, `Ei > 1 = luxe`.
- `references/machine/micro-teaching-units.json#D11`: the same three-way
  classification.
- `A17` alone says `0 < Ei < 1 = noodzakelijk goed`; it is the drift to repair
  through the unit CLI.

## Data integrity notes

`references/machine/` and `references/external/` are protected reference-data
surfaces. External mirrors remain read-only. The authorized A17 correction is
the only machine-unit semantic change and must be made through
`build-scripts/references/unit-update.js`; all other machine units and every
non-Book-2 target record are hash-pinned to the platform baseline.

## Baseline stop verdict

No stop condition is active. Source implementation remains blocked only until
the required independent planning review has been completed and its blockers,
if any, have been corrected.
