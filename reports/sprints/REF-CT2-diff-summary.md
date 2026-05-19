# Sprint REF-CT2: Diff Summary

## Summary

REF-CT2 adds a reproducible precision and semantic dual-coding audit for the 12 active-v5 Book 1 records from REF-CT1 and moves the roadmap from `v2.49-ref-ct1-year1-coverage-baseline` to `v2.50-ref-ct2-precision-dual-coding-audit`.

The sprint closes as a non-mutating audit sprint only. CP-6 and Year 1 remain blocked.

## Added artifacts

- Sprint plan, baseline, result, diff summary, assignment, round-1 review, correction log, and round-2 recheck log under `reports/sprints/`.
- Sprint plan/result metadata under `references/data/sprints/`.
- Precision and dual-coding audit JSON under `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`.
- Precision/dual-coding audit, graph/visual evidence, and CP-6 status reports under `reports/reference-planning/`.
- REF-CT2 read-only builder and checker under `build-scripts/references/`.
- Roadmap archive snapshot under `docs/roadmaps/outdated/reference-team-roadmap-v2.49-ref-ct1-year1-coverage-baseline.md`.

## Changed roadmap state

- `REF-CT2` moved to Closed Sprints as completed.
- `REF-CP6 Year-1 CP-6 Remediation And Review Readiness` was inserted as the active top Sprint Ledger row.
- `REF-CT3 Year-2 Skeleton` remains planned after the CP-6 remediation/readiness decision.
- The stale Immediate Next Sprint text was updated from REF-CT1 to REF-CP6.
- The roadmap version index JSON and Markdown were aligned with active version `v2.50-ref-ct2-precision-dual-coding-audit`.

## Protected surfaces

Protected surfaces were not mutated:

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `../4veco-lessen`

The sprint did not mint units, promote target exercises, replace placeholders, close CP-6, close Year 1, or authorize student-facing/product uses.

## Generated map/report refresh

Normal map and report refresh updated:

- `reports/json/*`
- `reports/markdown/*`
- `reports/github-agent-index-platform.*`
- `reports/github-agent-index-lessen.*`
- `reports/url-index.md`
- `references/data/source_manifest.json`
- `references/data/document_inventory.json`

## Audit findings

- 12 active-v5 Book 1 records audited.
- 9 records are visual/graph-heavy.
- 12 records have some semantic evidence in inspected surfaces/assets, but that is not enough for closure.
- 3 records remain placeholders.
- 2 records have source/lesson topic mismatches: `1.3.2` and `1.3.3`.
- 1 record has L1.6R `pass_with_flags` evidence but a remaining Part A `FLAG`: `1.1.3`.
- 9 records rely on legacy quality-ref shapes.
- 0 records are CP-6 quality-ready.
