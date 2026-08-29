# BUNDLE-LANE-CI-RELIABILITY-1 — Lead Review Corrections

Date: 2026-08-29

## Planning-review corrections

| Finding | Correction | Evidence |
| --- | --- | --- |
| Provisional plan did not satisfy the canonical schema | Replaced it with every required heading, matrix, path boundary, executable acceptance command, closure proof, rollback, and human gate | Canonical plan checker passes |
| Automatic-run state was underspecified | Defined state-transition floors; queued/running wait behavior; absence-only fallback; and fail-closed red or coordinate-mismatched runs | Shared acquisition helper and focused tests |
| Y1 coordinates did not cover Lesson-only transition | Added transition-specific ranges and explicit valid `base == head` handling | Platform-first regression asserts both ranges |
| Post-merge reporting needed complete coverage | Added one outer classification boundary preserving prior subphase, diagnostics, and completed merge records | Intermediate/final and orchestration regressions |
| Review topology was incomplete | Froze assignment, two review rounds, correction log, result, and exact-head readiness sequence | Plan and planning-review artifact |
| Queued-run timeout needed an explicit no-fallback assertion | Added a regression in which both observation windows time out with the run still present and both fallback calls remain at zero | Focused integrator suite |

## Round-1 verdict and corrections

Round 1 verdict: `REVISE`.

| Round-1 finding | Classification | Correction applied | Round-2 proof required |
| --- | --- | --- | --- |
| An automatic push run could appear after the observation timeout but before fallback dispatch; the pre-dispatch ID floor noticed it without preventing a duplicate | `core_spec_failure` | After capturing the pre-dispatch floor, perform an exact `push` recheck against the original transition floor. Any queued, running, or completed run is awaited and verified; fallback remains suppressed. Recheck failure also stops without dispatch. | Race regression models transition floor 500, initial absence, pre-dispatch floor 502, and queued push 502; result reuses automatic CI and asserts zero dispatch |
| Canonical roadmap row was validator-required but absent from the plan's explicit allowed/frozen list | `minor_carry_flag` resolved before round 2 | Added only `references/reference-team-roadmap.md` with a one-row, authority-negative registration to the exact allowed/frozen closure paths | Inspect the row and confirm no broader roadmap or authority change |

## Round-2 readiness

Round-2 exact-head recheck is authorized only after focused, integration-lane,
full-suite, scope, and sprint-bundle validation pass on the corrected substantive
head. Human merge authorization remains required after a passing recheck.
