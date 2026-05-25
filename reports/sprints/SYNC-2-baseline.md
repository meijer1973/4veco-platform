# Sprint SYNC-2: Baseline

## Plan reference

`reports/sprints/SYNC-2-plan.md`

## Current state

GATE-EX5 is the active platform human-review gate. Lesson L2.0 is active as
foundation hardening, while broad companion scaling remains blocked.

The lesson roadmap currently records L1.7B as one paused row that contains both
completed contract work and paused implementation. The platform roadmap tracks
that state through `LESSON-SCALE-1`, but it does not yet name `GAME-UX-2` as
future platform implementation support for a source-controlled exit-ticket
checkpoint engine.

## Baseline findings

- L1.7B is overloaded: contract completion and paused MVP implementation share
  one row.
- Scale Gate 1 can be misread as satisfied after the L1.7B contract, even
  though the safe MVP and review gate do not exist.
- `Check` remains hidden after L1.7D, but the reciprocal activation rule is not
  explicit enough.
- L2.0 mentions game-row MVP limits, but does not explicitly require
  fix-before-scale / carry / defer classification for L1.7C carried flags.
- Platform support for the future exit-ticket checkpoint engine is implicit,
  not a named `GAME-UX-2` lane.

## Data integrity notes

No protected reference data has been changed at baseline. SYNC-2 must not
hand-edit `references/machine/` or `references/external/`, must not mutate
machine or external source data, and must not touch generated lesson output.
The unrelated `knowledge/exit-ticket-game-1.1.1.zip` is present as an
untracked local file and must remain unstaged and untouched.

## Stop conditions checked

- Stop if prototype import or extraction is required.
- Stop if generated lesson output would need mutation.
- Stop if protected reference data or external source records would need
  mutation.
- Stop if roadmap wording authorizes diagnostics, adaptive routing, mastery,
  sequencing, summative use, student-facing AI, PV projection, PV machine
  promotion, or student-facing product use.
