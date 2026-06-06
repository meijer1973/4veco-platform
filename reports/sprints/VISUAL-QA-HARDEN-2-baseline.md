# VISUAL-QA-HARDEN-2 Baseline

Generated: 2026-06-05

## Current State

`CHECK-SHORT-EXIT-2` remains held after direct human review:

```text
GATE-CHECK-SHORT-EXIT-2: REVISE
Gate direction: hold_for_surface_repair
Additional direction: replan before the next human gate
```

Completed repair evidence before this sprint:

- `CHECKSURFACE-RESET-1` recorded the product-quality reset and findings
  `CSR1-F1` through `CSR1-F5`.
- `GRAPH-CHECK-UX-1` repaired `1.1.3` advisory `Korte check` with graph/table
  task-shell interaction.
- `GRAPH-EXIT-UX-1` repaired `1.1.3` exit ticket with split source/task graph
  workspace proof.
- `CHECK-ROUTE-COPY-1` repaired landing-route copy so advisory and exit
  routes are visibly distinct.

## Baseline Evidence Inspected

- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/direct-review-comments.md`
- `reports/sprints/CHECKSURFACE-RESET-1-product-quality-audit.md`
- `reports/json/checksurface-reset1-quality-findings.json`
- `reports/sprints/GRAPH-CHECK-UX-1-visual-qa-report.md`
- `reports/json/graph-check-ux1-proof.json`
- `reports/sprints/GRAPH-CHECK-UX-1-screenshots/manifest.json`
- `reports/sprints/GRAPH-EXIT-UX-1-visual-qa-report.md`
- `reports/json/graph-exit-ux1-proof.json`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/manifest.json`
- `reports/sprints/CHECK-ROUTE-COPY-1-visual-qa-report.md`
- `reports/json/check-route-copy1-proof.json`
- `reports/sprints/CHECK-ROUTE-COPY-1-screenshots/manifest.json`
- `build-scripts/sprints/check-check-short-exit2.js`
- `references/reference-team-roadmap.md`

## Baseline Strengths

- `1.1.3` short-check source data now contains context blocks and three
  task-shell tasks.
- `1.1.3` short-check proof records graph workspace, visible grid, targeted
  retry feedback, route advice, mobile proof, and dark proof.
- `1.1.3` exit-ticket proof records source/task workspace, constrained
  scrollable source pane, sticky question strip, graph workspace, same
  workspace line drawing, held completion language, mobile proof, and dark
  proof.
- Landing proof records distinct advisory and exit cards across the first
  three paragraphs.

## Baseline Gaps This Sprint Must Close

- The visual QA evidence is split across three sprint reports.
- No single checker states that the earlier reset findings now fail
  automatically if they regress.
- The existing visual QA reports are useful but not yet a gate-facing rubric
  for `CHECK-SURFACE-PREGATE-1`.
- The future lead review still needs an explicit student-experience judgement
  requirement.

## No-Change Boundaries

Do not change generated lesson output in this sprint unless a checker reveals
real drift. Do not close or retry the human gate. Do not broaden product or
completion-language authority.
