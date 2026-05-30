# Sprint GAME-UX-3A: Shared Task-Type UX Foundation

Date: 2026-05-30

Status: planned from active roadmap row after EX-LESSON-1.

## Goal

Implement the shared task-type shell foundation required by the product and
companion specifications. The shell must provide common validation, rendering
vocabulary, neutral feedback, retry/self-check states, and product-boundary
flags for task families that appear across target-equivalent exit tickets,
checkpoint-only local checks, graph/table practice, math/calculation practice,
and exam-style answer-form requirements.

This sprint must not generate lesson output, activate new `Check` surfaces,
write target-exercise fields, mutate protected references, create candidate
storage, write candidate records, expose generator-blocked answer-form units,
or authorize diagnostics, adaptive routing, mastery, sequencing, summative use,
student-facing AI, PV projection, PV machine promotion, Scale Gate 1, or
student/product use.

## Context

EX-LESSON-1 converted official-exam route traces into build and review
requirements. MTU-H4C added answer-form units, but those units remain
generator-blocked/non-interactive. L1.7B-P23 showed that choice-only checkpoint
support cannot cover `1.1.2` calculation/index tasks or `1.1.3` graph/table
tasks. The current `exit-ticket` runtime supports only choice tasks, while the
graphical and skill-tree engines each carry their own local input and feedback
logic.

GAME-UX-3A is therefore a platform runtime foundation sprint. It creates the
shared task shell that later graph/math/checkpoint implementation sprints can
consume. It does not yet produce target-equivalent exit-ticket output or
student-facing scale evidence.

## Quality Standard

The quality floor is a reusable, source-controlled task shell that can represent
the required student actions without weakening the product specification. It
must prove, through focused fixtures and tests, that calculation, graph/table,
unit/notation, point placement, and short-response tasks do not have to be
collapsed into choice-only form. Rendered output for real paragraphs is out of
scope, but the runtime and static render output must be concrete enough for
future student-facing QA. Proof must include task-family validation, neutral
feedback/retry/self-check behavior, keyboard/focus-ready markup, no internal
code or restricted product claims in student-visible text, deploy-copy hooks,
roadmap updates, sprint records, and named follow-up work for ENGINE-OP-1,
GRAPH-UX-2, MATH-UX-2, L1.7B-Q2, and GATE-L1.7B-Q2.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Shared task shell supports required task families | Add reusable engine/UI/CSS files for numeric input, calculation/work capture, final answer, unit/notation, short constructed response, table-value selection, graph reading, point placement, graph-construction substitute, and structured reasoning | Focused task-shell tests validate and render at least one fixture for every accepted family | planned |
| Feedback is neutral and local | Engine result states include `matched`, `retry`, and `self_check`; boundary flags reject diagnostics/mastery/sequencing/summative claims | Tests assert boundary flags and restricted language blocks | planned |
| Student labels do not expose internal IDs | Shell text collector blocks visible A/B codes and product-boundary terms | Tests inject internal-code and restricted-term fixtures and expect rejection | planned |
| Future engines can consume shell without generated lesson output now | Add deploy-copy hooks and static render API; do not generate lesson output or update lesson source data | Git diff proves no `../4veco-lessen/Boek *` changes and no source-data mutation | planned |
| Roadmaps reflect the handoff | Mark GAME-UX-3A complete only after validation, and make ENGINE-OP-1 the next dependency | Platform and lesson roadmap searches prove current order and boundaries | planned |
| Protected/source boundaries remain intact | Do not edit `references/machine/`, `references/external/`, target-exercise mappings, or candidate storage | Diff checks show protected surfaces unchanged | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add source-controlled task-family fixtures used by tests | `include_now` | It proves the shell can represent each required family before real paragraph output exists. |
| Add deploy-copy hooks for task-shell runtime files | `include_now` | Later generated graph/math/checkpoint shells need the runtime available through the normal deployment path. |
| Convert the existing `1.1.1` checkpoint output to the new shell | `defer_named_follow_up` | That would mutate generated lesson output and belongs to a later controlled output sprint. |
| Build `1.1.2` or `1.1.3` exit tickets | `defer_named_follow_up` | L1.7B-Q2 owns target-equivalent implementation after task-shell support exists. |
| Integrate graph/math engines fully with the shell | `defer_named_follow_up` | GRAPH-UX-2 and MATH-UX-2 own those engine-specific integrations. |
| Write `question_type` or `answer_form` fields | `reject_scope_creep` | Target-exercise field writes require a separate authored-reference mutation packet. |

## Allowed paths

- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-*.test.js`
- existing engine tests touched only to check runtime copy/load behavior
- `scripts/deploy.js`
- `build-scripts/platform/build-exit-ticket-shells.js`
- `reports/sprints/GAME-UX-3A-*`
- `references/data/sprints/GAME-UX-3A.*.json`
- `references/reference-team-roadmap.md`
- `docs/roadmaps/roadmap-version-index.*`
- `docs/roadmaps/outdated/reference-team-roadmap-v3.19-*`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/archive/sprints/GAME-UX-3A/*`
- generated repository maps, URL indexes, internal dashboard data, source
  registries, and document inventories needed for remote reviewer navigation

