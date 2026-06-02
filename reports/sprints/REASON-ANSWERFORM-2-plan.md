# Sprint REASON-ANSWERFORM-2: Reasoning Answer-Form And Source-Use Scaffolds

Generated: 2026-06-02

## Goal

Connect the generated Book 1 reasoning practice route to reviewed answer-form
scaffolds for `A97`, `A98`, `A99`, and `A81`, while preserving the local
practice boundary. The reasoning route should show student-facing answer
construction cues such as fixed-conclusion explanation, direction-first
explanation, example explanation, and source-use-plus-underlying-answer-form
without showing internal MTU codes or claiming target-equivalent proof.

This sprint may implement bounded platform runtime/UI support, focused tests,
route validators, generated-output proof, screenshots, and scaffold evidence.
Generated Book 1 output may change only through `scripts/deploy.js`.

This sprint must also decide the current route for mode 2 `Vind de fout` and
mode 4 `Structuren matchen`: either remain local/held, wrap with reviewed
shared families, or name a rebuild/refactor follow-up. No target-equivalent
reasoning readiness is authorized.

## Context

`REASON-REFINE-1` found that generic `structured_reasoning` self-check is useful
practice but not answer-form proof. It required future work to add
answer-form-specific criteria and feedback for `A97`, `A98`, `A99`, and `A81`,
and to keep `A81` as a source-use modifier plus an underlying answer form.

`REASON-STD-1`, `REASON-ADOPT-1`, and `REASON-PLAY-1` then proved that modes 0,
1, 3, and 5 can use or coexist with the shared task shell in generated routes,
and that the route is playable with carried UX flags. Modes 2 and 4 remained
deferred/refactor-scoped.

`MTU-H4C` added the answer-form MTUs to `references/machine/` through the
reviewed reference CLI. Generator readiness still marks `A80`, `A81`, and
`A96`-`A99` generator-blocked and non-interactive for skill-tree exposure.
Therefore this sprint may use those units as planning/scaffold metadata, but
must not expose them as student-facing skill-tree generators or target-proof
claims.

## Quality Standard

The quality floor is specification fulfilment through rendered, student-facing
reasoning practice output that makes the answer-construction route clearer
without weakening governance boundaries. A reviewer must be able to see which
kind of answer structure the task is practising, which checklist the student
should use, and which lanes remain held.

Rendered output proof is required. Student-facing output must avoid internal
MTU codes and must not imply target-equivalent proof, diagnostics, mastery,
sequencing, summative status, Scale Gate 1 readiness, or product-wide use.
Any omitted requirement must be named as follow-up work or a blocker, especially
full source-based explanation adoption for `1.1.3`, a true visual flow-diagram
builder, and any evaluated constructed-response engine.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `A97`, `A98`, and `A99` remain distinct explanation scaffolds. | Runtime scaffold metadata has separate internal lanes and student-facing labels/checklists. | Checker verifies lanes are not collapsed into one generic explanation. | planned |
| `A81` remains source-use modifier plus underlying answer form. | Source-use scaffold records an underlying answer form and rejects standalone source-use evidence. | Checker verifies `A81` never appears as a standalone complete answer scaffold. | planned |
| Student-facing output hides internal MTU codes. | UI renders friendly labels and local checklist copy only. | Route checker and screenshot proof verify no visible `A97`, `A98`, `A99`, `A81`, or MTU codes. | planned |
| Mode 2 and mode 4 have honest disposition. | Scaffold map names current status and follow-up route for error detection and classification/matching. | Result and checker verify no false shared-shell adoption claim. | planned |
| Generated route remains playable and local. | Generated Book 1 reasoning output is rebuilt through deploy and inspected. | Playable proof and screenshots show answer-form cues, feedback, next action, mobile, and dark states. | planned |
| Generator-blocked answer-form MTUs do not leak into skill-tree exposure. | Readiness report remains generator-blocked/non-interactive for `A81/A97/A98/A99`. | Validator proof records no interactive skill-tree exposure. | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Add answer-form scaffold metadata to reasoning tasks and route proof. | include_now | This is the core reason for the sprint. |
| Render a compact answer-form cue/checklist in the reasoning route. | include_now | Students should understand the answer form they are practising. |
| Add route checker proof for A81 modifier and no internal-code leakage. | include_now | This is the main governance risk. |
| Capture screenshots for scaffold cue, feedback, mobile, and dark mode. | include_now | Human gate evidence must be reviewable like `GATE-TASK-FAMILY-1`. |
| Convert mode 2 to a two-tier shared-shell task if the current data supports it cleanly. | include_if_low_risk | This may clarify error detection, but must not force a weak mapping. |
| Convert mode 4 to matching-plus-explanation in the live route. | defer_named_follow_up | Classification-with-explanation needs stronger design than a quick wrapper. |
| Build a full source-based explanation route for `1.1.3`. | defer_named_follow_up | No `1.1.3` reasoning CSV exists yet and source/graph proof must coordinate with graph work. |
| Claim target-equivalent reasoning readiness. | reject_scope_creep | Requires separate target-operation and human-gate proof. |

