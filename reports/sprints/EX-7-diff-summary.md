# Sprint EX-7: Diff Summary

Date: 2026-05-26

## Primary changes

- Added shared EX-7 candidate validation support under
  `build-scripts/references/lib/`.
- Added read-only candidate and source-annex extraction validators.
- Added dry-run-only CLI wrappers for operation, answer-skill, and
  source-annex extraction candidate specs.
- Added an EX-7 self-checker that creates and removes temporary OS-temp
  fixtures.
- Updated future candidate schemas to distinguish explicit status fields and
  weak versus rejected unit support.
- Refreshed generated reports, dashboard data, source registry, source
  manifest, document inventory, agent indexes, and roadmap index.

## Protected surfaces

No files under `references/machine/` or `references/external/` were changed.
No candidate-storage files were created under `references/data/exam-ingestion/`.
No q19 extraction execution or lesson-output mutation occurred.

## Generated outputs

Generated report and index refreshes are included because EX-7 added new
validators and roadmap artifacts that should be visible to the agent and
reference dashboards.

## Residual risk

The new CLIs are dry-run-only. A later human gate is still required before any
persistent candidate storage, write mode, q19 extraction execution, protected
mutation, or student/product use.
