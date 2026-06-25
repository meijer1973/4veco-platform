# A96-CALCULATION-ANSWER-FORM-HARDENING-AND-SCALE-GATE-1-REREVIEW-1 Result

Date: 2026-06-25

Verdict: READY_FOR_HUMAN_SCALE_GATE_1_REVIEW after machine validation, specialist review, rendered-proof repair, and lead review.

## What Changed

- Rebasing was performed from updated `main` for the platform branch; the lesson branch was already current.
- `1.1.2` A96 substitution placeholders were changed from answer-bearing values to neutral instructions.
- The Golden layout and task shell now reject contradictory or non-directional conclusion text for the A96 task.
- Canonical A96 negative fixtures were expanded and exercised through the production evaluator path.
- The policy checker now treats numeric expected substitution values as answer-giving placeholders.
- The affected lesson output was regenerated through the normal deploy path.
- The first-three rendered Scale proof was recaptured with dedicated A96 states, including mobile, dark mode, negative feedback, correct feedback, completion-held state, and side-by-side exemplar comparison. The checker now requires A96 mobile form and feedback states to be visible in the screenshot viewport.

## Core Requirement Checklist

| Requirement | Status | Evidence |
|---|---|---|
| Product end-state cited | met | `../4veco-lessen/specifications/product-end-state.md` |
| Original sprint/gate spec cited | met | Prior A96 and Scale proof packets |
| Neutral A96 placeholders | met | `source-data/book-1/exit-ticket/1.1.2-exit-ticket.json` |
| Production evaluator rejects canonical negatives | met | Engine and layout tests |
| Contradictory conclusion text rejected | met | `expected.conclusion.rejectText` and `rejectPatterns` |
| Answer-giving substitution placeholder guard | met | `references/ui/golden-exercise-checker-fixtures.json` |
| Generated lesson output refreshed | met | Lesson PR #36 generated output |
| Dedicated rendered A96 proof captured | met | `reports/json/scale-proof-3p-readiness-product-path-proof-1-proof.json` |
| Completion language remains held | met | `completionLanguageEligible:false` in refreshed proof |
| No downstream authority claimed | met | Proof authority flags remain false |
| No missing core requirement carried under PASS WITH FLAGS | met | Lead route is human review, not PASS WITH FLAGS |

## Boundary

This packet repairs the A96 blocker and prepares a refreshed first-three rendered product-path proof for human review. It does not authorize product-route adoption, diagnostics, mastery/sequencing, PV, summative use, Scale Gate 1 closure, broad product use, student/product use, or target-equivalent completion language.

## Next Step

Run PR Readiness Reviewer on the exact remote heads. If it returns MARK_READY, mark PR #148 and lesson PR #36 ready. Merge still requires explicit owner authorization tied to those exact heads.
