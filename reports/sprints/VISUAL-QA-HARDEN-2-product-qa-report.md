# VISUAL-QA-HARDEN-2 Product QA Report

Generated: 2026-06-05

## Status

PASS.

## Scope

This report consolidates visual/product QA for the repaired first-three Check
surface evidence. It prepares CHECK-SURFACE-PREGATE-1; it does not close or
retry the human gate.

## Hard-Fail Checks

| Check | Status | Meaning |
|---|---|---|
| short_graph_table_interaction | pass | 1.1.3 advisory short check uses graph/table task-shell interaction |
| short_context_and_workspace | pass | 1.1.3 advisory short check has source/table context and rendered graph workspace facts |
| short_feedback_and_next_action | pass | 1.1.3 advisory short check has targeted feedback and route advice |
| exit_split_workspace | pass | 1.1.3 exit ticket uses split source/task graph workspace |
| exit_graph_workspace_and_line | pass | 1.1.3 exit ticket graph remains in the active workspace |
| exit_source_scroll_preserves_task | pass | Source scrolling keeps task orientation visible for 1.1.3 exit ticket |
| exit_completion_language_held | pass | 1.1.3 exit ticket keeps completion language held after task success |
| landing_route_distinction | pass | First-three landing pages distinguish advisory and exit routes |
| screenshot_dom_facts | pass | Screenshot proof contains DOM/product inspection facts, not only file paths |
| mobile_dark_product_states | pass | Mobile and dark-mode product states are present for graph check, graph exit, and route copy |
| reports_go_beyond_label_hygiene | pass | Visual QA reports judge interaction/product quality beyond labels and files |
| student_experience_judgement_required | pass | Pre-gate lead review must include student-experience judgement |
| authority_boundary_preserved | pass | Authority boundary remains false across source proofs |

## Reset Findings Guarded

| Reset finding | Status | Guard checks |
|---|---|---|
| CSR1-F1 | guarded | short_graph_table_interaction |
| CSR1-F2 | guarded | short_context_and_workspace |
| CSR1-F3 | guarded | exit_split_workspace, exit_graph_workspace_and_line, exit_source_scroll_preserves_task |
| CSR1-F4 | guarded | screenshot_dom_facts, reports_go_beyond_label_hygiene |
| CSR1-F5 | guarded | student_experience_judgement_required |

## Student-Experience Judgement Requirement

Before the retry gate, CHECK-SURFACE-PREGATE-1 must judge whether a typical
4 vwo student can:

- see why Korte check and Exit ticket are different;
- use graph/table context for 1.1.3;
- draw or inspect the graph in the task workspace;
- receive targeted feedback instead of generic screenshot proof;
- know the next useful action.

## Authority Boundary

Product-route adoption, new completion language, diagnostics,
mastery/sequencing, PV, Scale Gate 1, and student/product use remain
unauthorized.

## Next Action

Proceed to CHECK-SURFACE-PREGATE-1 only after this report, proof JSON, and
checker pass and are pushed.
