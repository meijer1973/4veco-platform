# Sprint REVIEW-THROUGHPUT-3: Diff Summary

Generated: 2026-06-22

## Summary

This diff adds the PR Readiness Reviewer lane and the tooling needed to classify a draft PR after it is remotely inspectable. The implementation keeps the pure router separate from GitHub collection and state mutation, so fixture tests cover classification while live commands collect evidence read-only and apply only the explicit safe transition.

## Main changes

- New reviewer role and policy docs: `agents/pr-readiness-reviewer-agent.md`, `docs/review/pr-readiness-routing-policy.md`, and `docs/review/pr-readiness-decision.schema.json`.
- New review-gate tooling: `build-scripts/review-gates/pr-readiness-router.js`, `review-pr-readiness.js`, and `apply-pr-readiness-decision.js`.
- New fixture and Jest coverage for L0/L1/L2 ready routes, L3/L4 human-review routes, batching, pause/escalate, stale CI/lead proof, evidence-only tails, merge blockers, unresolved review threads, branch-protection constraints, workflow-permission escalation, and stale-head executor refusal.
- Additional request-changes hardening coverage for immutable remote evidence, explicit autonomous proof, waiver rejection, final pre-transition refetch, GitHub-comparison evidence tails, protected `validate-platform` context, governance-surface manifest coverage, and decision invariant validation.
- New L0/L1/L2 throughput helper constructors in `build-scripts/review-gates/review-throughput-fields.js`.
- Package scripts for `review:pr-readiness`, `apply:pr-readiness`, and `check:pr-readiness`.
- Agent maps, GitHub indexes, URL index, internal dashboard, roadmap ledger, and sprint evidence refreshed.

## Protected surfaces

No protected surfaces changed. The diff does not edit `references/machine/`, `references/external/`, `../4veco-lessen/`, generated lesson output, target-exercise authority, diagnostics, mastery, PV, Scale Gate 1, student-facing AI, summative-use authority, or product/student-use authority.

Branch protection remains read-only observed and unweakened. No `pull_request_target`, broad write-permission workflow, forced merge, branch-protection bypass, or L3/L4 auto-merge path is introduced.

## Review status

Lead review round 1 returned REVISE for live review-thread/mergeability fail-closed behavior, helper-packet normalization, and per-PR live decision artifacts. Corrections were applied, and round 2 returned PASS WITH FLAGS. The remaining flags are operational: the governance implementation PR requires human review, and future branch-protection automation identity remains an infrastructure decision.
