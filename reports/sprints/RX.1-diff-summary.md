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
- `GATE-RX1-representation-unit-scope` human interview and gate closure
- archived roadmap snapshot for version `v2.8-s4.1-conditions-calibrated`
- archived roadmap snapshot for version `v2.9-rx1-inventory-prepared`

## Updated

- live roadmap moved to `v2.10-rx1-gate-closed`
- sprint ledger marks RX.1 and GATE-RX1 complete
- immediate next sprint is RX.2 bounded planning and mutation review
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

`GATE-RX1-representation-unit-scope` is closed as `pass_with_conditions`. RX.2 planning is authorized for the bounded first lane only. Direct mutation remains blocked until explicit RX.2 mutation review and CLI-backed execution.
