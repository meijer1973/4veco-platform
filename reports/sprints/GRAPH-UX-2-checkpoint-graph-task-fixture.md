# Sprint GRAPH-UX-2: Checkpoint Graph Task Fixture

Generated: 2026-05-31

## Scope

This fixture record proves that checkpoint-style graph/table tasks can use the
same shared task-shell data and UI semantics as the `1.1.3` graph game.

This is not a published exit ticket and not target-equivalent paragraph proof.
No `source-data/book-*/exit-ticket/1.1.3.json` file was created or written, no
`1.1.3` exit-ticket page was generated, and no landing-page `Check` route was
authorized for `1.1.3`.

## Fixture Location

The non-published fixture lives inside the deterministic checker:

- `build-scripts/sprints/check-graph-ux2-route-output.js`

The fixture is intentionally embedded in the checker rather than promoted to
source data, because `L1.7B-Q2` and `GATE-L1.7B-Q2` own target-equivalent
checkpoint publication.

## Fixture Coverage

| Task | Shared task family | Interaction proof | Product boundary |
|---|---|---|---|
| `checkpoint-table` | `table_value_selection` | choice task rendered through `TaskShellUI.renderTask` | `targetReadinessEvidence: false` |
| `checkpoint-graph` | `graph_reading` | numeric graph-reading task rendered through `TaskShellUI.renderTask` | checkpoint-only fixture |
| `checkpoint-point` | `point_placement` | point input task rendered through `TaskShellUI.renderTask` | no completion or mastery claim |

The fixture metadata explicitly records:

```json
"metadataAlignment": {
  "status": "paragraph_skill_aligned_not_target_readiness",
  "targetReadinessEvidence": false
}
```

## Validation

The checker validates the fixture through the real runtime:

```bash
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Result:

```text
GRAPH-UX-2 route output OK (7 graph tasks; 5 required families)
```

The checker asserts that:

- `ExitTicketEngine.validateData(fixture)` passes;
- `ExitTicketUI.renderStaticHtml(fixture, {})` emits task-shell markers for
  `table_value_selection`, `graph_reading`, and `point_placement`;
- visible fixture text does not leak internal MTU, PV, or generator codes;
- visible fixture text does not claim target-equivalent completion, mastery,
  diagnostics, adaptive routing, summative use, AI, PV projection, or product
  use.

## Decision

GRAPH-UX-2 proves checkpoint-compatible graph task UI language only.

Target-equivalent `1.1.3` checkpoint implementation, completion copy, and any
student-facing `Check` route remain deferred to `L1.7B-Q2` and
`GATE-L1.7B-Q2`.
