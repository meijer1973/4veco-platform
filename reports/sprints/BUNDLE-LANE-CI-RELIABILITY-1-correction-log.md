# Bundle Lane CI Reliability — Correction Log

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

## Lead-review corrections

Pending independent structural round 1.
