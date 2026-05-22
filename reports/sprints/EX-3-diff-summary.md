# Sprint EX-3: Diff Summary

## Summary

EX-3 adds an internal exam-ingestion coverage report that projects the EX-1
pilot items through the reviewed GATE-EX2 classifications.

The sprint is reporting-only. It records coverage and blockers, but does not
authorize mutation or downstream lesson/student use.

## Added report

- `reports/json/exam-ingestion-coverage.json`
- `reports/markdown/exam-ingestion-coverage.md`

The report records:

- three EX-1 pilot exam items;
- eight reviewed GATE-EX2 classifications;
- q3 `A61` support and stale/incorrect `A15` note;
- q19 `A42` and `D10` support, `A45` weak-support note, and blocking
  source/graph gaps;
- q3/q15 `answer_skill_need` classifications;
- q19 blocked lesson-handoff status;
- proof required before later mapping, handoff, or mutation work.

## Validator changes

- Added `build-scripts/references/check-exam-ingestion-coverage.js`.
- Added `exam-ingestion-coverage` to the normalized report contract.
- Added EX-3 coverage fields and boundary checks to `reference-health`.

## Generated-map refresh

Refreshed normal report, dashboard, inventory, registry, URL-index, and
GitHub-agent index outputs so off-site review surfaces can see the EX-3 report.

## Protected surfaces

No protected reference data changed. EX-3 did not edit `references/external/`,
`references/machine/`, authored target exercises, owned blueprints, or lesson
output.

## Closure boundary

EX-3 does not close CP-6 or Year 1. It does not authorize protected reference
mutation, external-source mutation, unit minting, operation-registry mutation,
answer-skill mutation, target-exercise promotion, placeholder finalization,
lesson-output mutation, diagnostics, adaptive routing, mastery decisions,
automatic sequencing, student-facing AI, summative use, PV projection, PV
machine promotion, or student-facing output.

## Next step

Proceed to final EX-3 lead-review recheck, roadmap bookkeeping, complete-bundle
validation, commit, tag, and push.
