# PR-READINESS-COMMENT-TRANSPORT-RECOVERY-1 Plan

## Objective

Recover platform PR #206 on current trusted platform `main` and make large
rendered readiness comments reliable on Windows. The production readiness
applicators must send comment bodies through a temporary JSON file and
`gh api --input`, never through a command-line `body=...` argument.

The recovery is required because authorized bundle run `32111437353` produced
a valid platform integration-head readiness decision for PR #198, then failed
closed before merge when the rendered comment exceeded the Windows command-line
transport limit.

## Scope And Supersession

- Preserve readiness routing, evidence validation, authorization inheritance,
  branch-protection checks, and merge authority.
- Cover both the single-PR and coordinated bundle readiness comment paths.
- Supersede PR #206 evidence bound to base
  `73b31abde05781edfdd2ecb1941a669548395857`, head
  `f6c657bd5830762e49b5f00a6be73da2ff8c6a5c`, CI run `32034591334`, and
  that head's generated-index tail. The historical records remain unchanged.
- Synchronize PR #206 with trusted platform `main`
  `bfd765e2fcf69b77a735f17e63655a64fe932fe9` by merge commit.
- Keep PR #206 draft during correction. This sprint does not authorize or
  merge PR #206, PR #198, or lesson PR #44.

## Procedure

1. Claim the dedicated PR #206 worktree and return the PR to draft.
2. Merge current trusted platform `main`. Resolve only generated-index
   conflicts temporarily, then inspect the complete effective diff.
3. Retain the shared JSON-input helper and both production callers. Verify
   `applyLiveDecision` posts and updates a current large rendered decision,
   transports the exact body through `--input`, keeps the body out of process
   arguments, surfaces API failure, and cleans temporary files in all cases.
4. Keep the focused tests wired into `check:pr-readiness` and
   `check:integration-lane`.
5. Run focused transport tests, both workflow-level checks, the full Jest
   suite, and `git diff --check`.
6. Commit the synchronized substantive checkpoint and this governance record.
   Obtain Rawls exact-commit work-review `OK`; implement and re-review any
   findings.
7. Commit the approved review record. Then regenerate and freshness-check all
   four canonical indexes with trusted-main tooling against actual lesson
   `main`, verify deterministic output, and commit only the actual changed
   subset as the terminal generated-only tail.
8. Push without force, update the PR body, obtain exact-head CI, Rawls PR
   review `OK`, and PR Readiness. Stop for separate owner authorization.
9. After authorized integration and post-merge platform-main CI, synchronize
   PR #198 again and renew every platform-base-bound bundle proof before
   partial resume.

## Acceptance Tests

- A rendered readiness body larger than the Windows command-line limit is
  created and updated through the real production path.
- No comment body appears in a spawned command argument.
- Success and failure both remove the temporary payload file and directory.
- Existing routing, transition, bundle, and integration-lane tests remain
  green on current trusted `main`.
- The published PR has an exact-main synchronization merge, an approved review
  record, a terminal generated-only index tail, exact-head CI, and canonical
  readiness for human review.

## Stop Conditions

- Any substantive current-main conflict or readiness-policy change.
- Any loss of exact body bytes, failure propagation, or cleanup guarantees.
- Any repository commit after the terminal generated-index tail.
- Any Rawls verdict other than `OK`, missing owner authorization, force push,
  admin bypass, or merge outside `authorized-pr-integration`.

## Plan Review History

Reviewer: Rawls (`019ffaf1-c6b8-7152-88ff-d66366207ccb`).

- Round 1: `REVISE`. Return #206 to draft; supersede stale evidence; separate
  the substantive checkpoint, review record, and terminal index tail; exercise
  the real production path; and record the failed bundle run and recovery
  lineage.
- Round 2: `REVISE`. After #206 integration, separate immutable payload
  readiness from lane-generated platform integration-head readiness and avoid
  generic coordinated readiness after lesson #44 has merged.
- Round 3: `OK`. The revised plan incorporates both evidence boundaries.
