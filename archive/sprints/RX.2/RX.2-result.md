# Sprint RX.2: Result

## Plan reference

`docs/sprints/RX.2-plan.md`

## Summary

Completed RX.2 through human gate closure and the authorized CLI-only first-lane mutation.

What RX.2 accomplished:

- Closed `GATE-RX2-first-lane-mutation-review` as `pass_with_conditions`.
- Recorded all ten HCS review answers in `human-interview.md` and `.json`.
- Re-ran live A-domain numbering and dependency checks before mutation.
- Applied the six authorized units through `unit-add.js`, in order: `A61`, `A66`, `A67`, `A70`, `A72`, `A74`.
- Strengthened `A61` as economic source-value selection for a calculation, not generic table reading.
- Preserved the `A70 -> A38` dependency adjustment in the gate closure and mutation log.
- Tracked all six units as generator-blocked and non-interactive until their `GEN_A*` implementations exist and validate.

What RX.2 did not authorize:

- no mutation outside the six approved candidates
- no `references/external/` mutation
- no authored source mutation
- no `unit-add-dep.js` execution
- no governed operation-registry promotion
- no RAG chunk hand-patching
- no student-facing skill-tree exposure for these six units
- no student diagnostics, adaptive routing, student-facing AI, sequencing, mastery, or summative use

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.2-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js RX.2`
- `node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-RX2-first-lane-mutation-review/gate-closure.json`
- `node build-scripts/references/check-rx2-first-lane-mutations.js`
- `node build-scripts/references/build-unit-index.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/reports/generate-all.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/reports/generate-reference-health.js`
- `node build-scripts/reports/check-reference-health.js`
- `node build-scripts/rag/build-chunks.js`
- `node build-scripts/rag/validate-chunks.js`
- `node build-scripts/rag/run-retrieval-evals.js`
- `node build-scripts/rag/validate-retrieval-eval-results.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/sprints/check-bundle-urls.js GATE-RX2-first-lane-mutation-review`
- `node build-scripts/sprints/emit-url-index.js --check`

Sprint-close checks after this result artifact is written:

- `node build-scripts/sprints/check-sprint-result.js reports/sprints/RX.2-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js RX.2 --complete`

## Changed files

- `build-scripts/references/close-and-apply-rx2-first-lane.js`
- `build-scripts/references/check-rx2-first-lane-mutations.js`
- `docs/sprints/RX.2-plan.md`
- `references/data/sprints/RX.2.plan.json`
- `references/data/sprints/RX.2.result.json`
- `references/data/sprints/RX.2-generator-blocked-units.json`
- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- `reports/sprints/RX.2-result.md`
- `reports/sprints/RX.2-diff-summary.md`
- `reports/review-gates/GATE-RX2-first-lane-mutation-review/`
- regenerated reference reports, RAG chunks/evals, source manifest, document inventory, URL index, and roadmap/version-index files

## Data integrity notes

Protected reference data changed only through `build-scripts/references/unit-add.js`.

RX.2 did not hand-edit:

- `references/machine/`
- `references/external/`

The six new A-domain units are catalog entries only. They are explicitly generator-blocked and must not be exposed in student-facing skill-tree use before generator implementation and validation.

## Open follow-ups

- Implement and validate `GEN_A61`, `GEN_A66`, `GEN_A67`, `GEN_A70`, `GEN_A72`, and `GEN_A74` before any student-facing skill-tree exposure.
- Keep `A62`, `A63`, `A64`, `A68`, `A69`, `A71`, `A73`, `A82`, `A83`, `A84`, producer candidates `A75-A81`, and held duplicate/overlap records blocked until later review.
- Continue toward the next roadmap item without starting diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, or summative use.

## Rollback instructions

Revert the RX.2 applied-state commit to remove the gate closure, mutation log, generator-block tracking, helper scripts, roadmap/version-index update, generated reports, and the CLI-added `A61`, `A66`, `A67`, `A70`, `A72`, and `A74` machine-unit entries.

Do not manually patch `references/machine/` for rollback.
