# Sprint REVIEW-THROUGHPUT-2: Baseline

Generated: 2026-06-14

## Plan reference

- Plan: `reports/sprints/REVIEW-THROUGHPUT-2-plan.md`
- Plan metadata: `references/data/sprints/REVIEW-THROUGHPUT-2.plan.json`

## Current state

`REVIEW-THROUGHPUT-1` established the review-throughput policy, schema, checker,
and fixtures. The repository already has a callable
`check:review-throughput` package script, but active review-packet generators do
not yet share a helper for the required packet fields.

Existing review packets are mixed historical artifacts. A repository-wide CI
gate over every `review-packet.json` would currently fail old packets that
predate the field contract, so rollout must be focused on adopted generators
first.

## Data integrity notes

Protected reference data is not changed at baseline. This sprint must not edit
`references/machine/`, `references/external/`, generated lesson output, product
specifications, diagnostics, mastery, PV, Scale Gate 1, or student/product-use
authority.
