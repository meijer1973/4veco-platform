# Sprint REF-CT1: Diff Summary

## Summary

REF-CT1 adds a reproducible Year-1 coverage baseline for active v5 and moves the references roadmap from `v2.48-l16r-dual-coding-incident` to `v2.49-ref-ct1-year1-coverage-baseline`.

The sprint closes as a non-mutating baseline/reporting sprint only. CP-6 and Year 1 remain not closed.

## Added artifacts

- Sprint plan, baseline, result, diff summary, assignment, round-1 review, correction log, and round-2 recheck log under `reports/sprints/`.
- Sprint plan/result metadata under `references/data/sprints/`.
- Year-1 coverage JSON under `references/data/sprints/REF-CT1-year1-coverage.json`.
- Year-1 coverage, MTU gap-classification, and CP-6 review-packet reports under `reports/reference-planning/`.
- REF-CT1 read-only builder and checker under `build-scripts/references/`.
- Roadmap archive snapshot under `docs/roadmaps/outdated/reference-team-roadmap-v2.48-l16r-dual-coding-incident.md`.

## Changed roadmap state

- `REF-CT1` moved to Closed Sprints as completed.
- `Content Track 2` moved to the active Sprint Ledger row.
- The live roadmap now states that Content Track 2 must use the REF-CT1 baseline and CP-6 packet, keep `1.1.3` L1.6R status visible, and treat absent learning objects as quality failures.
- The roadmap version index JSON and Markdown were aligned with active version `v2.49-ref-ct1-year1-coverage-baseline`.

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

## Review-driven corrections

Round 1 required corrections for missing closure artifacts and stale Markdown roadmap version metadata. The correction pass recorded round 1, updated roadmap/version metadata, added result/diff logs, and prepared the bundle for round-2 recheck. Final lead-review metadata is updated after round 2 is recorded.
