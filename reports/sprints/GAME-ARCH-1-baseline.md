# Sprint GAME-ARCH-1: Baseline

Generated: 2026-05-31

## Plan reference

Plan: `reports/sprints/GAME-ARCH-1-plan.md`

## Roadmap authority

`references/reference-team-roadmap.md` and
`../4veco-lessen/lessen-team-roadmap.md` both name `GAME-ARCH-1` as the next
operational step after graph, math, and reasoning task-shell integration.

The active platform row requires a build-vs-rebuild decision for practice
engines around one shared task shell and one shared skill-map route. The
lesson roadmap blocks `GATE-ENGINE-1`, `L1.7B-Q2`, `GATE-L1.7B-Q2`, and Scale
Gate 1 reliance until this decision is made.

## Product specification baseline

`../4veco-lessen/specifications/product-end-state.md` says engine architecture
counts as product progress only when the student can see the route, practise
the right task through the right interaction, receive useful feedback, and
understand what to do next. It defines the shared route layer, shared
task-type shell, practice engines, and target-equivalent checkpoint
composition as one operational student interface.

`../4veco-lessen/specifications/companion-core-specifications.md` says the
shared task-type shell is the common interaction layer for target-equivalent
exit-ticket tasks, checkpoint-only local checks, graph/table games,
math/calculation games, and reasoning practice where interaction overlaps.
It also says checkpoint-only output may not imply target-equivalent proof.

The user has clarified an additional product boundary for this sprint: keep
the short check as an advisory local check and build the target-equivalent
exit ticket separately as a more thorough proof task. Short-check advice may
point students toward the exit ticket or additional practice, but it may not
claim diagnostics, mastery, automatic sequencing, summative status, or
paragraph proof.

## Carry-in findings

- GAME-UX-3A added the shared task-shell runtime foundation.
- ENGINE-OP-1 found that generated output did not yet use the task shell and
  that shared route panels were empty or mis-scoped.
- SKILLMAP-OP-1 made the shared route layer visible in live Book 1 routes.
- GRAPH-UX-2 made the `1.1.3` graph/table route the strongest current
  operational task-shell route and proved checkpoint-style graph tasks only as
  a non-published fixture.
- MATH-UX-2 integrated the task shell into the `1.1.2` calculation/index
  route and proved checkpoint-style calculation tasks only as a non-published
  fixture.
- REASON-UX-2 integrated the task shell into reasoning routes and added
  structured self-check plus richer repair feedback.
- MTU-H4C executed bounded answer-form MTU additions but kept missing
  generators generator-blocked/non-interactive and authorized no product use.

## Current implementation baseline

- The shared route layer is now visible in graph, math, reasoning, and support
  surfaces, but the degree of route clarity and target-chain link still needs
  a decision review.
- The shared task shell is now used by graph/table, math/calculation, and
  reasoning practice routes.
- The graph route currently has the strongest task-family breadth: table-value
  selection, graph reading, axis convention, interpolation, point placement,
  graph-construction substitute, calculation/work capture, and a less-labelled
  graph variant.
- The math route now uses task-shell calculation and notation interactions,
  especially for `A38` and `A39`, but remains practice evidence rather than
  target-equivalent proof.
- The reasoning route now includes structured reasoning self-check and richer
  feedback, but structured self-check is not the same as evaluated exam-style
  reasoning or answer-construction proof.
- The current `1.1.1` check remains a short local check. It should be kept as
  advisory, not promoted into target-equivalent proof.
- No `1.1.2` or `1.1.3` target-equivalent exit-ticket source/page exists.

## Data integrity notes

Protected reference data must remain unchanged. This sprint may not hand-edit
`references/machine/` or `references/external/`, may not write
`references/authored/course-target-exercises.json`, may not create or write
`references/data/exam-ingestion/answer-skill-candidates.json`, and may not
mint, update, split, or deprecate MTUs.

`source-data/book-*/exit-ticket/*.json` is forbidden for this sprint because
L1.7B-Q2 owns target-equivalent checkpoint implementation. Generated Book 1
output is read-only inspection evidence for this sprint and may not be
hand-patched or regenerated as a closure shortcut.

No target-equivalent proof, diagnostics, adaptive routing, mastery/sequencing,
student-facing AI, summative use, PV projection, PV machine promotion, Scale
Gate 1, or student/product use is authorized by this sprint.

## Initial stop conditions

- Stop if the architecture decision cannot be made without engine
  implementation changes.
- Stop if the decision requires writing target-exercise fields, exit-ticket
  source files, protected references, answer-skill candidate storage, or
  generated lesson output.
- Stop if short-check advice is treated as diagnostic, mastery, automatic
  sequencing, summative status, or target-equivalent proof.
- Stop if the exit ticket is weakened into a short advisory check rather than
  preserved as a separate target-equivalent proof task.
- Stop if any roadmap/spec update authorizes Scale Gate 1, diagnostics,
  adaptive routing, mastery/sequencing, student-facing AI, summative use, PV,
  or product use.
