# Sprint SYNC-4: Baseline

## Plan reference

`reports/sprints/SYNC-4-plan.md`

## Current state

`GATE-MTU-H4` is the active platform human-review sprint. It reviews
answer-form and question-type routing only and does not authorize mutation or
student/product use.

The lesson roadmap marks `GAME-UX-3` as the active platform handoff before
`L1.7B-Q2`, but the row is still framed as exit-ticket task-type expansion.
The product and companion specifications define a coherent student route and a
shared skill-map layer, but they do not yet state that the task-type UI itself
is a shared operational foundation for checkpoint, graph/table, and
math/calculation practice.

## Baseline findings

- The shared skill-map runtime exists as architecture, but the roadmap does not
  yet require enough student-visible route proof.
- The current task-type expansion row is too narrow: it can be read as an
  exit-ticket-only dependency instead of a reusable task shell for graph/table,
  math/calculation, and checkpoint surfaces.
- `L1.7C`, `L1.7C-MATH`, and `L1.7B-P23` already record the main flags:
  graph variants are narrow, reasoning needs richer variants, math is restored
  but not target-exercise-readiness evidence, and choice-only checkpoints
  cannot honestly check `1.1.2` or `1.1.3`.
- Scale Gate 1 is blocked, but it does not yet require a named operational
  integration review of live student routes across skill map, math, graph,
  reasoning, and checkpoint surfaces.

## Data integrity notes

No protected reference data has been changed at baseline. SYNC-4 must not
hand-edit `references/machine/` or `references/external/`, mutate authored
target exercises, create candidate storage, write answer-skill candidates,
refresh generated projections after no source mutation, or generate lesson
output. The unrelated untracked `knowledge/exit-ticket-game-1.1.1.zip` is
present in the platform worktree and must remain unstaged and untouched.

## Stop conditions checked

- Stop if the shared task shell wording would imply implementation already
  exists.
- Stop if the roadmap would authorize protected reference mutation, unit
  minting, target-exercise writes, answer-skill candidate writes, generated
  projections, or lesson output.
- Stop if Scale Gate 1 can run before operational engine proof or an explicit
  human waiver.
- Stop if any wording implies diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, or student/product use.
