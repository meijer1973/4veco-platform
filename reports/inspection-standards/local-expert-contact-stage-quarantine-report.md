# Local Expert Contact Stage Quarantine Report

Status: `quarantine_rules_ready_no_real_items`
Quarantined real items: `0`

| rule | expected_stop_code | proof_required_to_close |
|---|---|---|
| `named-expert-selected` | `STOP_NAMED_EXPERT_SELECTION` | Focused negative fixture and checker refusal PASS. |
| `personal-contact-details` | `STOP_PERSONAL_CONTACT_DETAILS` | Focused negative fixture and checker refusal PASS. |
| `missing-legal-privacy-review` | `STOP_MISSING_LEGAL_PRIVACY_REVIEW` | Focused negative fixture and checker refusal PASS. |
| `missing-jurisdiction-source-review` | `STOP_MISSING_JURISDICTION_SOURCE_REVIEW` | Focused negative fixture and checker refusal PASS. |
| `contact-text-drift` | `STOP_CONTACT_TEXT_DRIFT` | Focused negative fixture and checker refusal PASS. |
| `forbidden-attachment` | `STOP_FORBIDDEN_ATTACHMENT` | Focused negative fixture and checker refusal PASS. |
| `unauthorized-external-dispatch` | `STOP_UNAUTHORIZED_EXTERNAL_DISPATCH` | Focused negative fixture and checker refusal PASS. |
| `response-without-consent` | `STOP_MISSING_CONSENT_BOUNDARY` | Focused negative fixture and checker refusal PASS. |
| `personal-data-response` | `STOP_PERSONAL_DATA_RESPONSE` | Focused negative fixture and checker refusal PASS. |
| `school-evidence-response` | `STOP_SCHOOL_EVIDENCE_RESPONSE` | Focused negative fixture and checker refusal PASS. |
| `legal-compliance-response` | `STOP_LEGAL_COMPLIANCE_CLAIM` | Focused negative fixture and checker refusal PASS. |
| `localized-output-response` | `STOP_LOCALIZED_OUTPUT_RESPONSE` | Focused negative fixture and checker refusal PASS. |
| `support-accommodation-sufficiency-response` | `STOP_SUPPORT_ACCOMMODATION_OVERCLAIM` | Focused negative fixture and checker refusal PASS. |
| `expert-as-official-authority` | `STOP_EXPERT_AS_OFFICIAL_AUTHORITY` | Focused negative fixture and checker refusal PASS. |
| `england-whole-uk-overclaim` | `STOP_WHOLE_UK_OVERCLAIM` | Focused negative fixture and checker refusal PASS. |
| `flanders-all-belgium-overclaim` | `STOP_ALL_BELGIUM_OVERCLAIM` | Focused negative fixture and checker refusal PASS. |

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Quarantine rules cover dispatch, consent, personal-data, school-evidence, source/question, jurisdiction, authority, localized-output, and sufficiency overclaim refusals. | `core_requirement_met` | Nothing for internal human review once exact-head readiness, CI, and branch protection pass. | Owner review of the complete contact-stage packet. | Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization. |
| External dispatch and downstream use remain governed. | `scale_blocker` | Named expert selection, personal/student/school data processing, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, and official-authority claims. | Internal record review and later owner manual dispatch using only the approved payload. | Separate owner-controlled delivery proof and later response-intake human review. |
