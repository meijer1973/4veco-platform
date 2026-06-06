# CHECK-SURFACE-PREGATE-1 Student-Experience Review

Generated: 2026-06-05

## Verdict

PASS WITH FLAGS for retry-packet preparation.

This review answers the product-end-state question left open by
`VISUAL-QA-HARDEN-2`: can a typical 4 vwo student orient, act, receive useful feedback, and know the next action on the repaired first-three Check surfaces?

## Student Walkthrough Judgement

| Student question | Judgement | Evidence |
|---|---|---|
| Do I know why `Korte check` and `Exit ticket` are different? | pass | Landing cards label `advies` and `eindcheck`, and the action text differs. |
| Can I use graph/table context in the `1.1.3` short check? | pass | Short check shows source text, table, graph workspace, axis selectors, table-derived ticks, and graph/table tasks. |
| Is the short check still advisory instead of target proof? | pass | Success routes to next practice; no new target-equivalent completion language is shown. |
| Can I keep the task in view while inspecting source material in the exit ticket? | pass | Desktop source-scrolled proof keeps the task pane visible while the source pane scrolls. |
| Can I draw or inspect the graph in the active task workspace? | pass | The graph line appears in the same workspace after selected points and line confirmation. |
| Do wrong answers produce useful feedback? | pass | Wrong states give graph-axis/table-point feedback rather than generic completion failure. |
| Do correct paths tell me what to do next? | pass | Short-check success points to graph/table practice routes; exit-ticket success gives task-specific feedback while completion language remains held. |
| Can I review it on mobile and dark mode? | pass with flag | Mobile/dark screenshots exist and are readable, though the mobile surface is naturally long and should remain a reviewer focus in the retry packet. |

## Product-End-State Fit

The repaired surfaces now support a visible route from current readiness toward
target-exercise readiness:

- the landing page separates advice from end check;
- the short check lets the student test the graph/table procedure in compact
  form and route practice;
- the exit ticket lets the student work with source, table, graph, and
  calculation in one reviewable flow;
- feedback points to graph/table practice rather than only saying whether the
  answer is correct.

## Remaining Flags

1. This is a pre-gate student-experience review, not the human retry-gate
   decision.
2. `1.1.1` and `1.1.3` target-equivalent completion language must remain held
   until the retry gate explicitly decides otherwise.
3. The retry packet should still ask a human reviewer whether the mobile graph
   work is comfortable enough and whether the advisory route copy remains clear
   across all three paragraphs.
4. No product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate
   1, or student/product use is authorized.

## Operational Next Action

Prepare `GATE-CHECK-SHORT-EXIT-2-RETRY` as a direct human review packet after
this pregate is validated, committed, and pushed.
