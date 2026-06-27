# Belgium / Flanders Local Expert Source Gate

Status: complete_internal_gate_simulation

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-sprint-plan.md`

## Local Expert Role Contract

- `jurisdiction`: flanders
- `jurisdiction_label`: Belgium / Flanders
- `expert_role`: Local Flemish economics/curriculum/quality-framework source reviewer
- `allowed_review_scope`: Check official-source interpretation for Book 1 Chapters 1.2 and 1.3 gate planning.; Identify source gaps, terminology uncertainty, pathway/assessment boundaries, and local review questions.; Recommend whether a later bounded source-refresh packet is ready to be prepared.
- `forbidden_authority`: No official authority substitution.; No legal advice or compliance proof.; No inspectorate, awarding-body, OK-framework, or school approval claim.; No school implementation evidence or support/accommodation sufficiency claim.; No localized student, teacher, school, public, product-route, or Scale Gate output.
- `source_review_responsibility`: Review only the explicit official source allowlist and identify stale, replaced, unavailable, gap, or outside-scope states.
- `curriculum_assessment_review_responsibility`: Check Onderwijsdoelen, OK-framework, study-direction, school-network, and assessment-status boundaries without broadening to all Belgium.
- `language_terminology_review_responsibility`: Identify terminology that would need local review before any localized output; do not author localized paragraphs or exercises.
- `accessibility_inclusion_review_responsibility`: Identify accessibility/inclusion terminology and support-boundary questions; do not decide accommodations or support sufficiency.
- `legal_claim_boundary`: Expert review may inform internal source/curriculum interpretation but may not substitute for legal advice, compliance proof, approval, accreditation, OP0, PTA, summative validity, or inspection-readiness claims.
- `school_owned_evidence_boundary`: School-owned evidence, learner records, accommodations, support plans, implementation quality, and local assessment evidence remain outside this gate.
- `conflict_uncertainty_handling`: Record uncertainty as a blocker with affected source IDs, affected rows, owner next action, and proof required to close.
- `required_output_format`: Structured internal review record with source IDs, condition classification, affected rows, allowed inference, forbidden inference, blocks, does_not_block, and proof_required_to_close.

## Source Refresh Protocol

| Source | Role | Official URL | Access Date | Human Review Trigger | Forbidden Inference |
| --- | --- | --- | --- | --- | --- |
| `be-flanders-ok-framework` | quality framework boundary | https://www.vlaanderen.be/onderwijsprofessionals/organisatie-en-administratie/onderwijskwaliteit-en-toezicht/kwaliteitsvol-onderwijs-aanbieden/referentiekaders-voor-onderwijskwaliteit/referentiekader-voor-onderwijskwaliteit-het-ok | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not prove OK compliance. |
| `be-flanders-onderwijsdoelen-so3-doorstroom` | official curriculum goal route | https://onderwijsdoelen.be/modernisatie-so?onderwijsstructuur=SO_3DE_GRAAD | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not prove school/network curriculum or assessment fit. |
| `be-flanders-inspection-what-do-we-inspect` | inspection-method boundary | https://www.onderwijsinspectie.be/en/what-do-we-inspect | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not authorize evidence-pack deployment. |
| `be-flanders-education-quality-reference` | quality-framework source family | https://www.vlaanderen.be/onderwijsprofessionals/organisatie-en-administratie/onderwijskwaliteit-en-toezicht/kwaliteitsvol-onderwijs-aanbieden/referentiekaders-voor-onderwijskwaliteit | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not replace school-level evidence. |
| `be-flanders-onderwijsdoelen-modernisatie` | curriculum-goal route selector | https://onderwijsdoelen.be/modernisatie-so | 2026-06-22 | Any updated, replaced, unavailable, source-gap, or outside-scope condition requires human review before downstream use. | Does not authorize generic Flemish economics claims. |

## Jurisdiction-Specific Gate

- Onderwijsdoelen source boundary
- OK-framework source boundary
- study-direction / school-network constraints
- assessment-status boundary
- accessibility/inclusion and learner-support boundary
- Flanders-only / not all Belgium boundary
