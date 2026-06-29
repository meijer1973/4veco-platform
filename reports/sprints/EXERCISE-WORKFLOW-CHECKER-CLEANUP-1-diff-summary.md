# Sprint EXERCISE-WORKFLOW-CHECKER-CLEANUP-1: Diff Summary

Generated: 2026-06-29

## Summary

This diff repairs stale checker and active-evidence references after the
exit-ticket source split. It replaces old active references to unsuffixed
`1.1.x.json` / `1.1.x.js` exit-ticket files with current suffixed short-check
and exit-ticket paths, and adds a deterministic sweep to keep that contract
from drifting again.

## Changed areas

- Live sprint checkers now validate current split source files and current
  generated lesson output paths.
- L1.7B-Q2 copy/implementation/D31 checkers now prove completion language is
  still held for first-three exit tickets while target-equivalent flags remain
  gated.
- Route-output checkers now treat current exit-ticket pages as valid rendered
  evidence and legacy unsuffixed files as absent.
- Active report JSON and procedure-visual inventory cite existing current
  paths.
- The L1.7B-Q2 review-packet checker verifies required evidence paths exist
  before accepting packet references.
- `build-scripts/sprints/check-exercise-workflow-checker-cleanup.js` adds the
  sprint-specific stale-path and forbidden-surface sweep.

## Protected surfaces

No protected surfaces changed:

- `source-data/book-1/exit-ticket/`
- `source-data/book-1/reasoning/`
- `engines/`
- `references/machine/`
- `references/external/`
- `references/authored/course-target-exercises.json`
- `references/data/exam-ingestion/answer-skill-candidates.json`
- `../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod`

The cleanup checker and lesson diff hygiene both verify those boundaries.

## Not included

- No generated lesson output PR is needed.
- No route migration is included.
- No target-readiness or completion-language flag mutation is included.
- No product-route adoption, diagnostics, mastery/sequencing, PV, Scale Gate 1,
  summative use, broad product use, or student/product use is authorized.
