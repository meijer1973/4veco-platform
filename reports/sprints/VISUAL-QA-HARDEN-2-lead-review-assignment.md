# VISUAL-QA-HARDEN-2 Lead Review Assignment

Generated: 2026-06-05

## Assignment

Review whether `VISUAL-QA-HARDEN-2` creates a sufficient pre-gate visual and
student-product QA layer for the repaired first-three Check surfaces.

## Evidence To Inspect

- `reports/sprints/VISUAL-QA-HARDEN-2-plan.md`
- `reports/sprints/VISUAL-QA-HARDEN-2-baseline.md`
- `reports/sprints/VISUAL-QA-HARDEN-2-product-qa-rubric.md`
- `reports/json/visual-qa-harden2-proof.json`
- `reports/sprints/VISUAL-QA-HARDEN-2-product-qa-report.md`
- `build-scripts/sprints/emit-visual-qa-harden2-proof.js`
- `build-scripts/sprints/check-visual-qa-harden2.js`
- prior proof from `GRAPH-CHECK-UX-1`, `GRAPH-EXIT-UX-1`, and
  `CHECK-ROUTE-COPY-1`
- `references/reference-team-roadmap.md`

## Review Questions

1. Does the checker hard-fail the original `CHECKSURFACE-RESET-1` product
   findings rather than only checking files?
2. Does the proof require graph/table interaction for `1.1.3` short check?
3. Does the proof require split source/task workspace for `1.1.3` exit ticket?
4. Does the proof require DOM/product inspection facts in screenshot evidence?
5. Does the proof require later student-experience judgement before the retry
   gate?
6. Does the sprint preserve all authority boundaries?

## Boundary

This lead review cannot close the human gate or authorize product use. It can
only decide whether this QA-hardening sprint is complete enough to proceed to
`CHECK-SURFACE-PREGATE-1`.
