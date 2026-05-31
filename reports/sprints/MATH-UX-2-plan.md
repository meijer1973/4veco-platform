# Sprint MATH-UX-2: Math Game + Checkpoint UI Integration

Date: 2026-05-31

Status: planned from active roadmap row after GRAPH-UX-2.

## Goal

Upgrade the Book 1 `1.1.2 Percentages en indexcijfers` math/calculation route
so the scoped `wiskundevaardigheden.html` skill-tree math game uses the
GAME-UX-3A shared task shell where calculation interactions overlap.

The sprint must produce one working generated `1.1.2` route where the student
sees the shared calculation route, practises percentage/index calculations
through shared task-shell controls, captures work or final answers where
needed, receives neutral retry/self-check feedback, and understands the next
local practice action. The sprint must also prove that checkpoint-style
calculation tasks can use the same task-shell UI language without publishing a
target-equivalent `1.1.2` exit ticket or claiming paragraph completion.

This sprint must not write target-exercise `question_type` or `answer_form`
fields, create or write answer-skill candidate storage, mutate protected
references, authorize target-equivalent completion language, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Context

L1.7C-MATH restored scoped `wiskundevaardigheden.html` as the primary
`Rekenen` route for `1.1.2` and `1.1.3`; `stappenplan.html` remains support.
SKILLMAP-OP-1 made the calculation route panel visible. GRAPH-UX-2 then proved
that the shared task shell can be integrated into live generated graph/table
output and checkpoint-compatible fixtures.

The current `1.1.2` math route is still the old skill-tree exercise model. It
uses custom numeric input and MC/order widgets for `A38 Procentuele
verandering berekenen` and `A39 Prijsindex (CPI) berekenen`. That restores a
route, but it does not yet meet the product specification that calculation
tasks reuse the shared task-type shell for numeric input, work capture, final
answer entry, percentage/index notation, and neutral feedback states.

## Quality Standard

The quality floor is rendered output in which a student can use the
calculation route through the shared task shell, not merely source code that
can represent calculation tasks. The sprint must fulfil the product
specification for shared math/calculation task UI inside its bounded scope.
Proof must include generated `1.1.2` student-facing output, desktop/mobile and
light/dark screenshots, task-shell markers in the live math page, useful local
feedback states, no visible internal MTU or operation codes, and no prohibited
product claims.

