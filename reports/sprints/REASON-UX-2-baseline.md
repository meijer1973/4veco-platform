# Sprint REASON-UX-2: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/REASON-UX-2-plan.md`

## Roadmap authority

`references/reference-team-roadmap.md` and
`../4veco-lessen/lessen-team-roadmap.md` both mark `REASON-UX-2` as the active
next sprint after GRAPH-UX-2 and MATH-UX-2.

The active row requires the reasoning game to become a real practice engine
with richer causal/procedural variants, better replay value, short explanation
or structured reasoning tasks, and feedback that explains reasoning errors. It
must align with answer-form MTUs and target-exercise operation chains where
available.

## Product specification baseline

`../4veco-lessen/specifications/product-end-state.md` says the shared
task-type shell is the common interaction foundation for reasoning practice,
graph/table practice, math/calculation practice, and target-equivalent exit
tickets. It also says engine architecture counts as product progress only when
students can see the route, practise the right task through the right
interaction, receive useful feedback, and understand what to do next.

`../4veco-lessen/specifications/companion-core-specifications.md` says
`Redeneren`, `Rekenen`, `Grafieken`, and `Check` must share route language and
task-shell conventions where interaction overlaps. Reasoning tasks may use
structured reasoning or short constructed response, but must avoid mastery,
grade, diagnostic, adaptive, sequencing, summative, AI, PV, or promotion
claims.

## Carry-in findings

- GAME-UX-3A added `structured_reasoning` to the shared task-shell runtime.
- ENGINE-OP-1 proved generated output did not yet use the shared task shell.
- SKILLMAP-OP-1 made the reasoning skill-map route visible in generated Book 1
  output.
- GRAPH-UX-2 proved shared task-shell use in graph/table practice.
- MATH-UX-2 proved shared task-shell use in math/calculation practice.
- REASON-UX-2 is now the remaining practice-engine operationalization sprint
  before GAME-ARCH-1 and GATE-ENGINE-1.

## Current implementation baseline

- `build-scripts/platform/build-reasoning-engine.js` generates reasoning
  shells but does not load `task-shell.css`, `task-shell-engine.js`, or
  `task-shell-ui.js`.
- `engines/reasoning-engine.js` exposes five modes: order steps, build
  sub-questions, find the error, build flow diagram, and match structures.
- `engines/reasoning-ui.js` hardcodes menu rendering for five modes and uses
  engine-specific click controls.
- Current feedback for wrong order/sub-question/flow answers mostly reveals
  the correct order; it does not yet explain the reasoning repair in a rich
  way.
- `engines/task-shell-engine.js` already validates `structured_reasoning` as a
  non-deterministic self-check family with neutral feedback and boundary flags.
- Generated Book 1 output currently has reasoning pages for `1.1.1`, `1.1.2`,
  and `1.1.3`, with route panels from SKILLMAP-OP-1 but no reasoning task
  shell.

## Data integrity notes

Protected reference data must remain unchanged. This sprint may not hand-edit
`references/machine/` or `references/external/`, may not write
`references/authored/course-target-exercises.json`, may not create or write
`references/data/exam-ingestion/answer-skill-candidates.json`, and may not
mint, update, split, or deprecate MTUs.

`source-data/book-*/exit-ticket/*.json` is forbidden for this sprint because
L1.7B-Q2 owns target-equivalent checkpoint implementation. REASON-UX-2 may add
runtime task-shell proof and non-published sprint fixtures only.

Generated Book 1 automated output may change only after platform deploy/build
commands, never by hand-patching HTML, CSS, JS, or data files.

No target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use is authorized by this sprint.

## Initial stop conditions

- Stop if the reasoning route can only use the shared task shell by replacing
  the current game with an unreviewed new engine.
- Stop if structured reasoning proof requires publishing a target-equivalent
  exit-ticket page or writing `source-data/book-*/exit-ticket/*.json`.
- Stop if reasoning output exposes internal MTU IDs, generator IDs, or
  operation codes to students.
- Stop if generated output is changed by hand instead of platform deploy/build
  commands.
- Stop if feedback or completion copy implies target-equivalent proof,
  diagnostics, grade, summative pass/fail, mastery, adaptive routing,
  automatic sequencing, PV, AI, Scale Gate 1, or student/product use.
