# England Local Expert Source Gate

Status: complete_internal_gate_simulation

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-sprint-plan.md`

## Local Expert Role Contract

- `jurisdiction`: england
- `jurisdiction_label`: England
- `expert_role`: Local England economics/qualification/inspection source reviewer
- `allowed_review_scope`: Check official-source interpretation for Book 1 Chapters 1.2 and 1.3 gate planning.; Identify source gaps, terminology uncertainty, pathway/assessment boundaries, and local review questions.; Recommend whether a later bounded source-refresh packet is ready to be prepared.
- `forbidden_authority`: No official authority substitution.; No legal advice or compliance proof.; No inspectorate, awarding-body, OK-framework, or school approval claim.; No school implementation evidence or support/accommodation sufficiency claim.; No localized student, teacher, school, public, product-route, or Scale Gate output.
- `source_review_responsibility`: Review only the explicit official source allowlist and identify stale, replaced, unavailable, gap, or outside-scope states.
- `curriculum_assessment_review_responsibility`: Check DfE subject-content and selected AQA representative boundaries without broadening to all awarding bodies or the whole UK.
- `language_terminology_review_responsibility`: Identify terminology that would need local review before any localized output; do not author localized paragraphs or exercises.
- `accessibility_inclusion_review_responsibility`: Identify accessibility/inclusion terminology and support-boundary questions; do not decide accommodations or support sufficiency.
- `legal_claim_boundary`: Expert review may inform internal source/curriculum interpretation but may not substitute for legal advice, compliance proof, approval, accreditation, OP0, PTA, summative validity, or inspection-readiness claims.
- `school_owned_evidence_boundary`: School-owned evidence, learner records, accommodations, support plans, implementation quality, and local assessment evidence remain outside this gate.
- `conflict_uncertainty_handling`: Record uncertainty as a blocker with affected source IDs, affected rows, owner next action, and proof required to close.
- `required_output_format`: Structured internal review record with source IDs, condition classification, affected rows, allowed inference, forbidden inference, blocks, does_not_block, and proof_required_to_close.

## Source Refresh Protocol

| Source | Role | Official URL | Access Date | Human Review Trigger | Forbidden Inference |
| --- | --- | --- | --- | --- | --- |
| `england-ofsted-eif-2025` | inspection/evaluation boundary | https://www.gov.uk/government/publications/education-inspection-framework-eif/education-inspection-framework-for-use-from-november-2025 | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not approve product output or prove inspection readiness. |
| `england-ofsted-operating-guide-2025` | inspection evidence-gathering boundary | https://www.gov.uk/government/publications/school-inspection-toolkit-operating-guide-and-information/school-inspection-operating-guide-for-inspectors-for-use-from-november-2025 | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not authorize evidence-pack generation. |
| `england-dfe-a-level-economics-content` | qualification subject-content boundary | https://www.gov.uk/government/publications/gce-as-and-a-level-for-economics | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not approve an exam-board specification or 4veco tasks. |
| `england-aqa-7136-subject-content` | representative awarding-body subject content | https://www.aqa.org.uk/subjects/economics/a-level/economics-7136/specification/subject-content | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not represent all awarding bodies or all England. |
| `england-aqa-7136-scheme-assessment` | assessment objective and paper-form boundary | https://www.aqa.org.uk/subjects/economics/a-level/economics-7136/specification/scheme-of-assessment | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not generate AQA exam questions. |
| `england-aqa-economics-command-words` | representative command-word meanings | https://www.aqa.org.uk/resources/economics/as-and-a-level/economics/teach/command-words | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not authorize student-facing assessment output. |
| `england-aqa-7136-assessment-resources` | representative specimen paper and mark-scheme source layer | https://www.aqa.org.uk/subjects/economics/a-level/economics-7136/assessment-resources | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not copy or generate protected assessment material. |
| `england-send-code-practice` | SEND/accessibility terminology boundary | https://www.gov.uk/government/publications/send-code-of-practice-0-to-25 | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not prove accessibility compliance or school support sufficiency. |

## Jurisdiction-Specific Gate

- DfE subject content
- Ofsted inspection/evaluation sources
- selected awarding-body source boundaries
- SEND/accessibility terminology
- England-only / not whole UK boundary
