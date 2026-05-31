# Sprint GRAPH-UX-2: Graph Game + Checkpoint UI Integration

Date: 2026-05-31

Status: planned from active roadmap row after SKILLMAP-OP-1.

## Goal

Upgrade the Book 1 `1.1.3` graph/table practice route so it uses the
GAME-UX-3A shared task shell for graph/table operations, while preserving the
student-visible skill-map route created by SKILLMAP-OP-1.

The sprint must produce one working generated route for `1.1.3` where the
student sees a coherent graph/table practice path, uses shared task-shell
controls for graph reading, table-value selection, axis convention,
interpolation, point placement or graph-construction substitute, and receives
neutral retry/self-check feedback. It must also prove that checkpoint-style
graph tasks can use the same task-shell UI language, without creating a new
target-equivalent checkpoint or claiming paragraph completion.

This sprint must not write target-exercise `question_type` or `answer_form`
fields, create or write answer-skill candidate storage, mutate protected
references, authorize target-equivalent completion language, diagnostics,
adaptive routing, mastery, sequencing, student-facing AI, summative use, PV
projection, PV machine promotion, Scale Gate 1, or student/product use.

## Context

GAME-UX-3A added the shared task-shell runtime, but ENGINE-OP-1 proved that
generated Book 1 output did not yet use it. SKILLMAP-OP-1 then made the
student-visible route panels live and scoped, with a carried flag that mobile
graph students need route/task orientation to feel like one coherent
interaction.

The existing `1.1.3` graph game is the strongest current operational route:
it already shows graph/table practice, a visible route panel, numeric input,
unit context, and neutral source/value/calculation feedback. The weakness is
that the game still owns its own interaction model. GRAPH-UX-2 should connect
that route to the shared task-shell controls and make the graph/checkpoint
handoff concrete enough for later L1.7B-Q2 work, while keeping `Check` hidden
until target-equivalent review exists.

## Quality Standard

The quality floor is rendered output in which a student can understand and use
the graph/table route through the shared task shell, not merely source code
that can represent graph tasks. The sprint must fulfil the product
specification for shared graph/table task UI inside its bounded scope. Proof
must include generated `1.1.3` student-facing output, desktop/mobile and
light/dark screenshots, task-shell markers in the live graph page, useful local
feedback states, no visible internal MTU or operation codes, and no prohibited
product claims. The implementation must show checkpoint-style graph tasks using
the same task-shell data and UI semantics, but must route target-equivalent
checkpoint publication to the named follow-up sprint `L1.7B-Q2` and review
gate `GATE-L1.7B-Q2`.

The review gate that will judge broad engine quality remains `GATE-ENGINE-1`.
This sprint may close as graph/table operational integration only; it may not
claim product scale, target-equivalent proof, or paragraph completion.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Graph/table practice uses the shared task-type shell where interaction overlaps | Graphical shell loads `task-shell.css`, `task-shell-engine.js`, and `task-shell-ui.js`; graph UI renders task-shell tasks and feedback for graph/table operations | Generated-output checker and screenshots prove `data-task-shell`, `data-task-family`, and neutral feedback appear in `1.1.3` graph route | planned |
| Required graph/table task families are represented | Add graph game task mappings for table-value selection, graph reading, axis convention, interpolation, point placement or graph-construction substitute, plus less-labelled graph variants | Focused Jest and generated-output checker prove each family appears and validates without internal-code leakage | planned |
| Graph route remains student-visible and coherent | Keep the SKILLMAP-OP-1 route panel visible and add compact route/task orientation above or inside the first graph interaction on mobile | Screenshot proof and student-experience review check that route cue and task controls are understandable together | planned |
| Checkpoint-style graph tasks use coherent UI language | Add checkpoint-compatible graph task-shell support and a non-published graph checkpoint fixture/proof record; do not create a new `1.1.3` exit-ticket page | Exit-ticket tests and GRAPH-UX-2 checkpoint fixture prove graph tasks render through `TaskShellUI` while target-equivalent evidence remains false/not published | planned |
| Product boundaries remain intact | Student text and metadata avoid target-equivalent completion, diagnostic, adaptive, mastery, sequencing, summative, AI, PV, Scale Gate, and product-use claims | Scope-language check, generated-output checker, student-experience review, accessibility review, and lead review confirm boundaries | planned |
| Generated output changes are reproducible | Book 1 generated automated output changes only through platform deploy/build commands after platform source changes | Diff summary, deploy log, and git diff review prove no hand-patched generated lesson output | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Use `TaskShellEngine` as the graph game's validation and feedback path | `include_now` | It is the central requirement: shared task shell must be operational in generated graph output. |
| Add checkpoint-compatible graph task-shell rendering without publishing a new Check page | `include_now` | It proves UI-language coherence for later checkpoint work while preserving L1.7B-Q2 authority. |
| Add dark-mode and mobile graph screenshots | `include_now` | SKILLMAP-OP-1 carried route accessibility flags that GRAPH-UX-2 can address without scope drift. |
| Add a deterministic GRAPH-UX-2 generated-output checker | `include_now` | Student-visible task-shell use needs a repeatable validation surface beyond screenshots. |
| Publish a target-equivalent `1.1.3` exit ticket | `defer_named_follow_up` | L1.7B-Q2 and GATE-L1.7B-Q2 own target-equivalent checkpoint implementation and completion language. |
| Build the math/calculation shared task-shell route | `defer_named_follow_up` | MATH-UX-2 owns calculation/index integration after graph/table work. |
| Mint graph/draw answer-form MTUs or write target-exercise fields | `reject_scope_creep` | MTU-H4/H4A/H4B/H4C kept graph answer-form units held and target-exercise mapping writes out of scope. |

