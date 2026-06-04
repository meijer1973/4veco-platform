# Sprint TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM: Lead Review Assignment

## Assignment

Sprint: `TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM`

Lead reviewer agent: Huygens (`019e91c3-f700-72f3-8896-03764adfd727`)

Scope: review the actual-exam task transformation bundle for the authorized
external-primary item `vw-1022-a-25-1-o:opgave-1:question-3`. The review must
judge exact reconstructed-context binding, TaskShellEngine validity, operation
chain preservation, answer-form preservation, correct/adversarial evidence,
rendered proof, answer leakage, and boundary discipline.

## Evidence To Inspect

- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-plan.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-baseline.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-planning-review.md`
- `reports/json/source-reconstruct2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam.json`
- `reports/json/task-ingest-transform2-actual-exam-proof.json`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-operation-chain-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-answer-form-trace.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-task-family-map.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-reviewer-notes.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-rendered-lab.html`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshot-manifest.md`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/desktop-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-light.png`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-screenshots/mobile-dark.png`
- `build-scripts/sprints/capture-task-ingest-transform2-screenshots.js`
- `build-scripts/sprints/check-task-ingest-transform2-actual-exam.js`
- `reports/sprints/TASK-INGEST-TRANSFORM-2-ACTUAL-EXAM-command-log.jsonl`

## Required Review Questions

1. Does the transformed `taskSet.contextBlocks` exactly match the reconstructed
   source context blocks?
2. Does the bundle validate as one TaskShellEngine task set rather than only as
   isolated tasks?
3. Do the six task cards cover source selection, formula building, step
   ordering, calculation work, source-chain construction, and threshold
   direction?
4. Do correct responses pass and adversarial/final-answer-only responses fail?
5. Does the rendered review lab show context before task cards across desktop
   light, mobile light, and mobile dark evidence?
6. Does the rendered lab avoid answer-threshold leakage and internal IDs in
   visible text and source-level detector shortcuts?
7. Are protected references, source-data, and Book 1 generated output unchanged?
8. Are omitted product requirements named as follow-up work instead of claimed?

## Stop Conditions

Stop with REVISE, FAIL, or PAUSE if any required output file is missing, source
context blocks do not exactly match the reconstruction, TaskShellEngine
validation is absent, any operation family is reduced to shallow recognition,
final-answer-only work can pass, the lab leaks answer amounts or internal IDs,
protected paths changed, or the bundle claims generated lesson output, product
adoption, target-equivalent proof, diagnostics, mastery, PV, Scale Gate, or
student/product use.

## Expected Output

Return a `# Lead Review Summary` using the strict sprint format, with
`Round: lead review round 1`, command-log evidence, blocking findings, flags,
ownership, and one concrete next action.
