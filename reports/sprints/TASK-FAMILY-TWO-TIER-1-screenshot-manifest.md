# TASK-FAMILY-TWO-TIER-1 Screenshot Manifest

Generated: 2026-06-02

Status: rendered report-fixture proof only; no generated lesson output.

## Fixture States

| State | Evidence | Notes |
|---|---|---|
| standard | `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html#standard` | Shows separate answer and reason option groups, two-tier selectors, and empty summary. |
| after-click | `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html#after-click` | Shows one selected answer and one selected reason with `aria-pressed="true"`. |
| feedback | `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html#feedback` | Shows one neutral practice-only feedback region for answer and reason status. |
| narrow | `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html#narrow` | Documents narrow/mobile layout expectation: two-tier columns collapse to one column through task-shell CSS. |
| dark | `reports/sprints/TASK-FAMILY-TWO-TIER-1-rendered-fixture.html#dark` | Documents dark-mode compatibility expectation for option groups, summary, and feedback styling. |

## Accessibility Proof

- Keyboard path: answer option buttons, reason option buttons, selected summary,
  check button in consuming wrappers, and one labelled feedback region.
- Screen-reader labels: answer and reason groups have explicit labels; selected
  summary uses `aria-label="Gekozen antwoord en reden"`; feedback region uses
  `aria-label="Aanwijzingen bij antwoord en reden"`.
- Pointer-only drag-and-drop is not required or used.

## Boundary Notes

- No generated lesson output was changed.
- No source exercise data was changed.
- No target-equivalent claim, diagnostics, mastery, sequencing, summative use,
  PV, Scale Gate 1, or product-wide use is authorized by this fixture.
- Generated-route screenshots remain deferred until a later adoption/product
  sprint and `GATE-TASK-FAMILY-1`.
- The old exit-ticket game archive remains separately tracked and unchanged.
