# Sprint REASON-ADOPT-1: Reasoning Shared-Shell Route Adoption

Generated: 2026-06-02

## Goal

Adopt the `REASON-STD-1` wrapped reasoning standard-family tasks into the live
generated Book 1 reasoning route. Modes 0, 1, and 3 should render and play
through the shared task shell instead of private-only selection/flow UI, while
mode 5 remains shared `structured_reasoning`.

This sprint may change platform reasoning UI adoption code and focused tests,
regenerate the affected Book 1 automated reasoning output through
`scripts/deploy.js`, and produce route-specific playable proof and
screenshots. If the work requires `engines/reasoning-engine.js`,
`engines/task-shell-engine.js`, or `engines/task-shell-ui.js` edits, stop and
revise this plan before continuing.

It does not authorize source reasoning CSV edits, protected reference mutation,
target-equivalent proof, completion language, diagnostics, adaptive routing,
mastery, sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, Scale Gate 1, or product-wide use.

## Context

`REASON-STD-1` closed PASS WITH FLAGS after proving that modes 0, 1, 3, and 5
can emit shared task-shell proof objects. Its carried flags are the starting
conditions for this sprint:

- no product-route screenshots or playable generated-route proof existed yet;
- mode 1 is a semantic `claim_reason_evidence` mapping over `step_ordering`;
- mode 3 is an ordered-chain bridge, not full visual flow-diagram UI;
- modes 2 and 4 remain deferred/refactor-before-adoption.

`GATE-TASK-FAMILY-1` accepted the task families only as planning input, so this
sprint must produce route-specific rendered proof before any later human gate
can consider the reasoning route unified.

## Quality Standard

The quality floor is specification fulfilment through playable student-facing
rendered output in the generated reasoning route. A reviewer must be able to
open the generated Book 1 reasoning pages, choose modes 0, 1, 3, and 5,
interact with the shared task-shell controls, check an answer, see one
controlled local task-shell feedback region plus one global reasoning
summary/next-action, and proceed to the next task without guessing.

The sprint must preserve honest scope language: task-shell adoption is local
practice UI quality, not target-equivalent proof or product/scale authority.
Any omitted requirement must be named as follow-up work or an explicit blocker,
especially full visual flow-diagram construction, mode 2/4 standard-family
adoption, answer-form proof, and target-equivalent reasoning evidence.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reasoning route consumes shared task shell where actions overlap. | `engines/reasoning-ui.js` renders modes 0, 1, 3, and 5 through `TaskShellUI.renderTask`. | Checker validates deployed UI and generated pages. | planned |
| Shared task controls are actually playable. | UI binds `TaskShellUI.handleStepOrderingClick` and collects `{ order }` for modes 0/1/3. | Playable proof records click sequence, retry/match feedback, and next action. | planned |
| Existing scoring/progress stays compatible. | UI maps task-shell step IDs back to legacy engine answer labels/texts before `engine.submitAnswer`. | Focused Jest and generated-route checker prove scoring still works. | planned |
| Feedback remains controlled and local. | Shared task feedback renders inside each task card; global reasoning feedback remains one summary/example route and next-action surface. | Screenshot/manual review proof checks no repeated stacking and no forbidden claims; dual feedback remains a carried UX flag. | planned |
| Mode 2 and mode 4 remain honest. | UI does not falsely render mode 2/4 as shared-shell-adopted. | Checker verifies held/refactor markers and no adoption claim for modes 2/4. | planned |
| Generated output is through platform deploy only. | Run `node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`. | Diff/result record generated files and no hand patching. | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Render modes 0/1/3 with `TaskShellUI.renderTask`. | include_now | Directly closes the route-adoption gap from REASON-STD-1. |
| Use `TaskShellUI` interaction handlers instead of custom private click logic for modes 0/1/3. | include_now | Proves actual shared-shell playability, not only static rendering. |
| Add focused source and generated-route checker coverage. | include_now | Product-route adoption must be checkable. |
| Capture desktop/mobile/dark screenshots and DOM proof. | include_now | Human review needs evidence like GATE-TASK-FAMILY-1. |
| Redesign mode 3 into full drag/drop visual flow diagrams. | defer_named_follow_up | REASON-STD-1 only authorized an ordered-chain bridge; richer visual flow can follow if proof shows need. |
| Adopt mode 2 or mode 4 into shared task shell now. | reject_scope_creep | Those modes remain held/refactor-scoped from REASON-STD-1. |
| Claim target-equivalent reasoning readiness. | reject_scope_creep | Requires later answer-form and target-operation evidence. |

