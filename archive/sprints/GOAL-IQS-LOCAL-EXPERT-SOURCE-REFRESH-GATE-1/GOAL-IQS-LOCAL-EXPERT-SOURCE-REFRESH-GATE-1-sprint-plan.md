# GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1 Sprint Plan

Status: implemented_for_review
Date: 2026-06-26

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-sprint-plan.md`
- Roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

## End Goal

Deliver a complete internal gate design and simulation for England/Flanders local expert and source refresh planning without executing source refresh or substituting local experts.

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Cite the accepted no-output simulation decision and preserve the no-output/no-runtime/no-product-authority boundary.
- Define local expert role contract fields without substituting local expert judgement.
- Define source-refresh protocol fields without executing source refresh.
- Use explicit source and output allowlists only; no directory globbing or generated lesson-output scanning.
- Include England and Flanders jurisdiction-specific gates.
- Simulate source-refresh gate classification cases without refreshing sources or producing localized output.
- Refuse forbidden audiences, claims, integrations, product routes, Scale Gate, diagnostics/mastery/PV, personal data, support/accommodation sufficiency, and compliance/inspection-readiness claims.
- Classify findings with blocks, does_not_block, and proof_required_to_close.
- PASS WITH FLAGS may not carry a missing core requirement.

## Required Outputs

- `references/schemas/local-expert-source-refresh-gate.schema.v1.json`
- `docs/inspection-standards/local-expert-source-refresh-gate-contract.md`
- `docs/inspection-standards/england-local-expert-source-gate.md`
- `docs/inspection-standards/flanders-local-expert-source-gate.md`
- `reports/inspection-standards/local-expert-source-refresh-gate-plan.md`
- `reports/inspection-standards/local-expert-source-refresh-gate-plan.json`
- `reports/inspection-standards/england-source-refresh-gate-simulation.md`
- `reports/inspection-standards/england-source-refresh-gate-simulation.json`
- `reports/inspection-standards/flanders-source-refresh-gate-simulation.md`
- `reports/inspection-standards/flanders-source-refresh-gate-simulation.json`
- `reports/inspection-standards/local-expert-source-refresh-gate-decision.md`
- `reports/inspection-standards/local-expert-source-refresh-gate-decision.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/england-source-refresh-gate-simulation.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/positive/flanders-source-refresh-gate-simulation.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/non-official-source.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/source-refresh-executed.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/local-expert-substituted.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/localized-output.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/student-facing-output.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/teacher-school-output.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/public-output.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/personal-data.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/compliance-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/support-sufficiency-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/whole-uk-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/all-belgium-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/missing-source-condition.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/missing-england-source-allowlist.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/official-url-mismatch.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/individual-adjustment-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/reasonable-adjustment-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/learner-support-record-claim.sample.json`
- `references/data/inspection-standards/fixtures/local-expert-source-refresh-gate/negative/support-records-personal-data.sample.json`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-sprint-plan.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-validation-log.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-correction-log.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-closure-record.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-specialist-reviews.md`
- `archive/sprints/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1/GOAL-IQS-LOCAL-EXPERT-SOURCE-REFRESH-GATE-1-final-lead-review.md`

## Selected Decision

Selected for human review: `PROCEED_TO_BOUNDED_SOURCE_REFRESH_PACKET`
