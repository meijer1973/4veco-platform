# MTU-H5 RP-001/RP-002 Q3 Planning Packet

Generated: 2026-06-09

Status: `opened_planning_lane_no_mutation_authorized`

## Purpose

This packet opens the first MTU-H5 follow-up planning lane after approval of
the next governed repair packet. It couples:

- `MTU-H5-RP-001`: q3 annual insurance threshold operation gap.
- `MTU-H5-RP-002`: q3 stale A15 over-trigger guard.

These lanes should be planned together because a valid repair must both cover
the annual premium plus deductible threshold operation and prove that A15 price
elasticity is not triggered.

## Source

- Approved repair-packet gate:
  `reports/review-gates/GATE-MTU-H5-next-repair-packet/gate-closure.json`
- Source repair packet:
  `reports/mtu-hardening/mtu-h5-next-repair-packet.json`
- Source fixture:
  `reports/mtu-hardening/mtu-h5-regression-fixture.json`
- Reviewed packet commit:
  `bb1874e7d50023ee38e1afae8c4116cab3e0573b`

## Planning Questions

For `MTU-H5-RP-001`: decide whether q3's annual premium plus deductible
threshold comparison needs a new governed MTU or reviewed equivalent, or
whether an existing arithmetic route can be accepted as sufficient in a later
review.

For `MTU-H5-RP-002`: decide how q3 mapping can preserve the annual-cost
threshold operation while proving that A15 price elasticity is forbidden and
will fail if reintroduced.

## Required Future Evidence

- Official q3 correction-model operation evidence with stable source locators.
- Reviewed operation decomposition for monthly premium to annual cost plus
  deductible threshold comparison.
- Decision on whether existing A61/A96-style arithmetic and answer-form support
  is sufficient, insufficient, or only partial.
- Explicit q3 route tags proving annual-cost/threshold comparison, not price
  elasticity.
- Negative regression fixture or assertion that fails if A15 is reintroduced
  for q3.
- Proof that removing A15 does not remove required annual-threshold coverage.

## Next Review Deliverables

- q3 evidence table with record id, operation ids, source locators,
  answer-model summary, required MTU or explicit missing-MTU expectation,
  forbidden MTUs, route tags, answer-form hook, misconception hook, and
  procedure hook.
- Repair options matrix distinguishing reviewed-equivalent route,
  mapper/checker repair, and protected-reference mutation proposal.
- Negative regression requirement preserving the A15 over-trigger guard.
- Proof list for what must pass before either q3 lane may close.

## Boundary

No protected reference mutation, external-source mutation, machine-reference
mutation, authored target-exercise mutation, MTU minting/update/split/merge or
deprecation, operation registry mutation, answer-skill mutation, candidate
storage, candidate writes, lesson output, PV, diagnostics, adaptive routing,
mastery, sequencing, AI, summative use, product-route readiness claim, or
student/product use is authorized.

Next state: `ready_for_q3_human_planning_review`
