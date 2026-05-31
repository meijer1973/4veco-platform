# Sprint REASON-UX-2: Reasoning Game Variant And Feedback Upgrade

Date: 2026-05-31

Status: planned from active roadmap row after MATH-UX-2.

## Goal

Upgrade the Book 1 reasoning practice route so `redeneer-spel.html` becomes a
real reasoning practice engine rather than only a set of ordering widgets.

The sprint must produce generated Book 1 reasoning output where students can
see the shared reasoning route, practise causal/procedural reasoning through a
richer mix of modes, write a short structured reasoning response through the
GAME-UX-3A shared task shell, receive neutral feedback that explains the
reasoning error or self-check criteria, and understand the next local practice
action.

This sprint must not write target-exercise `question_type` or `answer_form`
fields, create or write answer-skill candidate storage, mutate protected
references, publish a target-equivalent exit ticket, authorize
target-equivalent completion language, diagnostics, adaptive routing, mastery,
sequencing, student-facing AI, summative use, PV projection, PV machine
promotion, Scale Gate 1, or student/product use.

## Context

GAME-UX-3A added the shared task shell, ENGINE-OP-1 proved generated output did
not yet use it, SKILLMAP-OP-1 made the reasoning route visible, GRAPH-UX-2
integrated the task shell into graph/table practice, and MATH-UX-2 integrated
the task shell into calculation/index practice. REASON-UX-2 is now the last
practice-engine operationalization sprint before GAME-ARCH-1 and
GATE-ENGINE-1.

The current reasoning game has five modes: ordering steps, selecting
sub-questions, finding an error, building a flow diagram, and matching
structures. Those modes are useful, but the implementation still uses only
engine-specific controls and feedback is often limited to revealing the
correct order. The shared task shell already supports `structured_reasoning`,
so this sprint should use that existing family to add a short explanation
self-check mode and improve feedback in existing modes.

## Quality Standard

The quality floor is rendered output in which a student can practise reasoning
through the shared route and task shell, not merely source code that can
represent a structured reasoning task. The sprint must fulfil the product
specification for shared reasoning task UI inside its bounded scope. Proof must
include generated student-facing reasoning output, desktop/mobile and
light/dark screenshots, task-shell markers in the live reasoning page, richer
feedback states for wrong reasoning, no visible internal MTU or operation
codes, and no prohibited product claims.

The review gate that will judge broad engine coherence remains
`GATE-ENGINE-1`. This sprint may close as reasoning operational integration
only; it may not claim product scale, target-equivalent proof, paragraph
completion, diagnostics, adaptive routing, mastery, sequencing, summative use,
PV, or student/product use. Named follow-up work remains `GAME-ARCH-1`,
`GATE-ENGINE-1`, `L1.7B-Q2`, and `GATE-L1.7B-Q2`.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reasoning practice uses the shared task shell where interaction overlaps | Reasoning shell loads `task-shell.css`, `task-shell-engine.js`, and `task-shell-ui.js`; reasoning UI renders a `structured_reasoning` task-shell mode | Generated-output checker and screenshots prove `data-task-shell`, `data-task-family="structured_reasoning"`, and neutral self-check feedback appear in the live reasoning route | planned |
| Reasoning modes become richer and less one-shot | Add a short structured reasoning response mode and keep the existing five modes available from a dynamic mode list | Focused Jest and generated-output checker prove six modes can start and the new mode validates through `TaskShellEngine` | planned |
| Feedback explains reasoning errors | Existing order/sub-question/flow/error/match feedback includes the expected chain, selected chain, and local explanation cue rather than only a bare answer reveal | UI tests, screenshot proof, and student-experience review check that wrong answers receive actionable reasoning feedback | planned |
| Reasoning route remains student-visible and coherent | Keep the SKILLMAP-OP-1 route panel visible and add compact route/task orientation inside the reasoning flow | Screenshot proof and student-experience review check that route cue, reasoning prompt, task response, and next action read as one route | planned |
| Product boundaries remain intact | Student text and metadata avoid target-equivalent completion, diagnostic, adaptive, mastery, sequencing, summative, AI, PV, Scale Gate, and product-use claims | Scope-language check, generated-output checker, student-experience review, accessibility review, and lead review confirm boundaries | planned |
| Generated output changes are reproducible | Book 1 generated automated output changes only through platform deploy/build commands after platform source changes | Diff summary, deploy log, and git diff review prove no hand-patched generated lesson output | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add a `structured_reasoning` task-shell mode to the reasoning game | `include_now` | This is the central shared task-shell requirement for reasoning practice. |
| Make mode rendering dynamic instead of hardcoded to five modes | `include_now` | It prevents the new mode from becoming a one-off menu patch and supports replay value. |
| Improve wrong-answer feedback in existing modes | `include_now` | The roadmap explicitly requires feedback that explains reasoning errors. |
| Add desktop/mobile and light/dark reasoning screenshots | `include_now` | Student-visible route and task-shell proof must be rendered, not inferred. |
| Add a deterministic REASON-UX-2 generated-output checker | `include_now` | Student-visible task-shell use needs repeatable validation beyond screenshots. |
| Publish a target-equivalent reasoning exit ticket | `defer_named_follow_up` | L1.7B-Q2 and GATE-L1.7B-Q2 own target-equivalent checkpoint implementation and completion language. |
| Rebuild all practice engines around one new architecture | `defer_named_follow_up` | GAME-ARCH-1 owns build-vs-rebuild after graph/math/reasoning evidence exists. |
| Mint new answer-form or reasoning MTUs or write target-exercise fields | `reject_scope_creep` | MTU/reference mutation and target-exercise mapping are separate gated lanes. |

