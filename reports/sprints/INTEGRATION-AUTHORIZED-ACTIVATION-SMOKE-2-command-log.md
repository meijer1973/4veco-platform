# INTEGRATION-AUTHORIZED-ACTIVATION-SMOKE-2 Command Log

Date: 2026-06-29.

Purpose: minimal activation smoke PR for the protected `integration-authorized`
lane after PR #173 merged.

Scope:

- No product, IQS, MTU, lesson, generator, policy, or workflow payload.
- Report-only marker to exercise PR Readiness, exact-head authorization,
  `integration-authorized` status minting, GitHub auto-merge scheduling, merge
  observation, and post-merge `main` CI under activated branch protection.

Expected behavior:

- PR starts as draft.
- PR Readiness promotes only after exact-head proof.
- Merge occurs only through `npm.cmd run integrate:authorized-pr`.
- Activated branch protection consumes both `validate-platform` and
  `integration-authorized`.
