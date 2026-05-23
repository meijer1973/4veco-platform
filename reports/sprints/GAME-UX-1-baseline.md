# Sprint GAME-UX-1: Baseline

Date: 2026-05-23

## Plan reference

Plan: `reports/sprints/GAME-UX-1-plan.md`

## Current state

- Lesson `L1.7C-0` is closed and has handed the shared skill-map contract to
  the platform.
- Current platform skill-tree modes are `paragraph`, `chapter`, and `module`;
  `module` is the current all-skill catalog view.
- `activeSkills: null` is currently interpreted by the existing skill-tree
  engine as all skills visible.
- MTU records already expose aspect labels in read-only
  `references/machine/micro-teaching-units.json`, but the skill-tree base data
  does not yet pass those aspects through to runtime skill records.
- Existing reasoning, procedure/calculation, and graphical engines do not yet
  share a skill-map request/response view-model contract.

## Repository state

- Platform worktree has one unrelated pre-existing untracked file:
  `knowledge/exit-ticket-game-1.1.1.zip`.
- Lesson worktree is clean at baseline.
- GAME-UX-1 must not mutate lesson output.

## Data integrity notes

No protected reference data changes are planned. `references/machine/` and
`references/external/` are read-only inputs for this sprint. MTU aspect labels
may be read from `references/machine/micro-teaching-units.json` through existing
base-element adapters, but no machine-reference file may be edited by hand.

## Stop conditions

- Stop if implementation requires lesson-output mutation.
- Stop if implementation requires hand edits to `references/machine/` or
  `references/external/`.
- Stop if the untracked exit-ticket prototype zip would need to be imported,
  staged, moved, or deleted.
- Stop if the shared view model would authorize diagnostics, adaptive routing,
  mastery decisions, automatic sequencing, student-facing AI, summative use,
  PV projection, PV machine promotion, or student-facing output.
