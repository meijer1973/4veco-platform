# Agent Publication Workflow

Read when preparing remote review evidence, publishing a branch/PR, applying
readiness or integrating a change. Paths in code spans are repository-relative.
This retains the operational requirements formerly in root AGENTS.md; the
[readiness policy](pr-readiness-routing-policy.md),
[throughput policy](pr-throughput-policy.md) and
[integration policy](pr-integration-lane-policy.md) remain authoritative.

### Remote publication and repository maps

Off-site reviewers use GitHub as their working surface. A local commit is not complete until the remote branch and repository maps are current enough for those reviewers to inspect the work.

Normal closure for non-trivial work now includes:

- run `git fetch --prune origin` before final commit/push and resolve any behind/diverged state explicitly
- refresh repository maps and GitHub-facing indexes whenever paths, roadmaps, generated reports, agents, skills, or review surfaces change: `npm.cmd run agent:index`, `node build-scripts/sprints/emit-url-index.js`, and `npm.cmd run dashboard:internal` when dashboard or roadmap state changes
- keep `RESEARCH_AGENT_MAP.md`, `RESEARCH_AGENT_MAP_REFERENCES.md`, `AGENT_GITHUB_ENTRY.md`, `reports/url-index.md`, and `reports/github-agent-index-*.md` aligned with the real repository layout
- after validation, commit and push to the normal remote branch unless the user explicitly asks to keep work local
- do not leave a completed sprint or non-trivial generated-output task in a dirty local worktree; if a blocker prevents commit/push, report the exact dirty status and blocker before ending
- report both the local commit hash and whether it has been pushed

Human-review packets have an extra remote-publication rule:

- before sending, running, or recording a human-review packet, push the packet
  and every cited evidence artifact to the normal remote branch, refresh the
  GitHub-facing maps/indexes, and verify the remote is current enough for an
  off-site reviewer to fetch the files. Do not ask for or close a review gate
  against local-only evidence unless the user explicitly orders a local-only
  dry run.

Human-review gates require actual review artifacts. Do not treat a casual
"OK", "continue", or inferred approval as a completed human review when the
plan requires reviewer comments, a decision record, or a gate-closure file.
All other requirements for sprints are also required for human review. A
checkable plan is made beforehand and tested afterwards so the review has an
actual audit log.

Human-review gates use direct review-packet comments by default, not an
interactive one-question-at-a-time interview. The packet must contain the full
calibration checks, planned review questions, evidence links, stop conditions,
and comment prompts so the human reviewer can comment directly on the packet.
After comments are returned, the agent must record a comment-resolution log,
summarize decisions and unresolved issues, ask targeted follow-up questions
only for ambiguous or conflicting authority, and draft closure only after the
comment evidence is complete. Interactive interviews are now an exception for
explicit reviewer request or unresolved ambiguity, not the default gate mode.

Human-review proof must be inspectable in the same shape a reviewer needs to
judge the product. For UI, game, task-shell, route, or exit-ticket gates, a
packet is not ready with text claims or static fixture fragments alone. It must
provide a playable or reproducible artifact when the surface is interactive,
state evidence such as JSON/proof logs, screenshots for initial/retry/feedback/
next-action/completed states where relevant, mobile and dark-mode proof when
the surface is student-facing, and a checker that verifies the proof artifacts
exist. For game/task-shell gates, use the `GATE-TASK-FAMILY-1` pattern unless
there is an explicit waiver: a review-only playable lab or live route, visible
controls a human can use, deterministic proof that the path reaches completion,
and packet/checker requirements for the lab, data, proof JSON, and screenshots.
Present the proof so a human can see where problems are, then decide.

Future PR review packets that request lighter review closure must follow
`docs/review/pr-throughput-policy.md` and include the machine-readable
throughput fields checked by
`build-scripts/sprints/check-review-throughput-packet.js`. Autonomous
classification is never allowed when protected references, machine/external
references, generated-output product authority, diagnostics, mastery, PV,
student-use authority, missing changed-path evidence, missing commit-specific
CI/checker proof, or missing `proof.lead_review` path/result/reviewed-commit
proof is present.

