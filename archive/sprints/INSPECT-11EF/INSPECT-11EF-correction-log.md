# INSPECT-11E/F Correction Log

Status: closed
Date: 2026-06-20

## Corrections

| Issue | Classification | Correction | Proof |
|---|---|---|---|
| Initial sprint plan used nonstandard headings, so `check-sprint-plan` rejected it. | core_validation_route_gap | Normalized the plan to the required `## Context`, `## Quality Standard`, `## Quality Improvement Candidates`, `## Allowed paths`, `## Forbidden paths`, `## Inputs`, `## Outputs`, `## Operationalized sprint procedure`, `## Acceptance tests`, `## Proof Required to Close`, `## Rollback plan`, and `## Human review required` headings. | `node build-scripts/sprints/check-sprint-plan.js archive/sprints/INSPECT-11EF/INSPECT-11EF-sprint-plan.md` passed. |
| Phase 1 lead reviewer noted the JSON plan used shorthand for the exact Chapter 1.3 lesson Markdown proof files. | does_not_block | Implemented the generator descriptor with all eight exact read-only Chapter 1.3 Markdown proof paths enumerated explicitly. | `node build-scripts/inspection/check-dutch-diagnostic-report-stability.js` verifies the eight exact paths. |
| Phase 1 lead reviewer noted the validation log must record expected refusal STOP codes. | does_not_block | Added explicit refusal matrix entries to the validation log. | Stability checker refusal matrix passed with 20 cases; validation log records the four acceptance-test commands and STOP codes. |
| First Chapter 1.3 report build failed the safety assertion because the phrase `owner next action` was not visible in the report body. | blocker_visibility_gap | Updated the Chapter 1.3 `owner_next_action.action` text to begin with `Owner next action:`. | `node build-scripts/inspection/build-dutch-diagnostic-report.js --scope all` generated successfully. |
| Initial Chapter 1.2 refactor changed refusal-policy wording and core-checklist evidence labels. | semantic_regression_blocker | Restored the Chapter 1.2 refusal-policy text and checklist evidence strings exactly, leaving only deterministic checkout metadata repair. | Chapter 1.2 semantic SHA-256 returned to `76b683b6370c1e13cf46cb8094fd52c71d8d24b723b90d14fd257d5287ea7132`. |
| First local `npm.cmd run check:platform` could not find `jest` because the fresh worktree lacked `node_modules`. | environment_setup | Ran `npm.cmd install` locally, which left no source/package metadata changes. | Rerun `npm.cmd run check:platform` passed: 54 suites / 809 tests. |
| Legal/privacy review found the generated safe-use note inaccurately said no generated lesson output is read while Chapter 1.3 exact proof paths are read/hash-validated. | authority_boundary_wording_defect | Updated generated safe-use text for scopes with exact lesson proof paths: exact allowlisted read-only lesson Markdown proof paths may be read/hash-validated; generated lesson-output scanning and mutation remain forbidden. | Stale phrase scan found no `No generated lesson output is read`; `--scope chapter-1-3 --lesson-output-scan` returned `STOP_LESSON_OUTPUT_OR_PROTECTED_REFERENCE`; stability checker passed. |
| Legal/privacy review found stale INSPECT-11D human-review/report-generation blocker language in the current Chapter 1.3 report. | stale_gate_state_authority_ambiguity | Normalized `1.3.4` target reconciliation and old INSPECT-11D human-review finding as accepted/closed for INSPECT-11E/F internal diagnostic generation while preserving downstream evidence-pack, teacher/school-facing, public/external, product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, and compliance blocks. | Stale phrase scan found no `diagnostic report generation until human review` or `INSPECT-11D is not closed`; generator currentness and stability checker passed. |
| Human review of PR #119 found the committed closure records still described final lead review and PR publication as pending after implementation content had passed. | closure_record_reconciliation_gap | Reconciled the final lead review, closure log, validation log, and correction log to record final lead PASS, closed lead findings, closure decision, and final PR CI publication guard. | `INSPECT-11EF-final-lead-review.md` cites reviewed head `83d315bfd8066d713d0a02252a6c95da9173571a` and green run `27831402581`; closure log is `closed / ready for human-approved merge`; validation log status is `passed`; correction log status is `closed`. |
| PR #119 body still promised a future final lead review. | pr_publication_record_gap | Replace the PR-body sentence during the publication step so it records final lead PASS and the final CI/merge sequence. | PR #119 body readback must show final lead PASS before merge. |

## Open Corrections

None. Specialist gates remain closed; this record-only reconciliation does not
change generator semantics, report wording, authority boundaries, or proof
records, so teacher/economics, legal/privacy, and Dutch quality-inspection
specialists do not need to rerun.
