# INTEGRATION-AUTHORIZED-AUTO-MERGE-TRIGGER-1 Lead Review

Date: 2026-06-29

Implementation commit reviewed: `a74765ff9fd1a893d029c6d642148e86ede401c6`

Reviewer: independent subagent lead reviewer

## Scope

Review the activated `integration-authorized` auto-merge trigger repair after
smoke PR #174 timed out. The intended behavior is:

- keep `integration-authorized` pending at activated lane entry;
- schedule auto-merge while the required status is still pending;
- verify `autoMergeRequest` is observable on the same PR head;
- set `integration-authorized` success only after that verification;
- observe the merge and fail closed with diagnostics on timeout or head
  movement;
- preserve pre-activation direct merge behavior.

## Round 1 Verdict

`REQUEST_CHANGES`

Blocking findings:

1. The post-schedule head-move path in the single-PR runner returned
   `ok: false` with `retry_required: true`, but `runIntegrationAttempts()`
   stops on `ok: false`.
2. The post-schedule head-move path in both the single-PR runner and bundle
   platform-member runner did not disable auto-merge before returning.
3. Tests did not cover verification-window head movement and only partially
   proved the diagnostics requirement.

## Corrections

- Single-PR post-schedule `auto_merge_head_changed` now disables auto-merge,
  marks the old head failure, and returns `ok: true` with `retry_required:
  true` so the attempt loop can retry.
- Bundle platform-member post-schedule `auto_merge_head_changed` now disables
  auto-merge, marks failure, and returns the same retry shape as other bundle
  head-change retry paths.
- Added regression coverage for verification-window head movement in both
  runners.
- Strengthened non-enabled and timeout diagnostics assertions to include
  branch-protection evidence.

## Round 2 Verdict

`PASS`

The reviewer found no remaining blocking issues. The previous blockers were
confirmed fixed, and the added tests cover the ordering, cleanup, and diagnostic
windows.

## Validation Cited By Reviewer

- `npm.cmd run check:integration-lane`: passed, 9 suites and 118 tests.
- `git diff --check`: clean.
