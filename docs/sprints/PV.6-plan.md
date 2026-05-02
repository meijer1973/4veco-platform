# Sprint PV.6: Coverage Reports And Dashboard Integration

## Goal

Add Procedure-Visual coverage reporting and a reference-health dashboard summary without treating PV records as curriculum authority.

PV.6 must show which units have PV templates, visual-state sequences, surface variants, procedure-game mapping, answer-model step order, generator support, and blocker reasons.

## Context

PV.3 created pilot templates, visual states, and unit-template links. PV.4 added optional procedure-game alignment. PV.5 added report-side renderers and SVG proof artifacts. All PV publication remains blocked.

PV.6 should make this state visible in reports and `reference-health`, while preserving the boundaries: PV is a `references/data/` overlay, generator-blocked units remain non-interactive, and no student-facing projection is authorized.

## Allowed paths

- `docs/sprints/PV.6-plan.md`
- `references/data/sprints/PV.6.plan.json`
- `reports/sprints/PV.6-baseline.md`
- `build-scripts/references/build-procedure-visual-coverage.js`
- `build-scripts/references/check-procedure-visual-coverage.js`
- `build-scripts/reports/generate-reference-health.js`
- `build-scripts/reports/check-reference-health.js`
- `reports/json/procedure-visual-coverage.json`
- `reports/markdown/procedure-visual-coverage.md`
- `reports/json/reference-health.json`
- `reports/markdown/reference-health.md`
- `reports/review-gates/GATE-PV6-coverage-dashboard/review-packet.json`
- `reports/review-gates/GATE-PV6-coverage-dashboard/review-packet.md`
- `reports/review-gates/GATE-PV6-coverage-dashboard/technical-closure.json`
- `reports/review-gates/GATE-PV6-coverage-dashboard/technical-closure.md`
- `reports/review-gates/GATE-PV6-coverage-dashboard/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.34-pv5-visual-projection-mvp.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/PV.6-result.md`
- `reports/sprints/PV.6-diff-summary.md`
- `references/data/sprints/PV.6.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/procedure-visual-vocab.json`
- mutation of authored source files or RAG chunks
- lesson repo commits or generated lesson target edits
- PV machine-registry promotion
- student-facing PV projection
- generator exposure for blocked units
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/machine/micro-teaching-units.json`
- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- `reports/json/procedure-game-template-alignment.json`
- `reports/json/procedure-visual-projection-mvp.json`
- generator-blocked sprint/gate JSON files
- `engines/skilltree/generators.js`
- `reports/json/reference-health.json`

## Outputs

- JSON/Markdown Procedure-Visual coverage report.
- Reference-health JSON/Markdown summary with PV coverage and explicit authority boundaries.
- `GATE-PV6-coverage-dashboard` technical packet and closure.
- Updated roadmap/version index moving PV.6 to completed and RX.6 to the top open sprint.

## Operationalized sprint procedure

1. Record this plan and baseline before marking PV.6 complete.
2. Build a read-only PV coverage report from existing PV templates, visual states, unit-template links, PV.4 game alignment, PV.5 projection proof, generator implementation state, and generator-block records.
3. Report coverage dimensions per PV-linked unit: procedure template, visual-state sequence, surface variants, procedure-game mapping, answer-model step order, generator support, and blocker reasons.
4. Integrate a compact PV summary into `reference-health`, with `curriculum_authority: false`, `student_facing_projection_authorized: false`, and `machine_registry_created: false`.
5. Add checkers that prove PV coverage remains diagnostic-only, generator blocks remain visible, and reference health preserves blocked downstream uses.
6. Emit a technical gate bundle for `GATE-PV6-coverage-dashboard`.
7. Update the roadmap and version index only after report, health, and sprint validators pass.
8. Stop if the work would require `references/machine/` mutation, external-source mutation, lesson-side changes, PV publication, generator exposure, or student-facing/adaptive use.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.6-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-coverage.js
node build-scripts/references/check-procedure-visual-coverage.js
node build-scripts/reports/generate-reference-health.js
node build-scripts/reports/check-reference-health.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV6-coverage-dashboard
node build-scripts/sprints/check-bundle-urls.js GATE-PV6-coverage-dashboard
node build-scripts/sprints/check-sprint-bundle.js PV.6
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.6-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.6 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the PV.6 commit. That removes the PV coverage report builder/checker, generated coverage report, reference-health PV summary changes, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.

No protected reference data rollback is needed because PV.6 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for PV.6 because it is dashboard/report integration only. Human review remains required before PV machine promotion, student-facing projection, generator exposure, or lesson-side publication.
