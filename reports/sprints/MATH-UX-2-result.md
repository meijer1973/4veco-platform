# Sprint MATH-UX-2: Result

Generated: 2026-05-31

Status: completed PASS WITH FLAGS after lead-review round 2.

## Plan reference

- Plan: `reports/sprints/MATH-UX-2-plan.md`
- Baseline: `reports/sprints/MATH-UX-2-baseline.md`
- Plan metadata: `references/data/sprints/MATH-UX-2.plan.json`
- Result metadata: `references/data/sprints/MATH-UX-2.result.json`

## Summary

MATH-UX-2 integrates the GAME-UX-3A shared task shell into the live generated
Book 1 `1.1.2 Percentages en indexcijfers` math/calculation route.

Primary implementation outcomes:

- skilltree shells load `task-shell.css`, `task-shell-engine.js`, and
  `task-shell-ui.js`;
- `SkillTreeEngine` evaluates `task_shell` exercise steps through
  `TaskShellEngine`;
- `SkillTreeUI` renders `TaskShellUI` tasks inside the math exercise flow;
- `A38` and `A39` generator steps now cover numeric input,
  calculation/work capture, final-answer entry, and notation fields;
- checkpoint-compatible calculation task-shell support is proven as a
  non-published fixture with `targetReadinessEvidence: false`;
- generated Book 1 output was refreshed through platform deploy commands only.

No `1.1.2` exit-ticket source file or page was created. No target-equivalent
completion language, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use was authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/MATH-UX-2-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MATH-UX-2` | passed |
| `npx.cmd jest --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/skilltree-data.test.js engines/tests/skilltree-engine.test.js engines/tests/skilltree-ui.test.js --runInBand` | passed |
| `npx.cmd jest --runInBand --runTestsByPath engines/tests/skilltree-engine.test.js engines/tests/skilltree-ui.test.js engines/tests/skilltree-data.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js` | passed |
| `cmd /c "set MODULE_ROOT=..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod&& npx.cmd jest --runInBand --runTestsByPath engines/tests/skilltree-data.test.js"` | passed |
| `npm.cmd run check:platform` | passed |
| `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/capture-math-ux2-screenshots.js` | passed |
| `npm.cmd run agent:index` | passed |
| `node build-scripts/sprints/emit-url-index.js` | passed |
| `npm.cmd run dashboard:internal` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-sprint-result.js reports/sprints/MATH-UX-2-result.md` | passed |
| Protected-surface diff check for protected references and exit-ticket source data | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js MATH-UX-2 --complete` | passed |
| Lead-review round 1 | REVISE, corrected |
| Lead-review round 2 | PASS WITH FLAGS |

Complete closure validation passed after final metadata and roadmap cleanup.

## Changed files

Platform source and tests:

- `build-scripts/platform/build-skilltree-shells.js`
- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `engines/skilltree.css`
- `engines/skilltree/generators.js`
- `engines/tests/skilltree-data.test.js`
- `engines/tests/skilltree-engine.test.js`
- `engines/tests/skilltree-ui.test.js`

Sprint evidence and validation:

- `build-scripts/sprints/check-math-ux2-route-output.js`
- `build-scripts/sprints/capture-math-ux2-screenshots.js`
- `reports/sprints/MATH-UX-2-*`
- `reports/sprints/MATH-UX-2-screenshots/*`
- `references/data/sprints/MATH-UX-2.plan.json`
- `references/data/sprints/MATH-UX-2.result.json`

Generated Book 1 output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.1 Schaarste en economisch denken - wiskundevaardigheden.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.2 Percentages en indexcijfers - wiskundevaardigheden.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.3 Grafieken en tabellen - wiskundevaardigheden.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree-engine.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree-ui.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree.css`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree/base-elements.js`

## Data integrity notes

No protected reference data changed. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` remain unchanged.

No `source-data/book-*/exit-ticket/1.1.2.json` file was created or written.
No target-exercise `question_type` or `answer_form` fields were written.
No unit minting, unit updates, unit splits, or unit deprecations were executed.

Generated Book 1 output changed only through platform deploy commands.

## Open follow-ups

- `REASON-UX-2`: upgrade reasoning variants and feedback.
- `GAME-ARCH-1`: decide refactor versus rebuild after graph/math/reasoning
  evidence.
- `GATE-ENGINE-1`: inspect live engine integration before scale.
- `L1.7B-Q2` and `GATE-L1.7B-Q2`: own target-equivalent checkpoint proof and
  completion language.

## Rollback instructions

Revert the skilltree/task-shell runtime changes, `A38`/`A39` task-shell
generator metadata, focused tests, MATH-UX-2 checker/capture scripts, generated
Book 1 skilltree output from the matching deploy, screenshots, sprint records,
result metadata, roadmap/archive records, and generated indexes.

Do not hand-edit generated lesson output, protected references,
target-exercise mappings, source exit-ticket data, or answer-skill candidate
storage as part of rollback.
