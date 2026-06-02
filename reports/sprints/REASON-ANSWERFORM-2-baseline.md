# Sprint REASON-ANSWERFORM-2: Baseline

Generated: 2026-06-02

## Plan reference

Plan: `reports/sprints/REASON-ANSWERFORM-2-plan.md`

## Current reasoning route state

`REASON-STD-1`, `REASON-ADOPT-1`, and `REASON-PLAY-1` are closed. The generated
Book 1 reasoning route is playable for modes 0, 1, 3, and 5, with modes 0, 1,
and 3 using shared `step_ordering` task-shell interaction and mode 5 using
shared `structured_reasoning` self-check. The route remains practice-only.

Carried flags from `REASON-PLAY-1` remain active:

- dual feedback is coherent but visually dense;
- mobile route panel can sit too low after a long checked task;
- dark route card is readable, with broader theme consistency still flagged;
- compact move/remove controls remain visually terse;
- mode 3 is an ordered-chain bridge, not full visual flow-diagram construction;
- modes 2 and 4 remain held/refactor-scoped;
- usability-agent evidence reviewed generated proof/screenshots rather than
  fresh live-clicking.

## Answer-form baseline

`MTU-H4C` added `A96`, `A97`, `A98`, `A99`, `A80`, and `A81` through the
reviewed reference CLI. `A81` is a source-use modifier and requires an
underlying answer form. `A97`, `A98`, and `A99` are distinct explanation
answer-form units.

Generator readiness still marks `A80`, `A81`, and `A96`-`A99`
generator-blocked/non-interactive for skill-tree exposure. No student-facing
skill-tree route may expose those units as implemented generator skills.

## Data integrity notes

Protected reference data in `references/machine/` and `references/external/`
is not in scope for this sprint. The sprint may read the MTU catalog and
generator-readiness report, but it must not mutate protected references.

The sprint must not edit `source-data/book-1/reasoning/*.csv`,
`source-data/book-*/exit-ticket/*.json`,
`references/authored/course-target-exercises.json`, or
`references/data/exam-ingestion/answer-skill-candidates.json`.

## Target-equivalent boundary

This sprint starts with no authorization for target-equivalent reasoning proof,
completion language, diagnostics, adaptive routing, mastery, sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or product-wide use.

## Required opening checks

- `A81` must be treated as modifier plus underlying answer form.
- `A97`, `A98`, and `A99` must remain separate scaffolds.
- Internal MTU codes may appear in evidence/checker JSON but not in
  student-facing route text.
- Modes 2 and 4 must not be silently claimed as shared-shell unified.
- Generated lesson output may change only through `scripts/deploy.js`.