## Allowed paths

- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/task-shell-ui.js`, `engines/task-shell-engine.js`, and
  `engines/task-shell.css` only if shared behavior or shared styling needs a
  narrowly scoped fix; any shared task-shell edit must preserve GRAPH-UX-2 and
  MATH-UX-2 route-output checks
- `build-scripts/platform/build-reasoning-engine.js`
- focused tests under `engines/tests/`
- REASON-UX-2 validators/capture scripts under `build-scripts/sprints/`
- generated automated Book 1 output produced by platform deploy/build commands
  only
- `reports/sprints/REASON-UX-2-*`
- `references/data/sprints/REASON-UX-2.plan.json`
- `references/data/sprints/REASON-UX-2.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/REASON-UX-2/*`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories required for remote reviewer navigation

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
- target-equivalent checkpoint publication or paragraph-completion copy
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
- `reports/sprints/GRAPH-UX-2-result.md`
- `reports/sprints/MATH-UX-2-result.md`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `build-scripts/platform/build-reasoning-engine.js`
- `source-data/book-1/reasoning/1.1.1.csv`
- `source-data/book-1/reasoning/1.1.2.csv`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`

## Outputs

- `reports/sprints/REASON-UX-2-plan.md`
- `reports/sprints/REASON-UX-2-baseline.md`
- `reports/sprints/REASON-UX-2-planning-review.md`
- implementation changes to reasoning/task-shell runtime surfaces
- focused tests for reasoning task-shell integration and feedback behavior
- `build-scripts/sprints/check-reason-ux2-route-output.js`
- `build-scripts/sprints/capture-reason-ux2-screenshots.js`
- regenerated controlled Book 1 automated reasoning output produced through
  platform deploy commands, expected primary files:
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/1.1.1 Schaarste en economisch denken – redeneer-spel.html`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/1.1.2 Percentages en indexcijfers – redeneer-spel.html`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen – redeneer-spel.html`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-engine.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-ui.js`
  - `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell.css`
- reasoning data files under
  `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/*.js`
  are expected to remain unchanged; any data-file diff must be caused by a
  named source-data builder command and recorded as a generated side effect
- acceptable full-deploy byproducts from unrelated shared shell builders,
  landing builders, copied shared runtime files, source registries, and
  generated indexes must be recorded in the diff summary as deploy side
  effects; they may not introduce a new Check route, target-equivalent copy, or
  protected reference mutation
- `reports/sprints/REASON-UX-2-reasoning-task-shell-fixture.md`
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-screenshot-manifest.md`
- screenshot files under `reports/sprints/REASON-UX-2-screenshots/`
- `reports/sprints/REASON-UX-2-student-experience-review.md`
- `reports/sprints/REASON-UX-2-accessibility-review.md`
- `reports/sprints/REASON-UX-2-lead-review-assignment.md`
- `reports/sprints/REASON-UX-2-lead-review-round1.md`
- `reports/sprints/REASON-UX-2-lead-review-corrections.md`
- `reports/sprints/REASON-UX-2-lead-review-round2.md`
- `reports/sprints/REASON-UX-2-result.md`
- `reports/sprints/REASON-UX-2-diff-summary.md`
- `references/data/sprints/REASON-UX-2.plan.json`
- `references/data/sprints/REASON-UX-2.result.json`
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/REASON-UX-2/`
- updated platform and lesson roadmaps that mark REASON-UX-2 complete and set
  `GAME-ARCH-1` as the next operational action, unless validation proves a
  reasoning-route blocker or immediate rebuild decision is needed

## Operationalized sprint procedure

1. Record baseline evidence: roadmap authority, GAME-UX-3A task-shell
   foundation, ENGINE-OP-1 reasoning findings, SKILLMAP-OP-1 route proof,
   GRAPH-UX-2 and MATH-UX-2 task-shell carry-in, current reasoning game
   mode/data shape, generated output inventory, protected reference boundary,
   and generated lesson-output route. Stop if the work requires protected
   reference mutation, target-exercise field writes, exit-ticket source writes,
   or generated-output hand patches.
2. Ask the planning/review subagent to check the sprint outline, required
   outputs, generated-output statement, acceptance tests, and stop conditions.
   Fix the plan before implementation if the review finds a core gap.
3. Integrate the shared task shell into generated reasoning shells by loading
   task-shell runtime files and rendering a new `structured_reasoning`
   practice mode in `reasoning-ui.js`.
4. Build the structured reasoning task from existing reviewed reasoning CSV
   fields: problem text, three-step chain, and flow slots. Stop if a task needs
   new protected reference content, target-exercise fields, or answer-skill
   candidate storage.
5. Improve feedback in the existing five modes so wrong answers show the
   expected reasoning chain, what the student selected where available, and the
   local reasoning cue needed to repair the answer.
6. Add focused tests and a generated-output checker that fail if generated
   reasoning output lacks task-shell markers, `structured_reasoning`, dynamic
   six-mode availability, route/task orientation, neutral feedback hooks, or
   safe product-boundary language. The checker must also fail if this sprint
   creates/writes source exit-ticket files, writes target-exercise fields,
   exposes internal codes in visible task text, or lacks `data-task-family`
   markers in the reasoning route.
7. Regenerate Book 1 automated output through platform deploy/build commands.
   Do not edit generated lesson output by hand.
8. Inspect rendered output on desktop and mobile in light and dark mode.
   Capture screenshots and write route proof, structured-reasoning fixture,
   student-experience, and accessibility reports. The screenshot manifest must
   name the required desktop/mobile and light/dark evidence files.
9. Run the structural lead-review cycle: assignment, round-1 review,
   correction log, and round-2 recheck. Stop if lead review returns REVISE,
   FAIL, or PAUSE on a core requirement.
10. Update result records, roadmap rows, lesson archive, and generated
    indexes. If the reasoning output still uses only engine-specific controls
    or feedback remains only answer reveal, stop and route a correction before
    closure.
11. Refresh maps/indexes, run validators, and stop if sprint-bundle,
    generated-output, screenshot, scope-language, protected-surface,
    product-claim, lead-review, or diff checks fail.
12. Fetch, reconcile, commit, and push both repositories. If either repository
    is behind or diverged, stop and report the required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-UX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-UX-2
npx.cmd jest --runInBand --runTestsByPath engines/tests/reasoning-engine.test.js engines/tests/reasoning-data.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
cmd /c "set MODULE_ROOT=..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod&& npx.cmd jest --runInBand --runTestsByPath engines/tests/reasoning-data.test.js"
npm.cmd run check:platform
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/capture-reason-ux2-screenshots.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-sprint-bundle.js REASON-UX-2 --complete
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "REASON-UX-2|structured_reasoning|reasoning task shell|feedback|GAME-ARCH-1" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
Get-ChildItem reports/sprints/REASON-UX-2-screenshots -File | Measure-Object
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include the sprint checker and complete bundle
validator, focused Jest tests, platform check, deploy log, generated-output
route checker, screenshot manifest with desktop/mobile and light/dark
screenshots, student-route proof report, structured-reasoning task-shell
fixture/proof, student-experience review, accessibility review, lead-review
assignment, round-1 review, correction log, round-2 recheck, roadmap version
validation, scope-language validation, report JSON validation,
protected-surface diff checks, generated-output diff review proving platform
generation rather than hand patches, refreshed repository maps/indexes, and a
clear next action: proceed to `GAME-ARCH-1`, route `GATE-ENGINE-1`, or pause
with named reasoning-route blockers.

## Rollback plan

If REASON-UX-2 must be reverted, revert the reasoning/task-shell runtime
changes, reasoning shell loading changes, focused tests, generated-output
checker/capture scripts, generated Book 1 automated output from the matching
deploy, screenshots, sprint records, roadmap/archive records, and generated
navigation indexes. Do not hand-edit generated output, `references/machine/`,
`references/external/`, target-exercise mappings, source exit-ticket data, or
answer-skill candidate storage as part of rollback.

## Human review required

No interactive human review gate is required for this implementation sprint
because the active roadmaps authorize REASON-UX-2 directly after MATH-UX-2.
The sprint does not authorize engine scaling, Scale Gate 1, student/product
use, diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
summative use, PV projection, PV machine promotion, target-equivalent
checkpoint publication, or target-equivalent completion language. Later
reliance still requires `GATE-ENGINE-1` for live engine integration quality and
`GATE-L1.7B-Q2` for target-equivalent exit-ticket completion copy.
