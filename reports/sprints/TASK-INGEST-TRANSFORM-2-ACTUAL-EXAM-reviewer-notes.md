# TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM Reviewer Notes

## Review Purpose

Review whether the authorized actual-exam source has been transformed into a
shared task-family bundle without weakening the official item into shallow
recognition.

## Required Checks

1. Source authority matches `reports/json/exam-source-authority1-contract.json`.
2. Context blocks come from `reports/json/source-reconstruct2-actual-exam.json`
   and every task references those context blocks.
3. The task bundle validates as one task set with `TaskShellEngine`.
4. Correct responses pass and adversarial responses fail.
5. Source selection does not replace calculation work.
6. Final-answer-only work does not pass.
7. The rendered review lab shows context before task cards and includes desktop
   light, mobile light, and mobile dark screenshots.
8. Protected references, source-data, and Book 1 generated output remain clean.

## Task Cards To Inspect

- `q3-source-values` (`source_value_selection`)
- `q3-annual-premium-formula` (`formula_builder`)
- `q3-operation-order` (`step_ordering`)
- `q3-calculation` (`calculation_work_capture`)
- `q3-source-chain` (`source_chain_builder`)
- `q3-threshold-direction` (`structured_short_response`)

## Stop Conditions

Stop if the bundle lacks visible calculation work, lacks a threshold direction
task, treats source use as the full answer, hides sourceAuthority, exposes a
product-route claim, mutates forbidden paths, or relies on a generated lesson
route that this sprint is not authorized to publish.

## Follow-Up

`GATE-SHARED-TASK-INGEST-REPAIR-1` still needs a human review packet with
direct comments and remote evidence. This sprint only prepares the actual-exam
task-transformation side of that later gate.
