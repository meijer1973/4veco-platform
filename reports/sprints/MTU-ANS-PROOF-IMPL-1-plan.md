# Sprint MTU-ANS-PROOF-IMPL-1: A96 Answer-Form Proof Implementation

Generated: 2026-06-08

## Goal

Implement one bounded, route-specific shared-task-shell proof for `A96`
calculation-answer work. The proof uses the reviewed `1.1.2 Percentages en
indexcijfers` calculation surface as its source context, but does not expose
`A96` as a generic route row and does not implement `GEN_A96`.

This sprint may add a review-only lab, proof JSON, focused tests, screenshots,
and a deterministic checker. It does not authorize generated lesson output,
generic skilltree route exposure, product-route adoption, target-equivalent
authority, diagnostics, mastery, sequencing, PV projection, Scale Gate 1, or
student/product use.

## Context

`MTU-ANS-GEN-DESIGN-1` designed answer-form generator/proof work for `A80`,
`A81`, and `A96`-`A99` while preserving generator-blocked guardrails. `A96`
encodes the calculation answer form: formula or method, labelled
substitution, intermediate work, final answer, unit/notation, and contextual
conclusion.

The reviewed `1.1.2` exit-ticket calculation surface already uses the shared
`calculation_work_capture` task family. This sprint reuses that reviewed
calculation prompt as a route-specific proof fixture, then tightens the A96
answer action in the proof task only. The reviewed exit-ticket source remains
unchanged.

## Quality Standard

The quality floor is a specification-faithful answer-form proof, not a visual
stub or final-answer checker. A student-facing calculation task is only
adequately represented when the rendered output can require method/rule,
labelled substitution, intermediate work, final answer, required notation, and
a short contextual conclusion. Passing tests alone is insufficient: proof must
show rendered output, feedback/retry behavior, next action, completion state,
mobile and dark-mode screenshots, and negative checker cases.

The proof must be tied to a real reviewed calculation route context while
remaining bounded to a report lab. Follow-up work remains required before any
generated lesson adoption, product-route adoption, target-equivalent reliance,
general `A96` generator, broader answer-form route exposure, or Scale Gate 1.

## Specification Fulfilment Matrix

| Specification requirement | Implementation evidence required | Review/proof required | Status |
|---|---|---|---|
| `A96` proof is route-specific and connected to reviewed `1.1.2` calculation work. | Proof data derives from `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json` task `prijsstijging-procent` and records the route link. | Custom checker validates the source prompt, route metadata, and rendered lab. | planned |
| Student action requires formula/rule or calculation method. | `requiredWorkText` includes method groups for percentage change. | Focused Jest and checker reject final-answer-only and example-only responses. | planned |
| Student action requires labelled substitution. | Work groups require labelled new and old price substitutions. | Focused Jest and checker reject source-only responses. | planned |
| Student action requires intermediate work. | Work groups require visible difference/fraction/percent intermediate signals. | Focused Jest and checker reject work that skips intermediate calculation. | planned |
| Student action requires final answer plus unit/notation. | Expected final answer and required percent notation are deterministic. | Checker rejects omitted notation where required. | planned |
| Student action requires short contextual conclusion. | Work groups require a contextual direction phrase such as price increase. | Checker rejects direction-free responses. | planned |
| `A96` is not exposed as a generic route row and `GEN_A96` is not implemented. | No `engines/skilltree/base-elements.js` or `engines/skilltree/generators.js` adoption. | Checker and required generator-readiness checks prove `A96` remains blocked. | planned |
| `A81` remains modifier-only and `A99` remains blocked. | Non-regression checks only; no edits to `A80`, `A81`, `A97`, `A98`, or `A99`. | Checker rejects standalone-A81 proof and verifies `A99` remains blocked. | planned |
| Rendered proof is inspectable. | Review lab plus desktop, mobile, dark-mode screenshots and proof JSON. | Capture script and checker validate initial, retry, next-action, and completed states. | planned |

## Quality Improvement Candidates

| Candidate | Decision | Rationale |
|---|---|---|
| Use the existing `calculation_work_capture` family instead of a new answer widget. | include_now | The shared shell already owns work/final/notation collection and deterministic matching. |
| Add explicit proof metadata naming the six required answer-action parts. | include_now | This makes the bounded route-specific proof auditable without exposing `A96` generically. |
| Generate Book 1 output or edit the reviewed `1.1.2` exit ticket source. | defer_named_follow_up | Adoption belongs to a later route-adoption sprint with human review. |
| Add `GEN_A96` as a randomized skilltree generator. | reject_scope_creep | The user explicitly forbids old-style randomizer work unless a plan proves it preserves the required answer action. |

## Allowed paths

