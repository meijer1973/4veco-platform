# Sprint TASK-SHELL-UX-2: Shared Task Shell UX Hardening

Generated: 2026-06-01

## Goal

Harden the shared task-shell interaction layer so math, graph/table,
reasoning, and exit-ticket surfaces share clearer task affordance, separated
number and unit/notation inputs where needed, hidden/collapsible hints where
allowed, controlled feedback regions, next-action clarity, and keyboard/focus
behavior.

This sprint may implement bounded platform runtime/UI changes and regenerate
Book 1 proof output through the deploy pipeline. It must not broaden
target-equivalent authority, product use, diagnostics, adaptive routing,
mastery/sequencing, or Scale Gate 1.

## Context

`STANDARD-EXERCISES-1` closed as PASS WITH FLAGS and sent
`structured_short_response` documentation and UX hardening to this sprint.
The current shared task shell already renders and evaluates core families, but
the implementation still has product-quality gaps:

- `calculation_work_capture` renders work plus final answer in one answer
  path, without a standard separate unit/notation subfield.
- feedback regions are present, but wrappers do not all focus the same
  labelled feedback region after checking.
- task-shell hints are not a standard hidden/collapsible affordance.
- feedback links exist, but next-action markup is not yet standardized.
- `structured_short_response` is runtime-supported and used by the reviewed
  `1.1.2` exit ticket, but its UI contract is not documented by this sprint.

The product-end-state and companion-core specifications require the task shell
to support numeric input, calculation/work capture, final-answer entry,
unit/notation fields, short constructed responses, graph/table families,
structured reasoning, neutral feedback, retry/self-check states, hidden hints
where allowed, controlled feedback regions, and rendered operational proof.

## Quality Standard

Quality floor: the implementation must satisfy the stable product
specification within the authorized task-shell UX scope. Passing unit tests is
not enough. The rendered output and student-facing proof must show that the
same shared task-shell rules operate in at least one math task, one graph task,
one reasoning task, and one exit-ticket task.

Required quality floor:

- calculation tasks can render and collect a separate unit/notation field when
  the task data requires or offers it;
- deterministic calculation matching can require the unit/notation field, or
  accept an optional one without rejecting a correct final answer such as
  `108`;
- content hints render only as collapsed/clickable support when hints are
  allowed;
- exit-ticket source/output exposes no content hints;
- feedback replaces the single controlled region instead of stacking;
- correct feedback exposes a clear next local action;
- feedback regions are labelled/focusable and wrappers move keyboard focus
  there after checking;
- `structured_short_response` is documented and tested as a standard family;
- missing broader reasoning-family work remains routed to `REASON-STD-1`.

Proof standard: sprint plan/baseline, planning review, implementation and
tests, UI contract, screenshot/live-output manifest, custom checker, lead-review
round 1, correction log, lead-review round 2, result metadata, generated output
diff proof, and remote publication. Any omitted full-product requirement must
be named as follow-up or blocker.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Shared task shell supports separate unit/notation fields where the answer form requires it. | `engines/task-shell-engine.js`, `engines/task-shell-ui.js`, wrapper response collectors, focused tests, and at least one generated proof surface with `data-input-role="unit-notation"`. | Custom checker, Jest, rendered proof, lead review. | planned |
| Hints are hidden/collapsible where allowed, and exit tickets expose no answer hints. | Task-shell UI hint rendering plus checker scan of exit-ticket source/generated output. | Jest and custom checker; rendered output proof for practice route. | planned |
| Feedback uses one controlled region with focus and next-action clarity. | Wrapper changes in skilltree, graph, reasoning, and exit-ticket paths where needed; feedback markup with action wrapper. | Source tests/checker plus live-output evidence. | planned |
| `structured_short_response` is documented and hardened as a standard task family. | UI contract section and tests covering fields, option choice, feedback, and no broad prose regex fallback. | Custom checker and lead review. | planned |
| Rendered proof covers math, graph, reasoning, and exit-ticket task-shell surfaces. | Deploy to Book 1 lesson output and capture screenshot/live-output manifest. | Browser/screenshot evidence and checker path validation. | planned |
| Product-boundary claims remain blocked. | No target-exercise registry writes, no protected reference mutation, no new target-equivalent paragraphs, no diagnostics/mastery/sequencing/Scale Gate authority. | Scope-language, checker, lead review, git status. | planned |

## Quality Improvement Candidates

