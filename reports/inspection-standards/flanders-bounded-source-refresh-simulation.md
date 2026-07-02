# Belgium / Flanders Bounded Source Refresh Packet

Status: simulation_ready_for_human_review

## Boundary

Flemish Community only; not French Community, German-speaking Community, all Belgium, school-network curriculum, or school-owned assessment policy.

## Required Coverage

- Onderwijsdoelen source boundary
- Referentiekader Onderwijskwaliteit / OK framework
- assessment-status boundary
- study-direction / school-network boundary
- Flanders-only / not all Belgium boundary
- accessibility/support terminology boundary

## Exact Source-Refresh Inventory

| source_id | authority | source_role | current_access_date | current_known_version_or_publication_date | expected refresh method | forbidden_inference | human-review trigger |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `be-flanders-ok-framework` | Vlaamse overheid / Onderwijsinspectie Vlaanderen | quality framework boundary | 2026-06-22 | Live official page verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not prove OK compliance. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `be-flanders-onderwijsdoelen-so3-doorstroom` | Vlaamse overheid / Onderwijsdoelen.be | official curriculum goal route | 2026-06-22 | Live official portal verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not prove school/network curriculum or assessment fit. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `be-flanders-inspection-what-do-we-inspect` | Onderwijsinspectie Vlaanderen | inspection-method boundary | 2026-06-22 | Live official page verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not authorize evidence-pack deployment. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `be-flanders-education-quality-reference` | Vlaamse overheid | quality-framework source family | 2026-06-22 | Live official page verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not replace school-level evidence. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `be-flanders-onderwijsdoelen-modernisatie` | Vlaamse overheid / Onderwijsdoelen.be | curriculum-goal route selector | 2026-06-22 | Live official portal verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not authorize generic Flemish economics claims. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |

## Simulation Cases

| case_type | source_id | state | boundary_focus | blocks | proof_required_to_close |
| --- | --- | --- | --- | --- | --- |
| `official_source_unchanged` | `be-flanders-ok-framework` | `unchanged` | official source unchanged | Does not block the future execution pilot record if exact official-source currentness proof is captured; still blocks product, school-facing, public, and localized use. | Exact official URL, access date, title/version observation, and no-change currentness record. |
| `official_source_updated` | `be-flanders-onderwijsdoelen-so3-doorstroom` | `updated_same_source` | official source updated | Blocks downstream use until the changed official source is reviewed and mapped. | Official-source change note, retained URL, old/new version metadata, affected inventory rows, and human owner decision. |
| `successor_source_found` | `be-flanders-onderwijsdoelen-so3-doorstroom` | `replaced_by_official_successor` | successor official source found | Blocks downstream use until successor authority, URL, and scope are reviewed. | Successor-source evidence, same-authority proof or explicit owner-approved replacement rule, and updated source inventory. |
| `source_unavailable` | `be-flanders-ok-framework` | `official_source_unavailable` | official source unavailable | Blocks source-refresh closure for affected jurisdiction and source role. | Unavailable-source observation, retrieval timestamp, affected rows, and owner decision to pause, retry, or reduce scope. |
| `non_official_source_suggested` | `non-official-flanders-source` | `out_of_scope_source_found` | non-official source suggested | Blocks use of the source and any inference drawn from it. | Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary. |
| `whole_uk_claim` | `be-flanders-ok-framework` | `out_of_scope_source_found` | cross-jurisdiction overclaim: whole-UK claim refused as outside Flanders packet scope | Blocks use of the source and any inference drawn from it. | Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary. |
| `all_belgium_claim` | `be-flanders-ok-framework` | `out_of_scope_source_found` | Flanders-only / not all Belgium boundary | Blocks use of the source and any inference drawn from it. | Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary. |
| `local_expert_substitutes_for_official_source` | `be-flanders-onderwijsdoelen-so3-doorstroom` | `requires_local_expert_interpretation` | local expert cannot substitute for official source | Blocks source interpretation from becoming authority, legal advice, school evidence, or product output. | Expert question, allowed interpretation scope, forbidden-claim acknowledgement, and human-reviewed response record. |
| `legal_compliance_overclaim` | `be-flanders-ok-framework` | `requires_human_owner_decision` | legal/compliance overclaim | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |
| `support_accommodation_sufficiency_overclaim` | `be-flanders-ok-framework` | `requires_human_owner_decision` | support/accommodation sufficiency overclaim | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |
| `localized_output_requested` | `be-flanders-onderwijsdoelen-so3-doorstroom` | `requires_human_owner_decision` | localized output requested | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |
| `personal_data_requested` | `be-flanders-ok-framework` | `requires_human_owner_decision` | personal data requested | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Belgium / Flanders source-refresh inventory is bounded to 5 existing official allowlist sources. | `core_requirement_met` | Nothing for human review of the bounded packet itself. | A later source-refresh execution pilot after human acceptance. | Checker PASS, source-review specialist PASS, final lead PASS, exact-head readiness, and human authorization. |
| Belgium / Flanders source-refresh execution and downstream authority remain blocked. | `scale_blocker` | All source refresh execution, localized output, product route, school/public output, Scale Gate, personal-data, compliance, inspection-readiness, and support/accommodation sufficiency authority. | Human review of this bounded source-refresh packet. | Separate owner payload authorization naming reviewed_payload_head_sha, decision scope, and a later execution pilot packet. |

