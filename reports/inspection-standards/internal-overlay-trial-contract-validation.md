# Internal Overlay Trial Contract Validation

Status: complete_internal_validation

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1/GOAL-IQS-INTERNAL-OVERLAY-TRIAL-CONTRACT-1-sprint-plan.md`

## Validation Summary

- England rows: 10
- Flanders rows: 10
- Total rows: 20
- Allowed transformation actions: `unchanged_core`, `terminology_change`, `example_change`, `institution_change`, `assessment_change`, `extension_only`, `exclude`

## Schema Strictness

- Schema file: `references/schemas/internal-overlay-trial-contract.schema.v1.json`
- Strict nested schema: true
- Contract rows per jurisdiction: 10
- Exact no-output false flags: true
- Exact decision tuple: `PROCEED_TO_INTERNAL_NO_OUTPUT_TRIAL_SIMULATION`, `REVISE_TRIAL_CONTRACT`, `STOP_INTERNAL_OVERLAY_PROTOTYPE_TRACK`
- Checker enforcement: The schema is generated and then inspected by build-scripts/inspection/check-internal-overlay-trial-contract.js. Dynamic source-ID exactness remains checker-enforced against the selected descriptor allowlists.

## Fixture Coverage

| Fixture | Expected |
| --- | --- |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/positive/england-internal-overlay-trial-contract.sample.json` | PASS |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/positive/flanders-internal-overlay-trial-contract.sample.json` | PASS |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/unknown-source-ids.sample.json` | `STOP_UNKNOWN_SOURCE_ID` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/stale-sources.sample.json` | `STOP_STALE_SOURCE` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/missing-crosswalk-rows.sample.json` | `STOP_MISSING_CROSSWALK_ROW` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/implicit-source-discovery.sample.json` | `STOP_IMPLICIT_SOURCE_DISCOVERY` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/directory-globbing.sample.json` | `STOP_DIRECTORY_GLOBBING` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/localized-output-request.sample.json` | `STOP_LOCALIZED_OUTPUT` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/student-facing-output.sample.json` | `STOP_STUDENT_FACING_OUTPUT` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/teacher-school-facing-output.sample.json` | `STOP_TEACHER_SCHOOL_FACING_OUTPUT` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/public-output.sample.json` | `STOP_PUBLIC_OUTPUT` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/personal-data-fields.sample.json` | `STOP_PERSONAL_DATA` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/legal-compliance-claims.sample.json` | `STOP_LEGAL_COMPLIANCE_CLAIM` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/inspection-readiness-claims.sample.json` | `STOP_INSPECTION_READINESS_CLAIM` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/support-accommodation-sufficiency.sample.json` | `STOP_SUPPORT_ACCOMMODATION_CLAIM` |
| `references/data/inspection-standards/fixtures/internal-overlay-trial-contract/negative/product-route-scale-gate.sample.json` | `STOP_PRODUCT_OR_SCALE_GATE` |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Validation covers schema, row completeness, source IDs, source freshness, no-output flags, and refusal fixtures. | `core_requirement_met` | Nothing for human review of this validation packet. | Internal no-output trial-contract decision. | Checker PASS, focused Jest PASS, specialist reviews, final lead PASS, exact-head readiness, green CI, and human review. |
| Negative fixtures prove forbidden audiences, claims, discovery, source, personal-data, and integration requests fail closed. | `core_requirement_met` | Any attempt to bypass refusal checks. | Internal validation of the no-output contract. | Checker fixture output remains PASS. |
