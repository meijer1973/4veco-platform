# Sprint GAME-ARCH-2: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/GAME-ARCH-2-plan.md`

## Roadmap authority

`references/reference-team-roadmap.md` names `GAME-ARCH-2` as the top
operational next action after `GAME-ARCH-1`. The row requires a canonical
architecture for the shared route layer, shared task shell, graph/table
module, math/calculation module, reasoning module, advisory short-check route,
and target-equivalent checkpoint composition.

The lesson roadmap still needs to be brought forward from its stale
`GAME-ARCH-1` row during this sprint. That update must record `GAME-ARCH-1` as
closed, add `GAME-ARCH-2` before `GATE-ENGINE-1`, and preserve all blocks on
target-equivalent completion language, diagnostics, adaptive routing, mastery,
sequencing, summative use, PV, Scale Gate 1, and student/product use.

## Product specification baseline

`../4veco-lessen/specifications/product-end-state.md` says engine
architecture counts as product progress only when students can see the route,
practice through the correct task interface, receive useful feedback, and
understand what to do next. It defines the shared route layer, shared
task-type shell, practice engines, advisory short checks, and
target-equivalent checkpoint composition as part of one operational student
route.

`../4veco-lessen/specifications/companion-core-specifications.md` says the
shared task-type shell is the common interaction layer for target-equivalent
exit-ticket tasks, checkpoint-only local checks, graph/table games,
math/calculation games, and reasoning practice where interaction overlaps. It
also says advisory short checks are separate from the target-equivalent exit
ticket and may not imply proof evidence.

## Carry-in findings

- SKILLMAP-OP-1 made the shared route layer visible in live Book 1 routes.
- GRAPH-UX-2 made the `1.1.3` graph/table route the strongest current
  operational task-shell route.
- MATH-UX-2 integrated the task shell into the `1.1.2` calculation/index
  route and proved checkpoint-style calculation tasks only as a non-published
  fixture.
- REASON-UX-2 integrated the task shell into reasoning routes and added
  structured self-check plus richer repair feedback.
- GAME-ARCH-1 decided that an immediate full rebuild is not justified, but
  continued local patching is not safe without GAME-ARCH-2.
- GAME-ARCH-1 kept the short check advisory and kept the target-equivalent
  exit ticket separate.

## Current implementation baseline

- The shared route layer exists in `engines/skill-map-engine.js`,
  `engines/skill-map-route-ui.js`, and `engines/skill-map-route.css`.
- The shared task shell exists in `engines/task-shell-engine.js`,
  `engines/task-shell-ui.js`, and `engines/task-shell.css`.
- Graph/table practice uses `engines/graphical-*` plus Book 1 graph data
  builders and is the current reference direction.
- Math/calculation practice uses `engines/skilltree-*` with task-shell
  integration for calculation/index tasks, while procedure support remains a
  support route.
- Reasoning practice uses `engines/reasoning-*` with structured reasoning
  self-check and richer feedback, but still needs answer-form and
  constructed-response architecture.
- Exit-ticket/checkpoint runtime exists in `engines/exit-ticket-*`, but
  target-equivalent checkpoint publication remains future work.
- The current `1.1.1` check remains a short local advisory check. No `1.1.2`
  or `1.1.3` target-equivalent exit-ticket source/page exists.

## Data integrity notes

Protected reference data must remain unchanged. This sprint may not hand-edit
`references/machine/` or `references/external/`, may not write
`references/authored/course-target-exercises.json`, may not create or write
`references/data/exam-ingestion/answer-skill-candidates.json`, and may not
mint, update, split, or deprecate MTUs.

`source-data/book-*/exit-ticket/*.json` is forbidden for this sprint because
`L1.7B-Q2` owns target-equivalent checkpoint implementation. Generated Book 1
output is read-only inspection evidence and may not be regenerated or
hand-patched by this sprint.

No target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use is authorized by this sprint.

## Initial stop conditions

- Stop if the architecture plan cannot be made concrete without engine
  implementation changes.
- Stop if the plan requires writing target-exercise fields, exit-ticket source
  files, protected references, answer-skill candidate storage, or generated
  lesson output.
- Stop if short-check advice is treated as diagnostic, mastery, automatic
  sequencing, summative status, or target-equivalent proof.
- Stop if the exit ticket is weakened into a short advisory check rather than
  preserved as a separate target-equivalent proof task.
- Stop if any roadmap/spec update authorizes Scale Gate 1, diagnostics,
  adaptive routing, mastery/sequencing, student-facing AI, summative use, PV,
  or product use.