- `build-scripts/sprints/mtu-ans-proof-impl1-a96-data.js`
- `build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js`
- `build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js`
- `engines/tests/task-shell-engine.test.js`
- `reports/json/mtu-ans-proof-impl1-a96-proof.json`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-*`
- `references/data/sprints/MTU-ANS-PROOF-IMPL-1.plan.json`
- `references/data/sprints/MTU-ANS-PROOF-IMPL-1.result.json`
- repository maps, URL index, internal dashboard data, and roadmap ledger
  updates required for normal closure

## Forbidden paths

- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `source-data/book-1/exit-ticket/`
- generated lesson output under `../4veco-lessen/`
- `engines/skilltree/base-elements.js`
- `engines/skilltree/generators.js`
- any implementation of `GEN_A96`
- any generic `ROUTE_SKILLS` exposure for `A96`
- edits to `A80`, `A81`, `A97`, `A98`, or `A99` except explicit
  non-regression checks
- diagnostics, mastery, sequencing, PV projection, Scale Gate 1, or
  student/product use

## Inputs

- `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json`
- `reports/json/skilltree-generator-readiness.json`
- `references/data/sprints/RX.6-generator-blocked-units.json`
- `reports/mtu-hardening/mtu-h4b-answer-form-cli-execution-packet.json`
- prior `GATE-MTU-H4B-answer-form-cli-execution` closure notes
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/tests/task-shell-engine.test.js`
- `../4veco-lessen/specifications/product-vision.md`

## Outputs

- `reports/sprints/MTU-ANS-PROOF-IMPL-1-plan.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-baseline.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-planning-review.md`
- `build-scripts/sprints/mtu-ans-proof-impl1-a96-data.js`
- `build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js`
- `build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js`
- focused task-shell calculation tests
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-rendered-lab.html`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshot-manifest.md`
- screenshots under `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/`
- `reports/json/mtu-ans-proof-impl1-a96-proof.json`
- lead-review assignment, round 1, correction log, and round 2
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-result.md`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-diff-summary.md`
- sprint plan/result metadata JSON
- command log JSONL and Markdown evidence

## Operationalized sprint procedure

1. Verify the safety gate and worktree lock before edits. Stop if
   `AGENT-WORKTREE-SAFETY-1` is not merged or the worktree is not clean and
   claimed.
2. Create plan, plan metadata, baseline, and planning review. Run the plan
   checker before implementing proof code.
3. Build the bounded A96 proof data from the reviewed `1.1.2` calculation
   task. Keep `A96` out of `ROUTE_SKILLS`, do not add `GEN_A96`, and do not
   edit source-data or generated lesson output.
4. Add focused calculation-work tests and the deterministic sprint checker.
   Stop if final-answer-only, source-only, direction-free, example-only,
   notation-omission, or standalone-A81 responses can pass.
5. Generate the rendered review lab and capture desktop, mobile, and dark-mode
   screenshots covering initial, retry/feedback, next-action, and completed
   states.
6. Run required reference guardrails, focused tests, platform checks, and
   sprint checkers through the command logger.
7. Record lead-review round 1. If the verdict is REVISE, apply corrections,
   record the correction log, rerun proof commands, then record round 2.
8. Close only after result, diff summary, command log, repository maps, URL
   index, dashboard, and bundle validators pass. Any failure to preserve the
   answer-form boundaries is a stop condition.

## Acceptance tests

```bash
node build-scripts/sprints/check-sprint-plan.js reports/sprints/MTU-ANS-PROOF-IMPL-1-plan.md
node build-scripts/sprints/check-sprint-bundle.js MTU-ANS-PROOF-IMPL-1
npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js
node build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js
node build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js
node build-scripts/references/check-mtu-answerform-generator-design.js
node build-scripts/references/check-skilltree-generator-readiness.js
node build-scripts/references/check-mtu-evidence-layer.js
npm.cmd run check:platform
npm.cmd run check:scope-language
node build-scripts/reports/validate-report-json.js
npm.cmd run agent:index
node build-scripts/sprints/emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts/sprints/check-sprint-result.js reports/sprints/MTU-ANS-PROOF-IMPL-1-result.md
node build-scripts/sprints/check-sprint-command-log.js MTU-ANS-PROOF-IMPL-1
node build-scripts/sprints/check-sprint-bundle.js MTU-ANS-PROOF-IMPL-1 --complete
node build-scripts/sprints/emit-url-index.js --check
git diff --check
```

## Proof Required to Close

To close, closure proof must include the rendered lab, screenshot manifest, proof JSON,
focused Jest test evidence, custom checker evidence, required reference
validator evidence, `npm.cmd run check:platform`, command-log evidence, and
lead review evidence for round 1/corrections/round 2. The checker must prove
that final-answer-only, source-only, direction-free, example-only,
notation-omission, and standalone-A81 responses fail.

## Rollback plan

Remove the sprint-specific proof data, checker, capture script, screenshots,
proof JSON, focused tests, sprint reports, and metadata. No rollback is needed
for protected reference data, source-data, generated lesson output, skilltree
generators, or route rows because this sprint must not edit them.

## Human review required

No human review gate is opened in this sprint. Structural lead review is
required before closure. A later human-reviewed route-adoption sprint is still
required before generated lesson adoption, target-equivalent reliance,
product-route adoption, generic generator exposure, or student/product use.
