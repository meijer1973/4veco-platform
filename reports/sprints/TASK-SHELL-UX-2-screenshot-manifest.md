# Sprint TASK-SHELL-UX-2: Screenshot Manifest

Generated: 2026-06-01

Status: screenshot and live-output proof complete before lead review.

## Capture Command

```bash
node build-scripts/sprints/capture-task-shell-ux2-screenshots.js
```

Output directory:

`reports/sprints/TASK-SHELL-UX-2-screenshots/`

Machine-readable manifest:

`reports/sprints/TASK-SHELL-UX-2-screenshots/manifest.json`

## In-App Browser Check

The in-app browser loaded the generated local Book 1 output from:

`http://127.0.0.1:56212/`

Rendered-output inspection confirmed:

- `1.1.2` exit-ticket page renders separate unit/notation fields and no
  `.ts-hints` content hints, pre-attempt `.ts-criteria` scaffolding, or
  answer-revealing placeholder examples.
- `1.1.2` math page opens the shared math task-shell route after selecting
  the A38 calculation card.
- `1.1.3` graph page renders the shared graph/table task shell.
- `1.1.2` reasoning page opens the structured reasoning task-shell mode.

The browser automation could inspect the rendered DOM, but screenshot capture
from that in-app tab timed out on this local target. Screenshots below were
therefore captured with the same headless Edge/CDP pattern used by earlier
sprints.

## Screenshot Cases

| Case | Theme | Viewport | Action | Screenshot | Evidence |
|---|---|---|---|---|---|
| desktop exit-ticket unit fields | light | `1280 x 760` | initial page | `reports/sprints/TASK-SHELL-UX-2-screenshots/desktop-light-112-exit-ticket-unit-fields.png` | 1.1.2 exit ticket shows work, final answer, and separate `Notatie` fields with neutral placeholders and no pre-attempt criteria bullets. |
| desktop math task shell | light | `1280 x 760` | open A38 card | `reports/sprints/TASK-SHELL-UX-2-screenshots/desktop-light-112-math-task-shell.png` | math route opens the shared task shell in the skilltree exercise flow. |
| desktop graph task shell | light | `1280 x 760` | initial graph task | `reports/sprints/TASK-SHELL-UX-2-screenshots/desktop-light-113-graph-task-shell.png` | graph/table route uses the shared task shell and labelled graph feedback region. |
| desktop reasoning task shell | light | `1280 x 760` | open structured reasoning mode | `reports/sprints/TASK-SHELL-UX-2-screenshots/desktop-light-112-reasoning-task-shell.png` | reasoning route opens the shared `structured_reasoning` shell. |
| mobile exit-ticket unit fields | light | `390 x 844` | initial page | `reports/sprints/TASK-SHELL-UX-2-screenshots/mobile-light-112-exit-ticket-unit-fields.png` | unit/notation fields remain visible and usable in narrow layout. |
| mobile exit-ticket task shell | dark | `390 x 844` | initial page | `reports/sprints/TASK-SHELL-UX-2-screenshots/mobile-dark-112-exit-ticket-task-shell.png` | dark-mode exit-ticket shell remains readable with unit/notation fields. |

## Inspection Notes

- The screenshots show rendered generated output, not source-only proof.
- Exit-ticket screenshots show no visible hints, no pre-attempt criteria
  scaffolding, no answer-revealing placeholders, and no internal MTU/PV labels.
- The `1.1.2` exit-ticket source and focused tests prove task 2 still accepts
  the compact answer `108` with correct calculation work.
- The math, graph, and reasoning screenshots show task-shell reuse across the
  three practice engines.
- Mobile screenshots show that the answer grid collapses without losing the
  unit/notation field.
- No screenshot authorizes diagnostics, adaptive routing, mastery,
  sequencing, summative use, student-facing AI, PV, Scale Gate 1, or
  product-wide use.
