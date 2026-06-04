# Sprint CI-REMOTE-1A: Baseline

Generated: 2026-06-04

## Plan reference

Plan: `reports/sprints/CI-REMOTE-1A-plan.md`

## Baseline state

- `CI-REMOTE-1` exists and is closed PASS WITH FLAGS.
- The workflow structure is accepted by reviewer comments.
- Existing `CI-REMOTE-1` result records remote success on commit
  `c70cf1cf9320a5de9f8a2f4e490b934ae822246b`.
- A later workflow-hardening commit exists:
  `9f6e5cbf645143bcf06de3bd2800e7cb226b6877`.
- GitHub run `26954512486` proves that later commit, but the repository
  evidence does not yet record it.
- Branch protection requires `validate-platform` and disables force
  pushes/deletions, but baseline API evidence showed `enforce_admins: false`.

## Data integrity notes

No protected reference data is in scope. `references/machine/` and
`references/external/` remain unchanged. No generated lesson output,
source-data, target registries, candidate storage, PV outputs, or product
route files are in scope.

## Stop conditions

Stop if GitHub no longer exposes the current-head run, if branch protection
cannot enable `enforce_admins`, or if any protected/generated output changes.
