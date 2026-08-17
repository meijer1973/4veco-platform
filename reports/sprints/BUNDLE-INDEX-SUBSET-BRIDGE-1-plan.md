# BUNDLE-INDEX-SUBSET-BRIDGE-1 Plan

## Objective

Repair the trusted lesson-first bundle refresh so a canonical runtime tail may
change the actual non-empty subset of the four agent-index files whose bytes
need updating, while still regenerating, freshness-checking, hashing, and
verifying all four files.

The bridge is required because platform PR #198 already contains canonical
lesson indexes for merged lesson PR #44. A repaired-platform-main descendant
therefore needs only the two platform index files to change. The prior exact
four-file runtime-delta rule fails closed on that valid state.

This plan was written and reviewed in the active task before implementation.
It is logged here after the blocker-specific worktree was created so the
repository carries the same operational record used to guide the work.

## Scope And Supersession

- Preserve the canonical four-path generation and verification surface.
- Replace only the runtime commit-delta requirement with a unique, non-empty,
  allowlisted subset policy.
- Supersede the exact-four changed-path runtime statement in
  `BUNDLE-INDEX-REFRESH-1-plan.md` without rewriting that historical record.
- Keep immutable bundle payload candidates and existing owner authorization
  unchanged. This bridge does not authorize or merge platform PR #198.
- Publish and integrate this bridge separately before renewing compatibility
  and resuming the bundle lane.

## Procedure

1. Version the lesson-first integration contract and readiness attestation to
   schema v2. Record all four generated-and-verified paths and the actual
   non-empty-subset policy.
2. Regenerate all four indexes twice from trusted platform main, run freshness
   checks after generation, validate canonical metadata, and retain hashes for
   all four outputs.
3. For a new runtime tail, require one exact parent and an actual unique,
   non-empty subset of the four paths. Verify parent, changed paths, committed
   bytes, and hashes before push and after refetch.
4. For reuse, regenerate all four files from the candidate commit parent and
   compare every committed file byte-for-byte. Reject stale, tampered,
   multi-parent, empty, duplicate-path, or outside-path evidence.
5. Make dry-run report `would_verify` with no claimed actual delta or completed
   commit proof.
6. Keep post-lead-review changed paths GitHub-derived. Supplemental evidence
   must not replace or hide the compare result.
7. Add a concrete regression in which a previous lesson refresh is followed
   by repaired platform main, producing exactly the two platform index changes
   while verifying all four and supporting idempotent reuse.
8. Run focused refresh, compatibility, readiness, and integration tests;
   workflow-level governance gates; the full platform suite; freshness and
   diff checks.
9. Commit the substantive bridge and result record, obtain Rawls exact-commit
   work-review `OK`, add the review record, and use trusted-main tooling for a
   terminal generated-index tail.
10. Push without force, open a draft PR, pass exact-head CI, obtain Rawls
    exact-head PR review `OK`, run PR Readiness, and stop for owner payload
    authorization.

## Acceptance Tests

- Platform-only two-index creation and reuse are green while all four hashes
  and canonical bytes are verified.
- Commit-time allowlisted tampering, empty commits, wrong parents, duplicate or
  outside subsets, stale reuse, schema v1, and attestation tampering all fail
  closed.
- Supplemental lead-review path claims cannot replace GitHub compare paths.
- `check:integration-lane`, `check:pr-readiness`, and the full Jest suite pass.
- The published PR has a terminal generated-only tail, exact-head CI, Rawls
  `OK`, and canonical readiness for human review.

## Stop Conditions

- Any generated path outside the four canonical indexes.
- Any inability to bind the created or reused commit to its exact parent,
  actual subset, all-four canonical bytes, and all-four hashes.
- Any substantive conflict when the integrated bridge is later synchronized
  into PR #198.
- Any Rawls verdict other than `OK`, readiness result other than the canonical
  human-review route, missing owner authorization, force push, or admin bypass.

## Plan Review History

Reviewer: Rawls (`019ffaf1-c6b8-7152-88ff-d66366207ccb`).

- Round 1: `REVISE`. Version both contract and attestation, bind changed and
  verified paths into the digest, keep post-lead paths remote-derived, verify
  exact commit shape before and after push, and prevent dry-run from claiming a
  completed delta.
- Round 2: `OK`. The revised procedure incorporated every finding.
