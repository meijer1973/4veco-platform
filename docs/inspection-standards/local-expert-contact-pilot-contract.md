# Local Expert Contact Pilot Contract

Sprint: `GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-sprint-plan.md`
- Accepted input decision: `PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT` from `reports/inspection-standards/local-expert-review-request-decision.json`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Bind the sprint to the accepted `PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT` decision.
- Use only the accepted England/Flanders request packets as input.
- Define role-only expert profiles; do not select named people.
- Generate contact text and response-intake controls, but do not dispatch contact before exact-head owner authorization.
- Require explicit consent, recording, storage, withdrawal, and response-use boundaries.
- Intake only strict response-schema records and reject personal data, student data, and school-specific evidence.
- Refuse legal advice, compliance proof, approval, inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, product, Scale Gate, evidence-pack, and localized-output claims.
- Preserve England-only and Flanders-only jurisdiction boundaries.
- Include blocks, does_not_block, and proof_required_to_close for carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.

## Contact Fields

- `contact_id`
- `jurisdiction_id`
- `request_packet_id`
- `expert_profile_allowed`
- `source_ids_in_scope`
- `question_ids_in_scope`
- `contact_text`
- `consent_boundary`
- `storage_boundary`
- `response_schema_id`
- `does_not_authorize`
- `owner_authorization_required`
- `contact_dispatch_performed`

## Response Intake Fields

- `intake_id`
- `jurisdiction_id`
- `request_packet_id`
- `consent_confirmed`
- `response_received`
- `responses`
- `validation_status`
- `rejected_items`
- `does_not_authorize`
- `proof_required_to_use`

## Core-Requirement Checklist

| requirement | status | proof_required_to_close |
|---|---|---|
| Product end-state and original sprint/gate spec are cited. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Contact pilot is bound to accepted PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Allowed local expert profiles are role-only and contain no named people or personal data. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Contact text is generated only from the accepted England/Flanders request packets. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Consent, recording, storage, withdrawal, and response-use boundaries are explicit before any contact. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Response intake accepts only strict response-schema records plus consent metadata. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Personal data, student data, school-specific evidence, and support records are refused. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Legal advice, compliance proof, approval, inspection-readiness, school-evidence, support/accommodation/accessibility/individual-adjustment sufficiency, product, Scale Gate, and localized-output claims are refused. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| England remains England-only and Flanders remains Flanders-only. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Simulations and negative fixtures cover contact authorization, consent, personal data, claims, source/question allowlists, uncertainty, and jurisdiction overclaims. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| No real contact dispatch, expert substitution, or real response storage occurs before exact-head owner authorization. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Specialist reviews, final lead review, exact-head PR readiness, green CI, and human review remain required. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
