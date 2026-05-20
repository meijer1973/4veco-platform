# Sprint CP.6b: Year-1 Target-Exercise Review

## Goal

Produce a bounded, evidence-backed review record for the 12 active-v5 Book 1 target-exercise records: nine migrated target exercises and three gemengde-opgaven placeholders.

CP.6b is non-mutating. It may review current target-exercise evidence and draft integration/transfer target-exercise designs for `1.1.4`, `1.2.4`, and `1.3.4`, but it must not edit `references/authored/course-target-exercises.json`, promote any record to `reviewed_final`, finalize placeholders, mutate protected references, close CP-6, close Year 1, or mint units.

## Context

GATE-CP6 recorded two target-exercise decisions that define this lane:

- all three Book 1 placeholders (`1.1.4`, `1.2.4`, `1.3.4`) need reviewed integration/transfer target exercises before any final Year-1 coverage claim;
- none of the nine migrated Book 1 target-exercise records may be promoted to `reviewed_final` from current migration evidence.

CP.6a and lesson-team L-CP6A fixed the Book 1 Chapter 1.3 source/lesson mismatch with carried conditions. That does not close target-exercise evidence. The active target-exercise registry still reports nine Book 1 records as `migrated_from_v4_needs_v5_review` and three as `placeholder_needs_review`.

## Allowed paths

- `reports/sprints/CP.6b-plan.md`
- `references/data/sprints/CP.6b.plan.json`
- `reports/sprints/CP.6b-baseline.md`
- `reports/sprints/CP.6b-planning-review.md`
- `build-scripts/references/build-cp6b-target-exercise-review.js`
- `build-scripts/review-gates/check-cp6b-target-exercise-review.js`
- `references/data/sprints/CP.6b-target-exercise-review.json`
- `reports/reference-planning/CP.6b-target-exercise-review.md`
- `references/data/sprints/CP.6b.result.json`
- `reports/sprints/CP.6b-result.md`
- `reports/sprints/CP.6b-diff-summary.md`
- `reports/sprints/CP.6b-lead-review-assignment.md`
- `reports/sprints/CP.6b-lead-review-round1.md`
- `reports/sprints/CP.6b-lead-review-corrections.md`
- `reports/sprints/CP.6b-lead-review-round2.md`
- generated reports, maps, inventories, GitHub-agent indexes, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping
- `docs/roadmaps/outdated/reference-team-roadmap-v2.55-exam-ingestion-north-star.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- direct mutation of lesson output in `../4veco-lessen/`
- target-exercise promotion to `reviewed_final`
- placeholder replacement, registry mutation, promotion, or finalization
- unit minting or machine registry mutation
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
- GATE-CP6 human interview and routing records under `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/`
- `reports/review-gates/GATE-CP6-year-1-paragraph-coverage/remediation-lanes.md`
- `references/data/sprints/CP.6a-lesson-side-recheck.json`
- `reports/reference-planning/CP.6a-lesson-side-recheck.md`
- `references/authored/course-target-exercises.json`
- `references/owned/course-blueprint-v5.md`
- `references/data/sprints/REF-CT1-year1-coverage.json`
- `references/data/sprints/REF-CT2-precision-dual-coding-audit.json`
- read-only lesson-team L-CP6A handoff evidence under `../4veco-lessen/archive/sprints/L-CP6A/`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, result, diff summary, lead-review assignment, round-1 lead-review log, correction log, round-2 lead-review log, plus metadata under `references/data/sprints/`.
- A machine-readable CP.6b target-exercise review JSON generated from the current active target-exercise registry.
- A Markdown review report with one row per Book 1 record, explicit non-final status, and three draft gemengde-opgaven integration designs.
- A read-only validator that fails if CP.6b claims target-exercise promotion, placeholder finalization, protected mutation, lesson-output mutation, CP-6 closure, Year-1 closure, or product authorization.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log before generating CP.6b review outputs. Stop if `CP.6b` is not present as the active roadmap row or if GATE-CP6 routing evidence is missing.
2. Confirm source boundaries. Treat `references/authored/course-target-exercises.json` and `references/owned/course-blueprint-v5.md` as read-only source evidence; treat `../4veco-lessen` as read-only supporting evidence.
3. Build the CP.6b review from actual current source data, not stale reports. The generated JSON must count exactly nine migrated Book 1 records, three placeholders, and zero reviewed-final Book 1 records.
4. For the nine migrated records, record that migration evidence is valid but insufficient for `reviewed_final`. Name the later evidence required before any promotion can be proposed.
5. For the three gemengde-opgaven placeholders, draft integration/transfer target-exercise designs that introduce no new theory and combine already-taught chapter skills. Stop if any design smuggles costs/revenue/marginal-analysis theory back into active-v5 Book 1.
6. Record remaining blockers and route follow-up work. CP.6b may recommend later teacher-learning-quality review and registry-update procedures, but it may not perform them.
7. Run the CP.6b validator. Stop if any artifact claims final coverage, target-exercise promotion, placeholder finalization, protected mutation, unit minting, CP-6 closure, Year-1 closure, diagnostics, adaptive routing, mastery, automatic sequencing, student-facing AI, summative use, PV projection, or PV machine promotion.
8. Run acceptance tests, refresh normal reports and indexes, and record result and diff artifacts.
9. Assign the completed sprint bundle to the lead reviewer agent. Log round 1 in `reports/sprints/CP.6b-lead-review-round1.md`.
10. Apply required corrections or explicitly record that no correction was needed. Log the correction pass in `reports/sprints/CP.6b-lead-review-corrections.md`.
11. Send the corrected bundle back to the lead reviewer for one recheck. Log round 2 in `reports/sprints/CP.6b-lead-review-round2.md`. Stop and report back if the recheck verdict is not `PASS` or `PASS WITH FLAGS`.
12. Mark CP.6b complete only as a non-mutating target-exercise review/design sprint. Move `CP.6c` to the active top ledger row, refresh maps and indexes, fetch/prune remote, commit, push, tag, and report the pushed hash.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/CP.6b-plan.md
node build-scripts/sprints/check-sprint-bundle.js CP.6b
node build-scripts/references/build-cp6b-target-exercise-review.js
node build-scripts/review-gates/check-cp6b-target-exercise-review.js
node scripts/check-course-target-exercises-v5.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/CP.6b-result.md
node build-scripts/sprints/check-sprint-bundle.js CP.6b --complete
```

## Rollback plan

Revert the CP.6b implementation commit. Because CP.6b is non-mutating, rollback removes only sprint artifacts, review reports, the read-only builder/validator, generated map/report churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`, `references/authored/course-target-exercises.json`, `references/owned/course-blueprint-v5.md`, or `../4veco-lessen` during rollback.

## Human review required

No new human review is required inside CP.6b. GATE-CP6 already supplied the human decision that migrated records and placeholders cannot support final coverage without later review evidence.

Human review remains required before CP-6 closure, Year-1 closure, protected reference mutation, target-exercise promotion, placeholder finalization, and any student-facing/product-use claim.

The structural lead-review cycle is required for sprint closure. It is an internal review/recheck procedure and does not replace future human gate decisions.
