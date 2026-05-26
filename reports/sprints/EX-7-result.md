# Sprint EX-7: Result

Date: 2026-05-26

Status: completed.

## Plan reference

- `reports/sprints/EX-7-plan.md`

## Summary

EX-7 implemented the validator and dry-run CLI layer authorized by GATE-EX6.
The work is implementation-only for validation tooling; it does not create
candidate storage or write candidate records.

Implemented:

- shared validation library:
  `build-scripts/references/lib/exam-ingestion-candidate-validation.js`
- operation/answer-skill validator:
  `build-scripts/references/check-operation-answer-skill-candidates.js`
- source-annex extraction validator:
  `build-scripts/references/check-source-annex-extraction-overlays.js`
- dry-run-only CLIs:
  `operation-candidate-add.js`,
  `answer-skill-candidate-add.js`,
  `source-annex-extraction-add.js`
- EX-7 self-checker:
  `build-scripts/references/check-ex7-dry-run-cli-implementation.js`

Schema alignment:

- `operation-candidates.schema.json` now uses `operation_status`.
- `answer-skill-candidates.schema.json` now uses `answer_skill_status`.
- operation candidates now carry typed `unit_support_assessments` so weak and
  rejected unit evidence cannot collapse into one ambiguous field.

## Acceptance test results

All acceptance tests passed:

```powershell
node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-7-plan.md
node build-scripts/sprints/check-sprint-bundle.js EX-7
node build-scripts/references/check-ex6-validator-cli-planning.js
node build-scripts/references/check-operation-answer-skill-candidates.js
node build-scripts/references/check-source-annex-extraction-overlays.js
node build-scripts/references/check-ex7-dry-run-cli-implementation.js
node build-scripts/references/check-exam-ingestion-contract.js
node build-scripts/references/check-exam-ingestion-pilots.js
node build-scripts/references/check-exam-ingestion-coverage.js
node build-scripts/references/check-skill-operation-registry.js
node build-scripts/references/validate-core-schemas.js
node build-scripts/reports/generate-all.js
node build-scripts/reports/validate-report-json.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
npm.cmd run dashboard:internal
npm.cmd run agent:index
node build-scripts/references/build-source-document-registry.js
node build-scripts/references/build-reference-inventory.js
node build-scripts/references/check-source-document-registry.js
node build-scripts/references/check-source-manifest.js
node build-scripts/references/check-document-inventory.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd test
```

`npm.cmd test` completed with 33 suites passed, 6 skipped, 544 tests passed, and
8 skipped. The known negative-fixture console output did not fail the run.

## Changed files

Primary implementation:

- `build-scripts/references/lib/exam-ingestion-candidate-validation.js`
- `build-scripts/references/check-operation-answer-skill-candidates.js`
- `build-scripts/references/check-source-annex-extraction-overlays.js`
- `build-scripts/references/operation-candidate-add.js`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/source-annex-extraction-add.js`
- `build-scripts/references/check-ex7-dry-run-cli-implementation.js`

Supporting updates:

- `references/schemas/operation-candidates.schema.json`
- `references/schemas/answer-skill-candidates.schema.json`
- `build-scripts/references/check-ex6-validator-cli-planning.js`
- `build-scripts/references/README.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- generated reference reports, dashboard data, agent indexes, source registry,
  source manifest, and document inventory.

## Data integrity notes

No protected reference data changed. No files under `references/machine/` or
`references/external/` were edited. Candidate storage remains absent:

- `references/data/exam-ingestion/operation-candidates.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`

No candidate writes were performed. No q19 source-annex or graph-object
extraction execution occurred. No PV/graph, lesson-output, CP-6/Year-1, or
student/product mutation was authorized or performed.

The unrelated untracked file `knowledge/exit-ticket-game-1.1.1.zip` was left
unstaged and untouched.

## Open follow-ups

- Candidate storage and writes remain blocked until a later human gate names
  the exact lane.
- q19 extraction remains blocked until a later gate authorizes extraction
  execution.
- The next platform decision is whether to start `GAME-UX-2 Exit Ticket
  Checkpoint Engine MVP` or record an explicit waiver before Scale Gate 1.

## Rollback instructions

Revert the EX-7 commit to remove the validators, dry-run CLIs, shared
validation library, EX-7 checker, sprint logs, roadmap update, and generated
report/index refreshes. No protected reference, external-source,
machine-reference, candidate-storage, or lesson-output rollback should be
required because those surfaces were not changed.
