# PR Integration Lane Policy

The integration lane serializes merges after human review so a PR does not need
another human decision merely because `main` advanced.

## Identities

`reviewed_payload_head_sha` is the PR payload SHA that received substantive
payload authorization. The owner decision binds to that payload and the stated
decision scope.

`integration_head_sha` is the current PR head after permitted base-sync merge
commits and deterministic evidence refreshes. CI, readiness, branch protection,
and the final merge bind to this exact SHA.

The integration head is machine-validated, not separately human-authorized. A
human decision binds once to the reviewed payload head and carries through only
the permitted descendants described below.

Owner decisions authorize the reviewed payload head and decision scope. The
integration lane validates the current integration head. A later integration
head may be produced by base sync or generated/evidence-only tail handling.
Renewed owner authorization is not required when payload lineage, effective
payload, bundle membership, and authority scope remain valid.

Renewed owner authorization is required when:

- reviewed payload is not an ancestor of the integration head;
- manual conflict resolution changes behavior;
- substantive source payload changes;
- bundle membership changes;
- decision scope or authority class changes;
- the lane cannot prove lineage/effective-payload equivalence.

## Human Payload Authorization

Payload authorization must be recorded as a machine-readable PR comment with this
marker:

```text
<!-- 4veco-human-payload-authorization:<repo>:<pr>:<payload-sha> -->
```

The comment must include JSON matching
`docs/review/human-payload-authorization.schema.json`. Required fields include
repository, PR number, reviewed payload head SHA, base SHA at review, decision,
decision scope, authorization comment ID, permitted integration descendants, and
invalidation conditions.

Human-facing handoffs must label this as payload authorization while preserving
the existing machine decision values:

```text
HUMAN_DECISION: APPROVE_FOR_INTEGRATION
AUTHORIZATION_TYPE: PAYLOAD_AUTHORIZATION
PR: #...
REVIEWED_PAYLOAD_HEAD: ...
DECISION_SCOPE: ...
MERGE_METHOD: merge commit
ADMIN_BYPASS: prohibited
```

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
- no manual conflict resolution changed behavior;
- no substantive PR-authored commit followed authorization;
- bundle membership, authority level, and human-review scope did not change.

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

The default single-PR merge path is the owner-authenticated local serialized
lane:

```powershell
npm.cmd run integrate:authorized-pr -- --repo meijer1973/4veco-platform --pr <pr> --authorization-comment-id <comment-id>
```

The local lane must be run from current `main`/current policy code. It is not a
raw merge path: it must run the same payload-lineage, base-drift, CI,
readiness, review, branch-protection, expected-head, and post-merge CI checks
before invoking the merge.

The optional cloud path is `.github/workflows/authorized-pr-integration.yml`.
It runs from `main` with the repository-wide concurrency group
`4veco-main-integration`, `queue: max`, and `cancel-in-progress: false`.
GitHub's default concurrency behavior keeps only one pending run; this lane
requires the durable queue so multiple authorized PRs keep their place. The
workflow job name must not be `integration-authorized`; that string is reserved
for the commit status context minted by trusted integration code.

Use the cloud workflow only when its `github.token` can read branch protection.
If it returns `phase: branch_protection_read_forbidden`, the token hit the
expected GitHub Administration-read permission boundary. That is not an unknown
governance failure and it does not permit direct merging. Use the
owner-authenticated local lane above with the same authorization comment ID.

Agents can check the current environment with:

```powershell
npm.cmd run check:integration-lane-capability
```

The lane must:

1. validate the payload authorization comment;
2. set `integration-authorized` to pending on the observed PR head at lane
   entry;
3. re-fetch PR state, `main`, live branch protection, CI, reviews, and threads;
4. require the PR base branch to be `main`;
5. verify payload lineage and base drift;
6. determine whether the PR is behind by comparing `main` to the PR head, not
   by treating `BLOCKED` as drift;
7. update the branch with `expected_head_sha` only when `main` is not an
   ancestor of the PR head, then retry after the new head receives CI;
8. await `validate-platform` on the current `integration_head_sha`;
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
13. set `integration-authorized` success only on the final validated integration
    head, then merge directly with the expected PR-head SHA while live branch
    protection requires only `validate-platform`;
