# MTU-H7 Operation Blocker Matrix 1

Status: `hold_matrix_complete_for_human_review`

| Blocker | Split | Question | Required | Forbidden | Route | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| H7-BLOCKER-CANONICAL-NIVELLERING-POSITIVE-COUNTERPART | diagnostic | toon_met_een_berekening_aan | H08, A38, A81, A96 | A15 | HOLD_FOR_CANONICAL_MTU_GOVERNANCE | do_not_close_from_existing_H08_without_human_canonical_decision |
| H7-BLOCKER-OP-ULTIMATUM-RESIDUAL-PAYOFF | diagnostic | bereken | A81, A96 | F12 | HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE | operation_registry_candidate_needed |
| H7-BLOCKER-OP-ULTIMATUM-MARGIN-PAYOFF | diagnostic | bereken | A81, A96 | F12 | HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE | operation_registry_candidate_needed |
| H7-BLOCKER-OP-GAME-TREE-NASH | diagnostic | leg_uit_dat | F12, A81, A97 | A15, F04 | HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE | operation_registry_candidate_needed |
| H7-BLOCKER-PROCEDURE-INSURANCE-COST-BENEFIT | diagnostic | bereken | A38, G12, A81, A96 | A15 | HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE | procedure_or_operation_registry_candidate_needed |
| H7-BLOCKER-PROCEDURE-IS-MB-GA-SEQUENCE-FIRST | diagnostic | teken | I07, A42, A40, A81 | A45 | HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE | procedure_or_operation_registry_candidate_needed |
| H7-BLOCKER-PROCEDURE-IS-MB-GA-SEQUENCE-SECOND | diagnostic | teken | I07, A42, A40, A81 | A45 | HOLD_FOR_PROTECTED_OPERATION_REGISTRY_GOVERNANCE | procedure_or_operation_registry_candidate_needed |
| H7-BLOCKER-ANSWER-FORM-GO-LINE-SUBSIDY | diagnostic | teken | A27, A42, A40, A89, A81 | A15 | READY_FOR_HUMAN_H7_CLOSURE_REVIEW | reviewed_equivalent_candidate_prepared_not_applied |
| H7-BLOCKER-ANSWER-FORM-MO-LINE-SUBSIDY | diagnostic | teken | A27, A42, A40, A90, A81 | A15 | READY_FOR_HUMAN_H7_CLOSURE_REVIEW | reviewed_equivalent_candidate_prepared_not_applied |
| H7-BLOCKER-GRAPH-Q5-TOTAL-SUBSIDY-SHADING | locked_holdout | arceer | A27, A40, A58, A81 | A15, A45 | HOLD_FOR_GRAPH_SOURCE_GOVERNANCE | source_graph_adjudication_prepared_not_applied |
