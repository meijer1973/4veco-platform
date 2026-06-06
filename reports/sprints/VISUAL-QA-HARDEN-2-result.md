# VISUAL-QA-HARDEN-2 Result

Generated: 2026-06-05

## Status

Complete after visual/product QA proof hardening.

## Outcome

`VISUAL-QA-HARDEN-2` adds a consolidated visual/product QA layer for the
repaired first-three Check surfaces.

Added:

- a product QA rubric that maps `CHECKSURFACE-RESET-1` findings `CSR1-F1`
  through `CSR1-F5` to hard-fail guards;
- `reports/json/visual-qa-harden2-proof.json`;
- `reports/sprints/VISUAL-QA-HARDEN-2-product-qa-report.md`;
- `build-scripts/sprints/emit-visual-qa-harden2-proof.js`;
- `build-scripts/sprints/check-visual-qa-harden2.js`;
- required sprint planning, command-log, lead-review, and verification
  artifacts.

The new checker fails if:

- `1.1.3` advisory short check falls back to choice-only tasks;
- graph/table context, task shell, graph workspace, grid, targeted feedback,
  or route advice disappears from the short check;
- `1.1.3` exit ticket loses split source/task workspace, scrollable source
  pane, sticky question strip, same-workspace graph line, or held completion
  language;
- landing pages stop distinguishing advisory and exit routes;
- screenshot proof contains only files/pages and no DOM/product facts;
- future pre-gate evidence omits student-experience judgement.

## Validation

Passed after corrections:

```text
node build-scripts\sprints\emit-visual-qa-harden2-proof.js
node build-scripts\sprints\check-visual-qa-harden2.js
node build-scripts\sprints\check-graph-check-ux1.js
node build-scripts\sprints\check-graph-exit-ux1.js
node build-scripts\sprints\check-check-route-copy1.js
node build-scripts\sprints\check-check-short-exit2.js
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
npm.cmd run check:scope-language
npm.cmd run check:platform
npm.cmd run check:book -- "..\4veco-lessen\Boek 1 - Grondslagen, vraag en aanbod"
npm.cmd run agent:index
node build-scripts\sprints\emit-url-index.js
npm.cmd run dashboard:internal
node build-scripts\sprints\check-visual-qa-harden2.js
node build-scripts\reports\validate-report-json.js
node build-scripts\references\check-roadmap-version-index.js
node build-scripts\sprints\check-check-short-exit2.js
```

`npm.cmd run check:platform` exits 0 and still prints existing fixture warnings
for deliberately bad sample chapter/asset cases.

## Authority Boundary

This sprint does not authorize `GATE-CHECK-SHORT-EXIT-2-RETRY`, product-route
adoption, new completion language, diagnostics, mastery/sequencing, PV, Scale
Gate 1, broad product use, or student use.

## Required Next Action

Proceed to `CHECK-SURFACE-PREGATE-1`. Do not start the retry human gate until
the pregate sprint has passed and its evidence is pushed.
