# England Overlay Deepening

Status: internal-only deep overlay readiness
Sprint: `GOAL-IQS-SELECTED-DEEPENING-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-SELECTED-DEEPENING-1/GOAL-IQS-SELECTED-DEEPENING-1-sprint-plan.md`
- Accepted architecture decision: `PROCEED_TO_SELECTED_JURISDICTION_DEEPENING`

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus original sprint/gate spec.
- Close the accepted shallow-schema carry item before expanded machine consumption.
- Generate nested schema v1 with strict nested additionalProperties:false controls.
- Produce England and Flanders deep descriptors only; keep Bavaria and California as architectural controls.
- Use explicit source and output allowlists only; do not glob directories or scan generated lesson output.
- Map Book 1 Chapters 1.2 and 1.3 to exact local source layers where possible.
- Produce internal transformation specifications only; do not generate localized chapters.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry a missing core requirement as PASS WITH FLAGS.
- Keep country editions, school/teacher-facing output, public output, product routes, Scale Gate, diagnostics/mastery/PV, student/product use, personal data, legal sufficiency, compliance, approval, accreditation, and inspection-readiness claims blocked.

## Selected Pathway

- Stage: A level
- Pathway: England GCE A-level Economics, representative AQA 7136 route
- Subject/goal family: Microeconomics: individuals, firms, markets and market failure; price determination in a competitive market
- Boundary: Representative AQA route only; no whole-England awarding-body claim.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
| --- | --- | --- |
| `schema_v1` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `positive_negative_fixtures` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `england_deep_descriptor` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `flanders_deep_descriptor` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `england_crosswalk` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `flanders_crosswalk` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `transformation_specs` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `comparative_decision` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `authority_boundary` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |
| `final_human_review_stop` | met_for_selected_deepening_packet | Checker, specialist, final lead, PR, CI, and human review |

## Curriculum Mapping

| Concept | Book Scope | Status | Official Anchor | Known Gap |
| --- | --- | --- | --- | --- |
| `1.2.1_willingness_to_pay_individual_demand` | Book 1 Chapter 1.2 | `mapped` | England internal anchor for willingness to pay and individual demand: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `1.2.1_consumer_surplus` | Book 1 Chapter 1.2 | `mapped_with_boundary` | England internal anchor for consumer surplus: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `1.2.2_demand_factors_movement_vs_shift` | Book 1 Chapter 1.2 | `mapped` | England internal anchor for demand factors: a good's own price changes quantity demanded along the existing demand curve; non-price demand factors shift the whole demand curve. DfE subject content plus AQA 7136 microeconomics specification are representative only. | Requires future local expert review before any England prototype output. |
| `1.2.3_collective_demand` | Book 1 Chapter 1.2 | `mapped` | England internal anchor for market demand aggregation: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `1.2.4_mixed_demand_tasks` | Book 1 Chapter 1.2 | `mapped` | England internal anchor for mixed demand tasks: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `1.3.1_supply_curve_supply_factors` | Book 1 Chapter 1.3 | `mapped` | England internal anchor for supply curve and supply factors: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `1.3.2_market_equilibrium_shortage_surplus` | Book 1 Chapter 1.3 | `mapped` | England internal anchor for market equilibrium, shortage, and surplus: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `1.3.3_shifts_new_equilibrium` | Book 1 Chapter 1.3 | `mapped` | England internal anchor for new equilibrium after demand and supply shifts: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `1.3.4_mixed_supply_demand_tasks` | Book 1 Chapter 1.3 | `mapped` | England internal anchor for mixed supply-demand tasks: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | Requires future local expert review before any England prototype output. |
| `book1_output_boundary` | Book 1 Chapters 1.2 and 1.3 | `mapped` | England internal anchor for output boundary: DfE subject content plus AQA 7136 microeconomics specification; AQA is representative only. | No localized textbook, student-facing chapter, or teacher/school-facing route is generated. |

## Transformation Specification

### what_remains_unchanged

- Core supply-demand model logic.
- A good's own price causes movement along the existing demand curve; non-price demand factors shift the whole demand curve.
- Equilibrium, shortage, surplus, and causal reasoning.

### terminology_replacements

- vraaglijn -> demand curve
- aanbodlijn -> supply curve
- betalingsbereidheid -> willingness to pay
- marktevenwicht -> market equilibrium

### examples_requiring_localization

- Dutch consumer-product and tax examples require England context review.
- Any NHS, Ofgem, school, or pound-sterling example needs source support.

### institutions_requiring_replacement

- Dutch ministry/CvTE/Cito style institutions cannot be carried into England.
- Use DfE, Ofsted, and selected AQA references only inside their bounded roles.

### currency_unit_changes

- Euro examples should become pound sterling only when source/context supports it.
- Units must match AQA-style task context if assessment work is later authorized.

### graphs_and_conventions_requiring_change

- Use English P/Q labels and AQA-style command-word discipline.
- Keep diagrams representative until an exam-board task source is selected for implementation.

### assessment_tasks_requiring_replacement

- Replace Dutch mixed tasks with AQA-bounded task forms before any prototype.
- Do not translate Dutch tests into AQA exam questions.

### source_citations_required

- Ofsted EIF/operating guide for inspection boundary.
- DfE subject content for qualification content.
- AQA 7136 specification, scheme, command words, and assessment resources for representative awarding-body layer.
- SEND code for local accessibility terminology.

### extension_only_content

- Consumer surplus depth and any welfare diagram beyond selected AQA source use.
- Evaluation tasks until command-word/source review.

### excluded_content

- Country edition output.
- Localized student-facing chapters.
- Teacher/school-facing distribution.
- Legal sufficiency, compliance, approval, accreditation, or inspection-readiness claims.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| England deep descriptor satisfies the selected-jurisdiction internal readiness scope. | `core_requirement_met` | Nothing for internal human review of the deepening packet. | Proceeding to final comparative decision and human review. | Checker PASS, specialist reviewer PASS, final lead PASS, fresh PR, and green CI. |
| England keeps local implementation and school-facing authority blocked. | `scale_blocker` | Country editions, localized student-facing chapters, school-facing output, product routes, Scale Gate, student/product use, legal sufficiency, and compliance or inspection-readiness claims. | Internal overlay prototype planning after human acceptance. | Separate human-authorized prototype-planning gate with local source and expert review. |
