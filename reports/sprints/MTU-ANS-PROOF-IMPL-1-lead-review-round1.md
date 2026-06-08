# Lead Review Summary

Sprint: `MTU-ANS-PROOF-IMPL-1`

Round: lead review round 1

## Scope

Evidence inspected:

- `build-scripts/sprints/mtu-ans-proof-impl1-a96-data.js`
- `build-scripts/sprints/capture-mtu-ans-proof-impl1-screenshots.js`
- `build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js`
- `engines/tests/task-shell-engine.test.js`
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
| Answer-form action review | Lead reviewer | Method, labelled substitution, intermediate work, final answer, notation, and contextual conclusion are required | pass |
| Negative checker review | `node build-scripts/sprints/check-mtu-ans-proof-impl1-a96.js` | Final-answer-only, source-only, direction-free, example-only, notation omission, and standalone-A81 fail | pass |
| Rendered proof review | Lead reviewer plus Browser/visual QA | Screenshots show initial, retry, next-action, completed, mobile, and dark states | revise |
| Boundary review | Lead reviewer | No `GEN_A96`, no generic `ROUTE_SKILLS` row, `A81` modifier-only, `A99` blocked | pass |
| Command evidence | `reports/sprints/MTU-ANS-PROOF-IMPL-1-command-log.jsonl` | Focused tests, custom checker, reference checks, and platform checks pass before closure | pending |

## Consolidated Verdict

Verdict: REVISE

The proof data and checker behavior satisfy the route-specific A96 answer-form
contract, but the rendered evidence needed correction before closure. The
completed screenshots did not yet show the full work field clearly, and the
dark-mode screenshot control label did not reflect the active dark theme.

## Blocking Findings

Blocking findings were present in round 1:

1. `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/desktop-completed.png`
   and `reports/sprints/MTU-ANS-PROOF-IMPL-1-screenshots/mobile-dark-completed.png`
   accepted the full answer but clipped the visible work textarea, so the
   rendered proof did not visibly show the complete method, substitutions,
   intermediate work, and contextual conclusion together.
2. The first capture proof inspection had to be corrected so DOM evidence
   invoked the inspection expression and selected `.ts-task[data-task-family]`
   instead of an absent task marker.
3. The direct dark-mode capture applied the dark theme but left the toggle text
   as `Dark`, which made the dark screenshot carry a confusing control state.

## Specialist Findings

Browser inspection confirmed that the local review lab renders the
`calculation_work_capture` family, that final-answer-only reaches
`retry-feedback`, that the complete answer reaches `next-action` and
`completed`, and that desktop/mobile viewports report zero horizontal overflow.
The visual artifact issues above still required correction because closure
proof must be readable without relying only on DOM metadata.

## Test Evidence

Command-log evidence for closure is expected to include successful reruns of:

- `npx.cmd jest --runInBand engines/tests/task-shell-engine.test.js`
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

Apply the proof-lab rendering corrections, recapture desktop/mobile/dark
screenshots, rerun the custom checker and focused tests, then conduct round 2
lead review before result closure.
