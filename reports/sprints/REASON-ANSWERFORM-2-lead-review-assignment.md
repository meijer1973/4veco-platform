# Sprint REASON-ANSWERFORM-2: Lead Review Assignment

Generated: 2026-06-02

Status: assigned; no lead-review verdict recorded yet.

## Reviewer Role

Act as strict lead reviewer for `REASON-ANSWERFORM-2`. Review the sprint as a
real quality gate, not as bookkeeping. Do not edit files.

The reviewer must decide whether the sprint can close, whether corrections are
required, or whether the sprint must pause because the planning-review sequence
was not completed before implementation.

## Protocol Variance To Check

The sprint plan required a planning review before implementation. Earlier
planning-review attempts returned no usable reviewer text or failed because of
agent usage/tool limits. Implementation and proof were prepared anyway, but the
sprint has not been closed.

The reviewer must explicitly answer:

- Is this late review acceptable as a protocol variance with a carried flag?
- Or must the sprint return `REVISE/PAUSE` because the pre-implementation
  planning-review artifact is missing?

Do not mark the sprint PASS unless this variance is explicitly addressed.

## Evidence To Inspect

- `reports/sprints/REASON-ANSWERFORM-2-plan.md`
- `reports/sprints/REASON-ANSWERFORM-2-baseline.md`
- `reports/sprints/REASON-ANSWERFORM-2-agent-review-attempts.md`
- `reports/sprints/REASON-ANSWERFORM-2-answer-form-scaffold-map.md`
- `reports/sprints/REASON-ANSWERFORM-2-mode-disposition.md`
- `reports/sprints/REASON-ANSWERFORM-2-playable-proof.md`
- `reports/sprints/REASON-ANSWERFORM-2-screenshot-manifest.md`
- `reports/json/reason-answerform2-proof.json`
- `reports/json/reason-answerform2-scaffold-map.json`
- `reports/sprints/REASON-ANSWERFORM-2-screenshots/`
- `reports/sprints/REASON-ANSWERFORM-2-diff-summary.md`
- `engines/reasoning-engine.js`
- `engines/reasoning-ui.js`
- `engines/reasoning.css`
- `engines/tests/reasoning-engine.test.js`
- `engines/tests/reasoning-ui.test.js`
- `build-scripts/sprints/check-reason-answerform2-route-output.js`
- `build-scripts/sprints/capture-reason-answerform2-screenshots.js`
- generated lesson diff in `../4veco-lessen`

## Required Review Questions

1. Are `A97`, `A98`, and `A99` kept as distinct answer-form scaffold lanes?
2. Is `A81` guarded as source-use modifier plus underlying answer form, never as
   a standalone complete answer form?
3. Does student-facing output avoid internal MTU codes, A-codes, generator IDs,
   PV labels, and protected-reference language?
4. Does student-facing output avoid target-equivalent proof, diagnostics,
   mastery, sequencing, summative, Scale Gate 1, or product-use claims?
5. Are mode 2 and mode 4 dispositions honest, with no false claim that they are
   fully unified shared-shell routes?
6. Is the generated lesson diff scoped to the sprint output map and produced by
   deploy rather than hand edits?
7. Are screenshots and playable proof sufficient for a later direct-comment
   human gate style?
8. Are there student-experience flags that must be carried forward, especially
   mobile route placement, compact movement controls, dense feedback, or visual
   flow-diagram limitations?
9. Are the tests/checkers meaningful enough to guard the sprint intent?
10. Does the missing pre-implementation planning-review artifact block sprint
    closure, or can it be carried as an explicit protocol variance?

## Verdict Options

- `PASS`: no corrections and no blocking protocol issue.
- `PASS WITH FLAGS`: closure acceptable only with named carried flags.
- `REVISE`: corrections required before closure.
- `PAUSE`: governance/protocol issue blocks closure until user or lead decision.
- `FAIL`: sprint direction is unsound.

## Output Required

Write a concise lead-review report suitable for
`reports/sprints/REASON-ANSWERFORM-2-lead-review-round1.md` with:

- verdict;
- findings ordered by severity;
- required corrections;
- carried flags;
- answer to the protocol variance question;
- validation commands or evidence inspected.
