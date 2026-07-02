# Lead Review Summary

Sprint: `REVIEW-THROUGHPUT-3`

Round: lead review round 1

## Scope

- Artifact/task: PR Readiness Reviewer role, routing policy/schema, pure router, live reviewer, apply executor, L0/L1/L2 helper constructors, fixtures, branch-protection and dry-run evidence.
- Requested outcome: Determine whether the sprint is structurally ready to proceed to PR-readiness/human-review routing.
- Evidence inspected: `reports/sprints/REVIEW-THROUGHPUT-3-lead-review-assignment.md`, `agents/lead-reviewer-agent.md`, `agents/pr-readiness-reviewer-agent.md`, `docs/review/pr-readiness-routing-policy.md`, `docs/review/pr-readiness-decision.schema.json`, `build-scripts/review-gates/pr-readiness-router.js`, `build-scripts/review-gates/review-pr-readiness.js`, `build-scripts/review-gates/apply-pr-readiness-decision.js`, `build-scripts/review-gates/review-throughput-fields.js`, `build-scripts/review-gates/pr-readiness-router.test.js`, `reports/fixtures/pr-readiness-router/`, `reports/sprints/REVIEW-THROUGHPUT-3-command-log.jsonl`, `reports/sprints/REVIEW-THROUGHPUT-3-branch-protection.md`, and `reports/sprints/REVIEW-THROUGHPUT-3-live-dry-run.md`.
- Reviewed repository and PR, when applicable: local worktree `C:\Projects\4veco-worktrees\REVIEW-THROUGHPUT-3\4veco-platform`; live evidence references `meijer1973/4veco-platform#132`, `#133`, `#42`, `#48`, and `#52`.
- Reviewed commit SHA: local `HEAD` `64ebcae76a37f8fe9a2142556cf564533d721a31` plus staged/untracked worktree changes; live PR `#132` evidence records head `2ddac5b189ce3406d280d8d883841165d337e307`.
- PR-readiness routing suitability: Not suitable yet; core acceptance defects require revision before using this sprint's router for implementation PR routing.
- Human-authority trigger: Yes. This sprint changes review-governance/autonomy machinery and must route to human review after fixes and re-review.
- Batching recommendation: Do not batch with unrelated work; keep as one governance/tooling correction packet.
- Subsequent changes require re-review: Yes, especially router, live collector, executor, policy, schema, fixtures, or command evidence changes.

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Structural lead review | Lead reviewer | Assigned files and current worktree | COMPLETE |
| Router route logic | Source + fixtures | All route states, stale proof, governance escalation | REVISE |
| Live reviewer safety | Source + live dry-run | Exact PR evidence, review threads, mergeability, no self-invalidating live decisions | REVISE |
| Apply executor safety | Source + tests | Stale-head refusal, idempotent comments, no auto-merge | PASS WITH FLAGS |
| L0/L1/L2 helper safety | Source + packet checker tests | Safe helper output and router compatibility | REVISE |
| Branch protection | `check:branch-protection` evidence | Read-only observation, no weakening | PASS WITH FLAGS |
| Forbidden surfaces | Git status/path scan | No lesson output/protected refs/machine/external/product authority changes | PASS |

## Consolidated Verdict

Verdict: REVISE

The sprint has a strong skeleton and real passing test evidence, but three core specification requirements are not met: live review-thread/mergeability fail-closed behavior, router compatibility with the helper/packet field shape, and live per-PR decision recording that contradicts the policy's "comments, not branch artifacts" rule.

## Finding Classification

