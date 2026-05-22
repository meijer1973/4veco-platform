# Sprint EX-3: Result

## Plan reference

Plan: `reports/sprints/EX-3-plan.md`

## Summary

EX-3 completed the exam-ingestion coverage dashboard/reporting lane authorized
by GATE-EX2.

The sprint added a generated JSON/Markdown report for the three EX-1 pilot exam
items and the eight reviewed GATE-EX2 classifications. The report keeps the
important gate conditions visible:

- q3 `q3-calc-1` remains `operation_registry_need`, with `A61` as support and
  `A15` stale/weak for this task.
- q3 `q3-answer-1` remains `answer_skill_need`.
- q19 carries blocking `q19-source-annex-gap` and `q19-graph-object-gap`.
- q19 `q19-graph-op-1` carries `A42` and `D10`, downgrades `A45` to weak
  support, and remains a PV/graph/procedure weakness.
- q19 `q19-reason-1` remains an `operation_registry_need` with partial
  `D10`/`D13` support.
- q15 content maps to `D27`, `F03`, and `F09` only for content coverage.
- q15 `q15-answer-1` remains `answer_skill_need`.

EX-3 is reporting-only. It authorizes no protected mutation, source mutation,
unit minting, registry mutation, lesson-output mutation, CP-6/Year-1 closure, or
student/product use.

## Acceptance test results

Passed:

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-3-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-3
node build-scripts/sprints/check-sprint-result.js reports/sprints/EX-3-result.md
node build-scripts/sprints/check-sprint-bundle.js EX-3 --complete
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

Observed key results:

- EX-3 plan check passed.
- EX-3 planned bundle check passed.
- EX-3 result check and complete bundle check passed.
- EX-0, EX-1, and EX-2 focused checkers passed.
- EX-3 coverage checker passed.
- Core schemas passed: `17 files`.
- Report JSON contract passed: `14 reports`.
- Reference-health contract passed.
- Source-document registry passed: `281 records`.
- Source manifest passed: `284 files`.
- Document inventory passed: `1170 files`.
- Roadmap version index passed: `69 entries`.
- Jest passed: `30` suites passed, `6` skipped; `515` tests passed, `8`
  skipped.

Lead-review state:

- Round 1: `PASS WITH FLAGS`.
- Corrections: no content corrections required; procedural closure logs were
  recorded.
- Round 2: `PASS WITH FLAGS`.
- Final verdict: `PASS WITH FLAGS`.

## Changed files

Added:

- `build-scripts/references/check-exam-ingestion-coverage.js`
- `reports/json/exam-ingestion-coverage.json`
- `reports/markdown/exam-ingestion-coverage.md`
- `reports/sprints/EX-3-plan.md`
- `reports/sprints/EX-3-baseline.md`
- `reports/sprints/EX-3-planning-review.md`
- `reports/sprints/EX-3-result.md`
- `reports/sprints/EX-3-diff-summary.md`
- `reports/sprints/EX-3-lead-review-assignment.md`
- `reports/sprints/EX-3-lead-review-round1.md`
- `reports/sprints/EX-3-lead-review-corrections.md`
- `reports/sprints/EX-3-lead-review-round2.md`
- `references/data/sprints/EX-3.plan.json`
- `references/data/sprints/EX-3.result.json`

Updated:

- `build-scripts/reports/generate-all.js`
- `build-scripts/reports/validate-report-json.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- generated report, dashboard, inventory, registry, URL-index, and
  GitHub-agent index outputs

Roadmap and final sprint metadata were updated after round-2 recheck.

## Data integrity notes

No protected reference data changed. EX-3 did not edit `references/external/`,
`references/machine/`, authored target exercises, owned blueprint files, or
lesson output.

No target exercises were promoted, no placeholders were finalized, no units were
minted, and no machine, operation, answer-skill, or PV/graph registry mutation
occurred.

No report authorizes diagnostics, adaptive routing, mastery decisions,
automatic sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, or student-facing output.

The unrelated pre-existing untracked file
`knowledge/exit-ticket-game-1.1.1.zip` was left untouched and unstaged.

## Open follow-ups

- Commit, tag, and push the completed EX-3 closure.
- Start EX-4 only as governed mutation-planning prep; do not execute protected
  mutation without later explicit human authorization and CLI validators.

## Rollback instructions

Revert the EX-3 implementation commit. Rollback removes only the
exam-ingestion coverage report, checker, sprint logs, generated report/index
churn, and roadmap bookkeeping.

Do not manually patch `references/machine/`, `references/external/`,
`references/authored/course-target-exercises.json`,
`references/owned/course-blueprint-v5.md`, `../4veco-lessen`, or
`knowledge/exit-ticket-game-1.1.1.zip` during rollback.
