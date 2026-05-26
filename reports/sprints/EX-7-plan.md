# Sprint EX-7: Validator And Dry-Run CLI Implementation Plan

Date: 2026-05-26

Status: active implementation sprint.

## Plan reference

- `references/reference-team-roadmap.md`
- GATE-EX6 closure record under
  `reports/review-gates/GATE-EX6-validator-cli-planning/`

## Goal

Implement the validator and dry-run CLI layer authorized by GATE-EX6. The sprint
must prove that future operation candidates, answer-skill candidates, and
source-annex extraction overlays can be validated without creating candidate
storage, writing candidate records, executing q19 extraction, or mutating
protected references.

## Context

GATE-EX6 closed as `pass_with_conditions` for validator/dry-run CLI
implementation only. It authorizes EX-7 to implement validators, dry-run-only
CLIs, temporary non-persistent test fixtures, and rejection tests. It does not
authorize candidate-storage creation, candidate writes, q19 extraction
execution, protected reference mutation, lesson-output mutation, CP-6/Year-1
closure, or student/product use.

## Allowed paths

- implement validators for operation candidates, answer-skill candidates, and
  source-annex extraction overlays;
- implement dry-run-only CLIs for candidate validation;
- create temporary, non-persistent, test-only fixtures during validation;
- update the future-storage schemas only to satisfy GATE-EX6 conditions;
- add a read-only EX-7 checker that proves dry-run behavior and absence of
  forbidden outputs;
- refresh reports, indexes, source registry, source manifest, and document
  inventory.

Expected implementation paths:

- `build-scripts/references/lib/exam-ingestion-candidate-validation.js`
- `build-scripts/references/check-operation-answer-skill-candidates.js`
- `build-scripts/references/check-source-annex-extraction-overlays.js`
- `build-scripts/references/operation-candidate-add.js`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/source-annex-extraction-add.js`
- `build-scripts/references/check-ex7-dry-run-cli-implementation.js`
- `reports/sprints/EX-7-*`
- `references/data/sprints/EX-7.*.json`

## Forbidden paths

- `references/data/exam-ingestion/operation-candidates.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `references/data/exam-ingestion/source-annex-extraction-overlays.json`
- persistent candidate records or realistic committed fixtures under
  `references/data/exam-ingestion/`;
- `references/machine/`
- `references/external/`
- q19 source-annex or graph-object extraction execution;
- protected reference mutation;
- external-source mutation;
- machine-reference mutation;
- unit minting;
- operation-registry mutation;
- answer-skill mutation;
- PV/graph mutation;
- target-exercise promotion;
- lesson output mutation;
- CP-6 or Year-1 closure;
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, or student/product use.

## Inputs

- GATE-EX6 closure record under
  `reports/review-gates/GATE-EX6-validator-cli-planning/`
- GATE-EX6 human-interview record under
  `reports/review-gates/GATE-EX6-validator-cli-planning/`
- `references/data/exam-ingestion/validator-cli-implementation-plan.json`
- `references/schemas/operation-candidates.schema.json`
- `references/schemas/answer-skill-candidates.schema.json`
- `references/schemas/source-annex-extraction-overlays.schema.json`
- `build-scripts/references/README.md`

## Outputs

- `build-scripts/references/lib/exam-ingestion-candidate-validation.js`
- `build-scripts/references/check-operation-answer-skill-candidates.js`
- `build-scripts/references/check-source-annex-extraction-overlays.js`
- `build-scripts/references/operation-candidate-add.js`
- `build-scripts/references/answer-skill-candidate-add.js`
- `build-scripts/references/source-annex-extraction-add.js`
- `build-scripts/references/check-ex7-dry-run-cli-implementation.js`
- sprint logs under `reports/sprints/`
- result JSON under `references/data/sprints/`
- updated generated reports/indexes.

## Operationalized sprint procedure

1. Update schemas only for GATE-EX6 conditions:
   - use explicit status naming where helpful;
   - preserve weak versus rejected unit support using typed assessments;
   - keep all mutation/product-use authority flags false.
2. Implement shared validator library:
   - parse JSON from file or inline CLI input;
   - validate authority boundaries;
   - validate operation and answer-skill candidate records;
   - validate source-annex and graph extraction overlays;
   - reject unauthorized mutation/product flags;
   - reject q3 `A15` support and q19 primary `A45` support;
   - reject hidden q3/q15 answer-skill needs;
   - reject q19 reconstructable states with empty/vague source or graph details.
3. Implement validators:
   - default mode checks future storage is still absent;
   - explicit `--input` / `--operation-input` / `--answer-input` mode validates
     a provided temporary fixture file.
4. Implement dry-run-only CLIs:
   - require `--dry-run`;
   - hard-fail any write mode or missing dry-run flag;
   - accept inline `--spec` or `--spec-file`;
   - validate and print dry-run success without writing files.
5. Implement EX-7 checker:
   - create temp fixtures under the OS temp directory;
   - run validators and CLIs against passing and failing fixtures;
   - confirm forbidden storage paths and write outputs remain absent;
   - remove temp fixtures after the check.
6. Run validation and complete sprint logs.

Decision point: stop if any validator or CLI would require persistent candidate
storage, candidate writes, q19 extraction execution, protected reference
mutation, external-source mutation, machine-reference mutation, or lesson-output
mutation. After implementation, the lead-review logs must explicitly recheck
that forbidden paths remain absent.

## Acceptance tests

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

## Acceptance Criteria

- Validators and dry-run CLIs exist and pass positive dry-run fixtures.
- Validators and CLIs reject:
  - missing or false-free authority boundaries;
  - mutation/product flags set true;
  - q3 `A15` as annual-threshold support;
  - q19 `A45` as primary graph-shift support;
  - q19 reconstructable states with empty/vague required graph/source fields;
  - operation support evidence that does not distinguish weak from rejected;
  - hidden q3/q15 answer-skill needs.
- Dry-run CLIs hard-fail without `--dry-run`.
- No candidate storage files exist after the sprint.
- No q19 extraction execution occurs.
- No protected reference, external-source, machine-reference, PV/graph, lesson,
  CP-6/Year-1, or student/product mutation occurs.

## Rollback plan

Revert the EX-7 commit to remove the validators, dry-run CLIs, shared
validation library, EX-7 checker, sprint logs, and generated report/index
refreshes. No protected reference, external-source, machine-reference,
candidate-storage, or lesson-output rollback should be required because those
surfaces are forbidden in this sprint.

## Human review required

No new human gate is required to complete EX-7. Human authority is inherited
from `GATE-EX6` and is limited to validator/dry-run CLI implementation only.
Any later candidate storage, candidate write, q19 extraction execution,
protected reference mutation, or product/lesson use requires a future human
gate.

## Stop Conditions

- Stop if any implementation would create candidate-storage files.
- Stop if any CLI can write without a later closed gate.
- Stop if any q19 extraction execution is attempted.
- Stop if any validator permits q19 reconstructable states with empty required
  graph/source detail.
- Stop if q3 `A15`, q19 primary `A45`, or hidden q3/q15 answer-skill needs pass
  validation.
- Stop if protected reference or external-source mutation is needed.

## Next Step After Sprint

If EX-7 passes, route the next decision back to the roadmap. Do not proceed to
candidate storage or candidate writes without a later human gate explicitly
authorizing those exact writes.