14. keep the retired activated auto-merge path dormant unless an explicit owner
    decision reopens it with new GitHub behavior evidence or a different
    implementation mechanism;
15. verify the merge commit is observable on `main` and post-merge `main` CI
    succeeds.

A dry-run may validate the lane inputs and policy decisions, but it must not set
a reusable successful `integration-authorized` status.

## Cross-Repo Bundle Integration

The required platform `validate-platform` job always represents the state that
would exist after a platform-first merge: platform candidate head plus lesson
`main`. It must not substitute a matching lesson branch in the required job.
When a platform PR depends on a lesson PR candidate, that work is an explicit
cross-repository bundle instead of an independently mergeable platform PR.

The platform repository is the bundle controller because it owns generators,
CI, validators, governance, and integration tooling. The lesson repository is a
generated-output member. A controller PR with a paired lesson PR must carry one
`bundle_id`, exact paired PR metadata, exact payload SHAs, and compatibility
proof from `.github/workflows/cross-repo-bundle-compatibility.yml`.
The controller proof must bind that compatibility output to expected
`exact_members`: live platform base, platform candidate, lesson base, and
lesson candidate SHAs. A delegated lesson member consumes the controller proof
and records its own `current_member` repository, PR number, current head SHA,
and reviewed payload SHA.

The compatibility workflow checks three exact-ref states and emits
machine-readable JSON:

- `platform-first`: platform candidate head plus lesson main/base.
- `lesson-first`: platform main/base plus lesson candidate head.
- `bundle-final`: platform candidate head plus lesson candidate head.

A bundle may merge only when `bundle-final` is green and at least one
intermediate state is green. If neither intermediate state is green, neither PR
may merge until a compatibility bridge makes one order safe.
Individual matrix states record success or failure without deciding the whole
workflow. The trusted `main` summarizer is the final gate, validates the exact
state-to-SHA mapping, and records workflow provenance for the run.

If both bundle members are still draft but the controller readiness proof shows
both are substantively ready at exact heads, run
`npm.cmd run apply:bundle-readiness` before merge authorization. That operation
generates member readiness decisions from the one controller decision, posts
exact-head readiness comments for both PRs, re-fetches heads immediately before
each `MARK_READY`, verifies the transitions afterward, and grants no merge
authority on its own.

Human approval for a paired bundle must be recorded with this marker:

```text
<!-- 4veco-human-bundle-authorization:<bundle-id> -->
```

The comment must include canonical JSON with decision
`APPROVE_BUNDLE_AND_MERGE`, the controller PR, every member PR, reviewed
controller/member payload SHAs, decision scope, merge order, and invalidation
conditions. The GitHub comment ID is derived from GitHub metadata; it must not
be copied into the JSON. Prose-only approval is not valid bundle merge
authority.

Human-facing bundle handoffs must use the bundle payload authorization label:

```text
HUMAN_DECISION: APPROVE_BUNDLE_AND_MERGE
AUTHORIZATION_TYPE: BUNDLE_PAYLOAD_AUTHORIZATION
BUNDLE_ID: ...
CONTROLLER_REPOSITORY: ...
CONTROLLER_PR: #...
CONTROLLER_REVIEWED_PAYLOAD_HEAD: ...
MEMBER_REPOSITORY: ...
MEMBER_PR: #...
MEMBER_REVIEWED_PAYLOAD_HEAD: ...
DECISION_SCOPE: ...
MERGE_ORDER: CI_SELECTED
ADMIN_BYPASS: prohibited
```

Use `.github/workflows/authorized-bundle-integration.yml` or
`npm.cmd run integrate:authorized-bundle` for coordinated bundle merge. The
workflow uses the same `4veco-main-integration` queue as single-PR integration,
downloads the explicit compatibility summary, validates the bundle
authorization, re-fetches both PRs and both `main` refs, selects only a proven
merge order, merges the first member at its expected head, verifies the
intermediate platform CI state, refreshes/revalidates the second member when
needed, merges the second member, and requires final platform CI against final
platform `main` plus final lesson `main`.

Cross-repository bundle mutations use `CROSS_REPO_BUNDLE_TOKEN`, a fine-grained
token from the existing owner account restricted to `4veco-platform` and
`4veco-lessen`. The ordinary repository `github.token` may be used only for
platform-local artifact reads. The bundle integrator fails closed unless the
cross-repository token can access both repositories with merge-capable
permissions.

