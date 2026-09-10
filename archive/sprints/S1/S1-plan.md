# Sprint S1: Schema Audit And Exercise Naming Contract

## Goal

Produce a non-mutating CP-1 schema audit that compares the current repository data shapes with the approved exercise-schema roadmap, resolves the naming contract for exercise/unit fields, and prepares `GATE-CP1-schema-audit` for human review.

## Context

The live roadmap now makes S1 the immediate next sprint. The Head of Engineering approved the repository-checked roadmap with three restored HCS requirements:

- preserve `instructional_role` and `assessment_role` as separate fields
- preserve the four-field `scaffolding` object
- preserve CP-1 through CP-8 as cross-team checkpoints

Current known risks:

- `required_skills` currently means micro-teaching-unit IDs in exam and target-exercise data.
- Existing schemas and current source data do not yet describe the same contract.
- `references/external/` is protected mirrored authority and must not be hand-edited.
- `references/machine/` is CLI-only.

## Allowed paths

- `docs/sprints/S1-plan.md`
- `references/data/sprints/S1.plan.json`
- `references/data/sprints/S1.result.json`
- `reports/sprints/S1-baseline.md`
- `reports/sprints/S1-result.md`
- `reports/sprints/S1-diff-summary.md`
- `reports/review-gates/GATE-CP1-schema-audit/`
- `build-scripts/references/audit-exercise-schema-contract.js`
- `references/reference-team-roadmap.md` for S1 status bookkeeping only

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- bulk mutation of `references/authored/course-target-exercises.json`
- generated RAG chunk hand-patching
- creating new machine registries without schema, CLI, validator, and mutation logs
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/reference-team-roadmap.md`
- `references/schemas/exam-question.schema.json`
- `references/schemas/target-exercise.schema.json`
- `references/schemas/rag-chunk.schema.json`
- `references/external/exam-questions.json`
- `references/authored/course-target-exercises.json`
- `references/data/rag/chunk_index.jsonl`
- `build-scripts/lib/verify_svg_geometry.py`
- `knowledge/Exercise schema and quality/roadmap-updated-repository-checked.md`
- `knowledge/Exercise schema and quality/summary-of-updated-roadmap-edits-and-motivation.md`

## Outputs

- S1 sprint plan and plan JSON
- S1 baseline report
- CP-1 schema audit JSON and Markdown
- CP-1 vocabulary decision table JSON and Markdown
- CP-1 overlay strategy JSON and Markdown
- CP-1 review packet JSON and Markdown
- S1 result report, diff summary, and result JSON

## Operationalized sprint procedure

1. Record the S1 plan and baseline before running the audit. The baseline must state that protected reference data is unchanged and that the current sprint is non-mutating.
2. Run `build-scripts/references/audit-exercise-schema-contract.js` to compare current schemas and data shapes. Stop if the script would write into `references/machine/`, `references/external/`, or source exercise data.
3. Review generated audit artifacts for the CP-1 decisions: `required_units`, `exercise_operations`, `skill_tags`, `instructional_role`, `assessment_role`, the `scaffolding` object, overlay strategy, and precision-lint path.
4. Prepare `reports/review-gates/GATE-CP1-schema-audit/review-packet.md` and `.json`. The review packet must list all human review questions at once, because the user has asked to receive all review questions in future gate reviews.
5. Human review procedure for the later CP-1 closure: ask calibration questions, record every answer in `human-interview.md` and `.json`, analyze answer patterns, ask targeted follow-ups only if the answer pattern is inconsistent, produce a closure proposal, require explicit human confirmation, and only then create `gate-closure.md` and `gate-closure.json`.
6. Validate the sprint plan, active bundle, and result artifacts. Do not run final gate-closure validation because CP-1 is not closed in S1 without human answers.
7. Record S1 result as completed-through-review-packet and blocked on human CP-1 decision. Stop before R9.1 until the CP-1 gate is closed.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/S1-plan.md
node build-scripts/sprints/check-sprint-bundle.js S1
node build-scripts/references/audit-exercise-schema-contract.js
node build-scripts/sprints/check-sprint-result.js reports/sprints/S1-result.md
```

## Rollback plan

If the audit output is wrong, remove the S1 audit artifacts and fix the audit script. Because S1 is non-mutating, rollback does not require restoring `references/machine/`, `references/external/`, or source exercise data.

## Human review required

Yes. S1 prepares `GATE-CP1-schema-audit` for human review but does not close the gate without human answers and explicit confirmation. R9.1 remains blocked until CP-1 is closed.
