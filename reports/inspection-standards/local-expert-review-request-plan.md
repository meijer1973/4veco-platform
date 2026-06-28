# Local Expert Review Request Plan

Selected source-refresh input decision: `PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET`

## Goal

Prepare source-bound England/Flanders request packets and a strict response schema without contacting experts.

## Workstreams

- `local_expert_request_scope`
- `england_expert_request_packet`
- `flanders_expert_request_packet`
- `expert_response_schema`
- `request_simulation_and_refusal_cases`

## Review Protocol

- Schema/architecture lead
- England authority/source reviewer
- Flanders authority/source reviewer
- Teacher/economics reviewer
- Legal/privacy reviewer
- Accessibility/inclusion reviewer
- Final lead reviewer

## Core-Requirement Checklist

| requirement | status | proof_required_to_close |
|---|---|---|
| Product end-state and original sprint/gate spec are cited. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Request packet is bound to accepted PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| No expert is contacted and no local expert judgment is substituted. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Request and response schemas define strict request and expert feedback records. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| England request packet covers DfE, Ofsted, AQA, SEND/accessibility, England-only, Book 1 1.2/1.3, and assessment-form boundaries. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Flanders request packet covers Onderwijsdoelen, OK, study-direction/school-network, assessment-status, Flanders-only, accessibility/support, Book 1 1.2/1.3, and interpretation-needed sources. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Every source state traces to the accepted source-refresh execution pilot. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Legal, compliance, approval, inspection-readiness, school evidence, student data, support/accommodation sufficiency, accessibility/legal sufficiency, and product adoption claims are forbidden. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Response schema forbids student data, personal data, school-specific evidence, legal/compliance conclusions, approval conclusions, inspection-readiness conclusions, and direct localized output. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Request simulation and negative fixtures cover legal advice, compliance proof, localized paragraphs, exam-ready exercises, school evidence, student data, support/accommodation/accessibility sufficiency overclaims, expert authority substitution, hidden uncertainty, England-to-UK, and Flanders-to-Belgium overclaims. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Exactly one allowed final decision is selected. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |
| Specialist reviews, final lead review, exact-head PR readiness, green CI, and human review remain required. | met | Checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, and human review. |

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Plan covers the full request packet rather than a partial draft. | `core_requirement_met` | Nothing for implementation once generated artifacts and validators pass. | Human review of the complete packet. | All required artifacts, simulations, specialist reviews, final lead review, PR readiness, and CI. |