### Post-draft PR lifecycle

After a normal implementation draft PR is published:

1. Publish and validate the remote draft PR.
2. Complete structural lead review and repairs.
3. Run the independent PR Readiness Reviewer with `npm.cmd run review:pr-readiness`.
4. Apply only its allowed transition with `npm.cmd run apply:pr-readiness`, or use
   `npm.cmd run route-and-apply:pr-readiness -- --pr <number> --evidence <evidence.json> --expect-transition MARK_READY`
   when current live evidence and supplemental proof should mark the draft
   ready. Use `npm.cmd run apply:bundle-readiness` when one controller decision
   must mark a paired platform/lesson bundle ready together.
5. Return to the owner only when the route is `READY_FOR_HUMAN_REVIEW`, a
   genuine `PAUSE_ESCALATE` blocker exists, or autonomous closure has completed
   and a final status report is appropriate.

Do not end a normal run by asking: "The draft PR is ready; please approve
before I mark it ready for human review." Owner permission is not required
merely to run `gh pr ready`.

For `KEEP_DRAFT_BATCH`, continue to the next coherent authorized milestone
rather than stopping merely because a PR exists. Do not add unrelated work just
to enlarge a PR, and do not batch across a real decision boundary.

### Single-account merge governance

This repository uses a single-account operating model: GitHub cannot
distinguish the owner, coding agent, lead-review subagent, PR author, and
merger as independent approval identities. Required GitHub approval count is
therefore not the substantive review gate for this repository.

Branch protection for `main` must keep strict status checks, admin enforcement,
force-push protection, deletion protection, required conversation resolution,
and pull-request workflow while setting `required_approving_review_count` to
`0`. The live required context is `validate-platform` only.
`integration-authorized` remains optional audit evidence, not a required
branch-protection context, after the activation smoke test failed closed.
Repository `allow_auto_merge` remains `false`. Validate the live shape with
`npm.cmd run check:branch-protection`. The checker must fail if the approval
count returns to `1` or if observable pull-request bypass allowances are
non-empty. Do not attempt to require `integration-authorized` again without an
explicit owner decision and concrete new GitHub behavior evidence or a different
implementation mechanism.
PR readiness must derive mechanical approval constraints from the observed
approval count, not from self-declared identity-satisfaction flags, and it must
keep the PR draft when that count is not observable.

Merge authority follows the PR-readiness route:

- L0-L2 may merge only through `authorized-pr-integration` or, for paired
  platform/lesson work, `authorized-bundle-integration` after exact-head CI,
  checker proof, lead review, readiness proof, and complete review-thread
  evidence pass.
- L3-L4 and governance/self-modification work must stop after
  `READY_FOR_HUMAN_REVIEW` until the owner gives payload authorization for the
  reviewed payload head and decision scope.
- Owner decisions authorize the reviewed payload head and decision scope. A
  payload authorization must identify the PR number,
  `reviewed_payload_head_sha`, decision, decision scope, merge method, and
  admin-bypass prohibition. Record it as a PR comment when the decision happens
  outside GitHub's review identity model.
- Payload authorization gates merge, not draft-to-ready transition. Owner
  authorization is never required merely to run `gh pr ready` after a valid
  readiness decision returns `allowed_transition: MARK_READY`.
- Immediately before merging, the authorized lane re-fetches the PR and verifies
  the current integration head, open and not-draft state, mergeability, required
  CI, requested-changes state, and unresolved review-thread state. Do not use
  admin bypass as a routine substitute for this policy.

### Serialized integration lane

Agents must not call `gh pr merge` directly for normal PRs. The default
single-PR merge path is the owner-authenticated local serialized lane:
`npm.cmd run integrate:authorized-pr -- --repo meijer1973/4veco-platform --pr <PR> --authorization-comment-id <COMMENT_ID>`.
Run it from current `main`/current policy code so it can validate branch
protection, payload lineage, readiness, CI, review state, merge eligibility, and
post-merge `main` CI before any merge command is invoked.

