# Local Expert Contact Pilot Decision

Selected decision: `READY_FOR_OWNER_AUTHORIZED_LOCAL_EXPERT_CONTACT_STAGE`

The contact-stage packet is generated from the accepted request packets, uses role-only expert profiles, defines consent/storage/intake boundaries, refuses the required unsafe cases, and does not dispatch contact or store real responses before owner authorization.

## Owner Next Action

Human owner may review whether to authorize the exact-head contact-stage packet for external dispatch. Any dispatch or later intake requires explicit owner authorization that cites the current head and green checks.

## Does Not Authorize

- contact dispatch before exact-head owner authorization
- named expert selection
- personal-data processing
- student data or support-record processing
- school-specific evidence collection
- local expert substitution for official authority
- legal advice or legal sufficiency
- compliance proof
- approval, accreditation, OP0, PTA, summative validity, or inspection readiness
- support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or individual adjustment sufficiency
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
- school-owned evidence claims

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| The packet is ready for human review as a governed contact-stage pilot. | `core_requirement_met` | Nothing for human review once final readiness proof is green. | Human decision on whether to authorize external contact under the packet. | Exact-head PR readiness, branch protection ok:true, green CI, and owner authorization. |
| External contact and response storage remain owner-authorized steps. | `human_authorization_required` | Sending requests, storing real responses, naming experts, processing personal data, or using responses as product/school/public authority. | Human review of the complete contact-stage packet. | Explicit owner authorization that cites the head after merge/readiness evidence. |
| Downstream product and school authority remains blocked. | `scale_blocker` | Localized output, country editions, teacher/school/public output, evidence packs, product-route adoption, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, legal/compliance/approval/inspection-readiness claims, support/accommodation/accessibility/individual-adjustment sufficiency claims, and school-owned evidence claims. | Internal contact-stage packet review. | Separate governed sprint and owner authorization after this contact-stage packet. |
