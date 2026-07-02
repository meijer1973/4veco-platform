# GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1 Specialist Reviews

Status: All specialist blockers closed
Date: 2026-06-27

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation; resolve through the paired `4veco-lessen` checkout used for human review.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-sprint-plan.md`
- Accepted input decision: `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Use only explicit per-scope source and output allowlists.
- Do not execute source refresh, contact local experts, or substitute local expert judgement.
- Do not produce localized, student-facing, teacher/school-facing, public, product-route, evidence-pack, Scale Gate, diagnostics/mastery/PV, or package/CI output.
- Do not process personal data or make legal, compliance, approval, accreditation, OP0, PTA, summative, inspection-readiness, support-sufficiency, accommodation-sufficiency, accessibility/legal-sufficiency, or school-evidence claims.
- Classify findings with `blocks`, `does_not_block`, and `proof_required_to_close`.
- PASS WITH FLAGS may not carry a missing core requirement.

## Core-Requirement Checklist

| Requirement | Status | Proof required to close |
| --- | --- | --- |
| Product end-state and original spec cited | met | Packet cites both; final lead/human review resolves paired lesson checkout. |
| Accepted gate decision bound | met | Packet binds to `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`. |
| Exact source inventory complete | met | England has 8 allowlisted official sources; Flanders has 5. |
| Refresh-state model complete | met | All 8 required refresh states are present with `blocks`, `does_not_block`, `proof_required_to_close`, allowed action, and forbidden action. |
| England packet complete | met | DfE, Ofsted EIF, Ofsted operating guide, selected AQA, SEND/accessibility, and England-only boundaries are present. |
| Flanders packet complete | met | Onderwijsdoelen, OK framework, assessment-status, study-direction/school-network, accessibility/support, and Flanders-only boundaries are present. |
| Expert template bounded | met | Template forbids legal, compliance, approval, inspection-readiness, school-evidence, student/product-use, support/accommodation sufficiency, accessibility/legal sufficiency, personal-data, and source-substitution claims. |
| Simulations and refusals complete | met | Official source, successor, unavailable, non-official source, jurisdiction overclaim, expert-substitution, legal, support, localized-output, and personal-data cases are present. |
| No execution or contact | met | Source refresh execution, local expert contact, local expert substitution, output, and personal data flags remain false. |
| Single decision | met | Decision selects `PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT`. |
| Review route preserved | met | Specialist reviews completed, final lead review still required before PR readiness/human review. |

## Specialist Results

### Schema/architecture lead

Initial verdict: REVISE.

Findings:

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Schema did not strictly encode report-type contracts. | `core_spec_failure` | Schema/architecture PASS and standalone schema-consumer safety. | Static review of generated reports. | Add report-type contracts, strict no-output/object definitions, cardinalities, and schema validation. |
| Required review records were absent. | `core_spec_failure` | Full checker PASS and review-route closure. | Continuing specialist review and correction. | Add specialist and final lead records before final validation. |
| Generator path resolution was cwd-dependent. | `quality_improvement_available` | Fully deterministic manual invocation. | Repo-root invocation. | Anchor generator paths to repo root. |

Corrections applied:

- Added `REPO_ROOT` and repo-root path resolution to the generator.
- Added strict schema `oneOf` report-type contracts and strict no-output, inventory, coverage, decision, count, state, and case definitions.
- Added checker schema-instance validation for plan, jurisdiction simulations, decision, and positive fixtures.
- Added checker enforcement for `england_packet_complete` and `flanders_packet_complete`.
- Added jurisdiction coverage fragment assertions.
- Regenerated packet outputs.

Focused re-review verdict: PASS.

### England authority/source reviewer

Verdict: PASS.

Finding classification:

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| England authority/source coverage is bounded and sufficient for human review. | `core_requirement_met` | Nothing for England bounded-packet human review. | Final comparative and lead review. | Checker PASS, final lead PASS, exact-head readiness, green CI, and human owner authorization. |
| Downstream England authority remains blocked. | `scale_blocker` | Source-refresh execution, England prototype output, AQA assessment generation, school/public distribution, compliance, inspection-readiness, and SEND/accessibility sufficiency claims. | Read-only specialist review and human routing. | Separate owner-authorized execution packet with exact official-source currentness proof and expert/legal/accessibility review. |
| Paired product-end-state file was not locally visible to the England reviewer. | `minor_carry_flag` | Direct product-end-state content verification in the platform-only checkout. | England authority/source PASS because citation is present. | Final lead/human review resolves paired lesson checkout or attaches exact product-end-state proof. |

