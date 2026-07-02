# Flanders Local Expert Review Request Packet

Packet ID: `flanders-local-expert-review-request-packet`
Status: `simulated_request_packet_ready_for_human_review`

## Authority Boundary

Expert feedback is bounded interpretive input for later human review. It is not legal advice, compliance proof, school evidence, official authority, localized output, product adoption, or inspection readiness.

No expert has been contacted. This packet is a simulated, source-bound request only.

## Expert Profile Needed

Flemish economics/curriculum and education-quality reviewer familiar with Onderwijsdoelen, the OK framework, Onderwijsinspectie Vlaanderen source boundaries, study-direction/school-network distinctions, and accessibility/support terminology.

## Sources In Scope

| source_id | state | authority | role | forbidden inference |
|---|---|---|---|---|
| `be-flanders-ok-framework` | `unchanged` | Vlaamse overheid / Onderwijsinspectie Vlaanderen | quality framework boundary | Does not prove OK compliance. |
| `be-flanders-onderwijsdoelen-so3-doorstroom` | `requires_local_expert_interpretation` | Vlaamse overheid / Onderwijsdoelen.be | official curriculum goal route | Does not prove school/network curriculum or assessment fit. |
| `be-flanders-inspection-what-do-we-inspect` | `unchanged` | Onderwijsinspectie Vlaanderen | inspection-method boundary | Does not authorize evidence-pack deployment. |
| `be-flanders-education-quality-reference` | `unchanged` | Vlaamse overheid | quality-framework source family | Does not replace school-level evidence. |
| `be-flanders-onderwijsdoelen-modernisatie` | `requires_local_expert_interpretation` | Vlaamse overheid / Onderwijsdoelen.be | curriculum-goal route selector | Does not authorize generic Flemish economics claims. |

## Allowed Questions

| question_id | source_ids | allowed question | forbidden question |
|---|---|---|---|
| `flanders-q-onderwijsdoelen-route` | `be-flanders-onderwijsdoelen-so3-doorstroom` | Interpret the official Onderwijsdoelen SO_3DE_GRAAD route for Book 1 1.2/1.3 economics concept placement. | Do not claim school/network curriculum fit, assessment fit, or implementation approval. |
| `flanders-q-modernisatie-selector` | `be-flanders-onderwijsdoelen-modernisatie` | Interpret which route choices or goal-family labels require explicit human review before any internal overlay transformation. | Do not hide dynamic-route uncertainty or treat the route selector as already interpreted. |
| `flanders-q-ok-framework` | `be-flanders-ok-framework`, `be-flanders-education-quality-reference` | Interpret the OK-framework boundary and wording that should remain visible in internal quality-language notes. | Do not claim OK compliance, quality assurance, school evidence sufficiency, or inspection readiness. |
| `flanders-q-inspection-boundary` | `be-flanders-inspection-what-do-we-inspect` | Interpret the Onderwijsinspectie boundary for quality development, quality areas, and teaching-learning practice language. | Do not authorize evidence packs, school-facing output, or inspection-ready claims. |
| `flanders-q-study-direction-network` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie` | Identify study-direction, school-network, or pathway implications that must remain unresolved until local review. | Do not turn expert feedback into school/network-specific implementation. |
| `flanders-q-assessment-status` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-inspection-what-do-we-inspect` | Clarify assessment-status boundaries relevant to Book 1 1.2/1.3 without producing assessment items. | Do not generate exam-ready exercises, assessment rubrics, or school-owned assessment policy. |
| `flanders-q-accessibility-support` | `be-flanders-ok-framework`, `be-flanders-education-quality-reference` | Interpret accessibility/support terminology that should remain non-sufficiency language. | Do not claim support sufficiency, accommodation sufficiency, accessibility/legal sufficiency, or personal-data processing. |
| `flanders-q-flanders-only` | `be-flanders-ok-framework`, `be-flanders-onderwijsdoelen-modernisatie` | Identify wording needed to keep the packet Flanders-only and not all Belgium. | Do not generalize to all Belgium, French Community, German-speaking Community, or all school networks. |

## Forbidden Questions

- legal advice
- compliance claims
- approval claims
- inspection-readiness claims
- school implementation evidence
- school-owned evidence
- student evidence
- student data
- personal data
- support sufficiency claims
- accommodation sufficiency claims
- accessibility/legal sufficiency claims
- product adoption claims
- official-source substitution
- localized output generation
- exam-ready exercise generation
- Do not generalize Flanders to all Belgium, French Community, German-speaking Community, school networks, school-owned policy, or implementation approval.

## Expected Response Format

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

## Finding Classification

| finding | classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Flanders local expert request packet is complete and source-bound. | `core_requirement_met` | Nothing for human review once checker, specialists, final lead, CI, branch protection, and PR readiness pass. | Human review of this internal request packet. | Checker PASS, source/expert-scope review PASS, final lead PASS, exact-head readiness, green CI, and owner authorization. |
| Expert contact and downstream authority remain blocked. | `scale_blocker` | Expert contact, expert substitution, localized output, school/public/product output, evidence packs, Scale Gate, diagnostics/mastery/PV, personal data, compliance, inspection-readiness, support/accommodation sufficiency, accessibility/legal sufficiency, and school-owned evidence claims. | A later local expert contact pilot only after human authorization. | Separate owner authorization for contact pilot and strict response intake. |
