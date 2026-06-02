# Sprint REASON-PLAY-1: Reasoning Playability And Usability-Agent Test

Generated: 2026-06-02

## Goal

Test whether the generated Book 1 reasoning route is understandable and
playable after `REASON-ADOPT-1`. Separate usability agents must attempt the
route as if they were students and record whether the goal, clickable controls,
feedback, retry behavior, and next action are immediately clear or require
trial-and-error.

This sprint may make tightly scoped platform UI/CSS/copy repairs only if the
usability-agent evidence finds a blocker or serious confusion in the generated
reasoning route. Any repair must be re-deployed through `scripts/deploy.js` and
re-tested with screenshots and agent traces.

This sprint does not authorize source reasoning CSV edits, source exit-ticket
data edits, protected reference mutation, target-equivalent proof, completion
language, diagnostics, adaptive routing, mastery, sequencing, student-facing
AI, summative use, PV projection, PV machine promotion, Scale Gate 1, or
product-wide use.

## Context

`REASON-ADOPT-1` closed PASS WITH FLAGS after modes 0, 1, and 3 were adopted
into shared `step_ordering`, mode 5 stayed `structured_reasoning`, and modes 2
and 4 remained held/refactor-scoped.

Its carried flags are the starting conditions for this sprint:

- dual feedback is controlled but remains UX debt;
- mobile route panel remains visible but too low after long checked tasks;
- dark-mode proof clears mode-5 task-shell/self-check only while route-panel
  contrast remains flagged;
- capture automation checks task family, feedback state, and next action, but
  manual screenshot review remains needed;
- mode 3 is an ordered-chain bridge, not full visual flow-diagram construction;
- modes 2 and 4 remain held/refactor-scoped;
- no target-equivalent or product authority is authorized.

## Quality Standard

The quality floor is specification fulfilment through playable student-facing
rendered output that a reviewer and separate usability agents can understand
without hidden instructions. A successful sprint proves whether a student-like
tester can identify the goal, click the right controls, submit an answer,
interpret feedback, retry or continue, and explain what happened.

The sprint must name follow-up work or blockers instead of smoothing over
unclear behavior. It must preserve honest scope language: playability evidence
is practice-route quality, not target-equivalent proof or product/scale
authority.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| Reasoning route is playable without guessing. | Usability agents attempt modes 0, 1, 3, and 5 on generated pages. | Agent traces record goal clarity, click path, mistakes, and next-action clarity. | planned |
| Shared task controls are understandable. | Agents use token bank, selected sequence, clear/remove/move controls, check button, and next button. | Trace analysis distinguishes immediate understanding from trial-and-error. | planned |
| Feedback is not confusing. | Agents inspect local task-shell feedback plus global summary/next-action. | Review decides whether dual feedback is acceptable, needs copy repair, or needs UI simplification. | planned |
| Mobile route context remains usable. | Mobile/narrow proof focuses on route panel placement after a checked task. | Screenshot and agent evidence decide whether this is a blocker or carried UX debt. | planned |
| Dark route-panel contrast is reviewed. | Dark proof includes route panel and task feedback, not only mode-5 shell. | Visual/usability notes decide whether contrast repair is required. | planned |
| Held modes remain honest. | Modes 2 and 4 are not claimed as unified shared-shell routes. | Checker and result keep held/refactor status visible. | planned |

## Quality Improvement Candidates

| Candidate improvement | Classification | Reason |
|---|---|---|
| Run separate usability-agent traces and analyze whether the route is understandable without trial-and-error. | include_now | This is the core proof this sprint exists to produce. |
| Improve feedback copy if agents cannot tell why they are correct/wrong. | include_if_agent_blocker | This is playability repair, not feature expansion. |
| Reduce dual-feedback confusion if agents report competing messages. | include_if_agent_blocker | A controlled route is not enough if students cannot interpret it. |
| Improve mobile route-panel placement or collapse behavior if agents cannot find route context. | include_if_agent_blocker | Mobile route visibility is a carried flag from REASON-ADOPT-1. |
| Improve dark route-panel contrast if visual inspection shows unreadable copy. | include_if_agent_blocker | Dark-mode proof was intentionally narrowed. |
| Implement full visual flow-diagram construction. | defer_named_follow_up | This belongs to later reasoning/dual-coding work, not playability repair unless human review changes scope. |
| Adopt modes 2 and 4 into shared shell. | reject_scope_creep | Those modes remain held/refactor-scoped until `REASON-ANSWERFORM-2`. |
| Claim target-equivalent reasoning readiness. | reject_scope_creep | Requires later answer-form, target-operation, and human-gate evidence. |

## Allowed paths

- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/tests/reasoning-ui.test.js`
- `build-scripts/sprints/check-reason-play1-usability.js`
- `build-scripts/sprints/capture-reason-play1-screenshots.js`
- `reports/sprints/REASON-PLAY-1-*`
- `reports/json/reason-play1-*.json`
- `references/data/sprints/REASON-PLAY-1.plan.json`
- `references/data/sprints/REASON-PLAY-1.result.json`
- generated Book 1 shared reasoning/task-shell output and reasoning pages, only
  through `scripts/deploy.js` if a repair is implemented
- `references/reference-team-roadmap.md`
- `../4veco-lessen/lessen-team-roadmap.md`
- generated repository maps, URL indexes, and dashboard files required for
  reviewer navigation

## Forbidden paths

- hand edits to generated Book 1 output
- `source-data/book-1/reasoning/*.csv`
- `source-data/book-*/exit-ticket/*.json`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- target-exercise `question_type`, `answer_form`, or mapping writes
- target-equivalent claims, diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, Scale Gate 1, or product use

## Stop Conditions

Stop and revise or route a governance pause if:

- usability agents cannot complete mode 0, 1, 3, or 5 because the page or
  controls are broken;
- agent traces show the task cannot be understood without hidden instructions
  and the required repair exceeds the allowed paths;
- any repair would require reasoning CSV edits, source exit-ticket data,
  protected references, target-exercise fields, or candidate storage;
- generated output is changed by hand instead of through deploy;
- mode 2 or mode 4 is described as unified/adopted;
- any artifact claims target-equivalent proof, diagnostics, mastery,
  sequencing, Scale Gate 1, or product use;
- lead review returns `REVISE` and corrections are not applied before closure.

## Inputs

- `reports/sprints/REASON-ADOPT-1-result.md`
- `reports/sprints/REASON-ADOPT-1-playable-proof.md`
- `reports/json/reason-adopt1-proof.json`
- `reports/sprints/REASON-ADOPT-1-screenshot-manifest.md`
- `reports/sprints/REASON-ADOPT-1-lead-review-round2.md`
- `../4veco-lessen/specifications/product-end-state.md`
- `../4veco-lessen/specifications/companion-core-specifications.md`
- generated Book 1 reasoning pages in `../4veco-lessen`

## Outputs

- `reports/sprints/REASON-PLAY-1-plan.md`
- `reports/sprints/REASON-PLAY-1-baseline.md`
- `reports/sprints/REASON-PLAY-1-planning-review.md`
- `reports/sprints/REASON-PLAY-1-usability-agent-assignment.md`
- `reports/sprints/REASON-PLAY-1-usability-agent-1.md`
- `reports/sprints/REASON-PLAY-1-usability-agent-2.md`
- `reports/sprints/REASON-PLAY-1-usability-analysis.md`
- `reports/json/reason-play1-usability.json`
- `reports/sprints/REASON-PLAY-1-screenshot-manifest.md`
- `reports/sprints/REASON-PLAY-1-screenshots/`
- `reports/sprints/REASON-PLAY-1-lead-review-assignment.md`
- `reports/sprints/REASON-PLAY-1-lead-review-round1.md`
- `reports/sprints/REASON-PLAY-1-lead-review-corrections.md`
- `reports/sprints/REASON-PLAY-1-lead-review-round2.md`
- `reports/sprints/REASON-PLAY-1-result.md`
- `reports/sprints/REASON-PLAY-1-diff-summary.md`
- `references/data/sprints/REASON-PLAY-1.plan.json`
- `references/data/sprints/REASON-PLAY-1.result.json`

## Operationalized sprint procedure

1. Record baseline from `REASON-ADOPT-1` and current generated route.
2. Run planning review before usability-agent execution.
3. Assign at least two separate usability agents with student-like tasks.
4. Agents must record what they looked for, what they clicked, where they
   hesitated, whether they used trial-and-error, whether feedback was clear,
   and whether they knew the next action.
5. Make an explicit decision for each agent finding: blocker, carried flag,
   acceptable state, or named follow-up. Apply the stop conditions immediately
   if a finding exceeds the authorized repair scope.
6. If blockers are within allowed paths, repair and redeploy through
   `scripts/deploy.js`; then re-run usability proof and the affected validators.
7. Capture screenshots for any changed or flagged states.
8. Run lead review round 1, corrections, and round 2; no later human review
   gate may use this evidence unless the lead-review cycle and acceptance
   validators pass.
9. Refresh maps/indexes/dashboard, run `git fetch --prune origin`, commit,
   push, and record final commit hash plus pushed status.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/REASON-PLAY-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js REASON-PLAY-1
npx.cmd jest --runInBand engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
node build-scripts/sprints/check-reason-adopt1-route-output.js
node build-scripts/sprints/check-reason-play1-usability.js
node build-scripts/sprints/capture-reason-play1-screenshots.js
npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
node build-scripts/references/check-roadmap-version-index.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/REASON-PLAY-1-result.md
node build-scripts/sprints/check-sprint-bundle.js REASON-PLAY-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
git -C ../4veco-lessen diff --check
```

## Proof Required to Close

Closure proof required to close this sprint must include review evidence,
validator evidence, and test evidence:

- at least two separate usability-agent traces;
- analysis of whether the route was immediately understandable or required
  trial-and-error;
- proof for modes 0, 1, 3, and 5;
- explicit decision on dual feedback;
- explicit decision on mobile route-panel placement;
- explicit decision on dark route-panel contrast;
- screenshot proof for flagged or repaired states;
- lead review round 1, correction, and round 2 evidence;
- validator evidence from usability checker, route-output checker, focused
  Jest, book check, scope-language check, report JSON validation, roadmap index,
  and diff checks;
- no target-equivalent, diagnostic, mastery, sequencing, Scale Gate 1, or
  product-use claim.

## Rollback plan

Before commit, revert only `REASON-PLAY-1` UI/CSS/test changes, generated Book 1
output from deploy if repairs were made, sprint artifacts, checker/capture
scripts, screenshots, roadmap/status updates, generated maps, URL index, and
dashboard refreshes.

After commit, revert the sprint commit(s). Do not revert `REASON-ADOPT-1`,
earlier reasoning/task-family work, protected-reference data, source reasoning
CSVs, source exit-ticket data, or human-gate artifacts.

## Human review required

No human review gate starts in this sprint. This sprint produces usability-agent
evidence for later `GATE-REASON-STD-1`, which must use direct comments on the
evidence packet rather than the old interactive interview protocol.
