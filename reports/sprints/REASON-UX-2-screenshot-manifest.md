# Sprint REASON-UX-2: Screenshot Manifest

Generated: 2026-05-31

Source manifest: `reports/sprints/REASON-UX-2-screenshots/manifest.json`

## Required Evidence

| Case | File | Proof |
|---|---|---|
| Desktop light reasoning task shell | `reports/sprints/REASON-UX-2-screenshots/desktop-light-111-reasoning-task-shell.png` | `1.1.1` route panel, sixth mode, `structured_reasoning` task shell, neutral criteria before checking. |
| Mobile light reasoning feedback | `reports/sprints/REASON-UX-2-screenshots/mobile-light-111-reasoning-feedback.png` | `1.1.1` mobile self-check feedback plus example route. |
| Desktop dark reasoning task shell | `reports/sprints/REASON-UX-2-screenshots/desktop-dark-112-reasoning-task-shell.png` | `1.1.2` dark-mode reasoning task shell with readable prompt and criteria. |
| Mobile dark reasoning feedback | `reports/sprints/REASON-UX-2-screenshots/mobile-dark-113-reasoning-feedback.png` | `1.1.3` mobile dark self-check feedback plus example route and visible route panel. |

## Visual QA Notes

- The task-shell heading color was repaired after the first dark-mode capture
  showed low contrast from the global reasoning heading rule.
- Pre-check criteria were made generic so students see the method, not raw CSV
  wording.
- The duplicate self-check feedback in the global panel was removed; the task
  now holds local self-check feedback and the global panel holds the example
  route.

## Status

PASS for REASON-UX-2 screenshot proof. The mobile route is long after feedback,
but the order is coherent: problem, task, self-check, example route, next
button, then sidebar route/progress panels.
