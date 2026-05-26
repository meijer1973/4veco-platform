# Sprint GAME-UX-2: Baseline

Date: 2026-05-26

## Plan reference

Plan: `reports/sprints/GAME-UX-2-plan.md`

## Current state

- Lesson `L1.7B-C` closed the exit-ticket contract as contract-only work and
  paused implementation.
- Lesson `L1.7B-R` is blocked until platform support exists for a
  source-controlled, non-summative checkpoint surface.
- `GAME-UX-1` already provides `SkillMapEngine.createRequest("exit-ticket",
  ...)` with compact checkpoint defaults and product-use boundaries fixed
  false.
- `scripts/deploy.js` currently copies shared skill-map runtime files and
  generates existing game shells, but it does not yet copy or generate an
  exit-ticket checkpoint surface.
- `build-scripts/platform/build-landing-page.js` already hides the `Check`
  route unless an exit-ticket-like HTML file exists, but its current placeholder
  wording still needs product-boundary-safe copy before activation.
- Paragraph `1.1.1 Schaarste en economisch denken` has a paragraph plan with
  the target concepts `Schaarste`, `behoeften`, `middelen`, and
  `alternatieve kosten`, plus B01/B02 learning moves.

## Repository state

- Platform worktree has one unrelated pre-existing untracked file:
  `knowledge/exit-ticket-game-1.1.1.zip`.
- Lesson worktree is clean at baseline.
- No source-controlled exit-ticket runtime, generator, source data, or generated
  Book 1 exit-ticket surface exists yet.

## Data integrity notes

No protected reference data changes are planned. `references/machine/` and
`references/external/` are read-only and must not be edited by hand. GAME-UX-2
may read paragraph plans, deploy manifests, and existing shared skill-map code,
but it must not mutate machine references, external sources, EX candidate
storage, or q19 extraction evidence.

Generated lesson output is in scope only when produced by platform scripts. Any
manual edit to generated output in `../4veco-lessen/` is out of scope.

## Stop conditions

- Stop if implementation requires hand edits to generated lesson output.
- Stop if implementation requires importing, staging, moving, editing, or
  deleting `knowledge/exit-ticket-game-1.1.1.zip`.
- Stop if implementation requires hand edits to `references/machine/` or
  `references/external/`.
- Stop if the checkpoint uses mastery, pass/fail, score, grade, evidence,
  diagnostic, adaptive, sequencing, summative, AI, PV projection, or PV machine
  promotion semantics.
- Stop if internal MTU IDs appear in student-facing checkpoint text.
- Stop if the landing `Check` route appears for paragraphs without generated,
  reviewed checkpoint output.
- Stop if deploy or tests imply broad companion scaling, Scale Gate 1 closure,
  `GATE-L1.7B` closure, CP-6 closure, or Year-1 closure.
