# Sprint REASON-UX-2: Lead Review Recheck 1

Generated: 2026-05-31

Reviewer: Dalton (`lead-reviewer-agent` subagent)

## Verdict

REVISE.

## Blocking Finding

The first correction only partially repaired `REASON-UX-2-LR1-F1`.
`engines/reasoning-engine.js` correctly treated mode 5 as `selfCheckOnly` and
non-scoring, but `engines/reasoning-ui.js` accidentally placed self-check
result-display logic inside `saveAnswerProgress()`, where `result` and
`breakdownEl` were out of scope.

The generated lesson-side copy had the same runtime risk after deploy. Normal
scored modes could throw when calling `saveAnswerProgress()`, violating the
requirement that the existing five reasoning modes remain available.

## Evidence Observed

Dalton observed focused tests and route checks passing, but correctly noted
that they did not catch the runtime scoping regression:

```text
npx.cmd jest --runInBand --runTestsByPath engines/tests/reasoning-engine.test.js engines/tests/reasoning-ui.test.js engines/tests/task-shell-engine.test.js engines/tests/task-shell-ui.test.js
PASS
```

```text
node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
PASS
```

Dalton also confirmed protected-surface diff evidence remained clean and that
the plan JSON still carried GRAPH-UX-2 and MATH-UX-2 regression checks in the
final validation stack.

## Required Correction

Move self-check-only result display into `showResults()`, keep
`saveAnswerProgress()` free of `result`/`breakdownEl` references, add a guard
test for the scored-progress persistence block, redeploy generated Book 1
output, rerun focused tests plus graph/math/reason route checks, and request
lead-review round 2 again.
