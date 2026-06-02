# GATE-TASK-FAMILY-1 Usability-Agent Round 1

Generated: 2026-06-02

Status: REVISE returned by independent usability agents.

## Scope

Two independent agents tested whether the playable review lab could be
understood and completed without hidden expected-state lookup. The agents were
instructed not to edit files and to report observable usability friction rather
than private reasoning.

Lab under test:
`reports/review-gates/GATE-TASK-FAMILY-1-structured-choice-and-construction-task-family-review/gate-playable-task-family-lab.html`

## Agent A Result

Method: real browser/play interaction.

Findings:

- Most families had visible instructions and reachable `Controleer taak`
  feedback.
- `source_value_selection` was partly clear but the two-part action
  "click value plus assign role" was easy to miss.
- `sentence_builder` was not immediately clear. The agent chose the natural
  sequence `De prijs stijgt -> bij een hogere prijs -> de gevraagde
  hoeveelheid daalt`, but the lab expected `De prijs stijgt -> de gevraagde
  hoeveelheid daalt -> bij een hogere prijs`.
- The agent reached `11 / 12` first and needed committed checker evidence to
  identify the intended sentence sequence before reaching `12 / 12`.
- Compact repair controls `‹`, `›`, and `x` were visually terse.

Verdict: REVISE before direct-comment human review.

## Agent B Result

Method: real browser/play interaction.

Findings:

- All twelve tasks exposed visible action surfaces and `Controleer taak`
  buttons.
- Wrong feedback and correct feedback were visible.
- Mobile/dark screenshots were plausible for human review.
- Next action after a correct answer was not explicit enough; practical
  reviewer action was to continue/scroll, but feedback did not say that.
- Keyboard traversal after feedback focus was not sufficiently proved.
- Highest trial-and-error risk was matching, tile/cloze, ordering/builders,
  source role selection, and label placement.

Verdict: REVISE before direct-comment human review.

## Consolidated Blocking Findings

1. The sentence-builder expected sequence conflicted with a natural
   student-facing sentence order.
2. Source-value selection did not sufficiently state that both value selection
   and role selection were required.
3. Correct feedback did not expose a clear next task action.
4. The packet did not yet contain enough playable next-action/focus proof.

## Required Next Action

Repair the playable lab and proof before sending the gate packet for direct
human review comments. Do not carry these as ordinary flags while the reviewer
would still need hidden expected-state evidence to finish.