The review gate that will judge broad engine coherence remains
`GATE-ENGINE-1`. This sprint may close as math/calculation operational
integration only; it may not claim product scale, target-equivalent proof, or
paragraph completion. Named follow-up work remains `REASON-UX-2`,
`GAME-ARCH-1`, `GATE-ENGINE-1`, `L1.7B-Q2`, and `GATE-L1.7B-Q2`.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Calculation practice uses the shared task shell where interaction overlaps | Skill-tree shell loads `task-shell.css`, `task-shell-engine.js`, and `task-shell-ui.js`; skill-tree exercises render task-shell controls for reviewed calculation steps | Generated-output checker and screenshots prove `data-task-family` markers and neutral feedback appear in the `1.1.2` math route | planned |
| Required calculation task families are represented | Add or map `A38`/`A39` exercise steps to numeric input, calculation/work capture, final-answer entry, unit/notation field, and percentage/index notation tasks | Focused Jest and generated-output checker prove each required family validates and appears without internal-code leakage | planned |
| Math route remains student-visible and coherent | Keep the SKILLMAP-OP-1 route panel visible and add compact route/task orientation inside the math exercise flow | Screenshot proof and student-experience review check that route cue, calculation work, and next action read as one route | planned |
| Checkpoint-style calculation tasks use coherent UI language | Add a non-published calculation checkpoint fixture/proof record using `ExitTicketEngine`/`ExitTicketUI` task-shell support; keep `targetReadinessEvidence: false` | Exit-ticket/task-shell tests and MATH-UX-2 fixture prove calculation tasks render through `TaskShellUI` without publishing a `1.1.2` Check route | planned |
| Product boundaries remain intact | Student text and metadata avoid target-equivalent completion, diagnostic, adaptive, mastery, sequencing, summative, AI, PV, Scale Gate, and product-use claims | Scope-language check, generated-output checker, student-experience review, accessibility review, and lead review confirm boundaries | planned |
| Generated output changes are reproducible | Book 1 generated automated output changes only through platform deploy/build commands after platform source changes | Diff summary, deploy log, and git diff review prove no hand-patched generated lesson output | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Render reviewed skill-tree calculation steps through `TaskShellUI` | `include_now` | This is the central requirement: shared task shell must be operational in generated math output. |
| Add task-shell metadata for `A38` and `A39` generator steps | `include_now` | These are the scoped `1.1.2` calculation skills and can prove numeric, work-capture, final-answer, and notation behavior without new references. |
| Add checkpoint-compatible calculation task-shell proof without publishing a new Check page | `include_now` | It proves UI-language coherence for later L1.7B-Q2 work while preserving authority boundaries. |
| Add dark-mode and mobile math screenshots | `include_now` | The graph sprint carried a density flag; math should compare route/task density early. |
| Add a deterministic MATH-UX-2 generated-output checker | `include_now` | Student-visible task-shell use needs repeatable validation beyond screenshots. |
| Publish a target-equivalent `1.1.2` exit ticket | `defer_named_follow_up` | L1.7B-Q2 and GATE-L1.7B-Q2 own target-equivalent checkpoint implementation and completion language. |
| Replace the old skill-tree math game with a new calculation engine | `defer_named_follow_up` | GAME-ARCH-1 owns build-vs-rebuild decisions after operational proof, not this sprint. |
| Mint new math or answer-form MTUs or write target-exercise fields | `reject_scope_creep` | MTU/reference mutation and target-exercise mapping are separate gated lanes. |

## Allowed paths

- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `engines/skilltree.css`
- `engines/skilltree/generators.js`
- `engines/task-shell-ui.js`, `engines/task-shell-engine.js`, and
  `engines/task-shell.css` only if shared behavior or shared task-shell
  styling needs narrowly scoped extension; otherwise keep math-specific visual
  integration in `engines/skilltree.css`
- `engines/exit-ticket-engine.js` and `engines/exit-ticket-ui.js` only if checkpoint-compatible task-shell support needs a narrow bug fix
- `build-scripts/platform/build-skilltree-shells.js`
- focused tests under `engines/tests/`
- MATH-UX-2 validators/capture scripts under `build-scripts/sprints/`
- generated automated Book 1 output produced by platform deploy/build commands only
- `reports/sprints/MATH-UX-2-*`
- `references/data/sprints/MATH-UX-2.plan.json`
- `references/data/sprints/MATH-UX-2.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/MATH-UX-2/*`
- generated repository maps, URL indexes, and internal dashboard data required
  for remote reviewer navigation

## Forbidden paths

- hand edits to generated Book 1 HTML, CSS, JS, or data files; generated output
  may only change through platform deploy/build commands