| Candidate | Classification | Disposition |
|---|---|---|
| Add unit/notation subfield support directly to `calculation_work_capture` rather than relying on a separate follow-up task. | include_now | It removes the current answer-form ambiguity and directly satisfies the sprint requirement. |
| Add a reusable hidden-hints renderer to task-shell UI. | include_now | Needed so practice/short-check surfaces have the affordance without inventing local hint widgets. |
| Replace all reasoning modes 0-4 with shared families. | defer_named_follow_up | This belongs to `REASON-STD-1`; this sprint only hardens the existing shared-shell structured reasoning route. |
| Build 1.1.3 graph/table target-equivalent exit ticket. | reject_scope_creep | `CHECK-SHORT-EXIT-2` or a later graph proof sprint owns missing exit-ticket creation. |
| Change target-exercise registry metadata or CP-6/Year-1 evidence. | reject_scope_creep | This sprint is runtime/UI and proof-output hardening, not registry promotion. |

## Allowed paths

- `reports/sprints/TASK-SHELL-UX-2-plan.md`
- `reports/sprints/TASK-SHELL-UX-2-baseline.md`
- `reports/sprints/TASK-SHELL-UX-2-planning-review.md`
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/sprints/TASK-SHELL-UX-2-screenshot-manifest.md`
- `reports/sprints/TASK-SHELL-UX-2-result.md`
- `reports/sprints/TASK-SHELL-UX-2-diff-summary.md`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-assignment.md`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-round1.md`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-corrections.md`
- `reports/sprints/TASK-SHELL-UX-2-lead-review-round2.md`
- `references/data/sprints/TASK-SHELL-UX-2.plan.json`
- `references/data/sprints/TASK-SHELL-UX-2.result.json`
- `reports/json/task-shell-ux2-proof.json`
- `build-scripts/sprints/check-task-shell-ux2.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/skilltree-ui.js`
- `engines/graphical-ui.js`
- `engines/exit-ticket-ui.js`
- `engines/reasoning-ui.js`
- focused tests under `engines/tests/`
- narrow `source-data/book-1/exit-ticket/1.1.2.json` task interaction changes for unit/notation UX only
- generated Book 1 output under `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/` produced by `node scripts/deploy.js`
- platform and lesson roadmap status updates
- generated repository-map, URL-index, and dashboard artifacts

## Forbidden paths

- No edits under `references/machine/` or `references/external/`.
- No target-exercise registry writes in `references/authored/course-target-exercises.json`.
- No source creation for `source-data/book-1/exit-ticket/1.1.3.json`.
- No changes that make `1.1.1` target-equivalent.
- No reasoning CSV content mutation.
- No candidate storage creation or writes.
- No protected reference mutation, machine reference mutation, external-source
  mutation, unit minting, unit update, unit split, or unit deprecation.
- No hand edits to generated lesson output; output changes must come from the
  deploy pipeline.
- No diagnostics, adaptive routing, mastery/sequencing, student-facing AI,
  summative use, PV projection, PV machine promotion, CP-6/Year-1 promotion,
  Scale Gate 1, or product-wide use.
- Do not import, stage, move, or edit `knowledge/exit-ticket-game-1.1.1.zip`.

## Inputs

- `../CLAUDE.md`
- `AGENTS.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- `reports/sprints/STANDARD-EXERCISES-1-result.md`
- `reports/json/standard-exercise-family-coverage.json`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/GAME-ARCH-2-state-ownership.md`
- `reports/sprints/GAME-ARCH-2-feedback-ownership.md`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/skilltree-engine.js`
- `engines/skilltree-ui.js`
- `engines/graphical-engine.js`
- `engines/graphical-ui.js`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/exit-ticket-engine.js`
- `engines/exit-ticket-ui.js`
- `source-data/book-1/exit-ticket/1.1.2.json`
- `build-scripts/content/book-1/b1-113-graphical-data.js`
- focused tests under `engines/tests/`

## Outputs

- Updated shared task-shell engine/UI/CSS and consuming wrappers.
- Updated focused Jest tests for task-shell engine/UI and wrapper behavior.
- Narrow exit-ticket `1.1.2` interaction update where needed for
  unit/notation proof while preserving approved local completion scope.
- `reports/sprints/TASK-SHELL-UX-2-ui-contract.md`
- `reports/json/task-shell-ux2-proof.json`
- `build-scripts/sprints/check-task-shell-ux2.js`
- deployed Book 1 generated proof output through `node scripts/deploy.js`
- `reports/sprints/TASK-SHELL-UX-2-screenshot-manifest.md`
- sprint plan, baseline, planning review, lead-review records, result, diff
  summary, result metadata, and roadmap updates

## Operationalized sprint procedure

1. Record baseline from specs, roadmaps, previous sprint result, current
   task-shell implementation, consumers, tests, and generated-output state.
2. Run planning review before implementation. Stop if the reviewer finds that
   the plan weakens exit-ticket proof or permits product authority.
3. Implement the shared task-shell changes:
   - optional/required `unitNotation` contract for calculation-work tasks;
   - rendered unit/notation input with stable `data-input-role`;
   - hidden/collapsible hint rendering for tasks that declare hints;
   - feedback action markup and CSS;
   - focus-plan update for unit/notation fields.
