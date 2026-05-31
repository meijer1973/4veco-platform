# GATE-ENGINE-1 Live Output Evidence

Generated: 2026-05-31

Status: packet evidence for human review; no product authority.

## Scope

This evidence summarizes the current generated Book 1 output that
`GATE-ENGINE-1` must inspect. It does not regenerate lesson output and does
not authorize product use.

## Current Student Routes

| Paragraph | Student-visible route | Current task-shell proof | Boundary |
|---|---|---|---|
| `1.1.1` Schaarste en economisch denken | Landing has route cards; reasoning route shows the visible route panel; current short check exists as `Korte check` | Reasoning route uses `structured_reasoning` through the shared task shell | Short check remains advisory only; no target-equivalent proof |
| `1.1.2` Percentages en indexcijfers | Landing exposes reasoning, calculation, and graph/table routes; calculation route is primary for `A38` and `A39` | Math route uses `numeric_input`, `calculation_work_capture`, `final_answer_entry`, and `unit_notation_field` task-shell families | No `1.1.2` target-equivalent exit-ticket page or source data |
| `1.1.3` Grafieken en tabellen | Landing exposes reasoning, calculation, and graph/table routes; graph route is the strongest reference pattern | Graph route uses table-value selection, graph reading, axis convention, interpolation, point placement, graph construction substitute, and calculation/work capture through the shared shell | No `1.1.3` target-equivalent exit-ticket page or source data |

## Live Route Validators

These validators are the current deterministic proxy for generated-output
health before the human reviewer opens the live pages:

```bash
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-math-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
node build-scripts/sprints/check-reason-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Expected current results:

```text
GRAPH-UX-2 route output OK (7 graph tasks; 5 required families)
MATH-UX-2 route output OK (8 A38/A39 task-shell steps; 4 required families)
REASON-UX-2 route output OK (3 reasoning pages; six modes; structured_reasoning task shell)
```

## Evidence Reports To Inspect

- `reports/sprints/GAME-ARCH-1-student-path-trace.md`
- `reports/sprints/GRAPH-UX-2-student-route-proof.md`
- `reports/sprints/MATH-UX-2-student-route-proof.md`
- `reports/sprints/REASON-UX-2-student-route-proof.md`
- `reports/sprints/SKILLMAP-OP-1-student-route-proof.md`
- `reports/sprints/GRAPH-UX-2-screenshot-manifest.md`
- `reports/sprints/MATH-UX-2-screenshot-manifest.md`
- `reports/sprints/REASON-UX-2-screenshot-manifest.md`
- `reports/sprints/SKILLMAP-OP-1-screenshot-manifest.md`

## Architecture Evidence To Compare Against Live Output

- `reports/sprints/GAME-ARCH-2-architecture-map.md`
- `reports/sprints/GAME-ARCH-2-route-api.md`
- `reports/sprints/GAME-ARCH-2-task-shell-api.md`
- `reports/sprints/GAME-ARCH-2-file-disposition.md`
- `reports/sprints/GAME-ARCH-2-state-ownership.md`
- `reports/sprints/GAME-ARCH-2-feedback-ownership.md`
- `reports/sprints/GAME-ARCH-2-target-operation-coverage.md`
- `reports/sprints/GAME-ARCH-2-gate-engine1-checklist.md`

## Required Human Inspection

The human review must inspect rendered output, not only this evidence summary.
At minimum, inspect:

- the `1.1.1` landing page, reasoning route, and short check;
- the `1.1.2` landing page and math/calculation route;
- the `1.1.3` landing page and graph/table route;
- one reasoning route with `Redeneerantwoord opbouwen`;
- feedback and next-action copy after a task response where feasible.

## Known Boundaries

- Current output is practice-route proof, not target-equivalent exit-ticket
  proof.
- The short check may provide local advice but may not claim paragraph
  completion.
- No `1.1.2` or `1.1.3` target-equivalent exit-ticket page is published.
- No current gate evidence authorizes diagnostics, adaptive routing, mastery,
  sequencing, student-facing AI, summative use, PV projection, PV machine
  promotion, Scale Gate 1, or student/product use.
