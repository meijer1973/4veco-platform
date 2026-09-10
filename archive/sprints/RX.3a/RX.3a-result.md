# Sprint RX.3a: Result

## Plan reference

`docs/sprints/RX.3a-plan.md`

## Summary

Completed RX.3a through human gate closure and the authorized CLI-only producer table/data mutation.

What RX.3a accomplished:

- Closed `GATE-RX3a-first-lane-mutation-review` as `pass_with_conditions`.
- Recorded HCS review answers in `human-interview.md` and `.json`.
- Re-ran live A-domain numbering and dependency checks before mutation.
- Applied the three authorized units through `unit-add.js`, in order: `A75`, `A76`, `A79`.
- Preserved the HCS dependency decision that `A76` needs `A14`, `A04`, and `A61`.
- Tracked `A75`, `A76`, and `A79` as generator-blocked and non-interactive until their generators and projection support exist and validate.

What RX.3a did not authorize:

- no mutation of `A77`, `A78`, `A80`, or `A81`
- no mutation of graphical `MO=MK` or held duplicate/overlap records
- no `unit-add-dep.js` execution
- no `references/external/` mutation
- no authored source mutation
- no RAG chunk hand-patching
- no student-facing skill-tree exposure for these three units
- no student diagnostics, adaptive routing, student-facing AI, sequencing, mastery, summative use, or student-facing PV projection

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js docs/sprints/RX.3a-plan.md`
- `node build-scripts/review-gates/validate-gate.js reports/review-gates/GATE-RX3a-first-lane-mutation-review/gate-closure.json`
- `node build-scripts/references/check-rx3a-first-lane-mutations.js`
- `node build-scripts/references/build-unit-index.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/reports/generate-all.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/reports/generate-reference-health.js`
- `node build-scripts/reports/check-reference-health.js`
- `node build-scripts/rag/build-chunks.js`
- `node build-scripts/rag/validate-chunks.js`
- `node build-scripts/rag/validate-query-output.js`
- `node build-scripts/rag/run-retrieval-evals.js`
- `node build-scripts/rag/validate-retrieval-eval-results.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/sprints/check-bundle-urls.js GATE-RX3a-first-lane-mutation-review`
- `node build-scripts/sprints/emit-url-index.js --check`

Sprint-close checks after this result artifact is written:

- `node build-scripts/sprints/check-sprint-result.js reports/sprints/RX.3a-result.md`
- `node build-scripts/sprints/check-sprint-bundle.js RX.3a --complete`

## Changed files

- `build-scripts/references/close-and-apply-rx3a-first-lane.js`
- `build-scripts/references/check-rx3a-first-lane-mutations.js`
- `docs/sprints/RX.3a-plan.md`
- `references/data/sprints/RX.3a.plan.json`
- `references/data/sprints/RX.3a.result.json`
- `references/machine/micro-teaching-units.md`
- `references/machine/micro-teaching-units.json`
- `reports/sprints/RX.3a-result.md`
- `reports/sprints/RX.3a-diff-summary.md`
- `reports/review-gates/GATE-RX3a-first-lane-mutation-review/`
- regenerated reference reports, RAG chunks/evals, source manifest, document inventory, URL index, and roadmap/version-index files

## Data integrity notes

Protected reference data changed only through `build-scripts/references/unit-add.js`.

RX.3a did not hand-edit:

- `references/machine/`
- `references/external/`

The three new A-domain units are catalog entries only. They are explicitly generator-blocked and must not be exposed in student-facing skill-tree or PV projection use before generator/projection implementation and validation.

## Open follow-ups

- Implement and validate `GEN_A75`, `GEN_A76`, and `GEN_A79` before any student-facing skill-tree exposure.
- Prepare the later RX.3b graph-lane review for `A77` and `A78` under PV graph-stage constraints.
- Keep `A80`, `A81`, and graphical `MO=MK` held until PV producer-graph pilot templates or a later explicit gate approves them.
- Continue without starting diagnostics, adaptive routing, student-facing AI, automatic sequencing, mastery decisions, summative use, or student-facing PV projection.

## Rollback instructions

Revert the RX.3a applied-state commit to remove the gate closure, mutation log, generator-block tracking updates, helper scripts, roadmap/version-index update, generated reports/RAG surfaces, and the CLI-added `A75`, `A76`, and `A79` machine-unit entries.

Do not manually patch `references/machine/` for rollback.
