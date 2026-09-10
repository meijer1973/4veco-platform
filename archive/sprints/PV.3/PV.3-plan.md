# Sprint PV.3: Pilot Procedure-Visual Templates

## Goal

Add the first real Procedure-Visual pilot templates, visual states, and unit-template links under `references/data/procedure-visual/`, while preserving the PV boundary: no machine registry promotion, no student-facing projection, and no generator or procedure-game publication.

## Context

PV.1 produced the Procedure-Visual inventory and ranked 12 pilot candidates. PV.2 added schemas, vocabulary, empty real registries, a validator, and `GATE-PV-G1-schema` technical proof. PV.3 is the first sprint allowed to add real pilot data to the overlay.

This sprint must prove the PV-G2 pilot-content criteria: at least five templates, at least two visual states, and coverage for formula trace, graph-stage, table-trace, and flowchart-style procedure modeling. These pilots are reference-side planning records only.

## Allowed paths

- `docs/sprints/PV.3-plan.md`
- `references/data/sprints/PV.3.plan.json`
- `reports/sprints/PV.3-baseline.md`
- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- `build-scripts/references/validate-procedure-visual-registry.js`
- `build-scripts/references/build-procedure-visual-pilot-status.js`
- `reports/json/procedure-visual-pilot-status.json`
- `reports/markdown/procedure-visual-pilot-status.md`
- `reports/review-gates/GATE-PV-G2-pilot-content/review-packet.json`
- `reports/review-gates/GATE-PV-G2-pilot-content/review-packet.md`
- `reports/review-gates/GATE-PV-G2-pilot-content/technical-closure.json`
- `reports/review-gates/GATE-PV-G2-pilot-content/technical-closure.md`
- `reports/review-gates/GATE-PV-G2-pilot-content/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.30-rx4-elasticity-market-applied.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/PV.3-result.md`
- `reports/sprints/PV.3-diff-summary.md`
- `references/data/sprints/PV.3.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/procedure-visual-vocab.json`
- creation of governed `references/machine/exercise-operations.json` or `references/machine/skill-tags.json`
- mutation of authored source files or RAG chunks
- lesson repo commits or generated lesson target edits
- generator implementation or student-facing skill-tree exposure
- procedure-game migration requirements
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing PV projection

## Inputs

- `references/data/procedure-visual/inventory.json`
- `references/data/procedure-visual/procedure-template.schema.json`
- `references/data/procedure-visual/visual-state.schema.json`
- `references/data/procedure-visual/procedure-visual-vocab.json`
- `references/machine/micro-teaching-units.json`
- `references/data/skill-operation-registry.json`
- CP-4 closure artifacts under `reports/review-gates/GATE-CP4-skill-registry-coexistence/`
- `references/reference-team-roadmap.md`

## Outputs

- Six pilot procedure templates:
  - `choose_by_opportunity_cost_flow`
  - `build_total_revenue_function_trace`
  - `select_table_values_trace`
  - `calculate_elasticity_from_table_values`
  - `calculate_demand_elasticity_from_pq_graph`
  - `judge_revenue_change_with_elasticity`
- Six pilot visual states spanning flowchart, formula trace, table trace, and graph stage.
- Six unit-template links.
- PV-G2 pilot status JSON/Markdown reports and technical gate artifacts.

## Operationalized sprint procedure

1. Record the PV.3 plan and baseline before marking PV.3 complete.
2. Replace the empty PV.2 real registries with pilot templates, visual states, and links under `references/data/procedure-visual/`.
3. Update the validator so it validates real pilot registries in addition to PV.2 schema examples.
4. Add a PV-G2 pilot-status builder that verifies template count, visual-state count, projection coverage, provisional operation refs, publication blockers, and the no-machine-registry boundary.
5. Emit PV-G2 bundle URLs and keep the URL index current.
6. Update the roadmap only after validation passes, moving PV.3 to completed and making PV.4 the next sprint.
7. Stop if the work would require `references/machine/` mutation, student-facing projection, generator implementation, or lesson-side edits.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.3-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-pilot-status.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV-G2-pilot-content
node build-scripts/sprints/check-bundle-urls.js GATE-PV-G2-pilot-content
node build-scripts/sprints/check-sprint-bundle.js PV.3
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.3-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.3 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the PV.3 commit. That restores the PV.2 empty real registries, removes the PV.3 pilot-status builder/report/gate artifacts, removes the PV.3 sprint records, and restores the previous roadmap version.

No protected reference data rollback is needed because PV.3 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for PV.3 because `GATE-PV-G2-pilot-content` is a technical pilot-content gate and does not authorize machine promotion or student-facing projection. Human review remains required for later PV machine-promotion or publication decisions.
