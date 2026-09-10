# Sprint S9a: Diff Summary

## Summary

S9a applies the CP-5 D04 decision through CLI-only mutation and updates the reporting layer from unresolved D04 design status to retired-after-mutation status.

## Protected surfaces

`references/machine/micro-teaching-units.md` and `.json` changed only through `unit-deprecate.js`. D04 is now deprecated with replacement pointers to `A15`, `D06`, `A17`, `D11`, `A16`, `D12`, and `D27`.

No hand edits were made to `references/machine/` or `references/external/`. External exam-question data remains unchanged.

## Source cleanup

The single active authored target-exercise citation was removed from `references/authored/course-target-exercises.json` for target exercise `2.1.3`, which already retained the successor units.

## Reports

S9a adds mutation plan/log/audit artifacts, a read-only validator, resolved QC issue state for `R8-QC-007`, regenerated JSON/Markdown reports, reference health, RAG chunks/evals, source manifest, document inventory, URL index, and roadmap versioning.

## Boundaries

No D04 prerequisite edge was added. No exercise promotion, diagnostics, adaptive routing, mastery, sequencing, student-facing AI, summative use, PV projection, or PV machine promotion was authorized.
