# Flanders Local Expert Contact Dispatch Record

Dispatch ID: `flanders-local-expert-contact-dispatch`
Status: `ready_for_owner_manual_dispatch_no_repository_delivery_channel`
External dispatch performed: `false`

## Candidate

- Candidate mode: `role_only_profile`
- Named expert selected: `false`
- Personal contact details recorded: `false`
- Role profile: Flemish economics/curriculum and education-quality reviewer familiar with Onderwijsdoelen, the OK framework, Onderwijsinspectie Vlaanderen source boundaries, study-direction/school-network distinctions, and accessibility/support terminology.

## Dispatch Payload

- `approved_contact_text`: `reports/inspection-standards/flanders-local-expert-contact-pilot-packet.json`
- `accepted_request_packet`: `reports/inspection-standards/flanders-local-expert-review-request-packet.json`

## Pre-Dispatch Reviews

- `legal_privacy`: PASS; proof_required_to_close: Legal/privacy subagent PASS, strict schema PASS, no-personal-data candidate record, and final lead PASS.
- `flanders_jurisdiction_source`: PASS; proof_required_to_close: Flanders jurisdiction-source subagent PASS, checker source/question equality proof, and final lead PASS.

## Approved Contact Text

```text
Internal-only Flanders source-bound review request.

Before answering, please confirm voluntary participation and the response-use boundary below.
Participation is voluntary. The reviewer may decline any question and may answer only within the Flanders source scope.
Do not include names, email addresses, phone numbers, institutional identifiers, student records, support records, or any personal data in the response.
Responses are internal interpretive input for later human review only; they do not authorize localized output, product use, school-facing use, legal/compliance claims, inspection-readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or individual adjustment sufficiency.

Please answer only the questions below, only against the listed official source IDs, and use the required response fields.
- flanders-q-onderwijsdoelen-route: Interpret the official Onderwijsdoelen SO_3DE_GRAAD route for Book 1 1.2/1.3 economics concept placement.
- flanders-q-modernisatie-selector: Interpret which route choices or goal-family labels require explicit human review before any internal overlay transformation.
- flanders-q-ok-framework: Interpret the OK-framework boundary and wording that should remain visible in internal quality-language notes.
- flanders-q-inspection-boundary: Interpret the Onderwijsinspectie boundary for quality development, quality areas, and teaching-learning practice language.
- flanders-q-study-direction-network: Identify study-direction, school-network, or pathway implications that must remain unresolved until local review.
- flanders-q-assessment-status: Clarify assessment-status boundaries relevant to Book 1 1.2/1.3 without producing assessment items.
- flanders-q-accessibility-support: Interpret accessibility/support terminology that should remain non-sufficiency language.
- flanders-q-flanders-only: Identify wording needed to keep the packet Flanders-only and not all Belgium.

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
| Flanders dispatch record is role-only, source-bound, and ready for owner manual dispatch if the owner uses an approved no-personal-data delivery path. | `core_requirement_met` | Nothing for internal human review once exact-head readiness, CI, and branch protection pass. | Owner review of the complete contact-stage packet. | Exact-head PR readiness, green CI, branch protection ok:true, and owner authorization. |
| External dispatch and downstream use remain governed. | `scale_blocker` | Named expert selection, personal/student/school data processing, localized output, product/school/public use, evidence packs, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility sufficiency, school evidence, and official-authority claims. | Internal record review and later owner manual dispatch using only the approved payload. | Separate owner-controlled delivery proof and later response-intake human review. |
