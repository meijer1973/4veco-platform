# Sprint PV.8: Promotion Pipeline Design

## Goal

Design the future Procedure-Visual machine-promotion pipeline without executing promotion.

PV.8 must define the CLI-backed path, mutation-log schema, validators, rollback model, and future gate criteria required before any later sprint can promote PV records from `references/data/procedure-visual/` to `references/machine/`.

## Context

`GATE-PV7-machine-promotion-review` closed as `pass_with_conditions`. HCS decided that no Procedure-Visual records should move to `references/machine/` now. HCS also identified `unit-template-links` as the safest future first candidate only after CLI support, validators, mutation logs, and lesson-regression proof exist.

PV.8 therefore designs the promotion pipeline. It must not implement or run a real promotion CLI, create PV machine registries, mutate lesson targets, or authorize student-facing PV projection.

## Allowed paths

- `docs/sprints/PV.8-plan.md`
- `references/data/sprints/PV.8.plan.json`
- `references/data/sprints/PV.8.result.json`
- `reports/sprints/PV.8-baseline.md`
- `reports/sprints/PV.8-result.md`
- `reports/sprints/PV.8-diff-summary.md`
- `references/data/procedure-visual/promotion-pipeline-design.json`
- `build-scripts/references/build-procedure-visual-promotion-pipeline-design.js`
- `build-scripts/references/check-procedure-visual-promotion-pipeline-design.js`
- `reports/json/procedure-visual-promotion-pipeline-design.json`
- `reports/markdown/procedure-visual-promotion-pipeline-design.md`
- `reports/review-gates/GATE-PV8-promotion-pipeline-design/review-packet.json`
- `reports/review-gates/GATE-PV8-promotion-pipeline-design/review-packet.md`
- `reports/review-gates/GATE-PV8-promotion-pipeline-design/technical-closure.json`
- `reports/review-gates/GATE-PV8-promotion-pipeline-design/technical-closure.md`
- `reports/review-gates/GATE-PV8-promotion-pipeline-design/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.38-pv7-gate-closed.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/unit-template-links.json`
- creation of `references/machine/procedure-visual-vocab.json`
- implementation or execution of a real PV promotion CLI
- creation of a real machine-promotion mutation log
- promotion of unit-template links, procedure templates, visual states, vocabulary, or provisional `exercise_operations`
- mutation of authored source files or RAG chunks
- lesson repo commits or generated lesson target edits
- student-facing PV projection
- generator exposure for blocked units
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- PV.7 closure JSON artifact under `reports/review-gates/GATE-PV7-machine-promotion-review/`
- `reports/json/procedure-visual-machine-promotion-readiness.json`
- `reports/json/procedure-visual-coverage.json`
- `reports/json/skilltree-generator-readiness.json`
- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- `references/data/procedure-visual/procedure-visual-vocab.json`

## Outputs

- Design-only PV promotion-pipeline record under `references/data/procedure-visual/`.
- JSON/Markdown promotion-pipeline design report.
- Proposed CLI contract for planning, applying, and rolling back future PV promotion.
- Proposed mutation-log schema.
- Proposed validators and future promotion-gate questions.
- Technical packet and closure proving PV.8 remained non-mutating.

## Operationalized sprint procedure

1. Record this plan and baseline before creating design artifacts.
2. Verify PV.7 is closed as `pass_with_conditions` and that machine promotion remains unauthorized.
3. Build a design-only promotion pipeline record that names `unit-template-links` as the first future candidate and keeps procedure templates and visual states as overlays.
4. Define proposed CLI contracts, mutation-log schema, validators, rollback expectations, and future human-gate questions.
5. Explicitly require PV-G4 lesson-regression proof before any future promotion gate can reopen machine-authoritative or student-facing PV use.
6. Validate that no PV `references/machine/` files exist and that all proposed CLI/validator contracts are marked `proposed_not_implemented`.
7. Emit a technical packet and bundle URLs.
8. Update the roadmap/version index only after validators pass.
9. Stop if the work would require protected reference mutation, real PV promotion CLI implementation, machine registry creation, lesson-side changes, student-facing projection, or any diagnostic/adaptive/product use.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.8-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-promotion-pipeline-design.js
node build-scripts/references/check-procedure-visual-promotion-pipeline-design.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV8-promotion-pipeline-design
node build-scripts/sprints/check-bundle-urls.js GATE-PV8-promotion-pipeline-design
node build-scripts/sprints/check-sprint-bundle.js PV.8
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.8-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.8 --complete
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the PV.8 design commit. That removes the design-only promotion-pipeline record, builder/checker, generated reports, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.

No protected reference rollback is needed because PV.8 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for PV.8 because it is design-only and does not authorize promotion. Human review remains required for any later sprint that creates PV machine registries, implements promotion execution, authorizes student-facing PV projection, or changes lesson-side publication behavior.
