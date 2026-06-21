# International Foundation Decision

Status: human_review_pending
Date: 2026-06-21
Sprint: `GOAL-IQS-FOUNDATION-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-FOUNDATION-1/GOAL-IQS-FOUNDATION-1-authorisation-note.md`
- Dutch closure basis: PR #124 accepted and merged under `CLOSE_INTERNAL_SYSTEM`.

## Non-Negotiable Requirements

- Cite the product end-state and original sprint/gate specification.
- Name non-negotiable requirements before conclusions.
- Include a core-requirement checklist.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry any missing core requirement as PASS WITH FLAGS.
- Keep all country-compliance, approval, public, school-facing, package/CI/dashboard/quality-ref, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, and inspection-readiness authority blocked.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| `official_source_profiles`: Nine jurisdiction profiles use official-source anchors and record allowed use plus forbidden inference. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `governance_boundaries`: Flanders, England, Germany, Spain, and the United States retain explicit subnational or federal/state boundaries. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `common_core_matrix`: The shared common-core matrix distinguishes portable product-pedagogy from local overlay needs. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `differences_matrix`: The differences matrix names material divergences and the architecture response. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `overlay_architecture`: The overlay architecture separates shared core, local curriculum/exam overlays, source-evidence overlay, and school-owned evidence. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `book_portability_check`: Book 1 Chapters 1.2 and 1.3 are tested only as a bounded internal portability check. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `blocked_authority`: All forbidden authority flags remain false and visible. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `single_decision`: The foundation chooses exactly one allowed decision. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |
| `human_review_stop`: The packet returns for human review before any country edition, public/school-facing, product, or compliance step. | `met_for_foundation` | Validator PASS, specialist review, final lead PASS, and human acceptance. |

## Final Foundation Decision

Selected decision: `PROCEED_WITH_COMMON_CORE_AND_OVERLAYS`

Proceed with a shared international economics product common core only if every country implementation uses bounded jurisdiction overlays and preserves school-owned evidence boundaries.

Allowed options:
- `PROCEED_WITH_COMMON_CORE_AND_OVERLAYS`
- `LIMIT_TO_SELECTED_JURISDICTIONS`
- `RESEARCH_GAPS_BEFORE_ARCHITECTURE`

Decision selection count: `1`

## Authorised

- Manual internal international evidence-support analysis.
- Future planning for common-core and jurisdiction-overlay descriptors.
- Internal review of source profiles, differences matrix, architecture, and bounded portability check.

## Still Blocked

- `country_compliance_claim`
- `inspectorate_approval_claim`
- `legal_compliance_claim`
- `inspection_readiness_claim`
- `school_pack_trial`
- `teacher_school_distribution`
- `public_external_distribution`
- `evidence_pack_deployment`
- `package_script_invocation`
- `ci_invocation`
- `dashboard_gate`
- `quality_ref_integration`
- `product_route_adoption`
- `scale_gate_integration`
- `diagnostics_mastery_pv`
- `student_or_product_use`
- `personal_data_processing`
- `complete_op0_pta_summative_claim`
- `op0_claim`
- `pta_validity_claim`
- `summative_validity_claim`
- `single_national_us_inspection_claim`
- `whole_uk_claim_from_england_only`
- `all_belgium_claim_from_flanders_only`
- `germany_single_land_claim`

## Owner Next Action

Human review may accept, revise, or reject the GOAL-IQS-FOUNDATION-1 foundation. Acceptance authorizes only internal architecture follow-up, not country edition work or external claims.


## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| The common-core and overlay architecture is feasible enough for a next internal architecture step. | `core_requirement_met` | Nothing if human accepts the bounded decision. | Internal architecture follow-up. | Specialist reviews MORE_THAN_SATISFIED where required, final lead PASS, fresh green PR, and human acceptance. |
| Country-compliance and approval claims remain blocked. | `scale_blocker` | Public/external claims, school-facing distribution, compliance/approval language, country-compliant editions. | Internal common-core and overlay architecture. | Separate source-reviewed local implementation gate for each jurisdiction. |
