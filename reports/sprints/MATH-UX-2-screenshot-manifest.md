# Sprint MATH-UX-2: Screenshot Manifest

Generated: 2026-05-31

Status: screenshot proof complete before lead review.

## Capture Command

```bash
node build-scripts/sprints/capture-math-ux2-screenshots.js
```

Output directory:

`reports/sprints/MATH-UX-2-screenshots/`

Machine-readable manifest:

`reports/sprints/MATH-UX-2-screenshots/manifest.json`

## Required Screenshots

| Case | File | Proof |
|---|---|---|
| desktop light task shell | `reports/sprints/MATH-UX-2-screenshots/desktop-light-112-math-task-shell.png` | `A38` exercise opens as a shared `numeric_input` task-shell step. |
| mobile light route first | `reports/sprints/MATH-UX-2-screenshots/mobile-light-112-math-route-first.png` | Route panel, paragraph target, focus, and skill cards are readable before exercise start. |
| desktop dark task shell | `reports/sprints/MATH-UX-2-screenshots/desktop-dark-112-math-task-shell.png` | Dark-mode task shell fits inside the math exercise surface. |
| mobile dark feedback | `reports/sprints/MATH-UX-2-screenshots/mobile-dark-112-math-feedback.png` | Retry feedback appears in the labelled task feedback region without overlap. |

## Manifest Summary

The capture manifest records four cases with route text, shell text, task
family, feedback state where applicable, viewport size, and page dimensions.

Observed task family in task-shell captures: `numeric_input`.

Observed feedback state in mobile dark feedback capture:
`ts-feedback-card is-retry`.

## Visual Result

The route and task shell are legible on desktop and mobile in light and dark
mode. The mobile route-first capture shows the route panel before skill cards.
The exercise captures show the task shell unframed inside the skilltree
exercise card, avoiding a nested-card layout.
