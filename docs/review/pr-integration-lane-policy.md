# PR Integration Lane Policy

The integration lane serializes merges after human review so a PR does not need
another human decision merely because `main` advanced.

## Identities

`reviewed_payload_head` is the exact PR head that received substantive human
authorization. The owner decision binds to that payload and the stated decision
scope.

`integration_head` is the current PR head after permitted base-sync merge commits
and deterministic evidence refreshes. CI, readiness, branch protection, and the
final merge bind to this exact SHA.

## Human Payload Authorization

Human authorization must be recorded as a machine-readable PR comment with this
marker:

```text
<!-- 4veco-human-payload-authorization:<repo>:<pr>:<payload-sha> -->
```

The comment must include JSON matching
`docs/review/human-payload-authorization.schema.json`. Required fields include
repository, PR number, reviewed payload head SHA, base SHA at review, decision,
decision scope, authorization comment ID, permitted integration descendants, and
invalidation conditions.

## Authorization Inheritance

Authorization may survive later PR heads only when:

- the reviewed payload SHA remains an ancestor of the current PR head;
- intervening commits are conflict-free main base-sync merges or allowlisted
  deterministic evidence/index refreshes;
- no rebase or force push removed the reviewed lineage;
- no manual conflict resolution occurred;
- no substantive PR-authored commit followed authorization;
- the authority level and human-review scope did not change.

Self-declared commit labels are not proof. The lane must inspect commit graph
shape, parentage, changed paths, and GitHub comparison data.

## Base Drift

Before inheriting authorization, compute:

- `payload_paths` from the reviewed PR diff;
- `base_delta_paths` from `base_sha_at_review` to current `main`;
- `overlapping_paths`.

No substantive overlap inherits automatically. Overlap only in allowlisted
generated or evidence paths requires deterministic refresh and lead verification.
Substantive overlap requires an integration-delta lead review. Changed effective
payload, manual conflict resolution, or authority-scope change invalidates the
authorization and returns the PR to human review.

## Serialized Workflow

The trusted workflow is `.github/workflows/authorized-pr-integration.yml`. It
runs from `main` with the repository-wide concurrency group
`4veco-main-integration`, `cancel-in-progress: false`.

The lane must:

1. validate the human authorization comment;
2. re-fetch PR state, `main`, branch protection, CI, reviews, and threads;
3. verify payload lineage and base drift;
4. update the branch with `expected_head_sha` when behind;
5. re-fetch the integration head;
6. await `validate-platform` on the exact integration head;
7. require a PR Readiness Reviewer comment for the exact integration head,
   generated with the human authorization and integration proof;
8. re-fetch `main` and the PR immediately before merge;
9. retry automatically when `main` moved;
10. set `integration-authorized` only on the exact validated integration head;
11. merge with the expected PR-head SHA;
12. verify post-merge `main` CI.

## Machine Enforcement

During rollout, `check-branch-protection.js --require-integration-authorized`
checks that branch protection requires both `validate-platform` and
`integration-authorized`. After the lane is operational, branch protection should
include `integration-authorized`, and agents must not call `gh pr merge`
directly.

If the exact-head PR-readiness comment is absent or records a non-ready route,
the lane stops before setting `integration-authorized`; the PR Readiness
Reviewer must be rerun and applied for the current integration head.
