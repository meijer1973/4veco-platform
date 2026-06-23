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

The lane must bind the fetched comment to GitHub facts before using it:
comment ID, target repository, target PR number, owner author login,
`OWNER` author association, marker fields, JSON fields, and schema validation
must all agree. The current single-account model cannot cryptographically
distinguish owner-written comments from agent-written comments on the same
GitHub account; that is a procedural limitation, not a reason to accept
cross-PR or copied authorization records.

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
`4veco-main-integration`, `queue: max`, and `cancel-in-progress: false`.
GitHub's default concurrency behavior keeps only one pending run; this lane
requires the durable queue so multiple authorized PRs keep their place.

The lane must:

1. validate the human authorization comment;
2. set `integration-authorized` to pending on the observed PR head at lane
   entry;
3. re-fetch PR state, `main`, live branch protection, CI, reviews, and threads;
4. require the PR base branch to be `main`;
5. verify payload lineage and base drift;
6. determine whether the PR is behind by comparing `main` to the PR head, not
   by treating `BLOCKED` as drift;
7. update the branch with `expected_head_sha` only when `main` is not an
   ancestor of the PR head, then retry after the new head receives CI;
8. await `validate-platform` on the exact integration head;
9. enforce base-drift outcomes: no overlap continues, allowlisted overlap
   needs deterministic refresh verification, substantive overlap needs a
   machine-readable integration-delta lead-review `PASS`, and changed payload
   or authority returns to human review;
10. construct trusted integration evidence, run the deterministic PR readiness
    classifier, validate the resulting machine decision, and post or update the
    exact-head readiness comment with the full machine decision and canonical
    digest;
11. re-fetch `main` and the PR immediately before merge;
12. retry automatically when `main` moved or merge eligibility changed;
13. set `integration-authorized` success only on the final validated
    integration head;
14. merge with the expected PR-head SHA;
15. verify the merge commit is observable on `main` and post-merge `main` CI
    succeeds.

## Machine Enforcement

During rollout, `check-branch-protection.js` checks the current safe protection
shape: strict `validate-platform`, pull-request workflow, conversation
resolution, admin enforcement, force-push protection, deletion protection, zero
required approving reviews, and no observable pull-request bypass allowances.
`check-branch-protection.js --require-integration-authorized` validates the
future protected shape after a separate L4 change activates the lane as a
required status context. Until that activation, keep `integration-authorized`
optional.

After the lane is operational and branch protection requires
`integration-authorized`, agents must not call `gh pr merge` directly.

The exact-head PR-readiness comment is an audit record generated by the trusted
lane. A marker plus route line is not merge authority. The comment must contain
the full validated machine decision or a canonical digest over that decision,
and marker fields must match the machine decision. If the recomputed decision is
absent, invalid, stale, or non-ready, the lane stops before setting a reusable
success status.
