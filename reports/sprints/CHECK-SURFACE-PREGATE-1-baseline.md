# CHECK-SURFACE-PREGATE-1 Baseline

Generated: 2026-06-05

## Starting State

Platform branch:

```text
codex/check-short-exit-2
```

Known prior state:

- `CHECKSURFACE-RESET-1` recorded the human `REVISE` decision and reset
  findings `CSR1-F1` through `CSR1-F5`.
- `GRAPH-CHECK-UX-1` repaired `1.1.3` advisory `Korte check` into graph/table
  task-shell interaction.
- `GRAPH-EXIT-UX-1` repaired `1.1.3` `Exit ticket` into a split source/task
  graph workspace.
- `CHECK-ROUTE-COPY-1` repaired first-three landing route copy.
- `VISUAL-QA-HARDEN-2` added product QA hard-fail checks but intentionally left
  the student-experience judgement to this pregate.

## Baseline Evidence Read

- `reports/sprints/CHECKSURFACE-RESET-1-product-quality-audit.md`
- `reports/json/checksurface-reset1-quality-findings.json`
- `reports/sprints/GRAPH-CHECK-UX-1-visual-qa-report.md`
- `reports/json/graph-check-ux1-proof.json`
- `reports/sprints/GRAPH-EXIT-UX-1-visual-qa-report.md`
- `reports/json/graph-exit-ux1-proof.json`
- `reports/sprints/CHECK-ROUTE-COPY-1-result.md`
- `reports/json/check-route-copy1-proof.json`
- `reports/sprints/VISUAL-QA-HARDEN-2-product-qa-report.md`
- `reports/json/visual-qa-harden2-proof.json`
- `reports/review-gates/GATE-CHECK-SHORT-EXIT-2-first-three-check-surfaces-review/review-packet.md`

## Screenshot Baseline

Inspected representative screenshots:

- `reports/sprints/CHECK-ROUTE-COPY-1-screenshots/desktop-113-check.png`
- `reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-initial.png`
- `reports/sprints/GRAPH-CHECK-UX-1-screenshots/desktop-route-advice.png`
- `reports/sprints/GRAPH-CHECK-UX-1-screenshots/mobile-dark-route-advice.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-initial.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-source-scrolled.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/desktop-line-confirmed.png`
- `reports/sprints/GRAPH-EXIT-UX-1-screenshots/mobile-dark-completed-held.png`

## Baseline Judgement

The prior hardening proof is strong enough for a pregate product packet, but
not enough by itself for the retry human gate. This sprint must add:

- a reviewer walkthrough;
- explicit student-experience judgement;
- proof that the retry packet may be prepared;
- a checker that blocks missing walkthrough/review evidence.

## Authority Boundary

No baseline artifact authorizes:

- product-route adoption;
- new completion language for `1.1.1` or `1.1.3`;
- diagnostics;
- mastery or sequencing;
- PV;
- Scale Gate 1;
- student/product use.

## Operational Next Step

Write the walkthrough, student-experience review, proof emitter, checker, and
lead-review artifacts for `CHECK-SURFACE-PREGATE-1`.
