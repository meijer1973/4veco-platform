# GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1 Sprint Plan

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-sprint-plan.md`
- Accepted input decision: `READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE` from `reports/inspection-standards/local-expert-contact-pilot-decision.json`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Bind the stage to the merged contact-stage packet decision `READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE`.
- Create England and Flanders dispatch records without named expert selection or personal contact details.
- Use only the approved contact text and request packet as the dispatch payload.
- Run legal/privacy and jurisdiction-source review before any dispatch-ready conclusion.
- Store no real expert response unless it passes the approved response-intake schema and consent boundary.
- Quarantine out-of-scope, personal-data, school-evidence, forbidden-claim, localized-output, or authority-overclaim responses.
- Do not claim external dispatch from the repository when no approved delivery channel is configured.
- Preserve all downstream blocks for localized output, product/school/public use, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, school evidence, and official-authority claims.
- Include blocks, does_not_block, and proof_required_to_close for carried issues.
- PASS WITH FLAGS may not carry a missing core requirement.

## Required Outputs

- `reports/inspection-standards/local-expert-contact-stage-plan.json`
- `reports/inspection-standards/local-expert-contact-stage-plan.md`
- `reports/inspection-standards/england-local-expert-contact-dispatch-record.json`
- `reports/inspection-standards/england-local-expert-contact-dispatch-record.md`
- `reports/inspection-standards/flanders-local-expert-contact-dispatch-record.json`
- `reports/inspection-standards/flanders-local-expert-contact-dispatch-record.md`
- `reports/inspection-standards/local-expert-contact-stage-response-intake-report.json`
- `reports/inspection-standards/local-expert-contact-stage-response-intake-report.md`
- `reports/inspection-standards/local-expert-contact-stage-quarantine-report.json`
- `reports/inspection-standards/local-expert-contact-stage-quarantine-report.md`
- `reports/inspection-standards/local-expert-contact-stage-decision.json`
- `reports/inspection-standards/local-expert-contact-stage-decision.md`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/england-local-expert-contact-dispatch-record.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/flanders-local-expert-contact-dispatch-record.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/local-expert-contact-stage-response-intake-report.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/positive/local-expert-contact-stage-decision.sample.json`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-sprint-plan.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-correction-log.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-validation-log.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-lead-architecture-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-legal-privacy-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-england-jurisdiction-source-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-flanders-jurisdiction-source-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-teacher-economics-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-accessibility-inclusion-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-final-lead-review.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1/GOAL-IQS-LOCAL-EXPERT-CONTACT-STAGE-1-closure-record.md`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/named-expert-selected.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/personal-contact-details.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/missing-legal-privacy-review.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/missing-jurisdiction-source-review.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/contact-text-drift.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/forbidden-attachment.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/unauthorized-external-dispatch.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/response-without-consent.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/personal-data-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/school-evidence-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/legal-compliance-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/localized-output-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/support-accommodation-sufficiency-response.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/expert-as-official-authority.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/england-whole-uk-overclaim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-contact-stage/negative/flanders-all-belgium-overclaim.sample.json`

## Core-Requirement Checklist

| requirement | status | proof_required_to_close |
|---|---|---|
| Product end-state and original sprint/gate spec are cited. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Stage is bound to the merged `READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE` packet. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Thread owner authorization for this stage is recorded with decision scope and limits. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| England and Flanders contact candidates are role-only; no named people or personal contact details are selected or stored. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Dispatch payload uses only the approved contact text and accepted request packet. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Legal/privacy pre-dispatch review passes before any dispatch state can be considered ready. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| England/Flanders jurisdiction-source reviews pass before dispatch state can be considered ready. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Any response must pass the approved strict response-intake schema. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Out-of-scope, personal-data, school-evidence, forbidden-claim, localized-output, or authority-overclaim responses are quarantined. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Repository artifacts do not claim an external send, because no delivery channel is configured in this workspace. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Localized output, student/product use, product route, Scale Gate, diagnostics/mastery/PV, legal/compliance/inspection-readiness, support/accommodation/accessibility/individual-adjustment sufficiency, and school evidence remain blocked. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
| Specialist reviews, final lead review, exact-head PR readiness, green CI, branch protection ok:true, and human review remain required. | met | Generator currentness PASS, stage checker PASS, focused Jest PASS, specialist review PASS, final lead PASS, exact-head PR readiness, green CI, branch protection ok:true, and human review. |
