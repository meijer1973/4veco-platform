# Local Expert Response Quarantine Report

Status: `quarantine_rules_ready_no_real_items`
Quarantined real items: `0`

| rule | expected_stop_code | proof_required_to_close |
|---|---|---|
| `unsupported-dispatch-claim` | `STOP_UNSUPPORTED_DISPATCH_PROOF` | Focused negative fixture and checker refusal PASS. |
| `material-sent-without-channel` | `STOP_UNSUPPORTED_DISPATCH_PROOF` | Focused negative fixture and checker refusal PASS. |
| `named-contact-recorded` | `STOP_PERSONAL_CONTACT_DETAILS` | Focused negative fixture and checker refusal PASS. |
| `response-without-consent` | `STOP_MISSING_CONSENT_BOUNDARY` | Focused negative fixture and checker refusal PASS. |
| `personal-data-response` | `STOP_PERSONAL_DATA_RESPONSE` | Focused negative fixture and checker refusal PASS. |
| `school-evidence-response` | `STOP_SCHOOL_EVIDENCE_RESPONSE` | Focused negative fixture and checker refusal PASS. |
| `legal-compliance-response` | `STOP_LEGAL_COMPLIANCE_CLAIM` | Focused negative fixture and checker refusal PASS. |
| `localized-output-response` | `STOP_LOCALIZED_OUTPUT_RESPONSE` | Focused negative fixture and checker refusal PASS. |
| `support-accommodation-sufficiency-response` | `STOP_SUPPORT_ACCOMMODATION_OVERCLAIM` | Focused negative fixture and checker refusal PASS. |
| `expert-as-official-authority` | `STOP_EXPERT_AS_OFFICIAL_AUTHORITY` | Focused negative fixture and checker refusal PASS. |
| `england-whole-uk-overclaim` | `STOP_WHOLE_UK_OVERCLAIM` | Focused negative fixture and checker refusal PASS. |
| `flanders-all-belgium-overclaim` | `STOP_ALL_BELGIUM_OVERCLAIM` | Focused negative fixture and checker refusal PASS. |
| `proceed-to-analysis-without-response` | `STOP_RESPONSE_ANALYSIS_WITHOUT_ACCEPTED_RESPONSE` | Focused negative fixture and checker refusal PASS. |

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Quarantine rules cover unsupported dispatch claims, consent, personal-data, school-evidence, jurisdiction, authority, localized-output, and sufficiency overclaim refusals. | `core_requirement_met` | Nothing for internal human review once exact-head readiness, CI, and branch protection pass. | Owner review of the complete owner dispatch/intake packet. | Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization. |
| Dispatch did not occur in the repository and no real response is present. | `scale_blocker` | Expert response analysis, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, school evidence, and official-authority claims. | Internal review of the honest dispatch/intake status and a later owner-run delivery step. | Owner delivery proof, consented schema-passing response records, quarantine PASS, specialist review, and separate human review. |
