# GRAPH-EXIT-UX-1 Visual QA Report

Generated: 2026-06-05

## Surface Reviewed

Generated Book 1 page:

```text
1.1 Hoofdstuk Economisch denken en rekenen/1.1.3 Grafieken en tabellen/1.1.3 Grafieken en tabellen - exit-ticket.html
```

Screenshots:

- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-initial.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-source-scrolled.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-wrong-retry.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-line-confirmed.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-completed-held.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/mobile-initial.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/mobile-dark-completed-held.png`

## Findings

| Check | Status | Evidence |
|---|---|---|
| Source/task split visible on desktop | pass | Desktop initial screenshot shows source pane left and task pane right. |
| Source pane constrained and scrollable | pass | Proof JSON records constrained and scrollable source-pane metrics. |
| Task remains visible after source scroll | pass | `desktop-source-scrolled` records task pane visibility after source pane scroll. |
| Graph grid visible in first viewport | pass | Desktop initial screenshot shows graph workspace grid. |
| Same-workspace line drawing | pass | `desktop-line-confirmed` shows points and line in the active graph workspace. |
| Completed feedback visible | pass | `desktop-completed-held` and mobile dark completed screenshots show final feedback. |
| Completion language held | pass | Proof JSON records completion hidden after all three task checks match. |
| Mobile/dark proof | pass | Mobile light initial and mobile dark completed states are captured. |

## Residual Risk

This sprint repairs the exit-ticket graph/source workspace only. Route-choice
copy and visual-QA hard failures for the full retry packet remain in the next
named sprints.

