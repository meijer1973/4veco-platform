# Belgium / Flanders Overlay Deepening

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

- Stage: Secundair onderwijs, 3de graad
- Pathway: Doorstroomfinaliteit, basisvorming
- Subject/goal family: Economic/financial competences, official goal family SC11; exact candidate anchor SC11.05 market mechanism on the product market
- Boundary: No school-network, study-direction, or school-specific curriculum plan is used.

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
| `1.2.1_willingness_to_pay_individual_demand` | Book 1 Chapter 1.2 | `mapped_with_boundary` | Goal SC11.05 market mechanism on the product market is the exact candidate anchor for willingness to pay and individual demand. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.2.1_consumer_surplus` | Book 1 Chapter 1.2 | `extension_only` | No exact official minimum-goal anchor is claimed for consumer surplus; keep as extension-only or school/network-dependent. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.2.2_demand_factors_movement_vs_shift` | Book 1 Chapter 1.2 | `mapped_with_boundary` | Goal SC11.05 market mechanism on the product market is the exact candidate anchor; the internal mapping must keep own-price movement along the existing demand curve separate from non-price demand-factor shifts of the curve. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.2.3_collective_demand` | Book 1 Chapter 1.2 | `extension_only` | No exact official minimum-goal anchor is claimed for market demand aggregation; keep as extension-only or school/network-dependent. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.2.4_mixed_demand_tasks` | Book 1 Chapter 1.2 | `mapped_with_boundary` | Goal SC11.05 market mechanism on the product market is the exact candidate anchor for mixed demand tasks. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.3.1_supply_curve_supply_factors` | Book 1 Chapter 1.3 | `mapped_with_boundary` | Goal SC11.05 market mechanism on the product market is the exact candidate anchor for supply curve and supply factors. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.3.2_market_equilibrium_shortage_surplus` | Book 1 Chapter 1.3 | `mapped_with_boundary` | Goal SC11.05 market mechanism on the product market is the exact candidate anchor for market equilibrium, shortage, and surplus. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.3.3_shifts_new_equilibrium` | Book 1 Chapter 1.3 | `mapped_with_boundary` | Goal SC11.05 market mechanism on the product market is the exact candidate anchor for new equilibrium after demand and supply shifts. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `1.3.4_mixed_supply_demand_tasks` | Book 1 Chapter 1.3 | `mapped_with_boundary` | Goal SC11.05 market mechanism on the product market is the exact candidate anchor for mixed supply-demand tasks. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |
| `book1_output_boundary` | Book 1 Chapters 1.2 and 1.3 | `extension_only` | No exact official minimum-goal anchor is claimed for output boundary; keep as extension-only or school/network-dependent. | School network curricula, study-direction depth, assessment practice, and local teacher judgement remain outside this descriptor. |

## Transformation Specification

### what_remains_unchanged

- Core supply-demand model logic.
- A good's own price causes movement along the existing demand curve; non-price demand factors shift the whole demand curve.
- Equilibrium, shortage, surplus, and causal reasoning.

### terminology_replacements

- vraaglijn/vraagcurve requires Flemish terminology review
- aanbodlijn/aanbodcurve requires Flemish terminology review
- doeloefening label requires local task-language review

### examples_requiring_localization

- Dutch institutional examples require Flemish Community context review.
- Any school-quality example must remain school-owned and not product evidence.

### institutions_requiring_replacement

- Dutch national institutions cannot be treated as Flemish.
- Use Flemish Community/OK/official goals references only inside their bounded roles.

### currency_unit_changes

- Euro currency can remain, but Belgian/Flemish institutional context must be checked.
- Dutch tax/benefit values cannot be carried over.

### graphs_and_conventions_requiring_change

- Dutch labels can remain only after Flemish terminology check.
- No school/network graph convention is claimed.

### assessment_tasks_requiring_replacement

- Replace Dutch mixed tasks with locally reviewed formative tasks before any prototype.
- No central Flemish mark scheme is inferred.

### source_citations_required

- Onderwijsdoelen.be for official goal family.
- OK framework for quality boundary.
- Onderwijsinspectie source for inspection-method boundary.

### extension_only_content

- Consumer surplus and collective demand unless exact Flemish goals or network curriculum support them.
- Any assessment rubric or school-quality evidence.

### excluded_content

- Country edition output.
- Localized student-facing chapters.
- Teacher/school-facing distribution.
- Legal sufficiency, compliance, approval, accreditation, or inspection-readiness claims.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Flanders deep descriptor satisfies the selected-jurisdiction internal readiness scope. | `core_requirement_met` | Nothing for internal human review of the deepening packet. | Proceeding to final comparative decision and human review. | Checker PASS, specialist reviewer PASS, final lead PASS, fresh PR, and green CI. |
| Flanders keeps local implementation and school-facing authority blocked. | `scale_blocker` | Country editions, localized student-facing chapters, school-facing output, product routes, Scale Gate, student/product use, legal sufficiency, and compliance or inspection-readiness claims. | Internal overlay prototype planning after human acceptance. | Separate human-authorized prototype-planning gate with local source and expert review. |
