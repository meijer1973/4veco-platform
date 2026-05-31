# Sprint GRAPH-UX-2: Screenshot Manifest

Generated: 2026-05-31

Manifest source:

- `reports/sprints/GRAPH-UX-2-screenshots/manifest.json`

Screenshot directory:

- `reports/sprints/GRAPH-UX-2-screenshots/`

## Cases

| Case | Theme | Viewport | Action | Screenshot | Evidence |
|---|---|---|---|---|---|
| desktop graph task shell | light | `1280 x 760` | none | `reports/sprints/GRAPH-UX-2-screenshots/desktop-light-113-graph-task-shell.png` | route panel, table task, and task shell visible |
| mobile route-first graph task | light | `390 x 844` | none | `reports/sprints/GRAPH-UX-2-screenshots/mobile-light-113-graph-route-first.png` | route panel appears before first task controls |
| desktop graph task shell | dark | `1280 x 760` | none | `reports/sprints/GRAPH-UX-2-screenshots/desktop-dark-113-graph-task-shell.png` | dark-mode route and table task readable |
| mobile graph feedback | dark | `390 x 844` | answer first task | `reports/sprints/GRAPH-UX-2-screenshots/mobile-dark-113-graph-feedback.png` | neutral matched feedback, visible feedback focus outline, and next-task action visible |

## Screenshot Inspection Notes

- Desktop light and dark screenshots show the shared route panel followed by a
  graph/table task and a task-shell control panel.
- Mobile light screenshot shows route context before the task shell, resolving
  the SKILLMAP-OP-1 mobile graph-orientation flag for this graph route.
- Mobile dark feedback screenshot shows neutral feedback in the task-shell
  feedback region, a visible focus outline, and `Volgende opgave` action
  without mastery, diagnostic, sequencing, summative, AI, PV, or
  target-equivalent completion copy.
- The graph/table task shell remains readable in light and dark modes.
- Dark-mode screenshots now show the correct `Lichte modus` toggle label when
  the rendered page is in dark mode.
- No screenshot shows internal MTU codes, generator IDs, PV labels, or
  prohibited product claims.

## Capture Command

```bash
node build-scripts/sprints/capture-graph-ux2-screenshots.js
```

Result:

```text
Captured 4 GRAPH-UX-2 screenshots in C:\Projects\4veco\4veco-platform\reports\sprints\GRAPH-UX-2-screenshots
```