- hand edits to `references/machine/`
- hand edits to `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `source-data/book-*/exit-ticket/*.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- target-equivalent `1.1.2` checkpoint publication
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/GAME-UX-3A-plan.md`
- `reports/sprints/GAME-UX-3A-task-family-fixtures.md`
- `reports/sprints/ENGINE-OP-1-operational-audit.md`
- `reports/sprints/ENGINE-OP-1-student-path-trace.md`
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/SKILLMAP-OP-1-student-experience-review.md`
- `reports/sprints/GRAPH-UX-2-result.md`
- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `engines/skilltree.css`
- `engines/skilltree/generators.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `build-scripts/platform/build-skilltree-shells.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`

## Outputs

- `reports/sprints/MATH-UX-2-plan.md`
- `reports/sprints/MATH-UX-2-baseline.md`
- `reports/sprints/MATH-UX-2-planning-review.md`
- implementation changes to skill-tree/task-shell/checkpoint-compatible runtime surfaces
- focused tests for skill-tree math task-shell integration and checkpoint calculation task rendering
- `build-scripts/sprints/check-math-ux2-route-output.js`
- `build-scripts/sprints/capture-math-ux2-screenshots.js`
- regenerated controlled Book 1 automated output produced through platform
  deploy/build commands, expected primary files:
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers – wiskundevaardigheden.html`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree/1.1.2.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree-engine.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree-ui.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/skilltree.css`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-engine.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-ui.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell.css`
- acceptable generated byproducts if `build-skilltree-shells.js` updates all
  skill-tree shells from the shared template:
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – wiskundevaardigheden.html`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – wiskundevaardigheden.html`
  Any `1.1.1` or `1.1.3` skill-tree byproduct must be recorded as a generated
  shell-template side effect; their data may not gain target-equivalent Check
  publication or new product claims.
- `reports/sprints/MATH-UX-2-checkpoint-calculation-task-fixture.md`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-screenshot-manifest.md`
- screenshot files under `reports/sprints/MATH-UX-2-screenshots/`
- `reports/sprints/MATH-UX-2-student-experience-review.md`
- `reports/sprints/MATH-UX-2-accessibility-review.md`
- `reports/sprints/MATH-UX-2-lead-review-assignment.md`
- `reports/sprints/MATH-UX-2-lead-review-round1.md`
- `reports/sprints/MATH-UX-2-lead-review-corrections.md`
- `reports/sprints/MATH-UX-2-lead-review-round2.md`
- `reports/sprints/MATH-UX-2-result.md`
- `reports/sprints/MATH-UX-2-diff-summary.md`
- `references/data/sprints/MATH-UX-2.plan.json`
- `references/data/sprints/MATH-UX-2.result.json`
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/MATH-UX-2/`
- updated platform and lesson roadmaps that mark MATH-UX-2 complete and set
  `REASON-UX-2` as the next operational action, unless validation proves a
  math-route blocker or rebuild decision is needed

## Operationalized sprint procedure

1. Record baseline evidence: roadmap authority, GAME-UX-3A task-shell
   foundation, ENGINE-OP-1 math findings, SKILLMAP-OP-1 route proof,
   GRAPH-UX-2 carried density flag, current `1.1.2` skill-tree exercise shape,
   checkpoint task-shell support, generated output inventory, protected
   reference boundary, and generated lesson-output route. Stop if the work
   requires protected reference mutation, target-exercise field writes, or
   generated-output hand patches.
2. Ask the planning/review subagent to check the sprint outline, required
   outputs, generated-output statement, acceptance tests, and stop conditions.
   Fix the plan before implementation if the review finds a core gap.
3. Integrate the shared task shell into the skill-tree math game: load
   task-shell runtime files in generated skill-tree shells, map reviewed
   `A38`/`A39` exercise steps to task-shell task families, bind responses
   through `TaskShellEngine`, and keep feedback neutral and local.
4. Ensure `1.1.2` covers numeric input, calculation/work capture, final-answer
   entry, percentage/index notation, units where relevant, and feedback on
   common calculation errors. Stop if a task would require target-equivalent
   checkpoint authority or new reference mutation.
5. Add checkpoint-compatible calculation task-shell proof as a non-published
   fixture. Do not create or write `source-data/book-*/exit-ticket/1.1.2.json`,
   do not show `Check` on the `1.1.2` landing page, and keep
   `targetReadinessEvidence` false/not published.
6. Add focused tests and a generated-output checker that fail if the `1.1.2`
   math page lacks task-shell markers, required calculation task families,
   route/task orientation, neutral feedback hooks, or safe product-boundary
   language. The checker must also fail if `1.1.2` publishes a `Check` route,
   creates/writes `source-data/book-*/exit-ticket/1.1.2.json`, leaks `A38`,
   `A39`, `MTU`, or other internal codes in visible math task text, or lacks
   `data-task-family` markers in the math exercise route.
7. Regenerate Book 1 automated output through platform deploy/build commands.
   Do not edit generated lesson output by hand.
8. Inspect rendered output on desktop and mobile in light and dark mode.
   Capture screenshots and write route proof, checkpoint fixture,
   student-experience, and accessibility reports. The screenshot manifest must
   name the required desktop-light, desktop-dark, mobile-light, and
   mobile-dark evidence files rather than relying on file count alone.
9. Run the structural lead-review cycle: assignment, round-1 review,
   correction log, and round-2 recheck. Stop if lead review returns REVISE,
   FAIL, or PAUSE on a core requirement.
10. Update result records, roadmap rows, lesson archive, and generated indexes.
    If the math output still uses only engine-specific controls or the
    checkpoint proof is only bookkeeping, stop and route a correction before
    closure.
11. Refresh maps/indexes, run validators, and stop if sprint-bundle,
    generated-output, screenshot, scope-language, protected-surface,
    product-claim, lead-review, or diff checks fail.
12. Fetch, reconcile, commit, and push both repositories. If either repository
    is behind or diverged, stop and report the required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MATH-UX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js MATH-UX-2
npx.cmd jest --runInBand --runTestsByPath engines/tests/skilltree-engine.test.js engines/tests/skilltree-ui.test.js engines/tests/skilltree-data.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js
cmd /c "set MODULE_ROOT=..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod&& npx.cmd jest --runInBand --runTestsByPath engines/tests/skilltree-data.test.js"
npm.cmd run check:platform
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/capture-math-ux2-screenshots.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-sprint-bundle.js MATH-UX-2 --complete
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "MATH-UX-2|task-shell|numeric input|calculation/work capture|final-answer|unit/notation|percentage/index|REASON-UX-2" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
Get-ChildItem reports/sprints/MATH-UX-2-screenshots -File | Measure-Object
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include the sprint checker and complete bundle
validator, focused Jest tests, platform check, deploy log, generated-output
route checker, screenshot manifest with desktop/mobile and light/dark
screenshots, student-route proof report, checkpoint calculation task
fixture/proof, student-experience review, accessibility review, lead-review
assignment, round-1 review, correction log, round-2 recheck, roadmap version
validation, scope-language validation, report JSON validation,
protected-surface diff checks, generated-output diff review proving platform
generation rather than hand patches, refreshed repository maps/indexes, and a
clear next action: proceed to `REASON-UX-2` or pause for `GAME-ARCH-1` if the
math route cannot be made coherent through bounded refactor.

## Rollback plan

If MATH-UX-2 must be reverted, revert the skill-tree/task-shell/checkpoint
runtime changes, `A38`/`A39` generator task-shell metadata changes, skill-tree
shell loading changes, focused tests, generated-output checker/capture scripts,
generated Book 1 automated output from the matching deploy, screenshots,
sprint records, roadmap/archive records, and generated navigation indexes. Do
not hand-edit generated output, `references/machine/`, `references/external/`,
target-exercise mappings, source exit-ticket data, or answer-skill candidate
storage as part of rollback.

## Human review required

No interactive human review gate is required for this implementation sprint
because the active roadmaps authorize MATH-UX-2 directly after GRAPH-UX-2. The
sprint does not authorize engine scaling, Scale Gate 1, student/product use,
diagnostics, adaptive routing, mastery, sequencing, summative use, PV
projection, PV machine promotion, target-equivalent checkpoint publication, or
target-equivalent completion language. Later reliance still requires
`GATE-ENGINE-1` for live engine integration quality and `GATE-L1.7B-Q2` for
target-equivalent exit-ticket completion copy.
