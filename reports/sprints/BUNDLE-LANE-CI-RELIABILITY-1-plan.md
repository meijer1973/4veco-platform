# Sprint BUNDLE-LANE-CI-RELIABILITY-1: Bundle Lane CI Reliability

## Goal

Repair the trusted coordinated-bundle integration lane so every intermediate
and final Platform CI state prefers its exact automatic `main` push run and
uses a correctly parameterized manual dispatch only when no qualifying
automatic run appears. Preserve fail-closed verification and return one open,
unmerged governance PR for human review.

## Context

PR #208 merged safely at Platform merge commit
`11c7a0286776064a694efa4e3cc9e91b4e62fa5c`; the automatic push run proved the
exact Platform/Lesson pair. The bundle lane nevertheless failed after its
irreversible merge because it dispatched `platform-ci.yml` without the now
required `y1_base_sha` and `y1_head_sha` inputs. The lane also dispatches an
unnecessary duplicate instead of first accepting the automatic push run.

This is governance and CI orchestration work. It does not reopen PR #208 and
does not authorize another bundle integration.

## Quality Standard

The specification is satisfied only when the bundle lane has one explicit,
tested CI-acquisition state machine, preserves the existing quality floor, and
binds proof to exact commits. Rendered output and every student-facing surface
must remain byte-unchanged. Closure proof must include focused and full tests,
exact-head CI, structural independent review, and readiness. Any broader idea
is either a named follow-up or rejected scope creep.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
| --- | --- | --- | --- |
| Reuse exact automatic push CI | Shared acquisition helper selects only a newer exact-head `push` run and verifies exact Platform/Lesson evidence | Positive test and lead review | planned |
| Avoid duplicate dispatch | Queued/running automatic runs are awaited; completed automatic failures fail closed; fallback occurs only when no qualifying run appeared | Absence, running, red, and wrong-evidence tests | planned |
| Dispatch exact Y1 inputs | Real trigger builds `gh workflow run ... -f y1_base_sha=... -f y1_head_sha=...` with full SHAs, exact head, and validated range | Concrete argument-vector and negative-input tests | planned |
| Correct every bundle CI state | Intermediate and final paths call the same helper with transition-specific coordinates | Platform-first, lesson-first, and residual tests | planned |
| Report irreversible-state failures | Every failure after at least one completed merge uses `merged_but_postmerge_verification_failed`, preserves subphase, diagnostics, and merge records | Intermediate/final red, mismatch, timeout, dispatch-error tests | planned |
| Preserve dry-run safety | Policy and regression retain fail-closed delta-review dry-run exception | Existing and focused regression plus policy review | planned |

## Quality Improvement Candidates

- `include_now`: event-aware run selection, validated Y1 inputs, shared
  acquisition, structured post-merge failure reporting, direct argument tests,
  and precise policy language.
- `defer_named_follow_up`: broader workflow-run telemetry or UI reporting that
  is not needed to make the trusted lane safe.
- `reject_scope_creep`: PR #208 changes, Lesson or product changes, Y1 evidence
  renewal, guard weakening, single-PR lane redesign, token workarounds, or an
  administrative bypass.

## Allowed paths

- `build-scripts/review-gates/integrate-authorized-bundle.js`
- `build-scripts/review-gates/integrate-authorized-bundle.test.js`
- `docs/review/pr-integration-lane-policy.md`
- `reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-*`
- `references/data/sprints/BUNDLE-LANE-CI-RELIABILITY-1*`
- the canonical generated repository URL/index/dashboard closure only when
  required by freshness checkers
- the four canonical `reports/github-agent-index-*` files only when their
  deterministic generator requires refresh

## Forbidden paths

- `.github/workflows/platform-ci.yml` and all other workflow definitions
- all Lesson repository paths
- product, engine, source-data, generated textbook, or rendered artifact paths
- Y1 screenshots, manifests, evidence, checker, or reference policy
- protected `references/machine/` and `references/external/` surfaces
- PR #208 history, authorization, or integration evidence

## Inputs

- Platform base/main:
  `11c7a0286776064a694efa4e3cc9e91b4e62fa5c`
- Lesson main:
  `f09fd6e88edc5049b026b16b0158e7e188091d2d`
- The required `platform-ci.yml` manual inputs: full 40-character
  `y1_base_sha` and `y1_head_sha`
- Existing exact-pair CI evidence artifact and Platform/Lesson verification
- Existing bundle authorization, lineage, readiness, and merge-state checks

## Outputs

- A shared exact-main-CI acquisition helper used by intermediate and final
  bundle states
