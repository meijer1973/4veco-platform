# Bounded Source Refresh Packet Contract

Status: plan_ready_for_human_review

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-sprint-plan.md`
- Accepted input decision: `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Use only explicit per-scope source and output allowlists.
- Do not execute source refresh, contact local experts, or substitute local expert judgement.
- Do not produce localized, student-facing, teacher/school-facing, public, product-route, evidence-pack, Scale Gate, diagnostics/mastery/PV, or package/CI output.
- Do not process personal data or make legal, compliance, approval, accreditation, OP0, PTA, summative, inspection-readiness, support-sufficiency, accommodation-sufficiency, or accessibility/legal-sufficiency claims.
- Classify findings and carried issues with blocks, does_not_block, and proof_required_to_close.
- PASS WITH FLAGS may not carry a missing core requirement.

## Refresh-State Model

| State | blocks | does_not_block | proof_required_to_close | allowed_next_action | forbidden_next_action |
| --- | --- | --- | --- | --- | --- |
| `unchanged` | Does not block the future execution pilot record if exact official-source currentness proof is captured; still blocks product, school-facing, public, and localized use. | Human review of a no-change source-refresh execution pilot packet. | Exact official URL, access date, title/version observation, and no-change currentness record. | Record currentness evidence inside a later authorized source-refresh execution pilot. | Treat unchanged sources as product, compliance, inspection-readiness, support-sufficiency, or country-edition authority. |
| `updated_same_source` | Blocks downstream use until the changed official source is reviewed and mapped. | Preparing a human-review packet that isolates the changed source. | Official-source change note, retained URL, old/new version metadata, affected inventory rows, and human owner decision. | Prepare a bounded source-diff packet for human review. | Auto-apply changed official text to localized output or product routes. |
| `replaced_by_official_successor` | Blocks downstream use until successor authority, URL, and scope are reviewed. | Recording a candidate official successor for owner review. | Successor-source evidence, same-authority proof or explicit owner-approved replacement rule, and updated source inventory. | Escalate successor adoption to human owner review. | Silently swap source IDs, scan directories, or adopt unofficial mirrors. |
| `official_source_unavailable` | Blocks source-refresh closure for affected jurisdiction and source role. | Documenting unavailability and asking for owner direction. | Unavailable-source observation, retrieval timestamp, affected rows, and owner decision to pause, retry, or reduce scope. | Stop affected source row and record unavailable-source blocker. | Use cached unofficial copies, local expert judgement, or generated lesson output as substitute authority. |
| `candidate_gap_found` | Blocks closure for the affected source role until the gap is reviewed. | Recording the gap and candidate approval requirement. | Named gap, affected jurisdiction/source role, candidate_source_requires_owner_approval flag, and owner decision. | Create a candidate-source review item for human owner approval. | Import candidate sources through hidden discovery or treat expert suggestion as official authority. |
| `out_of_scope_source_found` | Blocks use of the source and any inference drawn from it. | Refusal documentation and scope clarification. | Refusal record proving the source is outside the explicit allowlist or jurisdiction boundary. | Reject the source and preserve the existing official-source boundary. | Broaden England to whole UK, Flanders to all Belgium, or selected AQA to all awarding bodies. |
| `requires_local_expert_interpretation` | Blocks source interpretation from becoming authority, legal advice, school evidence, or product output. | Preparing a later bounded expert-review request. | Expert question, allowed interpretation scope, forbidden-claim acknowledgement, and human-reviewed response record. | Ask for bounded interpretation only after owner payload authorization. | Contact experts in this packet or use expert judgement as official-source substitute. |
| `requires_human_owner_decision` | Blocks all automatic transition, merge, source adoption, and downstream authority. | Human-review routing with exact evidence. | Owner payload authorization naming reviewed_payload_head_sha and decision scope. | Route to READY_FOR_HUMAN_REVIEW with exact-head proof. | Auto-merge or merge product-authority work without owner payload authorization. |

## Stop Conditions

- Any source refresh execution or source-refresh execution pilot run.
- Any local expert contact or substitution.
- Any source outside the explicit allowlist not marked candidate_source_requires_owner_approval.
- Any hidden discovery, directory globbing, generated lesson-output scanning, product route, evidence pack, Scale Gate, diagnostics/mastery/PV, package/CI product integration, dashboard, or quality-ref integration.
- Any localized, student-facing, teacher/school-facing, public, country-edition, personal-data, compliance, approval, accreditation, OP0, PTA, summative, inspection-readiness, support-sufficiency, accommodation-sufficiency, or accessibility/legal-sufficiency claim.

## Review Gates

- Schema/architecture lead review
- England authority/source review
- Flanders authority/source review
- Teacher/economics review
- Legal/privacy review
- Accessibility/inclusion review
- Final lead review
- Exact-head PR Readiness Reviewer route with branch protection ok:true
- Owner payload authorization before merge or any later source-refresh execution pilot

