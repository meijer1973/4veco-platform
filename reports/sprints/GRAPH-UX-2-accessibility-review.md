# Sprint GRAPH-UX-2: Accessibility Review

Generated: 2026-05-31

Reviewer: Accessibility subagent `Pasteur`.

## Scope

Review desktop/mobile, light/dark, keyboard/focus behavior, feedback
announcement, text overflow/overlap, internal-code leakage, and safe local
feedback language for the GRAPH-UX-2 graph/table route.

## Evidence Inspected

- `reports/sprints/GRAPH-UX-2-plan.md`
- `reports/sprints/GRAPH-UX-2-screenshots/manifest.json`
- `reports/sprints/GRAPH-UX-2-screenshots/desktop-light-113-graph-task-shell.png`
- `reports/sprints/GRAPH-UX-2-screenshots/mobile-light-113-graph-route-first.png`
- `reports/sprints/GRAPH-UX-2-screenshots/desktop-dark-113-graph-task-shell.png`
- `reports/sprints/GRAPH-UX-2-screenshots/mobile-dark-113-graph-feedback.png`
- `engines/task-shell.css`
- `engines/graphical.css`
- `engines/task-shell-ui.js`
- `engines/graphical-ui.js`
- generated `../4veco-lessen/.../shared/task-shell-ui.js`
- generated `../4veco-lessen/.../shared/graphical-ui.js`
- generated `../4veco-lessen/.../shared/graphical/1.1.3.js`
- focused UI tests and GRAPH-UX-2 route checker evidence

## Round 1 Verdict

REVISE

## Round 1 Blocking Findings

| Finding | Resolution |
|---|---|
| Task-shell feedback was visually rendered outside the active `aria-live` feedback path, so screen-reader announcement was not proven. | Repaired by rendering graph feedback in a labelled active region: `id="g-task-feedback"`, `aria-live="polite"`, `role="status"`, `aria-label="Feedback op je antwoord"`, `tabindex="-1"`. |
| After `Controleer`, the graph UI re-rendered without moving focus to the feedback or next action. | Repaired by moving focus to `#g-task-feedback` after checking. |
| Choice state used `aria-pressed="true"` only for selected buttons and removed the attribute on unselected buttons. | Repaired by initializing options with `aria-pressed="false"` and resetting unselected options to `"false"`. |
| Dark-mode screenshot evidence showed the wrong toggle label after forced theme changes. | Repaired by syncing the capture script toggle label after setting the theme. |

## Round 2 Verdict

PASS

## Round 2 Evidence

Focused tests:

```bash
npx.cmd jest --runInBand --runTestsByPath engines/tests/graphical-ui.test.js engines/tests/task-shell-ui.test.js
```

Result: passed.

Generated-output route checker:

```bash
node build-scripts/sprints/check-graph-ux2-route-output.js "../4veco-lessen/Boek 1 - Grondslagen, vraag en aanbod"
```

Result:

```text
GRAPH-UX-2 route output OK (7 graph tasks; 5 required families)
```

Live browser focus proof:

```json
{
  "activeElementId": "g-task-feedback",
  "feedbackRole": "status",
  "feedbackLive": "polite",
  "feedbackLabel": "Feedback op je antwoord",
  "consoleErrors": []
}
```

## Round 2 Findings

- Prior feedback-announcement blocker is repaired.
- Prior keyboard-flow blocker is repaired.
- Choice pressed-state handling is deterministic.
- `paragraaf-check` wording is gone from inspected source, deployed output,
  and manifest text.
- Recaptured dark screenshots show the correct `Lichte modus` toggle label.
- Mobile dark feedback screenshot shows visible focus on the feedback region,
  with no overlap or text overflow.
- Route and feedback language remains local/non-diagnostic and free of
  internal MTU, GEN, ANS, or PV code leakage.

## Remaining Flags

None.

## Required Next Action

Record accessibility round 2 as PASS in the GRAPH-UX-2 lead-review cycle and
continue to sprint closure validation.
