# GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1 Sprint Plan

Status: implemented_for_human_review
Date: 2026-06-25

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1-sprint-plan.md`
- Roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`
- Accepted planning decision: `PROCEED_TO_INTERNAL_OVERLAY_TRIAL_CONTRACT_DRAFT`

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

## Required Outputs

- `references/schemas/internal-overlay-trial-contract.schema.v1.json`
- `reports/inspection-standards/england-internal-overlay-trial-contract.md`
- `reports/inspection-standards/england-internal-overlay-trial-contract.json`
- `reports/inspection-standards/flanders-internal-overlay-trial-contract.md`
- `reports/inspection-standards/flanders-internal-overlay-trial-contract.json`
- `reports/inspection-standards/internal-overlay-trial-contract-validation.md`
- `reports/inspection-standards/internal-overlay-trial-contract-validation.json`
- `reports/inspection-standards/internal-overlay-no-output-trial-trace.md`
- `reports/inspection-standards/internal-overlay-no-output-trial-trace.json`
- `reports/inspection-standards/internal-overlay-trial-contract-decision.md`
- `reports/inspection-standards/internal-overlay-trial-contract-decision.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/positive/england-internal-overlay-trial-contract.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/positive/flanders-internal-overlay-trial-contract.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/unknown-source-ids.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/stale-sources.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/missing-crosswalk-rows.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/implicit-source-discovery.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/directory-globbing.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/localized-output-request.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/student-facing-output.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/teacher-school-facing-output.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/public-output.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/personal-data-fields.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/legal-compliance-claims.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/inspection-readiness-claims.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/support-accommodation-sufficiency.sample.json`
- `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/product-route-scale-gate.sample.json`
- `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1-sprint-plan.md`

## Review Workflow

- Schema/architecture lead review.
- England authority/source review.
- Flanders authority/source review.
- Teacher/economics review.
- Legal/privacy review.
- Accessibility/inclusion review.
- Final lead review.

## Human Review Return Condition

Return only after the schema, both jurisdiction contracts, fixtures, no-output trace, validation report, specialist corrections, final lead PASS, exact-head PR readiness proof, and green CI are complete.

## Decision

The implemented packet selects `PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION` for human review.
