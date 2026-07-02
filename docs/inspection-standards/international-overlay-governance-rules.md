# International Overlay Governance Rules

Status: internal governance rules
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

## Governance Archetypes

| Archetype | Descriptor | Risk | Control |
|---|---|---|---|
| National inspectorate plus qualification-content model | `england` | Whole-UK overgeneralisation and exam-board substitution. | England-only boundary and DfE subject-content source separate from exam-board specifications. |
| Subnational quality-framework and curriculum-goals model | `flanders` | All-Belgium claims from Flemish sources. | Flanders-only boundary and separate curriculum/quality source roles. |
| Federal coordination plus Land curriculum model | `bavaria` | Single-Germany curriculum or inspection claim. | KMK source family is federal context only; Bavaria is representative Land overlay only. |
| State standards with federal accountability context | `california` | National-US inspection, accreditation, or standards claim. | California state standards are local; U.S. Department of Education material is federal accountability context only. |

## Stop Conditions

- Stop on country-edition generation.
- Stop on public, teacher/school-facing, student/product-use, product-route, dashboard, package/CI product-integration, quality-ref, or Scale Gate use.
- Stop on compliance, approval, inspection-readiness, OP0, PTA, summative, accreditation, or school-owned-evidence claims.
- Stop on all-Belgium, whole-UK, single-Germany, national-US, or California-as-US overgeneralisation.
- Stop on source/output discovery outside explicit allowlists.

## Proof Required Before Any Later Local Work

- Fresh official source allowlist for the selected jurisdiction.
- Country/source reviewer PASS.
- Teacher/economics reviewer PASS.
- Legal/privacy and claims reviewer PASS.
- Accessibility/inclusion reviewer PASS.
- Final lead reviewer PASS.
- Human owner approval for the next bounded step.
