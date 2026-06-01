# TASK-FAMILY-SOURCE-1 Screenshot Manifest

Generated: 2026-06-01

Status: fixture proof only; no generated lesson output changed.

## Scope

`TASK-FAMILY-SOURCE-1` adds runtime-only shared task-shell support for
`source_value_selection` and `source_chain_builder`. This manifest records the
rendered fixture surfaces that stand in for screenshots in this bounded sprint.
Generated paragraph output, source exit-ticket data, route adoption, product
claims, diagnostics, mastery, sequencing, summative use, and Scale Gate 1 are
out of scope.

## Fixture

- `reports/sprints/TASK-FAMILY-SOURCE-1-rendered-fixture.html`

## Required States

| State | Evidence |
|---|---|
| standard | Fixture contains both task families with task-shell markers and feedback regions. |
| narrow | Fixture root records `data-fixture-viewport="narrow"`; CSS includes narrow source-value stacking. |
| dark | Fixture root records `data-fixture-theme="dark"` and uses theme variables through task-shell CSS. |
| after-click | Fixture root records `data-fixture-state="after-click"` and includes selected source value / selected chain node markers. |
| keyboard | Source-chain sequence is focusable with `tabindex="0"`; feedback regions are focusable with `tabindex="-1"`. |
| screen-reader | Source value bank, role selects, source-chain sequence, node bank, and feedback regions carry `role` or `aria-label` markers. |

## Boundary

No generated lesson output was refreshed for this sprint. The fixture proves
runtime rendering, keyboard/screen-reader markers, dark/narrow fixture state,
after-click state, and feedback state only.
