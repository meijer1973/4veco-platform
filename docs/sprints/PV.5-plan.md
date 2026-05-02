# Sprint PV.5: Visual Projection MVP

## Goal

Build the first non-dynamic Procedure-Visual render/validation layer for formula traces, flowcharts, table traces, and static graph stages.

PV.5 must prove that PV pilot templates and visual states can be converted into surface-specific SVG projection models without authorizing student-facing publication.

## Context

PV.3 created six pilot procedure templates, six pilot visual states, and six unit-template links under `references/data/procedure-visual/`. PV.4 added optional procedure-game `formal_step_id` alignment and proved one B02 procedure-game pilot maps to a PV template while legacy unmapped procedure games remain valid.

RX.5 added representation-operation coverage reports and preserved generator/PV publication blocks. PV.5 should now add reusable render/validation libraries for the PV layer, but it must not create machine registries, mutate source references, touch lesson repositories, or publish generated visuals to students.

## Allowed paths

- `docs/sprints/PV.5-plan.md`
- `references/data/sprints/PV.5.plan.json`
- `reports/sprints/PV.5-baseline.md`
- `build-scripts/lib/lib-procedure-visual.js`
- `build-scripts/lib/lib-visual-state-renderer.js`
- `build-scripts/lib/lib-formula-trace-renderer.js`
- `build-scripts/lib/lib-flowchart-renderer.js`
- `build-scripts/lib/lib-table-trace-renderer.js`
- `build-scripts/lib/lib-graph-stage-renderer.js`
- `build-scripts/references/build-procedure-visual-projection-mvp.js`
- `build-scripts/references/check-procedure-visual-projection-mvp.js`
- `reports/json/procedure-visual-projection-mvp.json`
- `reports/markdown/procedure-visual-projection-mvp.md`
- `reports/procedure-visual-projections/*.svg`
- `reports/review-gates/GATE-PV5-visual-projection-mvp/review-packet.json`
- `reports/review-gates/GATE-PV5-visual-projection-mvp/review-packet.md`
- `reports/review-gates/GATE-PV5-visual-projection-mvp/technical-closure.json`
- `reports/review-gates/GATE-PV5-visual-projection-mvp/technical-closure.md`
- `reports/review-gates/GATE-PV5-visual-projection-mvp/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.33-rx5-representation-operation-reports.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/PV.5-result.md`
- `reports/sprints/PV.5-diff-summary.md`
- `references/data/sprints/PV.5.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/procedure-visual-vocab.json`
- mutation of authored source files or RAG chunks
- lesson repo commits or generated lesson target edits
- dynamic graph manipulation or student-interactive PV projection
- forced migration of existing procedure games
- visual publication into lesson targets
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing PV projection

## Inputs

- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- `references/data/procedure-visual/procedure-visual-vocab.json`
- `reports/json/procedure-game-template-alignment.json`
- `build-scripts/lib/lib-visual-surfaces.js`
- `references/reference-team-roadmap.md`

## Outputs

- Reusable PV data-loading and projection helper library.
- Renderer dispatcher plus four non-dynamic renderer libraries:
  - formula trace
  - flowchart
  - table trace
  - static graph stage
- SVG projection samples under `reports/procedure-visual-projections/`.
- JSON/Markdown projection-MVP report.
- `GATE-PV5-visual-projection-mvp` technical packet and closure.
- Updated roadmap/version index moving PV.5 to completed and PV.6 to the top open sprint.

## Operationalized sprint procedure

1. Record this plan and baseline before marking PV.5 complete.
2. Add reusable libraries that read PV overlays and render non-dynamic SVGs for the four pilot visual types.
3. Keep render output report-side only: generated SVGs may be proof artifacts under `reports/`, not student-facing lesson assets.
4. Build a projection-MVP report that validates surface coverage, renderer coverage, procedure-game alignment proof, answer-model step order, publication blocks, and no machine-registry promotion.
5. Add a checker that proves formula trace, flowchart, table trace, and graph-stage renderers all produce surfaces and that at least one pilot can render web-light, web-dark, slide, and docx/doc surfaces.
6. Emit a technical gate bundle for `GATE-PV5-visual-projection-mvp`.
7. Update the roadmap and version index only after validators and sprint bundle checks pass.
8. Stop if the work would require `references/machine/` mutation, external-source mutation, lesson-side changes, dynamic graph manipulation, publication, forced procedure-game migration, or any student-facing/adaptive use.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.5-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-projection-mvp.js
node build-scripts/references/check-procedure-visual-projection-mvp.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV5-visual-projection-mvp
node build-scripts/sprints/check-bundle-urls.js GATE-PV5-visual-projection-mvp
node build-scripts/sprints/check-sprint-bundle.js PV.5
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.5-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.5 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the PV.5 commit. That removes the PV render libraries, projection report builder/checker, generated proof SVGs, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.

No protected reference data rollback is needed because PV.5 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for PV.5 because it is a technical projection/validation MVP. Human review remains required before student-facing PV projection, machine promotion, dynamic graph interactions, generator exposure, or lesson-side publication.
