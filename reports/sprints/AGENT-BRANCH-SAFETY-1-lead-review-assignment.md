# Lead Review Assignment

Sprint: `AGENT-BRANCH-SAFETY-1`

Generated: 2026-06-07

## Assignment

Lead reviewer: main-agent structural lead-review pass with verification
subagent support.

Scope/artifact/task:

- Inspect explicit branch-safety policy additions in `AGENTS.md` and
  `../4veco-lessen/AGENTS.md`.
- Inspect the local preflight checker in
  `build-scripts/ci/check-agent-branch-safety.js`.
- Inspect Jest coverage in
  `build-scripts/ci/check-agent-branch-safety.test.js`.
- Inspect the report-only pull-request-review extension in
  `build-scripts/ci/check-branch-protection.js`.
- Inspect sprint evidence and command-log coverage under
  `reports/sprints/AGENT-BRANCH-SAFETY-1-*`.

## Review Plan

The lead review must verify evidence, implementation scope, tests, and
workflow-safety boundaries. It must not replace the required local validators,
remote PR proof, or final main-agent integration judgement.

## Required Evidence

- Branch policy exists in both AGENTS files.
- Checker fails on unsafe Git states and emits JSON.
- Tests cover the required failure cases.
- Package script is present.
- Branch-protection PR-review fields are report-only.
- No protected reference data, source-data, generated lesson output, product
  route, candidate storage, or PV output changed.
- Command-log evidence includes the required acceptance commands that have run
  so far.

## Required Next Action

Run round 1 review, apply or explicitly log corrections, and run round 2
recheck before closure.
