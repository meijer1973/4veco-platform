# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Result

Generated: 2026-08-31

Status: reopened after an exact-head `CHANGES REQUIRED` review. The two active
visual-fading contradictions and Dutch no-device regression gap are repaired
and pass local validation. New substantive teacher and lead reviews, updated
final evidence, exact-final-head CI, and human-review routing are still required.

## Plan reference

Plan: `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-plan.md`

## Summary

The platform now defines one non-retroactive Book 2+ authoring contract for a
fully printed, paper-only Part A exercise route. Every necessary explanation,
retrieval task, scaffold, independent task, and target preparation must be in
the printed paragraph; no website, device, companion page, Part B route, or
other digital support may be required or advertised in student copy.

The printed exercise block has exactly seven canonical `##` headings. Its
compact summary is a non-heading block of at most five points, placed after the
worked example and before Startopgaven. Student copy uses exactly the short
route `Startopgaven → Zelfstandige oefening → Doeloefening` and the one-line
printed-support direction to make Begeleide inoefening first when extra help is
needed. Internal Part A/Part B terminology remains confined to internal
guidance.

The operational contract starts from approved lesson goals and target
operations, requires a same-operation simpler worked example, always authors
and prints guided practice while making only student use optional, and fades
representations without adding graph/table production absent from the target.
The core route must fit an actual whole-lesson calculation of at most 55
minutes. Bonus work requires cognitive flexibility, and closing review remains
short, accessible, cumulative, and free of new theory.

A CI-wired source checker validates all 10 active platform guidance surfaces,
the exact heading hierarchy and order, route and summary placement, paper-only
support, Part A/Part B boundaries, backward alignment, differentiation,
timing, bonus/review roles, and Book 1 non-retroactivity. The focused suite
contains all 13 owner-required negative scenarios plus two
positive-plus-contradiction probes. No Book 2 paragraph or lesson output was
produced.

## Acceptance test results

- Revision planning audit: `PASS` after its preserved `REVISE` and resolution.
- Earlier renewed teacher-learning-quality review: preserved `PASS`, 12/12,
  but superseded for closure because later active-guidance changes require a
  new substantive teacher review.
- Earlier renewed lead review: preserved `REVISE`; its evidence-only recheck
  path is superseded because the exact-head review required substantive source
  and checker changes.
- Contract checker: `PASS` across 10 active platform source surfaces.
- Focused contract/lane suites after the exact-head fixes: 64/64 tests passed.
- Full local platform suite after the exact-head fixes: 106 suites and 1,621
  tests passed; 6 suites and 8 tests skipped; exit code 0.
- Historical exact-head GitHub CI run `33371854917`: `SUCCESS` at reviewed head
  `15106b64b7b80d1e9c048870da0de9943d6460fd`; the substantive repair requires
  a new exact-final-head run after review evidence is published.
- Current main `bb212502d2074c9936da30b8d6e6914ba6319dfe` is an ancestor of the
  branch through integration merge `84bfd7eb1f572fb8028bde73aa08f34904c597c1`.
- Detached lesson checkout: clean and unchanged at
  `f09fd6e88edc5049b026b16b0158e7e188091d2d`.

## Changed files

The implementation aligns the didactic rationale, exercise authoring,
paragraph/PDF builders, review guidance, teacher-quality agent, build guide,
and paragraph-lane workflow. It adds the fail-closed Part A contract checker
and focused mutation tests, wires the checker into platform CI, and keeps
generated dashboard/index outputs correctly classified for shared-lane
validation.

The owner-correction closure additionally preserves the renewed planning,
teacher, and lead review history; records each resolution/recheck separately;
and refreshes the canonical result, diff summary, roadmap state, command log,
navigation, dashboard, and generated indexes.

The exact-head correction removes unconditional visual-to-text-only guidance
from `econ-didactiek` and the paragraph checklist, checks all five fading
surfaces, adds Dutch printed-device/digital mutations, and continuously
renumbers the paragraph checklist.

## Data integrity notes

No protected reference data changed. Nothing under `references/machine/`,
`references/external/`, lesson source/output, Book 1, Book 2 paragraph output,
source data, target registries, candidate storage, or PV was changed. Part B
implementation was not redesigned. The detached `4veco-lessen` checkout
remained read-only and clean.

## Open follow-ups

1. Obtain new substantive teacher and lead review PASS verdicts and publish
   synchronized final evidence with green exact-final-head CI.
2. Human owner review and approval remain required before any merge or adoption.
3. A later explicitly authorized sprint must author and render any Book 2
   paragraph; this contract does not certify an unwritten paragraph.
4. Do not merge, alter Book 1, redesign Part B, or begin Book 2 production from
   this task.

## Rollback instructions

Before merge, close PR #219 and delete only this branch/worktree. After an
authorized merge, revert the commits introduced by the PR. No lesson rebuild,
Book 1 restoration, protected-reference rollback, or source-data repair is
required because those surfaces were not changed.