- A validated concrete manual-dispatch argument vector
- Structured `merged_but_postmerge_verification_failed` terminal results
- Focused negative and positive regressions
- Narrow policy clarification
- Sprint result, command log, planning review, lead-review assignment, review
  rounds, correction log, exact-head readiness, and deterministic indexes
- One open, unmerged PR for owner human review

## Operationalized sprint procedure

1. Verify and lock the exact base; run governance freshness with policy-edit
   allowance and stop if Platform or Lesson `main` moves.
2. Validate this plan and obtain an independent planning review before settling
   implementation details.
3. Implement the state machine. Capture a run-ID floor before each relevant
   state transition. A newer exact-head `push` run that is queued or running is
   an existing automatic run: wait for it and never dispatch a duplicate. A
   completed automatic run with red status or wrong Platform/Lesson evidence
   fails closed. Dispatch fallback only when no qualifying automatic run was
   observed after the floor.
4. Define coordinates per transition. A Platform merge uses its pre-merge main
   as Y1 base and its verified merge commit as Y1 head. A Lesson-only transition
   with unchanged Platform uses `base == head == current Platform main`; the
   pre-transition run-ID floor excludes the stale earlier push run. A newly
   observed push run with wrong Lesson evidence is not absence and must fail;
   an older same-Platform run below the floor is ignored. Full SHAs, exact-head
   equality, and base ancestry (or exact identity) are mandatory.
5. Manual fallback must capture a second pre-dispatch floor, call exactly
   `gh workflow run platform-ci.yml --repo meijer1973/4veco-platform --ref main
   -f y1_base_sha=<full SHA> -f y1_head_sha=<full SHA>`, and accept only a newer
   `workflow_dispatch` run with exact Platform/Lesson evidence.
6. Route intermediate and final CI through that helper. If `merges.length > 0`,
   every later red CI, evidence mismatch, timeout, invalid input, dispatch
   error, or representative orchestration failure returns top-level phase
   `merged_but_postmerge_verification_failed`, retains the original
   `verification_subphase`, diagnostics, and completed merge records. Prove
   pre-merge failures keep their established phases.
7. Run focused validators and the full suite. Stop on any unrelated diff,
   student-facing or rendered change, weakened guard, or failed acceptance test.
8. Run the structural review cycle: publish an assignment, obtain independent
   round 1, record every correction, then obtain a round-2 exact-head recheck.
   After any correction, rerun focused/full validation and exact-head CI and
   readiness.
9. Push the terminal head, obtain exact-head CI and readiness, verify clean
   worktree and unchanged repository heads, release the lock, and return the PR
   open and unmerged for one owner human decision.

## Acceptance tests

The focused matrix must cover automatic success; queued/running automatic
completion without dispatch; absent automatic plus successful fallback; exact
`gh` arguments; missing, malformed, reversed, non-ancestor, and mismatched-head
inputs; stale old run exclusion; newly observed wrong Platform/Lesson evidence;
red automatic CI; automatic and fallback timeout; intermediate and final
post-merge failure classification; representative dispatch/orchestration
failure; unchanged-Platform `base == head`; and preservation of pre-merge
phases.

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/BUNDLE-LANE-CI-RELIABILITY-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js BUNDLE-LANE-CI-RELIABILITY-1
npm.cmd test -- --runInBand build-scripts/review-gates/integrate-authorized-bundle.test.js
npm.cmd run check:integration-lane
npm.cmd run check:paragraph-lane-scope -- --lane shared --base origin/main --head HEAD
npm.cmd run check:platform
```

The terminal validation also includes repository report/index freshness,
diff-hygiene checks, lead-review substance, finalization freshness, and hosted
exact-head Platform CI against the exact Lesson main SHA.

## Proof Required to Close

To close the sprint, closure proof must show the plan and sprint-bundle validators passed, the
focused and full test suites passed, concrete dispatch arguments were tested,
no forbidden path changed, exact-head hosted CI passed every later gate, and
the structural independent review cycle concluded PASS or PASS WITH FLAGS at
the terminal head. The result must link the planning review, lead-review
assignment, round 1, correction log, round-2 recheck, readiness record, exact
head, CI run, and open PR.

## Rollback plan

Before merge, abandon or revert only this isolated branch; PR #208 and both
repositories' `main` remain untouched. If a later authorized merge regresses
the lane, revert the repair merge commit through a separate reviewed PR. Never
rewrite shared history or bypass protected integration.

## Human review required

Yes. This changes trusted merge governance. Independent planning and structural
lead review are necessary but do not grant merge authority. After green
exact-head CI and readiness, return one open, unmerged PR for explicit owner
human review and integration authorization.
