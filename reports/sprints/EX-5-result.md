# Sprint EX-5: Result

Date: 2026-05-24

Status: completed.

## Plan reference

`reports/sprints/EX-5-plan.md`

## Summary

EX-5 completed the operation/answer-skill/q19 extraction contract as a
design-only sprint.

Primary outputs:

- `references/schemas/operation-answer-skill-contract.schema.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.md`
- `build-scripts/references/check-ex5-operation-answer-skill-contract.js`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/review-packet.json`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/review-packet.md`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/bundle-urls.md`

The contract defines future overlay-first storage for operation candidates,
answer-skill candidates, and q19 source-annex extraction overlays. Those future
storage files were not created. The contract also defines required fields,
validator/CLI preconditions, rollback requirements, audit evidence, and stop
conditions.

## Decisions Preserved

- `q3-calc-1` remains an operation design candidate with `A61` support and
  stale `A15` rejected.
- `q3-answer-1` remains a separate answer-skill candidate.
- `q19-source-annex-gap` and `q19-graph-object-gap` remain blocking.
- `q19-graph-op-1` carries `A42` and `D10` as candidates, with `A45` weak
  support only.
- `q19-reason-1` remains a provisional operation candidate blocked by q19
  source/graph gaps.
- `q15-answer-1` remains a separate answer-skill candidate; `D27`/`F03`/`F09`
  cover content only.

## Authority Boundary

EX-5 authorizes no protected reference mutation, external-source mutation,
machine-reference mutation, unit minting, operation-registry mutation,
answer-skill mutation, q19 source-annex extraction execution, PV/graph mutation,
target-exercise promotion, lesson-output mutation, CP-6 closure, Year-1 closure,
diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, or student-facing output.

## Roadmap Outcome

`references/reference-team-roadmap.md` is now
`v2.76-ex5-operation-answer-skill-contract`. `EX-5` moved to Closed Sprints and
`GATE-EX5 Operation And Answer-Skill Contract Human Review` is the active item
at the top of the Sprint Ledger.

Archived snapshot:

- `docs/roadmaps/outdated/reference-team-roadmap-v2.75-l17d-closed-pass-with-flags.md`

## Acceptance test results

Passed:

- `node build-scripts/sprints/check-sprint-plan.js reports/sprints/EX-5-plan.md`
- `node build-scripts/sprints/check-sprint-bundle.js EX-5`
- `node build-scripts/references/check-ex4-mutation-planning.js`
- `node build-scripts/references/check-exam-ingestion-contract.js`
- `node build-scripts/references/check-exam-ingestion-pilots.js`
- `node build-scripts/references/check-exam-ingestion-coverage.js`
- `node build-scripts/references/check-ex5-operation-answer-skill-contract.js`
- `node build-scripts/references/check-skill-operation-registry.js`
- `node build-scripts/references/validate-core-schemas.js`
- `node build-scripts/reports/generate-all.js`
- `node build-scripts/reports/validate-report-json.js`
- `node build-scripts/reports/generate-reference-health.js`
- `node build-scripts/reports/check-reference-health.js`
- `npm.cmd run dashboard:internal`
- `npm.cmd run agent:index`
- `node build-scripts/sprints/emit-gate-bundle-urls.js GATE-EX5-operation-answer-skill-contract`
- `node build-scripts/sprints/emit-url-index.js`
- `node build-scripts/sprints/emit-url-index.js --check`
- `node build-scripts/references/build-source-document-registry.js`
- `node build-scripts/references/build-reference-inventory.js`
- `node build-scripts/references/check-source-document-registry.js`
- `node build-scripts/references/check-source-manifest.js`
- `node build-scripts/references/check-document-inventory.js`
- `node build-scripts/references/check-roadmap-version-index.js`
- `npm.cmd test`

## Changed files

Primary changed surfaces:

- `references/schemas/operation-answer-skill-contract.schema.json`
- `references/data/exam-ingestion/operation-answer-skill-contract.*`
- `build-scripts/references/check-ex5-operation-answer-skill-contract.js`
- `reports/review-gates/GATE-EX5-operation-answer-skill-contract/`
- `reports/sprints/EX-5-*`
- `references/data/sprints/EX-5.plan.json`
- `references/data/sprints/EX-5.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- generated reports, dashboards, source-document registry, source manifest,
  document inventory, GitHub agent indexes, and URL index

## Data integrity notes

No protected reference data was changed. EX-5 did not hand-edit
`references/machine/` or `references/external/`, did not mutate
`references/data/skill-operation-registry.json`, did not create future
candidate-storage files, did not execute q19 extraction, did not mutate authored
target exercises or owned blueprint sources, and did not touch lesson output.
The unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` remained
unstaged and untouched.

## Open follow-ups

Run the formal `GATE-EX5 Operation And Answer-Skill Contract Human Review`.
Do not execute candidate writes, CLI writes, q19 source-annex extraction
execution, lesson handoff, PV projection, or student-facing use from EX-5
alone.

## Rollback instructions

Revert the EX-5 implementation commit. Rollback removes the EX-5 contract,
schema, checker, review packet, sprint logs, generated index/report refreshes,
and roadmap bookkeeping. Do not hand-edit `references/machine/`,
`references/external/`, `references/data/skill-operation-registry.json`,
authored target exercises, owned blueprint sources, lesson output, or the
unrelated `knowledge/exit-ticket-game-1.1.1.zip`.

## Next Action

Run the formal `GATE-EX5 Operation And Answer-Skill Contract Human Review`.
Do not execute mutation, candidate writes, CLI writes, q19 source-annex
extraction execution, lesson handoff, PV projection, or student-facing use from
EX-5 alone.
