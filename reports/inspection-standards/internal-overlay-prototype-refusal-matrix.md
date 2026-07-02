# Internal Overlay Trial Refusal Matrix

Status: refusal_matrix_ready
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

## Refusal Cases

| Args | Expected refusal code | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| `--country-edition` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--localized-chapter` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--teacher` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--school-facing` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--public` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--external` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--evidence-pack` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--student-facing` | `STOP_FORBIDDEN_AUDIENCE_OR_OUTPUT` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--prototype-runtime` | `STOP_FORBIDDEN_RUNTIME` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--execute-prototype` | `STOP_FORBIDDEN_RUNTIME` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--product-route` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--scale` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--diagnostics` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--mastery` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--pv` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--student` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--personal` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--data-processing` | `STOP_DOWNSTREAM_AUTHORITY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--legal-sufficiency` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--compliance` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--approval` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--approved` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--accreditation` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--inspection-ready` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--inspection-readiness` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--op0` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--pta` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--summative` | `STOP_COMPLIANCE_APPROVAL_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--support-sufficiency` | `STOP_SUPPORT_ACCOMMODATION_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--accommodation-sufficiency` | `STOP_SUPPORT_ACCOMMODATION_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--individual-adjustment` | `STOP_SUPPORT_ACCOMMODATION_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--reasonable-adjustments` | `STOP_SUPPORT_ACCOMMODATION_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--support-records` | `STOP_SUPPORT_ACCOMMODATION_CLAIM` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--all-belgium` | `STOP_GOVERNANCE_OVERGENERALISATION` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--whole-uk` | `STOP_GOVERNANCE_OVERGENERALISATION` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--aqa-approval` | `STOP_GOVERNANCE_OVERGENERALISATION` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--glob` | `STOP_IMPLICIT_DISCOVERY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--implicit-source` | `STOP_IMPLICIT_DISCOVERY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--scan-generated-lessons` | `STOP_IMPLICIT_DISCOVERY` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--package` | `STOP_FORBIDDEN_INTEGRATION` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--ci` | `STOP_FORBIDDEN_INTEGRATION` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--dashboard` | `STOP_FORBIDDEN_INTEGRATION` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |
| `--quality-ref` | `STOP_FORBIDDEN_INTEGRATION` | The requested mode would exceed internal overlay trial-planning authority. | Manual internal planning report generation with exact allowlists. | Generator and checker refusal tests continue to pass. |

## Finding Classification

| Finding | Classification | blocks | does_not_block | proof_required_to_close |
| --- | --- | --- | --- | --- |
| Forbidden modes fail closed before any output beyond the allowlisted planning records. | `core_requirement_met` | Forbidden audience, authority, integration, implicit-discovery, or compliance modes. | Manual internal planning generation. | Focused refusal tests and checker PASS. |
