# England Local Expert Contact Dispatch Record

Dispatch ID: `england-local-expert-contact-dispatch`
Status: `ready_for_owner_manual_dispatch_no_repository_delivery_channel`
External dispatch performed: `false`

## Candidate

- Candidate mode: `role_only_profile`
- Named expert selected: `false`
- Personal contact details recorded: `false`
- Role profile: England economics qualification and inspection/source-boundary reviewer familiar with DfE A level economics subject content, Ofsted school inspection sources, representative AQA Economics 7136 specification/assessment surfaces, and SEND/accessibility terminology.

## Dispatch Payload

- `approved_contact_text`: `reports/inspection-standards/england-local-expert-contact-pilot-packet.json`
- `accepted_request_packet`: `reports/inspection-standards/england-local-expert-review-request-packet.json`

## Pre-Dispatch Reviews

- `legal_privacy`: PASS; proof_required_to_close: Legal/privacy subagent PASS, strict schema PASS, no-personal-data candidate record, and final lead PASS.
- `england_jurisdiction_source`: PASS; proof_required_to_close: England jurisdiction-source subagent PASS, checker source/question equality proof, and final lead PASS.

## Approved Contact Text

```text
Internal-only England source-bound review request.

Before answering, please confirm voluntary participation and the response-use boundary below.
Participation is voluntary. The reviewer may decline any question and may answer only within the England source scope.
Do not include names, email addresses, phone numbers, institutional identifiers, student records, support records, or any personal data in the response.
Responses are internal interpretive input for later human review only; they do not authorize localized output, product use, school-facing use, legal/compliance claims, inspection-readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or individual adjustment sufficiency.

Please answer only the questions below, only against the listed official source IDs, and use the required response fields.
- england-q-dfe-content: Interpret whether Book 1 Chapter 1.2 and 1.3 economics concept placement is consistent with the DfE A level economics subject-content boundary.
- england-q-ofsted-eif: Interpret the Ofsted inspection/evaluation boundary that should remain visible if later internal overlay planning references quality or inspection language.
- england-q-ofsted-operating-guide: Interpret the evidence-gathering boundary in the Ofsted operating-guide source for internal blocker display only.
- england-q-aqa-subject: Interpret representative AQA 7136 subject-content boundaries that may affect Book 1 1.2/1.3 concept mapping.
- england-q-aqa-assessment: Interpret assessment-form, command-word, and resource-index implications that should be retained as internal constraints.
- england-q-send-accessibility: Interpret SEND/accessibility terminology that should frame support and accommodation boundary questions.
- england-q-england-only: Identify any England-only phrasing needed to prevent whole-UK or all-awarding-body overclaims.
- england-q-book1-placement: Flag any Book 1 1.2/1.3 concept-placement uncertainty that a later internal transformation sprint must preserve.

Required response fields:
- reviewer_role
- jurisdiction
- source_id
- source_state_seen
- question_id
- answer_type
- interpretation
- confidence
- uncertainty
- cited_source
- forbidden_claims_disclaimed
- does_not_authorize
- proof_required_to_use

Do not provide legal advice, compliance proof, approval, inspection-readiness, school evidence, school-specific evidence, student data, personal data, support/accommodation/accessibility/individual-adjustment sufficiency claims, localized output, exam-ready exercise generation, product authority, Scale Gate authority, or public/teacher/school-facing output.
```

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| England dispatch record is role-only, source-bound, and ready for owner manual dispatch if the owner uses an approved no-personal-data delivery path. | `core_requirement_met` | Nothing for internal human review once exact-head readiness, CI, and branch protection pass. | Owner review of the complete contact-stage packet. | Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization. |
| External dispatch and downstream use remain governed. | `scale_blocker` | Named expert selection, personal/student/school data processing, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, and official-authority claims. | Internal record review and later owner manual dispatch using only the approved payload. | Separate owner-controlled delivery proof and later response-intake human review. |
