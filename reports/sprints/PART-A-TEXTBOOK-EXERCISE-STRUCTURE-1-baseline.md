# Sprint PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1: Baseline

Generated: 2026-08-29

## Plan reference

Plan: `reports/sprints/PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1-plan.md`

## Repository and issue baseline

- Worktree: `C:/wt/Issue 218, textbook excercises/4veco-platform`
- Branch: `codex/part-a-textbook-exercise-structure-1-20260829`
- Task/lock owner: `PART-A-TEXTBOOK-EXERCISE-STRUCTURE-1` / `codex-root`
- Base: `origin/main` at `11c7a0286776064a694efa4e3cc9e91b4e62fa5c`
- GitHub issue: `https://github.com/meijer1973/4veco-platform/issues/218`
- Worktree-safety and governance-freshness preflight passed before planning.
- Lesson repository `origin/main` was read only at
  `f09fd6e88edc5049b026b16b0158e7e188091d2d` for product-vision,
  product-end-state, and companion-boundary context.
- A detached read-only lesson validation worktree now exists at
  `C:/wt/Issue 218, textbook excercises/4veco-lessen`, pinned to that same SHA.
  It has no branch, no modifications, and exists only because the active
  exercise-currentness guard expects `../4veco-lessen`.

## Current contract conflicts

- `references/authored/didactiek-principes.md` teaches the old order:
  worked example, `Startoefeningen`, independent practice, interleaving,
  target, stretch, with a rigid 40-60 minute percentage allocation.
- `skills/econ-exercise-builder.md` repeats that sequence and its output
  example does not expose the required seven headings.
- `skills/econ-textbook-paragraph.md` summarizes exercises as
  `guided -> independent -> interleaving -> target` and places a summary box
  plus website-help stage between the worked example and exercises. The chosen
  disposition is a contiguous seven-heading block, summary after section 7,
  and subordinate non-heading website help inside `Startopgaven`.
- `skills/econ-didactiek.md` contains correct general differentiation,
  scaffolding, and bonus principles but does not bind them to the new Part A
  short/support/challenge/review routes.
- `skills/econ-paragraph-review.md` still reviews `startoefeningen`, requires
  early hints there, and expects at least two interleaving tasks before the
  target instead of final accessible review after optional bonus.
- `agents/teacher-learning-quality-review-agent.md` lacks checks for the exact
  seven-section sequence, route realism, target-operation alignment table,
  and the bonus/review distinction.
- `BUILD-PARAGRAPH.md` has target decomposition for official-exam paragraphs
  but does not make the bounded backward-design chain and alignment table the
  default input contract for all Part A exercise builds.
- `docs/workflows/textbook-paragraph-lane.md` defines file ownership but does
  not point agents to the canonical exercise-authoring contract or state the
  Part A/Part B route distinction.
- `references/authored/vraagtypen-en-opgaveontwerp.md` claims question-design
  source-of-truth status while repeating the old exercise order and time split.
- `skills/econ-pdf-builder.md` names obsolete major exercise headings.

## Existing guardrail architecture

- `build-scripts/workflows/check-paragraph-workflow-wording.js` guards the
  two-lane/output-profile contract and Part B route language.
- Issue 218 needs a separate focused source-contract checker because its
  acceptance criteria concern Part A sequence semantics, differentiation,
  backward alignment, time realism, and Book 1 non-retroactivity.
- Checker obligations will be role-specific: authored didactic rationale,
  one full operational contract in `econ-exercise-builder`, question/answer
  form authority in `vraagtypen-en-opgaveontwerp`, and concise inheritance in
  all other surfaces.
- `package.json` and `.github/workflows/platform-ci.yml` already expose the
  normal npm/CI wiring pattern for workflow guardrails.

## Data integrity notes

No protected reference data changed during baseline capture.
`references/machine/`, `references/external/`, `source-data/`, target-exercise
registries, candidate storage, PV outputs, `4veco-lessen`, Book 1 output, and
Book 2 lesson output remain unchanged. The authored didactic references are
allowed platform guidance surfaces for this sprint; they are not protected
machine/external data.

## Stop Condition Review

The branch is dedicated, clean before plan creation, current with
`origin/main`, and protected/lesson surfaces are unchanged. Planning may
proceed to independent recheck after resolving the first REVISE findings.
Contract implementation remains held until the plan validator, planned
sprint-bundle checker, and planning recheck pass.
