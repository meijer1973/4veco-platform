# GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1 Sprint Plan

Status: implemented_for_review
Date: 2026-06-27

## Product End-State And Original Spec

- Product end-state: `../4veco-lessen/specifications/product-end-state.md`
- Product end-state checkout note: Cross-repo citation: resolve through the paired 4veco-lessen checkout used for human review; this platform packet does not copy lesson-repo product state.
- Original sprint/gate spec: `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-sprint-plan.md`
- Roadmap: `docs/roadmaps/quality-standards/international-quality-standards-roadmap.md`

## End Goal

Deliver a complete, machine-validated, human-reviewable England/Flanders bounded source-refresh packet that defines official source inventory, freshness checks, result states, refusals, expert-review template, and review gates without executing source refresh.

## Non-Negotiable Requirements

- Use REV-STD-1 and cite product end-state plus the original sprint/gate spec.
- Use only explicit per-scope source and output allowlists.
- Do not execute source refresh, contact local experts, or substitute local expert judgement.
- Do not produce localized, student-facing, teacher/school-facing, public, product-route, evidence-pack, Scale Gate, diagnostics/mastery/PV, or package/CI output.
- Do not process personal data or make legal, compliance, approval, accreditation, OP0, PTA, summative, inspection-readiness, support-sufficiency, accommodation-sufficiency, or accessibility/legal-sufficiency claims.
- Classify findings and carried issues with blocks, does_not_block, and proof_required_to_close.
- PASS WITH FLAGS may not carry a missing core requirement.

## Required Outputs

- `references/schemas/bounded-source-refresh-packet.schema.v1.json`
- `docs/inspection-standards/bounded-source-refresh-packet-contract.md`
- `docs/inspection-standards/england-bounded-source-refresh-packet.md`
- `docs/inspection-standards/flanders-bounded-source-refresh-packet.md`
- `docs/inspection-standards/local-expert-review-request-template.md`
- `reports/inspection-standards/bounded-source-refresh-packet-plan.md`
- `reports/inspection-standards/bounded-source-refresh-packet-plan.json`
- `reports/inspection-standards/england-bounded-source-refresh-simulation.md`
- `reports/inspection-standards/england-bounded-source-refresh-simulation.json`
- `reports/inspection-standards/flanders-bounded-source-refresh-simulation.md`
- `reports/inspection-standards/flanders-bounded-source-refresh-simulation.json`
- `reports/inspection-standards/bounded-source-refresh-packet-decision.md`
- `reports/inspection-standards/bounded-source-refresh-packet-decision.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/england-bounded-source-refresh-simulation.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/flanders-bounded-source-refresh-simulation.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/positive/bounded-source-refresh-packet-decision.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/non-official-source.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/source-refresh-executed.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/local-expert-contacted.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/local-expert-substituted.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/localized-output.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/personal-data.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/compliance-claim.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/support-sufficiency-claim.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/whole-uk-claim.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/all-belgium-claim.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/missing-refresh-state.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/missing-source-inventory.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/official-url-mismatch.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/hidden-discovery.sample.json`
- `references/data/inspection-standards/fixtures/bounded-source-refresh-packet/negative/expert-legal-advice.sample.json`
- `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-sprint-plan.md`
- `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-validation-log.md`
- `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-correction-log.md`
- `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-closure-record.md`
- `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-specialist-reviews.md`
- `archive/sprints/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1/GOAL-IQS-BOUNDED-SOURCE-REFRESH-PACKET-1-final-lead-review.md`

## Selected Decision

Selected for human review: `PROCEED_TO_SOURCE_REFRESH_EXECUTION_PILOT`

