# Internal Overlay Trial Plan

Status: ready_for_human_review
Sprint: `GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1`
Date: 2026-06-24

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1/GOAL-IQS-INTERNAL-OVERLAY-PROTOTYPE-PLANNING-1-sprint-plan.md`
- Accepted selected-deepening decision: `PROCEED_TO_INTERNAL_OVERLAY_PROTOTYPE_PLANNING`
- Accepted decision source: `reports/inspection-standards/selected-jurisdiction-deepening-decision.md`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Cite the accepted GOAL-IQS-SELECTED-DEEPENING-1 decision and preserve its authority boundaries.
- Plan internal overlay trial architecture only; do not create localized chapters, country editions, or executable product routes.
- Use explicit input and output allowlists; do not glob directories or scan generated lesson output.
- Define source traceability, blocker display, refusal rules, validation gates, and review gates before any later trial-contract draft.
- Keep England and Flanders as the selected contrasting jurisdictions; do not generalize to whole UK or all Belgium.
- Keep all teacher/school-facing, public, evidence-pack, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, approval, OP0, PTA, summative, and inspection-readiness authority blocked.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry a missing core requirement as PASS WITH FLAGS.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
| --- | --- | --- |
| `accepted_decision_bound` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `input_allowlist` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `output_allowlist` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `no_output_boundary` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `prototype_scope` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `source_traceability` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `blocker_display` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `support_accommodation_boundary` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `refusal_stop_conditions` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `review_gates` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |
| `human_review_stop` | met_for_internal_planning | Generator/checker PASS, specialist review, final lead PASS, PR readiness proof, and human review. |

## Scope

- Objective: Plan a later internal-only overlay trial contract for England and Flanders without runtime execution or localized output.

In scope:

- Internal architecture planning.
- Future contract field families.
- Exact allowlist policy.
- Refusal and stop-condition design.
- Validation and specialist-review gate design.

Out of scope remains blocked:

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
- `country_edition_generation`
- `local_exam_code_implementation`
- `teacher_school_facing_overlay`
- `public_overlay_output`
- `school_owned_evidence_collection`
- `package_or_ci_product_integration`
- `country_specific_legal_claim`
- `localized_student_facing_chapters`
- `teacher_school_facing_distribution`
- `selected_jurisdiction_public_output`
- `selected_jurisdiction_evidence_pack`
- `selected_jurisdiction_product_route`
- `selected_jurisdiction_scale_gate`
- `selected_jurisdiction_personal_data`
- `selected_jurisdiction_legal_sufficiency_claim`
- `selected_jurisdiction_compliance_claim`
- `selected_jurisdiction_approval_claim`
- `selected_jurisdiction_accreditation_claim`
- `selected_jurisdiction_inspection_readiness_claim`
- `internal_prototype_runtime_execution`
- `localized_overlay_output_generation`
- `fixture_to_product_promotion`
- `teacher_school_pilot`
- `support_sufficiency_claim`
- `accommodation_sufficiency_claim`
- `individual_adjustment_claim`
- `support_records_personal_data`
- `automated_source_refresh`
- `non_allowlisted_source_use`
- `local_expert_substitution`

## Planning Phases

| Phase | Purpose | Allowed actions | Forbidden actions | Exit evidence |
| --- | --- | --- | --- | --- |
| `phase_0_authority_lock` | Import accepted selected-deepening proof as planning context only. | Read the allowlisted selected-deepening decision, comparison, crosswalks, descriptors, and transformation contract.<br>Record authority boundaries and known source gaps. | Treat selected-deepening acceptance as product or local implementation authority.<br>Resolve source gaps by implicit web/source discovery. | Planning packet names accepted decision, still-blocked authority, and exact input allowlist. |
| `phase_1_trial_contract_shape` | Define the later internal trial contract shape without executing it. | Draft field families for source binding, concept mapping, transformation intent, blocker display, and reviewer disposition.<br>Name future fixture categories and refusal cases. | Generate localized exercises, answer models, lesson pages, teacher packs, or student-facing materials.<br>Create package, CI, dashboard, quality-ref, product-route, or Scale Gate integration. | Future contract fields are bounded to internal, manual, no-output analysis. |
| `phase_2_validation_design` | Define deterministic validation before any later trial-contract draft. | Require exact input/output allowlists.<br>Require explicit source IDs for each future row.<br>Require refusal tests for forbidden audiences, authority jumps, implicit discovery, and integration requests. | Use directory globbing or generated lesson-output scanning.<br>Waive source traceability for convenience. | Checker requirements and refusal matrix are reviewable before implementation. |
| `phase_3_review_gate_design` | Define review gates needed before any later internal trial-contract draft can proceed. | Require teacher/economics, legal/privacy, accessibility/inclusion, jurisdiction-source, and final lead review.<br>Preserve REV-STD-1 findings and carried-issue fields. | Return a later contract draft without specialist corrections resolved.<br>Use PASS WITH FLAGS to carry a missing core requirement. | Human-review packet can decide whether to authorize a later contract-draft sprint. |

## Jurisdiction Planning

| Jurisdiction | Descriptor | Crosswalk | Planning use | Must display blockers |
| --- | --- | --- | --- | --- |
| `england` | `references/data/inspection-standards/overlays/england.deepening.v1.json` | `reports/inspection-standards/england-book1-1.2-1.3-deep-crosswalk.json` | Internal planning for how an England overlay trial contract would preserve DfE/Ofsted/AQA-source boundaries. | England is not whole UK.<br>AQA specimen/mark-scheme evidence is representative only, not awarding-body approval.<br>SEND/accessibility terminology is not legal sufficiency or support sufficiency. |
| `flanders` | `references/data/inspection-standards/overlays/flanders.deepening.v1.json` | `reports/inspection-standards/flanders-book1-1.2-1.3-deep-crosswalk.json` | Internal planning for how a Flanders overlay trial contract would preserve Flemish-source and school/network boundaries. | Flanders is not all Belgium.<br>Onderwijsdoelen and Referentiekader Onderwijskwaliteit do not supply school-owned evidence.<br>Assessment and OK fulfillment remain local/school/network dependent. |

## Validation Gates

- Generator --check proves output currentness.
- Checker proves exact input/output allowlists and false blocked-authority flags.
- Focused Jest proves committed packet acceptance and forbidden-mode refusal.
- Final PR readiness reviewer runs against exact remote head before human review.

## Review Gates

- Lead reviewer: planning architecture and authority boundary.
- Teacher/economics reviewer: usefulness of future trial field families.
- Legal/privacy reviewer: audience, sharing, claims, and personal-data boundaries.
- Accessibility/inclusion reviewer: support/accommodation boundary.
- Final lead reviewer: complete packet, tests, generated reports, and PR proof.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| The selected-deepening decision is sufficient to plan a later internal overlay trial contract. | `core_requirement_met` | Nothing for human review of this planning packet. | A later internal trial-contract draft only if human accepted. | Owner payload authorization for reviewed_payload_head_sha and decision scope. |
| Planning remains non-executing and creates no localized, school-facing, public, product-route, Scale Gate, diagnostic, mastery, PV, student, or personal-data output. | `core_requirement_met` | Any implementation, runtime, product-route, student-use, public, or school-facing use. | Internal planning packet review. | Separate future human authorization after specialist review. |
