# Sprint EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1: Plan Review Round 1

Generated: 2026-07-01

## Reviewer

Sub-agent lead reviewer: `019f1ce9-9e90-7bb0-bb79-21f9a398968e`

## Verdict

`REVISE_PLAN`

## Findings

1. Add active roadmap ledger handling. `check-sprint-bundle.js` requires the
   sprint in an active roadmap ledger, but
   `EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1` was not in
   `references/reference-team-roadmap.md`.
2. Reorder pre-implementation validation steps. The planned bundle check would
   fail before `reports/sprints/EXERCISE-AUTHORITY-HYGIENE-BUNDLE-1-baseline.md`
   exists.
3. Tighten the broad allowed path wording for selected active reference index
   files. The current repo evidence already points active UI authority at
   `references/exemplars/1.1.3-exit-ticket/`.

## Corrections requested

- Add `references/reference-team-roadmap.md` to allowed paths, outputs, and
  procedure.
- Add the active roadmap row as planned `no`, and require marking it `yes`
  before `check-sprint-bundle --complete`.
- Move planned/active bundle validation after baseline creation.
- Replace the broad active-reference-index allowance with exact paths.

## Owner decision

No owner decision was required. The reviewer confirmed the canonical exemplar
direction is supported by current UI references, Golden fixture roots are
classifiable, and `knowledge/exit-ticket-game-1.1.1.zip` is tracked and
hash-checkable without editing the ZIP.
