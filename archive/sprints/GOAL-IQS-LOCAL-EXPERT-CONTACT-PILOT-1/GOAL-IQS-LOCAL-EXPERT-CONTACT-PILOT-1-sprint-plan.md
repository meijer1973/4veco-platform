# GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1 Sprint Plan

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
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

## Required Outputs

- `references/schemas/local-expert-contact-consent.schema.v1.json`
- `references/schemas/local-expert-response-intake.schema.v1.json`
- `docs/inspection-standards/local-expert-contact-pilot-contract.md`
- `docs/inspection-standards/england-local-expert-contact-text.md`
- `docs/inspection-standards/flanders-local-expert-contact-text.md`
- `reports/inspection-standards/local-expert-contact-pilot-plan.json`
- `reports/inspection-standards/local-expert-contact-pilot-plan.md`
- `reports/inspection-standards/england-local-expert-contact-pilot-packet.json`
- `reports/inspection-standards/england-local-expert-contact-pilot-packet.md`
- `reports/inspection-standards/flanders-local-expert-contact-pilot-packet.json`
- `reports/inspection-standards/flanders-local-expert-contact-pilot-packet.md`
- `reports/inspection-standards/local-expert-response-intake-report.json`
- `reports/inspection-standards/local-expert-response-intake-report.md`
- `reports/inspection-standards/local-expert-contact-pilot-simulation.json`
- `reports/inspection-standards/local-expert-contact-pilot-simulation.md`
- `reports/inspection-standards/local-expert-contact-pilot-decision.json`
- `reports/inspection-standards/local-expert-contact-pilot-decision.md`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/england-local-expert-contact-pilot-packet.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/flanders-local-expert-contact-pilot-packet.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/local-expert-response-intake-report.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/positive/local-expert-contact-pilot-decision.sample.json`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-sprint-plan.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-correction-log.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-validation-log.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-plan-architecture-lead-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-teacher-economics-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-legal-privacy-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-dutch-quality-inspection-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-accessibility-inclusion-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-final-lead-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-PILOT-1-closure-record.md`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/unauthorized-contact-dispatch.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/missing-consent-boundary.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/personal-data-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/legal-compliance-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/localized-output-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/out-of-scope-source.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/out-of-scope-question.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/missing-forbidden-disclaimer.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/hidden-uncertainty.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/jurisdiction-mismatch.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/personal-data-in-text.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/school-specific-evidence-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/england-whole-uk-overclaim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/flanders-all-belgium-overclaim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-pilot/negative/support-accommodation-sufficiency-overclaim.sample.json`

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
