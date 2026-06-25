# PR Readiness Routing Policy

Status: active governance policy for draft-to-review routing.
Created: 2026-06-22.

## Purpose

This policy removes the unnecessary owner checkpoint between "draft PR is
complete" and "PR may leave draft." A draft PR is an implementation workspace
and CI surface. Owner permission is not required merely to run `gh pr ready`
when independent readiness evidence supports that transition.

This policy does not weaken `docs/review/pr-throughput-policy.md`. Human review
remains mandatory for L3 and L4 work and for consequential exceptions.

## Role boundary

The Lead Reviewer judges specification fulfilment, substantive quality,
specialist-review needs, evidence completeness, and closure readiness.

The PR Readiness Reviewer judges lifecycle routing: remote PR state, authority
level, human-review payload, batching opportunity, stale proof, branch
protection, bundle completeness, and the correct recipient of the completed
work.

The implementation agent acts on the routing decision. The deterministic
executor applies only the allowed GitHub transition after re-fetching the PR
immediately before mutation.

If a decision routes to `READY_FOR_LEAD_ONLY` or `READY_FOR_HUMAN_REVIEW` and
returns `allowed_transition: MARK_READY`, applying that transition is mandatory.
Owner authorization never gates `gh pr ready`; owner authorization gates only a
later merge when the route requires human review. Use
`npm.cmd run route-and-apply:pr-readiness -- --pr <number> --evidence
<evidence.json> --expect-transition MARK_READY` to collect live evidence,
merge explicit supplemental proof, classify, record, and apply the expected
draft-ready transition in one operation.

## Routes

| Route | Use when | Action |
|---|---|---|
| `KEEP_DRAFT_REVISE` | Implementation, CI, checker proof, packet structure, lead review, rendered proof, review threads, bundle completeness, or merge readiness is deficient. | Keep draft, return concrete corrections to implementation, do not contact the owner. |
| `KEEP_DRAFT_BATCH` | Human review will eventually be required, but the current PR is a thin fragment that can safely be combined with a coherent related milestone. | Keep draft, name the next bundle target, continue within authorized scope, do not contact the owner. |
| `READY_FOR_LEAD_ONLY` | L0/L1 or valid owner-preapproved L2 work is complete, current-head evidence is green, lead review is passing, and no human-value decision is hidden. | Mark ready. In single-account mode, the agent may merge after exact-head CI, lead review, readiness proof, and clean review-thread state pass. |
| `READY_FOR_HUMAN_REVIEW` | Human review is required and the PR/bundle is substantial or a consequential exception. | Mark ready and present one consolidated human handoff. Merge only after an explicit owner merge decision tied to the reviewed payload head and decision scope. |
| `PAUSE_ESCALATE` | A genuine blocker cannot safely be resolved by implementation, testing, specialist review, batching, or conservative classification. | Pause and escalate the blocker. |

## Authority and consequence axis

Use the L0-L4 ladder from `docs/review/pr-throughput-policy.md`. Highest risk
wins across all paired PRs.

Human review is mandatory for:

- protected references, machine references, or external references
- product, curriculum, inspection, school-facing, or target-finality authority
- diagnostics, mastery, PV, adaptive routing, summative use, student-facing AI,
  student use, or product use
- generated lesson output unless an exact owner-preapproved L2 lane applies
- high-authority cross-repository bundles
- review-gate closure
- PR-review autonomy policy or enforcement
- this PR Readiness Reviewer or its transition executor
- workflow permission increases, secret access, `pull_request_target`, or
  equivalent elevated execution
- changes to who may autonomously merge
- deletion or material weakening of review evidence requirements

These are human-review exceptions even when the diff is small.

## Human-review payload axis

Classify payload independently:

- `none`: no valuable human decision is present.
- `thin`: human-gated surface exists, but this unit is an isolated small fix or
  incomplete fragment that should normally be batched.
- `substantial`: a complete coherent product increment, gate packet, review
  family, chapter/paragraph product, architecture decision, or cross-repository
  bundle is ready.
- `consequential_exception`: the diff may be small, but authority, blast
  radius, novelty, irreversibility, or governance impact requires immediate
  human review.