`.github/workflows/authorized-pr-integration.yml` remains an optional trusted
cloud path only when its `github.token` can read branch protection. If that
workflow returns `phase: branch_protection_read_forbidden`, the token hit the
expected GitHub Administration-read permission boundary; this is not a
governance failure and is not permission to merge directly. Use the
owner-authenticated local lane with the same authorization comment ID.
Paired platform/lesson bundles must use
`.github/workflows/authorized-bundle-integration.yml` or
`npm.cmd run integrate:authorized-bundle`. All authorized paths serialize
through the same policy lane and must validate payload lineage, branch
protection, CI, readiness, requested changes, review threads, and merge
eligibility before merging. The lane may internally invoke a direct merge command
while live branch protection requires only `validate-platform`; that is an
implementation detail of trusted lane code, not agent merge authority.

Payload authorization binds to the reviewed payload head, not to every later
base-sync head. Record payload authorization with the
`4veco-human-payload-authorization` marker and the schema in
`docs/review/human-payload-authorization.schema.json`. The integration lane may
inherit that authorization only when the reviewed payload SHA remains an
ancestor of the current PR head and all intervening commits are conflict-free
base-sync merges or allowlisted deterministic evidence refreshes.

Use this human-facing wrapper while keeping the machine decision enum stable:

```text
HUMAN_DECISION: APPROVE_FOR_INTEGRATION
AUTHORIZATION_TYPE: PAYLOAD_AUTHORIZATION
PR: #...
REVIEWED_PAYLOAD_HEAD: ...
DECISION_SCOPE: ...
MERGE_METHOD: merge commit
ADMIN_BYPASS: prohibited
```

The integration lane validates the current `integration_head_sha`. A later
integration head may be produced by base sync or generated/evidence-only tail
handling. Renewed owner authorization is not required when payload lineage,
effective payload, bundle membership, and authority scope remain valid.
Renewed owner authorization is required when the reviewed payload is not an
ancestor of the integration head, manual conflict resolution changes behavior,
substantive source payload changes, bundle membership changes, decision scope
or authority class changes, or the lane cannot prove lineage/effective-payload
equivalence.

Before the lane may set `integration-authorized`, the PR Readiness Reviewer must
be recomputed inside the trusted workflow for the current `integration_head_sha`.
The lane constructs live integration evidence, validates the resulting machine
decision, and posts or updates the exact-head readiness comment with a canonical
decision digest and full machine decision. A stale readiness marker, marker-only
comment, or non-ready route stops the merge.

The current integration head is machine-validated, not separately
human-authorized. A permitted base-sync or deterministic evidence descendant
does not need renewed owner authorization when payload lineage, base drift,
bundle membership, authority scope, and effective-payload checks remain valid.

The lane must determine base drift from an actual `main...head` comparison, not
from `mergeStateStatus: BLOCKED`; `BLOCKED` is merge-eligibility noise, and in
the retired activation experiment it could simply mean the required
`integration-authorized` status was pending. The lane sets
`integration-authorized` to pending at entry, sets success only on the final
validated head, retries when `main` moves or merge eligibility changes, and
verifies post-merge `main` CI. In the current live mode, the trusted lane uses
the direct merge path with an exact `--match-head-commit` guard after all checks
pass. The retired activated mode scheduled `gh pr merge --auto --merge
--match-head-commit <sha>` while `integration-authorized` was pending and then
observed GitHub auto-merge, but smoke PR #177 proved that required-context mode
was not reliable in this repository setup. Keep that implementation only as
dormant/fail-closed reference unless the owner explicitly reopens it.
The `integration-authorized` context must be
minted only by trusted `main` workflow code or the equivalent owner-authenticated
local lane running trusted `main` code; a dry-run must not create a reusable
successful status.

The activation rollback is complete: `integration-authorized` is not required,
strict `validate-platform` remains required, and repository `allow_auto_merge`
is `false`.

### Mandatory readiness application

