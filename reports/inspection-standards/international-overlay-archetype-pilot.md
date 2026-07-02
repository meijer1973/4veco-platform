# International Overlay Archetype Pilot

Status: four_archetype_pilot_complete
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

## Descriptor Summary

| Descriptor | Jurisdiction | Archetype | Boundary | Sources | Assessment status |
|---|---|---|---|---|---|
| `england.v0` | England | `national_inspectorate_plus_qualification` | England-only | 3 | not_covered_in_descriptor |
| `flanders.v0` | Belgium / Flanders | `subnational_quality_framework` | Flanders-only | 3 | not_covered_in_descriptor |
| `bavaria.v0` | Bavaria / Germany | `federal_land_curriculum` | KMK context plus Bavaria Land overlay | 3 | covered_for_federal_context_only |
| `california.v0` | California / United States | `state_standards_with_federal_accountability_context` | California state standards plus U.S. federal accountability context | 3 | not_covered_in_descriptor |

## Archetype Controls

| Archetype | Risk | Control |
|---|---|---|
| National inspectorate plus qualification-content model | Whole-UK overgeneralisation and exam-board substitution. | England-only boundary and DfE subject-content source separate from exam-board specifications. |
| Subnational quality-framework and curriculum-goals model | All-Belgium claims from Flemish sources. | Flanders-only boundary and separate curriculum/quality source roles. |
| Federal coordination plus Land curriculum model | Single-Germany curriculum or inspection claim. | KMK source family is federal context only; Bavaria is representative Land overlay only. |
| State standards with federal accountability context | National-US inspection, accreditation, or standards claim. | California state standards are local; U.S. Department of Education material is federal accountability context only. |

## Output Allowlist Policy

Only OUTPUT_PATHS from build-scripts/inspection/build-international-overlay-architecture.js may be written; descriptors are explicit and no directory globbing or implicit source discovery is permitted.

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
|---|---|---|---|---|
| The four selected descriptors cover the required governance archetypes without creating country editions. | `core_requirement_met` | Nothing for human review of this architecture packet. | Selected-jurisdiction deepening if the human owner approves the bounded decision. | Country/source reviews, governance/legal/accessibility reviews, final lead PASS, currentness checker PASS, and green CI. |
| Every descriptor carries local assessment, school-owned evidence, and authority gaps. | `minor_carry_flag` | Any local edition, teacher/school-facing output, compliance, approval, inspection-readiness, assessment-readiness, or public claim. | Internal architecture decision. | Separate authorised local source-refresh gate per jurisdiction. |
| The architecture remains internal-only and manually invoked. | `scale_blocker` | Evidence-pack generation, dashboard/package/CI product integration, quality-ref, Scale Gate, product-route adoption, diagnostics/mastery/PV, student/product-use, personal data, OP0, PTA, and summative claims. | Repository PR validation and human review. | Explicit future human approval for any downstream authority. |
