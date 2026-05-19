# Sprint REF-CT0: Diff Summary

## Summary

REF-CT0 adds a non-authoritative v5-aware planning prototype and MTU classification packet, then moves the references roadmap from REF-CT0 active to REF-CT1 active.

## Protected surfaces

No protected surfaces changed. `references/machine/` and `references/external/` were read as inputs only and were not mutated by hand or CLI.

## Planning artifacts

New report-side artifacts under `reports/reference-planning/` record the source boundary, three-year prototype, MTU classification, and REF-CT1 candidate-review packet. The JSON mirror under `references/data/sprints/` records 311 classification records with `authority_level: non_authoritative_planning_prototype` and `protected_reference_data_changed: false`.

## Tooling

Added a report-side REF-CT0 artifact builder and read-only validator. The sprint bundle checker now accepts the official `REF-CT0` sprint id shape.

## Roadmap and maps

The live roadmap is now v2.46, REF-CT0 is in Closed Sprints, REF-CT1 is the active top ledger row, and the v2.45 roadmap snapshot is archived. Repository maps and GitHub-facing indexes were refreshed.

## Boundaries

No target exercises were edited. No units were minted. No rough blueprint prose was promoted to owned curriculum authority. No diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, PV machine promotion, or student-facing generated output was authorized.