After every platform CI dispatch in the bundle lane, the integrator records the
latest prior workflow-run id and accepts only a newer `platform-ci` run. It then
downloads `platform-ci-evidence.json` and verifies the exact platform and
lesson `main` SHAs for the intermediate and final states. A green run for the
same platform SHA but an older lesson SHA is not valid evidence.

The integration command also verifies the compatibility workflow provenance:
workflow id, workflow path, workflow ref, workflow-dispatch event, trusted
workflow SHA, run id, exact inputs, success conclusion, the server-reported
`bundle-summary` artifact digest, and the downloaded summary hash. Before each
member merge it re-fetches both PRs and both `main` refs, requires exact-head
readiness decisions, requires clean review-thread/requested-change state, and
stops if a base or head moved outside the proven compatibility state.

Lesson bundle members consume delegated bundle proof from the platform
controller. They must not require a standalone platform branch-protection
context on a lesson-repository commit.

## Machine Enforcement

`check-branch-protection.js` checks the current safe protection shape: strict
`validate-platform`, pull-request workflow, conversation resolution, admin
enforcement, force-push protection, deletion protection, zero required approving
reviews, and no observable pull-request bypass allowances.

The activation pilot is closed without required-context activation. The live
repository state is:

- `validate-platform`
- `integration-authorized` optional audit evidence only
- repository `allow_auto_merge: false`

The dormant activated-mode checker
`check-branch-protection.js --require-integration-authorized` remains available
for tests and any future owner-authorized experiment, but it is not the expected
operating shape. Do not require `integration-authorized` again without concrete
new GitHub behavior evidence or a different implementation mechanism.
The `integration-authorized` context, when minted as audit evidence, must only
come from trusted `main` workflow code in
`.github/workflows/authorized-pr-integration.yml`,
`.github/workflows/authorized-bundle-integration.yml`, or the equivalent
owner-authenticated local lane running trusted `main` code.

The single-PR integration runner validates the current live protected shape by
default. If live branch protection unexpectedly requires
`integration-authorized`, the runner fails closed instead of treating that
observation as activation authority. The standalone branch-protection checker
can still inspect the legacy activated shape with
`--require-integration-authorized` for tests and future owner-authorized
experiments, but the integration runners must not schedule auto-merge from that
shape.

Agents must not call `gh pr merge` directly for normal PRs. Merges must go
through `authorized-pr-integration` or `authorized-bundle-integration`; for
single-PR work the owner-authenticated local lane is the default path. The
trusted cloud workflow may be used only when it can verify branch protection.
A cloud `branch_protection_read_forbidden` result means use the local lane, not
raw merge. Payload authorization still binds to the reviewed payload SHA. The
lane may validate a later integration head without renewed owner authorization
when lineage, base drift, decision scope, and effective-payload checks remain
valid. The lane may internally use a direct merge command under the current
branch-protection shape; that is a trusted-lane implementation detail, not
agent merge authority.

The bundle lane sets `integration-authorized` pending on the platform
controller head when it starts. It sets failure on terminal bundle-lane
failures. In the current live branch-protection shape, it sets success only on
the exact platform controller integration head after bundle authorization,
current compatibility proof, member-head checks, clean review state,
exact-head readiness, required CI, and base-drift checks pass, and immediately
before the platform member merge. The retired activated branch-protection mode scheduled platform
auto-merge first, verified the auto-merge request on the same head, then set
success. That path remains dormant/fail-closed reference after smoke PR #177
timed out. For lesson-first bundles, platform success remains delayed until the
lesson member has merged and the intermediate platform CI proof has passed.
Dry-runs must not create a reusable successful status. Lesson repository members
keep their repository-local merge behavior because they do not consume the
platform `integration-authorized` context.

The activation rollback is complete: required contexts are back to
`validate-platform` only and repository `allow_auto_merge` is `false`.

The exact-head PR-readiness comment is an audit record generated by the trusted
lane. A marker plus route line is not merge authority. The comment must contain
the full validated machine decision or a canonical digest over that decision,
and marker fields must match the machine decision. If the recomputed decision is
absent, invalid, stale, or non-ready, the lane stops before setting a reusable
success status.
