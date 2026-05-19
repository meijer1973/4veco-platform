# Sprint REF-CT2: Year-1 Precision And Dual-Coding Audit

## Goal

Audit the active-v5 Year-1 coverage surface for precision-lint and semantic dual-coding readiness, using the REF-CT1 baseline and the L1.6R incident as calibration.

REF-CT2 is a non-mutating audit sprint. It records whether graph/table/visual reasoning surfaces have inspectable learning-object evidence. It does not edit lesson output, mutate protected references, close CP-6, close Year 1, promote target exercises, or authorize student-facing/product uses.

## Context

The active references roadmap lists Content Track 2 as the next sprint after REF-CT1. This sprint uses the formal id `REF-CT2` so the sprint bundle tooling can validate it consistently.

REF-CT1 produced the active-v5 Book 1 coverage baseline: 12 count-bearing target-exercise records, 9 migrated records needing v5 review, 3 placeholder records needing evidence, 0 reviewed-final target exercises, 19 confirmed Book 1 MTUs, 9 Year-1 backfill candidates, and `1.1.3` L1.6R/Part A blockers.

The active-v5 source remains `references/owned/course-blueprint-v5.md` and `references/authored/course-target-exercises.json`. Lesson-side files in `../4veco-lessen` are read-only evidence for REF-CT2. The audit must not confuse administrative coverage, asset-count presence, or procedure parity with semantic dual-coding readiness.

The L1.6R incident is the calibration case: a procedure can be consistent and still fail if the table/graph learning object is absent or not inspectable in the generated surface.

## Allowed paths

- `reports/sprints/REF-CT2-plan.md`
- `references/data/sprints/REF-CT2.plan.json`
- `reports/sprints/REF-CT2-baseline.md`
- `references/data/sprints/REF-CT2.result.json`
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- `reports/reference-planning/REF-CT2-precision-dual-coding-audit.md`
- `reports/reference-planning/REF-CT2-graph-visual-surface-evidence.md`
- `reports/reference-planning/REF-CT2-cp6-status-update.md`
- `build-scripts/references/build-ref-ct2-precision-dual-coding-audit.js`
- `build-scripts/references/check-ref-ct2-precision-dual-coding-audit.js`
- `reports/sprints/REF-CT2-result.md`
- `reports/sprints/REF-CT2-diff-summary.md`
- `reports/sprints/REF-CT2-lead-review-assignment.md`
- `reports/sprints/REF-CT2-lead-review-round1.md`
- `reports/sprints/REF-CT2-lead-review-corrections.md`
- `reports/sprints/REF-CT2-lead-review-round2.md`
- generated reports, maps, inventories, and URL indexes when regenerated through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.49-ref-ct1-year1-coverage-baseline.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- direct mutation of lesson output in `../4veco-lessen/`
- unit minting or machine registry mutation
- target-exercise promotion to `reviewed_final`
- placeholder promotion or placeholder-as-final coverage claims
- CP-6 closure or Year-1 closure
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing generated output

## Inputs

- `references/reference-team-roadmap.md`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `reports/reference-planning/REF-CT1-year1-coverage.md`
- `reports/reference-planning/REF-CT1-cp6-review-packet.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- read-only lesson evidence in `../4veco-lessen`, especially Book 1 paragraph quality refs, review files, Markdown/HTML surfaces, and `_assets/` files
- `../4veco-lessen/archive/sprints/L1.6R/L1.6R-dual-coding-incident-record.md`
- `../4veco-lessen/archive/sprints/L1.6R/L1.6R-semantic-visual-qa-report.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, corrections log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable precision and dual-coding audit JSON for the 12 active-v5 Book 1 target-exercise records.
- A precision and dual-coding audit report that records per-paragraph applicability, precision-lint status, semantic dual-coding status, visible learning-object evidence, source/lesson alignment, and CP-6 readiness.
- A graph/visual surface-evidence report listing the inspectable evidence used by the audit.
- A CP-6 status update that explains why CP-6 and Year 1 remain open or what evidence would be required to move them.
- A reproducible read-only audit builder with a HOW TO ADAPT header.
- A read-only validator for the REF-CT2 audit artifacts.

## Operationalized sprint procedure

1. Record this plan, plan JSON, and baseline before building reports. Stop if the active roadmap row for `REF-CT2` is missing or if the REF-CT1 coverage JSON is missing.
2. Confirm source boundaries. Use REF-CT1 and active v5 as the audit basis; treat lesson output as read-only evidence. Do not use lesson output to silently override active v5 target-exercise records.
3. Locate the 12 active-v5 Book 1 records from REF-CT1 and read corresponding lesson-side quality refs/surfaces when present. Record source/lesson title mismatches instead of correcting them.
4. Determine graph/visual audit applicability per paragraph. Apply precision lint where graph/table/axis/curve/numeric visual reasoning is present. Record `not_applicable` only when no graph/visual precision check applies.
5. Determine semantic dual-coding status from inspectable evidence, not booleans alone. Evidence may include table, graph, axis, point, guide line, scale comparison, curve shift, surplus area, or similar visible learning object in generated/readable surfaces.
6. Apply the L1.6R calibration rule: if the learning object is absent, uninspectable, or only asserted in metadata, graph-heavy guided practice cannot be marked quality-ready.
7. Produce the audit JSON, audit report, surface-evidence report, and CP-6 status update. The reports must keep the current `1.1.3` L1.6R/human-review status visible and must not close CP-6 or Year 1.
8. Add and run the read-only REF-CT2 validator. Stop if the artifacts omit any of the 12 active-v5 records, mark graph-heavy material quality-ready without semantic evidence, hide source/lesson mismatches, or authorize protected mutation/product use.
9. Run acceptance tests, regenerate normal reports/indexes when needed, and record result and diff artifacts.
10. Assign the completed sprint bundle to the lead reviewer agent. Log the round-1 review in `reports/sprints/REF-CT2-lead-review-round1.md`.
11. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/REF-CT2-lead-review-corrections.md`.
12. Send the corrected bundle back to the lead reviewer for one recheck. Log the round-2 review in `reports/sprints/REF-CT2-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
13. Mark REF-CT2 complete only as a non-mutating audit sprint. Do not mark Year 1 or CP-6 closed unless a separate formal human-review gate has done so. Move the next appropriate roadmap sprint to the active top ledger row, refresh maps and indexes, fetch/prune remote, commit, tag, push, and report the pushed hash.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REF-CT2-plan.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT2
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/references/build-ref-ct2-precision-dual-coding-audit.js
node build-scripts/references/check-ref-ct2-precision-dual-coding-audit.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/REF-CT2-result.md
node build-scripts/sprints/check-sprint-bundle.js REF-CT2 --complete
```

## Rollback plan

Revert the REF-CT2 implementation commit. Because REF-CT2 is non-mutating, rollback should remove only sprint artifacts, audit reports, read-only builder/checker scripts, generated report/index churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

REF-CT2 updates the evidence base for CP-6, but it does not complete CP-6 and does not require a new formal human-review interview inside this sprint.

Human review remains required before CP-6 closure, before Year-1 closure, before target-exercise promotion, before placeholder replacement, and before any protected reference mutation based on the audit.

The structural lead-review cycle is still required for sprint closure. It is an internal review/recheck procedure and does not replace CP-6 human review.
