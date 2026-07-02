# England Local Expert Contact Text

Contact ID: `england-local-expert-contact-stage`
Request packet: `england-local-expert-review-request-packet`

## Contact Text

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

## Consent Boundary

- Participation is voluntary. The reviewer may decline any question and may answer only within the England source scope.
- No audio, video, transcript, meeting note, or identifiable personal metadata may be stored by this repository packet. Only schema-shaped, reviewer-approved written responses may be recorded after owner authorization.
- Store only internal response-intake JSON/Markdown that passes the strict schema and contains no personal data, student data, school-specific evidence, or named-person details.
- Do not include names, email addresses, phone numbers, institutional identifiers, student records, support records, or any personal data in the response.
- The reviewer may withdraw or decline; a withdrawal produces no substitute answer and no inferred local judgment.
- Responses are internal interpretive input for later human review only; they do not authorize localized output, product use, school-facing use, legal/compliance claims, inspection-readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or individual adjustment sufficiency.

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| England contact text is ready only for owner payload-authorized dispatch. | `core_requirement_met` | Nothing for human review once checker, specialists, final lead, CI, branch protection, and PR readiness pass. | Human review of this internal contact-stage packet. | Checker PASS, specialist PASS, final lead PASS, exact-head readiness, green CI, branch protection ok:true, and owner authorization. |
| Contact dispatch and real response storage remain blocked until owner authorization. | `human_authorization_required` | Sending contact text, storing real expert response records, or treating expert feedback as authority. | Reviewing the internal contact-stage packet. | Owner payload authorization that names reviewed_payload_head_sha and current green checks. |
