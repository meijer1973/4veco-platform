# Sprint REVIEW-THROUGHPUT-3: Baseline

Generated: 2026-06-22

## Plan reference

- Plan: `reports/sprints/REVIEW-THROUGHPUT-3-plan.md`
- Plan metadata: `references/data/sprints/REVIEW-THROUGHPUT-3.plan.json`

## Current state

`REVIEW-THROUGHPUT-1` established the PR throughput policy, review-autonomy
ladder, machine-readable packet field contract, checker, and retrospective.
`REVIEW-THROUGHPUT-2` added a shared packet-field helper and documented that
broad historical-packet CI enforcement waits for migration or an active-packet
allowlist.

The repository does not yet have a bounded PR Readiness Reviewer role, a pure
PR lifecycle router, a live read-only PR readiness collector, a
machine-readable PR-readiness decision schema, or an executor that safely
applies allowed draft-to-ready transitions after re-fetching the remote PR
head.

Baseline branch/worktree state:

- Worktree: `C:/Projects/4veco-worktrees/REVIEW-THROUGHPUT-3/4veco-platform`
- Branch: `codex/pr-readiness-router-20260622`
- Base: `origin/main` at `3d66a5eee977d9c77366764a89593b6300d18c30`
- Worktree safety claim: `npm.cmd run check:agent-worktree-safety -- --claim --task REVIEW-THROUGHPUT-3 --agent codex-pr-readiness-router --require-prefix codex/,agent/ --require-clean` passed.

## Data integrity notes

Protected reference data is not changed at baseline. This sprint must not edit
`references/machine/`, `references/external/`, generated lesson output,
product specifications outside review-routing policy, diagnostics, mastery,
PV, Scale Gate 1, or student/product-use authority. The implementation PR
itself changes governance tooling and must therefore route to human review
before merge.
