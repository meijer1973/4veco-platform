# Sprint CI-EVIDENCE-1: Baseline

Generated: 2026-06-06

## Plan reference

Plan: `reports/sprints/CI-EVIDENCE-1-plan.md`

## Baseline state

- `platform-ci` checks out `4veco-platform` and `4veco-lessen` as sibling
  repositories.
- `CI-REMOTE-1A` records run `26954512486` and platform commit
  `9f6e5cbf645143bcf06de3bd2800e7cb226b6877`.
- The workflow does not currently upload a JSON artifact that records the
  exact `4veco-lessen` SHA used by a run.
- The existing `platform-ci-diagnostics` artifact uploads command logs,
  report JSON, and `reports/url-index.md`.

## Data integrity notes

No protected reference data is in scope. `references/machine/` and
`references/external/` remain unchanged. No generated lesson output,
source-data, target registries, candidate storage, PV outputs, or product
route files are in scope.

## Stop conditions

Stop if the evidence file would dirty either checked-out repository, if the
lesson target path cannot be resolved, or if artifact upload needs unavailable
permissions.
