# Sprint MATH-UX-2: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/MATH-UX-2-plan.md`

## Roadmap authority

`references/reference-team-roadmap.md` and
`../4veco-lessen/lessen-team-roadmap.md` both mark `MATH-UX-2` as the active
next sprint after GRAPH-UX-2.

The active row requires the scoped math game to use the GAME-UX-3A shared task
shell for calculation operations. It names numeric input, calculation/work
capture, final answer, percentage/index notation, units where relevant, and
feedback on common calculation errors. It requires one working `1.1.2` route
showing the relationship between the skill-map route, math practice, and later
target-equivalent exit-ticket proof.

## Product specification baseline

`../4veco-lessen/specifications/product-end-state.md` says the shared
task-type shell is the common interaction foundation for graph/table practice,
math/calculation practice, target-equivalent exit tickets, and checkpoint-only
local checks. It requires numeric input, calculation/work capture,
final-answer entry, unit/notation fields, short constructed response,
graph/table tasks, and neutral feedback/retry/self-check states.

`../4veco-lessen/specifications/companion-core-specifications.md` says
calculation and checkpoint tasks must use the shared task-type shell where the
interaction overlaps, with visible task purpose, route/skill labels in student
language, keyboard/focus and mobile behavior, and no mastery, grade,
diagnostic, adaptive, sequencing, summative, AI, PV, or promotion claims.

## Carry-in findings

- L1.7C-MATH restored `wiskundevaardigheden.html` as the primary `Rekenen`
  route for `1.1.2` and `1.1.3`.
- SKILLMAP-OP-1 made the calculation route panel visible on the `1.1.2`
  math page, but deferred task-shell integration to MATH-UX-2.
- GRAPH-UX-2 proved task-shell integration in generated graph/table output
  and carried one non-blocking density flag: `GRAPH-UX2-SE-1`.
- L1.7B-P23 stopped instead of producing weak choice-only checkpoints for
  `1.1.2` and `1.1.3`, because these paragraphs require task types beyond MC.

## Current implementation baseline

- `build-scripts/platform/build-skilltree-shells.js` generates
  `wiskundevaardigheden.html` but does not load `task-shell.css`,
  `task-shell-engine.js`, or `task-shell-ui.js`.
- `engines/skilltree-ui.js` renders custom numeric inputs, MC buttons, order
  blocks, error cards, and custom feedback for exercises.
- `engines/skilltree-engine.js` evaluates legacy numeric, MC, order, and error
  steps. It does not yet expose task-shell task models for current steps.
- `engines/skilltree/generators.js` contains `A38` and `A39`, the scoped
  `1.1.2` calculation skills:
  - `A38 Procentuele verandering berekenen`;
  - `A39 Prijsindex (CPI) berekenen`.
- Generated Book 1 output currently has a `1.1.2` math page with a visible
  calculation route panel and old custom exercise widgets.
- Exit-ticket runtime can render task-shell tasks after GRAPH-UX-2, but no
  `1.1.2` exit-ticket source or page exists. The landing page must keep
  `Check` hidden until reviewed target-equivalent checkpoint output exists.

## Data integrity notes

Protected reference data must remain unchanged. This sprint may not hand-edit
`references/machine/` or `references/external/`, may not write
`references/authored/course-target-exercises.json`, may not create or write
`references/data/exam-ingestion/answer-skill-candidates.json`, and may not
mint, update, split, or deprecate MTUs.

`source-data/book-*/exit-ticket/*.json` is forbidden for this sprint because
L1.7B-Q2 owns target-equivalent checkpoint implementation. MATH-UX-2 may add
checkpoint-compatible runtime proof and non-published sprint fixtures only.

Generated Book 1 automated output may change only after platform deploy/build
commands, never by hand-patching HTML, CSS, JS, or data files.

No target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use is authorized by this sprint.

## Initial stop conditions

- Stop if the math route can only use the shared task shell by replacing the
  scoped skill-tree route with an unreviewed new engine.
- Stop if calculation task-shell proof requires publishing a `1.1.2`
  exit-ticket page or writing `source-data/book-*/exit-ticket/1.1.2.json`.
- Stop if math output exposes internal MTU IDs or operation codes to students.
- Stop if generated output is changed by hand instead of platform deploy/build
  commands.
- Stop if feedback or completion copy implies target-equivalent proof,
  diagnostics, grade, summative pass/fail, mastery, adaptive routing,
  automatic sequencing, PV, AI, Scale Gate 1, or student/product use.
