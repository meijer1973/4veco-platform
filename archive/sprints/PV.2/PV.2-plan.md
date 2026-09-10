# Sprint PV.2: Procedure-Visual Schema And Validator MVP

## Goal

Define the Procedure-Visual schema and validator contract before PV pilot content scales, while keeping the real Procedure-Visual registries empty, governed, and blocked from student-facing use.

## Context

PV.1 completed the non-mutating inventory and identified 12 ranked pilot templates, but those pilots cannot scale until the repository has explicit schema, vocabulary, validator, and schema-status reports. CP-4 allows PV templates to reference provisional `exercise_operations` only with explicit provisional status. It does not authorize machine registry promotion, bulk operation governance, student-facing PV projection, diagnostics, adaptive routing, mastery decisions, sequencing, AI, or summative use.

PV.2 is the technical PV-G1 schema proof. It should let RX.3 and RX.4 resume with PV constraints, but it must not add real pilot templates or create `references/machine/` PV registries.

## Allowed paths

- `docs/sprints/PV.2-plan.md`
- `references/data/sprints/PV.2.plan.json`
- `reports/sprints/PV.2-baseline.md`
- `references/data/procedure-visual/procedure-template.schema.json`
- `references/data/procedure-visual/visual-state.schema.json`
- `references/data/procedure-visual/visual-grammar.schema.json`
- `references/data/procedure-visual/procedure-visual-vocab.json`
- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- `build-scripts/references/validate-procedure-visual-registry.js`
- `build-scripts/references/build-procedure-visual-schema-status.js`
- `reports/json/procedure-visual-schema-status.json`
- `reports/markdown/procedure-visual-schema-status.md`
- `reports/review-gates/GATE-PV-G1-schema/review-packet.json`
- `reports/review-gates/GATE-PV-G1-schema/review-packet.md`
- `reports/review-gates/GATE-PV-G1-schema/technical-closure.json`
- `reports/review-gates/GATE-PV-G1-schema/technical-closure.md`
- `reports/review-gates/GATE-PV-G1-schema/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.21-pv1-procedure-visual-inventory.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/PV.2-result.md`
- `reports/sprints/PV.2-diff-summary.md`
- `references/data/sprints/PV.2.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/procedure-visual-vocab.json`
- creation of governed `references/machine/exercise-operations.json` or `references/machine/skill-tags.json`
- mutation of `references/authored/course-target-exercises.json`
- mutation of `references/external/exam-questions.json`
- lesson repo commits or generated lesson target edits
- RAG chunk hand-patching
- real PV pilot-template scaling before PV.3
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing PV projection

## Inputs

- `references/data/procedure-visual/inventory.json`
- `reports/json/procedure-visual-inventory.json`
- `references/data/skill-operation-registry.json`
- `references/machine/micro-teaching-units.json`
- `reports/review-gates/GATE-CP4-skill-registry-coexistence/` CP-4 closure artifacts
- `references/reference-team-roadmap.md`

## Outputs

- Three Procedure-Visual JSON schema files under `references/data/procedure-visual/`.
- PV vocabulary with schema examples that validate unit IDs, visual-state refs, provisional operation refs, graph/chart axes and units, and non-color accessibility fallback.
- Empty real PV overlay registries for procedure templates, visual states, and unit-template links.
- Read-only validator for the PV overlay.
- JSON and Markdown schema-status reports.
- Technical PV-G1 review packet and technical closure artifacts.

## Operationalized sprint procedure

1. Record this plan and baseline before treating PV.2 as complete.
2. Add strict PV schema files for procedure templates, visual states, and visual grammar.
3. Add empty real overlay registries and a vocabulary file with schema examples only; stop if the work would require real pilot-template scaling.
4. Build a validator that resolves unit IDs, step IDs, actions, visual-state refs, provisional operation refs, graph/chart axes and units, non-color accessibility fallback, publication blockers, and forbidden `references/machine/` PV files.
5. Generate schema-status and PV-G1 technical packet artifacts from the validator; the technical packet may close the schema proof only if the validator passes.
6. Emit gate bundle URLs and update the URL index so future reviewers can fetch the PV-G1 artifacts.
7. Update the roadmap only after validation passes, moving PV.2 to completed and making RX.3 the next allowed sprint.
8. Stop for human review if the validator finds real PV scaling, machine promotion, product-surface exposure, or lesson-side changes.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.2-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-schema-status.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV-G1-schema
node build-scripts/sprints/check-bundle-urls.js GATE-PV-G1-schema
node build-scripts/sprints/check-sprint-bundle.js PV.2
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.2-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.2 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the PV.2 commit. That removes the PV schema files, vocabulary, empty registries, validator, schema-status reports, PV-G1 technical artifacts, sprint plan/baseline/result/diff files, sprint JSON files, and roadmap/version-index update.

No protected reference data rollback is needed because PV.2 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for PV.2 because `GATE-PV-G1-schema` is a technical schema gate. Human review remains required for later machine-promotion or student-facing publication decisions.
