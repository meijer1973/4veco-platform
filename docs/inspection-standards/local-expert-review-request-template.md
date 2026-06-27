# Local Expert Review Request Template

Template ID: `local-expert-review-request-template`

## Purpose

Later owner-authorized expert interpretation of explicit official-source rows only.

## Allowed Questions

- Does the official-source interpretation match local curriculum, assessment, inspection, or quality-framework terminology?
- Which terms, pathway labels, source roles, or uncertainty notes need human review before a source-refresh execution pilot can close?
- Which source gaps should be escalated to the human owner as candidate_source_requires_owner_approval?
- Could a source change affect Book 1 Chapter 1.2 or 1.3 mappings, without producing localized content?

## Required Response Fields

- `jurisdiction_id`
- `reviewer_role`
- `source_ids_reviewed`
- `interpretation_notes`
- `terminology_notes`
- `curriculum_or_assessment_boundary_notes`
- `accessibility_or_support_boundary_notes`
- `uncertainties`
- `candidate_source_requires_owner_approval`
- `forbidden_claims_acknowledged`

## Forbidden Expert Claims

- legal advice
- compliance claims
- approval claims
- inspection-readiness claims
- school-evidence claims
- student/product-use claims
- support/accommodation sufficiency claims
- accessibility/legal sufficiency claims
- personal-data processing
- official-source substitution

## Stop Conditions

- Expert suggests a non-official source as authority.
- Expert response makes a legal, compliance, approval, school-evidence, inspection-readiness, support-sufficiency, accommodation-sufficiency, student/product-use, or personal-data claim.
- Expert asks to see generated student, teacher, school, public, product, or personal-data output.

