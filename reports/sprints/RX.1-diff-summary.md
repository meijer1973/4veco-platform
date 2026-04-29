# Sprint RX.1: Diff Summary

## Summary

RX.1 adds a non-mutating representation-operation inventory and review packet. It prepares candidate A61-A84 review material without changing the live unit catalog.

## Added

- deterministic inventory builder
- read-only inventory checker
- sprint plan, baseline, result, diff summary, and sprint result metadata
- provisional representation-operation inventory JSON
- JSON and Markdown inventory projections
- duplicate/overlap report
- proposed mutation queue
- `GATE-RX1-representation-unit-scope` review packet and bundle URLs
- archived roadmap snapshot for version `v2.8-s4.1-conditions-calibrated`

## Updated

- live roadmap moved to `v2.9-rx1-inventory-prepared`
- sprint ledger marks RX.1 complete through the review-packet stop point
- immediate next checkpoint is `GATE-RX1-representation-unit-scope`
- roadmap version index now points to the active v2.9 roadmap
- source manifest and document inventory were regenerated after adding RX.1 artifacts
- sprint bundle checker now accepts `RX.1` style sprint IDs

## Protected surfaces

No protected reference surfaces were changed.

RX.1 did not modify:

- `references/machine/`
- `references/external/`

The candidate queue is explicitly non-mutating and keeps `mutation_authorized: false`.

## Human review state

`GATE-RX1-representation-unit-scope` is prepared but not closed. RX.2 remains blocked until the human review answers are recorded and the gate closure is created.
