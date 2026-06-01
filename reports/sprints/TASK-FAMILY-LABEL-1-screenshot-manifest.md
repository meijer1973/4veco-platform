# TASK-FAMILY-LABEL-1 Screenshot Manifest

Generated: 2026-06-01

Status: fixture proof ready, no generated lesson output changed.

## Scope

This sprint adds runtime support for the shared task-shell `label_placement`
family. The proof is fixture-based because no paragraph route adopts the family
yet.

## Fixture Evidence

- `reports/sprints/TASK-FAMILY-LABEL-1-rendered-fixture.html`
- standard light fixture with label bank, visual target region, target buttons,
  and placement summary
- narrow fixture substitute using `data-fixture-viewport="narrow"`
- dark fixture substitute using `data-fixture-theme="dark"`
- after-click fixture substitute using `data-fixture-state="after-click"`
- feedback fixture with `aria-label="Aanwijzingen bij je labels"`

## Keyboard And Screen-Reader Proof

- `TaskShellEngine.focusPlan()` returns label buttons, target buttons, and the
  placement summary.
- Label buttons carry readable `aria-label` text with label descriptions.
- Target buttons carry readable `aria-label` text with target descriptions.
- Placement summary uses `role="list"` and placed labels use `role="listitem"`.
- Feedback is rendered in a labelled region for screen-reader review.

## Boundary

No generated lesson output changed. No source-data adoption, target-equivalent
claim, diagnostics, adaptive routing, mastery, sequencing, summative use, PV,
Scale Gate 1, or student/product use is authorized by this fixture proof.

Generated-route screenshots remain future work for the first sprint that adopts
`label_placement` in paragraph source data and regenerates lesson output.
