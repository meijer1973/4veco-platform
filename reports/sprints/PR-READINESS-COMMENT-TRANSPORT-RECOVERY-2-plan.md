# PR-READINESS-COMMENT-TRANSPORT-RECOVERY-2 Plan

## Objective

Renew platform PR #206 after PR #207 advanced trusted platform `main` from
`bfd765e2fcf69b77a735f17e63655a64fe932fe9` to
`35a08452a4b66535d0e5684c68df6894b3b00652` after the prior review packet was
issued.

The transport implementation remains unchanged. This recovery synchronizes the
branch, proves effective-payload equivalence, regenerates canonical indexes,
and renews exact-head CI, Rawls review, and PR Readiness.

## Scope And Supersession

- Return PR #206 to draft during correction.
- Merge current `main`; do not rebase or force push.
- Resolve only canonical generated-index conflicts. Stop on any substantive
  conflict.
- Supersede prior terminal head
  `e445a59669202ec97e43eae4b992a32d3ec59955`, base `bfd765e2...`, CI run
  `32113325877`, Rawls PR comment `5325319748`, and readiness comment
  `5325335670` as current-merge-readiness evidence.
- Preserve those historical records as valid for the base on which they were
  issued.
- Keep PR #198 held. Lesson PR #44 is already merged and must not be merged
  again.

## Procedure

1. Fetch and verify live refs, return #206 to draft, and claim its dedicated
   clean worktree.
2. Fingerprint the complete non-index effective diff against the former base.
3. Merge current trusted `main` by merge commit. Resolve only generated-index
   conflicts and fingerprint the same non-index diff against the new base.
4. Require identical stable patch IDs, identical non-index path sets, and
   retained ancestry for the original transport implementation.
5. Run focused transport tests, `check:pr-readiness`,
   `check:integration-lane`, the full Jest suite, and diff hygiene.
6. Commit this synchronization record and obtain Rawls exact-commit work-review
   `OK`; implement and re-review any findings.
7. Add the approved review record, then use tooling byte-identical to trusted
   current `main` to generate and freshness-check all four canonical indexes
   twice against actual lesson `main`.
8. Commit only the actual generated-index subset as the one-parent terminal
   tail. Make no later repository commit.
9. Push non-force, correct the PR body, run exact-head CI against the new base,
   obtain Rawls exact-head PR review `OK`, and rerun canonical PR Readiness.
10. Stop for separate owner authorization.

## Acceptance Tests

- The pre- and post-synchronization non-index effective patches have the same
  stable patch ID and changed-path set.
- Only generated platform indexes require merge conflict resolution.
- The original implementation commit remains an ancestor.
- Focused, workflow-level, full-suite, freshness, and diff checks pass.
- The published PR is clean and mergeable against current `main`, with a
  terminal generated-only tail and current exact-head review evidence.

## Stop Conditions

- Any substantive merge conflict or changed non-index payload fingerprint.
- Any unexpected generator output, nondeterministic index bytes, or non-index
  terminal path.
- Any Rawls verdict other than `OK`, force push, admin bypass, owner
  authorization mismatch, or merge outside the trusted integration lane.

## Plan Review

Reviewer: Rawls (`019ffaf1-c6b8-7152-88ff-d66366207ccb`).

Verdict: `OK`.
