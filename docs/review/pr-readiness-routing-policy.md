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
executor applies only the allowed GitHub transition after re-fetching the PR.

## Routes

| Route | Use when | Action |
|---|---|---|
| `KEEP_DRAFT_REVISE` | Implementation, CI, checker proof, packet structure, lead review, rendered proof, review threads, bundle completeness, or merge readiness is deficient. | Keep draft, return concrete corrections to implementation, do not contact the owner. |
| `KEEP_DRAFT_BATCH` | Human review will eventually be required, but the current PR is a thin fragment that can safely be combined with a coherent related milestone. | Keep draft, name the next bundle target, continue within authorized scope, do not contact the owner. |
| `READY_FOR_LEAD_ONLY` | L0/L1 or valid owner-preapproved L2 work is complete, current-head evidence is green, lead review is passing, and no human-value decision is hidden. | Mark ready, do not request product review, merge only when packet and branch protection permit. |
| `READY_FOR_HUMAN_REVIEW` | Human review is required and the PR/bundle is substantial or a consequential exception. | Mark ready and present one consolidated human handoff. Never auto-merge. |
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

Do not accept stale proof:

- CI proof must apply to the current remote head.
- The decision records the reviewed remote head SHA.
- The executor re-fetches before transition and aborts if the head changed.
- Lead review may predate the remote head only for a narrowly defined
  evidence-only tail such as lead-review records, packet metadata, or
  regenerated indexes.
- Any substantive source, product, governance, checker, generator, or lesson
  change after lead review requires re-review.

## Branch protection

Use `build-scripts/ci/check-branch-protection.js` in read-only mode. If a PR is
substantively lead-only but branch protection still requires an independent
GitHub-account approval, record that as an infrastructure constraint. Do not
weaken branch protection in this workflow.

## Live decision recording

Do not commit per-PR decisions to the same branch after reviewing its head.
Record live decisions as idempotent GitHub comments keyed by:

```text
<!-- 4veco-pr-readiness:<repo>:<pr>:<head-sha> -->
```

The repository contains the reusable policy, schema, fixtures, and tooling, not
self-invalidating committed decisions for every PR.