4. Update wrappers to collect the unit/notation subfield and move focus to
   their labelled feedback region after checking.
5. Document the UI contract, including `structured_short_response` and the
   hint/exit-ticket boundary.
6. Update the narrow `1.1.2` exit-ticket task interaction only if needed to
   prove unit/notation separation, preserving `108` acceptance and the reviewed
   local completion copy.
7. Add/extend focused tests for engine matching, UI rendering, no duplicate
   feedback stacking, hidden hints, next-action markup, feedback focus hooks,
   and exit-ticket no-hint boundary.
8. Add `check-task-shell-ux2.js` to validate artifacts, source contracts,
   generated proof output, and forbidden boundaries.
9. Deploy Book 1 output through `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`.
10. Inspect rendered output in browser/screenshot proof for:
    - one math task-shell task;
    - one graph task-shell task;
    - one reasoning structured task-shell task;
    - one `1.1.2` exit-ticket task-shell task;
    - mobile/narrow and dark-mode states.
11. Run acceptance tests, then lead-review round 1.
12. Apply corrections if needed, record the correction log, then run
    lead-review round 2.
13. Refresh repository maps/indexes/dashboard, run final validators, commit,
    fetch/prune, push both affected repos, and report hashes.

Decision points:

- If a unit/notation field would change target-equivalent criteria beyond
  reviewed `1.1.2` scope, make it optional for that task and route stricter
  proof to a later gate.
- If hint data appears in an exit-ticket task, remove it or stop; exit tickets
  may not expose content hints in this sprint.
- If a wrapper cannot share the task-shell feedback contract without local
  duplication, record it as a follow-up for `ENGINE-UNIFY-1` rather than
  papering over the drift.
- If rendered output cannot be inspected, do not close; record the evidence
  gap and stop before lead-review closure.

Stop conditions:

- Stop if the implementation requires protected reference mutation,
  target-exercise registry writes, new candidate storage, or new
  target-equivalent paragraph status.
- Stop if the `1.1.2` exit ticket stops accepting the reviewed answer `108`
  for the index task when calculation work is correct.
- Stop if any exit-ticket task exposes answer/content hints before attempt.
- Stop if feedback stacks duplicate blocks instead of replacing one region.
- Stop if keyboard focus cannot move to a labelled feedback region after
  checking in the proof surfaces.
- Stop if generated output was hand-edited instead of deployed.
- Stop if any wording authorizes diagnostics, mastery/sequencing,
  student-facing AI, summative use, PV, Scale Gate 1, or product-wide use.

Review and validator details:

- Planning review must pass before implementation.
- Custom checker must pass before lead review.
- Lead-review round 2 must return PASS or PASS WITH FLAGS before closure.
- Human review is not required for this sprint, but later product proof and
  gate work still require their own governed review artifacts.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/TASK-SHELL-UX-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js TASK-SHELL-UX-2
npx jest --runInBand engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js engines/tests/exit-ticket-engine.test.js engines/tests/exit-ticket-ui.test.js engines/tests/skilltree-engine.test.js engines/tests/graphical-engine.test.js engines/tests/graphical-ui.test.js engines/tests/reasoning-ui.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-task-shell-ux2.js
npm.cmd run check:platform
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/TASK-SHELL-UX-2-result.md
node build-scripts/sprints/check-sprint-bundle.js TASK-SHELL-UX-2 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Proof required to close: the shared task-shell unit/notation, hint,
feedback, focus, and next-action changes are implemented; math, graph,
reasoning, and exit-ticket proof surfaces validate through tests and rendered
output; `structured_short_response` is documented; `1.1.2` task 2 still
accepts `108` with correct work; exit tickets expose no content hints; custom
checker and full validators pass; lead-review round 2 returns PASS or PASS
WITH FLAGS; generated output was deployed, not hand-edited; and all product
authority boundaries remain blocked.

## Rollback plan

Before commit, revert only the TASK-SHELL-UX-2 engine/UI/test/source-data,
generated-output, report, checker, metadata, roadmap/index, and dashboard
changes. After commit, revert the sprint commit in platform and the generated
lesson-output commit in `../4veco-lessen` if needed.

Do not revert unrelated user work, previous sprint records, protected
references, target-exercise records, candidate-storage state, or
`knowledge/exit-ticket-game-1.1.1.zip`.

## Human review required

No human review gate is required for this UX hardening sprint. The sprint does
require planning review and a structural lead-review cycle before closure.
Later `CHECK-SHORT-EXIT-2`, `SCALE-PROOF-3P`, and `GATE-PRODUCT-3P` remain
blocked until their own artifacts and reviews are prepared.
