# Sprint EX-3: Exam Coverage Dashboard

## Goal

Create an internal JSON/Markdown exam-ingestion coverage report that makes the
EX-1 pilot and EX-2 reviewed classifications visible for planning.

EX-3 must report, not mutate:

- prompt/source/correction-model coverage;
- source-annex, graph/table/figure, and answer-model gaps;
- reviewed EX-2 MTU/operation/answer-skill classifications;
- q3 `A61` support correction and stale/incorrect `A15` note;
- q19 `A42` graph-shift support correction, `A45` weak-support note, and
  blocking source/graph status;
- q3/q15 answer-skill needs;
- lesson-handoff readiness with visible gaps;
- blocked outcomes and proof required before any later mutation or lesson
  handoff.

EX-3 does not authorize protected reference mutation, external-source mutation,
unit minting, operation-registry mutation, answer-skill mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1
closure, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student-facing output.

## Context

EX-1 created exactly three non-mutating pilot overlay families under
`references/data/exam-ingestion/`.

GATE-EX2 closed as `pass_with_conditions` for classification and routing only.
The closure allows EX-3 dashboard/reporting work and requires the report to keep
q19 source/graph gaps and q3/q15 answer-skill needs visible.

The current workspace has one unrelated pre-existing untracked file:
`knowledge/exit-ticket-game-1.1.1.zip`. EX-3 must not stage, edit, move, or
delete that file.

## Allowed paths

- `reports/sprints/EX-3-plan.md`
- `references/data/sprints/EX-3.plan.json`
- `reports/sprints/EX-3-baseline.md`
- `reports/sprints/EX-3-planning-review.md`
- `build-scripts/reports/generate-all.js`
- `build-scripts/reports/validate-report-json.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `build-scripts/references/check-exam-ingestion-coverage.js`
- `reports/json/exam-ingestion-coverage.json`
- `reports/markdown/exam-ingestion-coverage.md`
- `reports/sprints/EX-3-result.md`
- `reports/sprints/EX-3-diff-summary.md`
- `reports/sprints/EX-3-lead-review-assignment.md`
- `reports/sprints/EX-3-lead-review-round1.md`
- `reports/sprints/EX-3-lead-review-corrections.md`
- `reports/sprints/EX-3-lead-review-round2.md`
- `references/data/sprints/EX-3.result.json`
- generated reports, maps, inventories, GitHub-agent indexes, source-document
  registry, and URL indexes refreshed through normal scripts
- `references/reference-team-roadmap.md` for sprint bookkeeping after completion
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.66-shared-skill-map-engine-tracking.md`

## Forbidden paths

- hand edits to `../4veco-lessen/`
- hand edits to lesson review files or lesson quality refs
- hand edits to `references/external/`
- hand edits to `references/machine/`
- direct mutation of `references/authored/course-target-exercises.json`
- direct mutation of `references/owned/course-blueprint-v5.md`
- unit minting or machine registry mutation
- operation-registry mutation
- answer-skill mutation
- target-exercise promotion
- placeholder replacement or finalization
- CP-6 closure or Year-1 closure
- student diagnostics
- adaptive routing
- mastery decisions
- automatic sequencing
- student-facing AI
- summative use
- PV projection or PV machine promotion
- student-facing generated output
- `knowledge/exit-ticket-game-1.1.1.zip`

## Inputs

- `references/data/exam-ingestion/exam-item-overlays.json`
- `references/data/exam-ingestion/exam-answer-model-overlays.json`
- `references/data/exam-ingestion/exam-source-annex-overlays.json`
- GATE-EX2 closure and human-interview artifacts under
  `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/`
- `reports/review-gates/GATE-EX2-exam-to-mtu-mapping/mapping-candidates.json`
- `references/data/sprints/EX-1.result.json`
- `references/data/sprints/EX-2.result.json`
- `references/reference-team-roadmap.md`

## Outputs

- A sprint bundle under `reports/sprints/`: plan, baseline, planning review,
  result, diff summary, lead-review assignment, round-1 lead-review log,
  correction log, round-2 lead-review log, plus metadata under
  `references/data/sprints/`.
- `reports/json/exam-ingestion-coverage.json`, a generated report using the
  normalized JSON-first report contract.
- `reports/markdown/exam-ingestion-coverage.md`, a human-readable projection
  of the report.
- `build-scripts/references/check-exam-ingestion-coverage.js`, a read-only
  checker that verifies EX-3 keeps EX-2 classifications and blocks visible.
- `reference-health` and `report-manifest` refreshed so the new report appears
  in normal dashboards and report validation.

Generated output statement: EX-3 generates internal reference reports only under
`reports/json/`, `reports/markdown/`, `reports/internal-dashboard/`, and map/index
files. It generates no student-facing lesson output.

## Operationalized sprint procedure

1. Record this plan, plan JSON, baseline, and planning-review log. Stop if EX-3
   is not the active roadmap row or if the unrelated `knowledge/` zip would need
   to be staged.
2. Read EX-1 overlays and GATE-EX2 closure. Stop if EX-2 is not
   `pass_with_conditions`, if `allowed_next_sprint` is not `EX-3`, or if the
   closure does not carry q3 `A61`, q19 `A42`, q19 blocking gaps, and q3/q15
   answer-skill needs.
3. Extend `generate-all.js` to emit `exam-ingestion-coverage` JSON/Markdown.
   The report must use only existing overlay and gate-closure evidence, must not
   mutate sources, and must mark q19 as blocked.
4. Add the new report to `validate-report-json.js` and `reference-health`
   aggregation. Stop if report contracts or reference-health contracts fail.
5. Add and run `check-exam-ingestion-coverage.js`. Stop if it permits mutation,
   hides q19 gaps, treats q19 as lesson-handoff-ready, drops q3/q15 answer-skill
   needs, or omits the q3/q19 correction notes from EX-2.
6. Refresh normal generated reports and indexes so off-site reviewers can see
   the EX-3 report through GitHub-facing maps.
7. Run the complete acceptance-test set.
8. Assign the completed EX-3 bundle to lead review, record round 1, record a
   correction pass, run one recheck, and stop if the final recheck is not
   `PASS` or `PASS WITH FLAGS`.
9. After final metadata and roadmap updates, rerun complete-bundle validation,
   fetch/prune remote, commit, tag, and push.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-3-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-3
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/check-exam-to-mtu-mapping-gate.js
node build-scripts/references/check-exam-ingestion-coverage.js
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
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test
```

## Rollback plan

Revert the EX-3 implementation commit. Rollback removes only the
exam-ingestion coverage report, checker, sprint logs, generated report/index
churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`,
`references/owned/course-blueprint-v5.md`, `../4veco-lessen`, or
`knowledge/exit-ticket-game-1.1.1.zip` during rollback.

## Human review required

No new human gate is required for EX-3 because GATE-EX2 already authorized
dashboard/reporting work.

Lead review is still required before sprint completion. The lead reviewer must
verify that EX-3 is reporting-only, the new report preserves EX-2 conditions,
and all protected mutation and student/product-use boundaries remain blocked.
