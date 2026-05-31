# Sprint GRAPH-UX-2: Planning Review

Generated: 2026-05-31

Plan: `reports/sprints/GRAPH-UX-2-plan.md`

Reviewer: Planning/review subagent `Sagan`.

## Review stance

Planning review checks whether GRAPH-UX-2 can satisfy the product
specification without weakening the shared task-shell requirement or creating
hidden checkpoint/product authority.

## Findings

| Check | Verdict | Notes |
|---|---|---|
| Roadmap authority exists | PASS | Platform and lesson roadmaps name GRAPH-UX-2 as the active next sprint after SKILLMAP-OP-1. |
| Shared task-shell use is mandatory | PASS | Plan requires live generated `1.1.3` output to load and render the GAME-UX-3A task shell, not just mention it in data. |
| Required graph/table task families are concrete | PASS | Plan names table-value selection, graph reading, axis convention, interpolation, point placement or graph-construction substitute, and less-labelled variants. |
| Checkpoint boundary is preserved | PASS | Plan allows checkpoint-compatible graph task proof but forbids publishing a new `1.1.3` target-equivalent checkpoint or exposing `Check` as completion proof. |
| Rendered-output proof is required | PASS | Plan requires generated-output checks, screenshots, student-experience review, accessibility review, and lead review. |
| Generated-output route is safe | PASS | Plan allows generated Book 1 automated output only through platform deploy/build commands and forbids hand patches. |
| Protected references remain blocked | PASS | `references/machine/`, `references/external/`, target-exercise mappings, and candidate storage are forbidden. |
| Product-use claims remain blocked | PASS | Plan blocks target-equivalent proof, diagnostics, adaptive routing, mastery, sequencing, summative use, AI, PV, Scale Gate 1, and student/product use. |

## Required tightening accepted

The planning subagent recommended adding focused graph data validation and a
Book 1 validation command to the acceptance stack. The plan and plan metadata
now include:

- `engines/tests/graphical-data.test.js`
- `npm.cmd run check:book -- "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"`

## Stop risks

- Stop if the graph game keeps its custom controls and only copies task-shell
  wording.
- Stop if checkpoint-style graph proof implies that a student can complete the
  paragraph target exercise.
- Stop if generated Book output requires hand patching.
- Stop if the landing page exposes a new `Check` route without reviewed
  checkpoint status.
- Stop if interpolation or less-labelled variants make the graph inaccessible
  or under-instructed.

## Decision

Proceed with GRAPH-UX-2 implementation as planned.

The main implementation risk is shallow integration. The graph page must show
real task-shell task markup and feedback state in generated output. If that
cannot be achieved cleanly, pause for a GAME-ARCH-1/rebuild decision instead
of closing GRAPH-UX-2 as paperwork.
