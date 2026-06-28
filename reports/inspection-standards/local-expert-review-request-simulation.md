# Local Expert Review Request Simulation

No requests sent: `true`

| case_id | expected_stop_code | proof_required_to_close |
|---|---|---|
| `legal-advice-request` | `STOP_LEGAL_ADVICE_REQUEST` | Checker must reject the negative fixture with the expected stop code. |
| `compliance-proof-request` | `STOP_COMPLIANCE_PROOF_REQUEST` | Checker must reject the negative fixture with the expected stop code. |
| `localized-paragraph-generation` | `STOP_LOCALIZED_OUTPUT_REQUEST` | Checker must reject the negative fixture with the expected stop code. |
| `exam-ready-exercises` | `STOP_EXAM_READY_EXERCISE_REQUEST` | Checker must reject the negative fixture with the expected stop code. |
| `school-owned-evidence` | `STOP_SCHOOL_EVIDENCE_REQUEST` | Checker must reject the negative fixture with the expected stop code. |
| `student-data` | `STOP_STUDENT_DATA_REQUEST` | Checker must reject the negative fixture with the expected stop code. |
| `support-accommodation-sufficiency-overclaim` | `STOP_SUPPORT_ACCOMMODATION_OVERCLAIM` | Checker must reject the negative fixture with the expected stop code. |
| `expert-as-official-authority` | `STOP_EXPERT_AUTHORITY_SUBSTITUTION` | Checker must reject the negative fixture with the expected stop code. |
| `hidden-source-uncertainty` | `STOP_HIDDEN_SOURCE_UNCERTAINTY` | Checker must reject the negative fixture with the expected stop code. |
| `england-to-uk-generalization` | `STOP_WHOLE_UK_OVERCLAIM` | Checker must reject the negative fixture with the expected stop code. |
| `flanders-to-belgium-generalization` | `STOP_ALL_BELGIUM_OVERCLAIM` | Checker must reject the negative fixture with the expected stop code. |

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Negative request simulations cover all required forbidden cases. | `core_requirement_met` | Nothing once checker and focused Jest prove refusal behavior. | Human review of the complete packet. | Checker and Jest PASS with all negative fixtures rejected. |
