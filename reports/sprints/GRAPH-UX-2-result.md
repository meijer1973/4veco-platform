# Sprint GRAPH-UX-2: Result

Generated: 2026-05-31

Status: completed PASS WITH FLAGS after lead-review round 2.

## Plan reference

- Plan: `reports/sprints/GRAPH-UX-2-plan.md`
- Baseline: `reports/sprints/GRAPH-UX-2-baseline.md`
- Plan metadata: `references/data/sprints/GRAPH-UX-2.plan.json`
- Result metadata: `references/data/sprints/GRAPH-UX-2.result.json`

## Summary

GRAPH-UX-2 integrated the GAME-UX-3A shared task shell into the live generated
Book 1 `1.1.3 Grafieken en tabellen` graph/table route.

Primary implementation outcomes:

- graph shells now load `task-shell.css`, `task-shell-engine.js`, and
  `task-shell-ui.js`;
- `GraphicalEngine` validates and evaluates task-shell graph/table tasks;
- `GraphicalUI` renders graph/table work through `TaskShellUI.renderTask`;
- generated `1.1.3` graph data covers table-value selection, graph reading,
  economic axis convention, interpolation, point placement,
  graph-construction substitute, calculation/work capture, and a less-labelled
  graph variant;
- checkpoint-compatible graph task-shell support exists in the exit-ticket
  runtime, but only as a non-published fixture with `targetReadinessEvidence:
  false`;
- graph feedback is rendered in a labelled `aria-live` feedback region and
  focus moves there after checking;
- generated Book 1 output was refreshed through platform build/deploy commands
  only.

No `1.1.3` exit-ticket source file or page was created. No target-equivalent
completion language, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use was authorized.

## Acceptance test results

| Command | Status |
|---|---|
| `node build-scripts/sprints/check-sprint-plan.js reports/sprints/GRAPH-UX-2-plan.md` | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GRAPH-UX-2` | passed |
| `npx.cmd jest --runInBand --runTestsByPath engines/tests/graphical-engine.test.js engines/tests/graphical-ui.test.js engines/tests/graphical-data.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js` | passed |
| `cmd /c "set MODULE_ROOT=..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod&& npx.cmd jest --runInBand --runTestsByPath engines/tests/graphical-data.test.js"` | passed |
| `npm.cmd run check:platform` | passed with existing fixture warnings |
| `node build-scripts/content/book-1/b1-113-graphical-data.js` | passed |
| `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| `node build-scripts/sprints/capture-graph-ux2-screenshots.js` | passed |
| `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"` | passed |
| live in-app browser graph route check over local HTTP | passed |
| live in-app browser feedback focus check over local HTTP | passed |
| `node build-scripts/sprints/check-sprint-bundle.js GRAPH-UX-2 --complete` | passed |
| `node build-scripts/references/check-roadmap-version-index.js` | passed |
| `npm.cmd run check:scope-language` | passed |
| `node build-scripts/sprints/emit-url-index.js --check` | passed |
| `node build-scripts/reports/validate-report-json.js` | passed |
| screenshot count check | passed |
| protected-surface diff check | passed |
| `git diff --check` | passed |
| `git -C ../4veco-lessen diff --check` | passed |

## Changed files

Platform source and tests:

- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `engines/graphical.css`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `build-scripts/platform/build-graphical-shells.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- `engines/tests/graphical-engine.test.js`
- `engines/tests/graphical-ui.test.js`
- `engines/tests/graphical-data.test.js`
- `engines/tests/task-shell-ui.test.js`
- `engines/tests/exit-ticket-engine.test.js`
- `engines/tests/exit-ticket-ui.test.js`

Sprint evidence and validation:

- `build-scripts/sprints/check-graph-ux2-route-output.js`
- `build-scripts/sprints/capture-graph-ux2-screenshots.js`
- `reports/sprints/GRAPH-UX-2-*`
- `reports/sprints/GRAPH-UX-2-screenshots/*`
- `references/data/sprints/GRAPH-UX-2.plan.json`
- `references/data/sprints/GRAPH-UX-2.result.json`

Roadmaps and generated indexes:

- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- lesson archive records under
  `../4veco-lessen/archive/sprints/GRAPH-UX-2/`

Generated Book 1 output:

- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.2 Percentages en indexcijfers – grafiekenspel.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/.../1.1.3 Grafieken en tabellen – grafiekenspel.html`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/graphical-engine.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/graphical-ui.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/graphical.css`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/graphical/1.1.3.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-ui.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell.css`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket-engine.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/exit-ticket-ui.js`

## Data integrity notes

No protected reference data changed. `references/machine/`,
`references/external/`, `references/authored/course-target-exercises.json`, and
`references/data/exam-ingestion/answer-skill-candidates.json` remain unchanged.

No `source-data/book-*/exit-ticket/1.1.3.json` file was created or written.
No target-exercise `question_type` or `answer_form` fields were written.
No unit minting, unit updates, unit splits, or unit deprecations were executed.

Generated Book 1 output changed only through platform build/deploy commands.
The `1.1.2` graph shell changed because the shared graph shell generator now
loads task-shell assets for all graph game shells. Its graph data did not
change.

## Open follow-ups

- `GRAPH-UX2-SE-1`: desktop first-viewport density. Controls begin below the
  first `1280 x 760` viewport; carry as non-blocking UI polish.
- `MATH-UX-2`: integrate the shared task shell into the `1.1.2`
  calculation/index route.
- `REASON-UX-2`: upgrade reasoning variants and feedback.
- `L1.7B-Q2` and `GATE-L1.7B-Q2`: own target-equivalent checkpoint
  implementation and completion copy.
- `GATE-ENGINE-1`: owns broader engine coherence and scale-readiness review.

## Rollback instructions

If GRAPH-UX-2 must be reverted, revert the graph/task-shell/checkpoint runtime
changes, graph shell load changes, `1.1.3` graph data generation changes,
focused tests, GRAPH-UX-2 checker/capture scripts, generated Book 1 output
from the matching deploy, screenshot evidence, sprint records, roadmap/archive
records, and generated maps/indexes. Do not hand-edit generated lesson output,
protected references, target-exercise mappings, source exit-ticket data, or
answer-skill candidate storage as part of rollback.
