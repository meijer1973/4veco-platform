# Local Expert Contact Pilot Simulation

Contact dispatched: `false`
No real responses stored: `true`

| case_id | expected_stop_code | proof_required_to_close |
|---|---|---|
| `unauthorized-contact-dispatch` | `STOP_UNAUTHORIZED_CONTACT_DISPATCH` | Checker must reject the negative fixture with the expected stop code. |
| `missing-consent-boundary` | `STOP_MISSING_CONSENT_BOUNDARY` | Checker must reject the negative fixture with the expected stop code. |
| `personal-data-response` | `STOP_PERSONAL_DATA_RESPONSE` | Checker must reject the negative fixture with the expected stop code. |
| `legal-compliance-claim` | `STOP_LEGAL_COMPLIANCE_CLAIM` | Checker must reject the negative fixture with the expected stop code. |
| `localized-output-response` | `STOP_LOCALIZED_OUTPUT_RESPONSE` | Checker must reject the negative fixture with the expected stop code. |
| `out-of-scope-source` | `STOP_SOURCE_OUT_OF_SCOPE` | Checker must reject the negative fixture with the expected stop code. |
| `out-of-scope-question` | `STOP_QUESTION_OUT_OF_SCOPE` | Checker must reject the negative fixture with the expected stop code. |
| `missing-forbidden-disclaimer` | `STOP_MISSING_FORBIDDEN_DISCLAIMER` | Checker must reject the negative fixture with the expected stop code. |
| `hidden-uncertainty` | `STOP_HIDDEN_UNCERTAINTY` | Checker must reject the negative fixture with the expected stop code. |
| `jurisdiction-mismatch` | `STOP_JURISDICTION_MISMATCH` | Checker must reject the negative fixture with the expected stop code. |
| `personal-data-in-text` | `STOP_PERSONAL_DATA_RESPONSE` | Checker must reject the negative fixture with the expected stop code. |
| `school-specific-evidence-response` | `STOP_SCHOOL_EVIDENCE_RESPONSE` | Checker must reject the negative fixture with the expected stop code. |
| `england-whole-uk-overclaim` | `STOP_WHOLE_UK_OVERCLAIM` | Checker must reject the negative fixture with the expected stop code. |
| `flanders-all-belgium-overclaim` | `STOP_ALL_BELGIUM_OVERCLAIM` | Checker must reject the negative fixture with the expected stop code. |
| `support-accommodation-sufficiency-overclaim` | `STOP_SUPPORT_ACCOMMODATION_OVERCLAIM` | Checker must reject the negative fixture with the expected stop code. |

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Negative simulations cover contact authorization, consent, data, claim, allowlist, uncertainty, and jurisdiction-boundary failures. | `core_requirement_met` | Nothing once checker and focused Jest prove refusal behavior. | Human review of the complete packet. | Checker and Jest PASS with all negative fixtures rejected. |
