# Book 1 Chapters 1.2 And 1.3 Overlay Crosswalk

Status: book1_crosswalk_complete
Date: 2026-06-22
Sprint: `GOAL-IQS-OVERLAY-ARCHITECTURE-1`

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-OVERLAY-ARCHITECTURE-1/GOAL-IQS-OVERLAY-ARCHITECTURE-1-sprint-plan.md`
- Foundation decision source: `reports/inspection-standards/international-foundation-decision.md`

## Non-Negotiable Requirements

- Cite the product end-state and original sprint/gate specification.
- Cite the accepted GOAL-IQS-FOUNDATION-1 decision and preserve its authority boundaries.
- Name non-negotiable requirements before conclusions.
- Include a core-requirement checklist.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- Do not carry any missing core requirement as PASS WITH FLAGS.
- Generate exactly the allowlisted overlay schema, four descriptors, governance docs, crosswalk, pilot report, and decision report.
- Use explicit per-scope source and output allowlists; do not glob directories or discover sources implicitly.
- Keep all country-edition, compliance, approval, public, school-facing, product-route, Scale Gate, diagnostics/mastery/PV, student-use, personal-data, OP0, PTA, summative, and inspection-readiness authority blocked.

## Core-Requirement Checklist

| Requirement | Status | proof_required_to_close |
|---|---|---|
| `overlay_schema`: The descriptor schema names every required overlay field and blocks implicit source/output discovery. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `four_archetype_descriptors`: England, Flanders, Bavaria/Germany, and California/United States descriptors are generated as contrasting governance archetypes. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `official_source_allowlists`: Each descriptor carries explicit official-source allowlists with authority type, allowed use, and forbidden inference. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `curriculum_assessment_mapping`: Each descriptor separates curriculum mapping from assessment/exam mapping and names v0 gaps. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `book1_crosswalk`: Book 1 Chapters 1.2 and 1.3 are crosswalked to the four descriptors without country-edition output. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `school_owned_boundary`: Every descriptor preserves school-owned evidence, implementation, inspection, accreditation, and accountability boundaries. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `accessibility_inclusion_terms`: Each descriptor records local accessibility/inclusion terminology without compliance claims. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `refusal_and_stop_conditions`: Generator and checker refuse forbidden audiences, claims, integrations, and governance overgeneralisations. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `single_decision`: The architecture chooses exactly one allowed decision. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |
| `human_review_stop`: The packet returns only after all descriptors, crosswalk, validators, specialist reviews, and final PR proof are complete. | `met_for_overlay_architecture` | Generator/checker PASS, specialist reviews PASS after corrections, final lead PASS, fresh branch, green platform CI, and human review. |

## Scope Boundary

- Book scope: Book 1 Chapters 1.2 and 1.3
- Evidence status: `route-local-only evidence status`
- School-owned evidence still needed: `true`
Repo-relative lesson pointers identify the current product surfaces. They are not generated lesson-output scans and do not authorise country-edition output.

## Crosswalk Rows

| Concept | Book scope | Product core | England | Flanders | Bavaria/Germany | California/US | proof_required_to_close |
|---|---|---|---|---|---|---|---|
| `1.2.1_willingness_to_pay_individual_demand` | Book 1 Chapter 1.2 | Willingness to pay, individual demand, buy/no-buy decisions, and demand curve reasoning are portable product-pedagogy concepts. | Translate to A level economics vocabulary and later map to DfE topic/assessment-objective language. | Retain Dutch-language concepts only after Flemish curriculum-goal mapping and terminology review. | Map to Nachfrage/Zahlungsbereitschaft only where Bavaria WR12 or another Land route supports placement. | Map to California HSS-PoE economic reasoning and market-economy standards before adaptation. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.2.1_consumer_surplus` | Book 1 Chapter 1.2 | Consumer surplus diagrams and stepwise price-quantity reasoning can be reused internally as a concept family. | Check subject-content depth and exam-board treatment before claiming fit. | Keep as a candidate economics concept pending exact goal mapping. | Treat Konsumentenrente as placement-sensitive and review before local use. | Use only if California standards/framework mapping supports depth; otherwise mark as extension. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.2.2_demand_factors_movement_vs_shift` | Book 1 Chapter 1.2 | Own-price movement along a demand curve is distinct from a demand-curve shift caused by income, preferences, substitutes, complements, population, or expectations. | Use English demand-factor terminology and guard against exam-board-specific command words. | Review local examples and Flemish wording for substitutes/complements and income effects. | Translate into Nachfragefaktoren and local example contexts; confirm Land placement. | Map to incentives, substitutes, and law-of-demand standards where exact standards support it. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.2.3_collective_demand` | Book 1 Chapter 1.2 | Aggregating individual demand into market demand is portable if local curriculum depth supports it. | Check whether market demand aggregation is required or assumed under A level content. | Map to exact Flemish economic/financial-economic goals before output use. | Confirm whether aggregation sits in WR12, a lower grade, or a different Land content path. | Use as market-economy reasoning where standards/framework support aggregation. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.2.4_mixed_demand_tasks` | Book 1 Chapter 1.2 | Mixed demand tasks are useful internal task-family evidence but not local assessment proof. | Replace task forms only after exam-board source review. | Do not infer Flemish assessment fit from Dutch mixed exercises. | Review task verbs, contexts, and difficulty against Land expectations. | Keep as formative practice only; no California assessment mapping is included. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.3.1_supply_curve_supply_factors` | Book 1 Chapter 1.3 | Supply curve, movement along supply, supply shifts, input costs, technology, expectations, and policy factors are portable concept families. | Use A level economics terminology and assessment-objective review later. | Confirm Flemish goal mapping and example contexts. | Map to Angebot/Angebotskurve and Bavaria WR12 market/production context. | Map to law of supply and incentive standards before local use. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.3.2_market_equilibrium_shortage_surplus` | Book 1 Chapter 1.3 | Demand/supply intersection, equilibrium price/quantity, shortage, surplus, and price adjustment are core market-model reasoning. | Separate concept transfer from exam-board graph conventions. | Retain as internal concept family pending Flemish curriculum-goal mapping. | Review with Bavaria market/production context and German terminology. | Map to market economy and supply/demand standards. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.3.3_shifts_new_equilibrium` | Book 1 Chapter 1.3 | Demand/supply shifts, new equilibrium reasoning, and two-shift ambiguity are portable if local examples are substituted. | Check command-word and graph-label conventions later. | Review Flemish examples and preserve separation from school-quality evidence. | Use German graph labels and confirm local scenario fit. | Use state/local examples only after source review; no district adoption claim. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `1.3.4_mixed_supply_demand_tasks` | Book 1 Chapter 1.3 | Mixed supply-demand exercises are internal product-quality evidence and candidate formative practice only. | No exam-board mapping without awarding-body sources. | No Flemish assessment claim without assessment source refresh. | No Abitur-readiness claim from generic tasks. | No California assessment or district-use claim. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |
| `book1_output_boundary` | Book 1 Chapters 1.2 and 1.3 | The crosswalk can discuss current product concepts, generated chapter structure, and route-local proof status only. | No England country edition, school-facing output, or public route. | No Flemish edition or all-Belgium claim. | No Bavaria/Germany edition or whole-Germany claim. | No California/U.S. edition, district adoption, or national-US claim. | Exact local source mapping, source reviewer PASS, teacher/economics PASS, legal/claims PASS, accessibility/inclusion PASS, final lead PASS, and human approval before implementation. |

## Forbidden Inferences

- The crosswalk proves local curriculum compliance.
- The crosswalk proves school inspection, accountability, accreditation, or exam readiness.
- The crosswalk authorizes public, teacher/school-facing, student/product-use, or country-edition output.
- The crosswalk can substitute local expert or competent-authority review.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| Book 1 Chapters 1.2 and 1.3 have a portable economics concept core suitable for internal overlay mapping. | `core_requirement_met` | Nothing for internal architecture review. | Human review of the architecture packet. | Teacher/economics reviewer PASS and checker PASS. |
| The crosswalk is not a local curriculum, assessment, or inspection proof. | `scale_blocker` | Country editions, exam-readiness, inspection-readiness, public/school-facing output, product routes, and Scale Gate use. | Internal common-core and overlay architecture. | Separate local source-refresh and implementation gate. |
| Some concept placement and terminology depth remains jurisdiction-specific. | `minor_carry_flag` | Direct adaptation without local expert review. | Internal selected-jurisdiction deepening if approved. | Local teacher/economics review before any selected-jurisdiction implementation. |
