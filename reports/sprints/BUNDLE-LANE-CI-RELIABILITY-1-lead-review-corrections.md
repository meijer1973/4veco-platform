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

## Owner review correction after exact-head readiness

Owner review at terminal head `a28304bcc061edbac47828da0c33b5952fc0de7e`
returned `REQUEST CHANGES`: unexpected GitHub-read exceptions after a successful
merge invocation could escape the integration core before the local merge array
was returned, losing irreversible-state diagnostics.

| Owner finding | Classification | Correction applied | Renewed proof |
| --- | --- | --- | --- |
| Post-merge exceptions could bypass structured terminal reporting | `core_spec_failure` | Created the execution journal in the outer wrapper and passed it into the fallible core; successful direct merge invocation is recorded before `fetchMergedPr`; observed completions are retained before every later operation; exceptions return `merged_but_postmerge_verification_failed` with subphase, error, invocations, completed merges, and unknown outcomes | Four adversarial focused regressions cover merge observation throw, state throw after one merge, state throw after two merges, and CLI JSON retention |
| Dry-run and pre-merge work must not be mislabeled irreversible | `regression_risk` | Irreversible detection excludes dry-run records and requires a real invocation or observed merge commit; pre-merge exceptions still escape unchanged | Existing dry-run, partial-resume, auto-merge, pre-merge, retry, no-merge, and preparation tests remain green |

Corrected substantive commit:
`8e41a6af515e0a911372572ac465a9299826180a`.