## Forbidden paths

- hand edits to `references/machine/`
- hand edits to `references/external/`
- `source-data/book-*/exit-ticket/*.json`
- generated lesson output under `../4veco-lessen/Boek *`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- candidate-storage creation or candidate writes
- target-exercise `question_type`, `answer_form`, or mapping writes
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- diagnostics, adaptive routing, mastery, sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, Scale Gate 1, or
  student/product use

## Inputs

- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `reports/sprints/EX-LESSON-1-exam-target-route-checklist.md`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `engines/exit-ticket.css`
- `engines/graphical-engine.js`
- `engines/skilltree-engine.js`
- `build-scripts/platform/build-exit-ticket-shells.js`
- `scripts/deploy.js`

## Outputs

- GAME-UX-3A sprint plan, baseline, planning review, result, diff summary, and
  JSON metadata.
- Shared task-shell runtime files under `engines/`.
- Focused task-shell fixtures/tests proving each accepted task family.
- Deploy/shell loading support so future generated surfaces can consume the
  shell.
- Updated platform and lesson roadmaps with GAME-UX-3A completed and
  ENGINE-OP-1 as the next operational dependency.
- Lesson-side archive records for GAME-UX-3A.
- No generated lesson output, no protected reference mutation, no source-data
  mutation, no target-exercise field writes, no candidate storage, no
  projection refresh, and no product-use authority.

## Operationalized sprint procedure

1. Record baseline: GAME-UX-3A is active, exit-ticket currently supports only
   choice tasks, graph/math engines have separate task handling, and generated
   lesson output/source-data/protected references are out of scope. Stop if the
   sprint requires generated output or target-exercise/source-data mutation.
2. Implement the shared task-shell engine with task-family vocabulary,
   validation, answer checking where deterministic, self-check handling where
   automatic checking would be inappropriate, boundary flags, and student-text
   claim/code checks.
3. Implement the static task-shell UI/CSS with keyboard/focus-ready controls,
   stable class names, neutral feedback containers, and render coverage for all
   accepted families.
4. Add deploy-copy and shell-load hooks without running deploy or changing
   generated lesson files.
5. Add focused tests and fixtures for every accepted family, including negative
   tests for internal codes, restricted product claims, and boundary flags.
6. Update sprint result records and roadmaps; keep the next action as
   ENGINE-OP-1 unless validation shows a route-blocking implementation gap.
7. Refresh maps/indexes, run acceptance tests, and stop if sprint-bundle,
   focused Jest, scope-language, roadmap, protected-surface, or diff checks
   fail.
8. Fetch, reconcile, commit, and push both repositories. If either repo is
   behind or diverged, stop and report the required reconciliation.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/GAME-UX-3A-plan.md
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-3A
npx.cmd jest --runInBand --runTestsByPath engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-ui.test.js
node build-scripts/sprints/check-sprint-bundle.js GAME-UX-3A --complete
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run check:scope-language
node build-scripts/sprints/emit-url-index.js --check
node build-scripts/reports/validate-report-json.js
rg -n "numeric input|calculation/work capture|final-answer entry|unit/notation|short constructed response|table-value selection|graph reading|point placement|graph-construction substitute|structured reasoning" engines reports/sprints references/reference-team-roadmap.md ../4veco-lessen/lessen-team-roadmap.md
git diff --name-only -- references/machine references/external references/authored/course-target-exercises.json references/data/exam-ingestion/answer-skill-candidates.json
git -C ../4veco-lessen diff --name-only -- "Boek*"
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close must include sprint checker and bundle validation,
focused task-shell and exit-ticket shell tests, roadmap-version validation,
scope-language validation, active wording searches for all required task
families, protected-surface and generated-output diff checks, refreshed
repository maps/indexes, and a clear next action: proceed to ENGINE-OP-1 or
pause if task-shell behavior cannot be inspected without generated output.

## Rollback plan

GAME-UX-3A must not mutate protected references, generated lesson output,
source-data, candidate storage, target-exercise records, or projections. If the
sprint is rejected, roll back only the task-shell runtime files, deploy/shell
load hooks, focused tests, sprint records, roadmap/archive/version-index
records, and generated maps/inventories/indexes. Future generated paragraph
output and graph/math/checkpoint integration belong to later governed sprints.

## Human review required

No interactive human review gate is required for this platform runtime
foundation sprint because the active roadmaps already authorize GAME-UX-3A
after EX-LESSON-1. Later student-facing reliance still requires the named
reviews: ENGINE-OP-1 for operational proof, GATE-ENGINE-1 before engine scale,
GATE-L1.7B-Q2 before target-equivalent completion copy, and Scale Gate 1
before controlled production reliance.