## Allowed paths

- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/tests/reasoning-ui.test.js`
- `engines/tests/reasoning-engine.test.js`
- `build-scripts/sprints/check-reason-adopt1-route-output.js`
- `build-scripts/sprints/capture-reason-adopt1-screenshots.js`
- `reports/sprints/REASON-ADOPT-1-*`
- `reports/json/reason-adopt1-*.json`
- `references/data/sprints/REASON-ADOPT-1.plan.json`
- `references/data/sprints/REASON-ADOPT-1.result.json`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and dashboard files required for
  reviewer navigation

## Generated Output Map

Generated Book 1 output may change only through `scripts/deploy.js`. After
deploy, run `git -C "../4veco-lessen" diff --name-only` and stop for review if
any path outside this map changes:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`, only if a
  shared-shell reasoning layout/accessibility fix is implemented
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`, only as a
  byte-for-byte deploy copy of the already-reviewed source state
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-engine.js`, as the
  deployed shared-shell dependency required for `step_ordering` evaluation
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell-ui.js`, as the
  deployed shared-shell dependency required for `step_ordering` playability
- `Boek 1 - Grondslagen, vraag en aanbod/shared/task-shell.css`, as the
  deployed shared-shell dependency required for rendered task controls
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.1.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.2.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.3.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/meta-categories.js`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/*redeneer-spel.html`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/*redeneer-spel.html`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/*redeneer-spel.html`

If deploy rewrites landing pages, unrelated shared engines, lesson content,
exit-ticket data, source documents, or non-reasoning generated output, stop and
either restore the unrelated deploy side effect, prove the diff is an unrelated
no-op generated refresh, or revise the sprint scope before continuing.

## Forbidden paths

- hand edits to generated Book 1 output
- `source-data/book-1/reasoning/*.csv`
- `source-data/book-*/exit-ticket/*.json`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- protected reference mutation, unit minting, unit updates, unit splits, or
  unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- target-equivalent claims, diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, Scale Gate 1, or product use

## Stop Conditions

Stop and revise or route a governance pause if any of these occur:

- planning review returns `REVISE` and the plan/plan JSON have not been
  corrected and rechecked;
- the generated reasoning pages do not load `TaskShellUI` and
  `TaskShellEngine`;
- modes 0, 1, or 3 fall back to private-only UI instead of the shared
  `step_ordering` task shell;
- mode 5 `structured_reasoning` regresses;
- local task-shell feedback is missing after checking a mode 0/1/3 answer;
- global reasoning summary/next-action is missing after checking a mode 0/1/3
  answer;
- feedback regions repeatedly stack after repeated attempts or navigation;
- screenshot or playable-proof capture fails;
- mode 2 or mode 4 is described as adopted into the shared shell;
- deploy produces diffs outside the Generated Output Map;
- any answer, copy, report, or metadata claims target-equivalent proof,
  diagnostics, mastery, sequencing, Scale Gate 1, or product use.

## Inputs

- `reports/sprints/REASON-STD-1-result.md`
- `reports/sprints/REASON-STD-1-standard-family-map.md`
- `reports/json/reason-std1-proof.json`
- `reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-closure.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/task-shell-ui.js`
- `build-scripts/platform/build-reasoning-engine.js`
- `build-scripts/sprints/capture-reason-ux2-screenshots.js`
- `build-scripts/sprints/check-reason-ux2-route-output.js`

## Outputs

- `reports/sprints/REASON-ADOPT-1-plan.md`
- `reports/sprints/REASON-ADOPT-1-baseline.md`
- `reports/sprints/REASON-ADOPT-1-planning-review.md`
- `reports/sprints/REASON-ADOPT-1-playable-proof.md`
- `reports/json/reason-adopt1-proof.json`
- `reports/sprints/REASON-ADOPT-1-screenshot-manifest.md`
- `reports/sprints/REASON-ADOPT-1-screenshots/`
- `reports/sprints/REASON-ADOPT-1-lead-review-assignment.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-round1.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-corrections.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-round2.md`
- `reports/sprints/REASON-ADOPT-1-result.md`
- `reports/sprints/REASON-ADOPT-1-diff-summary.md`
- `references/data/sprints/REASON-ADOPT-1.plan.json`
- `references/data/sprints/REASON-ADOPT-1.result.json`
- `build-scripts/sprints/check-reason-adopt1-route-output.js`
- `build-scripts/sprints/capture-reason-adopt1-screenshots.js`

## Operationalized sprint procedure

1. Record baseline from REASON-STD-1, current generated reasoning route, and
   current UI behavior. Stop if the work would require reasoning CSV edits,
   source exit-ticket writes, protected references, or target-proof claims.
2. Run planning review before implementation. Fix the plan if review finds
   missing generated-output boundaries, unclear playability proof, or hidden
   target-proof claims.
3. Implement shared-shell rendering and interaction binding for modes 0, 1,
   and 3 in `engines/reasoning-ui.js`.
4. Preserve mode 2 and mode 4 as existing private/refactor-scoped modes.
5. Add focused tests and a generated-route checker.
6. Deploy generated Book 1 output through `scripts/deploy.js`.
7. Review `git -C "../4veco-lessen" diff --name-only` against the Generated
   Output Map and stop on unexpected generated-output diffs.
8. Capture screenshots/playable proof for desktop, mobile, dark mode, retry,
   matched feedback, next action, and route panel visibility.
9. Run lead review round 1, apply corrections, and run round 2.
10. Run `git fetch --prune origin`, handle any behind/diverged state
    explicitly, refresh repository maps, URL index, dashboard, commit, push,
    and record the final commit hash plus pushed status.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-ADOPT-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-ADOPT-1
npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
git -C "../4veco-lessen" diff --name-only
node build-scripts/sprints/check-reason-adopt1-route-output.js
node build-scripts/sprints/capture-reason-adopt1-screenshots.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/REASON-ADOPT-1-result.md
node build-scripts/sprints/check-sprint-bundle.js REASON-ADOPT-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Closure proof required to close this sprint must include review evidence,
validator evidence, and test evidence, not only implementation notes:

- generated-route evidence for `1.1.1`, `1.1.2`, and `1.1.3` reasoning pages;
- playable proof for modes 0, 1, 3, and 5;
- at least one retry state and one matched/self-check state, including local
  task-shell feedback plus global reasoning summary/next-action;
- next-action proof after checking;
- route panel visible in at least one mobile/narrow screenshot;
- dark-mode screenshot proof;
- planning-review evidence plus lead-review round 1, correction, and round 2
  evidence;
- validator evidence from `check-reason-adopt1-route-output.js`, sprint bundle
  checks, report JSON validation, roadmap-index checks, scope-language checks,
  and generated-output/book checks;
- test evidence from focused reasoning/task-shell Jest runs;
- generated-output diff review proving all lesson diffs stay inside the
  Generated Output Map;
- final local commit hash and pushed status after `git fetch --prune origin`;
- no adoption claim for modes 2 and 4;
- no target-equivalent, diagnostic, mastery, sequencing, Scale Gate 1, or
  product-use claim.

## Rollback plan

Before commit, revert only the `REASON-ADOPT-1` reasoning UI/CSS/test changes,
generated Book 1 output from deploy, sprint artifacts, checker/capture
scripts, screenshot proof, roadmap/status updates, generated repository maps,
URL index, and dashboard refreshes.

After commit, revert the sprint commit(s). Do not revert REASON-STD-1, earlier
reasoning/task-family work, protected-reference data, source reasoning CSVs,
source exit-ticket data, or human-gate artifacts.

## Human review required

No human review gate starts in this sprint. This sprint produces route-specific
playable evidence for later `REASON-PLAY-1`, `REASON-ANSWERFORM-2`, and
`GATE-REASON-STD-1`. The later human gate must use direct comments on the
evidence package, not the old one-question-at-a-time interview protocol.