### Flanders authority/source reviewer

Verdict: PASS.

Finding classification:

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Flanders bounded packet covers required authority/source boundaries and keeps downstream authority blocked. | `core_requirement_met` | Nothing for Flanders human review of this bounded packet. | Final lead and human-owner review. | Flanders source reviewer PASS, final lead PASS, exact-head readiness, green CI, and explicit human authorization. |
| Checker did not hard-require jurisdiction-specific completeness IDs. | `quality_improvement_available` | Relying on checker alone as exhaustive future proof. | Current Flanders PASS because committed artifacts contain the boundaries. | Add `england_packet_complete` and `flanders_packet_complete` to checker core-ID enforcement. Closed. |
| Flanders whole-UK row needed clearer cross-jurisdiction framing. | `minor_carry_flag` | Treating the label as clean Flanders-specific authority language in later execution work. | Current Flanders boundary proof. | Reword row as cross-jurisdiction overclaim refusal. Closed. |

### Teacher/economics reviewer

Verdict: PASS WITH FLAGS.

Finding classification:

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Source changes that could affect Book 1 1.2/1.3 mappings are visible enough for later review. | `core_requirement_met` | A later execution run if it applies changed source text without mapping changed `source_id`s to affected Book 1 concept rows. | Human review of this packet and the decision to proceed only to a separately authorized execution run. | Later execution run includes explicit `source_id -> concept_id -> mapping_status/assessment_status` impact table for Book 1 1.2/1.3. |
| Product end-state file is cited but not locally visible in the platform-only checkout. | `minor_carry_flag` | Direct product-end-state content verification from this checkout. | Teacher/economics review of this bounded packet. | Final lead/human review resolves paired `4veco-lessen` checkout at exact head before owner authorization. |

No missing core requirement was carried in PASS WITH FLAGS.

### Legal/privacy reviewer

Verdict: PASS WITH FLAGS.

Finding classification:

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Legal/privacy boundaries are met. | `core_requirement_met` | Nothing for legal/privacy approval of this bounded packet. | Human review of the planning-only packet. | Record specialist review, final lead PASS, exact-head PR readiness, green CI, and explicit owner authorization. |
| Execution, expert contact, output, and claim authority remain blocked. | `scale_blocker` | Actual refresh, expert contact/substitution, public/school/product output, personal-data processing, or compliance/readiness claim. | Preparing a later, separately authorized execution run. | Separate reviewed execution run with explicit official-source rows and owner authorization. |
| Checker hardening needed the two jurisdiction completeness IDs. | `minor_carry_flag` | Future checker-only reliance. | Current legal/privacy PASS. | Added the two IDs to checker enforcement and reran focused coverage. Closed. |

No missing core requirement was carried in PASS WITH FLAGS.

### Accessibility/inclusion reviewer

Verdict: PASS.

Finding classification:

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Accessibility/inclusion boundaries are safe for the bounded packet. | `core_requirement_met` | Nothing for accessibility/inclusion approval of this packet. | Human review of the packet. | Final lead PASS, exact-head readiness, green CI, and human owner authorization. |
| Support/accommodation and accessibility/legal sufficiency remain intentionally blocked. | `scale_blocker` | Product/school/public/student authority, personal-data use, compliance/inspection-readiness, and support/accommodation sufficiency authority. | A separately reviewed source-refresh execution run after owner authorization. | Later run keeps support/accommodation and personal-data claims blocked unless separately reviewed and authorized. |

## Summary

All specialist blockers closed. The packet remains internal-only and planning-only. It does not execute source refresh, contact local experts, substitute expert judgement for official sources, produce localized/student/teacher/school/public output, process personal data, or make compliance, approval, inspection-readiness, school-evidence, support/accommodation sufficiency, or accessibility/legal sufficiency claims.