## Allowed paths

- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `engines/graphical.css`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/task-shell-ui.js` and `engines/task-shell-engine.js` only if shared behavior needs narrowly scoped extension
- `build-scripts/platform/build-graphical-shells.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- focused tests under `engines/tests/`
- GRAPH-UX-2 validators/capture scripts under `build-scripts/sprints/`
- generated automated Book 1 output produced by platform deploy/build commands only
- `reports/sprints/GRAPH-UX-2-*`
- `references/data/sprints/GRAPH-UX-2.plan.json`
- `references/data/sprints/GRAPH-UX-2.result.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.json`
- `docs/roadmaps/roadmap-version-index.md`
- roadmap snapshots under `docs/roadmaps/outdated/`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/GRAPH-UX-2/*`
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
- graph/draw/shade, Type 4, or analysis/evaluation answer-form MTU minting
- target-equivalent `1.1.3` checkpoint publication
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
- `reports/sprints/SKILLMAP-OP-1-accessibility-review.md`
- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `build-scripts/platform/build-graphical-shells.js`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/deploy-config.json`

## Outputs

- `reports/sprints/GRAPH-UX-2-plan.md`
- `reports/sprints/GRAPH-UX-2-baseline.md`
- `reports/sprints/GRAPH-UX-2-planning-review.md`
- implementation changes to graph/task-shell/checkpoint-compatible runtime surfaces
- focused tests for graphical task-shell integration and checkpoint graph task rendering
- `build-scripts/sprints/check-graph-ux2-route-output.js`
- `build-scripts/sprints/capture-graph-ux2-screenshots.js`
- regenerated controlled Book 1 automated output for `1.1.3`
- `reports/sprints/GRAPH-UX-2-checkpoint-graph-task-fixture.md`
- `reports/sprints/GRAPH-UX-2-student-route-proof.md`
- `reports/sprints/GRAPH-UX-2-screenshot-manifest.md`
- screenshot files under `reports/sprints/GRAPH-UX-2-screenshots/`
- `reports/sprints/GRAPH-UX-2-student-experience-review.md`
- `reports/sprints/GRAPH-UX-2-accessibility-review.md`
- `reports/sprints/GRAPH-UX-2-lead-review-assignment.md`
- `reports/sprints/GRAPH-UX-2-lead-review-round1.md`
- `reports/sprints/GRAPH-UX-2-lead-review-corrections.md`
- `reports/sprints/GRAPH-UX-2-lead-review-round2.md`
- `reports/sprints/GRAPH-UX-2-result.md`
- `reports/sprints/GRAPH-UX-2-diff-summary.md`
- `references/data/sprints/GRAPH-UX-2.plan.json`
- `references/data/sprints/GRAPH-UX-2.result.json`
- lesson-side archive records under
  `../4veco-lessen/archive/sprints/GRAPH-UX-2/`
- updated platform and lesson roadmaps that mark GRAPH-UX-2 complete and set
  `MATH-UX-2` as the next operational action, unless validation proves a graph
  route blocker or rebuild decision is needed

## Operationalized sprint procedure

1. Record baseline evidence: roadmap authority, GAME-UX-3A task-shell
   foundation, ENGINE-OP-1 graph findings, SKILLMAP-OP-1 route proof and
   carried flags, current graph game task/data shape, exit-ticket task support,
   generated output inventory, protected reference boundary, and generated
   lesson-output route. Stop if the work requires protected reference mutation,
   target-exercise field writes, or generated-output hand patches.
2. Ask the planning/review subagent to check the sprint outline, required
   outputs, generated-output statement, acceptance tests, and stop conditions.
   Fix the plan before implementation if the review finds a core gap.
3. Integrate the shared task shell into the graph game: load task-shell
   runtime files in generated graph shells, map graph/table challenge data to
   task-shell task families, bind responses through `TaskShellEngine`, and keep
   feedback neutral and local.
4. Extend the `1.1.3` graph data to cover table-value selection, graph reading,
   axis convention, interpolation, point placement or graph-construction
   substitute, and less-labelled variants. Stop if a task would require a live
   graph/draw answer-form MTU or target-equivalent checkpoint claim.
5. Add checkpoint-compatible graph task-shell support and a non-published
   checkpoint fixture/proof record. Do not create or write
   `source-data/book-*/exit-ticket/1.1.3.json`, do not show `Check` on the
   `1.1.3` landing page, and keep target-equivalent evidence false/not
   published.
6. Add focused tests and a generated-output checker that fail if the `1.1.3`
   graph page lacks task-shell markers, required graph/table task families,
   route/task orientation, neutral feedback hooks, or safe product-boundary
   language.
7. Regenerate Book 1 automated output through platform deploy/build commands.
   Do not edit generated lesson output by hand.
8. Inspect rendered output on desktop and mobile in light and dark mode. Capture
   screenshots and write route proof, checkpoint fixture, student-experience,
   and accessibility reports.
9. Run the structural lead-review cycle: assignment, round-1 review, correction
   log, and round-2 recheck. Stop if lead review returns REVISE, FAIL, or PAUSE
   on a core requirement.
10. Update result records, roadmap rows, lesson archive, and generated indexes.
    If the graph output still uses engine-specific controls or the checkpoint
    proof is only bookkeeping, stop and route a correction before closure.
11. Refresh maps/indexes, run validators, and stop if sprint-bundle,
    generated-output, screenshot, scope-language, protected-surface,
    product-claim, lead-review, or diff checks fail.
12. Fetch, reconcile, commit, and push both repositories. If either repository
    is behind or diverged, stop and report the required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GRAPH-UX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js GRAPH-UX-2
npx.cmd jest --runInBand --runTestsByPath engines/tests/graphical-engine.test.js engines/tests/graphical-ui.test.js engines/tests/graphical-data.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js
cmd /c "set MODULE_ROOT=..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod&& npx.cmd jest --runInBand --runTestsByPath engines/tests/graphical-data.test.js"
npm.cmd run check:platform
node build-scripts/content/book-1/b1-113-graphical-data.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/capture-graph-ux2-screenshots.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-sprint-bundle.js GRAPH-UX-2 --complete
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "GRAPH-UX-2|task-shell|table-value selection|graph reading|axis convention|interpolation|point placement|graph-construction substitute|MATH-UX-2" reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
Get-ChildItem reports/sprints/GRAPH-UX-2-screenshots -File | Measure-Object
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json source-data/book-1/exit-ticket
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include the sprint checker and complete bundle
validator, focused Jest tests, platform check, deploy log, generated-output
route checker, screenshot manifest with existing desktop/mobile and light/dark
screenshots, student-route proof report, checkpoint graph task fixture/proof,
student-experience review, accessibility review, lead-review assignment,
round-1 review, correction log, round-2 recheck, roadmap version validation,
scope-language validation, report JSON validation, protected-surface diff
checks, generated-output diff review proving platform generation rather than
hand patches, refreshed repository maps/indexes, and a clear next action:
proceed to MATH-UX-2, route GAME-ARCH-1, or pause with named blockers.

## Rollback plan

If GRAPH-UX-2 must be reverted, revert the graph/task-shell/checkpoint runtime
changes, `1.1.3` graph data changes, graph shell loading changes, focused
tests, generated-output checker/capture scripts, generated Book 1 automated
output from the matching deploy, screenshots, sprint records, roadmap/archive
records, and generated navigation indexes. Do not hand-edit generated output,
`references/machine/`, `references/external/`, target-exercise mappings,
source exit-ticket data, or answer-skill candidate storage as part of rollback.

## Human review required

No interactive human review gate is required for this implementation sprint
because the active roadmaps authorize GRAPH-UX-2 directly after SKILLMAP-OP-1.
The sprint does not authorize engine scaling, Scale Gate 1, student/product
use, diagnostics, adaptive routing, mastery, sequencing, summative use, PV
projection, PV machine promotion, target-equivalent checkpoint publication, or
target-equivalent completion language. Later reliance still requires
`GATE-ENGINE-1` for live engine integration quality and `GATE-L1.7B-Q2` for
target-equivalent exit-ticket completion copy.
