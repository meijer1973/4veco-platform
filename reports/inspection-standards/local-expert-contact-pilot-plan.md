# Local Expert Contact Pilot Plan

Accepted input decision: `PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT`

## Goal

Prepare a governed local expert contact-stage pilot packet from the accepted request packets, without dispatching contact before owner payload authorization.

## Workstreams

- `role_only_expert_profiles`
- `contact_text_from_accepted_packets`
- `consent_recording_storage_boundary`
- `strict_response_intake_schema`
- `simulated_positive_and_negative_intake_cases`
- `specialist_reviews_and_final_lead_review`

## Review Protocol

- Plan/architecture lead reviewer
- Teacher/economics reviewer
- Legal/privacy reviewer
- Dutch quality-inspection reviewer
- Accessibility/inclusion reviewer
- Final lead reviewer

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
| No real contact dispatch, expert substitution, or real response storage occurs before owner payload authorization. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Specialist reviews, final lead review, exact-head PR readiness, green CI, and human review remain required. | met | Generator currentness PASS, checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Plan covers contact-stage controls, not localization or product use. | `core_requirement_met` | Nothing for implementation once generated artifacts and validators pass. | Human review of the complete packet. | All required artifacts, simulations, specialist reviews, final lead review, PR readiness, branch protection ok:true, and CI. |
