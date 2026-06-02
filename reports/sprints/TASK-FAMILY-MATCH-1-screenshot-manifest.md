# TASK-FAMILY-MATCH-1 Screenshot Manifest

Generated: 2026-06-02

Status: rendered report-fixture proof only; no generated lesson output.

## Fixture States

| State | Evidence | Notes |
|---|---|---|
| standard | `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html#standard` | Shows two item banks, matching-specific selectors, accessible labels, and empty pair summary. |
| after-click | `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html#after-click` | Shows a selected pair with `data-match-paired-left-id`, `data-match-paired-right-id`, and remove control. |
| feedback | `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html#feedback` | Shows one neutral practice-only feedback region for missing items, misplaced pair, and distractors. |
| narrow | `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html#narrow` | Documents narrow/mobile layout expectation: item banks collapse to one column through task-shell CSS. |
| dark | `reports/sprints/TASK-FAMILY-MATCH-1-rendered-fixture.html#dark` | Documents dark-mode compatibility expectation for banks, pair summary, and feedback styling. |

## Accessibility Proof

- Keyboard path: left-bank buttons, right-bank buttons, pair summary, remove
  controls, clear control, and one labelled feedback region.
- Screen-reader labels: left and right item buttons include label plus
  description; feedback region uses `aria-label="Aanwijzingen bij je koppels"`.
- Pointer-only drag-and-drop is not required or used.

## Boundary Notes

- No generated lesson output was changed.
- No source exercise data was changed.
- No target-equivalent claim, diagnostics, mastery, sequencing, summative use,
  PV, Scale Gate 1, or product-wide use is authorized by this fixture.
- Generated-route screenshots remain deferred until a later adoption/product
  sprint and `GATE-TASK-FAMILY-1`.
- The old exit-ticket game archive remains separately tracked and unchanged.
