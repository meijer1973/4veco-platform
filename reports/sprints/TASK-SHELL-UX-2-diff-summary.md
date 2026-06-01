# Sprint TASK-SHELL-UX-2: Diff Summary

Generated: 2026-06-01

## Platform implementation

- Added `unitNotation` validation, matching, focus-plan, and response
  collection support for calculation-work task-shell tasks.
- Added separate rendered unit/notation inputs, answer-grid CSS, collapsed
  hint rendering, and feedback action styling.
- Updated exit-ticket rendering to remove duplicate embedded feedback regions,
  focus the local feedback region after checking, suppress pre-attempt
  criteria in target-equivalent exit-ticket display mode, and neutralize
  answer-revealing placeholders.
- Updated skilltree/math and graph wrappers to collect the unit/notation field
  and keep duplicate feedback regions removed.

## Source data

- Narrowly updated `source-data/book-1/exit-ticket/1.1.2.json` calculation
  interactions with final-answer and unit/notation UI labels/placeholders plus
  optional notation matching.
- Kept task 2 acceptance for compact `108` with correct work and blank
  optional notation.
- No `1.1.1` target-equivalent status and no `1.1.3` exit-ticket source were
  created.

## Tests and proof

- Added focused Jest coverage for required and optional unit/notation matching,
  task 2 `108` acceptance, wrong `%` notation rejection, hidden criteria,
  neutral exit-ticket placeholders, collapsed hints, wrapper collection, and
  feedback/action markup.
- Added `build-scripts/sprints/check-task-shell-ux2.js`.
- Added `build-scripts/sprints/capture-task-shell-ux2-screenshots.js`.
- Added screenshot proof for desktop/mobile/dark exit-ticket states and
  desktop math/graph/reasoning task-shell surfaces.

## Generated output

Generated Book 1 output changed only through:

```bash
node scripts/deploy.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Affected generated files are shared runtime/data files under:

`../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod/shared/`

## Protected Surfaces

`references/machine/` and `references/external/` were not changed.
`references/authored/course-target-exercises.json`,
`references/data/exam-ingestion/answer-skill-candidates.json`, target-exercise
registry fields, and `source-data/book-1/exit-ticket/1.1.3.json` were not
created or changed by this sprint.

## Governance

No protected reference mutation, target-exercise registry write, candidate
storage write, generated-output hand edit, diagnostics, adaptive routing,
mastery/sequencing, summative use, PV, CP-6/Year-1 promotion, Scale Gate 1, or
product-wide use was authorized.
