# Local Expert Review Request Decision

Selected decision: `PROCEED_TO_LOCAL_EXPERT_CONTACT_PILOT`

The request and response schemas are strict, both jurisdiction packets are source-bound, no expert has been contacted, all forbidden claims remain blocked, and negative simulations refuse the required unsafe cases. The safe next step is a separate local expert contact pilot, not contact in this sprint.

## Does Not Authorize

- local expert contact in this sprint
- local expert substitution for official authority
- localized output
- country editions
- student-facing output
- teacher/school-facing output
- public output
- evidence packs
- product-route adoption
- Scale Gate
- diagnostics/mastery/PV
- student/product use
- personal-data processing
- legal advice, compliance, approval, accreditation, OP0, PTA, summative validity, inspection readiness, support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or school-owned evidence claims

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| The packet selects a bounded next contact-pilot decision. | `core_requirement_met` | Nothing for human review once final readiness proof is green. | Human review of this request packet. | Exact-head PR readiness, branch protection ok:true, green CI, and owner authorization. |
| Selected decision does not contact experts in this sprint. | `scale_blocker` | Actual expert contact, substitution, localized output, product use, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims. | Human decision on whether to authorize a later contact pilot. | Separate contact-pilot sprint and owner authorization. |
