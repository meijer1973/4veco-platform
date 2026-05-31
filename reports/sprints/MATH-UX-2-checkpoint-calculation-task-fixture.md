# Sprint MATH-UX-2: Checkpoint Calculation Task Fixture

Generated: 2026-05-31

Status: non-published fixture proof only.

## Scope

This fixture proves that checkpoint-style calculation tasks can use the same
GAME-UX-3A task-shell language as the live `1.1.2` math route.

It does not publish a `1.1.2` exit ticket, does not create
`source-data/book-1/exit-ticket/1.1.2.json`, and does not claim
target-equivalent paragraph completion.

## Fixture Families

The generated-output checker builds an in-memory `ExitTicketEngine` fixture
with `targetReadinessEvidence: false` and renders it through `ExitTicketUI`.
The fixture includes:

- `numeric_input`: calculate `nieuw min oud`;
- `calculation_work_capture`: show formula, values, and final answer;
- `final_answer_entry`: enter an answer with percentage notation;
- `unit_notation_field`: identify percentage notation.

## Validation

Passed:

```bash
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

The checker verifies that the fixture validates through `ExitTicketEngine`,
renders `data-task-family` markers through `ExitTicketUI`, avoids visible
internal codes, avoids target-equivalent completion claims, and keeps
`targetReadinessEvidence: false`.

## Boundary

No student-facing `Check` route for `1.1.2` was generated. L1.7B-Q2 and
GATE-L1.7B-Q2 remain the owners of target-equivalent checkpoint implementation
and completion language.
