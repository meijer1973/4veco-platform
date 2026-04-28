# Sprint S1: Result

## Plan reference

`docs/sprints/S1-plan.md`

## Summary

Completed S1 through the non-mutating CP-1 schema audit and review-packet preparation.

S1 did not close `GATE-CP1-schema-audit`. The gate is prepared for human review. R9.1 remains blocked until the CP-1 decision is recorded.

Main findings:

- Current schema files and current exercise data shapes are not equivalent contracts.
- `required_skills` currently means micro-teaching-unit IDs in source data.
- Proposed exercise metadata for external exam questions must use protected-source-safe overlays or refresh scripts.
- All 49 target exercises still point to `knowledge/course_blueprint_v4.md`; R9.1 should repair this to `references/owned/course-blueprint-v4.md`.
- The SVG geometry verifier exists at `build-scripts/lib/verify_svg_geometry.py`, not `build-scripts/verify_svg_geometry.py`.

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js docs/sprints/S1-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js S1`
- `node build-scripts/references/audit-exercise-schema-contract.js`

Sprint-close checks after this result artifact is written:

- `node build-scripts/sprints/check-sprint-result.js reports/sprints/S1-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js S1 --complete`

## Changed files

- `build-scripts/references/audit-exercise-schema-contract.js`
- `docs/sprints/S1-plan.md`
- `references/data/sprints/S1.plan.json`
- `references/data/sprints/S1.result.json`
- `reports/sprints/S1-baseline.md`
- `reports/sprints/S1-result.md`
- `reports/sprints/S1-diff-summary.md`
- `reports/review-gates/GATE-CP1-schema-audit/schema-audit.json`
- `reports/review-gates/GATE-CP1-schema-audit/schema-audit.md`
- `reports/review-gates/GATE-CP1-schema-audit/vocabulary-decision-table.json`
- `reports/review-gates/GATE-CP1-schema-audit/vocabulary-decision-table.md`
- `reports/review-gates/GATE-CP1-schema-audit/overlay-strategy.json`
- `reports/review-gates/GATE-CP1-schema-audit/overlay-strategy.md`
- `reports/review-gates/GATE-CP1-schema-audit/review-packet.json`
- `reports/review-gates/GATE-CP1-schema-audit/review-packet.md`
- `references/reference-team-roadmap.md`

## Data integrity notes

No protected reference data changed.

S1 did not hand-edit:

- `references/machine/`
- `references/external/`

S1 also did not bulk-mutate `references/authored/course-target-exercises.json` or generated RAG chunks. It only produced audit tooling, sprint records, and CP-1 review artifacts.

## Open follow-ups

- Human reviewer must answer the CP-1 review questions.
- `GATE-CP1-schema-audit` must be closed before R9.1 starts.
- R9.1 should repair the 49 target-exercise references to the canonical owned blueprint path after CP-1.
- CP-3 must still dry-run one Tier A item and one Tier C target exercise before bulk exercise metadata extension.

## Rollback instructions

Revert the S1 commit to remove the audit script, sprint artifacts, CP-1 review packet, and roadmap bookkeeping. No protected reference data rollback is needed.