## Allowed paths

- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/tests/reasoning-engine.test.js`
- `engines/tests/reasoning-ui.test.js`
- `build-scripts/sprints/check-reason-answerform2-route-output.js`
- `build-scripts/sprints/capture-reason-answerform2-screenshots.js`
- `reports/sprints/REASON-ANSWERFORM-2-*`
- `reports/sprints/REASON-ANSWERFORM-2-screenshots/`
- `reports/json/reason-answerform2-*.json`
- `references/data/sprints/REASON-ANSWERFORM-2.plan.json`
- `references/data/sprints/REASON-ANSWERFORM-2.result.json`
- generated Book 1 reasoning output, only through `scripts/deploy.js`
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and dashboard files required for reviewer navigation

## Generated Output Map

Generated Book 1 output may change only through `scripts/deploy.js`. After
deploy, run `git -C "../4veco-lessen" diff --name-only` and stop for review if
any path outside this map changes:

- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-engine.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning-ui.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning.css`, only if a
  scaffold layout/accessibility fix is implemented
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.1.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/1.1.2.js`
- `Boek 1 - Grondslagen, vraag en aanbod/shared/reasoning/meta-categories.js`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.1 Schaarste en economisch denken/*redeneer-spel.html`
- `Boek 1 - Grondslagen, vraag en aanbod/1.1 Hoofdstuk Economisch denken en rekenen/1.1.2 Percentages en indexcijfers/*redeneer-spel.html`

If deploy rewrites unrelated lesson content, exit-ticket source/generated data,
target-exercise surfaces, or non-reasoning generated output, stop and either
prove the diff is an unrelated no-op refresh, restore the side effect, or
revise the sprint scope.

## Forbidden paths

- hand edits to generated Book 1 output
- `source-data/book-1/reasoning/*.csv`
- `source-data/book-*/exit-ticket/*.json`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- protected reference mutation, unit minting, unit updates, unit splits, or unit deprecation
- target-exercise `question_type`, `answer_form`, or mapping writes
- student-facing skill-tree generator exposure for `A80`, `A81`, or `A96`-`A99`
- target-equivalent claims, diagnostics, adaptive routing, mastery, sequencing,
  student-facing AI, summative use, PV projection, PV machine promotion, Scale
  Gate 1, or product use

## Stop Conditions

Stop and revise or route a governance pause if any of these occur:

- planning review returns `REVISE` and the plan/plan JSON have not been corrected and rechecked;
- an answer-form scaffold exposes internal MTU codes in student-facing output;
- `A81` is implemented or documented as a standalone complete answer form;
- `A97`, `A98`, and `A99` are collapsed into one generic `leg uit` lane;
- mode 2 or mode 4 is claimed as fully unified without proof;
- source-based explanation is claimed live for `1.1.3` without source/graph evidence;
- generated output is changed by hand instead of through deploy;
- deploy produces diffs outside the Generated Output Map;
- any artifact claims target-equivalent proof, diagnostics, mastery, sequencing, Scale Gate 1, or product use;
- lead review returns `REVISE` and corrections are not applied before closure.

## Inputs

- `reports/sprints/REASON-REFINE-1-result.md`
- `reports/sprints/REASON-REFINE-1-task-coverage-matrix.md`
- `reports/sprints/REASON-REFINE-1-implementation-prep.md`
- `reports/sprints/REASON-STD-1-result.md`
- `reports/sprints/REASON-ADOPT-1-result.md`
- `reports/sprints/REASON-PLAY-1-result.md`
- `reports/sprints/MTU-H4C-result.md`
- `reports/json/skilltree-generator-readiness.json`
- `references/machine/micro-teaching-units.json`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- generated Book 1 reasoning pages in `../4veco-lessen`

## Outputs

