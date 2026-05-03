# Sprint PV.8: Result

## Plan reference

Plan: `docs/sprints/PV.8-plan.md`

## Summary

PV.8 completed the Procedure-Visual promotion-pipeline design without executing promotion.

The design defines:

- `unit-template-links` as the only future first candidate for promotion;
- procedure templates, visual states, vocabulary, and schemas as records that remain governed overlays;
- proposed planning, promotion, and rollback CLI contracts, all marked `proposed_not_implemented`;
- proposed mutation-log schema with preimage/postimage hashes and rollback instructions;
- proposed validators for machine links, mutation logs, and publication boundaries;
- future promotion-gate questions and the requirement for PV-G4 lesson-regression proof.

No PV `references/machine/` registry was created.

## Acceptance test results

All PV.8 acceptance tests passed:

```text
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

## Changed files

Main changes:

- `references/data/procedure-visual/promotion-pipeline-design.json`
- `build-scripts/references/build-procedure-visual-promotion-pipeline-design.js`
- `build-scripts/references/check-procedure-visual-promotion-pipeline-design.js`
- `reports/json/procedure-visual-promotion-pipeline-design.json`
- `reports/markdown/procedure-visual-promotion-pipeline-design.md`
- `reports/review-gates/GATE-PV8-promotion-pipeline-design/*`
- `docs/sprints/PV.8-plan.md`
- `references/data/sprints/PV.8.*.json`
- `reports/sprints/PV.8-*.md`
- roadmap/versioning and URL index files

## Data integrity notes

No protected reference data changed. PV.8 did not hand-edit `references/machine/` or `references/external/`, did not create PV machine registries, did not promote unit-template links, did not promote provisional `exercise_operations`, did not mutate authored source files, did not patch RAG chunks, and did not touch lesson repositories.

## Open follow-ups

- Record at least two PV-G4 lesson-regression proofs before reopening promotion.
- Implement the proposed PV promotion CLI and validators only in a later sprint with explicit scope.
- Keep all PV records under `references/data/procedure-visual/` until a later human promotion gate authorizes a CLI-backed machine promotion.

## Rollback instructions

Revert the PV.8 design commit. That removes the design-only registry record, builder/checker, generated reports, technical gate artifacts, sprint records, roadmap archive/version update, and URL-index update.

Do not manually patch `references/machine/`; no protected reference data changed in PV.8.
