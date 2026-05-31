# Sprint REASON-UX-2: Result

Generated: 2026-05-31

Status: completed PASS WITH FLAGS after lead-review round 2.

## Plan reference

- Plan: `reports/sprints/REASON-UX-2-plan.md`
- Baseline: `reports/sprints/REASON-UX-2-baseline.md`
- Plan metadata: `references/data/sprints/REASON-UX-2.plan.json`
- Result metadata: `references/data/sprints/REASON-UX-2.result.json`

## Summary

REASON-UX-2 integrates the GAME-UX-3A shared task shell into the live generated
Book 1 reasoning routes for `1.1.1`, `1.1.2`, and `1.1.3`.

Primary implementation outcomes:

- reasoning shells load `task-shell.css`, `task-shell-engine.js`, and
  `task-shell-ui.js`;
- `ReasoningEngine` now exposes six modes, including `Redeneerantwoord
  opbouwen`;
- the new mode builds a `structured_reasoning` task-shell self-check from the
  existing reasoning data;
- self-check completion is practice-only, does not increment score, and does
  not write persistent `goed` progress;
- existing modes now show richer repair feedback with expected chains,
  selected-chain comparison, flow/step guides, and match explanations;
- generated Book 1 output was refreshed through platform deploy commands only.

No target-equivalent checkpoint was published. No target-equivalent completion
language, diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, Scale Gate 1, or
student/product use was authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-UX-2-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js REASON-UX-2` | passed |
| `npx.cmd jest --runInBand --runTestsByPath engines/tests/reasoning-engine.test.js engines/tests/reasoning-data.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js` | passed |
| `cmd /c "set MODULE_ROOT=..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod&& npx.cmd jest --runInBand --runTestsByPath engines/tests/reasoning-data.test.js"` | passed |
| `npm.cmd run check:platform` | passed |
| `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/capture-reason-ux2-screenshots.js` | passed |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/REASON-UX-2-result.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js REASON-UX-2 --complete` | passed |
| `rg -n "REASON-UX-2|structured_reasoning|reasoning task shell|feedback|GAME-ARCH-1" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md` | passed |
| `Get-ChildItem reports/sprints/REASON-UX-2-screenshots -File \| Measure-Object` | passed |
| Protected-surface diff check for protected references and exit-ticket source data | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |
| Lead-review round 1 | PASS WITH FLAGS, corrected |
| Lead-review recheck 1 | REVISE, corrected |
| Lead-review round 2 | PASS WITH FLAGS |

Complete closure validation passed after final metadata, archive, and roadmap
updates.

## Changed files

Platform source and tests:

- `build-scripts/platform/build-reasoning-engine.js`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/tests/reasoning-data.test.js`
- `engines/tests/reasoning-engine.test.js`
- `engines/tests/reasoning-ui.test.js`

Sprint evidence and validation:

- `build-scripts/sprints/check-reason-ux2-route-output.js`
- `build-scripts/sprints/capture-reason-ux2-screenshots.js`
- `reports/sprints/REASON-UX-2-*`
- `reports/sprints/REASON-UX-2-screenshots/*`
- `references/data/sprints/REASON-UX-2.plan.json`
- `references/data/sprints/REASON-UX-2.result.json`

Roadmaps and archive:

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/REASON-UX-2/*`

Generated Book 1 output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.1 Schaarste en economisch denken - redeneer-spel.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.2 Percentages en indexcijfers - redeneer-spel.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.3 Grafieken en tabellen - redeneer-spel.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`

## Data integrity notes

No protected reference data changed. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` remain unchanged.

No `source-data/book-*/exit-ticket/1.1.2.json` or `1.1.3.json` file was
created or written. No target-exercise `question_type` or `answer_form` fields
were written. No unit minting, unit updates, unit splits, or unit deprecations
were executed.

Generated Book 1 output changed only through platform deploy commands.

## Open follow-ups

- `GAME-ARCH-1`: decide refactor versus rebuild after graph/math/reasoning
  task-shell evidence and carry the mobile feedback-density flag.
- Future bounded source-data/content polish: improve terse reasoning labels if
  the architecture decision keeps the current CSV data path.
- `GATE-ENGINE-1`: inspect live engine integration before scale.
- `L1.7B-Q2` and `GATE-L1.7B-Q2`: own target-equivalent checkpoint proof and
  completion language.

## Rollback instructions

Revert the reasoning/task-shell runtime changes, generated reasoning shell
loading changes, focused tests, REASON-UX-2 checker/capture scripts, generated
Book 1 reasoning output from the matching deploy, screenshots, sprint records,
result metadata, roadmap/archive records, and generated indexes.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, or answer-skill candidate
storage as part of rollback.
