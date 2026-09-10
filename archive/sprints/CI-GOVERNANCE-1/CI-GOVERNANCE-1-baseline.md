# Sprint CI-GOVERNANCE-1: Baseline

Generated: 2026-06-06

## Plan reference

Plan: `reports/sprints/CI-GOVERNANCE-1-plan.md`

## Baseline Inputs

- `CI-REMOTE-1A` recorded branch protection requiring `validate-platform`,
  strict checks, admin enforcement, no force pushes, and no deletion.
- `CI-GATE-PROOF-1` closed with remote CI proof and pointed to
  `CI-GOVERNANCE-1` as the next possible hardening sprint.
- Live branch-protection API response on 2026-06-06:
  - `strict`: `true`
  - `contexts`: [`validate-platform`]
  - `enforce_admins`: `true`
  - `allow_force_pushes`: `false`
  - `allow_deletions`: `false`

## Current Evidence Gap

The live policy has been checked through `gh api`, but there is no reusable
checker that future agents can run to detect drift. A future settings change
could weaken branch protection without producing a code diff.

## Data integrity notes

No protected reference data changed during baseline capture.
`references/machine/` and `references/external/` remain unchanged. The baseline
does not mutate `source-data/`, generated Book 1 lesson output,
target-exercise registries, candidate storage, PV outputs, or product routes.

## Stop Condition Review

The available `gh api` command can read branch protection for
`meijer1973/4veco-platform` `main`, so implementation may proceed. If that
permission disappears, the sprint must stop and record the manual-only blocker
rather than adding secrets or weakening policy.
