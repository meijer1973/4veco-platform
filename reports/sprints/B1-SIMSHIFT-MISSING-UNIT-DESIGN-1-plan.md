# B1-SIMSHIFT-MISSING-UNIT-DESIGN-1 Plan

Status: planned REV-STD-1 design decision packet

## Purpose

This sprint prepares the bounded design decision for the unresolved
simultaneous demand/supply shift dependency in Book 1 paragraph `1.3.3`
(`Verschuivingen en nieuw evenwicht`).

The lane exists because `B1-MIGRATED-V5-TARGET-QUALITY-1` kept `1.3.3`
non-final: its one-shift equilibrium and graphing chain maps to live MTUs, but
its final item asks students to reason about simultaneous demand and supply
shifts where quantity can be determinate while price is ambiguous without
relative magnitudes.

This sprint does not mint an MTU, edit protected references, promote `1.3.3`,
generate lesson output, close Year 1, close CP-6, or authorize Scale Gate,
diagnostics, mastery, PV, product-route adoption, or student/product use.

## Required Citations

- Product end-state:
  `../4veco-lessen/specifications/product-end-state.md`
- Review standard:
  `reports/sprints/REV-STD-1-flag-disposition.md`
- Original target-quality sprint:
  `reports/sprints/B1-MIGRATED-V5-TARGET-QUALITY-1-plan.md`
- Prior target-quality review packet:
  `reports/reference-planning/B1-MIGRATED-V5-TARGET-QUALITY-1-review-packet.md`
- Current target registry:
  `references/authored/course-target-exercises.json`
- MTU backfill classification:
  `reports/reference-planning/CP.6c-mtu-backfill-classification.md`
- Precision reference:
  `references/authored/economic_mathematical_precision_reference.md`

Product end-state requirement used here: every paragraph must be built
backward from a paragraph target exercise, and later target-equivalent proof
must cover the target operation chain at the same cognitive level with matching
answer forms.

## Non-Negotiable Requirements

1. Cite the product end-state and this sprint plan in the review packet.
2. Cite the original sprint/gate spec that created the carried blocker.
3. Name non-negotiables and include a core-requirement checklist.
4. Classify findings using REV-STD-1 language.
5. Include `blocks`, `does_not_block`, and `proof_required_to_close` for
   carried issues.
6. Do not use `PASS WITH FLAGS` to carry a missing core requirement.
7. Do not edit `references/machine/*`, `references/external/*`,
   `references/authored/course-target-exercises.json`, or
   `references/owned/course-blueprint-v5.md`.
8. Do not generate or alter lesson output under `../4veco-lessen`.
9. Do not mark `1.3.3` `reviewed_final` in this lane.
10. Do not mint a new MTU or assign a final MTU id in this lane.
11. Preserve the `1.3.4` one-shift mixed-target boundary.
12. Preserve `1.3.1` and `1.3.2` reviewed-final target-registry status.
13. Do not claim Year 1 closure, CP-6 closure, Scale Gate authority,
    product-route adoption, diagnostics, mastery, PV, or student/product use.

## Scope

In scope:

- decide the recommended route for the `1.3.3` simultaneous-shift dependency;
- define the operation chain and answer form that a later governed MTU or
  target rewrite would need to cover;
- preserve the current blocker status until a later protected-reference lane
  executes the chosen path.

Out of scope:

- protected machine/external/authored/owned reference mutation;
- generated lesson output;
- target finality mutation;
- student-facing route, diagnostics, mastery, PV, or Scale Gate claims.

## Deliverables

- `reports/reference-planning/B1-SIMSHIFT-MISSING-UNIT-DESIGN-1-review-packet.md`
- `reports/reference-planning/B1-SIMSHIFT-MISSING-UNIT-DESIGN-1-quality-log.md`
- `reports/review-gates/B1-SIMSHIFT-MISSING-UNIT-DESIGN-1/review-packet.json`
- `reports/sprints/B1-SIMSHIFT-MISSING-UNIT-DESIGN-1-result.md`
- Generated repository maps, URL index, dashboard, source manifest, document
  inventory, and source-document registry refreshed after the packet is
  written.

## Acceptance Criteria

- The review packet is REV-STD-1 compliant.
- `1.3.3` remains non-final and no protected registry is mutated.
- The packet names the recommended route and rejected alternatives.
- The packet states which outcomes remain blocked and what proof is required
  to close them.
- Packet-specific review-throughput validation passes:
  `npm.cmd run check:review-throughput -- reports/review-gates/B1-SIMSHIFT-MISSING-UNIT-DESIGN-1/review-packet.json`.
- Repository generated indexes/checks are refreshed and valid.

## Stop Boundary

Stop if the work requires machine/external reference mutation, authored target
registry mutation, lesson-output generation, unit minting, product-route
adoption, or any Year 1 / CP-6 / Scale Gate closure claim. Those require
separate human-reviewed authority.
