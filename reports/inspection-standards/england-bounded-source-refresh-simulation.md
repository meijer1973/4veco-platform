# England Bounded Source Refresh Packet

Status: simulation_ready_for_human_review

## Boundary

England-only representative AQA deepening; not Scotland, Wales, Northern Ireland, the whole UK, or all awarding bodies.

## Required Coverage

- DfE economics subject content
- Ofsted inspection/evaluation source
- Ofsted operating guide / inspection evidence-gathering source
- selected AQA awarding-body source boundary
- SEND/accessibility terminology source boundary
- England-only / not whole UK boundary

## Exact Source-Refresh Inventory

| source_id | authority | source_role | current_access_date | current_known_version_or_publication_date | expected refresh method | forbidden_inference | human-review trigger |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `england-ofsted-eif-2025` | Ofsted | inspection/evaluation boundary | 2026-06-22 | Updated 2025-09-09; for use from 2025-11-10 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not approve product output or prove inspection readiness. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `england-ofsted-operating-guide-2025` | Ofsted | inspection evidence-gathering boundary | 2026-06-22 | Updated 2026-06-12; for use from 2025-11-10 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not authorize evidence-pack generation. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `england-dfe-a-level-economics-content` | Department for Education | qualification subject-content boundary | 2026-06-22 | Published 2014-04-09 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not approve an exam-board specification or 4veco tasks. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `england-aqa-7136-subject-content` | AQA | representative awarding-body subject content | 2026-06-22 | Live specification page verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not represent all awarding bodies or all England. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `england-aqa-7136-scheme-assessment` | AQA | assessment objective and paper-form boundary | 2026-06-22 | Live specification page verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not generate AQA exam questions. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `england-aqa-economics-command-words` | AQA | representative command-word meanings | 2026-06-22 | Live resource page verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not authorize student-facing assessment output. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `england-aqa-7136-assessment-resources` | AQA | representative specimen paper and mark-scheme source layer | 2026-06-22 | Live assessment resources page verified 2026-06-22 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not copy or generate protected assessment material. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |
| `england-send-code-practice` | Department for Education and Department of Health and Social Care | SEND/accessibility terminology boundary | 2026-06-22 | Published 2014-06-11; updated 2024-09-12 | Manual exact-official-source currentness check only; no directory globbing, search-engine discovery, generated lesson-output scanning, cached unofficial mirrors, or local expert substitution. | Does not prove accessibility compliance or school support sufficiency. | Any state other than unchanged, any candidate source, any successor source, any source gap, any non-official source, or any jurisdiction overclaim requires human owner review before closure. |

## Simulation Cases

| case_type | source_id | state | boundary_focus | blocks | proof_required_to_close |
| --- | --- | --- | --- | --- | --- |
| `official_source_unchanged` | `england-ofsted-eif-2025` | `unchanged` | official source unchanged | Does not block the future execution pilot record if exact official-source currentness proof is captured; still blocks product, school-facing, public, and localized use. | Exact official URL, access date, title/version observation, and no-change currentness record. |
| `official_source_updated` | `england-ofsted-operating-guide-2025` | `updated_same_source` | official source updated | Blocks downstream use until the changed official source is reviewed and mapped. | Official-source change note, retained URL, old/new version metadata, affected inventory rows, and human owner decision. |
| `successor_source_found` | `england-dfe-a-level-economics-content` | `replaced_by_official_successor` | successor official source found | Blocks downstream use until successor authority, URL, and scope are reviewed. | Successor-source evidence, same-authority proof or explicit owner-approved replacement rule, and updated source inventory. |
| `source_unavailable` | `england-ofsted-eif-2025` | `official_source_unavailable` | official source unavailable | Blocks source-refresh closure for affected jurisdiction and source role. | Unavailable-source observation, retrieval timestamp, affected rows, and owner decision to pause, retry, or reduce scope. |
| `non_official_source_suggested` | `non-official-england-source` | `out_of_scope_source_found` | non-official source suggested | Blocks use of the source and any inference drawn from it. | Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary. |
| `whole_uk_claim` | `england-ofsted-eif-2025` | `out_of_scope_source_found` | England-only / not whole UK boundary | Blocks use of the source and any inference drawn from it. | Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary. |
| `all_belgium_claim` | `england-ofsted-eif-2025` | `out_of_scope_source_found` | cross-jurisdiction overclaim: all-Belgium claim refused as outside England packet scope | Blocks use of the source and any inference drawn from it. | Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary. |
| `local_expert_substitutes_for_official_source` | `england-dfe-a-level-economics-content` | `requires_local_expert_interpretation` | local expert cannot substitute for official source | Blocks source interpretation from becoming authority, legal advice, school evidence, or product output. | Expert question, allowed interpretation scope, forbidden-claim acknowledgement, and human-reviewed response record. |
| `legal_compliance_overclaim` | `england-ofsted-eif-2025` | `requires_human_owner_decision` | legal/compliance overclaim | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |
| `support_accommodation_sufficiency_overclaim` | `england-send-code-practice` | `requires_human_owner_decision` | support/accommodation sufficiency overclaim | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |
| `localized_output_requested` | `england-dfe-a-level-economics-content` | `requires_human_owner_decision` | localized output requested | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |
| `personal_data_requested` | `england-ofsted-eif-2025` | `requires_human_owner_decision` | personal data requested | Blocks all automatic transition, merge, source adoption, and downstream authority. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| England source-refresh inventory is bounded to 8 existing official allowlist sources. | `core_requirement_met` | Nothing for human review of the bounded packet itself. | A later source-refresh execution pilot after human acceptance. | Checker PASS, source-review specialist PASS, final lead PASS, exact-head readiness, and human authorization. |
| England source-refresh execution and downstream authority remain blocked. | `scale_blocker` | All source refresh execution, localized output, product route, school/public output, Scale Gate, personal-data, compliance, inspection-readiness, and support/accommodation sufficiency authority. | Human review of this bounded source-refresh packet. | Separate owner payload authorization naming reviewed_payload_head_sha, decision scope, and a later execution pilot packet. |