- `reports/sprints/REASON-ANSWERFORM-2-plan.md`
- `reports/sprints/REASON-ANSWERFORM-2-baseline.md`
- `reports/sprints/REASON-ANSWERFORM-2-planning-review.md`
- `reports/sprints/REASON-ANSWERFORM-2-answer-form-scaffold-map.md`
- `reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md`
- `reports/sprints/REASON-ANSWERFORM-2-playable-proof.md`
- `reports/json/reason-answerform2-proof.json`
- `reports/json/reason-answerform2-scaffold-map.json`
- `reports/sprints/REASON-ANSWERFORM-2-screenshot-manifest.md`
- `reports/sprints/REASON-ANSWERFORM-2-screenshots/`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-assignment.md`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-round1.md`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-corrections.md`
- `reports/sprints/REASON-ANSWERFORM-2-lead-review-round2.md`
- `reports/sprints/REASON-ANSWERFORM-2-result.md`
- `reports/sprints/REASON-ANSWERFORM-2-diff-summary.md`
- `references/data/sprints/REASON-ANSWERFORM-2.plan.json`
- `references/data/sprints/REASON-ANSWERFORM-2.result.json`
- `build-scripts/sprints/check-reason-answerform2-route-output.js`
- `build-scripts/sprints/capture-reason-answerform2-screenshots.js`

## Operationalized sprint procedure

1. Record baseline from prior reasoning sprints, MTU-H4C, generator readiness,
   generated routes, and protected-reference state.
2. Run planning review before implementation. Fix plan, plan JSON, or baseline
   if review finds missing generated-output boundaries, target-proof leakage,
   or weak mode-disposition criteria.
3. Implement bounded runtime scaffold metadata in the reasoning engine and
   student-facing scaffold cue rendering in the reasoning UI.
4. Preserve `A81` as source-use modifier plus underlying answer form; add proof
   that no standalone source-use scaffold is emitted.
5. Decide mode 2 and mode 4 disposition and keep any unsupported lane held or
   routed to a named follow-up.
6. Add focused Jest coverage and route-output checker/capture scripts.
7. Deploy generated Book 1 output through `scripts/deploy.js`.
8. Review generated output diffs against the Generated Output Map and stop on
   unexpected diffs.
9. Capture screenshots and playable proof for scaffold cue, checked feedback,
   mobile/narrow route state, dark-mode state, and no internal-code leakage.
10. Run lead review round 1, apply corrections, then run lead review round 2.
11. Refresh maps/indexes/dashboard, run `git fetch --prune origin`, commit,
    push, and record final commit hash plus pushed status.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-ANSWERFORM-2-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-ANSWERFORM-2
npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
git -C "../4veco-lessen" diff --name-only
node build-scripts/sprints/check-reason-answerform2-route-output.js
node build-scripts/sprints/capture-reason-answerform2-screenshots.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/REASON-ANSWERFORM-2-result.md
node build-scripts/sprints/check-sprint-bundle.js REASON-ANSWERFORM-2 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Closure proof required to close this sprint must include review evidence,
validator evidence, rendered-output evidence, and test evidence:

- answer-form scaffold map for `A97`, `A98`, `A99`, and `A81`;
- explicit `A81` modifier-plus-underlying-answer-form proof;
- explicit mode 2 and mode 4 disposition;
- route-output proof showing scaffold cues render without internal codes;
- proof that generator-blocked MTUs remain non-interactive for skill-tree exposure;
- screenshot proof for desktop scaffold cue, feedback state, mobile/narrow, and dark mode;
- focused Jest, route checker, screenshot capture, book check, scope-language,
  report JSON, roadmap index, URL-index, and diff-check evidence;
- lead review assignment, round 1, correction log, and round 2;
- no target-equivalent, diagnostic, mastery, sequencing, Scale Gate 1, or product-use claim.

## Rollback plan

Before commit, revert only the `REASON-ANSWERFORM-2` engine/UI/CSS/test
changes, generated Book 1 output from deploy, sprint artifacts, checker/capture
scripts, screenshots, roadmap/status updates, generated maps, URL index, and
dashboard refreshes.

After commit, revert the sprint commit(s). Do not revert earlier reasoning
sprints, MTU-H4C unit additions, protected-reference data, source reasoning
CSVs, exit-ticket source data, target-exercise registries, or human-gate
artifacts.

## Human review required

No human review gate starts in this sprint. This sprint produces the final
reasoning scaffold evidence for later `GATE-REASON-STD-1`, which must use a
direct-comment evidence packet with concrete playable proof, screenshots,
validator evidence, usability-agent thinking traces, carried flags, and
no-authority boundaries.
