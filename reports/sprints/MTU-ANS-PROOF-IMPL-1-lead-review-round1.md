# Lead Review Summary

Sprint: `MTU-ANS-PROOF-IMPL-1`

Round: lead review round 1

## Scope

Evidence inspected:

- `build-scripts/sprints/mtu-ans-proof-impl1-a96-data.js`
- `build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js`
- `build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js`
- `engines/task-shell-engine.js`
- `engines/task-shell-ui.js`
- `engines/task-shell.css`
- `engines/tests/task-shell-engine.test.js`
- `engines/tests/task-shell-ui.test.js`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-rendered-lab.html`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/manifest.json`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/desktop-completed.png`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/mobile-dark-completed.png`
- `reports/json/mtu-ans-proof-impl1-a96-proof.json`
- `reports/sprints/MTU-ANS-PROOF-IMPL-1-command-log.jsonl`

## Review Plan

| Review/Test | Agent or tool | Required evidence | Status |
|---|---|---|---|
| Route-specific source review | Lead reviewer | Proof derives from reviewed `1.1.2` task `prijsstijging-procent` without editing source-data | pass |
| Answer-form action review | Lead reviewer | Method, labelled substitution, intermediate work, final answer, notation, and contextual conclusion are visible in the rendered task | revise |
| Negative checker review | `node build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js` | Final-answer-only, source-only, direction-free, example-only, notation omission, wrong denominator, missing substitution, left-to-right token order, duplicate hidden old-price tokens, and standalone-A81 fail | revise |
| Rendered proof review | Lead reviewer plus Browser/visual QA | Screenshots show visible structured answer-form sections in initial, retry, next-action, completed, mobile, and dark states | revise |
| Boundary review | Lead reviewer | No `GEN_A96`, no generic `ROUTE_SKILLS` row, `A81` modifier-only, `A99` blocked | pass |
| Command evidence | `reports/sprints/MTU-ANS-PROOF-IMPL-1-command-log.jsonl` | Focused tests, custom checker, reference checks, and platform checks pass before closure | pending |

## Consolidated Verdict

Verdict: REVISE

The proof data was tied to the reviewed route context, but the rendered task
still relied too heavily on a generic work-textarea style proof. Owner feedback
and the v3 A96 golden exemplar require the answer-form structure to be visible
as a formula/method builder, labelled substitution fields, final answer,
notation, and contextual conclusion. Round 1 therefore returned REVISE.

## Blocking Findings

Blocking findings were present in round 1:

1. The rendered proof did not yet implement a visible A96 answer form. Method,
   substitution, intermediate work, final answer, notation, and conclusion were
   mostly represented through validator logic and a generic work-entry surface.
2. The proof needed an explicit formula token builder with plausible
   distractors, including a token-bank order that does not reveal the correct
   formula by left-to-right clicking.
3. The old-price token policy needed durable proof: `oude prijs` must be one
   reusable visible token with `maxUses: 2`, not two visually identical answer
   tokens with different hidden IDs.
4. Negative fixtures needed to cover wrong denominator, missing substitution,
   left-to-right token order, and visually identical old-price token rejection
   in addition to final-answer-only, source-only, direction-free, example-only,
   notation omission, and standalone-A81.
5. Completed screenshot evidence also needed to remain readable after the
   structured form correction, including mobile and dark-mode states.

## Specialist Findings

Browser inspection confirmed that the local review lab was route-specific and
review-only, and that final-answer-only could be rejected. The rendered product
shape still failed the v3 exemplar standard because reviewers could not see a
complete structured answer form without reading JSON or validator code.

## Test Evidence

Command-log evidence for closure is expected to include successful reruns of:

- `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js`
- `npx.cmd jest --runInBand engines/tests/task-shell-ui.test.js`
- `node build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js`
- `node build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js`
- `node build-scripts/references/check-skilltree-generator-readiness.js`
- `npm.cmd run check:platform`

Round 1 requires the capture and checker commands to be rerun after correction.

## Learning Quality Evidence

The proof uses the real reviewed `1.1.2` percentage-change calculation prompt
and requires a complete calculation answer form. No generated lesson output or
student-facing product route is adopted in this sprint.

## Student Experience Evidence

Review-only rendered evidence exists, but no student/product-use surface is
changed. The round 1 rendered screenshots needed improved readability before
they could serve as closure proof.

## Ownership and Handoff

The sprint implementer owns corrections in
`build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js` and reruns
the capture/checker evidence. No lesson-output or product-route handoff is
authorized.

## Required Next Action

Implement the bounded structured `calculation_answer_form_capture` surface,
recapture desktop/mobile/dark screenshots, rerun the custom checker and
focused engine/UI tests, then conduct round 2 lead review before result
closure.
