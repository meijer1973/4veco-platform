# International Overlay Descriptor Contract

Status: internal descriptor contract
Date: 2026-06-22
Sprint: `GOAL-IQS-OVERLAY-ARCHITECTURE-1`

This contract defines internal-only jurisdiction overlay descriptors. It does not create a country edition, public output, teacher/school-facing output, evidence pack, product route, Scale Gate input, diagnostics/mastery/PV path, student/product-use authority, personal-data processing, compliance claim, approval claim, OP0 claim, PTA claim, summative-validity claim, or inspection-readiness claim.

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

## Descriptor Fields

| Field | Requirement |
|---|---|
| `schema_version` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `descriptor_id` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `jurisdiction_id` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `jurisdiction_label` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `governance_archetype` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `status` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `jurisdiction_boundary` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `authority_type` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `official_source_allowlist` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `source_freshness` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `curriculum_mappings` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `assessment_mappings` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `terminology_substitutions` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `institution_example_substitutions` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `accessibility_inclusion_terminology` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `school_owned_evidence_boundary` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `forbidden_claims` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `proof_required_to_close` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `output_boundary` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |
| `finding_classification` | Required by `references/schemas/international-jurisdiction-overlay.schema.json`. |

## Source And Output Allowlists

- Each descriptor owns an explicit `official_source_allowlist`.
- The builder writes only the `OUTPUT_PATHS` allowlist in `build-scripts/inspection/build-international-overlay-architecture.js`.
- Directory globbing, implicit source discovery, generated lesson-output scanning, country-edition generation, and public/school-facing export are out of scope.

## Descriptor Files

- `references/data/inspection-standards/overlays/england.v0.json`
- `references/data/inspection-standards/overlays/flanders.v0.json`
- `references/data/inspection-standards/overlays/bavaria.v0.json`
- `references/data/inspection-standards/overlays/california.v0.json`
