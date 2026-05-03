# Sprint PV-G4: Lesson Regression Proof

## Goal

Prepare the PV-G4 evidence intake for lesson-side Procedure-Visual regression proof, then stop until the lesson team provides at least two owned proof records.

PV-G4 is a proof gate, not a platform implementation sprint. It must not create PV machine registries, edit generated lesson output, or imply student-facing PV projection.

## Context

PV.7 closed with no machine promotion authorized. PV.8 designed a future promotion pipeline and made PV-G4 lesson-regression proof the next required step before reopening machine-authoritative or student-facing PV use.

The references team can define the proof template, proof-intake report, and review packet. The actual lesson-side evidence must come from lesson-team-owned work and commits.

## Allowed paths

- `docs/sprints/PV-G4-plan.md`
- `references/data/sprints/PV-G4.plan.json`
- `reports/sprints/PV-G4-baseline.md`
- `build-scripts/references/build-procedure-visual-lesson-regression-proof-intake.js`
- `build-scripts/references/check-procedure-visual-lesson-regression-proof-intake.js`
- `references/data/procedure-visual/lesson-regression-proof-requirements.json`
- `reports/json/procedure-visual-lesson-regression-proof-intake.json`
- `reports/markdown/procedure-visual-lesson-regression-proof-intake.md`
- `reports/review-gates/GATE-PV-G4-lesson-regression/review-packet.json`
- `reports/review-gates/GATE-PV-G4-lesson-regression/review-packet.md`
- `reports/review-gates/GATE-PV-G4-lesson-regression/proof-intake.json`
- `reports/review-gates/GATE-PV-G4-lesson-regression/proof-intake.md`
- `reports/review-gates/GATE-PV-G4-lesson-regression/proof-template.json`
- `reports/review-gates/GATE-PV-G4-lesson-regression/proof-template.md`
- `reports/review-gates/GATE-PV-G4-lesson-regression/bundle-urls.md`
- `reports/url-index.md`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/outdated/reference-team-roadmap-v2.39-pv8-promotion-pipeline-design.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- creation of any PV registry under `references/machine/`
- references-team commits to lesson-side generated output
- generated lesson-output hand patches
- authored-source mutation or RAG chunk patching
- student-facing PV projection
- generator exposure for generator-blocked units
- student diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative decisions

## Inputs

- `references/data/procedure-visual/procedure-templates.json`
- `references/data/procedure-visual/visual-states.json`
- `references/data/procedure-visual/unit-template-links.json`
- `references/data/procedure-visual/promotion-pipeline-design.json`
- `reports/json/procedure-visual-coverage.json`
- `reports/json/procedure-game-template-alignment.json`
- `reports/json/procedure-visual-projection-mvp.json`
- `reports/json/skilltree-generator-readiness.json`

## Outputs

- PV-G4 proof requirements and proof template.
- PV-G4 proof-intake JSON and Markdown report.
- Evidence-intake review packet for `GATE-PV-G4-lesson-regression`.
- Gate bundle URLs for review and lesson-team handoff.
- Roadmap/version-index update recording that PV-G4 proof intake is prepared and blocked pending lesson-team evidence.

## Operationalized sprint procedure

1. Record this plan and baseline before preparing proof-intake artifacts.
2. Build a read-only proof-intake report from the current PV overlay, promotion-pipeline design, and current absence of lesson-side regression proofs.
3. Validate that the intake packet requires two lesson-team-owned proofs and blocks closure while proof count is below two.
4. Emit a proof template that asks for lesson repo commit, paragraph or pilot surface, PV records used, validation commands, proof artifacts, owner, and explicit no-hand-patch confirmation.
5. Prepare the gate packet with review questions `PVG4-Q1` through `PVG4-Q5`, current hold recommendation, and the required evidence conditions.
6. Emit bundle URLs and update the roadmap to mark PV-G4 as evidence intake prepared, not completed.
7. Stop for lesson-team proof work. The references team must not edit or commit lesson-side generated output.
8. After proof records arrive, validate them, record answer patterns, list targeted follow-ups, produce a closure proposal, and require explicit HCS confirmation before closing PV-G4.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js docs/sprints/PV-G4-plan.md
node build-scripts/references/validate-procedure-visual-registry.js
node build-scripts/references/build-procedure-visual-lesson-regression-proof-intake.js
node build-scripts/references/check-procedure-visual-lesson-regression-proof-intake.js
node build-scripts/sprints/emit-gate-bundle-urls.js GATE-PV-G4-lesson-regression
node build-scripts/sprints/check-bundle-urls.js GATE-PV-G4-lesson-regression
node build-scripts/sprints/check-sprint-bundle.js PV-G4
node build-scripts/references/check-roadmap-version-index.js
node build-scripts/sprints/emit-url-index.js --check
```

## Rollback plan

Revert the PV-G4 proof-intake preparation commit. That removes the proof-intake builder/checker, proof template, generated intake reports, gate packet, bundle URLs, and roadmap/version-index update.

No protected reference rollback is needed because PV-G4 preparation must not mutate `references/machine/` or `references/external/`.

## Human review required

Yes, but not yet for closure. PV-G4 requires HCS review only after the lesson team submits at least two valid proof records. Until then, the correct gate state is hold pending lesson evidence.
