# Sprint BLUEPRINT-BOOK1-EDITION-BOUNDARY-1: Baseline

Captured: 2026-08-31
Mode: platform-only, no lesson writes

## Plan reference

`reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-plan.md`

## Repository state

- PR #222 branch before repair: `b11c9f603599e95e2ff7abae3eb8e01398538d69`.
- Original base: `e6103d3127780d59b36410c2dbccf86314b10dd1`.
- Required current-main baseline: `636991ce7aa400494bccf78f22bba92fa5110ae7`.
- Current-main merge on the task branch: `89a497309822b069e784a3833c1e71fe3616abd7`.
- Governance freshness against `origin/main` passes with no differing governance files.
- PR #222 is open and draft. Its only pre-repair CI run failed because generated
  GitHub-agent indexes were stale.

## Original payload

The original PR changed six files:

1. `references/owned/README.md`
2. `references/owned/course-blueprint-pedagogical-boundaries.md`
3. `references/owned/course-blueprint-v5.meta.json`
4. `references/owned/course-blueprint-v6-three-year.meta.json`
5. `reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-plan.md`
6. `reports/sprints/BLUEPRINT-BOOK1-EDITION-BOUNDARY-1-result.md`

The policy already distinguishes terminal target, anticipatory preview, and
prerequisite mastery. Both metadata files already point to the policy and set
`preview_is_mastery` to `false` and
`later_formal_treatment_still_required` to `true`. Book counts, roles, target
registry, Book 1 files, and lesson output were not changed.

## Blocking deviations

1. The branch predates merged PR #219 and therefore lacks an explicit
   compatibility rule with the active Book 2+ Part A contract.
2. The policy does not explicitly forbid a preview from receiving `Covered`
   status in the lesson-goal/target-operation table.
3. It does not enumerate the Part A stages where an untargeted independent
   operation is forbidden: worked example, current-content Start check, guided
   practice, independent practice, and doeloefening.
4. It does not explicitly protect the whole-lesson 55-minute equation from
   preview displacement.
5. It says Book 2 Chapter 2.1 teaches formal costs/revenue/profit, but does not
   explicitly say §2.1.1 formal teaching cannot be shortened because Book 1
   supplied a formula.
6. Normal Book 2 author/reviewer entry surfaces do not point to this policy.
7. No executable policy guardrail or mutation suite protects the metadata,
   compatibility clauses, counts/roles/registry, or active pointers.
8. The sprint evidence chain is incomplete, the result has a stale local-
   validation limitation, and generated indexes are not current for the PR.

## Existing strengths to preserve

- The policy rejects target-only minimalism while preserving the exercise-first
  hierarchy.
- The three status definitions are clear and pedagogically useful.
- Consumer surplus, step functions, supplied formulas, and normal/inferior
  terminology are bounded examples rather than automatic terminal targets.
- Book 1 first edition is explicitly frozen and issue #221 owns second-edition
  repairs.
- Later Book 2 formal instruction remains required.
- No count, book-role, assessment, v6 route, target-registry, companion, or
  lesson-output mutation is authorized.

## Required target state

The repaired policy must coexist with PR #219 as follows:

- `skills/econ-exercise-builder.md` remains the operational Book 2+ Part A
  contract for sequence, target-operation coverage, paper route, and timing.
- The owned blueprint policy determines whether incidental earlier material is
  merely `seen` or `supported`, never automatically `independently required`
  or `mastered`.
- A preview can support explanation/context, retrieve already-taught
  prerequisites, or offer optional perspective, but cannot manufacture target
  coverage or add a new independent operation without reviewed goal/target
  authority.
- Later formal teaching, especially Book 2 §2.1.1, remains complete.

## Separate Issue #223 boundary

Issue #223 may inspect Book 2 §2.1.1, identify the target-authority conflict,
map the seven-section route, and model a 55-minute lesson. It may not modify or
publish lesson output until PR #222 is merged and post-merge CI is green. No
Issue #223 lesson file belongs in this PR.

## Data integrity notes

No protected reference data in `references/machine/` or
`references/external/` is changed. The active target registry, counts, book
roles, assessment structure, v6 route, Book 1 output, and sibling lesson
repository are read-only invariants for this sprint.
