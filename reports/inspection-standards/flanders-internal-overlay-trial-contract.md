# Belgium / Flanders Internal Overlay Trial Contract

Status: complete_internal_no_output_trial_contract
Sprint: `GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1`
Decision: `PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1-sprint-plan.md`
- Roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- Accepted planning decision: `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`
- Accepted planning source: `reports/inspection-standards/internal-overlay-prototype-planning-decision.md`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Cite the accepted internal overlay prototype planning decision and preserve its authority boundaries.
- Create complete England and Flanders contracts for Book 1 Chapters 1.2 and 1.3 using every deep-crosswalk row.
- Use explicit source and output allowlists only; do not glob directories or scan generated lesson output.
- Use strict allowed transformation actions: unchanged_core, terminology_change, example_change, institution_change, assessment_change, extension_only, exclude.
- Generate internal trace reports only; do not generate localized textbook paragraphs, exercises, answer models, student-facing files, teacher/school-facing output, public output, or evidence packs.
- Keep school-owned evidence, local expert review, legal/privacy, accessibility/support, product-route, Scale Gate, diagnostics/mastery/PV, personal-data, compliance, approval, OP0, PTA, summative, and inspection-readiness authority blocked.
- Add positive and negative validation fixtures for source, freshness, row completeness, discovery, audience, personal-data, claims, and integration refusals.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry a missing core requirement as PASS WITH FLAGS.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
| --- | --- | --- |
| `contract_identity_authority` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `exact_input_allowlist` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `exact_output_allowlist` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `nested_contract_schema` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `all_crosswalk_rows_bound` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `source_traceability` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `strict_transformation_actions` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `no_output_enforcement` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `fixture_refusals` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `single_decision` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |
| `review_gates` | met_for_internal_trial_contract | Generator/checker PASS, positive/negative fixtures PASS, specialist reviews PASS, final lead PASS, exact-head PR readiness proof, green CI, and human review. |

## Authority Boundary

This contract is internal-only, manual, and no-output. It does not create localized chapters, exercises, answer models, student-facing files, teacher/school-facing output, public output, evidence packs, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal-data processing, legal sufficiency, compliance, approval, OP0, PTA, summative, inspection-readiness, support-sufficiency, or accommodation-sufficiency claims.

## Source Binding

- Descriptor: `flanders.deepening.v1`
- Freshness status: `fresh_with_dynamic_portal_limit`
- Official source IDs: `be-flanders-ok-framework`, `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-inspection-what-do-we-inspect`, `be-flanders-education-quality-reference`, `be-flanders-onderwijsdoelen-modernisatie`

## Contract Rows

| Row | Chapter/Paragraph | Concept | Actions | Source IDs | Proof Required To Close |
| --- | --- | --- | --- | --- | --- |
| `flanders:01:1.2.1_willingness_to_pay_individual_demand` | 1.2.1 | `1.2.1_willingness_to_pay_individual_demand` | `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:02:1.2.1_consumer_surplus` | 1.2.1 | `1.2.1_consumer_surplus` | `extension_only` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:03:1.2.2_demand_factors_movement_vs_shift` | 1.2.2 | `1.2.2_demand_factors_movement_vs_shift` | `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:04:1.2.3_collective_demand` | 1.2.3 | `1.2.3_collective_demand` | `extension_only` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:05:1.2.4_mixed_demand_tasks` | 1.2.4 | `1.2.4_mixed_demand_tasks` | `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:06:1.3.1_supply_curve_supply_factors` | 1.3.1 | `1.3.1_supply_curve_supply_factors` | `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:07:1.3.2_market_equilibrium_shortage_surplus` | 1.3.2 | `1.3.2_market_equilibrium_shortage_surplus` | `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:08:1.3.3_shifts_new_equilibrium` | 1.3.3 | `1.3.3_shifts_new_equilibrium` | `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:09:1.3.4_mixed_supply_demand_tasks` | 1.3.4 | `1.3.4_mixed_supply_demand_tasks` | `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |
| `flanders:10:book1_output_boundary` | Book 1 Chapters 1.2 and 1.3 boundary | `book1_output_boundary` | `exclude` | `be-flanders-onderwijsdoelen-so3-doorstroom`, `be-flanders-onderwijsdoelen-modernisatie`, `be-flanders-ok-framework`, `be-flanders-education-quality-reference`, `be-flanders-inspection-what-do-we-inspect` | No-output contract row may close only with exact source binding, row completeness, specialist review, final lead PASS, and human review. |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| flanders contract binds every Book 1 1.2/1.3 crosswalk row to explicit source IDs, roles, access dates, transformation actions, blockers, and proof required to close. | `core_requirement_met` | Nothing for internal no-output contract review. | Human review of the complete contract packet. | Checker PASS, specialist reviews, final lead PASS, exact-head PR readiness, green CI, and human review. |
| All localized, public, school-facing, product-route, Scale Gate, diagnostics/mastery/PV, student/product-use, personal-data, compliance, inspection-readiness, support-sufficiency, and accommodation-sufficiency authority remains blocked. | `scale_blocker` | Any downstream output or authority jump. | Internal no-output trial simulation decision only after human review. | Separate future human authorization and specialist proof. |
