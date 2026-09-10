# Sprint AGENT-BRANCH-SAFETY-1: Baseline

Generated: 2026-06-07

## Plan reference

Plan: `reports/sprints/AGENT-BRANCH-SAFETY-1-plan.md`

## Baseline Inputs

- Platform repo preflight: `git fetch --prune origin`, `git status --short
  --branch`, and `git branch --show-current` showed a clean `main`, so work
  moved to `codex/agent-branch-safety-20260607` before edits.
- Lesson repo preflight: `git fetch --prune origin`, `git status --short
  --branch`, and `git branch --show-current` showed a clean `main`, so work
  moved to `codex/agent-branch-safety-20260607` before edits.
- `platform-ci` exists in `.github/workflows/platform-ci.yml`.
- Required job/context is `validate-platform`.
- `reports/sprints/CI-GOVERNANCE-1-result.md` records main
  branch-protection evidence for strict required status checks, required
  `validate-platform`, admin enforcement, force-push protection, and deletion
  protection.
- `build-scripts/ci/check-branch-protection.js` currently validates:
  - `required_status_checks.strict: true`;
  - required context includes `validate-platform`;
  - `enforce_admins.enabled: true`;
  - `allow_force_pushes.enabled: false`;
  - `allow_deletions.enabled: false`.
- Live branch-protection API response on 2026-06-07 confirmed:
  - `required_status_checks.strict`: `true`;
  - `contexts`: [`validate-platform`];
  - `enforce_admins.enabled`: `true`;
  - `allow_force_pushes.enabled`: `false`;
  - `allow_deletions.enabled`: `false`.
- Dedicated pull-request-review endpoint on 2026-06-07 reported
  `required_approving_review_count: 1`.
- Push restrictions endpoint returned `404 Push restrictions not enabled`.
- Bypass-prevention details were not verified from the inspected API
  responses.

## Current Evidence Gap

The repositories already use CI and branch-protection evidence, but the agent
instructions do not yet explicitly require branch-per-agent work for mutating
tasks. There is also no local preflight checker that fails on `main`, detached
HEAD, divergence, or dirty worktree when clean state is required.

## Data integrity notes

No protected reference data changed during baseline capture.
`references/machine/` and `references/external/` remain unchanged. The baseline
does not mutate `source-data/`, generated Book 1 lesson output,
target-exercise registries, candidate storage, PV outputs, or product routes.

## Stop Condition Review

The platform and lesson repos are both on a dedicated coordinated branch and
clean before implementation. Branch-protection baseline fields match the
required policy. Implementation may proceed within the sprint's allowed
workflow-safety scope.
