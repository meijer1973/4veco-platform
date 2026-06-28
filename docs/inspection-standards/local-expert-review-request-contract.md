# Local Expert Review Request Contract

Sprint: `GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1/GOAL-IQS-LOCAL-EXPERT-REVIEW-REQUEST-PACKET-1-sprint-plan.md`
- Accepted input decision: `PROCEED_TO_LOCAL_EXPERT_REVIEW_REQUEST_PACKET` from `reports/inspection-standards/source-refresh-execution-pilot-decision.json`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Bind every source state to the accepted source-refresh execution pilot.
- Do not contact local experts or substitute local expert judgment.
- Ask only bounded interpretation questions about explicit official sources.
- Require strict expert response fields and citations.
- Forbid legal advice, compliance proof, approval, inspection-readiness, school evidence, student data, support/accommodation sufficiency, accessibility/legal sufficiency, product adoption, localized output, and exam-ready exercise generation.
- Preserve England-only and Flanders-only jurisdiction boundaries.
- Include blocks, does_not_block, and proof_required_to_close for carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.

## Request Fields

- `jurisdiction_id`
- `expert_profile_needed`
- `source_ids_in_scope`
- `source_states_from_refresh_pilot`
- `questions_allowed`
- `questions_forbidden`
- `expected_response_format`
- `uncertainty_handling`
- `citation_requirements`
- `authority_boundary`

## Response Fields

- `reviewer_role`
- `jurisdiction`
- `source_id`
- `source_state_seen`
- `question_id`
- `answer_type`
- `interpretation`
- `confidence`
- `uncertainty`
- `cited_source`
- `forbidden_claims_disclaimed`
- `does_not_authorize`
- `proof_required_to_use`

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
