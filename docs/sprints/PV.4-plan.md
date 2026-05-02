# Sprint PV.4: Procedure/Game Projection Contract

## Goal

Add a backward-compatible Procedure-Visual mapping contract for procedure-game data. New mapped records may use `procedure_template_id` on the procedure and `formal_step_id` on each step; existing procedure-game data may remain `legacy_unmapped` and continue to run.

## Context

PV.3 added pilot Procedure-Visual templates and visual states, including `choose_by_opportunity_cost_flow` for B02. PV.4 should connect procedure-game records to those formal PV steps without forcing migration, changing lesson targets, or authorizing student-facing PV projection.

This sprint is platform/reference-side only. It proves the contract through engine support, tests, a references/data alignment fixture, and a technical alignment report.

## Allowed paths

- `docs/sprints/PV.4-plan.md`
- `references/data/sprints/PV.4.plan.json`
- `reports/sprints/PV.4-baseline.md`
- `engines/procedure-engine.js`
- `engines/tests/procedure-engine.test.js`
- `engines/tests/procedure-data-formal-step.test.js`
- `references/data/procedure-visual/procedure-game-alignment-pilots.json`
- `build-scripts/references/build-procedure-game-template-alignment.js`
- `reports/json/procedure-game-template-alignment.json`
- `reports/markdown/procedure-game-template-alignment.md`
- `reports/review-gates/GATE-PV4-procedure-game-contract/review-packet.json`
- `reports/review-gates/GATE-PV4-procedure-game-contract/review-packet.md`
- `reports/review-gates/GATE-PV4-procedure-game-contract/technical-closure.json`
- `reports/review-gates/GATE-PV4-procedure-game-contract/technical-closure.md`
- `reports/review-gates/GATE-PV4-procedure-game-contract/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.31-pv3-pilot-procedure-visual-templates.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `reports/sprints/PV.4-result.md`
- `reports/sprints/PV.4-diff-summary.md`
- `references/data/sprints/PV.4.result.json`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of `references/machine/procedure-templates.json`
- creation of `references/machine/visual-states.json`
- creation of `references/machine/procedure-game-template-alignment.json`
- mutation of authored source files or RAG chunks
- lesson repo commits or generated lesson target edits
- forced migration of existing procedure-game data
- visual renderer publication
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions
- student-facing PV projection

## Inputs

- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/unit-template-links.json`
- `references/data/procedure-visual/procedure-visual-vocab.json`
- `engines/procedure-engine.js`
- `engines/tests/procedure-engine.test.js`
- `engines/tests/procedure-data.test.js`
- `references/reference-team-roadmap.md`

## Outputs

- Optional `formal_step_id` support in `ProcedureEngine`.
- Engine alignment-status reporting with `mapped`, `partial_mapping`, and `legacy_unmapped` states.
- Optional formal-step data test for procedure datasets.
- `procedure-game-alignment-pilots.json` with one fully mapped B02 pilot and one legacy unmapped proof.
- JSON/Markdown procedure-game template alignment report.
- `GATE-PV4-procedure-game-contract` technical packet and closure.

## Operationalized sprint procedure

1. Record this plan and baseline before marking PV.4 complete.
2. Add optional formal-step support to the procedure engine without changing existing gameplay semantics.
3. Add tests proving mapped procedure data reports `mapped` and legacy data reports `legacy_unmapped`.
4. Add a references/data alignment fixture that maps one B02 procedure-game record to the PV.3 template and keeps one legacy fixture unmapped.
5. Build a read-only alignment report that validates step IDs against PV templates and confirms legacy unmapped data remains valid.
6. Emit bundle URLs and update the URL index.
7. Update the roadmap only after validators and tests pass, moving PV.4 to completed and leaving student-facing PV projection blocked.
8. Stop if the work would require `references/machine/` mutation, lesson-side changes, forced migration, or publication of PV projections.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV.4-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-game-template-alignment.js
npx.cmd jest engines/tests/procedure-engine.test.js engines/tests/procedure-data-formal-step.test.js --runInBand
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV4-procedure-game-contract
node build-scripts/sprints/check-bundle-urls.js GATE-PV4-procedure-game-contract
node build-scripts/sprints/check-sprint-bundle.js PV.4
node build-scripts/sprints/check-sprint-result.js reports/sprints/PV.4-result.md
node build-scripts/sprints/check-sprint-bundle.js PV.4 --complete
node build-scripts/references/check-roadmap-version-index.js
```

## Rollback plan

Revert the PV.4 commit. That removes optional formal-step engine/report support, the alignment fixture, tests, reports, technical gate artifacts, sprint records, and roadmap/version-index updates.

No protected reference data rollback is needed because PV.4 must not mutate `references/machine/` or `references/external/`.

## Human review required

No formal human review is required for PV.4 because `GATE-PV4-procedure-game-contract` is a technical contract gate. Human review remains required for later PV machine promotion, forced migration, or student-facing publication decisions.
