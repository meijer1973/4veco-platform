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

When an authorized payload-lineage integration head receives a fresh
integration-head lead review, the lane may use that review as the operative
lead-review proof for final readiness. Supply it with
`--integration-lead-review <path>`. The record must bind the reviewed payload
SHA and the reviewed integration-head SHA, return `PASS` or `PASS WITH FLAGS`,
and name its review path. A later evidence-only tail after the reviewed
integration head is acceptable only when the intervening commits are
allowlisted evidence/index refreshes and deterministic refresh verification has
passed. This supersedes stale lead-review fields from the original
payload-head readiness comment; it does not change the owner payload
authorization.

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

The canonical read-only preflight uses the same trusted command with
`--dry-run`:

```powershell
npm.cmd run integrate:authorized-pr -- --repo meijer1973/4veco-platform --pr <pr> --authorization-comment-id <comment-id> --dry-run
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

A single-PR dry-run validates authorization, branch protection, review state,
payload lineage, base drift, current-head CI, live PR/base/thread state, and
readiness decision inputs entirely in memory. For a current head it also
performs the immediate pre-merge head, `main`, and ancestry rechecks. It then
returns `phase: validated_dry_run` with `retry_required: false`; it never
fabricates a merged PR or merge commit.

The machine result includes `dry_run.checks_evaluated`,
`dry_run.would_update_branch`, and exact `not_executed` states for status,
comment, and readiness publication; branch update; retry polling; CI dispatch;
merge invocation; merge observation; containment; and post-merge CI. A current
head reports `refreshed_head_checks: not_applicable`. A behind head re-fetches
both `main` and the PR head, reports `would_update_branch: true`, and records
`refreshed_head_checks: not_executed_requires_branch_update`; exact refreshed-
head CI, readiness, and final pre-merge validation remain for the trusted live
lane after synchronization. A movement observed on either path retains the
existing movement phase, fails that dry run without retry polling, and asks for
a fresh invocation.

`--dry-run --no-merge` remains implementation-supported as a temporary
compatibility spelling and must return the same complete dry-run contract.
Plain `--dry-run` is the documented contract. Live `--no-merge` remains a
separate integration-validation mode and is not a substitute for dry-run.

No dry-run may dispatch CI, update a branch, create or update comments, publish
readiness, set any `integration-authorized` status, invoke or observe a merge,
verify containment, or wait for post-merge CI. A failed non-movement gate keeps
its normal fail-closed classification; a dry-run containment failure is no
longer possible because containment is a live post-merge operation.

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

Those `exact_members` are immutable reviewed payload coordinates. A
lesson-first result must also carry the canonical order-specific integration
contract declaring that the runtime lane will refresh the generated agent
indexes after the lesson merge and before platform PR CI. The matrix runs the
trusted platform-`main` generator and freshness checker against explicit
candidate roots for each simulated state; candidate-branch scripts are not
trusted or executed.

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
merge order, merges the first member at its expected head, refreshes and
revalidates the second member when needed, verifies the exact intermediate
platform CI state, merges the second member, and requires final platform CI
against final platform `main` plus final lesson `main`.

For lesson-first order, the lesson merge commit normally differs from the
reviewed lesson payload SHA. After verifying that merge commit, the lane skips
the now-stale platform-`main` intermediate check. Trusted platform-`main` code
clones the exact platform head and exact lesson merge commit into isolated
checkouts, regenerates the four
`reports/github-agent-index-{platform,lessen}.{json,md}` files with canonical
source labels and the lesson merge committer timestamp, runs the trusted
freshness checker, repeats generation to prove deterministic hashes, and
permits no other generated paths. The resulting commit must change a non-empty
subset of those four files; files whose canonical bytes are already current
remain unchanged. The lane verifies all four outputs and their hashes, verifies
the commit's exact parent and actual path subset before push and after refetch,
then pushes the index-only fast-forward descendant and verifies payload lineage.
It then runs platform PR CI bound to the refreshed platform head and
lesson merge commit, rebuilds exact-head readiness, and repeats the final live
head, base, review, mergeability, and CI checks before platform merge. No
candidate checkout script or hook is executed by this privileged refresh.

Compatibility remains an immutable payload proof. The runtime lane records a
separate validated `integration_refresh` proof binding payload SHAs, lesson
merge commit, refreshed platform head, the actual non-empty changed-path
subset, all four verified paths and deterministic file hashes, lineage,
exact-head readiness, and exact CI coordinates. Partial resume is explicit and
idempotent: `--allow-partial-resume` may verify an already-merged lesson and
reuse the one valid refresh descendant, while stale or tampered descendants,
mixed SHAs, or any non-fast-forward movement fail closed. Final platform-main
CI after both member merges is unchanged.

When the residual controller is behind current platform `main` or does not yet
have its canonical generated-index descendant and exact-pair CI, the trusted
lane must first run with `--prepare-only`. Preparation is valid only for a
validated partial resume. It may perform an exact-head conflict-free branch
update and stop for renewed compatibility, then create or reuse the canonical
index-only descendant and obtain CI bound to that platform head and the current
lesson merge. It re-fetches both `main` refs and the controller head before
returning `prepared_integration_head`. It must not construct or publish
readiness, create a reusable success status, merge a PR, or run post-merge CI.
`--prepare-only` is mutually exclusive with `--dry-run` and `--no-merge`.

The required operational order is preparation, then a completely green dry
run over the prepared immutable head, then the live integration. Repeated
preparation may only reuse the same verified canonical descendant and exact-pair
CI. The hosted workflow exposes the preparation phase through `prepare_only`;
it does not confer merge authority because trusted integrator code stops before
the readiness and merge stages.

There is one explicit fail-closed exception to the phrase "completely green dry
run." When current lineage requires an integration-delta lead review, dry-run
cannot publish and re-fetch the exact integration-head readiness record that
binds that review. Its required terminal result is therefore
`integration_delta_lead_review_required` with
`dry_run_cannot_validate_integration_delta_review`, not `validated_dry_run`.
That result is an intentional stop, never a merge authorization or a simulated
success. The owner-authenticated live lane may proceed only after the exact-head
delta review and renewed human authorization independently satisfy their gates.

If a lesson-first partial resume has no exact readiness comment for the
controller's reviewed payload, the lane may use the residual-bundle readiness
bridge. This bridge does not create or backdate a payload-head comment. It
requires all of the following:

- the lesson PR is merged from the exact authorized lesson payload, its merge
  commit is current lesson `main`, and its exact payload readiness comment
  contains a matching passing lesson lead review;
- the controller payload is an authorized ancestor of the current integration
  head with no substantive or authority-changing tail;
- the existing index-only integration descendant is regenerated in isolation
  and byte/commit-shape verified, including in dry-run mode;
- compatibility workflow provenance and exact immutable member coordinates are
  revalidated, including in dry-run mode;
- a completed successful platform CI run is proven to bind the exact current
  platform head and lesson merge commit; dry-run may reuse it but may not
  dispatch a replacement;
- a separate payload lead-review JSON record is supplied with
  `--payload-lead-review <file>`. It must have `schema_version: 1`, result
  `PASS` or `PASS WITH FLAGS`, a non-empty review path, and exact `repository`,
  `pr_number`, `bundle_id`, and `reviewed_payload_head_sha` fields.

The payload lead-review record is review evidence, not authorization. The lane
must not derive it from `APPROVE_BUNDLE_AND_MERGE`, discover arbitrary passing
files from the candidate branch, or substitute an old readiness comment. The
bridge always constructs an L4 `READY_FOR_HUMAN_REVIEW` decision from live PR
facts and the validated authorization, compatibility, lineage, lesson review,
payload review, branch protection, deterministic refresh, and exact-pair CI.
The integration refresh attestation binds the reviewed controller payload,
current integration head, reviewed lesson payload, lesson merge commit,
authorization comment, compatibility proof, review paths, and CI run
coordinates.

In dry-run mode that decision remains in memory and is passed to final preflight
without publication. A successful residual bundle dry-run reports
`would_create_exact_head_readiness` and stops at `validated_dry_run`. In live
mode the lane publishes the current
integration-head decision, re-fetches its exact marker and full machine record,
and requires the canonical decision digest, route, repository, PR, and head to
match the just-recomputed decision before final head/base/thread checks and
merge. Publication failure, malformed re-fetch, digest mismatch, or any later
head/base movement stops the lane.

The hosted workflow transports this narrowly scoped record through the optional
`payload_lead_review_json` dispatch input, writes it only to runner-temporary
storage, and passes that path to trusted-main integrator code. Omitting the
record is valid only when an exact payload readiness decision already exists;
it is never an evidence waiver.

When refreshed platform lineage reports substantive base overlap requiring an
integration-delta lead review, dual review binding is mandatory. The canonical
payload lead review remains bound to the immutable platform candidate; a
separate JSON record supplied as `--delta-review <file>` must pass and bind that
payload plus the exact final platform integration head. The lane validates this
record before constructing the schema-v2 readiness attestation, calling the
readiness router, publishing a comment, or merging. Missing, malformed,
wrong-payload, wrong-head, non-passing, or unexpected delta evidence fails
closed. Create the record only after the terminal generated-index head exists;
any later head movement invalidates it.

The hosted `authorized-bundle-integration` dispatch does not transport local
review files. Delta-required resumes therefore use the owner-authenticated local
trusted-main command. A hosted invocation without the required record must stop
at the delta-review gate; workflow dispatch is not an evidence waiver. A dry-run
whose current platform lineage requires a delta review must return an explicit
failure rather than report a simulated `merged_bundle`: it cannot publish and
re-fetch exact integration-head readiness.

Cross-repository bundle mutations use `CROSS_REPO_BUNDLE_TOKEN`, a fine-grained
token from the existing owner account restricted to `4veco-platform` and
`4veco-lessen`. The ordinary repository `github.token` may be used only for
platform-local artifact reads. The bundle integrator fails closed unless the
cross-repository token can access both repositories with merge-capable
permissions.

For every intermediate and final bundle state, the integrator first observes
the exact automatic `platform-ci` `push` run newer than the state-transition
run-id floor. A queued or running automatic run counts as present and is awaited;
the lane must not dispatch a duplicate. A completed red run or a run whose
downloaded `platform-ci-evidence.json` names the wrong Platform or Lesson SHA
fails closed and is not masked by a fallback.

Only when no qualifying automatic push run appears may the lane dispatch a
manual fallback. It records a new immediate pre-dispatch run-id floor, passes
then performs one final exact-event recheck against the original transition
floor. If that recheck finds a queued, running, or completed automatic push run,
the lane awaits and verifies it and must not dispatch. Only a proven absent
recheck may proceed with full `y1_base_sha` and `y1_head_sha` workflow inputs;
the lane accepts only a newer `workflow_dispatch` run. The Y1 range is the Platform transition: old Platform
main to new Platform main for a Platform merge, or `base == head ==` current
Platform main when only Lesson changed. The range must be identical or prove
the base is an ancestor of the exact head. Both automatic and fallback paths
download the evidence artifact and verify the exact Platform/Lesson state. A
stale green run for the same Platform SHA but an older Lesson SHA is excluded by
the transition floor and is not valid evidence.

If any bundle member has already merged and a later CI or orchestration check
fails, the terminal result is
`merged_but_postmerge_verification_failed`. It retains the original
`verification_subphase`, all diagnostics, and every completed merge record so
operators cannot mistake a post-irreversible verification failure for a
pre-merge rejection.

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