When the PR Readiness Reviewer routes a PR or bundle to
`READY_FOR_LEAD_ONLY` or `READY_FOR_HUMAN_REVIEW` with
`allowed_transition: MARK_READY`, the implementation agent must immediately run
`npm.cmd run route-and-apply:pr-readiness -- --pr <number> --evidence <evidence.json> --expect-transition MARK_READY` or
`npm.cmd run apply:pr-readiness -- --decision <decision.json>` after re-fetching
the PR. Reporting "Action taken: none" for such a decision is a process failure.

Before reporting final completion for governance or workflow work, include a
freshness proof that queries remote `main`, compares it with local
`origin/main`, records ancestry, and hashes both remote-main and branch policy
files for this file, `docs/review/pr-readiness-routing-policy.md`, and
`docs/review/pr-integration-lane-policy.md`. Use
`npm.cmd run finalization:freshness`.

#### Paired platform/lesson bundles

Required `platform-ci / validate-platform` always checks the platform
candidate against lesson `main`. It must not use a same-named lesson branch as
a hidden dependency. If a platform PR needs a lesson PR candidate in order to
pass, classify the work as a `cross_repo_bundle` and do not merge either member
independently.

For paired platform/lesson work:

- keep source, validators, governance, and integration proof in
  `4veco-platform`;
- keep generated student-facing output in `4veco-lessen`;
- put the same `bundle_id`, complete `paired_prs`, exact PR numbers, and exact
  payload SHAs in the PR evidence;
- run `.github/workflows/cross-repo-bundle-compatibility.yml` for
  `platform-first`, `lesson-first`, and `bundle-final`;
- keep compatibility `exact_members` bound to the immutable reviewed payload
  heads, and require its lesson-first contract to declare the trusted
  post-lesson-merge index refresh;
- require `bundle-final` green plus at least one green intermediate state;
- when both members are draft but substantively ready, use
  `npm.cmd run apply:bundle-readiness` to post exact-head member readiness
  decisions and coordinate the `MARK_READY` transitions before requesting merge
  authorization;
- record one canonical `4veco-human-bundle-authorization` comment for the
  whole pair when human approval is required;
- merge through `.github/workflows/authorized-bundle-integration.yml` or
  `npm.cmd run integrate:authorized-bundle`, which uses the serialized
  `4veco-main-integration` lane and exact expected heads.

For a lesson-first bundle, the verified lesson merge commit becomes the exact
lesson source for a deterministic generated-index descendant of the reviewed
platform payload. Before platform PR CI, the lane must use trusted platform
`main` generator and freshness-checker code in isolated exact-SHA checkouts,
allow only the four `reports/github-agent-index-{platform,lessen}.{json,md}`
paths, push/refetch the descendant without force, rebuild lineage, and publish
readiness for that exact integration head. Platform PR CI must bind that head
to the lesson merge commit. Keep the immutable compatibility proof separate
from this runtime `integration_refresh` proof. A retry with
`--allow-partial-resume` must reuse a valid existing refresh commit; missing,
stale, mixed-SHA, or tampered refresh evidence stops before platform merge.
If refreshed lineage requires an integration-delta lead review, the immutable
payload lead review remains bound to the reviewed payload SHA and the exact-head
review is carried separately as `proof.integration.delta_review`. Supply that
review as JSON with `--delta-review <file>` only after the final terminal index
head exists; it must pass and bind both the reviewed payload and exact current
integration head. A missing, malformed, stale, wrong-payload, wrong-head,
non-passing, or unexpected delta review stops before readiness attestation,
publication, or merge. The hosted bundle workflow does not transport local
review files, so delta-required partial resume must use the owner-authenticated
local trusted-main lane; invoking the hosted path without that evidence fails
closed and does not waive the review. A delta-required dry-run also fails
explicitly because it cannot publish and re-fetch the exact integration-head
readiness needed to establish this gate.
Do not execute candidate-branch generators or hooks in this privileged phase.
Final platform `main` CI after both merges remains mandatory.

Lesson bundle members consume delegated controller proof. Do not require a
lesson-repository commit to carry a standalone platform branch-protection
context.
