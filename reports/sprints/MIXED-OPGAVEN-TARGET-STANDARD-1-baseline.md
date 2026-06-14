# Sprint MIXED-OPGAVEN-TARGET-STANDARD-1: Baseline

## Plan reference

Plan: `reports/sprints/MIXED-OPGAVEN-TARGET-STANDARD-1-plan.md`

## Source state

Before this sprint, `2.1.4` in
`references/authored/course-target-exercises.json` remains
`record_status: placeholder_needs_review` with
`target_exercise.placeholder: true`.

The active platform blueprint `references/owned/course-blueprint-v5.md` also
lists `2.1.4` as `placeholder_needs_review` and says the count-bearing
`gemengde_opgaven` paragraph introduces no new theory but requires a reviewed
integration target exercise before final curriculum-quality claims.

`B2-2.1.4-HARDEN` accepted the student-facing repository implementation as a
consolidation-only mixed-practice section with `opgaven` and `antwoorden`, no
official theory paragraph, no new economic theory, and a carried target
placeholder flag.

## Validator state

The current `scripts/check-course-target-exercises-v5.js` checker rejects
`record_status: reviewed_final` for all `gemengde_opgaven` records during
Phase A. Any implementation that promotes `2.1.4` must update this validator
and tests so reviewed-final mixed records are allowed only when they satisfy
the new mixed-target standard.

## Data integrity notes

This sprint is authorized to change protected reference data only for the
2.1.4 target record and aligned blueprint/status evidence after the standard
and audit support promotion. It must not edit `references/machine/` or
`references/external/`.

Generated lesson output is unchanged at baseline. Lesson output may be
regenerated only if the 2.1.4 source markdown needs a scoped target-evidence
repair.

## Starting worktree state

Platform and lesson worktrees were clean before this sprint packet was created.

## Expected retained boundaries

Chapter 2.2 remains outside scope. No diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, broad companion scaling, or student/product-use
authorization is created by this sprint.