A human-review candidate must answer what exact decision is requested, what
coherent product or authority surface is reviewed, why now, what tests and
subagent review already discharged, whether batching is safe, and what becomes
authorized or blocked after approval.

## Evidence and stale-proof rules

The reviewer must inspect actual GitHub evidence for the exact PR: repo, PR
number, URL, title, body, state, draft status, base, remote head SHA, changed
paths, diagnostic diff stats, merge state, status checks, review decision,
unresolved review threads, throughput packet, checker result, lead review,
paired PRs, and observable branch protection.

Remote GitHub evidence is immutable. Supplemental evidence may add only
throughput classification, batching rationale, bundle metadata, checker
records, branch-protection observations, and lead-review references. It must
not replace PR identity, head SHA, state, base, changed paths, mergeability,
status checks, review decision, requested-changes state, or unresolved thread
state.

Do not accept stale proof:

- CI proof must apply to the current remote head and must include the protected
  `validate-platform` context. Supplemental evidence may add stricter
  contexts, but it must not remove `validate-platform`.
- The decision records the reviewed remote head SHA.
- The executor re-fetches immediately before transition and aborts if the repo,
  PR number, base, state, or head changed.
- Lead review may predate the remote head only for a narrowly defined
  evidence-only tail: lead-review round records, lead-review
  correction/disposition records, generated command logs, generated URL and
  agent indexes, or generated internal dashboard projections.
- Evidence-only tails must be computed from the actual GitHub comparison
  between the lead-reviewed SHA and current head. Self-declared
  `evidence_only` labels are not proof.
- Sprint plans, sprint results, gate decisions, review packets, and result
  metadata are substantive by default and require re-review unless a later
  policy explicitly names a narrower mechanical exception.
- Review-thread and requested-changes evidence must be complete. Paginate
  GitHub review-thread and change-request review connections, or fail closed
  when pagination metadata is unavailable or incomplete.
- Any substantive source, product, governance, checker, generator, or lesson
  change after lead review requires re-review.

## Cross-repo bundles

A platform PR with a paired lesson PR must be classified as
`cross_repo_bundle`. Readiness requires one `bundle_id`, controller platform PR
metadata, exact platform and lesson PR numbers, exact payload SHAs, both PRs
open and mergeable, complete `paired_prs` metadata, and a green bundle
compatibility proof.

The readiness proof must also carry expected `exact_members` values for the
live platform base, platform candidate, lesson base, and lesson candidate. A
delegated lesson member must record its own `current_member` repository, PR
number, current head SHA, and reviewed payload SHA in addition to the platform
controller and paired PR metadata.

The compatibility proof must come from the platform controller and must record:

- platform base SHA;
- platform candidate SHA;
- lesson base SHA;
- lesson candidate SHA;
- `platform-first`, `lesson-first`, and `bundle-final` results;
- permitted merge orders and the recommended merge order.

`bundle-final` success alone is insufficient. At least one intermediate state
must also be green, otherwise the bundle stays `KEEP_DRAFT_REVISE` until a
compatibility bridge makes a safe merge order possible.

Draft paired members are not merge-ready. A narrow controller-first transition
exception exists only for platform-controller mark-ready decisions: an exact
lesson member may count as `transitionable`, not merge-ready, when it is open,
current, mergeable, draft, exact-head matched, lead-reviewed, and covered by
green `platform-first` plus `bundle-final` compatibility. The resulting
decision may mark the platform controller ready, but must record
`merge_ready: false` and the transitionable draft member in the bundle proof.
After the platform controller is non-draft, rerun delegated lesson readiness;
only then may the lesson member receive its own `MARK_READY` transition. Any
stale head, closed PR, conflict, missing compatibility, missing lead proof, or
non-platform-first compatibility must stay `KEEP_DRAFT_REVISE`.

When the exact matrix proves `lesson-first` and `bundle-final` green while
`platform-first` is red, the platform controller may still route
`READY_FOR_HUMAN_REVIEW`. That route records `bundle_delegated_ci: true` and
does not claim ordinary `validate-platform` success for the controller head.
The authorized bundle integrator must merge the lesson member first, then run a
fresh ordinary `validate-platform` check against the platform candidate and the
new lesson `main` before the platform merge.

