# CHECK-SURFACE-PREGATE-1 Product Walkthrough

Generated: 2026-06-05

## Status

PASS WITH FLAGS for retry-packet preparation.

This is a five-minute walkthrough for a reviewer preparing
`GATE-CHECK-SHORT-EXIT-2-RETRY`. It is not a gate closure and does not
authorize product-route adoption, new completion language, diagnostics,
mastery/sequencing, PV, Scale Gate 1, or student/product use.

## Walkthrough Path

### 1. Start On The `1.1.3` Landing Check Section

Open:

```text
reports/sprints/CHECK-ROUTE-COPY-1-screenshots/desktop-113-check.png
```

Expected observation:

- `Korte check` is marked as advice.
- `Exit ticket` is marked as end check.
- Action copy distinguishes `Krijg oefenadvies` from `Maak eindcheck`.
- The student can tell that the short check is not target-equivalent proof.

Evidence:

- `reports/json/check-route-copy1-proof.json`
- `reports/sprints/CHECK-ROUTE-COPY-1-screenshots/desktop-113-check.png`

### 2. Inspect The `1.1.3` Advisory Short Check

Open:

```text
reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-initial.png
reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-route-advice.png
```

Expected observation:

- The source text and table are visible before the tasks.
- Task 1 asks the student to start a P-Q graph, choose axes, place table
  points, and draw the line.
- The graph workspace has a visible grid and table-derived tick values.
- The short check is not ordinary multiple choice.
- Correct completion gives route advice rather than target-readiness language.

Evidence:

- `reports/json/graph-check-ux1-proof.json`
- `reports/sprints/GRAPH-CHECK-UX-1-visual-qa-report.md`

### 3. Inspect The `1.1.3` Exit Ticket Initial State

Open:

```text
reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-initial.png
```

Expected observation:

- Source material is on the left.
- The active question and graph task are on the right.
- The graph task starts the exit ticket.
- The graph workspace has a readable grid.

Evidence:

- `reports/json/graph-exit-ux1-proof.json`
- `reports/sprints/GRAPH-EXIT-UX-1-visual-qa-report.md`

### 4. Scroll Source Material Without Losing The Task

Open:

```text
reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-source-scrolled.png
```

Expected observation:

- The source pane is independently scrollable.
- The task pane remains visible after source scrolling.
- The task strip still tells the reviewer what the student is doing.

Evidence:

- `reports/json/graph-exit-ux1-proof.json: task_visible_after_source_scroll=true`

### 5. Confirm Same-Workspace Graph Action

Open:

```text
reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-line-confirmed.png
```

Expected observation:

- The line appears inside the same graph workspace where the points were
  clicked.
- There is no separate completed-graph block.
- Feedback confirms the graph setup and routes continued practice.

Evidence:

- `reports/json/graph-exit-ux1-proof.json: correct_path_draws_line=true`
- `build-scripts/sprints/check-check-short-exit2.js`

### 6. Confirm Mobile And Dark Reviewability

Open:

```text
reports/sprints/GRAPH-CHECK-UX-1-screenshots/mobile-dark-route-advice.png
reports/sprints/GRAPH-EXIT-UX-1-screenshots/mobile-dark-completed-held.png
```

Expected observation:

- The repaired short-check and exit-ticket surfaces remain readable in mobile
  dark mode.
- The exit ticket can reach task success while completion language remains
  held for `1.1.3`.

Evidence:

- `reports/json/graph-check-ux1-proof.json`
- `reports/json/graph-exit-ux1-proof.json`

## Product Packet Judgement

The product packet is green for retry-gate preparation because the earlier
surface blockers are now inspectable as real student actions:

- route distinction is visible;
- graph/table interaction exists in the short check;
- source/task graph workspace exists in the exit ticket;
- targeted feedback and next action exist;
- mobile and dark states are captured.

## Carried Flags

- This walkthrough is not direct human review for the retry gate.
- `1.1.1` and `1.1.3` completion language remains held.
- `1.1.2` retains only its prior local, non-summative completion-language
  authority.
- The next action is preparing `GATE-CHECK-SHORT-EXIT-2-RETRY`, not Scale Gate
  work.
