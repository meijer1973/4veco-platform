# Lead Review Summary

Sprint: `BUNDLE-LANE-CI-RELIABILITY-1`
Round: lead review round 1
Date: 2026-08-29
Reviewer: `/root/residual_bridge_lead_review`
Base commit: `11c7a0286776064a694efa4e3cc9e91b4e62fa5c`
Reviewed commit: `ce4f77d710431b29c4d2a1d589ebb2942953cf1d`

## Scope

Evidence inspected: `build-scripts/review-gates/integrate-authorized-bundle.js`,
`build-scripts/review-gates/integrate-authorized-bundle.test.js`,
`docs/review/pr-integration-lane-policy.md`, sprint plan/reports, every changed
path, focused and integration-lane tests, syntax/diff checks, and an independent
adversarial state-machine invocation.

The task is the trusted coordinated-bundle automatic-push-first, exact-input
fallback, transition validation, and post-merge reporting repair on PR #217.
PR-readiness suitability at the reviewed substantive head is no. Human merge
authorization remains required after correction and re-review.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
| --- | --- | --- | --- |
| Scope and authority | Independent Git diff inspection | No forbidden or product/Y1/PR208 changes | PASS |
| CI-acquisition state machine | Source inspection and adversarial invocation | No duplicate dispatch when a push run exists | FAIL |
| Workflow arguments and ranges | Source and focused tests | Full SHAs, exact head, ancestry/identity | PASS |
| Exact-pair evidence | Source and focused tests | Wrong/red/stale coordinates rejected | PASS |
| Post-merge reporting | Source and focused tests | Subphase, diagnostics, merge records retained | PASS |
| Delta-required dry run | Existing regression and policy | Fail-closed exception preserved | PASS |

## Consolidated Verdict

Verdict: REVISE

One core race permits a duplicate manual fallback after a qualifying automatic
push run appears. Passing tests at this head did not exercise that state.

## Blocking Findings

One blocking finding exists. After initial observation returns timeout with
`run:null`, `acquirePlatformMainCi` captured only the newest numeric run ID and
dispatched without rechecking its event/status. Independent reproduction used
transition floor `500`, pre-dispatch run `502`, and observed one fallback
dispatch. This violates the policy that queued/running automatic CI must never
cause a duplicate.

Required correction: perform an exact-head `push` recheck against the original
transition floor after capturing the fallback floor. Await and verify or fail
closed when a run is found; dispatch only after proven absence. Add the exact
race regression with zero fallback calls.

## Specialist Findings

No visual, learning-quality, student-experience, accessibility, or textbook
specialist review applies because no student-facing or rendered artifact
changed. Scope inspection found no workflow definition, Lesson, product,
engine, source-data, Y1 evidence/checker, protected reference, or PR #208
artifact change.

## Finding Classification

| Finding | Classification | Blocks | Does not block | Proof required to close |
| --- | --- | --- | --- | --- |
| Pre-dispatch race can duplicate a newly queued/running automatic push run | `core_spec_failure` | PR readiness, closure, and merge authorization | Sprint planning and completed PR #208 | Exact-event recheck, zero-dispatch race regression, focused/full green evidence |
| Roadmap row outside enumerated plan path | `minor_carry_flag` | Silent evidence-tail acceptance | Narrow authority-negative row does not affect product | Add canonical roadmap path to corrected allowed/frozen scope or remove row |

## Test Evidence

- Focused integrator: 1 suite, 104 tests passed.
- Integration lane: 10 suites, 225 tests passed.
- JavaScript syntax and `git diff --check`: passed.
- Sprint-plan validator: passed.
- Forbidden-path scan: no matches.
- Independent adversarial inter-window arrival: reproduced one forbidden
  fallback dispatch.

## Learning Quality Evidence

Not applicable. The diff changes no lesson, exercise, textbook, rendered
output, or instructional behavior and makes no learning-quality claim.

## Student Experience Evidence

Not applicable. No student-facing route, UI, content, screenshot, or output
changes.

## Ownership and Handoff

Platform owns the race repair and exact regression. Lesson needs no change.
The canonical roadmap registration must be reconciled with declared scope.
The repair remains isolated in PR #217 and grants no PR #208, bundle, product,
or merge authority.

## Required Next Action

Correct the race, add the regression, reconcile the roadmap scope, rerun
focused/full/exact-head validation, and request exact-head round-2 lead review.
Human merge authorization remains mandatory.
