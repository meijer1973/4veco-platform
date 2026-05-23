# GAME-UX-1 Lead Review Corrections

Date: 2026-05-23

Round-1 verdict: FAIL

## Correction Summary

Applied the required round-1 corrections:

- replaced `Meesterschap!` with `Mooi geoefend!`;
- replaced `Doel al behaald` with `Route al geoefend`;
- replaced related visible goal language with `Oefenroute`, `route`, and
  practice-progress wording;
- updated skill-tree UI harness/template visible labels from `Voltooid` and
  `beheerst` to `Geoefend` and `geoefend`;
- added `engines/tests/skilltree-visible-copy.test.js` to prevent regression of
  the banned visible strings;
- updated the GAME-UX-1 result log to explicitly defer mobile, dark-mode,
  screenshot, and keyboard focus-order checks to lesson L1.7C or the first
  lesson-side regeneration/inspection sprint that consumes this runtime.

## Correction Validation

Passed:

- `npm.cmd test -- --runInBand engines/tests/skill-map-engine.test.js engines/tests/skilltree-visible-copy.test.js engines/tests/skilltree-engine.test.js engines/tests/skilltree-data.test.js`
- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js GAME-UX-1`

Focused string scan returned no matches for:

- `Meesterschap`
- `Doel al behaald`
- `Doel behaald`
- `Voltooid`
- `beheerst`

## Boundary Check

No protected reference mutation, external-source mutation, machine-reference
mutation, unit minting, target-exercise promotion, lesson-output mutation,
CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, or student-facing product use was authorized or performed.

## Recheck Request

Run the round-2 recheck against the corrected GAME-UX-1 bundle and confirm
whether the final verdict is `PASS`, `PASS WITH FLAGS`, or `FAIL`.
