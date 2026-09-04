# Lead Review Summary

Sprint: `BOOK2-TARGET-AUTHORITY-REMEDIATION-1`

Round: lead review round 1

Review date: 2026-09-04

Reviewed substantive head: `eade17cbe5c9dc52652b47289cd6f51e6d1748e6`

Reviewed candidate package:
`32f5325a542445eb093b0e645304afae7542b2c92e491c8bd09ace9fefa71441`

Review standard: `REV-STD-1`, schema version 3

Review mode: separate read-only structural lead; not human owner review

## Scope

The review covered draft PR #230 and the exact remote head above. Evidence
inspected: Issue #229, the source audit PDF, Issues #218 and #221, product end
state, `reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-plan.md`,
`references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.candidates.json`,
`references/data/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1.alignment.json`,
`references/authored/course-target-exercises.json`, the Book 2 outline/meta,
all changed workflow checker/tests, specialist and finished-artifact reports,
the preliminary review packet, local validation, and GitHub Actions run
33907864939.

The review decides structural readiness only. It does not approve target
authority, authorize integration or lessons, release holds, mark the draft
ready, or authorize merge.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Exact package and registry identity | Structural lead plus hashes | Twelve synchronized records | PASS |
| Goal-operation-answer coverage | Structural lead | Every promised action visibly sampled | REVISE |
| Economics and terminology | Specialist evidence plus independent inspection | Correct calculations and bounded claims | PASS except missing normal-good sample |
| Candidate lifecycle | Currentness checker and mutations | No premature approval/integration | PASS WITH CORRECTION REQUIRED |
| Test-plan integrity | Focused Jest and full CI | Green on exact committed head | REVISE |
| Evergreen CI maintainability | Structural lead | No unrelated baseline freeze | REVISE |
| Scope and lesson boundary | Git/lesson checks | Platform only; no lesson changes | PASS |
| Closure evidence | Result, command log, packet, full CI | Complete review surface | PENDING |

## Consolidated Verdict

Verdict: REVISE

The exact remote package is not ready for the owner gate. Two learning-goal
operations are absent, the exact published head fails the focused suite and
hosted CI, and the sprint checker would freeze unrelated future authority data.

## Finding Classification

| Finding | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| LR-229-01: exact published head fails required CI | core_spec_failure | Approval, merge, and exact-head-CI claims | Publishing a corrected commit | Fix historical fixture, run focused/full local tests, and obtain green hosted CI on the corrected head |
| LR-229-02: §2.1.1 does not assess promised total-cost change | core_spec_failure | Approval of §2.1.1 and the package | Reusing the other records during correction | Add or validly narrow the visible operation; update answer, points, timing, alignment, mutations, hashes, and reviews |
| LR-229-03: §2.2.3 assesses luxe and inferieur but not normaal | core_spec_failure | Approval of §2.2.3 and the package | The three-way terminology decision | Add an observable normal-good Ei calculation/classification with scoring, timing, alignment, mutation, and renewed review |
| LR-229-04: review/closure evidence is stale or incomplete | core_spec_failure | Closure and final lead verdict | Correcting the package first | Refresh specialist/verifier evidence for the new hash; add exact paths, citations, stop rules, result, diff, command log, and range-diff proof |
| LR-229-05: sprint checker is an evergreen data freeze | scale_blocker | Permanent CI integration in current form | Bounded use during correction | Retire after transition or add a durable mode that ignores unrelated future data and has transition tests |
| LR-229-06: classroom timing is unverified | minor_carry_flag | Classroom-proven 8–12-minute claims | Phase A structural review | Representative later timed use and resulting calibration |

## Blocking Findings

LR-229-01 through LR-229-05 block final routing. Missing core requirements
cannot be carried under PASS WITH FLAGS.

## Specialist Findings

Initial economics, teacher, and student-language reviews passed package
`32f532…71441`, and the initial finished-artifact recheck passed its then-current
working tree. Those reports remain useful historical evidence but cannot close
the corrected package. The teacher already carried empirical §2.3.3 timing to
Phase B. All affected specialist roles must review the replacement hash.

## Test Evidence

`npm.cmd run test:book2-target-authority-remediation` failed three of 114 tests
on the exact published head because the historical integration fixture read
the now-changed `HEAD` registry. Hosted `validate-platform` run 33907864939
also failed at that head: 3 failed, 10 skipped, and 1,762 passed tests.

The preliminary command evidence did not yet include
`reports/sprints/BOOK2-TARGET-AUTHORITY-REMEDIATION-1-command-log.jsonl`, a
complete result bundle, or a clean `git diff --check origin/main...HEAD` range
proof. These are required in the corrected closure tail.

## Learning Quality Evidence

The overall package has strong direct operations and independently checked
economics, but §2.1.1 goal 4 promises total and average cost-change explanation
while question e asks only about GCK/GVK/GTK. Section §2.2.3 promises all three
Ei categories while its assessed cases cover only luxe and inferieur. Both are
core bidirectional alignment gaps.

## Student Experience Evidence

Student-language review passed the original wording, and no rendered lesson
artifact is in Phase A. The missing visible operations are nevertheless
student-experience defects because learners cannot demonstrate two promised
outcomes in the point-bearing prompts. Renew student-language review after the
prompt changes.

## Ownership and Handoff

The platform owns this candidate/evidence branch. The lesson repository remains
unchanged at `f09fd6e88edc5049b026b16b0158e7e188091d2d`. All Issue #229 candidate
holds and the Ei supersession hold remain open. No owner approval, integration,
lesson, product, or merge authority exists.

## Required Next Action

Correct LR-229-01 through LR-229-05; generate a new package hash; renew all
three specialist reviews and independent finished-artifact verification;
publish a corrected exact commit; complete result/diff/command/packet evidence;
then obtain structural lead round 2 and green exact-head hosted CI. Keep the PR
draft and do not integrate, write lessons, release holds, or merge.
