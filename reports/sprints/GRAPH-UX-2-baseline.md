# Sprint GRAPH-UX-2: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/GRAPH-UX-2-plan.md`

## Roadmap authority

`references/reference-team-roadmap.md` and
`../4veco-lessen/lessen-team-roadmap.md` both mark `GRAPH-UX-2` as the active
next sprint after SKILLMAP-OP-1.

The active row requires graph/table practice to use the GAME-UX-3A shared task
shell. It names table-value selection, graph reading, economic axis convention,
interpolation, point placement or graph-construction substitute, and
less-labelled variants. It also requires one working `1.1.3` route and proof
that graph game and checkpoint graph tasks use coherent UI language.

## Product specification baseline

`../4veco-lessen/specifications/product-end-state.md` says the shared
task-type shell is the common interaction foundation for graph/table practice,
math/calculation practice, target-equivalent exit tickets, and checkpoint-only
local checks. It requires numeric input, calculation/work capture, final answer
entry, unit/notation fields, short constructed response, table-value
selection, graph reading, point placement or graph-construction substitute, and
neutral feedback/retry/self-check states.

`../4veco-lessen/specifications/companion-core-specifications.md` says graph,
calculation, and checkpoint tasks must use the shared task-type shell where the
interaction overlaps, with visible task purpose, route/skill labels in student
language, keyboard/focus and mobile behavior, light/dark rendering, and no
mastery, grade, diagnostic, adaptive, sequencing, summative, AI, PV, or
promotion claims.

## Carry-in findings

- GAME-UX-3A added `engines/task-shell-engine.js`,
  `engines/task-shell-ui.js`, and `engines/task-shell.css`, but did not
  generate lesson output.
- ENGINE-OP-1 found that generated Book 1 output did not use the task shell and
  that graph/math tasks used engine-specific UIs.
- ENGINE-OP-1 also found `1.1.3` graph practice was the strongest current
  operational route because it gave useful source/value/calculation feedback.
- SKILLMAP-OP-1 made the `1.1.3` graph route panel visible and scoped, but its
  specialist reviews carried flags for mobile graph route orientation and
  shared task-shell integration.

## Current implementation baseline

- `build-scripts/platform/build-graphical-shells.js` generates graph-game HTML
  but does not load `task-shell.css`, `task-shell-engine.js`, or
  `task-shell-ui.js`.
- `engines/graphical-ui.js` renders custom graph inputs, custom select grids,
  custom checklist UI, and custom feedback instead of `TaskShellUI`.
- `engines/graphical-engine.js` supports `bar_value_read`, `line_value_read`,
  and `graph_values_percentage_change`.
- `build-scripts/content/book-1/b1-113-graphical-data.js` contains current
  generated `1.1.3` graph data, including a less-labelled line variant, but it
  does not yet cover table-value selection, axis convention, interpolation, or
  point placement / graph-construction substitute through the task shell.
- `engines/exit-ticket-engine.js` validates only legacy choice tasks, and
  `engines/exit-ticket-ui.js` renders its own choice buttons. This means
  checkpoint-style graph tasks cannot yet prove coherent task-shell UI language.
- Generated Book 1 output currently has a `1.1.3` graph page and no `1.1.3`
  exit-ticket page. The landing page must keep `Check` hidden until reviewed
  target-equivalent checkpoint output exists.

## Data integrity notes

Protected reference data must remain unchanged. This sprint may not hand-edit
`references/machine/` or `references/external/`, may not write
`references/authored/course-target-exercises.json`, may not create or write
`references/data/exam-ingestion/answer-skill-candidates.json`, and may not
mint, update, split, or deprecate MTUs.

`source-data/book-*/exit-ticket/*.json` is forbidden for this sprint because
L1.7B-Q2 owns target-equivalent checkpoint implementation. GRAPH-UX-2 may add
checkpoint-compatible runtime support and non-published sprint fixtures only.

Generated Book 1 automated output may change only after platform deploy/build
commands, never by hand-patching HTML, CSS, JS, or data files.

No target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use is authorized by this sprint.

## Initial stop conditions

- Stop if the graph route can only use the shared task shell by weakening the
  task-shell family contract or bypassing validation.
- Stop if checkpoint-style graph task proof requires publishing a `1.1.3`
  exit-ticket page or writing `source-data/book-*/exit-ticket/1.1.3.json`.
- Stop if graph/table output would expose internal MTU IDs or operation codes
  to students.
- Stop if generated output is changed by hand instead of platform deploy/build
  commands.
- Stop if feedback or completion copy implies target-equivalent proof,
  diagnostics, grade, summative pass/fail, mastery, adaptive routing,
  automatic sequencing, PV, AI, Scale Gate 1, or student/product use.
