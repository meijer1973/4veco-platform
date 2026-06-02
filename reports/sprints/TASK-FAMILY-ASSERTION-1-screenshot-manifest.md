# TASK-FAMILY-ASSERTION-1 Screenshot Manifest

Generated: 2026-06-02

Status: report-fixture proof only; no generated lesson output changed.

## Fixture Source

- `reports/sprints/TASK-FAMILY-ASSERTION-1-rendered-fixture.html`

This sprint did not produce generated Book 1 route screenshots. The rendered
fixture is a source-controlled report artifact for lead review of the shared
task-shell family only.

## Covered States

| State | Evidence | Proof |
|---|---|---|
| standard | `#standard` | assertion card, reason card, relation option group, summary, single feedback target |
| narrow | `#narrow` | narrow/mobile behavior documented through shared CSS collapse for cards and feedback rows |
| dark | `#dark` | dark-mode proof uses shared task-shell theme variables; no light-only generated route was changed |
| after-click | `#after-click` | selected option state and summary update are represented |
| feedback | `#feedback` | one practice-only feedback block with selected and expected relation |

## Accessibility Notes

- Relation options are buttons with `aria-pressed`.
- The relation options live in a labelled `role="group"`.
- The summary has `tabindex="0"` and an explicit `aria-label`.
- Feedback remains in one labelled status region.
- Keyboard proof is represented through focus selectors and shared button
  controls; product-route keyboard proof is deferred to `GATE-TASK-FAMILY-1`.
- Screen-reader proof is represented by labelled assertion, reason, relation
  option group, selected summary, and feedback regions.

## Boundary Notes

- No generated lesson output changed.
- No source-data route adopted `assertion_reason`.
- No target-equivalent proof, diagnostics, misconception-profile,
  adaptive-routing, mastery, sequencing, summative, PV, Scale Gate 1, or
  product-wide authority is claimed.
- The tracked old exit-ticket archive remains unchanged:
  `knowledge/exit-ticket-game-1.1.1.zip`.

## Follow-Up

Generated-route screenshots and browser inspection are required before
`assertion_reason` is used in product routes, reasoning migration, check
implementation, first-three-paragraph product proof, or Scale Gate 1 reliance.