| Finding | Classification | Blocks | Does not block | Proof required to close |
|---|---|---|---|---|
| Live collector does not actually inspect unresolved review threads and router does not fail closed on mergeability. `review-pr-readiness.js` fetches `latestReviews` but sets `unresolved_review_threads: false`; router only reacts if that flag is pre-supplied. | core_spec_failure | PR-readiness routing and any `gh pr ready` use on live PRs. | Fixture-only classifier demos. | Query unresolved review threads/reviews, route merge conflicts/blocked merge states to `KEEP_DRAFT_REVISE`, add live-wrapper tests. |
| Router does not consume the helper/packet field shape for `review_autonomy.level`, top-level `human_decision_required`, or nested `review_autonomy.owner_preapproval`. The L2 fixture uses `throughput.owner_preapproved`, unlike the helper output. | core_spec_failure | Valid owner-preapproved L2 routing and direct throughput-packet ingestion. | L0/L1 helper construction safety. | Normalize actual packet fields and add tests using direct outputs from `mechanicalAutonomousThroughputFields`, `leadReviewAutonomousThroughputFields`, and `ownerPreapprovedAutonomousThroughputFields`. |
| Live dry-run records per-PR decision artifacts under the sprint reports path, while policy says live decisions should be idempotent GitHub comments, not committed branch artifacts after reviewing the head. | core_spec_failure | Sprint closure and implementation PR readiness. | Keeping summarized dry-run evidence in `reports/sprints/REVIEW-THROUGHPUT-3-live-dry-run.md` and the command log/report. | Remove or avoid per-PR decision artifacts in the branch; prove live decisions are posted or updated by marker comment, or kept outside the reviewed branch. |
| Stale-head refusal exists in executor preconditions and tests. | core_requirement_met | None. | Does not prove live collector completeness. | Retain tests for `head_sha_changed`. |
| Idempotent comment behavior exists in fixture apply tests and marker rendering. | core_requirement_met | None. | Does not prove live comment posting against GitHub. | Add or retain dry-run/live-safe proof for update-vs-create by marker. |
| Governance/self-modification paths escalate to human review in the pure router. | core_requirement_met | None after live evidence fixes. | Does not authorize merge. | Keep fixture coverage for router/policy/executor self-modification. |
| Branch protection is inspected read-only and recorded as an infrastructure constraint, with no weakening observed. | core_requirement_met | Automated merge/approval identity remains a later infrastructure decision. | Draft-to-ready routing after blockers fixed. | Keep branch-protection report and do not add bypass/weakening in this sprint. |
| Forbidden surfaces were not observed in the changed-path set. | core_requirement_met | None. | Does not grant product/student-use authority. | Maintain no changes to lesson output, protected refs, machine/external refs, diagnostics, mastery, PV, Scale Gate 1. |

## Blocking Findings

Blocking findings existed in round 1:

- `BF-1`: Live PR readiness can miss unresolved review-thread blockers and mergeability blockers. This violates the PR Readiness Reviewer required inputs and fail-closed behavior.
- `BF-2`: Router/helper packet shape mismatch means the new helper constructors are not proven through the actual router path, especially L2 owner-preapproved lanes.
- `BF-3`: The live dry-run evidence creates per-PR decision artifacts in the repo, contradicting the sprint's own live decision recording policy.

## Specialist Findings

- No visual, accessibility, teacher-learning, or student-experience specialist review is required; this sprint is platform governance/tooling only.
- Testing evidence was inspected from the command log rather than routed to a separate testing-agent report.

## Test Evidence

- Final targeted suite passed: `3 passed`, `45 passed` for router/helper/throughput packet tests.
- `npm.cmd run check:pr-readiness` passed: `22 passed`.
- `npm.cmd run check:branch-protection` passed and recorded strict required checks plus one required approving review.
- `npm.cmd run check:platform` passed: `50 passed`, `15 skipped`, `773 passed`; stderr includes existing fixture/lesson warnings but exit code was `0`.
- `git diff --check` passed.
- Earlier command-log failures were superseded by later passing reruns.

## Learning Quality Evidence

Not applicable. No classroom-readiness, learning-design, or generated lesson-output claim is in scope.

## Student Experience Evidence

Not applicable. No student-facing route, UI, rendered artifact, or lesson surface is changed in this sprint.

## Ownership and Handoff

- Lesson-side: No action; no lesson output should be changed.
- Platform: Fix live collector/router normalization and decision-recording workflow.
- Asset generation: Not applicable.
- Registry/procedure: Update routing policy/docs/tests if the live-decision evidence convention changes.
- Quality log: Re-run targeted tests, branch-protection check, live dry-run, command-log check, and `git diff --check` after revisions.
- Roadmap/human gate: Human review remains required after lead re-review passes.

## Required Next Action

Revise the live collector/router and evidence workflow for the three blocking findings, remove or replace per-PR live decision artifacts, add regression tests for those cases, rerun acceptance commands, then request lead review round 2 before human review.
