# GRAPH-EXIT-UX-1 Baseline

Generated: 2026-06-05

## Current Blocker

`CHECKSURFACE-RESET-1` records the remaining `1.1.3` exit-ticket blocker:

- `1.1.3-exit-ticket` source data includes stronger graph/table task-shell
  tasks;
- the generated product renders all source context before the task flow;
- the graph task is therefore pushed below the first viewport on desktop;
- the result is context-first in data, but not yet a usable source/task
  graph workspace.

## Current Source Baseline

`source-data/book-1/exit-ticket/1.1.3-exit-ticket.json` currently contains:

- `surface: target_equivalent_exit_ticket`;
- `targetEquivalent.candidate: true`;
- `targetEquivalent.gateApproved: false`;
- `targetEquivalent.completionLanguageEligible: false`;
- four context blocks: source excerpt, table, formula, and flowchart;
- three task-shell tasks:
  - `graph_construction_substitute`;
  - `graph_reading`;
  - `calculation_work_capture` with `interval_halving_check`.

## Current Renderer Baseline

`engines/exit-ticket-ui.js` currently renders:

```text
hero
contextHtml
<section class="et-tasks">...</section>
completion
```

The screenshot `CHECK-SHORT-EXIT-2-screenshots/desktop-113-exit-ticket.png`
shows the source blocks visible, but no task or graph workspace visible in the
first viewport. This matches the human review blocker.

## Authority Baseline

- `1.1.2` exit ticket remains the only locally approved completion-language
  case.
- `1.1.1` and `1.1.3` exit-ticket completion language remains held.
- `1.1.3` may improve as a rendered candidate, but may not claim paragraph
  completion before the retry human gate.