The highest-risk member determines the review lane. Generated lesson output,
product-authority changes, protected/reference changes, review-governance
changes, and other L3/L4 surfaces still require human review even when the
bundle matrix is green.

Lesson-repository bundle members may consume delegated proof from the platform
controller. Do not require the lesson PR to carry a standalone platform
branch-protection context on its commit, but do require exact bundle membership,
open member state, payload SHA match, green delegated controller proof, and a
non-draft paired platform controller before the lesson member can receive
`MARK_READY`.

## Branch protection

The platform repository operates in single-account mode: the owner, coding
agent, lead-review subagent, PR author, and merger may share one GitHub account.
GitHub approval count is therefore not a substantive review signal for this
repository. Branch protection must require pull-request workflow and strict
`validate-platform`, but `required_approving_review_count` must be `0`.

Use `build-scripts/ci/check-branch-protection.js` in read-only mode. It must
fail if branch protection drifts back to requiring a distinct approving GitHub
review, because that would require an identity the operating model does not
have. Do not use admin bypass as the normal solution, and do not weaken strict
status checks, admin enforcement, force-push protection, or deletion
protection.

PR readiness must derive any mechanical approval constraint from the observed
`required_approving_review_count`, either from flattened readiness proof or the
nested branch-protection checker output. Count `0` means no mechanical approval
constraint; any higher count is a merge constraint; absent or unobservable count
keeps the PR in revise. Self-declared identity-satisfaction flags are not
authoritative.

When bypass allowances are visible, they must be empty. If GitHub does not expose
them in the inspected response, record that limitation instead of claiming the
allowances were verified.

Merge authority is separate from GitHub approval count:

- L0-L2 may merge through the normal merge path only after exact-head CI,
  checker proof, lead review, PR-readiness proof, and complete review-thread
  evidence all pass.
- L3-L4 and consequential governance/self-modification work must stop after
  `READY_FOR_HUMAN_REVIEW` until the owner gives an explicit merge decision.
- The human decision must identify the PR number, reviewed payload head SHA,
  decision, and decision scope. A PR comment is the preferred audit record.
- Immediately before any merge, the implementation agent must re-fetch the PR
  and verify the current integration head, open/not-draft state, mergeability,
  required CI, and review-thread/requested-changes state.

After the serialized integration lane is operational, merge authority is carried
through `docs/review/pr-integration-lane-policy.md`. A human decision binds to
the `reviewed_payload_head`; the lane may refresh to a later `integration_head`
without re-review only when lineage and base drift checks pass. PR readiness may
include `proof.human_authorization` and `proof.integration` so the final comment
shows both the reviewed payload SHA and the validated integration head.

The current integration head is machine-validated, not separately
human-authorized. A permitted base-sync descendant or deterministic evidence
refresh does not require renewed owner authorization unless lineage, base drift,
authority scope, or effective payload checks invalidate the reviewed payload
authorization.

## Live decision recording

Do not commit per-PR decisions to the same branch after reviewing its head.
Record live decisions as idempotent GitHub comments keyed by:

```text
<!-- 4veco-pr-readiness:<repo>:<pr>:<head-sha> -->
```

The repository contains the reusable policy, schema, fixtures, and tooling, not
self-invalidating committed decisions for every PR.

The comment is the durable per-head audit record. It must include a concise
proof summary: CI context/head, checker commands, lead-review path/result and
reviewed SHA, evidence-only tail status, and branch-protection constraint.
It must also include either the full validated machine decision or a canonical
digest over that decision. The current renderer records both. A marker and
`Route:` line alone are not sufficient authority for transition or merge logic.

The serialized integration lane recomputes PR readiness from trusted workflow
code for the exact integration head. It may use the payload-head readiness
decision as evidence for the reviewed payload, but the final integration-head
comment must be produced from fresh live PR facts, live branch protection,
validated human authorization, and validated integration lineage.
