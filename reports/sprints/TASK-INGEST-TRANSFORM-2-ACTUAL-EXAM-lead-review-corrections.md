# Sprint TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM: Lead Review Corrections

## Round-1 Verdict

Round 1 returned REVISE. One blocking issue and one checker gap were found.

## Correction Record

| Finding | Disposition | Evidence |
|---|---|---|
| The generated rendered lab still embedded the internal-ID detector regex `/ctx-zoohee|q3-/`, even though visible text was clean. | Resolved before round 2. Internal-ID detection now runs in `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js` after the browser returns body text, and `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html` no longer carries `ctx-zoohee` or `q3-`. | `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js` now rejects `ctx-zoohee`, `q3-`, `649`, `1.684`, `1684`, `1.035`, and `1035` in lab HTML source; latest command-log entries for capture and checker passed. |
| The checker asserted no answer amount in context but not in task cards. | Resolved before round 2. Per-screenshot proof must now report `answerAmountVisibleInTaskCards: false`, and the aggregate proof carries `answer_amount_visible_in_task_cards: false`. | `reports/json/task-ingest-transform2-actual-exam-proof.json` records false for all task-card answer-leak flags; `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js` asserts per-screenshot and aggregate task-card flags. |

## Round-2 Readiness

Round 2 should recheck the corrected rendered lab source, proof JSON, screenshot
manifest, command log, and custom checker. The expected verdict is PASS if no
new blocker or flag appears.
